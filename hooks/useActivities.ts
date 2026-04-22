"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createActivity,
  deleteActivity,
  getActivities,
  getActivity,
  uploadActivityImage,
  updateActivity
} from "@/lib/mock-data";
import type { Activity } from "@/types";

const activityKeys = {
  all: ["activities"] as const,
  detail: (id: string) => ["activities", id] as const
};

export function useActivities() {
  return useQuery({
    queryKey: activityKeys.all,
    queryFn: getActivities
  });
}

export function useActivity(id: string) {
  return useQuery({
    queryKey: activityKeys.detail(id),
    queryFn: () => getActivity(id),
    enabled: Boolean(id)
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Activity, "id">) => createActivity(payload),
    onSuccess: async () => {
      toast.success("Activity created successfully.");
      await queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Omit<Activity, "id"> }) =>
      updateActivity(id, values),
    onSuccess: async (_, variables) => {
      toast.success("Activity updated successfully.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: activityKeys.all }),
        queryClient.invalidateQueries({ queryKey: activityKeys.detail(variables.id) })
      ]);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteActivity(id),
    onSuccess: async () => {
      toast.success("Activity deleted.");
      await queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}

export function useUploadActivityImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, image }: { id: string; image: string }) => uploadActivityImage(id, image),
    onSuccess: async (_, variables) => {
      toast.success("Activity image updated.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: activityKeys.all }),
        queryClient.invalidateQueries({ queryKey: activityKeys.detail(variables.id) })
      ]);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}
