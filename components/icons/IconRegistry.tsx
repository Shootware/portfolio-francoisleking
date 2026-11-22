"use client";

import { LUCIDE_ICON_MAP } from "./sources/lucide";
import { LOTTIE_ANIMATIONS } from "./sources/lottie";
import { LORDICON_COLLECTION } from "./sources/lordicon";
import { ICONSAX_ICON_MAP } from "./sources/iconsax";

/**
 * Icon Registry
 * Centralized registry of all available icons across all sources
 * Used for icon pickers, admin forms, and validation
 */

export interface RegisteredIcon {
  id: string; // Unique identifier: "source:name"
  source: "lucide" | "lottie" | "lordicon" | "iconsax";
  name: string; // Display name
  originalName: string; // Original source-specific name
  category: string;
  tags: string[];
  previewUrl?: string; // For LordIcon/Lottie previews
  defaultOptions?: object;
}

export interface IconCategory {
  id: string;
  name: string;
  description: string;
  icons: RegisteredIcon[];
}

/**
 * Build the complete registry from all sources
 */
function buildRegistry(): RegisteredIcon[] {
  const icons: RegisteredIcon[] = [];

  // Lucide Icons
  Object.entries(LUCIDE_ICON_MAP).forEach(([key, value]) => {
    icons.push({
      id: `lucide:${value}`,
      source: "lucide",
      name: key.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      originalName: value,
      category: getLucideCategory(key),
      tags: [key, ...getLucideTags(key)],
    });
  });

  // Lottie Animations
  Object.entries(LOTTIE_ANIMATIONS).forEach(([key, value]) => {
    icons.push({
      id: `lottie:${key}`,
      source: "lottie",
      name: value.name,
      originalName: key,
      category: "animations",
      tags: [key, ...(value.defaultOptions ? Object.keys(value.defaultOptions) : [])],
      defaultOptions: value.defaultOptions,
    });
  });

  // LordIcon
  Object.entries(LORDICON_COLLECTION).forEach(([key, value]) => {
    icons.push({
      id: `lordicon:${key}`,
      source: "lordicon",
      name: value.name,
      originalName: key,
      category: value.category || "general",
      tags: value.tags || [key],
      previewUrl: value.src,
      defaultOptions: {
        trigger: value.defaultTrigger,
        colors: value.defaultColors,
      },
    });
  });

  // Iconsax
  Object.entries(ICONSAX_ICON_MAP).forEach(([key, value]) => {
    icons.push({
      id: `iconsax:${key}`,
      source: "iconsax",
      name: key.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      originalName: value.baseName,
      category: value.category,
      tags: value.tags || [key],
      defaultOptions: {
        variant: "outline",
      },
    });
  });

  return icons;
}

/**
 * Categorize Lucide icons based on their names
 */
function getLucideCategory(key: string): string {
  const navigation = ["menu", "x", "chevron", "arrow", "navigation"];
  const actions = ["download", "upload", "send", "copy", "link", "external", "share", "edit", "delete", "save", "refresh", "search", "filter", "sort"];
  const status = ["check", "x", "alert", "info", "loader", "error", "warning", "success"];
  const content = ["code", "terminal", "database", "server", "cpu", "monitor", "smartphone", "tablet", "layout", "grid", "layers", "image", "video", "music", "file", "folder"];
  const social = ["github", "linkedin", "twitter", "mail", "map-pin", "phone", "message"];
  const people = ["user", "users", "graduation", "book", "briefcase", "folder-git"];
  const design = ["palette", "pen", "eye", "move", "rotate", "zoom"];
  const security = ["shield", "lock", "unlock", "key", "settings", "cog"];
  const time = ["calendar", "clock", "timer"];
  if (navigation.some((n) => key.includes(n))) return "navigation";
  if (actions.some((a) => key.includes(a))) return "actions";
  if (status.some((s) => key.includes(s))) return "status";
  if (content.some((c) => key.includes(c))) return "content";
  if (social.some((s) => key.includes(s))) return "social";
  if (people.some((p) => key.includes(p))) return "people";
  if (design.some((d) => key.includes(d))) return "design";
  if (security.some((s) => key.includes(s))) return "security";
  if (time.some((t) => key.includes(t))) return "time";
  return "misc";
}

function getLucideTags(key: string): string[] {
  // Generate tags from the key
  return key.split("-");
}

// Build registry once
const REGISTRY = buildRegistry();

/**
 * Get all registered icons
 */
export function getAllIcons(): RegisteredIcon[] {
  return REGISTRY;
}

/**
 * Get icons by source
 */
export function getIconsBySource(source: "lucide" | "lottie" | "lordicon" | "iconsax"): RegisteredIcon[] {
  return REGISTRY.filter((icon) => icon.source === source);
}

/**
 * Get icons by category
 */
export function getIconsByCategory(category: string): RegisteredIcon[] {
  return REGISTRY.filter((icon) => icon.category === category);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return [...new Set(REGISTRY.map((icon) => icon.category))].sort();
}

/**
 * Get icon by ID
 */
export function getIconById(id: string): RegisteredIcon | undefined {
  return REGISTRY.find((icon) => icon.id === id);
}

/**
 * Search icons by query (name, tags, category)
 */
export function searchIcons(query: string): RegisteredIcon[] {
  const lowerQuery = query.toLowerCase();
  return REGISTRY.filter(
    (icon) =>
      icon.name.toLowerCase().includes(lowerQuery) ||
      icon.originalName.toLowerCase().includes(lowerQuery) ||
      icon.category.toLowerCase().includes(lowerQuery) ||
      icon.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get icon categories with counts for UI display
 */
export function getIconCategories(): IconCategory[] {
  const categories = getAllCategories();
  return categories.map((category) => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
    description: getCategoryDescription(category),
    icons: getIconsByCategory(category),
  }));
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    navigation: "Navigation and directional icons",
    actions: "Action and interaction icons",
    status: "Status and feedback indicators",
    content: "Content and media icons",
    social: "Social and communication icons",
    people: "People and team icons",
    design: "Design and creative tools",
    security: "Security and settings icons",
    time: "Time and calendar icons",
    animations: "Lottie animations",
    tech: "Technology and development icons",
    celebration: "Celebration and achievement icons",
    misc: "Miscellaneous icons",
    general: "General purpose icons",
  };
  return descriptions[category] || category;
}

/**
 * Icon picker data structure for admin UI
 */
export interface IconPickerData {
  sources: Array<{
    id: "lucide" | "lottie" | "lordicon" | "iconsax";
    name: string;
    description: string;
    iconCount: number;
  }>;
  categories: IconCategory[];
  totalIcons: number;
}

export function getIconPickerData(): IconPickerData {
  const sources = [
    {
      id: "lucide" as const,
      name: "Lucide",
      description: "Clean, consistent SVG icons",
      iconCount: getIconsBySource("lucide").length,
    },
    {
      id: "lottie" as const,
      name: "Lottie",
      description: "Animated illustrations from LottieFiles/Flow",
      iconCount: getIconsBySource("lottie").length,
    },
    {
      id: "lordicon" as const,
      name: "LordIcon",
      description: "Animated icons with trigger interactions",
      iconCount: getIconsBySource("lordicon").length,
    },
    {
      id: "iconsax" as const,
      name: "Iconsax",
      description: "Modern icon set with multiple variants",
      iconCount: getIconsBySource("iconsax").length,
    },
  ];

  return {
    sources,
    categories: getIconCategories(),
    totalIcons: REGISTRY.length,
  };
}

/**
 * Validate an icon configuration
 */
export function validateIconConfig(config: { source?: string; name: string }): { valid: boolean; error?: string; icon?: RegisteredIcon } {
  if (!config.name) {
    return { valid: false, error: "Icon name is required" };
  }

  const source = config.source || "lucide";
  const id = `${source}:${config.name}`;
  const icon = getIconById(id);

  if (!icon) {
    // Try to find by name across all sources
    const found = REGISTRY.find((i) => i.originalName === config.name || i.name.toLowerCase() === config.name.toLowerCase());
    if (found) {
      return { valid: true, icon: found };
    }
    return { valid: false, error: `Icon "${config.name}" not found in source "${source}"` };
  }

  return { valid: true, icon };
}

// Export registry stats
export const ICON_REGISTRY_STATS = {
  total: REGISTRY.length,
  bySource: {
    lucide: getIconsBySource("lucide").length,
    lottie: getIconsBySource("lottie").length,
    lordicon: getIconsBySource("lordicon").length,
    iconsax: getIconsBySource("iconsax").length,
  },
  byCategory: getAllCategories().reduce(
    (acc, cat) => {
      acc[cat] = getIconsByCategory(cat).length;
      return acc;
    },
    {} as Record<string, number>
  ),
};
