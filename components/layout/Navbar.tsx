// ============================================================
// LAYOUT — Navbar
// Design cohérent light/dark via variables CSS globals.
// Sticky, scroll spy, dark mode toggle, menu mobile.
// ============================================================

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useTheme } from "@/hooks/useTheme";
import { personal } from "@/content";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Accueil",   href: "#hero"       },
  { label: "À propos",  href: "#about"      },
  { label: "Skills",    href: "#skills"     },
  { label: "Projets",   href: "#projects"   },
  { label: "Parcours",  href: "#experience" },
  { label: "Contact",   href: "#contact"    },
] as const;

const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace("#", ""));

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const activeId = useScrollSpy({ sectionIds: SECTION_IDS, offset: 80 });

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Rendu minimal SSR-safe
  if (!isMounted) {
    return (
      <header role="banner" className="fixed top-0 left-0 right-0 z-50 py-5" style={{ background: "transparent" }}>
        <nav aria-label="Navigation principale" className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <span className="font-display font-bold text-lg tracking-tight">
            <span style={{
              backgroundImage: "linear-gradient(135deg, var(--color-accent-light), var(--color-accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>FL</span>
            <span className="ml-1 text-sm font-normal hidden sm:inline" style={{ color: "var(--color-subtle)" }}>
              .dev
            </span>
          </span>
        </nav>
      </header>
    );
  }

  return (
    <header
      role="banner"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-3" : "py-5"
      )}
      style={
        isScrolled
          ? {
              background: "var(--glass-bg)",
              borderBottom: "1px solid var(--glass-border)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }
          : { background: "transparent" }
      }
    >
      <nav
        aria-label="Navigation principale"
        className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between"
      >
        {/* Logo */}
        <Link
          href="#hero"
          className="font-display font-bold text-lg tracking-tight transition-opacity hover:opacity-80"
          aria-label="Retour en haut de page"
        >
          <span style={{
            backgroundImage: "linear-gradient(135deg, var(--color-accent-light), var(--color-accent))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>FL</span>
          <span className="ml-1 text-sm font-normal hidden sm:inline" style={{ color: "var(--color-subtle)" }}>
            .dev
          </span>
        </Link>

        {/* Liens desktop */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ label, href }) => {
            const sectionId = href.replace("#", "");
            const isActive = activeId === sectionId;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "location" : undefined}
                  className="relative px-3 py-1.5 text-sm rounded-md transition-colors block"
                  style={{
                    color: isActive ? "var(--color-accent-light)" : "var(--color-muted)",
                    fontWeight: isActive ? 500 : 400,
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-text)";
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-muted)";
                  }}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                      style={{ background: "var(--color-accent-light)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions droite */}
        <div className="flex items-center gap-2">
          {/* Toggle thème */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
            className="p-2 rounded-md transition-colors"
            style={{ color: "var(--color-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--color-muted)")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* CTA desktop */}
          <Link
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: "var(--color-accent-dim)",
              border: "1px solid var(--color-accent)",
              color: "var(--color-accent-light)",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            aria-label="Me contacter"
          >
            Me contacter
          </Link>

          {/* Burger mobile */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="md:hidden p-2 rounded-md transition-colors"
            style={{ color: "var(--color-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--color-muted)")}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Menu de navigation mobile"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden px-4 py-4"
            style={{
              background: "var(--glass-bg)",
              borderBottom: "1px solid var(--glass-border)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <ul className="flex flex-col gap-1" role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-md text-sm transition-colors"
                    style={{ color: "var(--color-muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--color-muted)")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-center transition-all"
                  style={{
                    background: "var(--color-accent-dim)",
                    border: "1px solid var(--color-accent)",
                    color: "var(--color-accent-light)",
                  }}
                >
                  Me contacter
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}