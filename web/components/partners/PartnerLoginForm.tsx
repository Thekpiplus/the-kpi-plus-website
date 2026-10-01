const ERRORS: Record<string, string> = {
  invalid: "อีเมลหรือรหัส 4 หลักไม่ถูกต้อง",
  locked: "พยายามผิดหลายครั้ง บัญชีถูกล็อกชั่วคราว",
  rate_limited: "พยายามบ่อยเกินไป ลองใหม่ภายหลัง",
};

export function PartnerLoginForm({ error, applied }: { error?: string; applied?: boolean }) {
  return (
    <form action="/api/partners/login" method="post" className="crm-card mx-auto mt-16 max-w-md">
      <img
        src="/brand/KPIPlus_Horizontal_FullColor.png"
        alt="The KPI Plus"
        width={180}
        height={40}
        style={{ height: 40, width: "auto" }}
      />
      <h1 className="mt-5 text-2xl font-extrabold text-[#3B3B3B]">เข้าสู่ Partner Portal</h1>
      <p className="mt-2 text-sm">ใช้อีเมลและรหัส 4 หลักที่ตั้งตอนสมัคร</p>
      {applied ? (
        <p className="mt-4 rounded-xl bg-[#F2F8E2] px-4 py-3 text-sm font-semibold text-[#0B1F33]">
          สมัครแล้ว เข้าสู่ระบบเพื่อคีย์ลีดได้ทันที
        </p>
      ) : null}
      <label className="mt-5 block text-sm font-bold text-[#3B3B3B]">
        อีเมล
        <input className="crm-field" type="email" name="email" autoComplete="username" required />
      </label>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        รหัส 4 หลัก
        <input
          className="crm-field"
          name="pin"
          inputMode="numeric"
          autoComplete="current-password"
          maxLength={4}
          pattern="\d{4}"
          required
        />
      </label>
      {error ? <p className="mt-3 text-sm font-semibold text-[#0B1F33]">{ERRORS[error] ?? ERRORS.invalid}</p> : null}
      <button className="kpi-button mt-6" type="submit">
        เข้าสู่ระบบ
      </button>
      <p className="mt-4 text-sm leading-7">
        ยังไม่มีบัญชี?{" "}
        <a href="/partner#apply" className="font-semibold text-[#0B6660]">
          สมัครเป็น Partner
        </a>
      </p>
    </form>
  );
}
