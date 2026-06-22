import { Home, Users, Calendar, MessageSquare, Camera } from "lucide-react";
import { Link, useLocation } from "react-router";

const leftItems = [
  { icon: Home, label: "Home", url: "/" },
  { icon: Users, label: "Teams", url: "/teams" },
];

const rightItems = [
  { icon: Calendar, label: "Events", url: "/events" },
  { icon: MessageSquare, label: "Forum", url: "/telegram" },
];

export default function MobileNav() {
  const pathname = useLocation().pathname;

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname?.startsWith(url);

  return (
    <nav className="fixed md:hidden bottom-0 left-0 right-0 z-50">
      <div className="relative bg-background/70 backdrop-blur-xl backdrop-saturate-150 border-t border-border/30">
        <div className="flex justify-between items-end px-4 pt-3 pb-8">
          {/* Left tabs */}
          {leftItems.map(({ icon: Icon, label, url }) => (
            <Link
              key={label}
              to={url}
              className="flex flex-col items-center gap-0.5 min-w-14 py-1"
            >
              <div
                className={`
                  w-7 h-7 flex items-center justify-center rounded-full
                  transition-all duration-200 ease-out
                  ${isActive(url) ? "bg-primary/10" : ""}
                `}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive(url) ? 2.2 : 1.8}
                  className={`
                    transition-colors duration-200
                    ${isActive(url) ? "text-primary" : "text-muted-foreground"}
                  `}
                />
              </div>
              <span
                className={`
                  text-[10px] leading-none tracking-regular
                  transition-colors duration-200
                  ${isActive(url) ? "text-primary font-medium" : "text-muted-foreground"}
                `}
              >
                {label}
              </span>
            </Link>
          ))}

          {/* Center camera button - subtle floating style */}
          <Link
            to="/twibbon"
            className="flex flex-col items-center gap-0.5 min-w-14 py-1 -mt-3"
          >
            <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-transform duration-150">
              <Camera
                size={24}
                strokeWidth={2}
                className="text-primary-foreground"
              />
            </div>
            <span className="text-[10px] leading-none tracking-regular text-muted-foreground">
              Twibbon
            </span>
          </Link>

          {/* Right tabs */}
          {rightItems.map(({ icon: Icon, label, url }) => (
            <Link
              key={label}
              to={url}
              className="flex flex-col items-center gap-0.5 min-w-14 py-1"
            >
              <div
                className={`
                  w-7 h-7 flex items-center justify-center rounded-full
                  transition-all duration-200 ease-out
                  ${isActive(url) ? "bg-primary/10" : ""}
                `}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive(url) ? 2.2 : 1.8}
                  className={`
                    transition-colors duration-200
                    ${isActive(url) ? "text-primary" : "text-muted-foreground"}
                  `}
                />
              </div>
              <span
                className={`
                  text-[10px] leading-none tracking-regular
                  transition-colors duration-200
                  ${isActive(url) ? "text-primary font-medium" : "text-muted-foreground"}
                `}
              >
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
