// ─── Normalized Design System Types ─────────────────────────
// Intermediate representation between Figma API and code generation

export interface DesignFile {
  id: string;
  name: string;
  version: string;
  lastModified: string;
  pages: DesignPage[];
  designTokens: DesignTokens;
  assets: DesignAsset[];
  /** frameId → public PNG URL — used for vision-based AI generation */
  frameScreenshots?: Record<string, string>;
}

export interface DesignPage {
  id: string;
  name: string;
  slug: string;
  frames: DesignFrame[];
}

export interface DesignFrame {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  elements: DesignElement[];
}

export interface DesignElement {
  id: string;
  name: string;
  type: DesignElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  styles: ElementStyles;
  children?: DesignElement[];
  text?: string;
  imageUrl?: string;
  link?: string;
  layoutMode?: "row" | "column" | "none";
  layoutProps?: LayoutProps;
}

export type DesignElementType =
  | "container"
  | "text"
  | "image"
  | "button"
  | "icon"
  | "input"
  | "link"
  | "divider"
  | "card"
  | "section"
  | "nav"
  | "footer"
  | "hero"
  | "grid"
  | "unknown";

export interface ElementStyles {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  textDecoration?: "none" | "underline" | "strikethrough";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  boxShadow?: string;
  opacity?: number;
  overflow?: "visible" | "hidden" | "scroll" | "auto";
}

export interface LayoutProps {
  direction: "row" | "column";
  justifyContent: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  alignItems: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
  gap: string;
  wrap?: boolean;
  grow?: number;
}

export interface DesignTokens {
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
}

export interface DesignAsset {
  id: string;
  name: string;
  type: "image/png" | "image/jpg" | "image/svg+xml" | "image/webp";
  localPath: string;
  originalUrl?: string;
  width?: number;
  height?: number;
}

// ─── Generation Output Types ────────────────────────────────

export interface GenerationResult {
  success: boolean;
  pages: GeneratedPage[];
  components: GeneratedComponent[];
  designTokensConfig: Record<string, unknown>;
  errors: string[];
  metadata: GenerationMetadata;
}

export interface GeneratedPage {
  filename: string;
  path: string;
  route: string;
  content: string;
}

export interface GeneratedComponent {
  filename: string;
  path: string;
  content: string;
}

export interface GenerationMetadata {
  figmaFileId: string;
  figmaVersion: string;
  generatedAt: string;
  generationDurationMs: number;
  componentCount: number;
  pageCount: number;
  tokenCount: number;
}
