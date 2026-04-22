"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteMessage, getMessage, getMessages, updateMessageStatus } from "@/lib/mock-data";
import type { MessageStatus } from "@/types";

const messageKeys = {
  all: (status?: MessageStatus) => ["messages", status ?? "all"] as const,
  detail: (id: string) => ["messages", id] as const
};

export function useMessages(status?: MessageStatus) {
  return useQuery({
    queryKey: messageKeys.all(status),
    queryFn: () => getMessages(status)
  });
}

export function useMessage(id: string) {
  return useQuery({
    queryKey: messageKeys.detail(id),
    queryFn: () => getMessage(id)
  });
}

export function useUpdateMessageStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MessageStatus }) =>
      updateMessageStatus(id, status),
    onSuccess: async () => {
      toast.success("Message status updated.");
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: async () => {
      toast.success("Message deleted.");
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}
