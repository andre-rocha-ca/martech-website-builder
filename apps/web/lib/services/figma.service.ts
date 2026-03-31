// ─── Figma API Client & Design Extraction ───────────────────

import type { FigmaFileResponse, FigmaImageResponse, FigmaNode } from "../types/figma.types";
import type {
  DesignFile,
  DesignPage,
  DesignFrame,
  DesignElement,
  DesignElementType,
  DesignTokens,
  DesignAsset,
} from "../types/design.types";
import { figmaColorToHex } from "../utils/tailwind-converter";
import { createLogger } from "../utils/logger";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const log = createLogger("figma-service");

const FIGMA_API_BASE = "https://api.figma.com/v1";

// ─── API Client ─────────────────────────────────────────────

async function figmaFetch<T>(endpoint: string): Promise<T> {
  const token = process.env.FIGMA_API_TOKEN;
  if (!token) throw new Error("FIGMA_API_TOKEN is not set");

  const url = `${FIGMA_API_BASE}${endpoint}`;
  log.debug("Fetching from Figma API", { url });

  const response = await fetch(url, {
    headers: {
      "X-FIGMA-TOKEN": token,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Figma API error ${response.status}: ${response.statusText} — ${body}`);
  }

  return response.json() as Promise<T>;
}

// ─── File Extraction ────────────────────────────────────────

/**
 * Fetch and extract a complete Figma file into our normalized format.
 */
export async function extractDesignFromFigma(fileKey: string): Promise<DesignFile> {
  return log.timed("Figma design extraction", async () => {
    // 1. Fetch the full file
    const file = await figmaFetch<FigmaFileResponse>(`/files/${fileKey}`);
    log.info("Fetched Figma file", {
      name: file.name,
      version: file.version,
    });

    // 2. Extract design tokens from styles
    const designTokens = extractDesignTokens(file);

    // 3. Extract pages and their frames
    const pages = extractPages(file.document);

    // 4. Collect image node IDs for asset download
    const imageNodeIds = collectImageNodeIds(file.document);

    // 5. Download assets
    const assets = await downloadAssets(fileKey, imageNodeIds);

    // 6. Export frame screenshots for vision-based generation (non-fatal)
    //    This gives the AI a visual reference for each frame so it
    //    can produce pixel-perfect output instead of guessing from JSON.
    let frameScreenshots: Record<string, string> = {};
    try {
      frameScreenshots = await exportFrameScreenshots(fileKey, pages);
    } catch (err) {
      log.warn("Frame screenshot export failed — continuing without vision", {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    return {
      id: fileKey,
      name: file.name,
      version: file.version,
      lastModified: file.lastModified,
      pages,
      designTokens,
      assets,
      frameScreenshots,
    };
  });
}

/**
 * Export PNG screenshots of top-level frames using Figma's /images endpoint.
 * Returns a map of frameId → public image URL.
 */
async function exportFrameScreenshots(
  fileKey: string,
  pages: DesignPage[]
): Promise<Record<string, string>> {
  const frameIds: string[] = [];
  for (const page of pages) {
    for (const frame of page.frames) {
      frameIds.push(frame.id);
    }
  }

  if (frameIds.length === 0) return {};

  // Limit to first 10 frames to avoid Figma render timeout
  const limitedIds = frameIds.slice(0, 10);

  const screenshots: Record<string, string> = {};
  const batchSize = 5;

  for (let i = 0; i < limitedIds.length; i += batchSize) {
    const batch = limitedIds.slice(i, i + batchSize);
    const idsParam = batch.map((id) => id.replace(":", "-")).join(",");

    try {
      const response = await figmaFetch<FigmaImageResponse>(
        `/images/${fileKey}?ids=${idsParam}&format=png&scale=0.5`
      );

      if (response.err) {
        log.warn("Frame screenshot export error", { error: response.err });
        continue;
      }

      for (const [nodeId, imageUrl] of Object.entries(response.images)) {
        if (imageUrl) screenshots[nodeId] = imageUrl;
      }
    } catch (err) {
      log.warn("Failed to export frame screenshots", {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  log.info("Frame screenshots exported", { count: Object.keys(screenshots).length });
  return screenshots;
}

// ─── Pages & Frames ─────────────────────────────────────────

function extractPages(document: FigmaNode): DesignPage[] {
  if (!document.children) return [];

  return document.children
    .filter((child) => child.type === "CANVAS")
    .map((canvas) => ({
      id: canvas.id,
      name: canvas.name,
      slug: slugify(canvas.name),
      frames: extractFrames(canvas),
    }));
}

function extractFrames(canvas: FigmaNode): DesignFrame[] {
  if (!canvas.children) return [];

  return canvas.children
    .filter(
      (child) => child.type === "FRAME" || child.type === "COMPONENT" || child.type === "SECTION"
    )
    .map((frame) => ({
      id: frame.id,
      name: frame.name,
      width: frame.absoluteBoundingBox?.width || 0,
      height: frame.absoluteBoundingBox?.height || 0,
      backgroundColor: extractBackgroundColor(frame),
      elements: extractElements(frame.children || []),
    }));
}

// ─── Element Extraction ─────────────────────────────────────

function extractElements(nodes: FigmaNode[]): DesignElement[] {
  return nodes.filter((node) => node.visible !== false).map((node) => extractElement(node));
}

function extractElement(node: FigmaNode): DesignElement {
  const type = inferElementType(node);
  const bbox = node.absoluteBoundingBox;

  const element: DesignElement = {
    id: node.id,
    name: node.name,
    type,
    x: bbox?.x || 0,
    y: bbox?.y || 0,
    width: bbox?.width || 0,
    height: bbox?.height || 0,
    styles: extractStyles(node),
  };

  // Text content
  if (node.type === "TEXT" && node.characters) {
    element.text = node.characters;
  }

  // Layout properties
  if (node.layoutMode && node.layoutMode !== "NONE") {
    element.layoutMode = node.layoutMode === "HORIZONTAL" ? "row" : "column";
    element.layoutProps = {
      direction: element.layoutMode,
      justifyContent: mapAxisAlign(node.primaryAxisAlignItems),
      alignItems: mapCounterAxisAlign(node.counterAxisAlignItems),
      gap: node.itemSpacing ? `${node.itemSpacing}px` : "0",
    };
  }

  // Recursively extract children
  if (node.children && node.children.length > 0) {
    element.children = extractElements(node.children);
  }

  return element;
}

// ─── Type Inference ─────────────────────────────────────────

function inferElementType(node: FigmaNode): DesignElementType {
  const nameLower = node.name.toLowerCase();

  // Text nodes
  if (node.type === "TEXT") return "text";

  // Images (vector/rectangle with image fill)
  if (
    node.fills?.some((f) => f.type === "IMAGE") ||
    nameLower.includes("image") ||
    nameLower.includes("img") ||
    nameLower.includes("photo")
  ) {
    return "image";
  }

  // Buttons
  if (nameLower.includes("button") || nameLower.includes("btn") || nameLower.includes("cta")) {
    return "button";
  }

  // Icons
  if (nameLower.includes("icon") || node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION") {
    return "icon";
  }

  // Inputs
  if (
    nameLower.includes("input") ||
    nameLower.includes("field") ||
    nameLower.includes("textfield")
  ) {
    return "input";
  }

  // Navigation
  if (nameLower.includes("nav") || nameLower.includes("menu")) return "nav";
  if (nameLower.includes("footer")) return "footer";
  if (nameLower.includes("hero")) return "hero";
  if (nameLower.includes("card")) return "card";
  if (nameLower.includes("section") || node.type === "SECTION") return "section";
  if (nameLower.includes("grid") || nameLower.includes("gallery")) return "grid";
  if (nameLower.includes("divider") || nameLower.includes("separator")) return "divider";
  if (nameLower.includes("link")) return "link";

  // Container types
  if (
    node.type === "FRAME" ||
    node.type === "GROUP" ||
    node.type === "COMPONENT" ||
    node.type === "INSTANCE"
  ) {
    return "container";
  }

  return "unknown";
}

// ─── Style Extraction ───────────────────────────────────────

function extractStyles(node: FigmaNode): DesignElement["styles"] {
  const styles: DesignElement["styles"] = {};

  // Background
  if (node.fills && node.fills.length > 0) {
    const solidFill = node.fills.find((f) => f.type === "SOLID" && f.color);
    if (solidFill && solidFill.color) {
      if (node.type === "TEXT") {
        styles.textColor = figmaColorToHex(solidFill.color);
      } else {
        styles.backgroundColor = figmaColorToHex(solidFill.color);
      }
    }
  }

  // Typography
  if (node.style) {
    styles.fontSize = `${node.style.fontSize}px`;
    styles.fontWeight = String(node.style.fontWeight);
    styles.fontFamily = node.style.fontFamily;
    if (node.style.lineHeightPx) {
      styles.lineHeight = `${node.style.lineHeightPx}px`;
    }
    if (node.style.letterSpacing) {
      styles.letterSpacing = `${node.style.letterSpacing}px`;
    }
    if (node.style.textAlignHorizontal) {
      styles.textAlign = node.style.textAlignHorizontal.toLowerCase() as
        | "left"
        | "center"
        | "right"
        | "justify";
    }
  }

  // Border radius
  if (node.cornerRadius) {
    styles.borderRadius = `${node.cornerRadius}px`;
  }

  // Stroke / Border
  if (node.strokes && node.strokes.length > 0 && node.strokeWeight) {
    const stroke = node.strokes[0];
    if (stroke.color) {
      styles.border = `${node.strokeWeight}px solid ${figmaColorToHex(stroke.color)}`;
    }
  }

  // Shadow
  if (node.effects && node.effects.length > 0) {
    const shadow = node.effects.find((e) => e.type === "DROP_SHADOW" && e.visible);
    if (shadow && shadow.color && shadow.offset) {
      const color = figmaColorToHex(shadow.color);
      styles.boxShadow = `${shadow.offset.x}px ${shadow.offset.y}px ${shadow.radius}px ${shadow.spread || 0}px ${color}`;
    }
  }

  // Opacity
  if (node.opacity !== undefined && node.opacity < 1) {
    styles.opacity = node.opacity;
  }

  // Padding
  const pt = node.paddingTop || 0;
  const pb = node.paddingBottom || 0;
  const pl = node.paddingLeft || 0;
  const pr = node.paddingRight || 0;
  if (pt || pb || pl || pr) {
    styles.padding = `${pt}px ${pr}px ${pb}px ${pl}px`;
  }

  return styles;
}

// ─── Design Tokens ──────────────────────────────────────────

function extractDesignTokens(file: FigmaFileResponse): DesignTokens {
  const tokens: DesignTokens = {
    colors: {},
    typography: {},
    spacing: {},
    borderRadius: {},
    shadows: {},
  };

  // Extract colors and text styles from file styles
  for (const [, styleInfo] of Object.entries(file.styles)) {
    const name = slugify(styleInfo.name);

    if (styleInfo.styleType === "FILL") {
      // We'll resolve the actual color values from the nodes that use these styles
      tokens.colors[name] = `var(--color-${name})`;
    }
  }

  // Walk the document tree to find color values used by styled nodes
  walkNodes(file.document, (node) => {
    if (node.fills) {
      for (const fill of node.fills) {
        if (fill.type === "SOLID" && fill.color) {
          const hex = figmaColorToHex(fill.color);
          const name = slugify(node.name);
          if (!tokens.colors[name]) {
            tokens.colors[name] = hex;
          }
        }
      }
    }

    // Typography tokens
    if (node.type === "TEXT" && node.style) {
      const name = slugify(node.name);
      tokens.typography[name] = {
        fontFamily: node.style.fontFamily,
        fontSize: `${node.style.fontSize}px`,
        fontWeight: String(node.style.fontWeight),
        lineHeight: node.style.lineHeightPx ? `${node.style.lineHeightPx}px` : "normal",
        letterSpacing: node.style.letterSpacing ? `${node.style.letterSpacing}px` : undefined,
      };
    }
  });

  return tokens;
}

// ─── Asset Download ─────────────────────────────────────────

function collectImageNodeIds(node: FigmaNode): string[] {
  const ids: string[] = [];

  if (node.fills?.some((f) => f.type === "IMAGE")) {
    ids.push(node.id);
  }

  if (node.children) {
    for (const child of node.children) {
      ids.push(...collectImageNodeIds(child));
    }
  }

  return ids;
}

async function downloadAssets(fileKey: string, nodeIds: string[]): Promise<DesignAsset[]> {
  if (nodeIds.length === 0) return [];

  log.info("Downloading assets", { count: nodeIds.length });

  // Request image URLs from Figma (small batches to avoid render timeout)
  const assets: DesignAsset[] = [];
  const batchSize = 10;

  for (let i = 0; i < nodeIds.length; i += batchSize) {
    const batch = nodeIds.slice(i, i + batchSize);
    const idsParam = batch.join(",");

    const imageResponse = await figmaFetch<FigmaImageResponse>(
      `/images/${fileKey}?ids=${idsParam}&format=png&scale=1`
    );

    if (imageResponse.err) {
      log.warn("Figma image export error", { error: imageResponse.err });
      continue;
    }

    for (const [nodeId, imageUrl] of Object.entries(imageResponse.images)) {
      if (!imageUrl) continue;

      const safeName = nodeId.replace(/[^a-zA-Z0-9]/g, "-");
      const localPath = `public/assets/images/${safeName}.png`;

      try {
        const imgResponse = await fetch(imageUrl);
        if (!imgResponse.ok) {
          log.warn("Image download failed", { nodeId, status: imgResponse.status });
          continue;
        }
        const buffer = Buffer.from(await imgResponse.arrayBuffer());

        await mkdir(path.dirname(localPath), { recursive: true });
        await writeFile(localPath, buffer);

        assets.push({
          id: nodeId,
          name: safeName,
          type: "image/png",
          localPath: `/assets/images/${safeName}.png`,
          originalUrl: imageUrl,
        });
      } catch (err) {
        log.warn("Failed to download asset", {
          nodeId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  log.info("Assets downloaded", { count: assets.length });
  return assets;
}

// ─── Helpers ────────────────────────────────────────────────

function extractBackgroundColor(node: FigmaNode): string {
  if (node.fills && node.fills.length > 0) {
    const solidFill = node.fills.find((f) => f.type === "SOLID" && f.color);
    if (solidFill && solidFill.color) {
      return figmaColorToHex(solidFill.color);
    }
  }
  return "#ffffff";
}

function walkNodes(node: FigmaNode, callback: (node: FigmaNode) => void) {
  callback(node);
  if (node.children) {
    for (const child of node.children) {
      walkNodes(child, callback);
    }
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapAxisAlign(
  align?: string
): DesignElement["layoutProps"] extends undefined
  ? never
  : NonNullable<DesignElement["layoutProps"]>["justifyContent"] {
  switch (align) {
    case "MIN":
      return "flex-start";
    case "CENTER":
      return "center";
    case "MAX":
      return "flex-end";
    case "SPACE_BETWEEN":
      return "space-between";
    default:
      return "flex-start";
  }
}

function mapCounterAxisAlign(
  align?: string
): NonNullable<DesignElement["layoutProps"]>["alignItems"] {
  switch (align) {
    case "MIN":
      return "flex-start";
    case "CENTER":
      return "center";
    case "MAX":
      return "flex-end";
    case "BASELINE":
      return "baseline";
    default:
      return "stretch";
  }
}
