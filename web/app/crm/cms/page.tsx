import Link from "next/link";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { documentPath } from "@/lib/cms/body";
import { cmsOverview, countTrashedDocuments, listRecentDocuments } from "@/lib/cms/queries";
import { formatCmsDate } from "@/lib/cms/page-rows";
import { lockedPageList } from "@/lib/cms/locked";

function kindLabel(kind: string) {
  return kind === "insight" ? "บทความ" : "หน้าเว็บ";
}

export default async function CmsOverviewPage() {
  const [overview, recent, trashed] = await Promise.all([
    cmsOverview(),
    listRecentDocuments(8),
    countTrashedDocuments(),
  ]);
  const sitePages = lockedPageList().filter((page) => page.language === "th").length;

  return (
    <div className="crm-cms crm-cms-overview">
      <header className="crm-cms-hero">
        <div className="crm-cms-hero-copy">
          <p className="crm-cms-hero-kicker">Content Management</p>
          <h1 className="crm-cms-hero-title">ภาพรวมเนื้อหาเว็บไซต์</h1>
          <p className="crm-cms-hero-desc">
            ดูสรุปหน้าและบทความจากข้อมูลจริง แล้วไปแก้ไขหรือสร้างเนื้อหาได้จากปุ่มลัดด้านล่าง
          </p>
        </div>
        <div className="crm-cms-hero-actions">
          <Link href="/crm/cms/pages/new" className="kpi-button crm-cms-hero-btn">
            เพิ่มหน้า
          </Link>
          <Link href="/crm/cms/insights/new" className="crm-users-secondary crm-cms-hero-btn-ghost">
            เพิ่มบทความ
          </Link>
        </div>
      </header>

      <section className="crm-dash-summary crm-cms-summary" aria-label="สรุป CMS">
        <div className="crm-dash-stats" role="list">
          <Link href="/crm/cms/pages" className="crm-dash-stat is-cms" role="listitem">
            <span className="crm-dash-stat-label">หน้าเว็บไซต์</span>
            <strong className="crm-dash-stat-value">{overview.pages + sitePages}</strong>
            <span className="crm-dash-stat-hint">
              CMS {overview.pages} · จากโค้ด {sitePages}
            </span>
          </Link>
          <Link href="/crm/cms/pages?status=draft" className="crm-dash-stat is-partners" role="listitem">
            <span className="crm-dash-stat-label">ฉบับร่าง</span>
            <strong className="crm-dash-stat-value">{overview.drafts}</strong>
            <span className="crm-dash-stat-hint">หน้าและบทความ</span>
          </Link>
          <Link href="/crm/cms/insights" className="crm-dash-stat is-today" role="listitem">
            <span className="crm-dash-stat-label">บทความ / ข่าว</span>
            <strong className="crm-dash-stat-value">{overview.insights}</strong>
            <span className="crm-dash-stat-hint">เผยแพร่แล้ว {overview.publishedInsights}</span>
          </Link>
          <Link href="/crm/cms/media" className="crm-dash-stat is-web" role="listitem">
            <span className="crm-dash-stat-label">ไฟล์ในคลัง</span>
            <strong className="crm-dash-stat-value">{overview.media}</strong>
            <span className="crm-dash-stat-hint">สื่อและรูปภาพ</span>
          </Link>
        </div>
      </section>

      <div className="crm-cms-overview-grid">
        <section className="crm-cms-panel">
          <PageHeader
            eyebrow="ล่าสุด"
            title="รายการที่แก้ไขล่าสุด"
            description="เรียงจากเวลาอัปเดตในฐานข้อมูล CMS"
            actions={
              <Link href="/crm/cms/trash" className="crm-users-secondary">
                ถังขยะ ({trashed})
              </Link>
            }
          />
          {recent.length === 0 ? (
            <p className="crm-cms-empty-note">ยังไม่มีเอกสารใน CMS — เริ่มจากเพิ่มหน้าหรือบทความ</p>
          ) : (
            <div className="crm-cms-table-wrap">
              <table className="crm-cms-table crm-cms-table--compact">
                <thead>
                  <tr>
                    <th scope="col">ชื่อ</th>
                    <th scope="col">ประเภท</th>
                    <th scope="col">สถานะ</th>
                    <th scope="col">อัปเดต</th>
                    <th scope="col">โดย</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((doc) => {
                    const href =
                      doc.kind === "insight" ? `/crm/cms/insights/${doc.id}` : `/crm/cms/pages/${doc.id}`;
                    const updatedAt = doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt);
                    return (
                      <tr key={doc.id}>
                        <td data-label="ชื่อ">
                          <Link href={href} className="crm-cms-name">
                            {doc.title}
                          </Link>
                          <code className="crm-cms-slug">{documentPath(doc)}</code>
                        </td>
                        <td data-label="ประเภท">{kindLabel(doc.kind)}</td>
                        <td data-label="สถานะ">
                          <span className={`crm-cms-status-pill is-${doc.status}`}>{doc.status}</span>
                        </td>
                        <td data-label="อัปเดต">{formatCmsDate(updatedAt)}</td>
                        <td data-label="โดย">{doc.updatedBy?.trim() || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="crm-cms-panel crm-cms-overview-shortcuts">
          <PageHeader eyebrow="ทางลัด" title="ไปแก้เนื้อหา" description="ลิงก์ไปยังหน้าจัดการที่ใช้งานได้จริง" />
          <ul className="crm-cms-shortcut-list">
            <li>
              <Link href="/crm/cms/pages">หน้าเว็บไซต์</Link>
              <span>ค้นหา กรองสถานะ และเปิดแก้หน้า</span>
            </li>
            <li>
              <Link href="/crm/cms/insights">บทความ / ข่าว</Link>
              <span>จัดลำดับ เผยแพร่ และอัปโหลดภาพปก</span>
            </li>
            <li>
              <Link href="/crm/cms/solutions">บริการ / ผลิตภัณฑ์</Link>
              <span>แก้ไขหน้าโซลูชันและไดเรกทอรีบริการ</span>
            </li>
            <li>
              <Link href="/crm/cms/menus">เมนูเว็บไซต์</Link>
              <span>กำหนด header/footer และลำดับเมนู</span>
            </li>
            <li>
              <Link href="/crm/cms/media">คลังรูปภาพและไฟล์</Link>
              <span>อัปโหลดและคัดลอกพาธไปใช้ในเนื้อหา</span>
            </li>
            <li>
              <Link href="/crm/cms/seo">SEO</Link>
              <span>ค่าทั้งไซต์ Redirect และช่องทางแก้ SEO รายหน้า</span>
            </li>
            <li>
              <Link href="/crm/users">ผู้ใช้งานและสิทธิ์</Link>
              <span>บทบาทและสิทธิ์เข้าถึงโมดูล</span>
            </li>
            <li>
              <Link href="/crm/cms/globals">ตั้งค่าเว็บไซต์</Link>
              <span>โดเมน รูป OG และข้อความแบรนด์</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
