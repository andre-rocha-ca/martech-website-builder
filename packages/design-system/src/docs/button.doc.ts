import type { ComponentDoc } from "../types/component-doc.types";

export const buttonDoc: ComponentDoc = {
  name: "Button",
  importPath: "@martech/design-system",
  importNames: ["Button", "buttonVariants"],
  description:
    "Primary interactive element for actions, CTAs, form submissions, and navigation triggers.",
  whenToUse:
    "Use for ALL clickable actions: CTAs, form submits, download triggers, navigation triggers, modal openers, and any Figma element labelled button, CTA, action, or link-button.",

  props: [
    {
      name: "variant",
      type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
      required: false,
      defaultValue: "default",
      description: "Visual style of the button.",
      aiContentHint:
        "Choose 'default' for primary CTAs, 'outline' for secondary actions, 'ghost' for toolbar/nav actions, 'destructive' for delete/remove, 'link' for text-only navigation, 'secondary' for lower-emphasis actions.",
      figmaPropertyName: "Variant",
    },
    {
      name: "size",
      type: "'default' | 'sm' | 'lg' | 'icon'",
      required: false,
      defaultValue: "default",
      description: "Size of the button.",
      aiContentHint:
        "Use 'lg' for hero CTAs and prominent actions, 'default' for standard buttons, 'sm' for compact/inline buttons, 'icon' for icon-only buttons.",
      figmaPropertyName: "Size",
    },
    {
      name: "asChild",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description:
        "Merge props onto child element instead of rendering a <button>. Use with Next.js <Link>.",
      aiContentHint: "Set to true when wrapping a <Link> for navigation buttons.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      required: true,
      description: "Button label text and/or icon.",
      aiContentHint:
        "Short, action-oriented text (2–5 words). Examples: 'Get Started', 'Sign Up Free', 'Learn More', 'Download Now'. Add a lucide-react icon if the Figma design shows one.",
    },
    {
      name: "className",
      type: "string",
      required: false,
      description:
        "Additional Tailwind classes for pixel-perfect sizing, spacing, colours from Figma.",
      aiContentHint:
        "Use to match exact Figma dimensions: width, padding, font-size, custom colours. e.g., 'w-full md:w-auto px-8 py-3 text-base'",
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Disables the button.",
    },
  ],

  slots: [
    {
      name: "children",
      description: "The button label — text, icon, or both.",
      aiContentHint:
        "Use pattern: [Icon] Text or Text [Icon]. Keep text under 5 words. Match the Figma label exactly if visible in the design data.",
      acceptsComponents: ["Icon (lucide-react)"],
    },
  ],

  variants: {
    variant: {
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      description: "Controls the visual style and emphasis level.",
      aiSelectionHint:
        "Match Figma fill: solid filled → 'default' or 'secondary', outline/bordered → 'outline', no background → 'ghost', underlined text → 'link', red/danger → 'destructive'.",
    },
    size: {
      options: ["default", "sm", "lg", "icon"],
      description: "Controls height and padding.",
      aiSelectionHint:
        "Match Figma height: ≤36px → 'sm', 40px → 'default', ≥44px → 'lg', square with icon only → 'icon'.",
    },
  },

  trackingEvents: [
    {
      eventName: "Button Clicked",
      trigger: "onClick",
      properties: {
        label: "The visible button text",
        page: "Current page route (usePathname)",
        variant: "The button variant used",
        section: "Parent section name from Figma",
      },
      codeSnippet: `onClick={() => trackButtonClick("Button Label", "/page-route", { variant: "default", section: "Hero" })}`,
    },
  ],

  figmaMapping: {
    figmaNodeTypes: ["INSTANCE", "COMPONENT", "FRAME"],
    layerNameKeywords: ["button", "btn", "cta", "action", "submit", "trigger"],
    visualCues: [
      "Rounded rectangle with text centered inside",
      "Has hover/pressed states defined",
      "Fill color matches primary/secondary palette",
      "Height between 32–56px",
    ],
  },

  a11y: [
    "Always include visible text or aria-label for icon-only buttons",
    "Use type='submit' inside forms, type='button' otherwise",
    "Ensure minimum 44x44px touch target on mobile (use size='lg' or add padding)",
    "For navigation buttons, use asChild with <Link> for proper semantics",
  ],

  responsiveNotes: [
    "Mobile: full-width (w-full) for primary CTAs in hero and footer sections",
    "Desktop: auto-width (w-auto) with appropriate padding",
    "Use size='lg' on mobile hero CTAs, size='default' in content sections",
    "Stack buttons vertically on mobile (flex-col), horizontally on desktop (flex-row)",
  ],

  exampleCode: `import { Button } from "@martech/design-system";
import { ArrowRight } from "lucide-react";
import { trackButtonClick } from "@/components/layout/SegmentScript";

{/* Primary CTA — hero section */}
<Button
  size="lg"
  className="w-full md:w-auto px-8"
  onClick={() => trackButtonClick("Get Started Free", "/landing", { section: "Hero" })}
>
  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
</Button>

{/* Secondary action */}
<Button
  variant="outline"
  onClick={() => trackButtonClick("Learn More", "/landing", { section: "Hero" })}
>
  Learn More
</Button>

{/* Navigation button */}
<Button variant="ghost" asChild>
  <Link href="/pricing">Pricing</Link>
</Button>`,
};
