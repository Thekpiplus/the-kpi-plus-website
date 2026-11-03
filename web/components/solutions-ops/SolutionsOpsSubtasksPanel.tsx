"use client";

import { useState } from "react";
import { B2bDialog, Field, SaveBar, toDateInput } from "@/components/b2b-ops/ui";
import {
  addSolutionsSubtaskComment,
  completeSolutionsSubtask,
  decideSolutionsSubtask,
  escalateSolutionsSubtask,
  removeSolutionsSubtask,
  saveSolutionsSubtask,
} from "@/lib/solutions-ops/actions";
import { canDecideSubtask, canTouchSubtask, solDepartmentProgress } from "@/lib/solutions-ops/progress";
import {
  MAX_SOL_SUBTASKS,
  MIN_SOL_SUBTASKS,
  SOL_GATE_KINDS,
  SOL_GATE_LABEL,
  SOL_PRIORITIES,
  SOL_PRIORITY_LABEL,
  SOL_READINESS_LABEL,
  SOL_SUBTASK_STATUSES,
  SOL_SUBTASK_STATUS_LABEL,
  blockedByGateMessage,
  hasContactPattern,
  hasSensitiveText,
  isBlockingGate,
  type SolAccessView,
  type SolDepartmentOption,
  type SolGateKind,
  type SolPriority,
  type SolSubtaskParent,
  type SolSubtaskProgress,
  type SolSubtaskStatus,
  type SolSubtaskView,
} from "@/lib/solutions-ops/types";
import { formatDate, isOverdue } from "./format";
import { useSolRun } from "./useSolRun";
import "./solutions-ops.css";

type Staff = { id: string; name: string };

export type SolSubtaskDraft = {
  id: string;
  name: string;
  department: string;
  ownerId: string;
  reviewerId: string;
  status: SolSubtaskStatus;
  completed: boolean;
  dueAt: string;
  priority: SolPriority;
  comments: string;
  evidence: string;
  gateKind: SolGateKind;
};

function emptyDraft(department: string, ownerId: string): SolSubtaskDraft {
  return {
    id: "",
    name: "",
    department,
    ownerId,
    reviewerId: "",
    status: "not_started",
    completed: false,
    dueAt: "",
    priority: "normal",
    comments: "",
    evidence: "",
    gateKind: "none",
  };
}

function draftFrom(item: SolSubtaskView): SolSubtaskDraft {
  return {
    id: item.id,
    name: item.name,
    department: item.department,
    ownerId: item.ownerId,
    reviewerId: item.reviewerId,
    status: item.status,
    completed: item.completed,
    dueAt: toDateInput(item.dueAt),
    priority: item.priority,
    comments: item.comments,
    evidence: item.evidence,
    gateKind: item.gateKind,
  };
}

/** Mirrors the server checks so the user sees the problem before saving. */
export function validateSubtaskDraft(draft: SolSubtaskDraft): string {
  if (!draft.name.trim()) return "กรุณากรอกชื่องานย่อย";
  if (hasSensitiveText(draft.name, draft.comments, draft.evidence)) return "พบข้อความที่เหมือนรหัสผ่าน/ข้อมูลแขก/เลขบัตร — ห้ามบันทึก";
  if (hasContactPattern(draft.name, draft.comments, draft.evidence)) return "ห้ามพิมพ์อีเมลหรือเบอร์โทรในงานย่อย ความเห็น หรือหลักฐาน";
  if (/^(javascript|data|vbscript|file):/i.test(draft.evidence.trim())) return "หลักฐานต้องเป็นลิงก์ https:// หรือรหัสอ้างอิงภายใน";
  if (draft.status === "needs_review" && !draft.reviewerId) return "สถานะ “รอตรวจ” ต้องเลือกผู้ตรวจ (reviewer)";
  if (draft.dueAt && Number.isNaN(new Date(draft.dueAt).getTime())) return "รูปแบบวันที่ไม่ถูกต้อง";
  return "";
}

function toFormData(draft: SolSubtaskDraft, parentType: SolSubtaskParent, parentId: string) {
  const data = new FormData();
  data.set("id", draft.id);
  data.set("parentType", parentType);
  data.set("parentId", parentId);
  data.set("name", draft.name);
  data.set("department", draft.department);
  data.set("ownerId", draft.ownerId);
  data.set("reviewerId", draft.reviewerId);
  data.set("status", draft.status);
  data.set("completed", draft.completed ? "1" : "0");
  data.set("dueAt", draft.dueAt);
  data.set("priority", draft.priority);
  data.set("comments", draft.comments);
  data.set("evidence", draft.evidence);
  data.set("gateKind", draft.gateKind);
  return data;
}

/** Compact "3/5 completed" badge for service rows and inquiry cards. */
export function SolProgressBadge({ progress, title }: { progress: SolSubtaskProgress; title?: string }) {
  if (!progress.total) return <span className="sol-progress-badge is-not_started">ยังไม่มีงานย่อย</span>;
  return (
    <span
      className={`sol-progress-badge is-${progress.readiness}`}
      title={title ?? (progress.blockedByGate ? blockedByGateMessage(progress.gateReasons) : SOL_READINESS_LABEL[progress.readiness])}
    >
      {progress.countLabel}
      {progress.blockedByGate ? " · blocked" : ""}
    </span>
  );
}

type ItemAction = { id: string; kind: "escalate" | "reject" | "comment" };

export function SolutionsOpsSubtasksPanel({
  parentType,
  parentId,
  parentDepartment,
  subtasks,
  progress,
  staff,
  departments,
  access,
}: {
  parentType: SolSubtaskParent;
  /** Service id, or Lead id for inquiries. */
  parentId: string;
  /** Owning department of the service; null for inquiries. */
  parentDepartment: string | null;
  subtasks: SolSubtaskView[];
  progress: SolSubtaskProgress;
  staff: Staff[];
  departments: SolDepartmentOption[];
  access: SolAccessView;
}) {
  const { pending, error, ok, setError, setOk, reset, run } = useSolRun();
  const fallbackDepartment = parentDepartment ?? access.departments[0] ?? "management";
  const [draft, setDraft] = useState<SolSubtaskDraft>(() => emptyDraft(fallbackDepartment, access.userId));
  const [dirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(false);
  const [closedDepartments, setClosedDepartments] = useState<Record<string, boolean>>({});
  const [action, setAction] = useState<ItemAction | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [actionReviewer, setActionReviewer] = useState("");
  const [actionStatus, setActionStatus] = useState<"needs_review" | "blocked">("needs_review");
  const [deleteId, setDeleteId] = useState("");
  // Feedback is shown next to where the user acted: the form's SaveBar, or above the list.
  const [scope, setScope] = useState<"form" | "list">("list");
  const runList: typeof run = (task, success, onDone) => {
    setScope("list");
    run(task, success, onDone);
  };

  const canEditParent = access.canEdit;
  const canAdd = canEditParent && subtasks.length < MAX_SOL_SUBTASKS;
  const validation = validateSubtaskDraft(draft);
  const used = departments.filter((item) => subtasks.some((task) => task.department === item.id));
  // Departments the user can pick: all of them when management, otherwise their own + the parent's.
  const pickable = departments.filter((item) => access.isManagement || access.departments.includes(item.id) || item.id === parentDepartment || item.id === draft.department);

  function patch(next: Partial<SolSubtaskDraft>) {
    setDirty(true);
    setDraft((current) => ({ ...current, ...next }));
  }

  function resetForm() {
    setDraft(emptyDraft(fallbackDepartment, access.userId));
    setDirty(false);
    setTouched(false);
  }

  function save() {
    setScope("form");
    setTouched(true);
    setOk("");
    if (validation) {
      setError("");
      return;
    }
    run(() => saveSolutionsSubtask(toFormData(draft, parentType, parentId)), draft.id ? "บันทึกงานย่อยแล้ว / Saved" : "เพิ่มงานย่อยแล้ว / Added", resetForm);
  }

  function complete(item: SolSubtaskView, done: boolean) {
    const data = new FormData();
    data.set("id", item.id);
    data.set("completed", done ? "1" : "0");
    runList(() => completeSolutionsSubtask(data), done ? "ทำเครื่องหมายเสร็จแล้ว" : "เปิดงานอีกครั้งแล้ว");
  }

  function decide(item: SolSubtaskView, decision: "approve" | "reject", note = "") {
    const data = new FormData();
    data.set("id", item.id);
    data.set("decision", decision);
    data.set("note", note);
    runList(() => decideSolutionsSubtask(data), decision === "approve" ? "อนุมัติงานย่อยแล้ว — เสร็จสิ้น" : "ปฏิเสธงานย่อยแล้ว — ติดขัด", closeAction);
  }

  function closeAction() {
    setAction(null);
    setActionNote("");
    setActionReviewer("");
    setActionStatus("needs_review");
  }

  function openAction(item: SolSubtaskView, kind: ItemAction["kind"]) {
    reset();
    setAction({ id: item.id, kind });
    setActionNote("");
    setActionReviewer(item.reviewerId);
    setActionStatus("needs_review");
  }

  function submitAction(item: SolSubtaskView) {
    setScope("list");
    setOk("");
    if (!actionNote.trim()) {
      setError(action?.kind === "comment" ? "กรุณากรอกความเห็น" : "กรุณากรอกบันทึก / เหตุผล");
      return;
    }
    if (hasSensitiveText(actionNote)) {
      setError("พบข้อความที่เหมือนรหัสผ่าน/ข้อมูลแขก/เลขบัตร — ห้ามบันทึก");
      return;
    }
    if (hasContactPattern(actionNote)) {
      setError("ห้ามพิมพ์อีเมลหรือเบอร์โทร");
      return;
    }
    if (action?.kind === "reject") {
      decide(item, "reject", actionNote);
      return;
    }
    const data = new FormData();
    data.set("id", item.id);
    if (action?.kind === "escalate") {
      if (actionStatus === "needs_review" && !actionReviewer) {
        setError("กรุณาเลือกผู้ตรวจ (reviewer)");
        return;
      }
      data.set("status", actionStatus);
      data.set("reviewerId", actionReviewer);
      data.set("note", actionNote);
      runList(() => escalateSolutionsSubtask(data), actionStatus === "blocked" ? "ยกระดับเป็นติดขัดแล้ว" : "ส่งให้ reviewer ตรวจแล้ว", closeAction);
      return;
    }
    data.set("body", actionNote);
    runList(() => addSolutionsSubtaskComment(data), "เพิ่มความเห็นแล้ว", closeAction);
  }

  function confirmDelete() {
    const data = new FormData();
    data.set("id", deleteId);
    runList(() => removeSolutionsSubtask(data), "ลบงานย่อยแล้ว");
    setDeleteId("");
    if (draft.id === deleteId) resetForm();
  }

  return (
    <section className="sol-subtasks" aria-label="งานย่อยข้ามแผนก / Cross-department subtasks">
      <header className="sol-subtasks-head">
        <h3>งานย่อยข้ามแผนก</h3>
        <SolProgressBadge progress={progress} />
        <span className="b2b-muted">
          {progress.percent}% · {SOL_READINESS_LABEL[progress.readiness]} · เพิ่มได้ {MIN_SOL_SUBTASKS}–{MAX_SOL_SUBTASKS} รายการ ({subtasks.length}/{MAX_SOL_SUBTASKS})
        </span>
      </header>
      <div className="sol-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.percent} aria-label="ความคืบหน้า">
        <span style={{ width: `${progress.percent}%` }} />
      </div>

      {progress.blockedByGate ? (
        <p className="sol-gate-alert" role="status">
          {blockedByGateMessage(progress.gateReasons)}
        </p>
      ) : null}

      {scope === "list" && error ? (
        <p className="crm-users-alert is-warn" role="alert">
          {error}
        </p>
      ) : null}
      {scope === "list" && ok ? (
        <p className="crm-users-alert is-ok" role="status">
          {ok}
        </p>
      ) : null}

      {used.length === 0 ? <p className="b2b-muted">ยังไม่มีงานย่อย{canEditParent ? " — เพิ่มงานแรกด้านล่าง" : ""}</p> : null}

      {used.map((department) => {
        const items = subtasks.filter((item) => item.department === department.id);
        const deptProgress = solDepartmentProgress(subtasks, department.id);
        const open = !closedDepartments[department.id];
        return (
          <div key={department.id} className="sol-dept-subtasks">
            <button
              type="button"
              className="sol-group-toggle"
              aria-expanded={open}
              onClick={() => setClosedDepartments({ ...closedDepartments, [department.id]: open })}
            >
              <strong>{department.label}</strong>
              <SolProgressBadge progress={deptProgress} />
            </button>
            {open ? (
              <ul className="sol-subtask-list">
                {items.map((item) => {
                  const touch = canTouchSubtask(access, item, parentDepartment);
                  const decider = canDecideSubtask(access, item.reviewerId);
                  const overdue = !item.completed && isOverdue(item.dueAt);
                  const gateBlocking = item.status === "blocked" && isBlockingGate(item.gateKind);
                  const active = action?.id === item.id ? action : null;
                  return (
                    <li key={item.id} className={item.completed ? "is-done" : gateBlocking ? "is-gate-blocked" : item.status === "blocked" ? "is-blocked" : ""}>
                      <label className="sol-subtask-check">
                        <input type="checkbox" checked={item.completed} disabled={pending || !touch} onChange={() => complete(item, !item.completed)} />
                        <span>{item.name}</span>
                      </label>
                      <p className="sol-subtask-meta">
                        <span className={`b2b-status is-${item.status}`}>{SOL_SUBTASK_STATUS_LABEL[item.status]}</span>{" "}
                        {item.gateKind !== "none" ? <span className={`b2b-status is-gate_${item.gateKind}`}>{SOL_GATE_LABEL[item.gateKind]}</span> : null}{" "}
                        <span className={`b2b-status is-priority_${item.priority}`}>{SOL_PRIORITY_LABEL[item.priority]}</span>
                        {" · "}
                        {item.ownerName || "ยังไม่มอบหมาย"}
                        {item.reviewerName ? ` · Reviewer ${item.reviewerName}` : ""}
                        {item.dueAt ? <span className={overdue ? " sol-overdue" : ""}> · กำหนด {formatDate(item.dueAt)}{overdue ? " (เลยกำหนด)" : ""}</span> : null}
                      </p>
                      {item.evidence ? <p className="sol-subtask-note"><strong>หลักฐาน:</strong> {item.evidence}</p> : null}
                      {item.comments ? <p className="sol-subtask-note"><strong>ความเห็น:</strong> {item.comments}</p> : null}
                      {item.thread.length ? (
                        <ul className="sol-subtask-thread" aria-label={`ความเห็นของ ${item.name}`}>
                          {item.thread.map((entry) => (
                            <li key={entry.id}>
                              <strong>{entry.authorName || "—"}</strong> · {formatDate(entry.createdAt)} — {entry.body}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {canEditParent ? (
                        <div className="b2b-row-actions">
                          {touch ? (
                            <button
                              type="button"
                              className="crm-users-secondary"
                              onClick={() => {
                                reset();
                                setDraft(draftFrom(item));
                                setDirty(false);
                                setTouched(false);
                              }}
                            >
                              {draft.id === item.id ? "กำลังแก้ไข" : "แก้ไข"}
                            </button>
                          ) : null}
                          {item.status === "needs_review" && touch && decider ? (
                            <>
                              <button type="button" className="kpi-button b2b-save" disabled={pending} onClick={() => decide(item, "approve")}>
                                อนุมัติ / Approve
                              </button>
                              <button type="button" className="crm-users-secondary" disabled={pending} onClick={() => openAction(item, "reject")}>
                                ปฏิเสธ / Reject
                              </button>
                            </>
                          ) : null}
                          {touch && !item.completed ? (
                            <button type="button" className="crm-users-secondary" disabled={pending} onClick={() => openAction(item, "escalate")}>
                              ยกระดับ / Escalate
                            </button>
                          ) : null}
                          <button type="button" className="crm-users-secondary" disabled={pending} onClick={() => openAction(item, "comment")}>
                            ความเห็น
                          </button>
                          {touch ? (
                            <button type="button" className="crm-users-secondary" disabled={pending} onClick={() => setDeleteId(item.id)}>
                              ลบ
                            </button>
                          ) : null}
                        </div>
                      ) : null}

                      {active ? (
                        <div className="sol-subtask-action" role="group" aria-label={active.kind === "escalate" ? "ยกระดับงานย่อย" : active.kind === "reject" ? "ปฏิเสธงานย่อย" : "เพิ่มความเห็น"}>
                          {active.kind === "escalate" ? (
                            <div className="sol-form-grid">
                              <Field label="ยกระดับเป็น / Escalate to">
                                <select className="crm-select" value={actionStatus} onChange={(event) => setActionStatus(event.target.value as "needs_review" | "blocked")}>
                                  <option value="needs_review">{SOL_SUBTASK_STATUS_LABEL.needs_review}</option>
                                  <option value="blocked">{SOL_SUBTASK_STATUS_LABEL.blocked}</option>
                                </select>
                              </Field>
                              <Field label="ผู้ตรวจ / Reviewer" hint={actionStatus === "needs_review" ? "จำเป็นเมื่อส่งตรวจ" : "ไม่บังคับเมื่อระบุว่าติดขัด"}>
                                <select className="crm-select" value={actionReviewer} onChange={(event) => setActionReviewer(event.target.value)}>
                                  <option value="">ยังไม่มี reviewer</option>
                                  {staff.map((person) => (
                                    <option key={person.id} value={person.id}>
                                      {person.name}
                                    </option>
                                  ))}
                                </select>
                              </Field>
                            </div>
                          ) : null}
                          <Field
                            label={active.kind === "comment" ? "ความเห็น / Comment" : active.kind === "reject" ? "เหตุผลที่ปฏิเสธ / Reason" : "บันทึกการยกระดับ / Note"}
                            hint="ห้ามใส่ข้อมูลแขก รหัสผ่าน อีเมล หรือเบอร์โทร"
                          >
                            <textarea className="crm-field" rows={2} value={actionNote} maxLength={1000} onChange={(event) => setActionNote(event.target.value)} />
                          </Field>
                          <div className="b2b-row-actions">
                            <button type="button" className="kpi-button b2b-save" disabled={pending} onClick={() => submitAction(item)}>
                              {pending ? "กำลังบันทึก…" : active.kind === "comment" ? "เพิ่มความเห็น" : active.kind === "reject" ? "ยืนยันปฏิเสธ" : "ยืนยันยกระดับ"}
                            </button>
                            <button type="button" className="crm-users-secondary" disabled={pending} onClick={closeAction}>
                              ยกเลิก
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}

      {canEditParent ? (
        <fieldset className="sol-fieldset sol-subtask-form" disabled={pending || (!draft.id && !canAdd)}>
          <legend>{draft.id ? "แก้ไขงานย่อย / Edit subtask" : "เพิ่มงานย่อย / Add subtask"}</legend>
          <div className="sol-form-grid">
            <div className="sol-span-2">
              <Field label="ชื่องานย่อย / Name *">
                <input className="crm-field" value={draft.name} maxLength={255} aria-invalid={touched && Boolean(validation)} onChange={(event) => patch({ name: event.target.value })} />
              </Field>
            </div>
            <Field label="แผนก / Department">
              <select className="crm-select" value={draft.department} onChange={(event) => patch({ department: event.target.value })}>
                {pickable.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ผู้รับผิดชอบ / Owner">
              <select className="crm-select" value={draft.ownerId} onChange={(event) => patch({ ownerId: event.target.value })}>
                <option value="">ยังไม่มอบหมาย</option>
                {staff.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ผู้ตรวจ / Reviewer">
              <select className="crm-select" value={draft.reviewerId} onChange={(event) => patch({ reviewerId: event.target.value })}>
                <option value="">ยังไม่มี reviewer</option>
                {staff.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="สถานะ / Status">
              <select
                className="crm-select"
                value={draft.status}
                onChange={(event) => {
                  const status = event.target.value as SolSubtaskStatus;
                  patch({ status, completed: status === "completed" });
                }}
              >
                {SOL_SUBTASK_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {SOL_SUBTASK_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="กำหนดส่ง / Due date">
              <input className="crm-field" type="date" value={draft.dueAt} onChange={(event) => patch({ dueAt: event.target.value })} />
            </Field>
            <Field label="ความสำคัญ / Priority">
              <select className="crm-select" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as SolPriority })}>
                {SOL_PRIORITIES.map((item) => (
                  <option key={item} value={item}>
                    {SOL_PRIORITY_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="เกต / Gate" hint="ติดขัดที่เกต permission / evidence / privacy / approval จะบล็อกการอนุมัติ เผยแพร่ หรือปิดงาน">
              <select className="crm-select" value={draft.gateKind} onChange={(event) => patch({ gateKind: event.target.value as SolGateKind })}>
                {SOL_GATE_KINDS.map((item) => (
                  <option key={item} value={item}>
                    {SOL_GATE_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <label className="crm-cms-field sol-span-2">
              <span>
                <input
                  type="checkbox"
                  checked={draft.completed}
                  onChange={(event) => patch({ completed: event.target.checked, status: event.target.checked ? "completed" : draft.status === "completed" ? "in_progress" : draft.status })}
                />{" "}
                เสร็จแล้ว / Completed
              </span>
            </label>
            <div className="sol-span-2">
              <Field label="ความเห็น / Comments" hint="ห้ามใส่ข้อมูลแขก รหัสผ่าน อีเมล หรือเบอร์โทร">
                <textarea className="crm-field" rows={2} value={draft.comments} onChange={(event) => patch({ comments: event.target.value })} />
              </Field>
            </div>
            <div className="sol-span-2">
              <Field label="หลักฐาน / Evidence" hint="ลิงก์ https:// หรือรหัสอ้างอิงภายใน — ไม่อัปโหลดไฟล์ และห้ามมีข้อมูลติดต่อ">
                <input className="crm-field" value={draft.evidence} onChange={(event) => patch({ evidence: event.target.value })} placeholder="https:// หรือ /media/…" />
              </Field>
            </div>
          </div>
          <SaveBar
            pending={pending}
            ok={scope === "form" ? ok : ""}
            error={touched && validation ? validation : scope === "form" ? error : ""}
            dirty={dirty}
            idle={!draft.id && !canAdd ? `ครบ ${MAX_SOL_SUBTASKS} รายการแล้ว` : dirty ? "มีการแก้ไขที่ยังไม่บันทึก / Unsaved changes" : "พร้อมบันทึกงานย่อย / Ready"}
            saveLabel={draft.id ? "บันทึกงานย่อย / Save subtask" : "เพิ่มงานย่อย / Add subtask"}
            onSave={save}
          />
          {draft.id ? (
            <button type="button" className="crm-users-secondary" onClick={resetForm}>
              ยกเลิกการแก้ไข / New subtask
            </button>
          ) : null}
        </fieldset>
      ) : (
        <p className="b2b-muted">ดูอย่างเดียว — ต้องได้รับสิทธิ์แผนกจึงจะเพิ่มหรือแก้งานย่อยได้</p>
      )}

      {deleteId ? (
        <B2bDialog
          title="ลบงานย่อย"
          body={`ยืนยันลบงานย่อย “${subtasks.find((item) => item.id === deleteId)?.name ?? ""}” พร้อมความเห็นทั้งหมด? การลบจะถูกบันทึกในประวัติ`}
          confirmLabel="ลบ"
          pending={pending}
          onCancel={() => setDeleteId("")}
          onConfirm={confirmDelete}
        />
      ) : null}
    </section>
  );
}