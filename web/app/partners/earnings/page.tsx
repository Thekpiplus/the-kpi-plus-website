import { currentUser } from "@/lib/crm/auth";
import { formatBaht } from "@/lib/partners/money";
import { partnerPortalData, statusLabel } from "@/lib/partners/queries";
import { redirect } from "next/navigation";

export default async function PartnerEarningsPage() {
  const user = await currentUser();
  if (!user) redirect("/partners/login");
  const partner = await partnerPortalData(user.id);
  if (!partner) redirect("/partners");
  const approved = partner.status === "active";

  return (
    <div className="crm-grid">
      <h1 className="text-3xl font-extrabold text-[#3B3B3B]">รายได้</h1>
      {!approved ? (
        <div className="crm-card">
          <h2 className="text-lg font-extrabold">ค่าคอมมิชชั่นจะแสดงหลังอนุมัติ</h2>
          <p className="mt-2">
            โปรแกรมของคุณยังเป็นสถานะ {statusLabel(partner.status)} คีย์ลีดได้ตามปกติ
            เมื่อทีมอนุมัติและยืนยันการชำระเงินจริง ยอดจะปรากฏที่นี่
          </p>
        </div>
      ) : partner.commissions.length ? (
        <div className="crm-card">
          <h2 className="text-lg font-extrabold">รายการค่าคอม</h2>
          <ul className="mt-4 grid gap-3">
            {partner.commissions.map((item) => (
              <li key={item.id} className="rounded-xl border border-[#E3E8EB] p-4">
                <strong className="text-[#3B3B3B]">{item.lead.contactName || item.lead.businessName}</strong>
                <p className="mt-1">
                  {item.serviceMonth} · {statusLabel(item.status)} · {formatBaht(item.calculatedSatang)}
                </p>
                {item.status === "estimated" ? (
                  <p className="text-sm">ประมาณการ ยังไม่ยืนยันการชำระเงิน</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="crm-card">
          <p>ยังไม่มีรายการค่าคอม ยอดจะขึ้นเมื่อลีดถูกปิดและยืนยันการชำระเงินแล้ว</p>
        </div>
      )}
    </div>
  );
}
