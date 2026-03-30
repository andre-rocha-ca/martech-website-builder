import type { ComponentDocRegistry } from "../types/component-doc.types";

/**
 * Serialize a component doc registry to a compact JSON string
 * suitable for inclusion in an OpenAI system prompt.
 */
export function serializeRegistryForPrompt(registry: ComponentDocRegistry): string {
  const compact = {
    version: registry.version,
    globalTrackingSetup: registry.globalTrackingSetup,
    globalImports: registry.globalImports,
    components: registry.components.map((c) => ({
      name: c.name,
      importPath: c.importPath,
      importNames: c.importNames,
      description: c.description,
      whenToUse: c.whenToUse,
      props: c.props.map((p) => ({
        name: p.name,
        type: p.type,
        required: p.required,
        defaultValue: p.defaultValue,
        description: p.description,
        aiContentHint: p.aiContentHint,
        figmaPropertyName: p.figmaPropertyName,
      })),
      slots: c.slots.map((s) => ({
        name: s.name,
        description: s.description,
        aiContentHint: s.aiContentHint,
        acceptsComponents: s.acceptsComponents,
      })),
      variants: c.variants,
      trackingEvents: c.trackingEvents,
      figmaMapping: c.figmaMapping,
      a11y: c.a11y,
      responsiveNotes: c.responsiveNotes,
      exampleCode: c.exampleCode,
    })),
  };
  return JSON.stringify(compact, null, 2);
}
