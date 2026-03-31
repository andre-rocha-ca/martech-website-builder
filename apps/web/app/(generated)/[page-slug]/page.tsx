// ─── Dynamic Generated Page Route ───────────────────────────
// This is a fallback route for generated pages. In production,
// the generation pipeline creates static page.tsx files for
// each Figma page under app/(generated)/<slug>/page.tsx.
//
// This dynamic route catches any slugs that don't have a
// pre-generated static file, showing a "not yet generated" state.

interface PageProps {
  params: Promise<{ "page-slug": string }>;
}

export default async function GeneratedPage({ params }: PageProps) {
  const { "page-slug": slug } = await params;

  // In production, generated pages will be static files that
  // take priority over this dynamic route. If we reach here,
  // the page hasn't been generated yet.
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Page Not Yet Generated</h1>
      <p className="mb-6 text-gray-600">
        The page <code className="rounded bg-gray-100 px-2 py-1">/{slug}</code> hasn&apos;t been
        generated from Figma yet.
      </p>
      <p className="text-sm text-gray-400">
        Publish the corresponding design in Figma to trigger automatic generation.
      </p>
    </main>
  );
}
