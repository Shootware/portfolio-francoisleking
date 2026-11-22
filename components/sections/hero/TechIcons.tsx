"use client";

import React from "react";

interface TechIconProps {
  size?: number;
  color?: string;
  className?: string;
}

/* Tech Stack Icons — inline SVG components for proper color inheritance */
export function NextJsIcon({ size = 24, color = "currentColor", className }: TechIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={color}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0L0 12l4.4 4.4 8-8 8 8L24 12 12 0z" />
    </svg>
  );
}

export function PythonIcon({ size = 24, color = "currentColor", className }: TechIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={color}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22c-5.52 0-10-4.48-10-10S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm-1-17v8h2V7h-2zm0 10v2h2v-2h-2z" />
    </svg>
  );
}

export function Css3Icon({ size = 24, color = "currentColor", className }: TechIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={color}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.5 9.5c0 .83-.67 1.5-1.5 1.5H8V9h7.5c.83 0 1.5.67 1.5 1.5v2zm-7 1H8V7h2.5v3.5zM12 16H8v-1.5h4V16zm0-2.5H8V11h4v2.5zm4 2.5H12V16h4v-2.5zm0-2.5H12V11h4v2.5zm4-4v1.5h-2.5v-3.5H12V7h5.5v3.5z" />
    </svg>
  );
}

export function DockerIcon({ size = 24, color = "currentColor", className }: TechIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={color}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path d="M20.5 11.7c-.5-2.1-2.1-3.8-4.1-4.3V2.7c0-.6-.5-1.1-1.1-1.1H9.7c-.6 0-1.1.5-1.1 1.1v4.7c-2 .5-3.6 2.2-4.1 4.3C3.7 12.6 3 14.2 3 16v4c0 .6.5 1.1 1.1 1.1h15c.6 0 1.1-.5 1.1-1.1v-4c0-1.8-.7-3.4-1.6-4.3zM9.7 3.8c0-.3.2-.6.6-.6h4.7c.3 0 .6.2.6.6v3.6c0 .3-.2.6-.6.6h-4.7c-.3 0-.6-.2-.6-.6V3.8zm8.5 13.9c0 .3-.2.6-.6.6H6.5c-.3 0-.6-.2-.6-.6v-4c0-.3.2-.6.6-.6h2v-1.5c0-.8.7-1.5 1.5-1.5h7c.8 0 1.5.7 1.5 1.5V17.7h2c.3 0 .6.2.6.6v4z" />
    </svg>
  );
}

export function PostgresIcon({ size = 24, color = "currentColor", className }: TechIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={color}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 5.58 2 10s4.48 8 10 8 10-3.58 10-8-4.48-8-10-8zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm2 0h2v6h-2z" />
    </svg>
  );
}

/* Export all as a map for easy access */
export const TECH_ICONS = {
  "NEXT.JS": NextJsIcon,
  "PYTHON": PythonIcon,
  "CSS3": Css3Icon,
  "DOCKER": DockerIcon,
  "POSTGRES": PostgresIcon,
} as const;