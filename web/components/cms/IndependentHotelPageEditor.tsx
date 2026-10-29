"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  INDEPENDENT_CMS_KPI_STATUSES,
  INDEPENDENT_CMS_SOURCE_STATUSES,
  independentHotelCmsErrorMessage,
  independentHotelCmsNotice,
  newIndependentItemId,
  type CmsIndependentFormLabels,
  type CmsIndependentPage,
  type CmsIndependentVisual,
  type IndependentCmsIntent,
  type IndependentCmsSaveResult,
  type IndependentHotelEditorState,
} from "@/lib/cms/independent-hotel-page";
import type { IndependentVisualStatus } from "@/lib/independent-hotel";

const VISUAL_STATUS_OPTIONS: Array<{ value: IndependentVisualStatus; label: string }> = [
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
  { id: "assessment", label: "Assessment" },
  { id: "services", label: "Workstreams" },
  { id: "model", label: "Operating Model" },
  { id: "deliverables", label: "Deliverables" },
  { id: "workflow", label: "Workflow" },
  { id: "fit", label: "Fit Matrix" },
  { id: "scope", label: "Scope" },
  { id: "plan", label: "30/60/90" },
  { id: "measure", label: "Measure" },
  { id: "related", label: "Related" },
  { id: "form", label: "Contact" },
  { id: "faq", label: "FAQ" },
  { id: "seo", label: "SEO" },
  { id: "publish", label: "Publish" },
] as const;

type Tab = (typeof TABS)[number]["id"];
type VisualSlot =
  | "hero"
  | "assessment"
  | "services"
  | "model"
  | "deliverables"
  | "workflow"
  | "fit"
  | "scope"
  | "plan"
  | "related"
  | "form"
  | "social";

const VISUAL_FILE_NAMES: Record<VisualSlot, string> = {
  hero: "heroImageFile",
  assessment: "assessmentImageFile",
  services: "servicesImageFile",
  model: "modelImageFile",
  deliverables: "deliverablesImageFile",
  workflow: "workflowImageFile",
  fit: "fitImageFile",
  scope: "scopeImageFile",
  plan: "planImageFile",
  related: "relatedImageFile",
  form: "formImageFile",
  social: "ogImageFile",
};

const CLEAR_FIELD_NAMES: Record<VisualSlot, string> = {
  hero: "clearHeroImage",
  assessment: "clearAssessmentImage",
  services: "clearServicesImage",
  model: "clearModelImage",
  deliverables: "clearDeliverablesImage",
  workflow: "clearWorkflowImage",
  fit: "clearFitImage",
  scope: "clearScopeImage",
  plan: "clearPlanImage",
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

function emptyLine(prefix: string) {
  return { id: newIndependentItemId(prefix), th: "", en: "" };
}

export function IndependentHotelPageEditor({
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
  initial: IndependentHotelEditorState;
  notice?: string;
  error?: string;
  saveAction: (formData: FormData) => Promise<IndependentCmsSaveResult>;
  duplicateAction: (formData: FormData) => Promise<IndependentCmsSaveResult>;
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
  const [content, setContent] = useState<CmsIndependentPage>(initial.content);
  const [status, setStatus] = useState(error ? independentHotelCmsErrorMessage(error) : "");
  const [ok, setOk] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<"unpublish" | "duplicate" | null>(null);
  const [targetLocale, setTargetLocale] = useState("en");
  const [dirty, setDirty] = useState(false);
  const [previews, setPreviews] = useState<Record<VisualSlot, string>>({
    hero: initial.content.hero.visual.src,
    assessment: initial.content.assessment.visual.src,
    services: initial.content.services.visual.src,
    model: initial.content.model.visual.src,
    deliverables: initial.content.deliverables.visual.src,
    workflow: initial.content.workflow.visual.src,
    fit: initial.content.fit.visual.src,
    scope: initial.content.scope.visual.src,
    plan: initial.content.plan.visual.src,
    related: initial.content.related.visual.src,
    form: initial.content.form.visual.src,
    social: initial.content.seo.social.src,
  });
  const [clears, setClears] = useState<Record<VisualSlot, boolean>>({
    hero: false,
    assessment: false,
    services: false,
    model: false,
    deliverables: false,
    workflow: false,
    fit: false,
    scope: false,
    plan: false,
    related: false,
    form: false,
    social: false,
  });

  function markDirty() {
    setDirty(true);
    setOk("");
  }

  function patchContent(next: CmsIndependentPage) {
    setContent(next);
    markDirty();
  }

  function patchLabels(patch: Partial<CmsIndependentFormLabels>) {
    patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, ...patch } } });
  }

  function patchVisual(slot: VisualSlot, visual: CmsIndependentVisual) {
    if (slot === "hero") patchContent({ ...content, hero: { ...content.hero, visual } });
    else if (slot === "assessment") patchContent({ ...content, assessment: { ...content.assessment, visual } });
    else if (slot === "services") patchContent({ ...content, services: { ...content.services, visual } });
    else if (slot === "model") patchContent({ ...content, model: { ...content.model, visual } });
    else if (slot === "deliverables") patchContent({ ...content, deliverables: { ...content.deliverables, visual } });
    else if (slot === "workflow") patchContent({ ...content, workflow: { ...content.workflow, visual } });
    else if (slot === "fit") patchContent({ ...content, fit: { ...content.fit, visual } });
    else if (slot === "scope") patchContent({ ...content, scope: { ...content.scope, visual } });
    else if (slot === "plan") patchContent({ ...content, plan: { ...content.plan, visual } });
    else if (slot === "related") patchContent({ ...content, related: { ...content.related, visual } });
    else if (slot === "form") patchContent({ ...content, form: { ...content.form, visual } });
    else patchContent({ ...content, seo: { ...content.seo, social: visual } });
  }

  function VisualFields({ slot, visual, hint }: { slot: VisualSlot; visual: CmsIndependentVisual; hint: string }) {
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
        <Field label="สถานะรูป" hint="Approved, Sample หรือ Replace — ภาพที่เผยแพร่ต้องเป็น Sample หรือ Approved">
          <select
            className="crm-field"
            value={visual.status === "placeholder" || visual.status === "real" ? "replace" : visual.status}
            onChange={(event) => patchVisual(slot, { ...visual, status: event.target.value as IndependentVisualStatus })}
          >
            {VISUAL_STATUS_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="แหล่งที่มา / Source">
          <input className="crm-field" value={visual.source} onChange={(event) => patchVisual(slot, { ...visual, source: event.target.value })} />
        </Field>
        <Field label="หมายเหตุอนุมัติ / Approval note">
          <textarea className="crm-field" rows={2} value={visual.approvalNote} onChange={(event) => patchVisual(slot, { ...visual, approvalNote: event.target.value })} />
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

  function submit(intent: IndependentCmsIntent) {
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
        setStatus(independentHotelCmsErrorMessage(result.error));
        return;
      }
      if (intent === "publish") setMeta((current) => ({ ...current, status: "published" }));
      if (intent === "draft" || intent === "unpublish") setMeta((current) => ({ ...current, status: "draft" }));
      setOk(intent === "preview" ? independentHotelCmsNotice("preview") : independentHotelCmsNotice("saved"));
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
        setStatus(independentHotelCmsErrorMessage(result.error));
        return;
      }
      setOk(independentHotelCmsNotice("duplicate"));
      setDirty(false);
      router.push(`/crm/cms/pages/${result.id}?tab=hero`);
    });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = (submitter?.value as IndependentCmsIntent) || "save";
    if (intent === "unpublish") {
      setDialog("unpublish");
      return;
    }
    submit(intent);
  }

  const saveButtons = (
    <>
      <button className="kpi-button" type="submit" name="intent" value="save" disabled={pending} style={{ background: "#a2dc25", color: "#1a3a02" }}>
        {pending ? independentHotelCmsNotice("pending") : "บันทึก / Save"}
      </button>
      <button className="crm-users-secondary" type="submit" name="intent" value="draft" disabled={pending}>
        บันทึกฉบับร่าง
      </button>
      <button className="crm-users-secondary" type="submit" name="intent" value="preview" disabled={pending}>
        บันทึกแล้วดูตัวอย่าง
      </button>
      <button className="kpi-button" type="submit" name="intent" value="publish" disabled={pending} style={{ background: "#a2dc25", color: "#1a3a02" }}>
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
        {pending ? independentHotelCmsNotice("pending") : status || (dirty ? independentHotelCmsNotice("dirty") : ok || independentHotelCmsNotice("ready"))}
      </p>
    </div>
  );

  return (
    <div className="crm-cms-editor">
      <nav className="crm-cms-tabs" role="tablist" aria-label="ส่วนของหน้า Independent Hotel Management">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            id={`independent-hotel-cms-tab-${item.id}`}
            role="tab"
            aria-selected={tab === item.id}
            aria-controls="independent-hotel-cms-panel"
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
        <div id="independent-hotel-cms-panel" role="tabpanel" aria-labelledby={`independent-hotel-cms-tab-${tab}`}>
          {tab === "hero" ? (
            <section className="crm-cms-block">
              <h2>Hero</h2>
              <Field label="Eyebrow">
                <input className="crm-field" value={content.hero.eyebrow} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, eyebrow: event.target.value } })} />
              </Field>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.hero.title} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, title: event.target.value } })} />
              </Field>
              <Field label="คำอธิบาย">
                <textarea className="crm-field" rows={4} value={content.hero.description} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, description: event.target.value } })} />
              </Field>
              <Field label="ข้อความปิดท้าย">
                <textarea className="crm-field" rows={3} value={content.hero.close} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, close: event.target.value } })} />
              </Field>
              <Field label="ข้อความใต้ปุ่ม">
                <input className="crm-field" value={content.hero.underCta} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, underCta: event.target.value } })} />
              </Field>
              <Field label="ป้ายปุ่มหลัก">
                <input className="crm-field" value={content.hero.primaryCta.label} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, primaryCta: { ...content.hero.primaryCta, label: event.target.value } } })} />
              </Field>
              <Field label="URL ปุ่มหลัก">
                <input className="crm-field" value={content.hero.primaryCta.href} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, primaryCta: { ...content.hero.primaryCta, href: event.target.value } } })} />
              </Field>
              <Field label="ป้ายปุ่มรอง">
                <input className="crm-field" value={content.hero.secondaryCta.label} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, secondaryCta: { ...content.hero.secondaryCta, label: event.target.value } } })} />
              </Field>
              <Field label="URL ปุ่มรอง">
                <input className="crm-field" value={content.hero.secondaryCta.href} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, secondaryCta: { ...content.hero.secondaryCta, href: event.target.value } } })} />
              </Field>
              <VisualFields slot="hero" visual={content.hero.visual} hint="1600×1000 · แผนภาพเส้นทางดำเนินงาน ไม่ใช่รูปประชุม" />
            </section>
          ) : null}
          {tab === "assessment" ? (
            <section className="crm-cms-block">
              <h2>Assessment</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.assessment.title} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.assessment.lead} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, lead: event.target.value } })} />
              </Field>
              <Field label="ข้อความปิด">
                <textarea className="crm-field" rows={2} value={content.assessment.close} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, close: event.target.value } })} />
              </Field>
              {content.assessment.rows.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`กลุ่ม ${index + 1} · หมายเลข`}>
                    <input className="crm-field" value={row.num} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, num: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หัวข้อไทย">
                    <input className="crm-field" value={row.titleTh} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, titleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Title (EN)">
                    <input className="crm-field" value={row.titleEn} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, titleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="คำถามไทย">
                    <textarea className="crm-field" rows={2} value={row.questionTh} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, questionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Question (EN)">
                    <textarea className="crm-field" rows={2} value={row.questionEn} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, questionEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สัญญาณไทย">
                    <textarea className="crm-field" rows={2} value={row.symptomTh} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, symptomTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Symptom (EN)">
                    <textarea className="crm-field" rows={2} value={row.symptomEn} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, symptomEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="การสนับสนุนที่แนะนำ (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.supportTh} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, supportTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Recommended support (EN)">
                    <textarea className="crm-field" rows={2} value={row.supportEn} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, supportEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผลลัพธ์ / Output">
                    <input className="crm-field" value={row.output} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, output: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.assessment.rows.length,
                    () => patchContent({ ...content, assessment: { ...content.assessment, rows: moveItem(content.assessment.rows, index, -1) } }),
                    () => patchContent({ ...content, assessment: { ...content.assessment, rows: moveItem(content.assessment.rows, index, 1) } }),
                    () => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    assessment: {
                      ...content.assessment,
                      rows: [
                        ...content.assessment.rows,
                        { id: newIndependentItemId("assessment"), num: String(content.assessment.rows.length + 1).padStart(2, "0"), titleTh: "", titleEn: "", questionTh: "", questionEn: "", symptomTh: "", symptomEn: "", supportTh: "", supportEn: "", output: "" },
                      ],
                    },
                  })
                }
              >
                เพิ่มกลุ่มประเมิน
              </button>
              <VisualFields slot="assessment" visual={content.assessment.visual} hint="ต้องต่างจากรูป Hero และไม่ใช่ผลวินิจฉัยโรงแรมจริง" />
            </section>
          ) : null}
          {tab === "services" ? (
            <section className="crm-cms-block">
              <h2>Workstreams and service items</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.services.title} onChange={(event) => patchContent({ ...content, services: { ...content.services, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.services.lead} onChange={(event) => patchContent({ ...content, services: { ...content.services, lead: event.target.value } })} />
              </Field>
              <Field label="ขอบเขต / Boundary">
                <textarea className="crm-field" rows={2} value={content.services.boundary} onChange={(event) => patchContent({ ...content, services: { ...content.services, boundary: event.target.value } })} />
              </Field>
              {content.services.workstreams.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`Workstream ${index + 1} · หมายเลข / id`}>
                    <input className="crm-field" value={row.num} onChange={(event) => patchContent({ ...content, services: { ...content.services, workstreams: content.services.workstreams.map((item, rowIndex) => (rowIndex === index ? { ...item, num: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="รหัส workstream (ใช้ผูก service items)">
                    <input className="crm-field" value={row.id} onChange={(event) => patchContent({ ...content, services: { ...content.services, workstreams: content.services.workstreams.map((item, rowIndex) => (rowIndex === index ? { ...item, id: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หัวข้อไทย">
                    <input className="crm-field" value={row.titleTh} onChange={(event) => patchContent({ ...content, services: { ...content.services, workstreams: content.services.workstreams.map((item, rowIndex) => (rowIndex === index ? { ...item, titleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Title (EN)">
                    <input className="crm-field" value={row.titleEn} onChange={(event) => patchContent({ ...content, services: { ...content.services, workstreams: content.services.workstreams.map((item, rowIndex) => (rowIndex === index ? { ...item, titleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="รายการไทย (บรรทัดละข้อ)">
                    <textarea className="crm-field" rows={4} value={row.bulletsTh} onChange={(event) => patchContent({ ...content, services: { ...content.services, workstreams: content.services.workstreams.map((item, rowIndex) => (rowIndex === index ? { ...item, bulletsTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Items (EN, one per line)">
                    <textarea className="crm-field" rows={4} value={row.bulletsEn} onChange={(event) => patchContent({ ...content, services: { ...content.services, workstreams: content.services.workstreams.map((item, rowIndex) => (rowIndex === index ? { ...item, bulletsEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.services.workstreams.length,
                    () => patchContent({ ...content, services: { ...content.services, workstreams: moveItem(content.services.workstreams, index, -1) } }),
                    () => patchContent({ ...content, services: { ...content.services, workstreams: moveItem(content.services.workstreams, index, 1) } }),
                    () => patchContent({ ...content, services: { ...content.services, workstreams: content.services.workstreams.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    services: {
                      ...content.services,
                      workstreams: [...content.services.workstreams, { id: newIndependentItemId("stream"), num: String(content.services.workstreams.length + 1).padStart(2, "0"), titleTh: "", titleEn: "", bulletsTh: "", bulletsEn: "" }],
                    },
                  })
                }
              >
                เพิ่ม workstream
              </button>
              {content.services.items.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`Service item ${index + 1} · workstream id`}>
                    <input className="crm-field" value={row.stream} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, stream: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หัวข้อไทย">
                    <input className="crm-field" value={row.titleTh} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, titleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Title (EN)">
                    <input className="crm-field" value={row.titleEn} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, titleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ข้อมูลเข้า (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.inputTh} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, inputTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Input (EN)">
                    <textarea className="crm-field" rows={2} value={row.inputEn} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, inputEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="การดำเนินการ (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.actionTh} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, actionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Action (EN)">
                    <textarea className="crm-field" rows={2} value={row.actionEn} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, actionEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผลลัพธ์ / Output">
                    <input className="crm-field" value={row.output} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, output: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="จุดอนุมัติ (ไทย)">
                    <input className="crm-field" value={row.approvalTh} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, approvalTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Approval (EN)">
                    <input className="crm-field" value={row.approvalEn} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, approvalEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผู้รับผิดชอบ (ไทย)">
                    <input className="crm-field" value={row.ownerTh} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner (EN)">
                    <input className="crm-field" value={row.ownerEn} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.services.items.length,
                    () => patchContent({ ...content, services: { ...content.services, items: moveItem(content.services.items, index, -1) } }),
                    () => patchContent({ ...content, services: { ...content.services, items: moveItem(content.services.items, index, 1) } }),
                    () => patchContent({ ...content, services: { ...content.services, items: content.services.items.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    services: {
                      ...content.services,
                      items: [...content.services.items, { id: newIndependentItemId("service"), stream: content.services.workstreams[0]?.id || "", titleTh: "", titleEn: "", inputTh: "", inputEn: "", actionTh: "", actionEn: "", output: "", approvalTh: "", approvalEn: "", ownerTh: "", ownerEn: "" }],
                    },
                  })
                }
              >
                เพิ่ม service item
              </button>
              <VisualFields slot="services" visual={content.services.visual} hint="ใช้โมเดล HTML/SVG เป็นหลัก ไม่ใช้รูปทีมทั่วไป และต้องต่างจาก Hero / Assessment" />
            </section>
          ) : null}
          {tab === "model" ? (
            <section className="crm-cms-block">
              <h2>Operating Model</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.model.title} onChange={(event) => patchContent({ ...content, model: { ...content.model, title: event.target.value } })} />
              </Field>
              {content.model.steps.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`ขั้น ${index + 1} · หมายเลข`}>
                    <input className="crm-field" value={row.num} onChange={(event) => patchContent({ ...content, model: { ...content.model, steps: content.model.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, num: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Label">
                    <input className="crm-field" value={row.label} onChange={(event) => patchContent({ ...content, model: { ...content.model, steps: content.model.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, label: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หัวข้อไทย">
                    <input className="crm-field" value={row.titleTh} onChange={(event) => patchContent({ ...content, model: { ...content.model, steps: content.model.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, titleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Title (EN)">
                    <input className="crm-field" value={row.titleEn} onChange={(event) => patchContent({ ...content, model: { ...content.model, steps: content.model.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, titleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผลลัพธ์ / Output">
                    <input className="crm-field" value={row.output} onChange={(event) => patchContent({ ...content, model: { ...content.model, steps: content.model.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, output: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.model.steps.length,
                    () => patchContent({ ...content, model: { ...content.model, steps: moveItem(content.model.steps, index, -1) } }),
                    () => patchContent({ ...content, model: { ...content.model, steps: moveItem(content.model.steps, index, 1) } }),
                    () => patchContent({ ...content, model: { ...content.model, steps: content.model.steps.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    model: { ...content.model, steps: [...content.model.steps, { id: newIndependentItemId("model"), num: String(content.model.steps.length + 1).padStart(2, "0"), label: "", titleTh: "", titleEn: "", output: "" }] },
                  })
                }
              >
                เพิ่มขั้นตอนโมเดล
              </button>
              <Field label="หัวข้อฝั่งสนับสนุน">
                <input className="crm-field" value={content.model.supportTitle} onChange={(event) => patchContent({ ...content, model: { ...content.model, supportTitle: event.target.value } })} />
              </Field>
              <Field label="ข้อความฝั่งสนับสนุน">
                <textarea className="crm-field" rows={3} value={content.model.support} onChange={(event) => patchContent({ ...content, model: { ...content.model, support: event.target.value } })} />
              </Field>
              <Field label="หัวข้อฝั่งโรงแรม">
                <input className="crm-field" value={content.model.hotelTitle} onChange={(event) => patchContent({ ...content, model: { ...content.model, hotelTitle: event.target.value } })} />
              </Field>
              <Field label="ข้อความฝั่งโรงแรม">
                <textarea className="crm-field" rows={3} value={content.model.hotel} onChange={(event) => patchContent({ ...content, model: { ...content.model, hotel: event.target.value } })} />
              </Field>
              <VisualFields slot="model" visual={content.model.visual} hint="แผนภาพ Diagnose / Align / Coordinate / Review / Adjust" />
            </section>
          ) : null}
          {tab === "deliverables" ? (
            <section className="crm-cms-block">
              <h2>Scope and Deliverables</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.deliverables.title} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.deliverables.lead} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, lead: event.target.value } })} />
              </Field>
              {content.deliverables.rows.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`แถว ${index + 1} · พื้นที่ไทย`}>
                    <input className="crm-field" value={row.areaTh} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, areaTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Area (EN)">
                    <input className="crm-field" value={row.areaEn} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, areaEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สิ่งที่สนับสนุน (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.supportTh} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, supportTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Support (EN)">
                    <textarea className="crm-field" rows={2} value={row.supportEn} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, supportEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผลส่งมอบ / Deliverable">
                    <input className="crm-field" value={row.deliverable} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, deliverable: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="จุดอนุมัติ (ไทย)">
                    <input className="crm-field" value={row.approvalTh} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, approvalTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Approval (EN)">
                    <input className="crm-field" value={row.approvalEn} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, approvalEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.deliverables.rows.length,
                    () => patchContent({ ...content, deliverables: { ...content.deliverables, rows: moveItem(content.deliverables.rows, index, -1) } }),
                    () => patchContent({ ...content, deliverables: { ...content.deliverables, rows: moveItem(content.deliverables.rows, index, 1) } }),
                    () => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    deliverables: { ...content.deliverables, rows: [...content.deliverables.rows, { id: newIndependentItemId("deliverable"), areaTh: "", areaEn: "", supportTh: "", supportEn: "", deliverable: "", approvalTh: "", approvalEn: "" }] },
                  })
                }
              >
                เพิ่มแถวส่งมอบ
              </button>
              <Field label="หัวข้อฝั่งสนับสนุน">
                <input className="crm-field" value={content.deliverables.supportTitle} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, supportTitle: event.target.value } })} />
              </Field>
              {content.deliverables.supportItems.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`รายการสนับสนุน ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.th} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, supportItems: content.deliverables.supportItems.map((item, rowIndex) => (rowIndex === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Support item (EN)">
                    <input className="crm-field" value={row.en} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, supportItems: content.deliverables.supportItems.map((item, rowIndex) => (rowIndex === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.deliverables.supportItems.length,
                    () => patchContent({ ...content, deliverables: { ...content.deliverables, supportItems: moveItem(content.deliverables.supportItems, index, -1) } }),
                    () => patchContent({ ...content, deliverables: { ...content.deliverables, supportItems: moveItem(content.deliverables.supportItems, index, 1) } }),
                    () => patchContent({ ...content, deliverables: { ...content.deliverables, supportItems: content.deliverables.supportItems.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, deliverables: { ...content.deliverables, supportItems: [...content.deliverables.supportItems, emptyLine("support")] } })}>
                เพิ่มรายการสนับสนุน
              </button>
              <Field label="หัวข้อฝั่งโรงแรม">
                <input className="crm-field" value={content.deliverables.hotelTitle} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, hotelTitle: event.target.value } })} />
              </Field>
              {content.deliverables.hotelItems.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`ความรับผิดชอบโรงแรม ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.th} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, hotelItems: content.deliverables.hotelItems.map((item, rowIndex) => (rowIndex === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Hotel item (EN)">
                    <input className="crm-field" value={row.en} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, hotelItems: content.deliverables.hotelItems.map((item, rowIndex) => (rowIndex === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.deliverables.hotelItems.length,
                    () => patchContent({ ...content, deliverables: { ...content.deliverables, hotelItems: moveItem(content.deliverables.hotelItems, index, -1) } }),
                    () => patchContent({ ...content, deliverables: { ...content.deliverables, hotelItems: moveItem(content.deliverables.hotelItems, index, 1) } }),
                    () => patchContent({ ...content, deliverables: { ...content.deliverables, hotelItems: content.deliverables.hotelItems.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, deliverables: { ...content.deliverables, hotelItems: [...content.deliverables.hotelItems, emptyLine("hotel")] } })}>
                เพิ่มความรับผิดชอบโรงแรม
              </button>
              <Field label="ขอบเขตงาน / Scope boundary">
                <textarea className="crm-field" rows={3} value={content.deliverables.boundary} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, boundary: event.target.value } })} />
              </Field>
              <VisualFields slot="deliverables" visual={content.deliverables.visual} hint="ใช้ตาราง HTML เป็นหลัก Dummy 16:9 ชื่อ independent-hotel-management-deliverables-placeholder ไม่ใช่รูปสต็อก และต้องต่างจาก Hero / Assessment / Operating Model / Workflow" />
            </section>
          ) : null}
          {tab === "workflow" ? (
            <section className="crm-cms-block">
              <h2>Assess → Align → Operate</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.workflow.title} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.workflow.lead} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, lead: event.target.value } })} />
              </Field>
              {content.workflow.steps.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`ขั้น ${index + 1} · หมายเลข`}>
                    <input className="crm-field" value={row.num} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, num: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Label">
                    <input className="crm-field" value={row.label} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, label: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หัวข้อไทย">
                    <input className="crm-field" value={row.titleTh} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, titleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Title (EN)">
                    <input className="crm-field" value={row.titleEn} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, titleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="คำอธิบายไทย">
                    <textarea className="crm-field" rows={3} value={row.bodyTh} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, bodyTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Body (EN)">
                    <textarea className="crm-field" rows={3} value={row.bodyEn} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, bodyEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผู้รับผิดชอบ (ไทย)">
                    <input className="crm-field" value={row.ownerTh} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner (EN)">
                    <input className="crm-field" value={row.ownerEn} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ข้อมูลเข้า (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.inputTh} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, inputTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Input (EN)">
                    <textarea className="crm-field" rows={2} value={row.inputEn} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, inputEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="การดำเนินการ (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.actionTh} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, actionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Action (EN)">
                    <textarea className="crm-field" rows={2} value={row.actionEn} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, actionEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผลลัพธ์ / Output">
                    <input className="crm-field" value={row.output} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, output: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="จุดอนุมัติ (ไทย)">
                    <input className="crm-field" value={row.approvalTh} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, approvalTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Approval (EN)">
                    <input className="crm-field" value={row.approvalEn} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, approvalEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ขั้นถัดไป (ไทย)">
                    <input className="crm-field" value={row.nextTh} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, nextTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Next (EN)">
                    <input className="crm-field" value={row.nextEn} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, nextEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.workflow.steps.length,
                    () => patchContent({ ...content, workflow: { ...content.workflow, steps: moveItem(content.workflow.steps, index, -1) } }),
                    () => patchContent({ ...content, workflow: { ...content.workflow, steps: moveItem(content.workflow.steps, index, 1) } }),
                    () => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    workflow: {
                      ...content.workflow,
                      steps: [...content.workflow.steps, { id: newIndependentItemId("workflow"), num: String(content.workflow.steps.length + 1).padStart(2, "0"), label: "", titleTh: "", titleEn: "", bodyTh: "", bodyEn: "", ownerTh: "", ownerEn: "", inputTh: "", inputEn: "", actionTh: "", actionEn: "", output: "", approvalTh: "", approvalEn: "", nextTh: "", nextEn: "" }],
                    },
                  })
                }
              >
                เพิ่มขั้นตอน Workflow
              </button>
              <Field label="หัวข้อจุดอนุมัติ">
                <input className="crm-field" value={content.workflow.approvalsTitle} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, approvalsTitle: event.target.value } })} />
              </Field>
              {content.workflow.approvals.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`จุดอนุมัติ ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.th} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, approvals: content.workflow.approvals.map((item, rowIndex) => (rowIndex === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Approval (EN)">
                    <input className="crm-field" value={row.en} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, approvals: content.workflow.approvals.map((item, rowIndex) => (rowIndex === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.workflow.approvals.length,
                    () => patchContent({ ...content, workflow: { ...content.workflow, approvals: moveItem(content.workflow.approvals, index, -1) } }),
                    () => patchContent({ ...content, workflow: { ...content.workflow, approvals: moveItem(content.workflow.approvals, index, 1) } }),
                    () => patchContent({ ...content, workflow: { ...content.workflow, approvals: content.workflow.approvals.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, workflow: { ...content.workflow, approvals: [...content.workflow.approvals, emptyLine("approval")] } })}>
                เพิ่มจุดอนุมัติ
              </button>
              <VisualFields slot="workflow" visual={content.workflow.visual} hint="ใช้ไทม์ไลน์ HTML เป็นหลัก ไม่ใช้รูปประชุมทั่วไป และต้องต่างจาก Hero / Assessment / Operating Model" />
            </section>
          ) : null}
          {tab === "fit" ? (
            <section className="crm-cms-block">
              <h2>Fit Matrix</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.fit.title} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.fit.lead} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, lead: event.target.value } })} />
              </Field>
              {content.fit.scenarios.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`สถานการณ์ ${index + 1} (ไทย)`}>
                    <textarea className="crm-field" rows={2} value={row.situationTh} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, situationTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Situation (EN)">
                    <textarea className="crm-field" rows={2} value={row.situationEn} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, situationEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สัญญาณ (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.symptomTh} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, symptomTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Symptom (EN)">
                    <textarea className="crm-field" rows={2} value={row.symptomEn} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, symptomEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="คำถาม (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.questionTh} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, questionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Question (EN)">
                    <textarea className="crm-field" rows={2} value={row.questionEn} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, questionEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="การสนับสนุน (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.supportTh} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, supportTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Support (EN)">
                    <textarea className="crm-field" rows={2} value={row.supportEn} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, supportEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผลลัพธ์ / Output">
                    <input className="crm-field" value={row.output} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, output: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.fit.scenarios.length,
                    () => patchContent({ ...content, fit: { ...content.fit, scenarios: moveItem(content.fit.scenarios, index, -1) } }),
                    () => patchContent({ ...content, fit: { ...content.fit, scenarios: moveItem(content.fit.scenarios, index, 1) } }),
                    () => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    fit: { ...content.fit, scenarios: [...content.fit.scenarios, { id: newIndependentItemId("fit"), situationTh: "", situationEn: "", symptomTh: "", symptomEn: "", questionTh: "", questionEn: "", supportTh: "", supportEn: "", output: "" }] },
                  })
                }
              >
                เพิ่มสถานการณ์
              </button>
              <Field label="หัวข้ออาจไม่เหมาะ">
                <input className="crm-field" value={content.fit.notTitle} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, notTitle: event.target.value } })} />
              </Field>
              {content.fit.notItems.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`อาจไม่เหมาะ ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.th} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, notItems: content.fit.notItems.map((item, rowIndex) => (rowIndex === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="May not fit (EN)">
                    <input className="crm-field" value={row.en} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, notItems: content.fit.notItems.map((item, rowIndex) => (rowIndex === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.fit.notItems.length,
                    () => patchContent({ ...content, fit: { ...content.fit, notItems: moveItem(content.fit.notItems, index, -1) } }),
                    () => patchContent({ ...content, fit: { ...content.fit, notItems: moveItem(content.fit.notItems, index, 1) } }),
                    () => patchContent({ ...content, fit: { ...content.fit, notItems: content.fit.notItems.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, fit: { ...content.fit, notItems: [...content.fit.notItems, emptyLine("not")] } })}>
                เพิ่มรายการที่อาจไม่เหมาะ
              </button>
              <VisualFields slot="fit" visual={content.fit.visual} hint="ใช้ตาราง HTML เป็นหลัก Dummy 16:9 ชื่อ independent-hotel-management-fit-matrix-placeholder ไม่ใช่ผลการวินิจฉัยก่อนประเมิน และต้องต่างจาก Hero / Assessment / Workflow" />
            </section>
          ) : null}
          {tab === "scope" ? (
            <section className="crm-cms-block">
              <h2>Scope</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.scope.title} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, title: event.target.value } })} />
              </Field>
              {content.scope.rows.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`กลุ่ม ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.titleTh} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, rows: content.scope.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, titleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Title (EN)">
                    <input className="crm-field" value={row.titleEn} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, rows: content.scope.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, titleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="รายการไทย (บรรทัดละข้อ)">
                    <textarea className="crm-field" rows={4} value={row.itemsTh} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, rows: content.scope.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, itemsTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Items (EN, one per line)">
                    <textarea className="crm-field" rows={4} value={row.itemsEn} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, rows: content.scope.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, itemsEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.scope.rows.length,
                    () => patchContent({ ...content, scope: { ...content.scope, rows: moveItem(content.scope.rows, index, -1) } }),
                    () => patchContent({ ...content, scope: { ...content.scope, rows: moveItem(content.scope.rows, index, 1) } }),
                    () => patchContent({ ...content, scope: { ...content.scope, rows: content.scope.rows.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    scope: { ...content.scope, rows: [...content.scope.rows, { id: newIndependentItemId("scope"), titleTh: "", titleEn: "", itemsTh: "", itemsEn: "" }] },
                  })
                }
              >
                เพิ่มกลุ่มขอบเขต
              </button>
              <Field label="ขอบเขตงาน / Scope boundary" hint="ต้องไม่ว่างเมื่อเผยแพร่">
                <textarea className="crm-field" rows={3} value={content.scope.boundary} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, boundary: event.target.value } })} />
              </Field>
              <VisualFields slot="scope" visual={content.scope.visual} hint="ตารางขอบเขตและความรับผิดชอบ" />
            </section>
          ) : null}
          {tab === "plan" ? (
            <section className="crm-cms-block">
              <h2>30 / 60 / 90</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.plan.title} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={2} value={content.plan.lead} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, lead: event.target.value } })} />
              </Field>
              <Field label="ข้อความปิด">
                <textarea className="crm-field" rows={2} value={content.plan.close} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, close: event.target.value } })} />
              </Field>
              <Field label="ป้าย Sample plan" hint="แสดงบนหน้าสาธารณะเสมอ">
                <input className="crm-field" value={content.plan.sampleLabel} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, sampleLabel: event.target.value } })} />
              </Field>
              {content.plan.phases.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`ช่วง ${index + 1} · Label`}>
                    <input className="crm-field" value={row.label} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, phases: content.plan.phases.map((item, rowIndex) => (rowIndex === index ? { ...item, label: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ป้ายไทย">
                    <input className="crm-field" value={row.labelTh} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, phases: content.plan.phases.map((item, rowIndex) => (rowIndex === index ? { ...item, labelTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="รายการไทย (บรรทัดละข้อ)">
                    <textarea className="crm-field" rows={4} value={row.itemsTh} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, phases: content.plan.phases.map((item, rowIndex) => (rowIndex === index ? { ...item, itemsTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Items (EN, one per line)">
                    <textarea className="crm-field" rows={4} value={row.itemsEn} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, phases: content.plan.phases.map((item, rowIndex) => (rowIndex === index ? { ...item, itemsEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผลลัพธ์ / Output">
                    <input className="crm-field" value={row.output} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, phases: content.plan.phases.map((item, rowIndex) => (rowIndex === index ? { ...item, output: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.plan.phases.length,
                    () => patchContent({ ...content, plan: { ...content.plan, phases: moveItem(content.plan.phases, index, -1) } }),
                    () => patchContent({ ...content, plan: { ...content.plan, phases: moveItem(content.plan.phases, index, 1) } }),
                    () => patchContent({ ...content, plan: { ...content.plan, phases: content.plan.phases.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    plan: { ...content.plan, phases: [...content.plan.phases, { id: newIndependentItemId("phase"), label: "", labelTh: "", itemsTh: "", itemsEn: "", output: "" }] },
                  })
                }
              >
                เพิ่มช่วงแผน
              </button>
              <Field label="หัวข้อจังหวะบริหาร">
                <input className="crm-field" value={content.plan.cadenceTitle} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, cadenceTitle: event.target.value } })} />
              </Field>
              {content.plan.cadence.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`จังหวะ ${index + 1} · Label`}>
                    <input className="crm-field" value={row.label} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, cadence: content.plan.cadence.map((item, rowIndex) => (rowIndex === index ? { ...item, label: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ป้ายไทย">
                    <input className="crm-field" value={row.labelTh} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, cadence: content.plan.cadence.map((item, rowIndex) => (rowIndex === index ? { ...item, labelTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="รายการไทย (บรรทัดละข้อ)">
                    <textarea className="crm-field" rows={4} value={row.itemsTh} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, cadence: content.plan.cadence.map((item, rowIndex) => (rowIndex === index ? { ...item, itemsTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Items (EN, one per line)">
                    <textarea className="crm-field" rows={4} value={row.itemsEn} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, cadence: content.plan.cadence.map((item, rowIndex) => (rowIndex === index ? { ...item, itemsEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.plan.cadence.length,
                    () => patchContent({ ...content, plan: { ...content.plan, cadence: moveItem(content.plan.cadence, index, -1) } }),
                    () => patchContent({ ...content, plan: { ...content.plan, cadence: moveItem(content.plan.cadence, index, 1) } }),
                    () => patchContent({ ...content, plan: { ...content.plan, cadence: content.plan.cadence.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    plan: { ...content.plan, cadence: [...content.plan.cadence, { id: newIndependentItemId("cadence"), label: "", labelTh: "", itemsTh: "", itemsEn: "" }] },
                  })
                }
              >
                เพิ่มจังหวะบริหาร
              </button>
              <VisualFields slot="plan" visual={content.plan.visual} hint="ใช้แผน HTML เป็นหลัก Dummy 16:9 ชื่อ independent-hotel-30-60-90-day-plan-placeholder ติดป้าย Sample plan เสมอ ไม่ใช่ผลที่การันตี และต้องต่างจาก Hero / Assessment / Workflow / Deliverables" />
            </section>
          ) : null}
          {tab === "measure" ? (
            <section className="crm-cms-block">
              <h2>Measure</h2>
              <Field label="หัวข้อตัวชี้วัด">
                <input className="crm-field" value={content.measure.title} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, title: event.target.value } })} />
              </Field>
              {content.measure.kpis.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`KPI ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.nameTh} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, rowIndex) => (rowIndex === index ? { ...item, nameTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Name (EN)">
                    <input className="crm-field" value={row.nameEn} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, rowIndex) => (rowIndex === index ? { ...item, nameEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ช่วงเวลา / Period">
                    <input className="crm-field" value={row.period} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, rowIndex) => (rowIndex === index ? { ...item, period: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="บริบทโรงแรม / Property context">
                    <input className="crm-field" value={row.market} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, rowIndex) => (rowIndex === index ? { ...item, market: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="แหล่งที่มา / Source">
                    <input className="crm-field" value={row.source} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, rowIndex) => (rowIndex === index ? { ...item, source: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="คำนิยามไทย">
                    <textarea className="crm-field" rows={2} value={row.definitionTh} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, rowIndex) => (rowIndex === index ? { ...item, definitionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Definition (EN)">
                    <textarea className="crm-field" rows={2} value={row.definitionEn} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, rowIndex) => (rowIndex === index ? { ...item, definitionEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หน่วย">
                    <input className="crm-field" value={row.unit} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, rowIndex) => (rowIndex === index ? { ...item, unit: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สถานะข้อมูล">
                    <select className="crm-field" value={row.dataStatus} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, rowIndex) => (rowIndex === index ? { ...item, dataStatus: event.target.value } : item)) } })}>
                      {INDEPENDENT_CMS_KPI_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <label className="crm-cms-field">
                    <span>
                      <input type="checkbox" checked={row.hideUntilData} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, rowIndex) => (rowIndex === index ? { ...item, hideUntilData: event.target.checked } : item)) } })} /> ซ่อนจนกว่าจะมีข้อมูล
                    </span>
                  </label>
                  <label className="crm-cms-field">
                    <span>
                      <input type="checkbox" checked={row.publicationApproved} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, rowIndex) => (rowIndex === index ? { ...item, publicationApproved: event.target.checked } : item)) } })} /> อนุมัติเผยแพร่ผลลัพธ์นี้
                    </span>
                  </label>
                  {listActions(
                    index,
                    content.measure.kpis.length,
                    () => patchContent({ ...content, measure: { ...content.measure, kpis: moveItem(content.measure.kpis, index, -1) } }),
                    () => patchContent({ ...content, measure: { ...content.measure, kpis: moveItem(content.measure.kpis, index, 1) } }),
                    () => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    measure: { ...content.measure, kpis: [...content.measure.kpis, { id: newIndependentItemId("kpi"), nameTh: "", nameEn: "", period: "", market: "", source: "", definitionTh: "", definitionEn: "", unit: "", dataStatus: "draft", hideUntilData: true, publicationApproved: false }] },
                  })
                }
              >
                เพิ่ม KPI
              </button>
              {content.measure.sources.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`แหล่งที่มา ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.nameTh} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, sources: content.measure.sources.map((item, rowIndex) => (rowIndex === index ? { ...item, nameTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Name (EN)">
                    <input className="crm-field" value={row.nameEn} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, sources: content.measure.sources.map((item, rowIndex) => (rowIndex === index ? { ...item, nameEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="URL">
                    <input className="crm-field" value={row.url} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, sources: content.measure.sources.map((item, rowIndex) => (rowIndex === index ? { ...item, url: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="วันที่เผยแพร่">
                    <input className="crm-field" value={row.publishedAt} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, sources: content.measure.sources.map((item, rowIndex) => (rowIndex === index ? { ...item, publishedAt: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="วันที่เข้าถึง">
                    <input className="crm-field" value={row.accessedAt} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, sources: content.measure.sources.map((item, rowIndex) => (rowIndex === index ? { ...item, accessedAt: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ตลาด (ไทย)">
                    <input className="crm-field" value={row.marketTh} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, sources: content.measure.sources.map((item, rowIndex) => (rowIndex === index ? { ...item, marketTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Market (EN)">
                    <input className="crm-field" value={row.marketEn} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, sources: content.measure.sources.map((item, rowIndex) => (rowIndex === index ? { ...item, marketEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="คำนิยามไทย">
                    <textarea className="crm-field" rows={2} value={row.definitionTh} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, sources: content.measure.sources.map((item, rowIndex) => (rowIndex === index ? { ...item, definitionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Definition (EN)">
                    <textarea className="crm-field" rows={2} value={row.definitionEn} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, sources: content.measure.sources.map((item, rowIndex) => (rowIndex === index ? { ...item, definitionEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สถานะ">
                    <select className="crm-field" value={row.status} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, sources: content.measure.sources.map((item, rowIndex) => (rowIndex === index ? { ...item, status: event.target.value } : item)) } })}>
                      {INDEPENDENT_CMS_SOURCE_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="หมายเหตุอนุมัติ">
                    <textarea className="crm-field" rows={2} value={row.approvalNote} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, sources: content.measure.sources.map((item, rowIndex) => (rowIndex === index ? { ...item, approvalNote: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.measure.sources.length,
                    () => patchContent({ ...content, measure: { ...content.measure, sources: moveItem(content.measure.sources, index, -1) } }),
                    () => patchContent({ ...content, measure: { ...content.measure, sources: moveItem(content.measure.sources, index, 1) } }),
                    () => patchContent({ ...content, measure: { ...content.measure, sources: content.measure.sources.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    measure: { ...content.measure, sources: [...content.measure.sources, { id: newIndependentItemId("source"), nameTh: "", nameEn: "", url: "", publishedAt: "", accessedAt: "", marketTh: "", marketEn: "", definitionTh: "", definitionEn: "", status: "guidance", approvalNote: "" }] },
                  })
                }
              >
                เพิ่มแหล่งที่มา
              </button>
            </section>
          ) : null}
          {tab === "related" ? (
            <section className="crm-cms-block">
              <h2>Related</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.related.title} onChange={(event) => patchContent({ ...content, related: { ...content.related, title: event.target.value } })} />
              </Field>
              {content.related.cards.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`การ์ด ${index + 1} · URL`}>
                    <input className="crm-field" value={row.href} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, rowIndex) => (rowIndex === index ? { ...item, href: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หัวข้อไทย">
                    <input className="crm-field" value={row.titleTh} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, rowIndex) => (rowIndex === index ? { ...item, titleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Title (EN)">
                    <input className="crm-field" value={row.titleEn} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, rowIndex) => (rowIndex === index ? { ...item, titleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="คำอธิบายไทย">
                    <textarea className="crm-field" rows={2} value={row.bodyTh} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, rowIndex) => (rowIndex === index ? { ...item, bodyTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Body (EN)">
                    <textarea className="crm-field" rows={2} value={row.bodyEn} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, rowIndex) => (rowIndex === index ? { ...item, bodyEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ป้ายปุ่มไทย">
                    <input className="crm-field" value={row.ctaTh} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, rowIndex) => (rowIndex === index ? { ...item, ctaTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="CTA (EN)">
                    <input className="crm-field" value={row.ctaEn} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, rowIndex) => (rowIndex === index ? { ...item, ctaEn: event.target.value } : item)) } })} />
                  </Field>
                  <label className="crm-cms-field">
                    <span>
                      <input type="checkbox" checked={row.publicationApproved} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, rowIndex) => (rowIndex === index ? { ...item, publicationApproved: event.target.checked } : item)) } })} /> อนุมัติเผยแพร่การ์ดนี้
                    </span>
                  </label>
                  {listActions(
                    index,
                    content.related.cards.length,
                    () => patchContent({ ...content, related: { ...content.related, cards: moveItem(content.related.cards, index, -1) } }),
                    () => patchContent({ ...content, related: { ...content.related, cards: moveItem(content.related.cards, index, 1) } }),
                    () => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    related: { ...content.related, cards: [...content.related.cards, { id: newIndependentItemId("related"), href: "", titleTh: "", titleEn: "", bodyTh: "", bodyEn: "", ctaTh: "", ctaEn: "", publicationApproved: false }] },
                  })
                }
              >
                เพิ่มการ์ด
              </button>
              <Field label="หัวข้อปิดท้าย">
                <input className="crm-field" value={content.related.closerTitle} onChange={(event) => patchContent({ ...content, related: { ...content.related, closerTitle: event.target.value } })} />
              </Field>
              <Field label="ข้อความปิดท้าย">
                <textarea className="crm-field" rows={3} value={content.related.closerBody} onChange={(event) => patchContent({ ...content, related: { ...content.related, closerBody: event.target.value } })} />
              </Field>
              <Field label="ป้ายปุ่มปิดท้าย">
                <input className="crm-field" value={content.related.closerCta} onChange={(event) => patchContent({ ...content, related: { ...content.related, closerCta: event.target.value } })} />
              </Field>
              <Field label="URL ปุ่มปิดท้าย">
                <input className="crm-field" value={content.related.closerHref} onChange={(event) => patchContent({ ...content, related: { ...content.related, closerHref: event.target.value } })} />
              </Field>
              <VisualFields slot="related" visual={content.related.visual} hint="แผนที่งานที่เกี่ยวข้อง" />
            </section>
          ) : null}
          {tab === "form" ? (
            <section className="crm-cms-block">
              <h2>Contact</h2>
              <Field label="Kicker">
                <input className="crm-field" value={content.form.kicker} onChange={(event) => patchContent({ ...content, form: { ...content.form, kicker: event.target.value } })} />
              </Field>
              <Field label="หัวข้อฟอร์ม">
                <input className="crm-field" value={content.form.title} onChange={(event) => patchContent({ ...content, form: { ...content.form, title: event.target.value } })} />
              </Field>
              <Field label="คำอธิบาย / CTA helper">
                <textarea className="crm-field" rows={3} value={content.form.body} onChange={(event) => patchContent({ ...content, form: { ...content.form, body: event.target.value } })} />
              </Field>
              <Field label="ป้ายปุ่มส่ง">
                <input className="crm-field" value={content.form.submit} onChange={(event) => patchContent({ ...content, form: { ...content.form, submit: event.target.value } })} />
              </Field>
              <Field label="ข้อความประกอบ">
                <textarea className="crm-field" rows={2} value={content.form.note} onChange={(event) => patchContent({ ...content, form: { ...content.form, note: event.target.value } })} />
              </Field>
              <Field label="หัวข้อสิ่งที่โรงแรมได้รับ">
                <input className="crm-field" value={content.form.receiveTitle} onChange={(event) => patchContent({ ...content, form: { ...content.form, receiveTitle: event.target.value } })} />
              </Field>
              {content.form.receive.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`หัวข้อรายการ ${index + 1}`}>
                    <input className="crm-field" value={row.title} onChange={(event) => patchContent({ ...content, form: { ...content.form, receive: content.form.receive.map((item, rowIndex) => (rowIndex === index ? { ...item, title: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="รายละเอียดไทย">
                    <textarea className="crm-field" rows={2} value={row.th} onChange={(event) => patchContent({ ...content, form: { ...content.form, receive: content.form.receive.map((item, rowIndex) => (rowIndex === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Detail (EN)">
                    <textarea className="crm-field" rows={2} value={row.en} onChange={(event) => patchContent({ ...content, form: { ...content.form, receive: content.form.receive.map((item, rowIndex) => (rowIndex === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.form.receive.length,
                    () => patchContent({ ...content, form: { ...content.form, receive: moveItem(content.form.receive, index, -1) } }),
                    () => patchContent({ ...content, form: { ...content.form, receive: moveItem(content.form.receive, index, 1) } }),
                    () => patchContent({ ...content, form: { ...content.form, receive: content.form.receive.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, form: { ...content.form, receive: [...content.form.receive, { id: newIndependentItemId("receive"), title: "", th: "", en: "" }] } })}>
                เพิ่มรายการที่จะได้รับ
              </button>
              <Field label="หัวข้อ What Happens Next">
                <input className="crm-field" value={content.form.nextTitle} onChange={(event) => patchContent({ ...content, form: { ...content.form, nextTitle: event.target.value } })} />
              </Field>
              {content.form.steps.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`ขั้นถัดไป ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.th} onChange={(event) => patchContent({ ...content, form: { ...content.form, steps: content.form.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Step (EN)">
                    <input className="crm-field" value={row.en} onChange={(event) => patchContent({ ...content, form: { ...content.form, steps: content.form.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.form.steps.length,
                    () => patchContent({ ...content, form: { ...content.form, steps: moveItem(content.form.steps, index, -1) } }),
                    () => patchContent({ ...content, form: { ...content.form, steps: moveItem(content.form.steps, index, 1) } }),
                    () => patchContent({ ...content, form: { ...content.form, steps: content.form.steps.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, form: { ...content.form, steps: [...content.form.steps, emptyLine("step")] } })}>
                เพิ่มขั้นตอนถัดไป
              </button>
              <Field label="ป้ายชื่อ">
                <input className="crm-field" value={content.form.labels.name} onChange={(event) => patchLabels({ name: event.target.value })} />
              </Field>
              <Field label="ป้ายโรงแรม / บริษัท">
                <input className="crm-field" value={content.form.labels.business} onChange={(event) => patchLabels({ business: event.target.value })} />
              </Field>
              <Field label="ป้ายช่องทางติดต่อ">
                <input className="crm-field" value={content.form.labels.contact} onChange={(event) => patchLabels({ contact: event.target.value })} />
              </Field>
              <Field label="ป้ายจำนวนห้อง">
                <input className="crm-field" value={content.form.labels.rooms} onChange={(event) => patchLabels({ rooms: event.target.value })} />
              </Field>
              <Field label="ป้ายสถานะโรงแรม">
                <input className="crm-field" value={content.form.labels.hotelStatus} onChange={(event) => patchLabels({ hotelStatus: event.target.value })} />
              </Field>
              <Field label="ป้ายประเด็นหลัก">
                <input className="crm-field" value={content.form.labels.challenge} onChange={(event) => patchLabels({ challenge: event.target.value })} />
              </Field>
              <Field label="ป้ายขนาดทีม">
                <input className="crm-field" value={content.form.labels.teamSize} onChange={(event) => patchLabels({ teamSize: event.target.value })} />
              </Field>
              <Field label="ป้ายเว็บไซต์">
                <input className="crm-field" value={content.form.labels.website} onChange={(event) => patchLabels({ website: event.target.value })} />
              </Field>
              <Field label="ป้ายระบบที่ใช้">
                <input className="crm-field" value={content.form.labels.systems} onChange={(event) => patchLabels({ systems: event.target.value })} />
              </Field>
              <Field label="ป้ายเป้าหมาย">
                <input className="crm-field" value={content.form.labels.goal} onChange={(event) => patchLabels({ goal: event.target.value })} />
              </Field>
              <Field label="ป้ายข้อความเพิ่มเติม">
                <input className="crm-field" value={content.form.labels.message} onChange={(event) => patchLabels({ message: event.target.value })} />
              </Field>
              <Field label="ข้อความยินยอม">
                <textarea className="crm-field" rows={2} value={content.form.labels.consent} onChange={(event) => patchLabels({ consent: event.target.value })} />
              </Field>
              <Field label="ป้ายนโยบายความเป็นส่วนตัว">
                <input className="crm-field" value={content.form.labels.privacy} onChange={(event) => patchLabels({ privacy: event.target.value })} />
              </Field>
              <VisualFields slot="form" visual={content.form.visual} hint="แผนภาพขั้นตอนหลังส่งข้อมูล" />
            </section>
          ) : null}
          {tab === "faq" ? (
            <section className="crm-cms-block">
              <h2>FAQ</h2>
              {content.faqs.map((faq, index) => (
                <article key={faq.id} className="crm-cms-block">
                  <Field label={`คำถามไทย ${index + 1}`}>
                    <input className="crm-field" value={faq.q} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((row, rowIndex) => (rowIndex === index ? { ...row, q: event.target.value } : row)) })} />
                  </Field>
                  <Field label="คำตอบไทย">
                    <textarea className="crm-field" rows={3} value={faq.a} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((row, rowIndex) => (rowIndex === index ? { ...row, a: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Question (EN)">
                    <input className="crm-field" value={faq.qEn} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((row, rowIndex) => (rowIndex === index ? { ...row, qEn: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Answer (EN)">
                    <textarea className="crm-field" rows={3} value={faq.aEn} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((row, rowIndex) => (rowIndex === index ? { ...row, aEn: event.target.value } : row)) })} />
                  </Field>
                  <div className="crm-cs-metric-actions">
                    <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => patchContent({ ...content, faqs: moveItem(content.faqs, index, -1) })}>
                      ขึ้น
                    </button>
                    <button type="button" className="crm-users-secondary" disabled={index === content.faqs.length - 1} onClick={() => patchContent({ ...content, faqs: moveItem(content.faqs, index, 1) })}>
                      ลง
                    </button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, faqs: content.faqs.filter((_, rowIndex) => rowIndex !== index) })}>
                      ลบ
                    </button>
                  </div>
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    faqs: [...content.faqs, { id: newIndependentItemId("faq"), q: "", a: "", qEn: "", aEn: "" }],
                  })
                }
              >
                เพิ่มคำถาม
              </button>
            </section>
          ) : null}
          {tab === "seo" || tab === "publish" ? (
            <section className="crm-cms-block">
              <h2>{tab === "seo" ? "SEO" : "Publish"}</h2>
              <Field label="ชื่อเอกสาร">
                <input className="crm-field" value={meta.title} onChange={(event) => { setMeta((current) => ({ ...current, title: event.target.value })); markDirty(); }} />
              </Field>
              <Field label="SEO title">
                <input className="crm-field" value={meta.seoTitle} onChange={(event) => { setMeta((current) => ({ ...current, seoTitle: event.target.value })); markDirty(); }} />
              </Field>
              <Field label="Meta description">
                <textarea className="crm-field" rows={3} value={meta.metaDescription} onChange={(event) => { setMeta((current) => ({ ...current, metaDescription: event.target.value })); markDirty(); }} />
              </Field>
              <Field label="Excerpt">
                <textarea className="crm-field" rows={2} value={meta.excerpt} onChange={(event) => { setMeta((current) => ({ ...current, excerpt: event.target.value })); markDirty(); }} />
              </Field>
              <Field label="Canonical">
                <input className="crm-field" value={content.seo.canonical} onChange={(event) => patchContent({ ...content, seo: { ...content.seo, canonical: event.target.value } })} />
              </Field>
              {content.seo.variants.map((row, index) => (
                <article key={`${row.locale}-${index}`} className="crm-cms-block">
                  <Field label={`Language variant ${index + 1}`}>
                    <input className="crm-field" value={row.locale} onChange={(event) => patchContent({ ...content, seo: { ...content.seo, variants: content.seo.variants.map((item, rowIndex) => (rowIndex === index ? { ...item, locale: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="SEO title">
                    <input className="crm-field" value={row.title} onChange={(event) => patchContent({ ...content, seo: { ...content.seo, variants: content.seo.variants.map((item, rowIndex) => (rowIndex === index ? { ...item, title: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="SEO description">
                    <textarea className="crm-field" rows={2} value={row.description} onChange={(event) => patchContent({ ...content, seo: { ...content.seo, variants: content.seo.variants.map((item, rowIndex) => (rowIndex === index ? { ...item, description: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Canonical URL">
                    <input className="crm-field" value={row.canonical} onChange={(event) => patchContent({ ...content, seo: { ...content.seo, variants: content.seo.variants.map((item, rowIndex) => (rowIndex === index ? { ...item, canonical: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.seo.variants.length,
                    () => patchContent({ ...content, seo: { ...content.seo, variants: moveItem(content.seo.variants, index, -1) } }),
                    () => patchContent({ ...content, seo: { ...content.seo, variants: moveItem(content.seo.variants, index, 1) } }),
                    () => patchContent({ ...content, seo: { ...content.seo, variants: content.seo.variants.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, seo: { ...content.seo, variants: [...content.seo.variants, { locale: "", title: "", description: "", canonical: "" }] } })}>
                เพิ่ม language variant
              </button>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={content.bilingualPublish} onChange={(event) => patchContent({ ...content, bilingualPublish: event.target.checked })} /> ต้องมีไทยและอังกฤษก่อนเผยแพร่
                </span>
              </label>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={content.approvals.clientNames} onChange={(event) => patchContent({ ...content, approvals: { ...content.approvals, clientNames: event.target.checked } })} /> อนุมัติชื่อโรงแรม / ลูกค้า
                </span>
              </label>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={content.approvals.teamPhotos} onChange={(event) => patchContent({ ...content, approvals: { ...content.approvals, teamPhotos: event.target.checked } })} /> อนุมัติรูปทีม
                </span>
              </label>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={content.approvals.clientLogos} onChange={(event) => patchContent({ ...content, approvals: { ...content.approvals, clientLogos: event.target.checked } })} /> อนุมัติโลโก้ลูกค้า
                </span>
              </label>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={content.approvals.results} onChange={(event) => patchContent({ ...content, approvals: { ...content.approvals, results: event.target.checked } })} /> อนุมัติผลลัพธ์
                </span>
              </label>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={content.approvals.performanceClaims} onChange={(event) => patchContent({ ...content, approvals: { ...content.approvals, performanceClaims: event.target.checked } })} /> อนุมัติข้อความการันตีผลประกอบการ พร้อมหลักฐาน
                </span>
              </label>
              <Field label="หมายเหตุแหล่งที่มา / อนุมัติ">
                <textarea className="crm-field" rows={3} value={content.approvals.evidenceNote} onChange={(event) => patchContent({ ...content, approvals: { ...content.approvals, evidenceNote: event.target.value } })} />
              </Field>
              <p>สถานะปัจจุบัน: {meta.status}{updatedAt ? ` · อัปเดต ${updatedAt}` : ""}</p>
              <p>
                <a href={previewHref}>ดูตัวอย่างในระบบ</a>
                {" · "}
                <a href={publicHref} target="_blank" rel="noreferrer">
                  หน้าสาธารณะ
                </a>
              </p>
              {locales.length ? (
                <ul>
                  {locales.map((row) => (
                    <li key={row.id}>
                      {row.locale} — {row.status} — {row.title}
                    </li>
                  ))}
                </ul>
              ) : null}
              <VisualFields slot="social" visual={content.seo.social} hint="รูปแชร์โซเชียล 1200×630" />
            </section>
          ) : null}
        </div>
        {saveBar}
      </form>
      {dialog ? (
        <div className="crm-dialog" role="dialog" aria-modal="true" aria-labelledby="independent-hotel-dialog-title">
          <div className="crm-dialog-card">
            <h2 id="independent-hotel-dialog-title">{dialog === "unpublish" ? "ยกเลิกเผยแพร่" : "คัดลอกไปภาษาอื่น"}</h2>
            {dialog === "unpublish" ? (
              <p>หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ดจนกว่าจะเผยแพร่อีกครั้ง</p>
            ) : (
              <Field label="ภาษาปลายทาง">
                <select className="crm-field" value={targetLocale} onChange={(event) => setTargetLocale(event.target.value)}>
                  {LOCALE_OPTIONS.filter((item) => item.id !== meta.locale).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            <div className="crm-cs-metric-actions">
              <button type="button" className="crm-users-secondary" onClick={() => setDialog(null)}>
                ยกเลิก
              </button>
              <button
                type="button"
                className="kpi-button"
                style={{ background: "#a2dc25", color: "#1a3a02" }}
                onClick={() => {
                  const next = dialog;
                  setDialog(null);
                  if (next === "unpublish") submit("unpublish");
                  else duplicateToLocale();
                }}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
