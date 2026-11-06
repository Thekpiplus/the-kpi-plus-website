"use client";

import { useEffect, useId, useState } from "react";
import { PendingSubmitButton } from "@/components/crm/ui/PendingSubmitButton";
import { removeOwnAvatar, updateOwnAvatar } from "@/lib/crm/profile";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "KP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function ProfileAvatarForm({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string | null;
}) {
  const inputId = useId();
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const current = avatarUrl?.trim() || "";

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const shown = preview || current;

  return (
    <div className="crm-profile-avatar-block">
      <div className="crm-profile-avatar-preview" aria-hidden={!shown}>
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element -- local /media or blob preview
          <img src={shown} alt="" className="crm-profile-avatar-img" />
        ) : (
          <span className="crm-profile-avatar">{initials(name)}</span>
        )}
      </div>

      <div className="crm-profile-avatar-controls">
        <p className="crm-profile-avatar-name">{name || "ทีม KPI Plus"}</p>
        <p className="crm-profile-avatar-note">
          รองรับ JPEG, PNG, WebP หรือ GIF ขนาดไม่เกิน 2 MB
        </p>

        <form action={updateOwnAvatar} className="crm-profile-avatar-form" encType="multipart/form-data">
          <label className="crm-profile-avatar-file" htmlFor={inputId}>
            <span className="sr-only">เลือกไฟล์รูปโปรไฟล์</span>
            <input
              id={inputId}
              className="crm-profile-avatar-input"
              type="file"
              name="avatar"
              accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
              required
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (preview) URL.revokeObjectURL(preview);
                if (!file) {
                  setPreview(null);
                  setFileName("");
                  return;
                }
                setFileName(file.name);
                setPreview(URL.createObjectURL(file));
              }}
            />
            <span className="crm-users-secondary crm-profile-avatar-pick" aria-hidden="true">
              เลือกรูป
            </span>
          </label>
          {fileName ? <p className="crm-profile-avatar-filename">{fileName}</p> : null}
          <PendingSubmitButton className="kpi-button crm-users-primary" pendingLabel="กำลังอัปโหลด…">
            {current ? "อัปโหลดรูปใหม่" : "อัปโหลดรูปโปรไฟล์"}
          </PendingSubmitButton>
        </form>

        {current ? (
          <form action={removeOwnAvatar} className="crm-profile-avatar-remove">
            <PendingSubmitButton className="crm-hero-btn crm-hero-btn-secondary" pendingLabel="กำลังลบ…">
              ลบรูปโปรไฟล์
            </PendingSubmitButton>
          </form>
        ) : null}
      </div>
    </div>
  );
}
