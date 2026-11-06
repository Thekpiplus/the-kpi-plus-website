"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  blankHotelTrainingAssessItem,
  blankHotelTrainingFollowItem,
  blankHotelTrainingGalleryItem,
  blankHotelTrainingJourneyStep,
  blankHotelTrainingMatrixRow,
  blankHotelTrainingOutcomeItem,
  blankHotelTrainingProgram,
  blankHotelTrainingRelatedCard,
  HOTEL_TRAINING_CONSENT_STATUSES,
  HOTEL_TRAINING_PROGRAM_FORMAT_IDS,
  HOTEL_TRAINING_REVIEW_STATUSES,
  HOTEL_TRAINING_VISUAL_STATUSES,
  hotelTrainingCmsErrorMessage,
  hotelTrainingCmsNotice,
  newHotelTrainingItemId,
  type CmsHotelTrainingGalleryItem,
  type CmsHotelTrainingPage,
  type CmsHotelTrainingVisual,
  type HotelTrainingCmsIntent,
  type HotelTrainingCmsSaveResult,
  type HotelTrainingEditorState,
  type HotelTrainingVisualStatus,
} from "@/lib/cms/hotel-training-page";

const LOCALE_OPTIONS = [
  { id: "th", label: "ไทย" },
  { id: "en", label: "English" },
  { id: "ru", label: "Русский" },
  { id: "zh", label: "繁體中文" },
] as const;

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "needs", label: "Needs" },
  { id: "journey", label: "Journey" },
  { id: "programs", label: "Programs" },
  { id: "assess", label: "Assess" },
  { id: "gallery", label: "Gallery" },
  { id: "matrix", label: "Matrix" },
  { id: "trainer", label: "Trainer" },
  { id: "outcomes", label: "Outcomes" },
  { id: "follow", label: "Follow-up" },
  { id: "related", label: "Related" },
  { id: "form", label: "Contact" },
  { id: "faq", label: "FAQ" },
  { id: "seo", label: "SEO" },
  { id: "publish", label: "Publish" },
] as const;

type Tab = (typeof TABS)[number]["id"];
type VisualSlot = "hero" | "needs" | "social";

const VISUAL_FILE_NAMES: Record<VisualSlot, string> = {
  hero: "heroImageFile",
  needs: "needsImageFile",
  social: "ogImageFile",
};

const CLEAR_FIELD_NAMES: Record<VisualSlot, string> = {
  hero: "clearHeroImage",
  needs: "clearNeedsImage",
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

function listActions(index: number, total: number, onUp: () => void, onDown: () => void, onRemove: () => void, disableRemove = false) {
  return (
    <div className="crm-cs-metric-actions">
      <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={onUp}>
        ขึ้น / Up
      </button>
      <button type="button" className="crm-users-secondary" disabled={index === total - 1} onClick={onDown}>
        ลง / Down
      </button>
      <button type="button" className="crm-users-secondary" disabled={disableRemove} onClick={onRemove}>
        ลบ / Delete
      </button>
    </div>
  );
}

export function HotelTrainingPageEditor({
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
  initial: HotelTrainingEditorState;
  notice?: string;
  error?: string;
  saveAction: (formData: FormData) => Promise<HotelTrainingCmsSaveResult>;
  duplicateAction: (formData: FormData) => Promise<HotelTrainingCmsSaveResult>;
  updatedAt?: string;
  initialTab?: string;
  previewHref: string;
  publicHref: string;
  locales?: Array<{ id: string; locale: string; status: string; title: string }>;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileHolders = useRef<Partial<Record<VisualSlot | string, HTMLInputElement | null>>>({});
  const [tab, setTab] = useState<Tab>(isTab(initialTab) ? initialTab : "hero");
  const [meta, setMeta] = useState({
    title: initial.title,
    seoTitle: initial.seoTitle,
    metaDescription: initial.metaDescription,
    excerpt: initial.excerpt,
    locale: initial.locale,
    status: initial.status,
  });
  const [content, setContent] = useState<CmsHotelTrainingPage>(initial.content);
  const [status, setStatus] = useState(error ? hotelTrainingCmsErrorMessage(error) : "");
  const [ok, setOk] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<"unpublish" | "duplicate" | null>(null);
  const [targetLocale, setTargetLocale] = useState("en");
  const [dirty, setDirty] = useState(false);
  const [previews, setPreviews] = useState<Record<string, string>>({
    hero: initial.content.hero.visual.src,
    needs: initial.content.needs.visual.src,
    social: initial.content.seo.social.src,
    trainer: initial.content.trainer.src,
    ...Object.fromEntries(initial.content.gallery.items.map((item) => [`gallery-${item.id}`, item.src])),
  });
  const [clears, setClears] = useState<Record<string, boolean>>({});

  function markDirty() {
    setDirty(true);
    setOk("");
  }

  function patchContent(next: CmsHotelTrainingPage) {
    setContent(next);
    markDirty();
  }

  function patchVisual(slot: VisualSlot, visual: CmsHotelTrainingVisual) {
    if (slot === "hero") patchContent({ ...content, hero: { ...content.hero, visual } });
    else if (slot === "needs") patchContent({ ...content, needs: { ...content.needs, visual } });
    else patchContent({ ...content, seo: { ...content.seo, social: visual } });
  }

  function patchGalleryItem(index: number, next: Partial<CmsHotelTrainingGalleryItem>) {
    patchContent({
      ...content,
      gallery: { ...content.gallery, items: content.gallery.items.map((item, i) => (i === index ? { ...item, ...next } : item)) },
    });
  }

  function ReviewStatusField({ value, onChange, hint }: { value: string; onChange: (next: string) => void; hint?: string }) {
    return (
      <Field label="สถานะตรวจ / Review status" hint={hint}>
        <select className="crm-field" value={value} onChange={(event) => onChange(event.target.value)}>
          {HOTEL_TRAINING_REVIEW_STATUSES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </Field>
    );
  }

  function VisualFields({ slot, visual, hint }: { slot: VisualSlot; visual: CmsHotelTrainingVisual; hint: string }) {
    return (
      <>
        <Field label="คำอธิบายภาพภาษาไทย (alt)">
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
        <Field label="สถานะรูป" hint="หน้าสาธารณะแสดงรูปที่ Approved และได้รับอนุญาตเท่านั้น นอกนั้นใช้แผนภาพ HTML">
          <select className="crm-field" value={visual.status} onChange={(event) => patchVisual(slot, { ...visual, status: event.target.value as HotelTrainingVisualStatus })}>
            {HOTEL_TRAINING_VISUAL_STATUSES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="แหล่งที่มา / Source">
          <input className="crm-field" value={visual.source} onChange={(event) => patchVisual(slot, { ...visual, source: event.target.value })} />
        </Field>
        <Field label="หมายเหตุสิทธิ์ใช้ภาพ / Approval note">
          <textarea className="crm-field" rows={2} value={visual.approvalNote} onChange={(event) => patchVisual(slot, { ...visual, approvalNote: event.target.value })} />
        </Field>
        <label className="crm-cms-field">
          <span>
            <input type="checkbox" checked={Boolean(visual.publicationApproved)} onChange={(event) => patchVisual(slot, { ...visual, publicationApproved: event.target.checked })} /> อนุมัติเผยแพร่ภาพจริง / Publication approval
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
              if (visual.status === "replace") patchVisual(slot, { ...visual, status: "sample" });
              markDirty();
            }}
          />
        </Field>
        <ImagePreview src={clears[slot] ? "" : previews[slot] || ""} alt={visual.altTh || visual.altEn} recommended={hint} />
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

  function submit(intent: HotelTrainingCmsIntent) {
    const node = formRef.current;
    if (!node) return;
    const data = new FormData(node);
    data.set("intent", intent);
    data.set("title", meta.title);
    data.set("seoTitle", meta.seoTitle);
    data.set("metaDescription", meta.metaDescription);
    data.set("excerpt", meta.excerpt);
    data.set("contentJson", JSON.stringify(content));
    Object.entries(clears).forEach(([slot, on]) => {
      if (!on) return;
      if (slot === "hero" || slot === "needs" || slot === "social") data.set(CLEAR_FIELD_NAMES[slot], "1");
      else if (slot === "trainer") data.set("clearTrainerImage", "1");
      else if (slot.startsWith("gallery-")) data.set(`clearGalleryImage-${slot.slice(8)}`, "1");
    });
    startTransition(async () => {
      setOk("");
      setStatus("");
      const result = await saveAction(data);
      if (!result.ok) {
        setStatus(hotelTrainingCmsErrorMessage(result.error));
        return;
      }
      if (intent === "publish") setMeta((current) => ({ ...current, status: "published" }));
      if (intent === "draft" || intent === "unpublish") setMeta((current) => ({ ...current, status: "draft" }));
      setOk(intent === "preview" ? hotelTrainingCmsNotice("preview") : hotelTrainingCmsNotice("saved"));
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
        setStatus(hotelTrainingCmsErrorMessage(result.error));
        return;
      }
      setOk(hotelTrainingCmsNotice("duplicate"));
      setDirty(false);
      router.push(`/crm/cms/pages/${result.id}?tab=hero`);
    });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = (submitter?.value as HotelTrainingCmsIntent) || "save";
    if (intent === "unpublish") {
      setDialog("unpublish");
      return;
    }
    submit(intent);
  }

  const saveButtons = (
    <>
      <button className="kpi-button" type="submit" name="intent" value="save" disabled={pending} style={{ background: "#a2dc25", color: "#0b1f33" }}>
        {pending ? hotelTrainingCmsNotice("pending") : "บันทึก / Save"}
      </button>
      <button className="crm-users-secondary" type="submit" name="intent" value="draft" disabled={pending}>
        บันทึกฉบับร่าง / Save Draft
      </button>
      <button className="crm-users-secondary" type="submit" name="intent" value="preview" disabled={pending}>
        บันทึกแล้วดูตัวอย่าง / Save and Preview
      </button>
      <button className="kpi-button" type="submit" name="intent" value="publish" disabled={pending} style={{ background: "#a2dc25", color: "#0b1f33" }}>
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
        {pending ? hotelTrainingCmsNotice("pending") : status || (dirty ? hotelTrainingCmsNotice("dirty") : ok || hotelTrainingCmsNotice("ready"))}
      </p>
    </div>
  );

  return (
    <div className="crm-cs-editor-shell">
      <nav className="crm-cs-tabs" role="tablist" aria-label="ส่วนของหน้า Hotel Training">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            id={`hotel-training-cms-tab-${item.id}`}
            role="tab"
            aria-selected={tab === item.id}
            aria-controls="hotel-training-cms-panel"
            className={tab === item.id ? "crm-cs-tab is-active" : "crm-cs-tab"}
            style={tab === item.id ? { background: "#a2dc25", color: "#0b1f33", borderColor: "#a2dc25" } : undefined}
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
        <input
          ref={(node) => {
            fileHolders.current.trainer = node;
          }}
          type="file"
          name="trainerImageFile"
          accept=".jpg,.jpeg,.png,.webp"
          hidden
          aria-hidden="true"
          tabIndex={-1}
        />
        {content.gallery.items.map((item) => (
          <input
            key={item.id}
            ref={(node) => {
              fileHolders.current[`gallery-${item.id}`] = node;
            }}
            type="file"
            name={`galleryImageFile-${item.id}`}
            accept=".jpg,.jpeg,.png,.webp"
            hidden
            aria-hidden="true"
            tabIndex={-1}
          />
        ))}
        {saveBar}
        <div id="hotel-training-cms-panel" role="tabpanel" aria-labelledby={`hotel-training-cms-tab-${tab}`}>
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
              <Field label="ลิงก์ปุ่มหลัก">
                <input className="crm-field" value={content.hero.primaryCta.href} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, primaryCta: { ...content.hero.primaryCta, href: event.target.value } } })} />
              </Field>
              <Field label="ป้ายปุ่มรอง">
                <input className="crm-field" value={content.hero.secondaryCta.label} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, secondaryCta: { ...content.hero.secondaryCta, label: event.target.value } } })} />
              </Field>
              <Field label="ลิงก์ปุ่มรอง">
                <input className="crm-field" value={content.hero.secondaryCta.href} onChange={(event) => patchContent({ ...content, hero: { ...content.hero, secondaryCta: { ...content.hero.secondaryCta, href: event.target.value } } })} />
              </Field>
              <VisualFields slot="hero" visual={content.hero.visual} hint="Dummy 1600×1000 · /images/hotel-training-hero-placeholder.webp · display 560×350 · 8:5 หน้าสาธารณะใช้ Dummy จนกว่าภาพจริงจะ status=approved และ publicationApproved ห้ามใช้ภาพ AI ของบุคคล และอย่าใช้ภาพคนพูดไมค์หรือจ้องแล็ปท็อปถ้าไม่ใช่งานนี้" />
            </section>
          ) : null}

          {tab === "needs" ? (
            <section className="crm-cms-block">
              <h2>Needs assessment</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.needs.title} onChange={(event) => patchContent({ ...content, needs: { ...content.needs, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.needs.lead} onChange={(event) => patchContent({ ...content, needs: { ...content.needs, lead: event.target.value } })} />
              </Field>
              {content.needs.items.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ไทย">
                    <textarea className="crm-field" rows={2} value={row.th} onChange={(event) => patchContent({ ...content, needs: { ...content.needs, items: content.needs.items.map((item, i) => (i === index ? { ...item, th: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="English">
                    <textarea className="crm-field" rows={2} value={row.en} onChange={(event) => patchContent({ ...content, needs: { ...content.needs, items: content.needs.items.map((item, i) => (i === index ? { ...item, en: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.needs.items.length,
                    () => patchContent({ ...content, needs: { ...content.needs, items: moveItem(content.needs.items, index, -1) } }),
                    () => patchContent({ ...content, needs: { ...content.needs, items: moveItem(content.needs.items, index, 1) } }),
                    () => patchContent({ ...content, needs: { ...content.needs, items: content.needs.items.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, needs: { ...content.needs, items: [...content.needs.items, { id: newHotelTrainingItemId("need"), th: "", en: "" }] } })}>
                เพิ่มคำถาม / Add question
              </button>
              <VisualFields slot="needs" visual={content.needs.visual} hint="Dummy 1200×800 · /images/hotel-training-needs-assessment-placeholder.webp · display 480×320 · 3:2 หน้าสาธารณะใช้แผนภาพ HTML จนกว่าจะมีภาพจริงที่ unique, approved และไม่ซ้ำกับ Gallery ห้ามใช้ภาพประชุม generic หรือภาพ AI ของบุคคล" />
            </section>
          ) : null}

          {tab === "journey" ? (
            <section className="crm-cms-block">
              <h2>Training Journey</h2>
              <p>Dummy 1600×900 · /images/hotel-training-journey-placeholder.webp · display 720×405 · 16:9 หน้าสาธารณะใช้ไทม์ไลน์ HTML/CSS/SVG ไม่ใช้ภาพแกลเลอรีหรือภาพคนทั่วไป Assess และ Follow-up ขึ้นกับแพ็กเกจที่เลือก</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.journey.title} onChange={(event) => patchContent({ ...content, journey: { ...content.journey, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={2} value={content.journey.lead} onChange={(event) => patchContent({ ...content, journey: { ...content.journey, lead: event.target.value } })} />
              </Field>
              <ImagePreview src={content.journey.visual.src} alt={content.journey.visual.altTh || content.journey.visual.altEn} recommended="Hotel Team Training Journey — Sample · 1600×900 · 16:9. Public page uses HTML/SVG timeline." />
              {content.journey.steps.map((row, index) => {
                const patchStep = (next: Partial<typeof row>) =>
                  patchContent({
                    ...content,
                    journey: { ...content.journey, steps: content.journey.steps.map((item, i) => (i === index ? { ...item, ...next } : item)) },
                  });
                return (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="Label">
                    <input className="crm-field" value={row.label} onChange={(event) => patchStep({ label: event.target.value })} />
                  </Field>
                  <Field label="หัวข้อไทย">
                    <input className="crm-field" value={row.titleTh} onChange={(event) => patchStep({ titleTh: event.target.value })} />
                  </Field>
                  <Field label="Title EN">
                    <input className="crm-field" value={row.titleEn} onChange={(event) => patchStep({ titleEn: event.target.value })} />
                  </Field>
                  <Field label="เนื้อหาไทย">
                    <textarea className="crm-field" rows={2} value={row.bodyTh} onChange={(event) => patchStep({ bodyTh: event.target.value })} />
                  </Field>
                  <Field label="Body EN">
                    <textarea className="crm-field" rows={2} value={row.bodyEn} onChange={(event) => patchStep({ bodyEn: event.target.value })} />
                  </Field>
                  <Field label="สิ่งที่ใช้ตั้งต้น TH">
                    <textarea className="crm-field" rows={2} value={row.inputTh} onChange={(event) => patchStep({ inputTh: event.target.value })} />
                  </Field>
                  <Field label="Input EN">
                    <textarea className="crm-field" rows={2} value={row.inputEn} onChange={(event) => patchStep({ inputEn: event.target.value })} />
                  </Field>
                  <Field label="ผู้รับผิดชอบ TH">
                    <input className="crm-field" value={row.ownerTh} onChange={(event) => patchStep({ ownerTh: event.target.value })} />
                  </Field>
                  <Field label="Owner EN">
                    <input className="crm-field" value={row.ownerEn} onChange={(event) => patchStep({ ownerEn: event.target.value })} />
                  </Field>
                  <Field label="สิ่งที่ได้ TH">
                    <textarea className="crm-field" rows={2} value={row.outputTh} onChange={(event) => patchStep({ outputTh: event.target.value })} />
                  </Field>
                  <Field label="Output EN">
                    <textarea className="crm-field" rows={2} value={row.outputEn} onChange={(event) => patchStep({ outputEn: event.target.value })} />
                  </Field>
                  <Field label="จุดอนุมัติ TH">
                    <input className="crm-field" value={row.approvalTh} onChange={(event) => patchStep({ approvalTh: event.target.value })} />
                  </Field>
                  <Field label="Approval point EN">
                    <input className="crm-field" value={row.approvalEn} onChange={(event) => patchStep({ approvalEn: event.target.value })} />
                  </Field>
                  <label className="crm-cms-field">
                    <span>
                      <input type="checkbox" checked={row.packageDependent} onChange={(event) => patchStep({ packageDependent: event.target.checked, optional: event.target.checked })} /> ขึ้นกับแพ็กเกจที่เลือก / Depends on the selected package
                    </span>
                  </label>
                  {listActions(
                    index,
                    content.journey.steps.length,
                    () => patchContent({ ...content, journey: { ...content.journey, steps: moveItem(content.journey.steps, index, -1) } }),
                    () => patchContent({ ...content, journey: { ...content.journey, steps: moveItem(content.journey.steps, index, 1) } }),
                    () => patchContent({ ...content, journey: { ...content.journey, steps: content.journey.steps.filter((_, i) => i !== index) } }),
                  )}
                </div>
                );
              })}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, journey: { ...content.journey, steps: [...content.journey.steps, blankHotelTrainingJourneyStep()] } })}>
                เพิ่มขั้น / Add step
              </button>
            </section>
          ) : null}

          {tab === "programs" ? (
            <section className="crm-cms-block">
              <h2>Programs</h2>
              <p>Dummy 1200×800 · /images/hotel-training-program-placeholder.webp · card 360×240 · 3:2 หน้าสาธารณะใช้ไอคอนหมวด ไม่ใช้ภาพคน AI ห้ามใส่ชื่อหลักสูตร ใบรับรอง วัน หรือจำนวนผู้เข้าที่ยังไม่ตรวจยืนยัน ลิงก์การ์ดต้องเป็นปลายทางจริง</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.programs.title} onChange={(event) => patchContent({ ...content, programs: { ...content.programs, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={2} value={content.programs.lead} onChange={(event) => patchContent({ ...content, programs: { ...content.programs, lead: event.target.value } })} />
              </Field>
              {content.programs.items.map((row, index) => {
                const patchItem = (next: Partial<typeof row>) =>
                  patchContent({
                    ...content,
                    programs: { ...content.programs, items: content.programs.items.map((item, i) => (i === index ? { ...item, ...next } : item)) },
                  });
                return (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="หมวด TH">
                    <input className="crm-field" value={row.categoryTh} onChange={(event) => patchItem({ categoryTh: event.target.value })} />
                  </Field>
                  <Field label="Category EN">
                    <input className="crm-field" value={row.categoryEn} onChange={(event) => patchItem({ categoryEn: event.target.value })} />
                  </Field>
                  <Field label="ชื่อโปรแกรม TH">
                    <input className="crm-field" value={row.titleTh} onChange={(event) => patchItem({ titleTh: event.target.value })} />
                  </Field>
                  <Field label="Program name EN">
                    <input className="crm-field" value={row.titleEn} onChange={(event) => patchItem({ titleEn: event.target.value })} />
                  </Field>
                  <Field label="ผู้เข้าร่วม TH">
                    <input className="crm-field" value={row.audienceTh} onChange={(event) => patchItem({ audienceTh: event.target.value })} />
                  </Field>
                  <Field label="Audience EN">
                    <input className="crm-field" value={row.audienceEn} onChange={(event) => patchItem({ audienceEn: event.target.value })} />
                  </Field>
                  <Field label="ทักษะ/ปัญหา TH">
                    <textarea className="crm-field" rows={2} value={row.problemTh} onChange={(event) => patchItem({ problemTh: event.target.value })} />
                  </Field>
                  <Field label="Skill/problem EN">
                    <textarea className="crm-field" rows={2} value={row.problemEn} onChange={(event) => patchItem({ problemEn: event.target.value })} />
                  </Field>
                  <Field label="ผลลัพธ์การเรียนรู้ TH (บรรทัดละ 1 ข้อ, 2–4 ข้อ)">
                    <textarea className="crm-field" rows={4} value={row.outcomes.map((item) => item.th).join("\n")} onChange={(event) => patchItem({ outcomes: event.target.value.split("\n").map((th, i) => ({ th, en: row.outcomes[i]?.en ?? "" })) })} />
                  </Field>
                  <Field label="Learning outcomes EN (one per line, 2–4)">
                    <textarea className="crm-field" rows={4} value={row.outcomes.map((item) => item.en).join("\n")} onChange={(event) => patchItem({ outcomes: event.target.value.split("\n").map((en, i) => ({ th: row.outcomes[i]?.th ?? "", en })) })} />
                  </Field>
                  <Field label="กิจกรรม/ชิ้นงาน TH">
                    <textarea className="crm-field" rows={2} value={row.activityTh} onChange={(event) => patchItem({ activityTh: event.target.value })} />
                  </Field>
                  <Field label="Activity EN">
                    <textarea className="crm-field" rows={2} value={row.activityEn} onChange={(event) => patchItem({ activityEn: event.target.value })} />
                  </Field>
                  <Field label="ประเมิน/ติดตาม TH">
                    <textarea className="crm-field" rows={2} value={row.assessTh} onChange={(event) => patchItem({ assessTh: event.target.value })} />
                  </Field>
                  <Field label="Assess EN">
                    <textarea className="crm-field" rows={2} value={row.assessEn} onChange={(event) => patchItem({ assessEn: event.target.value })} />
                  </Field>
                  <Field label="Duration TH (เว้นว่างถ้ายังไม่ยืนยัน)">
                    <input className="crm-field" value={row.durationTh} onChange={(event) => patchItem({ durationTh: event.target.value })} />
                  </Field>
                  <Field label="Duration EN">
                    <input className="crm-field" value={row.durationEn} onChange={(event) => patchItem({ durationEn: event.target.value })} />
                  </Field>
                  <label className="crm-cms-field">
                    <span>
                      <input type="checkbox" checked={row.durationVerified} onChange={(event) => patchItem({ durationVerified: event.target.checked })} /> ยืนยันระยะเวลาแล้ว / Duration verified
                    </span>
                  </label>
                  <Field label="ขนาดกลุ่ม TH">
                    <input className="crm-field" value={row.groupSizeTh} onChange={(event) => patchItem({ groupSizeTh: event.target.value })} />
                  </Field>
                  <Field label="Group size EN">
                    <input className="crm-field" value={row.groupSizeEn} onChange={(event) => patchItem({ groupSizeEn: event.target.value })} />
                  </Field>
                  <label className="crm-cms-field">
                    <span>
                      <input type="checkbox" checked={row.groupSizeVerified} onChange={(event) => patchItem({ groupSizeVerified: event.target.checked })} /> ยืนยันขนาดกลุ่มแล้ว / Group size verified
                    </span>
                  </label>
                  <fieldset className="crm-cms-field">
                    <legend>รูปแบบ / Formats</legend>
                    {HOTEL_TRAINING_PROGRAM_FORMAT_IDS.map((id) => (
                      <label key={id} className="crm-cms-check">
                        <input
                          type="checkbox"
                          checked={row.formats.includes(id)}
                          onChange={(event) => {
                            const formats = event.target.checked ? [...row.formats, id] : row.formats.filter((item) => item !== id);
                            patchItem({ formats: formats.length ? formats : [id] });
                          }}
                        />{" "}
                        {id === "inhouse" ? "In-house" : id === "teambuilding" ? "Team building" : id === "online" ? "Online" : "Workshop"}
                      </label>
                    ))}
                  </fieldset>
                  <Field label="ลิงก์การ์ด">
                    <input className="crm-field" value={row.href} onChange={(event) => patchItem({ href: event.target.value })} />
                  </Field>
                  <Field label="ป้ายปุ่ม TH">
                    <input className="crm-field" value={row.ctaTh} onChange={(event) => patchItem({ ctaTh: event.target.value })} />
                  </Field>
                  <Field label="CTA EN">
                    <input className="crm-field" value={row.ctaEn} onChange={(event) => patchItem({ ctaEn: event.target.value })} />
                  </Field>
                  <label className="crm-cms-field">
                    <span>
                      <input type="checkbox" checked={row.verified} onChange={(event) => patchItem({ verified: event.target.checked })} /> ยืนยันชื่อหลักสูตร ใบรับรอง และบริการติดตาม / Course name, certificate, and follow-up verified
                    </span>
                  </label>
                  <label className="crm-cms-field">
                    <span>
                      <input type="checkbox" checked={row.sample} onChange={(event) => patchItem({ sample: event.target.checked })} /> ป้าย Sample / ตัวอย่าง
                    </span>
                  </label>
                  {listActions(
                    index,
                    content.programs.items.length,
                    () => patchContent({ ...content, programs: { ...content.programs, items: moveItem(content.programs.items, index, -1) } }),
                    () => patchContent({ ...content, programs: { ...content.programs, items: moveItem(content.programs.items, index, 1) } }),
                    () => patchContent({ ...content, programs: { ...content.programs, items: content.programs.items.filter((_, i) => i !== index) } }),
                  )}
                </div>
                );
              })}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, programs: { ...content.programs, items: [...content.programs.items, blankHotelTrainingProgram()] } })}>
                เพิ่มโปรแกรม / Add program
              </button>
            </section>
          ) : null}

          {tab === "assess" ? (
            <section className="crm-cms-block">
              <h2>Learning Follow-through Framework</h2>
              <p>Dummy 1600×900 · /images/hotel-training-learning-followthrough-placeholder.webp · display 720×405 · 16:9 หน้าสาธารณะใช้ตาราง/การ์ด HTML ไม่ใช้ภาพคน และไม่ตั้งชื่อโมเดลประเมินที่เป็นกรรมสิทธิ์ คะแนน ความคืบหน้า หรืออันดับพนักงานบนหน้าสาธารณะต้องยืนยันแล้วหรือติดป้าย Sample</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.assess.title} onChange={(event) => patchContent({ ...content, assess: { ...content.assess, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={2} value={content.assess.lead} onChange={(event) => patchContent({ ...content, assess: { ...content.assess, lead: event.target.value } })} />
              </Field>
              <Field label="คำบรรยายตาราง">
                <textarea className="crm-field" rows={2} value={content.assess.caption} onChange={(event) => patchContent({ ...content, assess: { ...content.assess, caption: event.target.value } })} />
              </Field>
              <ImagePreview src={content.assess.visual.src} alt={content.assess.visual.altTh || content.assess.visual.altEn} recommended="Learning Follow-through Framework — Sample · 1600×900 · 16:9. Public page uses HTML table/cards." />
              {content.assess.items.map((row, index) => {
                const patchItem = (next: Partial<typeof row>) =>
                  patchContent({
                    ...content,
                    assess: { ...content.assess, items: content.assess.items.map((item, i) => (i === index ? { ...item, ...next } : item)) },
                  });
                return (
                  <div key={row.id} className="crm-cms-repeat">
                    <Field label="Signal">
                      <input className="crm-field" value={row.label} onChange={(event) => patchItem({ label: event.target.value })} />
                    </Field>
                    <Field label="ความหมาย TH">
                      <textarea className="crm-field" rows={2} value={row.meaningTh} onChange={(event) => patchItem({ meaningTh: event.target.value })} />
                    </Field>
                    <Field label="What it covers EN">
                      <textarea className="crm-field" rows={2} value={row.meaningEn} onChange={(event) => patchItem({ meaningEn: event.target.value })} />
                    </Field>
                    <Field label="หลักฐาน TH">
                      <textarea className="crm-field" rows={2} value={row.evidenceTh} onChange={(event) => patchItem({ evidenceTh: event.target.value })} />
                    </Field>
                    <Field label="Evidence EN">
                      <textarea className="crm-field" rows={2} value={row.evidenceEn} onChange={(event) => patchItem({ evidenceEn: event.target.value })} />
                    </Field>
                    <Field label="สถานะบนหน้านี้ TH" hint="เว้นว่างหรือตัวอย่างจนกว่าจะมีข้อมูลที่อนุมัติ ห้ามใส่คะแนนรายบุคคล">
                      <input className="crm-field" value={row.statusTh} onChange={(event) => patchItem({ statusTh: event.target.value })} />
                    </Field>
                    <Field label="Public status EN" hint="Keep Sample / Not set until verified. Do not publish identifiable learner scores.">
                      <input className="crm-field" value={row.statusEn} onChange={(event) => patchItem({ statusEn: event.target.value })} />
                    </Field>
                    <label className="crm-cms-field">
                      <span>
                        <input type="checkbox" checked={row.sample} onChange={(event) => patchItem({ sample: event.target.checked })} /> ป้าย Sample / ตัวอย่าง
                      </span>
                    </label>
                    {listActions(
                      index,
                      content.assess.items.length,
                      () => patchContent({ ...content, assess: { ...content.assess, items: moveItem(content.assess.items, index, -1) } }),
                      () => patchContent({ ...content, assess: { ...content.assess, items: moveItem(content.assess.items, index, 1) } }),
                      () => patchContent({ ...content, assess: { ...content.assess, items: content.assess.items.filter((_, i) => i !== index) } }),
                    )}
                  </div>
                );
              })}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, assess: { ...content.assess, items: [...content.assess.items, blankHotelTrainingAssessItem()] } })}>
                เพิ่มสัญญาณ / Add signal
              </button>
            </section>
          ) : null}

          {tab === "gallery" ? (
            <section className="crm-cms-block">
              <h2>Gallery</h2>
              <p>ใช้ภาพจริงที่ได้รับอนุญาต 3–6 ภาพ คนละชุดกับ Hero และ Needs แหล่งภาพ 1200×900 · การ์ด 360×270 · 4:3 ไม่ใส่ชื่อโรงแรม โลโก้ลูกค้า เอกสารภายใน หรือภาพ AI ของห้องอบรม หากยังไม่มีภาพที่อนุมัติ ให้ใช้ /images/training/gallery/training-session-placeholder-01.webp</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.gallery.title} onChange={(event) => patchContent({ ...content, gallery: { ...content.gallery, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={2} value={content.gallery.lead} onChange={(event) => patchContent({ ...content, gallery: { ...content.gallery, lead: event.target.value } })} />
              </Field>
              {content.gallery.items.map((row, index) => {
                const slot = `gallery-${row.id}`;
                return (
                  <div key={row.id} className="crm-cms-repeat">
                    <Field label="Alt TH">
                      <input className="crm-field" value={row.altTh} onChange={(event) => patchGalleryItem(index, { altTh: event.target.value })} />
                    </Field>
                    <Field label="Alt EN">
                      <input className="crm-field" value={row.altEn} onChange={(event) => patchGalleryItem(index, { altEn: event.target.value })} />
                    </Field>
                    <Field label="หัวข้อ TH">
                      <input className="crm-field" value={row.topicTh} onChange={(event) => patchGalleryItem(index, { topicTh: event.target.value })} />
                    </Field>
                    <Field label="Topic EN">
                      <input className="crm-field" value={row.topicEn} onChange={(event) => patchGalleryItem(index, { topicEn: event.target.value })} />
                    </Field>
                    <Field label="ปี / Year">
                      <input className="crm-field" value={row.year} onChange={(event) => patchGalleryItem(index, { year: event.target.value })} />
                    </Field>
                    <Field label="วันที่ที่ตรวจแล้ว / Verified date label">
                      <input className="crm-field" value={row.dateLabel} onChange={(event) => patchGalleryItem(index, { dateLabel: event.target.value })} />
                    </Field>
                    <Field label="คำบรรยาย TH" hint="หัวข้อ / บทบาท / รูปแบบ — ไม่ใส่ชื่อโรงแรมหรือวันที่หากยังไม่ยืนยัน">
                      <input className="crm-field" value={row.captionTh} onChange={(event) => patchGalleryItem(index, { captionTh: event.target.value })} />
                    </Field>
                    <Field label="Caption EN" hint="Topic / role / format only. No hotel name or date unless verified.">
                      <input className="crm-field" value={row.captionEn} onChange={(event) => patchGalleryItem(index, { captionEn: event.target.value })} />
                    </Field>
                    <Field label="สถานะรูป">
                      <select className="crm-field" value={row.status} onChange={(event) => patchGalleryItem(index, { status: event.target.value })}>
                        {HOTEL_TRAINING_VISUAL_STATUSES.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="สถานะยินยอมเผยแพร่ / Publication consent">
                      <select className="crm-field" value={row.consentStatus} onChange={(event) => patchGalleryItem(index, { consentStatus: event.target.value })}>
                        {HOTEL_TRAINING_CONSENT_STATUSES.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="แหล่งที่มา / Source">
                      <input className="crm-field" value={row.source} onChange={(event) => patchGalleryItem(index, { source: event.target.value })} />
                    </Field>
                    <Field label="หมายเหตุปกปิดข้อมูล / Redaction note">
                      <textarea className="crm-field" rows={2} value={row.redactionNote} onChange={(event) => patchGalleryItem(index, { redactionNote: event.target.value })} />
                    </Field>
                    <label className="crm-cms-check">
                      <input type="checkbox" checked={row.redactionChecked} onChange={(event) => patchGalleryItem(index, { redactionChecked: event.target.checked })} /> ตรวจการปกปิดข้อมูลแล้ว / Redaction checked
                    </label>
                    <label className="crm-cms-check">
                      <input
                        type="checkbox"
                        checked={row.publicationApproved}
                        onChange={(event) =>
                          patchGalleryItem(index, {
                            publicationApproved: event.target.checked,
                            consentStatus: event.target.checked ? "approved" : row.consentStatus,
                            status: event.target.checked ? "approved" : row.status,
                          })
                        }
                      />{" "}
                      อนุมัติเผยแพร่ภาพนี้ / Publication approved
                    </label>
                    <Field label="แทนที่รูป">
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
                          if (row.status === "replace") patchGalleryItem(index, { status: "sample" });
                          markDirty();
                        }}
                      />
                    </Field>
                    <ImagePreview src={clears[slot] ? "" : previews[slot] || row.src} alt={row.altTh || row.altEn} recommended="Approved real photo 1200×900 · 4:3. Dummy: /images/training/gallery/training-session-placeholder-01.webp" />
                    {(previews[slot] || row.src) && !clears[slot] ? (
                      <button
                        type="button"
                        className="crm-users-secondary"
                        onClick={() => {
                          const holder = fileHolders.current[slot];
                          if (holder) holder.value = "";
                          setClears((current) => ({ ...current, [slot]: true }));
                          setPreviews((current) => ({ ...current, [slot]: "" }));
                          patchGalleryItem(index, { src: "", status: "replace", publicationApproved: false, consentStatus: "none" });
                        }}
                      >
                        ลบรูป / Remove asset
                      </button>
                    ) : null}
                    {listActions(
                      index,
                      content.gallery.items.length,
                      () => patchContent({ ...content, gallery: { ...content.gallery, items: moveItem(content.gallery.items, index, -1) } }),
                      () => patchContent({ ...content, gallery: { ...content.gallery, items: moveItem(content.gallery.items, index, 1) } }),
                      () => patchContent({ ...content, gallery: { ...content.gallery, items: content.gallery.items.filter((_, i) => i !== index) } }),
                      content.gallery.items.length <= 1,
                    )}
                  </div>
                );
              })}
              {content.gallery.items.length < 6 ? (
                <button
                  type="button"
                  className="crm-users-secondary"
                  onClick={() =>
                    patchContent({
                      ...content,
                      gallery: { ...content.gallery, items: [...content.gallery.items, blankHotelTrainingGalleryItem()] },
                    })
                  }
                >
                  เพิ่มภาพ / Add photo
                </button>
              ) : null}
            </section>
          ) : null}

          {tab === "matrix" ? (
            <section className="crm-cms-block">
              <h2>Skill matrix</h2>
              <p>หน้าสาธารณะใช้ตาราง/การ์ด HTML ที่แก้ไขได้ Dummy 1600×900 · /images/hotel-team-skill-matrix-placeholder.webp · display 720×405 · 16:9 ห้ามใช้ภาพสต็อกแทนตาราง แต่ละแถวเป็นตัวอย่างจากงานที่เปิดรับ ไม่ใช่แคตตาล็อกหลักสูตร และไม่ใช่คะแนนพนักงาน</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.matrix.title} onChange={(event) => patchContent({ ...content, matrix: { ...content.matrix, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={2} value={content.matrix.lead} onChange={(event) => patchContent({ ...content, matrix: { ...content.matrix, lead: event.target.value } })} />
              </Field>
              <Field label="คำบรรยายตาราง">
                <input className="crm-field" value={content.matrix.caption} onChange={(event) => patchContent({ ...content, matrix: { ...content.matrix, caption: event.target.value } })} />
              </Field>
              <ImagePreview src={content.matrix.visual.src} alt={content.matrix.visual.altTh || content.matrix.visual.altEn} recommended="Hotel Team Skill Matrix — Sample · 1600×900 · 16:9. Public page uses HTML table/cards." />
              {content.matrix.items.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="แผนก / บทบาท TH">
                    <input className="crm-field" value={row.roleTh} onChange={(event) => patchContent({ ...content, matrix: { ...content.matrix, items: content.matrix.items.map((item, i) => (i === index ? { ...item, roleTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Department / Role EN">
                    <input className="crm-field" value={row.roleEn} onChange={(event) => patchContent({ ...content, matrix: { ...content.matrix, items: content.matrix.items.map((item, i) => (i === index ? { ...item, roleEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ทักษะ / หัวข้อ TH">
                    <input className="crm-field" value={row.skillTh} onChange={(event) => patchContent({ ...content, matrix: { ...content.matrix, items: content.matrix.items.map((item, i) => (i === index ? { ...item, skillTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Skill / topic EN">
                    <input className="crm-field" value={row.skillEn} onChange={(event) => patchContent({ ...content, matrix: { ...content.matrix, items: content.matrix.items.map((item, i) => (i === index ? { ...item, skillEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="กิจกรรม TH">
                    <textarea className="crm-field" rows={2} value={row.activityTh} onChange={(event) => patchContent({ ...content, matrix: { ...content.matrix, items: content.matrix.items.map((item, i) => (i === index ? { ...item, activityTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Learning activity EN">
                    <textarea className="crm-field" rows={2} value={row.activityEn} onChange={(event) => patchContent({ ...content, matrix: { ...content.matrix, items: content.matrix.items.map((item, i) => (i === index ? { ...item, activityEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ประเมิน / ติดตาม TH">
                    <textarea className="crm-field" rows={2} value={row.assessTh} onChange={(event) => patchContent({ ...content, matrix: { ...content.matrix, items: content.matrix.items.map((item, i) => (i === index ? { ...item, assessTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Assessment / follow-up EN">
                    <textarea className="crm-field" rows={2} value={row.assessEn} onChange={(event) => patchContent({ ...content, matrix: { ...content.matrix, items: content.matrix.items.map((item, i) => (i === index ? { ...item, assessEn: event.target.value } : item)) } })} />
                  </Field>
                  <label className="crm-cms-field">
                    <span>
                      <input type="checkbox" checked={row.sample} onChange={(event) => patchContent({ ...content, matrix: { ...content.matrix, items: content.matrix.items.map((item, i) => (i === index ? { ...item, sample: event.target.checked } : item)) } })} /> ป้าย Sample / ตัวอย่าง
                    </span>
                  </label>
                  {listActions(
                    index,
                    content.matrix.items.length,
                    () => patchContent({ ...content, matrix: { ...content.matrix, items: moveItem(content.matrix.items, index, -1) } }),
                    () => patchContent({ ...content, matrix: { ...content.matrix, items: moveItem(content.matrix.items, index, 1) } }),
                    () => patchContent({ ...content, matrix: { ...content.matrix, items: content.matrix.items.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, matrix: { ...content.matrix, items: [...content.matrix.items, blankHotelTrainingMatrixRow()] } })}>
                เพิ่มแถว / Add row
              </button>
            </section>
          ) : null}

          {tab === "trainer" ? (
            <section className="crm-cms-block">
              <h2>Facilitator</h2>
              <p>Dummy 800×1000 · /images/hotel-training-facilitator-placeholder.webp · display 320×400 · 4:5 หน้าสาธารณะใช้ Dummy จนกว่าภาพจริงจะ status=approved และ publicationApproved ห้ามใช้ภาพ AI ของบุคคล อย่าเพิ่มจำนวนปี วุฒิบัตร รายชื่อลูกค้า หรือผลลัพธ์ที่ยังไม่ตรวจยืนยัน ช่องวุฒิบัตรและภาษาเว้นว่างถ้ายังไม่มีข้อมูล</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.trainer.title} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={2} value={content.trainer.lead} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, lead: event.target.value } })} />
              </Field>
              <Field label="ชื่อ">
                <input className="crm-field" value={content.trainer.name} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, name: event.target.value } })} />
              </Field>
              <Field label="Name EN">
                <input className="crm-field" value={content.trainer.nameEn} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, nameEn: event.target.value } })} />
              </Field>
              <Field label="บทบาท TH">
                <input className="crm-field" value={content.trainer.roleTh} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, roleTh: event.target.value } })} />
              </Field>
              <Field label="Role EN">
                <input className="crm-field" value={content.trainer.roleEn} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, roleEn: event.target.value } })} />
              </Field>
              <Field label="ประวัติย่อ TH">
                <textarea className="crm-field" rows={3} value={content.trainer.bioTh} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, bioTh: event.target.value } })} />
              </Field>
              <Field label="Bio EN">
                <textarea className="crm-field" rows={3} value={content.trainer.bioEn} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, bioEn: event.target.value } })} />
              </Field>
              <Field label="ประสบการณ์ TH">
                <textarea className="crm-field" rows={3} value={content.trainer.experienceTh} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, experienceTh: event.target.value } })} />
              </Field>
              <Field label="Experience EN">
                <textarea className="crm-field" rows={3} value={content.trainer.experienceEn} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, experienceEn: event.target.value } })} />
              </Field>
              <label className="crm-cms-check">
                <input type="checkbox" checked={content.trainer.experienceVerified} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, experienceVerified: event.target.checked } })} /> ยืนยันประสบการณ์แล้ว / Experience verified
              </label>
              <Field label="หัวข้อที่เชี่ยวชาญ TH (one per line)">
                <textarea className="crm-field" rows={3} value={content.trainer.topics.map((item) => item.th).join("\n")} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, topics: event.target.value.split("\n").map((th, i) => ({ th, en: content.trainer.topics[i]?.en ?? "" })) } })} />
              </Field>
              <Field label="Topics EN (one per line)">
                <textarea className="crm-field" rows={3} value={content.trainer.topics.map((item) => item.en).join("\n")} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, topics: event.target.value.split("\n").map((en, i) => ({ th: content.trainer.topics[i]?.th ?? "", en })) } })} />
              </Field>
              <Field label="รูปแบบการดำเนินกิจกรรม TH">
                <textarea className="crm-field" rows={2} value={content.trainer.formatTh} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, formatTh: event.target.value } })} />
              </Field>
              <Field label="Facilitation format EN">
                <textarea className="crm-field" rows={2} value={content.trainer.formatEn} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, formatEn: event.target.value } })} />
              </Field>
              <Field label="ตัวอย่างผู้เรียนที่เผยแพร่ได้ TH">
                <textarea className="crm-field" rows={2} value={content.trainer.engagementsTh} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, engagementsTh: event.target.value } })} />
              </Field>
              <Field label="Publishable learner audiences EN">
                <textarea className="crm-field" rows={2} value={content.trainer.engagementsEn} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, engagementsEn: event.target.value } })} />
              </Field>
              <Field label="วุฒิบัตรที่ยืนยันแล้ว TH" hint="เว้นว่างถ้ายังไม่มีข้อมูลที่อนุมัติ">
                <input className="crm-field" value={content.trainer.qualificationsTh} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, qualificationsTh: event.target.value } })} />
              </Field>
              <Field label="Verified qualifications EN">
                <input className="crm-field" value={content.trainer.qualificationsEn} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, qualificationsEn: event.target.value } })} />
              </Field>
              <label className="crm-cms-check">
                <input type="checkbox" checked={content.trainer.qualificationsVerified} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, qualificationsVerified: event.target.checked } })} /> ยืนยันวุฒิบัตรแล้ว / Qualifications verified
              </label>
              <Field label="ภาษาที่ใช้สอน TH" hint="เว้นว่างจนกว่าจะยืนยัน">
                <input className="crm-field" value={content.trainer.languagesTh} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, languagesTh: event.target.value } })} />
              </Field>
              <Field label="Teaching languages EN">
                <input className="crm-field" value={content.trainer.languagesEn} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, languagesEn: event.target.value } })} />
              </Field>
              <label className="crm-cms-check">
                <input type="checkbox" checked={content.trainer.languagesVerified} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, languagesVerified: event.target.checked } })} /> ยืนยันภาษาสอนแล้ว / Languages verified
              </label>
              <Field label="แหล่งหลักฐาน / Proof source">
                <input className="crm-field" value={content.trainer.proofSource} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, proofSource: event.target.value } })} />
              </Field>
              <Field label="Alt TH">
                <input className="crm-field" value={content.trainer.altTh} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, altTh: event.target.value } })} />
              </Field>
              <Field label="Alt EN">
                <input className="crm-field" value={content.trainer.altEn} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, altEn: event.target.value } })} />
              </Field>
              <Field label="สถานะภาพ">
                <select className="crm-field" value={content.trainer.status} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, status: event.target.value } })}>
                  {HOTEL_TRAINING_VISUAL_STATUSES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Field>
              <label className="crm-cms-check">
                <input type="checkbox" checked={Boolean(content.trainer.publicationApproved)} onChange={(event) => patchContent({ ...content, trainer: { ...content.trainer, publicationApproved: event.target.checked } })} /> อนุมัติเผยแพร่ภาพจริง / Publication approval
              </label>
              <Field label="แทนที่รูปวิทยากร">
                <input
                  className="crm-field"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const transfer = new DataTransfer();
                    transfer.items.add(file);
                    const holder = fileHolders.current.trainer;
                    if (holder) holder.files = transfer.files;
                    setPreviews((current) => ({ ...current, trainer: URL.createObjectURL(file) }));
                    setClears((current) => ({ ...current, trainer: false }));
                    markDirty();
                  }}
                />
              </Field>
              <ImagePreview src={clears.trainer ? "" : previews.trainer || content.trainer.src} alt={content.trainer.altTh || content.trainer.altEn} recommended="Trainer portrait placeholder — replace with approved facilitator photo · 800×1000 · 4:5. Do not use an AI-generated portrait." />
              {(previews.trainer || content.trainer.src) && !clears.trainer ? (
                <button
                  type="button"
                  className="crm-users-secondary"
                  onClick={() => {
                    const holder = fileHolders.current.trainer;
                    if (holder) holder.value = "";
                    setClears((current) => ({ ...current, trainer: true }));
                    setPreviews((current) => ({ ...current, trainer: "" }));
                    patchContent({ ...content, trainer: { ...content.trainer, src: "", status: "replace", publicationApproved: false } });
                  }}
                >
                  ลบรูป / Remove asset
                </button>
              ) : null}
            </section>
          ) : null}

          {tab === "outcomes" ? (
            <section className="crm-cms-block">
              <h2>Outcomes</h2>
              <p>หน้าสาธารณะใช้ตาราง HTML ที่แก้ไขได้ Dummy 1600×900 · /images/hotel-training-outcomes-scorecard-placeholder.webp · display 720×405 · 16:9 ห้ามใส่คะแนน ความพึงพอใจ จำนวนผู้เข้า รายได้ หรือผลิตภาพที่ยังไม่ตรวจยืนยัน ผลทางธุรกิจเว้นว่างจนกว่าจะมีแบบวัดและข้อมูลที่ยืนยัน</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.outcomes.title} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={3} value={content.outcomes.lead} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, lead: event.target.value } })} />
              </Field>
              <Field label="คำบรรยายตาราง">
                <input className="crm-field" value={content.outcomes.caption} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, caption: event.target.value } })} />
              </Field>
              <ImagePreview src={content.outcomes.visual.src} alt={content.outcomes.visual.altTh || content.outcomes.visual.altEn} recommended="Training Outcome Scorecard — Sample data · 1600×900 · 16:9. Public page uses HTML table/cards." />
              {content.outcomes.items.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ระดับ / Level">
                    <select
                      className="crm-field"
                      value={row.level}
                      onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, level: event.target.value } : item)) } })}
                    >
                      <option value="immediate">Immediate learning outcomes</option>
                      <option value="workplace">Workplace application</option>
                      <option value="business">Business outcomes</option>
                    </select>
                  </Field>
                  <Field label="ตัวชี้วัด TH">
                    <input className="crm-field" value={row.metricTh} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, metricTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Metric EN">
                    <input className="crm-field" value={row.metricEn} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, metricEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ก่อนเรียน TH" hint="เว้นว่างถ้ายังไม่มีข้อมูลที่อนุมัติ">
                    <input className="crm-field" value={row.beforeTh} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, beforeTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Before training EN" hint="Leave empty until approved data exists">
                    <input className="crm-field" value={row.beforeEn} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, beforeEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="หลังเรียน TH">
                    <input className="crm-field" value={row.afterTh} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, afterTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="After training EN">
                    <input className="crm-field" value={row.afterEn} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, afterEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ติดตามที่หน้างาน TH">
                    <input className="crm-field" value={row.followTh} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, followTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Workplace follow-up EN">
                    <input className="crm-field" value={row.followEn} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, followEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="นิยาม TH">
                    <textarea className="crm-field" rows={2} value={row.definitionTh} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, definitionTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Definition EN">
                    <textarea className="crm-field" rows={2} value={row.definitionEn} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, definitionEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="วิธีเก็บ TH">
                    <textarea className="crm-field" rows={2} value={row.methodTh} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, methodTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Method EN">
                    <textarea className="crm-field" rows={2} value={row.methodEn} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, methodEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ผู้ทบทวน TH">
                    <input className="crm-field" value={row.reviewerTh} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, reviewerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Reviewer EN">
                    <input className="crm-field" value={row.reviewerEn} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, reviewerEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ช่วงวัด TH">
                    <input className="crm-field" value={row.periodTh} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, periodTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Period EN">
                    <input className="crm-field" value={row.periodEn} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, periodEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="แหล่งที่มา TH">
                    <input className="crm-field" value={row.sourceTh} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, sourceTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Source EN">
                    <input className="crm-field" value={row.sourceEn} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, sourceEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="เจ้าของข้อมูล TH">
                    <input className="crm-field" value={row.ownerTh} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, ownerTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Owner EN">
                    <input className="crm-field" value={row.ownerEn} onChange={(event) => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.map((item, i) => (i === index ? { ...item, ownerEn: event.target.value } : item)) } })} />
                  </Field>
                  <ReviewStatusField
                    value={row.reviewStatus}
                    onChange={(reviewStatus) =>
                      patchContent({
                        ...content,
                        outcomes: {
                          ...content.outcomes,
                          items: content.outcomes.items.map((item, i) => (i === index ? { ...item, reviewStatus, sample: reviewStatus !== "verified" } : item)),
                        },
                      })
                    }
                    hint="ตัวเลขที่ยังไม่ Verified จะติดป้าย Sample บนหน้าสาธารณะ"
                  />
                  <label className="crm-cms-field">
                    <span>
                      <input
                        type="checkbox"
                        checked={row.sample}
                        onChange={(event) =>
                          patchContent({
                            ...content,
                            outcomes: {
                              ...content.outcomes,
                              items: content.outcomes.items.map((item, i) => (i === index ? { ...item, sample: event.target.checked, reviewStatus: event.target.checked ? "sample" : item.reviewStatus } : item)),
                            },
                          })
                        }
                      />{" "}
                      ป้าย Sample / ตัวอย่าง
                    </span>
                  </label>
                  {listActions(
                    index,
                    content.outcomes.items.length,
                    () => patchContent({ ...content, outcomes: { ...content.outcomes, items: moveItem(content.outcomes.items, index, -1) } }),
                    () => patchContent({ ...content, outcomes: { ...content.outcomes, items: moveItem(content.outcomes.items, index, 1) } }),
                    () => patchContent({ ...content, outcomes: { ...content.outcomes, items: content.outcomes.items.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, outcomes: { ...content.outcomes, items: [...content.outcomes.items, blankHotelTrainingOutcomeItem()] } })}>
                เพิ่มตัวชี้วัด / Add metric
              </button>
            </section>
          ) : null}

          {tab === "follow" ? (
            <section className="crm-cms-block">
              <h2>Follow-through</h2>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.follow.title} onChange={(event) => patchContent({ ...content, follow: { ...content.follow, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={2} value={content.follow.lead} onChange={(event) => patchContent({ ...content, follow: { ...content.follow, lead: event.target.value } })} />
              </Field>
              {content.follow.items.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="ฟิลด์ TH">
                    <input className="crm-field" value={row.labelTh} onChange={(event) => patchContent({ ...content, follow: { ...content.follow, items: content.follow.items.map((item, i) => (i === index ? { ...item, labelTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Field EN">
                    <input className="crm-field" value={row.labelEn} onChange={(event) => patchContent({ ...content, follow: { ...content.follow, items: content.follow.items.map((item, i) => (i === index ? { ...item, labelEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ความหมาย TH">
                    <textarea className="crm-field" rows={2} value={row.meaningTh} onChange={(event) => patchContent({ ...content, follow: { ...content.follow, items: content.follow.items.map((item, i) => (i === index ? { ...item, meaningTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="What it covers EN">
                    <textarea className="crm-field" rows={2} value={row.meaningEn} onChange={(event) => patchContent({ ...content, follow: { ...content.follow, items: content.follow.items.map((item, i) => (i === index ? { ...item, meaningEn: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="ค่าตัวอย่าง TH">
                    <input className="crm-field" value={row.valueTh} onChange={(event) => patchContent({ ...content, follow: { ...content.follow, items: content.follow.items.map((item, i) => (i === index ? { ...item, valueTh: event.target.value } : item)) } })} />
                  </Field>
                  <Field label="Sample value EN">
                    <input className="crm-field" value={row.valueEn} onChange={(event) => patchContent({ ...content, follow: { ...content.follow, items: content.follow.items.map((item, i) => (i === index ? { ...item, valueEn: event.target.value } : item)) } })} />
                  </Field>
                  {listActions(
                    index,
                    content.follow.items.length,
                    () => patchContent({ ...content, follow: { ...content.follow, items: moveItem(content.follow.items, index, -1) } }),
                    () => patchContent({ ...content, follow: { ...content.follow, items: moveItem(content.follow.items, index, 1) } }),
                    () => patchContent({ ...content, follow: { ...content.follow, items: content.follow.items.filter((_, i) => i !== index) } }),
                  )}
                </div>
              ))}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, follow: { ...content.follow, items: [...content.follow.items, blankHotelTrainingFollowItem()] } })}>
                เพิ่มฟิลด์ / Add field
              </button>
              <Field label="หัวข้อพันธมิตร">
                <input className="crm-field" value={content.partners.title} onChange={(event) => patchContent({ ...content, partners: { ...content.partners, title: event.target.value } })} />
              </Field>
              <Field label="คำอธิบายพันธมิตร">
                <textarea className="crm-field" rows={3} value={content.partners.body} onChange={(event) => patchContent({ ...content, partners: { ...content.partners, body: event.target.value } })} />
              </Field>
            </section>
          ) : null}

          {tab === "related" ? (
            <section className="crm-cms-block">
              <h2>Related Content</h2>
              <p>Dummy 1200×800 · /images/hotel-training-related-content-placeholder.webp · display 360×240 · 3:2 หน้าสาธารณะใช้บล็อกสีและตัวย่อ KP ไม่ใช้ภาพคน AI และไม่เปิดเนื้อหาในป๊อปอัป ใช้เฉพาะลิงก์ที่เผยแพร่แล้ว ห้ามสร้างชื่อหลักสูตร ใบรับรอง หรือวันเผยแพร่</p>
              <Field label="หัวข้อ">
                <input className="crm-field" value={content.related.title} onChange={(event) => patchContent({ ...content, related: { ...content.related, title: event.target.value } })} />
              </Field>
              <Field label="คำนำ">
                <textarea className="crm-field" rows={2} value={content.related.lead} onChange={(event) => patchContent({ ...content, related: { ...content.related, lead: event.target.value } })} />
              </Field>
              <ImagePreview src={content.related.visual.src} alt={content.related.visual.altTh || content.related.visual.altEn} recommended="Training Guide / Academy Course — Sample Cover · 1200×800 · 3:2. Public page uses a colour-block cover, not a people photo." />
              {content.related.cards.map((row, index) => {
                const patchCard = (next: Partial<typeof row>) =>
                  patchContent({
                    ...content,
                    related: { ...content.related, cards: content.related.cards.map((item, i) => (i === index ? { ...item, ...next } : item)) },
                  });
                return (
                  <div key={row.id} className="crm-cms-repeat">
                    <Field label="หมวด TH">
                      <input className="crm-field" value={row.categoryTh} onChange={(event) => patchCard({ categoryTh: event.target.value })} />
                    </Field>
                    <Field label="Category EN">
                      <input className="crm-field" value={row.categoryEn} onChange={(event) => patchCard({ categoryEn: event.target.value })} />
                    </Field>
                    <Field label="หัวข้อไทย">
                      <input className="crm-field" value={row.titleTh} onChange={(event) => patchCard({ titleTh: event.target.value })} />
                    </Field>
                    <Field label="Title EN">
                      <input className="crm-field" value={row.titleEn} onChange={(event) => patchCard({ titleEn: event.target.value })} />
                    </Field>
                    <Field label="คำอธิบายไทย">
                      <textarea className="crm-field" rows={2} value={row.descriptionTh} onChange={(event) => patchCard({ descriptionTh: event.target.value })} />
                    </Field>
                    <Field label="Description EN">
                      <textarea className="crm-field" rows={2} value={row.descriptionEn} onChange={(event) => patchCard({ descriptionEn: event.target.value })} />
                    </Field>
                    <Field label="ประเภทเนื้อหา TH">
                      <input className="crm-field" value={row.contentTypeTh} onChange={(event) => patchCard({ contentTypeTh: event.target.value })} />
                    </Field>
                    <Field label="Content type EN" hint="article / course / checklist / guide">
                      <input className="crm-field" value={row.contentTypeEn} onChange={(event) => patchCard({ contentTypeEn: event.target.value })} />
                    </Field>
                    <Field label="Published date" hint="ISO date only when verified. Leave empty if unknown.">
                      <input className="crm-field" value={row.publishedAt} onChange={(event) => patchCard({ publishedAt: event.target.value })} />
                    </Field>
                    <Field label="Updated date">
                      <input className="crm-field" value={row.updatedAt} onChange={(event) => patchCard({ updatedAt: event.target.value })} />
                    </Field>
                    <Field label="ลิงก์">
                      <input className="crm-field" value={row.href} onChange={(event) => patchCard({ href: event.target.value })} />
                    </Field>
                    <Field label="ป้ายปุ่ม TH">
                      <input className="crm-field" value={row.ctaTh} onChange={(event) => patchCard({ ctaTh: event.target.value })} />
                    </Field>
                    <Field label="CTA EN">
                      <input className="crm-field" value={row.ctaEn} onChange={(event) => patchCard({ ctaEn: event.target.value })} />
                    </Field>
                    <label className="crm-cms-field">
                      <span>
                        <input type="checkbox" checked={row.external} onChange={(event) => patchCard({ external: event.target.checked })} /> ลิงก์ภายนอก / External
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
                );
              })}
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, related: { ...content.related, cards: [...content.related.cards, blankHotelTrainingRelatedCard()] } })}>
                เพิ่มการ์ด / Add card
              </button>
            </section>
          ) : null}

          {tab === "form" ? (
            <section className="crm-cms-block">
              <h2>Contact</h2>
              <p>Dummy 1200×600 · /images/hotel-training-contact-process-placeholder.webp · display 420×210 · 2:1 · What Happens Next — Sample process. Public form does not ask for employee names, assessment scores, or guest data. Submit label is ส่งคำขอ / Send request. No alert() or popup.</p>
              <Field label="หัวข้อฟอร์ม">
                <input className="crm-field" value={content.form.heading} onChange={(event) => patchContent({ ...content, form: { ...content.form, heading: event.target.value } })} />
              </Field>
              <Field label="คำนำฟอร์ม">
                <textarea className="crm-field" rows={3} value={content.form.lead} onChange={(event) => patchContent({ ...content, form: { ...content.form, lead: event.target.value } })} />
              </Field>
              <Field label="ข้อความยินยอม TH">
                <textarea className="crm-field" rows={2} value={content.form.labels.consentTh} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, consentTh: event.target.value } } })} />
              </Field>
              <Field label="Consent EN">
                <textarea className="crm-field" rows={2} value={content.form.labels.consentEn} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, consentEn: event.target.value } } })} />
              </Field>
              <Field label="ป้ายนโยบาย TH">
                <input className="crm-field" value={content.form.labels.privacyTh} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, privacyTh: event.target.value } } })} />
              </Field>
              <Field label="Privacy label EN">
                <input className="crm-field" value={content.form.labels.privacyEn} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, privacyEn: event.target.value } } })} />
              </Field>
              <Field label="ป้ายบังคับ TH">
                <input className="crm-field" value={content.form.labels.requiredTh} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, requiredTh: event.target.value } } })} />
              </Field>
              <Field label="Required label EN">
                <input className="crm-field" value={content.form.labels.requiredEn} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, requiredEn: event.target.value } } })} />
              </Field>
              <Field label="ข้อความกรอกไม่ครบ TH">
                <input className="crm-field" value={content.form.labels.requiredMsgTh} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, requiredMsgTh: event.target.value } } })} />
              </Field>
              <Field label="Required validation EN">
                <input className="crm-field" value={content.form.labels.requiredMsgEn} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, requiredMsgEn: event.target.value } } })} />
              </Field>
              <Field label="ข้อความต้องยินยอม TH">
                <input className="crm-field" value={content.form.labels.consentRequiredTh} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, consentRequiredTh: event.target.value } } })} />
              </Field>
              <Field label="Consent validation EN">
                <input className="crm-field" value={content.form.labels.consentRequiredEn} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, consentRequiredEn: event.target.value } } })} />
              </Field>
              <Field label="ป้ายปุ่มส่ง TH">
                <input className="crm-field" value={content.form.labels.submitTh} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, submitTh: event.target.value } } })} />
              </Field>
              <Field label="Submit EN">
                <input className="crm-field" value={content.form.labels.submitEn} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, submitEn: event.target.value } } })} />
              </Field>
              <Field label="ข้อความห้ามข้อมูลลับ TH">
                <input className="crm-field" value={content.form.labels.secretMsgTh} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, secretMsgTh: event.target.value } } })} />
              </Field>
              <Field label="Secret validation EN">
                <input className="crm-field" value={content.form.labels.secretMsgEn} onChange={(event) => patchContent({ ...content, form: { ...content.form, labels: { ...content.form.labels, secretMsgEn: event.target.value } } })} />
              </Field>
              <ImagePreview src={content.form.visual.src} alt={content.form.visual.altTh || content.form.visual.altEn} recommended="What Happens Next — Sample process · 1200×600 · 2:1. Public page uses a colour-block process, not a people photo." />
            </section>
          ) : null}

          {tab === "faq" ? (
            <section className="crm-cms-block">
              <h2>FAQ</h2>
              <Field label="คำนำ FAQ ไทย">
                <textarea className="crm-field" rows={2} value={content.faqLead} onChange={(event) => patchContent({ ...content, faqLead: event.target.value })} />
              </Field>
              <Field label="FAQ lead EN">
                <textarea className="crm-field" rows={2} value={content.faqLeadEn} onChange={(event) => patchContent({ ...content, faqLeadEn: event.target.value })} />
              </Field>
              {content.faqs.map((row, index) => (
                <div key={row.id} className="crm-cms-repeat">
                  <Field label="คำถามไทย">
                    <input className="crm-field" value={row.qTh} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((item, i) => (i === index ? { ...item, qTh: event.target.value } : item)) })} />
                  </Field>
                  <Field label="Question EN">
                    <input className="crm-field" value={row.qEn} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((item, i) => (i === index ? { ...item, qEn: event.target.value } : item)) })} />
                  </Field>
                  <Field label="คำตอบไทย">
                    <textarea className="crm-field" rows={3} value={row.aTh} onChange={(event) => patchContent({ ...content, faqs: content.faqs.map((item, i) => (i === index ? { ...item, aTh: event.target.value } : item)) })} />
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
              <button type="button" className="crm-users-secondary" onClick={() => patchContent({ ...content, faqs: [...content.faqs, { id: newHotelTrainingItemId("faq"), qTh: "", qEn: "", aTh: "", aEn: "" }] })}>
                เพิ่มคำถาม / Add FAQ
              </button>
            </section>
          ) : null}

          {tab === "seo" ? (
            <section className="crm-cms-block">
              <h2>SEO</h2>
              <Field label="ชื่อเพจ">
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
              <VisualFields slot="social" visual={content.seo.social} hint="รูป Open Graph ไม่บังคับ" />
            </section>
          ) : null}

          {tab === "publish" ? (
            <section className="crm-cms-block">
              <h2>Publish</h2>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={content.bilingualPublish} onChange={(event) => patchContent({ ...content, bilingualPublish: event.target.checked })} /> เผยแพร่สองภาษา ต้องมี FAQ ไทย-อังกฤษ
                </span>
              </label>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={content.approvals.teamPhotos} onChange={(event) => patchContent({ ...content, approvals: { ...content.approvals, teamPhotos: event.target.checked } })} /> อนุมัติภาพผู้เข้าร่วม / Participant photo permission
                </span>
              </label>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={content.approvals.results} onChange={(event) => patchContent({ ...content, approvals: { ...content.approvals, results: event.target.checked } })} /> อนุมัติผลลัพธ์ตัวเลข / Review numeric outcomes
                </span>
              </label>
              <Field label="หมายเหตุหลักฐาน / Evidence note">
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
        <div className="crm-dialog" role="dialog" aria-modal="true" aria-labelledby="hotel-training-dialog-title">
          <div className="crm-dialog-card">
            <h2 id="hotel-training-dialog-title">{dialog === "unpublish" ? "ยกเลิกเผยแพร่ / Unpublish" : "คัดลอกไปภาษาอื่น / Duplicate to another language"}</h2>
            {dialog === "unpublish" ? (
              <p>หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ดจนกว่าจะเผยแพร่อีกครั้ง.</p>
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
                style={{ background: "#a2dc25", color: "#0b1f33" }}
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
