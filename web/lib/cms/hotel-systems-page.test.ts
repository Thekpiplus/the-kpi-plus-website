import assert from "node:assert/strict";
import test from "node:test";
import {
  defaultHotelSystemsCms,
  parseHotelSystemsPageBody,
  serializeHotelSystemsPageBody,
  validateHotelSystemsPage,
} from "./hotel-systems-page";

function clone() {
  return structuredClone(defaultHotelSystemsCms("th"));
}

test("default hotel systems CMS includes sample labels, goals, and can publish", () => {
  const content = defaultHotelSystemsCms("th");
  assert.match(content.inventory.sampleLabel, /sample/i);
  assert.match(content.testing.sampleLabel, /sample/i);
  assert.match(content.plan.sampleLabel, /sample/i);
  assert.ok(content.form.goals.length >= 5);
  assert.equal(validateHotelSystemsPage(content, "publish"), null);
  assert.equal(validateHotelSystemsPage(content, "draft"), null);
});

test("parse fills goals and sample labels from seed when missing", () => {
  const seeded = defaultHotelSystemsCms("th");
  const raw = JSON.parse(serializeHotelSystemsPageBody(seeded)) as Record<string, unknown>;
  delete (raw.inventory as Record<string, unknown>).sampleLabel;
  delete (raw.testing as Record<string, unknown>).sampleLabel;
  delete (raw.form as Record<string, unknown>).goals;
  const parsed = parseHotelSystemsPageBody(JSON.stringify(raw), "th");
  assert.ok(parsed);
  assert.match(parsed.inventory.sampleLabel, /sample/i);
  assert.match(parsed.testing.sampleLabel, /sample/i);
  assert.ok(parsed.form.goals.length >= 5);
});

test("secrets are blocked on draft and publish", () => {
  const content = clone();
  content.hero.description = "password: hunter2secret";
  assert.equal(validateHotelSystemsPage(content, "draft"), "blocked_secret");
  assert.equal(validateHotelSystemsPage(content, "publish"), "blocked_secret");
  assert.equal(validateHotelSystemsPage(content, "unpublish"), null);
});

test("publish requires bilingual FAQ, valid CTAs, and sample image status", () => {
  const faq = clone();
  faq.faqs[0].qEn = "";
  assert.equal(validateHotelSystemsPage(faq, "publish"), "empty_faq_bilingual");

  const cta = clone();
  cta.hero.primaryCta.href = "notaurl";
  assert.equal(validateHotelSystemsPage(cta, "publish"), "invalid_cta");

  const visual = clone();
  visual.hero.visual.src = "/media/cms/hero.webp";
  visual.hero.visual.status = "replace";
  visual.hero.visual.altTh = "แผนภาพ";
  visual.hero.visual.altEn = "Diagram";
  assert.equal(validateHotelSystemsPage(visual, "publish"), "placeholder_status");

  const alt = clone();
  alt.hero.visual.src = "/media/cms/hero.webp";
  alt.hero.visual.status = "sample";
  alt.hero.visual.label = "Sample architecture";
  alt.hero.visual.altTh = "แผนภาพ";
  alt.hero.visual.altEn = "";
  assert.equal(validateHotelSystemsPage(alt, "publish"), "missing_alt");
});

test("publish blocks unverified Connected, empty owners, and unlabelled samples", () => {
  const connected = clone();
  connected.services.items[0].status = "connected";
  connected.services.items[0].verified = false;
  assert.equal(validateHotelSystemsPage(connected, "publish"), "unverified_connected");

  const owner = clone();
  owner.inventory.rows[0].ownerTh = "";
  owner.inventory.rows[0].ownerEn = "";
  assert.equal(validateHotelSystemsPage(owner, "publish"), "empty_owner_status");

  const sample = clone();
  sample.inventory.sampleLabel = "System inventory";
  assert.equal(validateHotelSystemsPage(sample, "publish"), "missing_sample_label");
});

test("publish requires Sample on passed tests and issue plus severity on failed tests", () => {
  const passed = clone();
  const passedRow = passed.testing.cases.find((row) => row.status === "passed") ?? passed.testing.cases[0];
  passedRow.status = "passed";
  passedRow.actualTh = "ผ่าน";
  passedRow.actualEn = "Passed";
  passedRow.evidenceTh = "หลักฐาน";
  passedRow.evidenceEn = "Evidence";
  assert.equal(validateHotelSystemsPage(passed, "publish"), "missing_sample_label");

  const failed = clone();
  const failedRow = failed.testing.cases.find((row) => row.status === "failed") ?? failed.testing.cases[0];
  failedRow.status = "failed";
  failedRow.issueTh = "";
  failedRow.issueEn = "";
  failedRow.severity = "";
  assert.equal(validateHotelSystemsPage(failed, "publish"), "empty_failed_issue");
});

test("platform logos need approved or sample status before publish", () => {
  const content = clone();
  content.fit.scenarios[0].logoSrc = "/brand/example.svg";
  content.fit.scenarios[0].logoStatus = "replace";
  content.fit.scenarios[0].relationshipStatus = "example_category";
  assert.equal(validateHotelSystemsPage(content, "publish"), "logo_unapproved");
});

test("real hotel screenshots and bare technical claims cannot publish without source or approval", () => {
  const shot = clone();
  shot.hero.visual.src = "/media/cms/hotel-pms-screen.webp";
  shot.hero.visual.status = "approved";
  shot.hero.visual.altTh = "จอระบบโรงแรม";
  shot.hero.visual.altEn = "Hotel system screen";
  shot.hero.visual.label = "PMS screenshot";
  shot.hero.visual.publicationApproved = false;
  assert.equal(validateHotelSystemsPage(shot, "publish"), "screenshot_approval");
  shot.hero.visual.publicationApproved = true;
  assert.equal(validateHotelSystemsPage(shot, "publish"), null);

  const claim = clone();
  claim.hero.close = "This is a live integration and production-ready.";
  assert.equal(validateHotelSystemsPage(claim, "publish"), "unverified_claim");
  claim.hero.close = "This is a live integration. Subject to technical verification.";
  assert.equal(validateHotelSystemsPage(claim, "publish"), null);
});
