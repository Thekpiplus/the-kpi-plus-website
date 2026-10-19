import Link from "next/link";
import { ConfirmDeleteButton } from "@/components/crm/ui/ConfirmDeleteButton";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { createRedirect, deleteRedirect, toggleRedirect } from "@/lib/cms/actions";
import { listRedirects } from "@/lib/cms/queries";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value instanceof Date ? value : new Date(value));
}

export default async function CmsRedirectsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const redirects = await listRedirects();
  const activeCount = redirects.filter((item) => item.active).length;
  const permanentCount = redirects.filter((item) => item.statusCode === 301).length;

  return (
    <div className="crm-cms crm-cms-redirects">
      <PageHeader
        eyebrow="Content Management"
        title="Redirect"
        description="ย้ายเส้นทางเก่าไปหน้าใหม่โดยไม่ต้องแก้โค้ด — รองรับ 301 และ 302"
        actions={
          <div className="crm-cms-actions">
            <Link href="/crm/cms" className="crm-users-secondary">
              หน้าเพจทั้งหมด
            </Link>
          </div>
        }
      />

      {params.saved === "1" ? (
        <p className="crm-users-alert is-ok" role="status">
          บันทึก redirect แล้ว
        </p>
      ) : null}
      {params.error === "invalid" ? (
        <p className="crm-users-alert is-warn" role="status">
          เส้นทางต้นทางต้องขึ้นต้นด้วย /
        </p>
      ) : null}
      {params.error === "exists" ? (
        <p className="crm-users-alert is-warn" role="status">
          เส้นทางนี้มี redirect อยู่แล้ว
        </p>
      ) : null}

      <div className="crm-cms-redirect-layout">
        <aside className="crm-cms-redirect-create">
          <div className="crm-cms-redirect-create-head">
            <p className="crm-cms-redirect-kicker">สร้างใหม่</p>
            <h2>เพิ่ม Redirect</h2>
            <p>กำหนดเส้นทางเก่า → เส้นทางใหม่ และรหัสสถานะ</p>
          </div>

          <form action={createRedirect} className="crm-cms-redirect-form">
            <label className="crm-cms-field">
              <span>จาก (From)</span>
              <input className="crm-field" name="fromPath" placeholder="/old-url" required />
              <small>ต้องขึ้นต้นด้วย / เช่น /old-page</small>
            </label>
            <label className="crm-cms-field">
              <span>ไปที่ (To)</span>
              <input className="crm-field" name="toPath" placeholder="/new-url" required />
              <small>ปลายทางภายในไซต์ หรือ URL เต็ม</small>
            </label>
            <label className="crm-cms-field">
              <span>รหัสสถานะ</span>
              <select className="crm-select" name="statusCode" defaultValue="301">
                <option value="301">301 — ย้ายถาวร</option>
                <option value="302">302 — ย้ายชั่วคราว</option>
              </select>
            </label>
            <button className="kpi-button crm-cms-redirect-submit" type="submit">
              เพิ่ม redirect
            </button>
          </form>
        </aside>

        <section className="crm-cms-redirect-list">
          <div className="crm-cms-redirect-list-head">
            <div>
              <p className="crm-cms-redirect-kicker">รายการ</p>
              <h2>Redirect ทั้งหมด</h2>
            </div>
            <div className="crm-cms-redirect-stats" aria-label="สรุป redirect">
              <span>
                <strong>{redirects.length}</strong> รายการ
              </span>
              <span>
                <strong>{activeCount}</strong> เปิดใช้
              </span>
              <span>
                <strong>{permanentCount}</strong> แบบ 301
              </span>
            </div>
          </div>

          {redirects.length === 0 ? (
            <EmptyState
              title="ยังไม่มี redirect"
              body="เพิ่มเส้นทางจากแผงด้านซ้าย เมื่อมี URL เก่าที่ต้องส่งต่อไปหน้าใหม่"
            />
          ) : (
            <ul className="crm-cms-redirect-cards">
              {redirects.map((item) => (
                <li key={item.id} className={`crm-cms-redirect-card${item.active ? "" : " is-off"}`}>
                  <div className="crm-cms-redirect-card-main">
                    <div className="crm-cms-redirect-badges">
                      <span className={`crm-cms-redirect-code is-${item.statusCode}`}>{item.statusCode}</span>
                      <span className={`crm-cms-redirect-state${item.active ? " is-on" : ""}`}>
                        {item.active ? "เปิดใช้" : "ปิดอยู่"}
                      </span>
                    </div>

                    <div className="crm-cms-redirect-paths" aria-label={`${item.fromPath} ไปยัง ${item.toPath}`}>
                      <p className="crm-cms-redirect-from" title={item.fromPath}>
                        {item.fromPath}
                      </p>
                      <span className="crm-cms-redirect-arrow" aria-hidden="true">
                        →
                      </span>
                      <p className="crm-cms-redirect-to" title={item.toPath}>
                        {item.toPath}
                      </p>
                    </div>

                    <p className="crm-cms-redirect-meta">สร้างเมื่อ {formatDate(item.createdAt)}</p>
                  </div>

                  <div className="crm-cms-redirect-card-actions">
                    <form action={toggleRedirect}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="active" value={item.active ? "0" : "1"} />
                      <button className="crm-users-secondary" type="submit">
                        {item.active ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                      </button>
                    </form>
                    <ConfirmDeleteButton
                      action={deleteRedirect}
                      fields={{ id: item.id }}
                      itemName={`${item.fromPath} → ${item.toPath}`}
                      eyebrow="Redirect"
                      title="ลบ Redirect"
                      message={`ยืนยันลบ redirect “${item.fromPath} → ${item.toPath}”?`}
                      buttonLabel="ลบ"
                      confirmLabel="ลบ"
                      className="crm-users-secondary crm-cms-redirect-delete"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
