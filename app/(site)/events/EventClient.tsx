"use client";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { BookOpen, Code, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function EventClient() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const resources = [
    {
      icon: <BookOpen className="h-6 w-6 text-red-400 dark:text-blue-400" />,
      iconBg: "bg-blue-100 dark:bg-blue-900",
      title: "Bedah Buku",
      description: "Belajar Kesimpulan Dari sebuah Buku",
      buttonLink: "#",
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: <Code className="h-6 w-6 text-red-400 dark:text-blue-400" />,
      iconBg: "bg-blue-100 dark:bg-blue-900",
      title: "ngoding",
      description:
        "Uji kemampuan koding kamu dengan tantangan yang menyenangkan dan menantang.",
      buttonLink: "#",
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: <Share2 className="h-6 w-6 text-red-400 dark:text-blue-400" />,
      iconBg: "bg-blue-100 dark:bg-blue-900",
      title: "Sharing Session",
      description:
        "Ikuti sesi berbagi pengalaman dari programmer berpengalaman dan belajar dari pengalaman mereka.",
      buttonLink: "#",
      color: "from-blue-500 to-blue-700",
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
      className="w-full py-20 md:py-10 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-400/5 to-transparent blur-3xl" />
      </div>

      <div className="container px-4 md:px-6" ref={ref}>
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight lg:text-5xl">
              Semua{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-red-400">
                Event
              </span>
            </h2>
            <p className="max-w-[800px] mx-auto text-muted-foreground md:text-lg">
              Semua List event yang di adakan oleh maduradev
            </p>
          </motion.div>
        </div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-xl border bg-background p-6 transition-all hover:shadow-lg"
              variants={itemVariants}
            >
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-red-500/50 to-red-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full ${resource.iconBg}`}
                >
                  {resource.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold">{resource.title}</h3>
                <p className="mb-6 text-muted-foreground">
                  {resource.description}
                </p>
                {/* <Button
                  variant="link"
                  className="p-0 h-auto font-medium text-primary hover:text-primary/80"
                >
                  {resource.buttonText} →
                </Button> */}
              </div>

              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gradient-to-tl from-primary/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:-translate-y-10 group-hover:-translate-x-10" />
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Resource - moved to page.tsx as server component */}
      </div>
    </section>
  );
}
