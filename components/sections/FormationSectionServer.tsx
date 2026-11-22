import { loadAdminDataServer } from "@/lib/admin-data-server";
import { FormationSectionClient } from "./FormationSectionClient";
import { DEFAULT_EXPERIENCE } from "@/content/defaults";

export default async function FormationSectionServer() {
  const adminData = await loadAdminDataServer();
  type AdminItem = Record<string, unknown>;
  const asString = (value: unknown, fallback = "") => typeof value === "string" ? value : fallback;
  const asStringArray = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  const asBoolean = (value: unknown) => value === true;
  const asNumber = (value: unknown, fallback: number) => typeof value === "number" ? value : fallback;

  // Extract education items from admin data or use defaults
  const adminItems = Array.isArray(adminData.experience?.items)
    ? adminData.experience.items as AdminItem[]
    : [];
  const adminEducation = adminItems.filter((item) => item.type === "education");

  // Map to EducationItem format
  const educationItems = adminEducation.map((item, index) => ({
    id: asString(item.id, `edu-${index}`),
    type: (item.educationType || "degree") as "degree" | "certification" | "training" | "self-taught",
    title: asString(item.role, asString(item.title)),
    institution: asString(item.company, asString(item.organization)),
    location: asString(item.location) || undefined,
    startDate: asString(item.startDate),
    endDate: asString(item.endDate) || null,
    current: asBoolean(item.current),
    description: asString(item.description),
    highlights: asStringArray(item.highlights),
    technologies: asStringArray(item.technologies),
    credentialUrl: asString(item.credentialUrl) || undefined,
    orderIndex: asNumber(item.orderIndex, index),
  }));

  // Use default education items if admin data is empty
  const defaultEducationItems = DEFAULT_EXPERIENCE.items
    .filter((item) => item.type === "education")
    .map((item, index) => ({
      id: item.id,
      type: "degree" as const,
      title: item.role,
      institution: item.company,
      location: item.location,
      startDate: item.startDate,
      endDate: item.endDate,
      current: item.current,
      description: item.description,
      highlights: item.highlights || [],
      technologies: item.technologies || [],
      credentialUrl: undefined,
      orderIndex: item.orderIndex || index,
    }));

  const educationData = {
    items: educationItems.length > 0 ? educationItems : defaultEducationItems,
  };

  return <FormationSectionClient educationData={educationData} />;
}
