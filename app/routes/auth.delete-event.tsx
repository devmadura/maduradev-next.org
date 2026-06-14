import { redirect } from "react-router";
import { createClient } from "@/lib/supabase/server";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const id = formData.get("id") as string;

  if (!id) {
    return { success: false, error: "ID is required" };
  }

  const supabase = createClient(request);
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return redirect("/dashboard/events");
}

export async function loader() {
  throw redirect("/dashboard/events");
}
