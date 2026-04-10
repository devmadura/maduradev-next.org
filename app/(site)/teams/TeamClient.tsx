"use client";
import React, { useRef } from "react";
import { Linkedin, Instagram } from "lucide-react";
import { CoreTeam } from "@/lib/supabase/types";
import { getPlaceholderAvatarUrl } from "@/lib/placeholder";
import { useInView, motion } from "framer-motion";

interface TeamClientProps {
  members: CoreTeam[];
}

const ModernTeamPage = ({ members }: TeamClientProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #0058be 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10" ref={ref}>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-6">
              <span className="font-label text-[10px] font-bold uppercase tracking-widest">
                Our Base
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-4 font-display">
              Core <span className="text-primary italic">Team</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Orang-orang di balik layar yang menjalankan roda komunitas
              MaduraDev dan menggerakkan inisiatif-inisiatif teknologi lokal.
            </p>
          </motion.div>
          <div className="hidden md:flex gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-border" />
            <div className="w-2 h-2 rounded-full bg-border" />
          </div>
        </div>

        {/* Team Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {members.map((member) => (
            <motion.div
              key={member.id}
              className="bg-card p-8 rounded-3xl border border-border/50 group hover:border-primary/50 transition-all duration-300 editorial-shadow hover:-translate-y-2 flex flex-col items-center text-center"
              variants={itemVariants}
            >
              {/* Avatar Wrapper */}
              <div className="relative w-28 h-28 mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary/50 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative w-full h-full bg-background rounded-full p-1 border border-border group-hover:border-primary/30 transition-colors">
                  <img
                    src={member.avatar_url || getPlaceholderAvatarUrl(member.name)}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
                {member.name}
              </h4>
              <div className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                {member.position}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                {member.description || "Core member of MaduraDev"}
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-3 mt-6">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-muted/50 text-muted-foreground transition-all hover:bg-background hover:text-primary hover:border-primary/50 hover:shadow-md"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {member.instagram && (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-muted/50 text-muted-foreground transition-all hover:bg-background hover:text-pink-600 hover:border-pink-500/50 hover:shadow-md"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ModernTeamPage;

