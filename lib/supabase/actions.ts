"use server";

import { createAdminClient } from "./admin";
import { createClient } from "./server";
import { revalidatePath } from "next/cache";

/**
 * Generate a random password with the specified length.
 * Uses mix of uppercase, lowercase, and numbers.
 */
function generatePassword(length: number = 8): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

/**
 * Generate a clean email from a name.
 * "Moh. Abroril Huda" → "abroril@maduradev.org"
 * Uses first "real" name word (skips titles/initials like "Moh.", "M.")
 */
function generateEmail(name: string): string {
    const words = name
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 2 && !w.endsWith("."));

    const username = words[0] || name.toLowerCase().replace(/[^a-z]/g, "");
    return `${username}@madura.dev`;
}

interface GenerateAccountResult {
    success: boolean;
    email?: string;
    password?: string;
    error?: string;
}

/**
 * Server Action: Generate a login account for a core team member.
 * Creates auth user with email@maduradev.org + random password,
 * then links the auth user to the core_team record.
 */
export async function generateCoreTeamAccount(
    teamMemberId: string
): Promise<GenerateAccountResult> {
    try {
        const supabase = await createClient();
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
        const { data: existingUsers } =
            await adminClient.auth.admin.listUsers();
        const emailExists = existingUsers?.users?.some(
            (u) => u.email === email
        );
        if (emailExists) {
            return {
                success: false,
                error: `Email ${email} sudah digunakan. Hubungi developer untuk solusi.`,
            };
        }

        // 5. Create auth user (with autoConfirm to skip email verification)
        const { data: newUser, error: createError } =
            await adminClient.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
            });

        if (createError || !newUser.user) {
            console.error("Create user error:", createError);
            return {
                success: false,
                error: createError?.message || "Failed to create user",
            };
        }

        // 6. Manually create profile (bypass trigger issues)
        const { error: profileError } = await adminClient
            .from("profiles")
            .insert({
                id: newUser.user.id,
                role: "core_team",
            });

        if (profileError) {
            console.error("Profile creation error:", profileError);
            // Rollback: delete the created auth user
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
            console.error("Update core_team error:", updateError);
            // Rollback: delete profile and auth user
            await adminClient.from("profiles").delete().eq("id", newUser.user.id);
            await adminClient.auth.admin.deleteUser(newUser.user.id);
            return {
                success: false,
                error: `Failed to link account: ${updateError.message}`,
            };
        }

        // Note: We don't revalidatePath here to avoid closing the dialog
        // The page will refresh when user navigates or manually refreshes

        return {
            success: true,
            email,
            password,
        };
    } catch (error) {
        console.error("generateCoreTeamAccount error:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}

/**
 * Server Action: Get the current user's profile (role).
 */
export async function getCurrentUserProfile() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Use admin client to bypass RLS for profile fetch
    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return profile;
}

/**
 * Server Action: Get the core team member linked to the current user.
 */
export async function getCurrentUserTeamMember() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const adminClient = createAdminClient();
    const { data: member } = await adminClient
        .from("core_team")
        .select("*")
        .eq("user_id", user.id)
        .single();

    return member;
}

/**
 * Server Action: Update the current user's team profile.
 */
export async function updateOwnTeamProfile(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const adminClient = createAdminClient();

    // Get current member
    const { data: member } = await adminClient
        .from("core_team")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
        return { success: false, error: "Team profile not found" };
    }

    const updates: any = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        instagram: formData.get("instagram") as string,
        linkedin: formData.get("linkedin") as string,
        github: formData.get("github") as string,
        portfolio: formData.get("portfolio") as string,
    };
    
    if (formData.has("avatar_url")) {
        updates.avatar_url = formData.get("avatar_url") as string;
    }

    const { error } = await adminClient
        .from("core_team")
        .update(updates)
        .eq("id", member.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/profile");
    return { success: true };
}

/**
 * Server Action: Change the current user's password.
 */
export async function changePassword(newPassword: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
