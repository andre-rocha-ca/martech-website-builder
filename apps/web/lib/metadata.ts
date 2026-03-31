// ─── SEO / Metadata Helpers ─────────────────────────────────
// Generates Next.js Metadata objects for generated pages.

import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const SITE_NAME = "ContaAzul Martech";

export function createPageMetadata(options: {
  title: string;
  description: string;
  slug: string;
  ogImage?: string;
}): Metadata {
  const { title, description, slug, ogImage } = options;
  const url = `${BASE_URL}/${slug}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const defaultMetadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "AI-generated marketing pages — pixel-perfect from Figma, fully tracked with Segment CDP.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
  },
  robots: {
    index: true,
    follow: true,
  },
};
