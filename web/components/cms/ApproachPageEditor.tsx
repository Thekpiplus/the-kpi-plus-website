"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode, useTransition } from "react";
import { saveApproachPage } from "@/lib/cms/approach-page-actions";
import {
  createApproachExampleStep,
  createApproachReceiveItem,
  createApproachStep,
  type ApproachCmsIntent,
  type ApproachEditorState,
  type ApproachLocalized,
  type CmsApproachPage,
} from "@/lib/cms/approach-page";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "method", label: "แนวทาง" },
  { id: "example", label: "ตัวอย่าง" },
  { id: "closer", label: "Closer / CTA" },
  { id: "seo", label: "SEO / เผยแพร่" },
] as const;

const TAB_GROUPS: Array<{ label: string; ids: Array<(typeof TABS)[number]["id"]> }> = [
  { label: "เนื้อหาหลัก", ids: ["hero", "method", "example"] },
  { label: "ปิดท้าย", ids: ["closer"] },
  { label: "SEO / เผยแพร่", ids: ["seo"] },
];

type Tab = (typeof TABS)[number]["id"];
type Lang = keyof ApproachLocalized;

const LANGS: Array<{ id: Lang; label: string }> = [
  { id: "th", label: "ไทย" },
  { id: "en", label: "EN" },
  { id: "ru", label: "RU" },
  { id: "zh", label: "ZH" },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="crm-cms-field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function LocalizedFields({
  label,
  value,
  lang,
  multiline,
  rows = 3,
  hint,
  onChange,
}: {
  label: string;
  value: ApproachLocalized;
  lang: Lang;
  multiline?: boolean;
  rows?: number;
  hint?: string;
  onChange: (next: ApproachLocalized) => void;
}) {
  const text = value[lang] ?? "";
  return (
    <Field label={label} hint={hint || (!text.trim() ? `ยังไม่มีข้อความภาษา${lang.toUpperCase()}` : undefined)}>
      {multiline ? (
        <textarea
          className="crm-area crm-cms-page-editor-area"
          rows={rows}
          value={text}
          onChange={(event) => onChange({ ...value, [lang]: event.target.value })}
        />
      ) : (
        <input
          className="crm-field"
          value={text}
          onChange={(event) => onChange({ ...value, [lang]: event.target.value })}
        />
      )}
    </Field>
  );
}

export function ApproachPageEditor({
  initial,
  initialTab,
  pagePath = "/approach",
}: {
  initial: ApproachEditorState;
  initialTab?: string;
  pagePath?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>(TABS.some((item) => item.id === initialTab) ? (initialTab as Tab) : "hero");
  const [lang, setLang] = useState<Lang>("th");
  const [title, setTitle] = useState(initial.title);
  const [seoTitle, setSeoTitle] = useState(initial.seoTitle);
  const [metaDescription, setMetaDescription] = useState(initial.metaDescription);
  const [status, setStatus] = useState(initial.status);
  const [content, setContent] = useState<CmsApproachPage>(initial.content);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const activeTab = useMemo(() => TABS.find((item) => item.id === tab) ?? TABS[0], [tab]);
  const activeLang = LANGS.find((item) => item.id === lang)?.label ?? lang.toUpperCase();

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
    setMessage("");
    setError("");
  }

  function patch(next: CmsApproachPage) {
    setContent(next);
    markDirty();
  }

  function submit(intent: ApproachCmsIntent) {
    setMessage("");
    setError("");
    const formData = new FormData();
    formData.set("id", initial.documentId);
    formData.set("intent", intent);
    formData.set("title", title);
    formData.set("seoTitle", seoTitle);
    formData.set("metaDescription", metaDescription);
    formData.set("excerpt", metaDescription);
    formData.set("contentJson", JSON.stringify(content));
    startTransition(async () => {
      const result = await saveApproachPage(formData);
      if (!result.ok) {
        setError(
          result.error === "required_fields"
            ? "กรอก SEO title และ Meta description ก่อนเผยแพร่"
            : result.error === "invalid_json"
              ? "ข้อมูลไม่ถูกต้อง"
              : "บันทึกไม่สำเร็จ",
        );
        return;
      }
      setDirty(false);
      setStatus(intent === "publish" ? "published" : intent === "draft" || intent === "unpublish" ? "draft" : status);
      setMessage(intent === "publish" ? "เผยแพร่แล้ว" : intent === "unpublish" ? "ยกเลิกการเผยแพร่แล้ว" : "บันทึกแล้ว");
      router.refresh();
    });
  }

  const saveState = pending
    ? "กำลังบันทึก…"
    : error
      ? error
      : dirty
        ? "มีการแก้ไขที่ยังไม่ได้บันทึก"
        : message || "พร้อมบันทึก";

  return (
    <div className="crm-cms-page-editor">
      <div className="crm-cms-page-editor-savebar">
        <div className="crm-cms-page-editor-savebar-actions">
          <Link href={pagePath} className="crm-users-secondary" target="_blank" rel="noreferrer">
            ดูตัวอย่าง
          </Link>
          <Link href="/crm/cms/pages" className="crm-users-secondary">
            หน้าเว็บไซต์
          </Link>
          <button type="button" className="crm-users-secondary" disabled={pending} onClick={() => submit("draft")}>
            บันทึกฉบับร่าง
          </button>
          <button type="button" className="kpi-button crm-users-primary" disabled={pending} onClick={() => submit("publish")}>
            {pending ? "กำลังบันทึก…" : "บันทึกและเผยแพร่"}
          </button>
        </div>
        <p
          className={`crm-cms-page-editor-save-state${pending ? " is-pending" : error ? " is-error" : dirty ? " is-dirty" : message ? " is-ok" : ""}`}
          role="status"
        >
          {saveState}
        </p>
      </div>

      {message ? (
        <p className="crm-users-alert is-ok" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="crm-users-alert is-warn" role="alert">
          {error}
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
                        role="tab"
                        aria-selected={tab === item.id}
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
            <div className="crm-cms-page-editor-langs" role="tablist" aria-label="ภาษาที่แก้ไข">
              {LANGS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={lang === item.id}
                  className={`crm-cms-page-editor-lang${lang === item.id ? " is-active" : ""}`}
                  onClick={() => setLang(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <p className="crm-cms-page-editor-lang-note">ภาษาที่เลือก: {activeLang} — การเปลี่ยนภาษาไม่ลบข้อความภาษาอื่น</p>

          <div className="crm-cms-page-editor-panel" role="tabpanel">
            {tab === "hero" ? (
              <div className="crm-cms-page-editor-grid">
                <LocalizedFields
                  label="Eyebrow"
                  value={content.hero.eyebrow}
                  lang={lang}
                  onChange={(eyebrow) => patch({ ...content, hero: { ...content.hero, eyebrow } })}
                />
                <LocalizedFields
                  label="หัวข้อบรรทัด 1"
                  value={content.hero.titleLead}
                  lang={lang}
                  multiline
                  rows={2}
                  onChange={(titleLead) => patch({ ...content, hero: { ...content.hero, titleLead } })}
                />
                <LocalizedFields
                  label="หัวข้อบรรทัด 2"
                  value={content.hero.titleRest}
                  lang={lang}
                  multiline
                  rows={2}
                  hint="ภาษาอื่นปล่อยว่างได้ หากหัวข้ออยู่บรรทัดเดียว"
                  onChange={(titleRest) => patch({ ...content, hero: { ...content.hero, titleRest } })}
                />
                <LocalizedFields
                  label="ข้อความเน้น (accent)"
                  value={content.hero.titleAccent}
                  lang={lang}
                  onChange={(titleAccent) => patch({ ...content, hero: { ...content.hero, titleAccent } })}
                />
                <LocalizedFields
                  label="คำโปรย"
                  value={content.hero.lead}
                  lang={lang}
                  multiline
                  rows={4}
                  onChange={(lead) => patch({ ...content, hero: { ...content.hero, lead } })}
                />
                <LocalizedFields
                  label="Subline"
                  value={content.hero.subline}
                  lang={lang}
                  multiline
                  rows={2}
                  onChange={(subline) => patch({ ...content, hero: { ...content.hero, subline } })}
                />
                <LocalizedFields
                  label="Alt รูป Hero"
                  value={content.hero.photoAlt}
                  lang={lang}
                  multiline
                  rows={2}
                  onChange={(photoAlt) => patch({ ...content, hero: { ...content.hero, photoAlt } })}
                />
              </div>
            ) : null}

            {tab === "method" ? (
              <div className="crm-cms-page-editor-grid">
                <LocalizedFields
                  label="หัวข้อแนวทาง"
                  value={content.method.title}
                  lang={lang}
                  onChange={(methodTitle) => patch({ ...content, method: { ...content.method, title: methodTitle } })}
                />
                {content.method.steps.map((step, index) => (
                  <div key={step.id} className="crm-cms-contact-step-card">
                    <div className="crm-cms-faq-item-head">
                      <strong>
                        ขั้นที่ {index + 1}
                        {step.num ? ` · ${step.num}` : ""}
                      </strong>
                      <div className="crm-cms-actions">
                        <button
                          type="button"
                          className="crm-users-secondary"
                          disabled={index === 0}
                          onClick={() => {
                            if (index === 0) return;
                            const steps = [...content.method.steps];
                            const [item] = steps.splice(index, 1);
                            steps.splice(index - 1, 0, item);
                            patch({ ...content, method: { ...content.method, steps } });
                          }}
                        >
                          ขึ้น
                        </button>
                        <button
                          type="button"
                          className="crm-users-secondary"
                          disabled={index >= content.method.steps.length - 1}
                          onClick={() => {
                            if (index >= content.method.steps.length - 1) return;
                            const steps = [...content.method.steps];
                            const [item] = steps.splice(index, 1);
                            steps.splice(index + 1, 0, item);
                            patch({ ...content, method: { ...content.method, steps } });
                          }}
                        >
                          ลง
                        </button>
                        <button
                          type="button"
                          className="crm-users-secondary"
                          disabled={content.method.steps.length <= 1}
                          onClick={() =>
                            patch({
                              ...content,
                              method: {
                                ...content.method,
                                steps: content.method.steps.filter((item) => item.id !== step.id),
                              },
                            })
                          }
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                    <div className="crm-cms-page-editor-grid is-two">
                      <Field label="หมายเลข">
                        <input
                          className="crm-field"
                          value={step.num}
                          onChange={(event) => {
                            const steps = content.method.steps.map((item) =>
                              item.id === step.id ? { ...item, num: event.target.value } : item,
                            );
                            patch({ ...content, method: { ...content.method, steps } });
                          }}
                        />
                      </Field>
                      <LocalizedFields
                        label="หัวข้อ"
                        value={step.title}
                        lang={lang}
                        onChange={(stepTitle) => {
                          const steps = content.method.steps.map((item) =>
                            item.id === step.id ? { ...item, title: stepTitle } : item,
                          );
                          patch({ ...content, method: { ...content.method, steps } });
                        }}
                      />
                    </div>
                    <LocalizedFields
                      label="รายละเอียด"
                      value={step.body}
                      lang={lang}
                      multiline
                      rows={3}
                      onChange={(body) => {
                        const steps = content.method.steps.map((item) =>
                          item.id === step.id ? { ...item, body } : item,
                        );
                        patch({ ...content, method: { ...content.method, steps } });
                      }}
                    />
                    <LocalizedFields
                      label="Output"
                      value={step.output}
                      lang={lang}
                      onChange={(output) => {
                        const steps = content.method.steps.map((item) =>
                          item.id === step.id ? { ...item, output } : item,
                        );
                        patch({ ...content, method: { ...content.method, steps } });
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="crm-users-secondary"
                  onClick={() =>
                    patch({
                      ...content,
                      method: {
                        ...content.method,
                        steps: [
                          ...content.method.steps,
                          createApproachStep({
                            num: String(content.method.steps.length + 1).padStart(2, "0"),
                          }),
                        ],
                      },
                    })
                  }
                >
                  เพิ่มขั้น
                </button>
              </div>
            ) : null}

            {tab === "example" ? (
              <div className="crm-cms-page-editor-grid">
                <LocalizedFields
                  label="Eyebrow"
                  value={content.example.eyebrow}
                  lang={lang}
                  onChange={(eyebrow) => patch({ ...content, example: { ...content.example, eyebrow } })}
                />
                <LocalizedFields
                  label="หัวข้อ"
                  value={content.example.title}
                  lang={lang}
                  multiline
                  rows={2}
                  onChange={(exampleTitle) => patch({ ...content, example: { ...content.example, title: exampleTitle } })}
                />
                <LocalizedFields
                  label="คำโปรย"
                  value={content.example.lead}
                  lang={lang}
                  multiline
                  rows={3}
                  onChange={(lead) => patch({ ...content, example: { ...content.example, lead } })}
                />
                <LocalizedFields
                  label="Caption กราฟ"
                  value={content.example.caption}
                  lang={lang}
                  multiline
                  rows={2}
                  onChange={(caption) => patch({ ...content, example: { ...content.example, caption } })}
                />
                <LocalizedFields
                  label="หมายเหตุ Framework"
                  value={content.example.frameworkNote}
                  lang={lang}
                  onChange={(frameworkNote) =>
                    patch({ ...content, example: { ...content.example, frameworkNote } })
                  }
                />
                {content.example.steps.map((step, index) => (
                  <div key={step.id} className="crm-cms-contact-step-card">
                    <div className="crm-cms-faq-item-head">
                      <strong>
                        Checklist {index + 1}
                        {step.num ? ` · ${step.num}` : ""}
                      </strong>
                      <div className="crm-cms-actions">
                        <button
                          type="button"
                          className="crm-users-secondary"
                          disabled={index === 0}
                          onClick={() => {
                            if (index === 0) return;
                            const steps = [...content.example.steps];
                            const [item] = steps.splice(index, 1);
                            steps.splice(index - 1, 0, item);
                            patch({ ...content, example: { ...content.example, steps } });
                          }}
                        >
                          ขึ้น
                        </button>
                        <button
                          type="button"
                          className="crm-users-secondary"
                          disabled={index >= content.example.steps.length - 1}
                          onClick={() => {
                            if (index >= content.example.steps.length - 1) return;
                            const steps = [...content.example.steps];
                            const [item] = steps.splice(index, 1);
                            steps.splice(index + 1, 0, item);
                            patch({ ...content, example: { ...content.example, steps } });
                          }}
                        >
                          ลง
                        </button>
                        <button
                          type="button"
                          className="crm-users-secondary"
                          disabled={content.example.steps.length <= 1}
                          onClick={() =>
                            patch({
                              ...content,
                              example: {
                                ...content.example,
                                steps: content.example.steps.filter((item) => item.id !== step.id),
                              },
                            })
                          }
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                    <div className="crm-cms-page-editor-grid is-two">
                      <Field label="หมายเลข">
                        <input
                          className="crm-field"
                          value={step.num}
                          onChange={(event) => {
                            const steps = content.example.steps.map((item) =>
                              item.id === step.id ? { ...item, num: event.target.value } : item,
                            );
                            patch({ ...content, example: { ...content.example, steps } });
                          }}
                        />
                      </Field>
                      <LocalizedFields
                        label="Label"
                        value={step.label}
                        lang={lang}
                        onChange={(label) => {
                          const steps = content.example.steps.map((item) =>
                            item.id === step.id ? { ...item, label } : item,
                          );
                          patch({ ...content, example: { ...content.example, steps } });
                        }}
                      />
                    </div>
                    <LocalizedFields
                      label="ข้อความ"
                      value={step.text}
                      lang={lang}
                      multiline
                      rows={2}
                      onChange={(text) => {
                        const steps = content.example.steps.map((item) =>
                          item.id === step.id ? { ...item, text } : item,
                        );
                        patch({ ...content, example: { ...content.example, steps } });
                      }}
                    />
                    <LocalizedFields
                      label="Output"
                      value={step.output}
                      lang={lang}
                      onChange={(output) => {
                        const steps = content.example.steps.map((item) =>
                          item.id === step.id ? { ...item, output } : item,
                        );
                        patch({ ...content, example: { ...content.example, steps } });
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="crm-users-secondary"
                  onClick={() =>
                    patch({
                      ...content,
                      example: {
                        ...content.example,
                        steps: [
                          ...content.example.steps,
                          createApproachExampleStep({
                            num: String(content.example.steps.length + 1).padStart(2, "0"),
                          }),
                        ],
                      },
                    })
                  }
                >
                  เพิ่ม checklist
                </button>
              </div>
            ) : null}

            {tab === "closer" ? (
              <div className="crm-cms-page-editor-grid">
                <LocalizedFields
                  label="คำถามปิดท้าย"
                  value={content.closer.close}
                  lang={lang}
                  multiline
                  rows={2}
                  onChange={(close) => patch({ ...content, closer: { ...content.closer, close } })}
                />
                <LocalizedFields
                  label="หัวข้อสิ่งที่ได้รับ"
                  value={content.closer.receiveTitle}
                  lang={lang}
                  onChange={(receiveTitle) => patch({ ...content, closer: { ...content.closer, receiveTitle } })}
                />
                {content.closer.receive.map((item, index) => (
                  <div key={item.id} className="crm-cms-contact-step-card">
                    <div className="crm-cms-faq-item-head">
                      <strong>รายการ {index + 1}</strong>
                      <button
                        type="button"
                        className="crm-users-secondary"
                        disabled={content.closer.receive.length <= 1}
                        onClick={() =>
                          patch({
                            ...content,
                            closer: {
                              ...content.closer,
                              receive: content.closer.receive.filter((row) => row.id !== item.id),
                            },
                          })
                        }
                      >
                        ลบ
                      </button>
                    </div>
                    <LocalizedFields
                      label="ข้อความ"
                      value={item.text}
                      lang={lang}
                      onChange={(text) => {
                        const receive = content.closer.receive.map((row) =>
                          row.id === item.id ? { ...row, text } : row,
                        );
                        patch({ ...content, closer: { ...content.closer, receive } });
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="crm-users-secondary"
                  onClick={() =>
                    patch({
                      ...content,
                      closer: {
                        ...content.closer,
                        receive: [...content.closer.receive, createApproachReceiveItem()],
                      },
                    })
                  }
                >
                  เพิ่มรายการ
                </button>
                <LocalizedFields
                  label="ปุ่ม CTA"
                  value={content.closer.cta}
                  lang={lang}
                  multiline
                  rows={2}
                  onChange={(cta) => patch({ ...content, closer: { ...content.closer, cta } })}
                />
              </div>
            ) : null}

            {tab === "seo" ? (
              <div className="crm-cms-page-editor-grid">
                <Field label="ชื่อเอกสารใน CMS">
                  <input
                    className="crm-field"
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      markDirty();
                    }}
                  />
                </Field>
                <Field label="SEO title">
                  <input
                    className="crm-field"
                    value={seoTitle}
                    onChange={(event) => {
                      setSeoTitle(event.target.value);
                      markDirty();
                    }}
                  />
                </Field>
                <Field label="Meta description">
                  <textarea
                    className="crm-area crm-cms-page-editor-area"
                    rows={3}
                    value={metaDescription}
                    onChange={(event) => {
                      setMetaDescription(event.target.value);
                      markDirty();
                    }}
                  />
                </Field>
                <p className="crm-cms-editor-note">สถานะปัจจุบัน: {status === "published" ? "เผยแพร่บนเว็บ" : "ฉบับร่าง"}</p>
                {status === "published" ? (
                  <button type="button" className="crm-users-secondary" disabled={pending} onClick={() => submit("unpublish")}>
                    ยกเลิกการเผยแพร่
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
