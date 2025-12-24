import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EditTeamForm } from "@/components/dashboard/edit-team-form";

interface EditTeamPageProps {
  params: Promise<{ id: string }>;
}

async function getTeamMember(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("core_team")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function EditTeamPage({ params }: EditTeamPageProps) {
  const { id } = await params;
  const member = await getTeamMember(id);

  if (!member) {
    notFound();
  }

  return <EditTeamForm member={member} />;
}
