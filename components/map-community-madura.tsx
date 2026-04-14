"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Map, Instagram, Mail } from "lucide-react";
import Image from "next/image";

const communities = [
  {
    id: "bangkalan",
    name: "bangkalandev",
    ig: "bangkalandev",
    logo: "/partners/bangkalan-dev.webp",
    desktop: { x: "23%", y: "45%" },
    mobile: { x: "10%", y: "45%" },
  },
  {
    id: "sampang",
    name: "sampangdev",
    ig: "sampangdev",
    logo: "/partners/sampang-dev.webp",
    desktop: { x: "38%", y: "50%" },
    mobile: { x: "30%", y: "50%" },
  },
  {
    id: "pamekasan1",
    name: "pamekasandev",
    ig: "pamekasandev",
    logo: "/partners/pamekasan-dev.webp",
    desktop: { x: "48%", y: "52%" },
    mobile: { x: "48%", y: "52%" },
  },
  {
    id: "pamekasan2",
    name: "demtimcod",
    ig: "dcsquatit",
    logo: "/partners/demtimcod.webp",
    desktop: { x: "50%", y: "40%" },
    mobile: { x: "55%", y: "35%" },
  },
  {
    id: "sumenep",
    name: "sumenepdev",
    ig: "sumenepdev",
    logo: "/partners/sumenep-dev.webp",
    desktop: { x: "65%", y: "40%" },
    mobile: { x: "80%", y: "35%" },
  },
];

export default function MapCommunityMadura() {
  return (
    <section className="w-full py-16 bg-background font-sans relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        <div className="mb-10 lg:mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-6">
            <span className="font-label text-[10px] font-bold uppercase tracking-widest">
              Our Network
            </span>
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span className="font-label text-[10px] font-bold uppercase tracking-widest">
              Madura Developer
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-foreground leading-[1] tracking-tighter mb-4 font-display">
            Satu Pulau, <br className="md:hidden" />
            <span className="text-primary italic">Banyak Komunitas.</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Penyebaran developer aktif di 4 kabupaten Pulau Madura.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Main Map Area */}
          <div className="flex-1 relative bg-muted/30 border-2 border-border/50 rounded-3xl overflow-hidden editorial-shadow flex flex-col">

            {/* Map Canvas with uniform aspect ratio to lock coordinates perfectly on all devices */}
            <div className="relative w-full aspect-video flex items-center justify-center p-0 border-b-2 border-border/50 lg:border-none">

              <div className="absolute inset-0 w-full h-full bg-background/5 rounded-3xl overflow-hidden">
                <iframe
                  title="Madura Island Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=112.60%2C-7.30%2C114.20%2C-6.80&amp;layer=mapnik&amp;marker=-7.05%2C113.4"
                  className="w-full h-full pointer-events-none"
                  style={{ filter: "grayscale(100%) invert(95%) contrast(120%) opacity(0.8)", objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-background/20 pointer-events-none mix-blend-overlay" />
              </div>

              <div className="absolute inset-0 w-full h-full">
                {/* CSS Block for Responsive Coordinates Validation */}
                <style dangerouslySetInnerHTML={{
                  __html: communities.map(c => `
                    .pin-${c.id} {
                      left: ${c.mobile.x};
                      top: ${c.mobile.y};
                    }
                    @media (min-width: 768px) {
                      .pin-${c.id} {
                        left: ${c.desktop.x};
                        top: ${c.desktop.y};
                      }
                    }
                  `).join('')
                }} />

                {/* Community Pins with Logos */}
                {communities.map((community, i) => (
                  <motion.div
                    key={community.id}
                    className={`pin-${community.id} group absolute z-10 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15 + 0.5, type: "spring", stiffness: 200, damping: 20 }}
                  >
                    {/* Logo Pin */}
                    <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-background flex items-center justify-center border-2 border-border/50 editorial-shadow group-hover:scale-110 transition-transform duration-300 overflow-hidden p-1 cursor-pointer">
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <Image src={community.logo} alt={community.name} layout="fill" objectFit="contain" />
                      </div>
                    </div>

                    {/* Label (Shows on Hover) */}
                    <div className="absolute top-full mt-2 flex flex-col items-center glass-nav backdrop-blur-md px-3 py-1.5 rounded-xl border-2 border-border/50 editorial-shadow text-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover:translate-y-0">
                      <span className="text-white font-black text-[10px] md:text-xs tracking-wide shadow-sm font-display">
                        {community.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend Panel */}
          <motion.div
            className="w-full lg:w-80 bg-muted/20 border-2 border-border/50 rounded-3xl p-6 editorial-shadow flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-border/50">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                <Map className="text-primary" size={24} />
              </div>
              <h3 className="text-foreground font-black text-xl font-display leading-tight">Area <br /><span className="text-muted-foreground text-sm font-bold font-sans">Komunitas</span></h3>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {communities.map((item, i) => (
                <motion.a
                  href={`https://instagram.com/${item.ig}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={item.name}
                  className="flex items-center justify-between group cursor-pointer p-4 rounded-2xl hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all active:scale-95"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-background border border-border overflow-hidden p-0.5">
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <Image src={item.logo} alt={item.name} layout="fill" objectFit="contain" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-foreground font-black text-sm group-hover:text-primary transition-colors font-display tracking-wide">{item.name}</h4>
                      <p className="text-muted-foreground text-xs mt-0.5 capitalize font-bold">{item.id.replace(/[0-9]/g, '')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-xs md:text-sm text-foreground bg-background px-3 py-1.5 rounded-lg border-2 border-border/50 editorial-shadow group-hover:text-primary group-hover:border-primary/50 transition-colors">
                    <Instagram size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded-2xl border-2 border-border/50 border-dashed text-center">
              <Mail size={18} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Komunitas kalian ingin ditampilkan di peta? Kontak admin via email:<br />
                <a href="mailto:info.maduradev@gmail.com" className="text-primary font-bold hover:underline mt-1 inline-block">info.maduradev@gmail.com</a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
