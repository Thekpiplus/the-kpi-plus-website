import { createStaffUser } from "@/lib/crm/user-admin";
import { ADMIN_MODULES, MODULE_LABEL, hasModule } from "@/lib/crm/modules";
import { requireUser } from "@/lib/crm/auth";
import { redirect } from "next/navigation";

export default async function NewUserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  if (user.role !== "owner" && !hasModule(user, "users")) redirect("/crm/users?error=forbidden");
  const { error } = await searchParams;

  return (
    <form action={createStaffUser} className="crm-card mx-auto max-w-xl">
      <h1 className="text-2xl font-extrabold text-[#3B3B3B]">เพิ่มผู้ใช้ทีม</h1>
      <p className="mt-2 text-sm">ติ๊กได้หนึ่ง หลาย หรือทุกฟังก์ชันที่ต้องการให้บัญชีนี้เข้าใช้</p>
      {error === "invalid" ? (
        <p className="mt-4 font-semibold text-[#063F3B]">กรอกข้อมูลให้ครบ และเลือกอย่างน้อย 1 ฟังก์ชัน</p>
      ) : null}
      {error === "exists" ? <p className="mt-4 font-semibold text-[#063F3B]">อีเมลหรือเบอร์นี้มีในระบบแล้ว</p> : null}

      <label className="mt-5 block text-sm font-bold">
        ชื่อ
        <input className="crm-field" name="name" required />
      </label>
      <label className="mt-4 block text-sm font-bold">
        อีเมล
        <input className="crm-field" type="email" name="email" required />
      </label>
      <label className="mt-4 block text-sm font-bold">
        เบอร์โทร
        <input className="crm-field" name="phone" required />
      </label>
      <label className="mt-4 block text-sm font-bold">
        รหัสผ่าน
        <input className="crm-field" type="password" name="password" minLength={4} required />
      </label>
      <fieldset className="mt-5">
        <legend className="text-sm font-bold">ฟังก์ชันที่เข้าได้</legend>
        <div className="mt-3 grid gap-2">
          {ADMIN_MODULES.map((module) => (
            <label key={module} className="flex items-start gap-3 text-sm">
              <input type="checkbox" name="modules" value={module} className="mt-1 h-4 w-4 accent-[#0B6660]" />
              <span>{MODULE_LABEL[module]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="mt-3 text-sm">บัญชีพาร์ตเนอร์สร้างตอนสมัครพาร์ตเนอร์ ไม่สร้างจากหน้านี้</p>
      <button className="kpi-button mt-6" type="submit">
        สร้างผู้ใช้
      </button>
    </form>
  );
}
