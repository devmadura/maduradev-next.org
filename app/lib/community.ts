import type { SupabaseClient } from "@supabase/supabase-js";
import type { Community } from "@/lib/supabase/types";

export type CommunityWithRegion = Community & {
  communities?: Community[];
};

/**
 * Fetch all active communities ordered by order_index.
 */
export async function getAllCommunities(
  supabase: SupabaseClient
): Promise<Community[]> {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching communities:", error);
    return [];
  }

  return (data as Community[]) ?? [];
}

/**
 * Group communities by region.
 * If multiple communities share the same region, they are grouped together.
 */
export function groupCommunitiesByRegion(
  communities: Community[]
): Record<string, Community[]> {
  return communities.reduce(
    (groups, community) => {
      const region = community.region;
      if (!groups[region]) {
        groups[region] = [];
      }
      groups[region].push(community);
      return groups;
    },
    {} as Record<string, Community[]>
  );
}

/**
 * Regions of Madura Island.
 */
export const MADURA_REGIONS = [
  "Bangkalan",
  "Sampang",
  "Pamekasan",
  "Sumenep",
] as const;

export type MaduraRegion = (typeof MADURA_REGIONS)[number];
