"use client";

import { Fragment, useMemo, useState, useTransition } from "react";
import {
  addReservationOpComment,
  addReservationSubtask,
  assignReservationOperation,
  attachReservationOpImage,
  changeReservationOpStatus,
  closeReservationOperation,
  completeReservationSubtask,
  escalateReservationOperation,
  saveReservationOperation,
} from "@/lib/reservations-ops/actions";
import { formatOpDate } from "@/lib/reservations-ops/queries";
import "./reservation-queue.css";
import {
  CHANNEL_LABEL,
  MAX_RESERVATION_SUBTASKS,
  PRIORITY_LABEL,
  RESERVATION_OP_CHANNELS,
  RESERVATION_OP_PRIORITIES,
  RESERVATION_OP_STATUSES,
  RESERVATION_OP_TYPES,
  RESERVATION_SUBTASK_STATUSES,
  STATUS_LABEL,
  SUBTASK_STATUS_LABEL,
  TYPE_LABEL,
  reservationOpErrorMessage,
  type ReservationOpChannel,
  type ReservationOpPriority,
  type ReservationOpStatus,
  type ReservationOpType,
  type ReservationOperationView,
} from "@/lib/reservations-ops/types";

type Staff = { id: string; name: string };
type Dialog = "reveal" | "close" | "escalate" | null;
type Draft = {
  id: string;
  name: string;
  type: ReservationOpType;
  channel: ReservationOpChannel;
  status: ReservationOpStatus;
  priority: ReservationOpPriority;
  assigneeId: string;
  dueAt: string;
  hotelName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  bookingCode: string;
  notes: string;
};

function emptyDraft(): Draft {
  return {
    id: "",
    name: "",
    type: "inquiry",
    channel: "direct",
    status: "new",
    priority: "normal",
    assigneeId: "",
    dueAt: "",
    hotelName: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    bookingCode: "",
    notes: "",
  };
}

function toLocalInput(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function draftFrom(row: ReservationOperationView, revealed: boolean): Draft {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    channel: row.channel,
    status: row.status,
    priority: row.priority,
    assigneeId: row.assigneeId,
    dueAt: toLocalInput(row.dueAt),
    hotelName: row.hotelName,
    guestName: revealed ? row.guest.name : "",
    guestEmail: revealed ? row.guest.email : "",
    guestPhone: revealed ? row.guest.phone : "",
    bookingCode: revealed ? row.guest.bookingCode : "",
    notes: row.notes,
  };
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="crm-cms-field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function ReservationQueue({
  items,
  staff,
  canRevealGuest,
  filters,
}: {
  items: ReservationOperationView[];
  staff: Staff[];
  canRevealGuest: boolean;
  filters: { q?: string; type?: string; status?: string; channel?: string; assigneeId?: string };
}) {
  const [pending, startTransition] = useTransition();
  const [drawer, setDrawer] = useState<"closed" | "create" | "edit">("closed");
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [selectedId, setSelectedId] = useState("");
  const [expandedId, setExpandedId] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [status, setStatus] = useState("");
  const [ok, setOk] = useState("");
  const [comment, setComment] = useState("");
  const [subtaskName, setSubtaskName] = useState("");
  const [subtaskDue, setSubtaskDue] = useState("");
  const [subtaskAssignee, setSubtaskAssignee] = useState("");
  const [subtaskPriority, setSubtaskPriority] = useState<ReservationOpPriority>("normal");

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);
  const dirtySave = pending ? "กำลังบันทึก…" : status ? "บันทึกไม่สำเร็จ" : ok || "พร้อมบันทึก";

  function mark(message = "") {
    setOk(message);
    setStatus("");
  }

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success = "บันทึกแล้ว") {
    startTransition(async () => {
      setStatus("");
      setOk("");
      const result = await task();
      if (!result.ok) {
        setStatus(reservationOpErrorMessage(result.error));
        return;
      }
      if (result.id) setSelectedId(result.id);
      setOk(success);
    });
  }

  function openCreate() {
    setDraft(emptyDraft());
    setSelectedId("");
    setRevealed(true);
    setDrawer("create");
    mark();
  }

  function openEdit(row: ReservationOperationView) {
    setSelectedId(row.id);
    setRevealed(false);
    setDraft(draftFrom(row, false));
    setDrawer("edit");
    mark();
  }

  function saveDraft() {
    const data = new FormData();
    Object.entries(draft).forEach(([key, value]) => data.set(key, value));
    run(() => saveReservationOperation(data), draft.id ? "บันทึกแล้ว" : "สร้างรายการแล้ว");
  }

  const saveBar = (
    <div className="crm-cs-savebar">
      <button className="kpi-button" type="button" onClick={saveDraft} disabled={pending}>
        {pending ? "กำลังบันทึก…" : "บันทึก"}
      </button>
      <p className={`crm-cs-save-state${status ? " is-error" : ok ? " is-ok" : ""}`} role="status">
        {dirtySave}
      </p>
    </div>
  );

  return (
    <div className="crm-ops">
      {status ? (
        <p className="crm-users-alert is-warn" role="alert">
          {status}
        </p>
      ) : null}
      {ok ? (
        <p className="crm-users-alert is-ok" role="status">
          {ok}
        </p>
      ) : null}

      <form className="crm-ops-filters" method="get">
        <input className="crm-field" name="q" defaultValue={filters.q ?? ""} placeholder="ค้นหารหัสหรือชื่องาน" />
        <select className="crm-select" name="type" defaultValue={filters.type ?? ""}>
          <option value="">ทุกประเภท</option>
          {RESERVATION_OP_TYPES.map((item) => (
            <option key={item} value={item}>
              {TYPE_LABEL[item]}
            </option>
          ))}
        </select>
        <select className="crm-select" name="status" defaultValue={filters.status ?? ""}>
          <option value="">ทุกสถานะ</option>
          {RESERVATION_OP_STATUSES.map((item) => (
            <option key={item} value={item}>
              {STATUS_LABEL[item]}
            </option>
          ))}
        </select>
        <select className="crm-select" name="channel" defaultValue={filters.channel ?? ""}>
          <option value="">ทุกช่องทาง</option>
          {RESERVATION_OP_CHANNELS.map((item) => (
            <option key={item} value={item}>
              {CHANNEL_LABEL[item]}
            </option>
          ))}
        </select>
        <select className="crm-select" name="assigneeId" defaultValue={filters.assigneeId ?? ""}>
          <option value="">ทุกผู้รับงาน</option>
          {staff.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <button className="crm-users-secondary" type="submit">
          กรอง
        </button>
        <button className="kpi-button" type="button" onClick={openCreate}>
          เพิ่มงาน
        </button>
      </form>

      <div className="crm-pipe-table-wrap">
        {items.length === 0 ? (
          <p className="crm-pipe-table-empty">ยังไม่มีงานในคิว Reservation Operations</p>
        ) : (
          <table className="crm-pipe-table crm-ops-table">
            <thead>
              <tr>
                <th>รหัส</th>
                <th>งาน</th>
                <th>ประเภท</th>
                <th>ช่องทาง</th>
                <th>สถานะ</th>
                <th>ความสำคัญ</th>
                <th>ผู้รับงาน</th>
                <th>ครบกำหนด</th>
                <th>สร้าง</th>
                <th>อัปเดต</th>
                <th>ความคืบหน้า</th>
                <th>แขก</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <Fragment key={row.id}>
                  <tr>
                    <td data-label="รหัส" className="kpi-latin">
                      {row.reference}
                    </td>
                    <td data-label="งาน">
                      <button type="button" className="crm-ops-name" onClick={() => openEdit(row)}>
                        {row.name}
                      </button>
                      {row.hotelName ? <small>{row.hotelName}</small> : null}
                    </td>
                    <td data-label="ประเภท">{TYPE_LABEL[row.type]}</td>
                    <td data-label="ช่องทาง">{CHANNEL_LABEL[row.channel]}</td>
                    <td data-label="สถานะ">
                      <form
                        className="crm-ops-inline"
                        onSubmit={(event) => {
                          event.preventDefault();
                          const data = new FormData(event.currentTarget);
                          run(() => changeReservationOpStatus(data), "เปลี่ยนสถานะแล้ว");
                        }}
                      >
                        <input type="hidden" name="id" value={row.id} />
                        <select className="crm-select" name="status" defaultValue={row.status} aria-label={`สถานะ ${row.reference}`}>
                          {RESERVATION_OP_STATUSES.map((item) => (
                            <option key={item} value={item}>
                              {STATUS_LABEL[item]}
                            </option>
                          ))}
                        </select>
                        <button className="crm-pipe-move-btn" type="submit" disabled={pending}>
                          เปลี่ยน
                        </button>
                      </form>
                    </td>
                    <td data-label="ความสำคัญ">
                      <span className={`crm-ops-priority is-${row.priority}`}>{PRIORITY_LABEL[row.priority]}</span>
                    </td>
                    <td data-label="ผู้รับงาน">
                      <form
                        className="crm-ops-inline"
                        onSubmit={(event) => {
                          event.preventDefault();
                          const data = new FormData(event.currentTarget);
                          run(() => assignReservationOperation(data), "มอบหมายแล้ว");
                        }}
                      >
                        <input type="hidden" name="id" value={row.id} />
                        <select className="crm-select" name="assigneeId" defaultValue={row.assigneeId} aria-label={`ผู้รับงาน ${row.reference}`}>
                          <option value="">ยังไม่มอบหมาย</option>
                          {staff.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        <button className="crm-pipe-move-btn" type="submit" disabled={pending}>
                          มอบหมาย
                        </button>
                      </form>
                    </td>
                    <td data-label="ครบกำหนด">{formatOpDate(row.dueAt)}</td>
                    <td data-label="สร้าง">{formatOpDate(row.createdAt)}</td>
                    <td data-label="อัปเดต">{formatOpDate(row.updatedAt)}</td>
                    <td data-label="ความคืบหน้า">
                      <button type="button" className="crm-ops-progress" onClick={() => setExpandedId(expandedId === row.id ? "" : row.id)}>
                        <strong>{row.progress.countLabel}</strong>
                        <span>
                          {row.progress.percent}% · {row.progress.label}
                        </span>
                      </button>
                    </td>
                    <td data-label="แขก">
                      {row.guest.name || row.guest.bookingCode || "ปกปิดไว้"}
                      {row.guest.masked ? <small>ข้อมูลแขกถูกปกปิด</small> : null}
                    </td>
                    <td data-label="การดำเนินการ">
                      <div className="crm-ops-row-actions">
                        <button type="button" className="crm-users-secondary" onClick={() => openEdit(row)}>
                          แก้ไข
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
                      </div>
                    </td>
                  </tr>
                  {expandedId === row.id ? (
                    <tr className="crm-ops-subrow">
                      <td colSpan={13}>
                        {row.subtasks.length ? (
                          <ul className="crm-ops-subtasks">
                            {row.subtasks.map((item) => (
                              <li key={item.id}>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={item.completed}
                                    disabled={pending}
                                    onChange={() => {
                                      const data = new FormData();
                                      data.set("id", item.id);
                                      data.set("completed", item.completed ? "0" : "1");
                                      run(() => completeReservationSubtask(data), item.completed ? "เปิดซับงานแล้ว" : "ปิดซับงานแล้ว");
                                    }}
                                  />
                                  <span>{item.name}</span>
                                </label>
                                <em>
                                  {SUBTASK_STATUS_LABEL[item.status]} · {PRIORITY_LABEL[item.priority]}
                                  {item.assigneeName ? ` · ${item.assigneeName}` : ""}
                                  {item.dueAt ? ` · ${formatOpDate(item.dueAt)}` : ""}
                                </em>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>ยังไม่มีซับงาน</p>
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
        <div className="crm-ops-drawer" role="dialog" aria-modal="true" aria-labelledby="ops-drawer-title">
          <button type="button" className="crm-ops-drawer-backdrop" aria-label="ปิด" onClick={() => setDrawer("closed")} />
          <div className="crm-ops-drawer-panel">
            <header className="crm-cms-editor-panel-head crm-cs-editor-head">
              <div>
                <p className="crm-cms-editor-kicker">Reservation Operations</p>
                <h2 id="ops-drawer-title">{draft.id ? `แก้ไข ${selected?.reference ?? ""}` : "เพิ่มงานในคิว"}</h2>
              </div>
              {saveBar}
            </header>

            <div className="crm-ops-drawer-grid">
              <Field label="ชื่องาน / รหัสอ้างอิงภายใน">
                <input className="crm-field" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
              </Field>
              <Field label="ประเภท">
                <select className="crm-select" value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as ReservationOpType })}>
                  {RESERVATION_OP_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {TYPE_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="ช่องทาง">
                <select className="crm-select" value={draft.channel} onChange={(event) => setDraft({ ...draft, channel: event.target.value as ReservationOpChannel })}>
                  {RESERVATION_OP_CHANNELS.map((item) => (
                    <option key={item} value={item}>
                      {CHANNEL_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="สถานะ">
                <select className="crm-select" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as ReservationOpStatus })}>
                  {RESERVATION_OP_STATUSES.map((item) => (
                    <option key={item} value={item}>
                      {STATUS_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="ความสำคัญ">
                <select className="crm-select" value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as ReservationOpPriority })}>
                  {RESERVATION_OP_PRIORITIES.map((item) => (
                    <option key={item} value={item}>
                      {PRIORITY_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="ผู้รับงาน">
                <select className="crm-select" value={draft.assigneeId} onChange={(event) => setDraft({ ...draft, assigneeId: event.target.value })}>
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
              <Field label="โรงแรม">
                <input className="crm-field" value={draft.hotelName} onChange={(event) => setDraft({ ...draft, hotelName: event.target.value })} />
              </Field>
            </div>

            <section className="crm-ops-guest">
              <div className="crm-ops-guest-head">
                <h3>ข้อมูลแขก</h3>
                {draft.id && !revealed ? (
                  <button
                    type="button"
                    className="crm-users-secondary"
                    onClick={() => {
                      if (!canRevealGuest) return;
                      setDialog("reveal");
                    }}
                    disabled={!canRevealGuest}
                  >
                    {canRevealGuest ? "แสดงข้อมูลเต็ม" : "ไม่มีสิทธิ์ดูข้อมูลแขก"}
                  </button>
                ) : null}
              </div>
              {draft.id && !revealed ? (
                <p className="crm-cms-editor-note">
                  {selected?.guest.name || "Guest"} · {selected?.guest.email || "ไม่มีอีเมล"} · {selected?.guest.phone || "ไม่มีเบอร์"} · {selected?.guest.bookingCode || "ไม่มีรหัสจอง"}
                </p>
              ) : (
                <div className="crm-ops-drawer-grid">
                  <Field label="ชื่อแขก">
                    <input className="crm-field" value={draft.guestName} onChange={(event) => setDraft({ ...draft, guestName: event.target.value })} />
                  </Field>
                  <Field label="อีเมลแขก">
                    <input className="crm-field" value={draft.guestEmail} onChange={(event) => setDraft({ ...draft, guestEmail: event.target.value })} />
                  </Field>
                  <Field label="เบอร์โทรแขก">
                    <input className="crm-field" value={draft.guestPhone} onChange={(event) => setDraft({ ...draft, guestPhone: event.target.value })} />
                  </Field>
                  <Field label="รหัสจองภายใน">
                    <input className="crm-field" value={draft.bookingCode} onChange={(event) => setDraft({ ...draft, bookingCode: event.target.value })} />
                  </Field>
                </div>
              )}
            </section>

            <Field label="บันทึกภายใน">
              <textarea className="crm-area" rows={4} value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} />
            </Field>
            {saveBar}

            {selected ? (
              <>
                <section>
                  <h3>ซับงาน ({selected.progress.countLabel})</h3>
                  <p className="crm-cms-editor-note">
                    {selected.progress.percent}% · {selected.progress.label} · เพิ่มได้สูงสุด {MAX_RESERVATION_SUBTASKS} รายการ
                  </p>
                  <ul className="crm-ops-subtasks">
                    {selected.subtasks.map((item) => (
                      <li key={item.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={item.completed}
                            disabled={pending}
                            onChange={() => {
                              const data = new FormData();
                              data.set("id", item.id);
                              data.set("completed", item.completed ? "0" : "1");
                              run(() => completeReservationSubtask(data), "อัปเดตซับงานแล้ว");
                            }}
                          />
                          <span>{item.name}</span>
                        </label>
                        <em>
                          {SUBTASK_STATUS_LABEL[item.status]} · {item.assigneeName || "ยังไม่มอบหมาย"}
                          {item.comments ? ` · ${item.comments}` : ""}
                        </em>
                      </li>
                    ))}
                  </ul>
                  {selected.subtasks.length < MAX_RESERVATION_SUBTASKS ? (
                    <div className="crm-ops-subtask-form">
                      <input className="crm-field" value={subtaskName} onChange={(event) => setSubtaskName(event.target.value)} placeholder="ชื่อซับงาน" />
                      <input className="crm-field" type="datetime-local" value={subtaskDue} onChange={(event) => setSubtaskDue(event.target.value)} />
                      <select className="crm-select" value={subtaskAssignee} onChange={(event) => setSubtaskAssignee(event.target.value)}>
                        <option value="">ผู้รับงาน</option>
                        {staff.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <select className="crm-select" value={subtaskPriority} onChange={(event) => setSubtaskPriority(event.target.value as ReservationOpPriority)}>
                        {RESERVATION_OP_PRIORITIES.map((item) => (
                          <option key={item} value={item}>
                            {PRIORITY_LABEL[item]}
                          </option>
                        ))}
                      </select>
                      <button
                        className="kpi-button"
                        type="button"
                        disabled={pending || !subtaskName.trim()}
                        onClick={() => {
                          const data = new FormData();
                          data.set("operationId", selected.id);
                          data.set("name", subtaskName);
                          data.set("dueAt", subtaskDue);
                          data.set("assigneeId", subtaskAssignee);
                          data.set("priority", subtaskPriority);
                          data.set("status", RESERVATION_SUBTASK_STATUSES[0]);
                          run(async () => {
                            const result = await addReservationSubtask(data);
                            if (result.ok) {
                              setSubtaskName("");
                              setSubtaskDue("");
                            }
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
                    {selected.comments.map((item) => (
                      <li key={item.id}>
                        <strong>{item.authorName}</strong>
                        <span>{formatOpDate(item.createdAt)}</span>
                        <p>{item.body}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="crm-ops-comment-form">
                    <textarea className="crm-area" rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="เพิ่มความคิดเห็น" />
                    <button
                      className="kpi-button"
                      type="button"
                      disabled={pending || !comment.trim()}
                      onClick={() => {
                        const data = new FormData();
                        data.set("operationId", selected.id);
                        data.set("body", comment);
                        run(async () => {
                          const result = await addReservationOpComment(data);
                          if (result.ok) setComment("");
                          return result;
                        }, "บันทึกความคิดเห็นแล้ว");
                      }}
                    >
                      เพิ่มความคิดเห็น
                    </button>
                  </div>
                </section>

                <section>
                  <h3>ไฟล์แนบ</h3>
                  <ul className="crm-ops-files">
                    {selected.attachments.map((item) => (
                      <li key={item.id}>
                        <a href={item.href}>{item.filename}</a>
                        <span>{formatOpDate(item.createdAt)}</span>
                      </li>
                    ))}
                  </ul>
                  <form
                    className="crm-ops-file-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const data = new FormData(event.currentTarget);
                      data.set("operationId", selected.id);
                      run(() => attachReservationOpImage(data), "แนบรูปแล้ว");
                      event.currentTarget.reset();
                    }}
                  >
                    <input className="crm-field" type="file" name="file" accept=".jpg,.jpeg,.png,.webp" />
                    <button className="crm-users-secondary" type="submit" disabled={pending}>
                      แนบรูป
                    </button>
                  </form>
                </section>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      {dialog ? (
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" onClick={() => setDialog(null)} />
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby="ops-dialog-title">
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">Reservation Operations</p>
                <h2 id="ops-dialog-title">
                  {dialog === "reveal" ? "แสดงข้อมูลแขก" : dialog === "close" ? "ปิดงาน" : "ส่งต่องาน"}
                </h2>
              </div>
              <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={() => setDialog(null)}>
                ×
              </button>
            </div>
            <p className="crm-users-alert is-warn" role="status">
              {dialog === "reveal"
                ? "ข้อมูลแขกจะแสดงในหน้านี้เท่านั้น และยังไม่ถูกเผยแพร่สู่หน้าสาธารณะ"
                : dialog === "close"
                  ? "งานจะย้ายเป็น Closed และออกจากคิวที่ยังเปิดอยู่"
                  : "งานจะย้ายเป็น Escalated เพื่อให้โรงแรมหรือผู้มีสิทธิ์ตัดสินใจต่อ"}
            </p>
            <div className="crm-modal-actions">
              <button type="button" className="crm-users-secondary" onClick={() => setDialog(null)}>
                ยกเลิก
              </button>
              <button
                type="button"
                className="kpi-button"
                onClick={() => {
                  if (dialog === "reveal" && selected) {
                    setRevealed(true);
                    setDraft(draftFrom(selected, true));
                    setDialog(null);
                    return;
                  }
                  if (!selectedId) return;
                  const data = new FormData();
                  data.set("id", selectedId);
                  const action = dialog === "close" ? closeReservationOperation : escalateReservationOperation;
                  setDialog(null);
                  run(() => action(data), dialog === "close" ? "ปิดงานแล้ว" : "ส่งต่องานแล้ว");
                }}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
