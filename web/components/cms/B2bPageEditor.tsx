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
  type CmsB2bCheckItem,
  type CmsB2bCriterion,
  type CmsB2bGuides,
  type CmsB2bKpi,
  type CmsB2bPage,
  type CmsB2bVisual,
  type CmsRelatedCard,
} from "@/lib/cms/b2b-page";
import type { B2bFunnelMarker, B2bKpiStatus } from "@/lib/b2b";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "readiness", label: "Readiness" },
  { id: "guides", label: "Guides" },
  { id: "problems", label: "Problems" },
  { id: "scope", label: "Scope" },
  { id: "funnel", label: "Funnel" },
  { id: "workflow", label: "Workflow" },
  { id: "kpis", label: "KPIs" },
  { id: "related", label: "Related" },
  { id: "form", label: "Form" },
  { id: "faq", label: "FAQ" },
  { id: "seo", label: "SEO" },
  { id: "publish", label: "Publish" },
] as const;

const FUNNEL_MARKERS: B2bFunnelMarker[] = ["path", "target", "review", "risk"];

type Tab = (typeof TABS)[number]["id"];
type VisualSlot = "hero" | "readiness" | "funnel" | "workflow" | "kpis" | "related" | "team" | "social";

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

function withOrder<T extends { order: number }>(items: T[]) {
  return items.map((item, index) => ({ ...item, order: index + 1 }));
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
  const [content, setContent] = useState<CmsB2bPage>({
    ...initial.content,
    guides: initial.content.guides ?? {
      readinessTitle: "",
      readinessChecks: [],
      partnerFitTitle: "",
      partnerFit: [],
      salesMaterialTitle: "",
      salesMaterial: [],
      rateCommissionTitle: "",
      rateCommissionBody: "",
    },
  });
  const [status, setStatus] = useState(error ? b2bErrorMessage(error) : "");
  const [ok, setOk] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<"unpublish" | null>(null);
  const [dirty, setDirty] = useState(false);
  const [previews, setPreviews] = useState<Record<VisualSlot, string>>({
    hero: initial.content.hero.visual.src,
    readiness: initial.content.readiness.visual.src,
    funnel: initial.content.funnelSection.visual.src,
    workflow: initial.content.workflowSection.visual.src,
    kpis: initial.content.measureSection.visual.src,
    related: initial.content.related.visual?.src ?? "",
    team: initial.content.form.visual?.src ?? "",
    social: initial.content.seo.social.src,
  });
  const [clears, setClears] = useState<Record<VisualSlot, boolean>>({
    hero: false,
    readiness: false,
    funnel: false,
    workflow: false,
    kpis: false,
    related: false,
    team: false,
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
    else if (slot === "funnel") patchContent({ ...content, funnelSection: { ...content.funnelSection, visual } });
    else if (slot === "workflow") patchContent({ ...content, workflowSection: { ...content.workflowSection, visual } });
    else if (slot === "kpis") patchContent({ ...content, measureSection: { ...content.measureSection, visual } });
    else if (slot === "related") patchContent({ ...content, related: { ...content.related, visual } });
    else if (slot === "team") patchContent({ ...content, form: { ...content.form, visual } });
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
    if (clears.funnel) data.set("clearFunnelImage", "1");
    if (clears.workflow) data.set("clearWorkflowImage", "1");
    if (clears.kpis) data.set("clearKpiImage", "1");
    if (clears.related) data.set("clearRelatedImage", "1");
    if (clears.team) data.set("clearTeamImage", "1");
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

  function patchGuides(next: Partial<CmsB2bGuides>) {
    patchContent({ ...content, guides: { ...content.guides, ...next } });
  }

  function patchChecks(items: CmsB2bCheckItem[]) {
    patchGuides({ readinessChecks: withOrder(items) });
  }

  function patchPartnerFit(items: CmsB2bCriterion[]) {
    patchGuides({ partnerFit: withOrder(items) });
  }

  function patchSalesMaterial(items: CmsB2bCriterion[]) {
    patchGuides({ salesMaterial: withOrder(items) });
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
                <ListBar
                  title={item.area || `แถว ${index + 1}`}
                  disableUp={index === 0}
                  disableDown={index === content.readiness.items.length - 1}
                  onUp={() =>
                    patchContent({
                      ...content,
                      readiness: { ...content.readiness, items: withOrder(moveItem(content.readiness.items, index, -1)) },
                    })
                  }
                  onDown={() =>
                    patchContent({
                      ...content,
                      readiness: { ...content.readiness, items: withOrder(moveItem(content.readiness.items, index, 1)) },
                    })
                  }
                  onRemove={() =>
                    patchContent({
                      ...content,
                      readiness: {
                        ...content.readiness,
                        items: withOrder(content.readiness.items.filter((_, i) => i !== index)),
                      },
                    })
                  }
                />
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
            <VisualFields slot="readiness" fileName="readinessImageFile" visual={content.readiness.visual} hint="Dummy 1200 × 800 px, แสดงประมาณ 480 × 320 px, อัตราส่วน 3:2 — Sales Kit / Rate Sheet / Partner Profile / Partner Map ห้ามใช้รูป Hero หรือรูปโรงแรมทั่วไป" />
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "guides"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Guides</p>
                <h2>รายการตรวจ Partner Fit และเอกสารขาย</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อรายการตรวจความพร้อม B2B">
              <input className="crm-field" value={content.guides.readinessTitle} onChange={(e) => patchGuides({ readinessTitle: e.target.value })} />
            </Field>
            {content.guides.readinessChecks.map((item, index) => (
              <div key={item.id} className="crm-cs-metric">
                <ListBar
                  title={item.check || `ข้อตรวจ ${index + 1}`}
                  disableUp={index === 0}
                  disableDown={index === content.guides.readinessChecks.length - 1}
                  onUp={() => patchChecks(moveItem(content.guides.readinessChecks, index, -1))}
                  onDown={() => patchChecks(moveItem(content.guides.readinessChecks, index, 1))}
                  onRemove={() => patchChecks(content.guides.readinessChecks.filter((_, i) => i !== index))}
                />
                <Field label="สิ่งที่ต้องมี">
                  <input className="crm-field" value={item.check} onChange={(e) => patchChecks(content.guides.readinessChecks.map((row, i) => (i === index ? { ...row, check: e.target.value } : row)))} />
                </Field>
                <Field label="เหตุผล">
                  <textarea className="crm-area" rows={2} value={item.why} onChange={(e) => patchChecks(content.guides.readinessChecks.map((row, i) => (i === index ? { ...row, why: e.target.value } : row)))} />
                </Field>
                <Field label="สิ่งที่ได้">
                  <input className="crm-field" value={item.output} onChange={(e) => patchChecks(content.guides.readinessChecks.map((row, i) => (i === index ? { ...row, output: e.target.value } : row)))} />
                </Field>
              </div>
            ))}
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchChecks([
                  ...content.guides.readinessChecks,
                  { id: newB2bItemId("check"), check: "", why: "", output: "", order: content.guides.readinessChecks.length + 1 },
                ])
              }
            >
              เพิ่มข้อตรวจความพร้อม
            </button>
            <Field label="หัวข้อเกณฑ์ Partner Fit">
              <input className="crm-field" value={content.guides.partnerFitTitle} onChange={(e) => patchGuides({ partnerFitTitle: e.target.value })} />
            </Field>
            {content.guides.partnerFit.map((item, index) => (
              <div key={item.id} className="crm-cs-metric">
                <ListBar
                  title={item.text || `เกณฑ์ ${index + 1}`}
                  disableUp={index === 0}
                  disableDown={index === content.guides.partnerFit.length - 1}
                  onUp={() => patchPartnerFit(moveItem(content.guides.partnerFit, index, -1))}
                  onDown={() => patchPartnerFit(moveItem(content.guides.partnerFit, index, 1))}
                  onRemove={() => patchPartnerFit(content.guides.partnerFit.filter((_, i) => i !== index))}
                />
                <Field label="เกณฑ์">
                  <input className="crm-field" value={item.text} onChange={(e) => patchPartnerFit(content.guides.partnerFit.map((row, i) => (i === index ? { ...row, text: e.target.value } : row)))} />
                </Field>
              </div>
            ))}
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() => patchPartnerFit([...content.guides.partnerFit, { id: newB2bItemId("fit"), text: "", order: content.guides.partnerFit.length + 1 }])}
            >
              เพิ่มเกณฑ์ Partner Fit
            </button>
            <Field label="หัวข้อชุดเอกสารขาย">
              <input className="crm-field" value={content.guides.salesMaterialTitle} onChange={(e) => patchGuides({ salesMaterialTitle: e.target.value })} />
            </Field>
            {content.guides.salesMaterial.map((item, index) => (
              <div key={item.id} className="crm-cs-metric">
                <ListBar
                  title={item.text || `เอกสาร ${index + 1}`}
                  disableUp={index === 0}
                  disableDown={index === content.guides.salesMaterial.length - 1}
                  onUp={() => patchSalesMaterial(moveItem(content.guides.salesMaterial, index, -1))}
                  onDown={() => patchSalesMaterial(moveItem(content.guides.salesMaterial, index, 1))}
                  onRemove={() => patchSalesMaterial(content.guides.salesMaterial.filter((_, i) => i !== index))}
                />
                <Field label="รายการ">
                  <input className="crm-field" value={item.text} onChange={(e) => patchSalesMaterial(content.guides.salesMaterial.map((row, i) => (i === index ? { ...row, text: e.target.value } : row)))} />
                </Field>
              </div>
            ))}
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchSalesMaterial([
                  ...content.guides.salesMaterial,
                  { id: newB2bItemId("sales"), text: "", order: content.guides.salesMaterial.length + 1 },
                ])
              }
            >
              เพิ่มรายการเอกสารขาย
            </button>
            <Field label="หัวข้อขอบเขตราคาและค่าคอมมิชชัน">
              <input className="crm-field" value={content.guides.rateCommissionTitle} onChange={(e) => patchGuides({ rateCommissionTitle: e.target.value })} />
            </Field>
            <Field label="ข้อความขอบเขตราคาและค่าคอมมิชชัน" hint="ห้ามใส่ตัวเลขสัญญาหรืออัตราคอมมิชชันจนกว่าจะได้รับอนุมัติ">
              <textarea className="crm-area" rows={4} value={content.guides.rateCommissionBody} onChange={(e) => patchGuides({ rateCommissionBody: e.target.value })} />
            </Field>
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
                <ListBar
                  title={`ข้อ ${index + 1}`}
                  disableUp={index === 0}
                  disableDown={index === content.problems.length - 1}
                  onUp={() => patchContent({ ...content, problems: withOrder(moveItem(content.problems, index, -1)) })}
                  onDown={() => patchContent({ ...content, problems: withOrder(moveItem(content.problems, index, 1)) })}
                  onRemove={() => patchContent({ ...content, problems: withOrder(content.problems.filter((_, i) => i !== index)) })}
                />
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
                <p className="crm-cms-editor-kicker">Service Matrix</p>
                <h2>เราช่วยอะไร</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อ">
              <input className="crm-field" value={content.scopeSection.title} onChange={(e) => patchContent({ ...content, scopeSection: { title: e.target.value } })} />
            </Field>
            {content.scopeItems.map((item, index) => (
              <div key={item.id} className="crm-cs-metric">
                <ListBar
                  title={item.area || `งาน ${index + 1}`}
                  disableUp={index === 0}
                  disableDown={index === content.scopeItems.length - 1}
                  onUp={() => patchContent({ ...content, scopeItems: withOrder(moveItem(content.scopeItems, index, -1)) })}
                  onDown={() => patchContent({ ...content, scopeItems: withOrder(moveItem(content.scopeItems, index, 1)) })}
                  onRemove={() => patchContent({ ...content, scopeItems: withOrder(content.scopeItems.filter((_, i) => i !== index)) })}
                />
                <Field label="พื้นที่งาน">
                  <input className="crm-field" value={item.area} onChange={(e) => patchContent({ ...content, scopeItems: content.scopeItems.map((row, i) => (i === index ? { ...row, area: e.target.value } : row)) })} />
                </Field>
                <Field label="สิ่งที่เราทำ">
                  <textarea className="crm-area" rows={3} value={item.action} onChange={(e) => patchContent({ ...content, scopeItems: content.scopeItems.map((row, i) => (i === index ? { ...row, action: e.target.value } : row)) })} />
                </Field>
                <Field label="Input">
                  <input className="crm-field" value={item.input} onChange={(e) => patchContent({ ...content, scopeItems: content.scopeItems.map((row, i) => (i === index ? { ...row, input: e.target.value } : row)) })} />
                </Field>
                <Field label="Output">
                  <input className="crm-field" value={item.output} onChange={(e) => patchContent({ ...content, scopeItems: content.scopeItems.map((row, i) => (i === index ? { ...row, output: e.target.value } : row)) })} />
                </Field>
                <Field label="ผู้รับผิดชอบหรือจุดอนุมัติ">
                  <input
                    className="crm-field"
                    value={item.owner}
                    onChange={(e) =>
                      patchContent({
                        ...content,
                        scopeItems: content.scopeItems.map((row, i) =>
                          i === index
                            ? {
                                ...row,
                                owner: e.target.value,
                                ownerKind: /อนุมัติ|approves|approval/i.test(e.target.value) ? "hotel" : "shared",
                              }
                            : row,
                        ),
                      })
                    }
                  />
                </Field>
                <Field label="ลิงก์หน้าที่เกี่ยวข้อง">
                  <input className="crm-field" value={item.href} onChange={(e) => patchContent({ ...content, scopeItems: content.scopeItems.map((row, i) => (i === index ? { ...row, href: e.target.value } : row)) })} />
                </Field>
                <Field label="ข้อความลิงก์">
                  <input className="crm-field" value={item.linkLabel} onChange={(e) => patchContent({ ...content, scopeItems: content.scopeItems.map((row, i) => (i === index ? { ...row, linkLabel: e.target.value } : row)) })} />
                </Field>
              </div>
            ))}
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  scopeItems: [
                    ...content.scopeItems,
                    {
                      id: newB2bItemId("scope"),
                      area: "",
                      action: "",
                      input: "",
                      output: "",
                      owner: "",
                      ownerKind: "shared",
                      href: "",
                      linkLabel: "",
                      order: content.scopeItems.length + 1,
                    },
                  ],
                })
              }
            >
              เพิ่มแถวใน Service Matrix
            </button>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "funnel"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Agent Sales Funnel</p>
                <h2>ลำดับงานขายผ่านเอเจนต์</h2>
              </div>
              {saveBar}
            </header>
            <Field label="หัวข้อ">
              <input className="crm-field" value={content.funnelSection.title} onChange={(e) => patchContent({ ...content, funnelSection: { ...content.funnelSection, title: e.target.value } })} />
            </Field>
            <Field label="คำอธิบายลำดับงาน">
              <textarea className="crm-area" rows={2} value={content.funnelSection.lead} onChange={(e) => patchContent({ ...content, funnelSection: { ...content.funnelSection, lead: e.target.value } })} />
            </Field>
            <Field label="คำบรรยายภาพ">
              <textarea className="crm-area" rows={2} value={content.funnelSection.caption} onChange={(e) => patchContent({ ...content, funnelSection: { ...content.funnelSection, caption: e.target.value } })} />
            </Field>
            {content.funnelSteps.map((step, index) => (
              <div key={step.id} className="crm-cs-metric">
                <ListBar
                  title={step.label || `ขั้น ${step.number || index + 1}`}
                  disableUp={index === 0}
                  disableDown={index === content.funnelSteps.length - 1}
                  onUp={() => patchContent({ ...content, funnelSteps: moveItem(content.funnelSteps, index, -1) })}
                  onDown={() => patchContent({ ...content, funnelSteps: moveItem(content.funnelSteps, index, 1) })}
                  onRemove={() => patchContent({ ...content, funnelSteps: content.funnelSteps.filter((_, i) => i !== index) })}
                />
                <Field label="เลขขั้น">
                  <input className="crm-field" value={step.number} onChange={(e) => patchContent({ ...content, funnelSteps: content.funnelSteps.map((row, i) => (i === index ? { ...row, number: e.target.value } : row)) })} />
                </Field>
                <Field label="ชื่อขั้น">
                  <input className="crm-field" value={step.label} onChange={(e) => patchContent({ ...content, funnelSteps: content.funnelSteps.map((row, i) => (i === index ? { ...row, label: e.target.value } : row)) })} />
                </Field>
                <Field label="เครื่องหมาย">
                  <select
                    className="crm-field"
                    value={step.marker}
                    onChange={(e) =>
                      patchContent({
                        ...content,
                        funnelSteps: content.funnelSteps.map((row, i) => (i === index ? { ...row, marker: e.target.value as B2bFunnelMarker } : row)),
                      })
                    }
                  >
                    {FUNNEL_MARKERS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="ความหมาย">
                  <textarea className="crm-area" rows={2} value={step.definition} onChange={(e) => patchContent({ ...content, funnelSteps: content.funnelSteps.map((row, i) => (i === index ? { ...row, definition: e.target.value } : row)) })} />
                </Field>
                <Field label="สิ่งที่ได้">
                  <input className="crm-field" value={step.output} onChange={(e) => patchContent({ ...content, funnelSteps: content.funnelSteps.map((row, i) => (i === index ? { ...row, output: e.target.value } : row)) })} />
                </Field>
                <Field label="ตัวชี้วัด (แสดงตัวเลขเมื่อสถานะ Approved หรือ Anonymised)" hint="รหัสต้องตรงกับ KPI ในแท็บ KPIs เช่น partner-leads, qualified-rate, active-count, booking-conversion, room-nights, revenue-by-partner">
                  <input className="crm-field" value={step.kpiName} onChange={(e) => patchContent({ ...content, funnelSteps: content.funnelSteps.map((row, i) => (i === index ? { ...row, kpiName: e.target.value } : row)) })} />
                </Field>
                <Field label="รหัสตัวชี้วัด">
                  <input className="crm-field" value={step.kpiId} onChange={(e) => patchContent({ ...content, funnelSteps: content.funnelSteps.map((row, i) => (i === index ? { ...row, kpiId: e.target.value } : row)) })} />
                </Field>
                {(step.extraKpis ?? []).map((kpi, kpiIndex) => (
                  <div key={`${step.id}-extra-${kpi.id || kpiIndex}`} className="crm-cs-metric">
                    <ListBar
                      title={kpi.name || `ตัวชี้วัดเพิ่มเติม ${kpiIndex + 1}`}
                      disableUp={kpiIndex === 0}
                      disableDown={kpiIndex === (step.extraKpis ?? []).length - 1}
                      onUp={() =>
                        patchContent({
                          ...content,
                          funnelSteps: content.funnelSteps.map((row, i) =>
                            i === index ? { ...row, extraKpis: moveItem(row.extraKpis ?? [], kpiIndex, -1) } : row,
                          ),
                        })
                      }
                      onDown={() =>
                        patchContent({
                          ...content,
                          funnelSteps: content.funnelSteps.map((row, i) =>
                            i === index ? { ...row, extraKpis: moveItem(row.extraKpis ?? [], kpiIndex, 1) } : row,
                          ),
                        })
                      }
                      onRemove={() =>
                        patchContent({
                          ...content,
                          funnelSteps: content.funnelSteps.map((row, i) =>
                            i === index ? { ...row, extraKpis: (row.extraKpis ?? []).filter((_, j) => j !== kpiIndex) } : row,
                          ),
                        })
                      }
                    />
                    <Field label="ชื่อตัวชี้วัดเพิ่มเติม">
                      <input
                        className="crm-field"
                        value={kpi.name}
                        onChange={(e) =>
                          patchContent({
                            ...content,
                            funnelSteps: content.funnelSteps.map((row, i) =>
                              i === index
                                ? {
                                    ...row,
                                    extraKpis: (row.extraKpis ?? []).map((item, j) =>
                                      j === kpiIndex ? { ...item, name: e.target.value } : item,
                                    ),
                                  }
                                : row,
                            ),
                          })
                        }
                      />
                    </Field>
                    <Field label="รหัสตัวชี้วัดเพิ่มเติม">
                      <input
                        className="crm-field"
                        value={kpi.id}
                        onChange={(e) =>
                          patchContent({
                            ...content,
                            funnelSteps: content.funnelSteps.map((row, i) =>
                              i === index
                                ? {
                                    ...row,
                                    extraKpis: (row.extraKpis ?? []).map((item, j) =>
                                      j === kpiIndex ? { ...item, id: e.target.value } : item,
                                    ),
                                  }
                                : row,
                            ),
                          })
                        }
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
                      funnelSteps: content.funnelSteps.map((row, i) =>
                        i === index
                          ? { ...row, extraKpis: [...(row.extraKpis ?? []), { id: newB2bItemId("fkpi"), name: "" }] }
                          : row,
                      ),
                    })
                  }
                >
                  เพิ่มตัวชี้วัดของขั้นนี้
                </button>
              </div>
            ))}
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  funnelSteps: [
                    ...content.funnelSteps,
                    {
                      id: newB2bItemId("funnel"),
                      number: String(content.funnelSteps.length + 1).padStart(2, "0"),
                      marker: "path",
                      label: "",
                      definition: "",
                      output: "",
                      kpiId: "",
                      kpiName: "",
                      extraKpis: [],
                    },
                  ],
                })
              }
            >
              เพิ่มขั้นใน Funnel
            </button>
            <VisualFields slot="funnel" fileName="funnelImageFile" visual={content.funnelSection.visual} hint="Dummy 1600 × 900 px, แสดงประมาณ 720 × 405 px, อัตราส่วน 16:9 — ป้าย B2B Agent Sales Funnel · Sample data" />
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
            <Field label="คำอธิบายลำดับงาน">
              <textarea className="crm-area" rows={2} value={content.workflowSection.lead} onChange={(e) => patchContent({ ...content, workflowSection: { ...content.workflowSection, lead: e.target.value } })} />
            </Field>
            {content.workflowSteps.map((step, index) => (
              <div key={step.id} className="crm-cs-metric">
                <ListBar
                  title={step.title || `ขั้น ${step.number || index + 1}`}
                  disableUp={index === 0}
                  disableDown={index === content.workflowSteps.length - 1}
                  onUp={() => patchContent({ ...content, workflowSteps: withOrder(moveItem(content.workflowSteps, index, -1)) })}
                  onDown={() => patchContent({ ...content, workflowSteps: withOrder(moveItem(content.workflowSteps, index, 1)) })}
                  onRemove={() => patchContent({ ...content, workflowSteps: withOrder(content.workflowSteps.filter((_, i) => i !== index)) })}
                />
                <Field label="เลขขั้น">
                  <input className="crm-field" value={step.number} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, number: e.target.value } : row)) })} />
                </Field>
                <Field label="ชื่อขั้น">
                  <input className="crm-field" value={step.title} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, title: e.target.value } : row)) })} />
                </Field>
                <Field label="ผู้รับผิดชอบ">
                  <input className="crm-field" value={step.owner} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, owner: e.target.value } : row)) })} />
                </Field>
                <Field label="Input">
                  <input className="crm-field" value={step.input} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, input: e.target.value } : row)) })} />
                </Field>
                <Field label="สิ่งที่ทำ">
                  <textarea className="crm-area" rows={2} value={step.action} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, action: e.target.value } : row)) })} />
                </Field>
                <Field label="สิ่งที่ได้">
                  <input className="crm-field" value={step.output} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, output: e.target.value } : row)) })} />
                </Field>
                <Field label="เมื่อต้องส่งต่อ">
                  <textarea className="crm-area" rows={2} value={step.escalation} onChange={(e) => patchContent({ ...content, workflowSteps: content.workflowSteps.map((row, i) => (i === index ? { ...row, escalation: e.target.value } : row)) })} />
                </Field>
              </div>
            ))}
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  workflowSteps: [
                    ...content.workflowSteps,
                    {
                      id: newB2bItemId("workflow"),
                      number: String(content.workflowSteps.length + 1).padStart(2, "0"),
                      title: "",
                      owner: "",
                      input: "",
                      action: "",
                      output: "",
                      escalation: "",
                      order: content.workflowSteps.length + 1,
                    },
                  ],
                })
              }
            >
              เพิ่มขั้นใน Workflow
            </button>
            <Field label="หัวข้อเส้นแบ่งความรับผิดชอบ">
              <input className="crm-field" value={content.workflowSection.boundary.kicker} onChange={(e) => patchContent({ ...content, workflowSection: { ...content.workflowSection, boundary: { ...content.workflowSection.boundary, kicker: e.target.value } } })} />
            </Field>
            <Field label="เส้นแบ่งความรับผิดชอบ — หมายเหตุ">
              <textarea className="crm-area" rows={2} value={content.workflowSection.boundary.note} onChange={(e) => patchContent({ ...content, workflowSection: { ...content.workflowSection, boundary: { ...content.workflowSection.boundary, note: e.target.value } } })} />
            </Field>
            <Field label="หัวข้องานที่เดอะ เคพีไอ พลัส อาจช่วย">
              <input
                className="crm-field"
                value={content.workflowSection.boundary.supportTitle}
                onChange={(e) =>
                  patchContent({
                    ...content,
                    workflowSection: {
                      ...content.workflowSection,
                      boundary: { ...content.workflowSection.boundary, supportTitle: e.target.value },
                    },
                  })
                }
              />
            </Field>
            <Field label="เดอะ เคพีไอ พลัส อาจช่วย" hint="บรรทัดละหนึ่งรายการ">
              <textarea
                className="crm-area"
                rows={5}
                value={content.workflowSection.boundary.support.join("\n")}
                onChange={(e) =>
                  patchContent({
                    ...content,
                    workflowSection: {
                      ...content.workflowSection,
                      boundary: { ...content.workflowSection.boundary, support: e.target.value.split("\n").map((item) => item.trim()).filter(Boolean) },
                    },
                  })
                }
              />
            </Field>
            <Field label="หัวข้องานที่โรงแรมอาจอนุมัติ">
              <input
                className="crm-field"
                value={content.workflowSection.boundary.approveTitle}
                onChange={(e) =>
                  patchContent({
                    ...content,
                    workflowSection: {
                      ...content.workflowSection,
                      boundary: { ...content.workflowSection.boundary, approveTitle: e.target.value },
                    },
                  })
                }
              />
            </Field>
            <Field label="โรงแรมอาจอนุมัติ" hint="บรรทัดละหนึ่งรายการ">
              <textarea
                className="crm-area"
                rows={5}
                value={content.workflowSection.boundary.approve.join("\n")}
                onChange={(e) =>
                  patchContent({
                    ...content,
                    workflowSection: {
                      ...content.workflowSection,
                      boundary: { ...content.workflowSection.boundary, approve: e.target.value.split("\n").map((item) => item.trim()).filter(Boolean) },
                    },
                  })
                }
              />
            </Field>
            <VisualFields slot="workflow" fileName="workflowImageFile" visual={content.workflowSection.visual} hint="Dummy 1600 × 900 px, แสดงประมาณ 640 × 360 px, อัตราส่วน 16:9 — ป้าย B2B Partner Sales Workflow — Sample process ไม่ใช้รูปประชุมทั่วไป" />
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
            <Field label="ป้ายข้อมูลตัวอย่าง" hint="ใช้กับกรอบ Dummy 16:9 เมื่อยังไม่มีซีรีส์ที่อนุมัติ">
              <input className="crm-field" value={content.measureSection.sampleLabel} onChange={(e) => patchContent({ ...content, measureSection: { ...content.measureSection, sampleLabel: e.target.value } })} />
            </Field>
            <p className="crm-cms-hint">หน้าสาธารณะแสดงเฉพาะ KPI สถานะ Approved หรือ Anonymised ที่มีค่าจริง ห้ามใส่จำนวนพาร์ตเนอร์ อัตราแปลง คืนห้องพัก หรือรายได้ที่ไม่ได้มาจากข้อมูลที่อนุมัติ</p>
            {content.kpis.map((kpi, index) => (
              <div key={kpi.id} className="crm-cs-metric">
                <ListBar
                  title={kpi.name || `KPI ${index + 1}`}
                  disableUp={index === 0}
                  disableDown={index === content.kpis.length - 1}
                  onUp={() => patchContent({ ...content, kpis: moveItem(content.kpis, index, -1) })}
                  onDown={() => patchContent({ ...content, kpis: moveItem(content.kpis, index, 1) })}
                  onRemove={() => patchContent({ ...content, kpis: content.kpis.filter((_, i) => i !== index) })}
                />
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
                <Field label="เป้าหมายหรือเปรียบเทียบ">
                  <input className="crm-field" value={kpi.target} onChange={(e) => patchKpi(index, { target: e.target.value })} />
                </Field>
                <Field label="ค่าที่แสดง" hint="ตัวเลขหรือข้อความที่อนุมัติแล้วเท่านั้น">
                  <input className="crm-field" value={kpi.value} onChange={(e) => patchKpi(index, { value: e.target.value })} />
                </Field>
                <Field label="วันที่อัปเดต" hint="เช่น 2026-10-01">
                  <input className="crm-field" value={kpi.updatedAt} onChange={(e) => patchKpi(index, { updatedAt: e.target.value })} />
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
                <Field label="ค่าซีรีส์" hint="ตัวเลขคั่นด้วยจุลภาค สำหรับกราฟ SVG เมื่อสถานะ Approved หรือ Anonymised">
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
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  kpis: [
                    ...content.kpis,
                    {
                      id: newB2bItemId("kpi"),
                      name: "",
                      definition: "",
                      unit: "",
                      period: "",
                      target: "",
                      value: "",
                      dataStatus: "sample",
                      values: [],
                      labels: [],
                      updatedAt: "",
                      hideUntilData: true,
                    },
                  ],
                })
              }
            >
              เพิ่ม KPI
            </button>
            <VisualFields slot="kpis" fileName="kpiImageFile" visual={content.measureSection.visual} hint="Dummy 1600 × 900 px, แสดงประมาณ 720 × 405 px, อัตราส่วน 16:9 — ป้าย B2B Agent Sales KPI · Sample data ไม่ใช้รูป AI สำหรับตัวเลขจริง" />
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
            <VisualFields slot="related" fileName="relatedImageFile" visual={content.related.visual} hint="Dummy 1200 × 800 px, แสดงประมาณ 520 × 347 px, อัตราส่วน 3:2 — ป้าย B2B Sales / Partner Content ห้ามใช้รูป Hero หรือ Readiness" />
            {content.related.cards.map((card, index) => (
              <RelatedFields
                key={card.id}
                card={card}
                index={index}
                total={content.related.cards.length}
                onMove={(direction) =>
                  patchContent({
                    ...content,
                    related: { ...content.related, cards: moveItem(content.related.cards, index, direction) },
                  })
                }
                onRemove={() =>
                  patchContent({
                    ...content,
                    related: { ...content.related, cards: content.related.cards.filter((_, i) => i !== index) },
                  })
                }
                onChange={(next) =>
                  patchContent({
                    ...content,
                    related: { ...content.related, cards: content.related.cards.map((row, i) => (i === index ? next : row)) },
                  })
                }
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
                    cards: [
                      ...content.related.cards,
                      {
                        id: newB2bItemId("related"),
                        href: "/",
                        category: "",
                        title: "",
                        description: "",
                        publishedAt: "",
                        updatedAt: "",
                        contentType: "",
                        readingTime: "",
                        meta: "",
                        cta: "",
                        featured: false,
                      },
                    ],
                  },
                })
              }
            >
              เพิ่มการ์ดเนื้อหาที่เกี่ยวข้อง
            </button>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "form"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Form</p>
                <h2>CTA และแบบฟอร์มติดต่อ</h2>
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
            <Field label="หัวข้อสิ่งที่โรงแรมจะได้รับ">
              <input className="crm-field" value={content.form.receiveTitle} onChange={(e) => patchContent({ ...content, form: { ...content.form, receiveTitle: e.target.value } })} />
            </Field>
            <Field label="สิ่งที่โรงแรมจะได้รับ" hint="บรรทัดละหนึ่งรายการ — Partner Fit Review, B2B Rate & Commission Review, Sales Material Checklist, Partner Follow-up Plan">
              <textarea
                className="crm-area"
                rows={4}
                value={content.form.receive.join("\n")}
                onChange={(e) =>
                  patchContent({
                    ...content,
                    form: { ...content.form, receive: e.target.value.split("\n").map((item) => item.trim()).filter(Boolean) },
                  })
                }
              />
            </Field>
            <Field label="หัวข้อ What Happens Next">
              <input className="crm-field" value={content.form.nextTitle} onChange={(e) => patchContent({ ...content, form: { ...content.form, nextTitle: e.target.value } })} />
            </Field>
            <Field label="ขั้นตอนถัดไป" hint="บรรทัดละหนึ่งรายการ">
              <textarea
                className="crm-area"
                rows={4}
                value={content.form.steps.join("\n")}
                onChange={(e) =>
                  patchContent({
                    ...content,
                    form: { ...content.form, steps: e.target.value.split("\n").map((item) => item.trim()).filter(Boolean) },
                  })
                }
              />
            </Field>
            <Field label="ข้อความปุ่มส่ง">
              <input className="crm-field" value={content.form.submit} onChange={(e) => patchContent({ ...content, form: { ...content.form, submit: e.target.value } })} />
            </Field>
            <VisualFields
              slot="team"
              fileName="teamImageFile"
              visual={content.form.visual}
              hint="Optional. Source 1200 × 800 px. Display ~420 × 280 px. Ratio 3:2. Show only when status is approved or real. Never use /images/b2b-agent-sales-team-placeholder.webp."
            />
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
                <ListBar
                  title={item.q || `FAQ ${index + 1}`}
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

function RelatedFields({
  card,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  card: CmsRelatedCard;
  index: number;
  total: number;
  onChange: (card: CmsRelatedCard) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="crm-cs-metric">
      <ListBar
        title={card.title || `การ์ด ${index + 1}`}
        disableUp={index === 0}
        disableDown={index === total - 1}
        onUp={() => onMove(-1)}
        onDown={() => onMove(1)}
        onRemove={onRemove}
      />
      <Field label="หมวด">
        <input className="crm-field" value={card.category} onChange={(e) => onChange({ ...card, category: e.target.value })} />
      </Field>
      <Field label="หัวข้อ">
        <input className="crm-field" value={card.title} onChange={(e) => onChange({ ...card, title: e.target.value })} />
      </Field>
      <Field label="ลิงก์">
        <input className="crm-field" value={card.href} onChange={(e) => onChange({ ...card, href: e.target.value })} />
      </Field>
      <Field label="คำอธิบาย">
        <textarea className="crm-area" rows={2} value={card.description} onChange={(e) => onChange({ ...card, description: e.target.value })} />
      </Field>
      <Field label="วันที่เผยแพร่" hint="ใส่เฉพาะวันที่จริงจากบทความ ห้ามสร้างวันที่จำลอง">
        <input className="crm-field" value={card.publishedAt} onChange={(e) => onChange({ ...card, publishedAt: e.target.value })} />
      </Field>
      <Field label="วันที่อัปเดต">
        <input className="crm-field" value={card.updatedAt} onChange={(e) => onChange({ ...card, updatedAt: e.target.value })} />
      </Field>
      <Field label="ประเภทเนื้อหา">
        <input className="crm-field" value={card.contentType} onChange={(e) => onChange({ ...card, contentType: e.target.value })} />
      </Field>
      <Field label="เวลาอ่าน">
        <input className="crm-field" value={card.readingTime} onChange={(e) => onChange({ ...card, readingTime: e.target.value })} />
      </Field>
      <Field label="ปุ่ม">
        <input className="crm-field" value={card.cta} onChange={(e) => onChange({ ...card, cta: e.target.value })} />
      </Field>
      <label className="crm-cms-field">
        <span>การ์ดเด่น</span>
        <input type="checkbox" checked={card.featured} onChange={(e) => onChange({ ...card, featured: e.target.checked })} />
      </label>
    </div>
  );
}
