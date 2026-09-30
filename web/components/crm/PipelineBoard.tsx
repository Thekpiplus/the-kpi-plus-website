import Link from "next/link";
import { changeLeadStage } from "@/lib/crm/actions";
import { sourceLabel } from "@/lib/crm/sources";

type Stage = {
  id: string;
  nameTh: string;
  isWon: boolean;
  isLost: boolean;
  leads: {
    id: string;
    contactName: string;
    businessName: string;
    source: string;
    estimatedValue: number | null;
    nextActivityAt: Date | null;
  }[];
};

export function PipelineBoard({ stages }: { stages: Stage[] }) {
  return (
    <div className="crm-pipeline" style={{ gridTemplateColumns: `repeat(${Math.max(stages.length, 1)}, minmax(16rem, 1fr))` }}>
      {stages.map((stage) => (
        <section key={stage.id} className="crm-column">
          <h2 className="text-lg font-extrabold text-[#3B3B3B]">{stage.nameTh}</h2>
          <p className="text-sm">{stage.leads.length} ลีด</p>
          {stage.leads.map((lead) => (
            <article key={lead.id} className="crm-lead-card">
              <Link href={`/crm/leads/${lead.id}`} className="font-semibold text-[#0B6660]">
                {lead.contactName}
              </Link>
              <p className="mt-1 text-sm">{lead.businessName || "ไม่มีชื่อกิจการ"}</p>
              <p className="text-xs">{sourceLabel(lead.source)}</p>
              <form action={changeLeadStage} className="mt-3 grid gap-2">
                <input type="hidden" name="leadId" value={lead.id} />
                <label className="block text-xs font-bold text-[#3B3B3B]">
                  ปรับขั้น
                  <select className="crm-select" name="stageId" defaultValue={stage.id}>
                    {stages.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nameTh}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="kpi-button" type="submit">
                  ย้าย
                </button>
              </form>
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}
