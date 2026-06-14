import type { Route } from "./+types/_site._index";
import { useLoaderData } from "react-router";
import { createClient } from "@/lib/supabase/server";
import { getAllCommunities } from "@/lib/community";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Community from "@/components/community";
import CallToAction from "@/components/call-to-action";
import MapCommunityMadura from "@/components/map-community-madura";

export const meta: Route.MetaFunction = () => [
  { title: "MaduraDev - Komunitas Developer Madura" },
  {
    name: "description",
    content:
      "Gabung dengan komunitas developer terbesar di Pulau Madura. Events, workshop, bootcamp, dan networking untuk programmer dari Bangkalan, Sampang, Pamekasan, dan Sumenep.",
  },
  { property: "og:title", content: "MaduraDev - Komunitas Developer Madura" },
  {
    property: "og:description",
    content:
      "Komunitas programming dan developer di Pulau Madura. Events, workshop, dan networking.",
  },
  { property: "og:image", content: "/image.jpg" },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
];

export async function loader({ request }: Route.LoaderArgs) {
  const supabase = createClient(request);
  const communities = await getAllCommunities(supabase);
  return { communities };
}

export default function Home() {
  const { communities } = useLoaderData<typeof loader>();

  return (
    <main className="flex-1">
      <Hero />
      <Features />
      <Community />
      <MapCommunityMadura communities={communities} maxLegend={2} />
      <CallToAction />
    </main>
  );
}
