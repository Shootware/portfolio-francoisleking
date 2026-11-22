"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Binary, Briefcase, GraduationCap, Server } from "lucide-react";
import { motionTokens, springs } from "@/lib/motion-tokens";
import { useSafeMotion, useShouldAnimate } from "@/hooks/use-reduced-motion";
import {
  CleanCodeIcon,
  LocalProductsIcon,
  PerformanceIcon,
  EducationAIIcon,
  SecurityIcon,
  ArchitectureIcon,
} from "./about/ValueIcons";

interface AboutData {
  content: string;
  values: Array<{
    id: string;
    icon: string;
    title: string;
    desc: string;
    accent: string;
    accentBorder: string;
    iconColor: string;
    size: "large" | "medium" | "small";
    iconSize: number;
  }>;
  stats: Array<{ label: string; value: string }>;
  techStack: Array<{ name: string; category: string; proficiency: number }>;
  photo: string;
}

interface PersonalData {
  name: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  avatar_url: string;
  socials: Array<{ label: string; href: string; icon: string }>;
}

interface AboutSectionClientProps {
  aboutData: AboutData;
  personalData: PersonalData;
}

/* ============================================================
   ROADMAP DATA - These could also come from admin in the future
   ============================================================ */

const ROADMAP = [
  {
    icon: GraduationCap,
    date: "2021 – 2024",
    title: "Cursus Ingénieur",
    place: "Fondations & Algorithmes",
    desc: "Maîtrise des structures de données complexes et des architectures logicielles distribuées.",
  },
  {
    icon: Server,
    date: "2024 – 2026",
    title: "Responsable du parc informatique",
    place: "TFM — Télécom / Infrastructure",
    desc: "Gestion de la disponibilité, supervision des réseaux et déploiement de systèmes informatiques.",
  },
  {
    icon: Briefcase,
    date: "Aujourd'hui",
    title: "Tech Lead / Consultant",
    place: "Scale, IA & Souveraineté",
    desc: "Création de solutions technologiques autonomes, résilientes et adaptées aux réalités locales.",
  },
];

/* ============================================================
   VALUES ICON MAP
   ============================================================ */

const ICON_MAP: Record<string, typeof CleanCodeIcon> = {
  Code: CleanCodeIcon,
  Users: LocalProductsIcon,
  BookOpen: EducationAIIcon,
  GitBranch: ArchitectureIcon,
  // Fallback for any other Lucide icon names
  Code2: CleanCodeIcon,
  Palette: PerformanceIcon,
  Server: SecurityIcon,
  Move: ArchitectureIcon,
  Smartphone: LocalProductsIcon,
  Eye: EducationAIIcon,
  Box: PerformanceIcon,
  Terminal: SecurityIcon,
  Cpu: ArchitectureIcon,
  Database: LocalProductsIcon,
  GraduationCap: EducationAIIcon,
  Briefcase: ArchitectureIcon,
  Mail: CleanCodeIcon,
  Linkedin: LocalProductsIcon,
  Github: ArchitectureIcon,
};

/* ============================================================
   VARIANTS
   ============================================================ */

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

/* ============================================================
   COMPONENT
   ============================================================ */

export function AboutSectionClient({ aboutData, personalData }: AboutSectionClientProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [visibleRoadmap, setVisibleRoadmap] = useState<Set<number>>(new Set());

  const shouldAnimate = useShouldAnimate();
  const safeMotion = useSafeMotion(motionTokens.distance.md);

  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  return (
    <section
      id="about"
      aria-label={`À propos de ${personalData.name}`}
      className="about-section-isolated transition-colors duration-500"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-24 sm:py-32">

        {/* ── Header ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="about-title-serif font-serif italic text-4xl sm:text-5xl mt-5 font-normal tracking-wide">
            Qui suis-je ?
          </h2>
        </motion.div>

        {/* ════════════════════════════════════════════════════
            MAIN GRID: PHOTO + CONTENT
        ════════════════════════════════════════════════════ */}
        <div className="about-main-grid">

          {/* ── LEFT COLUMN: Photo ── */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="about-photo-col"
          >
            <div className="about-photo-frame">
              <Image
                src={aboutData.photo || "/photoabout.jpeg"}
                alt={personalData.name}
                fill
                sizes="(max-width: 900px) 90vw, 380px"
                className="about-photo-img"
                priority
              />
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: Bio + Timeline ── */}
          <div className="about-content-col">

            {/* Bio */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="about-bio-text space-y-4 text-sm sm:text-base tracking-wide leading-relaxed"
            >
              {aboutData.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
            </motion.div>

            {/* Timeline */}
            <div>
              <div className="relative border-l border-[var(--window-border)] ml-3 space-y-7 py-1">
                {ROADMAP.map((step, i) => {
                  const Icon = step.icon;
                  const isVisible = visibleRoadmap.has(i);

                  return (
                    <motion.div
                      key={i}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: i * 0.1 }}
                      className="relative pl-8 group"
                      onMouseEnter={() => setVisibleRoadmap(prev => new Set([...prev, i]))}
                      onMouseLeave={() => setVisibleRoadmap(prev => { const n = new Set(prev); n.delete(i); return n; })}
                    >
                      {/* Timeline dot with pulse on hover */}
                      <motion.div
                        className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-[var(--window-bar)] border border-[var(--window-border)] flex items-center justify-center transition-all duration-300"
                        whileHover={{ scale: 1.3, borderColor: "var(--color-accent)", backgroundColor: "var(--color-accent)" }}
                        animate={{ boxShadow: isVisible ? "0 0 0 4px var(--color-accent)" : "none" }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon
                          size={11}
                          className="text-[var(--hero-text-muted)] group-hover:text-white transition-colors"
                          aria-hidden="true"
                        />
                      </motion.div>

                      <motion.div
                        layout
                        initial={shouldAnimate ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={springs.gentle}
                      >
                        <span className="font-mono text-[10px] opacity-50 tracking-wider text-[var(--hero-text-muted)]">
                          {step.date}
                        </span>
                        <h4 className="text-sm font-bold tracking-tight text-[var(--hero-text-main)] mt-0.5">
                          {step.title}
                        </h4>
                        <p className="text-[11px] font-mono text-blue-400 font-semibold">
                          {step.place}
                        </p>
                        <p className="text-xs text-[var(--hero-text-muted)] leading-relaxed max-w-sm mt-1">
                          {step.desc}
                        </p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            VALUES & EXPERTISES — BENTO GRID LAYOUT
        ════════════════════════════════════════════════════ */}
        <div className="pt-14 mt-14 border-t border-[var(--window-border)]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="values-bento-grid"
            role="list"
            aria-label="Valeurs et expertises"
          >
            {aboutData.values.map((value, index) => {
              const IconComponent = ICON_MAP[value.icon];
              const isLarge = value.size === "large";
              const isMedium = value.size === "medium";

              return (
                <motion.article
                  key={value.id ?? `value-${index}`}
                  variants={cardVariants}
                  className={`about-value-card value-card--${value.size} rounded-xl p-5 md:p-6 flex flex-col gap-4 transition-all duration-300 relative overflow-hidden group`}
                  whileHover={{
                    y: -4,
                    scale: isLarge ? 1 : 1.01,
                    borderColor: "var(--color-accent)",
                    boxShadow: "0 20px 40px var(--window-shadow)",
                  }}
                  transition={springs.gentle}
                  role="listitem"
                  tabIndex={0}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                >
                  {/* Accent border top */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: value.accentBorder }}
                    initial={false}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  />

                  {/* Icon */}
                  <motion.div
                    className="value-icon-wrapper"
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <span
                      className="value-icon flex items-center justify-center"
                      style={{
                        background: value.accent,
                        border: `1px solid ${value.accentBorder}`,
                        width: isLarge ? 64 : isMedium ? 52 : 44,
                        height: isLarge ? 64 : isMedium ? 52 : 44,
                        borderRadius: isLarge ? 16 : isMedium ? 14 : 12,
                      }}
                      aria-hidden="true"
                    >
                      <IconComponent size={value.iconSize} color={value.iconColor} />
                    </span>
                  </motion.div>

                  {/* Content */}
                  <div className="value-content flex-1 flex flex-col justify-between min-h-0">
                    <div className="space-y-2">
                      <motion.h4
                        className="about-value-title"
                        style={{ fontSize: isLarge ? "1.125rem" : isMedium ? "1rem" : "0.875rem" }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {value.title}
                      </motion.h4>
                      <motion.p
                        className="about-value-desc"
                        style={{ fontSize: isLarge ? "0.9375rem" : isMedium ? "0.875rem" : "0.8125rem" }}
                        initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05, ...springs.gentle }}
                      >
                        {value.desc}
                      </motion.p>
                    </div>

                    {/* Subtle indicator for featured card */}
                    {isLarge && (
                      <motion.div
                        className="value-tag inline-flex items-center gap-1.5 mt-4"
                        initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, ...springs.bouncy }}
                      >
                        <Binary size={12} className="text-[var(--color-accent)]" aria-hidden="true" />
                        <span className="font-mono text-xs font-medium text-[var(--color-accent)]">
                          Valeur fondamentale
                        </span>
                      </motion.div>
                    )}
                  </div>

                  </motion.article>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}