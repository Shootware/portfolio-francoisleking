"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  type Variants,
  type Transition,
} from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import { motionTokens, springs } from "@/lib/motion-tokens";
import { useSafeMotion, useShouldAnimate, useMotionDuration } from "@/hooks/use-reduced-motion";
import { HeroTabs } from "./hero/HeroTabs";
import { HeroTypewriter } from "./hero/HeroTypewriter";
import { MemoizedHighlightLine } from "./hero/HeroSyntaxHighlight";
import {
  TABS_CONFIG,
  type WindowTab,
  type TabConfig,
  PHOTO_DURATION,
  CONTENT_DURATION,
  EASE_OUT_EXPO,
} from "./hero/heroTabsConfig";

interface HeroData {
  firstName: string;
  lastName: string;
  role: string;
  description: string;
  quote: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  stats: Array<{ label: string; value: string }>;
  background3dConfig: {
    type: string;
    particleCount: number;
    colors: string[];
    interactive: boolean;
  };
  tabs: {
    experiences: Array<{
      id: string;
      title: string;
      company: string;
      period: string;
      description: string;
      technologies: string[];
    }>;
    projects: Array<{
      id: string;
      title: string;
      description: string;
      technologies: string[];
      link: string;
    }>;
    skills: Array<{
      name: string;
      level: number;
      category: string;
    }>;
  };
}

interface PersonalData {
  name: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  avatar_url: string;
  socials: Array<{ label: string; href: string; icon: string }>;
  resumeUrl?: string;
}

interface HeroSectionClientProps {
  heroData: HeroData;
  personalData: PersonalData;
}

/* ============================================================
   VARIANTS
   ============================================================ */

const heroLeftVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE_OUT_EXPO } as Transition,
  },
};

const heroRightVariants: Variants = {
  hidden: { opacity: 0, x: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 18,
      delay: 0.35,
    } as Transition,
  },
};

/* ============================================================
   COMPONENT
   ============================================================ */

export function HeroSectionClient({ heroData, personalData }: HeroSectionClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<WindowTab>("photo");
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [isAutoCycling, setIsAutoCycling] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);

  const shouldAnimate = useShouldAnimate();
  const safeMotion = useSafeMotion(motionTokens.distance.md);
  const motionDuration = useMotionDuration();

  const activeTabConfig = TABS_CONFIG.find((t) => t.id === activeTab)!;
  const activeTabIndex = TABS_CONFIG.findIndex((t) => t.id === activeTab);
  const isPhotoTab = activeTab === "photo";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  /* ── Auto-cycling tabs ── */
  useEffect(() => {
    if (!isAutoCycling || userInteracted || !shouldAnimate) return;

    const currentConfig = TABS_CONFIG[activeTabIndex];
    const isPhoto = currentConfig.id === "photo";
    const duration = isPhoto ? PHOTO_DURATION : CONTENT_DURATION;

    const id = setTimeout(() => {
      const nextIndex = (activeTabIndex + 1) % TABS_CONFIG.length;
      setActiveTab(TABS_CONFIG[nextIndex].id);
    }, duration);

    return () => clearTimeout(id);
  }, [activeTab, isAutoCycling, userInteracted, shouldAnimate]);

  /* ── Progressive line reveal for code tabs ── */
  useEffect(() => {
    const content = activeTabConfig.content;
    if (content.type === "photo") {
      setVisibleLines([]);
      return;
    }

    const lines = content.lines;
    if (!shouldAnimate) {
      setVisibleLines(lines);
      return;
    }

    setVisibleLines([lines[0]]);
    const lineIndexRef = { current: 1 };
    const id = setInterval(() => {
      if (lineIndexRef.current < lines.length) {
        setVisibleLines((prev) => [...prev, lines[lineIndexRef.current]]);
        lineIndexRef.current++;
      } else {
        clearInterval(id);
      }
    }, motionTokens.duration.heroLineReveal * 1000);

    return () => clearInterval(id);
  }, [activeTab, shouldAnimate]);

  /* ── Handlers ── */
  const handleTabClick = useCallback((tabId: WindowTab) => {
    setUserInteracted(true);
    setActiveTab(tabId);
    setTimeout(() => setUserInteracted(false), 10000);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsAutoCycling(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (userInteracted) return;
    setIsAutoCycling(true);
  }, [userInteracted]);

  if (!isMounted) return <div className="hero-skeleton-fallback" />;

  return (
    <section
      ref={containerRef}
      className="hero-section"
      aria-label={`Présentation de ${personalData.name}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── MAIN GRID: LEFT CONTENT | RIGHT PHOTO WINDOW ── */}
      <div className="hero-main-grid">
        {/* ── BLOC GAUCHE ── */}
        <motion.div
          className="hero-left"
          variants={heroLeftVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="hero-name-block" variants={fadeSlideUp}>
            <span className="hero-firstname">{heroData.firstName}</span>
            <span className="hero-lastname">{heroData.lastName}</span>
          </motion.h1>

          <motion.div className="hero-role-container" variants={fadeSlideUp}>
            <HeroTypewriter shouldAnimate={shouldAnimate} />
          </motion.div>

          <motion.div className="hero-rule" variants={fadeSlideUp} aria-hidden="true" />

          <motion.blockquote className="hero-quote" variants={fadeSlideUp}>
            {heroData.quote}
          </motion.blockquote>

          <motion.div className="hero-cta" variants={fadeSlideUp}>
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
              style={{ display: "inline-flex" }}
            >
              <Link href={heroData.ctaPrimary.href} className="hero-btn hero-btn--primary">
                <span>{heroData.ctaPrimary.label}</span>
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
              style={{ display: "inline-flex" }}
            >
              <Link
                href={personalData.resumeUrl || heroData.ctaSecondary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn hero-btn--outline"
              >
                <span>{heroData.ctaSecondary.label}</span>
                <Download size={14} />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── BLOC DROIT: PHOTO WINDOW ── */}
        <motion.div
          className="hero-right"
          variants={heroRightVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="hero-photo-container">
            <div className="hero-dev-window-wrapper">
              {/* Fenêtre dev */}
              <motion.div
                className="hero-dev-window"
                whileHover={{ boxShadow: "0 40px 80px rgba(0,0,0,0.45)", y: -4 }}
                transition={{ type: "spring" as const, stiffness: 200, damping: 25 }}
              >
                {/* Header — onglets */}
                <div className="window-header">
                  <div className="window-controls">
                    <span className="control-dot dot-close" />
                    <span className="control-dot dot-minimize" />
                    <span className="control-dot dot-expand" />
                  </div>
                  <HeroTabs activeTab={activeTab} onTabClick={handleTabClick} />
                </div>

                {/* Corps */}
                <div className="window-body">
                  <AnimatePresence mode="wait">
                    {activeTabConfig.content.type === "photo" ? (
                      <motion.div
                        key="photo-state"
                        initial={
                          shouldAnimate
                            ? { opacity: 0, scale: 1.03, filter: "blur(6px)" }
                            : { opacity: 1, scale: 1, filter: "blur(0px)" }
                        }
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={
                          shouldAnimate
                            ? { opacity: 0, scale: 0.97, filter: "blur(6px)" }
                            : { opacity: 0 }
                        }
                        transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                        className="hero-photo-inner"
                        id="panel-photo"
                        role="tabpanel"
                        aria-labelledby="tab-photo"
                      >
                        <div className="hero-photo-wrapper">
                          <Image
                            src={personalData.avatar_url || "/photo.png"}
                            alt={`Portrait de ${personalData.name}`}
                            className="hero-photo-img"
                            fill
                            priority
                            sizes="(max-width: 900px) 100vw, 380px"
                            draggable="false"
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`${activeTab}-state`}
                        initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={shouldAnimate ? { opacity: 0, y: -10 } : { opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                        className={
                          `hero-code-terminal ${activeTabConfig.content.type === "terminal" ? "hero-terminal" : ""}`
                        }
                        id={`panel-${activeTab}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${activeTab}`}
                      >
                        {activeTabConfig.content.type !== "terminal" && (
                          <div className="terminal-meta">
                            #{activeTabConfig.content.type === "code"
                              ? ` ${activeTabConfig.label}`
                              : " System Architecture"}
                          </div>
                        )}
                        <div className="terminal-lines">
                          {visibleLines.map((line, idx) => (
                            <motion.div
                              key={`${idx}-${line}`}
                              initial={shouldAnimate ? { opacity: 0, x: -6 } : { opacity: 1, x: 0 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                              className="terminal-line"
                            >
                              <span className="line-number">{idx + 1}</span>
                              <MemoizedHighlightLine line={line} type={activeTabConfig.content.type} />
                            </motion.div>
                          ))}
                          <motion.span
                            className="terminal-cursor-block"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                          >
                          </motion.span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
