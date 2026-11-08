import type { Route } from "./+types/_site.events";
import { createClient } from "@/lib/supabase/server";
import { getAllEvents } from "@/lib/event";
import ListEvent from "@/components/event/list-event";
import { motion, type Variants } from "motion/react";
import { appleSprings } from "@/lib/springs";

export const meta: Route.MetaFunction = () => [
  { title: "Events - MaduraDev" },
  { name: "description", content: "Semua event MaduraDev: workshop, webinar, bootcamp, dan bincang-bincang untuk developer Madura." },
  { name: "keywords", content: "event developer madura, workshop programming madura, webinar developer, bootcamp coding madura" },
  { property: "og:title", content: "Events - MaduraDev" },
  { property: "og:description", content: "Workshop, webinar, bootcamp, dan bincang-bincang untuk developer Madura." },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://madura.dev/events" },
  { property: "og:image", content: "https://madura.dev/image.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Events - MaduraDev" },
  { name: "twitter:description", content: "Workshop, webinar, bootcamp, dan bincang-bincang untuk developer Madura." },
  { name: "twitter:image", content: "https://madura.dev/image.jpg" },
  { tagName: "link", rel: "canonical", href: "https://madura.dev/events" },
];

export async function loader({ request }: Route.LoaderArgs) {
  const supabase = createClient(request);
  const events = await getAllEvents(supabase);
  return { events };
}

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: appleSprings.default,
  },
};

export default function EventsPage({ loaderData }: Route.ComponentProps) {
  const { events } = loaderData;

  const eventsItemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MaduraDev Events",
    description: "Daftar workshop, webinar, bootcamp, dan bincang-bincang untuk developer Madura.",
    url: "https://madura.dev/events",
    itemListElement: events.map((event, index) => {
      let startDateISO = event.event_date;
      if (event.event_date) {
        const timeMatch = event.event_time?.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          const hh = timeMatch[1].padStart(2, "0");
          const mm = timeMatch[2];
          startDateISO = `${event.event_date}T${hh}:${mm}:00+07:00`;
        } else {
          startDateISO = `${event.event_date}T00:00:00+07:00`;
        }
      }

      const cleanLocation = event.location ? event.location.replace(/<[^>]*>?/gm, "").trim() : "";
      const fullImageUrl = event.image
        ? (event.image.startsWith("http") ? event.image : `https://madura.dev${event.image.startsWith("/") ? "" : "/"}${event.image}`)
        : undefined;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Event",
          name: event.title,
          description: event.description_small,
          startDate: startDateISO,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: event.online
            ? "https://schema.org/OnlineEventAttendanceMode"
            : "https://schema.org/OfflineEventAttendanceMode",
          location: event.online
            ? {
              "@type": "VirtualLocation",
              url: `https://madura.dev/events/${event.slug}`,
            }
            : {
              "@type": "Place",
              name: cleanLocation || "Madura",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Madura",
                addressRegion: "Jawa Timur",
                addressCountry: "ID",
              },
            },
          organizer: {
            "@type": "Organization",
            name: "MaduraDev",
            url: "https://madura.dev",
          },
          ...(fullImageUrl ? { image: [fullImageUrl] } : {}),
          url: `https://madura.dev/events/${event.slug}`,
        },
      };
    }),
  };

  return (
    <div className="pt-5">
      {/* Schema.org Event List JSON-LD for Google Search Console */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsItemListJsonLd) }}
      />

      <section className="py-24 bg-background relative overflow-hidden min-h-screen">
        {/* Dot Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
          {/* Section Header (aligned with /teams) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={headerVariants}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Event Directory
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 font-display text-foreground">
                Jelajahi <span className="text-primary italic">Event & Workshop</span>
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Tingkatkan keahlian coding, ikuti sesi berbagi ilmu teknologi terbaru, dan perluas jejaring kolaborasi bersama para developer di Pulau Madura.
              </p>
            </motion.div>
            <div className="hidden md:flex gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-2 h-2 rounded-full bg-border" />
              <div className="w-2 h-2 rounded-full bg-border" />
            </div>
          </div>

          {/* Event List Component with filters and grids */}
          <ListEvent events={events} />
        </div>
      </section>
    </div>
  );
}
