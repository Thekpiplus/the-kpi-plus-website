"use server";

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { prisma } from "@/lib/crm/db";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { randomToken } from "@/lib/crm/security";
import { ensureReservationOpsSchema } from "./ensure";
import { statusFromProgress, subtaskProgress } from "./progress";
import {
  MAX_RESERVATION_IMAGE_BYTES,
  MAX_RESERVATION_SUBTASKS,
  RESERVATION_IMAGE_TYPES,
  isOpChannel,
  isOpPriority,
  isOpStatus,
  isOpType,
  isSubtaskStatus,
  type ReservationOpStatus,
} from "./types";

export type ReservationOpSaveResult = { ok: true; id: string } | { ok: false; error: string };

async function requireReservations() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "reservations")) redirect("/crm?error=forbidden");
  await ensureReservationOpsSchema();
  return user;
}

function revalidateOps(id?: string) {
  revalidatePath("/crm");
  revalidatePath("/crm/reservations");
  if (id) revalidatePath(`/crm/reservations/${id}`);
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalDate(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function nextReference() {
  const db = prisma();
  const year = new Date().getFullYear().toString().slice(-2);
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const count = await db.reservationOperation.count();
    const reference = `OPS-${year}${String(count + 1 + attempt).padStart(4, "0")}`;
    const taken = await db.reservationOperation.findUnique({ where: { reference }, select: { id: true } });
    if (!taken) return reference;
  }
  return `OPS-${year}${randomToken(3).slice(0, 6).toUpperCase()}`;
}

async function syncOperationStatus(id: string, fallback: ReservationOpStatus) {
  const db = prisma();
  const row = await db.reservationOperation.findUnique({
    where: { id },
    include: { subtasks: true },
  });
  if (!row) return;
  const progress = subtaskProgress(row.subtasks);
  const next = statusFromProgress(isOpStatus(row.status) ? row.status : fallback, progress);
  if (next !== row.status) {
    await db.reservationOperation.update({
      where: { id },
      data: {
        status: next,
        closedAt: next === "closed" ? row.closedAt ?? new Date() : next === "cancelled" ? row.closedAt : null,
      },
    });
  }
}

export async function saveReservationOperation(formData: FormData): Promise<ReservationOpSaveResult> {
  const user = await requireReservations();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const type = text(formData, "type");
  const channel = text(formData, "channel");
  const status = text(formData, "status") || "new";
  const priority = text(formData, "priority") || "normal";
  if (!name) return { ok: false, error: "missing_name" };
  if (!isOpType(type) || !isOpChannel(channel) || !isOpStatus(status) || !isOpPriority(priority)) {
    return { ok: false, error: "invalid" };
  }

  const db = prisma();
  const payload = {
    name,
    type,
    channel,
    status,
    priority,
    assigneeId: text(formData, "assigneeId"),
    dueAt: optionalDate(text(formData, "dueAt")),
    hotelName: text(formData, "hotelName"),
    guestName: text(formData, "guestName"),
    guestEmail: text(formData, "guestEmail"),
    guestPhone: text(formData, "guestPhone"),
    bookingCode: text(formData, "bookingCode"),
    notes: text(formData, "notes"),
    updatedBy: user.id,
    closedAt: status === "closed" || status === "cancelled" ? new Date() : null,
    escalatedAt: status === "escalated" ? new Date() : null,
  };

  if (id) {
    const existing = await db.reservationOperation.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "missing" };
    await db.reservationOperation.update({
      where: { id },
      data: payload,
    });
    await syncOperationStatus(id, status);
    revalidateOps(id);
    return { ok: true, id };
  }

  const created = await db.reservationOperation.create({
    data: {
      ...payload,
      reference: await nextReference(),
      createdBy: user.id,
    },
  });
  revalidateOps(created.id);
  return { ok: true, id: created.id };
}

export async function assignReservationOperation(formData: FormData): Promise<ReservationOpSaveResult> {
  const user = await requireReservations();
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "missing" };
  await prisma().reservationOperation.update({
    where: { id },
    data: { assigneeId: text(formData, "assigneeId"), updatedBy: user.id },
  });
  revalidateOps(id);
  return { ok: true, id };
}

export async function changeReservationOpStatus(formData: FormData): Promise<ReservationOpSaveResult> {
  const user = await requireReservations();
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!id || !isOpStatus(status)) return { ok: false, error: "invalid" };
  await prisma().reservationOperation.update({
    where: { id },
    data: {
      status,
      updatedBy: user.id,
      closedAt: status === "closed" || status === "cancelled" ? new Date() : null,
      escalatedAt: status === "escalated" ? new Date() : undefined,
    },
  });
  revalidateOps(id);
  return { ok: true, id };
}

export async function closeReservationOperation(formData: FormData): Promise<ReservationOpSaveResult> {
  formData.set("status", "closed");
  return changeReservationOpStatus(formData);
}

export async function escalateReservationOperation(formData: FormData): Promise<ReservationOpSaveResult> {
  formData.set("status", "escalated");
  return changeReservationOpStatus(formData);
}

export async function addReservationSubtask(formData: FormData): Promise<ReservationOpSaveResult> {
  const user = await requireReservations();
  const operationId = text(formData, "operationId");
  const name = text(formData, "name");
  if (!operationId || !name) return { ok: false, error: "missing_name" };
  const db = prisma();
  const count = await db.reservationSubtask.count({ where: { operationId } });
  if (count >= MAX_RESERVATION_SUBTASKS) return { ok: false, error: "subtask_limit" };
  const status = text(formData, "status") || "open";
  const priority = text(formData, "priority") || "normal";
  await db.reservationSubtask.create({
    data: {
      operationId,
      name,
      status: isSubtaskStatus(status) ? status : "open",
      completed: status === "done",
      dueAt: optionalDate(text(formData, "dueAt")),
      assigneeId: text(formData, "assigneeId"),
      priority: isOpPriority(priority) ? priority : "normal",
      comments: text(formData, "comments"),
      sortOrder: count + 1,
    },
  });
  await db.reservationOperation.update({ where: { id: operationId }, data: { updatedBy: user.id } });
  await syncOperationStatus(operationId, "in_progress");
  revalidateOps(operationId);
  return { ok: true, id: operationId };
}

export async function saveReservationSubtask(formData: FormData): Promise<ReservationOpSaveResult> {
  const user = await requireReservations();
  const id = text(formData, "id");
  const operationId = text(formData, "operationId");
  const name = text(formData, "name");
  if (!id || !operationId || !name) return { ok: false, error: "missing_name" };
  const status = text(formData, "status") || "open";
  const completed = formData.get("completed") === "1" || status === "done";
  const priority = text(formData, "priority") || "normal";
  await prisma().reservationSubtask.update({
    where: { id },
    data: {
      name,
      status: completed ? "done" : isSubtaskStatus(status) ? status : "open",
      completed,
      dueAt: optionalDate(text(formData, "dueAt")),
      assigneeId: text(formData, "assigneeId"),
      priority: isOpPriority(priority) ? priority : "normal",
      comments: text(formData, "comments"),
    },
  });
  await prisma().reservationOperation.update({ where: { id: operationId }, data: { updatedBy: user.id } });
  await syncOperationStatus(operationId, "in_progress");
  revalidateOps(operationId);
  return { ok: true, id: operationId };
}

export async function completeReservationSubtask(formData: FormData): Promise<ReservationOpSaveResult> {
  const id = text(formData, "id");
  const existing = id ? await prisma().reservationSubtask.findUnique({ where: { id } }) : null;
  if (!existing) return { ok: false, error: "missing" };
  if (!text(formData, "name")) formData.set("name", existing.name);
  if (!text(formData, "operationId")) formData.set("operationId", existing.operationId);
  if (!text(formData, "assigneeId")) formData.set("assigneeId", existing.assigneeId);
  if (!text(formData, "priority")) formData.set("priority", existing.priority);
  if (!text(formData, "comments")) formData.set("comments", existing.comments);
  if (existing.dueAt && !text(formData, "dueAt")) formData.set("dueAt", existing.dueAt.toISOString().slice(0, 16));
  const completed = formData.get("completed") === "0" ? "0" : "1";
  formData.set("completed", completed);
  formData.set("status", completed === "1" ? "done" : existing.status === "done" ? "open" : existing.status);
  return saveReservationSubtask(formData);
}

export async function addReservationOpComment(formData: FormData): Promise<ReservationOpSaveResult> {
  const user = await requireReservations();
  const operationId = text(formData, "operationId");
  const body = text(formData, "body");
  if (!operationId || !body) return { ok: false, error: "missing_comment" };
  await prisma().reservationOpComment.create({
    data: { operationId, authorId: user.id, body },
  });
  await prisma().reservationOperation.update({ where: { id: operationId }, data: { updatedBy: user.id } });
  revalidateOps(operationId);
  return { ok: true, id: operationId };
}

export async function attachReservationOpImage(formData: FormData): Promise<ReservationOpSaveResult> {
  const user = await requireReservations();
  const operationId = text(formData, "operationId");
  const file = formData.get("file");
  if (!operationId || !(file instanceof File) || file.size <= 0) return { ok: false, error: "missing_file" };
  const original = file.name || "image";
  const dot = original.lastIndexOf(".");
  const ext = dot >= 0 ? original.slice(dot).toLowerCase() : "";
  if (!RESERVATION_IMAGE_TYPES.has(ext) || file.size > MAX_RESERVATION_IMAGE_BYTES) {
    return { ok: false, error: "invalid_image" };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const storedName = `${randomToken(8)}${ext}`;
  const dir = join(process.cwd(), "private", "reservations-ops");
  mkdirSync(dir, { recursive: true });
  const relative = `private/reservations-ops/${storedName}`;
  writeFileSync(join(process.cwd(), relative), buffer);
  await prisma().reservationOpAttachment.create({
    data: {
      operationId,
      filename: original,
      mime: file.type || "image/jpeg",
      size: file.size,
      path: relative,
      createdBy: user.id,
    },
  });
  await prisma().reservationOperation.update({ where: { id: operationId }, data: { updatedBy: user.id } });
  revalidateOps(operationId);
  return { ok: true, id: operationId };
}

