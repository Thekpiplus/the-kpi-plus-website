"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export function ProfileEditForm({
  action,
  children,
  className,
}: {
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
  className?: string;
}) {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  return (
    <form
      className={className}
      action={action}
      onInput={() => setDirty(true)}
      onSubmit={() => setDirty(false)}
    >
      {dirty ? (
        <p className="crm-profile-dirty" role="status">
          มีการแก้ไขที่ยังไม่บันทึก
        </p>
      ) : null}
      {children}
    </form>
  );
}
