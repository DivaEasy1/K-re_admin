"use client";

import Link from "next/link";
import { Check, Plus, Search, Trash2, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivities, useDeleteActivity, useToggleActivityStatus } from "@/hooks/useActivities";
import type { ActivityDifficulty } from "@/types";

function getDifficultyVariant(difficulty: ActivityDifficulty) {
  if (difficulty === "EASY") return "success";
  if (difficulty === "MEDIUM") return "warning";
  return "destructive";
}

function getDifficultyLabel(difficulty: ActivityDifficulty) {
  if (difficulty === "EASY") return "Facile";
  if (difficulty === "MEDIUM") return "Intermediaire";
  return "Difficile";
}

function getActivityStatusVariant(isActive?: boolean) {
  return isActive === false ? "warning" : "success";
}

function getActivityStatusLabel(isActive?: boolean) {
  return isActive === false ? "Inactive" : "Active";
}

function ActivityImageCell({ title, image }: { title: string; image?: string | null }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [image]);

  if (!image || hasError) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground dark:bg-slate-800">
        Img
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => {
          console.error("[activities] image failed to load", { title, image });
          setHasError(true);
        }}
      />
    </div>
  );
}

function ActivityStatusSwitch({
  isActive = true,
  loading = false,
  onToggle
}: {
  isActive?: boolean;
  loading?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={loading}
      aria-pressed={isActive}
      className={`relative inline-flex h-10 w-[74px] items-center rounded-full border-2 px-1 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
        isActive
          ? "border-violet-500 bg-violet-500/15 shadow-[0_0_24px_rgba(139,92,246,0.28)]"
          : "border-violet-300/60 bg-violet-200/20"
      }`}
    >
      <span
        className={`absolute flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
          isActive
            ? "left-[calc(100%-2.35rem)] bg-white text-violet-600 shadow-lg"
            : "left-1 bg-violet-300/70 text-violet-50"
        }`}
      >
        {isActive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </span>
    </button>
  );
}

export function ActivitiesTable() {
  const { data, isLoading } = useActivities();
  const deleteActivity = useDeleteActivity();
  const toggleActivityStatus = useToggleActivityStatus();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<ActivityDifficulty | "ALL">("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredActivities = useMemo(() => {
    const activityList = data ?? [];

    return activityList.filter((activity) => {
      const matchesSearch = activity.title.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = difficulty === "ALL" ? true : activity.difficulty === difficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [data, search, difficulty]);

  useEffect(() => {
    if (!data) {
      return;
    }

    console.log("[activities] table render state", {
      totalFromApi: data.length,
      visibleAfterFilters: filteredActivities.length,
      search,
      difficulty
    });
  }, [data, difficulty, filteredActivities.length, search]);

  return (
    <>
      <DataTable
        title="Activites"
        description="Gardez le catalogue propre, clair et facile a mettre a jour."
        toolbar={
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
            <div className="relative min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher une activite"
                className="pl-9"
              />
            </div>
            <Select value={difficulty} onChange={(event) => setDifficulty(event.target.value as ActivityDifficulty | "ALL")}>
              <option value="ALL">Tous les niveaux</option>
              <option value="EASY">Facile</option>
              <option value="MEDIUM">Intermediaire</option>
              <option value="HARD">Difficile</option>
            </Select>
            <Button asChild>
              <Link href="/activities/new">
                <Plus className="h-4 w-4" />
                Ajouter
              </Link>
            </Button>
          </div>
        }
      >
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="Aucune activite trouvee"
              description="Essayez un autre filtre ou creez une nouvelle activite."
              actionLabel="Creer une activite"
              actionHref="/activities/new"
              icon="AT"
            />
          </div>
        ) : (
          <>
            <div className="border-b border-border/70 px-4 py-2 text-[11px] text-muted-foreground">
              {filteredActivities.length} activite(s) affichee(s) sur {data?.length ?? 0} recue(s) depuis l&apos;API.
            </div>
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-[10px] uppercase tracking-[0.12em] text-muted-foreground dark:bg-slate-900/30">
                <tr>
                  <th className="px-4 py-2.5">Image</th>
                  <th className="px-4 py-2.5">Icone</th>
                  <th className="px-4 py-2.5">Activite</th>
                  <th className="px-4 py-2.5">Categorie</th>
                  <th className="px-4 py-2.5">Statut</th>
                  <th className="px-4 py-2.5">Niveau</th>
                  <th className="px-4 py-2.5">Duree</th>
                  <th className="px-4 py-2.5">Tarif</th>
                  <th className="px-4 py-2.5">Capacite</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((activity) => (
                  <tr
                    key={activity.id}
                    className={`border-t border-border/70 transition hover:bg-primary/5 ${
                      activity.isActive === false ? "bg-amber-500/5 text-muted-foreground" : ""
                    }`}
                  >
                    <td className="px-4 py-2.5">
                      <ActivityImageCell title={activity.title} image={activity.image} />
                    </td>
                    <td className="px-4 py-2.5 text-lg">{activity.icon}</td>
                    <td className="px-4 py-2.5 font-semibold">{activity.title}</td>
                    <td className="px-4 py-2.5 capitalize text-muted-foreground">{activity.category}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={getActivityStatusVariant(activity.isActive)}>{getActivityStatusLabel(activity.isActive)}</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant={getDifficultyVariant(activity.difficulty)}>{getDifficultyLabel(activity.difficulty)}</Badge>
                    </td>
                    <td className="px-4 py-2.5">{activity.duration}</td>
                    <td className="px-4 py-2.5">{activity.priceLabel}</td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {activity.maxParticipants}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex justify-end gap-2">
                        <ActivityStatusSwitch
                          isActive={activity.isActive}
                          loading={toggleActivityStatus.isPending && toggleActivityStatus.variables?.id === activity.id}
                          onToggle={() =>
                            void toggleActivityStatus.mutateAsync({
                              id: activity.id,
                              isActive: activity.isActive === false
                            })
                          }
                        />
                        <Button variant="outline" asChild>
                          <Link href={`/activities/${activity.id}`}>Modifier</Link>
                        </Button>
                        <Button
                          variant="destructive"
                          className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                          onClick={() => setSelectedId(activity.id)}
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
          </>
        )}
      </DataTable>

      <ConfirmDialog
        open={Boolean(selectedId)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null);
          }
        }}
        title="Supprimer cette activite ?"
        description="L'activite sera retiree definitivement."
        confirmLabel="Supprimer l'activite"
        destructive
        loading={deleteActivity.isPending}
        onConfirm={async () => {
          if (!selectedId) return;
          await deleteActivity.mutateAsync(selectedId);
          setSelectedId(null);
        }}
      />
    </>
  );
}
