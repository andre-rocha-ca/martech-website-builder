# Martech Website Builder

Automated **Figma → Next.js → AWS Amplify** pipeline with an AI-synced **Design System**, **AI-ready component documentation**, and **full Segment CDP tracking** on every click and view. Publish a design in Figma and get a live, pixel-perfect, tracked page in seconds.

## Create a Page in One Command

```bash
pnpm create-page -- "https://figma.com/design/abc123/MyFile"
```

What happens:

1. Figma design is extracted (nodes, styles, assets, tokens)
2. AI generates pixel-perfect React/Next.js code using `@martech/design-system`
3. Component docs tell the AI exactly what each prop/slot means and what content to fill
4. Every click and view is tracked with Segment CDP automatically
5. Code is pushed to `design/*` branch → Amplify auto-deploys a preview

Every generated page is mobile-first, accessible, and fully tracked out of the box.

## Architecture

```
Figma Design System file
  → pnpm ds:sync detects component changes
    → OpenAI generates React components + AI documentation (.doc.ts)
      → @martech/design-system rebuilds (components + docs registry)

Figma Page design
  → pnpm create-page (or webhook → /api/webhooks/figma)
    → Figma API extracts design data
      → OpenAI reads component docs registry for pixel-perfect generation
        → TrackedSection wraps each section with IntersectionObserver
          → AutoClickTracker captures every button/link click
            → Git push → Amplify preview deployment
```

## Monorepo Structure

```
martech-website-builder/                    # Turborepo + pnpm workspaces
├── apps/
│   └── web/                                # Next.js 15 Page Builder
│       ├── app/                            # App Router
│       │   ├── layout.tsx                  # Root layout + SegmentScript
│       │   ├── (generated)/               # AI-generated pages land here
│       │   └── api/webhooks/figma/        # Figma webhook endpoint
│       ├── components/layout/
│       │   └── SegmentScript.tsx           # Segment CDP: auto-tracking, TrackedSection, helpers
│       ├── lib/services/
│       │   ├── openai.service.ts           # AI generation with component docs in prompt
│       │   ├── figma.service.ts            # Figma API extraction
│       │   └── git.service.ts              # Git automation
│       └── scripts/
│           ├── create-page.ts              # One-command page creation
│           └── generate-design.ts          # Full pipeline orchestrator
├── packages/
│   └── design-system/                      # @martech/design-system
│       ├── src/
│       │   ├── components/ui/              # shadcn/ui components
│       │   ├── docs/                       # AI-ready component documentation
│       │   │   ├── button.doc.ts           # Props, slots, variants, tracking, examples
│       │   │   ├── card.doc.ts
│       │   │   ├── input.doc.ts
│       │   │   ├── badge.doc.ts
│       │   │   ├── separator.doc.ts
│       │   │   ├── navigation-menu.doc.ts
│       │   │   ├── serialize.ts            # Registry → JSON for OpenAI prompt
│       │   │   └── index.ts               # Doc registry aggregator
│       │   ├── types/
│       │   │   ├── component-doc.types.ts  # ComponentDoc, PropDoc, SlotDoc, TrackingEventDoc
│       │   │   └── figma-component.types.ts
│       │   ├── tokens/                     # Design tokens
│       │   └── index.ts                    # Barrel export (components + docs)
│       └── scripts/
│           └── sync-figma-components.ts    # Figma sync + auto doc generation
├── docs/                                   # Project documentation (.docx)
├── amplify.yml                             # Amplify build config (monorepo-aware)
├── turbo.json                              # Task pipeline
└── package.json                            # Root scripts
```

## AI-Ready Component Documentation

Every DS component has a `.doc.ts` file that tells the AI exactly how to use it:

- **Props**: type, default, description, and `aiContentHint` (e.g., "CTA text like 'Get Started'")
- **Slots**: what content goes where, with `aiContentHint` for each slot
- **Variants**: options with `aiSelectionHint` (e.g., "solid fill → 'default', bordered → 'outline'")
- **Tracking events**: Segment event name, trigger, properties, and ready-to-paste code
- **Figma mapping**: node types, layer name keywords, visual cues to match design elements
- **Accessibility**: requirements the AI must follow
- **Responsive notes**: mobile-first rules per component
- **Example code**: complete working example with tracking

When you run `pnpm ds:sync`, new components automatically get both code and documentation generated.

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd martech-website-builder
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

| Variable | Where to get it |
|---|---|
| `FIGMA_API_TOKEN` | Figma → Settings → Personal access tokens |
| `FIGMA_DS_FILE_KEY` | Figma URL of your DS file: `figma.com/design/FILE_KEY/...` |
| `FIGMA_WEBHOOK_SECRET` | Choose any strong secret string |
| `FIGMA_TEAM_ID` | Figma URL: `figma.com/files/team/TEAM_ID/...` |
| `OPENAI_API_KEY` | platform.openai.com → API Keys |
| `NEXT_PUBLIC_SEGMENT_WRITE_KEY` | Segment → Sources → JavaScript → Write Key |
| `GITHUB_TOKEN` | GitHub → Settings → Developer settings → Fine-grained tokens |

### 3. Build the Design System

```bash
pnpm ds:build
```

### 4. Create Your First Page

```bash
pnpm create-page -- "https://figma.com/design/YOUR_FILE_KEY/DesignName"
```

Or with options:

```bash
pnpm create-page -- abc123 --no-git        # Local only
pnpm create-page -- abc123 --page hero      # Single page
pnpm create-page -- abc123 --dry-run        # Preview without writing
```

### 5. Deploy to AWS Amplify

1. Push to GitHub
2. Connect repo in [Amplify Console](https://console.aws.amazon.com/amplify/)
3. Set env vars in Amplify → App settings → Environment variables
4. Enable branch auto-detection for `design/*` branches

## CLI Scripts

| Script | Description |
|---|---|
| `pnpm create-page -- <url-or-key>` | Create a page from Figma (easiest way) |
| `pnpm generate -- <file-key>` | Full pipeline: extract → generate → git push |
| `pnpm ds:sync` | Sync DS components + docs from Figma |
| `pnpm ds:build` | Build the Design System package |
| `pnpm dev` | Start all packages in dev mode |
| `pnpm build` | Build everything (DS first, then web) |

## Segment Tracking Coverage

Every generated page includes automatic tracking with zero manual effort:

**Automatic (via AutoClickTracker + TrackedSection):**
- Page views on every route change (SPA navigation)
- Button clicks on every `<button>` and `role="button"` element
- Link clicks on every `<a>` tag (internal and external)
- Section views when each section enters the viewport (IntersectionObserver)
- Card views when individual cards enter the viewport

**Explicit helpers available to the AI:**
- `trackButtonClick(label, page, extra)` — with section, variant context
- `trackLinkClick(href, page, extra)` — with section, label context
- `trackFormSubmit(formName, page, extra)` — on form submission
- `trackSectionView(sectionName, page)` — scroll-based
- `trackEvent(name, properties)` — custom events

**Custom data attributes for advanced tracking:**
- `data-track-event="Custom Event"` — fires a custom event on click
- `data-track-label="My Label"` — overrides the auto-detected label
- `data-section="Hero"` — associates clicks with a section name

## License

Private — ContaAzul
# martech-website-builder
