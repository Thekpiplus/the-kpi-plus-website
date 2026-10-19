import { prisma } from "./db";

export type LeadArchiveView = "active" | "archived" | "all";

export async function ensureLeadArchiveColumn() {
  // archivedAt is part of the Prisma Lead model.
}

export async function leadIdsByArchive(view: LeadArchiveView) {
  if (view === "all") return null;
  const rows = await prisma().lead.findMany({
    where: view === "archived" ? { archivedAt: { not: null } } : { archivedAt: null },
    select: { id: true },
  });
  return rows.map((row) => row.id);
}

export async function leadArchivedAt(id: string) {
  const row = await prisma().lead.findUnique({ where: { id }, select: { archivedAt: true } });
  return row?.archivedAt ?? null;
}

export async function setLeadArchived(id: string, archived: boolean) {
  await prisma().lead.update({
    where: { id },
    data: { archivedAt: archived ? new Date() : null },
  });
}

export function archiveWhere(ids: string[] | null) {
  if (ids == null) return {};
  if (!ids.length) return { id: { in: ["__none__"] } };
  return { id: { in: ids } };
}

export async function leadArchiveMap(ids: string[]) {
  if (!ids.length) return new Map<string, Date | null>();
  const rows = await prisma().lead.findMany({
    where: { id: { in: ids } },
    select: { id: true, archivedAt: true },
  });
  return new Map(rows.map((row) => [row.id, row.archivedAt] as const));
}

export async function leadArchiveCounts() {
  const [active, archived] = await Promise.all([leadIdsByArchive("active"), leadIdsByArchive("archived")]);
  return {
    active: active?.length ?? 0,
    archived: archived?.length ?? 0,
    all: (active?.length ?? 0) + (archived?.length ?? 0),
  };
}
