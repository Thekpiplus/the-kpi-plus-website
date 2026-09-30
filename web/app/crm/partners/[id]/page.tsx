import Link from "next/link";
import { notFound } from "next/navigation";
import { formatThaiDateTime } from "@/lib/crm/queries";
import {
  reviewBankAccount,
  reviewPartner,
  submitBankAccount,
  uploadPartnerDocument,
} from "@/lib/partners/actions";
import { maskAccount, maskTaxId } from "@/lib/partners/access";
import { formatBaht } from "@/lib/partners/money";
import { partnerDetail, partnerTierLabel, statusLabel } from "@/lib/partners/queries";

export default async function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const partner = await partnerDetail(id);
  if (!partner) notFound();

  return (
    <div className="crm-grid">
      <h1 className="text-3xl font-extrabold text-[#3B3B3B]">{partner.displayName}</h1>
      <section className="crm-card">
        <p>{partnerTierLabel(partner.tier)} · {statusLabel(partner.status)} · KYC {statusLabel(partner.kycStatus)}</p>
        <p className="mt-2 text-sm">{partner.legalName} · {partner.email} · {partner.phone}</p>
        <p className="text-sm">ภาษี {maskTaxId(partner.taxIdLast4)}</p>
        <form action={reviewPartner} className="mt-4 grid gap-2 max-w-lg">
          <input type="hidden" name="partnerId" value={partner.id} />
          <select className="crm-select" name="status" defaultValue={partner.status}>
            <option value="pending">รอตรวจ</option>
            <option value="active">ใช้งาน</option>
            <option value="suspended">ระงับ</option>
          </select>
          <select className="crm-select" name="kycStatus" defaultValue={partner.kycStatus}>
            <option value="unverified">ยังไม่ตรวจ</option>
            <option value="pending">รอตรวจ</option>
            <option value="approved">ผ่าน</option>
            <option value="rejected">ไม่ผ่าน</option>
          </select>
          <textarea className="crm-field" name="reviewNote" defaultValue={partner.reviewNote} />
          <button className="kpi-button" type="submit">บันทึกการตรวจ</button>
        </form>
      </section>
      <section className="crm-card">
        <h2 className="text-xl font-extrabold">บัญชีธนาคาร</h2>
        <ul className="mt-2 grid gap-2">
          {partner.banks.map((bank) => (
            <li key={bank.id} className="text-sm">
              {bank.bankName} · {bank.accountName} · {maskAccount(bank.accountLast4)} · {statusLabel(bank.status)}
              {bank.status === "pending" ? (
                <form action={reviewBankAccount} className="mt-2 flex gap-2">
                  <input type="hidden" name="bankId" value={bank.id} />
                  <button className="kpi-button" name="status" value="approved" type="submit">อนุมัติบัญชี</button>
                  <button className="kpi-button" name="status" value="rejected" type="submit">ปฏิเสธ</button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
        <form action={submitBankAccount} className="mt-4 grid gap-2 max-w-lg">
          <input type="hidden" name="partnerId" value={partner.id} />
          <input className="crm-field" name="bankName" placeholder="ธนาคาร" required />
          <input className="crm-field" name="accountName" placeholder="ชื่อบัญชี" required />
          <input className="crm-field" name="accountNumber" placeholder="เลขบัญชี" required />
          <button className="kpi-button" type="submit">เพิ่มบัญชี (รอตรวจ)</button>
        </form>
      </section>
      <section className="crm-card">
        <h2 className="text-xl font-extrabold">เอกสาร</h2>
        <form action={uploadPartnerDocument} className="mt-3 grid gap-2 max-w-lg">
          <input type="hidden" name="partnerId" value={partner.id} />
          <select className="crm-select" name="kind" defaultValue="id_card">
            <option value="id_card">บัตรประชาชน</option>
            <option value="company">เอกสารบริษัท</option>
            <option value="bank">เอกสารบัญชี</option>
          </select>
          <input className="crm-field" type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" />
          <button className="kpi-button" type="submit">อัปโหลดแบบส่วนตัว</button>
        </form>
        <ul className="mt-3 grid gap-2">
          {partner.documents.map((doc) => (
            <li key={doc.id}>
              <a className="text-[#0B6660] font-semibold" href={`/api/partners/files/${doc.id}`}>
                {doc.kind} · {doc.filename}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="crm-card">
        <h2 className="text-xl font-extrabold">Referral / ดีล / ค่าคอม</h2>
        <ul className="mt-2 grid gap-2">
          {partner.referrals.map((row) => (
            <li key={row.id} className="text-sm">
              {row.businessName} · {statusLabel(row.status)}
              {row.leadId ? (
                <>
                  {" "}
                  <Link href={`/crm/leads/${row.leadId}`} className="text-[#0B6660]">เปิดลีด</Link>
                </>
              ) : null}
            </li>
          ))}
          {partner.commissions.map((item) => (
            <li key={item.id} className="text-sm">
              {item.lead.contactName} · {item.serviceMonth} · {statusLabel(item.status)} · {formatBaht(item.calculatedSatang)}
            </li>
          ))}
        </ul>
      </section>
      <section className="crm-card">
        <h2 className="text-xl font-extrabold">Audit log</h2>
        <ul className="mt-2 grid gap-2">
          {partner.audits.map((item) => (
            <li key={item.id} className="text-sm">
              {formatThaiDateTime(item.createdAt)} · {item.action} · {item.detail}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
