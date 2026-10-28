import { prisma } from "@/lib/crm/db";
import { documentPath, parseCmsBody } from "./body";
import { ensureCmsSchema } from "./ensure";
import { loadCmsNav, saveCmsNav, saveCmsRedirects, type CmsNavLink } from "./files";
import type { CmsContactRow, CmsDocumentRow, CmsMediaRow, CmsRedirectRow, CmsSettingRow } from "./types";
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
  cmsContact: {
    findMany: (args?: object) => Promise<CmsContactRow[]>;
    findUnique: (args: object) => Promise<CmsContactRow | null>;
    findFirst: (args: object) => Promise<CmsContactRow | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<CmsContactRow>;
    update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<CmsContactRow>;
    updateMany: (args: object) => Promise<{ count: number }>;
    delete: (args: { where: { id: string } }) => Promise<CmsContactRow>;
    count: (args?: object) => Promise<number>;
  };
};

export async function cmsDb() {
  await ensureCmsSchema();
  return prisma() as unknown as CmsClient;
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
        ...(filters.status ? { status: filters.status } : {}),
        ...(q
          ? {
              OR: [{ title: { contains: q } }, { slug: { contains: q } }],
            }
          : {}),
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function listTrashedDocuments(filters: { kind?: "page" | "insight"; q?: string } = {}) {
  try {
    const db = await cmsDb();
    const q = filters.q?.trim().toLowerCase();
    const docs = await db.cmsDocument.findMany({
      where: {
        trashedAt: { not: null },
        kind: filters.kind || undefined,
      },
      orderBy: { updatedAt: "desc" },
    });
    const trashed = docs.filter((doc) => Boolean(doc.trashedAt));
    if (!q) return trashed;
    return trashed.filter(
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
    const db = await cmsDb();
    return db.cmsDocument.count({ where: { trashedAt: { not: null } } });
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
    const db = await cmsDb();
    return db.cmsDocument.findFirst({ where: { kind: "insight", slug, locale } });
  } catch {
    return null;
  }
}

export async function pageDocumentBySlug(slug: string, locale = "th") {
  try {
    const db = await cmsDb();
    return db.cmsDocument.findFirst({ where: { kind: "page", slug, locale } });
  } catch {
    return null;
  }
}

export async function pageDocumentsBySlug(slug: string) {
  try {
    const db = await cmsDb();
    return db.cmsDocument.findMany({
      where: { kind: "page", slug, trashedAt: null },
      orderBy: { locale: "asc" },
    });
  } catch {
    return [];
  }
}

export async function trashedInsightSlugs() {
  try {
    const db = await cmsDb();
    const rows = await db.cmsDocument.findMany({
      where: { kind: "insight", trashedAt: { not: null } },
    });
    return rows.map((row) => String(row.slug));
  } catch {
    return [];
  }
}

/** Slugs that must not appear on the public insights index (trashed or offline). */
export async function hiddenInsightSlugs() {
  try {
    const db = await cmsDb();
    const rows = await db.cmsDocument.findMany({ where: { kind: "insight" } });
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

export async function listCaseStudies() {
  try {
    const { listCaseStudyRows } = await import("./case-study-store");
    return listCaseStudyRows();
  } catch {
    return [];
  }
}

export async function getCaseStudyRecord(id: string) {
  const { findCaseStudy } = await import("./case-study-store");
  return findCaseStudy(id);
}

export async function listTrashedCaseStudies() {
  try {
    const { listTrashedCaseStudyRows } = await import("./case-study-store");
    return listTrashedCaseStudyRows();
  } catch {
    return [];
  }
}

export async function listContacts() {
  try {
    const { listContactRows } = await import("./contact-store");
    return listContactRows();
  } catch {
    return [];
  }
}

export async function getContact(id: string) {
  const { findContact } = await import("./contact-store");
  return findContact(id);
}

export async function getPrimaryContact() {
  try {
    const { findPrimaryContact } = await import("./contact-store");
    return findPrimaryContact();
  } catch {
    return null;
  }
}

export async function listClientLogos() {
  try {
    const { listClientLogoRows } = await import("./client-logo-store");
    return listClientLogoRows();
  } catch {
    return [];
  }
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
