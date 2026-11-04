import assert from "node:assert/strict";
import test from "node:test";
import {
  HM_CMS_INTENTS,
  emptyVisual,
  isHotelMarketingCmsBody,
  isHotelMarketingInsightDocument,
  parseHotelMarketingInsightBody,
  serializeHotelMarketingInsightBody,
  validateHotelMarketingInsight,
} from "./hotel-marketing-insight";
import { defaultHotelMarketingInsight } from "./hotel-marketing-insight-seed";

function seed() {
  return structuredClone(defaultHotelMarketingInsight());
}

test("seed round-trips through serialize/parse", () => {
  const content = seed();
  const body = serializeHotelMarketingInsightBody(content);
  assert.equal(isHotelMarketingCmsBody(body), true);
  const parsed = parseHotelMarketingInsightBody(body);
  assert.ok(parsed);
  assert.deepEqual(parsed, content);
  assert.equal(isHotelMarketingCmsBody("[]"), false);
  assert.equal(parseHotelMarketingInsightBody("not json"), null);
});

test("seed matches live content shape and never invents English body", () => {
  const content = seed();
  assert.equal(content.strategies.length, 8);
  assert.deepEqual(
    content.strategies.map((item) => item.visual.diagramId),
    ["seo", "gbp", "ota", "direct", "social", "ads", "review", "revenue"],
  );
  assert.deepEqual(content.journeyLabels, ["Visibility", "Interest", "Consideration", "Booking", "Revenue"]);
  assert.equal(content.translation.enEnabled, false);
  assert.equal(content.translation.enReady, false);
  assert.equal(content.reviewerName, "");
  assert.ok(content.strategies.every((item) => item.bodyEn === ""));
  assert.ok(content.sections.every((item) => item.bodyEn === ""));
  assert.equal(content.conclusion.bodyEn, "");
  assert.ok(content.metrics.every((item) => item.status === "sample" && item.value === ""));
  assert.ok(content.references.length >= 6 && content.references.every((item) => item.accessedAt === "2026-11-04"));
  assert.ok(content.relatedServices.length === 5);
  assert.equal(content.relatedArticles.length, 4);
  assert.equal(content.cover.src, "/images/insights/hotel-marketing-cover-placeholder.webp");
  assert.equal(content.cover.status, "sample");
  assert.deepEqual(HM_CMS_INTENTS, ["save", "draft", "preview", "publish", "unpublish"]);
});

test("seed can save draft and publish", () => {
  const content = seed();
  assert.equal(validateHotelMarketingInsight(content, "draft"), null);
  assert.equal(validateHotelMarketingInsight(content, "publish"), null);
});

test("publish gates", () => {
  const author = seed();
  author.authorVerified = false;
  assert.equal(validateHotelMarketingInsight(author, "publish"), "author_required");

  const reviewer = seed();
  reviewer.reviewerName = "Someone";
  assert.equal(validateHotelMarketingInsight(reviewer, "publish"), "reviewer_unverified");

  const visual = seed();
  visual.strategies[0].visual.src = "/media/cms/a.webp";
  visual.strategies[0].visual.status = "placeholder";
  assert.equal(validateHotelMarketingInsight(visual, "publish"), "placeholder_status");
  visual.strategies[0].visual.status = "approved";
  visual.strategies[0].visual.alt.th = "";
  assert.equal(validateHotelMarketingInsight(visual, "publish"), "missing_alt");
  visual.strategies[0].visual.alt.th = "ภาพ";
  visual.strategies[0].visual.permissionStatus = "pending";
  assert.equal(validateHotelMarketingInsight(visual, "publish"), "permission_required");
  visual.strategies[0].visual.permissionStatus = "redacted";
  assert.equal(validateHotelMarketingInsight(visual, "publish"), null);

  const claim = seed();
  claim.metrics[0].value = "42%";
  assert.equal(validateHotelMarketingInsight(claim, "publish"), null, "sample values are allowed");
  claim.metrics[0].status = "requires_review";
  assert.equal(validateHotelMarketingInsight(claim, "publish"), "unverified_claim");
  claim.metrics[0].status = "verified";
  assert.equal(validateHotelMarketingInsight(claim, "publish"), "metric_incomplete");
  claim.metrics[0].period = "2026-Q3";
  claim.metrics[0].source = "PMS";
  assert.equal(validateHotelMarketingInsight(claim, "publish"), "reviewer_required");
  claim.reviewerName = "Reviewer";
  claim.reviewerVerified = true;
  assert.equal(validateHotelMarketingInsight(claim, "publish"), null);

  const en = seed();
  en.translation.enEnabled = true;
  assert.equal(validateHotelMarketingInsight(en, "publish"), "en_not_ready");
  en.translation.enReady = true;
  assert.equal(validateHotelMarketingInsight(en, "publish"), null);
  en.title.en = "";
  assert.equal(validateHotelMarketingInsight(en, "publish"), "en_required");

  const refs = seed();
  refs.references[0].url = "ftp://nope";
  assert.equal(validateHotelMarketingInsight(refs, "publish"), "invalid_link");
  refs.references[0].url = "https://example.com";
  refs.references[0].accessedAt = "";
  refs.updatedAt = "";
  assert.equal(validateHotelMarketingInsight(refs, "publish"), "source_dates");

  const related = seed();
  related.relatedServices[0].href = "";
  assert.equal(validateHotelMarketingInsight(related, "publish"), "related_invalid");
});

test("document detection and empty visual", () => {
  assert.equal(isHotelMarketingInsightDocument({ kind: "insight", slug: "hotel-marketing", template: "insight" }), true);
  assert.equal(isHotelMarketingInsightDocument({ kind: "insight", slug: "x", template: "hotel-marketing" }), true);
  assert.equal(isHotelMarketingInsightDocument({ kind: "page", slug: "hotel-marketing", template: "hotel-marketing" }), false);
  assert.equal(emptyVisual("seo").diagramId, "seo");
});
