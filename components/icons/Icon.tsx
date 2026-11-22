"use client";

import { LucideIcon } from "./sources/lucide";
import { LottieIcon, type LottieIconProps as LottieSourceIconProps } from "./sources/lottie";
import { LordIcon, getLordIcon } from "./sources/lordicon";
import { IconsaxIcon } from "./sources/iconsax";

/**
 * Unified Icon Component
 * Supports multiple icon sources: Lucide, Lottie, LordIcon, Iconsax
 * Provides consistent API across all sources
 */

export type IconSource = "lucide" | "lottie" | "lordicon" | "iconsax";

export interface BaseIconProps {
  /** Icon source */
  source?: IconSource;
  /** Icon name/identifier */
  name: string;
  /** Icon size in pixels */
  size?: number;
  /** Icon color (CSS color value) */
  color?: string;
  /** Stroke width for stroke-based icons */
  strokeWidth?: number;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Accessibility: hide from screen readers */
  "aria-hidden"?: boolean;
  /** Accessibility: label for screen readers */
  "aria-label"?: string;
  /** Test ID for testing */
  "data-testid"?: string;
}

export interface LucideIconProps extends BaseIconProps {
  source: "lucide";
  name: string; // Lucide icon name (e.g., "ArrowRight", "CheckCircle")
}

export interface LottieIconProps extends BaseIconProps {
  source: "lottie";
  name: string; // Lottie animation name or URL
  /** Lottie-specific options */
  animationData: LottieSourceIconProps["animationData"];
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  direction?: 1 | -1;
  segments?: [number, number];
  renderer?: "svg" | "canvas" | "html";
  onLoad?: (animation: unknown) => void;
  onComplete?: () => void;
  onLoopComplete?: () => void;
  onEnterFrame?: (frame: number) => void;
}

export interface LordIconProps extends BaseIconProps {
  source: "lordicon";
  name: string; // LordIcon name (looked up from collection)
  src?: string; // Direct URL to LordIcon JSON (optional, will use name if not provided)
  /** LordIcon-specific options */
  trigger?: "hover" | "click" | "loop" | "morph" | "auto";
  delay?: number;
  speed?: number;
  colors?: string; // "primary,secondary" format
  state?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export interface IconsaxIconProps extends BaseIconProps {
  source: "iconsax";
  name: string; // Iconsax icon base name (e.g., "Home", "User")
  /** Iconsax-specific options */
  variant?: "outline" | "fill" | "linear" | "bulk" | "two-tone";
}

export type IconProps = LucideIconProps | LottieIconProps | LordIconProps | IconsaxIconProps;

/**
 * Main Icon Component
 * Automatically routes to the correct source adapter based on the `source` prop
 * Defaults to "lucide" for backwards compatibility
 */
export function Icon(props: IconProps) {
  const { source = "lucide", ...restProps } = props;

  // Extract common props - use rest to remove them from restProps
  const {
    name,
    size = 24,
    color = "currentColor",
    strokeWidth = 2,
    className = "",
    style,
    "aria-hidden": ariaHidden = true,
    "aria-label": ariaLabel,
    "data-testid": testId,
    ...sourceSpecificProps
  } = restProps;

  const commonProps = {
    size,
    color,
    strokeWidth,
    className,
    style,
    "aria-hidden": ariaHidden,
    "aria-label": ariaLabel,
    "data-testid": testId,
  };

  switch (source) {
    case "lucide":
      return <LucideIcon name={name} {...commonProps} {...sourceSpecificProps} />;

    case "lottie": {
      const lottieProps = sourceSpecificProps as LottieIconProps;
      return <LottieIcon
        animationData={lottieProps.animationData || name}
        width={lottieProps.width || size}
        height={lottieProps.height || size}
        loop={lottieProps.loop ?? true}
        autoplay={lottieProps.autoplay ?? true}
        speed={lottieProps.speed ?? 1}
        direction={lottieProps.direction ?? 1}
        segments={lottieProps.segments}
        renderer={lottieProps.renderer ?? "svg"}
        className={className}
        style={style}
        onLoad={lottieProps.onLoad}
        onComplete={lottieProps.onComplete}
        onLoopComplete={lottieProps.onLoopComplete}
        onEnterFrame={lottieProps.onEnterFrame}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
      />;
    }

    case "lordicon": {
      const lordProps = sourceSpecificProps as LordIconProps;
      // Look up src from name if not provided directly
      const src = lordProps.src || getLordIcon(name)?.src;
      return <LordIcon
        src={src || ""}
        trigger={lordProps.trigger ?? "hover"}
        delay={lordProps.delay ?? 0}
        speed={lordProps.speed ?? 1}
        colors={lordProps.colors}
        state={lordProps.state}
        onLoad={lordProps.onLoad}
        onError={lordProps.onError}
        width={size}
        height={size}
        className={className}
        style={style}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
      />;
    }

    case "iconsax": {
      const iconsaxProps = sourceSpecificProps as IconsaxIconProps;
      return <IconsaxIcon
        name={name}
        variant={iconsaxProps.variant ?? "outline"}
        width={size}
        height={size}
        color={color}
        className={className}
        style={style}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        data-testid={testId}
      />;
    }

    default:
      console.warn(`Unknown icon source: ${source}`);
      return <LucideIcon name={name} {...commonProps} />;
  }
}

/**
 * Shorthand components for each source
 * Usage: <Lucide name="ArrowRight" /> instead of <Icon source="lucide" name="ArrowRight" />
 */
export function Lucide({ name, ...props }: Omit<LucideIconProps, "source">) {
  return <Icon source="lucide" name={name} {...props} />;
}

export function Lottie({ name, ...props }: Omit<LottieIconProps, "source">) {
  return <Icon source="lottie" name={name} {...props} />;
}

export function LordIconComponent({ name, ...props }: Omit<LordIconProps, "source">) {
  return <Icon source="lordicon" name={name} {...props} />;
}

export function Iconsax({ name, ...props }: Omit<IconsaxIconProps, "source">) {
  return <Icon source="iconsax" name={name} {...props} />;
}

/**
 * Helper to create icon props from a string format
 * Format: "source:name" or just "name" (defaults to lucide)
 * Examples: "lucide:ArrowRight", "lordicon:check-circle", "iconsax:Home", "ArrowRight"
 */
export function parseIconString(iconString: string): { source: IconSource; name: string } {
  const [source, ...nameParts] = iconString.split(":");
  if (nameParts.length > 0 && ["lucide", "lottie", "lordicon", "iconsax"].includes(source)) {
    return { source: source as IconSource, name: nameParts.join(":") };
  }
  return { source: "lucide", name: iconString };
}

/**
 * Create icon props from a config object
 * Useful for admin-managed icon configurations
 */
export interface IconConfig {
  source?: IconSource;
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  // Source-specific
  variant?: "outline" | "fill" | "linear" | "bulk" | "two-tone"; // iconsax
  loop?: boolean; // lottie
  autoplay?: boolean; // lottie
  trigger?: "hover" | "click" | "loop" | "morph" | "auto"; // lordicon
  colors?: string; // lordicon
}

export function createIconProps(config: IconConfig): IconProps {
  const { source = "lucide", name, ...rest } = config;
  return { source, name, ...rest } as IconProps;
}
