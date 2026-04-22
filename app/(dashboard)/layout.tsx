"use client";

import { useState } from "react";

import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar expanded={expanded} onToggle={() => setExpanded((current) => !current)} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="min-w-0 flex-1">
        <Header onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="px-3 py-4 sm:px-4 xl:px-6">
          <div className="mx-auto max-w-[1600px] animate-fade-up">{children}</div>
        </main>
      </div>
    </div>
  );
}
