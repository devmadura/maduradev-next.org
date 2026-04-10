"use client";

import { Search, Send } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Event",
    url: "/events",
  },
  {
    name: "Team",
    url: "/teams",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav border-b border-border/40 bg-background/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black tracking-tighter text-primary">
            MaduraDev
          </span>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item, i) => (
              <Link
                key={i}
                href={item.url}
                className={`text-xs font-label font-bold uppercase tracking-widest transition-colors ${
                  (item.url === '/' ? pathname === '/' : pathname?.startsWith(item.url))
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-muted-foreground">
            <Search size={20} />
          </button>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95 shadow-lg shadow-primary/20">
            Join Now
          </button>
        </div>
      </div>
    </nav>
  );
}
