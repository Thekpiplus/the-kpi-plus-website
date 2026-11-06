import Link from "next/link";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { RolesReferenceFilter, type RoleReferenceItem } from "@/components/crm/ui/RolesReferenceFilter";
import { currentUser } from "@/lib/crm/auth";
import { prisma } from "@/lib/crm/db";
import { ADMIN_MODULES, MODULE_LABEL, canManageUsers } from "@/lib/crm/modules";
import {
  FULL_ACCESS_ROLES,
  ROLE_LABEL,
  USER_ROLES,
  roleQueryValues,
  type UserRole,
} from "@/lib/crm/roles";

const ROLE_SUMMARY: Record<UserRole, { blurb: string; access: string }> = {
  superadmin: {
    blurb: "ผู้ดูแลสูงสุดของระบบแอดมิน",
    access: "เข้าได้ทุกโมดูลโดยอัตโนมัติ และกำหนดบทบาทภายในได้ครบ",
  },
  admin: {
    blurb: "ผู้ดูแลระบบ",
    access: "เข้าได้ทุกโมดูลโดยอัตโนมัติ กำหนดบทบาทได้ยกเว้น Superadmin",
  },
  user: {
    blurb: "ผู้ใช้ทั่วไปในทีม",
    access: "เข้าได้เฉพาะโมดูลที่เปิดให้บัญชีนี้ใน Users Management",
  },
  staff: {
    blurb: "พนักงานปฏิบัติการ",
    access: "เข้าได้เฉพาะโมดูลที่เปิดให้บัญชีนี้ใน Users Management",
  },
  sales: {
    blurb: "ทีมขาย",
    access: "เข้าได้เฉพาะโมดูลที่เปิดให้บัญชีนี้ใน Users Management",
  },
  partner: {
    blurb: "บัญชีพาร์ตเนอร์",
    access: "ใช้พอร์ทัลพาร์ตเนอร์ — ไม่ใช้สิทธิโมดูลแอดมินรายบัญชี",
  },
};

/** How each role obtains module access — mirrors lib/crm/modules.ts (no invented rules). */
function moduleAccessLabel(role: UserRole, _module: (typeof ADMIN_MODULES)[number]) {
  if (role === "partner") return { kind: "none" as const, label: "ไม่ใช้" };
  if (FULL_ACCESS_ROLES.includes(role)) return { kind: "auto" as const, label: "อัตโนมัติ" };
  return { kind: "account" as const, label: "ต่อบัญชี" };
}

export default async function UserRolesPage() {
  const me = await currentUser();
  const canEdit = canManageUsers(me);

  const roleCounts = Object.fromEntries(
    await Promise.all(
      USER_ROLES.map(async (role) => {
        const values = roleQueryValues(role) ?? [role];
        const count = await prisma().user.count({ where: { role: { in: values } } });
        return [role, count] as const;
      }),
    ),
  ) as Record<UserRole, number>;

  const roleItems: RoleReferenceItem[] = USER_ROLES.map((role) => {
    const meta = ROLE_SUMMARY[role];
    const label = ROLE_LABEL[role];
    return {
      role,
      blurb: meta.blurb,
      access: meta.access,
      count: roleCounts[role] ?? 0,
      fullAccess: FULL_ACCESS_ROLES.includes(role),
      system: true,
      searchText: `${role} ${label} ${meta.blurb} ${meta.access}`.toLowerCase(),
    };
  });

  return (
    <div className="crm-users crm-users-roles-page">
      <PageHeader
        eyebrow="จัดการระบบ · ผู้ใช้งาน"
        title="บทบาทและสิทธิ์"
        description="อ้างอิงบทบาทในระบบและวิธีได้สิทธิ์โมดูลตามโมเดลจริง — การมอบสิทธิ์ทำที่รายชื่อผู้ใช้ ไม่ใช่เมทริกซ์แผนก/ตำแหน่งงาน"
        actions={
          canEdit ? (
            <div className="crm-users-actions">
              <Link href="/crm/users" className="crm-hero-btn crm-hero-btn-secondary">
                รายชื่อผู้ใช้
              </Link>
              <Link href="/crm/users?new=1" className="kpi-button crm-users-primary">
                เพิ่มผู้ใช้งาน
              </Link>
            </div>
          ) : undefined
        }
      />

      <section className="crm-users-roles-note" aria-label="วิธีคำนวณสิทธิ์">
        <h2>Effective permissions ในระบบนี้</h2>
        <ol className="crm-users-roles-steps">
          <li>
            <strong>บทบาท (User Role)</strong> บนบัญชี — Superadmin/Admin ได้ทุกโมดูลอัตโนมัติ
          </li>
          <li>
            <strong>โมดูลต่อบัญชี</strong> (ฟิลด์ <code>modules</code>) — ใช้กับ User / Staff / Sales
          </li>
          <li>
            สิทธิ์แผนกภายในโมดูล ops (เช่น B2B, Ads) อยู่ใน <strong>Settings ของโมดูลนั้น</strong> ไม่ใช่หน้านี้
          </li>
        </ol>
        <p className="crm-users-roles-limit">
          ระบบยัง<strong>ไม่มี</strong> API หรือ data model สำหรับกำหนดสิทธิ์ตาม Department หรือ Job Title ระดับทั้ง
          CRM — หน้านี้จึงเป็นหน้าอ้างอิงและทางลัดไปมอบสิทธิ์รายบัญชีเท่านั้น ไม่มีปุ่มบันทึกเมทริกซ์แผนก
        </p>
      </section>

      <section className="crm-users-panel" aria-labelledby="crm-roles-list-heading">
        <div className="crm-users-panel-head">
          <div>
            <h2 id="crm-roles-list-heading">บทบาทในระบบ</h2>
            <p>
              เป็น system roles ที่กำหนดในโค้ด ({USER_ROLES.length} บทบาท) — ไม่มี API สร้าง/ลบบทบาทใหม่
            </p>
          </div>
        </div>
        <RolesReferenceFilter items={roleItems} />
      </section>

      <section className="crm-users-panel" aria-labelledby="crm-roles-matrix-heading">
        <div className="crm-users-panel-head">
          <div>
            <h2 id="crm-roles-matrix-heading">เมทริกซ์สิทธิ์โมดูล (อ่านอย่างเดียว)</h2>
            <p>
              สรุปจาก <code>lib/crm/modules.ts</code> — ไม่ใช่ฟอร์มแก้ไข และไม่บันทึกค่าจากตารางนี้
            </p>
          </div>
        </div>

        <div className="crm-roles-matrix-wrap" tabIndex={0} aria-label="ตารางสิทธิ์โมดูลตามบทบาท เลื่อนแนวนอนได้ภายในตาราง">
          <table className="crm-roles-matrix">
            <caption className="sr-only">สิทธิ์เข้าถึงโมดูลแอดมินแยกตามบทบาท</caption>
            <thead>
              <tr>
                <th scope="col">โมดูล</th>
                {USER_ROLES.map((role) => (
                  <th key={role} scope="col">
                    {ROLE_LABEL[role]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ADMIN_MODULES.map((module) => (
                <tr key={module}>
                  <th scope="row">
                    <span className="crm-roles-matrix-module">{MODULE_LABEL[module]}</span>
                    <code>{module}</code>
                  </th>
                  {USER_ROLES.map((role) => {
                    const cell = moduleAccessLabel(role, module);
                    return (
                      <td key={`${module}-${role}`}>
                        <span className={`crm-roles-matrix-pill is-${cell.kind}`}>{cell.label}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="crm-roles-matrix-legend" aria-label="คำอธิบายสถานะในตาราง">
          <li>
            <span className="crm-roles-matrix-pill is-auto">อัตโนมัติ</span>
            ได้ทุกโมดูลจากบทบาท Full Access
          </li>
          <li>
            <span className="crm-roles-matrix-pill is-account">ต่อบัญชี</span>
            เปิด/ปิดโมดูลตอนสร้างหรือแก้ไขผู้ใช้
          </li>
          <li>
            <span className="crm-roles-matrix-pill is-none">ไม่ใช้</span>
            ไม่เข้าโมดูลแอดมิน (พอร์ทัลพาร์ตเนอร์)
          </li>
        </ul>
      </section>

      <section className="crm-users-panel" aria-labelledby="crm-roles-assign-heading">
        <div className="crm-users-panel-head">
          <div>
            <h2 id="crm-roles-assign-heading">วิธีมอบหรือเปลี่ยนสิทธิ์</h2>
            <p>การบันทึกจริงทำผ่าน Users Management เท่านั้น</p>
          </div>
        </div>
        {canEdit ? (
          <div className="crm-roles-assign-actions">
            <Link href="/crm/users" className="kpi-button crm-users-primary">
              เปิดรายชื่อผู้ใช้เพื่อแก้ไขบทบาท/โมดูล
            </Link>
            <Link href="/crm/users?new=1" className="crm-hero-btn crm-hero-btn-secondary">
              เพิ่มผู้ใช้งาน
            </Link>
            <p className="crm-users-roles-hint">
              เลือกบัญชี → แก้ไข → ตั้ง Role และโมดูล → บันทึก (server action{" "}
              <code>updateStaffUser</code>)
            </p>
          </div>
        ) : (
          <p className="crm-users-roles-hint">
            คุณดูสรุปบทบาทได้ แต่ไม่มีสิทธิ์จัดการผู้ใช้ — ติดต่อ Superadmin หรือ Admin
          </p>
        )}
      </section>
    </div>
  );
}
