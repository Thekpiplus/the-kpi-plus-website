"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  HOTEL_AI_CLAIM_STATUSES,
  HOTEL_AI_KPI_STATUSES,
  HOTEL_AI_VISUAL_STATUSES,
  hotelAiCmsErrorMessage,
  hotelAiCmsNotice,
  newHotelAiItemId,
  type CmsHotelAiFormLabels,
  type CmsHotelAiPage,
  type CmsHotelAiVisual,
  type HotelAiCmsIntent,
  type HotelAiCmsSaveResult,
  type HotelAiEditorState,
  type HotelAiVisualStatus,
} from "@/lib/cms/hotel-ai-page";

const LOCALE_OPTIONS = [
  { id: "th", label: "ไทย" },
  { id: "en", label: "English" },
  { id: "ru", label: "Русский" },
  { id: "zh", label: "繁體中文" },
] as const;

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "pains", label: "Pain points" },
  { id: "process", label: "Process" },
  { id: "cases", label: "Use cases" },
  { id: "pilot", label: "Pilot" },
  { id: "evidence", label: "Evidence" },
  { id: "measure", label: "Measure" },
  { id: "ownership", label: "Ownership" },
  { id: "fit", label: "Fit matrix" },
  { id: "related", label: "Related" },
  { id: "form", label: "Contact" },
  { id: "faq", label: "FAQ" },
  { id: "seo", label: "SEO" },
  { id: "publish", label: "Publish" },
] as const;

type Tab = (typeof TABS)[number]["id"];
type VisualSlot =
  | "hero"
  | "pains"
  | "process"
  | "cases"
  | "pilot"
  | "evidence"
  | "measure"
  | "ownership"
  | "fit"
  | "related"
  | "form"
  | "social";

const VISUAL_FILE_NAMES: Record<VisualSlot, string> = {
  hero: "heroImageFile",
  pains: "painsImageFile",
  process: "processImageFile",
  cases: "casesImageFile",
  pilot: "pilotImageFile",
  evidence: "evidenceImageFile",
  measure: "measureImageFile",
  ownership: "ownershipImageFile",
  fit: "fitImageFile",
  related: "relatedImageFile",
  form: "formImageFile",
  social: "ogImageFile",
};

const CLEAR_FIELD_NAMES: Record<VisualSlot, string> = {
  hero: "clearHeroImage",
  pains: "clearPainsImage",
  process: "clearProcessImage",
  cases: "clearCasesImage",
  pilot: "clearPilotImage",
  evidence: "clearEvidenceImage",
  measure: "clearMeasureImage",
  ownership: "clearOwnershipImage",
  fit: "clearFitImage",
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
        ขึ้น / Up
      </button>
      <button type="button" className="crm-users-secondary" disabled={index === total - 1} onClick={onDown}>
        ลง / Down
      </button>
      <button type="button" className="crm-users-secondary" onClick={onRemove}>
        ลบ / Delete
      </button>
    </div>
  );
}

function emptyLine(prefix: string) {
  return { id: newHotelAiItemId(prefix), th: "", en: "" };
}

export function HotelAiPageEditor({
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
  initial: HotelAiEditorState;
  notice?: string;
  error?: string;
  saveAction: (formData: FormData) => Promise<HotelAiCmsSaveResult>;
  duplicateAction: (formData: FormData) => Promise<HotelAiCmsSaveResult>;
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
  const [content, setContent] = useState<CmsHotelAiPage>(initial.content);
  const [status, setStatus] = useState(error ? hotelAiCmsErrorMessage(error) : "");
  const [ok, setOk] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<"unpublish" | "duplicate" | null>(null);
  const [targetLocale, setTargetLocale] = useState("en");
  const [dirty, setDirty] = useState(false);
  const [previews, setPreviews] = useState<Record<VisualSlot, string>>({
    hero: initial.content.hero.visual.src,
    pains: initial.content.pains.visual.src,
    process: initial.content.process.visual.src,
    cases: initial.content.cases.visual.src,
    pilot: initial.content.pilot.visual.src,
    evidence: initial.content.evidence.visual.src,
    measure: initial.content.measure.visual.src,
    ownership: initial.content.ownership.visual.src,
    fit: initial.content.fit.visual.src,
    related: initial.content.related.visual.src,
    form: initial.content.form.visual.src,
    social: initial.content.seo.social.src,
  });
  const [clears, setClears] = useState<Record<VisualSlot, boolean>>({
    hero: false,
    pains: false,
    process: false,
    cases: false,
    pilot: false,
    evidence: false,
    measure: false,
    ownership: false,
    fit: false,
    related: false,
    form: false,
    social: false,
  });

  function markDirty() {
    setDirty(true);
    setOk("");
  }

  function patchContent(next: CmsHotelAiPage) {
    setContent(next);
    markDirty();
  }

  function patchLabels(patch: Partial<CmsHotelAiFormLabels>) {
    patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, ...patch } } });
  }

  function patchVisual(slot: VisualSlot, visual: CmsHotelAiVisual) {
    if (slot === "hero") patchContent({ ...content, hero: { ...content.hero, visual } });
    else if (slot === "pains") patchContent({ ...content, pains: { ...content.pains, visual } });
    else if (slot === "process") patchContent({ ...content, process: { ...content.process, visual } });
    else if (slot === "cases") patchContent({ ...content, cases: { ...content.cases, visual } });
    else if (slot === "pilot") patchContent({ ...content, pilot: { ...content.pilot, visual } });
    else if (slot === "evidence") patchContent({ ...content, evidence: { ...content.evidence, visual } });
    else if (slot === "measure") patchContent({ ...content, measure: { ...content.measure, visual } });
    else if (slot === "ownership") patchContent({ ...content, ownership: { ...content.ownership, visual } });
    else if (slot === "fit") patchContent({ ...content, fit: { ...content.fit, visual } });
    else if (slot === "related") patchContent({ ...content, related: { ...content.related, visual } });
    else if (slot === "form") patchContent({ ...content, form: { ...content.form, visual } });
    else patchContent({ ...content, seo: { ...content.seo, social: visual } });
  }

  function VisualFields({ slot, visual, hint }: { slot: VisualSlot; visual: CmsHotelAiVisual; hint: string }) {
    return (
      <>
        <Field label="คำอธิบายภาพภาษาไทย (alt)" hint="จำเป็นเมื่อมีรูปและจะเผยแพร่สองภาษา">
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
            onChange={(event) => patchVisual(slot, { ...visual, status: event.target.value as HotelAiVisualStatus })}
          >
            {HOTEL_AI_VISUAL_STATUSES.map((item) => (
              <option key={item.id} value={item.id}>
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

  function submit(intent: HotelAiCmsIntent) {
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
        setStatus(hotelAiCmsErrorMessage(result.error));
        return;
      }
      if (intent === "publish") setMeta((current) => ({ ...current, status: "published" }));
      if (intent === "draft" || intent === "unpublish") setMeta((current) => ({ ...current, status: "draft" }));
      setOk(intent === "preview" ? hotelAiCmsNotice("preview") : hotelAiCmsNotice("saved"));
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
        setStatus(hotelAiCmsErrorMessage(result.error));
        return;
      }
      setOk(hotelAiCmsNotice("duplicate"));
      setDirty(false);
      router.push(`/crm/cms/pages/${result.id}?tab=hero`);
    });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = (submitter?.value as HotelAiCmsIntent) || "save";
    if (intent === "unpublish") {
      setDialog("unpublish");
      return;
    }
    submit(intent);
  }

  const saveButtons = (
    <>
      <button className="kpi-button" type="submit" name="intent" value="save" disabled={pending} style={{ background: "#a2dc25", color: "#1a3a02" }}>
        {pending ? hotelAiCmsNotice("pending") : "บันทึก / Save"}
      </button>
      <button className="crm-users-secondary" type="submit" name="intent" value="draft" disabled={pending}>
        บันทึกฉบับร่าง / Save Draft
      </button>
      <button className="crm-users-secondary" type="submit" name="intent" value="preview" disabled={pending}>
        บันทึกแล้วดูตัวอย่าง / Save and Preview
      </button>
      <button className="kpi-button" type="submit" name="intent" value="publish" disabled={pending} style={{ background: "#a2dc25", color: "#1a3a02" }}>
        เผยแพร่ / Publish
      </button>
      <button className="crm-users-secondary" type="submit" name="intent" value="unpublish" disabled={pending}>
        ยกเลิกเผยแพร่ / Unpublish
      </button>
      <button type="button" className="crm-users-secondary" disabled={pending} onClick={() => setDialog("duplicate")}>
        คัดลอกไปภาษาอื่น / Duplicate to another language
      </button>
    </>
  );
  const stateClass = status ? " is-error" : dirty ? " is-dirty" : ok ? " is-ok" : "";
  const saveBar = (
    <div className="crm-cs-savebar">
      {saveButtons}
      <p className={`crm-cs-save-state${stateClass}`} role="status">
        {pending ? hotelAiCmsNotice("pending") : status || (dirty ? hotelAiCmsNotice("dirty") : ok || hotelAiCmsNotice("ready"))}
      </p>
    </div>
  );

  return (
    <div className="crm-cs-editor-shell">
      <nav className="crm-cs-tabs" role="tablist" aria-label="ส่วนของหน้า Hotel AI & Automation">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            id={`hotel-ai-cms-tab-${item.id}`}
            role="tab"
            aria-selected={tab === item.id}
            aria-controls="hotel-ai-cms-panel"
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
        <div id="hotel-ai-cms-panel" role="tabpanel" aria-labelledby={`hotel-ai-cms-tab-${tab}`}>
          {tab === "hero" ? (
            <section className="crm-cms-block">
              <h2>Hero</h2>
              <Field label="Eyebrow">
                <input className="crm-field" value={content.hero.eyebrow} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, eyebrow: event.target.value } })} />
              </Field>
              <Field label="หัวข้อส่วนต้น / Title lead">
                <input className="crm-field" value={content.hero.titleLead} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, titleLead: event.target.value } })} />
              </Field>
              <Field label="หัวข้อเน้น / Title accent">
                <input className="crm-field" value={content.hero.titleAccent} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, titleAccent: event.target.value } })} />
              </Field>
              <Field label="หัวข้อส่วนท้าย / Title rest">
                <input className="crm-field" value={content.hero.titleRest} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, titleRest: event.target.value } })} />
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
              <Field label="ลิงก์ปุ่มหลัก" hint="/path, #anchor, mailto, tel หรือ http(s)">
                <input className="crm-field" value={content.hero.primaryCta.href} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, primaryCta: { ...content.hero.primaryCta, href: event.target.value } } })} />
              </Field>
              <Field label="ป้ายปุ่มรอง">
                <input className="crm-field" value={content.hero.secondaryCta.label} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, secondaryCta: { ...content.hero.secondaryCta, label: event.target.value } } })} />
              </Field>
              <Field label="ลิงก์ปุ่มรอง">
                <input className="crm-field" value={content.hero.secondaryCta.href} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, secondaryCta: { ...content.hero.secondaryCta, href: event.target.value } } })} />
              </Field>
              <h3>Trust line</h3>
              {content.hero.trust.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ไทย">
                    <input className="crm-field" value={row.th} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, trust: content.hero.trust.map((item, i) => (i === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="English">
                    <input className="crm-field" value={row.en} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, trust: content.hero.trust.map((item, i) => (i === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.hero.trust.length,
                    () => patchContent({ ...content, hero: { ...content.hero, trust: moveItem(content.hero.trust, index, -1) } }),
                    () => patchContent({ ...content, hero: { ...content.hero, trust: moveItem(content.hero.trust, index, 1) } }),
                    () => patchContent({ ...content, hero: { ...content.hero, trust: content.hero.trust.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, hero: { ...content.hero, trust: [...content.hero.trust, emptyLine("trust")] } })}>
                เพิ่มบรรทัด / Add line
              </button>
              <VisualFields slot="hero" visual={content.hero.visual} hint="Dummy 1600×900 · /images/hotel-ai-automation-hero-placeholder.webp · หน้าสาธารณะใช้แผนภาพ HTML เป็นหลัก" />
            </section>
          ) : null}

          {tab === "pains" ? (
            <section className="crm-cms-block">
              <h2>Pain points</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.pains.title} onChange={(event) => patchContent({ ...content, pains: { ...content.pains, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.pains.lead} onChange={(event) => patchContent({ ...content, pains: { ...content.pains, lead: event.target.value } })} />
              </Field>
              <Field label="หัวข้อตารางตรวจ">
                <input className="crm-field" value={content.pains.checkTitle} onChange={(event) => patchContent({ ...content, pains: { ...content.pains, checkTitle: event.target.value } })} />
              </Field>
              <Field label="คำนำตารางตรวจ">
                <textarea className="crm-field" rows={2} value={content.pains.checkLead} onChange={(event) => patchContent({ ...content, pains: { ...content.pains, checkLead: event.target.value } })} />
              </Field>
              <Field label="คำบรรยายตาราง">
                <input className="crm-field" value={content.pains.caption} onChange={(event) => patchContent({ ...content, pains: { ...content.pains, caption: event.target.value } })} />
              </Field>
              <VisualFields slot="pains" visual={content.pains.visual} hint="Dummy · /images/hotel-ai-automation-pain-points-placeholder.webp" />
              <h3>แถวปัญหา</h3>
              {content.pains.items.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ไทย">
                    <textarea className="crm-field" rows={2} value={row.th} onChange={(event) => patchContent({ ...content, pains: { ...content.pains, items: content.pains.items.map((item, i) => (i === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="English">
                    <textarea className="crm-field" rows={2} value={row.en} onChange={(event) => patchContent({ ...content, pains: { ...content.pains, items: content.pains.items.map((item, i) => (i === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.pains.items.length,
                    () => patchContent({ ...content, pains: { ...content.pains, items: moveItem(content.pains.items, index, -1) } }),
                    () => patchContent({ ...content, pains: { ...content.pains, items: moveItem(content.pains.items, index, 1) } }),
                    () => patchContent({ ...content, pains: { ...content.pains, items: content.pains.items.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, pains: { ...content.pains, items: [...content.pains.items, { id: newHotelAiItemId("pain"), th: "", en: "" }] } })}>
                เพิ่มแถวปัญหา / Add pain point
              </button>
              <h3>Diagnostic checklist</h3>
              {content.pains.diagnostic.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="อาการ TH">
                    <input className="crm-field" value={row.symptomTh} onChange={(event) => patchContent({ ...content, pains: { ...content.pains, diagnostic: content.pains.diagnostic.map((item, i) => (i === index ? { ...item, symptomTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Symptom EN">
                    <input className="crm-field" value={row.symptomEn} onChange={(event) => patchContent({ ...content, pains: { ...content.pains, diagnostic: content.pains.diagnostic.map((item, i) => (i === index ? { ...item, symptomEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="คำถาม TH">
                    <input className="crm-field" value={row.questionTh} onChange={(event) => patchContent({ ...content, pains: { ...content.pains, diagnostic: content.pains.diagnostic.map((item, i) => (i === index ? { ...item, questionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Question EN">
                    <input className="crm-field" value={row.questionEn} onChange={(event) => patchContent({ ...content, pains: { ...content.pains, diagnostic: content.pains.diagnostic.map((item, i) => (i === index ? { ...item, questionEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หลักฐาน TH">
                    <input className="crm-field" value={row.evidenceTh} onChange={(event) => patchContent({ ...content, pains: { ...content.pains, diagnostic: content.pains.diagnostic.map((item, i) => (i === index ? { ...item, evidenceTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Evidence EN">
                    <input className="crm-field" value={row.evidenceEn} onChange={(event) => patchContent({ ...content, pains: { ...content.pains, diagnostic: content.pains.diagnostic.map((item, i) => (i === index ? { ...item, evidenceEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="เจ้าของ TH">
                    <input className="crm-field" value={row.ownerTh} onChange={(event) => patchContent({ ...content, pains: { ...content.pains, diagnostic: content.pains.diagnostic.map((item, i) => (i === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner EN">
                    <input className="crm-field" value={row.ownerEn} onChange={(event) => patchContent({ ...content, pains: { ...content.pains, diagnostic: content.pains.diagnostic.map((item, i) => (i === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.pains.diagnostic.length,
                    () => patchContent({ ...content, pains: { ...content.pains, diagnostic: moveItem(content.pains.diagnostic, index, -1) } }),
                    () => patchContent({ ...content, pains: { ...content.pains, diagnostic: moveItem(content.pains.diagnostic, index, 1) } }),
                    () => patchContent({ ...content, pains: { ...content.pains, diagnostic: content.pains.diagnostic.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    pains: {
                      ...content.pains,
                      diagnostic: [
                        ...content.pains.diagnostic,
                        { id: newHotelAiItemId("diag"), symptomTh: "", symptomEn: "", questionTh: "", questionEn: "", evidenceTh: "", evidenceEn: "", ownerTh: "", ownerEn: "" },
                      ],
                    },
                  })
                }
              >
                เพิ่มแถวตรวจ / Add diagnostic row
              </button>
            </section>
          ) : null}

          {tab === "process" ? (
            <section className="crm-cms-block">
              <h2>Map / Simplify / Automate / Connect / Review</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.process.title} onChange={(event) => patchContent({ ...content, process: { ...content.process, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.process.lead} onChange={(event) => patchContent({ ...content, process: { ...content.process, lead: event.target.value } })} />
              </Field>
              <Field label="ป้ายผลลัพธ์">
                <input className="crm-field" value={content.process.outputLabel} onChange={(event) => patchContent({ ...content, process: { ...content.process, outputLabel: event.target.value } })} />
              </Field>
              <Field label="ป้ายเกตตัดสินใจ">
                <input className="crm-field" value={content.process.gateLabel} onChange={(event) => patchContent({ ...content, process: { ...content.process, gateLabel: event.target.value } })} />
              </Field>
              <Field label="ปุ่ม CTA">
                <input className="crm-field" value={content.process.cta} onChange={(event) => patchContent({ ...content, process: { ...content.process, cta: event.target.value } })} />
              </Field>
              <VisualFields slot="process" visual={content.process.visual} hint="Dummy · /images/hotel-ai-automation-roadmap-placeholder.webp" />
              {content.process.steps.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="หมายเลข">
                    <input className="crm-field" value={row.num} onChange={(event) => patchContent({ ...content, process: { ...content.process, steps: content.process.steps.map((item, i) => (i === index ? { ...item, num: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ป้ายขั้น (MAP / SIMPLIFY / …)">
                    <input className="crm-field" value={row.label} onChange={(event) => patchContent({ ...content, process: { ...content.process, steps: content.process.steps.map((item, i) => (i === index ? { ...item, label: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หัวข้อ TH">
                    <input className="crm-field" value={row.titleTh} onChange={(event) => patchContent({ ...content, process: { ...content.process, steps: content.process.steps.map((item, i) => (i === index ? { ...item, titleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Title EN">
                    <input className="crm-field" value={row.titleEn} onChange={(event) => patchContent({ ...content, process: { ...content.process, steps: content.process.steps.map((item, i) => (i === index ? { ...item, titleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="รายละเอียด TH">
                    <textarea className="crm-field" rows={2} value={row.bodyTh} onChange={(event) => patchContent({ ...content, process: { ...content.process, steps: content.process.steps.map((item, i) => (i === index ? { ...item, bodyTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Body EN">
                    <textarea className="crm-field" rows={2} value={row.bodyEn} onChange={(event) => patchContent({ ...content, process: { ...content.process, steps: content.process.steps.map((item, i) => (i === index ? { ...item, bodyEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผลลัพธ์ TH">
                    <input className="crm-field" value={row.outputTh} onChange={(event) => patchContent({ ...content, process: { ...content.process, steps: content.process.steps.map((item, i) => (i === index ? { ...item, outputTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Output EN">
                    <input className="crm-field" value={row.outputEn} onChange={(event) => patchContent({ ...content, process: { ...content.process, steps: content.process.steps.map((item, i) => (i === index ? { ...item, outputEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="เจ้าของ TH">
                    <input className="crm-field" value={row.ownerTh} onChange={(event) => patchContent({ ...content, process: { ...content.process, steps: content.process.steps.map((item, i) => (i === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner EN">
                    <input className="crm-field" value={row.ownerEn} onChange={(event) => patchContent({ ...content, process: { ...content.process, steps: content.process.steps.map((item, i) => (i === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="เกตตัดสินใจ TH">
                    <input className="crm-field" value={row.gateTh} onChange={(event) => patchContent({ ...content, process: { ...content.process, steps: content.process.steps.map((item, i) => (i === index ? { ...item, gateTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Decision gate EN">
                    <input className="crm-field" value={row.gateEn} onChange={(event) => patchContent({ ...content, process: { ...content.process, steps: content.process.steps.map((item, i) => (i === index ? { ...item, gateEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.process.steps.length,
                    () => patchContent({ ...content, process: { ...content.process, steps: moveItem(content.process.steps, index, -1) } }),
                    () => patchContent({ ...content, process: { ...content.process, steps: moveItem(content.process.steps, index, 1) } }),
                    () => patchContent({ ...content, process: { ...content.process, steps: content.process.steps.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    process: {
                      ...content.process,
                      steps: [
                        ...content.process.steps,
                        {
                          id: newHotelAiItemId("step"),
                          num: String(content.process.steps.length + 1).padStart(2, "0"),
                          label: "",
                          titleTh: "",
                          titleEn: "",
                          bodyTh: "",
                          bodyEn: "",
                          outputTh: "",
                          outputEn: "",
                          ownerTh: "",
                          ownerEn: "",
                          gateTh: "",
                          gateEn: "",
                        },
                      ],
                    },
                  })
                }
              >
                เพิ่มขั้น / Add step
              </button>
            </section>
          ) : null}

          {tab === "cases" ? (
            <section className="crm-cms-block">
              <h2>Use cases</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.cases.title} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.cases.lead} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, lead: event.target.value } })} />
              </Field>
              <Field label="หมายเหตุ">
                <textarea className="crm-field" rows={2} value={content.cases.note} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, note: event.target.value } })} />
              </Field>
              <VisualFields slot="cases" visual={content.cases.visual} hint="Dummy · /images/hotel-ai-automation-use-cases-placeholder.webp · เวิร์กโฟลว์ตัวอย่างต้องมีป้าย Sample" />
              {content.cases.items.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="หัวข้อ TH">
                    <input className="crm-field" value={row.titleTh} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, titleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Title EN">
                    <input className="crm-field" value={row.titleEn} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, titleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="งาน TH">
                    <input className="crm-field" value={row.taskTh} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, taskTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Task EN">
                    <input className="crm-field" value={row.taskEn} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, taskEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ข้อมูลเข้า TH">
                    <textarea className="crm-field" rows={2} value={row.inputTh} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, inputTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Input EN">
                    <textarea className="crm-field" rows={2} value={row.inputEn} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, inputEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Simplify TH">
                    <textarea className="crm-field" rows={2} value={row.simplifyTh} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, simplifyTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Simplify EN">
                    <textarea className="crm-field" rows={2} value={row.simplifyEn} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, simplifyEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="บทบาท Automation TH">
                    <textarea className="crm-field" rows={2} value={row.automateTh} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, automateTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Automation role EN">
                    <textarea className="crm-field" rows={2} value={row.automateEn} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, automateEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผู้ตรวจทาน TH" hint="จำเป็นก่อนเผยแพร่">
                    <input className="crm-field" value={row.reviewTh} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, reviewTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Human reviewer EN">
                    <input className="crm-field" value={row.reviewEn} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, reviewEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผลลัพธ์ TH">
                    <input className="crm-field" value={row.outputTh} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, outputTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Output EN">
                    <input className="crm-field" value={row.outputEn} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, outputEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Dependency TH">
                    <textarea className="crm-field" rows={2} value={row.dependencyTh} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, dependencyTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Dependency EN">
                    <textarea className="crm-field" rows={2} value={row.dependencyEn} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, dependencyEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="คำเตือนข้อมูล TH">
                    <textarea className="crm-field" rows={2} value={row.cautionTh} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, cautionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Data warning EN">
                    <textarea className="crm-field" rows={2} value={row.cautionEn} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, cautionEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ทางเลือกเมื่อระบบใช้ไม่ได้ TH">
                    <input className="crm-field" value={row.fallbackTh} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, fallbackTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Manual fallback EN">
                    <input className="crm-field" value={row.fallbackEn} onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, fallbackEn: event.target.value } : item)) } })} />
                  </Field>
                  <label className="crm-cms-field">
                    <span>
                      <input
                        type="checkbox"
                        checked={row.sample}
                        onChange={(event) => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.map((item, i) => (i === index ? { ...item, sample: event.target.checked } : item)) } })}
                      />{" "}
                      ตัวอย่าง / Sample workflow
                    </span>
                  </label>
                  {listActions(
                    index,
                    content.cases.items.length,
                    () => patchContent({ ...content, cases: { ...content.cases, items: moveItem(content.cases.items, index, -1) } }),
                    () => patchContent({ ...content, cases: { ...content.cases, items: moveItem(content.cases.items, index, 1) } }),
                    () => patchContent({ ...content, cases: { ...content.cases, items: content.cases.items.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    cases: {
                      ...content.cases,
                      items: [
                        ...content.cases.items,
                        {
                          id: newHotelAiItemId("case"),
                          shortTh: "",
                          shortEn: "",
                          titleTh: "",
                          titleEn: "",
                          taskTh: "",
                          taskEn: "",
                          inputTh: "",
                          inputEn: "",
                          simplifyTh: "",
                          simplifyEn: "",
                          automateTh: "",
                          automateEn: "",
                          reviewTh: "",
                          reviewEn: "",
                          outputTh: "",
                          outputEn: "",
                          dependencyTh: "",
                          dependencyEn: "",
                          cautionTh: "",
                          cautionEn: "",
                          fallbackTh: "ทำตาม SOP เดิมด้วยมือเมื่อระบบใช้ไม่ได้",
                          fallbackEn: "Follow the current SOP by hand if automation fails",
                          sample: true,
                        },
                      ],
                    },
                  })
                }
              >
                เพิ่มการ์ด / Add use case
              </button>
            </section>
          ) : null}

          {tab === "pilot" ? (
            <section className="crm-cms-block">
              <h2>Pilot charter</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.pilot.title} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.pilot.lead} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, lead: event.target.value } })} />
              </Field>
              <Field label="หัวข้อ Charter">
                <input className="crm-field" value={content.pilot.charterTitle} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, charterTitle: event.target.value } })} />
              </Field>
              <Field label="คำนำ Charter">
                <textarea className="crm-field" rows={2} value={content.pilot.charterLead} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, charterLead: event.target.value } })} />
              </Field>
              <Field label="คำบรรยาย Charter" hint="ต้องมีคำว่า Sample / ตัวอย่าง ก่อนเผยแพร่">
                <input className="crm-field" value={content.pilot.charterCaption} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, charterCaption: event.target.value } })} />
              </Field>
              <Field label="หัวข้อ Scale / Adjust / Stop">
                <input className="crm-field" value={content.pilot.decisionTitle} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, decisionTitle: event.target.value } })} />
              </Field>
              <Field label="คำนำการตัดสินใจ">
                <textarea className="crm-field" rows={2} value={content.pilot.decisionLead} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, decisionLead: event.target.value } })} />
              </Field>
              <Field label="ข้อความปิด">
                <textarea className="crm-field" rows={2} value={content.pilot.close} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, close: event.target.value } })} />
              </Field>
              <VisualFields slot="pilot" visual={content.pilot.visual} hint="Dummy · /images/hotel-ai-automation-pilot-gates-placeholder.webp" />
              <h3>ขั้นตอนทดลอง</h3>
              {content.pilot.steps.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ไทย">
                    <input className="crm-field" value={row.th} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, steps: content.pilot.steps.map((item, i) => (i === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="English">
                    <input className="crm-field" value={row.en} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, steps: content.pilot.steps.map((item, i) => (i === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.pilot.steps.length,
                    () => patchContent({ ...content, pilot: { ...content.pilot, steps: moveItem(content.pilot.steps, index, -1) } }),
                    () => patchContent({ ...content, pilot: { ...content.pilot, steps: moveItem(content.pilot.steps, index, 1) } }),
                    () => patchContent({ ...content, pilot: { ...content.pilot, steps: content.pilot.steps.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, pilot: { ...content.pilot, steps: [...content.pilot.steps, emptyLine("pilot-step")] } })}>
                เพิ่มขั้น / Add step
              </button>
              <h3>ฟิลด์ Charter</h3>
              {content.pilot.charter.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ป้าย TH">
                    <input className="crm-field" value={row.labelTh} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, charter: content.pilot.charter.map((item, i) => (i === index ? { ...item, labelTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Label EN">
                    <input className="crm-field" value={row.labelEn} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, charter: content.pilot.charter.map((item, i) => (i === index ? { ...item, labelEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ค่า TH">
                    <input className="crm-field" value={row.valueTh} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, charter: content.pilot.charter.map((item, i) => (i === index ? { ...item, valueTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Value EN">
                    <input className="crm-field" value={row.valueEn} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, charter: content.pilot.charter.map((item, i) => (i === index ? { ...item, valueEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.pilot.charter.length,
                    () => patchContent({ ...content, pilot: { ...content.pilot, charter: moveItem(content.pilot.charter, index, -1) } }),
                    () => patchContent({ ...content, pilot: { ...content.pilot, charter: moveItem(content.pilot.charter, index, 1) } }),
                    () => patchContent({ ...content, pilot: { ...content.pilot, charter: content.pilot.charter.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    pilot: { ...content.pilot, charter: [...content.pilot.charter, { id: newHotelAiItemId("charter"), labelTh: "", labelEn: "", valueTh: "", valueEn: "" }] },
                  })
                }
              >
                เพิ่มฟิลด์ / Add field
              </button>
              <h3>Scale / Adjust / Stop</h3>
              {content.pilot.decisions.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ป้าย">
                    <input className="crm-field" value={row.label} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, decisions: content.pilot.decisions.map((item, i) => (i === index ? { ...item, label: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ไทย">
                    <textarea className="crm-field" rows={2} value={row.th} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, decisions: content.pilot.decisions.map((item, i) => (i === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="English">
                    <textarea className="crm-field" rows={2} value={row.en} onChange={(event) => patchContent({ ...content, pilot: { ...content.pilot, decisions: content.pilot.decisions.map((item, i) => (i === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.pilot.decisions.length,
                    () => patchContent({ ...content, pilot: { ...content.pilot, decisions: moveItem(content.pilot.decisions, index, -1) } }),
                    () => patchContent({ ...content, pilot: { ...content.pilot, decisions: moveItem(content.pilot.decisions, index, 1) } }),
                    () => patchContent({ ...content, pilot: { ...content.pilot, decisions: content.pilot.decisions.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => patchContent({ ...content, pilot: { ...content.pilot, decisions: [...content.pilot.decisions, { id: newHotelAiItemId("decision"), label: "", th: "", en: "" }] } })}
              >
                เพิ่มการตัดสินใจ / Add decision
              </button>
            </section>
          ) : null}

          {tab === "evidence" ? (
            <section className="crm-cms-block">
              <h2>Case-study evidence</h2>
              <p>ตัวเลขจะไม่ขึ้นหน้าสาธารณะจนกว่าจะครบแหล่งที่มา บริบท วิธีวัด ข้อจำกัด และสิทธิ์เผยแพร่</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.evidence.title} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, title: event.target.value } })} />
              </Field>
              <Field label="Takeaway ต้น">
                <textarea className="crm-field" rows={2} value={content.evidence.takeawayLead} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, takeawayLead: event.target.value } })} />
              </Field>
              <Field label="Takeaway ท้าย">
                <textarea className="crm-field" rows={2} value={content.evidence.takeawayClose} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, takeawayClose: event.target.value } })} />
              </Field>
              <Field label="เนื้อหา">
                <textarea className="crm-field" rows={3} value={content.evidence.body} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, body: event.target.value } })} />
              </Field>
              <Field label="ป้ายแหล่งที่มา">
                <input className="crm-field" value={content.evidence.sourceLabel} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, sourceLabel: event.target.value } })} />
              </Field>
              <Field label="แหล่งที่มา (ข้อความสาธารณะ)">
                <textarea className="crm-field" rows={2} value={content.evidence.source} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, source: event.target.value } })} />
              </Field>
              <Field label="ป้ายบริบท">
                <input className="crm-field" value={content.evidence.contextLabel} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, contextLabel: event.target.value } })} />
              </Field>
              <Field label="บริบทสาธารณะ">
                <textarea className="crm-field" rows={2} value={content.evidence.context} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, context: event.target.value } })} />
              </Field>
              <Field label="ป้ายวิธีวัด">
                <input className="crm-field" value={content.evidence.measureLabel} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, measureLabel: event.target.value } })} />
              </Field>
              <Field label="วิธีวัดสาธารณะ">
                <textarea className="crm-field" rows={2} value={content.evidence.measure} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, measure: event.target.value } })} />
              </Field>
              <Field label="ป้ายหมายเหตุ">
                <input className="crm-field" value={content.evidence.noteLabel} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, noteLabel: event.target.value } })} />
              </Field>
              <Field label="หมายเหตุสาธารณะ">
                <textarea className="crm-field" rows={2} value={content.evidence.note} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, note: event.target.value } })} />
              </Field>
              <VisualFields slot="evidence" visual={content.evidence.visual} hint="Dummy · /images/hotel-ai-automation-evidence-placeholder.webp" />
              {content.evidence.claims.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="หัวข้อ TH">
                    <input className="crm-field" value={row.titleTh} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, titleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Title EN">
                    <input className="crm-field" value={row.titleEn} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, titleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ตัวเลข" hint="เว้นว่างถ้ายังไม่พร้อมเผยแพร่ — ห้ามใส่ตัวเลขสมมติ">
                    <input className="crm-field" value={row.number} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, number: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หน่วย">
                    <input className="crm-field" value={row.unit} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, unit: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Source URL">
                    <input className="crm-field" value={row.sourceUrl} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, sourceUrl: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Source title">
                    <input className="crm-field" value={row.sourceTitle} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, sourceTitle: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Source date">
                    <input className="crm-field" type="date" value={row.sourceDate} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, sourceDate: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="นิยามงาน TH">
                    <input className="crm-field" value={row.taskDefinitionTh} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, taskDefinitionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Task definition EN">
                    <input className="crm-field" value={row.taskDefinitionEn} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, taskDefinitionEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="บริบท TH">
                    <textarea className="crm-field" rows={2} value={row.contextTh} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, contextTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Context EN">
                    <textarea className="crm-field" rows={2} value={row.contextEn} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, contextEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="วิธีวัด TH">
                    <textarea className="crm-field" rows={2} value={row.methodTh} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, methodTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Method EN">
                    <textarea className="crm-field" rows={2} value={row.methodEn} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, methodEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ข้อจำกัด TH">
                    <textarea className="crm-field" rows={2} value={row.limitationsTh} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, limitationsTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Limitations EN">
                    <textarea className="crm-field" rows={2} value={row.limitationsEn} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, limitationsEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สถานะเผยแพร่ตัวเลข">
                    <select
                      className="crm-field"
                      value={row.publicationStatus}
                      onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, publicationStatus: event.target.value } : item)) } })}
                    >
                      {HOTEL_AI_CLAIM_STATUSES.map((item) => (
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
                        checked={row.permission}
                        onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, permission: event.target.checked } : item)) } })}
                      />{" "}
                      มีสิทธิ์เผยแพร่ / Publication permission
                    </span>
                  </label>
                  <Field label="เหตุผลที่ไม่เผยแพร่ TH">
                    <textarea className="crm-field" rows={2} value={row.unpublishedReasonTh} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, unpublishedReasonTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Unpublished reason EN">
                    <textarea className="crm-field" rows={2} value={row.unpublishedReasonEn} onChange={(event) => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.map((item, i) => (i === index ? { ...item, unpublishedReasonEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.evidence.claims.length,
                    () => patchContent({ ...content, evidence: { ...content.evidence, claims: moveItem(content.evidence.claims, index, -1) } }),
                    () => patchContent({ ...content, evidence: { ...content.evidence, claims: moveItem(content.evidence.claims, index, 1) } }),
                    () => patchContent({ ...content, evidence: { ...content.evidence, claims: content.evidence.claims.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    evidence: {
                      ...content.evidence,
                      claims: [
                        ...content.evidence.claims,
                        {
                          id: newHotelAiItemId("claim"),
                          titleTh: "",
                          titleEn: "",
                          number: "",
                          unit: "",
                          sourceUrl: "",
                          sourceTitle: "",
                          sourceDate: "",
                          taskDefinitionTh: "",
                          taskDefinitionEn: "",
                          contextTh: "",
                          contextEn: "",
                          methodTh: "",
                          methodEn: "",
                          limitationsTh: "",
                          limitationsEn: "",
                          permission: false,
                          publicationStatus: "unpublished",
                          unpublishedReasonTh: "",
                          unpublishedReasonEn: "",
                        },
                      ],
                    },
                  })
                }
              >
                เพิ่มการอ้างอิง / Add citation
              </button>
            </section>
          ) : null}

          {tab === "measure" ? (
            <section className="crm-cms-block">
              <h2>Metrics</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.measure.title} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.measure.lead} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, lead: event.target.value } })} />
              </Field>
              <Field label="คำบรรยายตาราง" hint="ต้องมี Sample / ตัวอย่าง ก่อนเผยแพร่">
                <input className="crm-field" value={content.measure.caption} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, caption: event.target.value } })} />
              </Field>
              <Field label="ข้อความเมื่อยังไม่มีตัวเลข">
                <input className="crm-field" value={content.measure.empty} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, empty: event.target.value } })} />
              </Field>
              <Field label="หมายเหตุว่าง">
                <textarea className="crm-field" rows={2} value={content.measure.emptyNote} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, emptyNote: event.target.value } })} />
              </Field>
              <Field label="หมายเหตุการตรวจทาน">
                <textarea className="crm-field" rows={2} value={content.measure.reviewNote} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, reviewNote: event.target.value } })} />
              </Field>
              <Field label="ข้อความปิด">
                <textarea className="crm-field" rows={2} value={content.measure.close} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, close: event.target.value } })} />
              </Field>
              <Field label="ป้ายอัปเดต">
                <input className="crm-field" value={content.measure.updatedLabel} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, updatedLabel: event.target.value } })} />
              </Field>
              <Field label="ค่าอัปเดต">
                <input className="crm-field" value={content.measure.updatedValue} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, updatedValue: event.target.value } })} />
              </Field>
              <Field label="ป้ายเจ้าของ">
                <input className="crm-field" value={content.measure.ownerLabel} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, ownerLabel: event.target.value } })} />
              </Field>
              <Field label="ค่าเจ้าของ">
                <input className="crm-field" value={content.measure.ownerValue} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, ownerValue: event.target.value } })} />
              </Field>
              <VisualFields slot="measure" visual={content.measure.visual} hint="Dummy · /images/hotel-ai-automation-pilot-scorecard-placeholder.webp" />
              {content.measure.kpis.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ป้าย KPI">
                    <input className="crm-field" value={row.label} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, i) => (i === index ? { ...item, label: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="นิยาม TH">
                    <textarea className="crm-field" rows={2} value={row.definitionTh} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, i) => (i === index ? { ...item, definitionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Definition EN">
                    <textarea className="crm-field" rows={2} value={row.definitionEn} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, i) => (i === index ? { ...item, definitionEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ช่วงเวลา TH">
                    <input className="crm-field" value={row.periodTh} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, i) => (i === index ? { ...item, periodTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Period EN">
                    <input className="crm-field" value={row.periodEn} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, i) => (i === index ? { ...item, periodEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="แหล่งที่มา TH">
                    <input className="crm-field" value={row.sourceTh} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, i) => (i === index ? { ...item, sourceTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Source EN">
                    <input className="crm-field" value={row.sourceEn} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, i) => (i === index ? { ...item, sourceEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="เจ้าของ TH">
                    <input className="crm-field" value={row.ownerTh} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, i) => (i === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner EN">
                    <input className="crm-field" value={row.ownerEn} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, i) => (i === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Baseline" hint="เว้นว่างจนกว่าจะมีข้อมูลที่ตรวจแล้ว">
                    <input className="crm-field" value={row.baseline} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, i) => (i === index ? { ...item, baseline: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Pilot">
                    <input className="crm-field" value={row.pilot} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, i) => (i === index ? { ...item, pilot: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สถานะข้อมูล">
                    <select
                      className="crm-field"
                      value={row.dataStatus}
                      onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, i) => (i === index ? { ...item, dataStatus: event.target.value } : item)) } })}
                    >
                      {HOTEL_AI_KPI_STATUSES.map((item) => (
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
                        checked={row.hideUntilComplete}
                        onChange={(event) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, i) => (i === index ? { ...item, hideUntilComplete: event.target.checked } : item)) } })}
                      />{" "}
                      ซ่อนตัวเลขจนกว่าจะครบนิยาม ช่วงเวลา แหล่งที่มา เจ้าของ และสถานะ
                    </span>
                  </label>
                  {listActions(
                    index,
                    content.measure.kpis.length,
                    () => patchContent({ ...content, measure: { ...content.measure, kpis: moveItem(content.measure.kpis, index, -1) } }),
                    () => patchContent({ ...content, measure: { ...content.measure, kpis: moveItem(content.measure.kpis, index, 1) } }),
                    () => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.filter((_, i) => i !== index) } }),
                  )}
                </div>
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
                          id: newHotelAiItemId("kpi"),
                          label: "",
                          tone: "",
                          definitionTh: "",
                          definitionEn: "",
                          periodTh: "",
                          periodEn: "",
                          sourceTh: "",
                          sourceEn: "",
                          ownerTh: "",
                          ownerEn: "",
                          baseline: "",
                          pilot: "",
                          dataStatus: "not-configured",
                          hideUntilComplete: true,
                        },
                      ],
                    },
                  })
                }
              >
                เพิ่ม KPI / Add KPI
              </button>
            </section>
          ) : null}

          {tab === "ownership" ? (
            <section className="crm-cms-block">
              <h2>Data ownership</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.ownership.title} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.ownership.lead} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, lead: event.target.value } })} />
              </Field>
              <Field label="หัวข้อ flow">
                <input className="crm-field" value={content.ownership.flowTitle} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, flowTitle: event.target.value } })} />
              </Field>
              <Field label="หัวข้อหลักการ">
                <input className="crm-field" value={content.ownership.principlesTitle} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, principlesTitle: event.target.value } })} />
              </Field>
              <Field label="หัวข้อตารางสิทธิ์">
                <input className="crm-field" value={content.ownership.matrixTitle} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, matrixTitle: event.target.value } })} />
              </Field>
              <Field label="คำบรรยายตาราง">
                <input className="crm-field" value={content.ownership.caption} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, caption: event.target.value } })} />
              </Field>
              <Field label="คำนำการตรวจทาน">
                <textarea className="crm-field" rows={2} value={content.ownership.reviewLead} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, reviewLead: event.target.value } })} />
              </Field>
              <Field label="ข้อความปิด">
                <textarea className="crm-field" rows={2} value={content.ownership.close} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, close: event.target.value } })} />
              </Field>
              <VisualFields slot="ownership" visual={content.ownership.visual} hint="Dummy · /images/hotel-ai-automation-data-ownership-placeholder.webp" />
              <h3>หลักการ</h3>
              {content.ownership.principles.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ไทย">
                    <textarea className="crm-field" rows={2} value={row.th} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, principles: content.ownership.principles.map((item, i) => (i === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="English">
                    <textarea className="crm-field" rows={2} value={row.en} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, principles: content.ownership.principles.map((item, i) => (i === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.ownership.principles.length,
                    () => patchContent({ ...content, ownership: { ...content.ownership, principles: moveItem(content.ownership.principles, index, -1) } }),
                    () => patchContent({ ...content, ownership: { ...content.ownership, principles: moveItem(content.ownership.principles, index, 1) } }),
                    () => patchContent({ ...content, ownership: { ...content.ownership, principles: content.ownership.principles.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, ownership: { ...content.ownership, principles: [...content.ownership.principles, emptyLine("principle")] } })}>
                เพิ่มหลักการ / Add principle
              </button>
              <h3>Data flow</h3>
              {content.ownership.flow.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ไทย">
                    <textarea className="crm-field" rows={2} value={row.th} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, flow: content.ownership.flow.map((item, i) => (i === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="English">
                    <textarea className="crm-field" rows={2} value={row.en} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, flow: content.ownership.flow.map((item, i) => (i === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.ownership.flow.length,
                    () => patchContent({ ...content, ownership: { ...content.ownership, flow: moveItem(content.ownership.flow, index, -1) } }),
                    () => patchContent({ ...content, ownership: { ...content.ownership, flow: moveItem(content.ownership.flow, index, 1) } }),
                    () => patchContent({ ...content, ownership: { ...content.ownership, flow: content.ownership.flow.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, ownership: { ...content.ownership, flow: [...content.ownership.flow, emptyLine("flow")] } })}>
                เพิ่มขั้น flow / Add flow step
              </button>
              <h3>ต้องมีคนตรวจ</h3>
              {content.ownership.reviewItems.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ไทย">
                    <textarea className="crm-field" rows={2} value={row.th} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, reviewItems: content.ownership.reviewItems.map((item, i) => (i === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="English">
                    <textarea className="crm-field" rows={2} value={row.en} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, reviewItems: content.ownership.reviewItems.map((item, i) => (i === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.ownership.reviewItems.length,
                    () => patchContent({ ...content, ownership: { ...content.ownership, reviewItems: moveItem(content.ownership.reviewItems, index, -1) } }),
                    () => patchContent({ ...content, ownership: { ...content.ownership, reviewItems: moveItem(content.ownership.reviewItems, index, 1) } }),
                    () => patchContent({ ...content, ownership: { ...content.ownership, reviewItems: content.ownership.reviewItems.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, ownership: { ...content.ownership, reviewItems: [...content.ownership.reviewItems, emptyLine("review")] } })}>
                เพิ่มข้อตรวจทาน / Add review rule
              </button>
              <h3>ตารางสิทธิ์เข้าถึง</h3>
              {content.ownership.matrix.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="หมวด TH">
                    <input className="crm-field" value={row.categoryTh} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, matrix: content.ownership.matrix.map((item, i) => (i === index ? { ...item, categoryTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Category EN">
                    <input className="crm-field" value={row.categoryEn} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, matrix: content.ownership.matrix.map((item, i) => (i === index ? { ...item, categoryEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="เจ้าของ TH">
                    <input className="crm-field" value={row.ownerTh} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, matrix: content.ownership.matrix.map((item, i) => (i === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner EN">
                    <input className="crm-field" value={row.ownerEn} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, matrix: content.ownership.matrix.map((item, i) => (i === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="อนุญาต TH">
                    <input className="crm-field" value={row.allowedTh} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, matrix: content.ownership.matrix.map((item, i) => (i === index ? { ...item, allowedTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Allowed EN">
                    <input className="crm-field" value={row.allowedEn} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, matrix: content.ownership.matrix.map((item, i) => (i === index ? { ...item, allowedEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ตรวจทาน TH">
                    <input className="crm-field" value={row.reviewTh} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, matrix: content.ownership.matrix.map((item, i) => (i === index ? { ...item, reviewTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Review EN">
                    <input className="crm-field" value={row.reviewEn} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, matrix: content.ownership.matrix.map((item, i) => (i === index ? { ...item, reviewEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="โทน">
                    <input className="crm-field" value={row.reviewTone} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, matrix: content.ownership.matrix.map((item, i) => (i === index ? { ...item, reviewTone: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="เก็บรักษา TH">
                    <input className="crm-field" value={row.retentionTh} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, matrix: content.ownership.matrix.map((item, i) => (i === index ? { ...item, retentionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Retention EN">
                    <input className="crm-field" value={row.retentionEn} onChange={(event) => patchContent({ ...content, ownership: { ...content.ownership, matrix: content.ownership.matrix.map((item, i) => (i === index ? { ...item, retentionEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.ownership.matrix.length,
                    () => patchContent({ ...content, ownership: { ...content.ownership, matrix: moveItem(content.ownership.matrix, index, -1) } }),
                    () => patchContent({ ...content, ownership: { ...content.ownership, matrix: moveItem(content.ownership.matrix, index, 1) } }),
                    () => patchContent({ ...content, ownership: { ...content.ownership, matrix: content.ownership.matrix.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    ownership: {
                      ...content.ownership,
                      matrix: [
                        ...content.ownership.matrix,
                        {
                          id: newHotelAiItemId("access"),
                          categoryTh: "",
                          categoryEn: "",
                          ownerTh: "",
                          ownerEn: "",
                          allowedTh: "",
                          allowedEn: "",
                          reviewTh: "",
                          reviewEn: "",
                          reviewTone: "review",
                          retentionTh: "",
                          retentionEn: "",
                        },
                      ],
                    },
                  })
                }
              >
                เพิ่มแถวสิทธิ์ / Add access row
              </button>
            </section>
          ) : null}

          {tab === "fit" ? (
            <section className="crm-cms-block">
              <h2>Fit matrix</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.fit.title} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.fit.lead} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, lead: event.target.value } })} />
              </Field>
              <Field label="หมายเหตุ">
                <textarea className="crm-field" rows={2} value={content.fit.note} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, note: event.target.value } })} />
              </Field>
              <Field label="หัวข้อยังไม่พร้อม">
                <input className="crm-field" value={content.fit.notTitle} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, notTitle: event.target.value } })} />
              </Field>
              <Field label="คำนำยังไม่พร้อม">
                <textarea className="crm-field" rows={2} value={content.fit.notLead} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, notLead: event.target.value } })} />
              </Field>
              <Field label="คำบรรยาย" hint="ต้องมี Sample / ตัวอย่าง ก่อนเผยแพร่">
                <input className="crm-field" value={content.fit.caption} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, caption: event.target.value } })} />
              </Field>
              <VisualFields slot="fit" visual={content.fit.visual} hint="Dummy · /images/hotel-ai-automation-fit-matrix-placeholder.webp" />
              {content.fit.items.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ป้าย">
                    <input className="crm-field" value={row.label} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, items: content.fit.items.map((item, i) => (i === index ? { ...item, label: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หัวข้อ TH">
                    <input className="crm-field" value={row.titleTh} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, items: content.fit.items.map((item, i) => (i === index ? { ...item, titleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Title EN">
                    <input className="crm-field" value={row.titleEn} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, items: content.fit.items.map((item, i) => (i === index ? { ...item, titleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ตัวอย่าง TH">
                    <textarea className="crm-field" rows={2} value={row.exampleTh} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, items: content.fit.items.map((item, i) => (i === index ? { ...item, exampleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Example EN">
                    <textarea className="crm-field" rows={2} value={row.exampleEn} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, items: content.fit.items.map((item, i) => (i === index ? { ...item, exampleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="เริ่มจาก TH">
                    <textarea className="crm-field" rows={2} value={row.startTh} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, items: content.fit.items.map((item, i) => (i === index ? { ...item, startTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Start EN">
                    <textarea className="crm-field" rows={2} value={row.startEn} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, items: content.fit.items.map((item, i) => (i === index ? { ...item, startEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="เงื่อนไขคนตรวจ TH">
                    <textarea className="crm-field" rows={2} value={row.guardTh} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, items: content.fit.items.map((item, i) => (i === index ? { ...item, guardTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Guard EN">
                    <textarea className="crm-field" rows={2} value={row.guardEn} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, items: content.fit.items.map((item, i) => (i === index ? { ...item, guardEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.fit.items.length,
                    () => patchContent({ ...content, fit: { ...content.fit, items: moveItem(content.fit.items, index, -1) } }),
                    () => patchContent({ ...content, fit: { ...content.fit, items: moveItem(content.fit.items, index, 1) } }),
                    () => patchContent({ ...content, fit: { ...content.fit, items: content.fit.items.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    fit: {
                      ...content.fit,
                      items: [
                        ...content.fit.items,
                        { id: newHotelAiItemId("fit"), label: "", titleTh: "", titleEn: "", exampleTh: "", exampleEn: "", startTh: "", startEn: "", guardTh: "", guardEn: "" },
                      ],
                    },
                  })
                }
              >
                เพิ่มแถวความพร้อม / Add fit row
              </button>
              <h3>ยังไม่พร้อม Automate</h3>
              {content.fit.notItems.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ไทย">
                    <textarea className="crm-field" rows={2} value={row.th} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, notItems: content.fit.notItems.map((item, i) => (i === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="English">
                    <textarea className="crm-field" rows={2} value={row.en} onChange={(event) => patchContent({ ...content, fit: { ...content.fit, notItems: content.fit.notItems.map((item, i) => (i === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.fit.notItems.length,
                    () => patchContent({ ...content, fit: { ...content.fit, notItems: moveItem(content.fit.notItems, index, -1) } }),
                    () => patchContent({ ...content, fit: { ...content.fit, notItems: moveItem(content.fit.notItems, index, 1) } }),
                    () => patchContent({ ...content, fit: { ...content.fit, notItems: content.fit.notItems.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, fit: { ...content.fit, notItems: [...content.fit.notItems, emptyLine("not-ready")] } })}>
                เพิ่มข้อยังไม่พร้อม / Add not-ready item
              </button>
            </section>
          ) : null}

          {tab === "related" ? (
            <section className="crm-cms-block">
              <h2>Related content</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.related.title} onChange={(event) => patchContent({ ...content, related: { ...content.related, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={2} value={content.related.lead} onChange={(event) => patchContent({ ...content, related: { ...content.related, lead: event.target.value } })} />
              </Field>
              <Field label="หัวข้อ closer">
                <input className="crm-field" value={content.related.closerTitle} onChange={(event) => patchContent({ ...content, related: { ...content.related, closerTitle: event.target.value } })} />
              </Field>
              <Field label="เนื้อหา closer">
                <textarea className="crm-field" rows={2} value={content.related.closerBody} onChange={(event) => patchContent({ ...content, related: { ...content.related, closerBody: event.target.value } })} />
              </Field>
              <Field label="ป้ายปุ่ม closer">
                <input className="crm-field" value={content.related.closerCta} onChange={(event) => patchContent({ ...content, related: { ...content.related, closerCta: event.target.value } })} />
              </Field>
              <Field label="ลิงก์ closer">
                <input className="crm-field" value={content.related.closerHref} onChange={(event) => patchContent({ ...content, related: { ...content.related, closerHref: event.target.value } })} />
              </Field>
              <VisualFields slot="related" visual={content.related.visual} hint="Dummy · /images/hotel-ai-automation-related-content-placeholder.webp" />
              {content.related.cards.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="URL">
                    <input className="crm-field" value={row.href} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, i) => (i === index ? { ...item, href: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หมวด TH">
                    <input className="crm-field" value={row.categoryTh} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, i) => (i === index ? { ...item, categoryTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Category EN">
                    <input className="crm-field" value={row.categoryEn} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, i) => (i === index ? { ...item, categoryEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หัวข้อ TH">
                    <input className="crm-field" value={row.titleTh} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, i) => (i === index ? { ...item, titleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Title EN">
                    <input className="crm-field" value={row.titleEn} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, i) => (i === index ? { ...item, titleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="คำอธิบาย TH">
                    <textarea className="crm-field" rows={2} value={row.descriptionTh} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, i) => (i === index ? { ...item, descriptionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Description EN">
                    <textarea className="crm-field" rows={2} value={row.descriptionEn} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, i) => (i === index ? { ...item, descriptionEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="CTA TH">
                    <input className="crm-field" value={row.ctaTh} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, i) => (i === index ? { ...item, ctaTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="CTA EN">
                    <input className="crm-field" value={row.ctaEn} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, i) => (i === index ? { ...item, ctaEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="วันที่เผยแพร่">
                    <input className="crm-field" value={row.publishedAt} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, i) => (i === index ? { ...item, publishedAt: event.target.value } : item)) } })} />
                  </Field>
                  <label className="crm-cms-field">
                    <span>
                      <input type="checkbox" checked={row.featured} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, i) => (i === index ? { ...item, featured: event.target.checked } : item)) } })} /> แนะนำ / Featured
                    </span>
                  </label>
                  <label className="crm-cms-field">
                    <span>
                      <input type="checkbox" checked={row.external} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, i) => (i === index ? { ...item, external: event.target.checked } : item)) } })} /> ลิงก์ภายนอก
                    </span>
                  </label>
                  <label className="crm-cms-field">
                    <span>
                      <input type="checkbox" checked={row.sample} onChange={(event) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, i) => (i === index ? { ...item, sample: event.target.checked } : item)) } })} /> ตัวอย่าง / Sample
                    </span>
                  </label>
                  {listActions(
                    index,
                    content.related.cards.length,
                    () => patchContent({ ...content, related: { ...content.related, cards: moveItem(content.related.cards, index, -1) } }),
                    () => patchContent({ ...content, related: { ...content.related, cards: moveItem(content.related.cards, index, 1) } }),
                    () => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  patchContent({
                    ...content,
                    related: {
                      ...content.related,
                      cards: [
                        ...content.related.cards,
                        {
                          id: newHotelAiItemId("related"),
                          href: "",
                          featured: false,
                          external: false,
                          categoryTh: "",
                          categoryEn: "",
                          titleTh: "",
                          titleEn: "",
                          descriptionTh: "",
                          descriptionEn: "",
                          publishedAt: "",
                          contentTypeTh: "",
                          contentTypeEn: "",
                          ctaTh: "",
                          ctaEn: "",
                          sample: false,
                        },
                      ],
                    },
                  })
                }
              >
                เพิ่มการ์ด / Add card
              </button>
            </section>
          ) : null}

          {tab === "form" ? (
            <section className="crm-cms-block">
              <h2>Contact form</h2>
              <Field label="Kicker">
                <input className="crm-field" value={content.form.kicker} onChange={(event) => patchContent({ ...content, form: { ...content.form, kicker: event.target.value } })} />
              </Field>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.form.title} onChange={(event) => patchContent({ ...content, form: { ...content.form, title: event.target.value } })} />
              </Field>
              <Field label="คำอธิบาย">
                <textarea className="crm-field" rows={3} value={content.form.body} onChange={(event) => patchContent({ ...content, form: { ...content.form, body: event.target.value } })} />
              </Field>
              <Field label="ปุ่มส่ง">
                <input className="crm-field" value={content.form.submit} onChange={(event) => patchContent({ ...content, form: { ...content.form, submit: event.target.value } })} />
              </Field>
              <Field label="หัวข้อ What happens next">
                <input className="crm-field" value={content.form.nextTitle} onChange={(event) => patchContent({ ...content, form: { ...content.form, nextTitle: event.target.value } })} />
              </Field>
              <Field label="หมายเหตุ">
                <textarea className="crm-field" rows={2} value={content.form.note} onChange={(event) => patchContent({ ...content, form: { ...content.form, note: event.target.value } })} />
              </Field>
              <Field label="ป้ายชื่อ">
                <input className="crm-field" value={content.form.labels.name} onChange={(event) => patchLabels({ name: event.target.value })} />
              </Field>
              <Field label="ป้ายตำแหน่ง">
                <input className="crm-field" value={content.form.labels.role} onChange={(event) => patchLabels({ role: event.target.value })} />
              </Field>
              <Field label="ป้ายโรงแรม / ธุรกิจ">
                <input className="crm-field" value={content.form.labels.business} onChange={(event) => patchLabels({ business: event.target.value })} />
              </Field>
              <Field label="ป้ายเวิร์กโฟลว์">
                <input className="crm-field" value={content.form.labels.workflow} onChange={(event) => patchLabels({ workflow: event.target.value })} />
              </Field>
              <Field label="คำใบ้เวิร์กโฟลว์">
                <input className="crm-field" value={content.form.labels.workflowHint} onChange={(event) => patchLabels({ workflowHint: event.target.value })} />
              </Field>
              <Field label="ป้ายปริมาณงาน">
                <input className="crm-field" value={content.form.labels.workload} onChange={(event) => patchLabels({ workload: event.target.value })} />
              </Field>
              <Field label="ป้ายระบบ">
                <input className="crm-field" value={content.form.labels.systems} onChange={(event) => patchLabels({ systems: event.target.value })} />
              </Field>
              <Field label="คำใบ้ระบบ">
                <input className="crm-field" value={content.form.labels.systemsHint} onChange={(event) => patchLabels({ systemsHint: event.target.value })} />
              </Field>
              <Field label="ป้ายเป้าหมาย">
                <input className="crm-field" value={content.form.labels.goal} onChange={(event) => patchLabels({ goal: event.target.value })} />
              </Field>
              <Field label="ป้ายช่องทางติดต่อ">
                <input className="crm-field" value={content.form.labels.contact} onChange={(event) => patchLabels({ contact: event.target.value })} />
              </Field>
              <Field label="ข้อความความยินยอม" hint="จำเป็นก่อนเผยแพร่">
                <textarea className="crm-field" rows={2} value={content.form.labels.consent} onChange={(event) => patchLabels({ consent: event.target.value })} />
              </Field>
              <Field label="ป้ายนโยบายความเป็นส่วนตัว">
                <input className="crm-field" value={content.form.labels.privacy} onChange={(event) => patchLabels({ privacy: event.target.value })} />
              </Field>
              <VisualFields slot="form" visual={content.form.visual} hint="Dummy 2:1 · /images/hotel-ai-automation-contact-process-placeholder.webp" />
              <h3>What happens next</h3>
              {content.form.steps.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ไทย">
                    <input className="crm-field" value={row.th} onChange={(event) => patchContent({ ...content, form: { ...content.form, steps: content.form.steps.map((item, i) => (i === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="English">
                    <input className="crm-field" value={row.en} onChange={(event) => patchContent({ ...content, form: { ...content.form, steps: content.form.steps.map((item, i) => (i === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.form.steps.length,
                    () => patchContent({ ...content, form: { ...content.form, steps: moveItem(content.form.steps, index, -1) } }),
                    () => patchContent({ ...content, form: { ...content.form, steps: moveItem(content.form.steps, index, 1) } }),
                    () => patchContent({ ...content, form: { ...content.form, steps: content.form.steps.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, form: { ...content.form, steps: [...content.form.steps, emptyLine("next")] } })}>
                เพิ่มขั้นถัดไป / Add next step
              </button>
              <h3>เป้าหมาย</h3>
              {content.form.goals.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ไทย">
                    <input className="crm-field" value={row.th} onChange={(event) => patchContent({ ...content, form: { ...content.form, goals: content.form.goals.map((item, i) => (i === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="English">
                    <input className="crm-field" value={row.en} onChange={(event) => patchContent({ ...content, form: { ...content.form, goals: content.form.goals.map((item, i) => (i === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.form.goals.length,
                    () => patchContent({ ...content, form: { ...content.form, goals: moveItem(content.form.goals, index, -1) } }),
                    () => patchContent({ ...content, form: { ...content.form, goals: moveItem(content.form.goals, index, 1) } }),
                    () => patchContent({ ...content, form: { ...content.form, goals: content.form.goals.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, form: { ...content.form, goals: [...content.form.goals, emptyLine("goal")] } })}>
                เพิ่มเป้าหมาย / Add goal
              </button>
            </section>
          ) : null}

          {tab === "faq" ? (
            <section className="crm-cms-block">
              <h2>FAQ</h2>
              <Field label="คำนำไทย">
                <textarea className="crm-field" rows={2} value={content.faqLead} onChange={(event) => patchContent({ ...content, faqLead: event.target.value })} />
              </Field>
              <Field label="Intro EN">
                <textarea className="crm-field" rows={2} value={content.faqLeadEn} onChange={(event) => patchContent({ ...content, faqLeadEn: event.target.value })} />
              </Field>
              {content.faqs.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="คำถามไทย">
                    <input className="crm-field" value={row.q} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((item, i) => (i === index ? { ...item, q: event.target.value } : item)) })} />
                  </Field>
                  <Field label="คำตอบไทย">
                    <textarea className="crm-field" rows={3} value={row.a} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((item, i) => (i === index ? { ...item, a: event.target.value } : item)) })} />
                  </Field>
                  <Field label="Question EN">
                    <input className="crm-field" value={row.qEn} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((item, i) => (i === index ? { ...item, qEn: event.target.value } : item)) })} />
                  </Field>
                  <Field label="Answer EN">
                    <textarea className="crm-field" rows={3} value={row.aEn} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((item, i) => (i === index ? { ...item, aEn: event.target.value } : item)) })} />
                  </Field>
                  {listActions(
                    index,
                    content.faqs.length,
                    () => patchContent({ ...content, faqs: moveItem(content.faqs, index, -1) }),
                    () => patchContent({ ...content, faqs: moveItem(content.faqs, index, 1) }),
                    () => patchContent({ ...content, faqs: content.faqs.filter((_, i) => i !== index) }),
                  )}
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, faqs: [...content.faqs, { id: newHotelAiItemId("faq"), q: "", a: "", qEn: "", aEn: "" }] })}>
                เพิ่มคำถาม / Add FAQ
              </button>
            </section>
          ) : null}

          {tab === "seo" ? (
            <section className="crm-cms-block">
              <h2>SEO</h2>
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
              <VisualFields slot="social" visual={content.seo.social} hint="รูปแชร์โซเชียล 1200×630" />
              <h3>Language variants</h3>
              {content.seo.variants.map((row, index) => (
                <div key={`${row.locale}-${index}`} className="crm-cms-repeat">
                  <Field label="ภาษา">
                    <input className="crm-field" value={row.locale} onChange={(event) => patchContent({ ...content, seo: { ...content.seo, variants: content.seo.variants.map((item, i) => (i === index ? { ...item, locale: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Title">
                    <input className="crm-field" value={row.title} onChange={(event) => patchContent({ ...content, seo: { ...content.seo, variants: content.seo.variants.map((item, i) => (i === index ? { ...item, title: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Description">
                    <textarea className="crm-field" rows={2} value={row.description} onChange={(event) => patchContent({ ...content, seo: { ...content.seo, variants: content.seo.variants.map((item, i) => (i === index ? { ...item, description: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Canonical">
                    <input className="crm-field" value={row.canonical} onChange={(event) => patchContent({ ...content, seo: { ...content.seo, variants: content.seo.variants.map((item, i) => (i === index ? { ...item, canonical: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.seo.variants.length,
                    () => patchContent({ ...content, seo: { ...content.seo, variants: moveItem(content.seo.variants, index, -1) } }),
                    () => patchContent({ ...content, seo: { ...content.seo, variants: moveItem(content.seo.variants, index, 1) } }),
                    () => patchContent({ ...content, seo: { ...content.seo, variants: content.seo.variants.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => patchContent({ ...content, seo: { ...content.seo, variants: [...content.seo.variants, { locale: "", title: "", description: "", canonical: "" }] } })}
              >
                เพิ่มภาษา / Add language variant
              </button>
            </section>
          ) : null}

          {tab === "publish" ? (
            <section className="crm-cms-block">
              <h2>Publish</h2>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={content.bilingualPublish} onChange={(event) => patchContent({ ...content, bilingualPublish: event.target.checked })} /> เผยแพร่สองภาษา ต้องมี alt และ FAQ ไทย-อังกฤษ
                </span>
              </label>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={content.approvals.clientNames} onChange={(event) => patchContent({ ...content, approvals: { ...content.approvals, clientNames: event.target.checked } })} /> อนุมัติชื่อลูกค้า
                </span>
              </label>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={content.approvals.teamPhotos} onChange={(event) => patchContent({ ...content, approvals: { ...content.approvals, teamPhotos: event.target.checked } })} /> อนุมัติภาพทีม
                </span>
              </label>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={content.approvals.clientLogos} onChange={(event) => patchContent({ ...content, approvals: { ...content.approvals, clientLogos: event.target.checked } })} /> อนุมัติโลโก้ลูกค้า
                </span>
              </label>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={content.approvals.results} onChange={(event) => patchContent({ ...content, approvals: { ...content.approvals, results: event.target.checked } })} /> อนุมัติผลลัพธ์ / Review and approve numeric claims
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
            </section>
          ) : null}
        </div>
        {saveBar}
      </form>
      {dialog ? (
        <div className="crm-dialog" role="dialog" aria-modal="true" aria-labelledby="hotel-ai-dialog-title">
          <div className="crm-dialog-card">
            <h2 id="hotel-ai-dialog-title">{dialog === "unpublish" ? "ยกเลิกเผยแพร่ / Unpublish" : "คัดลอกไปภาษาอื่น / Duplicate to another language"}</h2>
            {dialog === "unpublish" ? (
              <p>หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ดจนกว่าจะเผยแพร่อีกครั้ง / The public page will use the in-code copy until this document is published again.</p>
            ) : (
              <Field label="ภาษาปลายทาง / Destination language">
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
                ยกเลิก / Cancel
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
                ยืนยัน / Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
