import { NextResponse } from "next/server";
import { startPartnerLogin } from "@/lib/crm/auth";
import { SESSION_HOURS } from "@/lib/crm/constants";
import { crmEnabled } from "@/lib/crm/db";
import { ensureCrmSeed } from "@/lib/crm/seed";

export async function POST(request: Request) {
  if (!crmEnabled()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  try {
    await ensureCrmSeed();
  } catch {
    // Continue so an existing partner can still sign in.
  }

  const form = await request.formData();
  const result = await startPartnerLogin(String(form.get("email") ?? ""), String(form.get("pin") ?? ""));
  const url = new URL(result.ok ? result.next : `/partners/login?error=${result.error}`, request.url);
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
