import { randomToken } from "@/lib/crm/security";
import { prisma } from "@/lib/crm/db";
import { clientLogos } from "@/lib/clients";
import { asBool, type CmsClientLogoRow } from "./types";
import { ensureCmsSchema } from "./ensure";
import { parseClientLogoPermission, type ClientLogoSaveInput } from "./client-logos";

type ClientLogoData = Omit<CmsClientLogoRow, "createdAt" | "updatedAt">;

function mapRow(row: Record<string, unknown>): CmsClientLogoRow {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    filePath: String(row.filePath ?? ""),
    clientName: String(row.clientName ?? ""),
    anonymisedLabel: String(row.anonymisedLabel ?? ""),
    altText: String(row.altText ?? ""),
    sortOrder: Number(row.sortOrder ?? 0),
    permission: parseClientLogoPermission(row.permission),
    isActive: asBool(row.isActive),
    adminNotes: String(row.adminNotes ?? ""),
    updatedBy: String(row.updatedBy ?? ""),
    createdAt: row.createdAt instanceof Date ? row.createdAt : new Date(String(row.createdAt ?? Date.now())),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt : new Date(String(row.updatedAt ?? Date.now())),
  };
}

async function db() {
  await ensureCmsSchema();
  return prisma();
}

export function rowFromInput(input: ClientLogoSaveInput, existing?: CmsClientLogoRow | null, updatedBy = ""): ClientLogoData {
  return {
    id: input.id || existing?.id || "",
    name: input.name,
    filePath: input.filePath,
    clientName: input.clientName,
    anonymisedLabel: input.anonymisedLabel,
    altText: input.altText,
    sortOrder: input.sortOrder,
    permission: input.permission,
    isActive: input.isActive,
    adminNotes: input.adminNotes,
    updatedBy,
  };
}

export async function clientLogoCount() {
  const rows = await (await db()).$queryRawUnsafe<Array<{ n: number }>>("SELECT COUNT(*) AS n FROM `CmsClientLogo`");
  return Number(rows[0]?.n ?? 0);
}

export async function listClientLogoRows() {
  await ensureClientLogoSeed();
  const rows = await (
    await db()
  ).$queryRawUnsafe<Record<string, unknown>[]>(
    "SELECT * FROM `CmsClientLogo` ORDER BY `sortOrder` ASC, `createdAt` ASC",
  );
  return rows.map(mapRow);
}

const PUBLIC_LOGO_COLUMNS = "id, name, filePath, clientName, anonymisedLabel, altText, sortOrder, permission, isActive";

export async function listPublishedClientLogoRows() {
  await ensureClientLogoSeed();
  const rows = await (
    await db()
  ).$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT ${PUBLIC_LOGO_COLUMNS} FROM \`CmsClientLogo\`
     WHERE \`permission\` = 'approved' AND \`isActive\` = 1 AND \`filePath\` <> '' AND \`filePath\` <> '/images/client-logo-placeholder.svg'
     ORDER BY \`sortOrder\` ASC, \`createdAt\` ASC`,
  );
  return rows.map(mapRow);
}

export async function findClientLogo(id: string) {
  const rows = await (await db()).$queryRawUnsafe<Record<string, unknown>[]>(
    "SELECT * FROM `CmsClientLogo` WHERE `id` = ? LIMIT 1",
    id,
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function insertClientLogo(data: Omit<ClientLogoData, "id"> & { id?: string }) {
  const id = data.id || `l${randomToken(12)}`;
  await (
    await db()
  ).$executeRawUnsafe(
    `INSERT INTO \`CmsClientLogo\` (
      id, name, filePath, clientName, anonymisedLabel, altText, sortOrder, permission, isActive, adminNotes, updatedBy, createdAt, updatedAt
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())`,
    id,
    data.name,
    data.filePath,
    data.clientName,
    data.anonymisedLabel,
    data.altText,
    data.sortOrder,
    data.permission,
    data.isActive ? 1 : 0,
    data.adminNotes,
    data.updatedBy,
  );
  return (await findClientLogo(id))!;
}

export async function updateClientLogoRow(id: string, data: Partial<ClientLogoData>) {
  const current = await findClientLogo(id);
  if (!current) return null;
  const next = { ...current, ...data };
  await (
    await db()
  ).$executeRawUnsafe(
    `UPDATE \`CmsClientLogo\` SET
      name=?, filePath=?, clientName=?, anonymisedLabel=?, altText=?, sortOrder=?, permission=?, isActive=?, adminNotes=?, updatedBy=?, updatedAt=NOW()
      WHERE id=?`,
    next.name,
    next.filePath,
    next.clientName,
    next.anonymisedLabel,
    next.altText,
    next.sortOrder,
    next.permission,
    next.isActive ? 1 : 0,
    next.adminNotes,
    next.updatedBy,
    id,
  );
  return findClientLogo(id);
}

export async function deleteClientLogoRow(id: string) {
  await (await db()).$executeRawUnsafe("DELETE FROM `CmsClientLogo` WHERE `id` = ?", id);
}

export async function reindexClientLogoOrder(ids: string[]) {
  const client = await db();
  for (let index = 0; index < ids.length; index += 1) {
    await client.$executeRawUnsafe("UPDATE `CmsClientLogo` SET `sortOrder` = ?, `updatedAt` = NOW() WHERE `id` = ?", index, ids[index]);
  }
}

export async function moveClientLogoRow(id: string, direction: "up" | "down") {
  const rows = await listClientLogoRows();
  const index = rows.findIndex((row) => row.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= rows.length) return rows[index] ?? null;
  const ids = rows.map((row) => row.id);
  const swap = ids[index];
  ids[index] = ids[target];
  ids[target] = swap;
  await reindexClientLogoOrder(ids);
  return findClientLogo(id);
}

async function ensureClientLogoSeed() {
  try {
    const count = await clientLogoCount();
    if (count > 0) return;
    for (let index = 0; index < clientLogos.length; index += 1) {
      const logo = clientLogos[index];
      await insertClientLogo({
        name: logo.name,
        filePath: logo.src,
        clientName: logo.name,
        anonymisedLabel: "",
        altText: `${logo.name} logo`,
        sortOrder: index,
        permission: "pending",
        isActive: false,
        adminNotes: "Imported from existing brand files. Approve only after publication permission is recorded.",
        updatedBy: "seed",
      });
    }
  } catch {
    // Database may be unavailable during build.
  }
}
