import { B2B_FRAMEWORK_VISUAL, B2B_FUNNEL_STEPS, B2B_HERO_VISUAL, B2B_KPIS, B2B_SCOPE_ITEMS } from "@/lib/b2b";
import { faqsForRoute } from "@/lib/faqs";
import { localizePath, type Locale } from "@/lib/seo";
import {
  B2B_CMS_TEMPLATE,
  B2B_PAGE_ROUTE,
  defaultB2bReadinessItems,
  type CmsB2bKpi,
  type CmsB2bPage,
  type CmsB2bVisual,
} from "./b2b-page";

function sampleVisual(label: string, altTh: string, altEn: string): CmsB2bVisual {
  return { src: "", altTh, altEn, status: "sample", label, caption: label };
}

function kpisFor(locale: Locale): CmsB2bKpi[] {
  const thai = locale === "th";
  return B2B_KPIS.map((kpi) => ({
    id: kpi.id,
    name: kpi.name,
    definition: thai ? kpi.definitionTh : kpi.definitionEn,
    unit: kpi.unit,
    period: thai ? kpi.periodTh : kpi.periodEn,
    target: thai ? kpi.comparisonTh : kpi.comparisonEn,
    value: "",
    dataStatus: "sample",
    values: [...kpi.values],
    labels: [...kpi.labels],
    hideUntilData: false,
  }));
}

export function defaultB2bCms(locale: Locale = "th"): CmsB2bPage {
  const thai = locale === "th";
  const faqs = faqsForRoute(localizePath(B2B_PAGE_ROUTE, locale === "en" ? "en" : "th")).map((item, index) => ({
    id: `faq-${index + 1}`,
    q: item.q,
    a: item.a,
  }));

  return {
    version: 1,
    template: B2B_CMS_TEMPLATE,
    hero: {
      eyebrow: thai ? "การขายผ่านเอเจนต์และคู่ค้า" : "B2B & Agent Sales",
      title: thai
        ? "หาพาร์ตเนอร์ที่เหมาะกับโรงแรม ไม่ใช่เพิ่มรายชื่อเอเจนต์ให้มากที่สุด"
        : "Find partners that fit the hotel, not the longest agent list",
      description: thai
        ? "Partner Fit สำคัญกว่าจำนวนพาร์ตเนอร์ และไม่ใช่การเลือกจากราคาอย่างเดียว โรงแรมต้องมีข้อเสนอ B2B โครงสร้างราคา และ Sales Material ที่ชัดก่อนเริ่มประสานงาน"
        : "Partner Fit matters more than how many names are on the list, and partners should not be chosen on price alone. The hotel needs a clear B2B offer, rate structure, and sales material before outreach starts.",
      leadNext: thai
        ? "การออกไปหาพาร์ตเนอร์ต้องโยงกับการจองและผลรายได้ ไม่ใช่แค่มีรายชื่อหรือสัญญา"
        : "Partner outreach has to connect to bookings and revenue, not stop at a contact list or a signed paper.",
      leadClose: thai
        ? "เดอะ เคพีไอ พลัส ช่วยวางกระบวนการขาย B2B ให้เป็นระบบได้ เมื่อโรงแรมอนุมัติให้ใช้บริการนี้"
        : "The KPI Plus can help set a structured B2B sales process, only where this service is approved.",
      primaryCta: {
        label: thai ? "ให้ทีมประเมินช่องทาง B2B ของโรงแรม" : "Ask the team to review the hotel’s B2B path",
        href: "#b2b-enquiry",
      },
      secondaryCta: { label: thai ? "ดูโซลูชันทั้งหมด" : "All solutions", href: "/solutions" },
      underCta: thai
        ? "ส่งชื่อโรงแรม จำนวนห้อง และสถานะพาร์ตเนอร์ปัจจุบัน"
        : "Send the hotel name, room count, and whether partners already exist.",
      caption: thai ? B2B_HERO_VISUAL.caption.th : B2B_HERO_VISUAL.caption.en,
      visual: {
        ...sampleVisual(
          thai ? B2B_HERO_VISUAL.label.th : B2B_HERO_VISUAL.label.en,
          B2B_HERO_VISUAL.alt.th,
          B2B_HERO_VISUAL.alt.en,
        ),
        caption: thai ? B2B_HERO_VISUAL.meta.th : B2B_HERO_VISUAL.meta.en,
      },
    },
    readiness: {
      title: thai ? "โรงแรมของคุณควรเพิ่มช่องทาง B2B ไหม?" : "Should this hotel add a B2B channel yet?",
      body: thai
        ? "ก่อนแนะนำเอเยนต์รายใหม่ เราดูว่าโรงแรมต้องการลูกค้าจากตลาดใด มีห้องว่างในช่วงไหน ราคาปัจจุบันเป็นอย่างไร และทีมสามารถดูแลการจองและเงื่อนไขของพาร์ตเนอร์ได้แค่ไหน"
        : "Before we introduce a new agent, we look at the market the hotel needs, which dates still have rooms, the current rates, and whether the team can look after partner bookings and conditions.",
      close: thai
        ? "บางโรงแรมอาจได้ประโยชน์จาก B2B ขณะที่บางแห่งควรปรับราคา OTA หรือการจองตรงให้แข็งแรงก่อน"
        : "Some hotels can gain from B2B. Others should strengthen OTA rates or direct booking first.",
      visual: {
        ...sampleVisual(B2B_FRAMEWORK_VISUAL.label.en, B2B_FRAMEWORK_VISUAL.alt.th, B2B_FRAMEWORK_VISUAL.alt.en),
        caption: thai ? B2B_FRAMEWORK_VISUAL.caption.th : B2B_FRAMEWORK_VISUAL.caption.en,
      },
      items: defaultB2bReadinessItems(locale),
    },
    problemsSection: {
      title: thai ? "มีพาร์ตเนอร์อยู่แล้ว แต่ยังไม่เห็นผลชัด?" : "Already have partners, but the result is still unclear?",
    },
    problems: (thai
      ? [
          "มีสัญญาหลายฉบับ แต่ยังไม่รู้ว่าพาร์ตเนอร์รายไหนสร้างยอดขายจริง",
          "กันห้องไว้ให้พาร์ตเนอร์ แต่ยอดขายไม่เป็นไปตามที่คาด",
          "ราคาและเงื่อนไขแต่ละราย ไม่สอดคล้องกัน",
          "ขาดการอัปเดตสินค้า และการติดตามกับเอเจนต์อย่างต่อเนื่อง",
          "ยังไม่ได้มอง B2B ร่วมกับ OTA และ Direct Booking ในภาพเดียวกัน",
        ]
      : [
          "There are several contracts, but it is unclear who actually sends sales",
          "Rooms are held for a partner and are not sold as expected",
          "Rates and conditions are not consistent across partners",
          "Product updates and follow-up with agents are missing",
          "B2B sales are not reviewed together with OTAs and direct booking",
        ]
    ).map((text, index) => ({ id: `problem-${index + 1}`, text, order: index + 1 })),
    scopeSection: { title: thai ? "เดอะ เคพีไอ พลัส ช่วยอะไร?" : "What The KPI Plus helps with" },
    scopeItems: B2B_SCOPE_ITEMS.map((item, index) => ({
      id: item.id,
      kicker: item.kicker,
      title: thai ? item.titleTh : item.titleEn,
      description: thai ? item.bodyTh : item.bodyEn,
      input: thai ? item.inputTh : item.inputEn,
      output: thai ? item.outputTh : item.outputEn,
      order: index + 1,
    })),
    funnelSection: {
      title: thai ? "ลำดับงานขายผ่านพาร์ตเนอร์" : "The partner sales sequence",
      caption: thai
        ? "ลำดับงานที่ใช้คุยกับโรงแรม ไม่ใช่ผลงานของพาร์ตเนอร์รายใดรายหนึ่ง"
        : "A working sequence used with the hotel, not one partner’s results.",
    },
    funnelSteps: B2B_FUNNEL_STEPS.map((step) => ({
      id: step.id,
      number: step.number,
      label: thai ? step.labelTh : step.labelEn,
    })),
    workflowSection: {
      title: thai ? "วิธีที่เราทำงานร่วมกับโรงแรม" : "How the work runs",
      visual: sampleVisual(
        thai ? "ตัวอย่างข้อมูล" : "Sample Visual",
        "แผนภาพตัวอย่างขั้นตอนงาน B2B กับโรงแรม",
        "Sample diagram of the B2B working sequence with the hotel",
      ),
    },
    workflowSteps: (thai
      ? [
          ["01", "Assess", "ดูภาพรวมโรงแรม", "จำนวนห้อง ตลาดหลัก ฤดูกาล ราคา และช่องทางขายปัจจุบัน"],
          ["02", "Evaluate", "ประเมินโอกาส B2B", "ดูว่าตลาดหรือช่วงไหนที่พาร์ตเนอร์อาจช่วยเพิ่มยอดขายได้ และมีข้อจำกัดอะไรบ้าง"],
          ["03", "Connect", "คัดเลือกและเริ่มพูดคุย", "ประสานพาร์ตเนอร์ที่เหมาะสม พร้อมทบทวนราคาและเงื่อนไขร่วมกับโรงแรม"],
          ["04", "Sell", "เริ่มขายและติดตามผล", "ดูยอดจอง การใช้ห้องที่จัดสรร และผลต่อรายได้เมื่อเทียบกับช่องทางอื่น"],
          ["05", "Review", "ปรับความร่วมมือ", "ตัดสินใจจากผลงานจริงว่าควรทำต่อ ปรับเงื่อนไข หรือเปลี่ยนพาร์ตเนอร์"],
        ]
      : [
          ["01", "Assess", "See the hotel as a whole", "Rooms, main markets, season, rates, and current channels."],
          ["02", "Evaluate", "Review the B2B chance", "Name the market or dates a partner could help, and the limits that have to be managed."],
          ["03", "Connect", "Choose and start the conversation", "Introduce a suitable partner from the network and review rates and conditions with the hotel."],
          ["04", "Sell", "Start selling and review the result", "Look at bookings, use of allocated rooms, and the effect on revenue and other channels."],
          ["05", "Review", "Adjust the relationship", "Decide from real results whether to continue, change terms, or re-order partners."],
        ]
    ).map(([number, phase, title, description], index) => ({
      id: `workflow-${index + 1}`,
      number,
      phase,
      title,
      description,
      order: index + 1,
    })),
    measureSection: {
      title: thai ? "เราวัดผลอะไร?" : "What do we measure?",
      intro: thai
        ? "เราไม่ได้ดูเพียงจำนวนพาร์ตเนอร์ที่เซ็นสัญญา แต่ดูจำนวนคืนห้องพัก รายได้ และผลงานของแต่ละราย เทียบกับเงื่อนไขที่ตกลงไว้"
        : "We do not look only at how many partners signed. We look at room nights, revenue, and each partner’s result against the agreed conditions.",
      close: thai
        ? "เมื่อโรงแรมมีข้อมูลเพียงพอ ทีมจะพิจารณาต่อถึงช่วงเวลาจอง ตลาดต้นทาง การใช้ห้องที่จัดสรร และรายได้หลังต้นทุน"
        : "When the hotel has enough data, the team also reviews booking window, source market, use of allocated rooms, and revenue after cost.",
      sampleLabel: thai ? "ตัวอย่างข้อมูล" : "Sample Visual",
      visual: sampleVisual(
        thai ? "ตัวอย่างข้อมูล" : "Sample Visual",
        "กราฟตัวอย่างดัชนีผลงานพาร์ตเนอร์ ไม่ใช่ยอดจริงของโรงแรม",
        "Sample partner-performance index chart, not a live hotel result",
      ),
    },
    kpis: kpisFor(locale),
    related: {
      title: thai ? "เรื่องที่เกี่ยวข้องกับช่องทางขายและแผนรายได้" : "Related reading on channels and the revenue plan",
      cards: [
        {
          id: "revenue",
          href: "/solutions/revenue-commercial-management",
          category: "Solution",
          title: "Revenue & Commercial Management",
          description: thai
            ? "B2B ต้องดูร่วมกับราคา OTA และการจองตรง ไม่ใช่เพิ่มช่องทางโดยไม่ดูภาพรวมรายได้"
            : "B2B has to sit with rates, OTAs, and direct booking. It is not another channel added without the revenue picture.",
          meta: "",
          cta: thai ? "ดูรายละเอียด" : "Read more",
        },
        {
          id: "budget",
          href: "/tools/hotel-budget-calculator",
          category: "Tool",
          title: thai ? "เครื่องคำนวณ Budget โรงแรม" : "Hotel budget calculator",
          description: thai
            ? "ดูแผนรายได้และค่าใช้จ่ายของโรงแรมก่อนคุยเรื่องช่องทางขายเพิ่ม ไม่ใช่เครื่องคำนวณต้นทุนสัญญา B2B"
            : "See the hotel’s revenue and cost plan before adding another sales channel. This is not a B2B contract-cost calculator.",
          meta: "",
          cta: thai ? "ใช้เครื่องมือฟรี" : "Use the free tool",
        },
      ],
    },
    form: {
      kicker: "B2B & Agent Sales",
      heading: thai ? "คุยเรื่องช่องทางพาร์ตเนอร์ของโรงแรม" : "Talk through the hotel’s partner path",
      lead: thai
        ? "ส่งชื่อโรงแรม จำนวนห้อง และสถานะพาร์ตเนอร์ปัจจุบัน"
        : "Send the hotel name, room count, and whether partners already exist.",
      submit: thai ? "ให้ทีมประเมินช่องทาง B2B ของโรงแรม" : "Ask the team to review the hotel’s B2B path",
    },
    faqIntro: thai
      ? "คำถามก่อนเริ่มงาน หากบริบทของโรงแรมต่างจากตัวอย่างเหล่านี้ สามารถเริ่มจากการวิเคราะห์ภาพรวมก่อนเลือกแนวทางทำงาน"
      : "Questions before the work starts. If this hotel’s context differs, begin with a whole-hotel review.",
    faqs,
    seo: {
      social: sampleVisual(
        thai ? "ตัวอย่างข้อมูล" : "Sample Visual",
        "ภาพสังคมสำหรับหน้าการขายผ่านเอเจนต์และคู่ค้า",
        "Social image for the B2B and Agent Sales page",
      ),
    },
  };
}
