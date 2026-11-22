"use client";

import { motionTokens } from "@/lib/motion-tokens";

/* ============================================================
   TYPES
   ============================================================ */

export type WindowTab =
  | "photo"
  | "code"
  | "architecture"
  | "terminal"
  | "ai";

export interface TabConfig {
  id: WindowTab;
  label: string;
  icon: string;
  content: TabContent;
}

export type TabContent =
  | { type: "photo" }
  | { type: "code"; lines: string[] }
  | { type: "terminal"; lines: string[] };

/* ============================================================
   CONSTANTS — 5 Tabs with Clean Syntax-Highlighted Content
   ============================================================ */

const PYTHON_ALGO = [
  "def binary_search(arr, low, high, x):",
  "    if high >= low:",
  "        mid = (high + low) // 2",
  "        if arr[mid] == x:",
  "            return mid",
  "        elif arr[mid] > x:",
  "            return binary_search(arr, low, mid - 1, x)",
  "        else:",
  "            return binary_search(arr, mid + 1, high, x)",
  "    return -1  # Matrix Optimized",
];

const ARCHITECTURE_PY = [
  "class EventDrivenArchitecture:",
  "    def __init__(self):",
  "        self.bus = MessageBus()",
  "        self.services: dict[str, Service] = {}",
  "",
  "    def register(self, svc: Service):",
  "        self.services[svc.name] = svc",
  "        self.bus.subscribe(svc.topic, svc.handle)",
  "",
  "    async def emit(self, event: Event):",
  "        await self.bus.publish(event.topic, event.payload)",
];

const TERMINAL_SH = [
  "# Deploy to production",
  "docker build -t ingabadefrancois.dev .",
  "docker tag ingabadefrancois.dev:latest",
  "  registry.example.com/portfolio:prod",
  "docker push registry.example.com/portfolio:prod",
  "",
  "kubectl set image deployment/portfolio",
  "  portfolio=registry.example.com/portfolio:prod",
  "kubectl rollout status deployment/portfolio",
];

const AI_ML = [
  "prompt: \"African tech ecosystem growth\"",
  "model: gpt-4o-mini",
  "temperature: 0.7",
  "",
  "response: {",
  "  insight: \"Mobile-first is non-negotiable\",",
  "  strategy: [\"PWA\", \"Offline-first\", \"Low-bandwidth\"]",
  "  localization: [\"FR\", \"EN\", \"Local langs\"]",
  "}",
];

/* ── Single source of truth: label + icon together ── */
export const TECH_ITEMS = [
  { label: "NEXT.JS", src: "/icons/nextjs.svg" },
  { label: "PYTHON", src: "/icons/python.svg" },
  { label: "CSS3", src: "/icons/css3.svg" },
  { label: "DOCKER", src: "/icons/docker.svg" },
  { label: "POSTGRES", src: "/icons/postgres.svg" },
] as const;

export const TABS_CONFIG: TabConfig[] = [
  {
    id: "photo",
    label: "photo.png",
    icon: "◇",
    content: { type: "photo" },
  },
  {
    id: "code",
    label: "algo.py",
    icon: "◇",
    content: { type: "code", lines: PYTHON_ALGO },
  },
  {
    id: "architecture",
    label: "architecture.py",
    icon: "◇",
    content: { type: "code", lines: ARCHITECTURE_PY },
  },
  {
    id: "terminal",
    label: "deploy.sh",
    icon: "◇",
    content: { type: "terminal", lines: TERMINAL_SH },
  },
  {
    id: "ai",
    label: "ai-prompt.txt",
    icon: "◇",
    content: { type: "code", lines: AI_ML },
  },
];

export const FULL_TEXT = "Tech Lead & Software Architect";

/* ── Cycle durations from motionTokens (converted to ms) ── */
export const PHOTO_DURATION = motionTokens.duration.heroPhoto * 1000;
export const CONTENT_DURATION = motionTokens.duration.heroContent * 1000;

export const EASE_OUT_EXPO = motionTokens.easing.expo;