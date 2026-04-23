const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

function getApiOrigin() {
  if (!apiBaseUrl) {
    return null;
  }

  try {
    return new URL(apiBaseUrl).origin;
  } catch {
    return null;
  }
}

export function resolveApiAssetUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  try {
    return new URL(trimmed).toString();
  } catch {
    const apiOrigin = getApiOrigin();

    if (!apiOrigin) {
      return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    }

    const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return new URL(normalizedPath, apiOrigin).toString();
  }
}
