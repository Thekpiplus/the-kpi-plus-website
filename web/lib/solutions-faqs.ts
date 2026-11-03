import type { FaqItem } from "@/lib/faqs";
import type { Locale } from "@/lib/seo";

export const SOLUTIONS_INDEX_FAQS = [
  {
    id: "start-all",
    qTh: "ต้องเริ่มใช้บริการทุกด้านพร้อมกันหรือไม่",
    qEn: "Do we need to start every service at once?",
    aTh: "ไม่จำเป็น โรงแรมเริ่มจากหนึ่งปัญหาหรือหนึ่งบริการได้ แล้วขยายเมื่อพร้อมและมีขอบเขตที่ตกลง หน้านี้ไม่บังคับแพ็กครบทุกด้าน",
    aEn: "No. A hotel can start from one problem or one service, then expand when ready and when scope is agreed. This page does not require a full package across every area.",
  },
  {
    id: "which-first",
    qTh: "จะรู้ได้อย่างไรว่าควรเริ่มจากบริการใด",
    qEn: "How do we know which service to start with?",
    aTh: "เริ่มจากปัญหาทางธุรกิจที่ต้องการความสนใจก่อน — รายได้ การตลาดและการจอง หรือระบบและทีม — หรือคุยเพื่อจัดกลุ่มความต้องการ หน้านี้ช่วยชี้บริการที่อาจเกี่ยวข้อง ไม่ใช่การวินิจฉัยหรือคำสั่งซื้ออัตโนมัติ",
    aEn: "Start from the business problem that needs attention first — revenue, marketing and booking, or systems and team — or talk through how to group the need. This page highlights services that may relate; it is not a diagnosis or an automatic order.",
  },
  {
    id: "how-connect",
    qTh: "บริการต่าง ๆ ทำงานร่วมกันได้อย่างไร",
    qEn: "How do the services work together?",
    aTh: "บริการสามารถเชื่อมกันได้เมื่อขอบเขตและระบบเอื้อ เช่น รายได้กับช่องทางขาย การตลาดกับการจองตรง หรือระบบกับทีม แต่ไม่จำเป็นต้องซื้อหรือเริ่มทุกขั้นพร้อมกัน การเชื่อมจริงขึ้นกับข้อมูล สิทธิ์ และขอบเขตที่ตกลง",
    aEn: "Services can connect when scope and systems allow — for example revenue with channels, marketing with direct booking, or systems with the team. You do not need to buy or start every step at once. Real connections depend on data, access, and the agreed scope.",
  },
  {
    id: "partial-scope",
    qTh: "รับดูแลเฉพาะบางบริการได้หรือไม่",
    qEn: "Can we engage only selected services?",
    aTh: "ได้ งานอยู่ในขอบเขตที่โรงแรมและ เดอะ เคพีไอ พลัส ตกลง บริการอื่นนอกขอบเขตจะไม่ถูกสมมติว่าอยู่ในงานโดยอัตโนมัติ",
    aEn: "Yes. Work stays inside the scope the hotel and The KPI Plus agree. Services outside that scope are not assumed to be included automatically.",
  },
  {
    id: "prepare",
    qTh: "ต้องเตรียมระบบหรือข้อมูลอะไรบ้าง",
    qEn: "What systems or data should the hotel prepare?",
    aTh: "ขึ้นกับบริการที่เลือก โดยทั่วไปคือผู้ติดต่อของโรงแรม เป้าหมายหรือปัญหาที่อยากทบทวน และสิทธิ์หรือรายงานที่จำเป็นต่องานนั้น เช่น ช่องทางขาย เว็บไซต์ หรือระบบโรงแรม โรงแรมยังเป็นเจ้าของข้อมูลและสิทธิ์ ฟอร์มสาธารณะไม่ขอข้อมูลแขก รหัสจอง หรือรายละเอียดบัญชีลับ",
    aEn: "It depends on the selected service. Typically the hotel names a contact, the goal or problem to review, and the access or reports that service needs — for example channels, the website, or hotel systems. The hotel keeps ownership of data and permissions. Public forms do not ask for guest data, booking IDs, or confidential account details.",
  },
  {
    id: "small-independent",
    qTh: "บริการเหมาะกับโรงแรมขนาดเล็ก/โรงแรมอิสระหรือไม่",
    qEn: "Are the services suitable for small or independent hotels?",
    aTh: "ออกแบบมาเพื่อโรงแรมอิสระและธุรกิจบริการที่ใกล้เคียงเป็นหลัก ความเหมาะสมขึ้นกับปัญหา ความพร้อมของข้อมูลหรือระบบ และขอบเขตที่ตกลง ไม่รับประกันว่าขนาดห้องพักใดจะเหมาะทุกบริการ",
    aEn: "They are designed mainly for independent hotels and similar service businesses. Fit depends on the problem, data or system readiness, and the agreed scope. There is no guarantee that every room-count size suits every service.",
  },
  {
    id: "measure",
    qTh: "จะประเมินผลงานหรือรายงานความคืบหน้าอย่างไร",
    qEn: "How is progress reviewed or reported?",
    aTh: "รอบรายงานและตัวเลขตามสิ่งที่ระบบและข้อมูลของโรงแรมรองรับได้จริง โดยตกลงคำนิยาม ช่วงเวลา แหล่งที่มา และผู้ทบทวนก่อนเริ่ม หน้านี้ไม่สร้างหรือรับประกัน Occupancy, ADR, RevPAR, conversion อันดับ หรือรายได้ที่เพิ่มขึ้น",
    aEn: "Reporting follows what the hotel’s systems and data can actually support. Definition, period, source, and reviewer are agreed before work starts. This page does not invent or guarantee occupancy, ADR, RevPAR, conversion, rankings, or revenue lifts.",
  },
  {
    id: "existing-provider",
    qTh: "หากใช้ Provider หรือระบบเดิมอยู่แล้ว สามารถทำงานร่วมกันได้หรือไม่",
    qEn: "Can work continue with an existing provider or current systems?",
    aTh: "มักทำร่วมกับระบบหรือผู้ให้บริการเดิมได้ เมื่อมีสิทธิ์ การแมปข้อมูล และการสนับสนุนจากผู้ให้บริการตามที่งานต้องการ ไม่ใช่การเชื่อมต่อครบทุกระบบอัตโนมัติ และไม่รับประกันการรวมระบบทุกราย",
    aEn: "Work can often sit alongside current systems or providers when access, data mapping, and provider support match what the job needs. It is not automatic end-to-end integration, and there is no guarantee of connecting every vendor.",
  },
  {
    id: "timeline",
    qTh: "ต้องใช้เวลาเริ่มงานอย่างไร",
    qEn: "How long does it take to start?",
    aTh: "งานเริ่มหลังตกลงขอบเขตและสิ่งที่ต้องเตรียม ระยะเวลาขึ้นกับบริการ ความพร้อมของข้อมูลหรือสิทธิ์ และการตอบกลับจากผู้ให้บริการที่เกี่ยวข้อง หน้านี้ไม่ประกาศจำนวนวันสำเร็จรูปและไม่รับประกันวันเปิดใช้หรือผลลัพธ์ทางธุรกิจ",
    aEn: "Work starts after scope and preparation are agreed. Timing depends on the service, data or access readiness, and any provider response involved. This page does not publish a fixed number of days, and it does not guarantee a go-live date or a business outcome.",
  },
] as const;

export function solutionsIndexFaqs(locale: Locale): FaqItem[] {
  const thai = locale === "th";
  return SOLUTIONS_INDEX_FAQS.map((item) => ({
    q: thai ? item.qTh : item.qEn,
    a: thai ? item.aTh : item.aEn,
  }));
}
