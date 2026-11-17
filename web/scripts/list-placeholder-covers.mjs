import { existsSync, readFileSync } from "node:fs";

const s = readFileSync("lib/insights.ts", "utf8");
const re =
  /id: "([^"]+)"[\s\S]*?coverImage: "([^"]+)"[\s\S]*?coverImageStatus: "([^"]+)"[\s\S]*?title: \{[\s\S]*?th: "((?:\\.|[^"\\])*)"[\s\S]*?en: "((?:\\.|[^"\\])*)"/g;
let m;
const rows = [];
while ((m = re.exec(s))) {
  const [, id, img, status, th, en] = m;
  rows.push({
    id,
    img,
    status,
    exists: existsSync(`public${img}`),
    th: JSON.parse(`"${th}"`),
    en: JSON.parse(`"${en}"`),
  });
}
for (const r of rows) {
  console.log(
    `${r.status.padEnd(12)} ${r.exists ? "ok" : "MISSING"}  ${r.id}\n  ${r.img}\n  TH: ${r.th}\n  EN: ${r.en}\n`,
  );
}
console.log(
  "placeholders:",
  rows.filter((r) => r.status === "placeholder" || r.status === "sample" || !r.exists).map((r) => r.id),
);
