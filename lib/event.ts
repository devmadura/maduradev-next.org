import { getEventBySlug, getPublishedEvents } from "@/lib/supabase/queries";
import type { Event } from "@/lib/supabase/types";

export type EventDisplay = {
  id: string;
  image: string;
  url: string;
  online: boolean;
  new: boolean;
  title: string;
  slug: string;
  format: "workshop" | "bincang-bincang" | "bootcamp" | "webinar";
  description_small: string;
  description: string;
  location: string;
  tanggal: string;
  waktu: string;
};

function mapEventToDisplay(event: Event): EventDisplay {
  return {
    id: event.id,
    image: event.image_url || "/events/placeholder.png",
    url: event.url || "#",
    online: event.is_online,
    new: event.is_new,
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

export async function getEvent(slug: string): Promise<EventDisplay | null> {
  const event = await getEventBySlug(slug);
  if (!event) return null;
  return mapEventToDisplay(event);
}

export async function getAllEvents(): Promise<EventDisplay[]> {
  const events = await getPublishedEvents();
  return events.map(mapEventToDisplay);
}
