"use client";

import Link from "next/link";
import { Archive, Search, Trash2 } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteMessage, useMessages, useUpdateMessageStatus } from "@/hooks/useMessages";
import { formatDate } from "@/lib/utils";
import type { MessageStatus } from "@/types";

function getMessageBadge(status: MessageStatus) {
  if (status === "NEW") return "destructive";
  if (status === "REPLIED") return "success";
  return "default";
}

function getMessageStatusLabel(status: MessageStatus) {
  if (status === "NEW") return "Nouveau";
  if (status === "REPLIED") return "Traite";
  return "Archive";
}

export default function MessagesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MessageStatus | "ALL">("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isLoading } = useMessages(status === "ALL" ? undefined : status);
  const updateStatus = useUpdateMessageStatus();
  const deleteMessage = useDeleteMessage();

  const filteredMessages = (data ?? []).filter((message) =>
    [message.name, message.email, message.subject].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <DataTable
        title="Messages"
        description="Suivez chaque demande client et gardez la boite de reception organisee."
        toolbar={
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
            <div className="relative min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un message" className="pl-9" />
            </div>
            <Select value={status} onChange={(event) => setStatus(event.target.value as MessageStatus | "ALL")}>
              <option value="ALL">Tous les statuts</option>
              <option value="NEW">Nouveau</option>
              <option value="REPLIED">Traite</option>
              <option value="ARCHIVED">Archive</option>
            </Select>
          </div>
        }
      >
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="Aucun message pour le moment"
              description="Les demandes clients apparaitront ici pour etre traitees rapidement."
              icon="MSG"
            />
          </div>
        ) : (
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[10px] uppercase tracking-[0.12em] text-muted-foreground dark:bg-slate-900/30">
              <tr>
                <th className="px-4 py-2.5">Nom</th>
                <th className="px-4 py-2.5">E-mail</th>
                <th className="px-4 py-2.5">Objet</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Statut</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((message) => (
                <tr key={message.id} className="border-t border-border/70 transition hover:bg-primary/5">
                  <td className="px-4 py-2.5 font-semibold">{message.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{message.email}</td>
                  <td className="px-4 py-2.5">{message.subject}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{formatDate(message.date)}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={getMessageBadge(message.status)}>{getMessageStatusLabel(message.status)}</Badge>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="outline" asChild>
                        <Link href={`/messages/${message.id}`}>Voir</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => updateStatus.mutate({ id: message.id, status: "ARCHIVED" })}
                        className="text-slate-600 hover:bg-slate-900/5 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/10"
                      >
                        <Archive className="h-4 w-4" />
                        Archiver
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                        onClick={() => setSelectedId(message.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DataTable>

      <ConfirmDialog
        open={Boolean(selectedId)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null);
          }
        }}
        title="Supprimer ce message ?"
        description="Le message sera retire de la boite de reception d'aperçu."
        confirmLabel="Supprimer le message"
        destructive
        loading={deleteMessage.isPending}
        onConfirm={async () => {
          if (!selectedId) return;
          await deleteMessage.mutateAsync(selectedId);
          setSelectedId(null);
        }}
      />
    </>
  );
}
