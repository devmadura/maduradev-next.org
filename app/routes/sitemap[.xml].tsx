import type { Route } from "./+types/sitemap[.xml]";
import { createAdminClient } from "@/lib/supabase/admin";

const SITE_URL = "https://maduradev-next.org";

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/events", priority: "0.9", changefreq: "weekly" },
  { path: "/teams", priority: "0.8", changefreq: "monthly" },
  { path: "/community", priority: "0.8", changefreq: "monthly" },
  { path: "/twibbon", priority: "0.6", changefreq: "monthly" },
];

export async function loader({ request }: Route.LoaderArgs) {
  // Dynamic event pages
  let eventSlugs: string[] = [];
  try {
    const adminClient = createAdminClient();
    const { data: events } = await adminClient
      .from("events")
      .select("slug, updated_at")
      .eq("is_published", true);
    eventSlugs = (events || []).map((e: any) => e.slug);
  } catch (e) {
    console.error("Sitemap: failed to fetch events", e);
  }

  const now = new Date().toISOString();

  const staticEntries = STATIC_PAGES.map(
    (page) => `
    <url>
      <loc>${SITE_URL}${page.path}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`
  ).join("");

  const eventEntries = eventSlugs
    .map(
      (slug) => `
    <url>
      <loc>${SITE_URL}/events/${slug}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticEntries}
  ${eventEntries}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
