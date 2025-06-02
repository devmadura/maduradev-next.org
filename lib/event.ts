import { events, eventType } from "@/components/event/utils/events";

// event detail
export async function getEvent(slug: string): Promise<eventType | null> {
  const found = events.find((e) => e.slug === slug);
  return found ?? null;
}
