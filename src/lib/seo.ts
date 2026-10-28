import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

type PageMetadataInput = {
  title: string;
  description?: string;
  path: string;
  image?: string;
  noIndex?: boolean;
};

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