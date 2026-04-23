import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Message } from "@/types";
import { formatDate } from "@/lib/utils";

interface RecentMessagesProps {
  messages: Message[];
}

function getStatusLabel(status: Message["status"]) {
  if (status === "NEW") return "Nouveau";
  if (status === "REPLIED") return "Traite";
  return "Archive";
}

export function RecentMessages({ messages }: RecentMessagesProps) {
  return (
    <Card className="overflow-hidden p-0">
      <CardHeader className="border-b border-border/70 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Messages recents</CardTitle>
            <CardDescription>Dernieres demandes clients pouvant necessiter une reponse rapide.</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/messages">
              Voir tout
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-[10px] uppercase tracking-[0.12em] text-muted-foreground dark:bg-slate-900/30">
            <tr>
              <th className="px-4 py-2.5">Nom</th>
              <th className="px-4 py-2.5">Objet</th>
              <th className="px-4 py-2.5">Date</th>
              <th className="px-4 py-2.5">Statut</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id} className="border-t border-border/70 transition hover:bg-primary/5">
                <td className="px-4 py-2.5 font-medium">{message.name}</td>
                <td className="px-4 py-2.5">
                  <Link href={`/messages/${message.id}`} className="hover:text-primary">
                    {message.subject}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{formatDate(message.date)}</td>
                <td className="px-4 py-2.5">
                  <Badge
                    variant={
                      message.status === "NEW"
                        ? "destructive"
                        : message.status === "REPLIED"
                          ? "success"
                          : "default"
                    }
                  >
                    {getStatusLabel(message.status)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
