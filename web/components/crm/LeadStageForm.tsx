"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { CrmSelect } from "@/components/crm/CrmSelect";
import { changeLeadStage } from "@/lib/crm/actions";
import { LOST_REASONS } from "@/lib/crm/constants";

type StageOption = {
  id: string;
  nameTh: string;
  isLost: boolean;
};

export function LeadStageForm({
  leadId,
  stages,
  stageId,
  outcomeReason,
}: {
  leadId: string;
  stages: StageOption[];
  stageId: string;
  outcomeReason: string;
}) {
  const router = useRouter();
  const [selectedStageId, setSelectedStageId] = useState(stageId);
  const [reason, setReason] = useState(outcomeReason || "");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const selected = useMemo(
    () => stages.find((stage) => stage.id === selectedStageId) ?? null,
    [selectedStageId, stages],
  );
  const needsReason = Boolean(selected?.isLost);

  const stageOptions = useMemo(
    () => stages.map((item) => ({ value: item.id, label: item.nameTh })),
    [stages],
  );
  const reasonOptions = useMemo(
    () => [
      {
        value: "",
        label: needsReason ? "เลือกเหตุผล" : "— ใช้เมื่อปิดเป็นไม่สำเร็จ",
        disabled: needsReason,
      },
      ...LOST_REASONS.map((item) => ({ value: item, label: item })),
    ],
    [needsReason],
  );

  return (
    <form
      className="mt-4 grid max-w-lg gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (needsReason && !reason.trim()) {
          setError("เลือกเหตุผลก่อนบันทึกขั้นไม่สำเร็จ");
          return;
        }
        setError("");
        const data = new FormData(event.currentTarget);
        startTransition(async () => {
          const result = await changeLeadStage(data);
          if (result && "error" in result && result.error === "lost_reason_required") {
            setError("เลือกเหตุผลก่อนบันทึกขั้นไม่สำเร็จ");
            return;
          }
          if (result?.ok) router.refresh();
        });
      }}
    >
      <input type="hidden" name="leadId" value={leadId} />
      <label className="text-sm font-bold text-[#3B3B3B]">
        ขั้นใน Pipeline
        <CrmSelect
          name="stageId"
          aria-label="ขั้นใน Pipeline"
          value={selectedStageId}
          options={stageOptions}
          onChange={(next) => {
            setSelectedStageId(next);
            setError("");
          }}
        />
      </label>
      <label className={`text-sm font-bold text-[#3B3B3B]${needsReason ? "" : " crm-lead-reason-optional"}`}>
        เหตุผลถ้าไม่สำเร็จ
        <CrmSelect
          name="outcomeReason"
          aria-label="เหตุผลถ้าไม่สำเร็จ"
          value={needsReason ? reason : ""}
          options={reasonOptions}
          required={needsReason}
          disabled={!needsReason}
          onChange={(next) => {
            setReason(next);
            setError("");
          }}
        />
      </label>
      {error ? (
        <p className="crm-users-alert is-warn" role="alert">
          {error}
        </p>
      ) : needsReason ? (
        <p className="text-sm text-[#555555]">ต้องเลือกเหตุผลเมื่อย้ายไปขั้นไม่สำเร็จ</p>
      ) : null}
      <button className="kpi-button" type="submit" disabled={pending}>
        {pending ? "กำลังอัปเดต…" : "อัปเดตขั้น"}
      </button>
    </form>
  );
}
