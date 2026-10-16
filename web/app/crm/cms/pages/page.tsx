import Link from "next/link";
import { CmsPageRowActions } from "@/components/crm/ui/CmsPageRowActions";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { documentPath } from "@/lib/cms/body";
import { listDocuments } from "@/lib/cms/queries";

function truncate(value: string, max = 120) {
  const text = value.trim();
  if (!text) return "—";
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export default async function CmsPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const pages = await listDocuments("page", { q: params.q, status: params.status });
  const filtered = Boolean(params.q?.trim() || params.status);

  return (
    <div className="crm-cms">
      <PageHeader
        eyebrow="Content Management"
        title="หน้าจาก CMS"
        description="หน้าที่สร้างในระบบ CMS — แก้ไขได้จากรายการนี้"
        actions={
          <div className="crm-cms-actions">
            <Link href="/crm/cms" className="crm-users-secondary">
              หน้าเพจทั้งหมด
            </Link>
            <Link href="/crm/cms/pages/new" className="kpi-button">
              สร้างหน้าเพจใหม่
            </Link>
          </div>
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
        <form className="crm-cms-filters" method="get">
          <label>
            ค้นหา
            <input className="crm-field" name="q" defaultValue={params.q} placeholder="ชื่อหน้า หรือ slug" />
          </label>
          <label>
            สถานะ
            <select className="crm-select" name="status" defaultValue={params.status ?? ""}>
              <option value="">ทั้งหมด</option>
              <option value="draft">ฉบับร่าง</option>
              <option value="published">เผยแพร่</option>
              <option value="scheduled">ตั้งเวลา</option>
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
        <p className="crm-cms-count">แสดง {pages.length} หน้า</p>
      </section>

      <section className="crm-cms-panel">
        {pages.length === 0 ? (
          <EmptyState
            title="ยังไม่มีหน้าใน CMS"
            body="สร้างหน้าใหม่ด้วย slug ที่ยังไม่มีบนเว็บ"
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
                  <th scope="col">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => {
                  const menuName = page.menuLabel?.trim() || "—";
                  const metaTag = page.seoTitle?.trim() || page.title;
                  const description = page.metaDescription?.trim() || page.excerpt?.trim() || "—";
                  return (
                    <tr key={page.id}>
                      <td data-label="ชื่อเมนู">
                        <span className="crm-cms-menu-name">{menuName}</span>
                      </td>
                      <td data-label="ชื่อหน้า">
                        <Link href={`/crm/cms/pages/${page.id}`} className="crm-cms-name">
                          {page.title}
                        </Link>
                      </td>
                      <td data-label="Slug">
                        <code className="crm-cms-slug">{documentPath(page)}</code>
                      </td>
                      <td data-label="Meta Tag">
                        <span className="crm-cms-meta" title={metaTag}>
                          {truncate(metaTag, 80)}
                        </span>
                      </td>
                      <td data-label="Description">
                        <span className="crm-cms-desc" title={description}>
                          {truncate(description, 100)}
                        </span>
                      </td>
                      <td data-label="การดำเนินการ">
                        <CmsPageRowActions
                          pageId={page.id}
                          pageName={page.title}
                          editHref={`/crm/cms/pages/${page.id}`}
                          canDelete
                          returnTo="/crm/cms/pages"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
