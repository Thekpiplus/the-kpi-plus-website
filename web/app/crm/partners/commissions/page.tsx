import Link from "next/link";
import { reviewCommission } from "@/lib/partners/actions";
import { formatBaht } from "@/lib/partners/money";
import { commissionQueue, partnerTierLabel, statusLabel } from "@/lib/partners/queries";

export default async function CommissionReviewPage() {
  const items = await commissionQueue();
  return (
    <div className="crm-grid">
      <h1 className="text-3xl font-extrabold text-[#3B3B3B]">ตรวจค่าคอมมิชชัน</h1>
      {items.map((item) => {
        const snap = JSON.parse(item.snapshot || "{}") as { warning?: string };
        return (
          <section key={item.id} className="crm-card">
            <h2 className="text-xl font-extrabold">{item.partner.displayName}</h2>
            <p className="text-sm">
              <Link href={`/crm/leads/${item.leadId}`} className="text-[#0B6660]">
                {item.lead.contactName}
              </Link>{" "}
              · {item.serviceMonth} · {partnerTierLabel(item.partnerTier)} · {statusLabel(item.status)}
            </p>
            <p className="mt-2 text-sm">
              ยอดเข้าเงื่อนไข {formatBaht(item.eligibleSatang)} · อัตรา {item.rateBps / 100}% · คำนวณ{" "}
              {formatBaht(item.calculatedSatang)} · จ่ายแล้ว {formatBaht(item.paidSatang)} · คงเหลือ{" "}
              {formatBaht(item.remainingSatang)}
            </p>
            {item.status === "estimated" ? <p className="mt-2 font-bold">ยังเป็นประมาณการ — ห้ามจ่ายจนกว่าจะยืนยันรับเงิน</p> : null}
            {snap.warning ? <p className="mt-2 font-bold">คำเตือน: {snap.warning}</p> : null}
            <form action={reviewCommission} className="mt-3 grid gap-2 max-w-lg">
              <input type="hidden" name="commissionId" value={item.id} />
              <input className="crm-field" name="adjustment" placeholder="ยอดปรับปรุง (บาท)" />
              <textarea className="crm-field" name="reason" placeholder="เหตุผล" required />
              <textarea className="crm-field" name="exceptionReason" placeholder="ข้อยกเว้นถ้ามี" />
              <button className="kpi-button" name="status" value="pending_review" type="submit">ส่งตรวจ</button>
              <button className="kpi-button" name="status" value="approved" type="submit">อนุมัติ</button>
              <button className="kpi-button" name="status" value="held" type="submit">พักรายการ</button>
              <button className="kpi-button" name="status" value="rejected" type="submit">ปฏิเสธ</button>
            </form>
          </section>
        );
      })}
    </div>
  );
}
