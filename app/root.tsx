import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { ThemeProvider } from "@/lib/theme";
import { NotFoundView } from "./routes/$";
import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Space+Grotesk:wght@300..700&display=swap",
  },
];

export const meta: Route.MetaFunction = () => [
  { title: "MaduraDev - Komunitas Developer Madura" },
  {
    name: "description",
    content:
      "MaduraDev adalah jaringan kolaborasi terbuka developer dan pegiat teknologi di Pulau Madura. Ruang temu untuk bertumbuh bersama komunitas lokal dan talenta IT.",
  },
  { name: "keywords", content: "maduradev, komunitas developer madura, programming madura, developer sampang, developer pamekasan, developer sumenep, komunitas programmer indonesia, coding madura, tech community madura" },
  { name: "author", content: "MaduraDev" },
  { name: "robots", content: "index, follow" },
  { property: "og:title", content: "MaduraDev - Komunitas Developer Madura" },
  {
    property: "og:description",
    content:
      "Jaringan kolaborasi terbuka developer di Pulau Madura. Events, workshop, dan networking untuk talenta teknologi Madura.",
  },
  { property: "og:site_name", content: "MaduraDev" },
  { property: "og:locale", content: "id_ID" },
  { property: "og:type", content: "website" },
  { property: "og:image", content: "/image.jpg" },
  { property: "og:image:alt", content: "MaduraDev Logo" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "MaduraDev - Komunitas Developer Madura" },
  { name: "twitter:description", content: "Komunitas programming dan developer di Pulau Madura." },
  { name: "twitter:image", content: "/image.jpg" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        {/* Inline script to prevent FOUC - runs before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("maduradev-theme");var s=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme:dark)").matches);document.documentElement.classList.add(s?"dark":"light")}catch(e){document.documentElement.classList.add("light")}})()`,
          }}
        />
      </head>
      <body className="font-sans">
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "MaduraDev",
              alternateName: "Madura Developer Community",
              url: "https://madura.dev",
              logo: "https://madura.dev/image.jpg",
              description:
                "Jaringan kolaborasi terbuka programming dan developer di Pulau Madura. Events, workshop, dan networking untuk talenta teknologi Madura.",
              sameAs: [
                "https://instagram.com/maduradev",
                "https://t.me/maduradev",
                "https://github.com/maduradev",
              ],
              areaServed: {
                "@type": "Place",
                name: "Pulau Madura, Jawa Timur, Indonesia",
              },
              event: {
                "@type": "Event",
                name: "MaduraDev Events",
                description: "Workshop, webinar, dan bootcamp untuk developer Madura",
              },
            }),
          }}
        />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <ThemeProvider>
        <NotFoundView />
      </ThemeProvider>
    );
  }

  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = `Error ${error.status}`;
    details = error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <ThemeProvider>
      <main className="flex min-h-screen items-center justify-center p-4 bg-background text-foreground">
        <div className="text-center max-w-lg space-y-3">
          <h1 className="text-4xl font-black font-display">{message}</h1>
          <p className="text-muted-foreground">{details}</p>
          {stack && (
            <pre className="mt-4 w-full overflow-x-auto p-4 text-left text-xs rounded-xl bg-muted border border-border">
              <code>{stack}</code>
            </pre>
          )}
        </div>
      </main>
    </ThemeProvider>
  );
}
