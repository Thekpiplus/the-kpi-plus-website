"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { moveInsightOrder } from "@/lib/cms/actions";

export function InsightOrderControls({
  slug,
  position,
  canUp,
  canDown,
  disabled = false,
}: {
  slug: string;
  position: number;
  canUp: boolean;
  canDown: boolean;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function move(direction: "up" | "down") {
    const formData = new FormData();
    formData.set("slug", slug);
    formData.set("direction", direction);
    startTransition(async () => {
      await moveInsightOrder(formData);
      router.refresh();
    });
  }

  return (
    <div className={`crm-cms-order ${pending ? "is-pending" : ""}`}>
      <span className="crm-cms-order-num" title="ลำดับบนหน้าเว็บ">
        {position}
      </span>
      <div className="crm-cms-order-btns">
        <button
          type="button"
          className="crm-cms-order-btn"
          title="เลื่อนขึ้น"
          aria-label={`เลื่อน “${slug}” ขึ้น`}
          disabled={disabled || pending || !canUp}
          onClick={() => move("up")}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className="crm-cms-order-btn"
          title="เลื่อนลง"
          aria-label={`เลื่อน “${slug}” ลง`}
          disabled={disabled || pending || !canDown}
          onClick={() => move("down")}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 10l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
