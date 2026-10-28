"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  WEBSITE_CMS_KPI_STATUSES,
  WEBSITE_CMS_SOURCE_STATUSES,
  WEBSITE_CMS_TRACKING_STATUSES,
  newWebsiteItemId,
  websiteCmsErrorMessage,
  websiteCmsNotice,
  type CmsHotelWebsitePage,
  type CmsWebsiteKpi,
  type CmsWebsiteRelatedCard,
  type CmsWebsiteVisual,
  type WebsiteCmsIntent,
  type WebsiteCmsSaveResult,
  type WebsiteEditorState,
} from "@/lib/cms/hotel-website-page";
import type { WebsiteKpiStatus, WebsiteTrackingEventStatus, WebsiteVisualStatus } from "@/lib/hotel-website";

const VISUAL_STATUS_OPTIONS: Array<{ value: WebsiteVisualStatus; label: string }> = [
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
  { id: "readiness", label: "Website Readiness" },
  { id: "framework", label: "Service Framework" },
  { id: "cms", label: "CMS / Technology" },
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
type VisualSlot = "hero" | "confidence" | "readiness" | "framework" | "cms" | "rebuild" | "workflow" | "kpis" | "related" | "social";

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

export function HotelWebsitePageEditor({
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
  initial: WebsiteEditorState;
  notice?: string;
  error?: string;
  saveAction: (formData: FormData) => Promise<WebsiteCmsSaveResult>;
  duplicateAction: (formData: FormData) => Promise<WebsiteCmsSaveResult>;
  updatedAt?: string;
  initialTab?: string;
  previewHref: string;
  publicHref: string;
  locales?: Array<{ id: string; locale: string; status: string; title: string }>;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [tab, setTab] = useState<Tab>(isTab(initialTab) ? initialTab : "hero");
  const [meta, setMeta] = useState({
    title: initial.title,
    seoTitle: initial.seoTitle,
    metaDescription: initial.metaDescription,
    excerpt: initial.excerpt,
    locale: initial.locale,
    status: initial.status,
  });
  const [content, setContent] = useState<CmsHotelWebsitePage>(initial.content);
  const [status, setStatus] = useState(error ? websiteCmsErrorMessage(error) : "");
  const [ok, setOk] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<"unpublish" | "duplicate" | null>(null);
  const [targetLocale, setTargetLocale] = useState("en");
  const [dirty, setDirty] = useState(false);
  const [previews, setPreviews] = useState<Record<VisualSlot, string>>({
    hero: initial.content.hero.visual.src,
    confidence: initial.content.confidence.visual.src,
    readiness: initial.content.readiness.visual.src,
    framework: initial.content.framework.visual.src,
    cms: initial.content.cms.visual.src,
    rebuild: initial.content.rebuild.visual.src,
    workflow: initial.content.workflow.visual.src,
    kpis: initial.content.measure.visual.src,
    related: initial.content.related.visual.src,
    social: initial.content.seo.social.src,
  });
  const [clears, setClears] = useState<Record<VisualSlot, boolean>>({
    hero: false,
    confidence: false,
    readiness: false,
    framework: false,
    cms: false,
    rebuild: false,
    workflow: false,
    kpis: false,
    related: false,
    social: false,
  });

  function markDirty() {
    setDirty(true);
    setOk("");
  }

  function patchContent(next: CmsHotelWebsitePage) {
    setContent(next);
    markDirty();
  }

  function patchVisual(slot: VisualSlot, visual: CmsWebsiteVisual) {
    if (slot === "hero") patchContent({ ...content, hero: { ...content.hero, visual } });
    else if (slot === "confidence") patchContent({ ...content, confidence: { ...content.confidence, visual } });
    else if (slot === "readiness") patchContent({ ...content, readiness: { ...content.readiness, visual } });
    else if (slot === "framework") patchContent({ ...content, framework: { ...content.framework, visual } });
    else if (slot === "cms") patchContent({ ...content, cms: { ...content.cms, visual } });
    else if (slot === "rebuild") patchContent({ ...content, rebuild: { ...content.rebuild, visual } });
    else if (slot === "workflow") patchContent({ ...content, workflow: { ...content.workflow, visual } });
    else if (slot === "kpis") patchContent({ ...content, measure: { ...content.measure, visual } });
    else if (slot === "related") patchContent({ ...content, related: { ...content.related, visual } });
    else patchContent({ ...content, seo: { ...content.seo, social: visual } });
  }

  function VisualFields({ slot, fileName, visual, hint }: { slot: VisualSlot; fileName: string; visual: CmsWebsiteVisual; hint: string }) {
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
            value={visual.status === "placeholder" ? "replace" : visual.status === "real" ? "approved" : visual.status}
            onChange={(event) => patchVisual(slot, { ...visual, status: event.target.value as WebsiteVisualStatus })}
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
            name={fileName}
            accept=".jpg,.jpeg,.png,.webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setPreviews((current) => ({ ...current, [slot]: URL.createObjectURL(file) }));
              setClears((current) => ({ ...current, [slot]: false }));
              if (visual.status === "placeholder") patchVisual(slot, { ...visual, status: "sample" });
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

  function submit(intent: WebsiteCmsIntent) {
    const node = formRef.current;
    if (!node) return;
    const data = new FormData(node);
    data.set("intent", intent);
    data.set("contentJson", JSON.stringify(content));
    if (clears.hero) data.set("clearHeroImage", "1");
    if (clears.confidence) data.set("clearConfidenceImage", "1");
    if (clears.readiness) data.set("clearReadinessImage", "1");
    if (clears.framework) data.set("clearFrameworkImage", "1");
    if (clears.cms) data.set("clearCmsImage", "1");
    if (clears.rebuild) data.set("clearRebuildImage", "1");
    if (clears.workflow) data.set("clearWorkflowImage", "1");
    if (clears.kpis) data.set("clearKpiImage", "1");
    if (clears.related) data.set("clearRelatedImage", "1");
    if (clears.social) data.set("clearOgImage", "1");
    startTransition(async () => {
      setOk("");
      setStatus("");
      const result = await saveAction(data);
      if (!result.ok) {
        setStatus(websiteCmsErrorMessage(result.error));
        return;
      }
      if (intent === "publish") setMeta((current) => ({ ...current, status: "published" }));
      if (intent === "draft" || intent === "unpublish") setMeta((current) => ({ ...current, status: "draft" }));
      setOk(intent === "preview" ? websiteCmsNotice("preview") : websiteCmsNotice("saved"));
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
        setStatus(websiteCmsErrorMessage(result.error));
        return;
      }
      setOk(websiteCmsNotice("duplicate"));
      setDirty(false);
      router.push(`/crm/cms/pages/${result.id}?tab=faq`);
    });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = (submitter?.value as WebsiteCmsIntent) || "save";
    if (intent === "unpublish") {
      setDialog("unpublish");
      return;
    }
    submit(intent);
  }

  const saveButtons = (
    <>
      <button className="kpi-button" type="submit" name="intent" value="save" disabled={pending}>
        {pending ? websiteCmsNotice("pending") : "บันทึก / Save"}
      </button>
      <button className="crm-users-secondary" type="submit" name="intent" value="draft" disabled={pending}>
        บันทึกฉบับร่าง
      </button>
      <button className="crm-users-secondary" type="submit" name="intent" value="preview" disabled={pending}>
        บันทึกแล้วดูตัวอย่าง
      </button>
    </>
  );
  const stateClass = status ? " is-error" : dirty ? " is-dirty" : ok ? " is-ok" : "";
  const saveBar = (
    <div className="crm-cs-savebar">
      {saveButtons}
      <p className={`crm-cs-save-state${stateClass}`} role="status">
        {pending ? websiteCmsNotice("pending") : status || (dirty ? websiteCmsNotice("dirty") : ok || websiteCmsNotice("ready"))}
      </p>
    </div>
  );

  return (
    <div className="crm-cms-editor">
      <nav className="crm-cms-tabs" role="tablist" aria-label="ส่วนของหน้า Hotel Website Design">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            id={`hotel-website-cms-tab-${item.id}`}
            role="tab"
            aria-selected={tab === item.id}
            aria-controls="hotel-website-cms-panel"
            className={tab === item.id ? "is-active" : ""}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <form ref={formRef} className="crm-cms-form" onSubmit={onSubmit}>
        <input type="hidden" name="id" value={initial.id} />
        <input type="hidden" name="locale" value={meta.locale} />
        {saveBar}
        <div id="hotel-website-cms-panel" role="tabpanel" aria-labelledby={`hotel-website-cms-tab-${tab}`}>
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
              <VisualFields slot="hero" fileName="heroImageFile" visual={content.hero.visual} hint="Dummy 1600 × 1000 px · แสดงประมาณ 560 × 350 px · 8:5 · ตัวอย่าง Hotel Website และ Direct Booking Flow · ห้ามใช้ภาพเดียวกับส่วนความมั่นใจ" />
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
                  <div className="crm-cs-metric-actions">
                    <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => patchContent({ ...content, confidence: { ...content.confidence, sources: moveItem(content.confidence.sources, index, -1) } })}>ขึ้น</button>
                    <button type="button" className="crm-users-secondary" disabled={index === content.confidence.sources.length - 1} onClick={() => patchContent({ ...content, confidence: { ...content.confidence, sources: moveItem(content.confidence.sources, index, 1) } })}>ลง</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, confidence: { ...content.confidence, sources: content.confidence.sources.filter((_, rowIndex) => rowIndex !== index) } })}>ลบ</button>
                  </div>
                  <Field label="ชื่อ">
                    <input className="crm-field" value={source.name} onChange={(event) => {
                      const sources = content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, name: event.target.value } : row));
                      patchContent({ ...content, confidence: { ...content.confidence, sources } });
                    }} />
                  </Field>
                  <Field label="URL">
                    <input className="crm-field" value={source.url} onChange={(event) => {
                      const sources = content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, url: event.target.value } : row));
                      patchContent({ ...content, confidence: { ...content.confidence, sources } });
                    }} />
                  </Field>
                  <Field label="วันที่เผยแพร่">
                    <input className="crm-field" value={source.publishedAt} onChange={(event) => {
                      const sources = content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, publishedAt: event.target.value } : row));
                      patchContent({ ...content, confidence: { ...content.confidence, sources } });
                    }} />
                  </Field>
                  <Field label="วันที่เข้าถึง">
                    <input className="crm-field" value={source.accessedAt} onChange={(event) => {
                      const sources = content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, accessedAt: event.target.value } : row));
                      patchContent({ ...content, confidence: { ...content.confidence, sources } });
                    }} />
                  </Field>
                  <Field label="ตลาด">
                    <input className="crm-field" value={source.market} onChange={(event) => {
                      const sources = content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, market: event.target.value } : row));
                      patchContent({ ...content, confidence: { ...content.confidence, sources } });
                    }} />
                  </Field>
                  <Field label="ช่วงเวลา">
                    <input className="crm-field" value={source.period} onChange={(event) => {
                      const sources = content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, period: event.target.value } : row));
                      patchContent({ ...content, confidence: { ...content.confidence, sources } });
                    }} />
                  </Field>
                  <Field label="คำนิยาม">
                    <textarea className="crm-area" rows={2} value={source.definition} onChange={(event) => {
                      const sources = content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, definition: event.target.value } : row));
                      patchContent({ ...content, confidence: { ...content.confidence, sources } });
                    }} />
                  </Field>
                  <Field label="สถานะข้อมูล">
                    <select className="crm-field" value={source.status} onChange={(event) => {
                      const sources = content.confidence.sources.map((row, rowIndex) => (rowIndex === index ? { ...row, status: event.target.value } : row));
                      patchContent({ ...content, confidence: { ...content.confidence, sources } });
                    }}>
                      {WEBSITE_CMS_SOURCE_STATUSES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    confidence: {
                      ...content.confidence,
                      sources: [...content.confidence.sources, { name: "", url: "", publishedAt: "", accessedAt: "", market: "", period: "", definition: "", status: "guidance" }],
                    },
                  })
                }
              >
                เพิ่มแหล่งที่มา
              </button>
              <VisualFields slot="confidence" fileName="confidenceImageFile" visual={content.confidence.visual} hint="Dummy 1200 × 800 px · แสดงประมาณ 480 × 320 px · 3:2 · ตัวอย่างข้อมูลที่ช่วยสร้างความมั่นใจก่อนจอง · ห้ามใช้ภาพ Hero" />
            </section>
          ) : null}

          {tab === "readiness" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.readiness.title} onChange={(event) => patchContent({ ...content, readiness: { ...content.readiness, title: event.target.value } })} />
              </Field>
              {content.readiness.rows.map((row, index) => (
                <div key={row.id} className="crm-cs-metric">
                  <h3>{row.question || `แถว ${index + 1}`}</h3>
                  <div className="crm-cs-metric-actions">
                    <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => patchContent({ ...content, readiness: { ...content.readiness, rows: moveItem(content.readiness.rows, index, -1) } })}>ขึ้น</button>
                    <button type="button" className="crm-users-secondary" disabled={index === content.readiness.rows.length - 1} onClick={() => patchContent({ ...content, readiness: { ...content.readiness, rows: moveItem(content.readiness.rows, index, 1) } })}>ลง</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, readiness: { ...content.readiness, rows: content.readiness.rows.filter((_, rowIndex) => rowIndex !== index) } })}>ลบ</button>
                  </div>
                  <Field label="คำถาม">
                    <input className="crm-field" value={row.question} onChange={(event) => {
                      const rows = content.readiness.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, question: event.target.value } : item));
                      patchContent({ ...content, readiness: { ...content.readiness, rows, items: rows.map((item) => item.question) } });
                    }} />
                  </Field>
                  <Field label="หลักฐานที่ควรแสดง">
                    <textarea className="crm-area" rows={2} value={row.evidence} onChange={(event) => {
                      const rows = content.readiness.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, evidence: event.target.value } : item));
                      patchContent({ ...content, readiness: { ...content.readiness, rows } });
                    }} />
                  </Field>
                  <Field label="สถานะปัจจุบัน">
                    <input className="crm-field" value={row.status} onChange={(event) => {
                      const rows = content.readiness.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, status: event.target.value } : item));
                      patchContent({ ...content, readiness: { ...content.readiness, rows } });
                    }} />
                  </Field>
                  <Field label="แนวทางที่แนะนำ">
                    <textarea className="crm-area" rows={2} value={row.action} onChange={(event) => {
                      const rows = content.readiness.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, action: event.target.value } : item));
                      patchContent({ ...content, readiness: { ...content.readiness, rows } });
                    }} />
                  </Field>
                  <Field label="ผลลัพธ์">
                    <input className="crm-field" value={row.output} onChange={(event) => {
                      const rows = content.readiness.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, output: event.target.value } : item));
                      patchContent({ ...content, readiness: { ...content.readiness, rows } });
                    }} />
                  </Field>
                </div>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => {
                  const rows = [...content.readiness.rows, { id: newWebsiteItemId("ready"), question: "", evidence: "", status: "", action: "", output: "" }];
                  patchContent({ ...content, readiness: { ...content.readiness, rows, items: rows.map((item) => item.question) } });
                }}
              >
                เพิ่มแถว
              </button>
              <VisualFields slot="readiness" fileName="readinessImageFile" visual={content.readiness.visual} hint="หน้าสาธารณะใช้ตาราง HTML Hotel Website Readiness Checklist — Sample ไม่ใช้ภาพสต็อก ถ้ามีไฟล์ 1600×900 เป็นทางเลือกเท่านั้น" />
            </section>
          ) : null}

          {tab === "framework" ? (
            <section className="crm-cms-panel">
              <p className="crm-contact-image-hint">หน้าสาธารณะใช้กรอบ HTML Hotel Website Service Framework — Sample และเส้นทาง Strategy → UX → Build → Tracking → Handover ไม่ใช้ภาพทีมงาน ถ้ามีไฟล์ 1600×900 ที่ /images/hotel-website-service-framework-placeholder.webp เป็นทางเลือกเท่านั้น</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.framework.title} onChange={(event) => patchContent({ ...content, framework: { ...content.framework, title: event.target.value } })} />
              </Field>
              {content.framework.steps.map((step, index) => (
                <div key={step.num || index} className="crm-cs-metric">
                  <h3>{step.num} {step.title || `ขั้นตอน ${index + 1}`}</h3>
                  <div className="crm-cs-metric-actions">
                    <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => patchContent({ ...content, framework: { ...content.framework, steps: moveItem(content.framework.steps, index, -1) } })}>ขึ้น</button>
                    <button type="button" className="crm-users-secondary" disabled={index === content.framework.steps.length - 1} onClick={() => patchContent({ ...content, framework: { ...content.framework, steps: moveItem(content.framework.steps, index, 1) } })}>ลง</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, framework: { ...content.framework, steps: content.framework.steps.filter((_, rowIndex) => rowIndex !== index) } })}>ลบ</button>
                  </div>
                  <Field label="หัวข้อย่อย">
                    <input className="crm-field" value={step.title} onChange={(event) => {
                      const steps = content.framework.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, title: event.target.value } : row));
                      patchContent({ ...content, framework: { ...content.framework, steps } });
                    }} />
                  </Field>
                  <Field label="ขั้นในเส้นทาง">
                    <input className="crm-field" value={step.stage} onChange={(event) => {
                      const steps = content.framework.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, stage: event.target.value } : row));
                      patchContent({ ...content, framework: { ...content.framework, steps } });
                    }} />
                  </Field>
                  <Field label="ข้อมูลตั้งต้น (Input)">
                    <textarea className="crm-area" rows={2} value={step.input} onChange={(event) => {
                      const steps = content.framework.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, input: event.target.value } : row));
                      patchContent({ ...content, framework: { ...content.framework, steps } });
                    }} />
                  </Field>
                  <Field label="สิ่งที่ทำ (Action)">
                    <textarea className="crm-area" rows={3} value={step.action} onChange={(event) => {
                      const steps = content.framework.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, action: event.target.value } : row));
                      patchContent({ ...content, framework: { ...content.framework, steps } });
                    }} />
                  </Field>
                  <Field label="ผลลัพธ์ (Output)">
                    <input className="crm-field" value={step.output} onChange={(event) => {
                      const steps = content.framework.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, output: event.target.value } : row));
                      patchContent({ ...content, framework: { ...content.framework, steps } });
                    }} />
                  </Field>
                  <Field label="จุดที่โรงแรมอนุมัติ">
                    <textarea className="crm-area" rows={2} value={step.approval} onChange={(event) => {
                      const steps = content.framework.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, approval: event.target.value } : row));
                      patchContent({ ...content, framework: { ...content.framework, steps } });
                    }} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, framework: { ...content.framework, steps: [...content.framework.steps, { id: newWebsiteItemId("pillar"), num: String(content.framework.steps.length + 1).padStart(2, "0"), stage: "", title: "", input: "", action: "", output: "", approval: "" }] } })}>เพิ่มด้านบริการ</button>
              <VisualFields slot="framework" fileName="frameworkImageFile" visual={content.framework.visual} hint="Dummy 1600 × 900 px · แสดงประมาณ 720 × 405 px · 16:9 · Hotel Website Service Framework — Sample" />
            </section>
          ) : null}

          {tab === "cms" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.cms.title} onChange={(event) => patchContent({ ...content, cms: { ...content.cms, title: event.target.value } })} />
              </Field>
              <Field label="เนื้อหา">
                <textarea className="crm-area" rows={4} value={content.cms.body} onChange={(event) => patchContent({ ...content, cms: { ...content.cms, body: event.target.value } })} />
              </Field>
              <Field label="CMS / WordPress">
                <textarea className="crm-area" rows={3} value={content.cms.wordpress} onChange={(event) => patchContent({ ...content, cms: { ...content.cms, wordpress: event.target.value } })} />
              </Field>
              <Field label="เครื่องมือพัฒนา">
                <textarea className="crm-area" rows={3} value={content.cms.tools} onChange={(event) => patchContent({ ...content, cms: { ...content.cms, tools: event.target.value } })} />
              </Field>
              <Field label="หมายเหตุ Technology Fit">
                <textarea className="crm-area" rows={2} value={content.cms.note} onChange={(event) => patchContent({ ...content, cms: { ...content.cms, note: event.target.value } })} />
              </Field>
              <Field label="ข้อความจำกัดความรับผิด">
                <textarea className="crm-area" rows={2} value={content.cms.disclaimer} onChange={(event) => patchContent({ ...content, cms: { ...content.cms, disclaimer: event.target.value } })} />
              </Field>
              {content.cms.rows.map((row, index) => (
                <div key={row.id} className="crm-cs-metric">
                  <h3>{row.need || `แถว ${index + 1}`}</h3>
                  <div className="crm-cs-metric-actions">
                    <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => patchContent({ ...content, cms: { ...content.cms, rows: moveItem(content.cms.rows, index, -1) } })}>ขึ้น</button>
                    <button type="button" className="crm-users-secondary" disabled={index === content.cms.rows.length - 1} onClick={() => patchContent({ ...content, cms: { ...content.cms, rows: moveItem(content.cms.rows, index, 1) } })}>ลง</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, cms: { ...content.cms, rows: content.cms.rows.filter((_, rowIndex) => rowIndex !== index) } })}>ลบ</button>
                  </div>
                  <Field label="ความต้องการ">
                    <input className="crm-field" value={row.need} onChange={(event) => patchContent({ ...content, cms: { ...content.cms, rows: content.cms.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, need: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ตัวเลือกที่เป็นไปได้">
                    <textarea className="crm-area" rows={2} value={row.option} onChange={(event) => patchContent({ ...content, cms: { ...content.cms, rows: content.cms.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, option: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="เหมาะเมื่อ">
                    <textarea className="crm-area" rows={2} value={row.suitable} onChange={(event) => patchContent({ ...content, cms: { ...content.cms, rows: content.cms.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, suitable: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สิ่งที่ต้องตรวจ">
                    <textarea className="crm-area" rows={2} value={row.verify} onChange={(event) => patchContent({ ...content, cms: { ...content.cms, rows: content.cms.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, verify: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="กรรมสิทธิ์หลังส่งมอบ">
                    <input className="crm-field" value={row.ownership} onChange={(event) => patchContent({ ...content, cms: { ...content.cms, rows: content.cms.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, ownership: event.target.value } : item)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, cms: { ...content.cms, rows: [...content.cms.rows, { id: newWebsiteItemId("fit"), need: "", option: "", suitable: "", verify: "", ownership: "" }] } })}>เพิ่มแถว Technology Fit</button>
              <VisualFields slot="cms" fileName="cmsImageFile" visual={content.cms.visual} hint="หน้าสาธารณะใช้ตาราง HTML Technology Fit Matrix และเส้นทาง Content / CMS → Website Frontend → Booking Engine → Analytics/Search/CRM → Hotel Team Ownership ไม่ใช้กำแพงโลโก้ ถ้ามีไฟล์ 1600×900 ที่ /images/hotel-website-cms-stack-placeholder.webp เป็นทางเลือกเท่านั้น" />
            </section>
          ) : null}

          {tab === "rebuild" ? (
            <section className="crm-cms-panel">
              <p className="crm-contact-image-hint">หน้าสาธารณะใช้ตาราง HTML Improve Existing Website vs Build New Website — Sample และเส้นทาง Audit Existing System → Review Content/Mobile/Speed/Booking/Tracking → Estimate Effort and Risk → Choose Improve or Rebuild ไม่ใช้ภาพก่อน-หลังหรือตัวเลขการจอง ถ้ามีไฟล์ 1600×900 ที่ /images/hotel-website-build-vs-improve-placeholder.webp เป็นทางเลือกเท่านั้น</p>
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
                  <div className="crm-cs-metric-actions">
                    <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => patchContent({ ...content, rebuild: { ...content.rebuild, paths: moveItem(content.rebuild.paths, index, -1) } })}>ขึ้น</button>
                    <button type="button" className="crm-users-secondary" disabled={index === content.rebuild.paths.length - 1} onClick={() => patchContent({ ...content, rebuild: { ...content.rebuild, paths: moveItem(content.rebuild.paths, index, 1) } })}>ลง</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, rebuild: { ...content.rebuild, paths: content.rebuild.paths.filter((_, rowIndex) => rowIndex !== index) } })}>ลบ</button>
                  </div>
                  <Field label="หัวข้อ">
                    <input className="crm-field" value={path.title} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, paths: content.rebuild.paths.map((item, rowIndex) => (rowIndex === index ? { ...item, title: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="จุดตั้งต้น บรรทัดละข้อ">
                    <textarea className="crm-area" rows={4} value={path.starting.join("\n")} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, paths: content.rebuild.paths.map((item, rowIndex) => (rowIndex === index ? { ...item, starting: event.target.value.split("\n").map((line) => line.trim()).filter(Boolean) } : item)) } })} />
                  </Field>
                  <Field label="ข้อดี">
                    <textarea className="crm-area" rows={2} value={path.advantages} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, paths: content.rebuild.paths.map((item, rowIndex) => (rowIndex === index ? { ...item, advantages: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ความเสี่ยง">
                    <textarea className="crm-area" rows={2} value={path.risks} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, paths: content.rebuild.paths.map((item, rowIndex) => (rowIndex === index ? { ...item, risks: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สิ่งที่ขึ้นกับโรงแรม">
                    <textarea className="crm-area" rows={2} value={path.dependencies} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, paths: content.rebuild.paths.map((item, rowIndex) => (rowIndex === index ? { ...item, dependencies: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="แนวทางถัดไป">
                    <textarea className="crm-area" rows={2} value={path.next} onChange={(event) => patchContent({ ...content, rebuild: { ...content.rebuild, paths: content.rebuild.paths.map((item, rowIndex) => (rowIndex === index ? { ...item, next: event.target.value } : item)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, rebuild: { ...content.rebuild, paths: [...content.rebuild.paths, { id: newWebsiteItemId("path"), title: "", starting: [], advantages: "", risks: "", dependencies: "", next: "" }] } })}>เพิ่มแนวทางเปรียบเทียบ</button>
              <VisualFields slot="rebuild" fileName="rebuildImageFile" visual={content.rebuild.visual} hint="Dummy 1600 × 900 px · แสดงประมาณ 720 × 405 px · 16:9 · Improve Existing Website vs Build New Website — Sample" />
            </section>
          ) : null}

          {tab === "workflow" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.workflow.title} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, title: event.target.value } })} />
              </Field>
              {content.workflow.steps.map((step, index) => (
                <div key={step.num || index} className="crm-cs-metric">
                  <h3>{step.num} {step.title || `ขั้นตอน ${index + 1}`}</h3>
                  <div className="crm-cs-metric-actions">
                    <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => patchContent({ ...content, workflow: { ...content.workflow, steps: moveItem(content.workflow.steps, index, -1) } })}>ขึ้น</button>
                    <button type="button" className="crm-users-secondary" disabled={index === content.workflow.steps.length - 1} onClick={() => patchContent({ ...content, workflow: { ...content.workflow, steps: moveItem(content.workflow.steps, index, 1) } })}>ลง</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.filter((_, rowIndex) => rowIndex !== index) } })}>ลบ</button>
                  </div>
                  <Field label="หัวข้อย่อย">
                    <input className="crm-field" value={step.title} onChange={(event) => {
                      const steps = content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, title: event.target.value } : row));
                      patchContent({ ...content, workflow: { ...content.workflow, steps } });
                    }} />
                  </Field>
                  <Field label="ผู้รับผิดชอบ">
                    <textarea className="crm-area" rows={2} value={step.owner} onChange={(event) => {
                      const steps = content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, owner: event.target.value } : row));
                      patchContent({ ...content, workflow: { ...content.workflow, steps } });
                    }} />
                  </Field>
                  <Field label="ข้อมูลตั้งต้น (Input)">
                    <textarea className="crm-area" rows={2} value={step.input} onChange={(event) => {
                      const steps = content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, input: event.target.value } : row));
                      patchContent({ ...content, workflow: { ...content.workflow, steps } });
                    }} />
                  </Field>
                  <Field label="สิ่งที่ทำ (Action)">
                    <textarea className="crm-area" rows={3} value={step.action} onChange={(event) => {
                      const steps = content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, action: event.target.value } : row));
                      patchContent({ ...content, workflow: { ...content.workflow, steps } });
                    }} />
                  </Field>
                  <Field label="ผลลัพธ์ (Output)">
                    <input className="crm-field" value={step.output} onChange={(event) => {
                      const steps = content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, output: event.target.value } : row));
                      patchContent({ ...content, workflow: { ...content.workflow, steps } });
                    }} />
                  </Field>
                  <Field label="จุดที่โรงแรมอนุมัติ">
                    <textarea className="crm-area" rows={2} value={step.approval} onChange={(event) => {
                      const steps = content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, approval: event.target.value } : row));
                      patchContent({ ...content, workflow: { ...content.workflow, steps } });
                    }} />
                  </Field>
                  <Field label="การตัดสินใจถัดไป">
                    <textarea className="crm-area" rows={2} value={step.next} onChange={(event) => {
                      const steps = content.workflow.steps.map((row, rowIndex) => (rowIndex === index ? { ...row, next: event.target.value } : row));
                      patchContent({ ...content, workflow: { ...content.workflow, steps } });
                    }} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, workflow: { ...content.workflow, steps: [...content.workflow.steps, { id: newWebsiteItemId("step"), num: String(content.workflow.steps.length + 1).padStart(2, "0"), label: "", title: "", owner: "", input: "", action: "", output: "", approval: "", next: "" }] } })}>เพิ่มขั้นตอน</button>
              <h3>รายการตรวจส่งมอบ</h3>
              {content.workflow.handover.map((item, index) => (
                <div key={item.id} className="crm-cs-metric">
                  <div className="crm-cs-metric-actions">
                    <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => patchContent({ ...content, workflow: { ...content.workflow, handover: moveItem(content.workflow.handover, index, -1) } })}>ขึ้น</button>
                    <button type="button" className="crm-users-secondary" disabled={index === content.workflow.handover.length - 1} onClick={() => patchContent({ ...content, workflow: { ...content.workflow, handover: moveItem(content.workflow.handover, index, 1) } })}>ลง</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, workflow: { ...content.workflow, handover: content.workflow.handover.filter((_, rowIndex) => rowIndex !== index) } })}>ลบ</button>
                  </div>
                  <Field label={`รายการ ${index + 1}`}>
                    <input className="crm-field" value={item.label} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, handover: content.workflow.handover.map((row, rowIndex) => (rowIndex === index ? { ...row, label: event.target.value } : row)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, workflow: { ...content.workflow, handover: [...content.workflow.handover, { id: newWebsiteItemId("hand"), label: "" }] } })}>เพิ่มรายการตรวจส่งมอบ</button>
              <VisualFields slot="workflow" fileName="workflowImageFile" visual={content.workflow.visual} hint="หน้าสาธารณะใช้ไทม์ไลน์ HTML Hotel Website Project Workflow — Sample และรายการตรวจส่งมอบ ไม่ใช้ภาพประชุม ถ้ามีไฟล์ 1600×900 ที่ /images/hotel-website-project-workflow-placeholder.webp เป็นทางเลือกเท่านั้น แสดงประมาณ 640×360 px" />
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
              <Field label="หมายเหตุ (คลิกจอง ≠ จองสำเร็จ)">
                <textarea className="crm-area" rows={2} value={content.measure.note} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, note: event.target.value } })} />
              </Field>
              <Field label="ขอบเขตการวัดผล">
                <textarea className="crm-area" rows={3} value={content.measure.tracking.boundary} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, tracking: { ...content.measure.tracking, boundary: event.target.value } } })} />
              </Field>
              <label className="crm-cms-field">
                <span>Booking Engine เชื่อมแล้ว</span>
                <input type="checkbox" checked={content.measure.tracking.bookingEngineConfigured} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, tracking: { ...content.measure.tracking, bookingEngineConfigured: event.target.checked } } })} />
              </label>
              <label className="crm-cms-field">
                <span>Tracking Event พร้อมใช้</span>
                <input type="checkbox" checked={content.measure.tracking.trackingConfigured} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, tracking: { ...content.measure.tracking, trackingConfigured: event.target.checked } } })} />
              </label>
              <p className="crm-contact-image-hint">Booking Outcome เผยแพร่ได้เมื่อทั้งสองข้อถูกตั้งค่าแล้ว ข้อมูลตัวอย่างบนหน้าสาธารณะจะมีป้าย Sample</p>
              {content.measure.tracking.events.map((item, index) => (
                <div key={item.id} className="crm-cs-metric">
                  <h3>{item.name || `อีเวนต์ ${index + 1}`}</h3>
                  <div className="crm-cs-metric-actions">
                    <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => patchContent({ ...content, measure: { ...content.measure, tracking: { ...content.measure.tracking, events: moveItem(content.measure.tracking.events, index, -1) } } })}>ขึ้น</button>
                    <button type="button" className="crm-users-secondary" disabled={index === content.measure.tracking.events.length - 1} onClick={() => patchContent({ ...content, measure: { ...content.measure, tracking: { ...content.measure.tracking, events: moveItem(content.measure.tracking.events, index, 1) } } })}>ลง</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, measure: { ...content.measure, tracking: { ...content.measure.tracking, events: content.measure.tracking.events.filter((_, rowIndex) => rowIndex !== index) } } })}>ลบ</button>
                  </div>
                  <Field label="ชื่ออีเวนต์">
                    <input className="crm-field" value={item.name} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, tracking: { ...content.measure.tracking, events: content.measure.tracking.events.map((row, rowIndex) => (rowIndex === index ? { ...row, name: event.target.value } : row)) } } })} />
                  </Field>
                  <Field label="สถานะ">
                    <select className="crm-field" value={item.status} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, tracking: { ...content.measure.tracking, events: content.measure.tracking.events.map((row, rowIndex) => (rowIndex === index ? { ...row, status: event.target.value as WebsiteTrackingEventStatus } : row)) } } })}>
                      {WEBSITE_CMS_TRACKING_STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, measure: { ...content.measure, tracking: { ...content.measure.tracking, events: [...content.measure.tracking.events, { id: newWebsiteItemId("evt"), name: "", status: "not-configured" }] } } })}>เพิ่มอีเวนต์</button>
              <VisualFields slot="kpis" fileName="kpiImageFile" visual={content.measure.visual} hint="หน้าสาธารณะใช้กรอบ Hotel Website Performance Metrics · Sample data จาก SVG 1600×900 ที่ /images/hotel-website-performance-metrics-placeholder.webp แสดงประมาณ 720×405 px ไม่ใส่ยอดจองโรงแรมจริง Booking Outcome ซ่อนจนกว่าจะเชื่อมระบบ" />
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
                          id: newWebsiteItemId("kpi"),
                          name: "",
                          group: "landing",
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
              <VisualFields slot="related" fileName="relatedImageFile" visual={content.related.visual} hint="หน้าสาธารณะใช้กรอบ Hotel Website / Direct Booking Content จาก SVG 1200×800 ที่ /images/hotel-website-related-content-placeholder.webp แสดงประมาณ 520×347 px อัตราส่วน 3:2 ไม่ใช้ภาพ Hero หรือ Booking Confidence และไม่เปิดเนื้อหาในป๊อปอัป" />
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
                      cards: [...content.related.cards, { id: newWebsiteItemId("card"), title: "", body: "", href: "/", cta: "", featured: false, publicationApproved: false, order: content.related.cards.length + 1 }],
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
                  <div className="crm-cs-metric-actions">
                    <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => patchContent({ ...content, form: { ...content.form, receive: moveItem(content.form.receive, index, -1) } })}>ขึ้น</button>
                    <button type="button" className="crm-users-secondary" disabled={index === content.form.receive.length - 1} onClick={() => patchContent({ ...content, form: { ...content.form, receive: moveItem(content.form.receive, index, 1) } })}>ลง</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, form: { ...content.form, receive: content.form.receive.filter((_, rowIndex) => rowIndex !== index) } })}>ลบ</button>
                  </div>
                  <Field label={`หัวข้อ ${index + 1}`}>
                    <input
                      className="crm-field"
                      value={item.title || item.label}
                      onChange={(event) => {
                        const receive = content.form.receive.map((row, rowIndex) =>
                          rowIndex === index ? { ...row, title: event.target.value, label: event.target.value } : row,
                        );
                        patchContent({ ...content, form: { ...content.form, receive } });
                      }}
                    />
                  </Field>
                  <Field label={`คำอธิบาย ${index + 1}`}>
                    <textarea
                      className="crm-area"
                      rows={2}
                      value={item.body}
                      onChange={(event) => {
                        const receive = content.form.receive.map((row, rowIndex) => (rowIndex === index ? { ...row, body: event.target.value } : row));
                        patchContent({ ...content, form: { ...content.form, receive } });
                      }}
                    />
                  </Field>
                </div>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    form: {
                      ...content.form,
                      receive: [...content.form.receive, { id: newWebsiteItemId("recv"), title: "", label: "", body: "" }],
                    },
                  })
                }
              >
                เพิ่มรายการสิ่งที่โรงแรมจะได้รับ
              </button>
              <p className="crm-contact-image-hint">หน้าสาธารณะใช้รายการสิ่งที่โรงแรมจะได้รับและ What Happens Next ไม่ใส่ภาพทีมงานหรือภาพตกแต่งขนาดใหญ่</p>
              <Field label="What Happens Next">
                <input className="crm-field" value={content.form.nextTitle} onChange={(event) => patchContent({ ...content, form: { ...content.form, nextTitle: event.target.value } })} />
              </Field>
              <Field label="ขั้นตอนถัดไป บรรทัดละข้อ">
                <textarea
                  className="crm-area"
                  rows={4}
                  value={content.form.steps.join("\n")}
                  onChange={(event) =>
                    patchContent({
                      ...content,
                      form: { ...content.form, steps: event.target.value.split("\n").map((step) => step.trim()).filter(Boolean) },
                    })
                  }
                />
              </Field>
              <h3>ป้ายฟอร์มและข้อความยินยอม</h3>
              {(["name", "contact", "business", "website", "bookingEngine", "cms", "goal", "challenge", "timeline", "consent", "privacy"] as const).map((key) => (
                <Field key={key} label={key}>
                  <input
                    className="crm-field"
                    value={content.form.labels[key]}
                    onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, [key]: event.target.value } } })}
                  />
                </Field>
              ))}
            </section>
          ) : null}

          {tab === "faq" ? (
            <section className="crm-cms-panel">
              {content.faqs.map((faq, index) => (
                <div key={faq.id} className="crm-cs-metric">
                  <h3>FAQ {index + 1}</h3>
                  <div className="crm-cs-metric-actions">
                    <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => patchContent({ ...content, faqs: moveItem(content.faqs, index, -1) })}>ขึ้น</button>
                    <button type="button" className="crm-users-secondary" disabled={index === content.faqs.length - 1} onClick={() => patchContent({ ...content, faqs: moveItem(content.faqs, index, 1) })}>ลง</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, faqs: content.faqs.filter((_, rowIndex) => rowIndex !== index) })}>ลบ</button>
                  </div>
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
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, faqs: [...content.faqs, { id: newWebsiteItemId("faq"), q: "", a: "", qEn: "", aEn: "" }] })}>เพิ่ม FAQ</button>
            </section>
          ) : null}

          {tab === "seo" ? (
            <section className="crm-cms-panel">
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
              <p className="crm-contact-image-hint">เมื่อเปิดไว้ FAQ ไทยและอังกฤษต้องไม่ว่าง และรูปที่เผยแพร่ต้องมี alt ทั้งสองภาษา</p>
              {content.seo.variants.map((item, index) => (
                <div key={`${item.locale}-${index}`} className="crm-cs-metric">
                  <h3>ภาษา {item.locale || index + 1}</h3>
                  <Field label="รหัสภาษา">
                    <input className="crm-field" value={item.locale} onChange={(event) => patchContent({ ...content, seo: { ...content.seo, variants: content.seo.variants.map((row, rowIndex) => (rowIndex === index ? { ...row, locale: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="URL">
                    <input className="crm-field" value={item.href} onChange={(event) => patchContent({ ...content, seo: { ...content.seo, variants: content.seo.variants.map((row, rowIndex) => (rowIndex === index ? { ...row, href: event.target.value } : row)) } })} />
                  </Field>
                </div>
              ))}
              <VisualFields slot="social" fileName="ogImageFile" visual={content.seo.social} hint="รูปแชร์โซเชียล 1200 × 630 px ถ้ามีต้องมี alt ไทยและอังกฤษ" />
            </section>
          ) : null}

          {tab === "publish" ? (
            <section className="crm-cms-panel">
              <p className="crm-contact-image-hint">สถานะปัจจุบัน: {meta.status} · อัปเดตล่าสุด {updatedAt || "—"}</p>
              <p className="crm-contact-image-hint">หน้าสาธารณะ: {publicHref}</p>
              <p className="crm-contact-image-hint">ตัวอย่างในระบบ: {previewHref}</p>
              <h3>สำเนาภาษา</h3>
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
              <div className="crm-cs-savebar">
                <button className="kpi-button" type="submit" name="intent" value="publish" disabled={pending}>
                  เผยแพร่
                </button>
                <button className="crm-users-secondary" type="submit" name="intent" value="unpublish" disabled={pending}>
                  ยกเลิกเผยแพร่
                </button>
              </div>
            </section>
          ) : null}
        </div>
        {saveBar}
      </form>
      {dialog === "unpublish" ? (
        <div className="crm-modal">
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby="website-unpublish-title">
            <h2 id="website-unpublish-title">ยกเลิกเผยแพร่</h2>
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
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby="website-duplicate-title">
            <h2 id="website-duplicate-title">คัดลอกไปภาษาอื่นเพื่อแปล</h2>
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
  kpi: CmsWebsiteKpi;
  index: number;
  total: number;
  onChange: (kpi: CmsWebsiteKpi) => void;
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
          <option value="landing">Engagement</option>
          <option value="mobile">Mobile</option>
          <option value="intent">Contact Intent</option>
          <option value="outcome">Booking Outcome</option>
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
        <select className="crm-field" value={kpi.dataStatus} onChange={(event) => onChange({ ...kpi, dataStatus: event.target.value as WebsiteKpiStatus })}>
          {WEBSITE_CMS_KPI_STATUSES.map((item) => (
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
  card: CmsWebsiteRelatedCard;
  index: number;
  total: number;
  onChange: (card: CmsWebsiteRelatedCard) => void;
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
