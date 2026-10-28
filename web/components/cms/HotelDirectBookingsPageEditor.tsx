"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  DIRECT_BOOKING_CMS_AUDIT_STATUSES,
  DIRECT_BOOKING_CMS_FRICTION_TONES,
  DIRECT_BOOKING_CMS_FRICTION_TRACKING,
  DIRECT_BOOKING_CMS_KPI_STATUSES,
  DIRECT_BOOKING_CMS_SOURCE_STATUSES,
  DIRECT_BOOKING_CMS_TRACKING_STATUSES,
  directBookingCmsErrorMessage,
  directBookingCmsNotice,
  newDirectBookingItemId,
  type CmsDirectBookingKpi,
  type CmsDirectBookingPage,
  type CmsDirectBookingRelatedCard,
  type CmsDirectBookingVisual,
  type DirectBookingCmsIntent,
  type DirectBookingCmsSaveResult,
  type DirectBookingEditorState,
} from "@/lib/cms/hotel-direct-bookings-page";
import type { DirectBookingKpiStatus, DirectBookingTrackingStatus, DirectBookingVisualStatus } from "@/lib/direct-bookings";

const VISUAL_STATUS_OPTIONS: Array<{ value: DirectBookingVisualStatus; label: string }> = [
  { value: "replace", label: "Replace" },
  { value: "sample", label: "Sample" },
  { value: "approved", label: "Approved" },
];

const LOCALE_OPTIONS = [
  { id: "th", label: "ไทย" },
  { id: "en", label: "English" },
  { id: "ru", label: "Русский" },
  { id: "zh", label: "繁體中文" },
] as const;

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "confidence", label: "Booking Confidence" },
  { id: "friction", label: "Friction" },
  { id: "framework", label: "Service Framework" },
  { id: "audit", label: "Friction Audit" },
  { id: "rebuild", label: "Improve vs Rebuild" },
  { id: "workflow", label: "Workflow" },
  { id: "kpis", label: "KPI" },
  { id: "related", label: "Related" },
  { id: "form", label: "Contact" },
  { id: "faq", label: "FAQ" },
  { id: "seo", label: "SEO" },
  { id: "publish", label: "Publish" },
] as const;

type Tab = (typeof TABS)[number]["id"];
type VisualSlot =
  | "hero"
  | "confidence"
  | "friction"
  | "framework"
  | "audit"
  | "rebuild"
  | "workflow"
  | "measure"
  | "related"
  | "form"
  | "social";

const VISUAL_FILE_NAMES: Record<VisualSlot, string> = {
  hero: "heroImageFile",
  confidence: "confidenceImageFile",
  friction: "frictionImageFile",
  framework: "frameworkImageFile",
  audit: "auditImageFile",
  rebuild: "rebuildImageFile",
  workflow: "workflowImageFile",
  measure: "measureImageFile",
  related: "relatedImageFile",
  form: "formImageFile",
  social: "ogImageFile",
};

const CLEAR_FIELD_NAMES: Record<VisualSlot, string> = {
  hero: "clearHeroImage",
  confidence: "clearConfidenceImage",
  friction: "clearFrictionImage",
  framework: "clearFrameworkImage",
  audit: "clearAuditImage",
  rebuild: "clearRebuildImage",
  workflow: "clearWorkflowImage",
  measure: "clearMeasureImage",
  related: "clearRelatedImage",
  form: "clearFormImage",
  social: "clearOgImage",
};

function isTab(value: string | undefined): value is Tab {
  return TABS.some((tab) => tab.id === value);
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="crm-cms-field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function ImagePreview({ src, alt, recommended }: { src: string; alt: string; recommended: string }) {
  const [meta, setMeta] = useState("");
  if (!src) return <p className="crm-contact-image-hint">{recommended}</p>;
  return (
    <figure className="crm-contact-image-preview">
      <img
        src={src}
        alt={alt || "Sample visual preview"}
        width={480}
        height={320}
        onLoad={(event) => {
          const img = event.currentTarget;
          setMeta(`${img.naturalWidth}×${img.naturalHeight} px`);
        }}
      />
      <figcaption>
        {meta || "กำลังอ่านขนาดรูป… / Reading image size…"} · {recommended}
      </figcaption>
    </figure>
  );
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const next = index + direction;
  if (next < 0 || next >= items.length) return items;
  const copy = [...items];
  const [row] = copy.splice(index, 1);
  copy.splice(next, 0, row);
  return copy;
}

function listActions(index: number, total: number, onUp: () => void, onDown: () => void, onRemove: () => void) {
  return (
    <div className="crm-cs-metric-actions">
      <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={onUp}>
        ขึ้น
      </button>
      <button type="button" className="crm-users-secondary" disabled={index === total - 1} onClick={onDown}>
        ลง
      </button>
      <button type="button" className="crm-users-secondary" onClick={onRemove}>
        ลบ
      </button>
    </div>
  );
}

export function HotelDirectBookingsPageEditor({
  initial,
  notice,
  error,
  saveAction,
  duplicateAction,
  updatedAt,
  initialTab,
  previewHref,
  publicHref,
  locales = [],
}: {
  initial: DirectBookingEditorState;
  notice?: string;
  error?: string;
  saveAction: (formData: FormData) => Promise<DirectBookingCmsSaveResult>;
  duplicateAction: (formData: FormData) => Promise<DirectBookingCmsSaveResult>;
  updatedAt?: string;
  initialTab?: string;
  previewHref: string;
  publicHref: string;
  locales?: Array<{ id: string; locale: string; status: string; title: string }>;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileHolders = useRef<Partial<Record<VisualSlot, HTMLInputElement | null>>>({});
  const [tab, setTab] = useState<Tab>(isTab(initialTab) ? initialTab : "hero");
  const [meta, setMeta] = useState({
    title: initial.title,
    seoTitle: initial.seoTitle,
    metaDescription: initial.metaDescription,
    excerpt: initial.excerpt,
    locale: initial.locale,
    status: initial.status,
  });
  const [content, setContent] = useState<CmsDirectBookingPage>(initial.content);
  const [status, setStatus] = useState(error ? directBookingCmsErrorMessage(error) : "");
  const [ok, setOk] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<"unpublish" | "duplicate" | null>(null);
  const [targetLocale, setTargetLocale] = useState("en");
  const [dirty, setDirty] = useState(false);
  const [previews, setPreviews] = useState<Record<VisualSlot, string>>({
    hero: initial.content.hero.visual.src,
    confidence: initial.content.confidence.visual.src,
    friction: initial.content.friction.visual.src,
    framework: initial.content.framework.visual.src,
    audit: initial.content.audit.visual.src,
    rebuild: initial.content.rebuild.visual.src,
    workflow: initial.content.workflow.visual.src,
    measure: initial.content.measure.visual.src,
    related: initial.content.related.visual.src,
    form: initial.content.form.visual.src,
    social: initial.content.seo.social.src,
  });
  const [clears, setClears] = useState<Record<VisualSlot, boolean>>({
    hero: false,
    confidence: false,
    friction: false,
    framework: false,
    audit: false,
    rebuild: false,
    workflow: false,
    measure: false,
    related: false,
    form: false,
    social: false,
  });

  function markDirty() {
    setDirty(true);
    setOk("");
  }

  function patchContent(next: CmsDirectBookingPage) {
    setContent(next);
    markDirty();
  }

  function patchVisual(slot: VisualSlot, visual: CmsDirectBookingVisual) {
    if (slot === "hero") patchContent({ ...content, hero: { ...content.hero, visual } });
    else if (slot === "confidence") patchContent({ ...content, confidence: { ...content.confidence, visual } });
    else if (slot === "friction") patchContent({ ...content, friction: { ...content.friction, visual } });
    else if (slot === "framework") patchContent({ ...content, framework: { ...content.framework, visual } });
    else if (slot === "audit") patchContent({ ...content, audit: { ...content.audit, visual } });
    else if (slot === "rebuild") patchContent({ ...content, rebuild: { ...content.rebuild, visual } });
    else if (slot === "workflow") patchContent({ ...content, workflow: { ...content.workflow, visual } });
    else if (slot === "measure") patchContent({ ...content, measure: { ...content.measure, visual } });
    else if (slot === "related") patchContent({ ...content, related: { ...content.related, visual } });
    else if (slot === "form") patchContent({ ...content, form: { ...content.form, visual } });
    else patchContent({ ...content, seo: { ...content.seo, social: visual } });
  }

  function VisualFields({ slot, visual, hint }: { slot: VisualSlot; visual: CmsDirectBookingVisual; hint: string }) {
    return (
      <>
        <Field label="คำอธิบายภาพภาษาไทย (alt)" hint="จำเป็นเมื่อมีรูปและจะเผยแพร่">
          <input className="crm-field" value={visual.altTh} onChange={(event) => patchVisual(slot, { ...visual, altTh: event.target.value })} />
        </Field>
        <Field label="คำอธิบายภาพภาษาอังกฤษ (alt)">
          <input className="crm-field" value={visual.altEn} onChange={(event) => patchVisual(slot, { ...visual, altEn: event.target.value })} />
        </Field>
        <Field label="ป้ายกำกับรูป">
          <input className="crm-field" value={visual.label} onChange={(event) => patchVisual(slot, { ...visual, label: event.target.value })} />
        </Field>
        <Field label="คำบรรยายใต้ภาพ">
          <input className="crm-field" value={visual.caption} onChange={(event) => patchVisual(slot, { ...visual, caption: event.target.value })} />
        </Field>
        <Field label="สถานะรูป" hint="ใช้ Sample สำหรับแผนภาพจำลอง — ภาพหน้าจอโรงแรมจริงต้อง Approved">
          <select
            className="crm-field"
            value={visual.status === "placeholder" || visual.status === "real" ? "replace" : visual.status}
            onChange={(event) => patchVisual(slot, { ...visual, status: event.target.value as DirectBookingVisualStatus })}
          >
            {VISUAL_STATUS_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="แทนที่รูป" hint={hint}>
          <input
            className="crm-field"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const transfer = new DataTransfer();
              transfer.items.add(file);
              const holder = fileHolders.current[slot];
              if (holder) holder.files = transfer.files;
              setPreviews((current) => ({ ...current, [slot]: URL.createObjectURL(file) }));
              setClears((current) => ({ ...current, [slot]: false }));
              if (visual.status === "placeholder" || visual.status === "replace" || visual.status === "real") {
                patchVisual(slot, { ...visual, status: "sample" });
              }
              markDirty();
            }}
          />
        </Field>
        <ImagePreview src={clears[slot] ? "" : previews[slot]} alt={visual.altTh || visual.altEn} recommended={hint} />
        {(previews[slot] || visual.src) && !clears[slot] ? (
          <button
            type="button"
            className="crm-users-secondary"
            onClick={() => {
              const holder = fileHolders.current[slot];
              if (holder) holder.value = "";
              setClears((current) => ({ ...current, [slot]: true }));
              setPreviews((current) => ({ ...current, [slot]: "" }));
              patchVisual(slot, { ...visual, src: "", status: "replace" });
            }}
          >
            ลบรูป
          </button>
        ) : null}
      </>
    );
  }

  function submit(intent: DirectBookingCmsIntent) {
    const node = formRef.current;
    if (!node) return;
    const data = new FormData(node);
    data.set("intent", intent);
    data.set("title", meta.title);
    data.set("seoTitle", meta.seoTitle);
    data.set("metaDescription", meta.metaDescription);
    data.set("excerpt", meta.excerpt);
    data.set("contentJson", JSON.stringify(content));
    (Object.keys(clears) as VisualSlot[]).forEach((slot) => {
      if (clears[slot]) data.set(CLEAR_FIELD_NAMES[slot], "1");
    });
    startTransition(async () => {
      setOk("");
      setStatus("");
      const result = await saveAction(data);
      if (!result.ok) {
        setStatus(directBookingCmsErrorMessage(result.error));
        return;
      }
      if (intent === "publish") setMeta((current) => ({ ...current, status: "published" }));
      if (intent === "draft" || intent === "unpublish") setMeta((current) => ({ ...current, status: "draft" }));
      setOk(intent === "preview" ? directBookingCmsNotice("preview") : directBookingCmsNotice("saved"));
      setDirty(false);
      if (intent === "preview") {
        router.push(previewHref);
        return;
      }
      router.refresh();
    });
  }

  function duplicateToLocale() {
    const node = formRef.current;
    if (!node) return;
    const data = new FormData(node);
    data.set("targetLocale", targetLocale);
    startTransition(async () => {
      setOk("");
      setStatus("");
      const result = await duplicateAction(data);
      if (!result.ok) {
        setStatus(directBookingCmsErrorMessage(result.error));
        return;
      }
      setOk(directBookingCmsNotice("duplicate"));
      setDirty(false);
      router.push(`/crm/cms/pages/${result.id}?tab=faq`);
    });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = (submitter?.value as DirectBookingCmsIntent) || "save";
    if (intent === "unpublish") {
      setDialog("unpublish");
      return;
    }
    submit(intent);
  }

  const saveButtons = (
    <>
      <button className="kpi-button" type="submit" name="intent" value="save" disabled={pending}>
        {pending ? directBookingCmsNotice("pending") : "บันทึก / Save"}
      </button>
      <button className="crm-users-secondary" type="submit" name="intent" value="draft" disabled={pending}>
        บันทึกฉบับร่าง
      </button>
      <button className="crm-users-secondary" type="submit" name="intent" value="preview" disabled={pending}>
        บันทึกแล้วดูตัวอย่าง
      </button>
      <button className="kpi-button" type="submit" name="intent" value="publish" disabled={pending}>
        เผยแพร่
      </button>
      <button className="crm-users-secondary" type="submit" name="intent" value="unpublish" disabled={pending}>
        ยกเลิกเผยแพร่
      </button>
      <button type="button" className="crm-users-secondary" disabled={pending} onClick={() => setDialog("duplicate")}>
        คัดลอกไปภาษาอื่น
      </button>
    </>
  );
  const stateClass = status ? " is-error" : dirty ? " is-dirty" : ok ? " is-ok" : "";
  const saveBar = (
    <div className="crm-cs-savebar">
      {saveButtons}
      <p className={`crm-cs-save-state${stateClass}`} role="status">
        {pending ? directBookingCmsNotice("pending") : status || (dirty ? directBookingCmsNotice("dirty") : ok || directBookingCmsNotice("ready"))}
      </p>
    </div>
  );

  return (
    <div className="crm-cms-editor">
      <nav className="crm-cms-tabs" role="tablist" aria-label="ส่วนของหน้า Hotel Direct Bookings">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            id={`direct-bookings-cms-tab-${item.id}`}
            role="tab"
            aria-selected={tab === item.id}
            aria-controls="direct-bookings-cms-panel"
            className={tab === item.id ? "is-active" : ""}
            style={tab === item.id ? { background: "#a2dc25", color: "#1a3a02" } : undefined}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <form ref={formRef} className="crm-cms-form" onSubmit={onSubmit}>
        <input type="hidden" name="id" value={initial.id} />
        <input type="hidden" name="locale" value={meta.locale} />
        {(Object.keys(VISUAL_FILE_NAMES) as VisualSlot[]).map((slot) => (
          <input
            key={slot}
            ref={(node) => {
              fileHolders.current[slot] = node;
            }}
            type="file"
            name={VISUAL_FILE_NAMES[slot]}
            accept=".jpg,.jpeg,.png,.webp"
            hidden
            aria-hidden="true"
            tabIndex={-1}
          />
        ))}
        {saveBar}
        <div id="direct-bookings-cms-panel" role="tabpanel" aria-labelledby={`direct-bookings-cms-tab-${tab}`}>
          {tab === "hero" ? (
            <section className="crm-cms-panel">
              <Field label="Eyebrow">
                <input className="crm-field" value={content.hero.eyebrow} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, eyebrow: event.target.value } })} />
              </Field>
              <Field label="หัวข้อ Hero">
                <input className="crm-field" value={content.hero.title} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, title: event.target.value } })} />
              </Field>
              <Field label="คำอธิบาย">
                <textarea className="crm-area" rows={4} value={content.hero.description} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, description: event.target.value } })} />
              </Field>
              <Field label="ข้อความปิดท้าย">
                <textarea className="crm-area" rows={3} value={content.hero.close} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, close: event.target.value } })} />
              </Field>
              <Field label="ปุ่มหลัก">
                <input className="crm-field" value={content.hero.primaryCta.label} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, primaryCta: { ...content.hero.primaryCta, label: event.target.value } } })} />
              </Field>
              <Field label="ลิงก์ปุ่มหลัก">
                <input className="crm-field" value={content.hero.primaryCta.href} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, primaryCta: { ...content.hero.primaryCta, href: event.target.value } } })} />
              </Field>
              <Field label="ปุ่มรอง">
                <input className="crm-field" value={content.hero.secondaryCta.label} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, secondaryCta: { ...content.hero.secondaryCta, label: event.target.value } } })} />
              </Field>
              <Field label="ลิงก์ปุ่มรอง">
                <input className="crm-field" value={content.hero.secondaryCta.href} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, secondaryCta: { ...content.hero.secondaryCta, href: event.target.value } } })} />
              </Field>
              <Field label="ข้อความใต้ปุ่ม">
                <input className="crm-field" value={content.hero.underCta} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, underCta: event.target.value } })} />
              </Field>
              <VisualFields slot="hero" visual={content.hero.visual} hint="Dummy 1600 × 1000 px · Hotel Direct Booking hero · ห้ามใช้ภาพเดียวกับ Booking Confidence" />
            </section>
          ) : null}

          {tab === "confidence" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.confidence.title} onChange={(event) => patchContent({ ...content, confidence: { ...content.confidence, title: event.target.value } })} />
              </Field>
              <Field label="เนื้อหา">
                <textarea className="crm-area" rows={4} value={content.confidence.body} onChange={(event) => patchContent({ ...content, confidence: { ...content.confidence, body: event.target.value } })} />
              </Field>
              <Field label="งานวิจัยเสริม">
                <textarea className="crm-area" rows={3} value={content.confidence.study} onChange={(event) => patchContent({ ...content, confidence: { ...content.confidence, study: event.target.value } })} />
              </Field>
              <Field label="หลักฐาน / บริบทข้อมูล" hint="แหล่งภายนอกต้องมีชื่อ URL วันที่ ตลาด และสถานะข้อมูลก่อนเผยแพร่">
                <textarea className="crm-area" rows={3} value={content.confidence.evidence} onChange={(event) => patchContent({ ...content, confidence: { ...content.confidence, evidence: event.target.value } })} />
              </Field>
              {content.confidence.sources.map((source, index) => (
                <div key={`${source.url}-${index}`} className="crm-cs-metric">
                  <h3>แหล่งที่มา {index + 1}</h3>
                  {listActions(
                    index,
                    content.confidence.sources.length,
                    () => patchContent({ ...content, confidence: { ...content.confidence, sources: moveItem(content.confidence.sources, index, -1) } }),
                    () => patchContent({ ...content, confidence: { ...content.confidence, sources: moveItem(content.confidence.sources, index, 1) } }),
                    () => patchContent({ ...content, confidence: { ...content.confidence, sources: content.confidence.sources.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                  <Field label="ชื่อ">
                    <input className="crm-field" value={source.name} onChange={(event) => patchContent({ ...content, confidence: { ...content.confidence, sources: content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, name: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="URL">
                    <input className="crm-field" value={source.url} onChange={(event) => patchContent({ ...content, confidence: { ...content.confidence, sources: content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, url: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="วันที่เผยแพร่">
                    <input className="crm-field" value={source.publishedAt} onChange={(event) => patchContent({ ...content, confidence: { ...content.confidence, sources: content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, publishedAt: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="วันที่เข้าถึง">
                    <input className="crm-field" value={source.accessedAt} onChange={(event) => patchContent({ ...content, confidence: { ...content.confidence, sources: content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, accessedAt: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="ตลาด">
                    <input className="crm-field" value={source.market} onChange={(event) => patchContent({ ...content, confidence: { ...content.confidence, sources: content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, market: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="ช่วงเวลา">
                    <input className="crm-field" value={source.period} onChange={(event) => patchContent({ ...content, confidence: { ...content.confidence, sources: content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, period: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="คำนิยาม">
                    <textarea className="crm-area" rows={2} value={source.definition} onChange={(event) => patchContent({ ...content, confidence: { ...content.confidence, sources: content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, definition: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="สถานะข้อมูล">
                    <select className="crm-field" value={source.status} onChange={(event) => patchContent({ ...content, confidence: { ...content.confidence, sources: content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, status: event.target.value } : row)) } })}>
                      {DIRECT_BOOKING_CMS_SOURCE_STATUSES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, confidence: { ...content.confidence, sources: [...content.confidence.sources, { name: "", url: "", publishedAt: "", accessedAt: "", market: "", period: "", definition: "", status: "guidance" }] } })}>เพิ่มแหล่งที่มา</button>
              <VisualFields slot="confidence" visual={content.confidence.visual} hint="Dummy 1200 × 800 px · Booking confidence · ห้ามใช้ภาพ Hero" />
            </section>
          ) : null}

          {tab === "friction" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.friction.title} onChange={(event) => patchContent({ ...content, friction: { ...content.friction, title: event.target.value } })} />
              </Field>
              {content.friction.rows.map((row, index) => (
                <div key={row.id} className="crm-cs-metric">
                  <h3>{row.stage || `แถว ${index + 1}`}</h3>
                  {listActions(
                    index,
                    content.friction.rows.length,
                    () => patchContent({ ...content, friction: { ...content.friction, rows: moveItem(content.friction.rows, index, -1) } }),
                    () => patchContent({ ...content, friction: { ...content.friction, rows: moveItem(content.friction.rows, index, 1) } }),
                    () => patchContent({ ...content, friction: { ...content.friction, rows: content.friction.rows.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                  <Field label="ขั้นตอน (stage)">
                    <input className="crm-field" value={row.stage} onChange={(event) => patchContent({ ...content, friction: { ...content.friction, rows: content.friction.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, stage: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Friction">
                    <textarea className="crm-area" rows={2} value={row.friction} onChange={(event) => patchContent({ ...content, friction: { ...content.friction, rows: content.friction.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, friction: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="คำถาม">
                    <textarea className="crm-area" rows={2} value={row.question} onChange={(event) => patchContent({ ...content, friction: { ...content.friction, rows: content.friction.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, question: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ความเสี่ยง">
                    <textarea className="crm-area" rows={2} value={row.risk} onChange={(event) => patchContent({ ...content, friction: { ...content.friction, rows: content.friction.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, risk: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สิ่งที่ตรวจ">
                    <textarea className="crm-area" rows={2} value={row.inspect} onChange={(event) => patchContent({ ...content, friction: { ...content.friction, rows: content.friction.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, inspect: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผลลัพธ์">
                    <input className="crm-field" value={row.output} onChange={(event) => patchContent({ ...content, friction: { ...content.friction, rows: content.friction.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, output: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Tone">
                    <select className="crm-field" value={row.tone} onChange={(event) => patchContent({ ...content, friction: { ...content.friction, rows: content.friction.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, tone: event.target.value } : item)) } })}>
                      {DIRECT_BOOKING_CMS_FRICTION_TONES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Tracking">
                    <select className="crm-field" value={row.tracking} onChange={(event) => patchContent({ ...content, friction: { ...content.friction, rows: content.friction.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, tracking: event.target.value } : item)) } })}>
                      {DIRECT_BOOKING_CMS_FRICTION_TRACKING.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, friction: { ...content.friction, rows: [...content.friction.rows, { id: newDirectBookingItemId("friction"), stage: "", friction: "", question: "", risk: "", inspect: "", output: "", tone: "yellow", tracking: "needs-review" }] } })}>เพิ่มแถว Friction</button>
              <VisualFields slot="friction" visual={content.friction.visual} hint="Dummy · Direct booking friction stages · Sample" />
            </section>
          ) : null}

          {tab === "framework" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.framework.title} onChange={(event) => patchContent({ ...content, framework: { ...content.framework, title: event.target.value } })} />
              </Field>
              {content.framework.steps.map((step, index) => (
                <div key={step.id} className="crm-cs-metric">
                  <h3>{step.num} {step.title || `ขั้นตอน ${index + 1}`}</h3>
                  {listActions(
                    index,
                    content.framework.steps.length,
                    () => patchContent({ ...content, framework: { ...content.framework, steps: moveItem(content.framework.steps, index, -1) } }),
                    () => patchContent({ ...content, framework: { ...content.framework, steps: moveItem(content.framework.steps, index, 1) } }),
                    () => patchContent({ ...content, framework: { ...content.framework, steps: content.framework.steps.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                  <Field label="ลำดับ (num)">
                    <input className="crm-field" value={step.num} onChange={(event) => patchContent({ ...content, framework: { ...content.framework, steps: content.framework.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, num: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="ขั้นในเส้นทาง (stage)">
                    <input className="crm-field" value={step.stage} onChange={(event) => patchContent({ ...content, framework: { ...content.framework, steps: content.framework.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, stage: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="หัวข้อย่อย">
                    <input className="crm-field" value={step.title} onChange={(event) => patchContent({ ...content, framework: { ...content.framework, steps: content.framework.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, title: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Input">
                    <textarea className="crm-area" rows={2} value={step.input} onChange={(event) => patchContent({ ...content, framework: { ...content.framework, steps: content.framework.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, input: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Action">
                    <textarea className="crm-area" rows={3} value={step.action} onChange={(event) => patchContent({ ...content, framework: { ...content.framework, steps: content.framework.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, action: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Output">
                    <input className="crm-field" value={step.output} onChange={(event) => patchContent({ ...content, framework: { ...content.framework, steps: content.framework.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, output: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Approval">
                    <textarea className="crm-area" rows={2} value={step.approval} onChange={(event) => patchContent({ ...content, framework: { ...content.framework, steps: content.framework.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, approval: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Measure">
                    <textarea className="crm-area" rows={2} value={step.measure} onChange={(event) => patchContent({ ...content, framework: { ...content.framework, steps: content.framework.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, measure: event.target.value } : row)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, framework: { ...content.framework, steps: [...content.framework.steps, { id: newDirectBookingItemId("framework"), num: String(content.framework.steps.length + 1).padStart(2, "0"), stage: "", title: "", input: "", action: "", output: "", approval: "", measure: "" }] } })}>เพิ่มขั้นตอน Framework</button>
              <Field label="หมายเหตุขอบเขต">
                <textarea className="crm-area" rows={2} value={content.framework.boundaryNote} onChange={(event) => patchContent({ ...content, framework: { ...content.framework, boundaryNote: event.target.value } })} />
              </Field>
              <Field label="หัวข้อฝั่ง KPI Plus">
                <input className="crm-field" value={content.framework.supportTitle} onChange={(event) => patchContent({ ...content, framework: { ...content.framework, supportTitle: event.target.value } })} />
              </Field>
              {content.framework.support.map((item, index) => (
                <div key={item.id} className="crm-cs-metric">
                  <h3>รายการ KPI Plus {index + 1}</h3>
                  {listActions(
                    index,
                    content.framework.support.length,
                    () => patchContent({ ...content, framework: { ...content.framework, support: moveItem(content.framework.support, index, -1) } }),
                    () => patchContent({ ...content, framework: { ...content.framework, support: moveItem(content.framework.support, index, 1) } }),
                    () => patchContent({ ...content, framework: { ...content.framework, support: content.framework.support.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                  <Field label="ข้อความ">
                    <input className="crm-field" value={item.label} onChange={(event) => patchContent({ ...content, framework: { ...content.framework, support: content.framework.support.map((row, rowIndex) => (rowIndex === index ? { ...row, label: event.target.value } : row)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, framework: { ...content.framework, support: [...content.framework.support, { id: newDirectBookingItemId("support"), label: "" }] } })}>เพิ่มรายการ KPI Plus</button>
              <Field label="หัวข้อฝั่งโรงแรม">
                <input className="crm-field" value={content.framework.hotelTitle} onChange={(event) => patchContent({ ...content, framework: { ...content.framework, hotelTitle: event.target.value } })} />
              </Field>
              {content.framework.hotel.map((item, index) => (
                <div key={item.id} className="crm-cs-metric">
                  <h3>รายการโรงแรม {index + 1}</h3>
                  {listActions(
                    index,
                    content.framework.hotel.length,
                    () => patchContent({ ...content, framework: { ...content.framework, hotel: moveItem(content.framework.hotel, index, -1) } }),
                    () => patchContent({ ...content, framework: { ...content.framework, hotel: moveItem(content.framework.hotel, index, 1) } }),
                    () => patchContent({ ...content, framework: { ...content.framework, hotel: content.framework.hotel.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                  <Field label="ข้อความ">
                    <input className="crm-field" value={item.label} onChange={(event) => patchContent({ ...content, framework: { ...content.framework, hotel: content.framework.hotel.map((row, rowIndex) => (rowIndex === index ? { ...row, label: event.target.value } : row)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, framework: { ...content.framework, hotel: [...content.framework.hotel, { id: newDirectBookingItemId("hotel"), label: "" }] } })}>เพิ่มรายการโรงแรม</button>
              <VisualFields slot="framework" visual={content.framework.visual} hint="Dummy 1600 × 900 px · Direct booking service framework · Sample" />
            </section>
          ) : null}

          {tab === "audit" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.audit.title} onChange={(event) => patchContent({ ...content, audit: { ...content.audit, title: event.target.value } })} />
              </Field>
              <Field label="Lead">
                <textarea className="crm-area" rows={3} value={content.audit.lead} onChange={(event) => patchContent({ ...content, audit: { ...content.audit, lead: event.target.value } })} />
              </Field>
              {content.audit.rows.map((row, index) => (
                <div key={row.id} className="crm-cs-metric">
                  <h3>{row.item || `แถว ${index + 1}`}</h3>
                  {listActions(
                    index,
                    content.audit.rows.length,
                    () => patchContent({ ...content, audit: { ...content.audit, rows: moveItem(content.audit.rows, index, -1) } }),
                    () => patchContent({ ...content, audit: { ...content.audit, rows: moveItem(content.audit.rows, index, 1) } }),
                    () => patchContent({ ...content, audit: { ...content.audit, rows: content.audit.rows.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                  <Field label="รายการ (item)">
                    <input className="crm-field" value={row.item} onChange={(event) => patchContent({ ...content, audit: { ...content.audit, rows: content.audit.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, item: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="กลุ่ม (group)">
                    <input className="crm-field" value={row.group} onChange={(event) => patchContent({ ...content, audit: { ...content.audit, rows: content.audit.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, group: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สถานะ">
                    <select className="crm-field" value={row.status} onChange={(event) => patchContent({ ...content, audit: { ...content.audit, rows: content.audit.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, status: event.target.value } : item)) } })}>
                      {DIRECT_BOOKING_CMS_AUDIT_STATUSES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Owner">
                    <input className="crm-field" value={row.owner} onChange={(event) => patchContent({ ...content, audit: { ...content.audit, rows: content.audit.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, owner: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Note">
                    <textarea className="crm-area" rows={2} value={row.note} onChange={(event) => patchContent({ ...content, audit: { ...content.audit, rows: content.audit.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, note: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Action">
                    <textarea className="crm-area" rows={2} value={row.action} onChange={(event) => patchContent({ ...content, audit: { ...content.audit, rows: content.audit.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, action: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Last reviewed">
                    <input className="crm-field" value={row.lastReviewed} onChange={(event) => patchContent({ ...content, audit: { ...content.audit, rows: content.audit.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, lastReviewed: event.target.value } : item)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, audit: { ...content.audit, rows: [...content.audit.rows, { id: newDirectBookingItemId("audit"), group: "", item: "", status: "needs-review", owner: "", note: "", action: "", lastReviewed: "" }] } })}>เพิ่มแถว Audit</button>
              <VisualFields slot="audit" visual={content.audit.visual} hint="Dummy · Friction audit checklist · Sample" />
            </section>
          ) : null}

          {tab === "rebuild" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.rebuild.title} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, title: event.target.value } })} />
              </Field>
              <Field label="เนื้อหา">
                <textarea className="crm-area" rows={4} value={content.rebuild.body} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, body: event.target.value } })} />
              </Field>
              <Field label="ข้อความปิด">
                <textarea className="crm-area" rows={3} value={content.rebuild.close} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, close: event.target.value } })} />
              </Field>
              <Field label="หมายเหตุการตัดสินใจ">
                <textarea className="crm-area" rows={2} value={content.rebuild.note} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, note: event.target.value } })} />
              </Field>
              {content.rebuild.paths.map((path, index) => (
                <div key={path.id} className="crm-cs-metric">
                  <h3>{path.title || `แนวทาง ${index + 1}`}</h3>
                  {listActions(
                    index,
                    content.rebuild.paths.length,
                    () => patchContent({ ...content, rebuild: { ...content.rebuild, paths: moveItem(content.rebuild.paths, index, -1) } }),
                    () => patchContent({ ...content, rebuild: { ...content.rebuild, paths: moveItem(content.rebuild.paths, index, 1) } }),
                    () => patchContent({ ...content, rebuild: { ...content.rebuild, paths: content.rebuild.paths.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                  <Field label="หัวข้อ">
                    <input className="crm-field" value={path.title} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, paths: content.rebuild.paths.map((item, rowIndex) => (rowIndex === index ? { ...item, title: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Situation บรรทัดละข้อ">
                    <textarea className="crm-area" rows={4} value={path.situation.join("\n")} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, paths: content.rebuild.paths.map((item, rowIndex) => (rowIndex === index ? { ...item, situation: event.target.value.split("\n").map((line) => line.trim()).filter(Boolean) } : item)) } })} />
                  </Field>
                  <Field label="Evidence">
                    <textarea className="crm-area" rows={2} value={path.evidence} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, paths: content.rebuild.paths.map((item, rowIndex) => (rowIndex === index ? { ...item, evidence: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Route">
                    <textarea className="crm-area" rows={2} value={path.route} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, paths: content.rebuild.paths.map((item, rowIndex) => (rowIndex === index ? { ...item, route: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Risk">
                    <textarea className="crm-area" rows={2} value={path.risk} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, paths: content.rebuild.paths.map((item, rowIndex) => (rowIndex === index ? { ...item, risk: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Next">
                    <textarea className="crm-area" rows={2} value={path.next} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, paths: content.rebuild.paths.map((item, rowIndex) => (rowIndex === index ? { ...item, next: event.target.value } : item)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, rebuild: { ...content.rebuild, paths: [...content.rebuild.paths, { id: newDirectBookingItemId("path"), title: "", situation: [], evidence: "", route: "", risk: "", next: "" }] } })}>เพิ่ม Decision path</button>
              <VisualFields slot="rebuild" visual={content.rebuild.visual} hint="Dummy 1600 × 900 px · Improve vs rebuild · Sample" />
            </section>
          ) : null}

          {tab === "workflow" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.workflow.title} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, title: event.target.value } })} />
              </Field>
              {content.workflow.steps.map((step, index) => (
                <div key={step.id} className="crm-cs-metric">
                  <h3>{step.num} {step.title || `ขั้นตอน ${index + 1}`}</h3>
                  {listActions(
                    index,
                    content.workflow.steps.length,
                    () => patchContent({ ...content, workflow: { ...content.workflow, steps: moveItem(content.workflow.steps, index, -1) } }),
                    () => patchContent({ ...content, workflow: { ...content.workflow, steps: moveItem(content.workflow.steps, index, 1) } }),
                    () => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                  <Field label="ลำดับ (num)">
                    <input className="crm-field" value={step.num} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, num: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Label">
                    <input className="crm-field" value={step.label} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, label: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="หัวข้อย่อย">
                    <input className="crm-field" value={step.title} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, title: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Owner">
                    <textarea className="crm-area" rows={2} value={step.owner} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, owner: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Input">
                    <textarea className="crm-area" rows={2} value={step.input} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, input: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Action">
                    <textarea className="crm-area" rows={3} value={step.action} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, action: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Output">
                    <input className="crm-field" value={step.output} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, output: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Approval">
                    <textarea className="crm-area" rows={2} value={step.approval} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, approval: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Next">
                    <textarea className="crm-area" rows={2} value={step.next} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, next: event.target.value } : row)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, workflow: { ...content.workflow, steps: [...content.workflow.steps, { id: newDirectBookingItemId("step"), num: String(content.workflow.steps.length + 1).padStart(2, "0"), label: "", title: "", owner: "", input: "", action: "", output: "", approval: "", next: "" }] } })}>เพิ่มขั้นตอน Workflow</button>
              <VisualFields slot="workflow" visual={content.workflow.visual} hint="Dummy · Direct booking project workflow · Sample" />
            </section>
          ) : null}

          {tab === "kpis" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.measure.title} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, title: event.target.value } })} />
              </Field>
              <Field label="เนื้อหา">
                <textarea className="crm-area" rows={3} value={content.measure.body} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, body: event.target.value } })} />
              </Field>
              <Field label="หมายเหตุ">
                <textarea className="crm-area" rows={2} value={content.measure.note} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, note: event.target.value } })} />
              </Field>
              <Field label="ขอบเขตการวัดผล">
                <textarea className="crm-area" rows={3} value={content.measure.boundary} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, boundary: event.target.value } })} />
              </Field>
              <label className="crm-cms-field">
                <span>Booking Engine เชื่อมแล้ว</span>
                <input type="checkbox" checked={content.measure.bookingEngineConfigured} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, bookingEngineConfigured: event.target.checked } })} />
              </label>
              <label className="crm-cms-field">
                <span>Tracking Event พร้อมใช้</span>
                <input type="checkbox" checked={content.measure.trackingConfigured} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, trackingConfigured: event.target.checked } })} />
              </label>
              {content.measure.stages.map((stage, index) => (
                <div key={stage.id} className="crm-cs-metric">
                  <h3>{stage.num} {stage.title || `Stage ${index + 1}`}</h3>
                  {listActions(
                    index,
                    content.measure.stages.length,
                    () => patchContent({ ...content, measure: { ...content.measure, stages: moveItem(content.measure.stages, index, -1) } }),
                    () => patchContent({ ...content, measure: { ...content.measure, stages: moveItem(content.measure.stages, index, 1) } }),
                    () => patchContent({ ...content, measure: { ...content.measure, stages: content.measure.stages.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                  <Field label="ลำดับ (num)">
                    <input className="crm-field" value={stage.num} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, stages: content.measure.stages.map((row, rowIndex) => (rowIndex === index ? { ...row, num: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Event">
                    <input className="crm-field" value={stage.event} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, stages: content.measure.stages.map((row, rowIndex) => (rowIndex === index ? { ...row, event: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Title">
                    <input className="crm-field" value={stage.title} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, stages: content.measure.stages.map((row, rowIndex) => (rowIndex === index ? { ...row, title: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Action">
                    <textarea className="crm-area" rows={2} value={stage.action} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, stages: content.measure.stages.map((row, rowIndex) => (rowIndex === index ? { ...row, action: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Source">
                    <input className="crm-field" value={stage.source} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, stages: content.measure.stages.map((row, rowIndex) => (rowIndex === index ? { ...row, source: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Owner">
                    <input className="crm-field" value={stage.owner} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, stages: content.measure.stages.map((row, rowIndex) => (rowIndex === index ? { ...row, owner: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Conclude">
                    <textarea className="crm-area" rows={2} value={stage.conclude} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, stages: content.measure.stages.map((row, rowIndex) => (rowIndex === index ? { ...row, conclude: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="Tracking">
                    <select className="crm-field" value={stage.tracking} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, stages: content.measure.stages.map((row, rowIndex) => (rowIndex === index ? { ...row, tracking: event.target.value as DirectBookingTrackingStatus } : row)) } })}>
                      {DIRECT_BOOKING_CMS_TRACKING_STATUSES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, measure: { ...content.measure, stages: [...content.measure.stages, { id: newDirectBookingItemId("stage"), num: String(content.measure.stages.length + 1).padStart(2, "0"), event: "", title: "", action: "", source: "", owner: "", conclude: "", tracking: "not-configured" }] } })}>เพิ่ม Measure stage</button>
              <VisualFields slot="measure" visual={content.measure.visual} hint="Dummy · Direct booking performance metrics · Sample" />
              {content.measure.kpis.map((kpi, index) => (
                <KpiFields
                  key={kpi.id}
                  kpi={kpi}
                  index={index}
                  total={content.measure.kpis.length}
                  onChange={(next) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((row, rowIndex) => (rowIndex === index ? next : row)) } })}
                  onMove={(direction) => patchContent({ ...content, measure: { ...content.measure, kpis: moveItem(content.measure.kpis, index, direction) } })}
                  onRemove={() => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.filter((_, rowIndex) => rowIndex !== index) } })}
                />
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    measure: {
                      ...content.measure,
                      kpis: [
                        ...content.measure.kpis,
                        {
                          id: newDirectBookingItemId("kpi"),
                          name: "",
                          group: "visit",
                          period: "",
                          unit: "",
                          definition: "",
                          comparison: "",
                          market: "",
                          source: "",
                          sourceUrl: "",
                          target: "",
                          labels: [],
                          values: [],
                          value: "",
                          dataStatus: "draft",
                          hideUntilData: true,
                          updatedAt: "",
                          tone: "green",
                          order: content.measure.kpis.length + 1,
                        },
                      ],
                    },
                  })
                }
              >
                เพิ่ม KPI
              </button>
            </section>
          ) : null}

          {tab === "related" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.related.title} onChange={(event) => patchContent({ ...content, related: { ...content.related, title: event.target.value } })} />
              </Field>
              <VisualFields slot="related" visual={content.related.visual} hint="Dummy 1200 × 800 px · Related direct booking content · Sample" />
              {content.related.cards.map((card, index) => (
                <RelatedFields
                  key={card.id}
                  card={card}
                  index={index}
                  total={content.related.cards.length}
                  onChange={(next) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((row, rowIndex) => (rowIndex === index ? next : row)) } })}
                  onMove={(direction) => patchContent({ ...content, related: { ...content.related, cards: moveItem(content.related.cards, index, direction) } })}
                  onRemove={() => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.filter((_, rowIndex) => rowIndex !== index) } })}
                />
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    related: {
                      ...content.related,
                      cards: [...content.related.cards, { id: newDirectBookingItemId("card"), title: "", body: "", href: "/", cta: "", featured: false, publicationApproved: false, order: content.related.cards.length + 1 }],
                    },
                  })
                }
              >
                เพิ่มการ์ด
              </button>
            </section>
          ) : null}

          {tab === "form" ? (
            <section className="crm-cms-panel">
              <Field label="Kicker">
                <input className="crm-field" value={content.form.kicker} onChange={(event) => patchContent({ ...content, form: { ...content.form, kicker: event.target.value } })} />
              </Field>
              <Field label="หัวข้อฟอร์ม">
                <input className="crm-field" value={content.form.title} onChange={(event) => patchContent({ ...content, form: { ...content.form, title: event.target.value } })} />
              </Field>
              <Field label="คำอธิบาย">
                <textarea className="crm-area" rows={3} value={content.form.body} onChange={(event) => patchContent({ ...content, form: { ...content.form, body: event.target.value } })} />
              </Field>
              <Field label="ปุ่มส่ง">
                <input className="crm-field" value={content.form.submit} onChange={(event) => patchContent({ ...content, form: { ...content.form, submit: event.target.value } })} />
              </Field>
              <Field label="หัวข้อสิ่งที่โรงแรมจะได้รับ">
                <input className="crm-field" value={content.form.receiveTitle} onChange={(event) => patchContent({ ...content, form: { ...content.form, receiveTitle: event.target.value } })} />
              </Field>
              {content.form.receive.map((item, index) => (
                <div key={item.id} className="crm-cs-metric">
                  <h3>รายการ {index + 1}</h3>
                  {listActions(
                    index,
                    content.form.receive.length,
                    () => patchContent({ ...content, form: { ...content.form, receive: moveItem(content.form.receive, index, -1) } }),
                    () => patchContent({ ...content, form: { ...content.form, receive: moveItem(content.form.receive, index, 1) } }),
                    () => patchContent({ ...content, form: { ...content.form, receive: content.form.receive.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                  <Field label="หัวข้อ">
                    <input className="crm-field" value={item.title} onChange={(event) => patchContent({ ...content, form: { ...content.form, receive: content.form.receive.map((row, rowIndex) => (rowIndex === index ? { ...row, title: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="คำอธิบาย">
                    <textarea className="crm-area" rows={2} value={item.body} onChange={(event) => patchContent({ ...content, form: { ...content.form, receive: content.form.receive.map((row, rowIndex) => (rowIndex === index ? { ...row, body: event.target.value } : row)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, form: { ...content.form, receive: [...content.form.receive, { id: newDirectBookingItemId("recv"), title: "", body: "" }] } })}>เพิ่มรายการที่จะได้รับ</button>
              <Field label="What Happens Next (หัวข้อ)">
                <input className="crm-field" value={content.form.nextTitle} onChange={(event) => patchContent({ ...content, form: { ...content.form, nextTitle: event.target.value } })} />
              </Field>
              {content.form.steps.map((step, index) => (
                <div key={`step-${index}`} className="crm-cs-metric">
                  <h3>ขั้นตอน {index + 1}</h3>
                  {listActions(
                    index,
                    content.form.steps.length,
                    () => patchContent({ ...content, form: { ...content.form, steps: moveItem(content.form.steps, index, -1) } }),
                    () => patchContent({ ...content, form: { ...content.form, steps: moveItem(content.form.steps, index, 1) } }),
                    () => patchContent({ ...content, form: { ...content.form, steps: content.form.steps.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                  <Field label="ข้อความ">
                    <input className="crm-field" value={step} onChange={(event) => patchContent({ ...content, form: { ...content.form, steps: content.form.steps.map((row, rowIndex) => (rowIndex === index ? event.target.value : row)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, form: { ...content.form, steps: [...content.form.steps, ""] } })}>เพิ่มขั้นตอนถัดไป</button>
              <h3>ป้ายฟอร์มและข้อความยินยอม</h3>
              {(["name", "business", "contact", "website", "bookingEngine", "goal", "analytics", "tracking", "challenge", "consent", "privacy"] as const).map((key) => (
                <Field key={key} label={key}>
                  <input className="crm-field" value={content.form.labels[key]} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, [key]: event.target.value } } })} />
                </Field>
              ))}
              <VisualFields slot="form" visual={content.form.visual} hint="Optional enquiry visual · Sample only" />
            </section>
          ) : null}

          {tab === "faq" ? (
            <section className="crm-cms-panel">
              {content.faqs.map((faq, index) => (
                <div key={faq.id} className="crm-cs-metric">
                  <h3>FAQ {index + 1}</h3>
                  {listActions(
                    index,
                    content.faqs.length,
                    () => patchContent({ ...content, faqs: moveItem(content.faqs, index, -1) }),
                    () => patchContent({ ...content, faqs: moveItem(content.faqs, index, 1) }),
                    () => patchContent({ ...content, faqs: content.faqs.filter((_, rowIndex) => rowIndex !== index) }),
                  )}
                  <Field label="คำถามภาษาไทย">
                    <input className="crm-field" value={faq.q} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((row, rowIndex) => (rowIndex === index ? { ...row, q: event.target.value } : row)) })} />
                  </Field>
                  <Field label="คำตอบภาษาไทย">
                    <textarea className="crm-area" rows={3} value={faq.a} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((row, rowIndex) => (rowIndex === index ? { ...row, a: event.target.value } : row)) })} />
                  </Field>
                  <Field label="คำถามภาษาอังกฤษ">
                    <input className="crm-field" value={faq.qEn} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((row, rowIndex) => (rowIndex === index ? { ...row, qEn: event.target.value } : row)) })} />
                  </Field>
                  <Field label="คำตอบภาษาอังกฤษ">
                    <textarea className="crm-area" rows={3} value={faq.aEn} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((row, rowIndex) => (rowIndex === index ? { ...row, aEn: event.target.value } : row)) })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, faqs: [...content.faqs, { id: newDirectBookingItemId("faq"), q: "", a: "", qEn: "", aEn: "" }] })}>เพิ่ม FAQ</button>
            </section>
          ) : null}

          {tab === "seo" ? (
            <section className="crm-cms-panel">
              <Field label="Canonical URL">
                <input className="crm-field" value={content.seo.canonical} onChange={(event) => patchContent({ ...content, seo: { ...content.seo, canonical: event.target.value } })} />
              </Field>
              {content.seo.variants.map((item, index) => (
                <div key={`${item.locale}-${index}`} className="crm-cs-metric">
                  <h3>ภาษา {item.locale || index + 1}</h3>
                  {listActions(
                    index,
                    content.seo.variants.length,
                    () => patchContent({ ...content, seo: { ...content.seo, variants: moveItem(content.seo.variants, index, -1) } }),
                    () => patchContent({ ...content, seo: { ...content.seo, variants: moveItem(content.seo.variants, index, 1) } }),
                    () => patchContent({ ...content, seo: { ...content.seo, variants: content.seo.variants.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                  <Field label="รหัสภาษา">
                    <input className="crm-field" value={item.locale} onChange={(event) => patchContent({ ...content, seo: { ...content.seo, variants: content.seo.variants.map((row, rowIndex) => (rowIndex === index ? { ...row, locale: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="URL">
                    <input className="crm-field" value={item.href} onChange={(event) => patchContent({ ...content, seo: { ...content.seo, variants: content.seo.variants.map((row, rowIndex) => (rowIndex === index ? { ...row, href: event.target.value } : row)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, seo: { ...content.seo, variants: [...content.seo.variants, { locale: "", href: "" }] } })}>เพิ่ม language variant</button>
              <VisualFields slot="social" visual={content.seo.social} hint="รูปแชร์โซเชียล 1200 × 630 px ถ้ามีต้องมี alt ไทยและอังกฤษ" />
            </section>
          ) : null}

          {tab === "publish" ? (
            <section className="crm-cms-panel">
              <p className="crm-contact-image-hint">สถานะปัจจุบัน: {meta.status} · อัปเดตล่าสุด {updatedAt || "—"}</p>
              <p className="crm-contact-image-hint">
                หน้าสาธารณะ: <a href={publicHref}>{publicHref}</a>
              </p>
              <p className="crm-contact-image-hint">
                ตัวอย่างในระบบ: <a href={previewHref}>{previewHref}</a>
              </p>
              <Field label="Title ในระบบ">
                <input className="crm-field" name="title" value={meta.title} onChange={(event) => { setMeta((current) => ({ ...current, title: event.target.value })); markDirty(); }} />
              </Field>
              <Field label="SEO title" hint="จำเป็นก่อนเผยแพร่">
                <input className="crm-field" name="seoTitle" value={meta.seoTitle} onChange={(event) => { setMeta((current) => ({ ...current, seoTitle: event.target.value })); markDirty(); }} />
              </Field>
              <Field label="Meta description" hint="จำเป็นก่อนเผยแพร่">
                <textarea className="crm-area" name="metaDescription" rows={3} value={meta.metaDescription} onChange={(event) => { setMeta((current) => ({ ...current, metaDescription: event.target.value })); markDirty(); }} />
              </Field>
              <Field label="Excerpt">
                <textarea className="crm-area" name="excerpt" rows={2} value={meta.excerpt} onChange={(event) => { setMeta((current) => ({ ...current, excerpt: event.target.value })); markDirty(); }} />
              </Field>
              <Field label="Canonical URL">
                <input className="crm-field" value={content.seo.canonical} onChange={(event) => patchContent({ ...content, seo: { ...content.seo, canonical: event.target.value } })} />
              </Field>
              <label className="crm-cms-field">
                <span>เผยแพร่สองภาษา (ไทยและอังกฤษ)</span>
                <input type="checkbox" checked={content.bilingualPublish} onChange={(event) => patchContent({ ...content, bilingualPublish: event.target.checked })} />
              </label>
              <h3>Language variants</h3>
              <ul className="crm-contact-image-hint">
                {content.seo.variants.map((item) => (
                  <li key={`${item.locale}-${item.href}`}>
                    {item.locale} · {item.href}
                  </li>
                ))}
              </ul>
              <h3>สำเนาภาษาในระบบ</h3>
              <ul className="crm-contact-image-hint">
                {locales.map((item) => (
                  <li key={item.id}>
                    {item.locale} · {item.status} · {item.title}
                  </li>
                ))}
              </ul>
              <button type="button" className="crm-users-secondary" onClick={() => setDialog("duplicate")} disabled={pending}>
                คัดลอกไปภาษาอื่นเพื่อแปล
              </button>
              <h3>การอนุมัติก่อนเผยแพร่</h3>
              {([
                ["clientNames", "ชื่อลูกค้า"],
                ["projectNames", "ชื่อโปรเจกต์"],
                ["prices", "ราคา"],
                ["bookingValues", "ยอดจอง"],
                ["logos", "โลโก้"],
              ] as const).map(([key, label]) => (
                <label key={key} className="crm-cms-field">
                  <span>อนุมัติเผยแพร่{label}</span>
                  <input
                    type="checkbox"
                    checked={content.approvals[key]}
                    onChange={(event) => patchContent({ ...content, approvals: { ...content.approvals, [key]: event.target.checked } })}
                  />
                </label>
              ))}
            </section>
          ) : null}
        </div>
        {saveBar}
      </form>
      {dialog === "unpublish" ? (
        <div className="crm-modal">
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby="direct-bookings-unpublish-title">
            <h2 id="direct-bookings-unpublish-title">ยกเลิกเผยแพร่</h2>
            <p>หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ด จนกว่าจะเผยแพร่อีกครั้ง</p>
            <div className="crm-cs-savebar">
              <button type="button" className="kpi-button" onClick={() => { setDialog(null); submit("unpublish"); }}>
                ยืนยันยกเลิกเผยแพร่
              </button>
              <button type="button" className="crm-users-secondary" onClick={() => setDialog(null)}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {dialog === "duplicate" ? (
        <div className="crm-modal">
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby="direct-bookings-duplicate-title">
            <h2 id="direct-bookings-duplicate-title">คัดลอกไปภาษาอื่นเพื่อแปล</h2>
            <p>สร้างฉบับร่างในภาษาที่เลือกจากเนื้อหาปัจจุบัน ไม่ได้เผยแพร่ทันที</p>
            <Field label="ภาษาปลายทาง">
              <select className="crm-field" value={targetLocale} onChange={(event) => setTargetLocale(event.target.value)}>
                {LOCALE_OPTIONS.filter((item) => item.id !== meta.locale).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="crm-cs-savebar">
              <button type="button" className="kpi-button" onClick={() => { setDialog(null); duplicateToLocale(); }}>
                สร้างฉบับร่าง
              </button>
              <button type="button" className="crm-users-secondary" onClick={() => setDialog(null)}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function KpiFields({
  kpi,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  kpi: CmsDirectBookingKpi;
  index: number;
  total: number;
  onChange: (kpi: CmsDirectBookingKpi) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="crm-cs-metric">
      <h3>{kpi.name || `KPI ${index + 1}`}</h3>
      <div className="crm-cs-metric-actions">
        <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => onMove(-1)}>ขึ้น</button>
        <button type="button" className="crm-users-secondary" disabled={index === total - 1} onClick={() => onMove(1)}>ลง</button>
        <button type="button" className="crm-users-secondary" onClick={onRemove}>ลบ</button>
      </div>
      <Field label="ชื่อ">
        <input className="crm-field" value={kpi.name} onChange={(event) => onChange({ ...kpi, name: event.target.value })} />
      </Field>
      <Field label="กลุ่ม">
        <select className="crm-field" value={kpi.group} onChange={(event) => onChange({ ...kpi, group: event.target.value })}>
          <option value="visit">Visit</option>
          <option value="interest">Interest</option>
          <option value="start">Start</option>
          <option value="complete">Complete</option>
        </select>
      </Field>
      <Field label="ช่วงเวลา">
        <input className="crm-field" value={kpi.period} onChange={(event) => onChange({ ...kpi, period: event.target.value })} />
      </Field>
      <Field label="หน่วย">
        <input className="crm-field" value={kpi.unit} onChange={(event) => onChange({ ...kpi, unit: event.target.value })} />
      </Field>
      <Field label="คำนิยาม">
        <textarea className="crm-area" rows={2} value={kpi.definition} onChange={(event) => onChange({ ...kpi, definition: event.target.value })} />
      </Field>
      <Field label="เปรียบเทียบ / เป้าหมาย">
        <input className="crm-field" value={kpi.comparison} onChange={(event) => onChange({ ...kpi, comparison: event.target.value })} />
      </Field>
      <Field label="ค่าเป้าหมายแผนภูมิ">
        <input className="crm-field" value={kpi.target} onChange={(event) => onChange({ ...kpi, target: event.target.value })} />
      </Field>
      <Field label="โรงแรม / ตลาด">
        <input className="crm-field" value={kpi.market} onChange={(event) => onChange({ ...kpi, market: event.target.value })} />
      </Field>
      <Field label="ที่มา">
        <input className="crm-field" value={kpi.source} onChange={(event) => onChange({ ...kpi, source: event.target.value })} />
      </Field>
      <Field label="URL แหล่งที่มา">
        <input className="crm-field" value={kpi.sourceUrl} onChange={(event) => onChange({ ...kpi, sourceUrl: event.target.value })} />
      </Field>
      <Field label="ป้ายแกนแผนภูมิ คั่นด้วยจุลภาค">
        <input className="crm-field" value={kpi.labels.join(", ")} onChange={(event) => onChange({ ...kpi, labels: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} />
      </Field>
      <Field label="ค่าแผนภูมิ คั่นด้วยจุลภาค">
        <input className="crm-field" value={kpi.values.join(", ")} onChange={(event) => onChange({ ...kpi, values: event.target.value.split(",").map((item) => Number(item.trim())).filter((item) => Number.isFinite(item)) })} />
      </Field>
      <Field label="ค่าที่แสดง" hint="เว้นว่างและซ่อนจนกว่าจะมีข้อมูลที่อนุมัติ ข้อมูลตัวอย่างต้องมีสถานะ Sample">
        <input className="crm-field" value={kpi.value} onChange={(event) => onChange({ ...kpi, value: event.target.value })} />
      </Field>
      <Field label="สถานะข้อมูล">
        <select className="crm-field" value={kpi.dataStatus} onChange={(event) => onChange({ ...kpi, dataStatus: event.target.value as DirectBookingKpiStatus })}>
          {DIRECT_BOOKING_CMS_KPI_STATUSES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </Field>
      <Field label="วันที่อัปเดต">
        <input className="crm-field" value={kpi.updatedAt} onChange={(event) => onChange({ ...kpi, updatedAt: event.target.value })} />
      </Field>
      <label className="crm-cms-field">
        <span>ซ่อนจนกว่าจะมีข้อมูลจริง</span>
        <input type="checkbox" checked={kpi.hideUntilData} onChange={(event) => onChange({ ...kpi, hideUntilData: event.target.checked })} />
      </label>
    </div>
  );
}

function RelatedFields({
  card,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  card: CmsDirectBookingRelatedCard;
  index: number;
  total: number;
  onChange: (card: CmsDirectBookingRelatedCard) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="crm-cs-metric">
      <h3>{card.title || `การ์ด ${index + 1}`}</h3>
      <div className="crm-cs-metric-actions">
        <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => onMove(-1)}>ขึ้น</button>
        <button type="button" className="crm-users-secondary" disabled={index === total - 1} onClick={() => onMove(1)}>ลง</button>
        <button type="button" className="crm-users-secondary" onClick={onRemove}>ลบ</button>
      </div>
      <Field label="หัวข้อ">
        <input className="crm-field" value={card.title} onChange={(event) => onChange({ ...card, title: event.target.value })} />
      </Field>
      <Field label="ลิงก์">
        <input className="crm-field" value={card.href} onChange={(event) => onChange({ ...card, href: event.target.value })} />
      </Field>
      <Field label="คำอธิบายสั้น">
        <textarea className="crm-area" rows={2} value={card.body} onChange={(event) => onChange({ ...card, body: event.target.value })} />
      </Field>
      <Field label="ปุ่ม">
        <input className="crm-field" value={card.cta} onChange={(event) => onChange({ ...card, cta: event.target.value })} />
      </Field>
      <label className="crm-cms-field">
        <span>การ์ดเด่น</span>
        <input type="checkbox" checked={card.featured} onChange={(event) => onChange({ ...card, featured: event.target.checked })} />
      </label>
      <label className="crm-cms-field">
        <span>อนุมัติเผยแพร่ชื่อลูกค้า/โปรเจกต์</span>
        <input type="checkbox" checked={card.publicationApproved} onChange={(event) => onChange({ ...card, publicationApproved: event.target.checked })} />
      </label>
    </div>
  );
}
