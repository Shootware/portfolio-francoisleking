// ============================================================
// LAYOUT — PageTransition (Optimisé UI/UX & Fix App Router)
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

// Courbe de transition "Cubic Easing" ultra-fluide et professionnelle (Fast-out, Slow-in)
const transitionEase = [0.16, 1, 0.3, 1] as const;

const variants = {
  hidden: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Sécurité SSR : Empêche le mismatch d'hydratation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Gestion du retour au sommet du scroll au parfait moment de l'animation
  const handleExitComplete = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={handleExitComplete}
    >
      <motion.div
        key={pathname}
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{
          duration: 0.35,
          ease: transitionEase
        }}
        // Évite les débordements de boîtes de dialogue ou de layout pendant les sauts de page
        className="w-full min-h-screen flex flex-col will-change-transform-opacity"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}