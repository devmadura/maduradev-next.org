import type { Route } from "./+types/_dashboard.events.$id.edit";
import { useLoaderData } from "react-router";
import { createClient } from "@/lib/supabase/server";
import { EditEventForm } from "@/components/dashboard/edit-event-form";

export const meta: Route.MetaFunction = () => [
  { title: "Edit Event - Dashboard MaduraDev" },
];

export async function loader({ request, params }: Route.LoaderArgs) {
  const supabase = createClient(request);
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    throw new Response("Event not found", { status: 404 });
  }

  return { event: data };
}

export default function EditEventPage() {
  const { event } = useLoaderData<typeof loader>();
  return <EditEventForm event={event} />;
}
