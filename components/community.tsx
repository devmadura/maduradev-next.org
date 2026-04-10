"use client";

import { motion } from "motion/react";
import { Send, Instagram, Github, ArrowRight } from "lucide-react";
import Link from "next/link";

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
    href: "/telegram"
  },
  {
    icon: Instagram,
    name: "Instagram",
    description: "Konten edukatif singkat dan update event terbaru.",
    stat: "165 Followers",
    cta: "Follow Us",
    hoverBg: "hover:bg-[#b61722]",
    iconBg: "bg-[#b61722]/10",
    iconColor: "text-[#b61722]",
    href: "/instagram"
  },
  {
    icon: Github,
    name: "GitHub Org",
    description: "Kolaborasi open-source untuk membangun tools lokal.",
    stat: "4 Projects",
    cta: "Contribute",
    hoverBg: "hover:bg-foreground hover:text-background",
    iconBg: "bg-foreground/10",
    iconColor: "text-foreground",
    href: "/github"
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
              href
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
                  href={href}
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
