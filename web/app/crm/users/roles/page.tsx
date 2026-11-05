import Link from "next/link";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { StatusBadge } from "@/components/crm/ui/StatusBadge";
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

const ROLE_SUMMARY: Record<
  UserRole,
  { tone: "lime" | "info" | "success" | "warning" | "neutral"; blurb: string; access: string }
> = {
  superadmin: {
    tone: "lime",
    blurb: "ผู้ดูแลสูงสุดของระบบแอดมิน",
    access: "เข้าได้ทุกโมดูลโดยอัตโนมัติ และกำหนดบทบาทภายในได้ครบ",
  },
  admin: {
    tone: "info",
    blurb: "ผู้ดูแลระบบ",
    access: "เข้าได้ทุกโมดูลโดยอัตโนมัติ กำหนดบทบาทได้ยกเว้น Superadmin",
  },
  user: {
    tone: "neutral",
    blurb: "ผู้ใช้ทั่วไปในทีม",
    access: "เข้าได้เฉพาะโมดูลที่เปิดให้บัญชีนี้",
  },
  staff: {
    tone: "success",
    blurb: "พนักงานปฏิบัติการ",
    access: "เข้าได้เฉพาะโมดูลที่เปิดให้บัญชีนี้",
  },
  sales: {
    tone: "info",
    blurb: "ทีมขาย",
    access: "เข้าได้เฉพาะโมดูลที่เปิดให้บัญชีนี้",
  },
  partner: {
    tone: "warning",
    blurb: "บัญชีพาร์ตเนอร์",
    access: "ใช้พอร์ทัลพาร์ตเนอร์ ไม่ใช่สิทธิโมดูลแอดมินรายบัญชี",
  },
};

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

  return (
    <div className="crm-users crm-users-roles-page">
      <PageHeader
        eyebrow="Users"
        title="บทบาทและสิทธิ์"
        description="สรุปบทบาทในระบบและวิธีกำหนดสิทธิ์โมดูลตามโมเดลที่มีอยู่จริง ไม่มีการบันทึกสิทธิ์ตามแผนกหรือตำแหน่งงานในระบบนี้"
        actions={
          <div className="crm-users-actions">
            <Link href="/crm/users" className="crm-users-secondary">
              รายชื่อผู้ใช้
            </Link>
            {canEdit ? (
              <Link href="/crm/users?new=1" className="kpi-button">
                เพิ่มผู้ใช้
              </Link>
            ) : null}
          </div>
        }
      />

      <section className="crm-users-roles-note" aria-label="ขอบเขตระบบ">
        <h2>ขอบเขตสิทธิ์ปัจจุบัน</h2>
        <ul>
          <li>สิทธิ์แอดมินถูกกำหนดด้วย <strong>บทบาท (User Role)</strong> และ <strong>โมดูลต่อบัญชี</strong></li>
          <li>
            Superadmin / Admin ได้ทุกโมดูลอัตโนมัติ — บทบาทอื่นเลือกโมดูลได้ตอนแก้ไขผู้ใช้
          </li>
          <li>
            ระบบยัง<strong>ไม่มี</strong>การกำหนดสิทธิ์ตามแผนก (Department) หรือตำแหน่งงาน (Job Title)
            และไม่มี API สำหรับบันทึกเมทริกซ์แบบนั้น
          </li>
        </ul>
      </section>

      <section className="crm-users-role-grid" aria-label="บทบาทในระบบ">
        {USER_ROLES.map((role) => {
          const meta = ROLE_SUMMARY[role];
          const count = roleCounts[role] ?? 0;
          const fullAccess = FULL_ACCESS_ROLES.includes(role);
          return (
            <article key={role} className={`crm-users-role-card${fullAccess ? " is-full" : ""}`}>
              <div className="crm-users-role-card-top">
                <StatusBadge label={ROLE_LABEL[role]} tone={meta.tone} />
                <p className="crm-users-role-count">
                  <strong>{count}</strong>
                  <span>บัญชี</span>
                </p>
              </div>
              <h3>{meta.blurb}</h3>
              <p>{meta.access}</p>
              <Link href={`/crm/users?role=${encodeURIComponent(role)}`} className="crm-users-secondary">
                ดูผู้ใช้บทบาทนี้
              </Link>
            </article>
          );
        })}
      </section>

      <section className="crm-users-panel">
        <div className="crm-users-panel-head">
          <div>
            <h2>โมดูลแอดมินที่กำหนดได้</h2>
            <p>
              ใช้ตอนสร้างหรือแก้ไขบัญชี (ยกเว้น Partners และบัญชี Full Access) — ค่าจริงเก็บในฟิลด์ modules
              ของผู้ใช้
            </p>
          </div>
        </div>
        <ul className="crm-users-module-list">
          {ADMIN_MODULES.map((module) => (
            <li key={module}>
              <span>{MODULE_LABEL[module]}</span>
              <code>{module}</code>
            </li>
          ))}
        </ul>
        {canEdit ? (
          <p className="crm-users-roles-hint">
            ต้องการเปลี่ยนสิทธิ์ของบัญชีใดบัญชีหนึ่ง ให้ไปที่รายชื่อผู้ใช้ แล้วกดแก้ไขบัญชีนั้น
          </p>
        ) : (
          <p className="crm-users-roles-hint">คุณดูสรุปบทบาทได้ แต่ไม่มีสิทธิ์แก้ไขบัญชีผู้ใช้</p>
        )}
      </section>
    </div>
  );
}
