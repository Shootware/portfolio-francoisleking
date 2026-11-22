// ============================================================
// PROJECTS DATA — Catalogue de projets typés
// ============================================================

export type ProjectCategory =
  | "web"
  | "mobile"
  | "desktop"
  | "ai"
  | "open-source";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory[];
  tech: string[];
  image: string; // chemin relatif depuis /public
  liveUrl?: string;
  gitHubUrl?: string;
  featured: boolean;
  year: number;
}

export const projects: Project[] = [
  {
    id: "trouve-un-pro",
    title: "Trouve un Pro",
    description:
      "Marketplace connectant artisans et clients au Cameroun. Géolocalisation, profils vérifiés, messagerie temps réel.",
    longDescription:
      "Application fullstack permettant aux Camerounais de trouver rapidement un plombier, électricien ou technicien près de chez eux. Backend Django REST, frontend React, notifications Firebase.",
    category: ["web", "mobile"],
    tech: ["React", "Django", "Firebase", "PostgreSQL", "Tailwind CSS"],
    image: "/projects/trouve-un-pro.png",
    featured: true,
    year: 2024,
  },
  {
    id: "tontine-app",
    title: "Tontine Manager",
    description:
      "Application de gestion de tontines avec Mobile Money, rotation automatique et notifications push.",
    longDescription:
      "Système complet de gestion de tontines traditionnelles africaines : gestion des membres, calcul automatique des rotations, intégration Mobile Money MTN/Orange, alertes Firebase.",
    category: ["mobile", "desktop"],
    tech: ["PyQt5", "Firebase", "Python", "SQLite"],
    image: "/projects/tontine.png",
    featured: true,
    year: 2024,
  },
  {
    id: "assistant-multilangue",
    title: "Assistant Multi-langue",
    description:
      "App desktop de traduction et reformulation dans 17 langues avec modes tonaux (professionnel, TikTok, etc.).",
    category: ["desktop", "ai"],
    tech: ["HTML/CSS/JS", "Claude API", "Anthropic SDK"],
    image: "/projects/assistant-multilangue.png",
    liveUrl: "#",
    featured: true,
    year: 2025,
  },
  {
    id: "telegram-ai-agent",
    title: "Telegram AI Video Agent",
    description:
      "Bot Telegram générant des vidéos IA en pipeline : Pika Labs → ElevenLabs → Leonardo.AI → FFmpeg.",
    category: ["ai"],
    tech: ["Python", "Telegram Bot API", "Pika Labs", "ElevenLabs", "FFmpeg"],
    image: "/projects/telegram-agent.png",
    featured: false,
    year: 2024,
  },
  {
    id: "portfolio-v1",
    title: "Portfolio Personnel",
    description:
      "Portfolio Next.js 15 avec animations Framer Motion, dark mode et carte héro interactive.",
    category: ["web"],
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion", "Prisma"],
    image: "/projects/portfolio.png",
    gitHubUrl: "https://github.com/francoisleking/portfolio",
    featured: false,
    year: 2025,
  },
  {
    id: "forestry-dashboard",
    title: "Forestry Inventory Dashboard",
    description:
      "Dashboard Django d'inventaire forestier avec automatisation de données et export PDF.",
    category: ["web"],
    tech: ["Django", "Python", "PostgreSQL", "ReportLab", "Chart.js"],
    image: "/projects/forestry.png",
    featured: false,
    year: 2023,
  },
];

// Helper : projets mis en avant seulement
export const featuredProjects = projects.filter((p) => p.featured);
