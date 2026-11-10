"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import {
  SOLUTIONS_INDEX_REVIEW_STATUSES,
  SOLUTIONS_INDEX_VISUAL_STATUSES,
  blankSolutionsIndexCard,
  blankSolutionsIndexCategory,
  blankSolutionsIndexChain,
  blankSolutionsIndexChallenge,
  blankSolutionsIndexChallengeMatch,
  blankSolutionsIndexFaq,
  blankSolutionsIndexLine,
  blankSolutionsIndexProcessStep,
  blankSolutionsIndexProofItem,
  solutionsIndexCmsErrorMessage,
  solutionsIndexCmsNotice,
  type CmsSolutionsIndexPage,
  type CmsSolutionsIndexVisual,
  type SolutionsIndexCmsIntent,
  type SolutionsIndexCmsSaveResult,
  type SolutionsIndexEditorState,
  type SolutionsIndexVisualStatus,
} from "@/lib/cms/solutions-index-page";

type Page = CmsSolutionsIndexPage;
type SectionKey = "hero" | "finder" | "categories" | "cards" | "relationships" | "proof" | "cta" | "process" | "seo" | "approvals";

const LOCALE_OPTIONS = [
  { id: "th", label: "ไทย" },
  { id: "en", label: "English" },
  { id: "ru", label: "Русский" },
  { id: "zh", label: "繁體中文" },
] as const;

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "finder", label: "Finder" },
  { id: "categories", label: "Categories" },
  { id: "cards", label: "Service cards" },
  { id: "relationships", label: "Relationships" },
  { id: "proof", label: "Proof" },
  { id: "cta", label: "CTA" },
  { id: "process", label: "Process" },
  { id: "faq", label: "FAQ" },
  { id: "seo", label: "SEO" },
  { id: "publish", label: "Approvals" },
] as const;

const TAB_GROUPS: Array<{ label: string; ids: Array<(typeof TABS)[number]["id"]> }> = [
  { label: "เนื้อหาหลัก", ids: ["hero", "finder", "categories", "cards"] },
  { label: "ความสัมพันธ์และหลักฐาน", ids: ["relationships", "proof", "cta", "process"] },
  { label: "FAQ และเผยแพร่", ids: ["faq", "seo", "publish"] },
];

type Tab = (typeof TABS)[number]["id"];

const LINK_LIST_ID = "solutions-index-service-links";

function isTab(value: string | undefined): value is Tab {
  return TABS.some((tab) => tab.id === value);
}

function fileFieldName(slot: string) {
  if (slot === "hero") return "heroImageFile";
  if (slot === "cta") return "ctaImageFile";
  if (slot === "social") return "ogImageFile";
  return `cardIconFile-${slot.slice(5)}`;
}

function clearFieldName(slot: string) {
  if (slot === "hero") return "clearHeroImage";
  if (slot === "cta") return "clearCtaImage";
  if (slot === "social") return "clearOgImage";
  return `clearCardIcon-${slot.slice(5)}`;
}

function previewsFrom(content: Page): Record<string, string> {
  return {
    hero: content.hero.visual.src,
    cta: content.cta.visual.src,
    social: content.seo.social.src,
    ...Object.fromEntries(content.cards.items.map((card) => [`card-${card.id}`, card.icon.src])),
  };
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const next = index + direction;
  if (next < 0 || next >= items.length) return items;
  const copy = [...items];
  const [row] = copy.splice(index, 1);
  copy.splice(next, 0, row);
  return copy;
}

/* ----------------------------------------------------- stable sub-components */

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="crm-cms-field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function TextInput({ label, value, onChange, hint, list }: { label: string; value: string; onChange: (next: string) => void; hint?: string; list?: string }) {
  return (
    <Field label={label} hint={hint}>
      <input className="crm-field" value={value} list={list} onChange={(event) => onChange(event.target.value)} />
    </Field>
  );
}

function TextArea({ label, value, onChange, rows = 3, hint }: { label: string; value: string; onChange: (next: string) => void; rows?: number; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      <textarea className="crm-area crm-cms-page-editor-area" rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </Field>
  );
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <label className="crm-cms-field">
      <span>
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /> {label}
      </span>
    </label>
  );
}

function ReviewStatusField({ value, onChange, hint }: { value: string; onChange: (next: string) => void; hint?: string }) {
  return (
    <Field label="สถานะตรวจ / Review status" hint={hint}>
      <select className="crm-field" value={value} onChange={(event) => onChange(event.target.value)}>
        {SOLUTIONS_INDEX_REVIEW_STATUSES.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function CtaFields({ label, value, onChange }: { label: string; value: { label: string; href: string }; onChange: (next: { label: string; href: string }) => void }) {
  return (
    <>
      <TextInput label={`${label} — ข้อความ / Label`} value={value.label} onChange={(next) => onChange({ ...value, label: next })} />
      <TextInput label={`${label} — ลิงก์ / Link`} value={value.href} hint="# anchor, /path, https://, mailto: หรือ tel:" onChange={(next) => onChange({ ...value, href: next })} />
    </>
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

function ListEditor<T extends { id: string }>({
  items,
  onChange,
  onRemoved,
  renderItem,
  blank,
  addLabel,
  itemLabel,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  onRemoved: () => void;
  renderItem: (item: T, patch: (next: Partial<T>) => void, index: number) => ReactNode;
  blank: () => T;
  addLabel: string;
  itemLabel: (item: T, index: number) => string;
}) {
  return (
    <div className="crm-cms-page-editor-grid">
      {items.map((item, index) => {
        const name = itemLabel(item, index);
        const patch = (next: Partial<T>) => onChange(items.map((row, i) => (i === index ? { ...row, ...next } : row)));
        return (
          <div key={item.id} className="crm-cms-contact-step-card" role="group" aria-label={name}>
            <div className="crm-cms-faq-item-head">
              <strong>{name}</strong>
              <div className="crm-cms-actions">
                <button
                  type="button"
                  className="crm-users-secondary"
                  disabled={index === 0}
                  aria-label={`${name} — ขึ้น`}
                  onClick={() => onChange(moveItem(items, index, -1))}
                >
                  ขึ้น
                </button>
                <button
                  type="button"
                  className="crm-users-secondary"
                  disabled={index === items.length - 1}
                  aria-label={`${name} — ลง`}
                  onClick={() => onChange(moveItem(items, index, 1))}
                >
                  ลง
                </button>
                <button
                  type="button"
                  className="crm-users-secondary"
                  aria-label={`${name} — ลบ`}
                  onClick={() => {
                    if (!window.confirm(`ลบ “${name}” ใช่หรือไม่? การกระทำนี้ยังไม่บันทึกจนกว่าจะกดบันทึก`)) return;
                    onChange(items.filter((_, i) => i !== index));
                    onRemoved();
                  }}
                >
                  ลบ
                </button>
              </div>
            </div>
            {renderItem(item, patch, index)}
          </div>
        );
      })}
      <button type="button" className="crm-users-secondary" onClick={() => onChange([...items, blank()])}>
        {addLabel}
      </button>
    </div>
  );
}

function Dialog({ titleId, descriptionId, onClose, children }: { titleId: string; descriptionId: string; onClose: () => void; children: ReactNode }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () =>
      nodeRef.current
        ? Array.from(nodeRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((el) => !el.hasAttribute("disabled"))
        : [];
    focusables()[0]?.focus();
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, []);
  return (
    <div ref={nodeRef} className="crm-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <div className="crm-dialog-card">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ editor */

export function SolutionsIndexPageEditor({
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
  initial: SolutionsIndexEditorState;
  notice?: string;
  error?: string;
  saveAction: (formData: FormData) => Promise<SolutionsIndexCmsSaveResult>;
  duplicateAction: (formData: FormData) => Promise<SolutionsIndexCmsSaveResult>;
  updatedAt?: string;
  initialTab?: string;
  previewHref: string;
  publicHref: string;
  locales?: Array<{ id: string; locale: string; status: string; title: string }>;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileHolders = useRef<Record<string, HTMLInputElement | null>>({});
  const [tab, setTab] = useState<Tab>(isTab(initialTab) ? initialTab : "hero");
  const [meta, setMeta] = useState({
    title: initial.title,
    seoTitle: initial.seoTitle,
    metaDescription: initial.metaDescription,
    excerpt: initial.excerpt,
    locale: initial.locale,
    status: initial.status,
  });
  const [content, setContent] = useState<Page>(initial.content);
  const [status, setStatus] = useState(error ? solutionsIndexCmsErrorMessage(error) : "");
  const [note, setNote] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<"unpublish" | "duplicate" | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [targetLocale, setTargetLocale] = useState("en");
  const [dirty, setDirty] = useState(false);
  const [previews, setPreviews] = useState<Record<string, string>>(() => previewsFrom(initial.content));
  const [clears, setClears] = useState<Record<string, boolean>>({});
  const firstSync = useRef(true);
  const activeTab = useMemo(() => TABS.find((item) => item.id === tab) ?? TABS[0], [tab]);
  const localeLabel = LOCALE_OPTIONS.find((item) => item.id === meta.locale)?.label ?? meta.locale;

  // After a save, router.refresh() delivers a new updatedAt. Adopt the stored content
  // (new image paths) and drop pending file inputs, unless the user has already started editing again.
  useEffect(() => {
    if (firstSync.current) {
      firstSync.current = false;
      return;
    }
    if (dirty) return;
    Object.values(fileHolders.current).forEach((holder) => {
      if (holder) holder.value = "";
    });
    setContent(initial.content);
    setMeta({
      title: initial.title,
      seoTitle: initial.seoTitle,
      metaDescription: initial.metaDescription,
      excerpt: initial.excerpt,
      locale: initial.locale,
      status: initial.status,
    });
    setPreviews(previewsFrom(initial.content));
    setClears({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedAt]);

  useEffect(() => {
    if (!dirty) return;
    const onUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [dirty]);

  function markDirty() {
    setDirty(true);
    setNote("");
    setStatus("");
  }

  function patchContent(next: Page) {
    setContent(next);
    markDirty();
  }

  function patchMeta(next: Partial<typeof meta>) {
    setMeta((current) => ({ ...current, ...next }));
    markDirty();
  }

  function setSection<K extends SectionKey>(key: K, value: Partial<Page[K]>) {
    patchContent({ ...content, [key]: { ...(content[key] as object), ...(value as object) } } as Page);
  }

  function announceRemoved() {
    setNote(solutionsIndexCmsNotice("removed"));
  }

  function patchVisual(slot: string, visual: CmsSolutionsIndexVisual) {
    if (slot === "hero") setSection("hero", { visual });
    else if (slot === "cta") setSection("cta", { visual });
    else if (slot === "social") setSection("seo", { social: visual });
    else {
      const id = slot.slice(5);
      setSection("cards", { items: content.cards.items.map((card) => (card.id === id ? { ...card, icon: visual } : card)) });
    }
  }

  function visualFields(slot: string, visual: CmsSolutionsIndexVisual, hint: string) {
    const patch = (next: Partial<CmsSolutionsIndexVisual>) => patchVisual(slot, { ...visual, ...next });
    const hasImage = Boolean((previews[slot] || visual.src) && !clears[slot]);
    return (
      <>
        <TextInput label="คำอธิบายภาพภาษาไทย (alt TH)" value={visual.altTh} onChange={(next) => patch({ altTh: next })} />
        <TextInput label="Alt text (English)" value={visual.altEn} onChange={(next) => patch({ altEn: next })} />
        <TextInput label="ป้ายกำกับรูป / Label" value={visual.label} onChange={(next) => patch({ label: next })} />
        <TextInput label="คำบรรยายใต้ภาพ / Caption" value={visual.caption} onChange={(next) => patch({ caption: next })} />
        <Field label="สถานะรูป / Image status" hint="หน้าสาธารณะแสดงรูปที่ Approved และได้รับอนุญาตเท่านั้น นอกนั้นใช้ภาพ Sample ของระบบ">
          <select className="crm-field" value={visual.status} onChange={(event) => patch({ status: event.target.value as SolutionsIndexVisualStatus })}>
            {SOLUTIONS_INDEX_VISUAL_STATUSES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <TextInput label="แหล่งที่มา / Source" value={visual.source} onChange={(next) => patch({ source: next })} />
        <TextArea label="หมายเหตุสิทธิ์ใช้ภาพ / Approval note" rows={2} value={visual.approvalNote} onChange={(next) => patch({ approvalNote: next })} />
        <CheckField label="อนุมัติเผยแพร่ภาพจริง / Publication approval" checked={visual.publicationApproved} onChange={(next) => patch({ publicationApproved: next })} />
        <Field label="แทนที่รูป / Replace image" hint={hint}>
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
              const previous = previews[slot];
              if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
              setPreviews((current) => ({ ...current, [slot]: URL.createObjectURL(file) }));
              setClears((current) => ({ ...current, [slot]: false }));
              patchVisual(slot, { ...visual, status: visual.status === "replace" ? "sample" : visual.status });
            }}
          />
        </Field>
        <ImagePreview src={clears[slot] ? "" : previews[slot] || ""} alt={visual.altTh || visual.altEn} recommended={hint} />
        {hasImage ? (
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
            ลบรูป / Remove image
          </button>
        ) : null}
      </>
    );
  }

  function submit(intent: SolutionsIndexCmsIntent) {
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
      if (on) data.set(clearFieldName(slot), "1");
    });
    startTransition(async () => {
      setNote("");
      setStatus("");
      const result = await saveAction(data);
      if (!result.ok) {
        setStatus(solutionsIndexCmsErrorMessage(result.error));
        return;
      }
      if (intent === "publish") setMeta((current) => ({ ...current, status: "published" }));
      if (intent === "draft" || intent === "unpublish") setMeta((current) => ({ ...current, status: "draft" }));
      setNote(intent === "preview" ? solutionsIndexCmsNotice("preview") : solutionsIndexCmsNotice("saved"));
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
      setNote("");
      setStatus("");
      const result = await duplicateAction(data);
      if (!result.ok) {
        setStatus(solutionsIndexCmsErrorMessage(result.error));
        return;
      }
      setNote(solutionsIndexCmsNotice("duplicate"));
      setDirty(false);
      router.push(`/crm/cms/pages/${result.id}?tab=hero`);
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = (submitter?.value as SolutionsIndexCmsIntent) || "save";
    if (intent === "unpublish") {
      setDialog("unpublish");
      return;
    }
    submit(intent);
  }

  const saveState = pending
    ? solutionsIndexCmsNotice("pending")
    : status
      ? status
      : dirty
        ? solutionsIndexCmsNotice("dirty")
        : note || solutionsIndexCmsNotice("ready");

  const groupOptions = content.categories.items.map((item) => ({ id: item.id, label: item.titleEn || item.titleTh || item.id }));

  return (
    <form ref={formRef} className="crm-cms-form crm-cms-page-editor" onSubmit={onSubmit}>
      <input type="hidden" name="id" value={initial.id} />
      <input type="hidden" name="locale" value={meta.locale} />
      {(["hero", "cta", "social"] as const).map((slot) => (
        <input
          key={slot}
          ref={(node) => {
            fileHolders.current[slot] = node;
          }}
          type="file"
          name={fileFieldName(slot)}
          accept=".jpg,.jpeg,.png,.webp"
          hidden
          aria-hidden="true"
          tabIndex={-1}
        />
      ))}
      {content.cards.items.map((card) => (
        <input
          key={card.id}
          ref={(node) => {
            fileHolders.current[`card-${card.id}`] = node;
          }}
          type="file"
          name={fileFieldName(`card-${card.id}`)}
          accept=".jpg,.jpeg,.png,.webp"
          hidden
          aria-hidden="true"
          tabIndex={-1}
        />
      ))}
      <datalist id={LINK_LIST_ID}>
        {content.cards.items.map((card) => (
          <option key={card.id} value={card.href} />
        ))}
      </datalist>

      <div className="crm-cms-page-editor-savebar">
        <div className="crm-cms-page-editor-savebar-actions">
          <Link href={previewHref} className="crm-users-secondary">
            ดูตัวอย่าง
          </Link>
          <button className="crm-users-secondary" type="submit" name="intent" value="save" disabled={pending}>
            บันทึก
          </button>
          <button className="crm-users-secondary" type="submit" name="intent" value="draft" disabled={pending}>
            บันทึกฉบับร่าง
          </button>
          <button className="kpi-button crm-users-primary" type="submit" name="intent" value="publish" disabled={pending}>
            {pending ? "กำลังบันทึก…" : "เผยแพร่"}
          </button>
          <div className="crm-cms-page-editor-more">
            <button type="button" className="crm-users-secondary" disabled={pending} aria-expanded={moreOpen} onClick={() => setMoreOpen((open) => !open)}>
              เพิ่มเติม
            </button>
            {moreOpen ? (
              <div className="crm-cms-page-editor-more-menu" role="menu">
                <button type="submit" name="intent" value="preview" className="crm-users-secondary" disabled={pending} role="menuitem">
                  บันทึกแล้วดูตัวอย่าง
                </button>
                {meta.status === "published" ? (
                  <button type="button" className="crm-users-secondary" disabled={pending} role="menuitem" onClick={() => setDialog("unpublish")}>
                    ยกเลิกเผยแพร่
                  </button>
                ) : null}
                <button type="button" className="crm-users-secondary" disabled={pending} role="menuitem" onClick={() => setDialog("duplicate")}>
                  คัดลอกไปภาษาอื่น
                </button>
                <Link href={publicHref} className="crm-users-secondary" target="_blank" rel="noreferrer" role="menuitem">
                  เปิดหน้าเว็บ
                </Link>
              </div>
            ) : null}
          </div>
        </div>
        <p
          className={`crm-cms-page-editor-save-state${pending ? " is-pending" : status ? " is-error" : dirty ? " is-dirty" : note ? " is-ok" : ""}`}
          role={status ? "alert" : "status"}
          aria-live={status ? "assertive" : "polite"}
        >
          {saveState}
        </p>
      </div>

      {note && !status ? (
        <p className="crm-users-alert is-ok" role="status">
          {note}
        </p>
      ) : null}
      {status ? (
        <p className="crm-users-alert is-warn" role="alert">
          {status}
        </p>
      ) : null}

      <div className="crm-cms-page-editor-layout">
        <aside className="crm-cms-page-editor-nav" aria-label="ส่วนของหน้า">
          <label className="crm-cms-page-editor-nav-mobile">
            <span>ส่วนที่แก้ไข</span>
            <select className="crm-select" value={tab} onChange={(event) => setTab(event.target.value as Tab)}>
              {TAB_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.ids.map((id) => {
                    const item = TABS.find((tabItem) => tabItem.id === id);
                    return item ? (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ) : null;
                  })}
                </optgroup>
              ))}
            </select>
          </label>
          <nav className="crm-cms-page-editor-nav-desktop" aria-label="กลุ่มส่วนเนื้อหา">
            {TAB_GROUPS.map((group) => (
              <div key={group.label} className="crm-cms-page-editor-nav-group">
                <p className="crm-cms-page-editor-nav-label">{group.label}</p>
                <div className="crm-cms-page-editor-nav-list" role="tablist" aria-label={group.label}>
                  {group.ids.map((id) => {
                    const item = TABS.find((tabItem) => tabItem.id === id);
                    if (!item) return null;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        id={`solutions-index-cms-tab-${item.id}`}
                        role="tab"
                        aria-selected={tab === item.id}
                        aria-controls="solutions-index-cms-panel"
                        className={`crm-cms-page-editor-nav-item${tab === item.id ? " is-active" : ""}`}
                        onClick={() => setTab(item.id)}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <div className="crm-cms-page-editor-main">
          <div className="crm-cms-page-editor-toolbar">
            <div>
              <p className="crm-cms-page-editor-section-kicker">กำลังแก้ไข</p>
              <h2 className="crm-cms-page-editor-section-title">{activeTab.label}</h2>
            </div>
            <p className="crm-cms-page-editor-lang-note">ภาษาเอกสาร: {localeLabel} · สถานะ {meta.status === "published" ? "เผยแพร่" : "ฉบับร่าง"}</p>
          </div>

          <div id="solutions-index-cms-panel" className="crm-cms-page-editor-panel" role="tabpanel" aria-labelledby={`solutions-index-cms-tab-${tab}`}>
          {tab === "hero" ? (
            <section className="crm-cms-block">
              <h2>Hero</h2>
              <TextInput label="Eyebrow" value={content.hero.eyebrow} onChange={(next) => setSection("hero", { eyebrow: next })} />
              <TextArea label="หัวข้อ / Title" rows={2} value={content.hero.title} onChange={(next) => setSection("hero", { title: next })} />
              <TextArea label="คำอธิบาย / Body" rows={4} value={content.hero.body} onChange={(next) => setSection("hero", { body: next })} />
              <TextArea label="ข้อความสนับสนุน / Support line" rows={2} value={content.hero.supportLine} onChange={(next) => setSection("hero", { supportLine: next })} />
              <CtaFields label="ปุ่มหลัก / Primary" value={content.hero.primaryCta} onChange={(next) => setSection("hero", { primaryCta: next })} />
              <CtaFields label="ปุ่มรอง / Secondary" value={content.hero.secondaryCta} onChange={(next) => setSection("hero", { secondaryCta: next })} />
              <h3>แผนภาพลำดับ / Flow steps</h3>
              <ListEditor
                items={content.hero.flow}
                onChange={(flow) => setSection("hero", { flow })}
                onRemoved={announceRemoved}
                blank={() => blankSolutionsIndexLine("flow")}
                addLabel="เพิ่มขั้น / Add step"
                itemLabel={(item, index) => `ขั้น ${index + 1} / Step ${index + 1}${item.en ? ` — ${item.en}` : ""}`}
                renderItem={(item, patch) => (
                  <>
                    <TextInput label="ไทย" value={item.th} onChange={(th) => patch({ th })} />
                    <TextInput label="English" value={item.en} onChange={(en) => patch({ en })} />
                  </>
                )}
              />
              <h3>ภาพ Hero / Hero visual</h3>
              {visualFields("hero", content.hero.visual, "Sample 1600×1000 · 8:5 · /images/hotel-solutions-hero-placeholder.webp หน้าสาธารณะใช้ภาพ Sample จนกว่าภาพจริงจะ Approved และได้รับอนุญาต")}
            </section>
          ) : null}

          {tab === "finder" ? (
            <section className="crm-cms-block">
              <h2>Service finder</h2>
              <TextInput label="Eyebrow" value={content.finder.eyebrow} onChange={(next) => setSection("finder", { eyebrow: next })} />
              <TextInput label="หัวข้อ / Title" value={content.finder.title} onChange={(next) => setSection("finder", { title: next })} />
              <TextArea label="หมายเหตุเริ่มต้น / Start note" rows={2} value={content.finder.startNote} onChange={(next) => setSection("finder", { startNote: next })} />
              <TextInput label="คำชี้แจงตัวเลือก / Challenge legend" value={content.finder.challengeLegend} onChange={(next) => setSection("finder", { challengeLegend: next })} />
              <TextInput label="หัวข้อสถานะว่าง / Empty title" value={content.finder.emptyTitle} onChange={(next) => setSection("finder", { emptyTitle: next })} />
              <TextArea label="ข้อความสถานะว่าง / Empty body" rows={3} value={content.finder.emptyBody} onChange={(next) => setSection("finder", { emptyBody: next })} />
              <TextInput label="หัวข้อผลลัพธ์ / Result title" value={content.finder.resultTitle} onChange={(next) => setSection("finder", { resultTitle: next })} />
              <TextArea label="คำนำผลลัพธ์ / Result lead" rows={2} value={content.finder.resultLead} onChange={(next) => setSection("finder", { resultLead: next })} />
              <TextInput label="ปุ่มล้างการเลือก / Clear selection" value={content.finder.clearSelection} onChange={(next) => setSection("finder", { clearSelection: next })} />
              <TextInput label="ป้ายเหตุผล / Related why" value={content.finder.relatedWhy} onChange={(next) => setSection("finder", { relatedWhy: next })} />
              <TextInput label="ป้ายรายละเอียด / Details" value={content.finder.details} onChange={(next) => setSection("finder", { details: next })} />
              <TextInput label="ลิงก์ดูทั้งหมด / Browse all" value={content.finder.browseAll} onChange={(next) => setSection("finder", { browseAll: next })} />
              <TextArea label="คำแนะนำเมื่อไม่แน่ใจ / Unsure hint" rows={2} value={content.finder.unsureHint} onChange={(next) => setSection("finder", { unsureHint: next })} />
              <TextInput label="ปุ่มเมื่อไม่แน่ใจ / Unsure CTA" value={content.finder.unsureCta} onChange={(next) => setSection("finder", { unsureCta: next })} />
              <h3>ความท้าทายและบริการที่เกี่ยวข้อง / Challenges and related services</h3>
              <ListEditor
                items={content.finder.challenges}
                onChange={(challenges) => setSection("finder", { challenges })}
                onRemoved={announceRemoved}
                blank={blankSolutionsIndexChallenge}
                addLabel="เพิ่มความท้าทาย / Add challenge"
                itemLabel={(item, index) => `ความท้าทาย ${index + 1} / Challenge ${index + 1}${item.labelEn ? ` — ${item.labelEn}` : ""}`}
                renderItem={(item, patch) => (
                  <>
                    <TextArea label="ข้อความไทย" rows={2} value={item.labelTh} onChange={(labelTh) => patch({ labelTh })} />
                    <TextArea label="Label EN" rows={2} value={item.labelEn} onChange={(labelEn) => patch({ labelEn })} />
                    <h4>บริการที่อาจเกี่ยวข้อง / Related services (advisory, not a diagnosis)</h4>
                    <ListEditor
                      items={item.matches}
                      onChange={(matches) => patch({ matches })}
                      onRemoved={announceRemoved}
                      blank={blankSolutionsIndexChallengeMatch}
                      addLabel="เพิ่มบริการที่เกี่ยวข้อง / Add related service"
                      itemLabel={(match, index) => `บริการ ${index + 1} / Service ${index + 1}${match.href ? ` — ${match.href}` : ""}`}
                      renderItem={(match, patchMatch) => (
                        <>
                          <TextInput label="ลิงก์บริการ / Service link" list={LINK_LIST_ID} value={match.href} onChange={(href) => patchMatch({ href })} />
                          <TextArea label="เหตุผลไทย" rows={2} value={match.reasonTh} onChange={(reasonTh) => patchMatch({ reasonTh })} />
                          <TextArea label="Reason EN" rows={2} value={match.reasonEn} onChange={(reasonEn) => patchMatch({ reasonEn })} />
                        </>
                      )}
                    />
                  </>
                )}
              />
            </section>
          ) : null}

          {tab === "categories" ? (
            <section className="crm-cms-block">
              <h2>Categories</h2>
              <TextInput label="หัวข้อส่วนบริการทั้งหมด / All-groups title" value={content.categories.title} onChange={(next) => setSection("categories", { title: next })} />
              <ListEditor
                items={content.categories.items}
                onChange={(items) => setSection("categories", { items })}
                onRemoved={announceRemoved}
                blank={blankSolutionsIndexCategory}
                addLabel="เพิ่มกลุ่ม / Add group"
                itemLabel={(item, index) => `กลุ่ม ${index + 1} / Group ${index + 1}${item.titleEn ? ` — ${item.titleEn}` : ""}`}
                renderItem={(item, patch) => (
                  <>
                    <p>
                      <small>
                        รหัสกลุ่ม / Group ID: <code>{item.id}</code>
                      </small>
                    </p>
                    <TextInput label="ชื่อกลุ่มไทย" value={item.titleTh} onChange={(titleTh) => patch({ titleTh })} />
                    <TextInput label="Group title EN" value={item.titleEn} onChange={(titleEn) => patch({ titleEn })} />
                    <TextArea label="คำอธิบายไทย" rows={2} value={item.bodyTh} onChange={(bodyTh) => patch({ bodyTh })} />
                    <TextArea label="Description EN" rows={2} value={item.bodyEn} onChange={(bodyEn) => patch({ bodyEn })} />
                  </>
                )}
              />
            </section>
          ) : null}

          {tab === "cards" ? (
            <section className="crm-cms-block">
              <h2>Service cards</h2>
              <TextInput label="ป้าย “เหมาะกับ” / Suitable-for label" value={content.cards.suitableForLabel} onChange={(next) => setSection("cards", { suitableForLabel: next })} />
              <TextInput label="ป้ายสิ่งที่อาจได้ / Deliverable label" value={content.cards.deliverableLabel} onChange={(next) => setSection("cards", { deliverableLabel: next })} />
              <TextInput label="ปุ่มดูรายละเอียด / View details" value={content.cards.viewDetails} onChange={(next) => setSection("cards", { viewDetails: next })} />
              <ListEditor
                items={content.cards.items}
                onChange={(items) => setSection("cards", { items })}
                onRemoved={announceRemoved}
                blank={() => blankSolutionsIndexCard(content.categories.items[0]?.id ?? "")}
                addLabel="เพิ่มการ์ดบริการ / Add service card"
                itemLabel={(item, index) => `การ์ด ${index + 1} / Card ${index + 1}${item.nameEn ? ` — ${item.nameEn}` : ""}`}
                renderItem={(item, patch) => (
                  <>
                    <Field label="กลุ่ม / Group">
                      <select className="crm-field" value={item.groupId} onChange={(event) => patch({ groupId: event.target.value })}>
                        {!groupOptions.some((option) => option.id === item.groupId) ? <option value={item.groupId}>{item.groupId || "—"}</option> : null}
                        {groupOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <TextInput label="ลิงก์หน้าบริการ / Service link" value={item.href} hint="เช่น /solutions/hotel-website-design — ใส่เฉพาะหน้าที่มีอยู่จริง" onChange={(href) => patch({ href })} />
                    <CheckField label="แสดงบนหน้า / Visible" checked={item.visible} onChange={(visible) => patch({ visible })} />
                    <TextInput label="ชื่อบริการไทย" value={item.nameTh} onChange={(nameTh) => patch({ nameTh })} />
                    <TextInput label="Service name EN" value={item.nameEn} onChange={(nameEn) => patch({ nameEn })} />
                    <TextArea label="ปัญหาที่แก้ไทย" rows={3} value={item.problemTh} onChange={(problemTh) => patch({ problemTh })} />
                    <TextArea label="Problem EN" rows={3} value={item.problemEn} onChange={(problemEn) => patch({ problemEn })} />
                    <TextArea label="เหมาะกับไทย" rows={2} value={item.suitableTh} onChange={(suitableTh) => patch({ suitableTh })} />
                    <TextArea label="Suitable for EN" rows={2} value={item.suitableEn} onChange={(suitableEn) => patch({ suitableEn })} />
                    <TextArea label="สิ่งที่อาจได้ไทย (ตามขอบเขตที่ตกลง)" rows={2} value={item.deliverableTh} onChange={(deliverableTh) => patch({ deliverableTh })} />
                    <TextArea label="Possible deliverable EN (subject to agreed scope)" rows={2} value={item.deliverableEn} onChange={(deliverableEn) => patch({ deliverableEn })} />
                    <h4>ไอคอนการ์ด / Card icon (optional)</h4>
                    {visualFields(`card-${item.id}`, item.icon, "Icon 256×256 · 1:1 · jpg/png/webp ไม่บังคับ — แสดงเฉพาะเมื่อ Approved และได้รับอนุญาต")}
                  </>
                )}
              />
            </section>
          ) : null}

          {tab === "relationships" ? (
            <section className="crm-cms-block">
              <h2>Relationships — services can connect</h2>
              <p>ตัวอย่างลำดับที่บริการอาจเชื่อมกัน ไม่ใช่แพ็กบังคับ / Illustrative chains only, not a required package.</p>
              <TextInput label="หัวข้อ / Title" value={content.relationships.title} onChange={(next) => setSection("relationships", { title: next })} />
              <TextArea label="หมายเหตุ / Note" rows={2} value={content.relationships.note} onChange={(next) => setSection("relationships", { note: next })} />
              <ListEditor
                items={content.relationships.chains}
                onChange={(chains) => setSection("relationships", { chains })}
                onRemoved={announceRemoved}
                blank={() => blankSolutionsIndexChain(content.categories.items[0]?.id ?? "")}
                addLabel="เพิ่มสายความสัมพันธ์ / Add chain"
                itemLabel={(item, index) => `สาย ${index + 1} / Chain ${index + 1} — ${groupOptions.find((option) => option.id === item.groupId)?.label || item.groupId || "—"}`}
                renderItem={(item, patch) => (
                  <>
                    <Field label="กลุ่ม / Group">
                      <select className="crm-field" value={item.groupId} onChange={(event) => patch({ groupId: event.target.value })}>
                        {!groupOptions.some((option) => option.id === item.groupId) ? <option value={item.groupId}>{item.groupId || "—"}</option> : null}
                        {groupOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <ListEditor
                      items={item.steps}
                      onChange={(steps) => patch({ steps })}
                      onRemoved={announceRemoved}
                      blank={() => blankSolutionsIndexLine("step")}
                      addLabel="เพิ่มขั้น / Add step"
                      itemLabel={(step, index) => `ขั้น ${index + 1} / Step ${index + 1}${step.en ? ` — ${step.en}` : ""}`}
                      renderItem={(step, patchStep) => (
                        <>
                          <TextInput label="ไทย" value={step.th} onChange={(th) => patchStep({ th })} />
                          <TextInput label="English" value={step.en} onChange={(en) => patchStep({ en })} />
                        </>
                      )}
                    />
                  </>
                )}
              />
            </section>
          ) : null}

          {tab === "proof" ? (
            <section className="crm-cms-block">
              <h2>Proof</h2>
              <p>
                เริ่มต้นว่างเปล่า ไม่มีตัวเลขสมมติ รายการจะแสดงสาธารณะเมื่อ Verified, ได้รับสิทธิ์เผยแพร่ และข้อมูลครบเท่านั้น / Empty by default — no invented metrics. An item appears publicly only
                when Verified, permission-cleared, and complete.
              </p>
              <TextInput label="หัวข้อ / Title" value={content.proof.title} onChange={(next) => setSection("proof", { title: next })} />
              <TextArea label="คำนำ / Lead" rows={2} value={content.proof.lead} onChange={(next) => setSection("proof", { lead: next })} />
              <TextArea label="ข้อความเมื่อยังไม่มีผลงาน / No-proof note" rows={4} value={content.proof.noProofNote} onChange={(next) => setSection("proof", { noProofNote: next })} />
              <ListEditor
                items={content.proof.items}
                onChange={(items) => setSection("proof", { items })}
                onRemoved={announceRemoved}
                blank={blankSolutionsIndexProofItem}
                addLabel="เพิ่มผลงาน / Add proof item"
                itemLabel={(item, index) => `ผลงาน ${index + 1} / Proof ${index + 1}${item.identityEn || item.identityTh ? ` — ${item.identityEn || item.identityTh}` : ""}`}
                renderItem={(item, patch) => (
                  <>
                    <TextInput label="ลูกค้า/ป้ายนิรนามไทย" value={item.identityTh} onChange={(identityTh) => patch({ identityTh })} />
                    <TextInput label="Client or anonymised label EN" value={item.identityEn} onChange={(identityEn) => patch({ identityEn })} />
                    <TextArea label="ความท้าทายไทย" rows={2} value={item.challengeTh} onChange={(challengeTh) => patch({ challengeTh })} />
                    <TextArea label="Challenge EN" rows={2} value={item.challengeEn} onChange={(challengeEn) => patch({ challengeEn })} />
                    <TextArea label="ขอบเขตงานไทย" rows={2} value={item.scopeTh} onChange={(scopeTh) => patch({ scopeTh })} />
                    <TextArea label="Scope EN" rows={2} value={item.scopeEn} onChange={(scopeEn) => patch({ scopeEn })} />
                    <TextInput label="ตัวชี้วัดไทย" value={item.metricTh} onChange={(metricTh) => patch({ metricTh })} />
                    <TextInput label="Metric EN" value={item.metricEn} onChange={(metricEn) => patch({ metricEn })} />
                    <TextArea label="นิยามไทย" rows={2} value={item.definitionTh} onChange={(definitionTh) => patch({ definitionTh })} />
                    <TextArea label="Definition EN" rows={2} value={item.definitionEn} onChange={(definitionEn) => patch({ definitionEn })} />
                    <TextInput label="ช่วงเวลาไทย" value={item.periodTh} onChange={(periodTh) => patch({ periodTh })} />
                    <TextInput label="Period EN" value={item.periodEn} onChange={(periodEn) => patch({ periodEn })} />
                    <TextInput label="แหล่งที่มาไทย" value={item.sourceTh} onChange={(sourceTh) => patch({ sourceTh })} />
                    <TextInput label="Source EN" value={item.sourceEn} onChange={(sourceEn) => patch({ sourceEn })} />
                    <TextInput label="วันที่ทบทวนล่าสุด / Latest review date" value={item.reviewedAt} hint="YYYY-MM-DD" onChange={(reviewedAt) => patch({ reviewedAt })} />
                    <ReviewStatusField value={item.reviewStatus} onChange={(reviewStatus) => patch({ reviewStatus })} hint="Verified ต้องกรอกครบทุกช่อง" />
                    <CheckField label="ได้รับสิทธิ์เผยแพร่ / Publication permission" checked={item.publicationApproved} onChange={(publicationApproved) => patch({ publicationApproved })} />
                  </>
                )}
              />
            </section>
          ) : null}

          {tab === "cta" ? (
            <section className="crm-cms-block">
              <h2>CTA — not sure where to begin</h2>
              <TextInput label="หัวข้อ / Title" value={content.cta.title} onChange={(next) => setSection("cta", { title: next })} />
              <TextArea label="คำอธิบาย / Body" rows={3} value={content.cta.body} onChange={(next) => setSection("cta", { body: next })} />
              <h3>สิ่งที่การคุยครั้งแรกช่วยได้ / What a first conversation helps with</h3>
              <ListEditor
                items={content.cta.helps}
                onChange={(helps) => setSection("cta", { helps })}
                onRemoved={announceRemoved}
                blank={() => blankSolutionsIndexLine("help")}
                addLabel="เพิ่มข้อ / Add point"
                itemLabel={(item, index) => `ข้อ ${index + 1} / Point ${index + 1}${item.en ? ` — ${item.en.slice(0, 40)}` : ""}`}
                renderItem={(item, patch) => (
                  <>
                    <TextArea label="ไทย" rows={2} value={item.th} onChange={(th) => patch({ th })} />
                    <TextArea label="English" rows={2} value={item.en} onChange={(en) => patch({ en })} />
                  </>
                )}
              />
              <CtaFields label="ปุ่มหลัก / Primary" value={content.cta.primaryCta} onChange={(next) => setSection("cta", { primaryCta: next })} />
              <CtaFields label="ปุ่มรอง / Secondary" value={content.cta.secondaryCta} onChange={(next) => setSection("cta", { secondaryCta: next })} />
              <h3>ภาพ CTA / CTA visual</h3>
              {visualFields("cta", content.cta.visual, "Sample 1200×600 · 2:1 · /images/hotel-solutions-consultation-process-placeholder.webp")}
            </section>
          ) : null}

          {tab === "process" ? (
            <section className="crm-cms-block">
              <h2>Process</h2>
              <TextInput label="Eyebrow" value={content.process.eyebrow} onChange={(next) => setSection("process", { eyebrow: next })} />
              <TextInput label="หัวข้อ / Title" value={content.process.title} onChange={(next) => setSection("process", { title: next })} />
              <TextArea label="คำนำ / Lead" rows={3} value={content.process.lead} onChange={(next) => setSection("process", { lead: next })} />
              <ListEditor
                items={content.process.steps}
                onChange={(steps) => setSection("process", { steps })}
                onRemoved={announceRemoved}
                blank={blankSolutionsIndexProcessStep}
                addLabel="เพิ่มขั้นตอน / Add step"
                itemLabel={(item, index) => `ขั้นตอน ${index + 1} / Step ${index + 1}${item.titleEn ? ` — ${item.titleEn}` : ""}`}
                renderItem={(item, patch) => (
                  <>
                    <TextInput label="หัวข้อไทย" value={item.titleTh} onChange={(titleTh) => patch({ titleTh })} />
                    <TextInput label="Title EN" value={item.titleEn} onChange={(titleEn) => patch({ titleEn })} />
                    <TextArea label="เนื้อหาไทย" rows={3} value={item.bodyTh} onChange={(bodyTh) => patch({ bodyTh })} />
                    <TextArea label="Body EN" rows={3} value={item.bodyEn} onChange={(bodyEn) => patch({ bodyEn })} />
                  </>
                )}
              />
            </section>
          ) : null}

          {tab === "faq" ? (
            <section className="crm-cms-block">
              <h2>FAQ</h2>
              <ListEditor
                items={content.faqs}
                onChange={(faqs) => patchContent({ ...content, faqs })}
                onRemoved={announceRemoved}
                blank={blankSolutionsIndexFaq}
                addLabel="เพิ่มคำถาม / Add FAQ"
                itemLabel={(item, index) => `คำถาม ${index + 1} / FAQ ${index + 1}${item.qEn ? ` — ${item.qEn.slice(0, 48)}` : ""}`}
                renderItem={(item, patch) => (
                  <>
                    <TextInput label="คำถามไทย" value={item.qTh} onChange={(qTh) => patch({ qTh })} />
                    <TextInput label="Question EN" value={item.qEn} onChange={(qEn) => patch({ qEn })} />
                    <TextArea label="คำตอบไทย" rows={3} value={item.aTh} onChange={(aTh) => patch({ aTh })} />
                    <TextArea label="Answer EN" rows={3} value={item.aEn} onChange={(aEn) => patch({ aEn })} />
                  </>
                )}
              />
            </section>
          ) : null}

          {tab === "seo" ? (
            <section className="crm-cms-block">
              <h2>SEO</h2>
              <TextInput label="ชื่อเพจ / Page title" value={meta.title} onChange={(title) => patchMeta({ title })} />
              <TextInput label="SEO title" value={meta.seoTitle} onChange={(seoTitle) => patchMeta({ seoTitle })} />
              <TextArea label="Meta description" rows={3} value={meta.metaDescription} onChange={(metaDescription) => patchMeta({ metaDescription })} />
              <TextArea label="Excerpt" rows={2} value={meta.excerpt} onChange={(excerpt) => patchMeta({ excerpt })} />
              <TextInput label="Canonical" value={content.seo.canonical} onChange={(canonical) => setSection("seo", { canonical })} />
              <h3>ตัวแปรตามภาษา / Language variants</h3>
              <ListEditorVariants content={content} onChange={(variants) => setSection("seo", { variants })} />
              <h3>รูป Open Graph / Open Graph image</h3>
              {visualFields("social", content.seo.social, "รูป Open Graph 1200×630 ไม่บังคับ — ใช้เมื่อ Approved และได้รับอนุญาตเท่านั้น")}
            </section>
          ) : null}

          {tab === "publish" ? (
            <section className="crm-cms-block">
              <h2>Approvals and publish</h2>
              <CheckField label="เผยแพร่สองภาษา ต้องมี FAQ และชื่อการ์ดไทย-อังกฤษ / Bilingual publish" checked={content.bilingualPublish} onChange={(bilingualPublish) => patchContent({ ...content, bilingualPublish })} />
              <CheckField label="อนุมัติผลงานและตัวเลข / Proof and figures reviewed" checked={content.approvals.proof} onChange={(proof) => setSection("approvals", { proof })} />
              <CheckField label="อนุมัติรูปภาพ / Visuals reviewed" checked={content.approvals.visuals} onChange={(visuals) => setSection("approvals", { visuals })} />
              <TextArea label="หมายเหตุหลักฐาน / Evidence note" rows={3} value={content.approvals.evidenceNote} onChange={(evidenceNote) => setSection("approvals", { evidenceNote })} />
              <p>
                สถานะปัจจุบัน / Status: {meta.status}
                {updatedAt ? ` · อัปเดต ${updatedAt}` : ""}
              </p>
              <p>
                <a href={previewHref}>ดูตัวอย่างในระบบ / Preview</a>
                {" · "}
                <a href={publicHref} target="_blank" rel="noreferrer">
                  หน้าสาธารณะ / Public page
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
        </div>
      </div>

      {dialog ? (
        <Dialog titleId="solutions-index-dialog-title" descriptionId="solutions-index-dialog-desc" onClose={() => setDialog(null)}>
          <h2 id="solutions-index-dialog-title">{dialog === "unpublish" ? "ยกเลิกเผยแพร่" : "คัดลอกไปภาษาอื่น"}</h2>
          {dialog === "unpublish" ? (
            <p id="solutions-index-dialog-desc">หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ดจนกว่าจะเผยแพร่อีกครั้ง</p>
          ) : (
            <>
              <p id="solutions-index-dialog-desc">สร้างฉบับร่างในภาษาปลายทาง ตรวจคำแปลก่อนเผยแพร่</p>
              <Field label="ภาษาปลายทาง">
                <select className="crm-field" value={targetLocale} onChange={(event) => setTargetLocale(event.target.value)}>
                  {LOCALE_OPTIONS.filter((item) => item.id !== meta.locale).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          )}
          <div className="crm-cms-actions">
            <button type="button" className="crm-users-secondary" onClick={() => setDialog(null)}>
              ยกเลิก
            </button>
            <button
              type="button"
              className="kpi-button crm-users-primary"
              onClick={() => {
                const next = dialog;
                setDialog(null);
                setMoreOpen(false);
                if (next === "unpublish") submit("unpublish");
                else duplicateToLocale();
              }}
            >
              ยืนยัน
            </button>
          </div>
        </Dialog>
      ) : null}
    </form>
  );
}

/** SEO language variants are fixed per locale (en/ru/zh): edit, but not add/remove/reorder. */
function ListEditorVariants({ content, onChange }: { content: Page; onChange: (next: Page["seo"]["variants"]) => void }) {
  const variants = content.seo.variants;
  return (
    <>
      {variants.map((variant, index) => {
        const patch = (next: Partial<typeof variant>) => onChange(variants.map((row, i) => (i === index ? { ...row, ...next } : row)));
        return (
          <div key={variant.locale || index} className="crm-cms-contact-step-card" role="group" aria-label={`SEO ${variant.locale}`}>
            <div className="crm-cms-faq-item-head">
              <strong>SEO — {variant.locale}</strong>
            </div>
            <TextInput label="Title" value={variant.title} onChange={(title) => patch({ title })} />
            <TextArea label="Description" rows={2} value={variant.description} onChange={(description) => patch({ description })} />
            <TextInput label="Canonical" value={variant.canonical} onChange={(canonical) => patch({ canonical })} />
          </div>
        );
      })}
    </>
  );
}
