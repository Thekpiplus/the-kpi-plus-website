"use client";

import { useId, useState } from "react";
import { B2bDialog, Field, SaveBar, toDateInput } from "@/components/b2b-ops/ui";
import { trnDepartmentProgress } from "@/lib/training-ops/progress";
import {
  MAX_TRN_SUBTASKS,
  TRN_DEPARTMENT_DUTIES,
  TRN_DEPARTMENTS,
  TRN_DEPARTMENT_LABEL,
  TRN_GATE_KINDS,
  TRN_GATE_LABEL,
  TRN_PRIORITIES,
  TRN_PRIORITY_LABEL,
  TRN_READINESS_LABEL,
  TRN_SUBTASK_STATUS_LABEL,
  TRN_SUBTASK_STATUSES,
  departmentLabel,
  trnDepartmentSubtasks,
  trnGateKind,
  type TrnAccessView,
  type TrnExtraDepartment,
  type TrnGateKind,
  type TrnPriority,
  type TrnRecordRow,
  type TrnSubtaskStatus,
  type TrnSubtaskView,
} from "@/lib/training-ops/types";

type Staff = { id: string; name: string };

export type TrnSubtaskDraft = {
  id: string;
  name: string;
  department: string;
  ownerId: string;
  reviewerId: string;
  status: TrnSubtaskStatus;
  dueAt: string;
  priority: TrnPriority;
  comments: string;
  evidence: string;
  gateKind: TrnGateKind;
};

export function emptyTrnSubtaskDraft(ownerId = "", department = "hr_ld"): TrnSubtaskDraft {
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

export function draftFromTrnSubtask(item: TrnSubtaskView): TrnSubtaskDraft {
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
  row: TrnRecordRow;
  canEdit: boolean;
  pending: boolean;
  canAdd: boolean;
  onAddDuty?: (department: string, name: string) => void;
  onDraftChange: (draft: TrnSubtaskDraft) => void;
  accessUserId: string;
}) {
  return (
    <>
      {departments.map((department) => {
        const duties = TRN_DEPARTMENT_DUTIES[department as keyof typeof TRN_DEPARTMENT_DUTIES];
        if (!duties) return null;
        const deptProgress = trnDepartmentProgress(row.subtasks, department, row.status, row.approvals);
        return (
          <article key={department} className="seo-ops-stat">
            <strong>{TRN_DEPARTMENT_LABEL[department as keyof typeof TRN_DEPARTMENT_LABEL] || department}</strong>
            <span className={`ads-progress-badge is-${deptProgress.readiness}`}>{deptProgress.countLabel}</span>
            <ul>
              {duties.map((duty) => {
                const exists = row.subtasks.some((item) => item.department === department && item.name === duty);
                const gate = trnGateKind(duty, department);
                return (
                  <li key={duty}>
                    <span>
                      {duty}
                      {gate !== "none" ? ` · ${TRN_GATE_LABEL[gate]}` : ""}
                    </span>
                    {canEdit && !exists && canAdd ? (
                      <button
                        type="button"
                        className="crm-users-secondary"
                        disabled={pending}
                        onClick={() => {
                          if (onAddDuty) onAddDuty(department, duty);
                          else onDraftChange({ ...emptyTrnSubtaskDraft(accessUserId, department), name: duty, gateKind: gate });
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

export function TrainingOpsSubtasksPanel({
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
  row?: TrnRecordRow;
  staff: Staff[];
  access: TrnAccessView;
  extras: TrnExtraDepartment[];
  pending: boolean;
  draft: TrnSubtaskDraft;
  comment: string;
  saveState?: string;
  saveError?: string;
  onDraftChange: (draft: TrnSubtaskDraft) => void;
  onCommentChange: (value: string) => void;
  onSave: () => void;
  onComplete: (item: TrnSubtaskView, completed: boolean) => void;
  onAddComment: (subtaskId: string) => void;
  onPatchSubtask?: (item: TrnSubtaskView, patch: Partial<TrnSubtaskDraft>) => void;
  onDelete?: (item: TrnSubtaskView) => void;
  onAddDuty?: (department: string, name: string) => void;
  onReviewerNote?: (subtaskId: string, notes: string, reviewerId: string) => void;
}) {
  const [deleteId, setDeleteId] = useState("");
  const [collaborate, setCollaborate] = useState(false);
  const collabId = useId();
  if (!row?.id) {
    return <p className="b2b-muted">บันทึกรายการก่อนจึงจะเพิ่มงานย่อยได้ (1–{MAX_TRN_SUBTASKS} รายการต่อโปรเจกต์อบรม)</p>;
  }
  const canEdit = access.canEditBoard;
  const patch = (next: Partial<TrnSubtaskDraft>) => onDraftChange({ ...draft, ...next });
  const selected = row.subtasks.find((item) => item.id === draft.id);
  const departments = [...TRN_DEPARTMENTS, ...extras.map((item) => item.id)];
  const canAdd = row.subtasks.length < MAX_TRN_SUBTASKS;
  const primary = row.department || "hr_ld";
  const otherDepartments = TRN_DEPARTMENTS.filter((item) => item !== primary);
  const collaborating = Array.from(new Set(row.subtasks.map((item) => item.department).filter((item) => item && item !== primary)));

  return (
    <div className="ads-form-panel ads-subtasks seo-subtasks hai-subtasks trn-subtasks">
      <p className="b2b-muted">
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> · ความคืบหน้า {row.progress.percent}% ·{" "}
        {TRN_READINESS_LABEL[row.progress.readiness]} · งานย่อย 1–{MAX_TRN_SUBTASKS} รายการต่อโปรเจกต์
      </p>
      {row.progress.blockedByGate ? (
        <p className="trn-gate-alert" role="status">
          Blocked — งาน privacy / safety / trainer approval / participant permission ที่ติดขัดบล็อกการเผยแพร่หรือจัดอบรมได้แม้ความคืบหน้าจะสูง (
          {row.progress.gateReasons.map((item) => TRN_GATE_LABEL[item]).join(", ")})
        </p>
      ) : null}

      <div className="seo-ops-duties" aria-label="หน้าที่ของแผนกเจ้าของรายการ">
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
        <div className="trn-collaborate">
          <button
            type="button"
            className="crm-users-secondary"
            onClick={() => setCollaborate((open) => !open)}
            aria-expanded={collaborate}
            aria-controls={collabId}
          >
            {collaborate ? "ซ่อนความร่วมมือข้ามแผนก" : "เพิ่มความร่วมมือข้ามแผนก"}
          </button>
          <p className="b2b-muted">เพิ่มหน้าที่จากแผนกอื่นเฉพาะเมื่อต้องประสานงานหรือติดตามผล — ไม่ใส่ทุกแผนกโดยอัตโนมัติ</p>
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
        const items = trnDepartmentSubtasks(row.subtasks, department);
        const deptProgress = trnDepartmentProgress(row.subtasks, department, row.status, row.approvals);
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
                    <span className={`b2b-status is-${item.status}`}>{TRN_SUBTASK_STATUS_LABEL[item.status]}</span>
                    {item.gateKind !== "none" ? (
                      <>
                        {" "}
                        · <span className={`b2b-status is-${item.gateKind}`}>{TRN_GATE_LABEL[item.gateKind]}</span>
                      </>
                    ) : null}{" "}
                    · {TRN_PRIORITY_LABEL[item.priority]} · {item.ownerName || "ยังไม่มอบหมาย"}
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
                      <button type="button" className="crm-users-secondary" onClick={() => onDraftChange(draftFromTrnSubtask(item))}>
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
                              onPatchSubtask(item, { status: String(new FormData(event.currentTarget).get("status") || "") as TrnSubtaskStatus });
                            }}
                          >
                            <select className="crm-select" name="status" defaultValue={item.status} aria-label={`สถานะ ${item.name}`}>
                              {TRN_SUBTASK_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {TRN_SUBTASK_STATUS_LABEL[status]}
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
                            <input className="crm-field" name="evidence" defaultValue={item.evidence} placeholder="Evidence / material URL" aria-label={`หลักฐาน ${item.name}`} />
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
          <Field label="ชื่องานย่อย / Name">
            <input
              className="crm-field"
              value={draft.name}
              onChange={(event) => patch({ name: event.target.value, gateKind: trnGateKind(event.target.value, draft.department) })}
            />
          </Field>
          <Field label="แผนก / Department">
            <select
              className="crm-select"
              value={draft.department}
              onChange={(event) => patch({ department: event.target.value, gateKind: trnGateKind(draft.name, event.target.value) })}
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {departmentLabel(item, extras)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ผู้รับผิดชอบ / Owner">
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
          <Field label="สถานะ / Status">
            <select className="crm-select" value={draft.status} onChange={(event) => patch({ status: event.target.value as TrnSubtaskStatus })}>
              {TRN_SUBTASK_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {TRN_SUBTASK_STATUS_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="กำหนดส่ง / Due date">
            <input className="crm-field" type="date" value={draft.dueAt} onChange={(event) => patch({ dueAt: event.target.value })} />
          </Field>
          <Field label="ความสำคัญ / Priority">
            <select className="crm-select" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as TrnPriority })}>
              {TRN_PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  {TRN_PRIORITY_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="เกต / Gate">
            <select className="crm-select" value={draft.gateKind} onChange={(event) => patch({ gateKind: event.target.value as TrnGateKind })}>
              {TRN_GATE_KINDS.map((item) => (
                <option key={item} value={item}>
                  {TRN_GATE_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ความเห็น / Comment">
            <textarea className="crm-field" rows={3} value={draft.comments} onChange={(event) => patch({ comments: event.target.value })} />
          </Field>
          <Field label="หลักฐาน / Evidence" hint="ลิงก์หรืออ้างอิงภายในเท่านั้น ไม่นำเข้าไฟล์ และห้ามใส่คะแนนรายบุคคลหรือข้อมูลแขก">
            <input className="crm-field" value={draft.evidence} onChange={(event) => patch({ evidence: event.target.value })} placeholder="https:// หรือ /media/…" />
          </Field>
          <SaveBar
            pending={pending}
            ok={saveState || ""}
            error={saveError || ""}
            dirty={Boolean(draft.name)}
            idle={canAdd ? "พร้อมบันทึกงานย่อย / Ready to save subtask" : `ครบ ${MAX_TRN_SUBTASKS} รายการแล้ว`}
            onSave={onSave}
            saveLabel={draft.id ? "บันทึกงานย่อย / Save subtask" : "เพิ่มงานย่อย / Add subtask"}
          />
        </div>
      ) : null}

      {deleteId ? (
        <B2bDialog
          title="ลบงานย่อย"
          body="ยืนยันลบงานย่อยนี้จากโปรเจกต์อบรม"
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
