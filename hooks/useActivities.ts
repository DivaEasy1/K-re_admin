"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { resolveApiAssetUrl } from "@/lib/media";
import type { Activity } from "@/types";

const activityKeys = {
  all: ["activities"] as const,
  detail: (id: string) => ["activities", id] as const
};

function normalizeActivity(activity: Activity) {
  return {
    ...activity,
    image: resolveApiAssetUrl(activity.image)
  } satisfies Activity;
}

export function useActivities() {
  return useQuery<Activity[]>({
    queryKey: activityKeys.all,
    queryFn: async () => {
      const response = await api.get("/activities?all=true");
      const payload = (response.data.data || response.data) as Activity[];
      const activities = Array.isArray(payload) ? payload.map(normalizeActivity) : [];

      if (process.env.NODE_ENV !== "production") {
        console.log("[activities] fetched list", {
          count: activities.length,
          activities: activities.map((activity) => ({
            id: activity.id,
            title: activity.title,
            isActive: activity.isActive,
            image: activity.image
          }))
        });
      }

      return activities;
    },
    staleTime: 0
  });
}

export function useActivity(id: string) {
  return useQuery<Activity>({
    queryKey: activityKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(`/activities/${id}`);
      return normalizeActivity((response.data.data || response.data) as Activity);
    },
    enabled: Boolean(id)
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post("/activities", payload);
      return normalizeActivity((response.data.data || response.data) as Activity);
    },
    onSuccess: async (createdActivity) => {
      queryClient.setQueryData<Activity[]>(activityKeys.all, (current = []) => [createdActivity, ...current]);
      toast.success("Activite creee avec succes.");
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
    mutationFn: async ({ id, values }: { id: string; values: any }) => {
      const response = await api.put(`/activities/${id}`, values);
      return normalizeActivity((response.data.data || response.data) as Activity);
    },
    onSuccess: async (updatedActivity, variables) => {
      queryClient.setQueryData<Activity[]>(activityKeys.all, (current = []) =>
        current.map((activity) => (activity.id === variables.id ? updatedActivity : activity))
      );
      queryClient.setQueryData<Activity>(activityKeys.detail(variables.id), updatedActivity);
      toast.success("Activite mise a jour.");
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

export function useToggleActivityStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await api.put(`/activities/${id}`, { isActive });
      return normalizeActivity((response.data.data || response.data) as Activity);
    },
    onSuccess: async (updatedActivity, variables) => {
      queryClient.setQueryData<Activity[]>(activityKeys.all, (current = []) =>
        current.map((activity) => (activity.id === variables.id ? updatedActivity : activity))
      );
      queryClient.setQueryData<Activity>(activityKeys.detail(variables.id), updatedActivity);
      toast.success(updatedActivity.isActive ? "Activite activee." : "Activite desactivee.");
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
    mutationFn: async (id: string) => {
      const response = await api.delete(`/activities/${id}`);
      return response.data.data || response.data;
    },
    onSuccess: async (_, deletedId) => {
      queryClient.setQueryData<Activity[]>(activityKeys.all, (current = []) =>
        current.filter((activity) => activity.id !== deletedId)
      );
      toast.success("Activite supprimee.");
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
    mutationFn: async ({ id, image }: { id: string; image: string }) => {
      const response = await api.put(`/activities/${id}`, { image });
      return response.data.data || response.data;
    },
    onSuccess: async (_, variables) => {
      toast.success("Image de l'activite mise a jour.");
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

export function useUploadActivityImageFile() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/activities/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const payload = (response.data.data || response.data) as { image: string };
      return { image: resolveApiAssetUrl(payload.image) ?? payload.image };
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}
