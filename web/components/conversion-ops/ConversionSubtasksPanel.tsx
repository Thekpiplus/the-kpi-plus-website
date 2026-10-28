"use client";

import { useState } from "react";
import { B2bDialog, Field, toDateInput } from "@/components/b2b-ops/ui";
import {
  MAX_CONV_SUBTASKS,
  CONV_DEPARTMENT_DUTIES,
  CONV_DEPARTMENT_LABEL,
  CONV_DEPARTMENTS,
  CONV_PRIORITIES,
  CONV_PRIORITY_LABEL,
  CONV_READINESS_LABEL,
  CONV_STARTER_SUBTASKS,
  CONV_SUBTASK_STATUS_LABEL,
  CONV_SUBTASK_STATUSES,
  type ConvAccessView,
  type ConvDepartment,
  type ConvPriority,
  type ConvProjectRow,
  type ConvSubtaskStatus,
  type ConvSubtaskView,
} from "@/lib/conversion-ops/types";

type Staff = { id: string; name: string };

export type ConvSubtaskDraft = {
  id: string;
  name: string;
  department: ConvDepartment;
  ownerId: string;
  status: ConvSubtaskStatus;
  dueAt: string;
  priority: ConvPriority;
  comments: string;
  source: string;
};

export function emptyConvSubtaskDraft(ownerId = "", department: ConvDepartment = "marketing"): ConvSubtaskDraft {
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
  };
}

export function draftFromConvSubtask(item: ConvSubtaskView): ConvSubtaskDraft {
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
  };
}

export function ConversionSubtasksPanel({
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
}: {
  row?: ConvProjectRow;
  staff: Staff[];
  access: ConvAccessView;
  pending: boolean;
  draft: ConvSubtaskDraft;
  comment: string;
  onDraftChange: (draft: ConvSubtaskDraft) => void;
  onCommentChange: (value: string) => void;
  onSave: () => void;
  onComplete: (item: ConvSubtaskView, completed: boolean) => void;
  onAddComment: (subtaskId: string) => void;
  onAttach: (subtaskId: string, form: HTMLFormElement) => void;
  onPatchSubtask?: (item: ConvSubtaskView, patch: Partial<ConvSubtaskDraft>) => void;
  onDelete?: (item: ConvSubtaskView) => void;
}) {
  const [deleteId, setDeleteId] = useState("");
  if (!row?.id) {
    return <p className="b2b-muted">บันทึกโปรเจกต์ก่อนจึงจะเพิ่มงานย่อยได้ (1–{MAX_CONV_SUBTASKS} รายการ)</p>;
  }
  const canEdit = access.canEditBoard;
  const patch = (next: Partial<ConvSubtaskDraft>) => onDraftChange({ ...draft, ...next });
  const selected = row.subtasks.find((item) => item.id === draft.id);

  return (
    <div className="ads-form-panel ads-subtasks seo-subtasks">
      <p className="b2b-muted">
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> · {row.progress.percent}% ·{" "}
        {CONV_READINESS_LABEL[row.progress.readiness]}
      </p>
      <div className="seo-ops-duties" aria-label="หน้าที่ของแต่ละแผนก">
        {CONV_DEPARTMENTS.map((department) => (
          <article key={department} className="seo-ops-stat">
            <strong>{CONV_DEPARTMENT_LABEL[department]}</strong>
            <ul>
              {CONV_DEPARTMENT_DUTIES[department].map((duty) => (
                <li key={duty}>{duty}</li>
              ))}
            </ul>
            {canEdit && row.subtasks.length < MAX_CONV_SUBTASKS ? (
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => {
                  const starter = CONV_STARTER_SUBTASKS.find((item) => item.department === department);
                  onDraftChange({
                    ...emptyConvSubtaskDraft(access.userId, department),
                    name: starter?.name || CONV_DEPARTMENT_DUTIES[department][0],
                  });
                }}
              >
                เพิ่มงาน {CONV_DEPARTMENT_LABEL[department]}
              </button>
            ) : null}
          </article>
        ))}
      </div>
      <ul className="ads-subtask-list">
        {row.subtasks.length ? (
          row.subtasks.map((item) => (
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
                {CONV_DEPARTMENT_LABEL[item.department]} · {CONV_SUBTASK_STATUS_LABEL[item.status]} · {CONV_PRIORITY_LABEL[item.priority]} ·{" "}
                {item.ownerName || "ยังไม่มอบหมาย"}
                {item.dueAt ? ` · ${new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(item.dueAt))}` : ""}
                {item.source ? ` · ${item.source}` : ""}
              </p>
              {canEdit ? (
                <div className="ads-inline-assign">
                  <button type="button" className="crm-users-secondary" onClick={() => onDraftChange(draftFromConvSubtask(item))}>
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
                          onPatchSubtask(item, { department: String(new FormData(event.currentTarget).get("department") || "") as ConvDepartment });
                        }}
                      >
                        <select className="crm-select" name="department" defaultValue={item.department} aria-label={`แผนก ${item.name}`}>
                          {CONV_DEPARTMENTS.map((department) => (
                            <option key={department} value={department}>
                              {CONV_DEPARTMENT_LABEL[department]}
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
                          onPatchSubtask(item, { status: String(new FormData(event.currentTarget).get("status") || "") as ConvSubtaskStatus });
                        }}
                      >
                        <select className="crm-select" name="status" defaultValue={item.status} aria-label={`สถานะ ${item.name}`}>
                          {CONV_SUBTASK_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {CONV_SUBTASK_STATUS_LABEL[status]}
                            </option>
                          ))}
                        </select>
                        <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                          สถานะ
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
          ))
        ) : (
          <li className="b2b-muted">ยังไม่มีงานย่อย</li>
        )}
      </ul>

      {canEdit && (draft.id || row.subtasks.length < MAX_CONV_SUBTASKS) ? (
        <div className="ads-subtask-form">
          <Field label="ชื่องานย่อย">
            <input className="crm-field" value={draft.name} onChange={(event) => patch({ name: event.target.value })} />
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
            <select className="crm-select" value={draft.status} onChange={(event) => patch({ status: event.target.value as ConvSubtaskStatus })}>
              {CONV_SUBTASK_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {CONV_SUBTASK_STATUS_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="กำหนดส่ง">
            <input className="crm-field" type="date" value={draft.dueAt} onChange={(event) => patch({ dueAt: event.target.value })} />
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
          <Field label="Comments">
            <textarea className="crm-field" rows={3} value={draft.comments} onChange={(event) => patch({ comments: event.target.value })} />
          </Field>
          <Field label="Evidence URL" hint="URL หรืออ้างอิงภาพหน้าจอภายใน ไม่ดึงข้อมูลจากภายนอก">
            <input className="crm-field" value={draft.source} onChange={(event) => patch({ source: event.target.value })} placeholder="https:// หรือ /media/… หรือชื่อไฟล์หลักฐาน" />
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
            <button type="button" className="crm-users-secondary" onClick={() => onDraftChange(emptyConvSubtaskDraft(access.userId))}>
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
