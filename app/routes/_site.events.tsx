import type { Route } from "./+types/_site.events";
import { createClient } from "@/lib/supabase/server";
import { getAllEvents } from "@/lib/event";
import EventClient from "@/components/event/EventClient";
import ListEvent from "@/components/event/list-event";

export const meta: Route.MetaFunction = () => [
  { title: "Events - MaduraDev" },
  { name: "description", content: "Semua event MaduraDev: workshop, webinar, bootcamp, dan bincang-bincang untuk developer Madura." },
  { name: "keywords", content: "event developer madura, workshop programming madura, webinar developer, bootcamp coding madura" },
  { property: "og:title", content: "Events - MaduraDev" },
  { property: "og:description", content: "Workshop, webinar, bootcamp, dan bincang-bincang untuk developer Madura." },
  { property: "og:image", content: "/image.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
];

export async function loader({ request }: Route.LoaderArgs) {
  const supabase = createClient(request);
  const events = await getAllEvents(supabase);
  return { events };
}

export default function EventsPage({ loaderData }: Route.ComponentProps) {
  const { events } = loaderData;

  return (
    <div className="pt-20">
      <EventClient />
      <div className="container px-4 md:px-6 py-4 md:py-6 max-w-7xl mx-auto">
        <ListEvent events={events} />
      </div>
    </div>
  );
}
