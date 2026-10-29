import { adsFaqs } from "@/lib/google-ads";
import { hotelSeoFaqs } from "@/lib/hotel-seo";
import { hotelDirectBookingFaqs } from "@/lib/direct-bookings";
import { independentHotelFaqs } from "@/lib/independent-hotel";
import { hotelWebsiteFaqs } from "@/lib/hotel-website";
import { metaFaqs } from "@/lib/meta-ads";

export type FaqItem = { q: string; a: string };

const caseStudiesFaqsEn: FaqItem[] = [
  {
    q: "Are these case studies real data or sample data?",
    a: "The published figures come from authorised hotel performance for the period shown on each case. They are not invented numbers. Cases on this page are anonymised: they use the property type and area, not the hotel name. If a case were sample data, it would be labelled “Sample data”. Cover images and report previews that are not approved client assets are labelled as samples. Figures without a confirmed period or source stay off the public page.",
  },
  {
    q: "Can you name the hotel?",
    a: "Only when the hotel has approved the use of its name. Until then, the case stays anonymised — for example a premium pool villa in Layan or an independent boutique hotel in Patong. Information a hotel sends for a performance review is not published as a case study without that permission.",
  },
  {
    q: "Over what period are the results measured?",
    a: "Each case has its own measurement period, shown on the card and the case page. Current examples include the first six months from October 2025, an annual window, July 2026, and June 2026. Where a comparison exists, it is against the period before Action began. An unconfirmed comparison window is not shown in public.",
  },
  {
    q: "Which metrics are used to assess performance?",
    a: "The metrics follow the work, not a single set for every hotel. Revenue and Distribution cases use Room Revenue, ADR, occupancy, and room nights sold. Digital Performance cases use ROAS, booking revenue, ad spend, and direct bookings. Each public figure has a name, a value, and its period. A metric with no confirmed unit or definition is not used as a public claim.",
  },
  {
    q: "What factors do the results depend on?",
    a: "Results depend on the period, season, pricing, channel, and the data available from the hotel, as well as the property, market conditions, product, and operations. The figures shown are that hotel’s performance in the stated period. They do not guarantee future revenue, occupancy, or results.",
  },
  {
    q: "Can the team help analyse the hotel’s performance?",
    a: "Yes. Use Request a Hotel Performance Review on this page. The team starts from the information the hotel already has, looking for where revenue may be leaking, opportunities in Pricing and Distribution, and an Action plan the hotel can take forward. The initial review has no fee and does not promise higher occupancy or revenue. Scope and fees are discussed later if you want the team to continue. The team replies within 2 business days.",
  },
  {
    q: "What information should we prepare to start?",
    a: "Hotel name, area, an approximate room count, and the issue you are seeing now — such as occupancy, pricing, OTAs, or direct bookings. If you already have booking pace, pickup, ADR, channel mix, or campaign figures, bring what you have. You do not need a full report on day one.",
  },
  {
    q: "When do you publish a case study?",
    a: "When the hotel has authorised use of its performance data and the case has a stated measurement period. Some cases use the hotel name after approval. Others stay anonymised. Unconfirmed figures are not shown in public, and sample visuals are labelled as samples.",
  },
  {
    q: "Do these results guarantee future performance?",
    a: "No. Results vary by property, market conditions, product, pricing, distribution and operations. The figures shown reflect the stated periods for each hotel.",
  },
];

const reservationsFaqsTh: FaqItem[] = [
  {
    q: "The KPI Plus ดูแลงาน Reservations ส่วนใดบ้าง",
    a: "ทีมดูแลงาน Reservations ตามขอบเขตที่ตกลงกับโรงแรม งานที่อาจอยู่ในขอบเขต ได้แก่ Inquiry Handling, Booking Entry, Availability / Rate Check, Modification, Cancellation, Confirmation, Channel Coordination และ Reservation Reporting โรงแรมอาจเริ่มจากบางช่องทาง บางช่วงเวลา หรือบางขั้นตอน กลยุทธ์ราคา นโยบายห้องว่าง ข้อยกเว้นการคืนเงิน การชดเชยแขก และนโยบายปฏิบัติงานขั้นสุดท้ายเป็นของโรงแรม",
  },
  {
    q: "รองรับ Email, Phone, Website และ OTA หรือไม่",
    a: "Email, Phone และ Website อยู่ในช่องทางที่อาจตกลงให้ดูแลได้ รวมถึง LINE และ Social ตามข้อมูลบริการ งานที่เกี่ยวกับ OTA เช่น ตรวจห้องว่างและราคา หรือประสานข้อมูลห้องว่างให้สอดคล้องกัน อาจอยู่ในขอบเขตเมื่อโรงแรมตกลง ช่องทางที่ใช้จริงจะระบุก่อนเริ่มงาน ไม่ได้หมายความว่าทุกช่องทางจะเปิดครบในทุกโรงแรม",
  },
  {
    q: "ใช้ PMS หรือระบบจองเดิมของโรงแรมได้หรือไม่",
    a: "ไม่จำเป็นต้องเปลี่ยน PMS หรือระบบจองก่อนเริ่ม ทีมจะดูระบบที่ใช้อยู่ สิทธิ์การเข้าถึง และวิธีส่งต่อรายละเอียด แล้วตกลงกระบวนการที่ทำงานได้จริง การเชื่อมต่อระบบจะยืนยันได้ก็ต่อเมื่อตรวจและตกลงกับโรงแรมแล้ว ไม่ได้ระบุเป็นข้อเท็จจริงล่วงหน้า",
  },
  {
    q: "ใครเป็นผู้ยืนยัน Rate และ Availability",
    a: "โรงแรมเป็นผู้ยืนยันราคาและห้องว่างที่ใช้ตอบลูกค้า เดอะ เคพีไอ พลัส ตรวจและแจ้งตัวเลือกจากข้อมูลที่โรงแรมอนุมัติแล้ว หากราคาหรือห้องอยู่นอกเงื่อนไขที่อนุมัติ จะส่งต่อให้โรงแรมตัดสินใจ",
  },
  {
    q: "กำหนด SLA และเวลาทำงานอย่างไร",
    a: "ช่วงเวลาที่ดูแลจะระบุในขอบเขตบริการของแต่ละโรงแรม รวมถึงวิธีรับและส่งต่องานนอกเวลาที่ตกลงกัน SLA และเวลาทำงานตกลงก่อนเริ่มงาน หน้านี้ไม่ได้ระบุชั่วโมงตอบกลับหรือค่า SLA เป็นตัวเลข",
  },
  {
    q: "รองรับภาษาไทยและภาษาอังกฤษหรือไม่",
    a: "ภาษาที่ใช้ตอบลูกค้าจะตกลงในขอบเขตบริการก่อนเริ่มงาน หน้านี้ยังไม่มีรายการภาษาที่อนุมัติเผยแพร่ จึงยังไม่ระบุว่าครอบคลุมภาษาไทยและภาษาอังกฤษในทุกโรงแรม โรงแรมระบุภาษาที่ต้องการใช้ตอนคุยเรื่องขอบเขตงานได้",
  },
  {
    q: "ทีมโรงแรมต้องเตรียมข้อมูลอะไร",
    a: "เริ่มจากข้อมูลที่โรงแรมสะดวกแชร์ได้ เช่น ช่องทางที่ลูกค้าติดต่อ ระบบจองหรือ PMS ที่ใช้อยู่ ราคาและเงื่อนไขที่อนุมัติ ช่วงเวลาที่ต้องการให้ช่วย และผู้มีสิทธิ์อนุมัติกรณีพิเศษ ไม่ต้องส่งรายงานครบในครั้งแรก รายละเอียดเพิ่มจะคุยตอนกำหนดขอบเขตงาน",
  },
  {
    q: "Modification และ Cancellation จัดการอย่างไร",
    a: "การแก้ไขและการยกเลิกอาจอยู่ในขอบเขตที่ตกลงกัน ทีมปรับรายละเอียดการจองตามเงื่อนไขที่โรงแรมอนุมัติ และดำเนินการยกเลิกตามนโยบายของโรงแรม พร้อมบันทึกสถานะให้ชัด ข้อยกเว้นการคืนเงินหรือการชดเชยแขกส่งต่อให้โรงแรมตัดสินใจ",
  },
  {
    q: "มีรายงานสรุปให้โรงแรมหรือไม่",
    a: "เมื่องาน Reservation Reporting อยู่ในขอบเขตที่ตกลงกัน ทีมสรุปข้อเท็จจริงจากงานจองตามช่องทางและระบบที่มีอยู่ เพื่อให้โรงแรมทบทวนร่วมกัน ผลลัพธ์ของงานนี้คือสรุปงานจองรายสัปดาห์ โรงแรมที่ยังไม่ได้ตกลงงานรายงานจะยังไม่ได้รับสรุปนี้",
  },
  {
    q: "ดูแลหลายโรงแรมในระบบเดียวกันได้หรือไม่",
    a: "แต่ละโรงแรมตกลงขอบเขตงาน ช่องทาง สิทธิ์เข้าถึงระบบ และวิธีส่งต่อของตนเอง หน้านี้ไม่ได้ระบุว่าระบบเดียวใช้ร่วมกันหลายโรงแรมเป็นข้อเท็จจริง หากเป็นกลุ่มโรงแรม รายละเอียดการดูแลหลายแห่งจะคุยตอนกำหนดขอบเขตงาน",
  },
];

const reservationsFaqsEn: FaqItem[] = [
  {
    q: "Which reservation work does The KPI Plus look after?",
    a: "The team looks after reservation work in the scope agreed with the hotel. That may include Inquiry Handling, Booking Entry, Availability / Rate Check, Modification, Cancellation, Confirmation, Channel Coordination, and Reservation Reporting. The hotel can start with some channels, hours, or steps. Rate strategy, inventory policy, refund exceptions, guest compensation, and final operating policies stay with the hotel.",
  },
  {
    q: "Can the work cover Email, Phone, Website, and OTA?",
    a: "Email, Phone, and Website can be among the channels agreed for cover, along with LINE and Social in the service data. OTA work such as checking availability and rates, or keeping availability information consistent, can sit in scope when the hotel agrees. The channels in use are written before work starts. That does not mean every channel is open for every hotel.",
  },
  {
    q: "Can you use the hotel’s existing PMS or booking system?",
    a: "The hotel does not need to change the PMS or booking system first. The team reviews the current system, access, and how details are handed over, then agrees a process that can actually run. A system integration is not stated as a fact until it has been reviewed and agreed with the hotel.",
  },
  {
    q: "Who confirms rate and availability?",
    a: "The hotel confirms the rates and availability used in the guest reply. The KPI Plus checks and states options from facts the hotel has already approved. A rate or room outside those approved conditions goes back to the hotel for a decision.",
  },
  {
    q: "How are SLA and working hours set?",
    a: "The hours of cover are written in each hotel’s service scope, including how work outside those hours is received and handed over. SLA and working hours are agreed before work starts. This page does not publish a reply-time number or a fixed SLA.",
  },
  {
    q: "Is Thai and English supported?",
    a: "The languages used with guests are agreed in the service scope before work starts. This page does not publish an approved language list, so Thai and English are not stated as a fact for every hotel. The hotel can name the languages it needs when discussing scope.",
  },
  {
    q: "What does the hotel team need to prepare?",
    a: "Start with what the hotel can share: the channels guests use, the PMS or booking system in place, approved rates and conditions, the hours of help needed, and who can approve exceptions. A complete report is not required on the first enquiry. Further detail is discussed when the service scope is set.",
  },
  {
    q: "How are modifications and cancellations handled?",
    a: "Modification and cancellation can sit in the agreed scope. The team updates booking details using the hotel’s approved conditions, and runs a cancellation by the hotel’s policy, recording the status clearly. Refund exceptions and guest compensation go back to the hotel.",
  },
  {
    q: "Does the hotel receive a summary report?",
    a: "When Reservation Reporting sits in the agreed scope, the team shares reservation facts from the channels and systems in place, so the hotel can review them. The output of that work is a weekly reservation summary. A hotel that has not agreed reporting in scope does not receive this summary.",
  },
  {
    q: "Can several hotels be looked after in the same system?",
    a: "Each hotel agrees its own scope, channels, system access, and hand-over path. This page does not state that several hotels share one system as a fact. If the enquiry is for a hotel group, how several properties are looked after is discussed when the service scope is set.",
  },
];

const b2bFaqsTh: FaqItem[] = [
  {
    q: "B2B Agent Sales เหมาะกับโรงแรมแบบใด",
    a: "เหมาะเป็นพิเศษกับโรงแรมขนาดกลางถึงขนาดใหญ่ ที่มีจำนวนห้องและทีมรองรับการขายผ่านพาร์ตเนอร์ได้ โรงแรมขนาดเล็กพูดคุยเพื่อประเมินได้ แต่ช่องทางอื่นอาจเหมาะกว่าในช่วงเริ่มต้น ทีมดูจากสถานการณ์ของโรงแรม ไม่ได้แนะนำ B2B กับทุกแห่ง",
  },
  {
    q: "The KPI Plus หา Partner ให้ทั้งหมดหรือไม่",
    a: "ไม่ใช่การรับหาพาร์ตเนอร์ให้ครบทุกตลาด และไม่ได้รับประกันรายชื่อ ทีมช่วยคัดเลือกและประสานพาร์ตเนอร์ที่เกี่ยวข้องจากเครือข่าย หลังดูว่าช่องทางนี้เหมาะกับโรงแรมหรือไม่ โรงแรมเป็นผู้พิจารณาความร่วมมือ",
  },
  {
    q: "โรงแรมต้องมี Rate Plan และ Commission ก่อนหรือไม่",
    a: "ต้องมีกรอบราคาและค่าคอมมิชชันที่โรงแรมยอมรับได้ก่อนเริ่มประสานพาร์ตเนอร์ หากยังไม่ครบ ทีมช่วยทบทวนโครงสร้างราคาและเงื่อนไข แต่ยังไม่ส่งข้อเสนอออกไปจนกว่าโรงแรมจะอนุมัติ",
  },
  {
    q: "ดูแล Agent ที่มีอยู่แล้วได้หรือไม่",
    a: "ได้ งานนี้ไม่ได้จำกัดที่การหาเอเจนต์รายใหม่ ทีมช่วยทบทวนพาร์ตเนอร์ที่มีอยู่ เรื่องราคา เงื่อนไข การติดตาม และผลงานเทียบกับช่องทางอื่น",
  },
  {
    q: "ต่างจากการลง OTA อย่างไร",
    a: "OTA เป็นช่องทางลงขายสาธารณะตามเงื่อนไขของแพลตฟอร์ม B2B เป็นการขายผ่านพาร์ตเนอร์ที่คัดแล้ว มี Rate Plan ค่าคอมมิชชัน สัญญา และการติดตามเป็นรายราย ไม่ใช่การลงห้องเพิ่มบน OTA และควรดูร่วมกับการจองตรง ไม่ใช่แทนกัน",
  },
  {
    q: "ต้องเตรียม Sales Material อะไร",
    a: "อย่างน้อยต้องมีข้อมูลห้องและสินค้า ราคาและช่วงขาย เงื่อนไขที่โรงแรมอนุมัติ และชุดขายที่พาร์ตเนอร์ส่งต่อได้ หากข้อมูลกระจัดกระจาย ทีมช่วยจัดเป็น B2B Sales Kit ก่อนประสานงาน",
  },
  {
    q: "ใครเป็นผู้อนุมัติ Rate และ Contract",
    a: "โรงแรมเป็นผู้อนุมัติราคาสุดท้าย ค่าคอมมิชชัน เงื่อนไขสัญญา และเป็นผู้ลงนาม เดอะ เคพีไอ พลัส อาจช่วยทบทวนและประสานงาน แต่ไม่ได้เซ็นสัญญาแทนโรงแรม",
  },
  {
    q: "ใช้เวลานานเท่าไรจึงเริ่มติดต่อ Partner",
    a: "ยังไม่มีระยะเวลาตายตัวที่อนุมัติให้สื่อสาร เริ่มติดต่อได้เมื่อโรงแรมมี Partner Profile กรอบราคา และ Sales Material พร้อม และอนุมัติให้ประสานงาน หากยังไม่พร้อม ทีมทบทวนความพร้อมก่อน ไม่เริ่มหาพาร์ตเนอร์ทันที",
  },
  {
    q: "วัดผล Partner ด้วย KPI อะไร",
    a: "วัดจากงานจริง ไม่ใช่จำนวนสัญญาอย่างเดียว เมื่อโรงแรมมีข้อมูล ทีมดู Qualified Partner, Active Partner, Room Nights from B2B และ Revenue by Partner ตัวเลขแปลงผลหรือผลรับประกันจะไม่แสดงหากยังไม่อนุมัติ",
  },
  {
    q: "มีรายงาน Booking และ Revenue หรือไม่",
    a: "มีการทบทวนยอดจองและรายได้ของพาร์ตเนอร์ที่อยู่ในขอบเขตงาน เมื่อโรงแรมมีข้อมูลเพียงพอ ไม่ใช่แดชบอร์ดสำเร็จรูปของทุกโรงแรม และไม่ใช่ตัวเลขรับประกันผล",
  },
];

const b2bFaqsEn: FaqItem[] = [
  {
    q: "Which hotels is B2B Agent Sales for?",
    a: "It is especially suited to mid-size and larger hotels with enough rooms and team capacity to sell through partners. A smaller hotel can still talk this through, but another channel may be a better start. The team recommends B2B from the hotel’s situation, not for every property.",
  },
  {
    q: "Does The KPI Plus find every partner?",
    a: "No. This is not a promise to cover every market or to deliver a full partner list. The team helps choose and introduce relevant partners from the network, after reviewing whether the channel fits. The hotel decides on cooperation.",
  },
  {
    q: "Does the hotel need a rate plan and commission first?",
    a: "A B2B rate plan and a commission frame the hotel can accept should exist before outreach. If they are incomplete, the team can review the structure and terms, but no offer goes out until the hotel approves.",
  },
  {
    q: "Can you look after agents the hotel already has?",
    a: "Yes. The work is not limited to finding new agents. The team can review existing partners, including rates, terms, follow-up, and results against other channels.",
  },
  {
    q: "How is this different from listing on an OTA?",
    a: "An OTA is a public listing on a platform’s terms. B2B is selling through selected partners, with a rate plan, commission, contract, and follow-up per partner. It is not another OTA listing, and it should be reviewed with direct booking, not as a replacement for it.",
  },
  {
    q: "What sales material does the hotel need to prepare?",
    a: "At minimum: room and product facts, rates and selling dates, hotel-approved terms, and a pack the partner can share. If those sit in different places, the team helps gather them into a B2B Sales Kit before outreach.",
  },
  {
    q: "Who approves the rate and the contract?",
    a: "The hotel approves the final rate, commission, and contract terms, and signs its own agreement. The KPI Plus may review and coordinate. It does not sign the contract for the hotel.",
  },
  {
    q: "How long before partner outreach starts?",
    a: "There is no approved timeline to quote. Outreach starts after the hotel has a Partner Profile, a rate frame, and sales material, and has approved contact. If those are not ready, the team reviews readiness first and does not start outreach immediately.",
  },
  {
    q: "Which KPIs are used to review a partner?",
    a: "Measurement follows the work, not contract count alone. When the hotel has the data, the team looks at Qualified Partner, Active Partner, Room Nights from B2B, and Revenue by Partner. Conversion rates and guaranteed results are not published unless approved.",
  },
  {
    q: "Is there a booking and revenue report?",
    a: "Booking and revenue for the partners in scope are reviewed when the hotel has enough data. That is not a ready-made dashboard for every hotel, and it is not a guaranteed result.",
  },
];

const insightsIndexFaqsEn: FaqItem[] = [
  {
    q: "Which types of hotels are the articles for?",
    a: "Independent hotels, boutiques, and pool villas where the owner, GM, or hotel team wants to look at revenue, marketing, direct booking, and technology themselves. It does not have to be a large chain.",
  },
  {
    q: "If I want to talk to the team after reading, how should I start?",
    a: "Use Request a Hotel Performance Audit on this page. Send the hotel name, area, an approximate room count, and the issue you are seeing. You do not need a full report on day one. The team replies within 2 business days.",
  },
  {
    q: "Can the team help analyse the hotel’s data?",
    a: "Yes. The team starts from the information the hotel already has, then helps sequence the next useful move. The initial review has no fee. Scope is discussed later if you want the team to continue the work.",
  },
  {
    q: "Is there a report or checklist to download?",
    a: "There is no report or checklist to download from this page. Some articles include steps in the text to use directly. If you want the team to review the hotel’s data, send an analysis request.",
  },
  {
    q: "How can I follow new articles?",
    a: "New articles appear on this Insights page. Use Latest to see the newest first. There is no separate newsletter to subscribe to.",
  },
  {
    q: "Where does the article information come from?",
    a: "Articles are written by The KPI Plus editorial team from hotel revenue and commercial practice. They do not publish client numbers. If an article has sources, they appear at the end of that article.",
  },
];

const table: Record<string, FaqItem[]> = {
  "/": [
    {
      q: "เหมาะกับโรงแรมประเภทไหน?",
      a: "เหมาะกับโรงแรมอิสระ บูทีค และพูลวิลล่าที่เจ้าของหรือผู้บริหารอยากดูรายได้ ราคา และช่องทางขายเอง ไม่จำเป็นต้องเป็นเชนขนาดใหญ่",
    },
    {
      q: "ต้องใช้ข้อมูลอะไรในการเริ่มวิเคราะห์?",
      a: "เริ่มจากชื่อโรงแรม จังหวัด จำนวนห้องโดยประมาณ และเรื่องที่กังวลตอนนี้ เช่น Occupancy ราคา หรือ OTA ไม่ต้องส่งรายงานครบในวันแรก ทีมจะถามข้อมูลเพิ่มตอนคุย",
    },
    {
      q: "ใช้เวลานานแค่ไหนกว่าจะเห็นคำแนะนำ?",
      a: "ทีมติดต่อกลับภายใน 2 วันทำการ หลังคุยและดูข้อมูลที่มี จะสรุปประเด็นที่ควรโฟกัสก่อน ไม่ใช่รายงานยาวทันทีหลังส่งฟอร์ม",
    },
    {
      q: "ทำงานร่วมกับทีม Revenue เดิมอย่างไร?",
      a: "เราไม่ได้เข้าไปแทนที่ทีม Revenue ของโรงแรม ดูข้อมูลร่วมกัน แยกจุดที่รั่วกับโอกาส แล้วให้ทีมโรงแรมมีสิ่งที่ลงมือทำต่อได้",
    },
    {
      q: "ช่วยเรื่อง OTA และ Direct Booking ได้อย่างไร?",
      a: "ดูสัดส่วนจองจาก OTA กับจองตรง ค่าคอมมิชชัน และราคาในแต่ละช่องทาง แล้วช่วยดูว่าควรปรับตรงไหนก่อน เพื่อไม่ให้พึ่งช่องทางเดียวมากเกินไป",
    },
    {
      q: "มีค่าใช้จ่ายในการวิเคราะห์เบื้องต้นหรือไม่?",
      a: "การวิเคราะห์เบื้องต้นไม่มีค่าใช้จ่าย ส่งข้อมูลผ่านฟอร์มได้เลย หากโรงแรมต้องการให้ทีมเข้าไปทำงานต่อ ค่อยคุยขอบเขตและค่าใช้จ่ายในขั้นตอนนั้น",
    },
    {
      q: "ข้อมูลโรงแรมจะถูกเก็บเป็นความลับหรือไม่?",
      a: "ใช่ ข้อมูลที่ใช้ติดต่อและวิเคราะห์เบื้องต้นเก็บเป็นความลับ ใช้เพื่อติดต่อกลับเรื่องคำขอนี้ตามนโยบายความเป็นส่วนตัว ไม่เผยแพร่เป็นเคสโดยไม่ได้รับอนุญาต",
    },
    {
      q: "โรงแรมขนาดเล็กสามารถใช้บริการได้หรือไม่?",
      a: "ได้ โรงแรมอิสระขนาดเล็กใช้บริการได้ ทีมดูจากสถานการณ์รายได้และช่องทางขายที่มีอยู่ ไม่ได้ตัดออกเพราะจำนวนห้องน้อย",
    },
  ],
  "/en": [
    {
      q: "Which types of hotels is this for?",
      a: "Independent hotels, boutiques, and pool villas where the owner or operator wants to look at revenue, pricing, and channels themselves. It does not have to be a large chain.",
    },
    {
      q: "What information do you need to start a review?",
      a: "Hotel name, area, an approximate room count, and what is worrying you now — such as occupancy, pricing, or OTAs. You do not need a full report on day one. The team will ask for more when you talk.",
    },
    {
      q: "How long before we see recommendations?",
      a: "The team replies within 2 business days. After a conversation and a look at the information you have, they summarise what to focus on first. It is not a long report the moment the form is sent.",
    },
    {
      q: "How do you work with our existing Revenue team?",
      a: "We do not replace the hotel’s Revenue team. We look at the numbers together, separate the leak from the opportunity, and leave the hotel team with something they can act on.",
    },
    {
      q: "How can you help with OTAs and direct bookings?",
      a: "We look at the mix of OTA and direct bookings, commission, and rates on each channel, then help decide what to adjust first so the hotel is not relying on one channel too heavily.",
    },
    {
      q: "Is there a fee for the initial review?",
      a: "There is no fee for the initial review. Send the form when you are ready. Cost is discussed later, if the hotel wants the team to continue the work.",
    },
    {
      q: "Is hotel information kept confidential?",
      a: "Yes. Contact and review details are kept confidential and used to follow up on this request, as described in the privacy policy. We do not publish a case without permission.",
    },
    {
      q: "Can a small hotel use this service?",
      a: "Yes. Small independent hotels can use this service. The team looks at the hotel’s revenue and channel situation, and does not rule a hotel out because it has fewer rooms.",
    },
  ],
  "/ru": [
    {
      q: "Чем The KPI Plus помогает отелям?",
      a: "The KPI Plus помогает отелям создавать спрос, усиливать дистрибуцию и связывать данные, технологии и ИИ с ценой, продажами и маркетингом, чтобы команда лучше решала, растила бронирования и измеряла результат.",
    },
    {
      q: "С чего начать, если доход или загрузка не достигают цели?",
      a: "Начните с причины, почему доход или бронирования не доходят до цели. Посмотрите цену, спрос, каналы и прямое бронирование в одной картине, затем выберите следующий шаг.",
    },
  ],
  "/zh": [
    {
      q: "The KPI Plus 能幫酒店做什麼？",
      a: "The KPI Plus 協助酒店創造需求、強化通路，並把資料、科技與 AI 接到價格、銷售與行銷，讓團隊更好決策、提升預訂，並衡量真正有效的事。",
    },
    {
      q: "如果收益或住房率沒達標，該從哪裡開始？",
      a: "先找出收益或預訂未達標的原因。把價格、需求、通路與直銷預訂看成同一張圖，再選擇下一步。",
    },
  ],
  "/about-us": [
    {
      q: "เหมาะกับโรงแรมประเภทไหน?",
      a: "เหมาะกับโรงแรมอิสระ บูทีค และที่พักที่ซับซ้อนกว่า ในประเทศไทย ที่เจ้าของ GM หรือทีม Commercial อยากดูรายได้ ราคา และช่องทางขายเอง ไม่จำเป็นต้องเป็นเชนขนาดใหญ่",
    },
    {
      q: "ต้องเตรียมข้อมูลอะไร?",
      a: "เริ่มจากชื่อโรงแรม จังหวัด จำนวนห้องโดยประมาณ และเรื่องที่กังวลตอนนี้ เช่น Occupancy ราคา หรือ OTA ไม่ต้องส่งรายงานครบในวันแรก ทีมจะถามข้อมูลเพิ่มตอนคุย",
    },
    {
      q: "ต้องเชื่อมต่อระบบหรือไม่?",
      a: "ไม่จำเป็นต้องเชื่อมต่อระบบก่อนเริ่มคุย ทีมดูข้อมูลและระบบที่โรงแรมมีอยู่แล้ว แล้วเสนอวิธีทำงานที่เหมาะกับขนาดและความพร้อม ไม่ต้องเปลี่ยน PMS หรือ RMS ก่อนทุกครั้ง",
    },
    {
      q: "ทำงานร่วมกับทีม Revenue เดิมอย่างไร?",
      a: "เราไม่ได้เข้าไปแทนที่ทีม Revenue ของโรงแรม ดูข้อมูลร่วมกัน แยกจุดที่รั่วกับโอกาส แล้วให้ทีมโรงแรมมีสิ่งที่ลงมือทำต่อได้",
    },
    {
      q: "ช่วยเรื่อง OTA และ Direct Booking อย่างไร?",
      a: "ดูสัดส่วนจองจาก OTA กับจองตรง ค่าคอมมิชชัน และราคาในแต่ละช่องทาง แล้วช่วยดูว่าควรปรับตรงไหนก่อน เพื่อไม่ให้พึ่งช่องทางเดียวมากเกินไป",
    },
    {
      q: "ใช้เวลานานแค่ไหนในการเริ่มต้น?",
      a: "ส่งข้อมูลผ่านฟอร์มได้เลย ใช้เวลาประมาณ 2 นาที ทีมติดต่อกลับภายใน 2 วันทำการ หลังคุยและดูข้อมูลที่มี จะสรุปประเด็นที่ควรโฟกัสก่อน ไม่ใช่เริ่มงานทั้งหมดในวันแรก",
    },
    {
      q: "ข้อมูลโรงแรมจะถูกเก็บเป็นความลับหรือไม่?",
      a: "ใช่ ข้อมูลที่ใช้ติดต่อและวิเคราะห์เบื้องต้นเก็บเป็นความลับ ใช้เพื่อติดต่อกลับเรื่องคำขอนี้ตามนโยบายความเป็นส่วนตัว ไม่เผยแพร่เป็นเคสโดยไม่ได้รับอนุญาต",
    },
    {
      q: "เริ่มต้นพูดคุยอย่างไร?",
      a: "กรอกแบบฟอร์มวิเคราะห์โรงแรม หรือคุยกับทีมทางอีเมล info@thekpiplus.com โทร +66 82 635 6266 LINE หรือ WhatsApp ไม่ต้องมีขอบเขตงานครบก่อนเริ่มคุย",
    },
  ],
  "/en/about-us": [
    {
      q: "Which types of hotels is this for?",
      a: "Independent hotels, boutiques, and more complex operations in Thailand, where the owner, GM, or commercial team wants to look at revenue, pricing, and channels themselves. It does not have to be a large chain.",
    },
    {
      q: "What information should we prepare?",
      a: "Start with the hotel name, province, an approximate room count, and what is worrying you now — such as occupancy, pricing, or OTAs. You do not need a full report on day one. The team will ask for more when you talk.",
    },
    {
      q: "Do we have to connect our systems first?",
      a: "No. The team looks at the data and systems the hotel already has, then proposes a way of working that fits the size and readiness of the hotel. You do not have to change the PMS or RMS before the first conversation.",
    },
    {
      q: "How do you work with our existing Revenue team?",
      a: "We do not replace the hotel’s Revenue team. We look at the numbers together, separate the leak from the opportunity, and leave the hotel team with something they can act on.",
    },
    {
      q: "How can you help with OTAs and direct bookings?",
      a: "We look at the mix of OTA and direct bookings, commission, and rates on each channel, then help decide what to adjust first so the hotel is not relying on one channel too heavily.",
    },
    {
      q: "How long does it take to get started?",
      a: "You can send the form now; it takes about two minutes. The team replies within two business days. After a conversation and a look at the information you have, they summarise what to focus on first. The full scope of work does not start on day one.",
    },
    {
      q: "Is hotel information kept confidential?",
      a: "Yes. Contact and review details are kept confidential and used to follow up on this request, as described in the privacy policy. We do not publish a case without permission.",
    },
    {
      q: "How do we start the conversation?",
      a: "Fill in the hotel performance form, or talk to the team by email at info@thekpiplus.com, phone +66 82 635 6266, LINE, or WhatsApp. You do not need a complete scope before the first conversation.",
    },
  ],
  "/ru/about-us": [
    {
      q: "Для каких отелей это подходит?",
      a: "Для независимых отелей, бутиков и более сложных операций в Таиланде, где владелец, GM или коммерческая команда сами смотрят доход, цены и каналы. Это не обязательно крупная сеть.",
    },
    {
      q: "Какие данные подготовить?",
      a: "Начните с названия отеля, провинции, примерного числа номеров и того, что беспокоит сейчас — occupancy, цена или OTA. Полный отчёт в первый день не нужен. Команда спросит больше во время разговора.",
    },
    {
      q: "Нужно ли сначала подключать системы?",
      a: "Нет. Команда смотрит данные и системы, которые у отеля уже есть, и предлагает способ работы по размеру и готовности. Менять PMS или RMS до первого разговора не обязательно.",
    },
    {
      q: "Как вы работаете с существующей Revenue-командой?",
      a: "Мы не заменяем Revenue-команду отеля. Смотрим цифры вместе, отделяем утечку от возможности и оставляем команде отеля то, что можно сделать дальше.",
    },
    {
      q: "Как вы помогаете с OTA и прямыми бронированиями?",
      a: "Смотрим долю OTA и прямых броней, комиссию и цены по каналам, затем помогаем решить, что править сначала, чтобы отель не зависел слишком сильно от одного канала.",
    },
    {
      q: "Сколько времени занимает старт?",
      a: "Форму можно отправить сейчас, это занимает около двух минут. Команда отвечает в течение двух рабочих дней. После разговора и просмотра имеющихся данных суммирует, на чём сфокусироваться сначала. Полный объём работы не начинается в первый день.",
    },
    {
      q: "Данные отеля конфиденциальны?",
      a: "Да. Контактные данные и материалы для разбора хранятся конфиденциально и используются, чтобы ответить на этот запрос, как описано в политике конфиденциальности. Мы не публикуем кейс без разрешения.",
    },
    {
      q: "Как начать разговор?",
      a: "Заполните форму анализа отеля или напишите команде на info@thekpiplus.com, позвоните +66 82 635 6266, LINE или WhatsApp. Полный объём работ до первого разговора не нужен.",
    },
  ],
  "/zh/about-us": [
    {
      q: "適合哪些類型的飯店？",
      a: "適合泰國的獨立飯店、精品旅館，以及較複雜的營運。業主、總經理或 Commercial 團隊若想自己看收益、價格與通路，不必是大型連鎖。",
    },
    {
      q: "該準備哪些資料？",
      a: "先從飯店名稱、府、大約房數，以及現在最擔心的事開始，例如 Occupancy、價格或 OTA。第一天不必交完整報告，團隊會在交談時再問需要的資料。",
    },
    {
      q: "一定要先串接系統嗎？",
      a: "不必。團隊會先看飯店既有的資料與系統，再提出適合規模與準備程度的做法。第一次交談前不必先換 PMS 或 RMS。",
    },
    {
      q: "如何與現有 Revenue 團隊合作？",
      a: "我們不會取代飯店的 Revenue 團隊。一起看數字、分開哪裡在流失、哪裡有機會，並留給飯店團隊能接著做的事。",
    },
    {
      q: "如何協助 OTA 與直銷預訂？",
      a: "看 OTA 與直銷預訂的比重、佣金，以及各通路價格，再一起判斷該先調哪裡，避免過度依賴單一通路。",
    },
    {
      q: "開始要花多久？",
      a: "現在就能送表單，大約兩分鐘。團隊會在 2 個工作天內回覆。交談並看過現有資料後，會先整理該聚焦的重點，不會第一天就展開全部工作。",
    },
    {
      q: "飯店資料會保密嗎？",
      a: "會。用來聯絡與初步分析的資料會保密，並依隱私權政策只用於回覆這次詢問。未經同意不會公開成案例。",
    },
    {
      q: "要怎麼開始談？",
      a: "填寫飯店績效表單，或用 info@thekpiplus.com、電話 +66 82 635 6266、LINE 或 WhatsApp 與團隊談。第一次交談前不必先備齊完整工作範圍。",
    },
  ],
  "/approach": [
    {
      q: "แนวทางการทำงานของ เดอะ เคพีไอ พลัส เริ่มอย่างไร?",
      a: "เริ่มจากอ่านสัญญาณ Booking Pace, Pickup, Forecast, Market Demand และ Channel Mix ในภาพเดียวกัน แล้วเลือกสิ่งที่ควรทำต่อ มีเจ้าของงานชัดเจน และวัด ADR Occupancy และรายได้สุทธิหลังหักค่าคอมมิชชัน",
    },
    {
      q: "แนวทางการทำงานของ The KPI Plus เหมาะกับโรงแรมแบบไหน?",
      a: "เหมาะกับโรงแรมอิสระ บูทีค และพูลวิลล่าที่เจ้าของ GM หรือทีม Revenue อยากดูราคา Occupancy และช่องทางขายจากข้อมูลชุดเดียวกัน ไม่จำเป็นต้องเป็นเชนขนาดใหญ่",
    },
    {
      q: "ต้องเตรียมข้อมูลอะไรเพื่อเริ่มวิเคราะห์?",
      a: "เริ่มจากชื่อโรงแรม จังหวัด จำนวนห้องโดยประมาณ และเรื่องที่กังวลตอนนี้ เช่น Occupancy ต่ำกว่าเป้า ราคา หรือสัดส่วน OTA หากมี Booking Pace Pickup หรือ Forecast ที่มีอยู่แล้ว นำมาคุยได้ ไม่ต้องส่งรายงานครบในวันแรก",
    },
    {
      q: "ต้องเชื่อม PMS, RMS หรือ Channel Manager หรือไม่?",
      a: "ไม่จำเป็นต้องเชื่อมระบบก่อนเริ่มคุย ทีมดูข้อมูลและระบบที่โรงแรมมีอยู่แล้ว แล้วเสนอวิธีที่เหมาะกับความพร้อม การเชื่อม PMS, Channel Manager, RMS และ Booking Engine เป็นขั้นตอนเมื่อต้องให้ราคาและ Inventory ตรงกันทุกช่องทาง ไม่ใช่เงื่อนไขวันแรก",
    },
    {
      q: "ใช้เวลานานแค่ไหนกว่าจะเห็น Action ที่ควรทำ?",
      a: "ทีมติดต่อกลับภายใน 2 วันทำการ หลังคุยและดูข้อมูลที่มี จะสรุปประเด็นที่ควรทำต่อและมีเจ้าของงานชัดเจน ไม่ใช่รายงานยาวทันทีหลังส่งฟอร์ม",
    },
    {
      q: "ทำงานร่วมกับทีม Revenue เดิมอย่างไร?",
      a: "เราไม่ได้เข้าไปแทนที่ทีม Revenue ของโรงแรม ดูข้อมูลร่วมกัน แยกจุดที่รั่วกับโอกาส แล้วให้ทีมโรงแรมมีสิ่งที่ลงมือทำต่อได้",
    },
    {
      q: "Occupancy ต่ำกว่าเป้า ต้องลดราคาทันทีหรือไม่?",
      a: "ไม่เสมอไป แทนที่จะลดราคาทุกช่องทางในทันที ควรหาต้นเหตุก่อน แล้ววางแผนที่เพิ่มยอดจองโดยยังรักษา ADR และรายได้สุทธิไว้ได้",
    },
    {
      q: "ถ้า Occupancy ต่ำกว่าเป้าควรเริ่มตรวจจากจุดใด?",
      a: "เริ่มจาก Booking Pace และ Pickup เทียบกับปีก่อนและ Budget แล้วดู Market Demand คู่แข่ง Channel Mix และ Rate Parity ก่อนตัดสินใจเรื่องราคา ช่องทาง หรือ Promotion",
    },
    {
      q: "มีค่าใช้จ่ายในการพูดคุยเบื้องต้นหรือไม่?",
      a: "การพูดคุยและวิเคราะห์เบื้องต้นไม่มีค่าใช้จ่าย ส่งข้อมูลผ่านฟอร์มได้เลย หากโรงแรมต้องการให้ทีมเข้าไปทำงานต่อ ค่อยคุยขอบเขตและค่าใช้จ่ายในขั้นตอนนั้น",
    },
  ],
  "/en/approach": [
    {
      q: "How does The KPI Plus approach start?",
      a: "By reading booking pace, pickup, forecast, market demand, and channel mix in one view, then choosing the next move with a clear owner and measuring ADR, occupancy, and net revenue after commission.",
    },
    {
      q: "Which hotels is The KPI Plus approach for?",
      a: "Independent hotels, boutiques, and pool villas where the owner, GM, or Revenue team wants to look at price, occupancy, and channels from the same data. It does not have to be a large chain.",
    },
    {
      q: "What information is needed to start the analysis?",
      a: "Hotel name, area, an approximate room count, and what is worrying you now — such as occupancy below target, pricing, or OTA mix. If you already have booking pace, pickup, or a forecast, bring that to the conversation. You do not need a full report on day one.",
    },
    {
      q: "Do we need to connect PMS, RMS, or a channel manager?",
      a: "No. You do not need to connect systems before the first conversation. The team looks at the data and systems the hotel already has. Connecting PMS, channel manager, RMS, and booking engine is a later step when rates and inventory need to stay consistent across channels.",
    },
    {
      q: "How long before we see the next actions?",
      a: "The team replies within 2 business days. After a conversation and a look at the information you have, they summarise what to do next and who should own it. It is not a long report the moment the form is sent.",
    },
    {
      q: "How do you work with our existing Revenue team?",
      a: "We do not replace the hotel’s Revenue team. We look at the numbers together, separate the leak from the opportunity, and leave the hotel team with something they can act on.",
    },
    {
      q: "If occupancy is below target, should the hotel cut rates immediately?",
      a: "Not always. Instead of cutting rates on every channel at once, find the cause first, then plan how to grow bookings while protecting ADR and net revenue.",
    },
    {
      q: "If occupancy is below target, where should we start checking?",
      a: "Start with booking pace and pickup against last year and budget, then review market demand, competitor rates, channel mix, and rate parity before deciding on price, channel, or promotion.",
    },
    {
      q: "Is there a fee for the initial conversation?",
      a: "There is no fee for the initial conversation and review. Send the form when you are ready. Cost is discussed later, if the hotel wants the team to continue the work.",
    },
  ],
  "/solutions": [
    {
      q: "โซลูชันของ เดอะ เคพีไอ พลัส ครอบคลุมอะไรบ้าง?",
      a: "ครอบคลุมรายได้ ช่องทางการขาย การตลาด การจองตรง และการบริหารโรงแรม จัดเป็นสามกลุ่ม: บริหารรายได้และการขาย การตลาดและการจองตรง และบริหารและพัฒนาโรงแรม",
    },
    {
      q: "ควรเลือกโซลูชันไหนก่อน?",
      a: "หากยังไม่แน่ใจ เดอะ เคพีไอ พลัส สามารถทบทวนสถานการณ์ธุรกิจก่อน แล้วแนะนำลำดับความสำคัญที่ควรเริ่ม",
    },
  ],
  "/en/solutions": [
    {
      q: "What do The KPI Plus solutions cover?",
      a: "Three groups: Grow Revenue, Grow Demand, and Strengthen Operations — including Independent Hotel Management, systems, AI, and team development.",
    },
    {
      q: "Which solution should a hotel start with?",
      a: "Start with the part of the hotel that needs the most attention: revenue and sales, marketing and direct bookings, or operations and hotel management.",
    },
  ],
  "/ru/solutions": [
    {
      q: "Какие решения предлагает The KPI Plus?",
      a: "Три группы: рост дохода, рост спроса и усиление операций — включая управление независимым отелем, системы, ИИ и развитие команды.",
    },
  ],
  "/zh/solutions": [
    {
      q: "The KPI Plus 的方案涵蓋什麼？",
      a: "三個群組：提升收益、提升需求、強化營運，包括獨立飯店管理、系統、AI 與團隊發展。",
    },
  ],
  "/insights": [
    {
      q: "บทความเหมาะกับโรงแรมประเภทใด",
      a: "เหมาะกับโรงแรมอิสระ บูทีค และพูลวิลล่า ที่เจ้าของ ผู้จัดการทั่วไป หรือทีมงานอยากดูรายได้ การตลาด การจองตรง และเทคโนโลยีเอง ไม่จำเป็นต้องเป็นเชนขนาดใหญ่",
    },
    {
      q: "ถ้าต้องการคุยกับทีมหลังอ่านบทความควรเริ่มอย่างไร",
      a: "กดปุ่มขอวิเคราะห์โรงแรมบนหน้านี้ ส่งชื่อโรงแรม จังหวัด จำนวนห้องโดยประมาณ และประเด็นที่กำลังเจอ ไม่ต้องแนบรายงานครบในครั้งแรก ทีมติดต่อกลับภายใน 2 วันทำการ",
    },
    {
      q: "ขอให้ทีมช่วยวิเคราะห์ข้อมูลของโรงแรมได้หรือไม่",
      a: "ได้ ทีมดูจากข้อมูลที่โรงแรมมีอยู่แล้ว ช่วยจัดลำดับสิ่งที่ควรทำต่อ การวิเคราะห์เบื้องต้นไม่มีค่าใช้จ่าย หากต้องการให้ทีมทำงานต่อ ค่อยคุยขอบเขตในขั้นตอนนั้น",
    },
    {
      q: "มี Report หรือ Checklist ให้ดาวน์โหลดหรือไม่",
      a: "ขณะนี้ยังไม่มี Report หรือ Checklist ให้ดาวน์โหลดจากหน้านี้ บางบทความมีขั้นตอนในเนื้อหาให้นำไปใช้เอง หากต้องการให้ทีมดูข้อมูลโรงแรม ส่งคำขอวิเคราะห์ได้",
    },
    {
      q: "สามารถติดตามบทความใหม่ได้อย่างไร",
      a: "บทความใหม่ขึ้นบนหน้า Insights นี้ เลือกเรียงตามล่าสุดเพื่อดูชิ้นล่าสุดก่อน ไม่มีจดหมายข่าวให้สมัครแยก",
    },
    {
      q: "ข้อมูลในบทความอ้างอิงจากอะไร",
      a: "เรียบเรียงโดยทีมบรรณาธิการ The KPI Plus จากวิธีทำงานด้าน Revenue และ Commercial ของโรงแรม ไม่ได้ยกตัวเลขลูกค้ามาแสดง หากบทความนั้นมีแหล่งข้อมูล จะแสดงไว้ท้ายบทความ",
    },
  ],
  "/en/insights": insightsIndexFaqsEn,
  "/ru/insights": insightsIndexFaqsEn,
  "/zh/insights": insightsIndexFaqsEn,
  "/associations": [
    {
      q: "บริษัทในเครือข่ายนี้คือลูกค้าหรือคำรับรองหรือไม่?",
      a: "บริษัทข้างต้นเป็นเครือข่ายความร่วมมือ ไม่ใช่คำรับรองจากลูกค้า กรณีศึกษา บริษัทในเครือ หรือหลักฐานผลการดำเนินงาน",
    },
    {
      q: "เครือข่ายนี้ครอบคลุมอะไร?",
      a: "เราทำงานร่วมกับผู้เชี่ยวชาญด้านเทคโนโลยีโรงแรม การศึกษานานาชาติ และบริการท่องเที่ยว เพื่อเพิ่มทางเลือกให้ลูกค้าและพันธมิตร",
    },
  ],
  "/en/associations": [
    {
      q: "Are these companies client testimonials?",
      a: "These companies are an association network, not client testimonials, case studies, subsidiaries, or proof of hotel performance.",
    },
    {
      q: "What expertise does the network cover?",
      a: "Specialists in hotel technology, international education, and travel services, to give clients and partners more useful options.",
    },
  ],
  "/ru/associations": [
    {
      q: "Это отзывы клиентов?",
      a: "Эти компании — партнёрская сеть, а не отзывы клиентов, кейсы, дочерние компании или доказательство результатов отеля.",
    },
  ],
  "/zh/associations": [
    {
      q: "這些公司是客戶推薦嗎？",
      a: "上述公司是合作網絡，不是客戶推薦、案例研究、關係企業，也不是酒店績效證明。",
    },
  ],
  "/contact-us": [
    {
      q: "ต้องการสอบถามเรื่องอะไรได้บ้าง",
      a: "พูดคุยได้เรื่องรายได้โรงแรม OTA การจองตรง การมองเห็นบนออนไลน์ เทคโนโลยี และการทำงานด้าน Commercial ไม่จำเป็นต้องรู้บริการที่ต้องการตั้งแต่แรก บอกสถานการณ์ของโรงแรมมาก็พอให้ทีมช่วยดูจุดเริ่มต้นได้",
    },
    {
      q: "ต้องเตรียมข้อมูลอะไรก่อนพูดคุย",
      a: "ใช้ชื่อผู้ติดต่อ ชื่อโรงแรมหรือกิจการ และอีเมลหรือเบอร์โทร หากมีหัวข้อที่อยากคุยหรือข้อความสั้น ๆ จะช่วยให้ทีมเตรียมได้ ยังไม่ต้องมีรายงานครบก่อนเริ่มคุย",
    },
    {
      q: "ใช้เวลานานแค่ไหนกว่าจะได้รับการติดต่อกลับ",
      a: "ทีมงานจะตรวจสอบข้อมูลและติดต่อกลับโดยเร็วที่สุด ระยะเวลาขึ้นกับช่วงเวลาและรายละเอียดที่ส่งมา หน้านี้ไม่ได้กำหนดเวลารับประกันการตอบกลับ",
    },
    {
      q: "มีค่าใช้จ่ายในการพูดคุยเบื้องต้นหรือไม่",
      a: "การพูดคุยเบื้องต้นไม่มีค่าใช้จ่าย หากโรงแรมต้องการให้ทีมเข้าไปทำงานต่อ ค่อยคุยขอบเขตและค่าใช้จ่ายในขั้นตอนนั้น",
    },
    {
      q: "ติดต่อผ่าน WhatsApp ได้หรือไม่",
      a: "ได้ เมื่อมีลิงก์ WhatsApp บนหน้านี้ สามารถใช้ช่องทางนั้นติดต่อทีมได้โดยตรง นอกจากนั้นยังใช้อีเมล โทรศัพท์ หรือแบบฟอร์มในหน้านี้ได้",
    },
    {
      q: "ให้บริการโรงแรมในพื้นที่ใด",
      a: "สำนักงานอยู่ที่ภูเก็ต ทีมทำงานกับโรงแรมในประเทศไทย รายละเอียดขึ้นกับสถานการณ์ของโรงแรมแต่ละแห่ง",
    },
    {
      q: "ข้อมูลที่ส่งผ่าน Form จะถูกเก็บเป็นความลับหรือไม่",
      a: "ใช่ ข้อมูลที่ใช้ติดต่อเก็บเป็นความลับ ใช้เพื่อตอบคำถามและติดต่อกลับเรื่องที่สอบถาม ตามนโยบายความเป็นส่วนตัว ไม่เผยแพร่เป็นเคสโดยไม่ได้รับอนุญาต",
    },
    {
      q: "ถ้ายังไม่แน่ใจว่าควรเริ่มจากบริการไหน ทำอย่างไร?",
      a: "บอกเราเพียงว่าโรงแรมกำลังเจออะไร ทีม เดอะ เคพีไอ พลัส จะช่วยดูว่าควรเริ่มจากจุดไหนก่อน",
    },
    {
      q: "ติดต่อ เดอะ เคพีไอ พลัส ได้อย่างไร?",
      a: "โทร +66 82 635 6266 อีเมล info@thekpiplus.com หรือส่งแบบฟอร์มในหน้านี้ สำนักงานอยู่ที่ภูเก็ต",
    },
  ],
  "/en/contact-us": [
    {
      q: "What can I ask about?",
      a: "You can talk about hotel revenue, OTAs, direct booking, online presence, technology, and commercial work. You do not need to know the service you want first. A short note on what the hotel is facing is enough for the team to suggest a starting point.",
    },
    {
      q: "What should I prepare before we talk?",
      a: "A contact name, hotel or company name, and an email or phone number. A short note on the topic helps the team prepare. You do not need a full report before the first conversation.",
    },
    {
      q: "How long before someone gets back to me?",
      a: "The team reviews the details and gets back to you as soon as possible. Timing depends on when the request arrives and how much detail is included. This page does not promise a fixed reply time.",
    },
    {
      q: "Is there a fee for an initial conversation?",
      a: "An initial conversation has no fee. If the hotel wants the team to take on further work, scope and cost are discussed at that stage.",
    },
    {
      q: "Can I contact you on WhatsApp?",
      a: "Yes, when a WhatsApp link is shown on this page you can use it to reach the team. You can also use email, phone, or the form on this page.",
    },
    {
      q: "Which areas do you work with hotels in?",
      a: "The office is in Phuket. The team works with hotels in Thailand. The detail depends on each hotel’s situation.",
    },
    {
      q: "Is information sent through the form kept confidential?",
      a: "Yes. Contact details are kept confidential and used to reply about this request, under the privacy policy. A case is not published without permission.",
    },
    {
      q: "What if the hotel is not sure where to start?",
      a: "Tell us what the hotel is facing. The KPI Plus team will help identify the most useful place to begin.",
    },
    {
      q: "How can we contact The KPI Plus?",
      a: "Call +66 82 635 6266, email info@thekpiplus.com, or send the form on this page. The office is in Phuket.",
    },
  ],
  "/ru/contact-us": [
    {
      q: "Как связаться с The KPI Plus?",
      a: "Позвоните +66 82 635 6266, напишите info@thekpiplus.com или отправьте форму. Офис находится на Пхукете.",
    },
  ],
  "/zh/contact-us": [
    {
      q: "要怎麼聯絡 The KPI Plus？",
      a: "致電 +66 82 635 6266、寄信 info@thekpiplus.com，或送出表單。辦公室在普吉。",
    },
  ],
  "/case-studies": [
    {
      q: "Case Study เป็นข้อมูลจริงหรือข้อมูลตัวอย่าง",
      a: "ตัวเลขที่เผยแพร่มาจากผลการดำเนินงานของโรงแรมที่ได้รับอนุญาตให้ใช้ และมีช่วงเวลาที่ระบุในแต่ละเคส ไม่ใช่ตัวเลขสมมติ เคสบนหน้านี้เป็นผลงานแบบไม่ระบุชื่อ ใช้ประเภทที่พักและพื้นที่ ไม่เปิดชื่อโรงแรม หากเป็นข้อมูลตัวอย่าง จะติดป้ายว่า “ข้อมูลตัวอย่าง” ภาพปกและตัวอย่างรายงานที่ยังไม่ใช่ไฟล์ที่อนุมัติแล้วก็ติดป้ายว่าเป็นตัวอย่างเช่นกัน ตัวเลขที่ยังยืนยันช่วงเวลาหรือแหล่งข้อมูลไม่ได้ จะไม่แสดงต่อสาธารณะ",
    },
    {
      q: "เปิดเผยชื่อโรงแรมได้หรือไม่",
      a: "ได้เมื่อโรงแรมอนุมัติให้ใช้ชื่อ ก่อนหน้านั้นเคสจะแสดงแบบไม่ระบุชื่อ เช่น พูลวิลล่าพรีเมียมที่ลายัน หรือโรงแรมบูติกอิสระที่ป่าตอง ข้อมูลที่โรงแรมส่งมาเพื่อขอวิเคราะห์จะไม่ถูกเผยแพร่เป็น Case Study โดยไม่ได้รับอนุญาต",
    },
    {
      q: "วัดผลลัพธ์ในช่วงเวลาใด",
      a: "แต่ละเคสวัดคนละช่วง และระบุช่วงนั้นบนการ์ดกับหน้ารายละเอียด ตัวอย่างที่ใช้ตอนนี้ ได้แก่ หกเดือนแรกจากตุลาคม 2025, รายปี, กรกฎาคม 2026 และมิถุนายน 2026 เมื่อมีข้อมูลเปรียบเทียบ จะเทียบกับช่วงก่อนเริ่ม Action ช่วงเปรียบเทียบที่ยังไม่ยืนยันจะไม่แสดงต่อสาธารณะ",
    },
    {
      q: "ใช้ตัวชี้วัดอะไรในการประเมิน",
      a: "ใช้ตัวชี้วัดตามงานที่ทำ ไม่ใช้ชุดเดียวกันทุกโรงแรม งาน Revenue และ Distribution ดู Room Revenue, ADR, Occupancy และจำนวนห้องคืนที่ขาย งาน Digital Performance ดู ROAS, รายได้การจอง, งบโฆษณา และการจองตรง แต่ละตัวเลขบนหน้าสาธารณะมีชื่อ ค่า และช่วงเวลา หากหน่วยหรือนิยามยังไม่ยืนยัน จะไม่นำมาอ้างต่อสาธารณะ",
    },
    {
      q: "ผลลัพธ์ขึ้นอยู่กับปัจจัยใดบ้าง",
      a: "ผลลัพธ์ขึ้นอยู่กับช่วงเวลา ฤดูกาล ราคา ช่องทาง และข้อมูลที่โรงแรมมี รวมถึงลักษณะโรงแรม สภาวะตลาด ผลิตภัณฑ์ และการดำเนินงาน ตัวเลขที่แสดงเป็นผลของโรงแรมนั้นในช่วงที่ระบุ ไม่ได้รับประกันรายได้ Occupancy หรือผลลัพธ์ในอนาคต",
    },
    {
      q: "ขอให้ทีมช่วยวิเคราะห์ Performance ของโรงแรมได้หรือไม่",
      a: "ได้ กดขอวิเคราะห์โรงแรมบนหน้านี้ ทีมดูจากข้อมูลที่โรงแรมมีอยู่แล้ว เพื่อหาจุดรั่วไหลของรายได้ โอกาสด้าน Pricing และ Distribution และแนวทาง Action ที่นำไปใช้ต่อได้ การวิเคราะห์เบื้องต้นไม่มีค่าใช้จ่าย และไม่ได้รับประกันว่า Occupancy หรือรายได้จะเพิ่มขึ้น หากต้องการให้ทีมทำงานต่อ ค่อยคุยขอบเขตในขั้นตอนนั้น ทีมติดต่อกลับภายใน 2 วันทำการ",
    },
    {
      q: "ต้องเตรียมข้อมูลอะไรเพื่อเริ่มต้น",
      a: "เริ่มจากชื่อโรงแรม จังหวัด จำนวนห้องโดยประมาณ และเรื่องที่กังวลตอนนี้ เช่น Occupancy ราคา OTA หรือการจองตรง หากมี Booking Pace, Pickup, ADR, สัดส่วนช่องทาง หรือตัวเลขแคมเปญที่มีอยู่แล้ว นำมาคุยได้ ไม่ต้องส่งรายงานครบในวันแรก",
    },
    {
      q: "Case Study เผยแพร่เมื่อไหร่?",
      a: "เผยแพร่เมื่อโรงแรมอนุญาตให้ใช้ข้อมูลผลการดำเนินงาน และมีช่วงเวลาที่ระบุได้ บางเคสเปิดชื่อเมื่อได้รับอนุมัติ บางเคสเป็นแบบไม่ระบุชื่อ ตัวเลขที่ยังไม่ยืนยันจะไม่แสดงต่อสาธารณะ และภาพตัวอย่างจะติดป้ายว่าเป็นตัวอย่าง",
    },
    {
      q: "ตัวเลขบนหน้านี้รับประกันผลลัพธ์ในอนาคตหรือไม่?",
      a: "ไม่รับประกัน ผลลัพธ์ขึ้นกับโรงแรม สภาวะตลาด ผลิตภัณฑ์ ราคา Distribution และการดำเนินงาน ตัวเลขที่แสดงเป็นผลในช่วงเวลาที่ระบุของแต่ละโรงแรม",
    },
  ],
  "/en/case-studies": caseStudiesFaqsEn,
  "/ru/case-studies": caseStudiesFaqsEn,
  "/zh/case-studies": caseStudiesFaqsEn,
  "/privacy": [
    {
      q: "The KPI Plus เก็บข้อมูลส่วนบุคคลอะไรบ้าง?",
      a: "ข้อมูลที่คุณกรอกในแบบฟอร์ม เช่น ชื่อ โรงแรม อีเมล เบอร์โทร และข้อความ รวมถึงข้อมูลการใช้งานเว็บไซต์เมื่อคุณอนุญาตคุกกี้เพื่อการวิเคราะห์",
    },
    {
      q: "ใช้ข้อมูลนั้นทำอะไร?",
      a: "เพื่อตอบคำถาม ติดต่อกลับ ดำเนินงาน CRM ของทีม และปรับปรุงเว็บไซต์เมื่อคุณอนุญาตการวิเคราะห์ คุณขอเข้าถึง แก้ไข หรือลบข้อมูลได้ที่ info@thekpiplus.com",
    },
  ],
  "/en/privacy": [
    {
      q: "What personal information does The KPI Plus collect?",
      a: "Details you submit in forms, such as name, hotel, email, phone and message, plus limited website usage data if you allow analytics cookies.",
    },
    {
      q: "Why is that information used?",
      a: "To respond to enquiries, operate the team CRM, and improve the website when you allow analytics. You can ask to access, correct or delete your data at info@thekpiplus.com.",
    },
  ],
  "/cookies": [
    {
      q: "เว็บไซต์นี้ใช้คุกกี้อย่างไร?",
      a: "ใช้คุกกี้ที่จำเป็นให้เว็บไซต์ทำงาน และใช้ Google Analytics เมื่อคุณอนุญาตเท่านั้น เปลี่ยนได้ที่ “ตั้งค่าคุกกี้” ด้านล่างของทุกหน้า",
    },
  ],
  "/en/cookies": [
    {
      q: "Does this website use cookies?",
      a: "Necessary cookies keep the site working. Google Analytics runs only if you allow it. Change your choice under Cookie settings at the bottom of every page.",
    },
  ],
  "/tools": [
    {
      q: "เครื่องมือบนหน้านี้คิดค่าใช้จ่ายหรือไม่?",
      a: "ใช้งานฟรี ไม่ต้องลงทะเบียน ใช้เป็นจุดเริ่มต้นในการทบทวนตัวเลขโรงแรม",
    },
    {
      q: "ผลลัพธ์จากเครื่องคำนวณคือคำแนะนำทางบัญชีหรือไม่?",
      a: "ไม่ใช่ ผลลัพธ์เป็นการคำนวณเบื้องต้นจากข้อมูลที่คุณกรอก โรงแรมอาจต้องใช้ข้อมูลการดำเนินงานเพิ่มเติมสำหรับการวิเคราะห์อย่างละเอียด",
    },
  ],
  "/tools/revpar-calculator": [
    {
      q: "เครื่องนี้คำนวณอะไรได้บ้าง?",
      a: "คำนวณ RevPAR จาก ADR และ Occupancy, ADR จาก RevPAR และ Occupancy หรือ Occupancy จาก RevPAR และ ADR",
    },
    {
      q: "สูตร RevPAR คืออะไร?",
      a: "RevPAR = ADR × Occupancy ใช้ดูผลประกอบการห้องพักรายวันจากข้อมูลอีกสองตัวแปร",
    },
  ],
  "/tools/ota-commission-calculator": [
    {
      q: "เครื่องนี้ช่วยดูอะไร?",
      a: "ดูว่ารายได้ OTA เหลือเท่าไรหลังหัก Commission และต้นทุนนี้คิดเป็นเงินเท่าไร รายเดือนหรือรายปี",
    },
    {
      q: "ถ้า Direct Booking เพิ่มขึ้นจะเห็นผลอย่างไร?",
      a: "สัดส่วนช่องทางและต้นทุนต่อการจองจะเปลี่ยน เครื่องนี้ช่วยให้เห็นต้นทุน Commission ก่อนไปทบทวน Channel Mix",
    },
  ],
  "/tools/hotel-budget-calculator": [
    {
      q: "วาง Budget รายได้ห้องพักอย่างไร?",
      a: "ตั้งงบจากจำนวนห้อง วันเปิดขาย เป้าหมาย Occupancy และ ADR เพื่อประมาณห้องคืนที่มีขาย ห้องที่ขายได้ รายได้ห้องพัก และ RevPAR",
    },
  ],
  "/tools/hotel-profit-calculator": [
    {
      q: "เครื่องคำนวณกำไรใช้ข้อมูลอะไร?",
      a: "จำนวนห้อง วันเปิดดำเนินการ Occupancy ADR สัดส่วน OTA Commission ต้นทุนต่อห้อง เงินเดือน ค่าใช้จ่ายส่วนกลาง และระบบโรงแรม เพื่อประมาณรายได้ ต้นทุน และ GOP",
    },
  ],
  "/tools/hotel-vat-service-charge-calculator": [
    {
      q: "ราคาที่ลูกค้าจ่าย แบ่งเป็น Room Rate, Service Charge และ VAT อย่างไร?",
      a: "เครื่องนี้แยกราคาขายเป็นยอดก่อนภาษี Service Charge VAT และยอดรวม ผลลัพธ์เป็นการแยกราคาเพื่อการใช้งานเบื้องต้น ไม่ใช่คำแนะนำด้านบัญชีหรือภาษี",
    },
    {
      q: "ปรับอัตรา VAT หรือ Service Charge ได้หรือไม่?",
      a: "ปรับได้ทันทีตามข้อกำหนดทางธุรกิจหรือภาษีที่เปลี่ยนไป ผลลัพธ์จะเปลี่ยนตามโดยไม่ต้องรีเฟรชหน้า",
    },
  ],
  "/tools/hotel-searchability-check": [
    {
      q: "เครื่องมือนี้ตรวจอะไร?",
      a: "ตรวจว่าเว็บไซต์โรงแรมพร้อมแค่ไหนสำหรับ Google, AI Search และผู้ใช้งานบนมือถือ",
    },
  ],
  "/tools/hotel-review-link": [
    {
      q: "ลูกค้าต้องมีบัญชี Google หรือไม่?",
      a: "ต้องมีบัญชี Google จึงจะโพสต์รีวิวได้ เครื่องมือนี้สร้างเฉพาะลิงก์ไปหน้าเขียนรีวิวของธุรกิจนั้น",
    },
    {
      q: "ใช้กับโรงแรม สปา หรือร้านอาหารได้หรือไม่?",
      a: "ใช้ได้กับธุรกิจที่มีหน้าร้านบน Google ในไทย ถ้าชื่อซ้ำกัน ให้เลือกจากที่อยู่ที่ขึ้นมา",
    },
    {
      q: "เครื่องมือนี้การันตีรีวิวดีๆ หรือไม่?",
      a: "ไม่ การันตีไม่ได้ทั้งจำนวนรีวิวและรีวิวเชิงบวก ใช้เพื่อให้ลูกค้าเปิดหน้าเขียนรีวิวของธุรกิจนั้นได้ตรงจุด",
    },
  ],
  "/solutions/independent-hotel-management": independentHotelFaqs("th"),
  "/en/solutions/independent-hotel-management": independentHotelFaqs("en"),
  "/ru/solutions/independent-hotel-management": independentHotelFaqs("en"),
  "/zh/solutions/independent-hotel-management": independentHotelFaqs("en"),
  "/solutions/revenue-commercial-management": [
    {
      q: "Revenue Management กับ Commercial Management ต่างกันอย่างไร?",
      a: "Revenue Management เน้นการตัดสินใจเรื่องราคา ความต้องการของตลาด ห้องว่าง และรายได้ห้องพัก Commercial Management มองกว้างขึ้นถึงช่องทางขาย การจองตรง การตลาด ระบบ และวิธีที่ทีมทำงานร่วมกันเพื่อสร้างรายได้",
    },
    {
      q: "ต้องให้ The KPI Plus ดูแลทุกส่วนไหม?",
      a: "ไม่จำเป็น โรงแรมเลือกเริ่มเฉพาะส่วนที่ต้องการได้ แล้วขยายขอบเขตเมื่อมีส่วนอื่นที่ควรทำร่วมกัน",
    },
    {
      q: "ต้องมี Revenue Manager หรือ RMS ก่อนหรือไม่?",
      a: "ไม่ต้องมีก่อนเริ่ม ทีมดูจากข้อมูลและระบบที่โรงแรมมีอยู่ แล้วเสนอวิธีทำงานที่เหมาะกับขนาดและความพร้อม ไม่ได้บังคับให้ซื้อ RMS ก่อนคุย",
    },
    {
      q: "ทีมโรงแรมต้องร่วมทำอะไรบ้าง?",
      a: "ช่วยยืนยันห้องพัก ราคา ข้อเสนอ สถานการณ์หน้างาน และการตัดสินใจที่กระทบการดำเนินงาน จากนั้นทำงานตามหน้าที่ที่ตกลง ไม่ได้ส่งมอบงานแล้วปล่อยให้ทีมภายนอกตัดสินใจแทนทั้งหมด",
    },
    {
      q: "ต้องเริ่มจากข้อมูลอะไร?",
      a: "เริ่มจากชื่อโรงแรม จำนวนห้องโดยประมาณ และเรื่องที่อยากให้ดู เช่น ราคา ช่องทางขาย หรือการจองตรง หากมี Occupancy, booking pace หรือสัดส่วนช่องทางอยู่แล้ว ส่งเท่าที่สะดวกแชร์ได้ ไม่ต้องรอรายงานครบก่อนคุย",
    },
    {
      q: "รองรับโรงแรมขนาดเล็กหรือไม่?",
      a: "รองรับ โรงแรมอิสระขนาดเล็กใช้บริการได้ ขอบเขตงานปรับตามขนาด ความพร้อม และข้อมูลที่มี ไม่ได้ตัดออกเพราะจำนวนห้องน้อย",
    },
    {
      q: "ใช้เวลากี่สัปดาห์จึงจะเริ่มเห็น Action?",
      a: "หลังได้รับข้อมูลที่โรงแรมสะดวกแชร์ ทีมจะสรุปสิ่งที่ควรทำต่อและผู้รับผิดชอบ ระยะเวลาขึ้นกับข้อมูลที่เข้าถึงได้และขอบเขตที่ตกลงกัน ไม่ใช่การรับประกันว่ารายได้หรือ Occupancy จะเปลี่ยนในจำนวนสัปดาห์ที่กำหนด",
    },
    {
      q: "ข้อมูลจาก PMS และ OTA เชื่อมอย่างไร?",
      a: "ใช้รายงานและการเข้าถึงที่โรงแรมอนุญาต จาก PMS, Channel Manager หรือ OTA ที่ใช้อยู่ ไม่จำเป็นต้องเปลี่ยนระบบก่อนเริ่ม วิธีจัดข้อมูลให้อยู่ในมุมมองเดียวจะตกลงตามระบบที่มีจริง",
    },
    {
      q: "มีการติดตามผลหลังเริ่มงานหรือไม่?",
      a: "มี ตามจังหวะที่ตกลง เช่น ทบทวน Occupancy, booking pace และงานที่ทำไปแล้ว แล้วปรับขั้นตอนถัดไปจากสถานการณ์จริง การติดตามเป็นการทบทวนงาน ไม่ใช่การรับประกันผลลัพธ์",
    },
  ],
  "/en/solutions/revenue-commercial-management": [
    {
      q: "How is Revenue Management different from Commercial Management?",
      a: "Revenue Management focuses on rate, demand, rooms, and room revenue. Commercial Management looks wider: channels, direct booking, marketing, systems, and how the team works together to create revenue.",
    },
    {
      q: "Does The KPI Plus have to look after every part?",
      a: "No. The hotel can start with the parts it needs, then widen the scope when another part should sit with that work.",
    },
    {
      q: "Do we need a Revenue Manager or an RMS first?",
      a: "No. The team starts from the data and systems the hotel already has, then proposes a way of working that fits the size and readiness of the hotel. An RMS is not required before the first conversation.",
    },
    {
      q: "What does the hotel team have to do?",
      a: "Help confirm rooms, rates, offers, the situation on the floor, and decisions that affect operations, then work on the roles that were agreed. The hotel team is not asked to hand every decision to an outside team.",
    },
    {
      q: "What information do we start with?",
      a: "Start with the hotel name, an approximate room count, and the issue to look at, such as rate, channels, or direct booking. If occupancy, booking pace, or channel mix is already available, share what you can. A complete report is not required before the first conversation.",
    },
    {
      q: "Do you work with small hotels?",
      a: "Yes. Independent small hotels can use the service. Scope follows the hotel’s size, readiness, and the data available. A low room count does not rule a hotel out.",
    },
    {
      q: "How many weeks before we start seeing Action?",
      a: "After the hotel shares the information it is comfortable sharing, the team names the next actions and who owns them. Timing depends on data access and the agreed scope. It is not a promise that revenue or occupancy will change in a set number of weeks.",
    },
    {
      q: "How do PMS and OTA data connect?",
      a: "From the reports and access the hotel allows, using the PMS, channel manager, or OTAs already in place. The hotel does not have to change systems first. How that data sits in one view is agreed from the systems that exist.",
    },
    {
      q: "Do you review results after work starts?",
      a: "Yes, on the rhythm that was agreed, such as occupancy, booking pace, and the work already done, then the next step is adjusted from the real situation. That review is not a guarantee of a result.",
    },
  ],
  "/ru/solutions/revenue-commercial-management": [
    {
      q: "Чем Revenue Management отличается от Commercial Management?",
      a: "Revenue Management сосредоточен на цене, спросе, номерах и доходе с номеров. Commercial Management смотрит шире: каналы, прямое бронирование, маркетинг, системы и то, как команда вместе создаёт доход.",
    },
    {
      q: "Должен ли The KPI Plus вести все части сразу?",
      a: "Нет. Отель может начать с нужной работы и расширить границы, когда другую часть стоит вести вместе.",
    },
    {
      q: "Нужен ли сначала Revenue Manager или RMS?",
      a: "Нет. Команда смотрит данные и системы, которые у отеля уже есть, и предлагает способ работы по размеру и готовности отеля.",
    },
    {
      q: "Что должна делать команда отеля?",
      a: "Подтверждать данные по номерам, цене, предложению, ситуацию на месте и решения, которые влияют на работу, затем работать с The KPI Plus по согласованным ролям.",
    },
  ],
  "/zh/solutions/revenue-commercial-management": [
    {
      q: "Revenue Management 和 Commercial Management 差在哪裡？",
      a: "Revenue Management 著重價格、市場需求、空房與客房收益。Commercial Management 看得更廣：銷售通路、直銷預訂、行銷、系統，以及團隊如何一起創造收益。",
    },
    {
      q: "一定要讓 The KPI Plus 照顧每一部分嗎？",
      a: "不必。飯店可以先從需要的工作開始，等看到有其他部分該一起做時，再擴大範圍。",
    },
    {
      q: "一定要先有 Revenue Manager 或 RMS 嗎？",
      a: "不必。團隊會先看飯店既有的資料與系統，再提出適合規模與準備程度的做法。",
    },
    {
      q: "飯店團隊需要一起做什麼？",
      a: "協助確認客房、價格、方案、現場情況，以及會影響營運的決定，再依談好的職責與 The KPI Plus 一起做。",
    },
  ],
  "/solutions/outsourced-hotel-reservations": reservationsFaqsTh,
  "/en/solutions/outsourced-hotel-reservations": reservationsFaqsEn,
  "/ru/solutions/outsourced-hotel-reservations": reservationsFaqsEn,
  "/zh/solutions/outsourced-hotel-reservations": reservationsFaqsEn,
  "/solutions/b2b-agent-sales": b2bFaqsTh,
  "/en/solutions/b2b-agent-sales": b2bFaqsEn,
  "/ru/solutions/b2b-agent-sales": b2bFaqsEn,
  "/zh/solutions/b2b-agent-sales": b2bFaqsEn,
  "/solutions/google-ads-management": adsFaqs("th"),
  "/en/solutions/google-ads-management": adsFaqs("en"),
  "/ru/solutions/google-ads-management": adsFaqs("en"),
  "/zh/solutions/google-ads-management": adsFaqs("en"),
  "/solutions/meta-ads-management": metaFaqs("th"),
  "/en/solutions/meta-ads-management": metaFaqs("en"),
  "/ru/solutions/meta-ads-management": metaFaqs("en"),
  "/zh/solutions/meta-ads-management": metaFaqs("en"),
  "/solutions/hotel-seo-google-maps-ai-search": hotelSeoFaqs("th"),
  "/en/solutions/hotel-seo-google-maps-ai-search": hotelSeoFaqs("en"),
  "/ru/solutions/hotel-seo-google-maps-ai-search": hotelSeoFaqs("en"),
  "/zh/solutions/hotel-seo-google-maps-ai-search": hotelSeoFaqs("en"),
  "/solutions/hotel-website-design": hotelWebsiteFaqs("th"),
  "/en/solutions/hotel-website-design": hotelWebsiteFaqs("en"),
  "/ru/solutions/hotel-website-design": hotelWebsiteFaqs("en"),
  "/zh/solutions/hotel-website-design": hotelWebsiteFaqs("en"),
  "/solutions/hotel-direct-bookings": hotelDirectBookingFaqs("th"),
  "/en/solutions/hotel-direct-bookings": hotelDirectBookingFaqs("en"),
  "/ru/solutions/hotel-direct-bookings": hotelDirectBookingFaqs("en"),
  "/zh/solutions/hotel-direct-bookings": hotelDirectBookingFaqs("en"),
  "/solutions/hotel-systems-implementation": [
    {
      q: "จำเป็นต้องเปลี่ยน PMS เดิมไหม?",
      a: "ไม่จำเป็นเสมอไป เราจะตรวจการตั้งค่า การเชื่อมต่อ และวิธีใช้งานก่อน หากพบข้อจำกัดของระบบจึงค่อยพิจารณาทางเลือก",
    },
    {
      q: "ช่วยแก้ OTA Mapping และโครงสร้างราคาได้ไหม?",
      a: "ได้ตามความสามารถของระบบและสิทธิ์ที่โรงแรมมี ทีมจะตรวจความสัมพันธ์ของประเภทห้อง Rate Plan ราคา และช่องทางขาย พร้อมทดสอบผลหลังปรับ",
    },
    {
      q: "โรงแรมก่อนเปิดใช้บริการได้ไหม?",
      a: "ได้ การวางโครงสร้างห้อง ราคา ช่องทางขาย และขั้นตอนทีมก่อนเปิด ช่วยให้โรงแรมมีเวลาทดสอบก่อนรับการจองจริง",
    },
    {
      q: "มีอบรมทีมหลังตั้งค่าหรือไม่?",
      a: "มีได้ตามขอบเขตงาน โดยเน้นงานที่แต่ละตำแหน่งต้องทำจริง วิธีตรวจความถูกต้อง และขั้นตอนเมื่อข้อมูลหรือการเชื่อมต่อมีปัญหา",
    },
  ],
  "/en/solutions/hotel-systems-implementation": [
    {
      q: "Do we have to change the current PMS?",
      a: "Not always. We first review the settings, the connections, and how the team uses the systems. If a system limit appears, we then look at options.",
    },
    {
      q: "Can you fix OTA mapping and the rate structure?",
      a: "Yes, within the capability of the systems and the access the hotel has. The team reviews how room types, rate plans, rates, and channels relate, then tests the result after a change.",
    },
    {
      q: "Can a hotel use this before opening?",
      a: "Yes. Setting room structure, rates, sales channels, and team steps before opening gives the hotel time to test before real bookings arrive.",
    },
    {
      q: "Is there team training after setup?",
      a: "Yes, within the agreed scope. It focuses on the work each role actually does, how to check that facts are correct, and what to do when data or a connection breaks.",
    },
  ],
  "/ru/solutions/hotel-systems-implementation": [
    {
      q: "Нужно ли менять текущий PMS?",
      a: "Не всегда. Сначала смотрим настройки, связи и как команда пользуется системами. Если видно ограничение системы, тогда рассматриваем варианты.",
    },
    {
      q: "Можно ли поправить OTA mapping и структуру цен?",
      a: "Да, в рамках возможностей систем и доступа отеля. Команда проверяет связь типов номеров, rate plan, цен и каналов продаж, затем тестирует результат после правки.",
    },
    {
      q: "Можно ли пользоваться услугой до открытия отеля?",
      a: "Да. Задать структуру номеров, цены, каналы продаж и шаги команды до открытия даёт время протестировать до реальных броней.",
    },
    {
      q: "Есть ли обучение команды после настройки?",
      a: "Есть, в согласованном объёме. Фокус на работе, которую каждая роль реально делает, как проверять данные и что делать, если данные или связь сломались.",
    },
  ],
  "/zh/solutions/hotel-systems-implementation": [
    {
      q: "一定要換現有的 PMS 嗎？",
      a: "不一定。我們會先檢查設定、串接與使用方式。若發現系統限制，再考慮其他選項。",
    },
    {
      q: "可以幫忙處理 OTA Mapping 和價格結構嗎？",
      a: "可以，依系統能力與飯店擁有的權限。團隊會檢查房型、Rate Plan、價格與銷售通路的關係，並在調整後測試結果。",
    },
    {
      q: "開幕前的飯店可以用這項服務嗎？",
      a: "可以。開幕前先把客房結構、價格、銷售通路與團隊步驟準備好，飯店才有時間在真正收訂前測試。",
    },
    {
      q: "設定之後有團隊培訓嗎？",
      a: "有，依談好的範圍。重點是各職位實際要做的工作、如何檢查資料正確，以及資料或串接出問題時該怎麼做。",
    },
  ],
  "/solutions/hotel-ai-automation": [
    {
      q: "The KPI Plus ช่วยติดตั้งและทำ Automation ให้ด้วยหรือไม่?",
      a: "ได้ เราสามารถช่วยตั้งแต่สำรวจงาน ออกแบบ Workflow ตั้งค่าและเชื่อมเครื่องมือที่รองรับ ทดลองใช้ อบรมทีม และทบทวนผล โดยกำหนดขอบเขตงานตามระบบที่องค์กรมี",
    },
    {
      q: "จำเป็นต้องเปลี่ยน PMS หรือระบบเดิมก่อนหรือไม่?",
      a: "ไม่จำเป็นเสมอไป เราจะตรวจว่าระบบเดิมส่งออกข้อมูลหรือเชื่อมต่อด้วยวิธีใดได้บ้าง แล้วจึงเสนอแนวทางที่เหมาะกับข้อจำกัดนั้น",
    },
    {
      q: "AI จะตอบลูกค้าแทนพนักงานทั้งหมดหรือไม่?",
      a: "องค์กรเลือกได้ว่าจะให้ระบบช่วยขั้นตอนไหน เช่น ค้นข้อมูล จัดประเภทคำถาม หรือเตรียมร่างคำตอบ พร้อมกำหนดกรณีที่ต้องส่งต่อให้พนักงานดูแล",
    },
    {
      q: "ข้อมูลลูกค้าจะปลอดภัยอย่างไร?",
      a: "ก่อนใช้งานต้องกำหนดขอบเขตข้อมูล สิทธิ์เข้าถึง เครื่องมือที่ใช้ และจุดตรวจทานร่วมกัน เราจะประเมินสิ่งเหล่านี้ตาม Workflow และระบบขององค์กร",
    },
    {
      q: "เริ่มต้นกับโครงการเล็กได้หรือไม่?",
      a: "ได้ การเลือกหนึ่งงานที่มีผู้รับผิดชอบและวิธีวัดผลชัดเจนช่วยให้ทีมทดลอง เรียนรู้ และตัดสินใจเรื่องการขยายงานจากข้อมูลที่เกิดขึ้นจริง",
    },
  ],
  "/en/solutions/hotel-ai-automation": [
    {
      q: "Does The KPI Plus also set up and build the automation?",
      a: "Yes. We can help from reviewing the work, designing the workflow, setting up and connecting tools that the systems support, trying it, training the team, and reviewing the result. The scope is set from the systems the organisation already has.",
    },
    {
      q: "Does the hotel have to change the PMS or current systems first?",
      a: "Not always. We first check how the current systems can export or connect data, then propose an approach that fits those limits.",
    },
    {
      q: "Will AI answer guests instead of staff in every case?",
      a: "The organisation chooses which steps the system helps, such as finding facts, sorting question types, or preparing a draft reply, and which cases must still go to a person.",
    },
    {
      q: "How is guest data kept safe?",
      a: "Before use, we agree the data scope, who can access it, which tools are used, and where a person reviews the result. We assess these from the organisation’s workflow and systems.",
    },
    {
      q: "Can this start as a small project?",
      a: "Yes. Choosing one task with a clear owner and a way to measure it helps the team try, learn, and decide on a wider roll-out from real results.",
    },
  ],
  "/ru/solutions/hotel-ai-automation": [
    {
      q: "The KPI Plus также настраивает и делает автоматизацию?",
      a: "Да. Мы можем помочь от разбора работы и проектирования Workflow до настройки и связи поддерживаемых инструментов, пробы, обучения команды и разбора результата. Границы работы задаём по системам организации.",
    },
    {
      q: "Нужно ли сначала менять PMS или текущие системы?",
      a: "Не всегда. Сначала смотрим, как текущие системы могут отдавать или связывать данные, затем предлагаем подход под эти ограничения.",
    },
    {
      q: "ИИ будет отвечать гостю вместо сотрудников во всех случаях?",
      a: "Организация выбирает, какие шаги помогает система — например найти данные, разделить тип вопроса или подготовить черновик ответа — и какие случаи нужно передавать сотруднику.",
    },
    {
      q: "Как защищены данные гостя?",
      a: "До использования договариваемся о границах данных, доступе, инструментах и точке проверки. Оцениваем это по Workflow и системам организации.",
    },
    {
      q: "Можно начать с небольшого проекта?",
      a: "Да. Одна задача с ясным владельцем и способом измерения помогает команде попробовать, научиться и решить о расширении по реальным данным.",
    },
  ],
  "/zh/solutions/hotel-ai-automation": [
    {
      q: "The KPI Plus 也會幫忙安裝並做 Automation 嗎？",
      a: "會。我們可以從檢視工作、設計 Workflow、設定並串接系統支援的工具、試用、培訓團隊，到回顧結果。工作範圍依組織現有系統約定。",
    },
    {
      q: "一定要先換 PMS 或原有系統嗎？",
      a: "不一定。我們會先看原有系統能如何匯出或串接資料，再提出符合這些限制的做法。",
    },
    {
      q: "AI 會完全代替員工回覆客人嗎？",
      a: "組織可以選擇系統幫忙哪個步驟，例如找資料、分類問題或準備回覆草稿，並約定哪些情況必須交給員工處理。",
    },
    {
      q: "客人資料如何受到保護？",
      a: "開始使用前，必須一起約定資料範圍、存取權、使用的工具，以及檢查點。我們會依該組織的 Workflow 與系統評估這些事項。",
    },
    {
      q: "可以從小專案開始嗎？",
      a: "可以。先選一件有負責人、也有明確衡量方式的工作，能讓團隊試用、學習，再依實際結果決定要不要擴大。",
    },
  ],
  "/solutions/hotel-training-team-development": [
    {
      q: "อบรมเฉพาะโรงแรมหรือไม่?",
      a: "ไม่จำกัดเฉพาะโรงแรม เราทำงานด้านการบริการ การพัฒนาคน ภาวะผู้นำ Team Building และทักษะดิจิทัลที่องค์กรประเภทอื่นนำไปใช้ได้ด้วย",
    },
    {
      q: "อบรมเฉพาะองค์กรต่างจาก The KPI Plus Academy อย่างไร?",
      a: "การอบรมเฉพาะองค์กรเริ่มจากโจทย์และผู้เข้าร่วมของทีมนั้น ส่วน Academy มีหลักสูตรและกิจกรรมตามหัวข้อให้เลือก และมีช่องทางปรึกษาการอบรมสำหรับองค์กรด้วย",
    },
    {
      q: "จัด Team Building ให้เชื่อมกับงานได้หรือไม่?",
      a: "ได้ เราจะคุยก่อนว่าทีมอยากพัฒนาเรื่องใด เช่น การสื่อสาร ความไว้วางใจ หรือการแก้ปัญหาร่วมกัน แล้วจึงออกแบบกิจกรรมให้สอดคล้องกับเป้าหมาย",
    },
    {
      q: "ใครควรเข้าร่วม?",
      a: "ขึ้นอยู่กับหัวข้อ อาจเป็นผู้บริหาร หัวหน้าแผนก พนักงานบริการ ทีม Commercial หรือทีมที่ต้องทำงานร่วมกันในโครงการเดียว",
    },
    {
      q: "หลังจบกิจกรรมมีการติดตามหรือไม่?",
      a: "สามารถกำหนดสิ่งที่จะนำไปทดลองใช้และช่วงเวลาทบทวนร่วมกันได้ โดยตกลงรูปแบบการติดตามตั้งแต่ก่อนเริ่มงาน",
    },
  ],
  "/en/solutions/hotel-training-team-development": [
    {
      q: "Is this only for hotels?",
      a: "No. We also work on service, people development, leadership, team building, and digital skills that other organisations can use.",
    },
    {
      q: "How is in-house training different from The KPI Plus Academy?",
      a: "In-house training starts from that team’s brief and participants. The Academy has courses and events by topic, and also a path for organisations that want team training.",
    },
    {
      q: "Can team building connect to real work?",
      a: "Yes. We first talk about what the team wants to develop, such as communication, trust, or solving problems together, then design the activity around that goal.",
    },
    {
      q: "Who should join?",
      a: "It depends on the topic. It may be executives, department heads, service staff, the commercial team, or people who have to work together on one project.",
    },
    {
      q: "Is there follow-up after the activity?",
      a: "We can agree what will be tried and when it will be reviewed. The follow-up format is set before the work starts.",
    },
  ],
  "/ru/solutions/hotel-training-team-development": [
    {
      q: "Это только для отелей?",
      a: "Нет. Мы также работаем с сервисом, развитием людей, лидерством, Team Building и цифровыми навыками, которые могут использовать другие организации.",
    },
    {
      q: "Чем внутреннее обучение отличается от The KPI Plus Academy?",
      a: "Внутреннее обучение начинается с задачи и участников этой команды. В Academy есть курсы и события по темам, а также путь для организаций, которым нужно обучение команды.",
    },
    {
      q: "Можно ли связать Team Building с реальной работой?",
      a: "Да. Сначала обсуждаем, что команда хочет развить — общение, доверие или совместное решение задач — затем проектируем активность под эту цель.",
    },
    {
      q: "Кто должен участвовать?",
      a: "Зависит от темы. Это могут быть руководители, главы отделов, сервисный персонал, коммерческая команда или люди, которым нужно работать вместе в одном проекте.",
    },
    {
      q: "Есть ли сопровождение после активности?",
      a: "Можно согласовать, что будут пробовать и когда это пересмотреть. Формат сопровождения фиксируется до начала работы.",
    },
  ],
  "/zh/solutions/hotel-training-team-development": [
    {
      q: "只做飯店培訓嗎？",
      a: "不限飯店。我們也做服務、人才發展、領導力、Team Building 與數位技能，其他類型組織也能使用。",
    },
    {
      q: "企業內訓和 The KPI Plus Academy 差在哪裡？",
      a: "企業內訓從該團隊的課題與參加者開始。Academy 則有依主題可選的課程與活動，也有給想辦團隊培訓的組織的諮詢入口。",
    },
    {
      q: "Team Building 能接到實際工作嗎？",
      a: "可以。我們會先談團隊想發展什麼，例如溝通、信任或一起解題，再依這個目標設計活動。",
    },
    {
      q: "誰應該參加？",
      a: "依主題而定。可能是高階主管、部門主管、服務人員、Commercial 團隊，或必須在同一專案一起工作的人。",
    },
    {
      q: "活動結束後有追蹤嗎？",
      a: "可以約定接下來要試用的事與回顧時間。追蹤方式會在開始前談好。",
    },
  ],
  "/hotel-revenue-management": [
    {
      q: "Hotel Revenue Management คืออะไร?",
      a: "การทำให้โรงแรมตัดสินใจเรื่องราคา Inventory และช่องทางการขายจาก Booking Pace, Demand, ตลาด และผลงานแต่ละ Channel ไม่ใช่ดูเพียงราคาวันนี้",
    },
    {
      q: "ต่างจากงานขายอย่างไร?",
      a: "งานขายสร้างโอกาสการจอง Revenue Management จัดราคา ช่องทาง และสินค้าให้รายได้สุทธิและส่วนผสมช่องทางเดินถูกทิศ",
    },
  ],
  "/en/hotel-revenue-management": [
    {
      q: "What is hotel revenue management?",
      a: "Turning demand, pace, inventory, and channel signals into pricing and distribution decisions the team can review and own.",
    },
  ],
  "/hotel-digital-marketing": [
    {
      q: "Hotel Digital Marketing ต่างจากโฆษณาทั่วไปอย่างไร?",
      a: "คือการเชื่อม Google, OTA, Website, Direct Booking และ Revenue Management ให้ผู้เข้าพักค้นพบ เปรียบเทียบ และจองด้วยข้อมูลที่ชัด ไม่ใช่การโปรโมตอย่างเดียว",
    },
  ],
  "/en/hotel-digital-marketing": [
    {
      q: "What is hotel digital marketing in this context?",
      a: "Connecting search, the website, paid demand, and the booking path to a commercial question the hotel can measure.",
    },
  ],
  "/hotel-seo-local-search": [
    {
      q: "โรงแรมควรเริ่ม SEO หรือ Local Search ก่อน?",
      a: "เริ่มจากคำถามที่นักเดินทางค้นหาจริง ทั้งบนเว็บไซต์และ Google Business Profile ไม่ใช่การยัดคำค้น",
    },
  ],
  "/en/hotel-seo-local-search": [
    {
      q: "Should a hotel start with SEO or local search?",
      a: "Start with the questions travellers already ask, on the website and in local listings, then measure whether they can find and trust the hotel.",
    },
  ],
  "/hotel-website-conversion": [
    {
      q: "เว็บไซต์โรงแรมควรทำอะไรได้บ้าง?",
      a: "ตอบได้ว่าโรงแรมอยู่ที่ไหน เหมาะกับใคร ห้องพักเป็นอย่างไร ราคาและเงื่อนไขเป็นอย่างไร และเพราะเหตุใดจึงควรพิจารณา Direct Booking",
    },
  ],
  "/en/hotel-website-conversion": [
    {
      q: "What should a hotel website actually do?",
      a: "Help the right guest understand the hotel, trust the offer, and take the next booking or enquiry step.",
    },
  ],
  "/hotel-technology-ai": [
    {
      q: "โรงแรมควรเลือกโครงการ Technology อย่างไร?",
      a: "เลือกจากเวิร์กโฟลว์ที่วันนี้ช้า ไม่ชัด หรือทำมือมาก แล้วทำแผนที่ขั้นตอน เจ้าของงาน และผลลัพธ์ก่อนเลือกเครื่องมือ",
    },
  ],
  "/en/hotel-technology-ai": [
    {
      q: "How should a hotel choose a technology project?",
      a: "From one real workflow that is slow or manual today, mapped before a new tool is selected.",
    },
  ],
  "/phuket-hotel-marketing": [
    {
      q: "การตลาดโรงแรมในภูเก็ตควรเริ่มจากอะไร?",
      a: "จากคำถามด้านรายได้และ Demand ที่โรงแรมเจอตอนนี้ ทั้ง Revenue Management, Local Search, Direct Booking และงานของทีม ไม่ใช่ทำทุกช่องทางพร้อมกัน",
    },
  ],
  "/en/phuket-hotel-marketing": [
    {
      q: "Where should Phuket hotel marketing start?",
      a: "From the revenue and demand question the hotel is facing now: local search, direct booking, distribution, or the way the team works.",
    },
  ],
  "/partner": [
    {
      q: "ต้องมีประสบการณ์ขายบริการโรงแรมหรือไม่?",
      a: "ไม่จำเป็น คุณสามารถเริ่มจากการแนะนำลูกค้าที่มีความสนใจหรือความต้องการจริง ทีม The KPI Plus จะช่วยดูแลการพูดคุยและประเมินบริการต่อ",
    },
    {
      q: "สมัครแล้วเป็นพาร์ตเนอร์ทันทีหรือไม่?",
      a: "ทีมงานจะตรวจสอบใบสมัครและติดต่อกลับก่อนยืนยันการเข้าร่วมโปรแกรม",
    },
    {
      q: "ต้องส่งข้อมูลอะไรเมื่อแนะนำลูกค้า?",
      a: "อย่างน้อยควรมีชื่อธุรกิจ ชื่อและช่องทางติดต่อของผู้เกี่ยวข้อง พร้อมข้อมูลเบื้องต้นว่าลูกค้าต้องการความช่วยเหลือเรื่องใด โปรดตรวจสอบว่าลูกค้ายินดีให้เราติดต่อก่อนส่งข้อมูล",
    },
    {
      q: "จะรู้ได้อย่างไรว่าลูกค้าที่แนะนำอยู่ขั้นตอนไหน?",
      a: "เมื่อ Referral ได้รับการบันทึกและตรวจสอบแล้ว คุณจะติดตามสถานะที่เกี่ยวข้องได้ผ่าน Partner Portal",
    },
    {
      q: "ผลตอบแทนคิดอย่างไร?",
      a: "ผลตอบแทนขึ้นอยู่กับระดับพาร์ตเนอร์ ประเภทของดีล และเงื่อนไข Partner Program ทีมงานจะแจ้งรายละเอียดให้ทราบก่อนเริ่มแนะนำลูกค้า",
    },
  ],
};

const toolHowTo: Record<string, string[]> = {
  "/tools/revpar-calculator": [
    "เลือกโหมด RevPAR, ADR หรือ Occupancy",
    "กรอกตัวเลขสองตัวที่โรงแรมมีอยู่",
    "อ่านผลลัพธ์ตัวที่สามทันที",
  ],
  "/tools/ota-commission-calculator": [
    "กรอกรายได้รวมจาก OTA",
    "ใส่ Commission เฉลี่ยเป็นเปอร์เซ็นต์",
    "เลือกช่วงรายเดือนหรือรายปี แล้วดูรายได้สุทธิและต้นทุน Commission",
  ],
  "/tools/hotel-budget-calculator": [
    "กรอกจำนวนห้องและวันเปิดดำเนินการ",
    "ใส่เป้าหมาย Occupancy และ ADR",
    "อ่านจำนวนห้องคืน รายได้ห้องพัก และ RevPAR",
  ],
  "/tools/hotel-profit-calculator": [
    "กรอกห้อง Occupancy ADR และสัดส่วน OTA",
    "ใส่ต้นทุนห้อง เงินเดือน และค่าใช้จ่ายส่วนกลาง",
    "อ่านประมาณการรายได้ ต้นทุน และ GOP",
  ],
  "/tools/hotel-vat-service-charge-calculator": [
    "เลือกคำนวณ VAT อย่างเดียว หรือ Service Charge บวก VAT",
    "กรอกจำนวนเงินและอัตราเป็นเปอร์เซ็นต์",
    "อ่านยอดก่อนภาษี Service Charge VAT และยอดรวม",
  ],
  "/tools/hotel-searchability-check": [
    "ใส่ URL เว็บไซต์โรงแรม",
    "ให้ระบบตรวจความพร้อมด้าน Google และมือถือ",
    "อ่านจุดที่ควรทบทวนก่อนทำ SEO หรือโฆษณา",
  ],
  "/tools/hotel-review-link": [
    "ค้นหาธุรกิจ",
    "คัดลอกลิงก์หรือดาวน์โหลด QR Code",
    "ส่งให้ลูกค้ารีวิว",
  ],
};

export function faqsForRoute(route: string): FaqItem[] {
  if (table[route]) return table[route];
  if (route.endsWith("/privacy")) return table["/en/privacy"] ?? table["/privacy"] ?? [];
  if (route.endsWith("/cookies")) return table["/en/cookies"] ?? table["/cookies"] ?? [];
  if (route === "/about" || route.endsWith("/about")) {
    return table[route.replace(/\/about$/, "/about-us")] ?? [];
  }
  if (route === "/contact" || route.endsWith("/contact")) {
    return table[route.replace(/\/contact$/, "/contact-us")] ?? [];
  }
  return [];
}

export function howToStepsForRoute(route: string) {
  return toolHowTo[route] ?? [];
}
