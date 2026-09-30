import assert from "node:assert/strict";
import {
  extractPlaceIdFromUrl,
  isDirectReviewUrl,
  parseGoogleUrl,
} from "../lib/review-link.ts";

const review = parseGoogleUrl("https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4");
assert.equal("url" in review, true);
if ("url" in review) {
  assert.equal(review.isReview, true);
  assert.equal(review.placeId, "ChIJN1t_tDeuEmsRUsoyG83frY4");
}

const gpage = parseGoogleUrl("https://g.page/r/Cd2b86WkXrYgEBM/review");
assert.equal("url" in gpage && gpage.isReview, true);

const maps = parseGoogleUrl("https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeuEmsRUsoyG83frY4");
assert.equal("url" in maps && maps.placeId === "ChIJN1t_tDeuEmsRUsoyG83frY4", true);
assert.equal("url" in maps && maps.isReview, false);

const listing = parseGoogleUrl("https://www.google.com/maps/place/Some+Hotel");
assert.equal("url" in listing && listing.isReview, false);
assert.equal("url" in listing && listing.placeId, "");

assert.equal(parseGoogleUrl("https://example.com/review").error, "invalid_link");
assert.equal(parseGoogleUrl("not-a-url").error, "invalid_link");
assert.equal(parseGoogleUrl("http://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4").error, "invalid_link");

const url = new URL("https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4");
assert.equal(isDirectReviewUrl(url), true);
assert.equal(extractPlaceIdFromUrl(url), "ChIJN1t_tDeuEmsRUsoyG83frY4");

console.log("review-link checks passed");
