"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { CaseStudySaveResult } from "@/lib/cms/case-studies";
import {
  CASE_STUDY_DATA_STATUSES,
  CASE_STUDY_DEPARTMENTS,
  CASE_STUDY_HOTEL_TYPES,
  CASE_STUDY_IMAGE_TYPES,
  CASE_STUDY_SERVICE_AREAS,
  COVER_IMAGE_HINT,
  COVER_MIN_SIZE,
  MAX_CASE_STUDY_IMAGE_BYTES,
  METRIC_STATUSES,
  REPORT_IMAGE_HINT,
  REPORT_MIN_SIZE,
  adminPreviewFromInput,
  caseStudyErrorMessage,
  emptyMetric,
  type CaseStudyIntent,
  type CaseStudyRelatedOption,
  type CaseStudySaveInput,
} from "@/lib/cms/case-studies";
import type { CaseMetric } from "@/lib/case-studies";

const DATA_STATUS_LABELS: Record<(typeof CASE_STUDY_DATA_STATUSES)[number], string> = {
  draft: "Draft — ฉบับร่าง",
  anonymised: "Anonymised — ไม่ระบุชื่อลูกค้า",
  approved: "Approved — อนุมัติแล้ว",
  sample: "Sample — ข้อมูลตัวอย่าง",
  published: "Published — พร้อมเผยแพร่",
};

const COVER_STATUS_LABELS: Record<CaseStudySaveInput["coverImageStatus"], string> = {
  placeholder: "Placeholder",
  sample: "Sample",
  approved: "Approved",
  real: "Real",
};

const EDITOR_TABS = [
  { id: "overview", label: "Overview" },
  { id: "challenge", label: "Challenge" },
  { id: "action", label: "Action" },
  { id: "metrics", label: "Metrics" },
  { id: "evidence", label: "Evidence" },
  { id: "seo", label: "SEO" },
  { id: "publish", label: "Publish" },
  { id: "preview", label: "Preview" },
] as const;

type EditorTab = (typeof EDITOR_TABS)[number]["id"];

function isEditorTab(value: string | undefined): value is EditorTab {
  return EDITOR_TABS.some((tab) => tab.id === value);
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

function ImagePreview({
  src,
  alt,
  recommended,
}: {
  src: string;
  alt: string;
  recommended: string;
}) {
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

function inspectImageFile(file: File, min: { width: number; height: number }) {
  const dot = file.name.lastIndexOf(".");
  const ext = dot >= 0 ? file.name.slice(dot).toLowerCase() : "";
  if (!CASE_STUDY_IMAGE_TYPES.has(ext) || file.size > MAX_CASE_STUDY_IMAGE_BYTES) {
    return Promise.resolve("invalid_image");
  }
  return new Promise<string | null>((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      if (image.naturalWidth < min.width || image.naturalHeight < min.height) {
        resolve("image_dimensions");
        return;
      }
      resolve(null);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("invalid_image");
    };
    image.src = url;
  });
}

export function CaseStudyEditor({
  initial,
  creating,
  notice,
  error,
  saveAction,
  deleteAction,
  duplicateAction,
  relatedOptions = [],
  updatedAt,
  initialTab,
}: {
  initial: CaseStudySaveInput;
  creating: boolean;
  notice?: string;
  error?: string;
  saveAction: (formData: FormData) => Promise<CaseStudySaveResult>;
  deleteAction: (formData: FormData) => void | Promise<void>;
  duplicateAction: (formData: FormData) => void | Promise<void>;
  relatedOptions?: CaseStudyRelatedOption[];
  updatedAt?: string;
  initialTab?: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [tab, setTab] = useState<EditorTab>(isEditorTab(initialTab) ? initialTab : "overview");
  const [form, setForm] = useState<CaseStudySaveInput>(initial);
  const [metrics, setMetrics] = useState<CaseMetric[]>(initial.metrics.length ? initial.metrics : [emptyMetric(1)]);
  const [status, setStatus] = useState(error ? caseStudyErrorMessage(error) : "");
  const [ok, setOk] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<"unpublish" | "delete" | null>(null);
  const [coverPreview, setCoverPreview] = useState(initial.coverImage);
  const [reportPreview, setReportPreview] = useState(initial.reportPreview);
  const [logoPreview, setLogoPreview] = useState(initial.clientLogo);
  const [clearCover, setClearCover] = useState(false);
  const [clearReport, setClearReport] = useState(false);
  const [clearLogo, setClearLogo] = useState(false);
  const [dirty, setDirty] = useState(false);

  const saveState = pending ? "กำลังบันทึก…" : status ? "บันทึกไม่สำเร็จ" : dirty ? "ยังไม่ได้บันทึก" : ok || (updatedAt ? `บันทึกล่าสุด ${formatStamp(updatedAt)}` : "");
  const chartText = useMemo(() => (form.comparison ? JSON.stringify(form.comparison, null, 2) : ""), [form.comparison]);
  const relatedSet = useMemo(() => new Set(form.relatedArticleIds.map((item) => item.trim()).filter(Boolean)), [form.relatedArticleIds]);
  const preview = useMemo(() => adminPreviewFromInput(form, metrics), [form, metrics]);

  useEffect(() => {
    if (!dialog) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setDialog(null);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [dialog]);

  function markDirty() {
    setDirty(true);
    setOk("");
    setStatus("");
  }

  function patch<K extends keyof CaseStudySaveInput>(key: K, value: CaseStudySaveInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    markDirty();
  }

  function patchMetric(index: number, next: Partial<CaseMetric>) {
    setMetrics((current) => current.map((metric, i) => (i === index ? { ...metric, ...next } : metric)));
    markDirty();
  }

  function toggleRelated(id: string) {
    setForm((current) => {
      const next = new Set(current.relatedArticleIds.map((item) => item.trim()).filter(Boolean));
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...current, relatedArticleIds: [...next] };
    });
    markDirty();
  }

  function submit(intent: CaseStudyIntent, data: FormData) {
    data.set("intent", intent);
    data.set("metricsJson", JSON.stringify(metrics));
    data.set("chartJson", String(data.get("chartJson") ?? chartText));
    data.set("clientNameApproved", form.clientNameApproved ? "1" : "0");
    data.set("clientLogoPublishable", form.clientLogoPublishable ? "1" : "0");
    data.set("isFeatured", form.isFeatured ? "1" : "0");
    data.set("testimonialApproved", form.testimonial.approvalStatus === "approved" ? "1" : "0");
    data.set("sourceNotes", form.sourceNotes.join("\n"));
    if (clearCover) data.set("clearCoverImage", "1");
    if (clearReport) data.set("clearReportPreview", "1");
    if (clearLogo) data.set("clearClientLogo", "1");
    startTransition(async () => {
      setOk("");
      setStatus("");
      const result = await saveAction(data);
      if (!result.ok) {
        setStatus(caseStudyErrorMessage(result.error));
        return;
      }
      setOk(intent === "preview" ? "บันทึกแล้ว — ตัวอย่างด้านล่างใช้ฉบับที่บันทึก" : "บันทึกแล้ว");
      setDirty(false);
      if (intent === "preview") {
        setTab("preview");
        if (creating || result.id !== form.id) {
          router.push(`/crm/cms/case-studies/${result.id}?saved=1&tab=preview`);
          return;
        }
        router.refresh();
        return;
      }
      if (creating || result.id !== form.id) {
        router.push(`/crm/cms/case-studies/${result.id}?saved=1`);
        return;
      }
      router.refresh();
    });
  }

  async function submitFromForm(intent: CaseStudyIntent) {
    const node = formRef.current;
    if (!node) return;
    const data = new FormData(node);
    const cover = data.get("coverImageFile");
    const report = data.get("reportPreviewFile");
    const logo = data.get("clientLogoFile");
    if (cover instanceof File && cover.size) {
      const invalid = await inspectImageFile(cover, COVER_MIN_SIZE);
      if (invalid) {
        setStatus(caseStudyErrorMessage(invalid));
        return;
      }
    }
    if (report instanceof File && report.size) {
      const invalid = await inspectImageFile(report, REPORT_MIN_SIZE);
      if (invalid) {
        setStatus(caseStudyErrorMessage(invalid));
        return;
      }
    }
    if (logo instanceof File && logo.size) {
      const invalid = await inspectImageFile(logo, { width: 64, height: 64 });
      if (invalid) {
        setStatus(caseStudyErrorMessage(invalid));
        return;
      }
    }
    submit(intent, data);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = (submitter?.value as CaseStudyIntent) || "save";
    if (intent === "unpublish") {
      setDialog("unpublish");
      return;
    }
    await submitFromForm(intent);
  }

  const alerts = (
    <>
      {dirty ? (
        <p className="crm-users-alert is-warn" role="status">
          มีการแก้ไขที่ยังไม่บันทึก — ต้องบันทึกก่อนดูตัวอย่างสาธารณะ
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
      {status ? (
        <p className="crm-users-alert is-warn" role="alert">
          {status}
        </p>
      ) : null}
    </>
  );

  return (
    <div>
    <form ref={formRef} className="crm-cs-editor-shell" onSubmit={onSubmit}>
      {form.id ? <input type="hidden" name="id" value={form.id} /> : null}
      <input type="hidden" name="locale" value={form.locale || "th"} />
      <input type="hidden" name="coverImage" value={form.coverImage} />
      <input type="hidden" name="reportPreview" value={form.reportPreview} />
      <input type="hidden" name="clientLogo" value={form.clientLogo} />
      <input type="hidden" name="workflowStatus" value={form.workflowStatus} />
      <input type="hidden" name="relatedArticleIds" value={form.relatedArticleIds.join(",")} />

      <div className="crm-cs-tabs" role="tablist" aria-label="ส่วนแก้ไขเคสสตัดดี">
        {EDITOR_TABS.map((item) => (
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

      <div className="crm-cms-editor">
        <div className="crm-cms-editor-main">
          {alerts}

          <section className="crm-cms-editor-panel" hidden={tab !== "overview"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Overview</p>
                <h2>{creating ? "เคสใหม่" : "ข้อมูลภาพรวม"}</h2>
              </div>
              <div className="crm-cs-savebar">
                <button className="kpi-button" type="submit" name="intent" value="save" disabled={pending}>
                  บันทึก
                </button>
                <p className={`crm-cs-save-state${status ? " is-error" : dirty ? " is-dirty" : ok ? " is-ok" : ""}`} role="status">
                  {pending ? "กำลังบันทึก…" : status || (dirty ? "ยังไม่ได้บันทึก" : ok || "พร้อมบันทึก")}
                </p>
              </div>
            </header>
            <div className="crm-cms-field-grid">
              <Field label="ชื่อเรื่อง">
                <input className="crm-field" name="title" value={form.title} onChange={(e) => patch("title", e.target.value)} required />
              </Field>
              <Field label="Slug" hint="ใช้ในที่อยู่ /case-studies/slug — ต้องไม่ซ้ำ">
                <input className="crm-field" name="slug" value={form.slug} onChange={(e) => patch("slug", e.target.value)} placeholder="layan-revenue-management" />
              </Field>
            </div>
            <Field label="คำอธิบายสั้น">
              <textarea className="crm-area" name="shortDescription" rows={3} value={form.shortDescription} onChange={(e) => patch("shortDescription", e.target.value)} />
            </Field>
            <div className="crm-cms-field-grid">
              <Field label="แผนก">
                <select className="crm-field" name="department" value={form.department} onChange={(e) => patch("department", e.target.value as CaseStudySaveInput["department"])}>
                  {CASE_STUDY_DEPARTMENTS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.labelTh} · {item.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="สายบริการ">
                <input className="crm-field" name="serviceArea" list="cs-service-areas" value={form.serviceArea} onChange={(e) => patch("serviceArea", e.target.value)} />
                <datalist id="cs-service-areas">
                  {CASE_STUDY_SERVICE_AREAS.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </Field>
            </div>
            <p className="crm-cms-editor-note">ชื่อลูกค้าและโลโก้เป็นข้อมูลภายในจนกว่าจะมีธงอนุมัติ เคสแบบ Anonymised จะไม่แสดงชื่อลูกค้าบนหน้าเว็บ</p>
            <div className="crm-cms-field-grid">
              <Field label="ชื่อลูกค้า (ถ้ามี)">
                <input className="crm-field" name="clientName" value={form.clientName} onChange={(e) => patch("clientName", e.target.value)} />
              </Field>
              <Field label="ป้ายไม่ระบุชื่อ (ถ้ามี)">
                <input className="crm-field" name="anonymisedLabel" value={form.anonymisedLabel} onChange={(e) => patch("anonymisedLabel", e.target.value)} />
              </Field>
              <Field label="ประเภทโรงแรม">
                <input className="crm-field" name="hotelType" list="cs-hotel-types" value={form.hotelType} onChange={(e) => patch("hotelType", e.target.value)} />
                <datalist id="cs-hotel-types">
                  {CASE_STUDY_HOTEL_TYPES.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </Field>
              <Field label="ที่ตั้ง (ถ้ามี)">
                <input className="crm-field" name="location" value={form.location} onChange={(e) => patch("location", e.target.value)} />
              </Field>
            </div>
            <label className="crm-cms-check">
              <input type="checkbox" checked={form.clientNameApproved} onChange={(e) => patch("clientNameApproved", e.target.checked)} />
              อนุมัติให้แสดงชื่อลูกค้า
            </label>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "challenge"}>
            <header className="crm-cms-editor-panel-head">
              <div>
                <p className="crm-cms-editor-kicker">Challenge</p>
                <h2>ปัญหาและการวิเคราะห์</h2>
              </div>
            </header>
            <Field label="Challenge">
              <textarea className="crm-area" name="challenge" rows={8} value={form.challenge} onChange={(e) => patch("challenge", e.target.value)} />
            </Field>
            <Field label="Analysis">
              <textarea className="crm-area" name="analysis" rows={6} value={form.analysis} onChange={(e) => patch("analysis", e.target.value)} />
            </Field>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "action"}>
            <header className="crm-cms-editor-panel-head">
              <div>
                <p className="crm-cms-editor-kicker">Action</p>
                <h2>การดำเนินการและผลลัพธ์</h2>
              </div>
            </header>
            <Field label="Action" hint="หนึ่งรายการต่อบรรทัด">
              <textarea className="crm-area" name="actionPlan" rows={8} value={form.actionPlan} onChange={(e) => patch("actionPlan", e.target.value)} />
            </Field>
            <Field label="Result">
              <textarea className="crm-area" name="result" rows={6} value={form.result} onChange={(e) => patch("result", e.target.value)} />
            </Field>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "metrics"}>
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Metrics</p>
                <h2>ตัวชี้วัด</h2>
              </div>
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => {
                  setMetrics((current) => [...current, emptyMetric(current.length + 1)]);
                  markDirty();
                }}
              >
                เพิ่มตัวชี้วัด
              </button>
            </header>
            <p className="crm-cms-editor-note">ตัวชี้วัดที่เผยแพร่ต้องมีค่า หน่วยหรือสกุลเงิน ช่วงเวลา บริบทเปรียบเทียบ และสถานะข้อมูล</p>
            <div className="crm-cms-field-grid">
              <Field label="ช่วงเวลาที่วัดผล">
                <input className="crm-field" name="measurementPeriod" value={form.measurementPeriod} onChange={(e) => patch("measurementPeriod", e.target.value)} />
              </Field>
              <Field label="ช่วงเปรียบเทียบ / baseline">
                <input className="crm-field" name="baselinePeriod" value={form.baselinePeriod} onChange={(e) => patch("baselinePeriod", e.target.value)} />
              </Field>
            </div>
            <div className="crm-cs-metrics">
              {metrics.map((metric, index) => (
                <article key={metric.id || index} className="crm-cs-metric">
                  <header className="crm-cs-metric-head">
                    <h3>{index === 0 ? "ตัวชี้วัดหลัก" : `ตัวชี้วัดสนับสนุน ${index}`}</h3>
                    {metrics.length > 1 ? (
                      <button
                        type="button"
                        className="crm-users-secondary"
                        onClick={() => {
                          setMetrics((current) => current.filter((_, i) => i !== index));
                          markDirty();
                        }}
                      >
                        ลบ
                      </button>
                    ) : null}
                  </header>
                  <div className="crm-cms-field-grid">
                    <Field label="ชื่อตัวชี้วัด">
                      <input className="crm-field" value={metric.label} onChange={(e) => patchMetric(index, { label: e.target.value })} />
                    </Field>
                    <Field label="ค่า">
                      <input className="crm-field" value={metric.value} onChange={(e) => patchMetric(index, { value: e.target.value })} />
                    </Field>
                    <Field label="หน่วย">
                      <input className="crm-field" value={metric.unit ?? ""} onChange={(e) => patchMetric(index, { unit: e.target.value })} placeholder="% / pts / room nights" />
                    </Field>
                    <Field label="สกุลเงิน">
                      <input className="crm-field" value={metric.currency ?? ""} onChange={(e) => patchMetric(index, { currency: e.target.value })} placeholder="THB" />
                    </Field>
                    <Field label="ช่วงเวลา">
                      <input className="crm-field" value={metric.period} onChange={(e) => patchMetric(index, { period: e.target.value })} />
                    </Field>
                    <Field label="ช่วงเปรียบเทียบ">
                      <input className="crm-field" value={metric.baselinePeriod ?? ""} onChange={(e) => patchMetric(index, { baselinePeriod: e.target.value })} />
                    </Field>
                    <Field label="ตัวเลขเปรียบเทียบ">
                      <input className="crm-field" value={metric.comparison ?? ""} onChange={(e) => patchMetric(index, { comparison: e.target.value })} />
                    </Field>
                    <Field label="สถานะข้อมูล">
                      <select className="crm-field" value={metric.status} onChange={(e) => patchMetric(index, { status: e.target.value as CaseMetric["status"] })}>
                        {METRIC_STATUSES.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="บริบทเปรียบเทียบ">
                    <input className="crm-field" value={metric.context} onChange={(e) => patchMetric(index, { context: e.target.value })} />
                  </Field>
                  <Field label="คำจำกัดความ (ถ้ามี)">
                    <input className="crm-field" value={metric.definition ?? ""} onChange={(e) => patchMetric(index, { definition: e.target.value })} />
                  </Field>
                  <Field label="แหล่งที่มาของตัวชี้วัด (ถ้ามี)">
                    <input className="crm-field" value={metric.sourceNote ?? ""} onChange={(e) => patchMetric(index, { sourceNote: e.target.value })} />
                  </Field>
                </article>
              ))}
            </div>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "evidence"}>
            <header className="crm-cms-editor-panel-head">
              <div>
                <p className="crm-cms-editor-kicker">Evidence</p>
                <h2>รูป โลโก้ หลักฐาน และแหล่งข้อมูล</h2>
              </div>
            </header>
            <Field label="คำอธิบายรูปปก (alt text)" hint="จำเป็นเมื่อมีรูปปก">
              <input className="crm-field" name="coverImageAlt" value={form.coverImageAlt} onChange={(e) => patch("coverImageAlt", e.target.value)} />
            </Field>
            <Field label="สถานะรูปปก">
              <select
                className="crm-field"
                name="coverImageStatus"
                value={form.coverImageStatus}
                onChange={(e) => patch("coverImageStatus", e.target.value as CaseStudySaveInput["coverImageStatus"])}
              >
                {(Object.keys(COVER_STATUS_LABELS) as Array<CaseStudySaveInput["coverImageStatus"]>).map((item) => (
                  <option key={item} value={item}>
                    {COVER_STATUS_LABELS[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="อัปโหลด / แทนที่รูปปก" hint={COVER_IMAGE_HINT}>
              <input
                className="crm-field"
                type="file"
                name="coverImageFile"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setCoverPreview(URL.createObjectURL(file));
                  setClearCover(false);
                  patch("coverImageStatus", form.coverImageStatus === "placeholder" ? "real" : form.coverImageStatus);
                }}
              />
            </Field>
            <ImagePreview src={clearCover ? "" : coverPreview} alt={form.coverImageAlt} recommended={COVER_IMAGE_HINT} />
            {coverPreview && !clearCover ? (
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => {
                  setClearCover(true);
                  setCoverPreview("");
                  patch("coverImageStatus", "placeholder");
                }}
              >
                ลบรูปปก
              </button>
            ) : null}
            <Field label="คำอธิบายตัวอย่างรายงาน" hint="จำเป็นเมื่อมีรูปตัวอย่างรายงาน">
              <input className="crm-field" name="reportPreviewAlt" value={form.reportPreviewAlt} onChange={(e) => patch("reportPreviewAlt", e.target.value)} />
            </Field>
            <Field label="อัปโหลด / แทนที่ตัวอย่างรายงาน" hint={REPORT_IMAGE_HINT}>
              <input
                className="crm-field"
                type="file"
                name="reportPreviewFile"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setReportPreview(URL.createObjectURL(file));
                  setClearReport(false);
                  markDirty();
                }}
              />
            </Field>
            <ImagePreview src={clearReport ? "" : reportPreview} alt={form.reportPreviewAlt} recommended={REPORT_IMAGE_HINT} />
            {reportPreview && !clearReport ? (
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => {
                  setClearReport(true);
                  setReportPreview("");
                  markDirty();
                }}
              >
                ลบตัวอย่างรายงาน
              </button>
            ) : null}

            <h3>สิทธิ์โลโก้ลูกค้า</h3>
            <p className="crm-cms-editor-note">โลโก้ไม่แสดงสาธารณะจนกว่าจะบันทึกเป็น Approved และเคสไม่ใช่แบบนิรนาม</p>
            <Field label="อัปโหลด / แทนที่โลโก้ลูกค้า">
              <input
                className="crm-field"
                type="file"
                name="clientLogoFile"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setLogoPreview(URL.createObjectURL(file));
                  setClearLogo(false);
                  markDirty();
                }}
              />
            </Field>
            <Field label="สิทธิ์เผยแพร่โลโก้" hint="ต้องกดบันทึกหลังเปลี่ยนค่านี้">
              <select
                className="crm-field"
                value={form.clientLogoPublishable ? "approved" : "pending"}
                onChange={(e) => patch("clientLogoPublishable", e.target.value === "approved")}
              >
                <option value="pending">Pending — ไม่เผยแพร่</option>
                <option value="approved">Approved — อนุมัติเผยแพร่</option>
              </select>
            </Field>
            <ImagePreview src={clearLogo ? "" : logoPreview} alt={form.clientName || "Client logo"} recommended="โลโก้ลูกค้าไม่แสดงสาธารณะจนกว่าจะมีธงอนุญาต" />
            {logoPreview && !clearLogo ? (
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => {
                  setClearLogo(true);
                  setLogoPreview("");
                  patch("clientLogoPublishable", false);
                }}
              >
                ลบโลโก้และสิทธิ์เผยแพร่
              </button>
            ) : null}

            <Field label="Evidence chart data (JSON)" hint="เก็บ resultsTable / breakdown ตามโครงสาธารณะ">
              <textarea
                className="crm-area crm-cms-editor-body"
                name="chartJson"
                rows={8}
                defaultValue={chartText}
                placeholder='{"resultsTable":[{"label":"Room Revenue","before":"฿16.03M","after":"฿21.60M","change":"+34.7%"}]}'
              />
            </Field>
            <Field label="คำรับรอง (ถ้ามี)">
              <textarea className="crm-area" name="testimonialQuote" rows={3} value={form.testimonial.quote} onChange={(e) => patch("testimonial", { ...form.testimonial, quote: e.target.value })} />
            </Field>
            <div className="crm-cms-field-grid">
              <Field label="ชื่อผู้ให้คำรับรอง">
                <input className="crm-field" name="testimonialAuthor" value={form.testimonial.authorName} onChange={(e) => patch("testimonial", { ...form.testimonial, authorName: e.target.value })} />
              </Field>
              <Field label="ตำแหน่ง">
                <input className="crm-field" name="testimonialRole" value={form.testimonial.authorRole} onChange={(e) => patch("testimonial", { ...form.testimonial, authorRole: e.target.value })} />
              </Field>
            </div>
            <label className="crm-cms-check">
              <input
                type="checkbox"
                checked={form.testimonial.approvalStatus === "approved"}
                onChange={(e) => patch("testimonial", { ...form.testimonial, approvalStatus: e.target.checked ? "approved" : "pending" })}
              />
              อนุมัติคำรับรองให้แสดงสาธารณะ
            </label>
            <Field label="Methodology note">
              <textarea className="crm-area" name="methodologyNote" rows={4} value={form.methodologyNote} onChange={(e) => patch("methodologyNote", e.target.value)} />
            </Field>
            {form.methodologyNote ? (
              <button type="button" className="crm-users-secondary" onClick={() => patch("methodologyNote", "")}>
                ลบ methodology note
              </button>
            ) : null}
            <div className="crm-cs-source-list">
              <div className="crm-cs-editor-head">
                <h3>แหล่งข้อมูล</h3>
                <button
                  type="button"
                  className="crm-users-secondary"
                  onClick={() => {
                    patch("sourceNotes", [...form.sourceNotes, ""]);
                  }}
                >
                  เพิ่มแหล่งข้อมูล
                </button>
              </div>
              {form.sourceNotes.length ? (
                form.sourceNotes.map((note, index) => (
                  <div key={`source-${index}`} className="crm-cs-source-row">
                    <input
                      className="crm-field"
                      value={note}
                      onChange={(event) => {
                        const next = [...form.sourceNotes];
                        next[index] = event.target.value;
                        patch("sourceNotes", next);
                      }}
                    />
                    <button
                      type="button"
                      className="crm-users-secondary"
                      onClick={() => patch("sourceNotes", form.sourceNotes.filter((_, i) => i !== index))}
                    >
                      ลบ
                    </button>
                  </div>
                ))
              ) : (
                <p className="crm-cms-editor-note">ยังไม่มีแหล่งข้อมูล — กดเพิ่มเมื่อมีที่มาที่ยืนยันได้</p>
              )}
            </div>
            <fieldset className="crm-cs-related">
              <legend>บทความและเคสที่เกี่ยวข้อง</legend>
              {relatedOptions.length ? (
                <ul className="crm-cs-related-list">
                  {relatedOptions.map((item) => {
                    const key = item.slug || item.id;
                    return (
                      <li key={`${item.kind}-${key}`}>
                        <label className="crm-cms-check">
                          <input type="checkbox" checked={relatedSet.has(key) || relatedSet.has(item.id)} onChange={() => toggleRelated(key)} />
                          <span>
                            {item.title}
                            <small>
                              {item.kind === "insight" ? "บทความ" : "เคสสตัดดี"} · {item.slug}
                            </small>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="crm-cms-editor-note">ยังไม่มีบทความในระบบ — สามารถเพิ่มได้ภายหลัง</p>
              )}
            </fieldset>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "seo"}>
            <header className="crm-cms-editor-panel-head">
              <div>
                <p className="crm-cms-editor-kicker">SEO</p>
                <h2>ชื่อเรื่องและคำอธิบายสำหรับเครื่องมือค้นหา</h2>
              </div>
            </header>
            <Field label="SEO title">
              <input className="crm-field" name="seoTitle" value={form.seoTitle} onChange={(e) => patch("seoTitle", e.target.value)} />
            </Field>
            <Field label="SEO description">
              <textarea className="crm-area" name="metaDescription" rows={4} value={form.metaDescription} onChange={(e) => patch("metaDescription", e.target.value)} />
            </Field>
          </section>

          <section className="crm-cms-editor-panel" hidden={tab !== "publish"}>
            <header className="crm-cms-editor-panel-head">
              <div>
                <p className="crm-cms-editor-kicker">Publish</p>
                <h2>สถานะข้อมูล วันที่ และบันทึกภายใน</h2>
              </div>
            </header>
            <Field label="สถานะข้อมูล">
              <select className="crm-field" name="dataStatus" value={form.dataStatus} onChange={(e) => patch("dataStatus", e.target.value as CaseStudySaveInput["dataStatus"])}>
                {CASE_STUDY_DATA_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {DATA_STATUS_LABELS[item]}
                  </option>
                ))}
              </select>
            </Field>
            <label className="crm-cms-check">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => patch("isFeatured", e.target.checked)} />
              แสดงเป็นเคสเด่น
            </label>
            <div className="crm-cms-field-grid">
              <Field label="วันที่เผยแพร่">
                <input className="crm-field" type="datetime-local" name="publishedAt" value={form.publishedAt} onChange={(e) => patch("publishedAt", e.target.value)} />
              </Field>
              <Field label="วันที่อัปเดต">
                <input className="crm-field" value={formatStamp(updatedAt)} readOnly />
              </Field>
            </div>
            <Field label="บันทึกสำหรับทีม — ไม่แสดงบนเว็บ">
              <textarea className="crm-area" name="adminNotes" rows={4} value={form.adminNotes} onChange={(e) => patch("adminNotes", e.target.value)} />
            </Field>
            <p className="crm-cms-editor-note">
              สถานะงานตอนนี้: {form.workflowStatus === "approved" ? "Approved" : form.workflowStatus === "review" ? "Review" : "Draft"}
              {form.isPublished ? " · Published" : " · ยังไม่เผยแพร่"}
            </p>
          </section>

          <section className="crm-cms-editor-panel crm-cs-preview-panel" hidden={tab !== "preview"}>
            <header className="crm-cms-editor-panel-head">
              <div>
                <p className="crm-cms-editor-kicker">Preview</p>
                <h2>ตัวอย่างในหน้าแก้ไข</h2>
              </div>
            </header>
            <p className={`crm-users-alert ${preview.publicReady ? "is-ok" : "is-warn"}`} role="status">
              {preview.publicReady
                ? "เคสนี้อยู่ในสถานะ Published และจะแสดงบน /case-studies"
                : "Draft / Review หรือยังไม่เผยแพร่ — ไม่แสดงบนเว็บสาธารณะ"}
            </p>
            {preview.sample ? <p className="crm-cs-sample-flag">Sample data</p> : null}
            {preview.hideClient ? <p className="crm-cms-editor-note">เคสแบบนิรนาม: ชื่อลูกค้าจริงถูกซ่อนจากหน้าสาธารณะ</p> : null}
            <p className="crm-cs-preview-kicker">{preview.identity}</p>
            <h3>{preview.title}</h3>
            <p className="crm-cms-editor-note">/{preview.slug || "slug"}</p>
            {preview.coverImage ? <ImagePreview src={coverPreview} alt={preview.coverImageAlt} recommended="รูปปก" /> : <p className="crm-cms-editor-note">ยังไม่มีรูปปก</p>}
            <dl className="crm-cs-preview-dl">
              <div>
                <dt>Challenge</dt>
                <dd>{preview.challenge || "—"}</dd>
              </div>
              <div>
                <dt>Action</dt>
                <dd>{preview.action || "—"}</dd>
              </div>
              <div>
                <dt>Result</dt>
                <dd>{preview.result || "—"}</dd>
              </div>
              <div>
                <dt>ช่วงวัดผล</dt>
                <dd>{preview.measurementPeriod || "—"}</dd>
              </div>
              <div>
                <dt>โลโก้ลูกค้า</dt>
                <dd>
                  {preview.logoPublic ? "แสดงสาธารณะ (Approved)" : preview.logoPending ? "มีไฟล์ แต่ Pending — ไม่แสดงสาธารณะ" : "ไม่มีโลโก้"}
                </dd>
              </div>
            </dl>
            {preview.metrics.length ? (
              <ul className="crm-cs-preview-metrics">
                {preview.metrics.map((metric) => (
                  <li key={metric.id}>
                    <strong>
                      {metric.value} {metric.unit || metric.currency || ""}
                    </strong>
                    <span>{metric.label}</span>
                    <small>
                      {metric.status}
                      {metric.status === "Sample data" ? " · Sample data" : ""}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="crm-cms-editor-note">ยังไม่มีตัวชี้วัด</p>
            )}
            {preview.methodologyNote ? (
              <p>
                <strong>Methodology: </strong>
                {preview.methodologyNote}
              </p>
            ) : null}
            {preview.sourceNotes.length ? (
              <ul>
                {preview.sourceNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : null}
            {form.id ? (
              <p className="crm-cms-editor-note">ตัวอย่างเต็มจากฉบับที่บันทึกอยู่ที่หน้าตัวอย่างในระบบ — ไม่เปิดหน้าต่างใหม่</p>
            ) : (
              <p className="crm-cms-editor-note">บันทึกแล้วดูตัวอย่าง เพื่อเก็บฉบับก่อนแสดงพรีวิวเต็ม</p>
            )}
          </section>
        </div>

        <aside className="crm-cms-editor-side">
          <section className="crm-cms-editor-panel">
            <p className="crm-cms-editor-kicker">Workflow</p>
            <h2>บันทึกและเผยแพร่</h2>
            <p className="crm-cms-editor-note">
              สถานะงาน: {form.workflowStatus === "approved" ? "อนุมัติแล้ว" : form.workflowStatus === "review" ? "รอตรวจ" : "ฉบับร่าง"}
              {form.isPublished ? " · เผยแพร่แล้ว" : " · ยังไม่เผยแพร่"}
            </p>
            <p className="crm-cms-editor-note">อัปเดตล่าสุด: {formatStamp(updatedAt)}</p>
            {saveState ? (
              <p className={`crm-cs-save-state${status ? " is-error" : dirty ? " is-dirty" : ok ? " is-ok" : ""}`} role="status">
                {saveState}
              </p>
            ) : null}
            <button className="kpi-button crm-cms-editor-save" type="submit" name="intent" value="save" disabled={pending}>
              บันทึก
            </button>
            <button className="crm-users-secondary crm-cms-editor-save" type="submit" name="intent" value="draft" disabled={pending}>
              บันทึกฉบับร่าง
            </button>
            <button className="crm-users-secondary crm-cms-editor-save" type="submit" name="intent" value="preview" disabled={pending}>
              บันทึกแล้วดูตัวอย่าง
            </button>
            <button className="crm-users-secondary crm-cms-editor-save" type="submit" name="intent" value="review" disabled={pending}>
              ส่งตรวจ
            </button>
            <button className="crm-users-secondary crm-cms-editor-save" type="submit" name="intent" value="approve" disabled={pending}>
              อนุมัติ
            </button>
            {form.isPublished ? (
              <button className="crm-users-secondary crm-cms-editor-save" type="submit" name="intent" value="unpublish" disabled={pending}>
                ยกเลิกเผยแพร่
              </button>
            ) : (
              <button className="kpi-button crm-cms-editor-save" type="submit" name="intent" value="publish" disabled={pending}>
                เผยแพร่
              </button>
            )}
          </section>

          {form.id ? (
            <section className="crm-cms-editor-panel">
              <p className="crm-cms-editor-kicker">Actions</p>
              <button
                type="button"
                className="crm-users-secondary crm-cms-editor-save"
                onClick={() => {
                  const data = new FormData();
                  data.set("id", form.id ?? "");
                  startTransition(() => {
                    void duplicateAction(data);
                  });
                }}
              >
                ทำสำเนาเป็นฉบับร่าง
              </button>
              <div className="crm-cms-editor-danger">
                <div>
                  <p>ลบเคสสตัดดี</p>
                  <span>ย้ายออกจากรายการและไม่แสดงบนเว็บ</span>
                </div>
                <button
                  type="button"
                  className="kpi-button crm-users-delete-btn"
                  onClick={() => setDialog("delete")}
                >
                  ลบ
                </button>
              </div>
            </section>
          ) : null}
        </aside>
      </div>

      <div className="crm-cs-sticky-save">
        <p className={`crm-cs-save-state${status ? " is-error" : dirty ? " is-dirty" : ok ? " is-ok" : ""}`} role="status">
          {saveState || "พร้อมบันทึก"}
        </p>
        <div className="crm-cs-sticky-actions">
          <button className="kpi-button" type="submit" name="intent" value="save" disabled={pending}>
            {pending ? "กำลังบันทึก…" : "บันทึก"}
          </button>
          <button className="crm-users-secondary" type="submit" name="intent" value="draft" disabled={pending}>
            บันทึกฉบับร่าง
          </button>
          <button className="crm-users-secondary" type="submit" name="intent" value="preview" disabled={pending}>
            บันทึกแล้วดูตัวอย่าง
          </button>
        </div>
      </div>

    </form>
      {dialog === "unpublish" ? (
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" onClick={() => setDialog(null)} />
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby="cs-confirm-title">
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">Case Studies</p>
                <h2 id="cs-confirm-title">ยกเลิกเผยแพร่</h2>
              </div>
              <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={() => setDialog(null)}>
                ×
              </button>
            </div>
            <p className="crm-users-alert is-warn" role="status">
              เคสนี้จะหายจากหน้าเว็บสาธารณะ จนกว่าจะเผยแพร่อีกครั้ง
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
                  void submitFromForm("unpublish");
                }}
              >
                ยกเลิกเผยแพร่
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {dialog === "delete" && form.id ? (
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" onClick={() => setDialog(null)} />
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby="cs-delete-title">
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">Case Studies</p>
                <h2 id="cs-delete-title">ลบเคสสตัดดี</h2>
              </div>
              <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={() => setDialog(null)}>
                ×
              </button>
            </div>
            <p className="crm-users-alert is-warn" role="status">
              ยืนยันลบ “{form.title || form.slug}”? เคสนี้จะไม่แสดงบนเว็บสาธารณะ
            </p>
            <div className="crm-modal-actions">
              <button type="button" className="crm-users-secondary" onClick={() => setDialog(null)}>
                ยกเลิก
              </button>
              <button
                type="button"
                className="kpi-button crm-users-delete-btn"
                disabled={pending}
                onClick={() => {
                  const data = new FormData();
                  data.set("id", form.id ?? "");
                  setDialog(null);
                  startTransition(() => {
                    void deleteAction(data);
                  });
                }}
              >
                ลบเคส
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
