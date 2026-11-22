"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { motionTokens, springs } from "@/lib/motion-tokens";
import { useShouldAnimate, useSafeMotion } from "@/hooks/use-reduced-motion";

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  tiltIntensity?: number;
  hoverScale?: number;
  perspective?: number;
  onClick?: () => void;
}

export function InteractiveCard({
  children,
  className = "",
  tiltIntensity = 15,
  hoverScale = 1.05,
  perspective = 1000,
  onClick,
}: InteractiveCardProps) {
  const shouldAnimate = useShouldAnimate();
  const safeMotion = useSafeMotion(motionTokens.distance.md);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || !resolvedTheme;
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!shouldAnimate) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (shouldAnimate) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Use Framer Motion for the 3D tilt effect
  const tiltStyle = {
    transform: `perspective(${perspective}px) rotateX(${-mousePosition.y * tiltIntensity}deg) rotateY(${mousePosition.x * tiltIntensity}deg) scale3d(${isHovered ? hoverScale : 1}, ${isHovered ? hoverScale : 1}, ${isHovered ? hoverScale : 1})`,
    transformStyle: "preserve-3d" as const,
  };

  const transition = shouldAnimate ? { ...springs.gentle, duration: motionTokens.duration.fast } : { duration: 0 };

  return (
    <motion.div
      ref={cardRef}
      className={`interactive-card ${className}`}
      style={{
        willChange: "transform",
        ...tiltStyle,
      }}
      transition={transition}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.98, transition: springs.snappy }}
    >
      <div className="card-content" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>

      {/* Glare effect */}
      {shouldAnimate && isHovered && (
        <motion.div
          className="card-glare"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionTokens.duration.fast }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: `linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
            transform: `translateZ(30px) rotateX(${-mousePosition.y * tiltIntensity * 2}deg) rotateY(${mousePosition.x * tiltIntensity * 2}deg)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* 3D Border glow */}
      <motion.div
        className="card-border-3d"
        style={{
          position: "absolute",
          inset: "-2px",
          borderRadius: "inherit",
          background: `linear-gradient(135deg, ${isDark ? "#6366f1" : "#6366f1"}, ${isDark ? "#1d9e75" : "#1d9e75"})`,
          filter: "blur(8px)",
          opacity: isHovered ? 0.3 : 0,
          transform: "translateZ(-10px)",
          pointerEvents: "none",
          transition: `opacity ${motionTokens.duration.fast}s ease`,
        }}
      />
    </motion.div>
  );
}
