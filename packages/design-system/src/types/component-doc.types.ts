// ─── AI-Ready Component Documentation Types ─────────────────
//
// Every component in the design system has a companion ComponentDoc
// that tells the AI code generator exactly how to use it:
// what each prop/slot represents, what text to fill, figma mapping
// hints, accessibility rules, and tracking events to fire.
//
// The sync script auto-generates these docs from Figma metadata,
// and the page builder's OpenAI prompt consumes them for
// pixel-perfect, tracked, accessible page generation.

/**
 * Describes a single prop that the AI should populate when
 * using this component in a generated page.
 */
export interface PropDoc {
  /** Prop name as it appears in the React component */
  name: string;
  /** TypeScript type (e.g. "string", "'sm' | 'md' | 'lg'") */
  type: string;
  /** Whether this prop is required */
  required: boolean;
  /** Default value if any */
  defaultValue?: string;
  /** Human-readable description of what this prop controls */
  description: string;
  /**
   * AI hint: what kind of content should the AI generate for this prop?
   * e.g., "CTA text like 'Get Started', 'Sign Up', 'Learn More'"
   * e.g., "Hero headline — short, punchy, benefit-driven"
   */
  aiContentHint?: string;
  /**
   * Figma property name that maps to this React prop.
   * Used during Figma extraction to auto-bind values.
   */
  figmaPropertyName?: string;
}

/**
 * Describes a named content slot (children region) where the AI
 * should place specific types of content.
 */
export interface SlotDoc {
  /** Slot name (e.g. "children", "header", "footer") */
  name: string;
  /** What content belongs in this slot */
  description: string;
  /**
   * AI hint for the kind of content to generate.
   * e.g., "Primary body text — 1–3 sentences explaining the feature"
   * e.g., "List of 3–5 feature bullet points with icons"
   */
  aiContentHint: string;
  /** Accepted child component types (for structured slots) */
  acceptsComponents?: string[];
}

/**
 * Describes a Segment tracking event that the AI must wire up
 * when using this component.
 */
export interface TrackingEventDoc {
  /** Segment event name (e.g. "Button Clicked") */
  eventName: string;
  /** What user action triggers this event */
  trigger: string;
  /** Properties to include in the event payload */
  properties: Record<string, string>;
  /** The code snippet the AI should add (ready to paste) */
  codeSnippet: string;
}

/**
 * Figma-to-code mapping hint that helps the AI recognise
 * when to use this component from the design data.
 */
export interface FigmaMappingHint {
  /** Figma node types that correspond to this component */
  figmaNodeTypes: string[];
  /** Keywords in Figma layer names that signal this component */
  layerNameKeywords: string[];
  /** Visual characteristics to look for in the design */
  visualCues: string[];
}

/**
 * Complete AI-ready documentation for a design system component.
 * One per component file. Exported alongside the component and
 * consumed by the page builder's OpenAI prompt.
 */
export interface ComponentDoc {
  /** Component display name (e.g. "Button", "Card") */
  name: string;
  /** Import path: always "@martech/design-system" */
  importPath: string;
  /** Named exports to import (e.g. ["Button", "buttonVariants"]) */
  importNames: string[];
  /** One-line description of what this component is for */
  description: string;
  /**
   * When to use this component — tells the AI the selection criteria.
   * e.g., "Use for all clickable actions, CTAs, form submits, and navigation triggers."
   */
  whenToUse: string;
  /** Props that the AI needs to populate */
  props: PropDoc[];
  /** Named content slots */
  slots: SlotDoc[];
  /** Variant options with visual descriptions */
  variants: Record<
    string,
    {
      options: string[];
      description: string;
      /** AI hint for choosing between variants */
      aiSelectionHint: string;
    }
  >;
  /** Segment tracking events the AI must implement */
  trackingEvents: TrackingEventDoc[];
  /** Figma design mapping hints */
  figmaMapping: FigmaMappingHint;
  /** Accessibility requirements the AI must follow */
  a11y: string[];
  /** Mobile-first responsive behaviour notes */
  responsiveNotes: string[];
  /** Complete usage example (shown to AI in prompt) */
  exampleCode: string;
}

/**
 * The full component documentation registry.
 * Built at compile time, injected into the OpenAI prompt.
 */
export interface ComponentDocRegistry {
  /** Package version */
  version: string;
  /** All documented components */
  components: ComponentDoc[];
  /** Global tracking setup code (Segment snippet) */
  globalTrackingSetup: string;
  /** Global imports the AI should always include */
  globalImports: string[];
}
