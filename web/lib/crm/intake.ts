import { FORM_SERVICE } from "./constants";
import { prisma } from "./db";
import { notificationEmail, sendMail } from "./mail";
import { ensureCrmSeed } from "./seed";
import { hashToken, normalizePhone } from "./security";

export type WebsiteLeadInput = {
  form: string;
  name: string;
  businessName?: string;
  businessType?: string;
  phone?: string;
  email?: string;
  location?: string;
  website?: string;
  message?: string;
  pageUrl?: string;
  locale?: string;
  utm?: Record<string, string>;
  raw: Record<string, unknown>;
};

function crmBaseUrl() {
  return (process.env.CRM_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export async function intakeWebsiteLead(input: WebsiteLeadInput) {
  await ensureCrmSeed();
  const db = prisma();
  const now = new Date();
  const phone = input.phone ?? "";
  const email = (input.email ?? "").toLowerCase();
  const phoneNormalized = normalizePhone(phone);
  const service = FORM_SERVICE[input.form] ?? "";

  if (email || phoneNormalized) {
    const recent = await db.lead.findFirst({
      where: {
        formName: input.form,
        createdAt: { gte: new Date(now.getTime() - 2 * 60 * 1000) },
        OR: [
          email ? { email } : undefined,
          phoneNormalized ? { phoneNormalized } : undefined,
        ].filter(Boolean) as { email?: string; phoneNormalized?: string }[],
      },
      orderBy: { createdAt: "desc" },
    });
    if (recent) return { lead: recent, duplicate: true as const };
  }

  const newStage = await db.stage.findFirst({ where: { sortOrder: 1 } });
  if (!newStage) throw new Error("missing_stages");

  const lead = await db.lead.create({
    data: {
      stageId: newStage.id,
      contactName: input.name,
      businessName: input.businessName ?? "",
      businessType: input.businessType ?? "",
      phone,
      phoneNormalized,
      email,
      location: input.location ?? "",
      website: input.website ?? "",
      services: JSON.stringify(service ? [service] : []),
      source: "website_form",
      formName: input.form,
      pageUrl: input.pageUrl ?? "",
      message: input.message ?? "",
      rawPayload: JSON.stringify(input.raw),
      utm: JSON.stringify(input.utm ?? {}),
      locale: input.locale || "th",
    },
  });

  await db.activity.create({
    data: {
      leadId: lead.id,
      type: "task",
      title: "First response",
      dueAt: now,
      firstResponse: true,
    },
  });
  await db.lead.update({
    where: { id: lead.id },
    data: { nextActivityAt: now },
  });
  await db.leadEvent.create({
    data: {
      leadId: lead.id,
      type: "created",
      detail: `Website form ${input.form}`,
    },
  });

  await queueLeadNotification(lead.id);
  return { lead, duplicate: false as const };
}

export async function queueLeadNotification(leadId: string) {
  const db = prisma();
  const existing = await db.notification.findFirst({
    where: { leadId, kind: "new_lead", status: { in: ["queued", "sent"] } },
  });
  if (existing) return existing;

  const to = notificationEmail();
  const row = await db.notification.create({
    data: {
      leadId,
      kind: "new_lead",
      toEmail: to || "(unset)",
      status: "queued",
    },
  });
  return retryNotification(row.id);
}

export async function retryNotification(id: string) {
  const db = prisma();
  const row = await db.notification.findUnique({ where: { id }, include: { lead: true } });
  if (!row || row.status === "sent") return row;
  const to = notificationEmail();
  if (!to) {
    return db.notification.update({
      where: { id },
      data: {
        status: "failed",
        error: "LEAD_NOTIFICATION_EMAIL is not set. Confirm the recipient before launch.",
        attempts: { increment: 1 },
        lastAttemptAt: new Date(),
        toEmail: "(unset)",
      },
    });
  }

  const link = `${crmBaseUrl()}/crm/leads/${row.leadId}`;
  const text = [
    `ลีดใหม่จากเว็บไซต์ The KPI Plus`,
    `ชื่อ: ${row.lead.contactName}`,
    `โรงแรม/ธุรกิจ: ${row.lead.businessName}`,
    `อีเมล: ${row.lead.email || "-"}`,
    `โทร: ${row.lead.phone || "-"}`,
    `ฟอร์ม: ${row.lead.formName}`,
    `หน้า: ${row.lead.pageUrl || "-"}`,
    `รายละเอียดจากแบบฟอร์ม:`,
    row.lead.message || "-",
    ``,
    `เปิดใน CRM: ${link}`,
  ].join("\n");

  try {
    await sendMail({
      to,
      subject: `ลีดใหม่: ${row.lead.contactName} · ${row.lead.businessName || row.lead.formName}`,
      text,
    });
    return db.notification.update({
      where: { id },
      data: { status: "sent", error: "", attempts: { increment: 1 }, lastAttemptAt: new Date(), toEmail: to },
    });
  } catch (error) {
    return db.notification.update({
      where: { id },
      data: {
        status: "failed",
        error: error instanceof Error ? error.message : "send_failed",
        attempts: { increment: 1 },
        lastAttemptAt: new Date(),
        toEmail: to,
      },
    });
  }
}

export function hashForLog(value: string) {
  return hashToken(value).slice(0, 8);
}
