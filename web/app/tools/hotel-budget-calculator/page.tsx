import { BudgetCalculator } from "@/components/calculators";
import { ToolPage } from "@/components/ToolPage";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/tools/hotel-budget-calculator");

export default function Page() {
  return (
    <ToolPage
      route="/tools/hotel-budget-calculator"
      eyebrow="เครื่องคำนวณ Budget โรงแรม"
      title="เครื่องคำนวณ Budget โรงแรม"
      body="ตั้งงบรายได้ห้องพักแบบเร็ว ๆ จากจำนวนห้อง วันเปิดขาย เป้าหมาย Occupancy และ ADR"
    >
      <BudgetCalculator />
    </ToolPage>
  );
}
