import { defineConfig } from "tsup";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

function injectUseClient() {
  const distDir = join(__dirname, "dist");
  for (const file of readdirSync(distDir)) {
    if (file.endsWith(".js") || file.endsWith(".mjs")) {
      const filePath = join(distDir, file);
      const content = readFileSync(filePath, "utf-8");
      if (!content.startsWith('"use client"')) {
        writeFileSync(filePath, `"use client";\n${content}`);
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
