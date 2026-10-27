"use client";

import { Field, toDateInput } from "@/components/b2b-ops/ui";
import {
  ADS_DEPARTMENT_DUTIES,
  ADS_DEPARTMENT_LABEL,
  ADS_PRIORITY_LABEL,
  ADS_STARTER_SUBTASKS,
  ADS_SUBTASK_STATUS_LABEL,
  META_DEPARTMENTS,
  META_PRIORITIES,
  META_READINESS_LABEL,
  META_SUBTASK_STATUSES,
  MAX_META_SUBTASKS,
  type MetaAccessView,
  type MetaCampaignListItem,
  type MetaDepartment,
  type MetaPriority,
  type MetaSubtaskStatus,
  type MetaSubtaskView,
} from "@/lib/meta-ops/types";

type Staff = { id: string; name: string };

export type SubtaskDraft = {
  id: string;
  name: string;
  department: MetaDepartment;
  ownerId: string;
  status: MetaSubtaskStatus;
  dueAt: string;
  priority: MetaPriority;
  comments: string;
};

export function emptySubtaskDraft(ownerId = "", department: MetaDepartment = "marketing"): SubtaskDraft {
  return {
    id: "",
    name: "",
    department,
    ownerId,
    status: "not_started",
    dueAt: "",
    priority: "normal",
    comments: "",
  };
}

export function draftFromSubtask(item: MetaSubtaskView): SubtaskDraft {
  return {
    id: item.id,
    name: item.name,
    department: item.department,
    ownerId: item.ownerId,
    status: item.status,
    dueAt: toDateInput(item.dueAt),
    priority: item.priority,
    comments: item.comments,
  };
}

export function MetaSubtasksPanel({
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
  row?: MetaCampaignListItem;
  staff: Staff[];
  access: MetaAccessView;
  pending: boolean;
  draft: SubtaskDraft;
  comment: string;
  onDraftChange: (draft: SubtaskDraft) => void;
  onCommentChange: (value: string) => void;
  onSave: () => void;
  onComplete: (item: MetaSubtaskView, completed: boolean) => void;
  onAddComment: (subtaskId: string) => void;
  onAttach: (subtaskId: string, form: HTMLFormElement) => void;
  onPatchSubtask?: (item: MetaSubtaskView, patch: Partial<SubtaskDraft>) => void;
}) {
  if (!row?.id) {
    return <p className="b2b-muted">บันทึกแคมเปญก่อนจึงจะเพิ่มซับงานได้ (1–{MAX_META_SUBTASKS} รายการ)</p>;
  }
  const canEdit = access.canEditBoard;
  const patch = (next: Partial<SubtaskDraft>) => onDraftChange({ ...draft, ...next });
  const selected = row.subtasks.find((item) => item.id === draft.id);

  return (
    <div className="ads-form-panel ads-subtasks">
      <p className="b2b-muted">
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> · {row.progress.percent}% ·{" "}
        {META_READINESS_LABEL[row.progress.readiness]} · แต่ละแคมเปญมีซับงานได้ 1–{MAX_META_SUBTASKS} รายการ
      </p>
      <div className="meta-ops-duties" aria-label="หน้าที่ของแต่ละแผนก">
        {META_DEPARTMENTS.map((department) => (
          <article key={department}>
            <strong>{ADS_DEPARTMENT_LABEL[department]}</strong>
            <ul>
              {ADS_DEPARTMENT_DUTIES[department].map((duty) => (
                <li key={duty}>{duty}</li>
              ))}
            </ul>
            {canEdit && row.subtasks.length < MAX_META_SUBTASKS ? (
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => {
                  const starter = ADS_STARTER_SUBTASKS.find((item) => item.department === department);
                  onDraftChange({
                    ...emptySubtaskDraft(access.userId, department),
                    name: starter?.name || ADS_DEPARTMENT_DUTIES[department][0],
                  });
                }}
              >
                เพิ่มซับงาน {ADS_DEPARTMENT_LABEL[department]}
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
                {ADS_DEPARTMENT_LABEL[item.department]} · {ADS_SUBTASK_STATUS_LABEL[item.status]} · {ADS_PRIORITY_LABEL[item.priority]} ·{" "}
                {item.ownerName || "ยังไม่มอบหมาย"}
                {item.dueAt ? ` · ${new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(item.dueAt))}` : ""}
              </p>
              {canEdit ? (
                <div className="ads-inline-assign">
                  <button type="button" className="crm-users-secondary" onClick={() => onDraftChange(draftFromSubtask(item))}>
                    {selected?.id === item.id ? "กำลังแก้ไข" : "แก้ไข"}
                  </button>
                  {onPatchSubtask ? (
                    <>
                      <form
                        className="b2b-inline"
                        key={`${item.id}-owner-${item.ownerId}`}
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
                        key={`${item.id}-dept-${item.department}`}
                        onSubmit={(event) => {
                          event.preventDefault();
                          onPatchSubtask(item, { department: String(new FormData(event.currentTarget).get("department") || "") as MetaDepartment });
                        }}
                      >
                        <select className="crm-select" name="department" defaultValue={item.department} aria-label={`แผนก ${item.name}`}>
                          {META_DEPARTMENTS.map((department) => (
                            <option key={department} value={department}>
                              {ADS_DEPARTMENT_LABEL[department]}
                            </option>
                          ))}
                        </select>
                        <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                          แผนก
                        </button>
                      </form>
                      <form
                        className="b2b-inline"
                        key={`${item.id}-status-${item.status}`}
                        onSubmit={(event) => {
                          event.preventDefault();
                          onPatchSubtask(item, { status: String(new FormData(event.currentTarget).get("status") || "") as MetaSubtaskStatus });
                        }}
                      >
                        <select className="crm-select" name="status" defaultValue={item.status} aria-label={`สถานะ ${item.name}`}>
                          {META_SUBTASK_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {ADS_SUBTASK_STATUS_LABEL[status]}
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

      {canEdit && (draft.id || row.subtasks.length < MAX_META_SUBTASKS) ? (
        <div className="ads-subtask-form">
          <Field label="Subtask name">
            <input className="crm-field" value={draft.name} onChange={(event) => patch({ name: event.target.value })} />
          </Field>
          <Field label="Department">
            <select className="crm-select" value={draft.department} onChange={(event) => patch({ department: event.target.value as MetaDepartment })}>
              {META_DEPARTMENTS.map((item) => (
                <option key={item} value={item}>
                  {ADS_DEPARTMENT_LABEL[item]}
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
            <select className="crm-select" value={draft.status} onChange={(event) => patch({ status: event.target.value as MetaSubtaskStatus })}>
              {META_SUBTASK_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {ADS_SUBTASK_STATUS_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Due date">
            <input className="crm-field" type="date" value={draft.dueAt} onChange={(event) => patch({ dueAt: event.target.value })} />
          </Field>
          <Field label="Priority">
            <select className="crm-select" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as MetaPriority })}>
              {META_PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  {ADS_PRIORITY_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Comments">
            <textarea className="crm-area" rows={3} value={draft.comments} onChange={(event) => patch({ comments: event.target.value })} />
          </Field>
          <button className="kpi-button b2b-save" type="button" disabled={pending || !draft.name.trim()} onClick={onSave}>
            {draft.id ? "บันทึกซับงาน" : "เพิ่มซับงาน"}
          </button>
          {draft.id ? (
            <button type="button" className="crm-users-secondary" onClick={() => onDraftChange(emptySubtaskDraft(access.userId))}>
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
              <textarea className="crm-area" rows={2} value={comment} onChange={(event) => onCommentChange(event.target.value)} placeholder="เพิ่มความคิดเห็น" />
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
              <input className="crm-field" type="file" name="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" />
              <input className="crm-field" name="caption" placeholder="คำอธิบายไฟล์" />
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
