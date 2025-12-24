import TeamClient from "./TeamClient";
import type { Metadata } from "next";
import { getActiveTeamMembers } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Core Teams",
  description: "core team MaduraDev",
};

export default async function Team() {
  const members = await getActiveTeamMembers();
  return <TeamClient members={members} />;
}
