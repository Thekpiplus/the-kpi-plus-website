import { execSync } from "node:child_process";

const src = execSync("git show HEAD:web/components/MetaAdsView.tsx", {
  encoding: "utf8",
  cwd: "C:/Cursor AI Website/KPI Website",
});
const ruStart = src.indexOf("  ru: {");
const zhStart = src.indexOf("  zh: {");
const zhEnd = src.indexOf("};\n", zhStart);
const ru = src.slice(ruStart, zhStart);
const zh = src.slice(zhStart, zhEnd + 2);
function grab(block, key) {
  const re = new RegExp(`${key}:\\s*"([\\s\\S]*?)"`);
  const m = block.match(re);
  return m ? m[1].replaceAll("\n", " ").slice(0, 240) : "";
}
for (const [name, block] of [
  ["ru", ru],
  ["zh", zh],
]) {
  console.log("----", name);
  for (const key of ["title", "lead", "cta", "whyTitle", "hotelAdsSource", "problemTitle"]) {
    console.log(key + ":", grab(block, key));
  }
}
