import { renameStage, retryFailedNotification } from "@/lib/crm/actions";
import { requireUser } from "@/lib/crm/auth";
import { notificationEmail, smtpConfigured } from "@/lib/crm/mail";
import { failedNotifications, pipelineData } from "@/lib/crm/queries";

export default async function SettingsPage() {
  const [user, stages, notifications] = await Promise.all([
    requireUser(),
    pipelineData(),
    failedNotifications(),
  ]);

  return (
    <div className="crm-grid">
      <h1 className="text-3xl font-extrabold text-[#3B3B3B]">ตั้งค่า</h1>
      <section className="crm-card">
        <h2 className="text-xl font-extrabold">บัญชีที่เข้าใช้อยู่</h2>
        <p className="mt-2">{user.name}</p>
        <p className="text-sm">{user.phone}</p>
        <p className="text-sm">{user.email}</p>
        <p className="mt-3">
          <a href="/crm/users" className="font-semibold text-[#0B6660]">
            ไป Users Management
          </a>
        </p>
      </section>
      <section className="crm-card">
        <h2 className="text-xl font-extrabold">การแจ้งเตือน</h2>
        <p className="mt-2 text-sm">อีเมลรับลีด: {notificationEmail() || "ยังไม่ตั้ง LEAD_NOTIFICATION_EMAIL"}</p>
        <p className="text-sm">SMTP: {smtpConfigured() ? "พร้อมส่ง" : "ยังไม่ตั้ง — ในโหมดพัฒนาจะบันทึกในคอนโซล"}</p>
      </section>
      <section className="crm-card">
        <h2 className="text-xl font-extrabold">ชื่อขั้น</h2>
        <ul className="mt-3 grid gap-4">
          {stages.map((stage) => (
            <li key={stage.id}>
              <form
                action={async (formData) => {
                  "use server";
                  await renameStage(
                    stage.id,
                    String(formData.get("nameTh") ?? ""),
                    String(formData.get("name") ?? ""),
                  );
                }}
                className="grid gap-2"
              >
                <input className="crm-field" name="nameTh" defaultValue={stage.nameTh} />
                <input className="crm-field" name="name" defaultValue={stage.name} />
                <button className="kpi-button" type="submit">
                  บันทึกชื่อขั้น
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
      <section className="crm-card">
        <h2 className="text-xl font-extrabold">การแจ้งเตือนที่ยังไม่สำเร็จ</h2>
        {notifications.length === 0 ? <p className="mt-2">ไม่มีรายการค้าง</p> : null}
        <ul className="mt-3 grid gap-3">
          {notifications.map((item) => (
            <li key={item.id}>
              <p>
                {item.lead.contactName} · {item.status} · {item.toEmail || "ไม่มีผู้รับ"}
              </p>
              <form
                action={async () => {
                  "use server";
                  await retryFailedNotification(item.id);
                }}
              >
                <button className="kpi-button mt-2" type="submit">
                  ส่งใหม่
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
