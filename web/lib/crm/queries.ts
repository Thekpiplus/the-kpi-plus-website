import { archiveWhere, leadArchiveMap, leadArchivedAt, leadIdsByArchive, type LeadArchiveView } from "./archive";
import { prisma } from "./db";
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
    where: { role: { not: "partner" } },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

export async function listUsers(filters: { q?: string; role?: string } = {}) {
  const q = filters.q?.trim();
  const users = await prisma().user.findMany({
    where: {
      role: filters.role || undefined,
      OR: q
        ? [{ name: { contains: q } }, { email: { contains: q } }, { phone: { contains: q } }]
        : undefined,
    },
    orderBy: { name: "asc" },
  });
  const extras = await prisma()
    .$queryRawUnsafe<{ id: string; modules: string | null }[]>(`SELECT "id", "modules" FROM "User"`)
    .catch(() => [] as { id: string; modules: string | null }[]);
  const map = new Map(extras.map((item) => [item.id, item.modules ?? ""]));
  return users.map((user) => ({ ...user, modules: map.get(user.id) ?? (user as { modules?: string }).modules ?? "" }));
}

export async function userById(id: string) {
  const user = await prisma().user.findUnique({ where: { id } });
  if (!user) return null;
  const extra = await prisma()
    .$queryRawUnsafe<{ modules: string | null }[]>(`SELECT "modules" FROM "User" WHERE "id" = ?`, id)
    .catch(() => [] as { modules: string | null }[]);
  return { ...user, modules: extra[0]?.modules ?? (user as { modules?: string }).modules ?? "" };
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
  const like = `%${email}%`;
  try {
    const rows = await prisma().$queryRaw<
      {
        id: string;
        phone: string;
        email: string;
        userId: string;
        userName: string;
        role: string;
        shop: string;
        ip: string;
        userAgent: string;
        success: number | boolean;
        reason: string;
        createdAt: string | Date;
      }[]
    >`
      SELECT "id", "phone", "email", "userId", "userName", "role", "shop", "ip", "userAgent", "success", "reason", "createdAt"
      FROM "LoginAttempt"
      WHERE (${email} = '' OR "email" LIKE ${like} OR "phone" LIKE ${like})
      ORDER BY "createdAt" DESC
      LIMIT 200
    `;
    return rows
      .filter((row) => {
        if (filters.success === "yes") return Boolean(row.success);
        if (filters.success === "no") return !row.success;
        return true;
      })
      .map((row) => ({
        id: row.id,
        phone: row.phone,
        email: row.email || row.phone,
        userId: row.userId ?? "",
        userName: row.userName ?? "",
        role: row.role ?? "",
        shop: row.shop || "—",
        ip: row.ip,
        userAgent: row.userAgent ?? "",
        success: Boolean(row.success),
        reason: row.reason,
        createdAt: row.createdAt instanceof Date ? row.createdAt : new Date(row.createdAt),
      }));
  } catch {
    const fallback = await prisma().loginAttempt.findMany({
      where: {
        phone: email ? { contains: email } : undefined,
        success: filters.success === "yes" ? true : filters.success === "no" ? false : undefined,
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return fallback.map((row) => ({
      id: row.id,
      phone: row.phone,
      email: row.phone,
      userId: "",
      userName: "",
      role: "",
      shop: "—",
      ip: row.ip,
      userAgent: "",
      success: row.success,
      reason: row.reason,
      createdAt: row.createdAt,
    }));
  }
}

export async function userCounts() {
  const db = prisma();
  const [total, staff, partners] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: { not: "partner" } } }),
    db.user.count({ where: { role: "partner" } }),
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
