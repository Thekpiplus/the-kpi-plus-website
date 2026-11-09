import { documentPath } from "@/lib/cms/body";
import { lockedPageList } from "@/lib/cms/locked";
import { isCmsPageLive } from "@/lib/cms/public";
import { listDocuments, listTrashedDocuments } from "@/lib/cms/queries";
import { siteMenuLabel } from "@/lib/nav";
import type { CmsDocumentRow } from "@/lib/cms/types";

export type WebsitePageRow = {
  key: string;
  id?: string;
  menuName: string;
  name: string;
  slug: string;
  metaTag: string;
  description: string;
  editHref?: string;
  previewHref?: string;
  canDelete: boolean;
  online: boolean;
  status: "published" | "draft" | "scheduled" | "site";
  updatedAt?: Date;
  updatedBy?: string;
  source: "site" | "cms";
};

function siteEditHref(route: string) {
  if (route === "/" || route === "") return "/crm/cms/pages/from";
  return `/crm/cms/pages/from${route.startsWith("/") ? route : `/${route}`}`;
}

function statusOf(doc: CmsDocumentRow): WebsitePageRow["status"] {
  if (doc.status === "draft") return "draft";
  if (doc.status === "scheduled") return "scheduled";
  return "published";
}

export async function loadWebsitePageRows(filters: { q?: string; status?: string } = {}) {
  const q = filters.q?.trim().toLowerCase() ?? "";
  const status = filters.status?.trim() ?? "";
  const [cmsPages, trashedPages] = await Promise.all([
    listDocuments("page"),
    listTrashedDocuments({ kind: "page" }),
  ]);
  const cmsByPath = new Map(cmsPages.map((page) => [documentPath(page), page]));
  const knownPaths = new Set([...cmsByPath.keys(), ...trashedPages.map((page) => documentPath(page))]);

  const siteRows: WebsitePageRow[] = lockedPageList()
    .filter((page) => page.language === "th")
    .filter((page) => !knownPaths.has(page.route || "/"))
    .map((page) => {
      const route = page.route || "/";
      return {
        key: `site:${route}`,
        menuName: siteMenuLabel(route, "th"),
        name: page.title,
        slug: route,
        metaTag: page.title,
        description: page.description || "—",
        editHref: siteEditHref(route),
        previewHref: route === "/" ? "/" : route,
        canDelete: true,
        online: true,
        status: "site" as const,
        source: "site" as const,
      };
    });

  const cmsRows: WebsitePageRow[] = cmsPages.map((page) => {
    const path = documentPath(page);
    return {
      key: `cms:${page.id}`,
      id: page.id,
      menuName: page.menuLabel?.trim() || "—",
      name: page.title,
      slug: path,
      metaTag: page.seoTitle?.trim() || page.title,
      description: page.metaDescription?.trim() || page.excerpt?.trim() || "—",
      editHref: `/crm/cms/pages/${page.id}`,
      previewHref: `/crm/cms/pages/${page.id}/preview`,
      canDelete: true,
      online: isCmsPageLive(page),
      status: statusOf(page),
      updatedAt: page.updatedAt instanceof Date ? page.updatedAt : new Date(page.updatedAt),
      updatedBy: page.updatedBy?.trim() || undefined,
      source: "cms" as const,
    };
  });

  const rows = [...siteRows, ...cmsRows]
    .filter((row) => {
      if (status === "published") return row.status === "published" || (row.status === "site" && row.online);
      if (status === "draft") return row.status === "draft";
      if (status === "scheduled") return row.status === "scheduled";
      if (status === "offline") return !row.online;
      return true;
    })
    .filter((row) => {
      if (!q) return true;
      return (
        row.menuName.toLowerCase().includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.slug.toLowerCase().includes(q) ||
        row.metaTag.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q) ||
        (row.updatedBy ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const aTime = a.updatedAt?.getTime() ?? 0;
      const bTime = b.updatedAt?.getTime() ?? 0;
      if (aTime !== bTime) return bTime - aTime;
      return a.slug.localeCompare(b.slug, "th");
    });

  return {
    rows,
    siteCount: siteRows.length,
    cmsCount: cmsRows.length,
    trashedCount: trashedPages.length,
    onlineCount: rows.filter((row) => row.online).length,
    draftCount: cmsRows.filter((row) => row.status === "draft").length,
  };
}

export function formatCmsDate(value?: Date) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

export function statusLabel(status: WebsitePageRow["status"]) {
  if (status === "draft") return "ฉบับร่าง";
  if (status === "scheduled") return "ตั้งเวลา";
  if (status === "site") return "หน้าจากโค้ด";
  return "เผยแพร่แล้ว";
}
