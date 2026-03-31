import { defineConfig } from "tsup";
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

function injectUseClient() {
  const distDir = join(__dirname, "dist");
  injectInDir(distDir);
}

function injectInDir(dir: string) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      injectInDir(fullPath);
    } else if (entry.endsWith(".js") || entry.endsWith(".mjs")) {
      const content = readFileSync(fullPath, "utf-8");
      if (!content.startsWith('"use client"')) {
        writeFileSync(fullPath, `"use client";\n${content}`);
      }
    }
  }
}

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  onSuccess: async () => {
    injectUseClient();
  },
  external: [
    "react",
    "react-dom",
    "react-hook-form",
    "@hookform/resolvers",
    "next",
    "next/font",
    "next/image",
    "next/link",
    "next/navigation",
    "next/script",
    "lucide-react",
  ],
  treeshake: true,
});
