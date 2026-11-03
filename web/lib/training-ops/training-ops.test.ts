import assert from "node:assert/strict";
import test from "node:test";
import { ADMIN_MODULES, MODULE_PATH, moduleForPath } from "@/lib/crm/modules";
import { trnSubtaskProgress } from "./progress";
import {
  MAX_TRN_SUBTASKS,
  MIN_TRN_SUBTASKS,
  TRN_DEPARTMENTS,
  TRN_DEPARTMENT_DUTIES,
  TRN_DEPARTMENT_LABEL,
  TRN_DEPARTMENT_PATH,
  TRN_GROUP_BY,
  TRN_KINDS,
  TRN_PROGRAM_STATUSES,
  TRN_SECTIONS,
  TRN_SECTION_PATH,
  TRN_SORTS,
  TRN_STARTER_SUBTASKS,
  emptyPayload,
  payloadHasIndividualScores,
  payloadHasSecrets,
  textHasSecrets,
  trnGateKind,
  webSectionPath,
} from "./types";

test("Hotel Training Operations has 17 menus and 9 expandable departments", () => {
  assert.equal(TRN_SECTIONS.length, 17);
  assert.deepEqual([...TRN_SECTIONS], [
    "overview",
    "requests",
    "calendar",
    "programs",
    "groups",
    "needs",
    "materials",
    "sessions",
    "assessment",
    "followup",
    "trainers",
    "departments",
    "feedback",
    "reports",
    "approvals",
    "history",
    "settings",
  ]);
  assert.deepEqual([...TRN_DEPARTMENTS], [
    "reservations",
    "revenue",
    "distribution",
    "marketing",
    "operations",
    "sales",
    "management",
    "hr_ld",
    "it_data",
  ]);
  assert.deepEqual([...TRN_GROUP_BY], ["status", "department", "property", "trainer", "program", "date"]);
  assert.deepEqual([...TRN_SORTS], ["date", "priority", "updated"]);
  assert.deepEqual([...TRN_PROGRAM_STATUSES], ["draft", "review", "approved", "published", "archived"]);
  for (const section of TRN_SECTIONS) {
    assert.match(TRN_SECTION_PATH[section], /^\/crm\/training/);
    assert.ok(webSectionPath(section).startsWith("/crm/training"));
  }
  for (const department of TRN_DEPARTMENTS) {
    assert.match(TRN_DEPARTMENT_PATH[department], /^\/crm\/training\/departments\//);
    const starters = TRN_STARTER_SUBTASKS.filter((item) => item.department === department);
    assert.ok(starters.length >= MIN_TRN_SUBTASKS && starters.length <= MAX_TRN_SUBTASKS);
    assert.ok(TRN_DEPARTMENT_DUTIES[department].length >= 1);
  }
});

test("request, program, session, and assessment payloads cover required fields", () => {
  const payload = emptyPayload();
  for (const key of [
    "requester",
    "targetRoles",
    "goal",
    "skillGap",
    "format",
    "learnerCount",
    "dateWindow",
    "category",
    "audience",
    "outcomes",
    "agenda",
    "materials",
    "duration",
    "durationConfirmed",
    "assessmentMethod",
    "followUpMethod",
    "language",
    "trainerName",
    "programName",
    "facilitator",
    "learnerGroup",
    "attendanceStatus",
    "materialsLink",
    "activityPlan",
    "rubric",
    "aggregatedResult",
    "reviewer",
    "period",
    "visibility",
    "followUpAction",
  ]) {
    assert.ok(key in payload);
  }
  assert.equal(payload.visibility, "aggregate");
  assert.equal(payload.attendanceStatus, "not_set");
  assert.equal(payload.durationConfirmed, false);
  assert.deepEqual([...TRN_KINDS], [
    "request",
    "program",
    "group",
    "needs",
    "material",
    "session",
    "assessment",
    "action",
    "trainer",
    "feedback",
    "report",
  ]);
});

test("individual learner scores, staff IDs, and guest data are blocked", () => {
  assert.equal(textHasSecrets("password: hunter2"), true);
  assert.equal(textHasSecrets("employee_id: 4412"), true);
  assert.equal(textHasSecrets("learner score: 92"), true);
  assert.equal(textHasSecrets("คะแนนรายบุคคล: 88"), true);
  assert.equal(textHasSecrets("guest email: a@b.com"), true);
  assert.equal(payloadHasSecrets({ aggregatedResult: "score for employee 12 is 90" }), true);
  assert.equal(payloadHasIndividualScores({ aggregatedResult: "score for employee 12 is 90" }), true);
  assert.equal(payloadHasIndividualScores({ aggregatedResult: "Front desk average 4/5" }), false);
  assert.equal(payloadHasSecrets({ aggregatedResult: "Front desk average 4/5" }), false);
  assert.equal(textHasSecrets("Front desk workshop for reservation roles"), false);
});

test("the Training Ops board has no import surface", () => {
  const joined = `${Object.values(TRN_SECTION_PATH).join(" ")} ${TRN_SECTIONS.join(" ")}`;
  assert.equal(/import/i.test(joined), false);
  assert.equal(TRN_SECTIONS.includes("import" as never), false);
});

test("training is a CRM module at /crm/training and not a public service route", () => {
  assert.ok(ADMIN_MODULES.includes("training"));
  assert.equal(MODULE_PATH.training, "/crm/training");
  assert.equal(moduleForPath("/crm/training/requests"), "training");
  assert.equal(moduleForPath("/solutions/hotel-training-team-development"), null);
});

test("department workspaces have dedicated CRM paths", () => {
  assert.equal(TRN_DEPARTMENT_PATH.reservations, "/crm/training/departments/reservations");
  assert.equal(TRN_DEPARTMENT_PATH.hr_ld, "/crm/training/departments/hr-ld");
  assert.equal(TRN_DEPARTMENT_PATH.it_data, "/crm/training/departments/it-data");
  assert.equal(TRN_DEPARTMENT_LABEL.operations, "Operations / Guest Experience");
});

test("department duties cover coordination and follow-up use cases", () => {
  assert.deepEqual(TRN_DEPARTMENT_DUTIES.reservations, ["Guest-service conversation", "Reservation workflow", "Handover", "Service recovery"]);
  assert.ok(TRN_DEPARTMENT_DUTIES.revenue.includes("KPI / data literacy"));
  assert.ok(TRN_DEPARTMENT_DUTIES.distribution.includes("Escalation and ownership"));
  assert.ok(TRN_DEPARTMENT_DUTIES.marketing.includes("Brand review and approval"));
  assert.ok(TRN_DEPARTMENT_DUTIES.operations.includes("Safety escalation"));
  assert.ok(TRN_DEPARTMENT_DUTIES.sales.includes("Follow-up ownership"));
  assert.ok(TRN_DEPARTMENT_DUTIES.management.includes("Budget / scope approval"));
  assert.ok(TRN_DEPARTMENT_DUTIES.hr_ld.includes("Trainer approval"));
  assert.ok(TRN_DEPARTMENT_DUTIES.hr_ld.includes("Participant permission"));
  assert.ok(TRN_DEPARTMENT_DUTIES.it_data.includes("Data handling"));
  assert.equal(trnGateKind("Safety escalation", "operations"), "safety");
  assert.equal(trnGateKind("Trainer approval", "hr_ld"), "trainer_approval");
  assert.equal(trnGateKind("Participant permission", "hr_ld"), "participant_permission");
  assert.equal(trnGateKind("Data handling", "it_data"), "privacy");
  assert.equal(trnGateKind("Evaluation and records", "hr_ld"), "privacy");
});

test("blocked training gates stop delivery even when completion is high", () => {
  const gated = trnSubtaskProgress([
    { completed: true, status: "completed", gateKind: "none" },
    { completed: true, status: "completed", gateKind: "none" },
    { completed: true, status: "completed", gateKind: "none" },
    { completed: true, status: "completed", gateKind: "none" },
    { completed: false, status: "blocked", gateKind: "privacy", name: "Data handling" },
  ]);
  assert.equal(gated.percent, 80);
  assert.equal(gated.countLabel, "4/5 completed");
  assert.equal(gated.blockedByGate, true);
  assert.equal(gated.readiness, "blocked");
  assert.deepEqual(gated.gateReasons, ["privacy"]);

  const trainer = trnSubtaskProgress([
    { completed: true, status: "completed", gateKind: "none" },
    { completed: false, status: "blocked", gateKind: "trainer_approval", name: "Trainer approval" },
  ]);
  assert.equal(trainer.blockedByGate, true);
  assert.equal(trainer.readiness, "blocked");

  const ready = trnSubtaskProgress([
    { completed: true, status: "completed", gateKind: "privacy" },
    { completed: true, status: "completed", gateKind: "safety" },
  ]);
  assert.equal(ready.blockedByGate, false);
  assert.equal(ready.percent, 100);
});
