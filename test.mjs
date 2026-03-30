#!/usr/bin/env node
// ─── Minimal Pipeline Test ───────────────────────────────────
// Zero dependencies except dotenv. Runs from repo root.
// Tests: Figma API connection → OpenAI API connection → full generation
//
// Usage:
//   node test.mjs                         — full test (extract + generate)
//   node test.mjs --extract-only          — only test Figma connection
//   node test.mjs <figma-file-key>        — use a specific file key

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load .env manually (no dotenv needed) ──────────────────
function loadEnv() {
  try {
    const envPath = resolve(__dirname, ".env");
    const raw = readFileSync(envPath, "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      // Strip inline comments and trim value
      const rawVal = trimmed.slice(eqIdx + 1).trim();
      const val = rawVal.replace(/#.*$/, "").trim();
      if (key && val) process.env[key] = val;
    }
  } catch {
    console.error("⚠️  Could not read .env file from:", resolve(__dirname, ".env"));
  }
}

loadEnv();

const FIGMA_TOKEN = process.env.FIGMA_API_TOKEN;
const FIGMA_KEY =
  process.argv.find((a) => !a.startsWith("-") && a !== process.argv[0] && a !== process.argv[1]) ||
  process.env.FIGMA_DS_FILE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const EXTRACT_ONLY = process.argv.includes("--extract-only");

// ─── Helpers ────────────────────────────────────────────────
const line = "═".repeat(55);

function ok(msg) {
  console.log(`  ✅ ${msg}`);
}
function fail(msg) {
  console.error(`  ❌ ${msg}`);
}
function step(n, msg) {
  console.log(`\n⏳ [${n}] ${msg}...`);
}

// ─── Main ────────────────────────────────────────────────────
console.log(`\n${line}`);
console.log("  PIPELINE TEST — Figma → AI");
console.log(line);

// Validate env
if (!FIGMA_TOKEN) {
  fail("FIGMA_API_TOKEN is missing from .env");
  process.exit(1);
}
if (!FIGMA_KEY) {
  fail("No Figma file key. Pass one as argument or set FIGMA_DS_FILE_KEY in .env");
  process.exit(1);
}
if (!OPENAI_KEY && !EXTRACT_ONLY) {
  fail("OPENAI_API_KEY is missing from .env");
  process.exit(1);
}

console.log(`  File key:    ${FIGMA_KEY}`);
console.log(`  OpenAI model: ${OPENAI_MODEL}`);
console.log(`  Mode:        ${EXTRACT_ONLY ? "extract only" : "extract + generate"}`);

// ─── Step 1: Figma API ───────────────────────────────────────
step(1, "Testing Figma API connection");

let figmaData;
try {
  const url = `https://api.figma.com/v1/files/${FIGMA_KEY}`;
  console.log(`     GET ${url}`);

  const res = await fetch(url, {
    headers: { "X-FIGMA-TOKEN": FIGMA_TOKEN },
  });

  if (!res.ok) {
    const body = await res.text();
    fail(`Figma API ${res.status}: ${body.slice(0, 200)}`);
    process.exit(1);
  }

  figmaData = await res.json();
  ok(`Connected! File: "${figmaData.name}" (version ${figmaData.version})`);

  const pages = figmaData.document?.children?.filter((c) => c.type === "CANVAS") || [];
  ok(`Pages found: ${pages.length}`);
  pages.forEach((p) => {
    const frames = p.children?.filter((c) => c.type === "FRAME" || c.type === "COMPONENT") || [];
    console.log(`     → "${p.name}" — ${frames.length} frame(s)`);
  });
} catch (err) {
  fail(`Figma fetch failed: ${err.message}`);
  process.exit(1);
}

if (EXTRACT_ONLY) {
  console.log(`\n${line}`);
  console.log("  ✅ Figma connection works!");
  console.log(line);
  process.exit(0);
}

// ─── Step 2: OpenAI API ──────────────────────────────────────
step(2, `Testing OpenAI API (${OPENAI_MODEL})`);

const pages = figmaData.document?.children?.filter((c) => c.type === "CANVAS") || [];
const firstPage = pages[0];
const prompt = `You are a Next.js developer. I have a Figma file called "${figmaData.name}" with ${pages.length} page(s): ${pages.map((p) => p.name).join(", ")}.

Return a valid JSON object with this structure:
{
  "components": [],
  "pages": [
    {
      "filename": "page.tsx",
      "path": "app/(generated)/home/",
      "route": "/home",
      "content": "export default function Page() { return <main><h1>${figmaData.name}</h1></main>; }"
    }
  ],
  "tailwindExtensions": {}
}`;

let aiResult;
try {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      max_completion_tokens: 500,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a Next.js code generator. Always return valid JSON." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    fail(`OpenAI API ${res.status}: ${body.slice(0, 400)}`);
    process.exit(1);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    fail("No content in OpenAI response");
    process.exit(1);
  }

  aiResult = JSON.parse(content);
  ok(`OpenAI responded! Model: ${data.model}`);
  ok(`Tokens used: ${data.usage?.total_tokens}`);
  ok(
    `Generated ${aiResult.pages?.length || 0} page(s), ${aiResult.components?.length || 0} component(s)`
  );
} catch (err) {
  fail(`OpenAI call failed: ${err.message}`);
  process.exit(1);
}

// ─── Summary ─────────────────────────────────────────────────
console.log(`\n${line}`);
console.log("  ✅ Both connections work! Pipeline is ready.");
console.log(line);
console.log("\n  Next step: run the full pipeline with your real Figma file:");
console.log(`  pnpm create-page -- "${FIGMA_KEY}" --no-git`);
console.log("");
