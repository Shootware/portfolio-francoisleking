import { loadAdminDataServer } from "@/lib/admin-data-server";
import { notFound } from "next/navigation";
import { DEFAULT_PROJECTS, DEFAULT_PERSONAL } from "@/content/defaults";
import { ProjectCaseStudyClient } from "./ProjectCaseStudyClient";

interface Props {
  params: Promise<{ slug: string }>;
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