import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

type PageMetadataInput = {
  title: string;
  description?: string;
  /** Path relative to the site root, e.g. "/classes". Used for the canonical URL. */
  path: string;
  image?: string;
  /** Hide from search engines (login, account pages…). */
  noIndex?: boolean;
};

/** Consistent per-page metadata: title, canonical, Open Graph, Twitter. */
export function createMetadata({
  title,
  description = siteConfig.description,
  path,
  image,
  noIndex,
}: PageMetadataInput): Metadata {
  const images = image ? [{ url: image }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images, type: "website" },
    twitter: { card: "summary_large_image", title, description, images },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}