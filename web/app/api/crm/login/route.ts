import { NextResponse } from "next/server";
import { startLogin } from "@/lib/crm/auth";
import { SESSION_HOURS } from "@/lib/crm/constants";
import { crmEnabled } from "@/lib/crm/db";
import { ensureCrmSeed } from "@/lib/crm/seed";

export async function POST(request: Request) {
  if (!crmEnabled()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  try {
    await ensureCrmSeed();
  } catch {
    // Continue so an existing admin user can still sign in.
  }

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

  const result = await startLogin(login, password);
  if (contentType.includes("application/json")) {
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }
  const url = new URL(result.ok ? result.next : `/admin?error=${result.error}`, request.url);
  const response = NextResponse.redirect(url, 303);
  if (result.ok && result.sessionToken) {
    response.cookies.set("crm_session", result.sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_HOURS * 60 * 60,
    });
  }
  return response;
}
