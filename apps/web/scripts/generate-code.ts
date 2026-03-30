#!/usr/bin/env tsx
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../../../.env") });

// ─── Standalone Code Generation Script ──────────────────────
// Takes a previously extracted design JSON and generates code.
//
// Usage:
//   npx tsx scripts/generate-code.ts <design-json-path>

import { generateCodeFromDesign } from "../lib/services/openai.service";
import { writeGeneratedFiles } from "../lib/services/git.service";
import { readFile } from "fs/promises";
import type { DesignFile } from "../lib/types/design.types";

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error("Usage: npx tsx scripts/generate-code.ts <design-json-path>");
    process.exit(1);
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is required. Set it in your .env file.");
    process.exit(1);
  }

  console.log(`Reading design data from: ${jsonPath}...`);
  const raw = await readFile(jsonPath, "utf-8");
  const design: DesignFile = JSON.parse(raw);

  console.log(`Generating code for "${design.name}"...`);
  const result = await generateCodeFromDesign(design);

  if (!result.success) {
    console.error("❌ Generation failed:");
    result.errors.forEach((e) => console.error(`   - ${e}`));
    process.exit(1);
  }

  console.log(`✅ Generated ${result.pages.length} pages, ${result.components.length} components`);

  // Write files locally (no git)
  const files = await writeGeneratedFiles(result);
  console.log(`✅ Written ${files.length} files locally`);
  files.forEach((f) => console.log(`   → ${f}`));
}

main().catch((err) => {
  console.error(`❌ Code generation failed: ${err.message}`);
  process.exit(1);
});
