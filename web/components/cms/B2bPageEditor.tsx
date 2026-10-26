"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  B2B_KPI_STATUSES,
  B2B_VISUAL_STATUSES,
  b2bErrorMessage,
  newB2bItemId,
  type B2bEditorState,
  type B2bIntent,
  type B2bSaveResult,
  type B2bVisualStatus,
  type CmsB2bKpi,
  type CmsB2bPage,
  type CmsB2bVisual,
  type CmsRelatedCard,
} from "@/lib/cms/b2b-page";
import type { B2bKpiStatus } from "@/lib/b2b";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "readiness", label: "Readiness" },
  { id: "problems", label: "Problems" },
  { id: "scope", label: "Scope" },
  { id: "funnel", label: "Funnel" },
  { id: "workflow", label: "Workflow" },
  { id: "kpis", label: "KPIs" },
  { id: "related", label: "Related" },
  { id: "faq", label: "FAQ" },
  { id: "seo", label: "SEO" },
  { id: "publish", label: "Publish" },
] as const;

type Tab = (typeof TABS)[number]["id"];
type VisualSlot = "hero" | "readiness" | "workflow" | "kpis" | "social";

function isTab(value: string | undefined): value is Tab {
  return TABS.some((tab) => tab.id === value);
}

function formatStamp(value?: string) {
  if (!value) return "ยังไม่เคยบันทึก";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "ยังไม่เคยบันทึก";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(date);
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

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const next = index + direction;
  if (next < 0 || next >= items.length) return items;
  const copy = [...items];
  const [row] = copy.splice(index, 1);
  copy.splice(next, 0, row);
  return copy;
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

export function B2bPageEditor({
  initial,
  notice,
  error,
  saveAction,
  updatedAt,
  initialTab,
  previewHref,
  publicHref,
}: {
  initial: B2bEditorState;
  notice?: string;
  error?: string;
  saveAction: (formData: FormData) => Promise<B2bSaveResult>;
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
  const [content, setContent] = useState<CmsB2bPage>(initial.content);
  const [status, setStatus] = useState(error ? b2bErrorMessage(error) : "");
  const [ok, setOk] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<"unpublish" | null>(null);
  const [dirty, setDirty] = useState(false);
  const [previews, setPreviews] = useState<Record<VisualSlot, string>>({
    hero: initial.content.hero.visual.src,
    readiness: initial.content.readiness.visual.src,
    workflow: initial.content.workflowSection.visual.src,
    kpis: initial.content.measureSection.visual.src,
    social: initial.content.seo.social.src,
  });
  const [clears, setClears] = useState<Record<VisualSlot, boolean>>({
    hero: false,
    readiness: false,
    workflow: false,
    kpis: false,
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

  function patchContent(next: CmsB2bPage) {
    setContent(next);
    markDirty();
  }

  function patchHero<K extends keyof CmsB2bPage["hero"]>(key: K, value: CmsB2bPage["hero"][K]) {
    patchContent({ ...content, hero: { ...content.hero, [key]: value } });
  }

  function patchVisual(slot: VisualSlot, visual: CmsB2bVisual) {
    if (slot === "hero") patchHero("visual", visual);
    else if (slot === "readiness") patchContent({ ...content, readiness: { ...content.readiness, visual } });
    else if (slot === "workflow") patchContent({ ...content, workflowSection: { ...content.workflowSection, visual } });
    else if (slot === "kpis") patchContent({ ...content, measureSection: { ...content.measureSection, visual } });
    else patchContent({ ...content, seo: { ...content.seo, social: visual } });
  }

  function VisualFields({ slot, fileName, visual, hint }: { slot: VisualSlot; fileName: string; visual: CmsB2bVisual; hint: string }) {
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
        <Field label="สถานะรูป" hint="ใช้ Sample สำหรับแผนภาพจำลอง — ห้ามใช้รูปประชุมซ้ำเป็นหลักฐาน">
          <select
            className="crm-field"
            value={visual.status}
            onChange={(event) => patchVisual(slot, { ...visual, status: event.target.value as B2bVisualStatus })}
          >
            {B2B_VISUAL_STATUSES.map((item) => (
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

  function submit(intent: B2bIntent) {
    const node = formRef.current;
    if (!node) return;
    const data = new FormData(node);
    data.set("intent", intent);
    data.set("contentJson", JSON.stringify(content));
    if (clears.hero) data.set("clearHeroImage", "1");
    if (clears.readiness) data.set("clearReadinessImage", "1");
    if (clears.workflow) data.set("clearWorkflowImage", "1");
    if (clears.kpis) data.set("clearKpiImage", "1");
    if (clears.social) data.set("clearOgImage", "1");
    startTransition(async () => {
      setOk("");
      setStatus("");
      const result = await saveAction(data);
      if (!result.ok) {
        setStatus(b2bErrorMessage(result.error));
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
    const intent = (submitter?.value as B2bIntent) || "save";
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

  function patchKpi(index: number, next: Partial<CmsB2bKpi>) {
    patchContent({ ...content, kpis: content.kpis.map((row, i) => (i === index ? { ...row, ...next } : row)) });
  }

  return (
    <div className="crm-cs-editor-shell">
      <div className="crm-cs-tabs" role="tablist" aria-label="แก้ไขหน้า B2B Agent Sales">
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
          {dirty ? <p className="crm-users-alert is-warn" role="status">มีการแก้ไขที่ยังไม่บันทึก</p> : null}
          {pending ? <p className="crm-users-alert" role="status">กำลังบันทึก…</p> : null}
          {!pending && ok ? <p className="crm-users-alert is-ok" role="status">{ok}</p> : null}
          {!pending && status ? <p className="crm-users-alert is-warn" role="alert">{status}</p> : null}

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
            <Field label="ข้อความต่อ">
              <textarea className="crm-area" rows={3} value={content.hero.leadNext} onChange={(e) => patchHero("leadNext", e.target.value)} />
            </Field>
            <Field label="ข้อความปิด">
              <textarea className="crm-area" rows={3} value={content.hero.leadClose} onChange={(e) => patchHero("leadClose", e.target.value)} />
            </Field>
            <Field label="ปุ่มหลัก">
              <input className="crm-field" value={content.hero.primaryCta.label} onChange={(e) => patchHero("primaryCta", { ...content.hero.primaryCta, label: e.target.value })} />
            </Field>
            <Field label="ลิงก์ปุ่มหลัก">
              <input className="crm-field" value={content.hero.primaryCta.href} onChange={(e) => patchHero("primaryCta", { ...content.hero.primaryCta, href: e.target.value })} />
            </Field>
            <Field label="ปุ่มรอง">
              <input className="crm-field" value={content.hero.secondaryCta.label} onChange={(e) => patchHero("secondaryCta", { ...content.hero.secondaryCta, label: e.target.value })} />
            </Field>
            <Field label="ลิงก์ปุ่มรอง">
              <input className="crm-field" value={content.hero.secondaryCta.href} onChange={(e) => patchHero("secondaryCta", { ...content.hero.secondaryCta, href: e.target.value })} />
            </Field>
            <Field label="ข้อความใต้ปุ่ม">
              <textarea className="crm-area" rows={2} value={content.hero.underCta} onChange={(e) => patchHero("underCta", e.target.value)} />
            </Field>
            <Field label="คำบรรยายภาพ Hero">
              <input className="crm-field" value={content.hero.caption} onChange={(e) => patchHero("caption", e.target.value)} />
            </Field>
            <VisualFields slot="hero" fileName="heroImageFile" visual={content.hero.visual} hint="ถ้าไม่มีรูป หน้าสาธารณะจะใช้แผนภาพ Sample Pipeline" />
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "readiness"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">B2B Sales Readiness Framework</p>
                <h2>ตารางช่องว่างงานขาย</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อ">
              <input className="crm-field" value={content.readiness.title} onChange={(e) => patchContent({ ...content, readiness: { ...content.readiness, title: e.target.value } })} />
            </Field>
            <Field label="คำอธิบาย">
              <textarea className="crm-area" rows={4} value={content.readiness.body} onChange={(e) => patchContent({ ...content, readiness: { ...content.readiness, body: e.target.value } })} />
            </Field>
            <Field label="ข้อความปิด">
              <textarea className="crm-area" rows={3} value={content.readiness.close} onChange={(e) => patchContent({ ...content, readiness: { ...content.readiness, close: e.target.value } })} />
            </Field>
            {(content.readiness.items ?? []).map((item, index) => (
              <div key={item.id} className="crm-cs-metric">
                <div className="crm-cs-metric-head">
                  <h3>{item.area || `แถว ${index + 1}`}</h3>
                  <div className="crm-cs-sticky-actions">
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, readiness: { ...content.readiness, items: moveItem(content.readiness.items, index, -1) } })}>ขึ้น</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, readiness: { ...content.readiness, items: moveItem(content.readiness.items, index, 1) } })}>ลง</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, readiness: { ...content.readiness, items: content.readiness.items.filter((_, i) => i !== index) } })}>ลบ</button>
                  </div>
                </div>
                <Field label="พื้นที่งาน">
                  <input className="crm-field" value={item.area} onChange={(e) => patchContent({ ...content, readiness: { ...content.readiness, items: content.readiness.items.map((row, i) => (i === index ? { ...row, area: e.target.value } : row)) } })} />
                </Field>
                <Field label="สถานะปัจจุบัน / ปัญหา">
                  <textarea className="crm-area" rows={2} value={item.problem} onChange={(e) => patchContent({ ...content, readiness: { ...content.readiness, items: content.readiness.items.map((row, i) => (i === index ? { ...row, problem: e.target.value } : row)) } })} />
                </Field>
                <Field label="สิ่งที่ต้องเตรียม">
                  <textarea className="crm-area" rows={2} value={item.prepare} onChange={(e) => patchContent({ ...content, readiness: { ...content.readiness, items: content.readiness.items.map((row, i) => (i === index ? { ...row, prepare: e.target.value } : row)) } })} />
                </Field>
                <Field label="สิ่งที่ได้">
                  <input className="crm-field" value={item.output} onChange={(e) => patchContent({ ...content, readiness: { ...content.readiness, items: content.readiness.items.map((row, i) => (i === index ? { ...row, output: e.target.value } : row)) } })} />
                </Field>
              </div>
            ))}
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  readiness: {
                    ...content.readiness,
                    items: [...(content.readiness.items ?? []), { id: newB2bItemId("framework"), area: "", problem: "", prepare: "", output: "", order: (content.readiness.items ?? []).length + 1 }],
                  },
                })
              }
            >
              เพิ่มแถวในตาราง
            </button>
            <VisualFields slot="readiness" fileName="readinessImageFile" visual={content.readiness.visual} hint="กรอบ Framework 1600×900 (16:9) แสดงประมาณ 720×405 · อย่าใช้รูป Hero หรือรูปโรงแรมทั่วไป" />
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "problems"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Problems</p>
                <h2>รายการเดิม — ไม่แสดงบนหน้าสาธารณะ</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อ">
              <input className="crm-field" value={content.problemsSection.title} onChange={(e) => patchContent({ ...content, problemsSection: { title: e.target.value } })} />
            </Field>
            {content.problems.map((item, index) => (
              <div key={item.id} className="crm-cs-metric">
                <div className="crm-cs-metric-head">
                  <h3>ข้อ {index + 1}</h3>
                  <div className="crm-cs-sticky-actions">
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, problems: moveItem(content.problems, index, -1) })}>ขึ้น</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, problems: moveItem(content.problems, index, 1) })}>ลง</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, problems: content.problems.filter((_, i) => i !== index) })}>ลบ</button>
                  </div>
                </div>
                <textarea className="crm-area" rows={2} value={item.text} onChange={(e) => patchContent({ ...content, problems: content.problems.map((row, i) => (i === index ? { ...row, text: e.target.value } : row)) })} />
              </div>
            ))}
            <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, problems: [...content.problems, { id: newB2bItemId("problem"), text: "", order: content.problems.length + 1 }] })}>
              เพิ่มปัญหา
            </button>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "scope"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Service Scope</p>
                <h2>ขอบเขตงาน</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อ">
              <input className="crm-field" value={content.scopeSection.title} onChange={(e) => patchContent({ ...content, scopeSection: { title: e.target.value } })} />
            </Field>
            {content.scopeItems.map((item, index) => (
              <div key={item.id} className="crm-cs-metric">
                <div className="crm-cs-metric-head">
                  <h3>{item.kicker || `งาน ${index + 1}`}</h3>
                  <div className="crm-cs-sticky-actions">
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, scopeItems: moveItem(content.scopeItems, index, -1) })}>ขึ้น</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, scopeItems: moveItem(content.scopeItems, index, 1) })}>ลง</button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, scopeItems: content.scopeItems.filter((_, i) => i !== index) })}>ลบ</button>
                  </div>
                </div>
                <Field label="Kicker">
                  <input className="crm-field" value={item.kicker} onChange={(e) => patchContent({ ...content, scopeItems: content.scopeItems.map((row, i) => (i === index ? { ...row, kicker: e.target.value } : row)) })} />
                </Field>
                <Field label="หัวข้อ">
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
              </div>
            ))}
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  scopeItems: [...content.scopeItems, { id: newB2bItemId("scope"), kicker: "", title: "", description: "", input: "", output: "", order: content.scopeItems.length + 1 }],
                })
              }
            >
              เพิ่มขอบเขตงาน
            </button>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "funnel"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Funnel</p>
                <h2>ลำดับงานขาย</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อ">
              <input className="crm-field" value={content.funnelSection.title} onChange={(e) => patchContent({ ...content, funnelSection: { ...content.funnelSection, title: e.target.value } })} />
            </Field>
            <Field label="คำบรรยาย">
              <textarea className="crm-area" rows={2} value={content.funnelSection.caption} onChange={(e) => patchContent({ ...content, funnelSection: { ...content.funnelSection, caption: e.target.value } })} />
            </Field>
            {content.funnelSteps.map((step, index) => (
              <div key={step.id} className="crm-cs-metric">
                <Field label={`ขั้น ${index + 1}`}>
                  <input className="crm-field" value={step.label} onChange={(e) => patchContent({ ...content, funnelSteps: content.funnelSteps.map((row, i) => (i === index ? { ...row, label: e.target.value } : row)) })} />
                </Field>
              </div>
            ))}
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "workflow"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Workflow</p>
                <h2>วิธีทำงานกับโรงแรม</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อ">
              <input className="crm-field" value={content.workflowSection.title} onChange={(e) => patchContent({ ...content, workflowSection: { ...content.workflowSection, title: e.target.value } })} />
            </Field>
            {content.workflowSteps.map((step, index) => (
              <div key={step.id} className="crm-cs-metric">
                <Field label={`${step.number} ${step.phase}`}>
                  <input className="crm-field" value={step.title} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, title: e.target.value } : row)) })} />
                </Field>
                <textarea className="crm-area" rows={2} value={step.description} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, description: e.target.value } : row)) })} />
              </div>
            ))}
            <VisualFields slot="workflow" fileName="workflowImageFile" visual={content.workflowSection.visual} hint="แผนภาพลำดับงาน ไม่ใช่บอร์ด CRM สาธารณะ" />
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "kpis"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">KPIs</p>
                <h2>ตัวชี้วัด</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อ">
              <input className="crm-field" value={content.measureSection.title} onChange={(e) => patchContent({ ...content, measureSection: { ...content.measureSection, title: e.target.value } })} />
            </Field>
            <Field label="คำอธิบาย">
              <textarea className="crm-area" rows={3} value={content.measureSection.intro} onChange={(e) => patchContent({ ...content, measureSection: { ...content.measureSection, intro: e.target.value } })} />
            </Field>
            <Field label="ข้อความปิด">
              <textarea className="crm-area" rows={3} value={content.measureSection.close} onChange={(e) => patchContent({ ...content, measureSection: { ...content.measureSection, close: e.target.value } })} />
            </Field>
            <Field label="ป้ายข้อมูลตัวอย่าง" hint="ต้องมีคำว่า ตัวอย่างข้อมูล หรือ Sample">
              <input className="crm-field" value={content.measureSection.sampleLabel} onChange={(e) => patchContent({ ...content, measureSection: { ...content.measureSection, sampleLabel: e.target.value } })} />
            </Field>
            {content.kpis.map((kpi, index) => (
              <div key={kpi.id} className="crm-cs-metric">
                <div className="crm-cs-metric-head">
                  <h3>{kpi.name || `KPI ${index + 1}`}</h3>
                  <div className="crm-cs-sticky-actions">
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, kpis: content.kpis.filter((_, i) => i !== index) })}>ลบ</button>
                  </div>
                </div>
                <Field label="ชื่อ">
                  <input className="crm-field" value={kpi.name} onChange={(e) => patchKpi(index, { name: e.target.value })} />
                </Field>
                <Field label="คำนิยาม">
                  <textarea className="crm-area" rows={2} value={kpi.definition} onChange={(e) => patchKpi(index, { definition: e.target.value })} />
                </Field>
                <Field label="หน่วย">
                  <input className="crm-field" value={kpi.unit} onChange={(e) => patchKpi(index, { unit: e.target.value })} />
                </Field>
                <Field label="ช่วงเวลา">
                  <input className="crm-field" value={kpi.period} onChange={(e) => patchKpi(index, { period: e.target.value })} />
                </Field>
                <Field label="การเปรียบเทียบ / เป้าหมาย">
                  <input className="crm-field" value={kpi.target} onChange={(e) => patchKpi(index, { target: e.target.value })} />
                </Field>
                <Field label="สถานะข้อมูล">
                  <select className="crm-field" value={kpi.dataStatus} onChange={(e) => patchKpi(index, { dataStatus: e.target.value as B2bKpiStatus })}>
                    {B2B_KPI_STATUSES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="ค่าซีรีส์" hint="ตัวเลขคั่นด้วยจุลภาค สำหรับกราฟตัวอย่าง">
                  <input className="crm-field" value={kpi.values.join(", ")} onChange={(e) => patchKpi(index, { values: parseCsvNumbers(e.target.value) })} />
                </Field>
                <Field label="ป้ายแกน X">
                  <input className="crm-field" value={kpi.labels.join(", ")} onChange={(e) => patchKpi(index, { labels: parseCsv(e.target.value) })} />
                </Field>
                <label className="crm-cms-field">
                  <span>ซ่อนจนกว่าจะมีข้อมูล</span>
                  <input
                    type="checkbox"
                    checked={kpi.hideUntilData}
                    onChange={(e) => patchKpi(index, { hideUntilData: e.target.checked })}
                  />
                </label>
              </div>
            ))}
            <VisualFields slot="kpis" fileName="kpiImageFile" visual={content.measureSection.visual} hint="ถ้าไม่มีรูป หน้าสาธารณะจะใช้กราฟตัวอย่าง" />
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "related"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Related</p>
                <h2>เนื้อหาที่เกี่ยวข้อง</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อ">
              <input className="crm-field" value={content.related.title} onChange={(e) => patchContent({ ...content, related: { ...content.related, title: e.target.value } })} />
            </Field>
            {content.related.cards.map((card, index) => (
              <RelatedFields
                key={card.id}
                card={card}
                onChange={(next) =>
                  patchContent({
                    ...content,
                    related: { ...content.related, cards: content.related.cards.map((row, i) => (i === index ? next : row)) },
                  })
                }
              />
            ))}
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "faq"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">FAQ</p>
                <h2>คำถามที่พบบ่อย</h2>
              </div>
              {saveBar}
            </header>
            <Field label="คำนำ">
              <textarea className="crm-area" rows={2} value={content.faqIntro} onChange={(e) => patchContent({ ...content, faqIntro: e.target.value })} />
            </Field>
            {content.faqs.map((item, index) => (
              <div key={item.id} className="crm-cs-metric">
                <div className="crm-cs-metric-head">
                  <h3>FAQ {index + 1}</h3>
                  <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, faqs: content.faqs.filter((_, i) => i !== index) })}>
                    ลบ
                  </button>
                </div>
                <Field label="คำถาม">
                  <input className="crm-field" value={item.q} onChange={(e) => patchContent({ ...content, faqs: content.faqs.map((row, i) => (i === index ? { ...row, q: e.target.value } : row)) })} />
                </Field>
                <Field label="คำตอบ">
                  <textarea className="crm-area" rows={3} value={item.a} onChange={(e) => patchContent({ ...content, faqs: content.faqs.map((row, i) => (i === index ? { ...row, a: e.target.value } : row)) })} />
                </Field>
              </div>
            ))}
            <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, faqs: [...content.faqs, { id: newB2bItemId("faq"), q: "", a: "" }] })}>
              เพิ่มคำถาม
            </button>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "seo"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">SEO</p>
                <h2>ชื่อหน้าและเมตา</h2>
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
              <textarea className="crm-area" name="metaDescription" rows={3} value={meta.metaDescription} onChange={(e) => { setMeta((current) => ({ ...current, metaDescription: e.target.value })); markDirty(); }} />
            </Field>
            <Field label="Excerpt">
              <textarea className="crm-area" name="excerpt" rows={2} value={meta.excerpt} onChange={(e) => { setMeta((current) => ({ ...current, excerpt: e.target.value })); markDirty(); }} />
            </Field>
            <VisualFields slot="social" fileName="ogImageFile" visual={content.seo.social} hint="OG 1200×630" />
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "publish"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Publish</p>
                <h2>บันทึกและเผยแพร่</h2>
              </div>
              {saveBar}
            </header>
            <p className={`crm-cs-save-state${stateClass}`} role="status">{saveState || "พร้อมบันทึก"}</p>
            {published ? (
              <button className="crm-users-secondary" type="submit" name="intent" value="unpublish" disabled={pending}>ยกเลิกเผยแพร่</button>
            ) : (
              <button className="kpi-button" type="submit" name="intent" value="publish" disabled={pending}>เผยแพร่</button>
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
            <p className={`crm-cs-save-state${stateClass}`} role="status">{saveState || "พร้อมบันทึก"}</p>
            <button className="kpi-button crm-cms-editor-save" type="submit" name="intent" value="save" disabled={pending}>บันทึก</button>
            <button className="crm-users-secondary crm-cms-editor-save" type="submit" name="intent" value="draft" disabled={pending}>บันทึกฉบับร่าง</button>
            <button className="crm-users-secondary crm-cms-editor-save" type="submit" name="intent" value="preview" disabled={pending}>บันทึกแล้วดูตัวอย่าง</button>
            {published ? (
              <button className="crm-users-secondary crm-cms-editor-save" type="submit" name="intent" value="unpublish" disabled={pending}>ยกเลิกเผยแพร่</button>
            ) : (
              <button className="kpi-button crm-cms-editor-save" type="submit" name="intent" value="publish" disabled={pending}>เผยแพร่</button>
            )}
          </section>
        </aside>

        <div className="crm-cs-sticky-save">
          <p className={`crm-cs-save-state${stateClass}`} role="status">{saveState || "พร้อมบันทึก"}</p>
          <div className="crm-cs-sticky-actions">{saveButtons}</div>
        </div>
      </form>

      {dialog === "unpublish" ? (
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" onClick={() => setDialog(null)} />
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby="b2b-unpublish-title">
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">CMS</p>
                <h2 id="b2b-unpublish-title">ยกเลิกเผยแพร่</h2>
              </div>
              <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={() => setDialog(null)}>×</button>
            </div>
            <p className="crm-users-alert is-warn" role="status">หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ด จนกว่าจะเผยแพร่อีกครั้ง</p>
            <div className="crm-modal-actions">
              <button type="button" className="crm-users-secondary" onClick={() => setDialog(null)}>ยกเลิก</button>
              <button type="button" className="kpi-button" onClick={() => { setDialog(null); submit("unpublish"); }}>ยกเลิกเผยแพร่</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RelatedFields({ card, onChange }: { card: CmsRelatedCard; onChange: (card: CmsRelatedCard) => void }) {
  return (
    <div className="crm-cs-metric">
      <Field label="หัวข้อ">
        <input className="crm-field" value={card.title} onChange={(e) => onChange({ ...card, title: e.target.value })} />
      </Field>
      <Field label="ลิงก์">
        <input className="crm-field" value={card.href} onChange={(e) => onChange({ ...card, href: e.target.value })} />
      </Field>
      <Field label="คำอธิบาย">
        <textarea className="crm-area" rows={2} value={card.description} onChange={(e) => onChange({ ...card, description: e.target.value })} />
      </Field>
    </div>
  );
}
