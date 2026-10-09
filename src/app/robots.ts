import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private member area and internal endpoints.
      disallow: ["/dashboard", "/bookings", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
