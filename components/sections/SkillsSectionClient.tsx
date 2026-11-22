"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Server, Cpu, ChevronRight, CornerDownRight } from "lucide-react";
import { motionTokens, springs } from "@/lib/motion-tokens";
import { useShouldAnimate } from "@/hooks/use-reduced-motion";
import { ParticleField } from "@/components/three/ParticleField";

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
const CATEGORY_CONFIG: Record<string, { title: string; description: string; icon: typeof Monitor; color: string; accentBg: string; terminalCmd?: string }> = {
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
  "ia-devops": {
    title: "IA, DevOps & Systèmes",
    description: "Automatisation, vision par ordinateur et environnements Linux.",
    icon: Cpu,
    color: "#60a5fa",
    accentBg: "rgba(96, 165, 250, 0.05)",
    terminalCmd: "docker compose up -d",
  },
  marketing: {
    title: "Marketing Digital",
    description: "Stratégie d'acquisition, contenu et croissance organique.",
    icon: Monitor,
    color: "#f472b6",
    accentBg: "rgba(244, 114, 182, 0.05)",
    terminalCmd: "npx vercel deploy --prod",
  },
  "video-editing": {
    title: "Montage Vidéo & Motion",
    description: "Création contenu, étalonnage, motion design et format court.",
    icon: Cpu,
    color: "#fb923c",
    accentBg: "rgba(251, 146, 60, 0.05)",
    terminalCmd: "ffmpeg -i input.mp4 -vf ... output.mp4",
  },
  maintenance: {
    title: "Maintenance & Ops",
    description: "CI/CD, monitoring, migrations et fiabilité production.",
    icon: Server,
    color: "#4ade80",
    accentBg: "rgba(74, 222, 128, 0.05)",
    terminalCmd: "kubectl rollout restart deployment/app",
  },
  security: {
    title: "Sécurité & Conformité",
    description: "Durcissement, audit, gestion secrets et RGPD.",
    icon: Cpu,
    color: "#f87171",
    accentBg: "rgba(248, 113, 113, 0.05)",
    terminalCmd: "npm audit fix --force",
  },
  systems: {
    title: "Systèmes & Infrastructure",
    description: "Linux, conteneurs, réseau, bases de données et cloud.",
    icon: Server,
    color: "#a78bfa",
    accentBg: "rgba(167, 139, 250, 0.05)",
    terminalCmd: "ssh root@prod 'htop'",
  },
};

const ICON_MAP: Record<string, typeof Monitor> = {
  Monitor,
  Server,
  Cpu,
  Code: Monitor,
  Palette: Monitor,
  Move: Monitor,
  Smartphone: Monitor,
  GitBranch: Server,
  Database: Server,
  Eye: Cpu,
  Box: Cpu,
  Terminal: Cpu,
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: motionTokens.duration.normal,
    }
  }
};

const itemVariants: import("framer-motion").Variants = {
  hidden: { opacity: 0, x: -motionTokens.distance.md },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

interface SkillsSectionClientProps {
  skillsData: SkillsData;
}

export function SkillsSectionClient({ skillsData }: SkillsSectionClientProps) {
  const [activeBlock, setActiveBlock] = useState<string | null>("frontend");
  const shouldAnimate = useShouldAnimate();

  const groupedSkills = groupSkillsByCategory(skillsData.items);
  const blocks = Object.entries(groupedSkills).map(([category, skills]) => {
    const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.frontend;
    const Icon = ICON_MAP[config.icon.name] || Monitor;
    return {
      id: category,
      title: config.title,
      description: config.description,
      icon: Icon,
      color: config.color,
      accentBg: config.accentBg,
      subCategories: [
        {
          label: "Compétences",
          skills: skills.sort((a, b) => a.orderIndex - b.orderIndex).map(s => ({ name: s.name, level: s.level }))
        }
      ]
    };
  });

  // Set initial active block if not set
  if (!activeBlock && blocks.length > 0) {
    setActiveBlock(blocks[0].id);
  }

  return (
    <section id="skills" className="skills-section-unified relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="skills-grid-overlay pointer-events-none absolute inset-0 z-0 opacity-25" />

      {/* 3D Particle Field - Tech radar visualization */}
      <ParticleField
        particleCount={800}
        colors={["#818cf8", "#a5b4fc", "#c4b5fd", "#60a5fa", "#2dd4bf"]}
        className="pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10">

        {/* En-tête */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.gentle}
          className="mb-16 max-w-xl"
        >
          <h2 className="skills-main-title text-4xl sm:text-5xl font-normal tracking-wide italic">
            Ce que je maîtrise
          </h2>
          <p className="skills-subtitle mt-4 text-sm sm:text-base opacity-60 leading-relaxed">
            Cliquez sur un pôle d'expertise pour explorer les technologies complémentaires et mon niveau d'application sur chacune d'elles.
          </p>
        </motion.div>

        {/* Layout Interactif à deux colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Colonne Gauche : Les 3 Blocs Principaux (Animés de gauche à droite au scroll) */}
          <motion.div
            className="lg:col-span-5 flex flex-col gap-4"
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {blocks.map((block) => {
              const isOpen = activeBlock === block.id;

              return (
                <motion.button
                  key={block.id}
                  onClick={() => setActiveBlock(block.id)}
                  variants={itemVariants}
                  className="skills-custom-card w-full text-left p-6 rounded-xl relative transition-all duration-300 flex items-center justify-between group cursor-pointer"
                  style={{
                    borderColor: isOpen ? block.color : "var(--window-border)",
                    boxShadow: isOpen ? `0 10px 30px ${block.accentBg}` : "none"
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start gap-4 max-w-[85%]">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300"
                      style={{
                        background: block.accentBg,
                        border: `1px solid ${isOpen ? block.color : "var(--window-border)"}`,
                        transform: isOpen ? "scale(1.05)" : "none"
                      }}
                    >
                      <block.icon size={18} style={{ color: block.color }} />
                    </div>
                    <div>
                      <h3 className="text-card-title font-sans font-bold text-base tracking-tight">
                        {block.title}
                      </h3>
                      <p className="text-xs opacity-50 mt-1 line-clamp-2">
                        {block.description}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0, x: isOpen ? 4 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="opacity-40 group-hover:opacity-100 transition-opacity pl-2"
                  >
                    <ChevronRight size={16} style={{ color: isOpen ? block.color : "inherit" }} />
                  </motion.div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Colonne Droite : Contenu Supplémentaire Dynamique */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.gentle}
            className="lg:col-span-7 skills-custom-card min-h-[420px] rounded-xl p-8 relative overflow-hidden flex flex-col justify-between"
          >
            <AnimatePresence mode="wait">
              {blocks.map((block) => {
                if (block.id !== activeBlock) return null;

                return (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
                    className="w-full h-full flex flex-col justify-between gap-8"
                  >
                    {/* Header Interne */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CornerDownRight size={14} style={{ color: block.color }} className="opacity-60" />
                        <span className="font-mono text-[10px] tracking-widest opacity-40 uppercase">
                          // Spécifications de la Stack
                        </span>
                      </div>
                      <h4 className="text-xl font-sans font-extrabold tracking-tight" style={{ color: block.color }}>
                        {block.title}
                      </h4>
                    </div>

                    {/* Sous-catégories et Jauges */}
                    <div className="flex flex-col gap-6 flex-1 justify-center">
                      {block.subCategories.map((sub, sIdx) => (
                        <div key={sIdx} className="space-y-3">
                          <h5 className="font-mono text-[10px] font-bold tracking-wider opacity-40 uppercase">
                            {sub.label}
                          </h5>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {sub.skills.map((skill) => (
                              <div key={skill.name} className="group/item">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-medium text-skill-name opacity-85">
                                    {skill.name}
                                  </span>
                                  <span className="text-[9px] font-mono opacity-40">
                                    {skill.level}/5
                                  </span>
                                </div>

                                {/* Barre d'animation synchrone */}
                                <div className="skills-bar-track h-[2px] w-full rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full rounded-full origin-left"
                                    style={{ background: block.color }}
                                    initial={shouldAnimate ? { scaleX: 0 } : { scaleX: skill.level / 5 }}
                                    animate={{ scaleX: skill.level / 5 }}
                                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Ligne de terminal décorative basse - commande personnalisée par catégorie */}
                    <div className="font-mono text-[10px] opacity-20 border-t border-dashed border-zinc-500/20 pt-4">
                      {`$ ${CATEGORY_CONFIG[block.id]?.terminalCmd || `inspect --target=${block.id} --status=loaded`}`}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

        </div>

        <div className="skills-footer-line mt-20 h-px w-full opacity-20" />

        {/* Backend code examples */}
        {activeBlock === "backend" && (
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.gentle, delay: 0.2 }}
            className="mt-12 grid gap-6 lg:grid-cols-2"
          >
            <div className="hero-dev-window">
              <div className="window-header">
                <div className="window-controls">
                  <span className="control-dot dot-close" />
                  <span className="control-dot dot-minimize" />
                  <span className="control-dot dot-expand" />
                </div>
                <div className="window-tabs">
                  <button type="button" className="window-tab active-tab">
                    <span className="tab-decor" aria-hidden="true">◇</span>
                    <span className="tab-title">snake.py</span>
                  </button>
                </div>
              </div>
              <div className="window-body window-split-body">
                <div className="code-pane">
                  <div className="terminal-meta"># Code serpent</div>
                  <div className="terminal-lines">
                    <div className="terminal-line"><span className="line-content">def update_snake(body, direction):</span></div>
                    <div className="terminal-line"><span className="line-content">    head = body[0]</span></div>
                    <div className="terminal-line"><span className="line-content">    new_head = (head[0] + direction[0], head[1] + direction[1])</span></div>
                    <div className="terminal-line"><span className="line-content">    return [new_head] + body[:-1]</span></div>
                    <div className="terminal-line"><span className="line-content"></span></div>
                    <div className="terminal-line"><span className="line-content">snake = [(5,5), (4,5), (3,5)]</span></div>
                  </div>
                </div>
                <div className="result-pane">
                  <div className="terminal-meta"># Résultat</div>
                  <div className="terminal-lines">
                    <div className="terminal-line"><span className="line-content">[(6,5), (5,5), (4,5)]</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-dev-window">
              <div className="window-header">
                <div className="window-controls">
                  <span className="control-dot dot-close" />
                  <span className="control-dot dot-minimize" />
                  <span className="control-dot dot-expand" />
                </div>
                <div className="window-tabs">
                  <button type="button" className="window-tab active-tab">
                    <span className="tab-decor" aria-hidden="true">◇</span>
                    <span className="tab-title">calc.py</span>
                  </button>
                </div>
              </div>
              <div className="window-body window-split-body">
                <div className="code-pane">
                  <div className="terminal-meta"># Code calculatrice</div>
                  <div className="terminal-lines">
                    <div className="terminal-line"><span className="line-content">def calculate(a, b, operation):</span></div>
                    <div className="terminal-line"><span className="line-content">    if operation == "*":</span></div>
                    <div className="terminal-line"><span className="line-content">        return a * b</span></div>
                    <div className="terminal-line"><span className="line-content">    return None</span></div>
                    <div className="terminal-line"><span className="line-content"></span></div>
                    <div className="terminal-line"><span className="line-content">result = calculate(12, 20, "*") + 8</span></div>
                  </div>
                </div>
                <div className="result-pane">
                  <div className="terminal-meta"># Sortie</div>
                  <div className="terminal-lines">
                    <div className="terminal-line"><span className="line-content">248</span></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}