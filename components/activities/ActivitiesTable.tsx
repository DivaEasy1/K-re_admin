"use client";

import Link from "next/link";
import { Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivities, useDeleteActivity } from "@/hooks/useActivities";
import type { ActivityDifficulty } from "@/types";

function getDifficultyVariant(difficulty: ActivityDifficulty) {
  if (difficulty === "EASY") return "success";
  if (difficulty === "MEDIUM") return "warning";
  return "destructive";
}

export function ActivitiesTable() {
  const { data, isLoading } = useActivities();
  const deleteActivity = useDeleteActivity();
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

  return (
    <>
      <DataTable
        title="Activities"
        description="Keep the activity catalog clean, premium, and easy to update."
        toolbar={
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
            <div className="relative min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by activity title"
                className="pl-9"
              />
            </div>
            <Select value={difficulty} onChange={(event) => setDifficulty(event.target.value as ActivityDifficulty | "ALL")}>
              <option value="ALL">All levels</option>
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </Select>
            <Button asChild>
              <Link href="/activities/new">
                <Plus className="h-4 w-4" />
                Add Activity
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
              title="No activities found"
              description="Try a different filter or create a new experience card for the dashboard preview."
              actionLabel="Create activity"
              actionHref="/activities/new"
              icon="Ride"
            />
          </div>
        ) : (
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[10px] uppercase tracking-[0.12em] text-muted-foreground dark:bg-slate-900/30">
              <tr>
                <th className="px-4 py-2.5">Icon</th>
                <th className="px-4 py-2.5">Title</th>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5">Difficulty</th>
                <th className="px-4 py-2.5">Duration</th>
                <th className="px-4 py-2.5">Price</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity) => (
                <tr key={activity.id} className="border-t border-border/70 transition hover:bg-primary/5">
                  <td className="px-4 py-2.5 text-lg">{activity.icon}</td>
                  <td className="px-4 py-2.5">
                    <div>
                      <p className="font-semibold">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.stationName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 capitalize text-muted-foreground">{activity.category}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={getDifficultyVariant(activity.difficulty)}>{activity.difficulty}</Badge>
                  </td>
                  <td className="px-4 py-2.5">{activity.duration}</td>
                  <td className="px-4 py-2.5">{activity.price}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="outline" asChild>
                        <Link href={`/activities/${activity.id}`}>Edit</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                        onClick={() => setSelectedId(activity.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
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
        title="Delete activity?"
        description="This removes the activity from the preview catalog for now."
        confirmLabel="Delete activity"
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
