import { VatCalculator } from "@/components/calculators";
import { ToolPage } from "@/components/ToolPage";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/tools/hotel-vat-service-charge-calculator");

export default function Page() {
  return (
    <ToolPage
      route="/tools/hotel-vat-service-charge-calculator"
      eyebrow="เครื่องคำนวณ VAT และ Service Charge โรงแรม"
      title="เครื่องคำนวณ VAT และ Service Charge โรงแรม"
      body="แยกราคาขายสำหรับธุรกิจโรงแรมออกเป็นยอดก่อนภาษี Service Charge VAT และยอดสุทธิ"
    >
      <VatCalculator />
    </ToolPage>
  );
}
