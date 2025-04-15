"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { BookOpen, Code, Laptop, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: <Laptop className="h-6 w-6 text-primary" />,
      title: "Belajar Have Fun",
      description: "belajar programming dengan have fun",
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Komunitas Supportif",
      description:
        "Bergabunglah dengan komunitas developer madura yang siap membantu dan berbagi pengalaman.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Sharing",
      description: "share pengetahuan dan menerima pengetahuan",
    },
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: "Problem Solve",
      description: "Jika ada masalah diskusikan dengan para ahli.",
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
      id="fitur"
      className="w-full py-20 md:py-32 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-primary/5 to-blue-400/5 blur-3xl" />
      </div>

      <div className="container px-4 md:px-6" ref={ref}>
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block rounded-full bg-red-400/10 px-4 py-1.5 text-sm font-medium text-red-500">
              Welcome to MaduraDev
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight lg:text-5xl">
              Belajar programming dengan{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-red-400">
                Komunitas
              </span>
            </h2>
            <p className="max-w-[800px] mx-auto text-muted-foreground md:text-lg">
              MaduraDev Hadir Untuk Mengumpulkan Programmer, Mahasiswa, Siswa
              yang Memiliki Minat Di Bidang Teknologi
            </p>
          </motion.div>
        </div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-xl border bg-background/50 backdrop-blur-sm p-6 transition-all hover:shadow-md hover:shadow-red-400/5 hover:border-primary/50"
              variants={itemVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/5 via-transparent to-red-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-red-400/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-red-400 group-hover:w-full transition-all duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
