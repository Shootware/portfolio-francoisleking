"use client";

/**
 * LottieFiles Integration
 * Curated animations from LottieFiles for the portfolio
 * Replace placeholder URLs with actual animation IDs from https://lottiefiles.com
 */

import type { LottieAnimationSource, LottieIconProps } from "./lottie";

/**
 * LottieFiles Animation IDs
 * Get these from https://lottiefiles.com - search for animations and copy the ID from the URL
 * Example: https://lottiefiles.com/animations/XYZ123 -> ID is "XYZ123"
 */
export const LOTTIEFILES_ANIMATIONS = {
  // Success/Feedback animations
  "success-check": "https://assets10.lottiefiles.com/packages/lf20_jbrw3hcz.json",
  "success-circle": "https://assets10.lottiefiles.com/packages/lf20_kcsil2iy.json",
  "success-tick": "https://assets10.lottiefiles.com/packages/lf20_v59pxgxu.json",

  // Loading animations
  "loading-spinner": "https://assets10.lottiefiles.com/packages/lf20_jtbfg2nb.json",
  "loading-dots": "https://assets10.lottiefiles.com/packages/lf20_qqw3vlpp.json",
  "loading-wave": "https://assets10.lottiefiles.com/packages/lf20_j1adxtwy.json",
  "loading-gear": "https://assets10.lottiefiles.com/packages/lf20_p8bfn5to.json",
  "loading-pulse": "https://assets10.lottiefiles.com/packages/lf20_uxnpohky.json",

  // Interactive/Buttons
  "button-press": "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json",
  "heart-like": "https://assets10.lottiefiles.com/packages/lf20_ktwnwv5m.json",
  "star-rate": "https://assets10.lottiefiles.com/packages/lf20_y5na6mcy.json",
  "bookmark": "https://assets10.lottiefiles.com/packages/lf20_5njp3vg6.json",

  // Navigation/Arrows
  "arrow-bounce-right": "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json",
  "arrow-bounce-down": "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json",
  "chevron-expand": "https://assets10.lottiefiles.com/packages/lf20_yzcxd.json",

  // Tech/Code animations
  "code-typing": "https://assets10.lottiefiles.com/packages/lf20_x62chj.json",
  "terminal-window": "https://assets10.lottiefiles.com/packages/lf20_cwyznqte.json",
  "server-cloud": "https://assets10.lottiefiles.com/packages/lf20_x1gjdldd.json",
  "database-sync": "https://assets10.lottiefiles.com/packages/lf20_q5qn5cje.json",
  "api-request": "https://assets10.lottiefiles.com/packages/lf20_4kx2q32n.json",
  "deploy-rocket": "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json",

  // AI/ML
  "ai-brain": "https://assets10.lottiefiles.com/packages/lf20_x62chj.json",
  "neural-network": "https://assets10.lottiefiles.com/packages/lf20_x62chj.json",
  "data-processing": "https://assets10.lottiefiles.com/packages/lf20_x62chj.json",

  // Celebration
  "confetti-burst": "https://assets10.lottiefiles.com/packages/lf20_q5qn5cje.json",
  "fireworks": "https://assets10.lottiefiles.com/packages/lf20_ktwnwv5m.json",
  "celebration": "https://assets10.lottiefiles.com/packages/lf20_ktwnwv5m.json",

  // Empty states
  "empty-search": "https://assets10.lottiefiles.com/packages/lf20_v1xwdfl1.json",
  "empty-folder": "https://assets10.lottiefiles.com/packages/lf20_5njp3vg6.json",
  "empty-inbox": "https://assets10.lottiefiles.com/packages/lf20_v1xwdfl1.json",
  "no-data": "https://assets10.lottiefiles.com/packages/lf20_v1xwdfl1.json",

  // 404/Error
  "404-lost": "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json",
  "error-glitch": "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json",
  "broken-link": "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json",

  // Portfolio specific
  "portfolio-showcase": "https://assets10.lottiefiles.com/packages/lf20_cwyznqte.json",
  "project-card": "https://assets10.lottiefiles.com/packages/lf20_cwyznqte.json",
  "skill-growth": "https://assets10.lottiefiles.com/packages/lf20_q5qn5cje.json",
  "experience-timeline": "https://assets10.lottiefiles.com/packages/lf20_cwyznqte.json",

  // Contact/Social
  "email-send": "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json",
  "message-sent": "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json",
  "linkedin-connect": "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json",
  "github-star": "https://assets10.lottiefiles.com/packages/lf20_y5na6mcy.json",
} as const;

export type LottieFilesAnimationKey = keyof typeof LOTTIEFILES_ANIMATIONS;

/**
 * Get Lottie animation URL from LottieFiles
 */
export function getLottieFilesUrl(key: LottieFilesAnimationKey): string {
  return LOTTIEFILES_ANIMATIONS[key];
}

/**
 * Pre-configured Lottie animation sources for the portfolio
 */
export const PORTFOLIO_LOTTIE_ANIMATIONS: Record<string, LottieAnimationSource> = {
  // Hero section
  "hero-code": {
    name: "Hero Code Animation",
    animationData: LOTTIEFILES_ANIMATIONS["code-typing"],
    defaultOptions: { loop: true, autoplay: true, speed: 0.8, renderer: "svg" },
  },
  "hero-terminal": {
    name: "Hero Terminal",
    animationData: LOTTIEFILES_ANIMATIONS["terminal-window"],
    defaultOptions: { loop: true, autoplay: true, speed: 0.6, renderer: "svg" },
  },
  "hero-rocket": {
    name: "Hero Rocket Deploy",
    animationData: LOTTIEFILES_ANIMATIONS["deploy-rocket"],
    defaultOptions: { loop: false, autoplay: true, speed: 1, renderer: "svg" },
  },

  // Skills section
  "skill-code": {
    name: "Skill Code",
    animationData: LOTTIEFILES_ANIMATIONS["code-typing"],
    defaultOptions: { loop: true, autoplay: true, speed: 0.7, renderer: "svg" },
  },
  "skill-server": {
    name: "Skill Server",
    animationData: LOTTIEFILES_ANIMATIONS["server-cloud"],
    defaultOptions: { loop: true, autoplay: true, speed: 0.5, renderer: "svg" },
  },
  "skill-database": {
    name: "Skill Database",
    animationData: LOTTIEFILES_ANIMATIONS["database-sync"],
    defaultOptions: { loop: true, autoplay: true, speed: 0.6, renderer: "svg" },
  },
  "skill-ai": {
    name: "Skill AI",
    animationData: LOTTIEFILES_ANIMATIONS["ai-brain"],
    defaultOptions: { loop: true, autoplay: true, speed: 0.5, renderer: "svg" },
  },

  // Projects section
  "project-preview": {
    name: "Project Preview",
    animationData: LOTTIEFILES_ANIMATIONS["portfolio-showcase"],
    defaultOptions: { loop: true, autoplay: true, speed: 0.4, renderer: "svg" },
  },
  "project-deploy": {
    name: "Project Deploy",
    animationData: LOTTIEFILES_ANIMATIONS["deploy-rocket"],
    defaultOptions: { loop: false, autoplay: false, speed: 1, renderer: "svg" },
  },

  // Experience section
  "experience-work": {
    name: "Experience Work",
    animationData: LOTTIEFILES_ANIMATIONS["experience-timeline"],
    defaultOptions: { loop: true, autoplay: true, speed: 0.4, renderer: "svg" },
  },

  // Contact section
  "contact-email": {
    name: "Contact Email",
    animationData: LOTTIEFILES_ANIMATIONS["email-send"],
    defaultOptions: { loop: false, autoplay: false, speed: 1, renderer: "svg" },
  },
  "contact-success": {
    name: "Contact Success",
    animationData: LOTTIEFILES_ANIMATIONS["success-check"],
    defaultOptions: { loop: false, autoplay: true, speed: 1, renderer: "svg" },
  },

  // Global states
  "global-loading": {
    name: "Global Loading",
    animationData: LOTTIEFILES_ANIMATIONS["loading-spinner"],
    defaultOptions: { loop: true, autoplay: true, speed: 1, renderer: "svg" },
  },
  "global-success": {
    name: "Global Success",
    animationData: LOTTIEFILES_ANIMATIONS["success-circle"],
    defaultOptions: { loop: false, autoplay: true, speed: 1, renderer: "svg" },
  },
  "global-error": {
    name: "Global Error",
    animationData: LOTTIEFILES_ANIMATIONS["error-glitch"],
    defaultOptions: { loop: false, autoplay: true, speed: 1, renderer: "svg" },
  },
};

/**
 * Helper to get a portfolio Lottie animation with defaults
 */
export function getPortfolioLottie(key: string): Omit<LottieIconProps, "animationData"> & { animationData: string } | null {
  const anim = PORTFOLIO_LOTTIE_ANIMATIONS[key];
  if (!anim) return null;

  return {
    animationData: anim.animationData as string,
    ...anim.defaultOptions,
  };
}

/**
 * Component props for easy Lottie usage in the portfolio
 */
export interface PortfolioLottieProps {
  /** Animation key from PORTFOLIO_LOTTIE_ANIMATIONS */
  animation: keyof typeof PORTFOLIO_LOTTIE_ANIMATIONS;
  /** Override width */
  width?: number;
  /** Override height */
  height?: number;
  /** Override loop */
  loop?: boolean;
  /** Override autoplay */
  autoplay?: boolean;
  /** Override speed */
  speed?: number;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Aria label */
  "aria-label"?: string;
}

/**
 * Usage example:
 *
 * import { PortfolioLottie, getPortfolioLottie } from "@/components/icons/sources/lottieFiles";
 *
 * // Simple usage
 * <PortfolioLottie animation="hero-code" width={200} height={200} />
 *
 * // With overrides
 * <PortfolioLottie
 *   animation="skill-server"
 *   width={150}
 *   height={150}
 *   loop={false}
 *   autoplay={false}
 *   className="skill-icon-animation"
 * />
 */