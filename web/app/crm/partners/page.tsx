import Link from "next/link";
import { formatThaiDateTime } from "@/lib/crm/queries";
import { partnerOverview } from "@/lib/partners/queries";

export default async function PartnerAccountingPage() {
  const data = await partnerOverview();
  return (
    <div className="crm-grid">
      <div>
        <h1 className="text-3xl font-extrabold text-[#3B3B3B]">Accounting · พาร์ตเนอร์และจ่ายเงิน</h1>
        <p className="mt-2">สำหรับบัญชีและทีม ตรวจอนุมัติพาร์ตเนอร์ ตรวจค่าคอมมิชชัน และติดตามรอบจ่าย</p>
      </div>
      <div className="kpi-grid-3">
        <Card href="/crm/partners/list" title="ใบสมัครรออนุมัติ" value={data.applications} />
        <Card href="/crm/partners/referrals" title="Referral รอรับ" value={data.referrals} />
        <Card href="/crm/partners/commissions" title="ค่าคอมรออนุมัติ" value={data.commissions} />
        <Card href="/crm/partners/payouts" title="รอจ่าย" value={data.payouts} />
        <Card href="/crm/partners/payouts" title="จ่ายเกินกำหนด" value={data.overdue} />
      </div>
      <section className="crm-card">
        <h2 className="text-xl font-extrabold">กิจกรรมล่าสุด</h2>
        <ul className="mt-3 grid gap-2">
          {data.audits.length === 0 ? <li>ยังไม่มีรายการ</li> : null}
          {data.audits.map((item) => (
            <li key={item.id} className="text-sm">
              {formatThaiDateTime(item.createdAt)} · {item.action} · {item.entityType}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Card({ href, title, value }: { href: string; title: string; value: number }) {
  return (
    <Link href={href} className="crm-card">
      <p className="text-sm">{title}</p>
      <p className="mt-2 text-3xl font-extrabold text-[#3B3B3B]">{value}</p>
    </Link>
  );
}
