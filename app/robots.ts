// ============================================================
// SEO — robots.ts
// Accessible sur : https://francoisleking.dev/robots.txt
// ============================================================

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow:     "/",
      disallow:  ["/api/"],   // empêche l'indexation des routes API
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://francoisleking.dev"}/sitemap.xml`,
  };
}
