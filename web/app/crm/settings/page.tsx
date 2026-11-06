import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { OverviewHero } from "@/components/crm/ui/OverviewHero";
import { PendingSubmitButton } from "@/components/crm/ui/PendingSubmitButton";
import { SettingsHubFilter, type SettingsHubItem } from "@/components/crm/ui/SettingsHubFilter";
import { renameStage, retryFailedNotification } from "@/lib/crm/actions";
import { requireUser } from "@/lib/crm/auth";
import { notificationEmail, smtpConfigured } from "@/lib/crm/mail";
import {
  MODULE_LABEL,
  canManageUsers,
  hasModule,
  type AdminModule,
} from "@/lib/crm/modules";
import { failedNotifications, pipelineData } from "@/lib/crm/queries";
import { roleLabel } from "@/lib/crm/roles";

/** Module settings pages that exist and persist via real APIs. */
const MODULE_SETTINGS: Array<{
  module: AdminModule;
  href: string;
  title: string;
  body: string;
}> = [
  { module: "partners", href: "/crm/partners/settings", title: "Partner · กติกา", body: "กติกาค่าคอมมิชชันและรอบจ่าย" },
  { module: "b2b", href: "/crm/b2b/settings", title: "B2B · Settings", body: "สิทธิ์เข้าถึงตามแผนกในโมดูล B2B" },
  { module: "ads", href: "/crm/ads/settings", title: "Google Ads · Settings", body: "สิทธิ์เข้าถึงทีม Ads" },
  { module: "meta", href: "/crm/meta/settings", title: "Meta Ads · Settings", body: "สิทธิ์เข้าถึงทีม Meta" },
  { module: "seo", href: "/crm/seo/settings", title: "SEO · Settings", body: "สิทธิ์เข้าถึง Local Search" },
  { module: "website", href: "/crm/website/settings", title: "Website · Settings", body: "สิทธิ์เข้าถึง Website Ops" },
  { module: "conversion", href: "/crm/conversion/settings", title: "Direct Booking · Settings", body: "สิทธิ์เข้าถึง Conversion" },
  { module: "management", href: "/crm/management/settings", title: "Management · Settings", body: "สิทธิ์เข้าถึง Hotel Management" },
  { module: "systems", href: "/crm/systems/settings", title: "Systems · Settings", body: "สิทธิ์เข้าถึง Hotel Systems" },
  { module: "hotel_ai", href: "/crm/hotel-ai/settings", title: "Hotel AI · Settings", body: "สิทธิ์และบอร์ด Hotel AI" },
  { module: "training", href: "/crm/training/settings", title: "Training · Settings", body: "สิทธิ์และบอร์ดอบรม" },
  {
    module: "hotel_marketing",
    href: "/crm/hotel-marketing/settings",
    title: "Hotel Marketing · Settings",
    body: "สิทธิ์และบอร์ด editorial",
  },
  { module: "solutions", href: "/crm/solutions/settings", title: "Solutions · Settings", body: "ค่าเริ่มต้นและสิทธิ์ Solutions" },
  { module: "cms", href: "/crm/cms/globals", title: "CMS · ตั้งค่าเว็บ", body: "Globals ของเว็บไซต์สาธารณะ" },
];

export default async function SettingsPage() {
  const [user, stages, notifications] = await Promise.all([
    requireUser(),
    pipelineData(),
    failedNotifications(),
  ]);

  const manageUsers = canManageUsers(user);
  const notifyEmail = notificationEmail();
  const smtpReady = smtpConfigured();

  const hubItems: SettingsHubItem[] = [
    ...(manageUsers
      ? [
          {
            href: "/crm/users",
            title: "รายชื่อผู้ใช้",
            body: "เพิ่ม แก้ไข ปลดล็อก และกำหนดโมดูลต่อบัญชี",
            meta: "ผู้ใช้งานและสิทธิ์",
            searchText: "ผู้ใช้ users รายชื่อ โมดูล บัญชี",
          },
          {
            href: "/crm/users/roles",
            title: "บทบาทและสิทธิ์",
            body: "สรุปบทบาทในระบบ — แก้สิทธิ์จริงที่หน้ารายชื่อผู้ใช้",
            meta: "ผู้ใช้งานและสิทธิ์",
            searchText: "บทบาท สิทธิ์ roles permission แผนก",
          },
          {
            href: "/crm/users/logs",
            title: "บันทึกการเข้าใช้",
            body: "ตรวจประวัติ login ของทีม",
            meta: "ผู้ใช้งานและสิทธิ์",
            searchText: "login log บันทึก เข้าใช้",
          },
        ]
      : []),
    {
      href: "#pipeline-stages",
      title: "ชื่อขั้น Pipeline",
      body: "แก้ไขชื่อขั้นภาษาไทย/อังกฤษแล้วกดบันทึกต่อขั้น",
      meta: "ตั้งค่าระบบ",
      searchText: "pipeline ขั้น stage ชื่อขั้น",
    },
    {
      href: "#notifications",
      title: "การแจ้งเตือน",
      body: "สถานะอีเมลและรายการส่งไม่สำเร็จ — ค่า SMTP อ่านจาก env",
      meta: "การแจ้งเตือน",
      searchText: "แจ้งเตือน notification อีเมล smtp",
    },
    ...MODULE_SETTINGS.filter((item) => hasModule(user, item.module)).map((item) => ({
      href: item.href,
      title: item.title,
      body: item.body,
      meta: `โมดูล · ${MODULE_LABEL[item.module]}`,
      searchText: `${item.title} ${item.body} ${MODULE_LABEL[item.module]} ${item.module}`.toLowerCase(),
    })),
  ].map((item) => ({
    ...item,
    searchText: item.searchText.toLowerCase(),
  }));

  return (
    <div className="crm-settings">
      <OverviewHero
        variant="compact"
        eyebrow="จัดการระบบ"
        badge={<span className="crm-hero-badge">{roleLabel(user.role)}</span>}
        title="ตั้งค่าระบบ"
        description="จัดหมวดการตั้งค่าที่มีในระบบ — แก้ไขได้เฉพาะส่วนที่ API รองรับจริง"
        label="ตั้งค่าระบบ"
        actions={
          manageUsers ? (
            <Link href="/crm/users" className="crm-hero-btn crm-hero-btn-primary">
              เปิด Users Management
            </Link>
          ) : undefined
        }
      />

      <section className="crm-settings-note" aria-label="ขอบเขตการตั้งค่า">
        <h2>ขอบเขตปัจจุบัน</h2>
        <ul>
          <li>
            สิทธิ์แอดมินใช้ <strong>บทบาท</strong> และ <strong>โมดูลต่อบัญชี</strong> — ยังไม่มีเมทริกซ์ตามแผนกหรือตำแหน่งงานระดับทั้งระบบ
          </li>
          <li>การตั้งค่าโมดูล (สิทธิ์แผนกในแต่ละ ops) อยู่ที่ Settings ของโมดูลนั้น และต้องมีสิทธิ์จัดการในโมดูล</li>
          <li>อีเมลแจ้งเตือน / SMTP อ่านจาก environment — ไม่มีฟอร์มบันทึกในหน้านี้</li>
        </ul>
      </section>

      <section className="crm-settings-panel" aria-labelledby="crm-settings-hub-heading">
        <div className="crm-settings-panel-head">
          <div>
            <h2 id="crm-settings-hub-heading">หมวดและทางลัด</h2>
            <p>แสดงเฉพาะหน้าที่บัญชีนี้เข้าถึงได้</p>
          </div>
        </div>
        {hubItems.length ? (
          <SettingsHubFilter items={hubItems} />
        ) : (
          <EmptyState title="ยังไม่มีหมวดที่เข้าถึงได้" body="ติดต่อผู้ดูแลเพื่อเปิดสิทธิ์โมดูล" compact />
        )}
      </section>

      <section className="crm-settings-panel" aria-labelledby="crm-settings-account-heading">
        <div className="crm-settings-panel-head">
          <div>
            <h2 id="crm-settings-account-heading">บัญชีที่เข้าใช้อยู่</h2>
            <p>ข้อมูลจากเซสชันปัจจุบัน — แก้ไขโปรไฟล์ทีมได้ที่ Users Management</p>
          </div>
          {manageUsers ? (
            <Link href="/crm/users" className="crm-settings-panel-link">
              จัดการผู้ใช้
            </Link>
          ) : null}
        </div>
        <dl className="crm-settings-dl">
          <div>
            <dt>ชื่อ</dt>
            <dd>{user.name || "—"}</dd>
          </div>
          <div>
            <dt>บทบาท</dt>
            <dd>{roleLabel(user.role)}</dd>
          </div>
          <div>
            <dt>อีเมล</dt>
            <dd>{user.email || "—"}</dd>
          </div>
          <div>
            <dt>เบอร์โทร</dt>
            <dd>{user.phone || "—"}</dd>
          </div>
        </dl>
      </section>

      <section id="notifications" className="crm-settings-panel" aria-labelledby="crm-settings-notify-heading">
        <div className="crm-settings-panel-head">
          <div>
            <h2 id="crm-settings-notify-heading">การแจ้งเตือน</h2>
            <p>ค่าคอนฟิกจากเซิร์ฟเวอร์ และคิวที่ส่งไม่สำเร็จ</p>
          </div>
        </div>

        <div className="crm-settings-status-grid" role="list">
          <div className="crm-settings-status" role="listitem">
            <span className="crm-settings-status-label">อีเมลรับลีด</span>
            <strong className="crm-settings-status-value">{notifyEmail || "ยังไม่ตั้งค่า"}</strong>
            <span className="crm-settings-status-hint">
              {notifyEmail ? "อ่านจาก LEAD_NOTIFICATION_EMAIL" : "ยังไม่ตั้ง LEAD_NOTIFICATION_EMAIL"}
            </span>
          </div>
          <div className="crm-settings-status" role="listitem">
            <span className="crm-settings-status-label">SMTP</span>
            <strong className={`crm-settings-status-value${smtpReady ? " is-ok" : " is-warn"}`}>
              {smtpReady ? "พร้อมส่ง" : "ยังไม่ตั้ง"}
            </strong>
            <span className="crm-settings-status-hint">
              {smtpReady ? "พร้อมส่งอีเมลจริง" : "โหมดพัฒนาอาจบันทึกในคอนโซล — แก้ที่ env ไม่ใช่ฟอร์มนี้"}
            </span>
          </div>
        </div>

        <div className="crm-settings-subhead">
          <h3>การแจ้งเตือนที่ยังไม่สำเร็จ</h3>
          <p>กดส่งใหม่จะเรียก API เดิมของระบบ</p>
        </div>
        {notifications.length === 0 ? (
          <EmptyState title="ไม่มีรายการค้าง" body="เมื่อการส่งอีเมลล้มเหลว จะแสดงที่นี่" compact />
        ) : (
          <ul className="crm-settings-notify-list">
            {notifications.map((item) => (
              <li key={item.id} className="crm-settings-notify-item">
                <div>
                  <p className="crm-settings-notify-title">
                    {item.lead.contactName}
                    <span className="crm-settings-notify-meta">
                      {" "}
                      · {item.status} · {item.toEmail || "ไม่มีผู้รับ"}
                    </span>
                  </p>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await retryFailedNotification(item.id);
                  }}
                >
                  <PendingSubmitButton className="crm-hero-btn crm-hero-btn-secondary" pendingLabel="กำลังส่ง…">
                    ส่งใหม่
                  </PendingSubmitButton>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="pipeline-stages" className="crm-settings-panel" aria-labelledby="crm-settings-stages-heading">
        <div className="crm-settings-panel-head">
          <div>
            <h2 id="crm-settings-stages-heading">ชื่อขั้น Pipeline</h2>
            <p>แก้ไขแล้วกดบันทึกทีละขั้น — บันทึกลงฐานข้อมูลจริงผ่าน API เดิม</p>
          </div>
          {hasModule(user, "leads") ? (
            <Link href="/crm/pipeline" className="crm-settings-panel-link">
              เปิด Pipeline
            </Link>
          ) : null}
        </div>

        {stages.length === 0 ? (
          <EmptyState title="ยังไม่มีขั้นในระบบ" body="สร้างขั้นจาก Pipeline ก่อน" compact />
        ) : (
          <ul className="crm-settings-stage-list">
            {stages.map((stage) => (
              <li key={stage.id} className="crm-settings-stage-card">
                <form
                  className="crm-settings-stage-form"
                  action={async (formData) => {
                    "use server";
                    await renameStage(
                      stage.id,
                      String(formData.get("nameTh") ?? ""),
                      String(formData.get("name") ?? ""),
                    );
                  }}
                >
                  <label className="crm-settings-field">
                    <span>ชื่อภาษาไทย</span>
                    <input className="crm-field" name="nameTh" defaultValue={stage.nameTh} required />
                  </label>
                  <label className="crm-settings-field">
                    <span>ชื่อภาษาอังกฤษ</span>
                    <input className="crm-field" name="name" defaultValue={stage.name} required />
                  </label>
                  <PendingSubmitButton className="kpi-button crm-users-primary crm-settings-save" pendingLabel="กำลังบันทึก…">
                    บันทึกชื่อขั้น
                  </PendingSubmitButton>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
