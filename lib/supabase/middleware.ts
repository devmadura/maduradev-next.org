import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that only admins can access
const adminOnlyPaths = [
  "/dashboard/events",
  "/dashboard/team",
  "/dashboard/settings",
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes - redirect to login if not authenticated
  if (
    !user &&
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Role-based access control for dashboard
  if (user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;

    // Core team trying to access admin-only pages → redirect to profile
    if (role === "core_team") {
      const isAdminOnly = adminOnlyPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
      );
      // Also redirect /dashboard exact (overview) for core_team
      const isOverview = request.nextUrl.pathname === "/dashboard";

      if (isAdminOnly || isOverview) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard/profile";
        return NextResponse.redirect(url);
      }
    }
  }

  // Redirect logged in users away from login
  if (user && request.nextUrl.pathname === "/login") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();
    url.pathname =
      profile?.role === "admin" ? "/dashboard" : "/dashboard/profile";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

