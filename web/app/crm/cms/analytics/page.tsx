import Link from "next/link";
import { SiteAnalyticsDashboard, SiteAnalyticsSetup } from "@/components/cms/SiteAnalyticsDashboard";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { getGa4Config } from "@/lib/ga4/config";
import { fetchGa4Overview, type Ga4Range } from "@/lib/ga4/reports";

function parseRange(raw: string | undefined): Ga4Range {
  if (raw === "7" || raw === "90") return raw;
  return "28";
}

export default async function CmsAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeRaw } = await searchParams;
  const range = parseRange(rangeRaw);
  const config = await getGa4Config();
  const ready = Boolean(config.propertyId && config.hasCredentials);
  const report = ready ? await fetchGa4Overview(range) : null;

  return (
    <div className="crm-cms crm-cms-analytics-page">
      <PageHeader
        eyebrow="Content Management"
        title="Website Analytics"
        description="รายงานการเข้าชมจาก Google Analytics 4 (แท็กยิงผ่าน GTM) — หน้าเพจ ประเทศ/เมือง อุปกรณ์ และช่องทาง"
        actions={
          <div className="crm-cms-actions">
            <Link href="/crm/cms/globals" className="crm-users-secondary">
              ตั้งค่า GTM / GA4
            </Link>
            <Link href="/crm/cms" className="crm-users-secondary">
              ภาพรวม CMS
            </Link>
          </div>
        }
      />

      {!ready ? (
        <SiteAnalyticsSetup
          propertyId={config.propertyId}
          hasCredentials={config.hasCredentials}
          clientEmail={config.clientEmail}
        />
      ) : report && report.ok ? (
        <SiteAnalyticsDashboard data={report.data} range={range} />
      ) : (
        <div className="crm-cms-analytics-setup">
          <SiteAnalyticsSetup
            propertyId={config.propertyId}
            hasCredentials={config.hasCredentials}
            clientEmail={config.clientEmail}
          />
          <p className="crm-users-alert is-warn" role="alert">
            ดึงรายงานจาก GA4 ไม่สำเร็จ: {report && !report.ok ? report.message : "unknown error"}
          </p>
        </div>
      )}
    </div>
  );
}
