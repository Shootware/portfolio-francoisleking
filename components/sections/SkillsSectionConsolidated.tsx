"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Server,
  Cpu,
  Smartphone,
  Megaphone,
  Video,
  Wrench,
  Shield,
  HardDrive,
  Code,
  Palette,
  Move,
  GitBranch,
  Database,
  Eye,
  Box,
  Terminal,
  BookOpen,
  Search,
  FileText,
  Share2,
  Mail,
  BarChart,
  TrendingUp,
  PenTool,
  Key,
  Activity,
  Package,
  Globe,
  ShieldCheck,
  FileCheck,
  Music,
} from "lucide-react";
import { motionTokens, springs } from "@/lib/motion-tokens";
import { useShouldAnimate } from "@/hooks/use-reduced-motion";
import { SkillsBackgroundLightweight as SkillsBackground } from "./skills/SkillsBackgroundLightweight";

interface Skill {
  id: string;
  category: string;
  name: string;
  level: number;
  icon: string;
  orderIndex: number;
}

interface SkillsData {
  items: Skill[];
}

// Group skills by category
function groupSkillsByCategory(items: Skill[]) {
  const categories: Record<string, Skill[]> = {};
  items.forEach((skill) => {
    if (!categories[skill.category]) {
      categories[skill.category] = [];
    }
    categories[skill.category].push(skill);
  });
  return categories;
}

// Map category to display info
const CATEGORY_CONFIG: Record<
  string,
  {
    title: string;
    description: string;
    icon: typeof Monitor;
    color: string;
    accentBg: string;
    terminalCmd?: string;
  }
> = {
  frontend: {
    title: "Ingénierie Frontend",
    description: "Interfaces utilisateur réactives, pixel-perfect et cinétiques.",
    icon: Monitor,
    color: "#818cf8",
    accentBg: "rgba(99, 102, 241, 0.05)",
    terminalCmd: "npm run dev -- --host",
  },
  backend: {
    title: "Architecture Backend",
    description: "Systèmes distribués, bases de données et APIs sécurisées.",
    icon: Server,
    color: "#2dd4bf",
    accentBg: "rgba(20, 184, 166, 0.05)",
    terminalCmd: "python manage.py runserver",
  },
  "desktop-mobile": {
    title: "Desktop & Mobile",
    description: "Applications natives multi-plateformes et hybrides.",
    icon: Smartphone,
    color: "#60a5fa",
    accentBg: "rgba(96, 165, 250, 0.05)",
    terminalCmd: "flutter run --release",
  },
  "ai-tools": {
    title: "IA, DevOps & Outils",
    description: "Automatisation, vision par ordinateur et workflows augmentés.",
    icon: Cpu,
    color: "#60a5fa",
    accentBg: "rgba(96, 165, 250, 0.05)",
    terminalCmd: "docker compose up -d",
  },
  marketing: {
    title: "Marketing Digital",
    description: "Stratégie d'acquisition, contenu et croissance organique.",
    icon: Megaphone,
    color: "#f472b6",
    accentBg: "rgba(244, 114, 182, 0.05)",
    terminalCmd: "npx vercel deploy --prod",
  },
  "video-editing": {
    title: "Montage Vidéo & Motion",
    description: "Création contenu, étalonnage, motion design et format court.",
    icon: Video,
    color: "#fb923c",
    accentBg: "rgba(251, 146, 60, 0.05)",
    terminalCmd: "ffmpeg -i input.mp4 -vf ... output.mp4",
  },
  maintenance: {
    title: "Maintenance & Ops",
    description: "CI/CD, monitoring, migrations et fiabilité production.",
    icon: Wrench,
    color: "#4ade80",
    accentBg: "rgba(74, 222, 128, 0.05)",
    terminalCmd: "kubectl rollout restart deployment/app",
  },
  security: {
    title: "Sécurité & Conformité",
    description: "Durcissement, audit, gestion secrets et RGPD.",
    icon: Shield,
    color: "#f87171",
    accentBg: "rgba(248, 113, 113, 0.05)",
    terminalCmd: "npm audit fix --force",
  },
  systems: {
    title: "Systèmes & Infrastructure",
    description: "Linux, conteneurs, réseau, bases de données et cloud.",
    icon: HardDrive,
    color: "#a78bfa",
    accentBg: "rgba(167, 139, 250, 0.05)",
    terminalCmd: "ssh root@prod 'htop'",
  },
};

const ICON_MAP: Record<string, typeof Monitor> = {
  Monitor,
  Server,
  Cpu,
  Smartphone,
  Megaphone,
  Video,
  Wrench,
  Shield,
  HardDrive,
  Code: Monitor,
  Palette: Monitor,
  Move: Monitor,
  GitBranch: Server,
  Database: Server,
  Eye: Cpu,
  Box: Cpu,
  Terminal: Cpu,
  BookOpen: Monitor,
  Search: Monitor,
  FileText: Monitor,
  Share2: Monitor,
  Mail: Monitor,
  BarChart: Monitor,
  TrendingUp: Monitor,
  PenTool: Monitor,
  Key: Monitor,
  Activity: Cpu,
  Package: Cpu,
  Globe: Monitor,
  ShieldCheck: Shield,
  FileCheck: Monitor,
  Music: Monitor,
};

interface SkillsSectionConsolidatedProps {
  skillsData: SkillsData;
}

export function SkillsSectionConsolidated({ skillsData }: SkillsSectionConsolidatedProps) {
  const shouldAnimate = useShouldAnimate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const groupedSkills = useMemo(() => groupSkillsByCategory(skillsData.items), [skillsData.items]);
  const categories = Object.keys(groupedSkills);

  // Set initial active category
  useEffect(() => {
    if (!activeCategory && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [activeCategory, categories]);

  // Auto-scroll based on mouse position when hovering
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isHovering) return;

    const scrollContainer = container.querySelector(".skills-scroll-track") as HTMLElement;
    if (!scrollContainer) return;

    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const targetScroll = mouseX * maxScroll;

    scrollContainer.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  }, [mouseX, isHovering]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    setMouseX(Math.max(0, Math.min(1, relativeX)));
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  // Get active category config
  const activeConfig = activeCategory ? CATEGORY_CONFIG[activeCategory] || CATEGORY_CONFIG.frontend : CATEGORY_CONFIG.frontend;
  const activeSkills = activeCategory ? groupedSkills[activeCategory] : [];

  return (
    <section id="skills" className="skills-section-unified relative py-24 sm:py-32">
      {/* UI/UX Design System Background */}
      <SkillsBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.gentle}
          className="mb-12 max-w-2xl"
        >
          <h2 className="skills-main-title text-4xl sm:text-5xl font-normal tracking-wide italic">
            Ce que je maîtrise
          </h2>
          <p className="skills-subtitle mt-4 text-sm sm:text-base opacity-60 leading-relaxed">
            Survolez la zone de défilement pour explorer mes pôles d'expertise. Cliquez sur une catégorie pour voir les détails.
          </p>
        </motion.div>

        {/* Consolidated Horizontal Scroll Zone */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.1 }}
          className="relative"
          ref={scrollRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Scroll indicator */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-2 pointer-events-none z-10"
            animate={{ opacity: isHovering ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-500 rounded-full"
              style={{ width: `${mouseX * 100}%` }}
              animate={{ scaleX: isHovering ? 1 : 0.3 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </motion.div>

          {/* Categories scroll track */}
          <div className="skills-scroll-track flex gap-4 pb-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-6 px-6">
            {categories.map((category, index) => {
              const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.frontend;
              const Icon = ICON_MAP[config.icon.name] || Monitor;
              const skills = groupedSkills[category];
              const isActive = activeCategory === category;

              return (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`skills-category-card flex-shrink-0 snap-start w-72 sm:w-80 relative group cursor-pointer ${
                    isActive ? "ring-2 ring-offset-2 ring-offset-[var(--hero-bg)]" : ""
                  }`}
                  style={{
                    borderColor: isActive ? config.color : "var(--window-border)",
                    boxShadow: isActive ? `0 10px 30px ${config.accentBg}` : "none",
                  }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.gentle, delay: index * 0.05 }}
                >
                  {/* Category icon and title */}
                  <div className="p-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: config.accentBg,
                        border: `1px solid ${isActive ? config.color : "var(--window-border)"}`,
                      }}
                    >
                      <Icon size={24} style={{ color: config.color }} />
                    </div>
                    <h3 className="text-card-title font-sans font-bold text-base sm:text-lg tracking-tight mb-2">
                      {config.title}
                    </h3>
                    <p className="text-xs opacity-50 line-clamp-2 mb-4">
                      {config.description}
                    </p>

                    {/* Skills preview (first 3) */}
                    <div className="flex flex-wrap gap-1.5 mb-4 max-h-16 overflow-hidden">
                      {skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill.id}
                          className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--hero-bg)] text-[var(--hero-text-main)] opacity-70 border border-[var(--window-border)] transition-all duration-200 group-hover:opacity-100"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {skills.length > 4 && (
                        <span className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--hero-bg)] text-[var(--hero-text-muted)] opacity-50 border border-[var(--window-border)]">
                          +{skills.length - 4} autres
                        </span>
                      )}
                    </div>

                    {/* Level indicator */}
                    <div className="flex items-center gap-2 text-xs opacity-60">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded transition-colors"
                            style={{
                              backgroundColor:
                                i < Math.floor(skills.reduce((acc, s) => acc + s.level, 0) / skills.length)
                                  ? config.color
                                  : "var(--window-border)",
                            }}
                          />
                        ))}
                      </div>
                      <span className="font-mono">
                        {Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length * 100) / 100}/5
                      </span>
                    </div>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ background: config.color }}
                    />
                  )}

                  {/* Hover glow */}
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      boxShadow: `0 0 30px ${config.color}40`,
                      opacity: isActive || isHovering ? 0.3 : 0,
                    }}
                    animate={{ opacity: isActive || isHovering ? 0.3 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-mono opacity-40 px-4 py-2 rounded-full bg-[var(--hero-bg)]/80 backdrop-blur-sm border border-[var(--window-border)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: shouldAnimate ? 1 : 0, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <span>← Faites défiler →</span>
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              ▸
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Active Category Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={shouldAnimate ? { opacity: 0, y: 20, height: 0 } : { opacity: 1, y: 0, height: "auto" }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={shouldAnimate ? { opacity: 0, y: -20, height: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
            className="mt-12 p-8 relative overflow-hidden"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ border: `1px solid ${activeConfig.color}` }}
                >
                  <activeConfig.icon size={20} style={{ color: activeConfig.color }} />
                </div>
                <div>
                  <h3 className="text-xl font-sans font-extrabold tracking-tight" style={{ color: activeConfig.color }}>
                    {activeConfig.title}
                  </h3>
                  <p className="text-xs opacity-50 font-mono">// {activeSkills.length} technologies</p>
                </div>
              </div>
              <div className="h-px w-24" style={{ background: activeConfig.color }} />
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSkills
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={shouldAnimate ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...springs.gentle, delay: index * 0.03 }}
                    className="group/item p-4 rounded-lg border border-[var(--window-border)] hover:border-[var(--hero-text-muted)]/30 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-skill-name opacity-90">{skill.name}</span>
                      <span className="text-[9px] font-mono opacity-40">{skill.level}/5</span>
                    </div>

                    {/* Animated skill bar */}
                    <div className="skills-bar-track h-[2px] w-full rounded-full overflow-hidden mb-3">
                      <motion.div
                        className="h-full rounded-full origin-left"
                        style={{ background: activeConfig.color }}
                        initial={shouldAnimate ? { scaleX: 0 } : { scaleX: skill.level / 5 }}
                        animate={{ scaleX: skill.level / 5 }}
                        transition={{ duration: 0.8, delay: 0.1 + index * 0.02, ease: "easeOut" }}
                      />
                    </div>

                    {/* Level dots */}
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded transition-all"
                          initial={shouldAnimate ? { scale: 0 } : { scale: 1 }}
                          animate={{
                            scale: 1,
                            backgroundColor: i < skill.level ? activeConfig.color : "var(--window-border)",
                          }}
                          transition={{ delay: 0.15 + index * 0.02 + i * 0.03, type: "spring", stiffness: 300, damping: 20 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Terminal command line */}
            <div className="mt-8 pt-6 border-t border-dashed border-[var(--window-border)]">
              <div className="font-mono text-[10px] opacity-20 flex items-center gap-2">
                <span className="text-[var(--hero-text-muted)]">$</span>
                <span>{activeConfig.terminalCmd || `inspect --target=${activeCategory} --status=loaded`}</span>
                <motion.span
                  className="terminal-cursor-block ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="skills-footer-line mt-16 h-px w-full opacity-20" />
      </div>
    </section>
  );
}
