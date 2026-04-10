"use client";

import { motion } from "motion/react";
import { GraduationCap, Users2, Sparkles, Network } from "lucide-react";

export default function BentoGrid() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="font-label text-sm font-bold uppercase tracking-[0.3em] text-primary mb-4">
            The Collective Identity
          </h2>
          <h3 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Kenapa MaduraDev?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card 1 - Belajar Bareng */}
          <motion.div
            whileHover={{ y: -8 }}
            className="md:col-span-2 bg-card border border-border/50 p-10 rounded-3xl editorial-shadow flex flex-col justify-between group hover:bg-primary transition-all duration-500"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-12 group-hover:bg-white transition-colors">
              <GraduationCap className="text-primary group-hover:text-primary text-3xl" />
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-4 group-hover:text-white">
                Belajar Bareng
              </h4>
              <p className="text-muted-foreground group-hover:text-white/80 leading-relaxed">
                Diskusi teknis harian dari level pemula hingga profesional untuk
                membedah teknologi terbaru.
              </p>
            </div>
          </motion.div>

          {/* Card 2 - Komunitas Supportif */}
          <motion.div
            whileHover={{ y: -8 }}
            className="md:col-span-2 bg-muted/50 border border-border/50 p-10 rounded-3xl editorial-shadow flex flex-col justify-between group"
          >
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-12">
              <Users2 className="text-primary group-hover:text-primary text-3xl" />
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-4">Komunitas Supportif</h4>
              <p className="text-muted-foreground leading-relaxed">
                Vibe komunitas yang positif tanpa toxic culture, saling bantu
                saat ada masalah (debugging) atau butuh saran karir.
              </p>
            </div>
          </motion.div>

          {/* Card 3 - Knowledge Sharing */}
          <motion.div
            whileHover={{ y: -8 }}
            className="md:col-span-2 lg:col-span-1 bg-card border border-border/50 p-10 rounded-3xl flex flex-col items-center text-center group"
          >
            <div className="w-14 h-14 bg-muted/50 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
              <Sparkles className="text-primary text-2xl" />
            </div>
            <h4 className="text-xl font-bold mb-3">Knowledge Sharing</h4>
            <p className="text-sm text-muted-foreground">
              Webinar dan workshop rutin gratis.
            </p>
          </motion.div>

          {/* Card 4 - Networking */}
          <motion.div
            whileHover={{ y: -8 }}
            className="md:col-span-2 lg:col-span-1 bg-card border border-border/50 p-10 rounded-3xl flex flex-col items-center text-center group"
          >
            <div className="w-14 h-14 bg-muted/50 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
              <Network className="text-primary text-2xl" />
            </div>
            <h4 className="text-xl font-bold mb-3">Networking</h4>
            <p className="text-sm text-muted-foreground">
              Terhubung dengan talent & mentor lokal.
            </p>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="md:col-span-4 lg:col-span-2 bg-slate-950 p-10 rounded-3xl flex items-center justify-around text-slate-50"
          >
            <div className="text-center">
              <p className="text-5xl font-black">1.1M</p>
              <p className="font-label text-[10px] uppercase tracking-widest text-primary/60">
                Followers
              </p>
            </div>
            <div className="w-px h-16 bg-white/10" />
            <div className="text-center">
              <p className="text-5xl font-black">50+</p>
              <p className="font-label text-[10px] uppercase tracking-widest text-primary/60">
                Projects
              </p>
            </div>
            <div className="w-px h-16 bg-white/10" />
            <div className="text-center">
              <p className="text-5xl font-black">12</p>
              <p className="font-label text-[10px] uppercase tracking-widest text-primary/60">
                Events/Year
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
