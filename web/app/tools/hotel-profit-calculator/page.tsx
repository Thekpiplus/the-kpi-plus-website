import { ProfitCalculator } from "@/components/calculators";
import { ToolPage } from "@/components/ToolPage";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/tools/hotel-profit-calculator");

export default function Page() {
  return (
    <ToolPage
      route="/tools/hotel-profit-calculator"
      eyebrow="เครื่องคำนวณรายได้และกำไรโรงแรม"
      title="เครื่องคำนวณรายได้และกำไรโรงแรม"
      body="ดูรายได้ห้องพัก ต้นทุนช่องทางขาย ต้นทุนหลัก และ GOP จากข้อมูลที่โรงแรมมีอยู่"
    >
      <ProfitCalculator />
    </ToolPage>
  );
}
