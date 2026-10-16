import Link from "next/link";
import { CmsTrashRowActions } from "@/components/crm/ui/CmsTrashRowActions";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { documentPath } from "@/lib/cms/body";
import { listTrashedDocuments } from "@/lib/cms/queries";

function formatTrashedAt(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function CmsTrashPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kind?: string; restored?: string; purged?: string; error?: string }>;
}) {
  const params = await searchParams;
  const kind = params.kind === "page" || params.kind === "insight" ? params.kind : undefined;
  const items = await listTrashedDocuments({ kind, q: params.q });

  return (
    <div className="crm-cms">
      <PageHeader
        eyebrow="Content Management"
        title="ถังขยะ"
        description="รายการหน้าเพจและบทความที่ลบแล้ว สามารถกู้คืนหรือลบถาวรได้จากที่นี่"
        actions={
          <div className="crm-cms-actions">
            <Link href="/crm/cms" className="crm-users-secondary">
              หน้าเพจทั้งหมด
            </Link>
            <Link href="/crm/cms/insights" className="crm-users-secondary">
              บทความ
            </Link>
          </div>
        }
      />

      {params.restored === "1" ? (
        <p className="crm-users-alert is-ok" role="status">
          กู้คืนแล้ว
        </p>
      ) : null}
      {params.purged === "1" ? (
        <p className="crm-users-alert is-ok" role="status">
          ลบถาวรแล้ว
        </p>
      ) : null}
      {params.error === "missing" ? (
        <p className="crm-users-alert is-warn" role="status">
          ไม่พบรายการในถังขยะ
        </p>
      ) : null}

      <section className="crm-cms-toolbar">
        <form className="crm-cms-filters" method="get">
          <label>
            ค้นหา
            <input className="crm-field" name="q" defaultValue={params.q} placeholder="ชื่อ หรือ slug" />
          </label>
          <label>
            ประเภท
            <select className="crm-select" name="kind" defaultValue={params.kind ?? ""}>
              <option value="">ทั้งหมด</option>
              <option value="page">หน้าเพจ</option>
              <option value="insight">บทความ</option>
            </select>
          </label>
          <div className="crm-cms-filters-actions">
            <button className="kpi-button" type="submit">
              กรอง
            </button>
            {params.q || params.kind ? (
              <Link href="/crm/cms/trash" className="crm-users-secondary">
                ล้างตัวกรอง
              </Link>
            ) : null}
          </div>
        </form>
        <p className="crm-cms-count">แสดง {items.length} รายการ</p>
      </section>

      <section className="crm-cms-panel">
        {items.length === 0 ? (
          <EmptyState
            title="ถังขยะว่าง"
            body="เมื่อลบหน้าเพจหรือบทความ รายการจะมาอยู่ที่นี่เพื่อกู้คืนได้"
            action={
              <Link href="/crm/cms" className="kpi-button">
                กลับไปหน้าเพจ
              </Link>
            }
          />
        ) : (
          <div className="crm-cms-table-wrap">
            <table className="crm-cms-table crm-cms-table--trash">
              <thead>
                <tr>
                  <th scope="col">ประเภท</th>
                  <th scope="col">ชื่อ</th>
                  <th scope="col">Slug</th>
                  <th scope="col">ลบเมื่อ</th>
                  <th scope="col">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const kindLabel = item.kind === "insight" ? "บทความ" : "หน้าเพจ";
                  const path = documentPath(item);
                  return (
                    <tr key={item.id}>
                      <td data-label="ประเภท">
                        <span className="crm-cms-trash-kind">{kindLabel}</span>
                      </td>
                      <td data-label="ชื่อ">
                        <span className="crm-cms-name is-static">{item.title}</span>
                      </td>
                      <td data-label="Slug">
                        <code className="crm-cms-slug">{path}</code>
                      </td>
                      <td data-label="ลบเมื่อ">{formatTrashedAt(item.trashedAt)}</td>
                      <td data-label="การดำเนินการ">
                        <CmsTrashRowActions
                          id={item.id}
                          title={item.title}
                          kind={item.kind === "insight" ? "insight" : "page"}
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
