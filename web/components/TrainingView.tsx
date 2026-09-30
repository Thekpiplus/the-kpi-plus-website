import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
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
  { name: "The KPI Plus Academy", src: "/brand/KPIPlus_Horizontal_FullColor.svg", href: academyHome, alt: "The KPI Plus Academy" },
  { name: "Australia Smart", src: "/brand/partners/australia-smart.png", href: "https://www.australiasmart.com.au", alt: "Australia Smart Edu Biz Coach" },
] as const;

const photos = {
  hero: "/media/internship-workshop-speaking_d360672e.webp",
  group: "/media/hospitality-training-group_cdf6d58f.webp",
  circle: "/media/service-quality-circle_e4c75522.webp",
  seminar: "/media/business-seminar-speaking_b934063e.webp",
  nate: "/media/natenapit-portrait_f7cdd1a1.webp",
  leadership: "/media/leadership-training-nate_5b9b1ef7.webp",
} as const;

const copy = {
  th: {
    crumb: "โซลูชัน",
    crumbCurrent: "ฝึกอบรมและพัฒนาทีม",
    eyebrow: "พัฒนาทีมสำหรับโรงแรมและธุรกิจบริการ",
    title: "พัฒนาทีมและทักษะสำหรับโรงแรมและธุรกิจบริการ",
    lead: "คนที่ทำงานร่วมกันได้ดี ช่วยให้แผนธุรกิจเกิดขึ้นจริง เดอะ เคพีไอ พลัส ออกแบบการอบรม เวิร์กช็อป Team Building และกิจกรรมพัฒนาคนสำหรับโรงแรมและองค์กรบริการ ตั้งแต่ Revenue และ Digital Marketing ไปจนถึงคุณภาพบริการ ภาวะผู้นำ เทคโนโลยี และ AI",
    leadClose: "เลือกพัฒนาทีมจากโจทย์ขององค์กร หรือเลือกเรียนหลักสูตรและกิจกรรมผ่าน The KPI Plus Academy",
    cta: "ปรึกษาเรื่องพัฒนาทีม",
    academyCta: "ดูหลักสูตรและกิจกรรมของ Academy",
    underCta: "ส่งโจทย์ของทีม หรือสำรวจหลักสูตรที่เปิดให้เรียน",
    photoAlt: "คุณเนตรบรรยายและฝึกทักษะกับผู้เข้าร่วมในงานอบรม",
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
    topicsTitle: "หัวข้อที่เราช่วยพัฒนา",
    topics: [
      ["ธุรกิจโรงแรมและการเติบโต", "Revenue Management, Commercial Management, ช่องทางขาย, Direct Booking, Digital Marketing และการทำงานร่วมกันระหว่าง Revenue, Sales, Marketing, Reservations และ Operations"],
      ["การบริการและประสบการณ์ลูกค้า", "การสื่อสารกับลูกค้า การเข้าใจความต้องการ การรับมือสถานการณ์ในงานบริการ และการส่งต่องานระหว่างทีม"],
      ["ภาวะผู้นำและการพัฒนาคน", "การสื่อสารของหัวหน้างาน การให้คำแนะนำ การสร้างความมั่นใจในทีม และการเตรียมคนสำหรับบทบาทใหม่"],
      ["Team Building และการทำงานร่วมกัน", "กิจกรรมที่ช่วยให้ทีมเห็นวิธีคิดของกันและกัน ฝึกการร่วมมือ และนำสิ่งที่ได้กลับไปใช้ในงานประจำวัน"],
      ["เทคโนโลยี ดิจิทัล และ AI", "การใช้ระบบและเครื่องมือให้เหมาะกับงาน ฝึกตั้งคำถามกับข้อมูล ทดลองใช้ AI กับขั้นตอนที่มีอยู่ และตรวจทานผลก่อนนำไปใช้"],
    ],
    topicsNote: "หัวข้อและระดับความลึกจะปรับตามผู้เข้าร่วม ตั้งแต่พนักงานที่เพิ่งเริ่มงานจนถึงหัวหน้าทีมและผู้บริหาร",
    practiceTitle: "ทำไมเราให้ทีมฝึกกับสถานการณ์จริง",
    practiceBody:
      "การฟังเนื้อหาเป็นจุดเริ่มต้น แต่ทีมยังต้องมีโอกาสลองคิด ลองตัดสินใจ และได้รับการสนับสนุนเมื่อนำสิ่งที่เรียนรู้กลับไปทำงาน",
    practiceStudy:
      "งานวิจัยจากผู้จัดการแผนก 398 คนในโรงแรมห้าดาวของประเทศไทย ศึกษาความสัมพันธ์ของการเรียนรู้จากประสบการณ์ ความมั่นใจในตนเอง และทักษะวิชาชีพ อีกงานวิจัยในธุรกิจโรงแรมพบว่าการสนับสนุนจากหัวหน้างานเกี่ยวข้องกับการนำความรู้จากการอบรมไปใช้ ผลการศึกษาเหล่านี้ช่วยอธิบายเหตุผลที่เราออกแบบกิจกรรมให้มีทั้งการฝึกและการวางแผนหลังเรียนรู้ โดยผลลัพธ์ของแต่ละองค์กรยังต้องประเมินจากบริบทของตนเอง",
    sourceLabel: "ที่มา",
    sourceStudy: "ScienceDirect – ประสบการณ์การเรียนรู้และความมั่นใจของหัวหน้างานโรงแรมในไทย",
    nateTitle: "งานด้าน Training นำโดยคุณเนตร",
    nateName: "คุณเนตรนภิส อิสรนิรันดร์",
    nateNameEn: "Natenapit Isaraniran · Nate",
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
    measureBody:
      "วิธีประเมินจะเลือกตามเป้าหมายของงาน เช่น การมีส่วนร่วม ความมั่นใจก่อนและหลังเรียนรู้ การทดลองใช้วิธีทำงานใหม่ และความคืบหน้าของสิ่งที่ทีมตกลงจะทำต่อ เราใช้ข้อมูลเหล่านี้เพื่อทบทวนว่าทีมได้ประโยชน์ตรงไหน และควรพัฒนาเรื่องใดเพิ่ม",
    closerTitle: "เริ่มจากทีมของคุณ",
    closerBody: "บอกเราว่าคุณอยากพัฒนาใคร ทีมกำลังเจอสถานการณ์ใด และอยากให้พวกเขาทำอะไรได้ดีขึ้น เราจะช่วยแนะนำรูปแบบการเรียนรู้ที่เหมาะสม",
    closerCta: "ปรึกษาเรื่องอบรมและ Team Building",
    closerAcademy: "สำรวจ The KPI Plus Academy",
    relatedTitle: "อ่านและลองใช้ต่อ",
    details: "ดูรายละเอียด",
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
    crumbCurrent: "Training & Team Development",
    eyebrow: "Team development for hotels and hospitality businesses",
    title: "Team and skills development for hotels and hospitality businesses",
    lead: "People who work well together help a business plan happen. The KPI Plus designs training, workshops, team building, and people-development work for hotels and hospitality organisations, from revenue and digital marketing through to service quality, leadership, technology, and AI.",
    leadClose: "Develop the team from the organisation’s brief, or join a course and event through The KPI Plus Academy.",
    cta: "Talk about team development",
    academyCta: "See Academy courses and events",
    underCta: "Send the team brief, or browse open courses.",
    photoAlt: "Khun Nate speaking and practising skills with training participants",
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
    topicsTitle: "Topics we can develop",
    topics: [
      ["Hotel business and growth", "Revenue management, commercial management, sales channels, direct booking, digital marketing, and how Revenue, Sales, Marketing, Reservations, and Operations work together."],
      ["Service and guest experience", "Talking with guests, understanding what they need, handling service situations, and handing work between teams."],
      ["Leadership and people development", "How supervisors communicate, give guidance, build team confidence, and prepare people for a new role."],
      ["Team building and working together", "Activities that help the team see how others think, practise cooperation, and take what they learned back into daily work."],
      ["Technology, digital skills, and AI", "Using systems and tools that fit the work, asking better questions of the data, trying AI on an existing step, and checking the result before it is used."],
    ],
    topicsNote: "The topic and depth are adjusted to the participants, from people just starting work to team leads and executives.",
    practiceTitle: "Why we have the team practise on real situations",
    practiceBody: "Hearing the content is a start. The team still needs a chance to think, decide, and get support when they take the learning back to work.",
    practiceStudy:
      "A study of 398 department managers in five-star hotels in Thailand looked at the relationship between experiential learning, self-efficacy, and professional skills. Other hotel-business research found that supervisor support is linked with using training knowledge at work. These studies help explain why we design activities with both practice and a plan after learning. Results for each organisation still have to be judged in its own context.",
    sourceLabel: "Source",
    sourceStudy: "ScienceDirect – experiential learning and self-efficacy among Thai hotel managers",
    nateTitle: "Training work is led by Nate",
    nateName: "Natenapit Isaraniran",
    nateNameEn: "เนตรนภิส อิสรนิรันดร์ · Nate",
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
    measureBody:
      "The review method is chosen from the goal of the work, such as participation, confidence before and after learning, trying a new way of working, and progress on what the team agreed to do next. We use that information to see where the team gained, and what to develop further.",
    closerTitle: "Start with your team",
    closerBody: "Tell us who you want to develop, what the team is facing, and what they should do better. We will help suggest a learning format that fits.",
    closerCta: "Talk about training and team building",
    closerAcademy: "Explore The KPI Plus Academy",
    relatedTitle: "Read and try next",
    details: "See details",
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
    crumbCurrent: "Обучение и развитие команды",
    eyebrow: "Развитие команды для отелей и hospitality-бизнеса",
    title: "Развитие команды и навыков для отелей и hospitality-бизнеса",
    lead: "Люди, которые умеют работать вместе, помогают бизнес-плану состояться. The KPI Plus проектирует обучение, воркшопы, Team Building и развитие людей для отелей и организаций сферы услуг: от Revenue и Digital Marketing до качества сервиса, лидерства, технологий и ИИ.",
    leadClose: "Развивайте команду от задачи организации или выбирайте курс и мероприятие в The KPI Plus Academy.",
    cta: "Обсудить развитие команды",
    academyCta: "Смотреть курсы и события Academy",
    underCta: "Отправьте задачу команды или посмотрите открытые курсы.",
    photoAlt: "Кхун Нате проводит обучение и практику с участниками",
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
    topicsTitle: "Темы, которые мы помогаем развивать",
    topics: [
      ["Отельный бизнес и рост", "Revenue Management, Commercial Management, каналы продаж, Direct Booking, Digital Marketing и совместная работа Revenue, Sales, Marketing, Reservations и Operations."],
      ["Сервис и опыт гостя", "Общение с гостем, понимание потребности, работа с ситуациями в сервисе и передача работы между командами."],
      ["Лидерство и развитие людей", "Как руководитель говорит, даёт рекомендации, укрепляет уверенность команды и готовит людей к новой роли."],
      ["Team Building и совместная работа", "Активности, которые помогают увидеть мышление друг друга, тренировать сотрудничество и вернуть полученное в ежедневную работу."],
      ["Технологии, цифровые навыки и ИИ", "Использовать системы и инструменты по задаче, лучше спрашивать данные, пробовать ИИ на существующем шаге и проверять результат до применения."],
    ],
    topicsNote: "Тема и глубина подстраиваются под участников: от людей, которые только начинают работу, до руководителей команд и менеджмента.",
    practiceTitle: "Почему мы даём команде практиковать реальные ситуации",
    practiceBody: "Услышать содержание — только начало. Команде ещё нужна возможность подумать, решить и получить поддержку, когда знание возвращается в работу.",
    practiceStudy:
      "Исследование 398 менеджеров отделов в пятизвёздочных отелях Таиланда изучало связь обучения из опыта, уверенности в себе и профессиональных навыков. Другие работы в отельном бизнесе показывают, что поддержка руководителя связана с применением знаний после обучения. Эти результаты помогают объяснить, почему мы проектируем активность и с практикой, и с планом после обучения. Результат каждой организации всё равно нужно оценивать в её контексте.",
    sourceLabel: "Источник",
    sourceStudy: "ScienceDirect – обучение из опыта и уверенность руководителей отелей в Таиланде",
    nateTitle: "Направление Training ведёт Nate",
    nateName: "Natenapit Isaraniran",
    nateNameEn: "เนตรนภิส อิสรนิรันดร์ · Nate",
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
    measureBody:
      "Способ оценки выбираем по цели работы: участие, уверенность до и после обучения, проба нового способа работы и прогресс по тому, что команда согласилась делать дальше. Эти данные помогают увидеть, где команда получила пользу и что развивать дальше.",
    closerTitle: "Начните со своей команды",
    closerBody: "Напишите, кого хотите развивать, с какой ситуацией сталкивается команда и что они должны делать лучше. Мы подскажем подходящий формат обучения.",
    closerCta: "Обсудить обучение и Team Building",
    closerAcademy: "Открыть The KPI Plus Academy",
    relatedTitle: "Читать и пробовать дальше",
    details: "Подробнее",
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
    crumbCurrent: "培訓與團隊發展",
    eyebrow: "為飯店與服務業發展團隊",
    title: "飯店與服務業的團隊與技能發展",
    lead: "能一起把事情做成的人，會讓商業計畫真正發生。The KPI Plus 為飯店與服務業組織設計培訓、工作坊、Team Building 與人才發展活動，從 Revenue 與 Digital Marketing，到服務品質、領導力、科技與 AI。",
    leadClose: "可依組織課題客製發展團隊，或透過 The KPI Plus Academy 選擇課程與活動。",
    cta: "諮詢團隊發展",
    academyCta: "查看 Academy 課程與活動",
    underCta: "先送出團隊課題，或瀏覽開放課程。",
    photoAlt: "Khun Nate 在培訓中帶領學員練習",
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
    topicsTitle: "我們能協助發展的主題",
    topics: [
      ["飯店事業與成長", "Revenue Management、Commercial Management、銷售通路、Direct Booking、Digital Marketing，以及 Revenue、Sales、Marketing、Reservations 與 Operations 如何一起工作。"],
      ["服務與顧客體驗", "與客人溝通、理解需求、處理服務現場情況，以及團隊之間的交接。"],
      ["領導力與人才發展", "主管如何溝通、給予建議、建立團隊信心，以及為新角色做準備。"],
      ["Team Building 與合作", "幫助團隊看見彼此想法、練習合作，並把所得帶回日常工作的活動。"],
      ["科技、數位技能與 AI", "依工作選擇系統與工具、對資料提出更好的問題、在既有步驟試用 AI，並在使用前檢查結果。"],
    ],
    topicsNote: "主題與深度會依參加者調整，從剛開始工作的同仁，到團隊主管與高階主管。",
    practiceTitle: "為什麼我們讓團隊用真實情境練習",
    practiceBody: "聽完內容只是起點。團隊還需要有機會思考、做決定，並在把所學帶回工作時得到支持。",
    practiceStudy:
      "一項針對泰國五星級飯店 398 位部門經理的研究，探討經驗學習、自我效能與專業技能的關係。其他飯店研究也發現，主管支持與把培訓知識用回工作有關。這些研究幫助說明，為什麼我們把活動設計成既有練習、也有學習後的計畫。每個組織的結果，仍須依自身情境評估。",
    sourceLabel: "來源",
    sourceStudy: "ScienceDirect – 泰國飯店主管的經驗學習與自我效能",
    nateTitle: "Training 工作由 Nate 主導",
    nateName: "Natenapit Isaraniran",
    nateNameEn: "เนตรนภิส อิสรนิรันดร์ · Nate",
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
    measureBody:
      "評估方式依工作目標選擇，例如參與程度、學習前後的信心、嘗試新工作方法，以及團隊約定後續事項的進度。我們用這些資料回顧團隊在哪裡得到幫助，以及還該發展什麼。",
    closerTitle: "從你的團隊開始",
    closerBody: "告訴我們你想發展誰、團隊正面對什麼情況，以及希望他們把哪件事做得更好。我們會協助建議適合的學習形式。",
    closerCta: "諮詢培訓與 Team Building",
    closerAcademy: "探索 The KPI Plus Academy",
    relatedTitle: "接著閱讀與試用",
    details: "查看詳情",
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
      <PageHero>
        <nav aria-label="Breadcrumb" className="text-sm text-white/70">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={solutions} className="hover:text-white">
                {t.crumb}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true">/</span>
              <span className="text-white">{solutionNavLabel("/solutions/hotel-training-team-development", locale)}</span>
            </li>
          </ol>
        </nav>
        <p className="kpi-kicker mt-5 text-[#F2F8E2]">{t.eyebrow}</p>
        <h1 className="kpi-h1 mt-5">{t.title}</h1>
        <p className="kpi-lead mt-5 text-white/72">{t.lead}</p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/64">{t.leadClose}</p>
        <div className="kpi-actions">
          <a href="#training-enquiry" className="kpi-button">
            {t.cta} <ArrowUpRight className="h-4 w-4" />
          </a>
          <a href={academyDiscover} target="_blank" rel="noreferrer" className="kpi-button-ghost">
            {t.academyCta}
          </a>
        </div>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/64">{t.underCta}</p>
      </PageHero>

      <section className="kpi-section">
        <div className="kpi-split">
          <div>
            <h2 className="kpi-h2">{t.problemsTitle}</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#555555]">{t.problemsLead}</p>
            <p className="mt-8 text-sm font-extrabold uppercase tracking-[.12em] text-[#0B6660]">{t.fitTitle}</p>
            <div className="mt-5 grid gap-4">
              {t.problems.map((item, index) => (
                <article key={item} className="kpi-card flex gap-4 p-6">
                  <span className="kpi-latin text-sm font-black tracking-[.14em] text-[#0B6660]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base leading-7 text-[#555555]">{item}</p>
                </article>
              ))}
            </div>
          </div>
          <figure className="kpi-home-photo">
            <img src={photos.hero} alt={t.photoAlt} width={1200} height={900} />
          </figure>
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.formatsTitle}</h2>
          <div className="kpi-grid-2 mt-10">
            {t.formats.map(([num, title, body]) => (
              <article key={num} className="kpi-card relative overflow-hidden p-7">
                <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                <span className="kpi-latin text-sm font-black tracking-[.16em] text-[#0B6660]">{num}</span>
                <h3 className="mt-5 text-xl font-extrabold text-[#3B3B3B]">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#555555]">{body}</p>
              </article>
            ))}
          </div>
          <div className="kpi-actions mt-10">
            <a href={academyDiscover} target="_blank" rel="noreferrer" className="kpi-button">
              {t.academyLink} <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href={academyHome} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#0B6660]">
              {t.academyOrg}
            </a>
          </div>
          <div className="mt-12 rounded-[1.5rem] border border-[#E3E8EB] bg-[#F4F4F4] p-6 sm:p-8">
            <h3 className="text-lg font-extrabold text-[#3B3B3B]">{t.partnersTitle}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#555555]">{t.partnersBody}</p>
            <div className="kpi-tool-grid kpi-tool-grid-3 mt-6">
              {collaborators.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.href}
                  target="_blank"
                  rel="noreferrer"
                  className="kpi-tool-card no-underline"
                >
                  <div className="flex h-24 w-full items-center justify-center rounded-xl bg-white px-4">
                    <img src={partner.src} alt={partner.alt} className="max-h-16 w-auto max-w-full object-contain" />
                  </div>
                  <p className="kpi-latin text-base font-extrabold text-[#3B3B3B]">{partner.name}</p>
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {t.gallery.map(([src, alt]) => (
              <figure key={src} className="kpi-home-photo">
                <img src={src} alt={alt} width={1200} height={900} />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.topicsTitle}</h2>
        <div className="kpi-grid-2 mt-10">
          {t.topics.map(([title, body]) => (
            <article key={title} className="kpi-card relative overflow-hidden p-7">
              <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
              <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{title}</h3>
              <p className="mt-3 text-base leading-7 text-[#555555]">{body}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-[#3B3B3B]">{t.topicsNote}</p>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.practiceTitle}</h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#555555]">{t.practiceBody}</p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#3B3B3B]">{t.practiceStudy}</p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-[#555555]">
            {t.sourceLabel}:{" "}
            <a href={studyUrl} target="_blank" rel="noreferrer" className="font-semibold text-[#0B6660]">
              {t.sourceStudy}
            </a>
          </p>
        </div>
      </section>

      <section className="kpi-section">
        <div className="kpi-split">
          <figure className="overflow-hidden rounded-[1.25rem] bg-[#F4F4F4]">
            <img
              src={photos.nate}
              alt={t.nateAlt}
              width={1200}
              height={1600}
              className="block w-full object-cover object-[center_12%]"
              style={{ aspectRatio: "3 / 4" }}
            />
          </figure>
          <div>
            <h2 className="kpi-h2">{t.nateTitle}</h2>
            <p className="mt-6 text-xl font-extrabold text-[#063F3B]">{t.nateName}</p>
            <p className="mt-2 text-sm font-semibold tracking-wide text-[#0B6660]">{t.nateNameEn}</p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#555555]">{t.nateBody}</p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#3B3B3B]">{t.nateClose}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.methodTitle}</h2>
          <ol className="mt-10 grid gap-4">
            {t.steps.map(([num, title, body]) => (
              <li key={num} className="kpi-card flex gap-4 p-6 sm:items-start">
                <span className="kpi-latin text-sm font-black tracking-[.14em] text-[#0B6660]">{num}</span>
                <div>
                  <h3 className="text-xl font-extrabold text-[#3B3B3B]">{title}</h3>
                  <p className="mt-2 text-base leading-7 text-[#555555]">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.measureTitle}</h2>
        <p className="kpi-lead mt-5">{t.measureBody}</p>
        <div className="mt-10 max-w-3xl rounded-[1.5rem] border border-[#E3E8EB] bg-white p-6 sm:p-8">
          <h3 className="text-xl font-extrabold text-[#3B3B3B]">{t.closerTitle}</h3>
          <p className="mt-4 text-base leading-8 text-[#555555]">{t.closerBody}</p>
          <div className="kpi-actions mt-6">
            <a href="#training-enquiry" className="kpi-button">
              {t.closerCta} <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href={academyHome} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#0B6660]">
              {t.closerAcademy}
            </a>
          </div>
        </div>
      </section>

      {meetingsHref || techHref || budgetHref || revparHref ? (
        <section className="border-t border-[#E3E8EB] bg-white">
          <div className="kpi-section">
            <h2 className="kpi-h2">{t.relatedTitle}</h2>
            <div className="kpi-grid-2 mt-10">
              {meetingsHref ? (
                <article className="kpi-card relative flex flex-col overflow-hidden p-7">
                  <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                  <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{t.insightMeetings}</h3>
                  <Link href={meetingsHref} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                    {t.details}
                  </Link>
                </article>
              ) : null}
              {techHref ? (
                <article className="kpi-card relative flex flex-col overflow-hidden p-7">
                  <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                  <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{t.insightTech}</h3>
                  <Link href={techHref} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                    {t.details}
                  </Link>
                </article>
              ) : null}
              {budgetHref ? (
                <article className="kpi-card relative flex flex-col overflow-hidden p-7">
                  <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                  <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{t.toolBudget}</h3>
                  <Link href={budgetHref} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                    {t.details}
                  </Link>
                </article>
              ) : null}
              {revparHref ? (
                <article className="kpi-card relative flex flex-col overflow-hidden p-7">
                  <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                  <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{t.toolRevpar}</h3>
                  <Link href={revparHref} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                    {t.details}
                  </Link>
                </article>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <TrainingEnquiry locale={locale} />
      <TrainingStickyCta label={t.cta} />
    </SiteShell>
  );
}
