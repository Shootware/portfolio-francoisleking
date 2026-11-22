// ============================================================
// UI ATOMIQUE — SectionHeader
// En-tête de section réutilisable : titre + sous-titre + badge optionnel.
// Évite la duplication du même bloc motion.div dans chaque section.
// ============================================================

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title:       string;
  subtitle?:   string;
  badge?:      string;          // ex: "Open to work"
  align?:      "left" | "center" | "right";
  className?:  string;
  // Permet de surcharger le tag HTML (h2 par défaut)
  as?:         "h1" | "h2" | "h3";
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  align     = "center",
  className,
  as: Tag   = "h2",
}: SectionHeaderProps) {
  const alignClass = {
    left:   "text-left  items-start",
    center: "text-center items-center",
    right:  "text-right  items-end",
  }[align];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("flex flex-col gap-3 mb-12", alignClass, className)}
    >
      {/* Badge optionnel au-dessus du titre */}
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-accent-dim)] text-[var(--color-accent)] self-start mx-auto">
          {badge}
        </span>
      )}

      <Tag className="font-display text-3xl sm:text-4xl font-bold leading-tight">
        {title}
      </Tag>

      {subtitle && (
        <p className="text-[var(--color-muted)] max-w-xl leading-relaxed text-base">
          {subtitle}
        </p>
      )}

      {/* Ligne décorative sous le titre (uniquement centré) */}
      {align === "center" && (
        <div
          aria-hidden="true"
          className="w-10 h-0.5 rounded-full bg-[var(--color-accent)] opacity-60"
        />
      )}
    </motion.div>
  );
}
