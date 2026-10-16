import Link from "next/link";
import { CmsPageOnlineToggle } from "@/components/crm/ui/CmsPageOnlineToggle";
import { CmsPageRowActions } from "@/components/crm/ui/CmsPageRowActions";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { SitePageDeleteButton } from "@/components/crm/ui/SitePageDeleteButton";
import { documentPath } from "@/lib/cms/body";
import { lockedPageList } from "@/lib/cms/locked";
import { isCmsPageLive } from "@/lib/cms/public";
import { listDocuments, listTrashedDocuments } from "@/lib/cms/queries";
import { siteMenuLabel } from "@/lib/nav";

type PageRow = {
  key: string;
  id?: string;
  menuName: string;
  name: string;
  slug: string;
  metaTag: string;
  description: string;
  editHref?: string;
  canDelete: boolean;
  online: boolean;
  source: "site" | "cms";
};

function truncate(value: string, max = 120) {
  const text = value.trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function siteEditHref(route: string) {
  if (route === "/" || route === "") return "/crm/cms/pages/from";
  return `/crm/cms/pages/from${route.startsWith("/") ? route : `/${route}`}`;
}

export default async function CmsHomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim().toLowerCase() ?? "";
  const [cmsPages, trashedPages] = await Promise.all([listDocuments("page"), listTrashedDocuments({ kind: "page" })]);
  const cmsByPath = new Map(cmsPages.map((page) => [documentPath(page), page]));
  const knownPaths = new Set([...cmsByPath.keys(), ...trashedPages.map((page) => documentPath(page))]);

  const siteRows: PageRow[] = lockedPageList()
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
        canDelete: true,
        online: true,
        source: "site" as const,
      };
    });

  const cmsRows: PageRow[] = cmsPages.map((page) => ({
    key: `cms:${page.id}`,
    id: page.id,
    menuName: page.menuLabel?.trim() || "—",
    name: page.title,
    slug: documentPath(page),
    metaTag: page.seoTitle?.trim() || page.title,
    description: page.metaDescription?.trim() || page.excerpt?.trim() || "—",
    editHref: `/crm/cms/pages/${page.id}`,
    canDelete: true,
    online: isCmsPageLive(page),
    source: "cms" as const,
  }));

  const rows = [...siteRows, ...cmsRows]
    .filter((row) => {
      if (!q) return true;
      return (
        row.menuName.toLowerCase().includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.slug.toLowerCase().includes(q) ||
        row.metaTag.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.slug.localeCompare(b.slug, "th"));

  return (
    <div className="crm-cms">
      <PageHeader
        eyebrow="Content Management"
        title="หน้าเว็บ"
        description="รายชื่อหน้าที่มีอยู่บนเว็บ พร้อม slug meta tag และคำอธิบาย"
        actions={
          <Link href="/crm/cms/pages/new" className="kpi-button">
            สร้างหน้าเพจใหม่
          </Link>
        }
      />

      {params.deleted === "1" ? (
        <p className="crm-users-alert is-ok" role="status">
          ย้ายเข้าถังขยะแล้ว —{" "}
          <Link href="/crm/cms/trash" className="crm-cms-inline-link">
            เปิดถังขยะ
          </Link>
        </p>
      ) : null}

      <section className="crm-cms-toolbar">
        <form className="crm-cms-search" method="get">
          <label className="crm-cms-search-field">
            <span className="sr-only">ค้นหาหน้า</span>
            <input name="q" defaultValue={params.q} placeholder="ค้นหาชื่อหน้า slug หรือ meta" />
          </label>
          <button className="kpi-button" type="submit">
            ค้นหา
          </button>
          {q ? (
            <Link href="/crm/cms" className="crm-users-secondary">
              ล้าง
            </Link>
          ) : null}
        </form>
        <p className="crm-cms-count">แสดง {rows.length} หน้า</p>
      </section>

      <section className="crm-cms-panel">
        {rows.length === 0 ? (
          <EmptyState
            title="ไม่พบหน้า"
            body="ลองเปลี่ยนคำค้น หรือสร้างหน้าใหม่จาก CMS"
            action={
              <Link href="/crm/cms/pages/new" className="kpi-button">
                สร้างหน้าเพจใหม่
              </Link>
            }
          />
        ) : (
          <div className="crm-cms-table-wrap">
            <table className="crm-cms-table">
              <thead>
                <tr>
                  <th scope="col">ชื่อเมนู</th>
                  <th scope="col">ชื่อหน้า</th>
                  <th scope="col">Slug</th>
                  <th scope="col">Meta Tag</th>
                  <th scope="col">Description</th>
                  <th scope="col">สถานะ</th>
                  <th scope="col">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key}>
                    <td data-label="ชื่อเมนู">
                      <span className="crm-cms-menu-name">{row.menuName}</span>
                    </td>
                    <td data-label="ชื่อหน้า">
                      {row.editHref ? (
                        <Link href={row.editHref} className="crm-cms-name">
                          {row.name}
                        </Link>
                      ) : (
                        <span className="crm-cms-name is-static">{row.name}</span>
                      )}
                    </td>
                    <td data-label="Slug">
                      <code className="crm-cms-slug">{row.slug}</code>
                    </td>
                    <td data-label="Meta Tag">
                      <span className="crm-cms-meta" title={row.metaTag}>
                        {truncate(row.metaTag, 80)}
                      </span>
                    </td>
                    <td data-label="Description">
                      <span className="crm-cms-desc" title={row.description}>
                        {truncate(row.description, 100)}
                      </span>
                    </td>
                    <td data-label="สถานะ">
                      <CmsPageOnlineToggle
                        pageId={row.id}
                        route={row.slug}
                        online={row.online}
                        pageName={row.name}
                      />
                    </td>
                    <td data-label="การดำเนินการ">
                      {row.source === "cms" ? (
                        <CmsPageRowActions
                          pageId={row.id}
                          pageName={row.name}
                          editHref={row.editHref}
                          canDelete={row.canDelete}
                          returnTo="/crm/cms"
                        />
                      ) : (
                        <div className="crm-users-icon-actions crm-cms-row-actions">
                          {row.editHref ? (
                            <Link
                              href={row.editHref}
                              className="crm-users-icon-btn"
                              title="แก้ไข"
                              aria-label={`แก้ไข ${row.name}`}
                            >
                              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                  d="M4 20h4l10.5-10.5a1.5 1.5 0 0 0 0-2.12L16.62 5.5a1.5 1.5 0 0 0-2.12 0L4 16v4Z"
                                  stroke="currentColor"
                                  strokeWidth="1.7"
                                  strokeLinejoin="round"
                                />
                                <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                              </svg>
                            </Link>
                          ) : null}
                          <SitePageDeleteButton route={row.slug} title={row.name} />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
