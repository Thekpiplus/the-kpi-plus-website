import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { StatusBadge } from "@/components/crm/ui/StatusBadge";
import { reviewCommission } from "@/lib/partners/actions";
import { formatBaht } from "@/lib/partners/money";
import { commissionQueue, partnerTierLabel, statusLabel } from "@/lib/partners/queries";

function commissionTone(status: string): "success" | "warning" | "danger" | "info" | "neutral" {
  if (status === "approved" || status === "paid") return "success";
  if (status === "calculated" || status === "pending_review" || status === "estimated") return "warning";
  if (status === "rejected" || status === "held") return "danger";
  return "neutral";
}

export default async function CommissionReviewPage() {
  const items = await commissionQueue();
  const pending = items.filter((item) => item.status === "calculated" || item.status === "pending_review").length;

  return (
    <div className="crm-partners">
      <PageHeader
        eyebrow="Partner Management"
        title="ตรวจค่าคอมมิชชัน"
        description="ตรวจยอดคำนวณ ปรับ และอนุมัติก่อนเข้ารอบจ่าย"
        actions={
          <div className="crm-partners-actions">
            <Link href="/crm/partners" className="crm-users-secondary">
              คิวงาน
            </Link>
            <Link href="/crm/partners/payouts" className="crm-users-secondary">
              Payouts
            </Link>
          </div>
        }
      />

      <section className="crm-partners-bar" aria-label="สรุปค่าคอม">
        <div className="crm-partners-metrics">
          <div>
            <span>รายการทั้งหมด</span>
            <strong>{items.length}</strong>
          </div>
          <div className={pending > 0 ? "is-value" : undefined}>
            <span>รออนุมัติ</span>
            <strong>{pending}</strong>
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="crm-partners-panel">
          <EmptyState title="ยังไม่มีรายการค่าคอม" body="เมื่อมีลีดที่เข้าเงื่อนไข จะคำนวณและแสดงที่นี่" />
        </section>
      ) : (
        <div className="crm-partners-stack">
          {items.map((item) => {
            const snap = JSON.parse(item.snapshot || "{}") as { warning?: string };
            return (
              <section key={item.id} className="crm-partners-panel crm-partners-item">
                <div className="crm-partners-item-head">
                  <div>
                    <h2>{item.partner.displayName}</h2>
                    <p>
                      <Link href={`/crm/leads/${item.leadId}`}>{item.lead.contactName}</Link>
                      {" · "}
                      {item.serviceMonth} · {partnerTierLabel(item.partnerTier)}
                    </p>
                  </div>
                  <StatusBadge label={statusLabel(item.status)} tone={commissionTone(item.status)} />
                </div>

                <dl className="crm-partners-facts">
                  <div>
                    <dt>ยอดเข้าเงื่อนไข</dt>
                    <dd>{formatBaht(item.eligibleSatang)}</dd>
                  </div>
                  <div>
                    <dt>อัตรา</dt>
                    <dd>{item.rateBps / 100}%</dd>
                  </div>
                  <div>
                    <dt>คำนวณ</dt>
                    <dd>{formatBaht(item.calculatedSatang)}</dd>
                  </div>
                  <div>
                    <dt>จ่ายแล้ว</dt>
                    <dd>{formatBaht(item.paidSatang)}</dd>
                  </div>
                  <div>
                    <dt>คงเหลือ</dt>
                    <dd>{formatBaht(item.remainingSatang)}</dd>
                  </div>
                </dl>

                {item.status === "estimated" ? (
                  <p className="crm-partners-item-note is-warn">ยังเป็นประมาณการ — ห้ามจ่ายจนกว่าจะยืนยันรับเงิน</p>
                ) : null}
                {snap.warning ? <p className="crm-partners-item-note is-warn">คำเตือน: {snap.warning}</p> : null}

                <form action={reviewCommission} className="crm-partners-form is-compact">
                  <input type="hidden" name="commissionId" value={item.id} />
                  <label>
                    ยอดปรับปรุง (บาท)
                    <input className="crm-field" name="adjustment" placeholder="ยอดปรับปรุง (บาท)" />
                  </label>
                  <label>
                    เหตุผล
                    <textarea className="crm-field" name="reason" placeholder="เหตุผล" required rows={2} />
                  </label>
                  <label>
                    ข้อยกเว้นถ้ามี
                    <textarea className="crm-field" name="exceptionReason" placeholder="ข้อยกเว้นถ้ามี" rows={2} />
                  </label>
                  <div className="crm-partners-form-actions is-split">
                    <button className="crm-users-secondary" name="status" value="pending_review" type="submit">
                      ส่งตรวจ
                    </button>
                    <button className="kpi-button" name="status" value="approved" type="submit">
                      อนุมัติ
                    </button>
                    <button className="crm-users-secondary" name="status" value="held" type="submit">
                      พักรายการ
                    </button>
                    <button className="crm-users-secondary" name="status" value="rejected" type="submit">
                      ปฏิเสธ
                    </button>
                  </div>
                </form>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
