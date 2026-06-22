import { useRef } from "react";
import { useInView, motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, ExternalLink, Globe } from "lucide-react";

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
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const socialLinks = [
    member.linkedin && {
      icon: LinkedinIcon,
      url: member.linkedin,
      label: "LinkedIn",
    },
    member.github && { icon: GithubIcon, url: member.github, label: "GitHub" },
    member.portfolio && {
      icon: Globe,
      url: member.portfolio,
      label: "Portfolio",
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
  }[];

  return (
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

      <div className="max-w-4xl mx-auto px-6 relative z-10" ref={ref}>
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to="/teams"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Semua Tim
          </Link>
        </motion.div>

        {/* Main content */}
        <div className="grid md:grid-cols-[280px_1fr] gap-12 md:gap-16 items-start">
          {/* Avatar column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative w-full aspect-square max-w-70 rounded-2xl overflow-hidden bg-secondary border border-border/60">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl font-display font-bold text-muted-foreground/30">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
          </motion.div>

          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Position */}
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded text-[11px] font-bold uppercase tracking-widest mb-4">
              {member.position}
            </div>

            {/* Name */}
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground mb-6">
              {member.name}
            </h1>

            {/* Description */}
            {member.description && (
              <p className="text-muted-foreground leading-relaxed text-lg mb-8 max-w-lg">
                {member.description}
              </p>
            )}

            {/* Portfolio link */}
            {member.portfolio && (
              <a
                href={member.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-lg font-medium text-sm hover:opacity-90 transition-opacity mb-8"
              >
                <Globe className="w-4 h-4" />
                Kunjungi Website
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            )}

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map(({ icon: Icon, url, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-muted/30 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Navigation */}
        <motion.div
          className="flex justify-between items-center mt-20 pt-8 border-t border-border/60"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {prevMember ? (
            <Link
              to={`/teams/${prevMember.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {prevMember.name}
            </Link>
          ) : (
            <div />
          )}
          {nextMember ? (
            <Link
              to={`/teams/${nextMember.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {nextMember.name}
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </motion.div>
      </div>
    </section>
  );
}
