import axios from "axios";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "SUPER_ADMIN";
  lastLoginAt?: string | null;
}

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
});

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

async function requestCurrentAdmin() {
  const response = await authApi.get("/auth/me");
  return (response.data.data || response.data) as AuthUser;
}

export async function refreshAuthToken() {
  try {
    await authApi.post("/auth/refresh", {});
    return true;
  } catch {
    return false;
  }
}

export async function getCurrentAdmin() {
  try {
    return await requestCurrentAdmin();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const refreshed = await refreshAuthToken();

      if (!refreshed) {
        return null;
      }

      try {
        return await requestCurrentAdmin();
      } catch {
        return null;
      }
    }

    throw new Error(getErrorMessage(error, "Impossible de recuperer la session."));
  }
}

export async function loginAdmin(email: string, password: string) {
  try {
    const response = await authApi.post("/auth/login", { email, password });
    const payload = response.data.data || response.data;

    if (payload?.user) {
      return payload.user as AuthUser;
    }

    if (payload?.id && payload?.email) {
      return payload as AuthUser;
    }

    throw new Error("Reponse de connexion invalide.");
  } catch (error) {
    throw new Error(getErrorMessage(error, "Connexion impossible."));
  }
}

export async function logoutAdmin() {
  try {
    await authApi.post("/auth/logout", {});
  } catch {
    // The app clears local session state even if the server cookie has already expired.
  }
}

export function getUserInitials(name?: string) {
  if (!name) {
    return "AD";
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "AD";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getRoleLabel(role?: AuthUser["role"]) {
  if (role === "SUPER_ADMIN") {
    return "Super administrateur";
  }

  if (role === "ADMIN") {
    return "Administrateur";
  }

  return "Administrateur";
}
