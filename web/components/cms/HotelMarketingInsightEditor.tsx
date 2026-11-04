"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import {
  HM_CLAIM_STATUSES,
  HM_DIAGRAM_IDS,
  HM_PERMISSION_STATUSES,
  HM_SECTION_TYPES,
  HM_SOURCE_STATUSES,
  HM_VISUAL_MODES,
  HM_VISUAL_STATUSES,
  emptyLocaleText,
  emptyVisual,
  hmCmsErrorMessage,
  isValidHmDate,
  newHmItemId,
  validateHotelMarketingInsight,
  type CmsHmVisual,
  type CmsHotelMarketingInsight,
  type HmCmsIntent,
  type HmCmsSaveResult,
  type HmClaimStatus,
  type HmEditorState,
  type HmPermissionStatus,
  type HmSectionType,
  type HmSourceStatus,
  type HmVisualMode,
  type HmVisualStatus,
  type LocaleText,
} from "@/lib/cms/hotel-marketing-insight";

/* ------------------------------------------------------------------------------------------------------------ */
/* Tabs                                                                                                         */
/* ------------------------------------------------------------------------------------------------------------ */

const TABS = [
  { id: "basics", label: "ข้อมูลพื้นฐาน" },
  { id: "cover", label: "ภาพปก" },
  { id: "sections", label: "เนื้อหา" },
  { id: "strategies", label: "กลยุทธ์" },
  { id: "metrics", label: "ตัวชี้วัด" },
  { id: "compare", label: "เปรียบเทียบ" },
  { id: "start", label: "เริ่มต้น" },
  { id: "conclusion", label: "สรุป / CTA" },
  { id: "related", label: "เกี่ยวข้อง" },
  { id: "references", label: "อ้างอิง" },
  { id: "seo", label: "SEO" },
  { id: "translation", label: "แปล EN" },
  { id: "publish", label: "เผยแพร่" },
] as const;

type Tab = (typeof TABS)[number]["id"];

function isTab(value: string | undefined): value is Tab {
  return TABS.some((tab) => tab.id === value);
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Pure helpers                                                                                                 */
/* ------------------------------------------------------------------------------------------------------------ */

type Draft = CmsHotelMarketingInsight;
type Upload = { file?: File; preview: string; clear: boolean };
type Uploads = Record<string, Upload>;
type UploadCtl = { uploads: Uploads; set: (key: string, next: Upload | null) => void };
type Slot = { visual: CmsHmVisual; file: string; clear: string; tab: Tab };

const VISUAL_OK: readonly HmVisualStatus[] = ["sample", "approved", "real"];
const PERMISSION_OK: readonly HmPermissionStatus[] = ["approved", "redacted", "not_applicable"];
const LINK_RE = /^(https?:\/\/|\/)/i;

function formatStamp(value?: string) {
  if (!value) return "ยังไม่เคยบันทึก";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "ยังไม่เคยบันทึก";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function renumber<T extends object>(list: T[]) {
  list.forEach((item, index) => {
    const row = item as { order?: number };
    if (typeof row.order === "number") row.order = index + 1;
  });
}

function renumberStrategies(list: Draft["strategies"]) {
  renumber(list);
  list.forEach((item, index) => {
    item.num = String(index + 1).padStart(2, "0");
  });
}

function moveIn<T extends object>(list: T[], index: number, direction: -1 | 1) {
  const next = index + direction;
  if (next < 0 || next >= list.length) return;
  const [row] = list.splice(index, 1);
  list.splice(next, 0, row);
}

function pickLocale(locale: string, text: LocaleText) {
  return locale === "th" ? text.th : text.en.trim() || text.th;
}

/** Every uploadable visual, keyed exactly like `hotel-marketing-insight-actions.ts#uploadSlots`. */
function slotsOf(content: Draft): Slot[] {
  return [
    { visual: content.cover, file: "coverImageFile", clear: "clearCoverImage", tab: "cover" },
    ...content.strategies.map((strategy) => ({
      visual: strategy.visual,
      file: `strategyImageFile_${strategy.id}`,
      clear: `clearStrategyImage_${strategy.id}`,
      tab: "strategies" as Tab,
    })),
    ...content.sections.map((section) => ({
      visual: section.visual,
      file: `sectionImageFile_${section.id}`,
      clear: `clearSectionImage_${section.id}`,
      tab: "sections" as Tab,
    })),
    { visual: content.compare.visual, file: "compareImageFile", clear: "clearCompareImage", tab: "compare" },
    { visual: content.startHere.visual, file: "startImageFile", clear: "clearStartImage", tab: "start" },
    { visual: content.seo.social, file: "ogImageFile", clear: "clearOgImage", tab: "seo" },
  ];
}

/** Content as the server will see it after uploads, so client validation matches the server's. */
function withPendingUploads(content: Draft, uploads: Uploads): Draft {
  const next = structuredClone(content);
  for (const slot of slotsOf(next)) {
    const upload = uploads[slot.file];
    if (upload?.file) {
      slot.visual.src = upload.preview || "/media/cms/pending-upload";
      slot.visual.mode = "image";
      if (slot.visual.status === "placeholder") slot.visual.status = "sample";
    }
  }
  return next;
}

/** Trim blank list rows that the free-typing text areas leave behind. */
function cleanContent(content: Draft): Draft {
  const next = structuredClone(content);
  const clean = (list: string[]) => list.map((item) => item.trim()).filter(Boolean);
  next.journeyLabels = clean(next.journeyLabels);
  for (const section of next.sections) {
    section.bulletsTh = clean(section.bulletsTh);
    section.bulletsEn = clean(section.bulletsEn);
  }
  return next;
}

function visualProblem(visual: CmsHmVisual, enEnabled: boolean): string | null {
  if (!visual.src.trim()) return null;
  if (!LINK_RE.test(visual.src.trim())) return "invalid_link";
  if (!VISUAL_OK.includes(visual.status)) return "placeholder_status";
  if (!visual.alt.th.trim()) return "missing_alt";
  if (enEnabled && !visual.alt.en.trim()) return "missing_alt_en";
  const pending = visual.permissionStatus === "pending" || visual.permissionStatus === "denied";
  if (pending && !PERMISSION_OK.includes(visual.permissionStatus)) return "permission_required";
  return null;
}

/** Which tab to open so the editor can fix the error returned by `validateHotelMarketingInsight`. */
function tabForError(code: string, content: Draft): Tab {
  switch (code) {
    case "required_fields":
    case "invalid_date":
    case "author_required":
    case "reviewer_unverified":
    case "reviewer_required":
      return "basics";
    case "required_seo_meta":
      return "seo";
    case "en_required":
    case "en_not_ready":
      return "translation";
    case "unverified_claim":
    case "metric_incomplete":
      return "metrics";
    case "source_incomplete":
    case "source_dates":
    case "source_missing":
      return "references";
    case "related_invalid":
      return "related";
    case "invalid_link": {
      if (content.references.some((ref) => ref.url.trim() && !LINK_RE.test(ref.url.trim()))) return "references";
      if (content.relatedServices.some((svc) => !LINK_RE.test(svc.href.trim()))) return "related";
      const bad = slotsOf(content).find((slot) => slot.visual.src.trim() && !LINK_RE.test(slot.visual.src.trim()));
      return bad ? bad.tab : "seo";
    }
    default: {
      const enEnabled = content.translation.enEnabled;
      const bad = slotsOf(content).find((slot) => visualProblem(slot.visual, enEnabled));
      return bad ? bad.tab : "publish";
    }
  }
}

type CheckItem = { label: string; ok: boolean; tab: Tab };

/** Human-readable checklist. The authoritative gate is always `validateHotelMarketingInsight`. */
function buildChecklist(content: Draft, locale: string): CheckItem[] {
  const enEnabled = content.translation.enEnabled;
  const seoTitle = (pickLocale(locale, content.seo.title) || pickLocale(locale, content.title)).trim();
  const metaDescription = (pickLocale(locale, content.seo.description) || pickLocale(locale, content.excerpt)).trim();
  const dateOk = (value: string) => !value.trim() || isValidHmDate(value);
  const visuals = slotsOf(content).map((slot) => slot.visual);
  const valued = content.metrics.filter((metric) => metric.value.trim());
  const refIds = new Set(content.references.map((ref) => ref.id));
  const cited = [...content.sections.flatMap((s) => s.sourceIds), ...content.strategies.flatMap((s) => s.sourceIds)];

  return [
    { label: "มีหัวข้อและคำอธิบายสั้น (ไทย)", ok: Boolean(content.title.th.trim() && content.excerpt.th.trim()), tab: "basics" },
    { label: "มี SEO title และ Meta description", ok: Boolean(seoTitle && metaDescription), tab: "seo" },
    { label: "ผู้เขียนระบุชื่อและยืนยันแล้ว", ok: Boolean(content.authorName.trim() && content.authorVerified), tab: "basics" },
    {
      label: "ผู้ตรวจทาน (ถ้ามีชื่อ) ยืนยันแล้ว",
      ok: !content.reviewerName.trim() || content.reviewerVerified,
      tab: "basics",
    },
    { label: "วันที่อยู่ในรูปแบบ YYYY-MM-DD", ok: dateOk(content.publishedAt) && dateOk(content.updatedAt), tab: "basics" },
    {
      label: enEnabled ? "ภาษาอังกฤษครบและทำเครื่องหมายพร้อมแล้ว" : "ภาษาอังกฤษปิดอยู่ (เผยแพร่เฉพาะภาษาไทย)",
      ok:
        !enEnabled ||
        Boolean(
          content.title.en.trim() &&
            content.excerpt.en.trim() &&
            content.cover.alt.en.trim() &&
            content.seo.title.en.trim() &&
            content.seo.description.en.trim() &&
            content.translation.enReady,
        ),
      tab: "translation",
    },
    {
      label: "ภาพที่มีไฟล์: สถานะ, Alt และสิทธิ์การใช้ครบ",
      ok: visuals.every((visual) => !visualProblem(visual, enEnabled)),
      tab: tabForError("missing_alt", content),
    },
    {
      label: "ตัวชี้วัดที่มีค่าตัวเลขมีสถานะ คำนิยาม ช่วงเวลา และแหล่งข้อมูล",
      ok: valued.every(
        (metric) =>
          metric.status !== "draft" &&
          metric.status !== "requires_review" &&
          (metric.status === "sample" ||
            (metric.definition.th.trim() &&
              metric.period.trim() &&
              metric.source.trim() &&
              content.reviewerName.trim() &&
              content.reviewerVerified)),
      ),
      tab: "metrics",
    },
    {
      label: "แหล่งอ้างอิงและลิงก์ถูกต้อง",
      ok:
        content.references.every((ref) => !ref.url.trim() || LINK_RE.test(ref.url.trim())) &&
        cited.every((id) => refIds.has(id)) &&
        content.relatedServices.every((svc) => LINK_RE.test(svc.href.trim())) &&
        content.relatedArticles.every((article) => article.articleId.trim()) &&
        (!content.seo.canonical.trim() || LINK_RE.test(content.seo.canonical.trim())),
      tab: "references",
    },
  ];
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Small presentational helpers                                                                                 */
/* ------------------------------------------------------------------------------------------------------------ */

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="crm-cms-field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function Check({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (next: boolean) => void; hint?: string }) {
  return (
    <label className="crm-cms-field">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
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

/** Card chrome (title + move/remove) shared by every repeatable row. */
function ItemCard({
  title,
  index,
  total,
  onMove,
  onRemove,
  children,
}: {
  title: string;
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="crm-cs-metric">
      <div className="crm-cs-metric-head">
        <h3>{title}</h3>
        <RowActions
          name={title}
          disableUp={index === 0}
          disableDown={index === total - 1}
          onUp={() => onMove(-1)}
          onDown={() => onMove(1)}
          onRemove={onRemove}
        />
      </div>
      <div className="crm-cms-panel">{children}</div>
    </div>
  );
}

/** Thai + English inputs side by side. Single line by default, textarea when `rows` is set. */
function LocaleFields({
  label,
  value,
  onChange,
  rows,
  hint,
}: {
  label: string;
  value: LocaleText;
  onChange: (next: LocaleText) => void;
  rows?: number;
  hint?: string;
}) {
  const field = (lang: "th" | "en") =>
    rows ? (
      <textarea className="crm-area" rows={rows} value={value[lang]} onChange={(event) => onChange({ ...value, [lang]: event.target.value })} />
    ) : (
      <input className="crm-field" value={value[lang]} onChange={(event) => onChange({ ...value, [lang]: event.target.value })} />
    );
  return (
    <div className="crm-cms-grid">
      <Field label={`${label} (ไทย)`} hint={hint}>
        {field("th")}
      </Field>
      <Field label={`${label} (English)`}>{field("en")}</Field>
    </div>
  );
}

/** One text area per language for the plain `xxxTh` / `xxxEn` string pairs. */
function PairFields({
  label,
  th,
  en,
  onChange,
  rows = 4,
  hint,
}: {
  label: string;
  th: string;
  en: string;
  onChange: (next: { th: string; en: string }) => void;
  rows?: number;
  hint?: string;
}) {
  return <LocaleFields label={label} value={{ th, en }} onChange={onChange} rows={rows} hint={hint} />;
}

function LinesFields({
  label,
  th,
  en,
  onChange,
}: {
  label: string;
  th: string[];
  en: string[];
  onChange: (next: { th: string[]; en: string[] }) => void;
}) {
  return (
    <div className="crm-cms-grid">
      <Field label={`${label} (ไทย)`} hint="หนึ่งบรรทัดต่อข้อ">
        <textarea className="crm-area" rows={4} value={th.join("\n")} onChange={(event) => onChange({ th: event.target.value.split("\n"), en })} />
      </Field>
      <Field label={`${label} (English)`}>
        <textarea className="crm-area" rows={4} value={en.join("\n")} onChange={(event) => onChange({ th, en: event.target.value.split("\n") })} />
      </Field>
    </div>
  );
}

function Select({
  value,
  options,
  onChange,
  empty,
}: {
  value: string;
  options: readonly string[];
  onChange: (next: string) => void;
  empty?: string;
}) {
  return (
    <select className="crm-field" value={value} onChange={(event) => onChange(event.target.value)}>
      {empty !== undefined ? <option value="">{empty}</option> : null}
      {options.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}

function ImagePreview({ src, alt, recommended }: { src: string; alt: string; recommended: string }) {
  const [meta, setMeta] = useState("");
  if (!src) return <p className="crm-contact-image-hint">{recommended}</p>;
  return (
    <figure className="crm-contact-image-preview">
      {/* eslint-disable-next-line @next/next/no-img-element */}
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

/** Which reference ids a section / strategy cites. */
function SourcePicker({
  references,
  value,
  onChange,
}: {
  references: Draft["references"];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const known = new Set(references.map((ref) => ref.id));
  const unknown = value.filter((id) => !known.has(id));
  if (!references.length && !unknown.length) {
    return <p className="crm-contact-image-hint">ยังไม่มีแหล่งอ้างอิง — เพิ่มในแท็บ “อ้างอิง” ก่อน</p>;
  }
  const toggle = (id: string, on: boolean) => onChange(on ? [...value, id] : value.filter((item) => item !== id));
  return (
    <fieldset className="crm-cms-field">
      <span>แหล่งอ้างอิงที่ใช้ในส่วนนี้</span>
      {references.map((ref) => (
        <label key={ref.id}>
          <input type="checkbox" checked={value.includes(ref.id)} onChange={(event) => toggle(ref.id, event.target.checked)} />{" "}
          {ref.label.th || ref.label.en || ref.id}
        </label>
      ))}
      {unknown.map((id) => (
        <label key={id}>
          <input type="checkbox" checked onChange={(event) => toggle(id, event.target.checked)} /> ไม่พบแหล่งอ้างอิง: {id}
        </label>
      ))}
    </fieldset>
  );
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Visual editor                                                                                                */
/* ------------------------------------------------------------------------------------------------------------ */

function VisualFields({
  visual,
  onChange,
  fileKey,
  ctl,
  hint,
}: {
  visual: CmsHmVisual;
  onChange: (next: CmsHmVisual) => void;
  fileKey: string;
  ctl: UploadCtl;
  hint: string;
}) {
  const upload = ctl.uploads[fileKey];
  const shown = upload?.clear ? "" : upload?.preview || visual.src;

  return (
    <div className="crm-cms-panel">
      <div className="crm-cms-grid">
        <Field label="โหมดภาพ">
          <Select value={visual.mode} options={HM_VISUAL_MODES} onChange={(mode) => onChange({ ...visual, mode: (mode || "diagram") as HmVisualMode })} />
        </Field>
        <Field label="แผนภาพ (diagramId)" hint="ใช้เมื่อโหมดเป็น diagram — เว้นว่างถ้าไม่มีภาพ">
          <Select value={visual.diagramId} options={HM_DIAGRAM_IDS} empty="— ไม่มี —" onChange={(diagramId) => onChange({ ...visual, diagramId })} />
        </Field>
      </div>
      <ImagePreview src={shown} alt={visual.alt.th || visual.alt.en} recommended={hint} />
      <Field label="แทนที่รูป" hint="JPG, PNG หรือ WEBP ไม่เกิน 5MB">
        <input
          key={upload?.file ? "has-file" : "no-file"}
          className="crm-field"
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            ctl.set(fileKey, { file, preview: URL.createObjectURL(file), clear: false });
            onChange({ ...visual, mode: "image", status: visual.status === "placeholder" ? "sample" : visual.status });
          }}
        />
      </Field>
      {upload?.file ? <p className="crm-contact-image-hint">ไฟล์ที่เลือก: {upload.file.name} — จะอัปโหลดเมื่อกดบันทึก</p> : null}
      {shown ? (
        <button
          type="button"
          className="crm-users-secondary"
          onClick={() => {
            ctl.set(fileKey, { preview: "", clear: true });
            onChange({ ...visual, src: "", status: "placeholder", mode: visual.diagramId ? "diagram" : visual.mode });
          }}
        >
          ลบรูป
        </button>
      ) : null}
      <LocaleFields label="คำอธิบายภาพ (alt)" value={visual.alt} onChange={(alt) => onChange({ ...visual, alt })} hint="จำเป็นเมื่อมีไฟล์รูปและจะเผยแพร่" />
      <LocaleFields label="คำบรรยายใต้ภาพ" value={visual.caption} onChange={(caption) => onChange({ ...visual, caption })} />
      <div className="crm-cms-grid">
        <Field label="ป้ายกำกับรูป">
          <input className="crm-field" value={visual.label} onChange={(event) => onChange({ ...visual, label: event.target.value })} />
        </Field>
        <Field label="สถานะรูป" hint="รูปที่มีไฟล์ต้องเป็น sample, approved หรือ real ก่อนเผยแพร่">
          <Select value={visual.status} options={HM_VISUAL_STATUSES} onChange={(status) => onChange({ ...visual, status: (status || "placeholder") as HmVisualStatus })} />
        </Field>
        <Field label="สถานะสิทธิ์การใช้ภาพ">
          <Select
            value={visual.permissionStatus}
            options={HM_PERMISSION_STATUSES}
            onChange={(permissionStatus) => onChange({ ...visual, permissionStatus: (permissionStatus || "not_applicable") as HmPermissionStatus })}
          />
        </Field>
        <Field label="แหล่งที่มาของภาพ (assetSource)">
          <input className="crm-field" value={visual.assetSource} onChange={(event) => onChange({ ...visual, assetSource: event.target.value })} />
        </Field>
      </div>
      <Field label="บันทึกสิทธิ์การใช้ภาพ" hint="ภาพที่เกี่ยวกับลูกค้า โรงแรม แคมเปญ หรือรีวิว ต้องได้รับอนุมัติหรือปิดข้อมูลระบุตัวตนก่อนเผยแพร่">
        <textarea className="crm-area" rows={2} value={visual.permissionNote} onChange={(event) => onChange({ ...visual, permissionNote: event.target.value })} />
      </Field>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Editor                                                                                                       */
/* ------------------------------------------------------------------------------------------------------------ */

type DuplicateResult = { ok: true; id: string } | { ok: false; error: string };

function metaFrom(initial: HmEditorState) {
  return { locale: initial.locale, status: initial.status, fallbackTitle: initial.title };
}

export function HotelMarketingInsightEditor({
  initial,
  notice,
  error,
  saveAction,
  duplicateAction,
  updatedAt,
  initialTab,
  previewHref,
  publicHref,
}: {
  initial: HmEditorState;
  notice?: string;
  error?: string;
  saveAction: (formData: FormData) => Promise<HmCmsSaveResult>;
  duplicateAction?: (formData: FormData) => Promise<DuplicateResult>;
  updatedAt?: string;
  initialTab?: string;
  previewHref: string;
  publicHref: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(isTab(initialTab) ? initialTab : "basics");
  const [seen, setSeen] = useState(initial);
  const [content, setContent] = useState<Draft>(initial.content);
  const [meta, setMeta] = useState(() => metaFrom(initial));
  const [uploads, setUploads] = useState<Uploads>({});
  const [dirty, setDirty] = useState(false);
  const [ok, setOk] = useState(notice || "");
  const [status, setStatus] = useState(error ? hmCmsErrorMessage(error) : "");
  const [dialog, setDialog] = useState<"unpublish" | null>(null);
  const [duplicateResult, setDuplicateResult] = useState<DuplicateResult | null>(null);
  const [pending, startTransition] = useTransition();
  const [duplicating, startDuplicate] = useTransition();
  const dialogCancelRef = useRef<HTMLButtonElement>(null);
  const dialogReturnRef = useRef<HTMLElement | null>(null);

  // After a save the server re-renders with fresh data (new image paths etc.): adopt it unless the editor has newer edits.
  if (seen !== initial) {
    setSeen(initial);
    if (!dirty) {
      setContent(initial.content);
      setMeta(metaFrom(initial));
      setUploads({});
    }
  }

  const locale = meta.locale;
  const target = locale === "th" ? "th" : "en";

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (dialog !== "unpublish") return;
    dialogReturnRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogCancelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDialog(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      dialogReturnRef.current?.focus();
    };
  }, [dialog]);

  function markDirty() {
    setDirty(true);
    setOk("");
    setStatus("");
  }

  function update(mutator: (draft: Draft) => void) {
    const next = structuredClone(content);
    mutator(next);
    setContent(next);
    markDirty();
  }

  const ctl: UploadCtl = {
    uploads,
    set: (key, next) => {
      setUploads((current) => {
        const copy = { ...current };
        if (next) copy[key] = next;
        else delete copy[key];
        return copy;
      });
      markDirty();
    },
  };

  function validationMeta(draft: Draft) {
    return {
      seoTitle: (pickLocale(locale, draft.seo.title) || pickLocale(locale, draft.title) || meta.fallbackTitle).trim(),
      metaDescription: (pickLocale(locale, draft.seo.description) || pickLocale(locale, draft.excerpt)).trim(),
      bilingual: draft.translation.enEnabled,
    };
  }

  function submit(intent: HmCmsIntent) {
    const payload = cleanContent(content);
    const check = withPendingUploads(payload, uploads);
    const pageError = validateHotelMarketingInsight(check, intent, validationMeta(check));
    if (pageError) {
      setOk("");
      setStatus(hmCmsErrorMessage(pageError));
      setTab(tabForError(pageError, check));
      return;
    }

    const data = new FormData();
    data.set("id", initial.id);
    data.set("intent", intent);
    data.set("locale", locale);
    data.set("contentJson", JSON.stringify(payload));
    data.set("title", pickLocale(locale, payload.title).trim() || meta.fallbackTitle);
    data.set("seoTitle", payload.seo.title[target]);
    data.set("metaDescription", payload.seo.description[target]);
    data.set("excerpt", payload.excerpt[target]);
    data.set("canonical", payload.seo.canonical);
    for (const slot of slotsOf(payload)) {
      const upload = uploads[slot.file];
      if (upload?.file) data.set(slot.file, upload.file);
      else if (upload?.clear) data.set(slot.clear, "1");
    }

    startTransition(async () => {
      setOk("");
      setStatus("");
      const result = await saveAction(data);
      if (!result.ok) {
        setStatus(hmCmsErrorMessage(result.error));
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
    const intent = (submitter?.value as HmCmsIntent) || "save";
    if (intent === "unpublish") {
      setDialog("unpublish");
      return;
    }
    submit(intent);
  }

  function duplicateToEnglish() {
    if (!duplicateAction) return;
    const data = new FormData();
    data.set("id", initial.id);
    data.set("locale", locale);
    data.set("targetLocale", "en");
    setDuplicateResult(null);
    startDuplicate(async () => {
      setDuplicateResult(await duplicateAction(data));
    });
  }

  const primaryButtonStyle = { background: "#a2dc25", color: "#1a3a02" } as const;
  const saveButtons = (
    <>
      <button className="kpi-button" type="submit" name="intent" value="save" disabled={pending} style={primaryButtonStyle}>
        {pending ? "กำลังบันทึก…" : "บันทึก"}
      </button>
      <button className="crm-users-secondary" type="submit" name="intent" value="draft" disabled={pending}>
        บันทึกฉบับร่าง
      </button>
      <button className="crm-users-secondary" type="submit" name="intent" value="preview" disabled={pending}>
        บันทึกแล้วดูตัวอย่าง
      </button>
      {tab === "publish" ? (
        <>
          <button className="kpi-button" type="submit" name="intent" value="publish" disabled={pending} style={primaryButtonStyle}>
            เผยแพร่
          </button>
          <button className="crm-users-secondary" type="submit" name="intent" value="unpublish" disabled={pending || meta.status !== "published"}>
            ยกเลิกเผยแพร่
          </button>
        </>
      ) : null}
    </>
  );
  const stateClass = status ? " is-error" : dirty ? " is-dirty" : ok ? " is-ok" : "";
  const saveBar = (sticky: boolean) => (
    <div className={`crm-cs-savebar${sticky ? " is-sticky" : ""}`}>
      {saveButtons}
      <p className={`crm-cs-save-state${stateClass}`} role="status">
        {pending ? "กำลังบันทึก…" : status || (dirty ? "ยังไม่ได้บันทึก" : ok || "พร้อมบันทึก")}
      </p>
    </div>
  );

  const checklist = tab === "publish" ? buildChecklist(content, locale) : [];
  const publishError =
    tab === "publish"
      ? validateHotelMarketingInsight(withPendingUploads(cleanContent(content), uploads), "publish", validationMeta(content))
      : null;

  return (
    <div className="crm-cms-editor">
      <nav className="crm-cms-tabs" role="tablist" aria-label="ส่วนของบทความ Hotel Marketing">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            id={`hotel-marketing-cms-tab-${item.id}`}
            role="tab"
            aria-selected={tab === item.id}
            aria-controls="hotel-marketing-cms-panel"
            className={tab === item.id ? "is-active" : ""}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <form className="crm-cms-form" onSubmit={onSubmit}>
        <input type="hidden" name="id" value={initial.id} />
        <input type="hidden" name="locale" value={locale} />
        {saveBar(true)}
        <div id="hotel-marketing-cms-panel" role="tabpanel" aria-labelledby={`hotel-marketing-cms-tab-${tab}`}>
          {tab === "basics" ? (
            <section className="crm-cms-panel">
              <LocaleFields label="หัวข้อบทความ" value={content.title} onChange={(title) => update((d) => void (d.title = title))} />
              <LocaleFields label="หมวดหมู่" value={content.category} onChange={(category) => update((d) => void (d.category = category))} />
              <LocaleFields label="คำอธิบายสั้น (excerpt)" rows={3} value={content.excerpt} onChange={(excerpt) => update((d) => void (d.excerpt = excerpt))} />
              <LocaleFields
                label="กล่องสรุป (summary callout)"
                rows={3}
                value={content.summaryCallout}
                onChange={(summaryCallout) => update((d) => void (d.summaryCallout = summaryCallout))}
              />
              <div className="crm-cms-grid">
                <Field label="ผู้เขียน">
                  <input className="crm-field" value={content.authorName} onChange={(event) => update((d) => void (d.authorName = event.target.value))} />
                </Field>
                <Check label="ยืนยันผู้เขียนแล้ว" checked={content.authorVerified} onChange={(next) => update((d) => void (d.authorVerified = next))} hint="จำเป็นก่อนเผยแพร่" />
                <Field label="ผู้ตรวจทาน">
                  <input className="crm-field" value={content.reviewerName} onChange={(event) => update((d) => void (d.reviewerName = event.target.value))} />
                </Field>
                <Check
                  label="ยืนยันการตรวจทานแล้ว"
                  checked={content.reviewerVerified}
                  onChange={(next) => update((d) => void (d.reviewerVerified = next))}
                  hint="ชื่อผู้ตรวจทานจะแสดงบนเว็บสาธารณะเฉพาะเมื่อยืนยันแล้ว"
                />
              </div>
              <div className="crm-cms-grid">
                <Field label="วันที่เผยแพร่">
                  <input className="crm-field" type="date" value={content.publishedAt} onChange={(event) => update((d) => void (d.publishedAt = event.target.value))} />
                </Field>
                <Field label="วันที่อัปเดต">
                  <input className="crm-field" type="date" value={content.updatedAt} onChange={(event) => update((d) => void (d.updatedAt = event.target.value))} />
                </Field>
                <Field label="เวลาอ่าน (นาที)">
                  <input
                    className="crm-field"
                    type="number"
                    min={0}
                    value={content.readingTimeMinutes}
                    onChange={(event) => update((d) => void (d.readingTimeMinutes = Math.max(0, Math.round(Number(event.target.value)) || 0)))}
                  />
                </Field>
              </div>
              <Field label="Journey labels" hint="คั่นด้วยจุลภาค เช่น Visibility, Interest, Booking">
                <input
                  className="crm-field"
                  value={content.journeyLabels.join(",")}
                  onChange={(event) => update((d) => void (d.journeyLabels = event.target.value.split(",")))}
                />
              </Field>
            </section>
          ) : null}

          {tab === "cover" ? (
            <section className="crm-cms-panel">
              <VisualFields
                visual={content.cover}
                onChange={(visual) => update((d) => void (d.cover = visual))}
                fileKey="coverImageFile"
                ctl={ctl}
                hint="1600 × 900 px · ภาพปกบทความและการ์ดในหน้ารวม"
              />
            </section>
          ) : null}

          {tab === "sections" ? (
            <section className="crm-cms-panel">
              <p className="crm-contact-image-hint">
                หัวข้อของส่วนประเภท compare, start และ conclusion จะถูกซิงก์กับแท็บ “เปรียบเทียบ”, “เริ่มต้น” และ “สรุป / CTA” เมื่อบันทึก
              </p>
              {content.sections.map((section, index) => {
                const title = section.heading.th || section.heading.en || `ส่วนที่ ${index + 1}`;
                return (
                  <ItemCard
                    key={section.id}
                    title={title}
                    index={index}
                    total={content.sections.length}
                    onMove={(direction) => update((d) => { moveIn(d.sections, index, direction); renumber(d.sections); })}
                    onRemove={() => update((d) => { d.sections.splice(index, 1); renumber(d.sections); })}
                  >
                    <Field label="ประเภทส่วน">
                      <Select
                        value={section.type}
                        options={HM_SECTION_TYPES}
                        onChange={(type) => update((d) => void (d.sections[index].type = (type || "custom") as HmSectionType))}
                      />
                    </Field>
                    <LocaleFields label="หัวข้อ" value={section.heading} onChange={(heading) => update((d) => void (d.sections[index].heading = heading))} />
                    <PairFields
                      label="เนื้อหา"
                      th={section.bodyTh}
                      en={section.bodyEn}
                      hint="เว้นหนึ่งบรรทัดเพื่อขึ้นย่อหน้าใหม่ — ภาษาอังกฤษต้องเขียนเอง ระบบไม่เติมให้"
                      onChange={(next) => update((d) => { d.sections[index].bodyTh = next.th; d.sections[index].bodyEn = next.en; })}
                    />
                    <LinesFields
                      label="หัวข้อย่อย (bullets)"
                      th={section.bulletsTh}
                      en={section.bulletsEn}
                      onChange={(next) => update((d) => { d.sections[index].bulletsTh = next.th; d.sections[index].bulletsEn = next.en; })}
                    />
                    <h4>ภาพประกอบ</h4>
                    <VisualFields
                      visual={section.visual}
                      onChange={(visual) => update((d) => void (d.sections[index].visual = visual))}
                      fileKey={`sectionImageFile_${section.id}`}
                      ctl={ctl}
                      hint="1200 × 800 px"
                    />
                    <SourcePicker
                      references={content.references}
                      value={section.sourceIds}
                      onChange={(next) => update((d) => void (d.sections[index].sourceIds = next))}
                    />
                    <LocaleFields label="ป้ายในสารบัญ" value={section.tocLabel} onChange={(tocLabel) => update((d) => void (d.sections[index].tocLabel = tocLabel))} hint="เว้นว่างเพื่อใช้หัวข้อ" />
                    <div className="crm-cms-grid">
                      <Field label="Anchor (tocAnchor)" hint="เว้นว่างเพื่อสร้างจากหัวข้อไทย">
                        <input className="crm-field" value={section.tocAnchor} onChange={(event) => update((d) => void (d.sections[index].tocAnchor = event.target.value))} />
                      </Field>
                      <Check label="แสดงในสารบัญ" checked={section.showInToc} onChange={(next) => update((d) => void (d.sections[index].showInToc = next))} />
                    </div>
                  </ItemCard>
                );
              })}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  update((d) => {
                    d.sections.push({
                      id: newHmItemId("sec"),
                      type: "custom",
                      heading: emptyLocaleText(),
                      bodyTh: "",
                      bodyEn: "",
                      bulletsTh: [],
                      bulletsEn: [],
                      visual: emptyVisual(),
                      sourceIds: [],
                      tocLabel: emptyLocaleText(),
                      tocAnchor: "",
                      showInToc: true,
                      order: d.sections.length + 1,
                    });
                  })
                }
              >
                เพิ่มส่วนเนื้อหา
              </button>
            </section>
          ) : null}

          {tab === "strategies" ? (
            <section className="crm-cms-panel">
              {content.strategies.map((strategy, index) => {
                const title = strategy.title.th || strategy.title.en || `กลยุทธ์ ${index + 1}`;
                return (
                  <ItemCard
                    key={strategy.id}
                    title={`${strategy.num} · ${title}`}
                    index={index}
                    total={content.strategies.length}
                    onMove={(direction) => update((d) => { moveIn(d.strategies, index, direction); renumberStrategies(d.strategies); })}
                    onRemove={() => update((d) => { d.strategies.splice(index, 1); renumberStrategies(d.strategies); })}
                  >
                    <Field label="เลขลำดับ (num)" hint="อัปเดตอัตโนมัติเมื่อเรียงลำดับใหม่">
                      <input className="crm-field" value={strategy.num} onChange={(event) => update((d) => void (d.strategies[index].num = event.target.value))} />
                    </Field>
                    <LocaleFields label="ชื่อกลยุทธ์" value={strategy.title} onChange={(next) => update((d) => void (d.strategies[index].title = next))} />
                    <PairFields
                      label="รายละเอียด"
                      th={strategy.bodyTh}
                      en={strategy.bodyEn}
                      onChange={(next) => update((d) => { d.strategies[index].bodyTh = next.th; d.strategies[index].bodyEn = next.en; })}
                    />
                    <h4>ภาพประกอบ</h4>
                    <VisualFields
                      visual={strategy.visual}
                      onChange={(visual) => update((d) => void (d.strategies[index].visual = visual))}
                      fileKey={`strategyImageFile_${strategy.id}`}
                      ctl={ctl}
                      hint="1200 × 800 px"
                    />
                    <SourcePicker
                      references={content.references}
                      value={strategy.sourceIds}
                      onChange={(next) => update((d) => void (d.strategies[index].sourceIds = next))}
                    />
                  </ItemCard>
                );
              })}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  update((d) => {
                    d.strategies.push({
                      id: newHmItemId("strategy"),
                      num: String(d.strategies.length + 1).padStart(2, "0"),
                      title: emptyLocaleText(),
                      bodyTh: "",
                      bodyEn: "",
                      visual: emptyVisual(),
                      sourceIds: [],
                      order: d.strategies.length + 1,
                    });
                  })
                }
              >
                เพิ่มกลยุทธ์
              </button>
            </section>
          ) : null}

          {tab === "metrics" ? (
            <section className="crm-cms-panel">
              <PairFields label="คำนำตัวชี้วัด" rows={3} th={content.metricsIntroTh} en={content.metricsIntroEn} onChange={(next) => update((d) => { d.metricsIntroTh = next.th; d.metricsIntroEn = next.en; })} />
              <PairFields label="หมายเหตุตัวชี้วัด" rows={3} th={content.metricsNoteTh} en={content.metricsNoteEn} onChange={(next) => update((d) => { d.metricsNoteTh = next.th; d.metricsNoteEn = next.en; })} />
              <p className="crm-contact-image-hint">
                ตัวชี้วัดที่มี “ค่า” ต้องมีสถานะ sample หรือ verified; ถ้าเป็น verified ต้องมีคำนิยาม ช่วงเวลา แหล่งข้อมูล และผู้ตรวจทานที่ยืนยันแล้ว
              </p>
              {content.metrics.map((metric, index) => (
                <ItemCard
                  key={metric.id}
                  title={metric.name || `ตัวชี้วัด ${index + 1}`}
                  index={index}
                  total={content.metrics.length}
                  onMove={(direction) => update((d) => { moveIn(d.metrics, index, direction); renumber(d.metrics); })}
                  onRemove={() => update((d) => { d.metrics.splice(index, 1); renumber(d.metrics); })}
                >
                  <Field label="ชื่อตัวชี้วัด">
                    <input className="crm-field" value={metric.name} onChange={(event) => update((d) => void (d.metrics[index].name = event.target.value))} />
                  </Field>
                  <LocaleFields label="คำถามที่ตอบ" value={metric.question} onChange={(next) => update((d) => void (d.metrics[index].question = next))} rows={2} />
                  <LocaleFields label="คำนิยาม" value={metric.definition} onChange={(next) => update((d) => void (d.metrics[index].definition = next))} rows={2} />
                  <div className="crm-cms-grid">
                    <Field label="ช่วงเวลา">
                      <input className="crm-field" value={metric.period} onChange={(event) => update((d) => void (d.metrics[index].period = event.target.value))} />
                    </Field>
                    <Field label="แหล่งข้อมูล">
                      <input className="crm-field" value={metric.source} onChange={(event) => update((d) => void (d.metrics[index].source = event.target.value))} />
                    </Field>
                    <Field label="ผู้รับผิดชอบ">
                      <input className="crm-field" value={metric.owner} onChange={(event) => update((d) => void (d.metrics[index].owner = event.target.value))} />
                    </Field>
                    <Field label="ค่า" hint="เว้นว่างถ้ายังไม่มีตัวเลขที่ยืนยัน">
                      <input className="crm-field" value={metric.value} onChange={(event) => update((d) => void (d.metrics[index].value = event.target.value))} />
                    </Field>
                    <Field label="สถานะข้อมูล">
                      <Select
                        value={metric.status}
                        options={HM_CLAIM_STATUSES}
                        onChange={(next) => update((d) => void (d.metrics[index].status = (next || "draft") as HmClaimStatus))}
                      />
                    </Field>
                  </div>
                </ItemCard>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  update((d) => {
                    d.metrics.push({
                      id: newHmItemId("metric"),
                      name: "",
                      question: emptyLocaleText(),
                      definition: emptyLocaleText(),
                      period: "",
                      source: "",
                      owner: "",
                      value: "",
                      status: "draft",
                      order: d.metrics.length + 1,
                    });
                  })
                }
              >
                เพิ่มตัวชี้วัด
              </button>
            </section>
          ) : null}

          {tab === "compare" ? (
            <section className="crm-cms-panel">
              <LocaleFields label="หัวข้อส่วนเปรียบเทียบ" value={content.compare.heading} onChange={(next) => update((d) => void (d.compare.heading = next))} />
              <PairFields label="เนื้อหา" th={content.compare.bodyTh} en={content.compare.bodyEn} onChange={(next) => update((d) => { d.compare.bodyTh = next.th; d.compare.bodyEn = next.en; })} />
              <h3>บทบาท (lanes)</h3>
              {content.compare.lanes.map((lane, index) => (
                <ItemCard
                  key={lane.id}
                  title={lane.role.th || lane.role.en || `Lane ${index + 1}`}
                  index={index}
                  total={content.compare.lanes.length}
                  onMove={(direction) => update((d) => { moveIn(d.compare.lanes, index, direction); renumber(d.compare.lanes); })}
                  onRemove={() => update((d) => { d.compare.lanes.splice(index, 1); renumber(d.compare.lanes); })}
                >
                  <LocaleFields label="บทบาท" value={lane.role} onChange={(next) => update((d) => void (d.compare.lanes[index].role = next))} />
                  <LocaleFields label="โฟกัส" rows={2} value={lane.focus} onChange={(next) => update((d) => void (d.compare.lanes[index].focus = next))} />
                </ItemCard>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => update((d) => void d.compare.lanes.push({ id: newHmItemId("lane"), role: emptyLocaleText(), focus: emptyLocaleText(), order: d.compare.lanes.length + 1 }))}
              >
                เพิ่ม lane
              </button>
              <h3>การส่งต่องาน (handoffs)</h3>
              {content.compare.handoffs.map((handoff, index) => (
                <ItemCard
                  key={handoff.id}
                  title={handoff.from || `Handoff ${index + 1}`}
                  index={index}
                  total={content.compare.handoffs.length}
                  onMove={(direction) => update((d) => { moveIn(d.compare.handoffs, index, direction); renumber(d.compare.handoffs); })}
                  onRemove={() => update((d) => { d.compare.handoffs.splice(index, 1); renumber(d.compare.handoffs); })}
                >
                  <Field label="จาก (from)">
                    <input className="crm-field" value={handoff.from} onChange={(event) => update((d) => void (d.compare.handoffs[index].from = event.target.value))} />
                  </Field>
                  <LocaleFields label="ข้อความ" rows={2} value={handoff.text} onChange={(next) => update((d) => void (d.compare.handoffs[index].text = next))} />
                </ItemCard>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => update((d) => void d.compare.handoffs.push({ id: newHmItemId("handoff"), from: "", text: emptyLocaleText(), order: d.compare.handoffs.length + 1 }))}
              >
                เพิ่ม handoff
              </button>
              <h3>ภาพประกอบ</h3>
              <VisualFields
                visual={content.compare.visual}
                onChange={(visual) => update((d) => void (d.compare.visual = visual))}
                fileKey="compareImageFile"
                ctl={ctl}
                hint="1600 × 900 px · swimlane"
              />
            </section>
          ) : null}

          {tab === "start" ? (
            <section className="crm-cms-panel">
              <LocaleFields label="หัวข้อส่วนเริ่มต้น" value={content.startHere.heading} onChange={(next) => update((d) => void (d.startHere.heading = next))} />
              <PairFields label="คำนำ" th={content.startHere.introTh} en={content.startHere.introEn} onChange={(next) => update((d) => { d.startHere.introTh = next.th; d.startHere.introEn = next.en; })} />
              <h3>ขั้นตอน</h3>
              {content.startHere.steps.map((step, index) => (
                <ItemCard
                  key={step.id}
                  title={step.title.th || step.title.en || `ขั้นที่ ${index + 1}`}
                  index={index}
                  total={content.startHere.steps.length}
                  onMove={(direction) => update((d) => { moveIn(d.startHere.steps, index, direction); renumber(d.startHere.steps); })}
                  onRemove={() => update((d) => { d.startHere.steps.splice(index, 1); renumber(d.startHere.steps); })}
                >
                  <LocaleFields label="ขั้นตอน" rows={2} value={step.title} onChange={(next) => update((d) => void (d.startHere.steps[index].title = next))} />
                </ItemCard>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => update((d) => void d.startHere.steps.push({ id: newHmItemId("step"), title: emptyLocaleText(), order: d.startHere.steps.length + 1 }))}
              >
                เพิ่มขั้นตอน
              </button>
              <PairFields label="ข้อความปิดท้าย" rows={3} th={content.startHere.closingTh} en={content.startHere.closingEn} onChange={(next) => update((d) => { d.startHere.closingTh = next.th; d.startHere.closingEn = next.en; })} />
              <h3>ภาพประกอบ</h3>
              <VisualFields
                visual={content.startHere.visual}
                onChange={(visual) => update((d) => void (d.startHere.visual = visual))}
                fileKey="startImageFile"
                ctl={ctl}
                hint="1600 × 900 px · roadmap"
              />
            </section>
          ) : null}

          {tab === "conclusion" ? (
            <section className="crm-cms-panel">
              <LocaleFields label="หัวข้อสรุป" value={content.conclusion.heading} onChange={(next) => update((d) => void (d.conclusion.heading = next))} />
              <PairFields label="เนื้อหาสรุป" th={content.conclusion.bodyTh} en={content.conclusion.bodyEn} onChange={(next) => update((d) => { d.conclusion.bodyTh = next.th; d.conclusion.bodyEn = next.en; })} />
              <h3>CTA</h3>
              <LocaleFields label="หัวข้อ CTA" value={content.cta.title} onChange={(next) => update((d) => void (d.cta.title = next))} />
              <LocaleFields label="ข้อความ CTA" rows={3} value={content.cta.body} onChange={(next) => update((d) => void (d.cta.body = next))} />
              <LocaleFields label="ข้อความบนปุ่ม" value={content.cta.buttonLabel} onChange={(next) => update((d) => void (d.cta.buttonLabel = next))} />
            </section>
          ) : null}

          {tab === "related" ? (
            <section className="crm-cms-panel">
              <h3>บริการที่เกี่ยวข้อง</h3>
              {content.relatedServices.map((service, index) => (
                <ItemCard
                  key={service.id}
                  title={service.href || `บริการ ${index + 1}`}
                  index={index}
                  total={content.relatedServices.length}
                  onMove={(direction) => update((d) => { moveIn(d.relatedServices, index, direction); renumber(d.relatedServices); })}
                  onRemove={() => update((d) => { d.relatedServices.splice(index, 1); renumber(d.relatedServices); })}
                >
                  <Field label="ลิงก์" hint="path ในเว็บไซต์ (เช่น /solutions/...) หรือ https://">
                    <input className="crm-field" value={service.href} onChange={(event) => update((d) => void (d.relatedServices[index].href = event.target.value))} />
                  </Field>
                  <LocaleFields label="เหตุผลที่เกี่ยวข้อง" rows={2} value={service.why} onChange={(next) => update((d) => void (d.relatedServices[index].why = next))} />
                </ItemCard>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => update((d) => void d.relatedServices.push({ id: newHmItemId("svc"), href: "", why: emptyLocaleText(), order: d.relatedServices.length + 1 }))}
              >
                เพิ่มบริการที่เกี่ยวข้อง
              </button>
              <h3>บทความที่เกี่ยวข้อง</h3>
              {content.relatedArticles.map((article, index) => (
                <ItemCard
                  key={article.id}
                  title={article.articleId || `บทความ ${index + 1}`}
                  index={index}
                  total={content.relatedArticles.length}
                  onMove={(direction) => update((d) => { moveIn(d.relatedArticles, index, direction); renumber(d.relatedArticles); })}
                  onRemove={() => update((d) => { d.relatedArticles.splice(index, 1); renumber(d.relatedArticles); })}
                >
                  <Field label="รหัสบทความ (articleId)" hint="slug หรือ id ของบทความใน Insights">
                    <input className="crm-field" value={article.articleId} onChange={(event) => update((d) => void (d.relatedArticles[index].articleId = event.target.value))} />
                  </Field>
                </ItemCard>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => update((d) => void d.relatedArticles.push({ id: newHmItemId("article"), articleId: "", order: d.relatedArticles.length + 1 }))}
              >
                เพิ่มบทความที่เกี่ยวข้อง
              </button>
            </section>
          ) : null}

          {tab === "references" ? (
            <section className="crm-cms-panel">
              <LocaleFields label="หมายเหตุแหล่งอ้างอิง" rows={3} value={content.referencesNote} onChange={(next) => update((d) => void (d.referencesNote = next))} />
              {content.references.map((ref, index) => (
                <ItemCard
                  key={ref.id}
                  title={ref.label.th || ref.label.en || `แหล่งอ้างอิง ${index + 1}`}
                  index={index}
                  total={content.references.length}
                  onMove={(direction) => update((d) => moveIn(d.references, index, direction))}
                  onRemove={() =>
                    update((d) => {
                      const [removed] = d.references.splice(index, 1);
                      if (!removed) return;
                      for (const section of d.sections) section.sourceIds = section.sourceIds.filter((id) => id !== removed.id);
                      for (const strategy of d.strategies) strategy.sourceIds = strategy.sourceIds.filter((id) => id !== removed.id);
                    })
                  }
                >
                  <LocaleFields label="ชื่อแหล่งที่มา" value={ref.label} onChange={(next) => update((d) => void (d.references[index].label = next))} />
                  <div className="crm-cms-grid">
                    <Field label="URL">
                      <input className="crm-field" value={ref.url} onChange={(event) => update((d) => void (d.references[index].url = event.target.value))} />
                    </Field>
                    <Field label="สถานะแหล่งข้อมูล">
                      <Select
                        value={ref.status}
                        options={HM_SOURCE_STATUSES}
                        onChange={(next) => update((d) => void (d.references[index].status = (next || "guidance") as HmSourceStatus))}
                      />
                    </Field>
                    <Field label="วันที่เผยแพร่" hint="YYYY-MM-DD">
                      <input className="crm-field" type="date" value={ref.publishedAt} onChange={(event) => update((d) => void (d.references[index].publishedAt = event.target.value))} />
                    </Field>
                    <Field label="วันที่เข้าถึง" hint="จำเป็นสำหรับแหล่งจาก platform / guidance">
                      <input className="crm-field" type="date" value={ref.accessedAt} onChange={(event) => update((d) => void (d.references[index].accessedAt = event.target.value))} />
                    </Field>
                    <Field label="ช่วงเวลาข้อมูล">
                      <input className="crm-field" value={ref.period} onChange={(event) => update((d) => void (d.references[index].period = event.target.value))} />
                    </Field>
                  </div>
                  <Field label="คำนิยาม / ข้อจำกัด">
                    <textarea className="crm-area" rows={2} value={ref.definition} onChange={(event) => update((d) => void (d.references[index].definition = event.target.value))} />
                  </Field>
                </ItemCard>
              ))}
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  update((d) => {
                    d.references.push({
                      id: newHmItemId("ref"),
                      label: emptyLocaleText(),
                      url: "",
                      publishedAt: "",
                      accessedAt: "",
                      period: "",
                      definition: "",
                      status: "guidance",
                    });
                  })
                }
              >
                เพิ่มแหล่งอ้างอิง
              </button>
            </section>
          ) : null}

          {tab === "seo" ? (
            <section className="crm-cms-panel">
              <LocaleFields label="SEO title" value={content.seo.title} onChange={(next) => update((d) => void (d.seo.title = next))} />
              <LocaleFields label="Meta description" rows={3} value={content.seo.description} onChange={(next) => update((d) => void (d.seo.description = next))} />
              <Field label="Canonical URL" hint="path (/insights/...) หรือ https:// — เว้นว่างถ้าใช้ค่าเริ่มต้น">
                <input className="crm-field" value={content.seo.canonical} onChange={(event) => update((d) => void (d.seo.canonical = event.target.value))} />
              </Field>
              <h3>ภาพโซเชียล (Open Graph)</h3>
              <VisualFields
                visual={content.seo.social}
                onChange={(visual) => update((d) => void (d.seo.social = visual))}
                fileKey="ogImageFile"
                ctl={ctl}
                hint="1200 × 630 px"
              />
            </section>
          ) : null}

          {tab === "translation" ? (
            <section className="crm-cms-panel">
              <p className="crm-contact-image-hint">
                ระบบไม่เขียนเนื้อหาภาษาอังกฤษให้อัตโนมัติ — สำเนา EN จะคัดลอกโครงสร้างจากฉบับไทย และคงข้อความอังกฤษที่ทีมแปลกรอกไว้แล้ว
              </p>
              <Check
                label="เปิดใช้ภาษาอังกฤษ (enEnabled)"
                checked={content.translation.enEnabled}
                onChange={(next) => update((d) => void (d.translation.enEnabled = next))}
                hint="เมื่อเปิด การเผยแพร่ต้องมี Title, Excerpt, Alt ภาพปก และ SEO ภาษาอังกฤษครบ"
              />
              <Check
                label="ภาษาอังกฤษพร้อมเผยแพร่ (enReady)"
                checked={content.translation.enReady}
                onChange={(next) => update((d) => void (d.translation.enReady = next))}
                hint="ทำเครื่องหมายหลังทีมตรวจทานเนื้อหาแล้วเท่านั้น"
              />
              <Field label="สำเนามาจากภาษา">
                <input className="crm-field" value={content.translation.duplicateOfLocale || "—"} readOnly />
              </Field>
              {duplicateAction ? (
                <>
                  {locale !== "th" ? (
                    <p className="crm-users-alert is-warn" role="status">
                      สร้างสำเนาเพื่อแปลได้จากบทความภาษาไทยเท่านั้น
                    </p>
                  ) : null}
                  {dirty ? (
                    <p className="crm-contact-image-hint">บันทึกการแก้ไขก่อน — สำเนา EN คัดลอกจากฉบับที่บันทึกไว้ล่าสุด</p>
                  ) : null}
                  <div className="crm-cs-sticky-actions">
                    <button
                      type="button"
                      className="crm-users-secondary"
                      disabled={duplicating || pending || dirty || locale !== "th"}
                      onClick={duplicateToEnglish}
                    >
                      {duplicating ? "กำลังสร้างสำเนา…" : "สร้างสำเนา EN สำหรับแปล"}
                    </button>
                  </div>
                  <div role="status" aria-live="polite">
                    {duplicateResult?.ok ? (
                      <p className="crm-users-alert is-ok">
                        สร้างสำเนา EN แล้ว (ฉบับร่าง) —{" "}
                        <Link href={`/crm/cms/insights/${duplicateResult.id}?tab=basics`} className="crm-cms-inline-link">
                          เปิดบทความภาษาอังกฤษเพื่อแปล
                        </Link>
                      </p>
                    ) : duplicateResult ? (
                      <p className="crm-users-alert is-warn">{hmCmsErrorMessage(duplicateResult.error)}</p>
                    ) : null}
                  </div>
                </>
              ) : null}
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
                ตัวอย่างในระบบ: <Link href={previewHref}>{previewHref}</Link>
              </p>
              <h3>รายการตรวจก่อนเผยแพร่</h3>
              <ul className="crm-cs-checklist">
                {checklist.map((item) => (
                  <li key={item.label}>
                    <span aria-hidden="true">{item.ok ? "✓" : "✗"}</span> <span className="sr-only">{item.ok ? "ผ่าน: " : "ยังไม่ผ่าน: "}</span>
                    {item.label}
                    {item.ok ? null : (
                      <>
                        {" "}
                        <button type="button" className="crm-users-secondary" onClick={() => setTab(item.tab)}>
                          ไปแก้ไข
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              <p className={`crm-users-alert ${publishError ? "is-warn" : "is-ok"}`} role="status">
                {publishError ? hmCmsErrorMessage(publishError) : "ผ่านเงื่อนไขการเผยแพร่ทั้งหมด"}
              </p>
              <p className="crm-contact-image-hint">ปุ่มเผยแพร่ / ยกเลิกเผยแพร่อยู่ที่แถบด้านบนและด้านล่างของหน้านี้</p>
            </section>
          ) : null}
        </div>
        {saveBar(false)}
      </form>
      {dialog === "unpublish" ? (
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" tabIndex={-1} onClick={() => setDialog(null)} />
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby="hotel-marketing-unpublish-title">
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">CMS</p>
                <h2 id="hotel-marketing-unpublish-title">ยกเลิกเผยแพร่</h2>
              </div>
              <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={() => setDialog(null)}>
                ×
              </button>
            </div>
            <p className="crm-users-alert is-warn" role="status">
              บทความจะกลับเป็นฉบับร่างและหน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ด จนกว่าจะเผยแพร่อีกครั้ง
            </p>
            <div className="crm-modal-actions">
              <button ref={dialogCancelRef} type="button" className="crm-users-secondary" onClick={() => setDialog(null)}>
                ยกเลิก
              </button>
              <button
                type="button"
                className="kpi-button"
                style={{ background: "#a2dc25", color: "#1a3a02" }}
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
