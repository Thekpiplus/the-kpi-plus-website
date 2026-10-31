"use client";

import { useId, useState } from "react";
import { B2bDialog, Field, toDateInput } from "@/components/b2b-ops/ui";
import { haiDepartmentProgress } from "@/lib/hotel-ai-ops/progress";
import {
  HAI_DEPARTMENT_DUTIES,
  HAI_DEPARTMENTS,
  HAI_DEPARTMENT_LABEL,
  HAI_GATE_KINDS,
  HAI_GATE_LABEL,
  HAI_PRIORITIES,
  HAI_PRIORITY_LABEL,
  HAI_READINESS_LABEL,
  HAI_SUBTASK_STATUS_LABEL,
  HAI_SUBTASK_STATUSES,
  MAX_HAI_SUBTASKS,
  departmentLabel,
  haiDepartmentSubtasks,
  haiGateKind,
  type HaiAccessView,
  type HaiExtraDepartment,
  type HaiGateKind,
  type HaiPriority,
  type HaiSubtaskStatus,
  type HaiSubtaskView,
  type HaiWorkflowRow,
} from "@/lib/hotel-ai-ops/types";

type Staff = { id: string; name: string };

export type HaiSubtaskDraft = {
  id: string;
  name: string;
  department: string;
  ownerId: string;
  reviewerId: string;
  status: HaiSubtaskStatus;
  dueAt: string;
  priority: HaiPriority;
  comments: string;
  evidence: string;
  gateKind: HaiGateKind;
};

export function emptyHaiSubtaskDraft(ownerId = "", department = "operations"): HaiSubtaskDraft {
  return {
    id: "",
    name: "",
    department,
    ownerId,
    reviewerId: "",
    status: "not_started",
    dueAt: "",
    priority: "normal",
    comments: "",
    evidence: "",
    gateKind: "none",
  };
}

export function draftFromHaiSubtask(item: HaiSubtaskView): HaiSubtaskDraft {
  return {
    id: item.id,
    name: item.name,
    department: item.department,
    ownerId: item.ownerId,
    reviewerId: item.reviewerId,
    status: item.status,
    dueAt: toDateInput(item.dueAt),
    priority: item.priority,
    comments: item.comments,
    evidence: item.evidence,
    gateKind: item.gateKind,
  };
}

function DutyList({
  departments,
  row,
  canEdit,
  pending,
  canAdd,
  onAddDuty,
  onDraftChange,
  accessUserId,
}: {
  departments: readonly string[];
  row: HaiWorkflowRow;
  canEdit: boolean;
  pending: boolean;
  canAdd: boolean;
  onAddDuty?: (department: string, name: string) => void;
  onDraftChange: (draft: HaiSubtaskDraft) => void;
  accessUserId: string;
}) {
  return (
    <>
      {departments.map((department) => {
        const duties = HAI_DEPARTMENT_DUTIES[department as keyof typeof HAI_DEPARTMENT_DUTIES];
        if (!duties) return null;
        const deptProgress = haiDepartmentProgress(row.subtasks, department, row.status, row.approvals);
        return (
          <article key={department} className="seo-ops-stat">
            <strong>{HAI_DEPARTMENT_LABEL[department as keyof typeof HAI_DEPARTMENT_LABEL] || department}</strong>
            <span className={`ads-progress-badge is-${deptProgress.readiness}`}>{deptProgress.countLabel}</span>
            <ul>
              {duties.map((duty) => {
                const exists = row.subtasks.some((item) => item.department === department && item.name === duty);
                const gate = haiGateKind(duty, department);
                return (
                  <li key={duty}>
                    <span>
                      {duty}
                      {gate !== "none" ? ` · ${HAI_GATE_LABEL[gate]}` : ""}
                    </span>
                    {canEdit && !exists && canAdd ? (
                      <button
                        type="button"
                        className="crm-users-secondary"
                        disabled={pending}
                        onClick={() => {
                          if (onAddDuty) onAddDuty(department, duty);
                          else onDraftChange({ ...emptyHaiSubtaskDraft(accessUserId, department), name: duty, gateKind: gate });
                        }}
                      >
                        เพิ่ม
                      </button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </article>
        );
      })}
    </>
  );
}

export function HotelAiSubtasksPanel({
  row,
  staff,
  access,
  extras,
  pending,
  draft,
  comment,
  saveState,
  saveError,
  onDraftChange,
  onCommentChange,
  onSave,
  onComplete,
  onAddComment,
  onPatchSubtask,
  onDelete,
  onAddDuty,
  onReviewerNote,
}: {
  row?: HaiWorkflowRow;
  staff: Staff[];
  access: HaiAccessView;
  extras: HaiExtraDepartment[];
  pending: boolean;
  draft: HaiSubtaskDraft;
  comment: string;
  saveState?: string;
  saveError?: string;
  onDraftChange: (draft: HaiSubtaskDraft) => void;
  onCommentChange: (value: string) => void;
  onSave: () => void;
  onComplete: (item: HaiSubtaskView, completed: boolean) => void;
  onAddComment: (subtaskId: string) => void;
  onPatchSubtask?: (item: HaiSubtaskView, patch: Partial<HaiSubtaskDraft>) => void;
  onDelete?: (item: HaiSubtaskView) => void;
  onAddDuty?: (department: string, name: string) => void;
  onReviewerNote?: (subtaskId: string, notes: string, reviewerId: string) => void;
}) {
  const [deleteId, setDeleteId] = useState("");
  const [collaborate, setCollaborate] = useState(false);
  const collabId = useId();
  if (!row?.id) {
    return <p className="b2b-muted">บันทึกเวิร์กโฟลว์ก่อนจึงจะเพิ่มงานย่อยได้ (1–{MAX_HAI_SUBTASKS} รายการต่อเวิร์กโฟลว์)</p>;
  }
  const canEdit = access.canEditBoard;
  const patch = (next: Partial<HaiSubtaskDraft>) => onDraftChange({ ...draft, ...next });
  const selected = row.subtasks.find((item) => item.id === draft.id);
  const departments = [...HAI_DEPARTMENTS, ...extras.map((item) => item.id)];
  const canAdd = row.subtasks.length < MAX_HAI_SUBTASKS;
  const primary = row.department || "operations";
  const otherDepartments = HAI_DEPARTMENTS.filter((item) => item !== primary);
  const collaborating = Array.from(new Set(row.subtasks.map((item) => item.department).filter((item) => item && item !== primary)));

  return (
    <div className="ads-form-panel ads-subtasks seo-subtasks hai-subtasks">
      <p className="b2b-muted">
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> · ความคืบหน้า {row.progress.percent}% ·{" "}
        {HAI_READINESS_LABEL[row.progress.readiness]} · งานย่อย 1–{MAX_HAI_SUBTASKS} รายการต่อเวิร์กโฟลว์
      </p>
      {row.progress.blockedByGate ? (
        <p className="hai-gate-alert" role="status">
          Blocked — งาน safety / access / privacy ที่ติดขัดทำให้เวิร์กโฟลว์เป็น Blocked แม้ความคืบหน้าจะสูง ({row.progress.gateReasons.join(", ")})
        </p>
      ) : null}

      <div className="seo-ops-duties" aria-label="หน้าที่ของแผนกเจ้าของเวิร์กโฟลว์">
        <DutyList
          departments={[primary]}
          row={row}
          canEdit={canEdit}
          pending={pending}
          canAdd={canAdd}
          onAddDuty={onAddDuty}
          onDraftChange={onDraftChange}
          accessUserId={access.userId}
        />
      </div>

      {canEdit ? (
        <div className="hai-collaborate">
          <button
            type="button"
            className="crm-users-secondary"
            onClick={() => setCollaborate((open) => !open)}
            aria-expanded={collaborate}
            aria-controls={collabId}
          >
            {collaborate ? "ซ่อนความร่วมมือข้ามแผนก" : "เพิ่มความร่วมมือข้ามแผนก"}
          </button>
          <p className="b2b-muted">เพิ่มหน้าที่จากแผนกอื่นเฉพาะเมื่อต้องทำงานร่วมกัน — ไม่ใส่ทุกแผนกโดยอัตโนมัติ</p>
          {collaborating.length ? (
            <p className="b2b-muted">กำลังร่วมงาน: {collaborating.map((item) => departmentLabel(item, extras)).join(", ")}</p>
          ) : null}
          <div id={collabId} className="seo-ops-duties" hidden={!collaborate} aria-label="หน้าที่ข้ามแผนก">
            {collaborate ? (
              <DutyList
                departments={otherDepartments}
                row={row}
                canEdit={canEdit}
                pending={pending}
                canAdd={canAdd}
                onAddDuty={onAddDuty}
                onDraftChange={onDraftChange}
                accessUserId={access.userId}
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {departments.map((department) => {
        const items = haiDepartmentSubtasks(row.subtasks, department);
        const deptProgress = haiDepartmentProgress(row.subtasks, department, row.status, row.approvals);
        if (!items.length) return null;
        return (
          <section key={department} className="sys-dept-subtasks" aria-label={`งานย่อย ${departmentLabel(department, extras)}`}>
            <h3>
              {departmentLabel(department, extras)} · <span className={`ads-progress-badge is-${deptProgress.readiness}`}>{deptProgress.countLabel}</span>
            </h3>
            <ul className="ads-subtask-list">
              {items.map((item) => (
                <li key={item.id} className={item.completed ? "is-done" : item.status === "blocked" ? "is-blocked" : ""}>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      disabled={pending || !canEdit}
                      onChange={() => onComplete(item, !item.completed)}
                    />
                    <span>{item.name}</span>
                  </label>
                  <p>
                    <span className={`b2b-status is-${item.status}`}>{HAI_SUBTASK_STATUS_LABEL[item.status]}</span>
                    {item.gateKind !== "none" ? (
                      <>
                        {" "}
                        · <span className={`b2b-status is-${item.gateKind}`}>{HAI_GATE_LABEL[item.gateKind]}</span>
                      </>
                    ) : null}{" "}
                    · {HAI_PRIORITY_LABEL[item.priority]} · {item.ownerName || "ยังไม่มอบหมาย"}
                    {item.reviewerName ? ` · Reviewer ${item.reviewerName}` : ""}
                    {item.dueAt ? ` · ${new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(item.dueAt))}` : ""}
                    {item.evidence ? ` · ${item.evidence}` : ""}
                    {item.comments ? ` · ${item.comments}` : ""}
                  </p>
                  {item.thread.length ? (
                    <ul className="meta-ops-history seo-history">
                      {item.thread.map((entry) => (
                        <li key={entry.id}>
                          {entry.authorName || "—"} · {entry.body}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {canEdit ? (
                    <div className="ads-inline-assign">
                      <button type="button" className="crm-users-secondary" onClick={() => onDraftChange(draftFromHaiSubtask(item))}>
                        {selected?.id === item.id ? "กำลังแก้ไข" : "แก้ไข"}
                      </button>
                      {onPatchSubtask ? (
                        <>
                          <form
                            className="b2b-inline"
                            onSubmit={(event) => {
                              event.preventDefault();
                              onPatchSubtask(item, { department: String(new FormData(event.currentTarget).get("department") || item.department) });
                            }}
                          >
                            <select className="crm-select" name="department" defaultValue={item.department} aria-label={`แผนก ${item.name}`}>
                              {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                  {departmentLabel(dept, extras)}
                                </option>
                              ))}
                            </select>
                            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                              แผนก
                            </button>
                          </form>
                          <form
                            className="b2b-inline"
                            onSubmit={(event) => {
                              event.preventDefault();
                              onPatchSubtask(item, { ownerId: String(new FormData(event.currentTarget).get("ownerId") || "") });
                            }}
                          >
                            <select className="crm-select" name="ownerId" defaultValue={item.ownerId} aria-label={`มอบหมาย ${item.name}`}>
                              <option value="">ยังไม่มอบหมาย</option>
                              {staff.map((person) => (
                                <option key={person.id} value={person.id}>
                                  {person.name}
                                </option>
                              ))}
                            </select>
                            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                              Assign
                            </button>
                          </form>
                          <form
                            className="b2b-inline"
                            onSubmit={(event) => {
                              event.preventDefault();
                              onPatchSubtask(item, { status: String(new FormData(event.currentTarget).get("status") || "") as HaiSubtaskStatus });
                            }}
                          >
                            <select className="crm-select" name="status" defaultValue={item.status} aria-label={`สถานะ ${item.name}`}>
                              {HAI_SUBTASK_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {HAI_SUBTASK_STATUS_LABEL[status]}
                                </option>
                              ))}
                            </select>
                            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                              สถานะ
                            </button>
                          </form>
                          <form
                            className="b2b-inline"
                            onSubmit={(event) => {
                              event.preventDefault();
                              onPatchSubtask(item, { reviewerId: String(new FormData(event.currentTarget).get("reviewerId") || "") });
                            }}
                          >
                            <select className="crm-select" name="reviewerId" defaultValue={item.reviewerId} aria-label={`ผู้อนุมัติ ${item.name}`}>
                              <option value="">ยังไม่มี reviewer</option>
                              {staff.map((person) => (
                                <option key={person.id} value={person.id}>
                                  {person.name}
                                </option>
                              ))}
                            </select>
                            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                              Reviewer
                            </button>
                          </form>
                          <form
                            className="b2b-inline"
                            onSubmit={(event) => {
                              event.preventDefault();
                              onPatchSubtask(item, { evidence: String(new FormData(event.currentTarget).get("evidence") || "") });
                            }}
                          >
                            <input className="crm-field" name="evidence" defaultValue={item.evidence} placeholder="Evidence / reference URL" aria-label={`หลักฐาน ${item.name}`} />
                            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                              หลักฐาน
                            </button>
                          </form>
                          <form
                            className="b2b-inline"
                            onSubmit={(event) => {
                              event.preventDefault();
                              const notes = String(new FormData(event.currentTarget).get("body") || "");
                              if (onReviewerNote) onReviewerNote(item.id, notes, item.reviewerId || access.userId);
                              else {
                                onCommentChange(notes);
                                onAddComment(item.id);
                              }
                              event.currentTarget.reset();
                            }}
                          >
                            <input className="crm-field" name="body" placeholder="บันทึก reviewer" aria-label={`บันทึก reviewer ${item.name}`} />
                            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                              Reviewer note
                            </button>
                          </form>
                        </>
                      ) : null}
                      {onDelete && row.subtasks.length > 1 ? (
                        <button type="button" className="crm-users-secondary" onClick={() => setDeleteId(item.id)}>
                          ลบ
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {!row.subtasks.length ? <p className="b2b-muted">ยังไม่มีงานย่อย</p> : null}

      {canEdit ? (
        <div className="ads-subtask-form">
          <Field label="ชื่องานย่อย">
            <input
              className="crm-field"
              value={draft.name}
              onChange={(event) => patch({ name: event.target.value, gateKind: haiGateKind(event.target.value, draft.department) })}
            />
          </Field>
          <Field label="แผนก">
            <select
              className="crm-select"
              value={draft.department}
              onChange={(event) => patch({ department: event.target.value, gateKind: haiGateKind(draft.name, event.target.value) })}
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {departmentLabel(item, extras)}
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
          <Field label="Reviewer / approver">
            <select className="crm-select" value={draft.reviewerId} onChange={(event) => patch({ reviewerId: event.target.value })}>
              <option value="">ยังไม่มี reviewer</option>
              {staff.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="สถานะ">
            <select className="crm-select" value={draft.status} onChange={(event) => patch({ status: event.target.value as HaiSubtaskStatus })}>
              {HAI_SUBTASK_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {HAI_SUBTASK_STATUS_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="กำหนดส่ง">
            <input className="crm-field" type="date" value={draft.dueAt} onChange={(event) => patch({ dueAt: event.target.value })} />
          </Field>
          <Field label="ความสำคัญ">
            <select className="crm-select" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as HaiPriority })}>
              {HAI_PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  {HAI_PRIORITY_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Safety / access / privacy">
            <select className="crm-select" value={draft.gateKind} onChange={(event) => patch({ gateKind: event.target.value as HaiGateKind })}>
              {HAI_GATE_KINDS.map((item) => (
                <option key={item} value={item}>
                  {HAI_GATE_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Comments">
            <textarea className="crm-field" rows={3} value={draft.comments} onChange={(event) => patch({ comments: event.target.value })} />
          </Field>
          <Field label="Evidence / reference" hint="ลิงก์หรืออ้างอิงภายในเท่านั้น ไม่นำเข้าไฟล์ และห้ามใส่คีย์หรือข้อมูลแขก">
            <input className="crm-field" value={draft.evidence} onChange={(event) => patch({ evidence: event.target.value })} placeholder="https:// หรือ /media/…" />
          </Field>
          <div className="b2b-savebar">
            <button className="kpi-button b2b-save" type="button" disabled={pending || (!draft.id && !canAdd)} onClick={onSave}>
              {pending ? "กำลังบันทึก…" : draft.id ? "บันทึกงานย่อย" : "เพิ่มงานย่อย"}
            </button>
            <p className={`crm-cs-save-state${saveError ? " is-error" : saveState ? " is-ok" : ""}`} role="status">
              {pending ? "กำลังบันทึก…" : saveError || saveState || (canAdd ? "พร้อมบันทึก" : `ครบ ${MAX_HAI_SUBTASKS} รายการแล้ว`)}
            </p>
          </div>
        </div>
      ) : null}

      {deleteId ? (
        <B2bDialog
          title="ลบงานย่อย"
          body="ยืนยันลบงานย่อยนี้จากเวิร์กโฟลว์"
          confirmLabel="ลบ"
          pending={pending}
          onCancel={() => setDeleteId("")}
          onConfirm={() => {
            const item = row.subtasks.find((entry) => entry.id === deleteId);
            if (item && onDelete) onDelete(item);
            setDeleteId("");
          }}
        />
      ) : null}
      <span hidden>{comment}</span>
    </div>
  );
}
