import { prisma } from "@/lib/crm/db";
import { documentPath, parseCmsBody } from "./body";
import { ensureCmsSchema } from "./ensure";
import { loadCmsNav, saveCmsNav, saveCmsRedirects, type CmsNavLink } from "./files";
import { rawCmsClient } from "./sql";
import type { CmsDocumentRow, CmsMediaRow, CmsRedirectRow, CmsSettingRow } from "./types";
import { asBool } from "./types";

type CmsClient = {
  cmsDocument: {
    findMany: (args?: object) => Promise<CmsDocumentRow[]>;
    findUnique: (args: object) => Promise<CmsDocumentRow | null>;
    findFirst: (args: object) => Promise<CmsDocumentRow | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<CmsDocumentRow>;
    update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<CmsDocumentRow>;
    delete: (args: { where: { id: string } }) => Promise<CmsDocumentRow>;
    count: (args?: object) => Promise<number>;
  };
  cmsMedia: {
    findMany: (args?: object) => Promise<CmsMediaRow[]>;
    create: (args: { data: Record<string, unknown> }) => Promise<CmsMediaRow>;
    update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<CmsMediaRow>;
    delete: (args: { where: { id: string } }) => Promise<CmsMediaRow>;
    count: () => Promise<number>;
  };
  cmsRedirect: {
    findMany: (args?: object) => Promise<CmsRedirectRow[]>;
    create: (args: { data: Record<string, unknown> }) => Promise<CmsRedirectRow>;
    update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<CmsRedirectRow>;
    delete: (args: { where: { id: string } }) => Promise<CmsRedirectRow>;
  };
  cmsSetting: {
    findUnique: (args: { where: { id: string } }) => Promise<CmsSettingRow | null>;
    upsert: (args: { where: { id: string }; create: Record<string, unknown>; update: Record<string, unknown> }) => Promise<CmsSettingRow>;
  };
};

export async function cmsDb() {
  await ensureCmsSchema();
  // Prefer the raw SQLite client so schema columns added via ensureCmsSchema
  // (e.g. menuLabel) work without requiring a regenerated Prisma client.
  return rawCmsClient(prisma()) as unknown as CmsClient;
}

function liveNowFilter() {
  const now = new Date();
  return {
    trashedAt: null,
    status: { in: ["published", "scheduled"] },
    OR: [{ scheduledAt: null }, { scheduledAt: { lte: now } }],
  };
}

export async function cmsOverview() {
  try {
    const db = await cmsDb();
    const [pages, insights, drafts, media] = await Promise.all([
      db.cmsDocument.count({ where: { kind: "page", trashedAt: null } }),
      db.cmsDocument.count({ where: { kind: "insight", trashedAt: null } }),
      db.cmsDocument.count({ where: { status: "draft", trashedAt: null } }),
      db.cmsMedia.count(),
    ]);
    return { pages, insights, drafts, media };
  } catch {
    return { pages: 0, insights: 0, drafts: 0, media: 0 };
  }
}

export async function listDocuments(kind: "page" | "insight", filters: { q?: string; status?: string } = {}) {
  try {
    const db = await cmsDb();
    const q = filters.q?.trim();
    return db.cmsDocument.findMany({
      where: {
        kind,
        trashedAt: null,
        status: filters.status || undefined,
        OR: q ? [{ title: { contains: q } }, { slug: { contains: q } }] : undefined,
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function listTrashedDocuments(filters: { kind?: "page" | "insight"; q?: string } = {}) {
  try {
    await ensureCmsSchema();
    const params: unknown[] = [];
    let sql = `SELECT "id" FROM "CmsDocument" WHERE "trashedAt" IS NOT NULL`;
    if (filters.kind) {
      sql += ` AND "kind" = ?`;
      params.push(filters.kind);
    }
    sql += ` ORDER BY "trashedAt" DESC`;
    const rows = await prisma().$queryRawUnsafe<{ id: string }[]>(sql, ...params);
    const db = await cmsDb();
    const docs = (
      await Promise.all(rows.map((row) => db.cmsDocument.findUnique({ where: { id: String(row.id) } })))
    ).filter((doc): doc is NonNullable<typeof doc> => Boolean(doc?.trashedAt));
    const q = filters.q?.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(q) ||
        doc.slug.toLowerCase().includes(q) ||
        doc.seoTitle.toLowerCase().includes(q) ||
        doc.metaDescription.toLowerCase().includes(q),
    );
  } catch {
    return [];
  }
}

export async function countTrashedDocuments() {
  try {
    await ensureCmsSchema();
    const rows = await prisma().$queryRawUnsafe<{ count: number }[]>(
      `SELECT COUNT(*) as count FROM "CmsDocument" WHERE "trashedAt" IS NOT NULL`,
    );
    return Number(rows[0]?.count ?? 0);
  } catch {
    return 0;
  }
}

export async function documentById(id: string) {
  const db = await cmsDb();
  return db.cmsDocument.findUnique({ where: { id } });
}

export async function insightDocumentBySlug(slug: string, locale = "th") {
  try {
    await ensureCmsSchema();
    const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT * FROM "CmsDocument" WHERE "kind" = ? AND "slug" = ? AND "locale" = ? LIMIT 1`,
      "insight",
      slug,
      locale,
    );
    if (!rows[0]) return null;
    const db = await cmsDb();
    return db.cmsDocument.findUnique({ where: { id: String(rows[0].id) } });
  } catch {
    return null;
  }
}

export async function pageDocumentBySlug(slug: string, locale = "th") {
  try {
    await ensureCmsSchema();
    const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT * FROM "CmsDocument" WHERE "kind" = ? AND "slug" = ? AND "locale" = ? LIMIT 1`,
      "page",
      slug,
      locale,
    );
    if (!rows[0]) return null;
    const db = await cmsDb();
    return db.cmsDocument.findUnique({ where: { id: String(rows[0].id) } });
  } catch {
    return null;
  }
}

export async function trashedInsightSlugs() {
  try {
    await ensureCmsSchema();
    const rows = await prisma().$queryRawUnsafe<{ slug: string }[]>(
      `SELECT "slug" FROM "CmsDocument" WHERE "kind" = ? AND "trashedAt" IS NOT NULL`,
      "insight",
    );
    return rows.map((row) => String(row.slug));
  } catch {
    return [];
  }
}

/** Slugs that must not appear on the public insights index (trashed or offline). */
export async function hiddenInsightSlugs() {
  try {
    await ensureCmsSchema();
    const rows = await prisma().$queryRawUnsafe<
      { slug: string; status: string; scheduledAt: string | null; trashedAt: string | null }[]
    >(
      `SELECT "slug", "status", "scheduledAt", "trashedAt" FROM "CmsDocument" WHERE "kind" = ?`,
      "insight",
    );
    const now = Date.now();
    return rows
      .filter((row) => {
        if (row.trashedAt) return true;
        if (row.status === "published") return false;
        if (row.status === "scheduled" && row.scheduledAt && new Date(row.scheduledAt).getTime() <= now) return false;
        return true;
      })
      .map((row) => String(row.slug));
  } catch {
    return [];
  }
}

export async function publishedDocumentByPath(pathname: string) {
  const db = await cmsDb();
  const rows = await db.cmsDocument.findMany({ where: liveNowFilter() });
  return (
    rows.find((row) => {
      const live = row.status === "published" || (row.scheduledAt && row.scheduledAt <= new Date());
      return live && documentPath(row) === pathname;
    }) ?? null
  );
}

export async function publishedDocuments(kind?: "page" | "insight") {
  try {
    const db = await cmsDb();
    const rows = await db.cmsDocument.findMany({
      where: {
        ...liveNowFilter(),
        kind: kind || undefined,
      },
      orderBy: { publishedAt: "desc" },
    });
    const now = new Date();
    return rows.filter((row) => row.status === "published" || (row.scheduledAt && row.scheduledAt <= now));
  } catch {
    return [];
  }
}

export async function listMedia() {
  try {
    const db = await cmsDb();
    return db.cmsMedia.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export async function listRedirects() {
  try {
    const db = await cmsDb();
    return db.cmsRedirect.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export async function getSetting(id: string) {
  const db = await cmsDb();
  return db.cmsSetting.findUnique({ where: { id } });
}

export async function refreshCmsFiles() {
  const [docs, redirects] = await Promise.all([publishedDocuments(), listRedirects()]);
  const nav: CmsNavLink[] = docs
    .filter((doc) => asBool(doc.showInMenu) && (doc.menu === "header" || doc.menu === "footer"))
    .map((doc) => ({
      href: documentPath(doc),
      label: doc.menuLabel?.trim() || doc.title,
      locale: doc.locale,
      menu: doc.menu as "header" | "footer",
      position: doc.menuPosition,
    }))
    .sort((a, b) => a.position - b.position);
  saveCmsNav(nav);
  saveCmsRedirects(
    redirects
      .filter((item) => asBool(item.active))
      .map((item) => ({ fromPath: item.fromPath, toPath: item.toPath, statusCode: item.statusCode })),
  );
  return { nav: loadCmsNav() };
}

export function documentPreview(doc: CmsDocumentRow) {
  return {
    path: documentPath(doc),
    blocks: parseCmsBody(doc.body),
  };
}
