import { createClient } from "./server";
import type { Event, CoreTeam } from "./types";

// Events queries
export async function getPublishedEvents(): Promise<Event[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }
  return data || [];
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    console.error("Error fetching event:", error);
    return null;
  }
  return data;
}

// Core Team queries
export async function getActiveTeamMembers(): Promise<CoreTeam[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("core_team")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching team:", error);
    return [];
  }
  return data || [];
}
