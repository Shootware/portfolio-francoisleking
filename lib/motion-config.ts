"use client";

import { motionTokens } from "./motion-tokens";

/**
 * Motion Config — Runtime feature flags for animation control
 * Following motion-foundations skill guidelines
 */

export const motionConfig = {
  /**
   * Detect low-end devices (≤ 4 CPU cores)
   * Non-essential animations should be disabled on low-end hardware
   */
  isLowEnd(): boolean {
    return (
      typeof navigator !== "undefined" &&
      navigator.hardwareConcurrency <= 4
    );
  },

  /**
   * Check if user prefers reduced motion
   * This is the highest priority accessibility override
   */
  prefersReduced(): boolean {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  },

  /**
   * Determine if an animation should run
   * @param essential - If true, animation runs even on low-end devices (but still respects reduced-motion)
   */
  shouldAnimate({ essential = false } = {}): boolean {
    if (this.prefersReduced()) return false;
    if (!essential && this.isLowEnd()) return false;
    return true;
  },

  /**
   * Get appropriate duration based on device capabilities
   */
  duration(): number {
    return this.isLowEnd() || this.prefersReduced()
      ? motionTokens.duration.instant
      : motionTokens.duration.normal;
  },
} as const;