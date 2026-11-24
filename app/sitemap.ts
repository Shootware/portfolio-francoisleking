// ============================================================
// SEO — sitemap.ts
// Génère le sitemap XML dynamiquement depuis les données content.
// Accessible sur : https://ingabadefrancois.vercel.app/sitemap.xml
// ============================================================

import type { MetadataRoute } from "next";
import { projects, timeline } from "@/content";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ingabadefrancois.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url:              BASE_URL,
      lastModified:     new Date(),
      changeFrequency:  "monthly",
      priority:         1,
    },
    {
      url:              `${BASE_URL}/docs`,
      lastModified:     new Date(),
      changeFrequency:  "monthly",
      priority:         0.5,
    },
  ];

  // Pages projets dynamiques
  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url:              `${BASE_URL}/projects/${p.id}`,
    lastModified:     new Date(),
    changeFrequency:  "yearly" as const,
    priority:         0.7,
  }));

  const workPages: MetadataRoute.Sitemap = timeline.map((item) => ({
    url:              `${BASE_URL}/work/${item.id}`,
    lastModified:     new Date(),
    changeFrequency:  "yearly" as const,
    priority:         0.6,
  }));

  return [...staticPages, ...projectPages, ...workPages];
}
