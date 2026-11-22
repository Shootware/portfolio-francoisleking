"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Brain,
  Code,
  Server,
  Terminal,
  Box,
  Eye,
  GitBranch,
  Database,
  Palette,
  Move,
  Smartphone,
  Cpu,
  Zap,
  Briefcase,
  FolderGit2,
} from "lucide-react";
import { motionTokens, springs } from "@/lib/motion-tokens";
import { useShouldAnimate } from "@/hooks/use-reduced-motion";

export type SkillCategory = "frontend" | "backend" | "ia-devops";

interface Skill {
  id: string;
  category: SkillCategory;
  name: string;
  level: number;
  icon: string;
  orderIndex: number;
}

interface SkillsData {
  items: Skill[];
}

interface ExperienceItem {
  id: string;
  type: string;
  company: string;
  role: string;
  technologies: string[];
}

interface ExperienceData {
  items: ExperienceItem[];
}

interface Project {
  id: string;
  title: string;
  tech: string[];
  category: string[];
}

interface ProjectsData {
  items: Project[];
}

interface PersonalData {
  name: string;
  tagline: string;
  avatar_url: string;
}

interface DocsClientProps {
  skillsData: SkillsData;
  experienceData: ExperienceData;
  projectsData: ProjectsData;
  personalData: PersonalData;
  initialCategory?: string;
}

const CATEGORY_CONFIG: Record<SkillCategory, { label: string; icon: typeof Code; color: string; bg: string; description: string }> = {
  frontend: {
    label: "Frontend",
    icon: Code,
    color: "#6366f1",
    bg: "rgba(99, 102, 241, 0.1)",
    description: "Interfaces utilisateur modernes, performantes et accessibles",
  },
  backend: {
    label: "Backend",
    icon: Server,
    color: "#1d9e75",
    bg: "rgba(29, 158, 117, 0.1)",
    description: "APIs robustes, architectures scalables et données sécurisées",
  },
  "ia-devops": {
    label: "IA, DevOps & Systèmes",
    icon: Terminal,
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)",
    description: "Intelligence artificielle, infrastructure et automatisation",
  },
};

const CATEGORY_ORDER: SkillCategory[] = ["frontend", "backend", "ia-devops"];

const ICON_COMPONENTS: Record<string, typeof Code> = {
  Code: Code,
  Palette: Palette,
  Move: Move,
  Smartphone: Smartphone,
  Server: Server,
  GitBranch: GitBranch,
  Database: Database,
  Cpu: Cpu,
  Box: Box,
  Eye: Eye,
  Terminal: Terminal,
  Brain: Brain,
  Zap: Zap,
};

function getProficiencyLabel(level: number): { label: string; color: string } {
  if (level >= 5) return { label: "Expert", color: "#1d9e75" };
  if (level >= 4) return { label: "Avancé", color: "#6366f1" };
  if (level >= 3) return { label: "Intermédiaire", color: "#f59e0b" };
  if (level >= 2) return { label: "Débutant", color: "#ef4444" };
  return { label: "Novice", color: "#6b7280" };
}

function getProficiencyWidth(level: number): number {
  return Math.min((level / 5) * 100, 100);
}

export function DocsClient({ skillsData, experienceData, projectsData, initialCategory }: DocsClientProps) {
  const shouldAnimate = useShouldAnimate();
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "all">(initialCategory as SkillCategory || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<SkillCategory, boolean>>({
    frontend: true,
    backend: true,
    "ia-devops": true,
  });

  // Get all unique technologies from experience and projects
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    experienceData.items.forEach((exp) => exp.technologies.forEach((t) => techSet.add(t)));
    projectsData.items.forEach((proj) => proj.tech.forEach((t) => techSet.add(t)));
    return Array.from(techSet).sort();
  }, [experienceData, projectsData]);

  // Filter skills based on category and search
  const filteredSkills = useMemo(() => {
    return skillsData.items
      .filter((skill) => {
        const matchesCategory = activeCategory === "all" || skill.category === activeCategory;
        const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }, [skillsData.items, activeCategory, searchQuery]);

  // Group filtered skills by category
  const skillsByCategory = useMemo(() => {
    const grouped: Record<SkillCategory, Skill[]> = {
      frontend: [],
      backend: [],
      "ia-devops": [],
    };
    filteredSkills.forEach((skill) => {
      grouped[skill.category].push(skill);
    });
    return grouped;
  }, [filteredSkills]);

  // Get technologies used in experience/projects for cross-reference
  const techUsageCount = useMemo(() => {
    const usage: Record<string, { experience: number; projects: number }> = {};
    experienceData.items.forEach((exp) => {
      exp.technologies.forEach((tech) => {
        usage[tech] = usage[tech] || { experience: 0, projects: 0 };
        usage[tech].experience++;
      });
    });
    projectsData.items.forEach((proj) => {
      proj.tech.forEach((tech) => {
        usage[tech] = usage[tech] || { experience: 0, projects: 0 };
        usage[tech].projects++;
      });
    });
    return usage;
  }, [experienceData, projectsData]);

  const handleCategoryClick = (category: SkillCategory | "all") => {
    setActiveCategory((prev) => (prev === category ? "all" : category));
  };

  const toggleCategory = (category: SkillCategory) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const totalSkills = skillsData.items.length;
  const totalTechnologies = allTechnologies.length;
  const totalExperience = experienceData.items.length;
  const totalProjects = projectsData.items.length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden" style={{ background: "var(--hero-bg)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 relative z-10">
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.gentle}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.span
                initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...springs.bouncy, delay: 0.1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase"
                style={{ background: "rgba(99, 102, 241, 0.1)", color: "#818cf8", border: "1px solid rgba(99, 102, 241, 0.2)" }}
              >
                <Code size={12} />
                Documentation Technique
              </motion.span>
            </div>

            <h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl font-normal tracking-wide text-[var(--hero-text-main)] mb-4">
              Stack Technique & Documentation
            </h1>
            <p className="text-lg sm:text-xl text-[var(--hero-text-muted)] max-w-2xl mb-8">
              Une vue d'ensemble complète des technologies, outils et compétences qui alimentent mes projets.
              Filtrez par catégorie, recherchez par nom, et explorez l'utilisation réelle dans mes expériences.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
              <div className="about-value-card rounded-xl p-5 bg-[var(--window-bg)] border border-[var(--window-border)]">
                <div className="text-2xl sm:text-3xl font-bold text-[var(--hero-text-main)]">{totalSkills}</div>
                <div className="text-xs font-mono text-[var(--hero-text-muted)] mt-1">Compétences référencées</div>
              </div>
              <div className="about-value-card rounded-xl p-5 bg-[var(--window-bg)] border border-[var(--window-border)]">
                <div className="text-2xl sm:text-3xl font-bold text-[var(--hero-text-main)]">{totalTechnologies}</div>
                <div className="text-xs font-mono text-[var(--hero-text-muted)] mt-1">Technologies uniques</div>
              </div>
              <div className="about-value-card rounded-xl p-5 bg-[var(--window-bg)] border border-[var(--window-border)]">
                <div className="text-2xl sm:text-3xl font-bold text-[var(--hero-text-main)]">{totalExperience}</div>
                <div className="text-xs font-mono text-[var(--hero-text-muted)] mt-1">Expériences professionnelles</div>
              </div>
              <div className="about-value-card rounded-xl p-5 bg-[var(--window-bg)] border border-[var(--window-border)]">
                <div className="text-2xl sm:text-3xl font-bold text-[var(--hero-text-main)]">{totalProjects}</div>
                <div className="text-xs font-mono text-[var(--hero-text-muted)] mt-1">Projets réalisés</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8" style={{ background: "var(--about-dynamic-bg)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.gentle, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
          >
            {/* Search */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--hero-text-muted)]" size={20} />
              <input
                type="text"
                placeholder="Rechercher une technologie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-[var(--window-bg)] border border-[var(--window-border)] text-[var(--hero-text-main)] placeholder-[var(--hero-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {[
                { id: "all", label: "Toutes", icon: Brain },
                ...CATEGORY_ORDER.map((cat) => ({ id: cat, label: CATEGORY_CONFIG[cat].label, icon: CATEGORY_CONFIG[cat].icon })),
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...springs.bouncy, delay: 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategoryClick(tab.id as SkillCategory | "all")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeCategory === tab.id
                      ? "text-white shadow-lg"
                      : "text-[var(--hero-text-muted)] hover:text-[var(--hero-text-main)]"
                  }`}
                  style={{
                    background: activeCategory === tab.id
                      ? (tab.id === "all" ? "linear-gradient(135deg, #6366f1, #1d9e75)" : CATEGORY_CONFIG[tab.id as SkillCategory].color)
                      : "transparent",
                    border: activeCategory === tab.id ? "none" : "1px solid",
                    borderColor: activeCategory !== tab.id && tab.id !== "all" ? CATEGORY_CONFIG[tab.id as SkillCategory].color : "transparent",
                  }}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Categories */}
      <section className="py-16 sm:py-24" style={{ background: "var(--about-dynamic-bg)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.gentle}
          >
            {CATEGORY_ORDER.map((category, catIndex) => {
              const config = CATEGORY_CONFIG[category];
              const skills = skillsByCategory[category];
              const isExpanded = expandedCategories[category];
              const hasSkills = skills.length > 0;

              if (!hasSkills && activeCategory !== "all" && activeCategory !== category) {
                return null;
              }

              const IconComponent = config.icon;

              return (
                <motion.div
                  key={category}
                  initial={shouldAnimate ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.gentle, delay: 0.1 + catIndex * 0.1 }}
                  className="mb-12"
                >
                  {/* Category Header */}
                  <motion.button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center gap-4 p-5 rounded-xl bg-[var(--window-bg)] border border-[var(--window-border)] hover:border-[var(--color-accent)] transition-all text-left"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <motion.div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: config.bg }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={springs.snappy}
                    >
                      <IconComponent size={24} style={{ color: config.color }} />
                    </motion.div>
                    <div className="flex-1">
                      <h2 className="font-sans font-bold text-xl text-[var(--hero-text-main)]">{config.label}</h2>
                      <p className="text-sm text-[var(--hero-text-muted)] mt-1">{config.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[var(--hero-text-muted)]">
                      <span className="font-mono font-bold text-[var(--hero-text-main)]">{skills.length}</span>
                      <span>compétences</span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={springs.snappy}
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </div>
                  </motion.button>

                  {/* Skills List */}
                  <motion.div
                    initial={isExpanded ? { opacity: 0, height: 0 } : { opacity: 0, height: 0 }}
                    animate={isExpanded ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                    transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="space-y-3 pl-18">
                      {skills.map((skill, skillIndex) => {
                        const SkillIconComponent = ICON_COMPONENTS[skill.icon] || Code;
                        const usage = techUsageCount[skill.name] || { experience: 0, projects: 0 };
                        const proficiency = getProficiencyLabel(skill.level);
                        const proficiencyWidth = getProficiencyWidth(skill.level);

                        return (
                          <motion.div
                            key={skill.id}
                            initial={shouldAnimate ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ ...springs.gentle, delay: 0.05 * skillIndex }}
                            className="about-value-card rounded-xl p-5 bg-[var(--window-bg)] border border-[var(--window-border)] hover:border-[var(--color-accent)] transition-all"
                            whileHover={{ x: 4 }}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: config.bg }}>
                                <SkillIconComponent size={20} style={{ color: config.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-sans font-bold text-lg text-[var(--hero-text-main)]">{skill.name}</h3>
                                  <motion.span
                                    initial={shouldAnimate ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ ...springs.bouncy, delay: 0.1 }}
                                    className="px-2 py-0.5 rounded text-xs font-mono font-bold"
                                    style={{ background: proficiency.color + "20", color: proficiency.color }}
                                  >
                                    {proficiency.label}
                                  </motion.span>
                                </div>

                                {/* Proficiency Bar */}
                                <div className="h-2 rounded-full bg-[var(--hero-bg)] overflow-hidden mb-3">
                                  <motion.div
                                    initial={shouldAnimate ? { width: 0 } : { width: `${proficiencyWidth}%` }}
                                    animate={{ width: `${proficiencyWidth}%` }}
                                    transition={{ ...springs.gentle, delay: 0.2 + skillIndex * 0.03 }}
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ background: config.color }}
                                  />
                                </div>

                                {/* Usage Stats */}
                                {(usage.experience > 0 || usage.projects > 0) && (
                                  <div className="flex items-center gap-4 text-xs text-[var(--hero-text-muted)]">
                                    {usage.experience > 0 && (
                                      <span className="flex items-center gap-1">
                                        <Briefcase size={12} />
                                        {usage.experience} expérience{usage.experience > 1 ? "s" : ""}
                                      </span>
                                    )}
                                    {usage.projects > 0 && (
                                      <span className="flex items-center gap-1">
                                        <FolderGit2 size={12} />
                                        {usage.projects} projet{usage.projects > 1 ? "s" : ""}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="font-mono text-2xl font-bold text-[var(--hero-text-main)]">{skill.level}/5</div>
                                <div className="text-xs text-[var(--hero-text-muted)]">Niveau</div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* No results message */}
            {filteredSkills.length === 0 && activeCategory !== "all" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springs.gentle}
                className="text-center py-16"
              >
                <Search size={48} className="mx-auto text-[var(--hero-text-muted)]/50 mb-4" />
                <p className="text-[var(--hero-text-muted)]">Aucune compétence ne correspond à votre recherche dans cette catégorie.</p>
              </motion.div>
            )}

            {filteredSkills.length === 0 && searchQuery && activeCategory === "all" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springs.gentle}
                className="text-center py-16"
              >
                <Search size={48} className="mx-auto text-[var(--hero-text-muted)]/50 mb-4" />
                <p className="text-[var(--hero-text-muted)]">Aucune compétence ne correspond à « {searchQuery} ».</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* All Technologies Index */}
      <section className="py-16 sm:py-24" style={{ background: "var(--hero-bg)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.gentle}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif italic text-3xl sm:text-4xl font-normal tracking-wide text-[var(--hero-text-main)]">
                Index des Technologies
              </h2>
              <div className="text-sm text-[var(--hero-text-muted)]">
                {allTechnologies.length} technologies uniques
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {allTechnologies.map((tech, index) => {
                const usage = techUsageCount[tech] || { experience: 0, projects: 0 };
                const totalUsage = usage.experience + usage.projects;
                const intensity = Math.min(totalUsage / 5, 1);

                return (
                  <motion.span
                    key={tech}
                    initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...springs.bouncy, delay: 0.02 * index }}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 rounded-lg text-sm font-mono transition-all duration-200 cursor-default"
                    style={{
                      background: `rgba(99, 102, 241, ${0.05 + intensity * 0.15})`,
                      color: `rgba(99, 102, 241, ${0.6 + intensity * 0.4})`,
                      border: `1px solid rgba(99, 102, 241, ${0.1 + intensity * 0.2})`,
                    }}
                    title={`${usage.experience} exp, ${usage.projects} projets`}
                  >
                    {tech}
                    {totalUsage > 0 && (
                      <span className="ml-1.5 text-xs opacity-70">({totalUsage})</span>
                    )}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24" style={{ background: "var(--about-dynamic-bg)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 text-center">
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.gentle}
          >
            <h2 className="font-serif italic text-3xl sm:text-4xl font-normal tracking-wide text-[var(--hero-text-main)] mb-4">
              Besoin d'une expertise technique ?
            </h2>
            <p className="text-[var(--hero-text-muted)] max-w-xl mx-auto mb-8">
              Je suis toujours ouvert à de nouveaux défis techniques. Discutons de votre projet.
            </p>
            <motion.a
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-mono text-sm font-bold tracking-wider uppercase"
              style={{
                background: "var(--hero-text-main)",
                color: "var(--hero-bg)"
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={springs.snappy}
            >
              Me contacter
              <ChevronRight size={16} />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
