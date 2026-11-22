"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * LordIcon Adapter
 * Uses @lordicon/react for animated LordIcon icons
 * Supports triggered animations (hover, click, loop, morph)
 */

declare global {
  // The LordIcon web component is not included in React's intrinsic element map.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "lord-icon": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src: string;
        trigger?: "hover" | "click" | "loop" | "morph" | "auto";
        delay?: number;
        speed?: number;
        colors?: string;
        state?: string;
        "aria-label"?: string;
        "aria-hidden"?: string;
      };
    }
  }
}

export interface LordIconSource {
  name: string;
  src: string; // URL to LordIcon JSON
  category?: string;
  tags?: string[];
  defaultTrigger?: "hover" | "click" | "loop" | "morph" | "auto";
  defaultColors?: string;
}

export interface LordIconProps {
  src: string;
  trigger?: "hover" | "click" | "loop" | "morph" | "auto";
  delay?: number;
  speed?: number;
  colors?: string; // Primary,Secondary format: "#6366f1,#a5b4fc"
  state?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
  [key: string]: unknown;
}

export function LordIcon({
  src,
  trigger = "hover",
  delay = 0,
  speed = 1,
  colors,
  state,
  width = 24,
  height = 24,
  className = "",
  style,
  onLoad,
  onError,
  "aria-hidden": ariaHidden = true,
  "aria-label": ariaLabel,
  ...props
}: LordIconProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Dynamically import LordIcon web component
    import("@lordicon/react")
      .then(() => {
        setIsLoaded(true);
        onLoad?.();
      })
      .catch((err) => {
        setLoadError(err);
        onError?.(err);
      });
  }, [onError, onLoad]);

  if (loadError) {
    console.warn("LordIcon failed to load:", loadError.message);
    return React.createElement(LordIconFallback, { width, height, className, style, ariaLabel });
  }

  if (!isLoaded) {
    return React.createElement(LordIconFallback, { width, height, className, style, ariaLabel });
  }

  const styleWithSize: React.CSSProperties = {
    width,
    height,
    display: "inline-block",
    ...style,
  };

  return React.createElement(
    "lord-icon",
    {
      ref: elementRef,
      src,
      trigger,
      delay,
      speed,
      colors,
      state,
      className,
      style: styleWithSize,
      "aria-hidden": ariaHidden ? "true" : "false",
      "aria-label": ariaLabel,
      ...props,
    }
  );
}

function LordIconFallback({
  width = 24,
  height = 24,
  className = "",
  style,
  ariaLabel,
}: {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}): React.ReactElement {
  return React.createElement(
    "div",
    {
      className,
      style: {
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.4,
        ...style,
      },
      "aria-hidden": "true",
      "aria-label": ariaLabel,
    },
    React.createElement(
      "svg",
      { width, height, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5" },
      React.createElement("rect", { x: 3, y: 3, width: 18, height: 18, rx: 2 }),
      React.createElement("path", { d: "M9 9h6v6H9z" })
    )
  );
}

// Curated LordIcon collection relevant for portfolio
// Source: https://lordicon.com/icons
export const LORDICON_COLLECTION: Record<string, LordIconSource> = {
  // Navigation & UI
  "menu-burger": {
    name: "Menu Burger",
    src: "https://cdn.lordicon.com/lordicon/menu-burger.json",
    category: "navigation",
    tags: ["menu", "hamburger", "navigation"],
    defaultTrigger: "morph",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "close-x": {
    name: "Close X",
    src: "https://cdn.lordicon.com/lordicon/close-x.json",
    category: "navigation",
    tags: ["close", "x", "dismiss"],
    defaultTrigger: "morph",
    defaultColors: "#ef4444,#f87171",
  },
  "arrow-right": {
    name: "Arrow Right",
    src: "https://cdn.lordicon.com/lordicon/arrow-right.json",
    category: "navigation",
    tags: ["arrow", "right", "forward", "next"],
    defaultTrigger: "hover",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "arrow-left": {
    name: "Arrow Left",
    src: "https://cdn.lordicon.com/lordicon/arrow-left.json",
    category: "navigation",
    tags: ["arrow", "left", "back", "previous"],
    defaultTrigger: "hover",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "chevron-down": {
    name: "Chevron Down",
    src: "https://cdn.lordicon.com/lordicon/chevron-down.json",
    category: "navigation",
    tags: ["chevron", "down", "expand", "dropdown"],
    defaultTrigger: "morph",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "chevron-up": {
    name: "Chevron Up",
    src: "https://cdn.lordicon.com/lordicon/chevron-up.json",
    category: "navigation",
    tags: ["chevron", "up", "collapse"],
    defaultTrigger: "morph",
    defaultColors: "#6366f1,#a5b4fc",
  },

  // Actions & Feedback
  "check-circle": {
    name: "Check Circle",
    src: "https://cdn.lordicon.com/lordicon/check-circle.json",
    category: "actions",
    tags: ["check", "success", "done", "complete", "verified"],
    defaultTrigger: "loop",
    defaultColors: "#10b981,#34d399",
  },
  "check-mark": {
    name: "Check Mark",
    src: "https://cdn.lordicon.com/lordicon/check-mark.json",
    category: "actions",
    tags: ["check", "success", "tick", "approve"],
    defaultTrigger: "morph",
    defaultColors: "#10b981,#34d399",
  },
  "x-circle": {
    name: "X Circle",
    src: "https://cdn.lordicon.com/lordicon/x-circle.json",
    category: "actions",
    tags: ["error", "cancel", "close", "delete", "remove"],
    defaultTrigger: "loop",
    defaultColors: "#ef4444,#f87171",
  },
  "alert-warning": {
    name: "Alert Warning",
    src: "https://cdn.lordicon.com/lordicon/alert-warning.json",
    category: "actions",
    tags: ["warning", "alert", "caution", "attention"],
    defaultTrigger: "loop",
    defaultColors: "#f59e0b,#fbbf24",
  },
  "info-circle": {
    name: "Info Circle",
    src: "https://cdn.lordicon.com/lordicon/info-circle.json",
    category: "actions",
    tags: ["info", "information", "help", "tooltip"],
    defaultTrigger: "hover",
    defaultColors: "#3b82f6,#60a5fa",
  },
  "download-arrow": {
    name: "Download Arrow",
    src: "https://cdn.lordicon.com/lordicon/download-arrow.json",
    category: "actions",
    tags: ["download", "save", "export"],
    defaultTrigger: "hover",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "upload-arrow": {
    name: "Upload Arrow",
    src: "https://cdn.lordicon.com/lordicon/upload-arrow.json",
    category: "actions",
    tags: ["upload", "import", "send"],
    defaultTrigger: "hover",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "link-external": {
    name: "External Link",
    src: "https://cdn.lordicon.com/lordicon/link-external.json",
    category: "actions",
    tags: ["link", "external", "open", "website"],
    defaultTrigger: "hover",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "share-network": {
    name: "Share Network",
    src: "https://cdn.lordicon.com/lordicon/share-network.json",
    category: "actions",
    tags: ["share", "social", "network", "connect"],
    defaultTrigger: "hover",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "copy-clipboard": {
    name: "Copy Clipboard",
    src: "https://cdn.lordicon.com/lordicon/copy-clipboard.json",
    category: "actions",
    tags: ["copy", "clipboard", "duplicate"],
    defaultTrigger: "morph",
    defaultColors: "#6366f1,#a5b4fc",
  },

  // Loading & Progress
  "loading-spinner": {
    name: "Loading Spinner",
    src: "https://cdn.lordicon.com/lordicon/loading-spinner.json",
    category: "loading",
    tags: ["loading", "spinner", "progress", "wait"],
    defaultTrigger: "loop",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "loading-dots": {
    name: "Loading Dots",
    src: "https://cdn.lordicon.com/lordicon/loading-dots.json",
    category: "loading",
    tags: ["loading", "dots", "progress", "typing"],
    defaultTrigger: "loop",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "loading-ring": {
    name: "Loading Ring",
    src: "https://cdn.lordicon.com/lordicon/loading-ring.json",
    category: "loading",
    tags: ["loading", "ring", "circular", "progress"],
    defaultTrigger: "loop",
    defaultColors: "#6366f1,#a5b4fc",
  },

  // Tech & Development
  "code-brackets": {
    name: "Code Brackets",
    src: "https://cdn.lordicon.com/lordicon/code-brackets.json",
    category: "tech",
    tags: ["code", "programming", "development", "brackets", "syntax"],
    defaultTrigger: "loop",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "terminal-window": {
    name: "Terminal Window",
    src: "https://cdn.lordicon.com/lordicon/terminal-window.json",
    category: "tech",
    tags: ["terminal", "cli", "command", "console", "devops"],
    defaultTrigger: "loop",
    defaultColors: "#10b981,#34d399",
  },
  "server-cloud": {
    name: "Server Cloud",
    src: "https://cdn.lordicon.com/lordicon/server-cloud.json",
    category: "tech",
    tags: ["server", "cloud", "hosting", "backend", "infrastructure"],
    defaultTrigger: "loop",
    defaultColors: "#3b82f6,#60a5fa",
  },
  "database-cylinder": {
    name: "Database Cylinder",
    src: "https://cdn.lordicon.com/lordicon/database-cylinder.json",
    category: "tech",
    tags: ["database", "storage", "data", "sql", "nosql"],
    defaultTrigger: "loop",
    defaultColors: "#8b5cf6,#a78bfa",
  },
  "cpu-chip": {
    name: "CPU Chip",
    src: "https://cdn.lordicon.com/lordicon/cpu-chip.json",
    category: "tech",
    tags: ["cpu", "processor", "chip", "hardware", "compute"],
    defaultTrigger: "loop",
    defaultColors: "#f59e0b,#fbbf24",
  },
  "monitor-screen": {
    name: "Monitor Screen",
    src: "https://cdn.lordicon.com/lordicon/monitor-screen.json",
    category: "tech",
    tags: ["monitor", "screen", "display", "frontend", "ui"],
    defaultTrigger: "hover",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "mobile-phone": {
    name: "Mobile Phone",
    src: "https://cdn.lordicon.com/lordicon/mobile-phone.json",
    category: "tech",
    tags: ["mobile", "phone", "smartphone", "responsive", "app"],
    defaultTrigger: "hover",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "layers-stack": {
    name: "Layers Stack",
    src: "https://cdn.lordicon.com/lordicon/layers-stack.json",
    category: "tech",
    tags: ["layers", "stack", "architecture", "components"],
    defaultTrigger: "loop",
    defaultColors: "#8b5cf6,#a78bfa",
  },
  "git-branch": {
    name: "Git Branch",
    src: "https://cdn.lordicon.com/lordicon/git-branch.json",
    category: "tech",
    tags: ["git", "branch", "version-control", "merge"],
    defaultTrigger: "hover",
    defaultColors: "#f97316,#fb923c",
  },
  "github-logo": {
    name: "GitHub Logo",
    src: "https://cdn.lordicon.com/lordicon/github-logo.json",
    category: "tech",
    tags: ["github", "git", "repository", "open-source"],
    defaultTrigger: "hover",
    defaultColors: "#24292e,#586069",
  },

  // Design & Creative
  "pen-tool": {
    name: "Pen Tool",
    src: "https://cdn.lordicon.com/lordicon/pen-tool.json",
    category: "design",
    tags: ["pen", "design", "draw", "vector", "creative"],
    defaultTrigger: "hover",
    defaultColors: "#ec4899,#f472b6",
  },
  "palette-colors": {
    name: "Palette Colors",
    src: "https://cdn.lordicon.com/lordicon/palette-colors.json",
    category: "design",
    tags: ["palette", "colors", "design", "theme", "branding"],
    defaultTrigger: "loop",
    defaultColors: "#ec4899,#f472b6",
  },
  "eye-preview": {
    name: "Eye Preview",
    src: "https://cdn.lordicon.com/lordicon/eye-preview.json",
    category: "design",
    tags: ["eye", "preview", "view", "visibility", "show"],
    defaultTrigger: "morph",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "move-tool": {
    name: "Move Tool",
    src: "https://cdn.lordicon.com/lordicon/move-tool.json",
    category: "design",
    tags: ["move", "drag", "select", "tool", "design"],
    defaultTrigger: "hover",
    defaultColors: "#6366f1,#a5b4fc",
  },

  // People & Social
  "user-profile": {
    name: "User Profile",
    src: "https://cdn.lordicon.com/lordicon/user-profile.json",
    category: "people",
    tags: ["user", "profile", "account", "person", "avatar"],
    defaultTrigger: "hover",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "users-group": {
    name: "Users Group",
    src: "https://cdn.lordicon.com/lordicon/users-group.json",
    category: "people",
    tags: ["users", "group", "team", "collaboration", "community"],
    defaultTrigger: "hover",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "graduation-cap": {
    name: "Graduation Cap",
    src: "https://cdn.lordicon.com/lordicon/graduation-cap.json",
    category: "people",
    tags: ["graduation", "education", "degree", "learning", "academy"],
    defaultTrigger: "hover",
    defaultColors: "#f59e0b,#fbbf24",
  },
  "briefcase-work": {
    name: "Briefcase Work",
    src: "https://cdn.lordicon.com/lordicon/briefcase-work.json",
    category: "people",
    tags: ["briefcase", "work", "job", "career", "professional"],
    defaultTrigger: "hover",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "mail-envelope": {
    name: "Mail Envelope",
    src: "https://cdn.lordicon.com/lordicon/mail-envelope.json",
    category: "people",
    tags: ["mail", "email", "envelope", "message", "contact"],
    defaultTrigger: "hover",
    defaultColors: "#ef4444,#f87171",
  },
  "linkedin-logo": {
    name: "LinkedIn Logo",
    src: "https://cdn.lordicon.com/lordicon/linkedin-logo.json",
    category: "people",
    tags: ["linkedin", "social", "professional", "network"],
    defaultTrigger: "hover",
    defaultColors: "#0a66c2,#3b82f6",
  },
  "twitter-logo": {
    name: "Twitter Logo",
    src: "https://cdn.lordicon.com/lordicon/twitter-logo.json",
    category: "people",
    tags: ["twitter", "x", "social", "tweet"],
    defaultTrigger: "hover",
    defaultColors: "#1da1f2,#3b82f6",
  },

  // Security & Settings
  "shield-security": {
    name: "Shield Security",
    src: "https://cdn.lordicon.com/lordicon/shield-security.json",
    category: "security",
    tags: ["shield", "security", "protection", "safe", "secure"],
    defaultTrigger: "loop",
    defaultColors: "#10b981,#34d399",
  },
  "lock-secure": {
    name: "Lock Secure",
    src: "https://cdn.lordicon.com/lordicon/lock-secure.json",
    category: "security",
    tags: ["lock", "secure", "private", "encrypted", "password"],
    defaultTrigger: "morph",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "settings-gear": {
    name: "Settings Gear",
    src: "https://cdn.lordicon.com/lordicon/settings-gear.json",
    category: "security",
    tags: ["settings", "gear", "cog", "configuration", "options"],
    defaultTrigger: "loop",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "key-access": {
    name: "Key Access",
    src: "https://cdn.lordicon.com/lordicon/key-access.json",
    category: "security",
    tags: ["key", "access", "auth", "login", "credential"],
    defaultTrigger: "hover",
    defaultColors: "#f59e0b,#fbbf24",
  },

  // Celebration & Fun
  "star-rate": {
    name: "Star Rate",
    src: "https://cdn.lordicon.com/lordicon/star-rate.json",
    category: "celebration",
    tags: ["star", "rate", "favorite", "rating", "review"],
    defaultTrigger: "morph",
    defaultColors: "#f59e0b,#fbbf24",
  },
  "heart-like": {
    name: "Heart Like",
    src: "https://cdn.lordicon.com/lordicon/heart-like.json",
    category: "celebration",
    tags: ["heart", "like", "love", "favorite"],
    defaultTrigger: "morph",
    defaultColors: "#ec4899,#f472b6",
  },
  "confetti-burst": {
    name: "Confetti Burst",
    src: "https://cdn.lordicon.com/lordicon/confetti-burst.json",
    category: "celebration",
    tags: ["confetti", "celebration", "party", "success", "achievement"],
    defaultTrigger: "loop",
    defaultColors: "#6366f1,#a5b4fc",
  },
  "trophy-award": {
    name: "Trophy Award",
    src: "https://cdn.lordicon.com/lordicon/trophy-award.json",
    category: "celebration",
    tags: ["trophy", "award", "achievement", "winner", "champion"],
    defaultTrigger: "hover",
    defaultColors: "#f59e0b,#fbbf24",
  },
};

export function getLordIcon(name: string): LordIconSource | null {
  return LORDICON_COLLECTION[name] || null;
}

export function getLordIconsByCategory(category: string): LordIconSource[] {
  return Object.values(LORDICON_COLLECTION).filter((icon) => icon.category === category);
}

export function getLordIconCategories(): string[] {
  return [...new Set(Object.values(LORDICON_COLLECTION).map((icon) => icon.category).filter((c): c is string => Boolean(c)))];
}
