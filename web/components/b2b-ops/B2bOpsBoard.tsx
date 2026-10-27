"use client";

import Link from "next/link";
import { Fragment, useMemo, useState, useTransition } from "react";
import { changeB2bStatus, deleteB2bPartner, saveB2bPartner } from "@/lib/b2b-ops/actions";
import { formatB2bDate } from "@/lib/b2b-ops/format";
import {
  ACTIVITY_STATUS_LABEL,
  ACTIVITY_TYPE_LABEL,
  B2B_DEPARTMENTS,
  B2B_GROUP_BY,
  B2B_PARTNER_TYPES,
  B2B_PRIORITIES,
  B2B_RATE_STATUSES,
  B2B_SORTS,
  B2B_STATUSES,
  DEPARTMENT_LABEL,
  GROUP_LABEL,
  PRIORITY_LABEL,
  RATE_STATUS_LABEL,
  STATUS_LABEL,
  TYPE_LABEL,
  b2bErrorMessage,
  type B2bAccessView,
  type B2bDepartment,
  type B2bGroupBy,
  type B2bPartnerListItem,
  type B2bPartnerType,
  type B2bPriority,
  type B2bRateStatus,
  type B2bStatus,
} from "@/lib/b2b-ops/types";
import { B2bDialog, Field, SaveBar, toDateInput } from "./ui";
import "./b2b-ops.css";

type Staff = { id: string; name: string };
type Draft = {
  id: string;
  name: string;
  type: B2bPartnerType;
  market: string;
  contactPerson: string;
  contactChannel: string;
  ownerId: string;
  department: B2bDepartment;
  priority: B2bPriority;
  status: B2bStatus;
  nextAction: string;
  nextActionAt: string;
  lastContactAt: string;
  notes: string;
  hotels: string;
  rateApproval: B2bRateStatus;
};

function emptyDraft(ownerId = ""): Draft {
  return {
    id: "",
    name: "",
    type: "travel_agent",
    market: "",
    contactPerson: "",
    contactChannel: "",
    ownerId,
    department: "sales",
    priority: "normal",
    status: "new_lead",
    nextAction: "",
    nextActionAt: "",
    lastContactAt: "",
    notes: "",
    hotels: "",
    rateApproval: "draft",
  };
}

function draftFrom(row: B2bPartnerListItem): Draft {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    market: row.market,
    contactPerson: row.contactMasked ? "" : row.contactPerson,
    contactChannel: row.contactMasked ? "" : row.contactChannel,
    ownerId: row.ownerId,
    department: row.department,
    priority: row.priority,
    status: row.status,
    nextAction: row.nextAction,
    nextActionAt: toDateInput(row.nextActionAt),
    lastContactAt: toDateInput(row.lastContactAt),
    notes: row.notes,
    hotels: row.hotels.join("\n"),
    rateApproval: row.rateApproval,
  };
}

function groupKey(row: B2bPartnerListItem, groupBy: B2bGroupBy) {
  if (groupBy === "owner") return row.ownerId || "none";
  if (groupBy === "department") return row.department;
  if (groupBy === "market") return row.market.trim() || "none";
  if (groupBy === "hotel") return row.hotels[0] || "none";
  return row.status;
}

function groupLabel(key: string, groupBy: B2bGroupBy, staff: Staff[]) {
  if (groupBy === "status") return STATUS_LABEL[key as B2bStatus] || key;
  if (groupBy === "department") return DEPARTMENT_LABEL[key as B2bDepartment] || key;
  if (groupBy === "owner") return staff.find((item) => item.id === key)?.name || "ยังไม่มอบหมาย";
  if (key === "none") return groupBy === "hotel" ? "ไม่ระบุโรงแรม" : "ไม่ระบุตลาด";
  return key;
}

export function B2bOpsBoard({
  items,
  staff,
  access,
  facets,
  filters,
}: {
  items: B2bPartnerListItem[];
  staff: Staff[];
  access: B2bAccessView;
  facets: { markets: string[]; hotels: string[] };
  filters: {
    q?: string;
    status?: string;
    ownerId?: string;
    department?: string;
    market?: string;
    hotel?: string;
    sort?: string;
    group?: string;
    view?: string;
  };
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft(access.userId));
  const [expandedId, setExpandedId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const view = filters.view === "table" ? "table" : "board";
  const groupBy: B2bGroupBy = (filters.group as B2bGroupBy) || "status";

  const groups = useMemo(() => {
    const order =
      groupBy === "status"
        ? [...B2B_STATUSES]
        : groupBy === "department"
          ? [...B2B_DEPARTMENTS]
          : groupBy === "hotel"
            ? Array.from(new Set(items.flatMap((item) => (item.hotels.length ? item.hotels : ["none"]))))
            : Array.from(new Set(items.map((item) => groupKey(item, groupBy))));
    const keys = order.length ? order : ["none"];
    return keys.map((key) => ({
      key,
      label: groupLabel(key, groupBy, staff),
      items:
        groupBy === "hotel"
          ? items.filter((item) => (key === "none" ? item.hotels.length === 0 : item.hotels.includes(key)))
          : items.filter((item) => groupKey(item, groupBy) === key),
    }));
  }, [groupBy, items, staff]);

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      setError("");
      setOk("");
      const result = await task();
      if (!result.ok) {
        setError(b2bErrorMessage(result.error));
        return;
      }
      setOk(success);
      if (!draft.id && result.id) setDraft((current) => ({ ...current, id: result.id }));
    });
  }

  function saveDraft() {
    const data = new FormData();
    Object.entries(draft).forEach(([key, value]) => data.set(key, value));
    run(() => saveB2bPartner(data), draft.id ? "บันทึกแล้ว" : "สร้างพาร์ตเนอร์แล้ว");
  }

  function openCreate() {
    setDraft(emptyDraft(access.userId));
    setDrawer(true);
    setOk("");
    setError("");
  }

  function openEdit(row: B2bPartnerListItem) {
    setDraft(draftFrom(row));
    setDrawer(true);
    setOk("");
    setError("");
  }

  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });

  function hrefFor(next: Record<string, string>) {
    const params = new URLSearchParams(query);
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    const text = params.toString();
    return text ? `/crm/b2b?${text}` : "/crm/b2b";
  }

  const card = (row: B2bPartnerListItem) => (
    <article className="b2b-card" key={row.id}>
      <button type="button" className="b2b-name" onClick={() => openEdit(row)}>
        {row.name}
      </button>
      <p>
        {TYPE_LABEL[row.type]} · {row.market || "ไม่ระบุตลาด"}
      </p>
      <div className="b2b-meta">
        <span className={`b2b-status is-${row.status}`}>{STATUS_LABEL[row.status]}</span>
        <span className={`b2b-status b2b-priority is-${row.priority}`}>{PRIORITY_LABEL[row.priority]}</span>
      </div>
      <p>เจ้าของ: {row.ownerName}</p>
      <p>โรงแรม: {row.hotels.join(", ") || "—"}</p>
      <p>
        Next: {row.nextAction || "—"} {row.nextActionAt ? `· ${formatB2bDate(row.nextActionAt)}` : ""}
      </p>
      {row.contactPerson ? (
        <p className={row.contactMasked ? "b2b-masked" : undefined}>ผู้ติดต่อ: {row.contactPerson}</p>
      ) : null}
      {access.canEditPipeline ? (
        <form
          className="b2b-inline"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            run(() => changeB2bStatus(data), "เปลี่ยนสถานะแล้ว");
          }}
        >
          <input type="hidden" name="id" value={row.id} />
          <select className="crm-select" name="status" defaultValue={row.status} aria-label={`สถานะ ${row.name}`}>
            {B2B_STATUSES.map((item) => (
              <option key={item} value={item}>
                {STATUS_LABEL[item]}
              </option>
            ))}
          </select>
          <button className="kpi-button b2b-save" type="submit" disabled={pending}>
            บันทึก
          </button>
        </form>
      ) : null}
      <div className="b2b-card-actions">
        <button type="button" className="crm-users-secondary" onClick={() => setExpandedId(expandedId === row.id ? "" : row.id)}>
          {expandedId === row.id ? "ซ่อนกิจกรรม" : `กิจกรรม (${row.activityCount})`}
        </button>
        <Link className="crm-users-secondary" href={`/crm/b2b/partners/${row.id}`}>
          รายละเอียด
        </Link>
        {access.canEditPipeline ? (
          <>
            <button type="button" className="crm-users-secondary" onClick={() => openEdit(row)}>
              แก้ไข
            </button>
            <button type="button" className="crm-users-secondary" onClick={() => setDeleteId(row.id)}>
              ลบ
            </button>
          </>
        ) : null}
      </div>
      {expandedId === row.id ? (
        <div className="b2b-expand">
          {row.recentActivities.length ? (
            <ul>
              {row.recentActivities.map((item) => (
                <li key={item.id}>
                  {formatB2bDate(item.createdAt)} · {ACTIVITY_TYPE_LABEL[item.type]} · {item.title} · {ACTIVITY_STATUS_LABEL[item.status]}
                  {item.progress.total ? <span className="b2b-chip">{item.progress.countLabel}</span> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="b2b-muted">ยังไม่มีประวัติกิจกรรม</p>
          )}
        </div>
      ) : null}
    </article>
  );

  return (
    <div className="b2b-page">
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

      <div className="b2b-toolbar">
        <div className="b2b-tabs" role="tablist" aria-label="มุมมองบอร์ด">
          <Link className={`b2b-tab${view === "board" ? " is-active" : ""}`} href={hrefFor({ view: "board" })}>
            Board
          </Link>
          <Link className={`b2b-tab${view === "table" ? " is-active" : ""}`} href={hrefFor({ view: "table" })}>
            Table
          </Link>
        </div>
        <form className="b2b-filters" method="get">
          <input type="hidden" name="view" value={view} />
          <input className="crm-field" name="q" defaultValue={filters.q ?? ""} placeholder="ค้นหาพาร์ตเนอร์ ตลาด หรือโรงแรม" />
          <select className="crm-select" name="status" defaultValue={filters.status ?? ""}>
            <option value="">ทุกสถานะ</option>
            {B2B_STATUSES.map((item) => (
              <option key={item} value={item}>
                {STATUS_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="ownerId" defaultValue={filters.ownerId ?? ""}>
            <option value="">ทุกเจ้าของ</option>
            {staff.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select className="crm-select" name="department" defaultValue={filters.department ?? ""}>
            <option value="">ทุกแผนก</option>
            {B2B_DEPARTMENTS.map((item) => (
              <option key={item} value={item}>
                {DEPARTMENT_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="market" defaultValue={filters.market ?? ""}>
            <option value="">ทุกตลาด</option>
            {facets.markets.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="crm-select" name="hotel" defaultValue={filters.hotel ?? ""}>
            <option value="">ทุกโรงแรม</option>
            {facets.hotels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="crm-select" name="group" defaultValue={groupBy}>
            {B2B_GROUP_BY.map((item) => (
              <option key={item} value={item}>
                จัดกลุ่ม: {GROUP_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="sort" defaultValue={filters.sort ?? "nextActionAt"}>
            {B2B_SORTS.map((item) => (
              <option key={item} value={item}>
                {item === "nextActionAt" ? "เรียงตามวันนัดถัดไป" : item === "priority" ? "เรียงตามความสำคัญ" : item === "name" ? "เรียงตามชื่อ" : "เรียงตามอัปเดตล่าสุด"}
              </option>
            ))}
          </select>
          <button className="crm-users-secondary" type="submit">
            กรอง
          </button>
          {access.canEditPipeline ? (
            <button className="kpi-button b2b-save" type="button" onClick={openCreate}>
              เพิ่มพาร์ตเนอร์
            </button>
          ) : null}
        </form>
      </div>

      {view === "board" ? (
        <div className="b2b-board is-columns">
          {groups.map((group) => (
            <section className="b2b-group" key={group.key}>
              <header className="b2b-group-head">
                <strong>{group.label}</strong>
                <span>{group.items.length}</span>
              </header>
              <div className="b2b-group-body">
                {group.items.length ? group.items.map(card) : <p className="b2b-muted">ยังไม่มีรายการ</p>}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="crm-pipe-table-wrap b2b-table-wrap">
          {items.length === 0 ? (
            <p className="crm-pipe-table-empty">ยังไม่มีพาร์ตเนอร์ใน Pipeline — สร้างรายการด้วยปุ่มเพิ่มพาร์ตเนอร์</p>
          ) : (
            groups.map((group) => (
              <section className="b2b-group" key={group.key} style={{ marginBottom: "0.9rem" }}>
                <header className="b2b-group-head">
                  <strong>{group.label}</strong>
                  <span>{group.items.length}</span>
                </header>
                <div className="crm-pipe-table-wrap">
                  <table className="crm-pipe-table b2b-table">
                    <thead>
                      <tr>
                        <th>พาร์ตเนอร์</th>
                        <th>ประเภท</th>
                        <th>ตลาด</th>
                        <th>ผู้ติดต่อ</th>
                        <th>เจ้าของ</th>
                        <th>แผนก</th>
                        <th>ความสำคัญ</th>
                        <th>สถานะ</th>
                        <th>นัดถัดไป</th>
                        <th>โรงแรม</th>
                        <th>การดำเนินการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((row) => (
                        <Fragment key={row.id}>
                          <tr>
                            <td data-label="พาร์ตเนอร์">
                              <button type="button" className="b2b-name" onClick={() => openEdit(row)}>
                                {row.name}
                              </button>
                            </td>
                            <td data-label="ประเภท">{TYPE_LABEL[row.type]}</td>
                            <td data-label="ตลาด">{row.market || "—"}</td>
                            <td data-label="ผู้ติดต่อ" className={row.contactMasked ? "b2b-masked" : undefined}>
                              {row.contactPerson || "—"}
                              {row.contactChannel ? <small>{row.contactChannel}</small> : null}
                            </td>
                            <td data-label="เจ้าของ">{row.ownerName}</td>
                            <td data-label="แผนก">{DEPARTMENT_LABEL[row.department]}</td>
                            <td data-label="ความสำคัญ">
                              <span className={`b2b-status b2b-priority is-${row.priority}`}>{PRIORITY_LABEL[row.priority]}</span>
                            </td>
                            <td data-label="สถานะ">
                              {access.canEditPipeline ? (
                                <form
                                  className="b2b-inline"
                                  onSubmit={(event) => {
                                    event.preventDefault();
                                    const data = new FormData(event.currentTarget);
                                    run(() => changeB2bStatus(data), "เปลี่ยนสถานะแล้ว");
                                  }}
                                >
                                  <input type="hidden" name="id" value={row.id} />
                                  <select className="crm-select" name="status" defaultValue={row.status} aria-label={`สถานะ ${row.name}`}>
                                    {B2B_STATUSES.map((item) => (
                                      <option key={item} value={item}>
                                        {STATUS_LABEL[item]}
                                      </option>
                                    ))}
                                  </select>
                                  <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                                    บันทึก
                                  </button>
                                </form>
                              ) : (
                                <span className={`b2b-status is-${row.status}`}>{STATUS_LABEL[row.status]}</span>
                              )}
                            </td>
                            <td data-label="นัดถัดไป">
                              {row.nextAction || "—"}
                              <small>{formatB2bDate(row.nextActionAt)}</small>
                            </td>
                            <td data-label="โรงแรม">{row.hotels.join(", ") || "—"}</td>
                            <td data-label="การดำเนินการ">
                              <div className="b2b-row-actions">
                                <button type="button" className="crm-users-secondary" onClick={() => setExpandedId(expandedId === row.id ? "" : row.id)}>
                                  กิจกรรม
                                </button>
                                <Link className="crm-users-secondary" href={`/crm/b2b/partners/${row.id}`}>
                                  เปิด
                                </Link>
                                {access.canEditPipeline ? (
                                  <button type="button" className="crm-users-secondary" onClick={() => setDeleteId(row.id)}>
                                    ลบ
                                  </button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                          {expandedId === row.id ? (
                            <tr className="crm-ops-subrow">
                              <td colSpan={11}>
                                {row.recentActivities.length ? (
                                  <ul className="b2b-expand">
                                    {row.recentActivities.map((item) => (
                                      <li key={item.id}>
                                        {formatB2bDate(item.createdAt)} · {ACTIVITY_TYPE_LABEL[item.type]} · {item.title} · {ACTIVITY_STATUS_LABEL[item.status]}
                                        {item.progress.total ? <span className="b2b-chip">{item.progress.countLabel}</span> : null}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="b2b-muted">ยังไม่มีประวัติกิจกรรม</p>
                                )}
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))
          )}
        </div>
      )}

      {drawer ? (
        <div className="b2b-drawer">
          <button type="button" className="b2b-drawer-backdrop" aria-label="ปิดฟอร์ม" onClick={() => setDrawer(false)} />
          <div className="b2b-drawer-panel">
            <h2>{draft.id ? "แก้ไขพาร์ตเนอร์" : "เพิ่มพาร์ตเนอร์"}</h2>
            <div className="b2b-form-grid">
              <Field label="ชื่อพาร์ตเนอร์">
                <input className="crm-field" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
              </Field>
              <Field label="ประเภท">
                <select className="crm-select" value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as B2bPartnerType })}>
                  {B2B_PARTNER_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {TYPE_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="ตลาด / เซ็กเมนต์">
                <input className="crm-field" value={draft.market} onChange={(event) => setDraft({ ...draft, market: event.target.value })} />
              </Field>
              {access.canContacts ? (
                <>
                  <Field label="ผู้ติดต่อ">
                    <input className="crm-field" value={draft.contactPerson} onChange={(event) => setDraft({ ...draft, contactPerson: event.target.value })} />
                  </Field>
                  <Field label="ช่องทางติดต่อ">
                    <input className="crm-field" value={draft.contactChannel} onChange={(event) => setDraft({ ...draft, contactChannel: event.target.value })} />
                  </Field>
                </>
              ) : (
                <p className="b2b-muted is-wide">ข้อมูลผู้ติดต่อถูกปกปิดตามสิทธิ์บัญชีนี้</p>
              )}
              <Field label="ผู้รับผิดชอบ">
                <select className="crm-select" value={draft.ownerId} onChange={(event) => setDraft({ ...draft, ownerId: event.target.value })}>
                  <option value="">ยังไม่มอบหมาย</option>
                  {staff.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="แผนก">
                <select className="crm-select" value={draft.department} onChange={(event) => setDraft({ ...draft, department: event.target.value as B2bDepartment })}>
                  {B2B_DEPARTMENTS.map((item) => (
                    <option key={item} value={item}>
                      {DEPARTMENT_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="ความสำคัญ">
                <select className="crm-select" value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as B2bPriority })}>
                  {B2B_PRIORITIES.map((item) => (
                    <option key={item} value={item}>
                      {PRIORITY_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="สถานะ">
                <select className="crm-select" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as B2bStatus })}>
                  {B2B_STATUSES.map((item) => (
                    <option key={item} value={item}>
                      {STATUS_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Next action">
                <input className="crm-field" value={draft.nextAction} onChange={(event) => setDraft({ ...draft, nextAction: event.target.value })} />
              </Field>
              <Field label="วันนัดถัดไป">
                <input className="crm-field" type="date" value={draft.nextActionAt} onChange={(event) => setDraft({ ...draft, nextActionAt: event.target.value })} />
              </Field>
              <Field label="ติดต่อล่าสุด">
                <input className="crm-field" type="date" value={draft.lastContactAt} onChange={(event) => setDraft({ ...draft, lastContactAt: event.target.value })} />
              </Field>
              {access.canEditCommercial ? (
                <Field label="สถานะอนุมัติเรท/คอมมิชชัน">
                  <select className="crm-select" value={draft.rateApproval} onChange={(event) => setDraft({ ...draft, rateApproval: event.target.value as B2bRateStatus })}>
                    {B2B_RATE_STATUSES.map((item) => (
                      <option key={item} value={item}>
                        {RATE_STATUS_LABEL[item]}
                      </option>
                    ))}
                  </select>
                </Field>
              ) : (
                <p className="b2b-muted is-wide">สถานะเรท/คอมมิชชันถูกปกปิดตามสิทธิ์บัญชีนี้</p>
              )}
              <Field label="โรงแรมที่เกี่ยวข้อง" hint="บรรทัดละหนึ่งโรงแรม">
                <textarea className="crm-field" rows={3} value={draft.hotels} onChange={(event) => setDraft({ ...draft, hotels: event.target.value })} />
              </Field>
              <Field label="บันทึก">
                <textarea className="crm-field" rows={4} value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} />
              </Field>
            </div>
            {access.canEditPipeline ? <SaveBar pending={pending} ok={ok} error={error} onSave={saveDraft} /> : <p className="b2b-muted">บัญชีนี้ดูได้อย่างเดียว</p>}
            {draft.id ? (
              <Link href={`/crm/b2b/partners/${draft.id}`}>เปิดฟอร์มรายละเอียดครบทุกแท็บ</Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {deleteId ? (
        <B2bDialog
          title="ลบพาร์ตเนอร์"
          body="รายการนี้และกิจกรรมที่เกี่ยวข้องจะถูกลบจากบอร์ดภายใน ไม่สามารถย้อนกลับจากหน้านี้ได้"
          confirmLabel="ลบรายการ"
          pending={pending}
          onCancel={() => setDeleteId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", deleteId);
            run(() => deleteB2bPartner(data), "ลบแล้ว");
            setDeleteId("");
          }}
        />
      ) : null}
    </div>
  );
}
