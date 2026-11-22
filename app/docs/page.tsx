import { loadAdminDataServer } from "@/lib/admin-data-server";
import { DEFAULT_SKILLS, DEFAULT_EXPERIENCE, DEFAULT_PROJECTS, DEFAULT_PERSONAL } from "@/content/defaults";
import { DocsClient } from "./DocsClient";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function DocsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const adminData = await loadAdminDataServer();

  // Merge admin data with defaults
  const skillsData = {
    ...DEFAULT_SKILLS,
    ...adminData.skills,
    items: adminData.skills?.items || DEFAULT_SKILLS.items,
  };

  const experienceData = {
    ...DEFAULT_EXPERIENCE,
    ...adminData.experience,
    items: adminData.experience?.items || DEFAULT_EXPERIENCE.items,
  };

  const projectsData = {
    ...DEFAULT_PROJECTS,
    ...adminData.projects,
    items: adminData.projects?.items || DEFAULT_PROJECTS.items,
  };

  const personalData = {
    ...DEFAULT_PERSONAL,
    ...adminData.personal,
  };

  return <DocsClient skillsData={skillsData} experienceData={experienceData} projectsData={projectsData} personalData={personalData} initialCategory={category} />;
}