function isInternalHost(host: string) {
  return !host || host.startsWith("127.0.0.1") || host.startsWith("0.0.0.0");
}

/** Public site origin for auth redirects. Hostinger Node.js request.url is often 127.0.0.1. */
export function publicAppOrigin(request: Request) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const requestHost = forwardedHost || request.headers.get("host")?.split(",")[0]?.trim() || "";

  if (!isInternalHost(requestHost)) {
    if (forwardedHost) return `${forwardedProto || "https"}://${forwardedHost}`;
    const proto = forwardedProto || (requestHost.startsWith("localhost") ? "http" : "https");
    return `${proto}://${requestHost}`;
  }

  const envBase = process.env.CRM_BASE_URL?.trim();
  if (envBase) {
    try {
      return new URL(envBase).origin;
    } catch {
      // ignore invalid env
    }
  }

  try {
    return new URL(request.url).origin;
  } catch {
    return "http://localhost:3000";
  }
}

export function publicAppUrl(path: string, request: Request) {
  return new URL(path, `${publicAppOrigin(request)}/`);
}
