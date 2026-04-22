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
  description: "Professional admin dashboard for stations, activities, and guest messages."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontDisplay.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

