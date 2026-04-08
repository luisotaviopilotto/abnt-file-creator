import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { DocumentProvider } from "@/context/DocumentContext";

const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "ABNT Generator",
  description: "Gerador de documentos ABNT automatizado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("font-sans", dmSans.variable)}>
      <body className="bg-neutral-900 text-neutral-100 antialiased h-screen overflow-hidden">
        <DocumentProvider>
          {children}
        </DocumentProvider>
      </body>
    </html>
  );
}
