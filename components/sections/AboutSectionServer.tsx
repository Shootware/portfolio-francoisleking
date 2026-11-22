import { loadAdminDataServer } from "@/lib/admin-data-server";
import { AboutSectionClient } from "./AboutSectionClient";
import { DEFAULT_ABOUT, DEFAULT_PERSONAL } from "@/content/defaults";

export default async function AboutSectionServer() {
  const adminData = await loadAdminDataServer();

  // Merge admin data with defaults - use optional chaining for safety
  const aboutData = {
    ...DEFAULT_ABOUT,
    ...adminData.about,
    values: adminData.about?.values ?? DEFAULT_ABOUT.values,
    stats: adminData.about?.stats ?? DEFAULT_ABOUT.stats,
    techStack: adminData.about?.techStack ?? DEFAULT_ABOUT.techStack,
  };

  const personalData = {
    ...DEFAULT_PERSONAL,
    ...adminData.personal,
  };

  return <AboutSectionClient aboutData={aboutData} personalData={personalData} />;
}