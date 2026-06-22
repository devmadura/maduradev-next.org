import { redirect } from "react-router";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const id = formData.get("id") as string;

  if (!id) {
    return { success: false, error: "ID is required" };
  }

  const supabase = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Please log in." };
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { success: false, error: "Forbidden: Admin access required." };
  }

  // 1. Get the community's logo_url to delete it from storage
  const { data: communityData } = await adminClient
    .from("communities")
    .select("logo_url")
    .eq("id", id)
    .single();

  if (communityData?.logo_url) {
    try {
      const url = new URL(communityData.logo_url);
      const pathParts = url.pathname.split("/storage/v1/object/public/");
      if (pathParts.length > 1) {
        const [bucketName, ...filePath] = pathParts[1].split("/");
        await adminClient.storage.from(bucketName).remove([filePath.join("/")]);
      }
    } catch (e) {
      console.error("Gagal menghapus logo dari storage:", e);
    }
  }

  // 2. Delete the record from communities table
  const { error } = await adminClient.from("communities").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function loader() {
  throw redirect("/dashboard/communities");
}

