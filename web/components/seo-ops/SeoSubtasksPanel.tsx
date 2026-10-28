"use client";

import { Field, toDateInput } from "@/components/b2b-ops/ui";
import {
  MAX_SEO_SUBTASKS,
  SEO_DEPARTMENT_DUTIES,
  SEO_DEPARTMENT_LABEL,
  SEO_DEPARTMENTS,
  SEO_PRIORITIES,
  SEO_PRIORITY_LABEL,
  SEO_READINESS_LABEL,
  SEO_STARTER_SUBTASKS,
  SEO_SUBTASK_STATUS_LABEL,
  SEO_SUBTASK_STATUSES,
  type SeoAccessView,
  type SeoDepartment,
  type SeoPriority,
  type SeoPropertyRow,
  type SeoSubtaskStatus,
  type SeoSubtaskView,
} from "@/lib/seo-ops/types";

type Staff = { id: string; name: string };

export type SeoSubtaskDraft = {
  id: string;
  name: string;
  department: SeoDepartment;
  ownerId: string;
  status: SeoSubtaskStatus;
  dueAt: string;
  priority: SeoPriority;
  comments: string;
  source: string;
};

export function emptySeoSubtaskDraft(ownerId = "", department: SeoDepartment = "marketing"): SeoSubtaskDraft {
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

export function draftFromSeoSubtask(item: SeoSubtaskView): SeoSubtaskDraft {
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

export function SeoSubtasksPanel({
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
}: {
  row?: SeoPropertyRow;
  staff: Staff[];
  access: SeoAccessView;
  pending: boolean;
  draft: SeoSubtaskDraft;
  comment: string;
  onDraftChange: (draft: SeoSubtaskDraft) => void;
  onCommentChange: (value: string) => void;
  onSave: () => void;
  onComplete: (item: SeoSubtaskView, completed: boolean) => void;
  onAddComment: (subtaskId: string) => void;
  onAttach: (subtaskId: string, form: HTMLFormElement) => void;
  onPatchSubtask?: (item: SeoSubtaskView, patch: Partial<SeoSubtaskDraft>) => void;
}) {
  if (!row?.id) {
    return <p className="b2b-muted">บันทึกรายการก่อนจึงจะเพิ่มซับงานได้ (1–{MAX_SEO_SUBTASKS} รายการ)</p>;
  }
  const canEdit = access.canEditBoard;
  const patch = (next: Partial<SeoSubtaskDraft>) => onDraftChange({ ...draft, ...next });
  const selected = row.subtasks.find((item) => item.id === draft.id);

  return (
    <div className="ads-form-panel ads-subtasks seo-subtasks">
      <p className="b2b-muted">
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> · {row.progress.percent}% ·{" "}
        {SEO_READINESS_LABEL[row.progress.readiness]} · แต่ละงานมีซับงานได้ 1–{MAX_SEO_SUBTASKS} รายการ
      </p>
      <div className="seo-ops-duties" aria-label="หน้าที่ของแต่ละแผนก">
        {SEO_DEPARTMENTS.map((department) => (
          <article key={department} className="seo-ops-stat">
            <strong>{SEO_DEPARTMENT_LABEL[department]}</strong>
            <ul>
              {SEO_DEPARTMENT_DUTIES[department].map((duty) => (
                <li key={duty}>{duty}</li>
              ))}
            </ul>
            {canEdit && row.subtasks.length < MAX_SEO_SUBTASKS ? (
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => {
                  const starter = SEO_STARTER_SUBTASKS.find((item) => item.department === department);
                  onDraftChange({
                    ...emptySeoSubtaskDraft(access.userId, department),
                    name: starter?.name || SEO_DEPARTMENT_DUTIES[department][0],
                  });
                }}
              >
                เพิ่มซับงาน {SEO_DEPARTMENT_LABEL[department]}
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
                {SEO_DEPARTMENT_LABEL[item.department]} · {SEO_SUBTASK_STATUS_LABEL[item.status]} · {SEO_PRIORITY_LABEL[item.priority]} ·{" "}
                {item.ownerName || "ยังไม่มอบหมาย"}
                {item.dueAt ? ` · ${new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(item.dueAt))}` : ""}
                {item.source ? ` · ${item.source}` : ""}
              </p>
              {canEdit ? (
                <div className="ads-inline-assign">
                  <button type="button" className="crm-users-secondary" onClick={() => onDraftChange(draftFromSeoSubtask(item))}>
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
                          onPatchSubtask(item, { department: String(new FormData(event.currentTarget).get("department") || "") as SeoDepartment });
                        }}
                      >
                        <select className="crm-select" name="department" defaultValue={item.department} aria-label={`แผนก ${item.name}`}>
                          {SEO_DEPARTMENTS.map((department) => (
                            <option key={department} value={department}>
                              {SEO_DEPARTMENT_LABEL[department]}
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
                          onPatchSubtask(item, { status: String(new FormData(event.currentTarget).get("status") || "") as SeoSubtaskStatus });
                        }}
                      >
                        <select className="crm-select" name="status" defaultValue={item.status} aria-label={`สถานะ ${item.name}`}>
                          {SEO_SUBTASK_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {SEO_SUBTASK_STATUS_LABEL[status]}
                            </option>
                          ))}
                        </select>
                        <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                          สถานะ
                        </button>
                      </form>
                    </>
                  ) : null}
                </div>
              ) : null}
            </li>
          ))
        ) : (
          <li className="b2b-muted">ยังไม่มีซับงาน</li>
        )}
      </ul>

      {canEdit && (draft.id || row.subtasks.length < MAX_SEO_SUBTASKS) ? (
        <div className="ads-subtask-form">
          <Field label="Subtask name">
            <input className="crm-field" value={draft.name} onChange={(event) => patch({ name: event.target.value })} />
          </Field>
          <Field label="Department">
            <select className="crm-select" value={draft.department} onChange={(event) => patch({ department: event.target.value as SeoDepartment })}>
              {SEO_DEPARTMENTS.map((item) => (
                <option key={item} value={item}>
                  {SEO_DEPARTMENT_LABEL[item]}
                </option>
              ))}
            </select>
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
          <Field label="Status">
            <select className="crm-select" value={draft.status} onChange={(event) => patch({ status: event.target.value as SeoSubtaskStatus })}>
              {SEO_SUBTASK_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {SEO_SUBTASK_STATUS_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Due date">
            <input className="crm-field" type="date" value={draft.dueAt} onChange={(event) => patch({ dueAt: event.target.value })} />
          </Field>
          <Field label="Priority">
            <select className="crm-select" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as SeoPriority })}>
              {SEO_PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  {SEO_PRIORITY_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Comments">
            <textarea className="crm-field" rows={3} value={draft.comments} onChange={(event) => patch({ comments: event.target.value })} />
          </Field>
          <Field label="Source" hint="URL หรืออ้างอิงภายใน ไม่ดึงข้อมูลจากภายนอก">
            <input className="crm-field" value={draft.source} onChange={(event) => patch({ source: event.target.value })} />
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
            {draft.id ? "บันทึกซับงาน" : "เพิ่มซับงาน"}
          </button>
          {draft.id ? (
            <button type="button" className="crm-users-secondary" onClick={() => onDraftChange(emptySeoSubtaskDraft(access.userId))}>
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
              <li className="b2b-muted">ยังไม่มีความเห็นเพิ่ม</li>
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
          <h3>ไฟล์แนบ</h3>
          <ul className="ads-file-list">
            {selected.files.length ? (
              selected.files.map((item) => (
                <li key={item.id}>
                  <a href={item.href}>{item.filename}</a>
                  {item.caption ? <span> · {item.caption}</span> : null}
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
              <input className="crm-field" type="file" name="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" aria-label="แนบไฟล์หรือรูปภาพ" />
              <input className="crm-field" name="caption" placeholder="คำอธิบายไฟล์" aria-label="คำอธิบายไฟล์" />
              <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                แนบไฟล์/รูป
              </button>
            </form>
          ) : null}
        </>
      ) : (
        <p className="b2b-muted">กดแก้ไขซับงานเพื่อเพิ่มความเห็นหรือแนบไฟล์</p>
      )}
    </div>
  );
}
