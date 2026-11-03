import type { FaqItem } from "@/lib/faqs";
import { formatInsightDate, insightExcerpt, insightPosts, insightUpdatedAt } from "@/lib/insights";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, type Locale } from "@/lib/seo";

export function hotelTrainingSampleLabel(locale: Locale) {
  return locale === "th" ? "ตัวอย่าง" : "Sample";
}

export const HOTEL_TRAINING_ACADEMY_DISCOVER = "https://thekpiplus.co.th/discover";
export const HOTEL_TRAINING_ACADEMY_HOME = "https://thekpiplus.co.th/";

export const HOTEL_TRAINING_PHOTOS = {
  group: "/media/hospitality-training-group_cdf6d58f.webp",
  leadership: "/media/leadership-training-nate_5b9b1ef7.webp",
  circle: "/media/service-quality-circle_e4c75522.webp",
  seminar: "/media/business-seminar-speaking_b934063e.webp",
  speaking: "/media/hospitality-training-speaking_d8b5b303.webp",
  workshop: "/media/internship-workshop-speaking_d360672e.webp",
  process: "/media/process-workshop.webp",
  trainer: "/media/natenapit-portrait_f7cdd1a1.webp",
} as const;

export const HOTEL_TRAINING_HERO_VISUAL_CANDIDATE = "/images/hotel-training-hero-placeholder.webp";

export const HOTEL_TRAINING_HERO_VISUAL = {
  src: HOTEL_TRAINING_HERO_VISUAL_CANDIDATE,
  labelTh: "ตัวอย่างภาพกิจกรรม Hotel Team Training — เปลี่ยนเป็นภาพจริงที่ได้รับอนุญาต",
  labelEn: "Sample Hotel Team Training activity image — replace with an approved real photo",
  captionTh: "ออกแบบการเรียนรู้ให้เชื่อมกับงานจริง พร้อมฝึกใช้และติดตามการนำไปใช้ในทีม",
  captionEn: "Design learning around real work, with practice and follow-up on how the team applies it.",
  altTh: "ภาพตัวอย่างกิจกรรม Hotel Team Training ไม่ใช่ภาพผู้เข้าร่วมจริง รอภาพจริงที่ได้รับอนุญาต",
  altEn: "Sample Hotel Team Training activity image. Not a real participant photo. Replace when publication is approved.",
  status: "sample",
  sourceWidth: 1600,
  sourceHeight: 1000,
  displayWidth: 560,
  displayHeight: 350,
} as const;

export const HOTEL_TRAINING_TRAINER_VISUAL = {
  src: "/images/hotel-training-facilitator-placeholder.webp",
  candidateSrc: HOTEL_TRAINING_PHOTOS.trainer,
  labelTh: "Trainer portrait placeholder — replace with approved facilitator photo",
  labelEn: "Trainer portrait placeholder — replace with approved facilitator photo",
  captionTh: "ภาพตัวอย่างตำแหน่งวิทยากร ไม่ใช่ภาพบุคคล และไม่ใช่ภาพ AI รอภาพจริงที่ได้รับอนุญาต",
  captionEn: "Trainer portrait placeholder. Not a person photo and not an AI portrait. Replace when publication is approved.",
  altTh: "ภาพตัวอย่างตำแหน่งวิทยากร ไม่ใช่ภาพบุคคลจริง รอภาพวิทยากรที่ได้รับอนุญาต",
  altEn: "Trainer portrait placeholder. Not a real person photo. Replace with an approved facilitator portrait.",
  sourceWidth: 800,
  sourceHeight: 1000,
  displayWidth: 320,
  displayHeight: 400,
} as const;

export function hotelTrainingIsLibraryPlaceholder(src?: string) {
  const next = src?.trim() || "";
  return !next || /placeholder/i.test(next) || next === HOTEL_TRAINING_HERO_VISUAL_CANDIDATE || next === HOTEL_TRAINING_TRAINER_VISUAL.src;
}

export function hotelTrainingTrainerPublicSrc(trainer?: { src?: string; status?: string; publicationApproved?: boolean }) {
  const src = trainer?.src?.trim() || "";
  if (!src || hotelTrainingIsLibraryPlaceholder(src)) return HOTEL_TRAINING_TRAINER_VISUAL.src;
  if (hotelTrainingSrcUsedInGallery(src)) return HOTEL_TRAINING_TRAINER_VISUAL.src;
  if (String(trainer?.status) !== "approved" || !trainer?.publicationApproved) return HOTEL_TRAINING_TRAINER_VISUAL.src;
  return src;
}

export function hotelTrainingHeroPublicSrc(visual?: { src?: string; status?: string; publicationApproved?: boolean }) {
  const src = visual?.src?.trim() || "";
  if (!src || hotelTrainingIsLibraryPlaceholder(src)) return HOTEL_TRAINING_HERO_VISUAL.src;
  if (hotelTrainingSrcUsedInGallery(src)) return HOTEL_TRAINING_HERO_VISUAL.src;
  if (String(visual?.status) !== "approved" || !visual?.publicationApproved) return HOTEL_TRAINING_HERO_VISUAL.src;
  return src;
}

export const HOTEL_TRAINING_JOURNEY_VISUAL = {
  src: "/images/hotel-training-journey-placeholder.webp",
  labelTh: "Hotel Team Training Journey — Sample",
  labelEn: "Hotel Team Training Journey — Sample",
  captionTh: "ไทม์ไลน์ HTML ของเส้นทางการอบรม ไม่ใช่ภาพคน และไม่ใช่ชุดส่งมอบมาตรฐานของทุกแพ็กเกจ",
  captionEn: "HTML timeline of the training journey. Not a people photo, and not a standard package for every job.",
  altTh: "ภาพตัวอย่างเส้นทางการอบรมทีมโรงแรม ไม่ใช่ภาพผู้เข้าร่วม รอไทม์ไลน์ HTML ที่แก้ไขได้",
  altEn: "Sample hotel team training journey visual. Not a participant photo. Replace with the editable HTML timeline.",
  sourceWidth: 1600,
  sourceHeight: 900,
  displayWidth: 720,
  displayHeight: 405,
} as const;

export const HOTEL_TRAINING_CYCLE_VISUAL = HOTEL_TRAINING_JOURNEY_VISUAL;

export const HOTEL_TRAINING_JOURNEY_FIELDS = {
  input: { th: "สิ่งที่ใช้ตั้งต้น", en: "Input" },
  owner: { th: "ผู้รับผิดชอบ", en: "Owner" },
  output: { th: "สิ่งที่ได้", en: "Output" },
  approval: { th: "จุดอนุมัติ", en: "Approval point" },
} as const;

export const HOTEL_TRAINING_JOURNEY = [
  {
    id: "discover",
    label: "Discover",
    titleTh: "สำรวจโจทย์และกลุ่มผู้เรียน",
    titleEn: "Discover goals and learner groups",
    bodyTh: "คุยเป้าหมาย กลุ่มผู้เรียน บริบทงาน และปัญหาปัจจุบัน ไม่เริ่มจากวันอบรมอย่างเดียว",
    bodyEn: "Discuss goals, learner groups, job context, and current challenges—not a training day alone.",
    inputTh: "เป้าหมายทางธุรกิจ บทบาทในทีม และงานที่ยังติด",
    inputEn: "Business goal, team roles, and current work issues",
    ownerTh: "ผู้รับผิดชอบของโรงแรมที่ระบุชื่อได้",
    ownerEn: "A named hotel sponsor",
    outputTh: "เอกสาร Brief และกลุ่มผู้เรียนเป้าหมาย",
    outputEn: "Training Brief and target learner group",
    approvalTh: "โรงแรมยืนยัน Brief และกลุ่มผู้เรียน",
    approvalEn: "The hotel confirms the Brief and learner group",
    packageDependent: false,
  },
  {
    id: "design",
    label: "Design",
    titleTh: "ออกแบบการเรียนรู้",
    titleEn: "Learning design",
    bodyTh: "กำหนดผลลัพธ์การเรียนรู้ วาระ เอกสาร การฝึก และการประเมิน จากงาน ไม่เริ่มจากหลักสูตรสำเร็จรูป",
    bodyEn: "Define learning outcomes, agenda, materials, practice, and assessment from the work. Do not start from a catalogue course.",
    inputTh: "เอกสาร Brief และกลุ่มผู้เรียนที่ยืนยันแล้ว",
    inputEn: "Confirmed Training Brief and learner group",
    ownerTh: "วิทยากรร่วมกับผู้รับผิดชอบของโรงแรม",
    ownerEn: "Facilitator with the named hotel sponsor",
    outputTh: "วาระ กิจกรรม และแผนประเมิน",
    outputEn: "Agenda, activities, and assessment plan",
    approvalTh: "โรงแรมอนุมัติวาระและแผนประเมิน",
    approvalEn: "The hotel approves the agenda and assessment plan",
    packageDependent: false,
  },
  {
    id: "deliver",
    label: "Deliver",
    titleTh: "อบรม / เวิร์กช็อป",
    titleEn: "Training / workshop",
    bodyTh: "จัดรอบอบรมหรือเวิร์กช็อปที่ตกลง และให้ทีมฝึกกับสถานการณ์ใกล้งานจริง",
    bodyEn: "Run the agreed session or workshop and practise with scenarios close to real work.",
    inputTh: "วาระ เอกสาร และกิจกรรมที่อนุมัติแล้ว",
    inputEn: "Approved agenda, materials, and activities",
    ownerTh: "วิทยากร",
    ownerEn: "Facilitator",
    outputTh: "รอบอบรมที่จัดแล้ว และบันทึกวิทยากรเมื่ออยู่ในขอบเขต",
    outputEn: "Session delivered and facilitator notes, where in scope",
    approvalTh: "จัดตามวาระที่ตกลง",
    approvalEn: "The session ran as agreed",
    packageDependent: false,
  },
  {
    id: "assess",
    label: "Assess",
    titleTh: "ประเมิน",
    titleEn: "Assess",
    bodyTh: "ทบทวนความรู้หรือทักษะตามเกณฑ์ที่ตกลง คะแนนรายบุคคลไม่แสดงบนหน้านี้",
    bodyEn: "Review knowledge or skill against agreed criteria. Individual scores are not shown on this page.",
    inputTh: "แผนประเมินและเกณฑ์ที่ตกลงในแพ็กเกจ",
    inputEn: "Assessment plan and criteria agreed in the selected package",
    ownerTh: "วิทยากรหรือหัวหน้าที่ระบุชื่อได้",
    ownerEn: "Facilitator or a named supervisor",
    outputTh: "สรุปผลการประเมิน ไม่ใช่การจัดอันดับพนักงานบนหน้าสาธารณะ",
    outputEn: "Assessment summary, not a public individual employee ranking",
    approvalTh: "โรงแรมรับสรุปผล ไม่เผยแพร่คะแนนรายบุคคล",
    approvalEn: "The hotel receives the summary. Individual scores stay unpublished",
    packageDependent: true,
  },
  {
    id: "followup",
    label: "Follow-up",
    titleTh: "ติดตามที่หน้างาน",
    titleEn: "Workplace follow-up",
    bodyTh: "สนับสนุนการนำไปใช้ที่งาน และตกลงขั้นต่อไป การอบรมไม่จบตอนจบคลาส และไม่รับประกันผลทางธุรกิจ",
    bodyEn: "Support application at work and agree next steps. Training does not end when the class ends, and it does not guarantee a business result.",
    inputTh: "สิ่งที่ตกลงจะทดลองใช้หลังเรียน",
    inputEn: "The action agreed to try after the session",
    ownerTh: "เจ้าของงานที่ระบุชื่อได้",
    ownerEn: "A named workplace owner",
    outputTh: "แผนปฏิบัติ เจ้าของงาน และวันทบทวน เมื่ออยู่ในขอบเขต",
    outputEn: "Action plan, owner, and review date, where in scope",
    approvalTh: "มีเจ้าของงานและวันทบทวนเมื่ออยู่ในแพ็กเกจ",
    approvalEn: "Owner and review date are agreed when included in the package",
    packageDependent: true,
  },
] as const;

export const HOTEL_TRAINING_NEEDS = [
  {
    id: "outcome",
    th: "หลังอบรม ทีมควรทำอะไรได้?",
    en: "What should the team be able to do after training?",
  },
  {
    id: "roles",
    th: "รวมบทบาทหรือแผนกใดบ้าง?",
    en: "Which roles or departments are included?",
  },
  {
    id: "task",
    th: "งานปฏิบัติการหรือประเด็นบริการใดที่อบรมนี้ตั้งใจจะทำให้ดีขึ้น?",
    en: "What operational task or service issue is the training intended to improve?",
  },
  {
    id: "difficulty",
    th: "ตอนนี้ทีมยังติดตรงไหน?",
    en: "What does the team currently find difficult?",
  },
  {
    id: "sop",
    th: "มี SOP หรือเอกสารอ้างอิงที่อนุมัติแล้วให้ใช้ในอบรมหรือไม่?",
    en: "Is there an approved SOP or reference material to use in the training?",
  },
  {
    id: "follow",
    th: "ใครจะสนับสนุนและติดตามหลังจบกิจกรรม?",
    en: "Who will support and follow up after the session?",
  },
] as const;

export const HOTEL_TRAINING_NEEDS_FLOW = [
  { id: "goal", label: "Business Goal", th: "เป้าหมายทางธุรกิจ", en: "Business Goal", sampleTh: "เป้าหมายงาน — ตัวอย่าง", sampleEn: "Work goal — Sample" },
  { id: "role", label: "Role / Skill Required", th: "บทบาท / ทักษะที่ต้องการ", en: "Role / Skill Required", sampleTh: "บทบาท ก — ตัวอย่าง", sampleEn: "Role A — Sample" },
  { id: "current", label: "Current Skill Level", th: "ระดับทักษะปัจจุบัน", en: "Current Skill Level", sampleTh: "Need / Practise — ตัวอย่าง", sampleEn: "Need / Practise — Sample" },
  { id: "gap", label: "Skill Gap / Priority", th: "ช่องว่างทักษะ / ลำดับความสำคัญ", en: "Skill Gap / Priority", sampleTh: "ลำดับความสำคัญ — ตัวอย่าง", sampleEn: "Priority — Sample" },
  { id: "rec", label: "Training Recommendation", th: "ข้อเสนอการอบรม", en: "Training Recommendation", sampleTh: "ฝึกในงาน — ตัวอย่าง", sampleEn: "On-the-job practice — Sample" },
] as const;

export const HOTEL_TRAINING_NEEDS_SHEET = {
  titleTh: "ใบสำรวจความต้องการ — ตัวอย่าง / ปิดข้อมูล",
  titleEn: "Needs assessment sheet — Sample / Redacted",
  fields: [
    { id: "goal", labelTh: "เป้าหมาย", labelEn: "Goal", valueTh: "เป้าหมายงาน — ตัวอย่าง", valueEn: "Work goal — Sample" },
    { id: "role", labelTh: "บทบาท", labelEn: "Role", valueTh: "บทบาท ก — ตัวอย่าง", valueEn: "Role A — Sample" },
    { id: "skill", labelTh: "ทักษะ", labelEn: "Skill", valueTh: "การส่งต่องาน — ตัวอย่าง", valueEn: "Handover — Sample" },
    { id: "gap", labelTh: "ช่องว่าง", labelEn: "Gap", valueTh: "Practise — ตัวอย่าง", valueEn: "Practise — Sample" },
    { id: "rec", labelTh: "ข้อเสนอ", labelEn: "Recommendation", valueTh: "ฝึกในงาน — ตัวอย่าง", valueEn: "In-house practice — Sample" },
  ],
  noteTh: "ไม่มีชื่อพนักงาน คะแนนรายบุคคล หรือรายละเอียดโรงแรม",
  noteEn: "No employee names, individual scores, or hotel details",
} as const;

export const HOTEL_TRAINING_NEEDS_VISUAL_CANDIDATE = "/images/hotel-training-needs-assessment-placeholder.webp";

export const HOTEL_TRAINING_NEEDS_VISUAL = {
  src: HOTEL_TRAINING_NEEDS_VISUAL_CANDIDATE,
  labelTh: "ตัวอย่าง Training Needs Assessment — Sample / Redacted",
  labelEn: "Sample Training Needs Assessment — Sample / Redacted",
  captionTh: "ลำดับเป้าหมาย บทบาท ทักษะปัจจุบัน ช่องว่าง และข้อเสนอการอบรม ไม่ใช่ผลประเมินพนักงานจริง",
  captionEn: "Sequence from business goal to training recommendation. Not a live employee assessment.",
  altTh: "แผนภาพตัวอย่าง Training Needs Assessment จากเป้าหมายทางธุรกิจถึงข้อเสนอการอบรม ปิดชื่อและคะแนน",
  altEn: "Sample Training Needs Assessment path from business goal to training recommendation, with names and scores redacted.",
  status: "sample",
  sourceWidth: 1200,
  sourceHeight: 800,
  displayWidth: 480,
  displayHeight: 320,
} as const;

export const HOTEL_TRAINING_PROGRAM_FORMATS = {
  inhouse: { id: "inhouse", th: "In-house Training", en: "In-house Training" },
  workshop: { id: "workshop", th: "Workshop", en: "Workshop" },
  teambuilding: { id: "teambuilding", th: "Team Building", en: "Team Building" },
  online: { id: "online", th: "Online Learning", en: "Online Learning" },
} as const;

export type HotelTrainingProgramFormatId = keyof typeof HOTEL_TRAINING_PROGRAM_FORMATS;

export const HOTEL_TRAINING_PROGRAM_VISUAL = {
  src: "/images/hotel-training-program-placeholder.webp",
  labelTh: "ตัวอย่างหลักสูตร/กิจกรรม — เปลี่ยนเป็นภาพจริง",
  labelEn: "Sample program/activity visual — replace with an approved photo",
  sourceWidth: 1200,
  sourceHeight: 800,
  displayWidth: 360,
  displayHeight: 240,
} as const;

export const HOTEL_TRAINING_PROGRAMS = [
  {
    id: "service",
    categoryTh: "Hotel Operations & Service Skills",
    categoryEn: "Hotel Operations & Service Skills",
    titleTh: "การบริการและประสบการณ์ลูกค้า",
    titleEn: "Service and guest experience",
    audienceTh: "ทีมบริการ ต้อนรับ หรือผู้ที่พูดกับลูกค้า",
    audienceEn: "Service, front-office, or guest-facing roles",
    problemTh: "ทีมยังฟังความต้องการ รับมือสถานการณ์ หรือส่งต่องานบริการได้ไม่มั่นใจ",
    problemEn: "The team is not yet confident hearing the need, handling the situation, or handing service work on",
    outcomes: [
      { th: "ฟังความต้องการในสถานการณ์ที่ทีมเจอจริง", en: "Hear the need in situations the team actually meets" },
      { th: "ฝึกการรับมือและการส่งต่อโดยไม่ใช้ข้อมูลแขกจริง", en: "Practise handling and handover without real guest data" },
      { th: "ทดลองใช้กับงานบริการตามขอบเขตที่ตกลง", en: "Try the method on agreed service work" },
    ],
    formats: ["inhouse", "workshop"] as HotelTrainingProgramFormatId[],
    durationTh: "",
    durationEn: "",
    groupSizeTh: "",
    groupSizeEn: "",
    activityTh: "ฝึกสถานการณ์บริการและชิ้นงานส่งต่อจากงานจริงของทีม ไม่ใส่ข้อมูลแขกจริง",
    activityEn: "Service scenario practice and a handover artefact from the team’s real work. No real guest data",
    assessTh: "สังเกตการฝึกตามเกณฑ์ที่ตกลง และทบทวนการนำไปใช้กับผู้รับผิดชอบ หากตกลงไว้ก่อนเริ่ม",
    assessEn: "Observe practice against agreed criteria, and review application with the named owner if that was agreed before the session",
    href: "#training-enquiry",
    ctaTh: "ส่งคำขอเรื่องพัฒนาทีม",
    ctaEn: "Send a team-development request",
    sample: true,
  },
  {
    id: "commercial",
    categoryTh: "Revenue / KPI Literacy",
    categoryEn: "Revenue / KPI Literacy",
    titleTh: "รายได้ การขาย และการทำงานร่วมกัน",
    titleEn: "Revenue, sales, and working together",
    audienceTh: "Revenue, Sales, Marketing, Reservations, Operations",
    audienceEn: "Revenue, Sales, Marketing, Reservations, Operations",
    problemTh: "ทีมยังใช้ข้อมูลคนละชุด ตัดสินใจไม่จบ หรือส่งต่องานต่อไม่ติด",
    problemEn: "The team still uses different facts, leaves decisions unfinished, or cannot hand the work on",
    outcomes: [
      { th: "ใช้ข้อมูลชุดเดียวกันตอนตัดสินใจ", en: "Use the same facts when deciding" },
      { th: "ส่งต่องานหลังการตัดสินใจให้มีเจ้าของ", en: "Hand the work on so it has an owner" },
      { th: "ทดลองในที่ประชุมหรือขั้นตอนที่ตกลง", en: "Try it in the agreed meeting or process" },
    ],
    formats: ["inhouse", "workshop"] as HotelTrainingProgramFormatId[],
    durationTh: "",
    durationEn: "",
    groupSizeTh: "",
    groupSizeEn: "",
    activityTh: "เคสจากงานจริงของโรงแรมนั้น และบันทึกการตัดสินใจ/ผู้รับผิดชอบ ไม่ใช่ตัวเลขรายได้รับประกัน",
    activityEn: "A real-work case from that hotel and a decision/owner note. Not a guaranteed revenue figure",
    assessTh: "ทบทวนการตัดสินใจและชิ้นงานกับผู้รับผิดชอบ คะแนนรายบุคคลไม่แสดงบนหน้านี้",
    assessEn: "Review the decision and artefact with the named owner. Individual scores are not shown on this page",
    href: "#training-enquiry",
    ctaTh: "ส่งคำขอเรื่องพัฒนาทีม",
    ctaEn: "Send a team-development request",
    sample: true,
  },
  {
    id: "teambuilding",
    categoryTh: "Team Building & Collaboration",
    categoryEn: "Team Building & Collaboration",
    titleTh: "Team Building ที่เชื่อมกับงาน",
    titleEn: "Team building connected to work",
    audienceTh: "ทีมที่ต้องทำงานร่วมกัน",
    audienceEn: "People who must work together",
    problemTh: "ทีมยังฟัง สื่อสาร แก้ปัญหา หรือส่งต่องานร่วมกันได้ไม่ติด",
    problemEn: "The team still cannot listen, communicate, solve problems, or hand work over together",
    outcomes: [
      { th: "ฝึกฟัง สื่อสาร และแก้ปัญหาร่วมกันจากเป้าหมายงาน", en: "Practise listening, communicating, and solving problems from a shared work goal" },
      { th: "ฝึกส่งต่องานระหว่างบทบาท", en: "Practise handing work between roles" },
      { th: "ตกลงวิธีทำงานร่วมกันหลังกลับไปทำงาน", en: "Agree how the team will work together after they return" },
    ],
    formats: ["teambuilding", "workshop"] as HotelTrainingProgramFormatId[],
    durationTh: "",
    durationEn: "",
    groupSizeTh: "",
    groupSizeEn: "",
    activityTh: "กิจกรรมกลุ่มที่ออกแบบจากเป้าหมายงาน เช่น การสื่อสารหรือการส่งต่อ ไม่ใช่เกมลอย ๆ",
    activityEn: "A group activity designed from a work goal such as communication or handover, not a disconnected game",
    assessTh: "ดูการร่วมมือระหว่างกิจกรรม ไม่ใช่คะแนนบุคลิกภาพ หากตกลงติดตาม จะมีเจ้าของงานและจุดทบทวน",
    assessEn: "Observe cooperation during the activity, not a personality score. Follow-up needs an owner and a review point if agreed",
    href: "#training-enquiry",
    ctaTh: "ส่งคำขอเรื่องพัฒนาทีม",
    ctaEn: "Send a team-development request",
    sample: true,
  },
  {
    id: "leadership",
    categoryTh: "Leadership / Communication",
    categoryEn: "Leadership / Communication",
    titleTh: "หัวหน้างานและการดูแลทีม",
    titleEn: "Supervisors and team care",
    audienceTh: "หัวหน้าแผนกหรือผู้ที่กำลังจะขึ้นบทบาทใหม่",
    audienceEn: "Department heads or people moving into a new role",
    problemTh: "หัวหน้างานยังสื่อสาร ให้คำแนะนำ หรือติดตามการนำไปใช้ที่หน้างานได้ไม่มั่นใจ",
    problemEn: "Supervisors are not yet confident communicating, coaching, or following up on application at work",
    outcomes: [
      { th: "ฝึกการสื่อสารและการให้คำแนะนำในสถานการณ์งาน", en: "Practise communication and coaching in work situations" },
      { th: "ทดลองวิธีคุยและติดตามทีมในงานจริง", en: "Try the conversation and follow-up method at work" },
      { th: "ทบทวนกับผู้รับผิดชอบหลังกิจกรรม", en: "Review with the named owner after the session" },
    ],
    formats: ["inhouse", "workshop"] as HotelTrainingProgramFormatId[],
    durationTh: "",
    durationEn: "",
    groupSizeTh: "",
    groupSizeEn: "",
    activityTh: "สถานการณ์ฝึกการคุยกับทีม และแผนติดตามสั้นที่หัวหน้างานพากลับไปใช้",
    activityEn: "Practice conversations with the team and a short follow-up plan the supervisor takes back to work",
    assessTh: "สถานการณ์ฝึกและการทบทวนจากผู้รับผิดชอบที่สนับสนุนหลังคลาส",
    assessEn: "Practice situations and review by the sponsor who will support after the class",
    href: "#training-enquiry",
    ctaTh: "ส่งคำขอเรื่องพัฒนาทีม",
    ctaEn: "Send a team-development request",
    sample: true,
  },
  {
    id: "digital",
    categoryTh: "Digital / AI Skills",
    categoryEn: "Digital / AI Skills",
    titleTh: "ระบบ ดิจิทัล และ AI ในงาน",
    titleEn: "Systems, digital skills, and AI at work",
    audienceTh: "ทีมที่ต้องใช้ระบบหรือเครื่องมือใหม่ในงาน",
    audienceEn: "Teams that must use a new system or tool in their work",
    problemTh: "ทีมยังใช้เครื่องมือกับขั้นตอนงานจริงไม่ติด หรือยังไม่มีคนตรวจผลก่อนใช้",
    problemEn: "The team cannot yet use the tool on a real work step, or there is no person checking the result before use",
    outcomes: [
      { th: "ใช้เครื่องมือกับขั้นตอนงานที่มีอยู่", en: "Use the tool on an existing work step" },
      { th: "ตรวจผลโดยคนก่อนนำไปใช้", en: "Have a person check the result before use" },
      { th: "ทดลองกับงานที่อนุมัติและมีผู้ตรวจทาน", en: "Trial on approved work with a named reviewer" },
    ],
    formats: ["inhouse", "workshop"] as HotelTrainingProgramFormatId[],
    durationTh: "",
    durationEn: "",
    groupSizeTh: "",
    groupSizeEn: "",
    activityTh: "ชิ้นงานฝึกบนขั้นตอนที่มีอยู่ โดยใช้ข้อมูลที่อนุมัติและมีคนตรวจ ไม่ใช่คะแนนจากเครื่องมือ",
    activityEn: "A practice artefact on an existing step, using approved data and human review, not a tool score",
    assessTh: "ชิ้นงานฝึกที่มีผู้ตรวจทาน หากตกลงติดตาม จะมีเจ้าของงานและจุดทบทวน",
    assessEn: "A practice artefact with a reviewer. Follow-up needs an owner and a review point if agreed",
    href: "#training-enquiry",
    ctaTh: "ส่งคำขอเรื่องพัฒนาทีม",
    ctaEn: "Send a team-development request",
    sample: true,
  },
  {
    id: "academy",
    categoryTh: "Online Learning",
    categoryEn: "Online Learning",
    titleTh: "หลักสูตรและกิจกรรมของ The KPI Plus Academy",
    titleEn: "Courses and events at The KPI Plus Academy",
    audienceTh: "ผู้ที่ต้องการพัฒนาทักษะด้วยตนเอง หรือองค์กรที่ต้องการดูหัวข้อที่มีใน Academy",
    audienceEn: "People developing skills themselves, or organisations that want to see topics the Academy lists",
    problemTh: "ต้องการเรียนตามหัวข้อที่มีใน Academy ไม่ใช่โจทย์เฉพาะองค์กรบนหน้านี้",
    problemEn: "The need is a listed Academy topic, not an in-house brief on this page",
    outcomes: [
      { th: "เลือกหลักสูตรหรือกิจกรรมตามหัวข้อที่มีใน Academy", en: "Choose a course or event from topics the Academy actually lists" },
      { th: "ใช้ช่องทาง Academy เพื่อปรึกษาการอบรมสำหรับองค์กร", en: "Use the Academy path to discuss organisation training" },
    ],
    formats: ["online"] as HotelTrainingProgramFormatId[],
    durationTh: "",
    durationEn: "",
    groupSizeTh: "",
    groupSizeEn: "",
    activityTh: "ตามที่แต่ละหลักสูตรหรือกิจกรรมของ Academy กำหนด หน้านี้ไม่สร้างรายละเอียดหลักสูตรแทน Academy",
    activityEn: "Whatever that Academy course or event specifies. This page does not invent Academy course details",
    assessTh: "ตามวิธีของหลักสูตรหรือกิจกรรมนั้น หน้านี้ไม่ประกาศใบรับรองหรือคะแนน",
    assessEn: "Follow that course or event’s method. This page does not publish a certificate or score",
    href: HOTEL_TRAINING_ACADEMY_DISCOVER,
    ctaTh: "ดูหลักสูตรและกิจกรรมของ Academy",
    ctaEn: "See Academy courses and events",
    sample: true,
  },
] as const;

export const HOTEL_TRAINING_ASSESS_VISUAL = {
  src: "/images/hotel-training-learning-followthrough-placeholder.webp",
  labelTh: "Learning Follow-through Framework — Sample",
  labelEn: "Learning Follow-through Framework — Sample",
  captionTh: "ตารางสัญญาณทบทวนการเรียนรู้ ไม่ใช่โมเดลประเมินสำเร็จรูป และไม่ใช่คะแนนพนักงาน",
  captionEn: "Sample learning follow-through signals. Not a packaged assessment model, and not employee scores.",
  altTh: "ภาพตัวอย่างกรอบติดตามการเรียนรู้ ไม่ใช่คะแนนจริง รอตาราง HTML ที่แก้ไขได้",
  altEn: "Sample Learning Follow-through Framework visual. Not live scores. Replace with the editable HTML table.",
  sourceWidth: 1600,
  sourceHeight: 900,
  displayWidth: 720,
  displayHeight: 405,
} as const;

export const HOTEL_TRAINING_ASSESS_FIELDS = {
  signal: { th: "สัญญาณ", en: "Signal" },
  meaning: { th: "ความหมาย", en: "What it covers" },
  evidence: { th: "หลักฐาน", en: "Evidence" },
  status: { th: "สถานะบนหน้านี้", en: "Public status" },
} as const;

export const HOTEL_TRAINING_ASSESS = [
  {
    id: "participation",
    label: "Participation",
    meaningTh: "หลักฐานการเข้าเรียนหรือการทำกิจกรรมให้ครบตามที่ตกลง",
    meaningEn: "Attendance or activity completion evidence",
    evidenceTh: "รายชื่อเข้าร่วมหรือบันทึกกิจกรรมที่โรงแรมเก็บ ไม่แสดงจำนวนบนหน้านี้",
    evidenceEn: "Attendance or activity records kept by the hotel. This page does not show a headcount.",
    statusTh: "ยังไม่ตั้งค่า — ตัวอย่าง",
    statusEn: "Not set — Sample",
    sample: true,
  },
  {
    id: "confidence",
    label: "Confidence",
    meaningTh: "การสะท้อนของผู้เรียนหรือการตรวจด้วยตนเอง ใช้เป็นสัญญาณไม่ใช่ผลทางธุรกิจ",
    meaningEn: "Learner reflection or a self-check, used as a signal, not a business result",
    evidenceTh: "แสดงเมื่อมีการเก็บจริงเท่านั้น ไม่สร้างคะแนนความมั่นใจ",
    evidenceEn: "Shown only if it was actually collected. This page does not invent a confidence score.",
    statusTh: "ยังไม่เก็บ — ตัวอย่าง",
    statusEn: "Not collected — Sample",
    sample: true,
  },
  {
    id: "application",
    label: "Application",
    meaningTh: "การฝึกบทบาทสมมติ หรือการสังเกตของหัวหน้าที่หน้างาน ในขอบเขตที่ตกลง",
    meaningEn: "Role-play or manager observation at work, inside the agreed scope",
    evidenceTh: "ชิ้นงานฝึกหรือบันทึกสังเกต คะแนนรายบุคคลไม่แสดงบนหน้านี้",
    evidenceEn: "A practice artefact or observation notes. Individual scores are not shown on this page.",
    statusTh: "ยังไม่ตั้งค่า — ตัวอย่าง",
    statusEn: "Not set — Sample",
    sample: true,
  },
  {
    id: "followthrough",
    label: "Follow-through",
    meaningTh: "เจ้าของงานและวันทบทวนของสิ่งที่จะทดลองใช้",
    meaningEn: "Action owner and review date",
    evidenceTh: "แผนปฏิบัติที่มีเจ้าของงานและวันนัด เมื่ออยู่ในขอบเขต",
    evidenceEn: "An action plan with an owner and a review date, where in scope",
    statusTh: "ยังไม่ตั้งค่า — ตัวอย่าง",
    statusEn: "Not set — Sample",
    sample: true,
  },
  {
    id: "review",
    label: "Review",
    meaningTh: "สรุปฟีดแบ็กหรือการประเมิน และการเรียนรู้ขั้นต่อไป",
    meaningEn: "Feedback or assessment summary, and the next learning action",
    evidenceTh: "สรุปที่โรงแรมรับ ไม่ใช่การจัดอันดับพนักงานบนหน้าสาธารณะ",
    evidenceEn: "A summary the hotel receives. Not a public ranking of employees.",
    statusTh: "ยังไม่ตั้งค่า — ตัวอย่าง",
    statusEn: "Not set — Sample",
    sample: true,
  },
] as const;

export const HOTEL_TRAINING_MATRIX_VISUAL = {
  src: "/images/hotel-team-skill-matrix-placeholder.webp",
  labelTh: "Hotel Team Skill Matrix — Sample",
  labelEn: "Hotel Team Skill Matrix — Sample",
  captionTh: "ตารางทักษะตัวอย่างตามแผนกและบทบาท ไม่ใช่ผลประเมินพนักงาน และไม่ใช่แคตตาล็อกหลักสูตร",
  captionEn: "Sample skill matrix by department and role. Not an employee assessment, and not a course catalogue.",
  altTh: "ภาพตัวอย่างตารางทักษะทีมโรงแรม ไม่ใช่ตารางคะแนนจริง รอตาราง HTML ที่แก้ไขได้",
  altEn: "Sample hotel team skill matrix visual. Not a live score table. Replace with the editable HTML matrix.",
  sourceWidth: 1600,
  sourceHeight: 900,
  displayWidth: 720,
  displayHeight: 405,
} as const;

export const HOTEL_TRAINING_MATRIX_FIELDS = {
  role: { th: "แผนก / บทบาท", en: "Department / Role" },
  skill: { th: "ทักษะ / หัวข้อ", en: "Skill / topic" },
  activity: { th: "ตัวอย่างกิจกรรมการเรียนรู้", en: "Example learning activity" },
  assess: { th: "วิธีประเมิน / ติดตาม", en: "Assessment / follow-up method" },
} as const;

export const HOTEL_TRAINING_MATRIX = [
  {
    id: "front",
    roleTh: "Front Office / Guest Service",
    roleEn: "Front Office / Guest Service",
    skillTh: "การกู้คืนบริการและการสื่อสาร",
    skillEn: "Service recovery and communication",
    activityTh: "Role-play สถานการณ์บริการ โดยไม่ใช้ข้อมูลแขกจริง",
    activityEn: "Role-play of service situations, without real guest data",
    assessTh: "สังเกตการฝึกตามเกณฑ์ที่ตกลง และทบทวนกับหัวหน้างานที่ระบุชื่อได้หากตกลงไว้",
    assessEn: "Observe practice against agreed criteria, and review with a named supervisor if agreed",
    sample: true,
  },
  {
    id: "reservations",
    roleTh: "Reservations",
    roleEn: "Reservations",
    skillTh: "ขั้นตอนการจองและการส่งต่องาน",
    skillEn: "Reservation workflow and handover",
    activityTh: "แบบฝึกเคสจากงาน โดยไม่ใช้ข้อมูลการจองจริง",
    activityEn: "A case exercise from the work, without live reservation data",
    assessTh: "ทบทวนชิ้นงานส่งต่อกับผู้รับผิดชอบ คะแนนรายบุคคลไม่แสดงบนหน้านี้",
    assessEn: "Review the handover artefact with the named owner. Individual scores are not shown on this page",
    sample: true,
  },
  {
    id: "revenue",
    roleTh: "Revenue",
    roleEn: "Revenue",
    skillTh: "การอ่าน KPI และข้อมูล",
    skillEn: "KPI / data literacy",
    activityTh: "เวิร์กช็อปกับข้อมูลตัวอย่าง ไม่ใช่ตัวเลขรายได้จริงของโรงแรม",
    activityEn: "A sample-data workshop. Not the hotel’s live revenue figures",
    assessTh: "ทบทวนการตัดสินใจและชิ้นงานกับผู้รับผิดชอบ",
    assessEn: "Review the decision and artefact with the named owner",
    sample: true,
  },
  {
    id: "sales",
    roleTh: "Sales / Marketing",
    roleEn: "Sales / Marketing",
    skillTh: "เส้นทางลูกค้าและขั้นตอนแคมเปญ",
    skillEn: "Customer journey and campaign workflow",
    activityTh: "กิจกรรมกลุ่มจากเคสงาน ไม่ใช่เกมลอย ๆ",
    activityEn: "A group exercise from a work case, not a disconnected game",
    assessTh: "ดูการร่วมมือระหว่างกิจกรรม หากตกลงติดตาม จะมีเจ้าของงานและจุดทบทวน",
    assessEn: "Observe cooperation during the activity. Follow-up needs an owner and a review point if agreed",
    sample: true,
  },
  {
    id: "supervisor",
    roleTh: "หัวหน้างาน / ผู้จัดการ",
    roleEn: "Supervisor / Manager",
    skillTh: "การโค้ช ฟีดแบ็ก และการพัฒนาทีม",
    skillEn: "Coaching, feedback, and team development",
    activityTh: "สถานการณ์ฝึกการคุยกับทีม และแผนติดตามสั้นที่พากลับไปใช้",
    activityEn: "Practice conversations with the team and a short follow-up plan taken back to work",
    assessTh: "สังเกตการติดตามที่หน้างานโดยผู้รับผิดชอบที่ระบุชื่อได้ หากตกลงไว้",
    assessEn: "Follow-up observation by a named sponsor, if agreed",
    sample: true,
  },
] as const;

export const HOTEL_TRAINING_OUTCOME_VISUAL = {
  src: "/images/hotel-training-outcomes-scorecard-placeholder.webp",
  labelTh: "Training Outcome Scorecard — Sample data",
  labelEn: "Training Outcome Scorecard — Sample data",
  captionTh: "แม่แบบตารางผลลัพธ์ ช่องก่อนเรียน หลังเรียน และติดตามว่างไว้จนกว่าจะมีข้อมูลที่อนุมัติ",
  captionEn: "Sample outcome scorecard. Before, after, and follow-up cells stay empty until approved data exists.",
  altTh: "ภาพตัวอย่างตารางผลลัพธ์การอบรม ไม่ใช่คะแนนจริง รอตาราง HTML ที่แก้ไขได้",
  altEn: "Sample training outcome scorecard visual. Not live scores. Replace with the editable HTML scorecard.",
  sourceWidth: 1600,
  sourceHeight: 900,
  displayWidth: 720,
  displayHeight: 405,
} as const;

export const HOTEL_TRAINING_OUTCOME_FIELDS = {
  metric: { th: "ตัวชี้วัด", en: "Metric" },
  before: { th: "ก่อนเรียน", en: "Before training" },
  after: { th: "หลังเรียน", en: "After training" },
  follow: { th: "ติดตามที่หน้างาน", en: "Workplace follow-up" },
  definition: { th: "นิยาม", en: "Definition" },
  method: { th: "วิธีเก็บ", en: "Method" },
  reviewer: { th: "ผู้ทบทวน", en: "Reviewer" },
} as const;

export const HOTEL_TRAINING_OUTCOME_LEVELS = [
  {
    id: "immediate",
    titleTh: "ผลลัพธ์การเรียนรู้ทันที",
    titleEn: "Immediate learning outcomes",
    bodyTh: "ตรวจความรู้หรือทักษะ การแสดงในบทบาทสมมติ และการทำกิจกรรมให้ครบ ตามที่ออกแบบในงานนั้น",
    bodyEn: "Knowledge or skill checks, role-play performance, and activity completion, as designed for that job.",
  },
  {
    id: "workplace",
    titleTh: "การนำไปใช้ที่หน้างาน",
    titleEn: "Workplace application",
    bodyTh: "หัวหน้าสังเกตหลังเรียน การทำตาม SOP คุณภาพการส่งต่อ และการติดตามแผนปฏิบัติที่มีเจ้าของงานและวันนัด",
    bodyEn: "Manager observation after training, SOP adherence, handover quality, and follow-through on an action plan with an owner and a due date.",
  },
  {
    id: "business",
    titleTh: "ผลทางธุรกิจ",
    titleEn: "Business outcomes",
    bodyTh: "รายงานได้เมื่อมีแบบวัดที่เหมาะสมและข้อมูลที่ยืนยันแล้ว หน้านี้ไม่ใส่รายได้ ผลิตภาพ หรือคะแนนรีวิวที่ยังไม่ตรวจ",
    bodyEn: "Report only with a suitable measurement design and verified data. This page does not add revenue, productivity, or review-score claims.",
  },
] as const;

export const HOTEL_TRAINING_OUTCOME_LEVEL_IDS = HOTEL_TRAINING_OUTCOME_LEVELS.map((item) => item.id);

export const HOTEL_TRAINING_OUTCOMES = [
  {
    id: "attendance",
    level: "immediate",
    metricTh: "การเข้าเรียน / ทำครบ",
    metricEn: "Attendance / completion",
    beforeTh: "",
    beforeEn: "",
    afterTh: "",
    afterEn: "",
    followTh: "",
    followEn: "",
    definitionTh: "ผู้ที่เข้าเรียนและทำกิจกรรมครบตามที่ตกลง เก็บเป็นรายชื่อโรงแรม ไม่แสดงจำนวนบนหน้านี้",
    definitionEn: "People who attended and completed the agreed activity. The hotel keeps the list. This page does not show a headcount.",
    methodTh: "รายชื่อเข้าร่วมที่โรงแรมเก็บ",
    methodEn: "Attendance list kept by the hotel",
    reviewerTh: "ผู้จัดที่ระบุชื่อได้",
    reviewerEn: "Named organiser",
    sample: true,
  },
  {
    id: "knowledge",
    level: "immediate",
    metricTh: "ตรวจความรู้หรือทักษะ",
    metricEn: "Knowledge or skill check",
    beforeTh: "",
    beforeEn: "",
    afterTh: "",
    afterEn: "",
    followTh: "",
    followEn: "",
    definitionTh: "ใช้เมื่อมีการตรวจความรู้หรือทักษะจริงในงานนั้น หากไม่ได้ใช้ ให้ช่องว่างไว้",
    definitionEn: "Used only when a knowledge or skill check is actually part of that session. Leave empty if it is not used.",
    methodTh: "แบบตรวจสั้นก่อนหรือหลังเรียน ตามที่ออกแบบ",
    methodEn: "A short check before or after learning, if designed",
    reviewerTh: "วิทยากรหรือหัวหน้าที่ระบุชื่อได้",
    reviewerEn: "Named facilitator or supervisor",
    sample: true,
  },
  {
    id: "roleplay",
    level: "immediate",
    metricTh: "บทบาทสมมติ / สถานการณ์",
    metricEn: "Role-play / scenario checklist",
    beforeTh: "",
    beforeEn: "",
    afterTh: "",
    afterEn: "",
    followTh: "",
    followEn: "",
    definitionTh: "การแสดงในสถานการณ์งานตามรายการที่ตกลง ไม่ใช่คะแนนความมั่นใจสมมติ",
    definitionEn: "Performance on an agreed work scenario checklist. Not an invented confidence score.",
    methodTh: "รายการสังเกตระหว่างกิจกรรม",
    methodEn: "Observer checklist during the activity",
    reviewerTh: "ผู้สังเกตที่ระบุชื่อได้",
    reviewerEn: "Named observer",
    sample: true,
  },
  {
    id: "observation",
    level: "workplace",
    metricTh: "หัวหน้าสังเกตหลังเรียน",
    metricEn: "Manager observation after training",
    beforeTh: "",
    beforeEn: "",
    afterTh: "",
    afterEn: "",
    followTh: "",
    followEn: "",
    definitionTh: "หัวหน้าที่ระบุชื่อได้สังเกตการนำไปใช้ที่หน้างาน รวมการทำตาม SOP หากเป็นงานที่ตกลง",
    definitionEn: "A named manager observes on-the-job application, including SOP adherence when that is the agreed work.",
    methodTh: "บันทึกสังเกตสั้นหลังเรียน",
    methodEn: "A short observation note after training",
    reviewerTh: "หัวหน้างานที่ระบุชื่อได้",
    reviewerEn: "Named supervisor",
    sample: true,
  },
  {
    id: "handover",
    level: "workplace",
    metricTh: "คุณภาพการส่งต่อ",
    metricEn: "Handover quality",
    beforeTh: "",
    beforeEn: "",
    afterTh: "",
    afterEn: "",
    followTh: "",
    followEn: "",
    definitionTh: "ความครบของข้อมูลที่ส่งต่อระหว่างกะหรือระหว่างบทบาท ตามรายการที่ตกลง",
    definitionEn: "Completeness of information passed between shifts or roles, against an agreed checklist.",
    methodTh: "ตรวจรายการส่งต่อที่หน้างาน",
    methodEn: "On-the-job handover checklist",
    reviewerTh: "หัวหน้ากะที่ระบุชื่อได้",
    reviewerEn: "Named shift supervisor",
    sample: true,
  },
  {
    id: "actionplan",
    level: "workplace",
    metricTh: "แผนปฏิบัติที่มีเจ้าของและวันนัด",
    metricEn: "Action plan with owner and due date",
    beforeTh: "",
    beforeEn: "",
    afterTh: "",
    afterEn: "",
    followTh: "",
    followEn: "",
    definitionTh: "สิ่งที่จะทดลองใช้ มีเจ้าของงานและวันทบทวน ไม่ใช่ตัวเลขรายได้",
    definitionEn: "An action to try, with a named owner and a review date. Not a revenue figure.",
    methodTh: "แผนสั้นที่พากลับไปใช้ และนัดทบทวน",
    methodEn: "A short plan taken back to work, plus a review date",
    reviewerTh: "เจ้าของงานที่ระบุชื่อได้",
    reviewerEn: "Named owner",
    sample: true,
  },
  {
    id: "feedback",
    level: "workplace",
    metricTh: "ความเห็นผู้เรียน / หัวหน้า",
    metricEn: "Learner / manager feedback",
    beforeTh: "",
    beforeEn: "",
    afterTh: "",
    afterEn: "",
    followTh: "",
    followEn: "",
    definitionTh: "ความเห็นหลังเรียนเพื่อปรับปรุงงาน ไม่ใช่คะแนนความพึงพอใจที่ยังไม่ตรวจยืนยัน",
    definitionEn: "Comments after learning, used to improve the work. Not an unpublished satisfaction rating.",
    methodTh: "แบบสั้นหรือบันทึกพูดคุยที่ไมระบุตัวตนเมื่อเผยแพร่",
    methodEn: "A short form or conversation note, anonymised if published",
    reviewerTh: "ผู้จัดที่ระบุชื่อได้",
    reviewerEn: "Named organiser",
    sample: true,
  },
  {
    id: "business",
    level: "business",
    metricTh: "ผลทางธุรกิจ",
    metricEn: "Business result",
    beforeTh: "",
    beforeEn: "",
    afterTh: "",
    afterEn: "",
    followTh: "",
    followEn: "",
    definitionTh: "รายได้ คะแนนรีวิว ผลิตภาพ หรือตัวชี้วัดธุรกิจอื่น รายงานได้เมื่อมีแบบวัดที่เหมาะสมและข้อมูลที่ยืนยัน",
    definitionEn: "Revenue, review scores, productivity, or another business measure. Report only with a suitable measurement design and verified data.",
    methodTh: "ยังไม่ตั้งค่าจนกว่าจะมีแบบวัดที่ยืนยัน",
    methodEn: "Not set until a verified measurement design exists",
    reviewerTh: "ยังไม่กำหนด จนกว่าจะมีแบบวัด",
    reviewerEn: "Not assigned until a measurement design is agreed",
    sample: true,
  },
] as const;

export const HOTEL_TRAINING_FOLLOW_FIELDS = {
  field: { th: "ฟิลด์", en: "Field" },
  meaning: { th: "ความหมาย", en: "What it covers" },
  value: { th: "ค่าตัวอย่าง", en: "Sample value" },
} as const;

export const HOTEL_TRAINING_FOLLOW = [
  {
    id: "owner",
    labelTh: "เจ้าของงาน",
    labelEn: "Owner",
    meaningTh: "ตำแหน่งในโรงแรมที่เป็นเจ้าของการทดลองใช้หลังคลาส ไม่ใช่คะแนนพนักงานบนหน้านี้",
    meaningEn: "The hotel role that owns the post-class trial. Not an employee score on this page.",
    valueTh: "ตำแหน่งที่ระบุชื่อได้ — ตัวอย่าง",
    valueEn: "A named hotel role — Sample",
  },
  {
    id: "action",
    labelTh: "สิ่งที่จะทดลองใช้",
    labelEn: "Action to try",
    meaningTh: "ขั้นตอนงานที่ผู้เรียนจะทดลองใช้จริง ไม่ใช่คำรับประกันผลทางธุรกิจ",
    meaningEn: "The work step the learner will try on the job. Not a guaranteed business result.",
    valueTh: "ยังไม่ตั้งค่า — ตัวอย่าง",
    valueEn: "Not set — Sample",
  },
  {
    id: "support",
    labelTh: "ผู้สนับสนุนที่หน้างาน",
    labelEn: "On-the-job support",
    meaningTh: "หัวหน้าหรือผู้สนับสนุนที่หน้างานที่ช่วยสังเกตและให้คำแนะนำ",
    meaningEn: "The supervisor or on-the-job supporter who can observe and coach.",
    valueTh: "หัวหน้างานที่ระบุชื่อได้ — ตัวอย่าง",
    valueEn: "A named supervisor — Sample",
  },
  {
    id: "review",
    labelTh: "จุดทบทวน",
    labelEn: "Review point",
    meaningTh: "วันหรือจุดที่ตกลงกันเพื่อทบทวนว่าได้ทดลองใช้หรือยัง",
    meaningEn: "The agreed date or moment to check whether the action was tried.",
    valueTh: "ยังไม่ตั้งค่า — ตัวอย่าง",
    valueEn: "Not set — Sample",
  },
  {
    id: "privacy",
    labelTh: "ข้อมูลที่ต้องกันไว้",
    labelEn: "Data kept private",
    meaningTh: "คะแนนรายบุคคล ชื่อพนักงาน และข้อมูลแขกเก็บที่โรงแรม ไม่แสดงบนหน้านี้",
    meaningEn: "Individual scores, employee names, and guest data stay with the hotel and are not shown here.",
    valueTh: "คะแนนรายบุคคล ชื่อพนักงาน ข้อมูลแขก",
    valueEn: "Individual scores, employee names, guest data",
  },
] as const;

export const HOTEL_TRAINING_TRAINER_FIELDS = {
  role: { th: "บทบาท", en: "Name and role" },
  experience: { th: "ประสบการณ์โรงแรม / การอบรม", en: "Relevant hotel / training experience" },
  topics: { th: "หัวข้อที่เชี่ยวชาญ", en: "Topics of expertise" },
  format: { th: "รูปแบบการดำเนินกิจกรรม", en: "Facilitation / workshop format" },
  engagements: { th: "ตัวอย่างผู้เรียนที่เผยแพร่ได้", en: "Publishable learner audiences" },
  qualifications: { th: "วุฒิบัตรที่ยืนยันแล้ว", en: "Verified qualifications" },
  languages: { th: "ภาษาที่ใช้สอน", en: "Teaching languages" },
} as const;

export const HOTEL_TRAINING_TRAINER = {
  roleTh: "ผู้ก่อตั้ง และผู้นำงานด้าน Training ของ เดอะ เคพีไอ พลัส",
  roleEn: "Founder, and leads Training at The KPI Plus",
  experienceTh: "มีประสบการณ์ด้าน Guest Relations และ Front Office และเคยบรรยายและจัดกิจกรรมเตรียมความพร้อมในธุรกิจบริการ",
  experienceEn: "Guest-relations and front-office experience, including lectures and readiness activities in hospitality",
  topics: [
    { th: "Guest Relations", en: "Guest Relations" },
    { th: "Front Office", en: "Front Office" },
    { th: "กิจกรรมเตรียมความพร้อมของทีมโรงแรม", en: "Hotel team readiness activities" },
  ],
  formatTh: "บรรยาย เวิร์กช็อป และการอำนวยกิจกรรมที่ออกแบบจากงานจริง",
  formatEn: "Lectures, workshops, and facilitation designed from real work",
  engagementsTh: "ผู้เข้าร่วมเวิร์กช็อป hospitality และกิจกรรมเตรียมความพร้อมของทีมโรงแรม ไม่ระบุชื่อโรงแรมหากยังไม่อนุมัติ",
  engagementsEn: "Hospitality workshop participants and in-house hotel team readiness sessions. Hotel names appear only when publication is approved.",
  qualificationsTh: "",
  qualificationsEn: "",
  languagesTh: "",
  languagesEn: "",
  sample: true,
} as const;

export const HOTEL_TRAINING_GALLERY_PLACEHOLDER = {
  src: "/images/training/gallery/training-session-placeholder-01.webp",
  labelTh: "ตัวอย่างแกลเลอรีงานอบรม — เปลี่ยนเป็นภาพจริงที่ได้รับอนุญาต",
  labelEn: "Training Gallery Placeholder — replace with approved real photo",
  altTh: "ภาพตัวอย่างแกลเลอรีงานอบรม ไม่ใช่ภาพผู้เข้าร่วมจริง รอภาพจริงที่ได้รับอนุญาต",
  altEn: "Training Gallery Placeholder — replace with approved real photo",
  captionTh: "ตัวอย่างแกลเลอรีงานอบรม — เปลี่ยนเป็นภาพจริงที่ได้รับอนุญาต",
  captionEn: "Training Gallery Placeholder — replace with approved real photo",
  sourceWidth: 1200,
  sourceHeight: 900,
  displayWidth: 360,
  displayHeight: 270,
} as const;

export const HOTEL_TRAINING_GALLERY = [
  {
    id: "group",
    src: "/images/training/gallery/hospitality-training-workshop-group.webp",
    sourceSrc: HOTEL_TRAINING_PHOTOS.group,
    altTh: "ผู้เข้าร่วมยืนถ่ายภาพกลุ่มหลังงานอบรม hospitality ในห้องเรียน",
    altEn: "Participants standing together after a hospitality training workshop in a classroom",
    captionTh: "งานอบรม hospitality สำหรับผู้เข้าร่วม — ภาพกลุ่มหลังเวิร์กช็อปในห้องเรียน",
    captionEn: "Hospitality training for participants — group photo after a classroom workshop",
    publicationApproved: true,
  },
  {
    id: "circle",
    src: "/images/training/gallery/hotel-team-workshop-circle.webp",
    sourceSrc: HOTEL_TRAINING_PHOTOS.circle,
    altTh: "วิทยากรและทีมโรงแรมนั่งวงสนทนาในเวิร์กช็อปในองค์กร",
    altEn: "A facilitator and an in-house hotel team in a circle discussion during a workshop",
    captionTh: "เวิร์กช็อปทีมโรงแรมในองค์กร — กิจกรรมกลุ่มนั่งวงสนทนา",
    captionEn: "In-house hotel team workshop — circle discussion activity",
    publicationApproved: true,
  },
  {
    id: "facilitation",
    src: "/images/training/gallery/hospitality-workshop-facilitation.webp",
    sourceSrc: HOTEL_TRAINING_PHOTOS.speaking,
    altTh: "คุณเนตรถือไมค์บรรยายในเวิร์กช็อป hospitality",
    altEn: "Khun Nate holding a microphone during a hospitality workshop",
    captionTh: "วิทยากรบรรยายในเวิร์กช็อป hospitality สำหรับผู้เข้าร่วม",
    captionEn: "Facilitator speaking at a hospitality workshop for participants",
    publicationApproved: true,
  },
  {
    id: "readiness",
    src: "/images/training/gallery/readiness-workshop-speaking.webp",
    sourceSrc: HOTEL_TRAINING_PHOTOS.workshop,
    altTh: "คุณเนตรถือไมค์บรรยายในเวิร์กช็อปเตรียมความพร้อมของทีม",
    altEn: "Khun Nate speaking into a microphone at a team readiness workshop",
    captionTh: "วิทยากรบรรยายในเวิร์กช็อปเตรียมความพร้อมของทีม",
    captionEn: "Facilitator speaking at a team readiness workshop",
    publicationApproved: true,
  },
] as const;

export function hotelTrainingSrcUsedInGallery(src?: string) {
  const next = src?.trim() || "";
  if (!next || hotelTrainingIsLibraryPlaceholder(next)) return false;
  if (
    next === HOTEL_TRAINING_PHOTOS.group ||
    next === HOTEL_TRAINING_PHOTOS.circle ||
    next === HOTEL_TRAINING_PHOTOS.speaking ||
    next === HOTEL_TRAINING_PHOTOS.workshop
  ) {
    return true;
  }
  return HOTEL_TRAINING_GALLERY.some((item) => item.src === next || item.sourceSrc === next);
}

export function hotelTrainingConsentLabel(status: string | undefined, locale: Locale) {
  const thai = locale === "th";
  switch (status) {
    case "approved":
      return thai ? "ความยินยอมเผยแพร่: ได้รับแล้ว" : "Publication consent: approved";
    case "pending":
      return thai ? "ความยินยอมเผยแพร่: รอดำเนินการ" : "Publication consent: pending";
    case "redacted":
      return thai ? "ความยินยอมเผยแพร่: ปกปิดข้อมูล" : "Publication consent: redacted";
    default:
      return thai ? "ความยินยอมเผยแพร่: ยังไม่มี" : "Publication consent: not yet recorded";
  }
}

export function hotelTrainingRedactionLabel(
  item?: { redactionChecked?: boolean; redactionNote?: string; placeholder?: boolean },
  locale: Locale = "th",
) {
  const thai = locale === "th";
  if (item?.placeholder || item?.redactionChecked === false) {
    return thai ? "การปกปิดข้อมูล: ยังไม่ตรวจ" : "Redaction: not yet checked";
  }
  const note = item?.redactionNote?.trim();
  if (note) return thai ? `การปกปิดข้อมูล: ${note}` : `Redaction: ${note}`;
  return thai
    ? "การปกปิดข้อมูล: ตรวจแล้ว ไม่แสดงชื่อโรงแรมหรือโลโก้ลูกค้าที่ไม่อนุมัติ"
    : "Redaction: checked — unapproved hotel names and client logos are not shown";
}

export function hotelTrainingGalleryMayPublish(item?: {
  src?: string;
  publicationApproved?: boolean;
  consentStatus?: string;
  redactionChecked?: boolean;
  status?: string;
}) {
  const src = item?.src?.trim() || "";
  if (!src || hotelTrainingIsLibraryPlaceholder(src)) return false;
  if (item?.publicationApproved !== true) return false;
  if (item?.status === "sample" || item?.status === "replace") return false;
  if (item?.consentStatus !== "approved") return false;
  if (item?.redactionChecked === false) return false;
  return true;
}

export function hotelTrainingGalleryPublicSrc(item?: {
  src?: string;
  publicationApproved?: boolean;
  consentStatus?: string;
  redactionChecked?: boolean;
  status?: string;
}) {
  const src = item?.src?.trim() || "";
  if (!hotelTrainingGalleryMayPublish(item)) return HOTEL_TRAINING_GALLERY_PLACEHOLDER.src;
  return src;
}

export function hotelTrainingResolveGalleryItem(
  item: {
    id: string;
    src?: string;
    altTh: string;
    altEn: string;
    captionTh: string;
    captionEn: string;
    publicationApproved?: boolean;
    consentStatus?: string;
    redactionChecked?: boolean;
    redactionNote?: string;
    status?: string;
    topicTh?: string;
    topicEn?: string;
    year?: string;
    dateLabel?: string;
  },
  locale: Locale,
) {
  const src = hotelTrainingGalleryPublicSrc(item);
  const placeholder = src === HOTEL_TRAINING_GALLERY_PLACEHOLDER.src;
  const consentLabel = hotelTrainingConsentLabel(placeholder ? "none" : item.consentStatus, locale);
  const redactionLabel = hotelTrainingRedactionLabel(
    placeholder ? { placeholder: true, redactionChecked: false } : item,
    locale,
  );
  return {
    id: item.id,
    src,
    alt: placeholder
      ? locale === "th"
        ? HOTEL_TRAINING_GALLERY_PLACEHOLDER.altTh
        : HOTEL_TRAINING_GALLERY_PLACEHOLDER.altEn
      : locale === "th"
        ? item.altTh
        : item.altEn,
    caption: placeholder
      ? locale === "th"
        ? HOTEL_TRAINING_GALLERY_PLACEHOLDER.captionTh
        : HOTEL_TRAINING_GALLERY_PLACEHOLDER.captionEn
      : [locale === "th" ? item.topicTh : item.topicEn, item.dateLabel || item.year, locale === "th" ? item.captionTh : item.captionEn]
          .map((part) => part?.trim())
          .filter(Boolean)
          .join(" · "),
    consentLabel,
    redactionLabel,
    placeholder,
  };
}

export function hotelTrainingNeedsPublicSrc(visual?: { src?: string; status?: string; publicationApproved?: boolean }) {
  const src = visual?.src?.trim() || "";
  if (!src || hotelTrainingIsLibraryPlaceholder(src)) return "";
  if (hotelTrainingSrcUsedInGallery(src)) return "";
  if (String(visual?.status) !== "approved" || !visual?.publicationApproved) return "";
  return src;
}

export const HOTEL_TRAINING_PARTNERS = [
  { name: "NAWA", src: "/brand/partners/nawa.png", href: "https://www.nawaone.co/en", alt: "NAWA Smartest Hospitality Platform", width: 180, height: 64 },
  { name: "The KPI Plus Academy", src: "/brand/KPIPlus_Horizontal_FullColor.png", href: HOTEL_TRAINING_ACADEMY_HOME, alt: "The KPI Plus Academy", width: 180, height: 64 },
  { name: "Australia Smart", src: "/brand/partners/australia-smart.png", href: "https://www.australiasmart.com.au", alt: "Australia Smart Edu Biz Coach", width: 180, height: 64 },
] as const;

export const HOTEL_TRAINING_PROGRAM_FIELDS = {
  audience: { th: "ผู้เข้าร่วม / บทบาท", en: "Audience / role" },
  problem: { th: "ทักษะหรือปัญหาที่ต้องการแก้", en: "Skill / problem addressed" },
  outcomes: { th: "ผลลัพธ์การเรียนรู้", en: "Learning outcomes" },
  format: { th: "รูปแบบ", en: "Format" },
  duration: { th: "ระยะเวลา", en: "Duration" },
  groupSize: { th: "ขนาดกลุ่ม", en: "Group size" },
  activity: { th: "กิจกรรมหรือชิ้นงานของผู้เข้าร่วม", en: "Participant activity / artefact" },
  assess: { th: "การประเมินและการติดตาม", en: "Assessment / follow-up" },
} as const;

export const HOTEL_TRAINING_FAQS = [
  {
    id: "custom",
    qTh: "สามารถออกแบบหลักสูตรตามความต้องการของโรงแรมได้หรือไม่",
    qEn: "Can the programme be designed around the hotel’s needs?",
    aTh: "ได้ งานอบรมเฉพาะองค์กรเริ่มจากเป้าหมาย กลุ่มผู้เรียน และงานจริงของโรงแรมนั้น ไม่เริ่มจากแคตตาล็อกหลักสูตรสำเร็จรูป เดอะ เคพีไอ พลัส Academy เป็นช่องทางแยก สำหรับหลักสูตรและกิจกรรมตามหัวข้อที่มีใน Academy",
    aEn: "Yes. In-house training starts from that hotel’s goal, learner group, and real work—not from a ready-made course catalogue. The KPI Plus Academy is a separate path for courses and events the Academy actually lists.",
  },
  {
    id: "teams",
    qTh: "รองรับทีม/แผนกใดบ้าง",
    qEn: "Which teams or departments can join?",
    aTh: "ขึ้นกับงานที่อยากให้ทำได้ดีขึ้น ตัวอย่างบนหน้านี้มี Front Office / Guest Service, Reservations, Revenue, Sales / Marketing และหัวหน้างานหรือผู้จัดการ บทบาทอื่นคุยจากโจทย์ได้ ไม่มีขนาดกลุ่มมาตรฐานของทุกงาน",
    aEn: "It depends on the work that should get better. Examples on this page include Front Office / Guest Service, Reservations, Revenue, Sales / Marketing, and supervisors or managers. Other roles can be discussed from the brief. There is no standard class size for every job.",
  },
  {
    id: "formats",
    qTh: "จัดอบรมแบบ In-house, Workshop, Coaching หรือ Online ได้หรือไม่",
    qEn: "Can it be In-house, a Workshop, Coaching, or Online?",
    aTh: "หน้านี้เปิดรับ In-house Training, Workshop และ Team Building ที่เชื่อมกับงาน Online ใช้หลักสูตรและกิจกรรมของ The KPI Plus Academy ตามที่ Academy แสดง Coaching เป็นรูปแบบที่คุยได้จากโจทย์ หน้านี้ไม่มีแคตตาล็อก Coaching สำเร็จรูป",
    aEn: "This page offers In-house Training, Workshop, and Team Building connected to work. Online learning uses courses and events listed by The KPI Plus Academy. Coaching can be discussed from the brief; this page does not publish a ready-made Coaching catalogue.",
  },
  {
    id: "duration",
    qTh: "ใช้เวลาฝึกอบรมเท่าไร",
    qEn: "How long does the training take?",
    aTh: "ระยะเวลาตกลงจากโจทย์ ผู้เข้าร่วม และเวลาที่ทีมมี หน้านี้ไม่ประกาศจำนวนวันหรือชั่วโมงสำเร็จรูป",
    aEn: "Duration is agreed from the brief, the participants, and the time the team has. This page does not publish a standard number of days or hours.",
  },
  {
    id: "assessment",
    qTh: "มีการประเมินก่อน/หลังอบรมหรือไม่",
    qEn: "Is there assessment before or after training?",
    aTh: "ไม่ใช่ทุกงานมีแบบประเมินก่อนและหลังอัตโนมัติ เมื่ออยู่ในแพ็กเกจที่เลือก วิธีประเมินตามเป้าหมายที่ตกลง เช่น การเข้าร่วม ชิ้นงานฝึก หรือการตรวจความรู้หรือทักษะหากออกแบบไว้ คะแนนรายบุคคลไม่แสดงบนหน้าสาธารณะ",
    aEn: "Not every job includes an automatic pre- and post-test. When it is in the selected package, the method follows the agreed goal—for example participation, a practice artefact, or a knowledge/skill check if designed. Individual scores are not shown on this public page.",
  },
  {
    id: "scenarios",
    qTh: "ใช้ SOP หรือสถานการณ์จริงของโรงแรมเป็นโจทย์ได้หรือไม่",
    qEn: "Can the hotel’s SOP or real workplace situations be used?",
    aTh: "ได้ ออกแบบจากงานจริงของโรงแรมนั้น รวมการฝึกที่เกี่ยวกับ SOP หรือสถานการณ์ใกล้งาน โดยไม่ใช้ข้อมูลแขกจริง ข้อมูลการจองจริง หรือคะแนนพนักงาน",
    aEn: "Yes. Sessions are designed from that hotel’s real work, including SOP-related practice or workplace scenarios, without using real guest data, live reservation records, or employee scores.",
  },
  {
    id: "followup",
    qTh: "มีการติดตามผลหลังอบรมอย่างไร",
    qEn: "How is follow-up after training handled?",
    aTh: "การติดตามมีเมื่อแพ็กเกจที่เลือกมีเจ้าของงาน สิ่งที่จะทดลองใช้ และจุดทบทวนที่ตกลงก่อนเริ่ม ไม่ใช่แพ็กเกจเดียวทุกงาน และไม่ใช่คำรับประกันผลทางธุรกิจ",
    aEn: "Follow-up is included when the selected package has an owner, the action to try, and a review point agreed before the work starts. It is not one package for every job, and it is not a guaranteed business result.",
  },
  {
    id: "coordinator",
    qTh: "ต้องมีผู้ประสานงานจากโรงแรมหรือไม่",
    qEn: "Does the hotel need a coordinator?",
    aTh: "ต้องมีผู้ติดต่อของโรงแรมที่ระบุชื่อได้ เพื่อบอกเป้าหมาย ยืนยันกลุ่มผู้เรียน และตกลงขอบเขตกับขั้นตอนถัดไป หน้านี้ไม่กำหนดตำแหน่งเฉพาะ",
    aEn: "A named hotel contact is needed to share the goal, confirm the learner group, and agree scope and the next step. This page does not require a specific job title.",
  },
  {
    id: "language",
    qTh: "รองรับภาษาไทย/อังกฤษหรือไม่",
    qEn: "Is Thai or English supported?",
    aTh: "หน้าสาธารณะมีภาษาไทยเป็นค่าเริ่มต้น และมีภาษาอังกฤษ ภาษาที่ใช้สอนในรอบนั้นตกลงจากโจทย์ หน้านี้ยังไม่ประกาศรายการภาษาสอนที่รับประกัน",
    aEn: "The public page is in Thai by default, with an English version. The teaching language for a session is agreed from the brief. This page does not publish a guaranteed teaching-language list.",
  },
  {
    id: "certificate",
    qTh: "มีใบรับรองหรือไม่",
    qEn: "Is there a certificate?",
    aTh: "หน้านี้ไม่ออกและไม่โฆษณาใบรับรอง หลักสูตรหรือกิจกรรมของ Academy เป็นไปตามที่หลักสูตรนั้นกำหนด หน้านี้ไม่สร้างใบรับรองแทน Academy",
    aEn: "This page does not issue or advertise a certificate. Academy courses or events follow whatever that course specifies. This page does not invent a certificate on the Academy’s behalf.",
  },
  {
    id: "privacy",
    qTh: "ดูแลความลับของข้อมูลและผู้เข้าร่วมอย่างไร",
    qEn: "How are participant and hotel data kept private?",
    aTh: "ฟอร์มสาธารณะไม่ขอรายชื่อพนักงาน รหัสพนักงาน คะแนนประเมินรายบุคคล หรือข้อมูลแขก โรงแรมเป็นเจ้าของข้อมูลปฏิบัติการ จุดเข้าถึงและผู้ตรวจทานตกลงก่อนเริ่ม",
    aEn: "The public form does not ask for employee names, staff IDs, individual assessment scores, or guest data. The hotel owns operational data. Access and reviewers are agreed before work starts.",
  },
  {
    id: "hotels",
    qTh: "อบรมเฉพาะโรงแรมหรือไม่?",
    qEn: "Is this only for hotels?",
    aTh: "ออกแบบมาสำหรับโรงแรมและธุรกิจบริการเป็นหลัก องค์กรบริการอื่นใช้แนวทางเดียวกันได้เมื่อมีงานจริง บทบาท และผู้รับผิดชอบ",
    aEn: "It is designed mainly for hotels and service businesses. Other service organisations can use the same approach when there is real work, roles, and an owner.",
  },
  {
    id: "academy",
    qTh: "อบรมเฉพาะองค์กรต่างจาก The KPI Plus Academy อย่างไร?",
    qEn: "How is in-house training different from The KPI Plus Academy?",
    aTh: "การอบรมเฉพาะองค์กรเริ่มจากโจทย์ ผู้เข้าร่วม และงานของทีมนั้น Academy มีหลักสูตรและกิจกรรมตามหัวข้อให้เลือก และมีช่องทางปรึกษาการอบรมสำหรับองค์กรด้วย หน้านี้ไม่ใช่แคตตาล็อกหลักสูตรสำเร็จรูป",
    aEn: "In-house training starts from that team’s brief, participants, and work. The Academy has courses and events by topic, and a path for organisations that want team training. This page is not a ready-made course catalogue.",
  },
  {
    id: "outcomes",
    qTh: "อบรมแล้วรายได้หรือคะแนนรีวิวจะดีขึ้นหรือไม่?",
    qEn: "Will training raise revenue or review scores?",
    aTh: "ไม่รับประกัน หน้านี้ไม่ใช้การอบรมเป็นคำสัญญาเรื่องรายได้ คะแนนรีวิว ผลิตภาพ หรือความพึงพอใจของแขก หากจะวัดผลทางธุรกิจ ต้องมีนิยาม ช่วงวัด แหล่งข้อมูล และผู้ทบทวนที่ตกลงไว้ก่อน",
    aEn: "No guarantee. This page does not treat training as a promise of revenue, review scores, productivity, or guest satisfaction. A business measure needs an agreed definition, period, source, and reviewer first.",
  },
  {
    id: "trainer",
    qTh: "ต้องมีวิทยากรคนเดียวหรือไม่?",
    qEn: "Is there only one trainer?",
    aTh: "งานด้าน Training ของเพจนี้แนะนำโดยคุณเนตรนภิส อิสรนิรันดร์ หัวข้อ รูปแบบ และผู้ร่วมดำเนินกิจกรรมปรับตามโจทย์ หน้านี้ไม่สร้างรายชื่อวิทยากรหรือวุฒิบัตรที่ไม่มีในข้อมูลที่อนุมัติ",
    aEn: "Training on this page is led by Natenapit Isaraniran (Nate). Topic, format, and any co-facilitation follow the brief. This page does not invent extra trainer names or certificates.",
  },
] as const;

export function hotelTrainingFaqs(locale: Locale): FaqItem[] {
  const thai = locale === "th";
  return HOTEL_TRAINING_FAQS.map((item) => ({
    q: thai ? item.qTh : item.qEn,
    a: thai ? item.aTh : item.aEn,
  }));
}

export function hotelTrainingFaqsAreStale(items: Array<{ q: string; a: string }>) {
  if (items.length !== HOTEL_TRAINING_FAQS.length) return true;
  const questions = items.map((item) => item.q.trim());
  return !HOTEL_TRAINING_FAQS.every((item) => questions.includes(item.qTh) || questions.includes(item.qEn));
}

export const HOTEL_TRAINING_RELATED_VISUAL = {
  src: "/images/hotel-training-related-content-placeholder.webp",
  labelTh: "Training Guide / Academy Course — Sample Cover",
  labelEn: "Training Guide / Academy Course — Sample Cover",
  captionTh: "ปกตัวอย่างคู่มือหรือหลักสูตร Academy ไม่ใช่ภาพคน และไม่ใช่ไฟล์ดาวน์โหลด",
  captionEn: "Sample training-guide or Academy-course cover. Not a people photo, and not a downloadable file.",
  altTh: "ปกตัวอย่าง Training Guide หรือหลักสูตร Academy สีพื้นและตัวย่อ KP ไม่ใช่ภาพผู้เข้าร่วม",
  altEn: "Sample Training Guide / Academy Course cover with a colour block and KP initials. Not a participant photo.",
  sourceWidth: 1200,
  sourceHeight: 800,
  displayWidth: 360,
  displayHeight: 240,
} as const;

export const HOTEL_TRAINING_RELATED_COVER_ITEMS = [
  { id: "meetings", label: "Revenue meetings" },
  { id: "tech", label: "Technology and AI" },
  { id: "academy", label: "Academy courses" },
] as const;

export type HotelTrainingRelatedCard = {
  id: string;
  href: string;
  featured?: boolean;
  external?: boolean;
  categoryTh: string;
  categoryEn: string;
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  publishedAt?: string;
  updatedAt?: string;
  dateKind?: "published" | "updated" | string;
  contentTypeTh: string;
  contentTypeEn: string;
  ctaTh: string;
  ctaEn: string;
};

export function hotelTrainingRelatedDateLabel(card: HotelTrainingRelatedCard, locale: Locale) {
  const iso = card.dateKind === "updated" ? card.updatedAt || card.publishedAt : card.publishedAt;
  if (!iso) return "";
  const prefix = card.dateKind === "updated" ? (locale === "th" ? "อัปเดต" : "Updated") : locale === "th" ? "เผยแพร่" : "Published";
  return `${prefix} ${formatInsightDate(iso, locale)}`;
}

export function hotelTrainingRelatedCards(locale: Locale): HotelTrainingRelatedCard[] {
  const cards: HotelTrainingRelatedCard[] = [];
  const used = new Set<string>();

  const push = (card: HotelTrainingRelatedCard | null) => {
    if (!card || used.has(card.href)) return;
    const href = card.external ? card.href : existingHref(card.href, locale) || existingHref(card.href, "th") || "";
    if (!href || used.has(href)) return;
    used.add(href);
    cards.push({ ...card, href });
  };

  const meetings = insightPosts.find((post) => post.id === "hotel-revenue-meetings-that-lead-to-decisions" && post.isPublished !== false);
  const tech = insightPosts.find((post) => post.id === "hotel-technology-adoption-commercial-project" && post.isPublished !== false);

  if (meetings) {
    const updated = insightUpdatedAt(meetings);
    push({
      id: "meetings",
      href: meetings.href,
      featured: true,
      categoryTh: meetings.category.th,
      categoryEn: meetings.category.en,
      titleTh: meetings.title.th,
      titleEn: meetings.title.en,
      descriptionTh: insightExcerpt(meetings, "th"),
      descriptionEn: insightExcerpt(meetings, "en"),
      publishedAt: meetings.publishedAt,
      updatedAt: updated || undefined,
      dateKind: updated ? "updated" : "published",
      contentTypeTh: "บทความ",
      contentTypeEn: "Article",
      ctaTh: "อ่านบทความ",
      ctaEn: "Read article",
    });
  }

  if (tech) {
    const updated = insightUpdatedAt(tech);
    push({
      id: "tech",
      href: tech.href,
      categoryTh: tech.category.th,
      categoryEn: tech.category.en,
      titleTh: tech.title.th,
      titleEn: tech.title.en,
      descriptionTh: insightExcerpt(tech, "th"),
      descriptionEn: insightExcerpt(tech, "en"),
      publishedAt: tech.publishedAt,
      updatedAt: updated || undefined,
      dateKind: updated ? "updated" : "published",
      contentTypeTh: "บทความ",
      contentTypeEn: "Article",
      ctaTh: "อ่านบทความ",
      ctaEn: "Read article",
    });
  }

  push({
    id: "revenue",
    href: "/solutions/revenue-commercial-management",
    categoryTh: "โซลูชัน",
    categoryEn: "Solution",
    titleTh: solutionNavLabel("/solutions/revenue-commercial-management", "th"),
    titleEn: solutionNavLabel("/solutions/revenue-commercial-management", "en"),
    descriptionTh: "เชื่อมการบริหารรายได้กับ Demand, ราคา, ช่องทางขาย และการจองตรง ให้อยู่ในมุมมองเดียวก่อนตัดสินใจ",
    descriptionEn: "Rate, demand, channels, and commercial decisions sit in one view before the team acts.",
    contentTypeTh: "คู่มือ",
    contentTypeEn: "Guide",
    ctaTh: "ดูรายละเอียด",
    ctaEn: "See details",
  });

  push({
    id: "ai",
    href: "/solutions/hotel-ai-automation",
    categoryTh: "โซลูชัน",
    categoryEn: "Solution",
    titleTh: solutionNavLabel("/solutions/hotel-ai-automation", "th"),
    titleEn: solutionNavLabel("/solutions/hotel-ai-automation", "en"),
    descriptionTh: "งานเริ่มจากเวิร์กโฟลว์จริงและปัญหาทางธุรกิจ ไม่ได้เริ่มจากการเลือกเครื่องมือก่อน",
    descriptionEn: "Work starts from a real workflow and a business problem, not from selecting a tool first.",
    contentTypeTh: "คู่มือ",
    contentTypeEn: "Guide",
    ctaTh: "ดูรายละเอียด",
    ctaEn: "See details",
  });

  push({
    id: "academy",
    href: HOTEL_TRAINING_ACADEMY_DISCOVER,
    external: true,
    categoryTh: "The KPI Plus Academy",
    categoryEn: "The KPI Plus Academy",
    titleTh: "หลักสูตรและกิจกรรมของ The KPI Plus Academy",
    titleEn: "Courses and events at The KPI Plus Academy",
    descriptionTh: "หลักสูตร เวิร์กช็อป และกิจกรรมสำหรับผู้ที่ต้องการพัฒนาทักษะด้วยตนเอง รวมหัวข้อด้าน AI และทักษะดิจิทัล",
    descriptionEn: "Courses, workshops, and events for people developing skills themselves, including AI and digital-skill topics.",
    contentTypeTh: "หลักสูตร",
    contentTypeEn: "Course",
    ctaTh: "ดูหลักสูตรและกิจกรรม",
    ctaEn: "See courses and events",
  });

  return cards;
}

export const HOTEL_TRAINING_ENQUIRY_VISUAL = {
  src: "/images/hotel-training-contact-process-placeholder.webp",
  labelTh: "What Happens Next — Sample process",
  labelEn: "What Happens Next — Sample process",
  statusTh: "Sample process · Not a live training booking",
  statusEn: "Sample process · Not a live training booking",
  captionTh: "ลำดับตัวอย่างหลังส่งคำขอ ไม่ต้องส่งรายชื่อพนักงาน คะแนนประเมิน หรือข้อมูลแขก",
  captionEn: "A sample sequence after you send the request. Do not send employee names, assessment scores, or guest data.",
  altTh: "แผนภาพตัวอย่างหลังส่งคำขอ จากเป้าหมาย ไปทักษะ ไปรูปแบบ แล้วยืนยันขอบเขต",
  altEn: "Sample What Happens Next process: Goal, Skill, Format, then Confirm.",
  sourceWidth: 1200,
  sourceHeight: 600,
  displayWidth: 420,
  displayHeight: 210,
} as const;

export const HOTEL_TRAINING_ENQUIRY_FLOW = [
  { id: "goal", label: "Goal" },
  { id: "skill", label: "Skill" },
  { id: "format", label: "Format" },
  { id: "confirm", label: "Confirm" },
] as const;

export const HOTEL_TRAINING_ENQUIRY_FORMATS = [
  { id: "in_house", th: "อบรมในองค์กร", en: "In-house" },
  { id: "workshop", th: "เวิร์กช็อป", en: "Workshop" },
  { id: "coaching", th: "Coaching", en: "Coaching" },
  { id: "online", th: "ออนไลน์", en: "Online" },
  { id: "not_sure", th: "ยังไม่แน่ใจ", en: "Not sure" },
] as const;

export const HOTEL_TRAINING_ENQUIRY_GOALS = HOTEL_TRAINING_ENQUIRY_FORMATS;

export function hotelTrainingGoalLabel(id: string, locale: Locale) {
  const goal = HOTEL_TRAINING_ENQUIRY_FORMATS.find((item) => item.id === id);
  if (!goal) return "";
  return locale === "th" ? goal.th : goal.en;
}

export function composeHotelTrainingEnquiryMessage(
  state: {
    topic: string;
    message: string;
    scope: string;
    channels?: string;
    market?: string;
    goal: string;
    timeline?: string;
  },
  locale: Locale,
) {
  const thai = locale === "th";
  const format = hotelTrainingGoalLabel(state.goal, locale);
  return [
    state.message.trim()
      ? thai
        ? `ทักษะหรืองานที่อยากพัฒนา: ${state.message.trim()}`
        : `Skill / topic to develop: ${state.message.trim()}`
      : "",
    state.market?.trim()
      ? thai
        ? `ผลที่อยากเห็นหลังอบรม: ${state.market.trim()}`
        : `Desired outcome after training: ${state.market.trim()}`
      : "",
    state.channels?.trim()
      ? thai
        ? `บทบาทหรือทีมผู้เรียน ไม่ระบุรายชื่อ: ${state.channels.trim()}`
        : `Learner roles / team, no names: ${state.channels.trim()}`
      : "",
    state.topic.trim() ? (thai ? `แผนกหรือบทบาทผู้ติดต่อ: ${state.topic.trim()}` : `Contact role / department: ${state.topic.trim()}`) : "",
    state.scope.trim()
      ? thai
        ? `จำนวนผู้เรียนโดยประมาณ ไม่ระบุรายชื่อ: ${state.scope.trim()}`
        : `Approximate number of learners, no names: ${state.scope.trim()}`
      : "",
    format ? (thai ? `รูปแบบที่ต้องการ: ${format}` : `Preferred format: ${format}`) : "",
    state.timeline?.trim() ? (thai ? `ช่วงเวลาที่ต้องการ: ${state.timeline.trim()}` : `Preferred timing: ${state.timeline.trim()}`) : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

const SECRET_ASSIGN =
  /(api[_-\s]?key|secret[_-\s]?key|password|passwd|employee[_-\s]?id|staff[_-\s]?id|assessment\s+score|guest\s+(name|email|phone|data)|รหัสผ่าน|รหัสพนักงาน|คะแนนประเมิน)\s*[:=]\s*\S+/i;
const SECRET_TOKEN = /\b(sk_live_[A-Za-z0-9]+|pk_live_[A-Za-z0-9]+|Bearer\s+[A-Za-z0-9\-._]{12,})\b/;

export function hotelTrainingEnquiryHasSecrets(value: string) {
  SECRET_ASSIGN.lastIndex = 0;
  SECRET_TOKEN.lastIndex = 0;
  return SECRET_ASSIGN.test(value) || SECRET_TOKEN.test(value);
}

export function hotelTrainingEnquiryCopy(locale: Locale) {
  const thai = locale === "th";
  return {
    heading: thai ? "ส่งคำขอเรื่องพัฒนาทีม" : "Send a team-development request",
    lead: thai
      ? "บอกเป้าหมายการอบรม กลุ่มผู้เรียน และทักษะที่อยากพัฒนา ไม่ต้องส่งรายชื่อพนักงาน คะแนนประเมินรายบุคคล หรือข้อมูลแขก"
      : "Share the training goal, the learner group, and the skill to develop. Do not send employee names, individual assessment scores, or guest data.",
    nextTitle: "What Happens Next",
    steps: thai
      ? [
          "บอกเป้าหมายการอบรมและกลุ่มผู้เรียน",
          "คุยทักษะหรืองานที่ติดที่หน้างาน",
          "ตกลงรูปแบบที่เหมาะ และแนวทางประเมิน/ติดตาม",
          "ยืนยันขอบเขต ตารางเวลา เจ้าของงาน และขั้นตอนถัดไป",
        ]
      : [
          "Share the training goal and learner group.",
          "Discuss the relevant skill or workplace challenge.",
          "Agree on a suitable format and assessment/follow-up approach.",
          "Confirm scope, schedule, owner, and next step.",
        ],
    note: thai
      ? "ยังไม่ต้องรู้รูปแบบที่เหมาะ ทีมจะเริ่มจากเป้าหมายและงานจริง ไม่ใช่การยืนยันจัดอบรมทันที"
      : "You do not need to know the format yet. The team starts from the goal and the real work. This is not an immediate training booking.",
    goalEmpty: thai ? "เลือกรูปแบบ" : "Choose a format",
    submit: thai ? "ส่งคำขอ" : "Send request",
    loading: thai ? "กำลังส่งข้อมูล กรุณารอสักครู่" : "Sending your message. Please wait.",
    success: thai
      ? "ได้รับคำขอแล้ว ทีมจะติดต่อกลับผ่านช่องทางที่ให้ไว้ เพื่อดูหนึ่งงานจริง ไม่ใช่การยืนยันจัดอบรมทันที"
      : "Request received. The team will reply on the channel you shared to look at one real piece of work. This is not an immediate training booking.",
    failed: thai ? "ส่งไม่สำเร็จ กรุณาลองอีกครั้ง หรือติดต่อทีมโดยตรง" : "Could not send. Please try again, or contact the team directly.",
    unavailable: thai ? "ขณะนี้ยังส่งต่อทีมไม่ได้ กรุณาติดต่อทางอีเมลหรือโทรศัพท์" : "This page cannot send the request right now. Please email or call the team.",
    groups: {
      contact: thai ? "ข้อมูลติดต่อ" : "Contact details",
      hotel: thai ? "โรงแรมและทีม" : "Hotel and team",
      work: thai ? "งานที่อยากพัฒนา" : "The work to develop",
    },
    labels: {
      name: thai ? "ชื่อผู้ติดต่อ" : "Contact name",
      role: thai ? "แผนกหรือบทบาท" : "Role / department",
      business: thai ? "ชื่อโรงแรม / บริษัท" : "Hotel / company",
      learners: thai ? "บทบาทหรือทีมผู้เรียน" : "Learner roles / team",
      learnersHint: thai ? "เช่น หัวหน้าแผนกต้อนรับ ไม่ต้องระบุชื่อ" : "For example front-office supervisors. Do not name people.",
      workflow: thai ? "ทักษะหรือหัวข้อที่อยากพัฒนา" : "Skill / topic to develop",
      workflowHint: thai
        ? "อธิบายทักษะหรืองานที่ติด โดยไม่ส่งรายชื่อพนักงาน คะแนนประเมินรายบุคคล หรือข้อมูลแขก"
        : "Describe the skill or workplace challenge. Do not send employee names, individual assessment scores, or guest data.",
      outcome: thai ? "ผลที่อยากเห็นหลังอบรม" : "Desired outcome after training",
      outcomeHint: thai ? "เช่น ให้ส่งต่องานได้ชัดขึ้น ไม่ใช่คะแนนพนักงาน" : "For example clearer handovers. Not an employee score.",
      workload: thai ? "จำนวนผู้เรียนโดยประมาณ" : "Approximate number of learners",
      workloadHint: thai ? "เช่น ประมาณ 8 คน ไม่ต้องระบุชื่อ" : "For example about eight people. Do not name people.",
      goal: thai ? "รูปแบบที่ต้องการ" : "Preferred format",
      timeline: thai ? "ช่วงเวลาที่ต้องการ" : "Preferred timing",
      timelineHint: thai ? "เช่น ไตรมาสหน้า หรือยังไม่กำหนด" : "For example next quarter, or not yet set.",
      contact: thai ? "อีเมลหรือเบอร์โทร" : "Email / phone",
      consent: thai
        ? "ข้าพเจ้ายินยอมให้ เดอะ เคพีไอ พลัส ใช้ข้อมูลนี้เพื่อติดต่อกลับเกี่ยวกับคำขอนี้ ตาม"
        : "I agree that The KPI Plus may use this information to reply about this request, under the",
      privacy: thai ? "นโยบายความเป็นส่วนตัว" : "Privacy Policy",
      optional: thai ? "ไม่บังคับ" : "Optional",
      required: thai ? "จำเป็น" : "Required",
      requiredMsg: thai ? "กรุณากรอกข้อมูลนี้" : "This field is required",
      invalidEmail: thai ? "กรุณาใส่อีเมลให้ถูกต้อง หรือใช้เบอร์โทร" : "Enter a valid email, or use a phone number",
      consentRequired: thai ? "กรุณายอมรับนโยบายความเป็นส่วนตัว" : "Please accept the privacy policy",
      secretMsg: thai
        ? "ห้ามใส่รายชื่อพนักงาน คะแนนประเมิน รหัสผ่าน หรือข้อมูลแขก"
        : "Do not send employee names, assessment scores, passwords, or guest data.",
    },
  };
}

export const hotelTrainingCopy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "Training & Team Development",
    titleLead: "พัฒนาทีมและทักษะ",
    titleAccent: "โรงแรม",
    titleRest: "และธุรกิจบริการ",
    lead: "เริ่มจากเป้าหมายทางธุรกิจ บทบาทในทีม ทักษะปัจจุบัน และงานที่คนต้องทำได้ จากนั้นออกแบบการเรียนรู้ตามบทบาท ให้ทีมฝึกใช้ ประเมิน และติดตามหลังเรียน ไม่ใช่การบรรยายครั้งเดียวหรือกิจกรรมทีมที่จบแล้วจบเลย",
    leadClose: "การอบรมช่วยให้ทีมฝึกกับงานจริง ไม่ใช่คำสัญญาว่าจะเพิ่มรายได้ คะแนนรีวิว หรือความพึงพอใจของแขกโดยอัตโนมัติ",
    cta: "ส่งคำขอเรื่องพัฒนาทีม",
    secondary: "ดูแนวทางและรูปแบบการพัฒนา",
    underCta: "ส่งโจทย์ของทีม โดยไม่ส่งรายชื่อพนักงานหรือคะแนนประเมิน",
    trust: ["Discover", "Design", "Deliver", "Assess", "Follow-up"],
    needsTitle: "ทีมพร้อมพัฒนา หรือต้องการการสนับสนุนแบบใด?",
    needsLead: "ใช้เป็นคำถามตรวจเองก่อนออกแบบการอบรม ไม่ใช่ข้อสรุปว่าทุกโรงแรมมีช่องว่างเหล่านี้ การประเมินใช้เพื่อพัฒนาทีม ไม่ใช่การจัดอันดับพนักงานบนหน้าสาธารณะ",
    needsNote: "ตัวอย่างด้านล่างปิดชื่อพนักงาน คะแนนรายบุคคล และรายละเอียดโรงแรม",
    programsTitle: "รูปแบบการพัฒนาที่ออกแบบจากงาน",
    programsLead: "ตัวอย่างด้านล่างเป็นประเภทงานที่เปิดรับจริง ไม่ใช่แคตตาล็อกหลักสูตรสำเร็จรูป หน้านี้ไม่สร้างชื่อหลักสูตร ใบรับรอง จำนวนวัน หรือจำนวนผู้เข้าที่ยังไม่ตรวจยืนยัน",
    programsNote: "ระยะเวลาและขนาดกลุ่มระบุเฉพาะเมื่อมีข้อมูลที่ยืนยันแล้ว แต่ละการ์ดใช้ไอคอนหมวด ไม่ใช้ภาพคน AI",
    assessTitle: "ฝึก ประเมิน และนำไปใช้ที่งาน",
    assessLead: "วิธีประเมินเลือกตามเป้าหมาย ใช้สัญญาณเพื่อทบทวน ไม่ใช่สัญญารับประกันผล และไม่ใช่โมเดลประเมินสำเร็จรูป คะแนนรายบุคคลไม่แสดงบนหน้านี้",
    assessNote: "ตารางด้านล่างเป็นตัวอย่าง ไม่ใส่คะแนนความคืบหน้า หรืออันดับพนักงาน",
    assessCaption: "ตารางสัญญาณทบทวนการเรียนรู้ ไม่ใช่โมเดลประเมินสำเร็จรูป และไม่ใช่คะแนนพนักงาน",
    galleryTitle: "ภาพจากงานอบรม",
    galleryLead: "ภาพจริงจากงานอบรม คนละชุดกับฮีโร่และจุดปัญหา คำบรรยายใช้เฉพาะหัวข้อ บทบาท และรูปแบบที่ยืนยันแล้ว ไม่ใส่ชื่อโรงแรมหรือโลโก้ลูกค้าหากยังไม่อนุมัติ",
    galleryNote: "ภาพผู้เข้าร่วมใช้เมื่อได้รับอนุญาตจากผู้จัดและผู้ที่ระบุตัวได้ หากยังไม่ครบสิทธิ์ ส่วนนี้ยังเป็นตัวอย่าง",
    matrixTitle: "ตารางทักษะตามแผนก / บทบาท",
    matrixLead: "ตัวอย่างด้านล่างจัดตามแผนกและบทบาท จากงานที่เปิดรับจริง ไม่ใช่แคตตาล็อกหลักสูตร และไม่ใช่ผลประเมินพนักงาน",
    matrixNote: "แต่ละแถวเป็นตัวอย่างที่ต้องตรวจกับโจทย์ของโรงแรมนั้น ไม่ใช่ชุดส่งมอบมาตรฐาน",
    matrixCaption: "ตารางทักษะตัวอย่างตามแผนก บทบาท ทักษะ กิจกรรม และการประเมิน ไม่ใช่คะแนนบุคคล",
    outcomesTitle: "ผลลัพธ์การเรียนรู้และหลักฐานที่วัดได้",
    outcomesLead: "แยกผลทันทีหลังเรียน การนำไปใช้ที่หน้างาน และผลทางธุรกิจ ช่องตัวเลขว่างไว้จนกว่าจะมีข้อมูลที่อนุมัติ ไม่ใช่คำรับประกันว่ารายได้หรือผลิตภาพจะดีขึ้น",
    outcomesNote: "ตารางด้านล่างเป็นแม่แบบตัวอย่าง ไม่ใส่คะแนนความพึงพอใจ จำนวนผู้เข้า หรือผลทางธุรกิจที่ยังไม่ตรวจยืนยัน",
    outcomesCaption: "แม่แบบตารางผลลัพธ์ ช่องก่อนเรียน หลังเรียน และติดตามว่างไว้จนกว่าจะมีข้อมูลที่อนุมัติ",
    trainerTitle: "โปรไฟล์วิทยากร",
    trainerLead: "แสดงเฉพาะรายละเอียดที่ยืนยันแล้ว ไม่สร้างประวัติ วุฒิบัตร จำนวนปี รายชื่อลูกค้า หรือผลลัพธ์",
    trainerNote: "วุฒิบัตรและภาษาที่ใช้สอนแสดงเมื่อมีข้อมูลที่อนุมัติ ภาพบุคคลใช้เมื่อได้รับอนุญาตเผยแพร่",
    trainerName: "คุณเนตรนภิส อิสรนิรันดร์",
    trainerNameEn: "Natenapit Isaraniran · Nate",
    trainerAlt: "คุณเนตรนภิส อิสรนิรันดร์ (Nate) ผู้นำงานด้าน Training ของ เดอะ เคพีไอ พลัส",
    journeyTitle: "วางแผนการ Training และ Assessment",
    journeyLead: "การอบรมรวม Discover, Design, Deliver, Assess และ Follow-up ไม่ใช่วันอบรมอย่างเดียว ประเมินและการติดตามที่หน้างานมีได้ตามแพ็กเกจที่เลือก",
    journeyNote: "สิ่งที่ได้ด้านล่างเป็นตัวอย่างตามขอบเขตที่ตกลง ไม่ใช่ชุดส่งมอบมาตรฐานของทุกงาน ขั้นที่ขึ้นกับแพ็กเกจจะมีป้ายกำกับ",
    journeyDeliverable: "สิ่งที่ได้",
    journeyOptional: "ขึ้นกับแพ็กเกจที่เลือก",
    followTitle: "การติดตามหลังเรียน",
    followLead: "การอบรมไม่จบตอนจบคลาส ต้องมีเจ้าของงาน สิ่งที่จะทดลองใช้ และจุดทบทวน",
    partnersTitle: "ร่วมงานด้าน Training และ Assessment",
    partnersBody: "เดอะ เคพีไอ พลัส ทำงานร่วมกับ NAWA, The KPI Plus Academy และ Australia Smart ในงานอบรมและการประเมินที่เกี่ยวข้อง ไม่ใช่คำรับรองผลลัพธ์จากพันธมิตร",
    closerTitle: "เริ่มจากทีมของคุณ",
    closerBody: "บอกเป้าหมายการอบรม กลุ่มผู้เรียน และทักษะที่อยากพัฒนา เราจะคุยรูปแบบ แนวทางประเมิน/ติดตาม แล้วจึงยืนยันขอบเขต ตารางเวลา เจ้าของงาน และขั้นตอนถัดไป",
    relatedTitle: "อ่านและดูต่อ",
    relatedLead: "บทความที่เผยแพร่แล้ว หลักสูตร Academy และคู่มือที่เกี่ยวข้อง ไม่สร้างชื่อหลักสูตร ใบรับรอง หรือวันเผยแพร่ที่ยังไม่ตรวจ",
    faqLead: "คำตอบขึ้นกับโจทย์ ผู้เข้าร่วม และงานจริง ไม่ใช่คำรับประกันผลทางธุรกิจ ใบรับรอง หรือระยะเวลาสำเร็จรูป",
    footerStatement: "งานพัฒนาทีมและทักษะสำหรับโรงแรม ออกแบบจากงานจริง ตามขอบเขตที่ตกลง ไม่ใช่คำรับประกันรายได้หรือใบรับรอง",
    measureEmpty: "ยังไม่มีตัวเลขที่อนุมัติ",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "Training & Team Development",
    titleLead: "Team and skills development for",
    titleAccent: "hotels",
    titleRest: "and service businesses",
    lead: "Start from the business goal, team roles, current skills, and the work people must perform. Then design role-relevant learning so the team can practise, be assessed, and follow up on the job—not a one-off lecture or team activity.",
    leadClose: "Training helps a team practise real work. It is not a promise that revenue, review scores, or guest satisfaction will rise on their own.",
    cta: "Send a team-development request",
    secondary: "See programs and approach",
    underCta: "Send the team brief. Do not send employee names or assessment scores.",
    trust: ["Discover", "Design", "Deliver", "Assess", "Follow-up"],
    needsTitle: "Is the team ready to develop, or what support does it need?",
    needsLead: "Use these as a self-check before designing training. They are not a diagnosis of every hotel. Assessment is for development, not for ranking employees in public.",
    needsNote: "The sample below redacts employee names, individual scores, and hotel details",
    programsTitle: "Development formats designed from the work",
    programsLead: "The cards below are types of work actually offered, not a ready-made course catalogue. This page does not invent course names, certificates, durations, or class sizes.",
    programsNote: "Duration and group size appear only when verified. Each card uses a category icon, not an AI image of people.",
    assessTitle: "Practise, assess, and apply at work",
    assessLead: "The assessment method follows the goal. These are review signals, not a guaranteed result and not a packaged assessment model. Individual scores are not shown on this page.",
    assessNote: "The table below is a sample. It does not add progress scores or employee ranking.",
    assessCaption: "Sample learning follow-through signals. Not a packaged assessment model, and not employee scores.",
    galleryTitle: "Training session photos",
    galleryLead: "Real training-session photos, a different set from the hero and the needs section. Captions use verified topic, role, and format only. Hotel names and client logos appear only when publication is approved.",
    galleryNote: "Participant photos are used when the organiser and identifiable people have given permission. Until then this block stays marked Sample.",
    matrixTitle: "Skill matrix by department / role",
    matrixLead: "The sample rows below are organised by department and role, from work actually offered. They are not a course catalogue and not a live employee assessment.",
    matrixNote: "Each row is an example to check against that hotel’s brief. It is not a standard package.",
    matrixCaption: "Sample skill matrix by department, role, topic, activity, and assessment. Not an individual score.",
    outcomesTitle: "Learning outcomes and measurable evidence",
    outcomesLead: "Separate immediate learning, workplace application, and business results. Value cells stay empty until approved data exists. This is not a promise that revenue or productivity will improve.",
    outcomesNote: "The scorecard below is a sample template. It does not add satisfaction scores, participant counts, or unverified business results.",
    outcomesCaption: "Sample outcome scorecard. Before, after, and follow-up cells stay empty until approved data exists.",
    trainerTitle: "Facilitator profile",
    trainerLead: "Only verified details are shown. This page does not invent a biography, certificates, years of experience, client list, or results.",
    trainerNote: "Qualifications and teaching languages appear when approved. A person photo is used only with publication permission.",
    trainerName: "Natenapit Isaraniran",
    trainerNameEn: "เนตรนภิส อิสรนิรันดร์ · Nate",
    trainerAlt: "Natenapit Isaraniran (Nate), who leads Training at The KPI Plus",
    journeyTitle: "Plan training and assessment",
    journeyLead: "Training includes Discover, Design, Deliver, Assess, and Follow-up—not only a training day. Assessment and workplace follow-up depend on the selected package.",
    journeyNote: "The outputs below are possible, subject to agreed scope. They are not a standard package for every job. Package-dependent steps are labelled.",
    journeyDeliverable: "Output",
    journeyOptional: "Depends on the selected package",
    followTitle: "Follow-through after learning",
    followLead: "Training does not end when the class ends. It needs an owner, an action to try, and a review point.",
    partnersTitle: "Training and assessment collaborators",
    partnersBody: "The KPI Plus works with NAWA, The KPI Plus Academy, and Australia Smart on related training and assessment. That is not an endorsement of partner results.",
    closerTitle: "Start with your team",
    closerBody: "Share the training goal, the learner group, and the skill to develop. We will discuss format and assessment/follow-up, then confirm scope, schedule, owner, and the next step.",
    relatedTitle: "Read and see next",
    relatedLead: "Published articles, Academy courses, and related guides. This page does not invent course titles, certificates, or unverified dates.",
    faqLead: "Answers depend on the brief, the participants, and the real work. They are not a guaranteed business result, certificate, or standard duration.",
    footerStatement: "Hotel team and skills development, designed from real work and agreed scope. Not a promise of revenue or a certificate.",
    measureEmpty: "No approved figure yet",
  },
} as const;
