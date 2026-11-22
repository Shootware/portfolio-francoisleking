// ============================================================
// A11Y — SkipToContent
// Lien invisible (visible uniquement au focus clavier).
// WCAG 2.4.1 — permet aux utilisateurs de lecteurs d'écran
// de sauter la navigation et aller directement au contenu.
//
// Usage : place-le en premier enfant dans <body> (dans layout.tsx)
// ============================================================

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={[
        // Caché par défaut
        "sr-only",
        // Visible uniquement au focus clavier (focus-visible)
        "focus:not-sr-only",
        "focus:fixed focus:top-4 focus:left-4 focus:z-[100]",
        "focus:px-4 focus:py-2 focus:rounded-lg",
        "focus:bg-[var(--color-accent)] focus:text-white",
        "focus:text-sm focus:font-medium focus:shadow-lg",
      ].join(" ")}
    >
      Aller au contenu principal
    </a>
  );
}
