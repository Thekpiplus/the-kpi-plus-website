import { currentUser } from "@/lib/crm/auth";
import { formatThaiDateTime } from "@/lib/crm/queries";
import { formatBaht } from "@/lib/partners/money";
import { partnerPortalData, statusLabel } from "@/lib/partners/queries";
import { redirect } from "next/navigation";

export default async function PartnerPayoutsPage() {
  const user = await currentUser();
  if (!user) redirect("/partners/login");
  const partner = await partnerPortalData(user.id);
  if (!partner) redirect("/partners");
  const approved = partner.status === "active";

  return (
    <div className="crm-grid">
      <h1 className="text-3xl font-extrabold text-[#3B3B3B]">การจ่าย</h1>
      {!approved ? (
        <div className="crm-card">
          <p>รอบจ่ายจะแสดงเมื่อโปรแกรมได้รับการอนุมัติ และบัญชีธนาคารผ่านการตรวจ</p>
        </div>
      ) : partner.payouts.length ? (
        <div className="crm-card">
          <ul className="grid gap-3">
            {partner.payouts.map((payout) => (
              <li key={payout.id} className="rounded-xl border border-[#E3E8EB] p-4">
                <strong className="text-[#3B3B3B]">{statusLabel(payout.status)}</strong>
                <p className="mt-1">สุทธิ {formatBaht(payout.netSatang)}</p>
                <p className="text-sm">กำหนด {formatThaiDateTime(payout.dueDate)}</p>
                {payout.paidAt ? <p className="text-sm">จ่ายแล้ว {formatThaiDateTime(payout.paidAt)}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="crm-card">
          <p>ยังไม่มีรอบจ่าย</p>
        </div>
      )}
    </div>
  );
}
