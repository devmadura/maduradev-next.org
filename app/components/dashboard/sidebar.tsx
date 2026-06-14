import { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate, useRouteLoaderData } from "react-router";
import {
  Calendar,
  Settings,
  Users,
  LogOut,
  UserCircle,
  ChevronLeft,
  MapPin,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarContext,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";
import ImageLogo from "../shared/logo-image";
import type { UserRole } from "@/lib/supabase/types";

const adminMenuItems = [
  { title: "Events", url: "/dashboard/events", icon: Calendar },
  { title: "Core Team", url: "/dashboard/team", icon: Users },
  { title: "Communities", url: "/dashboard/communities", icon: MapPin },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const coreTeamMenuItems = [
  { title: "My Profile", url: "/dashboard/profile", icon: UserCircle },
];

export function DashboardSidebar() {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { open, setOpen, isMobile } = useContext(SidebarContext);

  // Get role from parent layout loader data (server-side, no flash)
  const loaderData = useRouteLoaderData("routes/_dashboard") as
    | { profile: { role: UserRole } }
    | undefined;
  const role = loaderData?.profile?.role ?? "core_team";

  // Close sidebar on mobile after navigation
  useEffect(() => {
    if (isMobile && open) {
      setOpen(false);
    }
  }, [pathname]);

  const menuItems = role === "admin" ? adminMenuItems : coreTeamMenuItems;

  const handleLogout = async () => {
    const client = createClient();
    if (client) await client.auth.signOut();
    navigate("/login");
  };

  return (
    <Sidebar>
      {/* Logo Header */}
      <SidebarHeader className="border-b border-sidebar-border">
        {open ? (
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
              <ImageLogo />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm truncate">MaduraDev</span>
              <span className="text-[11px] text-muted-foreground truncate">
                {role === "admin" ? "Admin Dashboard" : "Core Team"}
              </span>
            </div>
            {isMobile && (
              <button
                onClick={() => setOpen(false)}
                className="ml-auto p-1 rounded-md hover:bg-sidebar-accent transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg mx-auto">
            <ImageLogo />
          </div>
        )}
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon
                          className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`}
                        />
                        {open && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
              <LogOut className="h-4 w-4 shrink-0 text-destructive" />
              {open && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
