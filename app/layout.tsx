import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "MaduraDev",
    template: "%s - MaduraDev",
  },
  description: "Komunitas programming dan developer MaduraDev",
  verification: {
    google: 'xLU-lWej9jGaICu_sTbxHq7FF2A9boZiKeDplpFNTeA',
  },
  openGraph: {
    title: "MaduraDev",
    description: "Komunitas programming dan developer MaduraDev",
    url: "https://maduradev.vercel.app",
    siteName: "MaduraDev",
    images: [
      {
        url: "https://maduradev.vercel.app/image.jpg",
        width: 1200,
        height: 630,
        alt: "MaduraDev",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MaduraDev",
    description: "Komunitas programming dan developer MaduraDev",
    images: ["https://maduradev.vercel.app/image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
