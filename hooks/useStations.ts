"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createStation,
  deleteStation,
  getStation,
  getStations,
  uploadStationImage,
  updateStation
} from "@/lib/mock-data";
import type { Station } from "@/types";

const stationKeys = {
  all: ["stations"] as const,
  detail: (id: string) => ["stations", id] as const
};

export function useStations() {
  return useQuery({
    queryKey: stationKeys.all,
    queryFn: getStations
  });
}

export function useStation(id: string) {
  return useQuery({
    queryKey: stationKeys.detail(id),
    queryFn: () => getStation(id),
    enabled: Boolean(id)
  });
}

export function useCreateStation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Station, "id">) => createStation(payload),
    onSuccess: async () => {
      toast.success("Station creee avec succes.");
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
    mutationFn: ({ id, values }: { id: string; values: Omit<Station, "id"> }) =>
      updateStation(id, values),
    onSuccess: async (_, variables) => {
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
    mutationFn: (id: string) => deleteStation(id),
    onSuccess: async () => {
      toast.success("Station supprimee.");
      await queryClient.invalidateQueries({ queryKey: stationKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}

export function useUploadStationImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, image }: { id: string; image: string }) => uploadStationImage(id, image),
    onSuccess: async (_, variables) => {
      toast.success("Image de la station mise a jour.");
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
