// ─── Figma API Response Types ───────────────────────────────

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FigmaFill {
  type: "SOLID" | "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "IMAGE";
  color?: FigmaColor;
  opacity?: number;
  imageRef?: string;
}

export interface FigmaStroke {
  type: "SOLID";
  color: FigmaColor;
}

export interface FigmaEffect {
  type: "DROP_SHADOW" | "INNER_SHADOW" | "LAYER_BLUR" | "BACKGROUND_BLUR";
  visible: boolean;
  color?: FigmaColor;
  offset?: { x: number; y: number };
  radius: number;
  spread?: number;
}

export interface FigmaTypeStyle {
  fontFamily: string;
  fontPostScriptName?: string;
  fontWeight: number;
  fontSize: number;
  lineHeightPx?: number;
  lineHeightPercent?: number;
  letterSpacing?: number;
  textAlignHorizontal?: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
  textAlignVertical?: "TOP" | "CENTER" | "BOTTOM";
  textDecoration?: "NONE" | "UNDERLINE" | "STRIKETHROUGH";
  textCase?: "ORIGINAL" | "UPPER" | "LOWER" | "TITLE";
}

export interface FigmaLayoutConstraint {
  vertical: "TOP" | "BOTTOM" | "CENTER" | "TOP_BOTTOM" | "SCALE";
  horizontal: "LEFT" | "RIGHT" | "CENTER" | "LEFT_RIGHT" | "SCALE";
}

export interface FigmaNode {
  id: string;
  name: string;
  type:
    | "DOCUMENT"
    | "CANVAS"
    | "FRAME"
    | "GROUP"
    | "VECTOR"
    | "BOOLEAN_OPERATION"
    | "STAR"
    | "LINE"
    | "ELLIPSE"
    | "REGULAR_POLYGON"
    | "RECTANGLE"
    | "TEXT"
    | "SLICE"
    | "COMPONENT"
    | "COMPONENT_SET"
    | "INSTANCE"
    | "SECTION";
  visible?: boolean;
  children?: FigmaNode[];

  // Geometry
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  // Styling
  fills?: FigmaFill[];
  strokes?: FigmaStroke[];
  strokeWeight?: number;
  cornerRadius?: number;
  rectangleCornerRadii?: [number, number, number, number];
  effects?: FigmaEffect[];
  opacity?: number;
  blendMode?: string;

  // Layout
  layoutMode?: "NONE" | "HORIZONTAL" | "VERTICAL";
  layoutAlign?: "INHERIT" | "STRETCH" | "MIN" | "CENTER" | "MAX";
  layoutGrow?: number;
  primaryAxisSizingMode?: "FIXED" | "AUTO";
  counterAxisSizingMode?: "FIXED" | "AUTO";
  primaryAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
  counterAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "BASELINE";
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  constraints?: FigmaLayoutConstraint;

  // Text
  characters?: string;
  style?: FigmaTypeStyle;

  // Component
  componentId?: string;
  componentProperties?: Record<
    string,
    {
      type: string;
      value: string | boolean | number;
    }
  >;
}

export interface FigmaFileResponse {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  document: FigmaNode;
  components: Record<
    string,
    {
      key: string;
      name: string;
      description: string;
    }
  >;
  styles: Record<
    string,
    {
      key: string;
      name: string;
      styleType: "FILL" | "TEXT" | "EFFECT" | "GRID";
      description: string;
    }
  >;
}

export interface FigmaImageResponse {
  err: string | null;
  images: Record<string, string>;
}

export interface FigmaWebhookPayload {
  event_type: "FILE_UPDATE" | "FILE_VERSION_UPDATE" | "LIBRARY_PUBLISH";
  file_key: string;
  file_name: string;
  passcode: string;
  timestamp: string;
  webhook_id: string;
  triggered_by?: {
    id: string;
    handle: string;
  };
}
