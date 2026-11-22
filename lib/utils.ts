// ============================================================
// LIB — Utils
// Fonctions utilitaires partagées dans tout le projet.
// ============================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn() — Combine clsx + tailwind-merge.
 * Permet de fusionner des classes Tailwind sans conflits.
 * Usage : cn("px-4 py-2", isActive && "bg-blue-500", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * formatDate() — Formate "YYYY-MM" en "Jan. 2024"
 */
export function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1);
  return date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
}

/**
 * getDuration() — Calcule la durée entre deux dates "YYYY-MM"
 * Retourne ex: "2 ans · 3 mois"
 */
export function getDuration(start: string, end?: string): string {
  const [sy, sm] = start.split("-").map(Number);
  const now = end ? new Date(end.replace("-", "/") + "/01") : new Date();
  const [ey, em] = end
    ? end.split("-").map(Number)
    : [now.getFullYear(), now.getMonth() + 1];

  const totalMonths = (ey - sy) * 12 + (em - sm);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} an${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mois`);

  return parts.join(" · ") || "< 1 mois";
}

/**
 * slugify() — Convertit un string en slug URL-friendly
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
