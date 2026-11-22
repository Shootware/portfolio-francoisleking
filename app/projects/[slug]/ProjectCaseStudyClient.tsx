"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GitBranch, ArrowRight, CheckCircle, Calendar, Tag, Monitor, Smartphone, Cpu, Bot } from "lucide-react";
import { springs } from "@/lib/motion-tokens";
import { useShouldAnimate } from "@/hooks/use-reduced-motion";

export type ProjectCategory = "web" | "mobile" | "desktop" | "ai";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  year: string;
  featured: boolean;
  category: ProjectCategory[];
  tech: string[];
  images?: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
}

interface PersonalData {
  name: string;
  tagline: string;
  avatar_url: string;
}

interface ProjectCaseStudyClientProps {
  project: Project;
  personalData: PersonalData;
}

const CATEGORY_ICONS: Record<ProjectCategory, typeof Monitor> = {
  web: Monitor,
  mobile: Smartphone,
  desktop: Cpu,
  ai: Bot,
};

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  web: "Web",
  mobile: "Mobile",
  desktop: "Desktop",
  ai: "IA",
};

export function ProjectCaseStudyClient({ project, personalData }: ProjectCaseStudyClientProps) {
  const shouldAnimate = useShouldAnimate();
  const imageUrl = project.images?.[0] || project.image;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Image */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--hero-bg)" }}
      >
        {imageUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              priority
              className="object-cover opacity-10 dark:opacity-20"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--hero-bg)] via-transparent to-[var(--hero-bg)]" />
          </div>
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.gentle}
            className="mb-8 flex items-center gap-4"
          >
            <Link
              href="/#projects"
              className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--hero-text-muted)] hover:text-[var(--hero-text-main)] transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Retour aux projets</span>
            </Link>

            {project.featured && (
              <motion.span
                initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...springs.bouncy, delay: 0.1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30"
              >
                ★ Featured
              </motion.span>
            )}
          </motion.div>

          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.gentle, delay: 0.1 }}
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {project.category.map((cat) => {
                const Icon = CATEGORY_ICONS[cat];
                return (
                  <motion.span
                    key={cat}
                    initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...springs.bouncy, delay: 0.1 + project.category.indexOf(cat) * 0.05 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase"
                    style={{
                      background: "rgba(99, 102, 241, 0.1)",
                      color: "#818cf8",
                      border: "1px solid rgba(99, 102, 241, 0.2)"
                    }}
                  >
                    <Icon size={10} />
                    {CATEGORY_LABELS[cat]}
                  </motion.span>
                );
              })}
            </div>

            <h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl font-normal tracking-wide text-[var(--hero-text-main)] mb-4">
              {project.title}
            </h1>
            <p className="text-lg sm:text-xl text-[var(--hero-text-muted)] max-w-2xl mb-8">
              {project.description}
            </p>

            {/* Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl">
              <div className="about-value-card rounded-xl p-5 bg-[var(--window-bg)] border border-[var(--window-border)]">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--hero-text-muted)] mb-1">
                  <Calendar size={14} />
                  Année
                </div>
                <div className="font-medium text-[var(--hero-text-main)]">
                  {project.year}
                </div>
              </div>

              <div className="about-value-card rounded-xl p-5 bg-[var(--window-bg)] border border-[var(--window-border)]">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--hero-text-muted)] mb-1">
                  <Tag size={14} />
                  Technologies
                </div>
                <div className="font-medium text-[var(--hero-text-main)]">
                  {project.tech.length}
                </div>
              </div>

              {project.githubUrl && (
                <div className="about-value-card rounded-xl p-5 bg-[var(--window-bg)] border border-[var(--window-border)]">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--hero-text-muted)] mb-1">
                    <GitBranch size={14} />
                    Code source
                  </div>
                  <div className="font-medium text-[var(--hero-text-main)]">
                    GitHub
                  </div>
                </div>
              )}

              {project.liveUrl && (
                <div className="about-value-card rounded-xl p-5 bg-[var(--window-bg)] border border-[var(--window-border)]">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--hero-text-muted)] mb-1">
                    <ExternalLink size={14} />
                    Démo live
                  </div>
                  <div className="font-medium text-[var(--hero-text-main)]">
                    Disponible
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 sm:py-32" style={{ background: "var(--about-dynamic-bg)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Long Description */}
              {(project.longDescription || project.description) && (
                <motion.article
                  initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={springs.gentle}
                  className="about-value-card rounded-xl p-8 bg-[var(--window-bg)] border border-[var(--window-border)]"
                >
                  <h2 className="font-sans font-bold text-xl tracking-tight text-[var(--hero-text-main)] mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                    À propos du projet
                  </h2>
                  <div className="prose prose-invert max-w-none text-[var(--hero-text-muted)] leading-relaxed">
                    <p className="text-base sm:text-lg">
                      {project.longDescription || project.description}
                    </p>
                  </div>
                </motion.article>
              )}

              {/* Tech Stack Details */}
              {project.tech && project.tech.length > 0 && (
                <motion.article
                  initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.gentle, delay: 0.1 }}
                  className="about-value-card rounded-xl p-8 bg-[var(--window-bg)] border border-[var(--window-border)]"
                >
                  <h2 className="font-sans font-bold text-xl tracking-tight text-[var(--hero-text-main)] mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                    Stack technique complète
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <motion.span
                        key={tech}
                        initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...springs.bouncy, delay: 0.02 * project.tech.indexOf(tech) }}
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 rounded-lg text-sm font-mono bg-[var(--hero-bg)] text-[var(--hero-text-main)] border border-[var(--window-border)] transition-all duration-200"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.article>
              )}

              {/* Features / Highlights could be added here based on project data */}
              <motion.article
                initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springs.gentle, delay: 0.2 }}
                className="about-value-card rounded-xl p-8 bg-[var(--window-bg)] border border-[var(--window-border)]"
              >
                <h2 className="font-sans font-bold text-xl tracking-tight text-[var(--hero-text-main)] mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                  Points forts
                </h2>
                <ul className="space-y-3" role="list">
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-[var(--hero-bg)] border border-[var(--window-border)]">
                    <CheckCircle size={20} className="text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--hero-text-muted)]">Architecture modulaire et maintenable</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-[var(--hero-bg)] border border-[var(--window-border)]">
                    <CheckCircle size={20} className="text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--hero-text-muted)]">Performance optimisée (Core Web Vitals)</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-[var(--hero-bg)] border border-[var(--window-border)]">
                    <CheckCircle size={20} className="text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--hero-text-muted)]">Accessibilité WCAG 2.2 AA</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-[var(--hero-bg)] border border-[var(--window-border)]">
                    <CheckCircle size={20} className="text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--hero-text-muted)]">Design responsive mobile-first</span>
                  </li>
                </ul>
              </motion.article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Action Buttons */}
              <motion.div
                initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springs.gentle, delay: 0.3 }}
                className="about-value-card rounded-xl p-6 bg-[var(--window-bg)] border border-[var(--window-border)] sticky top-24 space-y-3"
              >
                <h3 className="font-sans font-bold text-lg text-[var(--hero-text-main)] mb-4">
                  Liens du projet
                </h3>

                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--hero-bg)] border border-[var(--window-border)] text-[var(--hero-text-main)] hover:border-[var(--color-accent)] hover:bg-[var(--window-bg)] transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(99, 102, 241, 0.1)" }}>
                      <ExternalLink size={18} className="text-[var(--color-accent)]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Voir la démo live</p>
                      <p className="text-xs text-[var(--hero-text-muted)]">{new URL(project.liveUrl).hostname}</p>
                    </div>
                    <ArrowRight size={20} className="text-[var(--hero-text-muted)] group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}

                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--hero-bg)] border border-[var(--window-border)] text-[var(--hero-text-main)] hover:border-zinc-400 hover:bg-[var(--window-bg)] transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(113, 113, 122, 0.1)" }}>
                      <GitBranch size={18} className="text-zinc-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Voir le code source</p>
                      <p className="text-xs text-[var(--hero-text-muted)]">GitHub Repository</p>
                    </div>
                    <ArrowRight size={20} className="text-[var(--hero-text-muted)] group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </motion.div>

              {/* Project Info Card */}
              <motion.div
                initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springs.gentle, delay: 0.4 }}
                className="about-value-card rounded-xl p-6 bg-[var(--window-bg)] border border-[var(--window-border)]"
              >
                <h3 className="font-sans font-bold text-lg text-[var(--hero-text-main)] mb-4">
                  Informations
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[var(--hero-text-muted)]">Auteur</dt>
                    <dd className="font-medium text-[var(--hero-text-main)]">{personalData.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--hero-text-muted)]">Année</dt>
                    <dd className="font-medium text-[var(--hero-text-main)]">{project.year}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--hero-text-muted)]">Catégories</dt>
                    <dd className="font-medium text-[var(--hero-text-main)]">
                      {project.category.map((cat) => CATEGORY_LABELS[cat]).join(", ")}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--hero-text-muted)]">Technologies</dt>
                    <dd className="font-medium text-[var(--hero-text-main)]">{project.tech.length}</dd>
                  </div>
                </dl>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24" style={{ background: "var(--hero-bg)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 text-center">
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.gentle}
          >
            <h2 className="font-serif italic text-3xl sm:text-4xl font-normal tracking-wide text-[var(--hero-text-main)] mb-4">
              Intéressé par ce type de projet ?
            </h2>
            <p className="text-[var(--hero-text-muted)] max-w-xl mx-auto mb-8">
              Discutons de votre idée. Je suis toujours ouvert à de nouveaux défis techniques.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-mono text-sm font-bold tracking-wider uppercase"
              style={{
                background: "var(--hero-text-main)",
                color: "var(--hero-bg)"
              }}
            >
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springs.snappy}
              >
                Me contacter
                <ArrowRight size={16} />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
