import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { StatusBadge } from "@/components/crm/ui/StatusBadge";
import { formatThaiDateTime } from "@/lib/crm/queries";
import {
  reviewBankAccount,
  reviewPartner,
  staffSubmitBankAccount,
  uploadPartnerDocumentFormAction,
} from "@/lib/partners/actions";
import { maskAccount, maskTaxId } from "@/lib/partners/access";
import { formatBaht } from "@/lib/partners/money";
import { partnerDetail, partnerTierLabel, statusLabel } from "@/lib/partners/queries";

function tone(status: string): "success" | "warning" | "danger" | "info" | "neutral" {
  if (status === "approved" || status === "active") return "success";
  if (status === "pending" || status === "under_review" || status === "unverified") return "warning";
  if (status === "rejected" || status === "suspended") return "danger";
  return "neutral";
}

export default async function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const partner = await partnerDetail(id);
  if (!partner) notFound();

  return (
    <div className="crm-partners">
      <PageHeader
        eyebrow="Partner Management"
        title={partner.displayName}
        description={`${partner.legalName} · ${partner.email} · ${partner.phone}`}
        actions={
          <div className="crm-partners-actions">
            <Link href="/crm/partners/list" className="crm-users-secondary">
              รายชื่อ
            </Link>
            <Link href="/crm/partners" className="crm-users-secondary">
              คิวงาน
            </Link>
          </div>
        }
      />

      <section className="crm-partners-bar" aria-label="สถานะพาร์ตเนอร์">
        <div className="crm-partners-metrics crm-partners-metrics-badges">
          <div>
            <span>Tier</span>
            <strong className="is-text">{partnerTierLabel(partner.tier)}</strong>
          </div>
          <div>
            <span>สถานะ</span>
            <StatusBadge label={statusLabel(partner.status)} tone={tone(partner.status)} />
          </div>
          <div>
            <span>KYC</span>
            <StatusBadge label={statusLabel(partner.kycStatus)} tone={tone(partner.kycStatus)} />
          </div>
          <div>
            <span>ภาษี</span>
            <strong className="is-text">{maskTaxId(partner.taxIdLast4)}</strong>
          </div>
        </div>
      </section>

      <div className="crm-partners-detail-grid">
        <section className="crm-partners-panel">
          <div className="crm-partners-panel-head">
            <div>
              <h2>ตรวจสถานะ</h2>
              <p>อัปเดตสถานะพาร์ตเนอร์และ KYC</p>
            </div>
          </div>
          <form action={reviewPartner} className="crm-partners-form is-compact">
            <input type="hidden" name="partnerId" value={partner.id} />
            <label>
              สถานะ
              <select className="crm-select" name="status" defaultValue={partner.status}>
                <option value="pending">รอตรวจ</option>
                <option value="active">ใช้งาน</option>
                <option value="suspended">ระงับ</option>
              </select>
            </label>
            <label>
              KYC
              <select className="crm-select" name="kycStatus" defaultValue={partner.kycStatus}>
                <option value="unverified">ยังไม่ตรวจ</option>
                <option value="pending">รอตรวจ</option>
                <option value="approved">ผ่าน</option>
                <option value="rejected">ไม่ผ่าน</option>
              </select>
            </label>
            <label>
              หมายเหตุ
              <textarea className="crm-field" name="reviewNote" defaultValue={partner.reviewNote ?? ""} rows={3} />
            </label>
            <div className="crm-partners-form-actions">
              <button className="kpi-button" type="submit">
                บันทึกการตรวจ
              </button>
            </div>
          </form>
        </section>

        <section className="crm-partners-panel">
          <div className="crm-partners-panel-head">
            <div>
              <h2>บัญชีธนาคาร</h2>
              <p>ตรวจและเพิ่มบัญชีสำหรับจ่ายค่าคอม</p>
            </div>
          </div>
          <ul className="crm-partners-mini-list">
            {partner.banks.map((bank) => (
              <li key={bank.id}>
                <div>
                  <strong>
                    {bank.bankName} · {bank.accountName}
                  </strong>
                  <span>
                    {maskAccount(bank.accountLast4)} · {statusLabel(bank.status)}
                  </span>
                </div>
                {bank.status === "pending" ? (
                  <form action={reviewBankAccount} className="crm-partners-inline-actions">
                    <input type="hidden" name="bankId" value={bank.id} />
                    <button className="kpi-button" name="status" value="approved" type="submit">
                      อนุมัติ
                    </button>
                    <button className="crm-users-secondary" name="status" value="rejected" type="submit">
                      ปฏิเสธ
                    </button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
          <form action={staffSubmitBankAccount} className="crm-partners-form is-compact">
            <input type="hidden" name="partnerId" value={partner.id} />
            <label>
              ธนาคาร
              <input className="crm-field" name="bankName" placeholder="ธนาคาร" required />
            </label>
            <label>
              ชื่อบัญชี
              <input className="crm-field" name="accountName" placeholder="ชื่อบัญชี" required />
            </label>
            <label>
              เลขบัญชี
              <input className="crm-field" name="accountNumber" placeholder="เลขบัญชี" required />
            </label>
            <div className="crm-partners-form-actions">
              <button className="kpi-button" type="submit">
                เพิ่มบัญชี (รอตรวจ)
              </button>
            </div>
          </form>
        </section>

        <section className="crm-partners-panel">
          <div className="crm-partners-panel-head">
            <div>
              <h2>เอกสาร</h2>
              <p>อัปโหลดเอกสาร KYC แบบส่วนตัว</p>
            </div>
          </div>
          <form action={uploadPartnerDocumentFormAction} className="crm-partners-form is-compact">
            <input type="hidden" name="partnerId" value={partner.id} />
            <label>
              ประเภทเอกสาร
              <select className="crm-select" name="kind" defaultValue="id_card">
                <option value="id_card">บัตรประชาชน</option>
                <option value="company">เอกสารบริษัท</option>
                <option value="bank">เอกสารบัญชี</option>
              </select>
            </label>
            <label>
              ไฟล์
              <input className="crm-field" type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" />
            </label>
            <div className="crm-partners-form-actions">
              <button className="kpi-button" type="submit">
                อัปโหลด
              </button>
            </div>
          </form>
          <ul className="crm-partners-mini-list">
            {partner.documents.map((doc) => (
              <li key={doc.id}>
                <a href={`/api/partners/files/${doc.id}`}>
                  {doc.kind} · {doc.filename}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="crm-partners-panel">
          <div className="crm-partners-panel-head">
            <div>
              <h2>Referral / ค่าคอม</h2>
              <p>รายการที่เชื่อมกับพาร์ตเนอร์นี้</p>
            </div>
          </div>
          <ul className="crm-partners-mini-list">
            {partner.referrals.map((row) => (
              <li key={row.id}>
                <div>
                  <strong>{row.businessName}</strong>
                  <span>{statusLabel(row.status)}</span>
                </div>
                {row.leadId ? (
                  <Link href={`/crm/leads/${row.leadId}`} className="crm-users-secondary">
                    เปิดลีด
                  </Link>
                ) : null}
              </li>
            ))}
            {partner.commissions.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>
                    {item.lead.contactName} · {item.serviceMonth}
                  </strong>
                  <span>
                    {statusLabel(item.status)} · {formatBaht(item.calculatedSatang)}
                  </span>
                </div>
              </li>
            ))}
            {partner.referrals.length === 0 && partner.commissions.length === 0 ? (
              <li>
                <div>
                  <span>ยังไม่มี referral หรือค่าคอม</span>
                </div>
              </li>
            ) : null}
          </ul>
        </section>
      </div>

      <section className="crm-partners-panel">
        <div className="crm-partners-panel-head">
          <div>
            <h2>Audit log</h2>
            <p>ประวัติการเปลี่ยนแปลงของพาร์ตเนอร์นี้</p>
          </div>
        </div>
        {partner.audits.length === 0 ? (
          <p className="crm-partners-item-note">ยังไม่มีบันทึก</p>
        ) : (
          <ul className="crm-partners-activity">
            {partner.audits.map((item) => (
              <li key={item.id}>
                <time dateTime={item.createdAt.toISOString()}>{formatThaiDateTime(item.createdAt)}</time>
                <div>
                  <strong>{item.action}</strong>
                  <span>{item.detail}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
