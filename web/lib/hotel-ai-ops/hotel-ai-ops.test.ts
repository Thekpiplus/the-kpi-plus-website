import assert from "node:assert/strict";
import test from "node:test";
import { haiSubtaskProgress } from "./progress";
import {
  HAI_APPROACHES,
  HAI_DEPARTMENT_DUTIES,
  HAI_DEPARTMENTS,
  HAI_FORM_TABS,
  HAI_GROUP_BY,
  HAI_SECTIONS,
  HAI_SECTION_PATH,
  HAI_SORTS,
  HAI_STARTER_SUBTASKS,
  HAI_STATUSES,
  HAI_SUBTASK_STATUSES,
  MAX_HAI_SUBTASKS,
  MIN_HAI_SUBTASKS,
  haiGateKind,
  payloadHasSecrets,
  textHasSecrets,
  webSectionFormTab,
  webSectionPath,
} from "./types";

test("Hotel AI Workflow has 14 menus, 11 statuses, and expandable departments", () => {
  assert.equal(HAI_SECTIONS.length, 14);
  assert.deepEqual([...HAI_SECTIONS], [
    "overview",
    "inventory",
    "backlog",
    "pilots",
    "use_cases",
    "data",
    "approvals",
    "tests",
    "issues",
    "metrics",
    "handover",
    "departments",
    "history",
    "settings",
  ]);
  assert.equal(HAI_STATUSES.length, 11);
  assert.deepEqual([...HAI_STATUSES], [
    "backlog",
    "discovery",
    "simplify",
    "ready_for_pilot",
    "pilot_running",
    "needs_review",
    "blocked",
    "approved_to_scale",
    "adjust",
    "stopped",
    "handed_over",
  ]);
  assert.deepEqual([...HAI_DEPARTMENTS], [
    "reservations",
    "revenue",
    "distribution",
    "marketing",
    "operations",
    "sales",
    "management",
    "it_data",
  ]);
  assert.deepEqual([...HAI_APPROACHES], ["simplify", "automate", "ai_assisted", "do_not_automate"]);
  assert.deepEqual([...HAI_GROUP_BY], ["status", "department", "property", "owner", "pilot_phase"]);
  assert.deepEqual([...HAI_SORTS], ["priority", "due", "risk", "updated"]);
  assert.ok(HAI_FORM_TABS.includes("workflow"));
  assert.ok(HAI_FORM_TABS.includes("charter"));
  for (const section of HAI_SECTIONS) {
    assert.match(HAI_SECTION_PATH[section], /^\/crm\/hotel-ai/);
    assert.ok(webSectionPath(section).startsWith("/crm/hotel-ai"));
  }
  assert.equal(webSectionFormTab("pilots"), "charter");
  assert.equal(webSectionFormTab("inventory"), "workflow");
  for (const department of HAI_DEPARTMENTS) {
    const count = HAI_STARTER_SUBTASKS.filter((item) => item.department === department).length;
    assert.ok(count >= MIN_HAI_SUBTASKS && count <= MAX_HAI_SUBTASKS);
    assert.ok(HAI_DEPARTMENT_DUTIES[department].length >= 1);
  }
  assert.deepEqual(HAI_DEPARTMENT_DUTIES.reservations, [
    "Enquiry intake",
    "Classification",
    "Handoff",
    "Guest-facing reply review",
    "Exception escalation",
  ]);
  assert.deepEqual(HAI_DEPARTMENT_DUTIES.revenue, [
    "Reporting workflow",
    "Metric definitions",
    "Data source approval",
    "Reviewer for numbers and decisions",
  ]);
  assert.deepEqual(HAI_DEPARTMENT_DUTIES.distribution, [
    "System/channel consistency",
    "Provider/API dependency",
    "Data ownership",
    "Integration testing",
  ]);
  assert.deepEqual(HAI_DEPARTMENT_DUTIES.marketing, [
    "Content briefs",
    "Approved brand voice",
    "Draft review",
    "Campaign approval before publication",
  ]);
  assert.deepEqual(HAI_DEPARTMENT_DUTIES.operations, [
    "SOP search",
    "Shift handover",
    "Service workflows",
    "Safety and policy review",
  ]);
  assert.deepEqual(HAI_DEPARTMENT_DUTIES.sales, [
    "Lead routing",
    "Follow-up ownership",
    "Account/partner workflows",
    "Approved summaries",
  ]);
  assert.deepEqual(HAI_DEPARTMENT_DUTIES.management, [
    "Scope",
    "Budget",
    "Success criteria",
    "Risk acceptance",
    "Scale/Adjust/Stop approval",
  ]);
  assert.deepEqual(HAI_DEPARTMENT_DUTIES.it_data, [
    "Access",
    "System connection",
    "Logging",
    "Security review",
    "Data retention",
    "Technical fallback",
  ]);
  assert.deepEqual([...HAI_SUBTASK_STATUSES], ["not_started", "in_progress", "blocked", "needs_review", "completed"]);
  assert.equal(haiGateKind("Safety and policy review", "operations"), "safety");
  assert.equal(haiGateKind("Access", "it_data"), "access");
  assert.equal(haiGateKind("Data retention", "it_data"), "privacy");
  assert.equal(MAX_HAI_SUBTASKS, 10);
  assert.equal(MIN_HAI_SUBTASKS, 1);
});

test("secrets, guest PII, and payment tokens are blocked from workflow notes", () => {
  assert.equal(textHasSecrets("api_key=sk_live_abc123456789"), true);
  assert.equal(textHasSecrets("password: hunter2"), true);
  assert.equal(textHasSecrets("Bearer abcdefghijklmnop"), true);
  assert.equal(textHasSecrets("guest email: a@b.com"), true);
  assert.equal(textHasSecrets("payment card: 4111"), true);
  assert.equal(payloadHasSecrets({ notes: "sk_live_notarealkey12" }), true);
  assert.equal(payloadHasSecrets({ notes: "Use the approved vault item named PMS-PROD" }), false);
  assert.equal(textHasSecrets("Map the reservation exception queue"), false);
});

test("the Hotel AI board has no import surface in types or section paths", () => {
  const joined = Object.values(HAI_SECTION_PATH).join(" ");
  assert.equal(/import/i.test(joined), false);
  assert.equal(HAI_SECTIONS.includes("import" as never), false);
});

test("each workflow has 1–10 subtasks and collaboration duties stay optional", () => {
  assert.equal(MIN_HAI_SUBTASKS, 1);
  assert.equal(MAX_HAI_SUBTASKS, 10);
  assert.deepEqual([...HAI_SUBTASK_STATUSES], ["not_started", "in_progress", "blocked", "needs_review", "completed"]);
  assert.equal(HAI_DEPARTMENT_DUTIES.reservations.includes("Enquiry intake"), true);
  assert.equal(HAI_DEPARTMENT_DUTIES.revenue.includes("Data source approval"), true);
  assert.equal(HAI_DEPARTMENT_DUTIES.it_data.includes("Security review"), true);
  assert.equal(HAI_DEPARTMENT_DUTIES.management.includes("Scale/Adjust/Stop approval"), true);
  const allDuties = HAI_DEPARTMENTS.flatMap((department) => HAI_DEPARTMENT_DUTIES[department]);
  assert.ok(allDuties.length > MAX_HAI_SUBTASKS);
  for (const department of HAI_DEPARTMENTS) {
    const starters = HAI_STARTER_SUBTASKS.filter((item) => item.department === department);
    assert.ok(starters.length >= MIN_HAI_SUBTASKS && starters.length <= MAX_HAI_SUBTASKS);
  }
});

test("blocked safety, access, or privacy tasks mark the workflow blocked even at high percent", () => {
  const almostDone = haiSubtaskProgress([
    { completed: true, status: "completed", gateKind: "none" },
    { completed: true, status: "completed", gateKind: "none" },
    { completed: true, status: "completed", gateKind: "none" },
    { completed: true, status: "completed", gateKind: "none" },
    { completed: false, status: "blocked", gateKind: "safety", name: "Safety and policy review" },
  ]);
  assert.equal(almostDone.percent, 80);
  assert.equal(almostDone.countLabel, "4/5 completed");
  assert.equal(almostDone.blockedByGate, true);
  assert.equal(almostDone.readiness, "blocked");
  assert.deepEqual(almostDone.gateReasons, ["safety"]);

  const accessBlock = haiSubtaskProgress([
    { completed: true, status: "completed" },
    { completed: false, status: "blocked", gateKind: "access", name: "Access" },
  ]);
  assert.equal(accessBlock.readiness, "blocked");
  assert.equal(haiGateKind("Access", "it_data"), "access");
  assert.equal(haiGateKind("Data retention", "it_data"), "privacy");
  assert.equal(haiGateKind("Safety and policy review", "operations"), "safety");

  const review = haiSubtaskProgress([
    { completed: false, status: "needs_review" },
    { completed: true, status: "completed" },
  ]);
  assert.equal(review.readiness, "ready_for_review");
});

test("subtask progress is completed ÷ total and drives readiness", () => {
  const none = haiSubtaskProgress([]);
  assert.equal(none.percent, 0);
  assert.equal(none.readiness, "not_started");
  assert.equal(none.countLabel, "0/0 completed");

  const partial = haiSubtaskProgress([
    { completed: true, status: "completed" },
    { completed: false, status: "in_progress" },
    { completed: false, status: "not_started" },
    { completed: true, status: "completed" },
    { completed: false, status: "in_progress" },
  ]);
  assert.equal(partial.percent, 40);
  assert.equal(partial.readiness, "in_progress");

  const blocked = haiSubtaskProgress([
    { completed: true, status: "completed" },
    { completed: false, status: "blocked" },
  ]);
  assert.equal(blocked.readiness, "blocked");

  const ready = haiSubtaskProgress(
    [
      { completed: true, status: "completed" },
      { completed: true, status: "completed" },
    ],
    "pilot_running",
    [{ status: "awaiting" }],
  );
  assert.equal(ready.percent, 100);
  assert.equal(ready.readiness, "ready_for_review");

  const done = haiSubtaskProgress(
    [
      { completed: true, status: "completed" },
      { completed: true, status: "completed" },
    ],
    "handed_over",
    [{ status: "approved" }],
  );
  assert.equal(done.readiness, "completed");

  const review = haiSubtaskProgress([
    { completed: true, status: "completed" },
    { completed: false, status: "needs_review" },
  ]);
  assert.equal(review.readiness, "ready_for_review");
  assert.equal(review.countLabel, "1/2 completed");

  const gated = haiSubtaskProgress([
    { completed: true, status: "completed" },
    { completed: true, status: "completed" },
    { completed: true, status: "completed" },
    { completed: true, status: "completed" },
    { completed: false, status: "blocked", gateKind: "privacy", name: "Data retention" },
  ]);
  assert.equal(gated.percent, 80);
  assert.equal(gated.blockedByGate, true);
  assert.equal(gated.readiness, "blocked");
  assert.equal(gated.countLabel, "4/5 completed");
});
