"use client";

import { type TabConfig, type WindowTab, TABS_CONFIG } from "./heroTabsConfig";

/* ============================================================
   HERO TABS COMPONENT
   ============================================================ */

interface HeroTabsProps {
  activeTab: WindowTab;
  onTabClick: (tabId: WindowTab) => void;
}

export function HeroTabs({ activeTab, onTabClick }: HeroTabsProps) {
  return (
    <div
      className="window-tabs"
      role="tablist"
      aria-label="Fichiers de développement"
    >
      {TABS_CONFIG.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          id={`tab-${tab.id}`}
          className={`window-tab ${activeTab === tab.id ? "active-tab" : ""}`}
          onClick={() => onTabClick(tab.id)}
        >
          <span className="tab-decor" aria-hidden="true">
            {tab.icon}
          </span>
          <span className="tab-title">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}