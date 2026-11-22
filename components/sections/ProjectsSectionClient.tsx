"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import { motionTokens, springs } from "@/lib/motion-tokens";
import { useShouldAnimate } from "@/hooks/use-reduced-motion";
import { InteractiveCard } from "@/components/three/InteractiveCard";

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

interface ProjectsData {
  items: Project[];
}

const FILTER_TABS: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "desktop", label: "Desktop" },
  { id: "ai", label: "IA" },
];

function ProjectCard({ project, shouldAnimate }: { project: Project; shouldAnimate: boolean }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = project.images?.[0] || project.image;

  return (
    <InteractiveCard>
      <div className="relative h-48 w-full overflow-hidden bg-zinc-500/5 border-b border-[var(--window-border)]">

        {/* Lettre repère en arrière-plan (si l'image met du temps à charger ou est absente) */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0">
          <span className="font-serif font-black text-7xl opacity-[0.12] text-[var(--hero-text-main)]">
            {project.title.charAt(0)}
          </span>
        </div>

        {/* Rendu strict de l'image .png (z-10 garantit qu'elle s'affiche au-dessus) */}
        {!imgError && imageUrl ? (
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover relative z-10 transition-transform duration-500 hover:scale-105"
            priority={project.featured}
            onError={() => setImgError(true)}
          />
        ) : null}

        {/* Badge Année */}
        <span className="absolute top-3 right-3 z-20 text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-md bg-[var(--window-bg)]/80 border border-[var(--window-border)] text-[var(--hero-text-muted)]">
          {project.year}
        </span>

        {/* Badge Spécifique aux projets mis en avant */}
        {project.featured && (
          <span className="absolute top-3 left-3 z-20 text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
            ★ Featured
          </span>
        )}
      </div>

      {/* Détails du projet */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {project.category.map((cat) => (
              <span
                key={cat}
                className="text-[9px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-[var(--hero-bg)] text-[var(--hero-text-muted)] border border-[var(--window-border)]"
              >
                {cat}
              </span>
            ))}
          </div>

          <h3 className="font-sans font-bold text-base tracking-tight text-[var(--hero-text-main)]">
            {project.title}
          </h3>

          <p className="text-xs leading-relaxed text-[var(--hero-text-muted)] opacity-90 line-clamp-3">
            {project.description}
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-dashed border-[var(--window-border)]">
          <div className="flex flex-wrap gap-1">
            {project.tech.slice(0, 4).map((techName) => (
              <span
                key={techName}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--hero-bg)] text-[var(--hero-text-main)] opacity-75"
              >
                {techName}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 opacity-40 text-[var(--hero-text-main)]">
                +{project.tech.length - 4}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-medium pt-1">
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:opacity-75 transition-opacity text-[var(--hero-text-main)] font-bold z-20"
              >
                <ExternalLink size={13} />
                Live
              </Link>
            )}
            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:opacity-75 transition-opacity text-[var(--hero-text-muted)] z-20"
              >
                Code
              </Link>
            )}
            {project.caseStudyUrl && (
              <Link
                href={project.caseStudyUrl}
                className="inline-flex items-center gap-1 hover:opacity-75 transition-opacity text-[var(--color-accent)] font-bold z-20"
              >
                Case Study
                <ArrowRight size={12} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </InteractiveCard>
  );
}

interface ProjectsSectionClientProps {
  projectsData: ProjectsData;
}

export function ProjectsSectionClient({ projectsData }: ProjectsSectionClientProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | "all">("all");
  const shouldAnimate = useShouldAnimate();

  const filteredProjects = activeFilter === "all"
    ? projectsData.items
    : projectsData.items.filter((p) => p.category.includes(activeFilter));

  return (
    <section id="projects" className="skills-section-unified py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.gentle}
          className="mb-14 max-w-xl"
        >
          <h2 className="skills-main-title text-4xl sm:text-5xl font-normal tracking-wide italic">
            Ce que j'ai construit
          </h2>
          <p className="skills-subtitle mt-4 text-sm sm:text-base opacity-65 leading-relaxed">
            Produits réels, architectures propres — chaque projet résout un vrai problème.
          </p>
        </motion.div>

        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.1 }}
          role="tablist"
          aria-label="Filtrer les projets"
          className="flex flex-wrap gap-2 mb-10"
        >
          {FILTER_TABS.map(({ id, label }) => {
            const isActive = activeFilter === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(id)}
                className="px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase border transition-all duration-200 cursor-pointer z-20"
                style={{
                  background: isActive ? "var(--hero-text-main)" : "var(--about-card-bg)",
                  color: isActive ? "var(--about-dynamic-bg)" : "var(--hero-text-main)",
                  borderColor: isActive ? "var(--hero-text-main)" : "var(--window-border)"
                }}
              >
                {label}
              </button>
            );
          })}
        </motion.div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} shouldAnimate={shouldAnimate} />
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16 flex justify-center">
          <Link
            href="https://github.com/Shootware"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase opacity-50 hover:opacity-100 transition-opacity text-[var(--hero-text-main)]"
          >
            Voir tous mes projets sur GitHub
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>

        <div className="skills-footer-line mt-20 h-px w-full opacity-20" />
      </div>
    </section>
  );
}