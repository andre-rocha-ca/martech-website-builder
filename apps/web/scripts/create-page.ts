#!/usr/bin/env tsx
import { config } from "dotenv";
import { resolve } from "path";
// Load .env from monorepo root (3 levels up from apps/web/scripts/)
config({ path: resolve(__dirname, "../../../.env") });

// ─── Create Page — Simplified Page Generation ───────────────
//
// The easiest way to create a new page. Accepts a Figma URL or
// file key and generates a pixel-perfect, tracked, mobile-first
// page using the @martech/design-system components.
//
// Usage:
//   pnpm --filter @martech/web create-page <figma-url-or-key> [options]
//   pnpm create-page -- "https://figma.com/design/abc123/MyFile?node-id=1-2"
//
// Options:
//   --no-git       Generate locally without pushing to git
//   --page <slug>  Generate only a specific page by slug
//   --dry-run      Show what would be generated without writing files

import { extractDesignFromFigma } from "../lib/services/figma.service";
import { generateCodeFromDesign, generateSinglePage } from "../lib/services/openai.service";
import { gitPublish, writeGeneratedFiles } from "../lib/services/git.service";
import { createLogger } from "../lib/utils/logger";

const log = createLogger("create-page");

function extractFileKey(input: string): string {
  // Handle full Figma URLs
  const urlMatch = input.match(/figma\.com\/(?:design|file)\/([a-zA-Z0-9]+)/);
  if (urlMatch) return urlMatch[1];

  // Handle bare file keys (alphanumeric strings)
  if (/^[a-zA-Z0-9]+$/.test(input)) return input;

  throw new Error(
    `Invalid input "${input}". Provide a Figma URL or file key.\n` +
      `Example URL: https://figma.com/design/abc123def/MyFile\n` +
      `Example key: abc123def`
  );
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    input: "",
    noGit: false,
    pageSlug: "",
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--no-git") {
      options.noGit = true;
    } else if (arg === "--page" && args[i + 1]) {
      options.pageSlug = args[++i];
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (!arg.startsWith("-")) {
      options.input = arg;
    }
  }

  return options;
}

async function main() {
  const opts = parseArgs();

  if (!opts.input) {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║   Create Page — Figma → Live Page in One Command            ║
╚══════════════════════════════════════════════════════════════╝

Usage:
  pnpm create-page -- <figma-url-or-file-key> [options]

Examples:
  pnpm create-page -- "https://figma.com/design/abc123/MyFile"
  pnpm create-page -- abc123def
  pnpm create-page -- abc123def --no-git
  pnpm create-page -- abc123def --page landing-page
  pnpm create-page -- abc123def --dry-run

Options:
  --no-git       Generate files locally without pushing to git/Amplify
  --page <slug>  Only generate a specific page (by slug)
  --dry-run      Show what would be generated without writing

What happens:
  1. Extracts design data from Figma (nodes, styles, assets, tokens)
  2. AI generates pixel-perfect React/Next.js code using @martech/design-system
  3. Every section tracked with Segment CDP (page views, clicks, scrolls)
  4. Code is pushed to a design/* branch → Amplify auto-deploys preview
`);
    process.exit(0);
  }

  // Validate environment
  const required = ["FIGMA_API_TOKEN", "OPENAI_API_KEY"];
  const missing = required.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(`Missing env vars: ${missing.join(", ")}`);
    console.error("Run: cp .env.example .env  then fill in values.");
    process.exit(1);
  }

  const fileKey = extractFileKey(opts.input);
  const startTime = Date.now();

  console.log("");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║   Creating page from Figma design                           ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log(`  File key: ${fileKey}`);
  if (opts.pageSlug) console.log(`  Page: ${opts.pageSlug}`);
  if (opts.noGit) console.log(`  Mode: local only (no git push)`);
  if (opts.dryRun) console.log(`  Mode: dry run`);
  console.log("");

  try {
    // Step 1: Extract
    console.log("⏳ [1/3] Extracting design from Figma...");
    const designFile = await extractDesignFromFigma(fileKey);
    console.log(
      `✅ "${designFile.name}" — ${designFile.pages.length} page(s), ` +
        `${designFile.assets.length} asset(s)`
    );
    console.log("");

    // Step 2: Generate
    console.log("⏳ [2/3] Generating pixel-perfect code with AI...");
    console.log("   Using @martech/design-system component docs for accuracy");
    console.log("   Wiring Segment tracking on all interactions");
    console.log("");

    const result = opts.pageSlug
      ? await generateSinglePage(designFile, opts.pageSlug)
      : await generateCodeFromDesign(designFile);

    if (!result.success) {
      console.error("❌ Generation failed:");
      result.errors.forEach((e) => console.error(`   - ${e}`));
      process.exit(1);
    }

    console.log(
      `✅ Generated: ${result.pages.length} page(s), ${result.components.length} component(s)`
    );
    console.log(`   Time: ${result.metadata.generationDurationMs}ms`);
    console.log("");

    if (opts.dryRun) {
      console.log("── DRY RUN ── Would generate these files:");
      result.pages.forEach((p) => console.log(`  📄 ${p.path}${p.filename} → ${p.route}`));
      result.components.forEach((c) => console.log(`  🧩 ${c.path}${c.filename}`));
      console.log("");
      console.log("Run without --dry-run to write files.");
      return;
    }

    // Step 3: Publish
    if (opts.noGit) {
      console.log("⏳ [3/3] Writing files locally...");
      const files = await writeGeneratedFiles(result);
      console.log(`✅ ${files.length} file(s) written`);
    } else {
      console.log("⏳ [3/3] Publishing to git → Amplify auto-deploys...");
      const gitResult = await gitPublish(fileKey, result);
      console.log(`✅ Branch: ${gitResult.branchName}`);
      console.log(`   Commit: ${gitResult.commitSha}`);
      console.log(`   Files: ${gitResult.filesWritten}`);
    }

    // Summary
    const totalMs = Date.now() - startTime;
    console.log("");
    console.log("════════════════════════════════════════════════════");
    console.log(`✅ Done in ${(totalMs / 1000).toFixed(1)}s`);
    console.log("");
    console.log("Generated pages:");
    result.pages.forEach((p) => {
      console.log(`  → ${p.route}`);
    });
    console.log("");
    console.log("What's included in every page:");
    console.log("  ✓ Pixel-perfect Figma reproduction");
    console.log("  ✓ Mobile-first responsive (sm → md → lg → xl)");
    console.log("  ✓ @martech/design-system components");
    console.log("  ✓ Segment page view tracking");
    console.log("  ✓ Segment click tracking on every button and link");
    console.log("  ✓ Segment section view tracking (IntersectionObserver)");
    console.log("  ✓ Accessible (ARIA, semantic HTML, alt text)");
    console.log("");

    if (!opts.noGit) {
      console.log("🚀 Amplify will auto-deploy the preview environment.");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.error("Pipeline failed", { error: msg });
    console.error(`\n❌ Failed: ${msg}`);
    process.exit(1);
  }
}

main();
