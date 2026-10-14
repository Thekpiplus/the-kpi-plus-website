import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { NewPartnerOpenButton } from "@/components/crm/ui/NewPartnerModal";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { formatThaiDateTime } from "@/lib/crm/queries";
import { partnerOverview } from "@/lib/partners/queries";

const QUEUES = [
  {
    href: "/crm/partners/list?status=pending",
    key: "applications" as const,
    label: "ใบสมัครรออนุมัติ",
    body: "ตรวจสถานะและ KYC ก่อนเปิดสิทธิพาร์ตเนอร์",
    tone: "warn",
  },
  {
    href: "/crm/partners/referrals",
    key: "referrals" as const,
    label: "Referral รอรับ",
    body: "รับหรือปฏิเสธ referral ที่ส่งเข้าคิวตรวจ",
    tone: "info",
  },
  {
    href: "/crm/partners/commissions",
    key: "commissions" as const,
    label: "ค่าคอมรออนุมัติ",
    body: "ตรวจยอดคำนวณ ปรับ และอนุมัติก่อนเข้ารอบจ่าย",
    tone: "info",
  },
  {
    href: "/crm/partners/payouts",
    key: "payouts" as const,
    label: "รอจ่าย",
    body: "รวมรอบจ่ายและบันทึกหลังโอนจริง",
    tone: "ok",
  },
  {
    href: "/crm/partners/payouts",
    key: "overdue" as const,
    label: "จ่ายเกินกำหนด",
    body: "รอบที่ถึง due แล้วยังไม่ได้บันทึกจ่าย",
    tone: "danger",
  },
];

export default async function PartnerAccountingPage() {
  const data = await partnerOverview();
  const openQueue = data.applications + data.referrals + data.commissions + data.payouts;

  return (
    <div className="crm-partners">
      <PageHeader
        eyebrow="Partner Management"
        title="คิวงานพาร์ตเนอร์"
        description="ตรวจอนุมัติพาร์ตเนอร์ ตรวจค่าคอมมิชชัน และติดตามรอบจ่ายในมุมเดียว"
        actions={
          <div className="crm-partners-actions">
            <Link href="/crm/partners/list" className="crm-users-secondary">
              รายชื่อพาร์ตเนอร์
            </Link>
            <NewPartnerOpenButton className="kpi-button">เพิ่มพาร์ตเนอร์</NewPartnerOpenButton>
          </div>
        }
      />

      <section className="crm-partners-bar" aria-label="สรุปพาร์ตเนอร์">
        <div className="crm-partners-metrics">
          <div>
            <span>พาร์ตเนอร์ทั้งหมด</span>
            <strong>{data.total}</strong>
          </div>
          <div>
            <span>ใช้งานอยู่</span>
            <strong>{data.active}</strong>
          </div>
          <div>
            <span>คิวรอทำงาน</span>
            <strong>{openQueue}</strong>
          </div>
          <div className={data.overdue > 0 ? "is-alert" : "is-value"}>
            <span>จ่ายเกินกำหนด</span>
            <strong>{data.overdue}</strong>
          </div>
        </div>
      </section>

      <section className="crm-partners-queues" aria-label="คิวงาน">
        {QUEUES.map((queue) => (
          <Link
            key={queue.key}
            href={queue.href}
            className={`crm-partners-queue is-${queue.tone}${data[queue.key] > 0 ? " has-items" : ""}`}
          >
            <div className="crm-partners-queue-top">
              <p>{queue.label}</p>
              <strong>{data[queue.key]}</strong>
            </div>
            <span>{queue.body}</span>
            <em>เปิดคิว</em>
          </Link>
        ))}
      </section>

      <section className="crm-partners-panel">
        <div className="crm-partners-panel-head">
          <div>
            <h2>กิจกรรมล่าสุด</h2>
            <p>บันทึกการอนุมัติ ตรวจ referral และรอบจ่าย</p>
          </div>
          <Link href="/crm/partners/list" className="crm-users-secondary">
            ดูรายชื่อ
          </Link>
        </div>

        {data.audits.length === 0 ? (
          <EmptyState title="ยังไม่มีรายการ" body="เมื่อมีการอนุมัติหรือจ่ายเงิน จะแสดงที่นี่" />
        ) : (
          <ul className="crm-partners-activity">
            {data.audits.map((item) => (
              <li key={item.id}>
                <time dateTime={item.createdAt.toISOString()}>{formatThaiDateTime(item.createdAt)}</time>
                <div>
                  <strong>{item.action}</strong>
                  <span>
                    {item.entityType}
                    {item.entityId ? ` · ${item.entityId.slice(0, 8)}` : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
