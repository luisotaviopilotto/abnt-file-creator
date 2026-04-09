import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "ABNT Generator",
  description: "Gerador de documentos ABNT automatizado",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("font-sans", dmSans.variable)}>
      <body className="bg-neutral-900 text-neutral-100 antialiased h-screen overflow-hidden md:overflow-hidden overflow-auto">
        {children}
      </body>
    </html>
  );
}
