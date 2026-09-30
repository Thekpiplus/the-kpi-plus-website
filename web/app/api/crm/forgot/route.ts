import { NextResponse } from "next/server";
import { requestPinReset } from "@/lib/crm/auth";
import { crmEnabled } from "@/lib/crm/db";

export async function POST(request: Request) {
  if (!crmEnabled()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  try {
    await requestPinReset(String(body.email ?? ""));
  } catch {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: true });
}
