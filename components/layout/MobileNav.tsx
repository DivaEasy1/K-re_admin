"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMessages } from "@/hooks/useMessages";
import { adminProfile } from "@/lib/mock-data";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { data: unreadMessages = [] } = useMessages("NEW");
  const unreadCount = unreadMessages.length;

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-950/55 backdrop-blur-sm lg:hidden">
      <div className="h-full w-[88%] max-w-xs overflow-y-auto bg-[hsl(var(--sidebar))] p-4 text-white shadow-panel">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-sky-200 text-[11px] font-black text-slate-950">
              K
            </div>
            <div>
              <p className="font-display text-sm font-semibold">K-Re</p>
              <p className="text-xs text-slate-300/70">Admin Control</p>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1.5">
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex h-10 items-center justify-between rounded-xl px-3 text-xs font-semibold",
                  isActive
                    ? "bg-gradient-to-r from-ocean-500 to-ocean-400 text-white shadow-glow"
                    : "text-slate-300 hover:bg-white/6 hover:text-white"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
                {item.href === "/messages" && unreadCount > 0 ? (
                  <Badge variant="destructive" className="min-w-5 justify-center px-1.5 py-0 tracking-normal">
                    {unreadCount}
                  </Badge>
                ) : null}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-9 w-9 ring-2 ring-white/10">
              <AvatarImage src={adminProfile.avatar} alt={adminProfile.name} />
              <AvatarFallback>GM</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">{adminProfile.name}</p>
              <p className="truncate text-xs text-slate-300/70">{adminProfile.role}</p>
            </div>
          </div>
        </div>
      </div>
      <button className="flex-1" onClick={onClose} aria-label="Close menu" />
    </div>
  );
}
