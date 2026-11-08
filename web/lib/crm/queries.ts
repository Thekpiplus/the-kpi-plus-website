import { archiveWhere, leadArchiveMap, leadArchivedAt, leadIdsByArchive, type LeadArchiveView } from "./archive";
import { prisma } from "./db";
import { roleQueryValues } from "./roles";
import type { LeadOrigin } from "./sources";

function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function formatThaiDateTime(value: Date | string | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(date);
}

export function formatMoney(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(value);
}

export async function staffDirectory() {
  return prisma().user.findMany({
    where: { role: { notIn: ["partner", "partners"] } },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

export async function listUsers(filters: { q?: string; role?: string } = {}) {
  const q = filters.q?.trim();
  const roleValues = roleQueryValues(filters.role);
  const users = await prisma().user.findMany({
    where: {
      role: roleValues ? { in: roleValues } : undefined,
      OR: q
        ? [
            { name: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
            { username: { contains: q } },
          ]
        : undefined,
    },
    orderBy: { name: "asc" },
  });
  const lastLogin = await lastLoginAtByUsers(
    users.map((user) => ({ id: user.id, email: user.email })),
  ).catch(() => new Map<string, Date>());
  return users.map((user) => ({
    ...user,
    modules: user.modules ?? "",
    username: user.username ?? null,
    lastLoginAt: lastLogin.get(user.id) ?? null,
  }));
}

/** Latest successful login (LoginAttempt) or session create time per user. */
export async function lastLoginAtByUsers(users: Array<{ id: string; email: string }>) {
  const result = new Map<string, Date>();
  if (!users.length) return result;
  const ids = users.map((user) => user.id);
  const emails = users.map((user) => user.email.toLowerCase()).filter(Boolean);
  const emailToId = new Map(users.map((user) => [user.email.toLowerCase(), user.id]));

  const attempts = await prisma().loginAttempt.findMany({
    where: {
      success: true,
      OR: [{ userId: { in: ids } }, ...(emails.length ? [{ email: { in: emails } }] : [])],
    },
    select: { userId: true, email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  for (const row of attempts) {
    const userId = row.userId || emailToId.get(row.email.toLowerCase()) || "";
    if (!userId || result.has(userId)) continue;
    result.set(userId, row.createdAt);
  }

  const missing = ids.filter((id) => !result.has(id));
  if (missing.length) {
    const sessions = await prisma().session.findMany({
      where: { userId: { in: missing } },
      select: { userId: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    for (const row of sessions) {
      if (result.has(row.userId)) continue;
      result.set(row.userId, row.createdAt);
    }
  }

  return result;
}

export async function userById(id: string) {
  const user = await prisma().user.findUnique({ where: { id } });
  if (!user) return null;
  return {
    ...user,
    modules: user.modules ?? "",
    username: user.username ?? null,
  };
}

export type LoginLogRow = {
  id: string;
  phone: string;
  email: string;
  userId: string;
  userName: string;
  role: string;
  shop: string;
  ip: string;
  userAgent: string;
  success: boolean;
  reason: string;
  createdAt: Date;
};

export async function searchLoginLogs(filters: { email?: string; success?: "yes" | "no" } = {}) {
  const email = filters.email?.trim().toLowerCase() ?? "";
  const rows = await prisma().loginAttempt.findMany({
    where: {
      AND: [
        email
          ? {
              OR: [{ email: { contains: email } }, { phone: { contains: email } }],
            }
          : {},
        filters.success === "yes"
          ? { success: true }
          : filters.success === "no"
            ? { success: false }
            : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const missingNameKeys = [
    ...new Set(
      rows
        .filter((row) => !row.userName?.trim())
        .flatMap((row) => [row.userId, row.email, row.phone].map((value) => value.trim()).filter(Boolean)),
    ),
  ];
  const users =
    missingNameKeys.length === 0
      ? []
      : await prisma().user.findMany({
          where: {
            OR: [
              { id: { in: missingNameKeys } },
              { email: { in: missingNameKeys } },
              { username: { in: missingNameKeys } },
            ],
          },
          select: { id: true, email: true, username: true, name: true, role: true },
        });
  const byId = new Map(users.map((user) => [user.id, user]));
  const byEmail = new Map(users.map((user) => [user.email.toLowerCase(), user]));
  const byUsername = new Map(
    users.filter((user) => user.username).map((user) => [user.username!.toLowerCase(), user]),
  );

  return rows.map((row) => {
    const emailValue = (row.email || row.phone || "").trim();
    const matched =
      (row.userId && byId.get(row.userId)) ||
      (emailValue && byEmail.get(emailValue.toLowerCase())) ||
      (emailValue && byUsername.get(emailValue.toLowerCase())) ||
      null;
    return {
      id: row.id,
      phone: row.phone,
      email: emailValue,
      userId: row.userId || matched?.id || "",
      userName: row.userName?.trim() || matched?.name?.trim() || "",
      role: row.role || matched?.role || "",
      shop: row.shop || "—",
      ip: row.ip,
      userAgent: row.userAgent ?? "",
      success: row.success,
      reason: row.reason,
      createdAt: row.createdAt,
    };
  });
}

export async function userCounts() {
  const db = prisma();
  const [total, staff, partners] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: { notIn: ["partner", "partners"] } } }),
    db.user.count({ where: { role: { in: ["partner", "partners"] } } }),
  ]);
  return { total, staff, partners };
}

export async function todayLists() {
  const db = prisma();
  const now = new Date();
  const start = startOfDay(now);
  const end = endOfDay(now);
  const activeIds = await leadIdsByArchive("active");
  const active = archiveWhere(activeIds);

  const [overdue, dueToday, upcoming, firstResponse, noNext, newLeads] = await Promise.all([
    db.activity.findMany({
      where: { status: "open", dueAt: { lt: start }, lead: active },
      include: { lead: { include: { stage: true } } },
      orderBy: { dueAt: "asc" },
    }),
    db.activity.findMany({
      where: { status: "open", dueAt: { gte: start, lte: end }, lead: active },
      include: { lead: { include: { stage: true } } },
      orderBy: { dueAt: "asc" },
    }),
    db.activity.findMany({
      where: { status: "open", dueAt: { gt: end }, lead: active },
      include: { lead: { include: { stage: true } } },
      orderBy: { dueAt: "asc" },
      take: 12,
    }),
    db.activity.findMany({
      where: { status: "open", firstResponse: true, lead: active },
      include: { lead: { include: { stage: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.lead.findMany({
      where: { noFollowUp: false, nextActivityAt: null, outcome: "", ...active },
      include: { stage: true },
      orderBy: { updatedAt: "desc" },
    }),
    db.lead.findMany({
      where: { stage: { sortOrder: 1 }, ...active },
      include: { stage: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
  ]);

  return { overdue, dueToday, upcoming, firstResponse, noNext, newLeads };
}

export async function searchLeads(filters: {
  q?: string;
  origin?: LeadOrigin;
  stageId?: string;
  ownerId?: string;
  archive?: LeadArchiveView;
}) {
  const q = filters.q?.trim();
  const ids = await leadIdsByArchive(filters.archive ?? "active");
  const leads = await prisma().lead.findMany({
    where: {
      ...archiveWhere(ids),
      source: filters.origin === "web" ? "website_form" : filters.origin === "manual" ? { not: "website_form" } : undefined,
      stageId: filters.stageId || undefined,
      ownerId: filters.ownerId || undefined,
      OR: q
        ? [
            { contactName: { contains: q } },
            { businessName: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
            { location: { contains: q } },
            { message: { contains: q } },
            { formName: { contains: q } },
          ]
        : undefined,
    },
    include: { stage: true },
    orderBy: { updatedAt: "desc" },
  });
  const archived = await leadArchiveMap(leads.map((lead) => lead.id));
  return leads.map((lead) => ({ ...lead, archivedAt: archived.get(lead.id) ?? null }));
}

export async function allLeads(origin?: LeadOrigin) {
  return searchLeads({ origin });
}

export async function leadOriginCounts() {
  const db = prisma();
  const active = archiveWhere(await leadIdsByArchive("active"));
  const [web, manual] = await Promise.all([
    db.lead.count({ where: { source: "website_form", ...active } }),
    db.lead.count({ where: { source: { not: "website_form" }, ...active } }),
  ]);
  return { web, manual, total: web + manual };
}

export async function leadById(id: string) {
  const db = prisma();
  try {
  const lead = await db.lead.findUnique({
      where: { id },
      include: {
        stage: true,
        partner: true,
        payments: { orderBy: { createdAt: "desc" } },
        commissions: { include: { partner: true }, orderBy: { createdAt: "desc" } },
        activities: { orderBy: { dueAt: "desc" } },
        events: { orderBy: { createdAt: "desc" } },
        notifications: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!lead) return null;
    return { ...lead, archivedAt: await leadArchivedAt(id) };
  } catch {
    const lead = await db.lead.findUnique({
      where: { id },
      include: {
        stage: true,
        activities: { orderBy: { dueAt: "desc" } },
        events: { orderBy: { createdAt: "desc" } },
        notifications: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!lead) return null;
    return { ...lead, archivedAt: await leadArchivedAt(id) };
  }
}

export async function openActivities() {
  const active = archiveWhere(await leadIdsByArchive("active"));
  return prisma().activity.findMany({
    where: { status: "open", lead: active },
    include: { lead: { include: { stage: true } } },
    orderBy: { dueAt: "asc" },
  });
}

export async function failedNotifications() {
  return prisma().notification.findMany({
    where: { status: { in: ["failed", "queued"] } },
    include: { lead: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function pipelineData() {
  const active = archiveWhere(await leadIdsByArchive("active"));
  return prisma().stage.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      leads: {
        where: active,
        include: { activities: { where: { status: "open" }, orderBy: { dueAt: "asc" }, take: 1 } },
        orderBy: { updatedAt: "desc" },
      },
    },
  });
}
