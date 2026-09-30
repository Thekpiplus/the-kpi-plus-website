import { NextResponse } from "next/server";
import { bootstrapOwner } from "@/lib/crm/auth";
import { crmEnabled } from "@/lib/crm/db";

export async function POST(request: Request) {
  if (!crmEnabled()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  const result = await bootstrapOwner({
    name: String(body.name ?? ""),
    phone: String(body.phone ?? ""),
    email: String(body.email ?? ""),
    pin: String(body.pin ?? ""),
  });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
