import type { ReactNode } from "react";
import { MarkdownBodyEditor } from "@/components/cms/MarkdownBodyEditor";
import { CmsEditorSaveBar, CmsFormDirtyTracker } from "@/components/cms/CmsEditorSaveBar";
import { PageFaqPanel } from "@/components/cms/PageFaqPanel";
import { blocksToMarkdown, documentPath, parseCmsBody } from "@/lib/cms/body";
import { createDocument, updateDocument } from "@/lib/cms/actions";
import type { CmsDocumentRow } from "@/lib/cms/types";
import { CMS_LOCALES, CMS_MENUS, CMS_STATUSES } from "@/lib/cms/types";
import type { FaqItem } from "@/lib/faqs";
import { insightSlotForSlug, parseInsightImageMeta } from "@/lib/insights-media";

const LOCALE_LABEL: Record<(typeof CMS_LOCALES)[number], string> = {
  th: "ไทย",
  en: "English",
  ru: "Русский",
  zh: "繁體中文",
};

const FORM_ID = "crm-cms-document-form";

export function CmsDocumentForm({
  kind,
  document,
  error,
  saved,
  faq,
  previewHref,
  publicHref,
  dangerZone,
}: {
  kind: "page" | "insight";
  document?: CmsDocumentRow | null;
  error?: string;
  saved?: boolean;
  faq?: { route: string; items: FaqItem[]; source: "cms" | "code" | "empty" } | null;
  previewHref?: string;
  publicHref?: string;
  dangerZone?: ReactNode;
}) {
  const action = document ? updateDocument : createDocument;
  const isInsight = kind === "insight";
  const body = document ? blocksToMarkdown(parseCmsBody(document.body)) : "";
  const scheduled =
    document?.scheduledAt instanceof Date
      ? document.scheduledAt.toISOString().slice(0, 16)
      : document?.scheduledAt
        ? String(document.scheduledAt).slice(0, 16)
        : "";
  const imageMeta = parseInsightImageMeta(document?.tags);
  const imageSlot = isInsight ? insightSlotForSlug(document?.slug ?? "") : null;
  const pageRoute =
    faq?.route ||
    (document && !isInsight
      ? documentPath({ kind: document.kind, slug: document.slug, locale: document.locale })
      : "");
  const barStatus = saved ? "บันทึกแล้ว" : error ? "บันทึกไม่สำเร็จ — ตรวจข้อความด้านล่าง" : undefined;

  return (
    <form id={FORM_ID} action={action} className="crm-cms-editor crm-cms-editor--split">
      <CmsFormDirtyTracker formId={FORM_ID} />
      {document ? <input type="hidden" name="id" value={document.id} /> : null}
      <input type="hidden" name="kind" value={kind} />
      {isInsight ? null : <input type="hidden" name="template" value={document?.template ?? "general"} />}

      <CmsEditorSaveBar
        saveLabel={isInsight ? "บันทึกบทความ" : "บันทึกหน้าเพจ"}
        previewHref={previewHref}
        publicHref={publicHref}
        statusLabel={barStatus}
      />

      <div className="crm-cms-editor-main">
        <section className="crm-cms-editor-panel">
          <header className="crm-cms-editor-panel-head">
            <div>
              <p className="crm-cms-editor-kicker">{isInsight ? "บทความ" : "หน้าเว็บ"}</p>
              <h2>เนื้อหา{isInsight ? "บทความ" : ""}</h2>
            </div>
          </header>

          {isInsight ? null : (
            <p className="crm-cms-editor-note">
              หน้าที่มีเลย์เอาต์ออกแบบในโค้ด (เช่น about / approach / case-studies) คงดีไซน์เดิม — จาก CMS
              แก้ได้เฉพาะ SEO รูป เมนู และเปิด/ปิดออนไลน์ เนื้อหา markdown ด้านล่างใช้กับหน้าที่สร้างใหม่ใน CMS
              และบทความเท่านั้น
            </p>
          )}

          {saved ? (
            <p className="crm-users-alert is-ok" role="status">
              บันทึกแล้ว
            </p>
          ) : null}
          {error === "invalid" ? (
            <p className="crm-users-alert is-warn" role="alert">
              กรอกชื่อและ slug เป็นตัวอักษรอังกฤษ ตัวเลข และ - ให้ครบ
            </p>
          ) : null}
          {error === "locked" ? (
            <p className="crm-users-alert is-warn" role="alert">
              {isInsight ? "เส้นทางนี้ใช้ไม่ได้ เลือก slug อื่น" : "เส้นทางนี้เป็นหน้าจากโค้ด เลือก slug อื่น"}
            </p>
          ) : null}
          {error === "exists" ? (
            <p className="crm-users-alert is-warn" role="alert">
              slug ภาษานี้มีอยู่แล้ว
            </p>
          ) : null}

          <label className="crm-cms-field">
            <span>ชื่อเรื่อง</span>
            <input
              className="crm-field"
              name="title"
              required
              defaultValue={document?.title}
              placeholder={isInsight ? "หัวข้อบทความ" : "ชื่อหน้าเพจ"}
            />
          </label>
          <label className="crm-cms-field">
            <span>Slug</span>
            <input
              className="crm-field"
              name="slug"
              required={isInsight || document?.slug !== ""}
              defaultValue={document?.slug}
              placeholder={isInsight ? "hotel-example-article" : "new-page"}
            />
            <small>
              {isInsight
                ? "ใช้ในที่อยู่ /insights/slug"
                : document?.slug === ""
                  ? "หน้าแรกใช้ที่อยู่ / — เว้น slug ว่างไว้"
                  : "ใช้ในที่อยู่ของหน้า เช่น /new-page"}
            </small>
          </label>
          <label className="crm-cms-field">
            <span>{isInsight ? "คำโปรย" : "คำโปรย / Excerpt"}</span>
            <textarea
              className="crm-area"
              name="excerpt"
              defaultValue={document?.excerpt}
              rows={3}
              placeholder={isInsight ? "สรุปสั้น ๆ ที่แสดงในการ์ดและคำอธิบาย" : "ข้อความสั้น ๆ ที่ใช้เป็นคำอธิบายหน้า"}
            />
          </label>
          <label className="crm-cms-field">
            <span>เนื้อหา</span>
            <MarkdownBodyEditor
              name="body"
              defaultValue={body}
              placeholder={"## หัวข้อ\nย่อหน้าแรก\n\n- รายการ\n\n![คำอธิบายรูป](/media/cms/example.jpg)"}
            />
          </label>
          {!isInsight && document && pageRoute ? (
            <PageFaqPanel
              route={pageRoute}
              initialItems={faq?.items ?? []}
              source={faq?.source ?? "empty"}
            />
          ) : null}
        </section>
      </div>

      <aside className="crm-cms-editor-side">
        <section className="crm-cms-editor-panel">
          <h3>การเผยแพร่</h3>
          <label className="crm-cms-field">
            <span>ภาษา</span>
            <select className="crm-select" name="locale" defaultValue={document?.locale ?? "th"}>
              {CMS_LOCALES.map((locale) => (
                <option key={locale} value={locale}>
                  {LOCALE_LABEL[locale]}
                </option>
              ))}
            </select>
          </label>
          <label className="crm-cms-field">
            <span>สถานะ</span>
            <select className="crm-select" name="status" defaultValue={document?.status ?? "draft"}>
              {CMS_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status === "draft" ? "ฉบับร่าง" : status === "published" ? "เผยแพร่" : "ตั้งเวลา"}
                </option>
              ))}
            </select>
          </label>
          <label className="crm-cms-field">
            <span>ตั้งเวลาเผยแพร่</span>
            <input className="crm-field" type="datetime-local" name="scheduledAt" defaultValue={scheduled} />
          </label>
          {isInsight ? (
            <>
              <label className="crm-cms-field">
                <span>หมวด</span>
                <input
                  className="crm-field"
                  name="category"
                  defaultValue={document?.category}
                  placeholder="เช่น การตลาดโรงแรม"
                />
              </label>
              <label className="crm-cms-field">
                <span>ผู้เขียน</span>
                <input className="crm-field" name="author" defaultValue={document?.author || "The KPI Plus"} />
              </label>
            </>
          ) : null}
        </section>

        <section className="crm-cms-editor-panel">
          <h3>รูปภาพหลัก</h3>
          {isInsight ? (
            <p className="crm-cms-editor-note">
              เว้นที่อยู่รูปว่างไว้ถ้าไฟล์ยังไม่มีในเครื่อง ระบบจะแสดงกรอบตัวอย่างแทน
              {imageSlot
                ? ` · ช่องที่จองไว้ ${imageSlot.sourceWidth}×${imageSlot.sourceHeight}`
                : ""}
            </p>
          ) : null}
          <label className="crm-cms-field">
            <span>ที่อยู่รูป</span>
            <input
              className="crm-field"
              name="featuredImage"
              defaultValue={document?.featuredImage}
              placeholder={imageSlot?.reservedSrc ?? "/media/cms/..."}
            />
          </label>
          <label className="crm-cms-field">
            <span>คำอธิบายรูป (alt)</span>
            <input className="crm-field" name="imageAlt" defaultValue={document?.imageAlt} />
          </label>
          {isInsight ? (
            <details className="crm-cms-editor-inline-details">
              <summary>ตัวเลือกภาพเพิ่มเติม</summary>
              <label className="crm-cms-field">
                <span>สถานะภาพ</span>
                <select className="crm-select" name="imageStatus" defaultValue={imageMeta.imageStatus}>
                  <option value="placeholder">Placeholder — ตัวอย่างภาพประกอบ</option>
                  <option value="sample">Sample — ตัวอย่างภาพประกอบ</option>
                  <option value="approved">Approved — ภาพที่อนุมัติแล้ว</option>
                  <option value="real">Real — ภาพงานจริง</option>
                </select>
              </label>
              <label className="crm-cms-field">
                <span>การจัดภาพ</span>
                <select className="crm-select" name="imageFit" defaultValue={imageMeta.imageFit}>
                  <option value="cover">Cover — ภาพถ่าย</option>
                  <option value="contain">Contain — ภาพรายงานหรือสกรีนช็อต</option>
                </select>
              </label>
            </details>
          ) : null}
        </section>

        <details className="crm-cms-editor-panel crm-cms-editor-details">
          <summary>SEO</summary>
          <label className="crm-cms-field">
            <span>SEO title</span>
            <input className="crm-field" name="seoTitle" defaultValue={document?.seoTitle} />
          </label>
          <label className="crm-cms-field">
            <span>Meta description</span>
            <textarea className="crm-area" name="metaDescription" defaultValue={document?.metaDescription} rows={3} />
          </label>
          <label className="crm-cms-field">
            <span>Canonical</span>
            <input className="crm-field" name="canonical" defaultValue={document?.canonical} placeholder="เว้นว่างให้ระบบใส่ให้" />
          </label>
          <label className="crm-cms-field">
            <span>OG image</span>
            <input className="crm-field" name="ogImage" defaultValue={document?.ogImage} />
          </label>
          <label className="crm-cms-check">
            <input type="checkbox" name="noindex" value="1" defaultChecked={Boolean(document?.noindex)} />
            ไม่ให้ Google index
          </label>
        </details>

        {!isInsight ? (
          <details className="crm-cms-editor-panel crm-cms-editor-details">
            <summary>เมนู</summary>
            <label className="crm-cms-field">
              <span>ชื่อเมนู</span>
              <input
                className="crm-field"
                name="menuLabel"
                defaultValue={document?.menuLabel}
                placeholder="ชื่อสั้นที่แสดงในเมนูเว็บ"
              />
              <small>เว้นว่างแล้วระบบจะใช้ชื่อเรื่องแทน</small>
            </label>
            <label className="crm-cms-check">
              <input type="checkbox" name="showInMenu" value="1" defaultChecked={Boolean(document?.showInMenu)} />
              แสดงในเมนู
            </label>
            <label className="crm-cms-field">
              <span>ตำแหน่งเมนู</span>
              <select className="crm-select" name="menu" defaultValue={document?.menu ?? "none"}>
                {CMS_MENUS.map((menu) => (
                  <option key={menu} value={menu}>
                    {menu === "none" ? "ไม่ใส่เมนู" : menu === "header" ? "ส่วนหัว" : "ส่วนท้าย"}
                  </option>
                ))}
              </select>
            </label>
            <label className="crm-cms-field">
              <span>ลำดับ</span>
              <input className="crm-field" type="number" name="menuPosition" defaultValue={document?.menuPosition ?? 0} />
            </label>
          </details>
        ) : (
          <>
            <input type="hidden" name="menuLabel" value={document?.menuLabel ?? ""} />
            <input type="hidden" name="menu" value={document?.menu ?? "none"} />
            <input type="hidden" name="menuPosition" value={String(document?.menuPosition ?? 0)} />
            {document?.showInMenu ? <input type="hidden" name="showInMenu" value="1" /> : null}
          </>
        )}

        {dangerZone ? <div className="crm-cms-editor-danger crm-cms-editor-danger--side">{dangerZone}</div> : null}
      </aside>
    </form>
  );
}
