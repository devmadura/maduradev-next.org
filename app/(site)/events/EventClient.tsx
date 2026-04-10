"use client";
import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import { BookOpen, Code, Share2 } from "lucide-react";

export default function EventClient() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const resources = [
    {
      icon: BookOpen,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      title: "Bedah Buku",
      description: "Belajar Kesimpulan Dari sebuah Buku",
    },
    {
      icon: Code,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      title: "Ngoding",
      description:
        "Uji kemampuan koding kamu dengan tantangan yang menyenangkan dan menantang.",
    },
    {
      icon: Share2,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
      title: "Sharing Session",
      description:
        "Ikuti sesi berbagi pengalaman dari programmer berpengalaman dan belajar dari pengalaman mereka.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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
    <section
      id="sumber-belajar"
      className="py-24 bg-background relative overflow-hidden"
    >
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
                Our Events
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-4 font-display">
              Semua <span className="text-primary italic">Event</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Semua daftar event yang diadakan oleh MaduraDev, mulai dari bedah buku, ngoding bareng, hingga sharing session reguler.
            </p>
          </motion.div>
          <div className="hidden md:flex gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-border" />
            <div className="w-2 h-2 rounded-full bg-border" />
          </div>
        </div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={index}
                className="bg-card p-8 rounded-3xl border border-border/50 group hover:border-primary/50 transition-all duration-300 editorial-shadow hover:-translate-y-2 flex flex-col justify-between"
                variants={itemVariants}
              >
                <div>
                  <div
                    className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl ${resource.iconBg}`}
                  >
                    <Icon className={`h-6 w-6 ${resource.iconColor}`} />
                  </div>
                  <h4 className="text-xl font-bold mb-2">{resource.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {resource.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
