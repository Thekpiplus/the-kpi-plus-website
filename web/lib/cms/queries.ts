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
  const db = prisma() as unknown as CmsClient;
  if (typeof db.cmsDocument?.count === "function") return db;
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

export async function documentById(id: string) {
  const db = await cmsDb();
  return db.cmsDocument.findUnique({ where: { id } });
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
      label: doc.title,
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
