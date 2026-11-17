import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const path = join("content", "seo-manifest.json");
const pages = JSON.parse(readFileSync(path, "utf8"));

/** Trim long meta descriptions without inventing new claims. Target ≤165. */
const longFixes = {
  "/approach":
    "ราคา ช่องทางขาย และ Demand สร้างรายได้ได้เต็มที่ เมื่อทีมใช้ข้อมูลชุดเดียวกัน รู้ผู้รับผิดชอบ และวัด ADR Occupancy และรายได้สุทธิได้",
  "/en/about-us":
    "The KPI Plus works with hotel owners and commercial teams across Thailand to find where revenue is lost, where opportunity sits, and what to do first.",
  "/en/approach":
    "Pricing, channels, and demand work better when the hotel team shares the same data, owns each action, and can measure ADR, occupancy, and net revenue after commission.",
  "/en/solutions/b2b-agent-sales":
    "Review whether a hotel should add B2B yet. The KPI Plus helps choose partners, coordinate terms, and track results. The hotel signs its own contracts.",
  "/en/solutions/independent-hotel-management":
    "Help independent hotel owners set a way of running the property that fits their goal — management, operations, revenue, channels, and results.",
  "/en/solutions/hotel-ai-automation":
    "Review work steps, design and set up AI or automation, trial it with the team, and improve until it fits daily work. For hotels and hospitality organisations.",
  "/en/solutions/hotel-training-team-development":
    "Training, workshops, team building, and people development for hotels — from revenue and digital marketing to service, leadership, technology, and AI.",
  "/en/solutions/hotel-website-design":
    "Plan and build a hotel website for booking confidence and a team that can keep using it. CMS choice follows the hotel’s needs, not a single tool.",
  "/insights/hotel-marketing":
    "การตลาดโรงแรมคือการเชื่อม Google OTA Website Direct Booking Distribution และ Revenue Management ให้ผู้เข้าพักค้นพบ เปรียบเทียบ และจองด้วยข้อมูลที่ชัด โดยไม่รับประกันยอดจอง",
  "/ru/solutions/hotel-ai-automation":
    "The KPI Plus помогает разобрать шаги, спроектировать ИИ или автоматизацию, попробовать с командой и довести до ежедневной работы. Для отелей и hospitality.",
  "/ru/solutions/hotel-website-design":
    "Спланировать и сделать сайт отеля для уверенного бронирования, который команда может вести дальше. WordPress или другой CMS — по потребности отеля.",
  "/solutions/hotel-training-team-development":
    "ออกแบบการอบรม เวิร์กช็อป Team Building และพัฒนาคนสำหรับโรงแรมและองค์กรบริการ ตั้งแต่ Revenue Digital Marketing บริการ ภาวะผู้นำ เทคโนโลยี และ AI",
};

/**
 * Short RU/ZH expansions built only from existing same-locale manifest copy
 * plus on-page leads already published in that locale (no EN→RU/ZH invention).
 */
function pageLead(route) {
  const file = join("content", "pages", `${route.replace(/^\//, "")}.md`);
  if (!existsSync(file)) return "";
  const t = readFileSync(file, "utf8");
  const main = t.split("### MAIN")[1] || "";
  const paras = [...main.matchAll(/^[^\n#][^\n]{30,}/gm)]
    .map((m) => m[0].trim())
    .filter((x) => !/^(The KPI Plus$|Hotel |Vision|Mission|Revenue ·|Contact The KPI Plus for a focused)/.test(x));
  return paras[0] || "";
}

function expandShort(route, current) {
  if ((current || "").length >= 70) return null;
  const lead = pageLead(route);

  // Prefer stitching current + a short same-language lead clause when available.
  if (lead && !lead.startsWith("http") && !lead.startsWith("[")) {
    const joined = `${current.replace(/[。．.!?！？]\s*$/, "")}。${lead}`.replace(/\s+/g, " ").trim();
    if (joined.length >= 70 && joined.length <= 170) return joined;
    if (joined.length > 170) {
      const cut = joined.slice(0, 165);
      const last = Math.max(cut.lastIndexOf("。"), cut.lastIndexOf(". "), cut.lastIndexOf("、"));
      return (last > 90 ? cut.slice(0, last + 1) : cut).trim();
    }
  }

  // Locale-specific closers reused from existing page themes (already on those pages).
  const closers = {
    "/ru/about-us":
      " Помогаем яснее видеть бизнес, лучше решать и выстроить систему работы команды.",
    "/ru/solutions":
      " Выбираем следующий шаг по проблеме, данным и согласованному объёму — без пустых обещаний.",
    "/zh": " 範圍涵蓋泰國獨立酒店的收益與成長決策。",
    "/zh/about-us": " 協助酒店把事業看得更清楚，並建立可長期運作的系統。",
    "/zh/approach": " 讓收益、需求、科技與追蹤能一起運作。",
    "/zh/associations": " 用於延伸產品、專業支援與產業網絡。",
    "/zh/case-studies": " 公開標準包含工作範圍、資料來源與客戶核准。",
    "/zh/contact-us": " 歡迎洽詢收益、需求、直銷預訂、在地曝光與科技導入。",
    "/zh/cookies": " 您可依需求調整非必要 Cookie 設定。",
    "/zh/hotel-digital-marketing": " 用來排定優先順序，而非保證業績。",
    "/zh/hotel-revenue-management": " 可作為 Revenue 工作的起點。",
    "/zh/hotel-seo-local-search": " 協助客人先找到正確事實再往下走。",
    "/zh/hotel-technology-ai": " 聚焦可落地應用與責任歸屬。",
    "/zh/hotel-website-conversion": " 協助減少中途流失。",
    "/zh/insights": " 提供可執行的下一步商業行動。",
    "/zh/phuket-hotel-marketing": " 協助物業一起排出優先順序。",
    "/zh/privacy": " 並說明您在 PDPA 下的權利。",
    "/zh/solutions": " 依問題、資料與約定範圍選擇下一步。",
    "/zh/solutions/b2b-agent-sales": " 合約由飯店自行簽署。",
    "/zh/solutions/google-ads-management": " 這是可檢查的規劃工作，不保證預訂量。",
    "/zh/solutions/hotel-ai-automation": " 直到能成為日常工作的一部分。",
    "/zh/solutions/hotel-direct-bookings": " 點擊預訂按鈕不算完成預訂。",
    "/zh/solutions/hotel-seo-google-maps-ai-search": " 導向可追蹤的詢問與訂房行動。",
    "/zh/solutions/hotel-systems-implementation": " 讓上線後流程可檢查、可交接。",
    "/zh/solutions/hotel-training-team-development": " 依酒店與組織需求設計學習路徑。",
    "/zh/solutions/hotel-website-design": " CMS 依需求選擇，不綁單一工具。",
    "/zh/solutions/independent-hotel-management": " 從管理團隊與營運系統做到成果追蹤。",
    "/zh/solutions/meta-ads-management": " 不保證預訂量，著重可檢查的需求品質。",
    "/zh/solutions/outsourced-hotel-reservations": " 這是實際作業，不只是流程建議。",
    "/zh/solutions/revenue-commercial-management": " 不是只看房價。",
    "/zh/case-studies/layan-revenue-management": " 案例數字以客戶核准可公開資料為準。",
    "/zh/case-studies/patong-boutique-hotel-revenue": " 案例數字以客戶核准可公開資料為準。",
    "/zh/case-studies/coconut-island-digital-performance": " 案例數字以客戶核准可公開資料為準。",
    "/zh/case-studies/patong-direct-booking-performance": " 案例數字以客戶核准可公開資料為準。",
  };

  const closer = closers[route];
  if (!closer) return null;
  const next = `${current.trim()}${closer}`.replace(/\s+/g, " ").trim();
  if (next.length < 70) return null;
  if (next.length > 170) return next.slice(0, 165).trim();
  return next;
}

let updated = 0;
const changes = [];

for (const page of pages) {
  let next = longFixes[page.route] || null;
  if (!next && (page.description || "").length < 70) {
    next = expandShort(page.route, page.description || "");
  }
  if (!next || next === page.description) continue;
  changes.push({ route: page.route, from: page.description.length, to: next.length });
  page.description = next;
  updated += 1;
}

function syncMd(route, description) {
  const candidates = [join("content", "pages", `${route.replace(/^\//, "")}.md`)];
  for (const filePath of candidates) {
    if (!existsSync(filePath)) continue;
    let text = readFileSync(filePath, "utf8");
    if (!/\*\*Description:\*\*/.test(text)) continue;
    const next = text.replace(/(\*\*Description:\*\*\s*)(.+)/, `$1${description}`);
    if (next !== text) {
      writeFileSync(filePath, next, "utf8");
      return filePath;
    }
  }
  return null;
}

const synced = [];
for (const page of pages) {
  if (!changes.some((c) => c.route === page.route)) continue;
  const file = syncMd(page.route, page.description);
  if (file) synced.push(file);
}

writeFileSync(path, `${JSON.stringify(pages, null, 2)}\n`, "utf8");

const stillShort = pages
  .filter((p) => (p.description || "").length < 70)
  .map((p) => ({ route: p.route, len: p.description.length }));
const stillLong = pages
  .filter((p) => (p.description || "").length > 170)
  .map((p) => ({ route: p.route, len: p.description.length }));

console.log(JSON.stringify({ updated, syncedMd: synced.length, stillShort, stillLong, changes }, null, 2));
