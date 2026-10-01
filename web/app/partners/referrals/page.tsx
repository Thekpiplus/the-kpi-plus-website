import { currentUser } from "@/lib/crm/auth";
import { formatThaiDateTime } from "@/lib/crm/queries";
import { portalSubmitReferral } from "@/lib/partners/actions";
import { partnerPortalData, statusLabel } from "@/lib/partners/queries";
import { redirect } from "next/navigation";

export default async function PartnerReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/partners/login");
  const partner = await partnerPortalData(user.id);
  if (!partner) redirect("/partners");
  const { sent, error } = await searchParams;

  return (
    <div className="crm-grid">
      <h1 className="text-3xl font-extrabold text-[#3B3B3B]">คีย์ลีด</h1>
      <p>ส่งข้อมูลธุรกิจที่อยากแนะนำ ทีมขายจะตรวจและรับเข้า CRM เมื่อผ่านการตรวจสอบ</p>
      {sent === "1" ? (
        <p className="crm-card font-semibold text-[#0B1F33]">ส่งลีดแล้ว ทีมจะตรวจสอบและอัปเดตสถานะในหน้านี้</p>
      ) : null}
      {error === "incomplete" ? (
        <p className="crm-card font-semibold text-[#0B1F33]">กรุณากรอกชื่อธุรกิจ ผู้ติดต่อ ความต้องการ และเบอร์หรืออีเมลอย่างน้อยหนึ่งอย่าง</p>
      ) : null}
      <form action={portalSubmitReferral} className="crm-card mx-auto w-full max-w-xl">
        <label className="block text-sm font-bold text-[#3B3B3B]">
          ชื่อธุรกิจ *
          <input className="crm-field" name="businessName" required />
        </label>
        <label className="mt-3 block text-sm font-bold text-[#3B3B3B]">
          ชื่อผู้ติดต่อ *
          <input className="crm-field" name="contactName" required />
        </label>
        <label className="mt-3 block text-sm font-bold text-[#3B3B3B]">
          เบอร์โทร
          <input className="crm-field" name="phone" autoComplete="tel" />
        </label>
        <label className="mt-3 block text-sm font-bold text-[#3B3B3B]">
          อีเมล
          <input className="crm-field" type="email" name="email" autoComplete="email" />
        </label>
        <label className="mt-3 block text-sm font-bold text-[#3B3B3B]">
          ความต้องการ *
          <textarea className="crm-field" name="need" rows={4} required />
        </label>
        <button className="kpi-button mt-5" type="submit">
          ส่งลีด
        </button>
      </form>
      <div className="crm-card">
        <h2 className="text-lg font-extrabold">ลีดของฉัน</h2>
        {partner.referrals.length ? (
          <ul className="mt-4 grid gap-3">
            {partner.referrals.map((row) => (
              <li key={row.id} className="rounded-xl border border-[#E3E8EB] p-4">
                <strong className="text-[#3B3B3B]">{row.businessName}</strong>
                <p className="mt-1">
                  {row.contactName} · {statusLabel(row.status)}
                </p>
                <p className="text-sm">{formatThaiDateTime(row.submittedAt ?? row.createdAt)}</p>
                {row.lead?.stage ? <p className="text-sm">สถานะขาย: {row.lead.stage.name}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3">ยังไม่มีลีด</p>
        )}
      </div>
    </div>
  );
}
