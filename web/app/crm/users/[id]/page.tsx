import Link from "next/link";
import { notFound } from "next/navigation";
import { UsersPageChrome } from "@/components/crm/users/UsersPageChrome";
import { UserDetailDangerZone } from "@/components/crm/users/UserDetailDangerZone";
import { PendingSubmitButton } from "@/components/crm/ui/PendingSubmitButton";
import { RoleBadge } from "@/components/crm/ui/RoleBadge";
import { StatusBadge } from "@/components/crm/ui/StatusBadge";
import { currentUser } from "@/lib/crm/auth";
import { formatThaiDateTime, lastLoginAtByUsers, userById } from "@/lib/crm/queries";
import {
  assignableInternalRoles,
  isFullAccessRole,
  isPartnerRoleValue,
  normalizeRole,
  ROLE_LABEL,
} from "@/lib/crm/roles";
import { ADMIN_MODULES, MODULE_LABEL, canManageUsers, inferredModules } from "@/lib/crm/modules";
import { unlockStaffUser, updateStaffUser } from "@/lib/crm/user-admin";

export default async function UserDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;
  const [user, me] = await Promise.all([userById(id), currentUser()]);
  if (!user) notFound();

  const canEdit = canManageUsers(me);
  const locked = Boolean(user.lockedUntil && user.lockedUntil > new Date());
  const selected = inferredModules(user);
  const normalized = normalizeRole(user.role);
  const roles = me ? assignableInternalRoles(me.role) : [];
  const roleOptions = roles.includes(normalized as (typeof roles)[number])
    ? roles
    : normalized !== "partner"
      ? [normalized as (typeof roles)[number], ...roles.filter((role) => role !== normalized)]
      : roles;

  const lastLoginMap = await lastLoginAtByUsers([{ id: user.id, email: user.email }]).catch(
    () => new Map<string, Date>(),
  );
  const lastLoginAt = lastLoginMap.get(user.id) ?? null;
  const lastLogin = lastLoginAt ? formatThaiDateTime(lastLoginAt) : "ยังไม่เคยเข้าใช้";

  return (
    <UsersPageChrome
      title={user.name}
      description="รายละเอียดบัญชี บทบาท และสิทธิ์โมดูล"
      actions={
        <Link href="/crm/users" className="crm-users-secondary">
          ← รายชื่อผู้ใช้
        </Link>
      }
    >
      {saved === "1" ? (
        <p className="kpi-users-alert is-ok" role="status" aria-live="polite">
          บันทึกข้อมูลผู้ใช้แล้ว
        </p>
      ) : null}
      {error === "invalid" ? (
        <p className="kpi-users-alert is-warn" role="status" aria-live="polite">
          ข้อมูลไม่ครบ ชื่อผู้ใช้ไม่ถูกต้อง หรือบทบาทไม่ถูกต้อง
        </p>
      ) : null}
      {error === "exists" ? (
        <p className="kpi-users-alert is-warn" role="status" aria-live="polite">
          อีเมล ชื่อผู้ใช้ หรือเบอร์นี้มีในระบบแล้ว
        </p>
      ) : null}
      {error === "last_owner" ? (
        <p className="kpi-users-alert is-warn" role="status" aria-live="polite">
          ต้องเหลือ Superadmin อย่างน้อย 1 คน
        </p>
      ) : null}
      {error === "self_role" ? (
        <p className="kpi-users-alert is-warn" role="status" aria-live="polite">
          เปลี่ยนบทบาทของตัวเองเป็นอย่างอื่นไม่ได้
        </p>
      ) : null}
      {error === "partner" ? (
        <p className="kpi-users-alert is-warn" role="status" aria-live="polite">
          บัญชี Partners จัดการจาก Partner Management
        </p>
      ) : null}
      {error === "forbidden" ? (
        <p className="kpi-users-alert is-warn" role="status" aria-live="polite">
          ไม่มีสิทธิ์เปลี่ยนบทบาทนี้
        </p>
      ) : null}

      <section className="kpi-users-summary" aria-label="สรุปบัญชี">
        <div className="kpi-users-stat is-static" role="group">
          <span className="kpi-users-stat-label">บทบาท</span>
          <strong className="kpi-users-stat-value is-compact">
            <RoleBadge role={user.role} />
          </strong>
          <span className="kpi-users-stat-hint">{ROLE_LABEL[normalized]}</span>
        </div>
        <div className={`kpi-users-stat is-locked is-static${locked ? " has-value" : ""}`} role="group">
          <span className="kpi-users-stat-label">สถานะบัญชี</span>
          <strong className="kpi-users-stat-value is-compact">
            {locked ? <StatusBadge label="ถูกล็อก" tone="danger" /> : <StatusBadge label="ใช้งานได้" tone="success" />}
          </strong>
          <span className="kpi-users-stat-hint">{locked ? "ลองรหัสผิดหลายครั้ง" : "พร้อมใช้งาน"}</span>
        </div>
        <div className="kpi-users-stat is-static" role="group">
          <span className="kpi-users-stat-label">ใช้งานล่าสุด</span>
          <strong className="kpi-users-stat-value is-text">{lastLogin}</strong>
          <span className="kpi-users-stat-hint">
            <Link href={`/crm/users/logs?email=${encodeURIComponent(user.email)}`}>ดู Login Log</Link>
          </span>
        </div>
      </section>

      <section className="kpi-users-panel" aria-labelledby="kpi-user-detail-heading">
        <div className="kpi-users-panel-head">
          <h2 id="kpi-user-detail-heading">{canEdit ? "แก้ไขข้อมูลผู้ใช้" : "ข้อมูลผู้ใช้"}</h2>
          <p>
            {user.email}
            {user.username ? ` · @${user.username}` : ""}
          </p>
        </div>

        {canEdit ? (
          <>
            <form action={updateStaffUser} className="kpi-users-detail-form">
              <input type="hidden" name="userId" value={user.id} />
              <div className="kpi-users-detail-grid">
                <label className="kpi-users-detail-field">
                  ชื่อ
                  <input className="crm-field" name="name" defaultValue={user.name} required />
                </label>
                <label className="kpi-users-detail-field">
                  ชื่อผู้ใช้ (Username)
                  <input
                    className="crm-field"
                    name="username"
                    defaultValue={user.username ?? ""}
                    pattern="[a-zA-Z0-9._-]{3,32}"
                    autoComplete="username"
                    required
                  />
                </label>
                <label className="kpi-users-detail-field">
                  อีเมล
                  <input className="crm-field" type="email" name="email" defaultValue={user.email} required />
                </label>
                <label className="kpi-users-detail-field">
                  เบอร์โทร
                  <input className="crm-field" name="phone" defaultValue={user.phone} required />
                </label>
                {isPartnerRoleValue(user.role) ? (
                  <p className="kpi-users-detail-note kpi-users-detail-span">
                    บทบาท Partners เปลี่ยนจากหน้าอนุมัติพาร์ตเนอร์
                  </p>
                ) : (
                  <label className="kpi-users-detail-field kpi-users-detail-span">
                    บทบาท (User Role)
                    <select className="crm-select" name="role" defaultValue={normalized} required>
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABEL[role]}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="kpi-users-detail-field kpi-users-detail-span">
                  รหัสผ่านใหม่
                  <input
                    className="crm-field"
                    type="password"
                    name="password"
                    minLength={4}
                    placeholder="เว้นว่างถ้าไม่เปลี่ยน"
                    autoComplete="new-password"
                  />
                </label>
              </div>

              {!isPartnerRoleValue(user.role) ? (
                <fieldset className="kpi-users-detail-modules">
                  <legend>ฟังก์ชันที่เข้าได้</legend>
                  <p>
                    {isFullAccessRole(user.role)
                      ? "Superadmin / Admin เข้าได้ทุกฟังก์ชัน"
                      : "เลือกโมดูลที่ต้องการเปิดให้บัญชีนี้"}
                  </p>
                  <div className="kpi-users-detail-module-grid">
                    {ADMIN_MODULES.map((module) => (
                      <label key={module} className="kpi-users-detail-check">
                        <input
                          type="checkbox"
                          name="modules"
                          value={module}
                          defaultChecked={selected.includes(module)}
                        />
                        <span>{MODULE_LABEL[module]}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              <div className="kpi-users-detail-actions">
                <PendingSubmitButton className="kpi-button crm-users-primary" pendingLabel="กำลังบันทึก…">
                  บันทึกผู้ใช้
                </PendingSubmitButton>
              </div>
            </form>

            {locked ? (
              <form action={unlockStaffUser} className="kpi-users-detail-unlock">
                <input type="hidden" name="userId" value={user.id} />
                <PendingSubmitButton className="crm-users-secondary" pendingLabel="กำลังปลดล็อก…">
                  ปลดล็อกบัญชี
                </PendingSubmitButton>
              </form>
            ) : null}

            {!isPartnerRoleValue(user.role) && user.id !== me?.id ? (
              <UserDetailDangerZone userId={user.id} userName={user.name} />
            ) : null}
          </>
        ) : (
          <p className="kpi-users-detail-note">ผู้ที่มีสิทธิ Users Management เท่านั้นที่แก้ไขผู้ใช้ได้</p>
        )}
      </section>
    </UsersPageChrome>
  );
}
