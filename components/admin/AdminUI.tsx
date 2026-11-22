"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  DashboardIcon,
  UserIcon,
  LayoutIcon,
  TimelineIcon,
  FolderIcon,
  LayersIcon,
  MailIcon,
  SettingsIcon,
  EyeIcon,
  StarIcon,
  ArrowUpDownIcon,
  CancelIcon,
  LogoutIcon,
} from "./AdminIcons";

/* ============================================================
   ADMIN NAVIGATION CONFIG
   ============================================================ */

export interface AdminNavItem {
  href: string;
  label: string;
  icon: React.FC<{ size?: number; color?: string; className?: string }>;
  badge?: number;
  children?: AdminNavItem[];
}

export interface AdminTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export const ADMIN_NAV: AdminNavItem[] = [
  {
    href: "/admin",
    label: "Tableau de bord",
    icon: DashboardIcon,
  },
  {
    href: "/admin/personal",
    label: "Informations personnelles",
    icon: UserIcon,
  },
  {
    href: "/admin/hero",
    label: "Section Hero",
    icon: LayoutIcon,
  },
  {
    href: "/admin/about",
    label: "Section À propos",
    icon: LayersIcon,
  },
  {
    href: "/admin/experience",
    label: "Expérience & Timeline",
    icon: TimelineIcon,
  },
  {
    href: "/admin/projects",
    label: "Projets",
    icon: FolderIcon,
  },
  {
    href: "/admin/skills",
    label: "Compétences",
    icon: StarIcon,
  },
  {
    href: "/admin/contact",
    label: "Contact",
    icon: MailIcon,
  },
  {
    href: "/admin/settings",
    label: "Paramètres",
    icon: SettingsIcon,
  },
];

/* ============================================================
   ADMIN LAYOUT COMPONENT
   ============================================================ */

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminLayout({ children, title, description, actions }: AdminLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="admin-layout min-h-screen bg-[var(--admin-bg)] transition-colors duration-300">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[var(--admin-sidebar-bg)] border-r border-[var(--admin-border)] transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navigation principale"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--admin-border)]">
            <Link href="/admin" className="flex items-center gap-2 font-semibold text-[var(--admin-text)]">
              <DashboardIcon size={24} color="var(--admin-accent)" />
              <span className="hidden sm:block">Admin</span>
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--admin-hover)] text-[var(--admin-text-muted)]"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              <CancelIcon size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Sections d'administration">
            {ADMIN_NAV.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
              return (
                <AdminNavItem
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  pathname={pathname}
                />
              );
            })}
          </nav>

          {/* Sidebar footer - user info */}
          <AdminSidebarFooter />
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-[var(--admin-header-bg)] border-b border-[var(--admin-border)] backdrop-blur-sm">
          <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-[var(--admin-hover)] text-[var(--admin-text-muted)]"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Ouvrir le menu"
              >
                <DashboardIcon size={24} />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-[var(--admin-text)]">{title}</h1>
                {description && <p className="text-sm text-[var(--admin-text-muted)]">{description}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {actions}
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)] transition-colors"
                title="Voir le site"
              >
                <EyeIcon size={18} />
                <span className="hidden sm:inline">Voir le site</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   ADMIN NAV ITEM COMPONENT
   ============================================================ */

interface AdminNavItemProps {
  item: AdminNavItem;
  isActive: boolean;
  pathname: string;
}

function AdminNavItem({ item, isActive, pathname }: AdminNavItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const [expanded, setExpanded] = useState(isActive);

  // Auto-expand if active route is in children
  if (hasChildren && item.children!.some((child) => pathname.startsWith(child.href))) {
    setExpanded(true);
  }

  const Icon = item.icon;

  if (hasChildren) {
    return (
      <div className="group">
        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
            isActive || expanded
              ? "bg-[var(--admin-accent)]/10 text-[var(--admin-accent)]"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]"
          }`}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={`${item.label} ${expanded ? "fermé" : "ouvert"}`}
        >
          <Icon size={20} className="flex-shrink-0" />
          <span className="flex-1 font-medium">{item.label}</span>
          <ArrowUpDownIcon size={16} className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
          {item.badge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--admin-accent)] text-white">
              {item.badge}
            </span>
          )}
        </button>
        {expanded && (
          <ul className="mt-1 ml-9 space-y-1 border-l border-[var(--admin-border)] pl-3" role="group" aria-label={item.label}>
            {item.children!.map((child) => {
              const childActive = pathname === child.href;
              const ChildIcon = child.icon;
              return (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                      childActive
                        ? "bg-[var(--admin-accent)]/10 text-[var(--admin-accent)]"
                        : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]"
                    }`}
                    aria-current={childActive ? "page" : undefined}
                  >
                    <ChildIcon size={16} className="flex-shrink-0" />
                    <span>{child.label}</span>
                    {child.badge && (
                      <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-[var(--admin-accent)]/20 text-[var(--admin-accent)]">
                        {child.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-[var(--admin-accent)]/10 text-[var(--admin-accent)]"
          : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon size={20} className="flex-shrink-0" />
      <span className="font-medium">{item.label}</span>
      {item.badge && (
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[var(--admin-accent)] text-white">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

/* ============================================================
   ADMIN PAGE HEADER COMPONENT
   ============================================================ */

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function AdminPageHeader({ title, description, actions, breadcrumbs }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-[var(--admin-text-muted)] mb-4" aria-label="Fil d'Ariane">
          <Link href="/admin" className="hover:text-[var(--admin-accent)] transition-colors">Admin</Link>
          {breadcrumbs.map((crumb) => (
            <React.Fragment key={crumb.href || crumb.label}>
              <span className="mx-1" aria-hidden="true">/</span>
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-[var(--admin-accent)] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[var(--admin-text)] font-medium" aria-current="page">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--admin-text)] tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-[var(--admin-text-muted)]">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN CARD COMPONENT
   ============================================================ */

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function AdminCard({ children, className, header, footer }: AdminCardProps) {
  return (
    <div className={`bg-[var(--admin-card-bg)] border border-[var(--admin-border)] rounded-xl overflow-hidden ${className || ""}`}>
      {header && (
        <div className="px-6 py-4 border-b border-[var(--admin-border)] bg-[var(--admin-card-header-bg)]">
          {header}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-[var(--admin-border)] bg-[var(--admin-card-header-bg)] flex items-center justify-end gap-3">
          {footer}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ADMIN FORM COMPONENTS
   ============================================================ */

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}

export function FormField({ label, error, hint, required, children, htmlFor }: FormFieldProps) {
  const id = htmlFor || `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--admin-text)]">
        {label}
        {required && <span className="text-[var(--admin-error)] ml-1" aria-hidden="true">*</span>}
      </label>
      <div>{children}</div>
      {error && <p className="text-sm text-[var(--admin-error)]" role="alert">{error}</p>}
      {hint && !error && <p className="text-sm text-[var(--admin-text-muted)]">{hint}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <FormField label={label || ""} error={error} hint={hint} htmlFor={inputId}>
      <input
        id={inputId}
        className={`w-full px-4 py-2.5 rounded-lg border bg-[var(--admin-input-bg)] text-[var(--admin-text)] placeholder-[var(--admin-text-muted)] transition-colors ${
          error
            ? "border-[var(--admin-error)] focus:ring-[var(--admin-error)]"
            : "border-[var(--admin-border)] hover:border-[var(--admin-accent)]/50 focus:border-[var(--admin-accent)] focus:ring-[var(--admin-accent)]"
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--admin-input-bg)]`}
        {...props}
      />
    </FormField>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <FormField label={label || ""} error={error} hint={hint} htmlFor={textareaId}>
      <textarea
        id={textareaId}
        className={`w-full px-4 py-2.5 rounded-lg border bg-[var(--admin-input-bg)] text-[var(--admin-text)] placeholder-[var(--admin-text-muted)] transition-colors resize-y min-h-[100px] ${
          error
            ? "border-[var(--admin-error)] focus:ring-[var(--admin-error)]"
            : "border-[var(--admin-border)] hover:border-[var(--admin-accent)]/50 focus:border-[var(--admin-accent)] focus:ring-[var(--admin-accent)]"
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--admin-input-bg)]`}
        {...props}
      />
    </FormField>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export function Select({ label, error, hint, options, placeholder, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <FormField label={label || ""} error={error} hint={hint} htmlFor={selectId}>
      <select
        id={selectId}
        className={`w-full px-4 py-2.5 rounded-lg border bg-[var(--admin-input-bg)] text-[var(--admin-text)] transition-colors ${
          error
            ? "border-[var(--admin-error)] focus:ring-[var(--admin-error)]"
            : "border-[var(--admin-border)] hover:border-[var(--admin-accent)]/50 focus:border-[var(--admin-accent)] focus:ring-[var(--admin-accent)]"
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--admin-input-bg)]`}
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </FormField>
  );
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function Checkbox({ label, hint, id, ...props }: CheckboxProps) {
  const checkboxId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        id={checkboxId}
        className={`mt-1 h-4 w-4 rounded border-[var(--admin-border)] text-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)] focus:ring-offset-2 focus:ring-offset-[var(--admin-input-bg)] transition-colors cursor-pointer ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        {...props}
      />
      <div className="flex-1">
        <label htmlFor={checkboxId} className="text-sm font-medium text-[var(--admin-text)] cursor-pointer">
          {label}
        </label>
        {hint && <p className="text-sm text-[var(--admin-text-muted)] mt-0.5">{hint}</p>}
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN BUTTON COMPONENTS
   ============================================================ */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent)]/90 focus:ring-[var(--admin-accent)]",
    secondary: "bg-[var(--admin-secondary)] text-[var(--admin-text)] hover:bg-[var(--admin-secondary)]/80 focus:ring-[var(--admin-secondary)]",
    outline: "border border-[var(--admin-border)] bg-transparent hover:bg-[var(--admin-hover)] focus:ring-[var(--admin-accent)]",
    ghost: "bg-transparent hover:bg-[var(--admin-hover)] focus:ring-[var(--admin-accent)]",
    danger: "bg-[var(--admin-error)] text-white hover:bg-[var(--admin-error)]/90 focus:ring-[var(--admin-error)]",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon && iconPosition === "left" ? (
        <span aria-hidden="true">{icon}</span>
      ) : null}
      {children}
      {icon && iconPosition === "right" && !loading && <span aria-hidden="true">{icon}</span>}
    </button>
  );
}

/* ============================================================
   ADMIN TABLE COMPONENTS
   ============================================================ */

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({ columns, data, keyExtractor, emptyMessage = "Aucune donnée", onRowClick, className }: DataTableProps<T>) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-[var(--admin-border)] ${className || ""}`}>
      {data.length > 0 ? (
        <table className="w-full" role="grid">
          <thead className="bg-[var(--admin-card-header-bg)] border-b border-[var(--admin-border)]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 text-left text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border)]">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className={`hover:bg-[var(--admin-hover)] transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-sm text-[var(--admin-text)] ${col.className || ""}`}>
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="px-6 py-12 text-center">
          <p className="text-[var(--admin-text-muted)]">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ADMIN TABS COMPONENT
   ============================================================ */

interface AdminTabsProps {
  tabs: AdminTab[];
  activeTab: string;
  onChange: (tab: string) => void;
  className?: string;
}

export function AdminTabs({ tabs, activeTab, onChange, className }: AdminTabsProps) {
  return (
    <div className={`flex gap-1 bg-[var(--admin-card-header-bg)] p-1 rounded-lg border border-[var(--admin-border)] ${className || ""}`} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          id={`tab-${tab.id}`}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-[var(--admin-accent)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-hover)]"
          }`}
        >
          {tab.icon && (
            <span aria-hidden="true">
              {tab.icon}
            </span>
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   ADMIN MODAL COMPONENT
   ============================================================ */

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function AdminModal({ isOpen, onClose, title, description, children, footer, size = "md" }: AdminModalProps) {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${sizeStyles[size]} bg-[var(--admin-card-bg)] border border-[var(--admin-border)] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
      >
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-[var(--admin-border)]">
          <div>
            <h2 id="modal-title" className="text-lg sm:text-xl font-semibold text-[var(--admin-text)]">{title}</h2>
            {description && <p className="mt-1 text-sm text-[var(--admin-text-muted)]">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-hover)] transition-colors"
            aria-label="Fermer"
          >
            <CancelIcon size={20} />
          </button>
        </div>
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-[var(--admin-border)] bg-[var(--admin-card-header-bg)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN ALERT/TOAST COMPONENT
   ============================================================ */

interface AdminAlertProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  onDismiss?: () => void;
}

export function AdminAlert({ type, title, message, onDismiss }: AdminAlertProps) {
  const typeStyles = {
    success: "bg-green-500/10 border-green-500/20 text-green-400",
    error: "bg-red-500/10 border-red-500/20 text-red-400",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  };

  const icons = {
    success: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
    error: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>,
    warning: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>,
    info: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>,
  };

  return (
    <div className={`flex gap-3 p-4 rounded-lg border ${typeStyles[type]}`} role="alert">
      <div className="flex-shrink-0" aria-hidden="true">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors" aria-label="Fermer">
          <CancelIcon size={18} />
        </button>
      )}
    </div>
  );
}

/* ============================================================
   ADMIN SIDEBAR FOOTER WITH LOGOUT
   ============================================================ */

export function AdminSidebarFooter() {
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <div className="p-4 border-t border-[var(--admin-border)]">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-[var(--admin-accent)] flex items-center justify-center text-white text-sm font-medium">
          AG
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--admin-text)] truncate">Abade François</p>
          <p className="text-xs text-[var(--admin-text-muted)]">Administrateur</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-error)] transition-colors"
      >
        <LogoutIcon size={18} />
        <span>Déconnexion</span>
      </button>
    </div>
  );
}

/* ============================================================
   EXPORT ALL ADMIN UI COMPONENTS
   ============================================================ */

export * from "./AdminIcons";
