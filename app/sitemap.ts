// ============================================================
// SEO — sitemap.ts
// Génère le sitemap XML dynamiquement depuis les données content.
// Accessible sur : https://francoisleking.dev/sitemap.xml
// ============================================================

import type { MetadataRoute } from "next";
import { projects } from "@/content";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://francoisleking.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url:              BASE_URL,
      lastModified:     new Date(),
      changeFrequency:  "monthly",
      priority:         1,
    },
  ];

  // Pages projets dynamiques
  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url:              `${BASE_URL}/projects/${p.id}`,
    lastModified:     new Date(),
    changeFrequency:  "yearly" as const,
    priority:         0.7,
  }));

  return [...staticPages, ...projectPages];
}
