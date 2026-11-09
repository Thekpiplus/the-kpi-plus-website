import Link from "next/link";
import { CmsPageOnlineToggle } from "@/components/crm/ui/CmsPageOnlineToggle";
import { CmsPageRowActions } from "@/components/crm/ui/CmsPageRowActions";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { SitePageDeleteButton } from "@/components/crm/ui/SitePageDeleteButton";
import { formatCmsDateCompact, loadWebsitePageRows, statusLabel } from "@/lib/cms/page-rows";

const PAGE_SIZES = [10, 20, 50] as const;

function buildPagesHref(input: {
  q?: string;
  status?: string;
  page?: number;
  per?: number;
}) {
  const params = new URLSearchParams();
  if (input.q?.trim()) params.set("q", input.q.trim());
  if (input.status?.trim()) params.set("status", input.status.trim());
  if (input.per && input.per !== 20) params.set("per", String(input.per));
  if (input.page && input.page > 1) params.set("page", String(input.page));
  const query = params.toString();
  return query ? `/crm/cms/pages?${query}` : "/crm/cms/pages";
}

export default async function CmsWebsitePagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; deleted?: string; sort?: string; page?: string; per?: string }>;
}) {
  const params = await searchParams;
  const {
    rows,
    totalCount,
    publishedCount,
    draftCount,
    offlineCount,
    trashedCount,
  } = await loadWebsitePageRows({
    q: params.q,
    status: params.status,
  });

  const filtered = Boolean(params.q?.trim() || params.status);
  const perRaw = Number(params.per);
  const per = PAGE_SIZES.includes(perRaw as (typeof PAGE_SIZES)[number]) ? perRaw : 20;
  const totalPages = Math.max(1, Math.ceil(rows.length / per));
  const page = Math.min(Math.max(1, Number(params.page) || 1), totalPages);
  const start = (page - 1) * per;
  const pageRows = rows.slice(start, start + per);
  const rangeEnd = rows.length === 0 ? 0 : Math.min(start + pageRows.length, rows.length);

  return (
    <div className="crm-cms crm-cms-pages">
      <header className="crm-cms-overview-head">
        <div>
          <p className="crm-cms-overview-kicker">Content Management</p>
          <h1 className="crm-cms-overview-title">หน้าเว็บไซต์</h1>
          <p className="crm-cms-overview-desc">ค้นหา แก้ไข และควบคุมการแสดงผลหน้าเว็บจาก CMS</p>
        </div>
        <div className="crm-cms-overview-head-actions">
          <Link href="/crm/cms/pages/new" className="kpi-button">
            เพิ่มหน้าใหม่
          </Link>
        </div>
      </header>

      {params.deleted === "1" ? (
        <p className="crm-users-alert is-ok" role="status">
          ย้ายเข้าถังขยะแล้ว —{" "}
          <Link href="/crm/cms/trash" className="crm-cms-inline-link">
            เปิดถังขยะ
          </Link>
        </p>
      ) : null}

      <section className="crm-dash-summary crm-cms-summary" aria-label="สรุปหน้าเว็บ">
        <div className="crm-dash-stats crm-cms-pages-stats" role="list">
          <div className="crm-dash-stat is-cms is-static" role="listitem">
            <span className="crm-dash-stat-label">ทั้งหมด</span>
            <strong className="crm-dash-stat-value">{totalCount}</strong>
            <span className="crm-dash-stat-hint">หน้าในระบบ</span>
          </div>
          <Link href="/crm/cms/pages?status=published" className="crm-dash-stat is-today" role="listitem">
            <span className="crm-dash-stat-label">เผยแพร่แล้ว</span>
            <strong className="crm-dash-stat-value">{publishedCount}</strong>
            <span className="crm-dash-stat-hint">แสดงบนเว็บไซต์</span>
          </Link>
          <Link href="/crm/cms/pages?status=draft" className="crm-dash-stat is-partners" role="listitem">
            <span className="crm-dash-stat-label">ฉบับร่าง</span>
            <strong className="crm-dash-stat-value">{draftCount}</strong>
            <span className="crm-dash-stat-hint">ยังไม่เผยแพร่</span>
          </Link>
          <Link href="/crm/cms/pages?status=offline" className="crm-dash-stat is-overdue" role="listitem">
            <span className="crm-dash-stat-label">ปิดใช้งาน</span>
            <strong className="crm-dash-stat-value">{offlineCount}</strong>
            <span className="crm-dash-stat-hint">ไม่แสดงบนเว็บ</span>
          </Link>
        </div>
        {trashedCount > 0 ? (
          <p className="crm-cms-pages-trash-note">
            <Link href="/crm/cms/trash" className="crm-cms-overview-all-link">
              เปิดถังขยะ ({trashedCount})
            </Link>
          </p>
        ) : null}
      </section>

      <section className="crm-cms-toolbar crm-cms-pages-toolbar">
        <form className="crm-cms-filters crm-cms-pages-filters" method="get">
          <label className="crm-cms-pages-search">
            ค้นหา
            <input
              className="crm-field"
              name="q"
              defaultValue={params.q}
              placeholder="ชื่อหน้าหรือ URL"
              autoComplete="off"
            />
          </label>
          <label>
            สถานะ
            <select className="crm-select" name="status" defaultValue={params.status ?? ""}>
              <option value="">ทั้งหมด</option>
              <option value="published">เผยแพร่แล้ว</option>
              <option value="draft">ฉบับร่าง</option>
              <option value="scheduled">ตั้งเวลา</option>
              <option value="offline">ปิดใช้งาน</option>
            </select>
          </label>
          <label>
            ต่อหน้า
            <select className="crm-select" name="per" defaultValue={String(per)}>
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <input type="hidden" name="page" value="1" />
          <div className="crm-cms-filters-actions">
            <button className="kpi-button" type="submit">
              กรอง
            </button>
            {filtered || page > 1 || per !== 20 ? (
              <Link href="/crm/cms/pages" className="crm-users-secondary">
                ล้างตัวกรอง
              </Link>
            ) : null}
          </div>
        </form>
        <p className="crm-cms-count">
          {rows.length === 0
            ? "ไม่พบรายการ"
            : `แสดง ${start + 1}–${rangeEnd} จาก ${rows.length}${filtered ? " (กรองแล้ว)" : ""}`}
        </p>
      </section>

      <section className="crm-cms-panel crm-cms-pages-panel">
        {rows.length === 0 ? (
          <EmptyState
            filtered={filtered}
            title={filtered ? "ไม่พบหน้าตามเงื่อนไข" : "ยังไม่มีหน้า"}
            body={
              filtered
                ? "ลองเปลี่ยนคำค้นหรือสถานะ หรือล้างตัวกรองเพื่อดูรายการทั้งหมด"
                : "สร้างหน้าใหม่จาก CMS หรือเปิดหน้าจากโค้ดมาแก้ไข"
            }
            action={
              <Link href="/crm/cms/pages/new" className="kpi-button">
                เพิ่มหน้าใหม่
              </Link>
            }
          />
        ) : (
          <>
            <div className="crm-cms-table-wrap">
              <table className="crm-cms-table crm-cms-table--pages">
                <colgroup>
                  <col className="crm-cms-col-name" />
                  <col className="crm-cms-col-status" />
                  <col className="crm-cms-col-updated" />
                  <col className="crm-cms-col-editor" />
                  <col className="crm-cms-col-online" />
                  <col className="crm-cms-col-actions" />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">ชื่อหน้า / URL</th>
                    <th scope="col">สถานะเนื้อหา</th>
                    <th scope="col">แก้ไขล่าสุด</th>
                    <th scope="col">ผู้แก้ไข</th>
                    <th scope="col">แสดงบนเว็บ</th>
                    <th scope="col">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row) => {
                    const updatedLabel = formatCmsDateCompact(row.updatedAt);
                    return (
                      <tr key={row.key}>
                        <td data-label="ชื่อหน้า / URL">
                          <div className="crm-cms-page-cell">
                            {row.editHref ? (
                              <Link href={row.editHref} className="crm-cms-name" title={row.name}>
                                {row.name}
                              </Link>
                            ) : (
                              <span className="crm-cms-name is-static" title={row.name}>
                                {row.name}
                              </span>
                            )}
                            <code className="crm-cms-slug" title={row.slug}>
                              {row.slug}
                            </code>
                          </div>
                        </td>
                        <td data-label="สถานะเนื้อหา">
                          <span className={`crm-cms-status-pill is-${row.status}`}>{statusLabel(row.status)}</span>
                        </td>
                        <td data-label="แก้ไขล่าสุด">
                          <time
                            className="crm-cms-date"
                            dateTime={row.updatedAt?.toISOString()}
                            title={row.updatedAt ? formatCmsDateCompact(row.updatedAt) : undefined}
                          >
                            {updatedLabel}
                          </time>
                        </td>
                        <td data-label="ผู้แก้ไข">
                          <span className="crm-cms-editor" title={row.updatedBy || undefined}>
                            {row.updatedBy || "—"}
                          </span>
                        </td>
                        <td data-label="แสดงบนเว็บ">
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
                              returnTo="/crm/cms/pages"
                              previewHref={row.previewHref}
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
                                    <path
                                      d="M13.5 6.5l4 4"
                                      stroke="currentColor"
                                      strokeWidth="1.7"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </Link>
                              ) : null}
                              {row.previewHref ? (
                                <Link
                                  href={row.previewHref}
                                  className="crm-users-icon-btn"
                                  title="ดูตัวอย่าง"
                                  aria-label={`ดูตัวอย่าง ${row.name}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path
                                      d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                                      stroke="currentColor"
                                      strokeWidth="1.7"
                                    />
                                    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
                                  </svg>
                                </Link>
                              ) : null}
                              <SitePageDeleteButton route={row.slug} title={row.name} />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 ? (
              <nav className="crm-cms-pager" aria-label="แบ่งหน้ารายการ">
                <Link
                  href={buildPagesHref({ q: params.q, status: params.status, per, page: Math.max(1, page - 1) })}
                  className={`crm-users-secondary${page <= 1 ? " is-disabled" : ""}`}
                  aria-disabled={page <= 1}
                  tabIndex={page <= 1 ? -1 : undefined}
                >
                  ก่อนหน้า
                </Link>
                <p className="crm-cms-pager-status">
                  หน้า {page} จาก {totalPages}
                </p>
                <Link
                  href={buildPagesHref({ q: params.q, status: params.status, per, page: Math.min(totalPages, page + 1) })}
                  className={`crm-users-secondary${page >= totalPages ? " is-disabled" : ""}`}
                  aria-disabled={page >= totalPages}
                  tabIndex={page >= totalPages ? -1 : undefined}
                >
                  ถัดไป
                </Link>
              </nav>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
