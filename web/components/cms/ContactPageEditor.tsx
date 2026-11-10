"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import { saveContactPage } from "@/lib/cms/contact-page-actions";
import {
  emptyLocalized,
  newContactFaqId,
  newContactStepId,
  type CmsContactPage,
  type ContactCmsIntent,
  type ContactEditorState,
  type ContactLocalized,
} from "@/lib/cms/contact-page";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "channels", label: "ช่องทางติดต่อ" },
  { id: "location", label: "ที่ตั้ง / แผนที่" },
  { id: "form", label: "ฟอร์มติดต่อ" },
  { id: "next", label: "ขั้นตอนถัดไป" },
  { id: "faq", label: "FAQ" },
  { id: "seo", label: "SEO / เผยแพร่" },
] as const;

const TAB_GROUPS: Array<{ label: string; ids: Array<(typeof TABS)[number]["id"]> }> = [
  { label: "เนื้อหาหลัก", ids: ["hero", "channels", "location", "form"] },
  { label: "ปิดท้าย", ids: ["next", "faq"] },
  { label: "SEO / เผยแพร่", ids: ["seo"] },
];

type Tab = (typeof TABS)[number]["id"];
type Lang = keyof ContactLocalized;

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
  value: ContactLocalized;
  lang: Lang;
  multiline?: boolean;
  rows?: number;
  hint?: string;
  onChange: (next: ContactLocalized) => void;
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

export function ContactPageEditor({
  initial,
  initialTab,
  pagePath = "/contact-us",
}: {
  initial: ContactEditorState;
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
  const [content, setContent] = useState<CmsContactPage>(initial.content);
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

  function patch(next: CmsContactPage) {
    setContent(next);
    markDirty();
  }

  function changeLang(next: Lang) {
    if (next === lang) return;
    if (
      dirty &&
      !window.confirm(
        "มีการแก้ไขที่ยังไม่ได้บันทึก การเปลี่ยนภาษาไม่ลบข้อความในฟอร์ม แต่ยังไม่ได้บันทึกลงเซิร์ฟเวอร์ ต้องการเปลี่ยนภาษาต่อหรือไม่?",
      )
    ) {
      return;
    }
    setLang(next);
  }

  function submit(intent: ContactCmsIntent) {
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
      const result = await saveContactPage(formData);
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
          <Link href="/crm/cms/contacts" className="crm-users-secondary" title="อีเมล เบอร์โทร ที่อยู่ และแผนที่จริง">
            ข้อมูลติดต่อ
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
                  onClick={() => changeLang(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <p className="crm-cms-page-editor-lang-note">
            ภาษาที่เลือก: {activeLang} — การเปลี่ยนภาษาไม่ลบข้อความภาษาอื่น
            {dirty ? " · มีการแก้ไขที่ยังไม่ได้บันทึก" : ""}
          </p>

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
                  onChange={(titleRest) => patch({ ...content, hero: { ...content.hero, titleRest } })}
                />
                <LocalizedFields
                  label="คำโปรย"
                  value={content.hero.lead}
                  lang={lang}
                  multiline
                  rows={4}
                  onChange={(lead) => patch({ ...content, hero: { ...content.hero, lead } })}
                />
              </div>
            ) : null}

            {tab === "channels" ? (
              <div className="crm-cms-page-editor-grid">
                <LocalizedFields
                  label="หัวข้อช่องทาง"
                  value={content.channels.heading}
                  lang={lang}
                  onChange={(heading) => patch({ ...content, channels: { ...content.channels, heading } })}
                />
                <LocalizedFields
                  label="ข้อความช่วย"
                  value={content.channels.help}
                  lang={lang}
                  multiline
                  rows={2}
                  onChange={(help) => patch({ ...content, channels: { ...content.channels, help } })}
                />
                <div className="crm-cms-page-editor-grid is-two">
                  <LocalizedFields
                    label="ป้ายอีเมล"
                    value={content.channels.emailLabel}
                    lang={lang}
                    onChange={(emailLabel) => patch({ ...content, channels: { ...content.channels, emailLabel } })}
                  />
                  <LocalizedFields
                    label="ป้ายโทร"
                    value={content.channels.phoneLabel}
                    lang={lang}
                    onChange={(phoneLabel) => patch({ ...content, channels: { ...content.channels, phoneLabel } })}
                  />
                </div>
                <LocalizedFields
                  label="ป้าย WhatsApp"
                  value={content.channels.whatsappLabel}
                  lang={lang}
                  onChange={(whatsappLabel) =>
                    patch({ ...content, channels: { ...content.channels, whatsappLabel } })
                  }
                />
                <p className="crm-cms-editor-note">
                  อีเมล เบอร์โทร และ WhatsApp จริงแก้ที่{" "}
                  <Link href="/crm/cms/contacts" className="crm-cms-inline-link">
                    ข้อมูลติดต่อ
                  </Link>
                </p>
              </div>
            ) : null}

            {tab === "location" ? (
              <div className="crm-cms-page-editor-grid">
                <LocalizedFields
                  label="Eyebrow ที่ตั้ง"
                  value={content.location.eyebrow}
                  lang={lang}
                  onChange={(eyebrow) => patch({ ...content, location: { ...content.location, eyebrow } })}
                />
                <LocalizedFields
                  label="ชื่อสำนักงาน"
                  value={content.location.office}
                  lang={lang}
                  onChange={(office) => patch({ ...content, location: { ...content.location, office } })}
                />
                <LocalizedFields
                  label="ชื่อแผนที่"
                  value={content.location.mapTitle}
                  lang={lang}
                  onChange={(mapTitle) => patch({ ...content, location: { ...content.location, mapTitle } })}
                />
                <LocalizedFields
                  label="ปุ่มเปิด Maps"
                  value={content.location.openMap}
                  lang={lang}
                  onChange={(openMap) => patch({ ...content, location: { ...content.location, openMap } })}
                />
                <LocalizedFields
                  label="Alt รูปสำนักงาน"
                  value={content.location.officePhotoAlt}
                  lang={lang}
                  multiline
                  rows={2}
                  onChange={(officePhotoAlt) =>
                    patch({ ...content, location: { ...content.location, officePhotoAlt } })
                  }
                />
                <p className="crm-cms-editor-note">
                  ที่อยู่ แผนที่ฝัง และรูปสำนักงานแก้ที่{" "}
                  <Link href="/crm/cms/contacts" className="crm-cms-inline-link">
                    ข้อมูลติดต่อ
                  </Link>
                </p>
              </div>
            ) : null}

            {tab === "form" ? (
              <div className="crm-cms-page-editor-grid">
                <LocalizedFields
                  label="หัวข้อฟอร์ม"
                  value={content.form.title}
                  lang={lang}
                  onChange={(titleValue) => patch({ ...content, form: { ...content.form, title: titleValue } })}
                />
                <LocalizedFields
                  label="คำอธิบายฟอร์ม"
                  value={content.form.body}
                  lang={lang}
                  multiline
                  rows={4}
                  onChange={(body) => patch({ ...content, form: { ...content.form, body } })}
                />
              </div>
            ) : null}

            {tab === "next" ? (
              <div className="crm-cms-page-editor-grid">
                <LocalizedFields
                  label="หัวข้อขั้นตอน"
                  value={content.nextSteps.title}
                  lang={lang}
                  onChange={(titleValue) =>
                    patch({ ...content, nextSteps: { ...content.nextSteps, title: titleValue } })
                  }
                />
                {content.nextSteps.steps.map((step, index) => (
                  <div key={step.id} className="crm-cms-contact-step-card">
                    <div className="crm-cms-faq-item-head">
                      <strong>ขั้นที่ {index + 1}</strong>
                      <button
                        type="button"
                        className="crm-users-secondary"
                        disabled={content.nextSteps.steps.length <= 1}
                        onClick={() =>
                          patch({
                            ...content,
                            nextSteps: {
                              ...content.nextSteps,
                              steps: content.nextSteps.steps.filter((row) => row.id !== step.id),
                            },
                          })
                        }
                      >
                        ลบ
                      </button>
                    </div>
                    <LocalizedFields
                      label="หัวข้อ"
                      value={step.title}
                      lang={lang}
                      onChange={(titleValue) =>
                        patch({
                          ...content,
                          nextSteps: {
                            ...content.nextSteps,
                            steps: content.nextSteps.steps.map((row) =>
                              row.id === step.id ? { ...row, title: titleValue } : row,
                            ),
                          },
                        })
                      }
                    />
                    <LocalizedFields
                      label="รายละเอียด"
                      value={step.body}
                      lang={lang}
                      multiline
                      rows={3}
                      onChange={(body) =>
                        patch({
                          ...content,
                          nextSteps: {
                            ...content.nextSteps,
                            steps: content.nextSteps.steps.map((row) =>
                              row.id === step.id ? { ...row, body } : row,
                            ),
                          },
                        })
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="crm-users-secondary"
                  onClick={() =>
                    patch({
                      ...content,
                      nextSteps: {
                        ...content.nextSteps,
                        steps: [
                          ...content.nextSteps.steps,
                          { id: newContactStepId(), title: emptyLocalized(""), body: emptyLocalized("") },
                        ],
                      },
                    })
                  }
                >
                  เพิ่มขั้นตอน
                </button>
                <LocalizedFields
                  label="ข้อความความน่าเชื่อถือ 1"
                  value={content.nextSteps.realTeam}
                  lang={lang}
                  onChange={(realTeam) => patch({ ...content, nextSteps: { ...content.nextSteps, realTeam } })}
                />
                <LocalizedFields
                  label="ข้อความความน่าเชื่อถือ 2"
                  value={content.nextSteps.confidential}
                  lang={lang}
                  onChange={(confidential) =>
                    patch({ ...content, nextSteps: { ...content.nextSteps, confidential } })
                  }
                />
              </div>
            ) : null}

            {tab === "faq" ? (
              <div className="crm-cms-page-editor-grid">
                <p className="crm-cms-editor-note">FAQ บันทึกตามภาษาที่เลือกด้านบน และแสดงบนหน้าสาธารณะหลังเผยแพร่</p>
                {content.faqs.map((faq, index) => (
                  <div key={faq.id} className="crm-cms-contact-step-card">
                    <div className="crm-cms-faq-item-head">
                      <strong>FAQ {index + 1}</strong>
                      <button
                        type="button"
                        className="crm-users-secondary"
                        disabled={content.faqs.length <= 1}
                        onClick={() =>
                          patch({
                            ...content,
                            faqs: content.faqs.filter((row) => row.id !== faq.id),
                          })
                        }
                      >
                        ลบ
                      </button>
                    </div>
                    <LocalizedFields
                      label="คำถาม"
                      value={faq.q}
                      lang={lang}
                      onChange={(q) =>
                        patch({
                          ...content,
                          faqs: content.faqs.map((row) => (row.id === faq.id ? { ...row, q } : row)),
                        })
                      }
                    />
                    <LocalizedFields
                      label="คำตอบ"
                      value={faq.a}
                      lang={lang}
                      multiline
                      rows={4}
                      onChange={(a) =>
                        patch({
                          ...content,
                          faqs: content.faqs.map((row) => (row.id === faq.id ? { ...row, a } : row)),
                        })
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="crm-users-secondary"
                  onClick={() =>
                    patch({
                      ...content,
                      faqs: [...content.faqs, { id: newContactFaqId(), q: emptyLocalized(""), a: emptyLocalized("") }],
                    })
                  }
                >
                  เพิ่ม FAQ
                </button>
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
                <Field label="SEO title" hint={!seoTitle.trim() ? "จำเป็นก่อนเผยแพร่" : undefined}>
                  <input
                    className="crm-field"
                    value={seoTitle}
                    onChange={(event) => {
                      setSeoTitle(event.target.value);
                      markDirty();
                    }}
                  />
                </Field>
                <Field label="Meta description" hint={!metaDescription.trim() ? "จำเป็นก่อนเผยแพร่" : undefined}>
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
                <p className="crm-cms-editor-note">
                  สถานะปัจจุบัน: {status === "published" ? "เผยแพร่บนเว็บ" : "ฉบับร่าง"}
                </p>
                {status === "published" ? (
                  <button
                    type="button"
                    className="crm-users-secondary"
                    disabled={pending}
                    onClick={() => submit("unpublish")}
                  >
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
