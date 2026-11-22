"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AdminLayout,
  AdminCard,
  AdminTabs,
  FormField,
  Input,
  Textarea,
  Select,
  Checkbox,
  Button,
  AdminModal,
  AdminAlert,
  AdminTab,
} from "@/components/admin/AdminUI";
import {
  UserIcon,
  LayoutIcon,
  LayersIcon,
  TimelineIcon,
  FolderIcon,
  StarIcon,
  MailIcon,
  SettingsIcon,
  TrashIcon,
  EyeIcon,
  SaveIcon,
  CancelIcon,
  ArrowUpDownIcon,
} from "@/components/admin/AdminIcons";
import { useAdminData } from "@/lib/admin-data";
import { AdminFieldArray } from "@/components/admin/AdminFieldArray";

/* ============================================================
   SECTION CONFIGURATION
   ============================================================ */

const SECTIONS: Record<string, {
  label: string;
  description: string;
  icon: React.FC<{ size?: number; color?: string; className?: string }>;
  tabs: AdminTab[];
  // The admin editor intentionally supports user-defined field schemas.
  // Keep this boundary dynamic; rendered values are validated before saving.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any;
}> = {
  personal: {
    label: "Informations personnelles",
    description: "Gérez votre nom, titre, bio, coordonnées et réseaux sociaux",
    icon: UserIcon,
    tabs: [
      { id: "profile", label: "Profil", icon: <UserIcon size={16} /> },
      { id: "social", label: "Réseaux sociaux", icon: <LayoutIcon size={16} /> },
      { id: "seo", label: "SEO & Meta", icon: <SettingsIcon size={16} /> },
    ],
    fields: [
      // Profile tab
      { key: "name", label: "Nom complet", type: "text", tab: "profile", required: true },
      { key: "tagline", label: "Titre / Tagline", type: "text", tab: "profile", required: true },
      { key: "domain", label: "Domaine", type: "text", tab: "profile", placeholder: "ex: ingabadefrancois.dev" },
      { key: "email", label: "Email", type: "email", tab: "profile", required: true },
      { key: "phone", label: "Téléphone", type: "tel", tab: "profile" },
      { key: "location", label: "Localisation", type: "text", tab: "profile", placeholder: "ex: Yaoundé, Cameroun" },
      { key: "bio", label: "Biographie courte", type: "textarea", tab: "profile", rows: 4 },
      { key: "avatar", label: "Photo de profil (URL)", type: "text", tab: "profile", placeholder: "/photo.png" },
      // Social tab
      { key: "github", label: "GitHub", type: "url", tab: "social", placeholder: "https://github.com/username" },
      { key: "linkedin", label: "LinkedIn", type: "url", tab: "social", placeholder: "https://linkedin.com/in/username" },
      { key: "twitter", label: "Twitter / X", type: "url", tab: "social", placeholder: "https://x.com/username" },
      { key: "website", label: "Site web", type: "url", tab: "social", placeholder: "https://example.com" },
      { key: "resumeUrl", label: "URL du CV", type: "url", tab: "social", placeholder: "https://example.com/cv.pdf" },
      // SEO tab
      { key: "metaTitle", label: "Meta Title", type: "text", tab: "seo" },
      { key: "metaDescription", label: "Meta Description", type: "textarea", tab: "seo", rows: 3 },
      { key: "ogImage", label: "Open Graph Image (URL)", type: "text", tab: "seo", placeholder: "/og-image.png" },
    ],
    initialData: {
      name: "ABADE FRANCOIS GABIE",
      tagline: "Ingénieur & Architecte Logiciel",
      domain: "ingabadefrancois.dev",
      email: "contact@ingabadefrancois.dev",
      phone: "+237 6XX XX XX XX",
      location: "Yaoundé, Cameroun",
      bio: "Ingénieur et architecte logiciel basé à Yaoundé. Mon parcours combine une solide maîtrise des infrastructures réseaux et l'intégration native d'écosystèmes d'intelligence artificielle.",
      avatar: "/photo.png",
      github: "https://github.com/francois-abade",
      linkedin: "https://linkedin.com/in/francois-abade",
      twitter: "https://x.com/francois_abade",
      website: "https://ingabadefrancois.dev",
      resumeUrl: "https://ingabadefrancois.dev/cv.pdf",
      metaTitle: "François Abade - Ingénieur & Architecte Logiciel",
      metaDescription: "Portfolio de François Abade, ingénieur et architecte logiciel spécialisé dans les systèmes distribués, l'IA et l'infrastructure cloud.",
      ogImage: "/og-image.png",
    },
  },
  hero: {
    label: "Section Hero",
    description: "Configurez les onglets, l'animation typewriter, le canvas et la barre technos",
    icon: LayoutIcon,
    tabs: [
      { id: "tabs", label: "Onglets", icon: <LayoutIcon size={16} /> },
      { id: "typewriter", label: "Typewriter", icon: <StarIcon size={16} /> },
      { id: "canvas", label: "Canvas & Photo", icon: <EyeIcon size={16} /> },
      { id: "techstrip", label: "Barre technos", icon: <StarIcon size={16} /> },
    ],
    fields: [
      // Tabs tab
      {
        key: "tabs",
        label: "Onglets du Hero",
        type: "array",
        tab: "tabs",
        description: "Configurez les onglets affichés dans la section Hero",
        fields: [
          { key: "id", label: "ID", type: "text", required: true, placeholder: "photo" },
          { key: "label", label: "Label affiché", type: "text", required: true, placeholder: "Photo" },
          { key: "icon", label: "Icône (emoji)", type: "text", placeholder: "📷" },
          { key: "contentType", label: "Type de contenu", type: "select", options: ["photo", "code", "terminal"], required: true },
          { key: "contentLines", label: "Lignes de code (pour code/terminal)", type: "textarea", placeholder: "Une ligne par ligne", rows: 4 },
        ],
        itemLabelKey: "label",
        minItems: 1,
      },
      { key: "autoCycle", label: "Auto-cyclage activé", type: "checkbox", tab: "tabs" },
      { key: "photoDuration", label: "Durée photo (ms)", type: "number", tab: "tabs", min: 1000, max: 30000, step: 1000 },
      { key: "contentDuration", label: "Durée contenu (ms)", type: "number", tab: "tabs", min: 1000, max: 30000, step: 1000 },
      // Typewriter tab
      { key: "typewriterRoles", label: "Rôles (séparés par |)", type: "text", tab: "typewriter", placeholder: "Fullstack|Backend|DevOps|IA" },
      { key: "typewriterSpeed", label: "Vitesse frappe (ms)", type: "number", tab: "typewriter", min: 50, max: 500, step: 10 },
      { key: "typewriterDeleteSpeed", label: "Vitesse suppression (ms)", type: "number", tab: "typewriter", min: 20, max: 300, step: 10 },
      { key: "typewriterPause", label: "Pause fin (ms)", type: "number", tab: "typewriter", min: 500, max: 10000, step: 100 },
      // Canvas tab
      { key: "canvasEnabled", label: "Canvas activé", type: "checkbox", tab: "canvas" },
      { key: "canvasParticleCount", label: "Nombre particules", type: "number", tab: "canvas", min: 10, max: 200, step: 5 },
      { key: "canvasColor", label: "Couleur particules", type: "color", tab: "canvas" },
      // Techstrip tab
      {
        key: "techItems",
        label: "Technologies de la barre",
        type: "array",
        tab: "techstrip",
        description: "Logos et technologies qui défilent en bas du Hero",
        fields: [
          { key: "label", label: "Nom", type: "text", required: true, placeholder: "Next.js" },
          { key: "src", label: "Icône (URL ou chemin)", type: "text", required: true, placeholder: "/icons/nextjs.svg" },
          { key: "color", label: "Couleur d'accent", type: "color" },
        ],
        itemLabelKey: "label",
        minItems: 1,
      },
      { key: "techMarqueeSpeed", label: "Vitesse défilement (s)", type: "number", tab: "techstrip", min: 5, max: 60, step: 1 },
    ],
    initialData: {
      tabs: [
        { id: "photo", label: "Photo", icon: "📷", contentType: "photo", contentLines: "" },
        { id: "code", label: "Code", icon: "💻", contentType: "code", contentLines: "const portfolio = {\n  name: 'François Abade',\n  role: 'Software Architect',\n  stack: ['Next.js', 'Python', 'Docker'],\n};" },
        { id: "terminal", label: "Terminal", icon: "🖥️", contentType: "terminal", contentLines: "$ npm run dev\n> Next.js 15 ready\n> Portfolio loaded ✓" },
        { id: "arch", label: "Architecture", icon: "🏗️", contentType: "code", contentLines: "system Portfolio {\n  frontend: Next.js 15\n  styling: Tailwind CSS 4\n  animation: Framer Motion\n  deploy: Vercel\n}" },
      ],
      autoCycle: true,
      photoDuration: 8000,
      contentDuration: 6000,
      typewriterRoles: "Ingénieur Logiciel|Architecte Systèmes|DevOps Engineer|Expert IA",
      typewriterSpeed: 80,
      typewriterDeleteSpeed: 40,
      typewriterPause: 2000,
      canvasEnabled: true,
      canvasParticleCount: 60,
      canvasColor: "#6366f1",
      techItems: [
        { label: "Next.js", src: "/icons/nextjs.svg", color: "#000000" },
        { label: "Python", src: "/icons/python.svg", color: "#3776AB" },
        { label: "Tailwind", src: "/icons/tailwind.svg", color: "#06B6D4" },
        { label: "Docker", src: "/icons/docker.svg", color: "#2496ED" },
        { label: "PostgreSQL", src: "/icons/postgres.svg", color: "#4169E1" },
      ],
      techMarqueeSpeed: 18,
    },
  },
  about: {
    label: "Section À propos",
    description: "Gérez la timeline, la bio et la grille Bento des valeurs/expertises",
    icon: LayersIcon,
    tabs: [
      { id: "bio", label: "Biographie", icon: <UserIcon size={16} /> },
      { id: "timeline", label: "Timeline", icon: <TimelineIcon size={16} /> },
      { id: "values", label: "Valeurs (Bento)", icon: <StarIcon size={16} /> },
    ],
    fields: [
      // Bio tab
      { key: "bioTitle", label: "Titre de section", type: "text", tab: "bio" },
      { key: "bioText", label: "Texte de présentation", type: "textarea", tab: "bio", rows: 6 },
      { key: "photoUrl", label: "Photo (URL)", type: "text", tab: "bio", placeholder: "/photoabout.jpeg" },
      // Timeline tab
      {
        key: "timeline",
        label: "Éléments de la timeline",
        type: "array",
        tab: "timeline",
        description: "Votre parcours : études, expériences, poste actuel",
        fields: [
          { key: "icon", label: "Icône (nom Lucide)", type: "select", options: ["GraduationCap", "Server", "Briefcase", "BookOpen", "Award", "Code", "Terminal", "Database", "Globe", "Users", "Heart", "Star", "Target", "Zap", "Shield", "Cpu", "HardDrive", "Network", "Cloud", "Smartphone", "Monitor"], required: true },
          { key: "date", label: "Période", type: "text", required: true, placeholder: "2021 – 2024" },
          { key: "title", label: "Titre", type: "text", required: true, placeholder: "Cursus Ingénieur" },
          { key: "place", label: "Lieu / Organisation", type: "text", required: true, placeholder: "Fondations & Algorithmes" },
          { key: "desc", label: "Description", type: "textarea", rows: 3, placeholder: "Détails de cette étape..." },
        ],
        itemLabelKey: "title",
        minItems: 1,
      },
      // Values tab
      {
        key: "values",
        label: "Valeurs (Grille Bento)",
        type: "array",
        tab: "values",
        description: "Vos valeurs fondamentales affichées en grille Bento",
        fields: [
          { key: "id", label: "ID unique", type: "text", required: true, placeholder: "clean-code" },
          { key: "icon", label: "Icône (nom du composant)", type: "select", options: ["CleanCodeIcon", "LocalProductsIcon", "PerformanceIcon", "EducationAIIcon", "SecurityIcon", "ArchitectureIcon"], required: true },
          { key: "title", label: "Titre", type: "text", required: true, placeholder: "Code propre" },
          { key: "desc", label: "Description", type: "textarea", rows: 3 },
          { key: "accent", label: "Couleur fond (rgba)", type: "text", placeholder: "rgba(99,102,241,0.08)" },
          { key: "accentBorder", label: "Couleur bordure (rgba)", type: "text", placeholder: "rgba(99,102,241,0.28)" },
          { key: "iconColor", label: "Couleur icône", type: "color" },
          { key: "size", label: "Taille carte", type: "select", options: ["large", "medium", "small"], required: true },
          { key: "iconSize", label: "Taille icône (px)", type: "number", min: 16, max: 36, step: 2 },
        ],
        itemLabelKey: "title",
        minItems: 1,
      },
    ],
    initialData: {
      bioTitle: "Qui suis-je ?",
      bioText: "Je suis <strong className=\"font-serif italic font-semibold\">ABADE FRANCOIS GABIE</strong>, ingénieur et architecte logiciel basé à Yaoundé. Mon parcours combine une solide maîtrise des infrastructures réseaux et l'intégration native d'écosystèmes d'intelligence artificielle.\n\nMon crédo réside dans le pragmatisme technique : concevoir des architectures épurées, hautement performantes et optimisées pour assurer une robustesse sans faille.",
      photoUrl: "/photoabout.jpeg",
      timeline: [
        { icon: "GraduationCap", date: "2021 – 2024", title: "Cursus Ingénieur", place: "Fondations & Algorithmes", desc: "Maîtrise des structures de données complexes et des architectures logicielles distribuées." },
        { icon: "Server", date: "2024 – 2026", title: "Responsable du parc informatique", place: "TFM — Télécom / Infrastructure", desc: "Gestion de la disponibilité, supervision des réseaux et déploiement de systèmes informatiques." },
        { icon: "Briefcase", date: "Aujourd'hui", title: "Tech Lead / Consultant", place: "Scale, IA & Souveraineté", desc: "Création de solutions technologiques autonomes, résilientes et adaptées aux réalités locales." },
      ],
      values: [
        { id: "clean-code", icon: "CleanCodeIcon", title: "Code propre", desc: "Architecture modulaire, maintenable et évolutive. Développement de solutions conçues pour durer.", accent: "rgba(99,102,241,0.08)", accentBorder: "rgba(99,102,241,0.28)", iconColor: "#818cf8", size: "large", iconSize: 28 },
        { id: "local-products", icon: "LocalProductsIcon", title: "Produits locaux", desc: "Applications adaptées aux réalités technologiques, économiques et numériques du Cameroun et de l'Afrique.", accent: "rgba(20,184,166,0.08)", accentBorder: "rgba(20,184,166,0.28)", iconColor: "#2dd4bf", size: "medium", iconSize: 22 },
        { id: "performance", icon: "PerformanceIcon", title: "Performance", desc: "Applications rapides, optimisées et accessibles, même avec une connexion Internet limitée.", accent: "rgba(251,191,36,0.08)", accentBorder: "rgba(251,191,36,0.28)", iconColor: "#fbbf24", size: "medium", iconSize: 22 },
        { id: "education-ai", icon: "EducationAIIcon", title: "Éducation & IA", desc: "Veille technologique, intelligence artificielle et partage des connaissances avec la communauté.", accent: "rgba(96,165,250,0.08)", accentBorder: "rgba(96,165,250,0.28)", iconColor: "#60a5fa", size: "medium", iconSize: 22 },
        { id: "security", icon: "SecurityIcon", title: "Sécurité", desc: "Bonnes pratiques OWASP, chiffrement, authentification robuste et protection des données utilisateur.", accent: "rgba(239,68,68,0.08)", accentBorder: "rgba(239,68,68,0.28)", iconColor: "#ef4444", size: "small", iconSize: 18 },
        { id: "architecture", icon: "ArchitectureIcon", title: "Architecture", desc: "Systèmes distribués, event-driven, microservices et patterns de résilience pour la scalabilité.", accent: "rgba(168,85,247,0.08)", accentBorder: "rgba(168,85,247,0.28)", iconColor: "#a855f7", size: "small", iconSize: 18 },
      ],
    },
  },
  experience: {
    label: "Expérience & Timeline",
    description: "Gérez votre parcours professionnel, formations et certifications",
    icon: TimelineIcon,
    tabs: [
      { id: "work", label: "Expérience pro", icon: <FolderIcon size={16} /> },
      { id: "education", label: "Formation", icon: <StarIcon size={16} /> },
      { id: "certs", label: "Certifications", icon: <SettingsIcon size={16} /> },
    ],
    fields: [
      {
        key: "workExperience",
        label: "Expériences professionnelles",
        type: "array",
        tab: "work",
        description: "Vos postes, missions et réalisations",
        fields: [
          { key: "company", label: "Entreprise", type: "text", required: true, placeholder: "TFM" },
          { key: "role", label: "Poste", type: "text", required: true, placeholder: "Responsable du parc informatique" },
          { key: "period", label: "Période", type: "text", required: true, placeholder: "2024 – 2026" },
          { key: "location", label: "Localisation", type: "text", placeholder: "Yaoundé, Cameroun" },
          { key: "description", label: "Description", type: "textarea", rows: 3 },
          { key: "technologies", label: "Technologies (séparées par virgules)", type: "text", placeholder: "Linux, Networking, Monitoring, Automation" },
          { key: "achievements", label: "Réalisations (une par ligne)", type: "textarea", rows: 3, placeholder: "99.9% uptime atteint\nMigration vers infrastructure cloud" },
        ],
        itemLabelKey: "role",
        minItems: 0,
      },
      {
        key: "education",
        label: "Formations",
        type: "array",
        tab: "education",
        description: "Vos diplômes et cursus",
        fields: [
          { key: "institution", label: "Établissement", type: "text", required: true, placeholder: "École d'Ingénieurs" },
          { key: "degree", label: "Diplôme / Spécialité", type: "text", required: true, placeholder: "Cursus Ingénieur - Fondations & Algorithmes" },
          { key: "period", label: "Période", type: "text", required: true, placeholder: "2021 – 2024" },
          { key: "location", label: "Localisation", type: "text", placeholder: "Cameroun" },
          { key: "description", label: "Description", type: "textarea", rows: 3 },
        ],
        itemLabelKey: "degree",
        minItems: 0,
      },
      {
        key: "certifications",
        label: "Certifications",
        type: "array",
        tab: "certs",
        description: "Vos certifications techniques",
        fields: [
          { key: "name", label: "Nom", type: "text", required: true, placeholder: "AWS Solutions Architect" },
          { key: "issuer", label: "Organisme", type: "text", required: true, placeholder: "Amazon Web Services" },
          { key: "date", label: "Date d'obtention", type: "text", placeholder: "2025" },
          { key: "url", label: "URL de vérification", type: "url", placeholder: "https://..." },
          { key: "icon", label: "Icône (nom Lucide)", type: "select", options: ["Cloud", "Server", "Award", "Badge", "Certificate", "GraduationCap", "Shield", "Key", "Star", "Target", "Zap", "Cpu", "Database", "Globe", "HardDrive", "Lock", "ShieldCheck"] },
        ],
        itemLabelKey: "name",
        minItems: 0,
      },
    ],
    initialData: {
      workExperience: [
        {
          company: "TFM",
          role: "Responsable du parc informatique",
          period: "2024 – 2026",
          location: "Yaoundé, Cameroun",
          description: "Gestion de la disponibilité, supervision des réseaux et déploiement de systèmes informatiques pour l'infrastructure télécom.",
          technologies: ["Linux", "Networking", "Monitoring", "Automation"],
          achievements: ["99.9% uptime atteint", "Migration vers infrastructure cloud", "Automatisation des déploiements"],
        },
      ],
      education: [
        {
          institution: "École d'Ingénieurs",
          degree: "Cursus Ingénieur - Fondations & Algorithmes",
          period: "2021 – 2024",
          location: "Cameroun",
          description: "Maîtrise des structures de données complexes et des architectures logicielles distribuées.",
        },
      ],
      certifications: [
        { name: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2025", url: "#", icon: "Cloud" },
        { name: "Kubernetes Administrator", issuer: "CNCF", date: "2024", url: "#", icon: "Server" },
      ],
    },
  },
  projects: {
    label: "Projets",
    description: "Gérez votre portfolio de projets avec filtres et détails",
    icon: FolderIcon,
    tabs: [
      { id: "list", label: "Liste des projets", icon: <FolderIcon size={16} /> },
      { id: "categories", label: "Catégories & Filtres", icon: <SettingsIcon size={16} /> },
    ],
    fields: [
      {
        key: "projects",
        label: "Liste des projets",
        type: "array",
        tab: "list",
        description: "Vos projets portfolio avec détails",
        fields: [
          { key: "id", label: "ID unique", type: "text", required: true, placeholder: "1" },
          { key: "title", label: "Titre", type: "text", required: true, placeholder: "Portfolio Next.js 15" },
          { key: "description", label: "Description courte", type: "textarea", rows: 3 },
          { key: "image", label: "Image (URL/chemin)", type: "text", placeholder: "/projects/portfolio.png" },
          { key: "tags", label: "Tags (séparés par virgules)", type: "text", placeholder: "Next.js, TypeScript, Tailwind, Framer Motion" },
          { key: "category", label: "Catégorie", type: "select", options: ["Fullstack", "Frontend", "Backend", "DevOps", "IA/ML", "Mobile"], required: true },
          { key: "featured", label: "Projet mis en avant", type: "checkbox" },
          { key: "links", label: "Liens (JSON: {github, demo})", type: "textarea", rows: 2, placeholder: '{ "github": "https://github.com/...", "demo": "https://..." }' },
          { key: "highlights", label: "Points forts (un par ligne)", type: "textarea", rows: 3, placeholder: "Animations 60fps\nAccessibilité WCAG 2.2 AA\nAdmin CMS complet" },
        ],
        itemLabelKey: "title",
        minItems: 0,
      },
      {
        key: "categories",
        label: "Catégories de filtre",
        type: "array",
        tab: "categories",
        description: "Catégories disponibles pour filtrer les projets",
        fields: [
          { key: "value", label: "Nom de la catégorie", type: "text", required: true, placeholder: "Fullstack" },
        ],
        itemLabelKey: "value",
        minItems: 1,
        renderItemLabel: (item: { value: string }) => item.value,
      },
    ],
    initialData: {
      projects: [
        {
          id: "1",
          title: "Portfolio Next.js 15",
          description: "Portfolio moderne avec Hero interactif, animations Framer Motion, grille Bento et admin complet.",
          image: "/projects/portfolio.png",
          tags: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
          category: "Fullstack",
          featured: true,
          links: { github: "https://github.com/francois-abade/portfolio", demo: "https://ingabadefrancois.dev" },
          highlights: ["Animations 60fps", "Accessibilité WCAG 2.2 AA", "Admin CMS complet"],
        },
      ],
      categories: [
        { value: "Fullstack" },
        { value: "Frontend" },
        { value: "Backend" },
        { value: "DevOps" },
        { value: "IA/ML" },
        { value: "Mobile" },
      ],
    },
  },
  skills: {
    label: "Compétences",
    description: "Gérez votre stack technique, niveaux d'expertise et catégories",
    icon: StarIcon,
    tabs: [
      { id: "technical", label: "Compétences techniques", icon: <StarIcon size={16} /> },
      { id: "soft", label: "Soft Skills", icon: <UserIcon size={16} /> },
      { id: "categories", label: "Catégories", icon: <SettingsIcon size={16} /> },
    ],
    fields: [
      {
        key: "technicalSkills",
        label: "Compétences techniques",
        type: "array",
        tab: "technical",
        description: "Votre stack technique avec niveau d'expertise",
        fields: [
          { key: "name", label: "Nom", type: "text", required: true, placeholder: "TypeScript" },
          { key: "category", label: "Catégorie", type: "select", options: ["Frontend", "Backend", "Database", "DevOps", "Cloud", "IA/ML", "Testing", "Architecture", "Desktop/Mobile", "Marketing", "Video", "Maintenance", "Security", "Systems"], required: true },
          { key: "level", label: "Niveau (1-5)", type: "number", min: 1, max: 5, step: 1, required: true },
          { key: "icon", label: "Icône (nom Lucide)", type: "select", options: ["Monitor", "Server", "Cpu", "Smartphone", "Megaphone", "Video", "Wrench", "Shield", "HardDrive", "Code", "Palette", "Move", "GitBranch", "Database", "Eye", "Box", "Terminal", "BookOpen", "Search", "FileText", "Share2", "Mail", "BarChart", "TrendingUp", "PenTool", "Key", "Activity", "Package", "Globe", "ShieldCheck", "FileCheck", "Music"] },
          { key: "description", label: "Description", type: "textarea", rows: 2 },
          { key: "years", label: "Années d'expérience", type: "number", min: 0, max: 30, step: 1 },
        ],
        itemLabelKey: "name",
        minItems: 0,
      },
      {
        key: "softSkills",
        label: "Soft Skills",
        type: "array",
        tab: "soft",
        description: "Vos compétences transverses",
        fields: [
          { key: "name", label: "Nom", type: "text", required: true, placeholder: "Résolution de problèmes" },
          { key: "description", label: "Description", type: "textarea", rows: 2 },
          { key: "level", label: "Niveau (1-5)", type: "number", min: 1, max: 5, step: 1, required: true },
        ],
        itemLabelKey: "name",
        minItems: 0,
      },
      {
        key: "skillCategories",
        label: "Catégories d'affichage",
        type: "array",
        tab: "categories",
        description: "Ordre et noms des catégories dans la section Skills",
        fields: [
          { key: "value", label: "Nom de la catégorie", type: "text", required: true, placeholder: "Frontend" },
        ],
        itemLabelKey: "value",
        minItems: 1,
        renderItemLabel: (item: { value: string }) => item.value,
      },
    ],
    initialData: {
      technicalSkills: [
        { name: "TypeScript", category: "Frontend", level: 90, icon: "Code", description: "Expert en TypeScript moderne, types avancés", years: 4 },
        { name: "React / Next.js", category: "Frontend", level: 95, icon: "Layout", description: "App Router, Server Components, RSC", years: 3 },
        { name: "Python", category: "Backend", level: 85, icon: "Terminal", description: "FastAPI, Django, Data Science, IA", years: 5 },
        { name: "PostgreSQL", category: "Database", level: 80, icon: "Database", description: "Optimisation, indexation, requêtes complexes", years: 4 },
        { name: "Docker / Kubernetes", category: "DevOps", level: 85, icon: "Server", description: "Containerisation, orchestration, CI/CD", years: 3 },
        { name: "AWS / Cloud", category: "DevOps", level: 75, icon: "Cloud", description: "EC2, S3, Lambda, RDS, CloudFormation", years: 2 },
      ],
      softSkills: [
        { name: "Résolution de problèmes", description: "Approche analytique et créative", level: 90 },
        { name: "Communication technique", description: "Vulgarisation et documentation", level: 85 },
        { name: "Leadership d'équipe", description: "Mentorat et architecture", level: 80 },
        { name: "Apprentissage continu", description: "Veille tech et expérimentation", level: 95 },
      ],
      skillCategories: [
        { value: "Frontend" },
        { value: "Backend" },
        { value: "Database" },
        { value: "DevOps" },
        { value: "Cloud" },
        { value: "IA/ML" },
        { value: "Testing" },
        { value: "Architecture" },
        { value: "Desktop/Mobile" },
        { value: "Marketing" },
        { value: "Video" },
        { value: "Maintenance" },
        { value: "Security" },
        { value: "Systems" },
      ],
    },
  },
  contact: {
    label: "Contact",
    description: "Configurez le formulaire, liens directs et disponibilité",
    icon: MailIcon,
    tabs: [
      { id: "form", label: "Formulaire", icon: <LayoutIcon size={16} /> },
      { id: "links", label: "Liens directs", icon: <LayersIcon size={16} /> },
      { id: "availability", label: "Disponibilité", icon: <StarIcon size={16} /> },
    ],
    fields: [
      { key: "formTitle", label: "Titre formulaire", type: "text", tab: "form" },
      { key: "formDescription", label: "Description", type: "textarea", tab: "form", rows: 3 },
      {
        key: "formFields",
        label: "Champs du formulaire",
        type: "array",
        tab: "form",
        description: "Champs du formulaire de contact",
        fields: [
          { key: "name", label: "Nom du champ (technique)", type: "text", required: true, placeholder: "name" },
          { key: "label", label: "Label affiché", type: "text", required: true, placeholder: "Nom complet" },
          { key: "type", label: "Type", type: "select", options: ["text", "email", "textarea"], required: true },
          { key: "required", label: "Requis", type: "checkbox" },
          { key: "placeholder", label: "Placeholder", type: "text", placeholder: "Votre nom" },
        ],
        itemLabelKey: "label",
        minItems: 1,
      },
      { key: "submitEndpoint", label: "Endpoint soumission", type: "text", tab: "form", placeholder: "/api/contact" },
      {
        key: "directLinks",
        label: "Liens directs",
        type: "array",
        tab: "links",
        description: "Liens affichés dans la section contact (email, LinkedIn, GitHub...)",
        fields: [
          { key: "label", label: "Label", type: "text", required: true, placeholder: "Email direct" },
          { key: "url", label: "URL", type: "url", required: true, placeholder: "mailto:contact@..." },
          { key: "icon", label: "Icône", type: "select", options: ["Mail", "MapPin", "ExternalLink", "Send", "Github", "Linkedin", "Twitter", "Globe", "Phone", "MessageSquare"], required: true },
          { key: "primary", label: "Lien principal", type: "checkbox" },
        ],
        itemLabelKey: "label",
        minItems: 0,
      },
      { key: "availabilityStatus", label: "Statut", type: "select", tab: "availability", options: ["available", "busy", "unavailable"] },
      { key: "availabilityMessage", label: "Message", type: "textarea", tab: "availability", rows: 3 },
      { key: "responseTime", label: "Délai réponse", type: "text", tab: "availability", placeholder: "ex: < 24h" },
    ],
    initialData: {
      formTitle: "Travaillons ensemble",
      formDescription: "Vous avez un projet en tête ? Discutons-en. Je réponds généralement sous 24h.",
      formFields: [
        { name: "name", label: "Nom", type: "text", required: true, placeholder: "Votre nom" },
        { name: "email", label: "Email", type: "email", required: true, placeholder: "vous@example.com" },
        { name: "subject", label: "Sujet", type: "text", required: true, placeholder: "Votre projet" },
        { name: "message", label: "Message", type: "textarea", required: true, placeholder: "Décrivez votre projet..." },
      ],
      submitEndpoint: "/api/contact",
      directLinks: [
        { label: "Email direct", url: "mailto:contact@ingabadefrancois.dev", icon: "Mail", primary: true },
        { label: "LinkedIn", url: "https://linkedin.com/in/francois-abade", icon: "Linkedin", primary: false },
        { label: "GitHub", url: "https://github.com/francois-abade", icon: "Github", primary: false },
      ],
      availabilityStatus: "available",
      availabilityMessage: "Disponible pour nouveaux projets - Freelance / Consulting / CDI",
      responseTime: "< 24h",
    },
  },
  settings: {
    label: "Paramètres globaux",
    description: "Thème, SEO, analytics, sauvegarde et restauration",
    icon: SettingsIcon,
    tabs: [
      { id: "theme", label: "Thème & Apparence", icon: <LayoutIcon size={16} /> },
      { id: "seo", label: "SEO Global", icon: <StarIcon size={16} /> },
      { id: "analytics", label: "Analytics", icon: <SettingsIcon size={16} /> },
      { id: "backup", label: "Sauvegarde", icon: <ArrowUpDownIcon size={16} /> },
    ],
    fields: [
      { key: "theme", label: "Thème", type: "select", tab: "theme", options: ["dark", "light", "system"] },
      { key: "accentColor", label: "Couleur d'accent", type: "color", tab: "theme" },
      { key: "fontDisplay", label: "Police titres", type: "text", tab: "theme" },
      { key: "fontBody", label: "Police corps", type: "text", tab: "theme" },
      { key: "fontMono", label: "Police mono", type: "text", tab: "theme" },
      { key: "siteName", label: "Nom du site", type: "text", tab: "seo" },
      { key: "siteUrl", label: "URL du site", type: "url", tab: "seo" },
      { key: "defaultMetaTitle", label: "Meta Title par défaut", type: "text", tab: "seo" },
      { key: "defaultMetaDesc", label: "Meta Description par défaut", type: "textarea", tab: "seo", rows: 3 },
      { key: "twitterHandle", label: "Twitter Handle", type: "text", tab: "seo", placeholder: "@username" },
      { key: "gaId", label: "Google Analytics ID", type: "text", tab: "analytics", placeholder: "G-XXXXXXXXXX" },
      { key: "plausibleDomain", label: "Plausible Domain", type: "text", tab: "analytics", placeholder: "example.com" },
      { key: "umamiId", label: "Umami Website ID", type: "text", tab: "analytics" },
      { key: "exportData", label: "Exporter config", type: "button", tab: "backup", action: "export" },
      { key: "importData", label: "Importer config", type: "file", tab: "backup", accept: ".json" },
      { key: "resetData", label: "Réinitialiser", type: "button", tab: "backup", action: "reset", variant: "danger" },
    ],
    initialData: {
      theme: "system",
      accentColor: "#6366f1",
      fontDisplay: "Bebas Neue",
      fontBody: "DM Sans",
      fontMono: "JetBrains Mono",
      siteName: "François Abade - Portfolio",
      siteUrl: "https://ingabadefrancois.dev",
      defaultMetaTitle: "François Abade - Ingénieur & Architecte Logiciel",
      defaultMetaDesc: "Portfolio de François Abade, ingénieur et architecte logiciel spécialisé dans les systèmes distribués, l'IA et l'infrastructure cloud.",
      twitterHandle: "@francois_abade",
      gaId: "",
      plausibleDomain: "",
      umamiId: "",
    },
  },
};

/* ============================================================
   COMPONENT
   ============================================================ */

export default function AdminSectionPage() {
  const params = useParams();
  const sectionKey = params.section as string;
  const sectionConfig = SECTIONS[sectionKey];
  const { data: adminData, getSection, setSection, resetSection } = useAdminData();

  const [activeTab, setActiveTab] = useState(sectionConfig?.tabs[0]?.id || "");
  // The selected admin section determines the shape at runtime.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<Record<string, any>>(sectionConfig?.initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportJson, setExportJson] = useState("");

  // Load saved data from context
  useEffect(() => {
    const saved = getSection(sectionKey as keyof typeof adminData, {});
    if (saved && Object.keys(saved).length > 0) {
      setData(prev => ({ ...prev, ...saved }));
    }
  }, [sectionKey, getSection, adminData]);

  // Save to context
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    sectionConfig.fields.forEach(field => {
      if (field.required && (!data[field.key] || (typeof data[field.key] === "string" && !data[field.key].trim()))) {
        newErrors[field.key] = `${field.label} est requis`;
      }
      if (field.type === "email" && data[field.key] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[field.key])) {
        newErrors[field.key] = "Email invalide";
      }
      if (field.type === "url" && data[field.key] && !data[field.key].startsWith("http")) {
        newErrors[field.key] = "URL invalide (doit commencer par http:// ou https://)";
      }
      if (field.type === "number" && data[field.key] !== undefined && data[field.key] !== "") {
        const num = Number(data[field.key]);
        if (isNaN(num)) newErrors[field.key] = "Doit être un nombre";
        else if (field.min !== undefined && num < field.min) newErrors[field.key] = `Minimum ${field.min}`;
        else if (field.max !== undefined && num > field.max) newErrors[field.key] = `Maximum ${field.max}`;
      }
      // Validation pour les arrays : vérifier minItems
      if (field.type === "array" && field.minItems && data[field.key] && data[field.key].length < field.minItems) {
        newErrors[field.key] = `Minimum ${field.minItems} élément(s) requis`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaveStatus({ type: "error", message: "Veuillez corriger les erreurs" });
      setIsSaving(false);
      return;
    }

    // Save to context
    setSection(sectionKey as keyof typeof adminData, data);

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 300));

    setSaveStatus({ type: "success", message: "Configuration sauvegardée avec succès" });
    setIsSaving(false);
  }, [sectionKey, data, sectionConfig.fields, setSection]);

  // Values come from heterogeneous field controls (text, number, checkbox, arrays).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (key: string, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
    }
    setSaveStatus(null);
  };

  const handleExport = () => {
    const exportData = {
      section: sectionKey,
      data,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };
    const json = JSON.stringify(exportData, null, 2);
    setExportJson(json);
    setShowExportModal(true);
  };

  const handleDownloadExport = () => {
    const blob = new Blob([exportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-${sectionKey}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (imported.data) {
          setData(prev => ({ ...prev, ...imported.data }));
          setSection(sectionKey as keyof typeof adminData, { ...data, ...imported.data });
          setSaveStatus({ type: "success", message: "Configuration importée avec succès" });
        }
      } catch {
        setSaveStatus({ type: "error", message: "Fichier JSON invalide" });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser cette section aux valeurs par défaut ?")) {
      setData(sectionConfig.initialData);
      resetSection(sectionKey as keyof typeof adminData);
      setSaveStatus({ type: "success", message: "Configuration réinitialisée" });
    }
  };

  if (!sectionConfig) {
    return (
      <AdminLayout title="Section introuvable" description="Cette section d'administration n'existe pas">
        <AdminCard className="max-w-md mx-auto mt-20 text-center">
          <AdminAlert
            type="error"
            title="Section introuvable"
            message={`La section "${sectionKey}" n'existe pas. Retournez au tableau de bord.`}
          />
          <Link href="/admin" className="admin-btn admin-btn-primary mt-4">
            Retour au dashboard
          </Link>
        </AdminCard>
      </AdminLayout>
    );
  }

  const currentTabFields = sectionConfig.fields.filter(f => f.tab === activeTab);

  return (
    <AdminLayout
      title={sectionConfig.label}
      description={sectionConfig.description}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <SaveIcon size={14} />
            Exporter
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} loading={isSaving}>
            <SaveIcon size={14} />
            Sauvegarder
          </Button>
        </div>
      }
    >
      {saveStatus && (
        <AdminAlert
          type={saveStatus.type}
          title={saveStatus.type === "success" ? "Succès" : "Erreur"}
          message={saveStatus.message}
          onDismiss={() => setSaveStatus(null)}
        />
      )}

      <AdminTabs
        tabs={sectionConfig.tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {currentTabFields.length === 0 ? (
          <AdminCard>
            <div className="admin-empty">
              <div className="admin-empty-icon">
                <SettingsIcon size={64} color="var(--admin-text-dim)" />
              </div>
              <h3 className="admin-empty-title">Aucun champ dans cet onglet</h3>
              <p className="admin-empty-description">Ajoutez des champs dans la configuration pour cette section.</p>
            </div>
          </AdminCard>
        ) : (
          <AdminCard>
            <div className="space-y-6">
              {currentTabFields.map((field) => {
                const error = errors[field.key];
                const value = data[field.key];

                switch (field.type) {
                  case "text":
                  case "email":
                  case "url":
                  case "tel":
                    return (
                      <FormField
                        key={field.key}
                        label={field.label}
                        error={error}
                        hint={field.description}
                        required={field.required}
                      >
                        <Input
                          value={value || ""}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          type={field.type}
                          disabled={field.disabled}
                        />
                      </FormField>
                    );

                  case "textarea":
                    return (
                      <FormField
                        key={field.key}
                        label={field.label}
                        error={error}
                        hint={field.description}
                        required={field.required}
                      >
                        <Textarea
                          value={value || ""}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          rows={field.rows || 4}
                          placeholder={field.placeholder}
                          disabled={field.disabled}
                        />
                      </FormField>
                    );

                  case "select":
                    return (
                      <FormField
                        key={field.key}
                        label={field.label}
                        error={error}
                        hint={field.description}
                        required={field.required}
                      >
                        <Select
                          value={value || ""}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          options={field.options?.map((o: string) => ({ value: o, label: o })) || []}
                          placeholder={field.placeholder}
                          disabled={field.disabled}
                        />
                      </FormField>
                    );

                  case "checkbox":
                    return (
                      <FormField
                        key={field.key}
                        label=""
                        hint={field.description}
                      >
                        <Checkbox
                          label={field.label}
                          checked={Boolean(value)}
                          onChange={(e) => handleInputChange(field.key, e.target.checked)}
                          disabled={field.disabled}
                        />
                      </FormField>
                    );

                  case "number":
                    return (
                      <FormField
                        key={field.key}
                        label={field.label}
                        error={error}
                        hint={field.description}
                        required={field.required}
                      >
                        <Input
                          type="number"
                          value={value !== undefined && value !== "" ? value : ""}
                          onChange={(e) => handleInputChange(field.key, e.target.value === "" ? undefined : Number(e.target.value))}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          placeholder={field.placeholder}
                          disabled={field.disabled}
                        />
                      </FormField>
                    );

                  case "color":
                    return (
                      <FormField
                        key={field.key}
                        label={field.label}
                        error={error}
                        hint={field.description}
                        required={field.required}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={value || "#6366f1"}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            className="w-10 h-10 rounded-lg border border-[var(--admin-border)] cursor-pointer"
                            disabled={field.disabled}
                          />
                          <Input
                            value={value || "#6366f1"}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            placeholder="#RRGGBB"
                            className="flex-1"
                            disabled={field.disabled}
                          />
                        </div>
                      </FormField>
                    );

                  case "array":
                    return (
                      <AdminFieldArray
                        key={field.key}
                        label={field.label}
                        description={field.description}
                        value={value || []}
                        onChange={(newValue) => handleInputChange(field.key, newValue)}
                        fields={field.fields || []}
                        itemLabelKey={field.itemLabelKey || "name"}
                        minItems={field.minItems || 0}
                        maxItems={field.maxItems}
                        reorderable={field.reorderable !== false}
                        collapsible={field.collapsible !== false}
                        renderItemLabel={field.renderItemLabel}
                      />
                    );

                  case "file":
                    return (
                      <FormField
                        key={field.key}
                        label={field.label}
                        hint={field.description}
                      >
                        <input
                          type="file"
                          accept={field.accept || "*"}
                          onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
                          className="w-full px-4 py-2.5 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-input-bg)] text-[var(--admin-text)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[var(--admin-accent-light)] file:text-[var(--admin-accent)] hover:file:bg-[var(--admin-accent)]"
                          disabled={field.disabled}
                        />
                      </FormField>
                    );

                  case "button":
                    return (
                      <FormField key={field.key} label={field.label} hint={field.description}>
                        <Button
                          variant={field.variant || "secondary"}
                          onClick={field.action === "export" ? handleExport : field.action === "reset" ? handleReset : undefined}
                          disabled={field.disabled}
                        >
                          {field.action === "export" && <SaveIcon size={14} />}
                          {field.action === "reset" && <TrashIcon size={14} />}
                          {field.label}
                        </Button>
                      </FormField>
                    );

                  default:
                    return null;
                }
              })}
            </div>
          </AdminCard>
        )}
      </div>

      {/* Export Modal */}
      <AdminModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Exporter la configuration"
        description="Copiez le JSON ci-dessous ou téléchargez le fichier"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowExportModal(false)}>
              <CancelIcon size={14} />
              Fermer
            </Button>
            <Button variant="primary" onClick={handleDownloadExport}>
              <SaveIcon size={14} />
              Télécharger
            </Button>
          </>
        }
      >
        <div className="bg-[var(--admin-input-bg)] border border-[var(--admin-border)] rounded-lg p-4 max-h-96 overflow-auto font-mono text-sm">
          <pre className="whitespace-pre-wrap text-[var(--admin-text)]">{exportJson}</pre>
        </div>
      </AdminModal>
    </AdminLayout>
  );
}
