/**
 * Unified Icon System - Barrel Export
 *
 * This module provides a unified icon system supporting multiple sources:
 * - Lucide: Clean, consistent SVG icons
 * - Lottie: Animated illustrations from LottieFiles/LottieFlow
 * - LordIcon: Animated icons with trigger interactions (hover, click, loop, morph)
 * - Iconsax: Modern icon set with multiple variants (outline, fill, linear, bulk, two-tone)
 */

// Main Icon Component
export {
  Icon,
  Lucide,
  Lottie,
  LordIconComponent,
  Iconsax,
  parseIconString,
  createIconProps,
  type IconProps,
  type IconSource,
  type BaseIconProps,
  type LucideIconProps,
  type LottieIconProps,
  type LordIconProps,
  type IconsaxIconProps,
  type IconConfig,
} from "./Icon";

// Source Adapters
export {
  LucideIcon,
  LUCIDE_ICON_MAP,
  getLucideIconName,
  type LucideIconSource,
  type LucideIconProps as LucideSourceIconProps,
} from "./sources/lucide";

export {
  LottieIcon,
  LOTTIE_ANIMATIONS,
  getLottieAnimation,
  createLottieFilesUrl,
  createLottieFlowUrl,
  type LottieAnimationSource,
  type LottieIconProps as LottieSourceIconProps,
  type LottieDefaultOptions,
} from "./sources/lottie";

export {
  LordIcon,
  LORDICON_COLLECTION,
  getLordIcon,
  getLordIconsByCategory,
  getLordIconCategories,
  type LordIconSource,
  type LordIconProps as LordIconSourceIconProps,
} from "./sources/lordicon";

export {
  IconsaxIcon,
  ICONSAX_ICON_MAP,
  getIconsaxIconName,
  getIconsaxIconCategory,
  getIconsaxIconTags,
  getAllIconsaxIcons,
  getIconsaxIconsByCategory,
  getIconsaxCategories,
  type IconsaxIconSource,
  type IconsaxIconProps as IconsaxSourceIconProps,
} from "./sources/iconsax";

// Motion Design (motionin.design inspired)
export {
  motionDesignTokens,
  motionVariants,
  scrollAnimations,
  motionPresets,
  createSpring,
  createEase,
  getReducedMotionVariants,
  type Variants,
  type Transition,
} from "./sources/motionDesign";

// LottieFiles Integration
export {
  LOTTIEFILES_ANIMATIONS,
  PORTFOLIO_LOTTIE_ANIMATIONS,
  getLottieFilesUrl,
  getPortfolioLottie,
  type LottieFilesAnimationKey,
  type PortfolioLottieProps,
} from "./sources/lottieFiles";

// Registry
export {
  getAllIcons,
  getIconsBySource,
  getIconsByCategory,
  getAllCategories,
  getIconById,
  searchIcons,
  getIconCategories,
  getIconPickerData,
  validateIconConfig,
  ICON_REGISTRY_STATS,
  type RegisteredIcon,
  type IconCategory,
  type IconPickerData,
} from "./IconRegistry";