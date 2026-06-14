import { motion } from "motion/react";
import { Send, ArrowRight } from "lucide-react";
import { Link } from "react-router";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const socialPlatforms = [
  {
    icon: Send,
    name: "Telegram Group",
    description: "Pusat diskusi teknis real-time antar developer.",
    stat: "842 Members",
    cta: "Join Now",
    hoverBg: "hover:bg-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    href: "/telegram",
  },
  {
    icon: InstagramIcon,
    name: "Instagram",
    description: "Konten edukatif singkat dan update event terbaru.",
    stat: "165 Followers",
    cta: "Follow Us",
    hoverBg: "hover:bg-[#b61722]",
    iconBg: "bg-[#b61722]/10",
    iconColor: "text-[#b61722]",
    href: "/instagram",
  },
  {
    icon: GithubIcon,
    name: "GitHub Org",
    description: "Kolaborasi open-source untuk membangun tools lokal.",
    stat: "4 Projects",
    cta: "Contribute",
    hoverBg: "hover:bg-foreground hover:text-background",
    iconBg: "bg-foreground/10",
    iconColor: "text-foreground",
    href: "/github",
  },
];

export default function SocialConnect() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h3 className="text-4xl font-black tracking-tight mb-4 font-display">
              Connect with the <span className="text-primary">Ecosystem.</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Pilih platform favoritmu untuk tetap update dengan jadwal event,
              lowongan kerja, dan diskusi santai kami.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-border" />
            <div className="w-2 h-2 rounded-full bg-border" />
          </div>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {socialPlatforms.map(
            ({
              icon: Icon,
              name,
              description,
              stat,
              cta,
              hoverBg,
              iconBg,
              iconColor,
              href,
            }) => (
              <motion.div
                key={name}
                whileHover={{ y: -10 }}
                className={`bg-card p-8 rounded-3xl border border-border/50 group ${hoverBg} transition-all duration-300`}
              >
                <div className="flex justify-between items-start mb-12">
                  <div
                    className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center group-hover:bg-background`}
                  >
                    <Icon className={`${iconColor} group-hover:${iconColor}`} />
                  </div>
                  <span className="font-label text-xs font-bold text-muted-foreground group-hover:text-background/70">
                    {stat}
                  </span>
                </div>
                <h4 className="text-xl font-bold mb-2 group-hover:text-background">
                  {name}
                </h4>
                <p className="text-sm text-muted-foreground group-hover:text-background/80 mb-6">
                  {description}
                </p>
                <Link
                  to={href}
                  target="_blank"
                  className="inline-flex items-center gap-2 font-bold text-primary group-hover:text-background transition-colors"
                >
                  {cta} <ArrowRight size={16} />
                </Link>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
