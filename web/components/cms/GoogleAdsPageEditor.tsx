"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  ADS_CMS_KPI_STATUSES,
  ADS_CMS_VISUAL_STATUSES,
  adsCmsErrorMessage,
  newAdsItemId,
  type AdsCmsIntent,
  type AdsCmsSaveResult,
  type AdsEditorState,
  type CmsAdsKpi,
  type CmsAdsRelatedCard,
  type CmsAdsVisual,
  type CmsGoogleAdsPage,
} from "@/lib/cms/google-ads-page";
import type { AdsKpiStatus, AdsVisualStatus } from "@/lib/google-ads";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "visibility", label: "Google Visibility" },
  { id: "readiness", label: "Search Readiness" },
  { id: "channels", label: "Channels" },
  { id: "workflow", label: "Workflow" },
  { id: "checklists", label: "Checklists" },
  { id: "kpis", label: "KPIs" },
  { id: "related", label: "Related" },
  { id: "form", label: "Form" },
  { id: "faq", label: "FAQ" },
  { id: "seo", label: "SEO" },
  { id: "publish", label: "Publish" },
] as const;

type Tab = (typeof TABS)[number]["id"];
type VisualSlot = "hero" | "visibility" | "readiness" | "channels" | "workflow" | "kpis" | "related" | "team" | "social";

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

export function GoogleAdsPageEditor({
  initial,
  notice,
  error,
  saveAction,
  updatedAt,
  initialTab,
  previewHref,
  publicHref,
}: {
  initial: AdsEditorState;
  notice?: string;
  error?: string;
  saveAction: (formData: FormData) => Promise<AdsCmsSaveResult>;
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
  const [content, setContent] = useState<CmsGoogleAdsPage>(initial.content);
  const [status, setStatus] = useState(error ? adsCmsErrorMessage(error) : "");
  const [ok, setOk] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<"unpublish" | null>(null);
  const [dirty, setDirty] = useState(false);
  const [previews, setPreviews] = useState<Record<VisualSlot, string>>({
    hero: initial.content.hero.visual.src,
    visibility: initial.content.visibility.visual.src,
    readiness: initial.content.readiness.visual.src,
    channels: initial.content.channels.visual.src,
    workflow: initial.content.workflow.visual.src,
    kpis: initial.content.measure.visual.src,
    related: initial.content.related.visual.src,
    team: initial.content.form.visual?.src ?? "",
    social: initial.content.seo.social.src,
  });
  const [clears, setClears] = useState<Record<VisualSlot, boolean>>({
    hero: false,
    visibility: false,
    readiness: false,
    channels: false,
    workflow: false,
    kpis: false,
    related: false,
    team: false,
    social: false,
  });

  function markDirty() {
    setDirty(true);
    setOk("");
  }

  function patchContent(next: CmsGoogleAdsPage) {
    setContent(next);
    markDirty();
  }

  function patchVisual(slot: VisualSlot, visual: CmsAdsVisual) {
    if (slot === "hero") patchContent({ ...content, hero: { ...content.hero, visual } });
    else if (slot === "visibility") patchContent({ ...content, visibility: { ...content.visibility, visual } });
    else if (slot === "readiness") patchContent({ ...content, readiness: { ...content.readiness, visual } });
    else if (slot === "channels") patchContent({ ...content, channels: { ...content.channels, visual } });
    else if (slot === "workflow") patchContent({ ...content, workflow: { ...content.workflow, visual } });
    else if (slot === "kpis") patchContent({ ...content, measure: { ...content.measure, visual } });
    else if (slot === "related") patchContent({ ...content, related: { ...content.related, visual } });
    else if (slot === "team") patchContent({ ...content, form: { ...content.form, visual } });
    else patchContent({ ...content, seo: { ...content.seo, social: visual } });
  }

  function VisualFields({ slot, fileName, visual, hint }: { slot: VisualSlot; fileName: string; visual: CmsAdsVisual; hint: string }) {
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
        <Field label="สถานะรูป" hint="ใช้ Sample สำหรับแผนภาพจำลอง — ภาพหน้าจอจริงต้องเป็น Approved หรือ Real ก่อนเผยแพร่">
          <select
            className="crm-field"
            value={visual.status}
            onChange={(event) => patchVisual(slot, { ...visual, status: event.target.value as AdsVisualStatus })}
          >
            {ADS_CMS_VISUAL_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <label className="crm-cms-field">
          <span>รูปมีโลโก้หรือแบรนด์ Google</span>
          <input
            type="checkbox"
            checked={Boolean(visual.containsGoogleBrand)}
            onChange={(event) => patchVisual(slot, { ...visual, containsGoogleBrand: event.target.checked })}
          />
        </label>
        {visual.containsGoogleBrand ? (
          <Field label="บันทึกการอนุญาตหรือการอนุมัติ" hint="จำเป็นเมื่อเผยแพร่รูปที่มีแบรนด์ Google">
            <textarea
              className="crm-area"
              rows={2}
              value={visual.brandNote || ""}
              onChange={(event) => patchVisual(slot, { ...visual, brandNote: event.target.value })}
            />
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

  function submit(intent: AdsCmsIntent) {
    const node = formRef.current;
    if (!node) return;
    const data = new FormData(node);
    data.set("intent", intent);
    data.set("contentJson", JSON.stringify(content));
    if (clears.hero) data.set("clearHeroImage", "1");
    if (clears.visibility) data.set("clearVisibilityImage", "1");
    if (clears.readiness) data.set("clearReadinessImage", "1");
    if (clears.channels) data.set("clearChannelImage", "1");
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
        setStatus(adsCmsErrorMessage(result.error));
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
    const intent = (submitter?.value as AdsCmsIntent) || "save";
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
      <nav className="crm-cms-tabs" role="tablist" aria-label="ส่วนของหน้า Google Ads">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            id={`google-ads-cms-tab-${item.id}`}
            role="tab"
            aria-selected={tab === item.id}
            aria-controls="google-ads-cms-panel"
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
        <div id="google-ads-cms-panel" role="tabpanel" aria-labelledby={`google-ads-cms-tab-${tab}`}>
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
            <VisualFields slot="hero" fileName="heroImageFile" visual={content.hero.visual} hint="1600 × 1000 px · ตัวอย่าง Hotel Search & Booking Campaign ไม่ใช่แดชบอร์ดบัญชีจริง และห้ามใช้ซ้ำใน Visibility" />
          </section>
        ) : null}
        {tab === "visibility" ? (
          <section className="crm-cms-panel">
            <p className="crm-contact-image-hint">ใช้แผนภาพ Search Visibility และ Hotel Booking Page ที่ปิดบัญชี ห้ามใช้ภาพชุดเดียวกับ Hero และห้ามจำลองผลอันดับหรือแดชบอร์ดบัญชีจริง</p>
            <Field label="หัวข้อ">
              <input className="crm-field" value={content.visibility.title} onChange={(event) => patchContent({ ...content, visibility: { ...content.visibility, title: event.target.value } })} />
            </Field>
            <Field label="คำอธิบาย">
              <textarea className="crm-area" rows={4} value={content.visibility.body || ""} onChange={(event) => patchContent({ ...content, visibility: { ...content.visibility, body: event.target.value } })} />
            </Field>
            <Field label="หมายเหตุท้ายส่วน">
              <textarea className="crm-area" rows={3} value={content.visibility.note || ""} onChange={(event) => patchContent({ ...content, visibility: { ...content.visibility, note: event.target.value } })} />
            </Field>
            <VisualFields slot="visibility" fileName="visibilityImageFile" visual={content.visibility.visual} hint="1200 × 800 px · ตัวอย่าง Search Visibility และ Hotel Booking Page · ต่างจาก Hero" />
          </section>
        ) : null}
        {tab === "readiness" ? (
          <section className="crm-cms-panel">
            <Field label="หัวข้อ Search-to-Booking Readiness">
              <input className="crm-field" value={content.readiness.title} onChange={(event) => patchContent({ ...content, readiness: { ...content.readiness, title: event.target.value } })} />
            </Field>
            <Field label="คำอธิบาย">
              <textarea className="crm-area" rows={3} value={content.readiness.body} onChange={(event) => patchContent({ ...content, readiness: { ...content.readiness, body: event.target.value } })} />
            </Field>
            {content.readiness.items.map((item, index) => (
              <div key={item.id} className="crm-cs-metric">
                <div className="crm-cs-metric-head">
                  <h3>{item.area || item.check || `ด้าน ${index + 1}`}</h3>
                  <div className="crm-cs-sticky-actions">
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, readiness: { ...content.readiness, items: withOrder(moveItem(content.readiness.items, index, -1)) } })}>
                      ขึ้น
                    </button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, readiness: { ...content.readiness, items: withOrder(moveItem(content.readiness.items, index, 1)) } })}>
                      ลง
                    </button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, readiness: { ...content.readiness, items: withOrder(content.readiness.items.filter((_, i) => i !== index)) } })}>
                      ลบ
                    </button>
                  </div>
                </div>
                <Field label="ด้าน (Area)">
                  <input className="crm-field" value={item.area} onChange={(event) => patchContent({ ...content, readiness: { ...content.readiness, items: content.readiness.items.map((row, i) => (i === index ? { ...row, area: event.target.value } : row)) } })} />
                </Field>
                <Field label="ปัญหาหรือสถานะปัจจุบัน">
                  <input className="crm-field" value={item.problem} onChange={(event) => patchContent({ ...content, readiness: { ...content.readiness, items: content.readiness.items.map((row, i) => (i === index ? { ...row, problem: event.target.value, why: event.target.value } : row)) } })} />
                </Field>
                <Field label="สิ่งที่ต้องตรวจ">
                  <input className="crm-field" value={item.inspect} onChange={(event) => patchContent({ ...content, readiness: { ...content.readiness, items: content.readiness.items.map((row, i) => (i === index ? { ...row, inspect: event.target.value, check: event.target.value } : row)) } })} />
                </Field>
                <Field label="สิ่งที่ต้องปรับ">
                  <input className="crm-field" value={item.improve} onChange={(event) => patchContent({ ...content, readiness: { ...content.readiness, items: content.readiness.items.map((row, i) => (i === index ? { ...row, improve: event.target.value } : row)) } })} />
                </Field>
                <Field label="ผลที่คาดหวัง">
                  <input className="crm-field" value={item.output} onChange={(event) => patchContent({ ...content, readiness: { ...content.readiness, items: content.readiness.items.map((row, i) => (i === index ? { ...row, output: event.target.value } : row)) } })} />
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
                    items: withOrder([...content.readiness.items, { id: newAdsItemId("ready"), area: "", problem: "", inspect: "", improve: "", output: "", check: "", why: "", order: content.readiness.items.length + 1 }]),
                  },
                })
              }
            >
              เพิ่มแถวกรอบความพร้อม
            </button>
            <VisualFields slot="readiness" fileName="readinessImageFile" visual={content.readiness.visual} hint="1600 × 900 px · Search-to-Booking Readiness Framework — Sample · ห้ามใช้ภาพ Hero หรือ Visibility" />
          </section>
        ) : null}
        {tab === "channels" ? (
          <section className="crm-cms-panel">
            <Field label="หัวข้อเปรียบเทียบช่องทาง">
              <input className="crm-field" value={content.channels.title} onChange={(event) => patchContent({ ...content, channels: { ...content.channels, title: event.target.value } })} />
            </Field>
            {content.channels.rows.map((row, index) => (
              <div key={row.id} className="crm-cs-metric">
                <div className="crm-cs-metric-head">
                  <h3>{row.channel || `ช่องทาง ${index + 1}`}</h3>
                  <div className="crm-cs-sticky-actions">
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, channels: { ...content.channels, rows: withOrder(moveItem(content.channels.rows, index, -1)) } })}>
                      ขึ้น
                    </button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, channels: { ...content.channels, rows: withOrder(moveItem(content.channels.rows, index, 1)) } })}>
                      ลง
                    </button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, channels: { ...content.channels, rows: withOrder(content.channels.rows.filter((_, i) => i !== index)) } })}>
                      ลบ
                    </button>
                  </div>
                </div>
                <Field label="Channel">
                  <input className="crm-field" value={row.channel} onChange={(event) => patchContent({ ...content, channels: { ...content.channels, rows: content.channels.rows.map((item, i) => (i === index ? { ...item, channel: event.target.value } : item)) } })} />
                </Field>
                <Field label="Best use case">
                  <input className="crm-field" value={row.useCase} onChange={(event) => patchContent({ ...content, channels: { ...content.channels, rows: content.channels.rows.map((item, i) => (i === index ? { ...item, useCase: event.target.value, role: event.target.value } : item)) } })} />
                </Field>
                <Field label="What can be controlled">
                  <input className="crm-field" value={row.control} onChange={(event) => patchContent({ ...content, channels: { ...content.channels, rows: content.channels.rows.map((item, i) => (i === index ? { ...item, control: event.target.value } : item)) } })} />
                </Field>
                <Field label="Required input">
                  <input className="crm-field" value={row.input} onChange={(event) => patchContent({ ...content, channels: { ...content.channels, rows: content.channels.rows.map((item, i) => (i === index ? { ...item, input: event.target.value, need: event.target.value } : item)) } })} />
                </Field>
                <Field label="Expected output">
                  <input className="crm-field" value={row.output} onChange={(event) => patchContent({ ...content, channels: { ...content.channels, rows: content.channels.rows.map((item, i) => (i === index ? { ...item, output: event.target.value } : item)) } })} />
                </Field>
                <Field label="KPI to monitor">
                  <input className="crm-field" value={row.kpi} onChange={(event) => patchContent({ ...content, channels: { ...content.channels, rows: content.channels.rows.map((item, i) => (i === index ? { ...item, kpi: event.target.value } : item)) } })} />
                </Field>
              </div>
            ))}
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  channels: {
                    ...content.channels,
                    rows: withOrder([
                      ...content.channels.rows,
                      {
                        id: newAdsItemId("channel"),
                        channel: "",
                        useCase: "",
                        control: "",
                        input: "",
                        output: "",
                        kpi: "",
                        role: "",
                        need: "",
                        hotel: "",
                        order: content.channels.rows.length + 1,
                      },
                    ]),
                  },
                })
              }
            >
              เพิ่มช่องทาง
            </button>
            <VisualFields slot="channels" fileName="channelImageFile" visual={content.channels.visual} hint="1600 × 900 px · Search Ads vs Hotel Ads vs Free Booking Links — Sample comparison · ห้ามใช้ภาพ Hero, Visibility, Framework หรือภาพผลการค้นหาปลอม" />
          </section>
        ) : null}
        {tab === "workflow" ? (
          <section className="crm-cms-panel">
            <Field label="หัวข้อ Campaign Workflow">
              <input className="crm-field" value={content.workflow.title} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, title: event.target.value } })} />
            </Field>
            {content.workflow.steps.map((step, index) => (
              <div key={step.id} className="crm-cs-metric">
                <div className="crm-cs-metric-head">
                  <h3>
                    {step.number} {step.title || `ขั้น ${index + 1}`}
                  </h3>
                  <div className="crm-cs-sticky-actions">
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, workflow: { ...content.workflow, steps: withOrder(moveItem(content.workflow.steps, index, -1)) } })}>
                      ขึ้น
                    </button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, workflow: { ...content.workflow, steps: withOrder(moveItem(content.workflow.steps, index, 1)) } })}>
                      ลง
                    </button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, workflow: { ...content.workflow, steps: withOrder(content.workflow.steps.filter((_, i) => i !== index)) } })}>
                      ลบ
                    </button>
                  </div>
                </div>
                <Field label="ลำดับ">
                  <input className="crm-field" value={step.number} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, i) => (i === index ? { ...item, number: event.target.value } : item)) } })} />
                </Field>
                <Field label="หัวข้อ">
                  <input className="crm-field" value={step.title} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, i) => (i === index ? { ...item, title: event.target.value } : item)) } })} />
                </Field>
                <Field label="ผู้รับผิดชอบ">
                  <input className="crm-field" value={step.owner} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, i) => (i === index ? { ...item, owner: event.target.value } : item)) } })} />
                </Field>
                <Field label="Input">
                  <input className="crm-field" value={step.input} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, i) => (i === index ? { ...item, input: event.target.value } : item)) } })} />
                </Field>
                <Field label="Action">
                  <textarea className="crm-area" rows={2} value={step.action} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, i) => (i === index ? { ...item, action: event.target.value } : item)) } })} />
                </Field>
                <Field label="Output">
                  <input className="crm-field" value={step.output} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, i) => (i === index ? { ...item, output: event.target.value } : item)) } })} />
                </Field>
                <Field label="Next decision">
                  <textarea className="crm-area" rows={2} value={step.nextDecision} onChange={(event) => patchContent({ ...content, workflow: { ...content.workflow, steps: content.workflow.steps.map((item, i) => (i === index ? { ...item, nextDecision: event.target.value, handoff: event.target.value } : item)) } })} />
                </Field>
              </div>
            ))}
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  workflow: {
                    ...content.workflow,
                    steps: withOrder([
                      ...content.workflow.steps,
                      {
                        id: newAdsItemId("step"),
                        number: String(content.workflow.steps.length + 1).padStart(2, "0"),
                        title: "",
                        owner: "",
                        input: "",
                        action: "",
                        output: "",
                        nextDecision: "",
                        handoff: "",
                        order: content.workflow.steps.length + 1,
                      },
                    ]),
                  },
                })
              }
            >
              เพิ่มขั้นตอน
            </button>
            <VisualFields slot="workflow" fileName="workflowImageFile" visual={content.workflow.visual} hint="1600 × 900 px · Google Ads Campaign Workflow — Sample process · ห้ามใช้ภาพประชุมทั่วไป ภาพ Hero หรือภาพช่องทาง" />
          </section>
        ) : null}
        {tab === "checklists" ? (
          <section className="crm-cms-panel">
            <h3>Tracking Boundary</h3>
            <Field label="หัวข้อ">
              <input
                className="crm-field"
                value={content.checklists?.tracking.title || ""}
                onChange={(event) =>
                  patchContent({
                    ...content,
                    checklists: {
                      ...content.checklists,
                      tracking: { ...content.checklists.tracking, title: event.target.value },
                    },
                  })
                }
              />
            </Field>
            <Field label="คำอธิบาย">
              <textarea
                className="crm-area"
                rows={3}
                value={content.checklists?.tracking.note || ""}
                onChange={(event) =>
                  patchContent({
                    ...content,
                    checklists: {
                      ...content.checklists,
                      tracking: { ...content.checklists.tracking, note: event.target.value },
                    },
                  })
                }
              />
            </Field>
            <Field label="รายการขอบเขตการวัดผล" hint="หนึ่งบรรทัดต่อรายการ">
              <textarea
                className="crm-area"
                rows={6}
                value={(content.checklists?.tracking.items || []).join("\n")}
                onChange={(event) =>
                  patchContent({
                    ...content,
                    checklists: {
                      ...content.checklists,
                      tracking: {
                        ...content.checklists.tracking,
                        items: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
                      },
                    },
                  })
                }
              />
            </Field>
            <h3>Landing Page Checklist</h3>
            <Field label="หัวข้อ">
              <input
                className="crm-field"
                value={content.checklists?.landing.title || ""}
                onChange={(event) =>
                  patchContent({
                    ...content,
                    checklists: {
                      ...content.checklists,
                      landing: { ...content.checklists.landing, title: event.target.value },
                    },
                  })
                }
              />
            </Field>
            <Field label="คำอธิบาย">
              <textarea
                className="crm-area"
                rows={3}
                value={content.checklists?.landing.note || ""}
                onChange={(event) =>
                  patchContent({
                    ...content,
                    checklists: {
                      ...content.checklists,
                      landing: { ...content.checklists.landing, note: event.target.value },
                    },
                  })
                }
              />
            </Field>
            <Field label="รายการตรวจหน้าปลายทาง" hint="หนึ่งบรรทัดต่อรายการ">
              <textarea
                className="crm-area"
                rows={6}
                value={(content.checklists?.landing.items || []).join("\n")}
                onChange={(event) =>
                  patchContent({
                    ...content,
                    checklists: {
                      ...content.checklists,
                      landing: {
                        ...content.checklists.landing,
                        items: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
                      },
                    },
                  })
                }
              />
            </Field>
          </section>
        ) : null}
        {tab === "kpis" ? (
          <section className="crm-cms-panel">
            <p className="crm-contact-image-hint">ข้อมูลจริงเผยแพร่ได้เมื่อ Approved หรือ Anonymised ข้อมูลตัวอย่างต้องมีสถานะ Sample และจะแสดงป้าย Sample data บนหน้าสาธารณะ ห้ามใส่ ROAS อัตราแปลง ยอดจอง หรือรายได้ที่ยังไม่อนุมัติ</p>
            <Field label="หัวข้อส่วน KPI">
              <input className="crm-field" value={content.measure.title} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, title: event.target.value } })} />
            </Field>
            <Field label="คำนำ">
              <textarea className="crm-area" rows={3} value={content.measure.intro} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, intro: event.target.value } })} />
            </Field>
            <Field label="ข้อความปิดท้าย">
              <textarea className="crm-area" rows={3} value={content.measure.close} onChange={(event) => patchContent({ ...content, measure: { ...content.measure, close: event.target.value } })} />
            </Field>
            {content.measure.kpis.map((kpi, index) => (
              <KpiFields
                key={kpi.id}
                kpi={kpi}
                index={index}
                total={content.measure.kpis.length}
                onMove={(direction) => patchContent({ ...content, measure: { ...content.measure, kpis: moveItem(content.measure.kpis, index, direction) } })}
                onRemove={() => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.filter((_, i) => i !== index) } })}
                onChange={(next) => patchContent({ ...content, measure: { ...content.measure, kpis: content.measure.kpis.map((row, i) => (i === index ? next : row)) } })}
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
                        id: newAdsItemId("kpi"),
                        name: "",
                        definition: "",
                        unit: "",
                        period: "",
                        target: "",
                        value: "",
                        context: "",
                        labels: [],
                        values: [],
                        tone: "positive",
                        dataStatus: "sample",
                        updatedAt: "",
                        hideUntilData: true,
                      },
                    ],
                  },
                })
              }
            >
              เพิ่มตัวชี้วัด
            </button>
            <VisualFields slot="kpis" fileName="kpiImageFile" visual={content.measure.visual} hint="1600 × 900 px · Google Ads Performance KPI · Sample data · ใช้ SVG สำหรับตัวเลขจริง ห้ามใช้ภาพ AI ที่ใส่ตัวเลข" />
          </section>
        ) : null}
        {tab === "related" ? (
          <section className="crm-cms-panel">
            <p className="crm-contact-image-hint">ใช้ภาพเดี่ยวหนึ่งภาพกับการ์ดข้อความ ห้ามใช้รูป Hero หรือ Visibility ห้ามใส่ชื่อผู้เขียน วันที่จำลอง ผลแคมเปญ หรือชื่อลูกค้า และห้ามเปิดเนื้อหาใน popup</p>
            <Field label="หัวข้อเนื้อหาที่เกี่ยวข้อง">
              <input className="crm-field" value={content.related.title} onChange={(event) => patchContent({ ...content, related: { ...content.related, title: event.target.value } })} />
            </Field>
            <VisualFields slot="related" fileName="relatedImageFile" visual={content.related.visual} hint="Dummy 1200 × 800 px, แสดงประมาณ 520 × 347 px, อัตราส่วน 3:2 — ป้าย Google Ads / Hotel Marketing Content" />
            {(content.related.cards || []).map((card, index) => (
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
                        id: newAdsItemId("related"),
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
            <Field label="ปุ่มส่ง">
              <input className="crm-field" value={content.form.submit} onChange={(event) => patchContent({ ...content, form: { ...content.form, submit: event.target.value } })} />
            </Field>
            <Field label="หัวข้อสิ่งที่โรงแรมจะได้รับ">
              <input className="crm-field" value={content.form.receiveTitle} onChange={(event) => patchContent({ ...content, form: { ...content.form, receiveTitle: event.target.value } })} />
            </Field>
            <Field label="รายการที่ได้รับ" hint="หนึ่งบรรทัดต่อรายการ">
              <textarea
                className="crm-area"
                rows={5}
                value={content.form.receive.join("\n")}
                onChange={(event) => patchContent({ ...content, form: { ...content.form, receive: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) } })}
              />
            </Field>
            <Field label="หัวข้อ What Happens Next">
              <input className="crm-field" value={content.form.nextTitle} onChange={(event) => patchContent({ ...content, form: { ...content.form, nextTitle: event.target.value } })} />
            </Field>
            <Field label="ขั้นตอนถัดไป" hint="หนึ่งบรรทัดต่อขั้น">
              <textarea
                className="crm-area"
                rows={4}
                value={(content.form.steps || []).join("\n")}
                onChange={(event) => patchContent({ ...content, form: { ...content.form, steps: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) } })}
              />
            </Field>
            <h3>ป้ายฟอร์มและความยินยอม</h3>
            <Field label="ชื่อผู้ติดต่อ">
              <input className="crm-field" value={content.form.labels?.name || ""} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, name: event.target.value } } })} />
            </Field>
            <Field label="ชื่อโรงแรม / กิจการ">
              <input className="crm-field" value={content.form.labels?.business || ""} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, business: event.target.value } } })} />
            </Field>
            <Field label="เบอร์โทรหรืออีเมล">
              <input className="crm-field" value={content.form.labels?.contact || ""} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, contact: event.target.value } } })} />
            </Field>
            <Field label="เว็บไซต์ / Booking Engine">
              <input className="crm-field" value={content.form.labels?.website || ""} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, website: event.target.value } } })} />
            </Field>
            <Field label="เป้าหมาย">
              <input className="crm-field" value={content.form.labels?.goal || ""} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, goal: event.target.value } } })} />
            </Field>
            <Field label="ตลาดเป้าหมาย">
              <input className="crm-field" value={content.form.labels?.market || ""} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, market: event.target.value } } })} />
            </Field>
            <Field label="สถานะบัญชี Google Ads">
              <input className="crm-field" value={content.form.labels?.adsStatus || ""} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, adsStatus: event.target.value } } })} />
            </Field>
            <Field label="ความท้าทายปัจจุบัน">
              <input className="crm-field" value={content.form.labels?.challenge || ""} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, challenge: event.target.value } } })} />
            </Field>
            <Field label="ข้อความยินยอม">
              <textarea className="crm-area" rows={3} value={content.form.labels?.consent || ""} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, consent: event.target.value } } })} />
            </Field>
            <Field label="ลิงก์นโยบายความเป็นส่วนตัว">
              <input className="crm-field" value={content.form.labels?.privacy || ""} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, privacy: event.target.value } } })} />
            </Field>
            <p className="crm-contact-image-hint">รูปทีมแสดงได้เฉพาะสถานะ Approved หรือ Real ห้ามใช้ dummy หรือภาพ AI ของบุคคล ถ้ายังไม่มีรูป ให้คง What Happens Next</p>
            <VisualFields
              slot="team"
              fileName="teamImageFile"
              visual={
                content.form.visual ?? {
                  src: "",
                  altTh: "",
                  altEn: "",
                  status: "placeholder",
                  label: "Replace with verified Digital Marketing Team image",
                  caption: "",
                  containsGoogleBrand: false,
                  brandNote: "",
                }
              }
              hint="Dummy 1200 × 800 px, แสดงประมาณ 420 × 280 px, อัตราส่วน 3:2 — ป้าย Replace with verified Digital Marketing Team image ไม่ใช้บนหน้าสาธารณะ"
            />
          </section>
        ) : null}
        {tab === "faq" ? (
          <section className="crm-cms-panel">
            <p className="crm-contact-image-hint">คำถามและคำตอบต้องไม่ว่างเมื่อเผยแพร่</p>
            {content.faqs.map((item, index) => (
              <div key={item.id || index} className="crm-cs-metric">
                <div className="crm-cs-metric-head">
                  <h3>{item.q || `FAQ ${index + 1}`}</h3>
                  <div className="crm-cs-sticky-actions">
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, faqs: moveItem(content.faqs, index, -1) })}>
                      ขึ้น
                    </button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, faqs: moveItem(content.faqs, index, 1) })}>
                      ลง
                    </button>
                    <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, faqs: content.faqs.filter((_, i) => i !== index) })}>
                      ลบ
                    </button>
                  </div>
                </div>
                <Field label="คำถาม">
                  <input className="crm-field" value={item.q} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((row, i) => (i === index ? { ...row, q: event.target.value } : row)) })} />
                </Field>
                <Field label="คำตอบ">
                  <textarea className="crm-area" rows={4} value={item.a} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((row, i) => (i === index ? { ...row, a: event.target.value } : row)) })} />
                </Field>
              </div>
            ))}
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() => patchContent({ ...content, faqs: [...content.faqs, { id: newAdsItemId("faq"), q: "", a: "" }] })}
            >
              เพิ่มคำถาม
            </button>
          </section>
        ) : null}
        {tab === "seo" ? (
          <section className="crm-cms-panel">
            <Field label="ชื่อหน้าในระบบ">
              <input className="crm-field" name="title" value={meta.title} onChange={(event) => { setMeta({ ...meta, title: event.target.value }); markDirty(); }} />
            </Field>
            <Field label="SEO title">
              <input className="crm-field" name="seoTitle" value={meta.seoTitle} onChange={(event) => { setMeta({ ...meta, seoTitle: event.target.value }); markDirty(); }} />
            </Field>
            <Field label="Meta description">
              <textarea className="crm-area" name="metaDescription" rows={3} value={meta.metaDescription} onChange={(event) => { setMeta({ ...meta, metaDescription: event.target.value }); markDirty(); }} />
            </Field>
            <Field label="Excerpt">
              <textarea className="crm-area" name="excerpt" rows={2} value={meta.excerpt} onChange={(event) => { setMeta({ ...meta, excerpt: event.target.value }); markDirty(); }} />
            </Field>
            <VisualFields slot="social" fileName="ogImageFile" visual={content.seo.social} hint="1200 × 630 px · ภาพโซเชียล ไม่ใช่ภาพบัญชีโฆษณา" />
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
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby="ads-unpublish-title">
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">CMS</p>
                <h2 id="ads-unpublish-title">ยกเลิกเผยแพร่</h2>
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

function KpiFields({
  kpi,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  kpi: CmsAdsKpi;
  index: number;
  total: number;
  onChange: (kpi: CmsAdsKpi) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="crm-cs-metric">
      <div className="crm-cs-metric-head">
        <h3>{kpi.name || `KPI ${index + 1}`}</h3>
        <div className="crm-cs-sticky-actions">
          <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => onMove(-1)}>
            ขึ้น
          </button>
          <button type="button" className="crm-users-secondary" disabled={index === total - 1} onClick={() => onMove(1)}>
            ลง
          </button>
          <button type="button" className="crm-users-secondary" onClick={onRemove}>
            ลบ
          </button>
        </div>
      </div>
      <Field label="ชื่อตัวชี้วัด">
        <input className="crm-field" value={kpi.name} onChange={(event) => onChange({ ...kpi, name: event.target.value })} />
      </Field>
      <Field label="คำนิยาม">
        <input className="crm-field" value={kpi.definition} onChange={(event) => onChange({ ...kpi, definition: event.target.value })} />
      </Field>
      <Field label="หน่วย">
        <input className="crm-field" value={kpi.unit} onChange={(event) => onChange({ ...kpi, unit: event.target.value })} />
      </Field>
      <Field label="ช่วงเวลา" hint="ว่างไว้ถ้ายังไม่มีข้อมูลจริง">
        <input className="crm-field" value={kpi.period} onChange={(event) => onChange({ ...kpi, period: event.target.value })} />
      </Field>
      <Field label="เป้าหมายหรือเปรียบเทียบ">
        <input className="crm-field" value={kpi.target} onChange={(event) => onChange({ ...kpi, target: event.target.value })} />
      </Field>
      <Field label="ค่าที่แสดง" hint="ห้ามใส่ตัวเลขจำลอง ROAS อัตราแปลง ยอดจอง หรือรายได้">
        <input className="crm-field" value={kpi.value} onChange={(event) => onChange({ ...kpi, value: event.target.value })} />
      </Field>
      <Field label="แคมเปญหรือช่องทาง">
        <input className="crm-field" value={kpi.context || ""} onChange={(event) => onChange({ ...kpi, context: event.target.value })} />
      </Field>
      <Field label="Chart labels" hint="ช่วงเวลาในกราฟ คั่นด้วยจุลภาค ต้องมีข้อมูลอนุมัติ">
        <input className="crm-field" value={(kpi.labels || []).join(", ")} onChange={(event) => onChange({ ...kpi, labels: event.target.value.split(/[,|\n]/).map((item) => item.trim()).filter(Boolean) })} />
      </Field>
      <Field label="Chart values" hint="ตัวเลขจริงคั่นด้วยจุลภาค ห้ามใส่ตัวเลขจำลอง">
        <input className="crm-field" value={(kpi.values || []).join(", ")} onChange={(event) => onChange({ ...kpi, values: event.target.value.split(/[,|\n]/).map((item) => Number(item.trim())).filter((item) => Number.isFinite(item)) })} />
      </Field>
      <Field label="โทนกราฟ">
        <select className="crm-field" value={kpi.tone || "positive"} onChange={(event) => onChange({ ...kpi, tone: event.target.value as CmsAdsKpi["tone"] })}>
          <option value="positive">positive · #A2DC25</option>
          <option value="target">target · #EBE722</option>
          <option value="risk">risk · amber</option>
        </select>
      </Field>
      <Field label="สถานะข้อมูล">
        <select className="crm-field" value={kpi.dataStatus} onChange={(event) => onChange({ ...kpi, dataStatus: event.target.value as AdsKpiStatus })}>
          {ADS_CMS_KPI_STATUSES.map((item) => (
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
  card: CmsAdsRelatedCard;
  index: number;
  total: number;
  onChange: (card: CmsAdsRelatedCard) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="crm-cs-metric">
      <h3>{card.title || `การ์ด ${index + 1}`}</h3>
      <div className="crm-cs-metric-actions">
        <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => onMove(-1)}>
          ขึ้น
        </button>
        <button type="button" className="crm-users-secondary" disabled={index === total - 1} onClick={() => onMove(1)}>
          ลง
        </button>
        <button type="button" className="crm-users-secondary" onClick={onRemove}>
          ลบ
        </button>
      </div>
      <Field label="หมวด">
        <input className="crm-field" value={card.category} onChange={(event) => onChange({ ...card, category: event.target.value })} />
      </Field>
      <Field label="หัวข้อ">
        <input className="crm-field" value={card.title} onChange={(event) => onChange({ ...card, title: event.target.value })} />
      </Field>
      <Field label="ลิงก์" hint="ลิงก์หน้าจริง ห้ามเปิดใน popup">
        <input className="crm-field" value={card.href} onChange={(event) => onChange({ ...card, href: event.target.value })} />
      </Field>
      <Field label="คำอธิบายสั้น">
        <textarea className="crm-area" rows={2} value={card.description} onChange={(event) => onChange({ ...card, description: event.target.value })} />
      </Field>
      <Field label="วันที่เผยแพร่" hint="ใส่เฉพาะวันที่จริงจากบทความ ห้ามสร้างวันที่จำลอง">
        <input className="crm-field" value={card.publishedAt} onChange={(event) => onChange({ ...card, publishedAt: event.target.value })} />
      </Field>
      <Field label="วันที่อัปเดต">
        <input className="crm-field" value={card.updatedAt} onChange={(event) => onChange({ ...card, updatedAt: event.target.value })} />
      </Field>
      <Field label="ประเภทเนื้อหา">
        <input className="crm-field" value={card.contentType} onChange={(event) => onChange({ ...card, contentType: event.target.value })} />
      </Field>
      <Field label="เวลาอ่าน">
        <input className="crm-field" value={card.readingTime} onChange={(event) => onChange({ ...card, readingTime: event.target.value })} />
      </Field>
      <Field label="ปุ่ม">
        <input className="crm-field" value={card.cta} onChange={(event) => onChange({ ...card, cta: event.target.value })} />
      </Field>
      <label className="crm-cms-field">
        <span>การ์ดเด่น</span>
        <input type="checkbox" checked={card.featured} onChange={(event) => onChange({ ...card, featured: event.target.checked })} />
      </label>
    </div>
  );
}
