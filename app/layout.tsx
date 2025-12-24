import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "MaduraDev",
    template: "%s - MaduraDev",
  },
  description: "Komunitas programming dan developer MaduraDev",
  verification: {
    google: "b0k0d5NR46JBjf89O9_qmNRBb_fKEb8nC4Vx0kBeEyQ",
  },
  openGraph: {
    title: "MaduraDev",
    description: "Komunitas programming dan developer MaduraDev",
    url: `${process.env.NEXT_URL_PUBLISH}`,
    siteName: "MaduraDev",
    images: [
      {
        url: `${process.env.NEXT_URL_PUBLISH}/image.jpg`,
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
    images: [`${process.env.NEXT_URL_PUBLISH}/image.jpg`],
  },
  metadataBase: new URL(process.env.NEXT_URL_PUBLISH || "https://madura.dev"),
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
