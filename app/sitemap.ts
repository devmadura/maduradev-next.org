import { MetadataRoute } from "next";
import { getAllEvents } from "@/lib/event";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getAllEvents();
  console.log("Generating sitemap with events:", events);
  const baseUrl = process.env.NEXT_URL_PUBLISH;
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/teams`,
      lastModified: new Date(),
      priority: 0.7,
    },
  ];
  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.updated_at ? new Date(event.updated_at) : new Date(),
    priority: 0.6,
    changeFrequency: "weekly",
  }));

  // 5. Gabungkan static routes dan dynamic routes
  return [...staticRoutes, ...eventRoutes];
}
