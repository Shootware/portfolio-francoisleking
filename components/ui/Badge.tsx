// ============================================================
// UI ATOMIQUE — Badge
// Utilisé pour les catégories de projets, tech tags, statuts.
// Variantes : default | accent | success | warning | danger | mono
// ============================================================

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "danger" | "mono";
type BadgeSize    = "sm" | "md";

interface BadgeProps {
  children:  React.ReactNode;
  variant?:  BadgeVariant;
  size?:     BadgeSize;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-surface-alt)] text-[var(--color-muted)]",
  accent:  "bg-[var(--color-accent-dim)] text-[var(--color-accent)]",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger:  "bg-red-500/10 text-red-600 dark:text-red-400",
  mono:    "bg-[var(--color-surface-alt)] text-[var(--color-subtle)] font-mono",
};

const SIZE_STYLES: Record<BadgeSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5",
  md: "text-xs px-2 py-0.5",
};

export function Badge({
  children,
  variant  = "default",
  size     = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium leading-none",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className
      )}
    >
      {children}
    </span>
  );
}
