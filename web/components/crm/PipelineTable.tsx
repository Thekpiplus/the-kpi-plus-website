import Link from "next/link";
import { changeLeadStage } from "@/lib/crm/actions";
import { formatMoney, formatThaiDateTime } from "@/lib/crm/queries";
import { sourceLabel } from "@/lib/crm/sources";
import { flattenPipelineLeads, stageToneKey, type PipelineStage } from "@/components/crm/pipeline-types";
import { LeadRowActions } from "@/components/crm/ui/LeadRowActions";

export function PipelineTable({ stages }: { stages: PipelineStage[] }) {
  const rows = flattenPipelineLeads(stages).sort((a, b) => {
    if (a.stageIndex !== b.stageIndex) return a.stageIndex - b.stageIndex;
    const aTime = a.nextActivityAt ? new Date(a.nextActivityAt).getTime() : Number.POSITIVE_INFINITY;
    const bTime = b.nextActivityAt ? new Date(b.nextActivityAt).getTime() : Number.POSITIVE_INFINITY;
    if (aTime !== bTime) return aTime - bTime;
    return a.contactName.localeCompare(b.contactName, "th");
  });

  return (
    <div className="crm-pipe-table-wrap">
      {rows.length === 0 ? (
        <p className="crm-pipe-table-empty">ยังไม่มีลีดใน Pipeline</p>
      ) : (
        <table className="crm-pipe-table">
          <thead>
            <tr>
              <th>ผู้ติดต่อ</th>
              <th>กิจการ</th>
              <th>ลำดับขั้น</th>
              <th>แหล่งที่มา</th>
              <th>มูลค่า</th>
              <th>นัดถัดไป</th>
              <th>ย้ายขั้น</th>
              <th className="crm-pipe-table-actions-col">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((lead) => {
              const tone = stageToneKey(lead.stageIndex, lead);
              return (
                <tr key={lead.id}>
                  <td data-label="ผู้ติดต่อ">
                    <Link href={`/crm/leads/${lead.id}`} className="crm-pipe-table-name">
                      {lead.contactName}
                    </Link>
                  </td>
                  <td data-label="กิจการ">{lead.businessName || "—"}</td>
                  <td data-label="ลำดับขั้น">
                    <span className="crm-pipe-stage-badge" data-stage-tone={tone}>
                      {lead.stageName}
                    </span>
                  </td>
                  <td data-label="แหล่งที่มา">{sourceLabel(lead.source)}</td>
                  <td data-label="มูลค่า" className="crm-pipe-table-money">
                    {formatMoney(lead.estimatedValue)}
                  </td>
                  <td data-label="นัดถัดไป">{formatThaiDateTime(lead.nextActivityAt)}</td>
                  <td data-label="ย้ายขั้น">
                    <form action={changeLeadStage} className="crm-pipe-table-move">
                      <input type="hidden" name="leadId" value={lead.id} />
                      <select
                        className="crm-pipe-select"
                        name="stageId"
                        defaultValue={lead.stageId}
                        aria-label={`ย้ายขั้นของ ${lead.contactName}`}
                      >
                        {stages.map((stage) => (
                          <option key={stage.id} value={stage.id}>
                            {stage.nameTh}
                          </option>
                        ))}
                      </select>
                      <button className="crm-pipe-move-btn" type="submit">
                        ย้าย
                      </button>
                    </form>
                  </td>
                  <td data-label="การดำเนินการ" className="crm-pipe-table-actions-col">
                    <LeadRowActions
                      leadId={lead.id}
                      contactName={lead.contactName}
                      returnTo="/crm/pipeline?view=table"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
