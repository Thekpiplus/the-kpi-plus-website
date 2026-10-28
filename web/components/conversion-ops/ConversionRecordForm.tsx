"use client";

import { useState } from "react";
import { Field, SaveBar, toDateInput } from "@/components/b2b-ops/ui";
import {
  MASKED_VALUE,
  CONV_APPROVAL_LABEL,
  CONV_APPROVAL_STATUSES,
  CONV_BUDGET_STATUS_LABEL,
  CONV_BUDGET_STATUSES,
  CONV_DEFAULT_HANDOVER,
  CONV_DEFAULT_QA,
  CONV_DEPARTMENT_LABEL,
  CONV_DEPARTMENTS,
  CONV_FORM_TAB_LABEL,
  CONV_FORM_TABS,
  CONV_FRICTION_CATEGORIES,
  CONV_FRICTION_CATEGORY_LABEL,
  CONV_FUNNEL_LABEL,
  CONV_FUNNEL_STAGES,
  CONV_KPI_DATA_STATUS_LABEL,
  CONV_KPI_DATA_STATUSES,
  CONV_PRIORITIES,
  CONV_PRIORITY_LABEL,
  CONV_PROJECT_TYPE_LABEL,
  CONV_PROJECT_TYPES,
  CONV_READINESS,
  CONV_READINESS_LABEL,
  CONV_SEVERITIES,
  CONV_SEVERITY_LABEL,
  CONV_STATUS_LABEL,
  CONV_STATUSES,
  CONV_WORKSTREAM_LABEL,
  CONV_WORKSTREAMS,
  emptyEngineView,
  emptyFrictionItem,
  emptySectionBlock,
  webSectionFormTab,
  type ConvAccessView,
  type ConvApprovalStatus,
  type ConvApprovalView,
  type ConvBudgetStatus,
  type ConvChecklistItem,
  type ConvDecisionView,
  type ConvDepartment,
  type ConvEngineView,
  type ConvFileNote,
  type ConvFormTab,
  type ConvFrictionCategory,
  type ConvFrictionView,
  type ConvFunnelStage,
  type ConvKpiView,
  type ConvPriority,
  type ConvProjectRow,
  type ConvProjectType,
  type ConvReadiness,
  type ConvSection,
  type ConvSeverity,
  type ConvSectionBlock,
  type ConvSitemapPage,
  type ConvStatus,
  type ConvWorkstream,
} from "@/lib/conversion-ops/types";
import { ConversionSubtasksPanel, type ConvSubtaskDraft } from "./ConversionSubtasksPanel";
import type { ConvSubtaskView } from "@/lib/conversion-ops/types";

type Staff = { id: string; name: string };

export type ConvRecordDraft = {
  id: string;
  projectName: string;
  hotelName: string;
  currentUrl: string;
  bookingEngine: string;
  bookingEngineUrl: string;
  cmsType: string;
  projectType: ConvProjectType;
  primaryGoal: string;
  targetMarket: string;
  languages: string;
  startDate: string;
  launchDate: string;
  status: ConvStatus;
  ownerId: string;
  department: ConvDepartment;
  workstream: ConvWorkstream;
  priority: ConvPriority;
  nextAction: string;
  nextActionAt: string;
  notes: string;
  budgetStatus: ConvBudgetStatus;
  trackingStatus: ConvReadiness;
  analyticsStatus: ConvReadiness;
  engineTrackingStatus: ConvReadiness;
  primaryKpi: string;
  kpiTarget: string;
  hotelApprover: string;
  seoStatus: ConvReadiness;
  mobileStatus: ConvReadiness;
  handoverStatus: ConvReadiness;
  engineAccountRef: string;
  analyticsRef: string;
  cmsOwner: string;
  sourceCodeOwner: string;
  domainOwner: string;
  hostingOwner: string;
  analyticsOwner: string;
  bookingEngineOwner: string;
  discovery: ConvSectionBlock;
  sitemap: ConvSitemapPage[];
  sitemapNotes: string;
  ux: ConvSectionBlock;
  cms: ConvSectionBlock;
  booking: ConvSectionBlock;
  tracking: ConvSectionBlock;
  seo: ConvSectionBlock;
  qa: ConvChecklistItem[];
  handover: ConvChecklistItem[];
  friction: ConvFrictionView[];
  engine: ConvEngineView;
  fileNotes: ConvFileNote[];
  decisions: ConvDecisionView[];
  approvals: ConvApprovalView[];
  kpis: ConvKpiView[];
  sources: { id: string; name: string; url: string; publishedAt: string; accessedAt: string; notes: string }[];
};

function nid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyConvDraft(ownerId = "", workstream: ConvWorkstream = "project"): ConvRecordDraft {
  return {
    id: "",
    projectName: "",
    hotelName: "",
    currentUrl: "",
    bookingEngine: "",
    bookingEngineUrl: "",
    cmsType: "",
    projectType: "improve_existing",
    primaryGoal: "",
    targetMarket: "",
    languages: "th, en",
    startDate: "",
    launchDate: "",
    status: "draft",
    ownerId,
    department: "marketing",
    workstream,
    priority: "normal",
    nextAction: "",
    nextActionAt: "",
    notes: "",
    budgetStatus: "not_set",
    trackingStatus: "not_started",
    analyticsStatus: "not_started",
    engineTrackingStatus: "not_started",
    primaryKpi: "",
    kpiTarget: "",
    hotelApprover: "",
    seoStatus: "not_started",
    mobileStatus: "not_started",
    handoverStatus: "not_started",
    engineAccountRef: "",
    analyticsRef: "",
    cmsOwner: "",
    sourceCodeOwner: "",
    domainOwner: "",
    hostingOwner: "",
    analyticsOwner: "",
    bookingEngineOwner: "",
    discovery: emptySectionBlock(),
    sitemap: [],
    sitemapNotes: "",
    ux: emptySectionBlock(),
    cms: emptySectionBlock(),
    booking: emptySectionBlock(),
    tracking: emptySectionBlock(),
    seo: emptySectionBlock(),
    qa: CONV_DEFAULT_QA.map((label, index) => ({ id: `qa_${index + 1}`, label, status: "not_started", notes: "", owner: "" })),
    handover: CONV_DEFAULT_HANDOVER.map((label, index) => ({ id: `ho_${index + 1}`, label, status: "not_started", notes: "", owner: "" })),
    friction: [],
    engine: emptyEngineView(),
    fileNotes: [],
    decisions: [],
    approvals: [],
    kpis: [],
    sources: [],
  };
}

export function draftFromRow(row: ConvProjectRow): ConvRecordDraft {
  return {
    id: row.id,
    projectName: row.projectName,
    hotelName: row.hotelName,
    currentUrl: row.currentUrl,
    bookingEngine: row.bookingEngine,
    bookingEngineUrl: row.bookingEngineUrl,
    cmsType: row.cmsType,
    projectType: row.projectType,
    primaryGoal: row.primaryGoal,
    targetMarket: row.targetMarket,
    languages: row.languages,
    startDate: toDateInput(row.startDate),
    launchDate: toDateInput(row.launchDate),
    status: row.status,
    ownerId: row.ownerId,
    department: row.department,
    workstream: row.workstream,
    priority: row.priority,
    nextAction: row.nextAction,
    nextActionAt: toDateInput(row.nextActionAt),
    notes: row.notes,
    budgetStatus: row.budgetStatus,
    trackingStatus: row.trackingStatus,
    analyticsStatus: row.analyticsStatus,
    engineTrackingStatus: row.engineTrackingStatus,
    primaryKpi: row.primaryKpi,
    kpiTarget: row.kpiTarget,
    hotelApprover: row.hotelApprover,
    seoStatus: row.seoStatus,
    mobileStatus: row.mobileStatus,
    handoverStatus: row.handoverStatus,
    engineAccountRef: row.privateMasked ? MASKED_VALUE : row.engineAccountRef,
    analyticsRef: row.privateMasked ? MASKED_VALUE : row.analyticsRef,
    cmsOwner: row.cmsOwner,
    sourceCodeOwner: row.sourceCodeOwner,
    domainOwner: row.domainOwner,
    hostingOwner: row.hostingOwner,
    analyticsOwner: row.analyticsOwner,
    bookingEngineOwner: row.bookingEngineOwner,
    discovery: row.discovery,
    sitemap: row.sitemap,
    sitemapNotes: row.sitemapNotes,
    ux: row.ux,
    cms: row.cms,
    booking: row.booking,
    tracking: row.tracking,
    seo: row.seo,
    qa: row.qa,
    handover: row.handover,
    friction: row.friction,
    engine: row.engine,
    fileNotes: row.fileNotes,
    decisions: row.decisions,
    approvals: row.approvals,
    kpis: row.kpis,
    sources: row.sources,
  };
}

function formatDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}

function emptyCheck(label = ""): ConvChecklistItem {
  return { id: nid("chk"), label, status: "not_started", notes: "", owner: "" };
}

function ReadinessSelect({ value, onChange, label }: { value: ConvReadiness; onChange: (value: ConvReadiness) => void; label: string }) {
  return (
    <Field label={label}>
      <select className="crm-select" value={value} onChange={(event) => onChange(event.target.value as ConvReadiness)}>
        {CONV_READINESS.map((item) => (
          <option key={item} value={item}>
            {CONV_READINESS_LABEL[item]}
          </option>
        ))}
      </select>
    </Field>
  );
}

function ChecklistEditor({
  items,
  onChange,
  addLabel,
}: {
  items: ConvChecklistItem[];
  onChange: (items: ConvChecklistItem[]) => void;
  addLabel: string;
}) {
  return (
    <div className="web-ops-list">
      {items.map((item, index) => (
        <article key={item.id || index} className="web-ops-list-row">
          <input className="crm-field" value={item.label} placeholder="รายการ" onChange={(event) => onChange(items.map((row, i) => (i === index ? { ...row, label: event.target.value } : row)))} />
          <select className="crm-select" value={item.status} onChange={(event) => onChange(items.map((row, i) => (i === index ? { ...row, status: event.target.value as ConvReadiness } : row)))}>
            {CONV_READINESS.map((status) => (
              <option key={status} value={status}>
                {CONV_READINESS_LABEL[status]}
              </option>
            ))}
          </select>
          <input className="crm-field" value={item.owner} placeholder="ผู้รับผิดชอบ" onChange={(event) => onChange(items.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)))} />
          <input className="crm-field" value={item.notes} placeholder="บันทึก" onChange={(event) => onChange(items.map((row, i) => (i === index ? { ...row, notes: event.target.value } : row)))} />
          <div className="b2b-row-actions">
            <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => onChange(items.map((row, i) => (i === index - 1 ? items[index] : i === index ? items[index - 1] : row)))}>
              ขึ้น
            </button>
            <button type="button" className="crm-users-secondary" disabled={index === items.length - 1} onClick={() => onChange(items.map((row, i) => (i === index + 1 ? items[index] : i === index ? items[index + 1] : row)))}>
              ลง
            </button>
            <button type="button" className="crm-users-secondary" onClick={() => onChange(items.filter((_, i) => i !== index))}>
              ลบ
            </button>
          </div>
        </article>
      ))}
      <button type="button" className="kpi-button b2b-save" onClick={() => onChange([...items, emptyCheck()])}>
        {addLabel}
      </button>
    </div>
  );
}

function SectionEditor({
  value,
  onChange,
  addLabel,
}: {
  value: ConvSectionBlock;
  onChange: (value: ConvSectionBlock) => void;
  addLabel: string;
}) {
  return (
    <div className="b2b-form-grid">
      <Field label="สรุป">
        <textarea className="crm-area" rows={3} value={value.summary} onChange={(event) => onChange({ ...value, summary: event.target.value })} />
      </Field>
      <Field label="ผู้รับผิดชอบส่วนนี้">
        <input className="crm-field" value={value.owner} onChange={(event) => onChange({ ...value, owner: event.target.value })} />
      </Field>
      <ReadinessSelect value={value.status} onChange={(status) => onChange({ ...value, status })} label="สถานะส่วนนี้" />
      <Field label="บันทึก">
        <textarea className="crm-area" rows={3} value={value.notes} onChange={(event) => onChange({ ...value, notes: event.target.value })} />
      </Field>
      <div className="is-wide">
        <ChecklistEditor items={value.items} onChange={(items) => onChange({ ...value, items })} addLabel={addLabel} />
      </div>
    </div>
  );
}

export function ConversionRecordForm({
  draft,
  row,
  staff,
  access,
  section = "project",
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
  onDeleteSubtask,
  onEscalate,
  onCloseRecord,
}: {
  draft: ConvRecordDraft;
  row?: ConvProjectRow;
  staff: Staff[];
  access: ConvAccessView;
  section?: ConvSection;
  pending: boolean;
  ok: string;
  error: string;
  onChange: (draft: ConvRecordDraft) => void;
  onSave: () => void;
  onClose: () => void;
  subtaskDraft: ConvSubtaskDraft;
  subtaskComment: string;
  onSubtaskDraftChange: (draft: ConvSubtaskDraft) => void;
  onSubtaskCommentChange: (value: string) => void;
  onSaveSubtask: () => void;
  onCompleteSubtask: (item: ConvSubtaskView, completed: boolean) => void;
  onAddSubtaskComment: (subtaskId: string) => void;
  onAttachSubtaskFile: (subtaskId: string, form: HTMLFormElement) => void;
  onPatchSubtask: (item: ConvSubtaskView, patch: Partial<ConvSubtaskDraft>) => void;
  onDeleteSubtask: (item: ConvSubtaskView) => void;
  onEscalate?: () => void;
  onCloseRecord?: () => void;
}) {
  const [tab, setTab] = useState<ConvFormTab>(webSectionFormTab(section));
  const patch = (next: Partial<ConvRecordDraft>) => onChange({ ...draft, ...next });
  const saveBar = <SaveBar pending={pending} ok={ok} error={error} onSave={onSave} saveLabel={draft.id ? "บันทึก" : "สร้างโปรเจกต์"} />;
  const privateHint = access.canSeePrivateIds ? "เห็นได้เฉพาะผู้มีสิทธิ์รหัสภายใน" : "ถูกปกปิดตามสิทธิ์ — บันทึกจะไม่ทับค่าเดิมถ้าเป็น ••••";

  return (
    <div className="crm-modal ads-drawer" role="presentation">
      <button type="button" className="crm-modal-backdrop" aria-label="ปิดฟอร์ม" onClick={onClose} />
      <div className="crm-modal-panel crm-modal-panel-user web-ops-drawer" role="dialog" aria-modal="true" aria-labelledby="website-record-title">
        <div className="crm-modal-head">
          <div>
            <p className="crm-modal-eyebrow">Direct Booking Operations</p>
            <h2 id="website-record-title">{draft.id ? draft.projectName || draft.hotelName || "แก้ไขโปรเจกต์" : "โปรเจกต์ Direct Booking ใหม่"}</h2>
            <p className="b2b-muted">บันทึกด้วยตนเอง ไม่มีการนำเข้าข้อมูล และไม่แสดงบนหน้าสาธารณะ</p>
          </div>
          <button type="button" className="crm-users-secondary" onClick={onClose}>
            ปิด
          </button>
        </div>
        {saveBar}
        {draft.id && access.canEditBoard ? (
          <div className="b2b-row-actions">
            {onEscalate ? (
              <button type="button" className="crm-users-secondary" onClick={onEscalate}>
                Escalate
              </button>
            ) : null}
            {onCloseRecord ? (
              <button type="button" className="crm-users-secondary" onClick={onCloseRecord}>
                Close
              </button>
            ) : null}
          </div>
        ) : null}
        <div className="ads-form-tabs" role="tablist" aria-label="ส่วนของฟอร์ม Direct Booking">
          {CONV_FORM_TABS.map((item) => (
            <button
              key={item}
              id={`web-tab-${item}`}
              type="button"
              role="tab"
              aria-selected={tab === item}
              aria-controls={`web-panel-${item}`}
              tabIndex={tab === item ? 0 : -1}
              className={tab === item ? "is-active" : undefined}
              onClick={() => setTab(item)}
            >
              {CONV_FORM_TAB_LABEL[item]}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          <div className="b2b-form-grid" role="tabpanel" id="web-panel-overview" aria-labelledby="web-tab-overview">
            <Field label="ชื่อโปรเจกต์">
              <input className="crm-field" value={draft.projectName} onChange={(event) => patch({ projectName: event.target.value })} />
            </Field>
            <Field label="โรงแรม / ทรัพย์สิน">
              <input className="crm-field" value={draft.hotelName} onChange={(event) => patch({ hotelName: event.target.value })} />
            </Field>
            <Field label="Website URL">
              <input className="crm-field" value={draft.currentUrl} onChange={(event) => patch({ currentUrl: event.target.value })} />
            </Field>
            <Field label="Booking Engine URL">
              <input className="crm-field" value={draft.bookingEngineUrl} onChange={(event) => patch({ bookingEngineUrl: event.target.value })} />
            </Field>
            <Field label="ระบบจอง / Booking Engine">
              <input className="crm-field" value={draft.bookingEngine} onChange={(event) => patch({ bookingEngine: event.target.value })} />
            </Field>
            <Field label="CMS ปัจจุบัน">
              <input className="crm-field" value={draft.cmsType} onChange={(event) => patch({ cmsType: event.target.value })} />
            </Field>
            <Field label="ประเภทงาน">
              <select className="crm-select" value={draft.projectType} onChange={(event) => patch({ projectType: event.target.value as ConvProjectType })}>
                {CONV_PROJECT_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {CONV_PROJECT_TYPE_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="เป้าหมายหลัก">
              <input className="crm-field" value={draft.primaryGoal} onChange={(event) => patch({ primaryGoal: event.target.value })} />
            </Field>
            <Field label="ตลาดเป้าหมาย">
              <input className="crm-field" value={draft.targetMarket} onChange={(event) => patch({ targetMarket: event.target.value })} />
            </Field>
            <Field label="ภาษา">
              <input className="crm-field" value={draft.languages} onChange={(event) => patch({ languages: event.target.value })} />
            </Field>
            <Field label="วันเริ่ม">
              <input className="crm-field" type="date" value={draft.startDate} onChange={(event) => patch({ startDate: event.target.value })} />
            </Field>
            <Field label="Target review date">
              <input className="crm-field" type="date" value={draft.launchDate} onChange={(event) => patch({ launchDate: event.target.value })} />
            </Field>
            <Field label="สถานะ">
              <select className="crm-select" value={draft.status} onChange={(event) => patch({ status: event.target.value as ConvStatus })}>
                {CONV_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {CONV_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ผู้รับผิดชอบ">
              <select className="crm-select" value={draft.ownerId} onChange={(event) => patch({ ownerId: event.target.value })}>
                <option value="">ยังไม่มอบหมาย</option>
                {staff.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="แผนก">
              <select className="crm-select" value={draft.department} onChange={(event) => patch({ department: event.target.value as ConvDepartment })}>
                {CONV_DEPARTMENTS.map((item) => (
                  <option key={item} value={item}>
                    {CONV_DEPARTMENT_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="สายงาน">
              <select className="crm-select" value={draft.workstream} onChange={(event) => patch({ workstream: event.target.value as ConvWorkstream })}>
                {CONV_WORKSTREAMS.map((item) => (
                  <option key={item} value={item}>
                    {CONV_WORKSTREAM_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ความสำคัญ">
              <select className="crm-select" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as ConvPriority })}>
                {CONV_PRIORITIES.map((item) => (
                  <option key={item} value={item}>
                    {CONV_PRIORITY_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="สถานะงบ">
              <select className="crm-select" value={draft.budgetStatus} onChange={(event) => patch({ budgetStatus: event.target.value as ConvBudgetStatus })}>
                {CONV_BUDGET_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {CONV_BUDGET_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <ReadinessSelect value={draft.analyticsStatus} onChange={(analyticsStatus) => patch({ analyticsStatus, trackingStatus: analyticsStatus })} label="Analytics status" />
            <ReadinessSelect value={draft.engineTrackingStatus} onChange={(engineTrackingStatus) => patch({ engineTrackingStatus })} label="Booking Engine tracking status" />
            <ReadinessSelect value={draft.mobileStatus} onChange={(mobileStatus) => patch({ mobileStatus })} label="Mobile status" />
            <ReadinessSelect value={draft.handoverStatus} onChange={(handoverStatus) => patch({ handoverStatus })} label="Handover status" />
            <Field label="Primary KPI">
              <input className="crm-field" value={draft.primaryKpi} onChange={(event) => patch({ primaryKpi: event.target.value })} />
            </Field>
            <Field label="KPI target">
              <input className="crm-field" value={draft.kpiTarget} onChange={(event) => patch({ kpiTarget: event.target.value })} />
            </Field>
            <Field label="Hotel approver">
              <input className="crm-field" value={draft.hotelApprover} onChange={(event) => patch({ hotelApprover: event.target.value })} />
            </Field>
            <Field label="Next action">
              <input className="crm-field" value={draft.nextAction} onChange={(event) => patch({ nextAction: event.target.value })} />
            </Field>
            <Field label="วันที่ Next action">
              <input className="crm-field" type="date" value={draft.nextActionAt} onChange={(event) => patch({ nextActionAt: event.target.value })} />
            </Field>
            <div className="is-wide">
              <Field label="Notes">
                <textarea className="crm-area" rows={3} value={draft.notes} onChange={(event) => patch({ notes: event.target.value })} />
              </Field>
            </div>
            <Field label="สร้างเมื่อ">
              <input className="crm-field" value={row ? formatDate(row.createdAt) : "บันทึกแล้วจึงมีวันที่"} readOnly />
            </Field>
            <Field label="อัปเดตล่าสุด">
              <input className="crm-field" value={row ? formatDate(row.updatedAt) : "—"} readOnly />
            </Field>
            <div className="is-wide">
              <h3>งานย่อย</h3>
              <ConversionSubtasksPanel
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
                onDelete={onDeleteSubtask}
              />
            </div>
          </div>
        ) : null}

        {tab === "website" ? (
          <div role="tabpanel" id="web-panel-website" aria-labelledby="web-tab-website">
            <h3>Website Review</h3>
            <SectionEditor value={draft.discovery} onChange={(discovery) => patch({ discovery })} addLabel="เพิ่มรายการ Website Review" />
            <h3>Mobile UX</h3>
            <SectionEditor value={draft.ux} onChange={(ux) => patch({ ux, mobileStatus: ux.status })} addLabel="เพิ่มประเด็น Mobile UX" />
          </div>
        ) : null}

        {tab === "room" ? (
          <div role="tabpanel" id="web-panel-room" aria-labelledby="web-tab-room">
            <h3>Room / Offer</h3>
            <SectionEditor value={draft.cms} onChange={(cms) => patch({ cms })} addLabel="เพิ่มรายการห้องพัก / ข้อเสนอ" />
            <h3>Price / Policy</h3>
            <SectionEditor value={draft.seo} onChange={(seo) => patch({ seo, seoStatus: seo.status })} addLabel="เพิ่มรายการราคา / นโยบาย" />
            <Field label="บันทึกหน้าห้องพัก">
              <textarea className="crm-area" rows={3} value={draft.sitemapNotes} onChange={(event) => patch({ sitemapNotes: event.target.value })} />
            </Field>
            <div className="web-ops-list">
              {draft.sitemap.map((item, index) => (
                <article key={item.id || index} className="web-ops-list-row">
                  <input className="crm-field" value={item.name} placeholder="หน้า / ประเภทห้อง" onChange={(event) => patch({ sitemap: draft.sitemap.map((row, i) => (i === index ? { ...row, name: event.target.value } : row)) })} />
                  <input className="crm-field" value={item.parent} placeholder="กลุ่ม" onChange={(event) => patch({ sitemap: draft.sitemap.map((row, i) => (i === index ? { ...row, parent: event.target.value } : row)) })} />
                  <input className="crm-field" value={item.purpose} placeholder="ข้อเสนอ / นโยบาย" onChange={(event) => patch({ sitemap: draft.sitemap.map((row, i) => (i === index ? { ...row, purpose: event.target.value } : row)) })} />
                  <select className="crm-select" value={item.status} onChange={(event) => patch({ sitemap: draft.sitemap.map((row, i) => (i === index ? { ...row, status: event.target.value as ConvReadiness } : row)) })}>
                    {CONV_READINESS.map((status) => (
                      <option key={status} value={status}>
                        {CONV_READINESS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="crm-users-secondary" onClick={() => patch({ sitemap: draft.sitemap.filter((_, i) => i !== index) })}>
                    ลบ
                  </button>
                </article>
              ))}
              <button type="button" className="kpi-button b2b-save" onClick={() => patch({ sitemap: [...draft.sitemap, { id: nid("sm"), name: "", parent: "", purpose: "", status: "not_started" }] })}>
                เพิ่มหน้าห้องพัก / ข้อเสนอ
              </button>
            </div>
          </div>
        ) : null}

        {tab === "friction" ? (
          <div className="web-ops-list" role="tabpanel" id="web-panel-friction" aria-labelledby="web-tab-friction">
            {draft.friction.map((item, index) => (
              <article key={item.id || index} className="web-ops-list-row">
                <input className="crm-field" value={item.title} placeholder="Friction point" onChange={(event) => patch({ friction: draft.friction.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)) })} />
                <select className="crm-select" value={item.funnelStage} onChange={(event) => patch({ friction: draft.friction.map((row, i) => (i === index ? { ...row, funnelStage: event.target.value as ConvFunnelStage } : row)) })}>
                  {CONV_FUNNEL_STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {CONV_FUNNEL_LABEL[stage]}
                    </option>
                  ))}
                </select>
                <select className="crm-select" value={item.category} onChange={(event) => patch({ friction: draft.friction.map((row, i) => (i === index ? { ...row, category: event.target.value as ConvFrictionCategory } : row)) })}>
                  {CONV_FRICTION_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {CONV_FRICTION_CATEGORY_LABEL[category]}
                    </option>
                  ))}
                </select>
                <select className="crm-select" value={item.severity} onChange={(event) => patch({ friction: draft.friction.map((row, i) => (i === index ? { ...row, severity: event.target.value as ConvSeverity } : row)) })}>
                  {CONV_SEVERITIES.map((severity) => (
                    <option key={severity} value={severity}>
                      {CONV_SEVERITY_LABEL[severity]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.evidence} placeholder="Evidence URL / screenshot ref" onChange={(event) => patch({ friction: draft.friction.map((row, i) => (i === index ? { ...row, evidence: event.target.value } : row)) })} />
                <select className="crm-select" value={item.status} onChange={(event) => patch({ friction: draft.friction.map((row, i) => (i === index ? { ...row, status: event.target.value as ConvReadiness } : row)) })}>
                  {CONV_READINESS.map((status) => (
                    <option key={status} value={status}>
                      {CONV_READINESS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.recommendedAction} placeholder="Recommended action" onChange={(event) => patch({ friction: draft.friction.map((row, i) => (i === index ? { ...row, recommendedAction: event.target.value } : row)) })} />
                <input className="crm-field" value={item.owner} placeholder="Owner" onChange={(event) => patch({ friction: draft.friction.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                <select className="crm-select" value={item.department} onChange={(event) => patch({ friction: draft.friction.map((row, i) => (i === index ? { ...row, department: event.target.value as ConvDepartment | "" } : row)) })}>
                  <option value="">แผนก</option>
                  {CONV_DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {CONV_DEPARTMENT_LABEL[department]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" type="date" value={item.dueAt} onChange={(event) => patch({ friction: draft.friction.map((row, i) => (i === index ? { ...row, dueAt: event.target.value } : row)) })} />
                <select className="crm-select" value={item.approvalStatus} onChange={(event) => patch({ friction: draft.friction.map((row, i) => (i === index ? { ...row, approvalStatus: event.target.value as ConvApprovalStatus } : row)) })}>
                  {CONV_APPROVAL_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {CONV_APPROVAL_LABEL[status]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.measurementEvent} placeholder="Measurement event" onChange={(event) => patch({ friction: draft.friction.map((row, i) => (i === index ? { ...row, measurementEvent: event.target.value } : row)) })} />
                <input className="crm-field" value={item.beforeValue} placeholder="Before value" onChange={(event) => patch({ friction: draft.friction.map((row, i) => (i === index ? { ...row, beforeValue: event.target.value } : row)) })} />
                <input className="crm-field" value={item.afterValue} placeholder="After value" onChange={(event) => patch({ friction: draft.friction.map((row, i) => (i === index ? { ...row, afterValue: event.target.value } : row)) })} />
                <input className="crm-field" value={item.notes} placeholder="Notes" onChange={(event) => patch({ friction: draft.friction.map((row, i) => (i === index ? { ...row, notes: event.target.value } : row)) })} />
                <button type="button" className="crm-users-secondary" onClick={() => patch({ friction: draft.friction.filter((_, i) => i !== index) })}>
                  ลบ
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ friction: [...draft.friction, emptyFrictionItem(draft.department)] })}>
              เพิ่ม Friction
            </button>
          </div>
        ) : null}

        {tab === "booking" ? (
          <div role="tabpanel" id="web-panel-booking" aria-labelledby="web-tab-booking">
            <div className="b2b-form-grid">
              <Field label="Provider">
                <input className="crm-field" value={draft.engine.provider || draft.bookingEngine} onChange={(event) => patch({ engine: { ...draft.engine, provider: event.target.value }, bookingEngine: event.target.value })} />
              </Field>
              <Field label="Booking URL">
                <input className="crm-field" value={draft.engine.bookingUrl || draft.bookingEngineUrl} onChange={(event) => patch({ engine: { ...draft.engine, bookingUrl: event.target.value }, bookingEngineUrl: event.target.value })} />
              </Field>
              <Field label="Supported languages">
                <input className="crm-field" value={draft.engine.languages || draft.languages} onChange={(event) => patch({ engine: { ...draft.engine, languages: event.target.value } })} />
              </Field>
              <ReadinessSelect value={draft.engine.mobileStatus} onChange={(mobileStatus) => patch({ engine: { ...draft.engine, mobileStatus } })} label="Mobile status" />
              <ReadinessSelect value={draft.engine.rateStatus} onChange={(rateStatus) => patch({ engine: { ...draft.engine, rateStatus } })} label="Rate / availability status" />
              <ReadinessSelect value={draft.engine.handoffStatus} onChange={(handoffStatus) => patch({ engine: { ...draft.engine, handoffStatus } })} label="Website handoff status" />
              <ReadinessSelect value={draft.engine.callbackStatus} onChange={(callbackStatus) => patch({ engine: { ...draft.engine, callbackStatus } })} label="Callback / API / event status" />
              <ReadinessSelect value={draft.engine.confirmationStatus} onChange={(confirmationStatus) => patch({ engine: { ...draft.engine, confirmationStatus } })} label="Confirmation status" />
              <Field label="Owner">
                <input className="crm-field" value={draft.engine.owner || draft.bookingEngineOwner} onChange={(event) => patch({ engine: { ...draft.engine, owner: event.target.value }, bookingEngineOwner: event.target.value })} />
              </Field>
              <ReadinessSelect value={draft.engine.accessStatus} onChange={(accessStatus) => patch({ engine: { ...draft.engine, accessStatus } })} label="Access / permission status" />
              <Field label={`รหัสบัญชีระบบจอง (${privateHint})`}>
                <input className="crm-field" value={draft.engineAccountRef} onChange={(event) => patch({ engineAccountRef: event.target.value })} autoComplete="off" />
              </Field>
              <Field label="Notes">
                <textarea className="crm-area" rows={3} value={draft.engine.notes} onChange={(event) => patch({ engine: { ...draft.engine, notes: event.target.value } })} />
              </Field>
            </div>
            <SectionEditor value={draft.booking} onChange={(booking) => patch({ booking })} addLabel="เพิ่มรายการ Booking Engine" />
          </div>
        ) : null}

        {tab === "tracking" ? (
          <div role="tabpanel" id="web-panel-tracking" aria-labelledby="web-tab-tracking">
            <div className="b2b-form-grid">
              <Field label={`รหัส Analytics (${privateHint})`}>
                <input className="crm-field" value={draft.analyticsRef} onChange={(event) => patch({ analyticsRef: event.target.value })} autoComplete="off" />
              </Field>
              <Field label="เจ้าของ Analytics">
                <input className="crm-field" value={draft.analyticsOwner} onChange={(event) => patch({ analyticsOwner: event.target.value })} />
              </Field>
              <ReadinessSelect value={draft.analyticsStatus} onChange={(analyticsStatus) => patch({ analyticsStatus, trackingStatus: analyticsStatus })} label="Analytics status" />
              <ReadinessSelect value={draft.engineTrackingStatus} onChange={(engineTrackingStatus) => patch({ engineTrackingStatus })} label="Booking Engine tracking status" />
            </div>
            <SectionEditor value={draft.tracking} onChange={(tracking) => patch({ tracking })} addLabel="เพิ่มอีเวนต์ / การวัด" />
          </div>
        ) : null}

        {tab === "experiments" ? (
          <div role="tabpanel" id="web-panel-experiments" aria-labelledby="web-tab-experiments">
            <h3>Experiments / Changes</h3>
            <ChecklistEditor items={draft.qa} onChange={(qa) => patch({ qa })} addLabel="เพิ่มการทดลอง / การเปลี่ยนแปลง" />
            <h3>การตัดสินใจ</h3>
            <div className="web-ops-list">
              {draft.decisions.map((item, index) => (
                <article key={item.id || index} className="web-ops-list-row">
                  <input className="crm-field" value={item.title} placeholder="หัวข้อ" onChange={(event) => patch({ decisions: draft.decisions.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)) })} />
                  <input className="crm-field" value={item.decision} placeholder="มติ" onChange={(event) => patch({ decisions: draft.decisions.map((row, i) => (i === index ? { ...row, decision: event.target.value } : row)) })} />
                  <input className="crm-field" value={item.owner} placeholder="เจ้าของมติ" onChange={(event) => patch({ decisions: draft.decisions.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                  <button type="button" className="crm-users-secondary" onClick={() => patch({ decisions: draft.decisions.filter((_, i) => i !== index) })}>
                    ลบ
                  </button>
                </article>
              ))}
              <button type="button" className="kpi-button b2b-save" onClick={() => patch({ decisions: [...draft.decisions, { id: nid("dec"), title: "", decision: "", owner: "", status: "not_started", notes: "" }] })}>
                เพิ่มการตัดสินใจ
              </button>
            </div>
          </div>
        ) : null}

        {tab === "handover" ? (
          <div role="tabpanel" id="web-panel-handover" aria-labelledby="web-tab-handover">
            <div className="b2b-form-grid">
              <Field label="เจ้าของ CMS / เว็บไซต์">
                <input className="crm-field" value={draft.cmsOwner} onChange={(event) => patch({ cmsOwner: event.target.value })} />
              </Field>
              <Field label="เจ้าของซอร์สโค้ด">
                <input className="crm-field" value={draft.sourceCodeOwner} onChange={(event) => patch({ sourceCodeOwner: event.target.value })} />
              </Field>
              <Field label="เจ้าของโดเมน">
                <input className="crm-field" value={draft.domainOwner} onChange={(event) => patch({ domainOwner: event.target.value })} />
              </Field>
              <Field label="เจ้าของโฮสต์">
                <input className="crm-field" value={draft.hostingOwner} onChange={(event) => patch({ hostingOwner: event.target.value })} />
              </Field>
              <Field label="เจ้าของ Analytics">
                <input className="crm-field" value={draft.analyticsOwner} onChange={(event) => patch({ analyticsOwner: event.target.value })} />
              </Field>
              <Field label="เจ้าของ Booking Engine">
                <input className="crm-field" value={draft.bookingEngineOwner} onChange={(event) => patch({ bookingEngineOwner: event.target.value })} />
              </Field>
            </div>
            <ChecklistEditor items={draft.handover} onChange={(handover) => patch({ handover, handoverStatus: handover[0]?.status || draft.handoverStatus })} addLabel="เพิ่มรายการส่งมอบ" />
          </div>
        ) : null}

        {tab === "reports" ? (
          <div className="web-ops-list" role="tabpanel" id="web-panel-reports" aria-labelledby="web-tab-reports">
            {draft.kpis.map((item, index) => (
              <article key={item.id || index} className="web-ops-list-row">
                <input className="crm-field" value={item.name} placeholder="KPI" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, name: event.target.value } : row)) })} />
                <input className="crm-field" value={item.value} placeholder="ค่า" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, value: event.target.value } : row)) })} />
                <input className="crm-field" value={item.period} placeholder="ช่วงเวลา" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, period: event.target.value } : row)) })} />
                <input className="crm-field" value={item.definition} placeholder="นิยาม" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, definition: event.target.value } : row)) })} />
                <input className="crm-field" value={item.source} placeholder="แหล่งที่มา" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, source: event.target.value } : row)) })} />
                <input className="crm-field" value={item.market} placeholder="ตลาด" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, market: event.target.value } : row)) })} />
                <select
                  className="crm-select"
                  value={item.dataStatus}
                  onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, dataStatus: event.target.value as ConvKpiView["dataStatus"] } : row)) })}
                >
                  {CONV_KPI_DATA_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {CONV_KPI_DATA_STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <button type="button" className="crm-users-secondary" onClick={() => patch({ kpis: draft.kpis.filter((_, i) => i !== index) })}>
                  ลบ
                </button>
              </article>
            ))}
            <button
              type="button"
              className="kpi-button b2b-save"
              onClick={() => patch({ kpis: [...draft.kpis, { id: nid("kpi"), name: "", period: "", value: "", definition: "", source: "", dataStatus: "draft", market: "" }] })}
            >
              เพิ่ม KPI
            </button>
          </div>
        ) : null}

        {tab === "approvals" ? (
          <div role="tabpanel" id="web-panel-approvals" aria-labelledby="web-tab-approvals">
            <Field label="Hotel approver">
              <input className="crm-field" value={draft.hotelApprover} onChange={(event) => patch({ hotelApprover: event.target.value })} />
            </Field>
            <div className="web-ops-list">
              {draft.approvals.map((item, index) => (
                <article key={item.id || index} className="web-ops-list-row">
                  <input className="crm-field" value={item.kind} placeholder="ประเภทการอนุมัติ" onChange={(event) => patch({ approvals: draft.approvals.map((row, i) => (i === index ? { ...row, kind: event.target.value } : row)) })} />
                  <select className="crm-select" value={item.status} onChange={(event) => patch({ approvals: draft.approvals.map((row, i) => (i === index ? { ...row, status: event.target.value as ConvApprovalStatus } : row)) })}>
                    {CONV_APPROVAL_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {CONV_APPROVAL_LABEL[status]}
                      </option>
                    ))}
                  </select>
                  <input className="crm-field" value={item.notes} placeholder="บันทึก" onChange={(event) => patch({ approvals: draft.approvals.map((row, i) => (i === index ? { ...row, notes: event.target.value } : row)) })} />
                  <button type="button" className="crm-users-secondary" onClick={() => patch({ approvals: draft.approvals.filter((_, i) => i !== index) })}>
                    ลบ
                  </button>
                </article>
              ))}
              <button
                type="button"
                className="kpi-button b2b-save"
                onClick={() => patch({ approvals: [...draft.approvals, { id: nid("ap"), kind: "", status: "not_requested", notes: "", requestedBy: "", decidedBy: "", createdAt: new Date().toISOString() }] })}
              >
                เพิ่มการอนุมัติ
              </button>
            </div>
          </div>
        ) : null}

        {tab === "files" ? (
          <div role="tabpanel" id="web-panel-files" aria-labelledby="web-tab-files">
            <Field label="บันทึกภายใน">
              <textarea className="crm-area" rows={4} value={draft.notes} onChange={(event) => patch({ notes: event.target.value })} />
            </Field>
            <div className="web-ops-list">
              {draft.fileNotes.map((item, index) => (
                <article key={item.id || index} className="web-ops-list-row">
                  <input className="crm-field" value={item.name} placeholder="ชื่อไฟล์ / เอกสาร" onChange={(event) => patch({ fileNotes: draft.fileNotes.map((row, i) => (i === index ? { ...row, name: event.target.value } : row)) })} />
                  <input className="crm-field" value={item.caption} placeholder="คำอธิบาย" onChange={(event) => patch({ fileNotes: draft.fileNotes.map((row, i) => (i === index ? { ...row, caption: event.target.value } : row)) })} />
                  <select className="crm-select" value={item.status} onChange={(event) => patch({ fileNotes: draft.fileNotes.map((row, i) => (i === index ? { ...row, status: event.target.value as ConvReadiness } : row)) })}>
                    {CONV_READINESS.map((status) => (
                      <option key={status} value={status}>
                        {CONV_READINESS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="crm-users-secondary" onClick={() => patch({ fileNotes: draft.fileNotes.filter((_, i) => i !== index) })}>
                    ลบ
                  </button>
                </article>
              ))}
              <button type="button" className="kpi-button b2b-save" onClick={() => patch({ fileNotes: [...draft.fileNotes, { id: nid("fn"), name: "", caption: "", status: "not_started" }] })}>
                เพิ่มบันทึกไฟล์
              </button>
            </div>
          </div>
        ) : null}

        {tab === "history" ? (
          <ul className="meta-ops-history seo-history" role="tabpanel" id="web-panel-history" aria-labelledby="web-tab-history">
            {row?.history.length ? (
              row.history.map((item) => (
                <li key={item.id}>
                  {formatDate(item.createdAt)} · {item.createdByName || "—"} · {item.action} · {item.detail}
                </li>
              ))
            ) : (
              <li>ยังไม่มีประวัติ — ประวัติจะถูกบันทึกเมื่อกดบันทึก</li>
            )}
          </ul>
        ) : null}

        {saveBar}
      </div>
    </div>
  );
}
