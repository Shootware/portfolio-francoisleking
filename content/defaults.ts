// ============================================================
// DEFAULT CONTENT FALLBACKS
// Used when admin data is empty or unavailable
// ============================================================

export const DEFAULT_PERSONAL = {
  name: "François Abade",
  tagline: "Fullstack Developer",
  bio: "Passionate fullstack developer crafting elegant solutions with React, Next.js, Python, and Django. Based in Yaoundé, Cameroon.",
  email: "francois@abade.dev",
  location: "Yaoundé, Cameroon",
  avatar_url: "/photo.png",
  socials: [
    { label: "GitHub", href: "https://github.com/Shootware", icon: "Github" },
    { label: "LinkedIn", href: "https://linkedin.com/in/francois-abade", icon: "Linkedin" },
  ],
};

export const DEFAULT_HERO = {
  firstName: "François",
  lastName: "Abade",
  role: "Fullstack Developer",
  description: "I build performant, accessible web applications with modern technologies. Currently exploring the intersection of AI and developer experience.",
  quote: "Code is poetry written for machines, but read by humans.",
  ctaPrimary: { label: "View Work", href: "#experience" },
  ctaSecondary: { label: "Get in Touch", href: "#contact" },
  stats: [
    { label: "Years Experience", value: "5+" },
    { label: "Projects Delivered", value: "20+" },
    { label: "Technologies", value: "15+" },
  ],
  background3dConfig: {
    type: "particles",
    particleCount: 500,
    colors: ["#6366f1", "#818cf8", "#a5b4fc"],
    interactive: true,
  },
  tabs: {
    experiences: [
      {
        id: "exp-1",
        title: "Senior Fullstack Developer",
        company: "Tech Company",
        period: "2022 — Present",
        description: "Leading frontend architecture and mentoring junior developers.",
        technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        id: "exp-2",
        title: "Fullstack Developer",
        company: "Startup Inc",
        period: "2020 — 2022",
        description: "Built and maintained multiple client projects using React and Django.",
        technologies: ["React", "Django", "PostgreSQL", "Docker"],
      },
    ],
    projects: [
      {
        id: "proj-1",
        title: "E-Commerce Platform",
        description: "Full-featured e-commerce solution with real-time inventory.",
        technologies: ["Next.js", "Stripe", "PostgreSQL"],
        link: "#",
      },
      {
        id: "proj-2",
        title: "Task Management App",
        description: "Collaborative project management with real-time updates.",
        technologies: ["React", "Firebase", "TypeScript"],
        link: "#",
      },
    ],
    skills: [
      { name: "React / Next.js", level: 5, category: "frontend" },
      { name: "TypeScript", level: 5, category: "frontend" },
      { name: "Tailwind CSS", level: 5, category: "frontend" },
      { name: "Python / Django", level: 5, category: "backend" },
      { name: "PostgreSQL", level: 4, category: "backend" },
      { name: "Docker", level: 4, category: "devops" },
    ],
  },
};

export const DEFAULT_ABOUT = {
  content: "I'm a fullstack developer with 5+ years of experience building scalable web applications. My journey started with curiosity about how things work on the web, and it evolved into a passion for creating intuitive, performant digital experiences.\n\nI specialize in React/Next.js for the frontend and Python/Django for the backend, but I'm always exploring new technologies and paradigms. I believe in clean code, thoughtful architecture, and the power of great developer experience.\n\nWhen I'm not coding, you'll find me contributing to open source, experimenting with 3D web graphics, or sharing knowledge through technical writing.",
  values: [
    { title: "Craftsmanship", description: "Writing clean, maintainable code that stands the test of time.", icon: "Code" },
    { title: "User-Centric", description: "Building experiences that are accessible, performant, and delightful.", icon: "Users" },
    { title: "Continuous Learning", description: "Staying curious and embracing new technologies thoughtfully.", icon: "BookOpen" },
    { title: "Open Source", description: "Giving back to the community that shaped my career.", icon: "GitBranch" },
  ],
  stats: [
    { label: "Projects Completed", value: "20+" },
    { label: "Years Experience", value: "5+" },
    { label: "Technologies Mastered", value: "15+" },
    { label: "Open Source Contributions", value: "50+" },
  ],
  techStack: [
    { name: "React", category: "frontend", proficiency: 95 },
    { name: "Next.js", category: "frontend", proficiency: 90 },
    { name: "TypeScript", category: "frontend", proficiency: 90 },
    { name: "Tailwind CSS", category: "frontend", proficiency: 95 },
    { name: "Framer Motion", category: "frontend", proficiency: 85 },
    { name: "Python", category: "backend", proficiency: 90 },
    { name: "Django", category: "backend", proficiency: 85 },
    { name: "PostgreSQL", category: "backend", proficiency: 80 },
    { name: "Docker", category: "devops", proficiency: 75 },
    { name: "Git/GitHub", category: "devops", proficiency: 95 },
  ],
  photo: "/photo.png",
};

export const DEFAULT_EXPERIENCE = {
  items: [
    {
      id: "exp-1",
      type: "work",
      company: "Tech Company",
      role: "Senior Fullstack Developer",
      location: "Yaoundé, Cameroon",
      startDate: "2022-01",
      endDate: null,
      current: true,
      description: "Leading frontend architecture for a SaaS platform serving 10k+ users. Mentoring junior developers and establishing coding standards.",
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
      highlights: [
        "Reduced bundle size by 40% through code splitting and optimization",
        "Implemented CI/CD pipeline reducing deployment time from 30min to 5min",
        "Mentored 3 junior developers who were promoted within 12 months",
      ],
      orderIndex: 0,
    },
    {
      id: "exp-2",
      type: "work",
      company: "Startup Inc",
      role: "Fullstack Developer",
      location: "Remote",
      startDate: "2020-03",
      endDate: "2021-12",
      current: false,
      description: "Built and maintained multiple client projects using React and Django. Worked directly with stakeholders to define requirements and deliver solutions.",
      technologies: ["React", "Django", "PostgreSQL", "Docker", "AWS"],
      highlights: [
        "Delivered 8 client projects on time and within budget",
        "Built a reusable component library adopted across 5 projects",
        "Implemented automated testing reducing production bugs by 60%",
      ],
      orderIndex: 1,
    },
    {
      id: "exp-3",
      type: "education",
      company: "University of Yaoundé",
      role: "Master's in Computer Science",
      location: "Yaoundé, Cameroon",
      startDate: "2018-09",
      endDate: "2020-06",
      current: false,
      description: "Specialized in distributed systems and software engineering. Thesis on real-time collaborative editing algorithms.",
      technologies: ["Java", "C++", "Distributed Systems", "Algorithms"],
      highlights: [
        "Graduated top 5% of class",
        "Published paper on collaborative editing in IEEE conference",
        "Teaching assistant for Data Structures and Algorithms",
      ],
      orderIndex: 2,
    },
  ],
};

export const DEFAULT_PROJECTS = {
  items: [
    {
      id: "trouve-un-pro",
      title: "Trouve un Pro",
      description: "Marketplace connectant artisans et clients au Cameroun. Géolocalisation, profils vérifiés, messagerie temps réel.",
      longDescription: "A comprehensive marketplace platform connecting skilled artisans with clients in Cameroon. Features real-time geolocation, verified profiles, integrated messaging, and secure payment processing.",
      year: "2024",
      featured: true,
      category: ["web", "mobile"],
      tech: ["React", "Django", "Firebase", "PostgreSQL", "Maps API"],
      images: ["/projects/trouve-un-pro.png"],
      githubUrl: "https://github.com/Shootware",
      liveUrl: "https://trouveunpro.example.com",
      caseStudyUrl: "/projects/trouve-un-pro",
      orderIndex: 0,
    },
    {
      id: "tontine-manager",
      title: "Tontine Manager",
      description: "Application de gestion de tontines avec Mobile Money, rotation automatique et notifications push.",
      longDescription: "A mobile-first application for managing traditional savings groups (tontines) with Mobile Money integration, automated rotation scheduling, and push notifications for contributions and payouts.",
      year: "2024",
      featured: true,
      category: ["mobile", "desktop"],
      tech: ["PyQt5", "Firebase", "Python", "SQLite"],
      images: ["/projects/tontine.png"],
      githubUrl: "https://github.com/Shootware",
      liveUrl: null,
      caseStudyUrl: "/projects/tontine-manager",
      orderIndex: 1,
    },
    {
      id: "assistant-multi-langue",
      title: "Assistant Multi-langue",
      description: "App desktop de traduction et reformulation dans 17 langues avec modes tonaux (professionnel, TikTok, etc.).",
      longDescription: "A desktop application providing AI-powered translation and rewriting across 17 languages with tonal modes for different contexts (professional, casual, social media, creative writing).",
      year: "2025",
      featured: true,
      category: ["desktop", "ai"],
      tech: ["HTML/CSS/JS", "Claude API", "Anthropic SDK"],
      images: ["/projects/assistant-multilangue.png"],
      githubUrl: null,
      liveUrl: "https://assistant.example.com",
      caseStudyUrl: "/projects/assistant-multi-langue",
      orderIndex: 2,
    },
    {
      id: "telegram-ai-agent",
      title: "Telegram AI Video Agent",
      description: "Bot Telegram générant des vidéos IA en pipeline : Pika Labs → ElevenLabs → Leonardo.AI → FFmpeg.",
      longDescription: "An automated Telegram bot that orchestrates multiple AI services to generate complete videos from text prompts. Pipeline includes video generation (Pika Labs), voice synthesis (ElevenLabs), image generation (Leonardo.AI), and video composition (FFmpeg).",
      year: "2024",
      featured: false,
      category: ["ai"],
      tech: ["Python", "Telegram Bot API", "Pika Labs", "ElevenLabs", "FFmpeg"],
      images: ["/projects/telegram-agent.png"],
      githubUrl: "https://github.com/Shootware",
      liveUrl: null,
      caseStudyUrl: "/projects/telegram-ai-agent",
      orderIndex: 3,
    },
    {
      id: "portfolio",
      title: "Portfolio Personnel",
      description: "Portfolio Next.js 15 avec animations Framer Motion, dark mode et carte héro interactive.",
      longDescription: "This very portfolio website built with Next.js 15, React 19, Tailwind CSS v4, Framer Motion 12, and Three.js/R3F. Features interactive 3D hero, smooth page transitions, and a comprehensive admin panel.",
      year: "2025",
      featured: false,
      category: ["web"],
      tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion", "Lucide Icons", "Three.js"],
      images: ["/projects/portfolio.png"],
      githubUrl: "https://github.com/Shootware",
      liveUrl: "https://ingabadefrancois.vercel.app",
      caseStudyUrl: "/projects/portfolio",
      orderIndex: 4,
    },
    {
      id: "forestry-dashboard",
      title: "Forestry Inventory Dashboard",
      description: "Dashboard Django d'inventaire forestier avec automatisation de données et export PDF.",
      longDescription: "A comprehensive forestry management dashboard built with Django. Features automated data collection, interactive charts with Chart.js, PDF report generation with ReportLab, and role-based access control.",
      year: "2023",
      featured: false,
      category: ["web"],
      tech: ["Django", "Python", "Chart.js", "ReportLab PDF", "PostgreSQL"],
      images: ["/projects/forestry.png"],
      githubUrl: "https://github.com/Shootware",
      liveUrl: null,
      caseStudyUrl: "/projects/forestry-dashboard",
      orderIndex: 5,
    },
  ],
};

export const DEFAULT_SKILLS = {
  items: [
    // Frontend
    { id: "skill-1", category: "frontend", name: "React / Next.js", level: 5, icon: "Code", orderIndex: 0 },
    { id: "skill-2", category: "frontend", name: "TypeScript", level: 5, icon: "Code", orderIndex: 1 },
    { id: "skill-3", category: "frontend", name: "HTML5 / CSS3 Sémantique", level: 5, icon: "Code", orderIndex: 2 },
    { id: "skill-4", category: "frontend", name: "Tailwind CSS", level: 5, icon: "Palette", orderIndex: 3 },
    { id: "skill-5", category: "frontend", name: "Framer Motion", level: 4, icon: "Move", orderIndex: 4 },
    { id: "skill-6", category: "frontend", name: "React Native", level: 3, icon: "Smartphone", orderIndex: 5 },
    { id: "skill-7", category: "frontend", name: "Vue.js / Nuxt", level: 3, icon: "Code", orderIndex: 6 },
    { id: "skill-8", category: "frontend", name: "Accessibilité (WCAG)", level: 4, icon: "Eye", orderIndex: 7 },

    // Backend
    { id: "skill-9", category: "backend", name: "Python (Django & DRF)", level: 5, icon: "Server", orderIndex: 0 },
    { id: "skill-10", category: "backend", name: "Node.js / Express", level: 4, icon: "Server", orderIndex: 1 },
    { id: "skill-11", category: "backend", name: "FastAPI", level: 4, icon: "Server", orderIndex: 2 },
    { id: "skill-12", category: "backend", name: "Architectures REST API / GraphQL", level: 5, icon: "GitBranch", orderIndex: 3 },
    { id: "skill-13", category: "backend", name: "PostgreSQL / MySQL", level: 4, icon: "Database", orderIndex: 4 },
    { id: "skill-14", category: "backend", name: "Redis / Caching", level: 3, icon: "Database", orderIndex: 5 },
    { id: "skill-15", category: "backend", name: "Supabase / Firebase", level: 4, icon: "Server", orderIndex: 6 },
    { id: "skill-16", category: "backend", name: "Docker / Kubernetes", level: 3, icon: "Box", orderIndex: 7 },

    // Desktop & Mobile
    { id: "skill-17", category: "desktop-mobile", name: "PyQt5 / PySide", level: 5, icon: "Monitor", orderIndex: 0 },
    { id: "skill-18", category: "desktop-mobile", name: "React Native / Expo", level: 3, icon: "Smartphone", orderIndex: 1 },
    { id: "skill-19", category: "desktop-mobile", name: "Flutter (notions)", level: 2, icon: "Smartphone", orderIndex: 2 },
    { id: "skill-20", category: "desktop-mobile", name: "Electron / Tauri", level: 3, icon: "Monitor", orderIndex: 3 },

    // IA & Outils
    { id: "skill-21", category: "ai-tools", name: "Claude API / LLMs", level: 4, icon: "Cpu", orderIndex: 0 },
    { id: "skill-22", category: "ai-tools", name: "OpenCV / Computer Vision", level: 3, icon: "Eye", orderIndex: 1 },
    { id: "skill-23", category: "ai-tools", name: "Firebase / BaaS", level: 4, icon: "Server", orderIndex: 2 },
    { id: "skill-24", category: "ai-tools", name: "FFmpeg / Traitement média", level: 3, icon: "Box", orderIndex: 3 },
    { id: "skill-25", category: "ai-tools", name: "Git / GitHub Workflows", level: 5, icon: "GitBranch", orderIndex: 4 },
    { id: "skill-26", category: "ai-tools", name: "Vibe Coding (Cursor, Copilot)", level: 5, icon: "Terminal", orderIndex: 5 },
    { id: "skill-27", category: "ai-tools", name: "Notion (workspace, automation)", level: 5, icon: "BookOpen", orderIndex: 6 },
    { id: "skill-28", category: "ai-tools", name: "Agents IA / RAG", level: 3, icon: "Cpu", orderIndex: 7 },

    // Marketing
    { id: "skill-29", category: "marketing", name: "Stratégie digitale", level: 4, icon: "Megaphone", orderIndex: 0 },
    { id: "skill-30", category: "marketing", name: "SEO / SEA", level: 3, icon: "Search", orderIndex: 1 },
    { id: "skill-31", category: "marketing", name: "Content Marketing", level: 4, icon: "FileText", orderIndex: 2 },
    { id: "skill-32", category: "marketing", name: "Social Media Management", level: 3, icon: "Share2", orderIndex: 3 },
    { id: "skill-33", category: "marketing", name: "Email Marketing / Automation", level: 3, icon: "Mail", orderIndex: 4 },
    { id: "skill-34", category: "marketing", name: "Analytics (GA4, Mixpanel)", level: 3, icon: "BarChart", orderIndex: 5 },
    { id: "skill-35", category: "marketing", name: "Growth Hacking", level: 3, icon: "TrendingUp", orderIndex: 6 },
    { id: "skill-36", category: "marketing", name: "Copywriting", level: 4, icon: "PenTool", orderIndex: 7 },

    // Montage Vidéo
    { id: "skill-37", category: "video-editing", name: "DaVinci Resolve", level: 4, icon: "Video", orderIndex: 0 },
    { id: "skill-38", category: "video-editing", name: "Premiere Pro / After Effects", level: 3, icon: "Video", orderIndex: 1 },
    { id: "skill-39", category: "video-editing", name: "Motion Design", level: 3, icon: "Move", orderIndex: 2 },
    { id: "skill-40", category: "video-editing", name: "FFmpeg (automatisation)", level: 4, icon: "Box", orderIndex: 3 },
    { id: "skill-41", category: "video-editing", name: "Création contenu court (Reels, Shorts, TikTok)", level: 4, icon: "Smartphone", orderIndex: 4 },
    { id: "skill-42", category: "video-editing", name: "Colorimétrie / Étalonnage", level: 3, icon: "Palette", orderIndex: 5 },
    { id: "skill-43", category: "video-editing", name: "Sound Design", level: 2, icon: "Music", orderIndex: 6 },

    // Maintenance & Ops
    { id: "skill-44", category: "maintenance", name: "CI/CD (GitHub Actions, GitLab CI)", level: 4, icon: "GitBranch", orderIndex: 0 },
    { id: "skill-45", category: "maintenance", name: "Monitoring / Observabilité (Sentry, Datadog)", level: 3, icon: "Activity", orderIndex: 1 },
    { id: "skill-46", category: "maintenance", name: "Logs & Debugging production", level: 4, icon: "Terminal", orderIndex: 2 },
    { id: "skill-47", category: "maintenance", name: "Backup / Disaster Recovery", level: 3, icon: "Database", orderIndex: 3 },
    { id: "skill-48", category: "maintenance", name: "Migrations BDD / Refactoring", level: 4, icon: "GitBranch", orderIndex: 4 },
    { id: "skill-49", category: "maintenance", name: "Dépendances / Mises à jour sécurisées", level: 4, icon: "Package", orderIndex: 5 },
    { id: "skill-50", category: "maintenance", name: "Documentation technique", level: 4, icon: "BookOpen", orderIndex: 6 },

    // Sécurité
    { id: "skill-51", category: "security", name: "OWASP Top 10", level: 4, icon: "Shield", orderIndex: 0 },
    { id: "skill-52", category: "security", name: "Auth / JWT / OAuth2 / OIDC", level: 4, icon: "Key", orderIndex: 1 },
    { id: "skill-53", category: "security", name: "Validation / Sanitization entrées", level: 5, icon: "ShieldCheck", orderIndex: 2 },
    { id: "skill-54", category: "security", name: "CSP / Headers de sécurité", level: 3, icon: "Shield", orderIndex: 3 },
    { id: "skill-55", category: "security", name: "Audit de code / SAST", level: 3, icon: "Search", orderIndex: 4 },
    { id: "skill-56", category: "security", name: "Gestion secrets (Vault, env)", level: 4, icon: "Key", orderIndex: 5 },
    { id: "skill-57", category: "security", name: "RGPD / Conformité", level: 3, icon: "FileCheck", orderIndex: 6 },
    { id: "skill-58", category: "security", name: "Rate Limiting / WAF", level: 3, icon: "Shield", orderIndex: 7 },

    // Systèmes & Infra
    { id: "skill-59", category: "systems", name: "Linux / Bash / Scripting", level: 4, icon: "Terminal", orderIndex: 0 },
    { id: "skill-60", category: "systems", name: "Nginx / Reverse Proxy", level: 3, icon: "Server", orderIndex: 1 },
    { id: "skill-61", category: "systems", name: "Serveurs VPS / Cloud (AWS, GCP, OVH)", level: 3, icon: "HardDrive", orderIndex: 2 },
    { id: "skill-62", category: "systems", name: "Réseau / DNS / SSL", level: 3, icon: "Globe", orderIndex: 3 },
    { id: "skill-63", category: "systems", name: "Virtualisation / Conteneurs (Docker, Podman)", level: 4, icon: "Box", orderIndex: 4 },
    { id: "skill-64", category: "systems", name: "Orchestration (Kubernetes, Docker Swarm)", level: 2, icon: "Box", orderIndex: 5 },
    { id: "skill-65", category: "systems", name: "Base de données (PostgreSQL, Redis, MongoDB)", level: 4, icon: "Database", orderIndex: 6 },
    { id: "skill-66", category: "systems", name: "Monitoring système (Prometheus, Grafana)", level: 2, icon: "Activity", orderIndex: 7 },
  ],
};

export const DEFAULT_CONTACT = {
  formTitle: "Let's Work Together",
  formDescription: "Have a project in mind? I'd love to hear about it. Send me a message and I'll get back to you within 24 hours.",
  formFields: [
    { name: "name", label: "Name", type: "text", required: true, placeholder: "Your name" },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
    { name: "subject", label: "Subject", type: "text", required: true, placeholder: "Project inquiry" },
    { name: "message", label: "Message", type: "textarea", required: true, placeholder: "Tell me about your project...", rows: 5 },
  ],
  submitEndpoint: "/api/contact",
  directLinks: [
    { label: "Email", href: "mailto:francois@abade.dev", icon: "Mail" },
    { label: "GitHub", href: "https://github.com/Shootware", icon: "Github" },
    { label: "LinkedIn", href: "https://linkedin.com/in/francois-abade", icon: "Linkedin" },
  ],
  availabilityStatus: "available",
  availabilityMessage: "Currently open for freelance projects and full-time opportunities.",
  responseTime: "Usually responds within 24 hours",
};

export const DEFAULT_SETTINGS = {
  theme: "system",
  seo: {
    siteName: "François Abade",
    defaultTitle: "François Abade — Fullstack Developer",
    titleTemplate: "%s | François Abade",
    description: "Fullstack developer crafting elegant solutions with React, Next.js, Python, and Django.",
    ogImage: "/photo.png",
    twitterHandle: "@francoisleking",
  },
  analytics: {
    provider: "vercel",
    trackingId: "",
  },
  customCss: "",
};
