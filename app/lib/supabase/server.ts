import { createServerClient } from "@supabase/ssr";

export function createClient(request: Request) {
  const url = process.env.VITE_SUPABASE_URL!;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY!;

  const cookies = parseCookies(request.headers.get("Cookie") || "");

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return Object.entries(cookies).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        // In loader/action context, we can't set response headers directly
        // This is handled by createClientWithResponse for mutations
      },
    },
  });
}

/**
 * Creates a Supabase client that returns cookie headers for the response.
 * Use this in action routes that modify auth state (login, logout, etc).
 */
export function createClientWithResponse(request: Request) {
  const url = process.env.VITE_SUPABASE_URL!;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY!;

  const cookies = parseCookies(request.headers.get("Cookie") || "");
  const responseCookies: string[] = [];

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return Object.entries(cookies).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          const parts = [`${name}=${value}`];
          if (options?.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
          if (options?.path) parts.push(`Path=${options.path}`);
          if (options?.domain) parts.push(`Domain=${options.domain}`);
          if (options?.httpOnly) parts.push("HttpOnly");
          if (options?.secure) parts.push("Secure");
          if (options?.sameSite) parts.push(`SameSite=${options.sameSite}`);
          responseCookies.push(parts.join("; "));
        }
      },
    },
  });

  return {
    supabase,
    getCookieHeaders: () => responseCookies,
  };
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  for (const pair of cookieHeader.split(";")) {
    const [key, ...val] = pair.trim().split("=");
    if (key) cookies[key] = val.join("=");
  }
  return cookies;
}
