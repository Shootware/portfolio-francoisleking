// ============================================================
// PAGE — 404 Not Found
// Affiché automatiquement par Next.js quand une page n'existe pas.
// ============================================================

import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      aria-label="Page introuvable"
    >
      {/* Numéro décoratif */}
      <p
        className="font-display text-[10rem] font-bold leading-none text-gradient opacity-20 select-none"
        aria-hidden="true"
      >
        404
      </p>

      <h1 className="font-display text-3xl font-bold -mt-6 mb-3">
        Page introuvable
      </h1>

      <p className="text-[var(--color-muted)] max-w-md mb-8">
        Cette page n'existe pas ou a été déplacée. Retourne sur la page
        d'accueil pour explorer mes projets.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent)] text-white font-medium hover:opacity-90 transition-opacity"
        aria-label="Retourner à l'accueil"
      >
        ← Retour à l'accueil
      </Link>
    </main>
  );
}
