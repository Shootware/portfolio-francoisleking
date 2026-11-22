import { loadAdminDataServer } from "@/lib/admin-data-server";
import { notFound } from "next/navigation";
import { DEFAULT_EXPERIENCE, DEFAULT_PERSONAL } from "@/content/defaults";
import { WorkDetailClient } from "./WorkDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
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