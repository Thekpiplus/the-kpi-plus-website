"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  REVENUE_KPI_STATUSES,
  REVENUE_VISUAL_STATUSES,
  newRevenueItemId,
  revenueErrorMessage,
  type CmsKpi,
  type CmsLayer,
  type CmsRelatedCard,
  type CmsRevenuePage,
  type CmsVisual,
  type RevenueEditorState,
  type RevenueIntent,
  type RevenueSaveResult,
  type RevenueVisualStatus,
} from "@/lib/cms/revenue-page";
import type { ConnectedArea, DataStatus, DecisionStep, ProblemItem } from "@/lib/revenue";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "problems", label: "Problems" },
  { id: "areas", label: "Areas" },
  { id: "architecture", label: "Architecture" },
  { id: "flow", label: "Decision flow" },
  { id: "kpis", label: "KPIs" },
  { id: "related", label: "Related" },
  { id: "form", label: "Form" },
  { id: "faq", label: "FAQ" },
  { id: "seo", label: "SEO" },
  { id: "publish", label: "Publish" },
] as const;

type Tab = (typeof TABS)[number]["id"];

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

function parseCsv(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function RevenuePageEditor({
  initial,
  notice,
  error,
  saveAction,
  updatedAt,
  initialTab,
  previewHref,
  publicHref,
}: {
  initial: RevenueEditorState;
  notice?: string;
  error?: string;
  saveAction: (formData: FormData) => Promise<RevenueSaveResult>;
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
  const [content, setContent] = useState<CmsRevenuePage>(initial.content);
  const [status, setStatus] = useState(error ? revenueErrorMessage(error) : "");
  const [ok, setOk] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<"unpublish" | null>(null);
  const [dirty, setDirty] = useState(false);
  const [previews, setPreviews] = useState({
    hero: initial.content.hero.visual.src,
    architecture: initial.content.architecture.visual.src,
    decisionFlow: initial.content.decisionFlow.visual.src,
    chart: initial.content.chart.visual.src,
    related: initial.content.related.visual.src,
    social: initial.content.seo?.social.src ?? "",
  });
  const [clears, setClears] = useState({
    hero: false,
    architecture: false,
    decisionFlow: false,
    chart: false,
    related: false,
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

  function patchContent(next: CmsRevenuePage) {
    setContent(next);
    markDirty();
  }

  function patchHero<K extends keyof CmsRevenuePage["hero"]>(key: K, value: CmsRevenuePage["hero"][K]) {
    patchContent({ ...content, hero: { ...content.hero, [key]: value } });
  }

  function patchVisual(slot: keyof typeof previews, visual: CmsVisual) {
    if (slot === "hero") patchHero("visual", visual);
    else if (slot === "architecture") {
      patchContent({ ...content, architecture: { ...content.architecture, visual } });
    } else if (slot === "decisionFlow") {
      patchContent({ ...content, decisionFlow: { ...content.decisionFlow, visual } });
    } else if (slot === "chart") {
      patchContent({ ...content, chart: { ...content.chart, visual } });
    } else if (slot === "social") {
      patchContent({ ...content, seo: { ...content.seo, social: visual } });
    } else {
      patchContent({ ...content, related: { ...content.related, visual } });
    }
  }

  function VisualFields({
    slot,
    fileName,
    visual,
    hint,
  }: {
    slot: keyof typeof previews;
    fileName: string;
    visual: CmsVisual;
    hint: string;
  }) {
    return (
      <>
        <Field label="คำอธิบายภาพ (alt)" hint="จำเป็นเมื่อมีรูปและจะเผยแพร่">
          <input
            className="crm-field"
            value={visual.alt}
            onChange={(event) => patchVisual(slot, { ...visual, alt: event.target.value })}
          />
        </Field>
        <Field label="ป้ายกำกับรูป">
          <input
            className="crm-field"
            value={visual.label}
            onChange={(event) => patchVisual(slot, { ...visual, label: event.target.value })}
          />
        </Field>
        <Field label="สถานะรูป" hint="Placeholder เผยแพร่ไม่ได้ถ้ามีไฟล์รูป">
          <select
            className="crm-field"
            value={visual.status}
            onChange={(event) =>
              patchVisual(slot, { ...visual, status: event.target.value as RevenueVisualStatus })
            }
          >
            {REVENUE_VISUAL_STATUSES.map((item) => (
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
        <ImagePreview src={clears[slot] ? "" : previews[slot]} alt={visual.alt} recommended={hint} />
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

  function submit(intent: RevenueIntent) {
    const node = formRef.current;
    if (!node) return;
    const data = new FormData(node);
    data.set("intent", intent);
    data.set("contentJson", JSON.stringify(content));
    if (clears.hero) data.set("clearHeroImage", "1");
    if (clears.architecture) data.set("clearArchitectureImage", "1");
    if (clears.decisionFlow) data.set("clearDecisionFlowImage", "1");
    if (clears.chart) data.set("clearChartImage", "1");
    if (clears.related) data.set("clearRelatedImage", "1");
    if (clears.social) data.set("clearOgImage", "1");
    startTransition(async () => {
      setOk("");
      setStatus("");
      const result = await saveAction(data);
      if (!result.ok) {
        setStatus(revenueErrorMessage(result.error));
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
    const intent = (submitter?.value as RevenueIntent) || "save";
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

  return (
    <div className="crm-cs-editor-shell">
      <div className="crm-cs-tabs" role="tablist" aria-label="แก้ไขหน้า Revenue">
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
            <Field label="หัวข้อ">
              <textarea className="crm-area" rows={3} value={content.hero.title} onChange={(e) => patchHero("title", e.target.value)} />
            </Field>
            <Field label="คำอธิบาย">
              <textarea className="crm-area" rows={4} value={content.hero.description} onChange={(e) => patchHero("description", e.target.value)} />
            </Field>
            <Field label="ข้อความเชื่อมบริการ">
              <input className="crm-field" value={content.hero.connectIntro} onChange={(e) => patchHero("connectIntro", e.target.value)} />
            </Field>
            <Field label="รายการที่เชื่อมกัน" hint="หนึ่งรายการต่อบรรทัด">
              <textarea
                className="crm-area"
                rows={6}
                value={content.hero.connections.join("\n")}
                onChange={(e) => patchHero("connections", e.target.value.split("\n").map((item) => item.trim()).filter(Boolean))}
              />
            </Field>
            <Field label="ข้อความปิดท้าย">
              <textarea className="crm-area" rows={3} value={content.hero.leadClose} onChange={(e) => patchHero("leadClose", e.target.value)} />
            </Field>
            <div className="crm-cms-field-grid">
              <Field label="ปุ่มหลัก">
                <input className="crm-field" value={content.hero.primaryCta.label} onChange={(e) => patchHero("primaryCta", { ...content.hero.primaryCta, label: e.target.value })} />
              </Field>
              <Field label="ลิงก์ปุ่มหลัก" hint="/path, #anchor หรือ https://">
                <input className="crm-field" value={content.hero.primaryCta.href} onChange={(e) => patchHero("primaryCta", { ...content.hero.primaryCta, href: e.target.value })} />
              </Field>
              <Field label="ปุ่มรอง">
                <input className="crm-field" value={content.hero.secondaryCta.label} onChange={(e) => patchHero("secondaryCta", { ...content.hero.secondaryCta, label: e.target.value })} />
              </Field>
              <Field label="ลิงก์ปุ่มรอง">
                <input className="crm-field" value={content.hero.secondaryCta.href} onChange={(e) => patchHero("secondaryCta", { ...content.hero.secondaryCta, href: e.target.value })} />
              </Field>
            </div>
            <Field label="ข้อความใต้ปุ่ม">
              <input className="crm-field" value={content.hero.underCta} onChange={(e) => patchHero("underCta", e.target.value)} />
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
                <h2>ปัญหา ข้อมูล และการกระทำถัดไป</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อส่วน">
              <input className="crm-field" value={content.problemsSection.title} onChange={(e) => patchContent({ ...content, problemsSection: { ...content.problemsSection, title: e.target.value } })} />
            </Field>
            <Field label="คำนำ">
              <textarea className="crm-area" rows={3} value={content.problemsSection.intro} onChange={(e) => patchContent({ ...content, problemsSection: { ...content.problemsSection, intro: e.target.value } })} />
            </Field>
            <div className="crm-cs-metrics">
              {content.problems.map((item, index) => (
                <article key={item.id} className="crm-cs-metric">
                  <ListBar
                    title={`ปัญหา ${String(index + 1).padStart(2, "0")}`}
                    disableUp={index === 0}
                    disableDown={index === content.problems.length - 1}
                    onUp={() => patchContent({ ...content, problems: moveItem(content.problems, index, -1).map((row, order) => ({ ...row, order: order + 1 })) })}
                    onDown={() => patchContent({ ...content, problems: moveItem(content.problems, index, 1).map((row, order) => ({ ...row, order: order + 1 })) })}
                    onRemove={() => patchContent({ ...content, problems: content.problems.filter((_, i) => i !== index).map((row, order) => ({ ...row, order: order + 1 })) })}
                  />
                  <Field label="ปัญหา">
                    <textarea className="crm-area" rows={2} value={item.problem} onChange={(e) => patchContent({ ...content, problems: content.problems.map((row, i) => (i === index ? { ...row, problem: e.target.value } : row)) })} />
                  </Field>
                  <Field label="ข้อมูลที่ต้องดู">
                    <textarea className="crm-area" rows={2} value={item.dataToInspect} onChange={(e) => patchContent({ ...content, problems: content.problems.map((row, i) => (i === index ? { ...row, dataToInspect: e.target.value } : row)) })} />
                  </Field>
                  <Field label="สิ่งที่ทำต่อ">
                    <textarea className="crm-area" rows={2} value={item.nextAction} onChange={(e) => patchContent({ ...content, problems: content.problems.map((row, i) => (i === index ? { ...row, nextAction: e.target.value } : row)) })} />
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
                    { id: newRevenueItemId("problem"), problem: "", dataToInspect: "", nextAction: "", order: content.problems.length + 1 } satisfies ProblemItem,
                  ],
                })
              }
            >
              เพิ่มปัญหา
            </button>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "areas"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Areas</p>
                <h2>ห้าด้านที่เชื่อมกัน</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อส่วน">
              <input className="crm-field" value={content.areasSection.title} onChange={(e) => patchContent({ ...content, areasSection: { ...content.areasSection, title: e.target.value } })} />
            </Field>
            <Field label="ข้อความปิดท้าย">
              <textarea className="crm-area" rows={3} value={content.areasSection.close} onChange={(e) => patchContent({ ...content, areasSection: { ...content.areasSection, close: e.target.value } })} />
            </Field>
            <div className="crm-cs-metrics">
              {content.areas.map((item, index) => (
                <article key={item.id} className="crm-cs-metric">
                  <ListBar
                    title={`${item.number || String(index + 1).padStart(2, "0")} ${item.title || "ด้านใหม่"}`}
                    disableUp={index === 0}
                    disableDown={index === content.areas.length - 1}
                    onUp={() => patchContent({ ...content, areas: moveItem(content.areas, index, -1).map((row, order) => ({ ...row, order: order + 1, number: String(order + 1).padStart(2, "0") })) })}
                    onDown={() => patchContent({ ...content, areas: moveItem(content.areas, index, 1).map((row, order) => ({ ...row, order: order + 1, number: String(order + 1).padStart(2, "0") })) })}
                    onRemove={() => patchContent({ ...content, areas: content.areas.filter((_, i) => i !== index).map((row, order) => ({ ...row, order: order + 1, number: String(order + 1).padStart(2, "0") })) })}
                  />
                  <div className="crm-cms-field-grid">
                    <Field label="ชื่อด้าน">
                      <input className="crm-field" value={item.title} onChange={(e) => patchContent({ ...content, areas: content.areas.map((row, i) => (i === index ? { ...row, title: e.target.value } : row)) })} />
                    </Field>
                    <Field label="ผลที่ได้">
                      <input className="crm-field" value={item.output} onChange={(e) => patchContent({ ...content, areas: content.areas.map((row, i) => (i === index ? { ...row, output: e.target.value } : row)) })} />
                    </Field>
                    <Field label="ลิงก์ (ถ้ามี)">
                      <input className="crm-field" value={item.href ?? ""} onChange={(e) => patchContent({ ...content, areas: content.areas.map((row, i) => (i === index ? { ...row, href: e.target.value } : row)) })} />
                    </Field>
                  </div>
                  <Field label="คำอธิบาย">
                    <textarea className="crm-area" rows={3} value={item.description} onChange={(e) => patchContent({ ...content, areas: content.areas.map((row, i) => (i === index ? { ...row, description: e.target.value } : row)) })} />
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
                  areas: [
                    ...content.areas,
                    { id: newRevenueItemId("area"), number: String(content.areas.length + 1).padStart(2, "0"), title: "", description: "", output: "", order: content.areas.length + 1 } satisfies ConnectedArea,
                  ],
                })
              }
            >
              เพิ่มด้าน
            </button>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "architecture"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Architecture</p>
                <h2>แผนผังบริการ</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อแผนผัง">
              <input className="crm-field" value={content.architecture.title} onChange={(e) => patchContent({ ...content, architecture: { ...content.architecture, title: e.target.value } })} />
            </Field>
            <Field label="คำอธิบาย">
              <textarea className="crm-area" rows={3} value={content.architecture.description} onChange={(e) => patchContent({ ...content, architecture: { ...content.architecture, description: e.target.value } })} />
            </Field>
            <Field label="ป้ายสถานะแผนผัง">
              <input className="crm-field" value={content.architecture.statusLabel} onChange={(e) => patchContent({ ...content, architecture: { ...content.architecture, statusLabel: e.target.value } })} />
            </Field>
            <div className="crm-cs-metrics">
              {content.architecture.layers.map((item, index) => (
                <article key={item.id} className="crm-cs-metric">
                  <ListBar
                    title={item.title || `ชั้น ${index + 1}`}
                    disableUp={index === 0}
                    disableDown={index === content.architecture.layers.length - 1}
                    onUp={() => patchContent({ ...content, architecture: { ...content.architecture, layers: moveItem(content.architecture.layers, index, -1) } })}
                    onDown={() => patchContent({ ...content, architecture: { ...content.architecture, layers: moveItem(content.architecture.layers, index, 1) } })}
                    onRemove={() => patchContent({ ...content, architecture: { ...content.architecture, layers: content.architecture.layers.filter((_, i) => i !== index) } })}
                  />
                  <Field label="ชื่อชั้น">
                    <input className="crm-field" value={item.title} onChange={(e) => patchContent({ ...content, architecture: { ...content.architecture, layers: content.architecture.layers.map((row, i) => (i === index ? { ...row, title: e.target.value } : row)) } })} />
                  </Field>
                  <Field label="รายละเอียด">
                    <input className="crm-field" value={item.body} onChange={(e) => patchContent({ ...content, architecture: { ...content.architecture, layers: content.architecture.layers.map((row, i) => (i === index ? { ...row, body: e.target.value } : row)) } })} />
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
                  architecture: {
                    ...content.architecture,
                    layers: [...content.architecture.layers, { id: newRevenueItemId("layer"), title: "", body: "" } satisfies CmsLayer],
                  },
                })
              }
            >
              เพิ่มชั้น
            </button>
            <VisualFields slot="architecture" fileName="architectureImageFile" visual={content.architecture.visual} hint="ถ้ามีรูป จะแทนแผนผัง HTML · 1600×900 px" />
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "flow"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Decision flow</p>
                <h2>สี่ขั้นและการส่งมอบ</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อส่วน">
              <input className="crm-field" value={content.stepsSection.title} onChange={(e) => patchContent({ ...content, stepsSection: { ...content.stepsSection, title: e.target.value } })} />
            </Field>
            <Field label="คำนำ">
              <textarea className="crm-area" rows={3} value={content.stepsSection.intro} onChange={(e) => patchContent({ ...content, stepsSection: { ...content.stepsSection, intro: e.target.value } })} />
            </Field>
            <Field label="ป้ายผลลัพธ์">
              <input className="crm-field" value={content.stepsSection.receiveLabel} onChange={(e) => patchContent({ ...content, stepsSection: { ...content.stepsSection, receiveLabel: e.target.value } })} />
            </Field>
            <div className="crm-cs-metrics">
              {content.steps.map((item, index) => (
                <article key={item.id} className="crm-cs-metric">
                  <ListBar
                    title={`${item.number || String(index + 1).padStart(2, "0")} ${item.title || "ขั้นใหม่"}`}
                    disableUp={index === 0}
                    disableDown={index === content.steps.length - 1}
                    onUp={() => patchContent({ ...content, steps: moveItem(content.steps, index, -1).map((row, order) => ({ ...row, order: order + 1, number: String(order + 1).padStart(2, "0") })) })}
                    onDown={() => patchContent({ ...content, steps: moveItem(content.steps, index, 1).map((row, order) => ({ ...row, order: order + 1, number: String(order + 1).padStart(2, "0") })) })}
                    onRemove={() => patchContent({ ...content, steps: content.steps.filter((_, i) => i !== index).map((row, order) => ({ ...row, order: order + 1, number: String(order + 1).padStart(2, "0") })) })}
                  />
                  <Field label="ชื่อขั้น">
                    <input className="crm-field" value={item.title} onChange={(e) => patchContent({ ...content, steps: content.steps.map((row, i) => (i === index ? { ...row, title: e.target.value } : row)) })} />
                  </Field>
                  <Field label="คำอธิบาย">
                    <textarea className="crm-area" rows={3} value={item.description} onChange={(e) => patchContent({ ...content, steps: content.steps.map((row, i) => (i === index ? { ...row, description: e.target.value } : row)) })} />
                  </Field>
                  <Field label="ผลที่โรงแรมได้รับ">
                    <input className="crm-field" value={item.output} onChange={(e) => patchContent({ ...content, steps: content.steps.map((row, i) => (i === index ? { ...row, output: e.target.value } : row)) })} />
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
                  steps: [
                    ...content.steps,
                    { id: newRevenueItemId("step"), number: String(content.steps.length + 1).padStart(2, "0"), title: "", description: "", output: "", order: content.steps.length + 1 } satisfies DecisionStep,
                  ],
                })
              }
            >
              เพิ่มขั้น
            </button>
            <Field label="หัวข้อแผนภาพ">
              <input className="crm-field" value={content.decisionFlow.title} onChange={(e) => patchContent({ ...content, decisionFlow: { ...content.decisionFlow, title: e.target.value } })} />
            </Field>
            <Field label="คำอธิบายแผนภาพ">
              <textarea className="crm-area" rows={2} value={content.decisionFlow.description} onChange={(e) => patchContent({ ...content, decisionFlow: { ...content.decisionFlow, description: e.target.value } })} />
            </Field>
            <Field label="ป้ายสถานะแผนภาพ">
              <input className="crm-field" value={content.decisionFlow.statusLabel} onChange={(e) => patchContent({ ...content, decisionFlow: { ...content.decisionFlow, statusLabel: e.target.value } })} />
            </Field>
            <VisualFields slot="decisionFlow" fileName="decisionFlowImageFile" visual={content.decisionFlow.visual} hint="ถ้ามีรูป จะแทนแผนภาพ HTML · 1600×900 px" />
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "kpis"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">KPIs</p>
                <h2>คำนิยามและข้อมูลกราฟ</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อส่วน">
              <input className="crm-field" value={content.measureSection.title} onChange={(e) => patchContent({ ...content, measureSection: { ...content.measureSection, title: e.target.value } })} />
            </Field>
            <Field label="คำนำ">
              <textarea className="crm-area" rows={3} value={content.measureSection.intro} onChange={(e) => patchContent({ ...content, measureSection: { ...content.measureSection, intro: e.target.value } })} />
            </Field>
            <div className="crm-cs-metrics">
              {content.kpis.map((item, index) => (
                <article key={item.id} className="crm-cs-metric">
                  <ListBar
                    title={item.label || `KPI ${index + 1}`}
                    disableUp={index === 0}
                    disableDown={index === content.kpis.length - 1}
                    onUp={() => patchContent({ ...content, kpis: moveItem(content.kpis, index, -1) })}
                    onDown={() => patchContent({ ...content, kpis: moveItem(content.kpis, index, 1) })}
                    onRemove={() => patchContent({ ...content, kpis: content.kpis.filter((_, i) => i !== index) })}
                  />
                  <div className="crm-cms-field-grid">
                    <Field label="ชื่อ KPI">
                      <input className="crm-field" value={item.label} onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, label: e.target.value } : row)) })} />
                    </Field>
                    <Field label="หน่วย">
                      <input className="crm-field" value={item.unit} onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, unit: e.target.value } : row)) })} />
                    </Field>
                    <Field label="ช่วงเวลา">
                      <input className="crm-field" value={item.period} onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, period: e.target.value } : row)) })} />
                    </Field>
                    <Field label="ค่า / แหล่งข้อมูล" hint="จำเป็นเมื่อสถานะไม่ใช่ Draft">
                      <input className="crm-field" value={item.source} onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, source: e.target.value } : row)) })} />
                    </Field>
                    <Field label="เป้า (ถ้ามี)">
                      <input className="crm-field" value={item.target} onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, target: e.target.value } : row)) })} />
                    </Field>
                    <Field label="สถานะข้อมูล">
                      <select
                        className="crm-field"
                        value={item.dataStatus}
                        onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, dataStatus: e.target.value as DataStatus } : row)) })}
                      >
                        {REVENUE_KPI_STATUSES.map((statusItem) => (
                          <option key={statusItem} value={statusItem}>
                            {statusItem}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="คำนิยาม">
                    <textarea className="crm-area" rows={2} value={item.definition} onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, definition: e.target.value } : row)) })} />
                  </Field>
                  <Field label="ค่ากราฟ" hint="คั่นด้วยจุลภาค เช่น 74, 72, 70">
                    <input className="crm-field" value={csv(item.values)} onChange={(e) => patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, values: parseCsvNumbers(e.target.value) } : row)) })} />
                  </Field>
                  <Field label="ป้ายแกน X" hint="คั่นด้วยจุลภาค เช่น W1, W2">
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
                    { id: newRevenueItemId("kpi"), label: "", definition: "", unit: "", period: "", source: "", target: "", dataStatus: "draft", values: [], labels: [] } satisfies CmsKpi,
                  ],
                })
              }
            >
              เพิ่ม KPI
            </button>
            <div className="crm-cms-field-grid">
              <Field label="หัวข้อกราฟ">
                <input className="crm-field" value={content.chart.title} onChange={(e) => patchContent({ ...content, chart: { ...content.chart, title: e.target.value } })} />
              </Field>
              <Field label="คำบรรยายกราฟ">
                <input className="crm-field" value={content.chart.subtitle} onChange={(e) => patchContent({ ...content, chart: { ...content.chart, subtitle: e.target.value } })} />
              </Field>
              <Field label="ป้าย Sample data" hint="ต้องมีคำว่า Sample data หรือ ตัวอย่าง เมื่อใช้ข้อมูลตัวอย่าง">
                <input className="crm-field" value={content.chart.sampleLabel} onChange={(e) => patchContent({ ...content, chart: { ...content.chart, sampleLabel: e.target.value } })} />
              </Field>
              <Field label="ช่วงวัด">
                <input className="crm-field" value={content.chart.periodLabel} onChange={(e) => patchContent({ ...content, chart: { ...content.chart, periodLabel: e.target.value } })} />
              </Field>
            </div>
            <VisualFields slot="chart" fileName="chartImageFile" visual={content.chart.visual} hint="ถ้ามีรูป จะแทนกราฟ SVG · 1600×900 px" />
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
            <VisualFields slot="related" fileName="relatedImageFile" visual={content.related.visual} hint="รูปแสดงเฉพาะการ์ดแรก · 1200×800 px" />
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
                  <div className="crm-cms-field-grid">
                    <Field label="หมวด">
                      <input className="crm-field" value={item.category} onChange={(e) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((row, i) => (i === index ? { ...row, category: e.target.value } : row)) } })} />
                    </Field>
                    <Field label="ชื่อเรื่อง">
                      <input className="crm-field" value={item.title} onChange={(e) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((row, i) => (i === index ? { ...row, title: e.target.value } : row)) } })} />
                    </Field>
                    <Field label="ลิงก์">
                      <input className="crm-field" value={item.href} onChange={(e) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((row, i) => (i === index ? { ...row, href: e.target.value } : row)) } })} />
                    </Field>
                    <Field label="ปุ่ม">
                      <input className="crm-field" value={item.cta} onChange={(e) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((row, i) => (i === index ? { ...row, cta: e.target.value } : row)) } })} />
                    </Field>
                  </div>
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
                      { id: newRevenueItemId("card"), href: "/", category: "", title: "", description: "", meta: "", cta: "" } satisfies CmsRelatedCard,
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
              <textarea className="crm-area" rows={4} value={content.form.steps.join("\n")} onChange={(e) => patchContent({ ...content, form: { ...content.form, steps: e.target.value.split("\n").map((item) => item.trim()).filter(Boolean) } })} />
            </Field>
            <Field label="ข้อความความเชื่อถือ" hint="หนึ่งรายการต่อบรรทัด">
              <textarea className="crm-area" rows={4} value={content.form.trust.join("\n")} onChange={(e) => patchContent({ ...content, form: { ...content.form, trust: e.target.value.split("\n").map((item) => item.trim()).filter(Boolean) } })} />
            </Field>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "faq"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">FAQ</p>
                <h2>คำถามที่พบบ่อย</h2>
              </div>
              {saveBar}
            </header>
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
              onClick={() =>
                patchContent({
                  ...content,
                  faqs: [...content.faqs, { id: newRevenueItemId("faq"), q: "", a: "" }],
                })
              }
            >
              เพิ่มคำถาม
            </button>
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
              visual={content.seo?.social ?? { src: "", alt: "", status: "placeholder", label: "" }}
              hint="แนะนำ 1200×630 px JPG / PNG / WEBP ไม่เกิน 5MB · รูปที่เผยแพร่ต้องมี alt"
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
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby="revenue-unpublish-title">
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">CMS</p>
                <h2 id="revenue-unpublish-title">ยกเลิกเผยแพร่</h2>
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
