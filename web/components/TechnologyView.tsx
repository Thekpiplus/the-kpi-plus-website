import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { TechnologyEnquiry } from "@/components/TechnologyEnquiry";
import { TechnologyStickyCta } from "@/components/TechnologyStickyCta";
import { solutionNavLabel } from "@/lib/nav";
import { auditHref, existingHref, localizePath, type Locale } from "@/lib/seo";

const heroPhoto = "/media/reservations-hero-desk.jpg";
const problemsPhoto = "/media/b2b-hero-meeting.jpg";
const academyDiscover = "https://thekpiplus.co.th/discover";
const studyUrl = "https://repozitorij.upr.si/IzpisGradiva.php?id=22208&lang=eng";

const methodLabels = ["MAP", "SIMPLIFY", "AUTOMATE", "CONNECT", "REVIEW"] as const;

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "AI & Automation",
    title: "นำ AI และ Automation ไปใช้จริงในโรงแรมและองค์กร",
    lead: "ลดเวลาที่ทีมใช้กับงานซ้ำ ทำให้ข้อมูลพร้อมใช้เร็วขึ้น และส่งต่องานได้ชัดเจนกว่าเดิม เดอะ เคพีไอ พลัส ช่วยสำรวจขั้นตอนงาน ออกแบบและติดตั้งระบบ AI หรือ Automation ที่เหมาะ ทดลองใช้กับทีม และปรับปรุงจนเป็นส่วนหนึ่งของวิธีทำงานประจำวัน",
    leadClose: "เราเริ่มจากสิ่งที่องค์กรอยากแก้ แล้วจึงเลือกเครื่องมือและขอบเขตการนำไปใช้",
    cta: "ปรึกษาเรื่อง AI และ Automation",
    secondary: "ขอให้ทีมช่วยทบทวนระบบโรงแรม",
    underCta: "ส่งงานที่ทีมอยากแก้ ไม่ต้องส่งรหัสผ่านหรือสิทธิ์เข้าระบบ",
    photoAlt: "ผู้บริหารโรงแรมทบทวนขั้นตอนงานบนคอมพิวเตอร์",
    problemsPhotoAlt: "ทีมหารือ workflow ก่อนเลือกใช้ Automation",
    problemsTitle: "มีเครื่องมือแล้ว แต่งานยังติดขัดอยู่ตรงไหน?",
    problemsLead:
      "ทีมอาจคัดลอกข้อมูลระหว่างหลายระบบทุกวัน ใช้เวลาทำรายงานจนข้อมูลไม่ทันการตัดสินใจ หรือต้องตอบคำถามเดิมซ้ำ ๆ ทั้งที่อยากมีเวลาดูแลลูกค้ามากขึ้น ปัญหาเหล่านี้ต้องมองทั้งขั้นตอนงาน ข้อมูล และคนที่รับผิดชอบ ก่อนเริ่มพัฒนาระบบ",
    fitTitle: "งานนี้เหมาะกับทีมที่กำลังเจอปัญหา เช่น",
    problems: [
      "รายงานต้องรวบรวมข้อมูลด้วยมือจากหลายแหล่ง",
      "Enquiry จากเว็บไซต์ LINE หรืออีเมลส่งต่อไม่ครบ",
      "พนักงานต้องค้นหาข้อมูลเดิมซ้ำก่อนตอบลูกค้า",
      "มีระบบหลายตัว แต่ข้อมูลยังไม่ไหลไปถึงคนที่ต้องใช้",
      "สนใจ AI แต่ไม่แน่ใจว่าควรเริ่มจากงานใด",
      "กังวลเรื่องความถูกต้อง สิทธิ์เข้าถึงข้อมูล และผู้ตรวจทานผล",
    ],
    methodTitle: "เดอะ เคพีไอ พลัส ช่วยตั้งแต่แผนจนถึงการใช้งาน",
    steps: [
      ["01", "สำรวจงานและเลือกจุดเริ่มต้น", "เราคุยกับคนทำงานจริง ดูว่าข้อมูลเริ่มจากไหน ผ่านมือใครบ้าง และใช้เวลาตรงจุดใด จากนั้นเลือกงานที่มีเป้าหมายชัด สามารถทดลองและวัดผลได้"],
      ["02", "ออกแบบขั้นตอนและเลือกเครื่องมือ", "กำหนดว่าระบบควรรับข้อมูลอะไร ช่วยทำขั้นตอนไหน ส่งผลให้ใคร และเมื่อใดต้องให้คนเข้ามาตรวจหรือรับช่วงต่อ เราพิจารณาทั้งระบบที่องค์กรใช้อยู่และความเป็นไปได้ในการเชื่อมต่อ"],
      ["03", "ตั้งค่า เชื่อมต่อ และทดลองใช้", "เดอะ เคพีไอ พลัส ช่วยนำ Workflow ไปใช้งานจริงตามขอบเขตที่ตกลงกัน ตั้งค่าเครื่องมือหรือ Automation เชื่อมข้อมูลในจุดที่ระบบรองรับ แล้วทดสอบกรณีปกติและกรณีที่ต้องส่งต่อให้ทีม"],
      ["04", "อบรมและส่งต่องานให้ทีม", "ทีมต้องรู้ว่าจะใช้งานอย่างไร ตรวจผลตรงไหน และแจ้งปัญหาให้ใคร เราจัดวิธีทำงานและการอบรมให้เหมาะกับผู้รับผิดชอบแต่ละบทบาท โดยสามารถเชื่อมกับการพัฒนาทักษะผ่าน The KPI Plus Academy ได้"],
      ["05", "ติดตามและปรับปรุง", "ดูเวลาที่ใช้ทำงาน ความครบถ้วนของข้อมูล ข้อผิดพลาด และความคิดเห็นของทีม แล้วปรับ Workflow ตามสิ่งที่พบหลังเริ่มใช้"],
    ],
    methodCta: "เล่างานที่คุณอยากให้ระบบช่วย",
    casesTitle: "ตัวอย่างงานที่สามารถเริ่มพิจารณา",
    cases: [
      ["01", "รายงานและการตัดสินใจ", "รวบรวมข้อมูลจากแหล่งที่มี จัดรูปแบบรายงาน และช่วยสรุปประเด็นให้ทีม Revenue, Sales หรือผู้บริหารตรวจทานก่อนตัดสินใจ"],
      ["02", "การรับ Enquiry และการส่งต่องาน", "จัดข้อมูลจากช่องทางติดต่อให้ครบขึ้น แยกประเภทคำถาม แจ้งผู้รับผิดชอบ และติดตามว่างานใดได้รับการตอบกลับแล้ว โดยให้ทีมดูแลการสนทนาที่ต้องใช้วิจารณญาณหรือความใส่ใจเป็นพิเศษ"],
      ["03", "ข้อมูลสำหรับทีมบริการ", "ช่วยให้พนักงานค้นหานโยบาย ขั้นตอน คำตอบที่ใช้บ่อย หรือข้อมูลสินค้าได้เร็วขึ้น พร้อมกำหนดวิธีตรวจสอบว่าข้อมูลยังเป็นปัจจุบัน"],
      ["04", "Marketing และการทำงานภายใน", "ช่วยเตรียมข้อมูลสำหรับแคมเปญ ร่างเนื้อหา จัดงานที่ทำซ้ำเป็นประจำ หรือสรุปการประชุมเพื่อให้เจ้าของงานนำไปตรวจและทำต่อ"],
    ],
    casesNote: "แต่ละตัวอย่างต้องประเมินจากระบบ สิทธิ์เข้าถึงข้อมูล และกระบวนการที่องค์กรใช้อยู่ก่อนกำหนดสิ่งที่จะติดตั้งจริง",
    studyTitle: "ทำไมต้องทดลองกับงานจริงก่อนขยายผล",
    studyPrinciples: [
      ["01", "เริ่มจากงานที่ขอบเขตชัด"],
      ["02", "ทดลองกับ Workflow จริง"],
      ["03", "ขยายเมื่อผลลัพธ์และความเสี่ยงยอมรับได้"],
    ],
    studyTakeawayLead: "Automation ที่ดีไม่ควรเริ่มจาก “อะไรทำได้บ้าง”",
    studyTakeawayClose: "แต่ควรเริ่มจาก “งานไหนควรทำให้ง่ายขึ้น”",
    studyBody:
      "กรณีศึกษาของโรงแรมสี่ดาวหนึ่งแห่งในอ่าวนาง จังหวัดกระบี่ รายงานว่า หลังนำ AI ไปใช้ในกระบวนการทำงานที่ศึกษา เวลาเฉลี่ยในการเช็กอินลดจาก 3.3 นาทีเป็น 2.7 นาที ผู้วิจัยยังระบุว่าการอบรมและการทยอยนำระบบมาใช้มีส่วนสำคัญต่อการปรับตัวของพนักงาน ตัวเลขนี้เป็นผลของโรงแรมที่ศึกษาเพียงแห่งเดียว จึงใช้เป็นตัวอย่างของสิ่งที่ควรวัด ไม่ใช่ผลลัพธ์ที่ทุกโรงแรมจะได้รับ",
    sourceLabel: "ที่มา",
    sourceStudy: "University of Primorska – AI in hotel operations, Ao Nang case study",
    measureTitle: "วัดผลจากงานที่เปลี่ยนไป",
    measureLead: "ก่อนเริ่ม เราตกลงสิ่งที่จะวัดร่วมกัน จากงานที่ทีมต้องใช้จริง",
    measures: [
      ["01", "Time Saved", "เวลาที่ใช้ต่อหนึ่งงาน"],
      ["02", "Manual Steps", "จำนวนขั้นตอนที่ทีมยังต้องทำเอง"],
      ["03", "Data Quality", "ความครบถ้วนและความถูกต้องของข้อมูล"],
      ["04", "Handover", "งานที่ส่งต่อสำเร็จ"],
      ["05", "Human Review", "จำนวนครั้งที่ต้องให้คนเข้ามาแก้ไข"],
    ],
    measureClose: "หลังทดลองใช้ เราดูด้วยว่าทีมใช้ระบบได้จริงหรือไม่ และลูกค้ายังได้รับการดูแลในจุดที่ต้องการคนรับผิดชอบหรือไม่",
    ownershipTitle: "ใช้ข้อมูลอย่างมีเจ้าของงาน",
    ownershipItems: [
      ["01", "ใช้ข้อมูลเท่าที่จำเป็น"],
      ["02", "กำหนดว่าใครเข้าถึงได้"],
      ["03", "เก็บและส่งต่อข้อมูลให้เหมาะสมกับงาน"],
      ["04", "มีคนตรวจก่อนใช้ผลลัพธ์ในงานสำคัญ"],
    ],
    ownershipClose: "แนวทางและเครื่องมือที่ใช้จะต้องตรวจตามลักษณะข้อมูล ระบบ และข้อกำหนดขององค์กรแต่ละแห่งก่อนเริ่มใช้งาน",
    audienceTitle: "เหมาะกับโรงแรมและองค์กรบริการอื่น",
    audienceHotel:
      "ประสบการณ์ของ เดอะ เคพีไอ พลัส ครอบคลุมงานโรงแรมด้าน Revenue, Reservations, Distribution, Marketing และระบบปฏิบัติการ เราจึงมองเห็นว่าการเปลี่ยนขั้นตอนหนึ่งอาจส่งผลต่ออีกทีมอย่างไร",
    audienceOther:
      "สำหรับธุรกิจบริการและองค์กรประเภทอื่น เราเริ่มจาก Workflow และเป้าหมายของทีมนั้นเช่นเดียวกัน ไม่ว่าจะเป็นการตอบลูกค้า การจัดการข้อมูล การทำรายงาน หรือการพัฒนาทักษะคนทำงาน",
    closerTitle: "เริ่มจากหนึ่งงานที่ทีมอยากแก้",
    closerBody: "บอกเราว่างานใดใช้เวลามาก ใครเป็นคนทำ ใช้ระบบอะไรอยู่ และอยากให้ดีขึ้นอย่างไร เราจะช่วยประเมินว่าควรเริ่มตรงไหน มีอะไรต้องเตรียม และขอบเขตการลงมือทำควรเป็นอย่างไร",
    closerCta: "ปรึกษาเรื่องการนำ AI ไปใช้จริง",
    relatedTitle: "อ่านและลองใช้ต่อ",
    details: "ดูรายละเอียด",
    readArticle: "อ่านบทความ",
    useTool: "ใช้เครื่องมือ",
    insightTech: "ทำไมการนำเทคโนโลยีโรงแรมมาใช้จึงเป็นส่วนหนึ่งของการบริหารรายได้และการเติบโต",
    insightMeetings: "ประชุม Revenue อย่างไรให้จบด้วยการตัดสินใจที่นำไปใช้ได้จริง",
    toolSearch: "ตรวจสุขภาพการค้นหาเว็บไซต์โรงแรม",
    academyLink: "ดูหลักสูตรและกิจกรรมของ The KPI Plus Academy",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "AI & Automation",
    title: "Put AI and automation into real hotel and organisation work",
    lead: "Cut the time a team spends on repeated work, get facts ready faster, and hand work on more clearly. The KPI Plus helps review the work steps, design and set up a suitable AI or automation system, try it with the team, and improve it until it is part of daily work.",
    leadClose: "We start from what the organisation wants to fix, then choose the tool and the scope of use.",
    cta: "Talk about AI and automation",
    secondary: "Ask the team to review the hotel systems",
    underCta: "Send the work the team wants to fix. Do not send a password or system access.",
    photoAlt: "A hotel manager reviewing work steps on a computer",
    problemsPhotoAlt: "A team discussing the workflow before choosing automation",
    problemsTitle: "You already have tools. Where is the work still stuck?",
    problemsLead:
      "A team may copy facts between several systems every day, spend so long on reports that the numbers miss the decision, or answer the same questions again and again when they would rather look after guests. These problems need a look at the work step, the data, and the person who owns it, before a system is built.",
    fitTitle: "This work fits teams that are facing situations such as",
    problems: [
      "Reports have to be gathered by hand from several sources",
      "Enquiries from the website, LINE, or email are not handed on in full",
      "Staff have to search the same facts again before they answer a guest",
      "There are several systems, but the facts still do not reach the person who needs them",
      "You are interested in AI, but are not sure which work to start with",
      "You worry about accuracy, who can see the data, and who reviews the result",
    ],
    methodTitle: "The KPI Plus helps from the plan through to daily use",
    steps: [
      ["01", "Review the work and choose a starting point", "We talk with the people who do the work, see where the facts start, whose hands they pass through, and where time is spent. Then we choose a task with a clear goal that can be tried and measured."],
      ["02", "Design the steps and choose the tools", "Agree what the system should take in, which step it helps, who receives the result, and when a person must check or take over. We look at the systems already in use and whether they can connect."],
      ["03", "Set up, connect, and try it", "The KPI Plus helps put the workflow into real use within the agreed scope, set up the tool or automation, connect data where the systems allow, and test both the normal case and the case that must be handed to the team."],
      ["04", "Train and hand the work to the team", "The team needs to know how to use it, where to check the result, and whom to tell when something is wrong. We set the way of working and the training to fit each role, and can connect this to skill development through The KPI Plus Academy."],
      ["05", "Follow and improve", "Look at time spent, completeness of the facts, errors, and what the team says, then adjust the workflow from what is found after go-live."],
    ],
    methodCta: "Tell us the work you want the system to help with",
    casesTitle: "Examples of work that can be considered first",
    cases: [
      ["01", "Reports and decisions", "Gather facts from the sources you have, shape the report, and help summarise the points for Revenue, Sales, or executives to review before they decide."],
      ["02", "Enquiries and hand-over", "Make contact-channel facts more complete, sort the question type, notify the owner, and follow which work has been answered, while the team still looks after conversations that need judgement or extra care."],
      ["03", "Information for the service team", "Help staff find policy, steps, frequent answers, or product facts faster, and set a way to check that the facts are still current."],
      ["04", "Marketing and internal work", "Help prepare campaign facts, draft copy, organise repeated tasks, or summarise a meeting so the owner can review and continue."],
    ],
    casesNote: "Each example still has to be judged from the systems, data access, and process the organisation already uses, before anything is installed.",
    studyTitle: "Why try it on real work before you scale",
    studyPrinciples: [
      ["01", "Start with work that has a clear scope"],
      ["02", "Try it on a real workflow"],
      ["03", "Scale when the result and the risk are acceptable"],
    ],
    studyTakeawayLead: "Good automation should not start from “what can we build?”",
    studyTakeawayClose: "It should start from “which work should become easier?”",
    studyBody:
      "A case study of one four-star hotel in Ao Nang, Krabi, reported that after AI was used in the process under study, average check-in time fell from 3.3 minutes to 2.7 minutes. The researchers also noted that training and a staged roll-out mattered for staff adaptation. These figures are the result of that one hotel, so they are an example of what to measure, not a result every hotel will get.",
    sourceLabel: "Source",
    sourceStudy: "University of Primorska – AI in hotel operations, Ao Nang case study",
    measureTitle: "Measure the work that changed",
    measureLead: "Before we start, we agree what will be measured from the work the team actually needs.",
    measures: [
      ["01", "Time Saved", "Time spent per task"],
      ["02", "Manual Steps", "How many steps the team still does by hand"],
      ["03", "Data Quality", "Completeness and accuracy of the facts"],
      ["04", "Handover", "Work handed on successfully"],
      ["05", "Human Review", "How often a person has to step in to correct it"],
    ],
    measureClose: "After the trial, we also look at whether the team actually uses the system, and whether guests still get care at the points that need a person.",
    ownershipTitle: "Use data with a clear owner",
    ownershipItems: [
      ["01", "Use only the facts that are needed"],
      ["02", "Name who can access them"],
      ["03", "Keep and hand on facts in a way that fits the work"],
      ["04", "Have a person review before results are used in important work"],
    ],
    ownershipClose: "The approach and the tools still have to be checked against the data type, the systems, and each organisation’s rules before use starts.",
    audienceTitle: "For hotels and other hospitality organisations",
    audienceHotel:
      "The KPI Plus experience covers hotel work in revenue, reservations, distribution, marketing, and operations, so we can see how changing one step may affect another team.",
    audienceOther:
      "For other service businesses and organisations, we start from that team’s workflow and goal in the same way, whether the work is answering guests, managing facts, making reports, or developing people’s skills.",
    closerTitle: "Start with one task the team wants to fix",
    closerBody: "Tell us which work takes time, who does it, which systems you use, and what should get better. We will help judge where to start, what to prepare, and what the scope of the work should be.",
    closerCta: "Talk about putting AI into real work",
    relatedTitle: "Read and try next",
    details: "See details",
    readArticle: "Read article",
    useTool: "Use tool",
    insightTech: "Why hotel technology adoption is part of revenue and growth work",
    insightMeetings: "How a revenue meeting can end with a decision the team can use",
    toolSearch: "Hotel website searchability check",
    academyLink: "See courses and events at The KPI Plus Academy",
  },
  ru: {
    crumb: "Решения",
    eyebrow: "AI & Automation",
    title: "Внедрить ИИ и автоматизацию в реальную работу отеля и организации",
    lead: "Сократить время на повторную работу, быстрее готовить данные и яснее передавать задачи. The KPI Plus помогает разобрать шаги, спроектировать и установить подходящую систему ИИ или автоматизации, попробовать её с командой и довести до ежедневного способа работы.",
    leadClose: "Мы начинаем с того, что организация хочет исправить, затем выбираем инструмент и границы внедрения.",
    cta: "Обсудить ИИ и автоматизацию",
    secondary: "Попросить команду проверить системы отеля",
    underCta: "Отправьте работу, которую команда хочет исправить. Не отправляйте пароль или доступ к системам.",
    photoAlt: "Управляющий отеля разбирает шаги работы на компьютере",
    problemsPhotoAlt: "Команда обсуждает workflow до выбора автоматизации",
    problemsTitle: "Инструменты уже есть. Где работа всё ещё буксует?",
    problemsLead:
      "Команда может каждый день копировать данные между системами, так долго делать отчёты, что цифры опаздывают к решению, или снова отвечать на одни и те же вопросы, хотя хотела бы больше времени на гостя. Эти проблемы нужно смотреть через шаг работы, данные и ответственного человека, прежде чем строить систему.",
    fitTitle: "Эта работа подходит командам, которые сталкиваются с такими ситуациями",
    problems: [
      "Отчёты приходится собирать вручную из нескольких источников",
      "Enquiry с сайта, LINE или email передаются не полностью",
      "Сотрудники снова ищут те же факты, прежде чем ответить гостю",
      "Систем несколько, но данные всё равно не доходят до того, кому они нужны",
      "Интересен ИИ, но неясно, с какой работы начать",
      "Беспокоит точность, доступ к данным и кто проверяет результат",
    ],
    methodTitle: "The KPI Plus помогает от плана до ежедневного использования",
    steps: [
      ["01", "Разобрать работу и выбрать старт", "Говорим с людьми, которые делают работу, смотрим, откуда начинаются данные, через чьи руки они проходят и где уходит время. Затем выбираем задачу с ясной целью, которую можно попробовать и измерить."],
      ["02", "Спроектировать шаги и выбрать инструменты", "Договориться, какие данные система принимает, какой шаг помогает, кто получает результат и когда человек должен проверить или принять работу. Смотрим текущие системы и возможность связи."],
      ["03", "Настроить, связать и попробовать", "The KPI Plus помогает внедрить Workflow в согласованных границах, настроить инструмент или автоматизацию, связать данные там, где системы это позволяют, и проверить обычный случай и случай, который нужно передать команде."],
      ["04", "Обучить и передать работу команде", "Команда должна знать, как пользоваться, где проверять результат и кому сказать о проблеме. Способ работы и обучение подстраиваем под роли и можем связать с развитием навыков через The KPI Plus Academy."],
      ["05", "Сопровождать и улучшать", "Смотрим время, полноту данных, ошибки и мнение команды, затем правим Workflow по тому, что видно после запуска."],
    ],
    methodCta: "Расскажите, какую работу должна помочь система",
    casesTitle: "Примеры работы, с которой можно начать",
    cases: [
      ["01", "Отчёты и решения", "Собрать данные из доступных источников, оформить отчёт и помочь коротко назвать суть для Revenue, Sales или руководства до решения."],
      ["02", "Enquiry и передача работы", "Сделать данные с каналов обращения полнее, разделить тип вопроса, уведомить ответственного и следить, какая работа уже получила ответ, оставляя команде разговоры, где нужны суждение или особое внимание."],
      ["03", "Данные для сервисной команды", "Помочь сотрудникам быстрее находить политику, шаги, частые ответы или факты о продукте и задать способ проверки, что данные ещё актуальны."],
      ["04", "Маркетинг и внутренняя работа", "Помочь подготовить данные для кампании, черновик текста, повторяющиеся задачи или итог совещания, чтобы владелец работы проверил и продолжил."],
    ],
    casesNote: "Каждый пример всё равно нужно оценить по системам, доступу к данным и процессу организации, прежде чем что-то устанавливать.",
    studyTitle: "Почему сначала пробовать на реальной работе",
    studyPrinciples: [
      ["01", "Начать с работы с ясными границами"],
      ["02", "Пробовать на реальном Workflow"],
      ["03", "Масштабировать, когда результат и риск приемлемы"],
    ],
    studyTakeawayLead: "Хорошую автоматизацию не стоит начинать с «что можно сделать»",
    studyTakeawayClose: "А с «какую работу стоит сделать проще»",
    studyBody:
      "В кейсе одного четырёхзвёздочного отеля в Ао Нанге, Краби, после внедрения ИИ в изучаемый процесс среднее время check-in снизилось с 3,3 до 2,7 минуты. Исследователи также отметили, что обучение и поэтапное внедрение важны для адаптации сотрудников. Эти цифры — результат одного отеля, поэтому это пример того, что стоит измерять, а не результат, который получит каждый отель.",
    sourceLabel: "Источник",
    sourceStudy: "University of Primorska – ИИ в операциях отеля, кейс Ao Nang",
    measureTitle: "Измерять работу, которая изменилась",
    measureLead: "До старта договариваемся, что измеряем по работе, которая команде реально нужна.",
    measures: [
      ["01", "Time Saved", "Время на одну задачу"],
      ["02", "Manual Steps", "Сколько шагов команда всё ещё делает сама"],
      ["03", "Data Quality", "Полнота и точность данных"],
      ["04", "Handover", "Успешно переданная работа"],
      ["05", "Human Review", "Сколько раз человеку нужно вмешиваться"],
    ],
    measureClose: "После пробы смотрим и то, пользуется ли команда системой на деле, и получает ли гость внимание там, где нужен человек.",
    ownershipTitle: "Использовать данные с ясным владельцем",
    ownershipItems: [
      ["01", "Использовать только нужные данные"],
      ["02", "Определить, кто имеет доступ"],
      ["03", "Хранить и передавать данные в соответствии с работой"],
      ["04", "Проверять результат человеком перед важным использованием"],
    ],
    ownershipClose: "Подход и инструменты всё равно нужно проверить по типу данных, системам и правилам каждой организации до начала использования.",
    audienceTitle: "Для отелей и других организаций сферы услуг",
    audienceHotel:
      "Опыт The KPI Plus охватывает отельную работу в Revenue, Reservations, Distribution, Marketing и операциях, поэтому видно, как смена одного шага может затронуть другую команду.",
    audienceOther:
      "Для других сервисных бизнесов и организаций мы так же начинаем с Workflow и цели этой команды: ответ гостю, работа с данными, отчёты или развитие навыков людей.",
    closerTitle: "Начните с одной задачи, которую команда хочет исправить",
    closerBody: "Напишите, какая работа занимает время, кто её делает, какие системы уже есть и что должно стать лучше. Мы поможем оценить, с чего начать, что подготовить и какими должны быть границы работы.",
    closerCta: "Обсудить внедрение ИИ в реальную работу",
    relatedTitle: "Читать и пробовать дальше",
    details: "Подробнее",
    readArticle: "Читать статью",
    useTool: "Использовать инструмент",
    insightTech: "Почему внедрение отельных технологий — часть работы с доходом и ростом",
    insightMeetings: "Как совещание по Revenue заканчивается решением, которое можно использовать",
    toolSearch: "Проверка поисковой готовности сайта отеля",
    academyLink: "Смотреть курсы и события The KPI Plus Academy",
  },
  zh: {
    crumb: "方案",
    eyebrow: "AI & Automation",
    title: "把 AI 與 Automation 用回飯店與組織的實際工作",
    lead: "減少團隊花在重複工作上的時間，讓資料更快能用，交接也更清楚。The KPI Plus 協助檢視工作步驟、設計並安裝合適的 AI 或 Automation 系統，與團隊試用，再調整到成為日常做法的一部分。",
    leadClose: "我們從組織想解決的事開始，再選擇工具與導入範圍。",
    cta: "諮詢 AI 與 Automation",
    secondary: "請團隊協助檢視飯店系統",
    underCta: "先送出團隊想改善的工作。請不要傳送密碼或系統權限。",
    photoAlt: "飯店管理者在電腦上檢視工作步驟",
    problemsPhotoAlt: "團隊在選擇 Automation 前討論 workflow",
    problemsTitle: "已經有工具了，工作卡在哪裡？",
    problemsLead:
      "團隊可能每天在多個系統之間複製資料、做報表做到數字趕不上決策，或反覆回答同一組問題，但其實更想把時間留給客人。這些問題要先看工作步驟、資料，以及誰負責，才能開始做系統。",
    fitTitle: "這項工作適合正面對這些情況的團隊",
    problems: [
      "報表必須用手從多個來源彙整",
      "來自網站、LINE 或電子郵件的 Enquiry 交接不完整",
      "員工在回答客人前，必須再找一次同樣的資料",
      "系統有很多套，但資料仍到不了必須使用的人",
      "對 AI 有興趣，但不確定該從哪一件工作開始",
      "擔心正確性、資料存取權，以及誰要檢查結果",
    ],
    methodTitle: "The KPI Plus 從計畫一路協助到實際使用",
    steps: [
      ["01", "檢視工作並選擇起點", "我們與實際做事的人對談，看資料從哪裡開始、經過誰的手、時間花在哪。然後選擇目標清楚、能試用也能衡量的工作。"],
      ["02", "設計步驟並選擇工具", "約定系統該接收什麼資料、幫忙哪個步驟、結果給誰，以及何時必須由人檢查或接手。我們會看組織現有系統，以及能否串接。"],
      ["03", "設定、串接並試用", "The KPI Plus 依談好的範圍，把 Workflow 用到實際工作、設定工具或 Automation、在系統允許處串接資料，並測試一般情況與必須交給團隊的情況。"],
      ["04", "培訓並把工作交給團隊", "團隊必須知道怎麼用、在哪裡檢查結果，以及出問題要通知誰。我們依各角色安排做法與培訓，也可以接到 The KPI Plus Academy 的技能發展。"],
      ["05", "追蹤並改善", "看工作時間、資料是否完整、錯誤，以及團隊意見，再依開始使用後看到的情況調整 Workflow。"],
    ],
    methodCta: "告訴我們，你希望系統幫忙哪一件工作",
    casesTitle: "可以先考慮的工作例子",
    cases: [
      ["01", "報表與決策", "從既有來源彙整資料、整理報表格式，並協助摘要重點，讓 Revenue、Sales 或高階主管在決策前檢查。"],
      ["02", "接收 Enquiry 與交接", "把各聯絡管道的資料整理得更完整、分類問題、通知負責人，並追蹤哪些工作已回覆；需要判斷或特別照顧的對話仍由團隊處理。"],
      ["03", "服務團隊所需資料", "協助員工更快找到政策、步驟、常用答覆或商品資料，並約定如何檢查資料是否仍是最新。"],
      ["04", "行銷與內部作業", "協助準備活動資料、草擬內容、整理重複工作，或整理會議重點，讓負責人檢查後繼續做。"],
    ],
    casesNote: "每個例子都還必須依組織現有系統、資料存取權與流程評估，才能決定實際要安裝什麼。",
    studyTitle: "為什麼要先用真實工作試過，再擴大",
    studyPrinciples: [
      ["01", "從範圍清楚的工作開始"],
      ["02", "用真實 Workflow 試用"],
      ["03", "在結果與風險可接受時再擴大"],
    ],
    studyTakeawayLead: "好的 Automation 不該從「能做什麼」開始",
    studyTakeawayClose: "而該從「哪一件工作該變得更簡單」開始",
    studyBody:
      "甲米府 Ao Nang 一間四星飯店的案例研究指出，在所研究的流程導入 AI 後，平均 check-in 時間從 3.3 分鐘降到 2.7 分鐘。研究也提到，培訓與分階段導入對員工適應很重要。這些數字只是該飯店的結果，因此是「該量什麼」的例子，不是每間飯店都會得到的結果。",
    sourceLabel: "來源",
    sourceStudy: "University of Primorska – 飯店營運中的 AI，Ao Nang 案例",
    measureTitle: "從改變了的工作來衡量",
    measureLead: "開始前，我們會一起約定要量什麼，依據團隊實際需要的工作。",
    measures: [
      ["01", "Time Saved", "一件工作花多少時間"],
      ["02", "Manual Steps", "團隊還必須自己做幾個步驟"],
      ["03", "Data Quality", "資料是否完整正確"],
      ["04", "Handover", "交接是否成功"],
      ["05", "Human Review", "必須由人進來修正的次數"],
    ],
    measureClose: "試用之後，也會看團隊是否真的在用系統，以及客人在需要有人負責的地方是否仍被照顧到。",
    ownershipTitle: "使用資料時要有明確負責人",
    ownershipItems: [
      ["01", "只用必要的資料"],
      ["02", "約定誰能存取"],
      ["03", "依工作妥善保存與交接資料"],
      ["04", "重要工作使用結果前先由人檢查"],
    ],
    ownershipClose: "做法與工具仍須依資料性質、系統，以及各組織規定檢查後，才能開始使用。",
    audienceTitle: "適合飯店，也適合其他服務業組織",
    audienceHotel:
      "The KPI Plus 的經驗涵蓋飯店的 Revenue、Reservations、Distribution、Marketing 與營運系統，因此能看見改一個步驟可能如何影響另一個團隊。",
    audienceOther:
      "對其他服務業與組織，我們同樣從該團隊的 Workflow 與目標開始，無論是回覆客人、管理資料、做報表，或發展工作者的技能。",
    closerTitle: "從團隊想解決的一件工作開始",
    closerBody: "告訴我們哪件事最花時間、誰在做、目前用什麼系統，以及希望改善什麼。我們會協助評估該從哪裡開始、要準備什麼，以及動手範圍應如何定。",
    closerCta: "諮詢如何把 AI 用回實際工作",
    relatedTitle: "接著閱讀與試用",
    details: "查看詳情",
    readArticle: "閱讀文章",
    useTool: "使用工具",
    insightTech: "為什麼導入飯店科技是收益與成長工作的一部分",
    insightMeetings: "Revenue 會議如何以可執行的決定作結",
    toolSearch: "飯店網站搜尋健康檢查",
    academyLink: "查看 The KPI Plus Academy 課程與活動",
  },
} as const;

export function TechnologyView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const solutions = localizePath("/solutions", locale);
  const audit = auditHref(locale);
  const techHref = existingHref("/insights/hotel-technology-adoption-commercial-project", locale);
  const meetingsHref = existingHref("/insights/hotel-revenue-meetings-that-lead-to-decisions", locale);
  const searchHref = existingHref("/tools/hotel-searchability-check", locale);

  return (
    <SiteShell locale={locale} route={localizePath("/solutions/hotel-ai-automation", locale)}>
      <section className="kpi-hero kpi-home-hero-section kpi-tech-hero">
        <div className="kpi-wrap">
          <nav aria-label="Breadcrumb" className="kpi-tech-hero-crumb">
            <ol>
              <li>
                <Link href={solutions}>{t.crumb}</Link>
              </li>
              <li>
                <span aria-hidden="true">/</span>
                <span>{solutionNavLabel("/solutions/hotel-ai-automation", locale)}</span>
              </li>
            </ol>
          </nav>
          <div className="kpi-home-hero">
            <div className="kpi-home-hero-copy">
              <p className="kpi-home-eyebrow kpi-latin">{t.eyebrow}</p>
              <h1 className="kpi-h1 kpi-home-h1">
                {locale === "th" ? (
                  <>
                    <span className="kpi-home-h1-lead">
                      นำ <span className="kpi-latin">AI</span> และ{" "}
                      <span className="kpi-latin">Automation</span>
                    </span>
                    <span className="kpi-home-h1-rest">
                      <span className="kpi-home-accent">ไปใช้จริง</span>ในโรงแรมและองค์กร
                    </span>
                  </>
                ) : (
                  t.title
                )}
              </h1>
              <p className="kpi-lead kpi-home-lead">{t.lead}</p>
              <p className="kpi-tech-lead-close">{t.leadClose}</p>
              <div className="kpi-actions">
                <a href="#technology-enquiry" className="kpi-button">
                  {t.cta} <span aria-hidden="true">↗</span>
                </a>
                <Link href={audit} className="kpi-button-ghost">
                  {t.secondary}
                </Link>
              </div>
              <p className="kpi-tech-hero-note">{t.underCta}</p>
            </div>
            <div className="kpi-hero-visual kpi-home-photo">
              <img src={heroPhoto} alt={t.photoAlt} width={1200} height={900} />
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-tech-problems">
        <div className="kpi-tech-problems-grid">
          <div className="kpi-tech-problems-copy">
            <h2 className="kpi-h2">{t.problemsTitle}</h2>
            <p className="kpi-tech-problems-lead">{t.problemsLead}</p>
            <p className="kpi-tech-fit-label">{t.fitTitle}</p>
            <ol className="kpi-tech-problems-list">
              {t.problems.map((item, index) => (
                <li key={item} className="kpi-tech-problems-item">
                  <span className="kpi-latin kpi-tech-num">{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </div>
          <figure className="kpi-tech-problems-media">
            <img src={problemsPhoto} alt={t.problemsPhotoAlt} width={1200} height={900} />
          </figure>
        </div>
      </section>

      <section className="kpi-tech-method border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.methodTitle}</h2>
          <ol className="kpi-tech-method-list">
            {t.steps.map(([num, title, body], index) => (
              <li key={num} className="kpi-tech-method-item">
                <div className="kpi-tech-method-meta">
                  <span className="kpi-latin kpi-tech-method-num">{num}</span>
                  <span className="kpi-latin kpi-tech-method-label">{methodLabels[index]}</span>
                </div>
                <div className="kpi-tech-method-copy">
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <a href="#technology-enquiry" className="kpi-button kpi-tech-method-cta">
            {t.methodCta} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="kpi-section kpi-tech-cases">
        <h2 className="kpi-h2">{t.casesTitle}</h2>
        <ol className="kpi-tech-cases-list">
          {t.cases.map(([num, title, body]) => (
            <li key={num} className="kpi-tech-cases-item">
              <span className="kpi-latin kpi-tech-num">{num}</span>
              <div className="kpi-tech-cases-copy">
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="kpi-tech-cases-note">{t.casesNote}</p>
      </section>

      <section className="kpi-tech-study border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.studyTitle}</h2>
          <ol className="kpi-tech-study-principles">
            {t.studyPrinciples.map(([num, text]) => (
              <li key={num}>
                <span className="kpi-latin kpi-tech-num">{num}</span>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <p className="kpi-tech-study-takeaway">
            {t.studyTakeawayLead}
            <span className="kpi-tech-study-takeaway-close">{t.studyTakeawayClose}</span>
          </p>
          <p className="kpi-tech-study-body">{t.studyBody}</p>
          <p className="kpi-tech-study-source">
            {t.sourceLabel}:{" "}
            <a href={studyUrl} target="_blank" rel="noreferrer">
              {t.sourceStudy}
            </a>
          </p>
        </div>
      </section>

      <section className="kpi-section kpi-tech-measure">
        <h2 className="kpi-h2">{t.measureTitle}</h2>
        <p className="kpi-tech-measure-lead">{t.measureLead}</p>
        <ol className="kpi-tech-measure-list">
          {t.measures.map(([num, label, body]) => (
            <li key={num} className="kpi-tech-measure-item">
              <span className="kpi-latin kpi-tech-num">{num}</span>
              <div>
                <h3 className="kpi-latin">{label}</h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="kpi-tech-measure-close">{t.measureClose}</p>
      </section>

      <section className="kpi-tech-ownership border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.ownershipTitle}</h2>
          <ol className="kpi-tech-ownership-list">
            {t.ownershipItems.map(([num, text]) => (
              <li key={num}>
                <span className="kpi-latin kpi-tech-num">{num}</span>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <p className="kpi-tech-ownership-close">{t.ownershipClose}</p>
        </div>
      </section>

      <section className="kpi-section kpi-tech-audience">
        <h2 className="kpi-h2">{t.audienceTitle}</h2>
        <p className="kpi-tech-audience-body">{t.audienceHotel}</p>
        <p className="kpi-tech-audience-body">{t.audienceOther}</p>
        <aside className="kpi-tech-closer">
          <h3>{t.closerTitle}</h3>
          <p>{t.closerBody}</p>
          <div className="kpi-tech-closer-actions">
            <a href="#technology-enquiry" className="kpi-button">
              {t.closerCta} <span aria-hidden="true">↗</span>
            </a>
            <Link href={audit} className="kpi-tech-closer-link">
              {t.secondary}
            </Link>
          </div>
        </aside>
      </section>

      {techHref || meetingsHref || searchHref ? (
        <section className="kpi-tech-related border-t border-[#E3E8EB] bg-white">
          <div className="kpi-section">
            <h2 className="kpi-h2">{t.relatedTitle}</h2>
            <div className="kpi-tech-related-layout">
              {techHref ? (
                <article className="kpi-tech-related-primary">
                  <span className="kpi-tech-related-accent" aria-hidden="true" />
                  <h3>{t.insightTech}</h3>
                  <Link href={techHref} className="kpi-tech-related-cta">
                    {t.readArticle}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </article>
              ) : null}
              <div className="kpi-tech-related-stack">
                {meetingsHref ? (
                  <article className="kpi-tech-related-secondary">
                    <h3>{t.insightMeetings}</h3>
                    <Link href={meetingsHref} className="kpi-tech-related-cta">
                      {t.readArticle}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </article>
                ) : null}
                {searchHref ? (
                  <article className="kpi-tech-related-secondary">
                    <h3>{t.toolSearch}</h3>
                    <Link href={searchHref} className="kpi-tech-related-cta">
                      {t.useTool}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </article>
                ) : null}
                <article className="kpi-tech-related-secondary">
                  <h3>{t.academyLink}</h3>
                  <a href={academyDiscover} target="_blank" rel="noreferrer" className="kpi-tech-related-cta">
                    {t.details}
                    <span aria-hidden="true">↗</span>
                  </a>
                </article>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <TechnologyEnquiry locale={locale} />
      <TechnologyStickyCta label={t.cta} />
    </SiteShell>
  );
}
