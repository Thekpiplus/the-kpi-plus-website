import assert from "node:assert/strict";
import test from "node:test";
import { convDepartmentProgress, convSubtaskProgress } from "./progress";
import {
  MAX_SYS_SUBTASKS,
  SYS_DEPARTMENT_DUTIES,
  SYS_DEPARTMENTS,
  SYS_FORM_TABS,
  SYS_GROUP_BY,
  SYS_ISSUE_STATUSES,
  SYS_PROJECT_TYPES,
  SYS_SECTIONS,
  SYS_SORTS,
  SYS_STARTER_SUBTASKS,
  SYS_STATUSES,
  SYS_WORKSTREAMS,
  emptyArchitectureRow,
  emptyHandoverAsset,
  emptyInventoryRow,
  emptyIssue,
  emptyMappingRow,
  emptyReadinessRow,
  emptyTestCase,
  payloadHasSecrets,
  textHasSecrets,
  webSectionFormTab,
  webSectionPath,
} from "./types";

test("Hotel Systems Operations has 15 menus, 15 statuses, and department expandability", () => {
  assert.equal(SYS_SECTIONS.length, 15);
  assert.deepEqual([...SYS_SECTIONS], [
    "overview",
    "properties",
    "inventory",
    "architecture",
    "mapping",
    "readiness",
    "configuration",
    "testing",
    "issues",
    "distribution",
    "analytics",
    "handover",
    "approvals",
    "kpi",
    "settings",
  ]);
  assert.equal(SYS_STATUSES.length, 15);
  assert.equal(SYS_STATUSES[0], "draft");
  assert.equal(SYS_STATUSES[10], "ready_for_go_live");
  assert.equal(SYS_STATUSES[14], "archived");
  assert.deepEqual([...SYS_DEPARTMENTS], ["marketing", "revenue", "distribution", "sales", "management"]);
  assert.deepEqual([...SYS_PROJECT_TYPES], ["new_setup", "integration", "data_mapping", "troubleshooting", "handover"]);
  assert.ok(SYS_WORKSTREAMS.includes("inventory"));
  assert.ok(SYS_WORKSTREAMS.includes("distribution"));
});

test("project detail tabs, group, and sort match the internal board spec", () => {
  assert.deepEqual([...SYS_FORM_TABS], [
    "overview",
    "inventory",
    "architecture",
    "mapping",
    "readiness",
    "configuration",
    "testing",
    "issues",
    "distribution",
    "analytics",
    "handover",
    "approvals",
    "files",
    "history",
  ]);
  assert.deepEqual([...SYS_GROUP_BY], ["status", "hotel", "owner", "department", "system", "severity", "projectType"]);
  assert.deepEqual([...SYS_SORTS], ["nextActionAt", "dueDate", "risk", "severity", "updatedAt"]);
  assert.equal(webSectionPath("overview"), "/crm/systems");
  assert.equal(webSectionPath("inventory"), "/crm/systems/inventory");
  assert.equal(webSectionPath("settings"), "/crm/systems/settings");
  assert.equal(webSectionFormTab("inventory"), "inventory");
  assert.equal(webSectionFormTab("kpi"), "analytics");
  assert.equal(webSectionFormTab("overview"), "overview");
});

test("inventory, mapping, test, issue, and handover rows have the required fields", () => {
  const inventory = emptyInventoryRow();
  assert.ok("system" in inventory && "provider" in inventory && "dataIn" in inventory && "integrationStatus" in inventory);
  const flow = emptyArchitectureRow();
  assert.ok("node" in flow && "source" in flow && "destination" in flow && "mappingStatus" in flow);
  const mapping = emptyMappingRow();
  assert.ok("sourceField" in mapping && "destinationField" in mapping && "example" in mapping);
  const readiness = emptyReadinessRow("access");
  assert.equal(readiness.area, "access");
  assert.ok("question" in readiness && "evidence" in readiness && "approvalStatus" in readiness);
  const testCase = emptyTestCase();
  assert.ok("trigger" in testCase && "expected" in testCase && "retestAt" in testCase);
  const issue = emptyIssue("Harbour Sample");
  assert.equal(issue.project, "Harbour Sample");
  assert.deepEqual([...SYS_ISSUE_STATUSES], ["open", "in_progress", "blocked", "retest", "resolved", "closed"]);
  const handover = emptyHandoverAsset("PMS");
  assert.equal(handover.asset, "PMS");
  assert.ok("documentationStatus" in handover && "goLiveStatus" in handover);
});

test("each department has its hotel-systems duties and at most 10 starter subtasks", () => {
  assert.deepEqual(SYS_DEPARTMENT_DUTIES.marketing, [
    "Website/content system requirements",
    "Campaign/source data context",
    "Tracking and reporting needs",
    "Guest communication requirements",
  ]);
  assert.deepEqual(SYS_DEPARTMENT_DUTIES.revenue, [
    "Rate, offer, inventory, and reporting requirements",
    "Revenue data definitions",
    "Commercial KPI mapping",
    "Forecast/reporting needs",
  ]);
  assert.deepEqual(SYS_DEPARTMENT_DUTIES.distribution, [
    "Channel Manager",
    "OTA/distribution",
    "Rate and availability flow",
    "Booking Engine handoff",
    "Provider coordination",
  ]);
  assert.deepEqual(SYS_DEPARTMENT_DUTIES.sales, [
    "Lead/source data",
    "Partner/market requirements",
    "CRM or contact flow",
    "Sales reporting needs",
  ]);
  assert.deepEqual(SYS_DEPARTMENT_DUTIES.management, [
    "Scope and budget approval",
    "System selection decision",
    "Data ownership",
    "Go-live approval",
    "Risk acceptance and final direction",
  ]);
  for (const department of SYS_DEPARTMENTS) {
    const count = SYS_STARTER_SUBTASKS.filter((item) => item.department === department).length;
    assert.ok(count >= 1 && count <= MAX_SYS_SUBTASKS);
  }
});

test("subtask progress is completed ÷ total and drives readiness", () => {
  const none = convSubtaskProgress([]);
  assert.equal(none.percent, 0);
  assert.equal(none.readiness, "not_started");
  assert.equal(none.countLabel, "0/0 completed");

  const partial = convSubtaskProgress([
    { completed: true, status: "completed" },
    { completed: false, status: "in_progress" },
    { completed: false, status: "not_started" },
    { completed: true, status: "completed" },
    { completed: false, status: "in_progress" },
  ]);
  assert.equal(partial.percent, 40);
  assert.equal(partial.readiness, "in_progress");
  assert.equal(partial.countLabel, "2/5 completed");

  const blocked = convSubtaskProgress([
    { completed: true, status: "completed" },
    { completed: false, status: "blocked" },
  ]);
  assert.equal(blocked.readiness, "blocked");

  const ready = convSubtaskProgress(
    [
      { completed: true, status: "completed" },
      { completed: true, status: "completed" },
    ],
    "testing",
    [{ status: "awaiting" }],
  );
  assert.equal(ready.percent, 100);
  assert.equal(ready.readiness, "ready_for_review");

  const done = convSubtaskProgress(
    [
      { completed: true, status: "completed" },
      { completed: true, status: "completed" },
    ],
    "handed_over",
    [{ status: "approved" }],
  );
  assert.equal(done.readiness, "completed");

  const revenue = convDepartmentProgress(
    [
      { completed: true, status: "completed", department: "revenue" },
      { completed: false, status: "in_progress", department: "revenue" },
      { completed: true, status: "completed", department: "marketing" },
    ],
    "revenue",
  );
  assert.equal(revenue.countLabel, "1/2 completed");
  assert.equal(revenue.readiness, "in_progress");
});

test("API keys, passwords, tokens, guest data, and payment data are blocked from ops fields", () => {
  assert.equal(textHasSecrets("password: hunter2secret"), true);
  assert.equal(textHasSecrets("api_key=sk_live_abcdefghijklmnopqrst"), true);
  assert.equal(payloadHasSecrets({ notes: "Bearer abcdefghijklmno" }), true);
  assert.equal(payloadHasSecrets({ notes: "guest email: guest@example.com" }), true);
  assert.equal(payloadHasSecrets({ notes: "guest data: room 12" }), true);
  assert.equal(payloadHasSecrets({ notes: "PMS Cloudbeds sandbox, no credentials" }), false);
});
