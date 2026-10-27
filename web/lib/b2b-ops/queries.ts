import { prisma } from "@/lib/crm/db";
import { staffDirectory } from "@/lib/crm/queries";
import { b2bAccessFor } from "./access";
import { ensureB2bOpsSchema } from "./ensure";
import { maskCommercial, maskEmail, maskPerson, maskPhone } from "./privacy";
import { b2bSubtaskProgress } from "./progress";
import {
  isActivityStatus,
  isActivityType,
  isDepartment,
  isPartnerType,
  isPriority,
  isRateStatus,
  isStatus,
  normalizeActivityStatus,
  normalizeActivityType,
  normalizeSubtaskStatus,
  PRIORITY_RANK,
  splitHotels,
  type B2bAccessView,
  type B2bActivityView,
  type B2bAuditView,
  type B2bBookingView,
  type B2bContactView,
  type B2bFileView,
  type B2bMaterialView,
  type B2bNoteView,
  type B2bPartnerDetail,
  type B2bPartnerListItem,
  type B2bPriority,
  type B2bSort,
  type B2bSubtaskView,
  type B2bTermView,
} from "./types";

export { formatB2bDate, formatB2bDateTime } from "./format";

function iso(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

async function namesById() {
  const staff = await staffDirectory().catch(() => [] as Array<{ id: string; name: string }>);
  return new Map(staff.map((item) => [item.id, item.name]));
}

const ACTIVITY_NEST = {
  subtasks: { orderBy: { sortOrder: "asc" as const } },
  comments: { orderBy: { createdAt: "desc" as const }, take: 20 },
  files: { orderBy: { createdAt: "desc" as const } },
};

function toActivityView(
  row: {
    id: string;
    partnerId: string;
    type: string;
    title: string;
    hotelName?: string;
    dueAt: Date | null;
    status: string;
    notes: string;
    ownerId: string;
    completedAt: Date | null;
    closedAt?: Date | null;
    escalatedAt?: Date | null;
    createdAt: Date;
    partner?: { name: string };
    subtasks?: Array<{
      id: string;
      name: string;
      status: string;
      completed: boolean;
      dueAt: Date | null;
      assigneeId: string;
      priority: string;
      comments: string;
    }>;
    comments?: Array<{ id: string; authorId: string; body: string; createdAt: Date }>;
    files?: Array<{ id: string; filename: string; caption: string; size: number; createdAt: Date }>;
  },
  names: Map<string, string>,
  partnerName = "",
): B2bActivityView {
  const subtasks: B2bSubtaskView[] = (row.subtasks ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    status: normalizeSubtaskStatus(item.status),
    completed: item.completed || item.status === "completed" || item.status === "done",
    dueAt: iso(item.dueAt),
    assigneeId: item.assigneeId,
    assigneeName: names.get(item.assigneeId) || "",
    priority: isPriority(item.priority) ? item.priority : "normal",
    comments: item.comments,
  }));
  const progress = b2bSubtaskProgress(subtasks);
  return {
    id: row.id,
    partnerId: row.partnerId,
    partnerName: partnerName || row.partner?.name || "",
    type: normalizeActivityType(row.type),
    title: row.title,
    hotelName: row.hotelName ?? "",
    dueAt: iso(row.dueAt),
    status: normalizeActivityStatus(row.status),
    notes: row.notes,
    ownerId: row.ownerId,
    ownerName: names.get(row.ownerId) || "",
    completedAt: iso(row.completedAt),
    closedAt: iso(row.closedAt),
    escalatedAt: iso(row.escalatedAt),
    createdAt: iso(row.createdAt),
    progress,
    subtasks,
    comments: (row.comments ?? []).map((item) => ({
      id: item.id,
      authorId: item.authorId,
      authorName: names.get(item.authorId) || "",
      body: item.body,
      createdAt: iso(item.createdAt),
    })),
    files: (row.files ?? []).map((item) => ({
      id: item.id,
      filename: item.filename,
      caption: item.caption,
      size: item.size,
      createdAt: iso(item.createdAt),
      href: `/api/crm/b2b/activity-files/${item.id}`,
    })),
  };
}

function toListItem(
  row: {
    id: string;
    name: string;
    type: string;
    market: string;
    contactPerson: string;
    contactChannel: string;
    ownerId: string;
    department: string;
    priority: string;
    status: string;
    nextAction: string;
    nextActionAt: Date | null;
    lastContactAt: Date | null;
    notes: string;
    hotels: string;
    rateApproval: string;
    createdAt: Date;
    updatedAt: Date;
    activities?: Array<Parameters<typeof toActivityView>[0]>;
    _count?: { activities: number };
  },
  access: B2bAccessView,
  names: Map<string, string>,
): B2bPartnerListItem {
  const contactMasked = !access.canContacts;
  const commercialMasked = !access.canCommercial;
  const recentActivities: B2bActivityView[] = (row.activities ?? []).map((item) =>
    toActivityView({ ...item, partnerId: item.partnerId || row.id }, names, row.name),
  );
  const latest = recentActivities[0];
  return {
    id: row.id,
    name: row.name,
    type: isPartnerType(row.type) ? row.type : "other",
    market: row.market,
    contactPerson: contactMasked ? maskPerson(row.contactPerson) : row.contactPerson,
    contactChannel: contactMasked ? (row.contactChannel ? "••••" : "") : row.contactChannel,
    ownerId: row.ownerId,
    ownerName: names.get(row.ownerId) || (row.ownerId ? "ไม่ระบุชื่อ" : "ยังไม่มอบหมาย"),
    department: isDepartment(row.department) ? row.department : "sales",
    priority: isPriority(row.priority) ? row.priority : "normal",
    status: isStatus(row.status) ? row.status : "new_lead",
    nextAction: row.nextAction,
    nextActionAt: iso(row.nextActionAt),
    lastContactAt: iso(row.lastContactAt),
    notes: row.notes,
    hotels: splitHotels(row.hotels),
    rateApproval: isRateStatus(row.rateApproval) ? row.rateApproval : "draft",
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
    contactMasked,
    commercialMasked,
    activityCount: row._count?.activities ?? recentActivities.length,
    latestActivity: latest ? latest.title : "",
    recentActivities,
  };
}

export async function listB2bPartners(
  user: { id: string; role: string; modules?: string | null },
  filters: {
    q?: string;
    status?: string;
    ownerId?: string;
    department?: string;
    market?: string;
    hotel?: string;
    sort?: string;
  } = {},
): Promise<{
  access: B2bAccessView;
  items: B2bPartnerListItem[];
  staff: Array<{ id: string; name: string }>;
  facets: { markets: string[]; hotels: string[] };
}> {
  await ensureB2bOpsSchema();
  const access = await b2bAccessFor(user);
  const q = filters.q?.trim();
  const hotel = filters.hotel?.trim();
  const rows = await prisma().b2bPartner.findMany({
    where: {
      status: filters.status && isStatus(filters.status) ? filters.status : undefined,
      ownerId: filters.ownerId || undefined,
      department: filters.department && isDepartment(filters.department) ? filters.department : undefined,
      market: filters.market?.trim() ? { contains: filters.market.trim() } : undefined,
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q } },
                { market: { contains: q } },
                { hotels: { contains: q } },
                { nextAction: { contains: q } },
              ],
            }
          : {},
        hotel ? { hotels: { contains: hotel } } : {},
      ],
    },
    include: {
      activities: {
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { subtasks: { orderBy: { sortOrder: "asc" } } },
      },
      _count: { select: { activities: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
  const names = await namesById();
  const items = rows.map((row) => toListItem(row, access, names));
  const sort = (filters.sort || "nextActionAt") as B2bSort;
  items.sort((a, b) => {
    if (sort === "priority") return PRIORITY_RANK[a.priority as B2bPriority] - PRIORITY_RANK[b.priority as B2bPriority];
    if (sort === "name") return a.name.localeCompare(b.name, "th");
    if (sort === "updatedAt") return b.updatedAt.localeCompare(a.updatedAt);
    const aDate = a.nextActionAt || "9999";
    const bDate = b.nextActionAt || "9999";
    return aDate.localeCompare(bDate);
  });
  const staff = [...names.entries()].map(([id, name]) => ({ id, name }));
  const facetRows = await prisma().b2bPartner.findMany({ select: { market: true, hotels: true } });
  const markets = Array.from(new Set(facetRows.map((row) => row.market.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "th"),
  );
  const hotels = Array.from(new Set(facetRows.flatMap((row) => splitHotels(row.hotels)))).sort((a, b) => a.localeCompare(b, "th"));
  return { access, items, staff, facets: { markets, hotels } };
}

export async function getB2bPartner(
  user: { id: string; role: string; modules?: string | null },
  id: string,
): Promise<{ access: B2bAccessView; partner: B2bPartnerDetail; staff: Array<{ id: string; name: string }> } | null> {
  await ensureB2bOpsSchema();
  const access = await b2bAccessFor(user);
  const row = await prisma().b2bPartner.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] },
      terms: { orderBy: { updatedAt: "desc" } },
      activities: { orderBy: { createdAt: "desc" }, include: ACTIVITY_NEST },
      bookings: { orderBy: { createdAt: "desc" } },
      files: { orderBy: { createdAt: "desc" } },
      notesList: { orderBy: { createdAt: "desc" } },
      audits: { orderBy: { createdAt: "desc" }, take: 40 },
      _count: { select: { activities: true } },
    },
  });
  if (!row) return null;
  const names = await namesById();
  const base = toListItem(row, access, names);
  const contacts: B2bContactView[] = row.contacts.map((item) => ({
    id: item.id,
    name: access.canContacts ? item.name : maskPerson(item.name),
    role: item.role,
    email: access.canContacts ? item.email : maskEmail(item.email),
    phone: access.canContacts ? item.phone : maskPhone(item.phone),
    channel: access.canContacts ? item.channel : item.channel ? "••••" : "",
    isPrimary: item.isPrimary,
    masked: !access.canContacts,
  }));
  const terms: B2bTermView[] = row.terms.map((item) => ({
    id: item.id,
    hotelName: item.hotelName,
    ratePlan: access.canCommercial ? item.ratePlan : maskCommercial(item.ratePlan),
    commissionText: access.canCommercial ? item.commissionText : maskCommercial(item.commissionText),
    availability: access.canCommercial ? item.availability : item.availability ? "••••" : "",
    channel: item.channel,
    status: isRateStatus(item.status) ? item.status : "draft",
    notes: access.canCommercial ? item.notes : item.notes ? "••••" : "",
    approvedBy: item.approvedBy,
    approvedAt: iso(item.approvedAt),
    masked: !access.canCommercial,
  }));
  const activities: B2bActivityView[] = row.activities.map((item) => toActivityView(item, names, row.name));
  const bookings: B2bBookingView[] = row.bookings.map((item) => ({
    id: item.id,
    hotelName: item.hotelName,
    period: item.period,
    roomNights: access.canCommercial ? item.roomNights : maskCommercial(item.roomNights),
    revenueText: access.canCommercial ? item.revenueText : maskCommercial(item.revenueText),
    status: item.status,
    dataStatus: item.dataStatus,
    notes: item.notes,
    masked: !access.canCommercial,
  }));
  const files: B2bFileView[] = row.files.map((item) => ({
    id: item.id,
    kind: item.kind,
    filename: item.filename,
    caption: item.caption,
    size: item.size,
    createdAt: iso(item.createdAt),
  }));
  const notesList: B2bNoteView[] = row.notesList.map((item) => ({
    id: item.id,
    kind: item.kind,
    body: item.body,
    authorId: item.authorId,
    authorName: names.get(item.authorId) || "",
    createdAt: iso(item.createdAt),
  }));
  const audits: B2bAuditView[] = row.audits.map((item) => ({
    id: item.id,
    actorId: item.actorId,
    actorName: names.get(item.actorId) || "",
    action: item.action,
    detail: item.detail,
    createdAt: iso(item.createdAt),
  }));
  return {
    access,
    staff: [...names.entries()].map(([id, name]) => ({ id, name })),
    partner: { ...base, contacts, terms, activities, bookings, files, notesList, audits },
  };
}

export async function listB2bActivities(
  user: { id: string; role: string; modules?: string | null },
  filters: { openOnly?: boolean; q?: string; type?: string; status?: string; ownerId?: string; partnerId?: string } = {},
) {
  await ensureB2bOpsSchema();
  const access = await b2bAccessFor(user);
  const names = await namesById();
  const q = filters.q?.trim();
  const rows = await prisma().b2bActivity.findMany({
    where: {
      status: filters.openOnly
        ? { in: ["planned", "in_progress", "open"] }
        : filters.status && isActivityStatus(filters.status)
          ? filters.status
          : undefined,
      type: filters.type && isActivityType(filters.type) ? filters.type : undefined,
      ownerId: filters.ownerId || undefined,
      partnerId: filters.partnerId || undefined,
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { hotelName: { contains: q } },
              { notes: { contains: q } },
              { partner: { name: { contains: q } } },
            ],
          }
        : {}),
    },
    include: { partner: { select: { id: true, name: true } }, ...ACTIVITY_NEST },
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
  });
  return {
    access,
    staff: [...names.entries()].map(([id, name]) => ({ id, name })),
    items: rows.map((item) => toActivityView(item, names, item.partner.name)),
  };
}

export async function listB2bTerms(user: { id: string; role: string; modules?: string | null }) {
  await ensureB2bOpsSchema();
  const access = await b2bAccessFor(user);
  const rows = await prisma().b2bCommercialTerm.findMany({
    include: { partner: { select: { id: true, name: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return {
    access,
    items: rows.map((item) => ({
      id: item.id,
      partnerId: item.partnerId,
      partnerName: item.partner.name,
      hotelName: item.hotelName,
      ratePlan: access.canCommercial ? item.ratePlan : maskCommercial(item.ratePlan),
      commissionText: access.canCommercial ? item.commissionText : maskCommercial(item.commissionText),
      availability: access.canCommercial ? item.availability : item.availability ? "••••" : "",
      channel: item.channel,
      status: isRateStatus(item.status) ? item.status : "draft",
      masked: !access.canCommercial,
    })),
  };
}

export async function listB2bBookings(user: { id: string; role: string; modules?: string | null }) {
  await ensureB2bOpsSchema();
  const access = await b2bAccessFor(user);
  const rows = await prisma().b2bBooking.findMany({
    include: { partner: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return {
    access,
    items: rows.map((item) => ({
      id: item.id,
      partnerId: item.partnerId,
      partnerName: item.partner.name,
      hotelName: item.hotelName,
      period: item.period,
      roomNights: access.canCommercial ? item.roomNights : maskCommercial(item.roomNights),
      revenueText: access.canCommercial ? item.revenueText : maskCommercial(item.revenueText),
      status: item.status,
      dataStatus: item.dataStatus,
      masked: !access.canCommercial,
    })),
  };
}

export async function listB2bMaterials() {
  await ensureB2bOpsSchema();
  const rows = await prisma().b2bMaterial.findMany({ orderBy: { updatedAt: "desc" } });
  const items: B2bMaterialView[] = rows.map((item) => ({
    id: item.id,
    title: item.title,
    kind: item.kind,
    status: item.status,
    notes: item.notes,
    filename: item.filename,
    size: item.size,
    createdAt: iso(item.createdAt),
    updatedAt: iso(item.updatedAt),
  }));
  return items;
}

export async function listB2bAccessRows() {
  await ensureB2bOpsSchema();
  const [rows, staff] = await Promise.all([
    prisma().b2bAccess.findMany({ orderBy: { createdAt: "asc" } }),
    staffDirectory().catch(() => [] as Array<{ id: string; name: string; email: string }>),
  ]);
  return { rows, staff };
}

export async function b2bOpsOverview(user: { id: string; role: string; modules?: string | null }) {
  await ensureB2bOpsSchema();
  const access = await b2bAccessFor(user);
  const [total, active, due, pendingRates] = await Promise.all([
    prisma().b2bPartner.count(),
    prisma().b2bPartner.count({ where: { status: "active" } }),
    prisma().b2bActivity.count({ where: { status: { in: ["planned", "in_progress", "open"] }, dueAt: { lte: new Date() } } }),
    prisma().b2bPartner.count({ where: { rateApproval: "pending" } }),
  ]);
  return { access, total, active, due, pendingRates };
}

export async function b2bReportStats() {
  await ensureB2bOpsSchema();
  const [partners, activities, terms] = await Promise.all([
    prisma().b2bPartner.findMany({ select: { status: true, department: true, priority: true } }),
    prisma().b2bActivity.findMany({ select: { status: true, dueAt: true } }),
    prisma().b2bCommercialTerm.findMany({ select: { status: true } }),
  ]);
  return { partners, activities, terms };
}
