import Link from "next/link";
import { currentUser } from "@/lib/crm/auth";
import { formatThaiDateTime } from "@/lib/crm/queries";
import { formatBaht } from "@/lib/partners/money";
import { partnerPortalData, statusLabel } from "@/lib/partners/queries";
import { TIER_LABEL, type PartnerTier } from "@/lib/partners/rules";
import { redirect } from "next/navigation";

export default async function PartnerDashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/partners/login");
  const partner = await partnerPortalData(user.id);
  if (!partner) {
    return (
      <div className="crm-grid">
        <div className="crm-card">
          <h1 className="text-2xl font-extrabold text-[#3B3B3B]">ยังไม่พบบัญชี Partner</h1>
          <p className="mt-3">สมัครที่หน้าโปรแกรมก่อน แล้วเข้าสู่ระบบด้วยอีเมลและรหัส 4 หลัก</p>
          <a className="kpi-button mt-5 inline-flex" href="/partner#apply">
            สมัครเป็น Partner
          </a>
        </div>
      </div>
    );
  }

  const approved = partner.status === "active";
  const outstanding = partner.commissions.reduce((sum, item) => sum + item.remainingSatang, 0);

  return (
    <div className="crm-grid">
      <h1 className="text-3xl font-extrabold text-[#3B3B3B]">แดชบอร์ด Partner</h1>
      <p>
        {partner.displayName} · {TIER_LABEL[partner.tier as PartnerTier] ?? partner.tier} · {statusLabel(partner.status)}
      </p>
      {!approved ? (
        <div className="crm-card">
          <h2 className="text-lg font-extrabold">โปรแกรมอยู่ระหว่างตรวจสอบ</h2>
          <p className="mt-2">คีย์ลีดและแนบบัตรประชาชนได้เลย ค่าคอมมิชชั่นจะแสดงเมื่อทีมอนุมัติโปรแกรม</p>
        </div>
      ) : null}
      <div className="crm-split-3">
        <div className="crm-card">
          <p className="text-sm font-bold text-[#0B6660]">ลีดที่ส่งแล้ว</p>
          <p className="mt-2 text-3xl font-extrabold text-[#3B3B3B]">{partner.referrals.length}</p>
        </div>
        <div className="crm-card">
          <p className="text-sm font-bold text-[#0B6660]">ค่าคอมที่รอจ่าย</p>
          <p className="mt-2 text-3xl font-extrabold text-[#3B3B3B]">{approved ? formatBaht(outstanding) : "—"}</p>
        </div>
        <div className="crm-card">
          <p className="text-sm font-bold text-[#0B6660]">รอบจ่าย</p>
          <p className="mt-2 text-3xl font-extrabold text-[#3B3B3B]">{approved ? partner.payouts.length : "—"}</p>
        </div>
      </div>
      <div className="crm-card">
        <h2 className="text-lg font-extrabold">คีย์ลีด</h2>
        <p className="mt-2">ส่งชื่อธุรกิจและผู้ติดต่อได้ทันที ไม่ต้องรออนุมัติโปรแกรม</p>
        <Link className="kpi-button mt-4 inline-flex" href="/partners/referrals">
          เพิ่มลีด
        </Link>
      </div>
      <div className="crm-card">
        <h2 className="text-lg font-extrabold">ลีดล่าสุด</h2>
        {partner.referrals.length ? (
          <ul className="mt-3 grid gap-3">
            {partner.referrals.slice(0, 5).map((row) => (
              <li key={row.id}>
                <strong className="text-[#3B3B3B]">{row.businessName}</strong> · {statusLabel(row.status)}
                <span className="block text-sm">{formatThaiDateTime(row.submittedAt ?? row.createdAt)}</span>
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
