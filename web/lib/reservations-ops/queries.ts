import { formatThaiDateTime, staffDirectory } from "@/lib/crm/queries";
import { prisma } from "@/lib/crm/db";
import { ensureReservationOpsSchema } from "./ensure";
import { canViewReservationGuestData, maskedGuest, revealedGuest } from "./privacy";
import { statusFromProgress, subtaskProgress } from "./progress";
import {
  isOpChannel,
  isOpPriority,
  isOpStatus,
  isOpType,
  isSubtaskStatus,
  type ReservationOpChannel,
  type ReservationOpPriority,
  type ReservationOpStatus,
  type ReservationOpType,
  type ReservationOperationView,
  type ReservationSubtaskStatus,
} from "./types";

export type ReservationOpFilters = {
  q?: string;
  type?: string;
  status?: string;
  channel?: string;
  assigneeId?: string;
};

function asType(value: string): ReservationOpType {
  return isOpType(value) ? value : "inquiry";
}

function asChannel(value: string): ReservationOpChannel {
  return isOpChannel(value) ? value : "direct";
}

function asStatus(value: string): ReservationOpStatus {
  return isOpStatus(value) ? value : "new";
}

function asPriority(value: string): ReservationOpPriority {
  return isOpPriority(value) ? value : "normal";
}

function asSubtaskStatus(value: string): ReservationSubtaskStatus {
  return isSubtaskStatus(value) ? value : "open";
}

function iso(value: Date | null | undefined) {
  return value ? value.toISOString() : "";
}

export async function reservationOpsOverview() {
  await ensureReservationOpsSchema();
  const db = prisma();
  try {
    const [open, due, escalated] = await Promise.all([
      db.reservationOperation.count({
        where: { status: { notIn: ["closed", "cancelled"] } },
      }),
      db.reservationOperation.count({
        where: {
          status: { notIn: ["closed", "cancelled"] },
          dueAt: { lte: new Date() },
        },
      }),
      db.reservationOperation.count({ where: { status: "escalated" } }),
    ]);
    return { open, due, escalated };
  } catch {
    return { open: 0, due: 0, escalated: 0 };
  }
}

export async function listReservationOperations(
  filters: ReservationOpFilters,
  viewer: { role: string },
  revealGuest = false,
): Promise<ReservationOperationView[]> {
  await ensureReservationOpsSchema();
  const db = prisma();
  const q = filters.q?.trim();
  const rows = await db.reservationOperation.findMany({
    where: {
      type: filters.type && isOpType(filters.type) ? filters.type : undefined,
      status: filters.status && isOpStatus(filters.status) ? filters.status : undefined,
      channel: filters.channel && isOpChannel(filters.channel) ? filters.channel : undefined,
      assigneeId: filters.assigneeId || undefined,
      OR: q
        ? [
            { reference: { contains: q } },
            { name: { contains: q } },
            { hotelName: { contains: q } },
          ]
        : undefined,
    },
    include: {
      subtasks: { orderBy: { sortOrder: "asc" } },
      comments: { orderBy: { createdAt: "desc" } },
      attachments: { orderBy: { createdAt: "desc" } },
    },
    orderBy: [{ updatedAt: "desc" }],
  });
  const staff = await staffDirectory().catch(() => [] as Array<{ id: string; name: string }>);
  const names = new Map(staff.map((item) => [item.id, item.name]));
  const allowReveal = revealGuest && canViewReservationGuestData(viewer);

  return rows.map((row, index) => {
    const progress = subtaskProgress(row.subtasks);
    const status = statusFromProgress(asStatus(row.status), progress);
    return {
      id: row.id,
      reference: row.reference,
      name: row.name,
      type: asType(row.type),
      channel: asChannel(row.channel),
      status,
      priority: asPriority(row.priority),
      assigneeId: row.assigneeId,
      assigneeName: names.get(row.assigneeId) || "",
      dueAt: iso(row.dueAt),
      hotelName: row.hotelName,
      guest: allowReveal
        ? revealedGuest({
            name: row.guestName,
            email: row.guestEmail,
            phone: row.guestPhone,
            bookingCode: row.bookingCode,
          })
        : maskedGuest({
            name: row.guestName,
            email: row.guestEmail,
            phone: row.guestPhone,
            bookingCode: row.bookingCode,
            index,
          }),
      notes: row.notes,
      createdAt: iso(row.createdAt),
      updatedAt: iso(row.updatedAt),
      closedAt: iso(row.closedAt),
      escalatedAt: iso(row.escalatedAt),
      progress,
      subtasks: row.subtasks.map((item) => ({
        id: item.id,
        name: item.name,
        status: asSubtaskStatus(item.status),
        completed: item.completed || item.status === "done",
        dueAt: iso(item.dueAt),
        assigneeId: item.assigneeId,
        assigneeName: names.get(item.assigneeId) || "",
        priority: asPriority(item.priority),
        comments: item.comments,
        sortOrder: item.sortOrder,
      })),
      comments: row.comments.map((item) => ({
        id: item.id,
        authorId: item.authorId,
        authorName: names.get(item.authorId) || "Team",
        body: item.body,
        createdAt: iso(item.createdAt),
      })),
      attachments: row.attachments.map((item) => ({
        id: item.id,
        filename: item.filename,
        mime: item.mime,
        size: item.size,
        href: `/api/crm/reservations/files/${item.id}`,
        createdAt: iso(item.createdAt),
      })),
    };
  });
}

export function formatOpDate(value: string) {
  if (!value) return "—";
  return formatThaiDateTime(value);
}
