import { prisma } from "./db";

export type LeadArchiveView = "active" | "archived" | "all";

export async function ensureLeadArchiveColumn() {
  await prisma()
    .$executeRawUnsafe(`ALTER TABLE "Lead" ADD COLUMN "archivedAt" DATETIME`)
    .catch(() => undefined);
}

export async function leadIdsByArchive(view: LeadArchiveView) {
  await ensureLeadArchiveColumn();
  if (view === "all") return null;
  const sql =
    view === "archived"
      ? `SELECT "id" FROM "Lead" WHERE "archivedAt" IS NOT NULL`
      : `SELECT "id" FROM "Lead" WHERE "archivedAt" IS NULL`;
  const rows = await prisma().$queryRawUnsafe<{ id: string }[]>(sql);
  return rows.map((row) => row.id);
}

export async function leadArchivedAt(id: string) {
  await ensureLeadArchiveColumn();
  const rows = await prisma()
    .$queryRawUnsafe<{ archivedAt: string | Date | null }[]>(`SELECT "archivedAt" FROM "Lead" WHERE "id" = ?`, id)
    .catch(() => [] as { archivedAt: string | Date | null }[]);
  const value = rows[0]?.archivedAt;
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

export async function setLeadArchived(id: string, archived: boolean) {
  await ensureLeadArchiveColumn();
  if (archived) {
    await prisma().$executeRawUnsafe(`UPDATE "Lead" SET "archivedAt" = ? WHERE "id" = ?`, new Date().toISOString(), id);
  } else {
    await prisma().$executeRawUnsafe(`UPDATE "Lead" SET "archivedAt" = NULL WHERE "id" = ?`, id);
  }
}

export function archiveWhere(ids: string[] | null) {
  if (ids == null) return {};
  if (!ids.length) return { id: { in: ["__none__"] } };
  return { id: { in: ids } };
}

export async function leadArchiveMap(ids: string[]) {
  await ensureLeadArchiveColumn();
  if (!ids.length) return new Map<string, Date | null>();
  const placeholders = ids.map(() => "?").join(",");
  const rows = await prisma()
    .$queryRawUnsafe<{ id: string; archivedAt: string | Date | null }[]>(
      `SELECT "id", "archivedAt" FROM "Lead" WHERE "id" IN (${placeholders})`,
      ...ids,
    )
    .catch(() => [] as { id: string; archivedAt: string | Date | null }[]);
  return new Map(
    rows.map((row) => {
      const value = row.archivedAt;
      const archivedAt = !value ? null : value instanceof Date ? value : new Date(value);
      return [row.id, archivedAt] as const;
    }),
  );
}

export async function leadArchiveCounts() {
  const [active, archived] = await Promise.all([leadIdsByArchive("active"), leadIdsByArchive("archived")]);
  return {
    active: active?.length ?? 0,
    archived: archived?.length ?? 0,
    all: (active?.length ?? 0) + (archived?.length ?? 0),
  };
}
