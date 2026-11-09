"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode, useTransition } from "react";
import { saveCaseStudiesPage } from "@/lib/cms/case-studies-page-actions";
import {
  type CaseStudiesCmsIntent,
  type CaseStudiesEditorState,
  type CaseStudiesLocalized,
  type CmsCaseStudiesPage,
} from "@/lib/cms/case-studies-page";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "partners", label: "พาร์ตเนอร์" },
  { id: "overview", label: "Overview / ผลงาน" },
  { id: "closer", label: "Closer / CTA" },
  { id: "media", label: "รูปภาพ" },
  { id: "seo", label: "SEO / เผยแพร่" },
] as const;

const TAB_GROUPS: Array<{ label: string; ids: Array<(typeof TABS)[number]["id"]> }> = [
  { label: "เนื้อหาหลัก", ids: ["hero", "partners", "overview"] },
  { label: "ปิดท้ายและสื่อ", ids: ["closer", "media"] },
  { label: "SEO / เผยแพร่", ids: ["seo"] },
];

type Tab = (typeof TABS)[number]["id"];
type Lang = keyof CaseStudiesLocalized;

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
  value: CaseStudiesLocalized;
  lang: Lang;
  multiline?: boolean;
  rows?: number;
  hint?: string;
  onChange: (next: CaseStudiesLocalized) => void;
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

export function CaseStudiesPageEditor({
  initial,
  initialTab,
  pagePath = "/case-studies",
}: {
  initial: CaseStudiesEditorState;
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
  const [content, setContent] = useState<CmsCaseStudiesPage>(initial.content);
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

  function patch(next: CmsCaseStudiesPage) {
    setContent(next);
    markDirty();
  }

  function submit(intent: CaseStudiesCmsIntent) {
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
      const result = await saveCaseStudiesPage(formData);
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
          <Link href="/crm/cms/case-studies" className="crm-users-secondary">
            รายการเคส
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
                  label="ชื่อหน้า"
                  value={content.hero.pageTitle}
                  lang={lang}
                  onChange={(pageTitle) => patch({ ...content, hero: { ...content.hero, pageTitle } })}
                />
                <LocalizedFields
                  label="Eyebrow"
                  value={content.hero.eyebrow}
                  lang={lang}
                  onChange={(eyebrow) => patch({ ...content, hero: { ...content.hero, eyebrow } })}
                />
                <LocalizedFields
                  label="หัวข้อบรรทัด 1"
                  value={content.hero.headlineLead}
                  lang={lang}
                  multiline
                  rows={2}
                  onChange={(headlineLead) => patch({ ...content, hero: { ...content.hero, headlineLead } })}
                />
                <LocalizedFields
                  label="หัวข้อบรรทัด 2"
                  value={content.hero.headlineRest}
                  lang={lang}
                  multiline
                  rows={2}
                  onChange={(headlineRest) => patch({ ...content, hero: { ...content.hero, headlineRest } })}
                />
                <LocalizedFields
                  label="ข้อความเน้น (accent)"
                  value={content.hero.headlineAccent}
                  lang={lang}
                  onChange={(headlineAccent) => patch({ ...content, hero: { ...content.hero, headlineAccent } })}
                />
                <LocalizedFields
                  label="คำโปรย"
                  value={content.hero.description}
                  lang={lang}
                  multiline
                  rows={4}
                  onChange={(description) => patch({ ...content, hero: { ...content.hero, description } })}
                />
                <div className="crm-cms-page-editor-grid is-two">
                  <LocalizedFields
                    label="ปุ่มดูผลงาน"
                    value={content.hero.viewGrid}
                    lang={lang}
                    onChange={(viewGrid) => patch({ ...content, hero: { ...content.hero, viewGrid } })}
                  />
                  <LocalizedFields
                    label="ปุ่มดูรายละเอียดเคส"
                    value={content.hero.viewStudy}
                    lang={lang}
                    onChange={(viewStudy) => patch({ ...content, hero: { ...content.hero, viewStudy } })}
                  />
                </div>
                <LocalizedFields
                  label="ปุ่ม CTA หลัก (Hero)"
                  value={content.hero.primaryCta}
                  lang={lang}
                  onChange={(primaryCta) => patch({ ...content, hero: { ...content.hero, primaryCta } })}
                />
              </div>
            ) : null}

            {tab === "partners" ? (
              <div className="crm-cms-page-editor-grid">
                <LocalizedFields
                  label="Eyebrow โลโก้ลูกค้า"
                  value={content.partners.clientsEyebrow}
                  lang={lang}
                  onChange={(clientsEyebrow) =>
                    patch({ ...content, partners: { ...content.partners, clientsEyebrow } })
                  }
                />
                <LocalizedFields
                  label="หัวข้อโลโก้ลูกค้า"
                  value={content.partners.clientsLabel}
                  lang={lang}
                  multiline
                  rows={2}
                  hint="ขึ้นบรรทัดใหม่ได้หากต้องการแบ่งเป็นหลายบรรทัด"
                  onChange={(clientsLabel) => patch({ ...content, partners: { ...content.partners, clientsLabel } })}
                />
                <p className="crm-cms-editor-note">
                  รายการโลโก้จัดการที่{" "}
                  <Link href="/crm/cms/client-logos" className="crm-cms-inline-link">
                    โลโก้ลูกค้า
                  </Link>
                </p>
              </div>
            ) : null}

            {tab === "overview" ? (
              <div className="crm-cms-page-editor-grid">
                <LocalizedFields
                  label="หัวข้อ Results Overview"
                  value={content.overview.title}
                  lang={lang}
                  onChange={(overviewTitle) =>
                    patch({ ...content, overview: { ...content.overview, title: overviewTitle } })
                  }
                />
                <LocalizedFields
                  label="Eyebrow กริดผลงาน"
                  value={content.grid.eyebrow}
                  lang={lang}
                  onChange={(eyebrow) => patch({ ...content, grid: { ...content.grid, eyebrow } })}
                />
                <LocalizedFields
                  label="หัวข้อกริดผลงาน"
                  value={content.grid.title}
                  lang={lang}
                  multiline
                  rows={2}
                  hint="ขึ้นบรรทัดใหม่ได้หากต้องการแบ่งหลายบรรทัด"
                  onChange={(gridTitle) => patch({ ...content, grid: { ...content.grid, title: gridTitle } })}
                />
                <p className="crm-cms-editor-note">
                  รายการเคสสตัดดีจัดการที่{" "}
                  <Link href="/crm/cms/case-studies" className="crm-cms-inline-link">
                    รายการผลงานลูกค้า
                  </Link>
                </p>
              </div>
            ) : null}

            {tab === "closer" ? (
              <div className="crm-cms-page-editor-grid">
                <LocalizedFields
                  label="Eyebrow"
                  value={content.closer.eyebrow}
                  lang={lang}
                  onChange={(eyebrow) => patch({ ...content, closer: { ...content.closer, eyebrow } })}
                />
                <LocalizedFields
                  label="หัวข้อ"
                  value={content.closer.title}
                  lang={lang}
                  multiline
                  rows={2}
                  onChange={(closerTitle) => patch({ ...content, closer: { ...content.closer, title: closerTitle } })}
                />
                <LocalizedFields
                  label="รายละเอียด"
                  value={content.closer.body}
                  lang={lang}
                  multiline
                  rows={4}
                  onChange={(body) => patch({ ...content, closer: { ...content.closer, body } })}
                />
                <div className="crm-cms-page-editor-grid is-two">
                  <LocalizedFields
                    label="ปุ่มหลัก"
                    value={content.closer.primaryCta}
                    lang={lang}
                    onChange={(primaryCta) => patch({ ...content, closer: { ...content.closer, primaryCta } })}
                  />
                  <LocalizedFields
                    label="ปุ่มรอง"
                    value={content.closer.secondaryCta}
                    lang={lang}
                    onChange={(secondaryCta) => patch({ ...content, closer: { ...content.closer, secondaryCta } })}
                  />
                </div>
              </div>
            ) : null}

            {tab === "media" ? (
              <div className="crm-cms-page-editor-grid">
                <Field label="รูป Hero (path ใน /public)">
                  <input
                    className="crm-field"
                    value={content.media.heroImage}
                    onChange={(event) =>
                      patch({ ...content, media: { ...content.media, heroImage: event.target.value } })
                    }
                    placeholder="/media/..."
                  />
                </Field>
                <LocalizedFields
                  label="Alt รูป Hero"
                  value={content.media.heroAlt}
                  lang={lang}
                  onChange={(heroAlt) => patch({ ...content, media: { ...content.media, heroAlt } })}
                />
                <p className="crm-cms-editor-note">
                  อัปโหลดไฟล์ใหม่ได้ที่{" "}
                  <Link href="/crm/cms/media" className="crm-cms-inline-link">
                    คลังสื่อ
                  </Link>
                </p>
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
