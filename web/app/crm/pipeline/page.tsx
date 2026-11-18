import Link from "next/link";
import { LeadsPageChrome } from "@/components/crm/leads/LeadsPageChrome";
import { PipelineWorkspace } from "@/components/crm/pipeline/PipelineWorkspace";
import {
  chanceForStage,
  formatBaht,
  riskForDeal,
  type PipelineBoardView,
  type PipelineDeal,
  type PipelineSort,
  type PipelineStatFilter,
} from "@/components/crm/pipeline/pipeline-types-ui";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import { pipelineData } from "@/lib/crm/queries";
import { sourceLabel } from "@/lib/crm/sources";

function parseView(value?: string): PipelineBoardView {
  if (value === "kanban" || value === "board") return "kanban";
  return "table";
}

function parseSort(value?: string): PipelineSort {
  if (value === "value" || value === "chance") return value;
  return "risk";
}

function parseStat(value?: string): PipelineStatFilter {
  if (value === "contacting" || value === "won" || value === "valued") return value;
  return "all";
}

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string;
    q?: string;
    stageId?: string;
    sort?: string;
    risk?: string;
    stat?: string;
    saved?: string;
  }>;
}) {
  const params = await searchParams;
  const view = parseView(params.view);
  const q = params.q?.trim() ?? "";
  const stageId = params.stageId?.trim() ?? "";
  const sort = parseSort(params.sort);
  const riskOnly = params.risk === "1";
  const stat = parseStat(params.stat);
  const stagesRaw = await pipelineData();

  const stageOptions = stagesRaw.map((stage, index) => ({
    id: stage.id,
    nameTh: stage.nameTh,
    isWon: stage.isWon,
    isLost: stage.isLost,
    sortOrder: index + 1,
  }));

  const deals: PipelineDeal[] = stagesRaw.flatMap((stage, index) => {
    const stageIndex = index + 1;
    return stage.leads.map((lead) => {
      const nextIso = lead.nextActivityAt ? new Date(lead.nextActivityAt).toISOString() : null;
      const updatedIso = lead.updatedAt
        ? new Date(lead.updatedAt).toISOString()
        : new Date().toISOString();
      return {
        id: lead.id,
        contactName: lead.contactName,
        businessName: lead.businessName || "",
        source: lead.source,
        sourceLabel: sourceLabel(lead.source),
        estimatedValue: lead.estimatedValue,
        nextActivityAt: nextIso,
        updatedAt: updatedIso,
        stageId: stage.id,
        stageName: stage.nameTh,
        stageIndex,
        isWon: stage.isWon,
        isLost: stage.isLost,
        chance: chanceForStage(stageIndex, stage.isWon, stage.isLost),
        risk: riskForDeal({
          nextActivityAt: nextIso,
          isWon: stage.isWon,
          isLost: stage.isLost,
          stageIndex,
        }),
      };
    });
  });

  const openDeals = deals.filter((deal) => !deal.isWon && !deal.isLost);
  const openValue = openDeals.reduce((sum, deal) => sum + (deal.estimatedValue ?? 0), 0);
  const riskCount = openDeals.filter((deal) => deal.risk === "high").length;
  const notice =
    params.saved === "1" ? "บันทึกการย้ายขั้นแล้ว — รายการจะอัปเดตตามขั้นใหม่" : null;

  return (
    <LeadsPageChrome
      heroVariant="pipeline"
      title="Pipeline"
      description="ติดตามดีลตามขั้นขาย ย้ายขั้น และปิดการขายได้ในหน้าเดียว"
      meta={`${openDeals.length} ดีลเปิด · มูลค่ารวม ${formatBaht(openValue)} · ${riskCount} ดีลเสี่ยง`}
      notice={notice}
      actions={
        <>
          <NewLeadOpenButton className="kpi-leads-btn-primary">เพิ่มลีดใหม่</NewLeadOpenButton>
          <Link href="/crm/sales" className="kpi-leads-btn-secondary">
            งานวันนี้
          </Link>
        </>
      }
    >
      <PipelineWorkspace
        deals={deals}
        stages={stageOptions}
        view={view}
        q={q}
        stageId={stageId}
        sort={sort}
        riskOnly={riskOnly}
        stat={stat}
      />
    </LeadsPageChrome>
  );
}
