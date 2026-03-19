"use client";

import { useState } from "react";
import {
  HelpCircle, FileText, Calculator, Star, Image, Phone, Bell, BarChart3,
  Settings, ChevronDown, ChevronUp, BookOpen, Zap, MessageCircle, Mail,
  Link, Shield, Server, Key, Globe, Code, ExternalLink, Briefcase, Users,
  CreditCard, Award, Search
} from "lucide-react";

/* ─── Section Guides ─── */
const sections = [
  {
    icon: FileText,
    title: "Контент",
    description: "Все тексты, которые видят посетители на сайте.",
    steps: [
      "Откройте раздел «Контент» в меню слева",
      "Найдите нужную секцию (герой, услуги, отзывы и т.д.)",
      "Измените текст в поле ввода",
      "Нажмите «Сохранить» — изменения появятся на сайте мгновенно",
    ],
  },
  {
    icon: Briefcase,
    title: "Услуги",
    description: "Управление направлениями компании — добавление, удаление, редактирование.",
    steps: [
      "Откройте раздел «Услуги» в меню слева",
      "Каждая карточка — отдельная услуга с названием, описанием, мета",
      "Нажмите «Добавить» для создания новой услуги",
      "Используйте стрелки ↑↓ для изменения порядка",
      "Нажмите 👁 чтобы показать/скрыть услугу на сайте",
      "Нажмите «Сохранить» после редактирования",
    ],
  },
  {
    icon: Users,
    title: "Команда",
    description: "Сотрудники — фото, должности, статусы, специализация.",
    steps: [
      "Откройте раздел «Команда» в меню слева",
      "Кликните на аватар сотрудника для загрузки новой фотографии",
      "Заполните: имя, должность, статус, опыт, объекты, специализацию",
      "Выберите акцентный цвет — рамка аватара на сайте",
      "При смене состава: добавьте нового, удалите ушедшего",
      "Нажмите «Сохранить» после редактирования",
    ],
  },
  {
    icon: CreditCard,
    title: "Тарифы",
    description: "Прайс-лист — цены, площади, описания услуг.",
    steps: [
      "Откройте раздел «Тарифы»",
      "Каждая карточка: название, площадь, описание, фичи, цена",
      "Добавьте новый тариф через кнопку «Добавить»",
      "Используйте 👁 для публикации/скрытия",
      "Нажмите «Сохранить» после редактирования",
    ],
  },
  {
    icon: Calculator,
    title: "Калькулятор",
    description: "Управление ценами и услугами в онлайн-калькуляторе.",
    steps: [
      "Откройте раздел «Калькулятор»",
      "Измените базовые цены, коэффициенты площади или доп. услуги",
      "Цены обновятся автоматически после сохранения",
    ],
  },
  {
    icon: Star,
    title: "Отзывы",
    description: "Модерация и управление отзывами клиентов.",
    steps: [
      "Откройте раздел «Отзывы»",
      "Добавьте новый отзыв: имя, текст, рейтинг",
      "Редактируйте или удаляйте существующие",
      "Отзывы отображаются в карусели на главной",
    ],
  },
  {
    icon: MessageCircle,
    title: "FAQ",
    description: "Часто задаваемые вопросы — вопрос и развёрнутый ответ.",
    steps: [
      "Откройте раздел «FAQ»",
      "Добавьте новый вопрос через «Добавить»",
      "Заполните вопрос и ответ",
      "Используйте 👁 для публикации/скрытия",
    ],
  },
  {
    icon: Award,
    title: "Сертификаты",
    description: "Лицензии и разрешительные документы компании.",
    steps: [
      "Откройте раздел «Сертификаты»",
      "Заполните: название, номер, дату, описание",
      "Укажите URL превью и ссылку на PDF для скачивания",
    ],
  },
  {
    icon: Search,
    title: "SEO",
    description: "Мета-теги для поисковиков: title, description, OG-тег, фавикон.",
    steps: [
      "Откройте раздел «SEO»",
      "Измените Title (макс. 70 символов) и Description (макс. 320 символов)",
      "Загрузите OG-изображение — превью при шаринге ссылки",
      "Загрузите фавикон — иконка во вкладке браузера",
      "Нажмите «Сохранить»",
    ],
  },
  {
    icon: Image,
    title: "Медиа",
    description: "Фотографии, обложки сторис, видео.",
    steps: [
      "Откройте раздел «Медиа»",
      "Выберите категорию: портфолио, обложки…",
      "Загрузите новые файлы или замените существующие",
      "Форматы: JPG, PNG, WebP, MP4",
    ],
  },
  {
    icon: Phone,
    title: "Контакты",
    description: "Контактные данные компании на сайте.",
    steps: [
      "Откройте раздел «Контакты»",
      "Измените телефон, email, ссылки на мессенджеры",
      "Данные подтягиваются во все кнопки, подвал и виджет",
    ],
  },
  {
    icon: Bell,
    title: "Уведомления",
    description: "Настройка каналов доставки заявок с сайта.",
    steps: [
      "Откройте раздел «Уведомления»",
      "Включите каналы: Email, Telegram, MAX или Webhook",
      "Заполните настройки (SMTP, токен бота)",
      "Отправьте тестовую заявку для проверки",
    ],
  },
  {
    icon: BarChart3,
    title: "Аналитика",
    description: "Счётчики, пиксели и скрипты для рекламы.",
    steps: [
      "Откройте раздел «Аналитика»",
      "Вставьте ID: Яндекс.Метрика, GA4, GTM, VK Pixel",
      "Для доп. сервисов — «Произвольные скрипты»",
      "Нажмите «Сохранить»",
    ],
  },
  {
    icon: Settings,
    title: "Настройки",
    description: "Безопасность и профиль администратора.",
    steps: [
      "Email для восстановления — куда придёт код",
      "Телефон администратора — для внутренней связи",
      "Смена пароля — текущий и новый",
    ],
  },
];

/* ─── FAQ ─── */
const faq = [
  {
    q: "Как подключить Telegram-бота для заявок?",
    a: "1. Откройте @BotFather в Telegram\n2. Отправьте /newbot, следуйте инструкциям\n3. Скопируйте токен бота\n4. Вставьте в Уведомления → Telegram → Токен бота\n5. Сотрудники должны написать /start боту\n6. Узнать chat_id: @userinfobot → /start\n7. Добавьте chat_id через запятую",
  },
  {
    q: "Как восстановить пароль?",
    a: "1. На странице входа — «Забыли пароль?»\n2. Введите email из Настроек\n3. Если настроен SMTP — код на почту\n4. Если нет — код в консоли сервера\n5. Введите код → новый пароль",
  },
  {
    q: "Как добавить/удалить сотрудника?",
    a: "1. Откройте «Команда» в меню\n2. Нажмите «Добавить» для нового сотрудника\n3. Загрузите фото, заполните поля\n4. Для удаления — кнопка корзины на карточке\n5. Не забудьте «Сохранить»",
  },
  {
    q: "Как добавить новую услугу?",
    a: "1. Откройте «Услуги» → «Добавить»\n2. Заполните название, описание, мета (цена, площадь)\n3. Опубликуйте через 👁\n4. Нажмите «Сохранить»\n5. Услуга появится на сайте автоматически",
  },
  {
    q: "Как изменить SEO-теги (title, description)?",
    a: "1. Откройте «SEO» в меню\n2. Измените Title (макс. 70 символов, без бренда)\n3. Измените Description (макс. 320 символов)\n4. Загрузите OG-изображение для соцсетей\n5. Нажмите «Сохранить»",
  },
  {
    q: "Как загрузить новый сертификат?",
    a: "1. Откройте «Сертификаты» → «Добавить»\n2. Заполните название, номер, дату\n3. Укажите URL превью (PNG) и ссылку на PDF\n4. Нажмите «Сохранить»\n5. PDF загрузите через «Медиа» или вебхостинг",
  },
  {
    q: "Где хранятся данные?",
    a: "Данные хранятся в Supabase — облачная PostgreSQL-база. Каждая коллекция (услуги, команда, тарифы, FAQ, отзывы, сертификаты, SEO) — отдельная запись в таблице admin_data.",
  },
  {
    q: "Можно ли использовать админку с телефона?",
    a: "Да! Админка полностью адаптивна. На телефоне сайдбар скрывается в бургер-меню. Все функции доступны с мобильного.",
  },
];

/* ─── Glossary ─── */
const glossary = [
  { term: "SMTP", icon: Mail, description: "Протокол для отправки Email. Для уведомлений нужны: адрес (smtp.yandex.ru), порт (587), логин и пароль." },
  { term: "API", icon: Code, description: "Программный интерфейс, через который админка общается с сервером." },
  { term: "Webhook", icon: Link, description: "URL для интеграции с n8n, Zapier, Bitrix24 — отправляет данные при новой заявке." },
  { term: "Bot Token", icon: Key, description: "Ключ доступа к боту в Telegram/MAX. Создаётся через @BotFather." },
  { term: "Chat ID", icon: MessageCircle, description: "Числовой ID пользователя в Telegram. Узнать: @userinfobot → /start." },
  { term: "GA4", icon: Globe, description: "Google Analytics 4. Measurement ID (G-...) для отслеживания посещений." },
  { term: "GTM", icon: Server, description: "Google Tag Manager. Container ID (GTM-...) для управления скриптами." },
  { term: "Метрика", icon: BarChart3, description: "Яндекс.Метрика — аналог GA. Counter ID для отслеживания." },
  { term: "VK Pixel", icon: Zap, description: "Пиксель ретаргетинга VK Ads (VK-RTRG-...) для рекламы." },
  { term: "OG Image", icon: Image, description: "Open Graph изображение — превью ссылки в соцсетях и мессенджерах." },
  { term: "Title", icon: Search, description: "Заголовок страницы в поисковой выдаче. Макс 70 символов, без бренда." },
  { term: "Description", icon: FileText, description: "Описание страницы в поисковике. Макс 320 символов, без бренда." },
  { term: "SHA-256", icon: Shield, description: "Хеширование пароля — хранится не в открытом виде." },
  { term: "Supabase", icon: Server, description: "Облачная PostgreSQL-база, где хранятся все данные админки." },
];

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/[0.06]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-sm text-neutral-300 pr-4">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-white/[0.04] pt-3">
          <p className="text-xs text-neutral-400 leading-relaxed whitespace-pre-line">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<"guide" | "faq" | "glossary">("guide");

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Справка</h1>
        <p className="text-xs text-neutral-500">Как пользоваться админ-панелью — инструкции, FAQ, термины</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-1 w-fit sm:w-auto">
        {[
          { key: "guide" as const, label: "Разделы", icon: BookOpen },
          { key: "faq" as const, label: "FAQ", icon: HelpCircle },
          { key: "glossary" as const, label: "Термины", icon: Zap },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-xs font-medium tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-white/[0.08] text-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Sections Guide */}
      {activeTab === "guide" && (
        <div className="space-y-3">
          {sections.map((section) => (
            <details key={section.title} className="group border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150">
              <summary className="flex items-center gap-3 p-4 cursor-pointer list-none hover:bg-white/[0.02] transition-colors">
                <section.icon className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{section.title}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{section.description}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-4 pb-4 border-t border-white/[0.04] pt-3">
                <ol className="space-y-2">
                  {section.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 shrink-0 flex items-center justify-center text-[11px] font-bold border border-white/10 text-neutral-400 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-xs text-neutral-400 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </details>
          ))}
        </div>
      )}

      {/* Tab: FAQ */}
      {activeTab === "faq" && (
        <div className="space-y-2">
          {faq.map((item) => (
            <Accordion key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      )}

      {/* Tab: Glossary */}
      {activeTab === "glossary" && (
        <div className="space-y-2">
          {glossary.map((item) => (
            <div key={item.term} className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-4 flex items-start gap-3">
              <item.icon className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-bold text-white mb-1">{item.term}</p>
                <p className="text-xs text-neutral-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-4 mt-6">
        <div className="flex items-start gap-2.5">
          <ExternalLink className="w-4 h-4 text-neutral-600 mt-0.5 shrink-0" strokeWidth={1.5} />
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Если возникли вопросы — обратитесь к разработчику или деплойщику.
            Техническая документация находится в файле README.md в корне проекта.
          </p>
        </div>
      </div>
    </div>
  );
}
