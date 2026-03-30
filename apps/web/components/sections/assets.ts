/**
 * Shared asset paths for the Relatórios page.
 *
 * Icons — local SVGs from packages/design-system/assets/icons/, served from /public/assets/icons/.
 * Hero images — persistent Figma MCP CDN URLs (run `pnpm download-assets` to localise for production).
 *
 * Color notes:
 *   All SVGs are filled with #536574 (CA gray).
 *   Use CSS filter helpers to tint them:
 *     white context  → className="icon-white"   (filter: brightness(0) invert(1))
 *     blue context   → className="icon-blue"    (filter: brightness(0) saturate(100%) ... #2687e9)
 *     dark context   → use as-is (gray reads fine)
 */

// ─── Local SVG icons ────────────────────────────────────────
export const imgGraphIcon = "/assets/icons/graph.svg";
export const imgCheckCircle = "/assets/icons/check.svg";
export const imgArrowRight = "/assets/icons/seta_direita.svg";
export const imgArrowDown = "/assets/icons/seta_down.svg";
export const imgArrowUp = "/assets/icons/seta_up.svg";
export const imgArrowClose = "/assets/icons/seta_down.svg"; // rotated 180° in CSS
export const imgWhatsapp = "/assets/icons/whatsapp.svg";

// ─── Hero background images (Figma CDN) ─────────────────────
export const imgHeroDesktop =
  "https://www.figma.com/api/mcp/asset/e192b86d-0c3a-41ad-9172-ab545aa2b216";
export const imgHeroMobile =
  "https://www.figma.com/api/mcp/asset/4958a48a-5eb3-49a4-bcb1-222ce6a7cc8c";

// ─── Legacy Figma CDN (kept for divider, unused in main page) ─
export const imgDivider =
  "https://www.figma.com/api/mcp/asset/76c5fd63-8729-44ed-9487-48154618574c";
