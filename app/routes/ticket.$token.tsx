import type { Route } from "./+types/ticket.$token";
import { Link } from "react-router";
import { useLoaderData } from "react-router";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatEventDate, formatEventTime, mapEventToDisplay } from "@/lib/event";
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
  AlertCircle,
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
  const { data: eventData, error: eventError } = await adminClient
    .from("events")
    .select("*")
    .eq("id", registration.event_id)
    .single();

  if (eventError || !eventData) {
    throw new Response("Event tidak ditemukan.", { status: 404 });
  }

  const event = mapEventToDisplay(eventData);

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  let isExpired = registration.status === "pending_payment" && registration.registered_at <= fiveMinutesAgo;

  // Real-time fallback check: if status is pending and not expired, query Pakasir API directly
  if (registration.status === "pending_payment" && !isExpired && event.price) {
    const projectSlug = process.env.PAKASIR_PROJECT_SLUG || "";
    const apiKey = process.env.PAKASIR_API_KEY || "";
    
    if (projectSlug && apiKey) {
      try {
        const verifyUrl = `https://app.pakasir.com/api/transactiondetail?project=${projectSlug}&amount=${event.price}&order_id=${registration.id}&api_key=${apiKey}`;
        const verifyRes = await fetch(verifyUrl);
        if (verifyRes.ok) {
          const verifyData = await verifyRes.json();
          const transaction = verifyData.transaction;
          if (transaction && transaction.status === "completed") {
            // Update to confirmed in database
            await adminClient
              .from("event_registrations")
              .update({ status: "confirmed" })
              .eq("id", registration.id);
              
            registration.status = "confirmed";
            isExpired = false;
          }
        }
      } catch (err) {
        console.error("Failed to query Pakasir API during fallback check:", err);
      }
    }
  }

  let paymentUrl = null;
  if (registration.status === "pending_payment" && !isExpired && event.price) {
    const projectSlug = process.env.PAKASIR_PROJECT_SLUG || "";
    const baseUrl = process.env.VITE_URL_APP || "localhost:5173";
    const protocol = baseUrl.startsWith("localhost") ? "http://" : "https://";
    const redirectUrl = `${protocol}${baseUrl}/ticket/${registration.checkin_token}`;
    paymentUrl = `https://app.pakasir.com/pay/${projectSlug}/${event.price}?order_id=${registration.id}&redirect=${encodeURIComponent(redirectUrl)}`;
  }

  return {
    registration,
    event,
    token,
    isCheckedIn: !!registration.checked_in_at,
    checkedInAt: registration.checked_in_at as string | null,
    isExpired,
    paymentUrl,
  };
}

export default function TicketPage() {
  const { registration, event, token, isCheckedIn, checkedInAt, isExpired, paymentUrl } =
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden print:bg-white print:p-0 print:min-h-0">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 pointer-events-none print:hidden" />
      <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-primary/8 rounded-full blur-3xl pointer-events-none print:hidden" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-emerald-500/8 rounded-full blur-3xl pointer-events-none print:hidden" />

      {/* Back link */}
      <div className="relative z-10 w-full max-w-sm mb-4 print:hidden">
        <Link
          to={`/events/${event.slug}`}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Event
        </Link>
      </div>

      {/* Ticket Card */}
      <div className="relative z-10 w-full max-w-sm print:max-w-none print:w-[350px] print:mx-auto">
        {/* Status banner */}
        {registration.status === "pending_payment" ? (
          isExpired ? (
            <div className="flex items-center justify-center gap-2 bg-destructive text-destructive-foreground text-xs font-bold px-4 py-2.5 rounded-t-2xl animate-pulse">
              <AlertCircle className="w-4 h-4" />
              TIKET KADALUWARSA · Waktu Habis
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-t-2xl animate-pulse">
              <Clock className="w-4 h-4" />
              MENUNGGU PEMBAYARAN · Selesaikan Pembayaran
            </div>
          )
        ) : isCheckedIn ? (
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
                <div className="flex items-start gap-2">
                  {event.is_online ? (
                    <Globe className="w-3.5 h-3.5 text-primary/70 flex-shrink-0 mt-0.5" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-primary/70 flex-shrink-0 mt-0.5" />
                  )}
                  <span 
                    className="line-clamp-1 text-xs text-muted-foreground prose prose-sm dark:prose-invert prose-a:text-primary hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: event.location }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center px-6 py-6 bg-white dark:bg-muted/20 relative">
            <div
              className={`p-3 rounded-2xl border-2 shadow-sm relative overflow-hidden ${
                isCheckedIn
                  ? "border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/20"
                  : registration.status === "pending_payment"
                  ? isExpired
                    ? "border-destructive/20 bg-destructive/5"
                    : "border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/10"
                  : "border-primary/20 bg-white dark:bg-muted/10"
              }`}
            >
              <img
                src={qrImageUrl}
                alt="QR Code Tiket"
                width={200}
                height={200}
                className={`rounded-xl block ${
                  registration.status === "pending_payment" ? "blur-md select-none pointer-events-none opacity-40" : ""
                }`}
                loading="eager"
              />

              {registration.status === "pending_payment" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-background/30 dark:bg-background/40 backdrop-blur-[3px] select-none">
                  {isExpired ? (
                    <>
                      <AlertCircle className="w-8 h-8 text-destructive mb-1" />
                      <p className="text-[10px] font-bold text-destructive">Waktu Habis</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">Registrasi ulang diperlukan</p>
                    </>
                  ) : (
                    <>
                      <Clock className="w-8 h-8 text-amber-500 mb-1 animate-pulse" />
                      <p className="text-[10px] font-bold text-amber-500">Tiket Belum Aktif</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">Selesaikan pembayaran</p>
                    </>
                  )}
                </div>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 text-center font-mono break-all max-w-[200px]">
              {registration.status === "pending_payment" ? "••••••••••••••••" : token}
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
                  className={`font-bold ${
                    isCheckedIn
                      ? "text-emerald-500"
                      : registration.status === "pending_payment"
                      ? isExpired
                        ? "text-destructive"
                        : "text-amber-500"
                      : "text-primary"
                  }`}
                >
                  {isCheckedIn
                    ? "✅ Hadir"
                    : registration.status === "pending_payment"
                    ? isExpired
                      ? "❌ Kadaluwarsa"
                      : "⏳ Pending"
                    : "⏳ Terdaftar"}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 space-y-3">
            {registration.status === "pending_payment" && !isExpired && paymentUrl && (
              <a
                href={paymentUrl}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition-colors shadow-lg shadow-amber-500/20 text-center block print:hidden"
              >
                💳 Bayar Sekarang via Pakasir
              </a>
            )}

            {registration.status === "pending_payment" && isExpired && (
              <Link
                to={`/events/${event.slug}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-destructive hover:bg-destructive/80 text-white text-sm font-bold transition-colors text-center block print:hidden"
              >
                🔄 Daftar Ulang Event
              </Link>
            )}

            <div className="bg-muted/40 rounded-xl px-4 py-3 text-center print:hidden">
              <p className="text-[10px] text-muted-foreground font-medium">
                {registration.status === "pending_payment"
                  ? isExpired
                    ? "Link pendaftaran ini telah kadaluwarsa karena tidak melunasi pembayaran dalam 5 menit."
                    : "Harap selesaikan pembayaran. Setelah lunas, tiket dan QR Code akan aktif otomatis."
                  : "Tunjukkan QR Code ini kepada panitia saat registrasi di lokasi event. Jangan bagikan ke orang lain."}
              </p>
            </div>

            {registration.status === "confirmed" && (
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition-colors shadow-sm cursor-pointer print:hidden"
              >
                📥 Download / Cetak Tiket PDF
              </button>
            )}
          </div>
        </div>

        {/* Bottom branding */}
        <div className="text-center mt-4 print:hidden">
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
