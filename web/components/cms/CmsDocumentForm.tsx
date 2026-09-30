import { blocksToMarkdown, parseCmsBody } from "@/lib/cms/body";
import { createDocument, updateDocument } from "@/lib/cms/actions";
import type { CmsDocumentRow } from "@/lib/cms/types";
import { CMS_LOCALES, CMS_MENUS, CMS_STATUSES } from "@/lib/cms/types";

export function CmsDocumentForm({
  kind,
  document,
  error,
  saved,
}: {
  kind: "page" | "insight";
  document?: CmsDocumentRow | null;
  error?: string;
  saved?: boolean;
}) {
  const action = document ? updateDocument : createDocument;
  const body = document ? blocksToMarkdown(parseCmsBody(document.body)) : "";
  const scheduled =
    document?.scheduledAt instanceof Date
      ? document.scheduledAt.toISOString().slice(0, 16)
      : document?.scheduledAt
        ? String(document.scheduledAt).slice(0, 16)
        : "";

  return (
    <form action={action} className="crm-card mx-auto max-w-3xl">
      {document ? <input type="hidden" name="id" value={document.id} /> : null}
      <input type="hidden" name="kind" value={kind} />
      <h1 className="text-2xl font-extrabold text-[#3B3B3B]">
        {document ? `แก้ไข${kind === "insight" ? "บทความ" : "หน้า"}` : `สร้าง${kind === "insight" ? "บทความ" : "หน้า"}ใหม่`}
      </h1>
      <p className="mt-2 text-sm">
        ออกแบบเลย์เอาต์ยังอยู่ที่โค้ด ช่องนี้แก้เนื้อหา SEO รูป และเมนู หน้าเดิมของเว็บถูกล็อกไว้ สร้างได้เฉพาะ slug ใหม่
      </p>
      {saved ? <p className="mt-4 font-semibold text-[#063F3B]">บันทึกแล้ว</p> : null}
      {error === "invalid" ? <p className="mt-4 font-semibold text-[#063F3B]">กรอกชื่อและ slug เป็นตัวอักษรอังกฤษ ตัวเลข และ - ให้ครบ</p> : null}
      {error === "locked" ? <p className="mt-4 font-semibold text-[#063F3B]">เส้นทางนี้เป็นหน้าจากโค้ด เลือก slug อื่น</p> : null}
      {error === "exists" ? <p className="mt-4 font-semibold text-[#063F3B]">slug ภาษานี้มีอยู่แล้ว</p> : null}

      <label className="mt-5 block text-sm font-bold">
        ชื่อเรื่อง
        <input className="crm-field" name="title" required defaultValue={document?.title} />
      </label>
      <label className="mt-4 block text-sm font-bold">
        Slug
        <input className="crm-field" name="slug" required defaultValue={document?.slug} placeholder={kind === "insight" ? "hotel-example-article" : "new-page"} />
      </label>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <label className="text-sm font-bold">
          ภาษา
          <select className="crm-select" name="locale" defaultValue={document?.locale ?? "th"}>
            {CMS_LOCALES.map((locale) => (
              <option key={locale} value={locale}>
                {locale}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-bold">
          สถานะ
          <select className="crm-select" name="status" defaultValue={document?.status ?? "draft"}>
            {CMS_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status === "draft" ? "ฉบับร่าง" : status === "published" ? "เผยแพร่" : "ตั้งเวลา"}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-bold">
          ตั้งเวลาเผยแพร่
          <input className="crm-field" type="datetime-local" name="scheduledAt" defaultValue={scheduled} />
        </label>
      </div>
      <label className="mt-4 block text-sm font-bold">
        คำโปรย / Excerpt
        <textarea className="crm-area" name="excerpt" defaultValue={document?.excerpt} style={{ minHeight: "6rem" }} />
      </label>
      <label className="mt-4 block text-sm font-bold">
        เนื้อหา
        <textarea
          className="crm-area"
          name="body"
          defaultValue={body}
          placeholder={"## หัวข้อ\nย่อหน้าแรก\n\n- รายการ\n\n![คำอธิบายรูป](/media/cms/example.jpg)"}
        />
      </label>
      <p className="mt-2 text-sm">ใช้ Markdown สั้น ๆ: # หัวข้อใหญ่, ## หัวข้อ, - รายการ, ![alt](/media/...)</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-sm font-bold">
          รูปหลัก
          <input className="crm-field" name="featuredImage" defaultValue={document?.featuredImage} placeholder="/media/cms/..." />
        </label>
        <label className="text-sm font-bold">
          คำอธิบายรูป
          <input className="crm-field" name="imageAlt" defaultValue={document?.imageAlt} />
        </label>
      </div>
      {kind === "insight" ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="text-sm font-bold">
            หมวด
            <input className="crm-field" name="category" defaultValue={document?.category} />
          </label>
          <label className="text-sm font-bold">
            ผู้เขียน
            <input className="crm-field" name="author" defaultValue={document?.author || "The KPI Plus"} />
          </label>
        </div>
      ) : (
        <input type="hidden" name="template" value={document?.template ?? "general"} />
      )}
      <label className="mt-4 block text-sm font-bold">
        SEO title
        <input className="crm-field" name="seoTitle" defaultValue={document?.seoTitle} />
      </label>
      <label className="mt-4 block text-sm font-bold">
        Meta description
        <textarea className="crm-area" name="metaDescription" defaultValue={document?.metaDescription} style={{ minHeight: "5rem" }} />
      </label>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-sm font-bold">
          Canonical
          <input className="crm-field" name="canonical" defaultValue={document?.canonical} placeholder="เว้นว่างให้ระบบใส่ให้" />
        </label>
        <label className="text-sm font-bold">
          OG image
          <input className="crm-field" name="ogImage" defaultValue={document?.ogImage} />
        </label>
      </div>
      <label className="mt-4 flex items-center gap-3 text-sm font-bold">
        <input type="checkbox" name="noindex" value="1" defaultChecked={Boolean(document?.noindex)} className="h-4 w-4 accent-[#0B6660]" />
        ไม่ให้ Google index
      </label>
      <fieldset className="mt-5">
        <legend className="text-sm font-bold">เมนู</legend>
        <label className="mt-2 flex items-center gap-3 text-sm">
          <input type="checkbox" name="showInMenu" value="1" defaultChecked={Boolean(document?.showInMenu)} className="h-4 w-4 accent-[#0B6660]" />
          แสดงในเมนู
        </label>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="text-sm font-bold">
            ตำแหน่งเมนู
            <select className="crm-select" name="menu" defaultValue={document?.menu ?? "none"}>
              {CMS_MENUS.map((menu) => (
                <option key={menu} value={menu}>
                  {menu === "none" ? "ไม่ใส่เมนู" : menu === "header" ? "ส่วนหัว" : "ส่วนท้าย"}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-bold">
            ลำดับ
            <input className="crm-field" type="number" name="menuPosition" defaultValue={document?.menuPosition ?? 0} />
          </label>
        </div>
      </fieldset>
      <button className="kpi-button mt-6" type="submit">
        บันทึก
      </button>
    </form>
  );
}
