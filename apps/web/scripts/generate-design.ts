#!/usr/bin/env tsx
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../../../.env") });

// ─── Design Generation Orchestrator ─────────────────────────
// Main CLI script that ties the full pipeline together:
//   Figma extract → OpenAI code gen → Git publish → Amplify deploy
//
// Usage:
//   npx tsx scripts/generate-design.ts <figma-file-key>
//   npm run generate -- <figma-file-key>

import { extractDesignFromFigma } from "../lib/services/figma.service";
import { generateCodeFromDesign } from "../lib/services/openai.service";
import { gitPublish } from "../lib/services/git.service";
import { createLogger } from "../lib/utils/logger";

const log = createLogger("generate-design");

async function main() {
  const fileKey = process.argv[2];

  if (!fileKey) {
    console.error("Usage: npx tsx scripts/generate-design.ts <figma-file-key>");
    console.error("");
    console.error("Example:");
    console.error("  npx tsx scripts/generate-design.ts abc123def456");
    console.error("");
    console.error("Find your file key in the Figma URL: figma.com/design/<FILE_KEY>/...");
    process.exit(1);
  }

  // Check required env vars
  const requiredVars = ["FIGMA_API_TOKEN", "OPENAI_API_KEY"];
  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    console.error("Copy .env.example to .env and fill in the values.");
    process.exit(1);
  }

  const startTime = Date.now();
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║   Martech Website Builder — Design Pipeline  ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log("");

  try {
    // ─── Step 1: Extract Design ───────────────────────────
    console.log("⏳ [1/3] Extracting design from Figma...");
    const designFile = await extractDesignFromFigma(fileKey);
    const screenshotCount = Object.keys(designFile.frameScreenshots ?? {}).length;
    console.log(
      `✅ Extracted: "${designFile.name}" — ${designFile.pages.length} page(s), ${designFile.assets.length} asset(s), ${screenshotCount} frame screenshot(s)`
    );
    console.log("");

    // ─── Step 2: Generate Code ────────────────────────────
    const visionNote =
      Object.keys(designFile.frameScreenshots ?? {}).length > 0 ? " (vision mode 👁)" : "";
    console.log(`⏳ [2/3] Generating code with OpenAI GPT-4o${visionNote}...`);
    const result = await generateCodeFromDesign(designFile);

    if (!result.success) {
      console.error("❌ Code generation failed:");
      result.errors.forEach((e) => console.error(`   - ${e}`));
      process.exit(1);
    }

    console.log(
      `✅ Generated: ${result.pages.length} page(s), ${result.components.length} component(s)`
    );
    console.log(`   Duration: ${result.metadata.generationDurationMs}ms`);
    console.log("");

    // ─── Step 3: Git Publish ──────────────────────────────
    const skipGit = process.argv.includes("--no-git");
    if (skipGit) {
      console.log("⏭️  [3/3] Skipping git publish (--no-git flag)");
      // Still write files locally
      const { writeGeneratedFiles } = await import("../lib/services/git.service");
      const files = await writeGeneratedFiles(result);
      console.log(`✅ Files written locally: ${files.length} file(s)`);
    } else {
      console.log("⏳ [3/3] Publishing to git (triggers Amplify deploy)...");
      const gitResult = await gitPublish(fileKey, result);
      console.log(`✅ Published to branch: ${gitResult.branchName}`);
      console.log(`   Commit: ${gitResult.commitSha}`);
      console.log(`   Files: ${gitResult.filesWritten}`);
    }

    // ─── Summary ──────────────────────────────────────────
    const totalMs = Date.now() - startTime;
    console.log("");
    console.log("════════════════════════════════════════════════");
    console.log(`✅ Pipeline complete in ${(totalMs / 1000).toFixed(1)}s`);
    console.log("");
    console.log("Generated pages:");
    result.pages.forEach((p) => {
      console.log(`  → ${p.route}  (${p.path}${p.filename})`);
    });
    console.log("");
    if (!skipGit) {
      console.log("🚀 Amplify will auto-deploy the new branch as a preview environment.");
    }
  } catch (err) {
    log.error("Pipeline failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    console.error("");
    console.error(`❌ Pipeline failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

main();
