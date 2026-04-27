"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Waves } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Veuillez saisir une adresse e-mail valide."),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caracteres.")
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError("");

    try {
      await signIn(values.email, values.password);
      router.replace("/");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Connexion impossible.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(30,144,255,0.22),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.14),_transparent_24%),linear-gradient(180deg,_#081320,_#10243d_48%,_#081320)] text-white">
      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-10 lg:grid-cols-[1.05fr,0.95fr]">
        <section className="hidden max-w-xl space-y-8 lg:block">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2.5 shadow-lg shadow-slate-950/15">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-sky-200 text-sm font-black text-slate-950">
              K
            </div>
            <div>
              <p className="font-display text-xl font-semibold">K-Re Admin</p>
              <p className="text-sm text-slate-300">Pilotage des operations</p>
            </div>
          </div>

          <div className="space-y-5">
            <h1 className="font-display text-5xl font-semibold leading-[1.08] text-white">
              Connectez-vous pour gerer les activites et l&apos;administration K-Re.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-300">
              Un espace de travail clair pour l&apos;equipe admin, avec une authentification securisee et une navigation fluide.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-white/18 bg-white p-5 text-slate-900 shadow-xl shadow-slate-950/10">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                  <Waves className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <p className="font-display text-lg font-semibold text-slate-900">Tableau de bord premium</p>
                  <p className="text-sm leading-6 text-slate-600">
                    Une interface nette pour suivre les activites et les operations.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-white/18 bg-white p-5 text-slate-900 shadow-xl shadow-slate-950/10">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <p className="font-display text-lg font-semibold text-slate-900">Session securisee</p>
                  <p className="text-sm leading-6 text-slate-600">
                    Authentification admin avec cookies HTTP-only et renouvellement de session.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <Card className="mx-auto w-full max-w-md border-white/10 bg-slate-900/45 p-8 text-white shadow-2xl shadow-slate-950/30 backdrop-blur-2xl">
          <div className="mb-8 space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[26px] bg-gradient-to-br from-ocean-400 to-sky-200 text-2xl font-black text-slate-950">
              K
            </div>
            <div className="space-y-2">
              <p className="font-display text-3xl font-semibold">Connexion admin</p>
              <p className="text-sm leading-6 text-slate-300">Entrez vos identifiants pour acceder au tableau de bord.</p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-100">
                Adresse e-mail
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className="h-11 border-white/12 bg-slate-950/55 pl-11 text-white placeholder:text-slate-500 dark:bg-slate-950/55"
                  placeholder="admin@kayak-en-re.fr"
                  autoComplete="email"
                />
              </div>
              <p className="text-sm text-red-300">{form.formState.errors.email?.message}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-100">
                Mot de passe
              </Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  className="h-11 border-white/12 bg-slate-950/55 pl-11 pr-12 text-white placeholder:text-slate-500 dark:bg-slate-950/55"
                  placeholder="Saisissez votre mot de passe"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-sm text-red-300">{form.formState.errors.password?.message}</p>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
            ) : null}

            <Button type="submit" className="h-11 w-full text-sm" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Connexion en cours..." : "Acceder au tableau de bord"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
