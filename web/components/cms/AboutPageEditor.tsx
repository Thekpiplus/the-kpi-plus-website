"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { saveAboutPage } from "@/lib/cms/about-page-actions";
import {
  emptyAboutLocalized,
  newAboutFaqId,
  type AboutCmsIntent,
  type AboutEditorState,
  type AboutLocalized,
  type CmsAboutPage,
} from "@/lib/cms/about-page";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "partner", label: "พาร์ตเนอร์" },
  { id: "method", label: "วิธีทำงาน" },
  { id: "pillars", label: "เสาหลัก" },
  { id: "experience", label: "ประสบการณ์" },
  { id: "values", label: "ค่านิยม" },
  { id: "founders", label: "ผู้ก่อตั้ง" },
  { id: "closer", label: "Closer" },
  { id: "join", label: "ร่วมงาน" },
  { id: "media", label: "รูปภาพ" },
  { id: "faq", label: "FAQ" },
  { id: "seo", label: "SEO / เผยแพร่" },
] as const;

type Tab = (typeof TABS)[number]["id"];
type Lang = keyof AboutLocalized;

const LANGS: Array<{ id: Lang; label: string }> = [
  { id: "th", label: "ไทย" },
  { id: "en", label: "EN" },
  { id: "ru", label: "RU" },
  { id: "zh", label: "ZH" },
];

function newRowId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
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

function LocalizedFields({
  label,
  value,
  lang,
  multiline,
  onChange,
}: {
  label: string;
  value: AboutLocalized;
  lang: Lang;
  multiline?: boolean;
  onChange: (next: AboutLocalized) => void;
}) {
  return (
    <Field label={`${label} (${lang.toUpperCase()})`}>
      {multiline ? (
        <textarea
          className="crm-area"
          rows={3}
          value={value[lang]}
          onChange={(event) => onChange({ ...value, [lang]: event.target.value })}
        />
      ) : (
        <input
          className="crm-field"
          value={value[lang]}
          onChange={(event) => onChange({ ...value, [lang]: event.target.value })}
        />
      )}
    </Field>
  );
}

export function AboutPageEditor({
  initial,
  initialTab,
}: {
  initial: AboutEditorState;
  initialTab?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>(TABS.some((item) => item.id === initialTab) ? (initialTab as Tab) : "hero");
  const [lang, setLang] = useState<Lang>("th");
  const [title, setTitle] = useState(initial.title);
  const [seoTitle, setSeoTitle] = useState(initial.seoTitle);
  const [metaDescription, setMetaDescription] = useState(initial.metaDescription);
  const [status, setStatus] = useState(initial.status);
  const [content, setContent] = useState<CmsAboutPage>(initial.content);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function patch(next: CmsAboutPage) {
    setContent(next);
  }

  function submit(intent: AboutCmsIntent) {
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
      const result = await saveAboutPage(formData);
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
      setStatus(intent === "publish" ? "published" : intent === "draft" || intent === "unpublish" ? "draft" : status);
      setMessage(intent === "publish" ? "เผยแพร่แล้ว" : intent === "unpublish" ? "ยกเลิกการเผยแพร่แล้ว" : "บันทึกแล้ว");
      router.refresh();
    });
  }

  return (
    <div className="crm-cms-contact-editor">
      <div className="crm-cms-contact-editor-bar">
        <div className="crm-cms-contact-editor-langs" role="tablist" aria-label="ภาษาที่แก้ไข">
          {LANGS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`crm-users-secondary${lang === item.id ? " is-active" : ""}`}
              onClick={() => setLang(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="crm-cms-contact-editor-actions">
          <Link href="/about-us" className="crm-users-secondary" target="_blank" rel="noreferrer">
            เปิดหน้าเว็บ
          </Link>
          <button type="button" className="crm-users-secondary" disabled={pending} onClick={() => submit("draft")}>
            บันทึกฉบับร่าง
          </button>
          <button type="button" className="kpi-button crm-users-primary" disabled={pending} onClick={() => submit("publish")}>
            {pending ? "กำลังบันทึก…" : "บันทึกและเผยแพร่"}
          </button>
        </div>
      </div>

      {message ? (
        <p className="crm-users-alert is-ok" role="status">
          {message} · สถานะ: {status === "published" ? "เผยแพร่" : "ฉบับร่าง"}
        </p>
      ) : null}
      {error ? (
        <p className="crm-users-alert is-warn" role="alert">
          {error}
        </p>
      ) : null}

      <div className="crm-cms-contact-editor-tabs" role="tablist" aria-label="ส่วนของหน้าเกี่ยวกับเรา">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`crm-users-secondary${tab === item.id ? " is-active" : ""}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="crm-cms-contact-editor-panel">
        {tab === "hero" ? (
          <div className="crm-cms-contact-editor-grid">
            <LocalizedFields
              label="Eyebrow"
              value={content.hero.kicker}
              lang={lang}
              onChange={(kicker) => patch({ ...content, hero: { ...content.hero, kicker } })}
            />
            <LocalizedFields
              label="หัวข้อ H1"
              value={content.hero.h1}
              lang={lang}
              multiline
              onChange={(h1) => patch({ ...content, hero: { ...content.hero, h1 } })}
            />
            <LocalizedFields
              label="ไฮไลต์"
              value={content.hero.highlight}
              lang={lang}
              multiline
              onChange={(highlight) => patch({ ...content, hero: { ...content.hero, highlight } })}
            />
            <LocalizedFields
              label="คำโปรย"
              value={content.hero.heroBody}
              lang={lang}
              multiline
              onChange={(heroBody) => patch({ ...content, hero: { ...content.hero, heroBody } })}
            />
            <LocalizedFields
              label="Alt รูป Hero"
              value={content.hero.workAlt}
              lang={lang}
              onChange={(workAlt) => patch({ ...content, hero: { ...content.hero, workAlt } })}
            />
            <LocalizedFields
              label="ปุ่ม Audit"
              value={content.hero.auditCta}
              lang={lang}
              onChange={(auditCta) => patch({ ...content, hero: { ...content.hero, auditCta } })}
            />
            <LocalizedFields
              label="ปุ่มรอง"
              value={content.hero.secondaryCta}
              lang={lang}
              onChange={(secondaryCta) => patch({ ...content, hero: { ...content.hero, secondaryCta } })}
            />
          </div>
        ) : null}

        {tab === "partner" ? (
          <div className="crm-cms-contact-editor-grid">
            <LocalizedFields
              label="Eyebrow"
              value={content.partner.eyebrow}
              lang={lang}
              onChange={(eyebrow) => patch({ ...content, partner: { ...content.partner, eyebrow } })}
            />
            <LocalizedFields
              label="หัวข้อ"
              value={content.partner.title}
              lang={lang}
              multiline
              onChange={(titleValue) => patch({ ...content, partner: { ...content.partner, title: titleValue } })}
            />
            <LocalizedFields
              label="Lead"
              value={content.partner.lead}
              lang={lang}
              multiline
              onChange={(lead) => patch({ ...content, partner: { ...content.partner, lead } })}
            />
            <LocalizedFields
              label="Goal"
              value={content.partner.goal}
              lang={lang}
              multiline
              onChange={(goal) => patch({ ...content, partner: { ...content.partner, goal } })}
            />
            <LocalizedFields
              label="Accent"
              value={content.partner.accent}
              lang={lang}
              onChange={(accent) => patch({ ...content, partner: { ...content.partner, accent } })}
            />
            <LocalizedFields
              label="ป้าย Story"
              value={content.partner.storyVisualLabel}
              lang={lang}
              onChange={(storyVisualLabel) => patch({ ...content, partner: { ...content.partner, storyVisualLabel } })}
            />
            {content.partner.stages.map((stage, index) => (
              <div key={stage.id} className="crm-cms-contact-step-card">
                <div className="crm-cms-faq-item-head">
                  <strong>ขั้นที่ {index + 1}</strong>
                  <button
                    type="button"
                    className="crm-users-secondary"
                    onClick={() =>
                      patch({
                        ...content,
                        partner: {
                          ...content.partner,
                          stages: content.partner.stages.filter((row) => row.id !== stage.id),
                        },
                      })
                    }
                  >
                    ลบ
                  </button>
                </div>
                <Field label="หมายเลข">
                  <input
                    className="crm-field"
                    value={stage.num}
                    onChange={(event) =>
                      patch({
                        ...content,
                        partner: {
                          ...content.partner,
                          stages: content.partner.stages.map((row) =>
                            row.id === stage.id ? { ...row, num: event.target.value } : row,
                          ),
                        },
                      })
                    }
                  />
                </Field>
                <LocalizedFields
                  label="หัวข้อ"
                  value={stage.title}
                  lang={lang}
                  onChange={(titleValue) =>
                    patch({
                      ...content,
                      partner: {
                        ...content.partner,
                        stages: content.partner.stages.map((row) =>
                          row.id === stage.id ? { ...row, title: titleValue } : row,
                        ),
                      },
                    })
                  }
                />
                <LocalizedFields
                  label="รายละเอียด"
                  value={stage.body}
                  lang={lang}
                  multiline
                  onChange={(body) =>
                    patch({
                      ...content,
                      partner: {
                        ...content.partner,
                        stages: content.partner.stages.map((row) => (row.id === stage.id ? { ...row, body } : row)),
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
                  partner: {
                    ...content.partner,
                    stages: [
                      ...content.partner.stages,
                      {
                        id: newRowId("stage"),
                        num: String(content.partner.stages.length + 1).padStart(2, "0"),
                        title: emptyAboutLocalized("ขั้นใหม่"),
                        body: emptyAboutLocalized(""),
                      },
                    ],
                  },
                })
              }
            >
              เพิ่มขั้น Story
            </button>
            <LocalizedFields
              label="Vision label"
              value={content.partner.visionLabel}
              lang={lang}
              onChange={(visionLabel) => patch({ ...content, partner: { ...content.partner, visionLabel } })}
            />
            <LocalizedFields
              label="Vision"
              value={content.partner.vision}
              lang={lang}
              multiline
              onChange={(vision) => patch({ ...content, partner: { ...content.partner, vision } })}
            />
            <LocalizedFields
              label="Mission label"
              value={content.partner.missionLabel}
              lang={lang}
              onChange={(missionLabel) => patch({ ...content, partner: { ...content.partner, missionLabel } })}
            />
            <LocalizedFields
              label="Mission"
              value={content.partner.mission}
              lang={lang}
              multiline
              onChange={(mission) => patch({ ...content, partner: { ...content.partner, mission } })}
            />
          </div>
        ) : null}

        {tab === "method" ? (
          <div className="crm-cms-contact-editor-grid">
            <LocalizedFields
              label="หัวข้อ"
              value={content.method.title}
              lang={lang}
              onChange={(titleValue) => patch({ ...content, method: { ...content.method, title: titleValue } })}
            />
            <LocalizedFields
              label="ป้ายขั้นตอน"
              value={content.method.stepsLabel}
              lang={lang}
              onChange={(stepsLabel) => patch({ ...content, method: { ...content.method, stepsLabel } })}
            />
            <LocalizedFields
              label="ป้ายผลลัพธ์"
              value={content.method.outputLabel}
              lang={lang}
              onChange={(outputLabel) => patch({ ...content, method: { ...content.method, outputLabel } })}
            />
            <LocalizedFields
              label="หมายเหตุ"
              value={content.method.note}
              lang={lang}
              multiline
              onChange={(note) => patch({ ...content, method: { ...content.method, note } })}
            />
            {content.method.steps.map((step, index) => (
              <div key={step.id} className="crm-cms-contact-step-card">
                <div className="crm-cms-faq-item-head">
                  <strong>ขั้นที่ {index + 1}</strong>
                  <button
                    type="button"
                    className="crm-users-secondary"
                    onClick={() =>
                      patch({
                        ...content,
                        method: {
                          ...content.method,
                          steps: content.method.steps.filter((row) => row.id !== step.id),
                        },
                      })
                    }
                  >
                    ลบ
                  </button>
                </div>
                <Field label="หมายเลข">
                  <input
                    className="crm-field"
                    value={step.num}
                    onChange={(event) =>
                      patch({
                        ...content,
                        method: {
                          ...content.method,
                          steps: content.method.steps.map((row) =>
                            row.id === step.id ? { ...row, num: event.target.value } : row,
                          ),
                        },
                      })
                    }
                  />
                </Field>
                <LocalizedFields
                  label="หัวข้อ"
                  value={step.title}
                  lang={lang}
                  onChange={(titleValue) =>
                    patch({
                      ...content,
                      method: {
                        ...content.method,
                        steps: content.method.steps.map((row) =>
                          row.id === step.id ? { ...row, title: titleValue } : row,
                        ),
                      },
                    })
                  }
                />
                <LocalizedFields
                  label="ผลลัพธ์"
                  value={step.output}
                  lang={lang}
                  onChange={(output) =>
                    patch({
                      ...content,
                      method: {
                        ...content.method,
                        steps: content.method.steps.map((row) => (row.id === step.id ? { ...row, output } : row)),
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
                  method: {
                    ...content.method,
                    steps: [
                      ...content.method.steps,
                      {
                        id: newRowId("method"),
                        num: String(content.method.steps.length + 1).padStart(2, "0"),
                        title: emptyAboutLocalized("ขั้นใหม่"),
                        output: emptyAboutLocalized(""),
                      },
                    ],
                  },
                })
              }
            >
              เพิ่มขั้นตอน
            </button>
          </div>
        ) : null}

        {tab === "pillars" ? (
          <div className="crm-cms-contact-editor-grid">
            <LocalizedFields
              label="หัวข้อ"
              value={content.pillars.title}
              lang={lang}
              onChange={(titleValue) => patch({ ...content, pillars: { ...content.pillars, title: titleValue } })}
            />
            <LocalizedFields
              label="ป้ายสิ่งที่ได้รับ"
              value={content.pillars.receiveLabel}
              lang={lang}
              onChange={(receiveLabel) => patch({ ...content, pillars: { ...content.pillars, receiveLabel } })}
            />
            <LocalizedFields
              label="ป้ายตัวอย่าง"
              value={content.pillars.sampleBadge}
              lang={lang}
              onChange={(sampleBadge) => patch({ ...content, pillars: { ...content.pillars, sampleBadge } })}
            />
            {content.pillars.items.map((item, index) => (
              <div key={item.id} className="crm-cms-contact-step-card">
                <div className="crm-cms-faq-item-head">
                  <strong>เสาหลัก {index + 1}</strong>
                  <button
                    type="button"
                    className="crm-users-secondary"
                    onClick={() =>
                      patch({
                        ...content,
                        pillars: {
                          ...content.pillars,
                          items: content.pillars.items.filter((row) => row.id !== item.id),
                        },
                      })
                    }
                  >
                    ลบ
                  </button>
                </div>
                <Field label="หมายเลข">
                  <input
                    className="crm-field"
                    value={item.num}
                    onChange={(event) =>
                      patch({
                        ...content,
                        pillars: {
                          ...content.pillars,
                          items: content.pillars.items.map((row) =>
                            row.id === item.id ? { ...row, num: event.target.value } : row,
                          ),
                        },
                      })
                    }
                  />
                </Field>
                <LocalizedFields
                  label="หัวข้อ"
                  value={item.title}
                  lang={lang}
                  onChange={(titleValue) =>
                    patch({
                      ...content,
                      pillars: {
                        ...content.pillars,
                        items: content.pillars.items.map((row) =>
                          row.id === item.id ? { ...row, title: titleValue } : row,
                        ),
                      },
                    })
                  }
                />
                <LocalizedFields
                  label="Subtitle"
                  value={item.subtitle}
                  lang={lang}
                  onChange={(subtitle) =>
                    patch({
                      ...content,
                      pillars: {
                        ...content.pillars,
                        items: content.pillars.items.map((row) => (row.id === item.id ? { ...row, subtitle } : row)),
                      },
                    })
                  }
                />
                <LocalizedFields
                  label="รายละเอียด"
                  value={item.body}
                  lang={lang}
                  multiline
                  onChange={(body) =>
                    patch({
                      ...content,
                      pillars: {
                        ...content.pillars,
                        items: content.pillars.items.map((row) => (row.id === item.id ? { ...row, body } : row)),
                      },
                    })
                  }
                />
                <LocalizedFields
                  label="Tags (คั่นด้วย · )"
                  value={item.tags}
                  lang={lang}
                  multiline
                  onChange={(tags) =>
                    patch({
                      ...content,
                      pillars: {
                        ...content.pillars,
                        items: content.pillars.items.map((row) => (row.id === item.id ? { ...row, tags } : row)),
                      },
                    })
                  }
                />
                <LocalizedFields
                  label="สิ่งที่ได้รับ"
                  value={item.receive}
                  lang={lang}
                  onChange={(receive) =>
                    patch({
                      ...content,
                      pillars: {
                        ...content.pillars,
                        items: content.pillars.items.map((row) => (row.id === item.id ? { ...row, receive } : row)),
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
                  pillars: {
                    ...content.pillars,
                    items: [
                      ...content.pillars.items,
                      {
                        id: newRowId("pillar"),
                        num: String(content.pillars.items.length + 1).padStart(2, "0"),
                        title: emptyAboutLocalized("เสาหลักใหม่"),
                        subtitle: emptyAboutLocalized(""),
                        body: emptyAboutLocalized(""),
                        tags: emptyAboutLocalized(""),
                        receive: emptyAboutLocalized(""),
                      },
                    ],
                  },
                })
              }
            >
              เพิ่มเสาหลัก
            </button>
          </div>
        ) : null}

        {tab === "experience" ? (
          <div className="crm-cms-contact-editor-grid">
            <LocalizedFields
              label="หัวข้อ"
              value={content.experience.title}
              lang={lang}
              onChange={(titleValue) => patch({ ...content, experience: { ...content.experience, title: titleValue } })}
            />
            <LocalizedFields
              label="Metric label"
              value={content.experience.metric}
              lang={lang}
              onChange={(metric) => patch({ ...content, experience: { ...content.experience, metric } })}
            />
            <LocalizedFields
              label="Scope"
              value={content.experience.scope}
              lang={lang}
              onChange={(scope) => patch({ ...content, experience: { ...content.experience, scope } })}
            />
            <LocalizedFields
              label="Note"
              value={content.experience.note}
              lang={lang}
              multiline
              onChange={(note) => patch({ ...content, experience: { ...content.experience, note } })}
            />
            <LocalizedFields
              label="Body"
              value={content.experience.body}
              lang={lang}
              multiline
              onChange={(body) => patch({ ...content, experience: { ...content.experience, body } })}
            />
            <LocalizedFields
              label="Clients eyebrow"
              value={content.experience.clientsEyebrow}
              lang={lang}
              onChange={(clientsEyebrow) =>
                patch({ ...content, experience: { ...content.experience, clientsEyebrow } })
              }
            />
            <Field label="ชื่อลูกค้าเด่น (บรรทัดละหนึ่งชื่อ — ต้องตรงกับโลโก้ใน CMS)" hint="ใช้ชื่อเดียวกับในเมนูโลโก้ลูกค้า">
              <textarea
                className="crm-area"
                rows={6}
                value={content.experience.featuredClientNames.join("\n")}
                onChange={(event) =>
                  patch({
                    ...content,
                    experience: {
                      ...content.experience,
                      featuredClientNames: event.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean),
                    },
                  })
                }
              />
            </Field>
          </div>
        ) : null}

        {tab === "values" ? (
          <div className="crm-cms-contact-editor-grid">
            <LocalizedFields
              label="หัวข้อ"
              value={content.values.title}
              lang={lang}
              onChange={(titleValue) => patch({ ...content, values: { ...content.values, title: titleValue } })}
            />
            <LocalizedFields
              label="ลิงก์ Approach"
              value={content.values.processLink}
              lang={lang}
              onChange={(processLink) => patch({ ...content, values: { ...content.values, processLink } })}
            />
            {content.values.items.map((item, index) => (
              <div key={item.id} className="crm-cms-contact-step-card">
                <div className="crm-cms-faq-item-head">
                  <strong>ค่านิยม {index + 1}</strong>
                  <button
                    type="button"
                    className="crm-users-secondary"
                    onClick={() =>
                      patch({
                        ...content,
                        values: {
                          ...content.values,
                          items: content.values.items.filter((row) => row.id !== item.id),
                        },
                      })
                    }
                  >
                    ลบ
                  </button>
                </div>
                <Field label="หมายเลข">
                  <input
                    className="crm-field"
                    value={item.num}
                    onChange={(event) =>
                      patch({
                        ...content,
                        values: {
                          ...content.values,
                          items: content.values.items.map((row) =>
                            row.id === item.id ? { ...row, num: event.target.value } : row,
                          ),
                        },
                      })
                    }
                  />
                </Field>
                <LocalizedFields
                  label="หัวข้อ"
                  value={item.title}
                  lang={lang}
                  onChange={(titleValue) =>
                    patch({
                      ...content,
                      values: {
                        ...content.values,
                        items: content.values.items.map((row) =>
                          row.id === item.id ? { ...row, title: titleValue } : row,
                        ),
                      },
                    })
                  }
                />
                <LocalizedFields
                  label="รายละเอียด"
                  value={item.body}
                  lang={lang}
                  multiline
                  onChange={(body) =>
                    patch({
                      ...content,
                      values: {
                        ...content.values,
                        items: content.values.items.map((row) => (row.id === item.id ? { ...row, body } : row)),
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
                  values: {
                    ...content.values,
                    items: [
                      ...content.values.items,
                      {
                        id: newRowId("value"),
                        num: String(content.values.items.length + 1).padStart(2, "0"),
                        title: emptyAboutLocalized("ค่านิยมใหม่"),
                        body: emptyAboutLocalized(""),
                      },
                    ],
                  },
                })
              }
            >
              เพิ่มค่านิยม
            </button>
          </div>
        ) : null}

        {tab === "founders" ? (
          <div className="crm-cms-contact-editor-grid">
            <LocalizedFields
              label="Eyebrow"
              value={content.founders.eyebrow}
              lang={lang}
              onChange={(eyebrow) => patch({ ...content, founders: { ...content.founders, eyebrow } })}
            />
            <LocalizedFields
              label="หัวข้อ"
              value={content.founders.title}
              lang={lang}
              onChange={(titleValue) => patch({ ...content, founders: { ...content.founders, title: titleValue } })}
            />
            <LocalizedFields
              label="Lead"
              value={content.founders.lead}
              lang={lang}
              multiline
              onChange={(lead) => patch({ ...content, founders: { ...content.founders, lead } })}
            />
            <LocalizedFields
              label="Help"
              value={content.founders.help}
              lang={lang}
              multiline
              onChange={(help) => patch({ ...content, founders: { ...content.founders, help } })}
            />
            <LocalizedFields
              label="Alt รูป"
              value={content.founders.alt}
              lang={lang}
              onChange={(alt) => patch({ ...content, founders: { ...content.founders, alt } })}
            />
            <LocalizedFields
              label="Caption"
              value={content.founders.caption}
              lang={lang}
              onChange={(caption) => patch({ ...content, founders: { ...content.founders, caption } })}
            />
            <LocalizedFields
              label="ผู้ก่อตั้ง A — ชื่อ"
              value={content.founders.aName}
              lang={lang}
              onChange={(aName) => patch({ ...content, founders: { ...content.founders, aName } })}
            />
            <LocalizedFields
              label="ผู้ก่อตั้ง A — บทบาท"
              value={content.founders.aRole}
              lang={lang}
              onChange={(aRole) => patch({ ...content, founders: { ...content.founders, aRole } })}
            />
            <LocalizedFields
              label="ผู้ก่อตั้ง A — รายละเอียด"
              value={content.founders.aBody}
              lang={lang}
              multiline
              onChange={(aBody) => patch({ ...content, founders: { ...content.founders, aBody } })}
            />
            <LocalizedFields
              label="ผู้ก่อตั้ง B — ชื่อ"
              value={content.founders.bName}
              lang={lang}
              onChange={(bName) => patch({ ...content, founders: { ...content.founders, bName } })}
            />
            <LocalizedFields
              label="ผู้ก่อตั้ง B — บทบาท"
              value={content.founders.bRole}
              lang={lang}
              onChange={(bRole) => patch({ ...content, founders: { ...content.founders, bRole } })}
            />
            <LocalizedFields
              label="ผู้ก่อตั้ง B — รายละเอียด"
              value={content.founders.bBody}
              lang={lang}
              multiline
              onChange={(bBody) => patch({ ...content, founders: { ...content.founders, bBody } })}
            />
          </div>
        ) : null}

        {tab === "closer" ? (
          <div className="crm-cms-contact-editor-grid">
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
              onChange={(titleValue) => patch({ ...content, closer: { ...content.closer, title: titleValue } })}
            />
            <LocalizedFields
              label="Body"
              value={content.closer.body}
              lang={lang}
              multiline
              onChange={(body) => patch({ ...content, closer: { ...content.closer, body } })}
            />
            <LocalizedFields
              label="Line"
              value={content.closer.line}
              lang={lang}
              onChange={(line) => patch({ ...content, closer: { ...content.closer, line } })}
            />
            <LocalizedFields
              label="ป้ายขั้นตอนถัดไป"
              value={content.closer.nextLabel}
              lang={lang}
              onChange={(nextLabel) => patch({ ...content, closer: { ...content.closer, nextLabel } })}
            />
            {content.closer.next.map((item, index) => (
              <div key={`closer-next-${index}`} className="crm-cms-contact-step-card">
                <div className="crm-cms-faq-item-head">
                  <strong>ขั้นถัดไป {index + 1}</strong>
                  <button
                    type="button"
                    className="crm-users-secondary"
                    onClick={() =>
                      patch({
                        ...content,
                        closer: {
                          ...content.closer,
                          next: content.closer.next.filter((_, i) => i !== index),
                        },
                      })
                    }
                  >
                    ลบ
                  </button>
                </div>
                <LocalizedFields
                  label="ข้อความ"
                  value={item}
                  lang={lang}
                  onChange={(nextValue) =>
                    patch({
                      ...content,
                      closer: {
                        ...content.closer,
                        next: content.closer.next.map((row, i) => (i === index ? nextValue : row)),
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
                  closer: {
                    ...content.closer,
                    next: [...content.closer.next, emptyAboutLocalized("")],
                  },
                })
              }
            >
              เพิ่มขั้นถัดไป
            </button>
            <LocalizedFields
              label="Note"
              value={content.closer.note}
              lang={lang}
              onChange={(note) => patch({ ...content, closer: { ...content.closer, note } })}
            />
          </div>
        ) : null}

        {tab === "join" ? (
          <div className="crm-cms-contact-editor-grid">
            <LocalizedFields
              label="หัวข้อ"
              value={content.join.title}
              lang={lang}
              onChange={(titleValue) => patch({ ...content, join: { ...content.join, title: titleValue } })}
            />
            <LocalizedFields
              label="Body"
              value={content.join.body}
              lang={lang}
              multiline
              onChange={(body) => patch({ ...content, join: { ...content.join, body } })}
            />
            <LocalizedFields
              label="ป้ายกระบวนการ"
              value={content.join.processLabel}
              lang={lang}
              onChange={(processLabel) => patch({ ...content, join: { ...content.join, processLabel } })}
            />
            <LocalizedFields
              label="CTA"
              value={content.join.cta}
              lang={lang}
              onChange={(cta) => patch({ ...content, join: { ...content.join, cta } })}
            />
            {content.join.steps.map((step, index) => (
              <div key={step.id} className="crm-cms-contact-step-card">
                <div className="crm-cms-faq-item-head">
                  <strong>ขั้นที่ {index + 1}</strong>
                  <button
                    type="button"
                    className="crm-users-secondary"
                    onClick={() =>
                      patch({
                        ...content,
                        join: {
                          ...content.join,
                          steps: content.join.steps.filter((row) => row.id !== step.id),
                        },
                      })
                    }
                  >
                    ลบ
                  </button>
                </div>
                <Field label="หมายเลข">
                  <input
                    className="crm-field"
                    value={step.num}
                    onChange={(event) =>
                      patch({
                        ...content,
                        join: {
                          ...content.join,
                          steps: content.join.steps.map((row) =>
                            row.id === step.id ? { ...row, num: event.target.value } : row,
                          ),
                        },
                      })
                    }
                  />
                </Field>
                <LocalizedFields
                  label="หัวข้อ"
                  value={step.title}
                  lang={lang}
                  onChange={(titleValue) =>
                    patch({
                      ...content,
                      join: {
                        ...content.join,
                        steps: content.join.steps.map((row) =>
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
                  onChange={(body) =>
                    patch({
                      ...content,
                      join: {
                        ...content.join,
                        steps: content.join.steps.map((row) => (row.id === step.id ? { ...row, body } : row)),
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
                  join: {
                    ...content.join,
                    steps: [
                      ...content.join.steps,
                      {
                        id: newRowId("join"),
                        num: String(content.join.steps.length + 1).padStart(2, "0"),
                        title: emptyAboutLocalized("ขั้นใหม่"),
                        body: emptyAboutLocalized(""),
                      },
                    ],
                  },
                })
              }
            >
              เพิ่มขั้นตอน
            </button>
          </div>
        ) : null}

        {tab === "media" ? (
          <div className="crm-cms-contact-editor-grid">
            <Field label="รูป Hero (path ใน /public)">
              <input
                className="crm-field"
                value={content.media.workPhoto}
                onChange={(event) =>
                  patch({ ...content, media: { ...content.media, workPhoto: event.target.value } })
                }
              />
            </Field>
            <Field label="รูปผู้ก่อตั้ง">
              <input
                className="crm-field"
                value={content.media.foundersPhoto}
                onChange={(event) =>
                  patch({ ...content, media: { ...content.media, foundersPhoto: event.target.value } })
                }
              />
            </Field>
            <Field label="รูปเวิร์กช็อป">
              <input
                className="crm-field"
                value={content.media.workshopPhoto}
                onChange={(event) =>
                  patch({ ...content, media: { ...content.media, workshopPhoto: event.target.value } })
                }
              />
            </Field>
            <Field label="รูปทีม (Join)">
              <input
                className="crm-field"
                value={content.media.teamRealPhoto}
                onChange={(event) =>
                  patch({ ...content, media: { ...content.media, teamRealPhoto: event.target.value } })
                }
              />
            </Field>
            <Field label="รูปเคสโรงแรม">
              <input
                className="crm-field"
                value={content.media.caseHotelPhoto}
                onChange={(event) =>
                  patch({ ...content, media: { ...content.media, caseHotelPhoto: event.target.value } })
                }
              />
            </Field>
            <Field label="รูปเสาหลัก 1">
              <input
                className="crm-field"
                value={content.media.pillarPhotos[0]}
                onChange={(event) =>
                  patch({
                    ...content,
                    media: {
                      ...content.media,
                      pillarPhotos: [event.target.value, content.media.pillarPhotos[1], content.media.pillarPhotos[2]],
                    },
                  })
                }
              />
            </Field>
            <Field label="รูปเสาหลัก 2">
              <input
                className="crm-field"
                value={content.media.pillarPhotos[1]}
                onChange={(event) =>
                  patch({
                    ...content,
                    media: {
                      ...content.media,
                      pillarPhotos: [content.media.pillarPhotos[0], event.target.value, content.media.pillarPhotos[2]],
                    },
                  })
                }
              />
            </Field>
            <Field label="รูปเสาหลัก 3">
              <input
                className="crm-field"
                value={content.media.pillarPhotos[2]}
                onChange={(event) =>
                  patch({
                    ...content,
                    media: {
                      ...content.media,
                      pillarPhotos: [content.media.pillarPhotos[0], content.media.pillarPhotos[1], event.target.value],
                    },
                  })
                }
              />
            </Field>
            <LocalizedFields
              label="Caption Dummy"
              value={content.media.dummyCaption}
              lang={lang}
              onChange={(dummyCaption) => patch({ ...content, media: { ...content.media, dummyCaption } })}
            />
            <LocalizedFields
              label="Alt เวิร์กช็อป"
              value={content.media.workshopAlt}
              lang={lang}
              onChange={(workshopAlt) => patch({ ...content, media: { ...content.media, workshopAlt } })}
            />
            <LocalizedFields
              label="Alt ทีม"
              value={content.media.teamRealAlt}
              lang={lang}
              onChange={(teamRealAlt) => patch({ ...content, media: { ...content.media, teamRealAlt } })}
            />
            <LocalizedFields
              label="Alt เคสโรงแรม"
              value={content.media.caseHotelAlt}
              lang={lang}
              onChange={(caseHotelAlt) => patch({ ...content, media: { ...content.media, caseHotelAlt } })}
            />
          </div>
        ) : null}

        {tab === "faq" ? (
          <div className="crm-cms-contact-editor-grid">
            <p className="crm-cms-editor-note">
              แก้ FAQ ของหน้าเกี่ยวกับเราได้ที่นี่ — บันทึกแล้วจะขึ้นบนเว็บสาธารณะตามภาษาที่เลือกด้านบน
            </p>
            {content.faqs.map((faq, index) => (
              <div key={faq.id} className="crm-cms-contact-step-card">
                <div className="crm-cms-faq-item-head">
                  <strong>FAQ {index + 1}</strong>
                  <button
                    type="button"
                    className="crm-users-secondary"
                    onClick={() =>
                      patch({
                        ...content,
                        faqs: content.faqs.length <= 1 ? content.faqs : content.faqs.filter((row) => row.id !== faq.id),
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
                  faqs: [...content.faqs, { id: newAboutFaqId(), q: emptyAboutLocalized(""), a: emptyAboutLocalized("") }],
                })
              }
            >
              เพิ่ม FAQ
            </button>
          </div>
        ) : null}

        {tab === "seo" ? (
          <div className="crm-cms-contact-editor-grid">
            <Field label="ชื่อเอกสารใน CMS">
              <input className="crm-field" value={title} onChange={(event) => setTitle(event.target.value)} />
            </Field>
            <Field label="SEO title">
              <input className="crm-field" value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} />
            </Field>
            <Field label="Meta description">
              <textarea
                className="crm-area"
                rows={3}
                value={metaDescription}
                onChange={(event) => setMetaDescription(event.target.value)}
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
  );
}
