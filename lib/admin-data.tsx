"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

/* ============================================================
   TYPES
   ============================================================ */

export interface AdminSectionData {
  // These sections intentionally mirror schemaless CMS JSON from Supabase.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  personal: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hero: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  about: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  experience: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projects: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  skills: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contact: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: Record<string, any>;
}

const STORAGE_KEY = "portfolio-admin-data";
const STORAGE_VERSION = "2.0"; // Updated version for Supabase migration

export const DEFAULT_DATA: AdminSectionData = {
  personal: {},
  hero: {},
  about: {},
  experience: {},
  projects: {},
  skills: {},
  contact: {},
  settings: {},
};

/* ============================================================
   CONTEXT
   ============================================================ */

interface AdminDataContextType {
  data: AdminSectionData;
  loading: boolean;
  saving: boolean;
  lastSaved: string | null;
  getSection: <T>(section: keyof AdminSectionData, defaultValue: T) => T;
  setSection: <T>(section: keyof AdminSectionData, value: T) => void;
  updateSection: <T>(section: keyof AdminSectionData, updater: (prev: T) => T) => void;
  saveAll: () => Promise<void>;
  exportAll: () => string;
  importAll: (json: string) => boolean;
  resetAll: () => void;
  resetSection: (section: keyof AdminSectionData) => void;
  syncFromSupabase: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

/* ============================================================
   HELPER: Supabase operations
   ============================================================ */

async function fetchFromSupabase(): Promise<AdminSectionData | null> {
  if (typeof window === "undefined") return null;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  try {
    const supabase = createClient();

    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    // Fetch profile with all related data
    const { data: profile, error } = await supabase
      .from("profiles")
      .select(`
        *,
        hero_sections(*),
        about_sections(*),
        experiences(*),
        projects(*),
        skills(*),
        contact_sections(*),
        settings(*)
      `)
      .eq("user_id", session.user.id)
      .single();

    if (error || !profile) return null;

    // Transform Supabase data to AdminSectionData format
    return {
      personal: {
        name: profile.name,
        tagline: profile.tagline,
        bio: profile.bio,
        email: profile.email,
        location: profile.location,
        avatar_url: profile.avatar_url,
        socials: profile.socials,
      },
      hero: profile.hero_sections?.[0] || {},
      about: profile.about_sections?.[0] || {},
      experience: { items: profile.experiences || [] },
      projects: { items: profile.projects || [] },
      skills: { items: profile.skills || [] },
      contact: profile.contact_sections?.[0] || {},
      settings: profile.settings?.[0] || {},
    };
  } catch (e) {
    console.warn("Failed to load from Supabase:", e);
    return null;
  }
}

// The Supabase client accepts arbitrary JSON columns for these CMS sections.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function saveToSupabase(section: keyof AdminSectionData, data: any): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return false;
  }

  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const profileId = session.user.id;

    // Map section to Supabase table
    const tableMap: Record<keyof AdminSectionData, string> = {
      personal: "profiles",
      hero: "hero_sections",
      about: "about_sections",
      experience: "experiences",
      projects: "projects",
      skills: "skills",
      contact: "contact_sections",
      settings: "settings",
    };

    const table = tableMap[section];
    if (!table) return false;

    // For profiles, update directly; for others, upsert with profile_id
    if (section === "personal") {
      const { error } = await supabase
        .from("profiles")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("user_id", profileId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from(table)
        .upsert({ profile_id: profileId, ...data, updated_at: new Date().toISOString() });
      if (error) throw error;
    }

    return true;
  } catch (e) {
    console.warn(`Failed to save ${section} to Supabase:`, e);
    return false;
  }
}

/* ============================================================
   PROVIDER
   ============================================================ */

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminSectionData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [saveQueue, setSaveQueue] = useState<Set<keyof AdminSectionData>>(new Set());
  const [useSupabase, setUseSupabase] = useState(false);

  // Check if Supabase is configured
  useEffect(() => {
    const configured = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    setUseSupabase(configured);
  }, []);

  // Load data on mount - try Supabase first, then localStorage
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        if (useSupabase) {
          const supabaseData = await fetchFromSupabase();
          if (supabaseData && mounted) {
            setData(supabaseData);
            setLoading(false);
            return;
          }
        }

        // Fallback to localStorage
        if (typeof window !== "undefined") {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.version === STORAGE_VERSION && parsed.data) {
              if (mounted) setData(parsed.data);
            }
          }
        }
      } catch (e) {
        console.warn("Failed to load admin data:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => { mounted = false; };
  }, [useSupabase]);

  // Debounced save to both Supabase and localStorage
  useEffect(() => {
    if (loading) return;
    if (saveQueue.size === 0) return;

    const timeoutId = setTimeout(async () => {
      setSaving(true);
      try {
        // Save to localStorage (always works as fallback)
        const payload = {
          version: STORAGE_VERSION,
          data,
          updatedAt: new Date().toISOString(),
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        }

        // Also save to Supabase if configured and authenticated
        if (useSupabase) {
          await Promise.all(
            Array.from(saveQueue).map(section =>
              saveToSupabase(section, data[section])
            )
          );
        }

        setLastSaved(new Date().toISOString());
      } catch (e) {
        console.error("Failed to save admin data:", e);
      } finally {
        setSaveQueue(new Set());
        setSaving(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [saveQueue, loading, data, useSupabase]);

  const getSection = useCallback(<T,>(section: keyof AdminSectionData, defaultValue: T): T => {
    return (data[section] as T) ?? defaultValue;
  }, [data]);

  const setSection = useCallback(<T,>(section: keyof AdminSectionData, value: T) => {
    setData(prev => {
      const newData = { ...prev, [section]: value };
      setSaveQueue(prevQ => new Set(prevQ).add(section));
      return newData;
    });
  }, []);

  const updateSection = useCallback(<T,>(section: keyof AdminSectionData, updater: (prev: T) => T) => {
    setData(prev => {
      const current = (prev[section] as T) ?? ({} as T);
      const newData = { ...prev, [section]: updater(current) };
      setSaveQueue(prevQ => new Set(prevQ).add(section));
      return newData;
    });
  }, []);

  const saveAll = useCallback(async () => {
    setSaveQueue(new Set(Object.keys(data) as Array<keyof AdminSectionData>));
    // Wait for save to complete
    await new Promise(resolve => setTimeout(resolve, 600));
  }, [data]);

  const exportAll = useCallback(() => {
    const payload = {
      version: STORAGE_VERSION,
      data,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  }, [data]);

  const importAll = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json);
      if (parsed.data && typeof parsed.data === "object") {
        setData(parsed.data);
        // Trigger save to both localStorage and Supabase
        setSaveQueue(new Set(Object.keys(parsed.data) as Array<keyof AdminSectionData>));
        return true;
      }
    } catch {
      // Invalid JSON
    }
    return false;
  }, []);

  const resetAll = useCallback(() => {
    setData(DEFAULT_DATA);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const resetSection = useCallback((section: keyof AdminSectionData) => {
    setData(prev => {
      const newData = { ...prev, [section]: {} };
      setSaveQueue(prevQ => new Set(prevQ).add(section));
      return newData;
    });
  }, []);

  const syncFromSupabase = useCallback(async () => {
    if (!useSupabase) return;
    setLoading(true);
    try {
      const supabaseData = await fetchFromSupabase();
      if (supabaseData) {
        setData(supabaseData);
      }
    } catch (e) {
      console.error("Failed to sync from Supabase:", e);
    } finally {
      setLoading(false);
    }
  }, [useSupabase]);

  return (
    <AdminDataContext.Provider
      value={{
        data,
        loading,
        saving,
        lastSaved,
        getSection,
        setSection,
        updateSection,
        saveAll,
        exportAll,
        importAll,
        resetAll,
        resetSection,
        syncFromSupabase,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

/* ============================================================
   HOOK
   ============================================================ */

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
}

/* ============================================================
   UTILITY FUNCTIONS (non-hook) - Client Component compatible
   ============================================================ */

// Client-side load function (for use in Client Components)
export function loadAdminData(): AdminSectionData {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.version === STORAGE_VERSION && parsed.data) {
        return parsed.data;
      }
    }
  } catch {
    // Ignore
  }
  return DEFAULT_DATA;
}

export function saveAdminData(data: AdminSectionData): void {
  if (typeof window === "undefined") return;
  try {
    const payload = {
      version: STORAGE_VERSION,
      data,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error("Failed to save admin data:", e);
  }
}

export function exportAdminData(): string {
  const data = loadAdminData();
  return JSON.stringify(
    {
      version: STORAGE_VERSION,
      data,
      exportedAt: new Date().toISOString(),
    },
    null,
    2
  );
}

export function importAdminData(json: string): boolean {
  try {
    const parsed = JSON.parse(json);
    if (parsed.data && typeof parsed.data === "object") {
      saveAdminData(parsed.data);
      return true;
    }
  } catch {
    // Invalid
  }
  return false;
}

export function resetAdminData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
