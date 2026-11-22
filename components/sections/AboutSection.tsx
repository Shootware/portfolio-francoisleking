"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Binary, Briefcase, GraduationCap, Server } from "lucide-react";
import { personal } from "@/content";
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

/* ============================================================
   DATA — Only verified information
   ============================================================ */

// No stats displayed - removed "5+ ans d'expérience" per user request

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

// Values/Expertises with new asymmetric layout data
const VALUES = [
  {
    id: "clean-code",
    icon: CleanCodeIcon,
    title: "Code propre",
    desc: "Architecture modulaire, maintenable et évolutive. Développement de solutions conçues pour durer.",
    accent: "rgba(99,102,241,0.08)",
    accentBorder: "rgba(99,102,241,0.28)",
    iconColor: "#818cf8",
    size: "large", // Featured card
    iconSize: 28,
  },
  {
    id: "local-products",
    icon: LocalProductsIcon,
    title: "Produits locaux",
    desc: "Applications adaptées aux réalités technologiques, économiques et numériques du Cameroun et de l'Afrique.",
    accent: "rgba(20,184,166,0.08)",
    accentBorder: "rgba(20,184,166,0.28)",
    iconColor: "#2dd4bf",
    size: "medium",
    iconSize: 22,
  },
  {
    id: "performance",
    icon: PerformanceIcon,
    title: "Performance",
    desc: "Applications rapides, optimisées et accessibles, même avec une connexion Internet limitée.",
    accent: "rgba(251,191,36,0.08)",
    accentBorder: "rgba(251,191,36,0.28)",
    iconColor: "#fbbf24",
    size: "medium",
    iconSize: 22,
  },
  {
    id: "education-ai",
    icon: EducationAIIcon,
    title: "Éducation & IA",
    desc: "Veille technologique, intelligence artificielle et partage des connaissances avec la communauté.",
    accent: "rgba(96,165,250,0.08)",
    accentBorder: "rgba(96,165,250,0.28)",
    iconColor: "#60a5fa",
    size: "medium",
    iconSize: 22,
  },
  {
    id: "security",
    icon: SecurityIcon,
    title: "Sécurité",
    desc: "Bonnes pratiques OWASP, chiffrement, authentification robuste et protection des données utilisateur.",
    accent: "rgba(239,68,68,0.08)",
    accentBorder: "rgba(239,68,68,0.28)",
    iconColor: "#ef4444",
    size: "small",
    iconSize: 18,
  },
  {
    id: "architecture",
    icon: ArchitectureIcon,
    title: "Architecture",
    desc: "Systèmes distribués, event-driven, microservices et patterns de résilience pour la scalabilité.",
    accent: "rgba(168,85,247,0.08)",
    accentBorder: "rgba(168,85,247,0.28)",
    iconColor: "#a855f7",
    size: "small",
    iconSize: 18,
  },
];

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

export function AboutSection() {
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
      aria-label={`À propos de ${personal.name}`}
      className="about-section-isolated relative overflow-hidden transition-colors duration-500"
    >
      {/* Background grid */}
      <div className="skills-grid-overlay absolute inset-0 opacity-40 pointer-events-none" />

      {/* Transition shadow */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/10 to-transparent dark:from-black/40 pointer-events-none z-20" />

      {/* Halo background */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full opacity-10 dark:opacity-15 blur-[120px]"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 py-24 sm:py-32">

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
                src="/photoabout.jpeg"
                alt={personal.name}
                fill
                sizes="(max-width: 900px) 90vw, 380px"
                className="about-photo-img"
                priority
              />
            </div>

            {/* No stat badge - removed per user request */}
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
              <p>
                Je suis{" "}
                <strong className="about-name-highlight font-serif italic font-semibold">
                  {personal.name}
                </strong>
                , ingénieur et architecte logiciel basé à Yaoundé. Mon parcours combine une solide maîtrise des infrastructures réseaux et l'intégration native d'écosystèmes d'intelligence artificielle.
              </p>
              <p>
                Mon crédo réside dans le pragmatisme technique : concevoir des architectures épurées, hautement performantes et optimisées pour assurer une robustesse sans faille.
              </p>
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
            {VALUES.map((value, index) => {
              const Icon = value.icon;
              const isLarge = value.size === "large";
              const isMedium = value.size === "medium";

              return (
                <motion.article
                  key={value.id}
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
                      <Icon size={value.iconSize} color={value.iconColor} />
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

                  {/* Background glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[60px]"
                    style={{
                      background: `radial-gradient(circle at center, ${value.accentBorder} 0%, transparent 70%)`,
                    }}
                    aria-hidden="true"
                  />
                </motion.article>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}