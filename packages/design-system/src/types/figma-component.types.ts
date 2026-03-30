// ─── Figma Component Sync Types ─────────────────────────────

/**
 * Represents a component set (or single component) in Figma
 * that maps to a React component in our DS.
 */
export interface FigmaComponentMapping {
  /** Figma component node ID */
  figmaNodeId: string;
  /** Figma component key (stable across versions) */
  figmaKey: string;
  /** Figma component name (e.g., "Button", "Card/Default") */
  figmaName: string;
  /** Local file path relative to src/ */
  localPath: string;
  /** Component export name */
  exportName: string;
  /** Last synced Figma version hash */
  lastSyncedVersion: string;
  /** Last sync timestamp */
  lastSyncedAt: string;
  /** Whether this component has variants in Figma */
  hasVariants: boolean;
  /** Variant properties from Figma (e.g., size, state, variant) */
  variantProperties?: string[];
}

/**
 * The sync manifest tracks all component mappings and the
 * overall state of the Figma ↔ DS synchronisation.
 */
export interface SyncManifest {
  /** Figma file key being synced */
  figmaFileKey: string;
  /** Figma file name */
  figmaFileName: string;
  /** Last full sync timestamp */
  lastFullSync: string;
  /** Component mappings */
  components: FigmaComponentMapping[];
  /** Design tokens version hash */
  tokensVersion: string;
}

/**
 * Result of a diff between the current Figma state and local DS.
 */
export interface SyncDiff {
  /** Components that exist in Figma but not locally */
  added: FigmaComponentMapping[];
  /** Components that changed in Figma since last sync */
  modified: FigmaComponentMapping[];
  /** Components removed from Figma */
  removed: FigmaComponentMapping[];
  /** Whether design tokens changed */
  tokensChanged: boolean;
}
