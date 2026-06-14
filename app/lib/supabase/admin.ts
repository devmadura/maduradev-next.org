import { createClient } from "@supabase/supabase-js";

/**
 * Admin client using service role key.
 * Bypasses Row Level Security (RLS).
 * MUST only be used server-side (in loaders/actions).
 */
export function createAdminClient() {
  const url = process.env.VITE_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_ROLE_KEY!;

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
