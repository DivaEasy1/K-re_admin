const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

function normalizePathname(value: string) {
  return value
    .replace(/\\/g, "/")
    .split("/")
    .map((segment) => {
      if (!segment) {
        return segment;
      }

      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch {
        return encodeURIComponent(segment);
      }
    })
    .join("/");
}

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
    const url = new URL(trimmed);
    url.pathname = normalizePathname(url.pathname);
    return url.toString();
  } catch {
    const apiOrigin = getApiOrigin();
    const normalizedPath = normalizePathname(trimmed.startsWith("/") ? trimmed : `/${trimmed}`);

    if (!apiOrigin) {
      return normalizedPath;
    }

    return new URL(normalizedPath, apiOrigin).toString();
  }
}
