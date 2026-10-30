import { NextResponse } from "next/server";
import { publicAppUrl } from "@/lib/crm/app-origin";
import { sessionCookieSecure, startPartnerLogin } from "@/lib/crm/auth";
import { SESSION_HOURS } from "@/lib/crm/constants";
import { crmEnabled } from "@/lib/crm/db";

export async function POST(request: Request) {
  if (!crmEnabled()) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const form = await request.formData();
  const result = await startPartnerLogin(String(form.get("email") ?? ""), String(form.get("pin") ?? ""), false);
  const url = publicAppUrl(result.ok ? result.next : `/partners/login?error=${result.error}`, request);
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
