import { loadAdminDataServer } from "@/lib/admin-data-server";
import { SkillsSectionConsolidated } from "./SkillsSectionConsolidated";
import { DEFAULT_SKILLS } from "@/content/defaults";

export default async function SkillsSectionConsolidatedServer() {
  const adminData = await loadAdminDataServer();

  // Merge admin data with defaults - use optional chaining for safety
  const skillsData = {
    ...DEFAULT_SKILLS,
    ...adminData.skills,
    items: adminData.skills?.items ?? DEFAULT_SKILLS.items,
  };

  return <SkillsSectionConsolidated skillsData={skillsData} />;
}