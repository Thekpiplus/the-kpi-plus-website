import Link from "next/link";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { saveGlobals } from "@/lib/cms/actions";
import { getSetting } from "@/lib/cms/queries";
import { COMPANY } from "@/lib/company";
import { parseSiteGlobals } from "@/lib/company-public";
import { SITE } from "@/lib/seo";

export default async function CmsGlobalsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const row = await getSetting("site");
  const value = parseSiteGlobals(row?.value);
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

            <div className="crm-cms-globals-panel-head">
              <div>
                <p className="crm-cms-globals-kicker">ติดต่อ</p>
                <h2>ข้อมูลติดต่อที่ใช้ทั้งไซต์</h2>
                <p>ค่าว่างจะใช้ค่าเริ่มต้นจากโค้ด ช่องที่ไม่มีค่าเริ่มต้น เช่น เวลาทำการและรูปสำนักงาน จะถูกซ่อนบนหน้าเว็บ</p>
              </div>
            </div>

            <label className="crm-cms-field">
              <span>อีเมล</span>
              <input className="crm-field" name="email" defaultValue={value.email} placeholder={COMPANY.email} />
            </label>
            <label className="crm-cms-field">
              <span>โทรศัพท์ 1</span>
              <input className="crm-field" name="phone1" defaultValue={value.phone1} placeholder={COMPANY.phones[0]?.display} />
            </label>
            <label className="crm-cms-field">
              <span>โทรศัพท์ 2</span>
              <input className="crm-field" name="phone2" defaultValue={value.phone2} placeholder={COMPANY.phones[1]?.display} />
            </label>
            <label className="crm-cms-field">
              <span>WhatsApp URL</span>
              <input className="crm-field" name="whatsappHref" defaultValue={value.whatsappHref} placeholder={COMPANY.whatsappHref} />
            </label>
            <label className="crm-cms-field">
              <span>LINE URL</span>
              <input className="crm-field" name="lineHref" defaultValue={value.lineHref} placeholder={COMPANY.lineHref} />
            </label>
            <label className="crm-cms-field">
              <span>ที่อยู่ (ไทย)</span>
              <textarea className="crm-area" name="addressTh" rows={3} defaultValue={value.addressTh} placeholder={COMPANY.addressTh} />
            </label>
            <label className="crm-cms-field">
              <span>ที่อยู่ (อังกฤษ)</span>
              <textarea className="crm-area" name="addressEn" rows={3} defaultValue={value.addressEn} placeholder={COMPANY.addressEn} />
            </label>
            <label className="crm-cms-field">
              <span>Google Maps (ลิงก์เปิด)</span>
              <input className="crm-field" name="mapsShare" defaultValue={value.mapsShare} placeholder={COMPANY.mapsShare} />
            </label>
            <label className="crm-cms-field">
              <span>Google Maps (embed URL)</span>
              <textarea className="crm-area" name="mapsEmbed" rows={3} defaultValue={value.mapsEmbed} placeholder={COMPANY.mapsEmbed} />
            </label>
            <label className="crm-cms-field">
              <span>เวลาทำการ (ไทย)</span>
              <input className="crm-field" name="hoursTh" defaultValue={value.hoursTh} placeholder="เว้นว่างไว้ถ้ายังไม่มีข้อมูลที่ยืนยัน" />
            </label>
            <label className="crm-cms-field">
              <span>เวลาทำการ (อังกฤษ)</span>
              <input className="crm-field" name="hoursEn" defaultValue={value.hoursEn} placeholder="Leave empty until hours are verified" />
            </label>
            <label className="crm-cms-field">
              <span>รูปสำนักงาน</span>
              <input className="crm-field" name="officePhoto" defaultValue={value.officePhoto} placeholder="/media/... เว้นว่างถ้ายังไม่มีรูปจริง" />
            </label>
            <label className="crm-cms-field">
              <span>Facebook</span>
              <input className="crm-field" name="facebook" defaultValue={value.facebook} placeholder={COMPANY.social.facebook} />
            </label>
            <label className="crm-cms-field">
              <span>Instagram</span>
              <input className="crm-field" name="instagram" defaultValue={value.instagram} placeholder={COMPANY.social.instagram} />
            </label>
            <label className="crm-cms-field">
              <span>LinkedIn</span>
              <input className="crm-field" name="linkedin" defaultValue={value.linkedin} placeholder={COMPANY.social.linkedin} />
            </label>
            <label className="crm-cms-field">
              <span>TikTok</span>
              <input className="crm-field" name="tiktok" defaultValue={value.tiktok} placeholder={COMPANY.social.tiktok} />
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
              ฟอร์มบนหน้าโซลูชันยังอยู่ในโค้ด และเครื่องคิดเลขคำนวณในเบราว์เซอร์ ไม่มี backend ปลอม ข้อมูลติดต่อด้านซ้ายใช้ร่วมกันทั้ง Header/Footer และหน้า Contact
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
