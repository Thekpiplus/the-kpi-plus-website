import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { NewUserModalProvider, NewUserOpenButton } from "@/components/crm/ui/NewUserModal";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { RoleBadge } from "@/components/crm/ui/RoleBadge";
import { StatusBadge } from "@/components/crm/ui/StatusBadge";
import { UserRowActions } from "@/components/crm/ui/UserRowActions";
import { currentUser } from "@/lib/crm/auth";
import { formatThaiDateTime, listUsers, userCounts } from "@/lib/crm/queries";
import {
  ROLE_LABEL,
  USER_ROLES,
  assignableInternalRoles,
  isFullAccessRole,
  isPartnerRoleValue,
  isSuperadminRole,
  normalizeRole,
  type InternalRole,
} from "@/lib/crm/roles";
import { canManageUsers, inferredModules } from "@/lib/crm/modules";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "KP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    role?: string;
    status?: string;
    error?: string;
    deleted?: string;
    new?: string;
    created?: string;
    saved?: string;
    pwd?: string;
    user?: string;
    pwdChanged?: string;
  }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const role = params.role?.trim() ?? "";
  const status = params.status === "locked" || params.status === "active" ? params.status : "";

  const [listed, me, counts] = await Promise.all([
    listUsers({ q: params.q, role: params.role }),
    currentUser(),
    userCounts(),
  ]);
  const now = Date.now();
  const users =
    status === "locked"
      ? listed.filter((user) => user.lockedUntil && user.lockedUntil.getTime() > now)
      : status === "active"
        ? listed.filter((user) => !(user.lockedUntil && user.lockedUntil.getTime() > now))
        : listed;

  const canEdit = canManageUsers(me);
  const roles = me ? assignableInternalRoles(me.role) : [];
  const lockedCount = users.filter((user) => user.lockedUntil && user.lockedUntil.getTime() > now).length;
  const filtered = Boolean(q || role || status);
  const formError = params.error === "invalid" || params.error === "exists" ? params.error : undefined;
  const autoOpen = canEdit && (params.new === "1" || Boolean(formError));
  const passwordError = params.error === "password";
  const passwordUserId = params.pwd === "1" ? params.user : undefined;

  const content = (
    <div className="crm-users">
      <PageHeader
        eyebrow="จัดการระบบ / ผู้ใช้งาน"
        title="จัดการผู้ใช้งาน"
        description="ดูรายชื่อ เพิ่มบัญชี และจัดการบทบาทกับสถานะการเข้าใช้งาน"
        actions={
          canEdit ? (
            <NewUserOpenButton className="kpi-button crm-users-primary">เพิ่มผู้ใช้</NewUserOpenButton>
          ) : undefined
        }
      />

      {params.error === "forbidden" ? (
        <p className="crm-users-alert is-warn" role="status">
          ต้องมีสิทธิ Users Management จึงจะเพิ่มหรือแก้ไขผู้ใช้ได้
        </p>
      ) : null}
      {params.deleted === "1" ? (
        <p className="crm-users-alert is-ok" role="status">
          ลบผู้ใช้แล้ว
        </p>
      ) : null}
      {params.created === "1" ? (
        <p className="crm-users-alert is-ok" role="status">
          สร้างผู้ใช้ใหม่แล้ว
        </p>
      ) : null}
      {params.saved === "1" ? (
        <p className="crm-users-alert is-ok" role="status">
          บันทึกข้อมูลผู้ใช้แล้ว
        </p>
      ) : null}
      {params.pwdChanged === "1" ? (
        <p className="crm-users-alert is-ok" role="status">
          เปลี่ยนรหัสผ่านแล้ว
        </p>
      ) : null}

      <section className="crm-users-stats" aria-label="สรุปผู้ใช้">
        <article className="crm-users-stat">
          <p>ผู้ใช้ทั้งหมด</p>
          <strong>{counts.total}</strong>
        </article>
        <article className="crm-users-stat is-team">
          <p>ทีมภายใน</p>
          <strong>{counts.staff}</strong>
        </article>
        <article className="crm-users-stat is-partner">
          <p>Partners</p>
          <strong>{counts.partners}</strong>
        </article>
        <article className="crm-users-stat is-lock" aria-label={`บัญชีที่ถูกล็อกในผลลัพธ์ ${lockedCount} รายการ`}>
          <p>ถูกล็อก (ในผลลัพธ์)</p>
          <strong>{lockedCount}</strong>
        </article>
      </section>

      <section className="crm-users-panel" aria-labelledby="crm-users-list-heading">
        <div className="crm-users-panel-head">
          <div>
            <h2 id="crm-users-list-heading">รายชื่อผู้ใช้</h2>
            <p>
              แสดง {users.length} รายการ
              {role ? ` · ${ROLE_LABEL[normalizeRole(role)] ?? role}` : ""}
              {status === "locked" ? " · ถูกล็อก" : ""}
              {status === "active" ? " · ใช้งานได้" : ""}
              {q ? ` · “${q}”` : ""}
            </p>
          </div>
        </div>

        <form className="crm-users-toolbar" method="get" action="/crm/users" role="search">
          <div className="crm-users-toolbar-main">
            <label className="crm-users-search-field">
              <span className="crm-users-search-label">ค้นหา</span>
              <span className="crm-users-search-icon" aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="ชื่อ อีเมล หรือ username"
                autoComplete="off"
              />
            </label>

            <label className="crm-users-filter">
              <span className="crm-users-filter-label">บทบาท</span>
              <select className="crm-select crm-users-filter-select" name="role" defaultValue={role}>
                <option value="">ทั้งหมด</option>
                {USER_ROLES.map((key) => (
                  <option key={key} value={key}>
                    {ROLE_LABEL[key]}
                  </option>
                ))}
              </select>
            </label>

            <label className="crm-users-filter">
              <span className="crm-users-filter-label">สถานะ</span>
              <select className="crm-select crm-users-filter-select" name="status" defaultValue={status}>
                <option value="">ทั้งหมด</option>
                <option value="active">ใช้งานได้</option>
                <option value="locked">ถูกล็อก</option>
              </select>
            </label>

            <button className="crm-users-secondary" type="submit">
              กรอง
            </button>
          </div>

          {filtered ? (
            <div className="crm-users-active-filters">
              <p className="crm-users-toolbar-label">ตัวกรองที่ใช้อยู่</p>
              <div className="crm-users-filter-chips">
                {q ? <span className="crm-filter-chip">ค้นหา: {q}</span> : null}
                {role ? <span className="crm-filter-chip">บทบาท: {ROLE_LABEL[normalizeRole(role)]}</span> : null}
                {status === "locked" ? <span className="crm-filter-chip">สถานะ: ถูกล็อก</span> : null}
                {status === "active" ? <span className="crm-filter-chip">สถานะ: ใช้งานได้</span> : null}
                <Link href="/crm/users" className="crm-users-clear">
                  ล้างตัวกรอง
                </Link>
              </div>
            </div>
          ) : null}
        </form>

        {users.length === 0 ? (
          <EmptyState
            filtered={filtered}
            title={filtered ? "ไม่พบผู้ใช้ตามเงื่อนไข" : "ยังไม่มีผู้ใช้"}
            body={
              filtered
                ? "ล้างตัวกรองเพื่อดูรายการทั้งหมด หรือเพิ่มผู้ใช้ใหม่หากยังไม่มีบัญชี"
                : "เพิ่มผู้ใช้ใหม่เพื่อเปิดสิทธิ์เข้าใช้งานระบบ"
            }
            action={
              filtered ? (
                <Link href="/crm/users" className="crm-users-secondary">
                  ล้างตัวกรอง
                </Link>
              ) : canEdit ? (
                <NewUserOpenButton className="kpi-button crm-users-primary">เพิ่มผู้ใช้</NewUserOpenButton>
              ) : null
            }
          />
        ) : (
          <div className="crm-users-table-wrap">
            <table className="crm-users-table">
              <thead>
                <tr>
                  <th scope="col">ชื่อผู้ใช้</th>
                  <th scope="col">อีเมล</th>
                  <th scope="col">บทบาท</th>
                  <th scope="col">สถานะบัญชี</th>
                  <th scope="col">ใช้งานล่าสุด</th>
                  <th scope="col">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const locked = Boolean(user.lockedUntil && user.lockedUntil.getTime() > now);
                  const normalized = normalizeRole(user.role);
                  const roleOptions: InternalRole[] = roles.includes(normalized as InternalRole)
                    ? roles
                    : normalized !== "partner"
                      ? [normalized as InternalRole, ...roles.filter((item) => item !== normalized)]
                      : roles;
                  const canDelete =
                    Boolean(me) &&
                    user.id !== me?.id &&
                    !isPartnerRoleValue(user.role) &&
                    !(isSuperadminRole(user.role) && me && !isSuperadminRole(me.role));
                  return (
                    <tr key={user.id} className={locked ? "is-locked" : undefined}>
                      <td data-label="ชื่อผู้ใช้">
                        <div className="crm-users-identity">
                          <span className="crm-users-avatar" aria-hidden="true">
                            {initials(user.name)}
                          </span>
                          <div className="crm-users-identity-copy">
                            <Link href={`/crm/users/${user.id}`} className="crm-users-name">
                              {user.name}
                            </Link>
                            {user.username ? <p className="crm-users-meta">@{user.username}</p> : null}
                            <div className="crm-users-mobile-badges" aria-hidden="true">
                              <RoleBadge role={user.role} />
                              {locked ? (
                                <StatusBadge label="ถูกล็อก" tone="danger" />
                              ) : (
                                <StatusBadge label="ใช้งานได้" tone="success" />
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="อีเมล">
                        <span className="crm-users-email">{user.email}</span>
                      </td>
                      <td data-label="บทบาท" className="crm-users-col-role">
                        <RoleBadge role={user.role} />
                      </td>
                      <td data-label="สถานะบัญชี" className="crm-users-col-status">
                        {locked ? (
                          <StatusBadge label="ถูกล็อก" tone="danger" />
                        ) : (
                          <StatusBadge label="ใช้งานได้" tone="success" />
                        )}
                      </td>
                      <td data-label="ใช้งานล่าสุด">
                        <span className="crm-users-login">
                          {user.lastLoginAt ? formatThaiDateTime(user.lastLoginAt) : "ยังไม่เคยเข้าใช้"}
                        </span>
                      </td>
                      <td data-label="จัดการ">
                        <UserRowActions
                          canEdit={canEdit}
                          roles={roleOptions}
                          passwordError={passwordError && passwordUserId === user.id}
                          autoPassword={passwordUserId === user.id}
                          user={{
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            username: user.username,
                            phone: user.phone,
                            role: normalized,
                            selectedModules: inferredModules(user),
                            isPartner: isPartnerRoleValue(user.role),
                            isFullAccess: isFullAccessRole(user.role),
                            canDelete,
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );

  if (!canEdit) return content;

  return (
    <NewUserModalProvider roles={roles} error={formError} autoOpen={autoOpen}>
      {content}
    </NewUserModalProvider>
  );
}
