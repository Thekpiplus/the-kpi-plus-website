export type PipelineLead = {
  id: string;
  contactName: string;
  businessName: string;
  source: string;
  estimatedValue: number | null;
  nextActivityAt: Date | null;
};

export type PipelineStage = {
  id: string;
  nameTh: string;
  isWon: boolean;
  isLost: boolean;
  leads: PipelineLead[];
};

export type PipelineView = "kanban" | "table" | "calendar";

export function flattenPipelineLeads(stages: PipelineStage[]) {
  return stages.flatMap((stage, index) =>
    stage.leads.map((lead) => ({
      ...lead,
      stageId: stage.id,
      stageName: stage.nameTh,
      stageIndex: index + 1,
      isWon: stage.isWon,
      isLost: stage.isLost,
    })),
  );
}

/** 1-based stage order → stable color tone key (1–8) */
export function stageToneKey(stageIndex: number, stage?: Pick<PipelineStage, "isWon" | "isLost">) {
  if (stage?.isWon) return "won";
  if (stage?.isLost) return "lost";
  const tone = ((Math.max(stageIndex, 1) - 1) % 6) + 1;
  return String(tone);
}

export function parsePipelineView(value?: string): PipelineView {
  if (value === "kanban" || value === "calendar") return value;
  return "table";
}
