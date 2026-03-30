// ─── Design Tokens ──────────────────────────────────────────
// These tokens are the source of truth for the design system.
// They are synced from Figma via the sync-figma-components script
// and consumed by both the DS components and the page builder.

export interface DesignTokenConfig {
  colors: Record<string, string>;
  typography: Record<
    string,
    {
      fontFamily: string;
      fontSize: string;
      fontWeight: string;
      lineHeight: string;
      letterSpacing?: string;
    }
  >;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  breakpoints: Record<string, string>;
}

/**
 * Default design tokens — overridden by Figma sync.
 * The sync script updates this file when design tokens change in Figma.
 */
export const designTokens: DesignTokenConfig = {
  colors: {
    "brand-primary": "#6366f1",
    "brand-secondary": "#8b5cf6",
    "brand-accent": "#ec4899",
    "neutral-50": "#fafafa",
    "neutral-100": "#f4f4f5",
    "neutral-200": "#e4e4e7",
    "neutral-300": "#d4d4d8",
    "neutral-400": "#a1a1aa",
    "neutral-500": "#71717a",
    "neutral-600": "#52525b",
    "neutral-700": "#3f3f46",
    "neutral-800": "#27272a",
    "neutral-900": "#18181b",
    "neutral-950": "#09090b",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },
  typography: {
    display: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "3.75rem",
      fontWeight: "700",
      lineHeight: "1",
    },
    h1: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "2.25rem",
      fontWeight: "700",
      lineHeight: "1.2",
    },
    h2: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "1.875rem",
      fontWeight: "600",
      lineHeight: "1.3",
    },
    h3: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "1.5rem",
      fontWeight: "600",
      lineHeight: "1.4",
    },
    body: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "1rem",
      fontWeight: "400",
      lineHeight: "1.5",
    },
    "body-sm": {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "0.875rem",
      fontWeight: "400",
      lineHeight: "1.5",
    },
    caption: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "0.75rem",
      fontWeight: "400",
      lineHeight: "1.5",
    },
  },
  spacing: {
    "0": "0",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "8": "2rem",
    "10": "2.5rem",
    "12": "3rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem",
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    default: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    default: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1400px",
  },
};
