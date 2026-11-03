"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { Field, SaveBar, toDateTimeInput } from "@/components/b2b-ops/ui";
import { saveSolutionsInquiryNote } from "@/lib/solutions-ops/actions";
import {
  SOL_CONSENT_LABEL,
  SOL_CONSENT_STATUSES,
  SOL_CONTACT_PREFERENCES,
  SOL_CONTACT_PREFERENCE_LABEL,
  SOL_INQUIRY_STATUSES,
  SOL_INQUIRY_GATED_STATUSES,
  SOL_INQUIRY_STATUS_LABEL,
  blockedByGateMessage,
  hasContactPattern,
  hasSensitiveText,
  type SolAccessView,
  type SolConsentStatus,
  type SolContactPreference,
  type SolDepartmentOption,
  type SolInquiryRow,
  type SolInquiryStatus,
} from "@/lib/solutions-ops/types";
import { formatDate, formatDateTime } from "./format";
import { SolProgressBadge, SolutionsOpsSubtasksPanel } from "./SolutionsOpsSubtasksPanel";
import { useSolRun } from "./useSolRun";
import "./solutions-ops.css";

type Staff = { id: string; name: string };

function InquiryEditor({ row, staff, access, departments }: { row: SolInquiryRow; staff: Staff[]; access: SolAccessView; departments: SolDepartmentOption[] }) {
  const { pending, error, ok, setError, setOk, run } = useSolRun();
  const [form, setForm] = useState({
    needCategory: row.needCategory,
    selectedServices: row.selectedServices,
    contactPreference: row.contactPreference as SolContactPreference,
    ownerId: row.ownerId,
    status: row.status as SolInquiryStatus,
    nextActionAt: row.nextActionAt,
    consentStatus: row.consentStatus as SolConsentStatus,
    notes: row.notes,
  });
  const [dirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(false);

  function patch(next: Partial<typeof form>) {
    setDirty(true);
    setForm({ ...form, ...next });
  }

  const closeBlocked = row.progress.blockedByGate && SOL_INQUIRY_GATED_STATUSES.includes(form.status) && form.status !== row.status;
  const validation = hasSensitiveText(form.needCategory, form.selectedServices, form.notes)
    ? "พบข้อความที่เหมือนรหัสผ่าน/ข้อมูลแขก/เลขบัตร — ห้ามบันทึก"
    : hasContactPattern(form.needCategory, form.selectedServices, form.notes)
      ? "ห้ามพิมพ์อีเมลหรือเบอร์โทรในช่องบันทึก"
      : closeBlocked
        ? blockedByGateMessage(row.progress.gateReasons)
        : "";

  return (
    <div className="b2b-expand">
      <fieldset className="sol-fieldset" disabled={!access.canEdit || pending}>
        <legend>บันทึกภายใน (overlay) — ไม่แก้ข้อมูล Lead ต้นทาง</legend>
        <div className="sol-form-grid">
          <Field label="หมวดที่สนใจ / Need category">
            <input className="crm-field" value={form.needCategory} onChange={(event) => patch({ needCategory: event.target.value })} />
          </Field>
          <Field label="บริการที่เลือก / Selected services">
            <input className="crm-field" value={form.selectedServices} onChange={(event) => patch({ selectedServices: event.target.value })} />
          </Field>
          <Field label="ช่องทางที่ต้องการ / Contact preference">
            <select className="crm-field" value={form.contactPreference} onChange={(event) => patch({ contactPreference: event.target.value as SolContactPreference })}>
              {SOL_CONTACT_PREFERENCES.map((item) => (
                <option key={item || "none"} value={item}>
                  {SOL_CONTACT_PREFERENCE_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ผู้รับผิดชอบ / Owner">
            <select className="crm-field" value={form.ownerId} onChange={(event) => patch({ ownerId: event.target.value })}>
              <option value="">— ยังไม่มอบหมาย —</option>
              {staff.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="สถานะ / Status">
            <select className="crm-field" value={form.status} onChange={(event) => patch({ status: event.target.value as SolInquiryStatus })}>
              {SOL_INQUIRY_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {SOL_INQUIRY_STATUS_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ติดตามครั้งถัดไป / Next action">
            <input className="crm-field" type="datetime-local" value={toDateTimeInput(form.nextActionAt)} onChange={(event) => patch({ nextActionAt: event.target.value })} />
          </Field>
          <Field label="ความยินยอม / Consent">
            <select className="crm-field" value={form.consentStatus} onChange={(event) => patch({ consentStatus: event.target.value as SolConsentStatus })}>
              {SOL_CONSENT_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {SOL_CONSENT_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <div className="sol-span-2">
            <Field label="บันทึก / Notes" hint="ห้ามใส่ข้อมูลแขก รหัสผ่าน อีเมล หรือเบอร์โทร">
              <textarea className="crm-field" rows={3} value={form.notes} onChange={(event) => patch({ notes: event.target.value })} />
            </Field>
          </div>
        </div>
      </fieldset>
      {access.canEdit ? (
        <SaveBar
          pending={pending}
          ok={ok}
          error={touched && validation ? validation : error}
          dirty={dirty}
          idle={dirty ? "มีการแก้ไขที่ยังไม่บันทึก" : "พร้อมบันทึก"}
          onSave={() => {
            setTouched(true);
            setOk("");
            if (validation) {
              setError("");
              return;
            }
            const data = new FormData();
            data.set("leadId", row.leadId);
            Object.entries(form).forEach(([key, value]) => data.set(key, value));
            run(
              () => saveSolutionsInquiryNote(data),
              "บันทึกแล้ว / Saved",
              () => {
                setDirty(false);
                setTouched(false);
              },
            );
          }}
        />
      ) : (
        <p className="b2b-muted">ดูอย่างเดียว — ต้องได้รับสิทธิ์แผนกจึงจะบันทึกได้</p>
      )}
      <SolutionsOpsSubtasksPanel
        parentType="inquiry"
        parentId={row.leadId}
        parentDepartment={null}
        subtasks={row.subtasks}
        progress={row.progress}
        staff={staff}
        departments={departments}
        access={access}
      />
    </div>
  );
}

export function SolutionsOpsInquiryQueue({
  items,
  available,
  staff,
  access,
  departments,
}: {
  items: SolInquiryRow[];
  available: boolean;
  staff: Staff[];
  access: SolAccessView;
  departments: SolDepartmentOption[];
}) {
  const [expanded, setExpanded] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [gateOnly, setGateOnly] = useState(false);
  const visible = items.filter(
    (item) =>
      (!statusFilter || item.status === statusFilter) &&
      (!ownerFilter || item.ownerId === ownerFilter || item.subtasks.some((task) => task.ownerId === ownerFilter)) &&
      (!gateOnly || item.progress.blockedByGate),
  );

  return (
    <div className="b2b-page sol-ops">
      {!access.canSeeContacts ? (
        <p className="sol-note">ชื่อผู้ติดต่อ อีเมล เบอร์โทร และข้อความจากแบบฟอร์มถูกซ่อน — ต้องได้รับสิทธิ์ “ดูข้อมูลติดต่อ” จากผู้จัดการใน Settings</p>
      ) : (
        <p className="sol-note">คุณมีสิทธิ์ดูข้อมูลติดต่อ — ใช้เพื่อการติดต่อกลับเท่านั้น และห้ามคัดลอกลงบันทึกหรือหน้าสาธารณะ</p>
      )}

      {!available ? (
        <p className="crm-pipe-table-empty" role="status">
          ยังเชื่อมต่อคิว Lead ไม่ได้ในขณะนี้ — คิวนี้จะเชื่อมต่ออัตโนมัติเมื่อมี Lead จากหน้า Solutions ในระบบ (ไม่กระทบส่วนอื่นของไดเรกทอรี)
        </p>
      ) : (
        <>
          <div className="b2b-toolbar">
            <label className="b2b-inline">
              <span>กรองสถานะ</span>
              <select className="crm-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="กรองสถานะคำขอ">
                <option value="">ทั้งหมด ({items.length})</option>
                {SOL_INQUIRY_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {SOL_INQUIRY_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </label>
            <label className="b2b-inline">
              <span>ผู้รับผิดชอบ</span>
              <select className="crm-select" value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)} aria-label="กรองผู้รับผิดชอบ">
                <option value="">ทั้งหมด</option>
                {staff.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="b2b-inline">
              <input type="checkbox" checked={gateOnly} onChange={(event) => setGateOnly(event.target.checked)} /> <span>เฉพาะที่ติดเกต (blocked)</span>
            </label>
          </div>
          <div className="crm-pipe-table-wrap b2b-table-wrap">
            {visible.length === 0 ? (
              <p className="crm-pipe-table-empty" role="status">
                {items.length === 0
                  ? "ยังไม่มี Lead ที่มาจากหน้า /solutions หรือฟอร์ม hotel_performance_audit — คิวนี้จะเชื่อมต่อเมื่อมี Lead เข้ามา"
                  : "ไม่มีคำขอในสถานะนี้"}
              </p>
            ) : (
              <table className="crm-pipe-table b2b-table" aria-label="คิวคำขอ Solutions">
                <thead>
                  <tr>
                    <th scope="col">ผู้ติดต่อ</th>
                    <th scope="col">บริษัท / โรงแรม</th>
                    <th scope="col">ที่มา</th>
                    <th scope="col">สถานะ</th>
                    <th scope="col">งานย่อย</th>
                    <th scope="col">ผู้รับผิดชอบ</th>
                    <th scope="col">ติดตามถัดไป</th>
                    <th scope="col">รับเมื่อ</th>
                    <th scope="col">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <Fragment key={row.leadId}>
                      <tr>
                        <td data-label="ผู้ติดต่อ">
                          {row.contactHidden ? <span className="b2b-muted">ซ่อน (ไม่มีสิทธิ์)</span> : row.contactName || "—"}
                          {!row.contactHidden && (row.email || row.phone) ? <small>{[row.email, row.phone].filter(Boolean).join(" · ")}</small> : null}
                        </td>
                        <td data-label="บริษัท / โรงแรม">{row.company || "—"}</td>
                        <td data-label="ที่มา">
                          {row.formName || row.source || "—"}
                          <small>{row.pageUrl}</small>
                        </td>
                        <td data-label="สถานะ">
                          <span className={`b2b-status is-${row.status}`}>{SOL_INQUIRY_STATUS_LABEL[row.status]}</span>
                        </td>
                        <td data-label="งานย่อย">
                          <SolProgressBadge progress={row.progress} />
                        </td>
                        <td data-label="ผู้รับผิดชอบ">{row.ownerName || "—"}</td>
                        <td data-label="ติดตามถัดไป">{formatDateTime(row.nextActionAt) || "—"}</td>
                        <td data-label="รับเมื่อ">{formatDate(row.receivedAt)}</td>
                        <td data-label="การดำเนินการ">
                          <div className="b2b-row-actions">
                            <button
                              type="button"
                              className="crm-users-secondary"
                              aria-expanded={expanded === row.leadId}
                              onClick={() => setExpanded(expanded === row.leadId ? "" : row.leadId)}
                            >
                              {expanded === row.leadId ? "ซ่อน" : access.canEdit ? "แก้ไข / ติดตาม" : "ดู"}
                            </button>
                            {access.canSeeContacts ? (
                              <Link className="crm-users-secondary" href={`/crm/leads/${row.leadId}`}>
                                เปิด Lead
                              </Link>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                      {expanded === row.leadId ? (
                        <tr>
                          <td colSpan={9}>
                            {row.message ? (
                              <p className="b2b-muted">
                                <strong>ข้อความจากฟอร์ม:</strong> {row.message}
                              </p>
                            ) : null}
                            <InquiryEditor row={row} staff={staff} access={access} departments={departments} />
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
