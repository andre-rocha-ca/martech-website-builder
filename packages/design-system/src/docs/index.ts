// ─── Component Documentation Registry ───────────────────────
// Auto-consumed by the page builder's OpenAI prompt to generate
// pixel-perfect, tracked, accessible pages.

import type { ComponentDocRegistry } from "../types/component-doc.types";
import { buttonDoc } from "./button.doc";
import { cardDoc } from "./card.doc";
import { inputDoc } from "./input.doc";
import { badgeDoc } from "./badge.doc";
import { separatorDoc } from "./separator.doc";
import { navigationMenuDoc } from "./navigation-menu.doc";

export { buttonDoc } from "./button.doc";
export { cardDoc } from "./card.doc";
export { inputDoc } from "./input.doc";
export { badgeDoc } from "./badge.doc";
export { separatorDoc } from "./separator.doc";
export { navigationMenuDoc } from "./navigation-menu.doc";
export { serializeRegistryForPrompt } from "./serialize";

/**
 * Complete component documentation registry.
 * Pass this to the OpenAI prompt so it knows exactly how to
 * use every DS component for pixel-perfect page generation.
 */
export const componentDocRegistry: ComponentDocRegistry = {
  version: "1.0.0",
  components: [buttonDoc, cardDoc, inputDoc, badgeDoc, separatorDoc, navigationMenuDoc],
  globalTrackingSetup: `// Segment tracking is automatically loaded via <SegmentScript /> in the root layout.
// Import tracking helpers in any component:
import {
  trackEvent,
  trackButtonClick,
  trackLinkClick,
  trackFormSubmit,
  trackSectionView,
} from "@/components/layout/SegmentScript";`,
  globalImports: [
    'import { SegmentScript } from "@/components/layout/SegmentScript";',
    'import { trackEvent, trackButtonClick, trackLinkClick, trackFormSubmit, trackSectionView } from "@/components/layout/SegmentScript";',
  ],
};
