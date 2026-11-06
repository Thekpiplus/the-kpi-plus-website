import Link from "next/link";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { PendingSubmitButton } from "@/components/crm/ui/PendingSubmitButton";
import { ProfileAvatarForm } from "@/components/crm/ui/ProfileAvatarForm";
import { ProfileEditForm } from "@/components/crm/ui/ProfileEditForm";
import { RoleBadge } from "@/components/crm/ui/RoleBadge";
import { requireUser } from "@/lib/crm/auth";
import { MODULE_LABEL, inferredModules } from "@/lib/crm/modules";
import { changeOwnPassword, updateOwnProfile } from "@/lib/crm/profile";
import { roleLabel } from "@/lib/crm/roles";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    error?: string;
    pwdChanged?: string;
    pwdError?: string;
    avatarSaved?: string;
    avatarRemoved?: string;
    avatarError?: string;
  }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const modules = inferredModules(user);

  return (
    <div className="crm-profile">
      <PageHeader
        eyebrow="บัญชีของฉัน"
        title="โปรไฟล์ของฉัน"
        description="ดูและแก้ไขข้อมูลส่วนตัวของบัญชีที่เข้าสู่ระบบอยู่ — แยกจาก Users Management และการตั้งค่าระบบ"
      />

      {params.saved === "1" ? (
        <p className="crm-profile-banner is-success" role="status">
          บันทึกข้อมูลส่วนตัวแล้ว
        </p>
      ) : null}
      {params.error === "invalid" ? (
        <p className="crm-profile-banner is-error" role="alert">
          ตรวจชื่อ อีเมล ชื่อผู้ใช้ (a-z 0-9 ._- 3–32 ตัว) และเบอร์โทรอีกครั้ง
        </p>
      ) : null}
      {params.error === "exists" ? (
        <p className="crm-profile-banner is-error" role="alert">
          อีเมล เบอร์โทร หรือชื่อผู้ใช้นี้มีในระบบแล้ว
        </p>
      ) : null}
      {params.pwdChanged === "1" ? (
        <p className="crm-profile-banner is-success" role="status">
          เปลี่ยนรหัสผ่านแล้ว — เซสชันอุปกรณ์อื่นถูกออกจากระบบ
        </p>
      ) : null}
      {params.pwdError === "password" ? (
        <p className="crm-profile-banner is-error" role="alert">
          รหัสผ่านใหม่ต้องมีอย่างน้อย 4 ตัวอักษ และต้องตรงกับช่องยืนยัน
        </p>
      ) : null}
      {params.pwdError === "current" ? (
        <p className="crm-profile-banner is-error" role="alert">
          รหัสผ่านปัจจุบันไม่ถูกต้อง
        </p>
      ) : null}
      {params.pwdError === "missing" ? (
        <p className="crm-profile-banner is-error" role="alert">
          ไม่พบบัญชีผู้ใช้
        </p>
      ) : null}
      {params.avatarSaved === "1" ? (
        <p className="crm-profile-banner is-success" role="status">
          อัปโหลดรูปโปรไฟล์แล้ว
        </p>
      ) : null}
      {params.avatarRemoved === "1" ? (
        <p className="crm-profile-banner is-success" role="status">
          ลบรูปโปรไฟล์แล้ว
        </p>
      ) : null}
      {params.avatarError === "missing" ? (
        <p className="crm-profile-banner is-error" role="alert">
          เลือกไฟล์รูปก่อนอัปโหลด
        </p>
      ) : null}
      {params.avatarError === "size" ? (
        <p className="crm-profile-banner is-error" role="alert">
          ไฟล์ใหญ่เกิน 2 MB — ลองย่อรูปแล้วอัปโหลดใหม่
        </p>
      ) : null}
      {params.avatarError === "type" ? (
        <p className="crm-profile-banner is-error" role="alert">
          รองรับเฉพาะ JPEG, PNG, WebP หรือ GIF
        </p>
      ) : null}

      <div className="crm-profile-layout">
        <section className="crm-profile-panel crm-profile-identity" aria-labelledby="crm-profile-avatar-heading">
          <div className="crm-profile-panel-head">
            <div>
              <h2 id="crm-profile-avatar-heading">รูปโปรไฟล์</h2>
              <p>อัปโหลดรูปสำหรับแสดงในเมนูและหน้าโปรไฟล์ของบัญชีนี้</p>
            </div>
          </div>
          <ProfileAvatarForm name={user.name} avatarUrl={user.avatarUrl} />
        </section>

        <section className="crm-profile-panel" aria-labelledby="crm-profile-account-heading">
          <div className="crm-profile-panel-head">
            <div>
              <h2 id="crm-profile-account-heading">ข้อมูลบัญชี</h2>
              <p>อ่านอย่างเดียว — แก้บทบาทและโมดูลได้ที่ Users Management โดยผู้มีสิทธิ์</p>
            </div>
          </div>
          <dl className="crm-profile-dl">
            <div>
              <dt>บทบาท</dt>
              <dd>
                <RoleBadge role={user.role} />
                <span className="crm-profile-dl-extra">{roleLabel(user.role)}</span>
              </dd>
            </div>
            <div>
              <dt>โมดูลที่เข้าถึงได้</dt>
              <dd>
                {modules.length ? (
                  <ul className="crm-profile-modules">
                    {modules.map((module) => (
                      <li key={module}>{MODULE_LABEL[module]}</li>
                    ))}
                  </ul>
                ) : (
                  "ยังไม่ได้เปิดโมดูล"
                )}
              </dd>
            </div>
            <div>
              <dt>รหัสบัญชี</dt>
              <dd>
                <code className="crm-profile-id">{user.id}</code>
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="crm-profile-panel" aria-labelledby="crm-profile-edit-heading">
        <div className="crm-profile-panel-head">
          <div>
            <h2 id="crm-profile-edit-heading">ข้อมูลส่วนตัว</h2>
            <p>แก้ไขได้เฉพาะบัญชีที่เข้าสู่ระบบอยู่ และบันทึกลงฐานข้อมูลจริง</p>
          </div>
        </div>

        <ProfileEditForm action={updateOwnProfile} className="crm-profile-form">
          <label className="crm-profile-field">
            <span>ชื่อที่แสดง</span>
            <input className="crm-field" name="name" defaultValue={user.name} required autoComplete="name" />
          </label>
          <label className="crm-profile-field">
            <span>อีเมล</span>
            <input
              className="crm-field"
              type="email"
              name="email"
              defaultValue={user.email}
              required
              autoComplete="email"
            />
          </label>
          <label className="crm-profile-field">
            <span>ชื่อผู้ใช้</span>
            <input
              className="crm-field"
              name="username"
              defaultValue={user.username ?? ""}
              required
              autoComplete="username"
              pattern="[a-z0-9._-]{3,32}"
              title="ใช้ a-z, 0-9, จุด, ขีดล่าง หรือขีดกลาง 3–32 ตัว"
            />
          </label>
          <label className="crm-profile-field">
            <span>เบอร์โทร</span>
            <input
              className="crm-field"
              name="phone"
              defaultValue={user.phone}
              required
              autoComplete="tel"
              inputMode="tel"
            />
          </label>
          <div className="crm-profile-form-actions">
            <PendingSubmitButton className="kpi-button crm-users-primary" pendingLabel="กำลังบันทึก…">
              บันทึกการเปลี่ยนแปลง
            </PendingSubmitButton>
            <Link href="/crm/profile" className="crm-hero-btn crm-hero-btn-secondary">
              รีเซ็ตค่าในฟอร์ม
            </Link>
          </div>
        </ProfileEditForm>
      </section>

      <section className="crm-profile-panel" aria-labelledby="crm-profile-security-heading">
        <div className="crm-profile-panel-head">
          <div>
            <h2 id="crm-profile-security-heading">ความปลอดภัย</h2>
            <p>เปลี่ยนรหัสผ่านของบัญชีนี้ — ต้องยืนยันรหัสผ่านปัจจุบัน</p>
          </div>
        </div>

        <form action={changeOwnPassword} className="crm-profile-form crm-profile-form-security">
          <label className="crm-profile-field">
            <span>รหัสผ่านปัจจุบัน</span>
            <input
              className="crm-field"
              type="password"
              name="currentPassword"
              required
              autoComplete="current-password"
              minLength={4}
            />
          </label>
          <label className="crm-profile-field">
            <span>รหัสผ่านใหม่</span>
            <input
              className="crm-field"
              type="password"
              name="password"
              required
              autoComplete="new-password"
              minLength={4}
            />
          </label>
          <label className="crm-profile-field">
            <span>ยืนยันรหัสผ่านใหม่</span>
            <input
              className="crm-field"
              type="password"
              name="passwordConfirm"
              required
              autoComplete="new-password"
              minLength={4}
            />
          </label>
          <div className="crm-profile-form-actions">
            <PendingSubmitButton className="kpi-button crm-users-primary" pendingLabel="กำลังเปลี่ยน…">
              เปลี่ยนรหัสผ่าน
            </PendingSubmitButton>
          </div>
        </form>
      </section>

      <p className="crm-profile-footer-links">
        <Link href="/crm/settings">ไปตั้งค่าระบบ</Link>
        {modules.includes("users") ? (
          <>
            <span aria-hidden="true">·</span>
            <Link href="/crm/users">Users Management</Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
