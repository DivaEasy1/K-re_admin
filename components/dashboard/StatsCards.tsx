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
      label: "Total stations",
      value: totalStations,
      helper: `${openStations} ouvertes | ${comingSoonStations} a venir`,
      icon: MapPinned,
      highlight: false
    },
    {
      label: "Total activites",
      value: totalActivities,
      helper: "Experiences actuellement visibles dans le catalogue",
      icon: Waves,
      highlight: false
    },
    {
      label: "Messages non lus",
      value: unreadMessages,
      helper: unreadMessages > 0 ? "Une reponse de l'equipe est attendue" : "La boite de reception est a jour",
      icon: Inbox,
      highlight: unreadMessages > 0
    },
    {
      label: "Derniere connexion",
      value: formatDateTime(lastLogin),
      helper: "Derniere session authentifiee",
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
              <Badge variant="destructive">Boite prioritaire</Badge>
            </div>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
