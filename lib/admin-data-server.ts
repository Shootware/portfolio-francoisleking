"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEFAULT_DATA, AdminSectionData } from "./admin-data";

export async function loadAdminDataServer(): Promise<AdminSectionData> {
  // Pendant le build, on utilise les valeurs par défaut : aucune requête
  // Supabase ne doit être nécessaire pour compiler le site.
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return DEFAULT_DATA;
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return DEFAULT_DATA;
  }

  // Check if we're using placeholder values (not real Supabase config)
  const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("placeholder");
  if (isPlaceholder) {
    return DEFAULT_DATA;
  }

  try {
    const supabase = await createServerSupabaseClient();

    // Le site public doit pouvoir lire le profil publié sans session.
    // L'ancienne implémentation exigeait un utilisateur connecté, ce qui
    // faisait toujours retomber les visiteurs sur DEFAULT_DATA.
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
      .limit(1)
      .maybeSingle();

    if (error || !profile) return DEFAULT_DATA;

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
    console.warn("Failed to load admin data server-side:", e);
    return DEFAULT_DATA;
  }
}
