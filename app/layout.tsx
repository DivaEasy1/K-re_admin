import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";

import "@/app/globals.css";

import { AppProviders } from "@/components/providers/AppProviders";

const fontSans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontDisplay = Sora({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "K-RE Admin",
  description: "Tableau de bord d'administration pour les stations, activites et messages clients."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontDisplay.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
