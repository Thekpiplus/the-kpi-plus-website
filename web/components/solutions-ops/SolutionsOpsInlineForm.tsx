"use client";

import type { ReactNode } from "react";
import type { SolActionResult } from "@/lib/solutions-ops/types";
import { useSolRun } from "./useSolRun";
import "./solutions-ops.css";

/**
 * Row-level form with its own visible Save button and inline saving / saved / error state.
 * Used for status, review, and approval controls inside tables and cards.
 */
export function SolutionsOpsInlineForm({
  id,
  action,
  children,
  ariaLabel,
  disabled = false,
  saveLabel = "บันทึก",
  successLabel = "บันทึกแล้ว",
}: {
  id: string;
  action: (formData: FormData) => Promise<SolActionResult>;
  children: ReactNode;
  ariaLabel: string;
  disabled?: boolean;
  saveLabel?: string;
  successLabel?: string;
}) {
  const { pending, error, ok, run } = useSolRun();
  return (
    <form
      className="b2b-inline"
      aria-label={ariaLabel}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        run(() => action(data), successLabel);
      }}
    >
      <input type="hidden" name="id" value={id} />
      {children}
      <button className="kpi-button b2b-save" type="submit" disabled={pending || disabled}>
        {pending ? "กำลังบันทึก…" : saveLabel}
      </button>
      <p className={`sol-inline-state${error ? " is-error" : ok ? " is-ok" : ""}`} role="status">
        {pending ? "กำลังบันทึก…" : error || ok}
      </p>
    </form>
  );
}
