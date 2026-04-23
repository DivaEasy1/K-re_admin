"use client";

import { LogOut, Menu, MoonStar, SunMedium } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { getPageTitle } from "@/lib/navigation";

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export function Header({ onOpenMobileNav }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pageMeta = getPageTitle(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/60 bg-background/80 px-3 py-2.5 backdrop-blur-lg dark:border-white/10 sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="outline" size="icon" className="lg:hidden" onClick={onOpenMobileNav}>
          <Menu className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold">{pageMeta.title}</p>
          <p className="hidden truncate text-xs text-muted-foreground md:block">{pageMeta.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Changer le theme"
        >
          {mounted && theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
        </Button>

        <Button
          variant="outline"
          className="gap-2"
          onClick={async () => {
            await signOut();
            router.replace("/login");
          }}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Deconnexion</span>
        </Button>
      </div>
    </header>
  );
}
