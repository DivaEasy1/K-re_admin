const AUTH_TOKEN_KEY = "k-re-admin-token";
const ADMIN_EMAIL = "admin@k-re.ma";
const ADMIN_PASSWORD = "oceanadmin";

export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function refreshAuthToken() {
  return null;
}

export async function loginAdmin(email: string, password: string) {
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    throw new Error("Use the demo credentials shown below the form.");
  }

  setAuthToken("preview-session-token");
  return {
    email,
    token: "preview-session-token"
  };
}

export function logoutAdmin() {
  clearAuthToken();
}

export const previewCredentials = {
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD
};

