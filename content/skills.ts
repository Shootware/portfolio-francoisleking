// ============================================================
// SKILLS DATA — Compétences groupées par catégorie
// ============================================================

export interface Skill {
  name: string;
  level: 1 | 2 | 3 | 4 | 5; // 5 = expert
  icon?: string; // emoji ou chemin logo
}

export interface SkillCategory {
  id: string;
  label: string;
  icon: string; // icône Lucide
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    icon: "Monitor",
    skills: [
      { name: "React / Next.js", level: 5 },
      { name: "TypeScript", level: 4 },
      { name: "Tailwind CSS", level: 5 },
      { name: "Framer Motion", level: 4 },
      { name: "HTML / CSS", level: 5 },
      { name: "Vue.js / Nuxt", level: 3 },
      { name: "React Native / Expo", level: 3 },
      { name: "Accessibilité (WCAG)", level: 4 },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    icon: "Server",
    skills: [
      { name: "Node.js / Express", level: 4 },
      { name: "Django / DRF", level: 4 },
      { name: "Python", level: 5 },
      { name: "FastAPI", level: 4 },
      { name: "REST API / GraphQL", level: 5 },
      { name: "PostgreSQL / MySQL", level: 4 },
      { name: "Redis / Caching", level: 3 },
      { name: "Supabase / Firebase", level: 4 },
      { name: "Docker / Kubernetes", level: 3 },
    ],
  },
  {
    id: "desktop-mobile",
    label: "Desktop & Mobile",
    icon: "Smartphone",
    skills: [
      { name: "PyQt5 / PySide", level: 5 },
      { name: "React Native", level: 3 },
      { name: "Flutter (notions)", level: 2 },
      { name: "Electron / Tauri", level: 3 },
    ],
  },
  {
    id: "ai-tools",
    label: "IA & Outils",
    icon: "Cpu",
    skills: [
      { name: "Claude API / LLMs", level: 4 },
      { name: "OpenCV", level: 3 },
      { name: "Firebase", level: 4 },
      { name: "FFmpeg", level: 3 },
      { name: "Git / GitHub", level: 5 },
      { name: "Vibe Coding (Cursor, Copilot)", level: 5 },
      { name: "Notion (workspace, automation)", level: 5 },
      { name: "Agents IA / RAG", level: 3 },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: "Megaphone",
    skills: [
      { name: "Stratégie digitale", level: 4 },
      { name: "SEO / SEA", level: 3 },
      { name: "Content Marketing", level: 4 },
      { name: "Social Media Management", level: 3 },
      { name: "Email Marketing / Automation", level: 3 },
      { name: "Analytics (GA4, Mixpanel)", level: 3 },
      { name: "Growth Hacking", level: 3 },
      { name: "Copywriting", level: 4 },
    ],
  },
  {
    id: "video-editing",
    label: "Montage Vidéo",
    icon: "Video",
    skills: [
      { name: "DaVinci Resolve", level: 4 },
      { name: "Premiere Pro / After Effects", level: 3 },
      { name: "Motion Design", level: 3 },
      { name: "FFmpeg (automatisation)", level: 4 },
      { name: "Création contenu court (Reels, Shorts, TikTok)", level: 4 },
      { name: "Colorimétrie / Étalonnage", level: 3 },
      { name: "Sound Design", level: 2 },
    ],
  },
  {
    id: "maintenance",
    label: "Maintenance & Ops",
    icon: "Wrench",
    skills: [
      { name: "CI/CD (GitHub Actions, GitLab CI)", level: 4 },
      { name: "Monitoring / Observabilité (Sentry, Datadog)", level: 3 },
      { name: "Logs & Debugging production", level: 4 },
      { name: "Backup / Disaster Recovery", level: 3 },
      { name: "Migrations BDD / Refactoring", level: 4 },
      { name: "Dépendances / Mises à jour sécurisées", level: 4 },
      { name: "Documentation technique", level: 4 },
    ],
  },
  {
    id: "security",
    label: "Sécurité",
    icon: "Shield",
    skills: [
      { name: "OWASP Top 10", level: 4 },
      { name: "Auth / JWT / OAuth2 / OIDC", level: 4 },
      { name: "Validation / Sanitization entrées", level: 5 },
      { name: "CSP / Headers de sécurité", level: 3 },
      { name: "Audit de code / SAST", level: 3 },
      { name: "Gestion secrets (Vault, env)", level: 4 },
      { name: "RGPD / Conformité", level: 3 },
      { name: "Rate Limiting / WAF", level: 3 },
    ],
  },
  {
    id: "systems",
    label: "Systèmes & Infra",
    icon: "HardDrive",
    skills: [
      { name: "Linux / Bash / Scripting", level: 4 },
      { name: "Nginx / Reverse Proxy", level: 3 },
      { name: "Serveurs VPS / Cloud (AWS, GCP, OVH)", level: 3 },
      { name: "Réseau / DNS / SSL", level: 3 },
      { name: "Virtualisation / Conteneurs (Docker, Podman)", level: 4 },
      { name: "Orchestration (Kubernetes, Docker Swarm)", level: 2 },
      { name: "Base de données (PostgreSQL, Redis, MongoDB)", level: 4 },
      { name: "Monitoring système (Prometheus, Grafana)", level: 2 },
    ],
  },
];