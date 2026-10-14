import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { StatusBadge } from "@/components/crm/ui/StatusBadge";
import { formatThaiDateTime } from "@/lib/crm/queries";
import { findReferralMatches, reviewReferral } from "@/lib/partners/actions";
import { referralQueue, statusLabel, usersForAssign } from "@/lib/partners/queries";

function referralTone(status: string): "success" | "warning" | "danger" | "info" | "neutral" {
  if (status === "accepted") return "success";
  if (status === "submitted" || status === "under_review") return "warning";
  if (status === "rejected") return "danger";
  return "neutral";
}

export default async function ReferralReviewPage() {
  const [rows, users] = await Promise.all([referralQueue(), usersForAssign()]);
  const decorated = await Promise.all(
    rows.map(async (row) => ({
      row,
      matches: await findReferralMatches(row.businessName, row.phone, row.email),
    })),
  );
  const pending = rows.filter((row) => row.status === "submitted" || row.status === "under_review").length;

  return (
    <div className="crm-partners">
      <PageHeader
        eyebrow="Partner Management"
        title="ตรวจ Referral"
        description="รับหรือปฏิเสธ referral และตรวจสอบข้อมูลที่คล้ายใน CRM"
        actions={
          <div className="crm-partners-actions">
            <Link href="/crm/partners" className="crm-users-secondary">
              คิวงาน
            </Link>
            <Link href="/crm/partners/list" className="crm-users-secondary">
              พาร์ตเนอร์
            </Link>
          </div>
        }
      />

      <section className="crm-partners-bar" aria-label="สรุป Referral">
        <div className="crm-partners-metrics">
          <div>
            <span>ในคิว</span>
            <strong>{rows.length}</strong>
          </div>
          <div className={pending > 0 ? "is-value" : undefined}>
            <span>รอตรวจ</span>
            <strong>{pending}</strong>
          </div>
        </div>
      </section>

      {decorated.length === 0 ? (
        <section className="crm-partners-panel">
          <EmptyState title="ไม่มี Referral ในคิว" body="เมื่อพาร์ตเนอร์ส่ง referral จะแสดงที่นี่" />
        </section>
      ) : (
        <div className="crm-partners-stack">
          {decorated.map(({ row, matches }) => (
            <section key={row.id} className="crm-partners-panel crm-partners-item">
              <div className="crm-partners-item-head">
                <div>
                  <h2>{row.businessName}</h2>
                  <p>
                    {row.partner.displayName} · {row.contactName}
                  </p>
                </div>
                <StatusBadge label={statusLabel(row.status)} tone={referralTone(row.status)} />
              </div>

              <p className="crm-partners-item-body">{row.need}</p>
              {row.acceptedAt ? (
                <p className="crm-partners-item-note">คุ้มครองถึง {formatThaiDateTime(row.protectionEndsAt)}</p>
              ) : null}

              {matches.length ? (
                <div className="crm-partners-matches">
                  <p>พบข้อมูลคล้ายใน CRM — ให้คนตรวจ ไม่ตัดสินอัตโนมัติ</p>
                  <ul>
                    {matches.slice(0, 5).map((match) => (
                      <li key={match.lead.id}>
                        <Link href={`/crm/leads/${match.lead.id}`}>{match.lead.businessName || match.lead.contactName}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {row.status === "submitted" || row.status === "under_review" ? (
                <form action={reviewReferral} className="crm-partners-form is-compact">
                  <input type="hidden" name="referralId" value={row.id} />
                  <label>
                    มอบหมายให้
                    <select className="crm-select" name="ownerId" defaultValue={users[0]?.id}>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    หมายเหตุเครดิต
                    <textarea className="crm-field" name="creditNote" placeholder="หมายเหตุเครดิต" rows={2} />
                  </label>
                  <label>
                    เหตุผลถ้าปฏิเสธ
                    <textarea className="crm-field" name="reason" placeholder="เหตุผลถ้าปฏิเสธ" rows={2} />
                  </label>
                  <div className="crm-partners-form-actions is-split">
                    <button className="kpi-button" name="decision" value="accepted" type="submit">
                      รับ Referral และคุ้มครอง 180 วัน
                    </button>
                    <button className="crm-users-secondary" name="decision" value="rejected" type="submit">
                      ปฏิเสธ
                    </button>
                  </div>
                </form>
              ) : row.leadId ? (
                <Link href={`/crm/leads/${row.leadId}`} className="kpi-button crm-partners-inline-cta">
                  เปิดลีดใน CRM
                </Link>
              ) : null}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
