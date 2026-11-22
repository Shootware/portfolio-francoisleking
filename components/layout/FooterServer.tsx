import { loadAdminDataServer } from "@/lib/admin-data-server";
import { FooterClient } from "./FooterClient";
import { DEFAULT_PERSONAL } from "@/content/defaults";

export default async function FooterServer() {
  const adminData = await loadAdminDataServer();

  // Merge admin data with defaults
  const personalData = {
    ...DEFAULT_PERSONAL,
    ...adminData.personal,
  };

  return <FooterClient personalData={personalData} />;
}