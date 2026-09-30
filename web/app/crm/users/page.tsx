import Link from "next/link";
import { currentUser } from "@/lib/crm/auth";
import { listUsers } from "@/lib/crm/queries";
import { ROLE_LABEL, roleLabel } from "@/lib/crm/roles";
import { hasModule, moduleLabels } from "@/lib/crm/modules";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; error?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const [users, me] = await Promise.all([listUsers({ q: params.q, role: params.role }), currentUser()]);
  const canEdit = Boolean(me && (me.role === "owner" || hasModule(me, "users")));

  return (
    <div className="crm-grid">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-[#3B3B3B]">Users Management</h1>
          <p className="mt-2">ติ๊กฟังก์ชันที่แต่ละบัญชีเข้าได้: Lead, Partner, Users และ CMS</p>
        </div>
        {canEdit ? (
          <Link href="/crm/users/new" className="kpi-button">
            เพิ่มผู้ใช้
          </Link>
        ) : null}
      </div>

      {params.error === "forbidden" ? (
        <p className="font-semibold text-[#063F3B]">ต้องมีสิทธิ Users Management จึงจะเพิ่มหรือแก้ไขผู้ใช้ได้</p>
      ) : null}
      {params.deleted === "1" ? <p className="font-semibold text-[#063F3B]">ลบผู้ใช้แล้ว</p> : null}

      <form className="crm-card grid gap-3 md:grid-cols-3" method="get">
        <label className="text-sm font-bold">
          ค้นหา
          <input className="crm-field" name="q" defaultValue={params.q} placeholder="ชื่อ อีเมล เบอร์" />
        </label>
        <label className="text-sm font-bold">
          บทบาท
          <select className="crm-select" name="role" defaultValue={params.role ?? ""}>
            <option value="">ทั้งหมด</option>
            {Object.entries(ROLE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button className="kpi-button self-end" type="submit">
          ค้นหา
        </button>
      </form>

      <section className="crm-card">
        <p className="text-sm">{users.length} รายการ</p>
        <ul className="mt-3 grid gap-3">
          {users.map((user) => (
            <li key={user.id} className="rounded-xl border border-[#E3E8EB] p-3">
              <Link href={`/crm/users/${user.id}`} className="font-semibold text-[#0B6660]">
                {user.name}
              </Link>
              <p className="mt-1 text-sm">
                {roleLabel(user.role)}
                {moduleLabels(user).length ? ` · ${moduleLabels(user).join(" · ")}` : ""} · {user.email} · {user.phone || "ไม่มีเบอร์"}
                {user.lockedUntil && user.lockedUntil > new Date() ? " · ถูกล็อกอยู่" : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
