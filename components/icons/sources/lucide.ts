"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

/**
 * Lucide Icon Adapter
 * Provides a consistent interface for Lucide React icons
 */

export interface LucideIconSource {
  name: string;
  component: React.ComponentType<LucideIconProps>;
}

export interface LucideIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
}

export function LucideIcon({ name, size = 24, color = "currentColor", strokeWidth = 2, className = "", ...props }: LucideIconProps & { name: string }): React.ReactElement | null {
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<LucideIconProps> | undefined;

  if (!IconComponent) {
    console.warn(`Lucide icon "${name}" not found`);
    return null;
  }

  return React.createElement(
    IconComponent,
    {
      size,
      color,
      strokeWidth,
      className,
      ...props,
    }
  );
}

// Common icon names used in the portfolio for quick reference
export const LUCIDE_ICON_MAP: Record<string, string> = {
  // Navigation
  "menu": "Menu",
  "x": "X",
  "chevron-left": "ChevronLeft",
  "chevron-right": "ChevronRight",
  "chevron-up": "ChevronUp",
  "chevron-down": "ChevronDown",

  // Actions
  "download": "Download",
  "upload": "Upload",
  "send": "Send",
  "copy": "Copy",
  "link": "Link",
  "external-link": "ExternalLink",
  "arrow-right": "ArrowRight",
  "arrow-left": "ArrowLeft",
  "arrow-up": "ArrowUp",
  "arrow-down": "ArrowDown",

  // Status
  "check": "Check",
  "check-circle": "CheckCircle",
  "alert-circle": "AlertCircle",
  "alert-triangle": "AlertTriangle",
  "info": "Info",
  "loader": "Loader2",

  // Content
  "code": "Code",
  "code-2": "Code2",
  "terminal": "Terminal",
  "database": "Database",
  "server": "Server",
  "cpu": "Cpu",
  "monitor": "Monitor",
  "smartphone": "Smartphone",
  "tablet": "Tablet",
  "layout": "Layout",
  "grid": "Grid",
  "layers": "Layers",

  // Social
  "github": "Github",
  "linkedin": "Linkedin",
  "twitter": "Twitter",
  "mail": "Mail",
  "map-pin": "MapPin",

  // People & Learning
  "user": "User",
  "users": "Users",
  "user-plus": "UserPlus",
  "graduation-cap": "GraduationCap",
  "book-open": "BookOpen",
  "book": "Book",
  "briefcase": "Briefcase",
  "folder-git": "FolderGit2",

  // Design
  "palette": "Palette",
  "pen-tool": "PenTool",
  "eye": "Eye",
  "move": "Move",
  "rotate-cw": "RotateCw",

  // Security & Settings
  "shield": "Shield",
  "lock": "Lock",
  "unlock": "Unlock",
  "key": "Key",
  "settings": "Settings",
  "cog": "Cog",

  // Media
  "image": "Image",
  "video": "Video",
  "music": "Music",
  "file": "File",
  "folder": "Folder",

  // Time
  "calendar": "Calendar",
  "clock": "Clock",
  "timer": "Timer",

  // Misc
  "star": "Star",
  "heart": "Heart",
  "tag": "Tag",
  "hash": "Hash",
  "git-branch": "GitBranch",
  "git-commit": "GitCommit",
  "git-merge": "GitMerge",
  "git-pull-request": "GitPullRequest",
};

export function getLucideIconName(key: string): string {
  return LUCIDE_ICON_MAP[key] || key;
}