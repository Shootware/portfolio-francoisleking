"use client";

import { useEffect, useState } from "react";
import { TECH_ITEMS } from "./heroTabsConfig";
import { motionTokens } from "@/lib/motion-tokens";
import {
  NextJsIcon,
  PythonIcon,
  Css3Icon,
  DockerIcon,
  PostgresIcon,
} from "./TechIcons";

const TechIconComponents: Record<string, React.FC<{ size?: number; color?: string }>> = {
  "NEXT.JS": NextJsIcon,
  "PYTHON": PythonIcon,
  "CSS3": Css3Icon,
  "DOCKER": DockerIcon,
  "POSTGRES": PostgresIcon,
};

export function HeroTechStrip() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Icon rotation for the marquee effect
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TECH_ITEMS.length);
    }, motionTokens.duration.heroIconRotate * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero-tech-strip" aria-hidden="true">
      <div className="tech-scroll-track">
        {TECH_ITEMS.map((item, idx) => {
          const IconComponent = TechIconComponents[item.label];
          return (
            <div key={item.label} className="tech-scroll-item">
              {IconComponent && <IconComponent size={22} color="var(--hero-tech-icon-color)" />}
            </div>
          );
        })}
        {TECH_ITEMS.map((item, idx) => {
          const IconComponent = TechIconComponents[item.label];
          return (
            <div key={`${item.label}-repeat`} className="tech-scroll-item">
              {IconComponent && <IconComponent size={22} color="var(--hero-tech-icon-color)" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}