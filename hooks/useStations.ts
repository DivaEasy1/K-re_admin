"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { resolveApiAssetUrl } from "@/lib/media";
import type { Station } from "@/types";

const stationKeys = {
  all: ["stations"] as const,
  detail: (id: string) => ["stations", id] as const
};

type StationPayload = {
  name: string;
  location: string;
  lat: number;
  lng: number;
  description: string;
  richContent?: string | null;
  equipment?: Station["equipment"];
  status: Station["status"];
  openYear?: number | null;
  image?: string | null;
};

function normalizeStation(station: Station) {
  return {
    ...station,
    image: resolveApiAssetUrl(station.image),
    gallery: Array.isArray(station.gallery)
      ? station.gallery.map((image) => ({
          ...image,
          url: resolveApiAssetUrl(image.url) ?? image.url
        }))
      : []
  } satisfies Station;
}

export function useStations() {
  return useQuery<Station[]>({
    queryKey: stationKeys.all,
    queryFn: async () => {
      const response = await api.get("/stations");
      const payload = (response.data.data || response.data) as Station[];
      return Array.isArray(payload) ? payload.map(normalizeStation) : [];
    }
  });
}

export function useStation(id: string) {
  return useQuery<Station>({
    queryKey: stationKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(`/stations/id/${id}`);
      return normalizeStation((response.data.data || response.data) as Station);
    },
    enabled: Boolean(id)
  });
}

export function useCreateStation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: StationPayload) => {
      const response = await api.post("/stations", payload);
      return normalizeStation((response.data.data || response.data) as Station);
    },
    onSuccess: async (createdStation) => {
      queryClient.setQueryData<Station[]>(stationKeys.all, (current = []) => [createdStation, ...current]);
      queryClient.setQueryData<Station>(stationKeys.detail(createdStation.id), createdStation);
      await queryClient.invalidateQueries({ queryKey: stationKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}

export function useUpdateStation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: StationPayload }) => {
      const response = await api.put(`/stations/${id}`, values);
      return normalizeStation((response.data.data || response.data) as Station);
    },
    onSuccess: async (updatedStation, variables) => {
      queryClient.setQueryData<Station[]>(stationKeys.all, (current = []) =>
        current.map((station) => (station.id === variables.id ? updatedStation : station))
      );
      queryClient.setQueryData<Station>(stationKeys.detail(variables.id), updatedStation);
      toast.success("Station mise a jour.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: stationKeys.all }),
        queryClient.invalidateQueries({ queryKey: stationKeys.detail(variables.id) })
      ]);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}

export function useDeleteStation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/stations/${id}`);
      return { id, payload: response.data.data || response.data };
    },
    onSuccess: async ({ id }) => {
      queryClient.setQueryData<Station[]>(stationKeys.all, (current = []) =>
        current.filter((station) => station.id !== id)
      );
      toast.success("Station supprimee.");
      await queryClient.invalidateQueries({ queryKey: stationKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}
