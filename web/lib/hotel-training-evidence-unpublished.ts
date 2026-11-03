/**
 * Editor-only citation record. Do not import this from TrainingView
 * or any public page. Numeric study figures stay unpublished until
 * definition, method, limitations, and permission are complete.
 */
export const HOTEL_TRAINING_EVIDENCE_UNPUBLISHED = {
  status: "unpublished",
  publishable: false,
  cmsTodo: "Do not republish 398-manager or five-star Thailand figures on the Training page.",
  withholdReason:
    "The current page cites ScienceDirect PII S0278431925002725 and ‘398 department managers in five-star hotels in Thailand’. Full text, metric definition, method, limitations, and republication permission are not confirmed in this rebuild. Do not present it as a The KPI Plus result.",
  title: "ScienceDirect article PII S0278431925002725 (experiential learning / self-efficacy among hotel managers)",
  url: "https://www.sciencedirect.com/science/article/abs/pii/S0278431925002725",
  metric: "Do not publish: 398 department managers; five-star hotels in Thailand.",
  limitations:
    "Abstract-only citation on the previous page. Not a The KPI Plus evaluation. Not a guarantee that training raises revenue, reviews, productivity, or guest satisfaction.",
  permission: "Republication of paywalled figures is not confirmed. Keep the public page qualitative.",
} as const;
