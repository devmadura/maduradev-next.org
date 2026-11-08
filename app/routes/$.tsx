import { Link, useLocation, useNavigate, data } from "react-router";
import { motion } from "motion/react";
import {
  Home,
  ArrowLeft,
  Calendar,
  Users,
  Newspaper,
  Camera,
  Terminal,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import { appleSprings } from "@/lib/springs";

export const meta = () => [
  { title: "404 - Halaman Tidak Ditemukan | MaduraDev" },
  {
    name: "description",
    content: "Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.",
  },
  { name: "robots", content: "noindex, nofollow" },
];

export function loader() {
  throw data("Not Found", { status: 404 });
}

const quickDestinations = [
  {
    name: "Kegiatan & Event",
    description: "Jadwal workshop, webinar, dan meetup",
    url: "/events",
    icon: Calendar,
  },
  {
    name: "Direktori Komunitas",
    description: "Jejaring komunitas IT di 4 kabupaten",
    url: "/community",
    icon: Users,
  },
  {
    name: "Media & Artikel",
    description: "Kabar kegiatan dan blog teknis",
    url: "/media",
    icon: Newspaper,
  },
  {
    name: "Twibbon Creator",
    description: "Generator frame foto 100% client-side",
    url: "/twibbon",
    icon: Camera,
  },
];

export function NotFoundView() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col justify-between overflow-hidden selection:bg-primary/20">
      {/* Subtle Dot Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient Glow Orbs */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-primary/15 rounded-full blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]" />

      {/* Minimal Top Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 pt-8 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-black tracking-tighter text-primary font-display select-none active:scale-[0.97] transition-transform"
        >
          MaduraDev
        </Link>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/70 border border-border/60 text-xs font-mono text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          HTTP 404
        </span>
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-3xl w-full text-center space-y-10">
          {/* Animated 404 Badge & Giant Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={appleSprings.default}
            className="space-y-4"
          >
            {/* Terminal Route Inspector Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-card/80 dark:bg-card/50 border border-border/80 backdrop-blur-xl shadow-xs max-w-full overflow-hidden">
              <Terminal size={14} className="text-primary shrink-0" />
              <code className="text-xs font-mono text-muted-foreground truncate">
                GET{" "}
                <span className="text-foreground font-semibold">
                  {location.pathname}
                </span>
              </code>
              <span className="px-2 py-0.5 rounded-md bg-destructive/10 text-destructive text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
                Not Found
              </span>
            </div>

            {/* Giant 404 Display */}
            <div className="relative py-2">
              <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none font-display select-none bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground/30 bg-clip-text text-transparent">
                404
              </h1>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground font-display">
              Halaman Tidak <span className="text-primary italic">Ditemukan.</span>
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Tautan yang Anda tuju mungkin telah dipindahkan, dihapus, atau
              terjadi kesalahan pengetikan alamat URL.
            </p>
          </motion.div>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...appleSprings.default, delay: 0.08 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-[0.97]"
            >
              <Home size={17} />
              <span>Kembali ke Beranda</span>
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-card/80 hover:bg-muted border border-border/80 text-foreground font-bold text-sm backdrop-blur-md transition-all active:scale-[0.97] cursor-pointer"
            >
              <ArrowLeft size={17} />
              <span>Halaman Sebelumnya</span>
            </button>
          </motion.div>

          {/* Quick Wayfinding Bento Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...appleSprings.default, delay: 0.16 }}
            className="pt-4 text-left"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              <Compass size={14} className="text-primary" />
              <span>Pintasan Halaman Utama</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickDestinations.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.url}
                    to={item.url}
                    className="group flex items-start justify-between gap-4 p-4 rounded-2xl bg-card/70 dark:bg-card/40 hover:bg-card border border-border/60 hover:border-primary/40 backdrop-blur-xl transition-all duration-200 active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1"
                    />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Subtle Footer Line */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 pb-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MaduraDev • Ruang Kolaborasi Terbuka Developer Madura
      </footer>
    </div>
  );
}

export default function CatchAll() {
  return <NotFoundView />;
}

export function ErrorBoundary() {
  return <NotFoundView />;
}
