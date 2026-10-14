import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { NewUserModalProvider, NewUserOpenButton } from "@/components/crm/ui/NewUserModal";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { StatusBadge } from "@/components/crm/ui/StatusBadge";
import { UserRowActions } from "@/components/crm/ui/UserRowActions";
import { currentUser } from "@/lib/crm/auth";
import { formatThaiDateTime, listUsers, userCounts } from "@/lib/crm/queries";
import {
  ROLE_LABEL,
  assignableInternalRoles,
  isFullAccessRole,
  isPartnerRoleValue,
  isSuperadminRole,
  normalizeRole,
  roleLabel,
  type InternalRole,
} from "@/lib/crm/roles";
import { canManageUsers, inferredModules } from "@/lib/crm/modules";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "KP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function roleTone(role: string): "lime" | "info" | "success" | "warning" | "neutral" {
  const key = normalizeRole(role);
  if (key === "superadmin") return "lime";
  if (key === "admin") return "info";
  if (key === "staff") return "success";
  if (key === "partner") return "warning";
  return "neutral";
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    role?: string;
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
  const [users, me, counts] = await Promise.all([
    listUsers({ q: params.q, role: params.role }),
    currentUser(),
    userCounts(),
  ]);
  const canEdit = canManageUsers(me);
  const roles = me ? assignableInternalRoles(me.role) : [];
  const now = Date.now();
  const lockedCount = users.filter((user) => user.lockedUntil && user.lockedUntil.getTime() > now).length;
  const filtered = Boolean(params.q?.trim() || params.role);
  const formError = params.error === "invalid" || params.error === "exists" ? params.error : undefined;
  const autoOpen = canEdit && (params.new === "1" || Boolean(formError));
  const passwordError = params.error === "password";
  const passwordUserId = params.pwd === "1" ? params.user : undefined;
  const roleTabs = [
    { id: "", label: "ทั้งหมด", count: counts.total },
    { id: "superadmin", label: "Superadmin" },
    { id: "admin", label: "Admin" },
    { id: "user", label: "User" },
    { id: "staff", label: "Staff" },
    { id: "partner", label: "Partners", count: counts.partners },
  ];

  const content = (
    <div className="crm-users">
      <PageHeader
        eyebrow="Users"
        title="Users Management"
        description="จัดการบัญชีทีม สิทธิ์โมดูล และสถานะการเข้าใช้งานในที่เดียว"
        actions={
          <div className="crm-users-actions">
            <Link href="/crm/users/logs" className="crm-users-secondary">
              Login Log
            </Link>
            {canEdit ? (
              <NewUserOpenButton className="kpi-button">เพิ่มผู้ใช้</NewUserOpenButton>
            ) : null}
          </div>
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
        <article className="crm-users-stat is-lock">
          <p>ถูกล็อก (ในผลลัพธ์)</p>
          <strong>{lockedCount}</strong>
        </article>
      </section>

      <section className="crm-users-toolbar">
        <nav className="crm-users-roles" aria-label="กรองตามบทบาท">
          {roleTabs.map((tab) => {
            const active = (params.role ?? "") === tab.id;
            const href = tab.id
              ? `/crm/users?role=${encodeURIComponent(tab.id)}${params.q ? `&q=${encodeURIComponent(params.q)}` : ""}`
              : params.q
                ? `/crm/users?q=${encodeURIComponent(params.q)}`
                : "/crm/users";
            return (
              <Link key={tab.id || "all"} href={href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
                {tab.label}
                {typeof tab.count === "number" ? <span>{tab.count}</span> : null}
              </Link>
            );
          })}
        </nav>

        <form className="crm-users-search" method="get">
          {params.role ? <input type="hidden" name="role" value={params.role} /> : null}
          <label className="crm-users-search-field">
            <span className="sr-only">ค้นหาผู้ใช้</span>
            <span aria-hidden="true">⌕</span>
            <input name="q" defaultValue={params.q} placeholder="ค้นหาชื่อ ชื่อผู้ใช้ อีเมล หรือเบอร์" />
          </label>
          <button className="kpi-button" type="submit">
            ค้นหา
          </button>
          {filtered ? (
            <Link href="/crm/users" className="crm-users-clear">
              ล้างตัวกรอง
            </Link>
          ) : null}
        </form>
      </section>

      <section className="crm-users-panel">
        <div className="crm-users-panel-head">
          <div>
            <h2>รายชื่อผู้ใช้</h2>
            <p>
              แสดง {users.length} รายการ
              {params.role ? ` · ${ROLE_LABEL[normalizeRole(params.role)] ?? params.role}` : ""}
              {params.q?.trim() ? ` · “${params.q.trim()}”` : ""}
            </p>
          </div>
        </div>

        {users.length === 0 ? (
          <EmptyState
            title="ไม่พบผู้ใช้"
            body="ลองเปลี่ยนคำค้นหรือตัวกรองบทบาท"
            action={
              canEdit ? <NewUserOpenButton className="kpi-button">เพิ่มผู้ใช้</NewUserOpenButton> : null
            }
          />
        ) : (
          <div className="crm-users-table-wrap">
            <table className="crm-users-table">
              <thead>
                <tr>
                  <th scope="col">ชื่อ</th>
                  <th scope="col">อีเมล</th>
                  <th scope="col">บทบาท</th>
                  <th scope="col">สถานะ</th>
                  <th scope="col">เวลาเข้าใช้งาน</th>
                  <th scope="col">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const locked = Boolean(user.lockedUntil && user.lockedUntil.getTime() > now);
                  const normalized = normalizeRole(user.role);
                  const roleOptions: InternalRole[] = roles.includes(normalized as InternalRole)
                    ? roles
                    : normalized !== "partner"
                      ? [normalized as InternalRole, ...roles.filter((role) => role !== normalized)]
                      : roles;
                  const canDelete =
                    Boolean(me) &&
                    user.id !== me?.id &&
                    !isPartnerRoleValue(user.role) &&
                    !(isSuperadminRole(user.role) && me && !isSuperadminRole(me.role));
                  return (
                    <tr key={user.id}>
                      <td data-label="ชื่อ">
                        <div className="crm-users-identity">
                          <span className="crm-users-avatar" aria-hidden="true">
                            {initials(user.name)}
                          </span>
                          <div>
                            <Link href={`/crm/users/${user.id}`} className="crm-users-name">
                              {user.name}
                            </Link>
                            {user.username ? <p className="crm-users-meta">@{user.username}</p> : null}
                          </div>
                        </div>
                      </td>
                      <td data-label="อีเมล">
                        <span className="crm-users-email">{user.email}</span>
                      </td>
                      <td data-label="บทบาท">
                        <StatusBadge label={roleLabel(user.role)} tone={roleTone(user.role)} />
                      </td>
                      <td data-label="สถานะ">
                        {locked ? (
                          <StatusBadge label="ถูกล็อก" tone="danger" />
                        ) : (
                          <StatusBadge label="ใช้งานได้" tone="success" />
                        )}
                      </td>
                      <td data-label="เวลาเข้าใช้งาน">
                        <span className="crm-users-login">
                          {user.lastLoginAt ? formatThaiDateTime(user.lastLoginAt) : "ยังไม่เคยเข้าใช้"}
                        </span>
                      </td>
                      <td data-label="การดำเนินการ">
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
