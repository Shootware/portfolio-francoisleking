// ============================================================
// UI ATOMIQUE — Button
// Variantes : primary | ghost | outline | danger
// Sizes : sm | md | lg
// Supporte : disabled, loading, icône gauche/droite, as Link
// ============================================================

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ---- Types ----
type ButtonVariant = "primary" | "ghost" | "outline" | "danger";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  loading?:   boolean;
  iconLeft?:  React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

// ---- Styles par variante ----
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-accent)] text-white hover:opacity-90 active:opacity-80",
  ghost:
    "bg-transparent text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]",
  outline:
    "glass-card text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
  danger:
    "bg-red-500 text-white hover:opacity-90 active:opacity-80",
};

// ---- Styles par taille ----
const SIZE_STYLES: Record<ButtonSize, string> = {
  sm:  "px-3 py-1.5 text-xs gap-1.5 rounded-md",
  md:  "px-5 py-2.5 text-sm gap-2   rounded-lg",
  lg:  "px-7 py-3   text-base gap-2  rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant   = "primary",
      size      = "md",
      loading   = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          // Base
          "inline-flex items-center justify-center font-medium",
          "transition-all duration-[var(--transition-fast)]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          "focus-visible:outline-[var(--color-accent)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          // Variante + taille
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          // Optionnel
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {/* Icône gauche OU spinner loading */}
        {loading ? (
          <Loader2
            size={size === "lg" ? 18 : 14}
            className="animate-spin shrink-0"
            aria-hidden="true"
          />
        ) : (
          iconLeft && (
            <span className="shrink-0" aria-hidden="true">
              {iconLeft}
            </span>
          )
        )}

        {children}

        {/* Icône droite (masquée pendant loading) */}
        {!loading && iconRight && (
          <span className="shrink-0" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
