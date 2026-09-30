import { PipelineBoard } from "@/components/crm/PipelineBoard";
import { pipelineData } from "@/lib/crm/queries";

export default async function PipelinePage() {
  const stages = await pipelineData();
  return (
    <div className="crm-grid">
      <h1 className="text-3xl font-extrabold text-[#3B3B3B]">Pipeline</h1>
      <p>ย้ายขั้นจากบัตรลีด หรือเปิดลีดเพื่อบันทึกการติดตาม</p>
      <PipelineBoard stages={stages} />
    </div>
  );
}
