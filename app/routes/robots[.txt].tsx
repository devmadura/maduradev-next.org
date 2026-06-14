import type { Route } from "./+types/robots[.txt]";

const SITE_URL = "https://maduradev-next.org";

export async function loader({ request }: Route.LoaderArgs) {
  const content = `# robots.txt for MaduraDev
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /login
Disallow: /logout
Disallow: /auth/

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Host
Host: ${SITE_URL}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
