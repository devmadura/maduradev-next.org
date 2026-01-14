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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400 dark:bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 dark:opacity-10"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400 dark:bg-purple-500 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 dark:opacity-10"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-20">
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 mb-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Events</span>
        </Link>

        {/* Hero Image Section */}
        <div className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl">
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
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
                UPCOMING EVENT
              </div>
            ) : (
              <div className="px-4 py-2 bg-gray-900/80 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                Event Selesai
              </div>
            )}

            <span
              className={`px-4 py-2 backdrop-blur-sm text-sm font-medium rounded-full ${
                event.online
                  ? "bg-green-500/90 text-white"
                  : "bg-orange-500/90 text-white"
              }`}
            >
              {event.online ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          {/* Title & Subtitle */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {event.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              {event.description_small}
            </p>
          </div>

          {/* Info Cards Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Date Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
                  <Calendar className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Tanggal
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {event.tanggal}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10 dark:bg-purple-500/20">
                  <Clock className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Waktu
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {event.waktu}
                  </p>
                </div>
              </div>
            </div>

            {/* Format Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-red-500"></div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-pink-500/10 dark:bg-pink-500/20">
                  <Users className="w-6 h-6 text-pink-500 dark:text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Format
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {event.format}
                  </p>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-orange-500/10 dark:bg-orange-500/20">
                  {event.online ? (
                    <Globe className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                  ) : (
                    <MapPin className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Lokasi
                  </p>
                  <div
                    className="text-lg font-semibold text-gray-900 dark:text-white"
                    dangerouslySetInnerHTML={{ __html: event.location }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-8 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Tentang Event
            </h2>
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-a:text-blue-500 dark:prose-a:text-blue-400"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </div>

          {/* CTA Section */}
          {eventIsNew && (
            <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 dark:border-blue-400/20 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl p-8 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
              <div className="relative space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Siap untuk bergabung?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                  Jangan lewatkan kesempatan berharga ini! Daftar sekarang
                </p>
                <Link
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 px-8 py-6 text-lg"
                  >
                    Daftar Sekarang
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
