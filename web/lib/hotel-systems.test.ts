import assert from "node:assert/strict";
import test from "node:test";
import {
  SYSTEMS_HERO_FLOW,
  SYSTEMS_HERO_LEGEND,
  SYSTEMS_HERO_PATH,
  SYSTEMS_LANDSCAPE_FIELDS,
  SYSTEMS_BEFORE_AFTER_NOTE,
  SYSTEMS_BEFORE_AFTER_PATH,
  SYSTEMS_BEFORE_AFTER_SYSTEMS,
  SYSTEMS_LANDSCAPE_NOTE,
  SYSTEMS_LANDSCAPE_PATH,
  SYSTEMS_DELIVERABLES,
  SYSTEMS_DELIVERABLES_COLUMNS,
  SYSTEMS_DELIVERABLES_VISUAL,
  SYSTEMS_MODEL_STEPS,
  SYSTEMS_MODEL_VISUAL,
  SYSTEMS_READINESS_STATUSES,
  SYSTEMS_WORKFLOW,
  SYSTEMS_WORKFLOW_FIELDS,
  SYSTEMS_WORKFLOW_GATE,
  SYSTEMS_WORKFLOW_OUTPUTS,
  SYSTEMS_WORKFLOW_VISUAL,
  SYSTEMS_FIT_SCENARIOS,
  SYSTEMS_FIT_COLUMNS,
  SYSTEMS_FIT_VISUAL,
  SYSTEMS_INVENTORY_COLUMNS,
  SYSTEMS_INVENTORY_ENVIRONMENTS,
  SYSTEMS_INVENTORY_LABELS,
  SYSTEMS_INVENTORY_VISUAL,
  SYSTEMS_DICTIONARY_COLUMNS,
  SYSTEMS_PLATFORM_STATUSES,
  SYSTEMS_TESTING_CASES,
  SYSTEMS_TESTING_COLUMNS,
  SYSTEMS_TESTING_ERROR_FLOW,
  SYSTEMS_TESTING_ERROR_PATH,
  SYSTEMS_TESTING_ISSUE_FIELDS,
  SYSTEMS_TESTING_STATUSES,
  SYSTEMS_TESTING_VISUAL,
  SYSTEMS_SCOPE_BOUNDARY,
  SYSTEMS_SCOPE_COLUMNS,
  SYSTEMS_SCOPE_ROWS,
  SYSTEMS_SCOPE_VISUAL,
  SYSTEMS_RESPONSIBILITY_MATRIX,
  SYSTEMS_HANDOVER_CHECKLIST,
  SYSTEMS_HANDOVER_CHECKLIST_COLUMNS,
  SYSTEMS_HANDOVER_NOTE,
  SYSTEMS_OWNERSHIP_COLUMNS,
  SYSTEMS_OWNERSHIP_ROWS,
  SYSTEMS_PLAN_VISUAL,
  SYSTEMS_ENQUIRY_FLOW,
  SYSTEMS_ENQUIRY_GOALS,
  SYSTEMS_ENQUIRY_RECEIVE,
  SYSTEMS_ENQUIRY_VISUAL,
  hotelSystemsCopy,
  hotelSystemsEnquiryCopy,
  hotelSystemsFaqs,
  hotelSystemsFaqsAreStale,
  systemsEnquiryReceiveAreStale,
  systemsEnquiryStepsAreStale,
  systemsEnquiryVisualSrc,
  systemsFitCmsRows,
  systemsFitRowsAreStale,
  systemsDictionaryCmsRows,
  systemsDictionaryRowsAreStale,
  systemsInventoryCmsRows,
  systemsInventoryRowsAreStale,
  systemsInventoryStatus,
  systemsIsLibraryPlaceholder,
  systemsPlatformLogoSrc,
  systemsKpiStatusLabel,
  systemsLandscapeCmsItems,
  systemsLandscapeConnectionsAreStale,
  systemsLandscapeItemsAreStale,
  systemsAssessmentCmsRows,
  systemsAssessmentRowsAreStale,
  systemsBeforeAfterCmsFields,
  systemsBeforeAfterFieldsAreStale,
  systemsBeforeAfterNoteIsStale,
  systemsReadinessCmsRows,
  systemsReadinessRowsAreStale,
  systemsTestingCmsCases,
  systemsTestingCasesAreStale,
  systemsTestingErrorCmsSteps,
  systemsTestingErrorStepsAreStale,
  systemsTestingPassedIsSample,
  systemsScopeCmsRows,
  systemsScopeRowsAreStale,
  systemsResponsibilityCmsRows,
  systemsResponsibilityRowsAreStale,
  systemsCredentialSafeText,
  systemsHandoverCmsItems,
  systemsHandoverChecklistStatus,
  systemsHandoverItemsAreStale,
  systemsOwnershipCmsRows,
  systemsOwnershipRowsAreStale,
  systemsOwnershipStatus,
  systemsWorkflowCmsSteps,
  systemsWorkflowGateIsStale,
  systemsWorkflowStepsAreStale,
  systemsLandscapePathIsStale,
  systemsPlatformStatus,
  systemsRenderableSrc,
  systemsSampleSafeText,
  systemsShowsSampleBadge,
} from "./hotel-systems";

test("library placeholders are not rendered as public evidence", () => {
  assert.equal(systemsIsLibraryPlaceholder("/images/hotel-systems-landscape-placeholder.webp"), true);
  assert.equal(systemsRenderableSrc("/images/hotel-systems-landscape-placeholder.webp", "sample"), "");
  assert.equal(systemsRenderableSrc("/media/cms/approved-architecture.webp", "sample"), "/media/cms/approved-architecture.webp");
  assert.equal(systemsShowsSampleBadge("sample"), true);
  assert.equal(systemsShowsSampleBadge("approved"), false);
});

test("landscape seed follows Guest to Website / Booking Engine to PMS with a Channel Manager fork", () => {
  const items = systemsLandscapeCmsItems();
  const ids = new Set<string>(items.map((item) => item.id));
  for (const id of ["guest", "website", "pms", "cm", "ota", "reporting", "team"] as const) {
    assert.equal(ids.has(id), true);
  }
  assert.equal(ids.has("engine"), false);
  const website = items.find((item) => item.id === "website");
  assert.equal(website?.titleEn, "Website / Booking Engine");
  assert.match(website?.connectorEn || "", /Sample API \/ connector/);
  assert.equal(SYSTEMS_LANDSCAPE_FIELDS.role.en, "Role");
  assert.equal(SYSTEMS_LANDSCAPE_FIELDS.dataIn.en, "Data In");
  assert.equal(SYSTEMS_LANDSCAPE_FIELDS.dataOut.en, "Data Out");
  assert.equal(SYSTEMS_LANDSCAPE_FIELDS.connector.en, "Connector / API");
  assert.match(SYSTEMS_LANDSCAPE_PATH.en, /Guest \/ Booking Source → Website \/ Booking Engine → PMS \/ Reservation System → Channel Manager/);
  assert.match(SYSTEMS_LANDSCAPE_NOTE.en, /Data Flow depends on the provider, API\/connector, field mapping, permission, and agreed scope/);
});

test("stale landscape CMS falls back when Website and Booking Engine are split", () => {
  assert.equal(systemsLandscapeItemsAreStale([]), true);
  assert.equal(
    systemsLandscapeItemsAreStale([
      { id: "guest" },
      { id: "website", titleEn: "Website" },
      { id: "engine", titleEn: "Booking Engine" },
      { id: "pms" },
      { id: "cm" },
      { id: "ota" },
      { id: "reporting" },
      { id: "team" },
    ]),
    true,
  );
  assert.equal(systemsLandscapeItemsAreStale(systemsLandscapeCmsItems()), false);
  assert.equal(systemsLandscapeConnectionsAreStale([{ id: "website-engine", from: "website", to: "engine" }]), true);
  assert.equal(systemsLandscapeConnectionsAreStale([{ id: "website-pms", from: "website", to: "pms" }]), true);
  assert.equal(systemsLandscapePathIsStale("Guest → Website → Booking Engine → PMS"), true);
  assert.equal(systemsLandscapePathIsStale("Guest → Website / Booking Engine → PMS → Channel Manager → OTA / Reporting → Hotel Team"), true);
  assert.equal(systemsLandscapePathIsStale("Guest / Booking Source → Website / Booking Engine → PMS / Reservation System → Channel Manager → OTA / Distribution · Reporting / Dashboard → Hotel Team / Decisions"), false);
});

test("review checklist covers eight sample problems and is not the hero path", () => {
  const rows = systemsAssessmentCmsRows();
  assert.equal(rows.length, 8);
  assert.equal(systemsAssessmentRowsAreStale(rows), false);
  assert.equal(systemsAssessmentRowsAreStale(rows.slice(0, 4)), true);
  assert.equal(
    rows.some((row) => /PMS → Channel Manager → OTA \/ Booking Engine/.test(`${row.questionEn} ${row.evidenceEn}`)),
    false,
  );
});

test("before/after seed is a managed path, not full automation", () => {
  const fields = systemsBeforeAfterCmsFields();
  assert.equal(fields.map((item) => item.id).join(","), "connected,mapping,provider,manual,next-owner");
  assert.equal(systemsBeforeAfterFieldsAreStale(fields), false);
  assert.equal(systemsBeforeAfterFieldsAreStale(fields.slice(0, 2)), true);
  assert.equal(SYSTEMS_BEFORE_AFTER_SYSTEMS.map((item) => item.en).join(" + "), "PMS + Spreadsheet + OTA + Booking Engine + Reports");
  assert.equal(SYSTEMS_MODEL_STEPS.map((step) => step.label).join(" → "), SYSTEMS_BEFORE_AFTER_PATH);
  assert.match(SYSTEMS_BEFORE_AFTER_NOTE.th, /Data Mapping, Owner, Error Handling และขั้นตอนทำงานหลังการเชื่อมต่อ/);
  assert.equal(systemsBeforeAfterNoteIsStale(""), true);
  assert.equal(systemsBeforeAfterNoteIsStale(SYSTEMS_BEFORE_AFTER_NOTE.th), false);
  assert.equal(SYSTEMS_MODEL_VISUAL.labelEn, "Disconnected Systems to Managed Data Flow — Sample");
  assert.equal(SYSTEMS_MODEL_VISUAL.displayWidth, 720);
  assert.equal(SYSTEMS_MODEL_VISUAL.displayHeight, 405);
});

test("readiness matrix has six sample rows and does not mark every row Ready", () => {
  const rows = systemsReadinessCmsRows();
  assert.equal(rows.map((row) => row.id).join(","), "current-systems,data-mapping,access,integration,testing,ownership");
  assert.equal(rows.map((row) => row.areaEn).join(","), "Current Systems,Data Mapping,Access,Integration,Testing,Ownership");
  assert.equal(rows.map((row) => row.status).join(","), "needs_review,not_configured,pending_access,requires_provider_support,not_configured,blocked");
  assert.equal(systemsReadinessRowsAreStale(rows), false);
  assert.equal(systemsReadinessRowsAreStale(rows.slice(0, 5)), true);
  assert.equal(rows.every((row) => String(row.status) === "ready"), false);
  assert.equal(systemsReadinessRowsAreStale(rows.map((row) => ({ ...row, status: "ready" }))), true);
  assert.equal(rows.find((row) => row.id === "current-systems")?.output, "System Map");
  assert.equal(rows.find((row) => row.id === "data-mapping")?.output, "Data Dictionary and Mapping Plan");
  assert.equal(rows.find((row) => row.id === "access")?.output, "Access Plan");
  assert.equal(rows.find((row) => row.id === "integration")?.output, "Integration Plan");
  assert.equal(rows.find((row) => row.id === "testing")?.output, "QA Report");
  assert.equal(rows.find((row) => row.id === "ownership")?.output, "Handover Plan");
  assert.equal(rows.find((row) => row.id === "current-systems")?.inspectEn, "System inventory, provider, purpose, and owner");
  assert.equal(rows.find((row) => row.id === "data-mapping")?.inspectEn, "Room, rate, availability, reservation, cancellation, and channel fields");
  assert.equal(rows.find((row) => row.id === "access")?.inspectEn, "Administrator, technical contact, and API/connector permission");
  assert.equal(rows.find((row) => row.id === "integration")?.inspectEn, "API/connector support, limitations, license, and provider dependency");
  assert.equal(rows.find((row) => row.id === "testing")?.inspectEn, "Normal cases, errors, missing fields, duplicate records, and cancellations");
  assert.equal(rows.find((row) => row.id === "ownership")?.inspectEn, "Owner when data is wrong or sync fails");
  assert.equal(rows.find((row) => row.id === "ownership")?.evidenceEn, "RACI/Owner List");
  assert.equal(SYSTEMS_DELIVERABLES_COLUMNS.inspect.en, "What to check");
  assert.equal(SYSTEMS_DELIVERABLES_COLUMNS.status.en, "Current status");
  assert.deepEqual(
    SYSTEMS_READINESS_STATUSES.map((item) => item.label),
    ["Ready", "Needs Review", "Blocked", "Pending Access", "Requires Provider Support", "Not Configured"],
  );
  assert.equal(SYSTEMS_DELIVERABLES_VISUAL.labelEn, "Hotel Systems Implementation Readiness — Sample");
  assert.equal(SYSTEMS_DELIVERABLES_VISUAL.displayWidth, 720);
  assert.equal(SYSTEMS_DELIVERABLES_VISUAL.displayHeight, 405);
  assert.equal(SYSTEMS_DELIVERABLES_VISUAL.sourceWidth, 1600);
  assert.equal(SYSTEMS_DELIVERABLES_VISUAL.sourceHeight, 900);
  assert.equal(SYSTEMS_DELIVERABLES.every((row) => String(row.status) !== "ready"), true);
});

test("implementation workflow is five named steps with a Go-live gate", () => {
  const steps = systemsWorkflowCmsSteps();
  assert.equal(steps.map((step) => step.id).join(","), "discover,map,configure,test,handover");
  assert.equal(steps.map((step) => step.label).join(","), "Discover,Map,Configure,Test,Handover");
  assert.equal(steps.map((step) => step.titleEn).join(","), "Discover,Map,Configure,Test,Handover");
  assert.deepEqual(
    steps.map((step) => step.output),
    [...SYSTEMS_WORKFLOW_OUTPUTS],
  );
  assert.equal(steps[0]?.bodyEn, "Collect System Inventory, goals, owners, requirements, constraints, and provider contacts.");
  assert.equal(steps[1]?.bodyEn, "Define System Architecture, Source of Truth, field mapping, data flow, and dependencies.");
  assert.equal(steps[2]?.bodyEn, "Configure approved settings and coordinate with providers within access and scope.");
  assert.equal(steps[3]?.bodyEn, "Test normal flow, modifications, cancellations, missing fields, errors, permissions, and user handoff.");
  assert.equal(steps[4]?.bodyEn, "Deliver documentation, SOP, owner list, troubleshooting path, and approval record.");
  assert.equal(SYSTEMS_WORKFLOW_FIELDS.approval.en, "Approval point");
  assert.equal(SYSTEMS_WORKFLOW_FIELDS.next.en, "Next decision");
  assert.equal(
    SYSTEMS_WORKFLOW_GATE.en,
    "Go-live requires approved test results, owner sign-off, provider readiness, and a rollback or issue-handling plan where applicable.",
  );
  assert.equal(systemsWorkflowGateIsStale(SYSTEMS_WORKFLOW_GATE.en), false);
  assert.equal(systemsWorkflowGateIsStale("Hotel or provider approval points"), true);
  assert.equal(systemsWorkflowStepsAreStale(steps), false);
  assert.equal(systemsWorkflowStepsAreStale(steps.slice(0, 3)), true);
  assert.equal(systemsWorkflowStepsAreStale([{ id: "audit", label: "AUDIT", output: "Plan" }]), true);
  assert.equal(SYSTEMS_WORKFLOW_VISUAL.labelEn, "Hotel Systems Implementation Workflow — Sample");
  assert.equal(SYSTEMS_WORKFLOW_VISUAL.displayWidth, 640);
  assert.equal(SYSTEMS_WORKFLOW_VISUAL.displayHeight, 360);
  assert.equal(SYSTEMS_WORKFLOW_VISUAL.sourceWidth, 1600);
  assert.equal(SYSTEMS_WORKFLOW_VISUAL.sourceHeight, 900);
  assert.equal(SYSTEMS_WORKFLOW.every((step) => Boolean(step.ownerEn && step.inputEn && step.actionEn && step.approvalEn && step.dependencyEn && step.nextEn)), true);
});

test("hero architecture sample never marks a system Connected", () => {
  assert.match(SYSTEMS_HERO_PATH, /PMS → Channel Manager → OTA \/ Booking Engine → Reporting/);
  assert.equal(
    SYSTEMS_HERO_FLOW.every((item) => String(item.status) !== "connected"),
    true,
  );
  assert.equal(
    SYSTEMS_HERO_LEGEND.map((item) => item.id).join(","),
    "needs_mapping,requires_provider_support,pending_access,not_configured",
  );
});

test("platform landscape is a six-category map, not a logo wall", () => {
  const rows = systemsFitCmsRows();
  assert.equal(rows.map((row) => row.id).join(","), "pms,channel,booking,revenue,analytics,communication");
  assert.equal(rows.map((row) => row.categoryEn).join(","), "PMS / Property Management,Channel Manager / Distribution,Booking Engine / Direct Booking,Revenue / Rate Management,Analytics / Reporting,Communication / Guest Experience");
  assert.equal(rows.every((row) => !row.logoSrc), true);
  assert.equal(systemsFitRowsAreStale(rows), false);
  assert.equal(systemsFitRowsAreStale(rows.slice(0, 3)), true);
  assert.equal(systemsFitRowsAreStale(rows.map((row) => ({ ...row, logoSrc: "/brand/platforms/cloudbeds.png" }))), true);
  assert.equal(SYSTEMS_FIT_COLUMNS.example.en, "Example or existing system");
  assert.equal(SYSTEMS_FIT_COLUMNS.verification.en, "Technical verification status");
  assert.deepEqual(
    SYSTEMS_PLATFORM_STATUSES.map((item) => item.label),
    ["Existing client system", "Example category", "Supported via provider/API", "Requires technical verification", "Not yet verified", "Not in current scope"],
  );
  assert.equal(SYSTEMS_FIT_VISUAL.labelEn, "Hotel Technology Landscape — Example Categories");
  assert.equal(SYSTEMS_FIT_VISUAL.displayWidth, 720);
  assert.equal(SYSTEMS_FIT_VISUAL.displayHeight, 405);
  assert.equal(SYSTEMS_FIT_VISUAL.sourceWidth, 1600);
  assert.equal(SYSTEMS_FIT_VISUAL.sourceHeight, 900);
  assert.equal(SYSTEMS_FIT_SCENARIOS.every((row) => String(row.integrationStatus) !== "verified_integration"), true);
  assert.equal(systemsPlatformLogoSrc("/brand/platforms/cloudbeds.png", "replace"), "");
  assert.equal(systemsPlatformLogoSrc("/brand/platforms/cloudbeds.png", "sample"), "/brand/platforms/cloudbeds.png");
  assert.equal(systemsPlatformLogoSrc("Cloudbeds", "sample"), "");
  assert.equal(systemsPlatformLogoSrc("/images/hotel-systems-platforms-placeholder.webp", "sample"), "");
});

test("platform and KPI labels stay honest", () => {
  assert.equal(systemsPlatformStatus("example_category").label, "Example category");
  assert.equal(systemsPlatformStatus("verified_integration").label, "Requires technical verification");
  assert.equal(systemsPlatformStatus("connected").label, "Requires technical verification");
  assert.equal(systemsPlatformStatus("not_yet_verified").label, "Not yet verified");
  assert.equal(systemsKpiStatusLabel("sample", "en"), "Sample");
  assert.equal(systemsKpiStatusLabel("not-configured", "en"), "Not Configured");
});

test("inventory and dictionary seed is a sample table, not live hotel data", () => {
  const rows = systemsInventoryCmsRows();
  const fields = systemsDictionaryCmsRows();
  assert.equal(rows.map((row) => row.id).join(","), "pms,channel,booking,ota,reporting,crm");
  assert.equal(rows.map((row) => row.systemEn).join(","), "PMS,Channel Manager,Booking Engine,OTA/Distribution,Reporting,CRM/Guest Communication");
  assert.equal(SYSTEMS_INVENTORY_COLUMNS.system.en, "System");
  assert.equal(SYSTEMS_INVENTORY_COLUMNS.provider.en, "Provider");
  assert.equal(SYSTEMS_INVENTORY_COLUMNS.purpose.en, "Purpose");
  assert.equal(SYSTEMS_INVENTORY_COLUMNS.owner.en, "Owner");
  assert.equal(SYSTEMS_INVENTORY_COLUMNS.dataIn.en, "Data In");
  assert.equal(SYSTEMS_INVENTORY_COLUMNS.dataOut.en, "Data Out");
  assert.equal(SYSTEMS_INVENTORY_COLUMNS.connector.en, "API/Connector");
  assert.equal(SYSTEMS_INVENTORY_COLUMNS.environment.en, "Environment");
  assert.equal(SYSTEMS_INVENTORY_COLUMNS.status.en, "Status");
  assert.equal(SYSTEMS_INVENTORY_COLUMNS.reviewed.en, "Last reviewed");
  assert.deepEqual(
    SYSTEMS_INVENTORY_ENVIRONMENTS.map((item) => item.label),
    ["Production", "Sandbox", "Unknown"],
  );
  assert.equal(SYSTEMS_INVENTORY_LABELS.sample.en, "Sample data");
  assert.equal(SYSTEMS_INVENTORY_LABELS.replace.en, "Replace with approved hotel data");
  assert.equal(SYSTEMS_INVENTORY_LABELS.verify.en, "Subject to provider verification");
  assert.equal(rows.every((row) => String(row.status) !== "connected"), true);
  assert.equal(systemsInventoryRowsAreStale(rows), false);
  assert.equal(systemsInventoryRowsAreStale(rows.slice(0, 3)), true);
  assert.equal(systemsInventoryRowsAreStale(rows.map((row) => ({ ...row, status: "connected" }))), true);
  assert.equal(systemsInventoryStatus("connected").id, "not_configured");
  assert.equal(fields.map((row) => row.field).join(","), "Sample Room Type,Sample Rate Plan,Sample Availability,Sample Reservation Status,Sample Channel");
  assert.equal(SYSTEMS_DICTIONARY_COLUMNS.field.en, "Field name");
  assert.equal(SYSTEMS_DICTIONARY_COLUMNS.meaning.en, "Business meaning");
  assert.equal(SYSTEMS_DICTIONARY_COLUMNS.source.en, "Source system");
  assert.equal(SYSTEMS_DICTIONARY_COLUMNS.destination.en, "Destination system");
  assert.equal(SYSTEMS_DICTIONARY_COLUMNS.format.en, "Format/type");
  assert.equal(SYSTEMS_DICTIONARY_COLUMNS.required.en, "Required/optional");
  assert.equal(SYSTEMS_DICTIONARY_COLUMNS.mapping.en, "Mapping status");
  assert.equal(SYSTEMS_DICTIONARY_COLUMNS.owner.en, "Owner");
  assert.equal(SYSTEMS_DICTIONARY_COLUMNS.notes.en, "Notes");
  assert.equal(systemsDictionaryRowsAreStale(fields), false);
  assert.equal(systemsDictionaryRowsAreStale(fields.slice(0, 2)), true);
  assert.equal(systemsSampleSafeText("password123"), "");
  assert.equal(systemsSampleSafeText("booking-48291"), "");
  assert.equal(systemsSampleSafeText("guest 10001"), "");
  assert.equal(systemsSampleSafeText("Sample Room Type"), "Sample Room Type");
  const blob = JSON.stringify({ rows, fields });
  assert.match(blob, /Sample Room Type/);
  assert.equal(/\b(acc(ount)?|booking|res(ervation)?|guest)[-_ ]?#?\d{4,}\b/i.test(blob), false);
  assert.equal(/(password|passwd|secret|api[_-]?key|\btoken\b|bearer)/i.test(blob), false);
  assert.equal(SYSTEMS_INVENTORY_VISUAL.labelEn, "System Inventory and Data Mapping — Sample");
  assert.equal(SYSTEMS_INVENTORY_VISUAL.displayWidth, 720);
  assert.equal(SYSTEMS_INVENTORY_VISUAL.displayHeight, 405);
  assert.equal(SYSTEMS_INVENTORY_VISUAL.sourceWidth, 1600);
  assert.equal(SYSTEMS_INVENTORY_VISUAL.sourceHeight, 900);
  assert.equal(SYSTEMS_INVENTORY_VISUAL.src, "/images/hotel-systems-inventory-mapping-placeholder.webp");
});

test("testing and QA seed is a sample table with an error-handling flow", () => {
  const rows = systemsTestingCmsCases();
  const steps = systemsTestingErrorCmsSteps();
  assert.equal(
    rows.map((row) => row.id).join(","),
    "new-reservation,modification,cancellation,room-rate,availability,failed-sync,duplicate,missing-field,wrong-mapping,permission,booking-handoff,confirmation,report-reconciliation",
  );
  assert.equal(
    rows.map((row) => row.caseEn).join(","),
    "New reservation,Reservation modification,Cancellation,Room or rate update,Availability update,Failed sync,Duplicate record,Missing field,Wrong mapping,Permission error,Booking Engine handoff,Confirmation/notification,Report reconciliation",
  );
  assert.equal(SYSTEMS_TESTING_COLUMNS.case.en, "Test case");
  assert.equal(SYSTEMS_TESTING_COLUMNS.trigger.en, "Trigger/input");
  assert.equal(SYSTEMS_TESTING_COLUMNS.expected.en, "Expected result");
  assert.equal(SYSTEMS_TESTING_COLUMNS.actual.en, "Actual result");
  assert.equal(SYSTEMS_TESTING_COLUMNS.status.en, "Status");
  assert.equal(SYSTEMS_TESTING_COLUMNS.owner.en, "Owner");
  assert.equal(SYSTEMS_TESTING_COLUMNS.evidence.en, "Evidence");
  assert.equal(SYSTEMS_TESTING_COLUMNS.tested.en, "Tested date");
  assert.equal(SYSTEMS_TESTING_COLUMNS.next.en, "Issue/next action");
  assert.deepEqual(
    SYSTEMS_TESTING_STATUSES.map((item) => item.label),
    ["Not Tested", "Passed", "Failed", "Blocked", "Requires Provider Support", "Retest Required"],
  );
  assert.equal(SYSTEMS_TESTING_ERROR_PATH, "Detect → Log → Assign Owner → Notify → Correct → Retest → Close");
  assert.equal(SYSTEMS_TESTING_ERROR_FLOW.map((item) => item.label).join(","), "Detect,Log,Assign Owner,Notify,Correct,Retest,Close");
  assert.equal(steps.map((item) => item.id).join(","), "detect,log,assign,notify,correct,retest,close");
  assert.equal(SYSTEMS_TESTING_ISSUE_FIELDS.issue.en, "Issue description");
  assert.equal(SYSTEMS_TESTING_ISSUE_FIELDS.severity.en, "Severity");
  assert.equal(SYSTEMS_TESTING_ISSUE_FIELDS.owner.en, "Owner");
  assert.equal(SYSTEMS_TESTING_ISSUE_FIELDS.provider.en, "Provider dependency");
  assert.equal(SYSTEMS_TESTING_ISSUE_FIELDS.next.en, "Next action");
  assert.equal(SYSTEMS_TESTING_ISSUE_FIELDS.retest.en, "Retest date");
  const failed = rows.find((row) => row.id === "failed-sync");
  assert.equal(failed?.status, "failed");
  assert.equal(Boolean(failed?.issueEn?.trim()), true);
  assert.equal(Boolean(failed?.severity), true);
  assert.equal(Boolean(failed?.ownerEn?.trim()), true);
  assert.equal(Boolean(failed?.providerEn?.trim()), true);
  assert.equal(Boolean(failed?.nextEn?.trim()), true);
  assert.equal(Boolean(failed?.retestDate?.trim()), true);
  const passed = rows.find((row) => row.id === "report-reconciliation");
  assert.equal(passed?.status, "passed");
  assert.equal(systemsTestingPassedIsSample(passed?.actualEn, passed?.evidenceEn), true);
  assert.equal(
    rows.some((row) => row.status === "passed" && !systemsTestingPassedIsSample(row.actualEn, row.evidenceEn)),
    false,
  );
  assert.equal(systemsTestingCasesAreStale(rows), false);
  assert.equal(systemsTestingCasesAreStale(rows.slice(0, 4)), true);
  assert.equal(systemsTestingCasesAreStale(rows.map((row) => ({ ...row, status: "passed", actualEn: "ok", evidenceEn: "ok" }))), true);
  assert.equal(systemsTestingErrorStepsAreStale(steps), false);
  assert.equal(systemsTestingErrorStepsAreStale(steps.slice(0, 3)), true);
  const blob = JSON.stringify({ rows, steps });
  assert.equal(/\b(guest|payment)\s+(name|email|phone|card|token)\s*[:=]\s*\S+/i.test(blob), false);
  assert.equal(/\b(password|passwd|secret|api[_-]?key)\s*[:=]\s*\S+/i.test(blob), false);
  assert.equal(/\b(sk_live_|pk_live_|Bearer\s+[A-Za-z0-9\-._]{8,})/i.test(blob), false);
  assert.equal(SYSTEMS_TESTING_VISUAL.labelEn, "Hotel Systems Test Cases and QA — Sample");
  assert.equal(SYSTEMS_TESTING_VISUAL.displayWidth, 720);
  assert.equal(SYSTEMS_TESTING_VISUAL.displayHeight, 405);
  assert.equal(SYSTEMS_TESTING_VISUAL.sourceWidth, 1600);
  assert.equal(SYSTEMS_TESTING_VISUAL.sourceHeight, 900);
  assert.equal(SYSTEMS_TESTING_VISUAL.src, "/images/hotel-systems-testing-qa-placeholder.webp");
  assert.equal(SYSTEMS_TESTING_CASES.length, 13);
});

test("responsibility matrix is a sample boundary, not ownership of external systems", () => {
  const rows = systemsScopeCmsRows();
  const matrix = systemsResponsibilityCmsRows();
  assert.equal(rows.map((row) => row.id).join(","), "support,hotel");
  assert.equal(rows[0]?.titleEn, "The KPI Plus may support, subject to agreed scope");
  assert.equal(rows[1]?.titleEn, "The hotel or external provider remains responsible");
  assert.equal(
    SYSTEMS_SCOPE_ROWS[0].itemsEn.join(","),
    "Current-system discovery,System Architecture,Data Mapping framework,Implementation Plan,Provider coordination,Configuration checklist,Test Cases,QA and handover documentation,Ownership and SOP design",
  );
  assert.equal(
    SYSTEMS_SCOPE_ROWS[1].itemsEn.join(","),
    "License and subscription fees,API access and technical permissions,Security policy and compliance,Payment and transaction processing,Availability and rate data owned by the provider,Data processing agreements,External provider fixes,Final Go-live approval,Operational ownership after handover",
  );
  assert.equal(SYSTEMS_SCOPE_COLUMNS.event.en, "Activity/event");
  assert.equal(SYSTEMS_SCOPE_COLUMNS.hotel.en, "Hotel team");
  assert.equal(SYSTEMS_SCOPE_COLUMNS.provider.en, "Provider");
  assert.equal(SYSTEMS_SCOPE_COLUMNS.implementation.en, "Implementation team");
  assert.equal(SYSTEMS_SCOPE_COLUMNS.approval.en, "Approval required");
  assert.equal(SYSTEMS_SCOPE_COLUMNS.escalation.en, "Escalation path");
  assert.equal(
    matrix.map((row) => row.eventEn).join(","),
    "Rate mismatch,Booking not arriving in PMS,API permission expired,Duplicate reservation,Report definition mismatch,Provider outage,Go-live approval",
  );
  assert.match(SYSTEMS_SCOPE_BOUNDARY.en, /does not own/i);
  assert.match(SYSTEMS_SCOPE_BOUNDARY.en, /does not guarantee an external provider/i);
  assert.equal(systemsScopeRowsAreStale(rows), false);
  assert.equal(systemsScopeRowsAreStale(rows.slice(0, 1)), true);
  assert.equal(systemsResponsibilityRowsAreStale(matrix), false);
  assert.equal(systemsResponsibilityRowsAreStale(matrix.slice(0, 3)), true);
  assert.equal(SYSTEMS_SCOPE_VISUAL.labelEn, "Implementation Responsibility Matrix — Sample");
  assert.equal(SYSTEMS_SCOPE_VISUAL.displayWidth, 720);
  assert.equal(SYSTEMS_SCOPE_VISUAL.displayHeight, 405);
  assert.equal(SYSTEMS_SCOPE_VISUAL.sourceWidth, 1600);
  assert.equal(SYSTEMS_SCOPE_VISUAL.sourceHeight, 900);
  assert.equal(SYSTEMS_SCOPE_VISUAL.src, "/images/hotel-systems-implementation-responsibility-placeholder.webp");
  assert.equal(SYSTEMS_RESPONSIBILITY_MATRIX.length, 7);
  assert.equal(/owns every external system|guarantees an external provider/i.test(JSON.stringify({ rows, matrix })), false);
});

test("handover and ownership seed stores roles only, not Live credentials", () => {
  const items = systemsHandoverCmsItems();
  const assets = systemsOwnershipCmsRows();
  assert.equal(
    items.map((row) => row.itemEn).join(","),
    "System inventory delivered,Architecture diagram delivered,Data mapping delivered,Test cases and QA results delivered,Known issues listed,Provider contacts listed,Access owner listed,SOP delivered,Error-handling path documented,Rollback/escalation plan documented where applicable,Hotel sign-off recorded,Post-go-live owner confirmed",
  );
  assert.equal(SYSTEMS_HANDOVER_CHECKLIST_COLUMNS.item.en, "Item");
  assert.equal(SYSTEMS_OWNERSHIP_COLUMNS.asset.en, "System/asset");
  assert.equal(SYSTEMS_OWNERSHIP_COLUMNS.owner.en, "Owner");
  assert.equal(SYSTEMS_OWNERSHIP_COLUMNS.contact.en, "Admin/technical contact");
  assert.equal(SYSTEMS_OWNERSHIP_COLUMNS.approval.en, "Approval authority");
  assert.equal(SYSTEMS_OWNERSHIP_COLUMNS.access.en, "Access level");
  assert.equal(SYSTEMS_OWNERSHIP_COLUMNS.renewal.en, "Renewal/expiry responsibility");
  assert.equal(SYSTEMS_OWNERSHIP_COLUMNS.reviewed.en, "Last reviewed");
  assert.equal(
    assets.map((row) => row.assetEn).join(","),
    "PMS,Channel Manager,Booking Engine,Analytics,Domain,Hosting,API/Connector,Reporting,Form inbox,Documentation",
  );
  assert.equal(items.every((row) => !/^(live|handed over|handed_over)$/i.test(String(row.status))), true);
  assert.equal(assets.every((row) => !/^(live|handed over|handed_over)$/i.test(String(row.status))), true);
  assert.equal(systemsHandoverChecklistStatus("live").id, "incomplete");
  assert.equal(systemsOwnershipStatus("handed_over").id, "not_handed_over");
  assert.equal(systemsHandoverItemsAreStale(items), false);
  assert.equal(systemsHandoverItemsAreStale(items.slice(0, 4)), true);
  assert.equal(systemsHandoverItemsAreStale(items.map((row) => ({ ...row, status: "live" }))), true);
  assert.equal(systemsOwnershipRowsAreStale(assets), false);
  assert.equal(systemsOwnershipRowsAreStale(assets.slice(0, 3)), true);
  assert.equal(systemsOwnershipRowsAreStale(assets.map((row) => ({ ...row, status: "live" }))), true);
  assert.equal(systemsCredentialSafeText("password=secret123"), "");
  assert.equal(systemsCredentialSafeText("Pending Access"), "Pending Access");
  assert.match(SYSTEMS_HANDOVER_NOTE.en, /not marked Live or Handed Over/i);
  const blob = JSON.stringify({ items, assets });
  assert.equal(/\b(password|passwd|secret|api[_-]?key)\s*[:=]\s*\S+/i.test(blob), false);
  assert.equal(SYSTEMS_PLAN_VISUAL.labelEn, "Hotel Systems Handover and Ownership — Sample");
  assert.equal(SYSTEMS_PLAN_VISUAL.displayWidth, 720);
  assert.equal(SYSTEMS_PLAN_VISUAL.displayHeight, 405);
  assert.equal(SYSTEMS_PLAN_VISUAL.sourceWidth, 1600);
  assert.equal(SYSTEMS_PLAN_VISUAL.sourceHeight, 900);
  assert.equal(SYSTEMS_PLAN_VISUAL.src, "/images/hotel-systems-handover-placeholder.webp");
  assert.equal(SYSTEMS_HANDOVER_CHECKLIST.length, 12);
  assert.equal(SYSTEMS_OWNERSHIP_ROWS.length, 10);
});

test("hotel systems enquiry explains the implementation conversation and keeps What Happens Next", () => {
  const th = hotelSystemsEnquiryCopy("th");
  const en = hotelSystemsEnquiryCopy("en");
  assert.equal(th.heading, "คุยเรื่องระบบโรงแรมและข้อมูล");
  assert.equal(en.heading, "Talk about hotel systems and data");
  assert.equal(hotelSystemsCopy.th.closerTitle, "คุยเรื่องระบบโรงแรมและข้อมูล");
  assert.equal(th.nextTitle, "What Happens Next");
  assert.deepEqual(th.steps, [
    "ส่งรายการระบบและปัญหาที่พบ",
    "ทีมตรวจ Architecture, Data Flow และ Owner",
    "สรุป Readiness, Scope และสิ่งที่ต้องเตรียม",
    "นัดคุย Implementation Plan และ Next Action",
  ]);
  assert.deepEqual(
    SYSTEMS_ENQUIRY_RECEIVE.map((item) => item.title),
    [
      "Current System Inventory review",
      "Architecture and Data Flow review",
      "Data Mapping and Readiness assessment",
      "Integration/Provider dependency review",
      "Testing and Handover scope",
      "Next Action and implementation plan",
    ],
  );
  assert.deepEqual(
    SYSTEMS_ENQUIRY_GOALS.map((item) => item.en),
    ["New Setup", "Integration", "Data Mapping", "Troubleshooting", "Handover"],
  );
  assert.equal(SYSTEMS_ENQUIRY_FLOW.map((item) => item.en).join(" → "), "System Inventory → Data Mapping → Testing → Handover");
  assert.equal(SYSTEMS_ENQUIRY_VISUAL.labelEn, "What Happens Next — Sample implementation process");
  assert.equal(SYSTEMS_ENQUIRY_VISUAL.displayWidth, 420);
  assert.equal(SYSTEMS_ENQUIRY_VISUAL.displayHeight, 210);
  assert.equal(SYSTEMS_ENQUIRY_VISUAL.sourceWidth, 1200);
  assert.equal(SYSTEMS_ENQUIRY_VISUAL.sourceHeight, 600);
  assert.equal(SYSTEMS_ENQUIRY_VISUAL.src, "/images/hotel-systems-contact-process-placeholder.webp");
  assert.equal(systemsEnquiryVisualSrc(SYSTEMS_ENQUIRY_VISUAL.src, "sample"), "");
  assert.equal(systemsEnquiryVisualSrc("/media/cms/person.webp", "sample"), "");
  assert.equal(systemsEnquiryVisualSrc("/images/hotel-systems-contact-process-placeholder.webp", "approved"), "");
  assert.equal(systemsEnquiryVisualSrc("/media/cms/implementation-process.webp", "approved"), "/media/cms/implementation-process.webp");
  assert.equal(systemsEnquiryReceiveAreStale([]), true);
  assert.equal(systemsEnquiryReceiveAreStale([...SYSTEMS_ENQUIRY_RECEIVE]), false);
  assert.equal(systemsEnquiryStepsAreStale(th.steps.map((thStep, index) => ({ th: thStep, en: en.steps[index] }))), false);
  assert.equal(th.labels.name, "ชื่อผู้ติดต่อ");
  assert.equal(en.labels.name, "Contact name");
  assert.equal(th.labels.business, "ชื่อโรงแรม / บริษัท");
  assert.equal(en.labels.pms, "PMS used");
  assert.equal(en.labels.channelManager, "Channel Manager used");
  assert.equal(en.labels.bookingEngine, "Booking Engine used");
  assert.equal(en.labels.systems, "Other related systems");
  assert.equal(en.labels.message, "Main issue");
  assert.equal(en.labels.providerContact, "Provider contact or technical owner");
  assert.equal(en.labels.website, "Website URL");
  assert.equal(en.labels.contact, "Email / phone");
  assert.equal(th.labels.optional, "ไม่บังคับ");
  assert.match(th.labels.consent, /ยินยอม/);
  assert.equal(en.labels.privacy, "Privacy Policy");
});

test("hotel systems FAQ is 14 honest answers with Thai and English copy", () => {
  const th = hotelSystemsFaqs("th");
  const en = hotelSystemsFaqs("en");
  assert.equal(th.map((item) => item.q).join("|"), [
    "ต้องเปลี่ยนระบบเดิมทั้งหมดหรือไม่",
    "ทำงานร่วมกับ PMS, Channel Manager และ Booking Engine เดิมได้หรือไม่",
    "ทุกระบบสามารถเชื่อมต่อกันได้หรือไม่",
    "ใครต้องให้ API Access หรือ Account Permission",
    "หาก Provider ไม่เปิด API จะทำอย่างไร",
    "ใครรับผิดชอบเมื่อข้อมูลไม่ตรงกัน",
    "ใช้เวลาทำ Implementation เท่าไร",
    "มี Test Environment หรือ Sandbox หรือไม่",
    "รองรับ Data Mapping และ Documentation หรือไม่",
    "หลังส่งมอบทีมโรงแรมดูแลต่อได้หรือไม่",
    "ดูแล Security และข้อมูลส่วนบุคคลอย่างไร",
    "รองรับโรงแรมเปิดใหม่หรือเปลี่ยนระบบกลางคันหรือไม่",
    "การเชื่อมระบบทำให้รายได้เพิ่มขึ้นทันทีหรือไม่",
    "ใครเป็นผู้อนุมัติ Go-live",
  ].join("|"));
  assert.equal(en.map((item) => item.q).join("|"), [
    "Do we have to replace every current system?",
    "Can this work with the current PMS, Channel Manager, and Booking Engine?",
    "Can every system connect to every other system?",
    "Who has to grant API access or account permission?",
    "What happens if the provider does not open an API?",
    "Who is responsible when data does not match?",
    "How long does implementation take?",
    "Is there a test environment or sandbox?",
    "Does this include Data Mapping and documentation?",
    "Can the hotel team operate the systems after handover?",
    "How are security and personal data handled?",
    "Does this support a new opening or a mid-change of systems?",
    "Does connecting systems increase revenue immediately?",
    "Who approves Go-live?",
  ].join("|"));
  const blob = `${th.map((item) => item.a).join(" ")}\n${en.map((item) => item.a).join(" ")}`;
  assert.match(blob, /provider, API or connector, licence, permission, data structure, security, and agreed scope/);
  assert.match(blob, /ผู้ให้บริการ API หรือตัวเชื่อม ไลเซนส์ สิทธิ์ โครงสร้างข้อมูล ความปลอดภัย และขอบเขต/);
  assert.match(en.find((item) => /increase revenue immediately/i.test(item.q))?.a || "", /^No\./);
  assert.match(blob, /does not automatically increase revenue, reduce workload by a fixed percentage, or remove every error/);
  assert.match(blob, /ไม่ได้ทำให้รายได้เพิ่มขึ้นเอง ไม่ลดภาระงานเป็นเปอร์เซ็นต์คงที่ และไม่กำจัดข้อผิดพลาดทั้งหมด/);
  assert.match(blob, /Failed cases are logged with an owner, severity, and a retest date/);
  assert.match(blob, /เคสที่ไม่ผ่านจะบันทึกปัญหา ผู้รับผิดชอบ ความรุนแรง และวันที่ทดสอบซ้ำ/);
  assert.equal(/\bincreases revenue immediately\b|\breduces workload by \d+%\b|\beliminates all errors\b/i.test(blob), false);
  assert.equal(th.some((item) => /ทดสอบระบบอย่างไร/.test(item.q)), false);
  assert.equal(hotelSystemsFaqsAreStale(th), false);
  assert.equal(hotelSystemsFaqsAreStale(en), false);
  assert.equal(hotelSystemsFaqsAreStale(th.slice(0, 10)), true);
  assert.equal(
    hotelSystemsFaqsAreStale([...th, { q: "ทดสอบระบบอย่างไร และถ้าเคสไม่ผ่านจะทำอย่างไร", a: "sample" }]),
    true,
  );
  assert.equal(hotelSystemsCopy.th.footerStatement.includes("ขอบเขตที่ตกลง"), true);
});
