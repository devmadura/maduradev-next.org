import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink, CircleCheck } from "lucide-react";
import Link from "next/link";
import { getAllEvents, isEventNew } from "@/lib/event";

export default async function ListEvent() {
  const events = await getAllEvents();

  if (events.length === 0) {
    return (
      <div className="mt-10 rounded-3xl border border-border/50 bg-card p-12 text-center editorial-shadow">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-foreground font-bold text-xl mb-2">
          Belum ada event mendatang
        </p>
        <p className="text-sm text-muted-foreground">
          Stay tuned untuk event selanjutnya!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {events.map((event, index) => (
        <div
          key={event.id}
          className="group rounded-3xl overflow-hidden border border-border/50 bg-card hover:border-primary/50 transition-all duration-300 editorial-shadow hover:-translate-y-2"
          style={{
            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
          }}
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <Link
              href={`/events/${event.slug}`}
              className="relative h-64 md:h-auto overflow-hidden block bg-muted"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-background/20 via-transparent to-primary/10 z-10 group-hover:from-background/30 transition-colors duration-500" />

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
                <div className="absolute top-6 left-6 z-20 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                  New Event
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 z-20 hover:bg-primary/5 transition-colors duration-500 flex items-center justify-center pointer-events-none">
                <ExternalLink className="w-12 h-12 text-background opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
              </div>
            </Link>

            {/* Content Section */}
            <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
              {/* Status Badge */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-secondary text-secondary-foreground"
                >
                  <MapPin className="w-3 h-3 mr-1.5" />
                  {event.online ? "Online" : "Offline"}
                </span>

                {!isEventNew(event.tanggal) && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-muted text-muted-foreground">
                    <CircleCheck className="w-3 h-3 mr-1.5" />
                    Selesai
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                {event.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {event.description_small}
              </p>

              {/* Date Info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-semibold">{event.tanggal}</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex">
                <Link href={`/events/${event.slug}`}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-5 font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center gap-2">
                    Lihat Detail
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
