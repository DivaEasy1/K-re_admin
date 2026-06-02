"use client";

import Link from "next/link";
import { Archive, ArrowLeft, Mail, Reply, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteMessage, useMessage, useUpdateMessageStatus } from "@/hooks/useMessages";
import { formatDateTime } from "@/lib/utils";

function getStatusLabel(status: "NEW" | "REPLIED" | "ARCHIVED") {
  if (status === "NEW") return "Nouveau";
  if (status === "REPLIED") return "Traite";
  return "Archive";
}

export default function MessageDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data: message, isLoading } = useMessage(params.id);
  const updateStatus = useUpdateMessageStatus();
  const deleteMessage = useDeleteMessage();

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!message) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Message introuvable</CardTitle>
          <CardDescription>Ce message n&apos;existe plus dans les donnees actuelles.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" asChild>
            <Link href="/messages">
              <ArrowLeft className="h-4 w-4" />
              Retour aux messages
            </Link>
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}>
                <Reply className="h-4 w-4" />
                Repondre
              </a>
            </Button>
            <Button variant="outline" onClick={() => updateStatus.mutate({ id: message.id, status: "REPLIED" })}>
              <Mail className="h-4 w-4" />
              Marquer comme traite
            </Button>
            <Button variant="outline" onClick={() => updateStatus.mutate({ id: message.id, status: "ARCHIVED" })}>
              <Archive className="h-4 w-4" />
              Archiver
            </Button>
            <Button variant="ghost" className="text-red-500 hover:bg-red-500/10 hover:text-red-600" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle>{message.subject}</CardTitle>
                <CardDescription>
                  De {message.name} | {message.email}
                </CardDescription>
              </div>
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
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
              Recu le {formatDateTime(message.date)}
            </div>
          </CardHeader>
          <div className="px-6 pb-6">
            <div className="rounded-[28px] border border-border/70 bg-white/60 p-6 text-[15px] leading-8 dark:bg-slate-950/30">
              {message.content}
            </div>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Supprimer ce message ?"
        description="Le message courant sera retire de la boite de reception."
        confirmLabel="Supprimer"
        destructive
        loading={deleteMessage.isPending}
        onConfirm={async () => {
          await deleteMessage.mutateAsync(message.id);
          router.push("/messages");
        }}
      />
    </>
  );
}
