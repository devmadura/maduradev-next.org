import type { Route } from "./+types/_dashboard.team.$id.edit";
import { useLoaderData } from "react-router";
import { createClient } from "@/lib/supabase/server";
import { EditTeamForm } from "@/components/dashboard/edit-team-form";

export const meta: Route.MetaFunction = () => [
  { title: "Edit Anggota - Dashboard MaduraDev" },
];

export async function loader({ request, params }: Route.LoaderArgs) {
  const supabase = createClient(request);
  const { data, error } = await supabase
    .from("core_team")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    throw new Response("Team member not found", { status: 404 });
  }

  return { member: data };
}

export default function EditTeamPage() {
  const { member } = useLoaderData<typeof loader>();
  return <EditTeamForm member={member} />;
}
