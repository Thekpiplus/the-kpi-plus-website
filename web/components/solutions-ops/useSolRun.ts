"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { solErrorMessage, type SolActionResult } from "@/lib/solutions-ops/types";

/** Shared saving / saved / error state for every Solutions Ops form (no alert()/confirm()). */
export function useSolRun() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const reset = useCallback(() => {
    setError("");
    setOk("");
  }, []);

  const run = useCallback(
    (task: () => Promise<SolActionResult>, success: string, onDone?: (result: Extract<SolActionResult, { ok: true }>) => void) => {
      startTransition(async () => {
        setError("");
        setOk("");
        try {
          const result = await task();
          if (!result.ok) {
            setError(solErrorMessage(result.error, result.detail));
            return;
          }
          setOk(success);
          onDone?.(result);
          router.refresh();
        } catch {
          setError(solErrorMessage("save_failed"));
        }
      });
    },
    [router],
  );

  return { pending, error, ok, setError, setOk, reset, run };
}
