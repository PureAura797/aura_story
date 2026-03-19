import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch { /* read-only FS (Vercel) */ }
}

export function readJSON<T>(filename: string, fallback: T): T {
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(filename: string, data: T): void {
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    console.log(`[data] Read-only FS, skipping write: ${filename}`);
  }
}

// ─── Content ─────────────────────────────────────────
export type ContentDict = Record<string, string>;

export function getContent(locale: "ru" | "en"): ContentDict {
  return readJSON<ContentDict>(`content-${locale}.json`, {});
}

export function saveContent(locale: "ru" | "en", data: ContentDict): void {
  writeJSON(`content-${locale}.json`, data);
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

export function getCalculatorConfig(): CalculatorConfig {
  return readJSON<CalculatorConfig>("calculator.json", DEFAULT_CALC);
}

export function saveCalculatorConfig(config: CalculatorConfig): void {
  writeJSON("calculator.json", config);
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
  { id: "1", author: "Андрей М.", service: "Уборка после смерти", text: "Обратились после смерти отца. Квартира была в тяжёлом состоянии 3 недели. Бригада приехала через 40 минут, работали 10 часов. Получили протокол с АТФ-тестами. Запаха нет.", date_label: "Февраль 2026", rating: 5, published: true, sort_order: 0 },
  { id: "2", author: "Ольга К.", service: "Устранение запахов", text: "Купили квартиру, где предыдущий владелец скончался. Три клининга не помогли. PureAura нашли источник в стяжке, демонтировали, обработали. Гарантия 30 дней — запах не вернулся.", date_label: "Январь 2026", rating: 5, published: true, sort_order: 1 },
  { id: "3", author: "УК «Домсервис»", service: "Инфекционный контроль", text: "Прорыв канализации на первом этаже. Затопило подвал и два помещения. Выполнили полный протокол за 12 часов. Акты для страховой предоставили в тот же день.", date_label: "Декабрь 2025", rating: 5, published: true, sort_order: 2 },
  { id: "4", author: "Сергей В.", service: "Расхламление", text: "Нужно было подготовить «бабушкину» квартиру к продаже. Объем мусора был колоссальный. Ребята за два дня вывезли всё, отчистили полы до бетона и устранили едкий запах. Очень профессионально.", date_label: "Ноябрь 2025", rating: 5, published: true, sort_order: 3 },
  { id: "5", author: "Марина Т.", service: "Уборка после пожара", text: "Сгорела кухня. Вся квартира была в черной саже и копоти. Мастера демонтировали обожженные элементы и провели химическую отмывку со спецрастворами. Ни следа гари не осталось.", date_label: "Сентябрь 2025", rating: 5, published: true, sort_order: 4 },
  { id: "6", author: "ООО «Логистика Плюс»", service: "Дезинсекция", text: "Заказывали санитарную обработку склада площадью 800 кв.м. Все сделано быстро, по нормам Роспотребнадзора, предоставили договор и акты выполненных работ. Будем сотрудничать на постоянной основе.", date_label: "Август 2025", rating: 5, published: true, sort_order: 5 },
  { id: "7", author: "Елена Д.", service: "Дезинсекция", text: "Безуспешно боролись с клопами 3 месяца своими силами. Обратились в PureAura — приехали ночью (!), поставили барьер, все сделали конфиденциально. Спим спокойно уже полгода.", date_label: "Июнь 2025", rating: 5, published: true, sort_order: 6 },
];

export function getReviews(): Review[] {
  return readJSON<Review[]>("reviews.json", DEFAULT_REVIEWS);
}

export function saveReviews(reviews: Review[]): void {
  writeJSON("reviews.json", reviews);
}
