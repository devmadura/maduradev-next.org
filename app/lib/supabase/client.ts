import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";

let clientInstance: ReturnType<typeof createSupabaseBrowserClient> | null = null;

export function createClient() {
  if (clientInstance) return clientInstance;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn("Supabase env variables missing");
    return null;
  }

  clientInstance = createSupabaseBrowserClient(url, anonKey);
  return clientInstance;
}
