import { cookies } from "next/headers";

import { adminProfile, getMessages } from "@/lib/mock-data";
import type { Activity, Station } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface DashboardAdmin {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "SUPER_ADMIN";
  lastLoginAt?: string | null;
}

function getApiBaseUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  return apiUrl.replace(/\/api\/?$/, "");
}

async function fetchApi<T>(path: string, init?: RequestInit) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as ApiResponse<T>;
}

export async function getDashboardActivityData() {
  try {
    const response = await fetchApi<Activity[]>("/api/activities?all=true");
    return response.data ?? [];
  } catch {
    return [];
  }
}

export async function getDashboardStationData() {
  try {
    const response = await fetchApi<Station[]>("/api/stations");
    return response.data ?? [];
  } catch {
    return [];
  }
}

export async function getDashboardAdminData() {
  try {
    const response = await fetchApi<DashboardAdmin>("/api/auth/me");
    return response.data ?? null;
  } catch {
    return null;
  }
}

export async function getDashboardViewModel() {
  const [activities, stations, admin, messages] = await Promise.all([
    getDashboardActivityData(),
    getDashboardStationData(),
    getDashboardAdminData(),
    getMessages()
  ]);

  const openStations = stations.filter((station) => station.status === "OPEN").length;
  const comingSoonStations = stations.filter((station) => station.status === "COMING_SOON").length;
  const unreadMessages = messages.filter((message) => message.status === "NEW").length;

  return {
    activities,
    stats: {
      totalStations: stations.length,
      openStations,
      comingSoonStations,
      totalActivities: activities.length,
      unreadMessages,
      lastLogin: admin?.lastLoginAt || adminProfile.lastLogin,
    }
  };
}
