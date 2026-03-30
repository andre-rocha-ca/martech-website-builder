// ─── OpenAI Code Generation Service ─────────────────────────
// Converts normalized Figma design data into React/Next.js components
// using OpenAI GPT-4o with JSON mode for structured output.
//
// The prompt now consumes the @martech/design-system component
// documentation registry so the AI knows exactly how to use every
// component, what text to fill, and what tracking events to fire.

import type {
  DesignFile,
  GenerationResult,
  GeneratedPage,
  GeneratedComponent,
} from "../types/design.types";
import { createLogger } from "../utils/logger";
import { componentDocRegistry, serializeRegistryForPrompt } from "@martech/design-system";

const log = createLogger("openai-service");

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// ─── Build System Prompt with Component Docs ────────────────

function buildSystemPrompt(): string {
  const registry = serializeRegistryForPrompt(componentDocRegistry);

  return `You are an expert React/Next.js developer generating production-ready pages from Figma design data. Your output must be PIXEL-PERFECT with the Figma design, MOBILE-FIRST, and FULLY TRACKED with Segment analytics.

═══ CORE RULES ═══════════════════════════════════════════════

1. PIXEL-PERFECT FIDELITY
   - Match Figma dimensions EXACTLY: widths, heights, padding, margins, gaps, font sizes, line heights, border radii, colours
   - Convert Figma px values to Tailwind classes or inline styles when no utility exists
   - Match Figma font weights, letter-spacing, and text transforms precisely
   - Reproduce the exact visual hierarchy: which elements are larger, bolder, more prominent
   - For colours not in the shadcn palette, use Tailwind arbitrary values: bg-[#FF5733], text-[#1A1A2E]
   - For spacing not in Tailwind defaults, use arbitrary values: p-[18px], gap-[22px], mt-[30px]

2. MOBILE-FIRST RESPONSIVE
   - Write all styles mobile-first: base classes for mobile, then sm:, md:, lg:, xl: for larger screens
   - Mobile: single column layouts, full-width elements, stacked navigation
   - Tablet (md:): 2-column grids, side-by-side layouts begin
   - Desktop (lg:): full multi-column layouts, horizontal navigation
   - Touch targets: minimum 44x44px on mobile for all interactive elements
   - Font sizes: minimum 16px (text-base) for body text on mobile to prevent iOS zoom

3. SEGMENT CDP TRACKING — MANDATORY ON EVERY INTERACTIVE ELEMENT
   - Every page MUST include <SegmentScript /> (loaded in root layout)
   - Every <Button> click → trackButtonClick(label, page, { section, variant })
   - Every <a>/<Link> click → trackLinkClick(href, page, { section, label })
   - Every form submit → trackFormSubmit(formName, page, { fields })
   - Every section entering viewport → trackSectionView(sectionName, page) via IntersectionObserver
   - Every card visibility → trackEvent("Card Viewed", { cardTitle, section, position })
   - Every navigation click → trackEvent("Navigation Clicked", { label, href, menuLevel })
   - Use "use client" directive on components that need tracking hooks
   - Import tracking helpers: import { trackEvent, trackButtonClick, trackLinkClick, trackFormSubmit, trackSectionView } from "@/components/layout/SegmentScript"

4. ACCESSIBILITY
   - Semantic HTML: proper heading hierarchy (h1 → h2 → h3), <nav>, <main>, <section>, <footer>
   - ARIA labels on all interactive elements, especially icon-only buttons
   - Alt text on all images (descriptive, not "image")
   - Keyboard navigable: all interactive elements focusable and operable
   - Minimum 4.5:1 contrast ratio for text

5. NEXT.JS 15 CONVENTIONS
   - App Router: app/ directory, page.tsx, layout.tsx
   - "use client" only when client-side hooks are needed (tracking, forms, state)
   - Use Next.js Image for all images
   - Named exports for components, default exports for pages

═══ COMPONENT LIBRARY — @martech/design-system ═══════════════

IMPORT RULE: Import ALL components from "@martech/design-system". NEVER from "@/components/ui/*".
IMPORT RULE: Import cn from "@martech/design-system".
IMPORT RULE: Import icons from "lucide-react".

Below is the complete component documentation registry with props, slots, variants,
AI content hints, Figma mapping rules, tracking events, and usage examples.
Use this to select the right component for each Figma element and populate it correctly.

COMPONENT REGISTRY:
${registry}

═══ FIGMA → COMPONENT MAPPING RULES ═════════════════════════

When analysing Figma design data, use these rules to select components:

1. Read each component's "figmaMapping" to match Figma node types and layer name keywords
2. Read each component's "whenToUse" to understand the selection criteria
3. For each prop, read "aiContentHint" to know what value to generate
4. For each slot, read "aiContentHint" to know what content to place there
5. For each variant, read "aiSelectionHint" to choose the right option based on Figma visual properties
6. For each trackingEvent, implement the "codeSnippet" on the component
7. Follow "a11y" requirements for each component
8. Follow "responsiveNotes" for each component's responsive behaviour

═══ SECTION-LEVEL TRACKING ═══════════════════════════════════

Every page section (hero, features, pricing, testimonials, CTA, footer) must implement
IntersectionObserver-based viewport tracking:

\`\`\`tsx
"use client";
import { useRef, useEffect } from "react";
import { trackSectionView } from "@/components/layout/SegmentScript";

function TrackedSection({ name, children }: { name: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        trackSectionView(name, window.location.pathname);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [name]);
  return <section ref={ref}>{children}</section>;
}
\`\`\`

Wrap every major page section in <TrackedSection name="Section Name">.

═══ OUTPUT FORMAT ═════════════════════════════════════════════

Return a valid JSON object with this exact structure:
{
  "components": [
    {
      "filename": "ComponentName.tsx",
      "path": "components/sections/",
      "content": "// full TSX source code with all tracking"
    }
  ],
  "pages": [
    {
      "filename": "page.tsx",
      "path": "app/(generated)/page-slug/",
      "route": "/page-slug",
      "content": "// full TSX source code — pixel-perfect, mobile-first, fully tracked"
    }
  ],
  "tailwindExtensions": {
    "colors": {},
    "spacing": {}
  }
}`;
}

// ─── Prompt Builder ─────────────────────────────────────────

function buildGenerationPrompt(designFile: DesignFile): string {
  const hasScreenshots =
    designFile.frameScreenshots && Object.keys(designFile.frameScreenshots).length > 0;

  return `Generate Next.js pages and components from this Figma design data.
Your output must be PIXEL-PERFECT with the design, MOBILE-FIRST, and every click/view tracked with Segment.
${hasScreenshots ? `\n⚠️  VISUAL REFERENCE ATTACHED: I have attached PNG screenshots of every Figma frame below this message. Use them as the ground truth for colours, layout, typography, spacing, and imagery. The JSON data supplements the screenshots — prioritise what you see visually.\n` : ""}

## Design File
- Name: ${designFile.name}
- Version: ${designFile.version}

## Design Tokens
\`\`\`json
${JSON.stringify(designFile.designTokens, null, 2)}
\`\`\`

## Pages to Generate
${designFile.pages
  .map(
    (page) => `
### Page: "${page.name}" (route: /${page.slug})
Frames: ${page.frames.length}

${page.frames
  .map(
    (frame) => `
#### Frame: "${frame.name}" (${frame.width}x${frame.height})
Background: ${frame.backgroundColor}

Elements:
\`\`\`json
${JSON.stringify(frame.elements, null, 2)}
\`\`\`
`
  )
  .join("\n")}
`
  )
  .join("\n")}

## Available Assets
${designFile.assets.map((a) => `- ${a.name}: ${a.localPath}`).join("\n")}

## Critical Requirements
1. PIXEL-PERFECT: Match every Figma dimension, colour, font, and spacing exactly
2. MOBILE-FIRST: Base styles for mobile, then sm:/md:/lg:/xl: for larger screens
3. DS COMPONENTS: Use @martech/design-system components for all UI — follow the component docs registry
4. SEGMENT TRACKING on every interactive element:
   - trackButtonClick() on every Button
   - trackLinkClick() on every link/anchor
   - trackFormSubmit() on every form
   - trackSectionView() on every page section (via IntersectionObserver)
   - trackEvent("Card Viewed") on every card (via IntersectionObserver)
5. Wrap every major section in <TrackedSection name="...">
6. Import { cn } from "@martech/design-system" for class merging
7. Import icons from "lucide-react"
8. Every page must be a valid Next.js App Router page with default export
9. Use "use client" on any component with tracking hooks, form state, or interactivity
10. Semantic HTML + full accessibility (ARIA, alt text, heading hierarchy)

Return ONLY the JSON output, no explanation.`;
}

// ─── OpenAI API Call ────────────────────────────────────────

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string; detail: "high" | "low" | "auto" } };

async function callOpenAI(designFile: DesignFile): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const model = process.env.OPENAI_MODEL || "gpt-4o";

  const screenshots = designFile.frameScreenshots ?? {};
  const screenshotCount = Object.keys(screenshots).length;
  log.info("Calling OpenAI API for code generation", { model, screenshotCount });

  const systemPrompt = buildSystemPrompt();
  const textPrompt = buildGenerationPrompt(designFile);

  // Build multimodal user content: text prompt first, then one image per frame
  const userContent: ContentPart[] = [{ type: "text", text: textPrompt }];

  if (screenshotCount > 0) {
    // Limit to first 10 frames to stay within token budget
    const entries = Object.entries(screenshots).slice(0, 10);
    for (const [frameId, url] of entries) {
      userContent.push({
        type: "image_url",
        image_url: { url, detail: "high" },
      });
      log.debug("Adding frame screenshot to prompt", { frameId });
    }
    log.info("Vision images attached to prompt", { count: entries.length });
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_completion_tokens: 16000,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${body}`);
  }

  const data = (await response.json()) as {
    choices: Array<{
      message: { content: string | null };
      finish_reason: string;
    }>;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };

  log.info("OpenAI API response received", {
    promptTokens: data.usage.prompt_tokens,
    completionTokens: data.usage.completion_tokens,
    totalTokens: data.usage.total_tokens,
    finishReason: data.choices[0]?.finish_reason,
  });

  const content = data.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No content in OpenAI response");
  }

  return content;
}

// ─── Response Parser ────────────────────────────────────────

interface GenerationOutput {
  components: Array<{
    filename: string;
    path: string;
    content: string;
  }>;
  pages: Array<{
    filename: string;
    path: string;
    route: string;
    content: string;
  }>;
  tailwindExtensions?: Record<string, unknown>;
}

function parseGenerationOutput(raw: string): GenerationOutput {
  let jsonStr = raw.trim();

  const jsonMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  try {
    const parsed = JSON.parse(jsonStr) as GenerationOutput;

    if (!parsed.components || !Array.isArray(parsed.components)) {
      throw new Error("Missing or invalid 'components' array");
    }
    if (!parsed.pages || !Array.isArray(parsed.pages)) {
      throw new Error("Missing or invalid 'pages' array");
    }

    return parsed;
  } catch (err) {
    log.error("Failed to parse OpenAI output", {
      error: err instanceof Error ? err.message : String(err),
      rawLength: raw.length,
    });
    throw new Error(
      `Failed to parse generation output: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

// ─── Main Generation Function ───────────────────────────────

export async function generateCodeFromDesign(designFile: DesignFile): Promise<GenerationResult> {
  const startTime = Date.now();
  const errors: string[] = [];

  try {
    log.info("Building generation prompt", {
      pageCount: designFile.pages.length,
      frameScreenshots: Object.keys(designFile.frameScreenshots ?? {}).length,
    });

    const rawOutput = await callOpenAI(designFile);
    const output = parseGenerationOutput(rawOutput);

    const pages: GeneratedPage[] = output.pages.map((p) => ({
      filename: p.filename,
      path: p.path,
      route: p.route,
      content: p.content,
    }));

    const components: GeneratedComponent[] = output.components.map((c) => ({
      filename: c.filename,
      path: c.path,
      content: c.content,
    }));

    const durationMs = Date.now() - startTime;

    log.info("Code generation complete", {
      pageCount: pages.length,
      componentCount: components.length,
      durationMs,
    });

    return {
      success: true,
      pages,
      components,
      designTokensConfig: (output.tailwindExtensions as Record<string, unknown>) || {},
      errors,
      metadata: {
        figmaFileId: designFile.id,
        figmaVersion: designFile.version,
        generatedAt: new Date().toISOString(),
        generationDurationMs: durationMs,
        componentCount: components.length,
        pageCount: pages.length,
        tokenCount: 0,
      },
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    errors.push(errorMsg);
    log.error("Code generation failed", { error: errorMsg });

    return {
      success: false,
      pages: [],
      components: [],
      designTokensConfig: {},
      errors,
      metadata: {
        figmaFileId: designFile.id,
        figmaVersion: designFile.version,
        generatedAt: new Date().toISOString(),
        generationDurationMs: Date.now() - startTime,
        componentCount: 0,
        pageCount: 0,
        tokenCount: 0,
      },
    };
  }
}

/**
 * Generate code for a single page (useful for incremental updates)
 */
export async function generateSinglePage(
  designFile: DesignFile,
  pageSlug: string
): Promise<GenerationResult> {
  const targetPage = designFile.pages.find((p) => p.slug === pageSlug);
  if (!targetPage) {
    throw new Error(`Page "${pageSlug}" not found in design file`);
  }

  const singlePageDesign: DesignFile = {
    ...designFile,
    pages: [targetPage],
  };

  return generateCodeFromDesign(singlePageDesign);
}
