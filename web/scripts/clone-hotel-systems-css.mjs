import fs from "node:fs";
import path from "node:path";

const cssPath = path.resolve("app/globals.css");
let css = fs.readFileSync(cssPath, "utf8");
const rebuiltMarker = "/* Hotel Systems Implementation rebuilt layout */";
const ihmStartMarker = "/* Independent Hotel Management page */";
const metaAdsMarker = ".kpi-meta-ads-hero-crumb {";
const ihmStart = css.indexOf(ihmStartMarker);
const firstMeta = css.indexOf(metaAdsMarker);
if (ihmStart < 0 || firstMeta < 0 || firstMeta <= ihmStart) {
  throw new Error("Could not locate Independent Hotel Management CSS block");
}

const ihmBlock = css.slice(ihmStart, firstMeta);
const clonedBlock = ihmBlock
  .replaceAll("Independent Hotel Management page", "Hotel Systems Implementation rebuilt layout")
  .replaceAll("kpi-independent", "kpi-systems")
  .replaceAll(".ihm-", ".hsi-")
  .replaceAll(" ihm-", " hsi-");

if (css.includes(rebuiltMarker)) {
  const existingStart = css.indexOf(rebuiltMarker);
  const existingEnd = css.indexOf(metaAdsMarker, existingStart);
  if (existingEnd < 0) throw new Error("Could not replace existing rebuilt CSS block");
  css = css.slice(0, existingStart) + clonedBlock + css.slice(existingEnd);
  console.log("replaced existing rebuilt Hotel Systems CSS block");
} else {
  css = css.slice(0, firstMeta) + clonedBlock + css.slice(firstMeta);
  console.log("inserted Hotel Systems rebuilt CSS after Independent Hotel CSS");
}

const faqMarker = ".kpi-shell:has(.kpi-independent) .kpi-faq-home .kpi-faq-trigger:focus,";
const faqStart = css.lastIndexOf(faqMarker);
if (faqStart < 0) throw new Error("Could not locate Independent FAQ CSS");
const faqBlock = css.slice(faqStart).trimEnd() + "\n";
const systemsFaq = faqBlock.replaceAll("kpi-independent", "kpi-systems");
const systemsFaqMarker = ".kpi-shell:has(.kpi-systems) .kpi-faq-home .kpi-faq-trigger:focus,";
if (!css.includes(systemsFaqMarker)) {
  css = `${css.trimEnd()}\n\n${systemsFaq}`;
  console.log("appended Hotel Systems FAQ CSS");
}

const promptComment = "/* Hotel Systems Implementation: Prompt for Thai copy, with Noto Sans Thai fallback. */";
const firstPrompt = css.indexOf(promptComment);
const secondPrompt = css.indexOf(promptComment, firstPrompt + 1);
if (secondPrompt > 0) {
  const afterSecond = css.indexOf(faqMarker, secondPrompt);
  if (afterSecond > secondPrompt) {
    css = css.slice(0, secondPrompt) + css.slice(afterSecond);
    console.log("removed duplicate Hotel Systems Prompt block");
  }
}

fs.writeFileSync(cssPath, css);
console.log("wrote", cssPath);
