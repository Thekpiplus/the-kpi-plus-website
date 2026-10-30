import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const copies = [
  ["components/IndependentHotelView.tsx", "components/HotelSystemsView.tsx"],
  ["components/IndependentHotelEnquiry.tsx", "components/HotelSystemsEnquiry.tsx"],
  ["components/IndependentHotelStickyCta.tsx", "components/HotelSystemsStickyCta.tsx"],
  ["components/independent-hotel/IndependentVisuals.tsx", "components/hotel-systems/HotelSystemsVisuals.tsx"],
  ["components/independent-hotel/IndependentVisualFrame.tsx", "components/hotel-systems/HotelSystemsVisualFrame.tsx"],
  ["components/independent-hotel/IndependentEnquiryIntro.tsx", "components/hotel-systems/HotelSystemsEnquiryIntro.tsx"],
  ["components/independent-hotel/independent-visuals.css", "components/hotel-systems/hotel-systems-visuals.css"],
];

function rewrite(text) {
  const pairs = [
    ["independent-hotel/IndependentVisuals", "hotel-systems/HotelSystemsVisuals"],
    ["independent-hotel/IndependentVisualFrame", "hotel-systems/HotelSystemsVisualFrame"],
    ["independent-hotel/IndependentEnquiryIntro", "hotel-systems/HotelSystemsEnquiryIntro"],
    ["independent-hotel/independent-visuals.css", "hotel-systems/hotel-systems-visuals.css"],
    ["IndependentHotelView", "HotelSystemsView"],
    ["IndependentHotelEnquiry", "HotelSystemsEnquiry"],
    ["IndependentHotelStickyCta", "HotelSystemsStickyCta"],
    ["IndependentEnquiryIntro", "HotelSystemsEnquiryIntro"],
    ["IndependentEnquiryVisual", "HotelSystemsEnquiryVisual"],
    ["IndependentHeroVisual", "HotelSystemsHeroVisual"],
    ["IndependentAssessmentVisual", "HotelSystemsReviewVisual"],
    ["IndependentServicesVisual", "HotelSystemsLandscapeVisual"],
    ["IndependentModelVisual", "HotelSystemsBeforeAfterVisual"],
    ["IndependentDeliverablesVisual", "HotelSystemsReadinessVisual"],
    ["IndependentWorkflowVisual", "HotelSystemsWorkflowVisual"],
    ["IndependentFitVisual", "HotelSystemsPlatformVisual"],
    ["IndependentScopeVisual", "HotelSystemsScopeVisual"],
    ["IndependentPlanVisual", "HotelSystemsHandoverVisual"],
    ["IndependentRelatedVisual", "HotelSystemsRelatedVisual"],
    ["IndependentVisualFrame", "HotelSystemsVisualFrame"],
    ["loadIndependentHotelPage", "loadHotelSystemsPage"],
    ["independentHotelFaqsFromCms", "hotelSystemsFaqsFromCms"],
    ["independentHotelCopy", "hotelSystemsCopy"],
    ["independentRelatedCards", "hotelSystemsRelatedCards"],
    ["independentEnquiryCopy", "hotelSystemsEnquiryCopy"],
    ["independentRenderableSrc", "systemsRenderableSrc"],
    ["independentSampleLabel", "systemsSampleLabel"],
    ["independentShowsSampleBadge", "systemsShowsSampleBadge"],
    ["independentPublicHref", "systemsPublicHref"],
    ["CmsIndependentPage", "CmsSystemsPage"],
    ["independent-hotel-page-public", "hotel-systems-page-public"],
    ["independent-hotel-page", "hotel-systems-page"],
    ["independent-hotel-management", "hotel-systems-implementation"],
    ["independent-hotel-enquiry", "hotel-systems-enquiry"],
    ["independent_hotel", "hotel_systems"],
    ["kpi-independent", "kpi-systems"],
    ["ihm-visual", "hsi-visual"],
    ["ihm-hero", "hsi-hero"],
    ["ihm-board", "hsi-board"],
    ["ihm-mock", "hsi-mock"],
    ["ihm-assessment", "hsi-assessment"],
    ["ihm-operating", "hsi-operating"],
    [".ihm-", ".hsi-"],
    ['from "@/lib/independent-hotel"', 'from "@/lib/hotel-systems"'],
    ["INDEPENDENT_", "SYSTEMS_"],
    ["#independent-hotel-faq", "#hotel-systems-faq"],
    ["independent-hotel-measure", "hotel-systems-measure"],
    ["independent-hotel-sources", "hotel-systems-sources"],
    ["independent-hotel-faq", "hotel-systems-faq"],
  ];
  let next = text;
  for (const [from, to] of pairs) next = next.split(from).join(to);
  return next;
}

for (const [fromRel, toRel] of copies) {
  const from = path.join(root, fromRel);
  const to = path.join(root, toRel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.writeFileSync(to, rewrite(fs.readFileSync(from, "utf8")));
}

console.log("cloned independent-hotel public stack to hotel-systems");
