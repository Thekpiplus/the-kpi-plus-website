import Link from "next/link";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { updateCmsMenuItem } from "@/lib/cms/actions";
import { documentPath } from "@/lib/cms/body";
import { listMenuDocuments } from "@/lib/cms/queries";
import { CMS_MENUS } from "@/lib/cms/types";

const MENU_LABEL: Record<(typeof CMS_MENUS)[number], string> = {
  none: "ไม่แสดงในเมนู",
  header: "Header",
  footer: "Footer",
};

export default async function CmsMenusPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string; id?: string; q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim().toLowerCase() ?? "";
  const docs = await listMenuDocuments();
  const rows = docs.filter((doc) => {
    if (!q) return true;
    const path = documentPath(doc).toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      path.includes(q) ||
      doc.menuLabel.toLowerCase().includes(q) ||
      doc.menu.toLowerCase().includes(q)
    );
  });

  return (
    <div className="crm-cms">
      <header className="crm-cms-hero crm-cms-hero--compact">
        <div className="crm-cms-hero-copy">
          <p className="crm-cms-hero-kicker">Content Management</p>
          <h1 className="crm-cms-hero-title">เมนูเว็บไซต์</h1>
          <p className="crm-cms-hero-desc">
            กำหนดว่าหน้าใดขึ้น Header/Footer ชื่อที่แสดง และลำดับ — บันทึกลงฐานข้อมูลจริงและรีเฟรชเมนูสาธารณะ
          </p>
        </div>
      </header>

      {params.saved === "1" ? (
        <p className="crm-users-alert is-ok" role="status">
          บันทึกเมนูแล้ว
        </p>
      ) : null}
      {params.error === "menu" ? (
        <p className="crm-users-alert is-warn" role="alert">
          ถ้าเปิดแสดงในเมนู ต้องเลือก Header หรือ Footer
        </p>
      ) : null}
      {params.error === "missing" ? (
        <p className="crm-users-alert is-warn" role="alert">
          ไม่พบหน้ารายการนี้
        </p>
      ) : null}

      <section className="crm-cms-toolbar">
        <form className="crm-cms-search" method="get">
          <label className="crm-cms-search-field">
            <span className="sr-only">ค้นหาเมนู</span>
            <input name="q" defaultValue={params.q} placeholder="ค้นหาชื่อหน้า หรือ URL" />
          </label>
          <button className="kpi-button" type="submit">
            ค้นหา
          </button>
          {q ? (
            <Link href="/crm/cms/menus" className="crm-users-secondary">
              ล้าง
            </Link>
          ) : null}
        </form>
        <p className="crm-cms-count">แสดง {rows.length} หน้า</p>
      </section>

      <section className="crm-cms-panel">
        <PageHeader
          eyebrow="Navigation"
          title="รายการเมนูจากหน้า CMS"
          description="หน้าจากโค้ดที่ยังไม่สร้างใน CMS จะไม่ขึ้นที่นี่ — เปิดแก้ไขหน้าแล้วบันทึกก่อน แล้วค่อยตั้งค่าเมนู"
        />
        {rows.length === 0 ? (
          <p className="crm-cms-empty-note">ยังไม่มีหน้าใน CMS สำหรับตั้งค่าเมนู</p>
        ) : (
          <div className="crm-cms-menu-list">
            {rows.map((doc) => {
              const path = documentPath(doc);
              const highlight = params.id === doc.id;
              return (
                <form
                  key={doc.id}
                  action={updateCmsMenuItem}
                  className={`crm-cms-menu-card${highlight ? " is-saved" : ""}`}
                >
                  <input type="hidden" name="id" value={doc.id} />
                  <div className="crm-cms-menu-card-head">
                    <div>
                      <Link href={`/crm/cms/pages/${doc.id}`} className="crm-cms-name">
                        {doc.title}
                      </Link>
                      <code className="crm-cms-slug">{path}</code>
                    </div>
                    <label className="crm-cms-menu-toggle">
                      <input type="checkbox" name="showInMenu" value="1" defaultChecked={doc.showInMenu} />
                      <span>แสดงในเมนู</span>
                    </label>
                  </div>
                  <div className="crm-cms-menu-grid">
                    <label className="crm-cms-field">
                      <span>ตำแหน่ง</span>
                      <select className="crm-select" name="menu" defaultValue={doc.menu || "none"}>
                        {CMS_MENUS.map((menu) => (
                          <option key={menu} value={menu}>
                            {MENU_LABEL[menu]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="crm-cms-field">
                      <span>ชื่อในเมนู</span>
                      <input
                        className="crm-field"
                        name="menuLabel"
                        defaultValue={doc.menuLabel}
                        placeholder={doc.title}
                      />
                    </label>
                    <label className="crm-cms-field">
                      <span>ลำดับ</span>
                      <input
                        className="crm-field"
                        type="number"
                        name="menuPosition"
                        defaultValue={doc.menuPosition ?? 0}
                      />
                    </label>
                    <label className="crm-cms-field">
                      <span>เมนูแม่ (ถ้ามี)</span>
                      <input className="crm-field" name="menuParent" defaultValue={doc.menuParent} placeholder="slug" />
                    </label>
                  </div>
                  <div className="crm-cms-menu-card-actions">
                    <button className="kpi-button" type="submit">
                      บันทึกเมนู
                    </button>
                    <Link href={`/crm/cms/pages/${doc.id}`} className="crm-users-secondary">
                      เปิดหน้าแก้ไข
                    </Link>
                  </div>
                </form>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
