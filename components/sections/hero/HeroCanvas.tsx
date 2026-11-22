"use client";

import { useEffect, useRef } from "react";
import { TECH_ITEMS } from "./heroTabsConfig";

interface PhysicalBadge {
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  mass: number;
}

interface HeroCanvasProps {
  isActive: boolean;
}

export function HeroCanvas({ isActive }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const itemsRef = useRef<PhysicalBadge[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    // Only run physics when the photo tab is active
    if (!isActive) {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }

    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;

    const resize = () => {
      if (!containerRef.current) return;
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
      // Re-initialize items on resize
      initializeItems(canvas, ctx);
    };

    window.addEventListener("resize", resize);
    resize();

    const loop = () => {
      const ctx = ctxRef.current;
      const items = itemsRef.current;
      if (!ctx || !items.length) {
        animationIdRef.current = requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get CSS variables for theming
      const cs = getComputedStyle(document.documentElement);
      const badgeBg = cs.getPropertyValue("--badge-canvas-bg").trim() || "#FFFFFF";
      const badgeText = cs.getPropertyValue("--badge-canvas-text").trim() || "#000000";
      const badgeBorder = cs.getPropertyValue("--badge-canvas-border").trim() || "rgba(0,0,0,0.08)";
      const shadowColor = cs.getPropertyValue("--window-shadow").trim() || "rgba(0,0,0,0.18)";

      ctx.font = "800 10.5px ui-monospace, JetBrains Mono, monospace";

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.x += item.vx;
        item.y += item.vy;

        if (item.x < 0) {
          item.x = 0;
          item.vx *= -1;
        }
        if (item.x + item.width > canvas.width) {
          item.x = canvas.width - item.width;
          item.vx *= -1;
        }
        if (item.y < 0) {
          item.y = 0;
          item.vy *= -1;
        }
        if (item.y + item.height > canvas.height) {
          item.y = canvas.height - item.height;
          item.vy *= -1;
        }

        for (let j = i + 1; j < items.length; j++) {
          const cx1 = item.x + item.width / 2;
          const cy1 = item.y + item.height / 2;
          const cx2 = items[j].x + items[j].width / 2;
          const cy2 = items[j].y + items[j].height / 2;
          if (Math.hypot(cx1 - cx2, cy1 - cy2) < item.width / 2 + items[j].width / 2) {
            resolveCollision(item, items[j]);
          }
        }

        ctx.save();
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = badgeBg;
        ctx.strokeStyle = badgeBorder;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect?.(item.x, item.y, item.width, item.height, 4);
        ctx.fill();
        ctx.stroke();
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.fillStyle = badgeText;
        ctx.beginPath();
        ctx.arc(item.x + 10, item.y + item.height / 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "800 10.5px ui-monospace, JetBrains Mono, monospace";
        ctx.textBaseline = "middle";
        ctx.fillText(item.label, item.x + 18, item.y + item.height / 2 + 0.5);
        ctx.restore();
      }

      animationIdRef.current = requestAnimationFrame(loop);
    };

    initializeItems(canvas, ctx);
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [isActive]);

  const initializeItems = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    itemsRef.current = TECH_ITEMS.map((item) => {
      const label = item.label;
      const tw = ctx.measureText(label).width;
      const w = tw + 32;
      const h = 26;
      return {
        label,
        x: Math.random() * (canvas.width - w - 40) + 20,
        y: Math.random() * (canvas.height - h - 40) + 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        width: w,
        height: h,
        mass: w,
      };
    });
  };

  const resolveCollision = (b1: PhysicalBadge, b2: PhysicalBadge) => {
    const dvx = b1.vx - b2.vx;
    const dvy = b1.vy - b2.vy;
    const dx = b2.x - b1.x;
    const dy = b2.y - b1.y;
    if (dvx * dx + dvy * dy >= 0) {
      const angle = -Math.atan2(dy, dx);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const m1 = b1.mass;
      const m2 = b2.mass;
      const u1x = b1.vx * cos - b1.vy * sin;
      const u1y = b1.vx * sin + b1.vy * cos;
      const u2x = b2.vx * cos - b2.vy * sin;
      const u2y = b2.vx * sin + b2.vy * cos;
      const v1x = (u1x * (m1 - m2) + 2 * m2 * u2x) / (m1 + m2);
      const v2x = (u2x * (m2 - m1) + 2 * m1 * u1x) / (m1 + m2);
      b1.vx = v1x * cos + u1y * sin;
      b1.vy = -v1x * sin + u1y * cos;
      b2.vx = v2x * cos + u2y * sin;
      b2.vy = -v2x * sin + u2y * cos;
    }
  };

  return (
    <div ref={containerRef} className="hero-physics-container">
      <canvas ref={canvasRef} className="hero-physics-canvas" aria-hidden="true" />
    </div>
  );
}