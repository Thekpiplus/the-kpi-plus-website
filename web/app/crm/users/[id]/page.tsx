import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/crm/auth";
import { userById } from "@/lib/crm/queries";
import { roleLabel } from "@/lib/crm/roles";
import { ADMIN_MODULES, MODULE_LABEL, hasModule, inferredModules } from "@/lib/crm/modules";
import { deleteStaffUser, unlockStaffUser, updateStaffUser } from "@/lib/crm/user-admin";

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
  const canEdit = Boolean(me && (me.role === "owner" || hasModule(me, "users")));
  const locked = Boolean(user.lockedUntil && user.lockedUntil > new Date());
  const selected = inferredModules(user);

  return (
    <div className="crm-grid">
      <Link href="/crm/users" className="text-sm font-semibold text-[#0B6660]">
        ← ผู้ใช้ทั้งหมด
      </Link>
      <section className="crm-card mx-auto w-full max-w-xl">
        <p className="text-xs font-extrabold tracking-[.12em] text-[#0B6660]">{roleLabel(user.role)}</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#3B3B3B]">{user.name}</h1>
        <p className="mt-2 text-sm">{user.email}</p>
        <p className="mt-3">
          <Link href={`/crm/users/logs?email=${encodeURIComponent(user.email)}`} className="font-semibold text-[#0B6660]">
            ดู Login Log ของอีเมลนี้
          </Link>
        </p>
        {saved === "1" ? <p className="mt-4 font-semibold text-[#063F3B]">บันทึกแล้ว</p> : null}
        {error === "invalid" ? <p className="mt-4 font-semibold text-[#063F3B]">ข้อมูลไม่ครบหรือบทบาทไม่ถูกต้อง</p> : null}
        {error === "last_owner" ? <p className="mt-4 font-semibold text-[#063F3B]">ต้องเหลือเจ้าของระบบอย่างน้อย 1 คน</p> : null}
        {error === "self_role" ? <p className="mt-4 font-semibold text-[#063F3B]">เปลี่ยนบทบาทของตัวเองเป็นอย่างอื่นไม่ได้</p> : null}
        {error === "partner" ? <p className="mt-4 font-semibold text-[#063F3B]">บัญชีพาร์ตเนอร์จัดการจาก Partner Management</p> : null}
        {locked ? <p className="mt-4 font-semibold text-[#063F3B]">บัญชีนี้ถูกล็อกจากการลองรหัสผิดหลายครั้ง</p> : null}

        {canEdit ? (
          <>
            <form action={updateStaffUser} className="mt-6 grid gap-3">
              <input type="hidden" name="userId" value={user.id} />
              <label className="text-sm font-bold">
                ชื่อ
                <input className="crm-field" name="name" defaultValue={user.name} required />
              </label>
              <label className="text-sm font-bold">
                อีเมล
                <input className="crm-field" type="email" name="email" defaultValue={user.email} required />
              </label>
              <label className="text-sm font-bold">
                เบอร์โทร
                <input className="crm-field" name="phone" defaultValue={user.phone} required />
              </label>
              {user.role === "partner" ? (
                <p className="text-sm">บทบาทพาร์ตเนอร์เปลี่ยนจากหน้าอนุมัติพาร์ตเนอร์</p>
              ) : user.role === "owner" ? (
                <p className="text-sm">เจ้าของระบบเข้าได้ทุกฟังก์ชัน</p>
              ) : (
                <fieldset>
                  <legend className="text-sm font-bold">ฟังก์ชันที่เข้าได้</legend>
                  <div className="mt-2 grid gap-2">
                    {ADMIN_MODULES.map((module) => (
                      <label key={module} className="flex items-start gap-3 text-sm font-normal">
                        <input
                          type="checkbox"
                          name="modules"
                          value={module}
                          defaultChecked={selected.includes(module)}
                          className="mt-1 h-4 w-4 accent-[#0B6660]"
                        />
                        <span>{MODULE_LABEL[module]}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              <label className="text-sm font-bold">
                รหัสผ่านใหม่
                <input className="crm-field" type="password" name="password" minLength={4} placeholder="เว้นว่างถ้าไม่เปลี่ยน" />
              </label>
              <button className="kpi-button" type="submit">
                บันทึกผู้ใช้
              </button>
            </form>
            {locked ? (
              <form action={unlockStaffUser} className="mt-4">
                <input type="hidden" name="userId" value={user.id} />
                <button className="kpi-button" type="submit">
                  ปลดล็อกบัญชี
                </button>
              </form>
            ) : null}
            {user.role !== "partner" && user.id !== me?.id ? (
              <form action={deleteStaffUser} className="mt-6">
                <input type="hidden" name="userId" value={user.id} />
                <button className="kpi-button" type="submit">
                  ลบผู้ใช้ทีม
                </button>
              </form>
            ) : null}
          </>
        ) : (
          <p className="mt-6 text-sm">ผู้ที่มีสิทธิ Users Management เท่านั้นที่แก้ไขผู้ใช้ได้</p>
        )}
      </section>
    </div>
  );
}
