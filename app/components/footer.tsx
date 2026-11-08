import { Link } from "react-router";
import {
  Send,
  Mail,
  Code2,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Scale,
} from "lucide-react";

const programmingTags = [
  "TYPESCRIPT",
  "JAVASCRIPT",
  "PYTHON",
  "GOLANG",
  "RUST",
  "PHP",
  "KOTLIN",
  "DART",
  "JAVA",
  "ELIXIR",
];

const navigationLinks = [
  { name: "Beranda", url: "/" },
  { name: "Kegiatan & Event", url: "/events" },
  { name: "Direktori Komunitas", url: "/community" },
  { name: "Pengelola Inisiatif", url: "/teams" },
  { name: "Media & Artikel", url: "/media" },
  { name: "Twibbon Creator", url: "/twibbon" },
];

const socialChannels = [
  { name: "Telegram", url: "/telegram", highlight: true },
  { name: "GitHub", url: "/github" },
  { name: "Instagram", url: "/instagram" },
  { name: "Email", url: "mailto:info.maduradev@gmail.com", external: true },
];

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-400 pt-20 pb-28 md:pb-16 px-6 border-t border-white/10 overflow-hidden selection:bg-primary/30 selection:text-white">
      {/* Subtle Top Rim Light Highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10 pb-16 border-b border-white/[0.08]">
          {/* Column 1: Brand, Mission & Socials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Open Collaborative Network • Pulau Madura</span>
            </div>

            <div>
              <Link
                to="/"
                className="inline-block text-3xl font-black text-white tracking-tighter font-display hover:text-primary transition-colors select-none"
              >
                MaduraDev
              </Link>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-md">
                Jaringan kolaborasi terbuka antardeveloper di Madura. Kami hadir
                sebagai jembatan penghubung bagi pegiat IT dan komunitas lokal
                untuk belajar, berbagi pengetahuan, dan membangun inovasi
                terbuka secara inklusif.
              </p>
            </div>

            {/* Social & Contact Pills */}
            <div className="pt-1">
              <p className="font-label text-[10px] uppercase tracking-widest text-slate-500 mb-3 font-bold">
                Terhubung Bersama Kami
              </p>
              <div className="flex flex-wrap gap-2.5">
                {socialChannels.map((item) =>
                  item.external ? (
                    <a
                      key={item.name}
                      href={item.url}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 hover:border-white/20 transition-all active:scale-[0.97]"
                    >
                      <Mail size={13} className="text-primary" />
                      <span>{item.name}</span>
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.url}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.97] ${
                        item.highlight
                          ? "bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30"
                          : "bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 hover:border-white/20"
                      }`}
                    >
                      {item.highlight && <Send size={12} />}
                      <span>{item.name}</span>
                      <ArrowUpRight size={13} className="opacity-60" />
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:col-span-3 space-y-5">
            <p className="font-label text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Eksplorasi Platform
            </p>
            <ul className="space-y-2.5">
              {navigationLinks.map((link) => (
                <li key={link.url}>
                  <Link
                    to={link.url}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 text-primary transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Tech Topics & Open Collaboration Box */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code2 size={14} className="text-primary" />
                <p className="font-label text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  Topik & Bahasa Pemrograman
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {programmingTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-white/[0.04] hover:bg-primary/20 border border-white/[0.08] hover:border-primary/40 text-slate-300 hover:text-white rounded-lg font-label text-[10px] font-bold tracking-wider transition-all cursor-default select-none"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Collaboration Callout Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Sparkles size={14} className="text-primary shrink-0" />
                <span>Inisiatif & Kolaborasi Terbuka</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingin berbagi materi di meetup, mendaftarkan direktori komunitas
                daerah, atau berkolaborasi acara?
              </p>
              <a
                href="mailto:info.maduradev@gmail.com"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-1"
              >
                <span>info.maduradev@gmail.com</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="text-slate-300 font-semibold">MaduraDev</span>.
            Ruang Kolaborasi Terbuka Developer Madura.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              to="/privacy-policy"
              className="inline-flex items-center gap-1.5 hover:text-slate-200 transition-colors"
            >
              <ShieldCheck size={14} className="text-primary/80" />
              <span>Kebijakan Privasi</span>
            </Link>
            <Link
              to="/terms-of-service"
              className="inline-flex items-center gap-1.5 hover:text-slate-200 transition-colors"
            >
              <Scale size={14} className="text-primary/80" />
              <span>Syarat & Ketentuan</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
