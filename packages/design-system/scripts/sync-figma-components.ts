#!/usr/bin/env tsx
import { config } from "dotenv";
import { resolve } from "path";
// Load .env from monorepo root (2 levels up from packages/design-system/scripts/)
config({ path: resolve(__dirname, "../../../.env") });

// ─── Figma → Design System Component Sync ───────────────────
//
// This script detects changes in Figma components and uses
// OpenAI to update the corresponding React/shadcn components
// in the design system package.
//
// Usage:
//   pnpm --filter @martech/design-system sync             # Full sync
//   pnpm --filter @martech/design-system sync:check       # Dry run (show diff only)
//   pnpm ds:sync                                          # From monorepo root
//
// What it does:
//   1. Fetches component metadata from Figma (component sets, variants, styles)
//   2. Compares against the local sync manifest (.figma-sync-manifest.json)
//   3. For each changed/new component, calls OpenAI to generate updated code
//   4. Writes the updated component files and rebuilds the barrel export
//   5. Updates design tokens if colours/typography/spacing changed
//   6. Saves the updated manifest

import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type {
  FigmaComponentMapping,
  SyncManifest,
  SyncDiff,
} from "../src/types/figma-component.types";

// ─── Config ─────────────────────────────────────────────────

const FIGMA_API_BASE = "https://api.figma.com/v1";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const DS_ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(DS_ROOT, ".figma-sync-manifest.json");
const COMPONENTS_DIR = path.join(DS_ROOT, "src/components/ui");
const DOCS_DIR = path.join(DS_ROOT, "src/docs");
const TOKENS_PATH = path.join(DS_ROOT, "src/tokens/design-tokens.ts");
const INDEX_PATH = path.join(DS_ROOT, "src/index.ts");

const DRY_RUN = process.argv.includes("--dry-run");

// ─── Figma API ──────────────────────────────────────────────

async function figmaFetch<T>(endpoint: string): Promise<T> {
  const token = process.env.FIGMA_API_TOKEN;
  if (!token) throw new Error("FIGMA_API_TOKEN is not set");

  const res = await fetch(`${FIGMA_API_BASE}${endpoint}`, {
    headers: { "X-FIGMA-TOKEN": token },
  });
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

interface FigmaFileComponents {
  meta: {
    components: Array<{
      key: string;
      name: string;
      node_id: string;
      description: string;
      containing_frame?: { name: string };
    }>;
    component_sets: Array<{
      key: string;
      name: string;
      node_id: string;
      description: string;
    }>;
  };
}

interface FigmaFileResponse {
  name: string;
  version: string;
  lastModified: string;
  document: {
    id: string;
    name: string;
    type: string;
    children: any[];
  };
  styles: Record<string, { key: string; name: string; styleType: string }>;
}

// ─── OpenAI Code Generation ─────────────────────────────────

async function generateComponentCode(
  componentName: string,
  figmaData: any,
  existingCode: string | null
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const model = process.env.OPENAI_MODEL || "gpt-4o";

  const systemPrompt = `You are an expert React/TypeScript developer maintaining a design system.
You generate shadcn/ui-style components that follow these conventions:

1. Use React.forwardRef for all components
2. Use class-variance-authority (cva) for variant management
3. Use the cn() utility from "../lib/utils" for class merging
4. Import from @radix-ui primitives where applicable
5. Export the component, its variants type, and its props interface
6. Use Tailwind CSS utility classes with the shadcn colour system
7. Components must be fully accessible (ARIA, keyboard navigation)
8. Include JSDoc comments on the component and its props

Return ONLY the TypeScript/React source code. No markdown fences, no explanation.`;

  const userPrompt = existingCode
    ? `Update this existing component based on the new Figma design data.

EXISTING CODE:
${existingCode}

NEW FIGMA DATA:
${JSON.stringify(figmaData, null, 2)}

Keep the same API surface (exports, prop names) but update styles, variants, and visual properties to match the new design. Return the complete updated file.`
    : `Create a new shadcn/ui-style component called "${componentName}" based on this Figma data:

${JSON.stringify(figmaData, null, 2)}

Follow the shadcn/ui pattern exactly. Return the complete file.`;

  const res = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_completion_tokens: 8000,
      temperature: 0.1,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI API ${res.status}: ${await res.text()}`);

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string | null } }>;
  };

  let code = data.choices[0]?.message?.content || "";

  // Strip markdown fences if present
  const match = code.match(/```(?:tsx?)?\s*\n?([\s\S]*?)\n?```/);
  if (match) code = match[1].trim();

  return code;
}

// ─── Manifest Management ────────────────────────────────────

async function loadManifest(): Promise<SyncManifest | null> {
  if (!existsSync(MANIFEST_PATH)) return null;
  const raw = await readFile(MANIFEST_PATH, "utf-8");
  return JSON.parse(raw) as SyncManifest;
}

async function saveManifest(manifest: SyncManifest): Promise<void> {
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
}

// ─── Diff Calculation ───────────────────────────────────────

function calculateDiff(
  currentComponents: FigmaComponentMapping[],
  manifest: SyncManifest | null
): SyncDiff {
  const existing = manifest?.components || [];
  const existingByKey = new Map(existing.map((c) => [c.figmaKey, c]));
  const currentByKey = new Map(currentComponents.map((c) => [c.figmaKey, c]));

  const added: FigmaComponentMapping[] = [];
  const modified: FigmaComponentMapping[] = [];
  const removed: FigmaComponentMapping[] = [];

  // Check for added/modified
  for (const [key, comp] of currentByKey) {
    const prev = existingByKey.get(key);
    if (!prev) {
      added.push(comp);
    } else if (prev.lastSyncedVersion !== comp.lastSyncedVersion) {
      modified.push(comp);
    }
  }

  // Check for removed
  for (const [key, comp] of existingByKey) {
    if (!currentByKey.has(key)) {
      removed.push(comp);
    }
  }

  return { added, modified, removed, tokensChanged: false };
}

// ─── Component Name Normalization ───────────────────────────

function toFileName(name: string): string {
  return name
    .split("/")[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toExportName(name: string): string {
  return name
    .split("/")[0]
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

// ─── AI Doc Generation ──────────────────────────────────────

async function generateComponentDoc(
  componentName: string,
  exportName: string,
  figmaData: any,
  componentCode: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const model = process.env.OPENAI_MODEL || "gpt-4o";

  const systemPrompt = `You are an expert at documenting React design system components for AI code generation.
Given a component's source code and Figma design data, generate a ComponentDoc TypeScript object that:

1. Describes every prop with aiContentHint telling an AI what text/values to generate
2. Describes every slot with aiContentHint for the kind of content to place there
3. Lists all variants with aiSelectionHint explaining when to pick each option
4. Defines Segment tracking events with ready-to-paste code snippets
5. Provides figmaMapping hints (node types, layer name keywords, visual cues)
6. Includes a11y requirements and responsive notes
7. Includes a complete usage example with tracking

Return ONLY valid TypeScript source code for the .doc.ts file. No explanation. No markdown fences.
The file must import ComponentDoc from "../types/component-doc.types" and export a named constant like "${exportName.charAt(0).toLowerCase() + exportName.slice(1)}Doc".`;

  const userPrompt = `Generate an AI-ready ComponentDoc for "${componentName}".

COMPONENT SOURCE CODE:
${componentCode}

FIGMA DESIGN DATA:
${JSON.stringify(figmaData, null, 2)}

Follow this pattern exactly for the export:
import type { ComponentDoc } from "../types/component-doc.types";
export const ${exportName.charAt(0).toLowerCase() + exportName.slice(1)}Doc: ComponentDoc = { ... };`;

  const res = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_completion_tokens: 8000,
      temperature: 0.1,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI API ${res.status}: ${await res.text()}`);

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string | null } }>;
  };

  let code = data.choices[0]?.message?.content || "";
  const match = code.match(/```(?:tsx?)?\s*\n?([\s\S]*?)\n?```/);
  if (match) code = match[1].trim();

  return code;
}

// ─── Barrel Export Regeneration ─────────────────────────────

async function regenerateIndex(components: FigmaComponentMapping[]): Promise<void> {
  // Read existing index to preserve manual exports (docs, types, icons, etc.)
  let existingContent = "";
  try {
    existingContent = await readFile(INDEX_PATH, "utf-8");
  } catch {
    // No existing file — will create from scratch
  }

  // Build set of new Figma component export lines
  const figmaExports = new Set<string>();
  for (const comp of components) {
    const relPath = comp.localPath.replace(/^src\//, "./").replace(/\.tsx$/, "");
    figmaExports.add(`export * from "${relPath}";`);
  }

  if (existingContent) {
    // Append only new exports that don't already exist in the file
    const newLines: string[] = [];
    for (const exportLine of figmaExports) {
      if (!existingContent.includes(exportLine)) {
        newLines.push(exportLine);
      }
    }

    if (newLines.length > 0) {
      const appendSection = [
        "",
        "// ─── Figma-synced components (auto-generated) ─────────────",
        ...newLines,
      ].join("\n");
      await writeFile(INDEX_PATH, existingContent.trimEnd() + "\n" + appendSection + "\n", "utf-8");
      console.log(`  Appended ${newLines.length} new exports to index.ts`);
    } else {
      console.log("  All Figma components already exported in index.ts");
    }
  } else {
    // No existing file — create minimal index
    const lines = [
      "// ─── @martech/design-system ─────────────────────────────────",
      'export { cn } from "./lib/utils";',
      'export { designTokens, type DesignTokenConfig } from "./tokens/design-tokens";',
      "",
      "// ─── Figma-synced components ────────────────────────────────",
      ...Array.from(figmaExports),
    ];
    await writeFile(INDEX_PATH, lines.join("\n") + "\n", "utf-8");
  }
}

async function regenerateDocsIndex(components: FigmaComponentMapping[]): Promise<void> {
  const DOCS_INDEX_PATH = path.join(DS_ROOT, "src/docs/index.ts");
  const lines = [
    "// ─── Component Documentation Registry ───────────────────────",
    "// Auto-generated — do not edit manually. Run `pnpm ds:sync` to regenerate.",
    "",
    'import type { ComponentDocRegistry } from "../types/component-doc.types";',
    "",
  ];

  const importLines: string[] = [];
  const exportLines: string[] = [];
  const registryItems: string[] = [];

  for (const comp of components) {
    const fileName = toFileName(comp.figmaName);
    const varName = `${comp.exportName.charAt(0).toLowerCase() + comp.exportName.slice(1)}Doc`;
    const docFile = path.join(DOCS_DIR, `${fileName}.doc.ts`);

    if (existsSync(docFile)) {
      importLines.push(`import { ${varName} } from "./${fileName}.doc";`);
      exportLines.push(`export { ${varName} } from "./${fileName}.doc";`);
      registryItems.push(varName);
    }
  }

  lines.push(...importLines, "", ...exportLines, "");
  lines.push(
    "export const componentDocRegistry: ComponentDocRegistry = {",
    '  version: "1.0.0",',
    "  components: [",
    ...registryItems.map((name) => `    ${name},`),
    "  ],",
    "  globalTrackingSetup: `// Segment tracking is loaded via <SegmentScript /> in the root layout.\\n" +
      '// Import helpers: import { trackEvent, trackButtonClick, trackLinkClick, trackFormSubmit, trackSectionView } from "@/components/layout/SegmentScript";`,',
    "  globalImports: [",
    "    'import { SegmentScript } from \"@/components/layout/SegmentScript\";',",
    "    'import { trackEvent, trackButtonClick, trackLinkClick, trackFormSubmit, trackSectionView } from \"@/components/layout/SegmentScript\";',",
    "  ],",
    "};",
    "",
    'export { serializeRegistryForPrompt } from "./serialize";'
  );

  await writeFile(DOCS_INDEX_PATH, lines.join("\n") + "\n", "utf-8");
}

// ─── Main Sync Flow ─────────────────────────────────────────

async function main() {
  const fileKey =
    process.env.FIGMA_DS_FILE_KEY ||
    process.argv.find((a) => !a.startsWith("-") && a !== process.argv[0] && a !== process.argv[1]);

  if (!fileKey) {
    console.error("Usage: sync-figma-components.ts <figma-file-key>");
    console.error("  or set FIGMA_DS_FILE_KEY environment variable");
    process.exit(1);
  }

  console.log("╔══════════════════════════════════════════════╗");
  console.log("║   Design System — Figma Component Sync       ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log("");

  // 1. Load existing manifest
  const manifest = await loadManifest();
  console.log(
    manifest
      ? `Existing manifest: ${manifest.components.length} components tracked`
      : "No existing manifest — first sync"
  );

  // 2. Fetch components from Figma
  console.log("Fetching components from Figma...");
  const fileData = await figmaFetch<FigmaFileResponse>(`/files/${fileKey}`);
  const componentsMeta = await figmaFetch<FigmaFileComponents>(`/files/${fileKey}/components`);

  // Normalize response — component_sets may not exist in all API responses
  const components = componentsMeta?.meta?.components ?? [];
  const componentSets = componentsMeta?.meta?.component_sets ?? [];

  console.log(`Found ${components.length} components, ${componentSets.length} component sets`);

  // 3. Build component mappings — group variants into single components
  //
  // Figma returns individual variants as separate components with names like:
  //   "State=Default, size=MD, color=azul, Style=round, Type=Primary"
  // We detect the variant pattern (key=value pairs) and group them by
  // their containing_frame (parent component) or by base name.

  const VARIANT_PATTERN = /^[A-Za-z_]+=.+/;

  function isVariantName(name: string): boolean {
    return VARIANT_PATTERN.test(name) || (name.includes(", ") && name.includes("="));
  }

  function getBaseComponentName(comp: {
    name: string;
    containing_frame?: { name: string };
  }): string | null {
    // If it has a containing frame that isn't a page, use that as the group
    if (
      comp.containing_frame?.name &&
      !comp.containing_frame.name.match(/^(Page|Canvas|Frame)\s/i)
    ) {
      return comp.containing_frame.name;
    }
    // If name is a variant pattern, extract the first meaningful part
    if (isVariantName(comp.name)) {
      // Try to find the parent from the containing_frame
      return comp.containing_frame?.name || null;
    }
    return null;
  }

  // Group components: variants → parent component, standalone → individual
  const groups = new Map<
    string,
    {
      baseName: string;
      nodeId: string;
      key: string;
      variants: string[];
    }
  >();
  const standaloneComponents: typeof components = [];

  for (const comp of components) {
    const baseName = getBaseComponentName(comp);

    if (baseName && isVariantName(comp.name)) {
      // This is a variant — group under the base component
      const existing = groups.get(baseName);
      if (existing) {
        existing.variants.push(comp.name);
      } else {
        groups.set(baseName, {
          baseName,
          nodeId: comp.node_id,
          key: comp.key,
          variants: [comp.name],
        });
      }
    } else {
      // Standalone component (not a variant)
      standaloneComponents.push(comp);
    }
  }

  // Also add any component sets from the API
  for (const set of componentSets) {
    if (!groups.has(set.name)) {
      const variants = components
        .filter((c) => c.containing_frame?.name === set.name)
        .map((c) => c.name);
      groups.set(set.name, {
        baseName: set.name,
        nodeId: set.node_id,
        key: set.key,
        variants,
      });
    }
  }

  const currentComponents: FigmaComponentMapping[] = [];

  // Add grouped components (with variants)
  for (const [, group] of groups) {
    const fileName = toFileName(group.baseName);
    const exportName = toExportName(group.baseName);

    currentComponents.push({
      figmaNodeId: group.nodeId,
      figmaKey: group.key,
      figmaName: group.baseName,
      localPath: `src/components/ui/${fileName}.tsx`,
      exportName,
      lastSyncedVersion: fileData.version,
      lastSyncedAt: new Date().toISOString(),
      hasVariants: true,
      variantProperties: group.variants,
    });
  }

  // Add standalone components
  for (const comp of standaloneComponents) {
    const fileName = toFileName(comp.name);
    const exportName = toExportName(comp.name);

    currentComponents.push({
      figmaNodeId: comp.node_id,
      figmaKey: comp.key,
      figmaName: comp.name,
      localPath: `src/components/ui/${fileName}.tsx`,
      exportName,
      lastSyncedVersion: fileData.version,
      lastSyncedAt: new Date().toISOString(),
      hasVariants: false,
    });
  }

  console.log(
    `Grouped into ${currentComponents.length} components (${groups.size} with variants, ${standaloneComponents.length} standalone)`
  );

  // 4. Calculate diff
  const diff = calculateDiff(currentComponents, manifest);

  console.log("");
  console.log(`Changes detected:`);
  console.log(`  + ${diff.added.length} new components`);
  console.log(`  ~ ${diff.modified.length} modified components`);
  console.log(`  - ${diff.removed.length} removed components`);
  console.log("");

  if (diff.added.length === 0 && diff.modified.length === 0 && diff.removed.length === 0) {
    console.log("Everything is up to date.");
    return;
  }

  if (DRY_RUN) {
    console.log("[DRY RUN] Would sync these components:");
    for (const c of [...diff.added, ...diff.modified]) {
      console.log(`  ${diff.added.includes(c) ? "+" : "~"} ${c.figmaName} → ${c.localPath}`);
    }
    for (const c of diff.removed) {
      console.log(`  - ${c.figmaName} (${c.localPath})`);
    }
    return;
  }

  // 5. Fetch detailed node data for changed components
  const changedComponents = [...diff.added, ...diff.modified];
  const nodeIds = changedComponents.map((c) => c.figmaNodeId).join(",");

  let nodeDetails: any = {};
  if (changedComponents.length > 0) {
    console.log("Fetching component details from Figma...");
    const nodesResponse = await figmaFetch<{ nodes: Record<string, { document: any }> }>(
      `/files/${fileKey}/nodes?ids=${nodeIds}`
    );
    nodeDetails = nodesResponse.nodes;
  }

  // 6. Generate/update component code with AI
  for (const comp of changedComponents) {
    const isNew = diff.added.includes(comp);
    console.log(`${isNew ? "Creating" : "Updating"} ${comp.figmaName}...`);

    const figmaData = nodeDetails[comp.figmaNodeId]?.document || {};
    let existingCode: string | null = null;

    if (!isNew) {
      const fullPath = path.join(DS_ROOT, comp.localPath);
      if (existsSync(fullPath)) {
        existingCode = await readFile(fullPath, "utf-8");
      }
    }

    const code = await generateComponentCode(comp.exportName, figmaData, existingCode);

    const fullPath = path.join(DS_ROOT, comp.localPath);
    await mkdir(path.dirname(fullPath), { recursive: true });
    await writeFile(fullPath, code, "utf-8");

    console.log(`  ✅ ${comp.localPath}`);

    // Generate AI-ready component documentation
    const fileName = toFileName(comp.figmaName);
    const docPath = path.join(DOCS_DIR, `${fileName}.doc.ts`);
    try {
      console.log(`  Generating AI docs for ${comp.exportName}...`);
      const docCode = await generateComponentDoc(comp.figmaName, comp.exportName, figmaData, code);
      await mkdir(DOCS_DIR, { recursive: true });
      await writeFile(docPath, docCode, "utf-8");
      console.log(`  📝 ${docPath}`);
    } catch (docErr: any) {
      console.warn(`  ⚠️  Doc generation failed for ${comp.exportName}: ${docErr.message}`);
    }
  }

  // 7. Handle removed components (log only, don't auto-delete)
  for (const comp of diff.removed) {
    console.log(`  ⚠️  ${comp.figmaName} was removed from Figma — review ${comp.localPath}`);
  }

  // 8. Regenerate barrel export and docs index
  console.log("Regenerating index.ts and docs/index.ts...");
  const allComponents = currentComponents.filter(
    (c) => !diff.removed.some((r) => r.figmaKey === c.figmaKey)
  );
  await regenerateIndex(allComponents);
  await regenerateDocsIndex(allComponents);

  // 9. Save updated manifest
  const newManifest: SyncManifest = {
    figmaFileKey: fileKey,
    figmaFileName: fileData.name,
    lastFullSync: new Date().toISOString(),
    components: allComponents,
    tokensVersion: fileData.version,
  };
  await saveManifest(newManifest);

  console.log("");
  console.log("════════════════════════════════════════════════");
  console.log("✅ Sync complete!");
  console.log(
    `   ${diff.added.length} created, ${diff.modified.length} updated, ${diff.removed.length} flagged`
  );
  console.log("");
  console.log("Next steps:");
  console.log("  1. Review the generated components");
  console.log("  2. Run: pnpm ds:build");
  console.log("  3. Commit the changes");
}

main().catch((err) => {
  console.error(`\n❌ Sync failed: ${err.message}`);
  process.exit(1);
});
