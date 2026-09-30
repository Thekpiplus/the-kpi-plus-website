import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = join(import.meta.dirname, "..");
const pagesRoot = join(root, "content", "pages");
const manifestPath = join(root, "content", "seo-manifest.json");

const SITE = "https://thekpiplus.com";
const OG = `${SITE}/media/the-kpi-plus-performance-hero_2f986b5f.jpg`;

const pages = {
  about: {
    en: {
      title: "About The KPI Plus | The KPI Plus",
      description: "Learn about The KPI Plus, a founder-led Phuket hospitality performance and growth partner.",
      main: `The KPI Plus
Hotel Revenue Management and Hospitality Performance
# Help hotels grow with Revenue Management, Data, Digital Marketing, and Technology
The KPI Plus works with hotels and hospitality businesses across Thailand to grow revenue, set pricing strategy, manage OTA and sales channels, increase direct booking, and develop digital marketing.
We do not look only at short-term sales. We help the hotel see the business more clearly, decide better, and put a system in place so the team can work more effectively over time.
Vision
## Become one of Thailand’s leading Hotel Revenue Management and Hospitality Performance companies
We help hotels grow by combining data, technology, revenue and growth strategy, and real industry experience.
Mission
## See the business more clearly. Decide better. Grow revenue. Work more effectively. Grow sustainably.
This happens when hospitality expertise, data, technology, revenue and growth strategy, and practical execution stay connected.
What we do
## The KPI Plus covers revenue, marketing, technology, and the way a hotel team works
We do not believe every hotel needs the same tools or the same strategy. The useful start is to understand what the business is facing, what should happen next, then choose the approach and measure what actually happens.
### Hotel Revenue Management
### Pricing & Revenue Strategy
### OTA & Distribution Management
### Direct Booking
### Google Ads & Meta Ads
### SEO & Local Search
### Website & Conversion Optimization
### Hospitality Technology
### Data, Reporting & AI Solutions
### Commercial Team Development
Experience that grows with clients
## Work with more than 100 hospitality businesses
From smaller independent hotels to more complex hospitality operations, the principle stays the same: understand the business, read the data, choose the next work, execute, and measure.
100+
Hospitality businesses supported
### Destination Group
### BYD Lofts Boutique Hotel & Serviced Apartments
### Hotel COCO Phuket
### Naiya Buree Boutique Resort
### Baan Taranya Resort
### Casa Solana Patong
### Casa De Lipe
### Baan 125 Stay
What we care about
## The thinking behind the work
### Create value that can be measured
Everything we do should affect the business: revenue, profit, efficiency, or the capability of the team.
### Understand hotel work from real experience
The strategy is not theory alone. It comes from experience and a working understanding of hospitality.
### Use data to support decisions
Good decisions should come from experience, data, the market, and guest behaviour.
### Use technology with a purpose
Technology and AI should make work simpler, faster, and more effective — not more complicated.
### Work as part of the team
We work with owners, managers, and hotel teams toward the same goal.
### Keep learning
The market, technology, and guest behaviour change. We test, measure, and keep improving.
![The KPI Plus founders](media/the-kpi-plus-founders_f4c8516e.webp)
Our Founders
## Two experiences. One shared goal.
The KPI Plus grew from two different founder paths with the same belief: a good hospitality business should grow in revenue, systems, and people.
### Khun Netnaphis
Founder
Khun Netnaphis has more than 21 years in hotels, including Mandarin Oriental Bangkok, The Westin Siray Bay Resort & Spa Phuket, and Phuket Marriott Resort & Spa, Merlin Beach. She understands service, team leadership, guest experience, and long-term hotel growth.
### Khun Issara Issaranirun
Co-founder and Chief Executive Officer
Khun Issara has more than 15 years in hospitality technology, sales, digital marketing, and hotel solutions, including ReverseAds, eZee Technosys, Compass Edge, and OYO Hotels. As CEO he leads business direction, technology, and solutions hotels can actually use.
Better Decisions. Better Performance.
## Numbers are not only a report. They should show the team the next move.
Hotel work changes quickly: traveller behaviour, search, OTAs, digital marketing, and AI. The useful question is what the data is saying, what the real problem is, and whether the work is creating a result.
[Contact us](mailto:info@thekpiplus.com?subject=Join%20The%20KPI%20Plus)`,
    },
    ru: {
      title: "О The KPI Plus | The KPI Plus",
      description: "The KPI Plus — партнёр по доходам и росту отелей с офисом на Пхукете.",
      main: `The KPI Plus
Hotel Revenue Management and Hospitality Performance
# Помогаем отелям расти через Revenue Management, данные, digital-маркетинг и технологии
The KPI Plus работает с отелями и hospitality-бизнесом по Таиланду: доход, ценовая стратегия, OTA и каналы продаж, прямое бронирование и digital-маркетинг.
Мы смотрим не только на краткосрочные продажи. Мы помогаем отелю яснее видеть бизнес, лучше решать и выстроить систему, в которой команда может работать эффективнее.
Vision
## Стать одной из ведущих компаний Таиланда в Hotel Revenue Management и Hospitality Performance
Мы помогаем отелям расти, соединяя данные, технологии, стратегию дохода и роста и реальный отраслевой опыт.
Mission
## Видеть бизнес яснее. Решать лучше. Растить доход. Работать эффективнее. Расти устойчиво.
Это возможно, когда hospitality-экспертиза, данные, технологии, стратегия дохода и практическое исполнение остаются связанными.
Что мы делаем
## The KPI Plus охватывает доход, маркетинг, технологии и способ работы команды отеля
Мы не считаем, что каждому отелю нужны одни и те же инструменты или одна стратегия. Полезное начало — понять, с чем сталкивается бизнес, что делать дальше, выбрать подход и измерить то, что происходит на самом деле.
### Hotel Revenue Management
### Pricing & Revenue Strategy
### OTA & Distribution Management
### Direct Booking
### Google Ads & Meta Ads
### SEO & Local Search
### Website & Conversion Optimization
### Hospitality Technology
### Data, Reporting & AI Solutions
### Commercial Team Development
Опыт, который растёт вместе с клиентами
## Работа с более чем 100 hospitality-бизнесами
От небольших независимых отелей до более сложных операций принцип один: понять бизнес, прочитать данные, выбрать следующую работу, выполнить и измерить.
100+
Поддержанных hospitality-бизнесов
### Destination Group
### BYD Lofts Boutique Hotel & Serviced Apartments
### Hotel COCO Phuket
### Naiya Buree Boutique Resort
### Baan Taranya Resort
### Casa Solana Patong
### Casa De Lipe
### Baan 125 Stay
Что для нас важно
## Мышление, которое стоит за работой
### Создавать ценность, которую можно измерить
Всё, что мы делаем, должно влиять на бизнес: доход, прибыль, эффективность или возможности команды.
### Понимать отельный бизнес из реального опыта
Стратегия — не только теория. Она опирается на опыт и рабочее понимание hospitality.
### Использовать данные для решений
Хорошие решения должны опираться на опыт, данные, рынок и поведение гостей.
### Использовать технологии с целью
Технологии и ИИ должны делать работу проще, быстрее и эффективнее — а не сложнее.
### Работать как часть команды
Мы работаем с собственниками, управляющими и командами отелей к одной цели.
### Продолжать учиться
Рынок, технологии и поведение гостей меняются. Мы проверяем, измеряем и продолжаем улучшать работу.
![The KPI Plus founders](media/the-kpi-plus-founders_f4c8516e.webp)
Основатели
## Два опыта. Одна общая цель.
The KPI Plus вырос из двух разных путей основателей с одной верой: хороший hospitality-бизнес должен расти в доходе, системах и людях.
### Кхун Нетнапис
Основатель
У Кхун Нетнапис более 21 года в отелях, включая Mandarin Oriental Bangkok, The Westin Siray Bay Resort & Spa Phuket и Phuket Marriott Resort & Spa, Merlin Beach. Она понимает сервис, управление командой, опыт гостя и долгосрочный рост отеля.
### Кхун Иссара Иссаранирун
Сооснователь и генеральный директор
У Кхун Иссары более 15 лет в hospitality-технологиях, продажах, digital-маркетинге и hotel solutions, включая ReverseAds, eZee Technosys, Compass Edge и OYO Hotels. Как CEO он ведёт направление бизнеса, технологии и решения, которые отели могут использовать на практике.
Better Decisions. Better Performance.
## Цифры — не только отчёт. Они должны показывать команде следующий шаг.
Отельная работа меняется быстро: поведение путешественников, поиск, OTA, digital-маркетинг и ИИ. Полезный вопрос — что говорят данные, в чём реальная проблема и создаёт ли работа результат.
[Связаться с нами](mailto:info@thekpiplus.com?subject=Join%20The%20KPI%20Plus)`,
    },
    zh: {
      title: "關於 The KPI Plus | The KPI Plus",
      description: "認識 The KPI Plus：總部位於普吉、由創辦人帶領的酒店績效與成長夥伴。",
      main: `The KPI Plus
Hotel Revenue Management and Hospitality Performance
# 用收益管理、資料、數位行銷與科技，協助酒店成長
The KPI Plus 與泰國各地的酒店與旅宿事業合作，協助提升收益、制定價格策略、管理 OTA 與銷售通路、增加直銷預訂，並發展數位行銷。
我們不只看短期銷售，而是協助酒店把事業看得更清楚、做出更好的決策，並建立系統，讓團隊能長期更有效地工作。
願景
## 成為泰國領先的 Hotel Revenue Management 與 Hospitality Performance 公司之一
我們結合資料、科技、收益與成長策略，以及真實產業經驗，協助酒店成長。
使命
## 把事業看得更清楚、決策更好、收益增加、工作更有效，並能持續成長
當旅宿專業、資料、科技、收益與成長策略，以及可執行的行動連在一起，這件事才會發生。
我們做什麼
## The KPI Plus 涵蓋收益、行銷、科技，以及酒店團隊的工作方式
我們不認為每家酒店都需要同一套工具或同一套策略。有用的起點是先理解事業正面對什麼、下一步該做什麼，再選擇做法，並衡量實際發生的結果。
### Hotel Revenue Management
### Pricing & Revenue Strategy
### OTA & Distribution Management
### Direct Booking
### Google Ads & Meta Ads
### SEO & Local Search
### Website & Conversion Optimization
### Hospitality Technology
### Data, Reporting & AI Solutions
### Commercial Team Development
與客戶一起成長的經驗
## 已與超過 100 家旅宿事業合作
從小型獨立酒店到更複雜的旅宿營運，原則相同：理解事業、讀懂資料、選擇下一步、執行，並衡量結果。
100+
已協助的旅宿事業
### Destination Group
### BYD Lofts Boutique Hotel & Serviced Apartments
### Hotel COCO Phuket
### Naiya Buree Boutique Resort
### Baan Taranya Resort
### Casa Solana Patong
### Casa De Lipe
### Baan 125 Stay
我們在意的事
## 工作背後的思考
### 創造可以衡量的價值
我們做的每件事都應影響事業：收益、獲利、效率，或團隊能力。
### 用真實經驗理解酒店工作
策略不只來自理論，而是來自經驗與對旅宿事業的實際理解。
### 用資料支持決策
好的決策應來自經驗、資料、市場與旅客行為。
### 有目的地使用科技
科技與 AI 應讓工作更簡單、更快、更有效，而不是更複雜。
### 像團隊的一部分一起工作
我們與業主、管理者與酒店團隊朝同一目標前進。
### 持續學習
市場、科技與旅客行為會改變。我們測試、衡量，並持續改善。
![The KPI Plus founders](media/the-kpi-plus-founders_f4c8516e.webp)
創辦人
## 兩段經驗，同一個目標
The KPI Plus 來自兩位創辦人不同的路徑，但有共同信念：好的旅宿事業應在收益、系統與人一起成長。
### Khun Netnaphis
創辦人
擁有超過 21 年酒店經驗，包括 Mandarin Oriental Bangkok、The Westin Siray Bay Resort & Spa Phuket，以及 Phuket Marriott Resort & Spa, Merlin Beach。她理解服務、團隊領導、旅客體驗，以及酒店的長期成長。
### Khun Issara Issaranirun
共同創辦人暨執行長
擁有超過 15 年旅宿科技、銷售、數位行銷與酒店解決方案經驗，包括 ReverseAds、eZee Technosys、Compass Edge 與 OYO Hotels。作為執行長，他負責事業方向、科技，以及酒店真正用得上的方案。
Better Decisions. Better Performance.
## 數字不只是報告，還要讓團隊看到下一步
酒店工作變化很快：旅客行為、搜尋、OTA、數位行銷與 AI。有用的問題是：資料在說什麼、真正的問題是什麼，以及目前的工作是否帶來結果。
[聯絡我們](mailto:info@thekpiplus.com?subject=Join%20The%20KPI%20Plus)`,
    },
  },
  approach: {
    en: {
      title: "The KPI Plus Commercial Approach | The KPI Plus",
      description: "A clear hospitality commercial approach from signal and decision to ownership and measurable next action.",
      main: `The KPI Plus approach
# Make hotel revenue and growth clear, then take the team to a better decision
Revenue, demand, technology, and follow-up work better when the hotel team can see the data, choose an owner, and measure the change.
See the picture. Know who owns the work. Choose the next move and measure it.
## 01 Read the signal
See the pressure on revenue, demand, booking, or the way the team is working.
## 02 Choose the next work
Turn the question into an action with a clear owner.
## 03 Connect the related work
Connect the teams, channels, and tools that have to work together.
## 04 Measure the change
Review the result, then set the next important question.
Example
## When occupancy drops in the next 60 days
Instead of cutting price immediately, The KPI Plus helps the hotel team turn the data into a revenue and growth action plan with owners and review points.
- 01 Review booking pace
- 02 Review market demand
- 03 Check competitor positioning
- 04 Review channel performance
- 05 Review campaign activity
- 06 Choose whether the next work is pricing, promotion, distribution, or demand generation
- 07 Assign an owner
- 08 Review the result`,
    },
    ru: {
      title: "Коммерческий подход The KPI Plus | The KPI Plus",
      description: "Понятный коммерческий подход для отелей: от сигнала и решения до владельца задачи и измеримого следующего шага.",
      main: `Подход The KPI Plus
# Сделайте доход и рост отеля понятными, затем приведите команду к лучшему решению
Доход, спрос, технологии и контроль работают лучше, когда команда отеля видит данные, выбирает владельца задачи и измеряет изменение.
Увидеть картину. Знать, кто отвечает. Выбрать следующий шаг и измерить его.
## 01 Прочитать сигнал
Увидеть давление на доход, спрос, бронирования или способ работы команды.
## 02 Выбрать следующую работу
Превратить вопрос в действие с ясным владельцем.
## 03 Связать связанную работу
Связать команды, каналы и инструменты, которые должны работать вместе.
## 04 Измерить изменение
Проверить результат и поставить следующий важный вопрос.
Пример
## Когда загрузка падает в следующие 60 дней
Вместо немедленного снижения цены The KPI Plus помогает команде отеля превратить данные в план действий по доходу и росту с владельцами и точками проверки.
- 01 Проверить booking pace
- 02 Проверить рыночный спрос
- 03 Проверить позицию конкурентов
- 04 Проверить работу каналов
- 05 Проверить кампании
- 06 Выбрать, что делать дальше: цена, акция, дистрибуция или генерация спроса
- 07 Назначить владельца
- 08 Проверить результат`,
    },
    zh: {
      title: "The KPI Plus 服務方式 | The KPI Plus",
      description: "清楚的酒店商業做法：從訊號與決策，到負責人與可衡量的下一步。",
      main: `The KPI Plus 的做法
# 先把酒店收益與成長看清楚，再帶團隊做出更好的決策
當酒店團隊看得到資料、指定負責人，並能量變結果時，收益、需求、科技與追蹤才會一起運作。
看清楚現況。知道誰負責。選擇下一步，並衡量它。
## 01 讀懂訊號
看清楚收益、需求、預訂或團隊工作方式上的壓力。
## 02 選擇下一步
把問題變成有清楚負責人的行動。
## 03 串連相關工作
把必須一起運作的團隊、通路與工具連起來。
## 04 衡量變化
檢視結果，再訂出下一個重要問題。
例子
## 當未來 60 天住房率下降
不必立刻降價。The KPI Plus 協助酒店團隊把資料變成有負責人與檢視點的收益與成長行動計畫。
- 01 檢視 booking pace
- 02 檢視市場需求
- 03 檢查競爭對手定位
- 04 檢視通路表現
- 05 檢視活動成效
- 06 選擇下一步是價格、促銷、通路，還是創造需求
- 07 指定負責人
- 08 檢視結果`,
    },
  },
  insights: {
    en: {
      title: "Hotel insights for owners and teams | The KPI Plus",
      description: "Notes for hotel owners, GMs, and teams on revenue, demand, marketing, technology, and the next useful commercial move.",
      main: `Insights
# Ideas hotel teams can use
Notes on revenue management, marketing, technology, and AI that help a hotel team see the next useful question.
[Request a hotel audit](/en#audit)
[See related solutions](/en/solutions/revenue-management)
![The KPI Plus hospitality commercial planning](media/the-kpi-plus-insights-scene_8a7e72cb.jpg)
These notes help the team see the revenue question, the growth question, the decision, and the next conversation.
How to use them
## Move from a question to work with an owner
## Revenue
Price, demand, forecast, channels, and direct-booking performance.
## Demand & marketing
Visibility, search, marketing, and the path from interest to a booking.
## Technology & AI
Automation, adoption, and team capability that make the work happen.
Featured
## How to run a revenue meeting that ends in a usable decision
A hotel revenue-meeting frame that turns revenue and growth signals into a decision, an owner, and a review point.
[Read the article](/insights/hotel-revenue-meetings-that-lead-to-decisions)
[What is hotel marketing? 8 ways to grow bookings and revenue](/hotel-marketing)
[How technology and AI can actually help a hotel team work better](/insights/hotel-technology-adoption-commercial-project)
[Audit the hotel’s direct-booking journey](/insights/direct-booking-journey-audit)
[SEO vs SEM for hotels: where to start](/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on)
The KPI Plus Performance Path
## See the problem clearly, work in the same direction, and measure what happens
[Start a conversation](/en#audit)`,
    },
    ru: {
      title: "Инсайты для владельцев и команд отелей | The KPI Plus",
      description: "Материалы для собственников, управляющих и команд отелей о доходе, спросе, маркетинге, технологиях и следующем полезном шаге.",
      main: `Инсайты
# Идеи, которые команда отеля может использовать
Материалы о revenue management, маркетинге, технологиях и ИИ, которые помогают команде увидеть следующий полезный вопрос.
[Запросить аудит](/ru#audit)
[Смотреть связанные решения](/ru/solutions/revenue-management)
![The KPI Plus hospitality commercial planning](media/the-kpi-plus-insights-scene_8a7e72cb.jpg)
Эти материалы помогают команде увидеть вопрос дохода, вопрос роста, решение и следующий разговор.
Как использовать
## От вопроса к работе с владельцем
## Доход
Цена, спрос, прогноз, каналы и работа прямого бронирования.
## Спрос и маркетинг
Видимость, поиск, маркетинг и путь от интереса к бронированию.
## Технологии и ИИ
Автоматизация, внедрение и способность команды выполнить работу.
Избранное
## Как провести revenue-встречу, которая заканчивается рабочим решением
Рамка встречи по доходу отеля, которая превращает сигналы дохода и роста в решение, владельца и точку проверки.
[Читать статью](/insights/hotel-revenue-meetings-that-lead-to-decisions)
[Что такое маркетинг отеля? 8 способов увеличить бронирования и доход](/hotel-marketing)
[Как технологии и ИИ реально помогают команде отеля работать лучше](/insights/hotel-technology-adoption-commercial-project)
[Проверить путь прямого бронирования отеля](/insights/direct-booking-journey-audit)
[SEO vs SEM для отелей: с чего начать](/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on)
The KPI Plus Performance Path
## Увидеть задачу ясно, работать в одном направлении и измерять то, что происходит
[Начать разговор](/ru#audit)`,
    },
    zh: {
      title: "給酒店業主與團隊的洞察 | The KPI Plus",
      description: "給業主、總經理與酒店團隊的觀點：收益、需求、行銷、科技，以及下一步有用的商業行動。",
      main: `洞察
# 酒店團隊用得上的想法
整理收益管理、行銷、科技與 AI 的觀點，幫助酒店團隊看見下一個有用的問題。
[申請評估](/zh#audit)
[查看相關方案](/zh/solutions/revenue-management)
![The KPI Plus hospitality commercial planning](media/the-kpi-plus-insights-scene_8a7e72cb.jpg)
這些內容幫助團隊看清楚收益問題、成長問題、決策，以及下一次該談什麼。
如何使用
## 從問題走到有負責人的工作
## 收益
價格、需求、預測、通路，以及直銷預訂表現。
## 需求與行銷
能見度、搜尋、行銷，以及從興趣走到預訂的路徑。
## 科技與 AI
自動化、導入，以及讓工作真的發生的團隊能力。
精選
## 如何讓收益會議以可用的決策結束
一套酒店收益會議框架，把收益與成長訊號變成決策、負責人與檢視點。
[閱讀文章](/insights/hotel-revenue-meetings-that-lead-to-decisions)
[什麼是酒店行銷？8 個增加預訂與收益的做法](/hotel-marketing)
[如何讓科技與 AI 真正幫助酒店團隊把工作做好](/insights/hotel-technology-adoption-commercial-project)
[檢查酒店的直銷預訂旅程](/insights/direct-booking-journey-audit)
[酒店 SEO 與 SEM：該從哪裡開始](/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on)
The KPI Plus Performance Path
## 看清楚問題、朝同一方向工作，並衡量實際發生的事
[開始對話](/zh#audit)`,
    },
  },
  "case-studies": {
    en: {
      title: "Published client collaborations | The KPI Plus",
      description: "Names we are permitted to publish as collaborations with The KPI Plus, with a standard that does not invent results or testimonials.",
      main: `Verified collaborations
# A useful success story starts with information that can be checked
We publish client names we are allowed to share, together with a clear standard for any case study that has a scope, a source, and client approval.
[Talk about your hotel](/en#audit)
[See our solutions](/en/solutions/revenue-management)
![The KPI Plus hospitality commercial planning](media/the-kpi-plus-revenue-scene_4932d3c7.jpg)
We publish collaboration information carefully and keep facts separate from anything that is not confirmed.
Standard before publishing
## Make the collaboration meaningful by separating the problem, the work, and the evidence
## The challenge
Describe the hotel’s problem and context with information that can be checked.
## The work
State what the team actually did and the period involved.
## The evidence
Connect results to an agreed source and time period.
Verified client names
## Naming a collaboration is not a claim about hotel results.
The names below are permitted as public collaborations with The KPI Plus. We do not publish scope, revenue or growth results, quotes, or numbers unless the client has approved them and supporting records exist.
### Destination Group
Permitted as a public collaboration name. No service claim, result, or client endorsement is published yet.
### BYD Lofts Boutique Hotel & Serviced Apartments
Permitted as a public collaboration name. No service claim, result, or client endorsement is published yet.
### Hotel COCO Phuket
Permitted as a public collaboration name. No service claim, result, or client endorsement is published yet.
### Naiya Buree Boutique Resort
Permitted as a public collaboration name. No service claim, result, or client endorsement is published yet.
### Baan Taranya Resort
Permitted as a public collaboration name. No service claim, result, or client endorsement is published yet.
### Casa Solana Patong
Permitted as a public collaboration name. No service claim, result, or client endorsement is published yet.
### Casa De Lipe
Permitted as a public collaboration name. No service claim, result, or client endorsement is published yet.
### Baan 125 Stay
Permitted as a public collaboration name. No service claim, result, or client endorsement is published yet.
Publishing standard
## We publish a full story only when the information and evidence are ready.
### Client approval
The client approves the name, the scope, and the key content used in a case study.`,
    },
    ru: {
      title: "Опубликованные сотрудничества | The KPI Plus",
      description: "Имена клиентов, которые разрешено публиковать как сотрудничество с The KPI Plus, без выдуманных результатов и отзывов.",
      main: `Проверенные сотрудничества
# Полезная история успеха начинается с информации, которую можно проверить
Мы публикуем имена клиентов, которые разрешено называть, и ясный стандарт для любого кейса с объёмом работы, источником и одобрением клиента.
[Обсудить ваш отель](/ru#audit)
[Смотреть решения](/ru/solutions/revenue-management)
![The KPI Plus hospitality commercial planning](media/the-kpi-plus-revenue-scene_4932d3c7.jpg)
Мы публикуем информацию о сотрудничестве осторожно и отделяем факты от того, что ещё не подтверждено.
Стандарт до публикации
## Сделайте сотрудничество понятным: отделите задачу, работу и доказательства
## Задача
Опишите проблему и контекст отеля проверяемой информацией.
## Работа
Укажите, что команда сделала на самом деле и за какой период.
## Доказательства
Свяжите результат с согласованным источником и периодом.
Проверенные имена клиентов
## Указать сотрудничество — не значит заявлять результат отеля.
Имена ниже разрешены как публичное сотрудничество с The KPI Plus. Мы не публикуем объём работ, результаты дохода или роста, цитаты или цифры, пока клиент не одобрил их и нет подтверждающих записей.
### Destination Group
Разрешено как публичное имя сотрудничества. Услуга, результат или отзыв клиента пока не публикуются.
### BYD Lofts Boutique Hotel & Serviced Apartments
Разрешено как публичное имя сотрудничества. Услуга, результат или отзыв клиента пока не публикуются.
### Hotel COCO Phuket
Разрешено как публичное имя сотрудничества. Услуга, результат или отзыв клиента пока не публикуются.
### Naiya Buree Boutique Resort
Разрешено как публичное имя сотрудничества. Услуга, результат или отзыв клиента пока не публикуются.
### Baan Taranya Resort
Разрешено как публичное имя сотрудничества. Услуга, результат или отзыв клиента пока не публикуются.
### Casa Solana Patong
Разрешено как публичное имя сотрудничества. Услуга, результат или отзыв клиента пока не публикуются.
### Casa De Lipe
Разрешено как публичное имя сотрудничества. Услуга, результат или отзыв клиента пока не публикуются.
### Baan 125 Stay
Разрешено как публичное имя сотрудничества. Услуга, результат или отзыв клиента пока не публикуются.
Стандарт публикации
## Полную историю мы публикуем только когда информация и доказательства готовы.
### Одобрение клиента
Клиент одобряет имя, объём работы и ключевое содержание кейса.`,
    },
    zh: {
      title: "已公開的客戶合作 | The KPI Plus",
      description: "經同意可公開的合作名稱，以及不虛構成果或推薦的案例發布標準。",
      main: `可核對的合作資訊
# 有用的成功故事，必須從可核對的資料開始
我們公開已獲同意的客戶名稱，以及任何案例研究的標準：要有工作範圍、資料來源，以及客戶核准。
[談談您的酒店](/zh#audit)
[查看我們的方案](/zh/solutions/revenue-management)
![The KPI Plus hospitality commercial planning](media/the-kpi-plus-revenue-scene_4932d3c7.jpg)
我們謹慎公開合作資訊，並把事實與尚未確認的內容分開。
發布前的標準
## 把問題、工作與證據分開，合作資訊才有意義
## 挑戰
用可核對的資料說明酒店的問題與背景。
## 工作方式
說明團隊實際做了什麼，以及對應期間。
## 結果證據
把結果連到雙方同意的資料來源與期間。
已核對的客戶名稱
## 列出合作名稱，並不是在主張酒店成果。
以下名稱已獲同意作為與 The KPI Plus 的公開合作。除非客戶核准且有文件支持，我們不會公開工作範圍、收益或成長結果、客戶引言或數字。
### Destination Group
已獲同意作為公開合作名稱。目前尚未公開服務內容、成果或客戶背書。
### BYD Lofts Boutique Hotel & Serviced Apartments
已獲同意作為公開合作名稱。目前尚未公開服務內容、成果或客戶背書。
### Hotel COCO Phuket
已獲同意作為公開合作名稱。目前尚未公開服務內容、成果或客戶背書。
### Naiya Buree Boutique Resort
已獲同意作為公開合作名稱。目前尚未公開服務內容、成果或客戶背書。
### Baan Taranya Resort
已獲同意作為公開合作名稱。目前尚未公開服務內容、成果或客戶背書。
### Casa Solana Patong
已獲同意作為公開合作名稱。目前尚未公開服務內容、成果或客戶背書。
### Casa De Lipe
已獲同意作為公開合作名稱。目前尚未公開服務內容、成果或客戶背書。
### Baan 125 Stay
已獲同意作為公開合作名稱。目前尚未公開服務內容、成果或客戶背書。
發布標準
## 只有在資料與證據齊備時，才會公開完整故事。
### 客戶核准
客戶核准名稱、工作範圍，以及案例中將使用的重要內容。`,
    },
  },
  privacy: {
    en: {
      title: "Privacy Policy | The KPI Plus",
      description: "How The KPI Plus handles website enquiries, CRM access, analytics, contact tracking, and personal information.",
      main: `The KPI Plus website policy
# Privacy, with clarity.
How The KPI Plus handles enquiries, CRM access, analytics, and public website information.
Last updated: 19 August 2026
## What this policy covers
This policy explains how The KPI Plus handles personal information collected through this website, including hotel performance audit enquiries, contact requests, team-workspace access, and public website interactions.
## Information we collect
When you submit an enquiry, we collect the information you provide, such as your name, company or hotel, job title, work email, phone number, hotel location, website, room count, service interest, preferred contact method, and commercial challenge. We also receive limited technical and usage information from the website, such as page views and interaction events.
## Why we use information
We use this information to respond to enquiries, prepare relevant follow-up, operate the protected CRM workspace, understand which public pages and calls to action are useful, maintain security, and improve the website and services.
## Service providers and third parties
We use technical service providers to operate the website and its features. These include Google Analytics for website measurement and Google Maps for the embedded Phuket location map. These providers may process limited technical information according to their own policies. The KPI Plus does not sell enquiry data.
## Storage, access, and retention
Enquiry records are stored in the project CRM environment and are accessible only to authorised team users. We keep information only for as long as reasonably necessary for the enquiry, relationship, operational records, security, or legal obligations, then delete or anonymise it where appropriate.
## Your choices
You may contact us to ask about the information held in relation to your enquiry, request a correction, or request deletion where applicable. You can also manage browser settings to limit cookies or opt out of certain analytics technologies.
## Contact
For privacy enquiries, contact info@thekpiplus.com or call +66 82 635 6266 or +66 62 635 6646. This policy is a working website policy and should be reviewed by a qualified legal professional before formal reliance.`,
    },
    ru: {
      title: "Политика конфиденциальности | The KPI Plus",
      description: "Как The KPI Plus обрабатывает заявки с сайта, доступ к CRM, аналитику и персональные данные.",
      main: `Политика сайта The KPI Plus
# Конфиденциальность без лишней сложности.
Как The KPI Plus обрабатывает заявки, доступ к CRM, аналитику и публичную информацию сайта.
Обновлено: 19 августа 2026
## Что покрывает эта политика
Эта политика объясняет, как The KPI Plus обрабатывает персональные данные, собранные через сайт: заявки на аудит отеля, контактные запросы, доступ к рабочей CRM-среде и публичные действия на сайте.
## Какие данные мы собираем
Когда вы отправляете заявку, мы собираем указанные вами данные: имя, компания или отель, должность, рабочий email, телефон, локация отеля, сайт, число номеров, интерес к услуге, удобный канал связи и коммерческая задача. Мы также получаем ограниченные технические и пользовательские данные, например просмотры страниц и события взаимодействия.
## Зачем мы используем данные
Мы используем эти данные, чтобы отвечать на заявки, готовить следующий контакт, поддерживать защищённую CRM-среду, понимать, какие публичные страницы и призывы к действию полезны, обеспечивать безопасность и улучшать сайт и услуги.
## Поставщики и третьи стороны
Мы используем технических поставщиков для работы сайта. Среди них Google Analytics для измерения сайта и Google Maps для карты локации на Пхукете. Эти поставщики могут обрабатывать ограниченные технические данные по своим политикам. The KPI Plus не продаёт данные заявок.
## Хранение, доступ и срок
Записи заявок хранятся в CRM-среде проекта и доступны только уполномоченным пользователям команды. Мы храним данные столько, сколько разумно нужно для заявки, отношений, операционных записей, безопасности или правовых обязанностей, затем удаляем или обезличиваем их, где это уместно.
## Ваш выбор
Вы можете связаться с нами, чтобы узнать, какие данные хранятся по вашей заявке, попросить исправление или удаление, где это применимо. Также можно ограничить cookie в настройках браузера или отключить отдельные технологии аналитики.
## Контакт
По вопросам конфиденциальности пишите на info@thekpiplus.com или звоните +66 82 635 6266 и +66 62 635 6646. Это рабочая политика сайта; перед официальным использованием её должен проверить квалифицированный юрист.`,
    },
    zh: {
      title: "隱私權政策 | The KPI Plus",
      description: "The KPI Plus 如何處理網站諮詢、CRM 存取、分析與個人資料。",
      main: `The KPI Plus 網站政策
# 清楚說明隱私做法。
The KPI Plus 如何處理諮詢、CRM 存取、分析與公開網站資訊。
最後更新：2026 年 8 月 19 日
## 本政策涵蓋範圍
本政策說明 The KPI Plus 如何處理透過本網站蒐集的個人資料，包括酒店績效評估諮詢、聯絡請求、團隊工作區存取，以及公開網站上的互動。
## 我們蒐集的資料
當您送出諮詢時，我們會蒐集您提供的資料，例如姓名、公司或酒店、職稱、工作電子郵件、電話、酒店地點、網站、客房數、服務興趣、偏好聯絡方式，以及商業挑戰。我們也會取得有限的技術與使用資料，例如頁面瀏覽與互動事件。
## 我們為何使用資料
我們使用這些資料回覆諮詢、準備後續聯繫、運作受保護的 CRM 工作區、了解哪些公開頁面與行動呼籲有用、維持安全，並改善網站與服務。
## 服務供應商與第三方
我們使用技術服務供應商運作網站與功能，包括用於網站衡量的 Google Analytics，以及普吉據點嵌入地圖的 Google Maps。這些供應商可能依其政策處理有限技術資料。The KPI Plus 不會出售諮詢資料。
## 儲存、存取與保存
諮詢紀錄存放於專案 CRM 環境，僅授權團隊使用者可存取。我們只在諮詢、關係、營運紀錄、安全或法律義務合理需要的期間保存資料，之後會在適當時刪除或去識別化。
## 您的選擇
您可以聯絡我們，詢問與您諮詢相關的資料、要求更正，或在適用情況下要求刪除。您也可以在瀏覽器設定中限制 cookie，或退出部分分析技術。
## 聯絡
隱私相關問題請寄 info@thekpiplus.com，或致電 +66 82 635 6266、+66 62 635 6646。這是網站的工作政策，正式採用前應由合格法律專業人士審閱。`,
    },
  },
  cookies: {
    en: {
      title: "Cookie Policy | The KPI Plus",
      description: "How The KPI Plus uses necessary technologies, analytics, preferences, and Google Maps on this website.",
      main: `The KPI Plus website policy
# Cookies, with context.
How The KPI Plus uses necessary, preference, analytics, and Google Maps technologies.
Last updated: 19 August 2026
## What cookies are
Cookies are small files placed on your device by a website. Similar technologies can also store or read information in a browser to help a website remember a session, understand usage, or load embedded services.
## Strictly necessary technologies
The protected team workspace uses authentication and session technologies to keep authorised users signed in and protect access. These are necessary for the workspace to operate and are not used to build advertising profiles.
## Preferences
The public site can remember certain display preferences, such as a selected language. You can remove these preferences through your browser settings.
## Analytics
The KPI Plus uses Google Analytics to understand aggregate website use, including page views, referral paths, navigation, scroll depth, language changes, contact actions, directions clicks, and qualified lead conversion. Analytics is used to improve commercial content and conversion journeys, not to sell personal data.
## Embedded maps
The Contact page embeds Google Maps so visitors can view the verified Phuket business location and request directions. Google may use its own cookies or similar technologies when the map loads, subject to Google’s policies.
## Managing cookies
Most browsers let you block, remove, or control cookies. Blocking some cookies may affect features such as map display, language preferences, analytics measurement, or protected workspace sessions.`,
    },
    ru: {
      title: "Политика cookie | The KPI Plus",
      description: "Как The KPI Plus использует необходимые технологии, аналитику, предпочтения и Google Maps на сайте.",
      main: `Политика сайта The KPI Plus
# Cookie в контексте.
Как The KPI Plus использует необходимые технологии, предпочтения, аналитику и Google Maps.
Обновлено: 19 августа 2026
## Что такое cookie
Cookie — небольшие файлы, которые сайт размещает на вашем устройстве. Похожие технологии также могут хранить или читать данные в браузере, чтобы сайт помнил сессию, понимал использование или загружал встроенные сервисы.
## Строго необходимые технологии
Защищённая рабочая среда команды использует технологии аутентификации и сессии, чтобы авторизованные пользователи оставались в системе. Они нужны для работы среды и не используются для рекламных профилей.
## Предпочтения
Публичный сайт может запоминать отдельные настройки отображения, например выбранный язык. Их можно удалить в настройках браузера.
## Аналитика
The KPI Plus использует Google Analytics, чтобы понимать совокупное использование сайта: просмотры, источники перехода, навигацию, глубину прокрутки, смену языка, контактные действия, клики маршрута и конверсию заявок. Аналитика нужна, чтобы улучшать коммерческий контент и путь обращения, а не продавать персональные данные.
## Встроенные карты
На странице контактов встроен Google Maps, чтобы посетители видели проверенную локацию на Пхукете и могли запросить маршрут. Google может использовать свои cookie или похожие технологии при загрузке карты согласно своим политикам.
## Управление cookie
Большинство браузеров позволяют блокировать, удалять или контролировать cookie. Блокировка части cookie может повлиять на карту, языковые предпочтения, аналитику или защищённые сессии рабочей среды.`,
    },
    zh: {
      title: "Cookie 政策 | The KPI Plus",
      description: "The KPI Plus 如何在本網站使用必要技術、分析、偏好設定與 Google 地圖。",
      main: `The KPI Plus 網站政策
# 說明 Cookie 的用途。
The KPI Plus 如何使用必要技術、偏好設定、分析與 Google 地圖。
最後更新：2026 年 8 月 19 日
## Cookie 是什麼
Cookie 是網站放在您裝置上的小型檔案。類似技術也可能在瀏覽器中儲存或讀取資訊，協助網站記住工作階段、了解使用情況，或載入嵌入服務。
## 嚴格必要的技術
受保護的團隊工作區使用驗證與工作階段技術，讓授權使用者保持登入並保護存取。這些技術是工作區運作所必要，不用來建立廣告輪廓。
## 偏好設定
公開網站可以記住部分顯示偏好，例如所選語言。您可在瀏覽器設定中移除這些偏好。
## 分析
The KPI Plus 使用 Google Analytics 了解整體網站使用，包括頁面瀏覽、來源路徑、導覽、捲動深度、語言切換、聯絡動作、路線點擊，以及合格名單轉換。分析用於改善商業內容與轉換路徑，不是販售個人資料。
## 嵌入地圖
聯絡頁嵌入 Google 地圖，讓訪客查看已驗證的普吉營業地點並要求路線。地圖載入時，Google 可能依其政策使用自己的 cookie 或類似技術。
## 管理 Cookie
大多數瀏覽器可封鎖、移除或控制 cookie。封鎖部分 cookie 可能影響地圖顯示、語言偏好、分析衡量，或受保護工作區的工作階段。`,
    },
  },
};

const seoMeta = {
  "/": {
    en: { title: "The KPI Plus | Hotel revenue and commercial growth partner", description: "The KPI Plus helps hotels grow revenue, demand, direct booking, technology, and the way the team works." },
    ru: { title: "The KPI Plus | Партнёр по доходам и коммерческому росту отелей", description: "The KPI Plus помогает отелям развивать доход, спрос, прямое бронирование, технологии и способ работы команды." },
    zh: { title: "The KPI Plus | 酒店收益與商業成長夥伴", description: "The KPI Plus 協助酒店提升收益、需求、直銷預訂、科技，以及團隊的工作方式。" },
  },
  "/solutions": {
    en: { title: "Hotel solutions | The KPI Plus", description: "Revenue, demand, and capability solutions for hotels from The KPI Plus." },
    ru: { title: "Решения для отелей | The KPI Plus", description: "Решения The KPI Plus для дохода, спроса и возможностей команды отеля." },
    zh: { title: "酒店解決方案 | The KPI Plus", description: "The KPI Plus 的酒店收益、需求與團隊能力方案。" },
  },
  "/associations": {
    en: { title: "Companies in association with The KPI Plus | The KPI Plus", description: "Specialized hospitality technology, education, and travel-service companies in association with The KPI Plus." },
    ru: { title: "Партнёры The KPI Plus | The KPI Plus", description: "Компании в сфере гостиничных технологий, образования и туристических услуг в ассоциации с The KPI Plus." },
    zh: { title: "The KPI Plus 合作夥伴 | The KPI Plus", description: "與 The KPI Plus 合作的酒店科技、教育與旅遊服務公司。" },
  },
};

function pathFor(locale, slug) {
  if (slug === "/") return `/${locale}`;
  return `/${locale}${slug}`;
}

function writeMarkdown(locale, slug, page) {
  const route = pathFor(locale, `/${slug}`);
  const file = join(pagesRoot, locale, `${slug}.md`);
  mkdirSync(dirname(file), { recursive: true });
  const body = `# ${route}
**Language:** ${locale}
**Title:** ${page.title}
**Description:** ${page.description}
**Canonical:** ${SITE}${route}

## Page content and controls

### MAIN

${page.main}

### FOOTER
`;
  writeFileSync(file, body, "utf8");
}

function alternatesFor(slug) {
  const th = slug === "/" ? `${SITE}/` : `${SITE}${slug}`;
  return [
    { hreflang: "en", href: `${SITE}${pathFor("en", slug)}` },
    { hreflang: "th", href: th },
    { hreflang: "zh", href: `${SITE}${pathFor("zh", slug)}` },
    { hreflang: "ru", href: `${SITE}${pathFor("ru", slug)}` },
  ];
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const existing = new Set(manifest.map((item) => item.route));

for (const [slug, locales] of Object.entries(pages)) {
  for (const [locale, page] of Object.entries(locales)) {
    writeMarkdown(locale, slug, page);
    const route = pathFor(locale, `/${slug}`);
    if (existing.has(route)) continue;
    manifest.push({
      route,
      language: locale === "zh" ? "zh-Hant" : locale,
      title: page.title,
      description: page.description,
      canonical: `${SITE}${route}`,
      alternates: alternatesFor(`/${slug}`),
      ogImage: OG,
      ogUrl: `${SITE}${route}`,
    });
    existing.add(route);
  }
}

for (const [slug, locales] of Object.entries(seoMeta)) {
  for (const [locale, page] of Object.entries(locales)) {
    const route = pathFor(locale, slug);
    if (existing.has(route)) continue;
    manifest.push({
      route,
      language: locale === "zh" ? "zh-Hant" : locale,
      title: page.title,
      description: page.description,
      canonical: `${SITE}${route}`,
      alternates: alternatesFor(slug),
      ogImage: OG,
      ogUrl: `${SITE}${route}`,
    });
    existing.add(route);
  }
}

manifest.sort((a, b) => a.route.localeCompare(b.route));
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`, "utf8");
console.log("routes", manifest.length);
