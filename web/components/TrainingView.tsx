import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { TrainingEnquiry } from "@/components/TrainingEnquiry";
import { TrainingStickyCta } from "@/components/TrainingStickyCta";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, type Locale } from "@/lib/seo";

const academyDiscover = "https://thekpiplus.co.th/discover";
const academyHome = "https://thekpiplus.co.th/";
const studyUrl = "https://www.sciencedirect.com/science/article/abs/pii/S0278431925002725";

const collaborators = [
  { name: "NAWA", src: "/brand/partners/nawa.png", href: "https://www.nawaone.co/en", alt: "NAWA Smartest Hospitality Platform" },
  { name: "The KPI Plus Academy", src: "/brand/KPIPlus_Horizontal_FullColor.png", href: academyHome, alt: "The KPI Plus Academy" },
  { name: "Australia Smart", src: "/brand/partners/australia-smart.png", href: "https://www.australiasmart.com.au", alt: "Australia Smart Edu Biz Coach" },
] as const;

const photos = {
  hero: "/media/internship-workshop-speaking_d360672e.webp",
  problems: "/media/hospitality-training-group_cdf6d58f.webp",
  group: "/media/hospitality-training-group_cdf6d58f.webp",
  circle: "/media/service-quality-circle_e4c75522.webp",
  seminar: "/media/business-seminar-speaking_b934063e.webp",
  nate: "/media/natenapit-portrait_f7cdd1a1.webp",
  leadership: "/media/leadership-training-nate_5b9b1ef7.webp",
} as const;

const methodLabels = ["UNDERSTAND", "DESIGN", "PRACTICE", "REVIEW"] as const;

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "Training & Team Development",
    title: "พัฒนาทีมและทักษะสำหรับโรงแรมและธุรกิจบริการ",
    lead: "คนที่ทำงานร่วมกันได้ดี ช่วยให้แผนธุรกิจเกิดขึ้นจริง เดอะ เคพีไอ พลัส ออกแบบการอบรม เวิร์กช็อป Team Building และกิจกรรมพัฒนาคนสำหรับโรงแรมและองค์กรบริการ ตั้งแต่ Revenue และ Digital Marketing ไปจนถึงคุณภาพบริการ ภาวะผู้นำ เทคโนโลยี และ AI",
    leadClose: "เลือกพัฒนาทีมจากโจทย์ขององค์กร หรือเลือกเรียนหลักสูตรและกิจกรรมผ่าน The KPI Plus Academy",
    cta: "ปรึกษาเรื่องพัฒนาทีม",
    academyCta: "ดูหลักสูตรและกิจกรรมของ Academy",
    underCta: "ส่งโจทย์ของทีม หรือสำรวจหลักสูตรที่เปิดให้เรียน",
    photoAlt: "คุณเนตรบรรยายและฝึกทักษะกับผู้เข้าร่วมในงานอบรม",
    problemsPhotoAlt: "ผู้เข้าร่วมงานอบรม hospitality ของ เดอะ เคพีไอ พลัส",
    problemsTitle: "ทีมของคุณอยากทำอะไรได้ดีขึ้น?",
    problemsLead:
      "บางองค์กรต้องการให้หัวหน้าแผนกตัดสินใจจากข้อมูลชุดเดียวกัน บางแห่งต้องการให้ทีมบริการสื่อสารกันดีขึ้น หรือเตรียมคนให้พร้อมกับระบบและบทบาทใหม่ เราเริ่มจากเป้าหมายนี้ก่อนเลือกหัวข้อ วิทยากร และรูปแบบกิจกรรม",
    fitTitle: "งานนี้เหมาะกับองค์กรที่กำลังเจอปัญหาเหล่านี้",
    problems: [
      "ทีมเข้าใจเป้าหมาย บทบาท หรือวิธีส่งต่องานไม่ตรงกัน",
      "หัวหน้างานอยากพัฒนาทักษะการสื่อสารและการดูแลทีม",
      "พนักงานผ่านการอบรมแล้ว แต่ยังไม่มั่นใจเมื่อต้องนำความรู้ไปใช้",
      "องค์กรเริ่มใช้ระบบหรือ AI และต้องการให้ทีมฝึกกับงานจริง",
      "อยากจัด Team Building ที่เชื่อมกับการทำงานร่วมกัน",
      "ต้องการหลักสูตรหรือกิจกรรมที่เหมาะกับคนทำงานบริการโดยเฉพาะ",
    ],
    formatsTitle: "พัฒนาคนได้หลายรูปแบบ",
    formats: [
      ["01", "อบรมและเวิร์กช็อปเฉพาะองค์กร", "ออกแบบเนื้อหาจากธุรกิจ ผู้เข้าร่วม และสถานการณ์ของทีม อาจเป็นเวิร์กช็อปสำหรับหัวหน้าแผนก การฝึกทักษะบริการ การใช้ข้อมูลในการตัดสินใจ หรือการนำเครื่องมือใหม่ไปใช้ในงาน"],
      ["02", "Team Building", "ออกแบบกิจกรรมให้ทีมได้ฝึกฟัง สื่อสาร แก้ปัญหา และทำงานร่วมกัน โดยเชื่อมกิจกรรมเข้ากับสิ่งที่องค์กรอยากให้เกิดขึ้นหลังกลับไปทำงาน"],
      ["03", "The KPI Plus Academy", "หลักสูตร เวิร์กช็อป และกิจกรรมสำหรับผู้ที่ต้องการพัฒนาทักษะด้วยตนเอง เว็บไซต์ Academy มีหัวข้อด้าน AI และทักษะดิจิทัล พร้อมช่องทางสำหรับองค์กรที่สนใจการอบรมทีม"],
      ["04", "สัมมนาและกิจกรรมร่วมกับเครือข่าย", "เราจัดและร่วมกิจกรรมแลกเปลี่ยนความรู้กับผู้ประกอบการ คนทำงาน และสถาบันการศึกษา รวมถึงงานที่ทำร่วมกับ NAWA, The KPI Plus Academy และ Australia Smart"],
    ],
    academyLink: "ดูหลักสูตรและกิจกรรม",
    academyOrg: "อบรม AI สำหรับองค์กร",
    partnersTitle: "ร่วมงานด้าน Training และ Assessment",
    partnersBody:
      "เราทำงานร่วมกับ NAWA, The KPI Plus Academy และ Australia Smart ในงานอบรม การประเมิน และความต้องการอื่นที่เกี่ยวข้อง",
    galleryTitle: "ภาพจากงานอบรมจริง",
    topicsTitle: "หัวข้อที่เราช่วยพัฒนา",
    topics: [
      ["01", "ธุรกิจโรงแรมและการเติบโต", "Revenue Management, Commercial Management, ช่องทางขาย, Direct Booking, Digital Marketing และการทำงานร่วมกันระหว่าง Revenue, Sales, Marketing, Reservations และ Operations"],
      ["02", "การบริการและประสบการณ์ลูกค้า", "การสื่อสารกับลูกค้า การเข้าใจความต้องการ การรับมือสถานการณ์ในงานบริการ และการส่งต่องานระหว่างทีม"],
      ["03", "ภาวะผู้นำและการพัฒนาคน", "การสื่อสารของหัวหน้างาน การให้คำแนะนำ การสร้างความมั่นใจในทีม และการเตรียมคนสำหรับบทบาทใหม่"],
      ["04", "Team Building และการทำงานร่วมกัน", "กิจกรรมที่ช่วยให้ทีมเห็นวิธีคิดของกันและกัน ฝึกการร่วมมือ และนำสิ่งที่ได้กลับไปใช้ในงานประจำวัน"],
      ["05", "เทคโนโลยี ดิจิทัล และ AI", "การใช้ระบบและเครื่องมือให้เหมาะกับงาน ฝึกตั้งคำถามกับข้อมูล ทดลองใช้ AI กับขั้นตอนที่มีอยู่ และตรวจทานผลก่อนนำไปใช้"],
    ],
    topicsNote: "หัวข้อและระดับความลึกจะปรับตามผู้เข้าร่วม ตั้งแต่พนักงานที่เพิ่งเริ่มงานจนถึงหัวหน้าทีมและผู้บริหาร",
    practiceTitle: "ทำไมเราให้ทีมฝึกกับสถานการณ์จริง",
    practicePrinciples: [
      ["01", "เรียนรู้"],
      ["02", "นำไปใช้จริง"],
      ["03", "ทบทวนและปรับ"],
    ],
    practiceTakeawayLead: "Training ที่ดีไม่ควรจบตอนจบคลาส",
    practiceTakeawayClose: "แต่ควรเห็นว่าทีมนำสิ่งที่เรียนไปใช้กับงานจริงได้หรือไม่",
    practiceBody:
      "การฟังเนื้อหาเป็นจุดเริ่มต้น แต่ทีมยังต้องมีโอกาสลองคิด ลองตัดสินใจ และได้รับการสนับสนุนเมื่อนำสิ่งที่เรียนรู้กลับไปทำงาน",
    practiceStudy:
      "งานวิจัยจากผู้จัดการแผนก 398 คนในโรงแรมห้าดาวของประเทศไทย ศึกษาความสัมพันธ์ของการเรียนรู้จากประสบการณ์ ความมั่นใจในตนเอง และทักษะวิชาชีพ อีกงานวิจัยในธุรกิจโรงแรมพบว่าการสนับสนุนจากหัวหน้างานเกี่ยวข้องกับการนำความรู้จากการอบรมไปใช้ ผลการศึกษาเหล่านี้ช่วยอธิบายเหตุผลที่เราออกแบบกิจกรรมให้มีทั้งการฝึกและการวางแผนหลังเรียนรู้ โดยผลลัพธ์ของแต่ละองค์กรยังต้องประเมินจากบริบทของตนเอง",
    sourceLabel: "ที่มา",
    sourceStudy: "ScienceDirect – ประสบการณ์การเรียนรู้และความมั่นใจของหัวหน้างานโรงแรมในไทย",
    nateEyebrow: "Trainer",
    nateTitle: "งานด้าน Training นำโดยคุณเนตร",
    nateName: "คุณเนตรนภิส อิสรนิรันดร์",
    nateNameEn: "Natenapit Isaraniran · Nate",
    nateLabels: ["Hotel Operations", "Guest Relations", "Front Office"],
    nateBody:
      "ผู้นำงานด้าน Training ของ เดอะ เคพีไอ พลัส เธอมีประสบการณ์ด้าน Guest Relations และ Front Office ในธุรกิจโรงแรม รวมถึงงานบรรยายและกิจกรรมเตรียมความพร้อมให้ผู้ที่จะเข้าสู่อุตสาหกรรมบริการ",
    nateClose: "ประสบการณ์ด้านการดูแลผู้เข้าพักและการทำงานกับทีมเป็นส่วนสำคัญของการออกแบบกิจกรรมที่เข้าใจทั้งเป้าหมายองค์กรและคนที่ต้องลงมือทำ",
    nateAlt: "คุณเนตรนภิส อิสรนิรันดร์ (Nate) ผู้นำงานด้าน Training ของ เดอะ เคพีไอ พลัส",
    methodTitle: "เราทำงานกับทีมอย่างไร",
    steps: [
      ["01", "ฟังโจทย์ขององค์กร", "คุยกับผู้รับผิดชอบเพื่อเข้าใจเป้าหมาย ผู้เข้าร่วม และสถานการณ์ที่อยากให้ทีมรับมือได้ดีขึ้น"],
      ["02", "ออกแบบการเรียนรู้", "เลือกหัวข้อ กิจกรรม และแบบฝึกให้เหมาะกับระดับประสบการณ์และเวลาของทีม"],
      ["03", "ฝึกและแลกเปลี่ยน", "ให้ผู้เข้าร่วมได้ลองใช้ทักษะกับตัวอย่างงานหรือสถานการณ์ที่ใกล้กับงานจริง"],
      ["04", "ตกลงสิ่งที่จะทำต่อ", "สรุปแนวทางที่ทีมอยากทดลอง ผู้รับผิดชอบ และจุดทบทวนหลังจบกิจกรรมตามขอบเขตที่ตกลงกัน"],
    ],
    measureTitle: "ดูผลจากการนำไปใช้",
    measureLead: "วิธีประเมินจะเลือกตามเป้าหมายของงาน",
    measures: [
      ["01", "Participation", "การมีส่วนร่วม"],
      ["02", "Confidence", "ความมั่นใจก่อนและหลังเรียนรู้"],
      ["03", "Application", "การทดลองใช้วิธีทำงานใหม่"],
      ["04", "Follow-through", "ความคืบหน้าของสิ่งที่ทีมตกลงจะทำต่อ"],
      ["05", "Review", "ทบทวนว่าทีมได้ประโยชน์ตรงไหน และควรพัฒนาเรื่องใดเพิ่ม"],
    ],
    closerTitle: "เริ่มจากทีมของคุณ",
    closerBody: "บอกเราว่าคุณอยากพัฒนาใคร ทีมกำลังเจอสถานการณ์ใด และอยากให้พวกเขาทำอะไรได้ดีขึ้น เราจะช่วยแนะนำรูปแบบการเรียนรู้ที่เหมาะสม",
    closerCta: "ปรึกษาเรื่องอบรมและ Team Building",
    closerAcademy: "สำรวจ The KPI Plus Academy",
    relatedTitle: "อ่านและลองใช้ต่อ",
    details: "ดูรายละเอียด",
    readArticle: "อ่านบทความ",
    useTool: "ใช้เครื่องมือ",
    seeCourse: "ดูหลักสูตร",
    insightMeetings: "ประชุม Revenue อย่างไรให้จบด้วยการตัดสินใจที่นำไปใช้ได้จริง",
    insightTech: "ทำไมการนำเทคโนโลยีโรงแรมมาใช้จึงเป็นส่วนหนึ่งของการบริหารรายได้และการเติบโต",
    toolBudget: "เครื่องคำนวณ Budget โรงแรม",
    toolRevpar: "เครื่องคำนวณ RevPAR, ADR และ Occupancy",
    gallery: [
      [photos.group, "ผู้เข้าร่วมงานอบรม hospitality ของ เดอะ เคพีไอ พลัส"],
      [photos.leadership, "คุณเนตรในงานพัฒนาภาวะผู้นำและเตรียมทีม"],
      [photos.circle, "กิจกรรมกลุ่มที่ให้ทีมฝึกฟังและแลกเปลี่ยน"],
      [photos.seminar, "คุณเนตรบรรยายในงานสัมมนาความรู้ธุรกิจโรงแรม"],
    ],
  },
  en: {
    crumb: "Solutions",
    eyebrow: "Training & Team Development",
    title: "Team and skills development for hotels and hospitality businesses",
    lead: "People who work well together help a business plan happen. The KPI Plus designs training, workshops, team building, and people-development work for hotels and hospitality organisations, from revenue and digital marketing through to service quality, leadership, technology, and AI.",
    leadClose: "Develop the team from the organisation’s brief, or join a course and event through The KPI Plus Academy.",
    cta: "Talk about team development",
    academyCta: "See Academy courses and events",
    underCta: "Send the team brief, or browse open courses.",
    photoAlt: "Khun Nate speaking and practising skills with training participants",
    problemsPhotoAlt: "Participants at a The KPI Plus hospitality training",
    problemsTitle: "What should the team do better?",
    problemsLead:
      "Some organisations want department heads to decide from the same set of facts. Others want the service team to communicate better, or to prepare people for a new system or role. We start from that goal before choosing the topic, facilitator, and format.",
    fitTitle: "This work fits organisations that are facing these situations",
    problems: [
      "The team does not share the same view of goals, roles, or how work is handed over",
      "Supervisors want stronger communication and team-care skills",
      "People have been trained, but are not yet confident when they apply the knowledge",
      "The organisation is starting to use a system or AI and wants the team to practise on real work",
      "You want team building that connects to how people work together",
      "You need a course or activity made for hospitality people",
    ],
    formatsTitle: "People can be developed in more than one format",
    formats: [
      ["01", "In-house training and workshops", "Content is designed from the business, the participants, and the team’s situation. It may be a workshop for department heads, service-skill practice, using data to decide, or putting a new tool into daily work."],
      ["02", "Team building", "Activities are designed so the team can practise listening, communicating, solving problems, and working together, then connect that to what the organisation wants after people return to work."],
      ["03", "The KPI Plus Academy", "Courses, workshops, and events for people who want to develop skills themselves. The Academy site has AI and digital-skill topics, plus a path for organisations that want team training."],
      ["04", "Seminars and network events", "We host and join knowledge-exchange work with operators, working people, and education institutions, including work with NAWA, The KPI Plus Academy, and Australia Smart."],
    ],
    academyLink: "See courses and events",
    academyOrg: "AI training for organisations",
    partnersTitle: "Training and assessment partners",
    partnersBody:
      "We collaborate with NAWA, The KPI Plus Academy, and Australia Smart for training, assessment, and other related requirements.",
    galleryTitle: "From real training sessions",
    topicsTitle: "Topics we can develop",
    topics: [
      ["01", "Hotel business and growth", "Revenue management, commercial management, sales channels, direct booking, digital marketing, and how Revenue, Sales, Marketing, Reservations, and Operations work together."],
      ["02", "Service and guest experience", "Talking with guests, understanding what they need, handling service situations, and handing work between teams."],
      ["03", "Leadership and people development", "How supervisors communicate, give guidance, build team confidence, and prepare people for a new role."],
      ["04", "Team building and working together", "Activities that help the team see how others think, practise cooperation, and take what they learned back into daily work."],
      ["05", "Technology, digital skills, and AI", "Using systems and tools that fit the work, asking better questions of the data, trying AI on an existing step, and checking the result before it is used."],
    ],
    topicsNote: "The topic and depth are adjusted to the participants, from people just starting work to team leads and executives.",
    practiceTitle: "Why we have the team practise on real situations",
    practicePrinciples: [
      ["01", "Learn"],
      ["02", "Apply in real work"],
      ["03", "Review and adjust"],
    ],
    practiceTakeawayLead: "Good training should not end when the class ends",
    practiceTakeawayClose: "It should show whether the team can use what they learned in real work",
    practiceBody: "Hearing the content is a start. The team still needs a chance to think, decide, and get support when they take the learning back to work.",
    practiceStudy:
      "A study of 398 department managers in five-star hotels in Thailand looked at the relationship between experiential learning, self-efficacy, and professional skills. Other hotel-business research found that supervisor support is linked with using training knowledge at work. These studies help explain why we design activities with both practice and a plan after learning. Results for each organisation still have to be judged in its own context.",
    sourceLabel: "Source",
    sourceStudy: "ScienceDirect – experiential learning and self-efficacy among Thai hotel managers",
    nateEyebrow: "Trainer",
    nateTitle: "Training work is led by Nate",
    nateName: "Natenapit Isaraniran",
    nateNameEn: "เนตรนภิส อิสรนิรันดร์ · Nate",
    nateLabels: ["Hotel Operations", "Guest Relations", "Front Office"],
    nateBody:
      "She leads Training at The KPI Plus. She has guest-relations and front-office experience in hotels, as well as lectures and readiness activities for people entering hospitality.",
    nateClose: "Experience looking after guests and working with teams is a core part of designing activities that understand both the organisation’s goal and the people who have to do the work.",
    nateAlt: "Natenapit Isaraniran (Nate), who leads Training at The KPI Plus",
    methodTitle: "How we work with a team",
    steps: [
      ["01", "Hear the organisation’s brief", "Talk with the owner of the work to understand the goal, the participants, and the situations the team should handle better."],
      ["02", "Design the learning", "Choose the topic, activities, and practice to fit the team’s experience and time."],
      ["03", "Practise and exchange", "Give participants a chance to use the skill on a work example or a situation close to real work."],
      ["04", "Agree what happens next", "Summarise what the team wants to try, who owns it, and when it will be reviewed, within the agreed scope."],
    ],
    measureTitle: "See the result from what is used",
    measureLead: "The review method is chosen from the goal of the work",
    measures: [
      ["01", "Participation", "How people take part"],
      ["02", "Confidence", "Confidence before and after learning"],
      ["03", "Application", "Trying a new way of working"],
      ["04", "Follow-through", "Progress on what the team agreed to do next"],
      ["05", "Review", "Where the team gained, and what to develop further"],
    ],
    closerTitle: "Start with your team",
    closerBody: "Tell us who you want to develop, what the team is facing, and what they should do better. We will help suggest a learning format that fits.",
    closerCta: "Talk about training and team building",
    closerAcademy: "Explore The KPI Plus Academy",
    relatedTitle: "Read and try next",
    details: "See details",
    readArticle: "Read article",
    useTool: "Use tool",
    seeCourse: "See courses",
    insightMeetings: "How a revenue meeting can end with a decision the team can use",
    insightTech: "Why hotel technology adoption is part of revenue and growth work",
    toolBudget: "Hotel budget calculator",
    toolRevpar: "RevPAR, ADR, and occupancy calculator",
    gallery: [
      [photos.group, "Participants at a The KPI Plus hospitality training"],
      [photos.leadership, "Khun Nate at a leadership and team-readiness session"],
      [photos.circle, "A group activity for listening and exchange"],
      [photos.seminar, "Khun Nate speaking at a hotel-business knowledge seminar"],
    ],
  },
  ru: {
    crumb: "Решения",
    eyebrow: "Training & Team Development",
    title: "Развитие команды и навыков для отелей и hospitality-бизнеса",
    lead: "Люди, которые умеют работать вместе, помогают бизнес-плану состояться. The KPI Plus проектирует обучение, воркшопы, Team Building и развитие людей для отелей и организаций сферы услуг: от Revenue и Digital Marketing до качества сервиса, лидерства, технологий и ИИ.",
    leadClose: "Развивайте команду от задачи организации или выбирайте курс и мероприятие в The KPI Plus Academy.",
    cta: "Обсудить развитие команды",
    academyCta: "Смотреть курсы и события Academy",
    underCta: "Отправьте задачу команды или посмотрите открытые курсы.",
    photoAlt: "Кхун Нате проводит обучение и практику с участниками",
    problemsPhotoAlt: "Участники hospitality-обучения The KPI Plus",
    problemsTitle: "Что команда должна делать лучше?",
    problemsLead:
      "Одной организации нужно, чтобы руководители отделов решали по одному набору данных. Другой — чтобы сервисная команда лучше общалась или люди были готовы к новой системе и роли. Мы начинаем с этой цели, затем выбираем тему, ведущего и формат.",
    fitTitle: "Эта работа подходит организациям, которые сталкиваются с такими ситуациями",
    problems: [
      "Команда по-разному понимает цели, роли или передачу работы",
      "Руководители хотят сильнее говорить и вести команду",
      "Люди прошли обучение, но ещё не уверены, когда применяют знания",
      "Организация начинает использовать систему или ИИ и хочет, чтобы команда тренировалась на реальной работе",
      "Нужен Team Building, связанный с совместной работой",
      "Нужен курс или активность именно для людей сферы услуг",
    ],
    formatsTitle: "Людей можно развивать в разных форматах",
    formats: [
      ["01", "Внутреннее обучение и воркшопы", "Содержание строится из бизнеса, участников и ситуации команды. Это может быть воркшоп для руководителей отделов, практика сервисных навыков, решения по данным или внедрение нового инструмента в работу."],
      ["02", "Team Building", "Активности помогают команде тренировать слушание, общение, решение задач и совместную работу, затем связать это с тем, что организация хочет после возвращения на место."],
      ["03", "The KPI Plus Academy", "Курсы, воркшопы и события для тех, кто хочет развивать навыки самостоятельно. На сайте Academy есть темы по ИИ и цифровым навыкам, а также путь для организаций, которым нужно обучение команды."],
      ["04", "Семинары и события с сетью", "Мы проводим и участвуем в обмене знаниями с предпринимателями, сотрудниками и учебными заведениями, включая работу с NAWA, The KPI Plus Academy и Australia Smart."],
    ],
    academyLink: "Смотреть курсы и события",
    academyOrg: "Обучение ИИ для организаций",
    partnersTitle: "Партнёры по обучению и оценке",
    partnersBody:
      "Мы сотрудничаем с NAWA, The KPI Plus Academy и Australia Smart в обучении, оценке и других связанных задачах.",
    galleryTitle: "Из реальных обучений",
    topicsTitle: "Темы, которые мы помогаем развивать",
    topics: [
      ["01", "Отельный бизнес и рост", "Revenue Management, Commercial Management, каналы продаж, Direct Booking, Digital Marketing и совместная работа Revenue, Sales, Marketing, Reservations и Operations."],
      ["02", "Сервис и опыт гостя", "Общение с гостем, понимание потребности, работа с ситуациями в сервисе и передача работы между командами."],
      ["03", "Лидерство и развитие людей", "Как руководитель говорит, даёт рекомендации, укрепляет уверенность команды и готовит людей к новой роли."],
      ["04", "Team Building и совместная работа", "Активности, которые помогают увидеть мышление друг друга, тренировать сотрудничество и вернуть полученное в ежедневную работу."],
      ["05", "Технологии, цифровые навыки и ИИ", "Использовать системы и инструменты по задаче, лучше спрашивать данные, пробовать ИИ на существующем шаге и проверять результат до применения."],
    ],
    topicsNote: "Тема и глубина подстраиваются под участников: от людей, которые только начинают работу, до руководителей команд и менеджмента.",
    practiceTitle: "Почему мы даём команде практиковать реальные ситуации",
    practicePrinciples: [
      ["01", "Учиться"],
      ["02", "Применять в реальной работе"],
      ["03", "Пересматривать и корректировать"],
    ],
    practiceTakeawayLead: "Хорошее обучение не должно заканчиваться с концом занятия",
    practiceTakeawayClose: "Нужно видеть, применяет ли команда изученное в реальной работе",
    practiceBody: "Услышать содержание — только начало. Команде ещё нужна возможность подумать, решить и получить поддержку, когда знание возвращается в работу.",
    practiceStudy:
      "Исследование 398 менеджеров отделов в пятизвёздочных отелях Таиланда изучало связь обучения из опыта, уверенности в себе и профессиональных навыков. Другие работы в отельном бизнесе показывают, что поддержка руководителя связана с применением знаний после обучения. Эти результаты помогают объяснить, почему мы проектируем активность и с практикой, и с планом после обучения. Результат каждой организации всё равно нужно оценивать в её контексте.",
    sourceLabel: "Источник",
    sourceStudy: "ScienceDirect – обучение из опыта и уверенность руководителей отелей в Таиланде",
    nateEyebrow: "Trainer",
    nateTitle: "Направление Training ведёт Nate",
    nateName: "Natenapit Isaraniran",
    nateNameEn: "เนตรนภิส อิสรนิรันดร์ · Nate",
    nateLabels: ["Hotel Operations", "Guest Relations", "Front Office"],
    nateBody:
      "Она ведёт направление Training в The KPI Plus. У неё опыт Guest Relations и Front Office в отелях, а также лекции и подготовка людей, которые входят в индустрию гостеприимства.",
    nateClose: "Опыт заботы о гостях и работы с командой важен, когда мы проектируем активность, которая понимает и цель организации, и людей, которым нужно действовать.",
    nateAlt: "Natenapit Isaraniran (Nate), руководитель направления Training The KPI Plus",
    methodTitle: "Как мы работаем с командой",
    steps: [
      ["01", "Услышать задачу организации", "Поговорить с ответственным, чтобы понять цель, участников и ситуации, с которыми команда должна справляться лучше."],
      ["02", "Спроектировать обучение", "Выбрать тему, активности и практику под опыт и время команды."],
      ["03", "Практиковать и обмениваться", "Дать участникам применить навык на примере работы или ситуации, близкой к реальной."],
      ["04", "Согласовать, что делать дальше", "Собрать, что команда хочет попробовать, кто отвечает и когда это пересмотреть, в согласованных границах."],
    ],
    measureTitle: "Смотреть результат по тому, что применяется",
    measureLead: "Способ оценки выбираем по цели работы",
    measures: [
      ["01", "Participation", "Участие"],
      ["02", "Confidence", "Уверенность до и после обучения"],
      ["03", "Application", "Проба нового способа работы"],
      ["04", "Follow-through", "Прогресс по тому, что команда согласилась делать дальше"],
      ["05", "Review", "Где команда получила пользу и что развивать дальше"],
    ],
    closerTitle: "Начните со своей команды",
    closerBody: "Напишите, кого хотите развивать, с какой ситуацией сталкивается команда и что они должны делать лучше. Мы подскажем подходящий формат обучения.",
    closerCta: "Обсудить обучение и Team Building",
    closerAcademy: "Открыть The KPI Plus Academy",
    relatedTitle: "Читать и пробовать дальше",
    details: "Подробнее",
    readArticle: "Читать статью",
    useTool: "Использовать инструмент",
    seeCourse: "Смотреть курсы",
    insightMeetings: "Как совещание по Revenue заканчивается решением, которое можно использовать",
    insightTech: "Почему внедрение отельных технологий — часть работы с доходом и ростом",
    toolBudget: "Калькулятор бюджета отеля",
    toolRevpar: "Калькулятор RevPAR, ADR и Occupancy",
    gallery: [
      [photos.group, "Участники hospitality-обучения The KPI Plus"],
      [photos.leadership, "Кхун Нате на сессии по лидерству и готовности команды"],
      [photos.circle, "Групповая активность для слушания и обмена"],
      [photos.seminar, "Кхун Нате выступает на семинаре по отельному бизнесу"],
    ],
  },
  zh: {
    crumb: "方案",
    eyebrow: "Training & Team Development",
    title: "飯店與服務業的團隊與技能發展",
    lead: "能一起把事情做成的人，會讓商業計畫真正發生。The KPI Plus 為飯店與服務業組織設計培訓、工作坊、Team Building 與人才發展活動，從 Revenue 與 Digital Marketing，到服務品質、領導力、科技與 AI。",
    leadClose: "可依組織課題客製發展團隊，或透過 The KPI Plus Academy 選擇課程與活動。",
    cta: "諮詢團隊發展",
    academyCta: "查看 Academy 課程與活動",
    underCta: "先送出團隊課題，或瀏覽開放課程。",
    photoAlt: "Khun Nate 在培訓中帶領學員練習",
    problemsPhotoAlt: "The KPI Plus 餐旅培訓的參加者",
    problemsTitle: "你的團隊想把哪件事做得更好？",
    problemsLead:
      "有的組織希望部門主管用同一組資料做決定；有的希望服務團隊溝通更好，或讓人準備好面對新系統與新角色。我們會先從這個目標開始，再選主題、講師與活動形式。",
    fitTitle: "這項工作適合正面對這些情況的組織",
    problems: [
      "團隊對目標、角色或工作交接的理解不一致",
      "主管想加強溝通與帶人之力",
      "員工已受訓，但要把知識用回工作時仍不放心",
      "組織開始使用系統或 AI，希望團隊用真實工作練習",
      "想辦與實際合作有關的 Team Building",
      "需要專為服務業工作者設計的課程或活動",
    ],
    formatsTitle: "發展人才可以有多種形式",
    formats: [
      ["01", "企業內訓與工作坊", "內容依事業、參加者與團隊情境設計。可能是部門主管工作坊、服務技巧練習、用資料做決定，或把新工具用回日常工作。"],
      ["02", "Team Building", "設計活動讓團隊練習傾聽、溝通、解題與合作，並把活動接到組織希望回去工作後發生的事。"],
      ["03", "The KPI Plus Academy", "提供給想自行發展技能的人的課程、工作坊與活動。Academy 網站有 AI 與數位技能主題，也有給想辦團隊培訓的組織的入口。"],
      ["04", "研討會與網絡活動", "我們舉辦並參與與經營者、工作者、教育機構的知識交流，也包括與 NAWA、The KPI Plus Academy 與 Australia Smart 合作的工作。"],
    ],
    academyLink: "查看課程與活動",
    academyOrg: "企業 AI 培訓",
    partnersTitle: "培訓與評估合作夥伴",
    partnersBody:
      "我們與 NAWA、The KPI Plus Academy 與 Australia Smart 合作，處理培訓、評估與其他相關需求。",
    galleryTitle: "來自真實培訓現場",
    topicsTitle: "我們能協助發展的主題",
    topics: [
      ["01", "飯店事業與成長", "Revenue Management、Commercial Management、銷售通路、Direct Booking、Digital Marketing，以及 Revenue、Sales、Marketing、Reservations 與 Operations 如何一起工作。"],
      ["02", "服務與顧客體驗", "與客人溝通、理解需求、處理服務現場情況，以及團隊之間的交接。"],
      ["03", "領導力與人才發展", "主管如何溝通、給予建議、建立團隊信心，以及為新角色做準備。"],
      ["04", "Team Building 與合作", "幫助團隊看見彼此想法、練習合作，並把所得帶回日常工作的活動。"],
      ["05", "科技、數位技能與 AI", "依工作選擇系統與工具、對資料提出更好的問題、在既有步驟試用 AI，並在使用前檢查結果。"],
    ],
    topicsNote: "主題與深度會依參加者調整，從剛開始工作的同仁，到團隊主管與高階主管。",
    practiceTitle: "為什麼我們讓團隊用真實情境練習",
    practicePrinciples: [
      ["01", "學習"],
      ["02", "用回真實工作"],
      ["03", "回顧並調整"],
    ],
    practiceTakeawayLead: "好的培訓不該在下課時結束",
    practiceTakeawayClose: "而該看見團隊能否把所學用回真實工作",
    practiceBody: "聽完內容只是起點。團隊還需要有機會思考、做決定，並在把所學帶回工作時得到支持。",
    practiceStudy:
      "一項針對泰國五星級飯店 398 位部門經理的研究，探討經驗學習、自我效能與專業技能的關係。其他飯店研究也發現，主管支持與把培訓知識用回工作有關。這些研究幫助說明，為什麼我們把活動設計成既有練習、也有學習後的計畫。每個組織的結果，仍須依自身情境評估。",
    sourceLabel: "來源",
    sourceStudy: "ScienceDirect – 泰國飯店主管的經驗學習與自我效能",
    nateEyebrow: "Trainer",
    nateTitle: "Training 工作由 Nate 主導",
    nateName: "Natenapit Isaraniran",
    nateNameEn: "เนตรนภิส อิสรนิรันดร์ · Nate",
    nateLabels: ["Hotel Operations", "Guest Relations", "Front Office"],
    nateBody:
      "她負責 The KPI Plus 的 Training。她具有飯店 Guest Relations 與 Front Office 經驗，也從事講座，以及協助準備進入服務業的活動。",
    nateClose: "照顧客人與和團隊共事的經驗，是設計活動時同時理解組織目標、以及必須動手做事的人的重要基礎。",
    nateAlt: "Natenapit Isaraniran（Nate），The KPI Plus Training 負責人",
    methodTitle: "我們如何與團隊合作",
    steps: [
      ["01", "先聽組織的課題", "與負責人對談，了解目標、參加者，以及希望團隊更能應對的情況。"],
      ["02", "設計學習", "依團隊經驗與時間，選擇主題、活動與練習。"],
      ["03", "練習與交流", "讓參加者把技能用在接近真實工作的例子或情境。"],
      ["04", "約定接下來要做的事", "依談好的範圍，整理團隊想嘗試的做法、負責人，以及活動後的回顧點。"],
    ],
    measureTitle: "從實際使用來看結果",
    measureLead: "評估方式依工作目標選擇",
    measures: [
      ["01", "Participation", "參與程度"],
      ["02", "Confidence", "學習前後的信心"],
      ["03", "Application", "嘗試新工作方法"],
      ["04", "Follow-through", "團隊約定後續事項的進度"],
      ["05", "Review", "團隊在哪裡得到幫助，以及還該發展什麼"],
    ],
    closerTitle: "從你的團隊開始",
    closerBody: "告訴我們你想發展誰、團隊正面對什麼情況，以及希望他們把哪件事做得更好。我們會協助建議適合的學習形式。",
    closerCta: "諮詢培訓與 Team Building",
    closerAcademy: "探索 The KPI Plus Academy",
    relatedTitle: "接著閱讀與試用",
    details: "查看詳情",
    readArticle: "閱讀文章",
    useTool: "使用工具",
    seeCourse: "查看課程",
    insightMeetings: "Revenue 會議如何以可執行的決定作結",
    insightTech: "為什麼導入飯店科技是收益與成長工作的一部分",
    toolBudget: "飯店 Budget 計算機",
    toolRevpar: "RevPAR、ADR 與 Occupancy 計算機",
    gallery: [
      [photos.group, "The KPI Plus 餐旅培訓的參加者"],
      [photos.leadership, "Khun Nate 在領導力與團隊準備活動中"],
      [photos.circle, "練習傾聽與交流的團體活動"],
      [photos.seminar, "Khun Nate 在飯店知識研討會上講授"],
    ],
  },
} as const;

export function TrainingView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const solutions = localizePath("/solutions", locale);
  const meetingsHref = existingHref("/insights/hotel-revenue-meetings-that-lead-to-decisions", locale);
  const techHref = existingHref("/insights/hotel-technology-adoption-commercial-project", locale);
  const budgetHref = existingHref("/tools/hotel-budget-calculator", locale);
  const revparHref = existingHref("/tools/revpar-calculator", locale);

  return (
    <SiteShell locale={locale} route={localizePath("/solutions/hotel-training-team-development", locale)}>
      <section className="kpi-hero kpi-home-hero-section kpi-train-hero">
        <div className="kpi-wrap">
          <nav aria-label="Breadcrumb" className="kpi-train-hero-crumb">
            <ol>
              <li>
                <Link href={solutions}>{t.crumb}</Link>
              </li>
              <li>
                <span aria-hidden="true">/</span>
                <span>{solutionNavLabel("/solutions/hotel-training-team-development", locale)}</span>
              </li>
            </ol>
          </nav>
          <div className="kpi-home-hero">
            <div className="kpi-home-hero-copy">
              <p className="kpi-home-eyebrow kpi-latin">{t.eyebrow}</p>
              <h1 className="kpi-h1 kpi-home-h1">
                {locale === "th" ? (
                  <>
                    <span className="kpi-home-h1-lead">พัฒนาทีมและทักษะ</span>
                    <span className="kpi-home-h1-rest">
                      สำหรับ<span className="kpi-home-accent">โรงแรม</span>และธุรกิจบริการ
                    </span>
                  </>
                ) : (
                  t.title
                )}
              </h1>
              <p className="kpi-lead kpi-home-lead">{t.lead}</p>
              <p className="kpi-train-lead-close">{t.leadClose}</p>
              <div className="kpi-actions">
                <a href="#training-enquiry" className="kpi-button">
                  {t.cta} <span aria-hidden="true">↗</span>
                </a>
                <a href={academyDiscover} target="_blank" rel="noreferrer" className="kpi-button-ghost">
                  {t.academyCta}
                </a>
              </div>
              <p className="kpi-train-hero-note">{t.underCta}</p>
            </div>
            <div className="kpi-hero-visual kpi-home-photo">
              <img src={photos.hero} alt={t.photoAlt} width={1200} height={900} />
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-train-problems">
        <div className="kpi-train-problems-grid">
          <div className="kpi-train-problems-copy">
            <h2 className="kpi-h2">{t.problemsTitle}</h2>
            <p className="kpi-train-problems-lead">{t.problemsLead}</p>
            <p className="kpi-train-fit-label">{t.fitTitle}</p>
            <ol className="kpi-train-problems-list">
              {t.problems.map((item, index) => (
                <li key={item} className="kpi-train-problems-item">
                  <span className="kpi-latin kpi-train-num">{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </div>
          <figure className="kpi-train-problems-media">
            <img src={photos.problems} alt={t.problemsPhotoAlt} width={1200} height={900} />
          </figure>
        </div>
      </section>

      <section className="kpi-train-formats border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.formatsTitle}</h2>
          <ol className="kpi-train-formats-list">
            {t.formats.map(([num, title, body]) => (
              <li key={num} className="kpi-train-formats-item">
                <span className="kpi-latin kpi-train-num">{num}</span>
                <div className="kpi-train-formats-copy">
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="kpi-train-formats-actions">
            <a href={academyDiscover} target="_blank" rel="noreferrer" className="kpi-button">
              {t.academyLink} <span aria-hidden="true">↗</span>
            </a>
            <a href={academyHome} target="_blank" rel="noreferrer" className="kpi-train-formats-link">
              {t.academyOrg}
            </a>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-train-partners">
        <h2 className="kpi-h2">{t.partnersTitle}</h2>
        <p className="kpi-train-partners-body">{t.partnersBody}</p>
        <ul className="kpi-train-partners-list">
          {collaborators.map((partner) => (
            <li key={partner.name}>
              <a href={partner.href} target="_blank" rel="noreferrer" className="kpi-train-partner">
                <img src={partner.src} alt={partner.alt} width={180} height={64} />
                <span className="kpi-latin">{partner.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="kpi-train-gallery border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.galleryTitle}</h2>
          <div className="kpi-train-gallery-grid">
            {t.gallery.map(([src, alt]) => (
              <figure key={src}>
                <img src={src} alt={alt} width={1200} height={900} />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-train-topics">
        <h2 className="kpi-h2">{t.topicsTitle}</h2>
        <ol className="kpi-train-topics-list">
          {t.topics.map(([num, title, body]) => (
            <li key={num} className="kpi-train-topics-item">
              <span className="kpi-latin kpi-train-num">{num}</span>
              <div className="kpi-train-topics-copy">
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="kpi-train-topics-note">{t.topicsNote}</p>
      </section>

      <section className="kpi-train-practice border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.practiceTitle}</h2>
          <ol className="kpi-train-practice-principles">
            {t.practicePrinciples.map(([num, text]) => (
              <li key={num}>
                <span className="kpi-latin kpi-train-num">{num}</span>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <p className="kpi-train-practice-takeaway">
            {t.practiceTakeawayLead}
            <span className="kpi-train-practice-takeaway-close">{t.practiceTakeawayClose}</span>
          </p>
          <p className="kpi-train-practice-body">{t.practiceBody}</p>
          <p className="kpi-train-practice-study">{t.practiceStudy}</p>
          <p className="kpi-train-practice-source">
            {t.sourceLabel}:{" "}
            <a href={studyUrl} target="_blank" rel="noreferrer">
              {t.sourceStudy}
            </a>
          </p>
        </div>
      </section>

      <section className="kpi-section kpi-train-nate">
        <div className="kpi-train-nate-grid">
          <figure className="kpi-train-nate-media">
            <img src={photos.nate} alt={t.nateAlt} width={1200} height={1600} />
          </figure>
          <div className="kpi-train-nate-copy">
            <p className="kpi-latin kpi-train-nate-eyebrow">{t.nateEyebrow}</p>
            <h2 className="kpi-h2">{t.nateTitle}</h2>
            <p className="kpi-train-nate-name">{t.nateName}</p>
            <p className="kpi-latin kpi-train-nate-name-en">{t.nateNameEn}</p>
            <ul className="kpi-train-nate-labels">
              {t.nateLabels.map((label) => (
                <li key={label} className="kpi-latin">
                  {label}
                </li>
              ))}
            </ul>
            <p className="kpi-train-nate-body">{t.nateBody}</p>
            <p className="kpi-train-nate-close">{t.nateClose}</p>
          </div>
        </div>
      </section>

      <section className="kpi-train-method border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.methodTitle}</h2>
          <ol className="kpi-train-method-list">
            {t.steps.map(([num, title, body], index) => (
              <li key={num} className="kpi-train-method-item">
                <div className="kpi-train-method-meta">
                  <span className="kpi-latin kpi-train-method-num">{num}</span>
                  <span className="kpi-latin kpi-train-method-label">{methodLabels[index]}</span>
                </div>
                <div className="kpi-train-method-copy">
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="kpi-section kpi-train-measure">
        <h2 className="kpi-h2">{t.measureTitle}</h2>
        <p className="kpi-train-measure-lead">{t.measureLead}</p>
        <ol className="kpi-train-measure-list">
          {t.measures.map(([num, label, body]) => (
            <li key={num} className="kpi-train-measure-item">
              <span className="kpi-latin kpi-train-num">{num}</span>
              <div>
                <h3 className="kpi-latin">{label}</h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <aside className="kpi-train-closer">
          <h3>{t.closerTitle}</h3>
          <p>{t.closerBody}</p>
          <div className="kpi-train-closer-actions">
            <a href="#training-enquiry" className="kpi-button">
              {t.closerCta} <span aria-hidden="true">↗</span>
            </a>
            <a href={academyHome} target="_blank" rel="noreferrer" className="kpi-train-closer-link">
              {t.closerAcademy}
            </a>
          </div>
        </aside>
      </section>

      {meetingsHref || techHref || budgetHref || revparHref ? (
        <section className="kpi-train-related border-t border-[#E3E8EB] bg-white">
          <div className="kpi-section">
            <h2 className="kpi-h2">{t.relatedTitle}</h2>
            <div className="kpi-train-related-layout">
              {meetingsHref ? (
                <article className="kpi-train-related-primary">
                  <span className="kpi-train-related-accent" aria-hidden="true" />
                  <h3>{t.insightMeetings}</h3>
                  <Link href={meetingsHref} className="kpi-train-related-cta">
                    {t.readArticle}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </article>
              ) : null}
              <div className="kpi-train-related-stack">
                {techHref ? (
                  <article className="kpi-train-related-secondary">
                    <h3>{t.insightTech}</h3>
                    <Link href={techHref} className="kpi-train-related-cta">
                      {t.readArticle}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </article>
                ) : null}
                {budgetHref ? (
                  <article className="kpi-train-related-secondary">
                    <h3>{t.toolBudget}</h3>
                    <Link href={budgetHref} className="kpi-train-related-cta">
                      {t.useTool}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </article>
                ) : null}
                {revparHref ? (
                  <article className="kpi-train-related-secondary">
                    <h3>{t.toolRevpar}</h3>
                    <Link href={revparHref} className="kpi-train-related-cta">
                      {t.useTool}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </article>
                ) : null}
                <article className="kpi-train-related-secondary">
                  <h3>{t.academyCta}</h3>
                  <a href={academyDiscover} target="_blank" rel="noreferrer" className="kpi-train-related-cta">
                    {t.seeCourse}
                    <span aria-hidden="true">↗</span>
                  </a>
                </article>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <TrainingEnquiry locale={locale} />
      <TrainingStickyCta label={t.cta} />
    </SiteShell>
  );
}
