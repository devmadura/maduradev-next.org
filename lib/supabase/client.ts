import { createBrowserClient, type SupabaseClient } from "@supabase/ssr";

let client: SupabaseClient | null = null;

export function createClient() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Return a mock client during build time
    if (typeof window === "undefined") {
      return null as unknown as SupabaseClient;
    }
    throw new Error("Supabase URL and Key are required. Please check your environment variables.");
  }

  client = createBrowserClient(supabaseUrl, supabaseKey);
  return client;
}
