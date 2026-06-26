import { redirect } from "react-router";
import type { Route } from "./+types/_dashboard";
import { Outlet } from "react-router";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const adminOnlyPaths = [
  "/dashboard/events",
  "/dashboard/team",
  "/dashboard/settings",
  "/dashboard/custom-domains",
];

export const meta: Route.MetaFunction = () => [
  { title: "Dashboard - MaduraDev" },
];

export async function loader({ request }: Route.LoaderArgs) {
  const supabase = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect("/login");
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    throw redirect("/login");
  }

  const url = new URL(request.url);

  if (profile.role === "core_team") {
    const isAdminOnly = adminOnlyPaths.some((path) =>
      url.pathname.startsWith(path)
    );
    const isOverview = url.pathname === "/dashboard";

    if (isAdminOnly || isOverview) {
      throw redirect("/dashboard/profile");
    }
  }

  return { user, profile };
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
            border: "1px solid hsl(var(--border))",
          },
        }}
      />
    </SidebarProvider>
  );
}
