// ============================================================
// EXPERIENCE DATA — Timeline professionnelle + projets perso
// ============================================================

export type ExperienceType = "work" | "project" | "education";

export interface TimelineItem {
  id: string;
  type: ExperienceType;
  title: string;
  organization: string;
  location?: string;
  startDate: string; // "YYYY-MM"
  endDate?: string;  // undefined = "En cours"
  description: string;
  bullets?: string[];
  tech?: string[];
}

export const timeline: TimelineItem[] = [
  {
    id: "freelance-2025",
    type: "work",
    title: "Développeur Fullstack Indépendant",
    organization: "Freelance",
    location: "Yaoundé, Cameroun",
    startDate: "2021-01",
    description:
      "Conception et livraison d'applications web, desktop et mobile pour des clients locaux et des projets entrepreneuriaux personnels.",
    bullets: [
      "Développement de 6+ produits de la conception au déploiement",
      "Intégration de paiements Mobile Money (MTN, Orange Cameroun)",
      "Architecture de pipelines IA (Claude API, ElevenLabs, Pika Labs)",
      "Création de contenu éducatif IA pour TikTok/YouTube Shorts",
    ],
    tech: ["React", "Next.js", "Django", "PyQt5", "Firebase", "Python"],
  },
  {
    id: "portfolio-2025",
    type: "project",
    title: "Portfolio Architect Level",
    organization: "Projet Personnel",
    startDate: "2025-04",
    description:
      "Refonte complète du portfolio avec Next.js 15, TypeScript strict, animations Framer Motion et design system Glassmorphism.",
    tech: ["Next.js 15", "TypeScript", "Framer Motion", "Tailwind CSS"],
  },
  {
    id: "assistant-multilangue-2025",
    type: "project",
    title: "Assistant Multi-langue",
    organization: "Projet Personnel",
    startDate: "2025-02",
    endDate: "2025-03",
    description:
      "App desktop de traduction/reformulation 17 langues, modes tonaux multiples, propulsé par Claude API.",
    tech: ["HTML/CSS/JS", "Claude API"],
  },
  {
    id: "tontine-2024",
    type: "project",
    title: "Tontine Manager",
    organization: "Projet Entrepreneurial",
    startDate: "2024-06",
    endDate: "2024-10",
    description:
      "Système de gestion de tontines avec Mobile Money, Firebase et logique de rotation automatique.",
    tech: ["PyQt5", "Firebase", "Python", "SQLite"],
  },
  {
    id: "trouve-un-pro-2024",
    type: "project",
    title: "Trouve un Pro",
    organization: "Projet Entrepreneurial",
    startDate: "2024-01",
    description:
      "Marketplace artisans/clients au Cameroun. Géolocalisation, profils vérifiés, messagerie temps réel.",
    tech: ["React", "Django", "Firebase", "PostgreSQL"],
  },
  {
    id: "formation-dev",
    type: "education",
    title: "Formation Développement Web & Mobile",
    organization: "Auto-formation + Projets Pratiques",
    location: "Cameroun",
    startDate: "2019-01",
    endDate: "2021-12",
    description:
      "Apprentissage intensif du développement fullstack par la pratique. Maîtrise de Python, Django, React et des bases de données.",
  },
];

// Helpers de filtre pour la timeline UI
export const workExperience = timeline.filter((t) => t.type === "work");
export const personalProjects = timeline.filter((t) => t.type === "project");
export const education = timeline.filter((t) => t.type === "education");
