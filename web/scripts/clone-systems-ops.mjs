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

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function rewrite(file) {
  let text = fs.readFileSync(file, "utf8");
  const pairs = [
    ["management-ops", "systems-ops"],
    ["mgmt-ops", "sys-ops"],
    ["ManagementOpsBoard", "SystemsOpsBoard"],
    ["ManagementOps", "SystemsOps"],
    ["ManagementWorkspace", "SystemsWorkspace"],
    ["ManagementRecordForm", "SystemsRecordForm"],
    ["ManagementSettingsPanel", "SystemsSettingsPanel"],
    ["ManagementSubtasksPanel", "SystemsSubtasksPanel"],
    ["ManagementProject", "SystemsProject"],
    ["ManagementAccess", "SystemsAccess"],
    ["ManagementSubtask", "SystemsSubtask"],
    ["ManagementComment", "SystemsComment"],
    ["ManagementFile", "SystemsFile"],
    ["ManagementApproval", "SystemsApproval"],
    ["ManagementKpi", "SystemsKpi"],
    ["ManagementSource", "SystemsSource"],
    ["ManagementAudit", "SystemsAudit"],
    ["canOpenManagement", "canOpenSystems"],
    ["managementAccessFor", "systemsAccessFor"],
    ["ensureManagementSchema", "ensureSystemsSchema"],
    ["listManagement", "listSystems"],
    ["createManagement", "createSystems"],
    ["saveManagement", "saveSystems"],
    ["Hotel Management Operations", "Hotel Systems Operations"],
    ["Hotel Management Projects", "Hotel Systems Projects"],
    ["/crm/management", "/crm/systems"],
    ['hasModule(user, "management")', 'hasModule(user, "systems")'],
    ["MGMT_", "SYS_"],
    ["Mgmt", "Sys"],
    ["MIN_MGMT_", "MIN_SYS_"],
    ["MAX_MGMT_", "MAX_SYS_"],
  ];
  for (const [from, to] of pairs) text = text.split(from).join(to);
  fs.writeFileSync(file, text);
}

copyDir(
  path.join(root, "lib", "management-ops"),
  path.join(root, "lib", "systems-ops"),
  (name) => name,
);
copyDir(
  path.join(root, "components", "management-ops"),
  path.join(root, "components", "systems-ops"),
  (name) => name.replace(/Management/g, "Systems").replace(/management/g, "systems"),
);

const pageMap = {
  "page.tsx": "page.tsx",
  "properties/page.tsx": "inventory/page.tsx",
  "assessment/page.tsx": "mapping/page.tsx",
  "plan/page.tsx": "configuration/page.tsx",
  "commercial/page.tsx": "revenue/page.tsx",
  "marketing/page.tsx": "marketing/page.tsx",
  "distribution/page.tsx": "distribution/page.tsx",
  "operations/page.tsx": "integrations/page.tsx",
  "guest/page.tsx": "testing/page.tsx",
  "people/page.tsx": "training/page.tsx",
  "meetings/page.tsx": "sales/page.tsx",
  "kpi/page.tsx": "kpi/page.tsx",
  "actions/page.tsx": "actions/page.tsx",
  "approvals/page.tsx": "approvals/page.tsx",
  "handover/page.tsx": "handover/page.tsx",
  "settings/page.tsx": "settings/page.tsx",
};
const srcPages = path.join(root, "app", "crm", "management");
for (const [fromRel, toRel] of Object.entries(pageMap)) {
  const from = path.join(srcPages, fromRel);
  const to = path.join(root, "app", "crm", "systems", toRel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

const apiFrom = path.join(root, "app", "api", "crm", "management", "files", "[id]", "route.ts");
const apiTo = path.join(root, "app", "api", "crm", "systems", "files", "[id]", "route.ts");
fs.mkdirSync(path.dirname(apiTo), { recursive: true });
fs.copyFileSync(apiFrom, apiTo);

for (const file of [
  ...walk(path.join(root, "lib", "systems-ops")),
  ...walk(path.join(root, "components", "systems-ops")),
  ...walk(path.join(root, "app", "crm", "systems")),
  apiTo,
]) {
  rewrite(file);
}

console.log("cloned management-ops to systems-ops");
