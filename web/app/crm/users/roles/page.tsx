import Link from "next/link";
import { RolesCardGrid, type RoleCardItem } from "@/components/crm/users/RolesCardGrid";
import { RolesCreateNotice } from "@/components/crm/users/RolesCreateNotice";
import { UsersPageChrome } from "@/components/crm/users/UsersPageChrome";
import { currentUser } from "@/lib/crm/auth";
import { prisma } from "@/lib/crm/db";
import { ADMIN_MODULES, MODULE_LABEL, canManageUsers, type AdminModule } from "@/lib/crm/modules";
import { userCounts } from "@/lib/crm/queries";
import {
  FULL_ACCESS_ROLES,
  USER_ROLES,
  roleQueryValues,
  type UserRole,
} from "@/lib/crm/roles";

const ROLE_SUMMARY: Record<
  UserRole,
  { blurb: string; department: string; jobTitle: string; suggestedModules: AdminModule[] }
> = {
  superadmin: {
    blurb: "ผู้ดูแลสูงสุดของระบบแอดมิน",
    department: "IT / Systems",
    jobTitle: "Head of Systems",
    suggestedModules: [...ADMIN_MODULES],
  },
  admin: {
    blurb: "ผู้ดูแลระบบและตั้งค่าสิทธิ์ทีม",
    department: "Operations",
    jobTitle: "Admin",
    suggestedModules: [...ADMIN_MODULES],
  },
  user: {
    blurb: "ผู้ใช้ทั่วไปในทีมภายใน",
    department: "Operations",
    jobTitle: "Team Member",
    suggestedModules: ["leads", "cms"],
  },
  staff: {
    blurb: "พนักงานปฏิบัติการตามโมดูลที่เปิด",
    department: "Operations",
    jobTitle: "Operations Staff",
    suggestedModules: ["leads", "reservations", "cms"],
  },
  sales: {
    blurb: "ทีมขายและดูแลลีดลูกค้า",
    department: "Sales",
    jobTitle: "Sales Executive",
    suggestedModules: ["leads", "partners", "b2b"],
  },
  partner: {
    blurb: "บัญชีพาร์ตเนอร์ — ใช้พอร์ทัลพาร์ตเนอร์",
    department: "Partners",
    jobTitle: "Partner",
    suggestedModules: [],
  },
};

export default async function UserRolesPage() {
  const me = await currentUser();
  const canEdit = canManageUsers(me);
  const counts = await userCounts();

  const roleCounts = Object.fromEntries(
    await Promise.all(
      USER_ROLES.map(async (role) => {
        const values = roleQueryValues(role) ?? [role];
        const count = await prisma().user.count({ where: { role: { in: values } } });
        return [role, count] as const;
      }),
    ),
  ) as Record<UserRole, number>;

  const roleItems: RoleCardItem[] = USER_ROLES.map((role) => {
    const meta = ROLE_SUMMARY[role];
    const fullAccess = FULL_ACCESS_ROLES.includes(role);
    const modules = fullAccess ? [...ADMIN_MODULES] : meta.suggestedModules;
    return {
      role,
      blurb: meta.blurb,
      department: meta.department,
      jobTitle: meta.jobTitle,
      count: roleCounts[role] ?? 0,
      fullAccess,
      modules,
      moduleLabels: modules.map((module) => MODULE_LABEL[module]),
    };
  });

  return (
    <UsersPageChrome
      title="จัดการผู้ใช้งาน"
      description="กำหนดบทบาทและสิทธิ์การเข้าถึงโมดูล — แสดงบทบาทในระบบจริง พร้อมทางลัดไปมอบสิทธิ์รายบัญชี"
      actions={<RolesCreateNotice canEdit={Boolean(canEdit)} />}
    >
      <section className="kpi-users-summary" aria-label="สรุปผู้ใช้">
        <Link
          href="/crm/users"
          className="kpi-users-stat is-total"
          aria-label={`ผู้ใช้ทั้งหมด ${counts.total} รายการ`}
        >
          <span className="kpi-users-stat-label">ผู้ใช้ทั้งหมด</span>
          <strong className="kpi-users-stat-value">{counts.total}</strong>
          <span className="kpi-users-stat-hint">บัญชีในระบบ</span>
        </Link>
        <div className="kpi-users-stat is-static" role="group">
          <span className="kpi-users-stat-label">ทีมภายใน</span>
          <strong className="kpi-users-stat-value">{counts.staff}</strong>
          <span className="kpi-users-stat-hint">ไม่รวม Partners</span>
        </div>
        <Link
          href="/crm/users?role=partner"
          className={`kpi-users-stat is-partners`}
          aria-label={`Partners ${counts.partners} รายการ`}
        >
          <span className="kpi-users-stat-label">Partners</span>
          <strong className="kpi-users-stat-value">{counts.partners}</strong>
          <span className="kpi-users-stat-hint">เปิดรายการ Partners</span>
        </Link>
        <Link
          href="/crm/users?status=locked"
          className={`kpi-users-stat is-locked${counts.locked > 0 ? " has-value" : ""}`}
          aria-label={`บัญชีที่ถูกล็อก ${counts.locked} รายการ`}
        >
          <span className="kpi-users-stat-label">ถูกล็อก</span>
          <strong className="kpi-users-stat-value">{counts.locked}</strong>
          <span className="kpi-users-stat-hint">ทั้งระบบ</span>
        </Link>
      </section>

      <section className="kpi-users-panel kpi-roles-panel" aria-labelledby="crm-roles-cards-heading">
        <div className="kpi-users-panel-head">
          <h2 id="crm-roles-cards-heading">บทบาทและสิทธิ์</h2>
          <p>
            {USER_ROLES.length} บทบาทในระบบ · แผนก/ตำแหน่งเป็นป้ายอ้างอิง (ยังไม่มี schema CRUD บทบาท)
            {canEdit ? " · กดแก้ไขสิทธิ์เพื่อไปจัดการผู้ใช้ตามบทบาท" : ""}
          </p>
        </div>

        <RolesCardGrid items={roleItems} canEdit={Boolean(canEdit)} />

        <p className="kpi-roles-footnote">
          โมดูลบนการ์ดของ User / Staff / Sales เป็นแนวทางอ้างอิง — สิทธิ์จริงเก็บบนบัญชีใน{" "}
          <Link href="/crm/users">รายชื่อผู้ใช้</Link>
        </p>
      </section>
    </UsersPageChrome>
  );
}
