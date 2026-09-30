import Link from "next/link";
import { formatThaiDateTime, searchLoginLogs } from "@/lib/crm/queries";
import { roleLabel } from "@/lib/crm/roles";

const REASON_LABEL: Record<string, string> = {
  ok: "เข้าสู่ระบบสำเร็จ",
  device_verified: "ยืนยันอุปกรณ์แล้ว",
  invalid: "ข้อมูลไม่ถูกต้อง",
  invalid_input: "กรอกอีเมลหรือรหัสผ่านไม่ครบ",
  unknown_user: "ไม่พบบัญชี",
  bad_password: "รหัสผ่านไม่ถูกต้อง",
  locked: "บัญชีถูกล็อก",
  ip_rate_limit: "พยายามเข้าบ่อยเกิน",
};

export default async function LoginLogPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; success?: string }>;
}) {
  const params = await searchParams;
  const success = params.success === "yes" || params.success === "no" ? params.success : undefined;
  const logs = await searchLoginLogs({ email: params.email, success }).catch(() => []);

  return (
    <div className="crm-grid">
      <div>
        <h1 className="text-3xl font-extrabold text-[#3B3B3B]">Login Log</h1>
        <p className="mt-2">บันทึกการเข้าสู่ระบบทุกครั้ง ค้นด้วยอีเมลเพื่อดูการเข้าใช้บัญชี demo หรือบัญชีทีมแต่ละครั้ง</p>
      </div>

      <form className="crm-card grid gap-3 md:grid-cols-3" method="get">
        <label className="text-sm font-bold">
          อีเมล
          <input className="crm-field" name="email" type="search" defaultValue={params.email} placeholder="เช่น demo@ หรือ isara@" />
        </label>
        <label className="text-sm font-bold">
          ผลลัพธ์
          <select className="crm-select" name="success" defaultValue={success ?? ""}>
            <option value="">ทั้งหมด</option>
            <option value="yes">สำเร็จ</option>
            <option value="no">ไม่สำเร็จ</option>
          </select>
        </label>
        <button className="kpi-button self-end" type="submit">
          ค้นหา
        </button>
      </form>

      <section className="crm-card">
        <p className="text-sm">{logs.length} รายการล่าสุด</p>
        {logs.length === 0 ? <p className="mt-3">ยังไม่มีบันทึกในเงื่อนไขนี้</p> : null}
        <ul className="mt-3 grid gap-3">
          {logs.map((item) => (
            <li key={item.id} className="rounded-xl border border-[#E3E8EB] p-3">
              <p className="font-semibold text-[#3B3B3B]">
                {item.userName || "ไม่ทราบชื่อ"} · {item.email || "ไม่มีอีเมล"}
              </p>
              <p className="mt-1 text-sm">
                บทบาท {item.role ? roleLabel(item.role) : "—"} · ร้าน {item.shop || "—"} · IP {item.ip} ·{" "}
                {formatThaiDateTime(item.createdAt)}
              </p>
              <p className="text-sm">
                {item.success ? "สำเร็จ" : "ไม่สำเร็จ"} · {REASON_LABEL[item.reason] ?? item.reason}
                {item.email ? (
                  <>
                    {" · "}
                    <Link href={`/crm/users/logs?email=${encodeURIComponent(item.email)}`} className="font-semibold text-[#0B6660]">
                      ดูเฉพาะอีเมลนี้
                    </Link>
                  </>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
