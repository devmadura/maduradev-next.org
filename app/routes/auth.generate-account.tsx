import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function generatePassword(length: number = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function generateEmail(name: string): string {
  const words = name
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !w.endsWith("."));

  const username = words[0] || name.toLowerCase().replace(/[^a-z]/g, "");
  return `${username}@madura.dev`;
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const teamMemberId = formData.get("teamMemberId") as string;

  if (!teamMemberId) {
    return { success: false, error: "Team member ID is required" };
  }

  try {
    const supabase = createClient(request);
    const adminClient = createAdminClient();

    // 1. Check if caller is admin
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
      return { success: false, error: "Only admins can generate accounts" };
    }

    // 2. Get core team member
    const { data: member, error: memberError } = await supabase
      .from("core_team")
      .select("*")
      .eq("id", teamMemberId)
      .single();

    if (memberError || !member) {
      return { success: false, error: "Team member not found" };
    }

    if (member.user_id) {
      return { success: false, error: "Member already has an account" };
    }

    // 3. Generate credentials
    const email = generateEmail(member.name);
    const password = generatePassword(8);

    // 4. Check if email already exists
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const emailExists = existingUsers?.users?.some((u) => u.email === email);
    if (emailExists) {
      return {
        success: false,
        error: `Email ${email} sudah digunakan. Hubungi developer untuk solusi.`,
      };
    }

    // 5. Create auth user
    const { data: newUser, error: createError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (createError || !newUser.user) {
      return {
        success: false,
        error: createError?.message || "Failed to create user",
      };
    }

    // 6. Create profile
    const { error: profileError } = await adminClient.from("profiles").insert({
      id: newUser.user.id,
      role: "core_team",
    });

    if (profileError) {
      await adminClient.auth.admin.deleteUser(newUser.user.id);
      return {
        success: false,
        error: `Failed to create profile: ${profileError.message}`,
      };
    }

    // 7. Update core_team with user_id
    const { error: updateError } = await adminClient
      .from("core_team")
      .update({ user_id: newUser.user.id })
      .eq("id", teamMemberId);

    if (updateError) {
      await adminClient.from("profiles").delete().eq("id", newUser.user.id);
      await adminClient.auth.admin.deleteUser(newUser.user.id);
      return {
        success: false,
        error: `Failed to link account: ${updateError.message}`,
      };
    }

    return { success: true, email, password };
  } catch (error) {
    console.error("generateCoreTeamAccount error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function loader() {
  return { success: false, error: "Use POST method" };
}
