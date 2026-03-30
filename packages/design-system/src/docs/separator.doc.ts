import type { ComponentDoc } from "../types/component-doc.types";

export const separatorDoc: ComponentDoc = {
  name: "Separator",
  importPath: "@martech/design-system",
  importNames: ["Separator"],
  description: "Visual divider between content sections — horizontal rules and vertical dividers.",
  whenToUse:
    "Use for ANY line, divider, or horizontal rule in the Figma design. Also use between card sections, list items, or to separate major content areas.",

  props: [
    {
      name: "orientation",
      type: "'horizontal' | 'vertical'",
      required: false,
      defaultValue: "horizontal",
      description: "Direction of the separator.",
      aiContentHint:
        "Use 'horizontal' for full-width section dividers, 'vertical' for side-by-side column separators.",
    },
    {
      name: "decorative",
      type: "boolean",
      required: false,
      defaultValue: "true",
      description:
        "If true, separator is purely visual (aria-hidden). If false, it acts as a semantic separator.",
    },
    {
      name: "className",
      type: "string",
      required: false,
      description: "Additional Tailwind classes for custom colour, thickness, or spacing.",
      aiContentHint:
        "Match Figma: custom colour ('bg-primary/20'), spacing ('my-8'), width ('w-1/2 mx-auto').",
    },
  ],

  slots: [],
  variants: {},

  trackingEvents: [],

  figmaMapping: {
    figmaNodeTypes: ["LINE", "VECTOR", "FRAME"],
    layerNameKeywords: ["separator", "divider", "line", "hr", "rule", "border"],
    visualCues: [
      "Thin horizontal line spanning the width of its container",
      "Height of 1px, light grey colour",
      "Vertical line between two columns",
    ],
  },

  a11y: [
    "Set decorative=true for purely visual separators (most cases)",
    "Set decorative=false for semantic content separation (e.g., between article sections)",
  ],

  responsiveNotes: [
    "Full-width separators work the same across all breakpoints",
    "Vertical separators may need to become horizontal on mobile (change orientation based on breakpoint)",
  ],

  exampleCode: `import { Separator } from "@martech/design-system";

{/* Section divider */}
<Separator className="my-8" />

{/* Subtle divider */}
<Separator className="my-4 bg-muted" />

{/* Vertical separator between items */}
<div className="flex items-center gap-4">
  <span>Item A</span>
  <Separator orientation="vertical" className="h-4" />
  <span>Item B</span>
</div>`,
};
