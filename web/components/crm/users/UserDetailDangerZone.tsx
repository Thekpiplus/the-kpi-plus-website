"use client";

import { useState } from "react";
import { PendingSubmitButton } from "@/components/crm/ui/PendingSubmitButton";
import { deleteStaffUser } from "@/lib/crm/user-admin";

export function UserDetailDangerZone({ userId, userName }: { userId: string; userName: string }) {
  const [confirm, setConfirm] = useState(false);

  return (
    <section className="kpi-users-danger-zone" aria-labelledby="kpi-users-danger-heading">
      <div className="kpi-users-panel-head">
        <h2 id="kpi-users-danger-heading">โซนอันตราย</h2>
        <p>ลบบัญชีทีมออกจากระบบ — ย้อนกลับไม่ได้</p>
      </div>

      {!confirm ? (
        <button
          type="button"
          className="crm-users-secondary kpi-users-danger-trigger"
          aria-expanded={false}
          onClick={() => setConfirm(true)}
        >
          ลบผู้ใช้ทีม
        </button>
      ) : (
        <div className="kpi-users-inline-confirm" role="region" aria-label="ยืนยันการลบ">
          <p>
            ยืนยันลบ <strong>{userName}</strong>? การกระทำนี้ลบบัญชีออกจากระบบและออกจากเซสชันทั้งหมด
          </p>
          <div className="kpi-users-inline-confirm-actions">
            <button type="button" className="crm-users-secondary" onClick={() => setConfirm(false)}>
              ยกเลิก
            </button>
            <form action={deleteStaffUser}>
              <input type="hidden" name="userId" value={userId} />
              <PendingSubmitButton className="kpi-button kpi-users-danger" pendingLabel="กำลังลบ…">
                ยืนยันลบ
              </PendingSubmitButton>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
