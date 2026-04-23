"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, UserRoundCog } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getRoleLabel } from "@/lib/auth";
import { auditEntries, contactSettings } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6)
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"]
  });

const contactSchema = z.object({
  officeEmail: z.string().email(),
  officePhone: z.string().min(6),
  emergencyLine: z.string().min(6)
});

type PasswordValues = z.infer<typeof passwordSchema>;
type ContactValues = z.infer<typeof contactSchema>;

export default function SettingsPage() {
  const { user } = useAuth();

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const contactForm = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactSettings
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Modifier le mot de passe admin</CardTitle>
                <CardDescription>Zone de demonstration pour la gestion de securite du compte.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <form
            className="space-y-4"
            onSubmit={passwordForm.handleSubmit(() => {
              toast.success("Mot de passe mis a jour en mode demonstration.");
              passwordForm.reset();
            })}
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input id="currentPassword" type="password" {...passwordForm.register("currentPassword")} />
              <p className="text-sm text-red-500">{passwordForm.formState.errors.currentPassword?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input id="newPassword" type="password" {...passwordForm.register("newPassword")} />
              <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input id="confirmPassword" type="password" {...passwordForm.register("confirmPassword")} />
              <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword?.message}</p>
            </div>
            <Button type="submit">Mettre a jour</Button>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <UserRoundCog className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Profil administrateur</CardTitle>
                <CardDescription>Informations actuelles de l&apos;utilisateur connecte.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <div className="grid gap-3 text-sm">
            <div className="rounded-2xl border border-border/70 bg-secondary/50 px-4 py-3">
              <p className="text-muted-foreground">Nom</p>
              <p className="mt-1 font-semibold">{user?.name ?? "Administrateur"}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/50 px-4 py-3">
              <p className="text-muted-foreground">Role</p>
              <p className="mt-1 font-semibold">{getRoleLabel(user?.role)}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/50 px-4 py-3">
              <p className="text-muted-foreground">E-mail</p>
              <p className="mt-1 font-semibold">{user?.email ?? "-"}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Coordonnees</CardTitle>
            <CardDescription>Controlez les canaux de contact visibles dans l&apos;espace admin.</CardDescription>
          </CardHeader>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={contactForm.handleSubmit(() => {
              toast.success("Coordonnees enregistrees en mode demonstration.");
            })}
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="officeEmail">E-mail principal</Label>
              <Input id="officeEmail" {...contactForm.register("officeEmail")} />
              <p className="text-sm text-red-500">{contactForm.formState.errors.officeEmail?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="officePhone">Telephone</Label>
              <Input id="officePhone" {...contactForm.register("officePhone")} />
              <p className="text-sm text-red-500">{contactForm.formState.errors.officePhone?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyLine">Numero d&apos;urgence</Label>
              <Input id="emergencyLine" {...contactForm.register("emergencyLine")} />
              <p className="text-sm text-red-500">{contactForm.formState.errors.emergencyLine?.message}</p>
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Enregistrer les coordonnees</Button>
            </div>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Journal d&apos;activite</CardTitle>
            <CardDescription>Dernieres actions admin sur les tarifs, la messagerie et les stations.</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {auditEntries.map((entry) => (
              <div key={entry.id} className="rounded-[24px] border border-border/70 bg-secondary/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{entry.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.actor} | {entry.context}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatDateTime(entry.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
