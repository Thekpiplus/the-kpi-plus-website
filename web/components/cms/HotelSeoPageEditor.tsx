"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type ReactNode } from "react";
import {
  SEO_CMS_KPI_STATUSES,
  SEO_CMS_VISUAL_STATUSES,
  newSeoItemId,
  seoCmsErrorMessage,
  validateHotelSeoPage,
  type CmsHotelSeoPage,
  type CmsSeoKpi,
  type CmsSeoRelatedCard,
  type CmsSeoSource,
  type CmsSeoVisual,
  type SeoCmsIntent,
  type SeoCmsSaveResult,
  type SeoEditorState,
} from "@/lib/cms/hotel-seo-page";
import type { HotelSeoKpiStatus, HotelSeoVisualStatus } from "@/lib/hotel-seo";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "search", label: "Search Behavior" },
  { id: "compare", label: "SEO / AEO / Local" },
  { id: "problems", label: "Problems" },
  { id: "help", label: "Local Discovery" },
  { id: "gbp", label: "Google Business Profile" },
  { id: "method", label: "Process" },
  { id: "measure", label: "Outcomes" },
  { id: "related", label: "Related" },
  { id: "form", label: "CTA / Form" },
  { id: "faq", label: "FAQ" },
  { id: "consistency", label: "Data Checklist" },
  { id: "seo", label: "SEO" },
  { id: "publish", label: "Publish" },
] as const;

type Tab = (typeof TABS)[number]["id"];
type VisualSlot = "hero" | "search" | "compare" | "problems" | "help" | "gbp" | "method" | "measure" | "related" | "form" | "seo";

function isTab(value: string | undefined): value is Tab {
  return TABS.some((tab) => tab.id === value);
}

function formatStamp(value?: string) {
  if (!value) return "ยังไม่เคยบันทึก";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "ยังไม่เคยบันทึก";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="crm-cms-field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function RowActions({
  name,
  onUp,
  onDown,
  onRemove,
  disableUp,
  disableDown,
}: {
  name: string;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}) {
  return (
    <div className="crm-cs-sticky-actions">
      <button type="button" className="crm-users-secondary" aria-label={`ย้ายขึ้น ${name}`} disabled={disableUp} onClick={onUp}>
        ขึ้น
      </button>
      <button type="button" className="crm-users-secondary" aria-label={`ย้ายลง ${name}`} disabled={disableDown} onClick={onDown}>
        ลง
      </button>
      <button type="button" className="crm-users-secondary" aria-label={`ลบ ${name}`} onClick={onRemove}>
        ลบ
      </button>
    </div>
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
        height={320}
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

function withOrder<T extends { order: number }>(items: T[]) {
  return items.map((item, index) => ({ ...item, order: index + 1 }));
}

export function HotelSeoPageEditor({
  initial,
  notice,
  error,
  saveAction,
  updatedAt,
  initialTab,
  previewHref,
  publicHref,
}: {
  initial: SeoEditorState;
  notice?: string;
  error?: string;
  saveAction: (formData: FormData) => Promise<SeoCmsSaveResult>;
  updatedAt?: string;
  initialTab?: string;
  previewHref: string;
  publicHref: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [tab, setTab] = useState<Tab>(isTab(initialTab) ? initialTab : "hero");
  const [content, setContent] = useState(initial.content);
  const [meta, setMeta] = useState({
    title: initial.title,
    seoTitle: initial.seoTitle,
    metaDescription: initial.metaDescription,
    excerpt: initial.excerpt,
    canonical: initial.canonical || initial.content.seo.canonical,
    locale: initial.locale,
    status: initial.status,
  });
  const [previews, setPreviews] = useState<Record<VisualSlot, string>>({
    hero: initial.content.hero.visual.src,
    search: initial.content.search.visual.src,
    compare: initial.content.compare.visual.src,
    problems: initial.content.problems.visual.src,
    help: initial.content.help.visual.src,
    gbp: initial.content.gbp.visual.src,
    method: initial.content.method.visual.src,
    measure: initial.content.measure.visual.src,
    related: initial.content.related.visual.src,
    form: initial.content.form.visual.src,
    seo: initial.content.seo.social.src,
  });
  const [clears, setClears] = useState<Record<VisualSlot, boolean>>({
    hero: false,
    search: false,
    compare: false,
    problems: false,
    help: false,
    gbp: false,
    method: false,
    measure: false,
    related: false,
    form: false,
    seo: false,
  });
  const [dirty, setDirty] = useState(false);
  const [ok, setOk] = useState(notice || "");
  const [status, setStatus] = useState(error ? seoCmsErrorMessage(error) : "");
  const [dialog, setDialog] = useState<"unpublish" | null>(null);
  const [pending, startTransition] = useTransition();

  function markDirty() {
    setDirty(true);
    setOk("");
    setStatus("");
  }

  function patchContent(next: CmsHotelSeoPage) {
    setContent(next);
    markDirty();
  }

  function patchVisual(slot: VisualSlot, visual: CmsSeoVisual) {
    if (slot === "hero") patchContent({ ...content, hero: { ...content.hero, visual } });
    else if (slot === "search") patchContent({ ...content, search: { ...content.search, visual } });
    else if (slot === "compare") patchContent({ ...content, compare: { ...content.compare, visual } });
    else if (slot === "problems") patchContent({ ...content, problems: { ...content.problems, visual } });
    else if (slot === "help") patchContent({ ...content, help: { ...content.help, visual } });
    else if (slot === "gbp") patchContent({ ...content, gbp: { ...content.gbp, visual } });
    else if (slot === "method") patchContent({ ...content, method: { ...content.method, visual } });
    else if (slot === "measure") patchContent({ ...content, measure: { ...content.measure, visual } });
    else if (slot === "related") patchContent({ ...content, related: { ...content.related, visual } });
    else if (slot === "form") patchContent({ ...content, form: { ...content.form, visual } });
    else patchContent({ ...content, seo: { ...content.seo, social: visual } });
  }

  function VisualFields({ slot, fileName, visual, hint }: { slot: VisualSlot; fileName: string; visual: CmsSeoVisual; hint: string }) {
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
        <Field label="สถานะรูป" hint="ใช้ Sample สำหรับแผนภาพจำลอง — ภาพหน้าจอจริงของ Search Console หรือ Maps ต้องเป็น Approved หรือ Real">
          <select className="crm-field" value={visual.status} onChange={(event) => patchVisual(slot, { ...visual, status: event.target.value as HotelSeoVisualStatus })}>
            {SEO_CMS_VISUAL_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <label className="crm-cms-field">
          <span>รูปมีแบรนด์ Google หรือ Maps</span>
          <input type="checkbox" checked={visual.containsGoogleBrand} onChange={(event) => patchVisual(slot, { ...visual, containsGoogleBrand: event.target.checked })} />
        </label>
        {visual.containsGoogleBrand ? (
          <Field label="บันทึกการอนุญาตหรือการอนุมัติ" hint="จำเป็นเมื่อเผยแพร่รูปที่มีแบรนด์ Google / Maps">
            <textarea className="crm-area" rows={2} value={visual.brandNote} onChange={(event) => patchVisual(slot, { ...visual, brandNote: event.target.value })} />
          </Field>
        ) : null}
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

  function SourceFields({ source, onChange }: { source: CmsSeoSource; onChange: (next: CmsSeoSource) => void }) {
    return (
      <div className="crm-cms-grid">
        <Field label="ชื่อแหล่งที่มา">
          <input className="crm-field" value={source.name} onChange={(event) => onChange({ ...source, name: event.target.value })} />
        </Field>
        <Field label="URL แหล่งที่มา">
          <input className="crm-field" value={source.url} onChange={(event) => onChange({ ...source, url: event.target.value })} />
        </Field>
        <Field label="วันที่เผยแพร่">
          <input className="crm-field" value={source.publishedAt} onChange={(event) => onChange({ ...source, publishedAt: event.target.value })} />
        </Field>
        <Field label="วันที่เข้าถึง">
          <input className="crm-field" value={source.accessedAt} onChange={(event) => onChange({ ...source, accessedAt: event.target.value })} />
        </Field>
        <Field label="ตลาด">
          <input className="crm-field" value={source.market} onChange={(event) => onChange({ ...source, market: event.target.value })} />
        </Field>
        <Field label="ช่วงเวลา">
          <input className="crm-field" value={source.period} onChange={(event) => onChange({ ...source, period: event.target.value })} />
        </Field>
        <Field label="คำนิยาม / ข้อจำกัด">
          <textarea className="crm-area" rows={2} value={source.definition} onChange={(event) => onChange({ ...source, definition: event.target.value })} />
        </Field>
        <Field label="สถานะข้อมูล">
          <select className="crm-field" value={source.status} onChange={(event) => onChange({ ...source, status: event.target.value as CmsSeoSource["status"] })}>
            <option value="guidance">guidance</option>
            <option value="platform_estimate">platform_estimate</option>
            <option value="sample">sample</option>
            <option value="approved">approved</option>
          </select>
        </Field>
      </div>
    );
  }

  function submit(intent: SeoCmsIntent) {
    const node = formRef.current;
    if (!node) return;
    const data = new FormData(node);
    data.set("intent", intent);
    data.set("contentJson", JSON.stringify({ ...content, seo: { ...content.seo, canonical: meta.canonical } }));
    data.set("title", meta.title);
    data.set("seoTitle", meta.seoTitle);
    data.set("metaDescription", meta.metaDescription);
    data.set("excerpt", meta.excerpt);
    data.set("canonical", meta.canonical);
    if (clears.hero) data.set("clearHeroImage", "1");
    if (clears.search) data.set("clearSearchImage", "1");
    if (clears.compare) data.set("clearCompareImage", "1");
    if (clears.problems) data.set("clearProblemImage", "1");
    if (clears.help) data.set("clearHelpImage", "1");
    if (clears.gbp) data.set("clearGbpImage", "1");
    if (clears.method) data.set("clearProcessImage", "1");
    if (clears.measure) data.set("clearKpiImage", "1");
    if (clears.related) data.set("clearRelatedImage", "1");
    if (clears.form) data.set("clearTeamImage", "1");
    if (clears.seo) data.set("clearOgImage", "1");
    const pageError = validateHotelSeoPage({ ...content, seo: { ...content.seo, canonical: meta.canonical } }, intent, {
      seoTitle: meta.seoTitle,
      metaDescription: meta.metaDescription,
    });
    if (pageError) {
      setOk("");
      setStatus(seoCmsErrorMessage(pageError));
      if (pageError === "required_fields" || pageError === "invalid_cta") setTab("hero");
      else if (pageError === "required_seo_meta") setTab("seo");
      else if (pageError === "empty_faq") setTab("faq");
      else if (pageError === "kpi_incomplete") setTab("measure");
      else if (pageError === "source_incomplete" || pageError === "source_dates") setTab("search");
      else if (pageError === "guarantee_claim") setTab("publish");
      else if (pageError === "brand_note" || pageError === "missing_alt" || pageError === "placeholder_status" || pageError === "placeholder_label" || pageError === "screenshot_approval") {
        setTab("hero");
      } else setTab("publish");
      return;
    }
    startTransition(async () => {
      setOk("");
      setStatus("");
      const result = await saveAction(data);
      if (!result.ok) {
        setStatus(seoCmsErrorMessage(result.error));
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
    const intent = (submitter?.value as SeoCmsIntent) || "save";
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
    <div className="crm-cms-editor">
      <nav className="crm-cms-tabs" role="tablist" aria-label="ส่วนของหน้า Hotel SEO">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            id={`hotel-seo-cms-tab-${item.id}`}
            role="tab"
            aria-selected={tab === item.id}
            aria-controls="hotel-seo-cms-panel"
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
        <div id="hotel-seo-cms-panel" role="tabpanel" aria-labelledby={`hotel-seo-cms-tab-${tab}`}>
          {tab === "hero" ? (
            <section className="crm-cms-panel">
              <Field label="Eyebrow">
                <input className="crm-field" value={content.hero.eyebrow} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, eyebrow: event.target.value } })} />
              </Field>
              <Field label="หัวข้อ">
                <textarea className="crm-area" rows={2} value={content.hero.title} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, title: event.target.value } })} />
              </Field>
              <Field label="คำอธิบาย">
                <textarea className="crm-area" rows={4} value={content.hero.description} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, description: event.target.value } })} />
              </Field>
              <Field label="จุดสำคัญ" hint="หนึ่งบรรทัดต่อข้อ">
                <textarea className="crm-area" rows={4} value={content.hero.points.join("\n")} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, points: event.target.value.split("\n") } })} />
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
                <textarea className="crm-area" rows={2} value={content.hero.underCta} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, underCta: event.target.value } })} />
              </Field>
              <VisualFields slot="hero" fileName="heroImageFile" visual={content.hero.visual} hint="Dummy 1600 × 900 px ถ้ามี — หน้าสาธารณะติดป้าย Sample เมื่อสถานะไม่ใช่ Approved/Real" />
            </section>
          ) : null}

          {tab === "search" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อพฤติกรรมการค้นหา">
                <input className="crm-field" value={content.search.title} onChange={(event) => patchContent({ ...content, search: { ...content.search, title: event.target.value } })} />
              </Field>
              <Field label="คำอธิบาย">
                <textarea className="crm-area" rows={3} value={content.search.intro} onChange={(event) => patchContent({ ...content, search: { ...content.search, intro: event.target.value } })} />
              </Field>
              {content.search.types.map((item, index) => (
                <div key={item.id || index} className="crm-cs-metric">
                  <div className="crm-cs-metric-head">
                    <h3>{item.title || `ประเภท ${index + 1}`}</h3>
                    <RowActions
                      name={item.title || `ประเภท ${index + 1}`}
                      disableUp={index === 0}
                      disableDown={index === content.search.types.length - 1}
                      onUp={() => patchContent({ ...content, search: { ...content.search, types: withOrder(moveItem(content.search.types, index, -1)) } })}
                      onDown={() => patchContent({ ...content, search: { ...content.search, types: withOrder(moveItem(content.search.types, index, 1)) } })}
                      onRemove={() => patchContent({ ...content, search: { ...content.search, types: withOrder(content.search.types.filter((_, i) => i !== index)) } })}
                    />
                  </div>
                  <Field label="หัวข้อ">
                    <input className="crm-field" value={item.title} onChange={(event) => patchContent({ ...content, search: { ...content.search, types: content.search.types.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)) } })} />
                  </Field>
                  <Field label="คำอธิบาย">
                    <textarea className="crm-area" rows={2} value={item.body} onChange={(event) => patchContent({ ...content, search: { ...content.search, types: content.search.types.map((row, i) => (i === index ? { ...row, body: event.target.value } : row)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, search: { ...content.search, types: [...content.search.types, { id: newSeoItemId("type"), num: String(content.search.types.length + 1).padStart(2, "0"), title: "", body: "", order: content.search.types.length + 1 }] } })}>
                เพิ่มประเภทการค้นหา
              </button>
              <Field label="Search Behavior Map" hint="หนึ่งบรรทัดต่อขั้น">
                <textarea className="crm-area" rows={5} value={content.search.map.join("\n")} onChange={(event) => patchContent({ ...content, search: { ...content.search, map: event.target.value.split("\n") } })} />
              </Field>
              <Field label="หัวข้อ AI Mode">
                <input className="crm-field" value={content.search.aiTitle} onChange={(event) => patchContent({ ...content, search: { ...content.search, aiTitle: event.target.value } })} />
              </Field>
              <Field label="ข้อเท็จจริง AI Mode">
                <textarea className="crm-area" rows={3} value={content.search.aiBody} onChange={(event) => patchContent({ ...content, search: { ...content.search, aiBody: event.target.value } })} />
              </Field>
              <h3>แหล่งที่มา AI Mode</h3>
              <SourceFields source={content.search.aiModeSource} onChange={(source) => patchContent({ ...content, search: { ...content.search, aiModeSource: source } })} />
              <Field label="หัวข้อตัวเลขการเติบโต">
                <input className="crm-field" value={content.search.growthTitle} onChange={(event) => patchContent({ ...content, search: { ...content.search, growthTitle: event.target.value } })} />
              </Field>
              <Field label="ตัวเลขการเติบโต">
                <input className="crm-field" value={content.search.growthStat} onChange={(event) => patchContent({ ...content, search: { ...content.search, growthStat: event.target.value } })} />
              </Field>
              <Field label="ป้ายกำกับตัวเลข">
                <input className="crm-field" value={content.search.growthLabel} onChange={(event) => patchContent({ ...content, search: { ...content.search, growthLabel: event.target.value } })} />
              </Field>
              <Field label="คำอธิบายตัวเลข">
                <textarea className="crm-area" rows={2} value={content.search.growthNote} onChange={(event) => patchContent({ ...content, search: { ...content.search, growthNote: event.target.value } })} />
              </Field>
              <h3>แหล่งที่มาตัวเลข</h3>
              <SourceFields source={content.search.growthSource} onChange={(source) => patchContent({ ...content, search: { ...content.search, growthSource: source } })} />
              <Field label="หัวข้อ Maps">
                <input className="crm-field" value={content.search.mapsTitle} onChange={(event) => patchContent({ ...content, search: { ...content.search, mapsTitle: event.target.value } })} />
              </Field>
              <Field label="ข้อเท็จจริง Maps">
                <textarea className="crm-area" rows={3} value={content.search.mapsBody} onChange={(event) => patchContent({ ...content, search: { ...content.search, mapsBody: event.target.value } })} />
              </Field>
              <h3>แหล่งที่มา Maps</h3>
              <SourceFields source={content.search.mapsSource} onChange={(source) => patchContent({ ...content, search: { ...content.search, mapsSource: source } })} />
              <Field label="ข้อความขอบเขต AI Search / AEO">
                <textarea className="crm-area" rows={4} value={content.search.aiNote} onChange={(event) => patchContent({ ...content, search: { ...content.search, aiNote: event.target.value } })} />
              </Field>
              <h3>แหล่งที่มา AI Search guidance</h3>
              <SourceFields source={content.search.aiNoteSource} onChange={(source) => patchContent({ ...content, search: { ...content.search, aiNoteSource: source } })} />
              <Field label="ข้อความปิดส่วน Search">
                <textarea className="crm-area" rows={2} value={content.search.close} onChange={(event) => patchContent({ ...content, search: { ...content.search, close: event.target.value } })} />
              </Field>
              <VisualFields slot="search" fileName="searchImageFile" visual={content.search.visual} hint="Dummy 1200 × 800 px · Search Behavior Map" />
            </section>
          ) : null}

          {tab === "compare" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อเปรียบเทียบ">
                <input className="crm-field" value={content.compare.title} onChange={(event) => patchContent({ ...content, compare: { ...content.compare, title: event.target.value } })} />
              </Field>
              <Field label="ข้อความปิด">
                <textarea className="crm-area" rows={3} value={content.compare.close} onChange={(event) => patchContent({ ...content, compare: { ...content.compare, close: event.target.value } })} />
              </Field>
              {content.compare.rows.map((row, index) => (
                <div key={row.id || index} className="crm-cs-metric">
                  <div className="crm-cs-metric-head">
                    <h3>{row.area || `แถว ${index + 1}`}</h3>
                    <RowActions
                      name={row.area || `แถว ${index + 1}`}
                      disableUp={index === 0}
                      disableDown={index === content.compare.rows.length - 1}
                      onUp={() => patchContent({ ...content, compare: { ...content.compare, rows: withOrder(moveItem(content.compare.rows, index, -1)) } })}
                      onDown={() => patchContent({ ...content, compare: { ...content.compare, rows: withOrder(moveItem(content.compare.rows, index, 1)) } })}
                      onRemove={() => patchContent({ ...content, compare: { ...content.compare, rows: withOrder(content.compare.rows.filter((_, i) => i !== index)) } })}
                    />
                  </div>
                  <Field label="ด้านงาน">
                    <input className="crm-field" value={row.area} onChange={(event) => patchContent({ ...content, compare: { ...content.compare, rows: content.compare.rows.map((item, i) => (i === index ? { ...item, area: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="เป้าหมาย">
                    <input className="crm-field" value={row.goal} onChange={(event) => patchContent({ ...content, compare: { ...content.compare, rows: content.compare.rows.map((item, i) => (i === index ? { ...item, goal: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สิ่งที่ต้องจัดเตรียม">
                    <textarea className="crm-area" rows={2} value={row.prepare} onChange={(event) => patchContent({ ...content, compare: { ...content.compare, rows: content.compare.rows.map((item, i) => (i === index ? { ...item, prepare: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สิ่งที่ลูกค้าเห็น">
                    <textarea className="crm-area" rows={2} value={row.sees} onChange={(event) => patchContent({ ...content, compare: { ...content.compare, rows: content.compare.rows.map((item, i) => (i === index ? { ...item, sees: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผลที่มุ่งหวัง">
                    <input className="crm-field" value={row.output} onChange={(event) => patchContent({ ...content, compare: { ...content.compare, rows: content.compare.rows.map((item, i) => (i === index ? { ...item, output: event.target.value } : item)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, compare: { ...content.compare, rows: [...content.compare.rows, { id: newSeoItemId("compare"), num: String(content.compare.rows.length + 1).padStart(2, "0"), area: "", goal: "", prepare: "", sees: "", output: "", order: content.compare.rows.length + 1 }] } })}>
                เพิ่มแถวเปรียบเทียบ
              </button>
              <VisualFields slot="compare" fileName="compareImageFile" visual={content.compare.visual} hint="Dummy 1600 × 900 px · SEO / AEO / Local SEO framework" />
            </section>
          ) : null}

          {tab === "problems" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อปัญหา">
                <input className="crm-field" value={content.problems.title} onChange={(event) => patchContent({ ...content, problems: { ...content.problems, title: event.target.value } })} />
              </Field>
              <Field label="ปุ่ม CTA">
                <input className="crm-field" value={content.problems.cta} onChange={(event) => patchContent({ ...content, problems: { ...content.problems, cta: event.target.value } })} />
              </Field>
              {content.problems.items.map((row, index) => (
                <div key={row.id || index} className="crm-cs-metric">
                  <div className="crm-cs-metric-head">
                    <h3>{row.problem || `ปัญหา ${index + 1}`}</h3>
                    <RowActions
                      name={row.problem || `ปัญหา ${index + 1}`}
                      disableUp={index === 0}
                      disableDown={index === content.problems.items.length - 1}
                      onUp={() => patchContent({ ...content, problems: { ...content.problems, items: withOrder(moveItem(content.problems.items, index, -1)) } })}
                      onDown={() => patchContent({ ...content, problems: { ...content.problems, items: withOrder(moveItem(content.problems.items, index, 1)) } })}
                      onRemove={() => patchContent({ ...content, problems: { ...content.problems, items: withOrder(content.problems.items.filter((_, i) => i !== index)) } })}
                    />
                  </div>
                  <Field label="ปัญหา">
                    <textarea className="crm-area" rows={2} value={row.problem} onChange={(event) => patchContent({ ...content, problems: { ...content.problems, items: content.problems.items.map((item, i) => (i === index ? { ...item, problem: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สิ่งที่ลูกค้าเห็น">
                    <textarea className="crm-area" rows={2} value={row.sees} onChange={(event) => patchContent({ ...content, problems: { ...content.problems, items: content.problems.items.map((item, i) => (i === index ? { ...item, sees: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ข้อมูลที่ควรตรวจ">
                    <textarea className="crm-area" rows={2} value={row.inspect} onChange={(event) => patchContent({ ...content, problems: { ...content.problems, items: content.problems.items.map((item, i) => (i === index ? { ...item, inspect: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="สิ่งที่ควรปรับ">
                    <textarea className="crm-area" rows={2} value={row.improve} onChange={(event) => patchContent({ ...content, problems: { ...content.problems, items: content.problems.items.map((item, i) => (i === index ? { ...item, improve: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผลที่มุ่งหวัง">
                    <textarea className="crm-area" rows={2} value={row.output} onChange={(event) => patchContent({ ...content, problems: { ...content.problems, items: content.problems.items.map((item, i) => (i === index ? { ...item, output: event.target.value } : item)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, problems: { ...content.problems, items: [...content.problems.items, { id: newSeoItemId("problem"), num: String(content.problems.items.length + 1).padStart(2, "0"), problem: "", sees: "", inspect: "", improve: "", output: "", order: content.problems.items.length + 1 }] } })}>
                เพิ่มปัญหา
              </button>
              <VisualFields slot="problems" fileName="problemImageFile" visual={content.problems.visual} hint="Dummy 1200 × 800 px · ปิดข้อมูลระบุตัวตน" />
            </section>
          ) : null}

          {tab === "help" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อการช่วยค้นพบ">
                <input className="crm-field" value={content.help.title} onChange={(event) => patchContent({ ...content, help: { ...content.help, title: event.target.value } })} />
              </Field>
              <h3>Local Discovery Flow</h3>
              {content.help.stages.map((row, index) => (
                <div key={row.id || index} className="crm-cs-metric">
                  <div className="crm-cs-metric-head">
                    <h3>{row.label || `ขั้น ${index + 1}`}</h3>
                    <RowActions
                      name={row.label || `ขั้น ${index + 1}`}
                      disableUp={index === 0}
                      disableDown={index === content.help.stages.length - 1}
                      onUp={() => patchContent({ ...content, help: { ...content.help, stages: withOrder(moveItem(content.help.stages, index, -1)) } })}
                      onDown={() => patchContent({ ...content, help: { ...content.help, stages: withOrder(moveItem(content.help.stages, index, 1)) } })}
                      onRemove={() => patchContent({ ...content, help: { ...content.help, stages: withOrder(content.help.stages.filter((_, i) => i !== index)) } })}
                    />
                  </div>
                  <Field label="ชื่อขั้น">
                    <input className="crm-field" value={row.label} onChange={(event) => patchContent({ ...content, help: { ...content.help, stages: content.help.stages.map((item, i) => (i === index ? { ...item, label: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผลลัพธ์">
                    <input className="crm-field" value={row.output} onChange={(event) => patchContent({ ...content, help: { ...content.help, stages: content.help.stages.map((item, i) => (i === index ? { ...item, output: event.target.value } : item)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, help: { ...content.help, stages: [...content.help.stages, { id: newSeoItemId("stage"), label: "", output: "", order: content.help.stages.length + 1 }] } })}>
                เพิ่มขั้นใน Flow
              </button>
              <h3>ขั้นตอนงาน</h3>
              {content.help.steps.map((row, index) => (
                <HelpStepFields
                  key={row.id || index}
                  row={row}
                  index={index}
                  total={content.help.steps.length}
                  onChange={(next) => patchContent({ ...content, help: { ...content.help, steps: content.help.steps.map((item, i) => (i === index ? next : item)) } })}
                  onMove={(direction) => patchContent({ ...content, help: { ...content.help, steps: withOrder(moveItem(content.help.steps, index, direction)) } })}
                  onRemove={() => patchContent({ ...content, help: { ...content.help, steps: withOrder(content.help.steps.filter((_, i) => i !== index)) } })}
                />
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, help: { ...content.help, steps: [...content.help.steps, { id: newSeoItemId("help"), num: String(content.help.steps.length + 1).padStart(2, "0"), title: "", owner: "", input: "", action: "", output: "", nextDecision: "", order: content.help.steps.length + 1 }] } })}>
                เพิ่มขั้นตอน
              </button>
              <h3>ขอบเขตความรับผิดชอบ / AI Search</h3>
              <Field label="Kicker">
                <input className="crm-field" value={content.help.boundary.kicker} onChange={(event) => patchContent({ ...content, help: { ...content.help, boundary: { ...content.help.boundary, kicker: event.target.value } } })} />
              </Field>
              <Field label="ข้อความขอบเขต">
                <textarea className="crm-area" rows={3} value={content.help.boundary.note} onChange={(event) => patchContent({ ...content, help: { ...content.help, boundary: { ...content.help.boundary, note: event.target.value } } })} />
              </Field>
              <Field label="หัวข้อสิ่งที่ทีมช่วยได้">
                <input className="crm-field" value={content.help.boundary.supportTitle} onChange={(event) => patchContent({ ...content, help: { ...content.help, boundary: { ...content.help.boundary, supportTitle: event.target.value } } })} />
              </Field>
              <Field label="รายการที่ทีมช่วยได้" hint="หนึ่งบรรทัดต่อรายการ">
                <textarea className="crm-area" rows={4} value={content.help.boundary.support.join("\n")} onChange={(event) => patchContent({ ...content, help: { ...content.help, boundary: { ...content.help.boundary, support: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) } } })} />
              </Field>
              <Field label="หัวข้อสิ่งที่โรงแรมอนุมัติ">
                <input className="crm-field" value={content.help.boundary.approveTitle} onChange={(event) => patchContent({ ...content, help: { ...content.help, boundary: { ...content.help.boundary, approveTitle: event.target.value } } })} />
              </Field>
              <Field label="รายการที่โรงแรมอนุมัติ" hint="หนึ่งบรรทัดต่อรายการ">
                <textarea className="crm-area" rows={4} value={content.help.boundary.approve.join("\n")} onChange={(event) => patchContent({ ...content, help: { ...content.help, boundary: { ...content.help.boundary, approve: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) } } })} />
              </Field>
              <VisualFields slot="help" fileName="helpImageFile" visual={content.help.visual} hint="Dummy 1600 × 900 px · Search → Maps → Website → Contact" />
            </section>
          ) : null}

          {tab === "gbp" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อ GBP">
                <textarea className="crm-area" rows={2} value={content.gbp.title} onChange={(event) => patchContent({ ...content, gbp: { ...content.gbp, title: event.target.value } })} />
              </Field>
              <Field label="เนื้อหา">
                <textarea className="crm-area" rows={4} value={content.gbp.body} onChange={(event) => patchContent({ ...content, gbp: { ...content.gbp, body: event.target.value } })} />
              </Field>
              <Field label="ตัวอย่างประกอบ">
                <textarea className="crm-area" rows={2} value={content.gbp.example} onChange={(event) => patchContent({ ...content, gbp: { ...content.gbp, example: event.target.value } })} />
              </Field>
              <Field label="ข้อความขอบเขตอันดับ Maps">
                <textarea className="crm-area" rows={3} value={content.gbp.rankNote} onChange={(event) => patchContent({ ...content, gbp: { ...content.gbp, rankNote: event.target.value } })} />
              </Field>
              <Field label="ข้อความปิด">
                <textarea className="crm-area" rows={2} value={content.gbp.close} onChange={(event) => patchContent({ ...content, gbp: { ...content.gbp, close: event.target.value } })} />
              </Field>
              <h3>แหล่งที่มา</h3>
              <SourceFields source={content.gbp.source} onChange={(source) => patchContent({ ...content, gbp: { ...content.gbp, source } })} />
              <h3>ฟิลด์ / รายการตรวจ</h3>
              {content.gbp.fields.map((row, index) => (
                <div key={row.id || index} className="crm-cs-metric">
                  <div className="crm-cs-metric-head">
                    <h3>{row.label || `ฟิลด์ ${index + 1}`}</h3>
                    <RowActions
                      name={row.label || `ฟิลด์ ${index + 1}`}
                      disableUp={index === 0}
                      disableDown={index === content.gbp.fields.length - 1}
                      onUp={() => patchContent({ ...content, gbp: { ...content.gbp, fields: withOrder(moveItem(content.gbp.fields, index, -1)) } })}
                      onDown={() => patchContent({ ...content, gbp: { ...content.gbp, fields: withOrder(moveItem(content.gbp.fields, index, 1)) } })}
                      onRemove={() => patchContent({ ...content, gbp: { ...content.gbp, fields: withOrder(content.gbp.fields.filter((_, i) => i !== index)) } })}
                    />
                  </div>
                  <Field label="ฟิลด์">
                    <input className="crm-field" value={row.label} onChange={(event) => patchContent({ ...content, gbp: { ...content.gbp, fields: content.gbp.fields.map((item, i) => (i === index ? { ...item, label: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="จุดตรวจ">
                    <input className="crm-field" value={row.check} onChange={(event) => patchContent({ ...content, gbp: { ...content.gbp, fields: content.gbp.fields.map((item, i) => (i === index ? { ...item, check: event.target.value } : item)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, gbp: { ...content.gbp, fields: [...content.gbp.fields, { id: newSeoItemId("gbp"), label: "", check: "", order: content.gbp.fields.length + 1 }] } })}>
                เพิ่มฟิลด์ GBP
              </button>
              <h3>การกระทำของลูกค้า</h3>
              {content.gbp.actions.map((row, index) => (
                <div key={row.id || index} className="crm-cs-metric">
                  <div className="crm-cs-metric-head">
                    <h3>{row.name || `การกระทำ ${index + 1}`}</h3>
                    <RowActions
                      name={row.name || `การกระทำ ${index + 1}`}
                      disableUp={index === 0}
                      disableDown={index === content.gbp.actions.length - 1}
                      onUp={() => patchContent({ ...content, gbp: { ...content.gbp, actions: withOrder(moveItem(content.gbp.actions, index, -1)) } })}
                      onDown={() => patchContent({ ...content, gbp: { ...content.gbp, actions: withOrder(moveItem(content.gbp.actions, index, 1)) } })}
                      onRemove={() => patchContent({ ...content, gbp: { ...content.gbp, actions: withOrder(content.gbp.actions.filter((_, i) => i !== index)) } })}
                    />
                  </div>
                  <Field label="ชื่อการกระทำ">
                    <input className="crm-field" value={row.name} onChange={(event) => patchContent({ ...content, gbp: { ...content.gbp, actions: content.gbp.actions.map((item, i) => (i === index ? { ...item, name: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="คำอธิบาย">
                    <input className="crm-field" value={row.label} onChange={(event) => patchContent({ ...content, gbp: { ...content.gbp, actions: content.gbp.actions.map((item, i) => (i === index ? { ...item, label: event.target.value } : item)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, gbp: { ...content.gbp, actions: [...content.gbp.actions, { id: newSeoItemId("gbp-action"), name: "", label: "", order: content.gbp.actions.length + 1 }] } })}>
                เพิ่มการกระทำ GBP
              </button>
              <VisualFields slot="gbp" fileName="gbpImageFile" visual={content.gbp.visual} hint="Dummy 1200 × 800 px · ปิดรหัสบัญชี อีเมล และชื่อผู้รีวิว" />
            </section>
          ) : null}

          {tab === "method" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อกระบวนการ">
                <input className="crm-field" value={content.method.title} onChange={(event) => patchContent({ ...content, method: { ...content.method, title: event.target.value } })} />
              </Field>
              {content.method.steps.map((row, index) => (
                <HelpStepFields
                  key={row.id || index}
                  row={row}
                  extra={
                    <Field label="เฟส">
                      <input className="crm-field" value={row.phase} onChange={(event) => patchContent({ ...content, method: { ...content.method, steps: content.method.steps.map((item, i) => (i === index ? { ...item, phase: event.target.value } : item)) } })} />
                    </Field>
                  }
                  index={index}
                  total={content.method.steps.length}
                  onChange={(next) => patchContent({ ...content, method: { ...content.method, steps: content.method.steps.map((item, i) => (i === index ? { ...item, ...next, phase: item.phase } : item)) } })}
                  onMove={(direction) => patchContent({ ...content, method: { ...content.method, steps: withOrder(moveItem(content.method.steps, index, direction)) } })}
                  onRemove={() => patchContent({ ...content, method: { ...content.method, steps: withOrder(content.method.steps.filter((_, i) => i !== index)) } })}
                />
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, method: { ...content.method, steps: [...content.method.steps, { id: newSeoItemId("process"), num: String(content.method.steps.length + 1).padStart(2, "0"), phase: "", title: "", action: "", owner: "", input: "", output: "", nextDecision: "", order: content.method.steps.length + 1 }] } })}>
                เพิ่มขั้นตอนกระบวนการ
              </button>
              <VisualFields slot="method" fileName="processImageFile" visual={content.method.visual} hint="Dummy 1600 × 900 px · Audit → Review → Prioritize → Track" />
            </section>
          ) : null}

          {tab === "measure" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อวัดผล">
                <input className="crm-field" value={content.measure.title} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, title: event.target.value } })} />
              </Field>
              <Field label="คำอธิบายกรอบตัวชี้วัด">
                <textarea className="crm-area" rows={3} value={content.measure.intro} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, intro: event.target.value } })} />
              </Field>
              <Field label="ข้อความปิด">
                <textarea className="crm-area" rows={3} value={content.measure.close} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, close: event.target.value } })} />
              </Field>
              {content.measure.kpis.map((kpi, index) => (
                <KpiFields
                  key={kpi.id || index}
                  kpi={kpi}
                  index={index}
                  total={content.measure.kpis.length}
                  onChange={(next) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((item, i) => (i === index ? next : item)) } })}
                  onMove={(direction) => patchContent({ ...content, measure: { ...content.measure, kpis: moveItem(content.measure.kpis, index, direction) } })}
                  onRemove={() => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.filter((_, i) => i !== index) } })}
                />
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, measure: { ...content.measure, kpis: [...content.measure.kpis, { id: newSeoItemId("kpi"), name: "", group: "website", definition: "", unit: "", period: "", target: "", value: "", context: "", labels: [], values: [], dataStatus: "sample", updatedAt: "", hideUntilData: true, source: { name: "", url: "", publishedAt: "", accessedAt: "", market: "", period: "", definition: "", status: "sample" } }] } })}>
                เพิ่ม KPI
              </button>
              <VisualFields slot="measure" fileName="kpiImageFile" visual={content.measure.visual} hint="Dummy 1600 × 900 px · ติดป้าย Sample data เมื่อยังไม่มีข้อมูลอนุมัติ" />
            </section>
          ) : null}

          {tab === "related" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อ Related">
                <input className="crm-field" value={content.related.title} onChange={(event) => patchContent({ ...content, related: { ...content.related, title: event.target.value } })} />
              </Field>
              {content.related.cards.map((card, index) => (
                <RelatedFields
                  key={card.id || index}
                  card={card}
                  index={index}
                  total={content.related.cards.length}
                  onChange={(next) => patchContent({ ...content, related: { ...content.related, cards: content.related.cards.map((item, i) => (i === index ? next : item)) } })}
                  onMove={(direction) => patchContent({ ...content, related: { ...content.related, cards: withOrder(moveItem(content.related.cards, index, direction)) } })}
                  onRemove={() => patchContent({ ...content, related: { ...content.related, cards: withOrder(content.related.cards.filter((_, i) => i !== index)) } })}
                />
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, related: { ...content.related, cards: [...content.related.cards, { id: newSeoItemId("related"), href: "/", external: false, featured: false, category: "", title: "", description: "", publishedAt: "", updatedAt: "", accessedAt: "", contentType: "", readingTime: "", cta: "", sourceName: "", sourceUrl: "", order: content.related.cards.length + 1 }] } })}>
                เพิ่มการ์ดเนื้อหาที่เกี่ยวข้อง
              </button>
              <VisualFields slot="related" fileName="relatedImageFile" visual={content.related.visual} hint="Dummy 1200 × 800 px · ไม่ใช้รูป Hero หรือ GBP" />
            </section>
          ) : null}

          {tab === "form" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อย่อย">
                <input className="crm-field" value={content.form.kicker} onChange={(event) => patchContent({ ...content, form: { ...content.form, kicker: event.target.value } })} />
              </Field>
              <Field label="หัวข้อฟอร์ม">
                <input className="crm-field" value={content.form.heading} onChange={(event) => patchContent({ ...content, form: { ...content.form, heading: event.target.value } })} />
              </Field>
              <Field label="คำอธิบาย">
                <textarea className="crm-area" rows={3} value={content.form.lead} onChange={(event) => patchContent({ ...content, form: { ...content.form, lead: event.target.value } })} />
              </Field>
              <Field label="ข้อความช่วยเหลือ">
                <textarea className="crm-area" rows={2} value={content.form.note} onChange={(event) => patchContent({ ...content, form: { ...content.form, note: event.target.value } })} />
              </Field>
              <Field label="ปุ่มส่ง">
                <input className="crm-field" value={content.form.submit} onChange={(event) => patchContent({ ...content, form: { ...content.form, submit: event.target.value } })} />
              </Field>
              <Field label="หัวข้อสิ่งที่โรงแรมจะได้รับ">
                <input className="crm-field" value={content.form.receiveTitle} onChange={(event) => patchContent({ ...content, form: { ...content.form, receiveTitle: event.target.value } })} />
              </Field>
              <Field label="รายการที่ได้รับ" hint="รูปแบบ หัวข้อ | คำอธิบาย หนึ่งบรรทัดต่อรายการ">
                <textarea
                  className="crm-area"
                  rows={6}
                  value={content.form.receive.map((item) => `${item.title} | ${item.body}`).join("\n")}
                  onChange={(event) =>
                    patchContent({
                      ...content,
                      form: {
                        ...content.form,
                        receive: event.target.value.split("\n").map((line, index) => {
                          const [title, ...rest] = line.split("|");
                          return { id: content.form.receive[index]?.id || newSeoItemId("receive"), title: (title || "").trim(), body: rest.join("|").trim() };
                        }).filter((item) => item.title || item.body),
                      },
                    })
                  }
                />
              </Field>
              <Field label="หัวข้อ What Happens Next">
                <input className="crm-field" value={content.form.nextTitle} onChange={(event) => patchContent({ ...content, form: { ...content.form, nextTitle: event.target.value } })} />
              </Field>
              <Field label="ขั้นตอนถัดไป" hint="หนึ่งบรรทัดต่อขั้น">
                <textarea className="crm-area" rows={4} value={content.form.steps.join("\n")} onChange={(event) => patchContent({ ...content, form: { ...content.form, steps: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) } })} />
              </Field>
              <h3>ป้ายฟอร์มและความยินยอม</h3>
              {(["name", "business", "contact", "website", "maps", "issue", "outcome", "consent", "privacy"] as const).map((key) => (
                <Field key={key} label={key}>
                  <input className="crm-field" value={content.form.labels[key]} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, [key]: event.target.value } } })} />
                </Field>
              ))}
              <VisualFields slot="form" fileName="teamImageFile" visual={content.form.visual} hint="รูปทีมแสดงได้เฉพาะสถานะ Approved หรือ Real" />
            </section>
          ) : null}

          {tab === "faq" ? (
            <section className="crm-cms-panel">
              <p className="crm-contact-image-hint">คำถามและคำตอบต้องไม่ว่างเมื่อเผยแพร่ ห้ามรับประกันอันดับ Maps หรือการแสดงผลใน AI Search</p>
              {content.faqs.map((item, index) => (
                <div key={item.id || index} className="crm-cs-metric">
                  <div className="crm-cs-metric-head">
                    <h3>{item.q || `FAQ ${index + 1}`}</h3>
                    <RowActions
                      name={item.q || `FAQ ${index + 1}`}
                      disableUp={index === 0}
                      disableDown={index === content.faqs.length - 1}
                      onUp={() => patchContent({ ...content, faqs: moveItem(content.faqs, index, -1) })}
                      onDown={() => patchContent({ ...content, faqs: moveItem(content.faqs, index, 1) })}
                      onRemove={() => patchContent({ ...content, faqs: content.faqs.filter((_, i) => i !== index) })}
                    />
                  </div>
                  <Field label="คำถาม">
                    <input className="crm-field" value={item.q} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((row, i) => (i === index ? { ...row, q: event.target.value } : row)) })} />
                  </Field>
                  <Field label="คำตอบ">
                    <textarea className="crm-area" rows={4} value={item.a} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((row, i) => (i === index ? { ...row, a: event.target.value } : row)) })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, faqs: [...content.faqs, { id: newSeoItemId("faq"), q: "", a: "" }] })}>
                เพิ่มคำถาม
              </button>
            </section>
          ) : null}

          {tab === "consistency" ? (
            <section className="crm-cms-panel">
              <Field label="หัวข้อรายการตรวจ">
                <input className="crm-field" value={content.consistency.title} onChange={(event) => patchContent({ ...content, consistency: { ...content.consistency, title: event.target.value } })} />
              </Field>
              <Field label="คำอธิบาย">
                <textarea className="crm-area" rows={2} value={content.consistency.note} onChange={(event) => patchContent({ ...content, consistency: { ...content.consistency, note: event.target.value } })} />
              </Field>
              <h3>Search Console</h3>
              {content.consistency.gsc.map((row, index) => (
                <div key={row.id || index} className="crm-cs-metric">
                  <div className="crm-cs-metric-head">
                    <h3>{row.area || `GSC ${index + 1}`}</h3>
                    <RowActions
                      name={row.area || `GSC ${index + 1}`}
                      disableUp={index === 0}
                      disableDown={index === content.consistency.gsc.length - 1}
                      onUp={() => patchContent({ ...content, consistency: { ...content.consistency, gsc: withOrder(moveItem(content.consistency.gsc, index, -1)) } })}
                      onDown={() => patchContent({ ...content, consistency: { ...content.consistency, gsc: withOrder(moveItem(content.consistency.gsc, index, 1)) } })}
                      onRemove={() => patchContent({ ...content, consistency: { ...content.consistency, gsc: withOrder(content.consistency.gsc.filter((_, i) => i !== index)) } })}
                    />
                  </div>
                  <Field label="หัวข้อ">
                    <input className="crm-field" value={row.area} onChange={(event) => patchContent({ ...content, consistency: { ...content.consistency, gsc: content.consistency.gsc.map((item, i) => (i === index ? { ...item, area: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="จุดตรวจ">
                    <input className="crm-field" value={row.check} onChange={(event) => patchContent({ ...content, consistency: { ...content.consistency, gsc: content.consistency.gsc.map((item, i) => (i === index ? { ...item, check: event.target.value } : item)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, consistency: { ...content.consistency, gsc: [...content.consistency.gsc, { id: newSeoItemId("gsc"), area: "", check: "", order: content.consistency.gsc.length + 1 }] } })}>
                เพิ่มรายการ Search Console
              </button>
              <h3>Local listing</h3>
              {content.consistency.listing.map((row, index) => (
                <div key={row.id || index} className="crm-cs-metric">
                  <div className="crm-cs-metric-head">
                    <h3>{row.area || `Listing ${index + 1}`}</h3>
                    <RowActions
                      name={row.area || `Listing ${index + 1}`}
                      disableUp={index === 0}
                      disableDown={index === content.consistency.listing.length - 1}
                      onUp={() => patchContent({ ...content, consistency: { ...content.consistency, listing: withOrder(moveItem(content.consistency.listing, index, -1)) } })}
                      onDown={() => patchContent({ ...content, consistency: { ...content.consistency, listing: withOrder(moveItem(content.consistency.listing, index, 1)) } })}
                      onRemove={() => patchContent({ ...content, consistency: { ...content.consistency, listing: withOrder(content.consistency.listing.filter((_, i) => i !== index)) } })}
                    />
                  </div>
                  <Field label="หัวข้อ">
                    <input className="crm-field" value={row.area} onChange={(event) => patchContent({ ...content, consistency: { ...content.consistency, listing: content.consistency.listing.map((item, i) => (i === index ? { ...item, area: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="จุดตรวจ">
                    <input className="crm-field" value={row.check} onChange={(event) => patchContent({ ...content, consistency: { ...content.consistency, listing: content.consistency.listing.map((item, i) => (i === index ? { ...item, check: event.target.value } : item)) } })} />
                  </Field>
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, consistency: { ...content.consistency, listing: [...content.consistency.listing, { id: newSeoItemId("listing"), area: "", check: "", order: content.consistency.listing.length + 1 }] } })}>
                เพิ่มรายการ Local listing
              </button>
            </section>
          ) : null}

          {tab === "seo" ? (
            <section className="crm-cms-panel">
              <Field label="ชื่อหน้าในระบบ">
                <input className="crm-field" value={meta.title} onChange={(event) => { setMeta({ ...meta, title: event.target.value }); markDirty(); }} />
              </Field>
              <Field label="SEO title">
                <input className="crm-field" value={meta.seoTitle} onChange={(event) => { setMeta({ ...meta, seoTitle: event.target.value }); markDirty(); }} />
              </Field>
              <Field label="Meta description">
                <textarea className="crm-area" rows={3} value={meta.metaDescription} onChange={(event) => { setMeta({ ...meta, metaDescription: event.target.value }); markDirty(); }} />
              </Field>
              <Field label="Canonical URL">
                <input className="crm-field" value={meta.canonical} onChange={(event) => { setMeta({ ...meta, canonical: event.target.value }); markDirty(); }} />
              </Field>
              <Field label="Excerpt">
                <textarea className="crm-area" rows={2} value={meta.excerpt} onChange={(event) => { setMeta({ ...meta, excerpt: event.target.value }); markDirty(); }} />
              </Field>
              <VisualFields slot="seo" fileName="ogImageFile" visual={content.seo.social} hint="1200 × 630 px · ภาพโซเชียล" />
            </section>
          ) : null}

          {tab === "publish" ? (
            <section className="crm-cms-panel">
              <p>สถานะปัจจุบัน: {meta.status === "published" ? "เผยแพร่แล้ว" : "ฉบับร่าง"}</p>
              <p>บันทึกล่าสุด {formatStamp(updatedAt)}</p>
              <p>
                หน้าสาธารณะ: <a href={publicHref}>{publicHref}</a>
              </p>
              <p>
                ตัวอย่างในระบบ: <a href={previewHref}>{previewHref}</a>
              </p>
              <div className="crm-cs-sticky-actions">
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
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" onClick={() => setDialog(null)} />
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby="hotel-seo-unpublish-title">
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">CMS</p>
                <h2 id="hotel-seo-unpublish-title">ยกเลิกเผยแพร่</h2>
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

function HelpStepFields({
  row,
  index,
  total,
  extra,
  onChange,
  onMove,
  onRemove,
}: {
  row: { id: string; num: string; title: string; owner: string; input: string; action: string; output: string; nextDecision: string; order: number };
  index: number;
  total: number;
  extra?: ReactNode;
  onChange: (row: { id: string; num: string; title: string; owner: string; input: string; action: string; output: string; nextDecision: string; order: number }) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="crm-cs-metric">
      <div className="crm-cs-metric-head">
        <h3>{row.title || `ขั้น ${index + 1}`}</h3>
        <RowActions name={row.title || `ขั้น ${index + 1}`} disableUp={index === 0} disableDown={index === total - 1} onUp={() => onMove(-1)} onDown={() => onMove(1)} onRemove={onRemove} />
      </div>
      {extra}
      <Field label="หัวข้อ">
        <input className="crm-field" value={row.title} onChange={(event) => onChange({ ...row, title: event.target.value })} />
      </Field>
      <Field label="ผู้รับผิดชอบ">
        <textarea className="crm-area" rows={2} value={row.owner} onChange={(event) => onChange({ ...row, owner: event.target.value })} />
      </Field>
      <Field label="สิ่งที่รับ">
        <textarea className="crm-area" rows={2} value={row.input} onChange={(event) => onChange({ ...row, input: event.target.value })} />
      </Field>
      <Field label="สิ่งที่ทำ">
        <textarea className="crm-area" rows={2} value={row.action} onChange={(event) => onChange({ ...row, action: event.target.value })} />
      </Field>
      <Field label="สิ่งที่ได้">
        <textarea className="crm-area" rows={2} value={row.output} onChange={(event) => onChange({ ...row, output: event.target.value })} />
      </Field>
      <Field label="การตัดสินใจขั้นถัดไป">
        <textarea className="crm-area" rows={2} value={row.nextDecision} onChange={(event) => onChange({ ...row, nextDecision: event.target.value })} />
      </Field>
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
  kpi: CmsSeoKpi;
  index: number;
  total: number;
  onChange: (kpi: CmsSeoKpi) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="crm-cs-metric">
      <div className="crm-cs-metric-head">
        <h3>{kpi.name || `KPI ${index + 1}`}</h3>
        <RowActions name={kpi.name || `KPI ${index + 1}`} disableUp={index === 0} disableDown={index === total - 1} onUp={() => onMove(-1)} onDown={() => onMove(1)} onRemove={onRemove} />
      </div>
      <Field label="ชื่อตัวชี้วัด">
        <input className="crm-field" value={kpi.name} onChange={(event) => onChange({ ...kpi, name: event.target.value })} />
      </Field>
      <Field label="กลุ่ม">
        <select className="crm-field" value={kpi.group} onChange={(event) => onChange({ ...kpi, group: event.target.value })}>
          <option value="website">website</option>
          <option value="gbp">gbp</option>
          <option value="business">business</option>
        </select>
      </Field>
      <Field label="คำนิยาม">
        <textarea className="crm-area" rows={2} value={kpi.definition} onChange={(event) => onChange({ ...kpi, definition: event.target.value })} />
      </Field>
      <Field label="หน่วย">
        <input className="crm-field" value={kpi.unit} onChange={(event) => onChange({ ...kpi, unit: event.target.value })} />
      </Field>
      <Field label="ช่วงเวลา">
        <input className="crm-field" value={kpi.period} onChange={(event) => onChange({ ...kpi, period: event.target.value })} />
      </Field>
      <Field label="พร็อพเพอร์ตี้ / ตลาด">
        <input className="crm-field" value={kpi.context} onChange={(event) => onChange({ ...kpi, context: event.target.value })} />
      </Field>
      <Field label="เป้าหมายหรือเปรียบเทียบ">
        <input className="crm-field" value={kpi.target} onChange={(event) => onChange({ ...kpi, target: event.target.value })} />
      </Field>
      <Field label="ค่าที่แสดง" hint="ค่าสาธารณะแสดงเมื่อสถานะ Approved หรือ Anonymised">
        <input className="crm-field" value={kpi.value} onChange={(event) => onChange({ ...kpi, value: event.target.value })} />
      </Field>
      <Field label="Chart labels" hint="คั่นด้วยจุลภาค">
        <input className="crm-field" value={kpi.labels.join(", ")} onChange={(event) => onChange({ ...kpi, labels: event.target.value.split(/[,|\n]/).map((item) => item.trim()).filter(Boolean) })} />
      </Field>
      <Field label="Chart values" hint="ตัวเลขจริงคั่นด้วยจุลภาค">
        <input className="crm-field" value={kpi.values.join(", ")} onChange={(event) => onChange({ ...kpi, values: event.target.value.split(/[,|\n]/).map((item) => Number(item.trim())).filter((item) => Number.isFinite(item)) })} />
      </Field>
      <Field label="สถานะข้อมูล">
        <select className="crm-field" value={kpi.dataStatus} onChange={(event) => onChange({ ...kpi, dataStatus: event.target.value as HotelSeoKpiStatus })}>
          {SEO_CMS_KPI_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
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
      <Field label="ชื่อแหล่งที่มา">
        <input className="crm-field" value={kpi.source.name} onChange={(event) => onChange({ ...kpi, source: { ...kpi.source, name: event.target.value } })} />
      </Field>
      <Field label="URL แหล่งที่มา">
        <input className="crm-field" value={kpi.source.url} onChange={(event) => onChange({ ...kpi, source: { ...kpi.source, url: event.target.value } })} />
      </Field>
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
  card: CmsSeoRelatedCard;
  index: number;
  total: number;
  onChange: (card: CmsSeoRelatedCard) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="crm-cs-metric">
      <div className="crm-cs-metric-head">
        <h3>{card.title || `การ์ด ${index + 1}`}</h3>
        <RowActions name={card.title || `การ์ด ${index + 1}`} disableUp={index === 0} disableDown={index === total - 1} onUp={() => onMove(-1)} onDown={() => onMove(1)} onRemove={onRemove} />
      </div>
      <Field label="หมวด">
        <input className="crm-field" value={card.category} onChange={(event) => onChange({ ...card, category: event.target.value })} />
      </Field>
      <Field label="หัวข้อ">
        <input className="crm-field" value={card.title} onChange={(event) => onChange({ ...card, title: event.target.value })} />
      </Field>
      <Field label="ลิงก์">
        <input className="crm-field" value={card.href} onChange={(event) => onChange({ ...card, href: event.target.value })} />
      </Field>
      <label className="crm-cms-field">
        <span>ลิงก์ภายนอก</span>
        <input type="checkbox" checked={card.external} onChange={(event) => onChange({ ...card, external: event.target.checked })} />
      </label>
      <label className="crm-cms-field">
        <span>การ์ดเด่น</span>
        <input type="checkbox" checked={card.featured} onChange={(event) => onChange({ ...card, featured: event.target.checked })} />
      </label>
      <Field label="คำอธิบายสั้น">
        <textarea className="crm-area" rows={2} value={card.description} onChange={(event) => onChange({ ...card, description: event.target.value })} />
      </Field>
      <Field label="วันที่เผยแพร่">
        <input className="crm-field" value={card.publishedAt} onChange={(event) => onChange({ ...card, publishedAt: event.target.value })} />
      </Field>
      <Field label="วันที่เข้าถึง">
        <input className="crm-field" value={card.accessedAt} onChange={(event) => onChange({ ...card, accessedAt: event.target.value })} />
      </Field>
      <Field label="ประเภทเนื้อหา">
        <input className="crm-field" value={card.contentType} onChange={(event) => onChange({ ...card, contentType: event.target.value })} />
      </Field>
      <Field label="ปุ่ม">
        <input className="crm-field" value={card.cta} onChange={(event) => onChange({ ...card, cta: event.target.value })} />
      </Field>
      <Field label="ชื่อแหล่งที่มา">
        <input className="crm-field" value={card.sourceName} onChange={(event) => onChange({ ...card, sourceName: event.target.value })} />
      </Field>
      <Field label="URL แหล่งที่มา">
        <input className="crm-field" value={card.sourceUrl} onChange={(event) => onChange({ ...card, sourceUrl: event.target.value })} />
      </Field>
    </div>
  );
}
