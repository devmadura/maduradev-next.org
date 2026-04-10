"use client";

import { motion } from "motion/react";

export default function CTABanner() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-primary rounded-[3rem] p-12 md:p-24 overflow-hidden editorial-shadow text-center"
      >
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
            Siap Menjadi Bagian Dari Kami?
          </h2>
          <p className="text-white/80 text-lg mb-12">
            Jangan biarkan potensimu berhenti di sini. Bergabunglah dengan
            ratusan developer Madura lainnya dan bangun masa depan teknologi
            bersama.
          </p>
          <button className="bg-background text-foreground px-12 py-5 rounded-2xl font-black text-xl hover:bg-background/90 transition-all active:scale-95 shadow-xl">
            Daftar Komunitas Sekarang
          </button>
          <p className="mt-6 text-white/60 font-label text-xs uppercase tracking-widest">
            Free Forever • No Gatekeeping
          </p>
        </div>
      </motion.div>
    </section>
  );
}
