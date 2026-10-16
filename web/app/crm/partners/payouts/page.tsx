import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { StatusBadge } from "@/components/crm/ui/StatusBadge";
import { staffCreatePayoutBatch, staffMarkPayoutPaid } from "@/lib/partners/actions";
import { maskAccount } from "@/lib/partners/access";
import { formatBaht } from "@/lib/partners/money";
import { partnerList, payoutQueue, statusLabel } from "@/lib/partners/queries";

function payoutTone(status: string): "success" | "warning" | "danger" | "info" | "neutral" {
  if (status === "paid") return "success";
  if (status === "ready" || status === "carried") return "warning";
  return "neutral";
}

export default async function PayoutsPage() {
  const [payouts, partners] = await Promise.all([payoutQueue(), partnerList()]);
  const ready = payouts.filter((item) => item.status === "ready").length;
  const carried = payouts.filter((item) => item.status === "carried").length;

  return (
    <div className="crm-partners">
      <PageHeader
        eyebrow="Partner Management"
        title="Payouts"
        description="รวมรอบจ่ายจากรายการที่อนุมัติแล้ว และบันทึกหลังโอนจริง"
        actions={
          <div className="crm-partners-actions">
            <Link href="/crm/partners" className="crm-users-secondary">
              คิวงาน
            </Link>
            <Link href="/crm/partners/commissions" className="crm-users-secondary">
              ค่าคอม
            </Link>
          </div>
        }
      />

      <section className="crm-partners-bar" aria-label="สรุป Payouts">
        <div className="crm-partners-metrics">
          <div>
            <span>รอบทั้งหมด</span>
            <strong>{payouts.length}</strong>
          </div>
          <div className={ready > 0 ? "is-value" : undefined}>
            <span>พร้อมจ่าย</span>
            <strong>{ready}</strong>
          </div>
          <div>
            <span>ยกไปเดือนถัดไป</span>
            <strong>{carried}</strong>
          </div>
        </div>
      </section>

      <section className="crm-partners-panel crm-partners-form-panel">
        <div className="crm-partners-panel-head">
          <div>
            <h2>สร้างรอบจ่าย</h2>
            <p>เลือกพาร์ตเนอร์จากรายการที่อนุมัติแล้ว</p>
          </div>
        </div>
        <form action={staffCreatePayoutBatch} className="crm-partners-form is-compact">
          <label>
            พาร์ตเนอร์
            <select className="crm-select" name="partnerId" required>
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.displayName} · ค้าง {partner.outstandingLabel}
                </option>
              ))}
            </select>
          </label>
          <label>
            วันครบกำหนด
            <input className="crm-field" type="date" name="dueDate" />
          </label>
          <label>
            หัก ณ ที่จ่าย (บาท)
            <input className="crm-field" name="withholding" placeholder="ให้การเงินระบุเอง" />
          </label>
          <div className="crm-partners-form-actions">
            <button className="kpi-button" type="submit">
              รวมรอบจ่าย
            </button>
          </div>
        </form>
      </section>

      {payouts.length === 0 ? (
        <section className="crm-partners-panel">
          <EmptyState title="ยังไม่มีรอบจ่าย" body="เมื่อมีค่าคอมที่อนุมัติแล้ว สามารถรวมรอบจ่ายได้ด้านบน" />
        </section>
      ) : (
        <div className="crm-partners-stack">
          {payouts.map((payout) => {
            const bank = JSON.parse(payout.bankSnapshot || "{}") as { bankName?: string; accountLast4?: string };
            return (
              <section key={payout.id} className="crm-partners-panel crm-partners-item">
                <div className="crm-partners-item-head">
                  <div>
                    <h2>{payout.partner.displayName}</h2>
                    <p>
                      สุทธิ {formatBaht(payout.netSatang)}
                      {bank.bankName ? ` · ${bank.bankName} ${maskAccount(bank.accountLast4 ?? "")}` : ""}
                    </p>
                  </div>
                  <StatusBadge label={statusLabel(payout.status)} tone={payoutTone(payout.status)} />
                </div>

                {payout.status === "carried" ? (
                  <p className="crm-partners-item-note is-warn">ยังไม่ถึงขั้นต่ำ 1,000 บาท ยกไปเดือนถัดไป</p>
                ) : null}

                {payout.status === "ready" ? (
                  <form action={staffMarkPayoutPaid} className="crm-partners-form is-compact">
                    <input type="hidden" name="payoutId" value={payout.id} />
                    <label>
                      วิธีจ่าย
                      <input className="crm-field" name="method" placeholder="วิธีจ่าย" defaultValue="bank_transfer" />
                    </label>
                    <label>
                      เลขอ้างอิง
                      <input className="crm-field" name="reference" placeholder="เลขอ้างอิง" />
                    </label>
                    <div className="crm-partners-form-actions">
                      <button className="kpi-button" type="submit">
                        บันทึกว่าจ่ายแล้วหลังโอนจริง
                      </button>
                    </div>
                  </form>
                ) : null}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
