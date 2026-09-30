export type FaqItem = { q: string; a: string };

const table: Record<string, FaqItem[]> = {
  "/": [
    {
      q: "เดอะ เคพีไอ พลัส ช่วยโรงแรมเรื่องอะไร?",
      a: "ช่วยโรงแรมสร้าง Demand พัฒนาช่องทางการขาย และเชื่อม Data, Technology และ AI เข้ากับข้อมูลราคา การขาย และการตลาด เพื่อให้ตัดสินใจได้ดีขึ้น เพิ่มรายได้และยอดจอง พร้อมวัดผลได้จริง",
    },
    {
      q: "ควรเริ่มจากจุดไหนถ้า Occupancy หรือรายได้ยังไม่ถึงเป้า?",
      a: "เริ่มจากหาสาเหตุที่ทำให้รายได้หรือยอดจองยังไปไม่ถึงเป้าหมาย เห็นข้อมูลด้านราคา Demand ช่องทางการขาย และ Direct Booking ให้ชัด แล้วเลือกสิ่งที่ควรทำต่อ",
    },
    {
      q: "โรงแรมต้องส่งข้อมูลอะไรเพื่อขอวิเคราะห์?",
      a: "ส่งรายละเอียดโรงแรมมาให้ทีมดูเบื้องต้น แล้วเราจะติดต่อกลับเพื่อคุยเรื่องราคา Demand ช่องทางการขาย หรือ Direct Booking ที่ควรโฟกัสก่อน",
    },
  ],
  "/en": [
    {
      q: "What does The KPI Plus help hotels with?",
      a: "The KPI Plus helps hotels create demand, strengthen distribution, and connect data, technology, and AI to pricing, sales, and marketing so teams decide better, grow bookings, and measure what works.",
    },
    {
      q: "Where should a hotel start if revenue or occupancy is missing the target?",
      a: "Start with the reason revenue or bookings are missing the target. See price, demand, distribution, and direct booking in one picture, then choose the next move.",
    },
    {
      q: "What happens after a hotel performance audit request?",
      a: "Send basic hotel details first. The KPI Plus team follows up on the price, demand, channel, or direct-booking question that is most useful to start with.",
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
  "/about": [
    {
      q: "เดอะ เคพีไอ พลัส คือเอเจนซี่การตลาดหรือที่ปรึกษา?",
      a: "เดอะ เคพีไอ พลัส ไม่ใช่เพียง Digital Marketing Agency และไม่ใช่ที่ปรึกษาที่เข้ามาวิเคราะห์แล้วส่งรายงานให้โรงแรม เราทำงานร่วมกับโรงแรมตั้งแต่ต้นจนจบกระบวนการ และติดตามผลลัพธ์ต่อเนื่อง",
    },
    {
      q: "เป้าหมายของงานคืออะไร?",
      a: "เป้าหมายไม่ใช่การทำให้โรงแรมทำมากขึ้น แต่คือการช่วยให้โรงแรมทำสิ่งที่ใช่ ในเวลาที่ใช่ เพื่อผลประกอบการที่ดีขึ้น",
    },
    {
      q: "ทำงานกับโรงแรมกี่แห่งแล้ว?",
      a: "เราทำงานร่วมกับธุรกิจ Hospitality มาแล้วกว่า 100 แห่ง ตั้งแต่โรงแรมอิสระขนาดเล็กไปจนถึงธุรกิจที่มีความซับซ้อนมากขึ้น",
    },
  ],
  "/en/about": [
    {
      q: "Is The KPI Plus a marketing agency or a consultancy?",
      a: "The KPI Plus isn't just a digital marketing agency, and we're not consultants who analyze your hotel, hand over a report, and leave. We work alongside your team from start to finish, and stay with the results.",
    },
    {
      q: "What is the goal of the work?",
      a: "The goal isn't to help hotels do more. It's to help hotels do the right things, at the right time, for better performance.",
    },
    {
      q: "How many hospitality businesses have you worked with?",
      a: "We've worked with more than 100 hospitality businesses, from small independent hotels to more complex operations.",
    },
  ],
  "/approach": [
    {
      q: "แนวทางการทำงานของ เดอะ เคพีไอ พลัส เริ่มอย่างไร?",
      a: "เริ่มจากอ่านสัญญาณ Booking Pace, Pickup, Forecast, Market Demand และ Channel Mix ในภาพเดียวกัน แล้วเลือกสิ่งที่ควรทำต่อ มีเจ้าของงานชัดเจน และวัด ADR Occupancy และรายได้สุทธิหลังหักค่าคอมมิชชัน",
    },
    {
      q: "Occupancy ต่ำกว่าเป้า ต้องลดราคาทันทีหรือไม่?",
      a: "ไม่เสมอไป แทนที่จะลดราคาทุกช่องทางในทันที ควรหาต้นเหตุก่อน แล้ววางแผนที่เพิ่มยอดจองโดยยังรักษา ADR และรายได้สุทธิไว้ได้",
    },
  ],
  "/en/approach": [
    {
      q: "How does The KPI Plus approach start?",
      a: "By reading booking pace, pickup, forecast, market demand, and channel mix in one view, then choosing the next move with a clear owner and measuring ADR, occupancy, and net revenue after commission.",
    },
    {
      q: "If occupancy is below target, should the hotel cut rates immediately?",
      a: "Not always. Instead of cutting rates on every channel at once, find the cause first, then plan how to grow bookings while protecting ADR and net revenue.",
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
      q: "บทความ Insights เหมาะกับใคร?",
      a: "บทความสำหรับเจ้าของ ผู้จัดการทั่วไป และทีมโรงแรม เชื่อม Revenue, Demand, Technology และการทำงานของทีมเข้ากับสิ่งที่ควรทำต่อ",
    },
    {
      q: "อ่านแล้วเอาไปใช้ได้อย่างไร?",
      a: "เรียงลำดับจากคำถามสู่การลงมือทำที่มีผู้รับผิดชอบ ไม่ได้หยุดที่ทฤษฎีหรือรายงานอย่างเดียว",
    },
  ],
  "/en/insights": [
    {
      q: "Who are the Insights for?",
      a: "Notes for owners, GMs, and hotel teams on revenue, demand, technology, and the next useful commercial move.",
    },
  ],
  "/ru/insights": [
    {
      q: "Для кого эти материалы?",
      a: "Материалы для собственников, управляющих и команд отелей о доходе, спросе, технологиях и следующем полезном шаге.",
    },
  ],
  "/zh/insights": [
    {
      q: "這些文章給誰看？",
      a: "給業主、總經理與酒店團隊的觀點：收益、需求、科技，以及下一步有用的商業行動。",
    },
  ],
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
  "/contact": [
    {
      q: "ถ้ายังไม่แน่ใจว่าควรเริ่มจากบริการไหน ทำอย่างไร?",
      a: "บอกเราเพียงว่าโรงแรมกำลังเจออะไร ทีม เดอะ เคพีไอ พลัส จะช่วยดูว่าควรเริ่มจากจุดไหนก่อน",
    },
    {
      q: "ติดต่อ เดอะ เคพีไอ พลัส ได้อย่างไร?",
      a: "โทร +66 82 635 6266 อีเมล info@thekpiplus.com หรือส่งแบบฟอร์มวิเคราะห์โรงแรม สำนักงานอยู่ที่ภูเก็ต",
    },
  ],
  "/en/contact": [
    {
      q: "What if the hotel is not sure where to start?",
      a: "Tell us what the hotel is facing. The KPI Plus team will help identify the most useful place to begin.",
    },
    {
      q: "How can we contact The KPI Plus?",
      a: "Call +66 82 635 6266, email info@thekpiplus.com, or send the hotel performance form. The office is in Phuket.",
    },
  ],
  "/ru/contact": [
    {
      q: "Как связаться с The KPI Plus?",
      a: "Позвоните +66 82 635 6266, напишите info@thekpiplus.com или отправьте форму. Офис находится на Пхукете.",
    },
  ],
  "/zh/contact": [
    {
      q: "要怎麼聯絡 The KPI Plus？",
      a: "致電 +66 82 635 6266、寄信 info@thekpiplus.com，或送出表單。辦公室在普吉。",
    },
  ],
  "/case-studies": [
    {
      q: "Case Study เผยแพร่เมื่อไหร่?",
      a: "Case Study จะเผยแพร่เมื่อได้รับอนุมัติจากโรงแรม และมีข้อมูลรองรับครบถ้วน ทุกตัวเลขจะมาพร้อมช่วงเวลา แหล่งข้อมูล และคำอธิบายว่าเกิดจากอะไร และมีความหมายต่อโรงแรมอย่างไร",
    },
    {
      q: "ตัวเลขบนหน้านี้รับประกันผลลัพธ์ในอนาคตหรือไม่?",
      a: "ไม่รับประกัน ผลลัพธ์ขึ้นกับโรงแรม สภาวะตลาด ผลิตภัณฑ์ ราคา Distribution และการดำเนินงาน ตัวเลขที่แสดงเป็นผลในช่วงเวลาที่ระบุของแต่ละโรงแรม",
    },
  ],
  "/en/case-studies": [
    {
      q: "When do you publish a case study?",
      a: "We publish case studies only with the hotel's approval and full supporting data. Every number comes with its time period, its source, and an explanation of what drove it and what it means for the hotel.",
    },
    {
      q: "Do these results guarantee future performance?",
      a: "No. Results vary by property, market conditions, product, pricing, distribution and operations. The figures shown reflect the stated periods for each hotel.",
    },
  ],
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
  "/solutions/independent-hotel-management": [
    {
      q: "ขอบเขตบริการเหมือนกันทุกโรงแรมหรือไม่?",
      a: "ไม่ เราไม่ได้กำหนดขอบเขตบริการเหมือนกันทุกแห่ง แต่ร่วมกับเจ้าของออกแบบวิธีบริหารที่ตอบโจทย์โรงแรมจริง",
    },
    {
      q: "ต้องมีทีมบริหารอยู่แล้วหรือไม่?",
      a: "ไม่จำเป็น บางโรงแรมมีทีมพร้อมแต่ต้องการผู้ช่วยวางกลยุทธ์ บางแห่งกำลังเปลี่ยนผ่านทีมบริหาร และบางแห่งต้องการเริ่มวางระบบใหม่ตั้งแต่ต้น",
    },
    {
      q: "ต้องเตรียมขอบเขตงานก่อนนัดคุยหรือไม่?",
      a: "ไม่ต้อง เพียงเล่าเกี่ยวกับโรงแรม เป้าหมาย และเรื่องที่อยากให้ช่วย เราจะร่วมกันหาวิธีทำงานและกำหนดหน้าที่ให้ชัดเจนก่อนเริ่มงาน",
    },
    {
      q: "เดอะ เคพีไอ พลัส รับผิดชอบส่วนไหน?",
      a: "จะตกลงให้ชัดตั้งแต่ต้นว่าทีมเราดูแลเรื่องใด ทีมโรงแรมดูแลเรื่องใด ต้องจัดหาคนเพิ่มหรือไม่ และจะประสานงานกันอย่างไร",
    },
  ],
  "/en/solutions/independent-hotel-management": [
    {
      q: "Is the service scope the same for every hotel?",
      a: "No. We do not set the same scope for every hotel. We design the way of running it with the owner, around the real hotel.",
    },
    {
      q: "Does the hotel already need a management team?",
      a: "No. Some hotels already have a team and need strategy and follow-up. Some are changing the management team. Others need to set a new way of working from the start.",
    },
    {
      q: "Do I need a scope before we talk?",
      a: "No. Tell us about the hotel, the goal, and what you want help with. We will agree roles and ownership before the work starts.",
    },
    {
      q: "What will The KPI Plus own?",
      a: "We agree up front what The KPI Plus will own, what the hotel team will own, whether more people must be found, and how we will coordinate.",
    },
  ],
  "/ru/solutions/independent-hotel-management": [
    {
      q: "Объём услуг одинаковый для каждого отеля?",
      a: "Нет. Мы не задаём один объём для всех. Вместе с владельцем проектируем способ управления под реальный отель.",
    },
    {
      q: "Управляющая команда уже должна быть?",
      a: "Не обязательно. У одних команда есть, но нужна стратегия и сопровождение. Другие меняют команду. Третьим нужно выстроить систему работы с нуля.",
    },
    {
      q: "Нужно готовить объём работы до разговора?",
      a: "Нет. Расскажите об отеле, цели и том, с чем нужна помощь. Роли и ответственность зафиксируем до старта.",
    },
    {
      q: "За что отвечает The KPI Plus?",
      a: "С самого начала договариваемся, за что отвечаем мы, за что — команда отеля, нужно ли искать людей дополнительно и как будем координироваться.",
    },
  ],
  "/zh/solutions/independent-hotel-management": [
    {
      q: "每間飯店的服務範圍都一樣嗎？",
      a: "不一樣。我們不會對每間飯店訂同一套範圍，而是與業主一起設計真正符合該飯店的管理方式。",
    },
    {
      q: "一定要先有管理團隊嗎？",
      a: "不一定。有的飯店已有團隊，但需要策略與追蹤；有的正在轉換管理團隊；也有的需要從頭建立作業系統。",
    },
    {
      q: "約談前一定要先準備工作範圍嗎？",
      a: "不必。只要告訴我們飯店情況、目標，以及希望協助的事。職責與責任會在開始前講清楚。",
    },
    {
      q: "The KPI Plus 負責哪些事？",
      a: "一開始就會約定我們負責什麼、飯店團隊負責什麼、是否需要再找人，以及如何協調。",
    },
  ],
  "/solutions/revenue-commercial-management": [
    {
      q: "Revenue Management กับ Commercial Management ต่างกันอย่างไร?",
      a: "Revenue Management เน้นการตัดสินใจเรื่องราคา ความต้องการของตลาด ห้องว่าง และรายได้ห้องพัก ส่วน Commercial Management มองกว้างขึ้นถึงช่องทางขาย การจองตรง การตลาด ระบบ และวิธีทำงานร่วมกันเพื่อสร้างรายได้",
    },
    {
      q: "ต้องให้ เดอะ เคพีไอ พลัส ดูแลทุกส่วนไหม?",
      a: "ไม่จำเป็น โรงแรมเลือกเริ่มจากงานที่ต้องการได้ และขยายขอบเขตเมื่อเห็นว่ามีส่วนอื่นที่ควรทำร่วมกัน",
    },
    {
      q: "ต้องมี Revenue Manager หรือระบบ RMS ก่อนไหม?",
      a: "ไม่จำเป็นต้องมีก่อนเริ่ม ทีมจะดูข้อมูลและระบบที่โรงแรมมี แล้วเสนอวิธีทำงานที่เหมาะกับขนาดและความพร้อมของโรงแรม",
    },
    {
      q: "ทีมโรงแรมต้องร่วมทำอะไร?",
      a: "ช่วยยืนยันข้อมูลห้องพัก ราคา ข้อเสนอ สถานการณ์หน้างาน และการตัดสินใจที่กระทบการดำเนินงาน จากนั้นทำงานร่วมกับ เดอะ เคพีไอ พลัส ตามหน้าที่ที่ตกลงกัน",
    },
  ],
  "/en/solutions/revenue-commercial-management": [
    {
      q: "How is Revenue Management different from Commercial Management?",
      a: "Revenue Management focuses on rate, demand, rooms, and room revenue. Commercial Management looks wider: channels, direct booking, marketing, systems, and how the team works together to create revenue.",
    },
    {
      q: "Does The KPI Plus have to look after every part?",
      a: "No. The hotel can start with the work it needs, then widen the scope when another part should sit with it.",
    },
    {
      q: "Do we need a Revenue Manager or an RMS first?",
      a: "No. The team reviews the data and systems the hotel already has, then proposes a way of working that fits the size and readiness of the hotel.",
    },
    {
      q: "What does the hotel team have to do?",
      a: "Help confirm rooms, rates, offers, the situation on the floor, and decisions that affect operations, then work with The KPI Plus on the roles that were agreed.",
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
  "/solutions/outsourced-hotel-reservations": [
    {
      q: "เดอะ เคพีไอ พลัส รับจองแทนทีมโรงแรมจริงไหม?",
      a: "รับดูแลงาน Reservations ตามช่องทาง เวลา และขั้นตอนที่ตกลงกัน ไม่ได้จำกัดอยู่ที่การให้คำแนะนำเรื่อง workflow เท่านั้น",
    },
    {
      q: "ต้องโอนงานจองทั้งหมดมาให้ทีมไหม?",
      a: "ไม่จำเป็น โรงแรมอาจเริ่มจากบางช่องทาง บางช่วงเวลา หรือบางขั้นตอน เช่น การตอบคำถามและติดตามลูกค้า แล้วกำหนดส่วนที่ทีมโรงแรมจะดูแลต่อ",
    },
    {
      q: "ต้องเปลี่ยน PMS หรือระบบจองก่อนหรือไม่?",
      a: "ไม่จำเป็นต้องเปลี่ยนก่อนเริ่ม ทีมจะตรวจระบบที่ใช้อยู่ สิทธิ์การเข้าถึง และวิธีส่งต่อข้อมูล แล้วตกลงกระบวนการที่ทำงานได้จริง",
    },
    {
      q: "ใครเป็นผู้กำหนดราคาและอนุมัติข้อเสนอ?",
      a: "โรงแรมเป็นผู้กำหนดนโยบายและสิทธิ์อนุมัติ เดอะ เคพีไอ พลัส ตอบและดำเนินงานตามข้อมูลที่ตกลงกัน หากมีกรณีนอกเงื่อนไขจะส่งให้ผู้รับผิดชอบของโรงแรมตัดสินใจ",
    },
    {
      q: "บริการตอบลูกค้า 24 ชั่วโมงไหม?",
      a: "ช่วงเวลาที่ดูแลจะระบุในขอบเขตบริการของแต่ละโรงแรม รวมถึงวิธีรับและส่งต่องานนอกเวลาที่ตกลงกัน",
    },
  ],
  "/en/solutions/outsourced-hotel-reservations": [
    {
      q: "Does The KPI Plus actually take bookings for the hotel team?",
      a: "Yes, within the channels, hours, and steps that were agreed. The work is not limited to advice about the workflow.",
    },
    {
      q: "Do we have to hand over all reservation work?",
      a: "No. The hotel can start with some channels, some hours, or some steps, such as answering and follow-up, then keep the rest with the hotel team.",
    },
    {
      q: "Do we need to change the PMS or booking system first?",
      a: "No. The team reviews the current system, access, and how details are handed over, then agrees a process that can actually run.",
    },
    {
      q: "Who sets the rate and approves an offer?",
      a: "The hotel sets the policy and approval rights. The KPI Plus replies and works from the agreed facts. Anything outside those conditions goes back to the hotel owner of that decision.",
    },
    {
      q: "Is this a 24-hour reply service?",
      a: "The hours of cover are written in each hotel’s service scope, including how work outside those hours is received and handed over.",
    },
  ],
  "/ru/solutions/outsourced-hotel-reservations": [
    {
      q: "The KPI Plus действительно принимает брони вместо команды отеля?",
      a: "Да, в границах каналов, часов и шагов, которые согласовали. Работа не ограничивается советом по процессу.",
    },
    {
      q: "Нужно ли передавать всю работу брони?",
      a: "Нет. Отель может начать с части каналов, часов или шагов, например ответов и напоминаний, а остальное оставить команде отеля.",
    },
    {
      q: "Нужно ли сначала менять PMS или систему брони?",
      a: "Нет. Команда смотрит текущую систему, доступ и способ передачи данных, затем согласовывает процесс, который реально работает.",
    },
    {
      q: "Кто задаёт цену и утверждает предложение?",
      a: "Отель задаёт правила и право утверждения. The KPI Plus отвечает и работает по согласованным данным. Всё вне условий возвращается ответственному в отеле.",
    },
    {
      q: "Это круглосуточные ответы?",
      a: "Часы работы пишутся в объёме услуги каждого отеля, включая как принимать и передавать работу вне этих часов.",
    },
  ],
  "/zh/solutions/outsourced-hotel-reservations": [
    {
      q: "The KPI Plus 真的會代飯店團隊接預訂嗎？",
      a: "會，依談好的管道、時段與步驟照顧訂房工作，不只是提供流程建議。",
    },
    {
      q: "一定要把全部訂房工作轉過去嗎？",
      a: "不必。飯店可以先從部分管道、時段或步驟開始，例如回覆與追蹤，其餘仍由飯店團隊照顧。",
    },
    {
      q: "一定要先換 PMS 或預訂系統嗎？",
      a: "不必。團隊會先看現有系統、權限與資料轉交方式，再談一套實際做得到的流程。",
    },
    {
      q: "誰決定價格並核准方案？",
      a: "飯店決定政策與核准權限。The KPI Plus 依談好的資料回覆與作業。超出條件的情況會交回飯店負責人決定。",
    },
    {
      q: "是 24 小時回覆嗎？",
      a: "照顧時段會寫在各飯店的服務範圍裡，也包括非該時段的工作如何接收與轉交。",
    },
  ],
  "/solutions/b2b-agent-sales": [
    {
      q: "เดอะ เคพีไอ พลัส ช่วยหาเอเยนต์รายใหม่ให้จริงไหม?",
      a: "ช่วยคัดเลือกและประสานพาร์ตเนอร์จากเครือข่ายที่เกี่ยวข้องกับตลาดและสินค้าของโรงแรม โดยเริ่มจากประเมินก่อนว่าช่องทางนี้เหมาะกับโรงแรมหรือไม่",
    },
    {
      q: "โรงแรมขนาดเล็กใช้บริการนี้ได้ไหม?",
      a: "พูดคุยเพื่อประเมินได้ แต่โดยทั่วไปเราแนะนำบริการนี้กับโรงแรมขนาดกลางถึงขนาดใหญ่ ซึ่งมีจำนวนห้องและการดำเนินงานรองรับเงื่อนไขของช่องทาง B2B ได้มากกว่า สำหรับโรงแรมขนาดเล็ก ช่องทางอื่นอาจเหมาะกว่าในช่วงเริ่มต้น",
    },
    {
      q: "เดอะ เคพีไอ พลัส เป็นผู้เซ็นสัญญาแทนโรงแรมหรือไม่?",
      a: "เราอาจช่วยคัดเลือกพาร์ตเนอร์ ประสานงาน และทบทวนเงื่อนไขทางการขาย แต่โรงแรมเป็นผู้อนุมัติข้อตกลงและลงนามในสัญญาของตนเอง",
    },
    {
      q: "จำเป็นต้องกันห้องให้เอเยนต์ทุกรายไหม?",
      a: "ไม่จำเป็น รูปแบบการให้ห้องและเงื่อนไขการขายควรพิจารณาตามตลาด ฤดูกาล ความต้องการ และผลงานของพาร์ตเนอร์แต่ละราย",
    },
    {
      q: "B2B จะทำงานร่วมกับ OTA และการจองตรงอย่างไร?",
      a: "เราดูทั้งสามช่องทางร่วมกัน เพื่อให้ราคา ห้องว่าง และเป้าหมายของแต่ละช่องทางสอดคล้องกัน และทบทวนจากรายได้ที่โรงแรมได้รับจริง",
    },
  ],
  "/en/solutions/b2b-agent-sales": [
    {
      q: "Does The KPI Plus actually help find new agents?",
      a: "We help choose and introduce partners from a network that matches the hotel’s market and product. The work starts by asking whether this channel fits the hotel at all.",
    },
    {
      q: "Can a small hotel use this service?",
      a: "We can talk and review the situation. In general we recommend this work for mid-size and larger hotels, which have more rooms and operations to support B2B conditions. For a smaller hotel, another channel may be a better start.",
    },
    {
      q: "Does The KPI Plus sign the contract for the hotel?",
      a: "We may help choose partners, coordinate the work, and review the selling conditions. The hotel approves the agreement and signs its own contract.",
    },
    {
      q: "Does every agent need held rooms?",
      a: "No. How rooms are given and how they are sold should follow the market, the season, demand, and each partner’s result.",
    },
    {
      q: "How does B2B sit with OTAs and direct booking?",
      a: "We look at all three together, so rates, rooms, and goals stay aligned, then review from the revenue the hotel actually receives.",
    },
  ],
  "/ru/solutions/b2b-agent-sales": [
    {
      q: "The KPI Plus действительно помогает найти новых агентов?",
      a: "Мы помогаем выбрать и представить партнёров из сети, которая подходит рынку и продукту отеля. Сначала оцениваем, подходит ли этот канал отелю вообще.",
    },
    {
      q: "Может ли маленький отель пользоваться этой услугой?",
      a: "Поговорить и оценить ситуацию можно. Обычно мы рекомендуем эту работу средним и более крупным отелям: у них больше номеров и процессов под условия B2B. Маленькому отелю на старте может лучше подойти другой канал.",
    },
    {
      q: "The KPI Plus подписывает договор вместо отеля?",
      a: "Мы можем помочь выбрать партнёров, согласовать работу и разобрать условия продажи. Отель утверждает соглашение и подписывает свой договор.",
    },
    {
      q: "Нужно ли резервировать номера каждому агенту?",
      a: "Нет. Как давать номера и на каких условиях продавать, нужно смотреть по рынку, сезону, спросу и результату каждого партнёра.",
    },
    {
      q: "Как B2B работает вместе с OTA и прямым бронированием?",
      a: "Мы смотрим все три канала вместе, чтобы цена, номера и цели не расходились, и проверяем по доходу, который отель реально получает.",
    },
  ],
  "/zh/solutions/b2b-agent-sales": [
    {
      q: "The KPI Plus 真的會幫忙找新旅行社嗎？",
      a: "我們會從與飯店市場和產品相關的網絡，幫忙挑選並牽線夥伴。工作會先從評估這條通路適不適合這間飯店開始。",
    },
    {
      q: "小型飯店可以用這項服務嗎？",
      a: "可以先談、先評估。一般我們會建議中大型飯店使用，因為客房數與營運較能承接 B2B 條件。小型飯店起步時，其他通路可能更合適。",
    },
    {
      q: "The KPI Plus 會代飯店簽署合約嗎？",
      a: "我們可以幫忙挑選夥伴、協調作業，並檢視銷售條件。協議由飯店自行核准，合約也由飯店自行簽署。",
    },
    {
      q: "一定要為每家旅行社保留房間嗎？",
      a: "不必。給房方式與銷售條件，應依市場、淡旺季、需求與各家夥伴的成果來考慮。",
    },
    {
      q: "B2B 要如何與 OTA、直銷預訂一起運作？",
      a: "我們會把三條通路一起看，讓價格、空房與目標一致，並依飯店實際收到的收益再檢視。",
    },
  ],
  "/solutions/google-ads-management": [
    {
      q: "Google Ads ช่วยเพิ่มยอดจองตรงได้ทันทีไหม?",
      a: "Google Ads ช่วยให้โรงแรมเข้าถึงผู้ที่กำลังค้นหาที่พัก แต่ยอดจองยังขึ้นกับราคา ข้อเสนอ ห้องว่าง เว็บไซต์ และระบบจอง จึงควรตรวจทุกส่วนร่วมกัน",
    },
    {
      q: "ต้องสร้างเว็บไซต์ใหม่ก่อนหรือไม่?",
      a: "ไม่จำเป็นเสมอไป หากเว็บไซต์เดิมแสดงข้อมูลชัด ใช้บนมือถือสะดวก และพาลูกค้าไปจองได้ ทีมอาจเริ่มจากการปรับหน้าที่มีอยู่ก่อน",
    },
    {
      q: "ควรซื้อโฆษณาคำค้นชื่อโรงแรมอย่างเดียวไหม?",
      a: "ควรพิจารณาคำค้นชื่อโรงแรมและคำค้นอื่นแยกกัน เพราะมีพฤติกรรมลูกค้าและวิธีวัดผลต่างกัน ทีมจะดูว่าคำค้นกลุ่มใดมีโอกาสสร้างมูลค่าให้โรงแรม",
    },
    {
      q: "Hotel Ads กับ Search Ads เหมือนกันไหม?",
      a: "ไม่เหมือนกัน Search Ads เป็นโฆษณาที่ตอบคำค้น ส่วน Hotel Ads ใช้ข้อมูลโรงแรม ราคา และห้องว่างในรูปแบบการค้นหาโรงแรมของ Google การเริ่มใช้ Hotel Ads ต้องตรวจการเชื่อมต่อระบบก่อน",
    },
  ],
  "/en/solutions/google-ads-management": [
    {
      q: "Do Google Ads increase direct bookings immediately?",
      a: "Google Ads can reach people who are already searching for a stay. Bookings still depend on the rate, the offer, availability, the website, and the booking path, so those parts should be reviewed together.",
    },
    {
      q: "Do we need a new website first?",
      a: "Not always. If the current site is clear, works on a phone, and can take a guest to a booking, the team may start by improving the pages you already have.",
    },
    {
      q: "Should we only buy ads for the hotel name?",
      a: "Hotel-name searches and other stay searches should be reviewed separately, because guest behaviour and measurement differ. The team looks at which group can create value for the hotel.",
    },
    {
      q: "Are Hotel Ads and Search Ads the same?",
      a: "No. Search Ads answer a query. Hotel Ads use hotel, rate, and availability data in Google’s hotel-search format. Starting Hotel Ads means checking the system connection first.",
    },
  ],
  "/ru/solutions/google-ads-management": [
    {
      q: "Google Ads сразу увеличивает прямые брони?",
      a: "Google Ads помогает дойти до тех, кто уже ищет жильё. Брони по-прежнему зависят от цены, предложения, наличия номеров, сайта и системы бронирования, поэтому эти части нужно смотреть вместе.",
    },
    {
      q: "Нужно ли сначала делать новый сайт?",
      a: "Не всегда. Если текущий сайт понятен, удобен с телефона и ведёт к брони, команда может начать с доработки существующих страниц.",
    },
    {
      q: "Стоит ли покупать рекламу только по названию отеля?",
      a: "Поиск названия отеля и другие запросы на жильё лучше смотреть отдельно: поведение гостей и способ измерения различаются. Команда оценит, какая группа может дать ценность отелю.",
    },
    {
      q: "Hotel Ads и Search Ads — это одно и то же?",
      a: "Нет. Search Ads отвечают на поисковый запрос. Hotel Ads используют данные об отеле, цене и наличии номеров в гостиничном поиске Google. Чтобы начать Hotel Ads, сначала нужно проверить подключение системы.",
    },
  ],
  "/zh/solutions/google-ads-management": [
    {
      q: "Google Ads 能立刻增加直銷預訂嗎？",
      a: "Google Ads 能讓飯店接觸正在搜尋住宿的人。但預訂仍取決於價格、方案、空房、網站與預訂系統，因此這些部分要一起檢查。",
    },
    {
      q: "一定要先做新網站嗎？",
      a: "不一定。如果現有網站資料清楚、手機好用，也能帶客人去預訂，團隊可能先從調整現有頁面開始。",
    },
    {
      q: "只買飯店名稱的搜尋廣告就好嗎？",
      a: "飯店名稱搜尋與其他住宿搜尋應分開看，因為客人行為與衡量方式不同。團隊會看哪一組比較能為飯店創造價值。",
    },
    {
      q: "Hotel Ads 和 Search Ads 一樣嗎？",
      a: "不一樣。Search Ads 是回應搜尋的廣告。Hotel Ads 則在 Google 的飯店搜尋格式中使用飯店、價格與空房資料。要開始 Hotel Ads，必須先檢查系統連接。",
    },
  ],
  "/solutions/meta-ads-management": [
    {
      q: "โรงแรมขนาดเล็กทำ Meta Ads ได้ไหม?",
      a: "ทำได้ แต่ควรดูเป้าหมาย งบประมาณ จุดเด่นของที่พัก และช่องทางรับการจองก่อน เพื่อเลือกวิธีเริ่มต้นที่เหมาะกับขนาดของโรงแรม",
    },
    {
      q: "ต้องมีเว็บไซต์ก่อนหรือไม่?",
      a: "ไม่จำเป็นสำหรับทุกเป้าหมาย หากต้องการให้ลูกค้าทักข้อความ สามารถพิจารณาเส้นทางนั้นได้ แต่หากต้องการติดตามการจองตรงผ่านเว็บไซต์ ต้องตรวจหน้าเว็บ ระบบจอง และการติดตามผลเพิ่มเติม",
    },
    {
      q: "วัดยอดจองจากโฆษณาได้ไหม?",
      a: "ทำได้มากน้อยต่างกันตามเว็บไซต์ ระบบจอง และการตั้งค่าติดตามผลของโรงแรม ทีมจะตรวจสิ่งที่วัดได้จริงก่อนกำหนดวิธีรายงาน",
    },
    {
      q: "ทำโฆษณาแล้วรับประกันยอดจองไหม?",
      a: "ยอดจองขึ้นอยู่กับหลายส่วน ทั้งราคา ห้องว่าง ข้อเสนอ หน้าเว็บ และการตอบลูกค้า เราจึงเริ่มจากเป้าหมายที่ชัดและทบทวนผลจากข้อมูลที่ตรวจสอบได้",
    },
  ],
  "/en/solutions/meta-ads-management": [
    {
      q: "Can a small hotel run Meta Ads?",
      a: "Yes. First look at the goal, budget, what makes the stay distinctive, and how guests can book, then choose a start that fits the size of the hotel.",
    },
    {
      q: "Do we need a website first?",
      a: "Not for every goal. If guests should message the hotel, that path can be used. If you want to follow direct bookings through the website, the page, booking path, and tracking need a closer look.",
    },
    {
      q: "Can bookings from the ads be measured?",
      a: "It depends on the website, booking path, and tracking the hotel already has. The team checks what can actually be measured before agreeing how results are reported.",
    },
    {
      q: "Do the ads guarantee bookings?",
      a: "Bookings depend on more than the ads, including rate, availability, the offer, the website, and how the team replies. We start from a clear goal and review results from data that can be checked.",
    },
  ],
  "/ru/solutions/meta-ads-management": [
    {
      q: "Может ли небольшой отель запускать Meta Ads?",
      a: "Да. Сначала смотрим цель, бюджет, чем проживание отличается и как гости могут спросить или забронировать, затем выбираем старт по размеру отеля.",
    },
    {
      q: "Нужен ли сначала сайт?",
      a: "Не для каждой цели. Если гости должны написать в сообщения, этот путь можно использовать. Если нужно отслеживать прямые брони через сайт, страницу, путь бронирования и отслеживание надо проверить отдельно.",
    },
    {
      q: "Можно ли измерить брони из рекламы?",
      a: "Это зависит от сайта, пути бронирования и уже настроенного отслеживания. Команда сначала смотрит, что реально можно измерить, и только потом согласовывает способ отчёта.",
    },
    {
      q: "Гарантирует ли реклама брони?",
      a: "Брони зависят не только от рекламы: цена, наличие номеров, предложение, сайт и то, как команда отвечает гостю. Мы начинаем с ясной цели и разбираем результат по данным, которые можно проверить.",
    },
  ],
  "/zh/solutions/meta-ads-management": [
    {
      q: "小型飯店也能做 Meta Ads 嗎？",
      a: "可以。但要先看目標、預算、住宿亮點，以及客人如何詢問或預訂，再選適合飯店規模的起步方式。",
    },
    {
      q: "一定要先有網站嗎？",
      a: "不是每個目標都必須。如果希望客人傳訊息，可以走那個路徑。若要透過網站追蹤直銷預訂，則還要檢查頁面、預訂系統與追蹤設定。",
    },
    {
      q: "廣告帶來的預訂能量化嗎？",
      a: "能做到什麼程度，取決於網站、預訂路徑與飯店既有的追蹤設定。團隊會先確認實際能量到什麼，再一起決定如何回報。",
    },
    {
      q: "做廣告有保證預訂嗎？",
      a: "預訂還取決於價格、空房、方案、網站，以及團隊如何回覆客人。因此會先訂清楚目標，並用可核對的資料檢視結果。",
    },
  ],
  "/solutions/hotel-seo-google-maps-ai-search": [
    {
      q: "AEO คืออะไร และต่างจาก SEO ไหม?",
      a: "AEO คือการจัดข้อมูลให้ตอบคำถามของผู้ค้นหาได้ชัดเจน โดยเฉพาะคำถามที่ละเอียดหรือมีหลายเงื่อนไข เป็นแนวทางหนึ่งในการทำเนื้อหาที่มีประโยชน์และเข้าใจง่าย ไม่ใช่ช่องทางลัดที่รับประกันว่าธุรกิจจะปรากฏในคำตอบ AI",
    },
    {
      q: "ต้องมีเว็บไซต์ไหม ถ้ามี Google Business Profile แล้ว?",
      a: "Business Profile ช่วยให้ลูกค้าเห็นข้อมูลสำคัญบน Search และ Maps ได้ แต่เว็บไซต์มีพื้นที่อธิบายบริการ ห้องพัก เมนู เงื่อนไข และรายละเอียดการจองได้มากกว่า ทีมจะดูว่าธุรกิจของคุณต้องการข้อมูลและเส้นทางตัดสินใจระดับใด",
    },
    {
      q: "รีวิวช่วยให้ติดอันดับ Maps ไหม?",
      a: "Google ระบุว่ารีวิวและคะแนนเป็นส่วนหนึ่งของความโดดเด่นของธุรกิจ แต่ผลในพื้นที่ยังขึ้นกับความเกี่ยวข้องและระยะทางด้วย จึงควรขอรีวิวจากลูกค้าจริง ตอบอย่างเหมาะสม และรักษาข้อมูลธุรกิจให้ถูกต้อง ไม่ใช่มองเพียงจำนวนดาว",
    },
    {
      q: "ทำแล้วจะเห็นผลเมื่อไร?",
      a: "ขึ้นอยู่กับสภาพเว็บไซต์ ความครบถ้วนของข้อมูล การแข่งขันในพื้นที่ และสิ่งที่ต้องแก้ บางเรื่องอย่างเวลาเปิดหรือเบอร์โทรสามารถแก้ได้ทันที ส่วนการเติบโตจากการค้นหาและเนื้อหาต้องติดตามต่อเนื่อง",
    },
  ],
  "/en/solutions/hotel-seo-google-maps-ai-search": [
    {
      q: "What is AEO, and is it different from SEO?",
      a: "AEO means organising facts so they clearly answer the searcher’s question, especially a detailed or multi-part question. It is a way to make useful, easy-to-understand content, not a shortcut that guarantees a mention in an AI answer.",
    },
    {
      q: "Do we still need a website if we already have a Google Business Profile?",
      a: "The Business Profile can show key facts on Search and Maps. A website has more space for services, rooms, menus, conditions, and booking details. The team looks at how much information and how much of a decision path this business needs.",
    },
    {
      q: "Do reviews improve a Maps rank?",
      a: "Google says reviews and ratings are part of prominence. Local results also depend on relevance and distance. Ask real customers, reply in a suitable way, and keep the business facts accurate. Do not look at the star count alone.",
    },
    {
      q: "When will we see a result?",
      a: "It depends on the website, how complete the facts are, local competition, and what needs fixing. Hours or a phone number can change at once. Search and content growth need ongoing review.",
    },
  ],
  "/ru/solutions/hotel-seo-google-maps-ai-search": [
    {
      q: "Что такое AEO и чем оно отличается от SEO?",
      a: "AEO — это организация фактов так, чтобы они ясно отвечали на вопрос ищущего, особенно на подробный или составной вопрос. Это способ делать полезный понятный контент, а не короткий путь, который гарантирует появление в ответе ИИ.",
    },
    {
      q: "Нужен ли сайт, если уже есть Google Business Profile?",
      a: "Business Profile показывает ключевые факты в Search и Maps. На сайте больше места для услуг, номеров, меню, условий и деталей брони. Команда смотрит, какой объём информации и какой путь решения нужны этому бизнесу.",
    },
    {
      q: "Помогают ли отзывы подняться в Maps?",
      a: "Google указывает, что отзывы и оценки входят в известность. Локальный результат также зависит от релевантности и расстояния. Просите отзывы у реальных клиентов, отвечайте уместно и держите данные бизнеса точными, а не смотрите только на число звёзд.",
    },
    {
      q: "Когда будет виден результат?",
      a: "Это зависит от сайта, полноты данных, конкуренции в районе и того, что нужно исправить. Часы или телефон можно поменять сразу. Рост из поиска и контента нужно смотреть дальше.",
    },
  ],
  "/zh/solutions/hotel-seo-google-maps-ai-search": [
    {
      q: "AEO 是什麼？和 SEO 一樣嗎？",
      a: "AEO 是把資料整理到能清楚回答搜尋者的問題，尤其是較細或有多個條件的問題。這是做出有用、好懂內容的做法，不是保證會出現在 AI 答案裡的捷徑。",
    },
    {
      q: "已經有 Google Business Profile，還需要網站嗎？",
      a: "Business Profile 能在 Search 與 Maps 顯示重點資料。網站則有更多空間說明服務、客房、菜單、條件與預訂細節。團隊會看這門生意需要多少資訊，以及多完整的決定路徑。",
    },
    {
      q: "評論能幫助 Maps 排名嗎？",
      a: "Google 指出評論與評分是知名度的一部分。在地結果還取決於相關性與距離。應請真實客人寫評論、適當回覆，並維持商家資料正確，而不是只看星星數。",
    },
    {
      q: "做了之後何時看得到結果？",
      a: "取決於網站現況、資料是否完整、當地競爭，以及要修正的項目。營業時間或電話可以立刻改。搜尋與內容的成長則需要持續追蹤。",
    },
  ],
  "/solutions/hotel-website-design": [
    {
      q: "ต้องใช้ WordPress เท่านั้นไหม?",
      a: "ไม่จำเป็น เราพิจารณา CMS และวิธีพัฒนาตามความต้องการของโรงแรม ระบบที่ต้องเชื่อม และคนที่จะดูแลเว็บไซต์ต่อ",
    },
    {
      q: "ทีมโรงแรมแก้เนื้อหาเองได้ไหม?",
      a: "ได้ หากเป็นสิ่งที่โรงแรมต้องการ เราจะนำเรื่องนี้ไปประกอบการเลือก CMS และออกแบบส่วนที่ทีมต้องอัปเดตบ่อย เช่น ภาพ ข้อความ และโปรโมชั่น",
    },
    {
      q: "มีเว็บไซต์แล้วจำเป็นต้องสร้างใหม่ไหม?",
      a: "ไม่เสมอไป ทีมจะตรวจเว็บเดิมก่อน หากโครงสร้างและระบบยังรองรับเป้าหมาย การปรับปรุงบางหน้าก็อาจเพียงพอ",
    },
    {
      q: "ต้องเตรียมภาพใหม่ทั้งหมดหรือไม่?",
      a: "ไม่จำเป็นต้องถ่ายใหม่ทั้งหมด เราจะดูภาพที่มีอยู่ก่อนว่าแสดงโรงแรมตามจริงและช่วยให้ลูกค้าเข้าใจห้องพักและประสบการณ์เข้าพักได้หรือไม่",
    },
    {
      q: "ทำเว็บไซต์แล้วจะได้ยอดจองตรงทันทีไหม?",
      a: "เว็บไซต์ช่วยให้ลูกค้าเข้าใจโรงแรมและจองได้สะดวกขึ้น แต่ยอดจองยังขึ้นกับจำนวนคนเข้าชม ราคา ห้องว่าง ข้อเสนอ และระบบจอง เราจึงวางเว็บไซต์ให้ทำงานร่วมกับแผนรายได้และช่องทางขายของโรงแรม",
    },
  ],
  "/en/solutions/hotel-website-design": [
    {
      q: "Do we have to use WordPress?",
      a: "No. We review the CMS and the way to build the site from the hotel’s needs, the systems that must connect, and who will look after the website afterwards.",
    },
    {
      q: "Can the hotel team update the content themselves?",
      a: "Yes, if that is what the hotel wants. We use this when choosing a CMS and when designing the parts the team will update often, such as photos, copy, and offers.",
    },
    {
      q: "If we already have a website, do we have to rebuild it?",
      a: "Not always. The team reviews the current site first. If the structure and systems still support the goal, improving some pages may be enough.",
    },
    {
      q: "Do we need a full new set of photos?",
      a: "Not always. We first look at the photos you already have, and whether they show the hotel as it is and help guests understand the rooms and the stay.",
    },
    {
      q: "Will a new website bring direct bookings immediately?",
      a: "A website can help guests understand the hotel and book more easily. Bookings still depend on how many people visit, the rate, availability, the offer, and the booking system. We plan the site to work with the hotel’s revenue plan and other sales channels.",
    },
  ],
  "/ru/solutions/hotel-website-design": [
    {
      q: "Нужно ли использовать только WordPress?",
      a: "Нет. Мы смотрим CMS и способ разработки по потребности отеля, системам, которые нужно связать, и тому, кто будет вести сайт дальше.",
    },
    {
      q: "Может ли команда отеля сама менять контент?",
      a: "Да, если отелю это нужно. Мы учитываем это при выборе CMS и при проектировании частей, которые команда будет часто обновлять: фото, тексты и акции.",
    },
    {
      q: "Если сайт уже есть, его обязательно делать заново?",
      a: "Не всегда. Команда сначала смотрит текущий сайт. Если структура и системы ещё поддерживают цель, может хватить доработки отдельных страниц.",
    },
    {
      q: "Нужно ли снимать все фото заново?",
      a: "Не обязательно. Сначала смотрим уже имеющиеся фото: показывают ли они отель как есть и помогают ли гостю понять номера и пребывание.",
    },
    {
      q: "Новый сайт сразу даст прямые брони?",
      a: "Сайт помогает гостю понять отель и проще забронировать. Брони по-прежнему зависят от числа визитов, цены, наличия номеров, предложения и системы брони. Поэтому сайт планируем вместе с планом дохода и другими каналами продаж отеля.",
    },
  ],
  "/zh/solutions/hotel-website-design": [
    {
      q: "一定只能用 WordPress 嗎？",
      a: "不必。我們依飯店需求、要串接的系統，以及之後誰照顧網站，來考慮 CMS 與開發方式。",
    },
    {
      q: "飯店團隊可以自己改內容嗎？",
      a: "可以，若這是飯店需要的。我們會把這一點納入 CMS 選擇，並設計團隊常要更新的部分，例如照片、文字與促銷。",
    },
    {
      q: "已經有網站，一定要重做嗎？",
      a: "不一定。團隊會先看現有網站。若結構與系統仍能支援目標，調整部分頁面可能就夠。",
    },
    {
      q: "一定要全部重拍照片嗎？",
      a: "不必全部重拍。我們會先看現有照片，是否真實呈現飯店，並幫助客人理解客房與入住體驗。",
    },
    {
      q: "做了網站就會立刻有直銷預訂嗎？",
      a: "網站能幫助客人理解飯店、也較容易預訂。但預訂量仍取決於造訪人數、價格、空房、方案與預訂系統。因此我們會把網站放進飯店的收益計畫與其他銷售通路一起規劃。",
    },
  ],
  "/solutions/hotel-direct-bookings": [
    {
      q: "ต้องออกแบบเว็บไซต์ใหม่ก่อนหรือไม่?",
      a: "ไม่จำเป็น เราจะเริ่มตรวจเว็บไซต์เดิมและเลือกจุดที่ควรปรับก่อน หากระบบเดิมมีข้อจำกัดจึงค่อยพิจารณางานพัฒนาเพิ่มเติม",
    },
    {
      q: "เพิ่ม Conversion หมายถึงดูเฉพาะยอดจองไหม?",
      a: "ยอดจองสำเร็จเป็นผลลัพธ์สำคัญ แต่ระหว่างทางเรายังดูการดูห้องพัก การคลิกเข้าสู่ระบบจอง และคำถามจากลูกค้า เพื่อหาว่าขั้นตอนไหนต้องปรับ",
    },
    {
      q: "หาก Booking Engine เป็นของผู้ให้บริการอื่น ยังวัดยอดจองได้ไหม?",
      a: "ขึ้นอยู่กับการตั้งค่าและความสามารถของผู้ให้บริการ เราจะตรวจว่าติดตามข้อมูลข้ามเว็บไซต์และระบบจองได้ถึงขั้นใดก่อนกำหนดวิธีรายงาน",
    },
    {
      q: "ทำงานร่วมกับ Google Ads และ SEO ได้ไหม?",
      a: "ได้ เมื่อโฆษณาหรือผลค้นหาพาคนมาที่เว็บไซต์ หน้าเว็บควรตอบสิ่งที่เขากำลังหาและพาไปต่อได้ เราจึงสามารถดูเส้นทางนี้ร่วมกับแคมเปญและงาน SEO ของโรงแรม",
    },
  ],
  "/en/solutions/hotel-direct-bookings": [
    {
      q: "Do we need a new website first?",
      a: "No. We start with the current website and choose what to change first. If the current system limits the work, we then review extra development.",
    },
    {
      q: "Does conversion mean we only look at bookings?",
      a: "Completed bookings are an important result. Along the way we also look at room views, clicks into the booking system, and guest questions, to see which step needs a change.",
    },
    {
      q: "If another company runs the booking engine, can we still measure bookings?",
      a: "It depends on the provider’s setup and what the system can do. We first check how far the path can be tracked across the website and the booking system, then agree how to report.",
    },
    {
      q: "Can this work with Google Ads and SEO?",
      a: "Yes. When ads or search results send people to the website, the page should answer what they are looking for and help them continue. We can review this path together with the hotel’s campaigns and SEO work.",
    },
  ],
  "/ru/solutions/hotel-direct-bookings": [
    {
      q: "Нужно ли сначала делать новый сайт?",
      a: "Нет. Мы начинаем с текущего сайта и выбираем, что править первым. Если текущая система ограничивает работу, тогда смотрим дополнительную разработку.",
    },
    {
      q: "Конверсия значит смотреть только брони?",
      a: "Завершённые брони — важный результат. По пути мы также смотрим просмотры номеров, клики в систему брони и вопросы гостей, чтобы понять, какой шаг нужно править.",
    },
    {
      q: "Если booking engine у другого провайдера, можно ли всё равно считать брони?",
      a: "Зависит от настроек и возможностей провайдера. Сначала проверяем, как далеко путь можно отследить между сайтом и системой брони, затем договариваемся, как отчитываться.",
    },
    {
      q: "Можно ли работать вместе с Google Ads и SEO?",
      a: "Да. Когда реклама или поиск приводят людей на сайт, страница должна отвечать на их вопрос и вести дальше. Этот путь можно смотреть вместе с кампаниями и SEO отеля.",
    },
  ],
  "/zh/solutions/hotel-direct-bookings": [
    {
      q: "一定要先做新網站嗎？",
      a: "不必。我們會先檢查現有網站，並選擇該先調整的點。若現有系統有限制，再考慮額外開發。",
    },
    {
      q: "提升 Conversion 是只看預訂量嗎？",
      a: "完成的預訂是重要結果。過程中我們也會看客房瀏覽、進入預訂系統的點擊，以及客人的問題，找出該調整哪一步。",
    },
    {
      q: "若 Booking Engine 是其他供應商的，還能量到預訂嗎？",
      a: "取決於供應商的設定與系統能力。我們會先檢查網站與預訂系統之間能追蹤到哪一步，再決定回報方式。",
    },
    {
      q: "可以和 Google Ads、SEO 一起做嗎？",
      a: "可以。當廣告或搜尋結果把人帶到網站，頁面應回答他們正在找的事，並帶他們繼續。這條路徑可以和飯店的廣告活動與 SEO 一起看。",
    },
  ],
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
  return [];
}

export function howToStepsForRoute(route: string) {
  return toolHowTo[route] ?? [];
}
