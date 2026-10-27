"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  deleteB2bAccess,
  deleteB2bBooking,
  deleteB2bMaterial,
  deleteB2bTerm,
  saveB2bAccess,
  saveB2bBooking,
  saveB2bMaterial,
  saveB2bTerm,
} from "@/lib/b2b-ops/actions";
import { formatB2bDate } from "@/lib/b2b-ops/format";
import {
  B2B_DEPARTMENTS,
  B2B_RATE_STATUSES,
  B2B_STATUSES,
  DEPARTMENT_LABEL,
  PRIORITY_LABEL,
  RATE_STATUS_LABEL,
  STATUS_LABEL,
  TYPE_LABEL,
  b2bErrorMessage,
  type B2bAccessView,
  type B2bDepartment,
  type B2bMaterialView,
  type B2bPartnerListItem,
  type B2bRateStatus,
} from "@/lib/b2b-ops/types";
import { Field, SaveBar } from "./ui";
import "./b2b-ops.css";

type Staff = { id: string; name: string; email?: string };

function Alert({ error, ok }: { error: string; ok: string }) {
  return (
    <>
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
    </>
  );
}

export function B2bDirectory({ items }: { items: B2bPartnerListItem[] }) {
  return (
    <div className="crm-pipe-table-wrap b2b-table-wrap">
      {items.length === 0 ? (
        <p className="crm-pipe-table-empty">ยังไม่มีรายชื่อพาร์ตเนอร์ — สร้างจาก Partner Pipeline</p>
      ) : (
        <table className="crm-pipe-table b2b-table">
          <thead>
            <tr>
              <th>พาร์ตเนอร์</th>
              <th>ประเภท</th>
              <th>ตลาด</th>
              <th>ผู้ติดต่อ</th>
              <th>เจ้าของ</th>
              <th>สถานะ</th>
              <th>โรงแรม</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                <td data-label="พาร์ตเนอร์">{row.name}</td>
                <td data-label="ประเภท">{TYPE_LABEL[row.type]}</td>
                <td data-label="ตลาด">{row.market || "—"}</td>
                <td data-label="ผู้ติดต่อ" className={row.contactMasked ? "b2b-masked" : undefined}>
                  {row.contactPerson || "—"}
                </td>
                <td data-label="เจ้าของ">{row.ownerName}</td>
                <td data-label="สถานะ">
                  <span className={`b2b-status is-${row.status}`}>{STATUS_LABEL[row.status]}</span>
                </td>
                <td data-label="โรงแรม">{row.hotels.join(", ") || "—"}</td>
                <td data-label="เปิด">
                  <Link className="crm-users-secondary" href={`/crm/b2b/partners/${row.id}`}>
                    เปิด
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function B2bRatesPanel({
  items,
  access,
  partners,
}: {
  items: Array<{
    id: string;
    partnerId: string;
    partnerName: string;
    hotelName: string;
    ratePlan: string;
    commissionText: string;
    availability: string;
    channel: string;
    status: B2bRateStatus;
    masked: boolean;
  }>;
  access: B2bAccessView;
  partners: Array<{ id: string; name: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [form, setForm] = useState({
    id: "",
    partnerId: partners[0]?.id ?? "",
    hotelName: "",
    ratePlan: "",
    commissionText: "",
    availability: "",
    channel: "",
    status: "draft" as B2bRateStatus,
    notes: "",
  });

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      setError("");
      setOk("");
      const result = await task();
      if (!result.ok) setError(b2bErrorMessage(result.error));
      else setOk(success);
    });
  }

  return (
    <div className="b2b-page">
      <Alert error={error} ok={ok} />
      <div className="b2b-list">
        {items.length ? (
          items.map((item) => (
            <article key={item.id}>
              <strong>{item.partnerName}</strong>
              <p>{item.hotelName || "ไม่ระบุโรงแรม"} · ช่องทาง {item.channel || "—"}</p>
              <p>
                เรท <span className={item.masked ? "b2b-masked" : undefined}>{item.ratePlan || "—"}</span> · คอมมิชชัน{" "}
                <span className={item.masked ? "b2b-masked" : undefined}>{item.commissionText || "—"}</span>
              </p>
              <span className={`b2b-status is-${item.status === "approved" ? "active" : "negotiation"}`}>{RATE_STATUS_LABEL[item.status]}</span>
              {access.canEditCommercial ? (
                <div className="b2b-row-actions">
                  <button
                    type="button"
                    className="crm-users-secondary"
                    onClick={() =>
                      setForm({
                        id: item.id,
                        partnerId: item.partnerId,
                        hotelName: item.hotelName,
                        ratePlan: item.masked ? "" : item.ratePlan,
                        commissionText: item.masked ? "" : item.commissionText,
                        availability: item.masked ? "" : item.availability,
                        channel: item.channel,
                        status: item.status,
                        notes: "",
                      })
                    }
                  >
                    แก้ไข
                  </button>
                  <button
                    type="button"
                    className="crm-users-secondary"
                    onClick={() => {
                      const data = new FormData();
                      data.set("id", item.id);
                      run(() => deleteB2bTerm(data), "ลบแล้ว");
                    }}
                  >
                    ลบ
                  </button>
                </div>
              ) : null}
            </article>
          ))
        ) : (
          <p className="b2b-muted">ยังไม่มีเรทหรือคอมมิชชันที่บันทึกเอง</p>
        )}
      </div>
      {access.canEditCommercial && partners.length ? (
        <section className="b2b-panel">
          <div className="b2b-form-grid">
            <Field label="พาร์ตเนอร์">
              <select className="crm-select" value={form.partnerId} onChange={(event) => setForm({ ...form, partnerId: event.target.value })}>
                {partners.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="โรงแรม">
              <input className="crm-field" value={form.hotelName} onChange={(event) => setForm({ ...form, hotelName: event.target.value })} />
            </Field>
            <Field label="Rate plan">
              <input className="crm-field" value={form.ratePlan} onChange={(event) => setForm({ ...form, ratePlan: event.target.value })} />
            </Field>
            <Field label="Commission">
              <input className="crm-field" value={form.commissionText} onChange={(event) => setForm({ ...form, commissionText: event.target.value })} />
            </Field>
            <Field label="Availability">
              <input className="crm-field" value={form.availability} onChange={(event) => setForm({ ...form, availability: event.target.value })} />
            </Field>
            <Field label="ช่องทาง">
              <input className="crm-field" value={form.channel} onChange={(event) => setForm({ ...form, channel: event.target.value })} />
            </Field>
            <Field label="สถานะ">
              <select className="crm-select" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as B2bRateStatus })}>
                {B2B_RATE_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {RATE_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <SaveBar
            pending={pending}
            ok={ok}
            error={error}
            onSave={() => {
              const data = new FormData();
              Object.entries(form).forEach(([key, value]) => data.set(key, String(value)));
              run(() => saveB2bTerm(data), "บันทึกเรทแล้ว");
            }}
          />
        </section>
      ) : (
        <p className="b2b-muted">Revenue / Distribution หรือ Management เท่านั้นที่แก้เรทได้{partners.length ? "" : " และต้องมีพาร์ตเนอร์ในระบบก่อน"}</p>
      )}
    </div>
  );
}

export function B2bBookingsPanel({
  items,
  access,
  partners,
}: {
  items: Array<{
    id: string;
    partnerId: string;
    partnerName: string;
    hotelName: string;
    period: string;
    roomNights: string;
    revenueText: string;
    status: string;
    dataStatus: string;
    masked: boolean;
  }>;
  access: B2bAccessView;
  partners: Array<{ id: string; name: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [form, setForm] = useState({
    id: "",
    partnerId: partners[0]?.id ?? "",
    hotelName: "",
    period: "",
    roomNights: "",
    revenueText: "",
    status: "draft",
    dataStatus: "internal",
    notes: "",
  });

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      setError("");
      setOk("");
      const result = await task();
      if (!result.ok) setError(b2bErrorMessage(result.error));
      else setOk(success);
    });
  }

  return (
    <div className="b2b-page">
      <Alert error={error} ok={ok} />
      <div className="b2b-list">
        {items.length ? (
          items.map((item) => (
            <article key={item.id}>
              <strong>{item.partnerName}</strong>
              <p>
                {item.hotelName || "ไม่ระบุโรงแรม"} · {item.period || "ไม่ระบุช่วง"}
              </p>
              <p>
                RN <span className={item.masked ? "b2b-masked" : undefined}>{item.roomNights || "—"}</span> · Revenue{" "}
                <span className={item.masked ? "b2b-masked" : undefined}>{item.revenueText || "—"}</span>
              </p>
              {access.canEditCommercial ? (
                <div className="b2b-row-actions">
                  <button
                    type="button"
                    className="crm-users-secondary"
                    onClick={() =>
                      setForm({
                        id: item.id,
                        partnerId: item.partnerId,
                        hotelName: item.hotelName,
                        period: item.period,
                        roomNights: item.masked ? "" : item.roomNights,
                        revenueText: item.masked ? "" : item.revenueText,
                        status: item.status,
                        dataStatus: item.dataStatus,
                        notes: "",
                      })
                    }
                  >
                    แก้ไข
                  </button>
                  <button
                    type="button"
                    className="crm-users-secondary"
                    onClick={() => {
                      const data = new FormData();
                      data.set("id", item.id);
                      run(() => deleteB2bBooking(data), "ลบแล้ว");
                    }}
                  >
                    ลบ
                  </button>
                </div>
              ) : null}
            </article>
          ))
        ) : (
          <p className="b2b-muted">ยังไม่มีผลจองที่บันทึกเอง</p>
        )}
      </div>
      {access.canEditCommercial && partners.length ? (
        <section className="b2b-panel">
          <div className="b2b-form-grid">
            <Field label="พาร์ตเนอร์">
              <select className="crm-select" value={form.partnerId} onChange={(event) => setForm({ ...form, partnerId: event.target.value })}>
                {partners.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="โรงแรม">
              <input className="crm-field" value={form.hotelName} onChange={(event) => setForm({ ...form, hotelName: event.target.value })} />
            </Field>
            <Field label="ช่วงเวลา">
              <input className="crm-field" value={form.period} onChange={(event) => setForm({ ...form, period: event.target.value })} />
            </Field>
            <Field label="Room nights">
              <input className="crm-field" value={form.roomNights} onChange={(event) => setForm({ ...form, roomNights: event.target.value })} />
            </Field>
            <Field label="Revenue">
              <input className="crm-field" value={form.revenueText} onChange={(event) => setForm({ ...form, revenueText: event.target.value })} />
            </Field>
            <Field label="สถานะ">
              <input className="crm-field" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} />
            </Field>
          </div>
          <SaveBar
            pending={pending}
            ok={ok}
            error={error}
            onSave={() => {
              const data = new FormData();
              Object.entries(form).forEach(([key, value]) => data.set(key, String(value)));
              run(() => saveB2bBooking(data), "บันทึกผลจองแล้ว");
            }}
          />
        </section>
      ) : (
        <p className="b2b-muted">ตัวเลขผลจองถูกปกปิดถ้าไม่มีสิทธิ์เชิงพาณิชย์</p>
      )}
    </div>
  );
}

export function B2bMaterialsPanel({ items, canEdit }: { items: B2bMaterialView[]; canEdit: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [form, setForm] = useState({ id: "", title: "", kind: "kit", status: "draft", notes: "" });

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      setError("");
      setOk("");
      const result = await task();
      if (!result.ok) setError(b2bErrorMessage(result.error));
      else setOk(success);
    });
  }

  return (
    <div className="b2b-page">
      <Alert error={error} ok={ok} />
      <div className="b2b-list">
        {items.length ? (
          items.map((item) => (
            <article key={item.id}>
              <strong>{item.title}</strong>
              <p>
                {item.kind} · {item.status} · {formatB2bDate(item.updatedAt)}
              </p>
              {item.filename ? <a href={`/api/crm/b2b/materials/${item.id}`}>{item.filename}</a> : null}
              {item.notes ? <p>{item.notes}</p> : null}
              {canEdit ? (
                <div className="b2b-row-actions">
                  <button type="button" className="crm-users-secondary" onClick={() => setForm({ id: item.id, title: item.title, kind: item.kind, status: item.status, notes: item.notes })}>
                    แก้ไข
                  </button>
                  <button
                    type="button"
                    className="crm-users-secondary"
                    onClick={() => {
                      const data = new FormData();
                      data.set("id", item.id);
                      run(() => deleteB2bMaterial(data), "ลบแล้ว");
                    }}
                  >
                    ลบ
                  </button>
                </div>
              ) : null}
            </article>
          ))
        ) : (
          <p className="b2b-muted">ยังไม่มี Sales Materials</p>
        )}
      </div>
      {canEdit ? (
        <form
          className="b2b-panel"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            data.set("id", form.id);
            data.set("title", form.title);
            data.set("kind", form.kind);
            data.set("status", form.status);
            data.set("notes", form.notes);
            run(() => saveB2bMaterial(data), "บันทึกสื่อแล้ว");
          }}
        >
          <div className="b2b-form-grid">
            <Field label="ชื่อสื่อ">
              <input className="crm-field" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </Field>
            <Field label="ประเภท">
              <input className="crm-field" value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value })} />
            </Field>
            <Field label="สถานะ">
              <input className="crm-field" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} />
            </Field>
            <Field label="ไฟล์">
              <input className="crm-field" type="file" name="file" />
            </Field>
            <Field label="บันทึกแคมเปญ">
              <textarea className="crm-field" rows={3} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
            </Field>
          </div>
          <div className="crm-cs-savebar b2b-savebar">
            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
              {pending ? "กำลังบันทึก…" : "บันทึก"}
            </button>
            <p className={`crm-cs-save-state${error ? " is-error" : ok ? " is-ok" : ""}`} role="status">
              {pending ? "กำลังบันทึก…" : error ? "บันทึกไม่สำเร็จ" : ok || "พร้อมบันทึก"}
            </p>
          </div>
        </form>
      ) : (
        <p className="b2b-muted">Marketing หรือ Management เท่านั้นที่จัดการ Sales Materials ได้</p>
      )}
    </div>
  );
}

export function B2bReportsView({
  stats,
}: {
  stats: {
    partners: Array<{ status: string; department: string; priority: string }>;
    activities: Array<{ status: string; dueAt: Date | null }>;
    terms: Array<{ status: string }>;
  };
}) {
  const byStatus = B2B_STATUSES.map((status) => ({
    status,
    count: stats.partners.filter((item) => item.status === status).length,
  }));
  const byDept = B2B_DEPARTMENTS.map((department) => ({
    department,
    count: stats.partners.filter((item) => item.department === department).length,
  }));
  const openDue = stats.activities.filter(
    (item) => ["planned", "in_progress", "open"].includes(item.status) && item.dueAt && new Date(item.dueAt).getTime() <= Date.now(),
  ).length;
  const pendingRates = stats.terms.filter((item) => item.status === "pending").length;

  return (
    <div className="b2b-page">
      <div className="b2b-kpis">
        <div className="b2b-kpi">
          <strong>{stats.partners.length}</strong>
          <span>พาร์ตเนอร์ทั้งหมด</span>
        </div>
        <div className="b2b-kpi">
          <strong>{stats.partners.filter((item) => item.status === "active").length}</strong>
          <span>Active Partner</span>
        </div>
        <div className="b2b-kpi">
          <strong>{openDue}</strong>
          <span>กิจกรรมครบกำหนด</span>
        </div>
        <div className="b2b-kpi">
          <strong>{pendingRates}</strong>
          <span>เรทรออนุมัติ</span>
        </div>
      </div>
      <section className="b2b-panel">
        <h2>ตามสถานะ Pipeline</h2>
        <div className="b2b-list">
          {byStatus.map((item) => (
            <article key={item.status}>
              <strong>{STATUS_LABEL[item.status]}</strong>
              <p>{item.count} รายการ</p>
            </article>
          ))}
        </div>
      </section>
      <section className="b2b-panel">
        <h2>ตามแผนก</h2>
        <div className="b2b-list">
          {byDept.map((item) => (
            <article key={item.department}>
              <strong>{DEPARTMENT_LABEL[item.department]}</strong>
              <p>{item.count} รายการ</p>
            </article>
          ))}
        </div>
      </section>
      <section className="b2b-panel">
        <h2>ความสำคัญ</h2>
        <div className="b2b-list">
          {(["urgent", "high", "normal", "low"] as const).map((item) => (
            <article key={item}>
              <strong>{PRIORITY_LABEL[item]}</strong>
              <p>{stats.partners.filter((row) => row.priority === item).length} รายการ</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function B2bSettingsPanel({
  rows,
  staff,
  canManage,
}: {
  rows: Array<{ id: string; userId: string; department: string; canContacts: boolean; canCommercial: boolean }>;
  staff: Staff[];
  canManage: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [form, setForm] = useState({
    userId: staff[0]?.id ?? "",
    department: "sales" as B2bDepartment,
    canContacts: false,
    canCommercial: false,
  });

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      setError("");
      setOk("");
      const result = await task();
      if (!result.ok) setError(b2bErrorMessage(result.error));
      else setOk(success);
    });
  }

  return (
    <div className="b2b-page">
      <Alert error={error} ok={ok} />
      <p className="b2b-muted">
        Superadmin/Admin เห็นทุกแผนกโดยอัตโนมัติ แถวด้านล่างกำหนดแผนกและสิทธิ์ข้อมูลติดต่อ/เรทให้ผู้ใช้โมดูลนี้
      </p>
      <div className="b2b-list">
        {rows.length ? (
          rows.map((row) => (
            <article key={row.id}>
              <strong>{staff.find((item) => item.id === row.userId)?.name || row.userId}</strong>
              <p>
                {DEPARTMENT_LABEL[row.department as B2bDepartment] || row.department} · ผู้ติดต่อ {row.canContacts ? "เปิด" : "ปกปิด"} · เรท{" "}
                {row.canCommercial ? "เปิด" : "ปกปิด"}
              </p>
              {canManage ? (
                <button
                  type="button"
                  className="crm-users-secondary"
                  onClick={() => {
                    const data = new FormData();
                    data.set("id", row.id);
                    run(() => deleteB2bAccess(data), "ลบสิทธิ์แล้ว");
                  }}
                >
                  ลบ
                </button>
              ) : null}
            </article>
          ))
        ) : (
          <p className="b2b-muted">ยังไม่ได้กำหนดแผนกให้ผู้ใช้ — ผู้ใช้โมดูลนี้จะได้สิทธิ์ Sales เริ่มต้นโดยไม่มีข้อมูลติดต่อ/เรท</p>
        )}
      </div>
      {canManage ? (
        <section className="b2b-panel">
          <div className="b2b-form-grid">
            <Field label="ผู้ใช้">
              <select className="crm-select" value={form.userId} onChange={(event) => setForm({ ...form, userId: event.target.value })}>
                {staff.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                    {item.email ? ` (${item.email})` : ""}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="แผนก">
              <select className="crm-select" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value as B2bDepartment })}>
                {B2B_DEPARTMENTS.map((item) => (
                  <option key={item} value={item}>
                    {DEPARTMENT_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <label className="crm-cms-field">
              <span>เห็นข้อมูลติดต่อ</span>
              <input type="checkbox" checked={form.canContacts} onChange={(event) => setForm({ ...form, canContacts: event.target.checked })} />
            </label>
            <label className="crm-cms-field">
              <span>เห็นเรท/สัญญา/คอมมิชชัน</span>
              <input type="checkbox" checked={form.canCommercial} onChange={(event) => setForm({ ...form, canCommercial: event.target.checked })} />
            </label>
          </div>
          <SaveBar
            pending={pending}
            ok={ok}
            error={error}
            onSave={() => {
              const data = new FormData();
              data.set("userId", form.userId);
              data.set("department", form.department);
              data.set("canContacts", form.canContacts ? "1" : "0");
              data.set("canCommercial", form.canCommercial ? "1" : "0");
              run(() => saveB2bAccess(data), "บันทึกสิทธิ์แล้ว");
            }}
          />
        </section>
      ) : (
        <p className="b2b-muted">Management เท่านั้นที่ตั้งค่าสิทธิ์แผนกได้</p>
      )}
    </div>
  );
}
