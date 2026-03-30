#!/usr/bin/env tsx
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../../../.env") });

// ─── Standalone Figma Extraction Script ─────────────────────
// Extracts a Figma file and saves the normalized JSON for inspection.
//
// Usage:
//   npx tsx scripts/extract-figma.ts <figma-file-key>

import { extractDesignFromFigma } from "../lib/services/figma.service";
import { writeFile } from "fs/promises";

async function main() {
  const fileKey = process.argv[2];
  if (!fileKey) {
    console.error("Usage: npx tsx scripts/extract-figma.ts <figma-file-key>");
    process.exit(1);
  }

  if (!process.env.FIGMA_API_TOKEN) {
    console.error("FIGMA_API_TOKEN is required. Set it in your .env file.");
    process.exit(1);
  }

  console.log(`Extracting design from Figma file: ${fileKey}...`);
  const design = await extractDesignFromFigma(fileKey);

  const outputPath = `design-extract-${fileKey.slice(0, 8)}.json`;
  await writeFile(outputPath, JSON.stringify(design, null, 2), "utf-8");

  console.log(`✅ Design extracted and saved to ${outputPath}`);
  console.log(`   Name: ${design.name}`);
  console.log(`   Pages: ${design.pages.length}`);
  console.log(`   Assets: ${design.assets.length}`);
  console.log(
    `   Tokens: ${Object.keys(design.designTokens.colors).length} colors, ${Object.keys(design.designTokens.typography).length} typography`
  );
}

main().catch((err) => {
  console.error(`❌ Extraction failed: ${err.message}`);
  process.exit(1);
});
