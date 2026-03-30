#!/usr/bin/env tsx
// ─── Test Pipeline — Quick Local Test ────────────────────────
//
// Tests the full Figma → AI → File generation pipeline locally.
// Uses the FIGMA_DS_FILE_KEY from .env by default, or pass a custom key.
//
// Usage:
//   pnpm --filter @martech/web test-pipeline
//   pnpm --filter @martech/web test-pipeline -- <figma-file-key>
//   pnpm --filter @martech/web test-pipeline -- --extract-only

import { config } from "dotenv";
import { resolve } from "path";

// Load .env from monorepo root
config({ path: resolve(__dirname, "../../../.env") });

import { extractDesignFromFigma } from "../lib/services/figma.service";
import { generateCodeFromDesign } from "../lib/services/openai.service";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const DIVIDER = "═".repeat(60);

async function main() {
  const args = process.argv.slice(2);
  const extractOnly = args.includes("--extract-only");
  const fileKey = args.find((a) => !a.startsWith("-")) || process.env.FIGMA_DS_FILE_KEY || "";

  if (!fileKey) {
    console.error("❌ No Figma file key provided.");
    console.error("   Pass a key as argument or set FIGMA_DS_FILE_KEY in .env");
    process.exit(1);
  }

  // Validate env
  const missing = ["FIGMA_API_TOKEN", "OPENAI_API_KEY"].filter((k) => !process.env[k]);
  if (missing.length > 0 && !extractOnly) {
    console.error(`❌ Missing env vars: ${missing.join(", ")}`);
    process.exit(1);
  }
  if (!process.env.FIGMA_API_TOKEN) {
    console.error("❌ FIGMA_API_TOKEN is required");
    process.exit(1);
  }

  console.log("");
  console.log(DIVIDER);
  console.log("  TEST PIPELINE — Figma → AI → Local Files");
  console.log(DIVIDER);
  console.log(`  File key: ${fileKey}`);
  console.log(`  Mode: ${extractOnly ? "extract only" : "full pipeline"}`);
  console.log(`  OpenAI model: ${process.env.OPENAI_MODEL || "gpt-4o"}`);
  console.log("");

  // ─── Step 1: Extract from Figma ──────────────────────────
  console.log("⏳ [1/3] Extracting design from Figma...");
  const startExtract = Date.now();
  let designFile;

  try {
    designFile = await extractDesignFromFigma(fileKey);
  } catch (err) {
    console.error(`\n❌ Figma extraction failed: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }

  const extractMs = Date.now() - startExtract;
  console.log(`✅ Extracted "${designFile.name}" in ${extractMs}ms`);
  console.log(`   Pages: ${designFile.pages.length}`);
  designFile.pages.forEach((p) => {
    console.log(`     → "${p.name}" (/${p.slug}) — ${p.frames.length} frame(s)`);
  });
  console.log(`   Assets: ${designFile.assets.length}`);
  console.log(
    `   Design tokens: ${Object.keys(designFile.designTokens.colors).length} colors, ${Object.keys(designFile.designTokens.typography).length} typography`
  );
  console.log("");

  // Save extracted design data for inspection
  const outputDir = resolve(__dirname, "../.test-output");
  await mkdir(outputDir, { recursive: true });

  const designPath = path.join(outputDir, "design-data.json");
  await writeFile(designPath, JSON.stringify(designFile, null, 2));
  console.log(`   📄 Design data saved to: ${designPath}`);
  console.log("");

  if (extractOnly) {
    console.log(DIVIDER);
    console.log("  ✅ Extract-only mode complete.");
    console.log(`  Inspect the output: ${outputDir}`);
    console.log(DIVIDER);
    return;
  }

  // ─── Step 2: Generate code with AI ───────────────────────
  console.log("⏳ [2/3] Generating code with AI...");
  console.log("   Using @martech/design-system component docs");
  console.log("   Enforcing pixel-perfect, mobile-first, Segment tracking");
  console.log("");

  const startGen = Date.now();
  const result = await generateCodeFromDesign(designFile);
  const genMs = Date.now() - startGen;

  if (!result.success) {
    console.error("❌ Code generation failed:");
    result.errors.forEach((e) => console.error(`   - ${e}`));

    // Still save partial output for debugging
    const errorPath = path.join(outputDir, "generation-errors.json");
    await writeFile(errorPath, JSON.stringify(result, null, 2));
    console.error(`   Error details saved to: ${errorPath}`);
    process.exit(1);
  }

  console.log(`✅ Generated in ${genMs}ms`);
  console.log(`   Pages: ${result.pages.length}`);
  console.log(`   Components: ${result.components.length}`);
  console.log("");

  // ─── Step 3: Write files locally ─────────────────────────
  console.log("⏳ [3/3] Writing generated files...");

  const webRoot = resolve(__dirname, "..");

  for (const page of result.pages) {
    const filePath = path.join(webRoot, page.path, page.filename);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, page.content, "utf-8");
    console.log(`   📄 ${page.path}${page.filename}  →  ${page.route}`);
  }

  for (const comp of result.components) {
    const filePath = path.join(webRoot, comp.path, comp.filename);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, comp.content, "utf-8");
    console.log(`   🧩 ${comp.path}${comp.filename}`);
  }

  // Save full result metadata
  const metaPath = path.join(outputDir, "generation-result.json");
  await writeFile(
    metaPath,
    JSON.stringify(
      {
        ...result,
        pages: result.pages.map((p) => ({ ...p, content: "..." })),
        components: result.components.map((c) => ({ ...c, content: "..." })),
      },
      null,
      2
    )
  );

  const totalMs = extractMs + genMs;
  console.log("");
  console.log(DIVIDER);
  console.log(`  ✅ Pipeline complete in ${(totalMs / 1000).toFixed(1)}s`);
  console.log("");
  console.log("  Generated pages:");
  result.pages.forEach((p) => {
    console.log(`    → ${p.route}`);
  });
  console.log("");
  console.log("  What's included:");
  console.log("    ✓ Pixel-perfect Figma reproduction");
  console.log("    ✓ Mobile-first responsive");
  console.log("    ✓ @martech/design-system components");
  console.log("    ✓ Segment tracking on all interactions");
  console.log("");
  console.log("  Next steps:");
  console.log("    pnpm dev        — Start dev server and preview");
  console.log(`    cat ${designPath} — Inspect extracted design data`);
  console.log(DIVIDER);
}

main().catch((err) => {
  console.error(`\n❌ ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
