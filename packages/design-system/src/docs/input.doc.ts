import type { ComponentDoc } from "../types/component-doc.types";

export const inputDoc: ComponentDoc = {
  name: "Input",
  importPath: "@martech/design-system",
  importNames: ["Input"],
  description:
    "Text input field for forms, search bars, email capture, and any single-line text entry.",
  whenToUse:
    "Use for ALL text input fields: email capture, search bars, contact forms, login/signup fields, newsletter signup, and any Figma element showing a text entry box.",

  props: [
    {
      name: "type",
      type: "string",
      required: false,
      defaultValue: "text",
      description: "HTML input type.",
      aiContentHint:
        "Use 'email' for email fields, 'password' for passwords, 'search' for search bars, 'tel' for phone numbers, 'url' for URLs.",
    },
    {
      name: "placeholder",
      type: "string",
      required: false,
      description: "Placeholder text shown when the input is empty.",
      aiContentHint:
        "Match Figma placeholder text exactly. Examples: 'Enter your email', 'Search...', 'Your name'. Keep under 30 characters.",
      figmaPropertyName: "Placeholder",
    },
    {
      name: "className",
      type: "string",
      required: false,
      description: "Additional Tailwind classes for Figma-exact sizing.",
      aiContentHint:
        "Match Figma width and height. Common: 'w-full max-w-md', 'h-12' for taller inputs. For search bars: 'rounded-full pl-10' with an icon overlay.",
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Disables the input.",
    },
  ],

  slots: [],

  variants: {},

  trackingEvents: [
    {
      eventName: "Form Field Focused",
      trigger: "onFocus",
      properties: {
        fieldName: "The input's name/label",
        fieldType: "The input type (email, search, text)",
        page: "Current page route",
        section: "Parent section name",
      },
      codeSnippet: `onFocus={() => trackEvent("Form Field Focused", { fieldName: "email", fieldType: "email", page: "/landing", section: "Newsletter" })}`,
    },
    {
      eventName: "Search Performed",
      trigger: "onKeyDown (Enter) or form submit — only for search inputs",
      properties: {
        query: "The search query text",
        page: "Current page route",
      },
      codeSnippet: `onKeyDown={(e) => { if (e.key === "Enter") trackEvent("Search Performed", { query: e.currentTarget.value, page: "/search" }) }}`,
    },
  ],

  figmaMapping: {
    figmaNodeTypes: ["FRAME", "INSTANCE", "COMPONENT"],
    layerNameKeywords: ["input", "field", "text-field", "search", "email", "textbox", "form-field"],
    visualCues: [
      "Rectangle with border and placeholder text inside",
      "Height around 40–48px",
      "Has a left icon (search magnifier, email icon) overlay",
      "Part of a form group with a label above",
    ],
  },

  a11y: [
    "Always pair with a visible <label> or aria-label",
    "Use aria-describedby for helper text or error messages",
    "For search inputs, wrap in <form role='search'>",
    "Ensure placeholder text has sufficient contrast (default handles this)",
  ],

  responsiveNotes: [
    "Mobile: full-width (w-full) in all form contexts",
    "Desktop: constrain width with max-w-sm or max-w-md for standalone inputs",
    "For inline email + button combos: flex-col on mobile, flex-row on desktop",
    "Use text-base (16px) minimum on mobile to prevent iOS zoom on focus",
  ],

  exampleCode: `import { Input, Button } from "@martech/design-system";
import { Search, Mail } from "lucide-react";
import { trackEvent, trackFormSubmit } from "@/components/layout/SegmentScript";

{/* Email capture */}
<form
  className="flex flex-col gap-2 sm:flex-row"
  onSubmit={(e) => {
    e.preventDefault();
    trackFormSubmit("Newsletter Signup", "/landing");
  }}
>
  <Input
    type="email"
    placeholder="Enter your email"
    className="w-full sm:max-w-sm"
    onFocus={() => trackEvent("Form Field Focused", { fieldName: "email", page: "/landing" })}
    required
  />
  <Button type="submit">Subscribe</Button>
</form>

{/* Search bar with icon */}
<div className="relative w-full max-w-lg">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  <Input
    type="search"
    placeholder="Search..."
    className="pl-10 rounded-full"
    onKeyDown={(e) => {
      if (e.key === "Enter") trackEvent("Search Performed", { query: e.currentTarget.value, page: "/search" });
    }}
  />
</div>`,
};
