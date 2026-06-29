import type { SupabaseClient } from "@supabase/supabase-js";
import type { Event } from "@/lib/supabase/types";
import { marked } from "marked";

const hashtagExtension = {
  name: "hashtag",
  level: "inline" as const,
  start(src: string) {
    return src.indexOf("#");
  },
  tokenizer(src: string) {
    const rule = /^#(?=[a-zA-Z0-9_]*[a-zA-Z])[a-zA-Z0-9_]+/;
    const match = rule.exec(src);
    if (match) {
      const raw = match[0];
      const text = raw.slice(1);
      
      // Skip hex colors
      const isHexColor = /^[0-9a-fA-F]{3}$/.test(text) || 
                         /^[0-9a-fA-F]{6}$/.test(text) || 
                         /^[0-9a-fA-F]{8}$/.test(text);
      if (isHexColor) {
        return;
      }
      
      return {
        type: "hashtag",
        raw,
        text,
      };
    }
  },
  renderer(token: any) {
    return `<span class="text-blue-600 dark:text-blue-400 font-medium hover:underline">#${token.text}</span>`;
  },
};

marked.use({ extensions: [hashtagExtension] });


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
  rsvp_enabled: boolean;
  max_attendees: number | null;
  type: "internal" | "partner" | null;
  event_date: string;
  event_time: string;
  price: number | null;
}

/**
 * Helper to format a YYYY-MM-DD date string safely into Indonesian format
 * without timezone shift, falling back to original string if not match.
 */
export function formatEventDate(dateStr: string): string {
  if (!dateStr) return "";

  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const year = parseInt(match[1]);
    const month = parseInt(match[2]) - 1; // 0-indexed month
    const day = parseInt(match[3]);
    const date = new Date(year, month, day);

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return dateStr;
  }

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Helper to format standard time picker HH:MM to include timezone suffix
 */
export function formatEventTime(timeStr: string): string {
  if (!timeStr) return "";
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    return `${timeStr} WIB`;
  }
  return timeStr;
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
 * Check if an event should be considered "upcoming" (Mendatang).
 * An event is upcoming only if its date+time is strictly in the future.
 * - If the event date is today but the time has already passed → Selesai
 * - If the event date is today but no time provided → Selesai (treat as past)
 * - If the event date is a future date → Mendatang
 *
 * @param eventDate  YYYY-MM-DD string from database
 * @param eventTime  HH:MM string from database (optional)
 */
export function isEventNew(eventDate: string, eventTime?: string): boolean {
  if (!eventDate) return false;

  const dateMatch = eventDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateMatch) {
    const year  = parseInt(dateMatch[1]);
    const month = parseInt(dateMatch[2]) - 1; // 0-indexed
    const day   = parseInt(dateMatch[3]);

    // Parse event time if provided (HH:MM), default to 00:00 (start of day)
    let hours   = 0;
    let minutes = 0;
    if (eventTime) {
      const timeMatch = eventTime.match(/^(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        hours   = parseInt(timeMatch[1]);
        minutes = parseInt(timeMatch[2]);
      }
    }

    const eventDateTime = new Date(year, month, day, hours, minutes, 0);
    return eventDateTime > new Date();
  }

  // Fallback: try parsing as ISO / generic date string
  const date = new Date(eventDate);
  if (!isNaN(date.getTime())) {
    return date > new Date();
  }
  return false;
}

/**
 * Map a database Event row to the EventDisplay format used by components.
 */
export function mapEventToDisplay(event: Event): EventDisplay {
  let parsedDescription = event.description || "";
  let parsedLocation = event.location || "";

  try {
    parsedDescription = marked.parse(event.description || "") as string;
  } catch (e) {
    console.error("Failed to parse description markdown:", e);
  }

  try {
    parsedLocation = marked.parse(event.location || "") as string;
  } catch (e) {
    console.error("Failed to parse location markdown:", e);
  }

  return {
    id: event.id,
    image: event.image_url || "",
    url: event.url || "#",
    online: event.is_online,
    title: event.title,
    slug: event.slug,
    format: event.format,
    description_small: event.description_small,
    description: parsedDescription,
    location: parsedLocation,
    tanggal: formatEventDate(event.event_date),
    waktu: formatEventTime(event.event_time),
    rsvp_enabled: event.rsvp_enabled || false,
    max_attendees: event.max_attendees,
    type: event.type,
    event_date: event.event_date,
    event_time: event.event_time || "",
    price: event.price,
  };
}

