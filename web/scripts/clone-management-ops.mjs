import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function copyDir(src, dest, rename) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, rename(entry.name));
    if (entry.isDirectory()) copyDir(from, to, rename);
    else fs.copyFileSync(from, to);
  }
}

function rewrite(file) {
  let text = fs.readFileSync(file, "utf8");
  text = text
    .replaceAll("conversion-ops", "management-ops")
    .replaceAll("conv-ops", "mgmt-ops")
    .replaceAll("ConversionOps", "ManagementOps")
    .replaceAll("ConversionWorkspace", "ManagementWorkspace")
    .replaceAll("ConversionRecordForm", "ManagementRecordForm")
    .replaceAll("ConversionSettingsPanel", "ManagementSettingsPanel")
    .replaceAll("ConversionSubtasksPanel", "ManagementSubtasksPanel")
    .replaceAll("ConversionProject", "ManagementProject")
    .replaceAll("ConversionAccess", "ManagementAccess")
    .replaceAll("ConversionSubtask", "ManagementSubtask")
    .replaceAll("ConversionComment", "ManagementComment")
    .replaceAll("ConversionFile", "ManagementFile")
    .replaceAll("ConversionApproval", "ManagementApproval")
    .replaceAll("ConversionKpi", "ManagementKpi")
    .replaceAll("canOpenConversion", "canOpenManagement")
    .replaceAll("conversionAccessFor", "managementAccessFor")
    .replaceAll("ensureConversionSchema", "ensureManagementSchema")
    .replaceAll("listConversion", "listManagement")
    .replaceAll("Direct Booking Operations", "Hotel Management Operations")
    .replaceAll("Direct Booking Projects", "Hotel Management Projects")
    .replaceAll("/crm/conversion", "/crm/management")
    .replaceAll("hasModule(user, \"conversion\")", "hasModule(user, \"management\")")
    .replaceAll("CONV_", "MGMT_")
    .replaceAll("Conv", "Mgmt")
    .replaceAll("conversion", "management")
    .replaceAll("Conversion", "Management");
  fs.writeFileSync(file, text);
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

copyDir(
  path.join(root, "lib", "conversion-ops"),
  path.join(root, "lib", "management-ops"),
  (name) => name,
);
copyDir(
  path.join(root, "components", "conversion-ops"),
  path.join(root, "components", "management-ops"),
  (name) => name.replace(/Conversion/g, "Management").replace(/conversion/g, "management"),
);

const pageMap = {
  "page.tsx": "page.tsx",
  "review/page.tsx": "assessment/page.tsx",
  "room/page.tsx": "model/page.tsx",
  "friction/page.tsx": "scope/page.tsx",
  "booking/page.tsx": "plan/page.tsx",
  "mobile/page.tsx": "people/page.tsx",
  "tracking/page.tsx": "guest/page.tsx",
  "experiments/page.tsx": "commercial/page.tsx",
  "reports/page.tsx": "kpi/page.tsx",
  "approvals/page.tsx": "meetings/page.tsx",
  "handover/page.tsx": "actions/page.tsx",
  "settings/page.tsx": "settings/page.tsx",
};
const srcPages = path.join(root, "app", "crm", "conversion");
for (const [fromRel, toRel] of Object.entries(pageMap)) {
  const from = path.join(srcPages, fromRel);
  const to = path.join(root, "app", "crm", "management", toRel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

const apiFrom = path.join(root, "app", "api", "crm", "conversion", "files", "[id]", "route.ts");
const apiTo = path.join(root, "app", "api", "crm", "management", "files", "[id]", "route.ts");
fs.mkdirSync(path.dirname(apiTo), { recursive: true });
fs.copyFileSync(apiFrom, apiTo);

for (const file of [
  ...walk(path.join(root, "lib", "management-ops")),
  ...walk(path.join(root, "components", "management-ops")),
  ...walk(path.join(root, "app", "crm", "management")),
  apiTo,
]) {
  rewrite(file);
}

console.log("cloned conversion-ops to management-ops");
