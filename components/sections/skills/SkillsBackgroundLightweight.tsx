"use client";

import { useEffect, useRef } from "react";

export function SkillsBackgroundLightweight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isLowEndDevice = (navigator.hardwareConcurrency || 8) <= 4;
    const shouldAnimate = !prefersReducedMotion && !isLowEndDevice;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isLowEndDevice ? 1 : 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const isDark = () => document.documentElement.classList.contains("dark");

    const draw = (time: number) => {
      timeRef.current = time * 0.001;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dark = isDark();

      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = dark ? "#0f172a" : "#fafafa";
      ctx.fillRect(0, 0, w, h);

      const gridColor = dark ? "rgba(59, 130, 246, 0.04)" : "rgba(99, 102, 241, 0.06)";
      const accentColor = dark ? "rgba(129, 140, 248, 0.08)" : "rgba(79, 70, 229, 0.1)";
      const wireColor = dark ? "rgba(30, 41, 59, 0.3)" : "rgba(226, 232, 240, 0.5)";

      // Design grid (8px baseline)
      const gridSize = 32; // 8px * 4 for visibility
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;

      for (let x = 0; x <= w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Major grid (every 8th = 256px)
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1;
      const majorGridSize = gridSize * 8;
      for (let x = 0; x <= w; x += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Floating wireframe artboards
      const artboards = [
        { baseX: w * 0.2, baseY: h * 0.2, w: 200, h: 140, speed: 0.08, phase: 0 },
        { baseX: w * 0.8, baseY: h * 0.25, w: 160, h: 180, speed: 0.06, phase: 2.1 },
        { baseX: w * 0.15, baseY: h * 0.75, w: 180, h: 120, speed: 0.07, phase: 4.2 },
        { baseX: w * 0.85, baseY: h * 0.7, w: 220, h: 150, speed: 0.05, phase: 1.5 },
        { baseX: w * 0.5, baseY: h * 0.5, w: 140, h: 100, speed: 0.09, phase: 3.3 },
      ];

      ctx.strokeStyle = wireColor;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 4]);

      artboards.forEach((ab) => {
        const x = ab.baseX + Math.sin(timeRef.current * ab.speed + ab.phase) * 40;
        const y = ab.baseY + Math.cos(timeRef.current * ab.speed * 0.8 + ab.phase * 1.3) * 30;
        const radius = 8;

        ctx.beginPath();
        ctx.roundRect(x - ab.w / 2, y - ab.h / 2, ab.w, ab.h, radius);
        ctx.stroke();

        // Inner content hint lines
        ctx.strokeStyle = dark ? "rgba(129, 140, 248, 0.05)" : "rgba(79, 70, 229, 0.08)";
        ctx.lineWidth = 0.5;
        ctx.setLineDash([]);

        for (let i = 1; i < 4; i++) {
          const ly = y - ab.h / 2 + (ab.h / 4) * i;
          ctx.beginPath();
          ctx.moveTo(x - ab.w / 2 + 16, ly);
          ctx.lineTo(x + ab.w / 2 - 16, ly);
          ctx.stroke();
        }

        ctx.strokeStyle = wireColor;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 4]);
      });

      ctx.setLineDash([]);

      // Floating design elements
      const elements = 8;
      for (let i = 0; i < elements; i++) {
        const seed = i * 23.7 + 100;
        const ex = (w * 0.5) + Math.sin(timeRef.current * 0.12 + seed) * (w * 0.4);
        const ey = (h * 0.5) + Math.cos(timeRef.current * 0.09 + seed * 1.7) * (h * 0.4);
        const size = 4 + (Math.sin(seed * 3.1) * 0.5 + 0.5) * 8;
        const pulse = 0.5 + 0.5 * Math.sin(timeRef.current * 1.5 + seed);

        ctx.fillStyle = dark
          ? `rgba(129, 140, 248, ${0.1 * pulse})`
          : `rgba(79, 70, 229, ${0.15 * pulse})`;
        ctx.beginPath();
        ctx.arc(ex, ey, size * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // Corner markers (Figma-style)
      const corners = [
        { x: w * 0.1, y: h * 0.1 },
        { x: w * 0.9, y: h * 0.1 },
        { x: w * 0.1, y: h * 0.9 },
        { x: w * 0.9, y: h * 0.9 },
      ];

      ctx.strokeStyle = dark ? "rgba(129, 140, 248, 0.3)" : "rgba(79, 70, 229, 0.4)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";

      corners.forEach((c) => {
        const size = 24;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y + size);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(c.x + size, c.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(c.x, c.y + size);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(c.x - size, c.y);
        ctx.stroke();
      });

      if (shouldAnimate) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw(0);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  );
}

