"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  SYSTEMS_CMS_KPI_STATUSES,
  SYSTEMS_CMS_SOURCE_STATUSES,
  hotelSystemsCmsErrorMessage,
  hotelSystemsCmsNotice,
  newSystemsItemId,
  type CmsSystemsFormLabels,
  type CmsSystemsPage,
  type CmsSystemsVisual,
  type SystemsCmsIntent,
  type SystemsCmsSaveResult,
  type HotelSystemsEditorState,
} from "@/lib/cms/hotel-systems-page";
import { SYSTEMS_HANDOVER_CHECKLIST_STATUSES, SYSTEMS_INVENTORY_ENVIRONMENTS, SYSTEMS_LANDSCAPE_STATUSES, SYSTEMS_MAPPING_STATUSES, SYSTEMS_OWNERSHIP_STATUSES, SYSTEMS_PLATFORM_STATUSES, SYSTEMS_READINESS_STATUSES, SYSTEMS_REVIEW_STATUSES, SYSTEMS_TESTING_SEVERITIES, SYSTEMS_TESTING_STATUSES, type SystemsVisualStatus } from "@/lib/hotel-systems";

const VISUAL_STATUS_OPTIONS: Array<{ value: SystemsVisualStatus; label: string }> = [
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
  { id: "assessment", label: "Systems Review" },
  { id: "services", label: "Landscape" },
  { id: "model", label: "Before / After" },
  { id: "deliverables", label: "Readiness" },
  { id: "workflow", label: "Workflow" },
  { id: "fit", label: "Platforms" },
  { id: "inventory", label: "Inventory" },
  { id: "scope", label: "Boundary" },
  { id: "plan", label: "Handover" },
  { id: "testing", label: "Testing / QA" },
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
  | "inventory"
  | "scope"
  | "plan"
  | "testing"
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
  inventory: "inventoryImageFile",
  scope: "scopeImageFile",
  plan: "planImageFile",
  testing: "testingImageFile",
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
  inventory: "clearInventoryImage",
  scope: "clearScopeImage",
  plan: "clearPlanImage",
  testing: "clearTestingImage",
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
  return { id: newSystemsItemId(prefix), th: "", en: "" };
}

export function HotelSystemsPageEditor({
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
  initial: HotelSystemsEditorState;
  notice?: string;
  error?: string;
  saveAction: (formData: FormData) => Promise<SystemsCmsSaveResult>;
  duplicateAction: (formData: FormData) => Promise<SystemsCmsSaveResult>;
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
  const [content, setContent] = useState<CmsSystemsPage>(initial.content);
  const [status, setStatus] = useState(error ? hotelSystemsCmsErrorMessage(error) : "");
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
    inventory: initial.content.inventory.visual.src,
    scope: initial.content.scope.visual.src,
    plan: initial.content.plan.visual.src,
    testing: initial.content.testing.visual.src,
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
    inventory: false,
    scope: false,
    plan: false,
    testing: false,
    related: false,
    form: false,
    social: false,
  });

  function markDirty() {
    setDirty(true);
    setOk("");
  }

  function patchContent(next: CmsSystemsPage) {
    setContent(next);
    markDirty();
  }

  function patchLabels(patch: Partial<CmsSystemsFormLabels>) {
    patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, ...patch } } });
  }

  function patchVisual(slot: VisualSlot, visual: CmsSystemsVisual) {
    if (slot === "hero") patchContent({ ...content, hero: { ...content.hero, visual } });
    else if (slot === "assessment") patchContent({ ...content, assessment: { ...content.assessment, visual } });
    else if (slot === "services") patchContent({ ...content, services: { ...content.services, visual } });
    else if (slot === "model") patchContent({ ...content, model: { ...content.model, visual } });
    else if (slot === "deliverables") patchContent({ ...content, deliverables: { ...content.deliverables, visual } });
    else if (slot === "workflow") patchContent({ ...content, workflow: { ...content.workflow, visual } });
    else if (slot === "fit") patchContent({ ...content, fit: { ...content.fit, visual } });
    else if (slot === "inventory") patchContent({ ...content, inventory: { ...content.inventory, visual } });
    else if (slot === "scope") patchContent({ ...content, scope: { ...content.scope, visual } });
    else if (slot === "plan") patchContent({ ...content, plan: { ...content.plan, visual } });
    else if (slot === "testing") patchContent({ ...content, testing: { ...content.testing, visual } });
    else if (slot === "related") patchContent({ ...content, related: { ...content.related, visual } });
    else if (slot === "form") patchContent({ ...content, form: { ...content.form, visual } });
    else patchContent({ ...content, seo: { ...content.seo, social: visual } });
  }

  function VisualFields({ slot, visual, hint }: { slot: VisualSlot; visual: CmsSystemsVisual; hint: string }) {
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
            onChange={(event) => patchVisual(slot, { ...visual, status: event.target.value as SystemsVisualStatus })}
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
        <label className="crm-cms-field">
          <span>
            <input
              type="checkbox"
              checked={Boolean(visual.publicationApproved)}
              onChange={(event) => patchVisual(slot, { ...visual, publicationApproved: event.target.checked })}
            />{" "}
            อนุมัติเผยแพร่ภาพโรงแรมหรือระบบจริง / Publication approval for real hotel or system screenshots
          </span>
        </label>
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

  function submit(intent: SystemsCmsIntent) {
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
        setStatus(hotelSystemsCmsErrorMessage(result.error));
        return;
      }
      if (intent === "publish") setMeta((current) => ({ ...current, status: "published" }));
      if (intent === "draft" || intent === "unpublish") setMeta((current) => ({ ...current, status: "draft" }));
      setOk(intent === "preview" ? hotelSystemsCmsNotice("preview") : hotelSystemsCmsNotice("saved"));
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
        setStatus(hotelSystemsCmsErrorMessage(result.error));
        return;
      }
      setOk(hotelSystemsCmsNotice("duplicate"));
      setDirty(false);
      router.push(`/crm/cms/pages/${result.id}?tab=hero`);
    });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = (submitter?.value as SystemsCmsIntent) || "save";
    if (intent === "unpublish") {
      setDialog("unpublish");
      return;
    }
    submit(intent);
  }

  const saveButtons = (
    <>
      <button className="kpi-button" type="submit" name="intent" value="save" disabled={pending} style={{ background: "#a2dc25", color: "#1a3a02" }}>
        {pending ? hotelSystemsCmsNotice("pending") : "บันทึก / Save"}
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
        {pending ? hotelSystemsCmsNotice("pending") : status || (dirty ? hotelSystemsCmsNotice("dirty") : ok || hotelSystemsCmsNotice("ready"))}
      </p>
    </div>
  );

  return (
    <div className="crm-cs-editor-shell">
      <nav className="crm-cs-tabs" role="tablist" aria-label="ส่วนของหน้า Hotel Systems Implementation">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            id={`hotel-systems-cms-tab-${item.id}`}
            role="tab"
            aria-selected={tab === item.id}
            aria-controls="hotel-systems-cms-panel"
            className={tab === item.id ? "crm-cs-tab is-active" : "crm-cs-tab"}
            style={tab === item.id ? { background: "#a2dc25", color: "#1a3a02", borderColor: "#a2dc25" } : undefined}
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
        <div id="hotel-systems-cms-panel" role="tabpanel" aria-labelledby={`hotel-systems-cms-tab-${tab}`}>
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
              <VisualFields slot="hero" visual={content.hero.visual} hint="1600×1000 · แผนภาพสถาปัตยกรรมหรือ Data Flow ที่อนุมัติ ไม่ใช่รูปโน้ตบุ๊กหรือประชุม" />
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
                  <Field label="Status">
                    <select
                      className="crm-field"
                      value={row.status || "needs_review"}
                      onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, status: event.target.value } : item)) } })}
                    >
                      {SYSTEMS_REVIEW_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="หลักฐานไทย">
                    <input className="crm-field" value={row.evidenceTh} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, evidenceTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Evidence (EN)">
                    <input className="crm-field" value={row.evidenceEn} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, evidenceEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผู้รับผิดชอบไทย">
                    <input className="crm-field" value={row.ownerTh} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner (EN)">
                    <input className="crm-field" value={row.ownerEn} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ขั้นตอนถัดไปที่แนะนำ (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.actionTh} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, actionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Recommended next action (EN)">
                    <textarea className="crm-field" rows={2} value={row.actionEn} onChange={(event) => patchContent({ ...content, assessment: { ...content.assessment, rows: content.assessment.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, actionEn: event.target.value } : item)) } })} />
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
                        { id: newSystemsItemId("assessment"), num: String(content.assessment.rows.length + 1).padStart(2, "0"), titleTh: "", titleEn: "", questionTh: "", questionEn: "", symptomTh: "", symptomEn: "", supportTh: "", supportEn: "", output: "", status: "needs_review", evidenceTh: "", evidenceEn: "", ownerTh: "", ownerEn: "", actionTh: "", actionEn: "" },
                      ],
                    },
                  })
                }
              >
                เพิ่มกลุ่มประเมิน
              </button>
              <VisualFields slot="assessment" visual={content.assessment.visual} hint="1200×800 · Data Consistency Audit / เทียบห้อง-ราคา-ห้องว่าง ที่อนุมัติ ต้องต่างจาก Hero และไม่ใช่รูปประชุมหรือผลวินิจฉัยโรงแรมจริง" />
            </section>
          ) : null}
          {tab === "services" ? (
            <section className="crm-cms-block">
              <h2>Hotel Systems Landscape</h2>
              <p className="crm-cms-editor-note">แผนภาพ HTML/CSS เป็นหลัก โหนดใช้รหัส guest, website, engine, pms, cm, ota, reporting, team · หน้าสาธารณะไม่แสดง workstream เป็นการ์ดแยก</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.services.title} onChange={(event) => patchContent({ ...content, services: { ...content.services, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.services.lead} onChange={(event) => patchContent({ ...content, services: { ...content.services, lead: event.target.value } })} />
              </Field>
              <Field label="Data Flow note / Boundary">
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
                      workstreams: [...content.services.workstreams, { id: newSystemsItemId("stream"), num: String(content.services.workstreams.length + 1).padStart(2, "0"), titleTh: "", titleEn: "", bulletsTh: "", bulletsEn: "" }],
                    },
                  })
                }
              >
                เพิ่ม workstream
              </button>
              {content.services.items.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`โหนด ${index + 1} · id (guest, website, engine, pms, cm, ota, reporting, team)`}>
                    <input className="crm-field" value={row.id} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, id: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="grid area / stream">
                    <input className="crm-field" value={row.stream} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, stream: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หัวข้อไทย">
                    <input className="crm-field" value={row.titleTh} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, titleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Title (EN)">
                    <input className="crm-field" value={row.titleEn} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, titleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="บทบาท / Role (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.roleTh || ""} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, roleTh: event.target.value, actionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Role (EN)">
                    <textarea className="crm-field" rows={2} value={row.roleEn || ""} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, roleEn: event.target.value, actionEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ข้อมูลเข้า / Data In (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.inputTh} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, inputTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Data In (EN)">
                    <textarea className="crm-field" rows={2} value={row.inputEn} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, inputEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ข้อมูลออก / Data Out (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.dataOutTh || ""} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, dataOutTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Data Out (EN)">
                    <textarea className="crm-field" rows={2} value={row.dataOutEn || ""} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, dataOutEn: event.target.value, output: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Source of Truth (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.sourceOfTruthTh || ""} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, sourceOfTruthTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Source of Truth (EN)">
                    <textarea className="crm-field" rows={2} value={row.sourceOfTruthEn || ""} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, sourceOfTruthEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผู้รับผิดชอบ (ไทย)">
                    <input className="crm-field" value={row.ownerTh} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner (EN)">
                    <input className="crm-field" value={row.ownerEn} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Integration status" hint="ห้ามเลือก Connected ถ้ายังไม่ตรวจทางเทคนิค">
                    <select
                      className="crm-field"
                      value={row.status || "not_configured"}
                      onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, status: event.target.value } : item)) } })}
                    >
                      {SYSTEMS_LANDSCAPE_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <label className="crm-cms-field">
                    <span>
                      <input
                        type="checkbox"
                        checked={Boolean(row.verified)}
                        onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, verified: event.target.checked } : item)) } })}
                      />{" "}
                      ตรวจทางเทคนิคแล้ว / Verified by provider or project data
                    </span>
                  </label>
                  <Field label="การพึ่งพาผู้ให้บริการ (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.providerTh || ""} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, providerTh: event.target.value, approvalTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Provider dependency (EN)">
                    <textarea className="crm-field" rows={2} value={row.providerEn || ""} onChange={(event) => patchContent({ ...content, services: { ...content.services, items: content.services.items.map((item, rowIndex) => (rowIndex === index ? { ...item, providerEn: event.target.value, approvalEn: event.target.value } : item)) } })} />
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
                      items: [
                        ...content.services.items,
                        {
                          id: newSystemsItemId("node"),
                          stream: "",
                          titleTh: "",
                          titleEn: "",
                          inputTh: "",
                          inputEn: "",
                          actionTh: "",
                          actionEn: "",
                          output: "",
                          approvalTh: "",
                          approvalEn: "",
                          ownerTh: "",
                          ownerEn: "",
                          roleTh: "",
                          roleEn: "",
                          dataOutTh: "",
                          dataOutEn: "",
                          sourceOfTruthTh: "",
                          sourceOfTruthEn: "",
                          status: "not_configured",
                          providerTh: "",
                          providerEn: "",
                          verified: false,
                        },
                      ],
                    },
                  })
                }
              >
                เพิ่มโหนดระบบ
              </button>
              <Field label="เส้นทางรวม / Path label">
                <input className="crm-field" value={content.services.pathLabel || ""} onChange={(event) => patchContent({ ...content, services: { ...content.services, pathLabel: event.target.value } })} />
              </Field>
              {(content.services.categories || []).map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`หมวดข้อมูล ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.th} onChange={(event) => patchContent({ ...content, services: { ...content.services, categories: content.services.categories.map((item, rowIndex) => (rowIndex === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Data category (EN)">
                    <input className="crm-field" value={row.en} onChange={(event) => patchContent({ ...content, services: { ...content.services, categories: content.services.categories.map((item, rowIndex) => (rowIndex === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.services.categories.length,
                    () => patchContent({ ...content, services: { ...content.services, categories: moveItem(content.services.categories, index, -1) } }),
                    () => patchContent({ ...content, services: { ...content.services, categories: moveItem(content.services.categories, index, 1) } }),
                    () => patchContent({ ...content, services: { ...content.services, categories: content.services.categories.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, services: { ...content.services, categories: [...(content.services.categories || []), { id: newSystemsItemId("cat"), th: "", en: "" }] } })}>
                เพิ่มหมวดข้อมูล
              </button>
              {(content.services.connections || []).map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`เส้นเชื่อม ${index + 1} · จาก (node id)`}>
                    <input className="crm-field" value={row.from} onChange={(event) => patchContent({ ...content, services: { ...content.services, connections: content.services.connections.map((item, rowIndex) => (rowIndex === index ? { ...item, from: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ถึง (node id)">
                    <input className="crm-field" value={row.to} onChange={(event) => patchContent({ ...content, services: { ...content.services, connections: content.services.connections.map((item, rowIndex) => (rowIndex === index ? { ...item, to: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ป้ายเส้นเชื่อม (ไทย)">
                    <input className="crm-field" value={row.labelTh} onChange={(event) => patchContent({ ...content, services: { ...content.services, connections: content.services.connections.map((item, rowIndex) => (rowIndex === index ? { ...item, labelTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Connection label (EN)">
                    <input className="crm-field" value={row.labelEn} onChange={(event) => patchContent({ ...content, services: { ...content.services, connections: content.services.connections.map((item, rowIndex) => (rowIndex === index ? { ...item, labelEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.services.connections.length,
                    () => patchContent({ ...content, services: { ...content.services, connections: moveItem(content.services.connections, index, -1) } }),
                    () => patchContent({ ...content, services: { ...content.services, connections: moveItem(content.services.connections, index, 1) } }),
                    () => patchContent({ ...content, services: { ...content.services, connections: content.services.connections.filter((_, rowIndex) => rowIndex !== index) } }),
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
                      connections: [...(content.services.connections || []), { id: newSystemsItemId("link"), from: "", to: "", labelTh: "", labelEn: "" }],
                    },
                  })
                }
              >
                เพิ่มเส้นเชื่อม
              </button>
              <VisualFields slot="services" visual={content.services.visual} hint="Dummy 1600×900 · 16:9 · /images/hotel-systems-landscape-placeholder.webp · หน้าสาธารณะใช้ HTML diagram เป็นหลัก ไม่ใช้รูป AI ที่มีตัวอักษรเล็ก และต้องต่างจาก Hero / Review" />
            </section>
          ) : null}
          {tab === "model" ? (
            <section className="crm-cms-block">
              <h2>Before / After</h2>
              <p className="crm-cms-editor-note">แผนภาพ HTML/CSS เป็นหลัก · After หมายถึงเส้นทางที่จัดการและตรวจแล้วในขอบเขตที่ตกลง ไม่ได้หมายความว่าระบบทุกตัวทำงานอัตโนมัติ</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.model.title} onChange={(event) => patchContent({ ...content, model: { ...content.model, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.model.lead || ""} onChange={(event) => patchContent({ ...content, model: { ...content.model, lead: event.target.value } })} />
              </Field>
              <Field label="ข้อความอธิบาย / Note">
                <textarea className="crm-field" rows={3} value={content.model.note || ""} onChange={(event) => patchContent({ ...content, model: { ...content.model, note: event.target.value } })} />
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
                    model: { ...content.model, steps: [...content.model.steps, { id: newSystemsItemId("model"), num: String(content.model.steps.length + 1).padStart(2, "0"), label: "", titleTh: "", titleEn: "", output: "" }] },
                  })
                }
              >
                เพิ่มขั้น After
              </button>
              {(content.model.fields || []).map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`ฟิลด์ ${index + 1} · id (connected, mapping, provider, manual, next-owner)`}>
                    <input className="crm-field" value={row.id} onChange={(event) => patchContent({ ...content, model: { ...content.model, fields: content.model.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, id: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หัวข้อไทย">
                    <input className="crm-field" value={row.titleTh || ""} onChange={(event) => patchContent({ ...content, model: { ...content.model, fields: content.model.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, titleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Title (EN)">
                    <input className="crm-field" value={row.titleEn || ""} onChange={(event) => patchContent({ ...content, model: { ...content.model, fields: content.model.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, titleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="รายละเอียดไทย">
                    <textarea className="crm-field" rows={2} value={row.bodyTh || ""} onChange={(event) => patchContent({ ...content, model: { ...content.model, fields: content.model.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, bodyTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Detail (EN)">
                    <textarea className="crm-field" rows={2} value={row.bodyEn || ""} onChange={(event) => patchContent({ ...content, model: { ...content.model, fields: content.model.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, bodyEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผู้รับผิดชอบ (ไทย)">
                    <input className="crm-field" value={row.ownerTh || ""} onChange={(event) => patchContent({ ...content, model: { ...content.model, fields: content.model.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner (EN)">
                    <input className="crm-field" value={row.ownerEn || ""} onChange={(event) => patchContent({ ...content, model: { ...content.model, fields: content.model.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Status">
                    <select
                      className="crm-field"
                      value={row.status || "not_configured"}
                      onChange={(event) => patchContent({ ...content, model: { ...content.model, fields: content.model.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, status: event.target.value } : item)) } })}
                    >
                      {SYSTEMS_LANDSCAPE_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {listActions(
                    index,
                    content.model.fields.length,
                    () => patchContent({ ...content, model: { ...content.model, fields: moveItem(content.model.fields, index, -1) } }),
                    () => patchContent({ ...content, model: { ...content.model, fields: moveItem(content.model.fields, index, 1) } }),
                    () => patchContent({ ...content, model: { ...content.model, fields: content.model.fields.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    model: {
                      ...content.model,
                      fields: [
                        ...(content.model.fields || []),
                        { id: newSystemsItemId("field"), titleTh: "", titleEn: "", bodyTh: "", bodyEn: "", ownerTh: "", ownerEn: "", status: "not_configured" },
                      ],
                    },
                  })
                }
              >
                เพิ่มฟิลด์ Before / After
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
              <VisualFields slot="model" visual={content.model.visual} hint="Dummy 1600×900 · 16:9 · /images/hotel-systems-before-after-placeholder.webp · หน้าสาธารณะใช้ HTML diagram เป็นหลัก ไม่ใช้สต็อกโฟโต้ และต้องต่างจาก Hero / Review / Landscape" />
            </section>
          ) : null}
          {tab === "deliverables" ? (
            <section className="crm-cms-block">
              <h2>Implementation Readiness</h2>
              <p className="crm-cms-editor-note">ตาราง HTML เป็นหลัก · อย่าทำเครื่องหมาย Ready ทั้งแถวถ้ายังไม่ได้ตรวจ · รหัสแถว current-systems, data-mapping, access, integration, testing, ownership</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.deliverables.title} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.deliverables.lead} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, lead: event.target.value } })} />
              </Field>
              {content.deliverables.rows.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`แถว ${index + 1} · id`}>
                    <input className="crm-field" value={row.id} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, id: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ด้านงานไทย / Area (TH)">
                    <input className="crm-field" value={row.areaTh} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, areaTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Area (EN)">
                    <input className="crm-field" value={row.areaEn} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, areaEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สิ่งที่ต้องตรวจ (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.inspectTh || ""} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, inspectTh: event.target.value, supportTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="What to check (EN)">
                    <textarea className="crm-field" rows={2} value={row.inspectEn || ""} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, inspectEn: event.target.value, supportEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หลักฐานไทย">
                    <input className="crm-field" value={row.evidenceTh || ""} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, evidenceTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Evidence (EN)">
                    <input className="crm-field" value={row.evidenceEn || ""} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, evidenceEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Current status">
                    <select
                      className="crm-field"
                      value={row.status || "needs_review"}
                      onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, status: event.target.value } : item)) } })}
                    >
                      {SYSTEMS_READINESS_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="ผู้รับผิดชอบ (ไทย)">
                    <input className="crm-field" value={row.ownerTh || ""} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner (EN)">
                    <input className="crm-field" value={row.ownerEn || ""} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="งานถัดไป (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.actionTh || ""} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, actionTh: event.target.value, approvalTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Next action (EN)">
                    <textarea className="crm-field" rows={2} value={row.actionEn || ""} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, actionEn: event.target.value, approvalEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผลลัพธ์ / Output">
                    <input className="crm-field" value={row.output || row.deliverable || ""} onChange={(event) => patchContent({ ...content, deliverables: { ...content.deliverables, rows: content.deliverables.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, output: event.target.value, deliverable: event.target.value } : item)) } })} />
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
                    deliverables: {
                      ...content.deliverables,
                      rows: [
                        ...content.deliverables.rows,
                        {
                          id: newSystemsItemId("ready"),
                          areaTh: "",
                          areaEn: "",
                          inspectTh: "",
                          inspectEn: "",
                          evidenceTh: "",
                          evidenceEn: "",
                          status: "needs_review",
                          ownerTh: "",
                          ownerEn: "",
                          actionTh: "",
                          actionEn: "",
                          output: "",
                          supportTh: "",
                          supportEn: "",
                          deliverable: "",
                          approvalTh: "",
                          approvalEn: "",
                        },
                      ],
                    },
                  })
                }
              >
                เพิ่มแถวความพร้อม
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
              <VisualFields slot="deliverables" visual={content.deliverables.visual} hint="Dummy 1600×900 · 16:9 · /images/hotel-systems-readiness-matrix-placeholder.webp · หน้าสาธารณะใช้ตาราง HTML เป็นหลัก ไม่ใช้รูปตัวอักษรเล็ก และต้องต่างจาก Hero / Review / Landscape / Before-After" />
            </section>
          ) : null}
          {tab === "workflow" ? (
            <section className="crm-cms-block">
              <h2>Hotel Systems Implementation Workflow</h2>
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
                  <Field label="ข้อจำกัด (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.dependencyTh || ""} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, dependencyTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Dependency (EN)">
                    <textarea className="crm-field" rows={2} value={row.dependencyEn || ""} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, rowIndex) => (rowIndex === index ? { ...item, dependencyEn: event.target.value } : item)) } })} />
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
                      steps: [...content.workflow.steps, { id: newSystemsItemId("workflow"), num: String(content.workflow.steps.length + 1).padStart(2, "0"), label: "", titleTh: "", titleEn: "", bodyTh: "", bodyEn: "", ownerTh: "", ownerEn: "", inputTh: "", inputEn: "", actionTh: "", actionEn: "", output: "", approvalTh: "", approvalEn: "", dependencyTh: "", dependencyEn: "", nextTh: "", nextEn: "" }],
                    },
                  })
                }
              >
                เพิ่มขั้นตอน Workflow
              </button>
              <Field label="หัวข้อ Go-live gate">
                <input className="crm-field" value={content.workflow.gateTitle || ""} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, gateTitle: event.target.value } })} />
              </Field>
              <Field label="ข้อความ Go-live gate">
                <textarea className="crm-field" rows={3} value={content.workflow.gate || ""} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, gate: event.target.value } })} />
              </Field>
              <Field label="หัวข้อจุดอนุมัติ / รายการ gate">
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
              <VisualFields slot="workflow" visual={content.workflow.visual} hint="Dummy 1600×900 · 16:9 · /images/hotel-systems-implementation-workflow-placeholder.webp · แสดงประมาณ 640×360 px · หน้าสาธารณะใช้ไทม์ไลน์ HTML, แผนที่ส่งต่อ และการ์ดผลลัพธ์ เป็นหลัก ไม่ใช้รูปทีมประชุม และต้องต่างจาก Hero / Review / Landscape / Before-After / Readiness" />
            </section>
          ) : null}
          {tab === "fit" ? (
            <section className="crm-cms-block">
              <h2>Hotel Technology Landscape</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.fit.title} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.fit.lead} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, lead: event.target.value } })} />
              </Field>
              {content.fit.scenarios.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`หมวด ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.categoryTh || row.situationTh || ""} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, categoryTh: event.target.value, situationTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Category (EN)">
                    <input className="crm-field" value={row.categoryEn || row.situationEn || ""} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, categoryEn: event.target.value, situationEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ตัวอย่างหรือระบบที่มีอยู่">
                    <input className="crm-field" value={row.example || row.output || ""} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, example: event.target.value, output: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Logo src (ใช้ <img> เมื่อมีไฟล์จริงใน /public เท่านั้น)">
                    <input className="crm-field" value={row.logoSrc || ""} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, logoSrc: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สถานะโลโก้ / Logo usage" hint="โลโก้ที่เผยแพร่ต้องเป็น Approved หรือ Sample">
                    <select className="crm-field" value={row.logoStatus || "replace"} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, logoStatus: event.target.value } : item)) } })}>
                      {VISUAL_STATUS_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="สถานะความสัมพันธ์ / Relationship status">
                    <select className="crm-field" value={row.relationshipStatus || row.integrationStatus || "example_category"} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, relationshipStatus: event.target.value } : item)) } })}>
                      {SYSTEMS_PLATFORM_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="บทบาท (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.roleTh || row.symptomTh || ""} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, roleTh: event.target.value, symptomTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Role (EN)">
                    <textarea className="crm-field" rows={2} value={row.roleEn || row.symptomEn || ""} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, roleEn: event.target.value, symptomEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="เส้นทางข้อมูล (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.flowTh || row.questionTh || ""} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, flowTh: event.target.value, questionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Possible data flow (EN)">
                    <textarea className="crm-field" rows={2} value={row.flowEn || row.questionEn || ""} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, flowEn: event.target.value, questionEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Integration status">
                    <select className="crm-field" value={row.integrationStatus || "example_category"} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, integrationStatus: event.target.value } : item)) } })}>
                      {SYSTEMS_PLATFORM_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Technical verification status">
                    <select className="crm-field" value={row.verificationStatus || "not_yet_verified"} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, verificationStatus: event.target.value } : item)) } })}>
                      {SYSTEMS_PLATFORM_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Provider dependency (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.providerTh || row.supportTh || ""} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, providerTh: event.target.value, supportTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Provider dependency (EN)">
                    <textarea className="crm-field" rows={2} value={row.providerEn || row.supportEn || ""} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, scenarios: content.fit.scenarios.map((item, rowIndex) => (rowIndex === index ? { ...item, providerEn: event.target.value, supportEn: event.target.value } : item)) } })} />
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
                    fit: {
                      ...content.fit,
                      scenarios: [
                        ...content.fit.scenarios,
                        {
                          id: newSystemsItemId("fit"),
                          categoryTh: "",
                          categoryEn: "",
                          example: "",
                          logoSrc: "",
                          roleTh: "",
                          roleEn: "",
                          flowTh: "",
                          flowEn: "",
                          integrationStatus: "example_category",
                          verificationStatus: "not_yet_verified",
                          logoStatus: "replace",
                          relationshipStatus: "example_category",
                          providerTh: "",
                          providerEn: "",
                          situationTh: "",
                          situationEn: "",
                          symptomTh: "",
                          symptomEn: "",
                          questionTh: "",
                          questionEn: "",
                          supportTh: "",
                          supportEn: "",
                          output: "",
                        },
                      ],
                    },
                  })
                }
              >
                เพิ่มหมวดแพลตฟอร์ม
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
              <VisualFields slot="fit" visual={content.fit.visual} hint="Dummy 1600×900 · 16:9 · /images/hotel-systems-platform-landscape-placeholder.webp · แสดงประมาณ 720×405 px · หน้าสาธารณะใช้แผนที่หมวด HTML เป็นหลัก ไม่ใช้โลโก้วอลล์ และต้องต่างจาก Hero / Review / Landscape / Before-After / Readiness / Workflow" />
            </section>
          ) : null}
          {tab === "inventory" ? (
            <section className="crm-cms-block">
              <h2>System Inventory and Data Dictionary</h2>
              <p className="crm-contact-image-hint">Sample data. Replace with approved hotel data. Subject to provider verification. Do not store account IDs, booking IDs, guest data, or passwords.</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.inventory.title} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.inventory.lead} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, lead: event.target.value } })} />
              </Field>
              <Field label="หัวข้อ System Inventory">
                <input className="crm-field" value={content.inventory.systemsTitle} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, systemsTitle: event.target.value } })} />
              </Field>
              {content.inventory.rows.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`ระบบ ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.systemTh} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, systemTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="System (EN)">
                    <input className="crm-field" value={row.systemEn} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, systemEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผู้ให้บริการ (ไทย)">
                    <input className="crm-field" value={row.providerTh} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, providerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Provider (EN)">
                    <input className="crm-field" value={row.providerEn} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, providerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="วัตถุประสงค์ (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.purposeTh} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, purposeTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Purpose (EN)">
                    <textarea className="crm-field" rows={2} value={row.purposeEn} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, purposeEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผู้รับผิดชอบ (ไทย)">
                    <input className="crm-field" value={row.ownerTh} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner (EN)">
                    <input className="crm-field" value={row.ownerEn} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ข้อมูลเข้า (ไทย)">
                    <input className="crm-field" value={row.dataInTh} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, dataInTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Data In (EN)">
                    <input className="crm-field" value={row.dataInEn} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, dataInEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ข้อมูลออก (ไทย)">
                    <input className="crm-field" value={row.dataOutTh} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, dataOutTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Data Out (EN)">
                    <input className="crm-field" value={row.dataOutEn} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, dataOutEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="API/Connector">
                    <input className="crm-field" value={row.connector} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, connector: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Environment">
                    <select className="crm-field" value={row.environment} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, environment: event.target.value } : item)) } })}>
                      {SYSTEMS_INVENTORY_ENVIRONMENTS.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Status" hint="Do not mark Connected unless project data confirms it">
                    <select className="crm-field" value={row.status} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, status: event.target.value } : item)) } })}>
                      {SYSTEMS_LANDSCAPE_STATUSES.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <label className="crm-cms-field">
                    <span>
                      <input
                        type="checkbox"
                        checked={Boolean(row.verified)}
                        onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, verified: event.target.checked } : item)) } })}
                      />{" "}
                      ตรวจทางเทคนิคแล้ว / Verified by provider or project data
                    </span>
                  </label>
                  <Field label="Last reviewed">
                    <input className="crm-field" value={row.reviewed} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, reviewed: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.inventory.rows.length,
                    () => patchContent({ ...content, inventory: { ...content.inventory, rows: moveItem(content.inventory.rows, index, -1) } }),
                    () => patchContent({ ...content, inventory: { ...content.inventory, rows: moveItem(content.inventory.rows, index, 1) } }),
                    () => patchContent({ ...content, inventory: { ...content.inventory, rows: content.inventory.rows.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    inventory: {
                      ...content.inventory,
                      rows: [
                        ...content.inventory.rows,
                        {
                          id: newSystemsItemId("inventory"),
                          systemTh: "",
                          systemEn: "",
                          providerTh: "",
                          providerEn: "",
                          purposeTh: "",
                          purposeEn: "",
                          ownerTh: "",
                          ownerEn: "",
                          dataInTh: "",
                          dataInEn: "",
                          dataOutTh: "",
                          dataOutEn: "",
                          connector: "Sample API / connector",
                          environment: "unknown",
                          status: "not_configured",
                          reviewed: "Sample — not a live review date",
                          verified: false,
                        },
                      ],
                    },
                  })
                }
              >
                เพิ่มระบบใน Inventory
              </button>
              <Field label="หัวข้อ Data Dictionary">
                <input className="crm-field" value={content.inventory.fieldsTitle} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, fieldsTitle: event.target.value } })} />
              </Field>
              {content.inventory.fields.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`Field name ${index + 1}`}>
                    <input className="crm-field" value={row.field} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, fields: content.inventory.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, field: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ความหมายทางธุรกิจ (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.meaningTh} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, fields: content.inventory.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, meaningTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Business meaning (EN)">
                    <textarea className="crm-field" rows={2} value={row.meaningEn} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, fields: content.inventory.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, meaningEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ระบบต้นทาง (ไทย)">
                    <input className="crm-field" value={row.sourceTh} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, fields: content.inventory.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, sourceTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Source system (EN)">
                    <input className="crm-field" value={row.sourceEn} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, fields: content.inventory.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, sourceEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ระบบปลายทาง (ไทย)">
                    <input className="crm-field" value={row.destinationTh} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, fields: content.inventory.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, destinationTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Destination system (EN)">
                    <input className="crm-field" value={row.destinationEn} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, fields: content.inventory.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, destinationEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Format/type">
                    <input className="crm-field" value={row.format} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, fields: content.inventory.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, format: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Required/optional">
                    <select className="crm-field" value={row.required} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, fields: content.inventory.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, required: event.target.value } : item)) } })}>
                      <option value="required">Required</option>
                      <option value="optional">Optional</option>
                    </select>
                  </Field>
                  <Field label="Mapping status">
                    <select className="crm-field" value={row.mappingStatus} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, fields: content.inventory.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, mappingStatus: event.target.value } : item)) } })}>
                      {SYSTEMS_MAPPING_STATUSES.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="ผู้รับผิดชอบ (ไทย)">
                    <input className="crm-field" value={row.ownerTh} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, fields: content.inventory.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner (EN)">
                    <input className="crm-field" value={row.ownerEn} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, fields: content.inventory.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หมายเหตุ (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.notesTh} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, fields: content.inventory.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, notesTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Notes (EN)">
                    <textarea className="crm-field" rows={2} value={row.notesEn} onChange={(event) => patchContent({ ...content, inventory: { ...content.inventory, fields: content.inventory.fields.map((item, rowIndex) => (rowIndex === index ? { ...item, notesEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.inventory.fields.length,
                    () => patchContent({ ...content, inventory: { ...content.inventory, fields: moveItem(content.inventory.fields, index, -1) } }),
                    () => patchContent({ ...content, inventory: { ...content.inventory, fields: moveItem(content.inventory.fields, index, 1) } }),
                    () => patchContent({ ...content, inventory: { ...content.inventory, fields: content.inventory.fields.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    inventory: {
                      ...content.inventory,
                      fields: [
                        ...content.inventory.fields,
                        {
                          id: newSystemsItemId("field"),
                          field: "",
                          meaningTh: "",
                          meaningEn: "",
                          sourceTh: "",
                          sourceEn: "",
                          destinationTh: "",
                          destinationEn: "",
                          format: "text",
                          required: "optional",
                          mappingStatus: "not_yet_verified",
                          ownerTh: "",
                          ownerEn: "",
                          notesTh: "",
                          notesEn: "",
                        },
                      ],
                    },
                  })
                }
              >
                เพิ่มฟิลด์ใน Data Dictionary
              </button>
              <VisualFields slot="inventory" visual={content.inventory.visual} hint="Dummy 1600×900 · 16:9 · /images/hotel-systems-inventory-mapping-placeholder.webp · แสดงประมาณ 720×405 px · หน้าสาธารณะใช้ตาราง HTML เป็นหลัก ไม่ใช้รูปตัวอักษรเล็ก และต้องต่างจาก Platforms / Scope" />
            </section>
          ) : null}
          {tab === "scope" ? (
            <section className="crm-cms-block">
              <h2>Integration Boundary and Responsibility Matrix</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.scope.title} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={4} value={content.scope.lead} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, lead: event.target.value } })} />
              </Field>
              <Field label="หัวข้อสิ่งที่อาจช่วย">
                <input className="crm-field" value={content.scope.supportTitle} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, supportTitle: event.target.value } })} />
              </Field>
              <Field label="หัวข้อความรับผิดชอบโรงแรม/ผู้ให้บริการ">
                <input className="crm-field" value={content.scope.hotelTitle} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, hotelTitle: event.target.value } })} />
              </Field>
              <Field label="หัวข้อตารางความรับผิดชอบ">
                <input className="crm-field" value={content.scope.matrixTitle} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrixTitle: event.target.value } })} />
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
                    <textarea className="crm-field" rows={9} value={row.itemsTh} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, rows: content.scope.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, itemsTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Items (EN, one per line)">
                    <textarea className="crm-field" rows={9} value={row.itemsEn} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, rows: content.scope.rows.map((item, rowIndex) => (rowIndex === index ? { ...item, itemsEn: event.target.value } : item)) } })} />
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
                    scope: { ...content.scope, rows: [...content.scope.rows, { id: newSystemsItemId("scope"), titleTh: "", titleEn: "", itemsTh: "", itemsEn: "" }] },
                  })
                }
              >
                เพิ่มกลุ่มขอบเขต
              </button>
              {(content.scope.matrix || []).map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`เหตุการณ์ ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.eventTh} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.map((item, rowIndex) => (rowIndex === index ? { ...item, eventTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Activity/event (EN)">
                    <input className="crm-field" value={row.eventEn} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.map((item, rowIndex) => (rowIndex === index ? { ...item, eventEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ทีมโรงแรม">
                    <textarea className="crm-field" rows={2} value={row.hotelTh} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.map((item, rowIndex) => (rowIndex === index ? { ...item, hotelTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Hotel team (EN)">
                    <textarea className="crm-field" rows={2} value={row.hotelEn} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.map((item, rowIndex) => (rowIndex === index ? { ...item, hotelEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผู้ให้บริการ">
                    <textarea className="crm-field" rows={2} value={row.providerTh} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.map((item, rowIndex) => (rowIndex === index ? { ...item, providerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Provider (EN)">
                    <textarea className="crm-field" rows={2} value={row.providerEn} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.map((item, rowIndex) => (rowIndex === index ? { ...item, providerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ทีมนำไปใช้">
                    <textarea className="crm-field" rows={2} value={row.implTh} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.map((item, rowIndex) => (rowIndex === index ? { ...item, implTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Implementation team (EN)">
                    <textarea className="crm-field" rows={2} value={row.implEn} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.map((item, rowIndex) => (rowIndex === index ? { ...item, implEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ต้องอนุมัติ">
                    <textarea className="crm-field" rows={2} value={row.approvalTh} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.map((item, rowIndex) => (rowIndex === index ? { ...item, approvalTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Approval required (EN)">
                    <textarea className="crm-field" rows={2} value={row.approvalEn} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.map((item, rowIndex) => (rowIndex === index ? { ...item, approvalEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="เส้นทางยกระดับ">
                    <textarea className="crm-field" rows={2} value={row.escalationTh} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.map((item, rowIndex) => (rowIndex === index ? { ...item, escalationTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Escalation path (EN)">
                    <textarea className="crm-field" rows={2} value={row.escalationEn} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.map((item, rowIndex) => (rowIndex === index ? { ...item, escalationEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผู้รับผิดชอบหลัก (ไทย)">
                    <input className="crm-field" value={row.ownerTh || ""} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner (EN)">
                    <input className="crm-field" value={row.ownerEn || ""} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Status">
                    <select className="crm-field" value={row.status || "documented_sample"} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.map((item, rowIndex) => (rowIndex === index ? { ...item, status: event.target.value } : item)) } })}>
                      {SYSTEMS_HANDOVER_CHECKLIST_STATUSES.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {listActions(
                    index,
                    content.scope.matrix.length,
                    () => patchContent({ ...content, scope: { ...content.scope, matrix: moveItem(content.scope.matrix, index, -1) } }),
                    () => patchContent({ ...content, scope: { ...content.scope, matrix: moveItem(content.scope.matrix, index, 1) } }),
                    () => patchContent({ ...content, scope: { ...content.scope, matrix: content.scope.matrix.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    scope: {
                      ...content.scope,
                      matrix: [
                        ...(content.scope.matrix || []),
                        {
                          id: newSystemsItemId("resp"),
                          eventTh: "",
                          eventEn: "",
                          hotelTh: "",
                          hotelEn: "",
                          providerTh: "",
                          providerEn: "",
                          implTh: "",
                          implEn: "",
                          approvalTh: "",
                          approvalEn: "",
                          escalationTh: "",
                          escalationEn: "",
                          ownerTh: "",
                          ownerEn: "",
                          status: "documented_sample",
                        },
                      ],
                    },
                  })
                }
              >
                เพิ่มเหตุการณ์ในตารางความรับผิดชอบ
              </button>
              <Field label="ขอบเขตงาน / Scope boundary" hint="ต้องไม่ว่างเมื่อเผยแพร่ และต้องไม่บอกว่าเดอะ เคพีไอ พลัสเป็นเจ้าของระบบภายนอก">
                <textarea className="crm-field" rows={3} value={content.scope.boundary} onChange={(event) => patchContent({ ...content, scope: { ...content.scope, boundary: event.target.value } })} />
              </Field>
              <VisualFields slot="scope" visual={content.scope.visual} hint="Dummy 1600×900 · 16:9 · /images/hotel-systems-implementation-responsibility-placeholder.webp · แสดงประมาณ 720×405 px · ป้าย Implementation Responsibility Matrix — Sample · หน้าสาธารณะใช้ตาราง HTML เป็นหลัก ไม่ใช้รูปตัวอักษรเล็ก และต้องต่างจาก Inventory / Testing" />
            </section>
          ) : null}
          {tab === "plan" ? (
            <section className="crm-cms-block">
              <h2>Handover and Ownership</h2>
              <p className="crm-contact-image-hint">Sample data. Store ownership metadata only. Do not store passwords, API keys, or credentials. Do not mark Live or Handed Over until hotel approval and required documentation are complete.</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.plan.title} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={4} value={content.plan.lead} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, lead: event.target.value } })} />
              </Field>
              <Field label="ข้อความปิด">
                <textarea className="crm-field" rows={2} value={content.plan.close} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, close: event.target.value } })} />
              </Field>
              <Field label="ป้าย Sample handover" hint="แสดงบนหน้าสาธารณะเสมอ">
                <input className="crm-field" value={content.plan.sampleLabel} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, sampleLabel: event.target.value } })} />
              </Field>
              <Field label="หัวข้อ Handover Checklist">
                <input className="crm-field" value={content.plan.checklistTitle} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, checklistTitle: event.target.value } })} />
              </Field>
              {(content.plan.checklist || []).map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`รายการ ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.itemTh} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, checklist: content.plan.checklist.map((item, rowIndex) => (rowIndex === index ? { ...item, itemTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Item (EN)">
                    <input className="crm-field" value={row.itemEn} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, checklist: content.plan.checklist.map((item, rowIndex) => (rowIndex === index ? { ...item, itemEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สถานะ" hint="Do not use Live or Handed Over until approvals and documentation are complete">
                    <select className="crm-field" value={row.status} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, checklist: content.plan.checklist.map((item, rowIndex) => (rowIndex === index ? { ...item, status: event.target.value } : item)) } })}>
                      {SYSTEMS_HANDOVER_CHECKLIST_STATUSES.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="ผู้รับผิดชอบ">
                    <input className="crm-field" value={row.ownerTh} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, checklist: content.plan.checklist.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner (EN)">
                    <input className="crm-field" value={row.ownerEn} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, checklist: content.plan.checklist.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หลักฐาน">
                    <textarea className="crm-field" rows={2} value={row.evidenceTh} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, checklist: content.plan.checklist.map((item, rowIndex) => (rowIndex === index ? { ...item, evidenceTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Evidence (EN)">
                    <textarea className="crm-field" rows={2} value={row.evidenceEn} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, checklist: content.plan.checklist.map((item, rowIndex) => (rowIndex === index ? { ...item, evidenceEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.plan.checklist.length,
                    () => patchContent({ ...content, plan: { ...content.plan, checklist: moveItem(content.plan.checklist, index, -1) } }),
                    () => patchContent({ ...content, plan: { ...content.plan, checklist: moveItem(content.plan.checklist, index, 1) } }),
                    () => patchContent({ ...content, plan: { ...content.plan, checklist: content.plan.checklist.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    plan: {
                      ...content.plan,
                      checklist: [
                        ...(content.plan.checklist || []),
                        { id: newSystemsItemId("handover"), itemTh: "", itemEn: "", status: "not_started", ownerTh: "", ownerEn: "", evidenceTh: "", evidenceEn: "" },
                      ],
                    },
                  })
                }
              >
                เพิ่มรายการส่งมอบ
              </button>
              <Field label="หัวข้อ Ownership">
                <input className="crm-field" value={content.plan.ownershipTitle} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, ownershipTitle: event.target.value } })} />
              </Field>
              {(content.plan.ownership || []).map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`ระบบ/สินทรัพย์ ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.assetTh} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, ownership: content.plan.ownership.map((item, rowIndex) => (rowIndex === index ? { ...item, assetTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="System/asset (EN)">
                    <input className="crm-field" value={row.assetEn} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, ownership: content.plan.ownership.map((item, rowIndex) => (rowIndex === index ? { ...item, assetEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="เจ้าของ">
                    <input className="crm-field" value={row.ownerTh} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, ownership: content.plan.ownership.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner (EN)">
                    <input className="crm-field" value={row.ownerEn} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, ownership: content.plan.ownership.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผู้ติดต่อด้านเทคนิค/แอดมิน" hint="บทบาทเท่านั้น ห้ามรหัสผ่าน">
                    <textarea className="crm-field" rows={2} value={row.contactTh} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, ownership: content.plan.ownership.map((item, rowIndex) => (rowIndex === index ? { ...item, contactTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Admin/technical contact (EN)">
                    <textarea className="crm-field" rows={2} value={row.contactEn} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, ownership: content.plan.ownership.map((item, rowIndex) => (rowIndex === index ? { ...item, contactEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผู้มีอำนาจอนุมัติ">
                    <input className="crm-field" value={row.approvalTh} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, ownership: content.plan.ownership.map((item, rowIndex) => (rowIndex === index ? { ...item, approvalTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Approval authority (EN)">
                    <input className="crm-field" value={row.approvalEn} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, ownership: content.plan.ownership.map((item, rowIndex) => (rowIndex === index ? { ...item, approvalEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ระดับสิทธิ์">
                    <input className="crm-field" value={row.accessTh} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, ownership: content.plan.ownership.map((item, rowIndex) => (rowIndex === index ? { ...item, accessTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Access level (EN)">
                    <input className="crm-field" value={row.accessEn} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, ownership: content.plan.ownership.map((item, rowIndex) => (rowIndex === index ? { ...item, accessEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผู้รับผิดชอบต่ออายุ/หมดอายุ">
                    <input className="crm-field" value={row.renewalTh} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, ownership: content.plan.ownership.map((item, rowIndex) => (rowIndex === index ? { ...item, renewalTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Renewal/expiry responsibility (EN)">
                    <input className="crm-field" value={row.renewalEn} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, ownership: content.plan.ownership.map((item, rowIndex) => (rowIndex === index ? { ...item, renewalEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ตรวจล่าสุด">
                    <input className="crm-field" value={row.reviewed} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, ownership: content.plan.ownership.map((item, rowIndex) => (rowIndex === index ? { ...item, reviewed: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สถานะส่งมอบ" hint="Do not use Live or Handed Over until approvals and documentation are complete">
                    <select className="crm-field" value={row.status} onChange={(event) => patchContent({ ...content, plan: { ...content.plan, ownership: content.plan.ownership.map((item, rowIndex) => (rowIndex === index ? { ...item, status: event.target.value } : item)) } })}>
                      {SYSTEMS_OWNERSHIP_STATUSES.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {listActions(
                    index,
                    content.plan.ownership.length,
                    () => patchContent({ ...content, plan: { ...content.plan, ownership: moveItem(content.plan.ownership, index, -1) } }),
                    () => patchContent({ ...content, plan: { ...content.plan, ownership: moveItem(content.plan.ownership, index, 1) } }),
                    () => patchContent({ ...content, plan: { ...content.plan, ownership: content.plan.ownership.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    plan: {
                      ...content.plan,
                      ownership: [
                        ...(content.plan.ownership || []),
                        {
                          id: newSystemsItemId("asset"),
                          assetTh: "",
                          assetEn: "",
                          ownerTh: "",
                          ownerEn: "",
                          contactTh: "",
                          contactEn: "",
                          approvalTh: "",
                          approvalEn: "",
                          accessTh: "",
                          accessEn: "",
                          renewalTh: "",
                          renewalEn: "",
                          reviewed: "Sample — not a live review date",
                          status: "not_handed_over",
                        },
                      ],
                    },
                  })
                }
              >
                เพิ่มสินทรัพย์ในตารางเจ้าของ
              </button>
              <VisualFields slot="plan" visual={content.plan.visual} hint="Dummy 1600×900 · 16:9 · /images/hotel-systems-handover-placeholder.webp · แสดงประมาณ 720×405 px · ป้าย Hotel Systems Handover and Ownership — Sample · หน้าสาธารณะใช้ตาราง HTML เป็นหลัก ไม่ใช้รูปตัวอักษรเล็ก และต้องต่างจาก Scope / Testing" />
            </section>
          ) : null}
          {tab === "testing" ? (
            <section className="crm-cms-block">
              <h2>Testing and QA</h2>
              <p className="crm-contact-image-hint">Sample data. Do not mark Passed unless the actual result or evidence is clearly labelled Sample. Do not store guest or payment data in evidence.</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.testing.title} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.testing.lead} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, lead: event.target.value } })} />
              </Field>
              <Field label="หัวข้อ Error Handling">
                <input className="crm-field" value={content.testing.errorTitle} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, errorTitle: event.target.value } })} />
              </Field>
              {content.testing.errorSteps.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`Error step ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.th} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, errorSteps: content.testing.errorSteps.map((item, rowIndex) => (rowIndex === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Error step (EN)">
                    <input className="crm-field" value={row.en} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, errorSteps: content.testing.errorSteps.map((item, rowIndex) => (rowIndex === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.testing.errorSteps.length,
                    () => patchContent({ ...content, testing: { ...content.testing, errorSteps: moveItem(content.testing.errorSteps, index, -1) } }),
                    () => patchContent({ ...content, testing: { ...content.testing, errorSteps: moveItem(content.testing.errorSteps, index, 1) } }),
                    () => patchContent({ ...content, testing: { ...content.testing, errorSteps: content.testing.errorSteps.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, testing: { ...content.testing, errorSteps: [...content.testing.errorSteps, emptyLine("error")] } })}>
                เพิ่มขั้น Error Handling
              </button>
              <Field label="หัวข้อ Test Cases">
                <input className="crm-field" value={content.testing.casesTitle} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, casesTitle: event.target.value } })} />
              </Field>
              {content.testing.cases.map((row, index) => (
                <article key={row.id} className="crm-cms-block">
                  <Field label={`Test case ${index + 1} (ไทย)`}>
                    <input className="crm-field" value={row.caseTh} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, caseTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Test case (EN)">
                    <input className="crm-field" value={row.caseEn} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, caseEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Trigger/input (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.triggerTh} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, triggerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Trigger/input (EN)">
                    <textarea className="crm-field" rows={2} value={row.triggerEn} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, triggerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Expected result (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.expectedTh} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, expectedTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Expected result (EN)">
                    <textarea className="crm-field" rows={2} value={row.expectedEn} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, expectedEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Actual result (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.actualTh} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, actualTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Actual result (EN)" hint="If Status is Passed, include the word Sample">
                    <textarea className="crm-field" rows={2} value={row.actualEn} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, actualEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Status">
                    <select className="crm-field" value={row.status} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, status: event.target.value } : item)) } })}>
                      {SYSTEMS_TESTING_STATUSES.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Owner (ไทย)">
                    <input className="crm-field" value={row.ownerTh} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner (EN)">
                    <input className="crm-field" value={row.ownerEn} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Evidence (ไทย)" hint="Do not store guest or payment data">
                    <textarea className="crm-field" rows={2} value={row.evidenceTh} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, evidenceTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Evidence (EN)">
                    <textarea className="crm-field" rows={2} value={row.evidenceEn} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, evidenceEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Tested date">
                    <input className="crm-field" value={row.testedDate} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, testedDate: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Issue/next action (ไทย)">
                    <textarea className="crm-field" rows={2} value={row.nextTh} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, nextTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Issue/next action (EN)">
                    <textarea className="crm-field" rows={2} value={row.nextEn} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, nextEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Issue description (ไทย)" hint="Required when Status is Failed">
                    <textarea className="crm-field" rows={2} value={row.issueTh} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, issueTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Issue description (EN)">
                    <textarea className="crm-field" rows={2} value={row.issueEn} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, issueEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Severity">
                    <select className="crm-field" value={row.severity} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, severity: event.target.value } : item)) } })}>
                      <option value="">—</option>
                      {SYSTEMS_TESTING_SEVERITIES.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Provider dependency (ไทย)">
                    <input className="crm-field" value={row.providerTh} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, providerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Provider dependency (EN)">
                    <input className="crm-field" value={row.providerEn} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, providerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Retest date">
                    <input className="crm-field" value={row.retestDate} onChange={(event) => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.map((item, rowIndex) => (rowIndex === index ? { ...item, retestDate: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.testing.cases.length,
                    () => patchContent({ ...content, testing: { ...content.testing, cases: moveItem(content.testing.cases, index, -1) } }),
                    () => patchContent({ ...content, testing: { ...content.testing, cases: moveItem(content.testing.cases, index, 1) } }),
                    () => patchContent({ ...content, testing: { ...content.testing, cases: content.testing.cases.filter((_, rowIndex) => rowIndex !== index) } }),
                  )}
                </article>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    testing: {
                      ...content.testing,
                      cases: [
                        ...content.testing.cases,
                        {
                          id: newSystemsItemId("test"),
                          caseTh: "",
                          caseEn: "",
                          triggerTh: "",
                          triggerEn: "",
                          expectedTh: "",
                          expectedEn: "",
                          actualTh: "ยังไม่ทดสอบ — ข้อมูลตัวอย่าง",
                          actualEn: "Not tested — sample only",
                          status: "not_tested",
                          ownerTh: "",
                          ownerEn: "",
                          evidenceTh: "หลักฐานตัวอย่างเท่านั้น ไม่มีข้อมูลแขกหรือข้อมูลชำระเงิน",
                          evidenceEn: "Sample evidence only. No guest or payment data",
                          testedDate: "Sample — not a live test date",
                          issueTh: "",
                          issueEn: "",
                          severity: "",
                          providerTh: "",
                          providerEn: "",
                          nextTh: "",
                          nextEn: "",
                          retestDate: "",
                        },
                      ],
                    },
                  })
                }
              >
                เพิ่มเคสทดสอบ
              </button>
              <VisualFields slot="testing" visual={content.testing.visual} hint="Dummy 1600×900 · 16:9 · /images/hotel-systems-testing-qa-placeholder.webp · แสดงประมาณ 720×405 px · หน้าสาธารณะใช้ตาราง HTML และ Error Handling flow เป็นหลัก" />
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
                      {SYSTEMS_CMS_KPI_STATUSES.map((status) => (
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
                    measure: { ...content.measure, kpis: [...content.measure.kpis, { id: newSystemsItemId("kpi"), nameTh: "", nameEn: "", period: "", market: "", source: "", definitionTh: "", definitionEn: "", unit: "", dataStatus: "draft", hideUntilData: true, publicationApproved: false }] },
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
                      {SYSTEMS_CMS_SOURCE_STATUSES.map((status) => (
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
                    measure: { ...content.measure, sources: [...content.measure.sources, { id: newSystemsItemId("source"), nameTh: "", nameEn: "", url: "", publishedAt: "", accessedAt: "", marketTh: "", marketEn: "", definitionTh: "", definitionEn: "", status: "guidance", approvalNote: "" }] },
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
                    related: { ...content.related, cards: [...content.related.cards, { id: newSystemsItemId("related"), href: "", titleTh: "", titleEn: "", bodyTh: "", bodyEn: "", ctaTh: "", ctaEn: "", publicationApproved: false }] },
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
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, form: { ...content.form, receive: [...content.form.receive, { id: newSystemsItemId("receive"), title: "", th: "", en: "" }] } })}>
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
              <Field label="ป้าย PMS">
                <input className="crm-field" value={content.form.labels.pms} onChange={(event) => patchLabels({ pms: event.target.value })} />
              </Field>
              <Field label="ป้าย Channel Manager">
                <input className="crm-field" value={content.form.labels.channelManager} onChange={(event) => patchLabels({ channelManager: event.target.value })} />
              </Field>
              <Field label="ป้าย Booking Engine">
                <input className="crm-field" value={content.form.labels.bookingEngine} onChange={(event) => patchLabels({ bookingEngine: event.target.value })} />
              </Field>
              <Field label="ป้ายระบบอื่นที่เกี่ยวข้อง">
                <input className="crm-field" value={content.form.labels.systems} onChange={(event) => patchLabels({ systems: event.target.value })} />
              </Field>
              <Field label="ป้ายผู้ติดต่อผู้ให้บริการหรือเจ้าของงานเทคนิค">
                <input className="crm-field" value={content.form.labels.providerContact} onChange={(event) => patchLabels({ providerContact: event.target.value })} />
              </Field>
              <Field label="ป้ายเป้าหมาย">
                <input className="crm-field" value={content.form.labels.goal} onChange={(event) => patchLabels({ goal: event.target.value })} />
              </Field>
              <Field label="ป้ายปัญหาหลัก">
                <input className="crm-field" value={content.form.labels.message} onChange={(event) => patchLabels({ message: event.target.value })} />
              </Field>
              <Field label="ข้อความยินยอม">
                <textarea className="crm-field" rows={2} value={content.form.labels.consent} onChange={(event) => patchLabels({ consent: event.target.value })} />
              </Field>
              <Field label="ป้ายนโยบายความเป็นส่วนตัว">
                <input className="crm-field" value={content.form.labels.privacy} onChange={(event) => patchLabels({ privacy: event.target.value })} />
              </Field>
              <VisualFields slot="form" visual={content.form.visual} hint="Dummy 1200×600 · 2:1 · display 420×210 · /images/hotel-systems-contact-process-placeholder.webp · ป้าย What Happens Next — Sample implementation process · หน้าสาธารณะใช้แผนภาพ HTML และรายการ What Happens Next เป็นหลัก ไม่ใช้รูปบุคคลที่สร้างด้วย AI" />
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
                    faqs: [...content.faqs, { id: newSystemsItemId("faq"), q: "", a: "", qEn: "", aEn: "" }],
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
        <div className="crm-dialog" role="dialog" aria-modal="true" aria-labelledby="hotel-systems-dialog-title">
          <div className="crm-dialog-card">
            <h2 id="hotel-systems-dialog-title">{dialog === "unpublish" ? "ยกเลิกเผยแพร่" : "คัดลอกไปภาษาอื่น"}</h2>
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
