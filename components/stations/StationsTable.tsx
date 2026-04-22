"use client";

import Image from "next/image";
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
import { useDeleteStation, useStations } from "@/hooks/useStations";
import type { StationStatus } from "@/types";

function getStatusVariant(status: StationStatus) {
  if (status === "OPEN") return "success";
  if (status === "COMING_SOON") return "warning";
  return "destructive";
}

export function StationsTable() {
  const { data, isLoading } = useStations();
  const deleteStation = useDeleteStation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StationStatus | "ALL">("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredStations = useMemo(() => {
    const stationList = data ?? [];

    return stationList.filter((station) => {
      const matchesSearch = station.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "ALL" ? true : station.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, status]);

  return (
    <>
      <DataTable
        title="Stations"
        description="Search, filter, and manage the current network of launch points."
        toolbar={
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
            <div className="relative min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by station name" className="pl-9" />
            </div>
            <Select value={status} onChange={(event) => setStatus(event.target.value as StationStatus | "ALL")}>
              <option value="ALL">All statuses</option>
              <option value="OPEN">OPEN</option>
              <option value="COMING_SOON">COMING_SOON</option>
              <option value="CLOSED">CLOSED</option>
            </Select>
            <Button asChild>
              <Link href="/stations/new">
                <Plus className="h-4 w-4" />
                Add Station
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
        ) : filteredStations.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No stations match your filters"
              description="Try another search or create a fresh station draft to populate the network."
              actionLabel="Create station"
              actionHref="/stations/new"
            />
          </div>
        ) : (
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[10px] uppercase tracking-[0.12em] text-muted-foreground dark:bg-slate-900/30">
              <tr>
                <th className="px-4 py-2.5">Image</th>
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Location</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Open Year</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStations.map((station) => (
                <tr key={station.id} className="border-t border-border/70 transition hover:bg-primary/5">
                  <td className="px-4 py-2.5">
                    <div className="relative h-10 w-16 overflow-hidden rounded-lg">
                      <Image src={station.image} alt={station.name} fill className="object-cover" sizes="80px" />
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-semibold">{station.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{station.location}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={getStatusVariant(station.status)}>{station.status.replace("_", " ")}</Badge>
                  </td>
                  <td className="px-4 py-2.5">{station.openYear}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="outline" asChild>
                        <Link href={`/stations/${station.id}`}>Edit</Link>
                      </Button>
                      <Button variant="ghost" className="text-red-500 hover:bg-red-500/10 hover:text-red-600" onClick={() => setSelectedId(station.id)}>
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
        title="Delete station?"
        description="This removes the station from the preview data set. You can still recreate it later."
        confirmLabel="Delete station"
        destructive
        loading={deleteStation.isPending}
        onConfirm={async () => {
          if (!selectedId) return;
          await deleteStation.mutateAsync(selectedId);
          setSelectedId(null);
        }}
      />
    </>
  );
}
