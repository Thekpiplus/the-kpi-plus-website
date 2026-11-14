import Link from "next/link";
import { documentPath } from "@/lib/cms/body";
import { cmsOverview, countTrashedDocuments, listDocuments, listRecentDocuments } from "@/lib/cms/queries";
import { formatCmsDate } from "@/lib/cms/page-rows";
import { lockedPageList } from "@/lib/cms/locked";

function kindLabel(kind: string) {
  return kind === "insight" ? "บทความ" : "หน้าเว็บ";
}

function statusLabel(status: string) {
  if (status === "draft") return "ฉบับร่าง";
  if (status === "scheduled") return "ตั้งเวลา";
  if (status === "published") return "เผยแพร่แล้ว";
  return status;
}

const SHORTCUTS = [
  { href: "/crm/cms/pages", label: "หน้าเว็บไซต์", hint: "ค้นหาและแก้ไขหน้า" },
  { href: "/crm/cms/insights", label: "บทความ", hint: "จัดลำดับและเผยแพร่" },
  { href: "/crm/cms/solutions", label: "บริการ", hint: "หน้า /solutions" },
  { href: "/crm/cms/case-studies-page", label: "หน้าผลงาน", hint: "Chrome หน้า /case-studies" },
  { href: "/crm/cms/approach", label: "แนวทางของเรา", hint: "หน้า /approach" },
  { href: "/crm/cms/revenue", label: "Revenue & Commercial", hint: "หน้า /solutions/revenue-commercial-management" },
  { href: "/crm/cms/reservations", label: "Reservations", hint: "หน้า /solutions/outsourced-hotel-reservations" },
  { href: "/crm/cms/b2b", label: "B2B Agent Sales", hint: "หน้า /solutions/b2b-agent-sales" },
  { href: "/crm/cms/google-ads", label: "Google Ads", hint: "หน้า /solutions/google-ads-management" },
  { href: "/crm/cms/meta-ads", label: "Meta Ads", hint: "หน้า /solutions/meta-ads-management" },
  { href: "/crm/cms/hotel-seo", label: "Hotel SEO", hint: "หน้า /solutions/hotel-seo-google-maps-ai-search" },
  { href: "/crm/cms/hotel-website", label: "Hotel Website", hint: "หน้า /solutions/hotel-website-design" },
  { href: "/crm/cms/hotel-direct-bookings", label: "Direct Bookings", hint: "หน้า /solutions/hotel-direct-bookings" },
  { href: "/crm/cms/independent-hotel", label: "Independent Hotel", hint: "หน้า /solutions/independent-hotel-management" },
  { href: "/crm/cms/hotel-systems", label: "Hotel Systems", hint: "หน้า /solutions/hotel-systems-implementation" },
  { href: "/crm/cms/hotel-ai", label: "Hotel AI", hint: "หน้า /solutions/hotel-ai-automation" },
  { href: "/crm/cms/hotel-training", label: "Hotel Training", hint: "หน้า /solutions/hotel-training-team-development" },
  { href: "/crm/cms/menus", label: "เมนูเว็บ", hint: "Header / Footer" },
  { href: "/crm/cms/media", label: "คลังไฟล์", hint: "รูปและสื่อ" },
  { href: "/crm/cms/seo", label: "SEO", hint: "Title และ Redirect" },
  { href: "/crm/cms/analytics", label: "Analytics", hint: "GA4 หน้าเพจ · ประเทศ" },
  { href: "/crm/cms/globals", label: "ตั้งค่าเว็บ", hint: "โดเมน · OG · GTM · GA4" },
] as const;

export default async function CmsOverviewPage() {
  const [overview, recent, trashed, pages, insights] = await Promise.all([
    cmsOverview(),
    listRecentDocuments(6),
    countTrashedDocuments(),
    listDocuments("page"),
    listDocuments("insight"),
  ]);
  const sitePages = lockedPageList().filter((page) => page.language === "th").length;
  const totalPages = overview.pages + sitePages;
  const missingSeo =
    pages.filter((doc) => !doc.seoTitle?.trim() || !doc.metaDescription?.trim()).length +
    insights.filter((doc) => !doc.seoTitle?.trim() || !doc.metaDescription?.trim()).length;
  const needsReview = overview.drafts + missingSeo;

  return (
    <div className="crm-cms crm-cms-overview">
      <header className="crm-cms-overview-head">
        <div>
          <p className="crm-cms-overview-kicker">Content Management</p>
          <h1 className="crm-cms-overview-title">ภาพรวมเนื้อหาเว็บไซต์</h1>
          <p className="crm-cms-overview-desc">
            สรุปสถานะเนื้อหาจากข้อมูลจริง และทางลัดไปแก้ไขหรือสร้างรายการใหม่
          </p>
        </div>
        <div className="crm-cms-overview-head-actions">
          <Link href="/crm/cms/pages/new" className="kpi-button">
            เพิ่มหน้าใหม่
          </Link>
          <Link href="/crm/cms/insights/new" className="crm-users-secondary">
            เพิ่มบทความ
          </Link>
        </div>
      </header>

      <section className="crm-dash-summary crm-cms-summary" aria-label="สรุป CMS">
        <div className="crm-dash-stats crm-cms-overview-stats" role="list">
          <Link href="/crm/cms/pages" className="crm-dash-stat is-cms" role="listitem">
            <span className="crm-dash-stat-label">หน้าเว็บไซต์</span>
            <strong className="crm-dash-stat-value">{totalPages}</strong>
            <span className="crm-dash-stat-hint">
              CMS {overview.pages} · โค้ด {sitePages}
            </span>
          </Link>
          <Link href="/crm/cms/pages?status=draft" className="crm-dash-stat is-partners" role="listitem">
            <span className="crm-dash-stat-label">ฉบับร่าง</span>
            <strong className="crm-dash-stat-value">{overview.drafts}</strong>
            <span className="crm-dash-stat-hint">รอเผยแพร่</span>
          </Link>
          <Link href="/crm/cms/insights" className="crm-dash-stat is-today" role="listitem">
            <span className="crm-dash-stat-label">บทความ / ข่าว</span>
            <strong className="crm-dash-stat-value">{overview.insights}</strong>
            <span className="crm-dash-stat-hint">เผยแพร่แล้ว {overview.publishedInsights}</span>
          </Link>
          <Link href="/crm/cms/seo" className="crm-dash-stat is-overdue" role="listitem">
            <span className="crm-dash-stat-label">ต้องตรวจสอบ</span>
            <strong className="crm-dash-stat-value">{needsReview}</strong>
            <span className="crm-dash-stat-hint">
              SEO ไม่ครบ {missingSeo} · ถังขยะ {trashed}
            </span>
          </Link>
        </div>
      </section>

      <div className="crm-cms-overview-body">
        <section className="crm-cms-overview-main" aria-labelledby="cms-recent-heading">
          <div className="crm-cms-overview-section-head">
            <div>
              <h2 id="cms-recent-heading" className="crm-cms-overview-section-title">
                แก้ไขล่าสุด
              </h2>
              <p className="crm-cms-overview-section-desc">6 รายการล่าสุดจากฐานข้อมูล CMS</p>
            </div>
            <Link href="/crm/cms/pages" className="crm-cms-overview-all-link">
              ดูทั้งหมด
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="crm-cms-overview-empty">
              <p>ยังไม่มีเอกสารใน CMS</p>
              <div className="crm-cms-overview-empty-actions">
                <Link href="/crm/cms/pages/new" className="kpi-button">
                  เพิ่มหน้าใหม่
                </Link>
                <Link href="/crm/cms/insights/new" className="crm-users-secondary">
                  เพิ่มบทความ
                </Link>
              </div>
            </div>
          ) : (
            <ul className="crm-cms-recent-list">
              {recent.map((doc) => {
                const href =
                  doc.kind === "insight" ? `/crm/cms/insights/${doc.id}` : `/crm/cms/pages/${doc.id}`;
                const updatedAt = doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt);
                const path = documentPath(doc);
                return (
                  <li key={doc.id} className="crm-cms-recent-item">
                    <div className="crm-cms-recent-main">
                      <Link href={href} className="crm-cms-recent-title" title={doc.title}>
                        {doc.title}
                      </Link>
                      <p className="crm-cms-recent-path" title={path}>
                        {path}
                      </p>
                    </div>
                    <div className="crm-cms-recent-meta">
                      <span className="crm-cms-recent-kind">{kindLabel(doc.kind)}</span>
                      <span className={`crm-cms-status-pill is-${doc.status}`}>{statusLabel(doc.status)}</span>
                      <time className="crm-cms-recent-time" dateTime={updatedAt.toISOString()}>
                        {formatCmsDate(updatedAt)}
                      </time>
                      <span className="crm-cms-recent-user" title={doc.updatedBy?.trim() || undefined}>
                        {doc.updatedBy?.trim() || "—"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <aside className="crm-cms-overview-side" aria-labelledby="cms-shortcuts-heading">
          <div className="crm-cms-overview-section-head">
            <div>
              <h2 id="cms-shortcuts-heading" className="crm-cms-overview-section-title">
                ทางลัด
              </h2>
              <p className="crm-cms-overview-section-desc">ไปยังส่วนที่ใช้บ่อย</p>
            </div>
          </div>
          <ul className="crm-cms-shortcut-grid">
            {SHORTCUTS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="crm-cms-shortcut-card">
                  <strong>{item.label}</strong>
                  <span>{item.hint}</span>
                </Link>
              </li>
            ))}
          </ul>
          {trashed > 0 ? (
            <p className="crm-cms-empty-note">
              <Link href="/crm/cms/trash" className="crm-cms-overview-all-link">
                เปิดถังขยะ ({trashed})
              </Link>
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
