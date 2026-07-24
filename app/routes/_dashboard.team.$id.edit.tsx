import type { Route } from "./+types/_dashboard.team.$id.edit";
import { useLoaderData } from "react-router";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { EditTeamForm } from "@/components/dashboard/edit-team-form";

export const meta: Route.MetaFunction = () => [
  { title: "Edit Anggota - Dashboard MaduraDev" },
];

export async function loader({ request, params }: Route.LoaderArgs) {
  const supabase = createClient(request);
  const { data: member, error } = await supabase
    .from("core_team")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !member) {
    throw new Response("Team member not found", { status: 404 });
  }

  let permissions = { can_manage_events: false, can_manage_media: false };
  if (member.user_id) {
    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from("profiles")
      .select("can_manage_events, can_manage_media")
      .eq("id", member.user_id)
      .maybeSingle();
    if (profile) {
      permissions = {
        can_manage_events: !!profile.can_manage_events,
        can_manage_media: !!profile.can_manage_media,
      };
    }
  }

  return { member, permissions };
}

export async function action({ request, params }: Route.ActionArgs) {
  const supabase = createClient(request);
  const adminClient = createAdminClient();

  // 1. Verify caller is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { success: false, error: "Forbidden: Admin access required" };
  }

  // 2. Parse form data
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const description = formData.get("description") as string;
  const instagram = formData.get("instagram") as string;
  const linkedin = formData.get("linkedin") as string;
  const github = formData.get("github") as string;
  const portfolio = formData.get("portfolio") as string;
  const order_index = parseInt(formData.get("order_index") as string) || 0;
  const is_active = formData.get("is_active") === "true";
  const avatar_url = (formData.get("avatar_url") as string) || null;

  const can_manage_events = formData.get("can_manage_events") === "true";
  const can_manage_media = formData.get("can_manage_media") === "true";

  // 3. Update core_team using adminClient
  const { data: member, error: memberError } = await adminClient
    .from("core_team")
    .update({
      name,
      position,
      description,
      instagram,
      linkedin,
      github,
      portfolio,
      order_index,
      is_active,
      avatar_url,
    })
    .eq("id", params.id)
    .select("user_id")
    .single();

  if (memberError) {
    return { success: false, error: memberError.message };
  }

  // 4. Update profiles if linked user_id exists
  if (member?.user_id) {
    const { error: profileError } = await adminClient
      .from("profiles")
      .update({
        can_manage_events,
        can_manage_media,
      })
      .eq("id", member.user_id);

    if (profileError) {
      return {
        success: false,
        error: "Gagal memperbarui hak akses: " + profileError.message,
      };
    }
  }

  return { success: true };
}

export default function EditTeamPage() {
  const { member, permissions } = useLoaderData<typeof loader>();
  return <EditTeamForm member={member} initialPermissions={permissions} />;
}
