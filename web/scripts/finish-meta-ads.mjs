import { copyFileSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function rewrite(path, fn) {
  const abs = join(root, path);
  writeFileSync(abs, fn(readFileSync(abs, "utf8")));
}

const cssSrc = join(root, "components/google-ads/google-ads-visuals.css");
const cssDest = join(root, "components/meta-ads/meta-ads-visuals.css");
writeFileSync(cssDest, readFileSync(cssSrc, "utf8").split("kpi-google-ads").join("kpi-meta-ads"));

for (const rel of [
  "components/MetaAdsView.tsx",
  "components/meta-ads/AdsEnquiryIntro.tsx",
  "components/meta-ads/MetaKpiCards.tsx",
  "components/meta-ads/MetaKpiChart.tsx",
  "components/meta-ads/MetaWorkflowSteps.tsx",
  "components/meta-ads/MetaHeroVisual.tsx",
  "components/meta-ads/MetaAudienceVisual.tsx",
  "components/meta-ads/MetaFrameworkVisual.tsx",
  "components/meta-ads/MetaScenarioVisual.tsx",
  "components/meta-ads/MetaWorkflowVisual.tsx",
  "components/meta-ads/MetaKpiVisual.tsx",
  "components/meta-ads/MetaRelatedVisual.tsx",
]) {
  rewrite(rel, (t) =>
    t
      .split("@/components/meta-ads/google-ads-visuals.css")
      .join("@/components/meta-ads/meta-ads-visuals.css")
      .split("./google-ads-visuals.css")
      .join("./meta-ads-visuals.css")
      .split("kpi-google-ads")
      .join("kpi-meta-ads"),
  );
}

const schemaPath = join(root, "prisma/schema.prisma");
let schema = readFileSync(schemaPath, "utf8");
if (!schema.includes("model MetaCampaign {")) {
  const adsStart = schema.indexOf("model AdsCampaign {");
  const adsEnd = schema.indexOf("model ", adsStart + "model AdsCampaign {".length);
  // Ads models run until end of AdsSubtaskFile which is last Ads model.
  const lastAds = schema.lastIndexOf("model AdsSubtaskFile {");
  const afterLast = schema.indexOf("\nmodel ", lastAds + 1);
  const adsBlock = schema.slice(adsStart, afterLast === -1 ? schema.length : afterLast);
  const metaBlock = adsBlock
    .replaceAll("model Ads", "model Meta")
    .replaceAll("AdsActivity", "MetaActivity")
    .replaceAll("AdsKpiEntry", "MetaKpiEntry")
    .replaceAll("AdsNote", "MetaNote")
    .replaceAll("AdsAuditEvent", "MetaAuditEvent")
    .replaceAll("AdsAccess", "MetaAccess")
    .replaceAll("AdsSubtaskComment", "MetaSubtaskComment")
    .replaceAll("AdsSubtaskFile", "MetaSubtaskFile")
    .replaceAll("AdsSubtask", "MetaSubtask")
    .replaceAll("AdsCampaign", "MetaCampaign")
    .replaceAll('channel         String         @default("search_ads")', 'channel         String         @default("awareness")');
  schema = schema.trimEnd() + "\n\n" + metaBlock.trim() + "\n";
  writeFileSync(schemaPath, schema);
}

const routes = {
  awareness: "awareness",
  traffic: "traffic",
  leads: "leads",
  conversion: "conversion",
  remarketing: "remarketing",
};
for (const [folder, section] of Object.entries(routes)) {
  const dir = join(root, "app/crm/meta", folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "page.tsx"),
    `import { MetaWorkspace } from "@/components/meta-ops/MetaWorkspace";
import type { MetaListFilters } from "@/lib/meta-ops/queries";

export default function Meta${section.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase())}Page({ searchParams }: { searchParams: Promise<MetaListFilters> }) {
  return <MetaWorkspace section="${section}" searchParams={searchParams} />;
}
`,
  );
}

const placeholders = [
  ["meta-ads-management-hero-placeholder.webp", 1600, 1000, "ตัวอย่าง Meta Ad Creative และ Hotel Booking Funnel", "Sample workflow · Creative, Audience and Direct Booking"],
  ["meta-ads-management-visibility-placeholder.webp", 1200, 800, "Sample Audience Map", "Facebook / Instagram reach is industry data, not hotel bookings"],
  ["meta-ads-audience-insight-placeholder.webp", 1200, 800, "ตัวอย่าง Audience Insight และ Creative Performance", "Sample data · not hotel campaign reach"],
  ["meta-ads-readiness-framework-placeholder.webp", 1600, 900, "Objective-to-Booking Readiness", "Objective · Audience · Creative · Landing · Tracking"],
  ["meta-ads-scenario-comparison-placeholder.webp", 1600, 900, "Campaign Scenario Comparison", "Awareness · Traffic · Leads · Conversion · Remarketing"],
  ["meta-ads-campaign-workflow-placeholder.webp", 1600, 900, "Meta Ads Campaign Workflow", "Audit · Structure · Launch · Optimize · Report"],
  ["meta-ads-performance-kpi-placeholder.webp", 1600, 900, "Meta Ads Performance KPI", "Sample frame · not live Reach, CTR, CPC, ROAS"],
  ["meta-ads-related-content-placeholder.webp", 1200, 800, "Hotel Marketing Content", "Not the hero or audience visual"],
  ["meta-ads-team-placeholder.webp", 1200, 800, "Replace with verified Digital Marketing Team image", "Do not publish this dummy"],
];

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require("sharp");
} catch {
  try {
    sharp = require("next/dist/compiled/sharp");
  } catch {
    sharp = null;
  }
}

if (sharp) {
  const outDir = join(root, "public/images");
  mkdirSync(outDir, { recursive: true });
  for (const [name, width, height, title, note] of placeholders) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#06182B"/>
  <defs>
    <linearGradient id="bar" x1="0" y1="0" x2="${width}" y2="0">
      <stop stop-color="#A2DC25"/>
      <stop offset="1" stop-color="#EBE722"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="8" fill="url(#bar)"/>
  <rect x="48" y="48" width="${width - 96}" height="${height - 96}" rx="16" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.35" stroke-width="2"/>
  <text x="80" y="120" fill="#A2DC25" font-family="Montserrat, Arial, sans-serif" font-size="18" font-weight="800" letter-spacing="3">SAMPLE VISUAL</text>
  <text x="80" y="188" fill="#FFFFFF" font-family="Montserrat, Arial, sans-serif" font-size="34" font-weight="700">${title}</text>
  <text x="80" y="236" fill="#9BB0C2" font-family="Sarabun, Arial, sans-serif" font-size="22">${note}</text>
  <text x="80" y="${height - 80}" fill="#F2F8E2" font-family="Montserrat, Arial, sans-serif" font-size="18">ตัวอย่างข้อมูล · Replace with verified asset · ${width} × ${height}</text>
</svg>`;
    const buffer = await sharp(Buffer.from(svg)).webp({ quality: 86 }).toBuffer();
    writeFileSync(join(outDir, name), buffer);
    console.log("wrote", name);
  }
} else {
  console.warn("sharp missing; skipped placeholder webp");
}

console.log("finish-meta-ads done");
