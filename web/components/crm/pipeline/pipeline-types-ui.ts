export type PipelineDeal = {
  id: string;
  contactName: string;
  businessName: string;
  source: string;
  sourceLabel: string;
  estimatedValue: number | null;
  nextActivityAt: string | null;
  updatedAt: string;
  stageId: string;
  stageName: string;
  stageIndex: number;
  isWon: boolean;
  isLost: boolean;
  /** Heuristic close chance from stage — TODO: bind real field when API has it */
  chance: number;
  risk: "high" | "medium" | "low";
};

export type PipelineStageOption = {
  id: string;
  nameTh: string;
  isWon: boolean;
  isLost: boolean;
  sortOrder: number;
};

export type PipelineStatFilter = "all" | "contacting" | "won" | "valued";
export type PipelineSort = "value" | "chance" | "risk";
export type PipelineBoardView = "table" | "kanban";

export const CHANCE_BY_STAGE: Record<number, number> = {
  1: 10,
  2: 20,
  3: 35,
  4: 50,
  5: 65,
  6: 80,
  7: 100,
  8: 0,
};

export function chanceForStage(stageIndex: number, isWon: boolean, isLost: boolean) {
  if (isWon) return 100;
  if (isLost) return 0;
  return CHANCE_BY_STAGE[stageIndex] ?? 25;
}

export function riskForDeal(input: {
  nextActivityAt: string | null;
  isWon: boolean;
  isLost: boolean;
  stageIndex: number;
}) {
  if (input.isWon || input.isLost) return "low" as const;
  if (input.nextActivityAt) {
    const due = new Date(input.nextActivityAt).getTime();
    if (Number.isFinite(due) && due < Date.now()) return "high" as const;
    return "medium" as const;
  }
  if (input.stageIndex >= 2) return "high" as const;
  return "medium" as const;
}

export function formatBaht(value: number | null | undefined) {
  if (value == null || value <= 0) return "—";
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}
