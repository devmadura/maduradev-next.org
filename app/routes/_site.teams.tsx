import type { Route } from "./+types/_site.teams";
import TeamClient from "@/components/teams/TeamClient";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlaceholderAvatarUrl } from "@/lib/placeholder";

export const meta = () => [
  { title: "Core Team - MaduraDev" },
  { name: "description", content: "Tim inti MaduraDev: para developer dan kontributor aktif yang membangun komunitas developer di Pulau Madura." },
  { name: "keywords", content: "core team maduradev, tim developer madura, kontributor maduradev, anggota komunitas madura" },
  { property: "og:title", content: "Core Team - MaduraDev" },
  { property: "og:description", content: "Kenali tim inti di balik komunitas developer MaduraDev." },
  { property: "og:image", content: "/image.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
];

export async function loader({ request }: Route.LoaderArgs) {
  const adminClient = createAdminClient();

  const { data: members, error } = await adminClient
    .from("core_team")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error || !members) {
    console.error("Error fetching team:", error);
    return { members: [] };
  }

  // Map members to include placeholder avatar if no avatar_url
  const mappedMembers = members.map((m: any) => ({
    id: m.id,
    name: m.name,
    position: m.position,
    description: m.description,
    avatar_url: m.avatar_url || getPlaceholderAvatarUrl(m.name),
    linkedin: m.linkedin || "",
    github: m.github || "",
    instagram: m.instagram || "",
    portfolio: m.portfolio || "",
  }));

  return { members: mappedMembers };
}

export default function TeamsPage({ loaderData }: Route.ComponentProps) {
  const { members } = loaderData;

  return (
    <div className="pt-20">
      <TeamClient members={members} />
    </div>
  );
}
