"use client";

import React, { useEffect, useState } from "react";
import { Lottie } from "lottie-react";

/**
 * Lottie Animation Adapter
 * Supports LottieFlow, LottieFiles, and custom Lottie JSON animations
 */

export interface LottieAnimationSource {
  name: string;
  animationData: object | string; // JSON object or URL string
  defaultOptions?: LottieDefaultOptions;
}

export interface LottieDefaultOptions {
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  direction?: 1 | -1;
  segments?: [number, number];
  renderer?: "svg" | "canvas" | "html";
}

export interface LottieIconProps {
  animationData: object | string;
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  direction?: 1 | -1;
  segments?: [number, number];
  renderer?: "svg" | "canvas" | "html";
  className?: string;
  style?: React.CSSProperties;
  onLoad?: (animation: unknown) => void;
  onComplete?: () => void;
  onLoopComplete?: () => void;
  onEnterFrame?: (frame: number) => void;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
}

export function LottieIcon({
  animationData,
  width = 24,
  height = 24,
  loop = true,
  autoplay = true,
  speed = 1,
  direction = 1,
  segments,
  renderer = "svg",
  className = "",
  style,
  onLoad,
  onComplete,
  onLoopComplete,
  onEnterFrame,
  "aria-hidden": ariaHidden = true,
  "aria-label": ariaLabel,
  ...props
}: LottieIconProps): React.ReactElement | null {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  useEffect(() => {
    if (typeof animationData === "string") {
      // Handle URL loading
      fetch(animationData)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to load Lottie: ${res.statusText}`);
          return res.json();
        })
        .then(() => {
          setIsLoaded(true);
        })
        .catch((err) => {
          setLoadError(err);
          console.error("Lottie load error:", err);
        });
    } else {
      setIsLoaded(true);
    }
  }, [animationData]);

  if (loadError) {
    console.warn("Lottie animation failed to load:", loadError.message);
    return null;
  }

  const showPlaceholder = !isLoaded && typeof animationData === "string";
  const LottieComponent = Lottie as unknown as React.ComponentType<Record<string, unknown>>;

  // Use ternary for TypeScript control flow analysis
  return showPlaceholder ? (
    React.createElement(
      "div",
      {
        className,
        style: {
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        },
        "aria-hidden": ariaHidden,
        "aria-label": ariaLabel,
      },
      React.createElement(
        "div",
        { className: "lottie-placeholder", style: { opacity: 0.4 } },
        React.createElement(
          "svg",
          { width, height, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5" },
          React.createElement("circle", { cx: 12, cy: 12, r: 10 }),
          React.createElement("path", { d: "M12 6v6l4 2" })
        )
      )
    )
  ) : (
    React.createElement(
      LottieComponent,
      {
        src: animationData,
        width,
        height,
        loop,
        autoplay,
        speed,
        direction: direction === 1 ? "forward" : "reverse",
        segment: segments,
        renderer,
        className,
        style,
        onLoad,
        onComplete,
        onLoopComplete,
        onEnterFrame,
        "aria-hidden": ariaHidden,
        "aria-label": ariaLabel,
        ...props,
      }
    )
  );
}

// Predefined Lottie animations from LottieFiles/LottieFlow
// These would be replaced with actual animation JSON or URLs
export const LOTTIE_ANIMATIONS: Record<string, LottieAnimationSource> = {
  // Success/Check states
  "success-check": {
    name: "Success Check",
    animationData: {
      // Placeholder - replace with actual Lottie JSON from LottieFiles
      v: "5.7.4",
      fr: 30,
      ip: 0,
      op: 60,
      w: 100,
      h: 100,
      nm: "Success Check",
      ddd: 0,
      assets: [],
      layers: [],
    },
    defaultOptions: { loop: false, autoplay: true },
  },
  "success-circle": {
    name: "Success Circle",
    animationData: {
      v: "5.7.4",
      fr: 30,
      ip: 0,
      op: 60,
      w: 100,
      h: 100,
      nm: "Success Circle",
      ddd: 0,
      assets: [],
      layers: [],
    },
    defaultOptions: { loop: false, autoplay: true },
  },

  // Loading/Progress
  "loading-spinner": {
    name: "Loading Spinner",
    animationData: {
      v: "5.7.4",
      fr: 30,
      ip: 0,
      op: 60,
      w: 100,
      h: 100,
      nm: "Loading Spinner",
      ddd: 0,
      assets: [],
      layers: [],
    },
    defaultOptions: { loop: true, autoplay: true, speed: 1 },
  },
  "loading-dots": {
    name: "Loading Dots",
    animationData: {},
    defaultOptions: { loop: true, autoplay: true },
  },
  "loading-bar": {
    name: "Loading Bar",
    animationData: {},
    defaultOptions: { loop: true, autoplay: true },
  },

  // Interactive/Buttons
  "button-press": {
    name: "Button Press",
    animationData: {},
    defaultOptions: { loop: false, autoplay: false },
  },
  "heart-like": {
    name: "Heart Like",
    animationData: {},
    defaultOptions: { loop: false, autoplay: false },
  },
  "star-rate": {
    name: "Star Rate",
    animationData: {},
    defaultOptions: { loop: false, autoplay: false },
  },

  // Navigation/Arrows
  "arrow-bounce": {
    name: "Arrow Bounce",
    animationData: {},
    defaultOptions: { loop: true, autoplay: true },
  },
  "chevron-expand": {
    name: "Chevron Expand",
    animationData: {},
    defaultOptions: { loop: false, autoplay: true },
  },

  // Empty States
  "empty-state-search": {
    name: "Empty State Search",
    animationData: {},
    defaultOptions: { loop: true, autoplay: true },
  },
  "empty-state-folder": {
    name: "Empty State Folder",
    animationData: {},
    defaultOptions: { loop: true, autoplay: true },
  },
  "empty-state-inbox": {
    name: "Empty State Inbox",
    animationData: {},
    defaultOptions: { loop: true, autoplay: true },
  },

  // Tech/Code
  "code-typing": {
    name: "Code Typing",
    animationData: {},
    defaultOptions: { loop: true, autoplay: true, speed: 0.8 },
  },
  "terminal-window": {
    name: "Terminal Window",
    animationData: {},
    defaultOptions: { loop: true, autoplay: true },
  },
  "server-cloud": {
    name: "Server Cloud",
    animationData: {},
    defaultOptions: { loop: true, autoplay: true, speed: 0.6 },
  },
  "database-sync": {
    name: "Database Sync",
    animationData: {},
    defaultOptions: { loop: true, autoplay: true, speed: 0.7 },
  },

  // Celebration
  "confetti-burst": {
    name: "Confetti Burst",
    animationData: {},
    defaultOptions: { loop: false, autoplay: true },
  },
  "fireworks": {
    name: "Fireworks",
    animationData: {},
    defaultOptions: { loop: false, autoplay: true },
  },
};

export function getLottieAnimation(name: string): LottieAnimationSource | null {
  return LOTTIE_ANIMATIONS[name] || null;
}

// Helper to create Lottie URL from LottieFiles
export function createLottieFilesUrl(animationId: string, format: "json" | "lottie" = "json"): string {
  return `https://lottie.host/${animationId}.${format}`;
}

// Helper to create LottieFlow URL
export function createLottieFlowUrl(animationId: string): string {
  return `https://lottieflow.com/animations/${animationId}.json`;
}
