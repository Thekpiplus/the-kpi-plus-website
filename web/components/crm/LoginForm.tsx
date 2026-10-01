const ERRORS: Record<string, string> = {
  invalid: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  locked: "พยายามผิดหลายครั้ง บัญชีถูกล็อกชั่วคราว",
  rate_limited: "พยายามบ่อยเกินไป ลองใหม่ภายหลัง",
};

export function LoginForm({ error }: { error?: string }) {
  return (
    <form action="/api/crm/login" method="post" className="crm-card mx-auto mt-16 max-w-md">
      <img
        src="/brand/KPIPlus_Horizontal_FullColor.png"
        alt="The KPI Plus"
        width={180}
        height={40}
        style={{ height: 40, width: "auto" }}
      />
      <h1 className="mt-5 text-2xl font-extrabold text-[#3B3B3B]">เข้าสู่ระบบแอดมิน</h1>
      <p className="mt-2 text-sm">ใช้บัญชีอีเมลเพื่อเข้า CRM และ Partner Management</p>
      <label className="mt-5 block text-sm font-bold text-[#3B3B3B]">
        อีเมล
        <input className="crm-field" type="email" name="email" autoComplete="username" required />
      </label>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        รหัสผ่าน
        <input className="crm-field" type="password" name="password" autoComplete="current-password" required />
      </label>
      {error ? <p className="mt-3 text-sm font-semibold text-[#0B1F33]">{ERRORS[error] ?? ERRORS.invalid}</p> : null}
      <button className="kpi-button mt-6" type="submit">
        เข้าสู่ระบบ
      </button>
    </form>
  );
}
