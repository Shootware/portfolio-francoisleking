import { createClient } from "@supabase/supabase-js";
import type { RealtimePostgresChangesPayload } from "@supabase/realtime-js";

type AdminRow = Record<string, unknown>;

// Admin client with service role key - use ONLY in server-side code (API routes, server actions)
// NEVER expose this to the client bundle
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export const supabaseAdmin = createAdminClient();

// Admin-only database operations
export async function getAdminData(profileId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      *,
      hero_sections(*),
      about_sections(*),
      experiences(*),
      projects(*),
      skills(*),
      contact_sections(*),
      settings(*)
    `
    )
    .eq("id", profileId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateSection<T>(
  table: string,
  profileId: string,
  data: Partial<T>
) {
  const supabase = createAdminClient();

  const { data: result, error } = await supabase
    .from(table)
    .upsert({ profile_id: profileId, ...data, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function createExperience(profileId: string, data: AdminRow) {
  const supabase = createAdminClient();

  const { data: result, error } = await supabase
    .from("experiences")
    .insert({ profile_id: profileId, ...data })
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function updateExperience(id: string, data: AdminRow) {
  const supabase = createAdminClient();

  const { data: result, error } = await supabase
    .from("experiences")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function deleteExperience(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("experiences").delete().eq("id", id);

  if (error) throw error;
  return true;
}

export async function createProject(profileId: string, data: AdminRow) {
  const supabase = createAdminClient();

  const { data: result, error } = await supabase
    .from("projects")
    .insert({ profile_id: profileId, ...data })
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function updateProject(id: string, data: AdminRow) {
  const supabase = createAdminClient();

  const { data: result, error } = await supabase
    .from("projects")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function deleteProject(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw error;
  return true;
}

export async function createSkill(profileId: string, data: AdminRow) {
  const supabase = createAdminClient();

  const { data: result, error } = await supabase
    .from("skills")
    .insert({ profile_id: profileId, ...data })
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function updateSkill(id: string, data: AdminRow) {
  const supabase = createAdminClient();

  const { data: result, error } = await supabase
    .from("skills")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function deleteSkill(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("skills").delete().eq("id", id);

  if (error) throw error;
  return true;
}

// Real-time subscriptions for admin preview
export function subscribeToChanges(
  profileId: string,
  callback: (payload: RealtimePostgresChangesPayload<AdminRow>) => void
) {
  const supabase = createAdminClient();

  return supabase
    .channel(`admin-changes-${profileId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        filter: `profile_id=eq.${profileId}`,
      },
      callback
    )
    .subscribe();
}
