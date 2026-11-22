import { loadAdminDataServer } from "@/lib/admin-data-server";
import { ProjectsSectionClient } from "./ProjectsSectionClient";
import { DEFAULT_PROJECTS } from "@/content/defaults";

export default async function ProjectsSectionServer() {
  const adminData = await loadAdminDataServer();

  // Merge admin data with defaults - use optional chaining for safety
  const projectsData = {
    ...DEFAULT_PROJECTS,
    ...adminData.projects,
    items: adminData.projects?.items ?? DEFAULT_PROJECTS.items,
  };

  return <ProjectsSectionClient projectsData={projectsData} />;
}