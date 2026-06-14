import type { SupabaseClient } from "@supabase/supabase-js";
import type { Event } from "@/lib/supabase/types";

/** Display-friendly event type used in list/detail components */
export interface EventDisplay {
  id: string;
  image: string;
  url: string;
  online: boolean;
  title: string;
  slug: string;
  format: string;
  description_small: string;
  description: string;
  location: string;
  tanggal: string;
  waktu: string;
}

/**
 * Fetch all published events, ordered by event_date descending.
 */
export async function getAllEvents(
  supabase: SupabaseClient,
): Promise<EventDisplay[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data.map(mapEventToDisplay);
}

/**
 * Fetch a single published event by slug.
 */
export async function getEvent(
  supabase: SupabaseClient,
  slug: string,
): Promise<EventDisplay | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) return null;
  return mapEventToDisplay(data);
}

/**
 * Check if an event should be considered "new" / upcoming.
 * Uses the is_new field from database, or checks if event_date is in the future.
 */
export function isEventNew(eventDate: string): boolean {
  // Try parsing the date string
  const date = new Date(eventDate);
  if (!isNaN(date.getTime())) {
    return date >= new Date();
  }
  // If date can't be parsed, return false (conservative)
  return false;
}

/**
 * Map a database Event row to the EventDisplay format used by components.
 */
function mapEventToDisplay(event: Event): EventDisplay {
  return {
    id: event.id,
    image: event.image_url || "",
    url: event.url || "#",
    online: event.is_online,
    title: event.title,
    slug: event.slug,
    format: event.format,
    description_small: event.description_small,
    description: event.description,
    location: event.location,
    tanggal: event.event_date,
    waktu: event.event_time,
  };
}
