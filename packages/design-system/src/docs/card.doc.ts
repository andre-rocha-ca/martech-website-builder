import type { ComponentDoc } from "../types/component-doc.types";

export const cardDoc: ComponentDoc = {
  name: "Card",
  importPath: "@martech/design-system",
  importNames: ["Card", "CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter"],
  description:
    "Container for grouped content — feature tiles, pricing plans, testimonials, info panels, and any boxed section.",
  whenToUse:
    "Use for ANY Figma element that is a bordered/shadowed rectangle containing grouped content: feature cards, pricing tiers, testimonials, team member bios, stat cards, blog post previews, or any panel/tile/box.",

  props: [
    {
      name: "className",
      type: "string",
      required: false,
      description:
        "Additional Tailwind classes for custom sizing, hover effects, and Figma-exact spacing.",
      aiContentHint:
        "Match Figma: exact width (max-w-sm, max-w-md), padding overrides, hover effects (hover:shadow-lg transition-shadow), border radius, background color.",
    },
  ],

  slots: [
    {
      name: "CardHeader",
      description: "Top area — contains title, optional description, and optional icon/image.",
      aiContentHint:
        "Place the CardTitle and optional CardDescription here. If Figma shows an icon or badge above the title, include it before CardTitle.",
      acceptsComponents: ["CardTitle", "CardDescription", "Badge", "Icon"],
    },
    {
      name: "CardTitle",
      description: "The main heading of the card.",
      aiContentHint:
        "Short heading (2–6 words). Match the Figma text exactly. Examples: 'Lightning Fast', 'Enterprise Security', 'Free Plan'.",
    },
    {
      name: "CardDescription",
      description: "Secondary text below the title.",
      aiContentHint:
        "1–2 sentences summarizing the card content. Match Figma body text. Keep under 20 words.",
    },
    {
      name: "CardContent",
      description: "Main body area for the card's primary content.",
      aiContentHint:
        "Feature lists, body text, images, stats, or form fields. This is where the bulk of card content goes.",
      acceptsComponents: ["Button", "Input", "Badge", "Separator", "Image"],
    },
    {
      name: "CardFooter",
      description: "Bottom area — actions, links, or metadata.",
      aiContentHint:
        "Place CTAs (Button), links, price tags, or 'Learn More' actions here. Usually 1–2 buttons.",
      acceptsComponents: ["Button"],
    },
  ],

  variants: {},

  trackingEvents: [
    {
      eventName: "Card Viewed",
      trigger: "IntersectionObserver (viewport entry)",
      properties: {
        cardTitle: "The card's title text",
        page: "Current page route",
        section: "Parent section name",
        position: "Index position in grid (0-based)",
      },
      codeSnippet: `// Use a ref + IntersectionObserver for scroll tracking
const ref = useRef<HTMLDivElement>(null);
useEffect(() => {
  const el = ref.current;
  if (!el) return;
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      trackEvent("Card Viewed", { cardTitle: "Feature Title", page: "/landing", section: "Features", position: 0 });
      obs.disconnect();
    }
  }, { threshold: 0.5 });
  obs.observe(el);
  return () => obs.disconnect();
}, []);`,
    },
    {
      eventName: "Card Clicked",
      trigger: "onClick (if entire card is clickable)",
      properties: {
        cardTitle: "The card's title text",
        page: "Current page route",
        href: "Destination URL if navigable",
      },
      codeSnippet: `onClick={() => trackEvent("Card Clicked", { cardTitle: "Feature Title", page: "/landing" })}`,
    },
  ],

  figmaMapping: {
    figmaNodeTypes: ["FRAME", "COMPONENT", "INSTANCE"],
    layerNameKeywords: [
      "card",
      "tile",
      "panel",
      "box",
      "feature",
      "pricing",
      "testimonial",
      "plan",
    ],
    visualCues: [
      "Rectangle with border or shadow containing grouped text/images",
      "Vertical stack of heading + description + content",
      "Consistent spacing between repeating items in a grid",
      "Rounded corners with subtle shadow or border",
    ],
  },

  a11y: [
    "Use semantic heading level in CardTitle (default is <h3>)",
    "If the entire card is clickable, wrap in <a> or use role='link' with tabIndex",
    "Ensure sufficient color contrast between card background and text",
    "For card grids, use role='list' on the parent and role='listitem' on each card",
  ],

  responsiveNotes: [
    "Mobile: single column, full-width cards (grid-cols-1)",
    "Tablet: 2-column grid (md:grid-cols-2)",
    "Desktop: 3 or 4 column grid (lg:grid-cols-3, xl:grid-cols-4)",
    "Use gap-4 mobile, gap-6 desktop for grid spacing",
    "Cards should have min-height on mobile to prevent content cramping",
  ],

  exampleCode: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from "@martech/design-system";
import { Zap } from "lucide-react";
import { trackButtonClick, trackEvent } from "@/components/layout/SegmentScript";

{/* Feature card */}
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
      <Zap className="h-5 w-5 text-primary" />
    </div>
    <CardTitle>Lightning Fast</CardTitle>
    <CardDescription>Deploy in seconds with zero configuration.</CardDescription>
  </CardHeader>
  <CardContent>
    <ul className="space-y-2 text-sm text-muted-foreground">
      <li>Automatic optimisation</li>
      <li>Global CDN delivery</li>
      <li>99.9% uptime SLA</li>
    </ul>
  </CardContent>
  <CardFooter>
    <Button
      variant="outline"
      className="w-full"
      onClick={() => trackButtonClick("Learn More", "/landing", { section: "Features", card: "Lightning Fast" })}
    >
      Learn More
    </Button>
  </CardFooter>
</Card>`,
};
