import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { StatusBadge } from "@/components/crm/ui/StatusBadge";
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

function initials(name: string, email: string) {
  const source = name.trim() || email.trim();
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default async function LoginLogPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; success?: string }>;
}) {
  const params = await searchParams;
  const success = params.success === "yes" || params.success === "no" ? params.success : undefined;
  const logs = await searchLoginLogs({ email: params.email, success }).catch(() => []);
  const okCount = logs.filter((item) => item.success).length;
  const failCount = logs.length - okCount;
  const filtered = Boolean(params.email?.trim() || success);
  const emailQuery = params.email?.trim() ?? "";

  const resultTabs = [
    { id: "", label: "ทั้งหมด", count: logs.length },
    { id: "yes", label: "สำเร็จ", count: success ? undefined : okCount },
    { id: "no", label: "ไม่สำเร็จ", count: success ? undefined : failCount },
  ] as const;

  function tabHref(id: string) {
    const query = new URLSearchParams();
    if (emailQuery) query.set("email", emailQuery);
    if (id) query.set("success", id);
    const value = query.toString();
    return value ? `/crm/users/logs?${value}` : "/crm/users/logs";
  }

  return (
    <div className="crm-logs">
      <PageHeader
        eyebrow="จัดการระบบ / ผู้ใช้งาน"
        title="บันทึกการเข้าใช้"
        description="ดูประวัติการเข้าสู่ระบบล่าสุด ค้นด้วยอีเมลเพื่อตรวจบัญชีทีม"
      />

      <section className="crm-dash-summary crm-logs-summary" aria-label="สรุป Login Log">
        <div className="crm-dash-stats" role="list">
          <div className="crm-dash-stat is-users is-static" role="listitem">
            <span className="crm-dash-stat-label">รายการที่แสดง</span>
            <strong className="crm-dash-stat-value">{logs.length}</strong>
            <span className="crm-dash-stat-hint">ตามตัวกรองปัจจุบัน</span>
          </div>
          <div className="crm-dash-stat is-today is-static" role="listitem">
            <span className="crm-dash-stat-label">เข้าสู่ระบบสำเร็จ</span>
            <strong className="crm-dash-stat-value">{okCount}</strong>
            <span className="crm-dash-stat-hint">ในผลลัพธ์</span>
          </div>
          <div className="crm-dash-stat is-overdue is-static" role="listitem">
            <span className="crm-dash-stat-label">ไม่สำเร็จ</span>
            <strong className="crm-dash-stat-value">{failCount}</strong>
            <span className="crm-dash-stat-hint">ในผลลัพธ์</span>
          </div>
        </div>
      </section>

      <section className="crm-logs-toolbar">
        <nav className="crm-logs-tabs" aria-label="กรองผลลัพธ์">
          {resultTabs.map((tab) => {
            const active = (success ?? "") === tab.id;
            return (
              <Link
                key={tab.id || "all"}
                href={tabHref(tab.id)}
                className={active ? "is-active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                {tab.label}
                {typeof tab.count === "number" ? <span>{tab.count}</span> : null}
              </Link>
            );
          })}
        </nav>

        <form className="crm-logs-search" method="get">
          {success ? <input type="hidden" name="success" value={success} /> : null}
          <label className="crm-logs-search-field">
            <span className="sr-only">ค้นหาอีเมล</span>
            <span aria-hidden="true">⌕</span>
            <input
              name="email"
              type="search"
              defaultValue={params.email}
              placeholder="ค้นหาอีเมล เช่น demo@ หรือ isara@"
            />
          </label>
          <button className="kpi-button" type="submit">
            ค้นหา
          </button>
          {filtered ? (
            <Link href="/crm/users/logs" className="crm-logs-clear">
              ล้างตัวกรอง
            </Link>
          ) : null}
        </form>
        {filtered ? (
          <div className="crm-filter-chips" aria-label="ตัวกรองที่ใช้งาน">
            {emailQuery ? <span className="crm-filter-chip">อีเมล: {emailQuery}</span> : null}
            {success === "yes" ? <span className="crm-filter-chip">ผลลัพธ์: สำเร็จ</span> : null}
            {success === "no" ? <span className="crm-filter-chip">ผลลัพธ์: ไม่สำเร็จ</span> : null}
            <Link href="/crm/users/logs" className="crm-filter-chip-clear">
              ล้างทั้งหมด
            </Link>
          </div>
        ) : null}
      </section>

      <section className="crm-logs-panel">
        <div className="crm-logs-panel-head">
          <div>
            <h2>ประวัติการเข้าใช้งาน</h2>
            <p>
              แสดง {logs.length} รายการล่าสุด
              {emailQuery ? ` · “${emailQuery}”` : ""}
              {success === "yes" ? " · สำเร็จ" : ""}
              {success === "no" ? " · ไม่สำเร็จ" : ""}
            </p>
          </div>
        </div>

        {logs.length === 0 ? (
          <EmptyState
            filtered={filtered}
            title={filtered ? "ไม่พบบันทึกตามเงื่อนไข" : "ยังไม่มีบันทึกการเข้าใช้งาน"}
            body={
              filtered
                ? "ลองเปลี่ยนอีเมลหรือตัวกรองผลลัพธ์ หรือล้างตัวกรองเพื่อดูรายการล่าสุด"
                : "เมื่อมีผู้ใช้เข้าสู่ระบบ บันทึกจะแสดงที่นี่"
            }
            action={
              filtered ? (
                <Link href="/crm/users/logs" className="kpi-button">
                  ดูทั้งหมด
                </Link>
              ) : null
            }
          />
        ) : (
          <div className="crm-logs-table-wrap">
            <table className="crm-logs-table">
              <thead>
                <tr>
                  <th scope="col">เวลา</th>
                  <th scope="col">ผู้ใช้</th>
                  <th scope="col">อีเมล</th>
                  <th scope="col">บทบาท</th>
                  <th scope="col">ผลลัพธ์</th>
                  <th scope="col">IP</th>
                  <th scope="col">รายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((item) => {
                  const reason = REASON_LABEL[item.reason] ?? item.reason;
                  return (
                    <tr key={item.id} className={item.success ? "is-ok" : "is-fail"}>
                      <td data-label="เวลา">
                        <span className="crm-logs-time">{formatThaiDateTime(item.createdAt)}</span>
                      </td>
                      <td data-label="ผู้ใช้">
                        <div className="crm-logs-user">
                          <span className={`crm-logs-avatar${item.success ? "" : " is-fail"}`} aria-hidden="true">
                            {initials(item.userName, item.email)}
                          </span>
                          <div>
                            <strong>{item.userName || "ไม่ทราบชื่อ"}</strong>
                            {item.shop && item.shop !== "—" ? <em>{item.shop}</em> : null}
                          </div>
                        </div>
                      </td>
                      <td data-label="อีเมล">
                        {item.email ? (
                          <Link
                            href={`/crm/users/logs?email=${encodeURIComponent(item.email)}${
                              success ? `&success=${success}` : ""
                            }`}
                            className="crm-logs-email"
                            title="ดูเฉพาะอีเมลนี้"
                          >
                            {item.email}
                          </Link>
                        ) : (
                          <span className="crm-logs-muted">ไม่มีอีเมล</span>
                        )}
                      </td>
                      <td data-label="บทบาท">
                        <span className="crm-logs-role">{item.role ? roleLabel(item.role) : "—"}</span>
                      </td>
                      <td data-label="ผลลัพธ์">
                        {item.success ? (
                          <StatusBadge label="สำเร็จ" tone="success" />
                        ) : (
                          <StatusBadge label="ไม่สำเร็จ" tone="danger" />
                        )}
                      </td>
                      <td data-label="IP">
                        <code className="crm-logs-ip">{item.ip || "—"}</code>
                      </td>
                      <td data-label="รายละเอียด">
                        <span className="crm-logs-reason" title={reason}>
                          {reason}
                        </span>
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
}
