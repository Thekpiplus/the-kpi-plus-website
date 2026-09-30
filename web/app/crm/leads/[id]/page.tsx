import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadArchiveButton } from "@/components/crm/LeadArchiveButton";
import { addNoteFromForm, changeLeadStage, completeActivity, scheduleActivity, updateLead } from "@/lib/crm/actions";
import { ACTIVITY_LABEL, ACTIVITY_TYPES, LOST_REASONS, SERVICES } from "@/lib/crm/constants";
import { formInterestLine, formLabel, parseLeadFormDetails } from "@/lib/crm/form-details";
import { formatMoney, formatThaiDateTime, leadById, pipelineData, staffDirectory } from "@/lib/crm/queries";
import { sourceLabel } from "@/lib/crm/sources";
import { creditLeadToPartner, recordPayment } from "@/lib/partners/actions";
import { formatBaht } from "@/lib/partners/money";
import { partnerList, statusLabel } from "@/lib/partners/queries";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [lead, stages, owners, partners] = await Promise.all([
    leadById(id),
    pipelineData(),
    staffDirectory(),
    partnerList().catch(() => []),
  ]);
  if (!lead) notFound();

  const services = JSON.parse(lead.services || "[]") as string[];
  const owner = owners.find((item) => item.id === lead.ownerId);
  const partner = "partner" in lead ? lead.partner : null;
  const payments = "payments" in lead ? lead.payments : [];
  const commissions = "commissions" in lead ? lead.commissions : [];
  const formRows = parseLeadFormDetails(lead.rawPayload);
  const interest = formInterestLine(formRows);

  return (
    <div className="crm-grid">
      <Link href={lead.archivedAt ? "/crm/leads?archive=archived" : "/crm/leads"} className="text-sm font-semibold text-[#0B6660]">
        ← {lead.archivedAt ? "ลีดที่เก็บไว้" : "ลีดทั้งหมด"}
      </Link>

      <section className="crm-card">
        <p className="text-xs font-extrabold tracking-[.12em] text-[#0B6660]">{lead.stage.nameTh}</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#3B3B3B]">{lead.contactName}</h1>
        <p className="mt-2">{lead.businessName || lead.formName || "ยังไม่มีชื่อกิจการ"}</p>
        {interest ? <p className="mt-2 font-semibold text-[#063F3B]">{interest}</p> : null}
        <p className="mt-2 text-sm">
          {sourceLabel(lead.source)}
          {lead.formName ? ` · ${formLabel(lead.formName)}` : ""} · {owner?.name || "ยังไม่มีผู้ดูแล"} · มูลค่า {formatMoney(lead.estimatedValue)}
        </p>
        <p className="mt-2 text-sm text-[#555555]">
          ส่งเมื่อ {formatThaiDateTime(lead.createdAt)}
          {lead.phone || lead.email ? ` · ${[lead.phone, lead.email].filter(Boolean).join(" · ")}` : ""}
        </p>
        {lead.archivedAt ? (
          <p className="crm-archived-banner">ลีดนี้ถูกเก็บไว้แล้ว จึงไม่โชว์ในรายการหลัก Pipeline และงานวันนี้</p>
        ) : null}
        {lead.pageUrl ? (
          <p className="mt-2 text-sm">
            หน้าเว็บ:{" "}
            <a href={lead.pageUrl} className="font-semibold text-[#0B6660]" target="_blank" rel="noreferrer">
              {lead.pageUrl}
            </a>
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {lead.phone ? (
            <a className="kpi-button" href={`tel:${lead.phone}`}>
              โทร
            </a>
          ) : null}
          {lead.email ? (
            <a className="kpi-button" href={`mailto:${lead.email}`}>
              อีเมล
            </a>
          ) : null}
          {lead.phone ? (
            <a className="kpi-button" href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          ) : null}
          <LeadArchiveButton leadId={lead.id} archived={Boolean(lead.archivedAt)} />
        </div>
        <form action={addNoteFromForm} className="mt-4 grid max-w-lg gap-2">
          <input type="hidden" name="leadId" value={lead.id} />
          <label className="text-sm font-bold text-[#3B3B3B]">
            บันทึกการคุยครั้งนี้
            <textarea className="crm-field" name="note" rows={3} required placeholder="คุยอะไรไปแล้ว ต้องทำอะไรต่อ" />
          </label>
          <button className="kpi-button" type="submit">
            บันทึกการคุย
          </button>
        </form>
        <form action={changeLeadStage} className="mt-4 grid max-w-lg gap-2">
          <input type="hidden" name="leadId" value={lead.id} />
          <label className="text-sm font-bold text-[#3B3B3B]">
            ขั้นใน Pipeline
            <select className="crm-select" name="stageId" defaultValue={lead.stageId}>
              {stages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nameTh}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-bold text-[#3B3B3B]">
            เหตุผลถ้าไม่สำเร็จ
            <select className="crm-select" name="outcomeReason" defaultValue={lead.outcomeReason}>
              <option value="">—</option>
              {LOST_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </label>
          <button className="kpi-button" type="submit">
            อัปเดตขั้น
          </button>
        </form>
      </section>

      <div className="crm-split">
        <section className="crm-card">
          <h2 className="text-xl font-extrabold">ข้อมูลลีด</h2>
          {formRows.length ? (
            <dl className="mt-4 grid gap-2 rounded-xl bg-[#F2F8E2] p-4 text-sm">
              <p className="font-extrabold text-[#063F3B]">คำตอบจากแบบฟอร์มเว็บไซต์</p>
              {formRows.map((row) => (
                <div key={row.key} className="grid gap-0.5 sm:grid-cols-[10rem_1fr]">
                  <dt className="font-bold text-[#0B6660]">{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : lead.message ? (
            <p className="mt-4 whitespace-pre-wrap rounded-xl bg-[#F2F8E2] p-4 text-sm">{lead.message}</p>
          ) : null}
          <form action={updateLead} className="mt-3 grid gap-3">
            <input type="hidden" name="leadId" value={lead.id} />
            <label className="text-sm font-bold">
              ชื่อผู้ติดต่อ
              <input className="crm-field" name="contactName" defaultValue={lead.contactName} required />
            </label>
            <label className="text-sm font-bold">
              กิจการ
              <input className="crm-field" name="businessName" defaultValue={lead.businessName} />
            </label>
            <label className="text-sm font-bold">
              ประเภทกิจการ
              <input className="crm-field" name="businessType" defaultValue={lead.businessType} />
            </label>
            <label className="text-sm font-bold">
              เบอร์โทร
              <input className="crm-field" name="phone" defaultValue={lead.phone} />
            </label>
            <label className="text-sm font-bold">
              อีเมล
              <input className="crm-field" name="email" type="email" defaultValue={lead.email} />
            </label>
            <label className="text-sm font-bold">
              ที่ตั้ง
              <input className="crm-field" name="location" defaultValue={lead.location} />
            </label>
            <label className="text-sm font-bold">
              เว็บไซต์
              <input className="crm-field" name="website" defaultValue={lead.website} />
            </label>
            <label className="text-sm font-bold">
              ผู้ดูแล
              <select className="crm-select" name="ownerId" defaultValue={lead.ownerId ?? ""}>
                <option value="">ยังไม่กำหนด</option>
                {owners.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold">
              มูลค่าโดยประมาณ
              <input className="crm-field" name="estimatedValue" type="number" min="0" defaultValue={lead.estimatedValue ?? ""} />
            </label>
            <label className="text-sm font-bold">
              วันที่คาดว่าจะตัดสินใจ
              <input
                className="crm-field"
                name="decisionDate"
                type="date"
                defaultValue={lead.decisionDate ? lead.decisionDate.toISOString().slice(0, 10) : ""}
              />
            </label>
            <fieldset>
              <legend className="text-sm font-bold">บริการที่สนใจ</legend>
              {SERVICES.map((service) => (
                <label key={service} className="mt-2 block text-sm">
                  <input type="checkbox" name="services" value={service} defaultChecked={services.includes(service)} className="mr-2" />
                  {service}
                </label>
              ))}
            </fieldset>
            <label className="text-sm font-bold">
              บันทึกจากลูกค้า / ทีม
              <textarea className="crm-field" name="message" rows={4} defaultValue={lead.message} />
            </label>
            <button className="kpi-button" type="submit">
              บันทึกข้อมูลลีด
            </button>
          </form>
        </section>

        <section className="crm-card">
          <h2 className="text-xl font-extrabold">นัดติดตาม</h2>
          <form action={scheduleActivity} className="mt-3 grid gap-3">
            <input type="hidden" name="leadId" value={lead.id} />
            <label className="text-sm font-bold">
              ประเภท
              <select className="crm-select" name="type" defaultValue="call">
                {ACTIVITY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {ACTIVITY_LABEL[type]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold">
              หัวข้อ
              <input className="crm-field" name="title" placeholder="เช่น โทรคุยเรื่องราคา" />
            </label>
            <label className="text-sm font-bold">
              กำหนด
              <input className="crm-field" type="datetime-local" name="dueAt" required />
            </label>
            <label className="text-sm font-bold">
              บันทึก
              <textarea className="crm-field" name="notes" rows={3} />
            </label>
            <button className="kpi-button" type="submit">
              ตั้งกิจกรรม
            </button>
          </form>
        </section>
      </div>

      <section className="crm-card">
        <h2 className="text-xl font-extrabold">กิจกรรม</h2>
        <ul className="mt-3 grid gap-4">
          {lead.activities.length === 0 ? <li>ยังไม่มีกิจกรรม</li> : null}
          {lead.activities.map((activity) => (
            <li key={activity.id}>
              <p className="font-semibold">
                {ACTIVITY_LABEL[activity.type as keyof typeof ACTIVITY_LABEL] ?? activity.type} · {activity.title} ·{" "}
                {activity.status === "open" ? "เปิดอยู่" : "เสร็จแล้ว"} · {formatThaiDateTime(activity.dueAt)}
              </p>
              {activity.notes ? <p className="text-sm">{activity.notes}</p> : null}
              {activity.status === "open" ? (
                <form action={completeActivity} className="mt-2 grid gap-2">
                  <input type="hidden" name="activityId" value={activity.id} />
                  <input className="crm-field" name="outcome" placeholder="ผลลัพธ์การติดตาม" />
                  <input className="crm-field" type="datetime-local" name="nextDueAt" />
                  <input className="crm-field" name="nextTitle" placeholder="กิจกรรมถัดไป" />
                  <label className="text-sm">
                    <input type="checkbox" name="noFollowUp" value="1" className="mr-2" />
                    ไม่ต้องติดตามต่อ
                  </label>
                  <input className="crm-field" name="noFollowUpReason" placeholder="เหตุผลถ้าไม่ติดตามต่อ" />
                  <button className="kpi-button" type="submit">
                    ปิดกิจกรรม
                  </button>
                </form>
              ) : (
                <p className="text-sm">{activity.outcome || "เสร็จแล้ว"}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="crm-card">
        <h2 className="text-xl font-extrabold">บันทึกการทำงาน</h2>
        <form className="mt-3" action={addNoteFromForm}>
          <input type="hidden" name="leadId" value={lead.id} />
          <textarea className="crm-field" name="note" rows={3} required placeholder="คุยอะไรไปแล้ว ต้องทำอะไรต่อ" />
          <button className="kpi-button mt-3" type="submit">
            เพิ่มบันทึก
          </button>
        </form>
        <ul className="mt-4 grid gap-2">
          {lead.events.map((event) => (
            <li key={event.id} className="text-sm">
              <strong>{event.type}</strong> · {formatThaiDateTime(event.createdAt)} · {event.detail}
            </li>
          ))}
        </ul>
      </section>

      <section className="crm-card">
        <h2 className="text-xl font-extrabold">พาร์ตเนอร์และค่าคอมมิชชัน</h2>
        {partner ? (
          <p className="mt-2">
            เครดิต:{" "}
            <Link href={`/crm/partners/${partner.id}`} className="font-semibold text-[#0B6660]">
              {partner.displayName}
            </Link>
          </p>
        ) : (
          <p className="mt-2">ยังไม่มีพาร์ตเนอร์ที่ได้รับเครดิต</p>
        )}
        <form action={creditLeadToPartner} className="mt-3 grid max-w-lg gap-2">
          <input type="hidden" name="leadId" value={lead.id} />
          <select className="crm-select" name="partnerId" defaultValue={lead.partnerId ?? ""}>
            <option value="">ไม่มี</option>
            {partners.map((item) => (
              <option key={item.id} value={item.id}>
                {item.displayName}
              </option>
            ))}
          </select>
          <textarea className="crm-field" name="creditNote" defaultValue={lead.creditNote} placeholder="หมายเหตุเครดิต" />
          <button className="kpi-button" type="submit">
            บันทึกเครดิต
          </button>
        </form>
        <form action={recordPayment} className="mt-5 grid max-w-lg gap-2">
          <h3 className="font-extrabold">ยืนยันการรับเงิน</h3>
          <input type="hidden" name="leadId" value={lead.id} />
          <input className="crm-field" name="serviceMonth" placeholder="2026-09" required />
          <input className="crm-field" name="serviceName" placeholder="บริการ" required />
          <input className="crm-field" name="gross" placeholder="ค่าบริการก่อน VAT" />
          <input className="crm-field" name="discount" placeholder="ส่วนลด" />
          <input className="crm-field" name="ineligible" placeholder="รายการที่ไม่เข้าเงื่อนไข" />
          <input className="crm-field" name="vat" placeholder="VAT" />
          <input className="crm-field" name="received" placeholder="ยอดรับจริงไม่รวม VAT" required />
          <label className="text-sm">
            <input type="checkbox" name="confirmed" value="1" className="mr-2" />
            ยืนยันว่ารับเงินจริงแล้ว
          </label>
          <button className="kpi-button" type="submit">
            บันทึกการรับเงิน
          </button>
        </form>
        <ul className="mt-4 grid gap-2">
          {payments.map((payment) => (
            <li key={payment.id} className="text-sm">
              {payment.serviceMonth} · {payment.serviceName} · รับ {formatBaht(payment.receivedSatang)} ·{" "}
              {payment.confirmed ? "ยืนยันแล้ว" : "ยังไม่ยืนยัน / ประมาณการ"}
            </li>
          ))}
          {commissions.map((item) => (
            <li key={item.id} className="text-sm">
              {item.serviceMonth} · {statusLabel(item.status)} · {formatBaht(item.calculatedSatang)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
