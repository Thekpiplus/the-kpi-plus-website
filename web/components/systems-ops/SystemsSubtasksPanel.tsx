"use client";

import { useState } from "react";
import { B2bDialog, Field, toDateInput } from "@/components/b2b-ops/ui";
import { convDepartmentProgress } from "@/lib/systems-ops/progress";
import {
  MAX_SYS_SUBTASKS,
  SYS_DEPARTMENT_DUTIES,
  SYS_DEPARTMENT_LABEL,
  SYS_DEPARTMENTS,
  SYS_PRIORITIES,
  SYS_PRIORITY_LABEL,
  SYS_READINESS_LABEL,
  SYS_SUBTASK_STATUS_LABEL,
  SYS_SUBTASK_STATUSES,
  sysDepartmentSubtasks,
  type SysAccessView,
  type SysDepartment,
  type SysPriority,
  type SysProjectRow,
  type SysSubtaskStatus,
  type SysSubtaskView,
} from "@/lib/systems-ops/types";

type Staff = { id: string; name: string };

export type SysSubtaskDraft = {
  id: string;
  name: string;
  department: SysDepartment;
  ownerId: string;
  status: SysSubtaskStatus;
  dueAt: string;
  priority: SysPriority;
  comments: string;
  source: string;
  providerDependency: string;
};

export function emptySysSubtaskDraft(ownerId = "", department: SysDepartment = "marketing"): SysSubtaskDraft {
  return {
    id: "",
    name: "",
    department,
    ownerId,
    status: "not_started",
    dueAt: "",
    priority: "normal",
    comments: "",
    source: "",
    providerDependency: "",
  };
}

export function draftFromSysSubtask(item: SysSubtaskView): SysSubtaskDraft {
  return {
    id: item.id,
    name: item.name,
    department: item.department,
    ownerId: item.ownerId,
    status: item.status,
    dueAt: toDateInput(item.dueAt),
    priority: item.priority,
    comments: item.comments,
    source: item.source,
    providerDependency: item.providerDependency,
  };
}

export function SystemsSubtasksPanel({
  row,
  staff,
  access,
  pending,
  draft,
  comment,
  onDraftChange,
  onCommentChange,
  onSave,
  onComplete,
  onAddComment,
  onAttach,
  onPatchSubtask,
  onDelete,
  onAddDuty,
}: {
  row?: SysProjectRow;
  staff: Staff[];
  access: SysAccessView;
  pending: boolean;
  draft: SysSubtaskDraft;
  comment: string;
  onDraftChange: (draft: SysSubtaskDraft) => void;
  onCommentChange: (value: string) => void;
  onSave: () => void;
  onComplete: (item: SysSubtaskView, completed: boolean) => void;
  onAddComment: (subtaskId: string) => void;
  onAttach: (subtaskId: string, form: HTMLFormElement) => void;
  onPatchSubtask?: (item: SysSubtaskView, patch: Partial<SysSubtaskDraft>) => void;
  onDelete?: (item: SysSubtaskView) => void;
  onAddDuty?: (department: SysDepartment, name: string) => void;
}) {
  const [deleteId, setDeleteId] = useState("");
  if (!row?.id) {
    return <p className="b2b-muted">บันทึกโปรเจกต์ก่อนจึงจะเพิ่มงานย่อยได้ (1–{MAX_SYS_SUBTASKS} รายการต่อแผนก)</p>;
  }
  const canEdit = access.canEditBoard;
  const patch = (next: Partial<SysSubtaskDraft>) => onDraftChange({ ...draft, ...next });
  const selected = row.subtasks.find((item) => item.id === draft.id);
  const departmentCount = (department: SysDepartment) => sysDepartmentSubtasks(row.subtasks, department).length;
  const canAddDepartment = (department: SysDepartment) => departmentCount(department) < MAX_SYS_SUBTASKS;

  return (
    <div className="ads-form-panel ads-subtasks seo-subtasks">
      <p className="b2b-muted">
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> · ความคืบหน้า {row.progress.percent}%
        (งานเสร็จ ÷ งานทั้งหมด × 100) · ความพร้อม: {SYS_READINESS_LABEL[row.progress.readiness]} · แต่ละแผนกมีงานย่อย 1–{MAX_SYS_SUBTASKS} รายการ
      </p>
      <div className="seo-ops-duties" aria-label="หน้าที่ของแต่ละแผนก">
        {SYS_DEPARTMENTS.map((department) => {
          const deptProgress = convDepartmentProgress(row.subtasks, department, row.status, row.approvals);
          return (
            <article key={department} className="seo-ops-stat">
              <strong>{SYS_DEPARTMENT_LABEL[department]}</strong>
              <span className={`ads-progress-badge is-${deptProgress.readiness}`}>{deptProgress.countLabel}</span>
              <ul>
                {SYS_DEPARTMENT_DUTIES[department].map((duty) => {
                  const exists = row.subtasks.some((item) => item.department === department && item.name === duty);
                  return (
                    <li key={duty}>
                      {duty}
                      {canEdit && !exists && canAddDepartment(department) ? (
                        <button
                          type="button"
                          className="crm-users-secondary"
                          disabled={pending}
                          onClick={() => {
                            if (onAddDuty) onAddDuty(department, duty);
                            else onDraftChange({ ...emptySysSubtaskDraft(access.userId, department), name: duty });
                          }}
                        >
                          เพิ่ม
                        </button>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
              {canEdit && canAddDepartment(department) ? (
                <button
                  type="button"
                  className="crm-users-secondary"
                  onClick={() => onDraftChange(emptySysSubtaskDraft(access.userId, department))}
                >
                  เพิ่มงาน {SYS_DEPARTMENT_LABEL[department]}
                </button>
              ) : null}
            </article>
          );
        })}
      </div>
      {SYS_DEPARTMENTS.map((department) => {
        const items = sysDepartmentSubtasks(row.subtasks, department);
        const deptProgress = convDepartmentProgress(row.subtasks, department, row.status, row.approvals);
        if (!items.length) return null;
        return (
          <section key={department} className="sys-dept-subtasks" aria-label={`งานย่อย ${SYS_DEPARTMENT_LABEL[department]}`}>
            <h3>
              {SYS_DEPARTMENT_LABEL[department]} · <span className={`ads-progress-badge is-${deptProgress.readiness}`}>{deptProgress.countLabel}</span>
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
                    {SYS_SUBTASK_STATUS_LABEL[item.status]} · {SYS_PRIORITY_LABEL[item.priority]} · {item.ownerName || "ยังไม่มอบหมาย"}
                    {item.dueAt ? ` · ${new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(item.dueAt))}` : ""}
                    {item.source ? ` · ${item.source}` : ""}
                    {item.providerDependency ? ` · Provider: ${item.providerDependency}` : ""}
                  </p>
                  {canEdit ? (
                    <div className="ads-inline-assign">
                      <button type="button" className="crm-users-secondary" onClick={() => onDraftChange(draftFromSysSubtask(item))}>
                        {selected?.id === item.id ? "กำลังแก้ไข" : "แก้ไข"}
                      </button>
                      {onPatchSubtask ? (
                        <>
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
                              onPatchSubtask(item, { department: String(new FormData(event.currentTarget).get("department") || "") as SysDepartment });
                            }}
                          >
                            <select className="crm-select" name="department" defaultValue={item.department} aria-label={`แผนก ${item.name}`}>
                              {SYS_DEPARTMENTS.map((next) => (
                                <option key={next} value={next}>
                                  {SYS_DEPARTMENT_LABEL[next]}
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
                              onPatchSubtask(item, { status: String(new FormData(event.currentTarget).get("status") || "") as SysSubtaskStatus });
                            }}
                          >
                            <select className="crm-select" name="status" defaultValue={item.status} aria-label={`สถานะ ${item.name}`}>
                              {SYS_SUBTASK_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {SYS_SUBTASK_STATUS_LABEL[status]}
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
                              onPatchSubtask(item, { providerDependency: String(new FormData(event.currentTarget).get("providerDependency") || "") });
                            }}
                          >
                            <input
                              className="crm-field"
                              name="providerDependency"
                              defaultValue={item.providerDependency}
                              placeholder="Provider dependency"
                              aria-label={`Provider dependency ${item.name}`}
                            />
                            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                              เพิ่ม dependency
                            </button>
                          </form>
                          <form
                            className="b2b-inline"
                            onSubmit={(event) => {
                              event.preventDefault();
                              onPatchSubtask(item, { source: String(new FormData(event.currentTarget).get("source") || "") });
                            }}
                          >
                            <input className="crm-field" name="source" defaultValue={item.source} placeholder="Evidence URL" aria-label={`หลักฐาน ${item.name}`} />
                            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                              เพิ่มหลักฐาน
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

      {canEdit && (draft.id || canAddDepartment(draft.department)) ? (
        <div className="ads-subtask-form">
          <Field label="ชื่องานย่อย">
            <input className="crm-field" value={draft.name} onChange={(event) => patch({ name: event.target.value })} />
          </Field>
          <Field label="แผนก">
            <select className="crm-select" value={draft.department} onChange={(event) => patch({ department: event.target.value as SysDepartment })}>
              {SYS_DEPARTMENTS.map((item) => (
                <option key={item} value={item}>
                  {SYS_DEPARTMENT_LABEL[item]}
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
          <Field label="สถานะ">
            <select className="crm-select" value={draft.status} onChange={(event) => patch({ status: event.target.value as SysSubtaskStatus })}>
              {SYS_SUBTASK_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {SYS_SUBTASK_STATUS_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="กำหนดส่ง">
            <input className="crm-field" type="date" value={draft.dueAt} onChange={(event) => patch({ dueAt: event.target.value })} />
          </Field>
          <Field label="ความสำคัญ">
            <select className="crm-select" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as SysPriority })}>
              {SYS_PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  {SYS_PRIORITY_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Comments">
            <textarea className="crm-field" rows={3} value={draft.comments} onChange={(event) => patch({ comments: event.target.value })} />
          </Field>
          <Field label="Evidence URL" hint="URL หรืออ้างอิงภาพหน้าจอภายใน ไม่ดึงข้อมูลจากภายนอก">
            <input className="crm-field" value={draft.source} onChange={(event) => patch({ source: event.target.value })} placeholder="https:// หรือ /media/… หรือชื่อไฟล์หลักฐาน" />
          </Field>
          <Field label="Provider dependency">
            <input className="crm-field" value={draft.providerDependency} onChange={(event) => patch({ providerDependency: event.target.value })} placeholder="ผู้ให้บริการหรือการเข้าถึงที่รออยู่ ไม่เก็บรหัสผ่าน" />
          </Field>
          <label className="crm-cms-field">
            <span>Completion</span>
            <input
              type="checkbox"
              checked={draft.status === "completed"}
              onChange={(event) => patch({ status: event.target.checked ? "completed" : draft.status === "completed" ? "not_started" : draft.status })}
            />
          </label>
          <button className="kpi-button b2b-save" type="button" disabled={pending || !draft.name.trim()} onClick={onSave}>
            {draft.id ? "บันทึกงานย่อย" : "เพิ่มงานย่อย"}
          </button>
          {draft.id ? (
            <button type="button" className="crm-users-secondary" onClick={() => onDraftChange(emptySysSubtaskDraft(access.userId))}>
              ยกเลิกแก้ไข
            </button>
          ) : null}
        </div>
      ) : null}

      {selected ? (
        <>
          <h3>ความคิดเห็น · {selected.name}</h3>
          <ul className="ads-comment-list">
            {selected.thread.length ? (
              selected.thread.map((item) => (
                <li key={item.id}>
                  <strong>{item.authorName || "—"}</strong>
                  <p>{item.body}</p>
                </li>
              ))
            ) : (
              <li className="b2b-muted">ยังไม่มีความเห็น</li>
            )}
          </ul>
          {canEdit ? (
            <div className="ads-comment-form">
              <textarea className="crm-field" rows={2} value={comment} onChange={(event) => onCommentChange(event.target.value)} placeholder="เพิ่มความคิดเห็น" />
              <button className="kpi-button b2b-save" type="button" disabled={pending || !comment.trim()} onClick={() => onAddComment(selected.id)}>
                เพิ่มความคิดเห็น
              </button>
            </div>
          ) : null}
          <h3>ไฟล์แนบภายใน</h3>
          <ul className="ads-file-list">
            {selected.files.length ? (
              selected.files.map((item) => (
                <li key={item.id}>
                  <a href={item.href}>{item.filename}</a>
                  {item.caption ? ` · ${item.caption}` : ""}
                </li>
              ))
            ) : (
              <li className="b2b-muted">ยังไม่มีไฟล์</li>
            )}
          </ul>
          {canEdit ? (
            <form
              className="ads-file-form"
              onSubmit={(event) => {
                event.preventDefault();
                onAttach(selected.id, event.currentTarget);
                event.currentTarget.reset();
              }}
            >
              <input className="crm-field" type="file" name="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" aria-label="แนบไฟล์ภายใน" />
              <input className="crm-field" name="caption" placeholder="คำอธิบายไฟล์" />
              <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                แนบไฟล์
              </button>
            </form>
          ) : null}
        </>
      ) : (
        <p className="b2b-muted">กดแก้ไขงานย่อยเพื่อเพิ่มความเห็นหรือแนบไฟล์</p>
      )}
      {deleteId && onDelete ? (
        <B2bDialog
          title="ลบงานย่อย"
          body="ยืนยันลบงานย่อยนี้ โปรเจกต์ต้องเหลืออย่างน้อย 1 รายการ"
          confirmLabel="ลบ"
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
