import { RevparCalculator } from "@/components/calculators";
import { ToolPage } from "@/components/ToolPage";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/tools/revpar-calculator");

export default function Page() {
  return (
    <ToolPage
      route="/tools/revpar-calculator"
      eyebrow="เครื่องคำนวณ RevPAR, ADR และ Occupancy"
      title="เครื่องคำนวณ RevPAR, ADR และ Occupancy"
      body="คำนวณ RevPAR, ADR หรือ Occupancy จากข้อมูลอีกสองตัวแปร ใช้ได้เร็วสำหรับดูตัวเลขรายวัน"
    >
      <RevparCalculator />
    </ToolPage>
  );
}
