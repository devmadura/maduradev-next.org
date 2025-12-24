import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
