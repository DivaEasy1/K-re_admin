"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  destructive = false,
  onConfirm,
  loading
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-300">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-xl font-semibold">{title}</h3>
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={() => void onConfirm()}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}

