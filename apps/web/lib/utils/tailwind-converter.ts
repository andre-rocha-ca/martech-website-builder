// ─── Figma Styles → Tailwind CSS Converter ──────────────────

import type {
  FigmaColor,
  FigmaFill,
  FigmaEffect,
  FigmaTypeStyle,
  FigmaNode,
} from "../types/figma.types";

/**
 * Convert Figma RGBA color to hex string
 */
export function figmaColorToHex(color: FigmaColor): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Convert Figma RGBA to CSS rgba() string
 */
export function figmaColorToRgba(color: FigmaColor): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `rgba(${r}, ${g}, ${b}, ${color.a.toFixed(2)})`;
}

/**
 * Map px value to closest Tailwind spacing class
 */
export function pxToTailwindSpacing(px: number): string {
  const spacingMap: Record<number, string> = {
    0: "0",
    1: "px",
    2: "0.5",
    4: "1",
    6: "1.5",
    8: "2",
    10: "2.5",
    12: "3",
    14: "3.5",
    16: "4",
    20: "5",
    24: "6",
    28: "7",
    32: "8",
    36: "9",
    40: "10",
    44: "11",
    48: "12",
    56: "14",
    64: "16",
    80: "20",
    96: "24",
    112: "28",
    128: "32",
    144: "36",
    160: "40",
    176: "44",
    192: "48",
    208: "52",
    224: "56",
    240: "60",
    256: "64",
    288: "72",
    320: "80",
    384: "96",
  };

  // Find closest match
  const keys = Object.keys(spacingMap).map(Number);
  const closest = keys.reduce((prev, curr) =>
    Math.abs(curr - px) < Math.abs(prev - px) ? curr : prev
  );

  return spacingMap[closest] || `[${px}px]`;
}

/**
 * Map px font size to Tailwind text class
 */
export function pxToTailwindFontSize(px: number): string {
  const sizeMap: Record<number, string> = {
    12: "xs",
    14: "sm",
    16: "base",
    18: "lg",
    20: "xl",
    24: "2xl",
    30: "3xl",
    36: "4xl",
    48: "5xl",
    60: "6xl",
    72: "7xl",
    96: "8xl",
    128: "9xl",
  };

  const keys = Object.keys(sizeMap).map(Number);
  const closest = keys.reduce((prev, curr) =>
    Math.abs(curr - px) < Math.abs(prev - px) ? curr : prev
  );

  return sizeMap[closest] || `[${px}px]`;
}

/**
 * Map Figma font weight to Tailwind font-weight class
 */
export function fontWeightToTailwind(weight: number): string {
  const weightMap: Record<number, string> = {
    100: "thin",
    200: "extralight",
    300: "light",
    400: "normal",
    500: "medium",
    600: "semibold",
    700: "bold",
    800: "extrabold",
    900: "black",
  };

  const keys = Object.keys(weightMap).map(Number);
  const closest = keys.reduce((prev, curr) =>
    Math.abs(curr - weight) < Math.abs(prev - weight) ? curr : prev
  );

  return weightMap[closest] || "normal";
}

/**
 * Map Figma corner radius to Tailwind rounded class
 */
export function radiusToTailwind(radius: number): string {
  if (radius === 0) return "rounded-none";
  if (radius <= 2) return "rounded-sm";
  if (radius <= 4) return "rounded";
  if (radius <= 6) return "rounded-md";
  if (radius <= 8) return "rounded-lg";
  if (radius <= 12) return "rounded-xl";
  if (radius <= 16) return "rounded-2xl";
  if (radius <= 24) return "rounded-3xl";
  if (radius >= 9999) return "rounded-full";
  return `rounded-[${radius}px]`;
}

/**
 * Convert Figma effect to Tailwind shadow class
 */
export function effectToTailwindShadow(effect: FigmaEffect): string {
  if (effect.type !== "DROP_SHADOW" || !effect.visible) return "";

  const { radius, offset, color, spread } = effect;
  if (!offset || !color) return "shadow";

  // Map to closest Tailwind shadow
  if (radius <= 1 && spread === 0) return "shadow-sm";
  if (radius <= 3) return "shadow";
  if (radius <= 6) return "shadow-md";
  if (radius <= 10) return "shadow-lg";
  if (radius <= 15) return "shadow-xl";
  return "shadow-2xl";
}

/**
 * Convert Figma layout properties to Tailwind flex classes
 */
export function layoutToTailwindClasses(node: FigmaNode): string[] {
  const classes: string[] = [];

  if (!node.layoutMode || node.layoutMode === "NONE") return classes;

  classes.push("flex");
  classes.push(node.layoutMode === "HORIZONTAL" ? "flex-row" : "flex-col");

  // Main axis alignment
  switch (node.primaryAxisAlignItems) {
    case "MIN":
      classes.push("justify-start");
      break;
    case "CENTER":
      classes.push("justify-center");
      break;
    case "MAX":
      classes.push("justify-end");
      break;
    case "SPACE_BETWEEN":
      classes.push("justify-between");
      break;
  }

  // Cross axis alignment
  switch (node.counterAxisAlignItems) {
    case "MIN":
      classes.push("items-start");
      break;
    case "CENTER":
      classes.push("items-center");
      break;
    case "MAX":
      classes.push("items-end");
      break;
    case "BASELINE":
      classes.push("items-baseline");
      break;
  }

  // Gap
  if (node.itemSpacing && node.itemSpacing > 0) {
    classes.push(`gap-${pxToTailwindSpacing(node.itemSpacing)}`);
  }

  // Padding
  if (node.paddingTop || node.paddingBottom || node.paddingLeft || node.paddingRight) {
    const pt = node.paddingTop || 0;
    const pb = node.paddingBottom || 0;
    const pl = node.paddingLeft || 0;
    const pr = node.paddingRight || 0;

    if (pt === pb && pl === pr && pt === pl) {
      classes.push(`p-${pxToTailwindSpacing(pt)}`);
    } else {
      if (pt === pb && pt > 0) classes.push(`py-${pxToTailwindSpacing(pt)}`);
      else {
        if (pt > 0) classes.push(`pt-${pxToTailwindSpacing(pt)}`);
        if (pb > 0) classes.push(`pb-${pxToTailwindSpacing(pb)}`);
      }
      if (pl === pr && pl > 0) classes.push(`px-${pxToTailwindSpacing(pl)}`);
      else {
        if (pl > 0) classes.push(`pl-${pxToTailwindSpacing(pl)}`);
        if (pr > 0) classes.push(`pr-${pxToTailwindSpacing(pr)}`);
      }
    }
  }

  return classes;
}

/**
 * Convert Figma text style to Tailwind classes
 */
export function textStyleToTailwindClasses(style: FigmaTypeStyle): string[] {
  const classes: string[] = [];

  if (style.fontSize) {
    classes.push(`text-${pxToTailwindFontSize(style.fontSize)}`);
  }

  if (style.fontWeight) {
    classes.push(`font-${fontWeightToTailwind(style.fontWeight)}`);
  }

  if (style.textAlignHorizontal) {
    const alignMap: Record<string, string> = {
      LEFT: "text-left",
      CENTER: "text-center",
      RIGHT: "text-right",
      JUSTIFIED: "text-justify",
    };
    classes.push(alignMap[style.textAlignHorizontal] || "text-left");
  }

  if (style.lineHeightPx && style.fontSize) {
    const ratio = style.lineHeightPx / style.fontSize;
    if (ratio <= 1) classes.push("leading-none");
    else if (ratio <= 1.25) classes.push("leading-tight");
    else if (ratio <= 1.375) classes.push("leading-snug");
    else if (ratio <= 1.5) classes.push("leading-normal");
    else if (ratio <= 1.625) classes.push("leading-relaxed");
    else classes.push("leading-loose");
  }

  if (style.letterSpacing) {
    if (style.letterSpacing < -0.5) classes.push("tracking-tighter");
    else if (style.letterSpacing < 0) classes.push("tracking-tight");
    else if (style.letterSpacing === 0) classes.push("tracking-normal");
    else if (style.letterSpacing < 0.5) classes.push("tracking-wide");
    else if (style.letterSpacing < 1) classes.push("tracking-wider");
    else classes.push("tracking-widest");
  }

  if (style.textDecoration === "UNDERLINE") classes.push("underline");
  if (style.textDecoration === "STRIKETHROUGH") classes.push("line-through");

  if (style.textCase === "UPPER") classes.push("uppercase");
  if (style.textCase === "LOWER") classes.push("lowercase");
  if (style.textCase === "TITLE") classes.push("capitalize");

  return classes;
}

/**
 * Convert Figma fill to Tailwind background class or inline style
 */
export function fillToTailwindBg(fill: FigmaFill): string {
  if (fill.type === "SOLID" && fill.color) {
    const hex = figmaColorToHex(fill.color);
    return `bg-[${hex}]`;
  }
  return "";
}
