"use client";

import Link from "next/link";
import { ChevronRight, ChevronsLeftRight, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMessages } from "@/hooks/useMessages";
import { adminProfile } from "@/lib/mock-data";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

export function Sidebar({ expanded, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: unreadMessages = [] } = useMessages("NEW");
  const unreadCount = unreadMessages.length;

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-white/10 bg-[hsl(var(--sidebar))] px-3 py-4 text-[hsl(var(--sidebar-foreground))] shadow-panel transition-all duration-300 lg:flex",
        expanded ? "w-[220px]" : "w-[78px]"
      )}
    >
      <div className={cn("flex items-center", expanded ? "justify-between" : "justify-center")}>
        <Link
          href="/"
          className={cn(
            "group flex h-11 items-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10",
            expanded ? "w-full justify-between px-3" : "w-11 justify-center"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-sky-200 text-[11px] font-black text-slate-950">
              K
            </div>
            {expanded ? (
              <div>
                <p className="font-display text-sm font-semibold">K-Re</p>
                <p className="text-xs text-slate-300/70">Admin Control</p>
              </div>
            ) : null}
          </div>
          {expanded ? <ChevronRight className="h-3.5 w-3.5 text-slate-400 transition group-hover:translate-x-0.5" /> : null}
        </Link>
      </div>

      <div className="mt-6 flex-1 space-y-1.5">
        {navigationItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.title}
              className={cn(
                "group relative flex h-10 items-center rounded-xl px-3 text-xs font-semibold transition-all duration-200",
                expanded ? "justify-between" : "justify-center",
                isActive
                  ? "bg-gradient-to-r from-ocean-500 to-ocean-400 text-white shadow-glow"
                  : "text-slate-300 hover:bg-white/6 hover:text-white"
              )}
            >
              <div className={cn("flex items-center gap-2.5", !expanded && "justify-center")}>
                <item.icon className="h-4 w-4 shrink-0" />
                {expanded ? <span>{item.title}</span> : null}
              </div>
              {item.href === "/messages" && unreadCount > 0 ? (
                <Badge
                  variant={isActive ? "default" : "destructive"}
                  className={cn("min-w-5 justify-center px-1.5 py-0 tracking-normal", expanded ? "" : "absolute -right-1 top-1")}
                >
                  {unreadCount}
                </Badge>
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="space-y-3">
        <Button
          variant="secondary"
          size={expanded ? "default" : "icon"}
          className={cn("w-full justify-center bg-white/8 text-white hover:bg-white/14", expanded && "justify-between px-3")}
          onClick={onToggle}
        >
          <div className="flex items-center gap-2">
            <ChevronsLeftRight className="h-3.5 w-3.5" />
            {expanded ? <span>Toggle labels</span> : null}
          </div>
        </Button>

        <Link
          href="/stations/new"
          className={cn(
            "flex items-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10",
            expanded ? "justify-between px-3 py-2.5" : "justify-center py-2.5"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white">
              <Plus className="h-3.5 w-3.5" />
            </div>
            {expanded ? (
              <div>
                <p className="text-xs font-semibold text-white">Quick add</p>
                <p className="text-xs text-slate-300/70">Launch a new station</p>
              </div>
            ) : null}
          </div>
        </Link>

        <div className={cn("rounded-xl border border-white/10 bg-white/5 p-2.5", expanded ? "" : "flex justify-center")}>
          <div className={cn("flex items-center gap-2.5", !expanded && "flex-col")}>
            <Avatar className="h-9 w-9 ring-2 ring-white/10">
              <AvatarImage src={adminProfile.avatar} alt={adminProfile.name} />
              <AvatarFallback>GM</AvatarFallback>
            </Avatar>
            {expanded ? (
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">{adminProfile.name}</p>
                <p className="truncate text-xs text-slate-300/70">{adminProfile.role}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
