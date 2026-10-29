"use client";

import { useState } from "react";
import { Field, SaveBar, toDateInput } from "@/components/b2b-ops/ui";
import {
  MGMT_APPROVAL_LABEL,
  MGMT_APPROVAL_STATUSES,
  MGMT_ASSESSMENT_AREA_LABEL,
  MGMT_ASSESSMENT_AREAS,
  MGMT_CADENCE_LABEL,
  MGMT_CADENCES,
  MGMT_DEFAULT_HANDOVER,
  MGMT_DEFAULT_QA,
  MGMT_DEPARTMENT_LABEL,
  MGMT_DEPARTMENTS,
  MGMT_FORM_TAB_LABEL,
  MGMT_FORM_TABS,
  MGMT_HOTEL_STATUS_LABEL,
  MGMT_HOTEL_STATUSES,
  MGMT_KPI_AREA_LABEL,
  MGMT_KPI_AREAS,
  MGMT_KPI_DATA_STATUS_LABEL,
  MGMT_KPI_DATA_STATUSES,
  MGMT_PLAN_PHASE_LABEL,
  MGMT_PLAN_PHASES,
  MGMT_PRIORITIES,
  MGMT_PRIORITY_LABEL,
  MGMT_PROJECT_TYPE_LABEL,
  MGMT_PROJECT_TYPES,
  MGMT_READINESS,
  MGMT_READINESS_LABEL,
  MGMT_STATUS_LABEL,
  MGMT_STATUSES,
  MGMT_SUBTASK_STATUS_LABEL,
  MGMT_SUBTASK_STATUSES,
  MGMT_WORKSTREAM_LABEL,
  MGMT_WORKSTREAMS,
  emptyActionLog,
  emptyAssessment,
  emptyKpi,
  emptyMeeting,
  emptyPeopleRole,
  emptyPlan,
  emptySectionBlock,
  webSectionFormTab,
  type MgmtAccessView,
  type MgmtActionLogView,
  type MgmtApprovalStatus,
  type MgmtApprovalView,
  type MgmtAssessmentView,
  type MgmtCadence,
  type MgmtChecklistItem,
  type MgmtDepartment,
  type MgmtFileNote,
  type MgmtFormTab,
  type MgmtHotelStatus,
  type MgmtKpiDataStatus,
  type MgmtKpiView,
  type MgmtMeetingView,
  type MgmtPeopleRoleView,
  type MgmtPlanView,
  type MgmtPriority,
  type MgmtProjectRow,
  type MgmtProjectType,
  type MgmtReadiness,
  type MgmtSection,
  type MgmtSectionBlock,
  type MgmtStatus,
  type MgmtSubtaskStatus,
  type MgmtWorkstream,
} from "@/lib/management-ops/types";
import { ManagementSubtasksPanel, type MgmtSubtaskDraft } from "./ManagementSubtasksPanel";
import type { MgmtSubtaskView } from "@/lib/management-ops/types";

type Staff = { id: string; name: string };

export type MgmtRecordDraft = {
  id: string;
  projectName: string;
  hotelName: string;
  propertyType: MgmtProjectType;
  roomCount: string;
  locationMarket: string;
  hotelStatus: MgmtHotelStatus;
  primaryGoal: string;
  mainChallenge: string;
  startDate: string;
  launchDate: string;
  status: MgmtStatus;
  ownerId: string;
  department: MgmtDepartment;
  workstream: MgmtWorkstream;
  priority: MgmtPriority;
  scope: string;
  hotelApprover: string;
  nextAction: string;
  nextActionAt: string;
  kpiCadence: MgmtCadence;
  dataStatus: MgmtKpiDataStatus;
  notes: string;
  primaryKpi: string;
  kpiTarget: string;
  handoverStatus: MgmtReadiness;
  commercial: MgmtSectionBlock;
  marketingBlock: MgmtSectionBlock;
  distributionBlock: MgmtSectionBlock;
  operations: MgmtSectionBlock;
  guest: MgmtSectionBlock;
  people: MgmtPeopleRoleView[];
  assessments: MgmtAssessmentView[];
  plans: MgmtPlanView[];
  meetings: MgmtMeetingView[];
  actionLogs: MgmtActionLogView[];
  qa: MgmtChecklistItem[];
  handover: MgmtChecklistItem[];
  fileNotes: MgmtFileNote[];
  approvals: MgmtApprovalView[];
  kpis: MgmtKpiView[];
};

function nid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyMgmtDraft(ownerId = "", workstream: MgmtWorkstream = "properties"): MgmtRecordDraft {
  return {
    id: "",
    projectName: "",
    hotelName: "",
    propertyType: "independent",
    roomCount: "",
    locationMarket: "",
    hotelStatus: "operating",
    primaryGoal: "",
    mainChallenge: "",
    startDate: "",
    launchDate: "",
    status: "draft",
    ownerId,
    department: "marketing",
    workstream,
    priority: "normal",
    scope: "",
    hotelApprover: "",
    nextAction: "",
    nextActionAt: "",
    kpiCadence: "monthly",
    dataStatus: "pending",
    notes: "",
    primaryKpi: "",
    kpiTarget: "",
    handoverStatus: "not_started",
    commercial: emptySectionBlock(),
    marketingBlock: emptySectionBlock(),
    distributionBlock: emptySectionBlock(),
    operations: emptySectionBlock(),
    guest: emptySectionBlock(),
    people: [],
    assessments: [],
    plans: [],
    meetings: [],
    actionLogs: [],
    qa: MGMT_DEFAULT_QA.map((label, index) => ({ id: `qa_${index + 1}`, label, status: "not_started", notes: "", owner: "" })),
    handover: MGMT_DEFAULT_HANDOVER.map((label, index) => ({ id: `ho_${index + 1}`, label, status: "not_started", notes: "", owner: "" })),
    fileNotes: [],
    approvals: [],
    kpis: [],
  };
}

export function draftFromRow(row: MgmtProjectRow): MgmtRecordDraft {
  return {
    id: row.id,
    projectName: row.projectName,
    hotelName: row.hotelName,
    propertyType: row.propertyType,
    roomCount: row.roomCount,
    locationMarket: row.locationMarket,
    hotelStatus: row.hotelStatus,
    primaryGoal: row.primaryGoal,
    mainChallenge: row.mainChallenge,
    startDate: toDateInput(row.startDate),
    launchDate: toDateInput(row.launchDate),
    status: row.status,
    ownerId: row.ownerId,
    department: row.department,
    workstream: row.workstream,
    priority: row.priority,
    scope: row.scope,
    hotelApprover: row.hotelApprover,
    nextAction: row.nextAction,
    nextActionAt: toDateInput(row.nextActionAt),
    kpiCadence: row.kpiCadence,
    dataStatus: row.dataStatus,
    notes: row.notes,
    primaryKpi: row.primaryKpi,
    kpiTarget: row.kpiTarget,
    handoverStatus: row.handoverStatus,
    commercial: row.commercial,
    marketingBlock: row.marketingBlock,
    distributionBlock: row.distributionBlock,
    operations: row.operations,
    guest: row.guest,
    people: row.people,
    assessments: row.assessments,
    plans: row.plans,
    meetings: row.meetings,
    actionLogs: row.actionLogs,
    qa: row.qa,
    handover: row.handover,
    fileNotes: row.fileNotes,
    approvals: row.approvals,
    kpis: row.kpis,
  };
}

function formatDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}

function emptyCheck(label = ""): MgmtChecklistItem {
  return { id: nid("chk"), label, status: "not_started", notes: "", owner: "" };
}

function ReadinessSelect({ value, onChange, label }: { value: MgmtReadiness; onChange: (value: MgmtReadiness) => void; label: string }) {
  return (
    <Field label={label}>
      <select className="crm-select" value={value} onChange={(event) => onChange(event.target.value as MgmtReadiness)}>
        {MGMT_READINESS.map((item) => (
          <option key={item} value={item}>
            {MGMT_READINESS_LABEL[item]}
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
  items: MgmtChecklistItem[];
  onChange: (items: MgmtChecklistItem[]) => void;
  addLabel: string;
}) {
  return (
    <div className="web-ops-list">
      {items.map((item, index) => (
        <article key={item.id || index} className="web-ops-list-row">
          <input className="crm-field" value={item.label} placeholder="รายการ" onChange={(event) => onChange(items.map((row, i) => (i === index ? { ...row, label: event.target.value } : row)))} />
          <select className="crm-select" value={item.status} onChange={(event) => onChange(items.map((row, i) => (i === index ? { ...row, status: event.target.value as MgmtReadiness } : row)))}>
            {MGMT_READINESS.map((status) => (
              <option key={status} value={status}>
                {MGMT_READINESS_LABEL[status]}
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
  value: MgmtSectionBlock;
  onChange: (value: MgmtSectionBlock) => void;
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

export function ManagementRecordForm({
  draft,
  row,
  staff,
  access,
  section = "properties",
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
  draft: MgmtRecordDraft;
  row?: MgmtProjectRow;
  staff: Staff[];
  access: MgmtAccessView;
  section?: MgmtSection;
  pending: boolean;
  ok: string;
  error: string;
  onChange: (draft: MgmtRecordDraft) => void;
  onSave: () => void;
  onClose: () => void;
  subtaskDraft: MgmtSubtaskDraft;
  subtaskComment: string;
  onSubtaskDraftChange: (draft: MgmtSubtaskDraft) => void;
  onSubtaskCommentChange: (value: string) => void;
  onSaveSubtask: () => void;
  onCompleteSubtask: (item: MgmtSubtaskView, completed: boolean) => void;
  onAddSubtaskComment: (subtaskId: string) => void;
  onAttachSubtaskFile: (subtaskId: string, form: HTMLFormElement) => void;
  onPatchSubtask: (item: MgmtSubtaskView, patch: Partial<MgmtSubtaskDraft>) => void;
  onDeleteSubtask: (item: MgmtSubtaskView) => void;
  onEscalate?: () => void;
  onCloseRecord?: () => void;
}) {
  const [tab, setTab] = useState<MgmtFormTab>(webSectionFormTab(section));
  const patch = (next: Partial<MgmtRecordDraft>) => onChange({ ...draft, ...next });
  const saveBar = <SaveBar pending={pending} ok={ok} error={error} onSave={onSave} saveLabel={draft.id ? "บันทึก" : "สร้างทรัพย์สิน"} />;

  return (
    <div className="crm-modal ads-drawer" role="presentation">
      <button type="button" className="crm-modal-backdrop" aria-label="ปิดฟอร์ม" onClick={onClose} />
      <div className="crm-modal-panel crm-modal-panel-user web-ops-drawer" role="dialog" aria-modal="true" aria-labelledby="mgmt-record-title">
        <div className="crm-modal-head">
          <div>
            <p className="crm-modal-eyebrow">Hotel Management Operations</p>
            <h2 id="mgmt-record-title">{draft.id ? draft.projectName || draft.hotelName || "แก้ไขทรัพย์สิน" : "ทรัพย์สินโรงแรมใหม่"}</h2>
            <p className="b2b-muted">บันทึกด้วยตนเอง ไม่มีการนำเข้าข้อมูล และไม่แสดงบนหน้าสาธารณะ ไม่เก็บข้อมูลแขก งบการเงิน หรือรหัสผ่าน</p>
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
        <div className="ads-form-tabs" role="tablist" aria-label="ส่วนของฟอร์ม Independent Hotel Operations">
          {MGMT_FORM_TABS.map((item) => (
            <button
              key={item}
              id={`mgmt-tab-${item}`}
              type="button"
              role="tab"
              aria-selected={tab === item}
              aria-controls={`mgmt-panel-${item}`}
              tabIndex={tab === item ? 0 : -1}
              className={tab === item ? "is-active" : undefined}
              onClick={() => setTab(item)}
            >
              {MGMT_FORM_TAB_LABEL[item]}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          <div className="b2b-form-grid" role="tabpanel" id="mgmt-panel-overview" aria-labelledby="mgmt-tab-overview">
            <Field label="Property name">
              <input className="crm-field" value={draft.hotelName} onChange={(event) => patch({ hotelName: event.target.value, projectName: draft.projectName || event.target.value })} />
            </Field>
            <Field label="ชื่อโปรเจกต์ภายใน">
              <input className="crm-field" value={draft.projectName} onChange={(event) => patch({ projectName: event.target.value })} />
            </Field>
            <Field label="Property type">
              <select className="crm-select" value={draft.propertyType} onChange={(event) => patch({ propertyType: event.target.value as MgmtProjectType })}>
                {MGMT_PROJECT_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {MGMT_PROJECT_TYPE_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Number of rooms">
              <input className="crm-field" value={draft.roomCount} onChange={(event) => patch({ roomCount: event.target.value })} />
            </Field>
            <Field label="Location / market">
              <input className="crm-field" value={draft.locationMarket} onChange={(event) => patch({ locationMarket: event.target.value })} />
            </Field>
            <Field label="Hotel status">
              <select className="crm-select" value={draft.hotelStatus} onChange={(event) => patch({ hotelStatus: event.target.value as MgmtHotelStatus })}>
                {MGMT_HOTEL_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {MGMT_HOTEL_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Primary objective">
              <input className="crm-field" value={draft.primaryGoal} onChange={(event) => patch({ primaryGoal: event.target.value })} />
            </Field>
            <Field label="Main challenge">
              <input className="crm-field" value={draft.mainChallenge} onChange={(event) => patch({ mainChallenge: event.target.value })} />
            </Field>
            <Field label="Start date">
              <input className="crm-field" type="date" value={draft.startDate} onChange={(event) => patch({ startDate: event.target.value })} />
            </Field>
            <Field label="Target review date">
              <input className="crm-field" type="date" value={draft.launchDate} onChange={(event) => patch({ launchDate: event.target.value })} />
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
              <select className="crm-select" value={draft.department} onChange={(event) => patch({ department: event.target.value as MgmtDepartment })}>
                {MGMT_DEPARTMENTS.map((item) => (
                  <option key={item} value={item}>
                    {MGMT_DEPARTMENT_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select className="crm-select" value={draft.status} onChange={(event) => patch({ status: event.target.value as MgmtStatus })}>
                {MGMT_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {MGMT_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Workstream">
              <select className="crm-select" value={draft.workstream} onChange={(event) => patch({ workstream: event.target.value as MgmtWorkstream })}>
                {MGMT_WORKSTREAMS.map((item) => (
                  <option key={item} value={item}>
                    {MGMT_WORKSTREAM_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Priority">
              <select className="crm-select" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as MgmtPriority })}>
                {MGMT_PRIORITIES.map((item) => (
                  <option key={item} value={item}>
                    {MGMT_PRIORITY_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <div className="is-wide">
              <Field label="Scope">
                <textarea className="crm-area" rows={3} value={draft.scope} onChange={(event) => patch({ scope: event.target.value })} />
              </Field>
            </div>
            <Field label="Hotel approver">
              <input className="crm-field" value={draft.hotelApprover} onChange={(event) => patch({ hotelApprover: event.target.value })} />
            </Field>
            <Field label="Next action">
              <input className="crm-field" value={draft.nextAction} onChange={(event) => patch({ nextAction: event.target.value })} />
            </Field>
            <Field label="Next action date">
              <input className="crm-field" type="date" value={draft.nextActionAt} onChange={(event) => patch({ nextActionAt: event.target.value })} />
            </Field>
            <Field label="KPI review cadence">
              <select className="crm-select" value={draft.kpiCadence} onChange={(event) => patch({ kpiCadence: event.target.value as MgmtCadence })}>
                {MGMT_CADENCES.map((item) => (
                  <option key={item} value={item}>
                    {MGMT_CADENCE_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Data status">
              <select className="crm-select" value={draft.dataStatus} onChange={(event) => patch({ dataStatus: event.target.value as MgmtKpiDataStatus })}>
                {MGMT_KPI_DATA_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {MGMT_KPI_DATA_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Primary KPI">
              <input className="crm-field" value={draft.primaryKpi} onChange={(event) => patch({ primaryKpi: event.target.value })} />
            </Field>
            <Field label="KPI target">
              <input className="crm-field" value={draft.kpiTarget} onChange={(event) => patch({ kpiTarget: event.target.value })} />
            </Field>
            <div className="is-wide">
              <Field label="Notes">
                <textarea className="crm-area" rows={3} value={draft.notes} onChange={(event) => patch({ notes: event.target.value })} />
              </Field>
            </div>
            <Field label="Created date">
              <input className="crm-field" value={row ? formatDate(row.createdAt) : "บันทึกแล้วจึงมีวันที่"} readOnly />
            </Field>
            <Field label="Updated date">
              <input className="crm-field" value={row ? formatDate(row.updatedAt) : "—"} readOnly />
            </Field>
            <div className="is-wide">
              <h3>งานย่อยตามแผนก</h3>
              <ManagementSubtasksPanel
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

        {tab === "assessment" ? (
          <div className="web-ops-list" role="tabpanel" id="mgmt-panel-assessment" aria-labelledby="mgmt-tab-assessment">
            {draft.assessments.map((item, index) => (
              <article key={item.id || index} className="web-ops-list-row">
                <select className="crm-select" value={item.area} onChange={(event) => patch({ assessments: draft.assessments.map((row, i) => (i === index ? { ...row, area: event.target.value as MgmtAssessmentView["area"] } : row)) })}>
                  {MGMT_ASSESSMENT_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {MGMT_ASSESSMENT_AREA_LABEL[area]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.question} placeholder="Question" onChange={(event) => patch({ assessments: draft.assessments.map((row, i) => (i === index ? { ...row, question: event.target.value } : row)) })} />
                <input className="crm-field" value={item.currentState} placeholder="Current state" onChange={(event) => patch({ assessments: draft.assessments.map((row, i) => (i === index ? { ...row, currentState: event.target.value } : row)) })} />
                <input className="crm-field" value={item.evidence} placeholder="Evidence or note" onChange={(event) => patch({ assessments: draft.assessments.map((row, i) => (i === index ? { ...row, evidence: event.target.value } : row)) })} />
                <select className="crm-select" value={item.risk} onChange={(event) => patch({ assessments: draft.assessments.map((row, i) => (i === index ? { ...row, risk: event.target.value as MgmtPriority } : row)) })}>
                  {MGMT_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {MGMT_PRIORITY_LABEL[priority]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.recommendedAction} placeholder="Recommended action" onChange={(event) => patch({ assessments: draft.assessments.map((row, i) => (i === index ? { ...row, recommendedAction: event.target.value } : row)) })} />
                <input className="crm-field" value={item.owner} placeholder="Owner" onChange={(event) => patch({ assessments: draft.assessments.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                <select className="crm-select" value={item.department} onChange={(event) => patch({ assessments: draft.assessments.map((row, i) => (i === index ? { ...row, department: event.target.value as MgmtDepartment | "" } : row)) })}>
                  <option value="">แผนก</option>
                  {MGMT_DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {MGMT_DEPARTMENT_LABEL[department]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" type="date" value={item.dueAt} onChange={(event) => patch({ assessments: draft.assessments.map((row, i) => (i === index ? { ...row, dueAt: event.target.value } : row)) })} />
                <select className="crm-select" value={item.approvalStatus} onChange={(event) => patch({ assessments: draft.assessments.map((row, i) => (i === index ? { ...row, approvalStatus: event.target.value as MgmtApprovalStatus } : row)) })}>
                  {MGMT_APPROVAL_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {MGMT_APPROVAL_LABEL[status]}
                    </option>
                  ))}
                </select>
                <select className="crm-select" value={item.status} onChange={(event) => patch({ assessments: draft.assessments.map((row, i) => (i === index ? { ...row, status: event.target.value as MgmtSubtaskStatus } : row)) })}>
                  {MGMT_SUBTASK_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {MGMT_SUBTASK_STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <button type="button" className="crm-users-secondary" onClick={() => patch({ assessments: draft.assessments.filter((_, i) => i !== index) })}>
                  ลบ
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ assessments: [...draft.assessments, emptyAssessment(draft.department)] })}>
              เพิ่ม Assessment
            </button>
          </div>
        ) : null}

        {tab === "plan" ? (
          <div className="web-ops-list" role="tabpanel" id="mgmt-panel-plan" aria-labelledby="mgmt-tab-plan">
            {draft.plans.map((item, index) => (
              <article key={item.id || index} className="web-ops-list-row">
                <select className="crm-select" value={item.phase} onChange={(event) => patch({ plans: draft.plans.map((row, i) => (i === index ? { ...row, phase: event.target.value as MgmtPlanView["phase"] } : row)) })}>
                  {MGMT_PLAN_PHASES.map((phase) => (
                    <option key={phase} value={phase}>
                      {MGMT_PLAN_PHASE_LABEL[phase]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.objective} placeholder="Objective" onChange={(event) => patch({ plans: draft.plans.map((row, i) => (i === index ? { ...row, objective: event.target.value } : row)) })} />
                <input className="crm-field" value={item.action} placeholder="Action" onChange={(event) => patch({ plans: draft.plans.map((row, i) => (i === index ? { ...row, action: event.target.value } : row)) })} />
                <input className="crm-field" value={item.owner} placeholder="Owner" onChange={(event) => patch({ plans: draft.plans.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                <select className="crm-select" value={item.department} onChange={(event) => patch({ plans: draft.plans.map((row, i) => (i === index ? { ...row, department: event.target.value as MgmtDepartment | "" } : row)) })}>
                  <option value="">แผนก</option>
                  {MGMT_DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {MGMT_DEPARTMENT_LABEL[department]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" type="date" value={item.startAt} onChange={(event) => patch({ plans: draft.plans.map((row, i) => (i === index ? { ...row, startAt: event.target.value } : row)) })} />
                <input className="crm-field" type="date" value={item.dueAt} onChange={(event) => patch({ plans: draft.plans.map((row, i) => (i === index ? { ...row, dueAt: event.target.value } : row)) })} />
                <select className="crm-select" value={item.priority} onChange={(event) => patch({ plans: draft.plans.map((row, i) => (i === index ? { ...row, priority: event.target.value as MgmtPriority } : row)) })}>
                  {MGMT_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {MGMT_PRIORITY_LABEL[priority]}
                    </option>
                  ))}
                </select>
                <select className="crm-select" value={item.status} onChange={(event) => patch({ plans: draft.plans.map((row, i) => (i === index ? { ...row, status: event.target.value as MgmtSubtaskStatus } : row)) })}>
                  {MGMT_SUBTASK_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {MGMT_SUBTASK_STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.dependency} placeholder="Dependency" onChange={(event) => patch({ plans: draft.plans.map((row, i) => (i === index ? { ...row, dependency: event.target.value } : row)) })} />
                <input className="crm-field" value={item.kpi} placeholder="KPI" onChange={(event) => patch({ plans: draft.plans.map((row, i) => (i === index ? { ...row, kpi: event.target.value } : row)) })} />
                <input className="crm-field" value={item.target} placeholder="Target" onChange={(event) => patch({ plans: draft.plans.map((row, i) => (i === index ? { ...row, target: event.target.value } : row)) })} />
                <input className="crm-field" value={item.measurement} placeholder="Measurement definition" onChange={(event) => patch({ plans: draft.plans.map((row, i) => (i === index ? { ...row, measurement: event.target.value } : row)) })} />
                <select className="crm-select" value={item.approvalStatus} onChange={(event) => patch({ plans: draft.plans.map((row, i) => (i === index ? { ...row, approvalStatus: event.target.value as MgmtApprovalStatus } : row)) })}>
                  {MGMT_APPROVAL_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {MGMT_APPROVAL_LABEL[status]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.notes} placeholder="Notes" onChange={(event) => patch({ plans: draft.plans.map((row, i) => (i === index ? { ...row, notes: event.target.value } : row)) })} />
                <button type="button" className="crm-users-secondary" onClick={() => patch({ plans: draft.plans.filter((_, i) => i !== index) })}>
                  ลบ
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ plans: [...draft.plans, emptyPlan(draft.department)] })}>
              เพิ่ม Operating Plan
            </button>
          </div>
        ) : null}

        {tab === "commercial" ? (
          <div role="tabpanel" id="mgmt-panel-commercial" aria-labelledby="mgmt-tab-commercial">
            <SectionEditor value={draft.commercial} onChange={(commercial) => patch({ commercial })} addLabel="เพิ่มงาน Commercial / Revenue" />
          </div>
        ) : null}
        {tab === "marketing" ? (
          <div role="tabpanel" id="mgmt-panel-marketing" aria-labelledby="mgmt-tab-marketing">
            <SectionEditor value={draft.marketingBlock} onChange={(marketingBlock) => patch({ marketingBlock })} addLabel="เพิ่มงาน Marketing" />
          </div>
        ) : null}
        {tab === "distribution" ? (
          <div role="tabpanel" id="mgmt-panel-distribution" aria-labelledby="mgmt-tab-distribution">
            <SectionEditor value={draft.distributionBlock} onChange={(distributionBlock) => patch({ distributionBlock })} addLabel="เพิ่มงาน Distribution" />
          </div>
        ) : null}
        {tab === "operations" ? (
          <div role="tabpanel" id="mgmt-panel-operations" aria-labelledby="mgmt-tab-operations">
            <SectionEditor value={draft.operations} onChange={(operations) => patch({ operations })} addLabel="เพิ่มงาน Operations" />
          </div>
        ) : null}
        {tab === "guest" ? (
          <div role="tabpanel" id="mgmt-panel-guest" aria-labelledby="mgmt-tab-guest">
            <p className="b2b-muted">บันทึกจังหวะบริการและมาตรฐานที่โรงแรมอนุมัติ ไม่เก็บข้อมูลส่วนตัวของแขก</p>
            <SectionEditor value={draft.guest} onChange={(guest) => patch({ guest })} addLabel="เพิ่มงาน Guest Experience" />
          </div>
        ) : null}

        {tab === "people" ? (
          <div className="web-ops-list" role="tabpanel" id="mgmt-panel-people" aria-labelledby="mgmt-tab-people">
            <p className="b2b-muted">บทบาทการทำงานร่วมกัน การจ้างงานยังเป็นของโรงแรม ไม่เก็บข้อมูลส่วนบุคคลของพนักงาน</p>
            {draft.people.map((item, index) => (
              <article key={item.id || index} className="web-ops-list-row">
                <input className="crm-field" value={item.role} placeholder="Role" onChange={(event) => patch({ people: draft.people.map((row, i) => (i === index ? { ...row, role: event.target.value } : row)) })} />
                <input className="crm-field" value={item.name} placeholder="ชื่อบทบาท / ผู้รับผิดชอบ" onChange={(event) => patch({ people: draft.people.map((row, i) => (i === index ? { ...row, name: event.target.value } : row)) })} />
                <select className="crm-select" value={item.department} onChange={(event) => patch({ people: draft.people.map((row, i) => (i === index ? { ...row, department: event.target.value as MgmtDepartment | "" } : row)) })}>
                  <option value="">แผนก</option>
                  {MGMT_DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {MGMT_DEPARTMENT_LABEL[department]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.owner} placeholder="Owner" onChange={(event) => patch({ people: draft.people.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                <select className="crm-select" value={item.status} onChange={(event) => patch({ people: draft.people.map((row, i) => (i === index ? { ...row, status: event.target.value as MgmtReadiness } : row)) })}>
                  {MGMT_READINESS.map((status) => (
                    <option key={status} value={status}>
                      {MGMT_READINESS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.notes} placeholder="Notes" onChange={(event) => patch({ people: draft.people.map((row, i) => (i === index ? { ...row, notes: event.target.value } : row)) })} />
                <button type="button" className="crm-users-secondary" onClick={() => patch({ people: draft.people.filter((_, i) => i !== index) })}>
                  ลบ
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ people: [...draft.people, emptyPeopleRole()] })}>
              เพิ่มบทบาท
            </button>
          </div>
        ) : null}

        {tab === "meetings" ? (
          <div className="web-ops-list" role="tabpanel" id="mgmt-panel-meetings" aria-labelledby="mgmt-tab-meetings">
            {draft.meetings.map((item, index) => (
              <article key={item.id || index} className="web-ops-list-row">
                <select className="crm-select" value={item.meetingType} onChange={(event) => patch({ meetings: draft.meetings.map((row, i) => (i === index ? { ...row, meetingType: event.target.value as MgmtCadence } : row)) })}>
                  {MGMT_CADENCES.map((type) => (
                    <option key={type} value={type}>
                      {MGMT_CADENCE_LABEL[type]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.property} placeholder="Property" onChange={(event) => patch({ meetings: draft.meetings.map((row, i) => (i === index ? { ...row, property: event.target.value } : row)) })} />
                <input className="crm-field" type="date" value={item.date} onChange={(event) => patch({ meetings: draft.meetings.map((row, i) => (i === index ? { ...row, date: event.target.value } : row)) })} />
                <input className="crm-field" value={item.participants} placeholder="Participants (roles only)" onChange={(event) => patch({ meetings: draft.meetings.map((row, i) => (i === index ? { ...row, participants: event.target.value } : row)) })} />
                <input className="crm-field" value={item.agenda} placeholder="Agenda" onChange={(event) => patch({ meetings: draft.meetings.map((row, i) => (i === index ? { ...row, agenda: event.target.value } : row)) })} />
                <input className="crm-field" value={item.decisions} placeholder="Decisions" onChange={(event) => patch({ meetings: draft.meetings.map((row, i) => (i === index ? { ...row, decisions: event.target.value } : row)) })} />
                <input className="crm-field" value={item.actionItems} placeholder="Action items" onChange={(event) => patch({ meetings: draft.meetings.map((row, i) => (i === index ? { ...row, actionItems: event.target.value } : row)) })} />
                <input className="crm-field" value={item.owner} placeholder="Owner" onChange={(event) => patch({ meetings: draft.meetings.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                <input className="crm-field" type="date" value={item.dueAt} onChange={(event) => patch({ meetings: draft.meetings.map((row, i) => (i === index ? { ...row, dueAt: event.target.value } : row)) })} />
                <select className="crm-select" value={item.status} onChange={(event) => patch({ meetings: draft.meetings.map((row, i) => (i === index ? { ...row, status: event.target.value as MgmtSubtaskStatus } : row)) })}>
                  {MGMT_SUBTASK_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {MGMT_SUBTASK_STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.notes} placeholder="Notes" onChange={(event) => patch({ meetings: draft.meetings.map((row, i) => (i === index ? { ...row, notes: event.target.value } : row)) })} />
                <button type="button" className="crm-users-secondary" onClick={() => patch({ meetings: draft.meetings.filter((_, i) => i !== index) })}>
                  ลบ
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ meetings: [...draft.meetings, emptyMeeting(draft.hotelName)] })}>
              เพิ่มประชุม
            </button>
          </div>
        ) : null}

        {tab === "kpi" ? (
          <div className="web-ops-list" role="tabpanel" id="mgmt-panel-kpi" aria-labelledby="mgmt-tab-kpi">
            {draft.kpis.map((item, index) => (
              <article key={item.id || index} className="web-ops-list-row">
                <input className="crm-field" value={item.name} placeholder="KPI name" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, name: event.target.value } : row)) })} />
                <select className="crm-select" value={item.area} onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, area: event.target.value as MgmtKpiView["area"] } : row)) })}>
                  {MGMT_KPI_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {MGMT_KPI_AREA_LABEL[area]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.value} placeholder="Value" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, value: event.target.value } : row)) })} />
                <input className="crm-field" value={item.definition} placeholder="Unit / definition" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, definition: event.target.value } : row)) })} />
                <input className="crm-field" value={item.period} placeholder="Period" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, period: event.target.value } : row)) })} />
                <input className="crm-field" value={item.market} placeholder="Property" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, market: event.target.value } : row)) })} />
                <input className="crm-field" value={item.source} placeholder="Source" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, source: event.target.value } : row)) })} />
                <select className="crm-select" value={item.dataStatus} onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, dataStatus: event.target.value as MgmtKpiView["dataStatus"] } : row)) })}>
                  {MGMT_KPI_DATA_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {MGMT_KPI_DATA_STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.target} placeholder="Target or comparison" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, target: event.target.value } : row)) })} />
                <input className="crm-field" value={item.owner} placeholder="Owner" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                <input className="crm-field" value={item.notes} placeholder="Notes" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, notes: event.target.value } : row)) })} />
                <button type="button" className="crm-users-secondary" onClick={() => patch({ kpis: draft.kpis.filter((_, i) => i !== index) })}>
                  ลบ
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ kpis: [...draft.kpis, { ...emptyKpi(), market: draft.hotelName }] })}>
              เพิ่ม KPI
            </button>
          </div>
        ) : null}

        {tab === "actions" ? (
          <div className="web-ops-list" role="tabpanel" id="mgmt-panel-actions" aria-labelledby="mgmt-tab-actions">
            {draft.actionLogs.map((item, index) => (
              <article key={item.id || index} className="web-ops-list-row">
                <input className="crm-field" value={item.name} placeholder="Action name" onChange={(event) => patch({ actionLogs: draft.actionLogs.map((row, i) => (i === index ? { ...row, name: event.target.value } : row)) })} />
                <input className="crm-field" value={item.property} placeholder="Property" onChange={(event) => patch({ actionLogs: draft.actionLogs.map((row, i) => (i === index ? { ...row, property: event.target.value } : row)) })} />
                <select className="crm-select" value={item.workstream} onChange={(event) => patch({ actionLogs: draft.actionLogs.map((row, i) => (i === index ? { ...row, workstream: event.target.value as MgmtWorkstream | "" } : row)) })}>
                  <option value="">สายงาน</option>
                  {MGMT_WORKSTREAMS.map((stream) => (
                    <option key={stream} value={stream}>
                      {MGMT_WORKSTREAM_LABEL[stream]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.owner} placeholder="Owner" onChange={(event) => patch({ actionLogs: draft.actionLogs.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                <select className="crm-select" value={item.department} onChange={(event) => patch({ actionLogs: draft.actionLogs.map((row, i) => (i === index ? { ...row, department: event.target.value as MgmtDepartment | "" } : row)) })}>
                  <option value="">แผนก</option>
                  {MGMT_DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {MGMT_DEPARTMENT_LABEL[department]}
                    </option>
                  ))}
                </select>
                <select className="crm-select" value={item.priority} onChange={(event) => patch({ actionLogs: draft.actionLogs.map((row, i) => (i === index ? { ...row, priority: event.target.value as MgmtPriority } : row)) })}>
                  {MGMT_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {MGMT_PRIORITY_LABEL[priority]}
                    </option>
                  ))}
                </select>
                <select className="crm-select" value={item.status} onChange={(event) => patch({ actionLogs: draft.actionLogs.map((row, i) => (i === index ? { ...row, status: event.target.value as MgmtSubtaskStatus } : row)) })}>
                  {MGMT_SUBTASK_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {MGMT_SUBTASK_STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" type="date" value={item.dueAt} onChange={(event) => patch({ actionLogs: draft.actionLogs.map((row, i) => (i === index ? { ...row, dueAt: event.target.value } : row)) })} />
                <input className="crm-field" value={item.relatedKpi} placeholder="Related KPI" onChange={(event) => patch({ actionLogs: draft.actionLogs.map((row, i) => (i === index ? { ...row, relatedKpi: event.target.value } : row)) })} />
                <input className="crm-field" value={item.decision} placeholder="Decision or approval" onChange={(event) => patch({ actionLogs: draft.actionLogs.map((row, i) => (i === index ? { ...row, decision: event.target.value } : row)) })} />
                <input className="crm-field" value={item.notes} placeholder="Notes" onChange={(event) => patch({ actionLogs: draft.actionLogs.map((row, i) => (i === index ? { ...row, notes: event.target.value } : row)) })} />
                <button type="button" className="crm-users-secondary" onClick={() => patch({ actionLogs: draft.actionLogs.filter((_, i) => i !== index) })}>
                  ลบ
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ actionLogs: [...draft.actionLogs, emptyActionLog(draft.hotelName, draft.workstream)] })}>
              เพิ่ม Action
            </button>
          </div>
        ) : null}

        {tab === "approvals" ? (
          <div role="tabpanel" id="mgmt-panel-approvals" aria-labelledby="mgmt-tab-approvals">
            <Field label="Hotel approver">
              <input className="crm-field" value={draft.hotelApprover} onChange={(event) => patch({ hotelApprover: event.target.value })} />
            </Field>
            <div className="web-ops-list">
              {draft.approvals.map((item, index) => (
                <article key={item.id || index} className="web-ops-list-row">
                  <input className="crm-field" value={item.kind} placeholder="ประเภทการอนุมัติ" onChange={(event) => patch({ approvals: draft.approvals.map((row, i) => (i === index ? { ...row, kind: event.target.value } : row)) })} />
                  <select className="crm-select" value={item.status} onChange={(event) => patch({ approvals: draft.approvals.map((row, i) => (i === index ? { ...row, status: event.target.value as MgmtApprovalStatus } : row)) })}>
                    {MGMT_APPROVAL_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {MGMT_APPROVAL_LABEL[status]}
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

        {tab === "handover" ? (
          <div role="tabpanel" id="mgmt-panel-handover" aria-labelledby="mgmt-tab-handover">
            <ReadinessSelect value={draft.handoverStatus} onChange={(handoverStatus) => patch({ handoverStatus })} label="Handover status" />
            <ChecklistEditor items={draft.handover} onChange={(handover) => patch({ handover, handoverStatus: handover[0]?.status || draft.handoverStatus })} addLabel="เพิ่มรายการส่งมอบ" />
          </div>
        ) : null}

        {tab === "files" ? (
          <div role="tabpanel" id="mgmt-panel-files" aria-labelledby="mgmt-tab-files">
            <Field label="บันทึกภายใน">
              <textarea className="crm-area" rows={4} value={draft.notes} onChange={(event) => patch({ notes: event.target.value })} />
            </Field>
            <div className="web-ops-list">
              {draft.fileNotes.map((item, index) => (
                <article key={item.id || index} className="web-ops-list-row">
                  <input className="crm-field" value={item.name} placeholder="ชื่อไฟล์ / เอกสาร" onChange={(event) => patch({ fileNotes: draft.fileNotes.map((row, i) => (i === index ? { ...row, name: event.target.value } : row)) })} />
                  <input className="crm-field" value={item.caption} placeholder="คำอธิบาย" onChange={(event) => patch({ fileNotes: draft.fileNotes.map((row, i) => (i === index ? { ...row, caption: event.target.value } : row)) })} />
                  <select className="crm-select" value={item.status} onChange={(event) => patch({ fileNotes: draft.fileNotes.map((row, i) => (i === index ? { ...row, status: event.target.value as MgmtReadiness } : row)) })}>
                    {MGMT_READINESS.map((status) => (
                      <option key={status} value={status}>
                        {MGMT_READINESS_LABEL[status]}
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
          <ul className="meta-ops-history seo-history" role="tabpanel" id="mgmt-panel-history" aria-labelledby="mgmt-tab-history">
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
