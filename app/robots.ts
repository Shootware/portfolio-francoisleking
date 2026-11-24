// ============================================================
// SEO — robots.ts
// Accessible sur : https://ingabadefrancois.vercel.app/robots.txt
// ============================================================

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow:     "/",
      disallow:  ["/api/"],   // empêche l'indexation des routes API
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ingabadefrancois.vercel.app"}/sitemap.xml`,
  };
}
