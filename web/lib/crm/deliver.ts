import { NextResponse } from "next/server";
import { crmEnabled } from "./db";
import { intakeWebsiteLead, type WebsiteLeadInput } from "./intake";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function optionalWebhook(payload: unknown) {
  const webhook = process.env.AUDIT_WEBHOOK_URL;
  if (!webhook) return;
  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => null);
}

export async function respondWithWebsiteLead(input: WebsiteLeadInput) {
  if (crmEnabled()) {
    try {
      await intakeWebsiteLead(input);
      await optionalWebhook(input.raw);
      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("[crm-intake]", error);
      return NextResponse.json({ error: "save_failed" }, { status: 500 });
    }
  }

  const webhook = process.env.AUDIT_WEBHOOK_URL;
  if (webhook) {
    const forwarded = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input.raw),
    }).catch(() => null);
    if (!forwarded?.ok) {
      return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[${input.form}]`, input.raw);
    return NextResponse.json({ ok: true, delivered: "log" });
  }

  return NextResponse.json({ error: "not_configured" }, { status: 503 });
}

export function splitContact(value: string) {
  if (value.includes("@")) return { email: value, phone: "" };
  return { phone: value, email: "" };
}

export function field(value: unknown) {
  return text(value);
}
