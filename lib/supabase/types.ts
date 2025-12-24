export type EventFormat = "workshop" | "bincang-bincang" | "bootcamp" | "webinar";

export interface Event {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  format: EventFormat;
  description_small: string;
  description: string;
  location: string;
  event_date: string;
  event_time: string;
  url: string | null;
  is_online: boolean;
  is_new: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoreTeam {
  id: string;
  name: string;
  position: string;
  description: string | null;
  instagram: string | null;
  linkedin: string | null;
  avatar_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type EventInsert = Omit<Event, "id" | "created_at" | "updated_at">;
export type EventUpdate = Partial<EventInsert>;

export type CoreTeamInsert = Omit<CoreTeam, "id" | "created_at" | "updated_at">;
export type CoreTeamUpdate = Partial<CoreTeamInsert>;
