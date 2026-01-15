"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { BookOpen, Code, Laptop, Users } from "lucide-react";

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: <Laptop className="h-6 w-6 text-red-700" />,
      title: "Belajar Have Fun",
      description: "belajar programming dengan have fun",
    },
    {
      icon: <Users className="h-6 w-6 text-red-700" />,
      title: "Komunitas Supportif",
      description:
        "Bergabunglah dengan komunitas developer madura yang siap membantu dan berbagi pengalaman.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-red-700" />,
      title: "Sharing",
      description: "share pengetahuan dan menerima pengetahuan",
    },
    {
      icon: <Code className="h-6 w-6 text-red-700" />,
      title: "Problem Solve",
      description: "Jika ada masalah diskusikan dengan para ahli.",
    },
  ];

  return (
    <section
      id="fitur"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div>
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                Keunggulan Komunitas
              </span>
            </div>
            <h3 className="text-5xl md:text-6xl font-black text-foreground text-balance leading-tight tracking-tight">
              Mengapa bergabung dengan{" "}
              <span className="text-primary">MaduraDev?</span>
            </h3>
          </div>
          <p className="text-lg text-foreground/70 leading-relaxed font-light">
            Kami menyediakan semua yang Anda butuhkan untuk tumbuh sebagai
            developer di komunitas yang supportif dan inklusif.
          </p>
        </div>

        <div className="space-y-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative p-6 rounded-xl border border-border hover:border-primary/50 bg-card/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                  {feature.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-foreground">
                    {feature.title}
                  </h4>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
