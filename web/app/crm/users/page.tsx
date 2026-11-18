import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import {
  UsersCreateOpenButton,
  UsersWorkspace,
  type WorkspaceUser,
} from "@/components/crm/users/UsersWorkspace";
import { UsersDirectory, type UsersDirectoryItem } from "@/components/crm/users/UsersDirectory";
import { UsersPageChrome } from "@/components/crm/users/UsersPageChrome";
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
  const filtered = Boolean(q || role || status);
  const formError = params.error === "invalid" || params.error === "exists" ? params.error : undefined;
  const autoOpenCreate = canEdit && (params.new === "1" || Boolean(formError));
  const passwordError = params.error === "password";
  const passwordUserId = params.pwd === "1" ? params.user : undefined;

  const directoryUsers: UsersDirectoryItem[] = users.map((user) => {
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
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
      role: user.role,
      normalizedRole: normalized,
      selectedModules: inferredModules(user),
      isPartner: isPartnerRoleValue(user.role),
      isFullAccess: isFullAccessRole(user.role),
      canDelete,
      locked: Boolean(user.lockedUntil && user.lockedUntil.getTime() > now),
      lastLoginLabel: user.lastLoginAt ? formatThaiDateTime(user.lastLoginAt) : "ยังไม่เคยเข้าใช้",
      roleOptions,
    };
  });

  const passwordTargetUser = passwordUserId
    ? directoryUsers.find((user) => user.id === passwordUserId)
    : undefined;
  const passwordTarget: WorkspaceUser | undefined = passwordTargetUser
    ? {
        id: passwordTargetUser.id,
        name: passwordTargetUser.name,
        email: passwordTargetUser.email,
        username: passwordTargetUser.username,
        phone: passwordTargetUser.phone,
        role: passwordTargetUser.normalizedRole,
        selectedModules: passwordTargetUser.selectedModules,
        isPartner: passwordTargetUser.isPartner,
        isFullAccess: passwordTargetUser.isFullAccess,
        canDelete: passwordTargetUser.canDelete,
        roleOptions: passwordTargetUser.roleOptions,
      }
    : undefined;

  const content = (
    <UsersPageChrome
      title="จัดการผู้ใช้งาน"
      description="ดูรายชื่อ เพิ่มบัญชี และจัดการบทบาทกับสถานะการเข้าใช้งาน"
      actions={
        canEdit ? (
          <UsersCreateOpenButton className="kpi-button crm-users-primary">เพิ่มผู้ใช้งาน</UsersCreateOpenButton>
        ) : undefined
      }
    >
      {params.error === "forbidden" ? (
        <p className="kpi-users-alert is-warn" role="status" aria-live="polite">
          ต้องมีสิทธิ Users Management จึงจะเพิ่มหรือแก้ไขผู้ใช้ได้
        </p>
      ) : null}
      {params.deleted === "1" ? (
        <p className="kpi-users-alert is-ok" role="status" aria-live="polite">
          ลบผู้ใช้แล้ว
        </p>
      ) : null}
      {params.created === "1" ? (
        <p className="kpi-users-alert is-ok" role="status" aria-live="polite">
          สร้างผู้ใช้ใหม่แล้ว
        </p>
      ) : null}
      {params.saved === "1" ? (
        <p className="kpi-users-alert is-ok" role="status" aria-live="polite">
          บันทึกข้อมูลผู้ใช้แล้ว
        </p>
      ) : null}
      {params.pwdChanged === "1" ? (
        <p className="kpi-users-alert is-ok" role="status" aria-live="polite">
          เปลี่ยนรหัสผ่านแล้ว
        </p>
      ) : null}

      <section className="kpi-users-summary" aria-label="สรุปผู้ใช้">
        <Link
          href="/crm/users"
          className={`kpi-users-stat${!role && !status && !q ? " is-selected" : ""}`}
          aria-current={!role && !status && !q ? "page" : undefined}
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
          className={`kpi-users-stat is-partners${role === "partner" ? " is-selected" : ""}`}
          aria-current={role === "partner" ? "page" : undefined}
        >
          <span className="kpi-users-stat-label">Partners</span>
          <strong className="kpi-users-stat-value">{counts.partners}</strong>
          <span className="kpi-users-stat-hint">เปิดรายการ Partners</span>
        </Link>
        <Link
          href="/crm/users?status=locked"
          className={`kpi-users-stat is-locked${counts.locked > 0 ? " has-value" : ""}${status === "locked" ? " is-selected" : ""}`}
          aria-current={status === "locked" ? "page" : undefined}
          aria-label={`บัญชีที่ถูกล็อก ${counts.locked} รายการ`}
        >
          <span className="kpi-users-stat-label">ถูกล็อก</span>
          <strong className="kpi-users-stat-value">{counts.locked}</strong>
          <span className="kpi-users-stat-hint">ทั้งระบบ</span>
        </Link>
      </section>

      <section className="kpi-users-panel" aria-labelledby="crm-users-list-heading">
        <div className="kpi-users-panel-head">
          <h2 id="crm-users-list-heading">รายชื่อผู้ใช้</h2>
          <p>
            แสดง {users.length} รายการ
            {role ? ` · ${ROLE_LABEL[normalizeRole(role)] ?? role}` : ""}
            {status === "locked" ? " · ถูกล็อก" : ""}
            {status === "active" ? " · ใช้งานได้" : ""}
            {q ? ` · “${q}”` : ""}
          </p>
        </div>

        <form className="kpi-users-toolbar" method="get" action="/crm/users" role="search">
          <div className="kpi-users-toolbar-main">
            <label className="kpi-users-search-field">
              <span className="kpi-users-search-label">ค้นหา</span>
              <span className="kpi-users-search-icon" aria-hidden="true">
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

            <label className="kpi-users-filter">
              <span className="kpi-users-filter-label">บทบาท</span>
              <select className="crm-select kpi-users-filter-select" name="role" defaultValue={role}>
                <option value="">ทั้งหมด</option>
                {USER_ROLES.map((key) => (
                  <option key={key} value={key}>
                    {ROLE_LABEL[key]}
                  </option>
                ))}
              </select>
            </label>

            <label className="kpi-users-filter">
              <span className="kpi-users-filter-label">สถานะ</span>
              <select className="crm-select kpi-users-filter-select" name="status" defaultValue={status}>
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
            <div className="kpi-users-filter-chips">
              {q ? <span className="kpi-users-chip">ค้นหา: {q}</span> : null}
              {role ? <span className="kpi-users-chip">บทบาท: {ROLE_LABEL[normalizeRole(role)]}</span> : null}
              {status === "locked" ? <span className="kpi-users-chip">สถานะ: ถูกล็อก</span> : null}
              {status === "active" ? <span className="kpi-users-chip">สถานะ: ใช้งานได้</span> : null}
              <Link href="/crm/users" className="crm-users-clear">
                ล้างตัวกรอง
              </Link>
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
                <UsersCreateOpenButton className="kpi-button crm-users-primary">เพิ่มผู้ใช้งาน</UsersCreateOpenButton>
              ) : null
            }
          />
        ) : (
          <UsersDirectory users={directoryUsers} canEdit={canEdit} />
        )}
      </section>
    </UsersPageChrome>
  );

  if (!canEdit) return content;

  return (
    <UsersWorkspace
      roles={roles}
      createError={formError}
      autoOpenCreate={autoOpenCreate}
      passwordTarget={passwordError && passwordTarget ? passwordTarget : undefined}
      passwordError={passwordError}
    >
      {content}
    </UsersWorkspace>
  );
}
