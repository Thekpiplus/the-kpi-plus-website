"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  META_CMS_KPI_STATUSES,
  META_CMS_VISUAL_STATUSES,
  metaCmsErrorMessage,
  newAdsItemId,
  validateMetaAdsCreativeRows,
  validateMetaAdsPage,
  type MetaCmsIntent,
  type MetaCmsSaveResult,
  type MetaEditorState,
  type CmsAdsKpi,
  type CmsMetaRelatedCard,
  type CmsMetaAudienceStat,
  type CmsMetaCreativeRow,
  type CmsAdsVisual,
  type CmsMetaAdsPage,
} from "@/lib/cms/meta-ads-page";
import {
  META_CREATIVE_FORMATS,
  META_CREATIVE_STATUSES,
  metaCreativeAssetKindFromSrc,
  type AdsKpiStatus,
  type AdsVisualStatus,
  type MetaCreativeFormat,
  type MetaCreativeStatus,
} from "@/lib/meta-ads";
import { MetaCreativePreview } from "@/components/meta-ads/MetaCreativePreview";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "visibility", label: "Audience" },
  { id: "readiness", label: "Readiness" },
  { id: "channels", label: "Objectives" },
  { id: "scenario", label: "Scenario" },
  { id: "workflow", label: "Workflow" },
  { id: "creative", label: "Creative" },
  { id: "checklists", label: "Checklists" },
  { id: "kpis", label: "KPIs" },
  { id: "related", label: "Related" },
  { id: "form", label: "Form" },
  { id: "faq", label: "FAQ" },
  { id: "seo", label: "SEO" },
  { id: "publish", label: "Publish" },
] as const;

type Tab = (typeof TABS)[number]["id"];
type VisualSlot = "hero" | "visibility" | "readiness" | "channels" | "scenario" | "workflow" | "kpis" | "related" | "team" | "social";

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

export function MetaAdsPageEditor({
  initial,
  notice,
  error,
  saveAction,
  updatedAt,
  initialTab,
  previewHref,
  publicHref,
}: {
  initial: MetaEditorState;
  notice?: string;
  error?: string;
  saveAction: (formData: FormData) => Promise<MetaCmsSaveResult>;
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
  const [content, setContent] = useState<CmsMetaAdsPage>(() => ({
    ...initial.content,
    creative: initial.content.creative ?? { title: "", body: "", rows: [] },
    scenario: initial.content.scenario ?? { title: "", visual: { src: "", altTh: "", altEn: "", status: "placeholder", label: "", caption: "", containsMetaBrand: false, brandNote: "" }, rows: [] },
    checklists: {
      tracking: initial.content.checklists?.tracking ?? { title: "", note: "", items: [] },
      events: initial.content.checklists?.events ?? { title: "", note: "", items: [] },
      landing: initial.content.checklists?.landing ?? { title: "", note: "", items: [] },
    },
    visibility: {
      ...initial.content.visibility,
      sourceLabel: initial.content.visibility.sourceLabel ?? "",
      sourceHref: initial.content.visibility.sourceHref ?? "",
      stats: initial.content.visibility.stats ?? [],
    },
  }));
  const [status, setStatus] = useState(error ? metaCmsErrorMessage(error) : "");
  const [ok, setOk] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<"unpublish" | null>(null);
  const [dirty, setDirty] = useState(false);
  const [assetPreviews, setAssetPreviews] = useState<Record<string, string>>(() =>
    Object.fromEntries((initial.content.creative?.rows || []).map((row) => [row.id, row.assetSrc])),
  );
  const [assetClears, setAssetClears] = useState<Record<string, boolean>>({});
  const [previews, setPreviews] = useState<Record<VisualSlot, string>>({
    hero: initial.content.hero.visual.src,
    visibility: initial.content.visibility.visual.src,
    readiness: initial.content.readiness.visual.src,
    channels: initial.content.channels.visual.src,
    scenario: initial.content.scenario?.visual.src ?? "",
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
    scenario: false,
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

  function patchContent(next: CmsMetaAdsPage) {
    setContent(next);
    markDirty();
  }

  function patchVisual(slot: VisualSlot, visual: CmsAdsVisual) {
    if (slot === "hero") patchContent({ ...content, hero: { ...content.hero, visual } });
    else if (slot === "visibility") patchContent({ ...content, visibility: { ...content.visibility, visual } });
    else if (slot === "readiness") patchContent({ ...content, readiness: { ...content.readiness, visual } });
    else if (slot === "channels") patchContent({ ...content, channels: { ...content.channels, visual } });
    else if (slot === "scenario") patchContent({ ...content, scenario: { ...content.scenario, visual } });
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
            {META_CMS_VISUAL_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <label className="crm-cms-field">
          <span>รูปมีโลโก้หรือแบรนด์ Meta / Instagram / Facebook</span>
          <input
            type="checkbox"
            checked={Boolean(visual.containsMetaBrand)}
            onChange={(event) => patchVisual(slot, { ...visual, containsMetaBrand: event.target.checked })}
          />
        </label>
        {visual.containsMetaBrand ? (
          <Field label="บันทึกการอนุญาตหรือการอนุมัติ" hint="จำเป็นเมื่อเผยแพร่รูปที่มีแบรนด์ Meta / Instagram / Facebook">
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

  function submit(intent: MetaCmsIntent) {
    const node = formRef.current;
    if (!node) return;
    const data = new FormData(node);
    data.set("intent", intent);
    data.set("contentJson", JSON.stringify(content));
    if (clears.hero) data.set("clearHeroImage", "1");
    if (clears.visibility) data.set("clearVisibilityImage", "1");
    if (clears.readiness) data.set("clearReadinessImage", "1");
    if (clears.channels) data.set("clearChannelImage", "1");
    if (clears.scenario) data.set("clearScenarioImage", "1");
    if (clears.workflow) data.set("clearWorkflowImage", "1");
    if (clears.kpis) data.set("clearKpiImage", "1");
    if (clears.related) data.set("clearRelatedImage", "1");
    if (clears.team) data.set("clearTeamImage", "1");
    if (clears.social) data.set("clearOgImage", "1");
    const pageError = validateMetaAdsPage(content, intent);
    if (pageError) {
      setOk("");
      setStatus(metaCmsErrorMessage(pageError));
      if (pageError === "required_fields" || pageError === "invalid_cta") setTab("hero");
      else if (pageError === "audience_incomplete") setTab("visibility");
      else if (pageError === "kpi_incomplete") setTab("kpis");
      else if (pageError === "empty_faq") setTab("faq");
      else if (pageError.startsWith("creative")) setTab("creative");
      else if (pageError === "brand_note" || pageError === "missing_alt" || pageError === "placeholder_status" || pageError === "placeholder_label" || pageError === "screenshot_approval") {
        setTab("hero");
      } else {
        setTab("publish");
      }
      return;
    }
    const creativeError = validateMetaAdsCreativeRows(content.creative?.rows || [], intent);
    if (creativeError) {
      setOk("");
      setStatus(metaCmsErrorMessage(creativeError));
      setTab("creative");
      return;
    }
    Object.entries(assetClears).forEach(([id, clear]) => {
      if (clear) data.set(`clearCreativeAsset-${id}`, "1");
    });
    startTransition(async () => {
      setOk("");
      setStatus("");
      const result = await saveAction(data);
      if (!result.ok) {
        setStatus(metaCmsErrorMessage(result.error));
        return;
      }
      if (intent === "publish") setMeta((current) => ({ ...current, status: "published" }));
      if (intent === "draft" || intent === "unpublish") setMeta((current) => ({ ...current, status: "draft" }));
      setOk(intent === "preview" ? "บันทึกแล้ว — เปิดตัวอย่างในแท็บนี้" : "บันทึกแล้ว");
      setDirty(false);
      setAssetClears({});
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
    const intent = (submitter?.value as MetaCmsIntent) || "save";
    if (intent === "unpublish") {
      setDialog("unpublish");
      return;
    }
    submit(intent);
  }

  function cancelEdits() {
    const next = {
      ...initial.content,
      creative: initial.content.creative ?? { title: "", body: "", rows: [] },
    };
    setContent(next);
    setMeta({
      title: initial.title,
      seoTitle: initial.seoTitle,
      metaDescription: initial.metaDescription,
      excerpt: initial.excerpt,
      locale: initial.locale,
      status: initial.status,
    });
    setPreviews({
      hero: initial.content.hero.visual.src,
      visibility: initial.content.visibility.visual.src,
      readiness: initial.content.readiness.visual.src,
      channels: initial.content.channels.visual.src,
      scenario: initial.content.scenario?.visual.src ?? "",
      workflow: initial.content.workflow.visual.src,
      kpis: initial.content.measure.visual.src,
      related: initial.content.related.visual.src,
      team: initial.content.form.visual?.src ?? "",
      social: initial.content.seo.social.src,
    });
    setClears({
      hero: false,
      visibility: false,
      readiness: false,
      channels: false,
      scenario: false,
      workflow: false,
      kpis: false,
      related: false,
      team: false,
      social: false,
    });
    setAssetPreviews(Object.fromEntries((next.creative.rows || []).map((row) => [row.id, row.assetSrc])));
    setAssetClears({});
    setDirty(false);
    setOk("");
    setStatus("");
    formRef.current?.reset();
  }

  const saveButtons = (
    <>
      <button className="kpi-button" type="submit" name="intent" value="save" disabled={pending}>
        {pending ? "กำลังบันทึก…" : "บันทึก"}
      </button>
      <button className="crm-users-secondary" type="button" onClick={cancelEdits} disabled={pending || !dirty}>
        ยกเลิก
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
      <nav className="crm-cms-tabs" role="tablist" aria-label="ส่วนของหน้า Meta Ads">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            id={`meta-ads-cms-tab-${item.id}`}
            role="tab"
            aria-selected={tab === item.id}
            aria-controls="meta-ads-cms-panel"
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
        <div id="meta-ads-cms-panel" role="tabpanel" aria-labelledby={`meta-ads-cms-tab-${tab}`}>
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
            <p className="crm-contact-image-hint">ใช้ Audience Persona Map, Interest / Market Segment Map, Creative Performance Comparison, รายงานแคมเปญที่ปิดข้อมูล หรือ Ad View to Landing Page funnel ห้ามใช้ภาพชุดเดียวกับ Hero และห้ามใช้ภาพไลฟ์สไตล์ที่ไม่มีบริบทกลุ่มลูกค้าหรือแคมเปญ</p>
            <Field label="หัวข้อ">
              <input className="crm-field" value={content.visibility.title} onChange={(event) => patchContent({ ...content, visibility: { ...content.visibility, title: event.target.value } })} />
            </Field>
            <Field label="คำอธิบาย">
              <textarea className="crm-area" rows={4} value={content.visibility.body || ""} onChange={(event) => patchContent({ ...content, visibility: { ...content.visibility, body: event.target.value } })} />
            </Field>
            <Field label="หมายเหตุท้ายส่วน">
              <textarea className="crm-area" rows={3} value={content.visibility.note || ""} onChange={(event) => patchContent({ ...content, visibility: { ...content.visibility, note: event.target.value } })} />
            </Field>
            <Field label="แหล่งที่มาของตัวเลขกลุ่มเป้าหมาย" hint="จำเป็นเมื่อเผยแพร่ตัวเลขประมาณการ">
              <input className="crm-field" value={content.visibility.sourceLabel || ""} onChange={(event) => patchContent({ ...content, visibility: { ...content.visibility, sourceLabel: event.target.value } })} />
            </Field>
            <Field label="ลิงก์แหล่งที่มา">
              <input className="crm-field" value={content.visibility.sourceHref || ""} onChange={(event) => patchContent({ ...content, visibility: { ...content.visibility, sourceHref: event.target.value } })} />
            </Field>
            {(content.visibility.stats || []).map((stat, index) => (
              <AudienceStatFields
                key={stat.id}
                stat={stat}
                index={index}
                total={content.visibility.stats.length}
                onMove={(direction) =>
                  patchContent({
                    ...content,
                    visibility: { ...content.visibility, stats: moveItem(content.visibility.stats, index, direction) },
                  })
                }
                onRemove={() =>
                  patchContent({
                    ...content,
                    visibility: { ...content.visibility, stats: content.visibility.stats.filter((_, i) => i !== index) },
                  })
                }
                onChange={(next) =>
                  patchContent({
                    ...content,
                    visibility: {
                      ...content.visibility,
                      stats: content.visibility.stats.map((row, i) => (i === index ? next : row)),
                    },
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
                  visibility: {
                    ...content.visibility,
                    stats: [
                      ...(content.visibility.stats || []),
                      {
                        id: newAdsItemId("audience"),
                        platform: "",
                        value: "",
                        kind: "Platform audience estimate",
                        period: "",
                        market: "",
                        definition: "",
                        status: "",
                        dataStatus: "sample",
                      },
                    ],
                  },
                })
              }
            >
              เพิ่มตัวเลขกลุ่มเป้าหมาย
            </button>
            <VisualFields slot="visibility" fileName="visibilityImageFile" visual={content.visibility.visual} hint="1200 × 800 px · ตัวอย่าง Audience Insight และ Creative Performance · ต่างจาก Hero" />
          </section>
        ) : null}
        {tab === "readiness" ? (
          <section className="crm-cms-panel">
            <Field label="หัวข้อ Meta Ads Readiness Framework">
              <input className="crm-field" value={content.readiness.title} onChange={(event) => patchContent({ ...content, readiness: { ...content.readiness, title: event.target.value } })} />
            </Field>
            <Field label="คำอธิบาย">
              <textarea className="crm-area" rows={3} value={content.readiness.body} onChange={(event) => patchContent({ ...content, readiness: { ...content.readiness, body: event.target.value } })} />
            </Field>
            {content.readiness.items.map((item, index) => (
              <div key={item.id} className="crm-cs-metric">
                <div className="crm-cs-metric-head">
                  <h3>{item.area || item.check || `ด้าน ${index + 1}`}</h3>
                  <RowActions
                    name={item.area || item.check || `ด้าน ${index + 1}`}
                    disableUp={index === 0}
                    disableDown={index === content.readiness.items.length - 1}
                    onUp={() => patchContent({ ...content, readiness: { ...content.readiness, items: withOrder(moveItem(content.readiness.items, index, -1)) } })}
                    onDown={() => patchContent({ ...content, readiness: { ...content.readiness, items: withOrder(moveItem(content.readiness.items, index, 1)) } })}
                    onRemove={() => patchContent({ ...content, readiness: { ...content.readiness, items: withOrder(content.readiness.items.filter((_, i) => i !== index)) } })}
                  />
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
            <VisualFields slot="readiness" fileName="readinessImageFile" visual={content.readiness.visual} hint="1600 × 900 px · Meta Ads Readiness Framework — Sample · หน้าสาธารณะใช้ HTML/CSS เป็นค่าเริ่มต้น ห้ามใช้ภาพไลฟ์สไตล์" />
          </section>
        ) : null}
        {tab === "channels" ? (
          <section className="crm-cms-panel">
            <Field label="หัวข้อ Objective-to-Booking Map">
              <input className="crm-field" value={content.channels.title} onChange={(event) => patchContent({ ...content, channels: { ...content.channels, title: event.target.value } })} />
            </Field>
            {content.channels.rows.map((row, index) => (
              <div key={row.id} className="crm-cs-metric">
                <div className="crm-cs-metric-head">
                  <h3>{row.channel || `Objective ${index + 1}`}</h3>
                  <RowActions
                    name={row.channel || `Objective ${index + 1}`}
                    disableUp={index === 0}
                    disableDown={index === content.channels.rows.length - 1}
                    onUp={() => patchContent({ ...content, channels: { ...content.channels, rows: withOrder(moveItem(content.channels.rows, index, -1)) } })}
                    onDown={() => patchContent({ ...content, channels: { ...content.channels, rows: withOrder(moveItem(content.channels.rows, index, 1)) } })}
                    onRemove={() => patchContent({ ...content, channels: { ...content.channels, rows: withOrder(content.channels.rows.filter((_, i) => i !== index)) } })}
                  />
                </div>
                <Field label="Objective">
                  <input className="crm-field" value={row.channel} onChange={(event) => patchContent({ ...content, channels: { ...content.channels, rows: content.channels.rows.map((item, i) => (i === index ? { ...item, channel: event.target.value } : item)) } })} />
                </Field>
                <Field label="Example action">
                  <input className="crm-field" value={row.useCase} onChange={(event) => patchContent({ ...content, channels: { ...content.channels, rows: content.channels.rows.map((item, i) => (i === index ? { ...item, useCase: event.target.value, role: event.target.value } : item)) } })} />
                </Field>
                <Field label="Destination page/action">
                  <input className="crm-field" value={row.input} onChange={(event) => patchContent({ ...content, channels: { ...content.channels, rows: content.channels.rows.map((item, i) => (i === index ? { ...item, input: event.target.value, need: event.target.value, control: event.target.value } : item)) } })} />
                </Field>
                <Field label="KPI" hint="ชื่อตัวชี้วัด คั่นด้วยจุลภาค ไม่ใส่ตัวเลขผลแคมเปญ">
                  <input className="crm-field" value={row.kpi} onChange={(event) => patchContent({ ...content, channels: { ...content.channels, rows: content.channels.rows.map((item, i) => (i === index ? { ...item, kpi: event.target.value } : item)) } })} />
                </Field>
                <Field label="Expected output">
                  <input className="crm-field" value={row.output} onChange={(event) => patchContent({ ...content, channels: { ...content.channels, rows: content.channels.rows.map((item, i) => (i === index ? { ...item, output: event.target.value } : item)) } })} />
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
              เพิ่ม Objective
            </button>
            <VisualFields slot="channels" fileName="channelImageFile" visual={content.channels.visual} hint="1600 × 900 px · Meta Ads Objective to Booking Map — Sample · หน้าสาธารณะใช้ HTML/CSS เป็นค่าเริ่มต้น ห้ามใช้ภาพไลฟ์สไตล์ Hero Audience หรือ Framework" />
          </section>
        ) : null}
        {tab === "scenario" ? (
          <section className="crm-cms-panel">
            <p className="crm-contact-image-hint">Hotel Scenario Matrix เริ่มจากสถานการณ์ของโรงแรม ไม่ใช่ผลแคมเปญ ห้ามใช้ภาพ Hero Audience หรือ Objective</p>
            <Field label="หัวข้อ Hotel Scenario Matrix">
              <input className="crm-field" value={content.scenario?.title || ""} onChange={(event) => patchContent({ ...content, scenario: { ...content.scenario, title: event.target.value } })} />
            </Field>
            {(content.scenario?.rows || []).map((row, index) => (
              <div key={row.id} className="crm-cs-metric">
                <div className="crm-cs-metric-head">
                  <h3>{row.situation || `สถานการณ์ ${index + 1}`}</h3>
                  <RowActions
                    name={row.situation || `สถานการณ์ ${index + 1}`}
                    disableUp={index === 0}
                    disableDown={index === (content.scenario?.rows || []).length - 1}
                    onUp={() => patchContent({ ...content, scenario: { ...content.scenario, rows: withOrder(moveItem(content.scenario.rows, index, -1)) } })}
                    onDown={() => patchContent({ ...content, scenario: { ...content.scenario, rows: withOrder(moveItem(content.scenario.rows, index, 1)) } })}
                    onRemove={() => patchContent({ ...content, scenario: { ...content.scenario, rows: withOrder(content.scenario.rows.filter((_, i) => i !== index)) } })}
                  />
                </div>
                <Field label="สถานการณ์">
                  <input className="crm-field" value={row.situation} onChange={(event) => patchContent({ ...content, scenario: { ...content.scenario, rows: content.scenario.rows.map((item, i) => (i === index ? { ...item, situation: event.target.value } : item)) } })} />
                </Field>
                <Field label="คำถามวินิจฉัยแรก">
                  <input className="crm-field" value={row.question} onChange={(event) => patchContent({ ...content, scenario: { ...content.scenario, rows: content.scenario.rows.map((item, i) => (i === index ? { ...item, question: event.target.value } : item)) } })} />
                </Field>
                <Field label="สิ่งที่ควรเริ่ม">
                  <input className="crm-field" value={row.action} onChange={(event) => patchContent({ ...content, scenario: { ...content.scenario, rows: content.scenario.rows.map((item, i) => (i === index ? { ...item, action: event.target.value } : item)) } })} />
                </Field>
                <Field label="สิ่งที่ได้">
                  <input className="crm-field" value={row.output} onChange={(event) => patchContent({ ...content, scenario: { ...content.scenario, rows: content.scenario.rows.map((item, i) => (i === index ? { ...item, output: event.target.value } : item)) } })} />
                </Field>
                <Field label="การตัดสินใจขั้นถัดไป">
                  <textarea className="crm-area" rows={2} value={row.next} onChange={(event) => patchContent({ ...content, scenario: { ...content.scenario, rows: content.scenario.rows.map((item, i) => (i === index ? { ...item, next: event.target.value } : item)) } })} />
                </Field>
              </div>
            ))}
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  scenario: {
                    ...content.scenario,
                    rows: withOrder([
                      ...(content.scenario?.rows || []),
                      { id: newAdsItemId("scenario"), situation: "", question: "", action: "", output: "", next: "", order: (content.scenario?.rows.length || 0) + 1 },
                    ]),
                  },
                })
              }
            >
              เพิ่มสถานการณ์
            </button>
            <VisualFields slot="scenario" fileName="scenarioImageFile" visual={content.scenario.visual} hint="1600 × 900 px · แสดงประมาณ 720 × 405 px · 16:9 · Hotel Meta Ads Scenario Matrix — Sample · หน้าสาธารณะใช้ HTML/CSS เป็นค่าเริ่มต้น" />
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
                  <RowActions
                    name={step.title || `ขั้น ${index + 1}`}
                    disableUp={index === 0}
                    disableDown={index === content.workflow.steps.length - 1}
                    onUp={() => patchContent({ ...content, workflow: { ...content.workflow, steps: withOrder(moveItem(content.workflow.steps, index, -1)) } })}
                    onDown={() => patchContent({ ...content, workflow: { ...content.workflow, steps: withOrder(moveItem(content.workflow.steps, index, 1)) } })}
                    onRemove={() => patchContent({ ...content, workflow: { ...content.workflow, steps: withOrder(content.workflow.steps.filter((_, i) => i !== index)) } })}
                  />
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
            <VisualFields slot="workflow" fileName="workflowImageFile" visual={content.workflow.visual} hint="1600 × 900 px · แสดงประมาณ 640 × 360 px · 16:9 · Meta Ads Campaign Workflow — Sample process · หน้าสาธารณะใช้ HTML/CSS เป็นค่าเริ่มต้น ห้ามใช้ภาพประชุมทั่วไป" />
          </section>
        ) : null}
        {tab === "creative" ? (
          <section className="crm-cms-panel">
            <p className="crm-contact-image-hint">
              Creative Matrix เชื่อม Audience, Message, Format, Destination และ KPI ใช้เป็นกรอบวางแผน ไม่ใส่ตัวเลขผลแคมเปญ แถวละหนึ่งกรอบตัวอย่าง — ห้ามสร้างรูป AI ใหม่ทุกแถว แนบรูปหรือวิดีโอจริงได้ภายหลังโดยไม่พังเลย์เอาต์
            </p>
            <Field label="หัวข้อ Creative Matrix">
              <input
                className="crm-field"
                value={content.creative?.title || ""}
                onChange={(event) =>
                  patchContent({
                    ...content,
                    creative: { ...(content.creative || { title: "", body: "", rows: [] }), title: event.target.value },
                  })
                }
              />
            </Field>
            <Field label="คำอธิบาย">
              <textarea
                className="crm-area"
                rows={3}
                value={content.creative?.body || ""}
                onChange={(event) =>
                  patchContent({
                    ...content,
                    creative: { ...(content.creative || { title: "", body: "", rows: [] }), body: event.target.value },
                  })
                }
              />
            </Field>
            {(content.creative?.rows || []).map((row, index) => (
              <CreativeRowFields
                key={row.id}
                row={row}
                index={index}
                total={content.creative.rows.length}
                previewSrc={assetClears[row.id] ? "" : assetPreviews[row.id] || row.assetSrc}
                onChange={(next) =>
                  patchContent({
                    ...content,
                    creative: {
                      ...content.creative,
                      rows: withOrder(content.creative.rows.map((item, i) => (i === index ? next : item))),
                    },
                  })
                }
                onMove={(direction) =>
                  patchContent({
                    ...content,
                    creative: { ...content.creative, rows: withOrder(moveItem(content.creative.rows, index, direction)) },
                  })
                }
                onRemove={() =>
                  patchContent({
                    ...content,
                    creative: { ...content.creative, rows: withOrder(content.creative.rows.filter((_, i) => i !== index)) },
                  })
                }
                onAsset={(file) => {
                  if (!file) return;
                  setAssetPreviews((current) => ({ ...current, [row.id]: URL.createObjectURL(file) }));
                  setAssetClears((current) => ({ ...current, [row.id]: false }));
                  markDirty();
                }}
                onClearAsset={() => {
                  setAssetClears((current) => ({ ...current, [row.id]: true }));
                  setAssetPreviews((current) => ({ ...current, [row.id]: "" }));
                  patchContent({
                    ...content,
                    creative: {
                      ...content.creative,
                      rows: content.creative.rows.map((item, i) =>
                        i === index ? { ...item, assetSrc: "", assetKind: "none" } : item,
                      ),
                    },
                  });
                }}
              />
            ))}
            <button
              type="button"
              className="crm-users-secondary"
              onClick={() =>
                patchContent({
                  ...content,
                  creative: {
                    title: content.creative?.title || "",
                    body: content.creative?.body || "",
                    rows: withOrder([
                      ...(content.creative?.rows || []),
                      {
                        id: newAdsItemId("creative"),
                        audience: "",
                        market: "",
                        hook: "",
                        offer: "",
                        format: "image",
                        formatLabel: "",
                        landing: "",
                        kpi: "",
                        status: "draft",
                        assetSrc: "",
                        assetKind: "none",
                        assetAlt: "",
                        order: (content.creative?.rows.length || 0) + 1,
                      },
                    ]),
                  },
                })
              }
            >
              เพิ่มแถวครีเอทีฟ
            </button>
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
            <h3>Supported events</h3>
            <Field label="หัวข้อ">
              <input
                className="crm-field"
                value={content.checklists?.events?.title || ""}
                onChange={(event) =>
                  patchContent({
                    ...content,
                    checklists: {
                      ...content.checklists,
                      events: { ...(content.checklists.events || { title: "", note: "", items: [] }), title: event.target.value },
                    },
                  })
                }
              />
            </Field>
            <Field label="คำอธิบาย">
              <textarea
                className="crm-area"
                rows={3}
                value={content.checklists?.events?.note || ""}
                onChange={(event) =>
                  patchContent({
                    ...content,
                    checklists: {
                      ...content.checklists,
                      events: { ...(content.checklists.events || { title: "", note: "", items: [] }), note: event.target.value },
                    },
                  })
                }
              />
            </Field>
            <Field label="อีเวนต์ที่รองรับ" hint="หนึ่งบรรทัดต่ออีเวนต์ ใช้ได้เฉพาะที่โรงแรมอนุญาต">
              <textarea
                className="crm-area"
                rows={6}
                value={(content.checklists?.events?.items || []).join("\n")}
                onChange={(event) =>
                  patchContent({
                    ...content,
                    checklists: {
                      ...content.checklists,
                      events: {
                        ...(content.checklists.events || { title: "", note: "", items: [] }),
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
            <p className="crm-contact-image-hint">แยก Platform metrics กับ Business metrics หน้าสาธารณะแสดงตัวเลขเมื่อ Approved, Anonymised หรือ Sample ที่ติดป้าย Reach และ Engagement ไม่ใช่ผลรายได้ ใช้ SVG สำหรับกราฟ ห้ามใช้ภาพ AI ที่ใส่ตัวเลข</p>
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
                        group: "platform",
                        objective: "",
                        market: "",
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
            <VisualFields slot="kpis" fileName="kpiImageFile" visual={content.measure.visual} hint="1600 × 900 px · แสดงประมาณ 720 × 405 px · 16:9 · Meta Ads Performance KPI · Sample data · หน้าสาธารณะใช้ SVG/HTML เป็นค่าเริ่มต้น ห้ามใช้ภาพ AI ที่ใส่ตัวเลข" />
          </section>
        ) : null}
        {tab === "related" ? (
          <section className="crm-cms-panel">
            <p className="crm-contact-image-hint">หน้าสาธารณะแสดงการ์ดเนื้อหาที่เกี่ยวข้องจากลิงก์จริง รูปเด่น 1200 × 800 px แสดงประมาณ 520 × 347 px อัตราส่วน 3:2 ป้าย Meta Ads / Hotel Marketing Content ห้ามใช้รูป Hero หรือ Audience ห้ามสร้างผู้เขียน วันที่ หรือผลแคมเปญจำลอง ห้ามเปิดเนื้อหาใน popup</p>
            <Field label="หัวข้อ Related Content">
              <input className="crm-field" value={content.related.title} onChange={(event) => patchContent({ ...content, related: { ...content.related, title: event.target.value } })} />
            </Field>
            <VisualFields slot="related" fileName="relatedImageFile" visual={content.related.visual} hint="1200 × 800 px · แสดงประมาณ 520 × 347 px · 3:2 · Meta Ads / Hotel Marketing Content · หน้าสาธารณะใช้ HTML/CSS เป็นค่าเริ่มต้น ห้ามใช้ภาพ Hero Audience หรือผลแคมเปญ" />
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
            <Field label="สถานะบัญชี Meta Ads">
              <input className="crm-field" value={content.form.labels?.adsStatus || ""} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, adsStatus: event.target.value } } })} />
            </Field>
            <Field label="สถานะ Pixel / Conversion Tracking">
              <input className="crm-field" value={content.form.labels?.trackingStatus || ""} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, trackingStatus: event.target.value } } })} />
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
                  containsMetaBrand: false,
                  brandNote: "",
                }
              }
              hint="Dummy 1200 × 800 px, แสดงประมาณ 420 × 280 px, อัตราส่วน 3:2 — ป้าย Replace with verified Digital Marketing Team image ไม่ใช้บนหน้าสาธารณะ"
            />
          </section>
        ) : null}
        {tab === "faq" ? (
          <section className="crm-cms-panel">
            <p className="crm-contact-image-hint">คำถามและคำตอบต้องไม่ว่างเมื่อเผยแพร่ ใช้คำถามชุด Meta Ads ทั้ง 11 ข้อ และห้ามระบุ ROAS, Conversion Rate, reach หรือระยะเวลาที่จะเห็นผลหากยังไม่ได้รับอนุมัติ</p>
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

function AudienceStatFields({
  stat,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  stat: CmsMetaAudienceStat;
  index: number;
  total: number;
  onChange: (stat: CmsMetaAudienceStat) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="crm-cs-metric">
      <div className="crm-cs-metric-head">
        <h3>{stat.platform || `Audience ${index + 1}`}</h3>
        <RowActions
          name={stat.platform || `Audience ${index + 1}`}
          disableUp={index === 0}
          disableDown={index === total - 1}
          onUp={() => onMove(-1)}
          onDown={() => onMove(1)}
          onRemove={onRemove}
        />
      </div>
      <Field label="แพลตฟอร์ม">
        <input className="crm-field" value={stat.platform} onChange={(event) => onChange({ ...stat, platform: event.target.value })} />
      </Field>
      <Field label="ค่าประมาณการ">
        <input className="crm-field" value={stat.value} onChange={(event) => onChange({ ...stat, value: event.target.value })} />
      </Field>
      <Field label="ชนิดตัวเลข" hint="เช่น Platform audience estimate — ไม่ใช่ผลแคมเปญโรงแรม">
        <input className="crm-field" value={stat.kind} onChange={(event) => onChange({ ...stat, kind: event.target.value })} />
      </Field>
      <Field label="ช่วงเวลา">
        <input className="crm-field" value={stat.period} onChange={(event) => onChange({ ...stat, period: event.target.value })} />
      </Field>
      <Field label="ตลาด / ประเทศ">
        <input className="crm-field" value={stat.market} onChange={(event) => onChange({ ...stat, market: event.target.value })} />
      </Field>
      <Field label="คำนิยามกลุ่ม">
        <textarea className="crm-area" rows={2} value={stat.definition} onChange={(event) => onChange({ ...stat, definition: event.target.value })} />
      </Field>
      <Field label="คำอธิบายสถานะข้อมูล">
        <input className="crm-field" value={stat.status} onChange={(event) => onChange({ ...stat, status: event.target.value })} />
      </Field>
      <Field label="สถานะข้อมูล" hint="Sample ต้องติดป้ายตัวอย่างข้อมูลบนหน้าสาธารณะ">
        <select className="crm-field" value={stat.dataStatus} onChange={(event) => onChange({ ...stat, dataStatus: event.target.value as AdsKpiStatus })}>
          {META_CMS_KPI_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
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
        <RowActions
          name={kpi.name || `KPI ${index + 1}`}
          disableUp={index === 0}
          disableDown={index === total - 1}
          onUp={() => onMove(-1)}
          onDown={() => onMove(1)}
          onRemove={onRemove}
        />
      </div>
      <Field label="ชื่อตัวชี้วัด">
        <input className="crm-field" value={kpi.name} onChange={(event) => onChange({ ...kpi, name: event.target.value })} />
      </Field>
      <Field label="กลุ่ม" hint="Platform metrics หรือ Business metrics">
        <select
          className="crm-field"
          value={kpi.group || "platform"}
          onChange={(event) => onChange({ ...kpi, group: event.target.value as CmsAdsKpi["group"] })}
        >
          <option value="platform">platform</option>
          <option value="business">business</option>
        </select>
      </Field>
      <Field label="วัตถุประสงค์แคมเปญ">
        <input
          className="crm-field"
          value={kpi.objective || kpi.context}
          onChange={(event) => onChange({ ...kpi, objective: event.target.value, context: event.target.value })}
        />
      </Field>
      <Field label="ตลาด / กลุ่มลูกค้า">
        <input className="crm-field" value={kpi.market || ""} onChange={(event) => onChange({ ...kpi, market: event.target.value })} />
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
      <Field label="แคมเปญหรือช่องทาง" hint="ใช้เมื่อต้องการบันทึกเพิ่มจากวัตถุประสงค์">
        <input className="crm-field" value={kpi.context || ""} onChange={(event) => onChange({ ...kpi, context: event.target.value, objective: kpi.objective || event.target.value })} />
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
          {META_CMS_KPI_STATUSES.map((item) => (
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
  card: CmsMetaRelatedCard;
  index: number;
  total: number;
  onChange: (card: CmsMetaRelatedCard) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="crm-cs-metric">
      <h3>{card.title || `การ์ด ${index + 1}`}</h3>
      <RowActions
        name={card.title || `การ์ด ${index + 1}`}
        disableUp={index === 0}
        disableDown={index === total - 1}
        onUp={() => onMove(-1)}
        onDown={() => onMove(1)}
        onRemove={onRemove}
      />
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

function CreativeRowFields({
  row,
  index,
  total,
  previewSrc,
  onChange,
  onMove,
  onRemove,
  onAsset,
  onClearAsset,
}: {
  row: CmsMetaCreativeRow;
  index: number;
  total: number;
  previewSrc: string;
  onChange: (row: CmsMetaCreativeRow) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  onAsset: (file: File) => void;
  onClearAsset: () => void;
}) {
  const started = [row.audience, row.market, row.hook, row.offer, row.landing, row.kpi].some((item) => item.trim());
  const errorCode = started ? validateMetaAdsCreativeRows([row], "save") : null;
  const error = errorCode ? metaCmsErrorMessage(errorCode) : "";
  return (
    <div className="crm-cs-metric">
      <div className="crm-cs-metric-head">
        <h3>{row.audience || `Creative ${index + 1}`}</h3>
        <RowActions
          name={row.audience || `Creative ${index + 1}`}
          disableUp={index === 0}
          disableDown={index === total - 1}
          onUp={() => onMove(-1)}
          onDown={() => onMove(1)}
          onRemove={onRemove}
        />
      </div>
      {error ? (
        <p className="crm-cs-save-state is-error" role="alert">
          {error}
        </p>
      ) : started ? (
        <p className="crm-cs-save-state is-ok" role="status">
          แถวครบถ้วน พร้อมบันทึก
        </p>
      ) : null}
      <Field label="กลุ่มลูกค้า (Audience segment)">
        <input className="crm-field" value={row.audience} onChange={(event) => onChange({ ...row, audience: event.target.value })} />
      </Field>
      <Field label="ตลาด / ภาษา">
        <input className="crm-field" value={row.market} onChange={(event) => onChange({ ...row, market: event.target.value })} />
      </Field>
      <Field label="Creative hook">
        <input className="crm-field" value={row.hook} onChange={(event) => onChange({ ...row, hook: event.target.value })} />
      </Field>
      <Field label="ข้อเสนอหรือข้อความ">
        <input className="crm-field" value={row.offer} onChange={(event) => onChange({ ...row, offer: event.target.value })} />
      </Field>
      <Field label="รูปแบบ" hint="image, video, carousel, story หรือ reels">
        <select
          className="crm-field"
          value={row.format}
          onChange={(event) => onChange({ ...row, format: event.target.value as MetaCreativeFormat, formatLabel: row.formatLabel })}
        >
          {META_CREATIVE_FORMATS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Field>
      <Field label="ป้ายรูปแบบ" hint="เช่น Short Video ถ้าต่างจากค่ามาตรฐาน">
        <input className="crm-field" value={row.formatLabel} onChange={(event) => onChange({ ...row, formatLabel: event.target.value })} />
      </Field>
      <Field label="หน้าปลายทาง (Landing page)">
        <input className="crm-field" value={row.landing} onChange={(event) => onChange({ ...row, landing: event.target.value })} />
      </Field>
      <Field label="Primary KPI" hint="ชื่อตัวชี้วัด คั่นด้วย / หรือจุลภาค ห้ามใส่ตัวเลขผลแคมเปญ">
        <input className="crm-field" value={row.kpi} onChange={(event) => onChange({ ...row, kpi: event.target.value })} />
      </Field>
      <Field label="สถานะ" hint="Draft / Review / Approved / Active / Archived">
        <select className="crm-field" value={row.status} onChange={(event) => onChange({ ...row, status: event.target.value as MetaCreativeStatus })}>
          {META_CREATIVE_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Field>
      <Field label="คำอธิบายสินทรัพย์" hint="จำเป็นเมื่อมีรูปหรือวิดีโอและจะเผยแพร่">
        <input className="crm-field" value={row.assetAlt} onChange={(event) => onChange({ ...row, assetAlt: event.target.value })} />
      </Field>
      <Field label="แนบรูปหรือวิดีโอ" hint="JPG PNG WEBP MP4 หรือ WEBM · กรอบตัวอย่างคงที่ แนบทีหลังได้โดยไม่พังเลย์เอาต์">
        <input
          className="crm-field"
          type="file"
          name={`creativeAssetFile-${row.id}`}
          accept=".jpg,.jpeg,.png,.webp,.mp4,.webm"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const kind = metaCreativeAssetKindFromSrc(file.name);
            onChange({ ...row, assetKind: kind === "none" ? "image" : kind });
            onAsset(file);
          }}
        />
      </Field>
      <MetaCreativePreview
        format={row.format}
        formatLabel={row.formatLabel || row.format}
        src={previewSrc}
        kind={row.assetKind}
        alt={row.assetAlt || row.audience}
      />
      {previewSrc ? (
        <button type="button" className="crm-users-secondary" onClick={onClearAsset}>
          ลบสินทรัพย์
        </button>
      ) : null}
    </div>
  );
}
