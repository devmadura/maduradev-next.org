"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ImageLogo() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logo_light = "/logos/logo_madura.png";
  const logo_dark = "/logos/logo_madura_light.png";

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const imgUrl = currentTheme === "light" ? logo_light : logo_dark;

  return (
    <div className="relative overflow-hidden rounded w-[54px] h-[54px]">
      <Link href="/">
        {mounted ? (
          <Image
            src={imgUrl}
            alt="MaduraDev Logo"
            width={64}
            height={64}
            className="object-cover transition-opacity duration-300 opacity-100 mt-2"
          />
        ) : (
          <div className="animate-pulse bg-gray-300 dark:bg-gray-700 w-full h-full rounded" />
        )}
      </Link>
    </div>
  );
}
