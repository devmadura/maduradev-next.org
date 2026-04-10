"use client";

import { Home, Users, Calendar, MessageSquare, Camera } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", url: "/" },
  { icon: Users, label: "Team", url: "/teams" },
  { icon: Calendar, label: "Events", url: "/events" },
  { icon: MessageSquare, label: "Forum", url: "#" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed md:hidden bottom-0 left-0 right-0 glass-nav border-t border-border/40 px-6 py-3 z-50 flex justify-between items-center pb-8 bg-background/60 backdrop-blur-md">
      {navItems.slice(0, 2).map(({ icon: Icon, label, url }) => {
        const active = url === '/' ? pathname === '/' : pathname?.startsWith(url);
        return (
          <Link
            key={label}
            href={url}
            className={`flex flex-col items-center gap-1 ${active ? "text-primary" : "text-muted-foreground"
              }`}
          >
            <Icon size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {label}
            </span>
          </Link>
        )
      })}

      {/* Center FAB */}
      <div className="relative -top-8">
        <Link
          href="/twibbon"
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
        >
          <Camera size={32} />
        </Link>
      </div>

      {navItems.slice(2).map(({ icon: Icon, label, url }) => {
        const active = url === '/' ? pathname === '/' : pathname?.startsWith(url);
        return (
          <Link
            key={label}
            href={url}
            className={`flex flex-col items-center gap-1 ${active ? "text-primary" : "text-muted-foreground"
              }`}
          >
            <Icon size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  );
}
