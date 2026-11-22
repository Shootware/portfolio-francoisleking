"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, MapPin, Calendar, ExternalLink } from "lucide-react";
import { motionTokens, springs } from "@/lib/motion-tokens";
import { useShouldAnimate } from "@/hooks/use-reduced-motion";
import { formatDate, getDuration } from "@/lib/utils";

export type EducationType = "degree" | "certification" | "training" | "self-taught";

interface EducationItem {
  id: string;
  type: EducationType;
  title: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
  credentialUrl?: string;
  orderIndex: number;
}

interface EducationData {
  items: EducationItem[];
}

const TYPE_LABEL: Record<EducationType, string> = {
  degree: "Diplôme",
  certification: "Certification",
  training: "Formation",
  "self-taught": "Auto-formation",
};

const TYPE_COLORS: Record<EducationType, { dot: string; text: string; bg: string }> = {
  degree: {
    dot: "#1D9E75",
    text: "#1D9E75",
    bg: "rgba(29, 158, 117, 0.08)",
  },
  certification: {
    dot: "#7F77DD",
    text: "#A5B4FC",
    bg: "rgba(127, 119, 221, 0.08)",
  },
  training: {
    dot: "#E07A3F",
    text: "#FB923C",
    bg: "rgba(224, 122, 63, 0.08)",
  },
  "self-taught": {
    dot: "#F472B6",
    text: "#F472B6",
    bg: "rgba(244, 114, 182, 0.08)",
  },
};

const TYPE_ICONS: Record<EducationType, typeof GraduationCap> = {
  degree: GraduationCap,
  certification: Award,
  training: BookOpen,
  "self-taught": BookOpen,
};

function EducationCard({ item, shouldAnimate }: { item: EducationItem; shouldAnimate: boolean }) {
  const isOngoing = !item.endDate || item.current;
  const colors = TYPE_COLORS[item.type];
  const TypeIcon = TYPE_ICONS[item.type];

  return (
    <motion.article
      layout
      initial={shouldAnimate ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldAnimate ? { opacity: 0, y: -15 } : { opacity: 0 }}
      transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
      className="relative pl-8 sm:pl-10 pb-12 last:pb-2 group"
      aria-label={`${item.title} - ${item.institution}`}
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
        <TypeIcon size={12} className="text-[var(--hero-text-main)] opacity-80" />
        <div
          className="absolute inset-0 w-1.5 h-1.5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"
          style={{ background: colors.dot }}
        />
      </div>

      {/* Conteneur de carte asymétrique */}
      <div className="about-value-card rounded-xl p-5 sm:p-6 bg-[var(--window-bg)] border border-[var(--window-border)] transition-all duration-300 relative overflow-hidden group-hover:border-[var(--hero-text-muted)]/30">

        {/* Ligne subtile colorée au sommet pour l'empreinte de la catégorie */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
          style={{ background: colors.dot }}
        />

        {/* Bloc d'en-tête responsive */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div className="space-y-1 flex items-center gap-2">
            <TypeIcon size={16} style={{ color: colors.dot }} className="opacity-90" />
            <h3 className="font-sans font-bold text-base sm:text-lg tracking-tight text-[var(--hero-text-main)]">
              {item.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
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
        </div>

        {/* Institution */}
        <p className="text-xs sm:text-sm font-mono tracking-wide text-[var(--hero-text-muted)] mb-2">
          {item.institution}
        </p>

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
              {getDuration(item.startDate, item.endDate || undefined)}
            </span>
          </span>

          {item.location && (
            <span className="flex items-center gap-1.5" aria-label="Localisation">
              <MapPin size={12} className="opacity-60" />
              {item.location}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm leading-relaxed text-[var(--hero-text-muted)] opacity-95 mb-5">
          {item.description}
        </p>

        {/* Liste à puces stylisée (Points forts) */}
        {item.highlights && item.highlights.length > 0 && (
          <ul className="flex flex-col gap-2.5 mb-5 border-l border-dashed border-[var(--window-border)] pl-4" role="list">
            {item.highlights.map((bullet, i) => (
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

        {/* Compétences / Technologies acquises */}
        {item.technologies && item.technologies.length > 0 && (
          <div
            className="flex flex-wrap gap-1.5 mb-4"
            role="list"
            aria-label="Compétences acquises"
          >
            {item.technologies.map((t) => (
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

        {/* Lien vers le credential/certificat */}
        {item.credentialUrl && (
          <a
            href={item.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider text-[var(--hero-text-muted)] hover:text-[var(--hero-text-main)] transition-colors opacity-70 hover:opacity-100"
          >
            <ExternalLink size={12} />
            Voir le certificat
          </a>
        )}
      </div>
    </motion.article>
  );
}

interface FormationSectionClientProps {
  educationData: EducationData;
}

export function FormationSectionClient({ educationData }: FormationSectionClientProps) {
  const shouldAnimate = useShouldAnimate();

  // Filtrer et trier par date (plus récent en premier)
  const sortedItems = [...educationData.items].sort((a, b) => b.orderIndex - a.orderIndex);

  return (
    <section
      id="formation"
      aria-label="Formation"
      className="skills-section-unified py-24 sm:py-32"
    >
      <div className="max-w-3xl mx-auto px-6 sm:px-8">

        {/* En-tête de section asymétrique */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.gentle}
          className="mb-16"
        >
          <h2 className="skills-main-title text-4xl sm:text-5xl font-normal tracking-wide italic">
            Mon parcours d'apprentissage
          </h2>
          <p className="skills-subtitle mt-4 text-sm sm:text-base opacity-65 leading-relaxed max-w-xl">
            Diplômes, certifications, formations continues et auto-apprentissage — la curiosité comme moteur.
          </p>
        </motion.div>

        {/* Conteneur principal de la Timeline */}
        <div className="relative native-scrollbar">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: motionTokens.duration.heroStaggerChildren },
              },
            }}
          >
            {sortedItems.map((item) => (
              <EducationCard
                key={item.id}
                item={item}
                shouldAnimate={shouldAnimate}
              />
            ))}
          </motion.div>
        </div>

        {/* Ligne décorative basse */}
        <div className="skills-footer-line mt-20 h-px w-full opacity-20" />
      </div>
    </section>
  );
}