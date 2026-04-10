import { Metadata } from "next";
import { getEvent, isEventNew } from "@/lib/event";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  ArrowLeft,
  Globe,
} from "lucide-react";

interface PageParams {
  params: Promise<{ slug: string }>;
}

// Generate metadata
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return {
      title: "Event tidak ditemukan",
      description: "Event yang kamu cari tidak tersedia.",
    };
  }

  return {
    title: `${event.title} - MaduraDev`,
    description: event.description_small,
    openGraph: {
      title: event.title,
      description: event.description_small,
      images: [event.image],
      url: `${process.env.NEXT_URL_PUBLISH}/${event.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description_small,
      images: [event.image],
    },
  };
}

export default async function DetailEvent({ params }: PageParams) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) return notFound();

  const eventIsNew = isEventNew(event.tanggal);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dot Grid Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #0058be 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-24">
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-primary transition-colors group font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Events</span>
        </Link>

        {/* Hero Image Section */}
        <div className="relative rounded-[2.5rem] overflow-hidden mb-12 border border-border/50 editorial-shadow">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>

          {/* Image */}
          <img
            src={
              event.image.startsWith("http") ? event.image : `/${event.image}`
            }
            alt={event.title}
            className="w-full h-[400px] md:h-[500px] object-cover"
          />

          {/* Badges Overlay */}
          <div className="absolute top-6 left-6 z-20 flex gap-2">
            {eventIsNew ? (
              <div className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase rounded-full shadow-lg">
                Upcoming Event
              </div>
            ) : (
              <div className="px-4 py-2 bg-muted text-muted-foreground text-xs font-bold tracking-widest uppercase rounded-full shadow-lg">
                Selesai
              </div>
            )}

            <span
              className={`px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-full shadow-lg ${
                event.online
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {event.online ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-12">
          {/* Title & Subtitle */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-black text-foreground font-display leading-[1.1] tracking-tight">
              {event.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl">
              {event.description_small}
            </p>
          </div>

          {/* Info Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Date Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 hover:border-primary/50 transition-colors duration-300 editorial-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Tanggal
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {event.tanggal}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 hover:border-primary/50 transition-colors duration-300 editorial-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Waktu
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {event.waktu}
                  </p>
                </div>
              </div>
            </div>

            {/* Format Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 hover:border-primary/50 transition-colors duration-300 editorial-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Format
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {event.format}
                  </p>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 hover:border-primary/50 transition-colors duration-300 editorial-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors">
                  {event.online ? (
                    <Globe className="w-6 h-6 text-primary" />
                  ) : (
                    <MapPin className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Lokasi
                  </p>
                  <div
                    className="text-lg font-bold text-foreground"
                    dangerouslySetInnerHTML={{ __html: event.location }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="rounded-[2.5rem] border border-border/50 bg-card p-8 md:p-12 editorial-shadow">
            <h2 className="text-3xl font-bold text-foreground mb-8 font-display">
              Tentang Event
            </h2>
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary leading-relaxed"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </div>

          {/* CTA Section */}
          {eventIsNew && (
            <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-primary/5 p-12 text-center editorial-shadow">
              <div className="relative space-y-6 max-w-2xl mx-auto">
                <h3 className="text-3xl md:text-4xl font-black text-foreground font-display tracking-tight">
                  Siap untuk bergabung?
                </h3>
                <p className="text-lg text-muted-foreground">
                  Jangan lewatkan kesempatan berharga ini! Tempat terbatas, segera amankan kursi Anda dan jadilah bagian dari perjalanan kami.
                </p>
                <div className="pt-4">
                  <Link
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-7 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto"
                    >
                      Daftar Sekarang
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
