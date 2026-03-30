#!/usr/bin/env tsx
/**
 * download-assets.ts
 *
 * Downloads all Figma MCP CDN image assets used in generated pages to
 * /public/assets/ so the app doesn't depend on external Figma URLs.
 *
 * After running this script, the generated pages are updated in-place to
 * point to the local /assets/... paths instead of the Figma CDN URLs.
 *
 * Usage:
 *   pnpm download-assets
 *   npx tsx scripts/download-assets.ts
 */

import { config } from "dotenv";
import { resolve, basename } from "path";
config({ path: resolve(__dirname, "../../../.env") });

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  statSync,
  createWriteStream,
} from "fs";
import { join } from "path";
import { pipeline } from "stream/promises";
import https from "https";

// ─── Config ──────────────────────────────────────────────────────────

const GENERATED_PAGES_GLOB = resolve(__dirname, "../app/(generated)");
const PUBLIC_ASSETS_DIR = resolve(__dirname, "../public/assets/images");
const FIGMA_MCP_ORIGIN = "https://www.figma.com/api/mcp/asset/";

// ─── Helpers ─────────────────────────────────────────────────────────

function httpsGet(url: string): Promise<NodeJS.ReadableStream> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          httpsGet(res.headers.location!).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        resolve(res);
      })
      .on("error", reject);
  });
}

async function downloadFile(url: string, destPath: string): Promise<void> {
  const stream = await httpsGet(url);
  const writer = createWriteStream(destPath);
  await pipeline(stream, writer);
}

/** Derive a deterministic filename from a Figma MCP asset UUID */
function assetFilename(url: string, index: number): string {
  const uuid = url.replace(FIGMA_MCP_ORIGIN, "").replace(/[^a-z0-9-]/gi, "");
  return `figma-${uuid.slice(0, 8)}-${index}.png`;
}

// ─── File Finder ──────────────────────────────────────────────────────

function findPageFiles(dir: string, results: string[] = []): string[] {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      findPageFiles(full, results);
    } else if (entry === "page.tsx") {
      results.push(full);
    }
  }
  return results;
}

// ─── Main ─────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(PUBLIC_ASSETS_DIR)) {
    mkdirSync(PUBLIC_ASSETS_DIR, { recursive: true });
    console.log(`📁 Created ${PUBLIC_ASSETS_DIR}`);
  }

  // Find all generated page.tsx files
  const pageFiles = findPageFiles(GENERATED_PAGES_GLOB);

  if (pageFiles.length === 0) {
    console.log("No generated pages found — nothing to download.");
    return;
  }

  let totalDownloaded = 0;
  let totalSkipped = 0;

  for (const filePath of pageFiles) {
    let source = readFileSync(filePath, "utf-8");
    const figmaUrls = [
      ...source.matchAll(/["'](https:\/\/www\.figma\.com\/api\/mcp\/asset\/[^"']+)["']/g),
    ].map((m) => m[1]);

    if (figmaUrls.length === 0) continue;

    const uniqueUrls = [...new Set(figmaUrls)];
    console.log(`\n📄 ${filePath}`);
    console.log(`   Found ${uniqueUrls.length} Figma CDN asset(s)`);

    let changed = false;

    for (let i = 0; i < uniqueUrls.length; i++) {
      const url = uniqueUrls[i];
      const filename = assetFilename(url, i);
      const destPath = resolve(PUBLIC_ASSETS_DIR, filename);
      const publicPath = `/assets/images/${filename}`;

      if (existsSync(destPath)) {
        console.log(`   ⏭  ${filename} (already downloaded)`);
        totalSkipped++;
      } else {
        process.stdout.write(`   ⬇  ${filename} ... `);
        try {
          await downloadFile(url, destPath);
          console.log("✅");
          totalDownloaded++;
        } catch (err) {
          console.log(`❌ ${err instanceof Error ? err.message : String(err)}`);
          continue; // keep the original URL if download fails
        }
      }

      // Replace all occurrences of this URL in the source
      source = source.replaceAll(url, publicPath);
      changed = true;
    }

    if (changed) {
      writeFileSync(filePath, source, "utf-8");
      console.log(`   ✏️  Updated asset URLs in ${basename(filePath)}`);
    }
  }

  console.log("\n────────────────────────────────────────");
  console.log(`✅ Downloaded: ${totalDownloaded}  Skipped (cached): ${totalSkipped}`);
}

main().catch((err) => {
  console.error("❌ download-assets failed:", err);
  process.exit(1);
});
