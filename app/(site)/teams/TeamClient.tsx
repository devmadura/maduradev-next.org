"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Linkedin, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { getPlaceholderAvatarUrl } from "@/lib/placeholder";
import type { CoreTeam } from "@/lib/supabase/types";

interface TeamClientProps {
  members: CoreTeam[];
}

export default function TeamClient({ members }: TeamClientProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
      id="komunitas"
      className="w-full py-20 md:py-10 bg-muted relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.01)_1px,transparent_1px)] bg-[size:14px_14px]" />
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
              Our{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-red-400">
                Team
              </span>
            </h2>
            <p className="max-w-[800px] mx-auto text-muted-foreground md:text-lg">
              Core Team MaduraDev
            </p>
          </motion.div>
        </div>

        <motion.div
          className="grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {members.map((member) => (
            <motion.div
              key={member.id}
              className="group relative overflow-hidden rounded-xl border bg-background p-6 transition-all hover:shadow-xl"
              variants={itemVariants}
            >
              <div className="inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <Card className="w-full max-w-sm mx-auto text-center p-6 rounded-2xl shadow-md">
                <CardContent>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <img
                        className="rounded-full w-full h-full object-cover"
                        src={member.avatar_url || getPlaceholderAvatarUrl(member.name)}
                        alt={member.name}
                      />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold">{member.name}</h2>
                  <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/10 dark:bg-orange-900/30 dark:text-orange-400 dark:ring-orange-400/20">
                    {member.position}
                  </span>
                  <p className="text-sm text-gray-500 mb-4">
                    {member.description || ""}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.linkedin && (
                      <Link href={member.linkedin} className="cursor-pointer">
                        <Button
                          variant="outline"
                          className="gap-2 bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-400/90 transition-all duration-300 text-white"
                        >
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </Button>
                      </Link>
                    )}
                    {member.instagram && (
                      <Link href={member.instagram}>
                        <Button
                          variant="outline"
                          className="gap-2 bg-gradient-to-r from-primary to-red-400 hover:from-red-500/90 hover:to-red-400/90 transition-all duration-300 text-white"
                        >
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-gradient-to-tl from-primary/20 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
