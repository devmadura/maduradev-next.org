"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CallToAction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="w-full py-20 md:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-red-400/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2),transparent_70%)]" />
      </div>

      <div className="container px-4 md:px-6" ref={ref}>
        <motion.div
          className="max-w-4xl mx-auto rounded-2xl overflow-hidden border shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative p-8 md:p-12 lg:p-16 bg-background">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-400/5" />

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Siap Menjadi{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-red-400">
                  Bagian Dari Kami?
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan komunitas MaduraDev sekarang dan mulai
                perjalanan programming mu dengan cara yang menyenangkan bersama
                komunitas!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-blue-400 hover:from-red-600/90 hover:to-red-400/90"
                >
                  Follow Instagram
                </Button> */}
                <Link href="/telegram">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary hover:bg-primary/10"
                  >
                    Join Telegram Group
                  </Button>
                </Link>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-red-400/10 blur-2xl" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-red-400/10 blur-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
