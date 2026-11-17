import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://thekpiplus.com";
const path = join("content", "seo-manifest.json");
const pages = JSON.parse(readFileSync(path, "utf8"));
const routes = new Set(pages.map((p) => p.route));

function altPath(href) {
  try {
    return new URL(href, SITE).pathname.replace(/\/$/, "") || "/";
  } catch {
    return null;
  }
}

let removed = 0;
for (const page of pages) {
  const before = page.alternates?.length || 0;
  page.alternates = (page.alternates || []).filter((alt) => {
    const p = altPath(alt.href);
    return p && routes.has(p);
  });
  removed += before - page.alternates.length;
}

// Slightly expand the shortest Thai tool descriptions (existing language only).
const toolDescBoosts = {
  "/tools/hotel-vat-service-charge-calculator":
    "คำนวณราคาขาย รวม VAT และ Service Charge รวมถึงยอดสุทธิ สำหรับงานขายและจองของโรงแรม",
  "/tools/ota-commission-calculator":
    "คำนวณต้นทุน Commission ของ OTA และรายได้สุทธิหลังหักค่าคอม เพื่อช่วยเปรียบเทียบช่องทางขาย",
  "/tools/revpar-calculator":
    "คำนวณ RevPAR, ADR และ Occupancy จากข้อมูลที่มี เพื่อช่วยวิเคราะห์ผลประกอบการโรงแรมอย่างรวดเร็ว",
  "/tools/hotel-budget-calculator":
    "ช่วยวาง Budget รายได้ห้องพักจากจำนวนห้อง Occupancy ADR และระยะเวลาการขายอย่างเป็นระบบ",
};

for (const page of pages) {
  if (toolDescBoosts[page.route]) page.description = toolDescBoosts[page.route];
}

writeFileSync(path, `${JSON.stringify(pages, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ removedBrokenAlternates: removed, boostedToolDescriptions: Object.keys(toolDescBoosts).length }, null, 2));
