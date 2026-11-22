// ============================================================
// HOOK — useScrollSpy
// Détecte quelle section est visible dans le viewport
// pour surligner le bon lien dans la navbar.
// ============================================================

import { useState, useEffect, useRef } from "react";

interface UseScrollSpyOptions {
  /** IDs des sections à surveiller (ex: ["hero", "about", "skills"]) */
  sectionIds: string[];
  /** Offset en px depuis le top (= hauteur de la navbar) */
  offset?: number;
}

export function useScrollSpy({
  sectionIds,
  offset = 80,
}: UseScrollSpyOptions): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");
  // On garde une ref pour éviter de re-créer l'observer à chaque render
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Nettoie l'observer précédent si les IDs changent
    observerRef.current?.disconnect();

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      // On récupère toutes les sections visibles
      const visible = entries
        .filter((e) => e.isIntersecting)
        .map((e) => e.target.id);

      if (visible.length > 0) {
        // On prend la première section visible dans l'ordre du DOM
        const first = sectionIds.find((id) => visible.includes(id));
        if (first) setActiveId(first);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      // rootMargin compense la hauteur de la navbar
      rootMargin: `-${offset}px 0px -40% 0px`,
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [sectionIds, offset]);

  return activeId;
}
