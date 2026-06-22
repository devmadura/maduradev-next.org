import type { Route } from "./+types/_site.teams.$slug";
import TeamDetailClient from "@/components/teams/TeamDetailClient";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlaceholderAvatarUrl } from "@/lib/placeholder";

export const meta = ({ data }: Route.MetaArgs) => {
  const member = data?.member;
  return [
    { title: member ? `${member.name} - Core Team MaduraDev` : "Team - MaduraDev" },
    {
      name: "description",
      content: member
        ? `${member.name} - ${member.position} di MaduraDev. ${member.description || ""}`
        : "Profil anggota tim inti MaduraDev.",
    },
    { property: "og:title", content: member ? `${member.name} - MaduraDev` : "Team - MaduraDev" },
    { property: "og:image", content: member?.avatar_url || "/image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
};

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function loader({ params }: Route.LoaderArgs) {
  const adminClient = createAdminClient();
  const slug = params.slug;

  const { data: members, error } = await adminClient
    .from("core_team")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error || !members) {
    throw new Response("Not Found", { status: 404 });
  }

  const member = members.find((m: any) => nameToSlug(m.name) === slug);

  if (!member) {
    throw new Response("Not Found", { status: 404 });
  }

  // Find prev/next members
  const currentIndex = members.findIndex((m: any) => m.id === member.id);
  const prevMember = currentIndex > 0
    ? { name: members[currentIndex - 1].name, slug: nameToSlug(members[currentIndex - 1].name) }
    : null;
  const nextMember = currentIndex < members.length - 1
    ? { name: members[currentIndex + 1].name, slug: nameToSlug(members[currentIndex + 1].name) }
    : null;

  return {
    member: {
      id: member.id,
      name: member.name,
      position: member.position,
      description: member.description,
      avatar_url: member.avatar_url || getPlaceholderAvatarUrl(member.name),
      linkedin: member.linkedin || "",
      github: member.github || "",
      instagram: member.instagram || "",
      portfolio: member.portfolio || "",
    },
    prevMember,
    nextMember,
  };
}

export default function TeamDetailPage({ loaderData }: Route.ComponentProps) {
  const { member, prevMember, nextMember } = loaderData;

  return (
    <div className="pt-5">
      <TeamDetailClient member={member} prevMember={prevMember} nextMember={nextMember} />
    </div>
  );
}
