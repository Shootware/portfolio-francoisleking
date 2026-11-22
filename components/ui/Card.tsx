// ============================================================
// UI ATOMIQUE — Card
// ============================================================

import { cn } from "@/lib/utils";

type CardPadding = "none" | "sm" | "md" | "lg";

const PADDING_STYLES: Record<CardPadding, string> = {
  none: "",
  sm:   "p-3",
  md:   "p-5",
  lg:   "p-7",
};

interface CardProps {
  children:   React.ReactNode;
  padding?:   CardPadding;
  hoverable?: boolean;
  className?: string;
  as?:        keyof React.JSX.IntrinsicElements;
  [key: string]: unknown;
}

export function Card({
  children,
  padding   = "md",
  hoverable = false,
  className,
  as: As    = "div",
  ...props
}: CardProps) {
  const Tag = As as keyof React.JSX.IntrinsicElements;
  const Component = Tag as unknown as React.ComponentType<React.HTMLAttributes<HTMLElement>>;
  return (
    <Component
      className={cn(
        "glass-card",
        PADDING_STYLES[padding],
        hoverable &&
          "transition-colors hover:border-[var(--color-accent-dim)] cursor-pointer",
        className
      )}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children:   React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children:   React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("font-display font-semibold text-base leading-tight", className)}>
      {children}
    </h3>
  );
}

export function CardContent({
  children,
  className,
}: {
  children:   React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-sm text-[var(--color-muted)]", className)}>
      {children}
    </div>
  );
}