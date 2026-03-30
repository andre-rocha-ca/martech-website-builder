import type { ComponentDoc } from "../types/component-doc.types";

export const badgeDoc: ComponentDoc = {
  name: "Badge",
  importPath: "@martech/design-system",
  importNames: ["Badge", "badgeVariants"],
  description:
    "Small label for status indicators, tags, categories, counts, and highlighted metadata.",
  whenToUse:
    "Use for ANY small label, tag, chip, pill, status indicator, category marker, count badge, 'New' / 'Popular' / 'Beta' labels, or plan tier names in Figma.",

  props: [
    {
      name: "variant",
      type: "'default' | 'secondary' | 'destructive' | 'outline'",
      required: false,
      defaultValue: "default",
      description: "Visual style of the badge.",
      aiContentHint:
        "Choose 'default' for primary emphasis (active status, featured), 'secondary' for neutral tags/categories, 'destructive' for errors/alerts/warnings, 'outline' for subtle/muted labels.",
      figmaPropertyName: "Variant",
    },
    {
      name: "children",
      type: "React.ReactNode",
      required: true,
      description: "Badge label text.",
      aiContentHint:
        "Very short text (1–3 words). Examples: 'New', 'Popular', 'Beta', 'Pro', 'Free', 'In Stock', '3 left', 'Featured'.",
    },
    {
      name: "className",
      type: "string",
      required: false,
      description: "Additional Tailwind classes for custom colours and sizing from Figma.",
      aiContentHint:
        "Override background/text colours to match Figma exactly if they don't match a variant. e.g., 'bg-green-100 text-green-800 border-green-200'.",
    },
  ],

  slots: [
    {
      name: "children",
      description: "The badge label text.",
      aiContentHint: "1–3 words maximum. Match Figma text exactly.",
    },
  ],

  variants: {
    variant: {
      options: ["default", "secondary", "destructive", "outline"],
      description: "Controls background, text, and border colour.",
      aiSelectionHint:
        "Match Figma fill: brand-coloured fill → 'default', grey/neutral fill → 'secondary', red fill → 'destructive', bordered with no fill → 'outline'. For custom colours, use 'outline' + className overrides.",
    },
  },

  trackingEvents: [
    {
      eventName: "Badge Clicked",
      trigger: "onClick (only if badge is interactive/filterable)",
      properties: {
        label: "Badge text",
        page: "Current page route",
        action: "filter | navigate | dismiss",
      },
      codeSnippet: `onClick={() => trackEvent("Badge Clicked", { label: "Popular", page: "/products", action: "filter" })}`,
    },
  ],

  figmaMapping: {
    figmaNodeTypes: ["INSTANCE", "COMPONENT", "FRAME"],
    layerNameKeywords: ["badge", "tag", "chip", "pill", "label", "status", "indicator"],
    visualCues: [
      "Small rounded-full or rounded-md rectangle with centred text",
      "Height 20–28px, text 10–12px",
      "Often positioned in top-right of a card or next to a heading",
      "Coloured background (green for success, red for error, grey for neutral)",
    ],
  },

  a11y: [
    "Use aria-label if badge meaning isn't clear from context",
    "For status badges, consider role='status' or aria-live='polite'",
    "Ensure minimum 4.5:1 contrast ratio between badge text and background",
  ],

  responsiveNotes: [
    "Badges typically don't change size across breakpoints",
    "In card grids, badges should remain visible and not overflow",
    "For tag lists, use flex-wrap to handle overflow on mobile",
  ],

  exampleCode: `import { Badge } from "@martech/design-system";

{/* Status badge */}
<Badge variant="default">New</Badge>

{/* Category tag */}
<Badge variant="secondary">Marketing</Badge>

{/* Custom colour badge */}
<Badge variant="outline" className="border-green-500 bg-green-50 text-green-700">
  Active
</Badge>

{/* Badge next to heading */}
<div className="flex items-center gap-2">
  <h3 className="text-xl font-semibold">Enterprise Plan</h3>
  <Badge>Popular</Badge>
</div>`,
};
