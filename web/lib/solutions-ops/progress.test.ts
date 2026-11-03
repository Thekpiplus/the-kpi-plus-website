import assert from "node:assert/strict";
import test from "node:test";
import { canDecideSubtask, canTouchSubtask, solGateBlock, solNextDue, solPrimaryOwner, solSubtaskProgress } from "./progress";
import {
  MAX_SOL_SUBTASKS,
  MIN_SOL_SUBTASKS,
  SOL_BLOCKING_GATES,
  SOL_GROUP_BY,
  allDepartments,
  blockedByGateMessage,
  hasContactPattern,
  hasSensitiveText,
  isKnownDepartment,
  parseSettings,
  slugifyDepartmentId,
} from "./types";

test("subtask limits and blocking gates match the spec", () => {
  assert.equal(MIN_SOL_SUBTASKS, 1);
  assert.equal(MAX_SOL_SUBTASKS, 10);
  assert.deepEqual([...SOL_BLOCKING_GATES], ["permission", "evidence", "privacy", "approval"]);
  assert.ok(SOL_GROUP_BY.includes("owner"));
});

test("progress counts completed subtasks and formats the label", () => {
  const progress = solSubtaskProgress([
    { completed: true, status: "completed" },
    { completed: true, status: "completed" },
    { completed: true, status: "completed" },
    { completed: false, status: "in_progress" },
    { completed: false, status: "not_started" },
  ]);
  assert.equal(progress.total, 5);
  assert.equal(progress.completed, 3);
  assert.equal(progress.percent, 60);
  assert.equal(progress.countLabel, "3/5 completed");
  assert.equal(progress.blockedByGate, false);
  assert.equal(progress.readiness, "in_progress");
  assert.equal(solSubtaskProgress([]).readiness, "not_started");
  assert.equal(solSubtaskProgress([]).countLabel, "0/0 completed");
  assert.equal(solSubtaskProgress([{ completed: true, status: "completed" }]).readiness, "completed");
});

test("blocked + blocking gate stops approve/publish/close even at high completion", () => {
  const gated = solSubtaskProgress([
    { completed: true, status: "completed", gateKind: "none" },
    { completed: true, status: "completed", gateKind: "none" },
    { completed: false, status: "blocked", gateKind: "privacy" },
    { completed: false, status: "blocked", gateKind: "evidence" },
    { completed: false, status: "blocked", gateKind: "privacy" },
  ]);
  assert.equal(gated.blockedByGate, true);
  assert.equal(gated.readiness, "blocked");
  assert.deepEqual(gated.gateReasons, ["privacy", "evidence"]);

  const block = solGateBlock([{ completed: false, status: "blocked", gateKind: "approval" }]);
  assert.equal(block?.error, "blocked_by_gate");
  assert.deepEqual(block?.gates, ["approval"]);
  assert.match(block?.message ?? "", /Approval/);
  assert.match(blockedByGateMessage(["permission", "evidence"]), /Permission.*Evidence/);
});

test("blocked without a gate, or a gate that is not blocked, does not block parents", () => {
  assert.equal(solGateBlock([{ completed: false, status: "blocked", gateKind: "none" }]), null);
  assert.equal(solGateBlock([{ completed: false, status: "in_progress", gateKind: "privacy" }]), null);
  assert.equal(solGateBlock([{ completed: true, status: "completed", gateKind: "evidence" }]), null);
  // …but a blocked subtask without a gate still marks readiness as blocked.
  assert.equal(solSubtaskProgress([{ completed: false, status: "blocked", gateKind: "none" }]).readiness, "blocked");
  assert.equal(solSubtaskProgress([{ completed: false, status: "needs_review" }]).readiness, "ready_for_review");
});

test("sorting helpers: next due, primary owner", () => {
  assert.equal(
    solNextDue(
      [
        { completed: false, dueAt: "2026-12-10T00:00:00.000Z" },
        { completed: false, dueAt: "2026-11-20T00:00:00.000Z" },
        { completed: true, dueAt: "2026-01-01T00:00:00.000Z" },
      ],
      "2027-01-01T00:00:00.000Z",
    ),
    "2026-11-20T00:00:00.000Z",
  );
  assert.equal(solNextDue([], "fallback"), "fallback");
  assert.equal(solPrimaryOwner([]), "none");
  assert.equal(
    solPrimaryOwner([
      { completed: false, priority: "low", ownerId: "a" },
      { completed: false, priority: "urgent", ownerId: "b" },
      { completed: true, priority: "urgent", ownerId: "c" },
    ]),
    "b",
  );
});

test("extra departments merge with the core nine and accept slugified ids", () => {
  const settings = parseSettings(JSON.stringify({ extraDepartments: [{ id: "Guest Relations", label: "Guest Relations" }, { id: "revenue", label: "dup" }] }));
  assert.deepEqual(settings.extraDepartments, [{ id: "guest-relations", label: "Guest Relations" }]);
  const all = allDepartments(settings);
  assert.equal(all.length, 10);
  assert.equal(all[9].id, "guest-relations");
  assert.equal(isKnownDepartment("guest-relations", settings), true);
  assert.equal(isKnownDepartment("guest-relations", null), false);
  assert.equal(isKnownDepartment("revenue", null), true);
  assert.equal(slugifyDepartmentId("  F&B / Banquets! "), "f-b-banquets");
  assert.equal(slugifyDepartmentId("แผนกไทย"), "");
  assert.deepEqual(parseSettings("{}").extraDepartments, []);
});

test("subtask access: owner/reviewer and department grants", () => {
  const access = { userId: "u1", departments: ["sales"], isManagement: false, canEdit: true, canApprove: false };
  assert.equal(canTouchSubtask(access, { department: "sales" }, "revenue"), true);
  assert.equal(canTouchSubtask(access, { department: "marketing" }, "sales"), true);
  assert.equal(canTouchSubtask(access, { department: "marketing" }, "revenue"), false);
  assert.equal(canTouchSubtask(access, { department: "marketing", ownerId: "u1" }, "revenue"), true);
  assert.equal(canTouchSubtask(access, { department: "marketing" }, null), true);
  assert.equal(canTouchSubtask({ ...access, canEdit: false }, { department: "sales" }, null), false);
  assert.equal(canDecideSubtask(access, "u1"), true);
  assert.equal(canDecideSubtask(access, "u2"), false);
  assert.equal(canDecideSubtask({ ...access, canApprove: true }, "u2"), true);
});

test("subtask text blocks secrets and contact details", () => {
  assert.equal(hasSensitiveText("password: hunter2"), true);
  assert.equal(hasContactPattern("call 081 234 5678"), true);
  assert.equal(hasContactPattern("mail guest@example.com"), true);
  assert.equal(hasSensitiveText("Confirm image permission for hero photo"), false);
  assert.equal(hasContactPattern("Confirm image permission for hero photo"), false);
});
