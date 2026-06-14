import { Outlet } from "react-router";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MobileNav from "@/components/MobileNav";

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Outlet />
      <Footer />
      <MobileNav />
    </div>
  );
}
