import { readData, writeData } from "./supabase";

/* ─── Generic helpers (Supabase-backed) ─── */

export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  return readData<T>(key, fallback);
}

export async function writeJSON<T>(key: string, data: T): Promise<void> {
  await writeData(key, data);
}

// ─── Content ─────────────────────────────────────────
export type ContentDict = Record<string, string>;

export async function getContent(locale: "ru" | "en"): Promise<ContentDict> {
  return readJSON<ContentDict>(`content-${locale}`, {});
}

export async function saveContent(locale: "ru" | "en", data: ContentDict): Promise<void> {
  await writeJSON(`content-${locale}`, data);
}

// ─── Calculator Config ───────────────────────────────
export interface CalcService {
  id: string;
  label_ru: string;
  label_en: string;
  base_price: number;
  sort_order: number;
  active: boolean;
}

export interface CalcExtra {
  id: string;
  label_ru: string;
  label_en: string;
  price: number;
  sort_order: number;
  active: boolean;
}

export interface CalcCoefficients {
  area_coeff: number;
  area_threshold: number;
  urgent_mult: number;
}

export interface CalculatorConfig {
  services: CalcService[];
  extras: CalcExtra[];
  coefficients: CalcCoefficients;
}

const DEFAULT_CALC: CalculatorConfig = {
  services: [
    { id: "death", label_ru: "После смерти", label_en: "After death", base_price: 15000, sort_order: 0, active: true },
    { id: "smell", label_ru: "Запахи", label_en: "Odor removal", base_price: 10000, sort_order: 1, active: true },
    { id: "hoarding", label_ru: "Расхламление", label_en: "Hoarding", base_price: 25000, sort_order: 2, active: true },
    { id: "fire", label_ru: "После пожара", label_en: "After fire", base_price: 20000, sort_order: 3, active: true },
  ],
  extras: [
    { id: "ozone", label_ru: "Озонация", label_en: "Ozone treatment", price: 3000, sort_order: 0, active: true },
    { id: "pest", label_ru: "Дезинсекция", label_en: "Pest control", price: 5000, sort_order: 1, active: true },
    { id: "trash", label_ru: "Вывоз мусора", label_en: "Trash removal", price: 8000, sort_order: 2, active: true },
  ],
  coefficients: {
    area_coeff: 0.015,
    area_threshold: 30,
    urgent_mult: 1.5,
  },
};

export async function getCalculatorConfig(): Promise<CalculatorConfig> {
  return readJSON<CalculatorConfig>("calculator", DEFAULT_CALC);
}

export async function saveCalculatorConfig(config: CalculatorConfig): Promise<void> {
  await writeJSON("calculator", config);
}

// ─── Reviews ─────────────────────────────────────────
export interface Review {
  id: string;
  author: string;
  service: string;
  text: string;
  date_label: string;
  rating: number;
  published: boolean;
  sort_order: number;
}

const DEFAULT_REVIEWS: Review[] = [
  { id: "1", author: "Андрей М.", service: "Уборка после смерти", text: "Обратились после смерти отца. Квартира была в тяжёлом состоянии 3 недели. Бригада приехала через 40 минут, работали 10 часов. Получили протокол чистоты. Запаха нет.", date_label: "Февраль 2026", rating: 5, published: true, sort_order: 0 },
  { id: "2", author: "Ольга К.", service: "Устранение запахов", text: "Купили квартиру, где предыдущий владелец скончался. Три клининга не помогли. АураЧистоты нашли источник в стяжке, демонтировали, обработали. Гарантия 30 дней — запах не вернулся.", date_label: "Январь 2026", rating: 5, published: true, sort_order: 1 },
  { id: "3", author: "УК «Домсервис»", service: "Инфекционный контроль", text: "Прорыв канализации на первом этаже. Затопило подвал и два помещения. Выполнили полный протокол за 12 часов. Акты для страховой предоставили в тот же день.", date_label: "Декабрь 2025", rating: 5, published: true, sort_order: 2 },
  { id: "4", author: "Сергей В.", service: "Расхламление", text: "Нужно было подготовить «бабушкину» квартиру к продаже. Объем мусора был колоссальный. Ребята за два дня вывезли всё, отчистили полы до бетона и устранили едкий запах. Очень профессионально.", date_label: "Ноябрь 2025", rating: 5, published: true, sort_order: 3 },
  { id: "5", author: "Марина Т.", service: "Уборка после пожара", text: "Сгорела кухня. Вся квартира была в черной саже и копоти. Мастера демонтировали обожженные элементы и провели химическую отмывку со спецрастворами. Ни следа гари не осталось.", date_label: "Сентябрь 2025", rating: 5, published: true, sort_order: 4 },
  { id: "6", author: "ООО «Логистика Плюс»", service: "Дезинсекция", text: "Заказывали санитарную обработку склада площадью 800 кв.м. Все сделано быстро, по нормам Роспотребнадзора, предоставили договор и акты выполненных работ. Будем сотрудничать на постоянной основе.", date_label: "Август 2025", rating: 5, published: true, sort_order: 5 },
  { id: "7", author: "Елена Д.", service: "Дезинсекция", text: "Безуспешно боролись с клопами 3 месяца своими силами. Обратились в АураЧистоты — приехали ночью (!), поставили барьер, все сделали конфиденциально. Спим спокойно уже полгода.", date_label: "Июнь 2025", rating: 5, published: true, sort_order: 6 },
];

export async function getReviews(): Promise<Review[]> {
  return readJSON<Review[]>("reviews", DEFAULT_REVIEWS);
}

export async function saveReviews(reviews: Review[]): Promise<void> {
  await writeJSON("reviews", reviews);
}

// ─── Services ────────────────────────────────────────
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  meta: string;
  published: boolean;
  sort_order: number;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  { id: "1", title: "После Смерти", description: "Полный демонтаж загрязнённых материалов, STP-обработка, озонация. Объект сдаётся с протоколом чистоты.", meta: "от 60 мин · до 120 кв.м · от 15 000 ₽", published: true, sort_order: 0 },
  { id: "2", title: "После Пожара", description: "Удаление копоти, сажи, запаха гари. Демонтаж обгоревших покрытий, вывоз сгоревшей мебели и стройматериалов. Химическая нейтрализация, озонация.", meta: "от 60 мин · до 200 кв.м · от 20 000 ₽", published: true, sort_order: 1 },
  { id: "3", title: "После Канализации", description: "Откачка, дезинфекция стен и полов, обработка антисептиком по СанПиН 3.3686-21. Сушка промышленными осушителями.", meta: "от 60 мин · до 300 кв.м · от 15 000 ₽", published: true, sort_order: 2 },
  { id: "4", title: "Накопительство", description: "Сортировка, вывоз до 200 м³, дезинсекция, дезинфекция. Поиск ценных вещей и документов по согласованию.", meta: "от 4 ч · без ограничений · от 25 000 ₽", published: true, sort_order: 3 },
  { id: "5", title: "Устранение Запахов", description: "Диагностика источника, механическая зачистка, обработка активным гидроксилом. Гарантия: запах вернётся — повторная обработка бесплатно.", meta: "от 40 мин · до 200 кв.м · от 10 000 ₽", published: true, sort_order: 4 },
  { id: "6", title: "Инфекционный Контроль", description: "Протокол после затопления, вирусных вспышек, биологических инцидентов. Обработка по стандартам СанПиН 3.3686-21.", meta: "от 60 мин · до 300 кв.м · от 12 000 ₽", published: true, sort_order: 5 },
];

export async function getServices(): Promise<ServiceItem[]> {
  return readJSON<ServiceItem[]>("services", DEFAULT_SERVICES);
}

export async function saveServices(services: ServiceItem[]): Promise<void> {
  await writeJSON("services", services);
}

// ─── Portfolio ────────────────────────────────────────
export interface PortfolioItem {
  id: string;
  type: string;
  area: string;
  time: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  published: boolean;
  sort_order: number;
}

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  { id: "1", type: "Уборка после ЧП", area: "48 кв.м", time: "8 часов", description: "Однокомнатная квартира. Полный демонтаж напольного покрытия, STP-обработка стен и потолка, трёхкратная озонация.", beforeImg: "/images/portfolio/hoarder_before.webp", afterImg: "/images/portfolio/hoarder_after.webp", published: true, sort_order: 0 },
  { id: "2", type: "Расхламление", area: "72 кв.м", time: "2 дня", description: "Двухкомнатная квартира. Вывоз 180 мешков, дезинсекция, дезинфекция всех поверхностей, восстановление вентиляции.", beforeImg: "/images/portfolio/hoarder_before.webp", afterImg: "/images/portfolio/hoarder_after.webp", published: true, sort_order: 1 },
  { id: "3", type: "Устранение запахов", area: "95 кв.м", time: "6 часов", description: "Трёхкомнатная квартира. Локализация источника в стяжке, демонтаж 12 кв.м пола, обработка гидроксилом, контрольные замеры.", beforeImg: "/images/portfolio/fire_before.webp", afterImg: "/images/portfolio/fire_after.webp", published: true, sort_order: 2 },
  { id: "4", type: "Инфекционный контроль", area: "110 кв.м", time: "10 часов", description: "Коммерческое помещение после прорыва канализации. Откачка, дезинфекция по СанПиН, сушка промышленными осушителями.", beforeImg: "/images/portfolio/fire_before.webp", afterImg: "/images/portfolio/fire_after.webp", published: true, sort_order: 3 },
];

export async function getPortfolio(): Promise<PortfolioItem[]> {
  return readJSON<PortfolioItem[]>("portfolio", DEFAULT_PORTFOLIO);
}

export async function savePortfolio(items: PortfolioItem[]): Promise<void> {
  await writeJSON("portfolio", items);
}

// ─── Equipment ────────────────────────────────────────
export interface EquipmentItem {
  id: string;
  name: string;
  tag: string;
  specs: string;
  purpose: string;
  details: string;
  image: string;
  color: string;
  published: boolean;
  sort_order: number;
}

const DEFAULT_EQUIPMENT: EquipmentItem[] = [
  { id: "1", name: "Генератор озона Dragon 20g", tag: "озонирование", specs: "20 г/ч", purpose: "Уничтожение органики и патогенов в воздухе. Мощность 20 г/ч.", details: "Промышленный озонатор для обеззараживания воздуха и поверхностей. Генерирует 20 граммов озона в час — достаточно для обработки помещений до 100 м². Озон окисляет органические соединения, уничтожает бактерии, вирусы и споры плесени. Полный цикл обработки — 2 часа.", image: "/equipment/ozone.webp", color: "#5eead4", published: true, sort_order: 0 },
  { id: "2", name: "Генератор гидроксила Biozone", tag: "очистка воздуха", specs: "PCO + UV-C", purpose: "Расщепление сложных запахов на молекулярном уровне без химических остатков.", details: "Фотокаталитический очиститель воздуха на основе UV-C ламп и TiO₂ катализатора. Генерирует гидроксильные радикалы, которые разрушают молекулы запахов, летучие органические соединения и патогены. Безопасен для людей — можно работать в присутствии заказчика.", image: "/equipment/hydroxyl.webp", color: "#38bdf8", published: true, sort_order: 1 },
  { id: "3", name: "STP-аппарат ULV Cold Fogger", tag: "распыление", specs: "5L / 800W", purpose: "Нанесение биоцидных составов на все поверхности, включая труднодоступные зоны.", details: "Ультранизкообъёмный распылитель холодного тумана. Размер капель 5–50 мкм — проникает в щели, вентиляцию, за мебель. Бак 5 литров, мощность 800 Вт. Обрабатывает до 200 м² за один заход. Совместим со всеми биоцидными и дезинфицирующими растворами.", image: "/equipment/fogger.webp", color: "#d4a574", published: true, sort_order: 2 },
  { id: "4", name: "Люминометр 3M Clean-Trace", tag: "диагностика", specs: "15 сек", purpose: "Объективный контроль чистоты поверхностей до и после обработки. Результат за 15 секунд.", details: "Портативный прибор для экспресс-анализа чистоты поверхностей. Измеряет уровень биологического загрязнения. Результат в RLU за 15 секунд. Протокол до/после обработки — объективное доказательство качества для заказчика.", image: "/equipment/atp.webp", color: "#a78bfa", published: true, sort_order: 3 },
  { id: "5", name: "Осушитель Trotec TTK", tag: "сушка", specs: "70 л/сут", purpose: "Принудительная сушка помещений после мокрой обработки. Производительность до 70 л/сутки.", details: "Промышленный конденсационный осушитель немецкого производства. Удаляет до 70 литров влаги в сутки. Применяется после мокрой дезинфекции, устранения последствий затоплений. Встроенный гигростат, автоматическое отключение, транспортировочные колёса.", image: "/equipment/dehumidifier.webp", color: "#fb7185", published: true, sort_order: 4 },
  { id: "6", name: "СИЗ и герметизация 3М", tag: "защита", specs: "класс 3", purpose: "Полная защита персонала и изоляция зоны заражения от остальных помещений.", details: "Полнолицевой респиратор 3М серии 6000 с комбинированными фильтрами ABEK2P3. Защитный комбинезон Tyvek категории III. Герметизация зон заражения полиэтиленом с проклейкой швов. Полная изоляция рабочей зоны от остального помещения.", image: "/equipment/ppe.webp", color: "#14b8a6", published: true, sort_order: 5 },
];

export async function getEquipment(): Promise<EquipmentItem[]> {
  return readJSON<EquipmentItem[]>("equipment", DEFAULT_EQUIPMENT);
}

export async function saveEquipment(items: EquipmentItem[]): Promise<void> {
  await writeJSON("equipment", items);
}

// ─── Stories ──────────────────────────────────────────
export interface StoryItem {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  cover: string;
  videos: string[];
  published: boolean;
  sort_order: number;
}

const DEFAULT_STORIES: StoryItem[] = [
  { id: "1", title: "Кейс", subtitle: "Уборка", color: "#5eead4", cover: "/stories/covers/cover-1.webp", videos: ["/stories/story-1_1.mp4", "/stories/story-1_2.mp4", "/stories/story-1_3.mp4", "/stories/story-1_4.mp4"], published: true, sort_order: 0 },
  { id: "2", title: "Кейс", subtitle: "Расхлам", color: "#d4a574", cover: "/stories/covers/cover-2.webp", videos: ["/stories/story-2_1.mp4", "/stories/story-2_2.mp4", "/stories/story-2_3.mp4", "/stories/story-2_4.mp4"], published: true, sort_order: 1 },
  { id: "3", title: "Кейс", subtitle: "Запахи", color: "#14b8a6", cover: "/stories/covers/cover-3.webp", videos: ["/stories/story-3_1.mp4", "/stories/story-3_2.mp4", "/stories/story-3_3.mp4", "/stories/story-3_4.mp4"], published: true, sort_order: 2 },
  { id: "4", title: "Кейс", subtitle: "Пожар", color: "#fb7185", cover: "/stories/covers/cover-4.webp", videos: ["/stories/story-4_1.mp4", "/stories/story-4_2.mp4", "/stories/story-4_3.mp4", "/stories/story-4_4.mp4"], published: true, sort_order: 3 },
  { id: "5", title: "Кейс", subtitle: "Плесень", color: "#a78bfa", cover: "/stories/covers/cover-5.webp", videos: ["/stories/story-5_1.mp4", "/stories/story-5_2.mp4", "/stories/story-5_3.mp4", "/stories/story-5_4.mp4"], published: true, sort_order: 4 },
  { id: "6", title: "Кейс", subtitle: "Контроль", color: "#5eead4", cover: "/stories/covers/cover-6.webp", videos: ["/stories/story-6_1.mp4", "/stories/story-6_2.mp4", "/stories/story-6_3.mp4", "/stories/story-6_4.mp4"], published: true, sort_order: 5 },
];

export async function getStories(): Promise<StoryItem[]> {
  return readJSON<StoryItem[]>("stories", DEFAULT_STORIES);
}

export async function saveStories(items: StoryItem[]): Promise<void> {
  await writeJSON("stories", items);
}

// ─── Pricing ─────────────────────────────────────────
export interface PricingItem {
  id: string;
  name: string;
  area: string;
  price: number;
  description: string;
  features: string;
  published: boolean;
  sort_order: number;
}

const DEFAULT_PRICING: PricingItem[] = [
  { id: "1", name: "Уборка после смерти", area: "до 120 кв.м", price: 15000, description: "Полный демонтаж загрязнённых материалов, STP-обработка, озонация. Протокол чистоты.", features: "Выезд 60 мин · Хим. дезинфекция · Озонация · Протокол", published: true, sort_order: 0 },
  { id: "2", name: "Устранение запахов", area: "до 200 кв.м", price: 10000, description: "Диагностика источника, механическая зачистка, обработка активным гидроксилом. Гарантия 30 дней.", features: "Поиск источника · Зачистка · Активный гидроксил", published: true, sort_order: 1 },
  { id: "3", name: "Расхламление", area: "без ограничений", price: 25000, description: "Сортировка, вывоз до 200 м³, дезинсекция, дезинфекция. Поиск ценных вещей и документов.", features: "Сортировка · Вывоз · Дезинсекция · Документы", published: true, sort_order: 2 },
  { id: "4", name: "Инфекционный контроль", area: "до 300 кв.м", price: 12000, description: "Протокол после затопления, канализационного прорыва. Стандарты СанПиН 3.3686-21.", features: "Герметизация · Обработка · Контроль · Акты", published: true, sort_order: 3 },
  { id: "5", name: "Дезинсекция", area: "до 100 кв.м", price: 5000, description: "Уничтожение тараканов, клопов, блох, кожеедов. Барьерная обработка с гарантией результата.", features: "Диагностика · Обработка · Барьер · Гарантия", published: true, sort_order: 4 },
  { id: "6", name: "Озонация воздуха", area: "до 150 кв.м", price: 3000, description: "Глубокое обеззараживание воздуха и поверхностей промышленным озонатором.", features: "Промышленный озонатор · Проветривание · Замер", published: true, sort_order: 5 },
  { id: "7", name: "Уборка после пожара", area: "до 200 кв.м", price: 20000, description: "Удаление копоти, сажи, запаха гари. Демонтаж повреждённых покрытий, химическая нейтрализация.", features: "Демонтаж · Хим. нейтрализация · Озонация", published: true, sort_order: 6 },
  { id: "8", name: "Вывоз мусора", area: "до 50 м³", price: 8000, description: "Крупногабаритный мусор, строительные отходы, старая мебель. Погрузка и утилизация.", features: "Погрузка · Транспортировка · Утилизация", published: true, sort_order: 7 },
];

export async function getPricing(): Promise<PricingItem[]> {
  return readJSON<PricingItem[]>("pricing", DEFAULT_PRICING);
}

export async function savePricing(pricing: PricingItem[]): Promise<void> {
  await writeJSON("pricing", pricing);
}

// ─── FAQ ─────────────────────────────────────────────
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  published: boolean;
  sort_order: number;
}

const DEFAULT_FAQ: FaqItem[] = [
  { id: "1", question: "Сколько длится обработка?", answer: "Зависит от площади и типа загрязнения. Очаговая обработка (до 5 кв.м) — 2–4 часа. Полный протокол (квартира) — 6–12 часов. Сложные случаи (накопительство, длительное разложение) — до 2 дней.", published: true, sort_order: 0 },
  { id: "2", question: "Безопасно ли находиться в квартире после обработки?", answer: "Да. После завершения протокола помещение проходит контрольную проверку чистоты. Объект не сдаётся до достижения безопасных показателей. Протокол предоставляется в письменном виде.", published: true, sort_order: 1 },
  { id: "3", question: "Работаете ли вы с юридическими лицами?", answer: "Да. Управляющие компании, страховые компании, риелторские агентства — работаем по договору с полным комплектом актов и протоколов.", published: true, sort_order: 2 },
  { id: "4", question: "Что делать с вещами умершего?", answer: "Сортируем вещи на безопасные и контаминированные. Безопасные передаём вам или по доверенности. Контаминированные утилизируем по классу «Б» с документальным оформлением.", published: true, sort_order: 3 },
  { id: "5", question: "Выезжаете за МКАД?", answer: "Да. Москва и Московская область. Выезд за МКАД — +500 ₽/км от МКАД.", published: true, sort_order: 4 },
  { id: "6", question: "Нужно ли мне присутствовать?", answer: "Нет. Работаем по доверенности или с представителем (управляющая компания, риелтор, сосед). Фотоотчёт и протокол отправляем дистанционно.", published: true, sort_order: 5 },
  { id: "7", question: "Мне стыдно вызывать — вы не будете осуждать?", answer: "Нет. Наша бригада — сертифицированные специалисты, а не случайные люди. Мы работали на сотнях объектов и относимся к каждой ситуации как к медицинскому случаю: без оценок, без лишних вопросов. Конфиденциальность — часть протокола.", published: true, sort_order: 6 },
  { id: "8", question: "Соседи узнают, что произошло?", answer: "Нет. Бригада приезжает в гражданской одежде, без маркировки на транспорте. Оборудование переносится в нейтральных кейсах. Мы не общаемся с соседями и не раскрываем характер работ.", published: true, sort_order: 7 },
  { id: "9", question: "Запах исчезнет полностью или только замаскируется?", answer: "Полностью. Мы не используем ароматизаторы и «сухой туман» — они только маскируют. Наш протокол разрушает органику на молекулярном уровне: озонирование, ферментная обработка, замена заражённых материалов. Если тест показывает превышение — работа продолжается.", published: true, sort_order: 8 },
  { id: "10", question: "Что остаётся после полиции и следственных действий?", answer: "Следственная группа не занимается уборкой. После их работы остаются: порошок для снятия отпечатков, маркировочная лента, биологические следы. Полиция фиксирует улики — мы устраняем последствия. Приступаем сразу после разрешения следователя.", published: true, sort_order: 9 },
  { id: "11", question: "Можно ли потом продать или сдать эту квартиру?", answer: "Да. После полного протокола квартира безопасна для проживания. Мы выдаём акт выполненных работ и протокол биологической чистоты — эти документы снимают вопросы у покупателей, арендаторов и управляющих компаний.", published: true, sort_order: 10 },
  { id: "12", question: "Я живу в другом городе — как организовать всё дистанционно?", answer: "Полностью берём на себя. Доступ через управляющую компанию или по доверенности. Весь процесс документируем: фото до/после, протоколы, акты. Согласование и оплата — онлайн. 40% клиентов находятся в другом городе.", published: true, sort_order: 11 },
  { id: "13", question: "Что включает уборка после пожара?", answer: "Полный комплекс: демонтаж обгоревших конструкций и покрытий, удаление копоти и сажи со стен, потолков и полов, химическая нейтрализация запаха гари, вывоз сгоревшей мебели и стройматериалов, промышленная озонация. По окончании — протокол чистоты воздуха.", published: true, sort_order: 12 },
  { id: "14", question: "Что делать при прорыве канализации?", answer: "Звоните сразу — выезжаем за 60 минут. Выполняем экстренную откачку, полную дезинфекцию стен и полов, обработку антисептиком по СанПиН 3.3686-21, промышленную сушку осушителями. Предоставляем акты для страховой компании.", published: true, sort_order: 13 },
];

export async function getFaq(): Promise<FaqItem[]> {
  return readJSON<FaqItem[]>("faq", DEFAULT_FAQ);
}

export async function saveFaq(faq: FaqItem[]): Promise<void> {
  await writeJSON("faq", faq);
}

// ─── Certificates ────────────────────────────────────
export interface CertificateItem {
  id: string;
  title: string;
  number: string;
  date: string;
  description: string;
  preview_url: string;
  download_url: string;
  published: boolean;
  sort_order: number;
}

const DEFAULT_CERTIFICATES: CertificateItem[] = [
  { id: "1", title: "Лицензия на дезинфекцию, дезинсекцию и дератизацию", number: "77.01.13.003.Л.000022.02.26", date: "24.02.2026", description: "Лицензия на деятельность по оказанию услуг по дезинфекции, дезинсекции и дератизации в целях обеспечения санитарно-эпидемиологического благополучия населения", preview_url: "/certificates/license-preview.png", download_url: "/certificates/license.pdf", published: true, sort_order: 0 },
];

export async function getCertificates(): Promise<CertificateItem[]> {
  return readJSON<CertificateItem[]>("certificates", DEFAULT_CERTIFICATES);
}

export async function saveCertificates(certificates: CertificateItem[]): Promise<void> {
  await writeJSON("certificates", certificates);
}

// ─── Team ────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: string;
  experience: string;
  objects: string;
  specialization: string;
  avatar: string;
  color: string;
  published: boolean;
  sort_order: number;
}

const DEFAULT_TEAM: TeamMember[] = [
  { id: "1", name: "Алексей Кравцов", role: "Руководитель бригады", status: "На выезде", experience: "12 лет", objects: "2 400+", specialization: "Биоочистка, дезинфекция", avatar: "/team/alexey.webp", color: "#5eead4", published: true, sort_order: 0 },
  { id: "2", name: "Марина Волкова", role: "Санитарный инженер", status: "Доступна", experience: "8 лет", objects: "1 800+", specialization: "Лабораторный контроль, протоколы", avatar: "/team/marina.webp", color: "#d4a574", published: true, sort_order: 1 },
  { id: "3", name: "Дмитрий Орлов", role: "Техник-дезинфектор", status: "На объекте", experience: "6 лет", objects: "900+", specialization: "Озонирование, ULV", avatar: "/team/dmitry.webp", color: "#a78bfa", published: true, sort_order: 2 },
  { id: "4", name: "Елена Сотникова", role: "Логист-координатор", status: "В офисе", experience: "5 лет", objects: "3 000+", specialization: "Координация, документооборот", avatar: "/team/elena.webp", color: "#fb7185", published: true, sort_order: 3 },
  { id: "5", name: "Игорь Белов", role: "Старший дезинфектор", status: "На выезде", experience: "10 лет", objects: "2 100+", specialization: "Биожидкости, утилизация", avatar: "/team/igor.webp", color: "#14b8a6", published: true, sort_order: 4 },
  { id: "6", name: "Анна Климова", role: "Контроль качества", status: "Доступна", experience: "7 лет", objects: "1 500+", specialization: "Финальная приёмка, контроль", avatar: "/team/anna.webp", color: "#38bdf8", published: true, sort_order: 5 },
];

export async function getTeam(): Promise<TeamMember[]> {
  return readJSON<TeamMember[]>("team", DEFAULT_TEAM);
}

export async function saveTeam(team: TeamMember[]): Promise<void> {
  await writeJSON("team", team);
}

// ─── SEO Settings ────────────────────────────────────
export interface SeoSettings {
  title: string;
  description: string;
  ogImage: string;
  favicon: string;
}

const DEFAULT_SEO: SeoSettings = {
  title: "Уборка после смерти, пожара, канализации Москва — 24/7 круглосуточно",
  description: "Профессиональная уборка после смерти, пожара, прорыва канализации и накопительства в Москве и МО. Устранение запаха, копоти, сажи. Дезинфекция по СанПиН. Выезд 60 минут, лицензия СЭС. Фиксированная цена, NDA, гарантия 30 дней.",
  ogImage: "/og-image.png",
  favicon: "/favicon.ico",
};

export async function getSeo(): Promise<SeoSettings> {
  return readJSON<SeoSettings>("seo", DEFAULT_SEO);
}

export async function saveSeo(seo: SeoSettings): Promise<void> {
  await writeJSON("seo", seo);
}
