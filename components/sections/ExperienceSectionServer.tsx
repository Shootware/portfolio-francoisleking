import { loadAdminDataServer } from "@/lib/admin-data-server";
import { ExperienceSectionClient } from "./ExperienceSectionClient";
import { DEFAULT_EXPERIENCE } from "@/content/defaults";

export default async function ExperienceSectionServer() {
  const adminData = await loadAdminDataServer();

  // Merge admin data with defaults - use optional chaining for safety
  const experienceData = {
    ...DEFAULT_EXPERIENCE,
    ...adminData.experience,
    items: adminData.experience?.items ?? DEFAULT_EXPERIENCE.items,
  };

  return <ExperienceSectionClient experienceData={experienceData} />;
}