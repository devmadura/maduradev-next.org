import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink, CircleCheck } from "lucide-react";
import Link from "next/link";
import { getAllEvents, isEventNew } from "@/lib/event";

export default async function ListEvent() {
  const events = await getAllEvents();

  if (events.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-12 text-center shadow-lg dark:shadow-none">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Belum ada event mendatang
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Stay tuned untuk event selanjutnya!
        </p>
      </div>
    );
  }

  return (
    <>
      {events.map((event, index) => (
        <div
          key={event.id}
          className="group rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl hover:border-gray-300 dark:hover:border-white/20 transition-all duration-500 hover:shadow-2xl dark:shadow-none"
          style={{
            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
          }}
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <Link
              href={`/events/${event.slug}`}
              className="relative h-64 md:h-auto overflow-hidden block"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-blue-500/20 z-10 group-hover:from-black/30 transition-colors duration-500" />

              {/* Image */}
              <img
                src={
                  event.image.startsWith("http")
                    ? event.image
                    : `/${event.image}`
                }
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* NEW Badge */}
              {isEventNew(event.tanggal) && (
                <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                  NEW
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 z-20 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-500 flex items-center justify-center">
                <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
              </div>
            </Link>

            {/* Content Section */}
            <div className="p-8 md:p-10 flex flex-col justify-center space-y-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    event.online
                      ? "bg-green-50 text-green-700 ring-1 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/20 group-hover:ring-2"
                      : "bg-orange-50 text-orange-700 ring-1 ring-orange-600/20 dark:bg-orange-900/30 dark:text-orange-400 dark:ring-orange-400/20 group-hover:ring-2"
                  }`}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {event.online ? "Online" : "Offline"}
                </span>

                {!isEventNew(event.tanggal) && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-300/30 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700/30">
                    <CircleCheck className="w-4 h-4 mr-1 text-green-600" />{" "}
                    Selesai
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                {event.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {event.description_small}
              </p>

              {/* Date Info */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{event.tanggal}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href={`/events/${event.slug}`}>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
                    Lihat Detail
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
        </div>
      ))}
    </>
  );
}
