"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  RESERVATIONS_KPI_STATUSES,
  RESERVATIONS_VISUAL_STATUSES,
  newReservationsItemId,
  reservationsErrorMessage,
  type CmsBoundaryItem,
  type CmsRelatedCard,
  type CmsReservationBenefitGroup,
  type CmsReservationFlowStep,
  type CmsReservationKpi,
  type CmsReservationProblem,
  type CmsReservationScopeItem,
  type CmsReservationWorkflowStep,
  type CmsReservationsPage,
  type CmsReservationsVisual,
  type ReservationsEditorState,
  type ReservationsIntent,
  type ReservationsKpiStatus,
  type ReservationsSaveResult,
  type ReservationsVisualStatus,
} from "@/lib/cms/reservations-page";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "problems", label: "Problems" },
  { id: "scope", label: "Scope" },
  { id: "benefits", label: "Benefits" },
  { id: "workflow", label: "Workflow" },
  { id: "kpis", label: "KPIs" },
  { id: "related", label: "Related" },
  { id: "form", label: "Form" },
  { id: "faq", label: "FAQ" },
  { id: "boundaries", label: "Boundaries" },
  { id: "seo", label: "SEO" },
  { id: "publish", label: "Publish" },
] as const;

type Tab = (typeof TABS)[number]["id"];
type VisualSlot = "hero" | "problems" | "map" | "benefits" | "workflow" | "kpis" | "related" | "form" | "social";

function isTab(value: string | undefined): value is Tab {
  return TABS.some((tab) => tab.id === value);
}

function formatStamp(value?: string) {
  if (!value) return "ยังไม่เคยบันทึก";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "ยังไม่เคยบันทึก";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
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
        alt={alt || ""}
        width={480}
        height={270}
        onLoad={(event) => {
          const img = event.currentTarget;
          setMeta(`${img.naturalWidth}×${img.naturalHeight} px`);
        }}
      />
      <figcaption>
        {meta || "กำลังอ่านขนาดรูป…"} · {recommended}
      </figcaption>
    </figure>
  );
}

function ListBar({
  title,
  onAdd,
  onUp,
  onDown,
  onRemove,
  disableUp,
  disableDown,
}: {
  title: string;
  onAdd?: () => void;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}) {
  return (
    <div className="crm-cs-metric-head">
      <h3>{title}</h3>
      <div className="crm-cs-sticky-actions">
        <button type="button" className="crm-users-secondary" onClick={onUp} disabled={disableUp}>
          ขึ้น
        </button>
        <button type="button" className="crm-users-secondary" onClick={onDown} disabled={disableDown}>
          ลง
        </button>
        <button type="button" className="crm-users-secondary" onClick={onRemove}>
          ลบ
        </button>
        {onAdd ? (
          <button type="button" className="crm-users-secondary" onClick={onAdd}>
            เพิ่ม
          </button>
        ) : null}
      </div>
    </div>
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

function csv(values: Array<string | number>) {
  return values.join(", ");
}

function parseCsvNumbers(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item));
}

function parseLines(value: string) {
  return value
    .split(/\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseCsv(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function emptyVisual(): CmsReservationsVisual {
  return { src: "", altTh: "", altEn: "", status: "placeholder", label: "", caption: "" };
}

export function ReservationsPageEditor({
  initial,
  notice,
  error,
  saveAction,
  updatedAt,
  initialTab,
  previewHref,
  publicHref,
}: {
  initial: ReservationsEditorState;
  notice?: string;
  error?: string;
  saveAction: (formData: FormData) => Promise<ReservationsSaveResult>;
  updatedAt?: string;
  initialTab?: string;
  previewHref: string;
  publicHref: string;
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
  const [content, setContent] = useState<CmsReservationsPage>(initial.content);
  const [status, setStatus] = useState(error ? reservationsErrorMessage(error) : "");
  const [ok, setOk] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<"unpublish" | null>(null);
  const [dirty, setDirty] = useState(false);
  const [previews, setPreviews] = useState<Record<VisualSlot, string>>({
    hero: initial.content.hero.visual.src,
    problems: initial.content.problemsSection.visual.src,
    map: initial.content.scopeSection.visual.src,
    benefits: initial.content.benefitsSection.visual.src,
    workflow: initial.content.workflowSection.visual.src,
    kpis: initial.content.measureSection.visual.src,
    related: initial.content.related.visual.src,
    form: initial.content.form.visual.src,
    social: initial.content.seo.social.src,
  });
  const [clears, setClears] = useState<Record<VisualSlot, boolean>>({
    hero: false,
    problems: false,
    map: false,
    benefits: false,
    workflow: false,
    kpis: false,
    related: false,
    form: false,
    social: false,
  });

  const published = meta.status === "published";
  const saveState = pending
    ? "กำลังบันทึก…"
    : status
      ? "บันทึกไม่สำเร็จ"
      : dirty
        ? "ยังไม่ได้บันทึก"
        : ok || (updatedAt ? `บันทึกล่าสุด ${formatStamp(updatedAt)}` : "");

  function markDirty() {
    setDirty(true);
    setOk("");
  }

  function patchContent(next: CmsReservationsPage) {
    setContent(next);
    markDirty();
  }

  function patchHero<K extends keyof CmsReservationsPage["hero"]>(key: K, value: CmsReservationsPage["hero"][K]) {
    patchContent({ ...content, hero: { ...content.hero, [key]: value } });
  }

  function patchVisual(slot: VisualSlot, visual: CmsReservationsVisual) {
    if (slot === "hero") patchHero("visual", visual);
    else if (slot === "problems") patchContent({ ...content, problemsSection: { ...content.problemsSection, visual } });
    else if (slot === "map") patchContent({ ...content, scopeSection: { ...content.scopeSection, visual } });
    else if (slot === "benefits") patchContent({ ...content, benefitsSection: { ...content.benefitsSection, visual } });
    else if (slot === "workflow") patchContent({ ...content, workflowSection: { ...content.workflowSection, visual } });
    else if (slot === "kpis") patchContent({ ...content, measureSection: { ...content.measureSection, visual } });
    else if (slot === "related") patchContent({ ...content, related: { ...content.related, visual } });
    else if (slot === "form") patchContent({ ...content, form: { ...content.form, visual } });
    else patchContent({ ...content, seo: { ...content.seo, social: visual } });
  }

  function VisualFields({
    slot,
    fileName,
    visual,
    hint,
  }: {
    slot: VisualSlot;
    fileName: string;
    visual: CmsReservationsVisual;
    hint: string;
  }) {
    return (
      <>
        <Field label="คำอธิบายภาพภาษาไทย (alt)" hint="จำเป็นเมื่อมีรูปและจะเผยแพร่">
          <input
            className="crm-field"
            value={visual.altTh}
            onChange={(event) => patchVisual(slot, { ...visual, altTh: event.target.value })}
          />
        </Field>
        <Field label="คำอธิบายภาพภาษาอังกฤษ (alt)" hint="จำเป็นเมื่อมีรูปและจะเผยแพร่">
          <input
            className="crm-field"
            value={visual.altEn}
            onChange={(event) => patchVisual(slot, { ...visual, altEn: event.target.value })}
          />
        </Field>
        <Field label="ป้ายกำกับรูป">
          <input
            className="crm-field"
            value={visual.label}
            onChange={(event) => patchVisual(slot, { ...visual, label: event.target.value })}
          />
        </Field>
        <Field label="คำบรรยายรูป">
          <input
            className="crm-field"
            value={visual.caption}
            onChange={(event) => patchVisual(slot, { ...visual, caption: event.target.value })}
          />
        </Field>
        <Field label="สถานะรูป" hint="Placeholder เผยแพร่ไม่ได้ถ้ามีไฟล์รูป — ใช้ Sample สำหรับข้อมูลจำลอง">
          <select
            className="crm-field"
            value={visual.status}
            onChange={(event) =>
              patchVisual(slot, { ...visual, status: event.target.value as ReservationsVisualStatus })
            }
          >
            {RESERVATIONS_VISUAL_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
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
              patchVisual(slot, { ...visual, src: "", status: "placeholder" });
            }}
          >
            ลบรูป
          </button>
        ) : null}
      </>
    );
  }

  function submit(intent: ReservationsIntent) {
    const node = formRef.current;
    if (!node) return;
    const data = new FormData(node);
    data.set("intent", intent);
    data.set("contentJson", JSON.stringify(content));
    if (clears.hero) data.set("clearHeroImage", "1");
    if (clears.problems) data.set("clearProblemsImage", "1");
    if (clears.map) data.set("clearMapImage", "1");
    if (clears.benefits) data.set("clearBenefitsImage", "1");
    if (clears.workflow) data.set("clearWorkflowImage", "1");
    if (clears.kpis) data.set("clearKpiImage", "1");
    if (clears.related) data.set("clearRelatedImage", "1");
    if (clears.form) data.set("clearFormImage", "1");
    if (clears.social) data.set("clearOgImage", "1");
    startTransition(async () => {
      setOk("");
      setStatus("");
      const result = await saveAction(data);
      if (!result.ok) {
        setStatus(reservationsErrorMessage(result.error));
        return;
      }
      if (intent === "publish") setMeta((current) => ({ ...current, status: "published" }));
      if (intent === "draft" || intent === "unpublish") setMeta((current) => ({ ...current, status: "draft" }));
      setOk(intent === "preview" ? "บันทึกแล้ว — เปิดตัวอย่างในแท็บนี้" : "บันทึกแล้ว");
      setDirty(false);
      if (intent === "preview") {
        router.push(previewHref);
        return;
      }
      router.refresh();
    });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = (submitter?.value as ReservationsIntent) || "save";
    if (intent === "unpublish") {
      setDialog("unpublish");
      return;
    }
    submit(intent);
  }

  const saveButtons = (
    <>
      <button className="kpi-button" type="submit" name="intent" value="save" disabled={pending}>
        {pending ? "กำลังบันทึก…" : "บันทึก"}
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
        {pending ? "กำลังบันทึก…" : status || (dirty ? "ยังไม่ได้บันทึก" : ok || "พร้อมบันทึก")}
      </p>
    </div>
  );

  function toggleBoundary(list: "handles" | "hotelOwns", index: number, next: Partial<CmsBoundaryItem>) {
    patchContent({
      ...content,
      boundaries: {
        ...content.boundaries,
        [list]: content.boundaries[list].map((item, i) => (i === index ? { ...item, ...next } : item)),
      },
    });
  }

  return (
    <div className="crm-cs-editor-shell">
      <div className="crm-cs-tabs" role="tablist" aria-label="แก้ไขหน้า Outsourced Hotel Reservations">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`crm-cs-tab${tab === item.id ? " is-active" : ""}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form ref={formRef} className="crm-cms-editor" onSubmit={onSubmit}>
        <input type="hidden" name="id" value={initial.id} />
        <input type="hidden" name="locale" value={meta.locale} />
        <input type="hidden" name="contentJson" value="" />

        <div className="crm-cms-editor-main">
          {dirty ? (
            <p className="crm-users-alert is-warn" role="status">
              มีการแก้ไขที่ยังไม่บันทึก
            </p>
          ) : null}
          {pending ? (
            <p className="crm-users-alert" role="status">
              กำลังบันทึก…
            </p>
          ) : null}
          {!pending && ok ? (
            <p className="crm-users-alert is-ok" role="status">
              {ok}
            </p>
          ) : null}
          {!pending && status ? (
            <p className="crm-users-alert is-warn" role="alert">
              {status}
            </p>
          ) : null}

          <section className="crm-cms-editor-panel" hidden={tab !== "hero"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Hero</p>
                <h2>หัวข้อ คำอธิบาย และปุ่ม</h2>
              </div>
              {saveBar}
            </header>
            <Field label="Eyebrow">
              <input className="crm-field" value={content.hero.eyebrow} onChange={(e) => patchHero("eyebrow", e.target.value)} />
            </Field>
            <Field label="หัวข้อ">
              <textarea className="crm-area" rows={3} value={content.hero.title} onChange={(e) => patchHero("title", e.target.value)} />
            </Field>
            <Field label="คำอธิบาย">
              <textarea className="crm-area" rows={4} value={content.hero.description} onChange={(e) => patchHero("description", e.target.value)} />
            </Field>
            <Field label="ข้อความต่อจากคำอธิบาย">
              <textarea className="crm-area" rows={3} value={content.hero.leadNext} onChange={(e) => patchHero("leadNext", e.target.value)} />
            </Field>
            <Field label="ข้อความปิดท้าย">
              <textarea className="crm-area" rows={3} value={content.hero.leadClose} onChange={(e) => patchHero("leadClose", e.target.value)} />
            </Field>
            <Field label="ข้อความปุ่มหลัก">
              <input className="crm-field" value={content.hero.primaryCta.label} onChange={(e) => patchHero("primaryCta", { ...content.hero.primaryCta, label: e.target.value })} />
            </Field>
            <Field label="ลิงก์ปุ่มหลัก" hint="ใช้ /path, #anchor, mailto, tel หรือ http(s)">
              <input className="crm-field" value={content.hero.primaryCta.href} onChange={(e) => patchHero("primaryCta", { ...content.hero.primaryCta, href: e.target.value })} />
            </Field>
            <Field label="ข้อความปุ่มรอง">
              <input className="crm-field" value={content.hero.secondaryCta.label} onChange={(e) => patchHero("secondaryCta", { ...content.hero.secondaryCta, label: e.target.value })} />
            </Field>
            <Field label="ลิงก์ปุ่มรอง">
              <input className="crm-field" value={content.hero.secondaryCta.href} onChange={(e) => patchHero("secondaryCta", { ...content.hero.secondaryCta, href: e.target.value })} />
            </Field>
            <Field label="ข้อความใต้ปุ่ม">
              <textarea className="crm-area" rows={2} value={content.hero.underCta} onChange={(e) => patchHero("underCta", e.target.value)} />
            </Field>
            <Field label="งานที่ช่วยได้" hint="หนึ่งรายการต่อบรรทัด">
              <textarea className="crm-area" rows={7} value={content.hero.capabilities.join("\n")} onChange={(e) => patchHero("capabilities", parseLines(e.target.value))} />
            </Field>
            <Field label="คำบรรยายภาพ Hero">
              <input className="crm-field" value={content.hero.caption} onChange={(e) => patchHero("caption", e.target.value)} />
            </Field>
            <VisualFields slot="hero" fileName="heroImageFile" visual={content.hero.visual} hint="แนะนำ 1600×1000 px JPG / PNG / WEBP ไม่เกิน 5MB" />
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "problems"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Problems</p>
                <h2>ปัญหา ผลกระทบ และการสนับสนุน</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อส่วน">
              <input className="crm-field" value={content.problemsSection.title} onChange={(e) => patchContent({ ...content, problemsSection: { ...content.problemsSection, title: e.target.value } })} />
            </Field>
            <Field label="คำบรรยาย">
              <input className="crm-field" value={content.problemsSection.caption} onChange={(e) => patchContent({ ...content, problemsSection: { ...content.problemsSection, caption: e.target.value } })} />
            </Field>
            <VisualFields slot="problems" fileName="problemsImageFile" visual={content.problemsSection.visual} hint="แนะนำ 1200×800 px · ห้ามใช้ชื่อแขกจริง" />
            <div className="crm-cs-metrics">
              {content.problems.map((item, index) => (
                <article key={item.id} className="crm-cs-metric">
                  <ListBar
                    title={item.problem || `ปัญหา ${index + 1}`}
                    disableUp={index === 0}
                    disableDown={index === content.problems.length - 1}
                    onUp={() => patchContent({ ...content, problems: moveItem(content.problems, index, -1).map((row, order) => ({ ...row, order: order + 1 })) })}
                    onDown={() => patchContent({ ...content, problems: moveItem(content.problems, index, 1).map((row, order) => ({ ...row, order: order + 1 })) })}
                    onRemove={() => patchContent({ ...content, problems: content.problems.filter((_, i) => i !== index) })}
                  />
                  <Field label="Problem">
                    <textarea className="crm-area" rows={2} value={item.problem} onChange={(e) => patchContent({ ...content, problems: content.problems.map((row, i) => (i === index ? { ...row, problem: e.target.value } : row)) })} />
                  </Field>
                  <Field label="Impact">
                    <textarea className="crm-area" rows={2} value={item.impact} onChange={(e) => patchContent({ ...content, problems: content.problems.map((row, i) => (i === index ? { ...row, impact: e.target.value } : row)) })} />
                  </Field>
                  <Field label="Support">
                    <textarea className="crm-area" rows={2} value={item.support} onChange={(e) => patchContent({ ...content, problems: content.problems.map((row, i) => (i === index ? { ...row, support: e.target.value } : row)) })} />
                  </Field>
                </article>
              ))}
            </div>
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  problems: [
                    ...content.problems,
                    { id: newReservationsItemId("problem"), problem: "", impact: "", support: "", order: content.problems.length + 1 } satisfies CmsReservationProblem,
                  ],
                })
              }
            >
              เพิ่มปัญหา
            </button>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "scope"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Service scope</p>
                <h2>ขอบเขตงานและแผนภาพ</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อส่วน">
              <input className="crm-field" value={content.scopeSection.title} onChange={(e) => patchContent({ ...content, scopeSection: { ...content.scopeSection, title: e.target.value } })} />
            </Field>
            <Field label="ป้าย Service Map">
              <input className="crm-field" value={content.scopeSection.mapLabel} onChange={(e) => patchContent({ ...content, scopeSection: { ...content.scopeSection, mapLabel: e.target.value } })} />
            </Field>
            <VisualFields slot="map" fileName="mapImageFile" visual={content.scopeSection.visual} hint="แนะนำ 1600×900 px" />
            <div className="crm-cs-metrics">
              {content.scopeItems.map((item, index) => (
                <article key={item.id} className="crm-cs-metric">
                  <ListBar
                    title={item.title || `งาน ${index + 1}`}
                    disableUp={index === 0}
                    disableDown={index === content.scopeItems.length - 1}
                    onUp={() => patchContent({ ...content, scopeItems: moveItem(content.scopeItems, index, -1).map((row, order) => ({ ...row, order: order + 1 })) })}
                    onDown={() => patchContent({ ...content, scopeItems: moveItem(content.scopeItems, index, 1).map((row, order) => ({ ...row, order: order + 1 })) })}
                    onRemove={() => patchContent({ ...content, scopeItems: content.scopeItems.filter((_, i) => i !== index) })}
                  />
                  <Field label="ชื่องาน">
                    <input className="crm-field" value={item.title} onChange={(e) => patchContent({ ...content, scopeItems: content.scopeItems.map((row, i) => (i === index ? { ...row, title: e.target.value } : row)) })} />
                  </Field>
                  <Field label="คำอธิบาย">
                    <textarea className="crm-area" rows={3} value={item.description} onChange={(e) => patchContent({ ...content, scopeItems: content.scopeItems.map((row, i) => (i === index ? { ...row, description: e.target.value } : row)) })} />
                  </Field>
                  <Field label="Input">
                    <input className="crm-field" value={item.input} onChange={(e) => patchContent({ ...content, scopeItems: content.scopeItems.map((row, i) => (i === index ? { ...row, input: e.target.value } : row)) })} />
                  </Field>
                  <Field label="Output">
                    <input className="crm-field" value={item.output} onChange={(e) => patchContent({ ...content, scopeItems: content.scopeItems.map((row, i) => (i === index ? { ...row, output: e.target.value } : row)) })} />
                  </Field>
                  <Field label="ช่องทาง" hint="คั่นด้วยจุลภาค เช่น Direct, Email, Phone">
                    <input className="crm-field" value={item.channels} onChange={(e) => patchContent({ ...content, scopeItems: content.scopeItems.map((row, i) => (i === index ? { ...row, channels: e.target.value } : row)) })} />
                  </Field>
                </article>
              ))}
            </div>
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  scopeItems: [
                    ...content.scopeItems,
                    { id: newReservationsItemId("scope"), title: "", description: "", input: "", output: "", channels: "", order: content.scopeItems.length + 1 } satisfies CmsReservationScopeItem,
                  ],
                })
              }
            >
              เพิ่มงานในขอบเขต
            </button>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "benefits"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Benefits</p>
                <h2>ประโยชน์และขั้นตอนปฏิบัติ</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อส่วน">
              <input className="crm-field" value={content.benefitsSection.title} onChange={(e) => patchContent({ ...content, benefitsSection: { ...content.benefitsSection, title: e.target.value } })} />
            </Field>
            <Field label="คำนำ">
              <textarea className="crm-area" rows={3} value={content.benefitsSection.intro} onChange={(e) => patchContent({ ...content, benefitsSection: { ...content.benefitsSection, intro: e.target.value } })} />
            </Field>
            <Field label="ข้อความปิด">
              <textarea className="crm-area" rows={2} value={content.benefitsSection.close} onChange={(e) => patchContent({ ...content, benefitsSection: { ...content.benefitsSection, close: e.target.value } })} />
            </Field>
            <VisualFields slot="benefits" fileName="benefitsImageFile" visual={content.benefitsSection.visual} hint="แนะนำ 1600×900 px" />
            <div className="crm-cs-metrics">
              {content.benefitGroups.map((item, index) => (
                <article key={item.id} className="crm-cs-metric">
                  <ListBar
                    title={item.title || `กลุ่ม ${index + 1}`}
                    disableUp={index === 0}
                    disableDown={index === content.benefitGroups.length - 1}
                    onUp={() => patchContent({ ...content, benefitGroups: moveItem(content.benefitGroups, index, -1) })}
                    onDown={() => patchContent({ ...content, benefitGroups: moveItem(content.benefitGroups, index, 1) })}
                    onRemove={() => patchContent({ ...content, benefitGroups: content.benefitGroups.filter((_, i) => i !== index) })}
                  />
                  <Field label="หัวข้อกลุ่ม">
                    <input className="crm-field" value={item.title} onChange={(e) => patchContent({ ...content, benefitGroups: content.benefitGroups.map((row, i) => (i === index ? { ...row, title: e.target.value } : row)) })} />
                  </Field>
                  <Field label="รายการ" hint="หนึ่งรายการต่อบรรทัด">
                    <textarea className="crm-area" rows={4} value={item.items.join("\n")} onChange={(e) => patchContent({ ...content, benefitGroups: content.benefitGroups.map((row, i) => (i === index ? { ...row, items: parseLines(e.target.value) } : row)) })} />
                  </Field>
                </article>
              ))}
            </div>
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  benefitGroups: [...content.benefitGroups, { id: newReservationsItemId("benefit"), title: "", items: [] } satisfies CmsReservationBenefitGroup],
                })
              }
            >
              เพิ่มกลุ่มประโยชน์
            </button>
            <div className="crm-cs-metrics">
              {content.flowSteps.map((item, index) => (
                <article key={item.id} className="crm-cs-metric">
                  <ListBar
                    title={item.label || `ขั้น ${index + 1}`}
                    disableUp={index === 0}
                    disableDown={index === content.flowSteps.length - 1}
                    onUp={() => patchContent({ ...content, flowSteps: moveItem(content.flowSteps, index, -1) })}
                    onDown={() => patchContent({ ...content, flowSteps: moveItem(content.flowSteps, index, 1) })}
                    onRemove={() => patchContent({ ...content, flowSteps: content.flowSteps.filter((_, i) => i !== index) })}
                  />
                  <Field label="เลขขั้น">
                    <input className="crm-field" value={item.number} onChange={(e) => patchContent({ ...content, flowSteps: content.flowSteps.map((row, i) => (i === index ? { ...row, number: e.target.value } : row)) })} />
                  </Field>
                  <Field label="ชื่อขั้น">
                    <input className="crm-field" value={item.label} onChange={(e) => patchContent({ ...content, flowSteps: content.flowSteps.map((row, i) => (i === index ? { ...row, label: e.target.value } : row)) })} />
                  </Field>
                </article>
              ))}
            </div>
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  flowSteps: [
                    ...content.flowSteps,
                    { id: newReservationsItemId("flow"), number: String(content.flowSteps.length + 1).padStart(2, "0"), label: "" } satisfies CmsReservationFlowStep,
                  ],
                })
              }
            >
              เพิ่มขั้นปฏิบัติ
            </button>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "workflow"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Team workflow</p>
                <h2>เจ้าของงาน Input Output และการส่งต่อ</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อส่วน">
              <input className="crm-field" value={content.workflowSection.title} onChange={(e) => patchContent({ ...content, workflowSection: { ...content.workflowSection, title: e.target.value } })} />
            </Field>
            <Field label="หัวข้อหมายเหตุ">
              <input className="crm-field" value={content.workflowSection.noteTitle} onChange={(e) => patchContent({ ...content, workflowSection: { ...content.workflowSection, noteTitle: e.target.value } })} />
            </Field>
            <Field label="เนื้อหาหมายเหตุ">
              <textarea className="crm-area" rows={3} value={content.workflowSection.noteBody} onChange={(e) => patchContent({ ...content, workflowSection: { ...content.workflowSection, noteBody: e.target.value } })} />
            </Field>
            <VisualFields slot="workflow" fileName="workflowImageFile" visual={content.workflowSection.visual} hint="แนะนำ 1600×900 px" />
            <div className="crm-cs-metrics">
              {content.workflowSteps.map((item, index) => (
                <article key={item.id} className="crm-cs-metric">
                  <ListBar
                    title={item.title || `ขั้น ${index + 1}`}
                    disableUp={index === 0}
                    disableDown={index === content.workflowSteps.length - 1}
                    onUp={() => patchContent({ ...content, workflowSteps: moveItem(content.workflowSteps, index, -1).map((row, order) => ({ ...row, order: order + 1 })) })}
                    onDown={() => patchContent({ ...content, workflowSteps: moveItem(content.workflowSteps, index, 1).map((row, order) => ({ ...row, order: order + 1 })) })}
                    onRemove={() => patchContent({ ...content, workflowSteps: content.workflowSteps.filter((_, i) => i !== index) })}
                  />
                  <Field label="เลขขั้น">
                    <input className="crm-field" value={item.number} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, number: e.target.value } : row)) })} />
                  </Field>
                  <Field label="ชื่องาน">
                    <input className="crm-field" value={item.title} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, title: e.target.value } : row)) })} />
                  </Field>
                  <Field label="คำอธิบาย">
                    <textarea className="crm-area" rows={2} value={item.description} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, description: e.target.value } : row)) })} />
                  </Field>
                  <Field label="เจ้าของงาน">
                    <input className="crm-field" value={item.owner} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, owner: e.target.value } : row)) })} />
                  </Field>
                  <Field label="Input">
                    <input className="crm-field" value={item.input} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, input: e.target.value } : row)) })} />
                  </Field>
                  <Field label="Output">
                    <input className="crm-field" value={item.output} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, output: e.target.value } : row)) })} />
                  </Field>
                  <Field label="Escalation">
                    <textarea className="crm-area" rows={2} value={item.escalation} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, escalation: e.target.value } : row)) })} />
                  </Field>
                </article>
              ))}
            </div>
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  workflowSteps: [
                    ...content.workflowSteps,
                    {
                      id: newReservationsItemId("workflow"),
                      number: String(content.workflowSteps.length + 1).padStart(2, "0"),
                      title: "",
                      description: "",
                      owner: "",
                      input: "",
                      output: "",
                      escalation: "",
                      order: content.workflowSteps.length + 1,
                    } satisfies CmsReservationWorkflowStep,
                  ],
                })
              }
            >
              เพิ่มขั้นส่งงาน
            </button>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "kpis"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">KPIs</p>
                <h2>คำนิยาม ค่า ช่วงเวลา และข้อมูลกราฟ</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อส่วน">
              <input className="crm-field" value={content.measureSection.title} onChange={(e) => patchContent({ ...content, measureSection: { ...content.measureSection, title: e.target.value } })} />
            </Field>
            <Field label="คำนำ">
              <textarea className="crm-area" rows={3} value={content.measureSection.intro} onChange={(e) => patchContent({ ...content, measureSection: { ...content.measureSection, intro: e.target.value } })} />
            </Field>
            <Field label="ข้อความปิด">
              <textarea className="crm-area" rows={2} value={content.measureSection.close} onChange={(e) => patchContent({ ...content, measureSection: { ...content.measureSection, close: e.target.value } })} />
            </Field>
            <Field label="ป้าย Sample data" hint="จำเป็นเมื่อสถานะข้อมูลเป็น Sample">
              <input className="crm-field" value={content.measureSection.sampleLabel} onChange={(e) => patchContent({ ...content, measureSection: { ...content.measureSection, sampleLabel: e.target.value } })} />
            </Field>
            <VisualFields slot="kpis" fileName="kpiImageFile" visual={content.measureSection.visual} hint="แนะนำ 1600×900 px · Sample data เท่านั้นจนกว่าจะมีข้อมูลอนุมัติ" />
            <div className="crm-cs-metrics">
              {content.kpis.map((item, index) => (
                <article key={item.id} className="crm-cs-metric">
                  <ListBar
                    title={item.name || `KPI ${index + 1}`}
                    disableUp={index === 0}
                    disableDown={index === content.kpis.length - 1}
                    onUp={() => patchContent({ ...content, kpis: moveItem(content.kpis, index, -1) })}
                    onDown={() => patchContent({ ...content, kpis: moveItem(content.kpis, index, 1) })}
                    onRemove={() => patchContent({ ...content, kpis: content.kpis.filter((_, i) => i !== index) })}
                  />
                  <Field label="ชื่อ KPI">
                    <input className="crm-field" value={item.name} onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, name: e.target.value } : row)) })} />
                  </Field>
                  <Field label="คำนิยาม">
                    <textarea className="crm-area" rows={2} value={item.definition} onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, definition: e.target.value } : row)) })} />
                  </Field>
                  <Field label="หน่วย">
                    <input className="crm-field" value={item.unit} onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, unit: e.target.value } : row)) })} />
                  </Field>
                  <Field label="ช่วงเวลา">
                    <input className="crm-field" value={item.period} onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, period: e.target.value } : row)) })} />
                  </Field>
                  <Field label="ค่าที่แสดง">
                    <input className="crm-field" value={item.value} onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, value: e.target.value } : row)) })} />
                  </Field>
                  <Field label="เป้าหมาย">
                    <input className="crm-field" value={item.target} onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, target: e.target.value } : row)) })} />
                  </Field>
                  <Field label="สถานะข้อมูล">
                    <select
                      className="crm-field"
                      value={item.dataStatus}
                      onChange={(e) =>
                        patchContent({
                          ...content,
                          kpis: content.kpis.map((row, i) => (i === index ? { ...row, dataStatus: e.target.value as ReservationsKpiStatus } : row)),
                        })
                      }
                    >
                      {RESERVATIONS_KPI_STATUSES.map((statusItem) => (
                        <option key={statusItem} value={statusItem}>
                          {statusItem}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <label className="kpi-reservations-boundaries-check">
                    <input
                      type="checkbox"
                      checked={item.hideUntilData}
                      onChange={(e) =>
                        patchContent({
                          ...content,
                          kpis: content.kpis.map((row, i) => (i === index ? { ...row, hideUntilData: e.target.checked } : row)),
                        })
                      }
                    />
                    <span>ซ่อนจนกว่าจะมีข้อมูล</span>
                  </label>
                  <Field label="ค่ากราฟ" hint="ตัวเลขคั่นด้วยจุลภาค">
                    <input className="crm-field" value={csv(item.values)} onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, values: parseCsvNumbers(e.target.value) } : row)) })} />
                  </Field>
                  <Field label="ป้ายกราฟ" hint="คั่นด้วยจุลภาค ให้จำนวนเท่ากับค่ากราฟ">
                    <input className="crm-field" value={csv(item.labels)} onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, labels: parseCsv(e.target.value) } : row)) })} />
                  </Field>
                </article>
              ))}
            </div>
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  kpis: [
                    ...content.kpis,
                    {
                      id: newReservationsItemId("kpi"),
                      name: "",
                      definition: "",
                      unit: "",
                      period: "",
                      target: "",
                      value: "",
                      dataStatus: "sample",
                      values: [],
                      labels: [],
                      hideUntilData: false,
                    } satisfies CmsReservationKpi,
                  ],
                })
              }
            >
              เพิ่ม KPI
            </button>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "related"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Related</p>
                <h2>การ์ดเนื้อหาที่เกี่ยวข้อง</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อส่วน">
              <input className="crm-field" value={content.related.title} onChange={(e) => patchContent({ ...content, related: { ...content.related, title: e.target.value } })} />
            </Field>
            <VisualFields slot="related" fileName="relatedImageFile" visual={content.related.visual} hint="แนะนำ 1200×800 px" />
            <div className="crm-cs-metrics">
              {content.related.cards.map((item, index) => (
                <article key={item.id} className="crm-cs-metric">
                  <ListBar
                    title={item.title || `การ์ด ${index + 1}`}
                    disableUp={index === 0}
                    disableDown={index === content.related.cards.length - 1}
                    onUp={() => patchContent({ ...content, related: { ...content.related, cards: moveItem(content.related.cards, index, -1) } })}
                    onDown={() => patchContent({ ...content, related: { ...content.related, cards: moveItem(content.related.cards, index, 1) } })}
                    onRemove={() => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.filter((_, i) => i !== index) } })}
                  />
                  <Field label="หมวด">
                    <input className="crm-field" value={item.category} onChange={(e) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((row, i) => (i === index ? { ...row, category: e.target.value } : row)) } })} />
                  </Field>
                  <Field label="หัวข้อ">
                    <input className="crm-field" value={item.title} onChange={(e) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((row, i) => (i === index ? { ...row, title: e.target.value } : row)) } })} />
                  </Field>
                  <Field label="ลิงก์">
                    <input className="crm-field" value={item.href} onChange={(e) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((row, i) => (i === index ? { ...row, href: e.target.value } : row)) } })} />
                  </Field>
                  <Field label="ปุ่ม">
                    <input className="crm-field" value={item.cta} onChange={(e) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((row, i) => (i === index ? { ...row, cta: e.target.value } : row)) } })} />
                  </Field>
                  <Field label="คำอธิบาย">
                    <textarea className="crm-area" rows={3} value={item.description} onChange={(e) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((row, i) => (i === index ? { ...row, description: e.target.value } : row)) } })} />
                  </Field>
                  <Field label="ข้อมูลเสริม">
                    <input className="crm-field" value={item.meta} onChange={(e) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((row, i) => (i === index ? { ...row, meta: e.target.value } : row)) } })} />
                  </Field>
                </article>
              ))}
            </div>
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
                      { id: newReservationsItemId("card"), href: "/", category: "", title: "", description: "", meta: "", cta: "" } satisfies CmsRelatedCard,
                    ],
                  },
                })
              }
            >
              เพิ่มการ์ด
            </button>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "form"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Form</p>
                <h2>ข้อความช่วยกรอกแบบฟอร์ม</h2>
              </div>
              {saveBar}
            </header>
            <Field label="Kicker">
              <input className="crm-field" value={content.form.kicker} onChange={(e) => patchContent({ ...content, form: { ...content.form, kicker: e.target.value } })} />
            </Field>
            <Field label="หัวข้อ">
              <input className="crm-field" value={content.form.heading} onChange={(e) => patchContent({ ...content, form: { ...content.form, heading: e.target.value } })} />
            </Field>
            <Field label="คำอธิบาย">
              <textarea className="crm-area" rows={3} value={content.form.lead} onChange={(e) => patchContent({ ...content, form: { ...content.form, lead: e.target.value } })} />
            </Field>
            <Field label="หัวข้อขั้นตอนถัดไป">
              <input className="crm-field" value={content.form.nextTitle} onChange={(e) => patchContent({ ...content, form: { ...content.form, nextTitle: e.target.value } })} />
            </Field>
            <Field label="ขั้นตอน" hint="หนึ่งรายการต่อบรรทัด">
              <textarea className="crm-area" rows={4} value={content.form.steps.join("\n")} onChange={(e) => patchContent({ ...content, form: { ...content.form, steps: parseLines(e.target.value) } })} />
            </Field>
            <Field label="ข้อความความเชื่อถือ" hint="หนึ่งรายการต่อบรรทัด">
              <textarea className="crm-area" rows={4} value={content.form.trust.join("\n")} onChange={(e) => patchContent({ ...content, form: { ...content.form, trust: parseLines(e.target.value) } })} />
            </Field>
            <Field label="ข้อความปุ่มส่ง">
              <input className="crm-field" value={content.form.submit} onChange={(e) => patchContent({ ...content, form: { ...content.form, submit: e.target.value } })} />
            </Field>
            <Field label="ป้ายกลุ่มงานจอง">
              <input className="crm-field" value={content.form.workGroup} onChange={(e) => patchContent({ ...content, form: { ...content.form, workGroup: e.target.value } })} />
            </Field>
            <Field label="ป้ายช่องทาง">
              <input className="crm-field" value={content.form.channelsLabel} onChange={(e) => patchContent({ ...content, form: { ...content.form, channelsLabel: e.target.value } })} />
            </Field>
            <Field label="คำใบ้ช่องทาง">
              <input className="crm-field" value={content.form.channelsHint} onChange={(e) => patchContent({ ...content, form: { ...content.form, channelsHint: e.target.value } })} />
            </Field>
            <Field label="ป้ายขอบเขตงาน">
              <input className="crm-field" value={content.form.scopeLabel} onChange={(e) => patchContent({ ...content, form: { ...content.form, scopeLabel: e.target.value } })} />
            </Field>
            <Field label="คำใบ้ขอบเขตงาน">
              <input className="crm-field" value={content.form.scopeHint} onChange={(e) => patchContent({ ...content, form: { ...content.form, scopeHint: e.target.value } })} />
            </Field>
            <VisualFields slot="form" fileName="formImageFile" visual={content.form.visual} hint="แนะนำ 1200×800 px · ใช้รูปทีมที่ตรวจแล้วเท่านั้น" />
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "faq"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">FAQ</p>
                <h2>คำถามที่พบบ่อย</h2>
              </div>
              {saveBar}
            </header>
            <Field label="คำนำ FAQ">
              <textarea className="crm-area" rows={3} value={content.faqIntro} onChange={(e) => patchContent({ ...content, faqIntro: e.target.value })} />
            </Field>
            <div className="crm-cs-metrics">
              {content.faqs.map((item, index) => (
                <article key={item.id} className="crm-cs-metric">
                  <ListBar
                    title={item.q || `คำถาม ${index + 1}`}
                    disableUp={index === 0}
                    disableDown={index === content.faqs.length - 1}
                    onUp={() => patchContent({ ...content, faqs: moveItem(content.faqs, index, -1) })}
                    onDown={() => patchContent({ ...content, faqs: moveItem(content.faqs, index, 1) })}
                    onRemove={() => patchContent({ ...content, faqs: content.faqs.filter((_, i) => i !== index) })}
                  />
                  <Field label="คำถาม">
                    <input className="crm-field" value={item.q} onChange={(e) => patchContent({ ...content, faqs: content.faqs.map((row, i) => (i === index ? { ...row, q: e.target.value } : row)) })} />
                  </Field>
                  <Field label="คำตอบ">
                    <textarea className="crm-area" rows={4} value={item.a} onChange={(e) => patchContent({ ...content, faqs: content.faqs.map((row, i) => (i === index ? { ...row, a: e.target.value } : row)) })} />
                  </Field>
                </article>
              ))}
            </div>
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() => patchContent({ ...content, faqs: [...content.faqs, { id: newReservationsItemId("faq"), q: "", a: "" }] })}
            >
              เพิ่มคำถาม
            </button>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "boundaries"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Service boundaries</p>
                <h2>เส้นแบ่งงาน ช่องทาง ภาษา และ SLA</h2>
              </div>
              {saveBar}
            </header>
            <p className="crm-cms-editor-note">ฟิลด์ว่างจะไม่แสดงบนหน้าสาธารณะ และห้ามใส่ 24/7 หรือชื่อระบบที่ยังไม่ตกลง</p>
            <div className="kpi-reservations-boundaries-editor-grid">
              <fieldset>
                <legend>The KPI Plus handles</legend>
                {content.boundaries.handles.map((item, index) => (
                  <label key={item.id} className="kpi-reservations-boundaries-check">
                    <input type="checkbox" checked={item.configured} onChange={(e) => toggleBoundary("handles", index, { configured: e.target.checked })} />
                    <span className="kpi-latin">{item.label}</span>
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>The hotel approves or owns</legend>
                {content.boundaries.hotelOwns.map((item, index) => (
                  <label key={item.id} className="kpi-reservations-boundaries-check">
                    <input type="checkbox" checked={item.configured} onChange={(e) => toggleBoundary("hotelOwns", index, { configured: e.target.checked })} />
                    <span className="kpi-latin">{item.label}</span>
                  </label>
                ))}
              </fieldset>
            </div>
            <Field label="Supported channels" hint="คั่นด้วยจุลภาค เว้นว่างแล้วจะไม่โชว์">
              <input className="crm-field" value={content.boundaries.supportedChannels.join(", ")} onChange={(e) => patchContent({ ...content, boundaries: { ...content.boundaries, supportedChannels: parseCsv(e.target.value) } })} />
            </Field>
            <Field label="Supported languages" hint="เว้นว่างจนกว่าจะอนุมัติภาษาที่รองรับ">
              <input className="crm-field" value={content.boundaries.supportedLanguages.join(", ")} onChange={(e) => patchContent({ ...content, boundaries: { ...content.boundaries, supportedLanguages: parseCsv(e.target.value) } })} />
            </Field>
            <Field label="Operating hours">
              <input className="crm-field" value={content.boundaries.operatingHours} onChange={(e) => patchContent({ ...content, boundaries: { ...content.boundaries, operatingHours: e.target.value } })} />
            </Field>
            <Field label="SLA wording" hint="ข้อความชั่วโมงดูแล ไม่ใช่ตัวเลขรับประกัน">
              <textarea className="crm-area" rows={3} value={content.boundaries.slaText} onChange={(e) => patchContent({ ...content, boundaries: { ...content.boundaries, slaText: e.target.value } })} />
            </Field>
            <label className="kpi-reservations-boundaries-check">
              <input
                type="checkbox"
                checked={content.boundaries.slaApproved}
                onChange={(e) => patchContent({ ...content, boundaries: { ...content.boundaries, slaApproved: e.target.checked } })}
              />
              <span>อนุมัติข้อความ SLA สำหรับหน้าสาธารณะแล้ว</span>
            </label>
            <Field label="Escalation path">
              <textarea className="crm-area" rows={3} value={content.boundaries.escalationPath} onChange={(e) => patchContent({ ...content, boundaries: { ...content.boundaries, escalationPath: e.target.value } })} />
            </Field>
            <Field label="PMS / Booking Engine notes">
              <textarea className="crm-area" rows={3} value={content.boundaries.integrationNotes} onChange={(e) => patchContent({ ...content, boundaries: { ...content.boundaries, integrationNotes: e.target.value } })} />
            </Field>
            <Field label="Reporting frequency">
              <input className="crm-field" value={content.boundaries.reportingFrequency} onChange={(e) => patchContent({ ...content, boundaries: { ...content.boundaries, reportingFrequency: e.target.value } })} />
            </Field>
            <Field label="Privacy / security note">
              <textarea className="crm-area" rows={3} value={content.boundaries.privacyNote} onChange={(e) => patchContent({ ...content, boundaries: { ...content.boundaries, privacyNote: e.target.value } })} />
            </Field>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "seo"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">SEO</p>
                <h2>ชื่อหน้าและคำอธิบายสำหรับเครื่องมือค้นหา</h2>
              </div>
              {saveBar}
            </header>
            <Field label="ชื่อเอกสาร">
              <input className="crm-field" name="title" value={meta.title} onChange={(e) => { setMeta((current) => ({ ...current, title: e.target.value })); markDirty(); }} />
            </Field>
            <Field label="SEO title">
              <input className="crm-field" name="seoTitle" value={meta.seoTitle} onChange={(e) => { setMeta((current) => ({ ...current, seoTitle: e.target.value })); markDirty(); }} />
            </Field>
            <Field label="Meta description">
              <textarea className="crm-area" name="metaDescription" rows={4} value={meta.metaDescription} onChange={(e) => { setMeta((current) => ({ ...current, metaDescription: e.target.value, excerpt: e.target.value })); markDirty(); }} />
            </Field>
            <input type="hidden" name="excerpt" value={meta.excerpt} />
            <p className="crm-cms-editor-note">รูปสำหรับแชร์โซเชียล (OG image) · แนะนำ 1200×630 px</p>
            <VisualFields
              slot="social"
              fileName="ogImageFile"
              visual={content.seo.social ?? emptyVisual()}
              hint="แนะนำ 1200×630 px JPG / PNG / WEBP ไม่เกิน 5MB · รูปที่เผยแพร่ต้องมี alt ไทยและอังกฤษ"
            />
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "publish"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Publish</p>
                <h2>บันทึก ตัวอย่าง และเผยแพร่</h2>
              </div>
              {saveBar}
            </header>
            <p className="crm-cms-editor-note">
              สถานะตอนนี้: {published ? "เผยแพร่แล้ว — เนื้อหานี้แทนที่ข้อความในโค้ด" : "ฉบับร่าง — หน้าสาธารณะยังใช้เนื้อหาในโค้ด"}
            </p>
            <p className="crm-cms-editor-note">อัปเดตล่าสุด: {formatStamp(updatedAt)}</p>
            <p className={`crm-cs-save-state${stateClass}`} role="status">
              {saveState || "พร้อมบันทึก"}
            </p>
            <button className="kpi-button crm-cms-editor-save" type="submit" name="intent" value="save" disabled={pending}>
              บันทึก
            </button>
            <button className="crm-users-secondary crm-cms-editor-save" type="submit" name="intent" value="draft" disabled={pending}>
              บันทึกฉบับร่าง
            </button>
            <button className="crm-users-secondary crm-cms-editor-save" type="submit" name="intent" value="preview" disabled={pending}>
              บันทึกแล้วดูตัวอย่าง
            </button>
            {published ? (
              <button className="crm-users-secondary crm-cms-editor-save" type="submit" name="intent" value="unpublish" disabled={pending}>
                ยกเลิกเผยแพร่
              </button>
            ) : (
              <button className="kpi-button crm-cms-editor-save" type="submit" name="intent" value="publish" disabled={pending}>
                เผยแพร่
              </button>
            )}
            <p className="crm-cms-editor-note">
              ตัวอย่างในระบบ: {previewHref}
              {published ? ` · หน้าสาธารณะ: ${publicHref}` : " · ยังไม่แสดงบนเว็บสาธารณะจนกว่าจะเผยแพร่"}
            </p>
          </section>
        </div>

        <aside className="crm-cms-editor-side">
          <section className="crm-cms-editor-panel">
            <p className="crm-cms-editor-kicker">Workflow</p>
            <h2>บันทึกและเผยแพร่</h2>
            <p className={`crm-cs-save-state${stateClass}`} role="status">
              {saveState || "พร้อมบันทึก"}
            </p>
            <button className="kpi-button crm-cms-editor-save" type="submit" name="intent" value="save" disabled={pending}>
              บันทึก
            </button>
            <button className="crm-users-secondary crm-cms-editor-save" type="submit" name="intent" value="draft" disabled={pending}>
              บันทึกฉบับร่าง
            </button>
            <button className="crm-users-secondary crm-cms-editor-save" type="submit" name="intent" value="preview" disabled={pending}>
              บันทึกแล้วดูตัวอย่าง
            </button>
            {published ? (
              <button className="crm-users-secondary crm-cms-editor-save" type="submit" name="intent" value="unpublish" disabled={pending}>
                ยกเลิกเผยแพร่
              </button>
            ) : (
              <button className="kpi-button crm-cms-editor-save" type="submit" name="intent" value="publish" disabled={pending}>
                เผยแพร่
              </button>
            )}
          </section>
        </aside>

        <div className="crm-cs-sticky-save">
          <p className={`crm-cs-save-state${stateClass}`} role="status">
            {saveState || "พร้อมบันทึก"}
          </p>
          <div className="crm-cs-sticky-actions">{saveButtons}</div>
        </div>
      </form>

      {dialog === "unpublish" ? (
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" onClick={() => setDialog(null)} />
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby="reservations-unpublish-title">
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">CMS</p>
                <h2 id="reservations-unpublish-title">ยกเลิกเผยแพร่</h2>
              </div>
              <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={() => setDialog(null)}>
                ×
              </button>
            </div>
            <p className="crm-users-alert is-warn" role="status">
              หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ด จนกว่าจะเผยแพร่อีกครั้ง
            </p>
            <div className="crm-modal-actions">
              <button type="button" className="crm-users-secondary" onClick={() => setDialog(null)}>
                ยกเลิก
              </button>
              <button
                type="button"
                className="kpi-button"
                onClick={() => {
                  setDialog(null);
                  submit("unpublish");
                }}
              >
                ยกเลิกเผยแพร่
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
