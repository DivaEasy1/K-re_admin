import { CalendarClock, Inbox, MapPinned, Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";

interface StatsCardsProps {
  totalStations: number;
  openStations: number;
  comingSoonStations: number;
  totalActivities: number;
  unreadMessages: number;
  lastLogin: string;
}

export function StatsCards({
  totalStations,
  openStations,
  comingSoonStations,
  totalActivities,
  unreadMessages,
  lastLogin
}: StatsCardsProps) {
  const cards = [
    {
      label: "Total Stations",
      value: totalStations,
      helper: `${openStations} open | ${comingSoonStations} coming soon`,
      icon: MapPinned,
      highlight: false
    },
    {
      label: "Total Activities",
      value: totalActivities,
      helper: "Experiences currently visible in the catalog",
      icon: Waves,
      highlight: false
    },
    {
      label: "Unread Messages",
      value: unreadMessages,
      helper: unreadMessages > 0 ? "Needs attention from the team" : "Inbox is under control",
      icon: Inbox,
      highlight: unreadMessages > 0
    },
    {
      label: "Last Login",
      value: formatDateTime(lastLogin),
      helper: "Latest authenticated session",
      icon: CalendarClock,
      highlight: false
    }
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className={card.highlight ? "border-red-200/70 bg-red-50/80 dark:border-red-500/20 dark:bg-red-950/20" : ""}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2.5">
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{card.label}</p>
                <p className="font-display text-2xl font-semibold leading-none">{card.value}</p>
              </div>
              <p className="text-xs text-muted-foreground">{card.helper}</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <card.icon className="h-4 w-4" />
            </div>
          </div>
          {card.highlight ? (
            <div className="mt-3">
              <Badge variant="destructive">Priority inbox</Badge>
            </div>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
