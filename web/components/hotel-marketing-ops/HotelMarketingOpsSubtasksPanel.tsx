"use client";

import { useState } from "react";
import { B2bDialog, Field, SaveBar, toDateInput } from "@/components/b2b-ops/ui";
import {
  HMO_DEPARTMENT_DUTIES,
  HMO_DEPARTMENT_RESPONSIBILITY,
  HMO_DEPARTMENTS,
  HMO_GATE_KINDS,
  HMO_GATE_LABEL,
  HMO_PRIORITIES,
  HMO_PRIORITY_LABEL,
  HMO_READINESS_LABEL,
  HMO_SUBTASK_STATUS_LABEL,
  HMO_SUBTASK_STATUSES,
  MAX_HMO_SUBTASKS,
  hmoDepartmentLabel,
  hmoFormatDate,
  hmoGateKind,
  type HmoAccessView,
  type HmoDepartment,
  type HmoExtraDepartment,
  type HmoGateKind,
  type HmoPriority,
  type HmoRecordRow,
  type HmoSubtaskStatus,
  type HmoSubtaskView,
} from "@/lib/hotel-marketing-ops/types";

type Staff = { id: string; name: string };

export type HmoSubtaskDraft = {
  id: string;
  name: string;
  department: string;
  ownerId: string;
  reviewerId: string;
  status: HmoSubtaskStatus;
  dueAt: string;
  priority: HmoPriority;
  comments: string;
  evidence: string;
  gateKind: HmoGateKind;
};

export function emptyHmoSubtaskDraft(ownerId = "", department = "marketing_content"): HmoSubtaskDraft {
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

export function hmoDraftFromSubtask(item: HmoSubtaskView): HmoSubtaskDraft {
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

export function HotelMarketingOpsSubtasksPanel({
  row,
  staff,
  access,
  extras,
  pending,
  draft,
  message,
  onDraftChange,
  onSave,
  onComplete,
  onStatus,
  onMove,
  onDelete,
  onAddComment,
  onAddDuty,
  onEscalate,
  onDecide,
}: {
  row: HmoRecordRow;
  staff: Staff[];
  access: HmoAccessView;
  extras: HmoExtraDepartment[];
  pending: boolean;
  draft: HmoSubtaskDraft;
  message: { ok: string; error: string };
  onDraftChange: (draft: HmoSubtaskDraft) => void;
  onSave: () => void;
  onComplete: (item: HmoSubtaskView, completed: boolean) => void;
  onStatus: (item: HmoSubtaskView, status: HmoSubtaskStatus) => void;
  onMove: (item: HmoSubtaskView, direction: "up" | "down") => void;
  onDelete: (item: HmoSubtaskView) => void;
  onAddComment: (item: HmoSubtaskView, body: string) => Promise<boolean>;
  onAddDuty: (department: string, name: string) => void;
  onEscalate: (item: HmoSubtaskView, notes: string, reviewerId: string, target: "blocked" | "needs_review") => void;
  onDecide: (item: HmoSubtaskView, decision: "approve" | "reject", notes: string, rejectAs?: "needs_review" | "blocked") => void;
}) {
  const [deleteId, setDeleteId] = useState("");
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [actionDraft, setActionDraft] = useState<Record<string, { notes: string; reviewerId: string }>>({});
  const baseDepartment = (HMO_DEPARTMENTS as readonly string[]).includes(row.department) ? row.department : "marketing_content";
  const [dutyDepartment, setDutyDepartment] = useState<string>(baseDepartment);
  const canEdit = access.canEditBoard;
  const canAdd = row.subtasks.length < MAX_HMO_SUBTASKS;
  const departments = [...HMO_DEPARTMENTS, ...extras.map((item) => item.id)];
  const patch = (next: Partial<HmoSubtaskDraft>) => onDraftChange({ ...draft, ...next });
  const duties = HMO_DEPARTMENT_DUTIES[dutyDepartment as HmoDepartment] || [];
  const dutyResponsibility =
    HMO_DEPARTMENT_RESPONSIBILITY[dutyDepartment as HmoDepartment] || hmoDepartmentLabel(dutyDepartment, extras);
  const stateClass = message.error ? " is-error" : message.ok ? " is-ok" : "";
  const actionOf = (id: string) => actionDraft[id] || { notes: "", reviewerId: "" };
  const patchAction = (id: string, next: Partial<{ notes: string; reviewerId: string }>) =>
    setActionDraft((current) => ({ ...current, [id]: { ...actionOf(id), ...next } }));

  return (
    <div className="hmo-subtasks">
      <p className="b2b-muted">
        <span className={`hmo-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> · {row.progress.percent}% ·{" "}
        {HMO_READINESS_LABEL[row.progress.readiness]} · 1–{MAX_HMO_SUBTASKS} งานย่อยต่อรายการ / subtasks per item
      </p>
      <div className="hmo-progress" aria-label={`${row.progress.percent}% complete`}>
        <span className="hmo-progress-bar" style={{ width: `${row.progress.percent}%` }} />
      </div>
      {row.progress.byDepartment.length ? (
        <ul className="hmo-dept-badges" aria-label="Department progress">
          {row.progress.byDepartment.map((item) => (
            <li key={item.department}>
              <span className="hmo-badge is-in_progress">
                {hmoDepartmentLabel(item.department, extras)} {item.countLabel}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {row.progress.blockedByGate ? (
        <p className="hmo-gate-alert" role="status">
          Blocked — {row.progress.gateReasons.map((item) => HMO_GATE_LABEL[item]).join(", ")}: งานย่อยที่ติดขัดบล็อกการอนุมัติ/เผยแพร่
          แม้ความคืบหน้าจะสูง / a blocked source, permission, privacy, or approval task stops publication even if progress is high.
        </p>
      ) : null}

      {row.subtasks.length ? (
        <ol className="hmo-subtask-list">
          {row.subtasks.map((item, index) => (
            <li key={item.id} className={`hmo-subtask${item.completed ? " is-done" : ""}${item.status === "blocked" ? " is-blocked" : ""}`}>
              <div className="hmo-subtask-head">
                <label>
                  <input type="checkbox" checked={item.completed} disabled={pending || !canEdit} onChange={() => onComplete(item, !item.completed)} />
                  <span className="hmo-subtask-name">{item.name}</span>
                </label>
                <span className="b2b-meta">
                  <span className={`b2b-status is-${item.status}`}>{HMO_SUBTASK_STATUS_LABEL[item.status]}</span>
                  {item.gateKind !== "none" ? <span className={`b2b-status is-${item.gateKind}`}>{HMO_GATE_LABEL[item.gateKind]}</span> : null}
                </span>
              </div>
              <p className="hmo-subtask-meta">
                {hmoDepartmentLabel(item.department, extras)} · {HMO_PRIORITY_LABEL[item.priority]} · Owner {item.ownerName || "—"}
                {item.reviewerName ? ` · Reviewer ${item.reviewerName}` : ""}
                {item.dueAt ? ` · Due ${hmoFormatDate(item.dueAt)}` : ""}
                {item.evidence ? ` · ${item.evidence}` : ""}
                {item.comments ? ` · ${item.comments}` : ""}
              </p>
              {item.thread.length ? (
                <ul className="hmo-thread" aria-label="Comments">
                  {item.thread.map((entry) => (
                    <li key={entry.id}>
                      <strong>{entry.authorName || "—"}</strong> · {entry.body} <small>{hmoFormatDate(entry.createdAt, true)}</small>
                    </li>
                  ))}
                </ul>
              ) : null}
              {canEdit ? (
                <div className="hmo-subtask-actions">
                  <button type="button" className="crm-users-secondary" disabled={pending || index === 0} onClick={() => onMove(item, "up")} aria-label={`Move ${item.name} up`}>
                    ↑
                  </button>
                  <button
                    type="button"
                    className="crm-users-secondary"
                    disabled={pending || index === row.subtasks.length - 1}
                    onClick={() => onMove(item, "down")}
                    aria-label={`Move ${item.name} down`}
                  >
                    ↓
                  </button>
                  <form
                    className="b2b-inline"
                    key={`${item.id}-${item.status}`}
                    onSubmit={(event) => {
                      event.preventDefault();
                      onStatus(item, String(new FormData(event.currentTarget).get("status")) as HmoSubtaskStatus);
                    }}
                  >
                    <select className="crm-select" name="status" defaultValue={item.status} aria-label={`Status ${item.name}`}>
                      {HMO_SUBTASK_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {HMO_SUBTASK_STATUS_LABEL[status]}
                        </option>
                      ))}
                    </select>
                    <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                      บันทึกสถานะ / Save status
                    </button>
                  </form>
                  <button type="button" className="crm-users-secondary" onClick={() => onDraftChange(hmoDraftFromSubtask(item))}>
                    {draft.id === item.id ? "กำลังแก้ไข / Editing" : "แก้ไข / Edit"}
                  </button>
                  <button type="button" className="crm-users-secondary" onClick={() => setDeleteId(item.id)}>
                    ลบ / Delete
                  </button>
                </div>
              ) : null}
              {canEdit ? (
                <form
                  className="b2b-inline"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const body = (commentDraft[item.id] || "").trim();
                    if (!body) return;
                    if (await onAddComment(item, body)) setCommentDraft((current) => ({ ...current, [item.id]: "" }));
                  }}
                >
                  <input
                    className="crm-field"
                    value={commentDraft[item.id] || ""}
                    onChange={(event) => setCommentDraft((current) => ({ ...current, [item.id]: event.target.value }))}
                    placeholder="เพิ่มความเห็นหรือลิงก์หลักฐาน / Comment or evidence note"
                    aria-label={`Comment on ${item.name}`}
                  />
                  <button className="crm-users-secondary" type="submit" disabled={pending || !(commentDraft[item.id] || "").trim()}>
                    บันทึกความเห็น / Save comment
                  </button>
                </form>
              ) : null}
              {canEdit ? (
                <div className="hmo-subtask-decide">
                  <Field label="บันทึก Escalate / Approve / Reject *">
                    <input
                      className="crm-field"
                      value={actionOf(item.id).notes}
                      onChange={(event) => patchAction(item.id, { notes: event.target.value })}
                      placeholder="เหตุผลสั้น ๆ — ไม่ใส่ข้อมูลแขกหรือรหัสบัญชี"
                      aria-label={`Decision note for ${item.name}`}
                    />
                  </Field>
                  <Field label="ผู้ตรวจเมื่อ Escalate">
                    <select
                      className="crm-select"
                      value={actionOf(item.id).reviewerId || item.reviewerId}
                      onChange={(event) => patchAction(item.id, { reviewerId: event.target.value })}
                      aria-label={`Reviewer for ${item.name}`}
                    >
                      <option value="">เลือกผู้ตรวจ / Select reviewer</option>
                      {staff.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <div className="hmo-subtask-actions">
                    <button
                      type="button"
                      className="crm-users-secondary"
                      disabled={pending || !actionOf(item.id).notes.trim()}
                      onClick={() =>
                        onEscalate(item, actionOf(item.id).notes.trim(), actionOf(item.id).reviewerId || item.reviewerId, "blocked")
                      }
                    >
                      Escalate (Blocked)
                    </button>
                    <button
                      type="button"
                      className="crm-users-secondary"
                      disabled={pending || !actionOf(item.id).notes.trim()}
                      onClick={() =>
                        onEscalate(item, actionOf(item.id).notes.trim(), actionOf(item.id).reviewerId || item.reviewerId, "needs_review")
                      }
                    >
                      Escalate (Needs review)
                    </button>
                    {(access.canApprove || item.reviewerId === access.userId) && !item.completed ? (
                      <>
                        <button
                          type="button"
                          className="kpi-button b2b-save"
                          disabled={pending || !actionOf(item.id).notes.trim()}
                          onClick={() => onDecide(item, "approve", actionOf(item.id).notes.trim())}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="crm-users-secondary"
                          disabled={pending || !actionOf(item.id).notes.trim()}
                          onClick={() => onDecide(item, "reject", actionOf(item.id).notes.trim(), "needs_review")}
                        >
                          Reject → Needs review
                        </button>
                        <button
                          type="button"
                          className="crm-users-secondary"
                          disabled={pending || !actionOf(item.id).notes.trim()}
                          onClick={() => onDecide(item, "reject", actionOf(item.id).notes.trim(), "blocked")}
                        >
                          Reject → Blocked
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      ) : (
        <p className="b2b-muted">ยังไม่มีงานย่อย / No subtasks yet — เพิ่ม 1–{MAX_HMO_SUBTASKS} รายการเมื่อต้องการงานข้ามแผนก</p>
      )}
      <p className={`crm-cs-save-state${stateClass}`} role="status">
        {pending ? "กำลังบันทึก…" : message.error || message.ok || ""}
      </p>

      {canEdit ? (
        <>
          <details>
            <summary>รายการแนะนำตามแผนก / Suggested cross-department checklist</summary>
            <div className="hmo-panel">
              <Field label="แผนก / Department" hint={dutyResponsibility}>
                <select className="crm-select" value={dutyDepartment} onChange={(event) => setDutyDepartment(event.target.value)}>
                  {HMO_DEPARTMENTS.map((item) => (
                    <option key={item} value={item}>
                      {hmoDepartmentLabel(item)}
                    </option>
                  ))}
                </select>
              </Field>
              <p className="b2b-muted">{dutyResponsibility}</p>
              <ul className="hmo-duty-list">
                {duties.map((duty) => {
                  const exists = row.subtasks.some((item) => item.department === dutyDepartment && item.name === duty);
                  const gate = hmoGateKind(duty);
                  return (
                    <li key={duty}>
                      <span>
                        {duty}
                        {gate !== "none" ? ` · ${HMO_GATE_LABEL[gate]}` : ""}
                      </span>
                      <button type="button" className="crm-users-secondary" disabled={pending || exists || !canAdd} onClick={() => onAddDuty(dutyDepartment, duty)}>
                        {exists ? "เพิ่มแล้ว / Added" : "เพิ่ม / Add"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </details>

          <div className="hmo-subtask-form">
            <Field label="ชื่องานย่อย / Name *">
              <input className="crm-field" value={draft.name} maxLength={255} onChange={(event) => patch({ name: event.target.value, gateKind: draft.id ? draft.gateKind : hmoGateKind(event.target.value) })} />
            </Field>
            <Field label="แผนก / Department">
              <select className="crm-select" value={draft.department} onChange={(event) => patch({ department: event.target.value })}>
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {hmoDepartmentLabel(item, extras)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ผู้รับผิดชอบ / Owner">
              <select className="crm-select" value={draft.ownerId} onChange={(event) => patch({ ownerId: event.target.value })}>
                <option value="">ยังไม่มอบหมาย / Unassigned</option>
                {staff.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ผู้ตรวจ / Reviewer">
              <select className="crm-select" value={draft.reviewerId} onChange={(event) => patch({ reviewerId: event.target.value })}>
                <option value="">—</option>
                {staff.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="สถานะ / Status">
              <select className="crm-select" value={draft.status} onChange={(event) => patch({ status: event.target.value as HmoSubtaskStatus })}>
                {HMO_SUBTASK_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {HMO_SUBTASK_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="กำหนดส่ง / Due date">
              <input className="crm-field" type="date" value={draft.dueAt} onChange={(event) => patch({ dueAt: event.target.value })} />
            </Field>
            <Field label="ความสำคัญ / Priority">
              <select className="crm-select" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as HmoPriority })}>
                {HMO_PRIORITIES.map((item) => (
                  <option key={item} value={item}>
                    {HMO_PRIORITY_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ประตูตรวจ / Gate" hint="A blocked gate stops approval and publication">
              <select className="crm-select" value={draft.gateKind} onChange={(event) => patch({ gateKind: event.target.value as HmoGateKind })}>
                {HMO_GATE_KINDS.map((item) => (
                  <option key={item} value={item}>
                    {HMO_GATE_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="หลักฐาน / Evidence link" hint="Internal path (/…) or https URL. No guest, booking, or account data.">
              <input className="crm-field" value={draft.evidence} onChange={(event) => patch({ evidence: event.target.value })} placeholder="https:// หรือ /…" />
            </Field>
            <Field label="ความเห็น / Comment">
              <textarea className="crm-field" rows={2} value={draft.comments} onChange={(event) => patch({ comments: event.target.value })} />
            </Field>
            <div className="hmo-span-2" style={{ gridColumn: "1 / -1" }}>
              <SaveBar
                pending={pending}
                ok={message.ok}
                error={message.error}
                dirty={Boolean(draft.name)}
                idle={canAdd || draft.id ? "พร้อมบันทึกงานย่อย / Ready to save subtask" : `ครบ ${MAX_HMO_SUBTASKS} รายการแล้ว / Limit reached`}
                onSave={onSave}
                saveLabel={draft.id ? "บันทึกงานย่อย / Save subtask" : "เพิ่มงานย่อย / Add subtask"}
              />
              {draft.id ? (
                <button type="button" className="crm-users-secondary" onClick={() => onDraftChange(emptyHmoSubtaskDraft(access.userId, row.department))}>
                  ยกเลิกการแก้ไข / Cancel edit
                </button>
              ) : null}
            </div>
          </div>
        </>
      ) : null}

      {deleteId ? (
        <B2bDialog
          title="ลบงานย่อย / Delete subtask"
          body="ยืนยันลบงานย่อยนี้พร้อมความเห็น / Delete this subtask and its comments?"
          confirmLabel="ลบ / Delete"
          pending={pending}
          onCancel={() => setDeleteId("")}
          onConfirm={() => {
            const item = row.subtasks.find((entry) => entry.id === deleteId);
            if (item) onDelete(item);
            setDeleteId("");
          }}
        />
      ) : null}
    </div>
  );
}