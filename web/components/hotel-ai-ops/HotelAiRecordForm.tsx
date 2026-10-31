"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Field, SaveBar, toDateInput } from "@/components/b2b-ops/ui";
import {
  HAI_APPROACH_LABEL,
  HAI_APPROACHES,
  HAI_APPROVAL_LABEL,
  HAI_APPROVAL_STATUSES,
  HAI_DATA_CLASS_LABEL,
  HAI_DATA_CLASSES,
  HAI_DEPARTMENTS,
  HAI_FORM_TAB_LABEL,
  HAI_FORM_TABS,
  HAI_ISSUE_STATUS_LABEL,
  HAI_ISSUE_STATUSES,
  HAI_PILOT_DECISION_LABEL,
  HAI_PILOT_DECISIONS,
  HAI_PRIORITIES,
  HAI_PRIORITY_LABEL,
  HAI_RISK_LABEL,
  HAI_RISKS,
  HAI_SOP_STATUS_LABEL,
  HAI_SOP_STATUSES,
  HAI_STATUS_LABEL,
  HAI_STATUSES,
  HAI_TEST_STATUS_LABEL,
  HAI_TEST_STATUSES,
  MASKED_VALUE,
  departmentLabel,
  emptyDataAccess,
  emptyHandover,
  emptyIssue,
  emptyMetric,
  emptyPilotCharter,
  emptyTestCase,
  emptyUseCase,
  webSectionFormTab,
  type HaiAccessView,
  type HaiApproach,
  type HaiApprovalView,
  type HaiDataAccessRow,
  type HaiDataClass,
  type HaiExtraDepartment,
  type HaiFormTab,
  type HaiHandoverRow,
  type HaiIssueRow,
  type HaiMetricRow,
  type HaiPilotCharter,
  type HaiPriority,
  type HaiRisk,
  type HaiSection,
  type HaiSettings,
  type HaiStatus,
  type HaiTestCaseRow,
  type HaiUseCaseRow,
  type HaiWorkflowRow,
} from "@/lib/hotel-ai-ops/types";
import { HotelAiSubtasksPanel, type HaiSubtaskDraft } from "./HotelAiSubtasksPanel";
import type { HaiSubtaskView } from "@/lib/hotel-ai-ops/types";

type Staff = { id: string; name: string };

export type HaiRecordDraft = {
  id: string;
  name: string;
  hotelName: string;
  department: string;
  ownerId: string;
  problem: string;
  currentProcess: string;
  frequency: string;
  systems: string;
  dataClass: HaiDataClass;
  sourceOfTruth: string;
  manualSteps: string;
  exceptions: string;
  userImpact: string;
  objective: string;
  status: HaiStatus;
  priority: HaiPriority;
  approach: HaiApproach;
  reviewer: string;
  fallback: string;
  risk: HaiRisk;
  nextAction: string;
  nextActionAt: string;
  vaultRef: string;
  notes: string;
  charter: HaiPilotCharter;
  useCases: HaiUseCaseRow[];
  dataAccess: HaiDataAccessRow[];
  tests: HaiTestCaseRow[];
  issues: HaiIssueRow[];
  metrics: HaiMetricRow[];
  handover: HaiHandoverRow[];
  approvals: HaiApprovalView[];
};

export function emptyHaiDraft(ownerId = "", department = "operations"): HaiRecordDraft {
  return {
    id: "",
    name: "",
    hotelName: "",
    department,
    ownerId,
    problem: "",
    currentProcess: "",
    frequency: "",
    systems: "",
    dataClass: "internal",
    sourceOfTruth: "",
    manualSteps: "",
    exceptions: "",
    userImpact: "",
    objective: "",
    status: "backlog",
    priority: "normal",
    approach: "do_not_automate",
    reviewer: "",
    fallback: "",
    risk: "medium",
    nextAction: "",
    nextActionAt: "",
    vaultRef: "",
    notes: "",
    charter: emptyPilotCharter(),
    useCases: [],
    dataAccess: [],
    tests: [],
    issues: [],
    metrics: [],
    handover: [],
    approvals: [],
  };
}

export function draftFromHaiRow(row: HaiWorkflowRow): HaiRecordDraft {
  return {
    id: row.id,
    name: row.name,
    hotelName: row.hotelName,
    department: row.department,
    ownerId: row.ownerId,
    problem: row.problem,
    currentProcess: row.currentProcess,
    frequency: row.frequency,
    systems: row.systems,
    dataClass: row.dataClass,
    sourceOfTruth: row.sourceOfTruth,
    manualSteps: row.manualSteps,
    exceptions: row.exceptions,
    userImpact: row.userImpact,
    objective: row.objective,
    status: row.status,
    priority: row.priority,
    approach: row.approach,
    reviewer: row.reviewer,
    fallback: row.fallback,
    risk: row.risk,
    nextAction: row.nextAction,
    nextActionAt: toDateInput(row.nextActionAt),
    vaultRef: row.vaultRef,
    notes: row.notes,
    charter: { ...row.charter, startDate: toDateInput(row.charter.startDate), endDate: toDateInput(row.charter.endDate), reviewDate: toDateInput(row.charter.reviewDate) },
    useCases: row.useCases,
    dataAccess: row.dataAccess,
    tests: row.tests,
    issues: row.issues.map((item) => ({ ...item, dueAt: toDateInput(item.dueAt) })),
    metrics: row.metrics,
    handover: row.handover,
    approvals: row.approvals,
  };
}

function RepeatBlock({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <div className="ads-form-panel">
      <div className="b2b-row-actions">
        <strong>{title}</strong>
        <button type="button" className="crm-users-secondary" onClick={onAdd}>
          เพิ่มแถว
        </button>
      </div>
      {children}
    </div>
  );
}

export function HotelAiRecordForm({
  draft,
  row,
  staff,
  access,
  settings,
  section,
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
  onPatchSubtask,
  onDeleteSubtask,
  onAddDuty,
  onReviewerNote,
  onApprovePilot,
  onRejectPilot,
  onEscalate,
  onArchive,
}: {
  draft: HaiRecordDraft;
  row?: HaiWorkflowRow;
  staff: Staff[];
  access: HaiAccessView;
  settings: HaiSettings;
  section: HaiSection;
  pending: boolean;
  ok: string;
  error: string;
  onChange: (draft: HaiRecordDraft) => void;
  onSave: () => void;
  onClose: () => void;
  subtaskDraft: HaiSubtaskDraft;
  subtaskComment: string;
  onSubtaskDraftChange: (draft: HaiSubtaskDraft) => void;
  onSubtaskCommentChange: (value: string) => void;
  onSaveSubtask: () => void;
  onCompleteSubtask: (item: HaiSubtaskView, completed: boolean) => void;
  onAddSubtaskComment: (subtaskId: string) => void;
  onPatchSubtask: (item: HaiSubtaskView, patch: Partial<HaiSubtaskDraft>) => void;
  onDeleteSubtask: (item: HaiSubtaskView) => void;
  onAddDuty?: (department: string, name: string) => void;
  onReviewerNote?: (subtaskId: string, notes: string, reviewerId: string) => void;
  onApprovePilot?: () => void;
  onRejectPilot?: () => void;
  onEscalate?: () => void;
  onArchive?: () => void;
}) {
  const [tab, setTab] = useState<HaiFormTab>(webSectionFormTab(section));
  const [dirty, setDirty] = useState(false);
  const extras = settings.extraDepartments;
  const departments = [...HAI_DEPARTMENTS, ...extras.map((item) => item.id)];
  const patch = (next: Partial<HaiRecordDraft>) => {
    setDirty(true);
    onChange({ ...draft, ...next });
  };
  const patchCharter = (next: Partial<HaiPilotCharter>) => patch({ charter: { ...draft.charter, ...next } });
  useEffect(() => {
    if (ok || error) setDirty(false);
  }, [ok, error]);
  const saveBar = (
    <SaveBar
      pending={pending}
      ok={ok}
      error={error}
      dirty={dirty}
      idle={dirty ? "มีการแก้ไขที่ยังไม่บันทึก / Unsaved changes" : "พร้อมบันทึก / Ready to save"}
      onSave={onSave}
      saveLabel={draft.id ? "บันทึก" : "สร้างเวิร์กโฟลว์"}
    />
  );
  const vaultValue = access.canSeePrivateIds || !draft.vaultRef ? draft.vaultRef : MASKED_VALUE;

  return (
    <div className="crm-modal ads-drawer" role="presentation">
      <button type="button" className="crm-modal-backdrop" aria-label="ปิดฟอร์ม" onClick={onClose} />
      <div className="crm-modal-panel crm-modal-panel-user web-ops-drawer" role="dialog" aria-modal="true" aria-labelledby="hai-record-title">
        <div className="crm-modal-head">
          <div>
            <p className="crm-modal-eyebrow">Hotel AI & Automation Workflow</p>
            <h2 id="hai-record-title">{draft.id ? draft.name || draft.hotelName || "แก้ไขเวิร์กโฟลว์" : "เวิร์กโฟลว์ใหม่"}</h2>
            <p className="b2b-muted">บันทึกด้วยตนเองเท่านั้น ไม่มีการนำเข้าข้อมูล ห้ามใส่คีย์ รหัสผ่าน ข้อมูลแขก หรือข้อมูลชำระเงิน — ใส่ลิงก์คลังรหัสที่อนุมัติแล้วเท่านั้น</p>
          </div>
          <button type="button" className="crm-users-secondary" onClick={onClose}>
            ปิด
          </button>
        </div>
        {saveBar}
        {draft.id && access.canEditBoard && onArchive ? (
          <div className="b2b-row-actions">
            <button type="button" className="crm-users-secondary" onClick={onArchive}>
              Archive
            </button>
          </div>
        ) : null}
        <div className="ads-form-tabs" role="tablist" aria-label="ส่วนของฟอร์ม Hotel AI Workflow">
          {HAI_FORM_TABS.map((item) => (
            <button
              key={item}
              id={`hai-tab-${item}`}
              type="button"
              role="tab"
              aria-selected={tab === item}
              aria-controls={`hai-panel-${item}`}
              tabIndex={tab === item ? 0 : -1}
              className={tab === item ? "is-active" : undefined}
              onClick={() => setTab(item)}
            >
              {HAI_FORM_TAB_LABEL[item]}
            </button>
          ))}
        </div>

        {tab === "workflow" ? (
          <>
          <div className="b2b-form-grid" role="tabpanel" id="hai-panel-workflow" aria-labelledby="hai-tab-workflow">
            <Field label="Workflow name">
              <input className="crm-field" value={draft.name} onChange={(event) => patch({ name: event.target.value })} />
            </Field>
            <Field label="Property / hotel">
              <input className="crm-field" value={draft.hotelName} onChange={(event) => patch({ hotelName: event.target.value, name: draft.name || event.target.value })} />
            </Field>
            <Field label="Department">
              <select className="crm-select" value={draft.department} onChange={(event) => patch({ department: event.target.value })}>
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {departmentLabel(item, extras)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Workflow owner">
              <select className="crm-select" value={draft.ownerId} onChange={(event) => patch({ ownerId: event.target.value })}>
                <option value="">ยังไม่มอบหมาย</option>
                {staff.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Problem statement">
              <textarea className="crm-field" rows={3} value={draft.problem} onChange={(event) => patch({ problem: event.target.value })} />
            </Field>
            <Field label="Current process">
              <textarea className="crm-field" rows={3} value={draft.currentProcess} onChange={(event) => patch({ currentProcess: event.target.value })} />
            </Field>
            <Field label="Frequency / workload">
              <input className="crm-field" value={draft.frequency} onChange={(event) => patch({ frequency: event.target.value })} />
            </Field>
            <Field label="Systems / channels involved">
              <input className="crm-field" value={draft.systems} onChange={(event) => patch({ systems: event.target.value })} />
            </Field>
            <Field label="Data classification">
              <select className="crm-select" value={draft.dataClass} onChange={(event) => patch({ dataClass: event.target.value as HaiDataClass })}>
                {HAI_DATA_CLASSES.map((item) => (
                  <option key={item} value={item}>
                    {HAI_DATA_CLASS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Source of truth">
              <input className="crm-field" value={draft.sourceOfTruth} onChange={(event) => patch({ sourceOfTruth: event.target.value })} />
            </Field>
            <Field label="Current manual steps">
              <textarea className="crm-field" rows={3} value={draft.manualSteps} onChange={(event) => patch({ manualSteps: event.target.value })} />
            </Field>
            <Field label="Exceptions">
              <textarea className="crm-field" rows={3} value={draft.exceptions} onChange={(event) => patch({ exceptions: event.target.value })} />
            </Field>
            <Field label="User impact">
              <textarea className="crm-field" rows={2} value={draft.userImpact} onChange={(event) => patch({ userImpact: event.target.value })} />
            </Field>
            <Field label="Business objective">
              <textarea className="crm-field" rows={2} value={draft.objective} onChange={(event) => patch({ objective: event.target.value })} />
            </Field>
            <Field label="Status">
              <select className="crm-select" value={draft.status} onChange={(event) => patch({ status: event.target.value as HaiStatus })}>
                {HAI_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {HAI_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Priority">
              <select className="crm-select" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as HaiPriority })}>
                {HAI_PRIORITIES.map((item) => (
                  <option key={item} value={item}>
                    {HAI_PRIORITY_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Proposed approach">
              <select className="crm-select" value={draft.approach} onChange={(event) => patch({ approach: event.target.value as HaiApproach })}>
                {HAI_APPROACHES.map((item) => (
                  <option key={item} value={item}>
                    {HAI_APPROACH_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Human reviewer">
              <input className="crm-field" value={draft.reviewer} onChange={(event) => patch({ reviewer: event.target.value })} />
            </Field>
            <Field label="Fallback / manual process">
              <textarea className="crm-field" rows={2} value={draft.fallback} onChange={(event) => patch({ fallback: event.target.value })} />
            </Field>
            <Field label="Risk level">
              <select className="crm-select" value={draft.risk} onChange={(event) => patch({ risk: event.target.value as HaiRisk })}>
                {HAI_RISKS.map((item) => (
                  <option key={item} value={item}>
                    {HAI_RISK_LABEL[item]}
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
            <Field
              label="Approved secret vault (link or name only)"
              hint={settings.secretVaultUrl ? `Use ${settings.secretVaultLabel || "the approved vault"} — never paste keys.` : "Never store secrets here. Add a vault URL in Settings."}
            >
              <input
                className="crm-field"
                value={vaultValue}
                readOnly={!access.canSeePrivateIds}
                onChange={(event) => access.canSeePrivateIds && patch({ vaultRef: event.target.value })}
                placeholder={settings.secretVaultUrl || "Vault item name or https://…"}
              />
            </Field>
            <Field label="Internal notes">
              <textarea className="crm-field" rows={3} value={draft.notes} onChange={(event) => patch({ notes: event.target.value })} />
            </Field>
            {row ? (
              <p className="b2b-muted">
                Created {toDateInput(row.createdAt) || "—"} · Updated {toDateInput(row.updatedAt) || "—"}
              </p>
            ) : null}
          </div>
          {row ? (
            <HotelAiSubtasksPanel
              row={row}
              staff={staff}
              access={access}
              extras={extras}
              pending={pending}
              draft={subtaskDraft}
              comment={subtaskComment}
              saveState={ok}
              saveError={error}
              onDraftChange={onSubtaskDraftChange}
              onCommentChange={onSubtaskCommentChange}
              onSave={onSaveSubtask}
              onComplete={onCompleteSubtask}
              onAddComment={onAddSubtaskComment}
              onPatchSubtask={onPatchSubtask}
              onDelete={onDeleteSubtask}
              onAddDuty={onAddDuty}
              onReviewerNote={onReviewerNote}
            />
          ) : (
            <p className="b2b-muted">บันทึกเวิร์กโฟลว์ก่อนจึงจะเพิ่มงานย่อยได้ (1–10 รายการต่อเวิร์กโฟลว์)</p>
          )}
        </>
        ) : null}

        {tab === "charter" ? (
          <div className="b2b-form-grid" role="tabpanel" id="hai-panel-charter" aria-labelledby="hai-tab-charter">
            <Field label="Pilot scope">
              <textarea className="crm-field" rows={3} value={draft.charter.scope} onChange={(event) => patchCharter({ scope: event.target.value })} />
            </Field>
            <Field label="Baseline period">
              <input className="crm-field" value={draft.charter.baselinePeriod} onChange={(event) => patchCharter({ baselinePeriod: event.target.value })} />
            </Field>
            <Field label="Baseline method">
              <textarea className="crm-field" rows={2} value={draft.charter.baselineMethod} onChange={(event) => patchCharter({ baselineMethod: event.target.value })} />
            </Field>
            <Field label="Approved data sources">
              <textarea className="crm-field" rows={2} value={draft.charter.approvedDataSources} onChange={(event) => patchCharter({ approvedDataSources: event.target.value })} />
            </Field>
            <Field label="Prohibited data">
              <textarea className="crm-field" rows={2} value={draft.charter.prohibitedData} onChange={(event) => patchCharter({ prohibitedData: event.target.value })} />
            </Field>
            <Field label="Pilot users">
              <input className="crm-field" value={draft.charter.pilotUsers} onChange={(event) => patchCharter({ pilotUsers: event.target.value })} />
            </Field>
            <Field label="Success criteria">
              <textarea className="crm-field" rows={2} value={draft.charter.successCriteria} onChange={(event) => patchCharter({ successCriteria: event.target.value })} />
            </Field>
            <Field label="Quality threshold">
              <input className="crm-field" value={draft.charter.qualityThreshold} onChange={(event) => patchCharter({ qualityThreshold: event.target.value })} />
            </Field>
            <Field label="Error / stop threshold">
              <input className="crm-field" value={draft.charter.errorStopThreshold} onChange={(event) => patchCharter({ errorStopThreshold: event.target.value })} />
            </Field>
            <Field label="Human-review rule">
              <textarea className="crm-field" rows={2} value={draft.charter.humanReviewRule} onChange={(event) => patchCharter({ humanReviewRule: event.target.value })} />
            </Field>
            <Field label="Fallback plan">
              <textarea className="crm-field" rows={2} value={draft.charter.fallbackPlan} onChange={(event) => patchCharter({ fallbackPlan: event.target.value })} />
            </Field>
            <Field label="Start date">
              <input className="crm-field" type="date" value={draft.charter.startDate} onChange={(event) => patchCharter({ startDate: event.target.value })} />
            </Field>
            <Field label="End date">
              <input className="crm-field" type="date" value={draft.charter.endDate} onChange={(event) => patchCharter({ endDate: event.target.value })} />
            </Field>
            <Field label="Review date">
              <input className="crm-field" type="date" value={draft.charter.reviewDate} onChange={(event) => patchCharter({ reviewDate: event.target.value })} />
            </Field>
            <Field label="Decision">
              <select className="crm-select" value={draft.charter.decision} onChange={(event) => patchCharter({ decision: event.target.value as HaiPilotCharter["decision"] })}>
                {HAI_PILOT_DECISIONS.map((item) => (
                  <option key={item} value={item}>
                    {HAI_PILOT_DECISION_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Decision owner">
              <input className="crm-field" value={draft.charter.decisionOwner} onChange={(event) => patchCharter({ decisionOwner: event.target.value })} />
            </Field>
            <Field label="Approval status">
              <select
                className="crm-select"
                value={draft.charter.approvalStatus}
                onChange={(event) => patchCharter({ approvalStatus: event.target.value as HaiPilotCharter["approvalStatus"] })}
              >
                {HAI_APPROVAL_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {HAI_APPROVAL_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            {draft.id && access.canEditBoard ? (
              <div className="ads-inline-assign hai-gate-actions">
                <button type="button" className="kpi-button b2b-save" disabled={pending} onClick={onApprovePilot}>
                  Approve pilot
                </button>
                <button type="button" className="crm-users-secondary" disabled={pending} onClick={onRejectPilot}>
                  Reject pilot
                </button>
                <button type="button" className="crm-users-secondary" disabled={pending} onClick={onEscalate}>
                  Escalate
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {tab === "use_cases" ? (
          <div role="tabpanel" id="hai-panel-use_cases" aria-labelledby="hai-tab-use_cases">
            <RepeatBlock title="Use cases" onAdd={() => patch({ useCases: [...draft.useCases, emptyUseCase()] })}>
              {draft.useCases.map((item, index) => (
                <div className="b2b-form-grid" key={item.id}>
                  <Field label="Title">
                    <input className="crm-field" value={item.title} onChange={(event) => patch({ useCases: draft.useCases.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Actor">
                    <input className="crm-field" value={item.actor} onChange={(event) => patch({ useCases: draft.useCases.map((row, i) => (i === index ? { ...row, actor: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Trigger">
                    <input className="crm-field" value={item.trigger} onChange={(event) => patch({ useCases: draft.useCases.map((row, i) => (i === index ? { ...row, trigger: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Outcome">
                    <input className="crm-field" value={item.outcome} onChange={(event) => patch({ useCases: draft.useCases.map((row, i) => (i === index ? { ...row, outcome: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Notes">
                    <textarea className="crm-field" rows={2} value={item.notes} onChange={(event) => patch({ useCases: draft.useCases.map((row, i) => (i === index ? { ...row, notes: event.target.value } : row)) })} />
                  </Field>
                  <button type="button" className="crm-users-secondary" onClick={() => patch({ useCases: draft.useCases.filter((_, i) => i !== index) })}>
                    ลบแถว
                  </button>
                </div>
              ))}
              {!draft.useCases.length ? <p className="b2b-muted">ยังไม่มี use case — เพิ่มแถวแล้วกดบันทึก</p> : null}
            </RepeatBlock>
          </div>
        ) : null}

        {tab === "data" ? (
          <div role="tabpanel" id="hai-panel-data" aria-labelledby="hai-tab-data">
            <p className="hai-ops-notice">Do not store guest PII, payment data, passwords, or API keys. Link an approved vault item instead.</p>
            <RepeatBlock title="Data and access" onAdd={() => patch({ dataAccess: [...draft.dataAccess, emptyDataAccess()] })}>
              {draft.dataAccess.map((item, index) => (
                <div className="b2b-form-grid" key={item.id}>
                  <Field label="System">
                    <input className="crm-field" value={item.system} onChange={(event) => patch({ dataAccess: draft.dataAccess.map((row, i) => (i === index ? { ...row, system: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Data type">
                    <input className="crm-field" value={item.dataType} onChange={(event) => patch({ dataAccess: draft.dataAccess.map((row, i) => (i === index ? { ...row, dataType: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Classification">
                    <select
                      className="crm-select"
                      value={item.classification}
                      onChange={(event) => patch({ dataAccess: draft.dataAccess.map((row, i) => (i === index ? { ...row, classification: event.target.value as HaiDataClass } : row)) })}
                    >
                      {HAI_DATA_CLASSES.map((entry) => (
                        <option key={entry} value={entry}>
                          {HAI_DATA_CLASS_LABEL[entry]}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Access needed">
                    <input className="crm-field" value={item.accessNeeded} onChange={(event) => patch({ dataAccess: draft.dataAccess.map((row, i) => (i === index ? { ...row, accessNeeded: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Owner">
                    <input className="crm-field" value={item.owner} onChange={(event) => patch({ dataAccess: draft.dataAccess.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                  </Field>
                  <label className="crm-cms-field">
                    <span>Approved</span>
                    <input
                      type="checkbox"
                      checked={item.approved}
                      onChange={(event) => patch({ dataAccess: draft.dataAccess.map((row, i) => (i === index ? { ...row, approved: event.target.checked } : row)) })}
                    />
                  </label>
                  <button type="button" className="crm-users-secondary" onClick={() => patch({ dataAccess: draft.dataAccess.filter((_, i) => i !== index) })}>
                    ลบแถว
                  </button>
                </div>
              ))}
            </RepeatBlock>
          </div>
        ) : null}

        {tab === "tests" ? (
          <div role="tabpanel" id="hai-panel-tests" aria-labelledby="hai-tab-tests">
            <RepeatBlock title="Test cases" onAdd={() => patch({ tests: [...draft.tests, emptyTestCase()] })}>
              {draft.tests.map((item, index) => (
                <div className="b2b-form-grid" key={item.id}>
                  <Field label="Test name">
                    <input className="crm-field" value={item.name} onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, name: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Trigger">
                    <input className="crm-field" value={item.trigger} onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, trigger: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Expected">
                    <input className="crm-field" value={item.expected} onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, expected: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Actual">
                    <input className="crm-field" value={item.actual} onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, actual: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Status">
                    <select className="crm-select" value={item.status} onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, status: event.target.value as HaiTestCaseRow["status"] } : row)) })}>
                      {HAI_TEST_STATUSES.map((entry) => (
                        <option key={entry} value={entry}>
                          {HAI_TEST_STATUS_LABEL[entry]}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Evidence URL">
                    <input className="crm-field" value={item.evidence} onChange={(event) => patch({ tests: draft.tests.map((row, i) => (i === index ? { ...row, evidence: event.target.value } : row)) })} />
                  </Field>
                  <button type="button" className="crm-users-secondary" onClick={() => patch({ tests: draft.tests.filter((_, i) => i !== index) })}>
                    ลบแถว
                  </button>
                </div>
              ))}
            </RepeatBlock>
          </div>
        ) : null}

        {tab === "issues" ? (
          <div role="tabpanel" id="hai-panel-issues" aria-labelledby="hai-tab-issues">
            <RepeatBlock title="Exceptions and issues" onAdd={() => patch({ issues: [...draft.issues, emptyIssue()] })}>
              {draft.issues.map((item, index) => (
                <div className="b2b-form-grid" key={item.id}>
                  <Field label="Title">
                    <input className="crm-field" value={item.title} onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Exception">
                    <textarea className="crm-field" rows={2} value={item.exception} onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, exception: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Owner">
                    <input className="crm-field" value={item.owner} onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Status">
                    <select className="crm-select" value={item.status} onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, status: event.target.value as HaiIssueRow["status"] } : row)) })}>
                      {HAI_ISSUE_STATUSES.map((entry) => (
                        <option key={entry} value={entry}>
                          {HAI_ISSUE_STATUS_LABEL[entry]}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Risk">
                    <select className="crm-select" value={item.risk} onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, risk: event.target.value as HaiRisk } : row)) })}>
                      {HAI_RISKS.map((entry) => (
                        <option key={entry} value={entry}>
                          {HAI_RISK_LABEL[entry]}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Due date">
                    <input className="crm-field" type="date" value={item.dueAt} onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, dueAt: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Evidence URL">
                    <input className="crm-field" value={item.evidence} onChange={(event) => patch({ issues: draft.issues.map((row, i) => (i === index ? { ...row, evidence: event.target.value } : row)) })} />
                  </Field>
                  <button type="button" className="crm-users-secondary" onClick={() => patch({ issues: draft.issues.filter((_, i) => i !== index) })}>
                    ลบแถว
                  </button>
                </div>
              ))}
            </RepeatBlock>
            {draft.id && access.canEditBoard && onEscalate ? (
              <div className="ads-inline-assign hai-gate-actions">
                <button type="button" className="kpi-button b2b-save" disabled={pending} onClick={onEscalate}>
                  Escalate
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {tab === "metrics" ? (
          <div role="tabpanel" id="hai-panel-metrics" aria-labelledby="hai-tab-metrics">
            <RepeatBlock title="Pilot scorecard" onAdd={() => patch({ metrics: [...draft.metrics, emptyMetric()] })}>
              {draft.metrics.map((item, index) => (
                <div className="b2b-form-grid" key={item.id}>
                  <Field label="Metric">
                    <input className="crm-field" value={item.name} onChange={(event) => patch({ metrics: draft.metrics.map((row, i) => (i === index ? { ...row, name: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Baseline">
                    <input className="crm-field" value={item.baseline} onChange={(event) => patch({ metrics: draft.metrics.map((row, i) => (i === index ? { ...row, baseline: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Target">
                    <input className="crm-field" value={item.target} onChange={(event) => patch({ metrics: draft.metrics.map((row, i) => (i === index ? { ...row, target: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Actual">
                    <input className="crm-field" value={item.actual} onChange={(event) => patch({ metrics: draft.metrics.map((row, i) => (i === index ? { ...row, actual: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Period">
                    <input className="crm-field" value={item.period} onChange={(event) => patch({ metrics: draft.metrics.map((row, i) => (i === index ? { ...row, period: event.target.value } : row)) })} />
                  </Field>
                  <button type="button" className="crm-users-secondary" onClick={() => patch({ metrics: draft.metrics.filter((_, i) => i !== index) })}>
                    ลบแถว
                  </button>
                </div>
              ))}
            </RepeatBlock>
          </div>
        ) : null}

        {tab === "handover" ? (
          <div role="tabpanel" id="hai-panel-handover" aria-labelledby="hai-tab-handover">
            <RepeatBlock title="Handover / SOP" onAdd={() => patch({ handover: [...draft.handover, emptyHandover()] })}>
              {draft.handover.map((item, index) => (
                <div className="b2b-form-grid" key={item.id}>
                  <Field label="Asset / SOP">
                    <input className="crm-field" value={item.asset} onChange={(event) => patch({ handover: draft.handover.map((row, i) => (i === index ? { ...row, asset: event.target.value } : row)) })} />
                  </Field>
                  <Field label="Owner">
                    <input className="crm-field" value={item.owner} onChange={(event) => patch({ handover: draft.handover.map((row, i) => (i === index ? { ...row, owner: event.target.value } : row)) })} />
                  </Field>
                  <Field label="SOP status">
                    <select className="crm-select" value={item.sopStatus} onChange={(event) => patch({ handover: draft.handover.map((row, i) => (i === index ? { ...row, sopStatus: event.target.value as HaiHandoverRow["sopStatus"] } : row)) })}>
                      {HAI_SOP_STATUSES.map((entry) => (
                        <option key={entry} value={entry}>
                          {HAI_SOP_STATUS_LABEL[entry]}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Training status">
                    <select
                      className="crm-select"
                      value={item.trainingStatus}
                      onChange={(event) => patch({ handover: draft.handover.map((row, i) => (i === index ? { ...row, trainingStatus: event.target.value as HaiHandoverRow["trainingStatus"] } : row)) })}
                    >
                      {HAI_SOP_STATUSES.map((entry) => (
                        <option key={entry} value={entry}>
                          {HAI_SOP_STATUS_LABEL[entry]}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <button type="button" className="crm-users-secondary" onClick={() => patch({ handover: draft.handover.filter((_, i) => i !== index) })}>
                    ลบแถว
                  </button>
                </div>
              ))}
            </RepeatBlock>
          </div>
        ) : null}

        {tab === "approvals" ? (
          <div role="tabpanel" id="hai-panel-approvals" aria-labelledby="hai-tab-approvals">
            <ul className="meta-ops-history seo-history">
              {draft.approvals.length ? (
                draft.approvals.map((item) => (
                  <li key={item.id}>
                    {item.kind || "Approval"} · {HAI_APPROVAL_LABEL[item.status]} · {item.notes || ""}
                  </li>
                ))
              ) : (
                <li>ยังไม่มีการอนุมัติ — เพิ่มจากแถวขยายบนบอร์ดหรือบันทึก Pilot Charter</li>
              )}
            </ul>
            {row ? (
              <>
                <h3>Activity</h3>
                <ul className="meta-ops-history seo-history">
                  {row.history.length ? (
                    row.history.slice(0, 12).map((item) => (
                      <li key={item.id}>
                        {toDateInput(item.createdAt) || "—"} · {item.action} · {item.detail}
                      </li>
                    ))
                  ) : (
                    <li>ยังไม่มีประวัติ</li>
                  )}
                </ul>
                <HotelAiSubtasksPanel
                  row={row}
                  staff={staff}
                  access={access}
                  extras={extras}
                  pending={pending}
                  draft={subtaskDraft}
                  comment={subtaskComment}
                  saveState={ok}
                  saveError={error}
                  onDraftChange={onSubtaskDraftChange}
                  onCommentChange={onSubtaskCommentChange}
                  onSave={onSaveSubtask}
                  onComplete={onCompleteSubtask}
                  onAddComment={onAddSubtaskComment}
                  onPatchSubtask={onPatchSubtask}
                  onDelete={onDeleteSubtask}
                  onAddDuty={onAddDuty}
                  onReviewerNote={onReviewerNote}
                />
              </>
            ) : (
              <p className="b2b-muted">บันทึกเวิร์กโฟลว์ก่อนเพื่อเพิ่มงานย่อย ความเห็น และการอนุมัติ</p>
            )}
          </div>
        ) : null}

        {saveBar}
      </div>
    </div>
  );
}
