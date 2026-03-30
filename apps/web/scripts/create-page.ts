#!/usr/bin/env tsx
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../../../.env") });

// ─── Create Page — Prompt-Driven Page Builder ──────────────
//
// Generate production-ready landing pages from a text prompt
// using @martech/design-system components and Segment tracking.
//
// Usage:
//   pnpm create-page -- "Landing page for ERP reporting with hero, benefits, FAQ"
//   pnpm create-page -- --figma "https://figma.com/design/abc123/MyFile"
//   pnpm create-page -- --figma abc123def
//
// Options:
//   --figma <url|key>  Use Figma file as input (secondary mode)
//   --no-git           Generate locally without pushing to git
//   --dry-run          Show what would be generated without writing files

import { generatePageFromPrompt } from "../lib/services/openai.service";
import { gitPublish, writeGeneratedFiles } from "../lib/services/git.service";
import { createLogger } from "../lib/utils/logger";

const log = createLogger("create-page");

function extractFileKey(input: string): string {
  const urlMatch = input.match(/figma\.com\/(?:design|file)\/([a-zA-Z0-9]+)/);
  if (urlMatch) return urlMatch[1];
  if (/^[a-zA-Z0-9]+$/.test(input)) return input;
  throw new Error(`Invalid Figma input "${input}". Provide a Figma URL or file key.`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    prompt: "",
    figmaKey: "",
    noGit: false,
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--no-git") {
      options.noGit = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--figma" && args[i + 1]) {
      options.figmaKey = extractFileKey(args[++i]);
    } else if (!arg.startsWith("-")) {
      // Collect all non-flag args as the prompt
      if (options.prompt) options.prompt += " ";
      options.prompt += arg;
    }
  }

  return options;
}

async function main() {
  const opts = parseArgs();

  if (!opts.prompt && !opts.figmaKey) {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║   Create Page — AI-Powered Landing Page Builder              ║
╚══════════════════════════════════════════════════════════════╝

Usage:
  pnpm create-page -- "Describe your landing page here"
  pnpm create-page -- --figma <figma-url-or-key>

Examples:
  pnpm create-page -- "Landing page for ERP reporting with hero, benefits, and FAQ"
  pnpm create-page -- "Product launch page for our new invoicing feature"
  pnpm create-page -- --figma "https://figma.com/design/abc123/MyFile"

Options:
  --figma <url|key>  Use a Figma file as design input (secondary mode)
  --no-git           Generate files locally without pushing to git/Amplify
  --dry-run          Show what would be generated without writing

What happens:
  1. AI generates a full landing page using @martech/design-system components
  2. Every section tracked with Segment CDP (page views, clicks, scrolls)
  3. Mobile-first responsive design
  4. Code is pushed to a design/* branch → Amplify auto-deploys preview
`);
    process.exit(0);
  }

  // Validate environment
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY in .env");
    process.exit(1);
  }

  const isPromptMode = !opts.figmaKey;
  const startTime = Date.now();

  console.log("");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log(
    isPromptMode
      ? "║   Generating page from prompt                                ║"
      : "║   Generating page from Figma design                          ║"
  );
  console.log("╚══════════════════════════════════════════════════════════════╝");

  if (isPromptMode) {
    console.log(`  Prompt: "${opts.prompt}"`);
  } else {
    console.log(`  Figma key: ${opts.figmaKey}`);
  }
  if (opts.noGit) console.log("  Mode: local only (no git push)");
  if (opts.dryRun) console.log("  Mode: dry run");
  console.log("");

  try {
    let result;

    if (isPromptMode) {
      // ── Prompt Mode ──────────────────────────────────────
      console.log("⏳ [1/2] Generating landing page with AI...");
      console.log("   Using @martech/design-system component docs");
      console.log("   Wiring Segment tracking on all interactions");
      console.log("");

      result = await generatePageFromPrompt(opts.prompt);
    } else {
      // ── Figma Mode ───────────────────────────────────────
      if (!process.env.FIGMA_API_TOKEN) {
        console.error("Missing FIGMA_API_TOKEN in .env (required for --figma mode)");
        process.exit(1);
      }

      const { extractDesignFromFigma } = await import("../lib/services/figma.service");
      const { generateCodeFromDesign } = await import("../lib/services/openai.service");

      console.log("⏳ [1/3] Extracting design from Figma...");
      const designFile = await extractDesignFromFigma(opts.figmaKey);
      console.log(
        `✅ "${designFile.name}" — ${designFile.pages.length} page(s), ${designFile.assets.length} asset(s)`
      );
      console.log("");

      console.log("⏳ [2/3] Generating code with AI...");
      result = await generateCodeFromDesign(designFile);
    }

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
      console.log("\nRun without --dry-run to write files.");
      return;
    }

    // Publish
    const stepNum = isPromptMode ? "2/2" : "3/3";
    let previewUrl: string | null = null;

    if (opts.noGit) {
      console.log(`⏳ [${stepNum}] Writing files locally...`);
      const files = await writeGeneratedFiles(result);
      console.log(`✅ ${files.length} file(s) written`);
    } else {
      console.log(`⏳ [${stepNum}] Publishing to git → Amplify auto-deploys...`);
      const identifier = result.metadata.promptHash || result.metadata.figmaFileId || "unknown";
      const gitResult = await gitPublish(identifier, result);
      previewUrl = gitResult.previewUrl;
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
    result.pages.forEach((p) => console.log(`  → ${p.route}`));
    console.log("");
    console.log("What's included:");
    console.log("  ✓ @martech/design-system components");
    console.log("  ✓ Mobile-first responsive (sm → md → lg → xl)");
    console.log("  ✓ Segment tracking on all interactions");
    console.log("  ✓ Accessible (ARIA, semantic HTML)");
    console.log("");

    if (!opts.noGit) {
      console.log("🚀 Amplify will auto-deploy the preview environment.");
      if (previewUrl) {
        console.log("");
        console.log("════════════════════════════════════════════════════");
        console.log("  PREVIEW URL (available after Amplify deploys):");
        console.log(`  ${previewUrl}`);
        console.log("  (Allow 2-5 minutes for build + deploy)");
        console.log("════════════════════════════════════════════════════");
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.error("Pipeline failed", { error: msg });
    console.error(`\n❌ Failed: ${msg}`);
    process.exit(1);
  }
}

main();
