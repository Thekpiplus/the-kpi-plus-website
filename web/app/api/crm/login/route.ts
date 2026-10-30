import { NextResponse } from "next/server";
import { publicAppUrl } from "@/lib/crm/app-origin";
import { sessionCookieSecure, startLogin } from "@/lib/crm/auth";
import { SESSION_HOURS } from "@/lib/crm/constants";
import { crmEnabled } from "@/lib/crm/db";

export async function POST(request: Request) {
  if (!crmEnabled()) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const contentType = request.headers.get("content-type") ?? "";
  let login = "";
  let password = "";
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    login = String(body.email ?? body.username ?? body.login ?? "");
    password = String(body.password ?? "");
  } else {
    const form = await request.formData();
    login = String(form.get("email") ?? form.get("username") ?? form.get("login") ?? "");
    password = String(form.get("password") ?? "");
  }

  const result = await startLogin(login, password, undefined, false);
  if (contentType.includes("application/json")) {
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }
  const url = publicAppUrl(result.ok ? result.next : `/admin?error=${result.error}`, request);
  const response = NextResponse.redirect(url, 303);
  if (result.ok && result.sessionToken) {
    response.cookies.set("crm_session", result.sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: sessionCookieSecure(),
      path: "/",
      maxAge: SESSION_HOURS * 60 * 60,
    });
  }
  return response;
}
