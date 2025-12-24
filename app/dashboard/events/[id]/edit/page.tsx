import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EditEventForm } from "@/components/dashboard/edit-event-form";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

async function getEvent(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  return <EditEventForm event={event} />;
}
