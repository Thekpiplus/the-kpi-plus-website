"use client";

import Link from "next/link";
import { Fragment, useMemo, useState, useTransition } from "react";
import {
  addB2bActivityComment,
  addB2bSubtask,
  assignB2bActivity,
  attachB2bActivityFile,
  changeB2bActivityStatus,
  closeB2bActivity,
  completeB2bSubtask,
  escalateB2bActivity,
  saveB2bActivity,
} from "@/lib/b2b-ops/actions";
import { formatB2bDateTime } from "@/lib/b2b-ops/format";
import {
  ACTIVITY_STATUS_LABEL,
  ACTIVITY_TYPE_LABEL,
  B2B_ACTIVITY_TYPES,
  B2B_CORE_ACTIVITY_STATUSES,
  B2B_PRIORITIES,
  B2B_SUBTASK_STATUSES,
  MAX_B2B_SUBTASKS,
  PRIORITY_LABEL,
  SUBTASK_STATUS_LABEL,
  b2bErrorMessage,
  type B2bAccessView,
  type B2bActivityStatus,
  type B2bActivityType,
  type B2bActivityView,
  type B2bPriority,
  type B2bSubtaskStatus,
} from "@/lib/b2b-ops/types";
import { B2bDialog, Field, SaveBar, toDateTimeInput } from "./ui";
import "../reservations-ops/reservation-queue.css";
import "./b2b-ops.css";

type Staff = { id: string; name: string };
type PartnerOption = { id: string; name: string; hotels?: string[] };
type Dialog = "close" | "escalate" | null;
type Draft = {
  id: string;
  partnerId: string;
  type: B2bActivityType;
  title: string;
  hotelName: string;
  dueAt: string;
  status: B2bActivityStatus;
  notes: string;
  ownerId: string;
  completedAt: string;
};

function emptyDraft(partnerId: string, ownerId: string): Draft {
  return {
    id: "",
    partnerId,
    type: "follow_up",
    title: "",
    hotelName: "",
    dueAt: "",
    status: "planned",
    notes: "",
    ownerId,
    completedAt: "",
  };
}

function draftFrom(row: B2bActivityView): Draft {
  return {
    id: row.id,
    partnerId: row.partnerId,
    type: row.type,
    title: row.title,
    hotelName: row.hotelName,
    dueAt: toDateTimeInput(row.dueAt),
    status: row.status,
    notes: row.notes,
    ownerId: row.ownerId,
    completedAt: toDateTimeInput(row.completedAt),
  };
}

function statusOptions(current: B2bActivityStatus) {
  return B2B_CORE_ACTIVITY_STATUSES.includes(current as (typeof B2B_CORE_ACTIVITY_STATUSES)[number])
    ? [...B2B_CORE_ACTIVITY_STATUSES]
    : [...B2B_CORE_ACTIVITY_STATUSES, current];
}

export function B2bActivityQueue({
  items,
  access,
  staff,
  partners,
  lockedPartnerId,
  filters,
}: {
  items: B2bActivityView[];
  access: B2bAccessView;
  staff: Staff[];
  partners: PartnerOption[];
  lockedPartnerId?: string;
  filters?: { q?: string; type?: string; status?: string; ownerId?: string };
}) {
  const defaultPartnerId = lockedPartnerId || partners[0]?.id || "";
  const [pending, startTransition] = useTransition();
  const [drawer, setDrawer] = useState<"closed" | "create" | "edit">("closed");
  const [draft, setDraft] = useState<Draft>(emptyDraft(defaultPartnerId, access.userId));
  const [selectedId, setSelectedId] = useState("");
  const [expandedId, setExpandedId] = useState("");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [comment, setComment] = useState("");
  const [subtask, setSubtask] = useState({
    name: "",
    status: "planned" as B2bSubtaskStatus,
    dueAt: "",
    assigneeId: "",
    priority: "normal" as B2bPriority,
    comments: "",
  });

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);
  const hotelOptions = useMemo(() => {
    const partner = partners.find((item) => item.id === draft.partnerId);
    return Array.from(new Set([...(partner?.hotels ?? []), ...items.map((item) => item.hotelName).filter(Boolean)]));
  }, [draft.partnerId, items, partners]);

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      setError("");
      setOk("");
      const result = await task();
      if (!result.ok) {
        setError(b2bErrorMessage(result.error));
        return;
      }
      if (result.id) {
        setSelectedId(result.id);
        setDraft((current) => (current.id ? current : { ...current, id: result.id }));
      }
      setOk(success);
    });
  }

  function openCreate() {
    setDraft(emptyDraft(defaultPartnerId, access.userId));
    setSelectedId("");
    setDrawer("create");
    setOk("");
    setError("");
  }

  function openEdit(row: B2bActivityView) {
    setDraft(draftFrom(row));
    setSelectedId(row.id);
    setDrawer("edit");
    setOk("");
    setError("");
  }

  function saveDraft() {
    const data = new FormData();
    Object.entries(draft).forEach(([key, value]) => data.set(key, value));
    run(() => saveB2bActivity(data), draft.id ? "บันทึกกิจกรรมแล้ว" : "สร้างกิจกรรมแล้ว");
  }

  const canEdit = access.canEditActivities;

  return (
    <div className="crm-ops b2b-page">
      {error ? (
        <p className="crm-users-alert is-warn" role="alert">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="crm-users-alert is-ok" role="status">
          {ok}
        </p>
      ) : null}

      {lockedPartnerId ? (
        <div className="b2b-toolbar">
          {canEdit ? (
            <button className="kpi-button b2b-save" type="button" onClick={openCreate}>
              เพิ่มกิจกรรม
            </button>
          ) : null}
        </div>
      ) : (
        <form className="crm-ops-filters" method="get">
          <input className="crm-field" name="q" defaultValue={filters?.q ?? ""} placeholder="ค้นหาพาร์ตเนอร์ หัวข้อ หรือโรงแรม" />
          <select className="crm-select" name="type" defaultValue={filters?.type ?? ""}>
            <option value="">ทุกประเภท</option>
            {B2B_ACTIVITY_TYPES.map((item) => (
              <option key={item} value={item}>
                {ACTIVITY_TYPE_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="status" defaultValue={filters?.status ?? ""}>
            <option value="">ทุกสถานะ</option>
            {B2B_CORE_ACTIVITY_STATUSES.map((item) => (
              <option key={item} value={item}>
                {ACTIVITY_STATUS_LABEL[item]}
              </option>
            ))}
            <option value="closed">{ACTIVITY_STATUS_LABEL.closed}</option>
            <option value="escalated">{ACTIVITY_STATUS_LABEL.escalated}</option>
          </select>
          <select className="crm-select" name="ownerId" defaultValue={filters?.ownerId ?? ""}>
            <option value="">ทุกผู้รับ</option>
            {staff.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <button className="crm-users-secondary" type="submit">
            กรอง
          </button>
          {canEdit && partners.length ? (
            <button className="kpi-button b2b-save" type="button" onClick={openCreate}>
              เพิ่มกิจกรรม
            </button>
          ) : null}
        </form>
      )}

      <div className="crm-pipe-table-wrap">
        {items.length === 0 ? (
          <p className="crm-pipe-table-empty">ยังไม่มีกิจกรรมติดตามของพาร์ตเนอร์</p>
        ) : (
          <table className="crm-pipe-table crm-ops-table b2b-table">
            <thead>
              <tr>
                <th>กิจกรรม</th>
                {!lockedPartnerId ? <th>พาร์ตเนอร์</th> : null}
                <th>ประเภท</th>
                <th>สถานะ</th>
                <th>ผู้รับ</th>
                <th>ครบกำหนด</th>
                <th>โรงแรม</th>
                <th>ความคืบหน้า</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <Fragment key={row.id}>
                  <tr>
                    <td data-label="กิจกรรม">
                      <button type="button" className="crm-ops-name" onClick={() => openEdit(row)}>
                        {row.title}
                      </button>
                    </td>
                    {!lockedPartnerId ? (
                      <td data-label="พาร์ตเนอร์">
                        <Link href={`/crm/b2b/partners/${row.partnerId}`}>{row.partnerName}</Link>
                      </td>
                    ) : null}
                    <td data-label="ประเภท">{ACTIVITY_TYPE_LABEL[row.type]}</td>
                    <td data-label="สถานะ">
                      {canEdit ? (
                        <form
                          className="crm-ops-inline"
                          onSubmit={(event) => {
                            event.preventDefault();
                            const data = new FormData(event.currentTarget);
                            run(() => changeB2bActivityStatus(data), "เปลี่ยนสถานะแล้ว");
                          }}
                        >
                          <input type="hidden" name="id" value={row.id} />
                          <select className="crm-select" name="status" key={`${row.id}-${row.status}`} defaultValue={row.status} aria-label={`สถานะ ${row.title}`}>
                            {statusOptions(row.status).map((item) => (
                              <option key={item} value={item}>
                                {ACTIVITY_STATUS_LABEL[item]}
                              </option>
                            ))}
                          </select>
                          <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                            เปลี่ยนสถานะ
                          </button>
                        </form>
                      ) : (
                        <span className={`b2b-status is-${row.status}`}>{ACTIVITY_STATUS_LABEL[row.status]}</span>
                      )}
                    </td>
                    <td data-label="ผู้รับ">
                      {canEdit ? (
                        <form
                          className="crm-ops-inline"
                          onSubmit={(event) => {
                            event.preventDefault();
                            const data = new FormData(event.currentTarget);
                            run(() => assignB2bActivity(data), "มอบหมายแล้ว");
                          }}
                        >
                          <input type="hidden" name="id" value={row.id} />
                          <select className="crm-select" name="ownerId" key={`${row.id}-${row.ownerId}`} defaultValue={row.ownerId} aria-label={`ผู้รับ ${row.title}`}>
                            <option value="">ยังไม่มอบหมาย</option>
                            {staff.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                          <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                            มอบหมาย
                          </button>
                        </form>
                      ) : (
                        row.ownerName || "ยังไม่มอบหมาย"
                      )}
                    </td>
                    <td data-label="ครบกำหนด">{formatB2bDateTime(row.dueAt)}</td>
                    <td data-label="โรงแรม">{row.hotelName || "—"}</td>
                    <td data-label="ความคืบหน้า">
                      <button type="button" className="crm-ops-progress" onClick={() => setExpandedId(expandedId === row.id ? "" : row.id)}>
                        <strong className="b2b-chip">{row.progress.countLabel}</strong>
                        <span>
                          {row.progress.percent}% · {row.progress.label}
                        </span>
                      </button>
                    </td>
                    <td data-label="การดำเนินการ">
                      <div className="crm-ops-row-actions">
                        <button type="button" className="crm-users-secondary" onClick={() => openEdit(row)}>
                          {canEdit ? "แก้ไข" : "เปิด"}
                        </button>
                        {canEdit ? (
                          <>
                            <button
                              type="button"
                              className="crm-users-secondary"
                              onClick={() => {
                                setSelectedId(row.id);
                                setDialog("close");
                              }}
                            >
                              ปิดงาน
                            </button>
                            <button
                              type="button"
                              className="crm-users-secondary"
                              onClick={() => {
                                setSelectedId(row.id);
                                setDialog("escalate");
                              }}
                            >
                              ส่งต่อ
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                  {expandedId === row.id ? (
                    <tr className="crm-ops-subrow">
                      <td colSpan={lockedPartnerId ? 8 : 9}>
                        {row.subtasks.length ? (
                          <ul className="crm-ops-subtasks">
                            {row.subtasks.map((item) => (
                              <li key={item.id}>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={item.completed}
                                    disabled={pending || !canEdit}
                                    onChange={() => {
                                      const data = new FormData();
                                      data.set("id", item.id);
                                      data.set("completed", item.completed ? "0" : "1");
                                      run(() => completeB2bSubtask(data), item.completed ? "เปิดซับงานแล้ว" : "ปิดซับงานแล้ว");
                                    }}
                                  />
                                  <span>{item.name}</span>
                                </label>
                                <em>
                                  {SUBTASK_STATUS_LABEL[item.status]} · {PRIORITY_LABEL[item.priority]}
                                  {item.assigneeName ? ` · ${item.assigneeName}` : ""}
                                  {item.dueAt ? ` · ${formatB2bDateTime(item.dueAt)}` : ""}
                                  {item.comments ? ` · ${item.comments}` : ""}
                                </em>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="b2b-muted">ยังไม่มีซับงาน</p>
                        )}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {drawer !== "closed" ? (
        <div className="b2b-drawer" role="dialog" aria-modal="true" aria-labelledby="b2b-activity-drawer-title">
          <button type="button" className="b2b-drawer-backdrop" aria-label="ปิดฟอร์ม" onClick={() => setDrawer("closed")} />
          <div className="b2b-drawer-panel">
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">B2B Activities</p>
                <h2 id="b2b-activity-drawer-title">{draft.id ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}</h2>
              </div>
              {canEdit ? <SaveBar pending={pending} ok={ok} error={error} onSave={saveDraft} /> : null}
            </header>

            <div className="b2b-form-grid">
              {lockedPartnerId ? null : (
                <Field label="พาร์ตเนอร์">
                  <select className="crm-select" value={draft.partnerId} onChange={(event) => setDraft({ ...draft, partnerId: event.target.value })}>
                    {partners.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
              <Field label="หัวข้อ">
                <input className="crm-field" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
              </Field>
              <Field label="ประเภท">
                <select className="crm-select" value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as B2bActivityType })}>
                  {B2B_ACTIVITY_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {ACTIVITY_TYPE_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="สถานะ">
                <select className="crm-select" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as B2bActivityStatus })}>
                  {statusOptions(draft.status).map((item) => (
                    <option key={item} value={item}>
                      {ACTIVITY_STATUS_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="ผู้รับ">
                <select className="crm-select" value={draft.ownerId} onChange={(event) => setDraft({ ...draft, ownerId: event.target.value })}>
                  <option value="">ยังไม่มอบหมาย</option>
                  {staff.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="ครบกำหนด">
                <input className="crm-field" type="datetime-local" value={draft.dueAt} onChange={(event) => setDraft({ ...draft, dueAt: event.target.value })} />
              </Field>
              <Field label="วันที่เสร็จ">
                <input className="crm-field" type="datetime-local" value={draft.completedAt} onChange={(event) => setDraft({ ...draft, completedAt: event.target.value })} />
              </Field>
              <Field label="โรงแรมที่เกี่ยวข้อง">
                <input
                  className="crm-field"
                  list="b2b-activity-hotels"
                  value={draft.hotelName}
                  onChange={(event) => setDraft({ ...draft, hotelName: event.target.value })}
                />
                <datalist id="b2b-activity-hotels">
                  {hotelOptions.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </Field>
              <Field label="บันทึก">
                <textarea className="crm-field" rows={3} value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} />
              </Field>
            </div>
            {canEdit ? <SaveBar pending={pending} ok={ok} error={error} onSave={saveDraft} /> : <p className="b2b-muted">บัญชีนี้ดูได้อย่างเดียว</p>}

            {selected ? (
              <>
                <section>
                  <h3>ซับงาน ({selected.progress.countLabel})</h3>
                  <p className="b2b-muted">
                    {selected.progress.percent}% · {selected.progress.label} · เพิ่มได้ 1–{MAX_B2B_SUBTASKS} รายการ
                  </p>
                  <ul className="crm-ops-subtasks">
                    {selected.subtasks.map((item) => (
                      <li key={item.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={item.completed}
                            disabled={pending || !canEdit}
                            onChange={() => {
                              const data = new FormData();
                              data.set("id", item.id);
                              data.set("completed", item.completed ? "0" : "1");
                              run(() => completeB2bSubtask(data), "อัปเดตซับงานแล้ว");
                            }}
                          />
                          <span>{item.name}</span>
                        </label>
                        <em>
                          {SUBTASK_STATUS_LABEL[item.status]} · {PRIORITY_LABEL[item.priority]} · {item.assigneeName || "ยังไม่มอบหมาย"}
                          {item.dueAt ? ` · ${formatB2bDateTime(item.dueAt)}` : ""}
                          {item.comments ? ` · ${item.comments}` : ""}
                        </em>
                      </li>
                    ))}
                  </ul>
                  {canEdit && selected.subtasks.length < MAX_B2B_SUBTASKS ? (
                    <div className="crm-ops-subtask-form b2b-subtask-form">
                      <input className="crm-field" value={subtask.name} onChange={(event) => setSubtask({ ...subtask, name: event.target.value })} placeholder="ชื่อซับงาน" />
                      <select className="crm-select" value={subtask.status} onChange={(event) => setSubtask({ ...subtask, status: event.target.value as B2bSubtaskStatus })}>
                        {B2B_SUBTASK_STATUSES.map((item) => (
                          <option key={item} value={item}>
                            {SUBTASK_STATUS_LABEL[item]}
                          </option>
                        ))}
                      </select>
                      <input className="crm-field" type="datetime-local" value={subtask.dueAt} onChange={(event) => setSubtask({ ...subtask, dueAt: event.target.value })} />
                      <select className="crm-select" value={subtask.assigneeId} onChange={(event) => setSubtask({ ...subtask, assigneeId: event.target.value })}>
                        <option value="">ผู้รับงาน</option>
                        {staff.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <select className="crm-select" value={subtask.priority} onChange={(event) => setSubtask({ ...subtask, priority: event.target.value as B2bPriority })}>
                        {B2B_PRIORITIES.map((item) => (
                          <option key={item} value={item}>
                            {PRIORITY_LABEL[item]}
                          </option>
                        ))}
                      </select>
                      <input className="crm-field" value={subtask.comments} onChange={(event) => setSubtask({ ...subtask, comments: event.target.value })} placeholder="ความคิดเห็นซับงาน" />
                      <button
                        className="kpi-button b2b-save"
                        type="button"
                        disabled={pending || !subtask.name.trim()}
                        onClick={() => {
                          const data = new FormData();
                          data.set("activityId", selected.id);
                          data.set("name", subtask.name);
                          data.set("status", subtask.status);
                          data.set("dueAt", subtask.dueAt);
                          data.set("assigneeId", subtask.assigneeId);
                          data.set("priority", subtask.priority);
                          data.set("comments", subtask.comments);
                          run(async () => {
                            const result = await addB2bSubtask(data);
                            if (result.ok) setSubtask({ name: "", status: "planned", dueAt: "", assigneeId: "", priority: "normal", comments: "" });
                            return result;
                          }, "เพิ่มซับงานแล้ว");
                        }}
                      >
                        เพิ่มซับงาน
                      </button>
                    </div>
                  ) : null}
                </section>

                <section>
                  <h3>ความคิดเห็น</h3>
                  <ul className="crm-ops-comments">
                    {selected.comments.length ? (
                      selected.comments.map((item) => (
                        <li key={item.id}>
                          <strong>{item.authorName || "ไม่ระบุ"}</strong>
                          <span>{formatB2bDateTime(item.createdAt)}</span>
                          <p>{item.body}</p>
                        </li>
                      ))
                    ) : (
                      <li className="b2b-muted">ยังไม่มีความคิดเห็น</li>
                    )}
                  </ul>
                  {canEdit ? (
                    <div className="crm-ops-comment-form">
                      <textarea className="crm-area" rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="เพิ่มความคิดเห็น" />
                      <button
                        className="kpi-button b2b-save"
                        type="button"
                        disabled={pending || !comment.trim()}
                        onClick={() => {
                          const data = new FormData();
                          data.set("activityId", selected.id);
                          data.set("body", comment);
                          run(async () => {
                            const result = await addB2bActivityComment(data);
                            if (result.ok) setComment("");
                            return result;
                          }, "บันทึกความคิดเห็นแล้ว");
                        }}
                      >
                        เพิ่มความคิดเห็น
                      </button>
                    </div>
                  ) : null}
                </section>

                <section>
                  <h3>ไฟล์แนบ</h3>
                  <ul className="crm-ops-files">
                    {selected.files.length ? (
                      selected.files.map((item) => (
                        <li key={item.id}>
                          <a href={item.href}>{item.filename}</a>
                          <span>{item.caption || formatB2bDateTime(item.createdAt)}</span>
                        </li>
                      ))
                    ) : (
                      <li className="b2b-muted">ยังไม่มีไฟล์แนบ</li>
                    )}
                  </ul>
                  {canEdit ? (
                    <form
                      className="crm-ops-file-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        const data = new FormData(event.currentTarget);
                        data.set("activityId", selected.id);
                        run(() => attachB2bActivityFile(data), "แนบไฟล์แล้ว");
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
                </section>

                {canEdit ? (
                  <div className="b2b-row-actions">
                    <button
                      type="button"
                      className="crm-users-secondary"
                      onClick={() => {
                        setSelectedId(selected.id);
                        setDialog("close");
                      }}
                    >
                      ปิดงาน
                    </button>
                    <button
                      type="button"
                      className="crm-users-secondary"
                      onClick={() => {
                        setSelectedId(selected.id);
                        setDialog("escalate");
                      }}
                    >
                      ส่งต่อ
                    </button>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      {dialog ? (
        <B2bDialog
          title={dialog === "close" ? "ปิดกิจกรรม" : "ส่งต่อกิจกรรม"}
          body={
            dialog === "close"
              ? "กิจกรรมจะย้ายเป็น Closed และไม่ถูกสถานะซับงานเขียนทับ"
              : "กิจกรรมจะย้ายเป็น Escalated เพื่อให้ผู้มีสิทธิ์ตัดสินใจต่อ"
          }
          confirmLabel={dialog === "close" ? "ปิดงาน" : "ส่งต่อ"}
          pending={pending}
          onCancel={() => setDialog(null)}
          onConfirm={() => {
            if (!selectedId) return;
            const data = new FormData();
            data.set("id", selectedId);
            const action = dialog === "close" ? closeB2bActivity : escalateB2bActivity;
            const success = dialog === "close" ? "ปิดงานแล้ว" : "ส่งต่องานแล้ว";
            setDialog(null);
            run(() => action(data), success);
          }}
        />
      ) : null}
    </div>
  );
}
