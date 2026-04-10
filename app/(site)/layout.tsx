import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MobileNav from "@/components/MobileNav";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        {children}
        <Footer />
        <MobileNav />
      </div>
    </>
  );
}
