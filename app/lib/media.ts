import type { SupabaseClient } from "@supabase/supabase-js";
import type { MediaPost } from "@/lib/supabase/types";
import { marked } from "marked";

export interface MediaPostDisplay extends Omit<MediaPost, "content"> {
  content: string;
  tanggal: string;
  read_time: string;
  author?: {
    name: string;
    avatar_url: string | null;
  } | null;
}

/**
 * Safely format a timestamp string into Indonesian format
 */
export function formatPostDate(dateStr: string): string {
  if (!dateStr) return "";
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
 * Estimate reading time for markdown content
 */
export function calculateReadTime(content: string): string {
  if (!content) return "1 mnt baca";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200) || 1;
  return `${minutes} mnt baca`;
}

/**
 * Map a raw database MediaPost row to the MediaPostDisplay format.
 * Parses the markdown content into HTML.
 */
export function mapPostToDisplay(post: any): MediaPostDisplay {
  let parsedContent = post.content || "";
  try {
    parsedContent = marked.parse(post.content || "") as string;
  } catch (e) {
    console.error("Failed to parse post markdown content:", e);
  }

  // Author information comes from nested profiles -> core_team relation
  let authorInfo = null;
  if (post.author) {
    const coreTeamList = post.author.core_team;
    const coreTeamData = Array.isArray(coreTeamList) && coreTeamList.length > 0 ? coreTeamList[0] : null;
    authorInfo = {
      name: coreTeamData?.name || "Admin",
      avatar_url: coreTeamData?.avatar_url || null,
    };
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: parsedContent,
    summary: post.summary || "",
    image_url: post.image_url || null,
    type: post.type,
    status: post.status,
    author_id: post.author_id,
    published_at: post.published_at,
    tanggal: formatPostDate(post.published_at || post.created_at),
    read_time: calculateReadTime(post.content || ""),
    author: authorInfo,
  };
}

/**
 * Fetch all media posts with optional type and status filtering
 */
export async function getAllMediaPosts(
  supabase: SupabaseClient,
  options?: {
    type?: "kabar" | "blog";
    status?: "published" | "draft";
    limit?: number;
  }
): Promise<MediaPostDisplay[]> {
  let query = supabase
    .from("media_posts")
    // Join with profiles and nested core_team to get author details
    .select("*, author:profiles(id, core_team(name, avatar_url))");

  if (options?.type) {
    query = query.eq("type", options.type);
  }
  if (options?.status) {
    query = query.eq("status", options.status);
  }

  query = query.order("published_at", { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching media posts:", error);
    return [];
  }

  return (data || []).map(mapPostToDisplay);
}

/**
 * Fetch a single media post by its slug (only published posts for public view)
 */
export async function getMediaPostBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<MediaPostDisplay | null> {
  const { data, error } = await supabase
    .from("media_posts")
    .select("*, author:profiles(id, core_team(name, avatar_url))")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
  if (!data) return null;

  return mapPostToDisplay(data);
}

/**
 * Fetch a raw media post by ID for dashboard editing
 */
export async function getMediaPostById(
  supabase: SupabaseClient,
  id: string
): Promise<MediaPost | null> {
  const { data, error } = await supabase
    .from("media_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching post by id:", error);
    return null;
  }
  return data as MediaPost | null;
}
