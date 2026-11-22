"use client";

/**
 * Motion Design Integration
 * Provides motion design patterns from motionin.design and custom animations
 * Uses Framer Motion for production-ready animations
 */

import { Variants, Transition } from "framer-motion";

/**
 * Motion design tokens inspired by motionin.design
 * These provide consistent, polished motion across the portfolio
 */
export const motionDesignTokens = {
  // Easing curves from motionin.design
  easing: {
    // Standard easings
    easeOut: [0.25, 0.46, 0.45, 0.94] as const,
    easeIn: [0.55, 0.055, 0.675, 0.19] as const,
    easeInOut: [0.42, 0, 0.58, 1] as const,

    // Expressive easings (motionin.design style)
    easeOutExpo: [0.16, 1, 0.3, 1] as const,
    easeOutCubic: [0.33, 1.53, 0.53, 0.97] as const,
    easeOutQuart: [0.25, 1, 0.5, 1] as const,
    easeOutQuint: [0.23, 1, 0.32, 1] as const,
    easeOutCirc: [0.075, 0.82, 0.165, 1] as const,
    easeOutBack: [0.34, 1.56, 0.64, 1] as const,
    easeOutElastic: [0.175, 0.885, 0.32, 1.275] as const,

    // Spring configurations
    springGentle: { type: "spring", stiffness: 80, damping: 18 } as Transition,
    springBouncy: { type: "spring", stiffness: 300, damping: 20 } as Transition,
    springSnappy: { type: "spring", stiffness: 400, damping: 25 } as Transition,
    springWobbly: { type: "spring", stiffness: 180, damping: 12 } as Transition,
    springStiff: { type: "spring", stiffness: 500, damping: 30 } as Transition,
  },

  // Duration tokens
  duration: {
    instant: 0,
    fast: 0.15,
    normal: 0.25,
    slow: 0.4,
    slower: 0.6,
    slowest: 1.0,
  },

  // Distance tokens for motion
  distance: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
    xxl: 64,
  },

  // Stagger delays
  stagger: {
    tight: 0.04,
    normal: 0.08,
    loose: 0.12,
    looseXl: 0.16,
  },
} as const;

/**
 * Pre-built animation variants for common patterns
 * These follow motionin.design principles: purposeful, expressive, contextual
 */
export const motionVariants = {
  // Page/Section entrance animations
  pageEnter: {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: motionDesignTokens.duration.slow,
        ease: motionDesignTokens.easing.easeOutExpo,
      },
    },
  } as Variants,

  // Staggered children
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: motionDesignTokens.stagger.normal,
        delayChildren: motionDesignTokens.duration.fast,
      },
    },
  } as Variants,

  staggerItem: {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: motionDesignTokens.duration.normal,
        ease: motionDesignTokens.easing.easeOutCubic,
      },
    },
  } as Variants,

  // Card/Component animations
  cardHover: {
    initial: { y: 0, scale: 1, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    tap: { scale: 0.98, transition: { type: "spring", stiffness: 400, damping: 20 } },
  },

  // Button animations
  button: {
    initial: { scale: 1 },
    hover: { scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 20 } },
    tap: { scale: 0.97, transition: { type: "spring", stiffness: 500, damping: 25 } },
  },

  // Icon animations
  iconHover: {
    initial: { rotate: 0, scale: 1 },
    hover: { rotate: 6, scale: 1.1, transition: { type: "spring", stiffness: 500, damping: 20 } },
  },

  iconTap: {
    initial: { scale: 1 },
    tap: { scale: 0.85, rotate: -12, transition: { type: "spring", stiffness: 500, damping: 15 } },
  },

  // List/item animations
  listItem: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  },

  // Slide animations
  slideUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
  },

  slideDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
  },

  slideLeft: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
  },

  slideRight: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
  },

  // Scale/fade animations
  scaleFade: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
  },

  // Reveal animations (for text, lines)
  lineReveal: {
    hidden: { opacity: 0, y: "100%" },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  },

  // Morphing animations
  morph: {
    initial: { borderRadius: "12px" },
    hover: { borderRadius: "20px", transition: { type: "spring", stiffness: 300, damping: 20 } },
  },

  // Floating animations
  float: {
    animate: {
      y: [-4, 4, -4],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  },

  // Pulse animations
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  },

  // Shimmer/loading
  shimmer: {
    initial: { backgroundPosition: "-200% 0" },
    animate: { backgroundPosition: "200% 0", transition: { duration: 1.5, repeat: Infinity, ease: "linear" } },
  },
} as const;

/**
 * Scroll-triggered animations using Framer Motion's viewport
 */
export const scrollAnimations = {
  // Reveal on scroll
  reveal: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: motionDesignTokens.easing.easeOutExpo },
    },
  } as Variants,

  // Stagger reveal on scroll
  staggerReveal: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  } as Variants,

  // Parallax effect
  parallax: {
    initial: { y: 0 },
    animate: (progress: number) => ({
      y: progress * 100,
      transition: { type: "spring", stiffness: 100, damping: 30 },
    }),
  },

  // Scale on scroll
  scaleOnScroll: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  } as Variants,
} as const;

/**
 * Helper to create custom spring transitions
 */
export function createSpring(stiffness: number, damping: number, mass = 1): Transition {
  return { type: "spring", stiffness, damping, mass };
}

/**
 * Helper to create custom ease transitions
 */
export function createEase(duration: number, ease: [number, number, number, number] = motionDesignTokens.easing.easeOutExpo as [number, number, number, number]): Transition {
  return { duration, ease };
}

/**
 * Motion presets for specific UI patterns
 */
export const motionPresets = {
  // Hero section entrance
  hero: {
    title: {
      hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: motionDesignTokens.easing.easeOutExpo },
      },
    },
    subtitle: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.15, duration: 0.6, ease: motionDesignTokens.easing.easeOutCubic },
      },
    },
    cta: {
      hidden: { opacity: 0, y: 20, scale: 0.95 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: 0.3, type: "spring", stiffness: 150, damping: 18 },
      },
    },
    visual: {
      hidden: { opacity: 0, scale: 0.96, x: 30 },
      visible: {
        opacity: 1,
        scale: 1,
        x: 0,
        transition: { delay: 0.35, type: "spring", stiffness: 80, damping: 18 },
      },
    },
  },

  // Card grid entrance
  cardGrid: {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    },
    item: {
      hidden: { opacity: 0, y: 20, scale: 0.96 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 },
      },
    },
  },

  // Navigation/header
  nav: {
    item: {
      hidden: { opacity: 0, y: -10 },
      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
    },
    dropdown: {
      hidden: { opacity: 0, y: -10, scaleY: 0.8 },
      visible: { opacity: 1, y: 0, scaleY: 1, transition: { type: "spring", stiffness: 400, damping: 25 } },
      exit: { opacity: 0, y: -10, scaleY: 0.8, transition: { duration: 0.15 } },
    },
  },

  // Modal/Dialog
  modal: {
    overlay: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
      exit: { opacity: 0, transition: { duration: 0.15 } },
    },
    content: {
      hidden: { opacity: 0, scale: 0.95, y: 20 },
      visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
      exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
    },
  },

  // Toast/Notification
  toast: {
    hidden: { opacity: 0, x: 100, scale: 0.9 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } },
    exit: { opacity: 0, x: 100, scale: 0.9, transition: { duration: 0.2 } },
  },
} as const;

/**
 * Reduced motion support - returns simplified variants
 */
export function getReducedMotionVariants<T extends Variants>(variants: T): T {
  const reduced: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(variants)) {
    if (typeof value === "object" && value !== null) {
      const variant = value as Record<string, unknown>;
      reduced[key] = {
        ...variant,
        transition: { duration: 0.01, ease: "linear" },
        // Remove transforms for reduced motion
        y: 0,
        x: 0,
        scale: 1,
        rotate: 0,
        filter: "none",
      };
    }
  }
  return reduced as T;
}

export type { Variants, Transition };
