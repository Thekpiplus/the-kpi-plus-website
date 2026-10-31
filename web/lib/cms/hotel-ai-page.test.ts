import assert from "node:assert/strict";
import test from "node:test";
import { hotelAiEnquiryHasSecrets, hotelAiFaqs } from "@/lib/hotel-ai";
import {
  defaultHotelAiCms,
  parseHotelAiPageBody,
  publicHotelAiClaimNumber,
  publicHotelAiKpiValues,
  serializeHotelAiPageBody,
  validateHotelAiPage,
} from "./hotel-ai-page";

function clone() {
  return structuredClone(defaultHotelAiCms("th"));
}

test("default Hotel AI CMS can save draft and publish", () => {
  const content = defaultHotelAiCms("th");
  assert.equal(content.template, "hotel-ai-automation");
  assert.ok(content.faqs.length >= 13);
  assert.equal(validateHotelAiPage(content, "draft"), null);
  assert.equal(validateHotelAiPage(content, "publish"), null);
});

test("secrets are blocked on draft and publish", () => {
  const content = clone();
  content.hero.description = "password: hunter2secret";
  assert.equal(validateHotelAiPage(content, "draft"), "blocked_secret");
  assert.equal(validateHotelAiPage(content, "publish"), "blocked_secret");
  assert.equal(validateHotelAiPage(content, "unpublish"), null);
});

test("publish requires bilingual FAQ, consent, valid CTAs, and visual status", () => {
  const faq = clone();
  faq.faqs[0].qEn = "";
  assert.equal(validateHotelAiPage(faq, "publish"), "empty_faq_bilingual");

  const consent = clone();
  consent.form.labels.consent = "";
  assert.equal(validateHotelAiPage(consent, "publish"), "invalid_consent");

  const cta = clone();
  cta.hero.primaryCta.href = "notaurl";
  assert.equal(validateHotelAiPage(cta, "publish"), "invalid_cta");

  const visual = clone();
  visual.hero.visual.src = "/media/cms/hero.webp";
  visual.hero.visual.status = "replace";
  visual.hero.visual.altTh = "แผนภาพ";
  visual.hero.visual.altEn = "Diagram";
  assert.equal(validateHotelAiPage(visual, "publish"), "placeholder_status");
});

test("numeric claims stay unpublished without complete evidence", () => {
  const content = clone();
  content.evidence.claims[0].number = "3.3";
  content.evidence.claims[0].publicationStatus = "approved";
  assert.equal(validateHotelAiPage(content, "publish"), "claim_incomplete");
  assert.equal(publicHotelAiClaimNumber(content.evidence.claims[0], true), "");

  content.evidence.claims[0].sourceUrl = "https://example.com/study";
  content.evidence.claims[0].sourceTitle = "Study title";
  content.evidence.claims[0].sourceDate = "2025-01-01";
  content.evidence.claims[0].taskDefinitionTh = "เวลาตอบ";
  content.evidence.claims[0].taskDefinitionEn = "Response time";
  content.evidence.claims[0].contextTh = "โรงแรมตัวอย่าง";
  content.evidence.claims[0].contextEn = "Sample hotel";
  content.evidence.claims[0].methodTh = "วัดก่อนหลัง";
  content.evidence.claims[0].methodEn = "Before/after";
  content.evidence.claims[0].limitationsTh = "กรณีเดียว";
  content.evidence.claims[0].limitationsEn = "One case";
  content.evidence.claims[0].permission = true;
  content.approvals.results = true;
  assert.equal(validateHotelAiPage(content, "publish"), null);
  assert.equal(publicHotelAiClaimNumber(content.evidence.claims[0], true), "3.3");
});

test("KPI values stay empty until definition, period, source, owner, and status exist", () => {
  const content = clone();
  content.measure.kpis[0].baseline = "12";
  content.measure.kpis[0].pilot = "8";
  content.measure.kpis[0].hideUntilComplete = false;
  content.measure.kpis[0].dataStatus = "approved";
  content.measure.kpis[0].definitionTh = "";
  content.measure.kpis[0].definitionEn = "";
  assert.equal(validateHotelAiPage(content, "publish"), "kpi_incomplete");
  assert.deepEqual(publicHotelAiKpiValues(content.measure.kpis[0], true), { baseline: "", pilot: "" });
});

test("consequential workflows need a reviewer and fallback", () => {
  const content = clone();
  content.cases.items[0].reviewTh = "";
  content.cases.items[0].reviewEn = "";
  assert.equal(validateHotelAiPage(content, "publish"), "missing_reviewer");
});

test("parse restores seeded FAQs and goals when omitted", () => {
  const seeded = defaultHotelAiCms("th");
  const raw = JSON.parse(serializeHotelAiPageBody(seeded)) as Record<string, unknown>;
  delete raw.faqs;
  delete (raw.form as Record<string, unknown>).goals;
  const parsed = parseHotelAiPageBody(JSON.stringify(raw), "th");
  assert.ok(parsed);
  assert.equal(parsed.faqs.length, seeded.faqs.length);
  assert.ok(parsed.form.goals.length >= 5);
});

test("Hotel AI FAQs cover accuracy and the enquiry scanner blocks secrets", () => {
  const questions = hotelAiFaqs("en").map((item) => item.q);
  assert.ok(questions.some((item) => /accurate/i.test(item)));
  assert.equal(hotelAiEnquiryHasSecrets("password: hunter2"), true);
  assert.equal(hotelAiEnquiryHasSecrets("booking_id: ABC123"), true);
  assert.equal(hotelAiEnquiryHasSecrets("Map the reservation exception queue"), false);
});

test("older CMS charter records pick up the exception owner field", () => {
  const content = clone();
  content.pilot.charter = content.pilot.charter.filter((row) => row.id !== "exceptionOwner");
  const parsed = parseHotelAiPageBody(serializeHotelAiPageBody(content), "th");
  assert.ok(parsed);
  assert.ok(parsed.pilot.charter.some((row) => row.id === "exceptionOwner"));
});
