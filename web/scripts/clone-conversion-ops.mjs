import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(
      dest,
      entry.name.replace(/Website/g, "Conversion").replace(/website/g, "conversion").replace(/web-ops/g, "conv-ops"),
    );
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

copyDir(path.join(root, "lib", "website-ops"), path.join(root, "lib", "conversion-ops"));
copyDir(path.join(root, "components", "website-ops"), path.join(root, "components", "conversion-ops"));

const pageMap = {
  "page.tsx": "page.tsx",
  "discovery/page.tsx": "message/page.tsx",
  "ux/page.tsx": "room/page.tsx",
  "cms/page.tsx": "price/page.tsx",
  "booking/page.tsx": "booking/page.tsx",
  "tracking/page.tsx": "tracking/page.tsx",
  "seo/page.tsx": "mobile/page.tsx",
  "qa/page.tsx": "optimize/page.tsx",
  "reports/page.tsx": "reports/page.tsx",
  "approvals/page.tsx": "approvals/page.tsx",
  "settings/page.tsx": "settings/page.tsx",
  "handover/page.tsx": "handover/page.tsx",
  "measure/page.tsx": "measure/page.tsx",
};
const srcPages = path.join(root, "app", "crm", "website");
for (const [fromRel, toRel] of Object.entries(pageMap)) {
  const from = path.join(srcPages, fromRel);
  const to = path.join(root, "app", "crm", "conversion", toRel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

const replacements = [
  [/website-ops/g, "conversion-ops"],
  [/WebsiteOpsBoard/g, "ConversionOpsBoard"],
  [/WebsiteWorkspace/g, "ConversionWorkspace"],
  [/WebsiteRecordForm/g, "ConversionRecordForm"],
  [/WebsiteSubtasksPanel/g, "ConversionSubtasksPanel"],
  [/WebsiteSettingsPanel/g, "ConversionSettingsPanel"],
  [/WebsiteProject/g, "ConversionProject"],
  [/WebsiteAccess/g, "ConversionAccess"],
  [/WebsiteSource/g, "ConversionSource"],
  [/WebsiteKpiEntry/g, "ConversionKpiEntry"],
  [/WebsiteAuditEvent/g, "ConversionAuditEvent"],
  [/WebsiteSubtaskComment/g, "ConversionSubtaskComment"],
  [/WebsiteSubtaskFile/g, "ConversionSubtaskFile"],
  [/WebsiteSubtask/g, "ConversionSubtask"],
  [/ensureWebsiteOpsSchema/g, "ensureConversionOpsSchema"],
  [/ensureWebsiteSchema/g, "ensureConversionSchema"],
  [/canOpenWebsite/g, "canOpenConversion"],
  [/websiteAccessFor/g, "conversionAccessFor"],
  [/listWebsiteProjects/g, "listConversionProjects"],
  [/listWebsiteAccessRows/g, "listConversionAccessRows"],
  [/createWebsiteProject/g, "createConversionProject"],
  [/saveWebsiteProject/g, "saveConversionProject"],
  [/patchWebsiteProject/g, "patchConversionProject"],
  [/deleteWebsiteProject/g, "deleteConversionProject"],
  [/saveWebsiteAccessRow/g, "saveConversionAccessRow"],
  [/deleteWebsiteAccessRow/g, "deleteConversionAccessRow"],
  [/appendWebsiteApproval/g, "appendConversionApproval"],
  [/countWebsiteSubtasks/g, "countConversionSubtasks"],
  [/getWebsiteSubtask/g, "getConversionSubtask"],
  [/insertWebsiteSubtask/g, "insertConversionSubtask"],
  [/updateWebsiteSubtask/g, "updateConversionSubtask"],
  [/deleteWebsiteSubtask/g, "deleteConversionSubtask"],
  [/insertWebsiteSubtaskComment/g, "insertConversionSubtaskComment"],
  [/insertWebsiteSubtaskFile/g, "insertConversionSubtaskFile"],
  [/requireWebsite/g, "requireConversion"],
  [/revalidateWebsite/g, "revalidateConversion"],
  [/webSubtaskProgress/g, "convSubtaskProgress"],
  [/WEB_/g, "CONV_"],
  [/Web([A-Z])/g, "Conv$1"],
  [/web-ops-page/g, "conv-ops-page"],
  [/\/crm\/website/g, "/crm/conversion"],
  [/hasModule\(user, "website"\)/g, 'hasModule(user, "conversion")'],
];

const files = [
  ...walk(path.join(root, "lib", "conversion-ops")),
  ...walk(path.join(root, "components", "conversion-ops")),
  ...walk(path.join(root, "app", "crm", "conversion")),
];
for (const file of files) {
  let text = fs.readFileSync(file, "utf8");
  for (const [re, to] of replacements) text = text.replace(re, to);
  fs.writeFileSync(file, text);
}
console.log("copied", files.length, "files");
