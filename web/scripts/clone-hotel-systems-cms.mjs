import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const copies = [
  ["lib/cms/independent-hotel-page.ts", "lib/cms/hotel-systems-page.ts"],
  ["lib/cms/independent-hotel-page-actions.ts", "lib/cms/hotel-systems-page-actions.ts"],
  ["lib/cms/independent-hotel-page-public.ts", "lib/cms/hotel-systems-page-public.ts"],
  ["components/cms/IndependentHotelPageEditor.tsx", "components/cms/HotelSystemsPageEditor.tsx"],
  ["app/crm/cms/independent-hotel/page.tsx", "app/crm/cms/hotel-systems/page.tsx"],
];

function rewrite(text) {
  const pairs = [
    ["independent-hotel-page-public", "hotel-systems-page-public"],
    ["independent-hotel-page-actions", "hotel-systems-page-actions"],
    ["independent-hotel-page", "hotel-systems-page"],
    ["IndependentHotelPageEditor", "HotelSystemsPageEditor"],
    ["IndependentHotelEditorState", "HotelSystemsEditorState"],
    ["IndependentHotelResolvedPage", "HotelSystemsResolvedPage"],
    ["IndependentHotelView", "HotelSystemsView"],
    ["ensureIndependentHotelPageFromSite", "ensureHotelSystemsPageFromSite"],
    ["hydrateIndependentHotelDocument", "hydrateHotelSystemsDocument"],
    ["saveIndependentHotelPage", "saveHotelSystemsPage"],
    ["duplicateIndependentHotelPageToLocale", "duplicateHotelSystemsPageToLocale"],
    ["editorStateForIndependentHotelDocument", "editorStateForHotelSystemsDocument"],
    ["editorStateFromIndependentHotelDocument", "editorStateFromHotelSystemsDocument"],
    ["isIndependentHotelPageDocument", "isHotelSystemsPageDocument"],
    ["isIndependentHotelCmsBody", "isHotelSystemsCmsBody"],
    ["parseIndependentHotelPageBody", "parseHotelSystemsPageBody"],
    ["serializeIndependentHotelPageBody", "serializeHotelSystemsPageBody"],
    ["validateIndependentHotelPage", "validateHotelSystemsPage"],
    ["defaultIndependentHotelCms", "defaultHotelSystemsCms"],
    ["emptyIndependentHotelCms", "emptyHotelSystemsCms"],
    ["loadIndependentHotelPagePreview", "loadHotelSystemsPagePreview"],
    ["loadIndependentHotelPage", "loadHotelSystemsPage"],
    ["independentHotelFaqsFromCms", "hotelSystemsFaqsFromCms"],
    ["independentHotelFaqsAreStale", "hotelSystemsFaqsAreStale"],
    ["independentHotelFaqs", "hotelSystemsFaqs"],
    ["independentHotelPublicPath", "hotelSystemsPublicPath"],
    ["independentHotelCmsErrorMessage", "hotelSystemsCmsErrorMessage"],
    ["independentHotelCmsNotice", "hotelSystemsCmsNotice"],
    ["independentHotelCopy", "hotelSystemsCopy"],
    ["independentEnquiryCopy", "hotelSystemsEnquiryCopy"],
    ["independentRelatedCards", "hotelSystemsRelatedCards"],
    ["independentRenderableSrc", "systemsRenderableSrc"],
    ["independentIsLibraryPlaceholder", "systemsIsLibraryPlaceholder"],
    ["independentShowsSampleBadge", "systemsShowsSampleBadge"],
    ["independentSampleLabel", "systemsSampleLabel"],
    ["IndependentVisualStatus", "SystemsVisualStatus"],
    ["IndependentKpiStatus", "SystemsKpiStatus"],
    ["IndependentSourceStatus", "SystemsSourceStatus"],
    ["IndependentCmsIntent", "SystemsCmsIntent"],
    ["IndependentCmsSaveResult", "SystemsCmsSaveResult"],
    ["CmsIndependent", "CmsSystems"],
    ["newIndependentItemId", "newSystemsItemId"],
    ["revalidateIndependentHotel", "revalidateHotelSystems"],
    ["INDEPENDENT_HOTEL_CMS_TEMPLATE", "HOTEL_SYSTEMS_CMS_TEMPLATE"],
    ["INDEPENDENT_HOTEL_PAGE_SLUG", "HOTEL_SYSTEMS_PAGE_SLUG"],
    ["INDEPENDENT_HOTEL_PAGE_ROUTE", "HOTEL_SYSTEMS_PAGE_ROUTE"],
    ["INDEPENDENT_CMS_INTENTS", "SYSTEMS_CMS_INTENTS"],
    ["INDEPENDENT_CMS_KPI_STATUSES", "SYSTEMS_CMS_KPI_STATUSES"],
    ["INDEPENDENT_CMS_SOURCE_STATUSES", "SYSTEMS_CMS_SOURCE_STATUSES"],
    ["INDEPENDENT_CMS_ERRORS_TH", "SYSTEMS_CMS_ERRORS_TH"],
    ["INDEPENDENT_CMS_ERRORS_EN", "SYSTEMS_CMS_ERRORS_EN"],
    ["independent-hotel-management", "hotel-systems-implementation"],
    ["Independent Hotel Management", "Hotel Systems Implementation"],
    ["independent-hotel-enquiry", "hotel-systems-enquiry"],
    ["/crm/cms/independent-hotel", "/crm/cms/hotel-systems"],
    ['from "@/lib/independent-hotel"', 'from "@/lib/hotel-systems"'],
    ["INDEPENDENT_", "SYSTEMS_"],
    ["independent-hotel", "hotel-systems"],
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

console.log("cloned independent-hotel CMS stack to hotel-systems");
