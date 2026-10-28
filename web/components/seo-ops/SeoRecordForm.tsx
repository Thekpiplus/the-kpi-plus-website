"use client";

import { useState } from "react";
import { Field, SaveBar, toDateInput } from "@/components/b2b-ops/ui";
import {
  MASKED_VALUE,
  SEO_APPROVAL_LABEL,
  SEO_APPROVAL_STATUSES,
  SEO_DEPARTMENT_LABEL,
  SEO_DEPARTMENTS,
  SEO_FAQ_STATUS_LABEL,
  SEO_FAQ_STATUSES,
  SEO_FORM_TAB_LABEL,
  SEO_FORM_TABS,
  SEO_KPI_DATA_STATUS_LABEL,
  SEO_KPI_DATA_STATUSES,
  SEO_PRIORITIES,
  SEO_PRIORITY_LABEL,
  SEO_READINESS_LABEL,
  SEO_STATUS_LABEL,
  SEO_STATUSES,
  SEO_WORKSTREAM_LABEL,
  SEO_WORKSTREAMS,
  seoSectionFormTab,
  type SeoAccessView,
  type SeoAeoView,
  type SeoDepartment,
  type SeoFormTab,
  type SeoKpiView,
  type SeoPriority,
  type SeoPropertyRow,
  type SeoSection,
  type SeoSourceView,
  type SeoStatus,
  type SeoSubtaskView,
  type SeoWorkstream,
} from "@/lib/seo-ops/types";
import { SeoSubtasksPanel, type SeoSubtaskDraft } from "./SeoSubtasksPanel";

type Staff = { id: string; name: string };

export type SeoRecordDraft = {
  id: string;
  hotelName: string;
  businessName: string;
  website: string;
  gbpUrl: string;
  mapsUrl: string;
  searchMarket: string;
  language: string;
  location: string;
  primaryCategory: string;
  secondaryCategories: string;
  status: SeoStatus;
  ownerId: string;
  department: SeoDepartment;
  workstream: SeoWorkstream;
  priority: SeoPriority;
  nextAction: string;
  nextActionAt: string;
  auditAt: string;
  notes: string;
  gscPropertyRef: string;
  googleAccountRef: string;
  contactPath: string;
  bookingUrl: string;
  reviewWorkflow: string;
  gbpName: string;
  gbpCategory: string;
  gbpAddress: string;
  gbpHours: string;
  gbpPhone: string;
  gbpWebsite: string;
  gbpPhotos: string;
  gbpServices: string;
  gbpReviewWorkflow: string;
  gbpContactLink: string;
  gbpApproval: string;
  sources: SeoSourceView[];
  aeoQueries: SeoAeoView[];
  kpis: SeoKpiView[];
};

export function emptySeoDraft(ownerId = "", workstream: SeoWorkstream = "visibility"): SeoRecordDraft {
  return {
    id: "",
    hotelName: "",
    businessName: "",
    website: "",
    gbpUrl: "",
    mapsUrl: "",
    searchMarket: "",
    language: "",
    location: "",
    primaryCategory: "",
    secondaryCategories: "",
    status: "draft",
    ownerId,
    department: "marketing",
    workstream,
    priority: "normal",
    nextAction: "",
    nextActionAt: "",
    auditAt: "",
    notes: "",
    gscPropertyRef: "",
    googleAccountRef: "",
    contactPath: "",
    bookingUrl: "",
    reviewWorkflow: "",
    gbpName: "",
    gbpCategory: "",
    gbpAddress: "",
    gbpHours: "",
    gbpPhone: "",
    gbpWebsite: "",
    gbpPhotos: "",
    gbpServices: "",
    gbpReviewWorkflow: "",
    gbpContactLink: "",
    gbpApproval: "not_requested",
    sources: [],
    aeoQueries: [],
    kpis: [],
  };
}

export function draftFromRow(row: SeoPropertyRow): SeoRecordDraft {
  return {
    id: row.id,
    hotelName: row.hotelName,
    businessName: row.businessName,
    website: row.website,
    gbpUrl: row.gbpUrl,
    mapsUrl: row.mapsUrl,
    searchMarket: row.searchMarket,
    language: row.language,
    location: row.location,
    primaryCategory: row.primaryCategory,
    secondaryCategories: row.secondaryCategories,
    status: row.status,
    ownerId: row.ownerId,
    department: row.department,
    workstream: row.workstream,
    priority: row.priority,
    nextAction: row.nextAction,
    nextActionAt: toDateInput(row.nextActionAt),
    auditAt: toDateInput(row.auditAt),
    notes: row.notes,
    gscPropertyRef: row.privateMasked ? MASKED_VALUE : row.gscPropertyRef,
    googleAccountRef: row.privateMasked ? MASKED_VALUE : row.googleAccountRef,
    contactPath: row.contactPath,
    bookingUrl: row.bookingUrl,
    reviewWorkflow: row.reviewWorkflow,
    gbpName: row.gbpName,
    gbpCategory: row.gbpCategory,
    gbpAddress: row.gbpAddress,
    gbpHours: row.gbpHours,
    gbpPhone: row.gbpPhone,
    gbpWebsite: row.gbpWebsite,
    gbpPhotos: row.gbpPhotos,
    gbpServices: row.gbpServices,
    gbpReviewWorkflow: row.gbpReviewWorkflow,
    gbpContactLink: row.gbpContactLink,
    gbpApproval: row.gbpApproval,
    sources: row.sources,
    aeoQueries: row.aeoQueries,
    kpis: row.kpis,
  };
}

function emptySource(): SeoSourceView {
  return { id: "", name: "", url: "", publishedAt: "", accessedAt: "", notes: "" };
}

function emptyAeo(): SeoAeoView {
  return {
    id: "",
    query: "",
    intent: "",
    answerDraft: "",
    source: "",
    entityInfo: "",
    faqStatus: "not_started",
    language: "",
    market: "",
    reviewStatus: "not_requested",
    publishedStatus: "not_started",
  };
}

function emptyKpi(): SeoKpiView {
  return { id: "", name: "", period: "", value: "", definition: "", source: "", dataStatus: "draft", market: "" };
}

function formatDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}

export function SeoRecordForm({
  draft,
  row,
  staff,
  access,
  section = "visibility",
  pending,
  ok,
  error,
  onChange,
  onSave,
  onClose,
  subtaskDraft,
  subtaskComment,
  onSubtaskDraftChange,
  onSubtaskCommentChange,
  onSaveSubtask,
  onCompleteSubtask,
  onAddSubtaskComment,
  onAttachSubtaskFile,
  onPatchSubtask,
  onEscalate,
  onCloseRecord,
}: {
  draft: SeoRecordDraft;
  row?: SeoPropertyRow;
  staff: Staff[];
  access: SeoAccessView;
  section?: SeoSection;
  pending: boolean;
  ok: string;
  error: string;
  onChange: (draft: SeoRecordDraft) => void;
  onSave: () => void;
  onClose: () => void;
  subtaskDraft: SeoSubtaskDraft;
  subtaskComment: string;
  onSubtaskDraftChange: (draft: SeoSubtaskDraft) => void;
  onSubtaskCommentChange: (value: string) => void;
  onSaveSubtask: () => void;
  onCompleteSubtask: (item: SeoSubtaskView, completed: boolean) => void;
  onAddSubtaskComment: (subtaskId: string) => void;
  onAttachSubtaskFile: (subtaskId: string, form: HTMLFormElement) => void;
  onPatchSubtask: (item: SeoSubtaskView, patch: Partial<SeoSubtaskDraft>) => void;
  onEscalate: () => void;
  onCloseRecord: () => void;
}) {
  const [tab, setTab] = useState<SeoFormTab>(seoSectionFormTab(section));
  const patch = (next: Partial<SeoRecordDraft>) => onChange({ ...draft, ...next });
  const saveBar = <SaveBar pending={pending} ok={ok} error={error} onSave={onSave} saveLabel={draft.id ? "บันทึก" : "สร้างรายการ"} />;

  return (
    <div className="crm-modal ads-drawer" role="presentation">
      <button type="button" className="crm-modal-backdrop" aria-label="ปิดฟอร์ม" onClick={onClose} />
      <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby="seo-record-title">
        <div className="crm-modal-head">
          <div>
            <p className="crm-modal-eyebrow">Local Search Operations</p>
            <h2 id="seo-record-title">{draft.id ? draft.businessName || draft.hotelName || "แก้ไขรายการ" : "สร้างรายการ Local Search"}</h2>
            {row ? (
              <p className="b2b-muted">
                <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> ·{" "}
                {SEO_READINESS_LABEL[row.progress.readiness]}
              </p>
            ) : (
              <p className="b2b-muted">บันทึกด้วยตนเอง ไม่มีการนำเข้าข้อมูล</p>
            )}
          </div>
          <button type="button" className="crm-users-secondary" onClick={onClose}>
            ปิด
          </button>
        </div>
        {saveBar}
        <div className="ads-form-tabs" role="tablist" aria-label="ส่วนของฟอร์ม">
          {SEO_FORM_TABS.map((item) => (
            <button
              key={item}
              id={`seo-tab-${item}`}
              type="button"
              role="tab"
              aria-selected={tab === item}
              aria-controls={`seo-panel-${item}`}
              tabIndex={tab === item ? 0 : -1}
              className={tab === item ? "is-active" : undefined}
              onClick={() => setTab(item)}
            >
              {SEO_FORM_TAB_LABEL[item]}
            </button>
          ))}
        </div>

        {tab === "subtasks" ? (
          <div role="tabpanel" id="seo-panel-subtasks" aria-labelledby="seo-tab-subtasks">
          <SeoSubtasksPanel
            row={row}
            staff={staff}
            access={access}
            pending={pending}
            draft={subtaskDraft}
            comment={subtaskComment}
            onDraftChange={onSubtaskDraftChange}
            onCommentChange={onSubtaskCommentChange}
            onSave={onSaveSubtask}
            onComplete={onCompleteSubtask}
            onAddComment={onAddSubtaskComment}
            onAttach={onAttachSubtaskFile}
            onPatchSubtask={onPatchSubtask}
          />
          </div>
        ) : null}

        {tab === "overview" ? (
          <div className="b2b-form-grid" role="tabpanel" id="seo-panel-overview" aria-labelledby="seo-tab-overview">
            <Field label="Property / hotel">
              <input className="crm-field" value={draft.hotelName} onChange={(event) => patch({ hotelName: event.target.value })} />
            </Field>
            <Field label="Business name">
              <input className="crm-field" value={draft.businessName} onChange={(event) => patch({ businessName: event.target.value })} />
            </Field>
            <Field label="Website URL">
              <input className="crm-field" value={draft.website} onChange={(event) => patch({ website: event.target.value })} />
            </Field>
            <Field label="Google Business Profile URL">
              <input className="crm-field" value={draft.gbpUrl} onChange={(event) => patch({ gbpUrl: event.target.value })} />
            </Field>
            <Field label="Search market">
              <input className="crm-field" value={draft.searchMarket} onChange={(event) => patch({ searchMarket: event.target.value })} />
            </Field>
            <Field label="Language">
              <input className="crm-field" value={draft.language} onChange={(event) => patch({ language: event.target.value })} />
            </Field>
            <Field label="Location">
              <input className="crm-field" value={draft.location} onChange={(event) => patch({ location: event.target.value })} />
            </Field>
            <Field label="Primary business category">
              <input className="crm-field" value={draft.primaryCategory} onChange={(event) => patch({ primaryCategory: event.target.value })} />
            </Field>
            <Field label="Secondary categories">
              <input className="crm-field" value={draft.secondaryCategories} onChange={(event) => patch({ secondaryCategories: event.target.value })} />
            </Field>
            <Field label="Status">
              <select className="crm-select" value={draft.status} onChange={(event) => patch({ status: event.target.value as SeoStatus })}>
                {SEO_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {SEO_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Owner">
              <select className="crm-select" value={draft.ownerId} onChange={(event) => patch({ ownerId: event.target.value })}>
                <option value="">ยังไม่มอบหมาย</option>
                {staff.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Department">
              <select className="crm-select" value={draft.department} onChange={(event) => patch({ department: event.target.value as SeoDepartment })}>
                {SEO_DEPARTMENTS.map((item) => (
                  <option key={item} value={item}>
                    {SEO_DEPARTMENT_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Workstream">
              <select className="crm-select" value={draft.workstream} onChange={(event) => patch({ workstream: event.target.value as SeoWorkstream })}>
                {SEO_WORKSTREAMS.map((item) => (
                  <option key={item} value={item}>
                    {SEO_WORKSTREAM_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Priority">
              <select className="crm-select" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as SeoPriority })}>
                {SEO_PRIORITIES.map((item) => (
                  <option key={item} value={item}>
                    {SEO_PRIORITY_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Next action">
              <input className="crm-field" value={draft.nextAction} onChange={(event) => patch({ nextAction: event.target.value })} />
            </Field>
            <Field label="Next action date">
              <input className="crm-field" type="date" value={draft.nextActionAt} onChange={(event) => patch({ nextActionAt: event.target.value })} />
            </Field>
            <Field label="Audit date">
              <input className="crm-field" type="date" value={draft.auditAt} onChange={(event) => patch({ auditAt: event.target.value })} />
            </Field>
            <Field label="Maps / listing URL">
              <input className="crm-field" value={draft.mapsUrl} onChange={(event) => patch({ mapsUrl: event.target.value })} />
            </Field>
            {access.canSeePrivateIds ? (
              <>
                <Field label="Search Console property ref" hint="ภายในเท่านั้น ไม่แสดงต่อผู้ไม่มีสิทธิ์">
                  <input className="crm-field" value={draft.gscPropertyRef} onChange={(event) => patch({ gscPropertyRef: event.target.value })} />
                </Field>
                <Field label="Google account ref" hint="ภายในเท่านั้น">
                  <input className="crm-field" value={draft.googleAccountRef} onChange={(event) => patch({ googleAccountRef: event.target.value })} />
                </Field>
              </>
            ) : (
              <p className="b2b-muted">รหัส Search Console และบัญชี Google ถูกปกปิดตามสิทธิ์ ({MASKED_VALUE})</p>
            )}
            <Field label="Notes">
              <textarea className="crm-field" rows={4} value={draft.notes} onChange={(event) => patch({ notes: event.target.value })} />
            </Field>
          </div>
        ) : null}

        {tab === "gbp" ? (
          <div className="b2b-form-grid" role="tabpanel" id="seo-panel-gbp" aria-labelledby="seo-tab-gbp">
            <Field label="Business name">
              <input className="crm-field" value={draft.gbpName} onChange={(event) => patch({ gbpName: event.target.value })} />
            </Field>
            <Field label="Category">
              <input className="crm-field" value={draft.gbpCategory} onChange={(event) => patch({ gbpCategory: event.target.value })} />
            </Field>
            <Field label="Address / service area">
              <textarea className="crm-field" rows={3} value={draft.gbpAddress} onChange={(event) => patch({ gbpAddress: event.target.value })} />
            </Field>
            <Field label="Operating hours">
              <textarea className="crm-field" rows={3} value={draft.gbpHours} onChange={(event) => patch({ gbpHours: event.target.value })} />
            </Field>
            <Field label="Phone">
              <input className="crm-field" value={draft.gbpPhone} onChange={(event) => patch({ gbpPhone: event.target.value })} />
            </Field>
            <Field label="Website">
              <input className="crm-field" value={draft.gbpWebsite} onChange={(event) => patch({ gbpWebsite: event.target.value })} />
            </Field>
            <Field label="Photos" hint="หนึ่งบรรทัดต่อไฟล์หรือ URL ที่บันทึกด้วยตนเอง">
              <textarea className="crm-field" rows={3} value={draft.gbpPhotos} onChange={(event) => patch({ gbpPhotos: event.target.value })} />
            </Field>
            <Field label="Services / facilities">
              <textarea className="crm-field" rows={3} value={draft.gbpServices} onChange={(event) => patch({ gbpServices: event.target.value })} />
            </Field>
            <Field label="Review / question workflow">
              <textarea className="crm-field" rows={3} value={draft.gbpReviewWorkflow} onChange={(event) => patch({ gbpReviewWorkflow: event.target.value })} />
            </Field>
            <Field label="Contact / booking link">
              <input className="crm-field" value={draft.gbpContactLink} onChange={(event) => patch({ gbpContactLink: event.target.value })} />
            </Field>
            <Field label="Approval status">
              <select className="crm-select" value={draft.gbpApproval} onChange={(event) => patch({ gbpApproval: event.target.value })}>
                {SEO_APPROVAL_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {SEO_APPROVAL_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        ) : null}

        {tab === "aeo" ? (
          <div className="seo-nested" role="tabpanel" id="seo-panel-aeo" aria-labelledby="seo-tab-aeo">
            {draft.aeoQueries.map((item, index) => (
              <article key={item.id || `aeo-${index}`} className="b2b-panel">
                <div className="b2b-form-grid">
                  <Field label="Target query or question">
                    <input className="crm-field" value={item.query} onChange={(event) => patchAeo(patch, draft, index, { query: event.target.value })} />
                  </Field>
                  <Field label="Search intent">
                    <input className="crm-field" value={item.intent} onChange={(event) => patchAeo(patch, draft, index, { intent: event.target.value })} />
                  </Field>
                  <Field label="Answer draft">
                    <textarea className="crm-field" rows={3} value={item.answerDraft} onChange={(event) => patchAeo(patch, draft, index, { answerDraft: event.target.value })} />
                  </Field>
                  <Field label="Source">
                    <input className="crm-field" value={item.source} onChange={(event) => patchAeo(patch, draft, index, { source: event.target.value })} />
                  </Field>
                  <Field label="Entity / business information">
                    <textarea className="crm-field" rows={2} value={item.entityInfo} onChange={(event) => patchAeo(patch, draft, index, { entityInfo: event.target.value })} />
                  </Field>
                  <Field label="FAQ / structured-content status">
                    <select className="crm-select" value={item.faqStatus} onChange={(event) => patchAeo(patch, draft, index, { faqStatus: event.target.value as SeoAeoView["faqStatus"] })}>
                      {SEO_FAQ_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {SEO_FAQ_STATUS_LABEL[status]}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Language">
                    <input className="crm-field" value={item.language} onChange={(event) => patchAeo(patch, draft, index, { language: event.target.value })} />
                  </Field>
                  <Field label="Market">
                    <input className="crm-field" value={item.market} onChange={(event) => patchAeo(patch, draft, index, { market: event.target.value })} />
                  </Field>
                  <Field label="Review status">
                    <select className="crm-select" value={item.reviewStatus} onChange={(event) => patchAeo(patch, draft, index, { reviewStatus: event.target.value as SeoAeoView["reviewStatus"] })}>
                      {SEO_APPROVAL_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {SEO_APPROVAL_LABEL[status]}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Published status">
                    <select className="crm-select" value={item.publishedStatus} onChange={(event) => patchAeo(patch, draft, index, { publishedStatus: event.target.value as SeoAeoView["publishedStatus"] })}>
                      {SEO_FAQ_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {SEO_FAQ_STATUS_LABEL[status]}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <button type="button" className="crm-users-secondary" onClick={() => patch({ aeoQueries: draft.aeoQueries.filter((_, i) => i !== index) })}>
                  ลบคำถาม
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ aeoQueries: [...draft.aeoQueries, emptyAeo()] })}>
              เพิ่มคำถาม / AEO
            </button>
          </div>
        ) : null}

        {tab === "contact" ? (
          <div className="b2b-form-grid" role="tabpanel" id="seo-panel-contact" aria-labelledby="seo-tab-contact">
            <Field label="Contact path">
              <textarea className="crm-field" rows={4} value={draft.contactPath} onChange={(event) => patch({ contactPath: event.target.value })} />
            </Field>
            <Field label="Booking URL">
              <input className="crm-field" value={draft.bookingUrl} onChange={(event) => patch({ bookingUrl: event.target.value })} />
            </Field>
            <Field label="Review / question workflow" hint="ไม่บันทึกชื่อผู้รีวิวหรือข้อมูลส่วนบุคคลของลูกค้า">
              <textarea className="crm-field" rows={4} value={draft.reviewWorkflow} onChange={(event) => patch({ reviewWorkflow: event.target.value })} />
            </Field>
          </div>
        ) : null}

        {tab === "sources" ? (
          <div className="seo-nested" role="tabpanel" id="seo-panel-sources" aria-labelledby="seo-tab-sources">
            {draft.sources.map((item, index) => (
              <article key={item.id || `src-${index}`} className="b2b-panel">
                <div className="b2b-form-grid">
                  <Field label="Source name">
                    <input className="crm-field" value={item.name} onChange={(event) => patchSource(patch, draft, index, { name: event.target.value })} />
                  </Field>
                  <Field label="URL">
                    <input className="crm-field" value={item.url} onChange={(event) => patchSource(patch, draft, index, { url: event.target.value })} />
                  </Field>
                  <Field label="Published">
                    <input className="crm-field" value={item.publishedAt} onChange={(event) => patchSource(patch, draft, index, { publishedAt: event.target.value })} />
                  </Field>
                  <Field label="Accessed">
                    <input className="crm-field" value={item.accessedAt} onChange={(event) => patchSource(patch, draft, index, { accessedAt: event.target.value })} />
                  </Field>
                  <Field label="Notes">
                    <textarea className="crm-field" rows={2} value={item.notes} onChange={(event) => patchSource(patch, draft, index, { notes: event.target.value })} />
                  </Field>
                </div>
                <button type="button" className="crm-users-secondary" onClick={() => patch({ sources: draft.sources.filter((_, i) => i !== index) })}>
                  ลบแหล่งที่มา
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ sources: [...draft.sources, emptySource()] })}>
              เพิ่มแหล่งที่มา
            </button>
          </div>
        ) : null}

        {tab === "reports" ? (
          <div className="seo-nested" role="tabpanel" id="seo-panel-reports" aria-labelledby="seo-tab-reports">
            {draft.kpis.map((item, index) => (
              <article key={item.id || `kpi-${index}`} className="b2b-panel">
                <div className="b2b-form-grid">
                  <Field label="KPI name">
                    <input className="crm-field" value={item.name} onChange={(event) => patchKpi(patch, draft, index, { name: event.target.value })} />
                  </Field>
                  <Field label="Period">
                    <input className="crm-field" value={item.period} onChange={(event) => patchKpi(patch, draft, index, { period: event.target.value })} />
                  </Field>
                  <Field label="Value">
                    <input className="crm-field" value={item.value} onChange={(event) => patchKpi(patch, draft, index, { value: event.target.value })} />
                  </Field>
                  <Field label="Definition">
                    <textarea className="crm-field" rows={2} value={item.definition} onChange={(event) => patchKpi(patch, draft, index, { definition: event.target.value })} />
                  </Field>
                  <Field label="Source">
                    <input className="crm-field" value={item.source} onChange={(event) => patchKpi(patch, draft, index, { source: event.target.value })} />
                  </Field>
                  <Field label="Data status">
                    <select className="crm-select" value={item.dataStatus} onChange={(event) => patchKpi(patch, draft, index, { dataStatus: event.target.value as SeoKpiView["dataStatus"] })}>
                      {SEO_KPI_DATA_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {SEO_KPI_DATA_STATUS_LABEL[status]}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Market">
                    <input className="crm-field" value={item.market} onChange={(event) => patchKpi(patch, draft, index, { market: event.target.value })} />
                  </Field>
                </div>
                <button type="button" className="crm-users-secondary" onClick={() => patch({ kpis: draft.kpis.filter((_, i) => i !== index) })}>
                  ลบ KPI
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ kpis: [...draft.kpis, emptyKpi()] })}>
              เพิ่ม KPI
            </button>
          </div>
        ) : null}

        {tab === "history" ? (
          <div role="tabpanel" id="seo-panel-history" aria-labelledby="seo-tab-history">
            {row?.history.length ? (
              <ul className="meta-ops-history seo-history">
                {row.history.map((item) => (
                  <li key={item.id}>
                    {formatDate(item.createdAt)} · {item.action} · {item.detail}
                    {item.createdByName ? ` — ${item.createdByName}` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="b2b-muted">ยังไม่มีประวัติการตรวจหรือแก้ไข</p>
            )}
          </div>
        ) : null}

        {saveBar}
        {draft.id && access.canEditBoard ? (
          <div className="ads-form-actions">
            <button type="button" className="crm-users-secondary" onClick={onEscalate} disabled={pending}>
              Escalate
            </button>
            <button type="button" className="crm-users-secondary" onClick={onCloseRecord} disabled={pending}>
              Close
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function patchAeo(patch: (next: Partial<SeoRecordDraft>) => void, draft: SeoRecordDraft, index: number, next: Partial<SeoAeoView>) {
  patch({ aeoQueries: draft.aeoQueries.map((item, i) => (i === index ? { ...item, ...next } : item)) });
}

function patchSource(patch: (next: Partial<SeoRecordDraft>) => void, draft: SeoRecordDraft, index: number, next: Partial<SeoSourceView>) {
  patch({ sources: draft.sources.map((item, i) => (i === index ? { ...item, ...next } : item)) });
}

function patchKpi(patch: (next: Partial<SeoRecordDraft>) => void, draft: SeoRecordDraft, index: number, next: Partial<SeoKpiView>) {
  patch({ kpis: draft.kpis.map((item, i) => (i === index ? { ...item, ...next } : item)) });
}
