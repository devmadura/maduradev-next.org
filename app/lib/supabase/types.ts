export type UserRole = "admin" | "core_team";

export type EventFormat = "webinar" | "workshop" | "bootcamp" | "bincang-bincang";

export interface UserProfile {
  id: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

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
  created_at?: string;
  updated_at?: string;
}

export interface CoreTeam {
  id: string;
  name: string;
  position: string;
  description: string | null;
  avatar_url: string | null;
  instagram: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  order_index: number;
  is_active: boolean;
  user_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  instagram: string | null;
  logo_url: string | null;
  latitude: number;
  longitude: number;
  region: string;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
