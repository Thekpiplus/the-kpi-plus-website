/**
 * Editor-only citation record. Do not import this from TechnologyView,
 * HotelAiVisuals, or any public page. Numbers stay unpublished until
 * the metric definition and the paper’s figures can be reconciled.
 */
export const HOTEL_AI_EVIDENCE_UNPUBLISHED = {
  status: "unpublished",
  publishable: false,
  cmsTodo:
    "Do not republish check-in time figures on the Hotel AI public page.",
  withholdReason:
    "Table 2 reports 3.3 then 2.7 minutes; Table 8 narrative reports 3.2 then 2.8 minutes. Average-time start/stop is not defined. Week 1 is already 82% AI-assisted, so it is not a pre-AI baseline. Occupancy also rose 72% to 78%. Not a The KPI Plus project. Hotel unnamed — do not imply a client.",
  author: "Pongsakorn Limna, Tanpat Kraiwanit, Tanatorn Tanantong, Todsanai Chumwatana",
  institution:
    "Rangsit University and Thammasat University. Published by University of Primorska Press in Academica Turistica — not a University of Primorska research case.",
  title: "Revolutionizing Hotel Operations with AI: A Case Study on the Power of ChatGPT and Gemini Integration",
  publicationDate: "2025 (fieldwork January–February 2024; RUP record 16 December 2025)",
  url: "https://doi.org/10.26493/2335-4194.18.39-55",
  repositoryUrl: "https://repozitorij.upr.si/IzpisGradiva.php?id=22208&lang=eng",
  workflow:
    "Front-desk check-in processing time. The paper does not state when the timer starts or stops, or whether the average includes only AI-assisted check-ins.",
  sample:
    "One unnamed 4-star hotel in Ao Nang, Krabi; 180 rooms; 120 FTE; 2,155 check-ins over eight weeks. Qualitative source: one owner interview.",
  method:
    "Mixed methods. Week 1 already had 82% AI usage. No control group. Occupancy changed during the same period.",
  metric:
    "Do not publish: 3.3 minutes (January week 1) to 2.7 minutes (February weeks 7–8) in Table 2, versus 3.2 to 2.8 minutes in the Table 8 narrative. Unit: minutes.",
  limitations:
    "Single case; no pre-AI baseline; confounding occupancy change; owner self-report; hotel not named; not a The KPI Plus engagement.",
  permission:
    "Hotel name is not in the paper. Do not name Ao Nang on this service page. Do not present the location as a The KPI Plus client.",
} as const;
