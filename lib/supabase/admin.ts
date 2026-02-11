import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with service_role key for admin operations.
 * ONLY use server-side (Server Actions, API Routes).
 * This client bypasses RLS and can create/delete users.
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            "Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local (get it from Supabase Dashboard > Settings > API)"
        );
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
