import { NextResponse } from "next/server";
import type { NextRequest } from "next/request";

const publicExact = new Set(["/admin", "/admin/forgot", "/crm/login", "/crm/forgot", "/partners/login", "/partners/apply"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-crm-path", pathname);
  requestHeaders.set("x-crm-search", request.nextUrl.search);

  if (pathname === "/crm/login" || pathname === "/crm/forgot") {
    return NextResponse.redirect(new URL(pathname === "/crm/forgot" ? "/admin/forgot" : "/admin", request.url));
  }

  if (pathname === "/partners/apply") {
    return NextResponse.redirect(new URL("/partner#apply", request.url));
  }

  if (pathname.startsWith("/partners") || pathname.startsWith("/api/partners") || pathname.startsWith("/crm") || pathname.startsWith("/api/crm")) {
    const isPublic =
      publicExact.has(pathname) ||
      pathname.startsWith("/admin/reset") ||
      pathname.startsWith("/crm/reset") ||
      pathname.startsWith("/api/crm/login") ||
      pathname.startsWith("/api/partners/login") ||
      pathname.startsWith("/api/crm/setup") ||
      pathname.startsWith("/api/crm/device") ||
      pathname.startsWith("/api/crm/forgot") ||
      pathname.startsWith("/api/crm/reset");
    if (!isPublic && !request.cookies.get("crm_session") && (pathname.startsWith("/api/crm") || pathname.startsWith("/api/partners"))) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    if (!isPublic && !request.cookies.get("crm_session") && (pathname.startsWith("/crm") || pathname.startsWith("/partners"))) {
      return NextResponse.redirect(new URL(pathname.startsWith("/partners") ? "/partners/login" : "/admin", request.url));
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/crm", "/crm/:path*", "/api/crm/:path*", "/partners", "/partners/:path*", "/api/partners/:path*"],
};
