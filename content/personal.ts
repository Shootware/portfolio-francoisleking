// ============================================================
// PERSONAL DATA — Infos de base du développeur
// ============================================================

export interface SocialLink {
  label: string;
  href: string;
  icon: string; // nom de l'icône Lucide
}

export interface PersonalData {
  name: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  availableForWork: boolean;
  socials: SocialLink[];
  resumeUrl: string;
}

export const personal: PersonalData = {
  name: "ABADE FRANCOIS GABIE",
  tagline: "Tech Lead & Software Architect",
  bio: "Je construis des produits web et mobiles pensés pour l'Afrique. 5+ ans d'expérience sur React, Node.js, Python et mobile. J'aime les interfaces rapides, les architectures propres et les idées qui créent de la valeur réelle.",
  location: "Yaoundé, Cameroun 🇨🇲",
  email: "lekingfrancois22@gmail.com",
  availableForWork: true,
  resumeUrl: "/resume.pdf",
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/Shootware",
      icon: "Github",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/francois-abade-616a15211/",
      icon: "Linkedin",
    },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@ingabade404",
      icon: "Video",
    },
  ],
};