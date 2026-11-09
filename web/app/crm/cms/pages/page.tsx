import Link from "next/link";
import { CmsPageOnlineToggle } from "@/components/crm/ui/CmsPageOnlineToggle";
import { CmsPageRowActions } from "@/components/crm/ui/CmsPageRowActions";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { SitePageDeleteButton } from "@/components/crm/ui/SitePageDeleteButton";
import { formatCmsDate, loadWebsitePageRows, statusLabel } from "@/lib/cms/page-rows";

function truncate(value: string, max = 120) {
  const text = value.trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export default async function CmsWebsitePagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; deleted?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const { rows, siteCount, cmsCount, trashedCount, onlineCount, draftCount } = await loadWebsitePageRows({
    q: params.q,
    status: params.status,
  });
  const filtered = Boolean(params.q?.trim() || params.status);

  return (
    <div className="crm-cms">
      <header className="crm-cms-hero crm-cms-hero--compact">
        <div className="crm-cms-hero-copy">
          <p className="crm-cms-hero-kicker">Content Management</p>
          <h1 className="crm-cms-hero-title">หน้าเว็บไซต์</h1>
          <p className="crm-cms-hero-desc">รายการหน้าที่แก้ได้จาก CMS พร้อมสถานะ วันที่แก้ไข และทางลัดไปดูตัวอย่าง</p>
        </div>
        <div className="crm-cms-hero-actions">
          <Link href="/crm/cms/pages/new" className="kpi-button crm-cms-hero-btn">
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
        <div className="crm-dash-stats" role="list">
          <div className="crm-dash-stat is-cms is-static" role="listitem">
            <span className="crm-dash-stat-label">ทั้งหมด</span>
            <strong className="crm-dash-stat-value">{siteCount + cmsCount}</strong>
            <span className="crm-dash-stat-hint">ไซต์ + CMS</span>
          </div>
          <div className="crm-dash-stat is-today is-static" role="listitem">
            <span className="crm-dash-stat-label">ออนไลน์</span>
            <strong className="crm-dash-stat-value">{onlineCount}</strong>
            <span className="crm-dash-stat-hint">{filtered ? "ในผลลัพธ์ที่กรอง" : "พร้อมเผยแพร่"}</span>
          </div>
          <Link href="/crm/cms/pages?status=draft" className="crm-dash-stat is-partners" role="listitem">
            <span className="crm-dash-stat-label">ฉบับร่าง</span>
            <strong className="crm-dash-stat-value">{draftCount}</strong>
            <span className="crm-dash-stat-hint">ใน CMS</span>
          </Link>
          <Link href="/crm/cms/trash" className="crm-dash-stat is-overdue" role="listitem">
            <span className="crm-dash-stat-label">ถังขยะ</span>
            <strong className="crm-dash-stat-value">{trashedCount}</strong>
            <span className="crm-dash-stat-hint">เปิดถังขยะ</span>
          </Link>
        </div>
      </section>

      <section className="crm-cms-toolbar">
        <form className="crm-cms-filters" method="get">
          <label>
            ค้นหา
            <input className="crm-field" name="q" defaultValue={params.q} placeholder="ชื่อหน้า slug หรือ meta" />
          </label>
          <label>
            สถานะ
            <select className="crm-select" name="status" defaultValue={params.status ?? ""}>
              <option value="">ทั้งหมด</option>
              <option value="published">เผยแพร่แล้ว</option>
              <option value="draft">ฉบับร่าง</option>
              <option value="scheduled">ตั้งเวลา</option>
              <option value="offline">ไม่เผยแพร่ / ออฟไลน์</option>
            </select>
          </label>
          <div className="crm-cms-filters-actions">
            <button className="kpi-button" type="submit">
              กรอง
            </button>
            {filtered ? (
              <Link href="/crm/cms/pages" className="crm-users-secondary">
                ล้างตัวกรอง
              </Link>
            ) : null}
          </div>
        </form>
        <p className="crm-cms-count">แสดง {rows.length} หน้า</p>
      </section>

      <section className="crm-cms-panel">
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
          <div className="crm-cms-table-wrap">
            <table className="crm-cms-table">
              <thead>
                <tr>
                  <th scope="col">ชื่อหน้า / URL</th>
                  <th scope="col">สถานะ</th>
                  <th scope="col">แก้ไขล่าสุด</th>
                  <th scope="col">ผู้แก้ไข</th>
                  <th scope="col">ออนไลน์</th>
                  <th scope="col">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key}>
                    <td data-label="ชื่อหน้า / URL">
                      {row.editHref ? (
                        <Link href={row.editHref} className="crm-cms-name">
                          {row.name}
                        </Link>
                      ) : (
                        <span className="crm-cms-name is-static">{row.name}</span>
                      )}
                      <code className="crm-cms-slug">{row.slug}</code>
                      <span className="crm-cms-meta" title={row.metaTag}>
                        {truncate(row.metaTag, 72)}
                      </span>
                    </td>
                    <td data-label="สถานะ">
                      <span className={`crm-cms-status-pill is-${row.status}`}>{statusLabel(row.status)}</span>
                    </td>
                    <td data-label="แก้ไขล่าสุด">{formatCmsDate(row.updatedAt)}</td>
                    <td data-label="ผู้แก้ไข">{row.updatedBy || "—"}</td>
                    <td data-label="ออนไลน์">
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
                                <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
