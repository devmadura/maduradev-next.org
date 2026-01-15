"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { Facebook, MessageCircle, Instagram, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Community() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const communities = [
    {
      icon: <Facebook className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      iconBg: "bg-red-100 dark:bg-blue-900",
      title: "Facebook",
      description:
        "Ikuti Juga kami di facebook kami juga rutin membagikan informasi event atau hal-hal yang lain",
      buttonText: "Follow Kami",
      buttonLink: "/facebook",
    },
    {
      icon: <Instagram className="h-6 w-6 text-red-400 dark:text-blue-400" />,
      iconBg: "bg-blue-100 dark:bg-blue-900",
      title: "Instagram",
      description:
        "Ikuti kami di Instagram untuk tips programming, konten inspiratif, dan info event terbaru.",
      buttonText: "Follow Kami",
      buttonLink: "/instagram",
    },
    {
      icon: (
        <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      ),
      iconBg: "bg-blue-100 dark:bg-blue-900",
      title: "Telegram",
      description:
        "Diskusikan langsung dengan sesama programmer dan dapatkan bantuan langsung dari para ahli.",
      buttonText: "Join Grub",
      buttonLink: "/telegram",
    },
  ];

  return (
    <section
      id="komunitas"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
    >
      <div className="space-y-16">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                Terhubung dengan kami
              </span>
            </div>
            <h3 className="text-5xl md:text-6xl font-black text-foreground text-balance leading-tight tracking-tight">
              Ikuti MaduraDev di
              <br />
              <span className="text-primary">social media</span>
            </h3>
            <p className="text-lg text-foreground/70 max-w-xl leading-relaxed font-light">
              Terhubung dengan komunitas di berbagai platform dan dapatkan
              update terbaru tentang event, tips programming, dan peluang
              kolaborasi.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {communities.map((social, idx) => (
            <Link
              key={idx}
              href={social.buttonLink}
              className={`group relative p-8 rounded-xl border border-primary/30 hover:border-primary/50 bg-gradient-to-br from-primary/20 to-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex flex-col h-full`}
            >
              <div className="mb-6 w-12 h-12 rounded-lg bg-white dark:bg-primary/30 flex items-center justify-center group-hover:bg-primary/40 transition-colors">
                {social.icon}
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2">
                {social.title}
              </h4>
              <p className="text-foreground/60 text-sm mb-6 flex-grow leading-relaxed">
                {social.description}
              </p>
              <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all text-sm">
                Ikuti Kami <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
