import type { Route } from "./+types/ticket.$token";
import { Link } from "react-router";
import { useLoaderData } from "react-router";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatEventDate, formatEventTime } from "@/lib/event";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  User,
  Building2,
  ArrowLeft,
  Globe,
} from "lucide-react";

export const meta: Route.MetaFunction = ({ data }) => [
  {
    title: data?.event
      ? `Tiket - ${data.event.title} | MaduraDev`
      : "Tiket Event - MaduraDev",
  },
  { name: "robots", content: "noindex" },
];

export async function loader({ params }: Route.LoaderArgs) {
  const token = params.token;

  if (!token) {
    throw new Response("Token tidak ditemukan", { status: 400 });
  }

  const adminClient = createAdminClient();

  // Fetch registration by token
  const { data: registration, error } = await adminClient
    .from("event_registrations")
    .select("*")
    .eq("checkin_token", token)
    .single();

  if (error || !registration) {
    throw new Response("Tiket tidak ditemukan atau tidak valid.", { status: 404 });
  }

  // Fetch event detail
  const { data: event, error: eventError } = await adminClient
    .from("events")
    .select("*")
    .eq("id", registration.event_id)
    .single();

  if (eventError || !event) {
    throw new Response("Event tidak ditemukan.", { status: 404 });
  }

  return {
    registration,
    event,
    token,
    isCheckedIn: !!registration.checked_in_at,
    checkedInAt: registration.checked_in_at as string | null,
  };
}

export default function TicketPage() {
  const { registration, event, token, isCheckedIn, checkedInAt } =
    useLoaderData<typeof loader>();

  const qrValue = token;
  // Use QR Server API to generate QR (no npm package needed)
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(qrValue)}&format=svg&margin=12&color=0-0-0&bgcolor=255-255-255&ecc=M`;

  const formattedCheckinTime = checkedInAt
    ? new Date(checkedInAt).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
    : null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 pointer-events-none" />
      <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Back link */}
      <div className="relative z-10 w-full max-w-sm mb-4">
        <Link
          to={`/events/${event.slug}`}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Event
        </Link>
      </div>

      {/* Ticket Card */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Status banner */}
        {isCheckedIn ? (
          <div className="flex items-center justify-center gap-2 bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-t-2xl">
            <CheckCircle2 className="w-4 h-4" />
            SUDAH HADIR · {formattedCheckinTime}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 bg-primary text-primary-foreground text-xs font-bold px-4 py-2.5 rounded-t-2xl">
            <Circle className="w-4 h-4" />
            BELUM CHECK-IN · Tunjukkan QR ke panitia
          </div>
        )}

        {/* Main card */}
        <div className="bg-card border border-border/60 border-t-0 rounded-b-2xl shadow-2xl overflow-hidden">

          {/* Event info */}
          <div className="px-6 pt-6 pb-4 border-b border-dashed border-border/40">
            <p className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1">
              MaduraDev Event
            </p>
            <h1 className="text-lg font-black text-foreground leading-tight mb-3">
              {event.title}
            </h1>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-primary/70 flex-shrink-0" />
                <span>{formatEventDate(event.event_date)}</span>
              </div>
              {event.event_time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-primary/70 flex-shrink-0" />
                  <span>{formatEventTime(event.event_time)}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  {event.is_online ? (
                    <Globe className="w-3.5 h-3.5 text-primary/70 flex-shrink-0" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-primary/70 flex-shrink-0" />
                  )}
                  <span className="line-clamp-1">{event.location.replace(/<[^>]*>/g, "").substring(0, 60)}</span>
                </div>
              )}
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center px-6 py-6 bg-white dark:bg-muted/20">
            <div
              className={`p-3 rounded-2xl border-2 shadow-sm ${isCheckedIn
                  ? "border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/20"
                  : "border-primary/20 bg-white dark:bg-muted/10"
                }`}
            >
              <img
                src={qrImageUrl}
                alt="QR Code Tiket"
                width={200}
                height={200}
                className="rounded-xl block"
                loading="eager"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 text-center font-mono break-all max-w-[200px]">
              {token}
            </p>
          </div>

          {/* Tear line */}
          <div className="relative px-4">
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border border-border/30" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border border-border/30" />
            <div className="border-t border-dashed border-border/50 my-0" />
          </div>

          {/* Participant info */}
          <div className="px-6 py-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Peserta
                </p>
                <p className="text-sm font-bold text-foreground">
                  {registration.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Instansi
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {registration.institution}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-border/30">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
                  Kabupaten
                </p>
                <p className="font-semibold text-foreground">
                  {registration.kabupaten}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
                  Status
                </p>
                <p
                  className={`font-bold ${isCheckedIn ? "text-emerald-500" : "text-amber-500"
                    }`}
                >
                  {isCheckedIn ? "✅ Hadir" : "⏳ Terdaftar"}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-5">
            <div className="bg-muted/40 rounded-xl px-4 py-3 text-center">
              <p className="text-[10px] text-muted-foreground font-medium">
                Tunjukkan QR Code ini kepada panitia saat registrasi di lokasi event.
                Jangan bagikan ke orang lain.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom branding */}
        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            madura.dev · {new Date().getFullYear()}
          </Link>
        </div>
      </div>
    </div>
  );
}
