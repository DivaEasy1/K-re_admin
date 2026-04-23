import axios, { type InternalAxiosRequestConfig } from "axios";

import { refreshAuthToken } from "@/lib/auth";

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const SKIP_REFRESH_PATHS = ["/auth/login", "/auth/logout", "/auth/refresh"];

function canRefresh(url?: string) {
  if (!url) {
    return true;
  }

  return !SKIP_REFRESH_PATHS.some((path) => url.includes(path));
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      canRefresh(originalRequest.url)
    ) {
      originalRequest._retry = true;

      const refreshed = await refreshAuthToken();

      if (refreshed) {
        return api(originalRequest);
      }
    }

    if (error.response?.status === 401 && typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }

    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Une erreur API inattendue est survenue.";

    return Promise.reject(new Error(message));
  }
);
