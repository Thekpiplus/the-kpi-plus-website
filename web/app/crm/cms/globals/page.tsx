import Link from "next/link";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { saveGlobals } from "@/lib/cms/actions";
import { getSetting } from "@/lib/cms/queries";
import { SITE } from "@/lib/seo";

export default async function CmsGlobalsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const row = await getSetting("site");
  const value = row
    ? (JSON.parse(row.value) as { defaultOg?: string; siteLine?: string; canonicalHost?: string })
    : {};
  const updatedLabel = row?.updatedAt
    ? new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(
        row.updatedAt instanceof Date ? row.updatedAt : new Date(row.updatedAt),
      )
    : null;

  return (
    <div className="crm-cms crm-cms-globals">
      <PageHeader
        eyebrow="Content Management"
        title="ตั้งค่าเว็บ"
        description="ค่าทั้งไซต์ที่ใช้ร่วมกัน — ฟอร์มติดต่อและเครื่องคิดเลขยังทำงานในโค้ดตามเดิม"
        actions={
          <div className="crm-cms-actions">
            <Link href="/crm/cms" className="crm-users-secondary">
              หน้าเพจทั้งหมด
            </Link>
          </div>
        }
      />

      {saved === "1" ? (
        <p className="crm-users-alert is-ok" role="status">
          บันทึกการตั้งค่าแล้ว
        </p>
      ) : null}

      <div className="crm-cms-globals-layout">
        <section className="crm-cms-globals-main">
          <div className="crm-cms-globals-panel-head">
            <div>
              <p className="crm-cms-globals-kicker">ทั่วไป</p>
              <h2>ข้อมูลไซต์</h2>
              <p>โดเมน canonical รูปแชร์เริ่มต้น และข้อความสั้นของแบรนด์</p>
            </div>
            {updatedLabel ? <p className="crm-cms-globals-updated">อัปเดตล่าสุด {updatedLabel}</p> : null}
          </div>

          <form action={saveGlobals} className="crm-cms-globals-form">
            <label className="crm-cms-field">
              <span>โดเมน canonical</span>
              <input
                className="crm-field"
                name="canonicalHost"
                defaultValue={value.canonicalHost || SITE}
                placeholder="https://thekpiplus.com"
              />
              <small>ใช้เป็นฐานของ canonical / Open Graph เมื่อหน้าไม่ได้กำหนดเอง</small>
            </label>

            <label className="crm-cms-field">
              <span>รูป OG เริ่มต้น</span>
              <input
                className="crm-field"
                name="defaultOg"
                defaultValue={value.defaultOg}
                placeholder="/media/..."
              />
              <small>พาธรูปจากคลังสื่อ เช่น /media/cms/share.jpg</small>
            </label>

            <label className="crm-cms-field">
              <span>ข้อความสั้นของบริษัท</span>
              <textarea
                className="crm-area crm-cms-globals-site-line"
                name="siteLine"
                defaultValue={value.siteLine}
                rows={5}
                placeholder="สั้น ๆ ใช้อธิบายแบรนด์หรือแท็กไลน์ทั้งไซต์"
              />
            </label>

            <div className="crm-cms-globals-form-actions">
              <button className="kpi-button" type="submit">
                บันทึกการตั้งค่า
              </button>
              <Link href="/crm/cms/media" className="crm-users-secondary">
                เปิดคลังสื่อ
              </Link>
            </div>
          </form>
        </section>

        <aside className="crm-cms-globals-side">
          <section className="crm-cms-globals-card">
            <p className="crm-cms-globals-kicker">ภาพรวม</p>
            <h2>สิ่งที่ตั้งค่านี้ควบคุม</h2>
            <ul className="crm-cms-globals-points">
              <li>
                <strong>Canonical host</strong>
                <span>ฐาน URL สำหรับ SEO ทั้งไซต์</span>
              </li>
              <li>
                <strong>Default OG</strong>
                <span>รูปแชร์เมื่อหน้าไม่มี og:image ของตัวเอง</span>
              </li>
              <li>
                <strong>Site line</strong>
                <span>ข้อความสั้นของบริษัทสำหรับใช้ร่วมกัน</span>
              </li>
            </ul>
          </section>

          <section className="crm-cms-globals-card">
            <p className="crm-cms-globals-kicker">ยังอยู่ในโค้ด</p>
            <h2>ฟอร์มและเครื่องมือ</h2>
            <p className="crm-cms-globals-card-body">
              ฟอร์มบนหน้าโซลูชันและหน้าติดต่อยังอยู่ในโค้ด — เครื่องคิดเลขคำนวณในเบราว์เซอร์ ไม่มี backend ปลอม
            </p>
            <div className="crm-cms-globals-links">
              <Link href="/crm/cms/pages" className="crm-users-secondary">
                หน้าจาก CMS
              </Link>
              <Link href="/crm/cms/redirects" className="crm-users-secondary">
                Redirect
              </Link>
            </div>
          </section>

          <section className="crm-cms-globals-card is-soft">
            <p className="crm-cms-globals-kicker">ทางลัด</p>
            <h2>จัดการเนื้อหา</h2>
            <div className="crm-cms-globals-links is-stack">
              <Link href="/crm/cms">หน้าเพจทั้งหมด</Link>
              <Link href="/crm/cms/insights">บทความ</Link>
              <Link href="/crm/cms/media">สื่อ/ไฟล์รูปภาพ</Link>
              <Link href="/crm/cms/trash">ถังขยะ</Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
