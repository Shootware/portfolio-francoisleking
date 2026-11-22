// ============================================================
// SECTION — Experience Timeline (UI/UX Premium)
// ============================================================

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, FolderGit2, GraduationCap, MapPin, Calendar, Layers } from "lucide-react";
import { timeline, type ExperienceType, type TimelineItem } from "@/content";
import { formatDate, getDuration } from "@/lib/utils";

const TABS: { id: ExperienceType | "all"; label: string; icon: typeof Briefcase }[] = [
  { id: "all", label: "Tout", icon: Layers },
  { id: "work", label: "Expérience", icon: Briefcase },
  { id: "project", label: "Projets", icon: FolderGit2 },
  { id: "education", label: "Formation", icon: GraduationCap },
];

const TYPE_LABEL: Record<ExperienceType, string> = {
  work: "Mission",
  project: "Build",
  education: "Cursus",
};

// Jetons de couleurs sémantiques appliqués avec parcimonie pour préserver le minimalisme
const TYPE_COLORS: Record<ExperienceType, { dot: string; text: string; bg: string }> = {
  work: {
    dot: "#378ADD",
    text: "#378ADD",
    bg: "rgba(55, 138, 221, 0.08)"
  },
  project: {
    dot: "#7F77DD",
    text: "#A5B4FC",
    bg: "rgba(127, 119, 221, 0.08)"
  },
  education: {
    dot: "#1D9E75",
    text: "#1D9E75",
    bg: "rgba(29, 158, 117, 0.08)"
  },
};

function TimelineCard({ item }: { item: TimelineItem }) {
  const isOngoing = !item.endDate;
  const colors = TYPE_COLORS[item.type];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-8 sm:pl-10 pb-12 last:pb-2 group"
      aria-label={`${item.title} chez ${item.organization}`}
    >
      {/* Ligne verticale structurelle */}
      <div
        aria-hidden="true"
        className="absolute left-[7px] sm:left-[9px] top-6 bottom-0 w-px bg-[var(--window-border)] transition-colors duration-300 group-hover:bg-[var(--hero-text-muted)]/30"
      />

      {/* Point d'ancrage de la Timeline */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center bg-[var(--hero-bg)]"
        style={{ borderColor: colors.dot }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"
          style={{ background: colors.dot }}
        />
      </div>

      {/* Conteneur de carte asymétrique */}
      <div className="about-value-card rounded-xl p-5 sm:p-6 bg-[var(--window-bg)] border border-[var(--window-border)] transition-all duration-300 relative overflow-hidden">

        {/* Ligne subtile colorée au sommet pour l'empreinte de la catégorie */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
          style={{ background: colors.dot }}
        />

        {/* Bloc d'en-tête responsive */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-base sm:text-lg tracking-tight text-[var(--hero-text-main)]">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm font-mono tracking-wide text-[var(--hero-text-muted)]">
              {item.organization}
            </p>
          </div>

          {/* Badge Catégorie Minimaliste */}
          <span
            className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded border self-start sm:self-auto"
            style={{
              backgroundColor: colors.bg,
              borderColor: "rgba(255,255,255,0.04)",
              color: colors.text,
            }}
          >
            {TYPE_LABEL[item.type]}
          </span>
        </div>

        {/* Métadonnées temporelles et géographiques */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] font-mono text-[var(--hero-text-muted)] opacity-80 mb-4">
          <span className="flex items-center gap-1.5" aria-label="Période">
            <Calendar size={12} className="opacity-60" />
            {formatDate(item.startDate)} —{" "}
            {isOngoing ? (
              <span className="font-bold text-[#1D9E75]">En cours</span>
            ) : (
              formatDate(item.endDate!)
            )}
            <span className="opacity-30">|</span>
            <span className="text-[var(--hero-text-main)] opacity-90">
              {getDuration(item.startDate, item.endDate)}
            </span>
          </span>

          {item.location && (
            <span className="flex items-center gap-1.5" aria-label="Localisation">
              <MapPin size={12} className="opacity-60" />
              {item.location}
            </span>
          )}
        </div>

        {/* Description de la mission */}
        <p className="text-xs sm:text-sm leading-relaxed text-[var(--hero-text-muted)] opacity-95 mb-5">
          {item.description}
        </p>

        {/* Liste à puces stylisée (Réalisations clés) */}
        {item.bullets && item.bullets.length > 0 && (
          <ul className="flex flex-col gap-2.5 mb-5 border-l border-dashed border-[var(--window-border)] pl-4" role="list">
            {item.bullets.map((bullet, i) => (
              <li
                key={i}
                className="text-xs leading-relaxed text-[var(--hero-text-muted)] relative"
              >
                <div
                  className="absolute -left-[20px] top-[6px] w-1 h-1 rounded-full bg-[var(--hero-text-main)] opacity-40"
                  aria-hidden="true"
                />
                {bullet}
              </li>
            ))}
          </ul>
        )}

        {/* Pile technologique (Tech Stack) locale */}
        {item.tech && item.tech.length > 0 && (
          <div
            className="flex flex-wrap gap-1.5 pt-2"
            role="list"
            aria-label="Technologies utilisées"
          >
            {item.tech.map((t) => (
              <span
                key={t}
                role="listitem"
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--hero-bg)] text-[var(--hero-text-main)] opacity-80 border border-[var(--window-border)]"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function ExperienceSection() {
  const [activeTab, setActiveTab] = useState<ExperienceType | "all">("all");

  const filtered = activeTab === "all"
    ? timeline
    : timeline.filter((item) => item.type === activeTab);

  return (
    <section
      id="experience"
      aria-label="Parcours"
      className="skills-section-unified relative overflow-hidden py-24 sm:py-32"
    >
      {/* Grille technique en arrière-plan */}
      <div
        aria-hidden="true"
        className="skills-grid-overlay pointer-events-none absolute inset-0 z-0 opacity-25"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8">

        {/* En-tête de section asymétrique */}
        <div className="mb-16">
          <h2 className="skills-main-title text-4xl sm:text-5xl font-normal tracking-wide italic">
            Mon évolution
          </h2>
          <p className="skills-subtitle mt-4 text-sm sm:text-base opacity-65 leading-relaxed max-w-xl">
            Missions techniques, architectures et diplômes académiques — ce qui valide mon expertise.
          </p>
        </div>

        {/* Barre de navigation / Filtres (UI d'ingénieur avec pilule animée) */}
        <div
          role="tablist"
          aria-label="Filtrer le parcours"
          className="flex flex-wrap gap-1 p-1 rounded-xl bg-[var(--window-bg)] border border-[var(--window-border)] mb-14"
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={isActive}
                aria-controls="timeline-panel"
                onClick={() => setActiveTab(id)}
                className="flex-1 min-w-[85px] inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-colors relative cursor-pointer"
                style={{
                  color: isActive ? "var(--hero-bg)" : "var(--hero-text-main)",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTimelineTab"
                    className="absolute inset-0 bg-[var(--hero-text-main)] rounded-lg z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon size={12} className="opacity-80" />
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Conteneur principal de la Timeline */}
        <div
          id="timeline-panel"
          role="tabpanel"
          aria-label={`Timeline : ${activeTab}`}
          className="relative native-scrollbar"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <TimelineCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </div>

        {/* Ligne décorative basse */}
        <div className="skills-footer-line mt-20 h-px w-full opacity-20" />
      </div>
    </section>
  );
}