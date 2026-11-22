"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Server, Cpu, ChevronRight, CornerDownRight } from "lucide-react";

const BLOCKS = [
  {
    id: "frontend",
    title: "Ingénierie Frontend",
    description: "Interfaces utilisateur réactives, pixel-perfect et cinétiques.",
    icon: Monitor,
    color: "#818cf8",
    accentBg: "rgba(99, 102, 241, 0.05)",
    subCategories: [
      {
        label: "Frameworks & Core",
        skills: [
          { name: "React / Next.js", level: 5 },
          { name: "TypeScript", level: 4 },
          { name: "HTML5 / CSS3 Sémantique", level: 5 }
        ]
      },
      {
        label: "Styling & Animation",
        skills: [
          { name: "Tailwind CSS", level: 5 },
          { name: "Framer Motion", level: 4 }
        ]
      },
      {
        label: "Mobile & Cross-Platform",
        skills: [
          { name: "React Native", level: 3 }
        ]
      }
    ]
  },
  {
    id: "backend",
    title: "Architecture Backend",
    description: "Systèmes distribués, bases de données et APIs sécurisées.",
    icon: Server,
    color: "#2dd4bf",
    accentBg: "rgba(20, 184, 166, 0.05)",
    subCategories: [
      {
        label: "Environnements & Frameworks",
        skills: [
          { name: "Python (Django & DRF)", level: 5 },
          { name: "Node.js / Express", level: 4 }
        ]
      },
      {
        label: "Données & Protocoles",
        skills: [
          { name: "Architectures REST API", level: 5 },
          { name: "PostgreSQL / MySQL", level: 4 },
          { name: "SQL Pur / Optimisation", level: 4 }
        ]
      },
      {
        label: "Scripts Natifs",
        skills: [
          { name: "C / C++", level: 3 },
          { name: "Java & PHP", level: 3 }
        ]
      }
    ]
  },
  {
    id: "ia-devops",
    title: "IA, DevOps & Systèmes",
    description: "Automatisation, vision par ordinateur et environnements Linux.",
    icon: Cpu,
    color: "#60a5fa",
    accentBg: "rgba(96, 165, 250, 0.05)",
    subCategories: [
      {
        label: "Intelligence Artificielle",
        skills: [
          { name: "Computer Vision (OpenCV)", level: 3 }
        ]
      },
      {
        label: "Infrastructure & Outils",
        skills: [
          { name: "Docker Containerization", level: 3 },
          { name: "Git / GitHub Workflows", level: 5 },
          { name: "Linux Administration / Bash", level: 4 }
        ]
      }
    ]
  }
];

// Configuration de l'animation d'apparition au scroll (Gauche à Droite)
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Effet cascade (l'un après l'autre)
    }
  }
};
const itemVariants: import("framer-motion").Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
};
export function SkillsSection() {
  const [activeBlock, setActiveBlock] = useState<string | null>("frontend");

  return (
    <section id="skills" className="skills-section-unified relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="skills-grid-overlay pointer-events-none absolute inset-0 z-0 opacity-25" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10">

        {/* En-tête */}
        <div className="mb-16 max-w-xl">
          <h2 className="skills-main-title text-4xl sm:text-5xl font-normal tracking-wide italic">
            Ce que je maîtrise
          </h2>
          <p className="skills-subtitle mt-4 text-sm sm:text-base opacity-60 leading-relaxed">
            Cliquez sur un pôle d'expertise pour explorer les technologies complémentaires et mon niveau d'application sur chacune d'elles.
          </p>
        </div>

        {/* Layout Interactif à deux colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Colonne Gauche : Les 3 Blocs Principaux (Animés de gauche à droite au scroll) */}
          <motion.div
            className="lg:col-span-5 flex flex-col gap-4"
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }} // Déclenche l'animation dès que la zone entre dans le viewport
          >
            {BLOCKS.map((block) => {
              const Icon = block.icon;
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
                      <Icon size={18} style={{ color: block.color }} />
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
          <div className="lg:col-span-7 skills-custom-card min-h-[420px] rounded-xl p-8 relative overflow-hidden flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {BLOCKS.map((block) => {
                if (block.id !== activeBlock) return null;

                return (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
                                    initial={{ scaleX: 0 }}
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

                    {/* Ligne de terminal décorative basse */}
                    <div className="font-mono text-[10px] opacity-20 border-t border-dashed border-zinc-500/20 pt-4">
                      {`$ inspect --target=${block.id} --status=loaded`}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>

        <div className="skills-footer-line mt-20 h-px w-full opacity-20" />

        {activeBlock === "backend" && (
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
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
          </div>
        )}
      </div>
    </section>
  );
}