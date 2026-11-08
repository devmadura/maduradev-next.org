import { useRef } from "react";
import { useInView, motion } from "motion/react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Globe,
  Sparkles,
  ShieldCheck,
  Code2,
  Users,
} from "lucide-react";
import { appleSprings } from "@/lib/springs";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface TeamMember {
  name: string;
  position: string;
  description: string;
  avatar_url: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  portfolio?: string;
}

interface TeamDetailClientProps {
  member: TeamMember;
  prevMember: { name: string; slug: string } | null;
  nextMember: { name: string; slug: string } | null;
}

export default function TeamDetailClient({
  member,
  prevMember,
  nextMember,
}: TeamDetailClientProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const socialLinks = [
    member.portfolio && {
      icon: Globe,
      url: member.portfolio,
      label: "Website / Portfolio",
      primary: true,
    },
    member.github && {
      icon: GithubIcon,
      url: member.github,
      label: "GitHub",
    },
    member.linkedin && {
      icon: LinkedinIcon,
      url: member.linkedin,
      label: "LinkedIn",
    },
    member.instagram && {
      icon: InstagramIcon,
      url: member.instagram,
      label: "Instagram",
    },
  ].filter(Boolean) as {
    icon: React.ComponentType<{ className?: string }>;
    url: string;
    label: string;
    primary?: boolean;
  }[];

  const bioText =
    member.description && member.description.trim().length > 0
      ? member.description
      : `Berkontribusi aktif sebagai ${member.position} dalam pengembangan platform terbuka, edukasi, dan kegiatan kolaborasi teknologi MaduraDev.`;

  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden min-h-screen selection:bg-primary/20">
      {/* Subtle Dot Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.045]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Ambient Glow Orbs */}
      <div className="pointer-events-none absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-20 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10" ref={ref}>
        {/* Top Breadcrumb & Back Action */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={appleSprings.default}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <Link
            to="/teams"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card/80 hover:bg-muted border border-border/70 text-xs font-bold text-muted-foreground hover:text-foreground backdrop-blur-md transition-all active:scale-[0.97]"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Semua Pengelola Inisiatif</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Link to="/teams" className="hover:text-foreground transition-colors">
              Core Team
            </Link>
            <span className="text-border">/</span>
            <span className="text-foreground font-semibold truncate max-w-[200px]">
              {member.name}
            </span>
          </div>
        </motion.div>

        {/* Main Profile Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ ...appleSprings.default, delay: 0.06 }}
          className="relative rounded-[2rem] bg-card/75 dark:bg-card/45 border border-border/70 backdrop-blur-2xl p-6 sm:p-10 md:p-12 editorial-shadow overflow-hidden"
        >
          {/* Top Rim Highlight */}
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center md:items-start">
            {/* Avatar Column */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center">
              <div className="relative w-56 sm:w-64 md:w-full aspect-square rounded-3xl p-1.5 bg-gradient-to-br from-primary/30 via-border/50 to-transparent shadow-xl">
                <div className="relative w-full h-full rounded-[1.25rem] overflow-hidden bg-secondary border border-background">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl font-display font-black text-muted-foreground/30">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* Verified Contributor Pill */}
              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted/60 border border-border/60 text-[11px] font-semibold text-muted-foreground">
                <ShieldCheck size={14} className="text-primary shrink-0" />
                <span>Pengelola Inisiatif MaduraDev</span>
              </div>
            </div>

            {/* Identity & Details Column */}
            <div className="md:col-span-7 lg:col-span-8 space-y-6 text-center md:text-left">
              <div className="space-y-3">
                {/* Role Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                  <Sparkles size={12} />
                  <span>{member.position}</span>
                </div>

                {/* Member Name */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-foreground leading-[1.08]">
                  {member.name}
                </h1>
              </div>

              {/* Bio / Statement */}
              <div className="p-4 sm:p-5 rounded-2xl bg-muted/35 border border-border/50 text-left">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {bioText}
                </p>
              </div>

              {/* Role Context Mini Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="p-3.5 rounded-2xl bg-background/60 border border-border/60 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Code2 size={17} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Peran & Fokus
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-foreground mt-0.5">
                      {member.position} • Platform Terbuka
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-background/60 border border-border/60 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Users size={17} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Jejaring Kolaborasi
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-foreground mt-0.5">
                      Komunitas Teknologi Madura
                    </p>
                  </div>
                </div>
              </div>

              {/* Social & Portfolio Links */}
              {socialLinks.length > 0 && (
                <div className="pt-2 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Tautan & Media Sosial
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                    {socialLinks.map(({ icon: Icon, url, label, primary }) => (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.97] ${
                          primary
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
                            : "bg-background hover:bg-primary/10 text-foreground hover:text-primary border border-border/70 hover:border-primary/40"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Prev / Next Member Switcher Cards */}
        {(prevMember || nextMember) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ ...appleSprings.default, delay: 0.14 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
          >
            {prevMember ? (
              <Link
                to={`/teams/${prevMember.slug}`}
                className="group flex items-center justify-between gap-4 p-5 rounded-2xl bg-card/70 hover:bg-card border border-border/60 hover:border-primary/40 backdrop-blur-xl transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary flex items-center justify-center shrink-0 transition-colors">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Sebelumnya
                    </p>
                    <p className="text-sm font-bold text-foreground group-hover:text-primary truncate transition-colors mt-0.5">
                      {prevMember.name}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextMember ? (
              <Link
                to={`/teams/${nextMember.slug}`}
                className="group flex items-center justify-end gap-4 p-5 rounded-2xl bg-card/70 hover:bg-card border border-border/60 hover:border-primary/40 backdrop-blur-xl transition-all active:scale-[0.98] text-right"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Selanjutnya
                    </p>
                    <p className="text-sm font-bold text-foreground group-hover:text-primary truncate transition-colors mt-0.5">
                      {nextMember.name}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary flex items-center justify-center shrink-0 transition-colors">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
