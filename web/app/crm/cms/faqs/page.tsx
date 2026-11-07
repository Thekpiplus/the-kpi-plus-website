import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { listFaqAdminRoutes } from "@/lib/cms/faq-store";

export default async function CmsFaqsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const routes = await listFaqAdminRoutes();

  return (
    <div className="crm-cms crm-cms-faqs">
      <PageHeader
        eyebrow="Content Management"
        title="FAQ ทุกหน้า"
        description="แก้คำถามที่พบบ่อยของแต่ละเส้นทางจากแอดมิน — บันทึกแล้วเว็บสาธารณะจะใช้ค่าจาก CMS แทนโค้ด"
        actions={
          <Link href="/crm/cms" className="crm-users-secondary">
            หน้าเพจทั้งหมด
          </Link>
        }
      />

      {params.error === "invalid" ? (
        <p className="crm-users-alert is-warn" role="status">
          เส้นทางไม่ถูกต้อง
        </p>
      ) : null}

      {routes.length === 0 ? (
        <EmptyState title="ยังไม่มี FAQ" body="เมื่อมี FAQ ในโค้ดหรือที่บันทึกจาก CMS จะแสดงรายการที่นี่" />
      ) : (
        <section className="crm-cms-faq-index" aria-labelledby="crm-cms-faq-index-heading">
          <div className="crm-cms-faq-index-head">
            <h2 id="crm-cms-faq-index-heading">
              เส้นทางทั้งหมด
              <span className="crm-leads-count">{routes.length}</span>
            </h2>
          </div>
          <div className="crm-table-wrap">
            <table className="crm-table crm-cms-faq-table">
              <thead>
                <tr>
                  <th>เส้นทาง</th>
                  <th>จำนวน</th>
                  <th>แหล่งข้อมูล</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {routes.map((row) => (
                  <tr key={row.route}>
                    <td>
                      <code className="crm-cms-faq-route">{row.route}</code>
                      <span className="crm-cms-faq-route-label">{row.label}</span>
                    </td>
                    <td>{row.count}</td>
                    <td>
                      <span className={`crm-cms-faq-source-pill is-${row.source}`}>
                        {row.source === "cms" ? "CMS" : row.source === "code" ? "โค้ด" : "ว่าง"}
                      </span>
                    </td>
                    <td className="crm-table-actions">
                      <Link
                        href={`/crm/cms/faqs/edit?route=${encodeURIComponent(row.route)}`}
                        className="kpi-button crm-users-primary"
                      >
                        แก้ไข
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
