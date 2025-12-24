import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Users, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusCards } from "@/components/dashboard/status-cards";

async function getStats() {
  const supabase = await createClient();

  const [eventsResult, teamResult] = await Promise.all([
    supabase.from("events").select("*", { count: "exact" }),
    supabase.from("core_team").select("*", { count: "exact" }),
  ]);

  const publishedEvents =
    eventsResult.data?.filter((e) => e.is_published).length || 0;

  return {
    totalEvents: eventsResult.count || 0,
    publishedEvents,
    totalTeam: teamResult.count || 0,
    activeTeam: teamResult.data?.filter((t) => t.is_active).length || 0,
  };
}

async function getRecentEvents() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);
  return data || [];
}

export default async function DashboardPage() {
  const stats = await getStats();
  const recentEvents = await getRecentEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang di Dashboard Admin MaduraDev
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedEvents} published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Core Team</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeam}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeTeam} active members
            </p>
          </CardContent>
        </Card>
        <StatusCards />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Terbaru</CardTitle>
            <CardDescription>
              {recentEvents.length} event terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada event. Data event masih kosong di database.
              </p>
            ) : (
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.event_date}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        event.is_published
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {event.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Aksi cepat untuk mengelola konten</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start">
              <Link href="/dashboard/events/create">
                <Calendar className="mr-2 h-4 w-4" />
                Tambah Event Baru
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/team/create">
                <Users className="mr-2 h-4 w-4" />
                Tambah Anggota Team
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/" target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Lihat Website
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
