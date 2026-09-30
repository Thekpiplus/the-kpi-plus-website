import Link from "next/link";
import { currentUser } from "@/lib/crm/auth";
import { leadOriginCounts, todayLists, userCounts } from "@/lib/crm/queries";
import { hasModule } from "@/lib/crm/modules";
import { partnerOverview } from "@/lib/partners/queries";
import { cmsOverview } from "@/lib/cms/queries";

export default async function AdminHomePage() {
  const user = await currentUser();
  const [lists, origins, partners, users, cms] = await Promise.all([
    todayLists(),
    leadOriginCounts(),
    partnerOverview().catch(() => ({
      applications: 0,
      referrals: 0,
      commissions: 0,
      payouts: 0,
      overdue: 0,
    })),
    userCounts(),
    cmsOverview().catch(() => ({ pages: 0, insights: 0, drafts: 0, media: 0 })),
  ]);

  return (
    <div className="crm-grid">
      <div>
        <h1 className="text-3xl font-extrabold text-[#3B3B3B]">Admin</h1>
        <p className="mt-2">เลือกงานจากฟังก์ชันที่บัญชีนี้ได้รับสิทธิ์ Lead, Partner, Users และ CMS อยู่ในระบบเดียวกัน</p>
      </div>

      <div className="crm-split-cards">
        {hasModule(user, "leads") ? (
          <Link href="/crm/sales" className="crm-card no-underline">
            <p className="text-xs font-extrabold tracking-[.12em] text-[#0B6660]">01</p>
            <h2 className="mt-1 text-2xl font-extrabold">Lead Management</h2>
            <p className="mt-3">คีย์ลีด ติดตาม คุยงาน ค้นหา มอบหมาย และปรับขั้น จากเว็บไซต์และแหล่งอื่น</p>
            <p className="mt-4 text-sm">
              จากเว็บ {origins.web} · คีย์เอง {origins.manual} · งานวันนี้ {lists.dueToday.length + lists.overdue.length}
            </p>
            <span className="kpi-button mt-5 inline-flex">เข้าจัดการลีด</span>
          </Link>
        ) : null}

        {hasModule(user, "partners") ? (
          <Link href="/crm/partners" className="crm-card no-underline">
            <p className="text-xs font-extrabold tracking-[.12em] text-[#0B6660]">02</p>
            <h2 className="mt-1 text-2xl font-extrabold">Partner Management</h2>
            <p className="mt-3">อนุมัติพาร์ตเนอร์ รับ Referral ตรวจค่าคอมมิชชัน และติดตามรอบจ่าย</p>
            <p className="mt-4 text-sm">
              รออนุมัติ {partners.applications} · ค่าคอมรอตรวจ {partners.commissions} · รอจ่าย {partners.payouts + partners.overdue}
            </p>
            <span className="kpi-button mt-5 inline-flex">เข้าจัดการพาร์ตเนอร์</span>
          </Link>
        ) : null}

        {hasModule(user, "users") ? (
          <Link href="/crm/users" className="crm-card no-underline">
            <p className="text-xs font-extrabold tracking-[.12em] text-[#0B6660]">03</p>
            <h2 className="mt-1 text-2xl font-extrabold">Users Management</h2>
            <p className="mt-3">เพิ่มผู้ใช้ทีม ติ๊กสิทธิ์ Lead, Partner, Users, CMS และดูบัญชีพาร์ตเนอร์ที่เข้าสู่ระบบได้</p>
            <p className="mt-4 text-sm">
              ทีม {users.staff} · พาร์ตเนอร์ {users.partners} · ทั้งหมด {users.total}
            </p>
            <span className="kpi-button mt-5 inline-flex">เข้าจัดการผู้ใช้</span>
          </Link>
        ) : null}

        {hasModule(user, "cms") ? (
          <Link href="/crm/cms" className="crm-card no-underline">
            <p className="text-xs font-extrabold tracking-[.12em] text-[#0B6660]">04</p>
            <h2 className="mt-1 text-2xl font-extrabold">Content Management System</h2>
            <p className="mt-3">สร้างหน้าและบทความใหม่ จัดการสื่อ SEO เมนู และ redirect โดยไม่ต้องแก้โค้ด</p>
            <p className="mt-4 text-sm">
              หน้า {cms.pages} · บทความ {cms.insights} · ฉบับร่าง {cms.drafts} · สื่อ {cms.media}
            </p>
            <span className="kpi-button mt-5 inline-flex">เข้าจัดการเนื้อหา</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
