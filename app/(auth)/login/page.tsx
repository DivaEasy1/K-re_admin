"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail, Waves } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { previewCredentials, loginAdmin } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: previewCredentials
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError("");

    try {
      await loginAdmin(values.email, values.password);
      router.push("/");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(30,144,255,0.28),_transparent_28%),linear-gradient(180deg,_#081320,_#10243d_45%,_#081320)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(125,211,252,0.16),_transparent_22%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="hidden max-w-xl space-y-8 lg:block">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-sky-200 font-black text-slate-950">
              K
            </div>
            <div>
              <p className="font-display text-lg font-semibold">K-Ré Admin</p>
              <p className="text-sm text-slate-300">Ocean operations dashboard</p>
            </div>
          </div>

          <div className="space-y-5">
            <p className="font-display text-5xl font-semibold leading-tight text-balance">
              A sharp control room for stations, activities, and guest conversations.
            </p>
            <p className="max-w-lg text-lg leading-8 text-slate-300">
              This preview focuses on a premium interface first: ocean palette, clean analytics, and confident admin navigation.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-white/10 bg-white/8 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10">
                  <Waves className="h-6 w-6 text-sky-200" />
                </div>
                <div>
                  <p className="font-display text-xl font-semibold">Refined charts</p>
                  <p className="text-sm text-slate-300">Finance-grade clarity with modern motion and spacing.</p>
                </div>
              </div>
            </Card>
            <Card className="border-white/10 bg-white/8 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10">
                  <LockKeyhole className="h-6 w-6 text-sky-200" />
                </div>
                <div>
                  <p className="font-display text-xl font-semibold">Preview auth</p>
                  <p className="text-sm text-slate-300">Safe mock login while backend auth is still pending.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-md border-white/10 bg-white/10 p-8 text-white shadow-panel backdrop-blur-2xl">
          <div className="mb-8 space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[28px] bg-gradient-to-br from-ocean-400 to-sky-200 text-2xl font-black text-slate-950">
              K
            </div>
            <div>
              <p className="font-display text-3xl font-semibold">Welcome back</p>
              <p className="mt-2 text-sm text-slate-300">Sign in to enter the K-Ré control room.</p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-100">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className="border-white/10 bg-white/8 pl-11 text-white placeholder:text-slate-400"
                  placeholder="admin@k-re.ma"
                />
              </div>
              <p className="text-sm text-red-300">{form.formState.errors.email?.message}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-100">
                Password
              </Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  className="border-white/10 bg-white/8 pl-11 pr-12 text-white placeholder:text-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-sm text-red-300">{form.formState.errors.password?.message}</p>
            </div>

            {error ? <div className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Signing in..." : "Enter dashboard"}
            </Button>
          </form>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <p className="font-semibold text-white">Demo credentials</p>
            <p className="mt-2">{previewCredentials.email}</p>
            <p>{previewCredentials.password}</p>
          </div>
        </Card>
      </div>
    </main>
  );
}

