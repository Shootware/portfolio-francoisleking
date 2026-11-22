"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { motionConfig } from "@/lib/motion-config";
import { motionTokens } from "@/lib/motion-tokens";

/**
 * Hook to check if animations should run based on:
 * - prefers-reduced-motion media query
 * - Low-end device detection
 */
export function useShouldAnimate(essential = false): boolean {
  const prefersReduced = useReducedMotion();
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsLowEnd(navigator.hardwareConcurrency <= 4);
    }
  }, []);

  // motionConfig.shouldAnimate internally checks prefersReduced and isLowEnd
  return motionConfig.shouldAnimate({ essential });
}

/**
 * Hook for safe motion values that respect reduced motion
 * Returns initial/animate/exit variants with transforms disabled when reduced motion is preferred
 */
export function useSafeMotion(fullY = motionTokens.distance.md) {
  const prefersReduced = useReducedMotion();

  return {
    initial: { opacity: 0, y: prefersReduced ? 0 : fullY },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: prefersReduced ? 0 : -fullY },
  };
}

/**
 * Hook to get animation duration based on device capabilities
 */
export function useMotionDuration(): number {
  const prefersReduced = useReducedMotion();
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsLowEnd(navigator.hardwareConcurrency <= 4);
    }
  }, []);

  if (prefersReduced || isLowEnd) {
    return motionTokens.duration.instant;
  }
  return motionTokens.duration.normal;
}

/**
 * Hook for spring config based on device capabilities
 */
export function useSpringConfig() {
  const prefersReduced = useReducedMotion();
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsLowEnd(navigator.hardwareConcurrency <= 4);
    }
  }, []);

  if (prefersReduced || isLowEnd) {
    return { duration: motionTokens.duration.instant, ease: motionTokens.easing.linear };
  }
  return { type: "spring", stiffness: 300, damping: 30 }; // snappy
}

/**
 * Hook for stagger timing that respects reduced motion
 */
export function useStaggerConfig(baseDelay = 0.1, stagger = 0.08) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return { delayChildren: 0, staggerChildren: 0 };
  }
  return { delayChildren: baseDelay, staggerChildren: stagger };
}