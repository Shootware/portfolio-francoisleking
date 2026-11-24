import { loadAdminDataServer } from "@/lib/admin-data-server";
import { notFound } from "next/navigation";
import { DEFAULT_PROJECTS, DEFAULT_PERSONAL } from "@/content/defaults";
import { ProjectCaseStudyClient } from "./ProjectCaseStudyClient";
import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ingabadefrancois.vercel.app";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const adminData = await loadAdminDataServer();
  const projectsData = {
    ...DEFAULT_PROJECTS,
    ...adminData.projects,
    items: adminData.projects?.items || DEFAULT_PROJECTS.items,
  };
  const project = projectsData.items.find((item: { id: string }) => item.id === slug);

  if (!project) {
    return { title: "Projet introuvable" };
  }

  return {
    title: `${project.title} — Projet`,
    description: project.description,
    alternates: { canonical: `${SITE_URL}/projects/${project.id}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.description,
      url: `${SITE_URL}/projects/${project.id}`,
      images: [{ url: project.image, alt: project.title }],
    },
  };
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const adminData = await loadAdminDataServer();

  // Merge admin data with defaults
  const projectsData = {
    ...DEFAULT_PROJECTS,
    ...adminData.projects,
    items: adminData.projects?.items || DEFAULT_PROJECTS.items,
  };

  const project = projectsData.items.find((p: { id: string }) => p.id === slug);

  if (!project) {
    notFound();
  }

  const personalData = {
    ...DEFAULT_PERSONAL,
    ...adminData.personal,
  };

  return <ProjectCaseStudyClient project={project} personalData={personalData} />;
}
