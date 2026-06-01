import axios, { type InternalAxiosRequestConfig } from "axios";

import { refreshAuthToken } from "@/lib/auth";

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type ApiValidationIssue = {
  message?: string;
  path?: unknown[];
};

// CSRF token storage
let csrfToken: string | null = null;

const SKIP_REFRESH_PATHS = ["/auth/login", "/auth/logout", "/auth/refresh", "/auth/csrf-token"];
const SKIP_CSRF_PATHS = ["/auth/login", "/auth/refresh"];
const STATE_CHANGING_METHODS = ["POST", "PUT", "DELETE", "PATCH"];

function canRefresh(url?: string) {
  if (!url) {
    return true;
  }

  return !SKIP_REFRESH_PATHS.some((path) => url.includes(path));
}

function formatIssuePath(path?: unknown[]) {
  if (!Array.isArray(path) || path.length === 0) {
    return "";
  }

  return path
    .map((segment) => String(segment))
    .filter(Boolean)
    .join(".");
}

function formatValidationIssues(issues: ApiValidationIssue[]) {
  const formatted = issues
    .map((issue) => {
      if (!issue || typeof issue !== "object") {
        return "";
      }

      const message = typeof issue.message === "string" ? issue.message.trim() : "";
      const fieldPath = formatIssuePath(issue.path);

      if (!message) {
        return "";
      }

      return fieldPath ? `${fieldPath}: ${message}` : message;
    })
    .filter(Boolean);

  return formatted.length > 0 ? formatted.join(" ") : undefined;
}

function extractApiErrorMessage(payload: unknown): string | undefined {
  if (!payload) {
    return undefined;
  }

  if (typeof payload === "string") {
    const trimmed = payload.trim();

    if (!trimmed) {
      return undefined;
    }

    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        return extractApiErrorMessage(JSON.parse(trimmed));
      } catch {
        return trimmed;
      }
    }

    return trimmed;
  }

  if (Array.isArray(payload)) {
    return formatValidationIssues(payload as ApiValidationIssue[]);
  }

  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    return (
      extractApiErrorMessage(record.error) ??
      extractApiErrorMessage(record.message) ??
      extractApiErrorMessage(record.data)
    );
  }

  return undefined;
}

const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000
} as const;

export const api = axios.create({
  ...apiConfig,
});

async function getCSRFToken(): Promise<string | null> {
  if (csrfToken) {
    return csrfToken;
  }

  try {
    // Use a plain client here to avoid auth refresh recursion when the session is expired.
    const response = await axios.get("/auth/csrf-token", apiConfig);
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
      extractApiErrorMessage(error.response?.data) ||
      error.message ||
      "Une erreur API inattendue est survenue.";

    return Promise.reject(new Error(message));
  }
);
