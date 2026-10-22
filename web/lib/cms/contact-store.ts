import { randomToken } from "@/lib/crm/security";
import { prisma } from "@/lib/crm/db";
import { ensureCmsSchema } from "./ensure";
import type { CmsContactRow } from "./types";
import { asBool } from "./types";

type ContactData = Omit<CmsContactRow, "id" | "createdAt" | "updatedAt"> & { id?: string };

function mapRow(row: Record<string, unknown>): CmsContactRow {
  return {
    id: String(row.id ?? ""),
    label: String(row.label ?? ""),
    companyNameTh: String(row.companyNameTh ?? ""),
    companyNameEn: String(row.companyNameEn ?? ""),
    addressTh: String(row.addressTh ?? ""),
    addressEn: String(row.addressEn ?? ""),
    phone: String(row.phone ?? ""),
    secondaryPhone: String(row.secondaryPhone ?? ""),
    email: String(row.email ?? ""),
    whatsappNumber: String(row.whatsappNumber ?? ""),
    googleMapsUrl: String(row.googleMapsUrl ?? ""),
    googleMapsEmbed: String(row.googleMapsEmbed ?? ""),
    hoursTh: String(row.hoursTh ?? ""),
    hoursEn: String(row.hoursEn ?? ""),
    facebook: String(row.facebook ?? ""),
    instagram: String(row.instagram ?? ""),
    linkedin: String(row.linkedin ?? ""),
    tiktok: String(row.tiktok ?? ""),
    lineHref: String(row.lineHref ?? ""),
    locationImage: String(row.locationImage ?? ""),
    locationImageAlt: String(row.locationImageAlt ?? ""),
    consultantImage: String(row.consultantImage ?? ""),
    consultantImageAlt: String(row.consultantImageAlt ?? ""),
    adminNotes: String(row.adminNotes ?? ""),
    isPrimary: asBool(row.isPrimary),
    sortOrder: Number(row.sortOrder ?? 0),
    createdAt: row.createdAt instanceof Date ? row.createdAt : new Date(String(row.createdAt ?? Date.now())),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt : new Date(String(row.updatedAt ?? Date.now())),
  };
}

async function db() {
  await ensureCmsSchema();
  return prisma();
}

export async function contactCount() {
  const rows = await (await db()).$queryRawUnsafe<Array<{ n: number }>>("SELECT COUNT(*) AS n FROM `CmsContact`");
  return Number(rows[0]?.n ?? 0);
}

export async function listContactRows() {
  const rows = await (
    await db()
  ).$queryRawUnsafe<Record<string, unknown>[]>(
    "SELECT * FROM `CmsContact` ORDER BY `isPrimary` DESC, `sortOrder` ASC, `createdAt` ASC",
  );
  return rows.map(mapRow);
}

export async function findContact(id: string) {
  const rows = await (await db()).$queryRawUnsafe<Record<string, unknown>[]>(
    "SELECT * FROM `CmsContact` WHERE `id` = ? LIMIT 1",
    id,
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

const PUBLIC_CONTACT_COLUMNS = `
  id, label, companyNameTh, companyNameEn, addressTh, addressEn, phone, secondaryPhone, email, whatsappNumber,
  googleMapsUrl, googleMapsEmbed, hoursTh, hoursEn, facebook, instagram, linkedin, tiktok, lineHref,
  locationImage, locationImageAlt, consultantImage, consultantImageAlt, isPrimary, sortOrder, createdAt, updatedAt
`;

export async function findPrimaryContact() {
  const primary = await (await db()).$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT ${PUBLIC_CONTACT_COLUMNS} FROM \`CmsContact\` WHERE \`isPrimary\` = 1 ORDER BY \`updatedAt\` DESC LIMIT 1`,
  );
  if (primary[0]) return mapRow(primary[0]);
  const first = await (await db()).$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT ${PUBLIC_CONTACT_COLUMNS} FROM \`CmsContact\` ORDER BY \`createdAt\` ASC LIMIT 1`,
  );
  return first[0] ? mapRow(first[0]) : null;
}

export async function insertContact(data: ContactData) {
  const id = data.id || `c${randomToken(12)}`;
  await (
    await db()
  ).$executeRawUnsafe(
    `INSERT INTO \`CmsContact\` (
      id, label, companyNameTh, companyNameEn, addressTh, addressEn, phone, secondaryPhone, email, whatsappNumber,
      googleMapsUrl, googleMapsEmbed, hoursTh, hoursEn, facebook, instagram, linkedin, tiktok, lineHref,
      locationImage, locationImageAlt, consultantImage, consultantImageAlt, adminNotes, isPrimary, sortOrder, createdAt, updatedAt
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())`,
    id,
    data.label,
    data.companyNameTh,
    data.companyNameEn,
    data.addressTh,
    data.addressEn,
    data.phone,
    data.secondaryPhone,
    data.email,
    data.whatsappNumber,
    data.googleMapsUrl,
    data.googleMapsEmbed,
    data.hoursTh,
    data.hoursEn,
    data.facebook,
    data.instagram,
    data.linkedin,
    data.tiktok,
    data.lineHref,
    data.locationImage,
    data.locationImageAlt,
    data.consultantImage,
    data.consultantImageAlt,
    data.adminNotes,
    data.isPrimary ? 1 : 0,
    data.sortOrder,
  );
  return (await findContact(id))!;
}

export async function updateContactRow(id: string, data: Partial<ContactData>) {
  const current = await findContact(id);
  if (!current) return null;
  const next = { ...current, ...data };
  await (
    await db()
  ).$executeRawUnsafe(
    `UPDATE \`CmsContact\` SET
      label=?, companyNameTh=?, companyNameEn=?, addressTh=?, addressEn=?, phone=?, secondaryPhone=?, email=?, whatsappNumber=?,
      googleMapsUrl=?, googleMapsEmbed=?, hoursTh=?, hoursEn=?, facebook=?, instagram=?, linkedin=?, tiktok=?, lineHref=?,
      locationImage=?, locationImageAlt=?, consultantImage=?, consultantImageAlt=?, adminNotes=?, isPrimary=?, sortOrder=?, updatedAt=NOW()
      WHERE id=?`,
    next.label,
    next.companyNameTh,
    next.companyNameEn,
    next.addressTh,
    next.addressEn,
    next.phone,
    next.secondaryPhone,
    next.email,
    next.whatsappNumber,
    next.googleMapsUrl,
    next.googleMapsEmbed,
    next.hoursTh,
    next.hoursEn,
    next.facebook,
    next.instagram,
    next.linkedin,
    next.tiktok,
    next.lineHref,
    next.locationImage,
    next.locationImageAlt,
    next.consultantImage,
    next.consultantImageAlt,
    next.adminNotes,
    next.isPrimary ? 1 : 0,
    next.sortOrder,
    id,
  );
  return findContact(id);
}

export async function clearPrimaryExcept(id: string) {
  await (await db()).$executeRawUnsafe("UPDATE `CmsContact` SET `isPrimary` = 0 WHERE `id` <> ?", id);
}

export async function clearAllPrimary() {
  await (await db()).$executeRawUnsafe("UPDATE `CmsContact` SET `isPrimary` = 0");
}

export async function deleteContactRow(id: string) {
  await (await db()).$executeRawUnsafe("DELETE FROM `CmsContact` WHERE `id` = ?", id);
}
