# François Leking — Portfolio Architect Level 2026

Portfolio fullstack personnel construit avec Next.js 15, TypeScript strict, Framer Motion et un design system Glassmorphism.

---

## Stack technique

| Catégorie       | Technologie                              |
|-----------------|------------------------------------------|
| Framework       | Next.js 15 (App Router)                  |
| Langage         | TypeScript 5 (strict mode)               |
| Style           | Tailwind CSS 4 + variables CSS           |
| Animations      | Framer Motion 11                         |
| Formulaire      | React Hook Form + Zod                    |
| Thème           | next-themes (dark/light/system)          |
| Icônes          | Lucide React                             |
| Email           | Resend                                   |
| Déploiement     | Vercel                                   |

---

## Installation locale

```bash
# 1. Cloner le projet
git clone https://github.com/francoisleking/portfolio.git
cd portfolio

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.local.example .env.local
# Édite .env.local avec ta clé Resend

# 4. Lancer le serveur de développement
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

---

## Structure du projet

```
portfolio/
├── app/                    # Routes Next.js (App Router)
│   ├── api/contact/        # Route Handler formulaire de contact
│   ├── projects/[slug]/    # Pages détail projets
│   ├── globals.css         # Design system (variables CSS)
│   ├── layout.tsx          # Layout racine (SEO, fonts, providers)
│   ├── page.tsx            # Page principale
│   ├── sitemap.ts          # Sitemap XML dynamique
│   └── robots.ts           # robots.txt
├── components/
│   ├── layout/             # Navbar, Footer, ThemeProvider, PageTransition
│   ├── sections/           # Hero, About, Skills, Projects, Experience, Contact
│   └── ui/                 # Button, Badge, Card, SectionHeader, SkipToContent
├── content/                # ⭐ Single Source of Truth (données typées)
│   ├── personal.ts         # Infos perso
│   ├── projects.ts         # Projets
│   ├── skills.ts           # Compétences
│   └── experience.ts       # Timeline
├── hooks/                  # useScrollSpy, useTheme
└── lib/                    # utils, validation Zod
```

---

## Mettre à jour le contenu

**Tout le contenu est centralisé dans `/content` — tu n'as jamais besoin de toucher aux composants.**

| Ce que tu veux modifier | Fichier à éditer              |
|-------------------------|-------------------------------|
| Nom, bio, email         | `content/personal.ts`         |
| Projets                 | `content/projects.ts`         |
| Compétences             | `content/skills.ts`           |
| Expérience/timeline     | `content/experience.ts`       |

---

## Configurer l'envoi d'emails (formulaire de contact)

1. Crée un compte sur [resend.com](https://resend.com) (gratuit)
2. Génère une API Key dans ton dashboard
3. Ajoute dans `.env.local` :
   ```
   RESEND_API_KEY=re_ton_api_key
   CONTACT_EMAIL_TO=ton@email.com
   ```

---

## Déploiement sur Vercel

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel

# 3. Ajouter les variables d'environnement dans Vercel Dashboard
# Settings → Environment Variables → RESEND_API_KEY + CONTACT_EMAIL_TO
```

Ou connecte simplement ton repo GitHub à [vercel.com](https://vercel.com) — déploiement automatique à chaque push.

---

## Scripts disponibles

```bash
npm run dev          # Serveur de développement (Turbopack)
npm run build        # Build de production
npm run start        # Démarrer le build de production
npm run lint         # ESLint
npm run type-check   # Vérification TypeScript sans build
```

---

## Ajouter un projet

Dans `content/projects.ts` :

```typescript
{
  id:          "mon-projet",           // slug URL : /projects/mon-projet
  title:       "Mon Projet",
  description: "Description courte",
  longDescription: "Description détaillée pour la page projet",
  category:    ["web", "ai"],
  tech:        ["React", "Python"],
  image:       "/projects/mon-projet.png", // ajouter dans /public/projects/
  liveUrl:     "https://...",
  githubUrl:   "https://github.com/...",
  featured:    true,
  year:        2025,
}
```

---

## Licence

MIT — Libre d'utilisation et de modification.
