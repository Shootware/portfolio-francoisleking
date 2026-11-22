import { loadAdminDataServer } from "@/lib/admin-data-server";
import { HeroSectionClient } from "./HeroSectionClient";
import { DEFAULT_HERO, DEFAULT_PERSONAL } from "@/content/defaults";

export default async function HeroSectionServer() {
  const adminData = await loadAdminDataServer();

  // Merge admin data with defaults (admin data takes precedence)
  // Use optional chaining to handle cases where adminData.hero is empty
  const heroData = {
    ...DEFAULT_HERO,
    ...adminData.hero,
    tabs: {
      ...DEFAULT_HERO.tabs,
      ...(adminData.hero?.tabs ?? {}),
    },
  };

  const personalData = {
    ...DEFAULT_PERSONAL,
    ...adminData.personal,
  };

  return <HeroSectionClient heroData={heroData} personalData={personalData} />;
}