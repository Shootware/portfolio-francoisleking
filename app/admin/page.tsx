"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout, AdminCard } from "@/components/admin/AdminUI";
import {
  UserIcon,
  LayoutIcon,
  LayersIcon,
  TimelineIcon,
  FolderIcon,
  StarIcon,
  MailIcon,
  SettingsIcon,
  PlusIcon,
  ArrowUpDownIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  SaveIcon,
} from "@/components/admin/AdminIcons";

/* ============================================================
   ADMIN DASHBOARD — OVERVIEW
   ============================================================ */

const SECTIONS_CONFIG = [
  {
    id: "personal",
    label: "Informations personnelles",
    icon: UserIcon,
    href: "/admin/personal",
    description: "Nom, titre, bio, coordonnées, réseaux sociaux",
    itemCount: 1,
  },
  {
    id: "hero",
    label: "Section Hero",
    icon: LayoutIcon,
    href: "/admin/hero",
    description: "Onglets, typewriter, canvas, strip technos",
    itemCount: 5,
  },
  {
    id: "about",
    label: "Section À propos",
    icon: LayersIcon,
    href: "/admin/about",
    description: "Timeline, bio, grille Bento valeurs/expertises",
    itemCount: 6,
  },
  {
    id: "experience",
    label: "Expérience & Timeline",
    icon: TimelineIcon,
    href: "/admin/experience",
    description: "Parcours professionnel, formations, certifications",
    itemCount: 3,
  },
  {
    id: "projects",
    label: "Projets",
    icon: FolderIcon,
    href: "/admin/projects",
    description: "Portfolio projets avec filtres et détails",
    itemCount: 0,
  },
  {
    id: "skills",
    label: "Compétences",
    icon: StarIcon,
    href: "/admin/skills",
    description: "Stack technique, niveaux, catégories",
    itemCount: 0,
  },
  {
    id: "contact",
    label: "Contact",
    icon: MailIcon,
    href: "/admin/contact",
    description: "Formulaire, liens directs, disponibilité",
    itemCount: 0,
  },
  {
    id: "settings",
    label: "Paramètres globaux",
    icon: SettingsIcon,
    href: "/admin/settings",
    description: "Thème, SEO, analytics, sauvegarde",
    itemCount: 0,
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSections: SECTIONS_CONFIG.length,
    totalItems: 0,
    lastModified: new Date().toISOString(),
    status: "healthy" as "healthy" | "warning" | "error",
  });

  // Load stats from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio-admin-stats");
      if (saved) {
        setStats(JSON.parse(saved));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  return (
    <AdminLayout
      title="Tableau de bord"
      description="Gérez toutes les sections de votre portfolio depuis une interface unique"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AdminCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--admin-text-muted)]">Sections configurables</p>
              <p className="text-3xl font-bold text-[var(--admin-text)] mt-1">{stats.totalSections}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--admin-accent-light)] flex items-center justify-center">
              <LayoutIcon size={24} color="var(--admin-accent)" />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--admin-text-muted)]">Éléments de contenu</p>
              <p className="text-3xl font-bold text-[var(--admin-text)] mt-1">{stats.totalItems}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--admin-success-bg)] flex items-center justify-center">
              <FolderIcon size={24} color="var(--admin-success)" />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--admin-text-muted)]">Dernière modification</p>
              <p className="text-sm font-medium text-[var(--admin-text)] mt-1">
                {new Date(stats.lastModified).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--admin-info-bg)] flex items-center justify-center">
              <ArrowUpDownIcon size={24} color="var(--admin-info)" />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--admin-text-muted)]">Statut du portfolio</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    stats.status === "healthy"
                      ? "bg-[var(--admin-success)]"
                      : stats.status === "warning"
                      ? "bg-[var(--admin-warning)]"
                      : "bg-[var(--admin-error)]"
                  }`}
                />
                <span className="text-sm font-medium text-[var(--admin-text)] capitalize">{stats.status}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--admin-warning-bg)] flex items-center justify-center">
              <EyeIcon size={24} color="var(--admin-warning)" />
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Sections Grid */}
      <AdminCard>
        <div className="px-6 py-4 border-b border-[var(--admin-border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--admin-text)]">Sections du portfolio</h2>
          <Link href="/admin/personal" className="admin-btn admin-btn-primary admin-btn-sm">
            <PlusIcon size={16} />
            Ajouter une section
          </Link>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS_CONFIG.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className="admin-card p-5 hover:border-[var(--admin-accent)]/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--admin-accent-light)] flex items-center justify-center flex-shrink-0">
                          <Icon size={20} color="var(--admin-accent)" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-[var(--admin-text)] truncate group-hover:text-[var(--admin-accent)] transition-colors">
                            {section.label}
                          </h3>
                          <p className="text-sm text-[var(--admin-text-muted)] truncate">{section.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--admin-text-dim)]">
                        <span className="flex items-center gap-1">
                          <EditIcon size={12} />
                          {section.itemCount} éléments
                        </span>
                        <span className="flex items-center gap-1">
                          <EyeIcon size={12} />
                          Prévisualiser
                        </span>
                      </div>
                    </div>
                    <ArrowUpDownIcon size={20} color="var(--admin-text-dim)" className="flex-shrink-0 group-hover:text-[var(--admin-accent)] transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </AdminCard>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <div className="px-6 py-4 border-b border-[var(--admin-border)]">
            <h2 className="text-lg font-semibold text-[var(--admin-text)]">Actions rapides</h2>
          </div>
          <div className="p-6 space-y-3">
            <Link href="/admin/personal" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--admin-hover)] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[var(--admin-accent-light)] flex items-center justify-center">
                <UserIcon size={20} color="var(--admin-accent)" />
              </div>
              <div>
                <p className="font-medium text-[var(--admin-text)]">Modifier le profil</p>
                <p className="text-sm text-[var(--admin-text-muted)]">Nom, titre, bio, avatar, réseaux</p>
              </div>
            </Link>
            <Link href="/admin/hero" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--admin-hover)] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[var(--admin-info-bg)] flex items-center justify-center">
                <LayoutIcon size={20} color="var(--admin-info)" />
              </div>
              <div>
                <p className="font-medium text-[var(--admin-text)]">Configurer le Hero</p>
                <p className="text-sm text-[var(--admin-text-muted)]">Onglets, animation, photo, tech stack</p>
              </div>
            </Link>
            <Link href="/admin/about" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--admin-hover)] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[var(--admin-success-bg)] flex items-center justify-center">
                <LayersIcon size={20} color="var(--admin-success)" />
              </div>
              <div>
                <p className="font-medium text-[var(--admin-text)]">Gérer À propos</p>
                <p className="text-sm text-[var(--admin-text-muted)]">Timeline, valeurs, grille Bento</p>
              </div>
            </Link>
            <Link href="/admin/projects" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--admin-hover)] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[var(--admin-warning-bg)] flex items-center justify-center">
                <FolderIcon size={20} color="var(--admin-warning)" />
              </div>
              <div>
                <p className="font-medium text-[var(--admin-text)]">Ajouter un projet</p>
                <p className="text-sm text-[var(--admin-text-muted)]">Portfolio avec filtres et détails</p>
              </div>
            </Link>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="px-6 py-4 border-b border-[var(--admin-border)]">
            <h2 className="text-lg font-semibold text-[var(--admin-text)]">Aperçu du site</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--admin-card-header-bg)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--admin-accent-light)] flex items-center justify-center">
                    <EyeIcon size={16} color="var(--admin-accent)" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--admin-text)]">Voir le portfolio</p>
                    <p className="text-sm text-[var(--admin-text-muted)]">Ouvre dans un nouvel onglet</p>
                  </div>
                </div>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn admin-btn-outline admin-btn-sm"
                >
                  <EyeIcon size={14} />
                  Ouvrir
                </a>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--admin-card-header-bg)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--admin-success-bg)] flex items-center justify-center">
                    <SaveIcon size={16} color="var(--admin-success)" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--admin-text)]">Exporter la config</p>
                    <p className="text-sm text-[var(--admin-text-muted)]">Télécharger JSON de sauvegarde</p>
                  </div>
                </div>
                <button className="admin-btn admin-btn-outline admin-btn-sm">
                  <SaveIcon size={14} />
                  Exporter
                </button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--admin-card-header-bg)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--admin-warning-bg)] flex items-center justify-center">
                    <ArrowUpDownIcon size={16} color="var(--admin-warning)" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--admin-text)]">Importer config</p>
                    <p className="text-sm text-[var(--admin-text-muted)]">Restaurer depuis un fichier JSON</p>
                  </div>
                </div>
                <button className="admin-btn admin-btn-outline admin-btn-sm">
                  <ArrowUpDownIcon size={14} />
                  Importer
                </button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--admin-card-header-bg)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--admin-error-bg)] flex items-center justify-center">
                    <TrashIcon size={16} color="var(--admin-error)" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--admin-text)]">Réinitialiser</p>
                    <p className="text-sm text-[var(--admin-text-muted)]">Remettre aux valeurs par défaut</p>
                  </div>
                </div>
                <button className="admin-btn admin-btn-outline admin-btn-sm admin-btn-danger">
                  <TrashIcon size={14} />
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Recent Activity */}
      <AdminCard className="mt-8">
        <div className="px-6 py-4 border-b border-[var(--admin-border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--admin-text)]">Activité récente</h2>
          <button className="admin-btn admin-btn-ghost admin-btn-sm">Voir tout</button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: "Configuration sauvegardée", section: "Hero", time: "Il y a 2 heures", type: "success" },
              { action: "Nouveau projet ajouté", section: "Projets", time: "Il y a 5 heures", type: "info" },
              { action: "Timeline modifiée", section: "Expérience", time: "Hier", type: "warning" },
              { action: "Compétences mises à jour", section: "Compétences", time: "Hier", type: "success" },
              { action: "Photo de profil changée", section: "Personnel", time: "Il y a 2 jours", type: "info" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--admin-hover)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === "success" ? "bg-[var(--admin-success-bg)]" :
                    activity.type === "info" ? "bg-[var(--admin-info-bg)]" :
                    activity.type === "warning" ? "bg-[var(--admin-warning-bg)]" :
                    "bg-[var(--admin-error-bg)]"
                  }`}>
                    {activity.type === "success" && <SaveIcon size={14} color="var(--admin-success)" />}
                    {activity.type === "info" && <PlusIcon size={14} color="var(--admin-info)" />}
                    {activity.type === "warning" && <EditIcon size={14} color="var(--admin-warning)" />}
                    {activity.type === "error" && <TrashIcon size={14} color="var(--admin-error)" />}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--admin-text)]">{activity.action}</p>
                    <p className="text-sm text-[var(--admin-text-muted)]">{activity.section} · {activity.time}</p>
                  </div>
                </div>
                <span className={`admin-badge ${activity.type === "success" ? "admin-badge-success" : activity.type === "info" ? "admin-badge-primary" : activity.type === "warning" ? "admin-badge-warning" : "admin-badge-error"}`}>
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </AdminCard>
    </AdminLayout>
  );
}
