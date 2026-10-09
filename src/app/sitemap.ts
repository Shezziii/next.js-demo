import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getClasses } from "@/features/classes/server/queries";

/** Public, indexable pages only (member pages and /login are excluded). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const classes = await getClasses();
  const url = (path: string) => `${siteConfig.url}${path}`;

  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/classes"), changeFrequency: "daily", priority: 0.9 },
    ...classes.map((c) => ({ url: url(`/classes/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: url("/pricing"), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/trainers"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/contact"), changeFrequency: "yearly", priority: 0.6 },
    { url: url("/register"), changeFrequency: "yearly", priority: 0.6 },
  ];
}
