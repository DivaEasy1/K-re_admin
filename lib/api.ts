import axios, { type InternalAxiosRequestConfig } from "axios";

import { refreshAuthToken } from "@/lib/auth";

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// CSRF token storage
let csrfToken: string | null = null;

const SKIP_REFRESH_PATHS = ["/auth/login", "/auth/logout", "/auth/refresh"];
const SKIP_CSRF_PATHS = ["/auth/login"];
const STATE_CHANGING_METHODS = ["POST", "PUT", "DELETE", "PATCH"];

function canRefresh(url?: string) {
  if (!url) {
    return true;
  }

  return !SKIP_REFRESH_PATHS.some((path) => url.includes(path));
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

async function getCSRFToken(): Promise<string | null> {
  if (csrfToken) {
    return csrfToken;
  }

  try {
    const response = await api.get("/auth/csrf-token");
    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error("Failed to get CSRF token:", error);
    return null;
  }
}

export const clearCSRFToken = () => {
  csrfToken = null;
};

// Add CSRF token to state-changing requests
api.interceptors.request.use(
  async (config) => {
    const method = config.method?.toUpperCase() || "";

    if (
      STATE_CHANGING_METHODS.includes(method) &&
      !SKIP_CSRF_PATHS.some((path) => config.url?.includes(path))
    ) {
      const token = await getCSRFToken();
      if (token) {
        config.headers = config.headers || {};
        (config.headers as Record<string, string>)["X-CSRF-Token"] = token;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

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
        // Clear CSRF token on refresh to get a new one
        csrfToken = null;
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
