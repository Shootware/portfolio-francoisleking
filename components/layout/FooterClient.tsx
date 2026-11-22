"use client";

import Link from "next/link";
import { Globe, Mail, Video, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { motionTokens, springs } from "@/lib/motion-tokens";
import { useShouldAnimate } from "@/hooks/use-reduced-motion";

interface PersonalData {
  name: string;
  socials: Array<{ label: string; href: string; icon: string }>;
}

interface FooterClientProps {
  personalData: PersonalData;
}

const ICON_MAP = {
  Github: Globe,
  Linkedin: Mail,
  Video,
} as const;

export function FooterClient({ personalData }: FooterClientProps) {
  const year = new Date().getFullYear();
  const shouldAnimate = useShouldAnimate();

  return (
    <footer
      role="contentinfo"
      className="skills-section-unified py-12 relative overflow-hidden"
      style={{
        borderTop: "1px solid var(--window-border)",
      }}
    >
      {/* Injection de style épuré pour les interactions des boutons sociaux */}
      <style>{`
        .footer-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--about-card-bg);
          border: 1px solid var(--window-border);
          color: var(--hero-text-muted);
          transition: background 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                      color 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .footer-social-link:hover {
          background: var(--window-bg);
          border-color: var(--hero-text-muted);
          color: var(--hero-text-main);
          transform: translateY(-2px);
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">

        {/* Section Copyright & Localisation */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.gentle}
          className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-2 sm:gap-4 w-full sm:w-auto"
        >
          <p className="text-xs sm:text-sm font-sans tracking-wide text-center sm:text-left text-[var(--hero-text-muted)] opacity-90">
            © {year}{" "}
            <span className="font-medium text-[var(--hero-text-main)]">
              {personalData.name}
            </span>
            <span className="opacity-40 mx-1.5">|</span>
            Fait avec ☕ à Yaoundé
          </p>

          {/* Lien admin discret */}
          <Link
            href="/admin"
            className="text-xs font-sans tracking-wide text-[var(--hero-text-muted)] opacity-50 hover:opacity-100 hover:text-[var(--hero-accent)] transition-all duration-200 flex items-center gap-1.5 group"
            aria-label="Accéder à l'administration"
            title="Administration (Ctrl+Shift+A)"
          >
            <Settings size={12} aria-hidden="true" className="group-hover:rotate-45 transition-transform" />
            <span className="hidden sm:inline">Admin</span>
            <kbd className="hidden md:inline-flex px-1.5 py-0.5 text-[10px] font-mono bg-[var(--window-bg)] border border-[var(--window-border)] rounded">⌘⇧A</kbd>
          </Link>
        </motion.div>

        {/* Menu de navigation des réseaux sociaux */}
        <motion.nav
          initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.1 }}
          aria-label="Liens sociaux"
        >
          <ul className="flex items-center gap-3" role="list">
            {personalData.socials.map(({ label, href, icon }) => {
              const Icon = ICON_MAP[icon as keyof typeof ICON_MAP];
              return (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visiter mon profil ${label}`}
                    className="footer-social-link"
                  >
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={springs.snappy}
                    >
                      {Icon && <Icon size={16} aria-hidden="true" />}
                    </motion.span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      </div>
    </footer>
  );
}