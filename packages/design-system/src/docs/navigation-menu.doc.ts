import type { ComponentDoc } from "../types/component-doc.types";

export const navigationMenuDoc: ComponentDoc = {
  name: "NavigationMenu",
  importPath: "@martech/design-system",
  importNames: [
    "NavigationMenu",
    "NavigationMenuList",
    "NavigationMenuItem",
    "NavigationMenuTrigger",
    "NavigationMenuContent",
    "NavigationMenuLink",
    "navigationMenuTriggerStyle",
  ],
  description:
    "Top-level site navigation bar with support for dropdown menus, mega menus, and simple link lists.",
  whenToUse:
    "Use for the main site header/navbar, any top navigation bar, or horizontal menu in the Figma design. Covers simple link bars, dropdown navs, and mega menus.",

  props: [
    {
      name: "className",
      type: "string",
      required: false,
      description: "Additional classes on the root NavigationMenu wrapper.",
      aiContentHint:
        "For full-width navbars: 'w-full max-w-none'. For centered: keep default. Match Figma background: 'bg-white border-b' or 'bg-transparent'.",
    },
  ],

  slots: [
    {
      name: "NavigationMenuList",
      description: "The horizontal list of nav items. Direct child of NavigationMenu.",
      aiContentHint: "Contains NavigationMenuItem children — one per top-level link or dropdown.",
      acceptsComponents: ["NavigationMenuItem"],
    },
    {
      name: "NavigationMenuItem",
      description: "A single nav slot — can be a plain link or a dropdown trigger.",
      aiContentHint:
        "For simple links: wrap a NavigationMenuLink. For dropdowns: use Trigger + Content.",
      acceptsComponents: ["NavigationMenuLink", "NavigationMenuTrigger", "NavigationMenuContent"],
    },
    {
      name: "NavigationMenuTrigger",
      description: "Clickable label that opens a dropdown/mega menu. Shows a chevron icon.",
      aiContentHint:
        "Short label (1–2 words): 'Products', 'Solutions', 'Resources'. Must match Figma nav text.",
    },
    {
      name: "NavigationMenuContent",
      description: "The dropdown panel that appears when a trigger is activated.",
      aiContentHint:
        "For simple dropdowns: list of links. For mega menus: grid of cards/sections. Match Figma dropdown layout exactly.",
      acceptsComponents: ["Card", "NavigationMenuLink"],
    },
    {
      name: "NavigationMenuLink",
      description: "A single navigation link. Use with Next.js Link via legacyBehavior + passHref.",
      aiContentHint:
        "Navigation destination text. Match Figma label: 'Home', 'About', 'Pricing', 'Blog'.",
    },
  ],

  variants: {},

  trackingEvents: [
    {
      eventName: "Navigation Clicked",
      trigger: "onClick on NavigationMenuLink",
      properties: {
        label: "The nav link text",
        href: "Destination URL",
        page: "Current page route",
        menuLevel: "'top' | 'dropdown'",
      },
      codeSnippet: `onClick={() => trackEvent("Navigation Clicked", { label: "Pricing", href: "/pricing", page: "/", menuLevel: "top" })}`,
    },
    {
      eventName: "Navigation Dropdown Opened",
      trigger: "onValueChange on NavigationMenu",
      properties: {
        menuName: "The trigger label",
        page: "Current page route",
      },
      codeSnippet: `onValueChange={(val) => { if (val) trackEvent("Navigation Dropdown Opened", { menuName: val, page: "/" }) }}`,
    },
  ],

  figmaMapping: {
    figmaNodeTypes: ["FRAME", "COMPONENT", "INSTANCE"],
    layerNameKeywords: ["nav", "navbar", "header", "menu", "navigation", "topbar", "appbar"],
    visualCues: [
      "Horizontal bar at top of the page with logo + links",
      "Contains horizontally spaced text items",
      "May have a hamburger menu icon for mobile",
      "Background: white, transparent, or dark with light text",
    ],
  },

  a11y: [
    "NavigationMenu uses role='navigation' by default — ensure only one per page or use aria-label",
    "All links must have descriptive text (no empty links)",
    "Dropdown triggers announce expanded/collapsed state automatically",
    "Include a mobile hamburger menu alternative (NavigationMenu is desktop-oriented)",
  ],

  responsiveNotes: [
    "CRITICAL: NavigationMenu is for desktop only (md: and up)",
    "On mobile, hide NavigationMenu and show a hamburger/sheet menu instead",
    "Pattern: hidden md:flex for the NavigationMenu, flex md:hidden for the mobile menu button",
    "Mobile menu should be a slide-out sheet or full-screen overlay with stacked links",
  ],

  exampleCode: `import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem,
  NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink,
  navigationMenuTriggerStyle, Button,
} from "@martech/design-system";
import Link from "next/link";
import { Menu } from "lucide-react";
import { trackEvent } from "@/components/layout/SegmentScript";

{/* Desktop nav */}
<nav className="border-b">
  <div className="container mx-auto flex items-center justify-between h-16 px-4">
    <Link href="/" className="text-xl font-bold">Logo</Link>

    {/* Desktop: NavigationMenu */}
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/features" legacyBehavior passHref>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              onClick={() => trackEvent("Navigation Clicked", { label: "Features", href: "/features", page: "/" })}
            >
              Features
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
              <li>
                <NavigationMenuLink asChild>
                  <a href="/solutions/startup" className="block p-3 rounded-md hover:bg-accent">
                    <div className="font-medium">Startups</div>
                    <p className="text-sm text-muted-foreground">Scale fast with AI</p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    {/* Mobile: hamburger */}
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  </div>
</nav>`,
};
