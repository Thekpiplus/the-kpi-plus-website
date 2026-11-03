import assert from "node:assert/strict";
import test from "node:test";
import { composeHotelTrainingEnquiryMessage, hotelTrainingCopy, hotelTrainingEnquiryCopy, hotelTrainingEnquiryHasSecrets, hotelTrainingFaqs, hotelTrainingFaqsAreStale, hotelTrainingGalleryPublicSrc, hotelTrainingHeroPublicSrc, hotelTrainingNeedsPublicSrc, hotelTrainingRelatedCards, hotelTrainingResolveGalleryItem, hotelTrainingSrcUsedInGallery, hotelTrainingTrainerPublicSrc, HOTEL_TRAINING_ACADEMY_DISCOVER, HOTEL_TRAINING_ASSESS, HOTEL_TRAINING_ASSESS_VISUAL, HOTEL_TRAINING_CYCLE_VISUAL, HOTEL_TRAINING_ENQUIRY_FORMATS, HOTEL_TRAINING_ENQUIRY_VISUAL, HOTEL_TRAINING_FAQS, HOTEL_TRAINING_FOLLOW, HOTEL_TRAINING_GALLERY, HOTEL_TRAINING_GALLERY_PLACEHOLDER, HOTEL_TRAINING_HERO_VISUAL, HOTEL_TRAINING_JOURNEY, HOTEL_TRAINING_JOURNEY_VISUAL, HOTEL_TRAINING_MATRIX, HOTEL_TRAINING_MATRIX_VISUAL, HOTEL_TRAINING_NEEDS, HOTEL_TRAINING_NEEDS_FLOW, HOTEL_TRAINING_NEEDS_VISUAL, HOTEL_TRAINING_OUTCOME_VISUAL, HOTEL_TRAINING_OUTCOMES, HOTEL_TRAINING_PHOTOS, HOTEL_TRAINING_PROGRAMS, HOTEL_TRAINING_PROGRAM_VISUAL, HOTEL_TRAINING_RELATED_VISUAL, HOTEL_TRAINING_TRAINER, HOTEL_TRAINING_TRAINER_VISUAL } from "@/lib/hotel-training";
import {
  blankHotelTrainingProgram,
  defaultHotelTrainingCms,
  parseHotelTrainingPageBody,
  serializeHotelTrainingPageBody,
  validateHotelTrainingPage,
} from "./hotel-training-page";

function clone() {
  return structuredClone(defaultHotelTrainingCms("th"));
}

test("default Hotel Training CMS can save draft and publish", () => {
  const content = defaultHotelTrainingCms("th");
  assert.equal(content.template, "hotel-training-team-development");
  assert.equal(content.faqs.length, HOTEL_TRAINING_FAQS.length);
  assert.equal(content.faqs.map((item) => item.id).join(","), HOTEL_TRAINING_FAQS.map((item) => item.id).join(","));
  assert.equal(content.journey.steps.length, 5);
  assert.equal(content.journey.steps[0].label, "Discover");
  assert.equal(content.journey.steps[4].label, "Follow-up");
  assert.equal(content.journey.steps.filter((item) => item.packageDependent).length, 2);
  assert.equal(validateHotelTrainingPage(content, "draft"), null);
  assert.equal(validateHotelTrainingPage(content, "publish"), null);
});

test("secrets are blocked on draft and publish", () => {
  const content = clone();
  content.hero.description = "password: hunter2secret";
  assert.equal(validateHotelTrainingPage(content, "draft"), "blocked_secret");
  assert.equal(validateHotelTrainingPage(content, "publish"), "blocked_secret");
  assert.equal(validateHotelTrainingPage(content, "unpublish"), null);
});

test("publish requires bilingual FAQ and valid CTAs", () => {
  const faq = clone();
  faq.faqs[0].qEn = "";
  assert.equal(validateHotelTrainingPage(faq, "publish"), "empty_faq_bilingual");

  const cta = clone();
  cta.hero.primaryCta.href = "notaurl";
  assert.equal(validateHotelTrainingPage(cta, "publish"), "invalid_cta");
});

test("facilitator profile uses a labelled dummy until an approved portrait exists", () => {
  const content = defaultHotelTrainingCms("th");
  assert.equal(content.trainer.src, HOTEL_TRAINING_TRAINER_VISUAL.src);
  assert.equal(content.trainer.publicationApproved, false);
  assert.equal(content.trainer.status, "sample");
  assert.equal(content.trainer.qualificationsTh, "");
  assert.equal(content.trainer.languagesEn, "");
  assert.equal(/\d{2}/.test(`${content.trainer.experienceTh}${content.trainer.experienceEn}${content.trainer.qualificationsTh}`), false);
  assert.equal(content.trainer.topics.map((item) => item.en).join(","), HOTEL_TRAINING_TRAINER.topics.map((item) => item.en).join(","));
  assert.equal(HOTEL_TRAINING_TRAINER_VISUAL.sourceWidth, 800);
  assert.equal(HOTEL_TRAINING_TRAINER_VISUAL.sourceHeight, 1000);
  assert.equal(HOTEL_TRAINING_TRAINER_VISUAL.displayWidth, 320);
  assert.equal(HOTEL_TRAINING_TRAINER_VISUAL.displayHeight, 400);
  assert.equal(HOTEL_TRAINING_TRAINER_VISUAL.labelEn, "Trainer portrait placeholder — replace with approved facilitator photo");
  assert.equal(hotelTrainingTrainerPublicSrc(content.trainer), HOTEL_TRAINING_TRAINER_VISUAL.src);
  assert.equal(
    hotelTrainingTrainerPublicSrc({ src: HOTEL_TRAINING_PHOTOS.trainer, status: "approved", publicationApproved: true }),
    HOTEL_TRAINING_PHOTOS.trainer,
  );
  assert.equal(
    hotelTrainingTrainerPublicSrc({ src: HOTEL_TRAINING_PHOTOS.trainer, status: "sample", publicationApproved: false }),
    HOTEL_TRAINING_TRAINER_VISUAL.src,
  );
  assert.equal(
    hotelTrainingTrainerPublicSrc({ src: HOTEL_TRAINING_GALLERY[0].src, status: "approved", publicationApproved: true }),
    HOTEL_TRAINING_TRAINER_VISUAL.src,
  );
  const seeded = defaultHotelTrainingCms("th");
  const raw = JSON.parse(serializeHotelTrainingPageBody(seeded)) as Record<string, unknown>;
  raw.trainer = {
    title: "งานด้าน Training นำโดยคุณเนตร",
    name: "คุณเนตรนภิส อิสรนิรันดร์",
    nameEn: "Natenapit Isaraniran · Nate",
    body: "ผู้นำงานด้าน Training ของ เดอะ เคพีไอ พลัส มีประสบการณ์ด้าน Guest Relations และ Front Office รวมถึงงานบรรยายและกิจกรรมเตรียมความพร้อมในธุรกิจบริการ หน้านี้ไม่ระบุจำนวนปีหรือวุฒิบัตรที่ไม่มีในข้อมูลที่อนุมัติ",
    close: "ประสบการณ์ดูแลผู้เข้าพักและการทำงานกับทีมช่วยให้ออกแบบกิจกรรมจากงานจริงได้",
    src: HOTEL_TRAINING_PHOTOS.trainer,
    altTh: "old",
    altEn: "old",
  };
  const parsed = parseHotelTrainingPageBody(JSON.stringify(raw), "th");
  assert.ok(parsed);
  assert.equal(parsed.trainer.title, seeded.trainer.title);
  assert.equal(parsed.trainer.roleTh, HOTEL_TRAINING_TRAINER.roleTh);
  assert.equal(parsed.trainer.src, HOTEL_TRAINING_TRAINER_VISUAL.src);
  assert.equal(parsed.trainer.publicationApproved, false);
  assert.equal(parsed.trainer.qualificationsTh, "");
});

test("numeric outcomes stay unpublished without an evidence note", () => {
  const content = clone();
  content.outcomes.items[0].definitionTh = "Participation 12";
  content.approvals.results = true;
  assert.equal(validateHotelTrainingPage(content, "publish"), "claim_incomplete");
  content.approvals.evidenceNote = "Anonymised attendance kept by the hotel. Not a revenue claim.";
  assert.equal(validateHotelTrainingPage(content, "publish"), null);
});

test("training outcome scorecard is an empty sample template and migrates the retired signal table", () => {
  const content = defaultHotelTrainingCms("th");
  assert.equal(content.outcomes.items.length, 8);
  assert.equal(content.outcomes.items.map((item) => item.id).join(","), "attendance,knowledge,roleplay,observation,handover,actionplan,feedback,business");
  assert.equal(content.outcomes.items.every((item) => item.sample && item.metricTh && !item.beforeTh && !item.afterTh && !item.followTh), true);
  assert.equal(/\d/.test(JSON.stringify(content.outcomes.items.map((item) => [item.beforeTh, item.afterTh, item.followTh]))), false);
  assert.equal(content.outcomes.items.filter((item) => item.level === "immediate").length, 3);
  assert.equal(content.outcomes.items.filter((item) => item.level === "workplace").length, 4);
  assert.equal(content.outcomes.items.filter((item) => item.level === "business").length, 1);
  assert.equal(content.outcomes.visual.src, HOTEL_TRAINING_OUTCOME_VISUAL.src);
  assert.equal(HOTEL_TRAINING_OUTCOME_VISUAL.sourceWidth, 1600);
  assert.equal(HOTEL_TRAINING_OUTCOME_VISUAL.sourceHeight, 900);
  assert.equal(HOTEL_TRAINING_OUTCOME_VISUAL.displayWidth, 720);
  assert.equal(HOTEL_TRAINING_OUTCOME_VISUAL.displayHeight, 405);
  assert.equal(HOTEL_TRAINING_OUTCOME_VISUAL.labelEn, "Training Outcome Scorecard — Sample data");
  assert.equal(content.outcomes.visual.label, HOTEL_TRAINING_OUTCOME_VISUAL.labelTh);
  assert.equal(content.outcomes.caption, HOTEL_TRAINING_OUTCOME_VISUAL.captionTh);
  const seeded = defaultHotelTrainingCms("th");
  const raw = JSON.parse(serializeHotelTrainingPageBody(seeded)) as Record<string, unknown>;
  raw.outcomes = {
    title: "สัญญาณที่อาจใช้ทบทวน",
    lead: "เลือกตัวชี้วัดตามข้อมูลที่มีและเป้าหมายของงาน ไม่ใช่สัญญารับประกันผลทางธุรกิจ",
    items: [
      { id: "participation", label: "Participation", definitionTh: "old", definitionEn: "old", methodTh: "old", methodEn: "old", sample: true },
      { id: "confidence", label: "Confidence", definitionTh: "old", definitionEn: "old", methodTh: "old", methodEn: "old", sample: true },
      { id: "application", label: "Application", definitionTh: "old", definitionEn: "old", methodTh: "old", methodEn: "old", sample: true },
      { id: "followthrough", label: "Follow-through", definitionTh: "old", definitionEn: "old", methodTh: "old", methodEn: "old", sample: true },
    ],
  };
  const parsed = parseHotelTrainingPageBody(JSON.stringify(raw), "th");
  assert.ok(parsed);
  assert.equal(parsed.outcomes.title, seeded.outcomes.title);
  assert.equal(parsed.outcomes.lead, seeded.outcomes.lead);
  assert.equal(parsed.outcomes.items.map((item) => item.id).join(","), HOTEL_TRAINING_OUTCOMES.map((item) => item.id).join(","));
  assert.equal(parsed.outcomes.items[0].metricEn, "Attendance / completion");
  assert.equal(parsed.outcomes.items[7].beforeEn, "");
});

test("parse restores seeded FAQs and journey when omitted", () => {
  const seeded = defaultHotelTrainingCms("th");
  const raw = JSON.parse(serializeHotelTrainingPageBody(seeded)) as Record<string, unknown>;
  delete raw.faqs;
  delete raw.journey;
  const parsed = parseHotelTrainingPageBody(JSON.stringify(raw), "th");
  assert.ok(parsed);
  assert.equal(parsed.faqs.length, seeded.faqs.length);
  assert.equal(parsed.journey.steps.length, 5);
});

test("training journey uses five HTML steps and migrates the retired seven-step cycle", () => {
  const content = defaultHotelTrainingCms("th");
  assert.equal(content.journey.steps.length, 5);
  assert.equal(HOTEL_TRAINING_JOURNEY.map((item) => item.id).join(","), "discover,design,deliver,assess,followup");
  assert.equal(content.journey.steps.every((item) => item.inputTh && item.ownerTh && item.outputTh && item.approvalTh), true);
  assert.equal(content.journey.steps.filter((item) => item.packageDependent).map((item) => item.id).join(","), "assess,followup");
  assert.equal(content.journey.visual.src, HOTEL_TRAINING_JOURNEY_VISUAL.src);
  assert.equal(HOTEL_TRAINING_JOURNEY_VISUAL.sourceWidth, 1600);
  assert.equal(HOTEL_TRAINING_JOURNEY_VISUAL.sourceHeight, 900);
  assert.equal(HOTEL_TRAINING_JOURNEY_VISUAL.displayWidth, 720);
  assert.equal(HOTEL_TRAINING_CYCLE_VISUAL.displayHeight, 405);
  assert.equal(HOTEL_TRAINING_JOURNEY_VISUAL.labelEn, "Hotel Team Training Journey — Sample");
  const seeded = defaultHotelTrainingCms("th");
  const parsed = parseHotelTrainingPageBody(
    serializeHotelTrainingPageBody({
      ...seeded,
      journey: {
        title: "เส้นทางการเรียนรู้",
        lead: "การอบรมรวมการสำรวจความต้องการ ออกแบบการเรียนรู้ ฝึก ประเมิน และติดตาม ไม่ใช่วันอบรมอย่างเดียว ประเมินหลังเรียนและการติดตามที่หน้างานมีได้เมื่อตกลงขอบเขต",
        visual: seeded.journey.visual,
        steps: [
          {
            id: "brief",
            label: "Brief / Business Goal",
            titleTh: "old",
            titleEn: "old",
            bodyTh: "old",
            bodyEn: "old",
            inputTh: "",
            inputEn: "",
            ownerTh: "",
            ownerEn: "",
            outputTh: "",
            outputEn: "",
            approvalTh: "",
            approvalEn: "",
            packageDependent: false,
            optional: false,
          },
        ],
      },
    }),
    "th",
  );
  assert.ok(parsed);
  assert.equal(parsed.journey.title, seeded.journey.title);
  assert.equal(parsed.journey.lead, seeded.journey.lead);
  assert.equal(parsed.journey.steps.length, 5);
  assert.equal(parsed.journey.steps[0].id, "discover");
  assert.equal(parsed.journey.steps[0].outputEn, "Training Brief and target learner group");
});

test("follow-through labels include meaning and labelled sample values", () => {
  const content = defaultHotelTrainingCms("th");
  assert.equal(content.follow.items.map((item) => item.id).join(","), HOTEL_TRAINING_FOLLOW.map((item) => item.id).join(","));
  assert.equal(content.follow.items.every((item) => Boolean(item.meaningTh && item.meaningEn && item.valueTh && item.valueEn)), true);
  const raw = JSON.parse(serializeHotelTrainingPageBody(content)) as Record<string, unknown>;
  const follow = { ...(raw.follow as object), items: (raw.follow as { items: Array<Record<string, unknown>> }).items.map((item) => {
    const next = { ...item };
    delete next.meaningTh;
    delete next.meaningEn;
    return next;
  }) };
  raw.follow = follow;
  const parsed = parseHotelTrainingPageBody(JSON.stringify(raw), "th");
  assert.ok(parsed);
  assert.equal(parsed.follow.items[0].meaningEn, HOTEL_TRAINING_FOLLOW[0].meaningEn);
});

test("learning follow-through uses five sample signals and migrates isolated assess badges", () => {
  const content = defaultHotelTrainingCms("th");
  assert.equal(content.assess.items.length, 5);
  assert.equal(HOTEL_TRAINING_ASSESS.map((item) => item.id).join(","), "participation,confidence,application,followthrough,review");
  assert.equal(content.assess.items.every((item) => item.sample && item.meaningTh && item.evidenceTh && /ตัวอย่าง|Sample/.test(item.statusTh + item.statusEn)), true);
  assert.equal(/\d/.test(content.assess.items.map((item) => item.statusEn).join("")), false);
  assert.equal(content.assess.visual.src, HOTEL_TRAINING_ASSESS_VISUAL.src);
  assert.equal(HOTEL_TRAINING_ASSESS_VISUAL.sourceWidth, 1600);
  assert.equal(HOTEL_TRAINING_ASSESS_VISUAL.sourceHeight, 900);
  assert.equal(HOTEL_TRAINING_ASSESS_VISUAL.displayWidth, 720);
  assert.equal(HOTEL_TRAINING_ASSESS_VISUAL.displayHeight, 405);
  assert.equal(HOTEL_TRAINING_ASSESS_VISUAL.labelEn, "Learning Follow-through Framework — Sample");
  const seeded = defaultHotelTrainingCms("th");
  const parsed = parseHotelTrainingPageBody(
    serializeHotelTrainingPageBody({
      ...seeded,
      assess: {
        title: seeded.assess.title,
        lead: "The assessment method follows the goal. Individual scores are not shown on this page.",
        caption: seeded.assess.caption,
        visual: seeded.assess.visual,
        items: [
          { id: "participation", label: "Participation", meaningTh: "old", meaningEn: "old", evidenceTh: "", evidenceEn: "", statusTh: "", statusEn: "", sample: true },
          { id: "practice", label: "Practice", meaningTh: "old", meaningEn: "old", evidenceTh: "", evidenceEn: "", statusTh: "", statusEn: "", sample: true },
          { id: "confidence", label: "Confidence", meaningTh: "old", meaningEn: "old", evidenceTh: "", evidenceEn: "", statusTh: "", statusEn: "", sample: true },
          { id: "application", label: "Application", meaningTh: "old", meaningEn: "old", evidenceTh: "", evidenceEn: "", statusTh: "", statusEn: "", sample: true },
          { id: "supervisor", label: "Supervisor review", meaningTh: "old", meaningEn: "old", evidenceTh: "", evidenceEn: "", statusTh: "", statusEn: "", sample: true },
        ],
      },
    }),
    "th",
  );
  assert.ok(parsed);
  assert.equal(parsed.assess.lead, seeded.assess.lead);
  assert.equal(parsed.assess.items.map((item) => item.id).join(","), "participation,confidence,application,followthrough,review");
  assert.equal(parsed.assess.items[0].meaningEn, "Attendance or activity completion evidence");
  assert.equal(parsed.assess.items[1].statusEn, "Not collected — Sample");
  assert.equal(parsed.assess.items[3].meaningEn, "Action owner and review date");
});

test("hero uses the labelled dummy until an approved publication photo exists", () => {
  const content = defaultHotelTrainingCms("th");
  assert.equal(content.hero.visual.src, HOTEL_TRAINING_HERO_VISUAL.src);
  assert.equal(content.hero.visual.publicationApproved, false);
  assert.equal(content.hero.primaryCta.href, "#training-enquiry");
  assert.equal(content.hero.secondaryCta.href, "#training-programs");
  assert.equal(hotelTrainingHeroPublicSrc(content.hero.visual), HOTEL_TRAINING_HERO_VISUAL.src);
  assert.equal(
    hotelTrainingHeroPublicSrc({ src: "/media/hospitality-training-group_cdf6d58f.webp", status: "approved", publicationApproved: true }),
    HOTEL_TRAINING_HERO_VISUAL.src,
  );
  assert.equal(
    hotelTrainingHeroPublicSrc({ src: "/media/cms/unique-hero-workshop.webp", status: "approved", publicationApproved: true }),
    "/media/cms/unique-hero-workshop.webp",
  );
  assert.equal(
    hotelTrainingHeroPublicSrc({ src: "/media/hospitality-training-group_cdf6d58f.webp", status: "sample", publicationApproved: false }),
    HOTEL_TRAINING_HERO_VISUAL.src,
  );
});

test("needs assessment uses a labelled dummy and HTML sequence until a unique approved photo exists", () => {
  const content = defaultHotelTrainingCms("th");
  assert.equal(content.needs.visual.src, HOTEL_TRAINING_NEEDS_VISUAL.src);
  assert.equal(content.needs.items.length, 6);
  assert.equal(content.needs.items[0].id, HOTEL_TRAINING_NEEDS[0].id);
  assert.equal(HOTEL_TRAINING_NEEDS_FLOW.length, 5);
  assert.equal(hotelTrainingNeedsPublicSrc(content.needs.visual), "");
  assert.equal(
    hotelTrainingNeedsPublicSrc({ src: HOTEL_TRAINING_PHOTOS.group, status: "approved", publicationApproved: true }),
    "",
  );
  assert.equal(
    hotelTrainingNeedsPublicSrc({ src: "/media/cms/unique-workshop.webp", status: "approved", publicationApproved: true }),
    "/media/cms/unique-workshop.webp",
  );
});

test("retired needs copy is replaced with the current seed", () => {
  const seeded = defaultHotelTrainingCms("th");
  const parsed = parseHotelTrainingPageBody(
    serializeHotelTrainingPageBody({
      ...seeded,
      needs: {
        ...seeded.needs,
        title: "ทีมต้องทำอะไรได้ จึงจะรองรับเป้าหมาย?",
        lead: "ใช้เป็นคำถามตรวจเอง ไม่ใช่ข้อสรุปว่าทุกโรงแรมมีช่องว่างเหล่านี้ การอบรมที่เหมาะเริ่มจากงาน ไม่ใช่จากหัวข้อหลักสูตร",
        items: [
          { id: "goal", th: "เป้าหมายทางธุรกิจของงานนี้คืออะไร และทีมต้องทำอะไรได้จึงจะรองรับเป้าหมายนั้น?", en: "old" },
          { id: "roles", th: "ใครเกี่ยวข้องบ้าง บทบาทใดต้องตัดสินใจ ส่งต่อ หรือลงมือทำ?", en: "old" },
          { id: "skills", th: "ทักษะปัจจุบันต่างจากทักษะที่งานต้องการตรงไหน?", en: "old" },
          { id: "work", th: "งานใดที่คนยังทำไม่มั่นใจ หรือยังส่งต่อกันไม่ติด?", en: "old" },
          { id: "support", th: "หลังเรียน ใครจะสนับสนุนการนำไปใช้ที่หน้างาน?", en: "old" },
          { id: "privacy", th: "ข้อมูลพนักงานและการประเมินรายบุคคลจะเก็บและจำกัดสิทธิ์อย่างไร?", en: "old" },
        ],
      },
    }),
    "th",
  );
  assert.ok(parsed);
  assert.equal(parsed.needs.title, seeded.needs.title);
  assert.equal(parsed.needs.lead, seeded.needs.lead);
  assert.equal(parsed.needs.items[0].id, HOTEL_TRAINING_NEEDS[0].id);
});

test("program cards stay verifiable and migrate retired in-house-only items", () => {
  const content = defaultHotelTrainingCms("th");
  assert.equal(content.programs.items.length, 6);
  assert.equal(content.programs.items[0].id, "service");
  assert.equal(HOTEL_TRAINING_PROGRAMS.every((item) => item.outcomes.length >= 2 && item.outcomes.length <= 4), true);
  assert.equal(HOTEL_TRAINING_PROGRAMS.every((item) => !item.durationTh && !item.groupSizeTh), true);
  assert.equal(content.programs.items.find((item) => item.id === "academy")?.href, HOTEL_TRAINING_ACADEMY_DISCOVER);
  assert.equal(HOTEL_TRAINING_PROGRAM_VISUAL.displayWidth, 360);
  const seeded = defaultHotelTrainingCms("th");
  const parsed = parseHotelTrainingPageBody(
    serializeHotelTrainingPageBody({
      ...seeded,
      programs: {
        ...seeded.programs,
        items: [
          {
            id: "inhouse",
            categoryTh: "old",
            categoryEn: "old",
            titleTh: "อบรมและเวิร์กช็อปเฉพาะองค์กร",
            titleEn: "In-house training and workshops",
            audienceTh: "old",
            audienceEn: "old",
            problemTh: "",
            problemEn: "",
            outcomes: [],
            formats: [],
            durationTh: "",
            durationEn: "",
            groupSizeTh: "",
            groupSizeEn: "",
            activityTh: "",
            activityEn: "",
            assessTh: "old",
            assessEn: "old",
            href: "#",
            ctaTh: "",
            ctaEn: "",
            durationVerified: false,
            groupSizeVerified: false,
            verified: false,
            sample: true,
          },
        ],
      },
    }),
    "th",
  );
  assert.ok(parsed);
  assert.equal(parsed.programs.items[0].id, "service");
  assert.equal(parsed.programs.items[0].href, "#training-enquiry");
});

test("related content uses published articles, guides, and the Academy listing", () => {
  const content = defaultHotelTrainingCms("th");
  const cards = hotelTrainingRelatedCards("en");
  assert.equal(cards.map((item) => item.id).join(","), "meetings,tech,revenue,ai,academy");
  assert.equal(cards.every((item) => item.href && item.categoryEn && item.contentTypeEn && item.titleEn && item.descriptionEn), true);
  assert.equal(cards.find((item) => item.id === "meetings")?.contentTypeEn, "Article");
  assert.equal(cards.find((item) => item.id === "meetings")?.publishedAt, "2026-08-19");
  assert.equal(cards.find((item) => item.id === "meetings")?.updatedAt, "2026-08-31");
  assert.equal(cards.find((item) => item.id === "tech")?.contentTypeEn, "Article");
  assert.equal(cards.find((item) => item.id === "revenue")?.contentTypeEn, "Guide");
  assert.equal(cards.find((item) => item.id === "ai")?.contentTypeEn, "Guide");
  assert.equal(cards.find((item) => item.id === "academy")?.href, HOTEL_TRAINING_ACADEMY_DISCOVER);
  assert.equal(cards.find((item) => item.id === "academy")?.contentTypeEn, "Course");
  assert.equal(cards.find((item) => item.id === "academy")?.publishedAt, undefined);
  assert.equal(cards.some((item) => /AI Mindset|Universal Prompting|Automating Daily SOPs|certificate/i.test(`${item.titleEn} ${item.descriptionEn}`)), false);
  assert.equal(content.related.cards.map((item) => item.id).join(","), "meetings,tech,revenue,ai,academy");
  assert.equal(content.related.visual.src, HOTEL_TRAINING_RELATED_VISUAL.src);
  assert.equal(HOTEL_TRAINING_RELATED_VISUAL.sourceWidth, 1200);
  assert.equal(HOTEL_TRAINING_RELATED_VISUAL.sourceHeight, 800);
  assert.equal(HOTEL_TRAINING_RELATED_VISUAL.displayWidth, 360);
  assert.equal(HOTEL_TRAINING_RELATED_VISUAL.displayHeight, 240);
  assert.equal(HOTEL_TRAINING_RELATED_VISUAL.labelEn, "Training Guide / Academy Course — Sample Cover");
  const seeded = defaultHotelTrainingCms("th");
  const parsed = parseHotelTrainingPageBody(
    serializeHotelTrainingPageBody({
      ...seeded,
      related: {
        title: seeded.related.title,
        lead: seeded.related.lead,
        visual: seeded.related.visual,
        cards: [
          {
            id: "systems",
            href: "/solutions/hotel-systems-implementation",
            featured: false,
            external: false,
            categoryTh: "โซลูชัน",
            categoryEn: "Solution",
            titleTh: "old",
            titleEn: "old",
            descriptionTh: "old",
            descriptionEn: "old",
            publishedAt: "",
            updatedAt: "",
            dateKind: "",
            contentTypeTh: "",
            contentTypeEn: "",
            ctaTh: "ดู",
            ctaEn: "See",
          },
        ],
      },
    }),
    "th",
  );
  assert.ok(parsed);
  assert.equal(parsed.related.cards.map((item) => item.id).join(","), "meetings,tech,revenue,ai,academy");
  assert.equal(parsed.related.cards.find((item) => item.id === "meetings")?.titleEn, "How to run a revenue meeting that ends in a usable decision");
});

test("retired hero description is replaced with the current seed", () => {
  const seeded = defaultHotelTrainingCms("th");
  const parsed = parseHotelTrainingPageBody(
    serializeHotelTrainingPageBody({
      ...seeded,
      hero: {
        ...seeded.hero,
        description: "เริ่มจากเป้าหมายทางธุรกิจ บทบาทในทีม ทักษะปัจจุบัน และงานที่คนต้องทำได้ จากนั้นจึงออกแบบการเรียนรู้ ฝึก ประเมิน และติดตามการนำไปใช้",
      },
    }),
    "th",
  );
  assert.ok(parsed);
  assert.equal(parsed.hero.description, seeded.hero.description);
});

test("skill matrix uses editable department rows and migrates the Need/Practise/Apply heatmap", () => {
  const content = defaultHotelTrainingCms("th");
  assert.equal(content.matrix.items.length, 5);
  assert.equal(content.matrix.items.map((item) => item.id).join(","), "front,reservations,revenue,sales,supervisor");
  assert.equal(content.matrix.items.every((item) => item.sample && item.skillTh && item.activityTh && item.assessTh), true);
  assert.equal(content.matrix.visual.src, HOTEL_TRAINING_MATRIX_VISUAL.src);
  assert.equal(HOTEL_TRAINING_MATRIX_VISUAL.sourceWidth, 1600);
  assert.equal(HOTEL_TRAINING_MATRIX_VISUAL.sourceHeight, 900);
  assert.equal(HOTEL_TRAINING_MATRIX_VISUAL.displayWidth, 720);
  assert.equal(HOTEL_TRAINING_MATRIX_VISUAL.displayHeight, 405);
  assert.equal(HOTEL_TRAINING_MATRIX_VISUAL.labelEn, "Hotel Team Skill Matrix — Sample");
  const seeded = defaultHotelTrainingCms("th");
  const parsed = parseHotelTrainingPageBody(
    serializeHotelTrainingPageBody({
      ...seeded,
      matrix: {
        title: "ตารางทักษะตัวอย่าง",
        lead: "ใช้ดูบทบาทกับทักษะที่งานต้องการ ไม่ใช่ผลประเมินพนักงานจริง",
        caption: "ตารางตัวอย่าง Need / Practise / Apply ไม่ใช่คะแนนบุคคล",
        visual: seeded.matrix.visual,
        items: [],
      },
    }),
    "th",
  );
  assert.ok(parsed);
  assert.equal(parsed.matrix.title, seeded.matrix.title);
  assert.equal(parsed.matrix.lead, seeded.matrix.lead);
  assert.equal(parsed.matrix.items.map((item) => item.id).join(","), HOTEL_TRAINING_MATRIX.map((item) => item.id).join(","));
});

test("training gallery uses 3-6 distinct real session photos and a labelled placeholder when unpublished", () => {
  const content = defaultHotelTrainingCms("th");
  const srcs = content.gallery.items.map((item) => item.src);
  assert.ok(content.gallery.items.length >= 3 && content.gallery.items.length <= 6);
  assert.equal(new Set(srcs).size, srcs.length);
  assert.equal(content.gallery.items.every((item) => item.publicationApproved), true);
  assert.equal(srcs.some((src) => src === HOTEL_TRAINING_PHOTOS.group || src === HOTEL_TRAINING_PHOTOS.leadership || src === HOTEL_TRAINING_PHOTOS.seminar), false);
  assert.equal(hotelTrainingSrcUsedInGallery(HOTEL_TRAINING_PHOTOS.group), true);
  assert.equal(hotelTrainingSrcUsedInGallery(HOTEL_TRAINING_GALLERY[0].src), true);
  assert.equal(hotelTrainingGalleryPublicSrc(content.gallery.items[0]), content.gallery.items[0].src);
  assert.equal(
    hotelTrainingGalleryPublicSrc({ src: content.gallery.items[0].src, publicationApproved: true }),
    HOTEL_TRAINING_GALLERY_PLACEHOLDER.src,
  );
  assert.equal(hotelTrainingGalleryPublicSrc({ src: content.gallery.items[0].src, publicationApproved: false }), HOTEL_TRAINING_GALLERY_PLACEHOLDER.src);
  assert.equal(hotelTrainingGalleryPublicSrc({ src: "", publicationApproved: true }), HOTEL_TRAINING_GALLERY_PLACEHOLDER.src);
  assert.equal(HOTEL_TRAINING_GALLERY_PLACEHOLDER.sourceWidth, 1200);
  assert.equal(HOTEL_TRAINING_GALLERY_PLACEHOLDER.sourceHeight, 900);
  assert.equal(HOTEL_TRAINING_GALLERY_PLACEHOLDER.displayWidth, 360);
  assert.equal(HOTEL_TRAINING_GALLERY_PLACEHOLDER.displayHeight, 270);
  assert.equal(HOTEL_TRAINING_GALLERY_PLACEHOLDER.captionEn, "Training Gallery Placeholder — replace with approved real photo");
  const resolved = hotelTrainingResolveGalleryItem({ ...content.gallery.items[0], publicationApproved: false }, "en");
  assert.equal(resolved.src, HOTEL_TRAINING_GALLERY_PLACEHOLDER.src);
  assert.equal(resolved.placeholder, true);
  assert.equal(resolved.consentLabel, "Publication consent: not yet recorded");
  assert.equal(resolved.redactionLabel, "Redaction: not yet checked");
  const published = hotelTrainingResolveGalleryItem(content.gallery.items[0], "en");
  assert.equal(published.placeholder, false);
  assert.equal(published.consentLabel, "Publication consent: approved");
  assert.match(published.redactionLabel, /Redaction: checked/);
  const seeded = defaultHotelTrainingCms("th");
  const parsed = parseHotelTrainingPageBody(
    serializeHotelTrainingPageBody({
      ...seeded,
      gallery: {
        ...seeded.gallery,
        lead: "ใช้ภาพคนละชุดกับฮีโร่และจุดปัญหา หากมีผู้เข้าร่วม ต้องมีสิทธิ์เผยแพร่ก่อนใช้ต่อ",
        items: [
          { id: "group", src: HOTEL_TRAINING_PHOTOS.group, altTh: "old", altEn: "old", captionTh: "old", captionEn: "old", topicTh: "", topicEn: "", year: "", dateLabel: "", consentStatus: "none", redactionNote: "", redactionChecked: false, source: "", status: "sample", publicationApproved: false },
          { id: "leadership", src: HOTEL_TRAINING_PHOTOS.leadership, altTh: "old", altEn: "old", captionTh: "old", captionEn: "old", topicTh: "", topicEn: "", year: "", dateLabel: "", consentStatus: "none", redactionNote: "", redactionChecked: false, source: "", status: "sample", publicationApproved: false },
          { id: "circle", src: HOTEL_TRAINING_PHOTOS.circle, altTh: "old", altEn: "old", captionTh: "old", captionEn: "old", topicTh: "", topicEn: "", year: "", dateLabel: "", consentStatus: "none", redactionNote: "", redactionChecked: false, source: "", status: "sample", publicationApproved: false },
          { id: "seminar", src: HOTEL_TRAINING_PHOTOS.seminar, altTh: "old", altEn: "old", captionTh: "old", captionEn: "old", topicTh: "", topicEn: "", year: "", dateLabel: "", consentStatus: "none", redactionNote: "", redactionChecked: false, source: "", status: "sample", publicationApproved: false },
        ],
      },
    }),
    "th",
  );
  assert.ok(parsed);
  assert.equal(parsed.gallery.lead, seeded.gallery.lead);
  assert.equal(parsed.gallery.items.map((item) => item.id).join(","), HOTEL_TRAINING_GALLERY.map((item) => item.id).join(","));
});

test("Hotel Training FAQs cover assessment privacy and the enquiry scanner blocks secrets", () => {
  const questions = hotelTrainingFaqs("en").map((item) => item.q);
  assert.ok(questions.some((item) => /assess/i.test(item)));
  assert.ok(questions.some((item) => /revenue|review/i.test(item)));
  assert.equal(hotelTrainingEnquiryHasSecrets("password: hunter2"), true);
  assert.equal(hotelTrainingEnquiryHasSecrets("employee_id: A123"), true);
  assert.equal(hotelTrainingEnquiryHasSecrets("Develop supervisors on handover"), false);
});

test("Hotel Training FAQs keep required questions without invented promises", () => {
  const thai = hotelTrainingFaqs("th");
  const english = hotelTrainingFaqs("en");
  const requiredTh = [
    "สามารถออกแบบหลักสูตรตามความต้องการของโรงแรมได้หรือไม่",
    "รองรับทีม/แผนกใดบ้าง",
    "จัดอบรมแบบ In-house, Workshop, Coaching หรือ Online ได้หรือไม่",
    "ใช้เวลาฝึกอบรมเท่าไร",
    "มีการประเมินก่อน/หลังอบรมหรือไม่",
    "ใช้ SOP หรือสถานการณ์จริงของโรงแรมเป็นโจทย์ได้หรือไม่",
    "มีการติดตามผลหลังอบรมอย่างไร",
    "ต้องมีผู้ประสานงานจากโรงแรมหรือไม่",
    "รองรับภาษาไทย/อังกฤษหรือไม่",
    "มีใบรับรองหรือไม่",
    "ดูแลความลับของข้อมูลและผู้เข้าร่วมอย่างไร",
  ];
  const requiredEn = [
    "Can the programme be designed around the hotel’s needs?",
    "Which teams or departments can join?",
    "Can it be In-house, a Workshop, Coaching, or Online?",
    "How long does the training take?",
    "Is there assessment before or after training?",
    "Can the hotel’s SOP or real workplace situations be used?",
    "How is follow-up after training handled?",
    "Does the hotel need a coordinator?",
    "Is Thai or English supported?",
    "Is there a certificate?",
    "How are participant and hotel data kept private?",
  ];
  assert.equal(requiredTh.every((question) => thai.some((item) => item.q === question)), true);
  assert.equal(requiredEn.every((question) => english.some((item) => item.q === question)), true);
  assert.ok(thai.some((item) => item.q === "อบรมเฉพาะโรงแรมหรือไม่?"));
  assert.ok(thai.some((item) => item.q === "อบรมเฉพาะองค์กรต่างจาก The KPI Plus Academy อย่างไร?"));
  assert.ok(english.some((item) => /revenue or review scores/i.test(item.q)));
  assert.ok(english.some((item) => /only one trainer/i.test(item.q)));
  assert.match(english.find((item) => item.q.includes("certificate"))?.a || "", /does not issue or advertise a certificate/);
  assert.match(english.find((item) => item.q.includes("How long"))?.a || "", /does not publish a standard number of days/);
  assert.match(english.find((item) => item.q.includes("assessment before"))?.a || "", /Not every job includes an automatic pre- and post-test/);
  assert.match(english.find((item) => item.q.includes("Thai or English"))?.a || "", /does not publish a guaranteed teaching-language list/);
  assert.match(english.find((item) => item.q.includes("Coaching"))?.a || "", /does not publish a ready-made Coaching catalogue/);
  assert.equal(hotelTrainingFaqsAreStale([{ q: "Who should join?", a: "old" }]), true);
  assert.equal(hotelTrainingCopy.th.footerStatement.includes("ใบรับรอง"), true);
  assert.equal(hotelTrainingCopy.en.footerStatement.includes("certificate"), true);

  const seeded = defaultHotelTrainingCms("th");
  const parsed = parseHotelTrainingPageBody(
    serializeHotelTrainingPageBody({
      ...seeded,
      faqLead: "คำตอบขึ้นกับโจทย์ ผู้เข้าร่วม และงานจริง ไม่ใช่คำรับประกันผลทางธุรกิจ",
      faqLeadEn: "Answers depend on the brief, the participants, and the real work. They are not a guaranteed business result.",
      faqs: [
        { id: "faq-1", qTh: "ใครควรเข้าร่วม?", qEn: "Who should join?", aTh: "old", aEn: "old" },
        { id: "faq-2", qTh: "ใช้เวลากี่วัน?", qEn: "How long does it take?", aTh: "old", aEn: "old" },
      ],
    }),
    "th",
  );
  assert.ok(parsed);
  assert.equal(parsed.faqLead, seeded.faqLead);
  assert.equal(parsed.faqs.map((item) => item.id).join(","), HOTEL_TRAINING_FAQS.map((item) => item.id).join(","));
  assert.equal(parsed.faqs.some((item) => item.qTh === "มีใบรับรองหรือไม่"), true);
});

test("training enquiry uses What Happens Next, format options, and a 2:1 sample process", () => {
  const content = defaultHotelTrainingCms("th");
  const copyEn = hotelTrainingEnquiryCopy("en");
  const copyTh = hotelTrainingEnquiryCopy("th");
  assert.equal(copyTh.submit, "ส่งคำขอ");
  assert.equal(copyEn.submit, "Send request");
  assert.equal(copyEn.steps.length, 4);
  assert.equal(copyEn.steps[0], "Share the training goal and learner group.");
  assert.equal(copyEn.steps[1], "Discuss the relevant skill or workplace challenge.");
  assert.equal(copyEn.steps[2], "Agree on a suitable format and assessment/follow-up approach.");
  assert.equal(copyEn.steps[3], "Confirm scope, schedule, owner, and next step.");
  assert.equal(HOTEL_TRAINING_ENQUIRY_FORMATS.map((item) => item.id).join(","), "in_house,workshop,coaching,online,not_sure");
  assert.equal(HOTEL_TRAINING_ENQUIRY_VISUAL.sourceWidth, 1200);
  assert.equal(HOTEL_TRAINING_ENQUIRY_VISUAL.sourceHeight, 600);
  assert.equal(HOTEL_TRAINING_ENQUIRY_VISUAL.displayWidth, 420);
  assert.equal(HOTEL_TRAINING_ENQUIRY_VISUAL.displayHeight, 210);
  assert.equal(HOTEL_TRAINING_ENQUIRY_VISUAL.labelEn, "What Happens Next — Sample process");
  assert.equal(content.form.visual.src, HOTEL_TRAINING_ENQUIRY_VISUAL.src);
  assert.equal(content.form.heading, copyTh.heading);
  const composed = composeHotelTrainingEnquiryMessage(
    {
      topic: "Front office manager",
      message: "Handover after night audit",
      scope: "8",
      channels: "Front office supervisors",
      market: "Clearer handovers",
      goal: "workshop",
      timeline: "Next quarter",
    },
    "en",
  );
  assert.match(composed, /Skill \/ topic to develop: Handover after night audit/);
  assert.match(composed, /Preferred format: Workshop/);
  assert.equal(/certificate|employee_id|assessment score/i.test(composed), false);
  const seeded = defaultHotelTrainingCms("th");
  const parsed = parseHotelTrainingPageBody(
    serializeHotelTrainingPageBody({
      ...seeded,
      form: {
        ...seeded.form,
        heading: seeded.form.heading,
        lead: "บอกเป้าหมาย บทบาท และงานที่อยากให้ทีมทำได้ดีขึ้น ไม่ต้องส่งรายชื่อพนักงาน คะแนนประเมิน หรือข้อมูลแขก",
        visual: { ...seeded.form.visual, src: "", status: "replace" },
      },
    }),
    "th",
  );
  assert.ok(parsed);
  assert.equal(parsed.form.lead, seeded.form.lead);
  assert.equal(parsed.form.visual.src, HOTEL_TRAINING_ENQUIRY_VISUAL.src);
});

test("publish blocks unverified trainer, program, gallery, and consent fields", () => {
  const trainer = clone();
  trainer.trainer.qualificationsTh = "Unverified certificate";
  trainer.trainer.qualificationsVerified = false;
  assert.equal(validateHotelTrainingPage(trainer, "publish"), "trainer_unverified");

  const program = clone();
  program.programs.items[0].durationTh = "2 days";
  program.programs.items[0].durationVerified = false;
  assert.equal(validateHotelTrainingPage(program, "publish"), "unverified_program");

  const gallery = clone();
  gallery.gallery.items[0].status = "approved";
  gallery.gallery.items[0].publicationApproved = true;
  gallery.gallery.items[0].consentStatus = "pending";
  gallery.gallery.items[0].redactionChecked = false;
  assert.equal(validateHotelTrainingPage(gallery, "publish"), "gallery_consent");

  const consent = clone();
  consent.form.labels.consentTh = "";
  assert.equal(validateHotelTrainingPage(consent, "publish"), "invalid_consent");
});

test("added Hotel Training CMS rows persist through parse", () => {
  const content = clone();
  const program = blankHotelTrainingProgram();
  content.programs.items.push(program);
  content.faqs.push({ id: "extra-faq", qTh: "คำถามเพิ่ม", qEn: "Extra question", aTh: "คำตอบ", aEn: "Answer" });
  content.gallery.items.push({
    id: "extra-photo",
    src: HOTEL_TRAINING_GALLERY_PLACEHOLDER.src,
    altTh: "ภาพตัวอย่าง",
    altEn: "Sample photo",
    captionTh: "ตัวอย่าง",
    captionEn: "Sample",
    topicTh: "",
    topicEn: "",
    year: "",
    dateLabel: "",
    consentStatus: "none",
    redactionNote: "",
    redactionChecked: false,
    source: "",
    status: "sample",
    publicationApproved: false,
  });
  const parsed = parseHotelTrainingPageBody(serializeHotelTrainingPageBody(content), "th");
  assert.ok(parsed);
  assert.equal(parsed.programs.items.some((item) => item.id === program.id), true);
  assert.equal(parsed.faqs.some((item) => item.id === "extra-faq"), true);
  assert.equal(parsed.gallery.items.some((item) => item.id === "extra-photo"), true);
});
