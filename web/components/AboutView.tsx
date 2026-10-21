import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { clientLogos } from "@/lib/clients";
import { AUDIT_RESPONSE_DAYS } from "@/lib/audit";
import { auditHref, localizePath, type Locale } from "@/lib/seo";

const aboutFeaturedClientNames = [
  "Destination Group",
  "BYD Lofts",
  "Hotel COCO Phuket",
  "Baan Taranya Resort",
  "Casa de Lipe",
  "Baan 125 Stay",
] as const;

const aboutFeaturedClients = aboutFeaturedClientNames.flatMap((name) => {
  const client = clientLogos.find((item) => item.name === name);
  return client ? [client] : [];
});

const foundersPhoto = "/media/the-kpi-plus-founders_f4c8516e.webp";
const workPhoto = "/media/kpi-plus-team-review_d4af97f6.jpg";
const workshopPhoto = { src: "/media/process-workshop.webp", width: 1600, height: 1067 };
const teamRealPhoto = { src: "/media/about-team-real.webp", width: 1600, height: 1067 };
const caseHotelPhoto = { src: "/media/case-study-hotel.webp", width: 1600, height: 1067 };
const pillarPhotos = [
  { src: "/media/sample-revenue-report.webp", width: 1600, height: 1000 },
  { src: "/media/sample-ota-report.webp", width: 1600, height: 1000 },
  { src: "/media/sample-marketing-report.webp", width: 1600, height: 1000 },
] as const;

function splitTags(tags: string) {
  return tags.split(" · ");
}

function AboutSlotPhoto({
  className,
  src,
  width,
  height,
  alt,
  caption,
}: {
  className: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}) {
  return (
    <figure className={`kpi-about-slot ${className}`}>
      <div className="kpi-about-slot-frame">
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      </div>
      <figcaption className="kpi-about-dummy-caption">{caption}</figcaption>
    </figure>
  );
}

function AboutPillarPreview({ index, sampleLabel }: { index: number; sampleLabel: string }) {
  const photo = pillarPhotos[index] ?? pillarPhotos[0];
  return (
    <div className="kpi-about-deliverable kpi-about-deliverable-photo" aria-hidden="true">
      <span className="kpi-about-deliverable-badge">{sampleLabel}</span>
      <img src={photo.src} alt="" width={photo.width} height={photo.height} loading="lazy" decoding="async" />
    </div>
  );
}

const copy = {
  th: {
    kicker: "พาร์ตเนอร์ด้านการบริหารรายได้และการเติบโตของธุรกิจโรงแรม",
    h1: "เดอะ เคพีไอ พลัส ทำงานร่วมกับเจ้าของโรงแรม ผู้บริหาร และทีม Commercial ทั่วประเทศไทย เพื่อช่วยให้เห็นภาพธุรกิจชัดขึ้นว่า",
    highlight: "รายได้กำลังหายไปตรงไหน โอกาสอยู่ตรงไหน และอะไรคือสิ่งที่ควรทำก่อน",
    heroBody:
      "ผลประกอบการของโรงแรมไม่ได้เกิดจาก Revenue Management, OTA, Website, Direct Booking หรือ Marketing เพียงเรื่องใดเรื่องหนึ่ง ทุกส่วนเชื่อมโยงกัน เราจึงนำข้อมูลด้าน Revenue, Demand, Pricing, Distribution และ Direct Booking มามองเป็นภาพเดียวกัน เพื่อเปลี่ยนข้อมูลให้เป็น Action และเปลี่ยน Action ให้เป็นผลลัพธ์ที่วัดได้",
    workAlt: "ทีม The KPI Plus ประชุมรีวิวข้อมูลโรงแรมด้วยกัน",
    dummyCaption: "รูป Dummy · แทนที่ด้วยไฟล์จริงภายหลัง",
    workshopAlt: "ช่องรูปเวิร์กช็อปกระบวนการทำงาน (Dummy)",
    teamRealAlt: "ช่องรูปทีม The KPI Plus (Dummy)",
    caseHotelAlt: "ช่องรูปโรงแรมเคสศึกษา (Dummy)",
    sampleBadge: "ตัวอย่างข้อมูล",
    sampleFormat: "ตัวอย่างรูปแบบการวิเคราะห์",
    samplePeriod: "ตัวอย่างการอ่าน Occupancy กับรายได้สุทธิ",
    auditCta: "ประเมิน Performance โรงแรม",
    partnerEyebrow: "Hospitality Performance Partner",
    partnerTitle: "เราทำงานร่วมกับโรงแรมตั้งแต่ต้นจนจบกระบวนการ และติดตามผลลัพธ์ต่อเนื่อง",
    partnerLead:
      "เดอะ เคพีไอ พลัส ไม่ใช่เพียง Digital Marketing Agency และไม่ใช่ที่ปรึกษาที่เข้ามาวิเคราะห์แล้วส่งรายงานให้โรงแรม เราทำงานร่วมกับโรงแรมตั้งแต่ต้นจนจบกระบวนการ และติดตามผลลัพธ์ต่อเนื่อง",
    partnerGoal: "เป้าหมายของเราไม่ใช่การทำให้โรงแรม “ทำมากขึ้น” แต่คือการช่วยให้โรงแรม",
    partnerAccent: "ทำสิ่งที่ใช่ ในเวลาที่ใช่ เพื่อผลประกอบการที่ดีขึ้น",
    storyVisualLabel: "เรื่องราวของบริษัท",
    storyStages: [
      [
        "01",
        "จุดเริ่มต้น",
        "เดอะ เคพีไอ พลัส ไม่ใช่เพียง Digital Marketing Agency และไม่ใช่ที่ปรึกษาที่เข้ามาวิเคราะห์แล้วส่งรายงานให้โรงแรม",
      ],
      ["02", "การพัฒนาบริการ", "เราทำงานร่วมกับโรงแรมตั้งแต่ต้นจนจบกระบวนการ และติดตามผลลัพธ์ต่อเนื่อง"],
      ["03", "วันนี้", "ทำสิ่งที่ใช่ ในเวลาที่ใช่ เพื่อผลประกอบการที่ดีขึ้น"],
    ],
    visionLabel: "Vision",
    vision:
      "เป็นหนึ่งใน Hospitality Performance Partner ชั้นนำของประเทศไทย ที่ช่วยให้โรงแรมเติบโตจากการตัดสินใจที่ถูกต้อง บนข้อมูลที่ชัดเจนและประสบการณ์จริงในธุรกิจโรงแรม",
    missionLabel: "Mission",
    mission:
      "ช่วยเจ้าของและทีมโรงแรมมองเห็นโอกาสจากข้อมูล วาง Action ที่ชัดเจน และติดตามผล เพื่อพัฒนารายได้และผลประกอบการอย่างต่อเนื่อง",
    methodTitle: "วิธีการทำงานของเรา",
    methodStepsLabel: "ขั้นตอนการทำงาน",
    methodOutput: "ผลลัพธ์",
    methods: [
      ["01", "เข้าใจสถานการณ์", "บริบทธุรกิจและเป้าหมาย"],
      ["02", "วิเคราะห์ข้อมูล", "ทบทวนรายได้และ Demand"],
      ["03", "กำหนด Action", "ข้อเสนอราคาและช่องทาง"],
      ["04", "ลงมือทำ", "ลงมือตามแผน Action"],
      ["05", "ปรับให้ดีขึ้น", "ทบทวนผลลัพธ์และ Action ถัดไป"],
    ],
    methodNote:
      "ก่อนเสนอทุก Action เราต้องเข้าใจก่อนว่าปัญหาอยู่ตรงไหน และโอกาสอยู่ตรงไหน เพราะ Occupancy ที่ลดลงไม่ได้แปลว่าต้องลดราคาเสมอไป และ Revenue ที่เพิ่มขึ้นก็ไม่ได้แปลว่าโรงแรมจะเหลือรายได้มากขึ้นเสมอไป",
    pillarsTitle: "สามเสาหลักของบริการ",
    pillarReceiveLabel: "สิ่งที่ลูกค้าได้รับ",
    pillars: [
      {
        num: "01",
        title: "เพิ่มรายได้และผลตอบแทน",
        subtitle: "Revenue & Commercial Performance",
        body: "ช่วยให้โรงแรมขายห้องได้เหมาะสมกับ Demand และสร้างรายได้ที่มีคุณภาพมากขึ้น ขายอะไร ราคาเท่าไร ช่วงไหน ผ่านช่องทางไหน และสุดท้ายโรงแรมเหลือรายได้เท่าไร",
        tags: "Revenue Management · Pricing Strategy · Demand Analysis · Distribution · OTA Strategy · Channel Performance · Direct Booking Strategy · Commercial Planning",
        receive: "ปฏิทินรายได้ Occupancy forecast และคำแนะนำราคา",
      },
      {
        num: "02",
        title: "เพิ่มโอกาสในการจอง",
        subtitle: "Demand & Direct Booking",
        body: "ช่วยให้โรงแรมเข้าถึงลูกค้าที่เหมาะสม สร้าง Demand และเปลี่ยนความสนใจให้เป็นยอดจอง ให้คนที่ใช่เจอโรงแรมในเวลาที่ใช่",
        tags: "Google Search · Local Search · SEO · Paid Advertising · Social Media Advertising · Hotel Website · Booking Journey · Conversion",
        receive: "รายงานช่องทางจอง แคมเปญ และผลการจองตรง",
      },
      {
        num: "03",
        title: "เพิ่มประสิทธิภาพในการบริหาร",
        subtitle: "Team, Systems & Ways of Working",
        body: "ช่วยให้ทีมโรงแรมมีข้อมูล เครื่องมือ และวิธีการทำงานที่ช่วยให้ตัดสินใจและลงมือได้เร็วขึ้น",
        tags: "Hotel Systems · Reporting · Performance Dashboard · Workflow · Automation · AI · Team Training · Commercial Training",
        receive: "รายงานระบบ งานหลังบ้าน และแผนพัฒนาทีม",
      },
    ],
    experienceTitle: "ประสบการณ์ที่เติบโตไปพร้อมกับลูกค้า",
    experienceBody:
      "เราทำงานร่วมกับธุรกิจ Hospitality มาแล้วกว่า 100 แห่ง ตั้งแต่โรงแรมอิสระขนาดเล็กไปจนถึงธุรกิจที่มีความซับซ้อนมากขึ้น หลักการของเรายังคงเหมือนเดิม: เข้าใจธุรกิจ อ่านข้อมูล เลือกสิ่งที่ควรทำ ลงมือทำ และวัดผล",
    experienceMetric: "ธุรกิจ Hospitality ที่เราได้ร่วมงานด้วย",
    experienceScope: "โรงแรมอิสระขนาดเล็กถึงธุรกิจที่ซับซ้อนกว่า · ประเทศไทย",
    experienceNote: "นับจากธุรกิจที่เคยร่วมงานด้วย ไม่ใช่จำนวนที่บริหารอยู่ในปัจจุบัน",
    clientsEyebrow: "โรงแรมและที่พักที่คัดสรร",
    valuesTitle: "สิ่งที่เราให้ความสำคัญ",
    values: [
      ["01", "มองแบบธุรกิจ", "ทุกคำแนะนำผูกกับราคา ช่องทาง ต้นทุน และรายได้ที่โรงแรมเหลือจริง เราอธิบายว่าทำไมจึงเสนอแบบนั้น เพื่อให้ทีมตัดสินใจเรื่องธุรกิจได้ ไม่ใช่แค่ดูตัวเลข"],
      ["02", "พูดให้เข้าใจง่าย", "เรื่อง Revenue หรือ Distribution อาจซับซ้อน แต่เราพูดด้วยภาษาที่ทีมโรงแรมใช้ในที่ประชุมได้ทันที ไม่ต้องแปลศัพท์ก่อนลงมือ"],
      ["03", "ใช้ได้จริง", "ทุก Analysis จบที่คำถามว่า “แล้วเราจะทำอะไรต่อ?” และระบุ Action ที่ทีมทำได้ ไม่ส่งรายงานแล้วจบ"],
      ["04", "วัดผลได้", "เราไม่ใช้คำว่า “ดีขึ้น” โดยไม่มีตัววัด หลังลงมือทำ เราทบทวนว่ารายได้ Occupancy หรือตัวเลขที่ตกลงไว้ เปลี่ยนไปอย่างไร"],
      ["05", "เข้าใจโรงแรม", "เราคุยกับเจ้าของ GM ทีม Commercial และหน้างานตามบทบาทของแต่ละคน เพราะเรามาจากธุรกิจนี้ และรู้ว่าใครต้องใช้ข้อมูลอะไรตอนไหน"],
      ["06", "ใช้เทคโนโลยีเมื่อช่วยได้จริง", "ถ้าเครื่องมือช่วยลดงานซ้ำ ทำให้ทีมเห็นข้อมูลเร็วขึ้น และมีเวลาดูแลรายได้กับลูกค้ามากขึ้น เราจะนำมาใช้ ถ้าไม่ช่วยให้ตัดสินใจหรือทำงานได้ดีขึ้น ก็ไม่ใช้"],
    ],
    valuesProcessLink: "ดูแนวทางการทำงาน",
    foundersEyebrow: "Our Founders",
    foundersTitle: "สองประสบการณ์ หนึ่งเป้าหมาย",
    foundersLead:
      "เดอะ เคพีไอ พลัส เกิดจากประสบการณ์ที่แตกต่างกันของผู้ก่อตั้งทั้งสองคน คนหนึ่งมาจากงานโรงแรมด้านบริการ การบริหารทีม และประสบการณ์แขก อีกคนมาจากเทคโนโลยี การขาย และการตลาดดิจิทัลในธุรกิจ Hospitality ทั้งคู่เชื่อร่วมกันว่าธุรกิจโรงแรมที่ดีควรเติบโตไปพร้อมกันทั้งด้านรายได้ ระบบ และคน",
    foundersHelp:
      "ประสบการณ์สองด้านนี้ช่วยให้เจ้าของและทีมโรงแรมตัดสินใจจากทั้งหน้างานและจากข้อมูล ไม่ใช่จากรายงานอย่างเดียว",
    foundersAlt: "ผู้ก่อตั้ง เดอะ เคพีไอ พลัส",
    foundersCaption: "คุณเนตรนภิส ผู้ก่อตั้ง · คุณอิศรา อิสรนิรันดร์ ผู้ร่วมก่อตั้ง และประธานเจ้าหน้าที่บริหาร",
    founderAName: "คุณเนตรนภิส",
    founderARole: "ผู้ก่อตั้ง",
    founderABody:
      "ประสบการณ์ในธุรกิจโรงแรมกว่า 21 ปี กับ Mandarin Oriental Bangkok, The Westin Siray Bay Resort & Spa Phuket และ Phuket Marriott Resort & Spa, Merlin Beach ช่วยให้อ่านโรงแรมจากบริการ ทีม และแขก ก่อนเลือกสิ่งที่ควรทำ",
    founderBName: "คุณอิศรา อิสรนิรันดร์",
    founderBRole: "ผู้ร่วมก่อตั้ง และประธานเจ้าหน้าที่บริหาร",
    founderBBody:
      "ประสบการณ์กว่า 15 ปีด้าน Hospitality Technology, Sales, Digital Marketing และ Hotel Solutions กับ ReverseAds, eZee Technosys, Compass Edge และ OYO Hotels ในฐานะ CEO ดูแลทิศทางธุรกิจ และวิธีที่ทีมโรงแรมใช้ข้อมูลกับเครื่องมือเพื่อตัดสินใจได้เร็วขึ้น",
    closerEyebrow: "Better Decisions. Better Hotel Performance.",
    closerTitle: "ตัวเลขไม่ใช่แค่ข้อมูลในรายงาน แต่ต้องช่วยให้ทีมเห็นว่าควรทำอะไรต่อ",
    closerBody:
      "พฤติกรรมนักเดินทาง ช่องทางการค้นหา OTA และ Digital Marketing เปลี่ยนเร็ว สิ่งสำคัญคือการรู้ว่าตัวเลขกำลังบอกอะไร ปัญหาจริงคืออะไร และสิ่งที่ทำไปสร้างผลลัพธ์ให้โรงแรมหรือไม่",
    closerLine: "หาโอกาสให้เจอ · ลงมือให้ถูกจุด · วัดผลให้ชัด",
    closerNextLabel: "หลังจากส่งข้อมูล",
    closerNext: [
      "ทบทวนข้อมูลที่คุณส่งมา",
      "ระบุประเด็นแรกที่ควรวิเคราะห์",
      "อธิบายขั้นตอนถัดไปที่แนะนำ",
    ],
    closerNote: `ไม่มีค่าใช้จ่ายในการวิเคราะห์เบื้องต้น · ข้อมูลโรงแรมเก็บเป็นความลับ · ติดต่อกลับภายใน ${AUDIT_RESPONSE_DAYS} วันทำการ`,
    closerSecondary: "คุยกับทีม เดอะ เคพีไอ พลัส",
    joinTitle: "ร่วมงานกับ เดอะ เคพีไอ พลัส",
    joinBody:
      "เรามองหาคนที่รักธุรกิจโรงแรม ชอบเรียนรู้ สนใจเทคโนโลยี และไม่หยุดถามว่า “มีวิธีที่ดีกว่านี้ไหม?” หากคุณอยากสร้างงานที่มีผลต่อธุรกิจและผู้คนจริง เรายินดีที่จะได้รู้จักคุณ",
    joinProcessLabel: "คุยครั้งแรก",
    joinProcess: [
      ["01", "ข้อมูลที่ควรเตรียม", "เล่าสั้นๆ ว่าคุณมาจากงานโรงแรมด้านไหน สนใจเรียนรู้หรือใช้เทคโนโลยีอย่างไร และอยากทำงานที่มีผลต่อธุรกิจและผู้คนแบบไหน"],
      ["02", "สิ่งที่จะคุยกันในครั้งแรก", "คุยว่าคุณรักธุรกิจโรงแรมตรงไหน ชอบเรียนรู้อย่างไร และยังถามอยู่ไหมว่า “มีวิธีที่ดีกว่านี้ไหม?”"],
      ["03", "รูปแบบการติดตามผล", "ส่งข้อความมาที่อีเมล หัวข้อ Join The KPI Plus ทีมจะอ่านแล้วติดต่อกลับหากอยากรู้จักต่อ"],
    ],
    joinCta: "ติดต่อเรา",
  },
  en: {
    kicker: "Your partner in hotel revenue and growth",
    h1: "The KPI Plus works with hotel owners, executives, and commercial teams across Thailand to get a clearer view of the business:",
    highlight: "Where revenue is being lost, where the opportunities are, and what to do first.",
    heroBody:
      "Hotel performance doesn't come from revenue management, OTAs, the website, direct booking, or marketing alone. Every part is connected. That's why we bring revenue, demand, pricing, distribution, and direct booking data into one view, so data becomes action, and action becomes measurable results.",
    workAlt: "The KPI Plus team reviewing hotel data together",
    dummyCaption: "Dummy photo · replace with the real file later",
    workshopAlt: "Placeholder for a process workshop photo",
    teamRealAlt: "Placeholder for a The KPI Plus team photo",
    caseHotelAlt: "Placeholder for a client hotel photo",
    sampleBadge: "Sample data",
    sampleFormat: "Sample analysis format",
    samplePeriod: "Sample occupancy vs net revenue reading",
    auditCta: "Request a Hotel Performance Audit",
    partnerEyebrow: "Hospitality Performance Partner",
    partnerTitle: "We work alongside your team from start to finish, and stay with the results.",
    partnerLead:
      "The KPI Plus isn't just a digital marketing agency, and we're not consultants who analyze your hotel, hand over a report, and leave. We work alongside your team from start to finish, and stay with the results.",
    partnerGoal: "Our goal isn't to help hotels “do more.” It's to help hotels",
    partnerAccent: "do the right things, at the right time, for better performance.",
    storyVisualLabel: "Company story",
    storyStages: [
      [
        "01",
        "Starting point",
        "The KPI Plus isn't just a digital marketing agency, and we're not consultants who analyze your hotel, hand over a report, and leave.",
      ],
      ["02", "Developing the service", "We work alongside your team from start to finish, and stay with the results."],
      ["03", "Today", "Do the right things, at the right time, for better performance."],
    ],
    visionLabel: "Vision",
    vision:
      "To be one of Thailand's leading Hospitality Performance Partners, helping hotels grow through the right decisions, built on clear data and real hotel experience.",
    missionLabel: "Mission",
    mission:
      "To help hotel owners and teams see opportunities in their data, set clear actions, and track results, so revenue and performance keep improving.",
    methodTitle: "How we work",
    methodStepsLabel: "Working process",
    methodOutput: "Output",
    methods: [
      ["01", "Understand the situation", "Business context and goals"],
      ["02", "Analyze the data", "Revenue and demand review"],
      ["03", "Define the action", "Pricing and channel recommendation"],
      ["04", "Put it into practice", "Action plan implementation"],
      ["05", "Improve", "Performance review and next action"],
    ],
    methodNote:
      "Before recommending any action, we need to understand where the problem is and where the opportunity lies. Falling occupancy doesn't always mean you should cut rates, and rising revenue doesn't always mean your hotel is keeping more of it.",
    pillarsTitle: "Our three service pillars",
    pillarReceiveLabel: "What the hotel receives",
    pillars: [
      {
        num: "01",
        title: "Grow revenue and returns",
        subtitle: "Revenue & Commercial Performance",
        body: "Helping hotels sell rooms in line with demand and generate higher-quality revenue: what to sell, at what price, when, through which channel, and how much the hotel keeps in the end.",
        tags: "Revenue Management · Pricing Strategy · Demand Analysis · Distribution · OTA Strategy · Channel Performance · Direct Booking Strategy · Commercial Planning",
        receive: "Revenue calendar and pricing recommendations",
      },
      {
        num: "02",
        title: "Create more booking opportunities",
        subtitle: "Demand & Direct Booking",
        body: "Helping hotels reach the right guests, build demand, and turn interest into bookings, so the right people find your hotel at the right time.",
        tags: "Google Search · Local Search · SEO · Paid Advertising · Social Media Advertising · Hotel Website · Booking Journey · Conversion",
        receive: "Campaign and direct booking performance report",
      },
      {
        num: "03",
        title: "Run the business more effectively",
        subtitle: "Team, Systems & Ways of Working",
        body: "Giving hotel teams the data, tools, and ways of working that help them decide and act faster.",
        tags: "Hotel Systems · Reporting · Performance Dashboard · Workflow · Automation · AI · Team Training · Commercial Training",
        receive: "Systems, operations, and team development report",
      },
    ],
    experienceTitle: "Experience that grows with our clients",
    experienceBody:
      "We've worked with more than 100 hospitality businesses, from small independent hotels to more complex operations. Our approach stays the same: understand the business, read the data, choose what to do, act, and measure.",
    experienceMetric: "Hospitality businesses we've worked with",
    experienceScope: "Small independent hotels to more complex operations · Thailand",
    experienceNote: "This is businesses we have worked with, not the number currently under management.",
    clientsEyebrow: "Selected Hotels & Hospitality Clients",
    valuesTitle: "What we stand for",
    values: [
      ["01", "Commercial", "Every recommendation is tied to price, channel, cost, and the revenue the hotel actually keeps. We explain why we recommend it, so the team can make a business decision, not just read a number."],
      ["02", "Clear", "Revenue and distribution can be complex. We explain them in language hotel teams can use in a meeting, without translating jargon first."],
      ["03", "Practical", "Every analysis ends with one question: “So what do we do next?” We name an action the team can take, instead of handing over a report and leaving."],
      ["04", "Measured", "We don't say “better” without something to measure it by. After an action is taken, we review what changed in the numbers we agreed to watch."],
      ["05", "Hospitality", "We speak with the owner, the GM, the commercial team, and the front line in the context of each role, because we come from this industry and know who needs which information, and when."],
      [
        "06",
        "Technology when it truly helps",
        "If a tool cuts repetitive work, gets data to the team faster, and frees time for revenue and guests, we use it. If it does not help the team decide or work better, we don't.",
      ],
    ],
    valuesProcessLink: "See how we work",
    foundersEyebrow: "Our Founders",
    foundersTitle: "Two backgrounds, one goal",
    foundersLead:
      "The KPI Plus brings together two different kinds of experience: hotel operations, service, and people on one side, and hospitality technology, sales, and digital marketing on the other. The two founders share one belief: a good hotel business should grow in revenue, systems, and people together.",
    foundersHelp:
      "That mix helps owners and hotel teams decide from both the floor and the numbers, not from a report alone.",
    foundersAlt: "The KPI Plus founders",
    foundersCaption: "Natenapit Isaraniran, Founder · Isara Isaraniran, Co-Founder & Chief Executive Officer",
    founderAName: "Natenapit Isaraniran",
    founderARole: "Founder",
    founderABody:
      "More than 21 years in hotels, with Mandarin Oriental Bangkok, The Westin Siray Bay Resort & Spa Phuket, and Phuket Marriott Resort & Spa, Merlin Beach. She reads a hotel from service, the team, and the guest experience, so recommendations start from how the property actually runs.",
    founderBName: "Isara Isaraniran",
    founderBRole: "Co-Founder & Chief Executive Officer",
    founderBBody:
      "More than 15 years in hospitality technology, sales, digital marketing, and hotel solutions, with ReverseAds, eZee Technosys, Compass Edge, and OYO Hotels. As CEO, he shapes how hotel teams get data, choose tools, and decide faster.",
    closerEyebrow: "Better Decisions. Better Hotel Performance.",
    closerTitle: "Numbers shouldn't just sit in a report. They should show your team what to do next.",
    closerBody:
      "Traveler behavior, search, OTAs, and digital marketing change quickly. What matters is knowing what the numbers are telling you, what the real problem is, and whether what you're doing is actually delivering results for your hotel.",
    closerLine: "Find the opportunity · Act where it matters · Measure what changes",
    closerNextLabel: "What happens next",
    closerNext: [
      "Review the information you submit",
      "Identify the first area worth analysing",
      "Explain the next recommended step",
    ],
    closerNote: `No fee for the initial review · Hotel information is kept confidential · We reply within ${AUDIT_RESPONSE_DAYS} business days`,
    closerSecondary: "Talk to Our Team",
    joinTitle: "Join The KPI Plus",
    joinBody:
      "We're looking for people who love the hotel business, enjoy learning, are curious about technology, and keep asking, “Is there a better way?” If you want to do work that makes a real difference for businesses and people, we'd love to hear from you.",
    joinProcessLabel: "The first conversation",
    joinProcess: [
      ["01", "What to prepare", "A short note on your hotel background, what you like to learn or how you use technology, and the kind of work you want to do for businesses and people."],
      ["02", "What we talk about first", "Whether you love the hotel business, enjoy learning, and keep asking, “Is there a better way?”"],
      ["03", "How we follow up", "Write to us with the subject Join The KPI Plus. The team will read it and reply if they would like to continue the conversation."],
    ],
    joinCta: "Contact Us",
  },
  ru: {
    kicker: "Партнёр по управлению доходами и росту отелей",
    h1: "The KPI Plus работает с владельцами, руководством и коммерческими командами отелей по всему Таиланду, чтобы яснее видеть бизнес:",
    highlight: "где теряется доход, где возможность и что делать сначала.",
    heroBody:
      "Результат отеля не складывается из Revenue Management, OTA, сайта, прямого бронирования или маркетинга по отдельности. Всё связано. Поэтому мы собираем данные по доходу, спросу, ценам, дистрибуции и прямому бронированию в одну картину: данные становятся действием, а действие — измеримым результатом.",
    workAlt: "Команда The KPI Plus вместе разбирает данные отеля",
    dummyCaption: "Черновое фото · позже заменить файлом",
    workshopAlt: "Заглушка для фото воркшопа",
    teamRealAlt: "Заглушка для фото команды The KPI Plus",
    caseHotelAlt: "Заглушка для фото отеля из кейса",
    sampleBadge: "Пример данных",
    sampleFormat: "Формат анализа (пример)",
    samplePeriod: "Пример чтения Occupancy и чистого дохода",
    auditCta: "Запросить аудит Performance отеля",
    partnerEyebrow: "Hospitality Performance Partner",
    partnerTitle: "Мы работаем с командой отеля от начала до конца и остаёмся с результатом.",
    partnerLead:
      "The KPI Plus — не просто digital-агентство и не консультанты, которые анализируют отель, передают отчёт и уходят. Мы работаем вместе с командой от начала до конца и остаёмся с результатом.",
    partnerGoal: "Наша цель — не помочь отелю «делать больше». Мы помогаем отелю",
    partnerAccent: "делать правильные вещи в правильное время ради лучшего результата.",
    storyVisualLabel: "История компании",
    storyStages: [
      [
        "01",
        "Начало",
        "The KPI Plus — не просто digital-агентство и не консультанты, которые анализируют отель, передают отчёт и уходят.",
      ],
      ["02", "Развитие услуг", "Мы работаем вместе с командой от начала до конца и остаёмся с результатом."],
      ["03", "Сегодня", "Делать правильные вещи в правильное время ради лучшего результата."],
    ],
    visionLabel: "Vision",
    vision:
      "Стать одним из ведущих Hospitality Performance Partner в Таиланде и помогать отелям расти за счёт правильных решений на ясных данных и реальном гостиничном опыте.",
    missionLabel: "Mission",
    mission:
      "Помогать владельцам и командам отелей видеть возможности в данных, ставить ясные действия и отслеживать результат, чтобы доход и эффективность росли постоянно.",
    methodTitle: "Как мы работаем",
    methodStepsLabel: "Этапы работы",
    methodOutput: "Результат",
    methods: [
      ["01", "Понять ситуацию", "Контекст бизнеса и цели"],
      ["02", "Анализ данных", "Обзор дохода и спроса"],
      ["03", "Определить действие", "Рекомендация по цене и каналам"],
      ["04", "Внедрить", "Внедрение плана действий"],
      ["05", "Улучшить", "Обзор результата и следующее действие"],
    ],
    methodNote:
      "Прежде чем рекомендовать действие, нужно понять, где проблема и где возможность. Падение загрузки не всегда значит снижать цену, а рост выручки не всегда значит, что отель оставляет себе больше.",
    pillarsTitle: "Три опоры наших услуг",
    pillarReceiveLabel: "Что получает отель",
    pillars: [
      {
        num: "01",
        title: "Растить доход и отдачу",
        subtitle: "Revenue & Commercial Performance",
        body: "Помогать отелю продавать номера в соответствии со спросом и получать более качественный доход: что продавать, по какой цене, когда, через какой канал и сколько отель оставляет себе в итоге.",
        tags: "Revenue Management · Pricing Strategy · Demand Analysis · Distribution · OTA Strategy · Channel Performance · Direct Booking Strategy · Commercial Planning",
        receive: "Календарь дохода, прогноз Occupancy и рекомендации по цене",
      },
      {
        num: "02",
        title: "Создавать больше возможностей для бронирования",
        subtitle: "Demand & Direct Booking",
        body: "Помогать отелю находить нужных гостей, создавать спрос и превращать интерес в бронирования, чтобы нужные люди находили отель в нужное время.",
        tags: "Google Search · Local Search · SEO · Paid Advertising · Social Media Advertising · Hotel Website · Booking Journey · Conversion",
        receive: "Отчёт по каналам, кампаниям и прямым бронированиям",
      },
      {
        num: "03",
        title: "Управлять бизнесом эффективнее",
        subtitle: "Team, Systems & Ways of Working",
        body: "Давать команде отеля данные, инструменты и способы работы, которые помогают быстрее решать и действовать.",
        tags: "Hotel Systems · Reporting · Performance Dashboard · Workflow · Automation · AI · Team Training · Commercial Training",
        receive: "Отчёт по системам, операциям и развитию команды",
      },
    ],
    experienceTitle: "Опыт, который растёт вместе с клиентами",
    experienceBody:
      "Мы работали с более чем 100 hospitality-бизнесами: от небольших независимых отелей до более сложных операций. Подход тот же: понять бизнес, прочитать данные, выбрать действие, сделать и измерить.",
    experienceMetric: "Hospitality-бизнесы, с которыми мы работали",
    experienceScope: "От небольших независимых отелей до более сложных операций · Таиланд",
    experienceNote: "Это число бизнесов, с которыми мы работали, а не объектов в текущем управлении.",
    clientsEyebrow: "Selected Hotels & Hospitality Clients",
    valuesTitle: "Что для нас важно",
    values: [
      ["01", "Коммерческий взгляд", "Каждая рекомендация связана с ценой, каналом, затратами и доходом, который отель реально оставляет себе. Мы объясняем, почему предлагаем это, чтобы команда могла принять бизнес-решение, а не только посмотреть цифру."],
      ["02", "Ясно", "Revenue и дистрибуция могут быть сложными. Мы объясняем их языком, которым команда отеля может пользоваться на совещании, без перевода терминов."],
      ["03", "Практично", "Каждый анализ заканчивается вопросом: «Что делаем дальше?» Мы называем действие, которое команда может выполнить, а не отдаём отчёт и уходим."],
      ["04", "Измеримо", "Мы не говорим «лучше», если нечем это измерить. После действия мы проверяем, как изменились цифры, которые договорились смотреть."],
      ["05", "Hospitality", "Мы говорим с владельцем, GM, коммерческой командой и линейным персоналом в контексте каждой роли, потому что пришли из этой отрасли и знаем, кому какие данные нужны и когда."],
      [
        "06",
        "Технологии, когда они реально помогают",
        "Если инструмент сокращает повторяющуюся работу, быстрее даёт команде данные и освобождает время для дохода и гостей — мы его используем. Если он не помогает решать или работать лучше — не используем.",
      ],
    ],
    valuesProcessLink: "Как мы работаем",
    foundersEyebrow: "Our Founders",
    foundersTitle: "Два опыта, одна цель",
    foundersLead:
      "The KPI Plus объединяет два разных опыта: гостиничные операции, сервис и людей — с одной стороны, hospitality-технологии, продажи и digital-маркетинг — с другой. Основатели верят в одно: хороший гостиничный бизнес должен расти вместе — в доходе, системах и людях.",
    foundersHelp:
      "Этот опыт помогает владельцам и командам отеля решать и с пола, и по цифрам, а не только по отчёту.",
    foundersAlt: "Основатели The KPI Plus",
    foundersCaption: "Natenapit Isaraniran, основатель · Isara Isaraniran, сооснователь и генеральный директор",
    founderAName: "Natenapit Isaraniran",
    founderARole: "Основатель",
    founderABody:
      "Более 21 года в отелях: Mandarin Oriental Bangkok, The Westin Siray Bay Resort & Spa Phuket и Phuket Marriott Resort & Spa, Merlin Beach. Она читает отель через сервис, команду и опыт гостя, поэтому рекомендации начинаются с того, как объект реально работает.",
    founderBName: "Isara Isaraniran",
    founderBRole: "Сооснователь и генеральный директор",
    founderBBody:
      "Более 15 лет в hospitality-технологиях, продажах, digital-маркетинге и hotel solutions: ReverseAds, eZee Technosys, Compass Edge и OYO Hotels. Как CEO он выстраивает, как команды отелей получают данные, выбирают инструменты и быстрее принимают решения.",
    closerEyebrow: "Better Decisions. Better Hotel Performance.",
    closerTitle: "Цифры не должны оставаться в отчёте. Они должны показывать команде, что делать дальше.",
    closerBody:
      "Поведение путешественников, поиск, OTA и digital-маркетинг меняются быстро. Важно понимать, что говорят цифры, в чём реальная проблема и даёт ли то, что вы делаете, результат отелю.",
    closerLine: "Найти возможность · Действовать в нужной точке · Измерить изменение",
    closerNextLabel: "Что будет дальше",
    closerNext: [
      "Просмотрим информацию, которую вы отправите",
      "Определим первую область, которую стоит анализировать",
      "Объясним следующий рекомендуемый шаг",
    ],
    closerNote: `Первичный анализ без оплаты · Данные отеля конфиденциальны · Ответим в течение ${AUDIT_RESPONSE_DAYS} рабочих дней`,
    closerSecondary: "Поговорить с командой The KPI Plus",
    joinTitle: "Присоединиться к The KPI Plus",
    joinBody:
      "Мы ищем людей, которые любят гостиничный бизнес, любят учиться, интересуются технологиями и не перестают спрашивать: «Есть ли способ лучше?» Если вы хотите делать работу, которая реально меняет бизнес и людей, мы будем рады познакомиться.",
    joinProcessLabel: "Первый разговор",
    joinProcess: [
      ["01", "Что подготовить", "Коротко: из какого отельного опыта вы пришли, чему хотите учиться или как пользуетесь технологиями, и какую работу хотите делать для бизнеса и людей."],
      ["02", "О чём говорим сначала", "Любите ли вы гостиничный бизнес, любите ли учиться и продолжаете ли спрашивать: «Есть ли способ лучше?»"],
      ["03", "Как продолжаем", "Напишите на почту с темой Join The KPI Plus. Команда прочитает письмо и ответит, если захочет продолжить разговор."],
    ],
    joinCta: "Связаться с нами",
  },
  zh: {
    kicker: "飯店收益與成長夥伴",
    h1: "The KPI Plus 與泰國各地的飯店業主、高階主管與 Commercial 團隊合作，讓事業看得更清楚：",
    highlight: "收益流失在哪、機會在哪，以及該先做什麼。",
    heroBody:
      "飯店績效不是只靠 Revenue Management、OTA、網站、直銷預訂或行銷任何單一環節。每一部分都連在一起。因此我們把收益、需求、定價、通路與直銷預訂資料看成同一張圖，讓資料變成行動，行動變成可衡量的結果。",
    workAlt: "The KPI Plus 團隊一起檢視飯店資料",
    dummyCaption: "示意圖片 · 之後替換成真實檔案",
    workshopAlt: "流程工作坊照片占位",
    teamRealAlt: "The KPI Plus 團隊照片占位",
    caseHotelAlt: "案例飯店照片占位",
    sampleBadge: "範例資料",
    sampleFormat: "分析格式範例",
    samplePeriod: "住房率與淨收益的讀數範例",
    auditCta: "申請飯店 Performance 分析",
    partnerEyebrow: "Hospitality Performance Partner",
    partnerTitle: "我們從開始到結束與飯店團隊一起做，並持續跟進結果。",
    partnerLead:
      "The KPI Plus 不只是數位行銷公司，也不是分析完就交報告離開的顧問。我們從開始到結束與團隊一起做，並持續跟進結果。",
    partnerGoal: "我們的目標不是讓飯店「做得更多」，而是協助飯店",
    partnerAccent: "在對的時間做對的事，讓績效更好。",
    storyVisualLabel: "公司故事",
    storyStages: [
      [
        "01",
        "起點",
        "The KPI Plus 不只是數位行銷公司，也不是分析完就交報告離開的顧問。",
      ],
      ["02", "服務發展", "我們從開始到結束與團隊一起做，並持續跟進結果。"],
      ["03", "今天", "在對的時間做對的事，讓績效更好。"],
    ],
    visionLabel: "Vision",
    vision:
      "成為泰國領先的 Hospitality Performance Partner 之一，協助飯店用清楚的資料與真實的飯店經驗，做出正確決策並成長。",
    missionLabel: "Mission",
    mission:
      "協助飯店業主與團隊從資料看見機會、訂出清楚的行動並追蹤結果，讓收益與績效持續進步。",
    methodTitle: "我們如何工作",
    methodStepsLabel: "工作步驟",
    methodOutput: "產出",
    methods: [
      ["01", "理解現況", "事業現況與目標"],
      ["02", "分析資料", "收益與需求分析"],
      ["03", "訂出行動", "價格與通路建議"],
      ["04", "落地執行", "執行 Action plan"],
      ["05", "持續改善", "檢視結果與下一步"],
    ],
    methodNote:
      "在提出任何行動前，我們必須先理解問題在哪、機會在哪。住房率下降不一定代表該降價，收益上升也不一定代表飯店留下更多錢。",
    pillarsTitle: "三個服務支柱",
    pillarReceiveLabel: "客戶會得到",
    pillars: [
      {
        num: "01",
        title: "提升收益與回報",
        subtitle: "Revenue & Commercial Performance",
        body: "協助飯店依需求賣房，並創造更高品質的收益：賣什麼、什麼價格、什麼時候、透過哪個通路，以及最後飯店留下多少。",
        tags: "Revenue Management · Pricing Strategy · Demand Analysis · Distribution · OTA Strategy · Channel Performance · Direct Booking Strategy · Commercial Planning",
        receive: "收益日曆、住房率預測與價格建議",
      },
      {
        num: "02",
        title: "創造更多預訂機會",
        subtitle: "Demand & Direct Booking",
        body: "協助飯店接觸對的客人、創造需求，並把興趣轉成預訂，讓對的人在對的時間找到飯店。",
        tags: "Google Search · Local Search · SEO · Paid Advertising · Social Media Advertising · Hotel Website · Booking Journey · Conversion",
        receive: "通路、行銷活動與直銷預訂報告",
      },
      {
        num: "03",
        title: "讓營運更有效",
        subtitle: "Team, Systems & Ways of Working",
        body: "讓飯店團隊擁有資料、工具與工作方式，以便更快決策、更快行動。",
        tags: "Hotel Systems · Reporting · Performance Dashboard · Workflow · Automation · AI · Team Training · Commercial Training",
        receive: "系統、後勤作業與團隊發展報告",
      },
    ],
    experienceTitle: "與客戶一起成長的經驗",
    experienceBody:
      "我們已與超過 100 家旅宿事業合作，從小型獨立飯店到較複雜的營運都有。做法始終一樣：理解事業、讀資料、選擇該做的事、執行，並衡量。",
    experienceMetric: "曾合作的旅宿事業",
    experienceScope: "從小型獨立飯店到較複雜的營運 · 泰國",
    experienceNote: "此數字是曾合作過的旅宿事業，不是目前託管中的數量。",
    clientsEyebrow: "精選飯店與旅宿客戶",
    valuesTitle: "我們看重的事",
    values: [
      ["01", "商業視角", "每一項建議都連到價格、通路、成本，以及飯店真正留下的收益。我們會說明為什麼這樣建議，讓團隊能做事業決策，而不只是看數字。"],
      ["02", "說得清楚", "收益與通路可以很複雜，但我們用飯店團隊在會議上就能用的語言說明，不必先翻譯術語再動手。"],
      ["03", "用得上", "每一次分析都回到一個問題：「那下一步要做什麼？」並指出團隊能立刻做的 Action，而不是交報告就結束。"],
      ["04", "能量得到", "沒有衡量標準，我們不會說「變好了」。行動之後，我們會回頭看約定要追的數字實際如何變化。"],
      ["05", "懂飯店", "我們依業主、總經理、Commercial 團隊與第一線各自的角色溝通，因為我們來自這個產業，知道誰在什麼時候需要哪份資料。"],
      [
        "06",
        "科技要真的有幫助才用",
        "如果工具能減少重複工作、讓團隊更快看到資料，並把時間留給收益與客人，我們會用。如果不能幫助決策或把工作做好，就不用。",
      ],
    ],
    valuesProcessLink: "了解我們的工作方式",
    foundersEyebrow: "Our Founders",
    foundersTitle: "兩段經歷，同一個目標",
    foundersLead:
      "The KPI Plus 結合兩種不同經驗：一邊是飯店營運、服務與人，另一邊是旅宿科技、銷售與數位行銷。兩位創辦人共同相信：好的飯店事業應同時在收益、系統與人一起成長。",
    foundersHelp: "這兩種經驗讓業主與飯店團隊能從現場與資料一起做決定，而不只看報告。",
    foundersAlt: "The KPI Plus 創辦人",
    foundersCaption: "Natenapit Isaraniran 創辦人 · Isara Isaraniran 共同創辦人暨執行長",
    founderAName: "Natenapit Isaraniran",
    founderARole: "創辦人",
    founderABody:
      "超過 21 年飯店經驗，曾任職 Mandarin Oriental Bangkok、The Westin Siray Bay Resort & Spa Phuket，以及 Phuket Marriott Resort & Spa, Merlin Beach。她從服務、團隊與客人體驗讀懂飯店，因此建議會從現場實際怎麼運作開始。",
    founderBName: "Isara Isaraniran",
    founderBRole: "共同創辦人暨執行長",
    founderBBody:
      "超過 15 年旅宿科技、銷售、數位行銷與飯店解決方案經驗，曾任職 ReverseAds、eZee Technosys、Compass Edge 與 OYO Hotels。作為執行長，他讓飯店團隊更快拿到資料、選對工具，並更快做決定。",
    closerEyebrow: "Better Decisions. Better Hotel Performance.",
    closerTitle: "數字不該只停在報告裡，而要讓團隊看見下一步該做什麼。",
    closerBody:
      "旅客行為、搜尋、OTA 與數位行銷變化很快。重要的是知道數字在說什麼、真正的問題是什麼，以及現在做的事是否真的為飯店帶來結果。",
    closerLine: "找到機會 · 做在對的點 · 把變化量清楚",
    closerNextLabel: "送出之後",
    closerNext: [
      "審視你提交的資料",
      "指出第一個值得分析的重點",
      "說明建議的下一步",
    ],
    closerNote: `初步分析不收費 · 飯店資料會保密 · ${AUDIT_RESPONSE_DAYS} 個工作天內回覆`,
    closerSecondary: "與 The KPI Plus 團隊談談",
    joinTitle: "加入 The KPI Plus",
    joinBody:
      "我們尋找熱愛飯店事業、喜歡學習、對科技好奇，並持續問「有沒有更好的方法？」的人。如果你想做真正影響事業與人的工作，我們很樂意認識你。",
    joinProcessLabel: "第一次交談",
    joinProcess: [
      ["01", "該準備的資料", "簡單說明你來自哪種飯店工作、想學什麼或怎麼用科技，以及你想做怎樣真正影響事業與人的工作。"],
      ["02", "第一次會談什麼", "談你是否熱愛飯店事業、喜歡學習，以及是否仍會問「有沒有更好的方法？」"],
      ["03", "後續怎麼跟進", "來信主旨請用 Join The KPI Plus。團隊會閱讀，若想繼續認識會再回覆。"],
    ],
    joinCta: "聯絡我們",
  },
} as const;

export function AboutView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const audit = auditHref(locale);
  const contact = localizePath("/contact-us", locale);
  const approach = localizePath("/approach", locale);
  const isTh = locale === "th";

  return (
    <SiteShell locale={locale} route={localizePath("/about-us", locale)}>
      <section className="kpi-hero kpi-home-hero-section kpi-home-landing-hero kpi-about-hero">
        <div className="kpi-wrap">
          <div className="kpi-home-hero">
            <div className="kpi-home-hero-copy">
              <p className={`kpi-home-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.kicker}</p>
              <h1 className="kpi-h1 kpi-home-h1 kpi-about-hero-title">{t.h1}</h1>
              <p className="kpi-about-hero-highlight">{t.highlight}</p>
              <p className="kpi-lead kpi-home-lead kpi-about-hero-lead">{t.heroBody}</p>
              <div className="kpi-actions">
                <Link href={audit} className="kpi-button">
                  {t.auditCta} <span aria-hidden="true">↗</span>
                </Link>
                <Link href={contact} className="kpi-button-ghost">
                  {t.closerSecondary}
                </Link>
              </div>
            </div>
            <figure className="kpi-home-hero-visual kpi-about-hero-visual">
              {/* Verified real The KPI Plus team photo. Do not replace with AI/stock; leadership uses founders only. */}
              <div className="kpi-about-hero-photo">
                <img
                  src={workPhoto}
                  alt={t.workAlt}
                  width={1024}
                  height={682}
                  sizes="(min-width: 64rem) 28rem, min(36rem, 100vw)"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <figcaption className="kpi-about-hero-caption">{t.workAlt}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="kpi-about-band kpi-about-philosophy" aria-labelledby="about-partner-title">
        <div className="kpi-section">
          <div className="kpi-about-story">
            <div className="kpi-about-story-copy">
              <p className={`kpi-about-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.partnerEyebrow}</p>
              <h2 id="about-partner-title" className="kpi-h2 kpi-about-h2">
                {t.partnerTitle}
              </h2>
              <p className="kpi-about-lead">{t.partnerLead}</p>
              <p className="kpi-about-goal">
                {t.partnerGoal}{" "}
                <span className="kpi-about-accent">{t.partnerAccent}</span>
              </p>
            </div>
            {/* Option B: three-stage story from existing copy. No verified founding dates — do not invent years. */}
            <ol className="kpi-about-story-visual" aria-label={t.storyVisualLabel}>
              {t.storyStages.map(([num, title, body], index) => (
                <li key={num} className="kpi-about-story-stage">
                  {index < t.storyStages.length - 1 ? (
                    <span className="kpi-about-story-line" aria-hidden="true" />
                  ) : null}
                  <span className="kpi-latin kpi-about-num">{num}</span>
                  <div className="kpi-about-story-stage-copy">
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="kpi-about-vm">
            <article className="kpi-about-vm-item">
              <h3 className="kpi-latin kpi-about-vm-label">{t.visionLabel}</h3>
              <p className="kpi-about-vm-body">{t.vision}</p>
            </article>
            <article className="kpi-about-vm-item">
              <h3 className="kpi-latin kpi-about-vm-label">{t.missionLabel}</h3>
              <p className="kpi-about-vm-body">{t.mission}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="kpi-about-method" aria-labelledby="about-method-title">
        <div className="kpi-section">
          <h2 id="about-method-title" className="kpi-h2 kpi-about-h2">
            {t.methodTitle}
          </h2>
          <AboutSlotPhoto
            className="kpi-about-method-photo"
            src={workshopPhoto.src}
            width={workshopPhoto.width}
            height={workshopPhoto.height}
            alt={t.workshopAlt}
            caption={t.dummyCaption}
          />
          <ol className="kpi-about-steps" aria-label={t.methodStepsLabel}>
            {t.methods.map(([num, title, output], index) => (
              <li
                key={num}
                className="kpi-about-step"
                aria-labelledby={`about-method-step-${num}`}
                aria-describedby={`about-method-out-${num}`}
              >
                {index < t.methods.length - 1 ? (
                  <span className="kpi-about-step-connector" aria-hidden="true" />
                ) : null}
                <span className="kpi-latin kpi-about-step-badge" aria-hidden="true">
                  {num}
                </span>
                <div className="kpi-about-step-copy">
                  <h3 id={`about-method-step-${num}`}>{title}</h3>
                  <p id={`about-method-out-${num}`} className="kpi-about-step-output">
                    <span className="sr-only">{t.methodOutput}: </span>
                    {output}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="kpi-about-method-foot">
            <p className="kpi-about-note">{t.methodNote}</p>
            <aside className="kpi-about-sample" aria-label={t.sampleFormat}>
              <p className="kpi-about-sample-badge">{t.sampleBadge}</p>
              <p className="kpi-about-sample-title">{t.sampleFormat}</p>
              <p className="kpi-latin kpi-about-sample-period">{t.samplePeriod}</p>
              <dl className="kpi-about-sample-kpis">
                <div>
                  <dt className="kpi-latin">Occupancy</dt>
                  <dd className="kpi-latin">
                    62% <span aria-hidden="true">→</span> 71%
                  </dd>
                </div>
                <div>
                  <dt className="kpi-latin">Room revenue</dt>
                  <dd className="kpi-latin is-up">+8%</dd>
                </div>
                <div className="is-accent">
                  <dt className="kpi-latin">Net after commission</dt>
                  <dd className="kpi-latin">−3%</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="kpi-about-band kpi-about-pillars" aria-labelledby="about-pillars-title">
        <div className="kpi-section">
          <h2 id="about-pillars-title" className="kpi-h2 kpi-about-h2">
            {t.pillarsTitle}
          </h2>
          <div className="kpi-about-pillar-list">
            {t.pillars.map((pillar, index) => (
              <article key={pillar.num} className="kpi-about-pillar">
                <AboutPillarPreview index={index} sampleLabel={t.sampleBadge} />
                <span className="kpi-latin kpi-about-num">{pillar.num}</span>
                <h3>{pillar.title}</h3>
                <p className="kpi-latin kpi-about-pillar-sub">{pillar.subtitle}</p>
                <p className="kpi-about-pillar-body">{pillar.body}</p>
                <p className="kpi-about-pillar-receive">
                  <span className="kpi-about-pillar-receive-label">{t.pillarReceiveLabel}</span>
                  {pillar.receive}
                </p>
                <ul className="kpi-about-pillar-tags">
                  {splitTags(pillar.tags).map((tag) => (
                    <li key={tag} className="kpi-latin">
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kpi-about-experience" aria-labelledby="about-experience-title">
        <div className="kpi-section">
          <h2 id="about-experience-title" className="kpi-h2 kpi-about-h2">
            {t.experienceTitle}
          </h2>
          <div className="kpi-about-experience-row">
            {/* TODO: add a verified measurement period for the 100+ figure when available. Do not invent a date. */}
            <p className="kpi-latin kpi-about-experience-num" aria-label={`${t.experienceMetric}: 100+`}>
              100+
            </p>
            <div className="kpi-about-experience-copy">
              <p className="kpi-about-experience-label">{t.experienceMetric}</p>
              <p className="kpi-about-experience-scope">{t.experienceScope}</p>
              <p className="kpi-about-experience-note">{t.experienceNote}</p>
              <p className="kpi-about-lead">{t.experienceBody}</p>
            </div>
          </div>
          <AboutSlotPhoto
            className="kpi-about-experience-photo"
            src={caseHotelPhoto.src}
            width={caseHotelPhoto.width}
            height={caseHotelPhoto.height}
            alt={t.caseHotelAlt}
            caption={t.dummyCaption}
          />
          {aboutFeaturedClients.length ? (
            <>
              <p className={`kpi-about-clients-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.clientsEyebrow}</p>
              <ul className="kpi-about-clients" aria-label={t.clientsEyebrow}>
                {aboutFeaturedClients.map((client) => (
                  <li key={client.name} className="kpi-about-client">
                    <img
                      src={client.src}
                      alt={client.name}
                      width={160}
                      height={64}
                      loading="lazy"
                      decoding="async"
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>

      <section className="kpi-about-band kpi-about-values" aria-labelledby="about-values-title">
        <div className="kpi-section">
          <h2 id="about-values-title" className="kpi-h2 kpi-about-h2">
            {t.valuesTitle}
          </h2>
          <ol className="kpi-about-values-list">
            {t.values.map(([num, title, body]) => (
              <li key={num} className="kpi-about-value">
                <span className="kpi-latin kpi-about-value-num" aria-hidden="true">
                  {num}
                </span>
                <div className="kpi-about-value-copy">
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="kpi-about-values-more">
            <Link href={approach}>{t.valuesProcessLink}</Link>
          </p>
        </div>
      </section>

      <section className="kpi-about-leadership" aria-labelledby="about-founders-title">
        <div className="kpi-section">
          <div className="kpi-about-leadership-intro">
            <figure className="kpi-about-leadership-figure">
              {/*
                Preferred work photos (hotel-manager meeting, RM laptop review, site visit, deliverable desk) are not in the verified media set.
                Do not reuse the About Hero team-review photo. Do not use AI/holographic meeting or dashboard images.
                Verified option: founder portrait with confirmed names and roles.
              */}
              <div className="kpi-about-leadership-photo">
                <img
                  src={foundersPhoto}
                  alt={t.foundersAlt}
                  width={705}
                  height={1024}
                  sizes="(min-width: 48rem) 22rem, 100vw"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="kpi-about-leadership-caption">{t.foundersCaption}</figcaption>
            </figure>
            <div className="kpi-about-leadership-copy">
              <p className="kpi-latin kpi-about-eyebrow">{t.foundersEyebrow}</p>
              <h2 id="about-founders-title" className="kpi-h2 kpi-about-h2">
                {t.foundersTitle}
              </h2>
              <p className="kpi-about-lead">{t.foundersLead}</p>
              <p className="kpi-about-leadership-help">{t.foundersHelp}</p>
              <div className="kpi-about-leadership-bios">
                <article className="kpi-about-bio">
                  <h3>{t.founderAName}</h3>
                  <p className="kpi-about-bio-role">{t.founderARole}</p>
                  <p className="kpi-about-bio-body">{t.founderABody}</p>
                </article>
                <article className="kpi-about-bio">
                  <h3>{t.founderBName}</h3>
                  <p className="kpi-about-bio-role">{t.founderBRole}</p>
                  <p className="kpi-about-bio-body">{t.founderBBody}</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-about-closer" aria-labelledby="about-closer-title">
        <div className="kpi-section">
          <div className="kpi-about-closer-inner">
            <p className="kpi-latin kpi-about-closer-eyebrow">{t.closerEyebrow}</p>
            <h2 id="about-closer-title" className="kpi-h2 kpi-about-closer-title">
              {t.closerTitle}
            </h2>
            <p className="kpi-about-closer-body">{t.closerBody}</p>
            <p className="kpi-about-closer-line">{t.closerLine}</p>
            <ol className="kpi-about-closer-next" aria-label={t.closerNextLabel}>
              {t.closerNext.map((step, index) => (
                <li key={step}>
                  <span className="kpi-latin kpi-about-closer-next-num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="kpi-actions">
              <Link href={audit} className="kpi-button">
                {t.auditCta} <span aria-hidden="true">↗</span>
              </Link>
              <Link href={contact} className="kpi-button-ghost">
                {t.closerSecondary}
              </Link>
            </div>
            <p className="kpi-about-closer-note">{t.closerNote}</p>
          </div>
        </div>
      </section>

      <section className="kpi-about-band kpi-about-join" aria-labelledby="about-join-title">
        <div className="kpi-section">
          <div className="kpi-about-join-row">
            <div className="kpi-about-join-copy">
              <h2 id="about-join-title" className="kpi-h2 kpi-about-h2">
                {t.joinTitle}
              </h2>
              <p className="kpi-about-lead">{t.joinBody}</p>
            </div>
            <AboutSlotPhoto
              className="kpi-about-join-photo"
              src={teamRealPhoto.src}
              width={teamRealPhoto.width}
              height={teamRealPhoto.height}
              alt={t.teamRealAlt}
              caption={t.dummyCaption}
            />
            <aside className="kpi-about-join-card" aria-labelledby="about-join-process-title">
              <p id="about-join-process-title" className={`kpi-about-join-card-label${isTh ? "" : " kpi-latin"}`}>
                {t.joinProcessLabel}
              </p>
              <ol>
                {t.joinProcess.map(([num, title, body]) => (
                  <li key={num}>
                    <span className="kpi-latin kpi-about-join-num" aria-hidden="true">
                      {num}
                    </span>
                    <div>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </aside>
            <Link
              href="mailto:info@thekpiplus.com?subject=Join%20The%20KPI%20Plus"
              className="kpi-button kpi-about-join-cta"
            >
              {t.joinCta} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
