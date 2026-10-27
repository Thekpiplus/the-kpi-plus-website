"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  attachB2bFile,
  deleteB2bBooking,
  deleteB2bContact,
  deleteB2bFile,
  deleteB2bPartner,
  deleteB2bTerm,
  saveB2bBooking,
  saveB2bContact,
  saveB2bNote,
  saveB2bPartner,
  saveB2bTerm,
} from "@/lib/b2b-ops/actions";
import { formatB2bDateTime } from "@/lib/b2b-ops/format";
import {
  B2B_DEPARTMENTS,
  B2B_PARTNER_TYPES,
  B2B_PRIORITIES,
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
  type B2bPartnerDetail,
  type B2bPartnerType,
  type B2bPriority,
  type B2bRateStatus,
  type B2bStatus,
} from "@/lib/b2b-ops/types";
import { B2bActivityQueue } from "./B2bActivityQueue";
import { B2bDialog, Field, SaveBar, toDateInput } from "./ui";
import "./b2b-ops.css";

const TABS = [
  ["overview", "Overview"],
  ["contacts", "Contacts"],
  ["terms", "Commercial terms"],
  ["activities", "Activities"],
  ["bookings", "Related bookings"],
  ["files", "Files / Sales Materials"],
  ["notes", "Notes"],
  ["audit", "Audit history"],
] as const;

type Tab = (typeof TABS)[number][0];
type Staff = { id: string; name: string };

export function B2bPartnerForm({
  partner,
  staff,
  access,
  initialTab = "overview",
}: {
  partner: B2bPartnerDetail;
  staff: Staff[];
  access: B2bAccessView;
  initialTab?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>(TABS.some((item) => item[0] === initialTab) ? (initialTab as Tab) : "overview");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [overview, setOverview] = useState({
    id: partner.id,
    name: partner.name,
    type: partner.type,
    market: partner.market,
    contactPerson: partner.contactMasked ? "" : partner.contactPerson,
    contactChannel: partner.contactMasked ? "" : partner.contactChannel,
    ownerId: partner.ownerId,
    department: partner.department,
    priority: partner.priority,
    status: partner.status,
    nextAction: partner.nextAction,
    nextActionAt: toDateInput(partner.nextActionAt),
    lastContactAt: toDateInput(partner.lastContactAt),
    notes: partner.notes,
    hotels: partner.hotels.join("\n"),
    rateApproval: partner.rateApproval,
  });
  const [contact, setContact] = useState({ id: "", name: "", role: "", email: "", phone: "", channel: "", isPrimary: false });
  const [term, setTerm] = useState({
    id: "",
    hotelName: "",
    ratePlan: "",
    commissionText: "",
    availability: "",
    channel: "",
    status: "draft" as B2bRateStatus,
    notes: "",
  });
  const [booking, setBooking] = useState({
    id: "",
    hotelName: "",
    period: "",
    roomNights: "",
    revenueText: "",
    status: "draft",
    dataStatus: "internal",
    notes: "",
  });
  const [fileCaption, setFileCaption] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [noteKind, setNoteKind] = useState("general");

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
    });
  }

  function saveOverview() {
    const data = new FormData();
    Object.entries(overview).forEach(([key, value]) => data.set(key, String(value)));
    run(() => saveB2bPartner(data), "บันทึกภาพรวมแล้ว");
  }

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

      <div className="b2b-detail-tabs" role="tablist">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" className={`b2b-tab${tab === id ? " is-active" : ""}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <section className="b2b-panel">
          <div className="b2b-form-grid">
            <Field label="ชื่อพาร์ตเนอร์">
              <input className="crm-field" value={overview.name} onChange={(event) => setOverview({ ...overview, name: event.target.value })} />
            </Field>
            <Field label="ประเภท">
              <select className="crm-select" value={overview.type} onChange={(event) => setOverview({ ...overview, type: event.target.value as B2bPartnerType })}>
                {B2B_PARTNER_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {TYPE_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ตลาด / เซ็กเมนต์">
              <input className="crm-field" value={overview.market} onChange={(event) => setOverview({ ...overview, market: event.target.value })} />
            </Field>
            {access.canContacts ? (
              <>
                <Field label="ผู้ติดต่อ">
                  <input className="crm-field" value={overview.contactPerson} onChange={(event) => setOverview({ ...overview, contactPerson: event.target.value })} />
                </Field>
                <Field label="ช่องทางติดต่อ">
                  <input className="crm-field" value={overview.contactChannel} onChange={(event) => setOverview({ ...overview, contactChannel: event.target.value })} />
                </Field>
              </>
            ) : (
              <p className="b2b-muted is-wide">ผู้ติดต่อถูกปกปิดตามสิทธิ์</p>
            )}
            <Field label="ผู้รับผิดชอบ">
              <select className="crm-select" value={overview.ownerId} onChange={(event) => setOverview({ ...overview, ownerId: event.target.value })}>
                <option value="">ยังไม่มอบหมาย</option>
                {staff.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="แผนก">
              <select className="crm-select" value={overview.department} onChange={(event) => setOverview({ ...overview, department: event.target.value as B2bDepartment })}>
                {B2B_DEPARTMENTS.map((item) => (
                  <option key={item} value={item}>
                    {DEPARTMENT_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ความสำคัญ">
              <select className="crm-select" value={overview.priority} onChange={(event) => setOverview({ ...overview, priority: event.target.value as B2bPriority })}>
                {B2B_PRIORITIES.map((item) => (
                  <option key={item} value={item}>
                    {PRIORITY_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="สถานะ">
              <select className="crm-select" value={overview.status} onChange={(event) => setOverview({ ...overview, status: event.target.value as B2bStatus })}>
                {B2B_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Next action">
              <input className="crm-field" value={overview.nextAction} onChange={(event) => setOverview({ ...overview, nextAction: event.target.value })} />
            </Field>
            <Field label="วันนัดถัดไป">
              <input className="crm-field" type="date" value={overview.nextActionAt} onChange={(event) => setOverview({ ...overview, nextActionAt: event.target.value })} />
            </Field>
            <Field label="ติดต่อล่าสุด">
              <input className="crm-field" type="date" value={overview.lastContactAt} onChange={(event) => setOverview({ ...overview, lastContactAt: event.target.value })} />
            </Field>
            {access.canEditCommercial || access.canCommercial ? (
              <Field label="สถานะอนุมัติเรท/คอมมิชชัน">
                <select
                  className="crm-select"
                  value={overview.rateApproval}
                  disabled={!access.canEditCommercial}
                  onChange={(event) => setOverview({ ...overview, rateApproval: event.target.value as B2bRateStatus })}
                >
                  {B2B_RATE_STATUSES.map((item) => (
                    <option key={item} value={item}>
                      {RATE_STATUS_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
            ) : (
              <p className="b2b-muted is-wide">สถานะเรท/คอมมิชชันถูกปกปิด</p>
            )}
            <Field label="โรงแรมที่เกี่ยวข้อง">
              <textarea className="crm-field" rows={3} value={overview.hotels} onChange={(event) => setOverview({ ...overview, hotels: event.target.value })} />
            </Field>
            <Field label="บันทึก">
              <textarea className="crm-field" rows={4} value={overview.notes} onChange={(event) => setOverview({ ...overview, notes: event.target.value })} />
            </Field>
            <p className="b2b-muted">สร้าง {formatB2bDateTime(partner.createdAt)} · อัปเดต {formatB2bDateTime(partner.updatedAt)}</p>
          </div>
          {access.canEditPipeline ? <SaveBar pending={pending} ok={ok} error={error} onSave={saveOverview} /> : <p className="b2b-muted">บัญชีนี้ไม่มีสิทธิ์แก้ไข Pipeline</p>}
          {access.canEditPipeline || access.isManagement ? (
            <button type="button" className="crm-users-secondary" onClick={() => setDeleteOpen(true)}>
              ลบพาร์ตเนอร์
            </button>
          ) : null}
        </section>
      ) : null}

      {tab === "contacts" ? (
        <section className="b2b-panel">
          <div className="b2b-list">
            {partner.contacts.length ? (
              partner.contacts.map((item) => (
                <article key={item.id}>
                  <strong className={item.masked ? "b2b-masked" : undefined}>{item.name}</strong>
                  <p>{item.role || "ไม่ระบุตำแหน่ง"} {item.isPrimary ? "· หลัก" : ""}</p>
                  <p className={item.masked ? "b2b-masked" : undefined}>
                    {item.email || "—"} · {item.phone || "—"} · {item.channel || "—"}
                  </p>
                  {access.canContacts && access.canEditPipeline ? (
                    <div className="b2b-row-actions">
                      <button
                        type="button"
                        className="crm-users-secondary"
                        onClick={() =>
                          setContact({
                            id: item.id,
                            name: item.masked ? "" : item.name,
                            role: item.role,
                            email: item.masked ? "" : item.email,
                            phone: item.masked ? "" : item.phone,
                            channel: item.masked ? "" : item.channel,
                            isPrimary: item.isPrimary,
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
                          run(() => deleteB2bContact(data), "ลบผู้ติดต่อแล้ว");
                        }}
                      >
                        ลบ
                      </button>
                    </div>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="b2b-muted">ยังไม่มีผู้ติดต่อ</p>
            )}
          </div>
          {access.canContacts && access.canEditPipeline ? (
            <>
              <div className="b2b-form-grid">
                <Field label="ชื่อ">
                  <input className="crm-field" value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} />
                </Field>
                <Field label="ตำแหน่ง">
                  <input className="crm-field" value={contact.role} onChange={(event) => setContact({ ...contact, role: event.target.value })} />
                </Field>
                <Field label="อีเมล">
                  <input className="crm-field" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} />
                </Field>
                <Field label="โทร">
                  <input className="crm-field" value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} />
                </Field>
                <Field label="ช่องทาง">
                  <input className="crm-field" value={contact.channel} onChange={(event) => setContact({ ...contact, channel: event.target.value })} />
                </Field>
                <label className="crm-cms-field">
                  <span>ผู้ติดต่อหลัก</span>
                  <input type="checkbox" checked={contact.isPrimary} onChange={(event) => setContact({ ...contact, isPrimary: event.target.checked })} />
                </label>
              </div>
              <SaveBar
                pending={pending}
                ok={ok}
                error={error}
                onSave={() => {
                  const data = new FormData();
                  data.set("partnerId", partner.id);
                  data.set("id", contact.id);
                  data.set("name", contact.name);
                  data.set("role", contact.role);
                  data.set("email", contact.email);
                  data.set("phone", contact.phone);
                  data.set("channel", contact.channel);
                  data.set("isPrimary", contact.isPrimary ? "1" : "0");
                  run(() => saveB2bContact(data), "บันทึกผู้ติดต่อแล้ว");
                }}
              />
            </>
          ) : (
            <p className="b2b-muted">บัญชีนี้ไม่เห็นหรือแก้ไขข้อมูลติดต่อที่ละเอียดได้</p>
          )}
        </section>
      ) : null}

      {tab === "terms" ? (
        <section className="b2b-panel">
          <div className="b2b-list">
            {partner.terms.length ? (
              partner.terms.map((item) => (
                <article key={item.id}>
                  <strong>{item.hotelName || "ไม่ระบุโรงแรม"}</strong>
                  <p>
                    เรท: <span className={item.masked ? "b2b-masked" : undefined}>{item.ratePlan || "—"}</span>
                  </p>
                  <p>
                    คอมมิชชัน: <span className={item.masked ? "b2b-masked" : undefined}>{item.commissionText || "—"}</span>
                  </p>
                  <p>
                    Availability: <span className={item.masked ? "b2b-masked" : undefined}>{item.availability || "—"}</span> · ช่องทาง {item.channel || "—"}
                  </p>
                  <span className={`b2b-status is-${item.status === "approved" ? "active" : item.status === "pending" ? "negotiation" : "new_lead"}`}>
                    {RATE_STATUS_LABEL[item.status]}
                  </span>
                  {access.canEditCommercial ? (
                    <div className="b2b-row-actions">
                      <button
                        type="button"
                        className="crm-users-secondary"
                        onClick={() =>
                          setTerm({
                            id: item.id,
                            hotelName: item.hotelName,
                            ratePlan: item.masked ? "" : item.ratePlan,
                            commissionText: item.masked ? "" : item.commissionText,
                            availability: item.masked ? "" : item.availability,
                            channel: item.channel,
                            status: item.status,
                            notes: item.masked ? "" : item.notes,
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
                          run(() => deleteB2bTerm(data), "ลบเงื่อนไขแล้ว");
                        }}
                      >
                        ลบ
                      </button>
                    </div>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="b2b-muted">ยังไม่มีเงื่อนไขราคา</p>
            )}
          </div>
          {access.canEditCommercial ? (
            <>
              <div className="b2b-form-grid">
                <Field label="โรงแรม">
                  <input className="crm-field" value={term.hotelName} onChange={(event) => setTerm({ ...term, hotelName: event.target.value })} />
                </Field>
                <Field label="Rate plan">
                  <input className="crm-field" value={term.ratePlan} onChange={(event) => setTerm({ ...term, ratePlan: event.target.value })} />
                </Field>
                <Field label="Commission">
                  <input className="crm-field" value={term.commissionText} onChange={(event) => setTerm({ ...term, commissionText: event.target.value })} />
                </Field>
                <Field label="Availability">
                  <input className="crm-field" value={term.availability} onChange={(event) => setTerm({ ...term, availability: event.target.value })} />
                </Field>
                <Field label="ช่องทาง">
                  <input className="crm-field" value={term.channel} onChange={(event) => setTerm({ ...term, channel: event.target.value })} />
                </Field>
                <Field label="สถานะอนุมัติ">
                  <select className="crm-select" value={term.status} onChange={(event) => setTerm({ ...term, status: event.target.value as B2bRateStatus })}>
                    {B2B_RATE_STATUSES.map((item) => (
                      <option key={item} value={item}>
                        {RATE_STATUS_LABEL[item]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="บันทึก">
                  <textarea className="crm-field" rows={3} value={term.notes} onChange={(event) => setTerm({ ...term, notes: event.target.value })} />
                </Field>
              </div>
              <SaveBar
                pending={pending}
                ok={ok}
                error={error}
                onSave={() => {
                  const data = new FormData();
                  data.set("partnerId", partner.id);
                  Object.entries(term).forEach(([key, value]) => data.set(key, String(value)));
                  run(() => saveB2bTerm(data), "บันทึกเงื่อนไขแล้ว");
                }}
              />
            </>
          ) : (
            <p className="b2b-muted">Revenue / Distribution หรือผู้ที่ได้รับสิทธิ์เท่านั้นที่แก้เรทและคอมมิชชันได้</p>
          )}
        </section>
      ) : null}

      {tab === "activities" ? (
        <section className="b2b-panel">
          <B2bActivityQueue
            items={partner.activities}
            access={access}
            staff={staff}
            partners={[{ id: partner.id, name: partner.name, hotels: partner.hotels }]}
            lockedPartnerId={partner.id}
          />
        </section>
      ) : null}

      {tab === "bookings" ? (
        <section className="b2b-panel">
          <div className="b2b-list">
            {partner.bookings.length ? (
              partner.bookings.map((item) => (
                <article key={item.id}>
                  <strong>{item.hotelName || "ไม่ระบุโรงแรม"}</strong>
                  <p>{item.period || "ไม่ระบุช่วง"}</p>
                  <p>
                    Room nights: <span className={item.masked ? "b2b-masked" : undefined}>{item.roomNights || "—"}</span>
                  </p>
                  <p>
                    Revenue: <span className={item.masked ? "b2b-masked" : undefined}>{item.revenueText || "—"}</span>
                  </p>
                  {access.canEditCommercial ? (
                    <div className="b2b-row-actions">
                      <button
                        type="button"
                        className="crm-users-secondary"
                        onClick={() =>
                          setBooking({
                            id: item.id,
                            hotelName: item.hotelName,
                            period: item.period,
                            roomNights: item.masked ? "" : item.roomNights,
                            revenueText: item.masked ? "" : item.revenueText,
                            status: item.status,
                            dataStatus: item.dataStatus,
                            notes: item.notes,
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
                          run(() => deleteB2bBooking(data), "ลบผลจองแล้ว");
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
          {access.canEditCommercial ? (
            <>
              <div className="b2b-form-grid">
                <Field label="โรงแรม">
                  <input className="crm-field" value={booking.hotelName} onChange={(event) => setBooking({ ...booking, hotelName: event.target.value })} />
                </Field>
                <Field label="ช่วงเวลา">
                  <input className="crm-field" value={booking.period} onChange={(event) => setBooking({ ...booking, period: event.target.value })} />
                </Field>
                <Field label="Room nights">
                  <input className="crm-field" value={booking.roomNights} onChange={(event) => setBooking({ ...booking, roomNights: event.target.value })} />
                </Field>
                <Field label="Revenue">
                  <input className="crm-field" value={booking.revenueText} onChange={(event) => setBooking({ ...booking, revenueText: event.target.value })} />
                </Field>
                <Field label="สถานะ">
                  <input className="crm-field" value={booking.status} onChange={(event) => setBooking({ ...booking, status: event.target.value })} />
                </Field>
                <Field label="บันทึก">
                  <textarea className="crm-field" rows={3} value={booking.notes} onChange={(event) => setBooking({ ...booking, notes: event.target.value })} />
                </Field>
              </div>
              <SaveBar
                pending={pending}
                ok={ok}
                error={error}
                onSave={() => {
                  const data = new FormData();
                  data.set("partnerId", partner.id);
                  Object.entries(booking).forEach(([key, value]) => data.set(key, String(value)));
                  run(() => saveB2bBooking(data), "บันทึกผลจองแล้ว");
                }}
              />
            </>
          ) : (
            <p className="b2b-muted">ตัวเลขจองถูกปกปิดถ้าบัญชีนี้ไม่มีสิทธิ์เชิงพาณิชย์</p>
          )}
        </section>
      ) : null}

      {tab === "files" ? (
        <section className="b2b-panel">
          <div className="b2b-list">
            {partner.files.length ? (
              partner.files.map((item) => (
                <article key={item.id}>
                  <a href={`/api/crm/b2b/files/${item.id}`}>{item.filename}</a>
                  <p>
                    {item.caption || item.kind} · {formatB2bDateTime(item.createdAt)}
                  </p>
                  {access.canEditMaterials || access.canEditPipeline ? (
                    <button
                      type="button"
                      className="crm-users-secondary"
                      onClick={() => {
                        const data = new FormData();
                        data.set("id", item.id);
                        run(() => deleteB2bFile(data), "ลบไฟล์แล้ว");
                      }}
                    >
                      ลบ
                    </button>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="b2b-muted">ยังไม่มีไฟล์</p>
            )}
          </div>
          {access.canEditMaterials || access.canEditPipeline ? (
            <form
              className="b2b-form-grid"
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                data.set("partnerId", partner.id);
                data.set("caption", fileCaption);
                run(() => attachB2bFile(data), "แนบไฟล์แล้ว");
              }}
            >
              <Field label="ไฟล์">
                <input className="crm-field" type="file" name="file" />
              </Field>
              <Field label="คำอธิบาย">
                <input className="crm-field" value={fileCaption} onChange={(event) => setFileCaption(event.target.value)} />
              </Field>
              <div className="is-wide">
                <div className="crm-cs-savebar b2b-savebar">
                  <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                    {pending ? "กำลังบันทึก…" : "บันทึกไฟล์"}
                  </button>
                  <p className={`crm-cs-save-state${error ? " is-error" : ok ? " is-ok" : ""}`} role="status">
                    {pending ? "กำลังบันทึก…" : error ? "บันทึกไม่สำเร็จ" : ok || "พร้อมบันทึก"}
                  </p>
                </div>
              </div>
            </form>
          ) : (
            <p className="b2b-muted">Marketing หรือ Sales เท่านั้นที่แนบไฟล์ได้</p>
          )}
        </section>
      ) : null}

      {tab === "notes" ? (
        <section className="b2b-panel">
          <div className="b2b-list">
            {partner.notesList.length ? (
              partner.notesList.map((item) => (
                <article key={item.id}>
                  <p>{item.body}</p>
                  <small>
                    {item.kind === "campaign" ? "แคมเปญ" : "ทั่วไป"} · {item.authorName} · {formatB2bDateTime(item.createdAt)}
                  </small>
                </article>
              ))
            ) : (
              <p className="b2b-muted">ยังไม่มีบันทึก</p>
            )}
          </div>
          {access.canEditPipeline || access.canEditMaterials ? (
            <>
              <Field label="ประเภท">
                <select className="crm-select" value={noteKind} onChange={(event) => setNoteKind(event.target.value)}>
                  <option value="general">บันทึกทั่วไป</option>
                  {access.canEditMaterials ? <option value="campaign">บันทึกแคมเปญ</option> : null}
                </select>
              </Field>
              <Field label="ข้อความ">
                <textarea className="crm-field" rows={4} value={noteBody} onChange={(event) => setNoteBody(event.target.value)} />
              </Field>
              <SaveBar
                pending={pending}
                ok={ok}
                error={error}
                onSave={() => {
                  const data = new FormData();
                  data.set("partnerId", partner.id);
                  data.set("kind", noteKind);
                  data.set("body", noteBody);
                  run(() => saveB2bNote(data), "บันทึกโน้ตแล้ว");
                }}
              />
            </>
          ) : (
            <p className="b2b-muted">บัญชีนี้ดูบันทึกได้อย่างเดียว</p>
          )}
        </section>
      ) : null}

      {tab === "audit" ? (
        <section className="b2b-panel">
          <div className="b2b-list">
            {partner.audits.length ? (
              partner.audits.map((item) => (
                <article key={item.id}>
                  <strong>{item.action}</strong>
                  <p>{item.detail}</p>
                  <small>
                    {item.actorName || item.actorId} · {formatB2bDateTime(item.createdAt)}
                  </small>
                </article>
              ))
            ) : (
              <p className="b2b-muted">ยังไม่มีประวัติการแก้ไข</p>
            )}
          </div>
        </section>
      ) : null}

      <p>
        <Link href="/crm/b2b">กลับไป Partner Pipeline</Link>
      </p>

      {deleteOpen ? (
        <B2bDialog
          title="ลบพาร์ตเนอร์"
          body="รายการนี้จะถูกลบจากระบบภายในทั้งหมด"
          confirmLabel="ลบรายการ"
          pending={pending}
          onCancel={() => setDeleteOpen(false)}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", partner.id);
            startTransition(async () => {
              const result = await deleteB2bPartner(data);
              if (!result.ok) {
                setError(b2bErrorMessage(result.error));
                return;
              }
              router.push("/crm/b2b");
            });
          }}
        />
      ) : null}
    </div>
  );
}
