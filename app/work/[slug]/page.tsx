import { loadAdminDataServer } from "@/lib/admin-data-server";
import { notFound } from "next/navigation";
import { DEFAULT_EXPERIENCE, DEFAULT_PERSONAL } from "@/content/defaults";
import { WorkDetailClient } from "./WorkDetailClient";
import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ingabadefrancois.vercel.app";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const adminData = await loadAdminDataServer();
  const experienceData = {
    ...DEFAULT_EXPERIENCE,
    ...adminData.experience,
    items: adminData.experience?.items || DEFAULT_EXPERIENCE.items,
  };
  const item = experienceData.items.find((entry: { id: string }) => entry.id === slug);

  if (!item) {
    return { title: "Expérience introuvable" };
  }

  return {
    title: `${item.title} — Expérience`,
    description: item.description,
    alternates: { canonical: `${SITE_URL}/work/${item.id}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.description,
      url: `${SITE_URL}/work/${item.id}`,
    },
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const adminData = await loadAdminDataServer();

  // Merge admin data with defaults
  const experienceData = {
    ...DEFAULT_EXPERIENCE,
    ...adminData.experience,
    items: adminData.experience?.items || DEFAULT_EXPERIENCE.items,
  };

  const item = experienceData.items.find((item: { id: string }) => item.id === slug);

  if (!item) {
    notFound();
  }

  const personalData = {
    ...DEFAULT_PERSONAL,
    ...adminData.personal,
  };

  return <WorkDetailClient item={item} personalData={personalData} />;
}
