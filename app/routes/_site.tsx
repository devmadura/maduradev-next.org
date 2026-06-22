import { Outlet } from "react-router";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MobileNav from "@/components/MobileNav";
import { Toaster } from "sonner";

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Outlet />
      <Footer />
      <MobileNav />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
            border: "1px solid hsl(var(--border))",
          },
        }}
      />
    </div>
  );
}
