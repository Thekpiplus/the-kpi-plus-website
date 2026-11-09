import Link from "next/link";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { documentPath } from "@/lib/cms/body";
import { getSetting, listDocuments, listRedirects } from "@/lib/cms/queries";
import { parseSiteGlobals } from "@/lib/company-public";

export default async function CmsSeoHubPage() {
  const [pages, insights, redirects, siteRow] = await Promise.all([
    listDocuments("page"),
    listDocuments("insight"),
    listRedirects(),
    getSetting("site"),
  ]);
  const globals = parseSiteGlobals(siteRow?.value);
  const missingPageSeo = pages.filter((doc) => !doc.seoTitle?.trim() || !doc.metaDescription?.trim()).slice(0, 12);
  const missingInsightSeo = insights
    .filter((doc) => !doc.seoTitle?.trim() || !doc.metaDescription?.trim())
    .slice(0, 12);
  const activeRedirects = redirects.filter((item) => item.active).length;

  return (
    <div className="crm-cms">
      <header className="crm-cms-hero crm-cms-hero--compact">
        <div className="crm-cms-hero-copy">
          <p className="crm-cms-hero-kicker">Content Management</p>
          <h1 className="crm-cms-hero-title">SEO</h1>
          <p className="crm-cms-hero-desc">
            จัดการค่า SEO ระดับเว็บไซต์ และไปแก้ title / description / OG ของแต่ละหน้าจากหน้าแก้ไขเนื้อหา
          </p>
        </div>
        <div className="crm-cms-hero-actions">
          <Link href="/crm/cms/globals" className="kpi-button crm-cms-hero-btn">
            ตั้งค่าทั้งไซต์
          </Link>
          <Link href="/crm/cms/redirects" className="crm-users-secondary crm-cms-hero-btn-ghost">
            Redirect
          </Link>
        </div>
      </header>

      <section className="crm-dash-summary crm-cms-summary" aria-label="สรุป SEO">
        <div className="crm-dash-stats" role="list">
          <div className="crm-dash-stat is-cms is-static" role="listitem">
            <span className="crm-dash-stat-label">หน้าขาด SEO</span>
            <strong className="crm-dash-stat-value">{missingPageSeo.length}</strong>
            <span className="crm-dash-stat-hint">จากทั้งหมด {pages.length}</span>
          </div>
          <div className="crm-dash-stat is-today is-static" role="listitem">
            <span className="crm-dash-stat-label">บทความขาด SEO</span>
            <strong className="crm-dash-stat-value">{missingInsightSeo.length}</strong>
            <span className="crm-dash-stat-hint">จากทั้งหมด {insights.length}</span>
          </div>
          <Link href="/crm/cms/redirects" className="crm-dash-stat is-partners" role="listitem">
            <span className="crm-dash-stat-label">Redirect ที่เปิดใช้</span>
            <strong className="crm-dash-stat-value">{activeRedirects}</strong>
            <span className="crm-dash-stat-hint">จาก {redirects.length} รายการ</span>
          </Link>
          <Link href="/crm/cms/globals" className="crm-dash-stat is-web" role="listitem">
            <span className="crm-dash-stat-label">โดเมน canonical</span>
            <strong className="crm-dash-stat-value crm-dash-stat-value--text">
              {(globals.canonicalHost || "—").replace(/^https?:\/\//, "").slice(0, 18)}
            </strong>
            <span className="crm-dash-stat-hint">แก้ที่ตั้งค่าเว็บไซต์</span>
          </Link>
        </div>
      </section>

      <div className="crm-cms-overview-grid">
        <section className="crm-cms-panel">
          <PageHeader
            eyebrow="Pages"
            title="หน้าที่ยังไม่มี SEO ครบ"
            description="ต้องมี SEO title และ meta description — กดเพื่อเปิดหน้าแก้ไข"
          />
          {missingPageSeo.length === 0 ? (
            <p className="crm-cms-empty-note">หน้าใน CMS มี SEO title และ description ครบแล้ว</p>
          ) : (
            <ul className="crm-cms-shortcut-list">
              {missingPageSeo.map((doc) => (
                <li key={doc.id}>
                  <Link href={`/crm/cms/pages/${doc.id}`}>{doc.title}</Link>
                  <span>{documentPath(doc)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="crm-cms-panel">
          <PageHeader
            eyebrow="Insights"
            title="บทความที่ยังไม่มี SEO ครบ"
            description="แก้ SEO ได้ในฟอร์มบทความ รวมถึงรูป OG และ canonical"
          />
          {missingInsightSeo.length === 0 ? (
            <p className="crm-cms-empty-note">บทความใน CMS มี SEO title และ description ครบแล้ว</p>
          ) : (
            <ul className="crm-cms-shortcut-list">
              {missingInsightSeo.map((doc) => (
                <li key={doc.id}>
                  <Link href={`/crm/cms/insights/${doc.id}`}>{doc.title}</Link>
                  <span>{documentPath(doc)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
