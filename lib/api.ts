import axios from "axios";

import { clearAuthToken, getAuthToken, refreshAuthToken, setAuthToken } from "@/lib/auth";

type RetryableRequest = {
  _retry?: boolean;
  headers?: Record<string, string>;
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshed = await refreshAuthToken();

        if (refreshed) {
          setAuthToken(refreshed);
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${refreshed}`
          };
          return api(originalRequest);
        }
      } catch {
        clearAuthToken();
      }

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected API error occurred.";

    return Promise.reject(new Error(message));
  }
);

