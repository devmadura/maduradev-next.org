import { useTheme } from "@/lib/theme";
import { Link } from "react-router";
import { useEffect, useState } from "react";

export default function ImageLogo() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logo_light = "/logos/logo_madura.png";
  const logo_dark = "/logos/logo_madura_light.png";

  const currentTheme = theme === "system" ? "light" : theme;
  const imgUrl = currentTheme === "light" ? logo_light : logo_dark;

  return (
    <div className="relative overflow-hidden rounded w-[54px] h-[54px]">
      <Link to="/">
        {mounted ? (
          <img
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
