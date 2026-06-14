import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { PanelLeftClose, PanelLeft } from "lucide-react";

interface SidebarContextValue {
  open: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
}

export const SidebarContext = createContext<SidebarContextValue>({
  open: true,
  toggle: () => {},
  setOpen: () => {},
  isMobile: false,
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <SidebarContext.Provider value={{ open, toggle, setOpen, isMobile }}>
      <div className="flex min-h-screen">{children}</div>
    </SidebarContext.Provider>
  );
}

export function SidebarInset({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-1 flex-col min-w-0 ${className}`}>{children}</div>;
}

export function SidebarTrigger({ className = "" }: { className?: string }) {
  const { open, toggle } = useContext(SidebarContext);
  return (
    <button
      onClick={toggle}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

export function Sidebar({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { open, isMobile, setOpen } = useContext(SidebarContext);

  // Mobile overlay
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar-background text-sidebar-foreground transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          } ${className}`}
        >
          {children}
        </aside>
      </>
    );
  }

  return (
    <aside
      className={`sticky top-0 z-30 flex h-screen flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar-background text-sidebar-foreground transition-[width] duration-300 ${
        open ? "w-64" : "w-16"
      } ${className}`}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { open } = useContext(SidebarContext);
  return (
    <div className={`px-3 py-3 ${!open ? "flex items-center justify-center" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function SidebarContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 ${className}`}>{children}</div>;
}

export function SidebarFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-3 py-2 ${className}`}>{children}</div>;
}

export function SidebarGroup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-1 ${className}`}>{children}</div>;
}

export function SidebarGroupLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { open } = useContext(SidebarContext);
  if (!open) return null;
  return (
    <div className={`px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${className}`}>
      {children}
    </div>
  );
}

export function SidebarGroupContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function SidebarMenu({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <ul className={`space-y-1 ${className}`}>{children}</ul>;
}

export function SidebarMenuItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <li className={className}>{children}</li>;
}

interface SidebarMenuButtonProps {
  children: React.ReactNode;
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string;
  onClick?: () => void;
  className?: string;
}

export function SidebarMenuButton({
  children,
  asChild,
  isActive,
  tooltip,
  onClick,
  className = "",
}: SidebarMenuButtonProps) {
  const { open } = useContext(SidebarContext);

  const buttonClass = `group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm"
      : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
  } ${!open ? "justify-center px-0" : ""} ${className}`;

  if (asChild) {
    return (
      <div className={buttonClass} title={!open ? tooltip : undefined}>
        {children}
      </div>
    );
  }

  return (
    <button onClick={onClick} className={buttonClass} title={!open ? tooltip : undefined}>
      {children}
    </button>
  );
}

export function SidebarRail() {
  return null;
}
