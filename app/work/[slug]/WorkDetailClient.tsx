"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Calendar, Briefcase, GraduationCap, FolderGit2, ExternalLink, Layers } from "lucide-react";
import { springs } from "@/lib/motion-tokens";
import { useShouldAnimate } from "@/hooks/use-reduced-motion";
import { formatDate, getDuration } from "@/lib/utils";

export type ExperienceType = "work" | "project" | "education";

interface TimelineItem {
  id: string;
  type: ExperienceType;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string;
  technologies: string[];
  highlights: string[];
}

interface PersonalData {
  name: string;
  tagline: string;
  avatar_url: string;
}

interface WorkDetailClientProps {
  item: TimelineItem;
  personalData: PersonalData;
}

const TYPE_LABEL: Record<ExperienceType, string> = {
  work: "Mission",
  project: "Build",
  education: "Cursus",
};

const TYPE_ICONS: Record<ExperienceType, typeof Briefcase> = {
  work: Briefcase,
  project: FolderGit2,
  education: GraduationCap,
};

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

export function WorkDetailClient({ item, personalData }: WorkDetailClientProps) {
  const shouldAnimate = useShouldAnimate();
  const colors = TYPE_COLORS[item.type];
  const TypeIcon = TYPE_ICONS[item.type];
  const isOngoing = !item.endDate || item.current;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-24 sm:py-32 overflow-hidden"
        style={{ background: "var(--hero-bg)" }}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-10 relative z-10">
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.gentle}
            className="mb-8 flex items-center gap-4"
          >
            <Link
              href="/#experience"
              className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--hero-text-muted)] hover:text-[var(--hero-text-main)] transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Retour au parcours</span>
            </Link>

            <motion.span
              initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...springs.bouncy, delay: 0.1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase"
              style={{
                background: colors.bg,
                color: colors.text,
                border: "1px solid rgba(255,255,255,0.04)"
              }}
            >
              <TypeIcon size={10} />
              {TYPE_LABEL[item.type]}
            </motion.span>
          </motion.div>

          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.gentle, delay: 0.1 }}
          >
            <h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl font-normal tracking-wide text-[var(--hero-text-main)] mb-4">
              {item.role}
            </h1>
            <p className="text-lg sm:text-xl text-[var(--hero-text-muted)] max-w-2xl mb-8">
              {item.company}
            </p>

            {/* Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl">
              <div className="about-value-card rounded-xl p-5 bg-[var(--window-bg)] border border-[var(--window-border)]">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--hero-text-muted)] mb-1">
                  <Calendar size={14} />
                  Période
                </div>
                <div className="font-medium text-[var(--hero-text-main)]">
                  {formatDate(item.startDate)} —{" "}
                  {isOngoing ? (
                    <span className="text-[#1D9E75]">En cours</span>
                  ) : (
                    formatDate(item.endDate!)
                  )}
                </div>
                <div className="text-xs text-[var(--hero-text-muted)] mt-1">
                  {getDuration(item.startDate, item.endDate || undefined)}
                </div>
              </div>

              {item.location && (
                <div className="about-value-card rounded-xl p-5 bg-[var(--window-bg)] border border-[var(--window-border)]">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--hero-text-muted)] mb-1">
                    <MapPin size={14} />
                    Localisation
                  </div>
                  <div className="font-medium text-[var(--hero-text-main)]">
                    {item.location}
                  </div>
                </div>
              )}

              <div className="about-value-card rounded-xl p-5 bg-[var(--window-bg)] border border-[var(--window-border)]">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--hero-text-muted)] mb-1">
                  <Layers size={14} />
                  Type
                </div>
                <div className="font-medium text-[var(--hero-text-main)]">
                  {TYPE_LABEL[item.type]}
                </div>
              </div>

              <div className="about-value-card rounded-xl p-5 bg-[var(--window-bg)] border border-[var(--window-border)]">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--hero-text-muted)] mb-1">
                  <ExternalLink size={14} />
                  Portfolio
                </div>
                <div className="font-medium text-[var(--hero-text-main)]">
                  {personalData.name}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Background accent */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--hero-bg)] to-transparent pointer-events-none"
        />
      </section>

      {/* Content Section */}
      <section className="py-24 sm:py-32" style={{ background: "var(--about-dynamic-bg)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <motion.article
                initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springs.gentle}
                className="about-value-card rounded-xl p-8 bg-[var(--window-bg)] border border-[var(--window-border)]"
              >
                <h2 className="font-sans font-bold text-xl tracking-tight text-[var(--hero-text-main)] mb-6 flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: colors.dot }}
                  />
                  Description de la mission
                </h2>
                <div className="prose prose-invert max-w-none text-[var(--hero-text-muted)] leading-relaxed">
                  <p className="text-base sm:text-lg">{item.description}</p>
                </div>
              </motion.article>

              {/* Highlights */}
              {item.highlights && item.highlights.length > 0 && (
                <motion.article
                  initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.gentle, delay: 0.1 }}
                  className="about-value-card rounded-xl p-8 bg-[var(--window-bg)] border border-[var(--window-border)]"
                >
                  <h2 className="font-sans font-bold text-xl tracking-tight text-[var(--hero-text-main)] mb-6 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: colors.dot }}
                    />
                    Réalisations clés
                  </h2>
                  <ul className="space-y-4" role="list">
                    {item.highlights.map((highlight, i) => (
                      <motion.li
                        key={i}
                        initial={shouldAnimate ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ...springs.gentle, delay: 0.1 + i * 0.05 }}
                        className="flex gap-4 p-4 rounded-lg bg-[var(--hero-bg)] border border-[var(--window-border)] relative"
                      >
                        <div
                          className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{ background: colors.dot }}
                        />
                        <p className="text-[var(--hero-text-muted)] leading-relaxed flex-1">
                          {highlight}
                        </p>
                      </motion.li>
                    ))}
                  </ul>
                </motion.article>
              )}

              {/* Technologies */}
              {item.technologies && item.technologies.length > 0 && (
                <motion.article
                  initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.gentle, delay: 0.2 }}
                  className="about-value-card rounded-xl p-8 bg-[var(--window-bg)] border border-[var(--window-border)]"
                >
                  <h2 className="font-sans font-bold text-xl tracking-tight text-[var(--hero-text-main)] mb-6 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: colors.dot }}
                    />
                    Technologies utilisées
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <motion.span
                        key={tech}
                        initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...springs.bouncy, delay: 0.02 * item.technologies.indexOf(tech) }}
                        className="px-3 py-1.5 rounded-lg text-sm font-mono"
                        style={{
                          background: colors.bg,
                          color: colors.text,
                          border: "1px solid rgba(255,255,255,0.04)"
                        }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.article>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <motion.div
                initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springs.gentle, delay: 0.3 }}
                className="about-value-card rounded-xl p-6 bg-[var(--window-bg)] border border-[var(--window-border)] sticky top-24"
              >
                <div className="text-center mb-6">
                  <div
                    className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2"
                    style={{ borderColor: colors.dot }}
                  >
                    <Image
                      src={personalData.avatar_url || "/photo.png"}
                      alt={personalData.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-sans font-bold text-lg text-[var(--hero-text-main)]">
                    {personalData.name}
                  </h3>
                  <p className="text-sm text-[var(--hero-text-muted)] mt-1">
                    {personalData.tagline}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-[var(--window-border)]">
                  <a
                    href="https://github.com/Shootware"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-[var(--hero-text-muted)] hover:text-[var(--hero-text-main)] transition-colors"
                  >
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: colors.bg }}>
                      <ExternalLink size={16} style={{ color: colors.text }} />
                    </span>
                    Voir le code sur GitHub
                  </a>
                </div>
              </motion.div>

              {/* Related experiences could go here */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
