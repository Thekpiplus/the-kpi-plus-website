"use client";

import { useState } from "react";
import { Field, SaveBar, toDateInput } from "@/components/b2b-ops/ui";
import {
  MASKED_VALUE,
  SYS_APPROVAL_LABEL,
  SYS_APPROVAL_STATUSES,
  SYS_CADENCE_LABEL,
  SYS_CADENCES,
  SYS_DEFAULT_HANDOVER,
  SYS_DEFAULT_QA,
  SYS_DEPARTMENT_LABEL,
  SYS_DEPARTMENTS,
  SYS_DIRECTION_LABEL,
  SYS_DIRECTIONS,
  SYS_DOC_STATUS_LABEL,
  SYS_DOC_STATUSES,
  SYS_ENVIRONMENT_LABEL,
  SYS_ENVIRONMENTS,
  SYS_FIELD_REQUIRED,
  SYS_FIELD_REQUIRED_LABEL,
  SYS_FORM_TAB_LABEL,
  SYS_FORM_TABS,
  SYS_HOTEL_STATUS_LABEL,
  SYS_HOTEL_STATUSES,
  SYS_INTEGRATION_STATUS_LABEL,
  SYS_INTEGRATION_STATUSES,
  SYS_ISSUE_STATUS_LABEL,
  SYS_ISSUE_STATUSES,
  SYS_KPI_AREA_LABEL,
  SYS_KPI_AREAS,
  SYS_KPI_DATA_STATUS_LABEL,
  SYS_KPI_DATA_STATUSES,
  SYS_LICENSE_STATUS_LABEL,
  SYS_LICENSE_STATUSES,
  SYS_MAPPING_STATUS_LABEL,
  SYS_MAPPING_STATUSES,
  SYS_PRIORITIES,
  SYS_PRIORITY_LABEL,
  SYS_PROJECT_TYPE_LABEL,
  SYS_PROJECT_TYPES,
  SYS_READINESS,
  SYS_READINESS_AREA_LABEL,
  SYS_READINESS_AREAS,
  SYS_READINESS_LABEL,
  SYS_RISK_LABEL,
  SYS_RISKS,
  SYS_SEVERITY_LABEL,
  SYS_SEVERITIES,
  SYS_STATUS_LABEL,
  SYS_STATUSES,
  SYS_TEST_STATUS_LABEL,
  SYS_TEST_STATUSES,
  SYS_WORKSTREAM_LABEL,
  SYS_WORKSTREAMS,
  emptyArchitectureRow,
  emptyHandoverAsset,
  emptyInventoryRow,
  emptyIssue,
  emptyKpi,
  emptyMappingRow,
  emptyReadinessRow,
  emptySectionBlock,
  emptyTestCase,
  webSectionFormTab,
  type SysAccessView,
  type SysApprovalStatus,
  type SysApprovalView,
  type SysArchitectureRow,
  type SysCadence,
  type SysChecklistItem,
  type SysDepartment,
  type SysFileNote,
  type SysFormTab,
  type SysHandoverAsset,
  type SysHotelStatus,
  type SysInventoryRow,
  type SysIssueRow,
  type SysKpiDataStatus,
  type SysKpiView,
  type SysMappingRow,
  type SysPriority,
  type SysProjectRow,
  type SysProjectType,
  type SysReadiness,
  type SysReadinessRow,
  type SysRisk,
  type SysSection,
  type SysSectionBlock,
  type SysStatus,
  type SysTestCaseRow,
  type SysWorkstream,
} from "@/lib/systems-ops/types";
import { SystemsSubtasksPanel, type SysSubtaskDraft } from "./SystemsSubtasksPanel";
import type { SysSubtaskView } from "@/lib/systems-ops/types";

type Staff = { id: string; name: string };

export type SysRecordDraft = {
  id: string;
  projectName: string;
  hotelName: string;
  propertyType: SysProjectType;
  roomCount: string;
  websiteUrl: string;
  pms: string;
  channelManager: string;
  bookingEngine: string;
  otherSystems: string;
  locationMarket: string;
  hotelStatus: SysHotelStatus;
  primaryGoal: string;
  mainChallenge: string;
  startDate: string;
  launchDate: string;
  status: SysStatus;
  ownerId: string;
  department: SysDepartment;
  workstream: SysWorkstream;
  priority: SysPriority;
  risk: SysRisk;
  scope: string;
  hotelApprover: string;
  providerContact: string;
  nextAction: string;
  nextActionAt: string;
  kpiCadence: SysCadence;
  dataStatus: SysKpiDataStatus;
  notes: string;
  primaryKpi: string;
  kpiTarget: string;
  handoverStatus: SysReadiness;
  inventory: SysInventoryRow[];
  architecture: SysArchitectureRow[];
  mapping: SysMappingRow[];
  readinessItems: SysReadinessRow[];
  configuration: SysSectionBlock;
  tests: SysTestCaseRow[];
  issues: SysIssueRow[];
  distributionOps: SysSectionBlock;
  analyticsNotes: SysSectionBlock;
  handoverAssets: SysHandoverAsset[];
  qa: SysChecklistItem[];
  handover: SysChecklistItem[];
  fileNotes: SysFileNote[];
  approvals: SysApprovalView[];
  kpis: SysKpiView[];
};

function nid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function emptySysDraft(ownerId = "", workstream: SysWorkstream = "properties"): SysRecordDraft {
  return {
    id: "",
    projectName: "",
    hotelName: "",
    propertyType: "new_setup",
    roomCount: "",
    websiteUrl: "",
    pms: "",
    channelManager: "",
    bookingEngine: "",
    otherSystems: "",
    locationMarket: "",
    hotelStatus: "operating",
    primaryGoal: "",
    mainChallenge: "",
    startDate: "",
    launchDate: "",
    status: "draft",
    ownerId,
    department: "management",
    workstream,
    priority: "normal",
    risk: "medium",
    scope: "",
    hotelApprover: "",
    providerContact: "",
    nextAction: "",
    nextActionAt: "",
    kpiCadence: "monthly",
    dataStatus: "pending",
    notes: "",
    primaryKpi: "",
    kpiTarget: "",
    handoverStatus: "not_started",
    inventory: [],
    architecture: [],
    mapping: [],
    readinessItems: [],
    configuration: emptySectionBlock(),
    tests: [],
    issues: [],
    distributionOps: emptySectionBlock(),
    analyticsNotes: emptySectionBlock(),
    handoverAssets: [],
    qa: SYS_DEFAULT_QA.map((label, index) => ({ id: `qa_${index + 1}`, label, status: "not_started", notes: "", owner: "" })),
    handover: SYS_DEFAULT_HANDOVER.map((label, index) => ({ id: `ho_${index + 1}`, label, status: "not_started", notes: "", owner: "" })),
    fileNotes: [],
    approvals: [],
    kpis: [],
  };
}

export function draftFromRow(row: SysProjectRow): SysRecordDraft {
  return {
    id: row.id,
    projectName: row.projectName,
    hotelName: row.hotelName,
    propertyType: row.propertyType,
    roomCount: row.roomCount,
    websiteUrl: row.websiteUrl,
    pms: row.pms,
    channelManager: row.channelManager,
    bookingEngine: row.bookingEngine,
    otherSystems: row.otherSystems,
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
    risk: row.risk,
    scope: row.scope,
    hotelApprover: row.hotelApprover,
    providerContact: row.providerContact,
    nextAction: row.nextAction,
    nextActionAt: toDateInput(row.nextActionAt),
    kpiCadence: row.kpiCadence,
    dataStatus: row.dataStatus,
    notes: row.notes,
    primaryKpi: row.primaryKpi,
    kpiTarget: row.kpiTarget,
    handoverStatus: row.handoverStatus,
    inventory: row.inventory,
    architecture: row.architecture,
    mapping: row.mapping,
    readinessItems: row.readinessItems,
    configuration: row.configuration,
    tests: row.tests,
    issues: row.issues,
    distributionOps: row.distributionOps,
    analyticsNotes: row.analyticsNotes,
    handoverAssets: row.handoverAssets,
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

function emptyCheck(label = ""): SysChecklistItem {
  return { id: nid("chk"), label, status: "not_started", notes: "", owner: "" };
}

function ReadinessSelect({ value, onChange, label }: { value: SysReadiness; onChange: (value: SysReadiness) => void; label: string }) {
  return (
    <Field label={label}>
      <select className="crm-select" value={value} onChange={(event) => onChange(event.target.value as SysReadiness)}>
        {SYS_READINESS.map((item) => (
          <option key={item} value={item}>
            {SYS_READINESS_LABEL[item]}
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
  items: SysChecklistItem[];
  onChange: (items: SysChecklistItem[]) => void;
  addLabel: string;
}) {
  return (
    <div className="web-ops-list">
      {items.map((item, index) => (
        <article key={item.id || index} className="web-ops-list-row">
          <input className="crm-field" value={item.label} placeholder="รายการ" onChange={(event) => onChange(items.map((row, i) => (i === index ? { ...row, label: event.target.value } : row)))} />
          <select className="crm-select" value={item.status} onChange={(event) => onChange(items.map((row, i) => (i === index ? { ...row, status: event.target.value as SysReadiness } : row)))}>
            {SYS_READINESS.map((status) => (
              <option key={status} value={status}>
                {SYS_READINESS_LABEL[status]}
              </option>
            ))}
          </select>
          <input className="crm-field" value={item.owner} placeholder="ผู้รับผิดชอบ" onChange={(event) => onChange(items.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)))} />
          <input className="crm-field" value={item.notes} placeholder="บันทึก" onChange={(event) => onChange(items.map((row, i) => (i === index ? { ...row, notes: event.target.value } : row)))} />
          <div className="b2b-row-actions">
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
  value: SysSectionBlock;
  onChange: (value: SysSectionBlock) => void;
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

export function SystemsRecordForm({
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
  onAddDuty,
  onEscalate,
  onCloseRecord,
}: {
  draft: SysRecordDraft;
  row?: SysProjectRow;
  staff: Staff[];
  access: SysAccessView;
  section?: SysSection;
  pending: boolean;
  ok: string;
  error: string;
  onChange: (draft: SysRecordDraft) => void;
  onSave: () => void;
  onClose: () => void;
  subtaskDraft: SysSubtaskDraft;
  subtaskComment: string;
  onSubtaskDraftChange: (draft: SysSubtaskDraft) => void;
  onSubtaskCommentChange: (value: string) => void;
  onSaveSubtask: () => void;
  onCompleteSubtask: (item: SysSubtaskView, completed: boolean) => void;
  onAddSubtaskComment: (subtaskId: string) => void;
  onAttachSubtaskFile: (subtaskId: string, form: HTMLFormElement) => void;
  onPatchSubtask: (item: SysSubtaskView, patch: Partial<SysSubtaskDraft>) => void;
  onDeleteSubtask: (item: SysSubtaskView) => void;
  onAddDuty?: (department: SysDepartment, name: string) => void;
  onEscalate?: () => void;
  onCloseRecord?: () => void;
}) {
  const [tab, setTab] = useState<SysFormTab>(webSectionFormTab(section));
  const patch = (next: Partial<SysRecordDraft>) => onChange({ ...draft, ...next });
  const saveBar = <SaveBar pending={pending} ok={ok} error={error} onSave={onSave} saveLabel={draft.id ? "บันทึก" : "สร้างโปรเจกต์"} />;
  const providerValue = access.canSeePrivateIds || !draft.providerContact ? draft.providerContact : MASKED_VALUE;

  return (
    <div className="crm-modal ads-drawer" role="presentation">
      <button type="button" className="crm-modal-backdrop" aria-label="ปิดฟอร์ม" onClick={onClose} />
      <div className="crm-modal-panel crm-modal-panel-user web-ops-drawer" role="dialog" aria-modal="true" aria-labelledby="sys-record-title">
        <div className="crm-modal-head">
          <div>
            <p className="crm-modal-eyebrow">Hotel Systems Operations</p>
            <h2 id="sys-record-title">{draft.id ? draft.projectName || draft.hotelName || "แก้ไขโปรเจกต์" : "โปรเจกต์ระบบโรงแรมใหม่"}</h2>
            <p className="b2b-muted">ใช้งานภายในเท่านั้น บันทึกด้วยตนเอง ไม่มีการนำเข้าข้อมูล ไม่เก็บรหัสผ่าน คีย์ API โทเคน ข้อมูลแขก หรือข้อมูลชำระเงิน</p>
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
        <div className="ads-form-tabs" role="tablist" aria-label="ส่วนของฟอร์ม Hotel Systems Operations">
          {SYS_FORM_TABS.map((item) => (
            <button
              key={item}
              id={`sys-tab-${item}`}
              type="button"
              role="tab"
              aria-selected={tab === item}
              aria-controls={`sys-panel-${item}`}
              tabIndex={tab === item ? 0 : -1}
              className={tab === item ? "is-active" : undefined}
              onClick={() => setTab(item)}
            >
              {SYS_FORM_TAB_LABEL[item]}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          <div className="b2b-form-grid" role="tabpanel" id="sys-panel-overview" aria-labelledby="sys-tab-overview">
            <Field label="Project name">
              <input className="crm-field" value={draft.projectName} onChange={(event) => patch({ projectName: event.target.value })} />
            </Field>
            <Field label="Hotel / property">
              <input className="crm-field" value={draft.hotelName} onChange={(event) => patch({ hotelName: event.target.value, projectName: draft.projectName || event.target.value })} />
            </Field>
            <Field label="Number of rooms">
              <input className="crm-field" value={draft.roomCount} onChange={(event) => patch({ roomCount: event.target.value })} />
            </Field>
            <Field label="Website URL">
              <input className="crm-field" value={draft.websiteUrl} onChange={(event) => patch({ websiteUrl: event.target.value })} />
            </Field>
            <Field label="PMS">
              <input className="crm-field" value={draft.pms} onChange={(event) => patch({ pms: event.target.value })} />
            </Field>
            <Field label="Channel Manager">
              <input className="crm-field" value={draft.channelManager} onChange={(event) => patch({ channelManager: event.target.value })} />
            </Field>
            <Field label="Booking Engine">
              <input className="crm-field" value={draft.bookingEngine} onChange={(event) => patch({ bookingEngine: event.target.value })} />
            </Field>
            <Field label="Other systems">
              <input className="crm-field" value={draft.otherSystems} onChange={(event) => patch({ otherSystems: event.target.value })} />
            </Field>
            <Field label="Objective">
              <input className="crm-field" value={draft.primaryGoal} onChange={(event) => patch({ primaryGoal: event.target.value })} />
            </Field>
            <Field label="Project type">
              <select className="crm-select" value={draft.propertyType} onChange={(event) => patch({ propertyType: event.target.value as SysProjectType })}>
                {SYS_PROJECT_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {SYS_PROJECT_TYPE_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Start date">
              <input className="crm-field" type="date" value={draft.startDate} onChange={(event) => patch({ startDate: event.target.value })} />
            </Field>
            <Field label="Target go-live date">
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
              <select className="crm-select" value={draft.department} onChange={(event) => patch({ department: event.target.value as SysDepartment })}>
                {SYS_DEPARTMENTS.map((item) => (
                  <option key={item} value={item}>
                    {SYS_DEPARTMENT_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Hotel approver">
              <input className="crm-field" value={draft.hotelApprover} onChange={(event) => patch({ hotelApprover: event.target.value })} />
            </Field>
            <Field label="Provider contact">
              <input
                className="crm-field"
                value={providerValue}
                readOnly={!access.canSeePrivateIds}
                onChange={(event) => access.canSeePrivateIds && patch({ providerContact: event.target.value })}
              />
            </Field>
            <Field label="Status">
              <select className="crm-select" value={draft.status} onChange={(event) => patch({ status: event.target.value as SysStatus })}>
                {SYS_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {SYS_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Risk level">
              <select className="crm-select" value={draft.risk} onChange={(event) => patch({ risk: event.target.value as SysRisk })}>
                {SYS_RISKS.map((item) => (
                  <option key={item} value={item}>
                    {SYS_RISK_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Workstream">
              <select className="crm-select" value={draft.workstream} onChange={(event) => patch({ workstream: event.target.value as SysWorkstream })}>
                {SYS_WORKSTREAMS.map((item) => (
                  <option key={item} value={item}>
                    {SYS_WORKSTREAM_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Priority">
              <select className="crm-select" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as SysPriority })}>
                {SYS_PRIORITIES.map((item) => (
                  <option key={item} value={item}>
                    {SYS_PRIORITY_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Location / market">
              <input className="crm-field" value={draft.locationMarket} onChange={(event) => patch({ locationMarket: event.target.value })} />
            </Field>
            <Field label="Hotel status">
              <select className="crm-select" value={draft.hotelStatus} onChange={(event) => patch({ hotelStatus: event.target.value as SysHotelStatus })}>
                {SYS_HOTEL_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {SYS_HOTEL_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <div className="is-wide">
              <Field label="Scope">
                <textarea className="crm-area" rows={3} value={draft.scope} onChange={(event) => patch({ scope: event.target.value })} />
              </Field>
            </div>
            <Field label="Next action">
              <input className="crm-field" value={draft.nextAction} onChange={(event) => patch({ nextAction: event.target.value })} />
            </Field>
            <Field label="Next action date">
              <input className="crm-field" type="date" value={draft.nextActionAt} onChange={(event) => patch({ nextActionAt: event.target.value })} />
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
              <p className="b2b-muted">แผนกที่ขยายได้: Marketing, Revenue, Distribution, Sales, Management · 1–10 งานย่อยต่อแผนก</p>
              <SystemsSubtasksPanel
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
                onAddDuty={onAddDuty}
              />
            </div>
          </div>
        ) : null}

        {tab === "inventory" ? (
          <div className="web-ops-list" role="tabpanel" id="sys-panel-inventory" aria-labelledby="sys-tab-inventory">
            {draft.inventory.map((item, index) => (
              <article key={item.id || index} className="web-ops-list-row">
                <input className="crm-field" value={item.system} placeholder="System" onChange={(event) => patch({ inventory: draft.inventory.map((row, i) => (i === index ? { ...row, system: event.target.value } : row)) })} />
                <input className="crm-field" value={item.provider} placeholder="Provider" onChange={(event) => patch({ inventory: draft.inventory.map((row, i) => (i === index ? { ...row, provider: event.target.value } : row)) })} />
                <input className="crm-field" value={item.purpose} placeholder="Purpose" onChange={(event) => patch({ inventory: draft.inventory.map((row, i) => (i === index ? { ...row, purpose: event.target.value } : row)) })} />
                <input className="crm-field" value={item.owner} placeholder="Owner" onChange={(event) => patch({ inventory: draft.inventory.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                <input className="crm-field" value={item.dataIn} placeholder="Data In" onChange={(event) => patch({ inventory: draft.inventory.map((row, i) => (i === index ? { ...row, dataIn: event.target.value } : row)) })} />
                <input className="crm-field" value={item.dataOut} placeholder="Data Out" onChange={(event) => patch({ inventory: draft.inventory.map((row, i) => (i === index ? { ...row, dataOut: event.target.value } : row)) })} />
                <input className="crm-field" value={item.apiConnector} placeholder="API / Connector" onChange={(event) => patch({ inventory: draft.inventory.map((row, i) => (i === index ? { ...row, apiConnector: event.target.value } : row)) })} />
                <select className="crm-select" value={item.environment} onChange={(event) => patch({ inventory: draft.inventory.map((row, i) => (i === index ? { ...row, environment: event.target.value as SysInventoryRow["environment"] } : row)) })}>
                  {SYS_ENVIRONMENTS.map((env) => (
                    <option key={env} value={env}>
                      {SYS_ENVIRONMENT_LABEL[env]}
                    </option>
                  ))}
                </select>
                <select className="crm-select" value={item.licenseStatus} onChange={(event) => patch({ inventory: draft.inventory.map((row, i) => (i === index ? { ...row, licenseStatus: event.target.value as SysInventoryRow["licenseStatus"] } : row)) })}>
                  {SYS_LICENSE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {SYS_LICENSE_STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <select className="crm-select" value={item.integrationStatus} onChange={(event) => patch({ inventory: draft.inventory.map((row, i) => (i === index ? { ...row, integrationStatus: event.target.value as SysInventoryRow["integrationStatus"] } : row)) })}>
                  {SYS_INTEGRATION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {SYS_INTEGRATION_STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" type="date" value={item.lastReviewed} onChange={(event) => patch({ inventory: draft.inventory.map((row, i) => (i === index ? { ...row, lastReviewed: event.target.value } : row)) })} />
                <input className="crm-field" value={item.notes} placeholder="Notes" onChange={(event) => patch({ inventory: draft.inventory.map((row, i) => (i === index ? { ...row, notes: event.target.value } : row)) })} />
                <button type="button" className="crm-users-secondary" onClick={() => patch({ inventory: draft.inventory.filter((_, i) => i !== index) })}>
                  ลบ
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ inventory: [...draft.inventory, emptyInventoryRow()] })}>
              เพิ่มระบบ
            </button>
          </div>
        ) : null}

        {tab === "architecture" ? (
          <div className="web-ops-list" role="tabpanel" id="sys-panel-architecture" aria-labelledby="sys-tab-architecture">
            {draft.architecture.map((item, index) => (
              <article key={item.id || index} className="web-ops-list-row">
                <input className="crm-field" value={item.node} placeholder="Node / system" onChange={(event) => patch({ architecture: draft.architecture.map((row, i) => (i === index ? { ...row, node: event.target.value } : row)) })} />
                <input className="crm-field" value={item.source} placeholder="Source" onChange={(event) => patch({ architecture: draft.architecture.map((row, i) => (i === index ? { ...row, source: event.target.value } : row)) })} />
                <input className="crm-field" value={item.destination} placeholder="Destination" onChange={(event) => patch({ architecture: draft.architecture.map((row, i) => (i === index ? { ...row, destination: event.target.value } : row)) })} />
                <input className="crm-field" value={item.dataCategory} placeholder="Data category" onChange={(event) => patch({ architecture: draft.architecture.map((row, i) => (i === index ? { ...row, dataCategory: event.target.value } : row)) })} />
                <select className="crm-select" value={item.direction} onChange={(event) => patch({ architecture: draft.architecture.map((row, i) => (i === index ? { ...row, direction: event.target.value as SysArchitectureRow["direction"] } : row)) })}>
                  {SYS_DIRECTIONS.map((dir) => (
                    <option key={dir} value={dir}>
                      {SYS_DIRECTION_LABEL[dir]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.frequency} placeholder="Frequency / trigger" onChange={(event) => patch({ architecture: draft.architecture.map((row, i) => (i === index ? { ...row, frequency: event.target.value } : row)) })} />
                <input className="crm-field" value={item.connector} placeholder="Connector / API" onChange={(event) => patch({ architecture: draft.architecture.map((row, i) => (i === index ? { ...row, connector: event.target.value } : row)) })} />
                <select className="crm-select" value={item.mappingStatus} onChange={(event) => patch({ architecture: draft.architecture.map((row, i) => (i === index ? { ...row, mappingStatus: event.target.value as SysArchitectureRow["mappingStatus"] } : row)) })}>
                  {SYS_MAPPING_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {SYS_MAPPING_STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.owner} placeholder="Owner" onChange={(event) => patch({ architecture: draft.architecture.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                <select className="crm-select" value={item.risk} onChange={(event) => patch({ architecture: draft.architecture.map((row, i) => (i === index ? { ...row, risk: event.target.value as SysRisk } : row)) })}>
                  {SYS_RISKS.map((risk) => (
                    <option key={risk} value={risk}>
                      {SYS_RISK_LABEL[risk]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.notes} placeholder="Notes" onChange={(event) => patch({ architecture: draft.architecture.map((row, i) => (i === index ? { ...row, notes: event.target.value } : row)) })} />
                <button type="button" className="crm-users-secondary" onClick={() => patch({ architecture: draft.architecture.filter((_, i) => i !== index) })}>
                  ลบ
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ architecture: [...draft.architecture, emptyArchitectureRow()] })}>
              เพิ่ม data flow
            </button>
          </div>
        ) : null}

        {tab === "mapping" ? (
          <div className="web-ops-list" role="tabpanel" id="sys-panel-mapping" aria-labelledby="sys-tab-mapping">
            {draft.mapping.map((item, index) => (
              <article key={item.id || index} className="web-ops-list-row">
                <input className="crm-field" value={item.sourceField} placeholder="Source field" onChange={(event) => patch({ mapping: draft.mapping.map((row, i) => (i === index ? { ...row, sourceField: event.target.value } : row)) })} />
                <input className="crm-field" value={item.destinationField} placeholder="Destination field" onChange={(event) => patch({ mapping: draft.mapping.map((row, i) => (i === index ? { ...row, destinationField: event.target.value } : row)) })} />
                <input className="crm-field" value={item.businessMeaning} placeholder="Business meaning" onChange={(event) => patch({ mapping: draft.mapping.map((row, i) => (i === index ? { ...row, businessMeaning: event.target.value } : row)) })} />
                <input className="crm-field" value={item.formatType} placeholder="Format / type" onChange={(event) => patch({ mapping: draft.mapping.map((row, i) => (i === index ? { ...row, formatType: event.target.value } : row)) })} />
                <select className="crm-select" value={item.required} onChange={(event) => patch({ mapping: draft.mapping.map((row, i) => (i === index ? { ...row, required: event.target.value as SysMappingRow["required"] } : row)) })}>
                  {SYS_FIELD_REQUIRED.map((req) => (
                    <option key={req} value={req}>
                      {SYS_FIELD_REQUIRED_LABEL[req]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.example} placeholder="Example sample value" onChange={(event) => patch({ mapping: draft.mapping.map((row, i) => (i === index ? { ...row, example: event.target.value } : row)) })} />
                <select className="crm-select" value={item.mappingStatus} onChange={(event) => patch({ mapping: draft.mapping.map((row, i) => (i === index ? { ...row, mappingStatus: event.target.value as SysMappingRow["mappingStatus"] } : row)) })}>
                  {SYS_MAPPING_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {SYS_MAPPING_STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.owner} placeholder="Owner" onChange={(event) => patch({ mapping: draft.mapping.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                <input className="crm-field" value={item.providerDependency} placeholder="Provider dependency" onChange={(event) => patch({ mapping: draft.mapping.map((row, i) => (i === index ? { ...row, providerDependency: event.target.value } : row)) })} />
                <input className="crm-field" value={item.notes} placeholder="Notes" onChange={(event) => patch({ mapping: draft.mapping.map((row, i) => (i === index ? { ...row, notes: event.target.value } : row)) })} />
                <button type="button" className="crm-users-secondary" onClick={() => patch({ mapping: draft.mapping.filter((_, i) => i !== index) })}>
                  ลบ
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ mapping: [...draft.mapping, emptyMappingRow()] })}>
              เพิ่ม mapping
            </button>
          </div>
        ) : null}

        {tab === "readiness" ? (
          <div className="web-ops-list" role="tabpanel" id="sys-panel-readiness" aria-labelledby="sys-tab-readiness">
            {draft.readinessItems.map((item, index) => (
              <article key={item.id || index} className="web-ops-list-row">
                <select className="crm-select" value={item.area} onChange={(event) => patch({ readinessItems: draft.readinessItems.map((row, i) => (i === index ? { ...row, area: event.target.value as SysReadinessRow["area"] } : row)) })}>
                  {SYS_READINESS_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {SYS_READINESS_AREA_LABEL[area]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.question} placeholder="Question" onChange={(event) => patch({ readinessItems: draft.readinessItems.map((row, i) => (i === index ? { ...row, question: event.target.value } : row)) })} />
                <input className="crm-field" value={item.evidence} placeholder="Evidence" onChange={(event) => patch({ readinessItems: draft.readinessItems.map((row, i) => (i === index ? { ...row, evidence: event.target.value } : row)) })} />
                <select className="crm-select" value={item.status} onChange={(event) => patch({ readinessItems: draft.readinessItems.map((row, i) => (i === index ? { ...row, status: event.target.value as SysReadiness } : row)) })}>
                  {SYS_READINESS.map((status) => (
                    <option key={status} value={status}>
                      {SYS_READINESS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.owner} placeholder="Owner" onChange={(event) => patch({ readinessItems: draft.readinessItems.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                <input className="crm-field" value={item.nextAction} placeholder="Next action" onChange={(event) => patch({ readinessItems: draft.readinessItems.map((row, i) => (i === index ? { ...row, nextAction: event.target.value } : row)) })} />
                <input className="crm-field" type="date" value={item.dueAt} onChange={(event) => patch({ readinessItems: draft.readinessItems.map((row, i) => (i === index ? { ...row, dueAt: event.target.value } : row)) })} />
                <select className="crm-select" value={item.approvalStatus} onChange={(event) => patch({ readinessItems: draft.readinessItems.map((row, i) => (i === index ? { ...row, approvalStatus: event.target.value as SysApprovalStatus } : row)) })}>
                  {SYS_APPROVAL_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {SYS_APPROVAL_LABEL[status]}
                    </option>
                  ))}
                </select>
                <button type="button" className="crm-users-secondary" onClick={() => patch({ readinessItems: draft.readinessItems.filter((_, i) => i !== index) })}>
                  ลบ
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ readinessItems: [...draft.readinessItems, emptyReadinessRow()] })}>
              เพิ่ม readiness
            </button>
          </div>
        ) : null}

        {tab === "configuration" ? (
          <div role="tabpanel" id="sys-panel-configuration" aria-labelledby="sys-tab-configuration">
            <p className="b2b-muted">บันทึกขั้นตอนการตั้งค่าตามสิทธิ์ที่ได้รับ ไม่เก็บรหัสผ่านหรือคีย์</p>
            <SectionEditor value={draft.configuration} onChange={(configuration) => patch({ configuration })} addLabel="เพิ่มขั้นตอนการตั้งค่า" />
          </div>
        ) : null}

        {tab === "testing" ? (
          <div className="web-ops-list" role="tabpanel" id="sys-panel-testing" aria-labelledby="sys-tab-testing">
            {draft.tests.map((item, index) => (
              <article key={item.id || index} className="web-ops-list-row">
                <input className="crm-field" value={item.testCase} placeholder="Test case" onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, testCase: event.target.value } : row)) })} />
                <input className="crm-field" value={item.trigger} placeholder="Trigger / input" onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, trigger: event.target.value } : row)) })} />
                <input className="crm-field" value={item.expected} placeholder="Expected result" onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, expected: event.target.value } : row)) })} />
                <input className="crm-field" value={item.actual} placeholder="Actual result" onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, actual: event.target.value } : row)) })} />
                <select className="crm-select" value={item.status} onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, status: event.target.value as SysTestCaseRow["status"] } : row)) })}>
                  {SYS_TEST_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {SYS_TEST_STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <select className="crm-select" value={item.severity} onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, severity: event.target.value as SysTestCaseRow["severity"] } : row)) })}>
                  {SYS_SEVERITIES.map((severity) => (
                    <option key={severity} value={severity}>
                      {SYS_SEVERITY_LABEL[severity]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.owner} placeholder="Owner" onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                <input className="crm-field" value={item.providerDependency} placeholder="Provider dependency" onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, providerDependency: event.target.value } : row)) })} />
                <input className="crm-field" value={item.evidence} placeholder="Evidence" onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, evidence: event.target.value } : row)) })} />
                <input className="crm-field" type="date" value={item.testedAt} onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, testedAt: event.target.value } : row)) })} />
                <input className="crm-field" type="date" value={item.retestAt} onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, retestAt: event.target.value } : row)) })} />
                <input className="crm-field" value={item.notes} placeholder="Notes" onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, notes: event.target.value } : row)) })} />
                <button type="button" className="crm-users-secondary" onClick={() => patch({ tests: draft.tests.filter((_, i) => i !== index) })}>
                  ลบ
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ tests: [...draft.tests, emptyTestCase()] })}>
              เพิ่ม test case
            </button>
          </div>
        ) : null}

        {tab === "issues" ? (
          <div className="web-ops-list" role="tabpanel" id="sys-panel-issues" aria-labelledby="sys-tab-issues">
            {draft.issues.map((item, index) => (
              <article key={item.id || index} className="web-ops-list-row">
                <input className="crm-field" value={item.issue} placeholder="Issue" onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, issue: event.target.value } : row)) })} />
                <input className="crm-field" value={item.project} placeholder="Project" onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, project: event.target.value } : row)) })} />
                <input className="crm-field" value={item.system} placeholder="System" onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, system: event.target.value } : row)) })} />
                <select className="crm-select" value={item.severity} onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, severity: event.target.value as SysIssueRow["severity"] } : row)) })}>
                  {SYS_SEVERITIES.map((severity) => (
                    <option key={severity} value={severity}>
                      {SYS_SEVERITY_LABEL[severity]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" value={item.impact} placeholder="Impact" onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, impact: event.target.value } : row)) })} />
                <input className="crm-field" value={item.owner} placeholder="Owner" onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                <input className="crm-field" value={item.provider} placeholder="Provider" onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, provider: event.target.value } : row)) })} />
                <select className="crm-select" value={item.status} onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, status: event.target.value as SysIssueRow["status"] } : row)) })}>
                  {SYS_ISSUE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {SYS_ISSUE_STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <input className="crm-field" type="date" value={item.openedAt} onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, openedAt: event.target.value } : row)) })} />
                <input className="crm-field" type="date" value={item.dueAt} onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, dueAt: event.target.value } : row)) })} />
                <input className="crm-field" value={item.resolution} placeholder="Resolution" onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, resolution: event.target.value } : row)) })} />
                <input className="crm-field" value={item.evidence} placeholder="Evidence" onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, evidence: event.target.value } : row)) })} />
                <input className="crm-field" value={item.notes} placeholder="Notes" onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, notes: event.target.value } : row)) })} />
                <button type="button" className="crm-users-secondary" onClick={() => patch({ issues: draft.issues.filter((_, i) => i !== index) })}>
                  ลบ
                </button>
              </article>
            ))}
            <button type="button" className="kpi-button b2b-save" onClick={() => patch({ issues: [...draft.issues, emptyIssue(draft.projectName || draft.hotelName)] })}>
              เพิ่ม issue
            </button>
          </div>
        ) : null}

        {tab === "distribution" ? (
          <div role="tabpanel" id="sys-panel-distribution" aria-labelledby="sys-tab-distribution">
            <p className="b2b-muted">Booking Engine / Distribution — ช่องทาง ห้องว่าง และเส้นทางจอง ไม่เก็บรหัสการจองหรือข้อมูลแขก</p>
            <SectionEditor value={draft.distributionOps} onChange={(distributionOps) => patch({ distributionOps })} addLabel="เพิ่มงาน Distribution" />
          </div>
        ) : null}

        {tab === "analytics" ? (
          <div role="tabpanel" id="sys-panel-analytics" aria-labelledby="sys-tab-analytics">
            <SectionEditor value={draft.analyticsNotes} onChange={(analyticsNotes) => patch({ analyticsNotes })} addLabel="เพิ่มงาน Analytics" />
            <Field label="Primary KPI">
              <input className="crm-field" value={draft.primaryKpi} onChange={(event) => patch({ primaryKpi: event.target.value })} />
            </Field>
            <Field label="KPI target">
              <input className="crm-field" value={draft.kpiTarget} onChange={(event) => patch({ kpiTarget: event.target.value })} />
            </Field>
            <Field label="KPI review cadence">
              <select className="crm-select" value={draft.kpiCadence} onChange={(event) => patch({ kpiCadence: event.target.value as SysCadence })}>
                {SYS_CADENCES.map((item) => (
                  <option key={item} value={item}>
                    {SYS_CADENCE_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Data status">
              <select className="crm-select" value={draft.dataStatus} onChange={(event) => patch({ dataStatus: event.target.value as SysKpiDataStatus })}>
                {SYS_KPI_DATA_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {SYS_KPI_DATA_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <div className="web-ops-list">
              {draft.kpis.map((item, index) => (
                <article key={item.id || index} className="web-ops-list-row">
                  <input className="crm-field" value={item.name} placeholder="KPI name" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, name: event.target.value } : row)) })} />
                  <select className="crm-select" value={item.area} onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, area: event.target.value as SysKpiView["area"] } : row)) })}>
                    {SYS_KPI_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {SYS_KPI_AREA_LABEL[area]}
                      </option>
                    ))}
                  </select>
                  <input className="crm-field" value={item.value} placeholder="Value" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, value: event.target.value } : row)) })} />
                  <input className="crm-field" value={item.definition} placeholder="Unit / definition" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, definition: event.target.value } : row)) })} />
                  <input className="crm-field" value={item.period} placeholder="Period" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, period: event.target.value } : row)) })} />
                  <input className="crm-field" value={item.source} placeholder="Source" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, source: event.target.value } : row)) })} />
                  <select className="crm-select" value={item.dataStatus} onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, dataStatus: event.target.value as SysKpiView["dataStatus"] } : row)) })}>
                    {SYS_KPI_DATA_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {SYS_KPI_DATA_STATUS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                  <input className="crm-field" value={item.target} placeholder="Target" onChange={(event) => patch({ kpis: draft.kpis.map((row, i) => (i === index ? { ...row, target: event.target.value } : row)) })} />
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
          </div>
        ) : null}

        {tab === "handover" ? (
          <div role="tabpanel" id="sys-panel-handover" aria-labelledby="sys-tab-handover">
            <ReadinessSelect value={draft.handoverStatus} onChange={(handoverStatus) => patch({ handoverStatus })} label="Handover status" />
            <div className="web-ops-list">
              {draft.handoverAssets.map((item, index) => (
                <article key={item.id || index} className="web-ops-list-row">
                  <input className="crm-field" value={item.asset} placeholder="Asset / system" onChange={(event) => patch({ handoverAssets: draft.handoverAssets.map((row, i) => (i === index ? { ...row, asset: event.target.value } : row)) })} />
                  <input className="crm-field" value={item.owner} placeholder="Owner" onChange={(event) => patch({ handoverAssets: draft.handoverAssets.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                  <input className="crm-field" value={item.technicalContact} placeholder="Technical contact" onChange={(event) => patch({ handoverAssets: draft.handoverAssets.map((row, i) => (i === index ? { ...row, technicalContact: event.target.value } : row)) })} />
                  <input className="crm-field" value={item.approvalAuthority} placeholder="Approval authority" onChange={(event) => patch({ handoverAssets: draft.handoverAssets.map((row, i) => (i === index ? { ...row, approvalAuthority: event.target.value } : row)) })} />
                  <input className="crm-field" value={item.accessLevel} placeholder="Access level" onChange={(event) => patch({ handoverAssets: draft.handoverAssets.map((row, i) => (i === index ? { ...row, accessLevel: event.target.value } : row)) })} />
                  <select className="crm-select" value={item.documentationStatus} onChange={(event) => patch({ handoverAssets: draft.handoverAssets.map((row, i) => (i === index ? { ...row, documentationStatus: event.target.value as SysHandoverAsset["documentationStatus"] } : row)) })}>
                    {SYS_DOC_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {SYS_DOC_STATUS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                  <select className="crm-select" value={item.sopStatus} onChange={(event) => patch({ handoverAssets: draft.handoverAssets.map((row, i) => (i === index ? { ...row, sopStatus: event.target.value as SysHandoverAsset["sopStatus"] } : row)) })}>
                    {SYS_DOC_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        SOP: {SYS_DOC_STATUS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                  <select className="crm-select" value={item.trainingStatus} onChange={(event) => patch({ handoverAssets: draft.handoverAssets.map((row, i) => (i === index ? { ...row, trainingStatus: event.target.value as SysHandoverAsset["trainingStatus"] } : row)) })}>
                    {SYS_DOC_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        Training: {SYS_DOC_STATUS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                  <select className="crm-select" value={item.goLiveStatus} onChange={(event) => patch({ handoverAssets: draft.handoverAssets.map((row, i) => (i === index ? { ...row, goLiveStatus: event.target.value as SysReadiness } : row)) })}>
                    {SYS_READINESS.map((status) => (
                      <option key={status} value={status}>
                        Go-live: {SYS_READINESS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                  <input className="crm-field" type="date" value={item.lastReviewed} onChange={(event) => patch({ handoverAssets: draft.handoverAssets.map((row, i) => (i === index ? { ...row, lastReviewed: event.target.value } : row)) })} />
                  <button type="button" className="crm-users-secondary" onClick={() => patch({ handoverAssets: draft.handoverAssets.filter((_, i) => i !== index) })}>
                    ลบ
                  </button>
                </article>
              ))}
              <button type="button" className="kpi-button b2b-save" onClick={() => patch({ handoverAssets: [...draft.handoverAssets, emptyHandoverAsset()] })}>
                เพิ่มสินทรัพย์ส่งมอบ
              </button>
            </div>
          </div>
        ) : null}

        {tab === "approvals" ? (
          <div role="tabpanel" id="sys-panel-approvals" aria-labelledby="sys-tab-approvals">
            <Field label="Hotel approver">
              <input className="crm-field" value={draft.hotelApprover} onChange={(event) => patch({ hotelApprover: event.target.value })} />
            </Field>
            <div className="web-ops-list">
              {draft.approvals.map((item, index) => (
                <article key={item.id || index} className="web-ops-list-row">
                  <input className="crm-field" value={item.kind} placeholder="ประเภทการอนุมัติ" onChange={(event) => patch({ approvals: draft.approvals.map((row, i) => (i === index ? { ...row, kind: event.target.value } : row)) })} />
                  <select className="crm-select" value={item.status} onChange={(event) => patch({ approvals: draft.approvals.map((row, i) => (i === index ? { ...row, status: event.target.value as SysApprovalStatus } : row)) })}>
                    {SYS_APPROVAL_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {SYS_APPROVAL_LABEL[status]}
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
          <div role="tabpanel" id="sys-panel-files" aria-labelledby="sys-tab-files">
            <Field label="บันทึกภายใน">
              <textarea className="crm-area" rows={4} value={draft.notes} onChange={(event) => patch({ notes: event.target.value })} />
            </Field>
            <div className="web-ops-list">
              {draft.fileNotes.map((item, index) => (
                <article key={item.id || index} className="web-ops-list-row">
                  <input className="crm-field" value={item.name} placeholder="ชื่อไฟล์ / เอกสาร" onChange={(event) => patch({ fileNotes: draft.fileNotes.map((row, i) => (i === index ? { ...row, name: event.target.value } : row)) })} />
                  <input className="crm-field" value={item.caption} placeholder="คำอธิบาย" onChange={(event) => patch({ fileNotes: draft.fileNotes.map((row, i) => (i === index ? { ...row, caption: event.target.value } : row)) })} />
                  <select className="crm-select" value={item.status} onChange={(event) => patch({ fileNotes: draft.fileNotes.map((row, i) => (i === index ? { ...row, status: event.target.value as SysReadiness } : row)) })}>
                    {SYS_READINESS.map((status) => (
                      <option key={status} value={status}>
                        {SYS_READINESS_LABEL[status]}
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
          <ul className="meta-ops-history seo-history" role="tabpanel" id="sys-panel-history" aria-labelledby="sys-tab-history">
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
