"use client";

import React from "react";
import * as Iconsax from "iconsax-react";

/**
 * Iconsax Adapter
 * Provides a consistent interface for Iconsax React icons
 * Iconsax is a clean, modern icon set with outline and fill variants
 */

export interface IconsaxIconSource {
  name: string;
  component: React.ComponentType<IconsaxIconProps>;
  category?: string;
  tags?: string[];
}

export interface IconsaxIconProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
  "data-testid"?: string;
  // Iconsax specific
  variant?: "outline" | "fill" | "linear" | "bulk" | "two-tone";
}

/**
 * Iconsax component wrapper that handles the variant prop
 * Iconsax React exports icons as individual components with a variant prop
 */
export function IconsaxIcon({
  name,
  width = 24,
  height = 24,
  color = "currentColor",
  strokeWidth = 2,
  className = "",
  variant = "outline",
  "aria-hidden": ariaHidden = true,
  "aria-label": ariaLabel,
  ...props
}: IconsaxIconProps & { name: string }): React.ReactElement | null {
  // Iconsax React exports icons as PascalCase component names
  // e.g., HomeOutline, HomeFill, HomeLinear, etc.
  const componentName = `${name}${variant.charAt(0).toUpperCase() + variant.slice(1)}`;
  const iconComponents = Iconsax as unknown as Record<
    string,
    React.ComponentType<IconsaxIconProps> | undefined
  >;
  const IconComponent = iconComponents[componentName];

  if (!IconComponent) {
    // Try without variant suffix as fallback
    const FallbackComponent = iconComponents[name];
    if (!FallbackComponent) {
      console.warn(`Iconsax icon "${name}" (variant: ${variant}) not found`);
      return null;
    }
    // Use React.createElement to avoid JSX type issues with ComponentType
    // Iconsax components use width/height, not size
    return React.createElement(
      FallbackComponent,
      {
        width,
        height,
        color,
        strokeWidth,
        className,
        "aria-hidden": ariaHidden,
        "aria-label": ariaLabel,
        ...props,
      }
    );
  }

  return React.createElement(
    IconComponent,
    {
      width,
      height,
      color,
      strokeWidth,
      className,
      "aria-hidden": ariaHidden,
      "aria-label": ariaLabel,
      ...props,
    }
  );
}

// Map of common icon names used in the portfolio to Iconsax component names
// Iconsax uses specific naming: Home, Search, User, etc. with variant suffixes
export const ICONSAX_ICON_MAP: Record<string, { baseName: string; category: string; tags: string[] }> = {
  // Navigation
  "home": { baseName: "Home", category: "navigation", tags: ["home", "dashboard", "main"] },
  "menu": { baseName: "Menu", category: "navigation", tags: ["menu", "hamburger", "navigation"] },
  "close": { baseName: "Close", category: "navigation", tags: ["close", "x", "dismiss"] },
  "chevron-left": { baseName: "ArrowLeft", category: "navigation", tags: ["chevron", "left", "back"] },
  "chevron-right": { baseName: "ArrowRight", category: "navigation", tags: ["chevron", "right", "forward"] },
  "chevron-up": { baseName: "ArrowUp", category: "navigation", tags: ["chevron", "up", "collapse"] },
  "chevron-down": { baseName: "ArrowDown", category: "navigation", tags: ["chevron", "down", "expand"] },
  "arrow-left": { baseName: "ArrowLeft", category: "navigation", tags: ["arrow", "left", "back"] },
  "arrow-right": { baseName: "ArrowRight", category: "navigation", tags: ["arrow", "right", "forward"] },
  "arrow-up": { baseName: "ArrowUp", category: "navigation", tags: ["arrow", "up"] },
  "arrow-down": { baseName: "ArrowDown", category: "navigation", tags: ["arrow", "down"] },

  // Actions
  "download": { baseName: "Download", category: "actions", tags: ["download", "save", "export"] },
  "upload": { baseName: "Upload", category: "actions", tags: ["upload", "import", "send"] },
  "send": { baseName: "Send", category: "actions", tags: ["send", "submit", "mail"] },
  "copy": { baseName: "Copy", category: "actions", tags: ["copy", "clipboard", "duplicate"] },
  "link": { baseName: "Link", category: "actions", tags: ["link", "url", "chain"] },
  "external-link": { baseName: "ExternalLink", category: "actions", tags: ["external", "link", "open"] },
  "share": { baseName: "Share", category: "actions", tags: ["share", "social", "network"] },
  "edit": { baseName: "Edit", category: "actions", tags: ["edit", "pencil", "modify"] },
  "delete": { baseName: "Trash", category: "actions", tags: ["delete", "trash", "remove"] },
  "save": { baseName: "Save", category: "actions", tags: ["save", "disk", "store"] },
  "refresh": { baseName: "Refresh", category: "actions", tags: ["refresh", "reload", "sync"] },
  "search": { baseName: "Search", category: "actions", tags: ["search", "find", "magnifier"] },
  "filter": { baseName: "Filter", category: "actions", tags: ["filter", "funnel", "sort"] },
  "sort": { baseName: "Sort", category: "actions", tags: ["sort", "order", "arrange"] },

  // Status & Feedback
  "check": { baseName: "Tick", category: "status", tags: ["check", "success", "done", "complete"] },
  "check-circle": { baseName: "TickCircle", category: "status", tags: ["check", "success", "circle", "verified"] },
  "x": { baseName: "Close", category: "status", tags: ["x", "cancel", "error", "close"] },
  "x-circle": { baseName: "CloseCircle", category: "status", tags: ["error", "cancel", "circle"] },
  "alert": { baseName: "Warning", category: "status", tags: ["alert", "warning", "caution", "attention"] },
  "alert-circle": { baseName: "WarningCircle", category: "status", tags: ["alert", "warning", "circle"] },
  "info": { baseName: "Info", category: "status", tags: ["info", "information", "help"] },
  "info-circle": { baseName: "InfoCircle", category: "status", tags: ["info", "help", "circle"] },
  "loader": { baseName: "Loading", category: "status", tags: ["loader", "loading", "spinner", "progress"] },

  // Content & Media
  "code": { baseName: "Code", category: "content", tags: ["code", "programming", "development", "brackets"] },
  "terminal": { baseName: "Terminal", category: "content", tags: ["terminal", "cli", "command", "console"] },
  "database": { baseName: "Database", category: "content", tags: ["database", "storage", "data", "server"] },
  "server": { baseName: "Server", category: "content", tags: ["server", "cloud", "hosting", "backend"] },
  "cpu": { baseName: "Cpu", category: "content", tags: ["cpu", "processor", "chip", "hardware"] },
  "monitor": { baseName: "Monitor", category: "content", tags: ["monitor", "screen", "display", "frontend"] },
  "smartphone": { baseName: "Phone", category: "content", tags: ["phone", "mobile", "smartphone", "responsive"] },
  "tablet": { baseName: "Tablet", category: "content", tags: ["tablet", "ipad", "mobile", "responsive"] },
  "layout": { baseName: "Layout", category: "content", tags: ["layout", "grid", "structure", "design"] },
  "grid": { baseName: "Grid", category: "content", tags: ["grid", "layout", "structure"] },
  "layers": { baseName: "Layers", category: "content", tags: ["layers", "stack", "architecture"] },
  "image": { baseName: "Image", category: "content", tags: ["image", "picture", "photo", "gallery"] },
  "video": { baseName: "Video", category: "content", tags: ["video", "play", "media", "film"] },
  "music": { baseName: "Music", category: "content", tags: ["music", "audio", "sound", "media"] },
  "file": { baseName: "File", category: "content", tags: ["file", "document", "page"] },
  "folder": { baseName: "Folder", category: "content", tags: ["folder", "directory", "files"] },
  "folder-open": { baseName: "FolderOpen", category: "content", tags: ["folder", "open", "directory"] },

  // Social & Communication
  "github": { baseName: "Github", category: "social", tags: ["github", "git", "repository", "code"] },
  "gitlab": { baseName: "Gitlab", category: "social", tags: ["gitlab", "git", "repository", "ci"] },
  "linkedin": { baseName: "Linkedin", category: "social", tags: ["linkedin", "professional", "network", "career"] },
  "twitter": { baseName: "Twitter", category: "social", tags: ["twitter", "x", "social", "tweet"] },
  "mail": { baseName: "Mail", category: "social", tags: ["mail", "email", "envelope", "message"] },
  "map-pin": { baseName: "Location", category: "social", tags: ["location", "map", "pin", "address"] },
  "phone": { baseName: "Phone", category: "social", tags: ["phone", "call", "contact"] },
  "message": { baseName: "Message", category: "social", tags: ["message", "chat", "chat", "sms"] },

  // People & Team
  "user": { baseName: "User", category: "people", tags: ["user", "person", "profile", "account"] },
  "users": { baseName: "Users", category: "people", tags: ["users", "team", "group", "collaboration"] },
  "user-plus": { baseName: "UserAdd", category: "people", tags: ["user", "add", "invite", "team"] },
  "graduation-cap": { baseName: "Graduation", category: "people", tags: ["graduation", "education", "degree", "learning"] },
  "book": { baseName: "Book", category: "people", tags: ["book", "read", "education", "knowledge"] },
  "book-open": { baseName: "BookOpen", category: "people", tags: ["book", "open", "read", "study"] },
  "briefcase": { baseName: "Briefcase", category: "people", tags: ["briefcase", "work", "job", "career", "professional"] },
  "folder-git": { baseName: "Folder", category: "people", tags: ["folder", "git", "project", "repository"] },

  // Design & Creative
  "palette": { baseName: "Palette", category: "design", tags: ["palette", "colors", "design", "theme"] },
  "pen-tool": { baseName: "Pen", category: "design", tags: ["pen", "draw", "design", "vector", "creative"] },
  "eye": { baseName: "Eye", category: "design", tags: ["eye", "view", "preview", "visibility", "show"] },
  "eye-off": { baseName: "EyeSlash", category: "design", tags: ["eye", "hide", "invisible", "hidden"] },
  "move": { baseName: "Move", category: "design", tags: ["move", "drag", "select", "tool"] },
  "rotate": { baseName: "Rotate", category: "design", tags: ["rotate", "turn", "transform"] },
  "zoom-in": { baseName: "ZoomIn", category: "design", tags: ["zoom", "in", "magnify", "enlarge"] },
  "zoom-out": { baseName: "ZoomOut", category: "design", tags: ["zoom", "out", "shrink", "reduce"] },

  // Security & Settings
  "shield": { baseName: "Shield", category: "security", tags: ["shield", "security", "protection", "safe"] },
  "lock": { baseName: "Lock", category: "security", tags: ["lock", "secure", "private", "encrypted"] },
  "unlock": { baseName: "Unlock", category: "security", tags: ["unlock", "open", "access", "public"] },
  "key": { baseName: "Key", category: "security", tags: ["key", "access", "auth", "credential"] },
  "settings": { baseName: "Setting", category: "security", tags: ["settings", "gear", "cog", "configuration"] },
  "cog": { baseName: "Setting", category: "security", tags: ["settings", "gear", "cog", "configuration"] },

  // Time & Calendar
  "calendar": { baseName: "Calendar", category: "time", tags: ["calendar", "date", "schedule", "event"] },
  "clock": { baseName: "Clock", category: "time", tags: ["clock", "time", "timer", "schedule"] },
  "timer": { baseName: "Timer", category: "time", tags: ["timer", "countdown", "stopwatch"] },

  // Miscellaneous
  "star": { baseName: "Star", category: "misc", tags: ["star", "favorite", "rating", "bookmark"] },
  "heart": { baseName: "Heart", category: "misc", tags: ["heart", "like", "love", "favorite"] },
  "tag": { baseName: "Tag", category: "misc", tags: ["tag", "label", "category", "price"] },
  "hash": { baseName: "Hash", category: "misc", tags: ["hash", "tag", "number", "sharp"] },
  "git-branch": { baseName: "GitBranch", category: "misc", tags: ["git", "branch", "version-control", "merge"] },
  "git-commit": { baseName: "GitCommit", category: "misc", tags: ["git", "commit", "version-control"] },
  "git-merge": { baseName: "GitMerge", category: "misc", tags: ["git", "merge", "version-control"] },
  "git-pull-request": { baseName: "GitPullRequest", category: "misc", tags: ["git", "pull-request", "pr", "review"] },
  "archive": { baseName: "Archive", category: "misc", tags: ["archive", "box", "storage", "backup"] },
  "box": { baseName: "Box", category: "misc", tags: ["box", "package", "shipping", "delivery"] },
  "gift": { baseName: "Gift", category: "misc", tags: ["gift", "present", "reward", "bonus"] },
  "award": { baseName: "Award", category: "misc", tags: ["award", "trophy", "achievement", "prize"] },
  "trophy": { baseName: "Trophy", category: "misc", tags: ["trophy", "winner", "champion", "first"] },
};

export function getIconsaxIconName(key: string): string {
  const mapping = ICONSAX_ICON_MAP[key];
  return mapping?.baseName || key;
}

export function getIconsaxIconCategory(key: string): string {
  const mapping = ICONSAX_ICON_MAP[key];
  return mapping?.category || "misc";
}

export function getIconsaxIconTags(key: string): string[] {
  const mapping = ICONSAX_ICON_MAP[key];
  return mapping?.tags || [];
}

export function getAllIconsaxIcons(): string[] {
  return Object.keys(ICONSAX_ICON_MAP);
}

export function getIconsaxIconsByCategory(category: string): string[] {
  return Object.entries(ICONSAX_ICON_MAP)
    .filter(([, value]) => value.category === category)
    .map(([key]) => key);
}

export function getIconsaxCategories(): string[] {
  return [...new Set(Object.values(ICONSAX_ICON_MAP).map((v) => v.category))];
}
