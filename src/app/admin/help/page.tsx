"use client";

import { useState } from "react";
import {
  HelpCircle, FileText, Calculator, Star, Image, Phone, Bell, BarChart3,
  Settings, ChevronDown, ChevronUp, BookOpen, Zap, MessageCircle, Mail,
  Link, Shield, Server, Key, Globe, Code, ExternalLink
} from "lucide-react";

/* ─── Section Guides ─── */
const sections = [
  {
    icon: FileText,
    title: "Контент",
    color: "#5eead4",
    description: "Все тексты, которые видят посетители на сайте.",
    steps: [
      "Откройте раздел «Контент» в меню слева",
      "Найдите нужную секцию (герой, услуги, отзывы и т.д.)",
      "Измените текст в поле ввода",
      "Нажмите «Сохранить» — изменения появятся на сайте мгновенно",
    ],
  },
  {
    icon: Calculator,
    title: "Калькулятор",
    color: "#d4a574",
    description: "Управление ценами и услугами в онлайн-калькуляторе.",
    steps: [
      "Откройте раздел «Калькулятор»",
      "Измените базовые цены, коэффициенты площади или доп. услуги",
      "Цены на сайте обновятся автоматически после сохранения",
    ],
  },
  {
    icon: Star,
    title: "Отзывы",
    color: "#a78bfa",
    description: "Модерация и управление отзывами клиентов.",
    steps: [
      "Откройте раздел «Отзывы»",
      "Добавьте новый отзыв: имя, текст, рейтинг",
      "Редактируйте или удаляйте существующие отзывы",
      "Отзывы отображаются в карусели на главной странице",
    ],
  },
  {
    icon: Image,
    title: "Медиа",
    color: "#f472b6",
    description: "Фотографии команды, портфолио, обложки сторис.",
    steps: [
      "Откройте раздел «Медиа»",
      "Выберите категорию: команда, портфолио, обложки…",
      "Загрузите новые файлы или замените существующие",
      "Поддерживаются форматы: JPG, PNG, WebP, MP4",
    ],
  },
  {
    icon: Phone,
    title: "Контакты",
    color: "#38bdf8",
    description: "Контактные данные компании, отображаемые на сайте.",
    steps: [
      "Откройте раздел «Контакты»",
      "Измените телефон, email, ссылки на мессенджеры",
      "Эти данные автоматически подтягиваются во все кнопки «Позвонить», в подвал, навбар и виджет",
    ],
  },
  {
    icon: Bell,
    title: "Уведомления",
    color: "#fbbf24",
    description: "Настройка каналов доставки заявок с сайта.",
    steps: [
      "Откройте раздел «Уведомления»",
      "Включите нужные каналы: Email, Telegram, MAX или Webhook",
      "Заполните настройки (SMTP для email, токен бота для Telegram)",
      "Отправьте тестовую заявку для проверки",
      "Все заявки отправляются во все включённые каналы одновременно",
    ],
  },
  {
    icon: BarChart3,
    title: "Аналитика",
    color: "#34d399",
    description: "Счётчики, пиксели и произвольные скрипты для рекламы.",
    steps: [
      "Откройте раздел «Аналитика»",
      "Вставьте ID счётчика: Яндекс.Метрика, GA4, GTM или VK Pixel",
      "Для дополнительных сервисов используйте «Произвольные скрипты»",
      "Нажмите «Сохранить» — скрипты появятся на всех страницах",
    ],
  },
  {
    icon: Settings,
    title: "Настройки",
    color: "#94a3b8",
    description: "Безопасность и профиль администратора.",
    steps: [
      "Email для восстановления — куда придёт код при сбросе пароля",
      "Телефон администратора — для внутренней связи",
      "Смена пароля — введите текущий и новый пароль",
    ],
  },
];

/* ─── FAQ ─── */
const faq = [
  {
    q: "Как подключить Telegram-бота для заявок?",
    a: "1. Откройте @BotFather в Telegram\n2. Отправьте /newbot, следуйте инструкциям\n3. Скопируйте токен бота (вида 123456789:ABCdefGHI…)\n4. Вставьте токен в Уведомления → Telegram → Токен бота\n5. Каждый сотрудник должен написать /start боту\n6. Узнать chat_id: отправьте /start в @userinfobot\n7. Добавьте chat_id в поле «Chat ID сотрудников» через запятую",
  },
  {
    q: "Как восстановить пароль?",
    a: "1. На странице входа нажмите «Забыли пароль?»\n2. Введите email, указанный в Настройках\n3. Если настроен SMTP — код придёт на почту\n4. Если SMTP не настроен — код появится в консоли сервера (терминал, где запущен сайт)\n5. Введите код → задайте новый пароль",
  },
  {
    q: "Как добавить Яндекс.Метрику?",
    a: "1. Зайдите в metrika.yandex.ru → создайте счётчик\n2. Скопируйте числовой ID счётчика (например, 12345678)\n3. Вставьте его в Аналитика → Яндекс.Метрика\n4. Нажмите «Сохранить» — считчик заработает на всех страницах",
  },
  {
    q: "Как добавить Google Analytics?",
    a: "1. Зайдите в analytics.google.com → создайте ресурс GA4\n2. Откройте Администратор → Потоки данных → Веб\n3. Скопируйте Measurement ID (начинается с G-)\n4. Вставьте в Аналитика → Google Analytics (GA4)\n5. Сохраните",
  },
  {
    q: "Что такое GTM и зачем он нужен?",
    a: "Google Tag Manager — контейнер для управления скриптами без изменения кода сайта. Если рекламщик использует GTM, нужен только Container ID (начинается с GTM-).\nЧерез GTM можно подключать: Метрику, GA4, события конверсий, ретаргетинг и любые другие скрипты.",
  },
  {
    q: "Как настроить VK Pixel?",
    a: "1. Зайдите в vk.com/ads → Аудитории → Пиксель\n2. Создайте пиксель, скопируйте его ID (вида VK-RTRG-XXXXXX-XXXXX)\n3. Вставьте в Аналитика → VK Pixel\n4. Сохраните — пиксель будет отслеживать посетителей для ретаргетинга",
  },
  {
    q: "Как добавить произвольный скрипт (Roistat, Calltouch и т.д.)?",
    a: "1. Откройте Аналитика → Произвольные скрипты\n2. Нажмите «Добавить скрипт»\n3. Укажите название, выберите позицию (head или body)\n4. Вставьте код скрипта от сервиса\n5. Сохраните — скрипт начнёт работать на сайте",
  },
  {
    q: "Можно ли использовать админку с телефона?",
    a: "Да! Админка полностью адаптивна. На телефоне сайдбар скрывается в бургер-меню. Все функции доступны с мобильного устройства.",
  },
  {
    q: "Где хранятся данные?",
    a: "Данные хранятся в JSON-файлах на сервере (папка src/data/). Для высоконагруженного продакшена рекомендуется миграция на базу данных (Supabase, PostgreSQL). Файлы: content.json, contacts.json, analytics.json, notifications.json и другие.",
  },
];

/* ─── Glossary ─── */
const glossary = [
  { term: "SMTP", icon: Mail, description: "Simple Mail Transfer Protocol — протокол для отправки Email. Для восстановления пароля и уведомлений нужны данные SMTP-сервера: адрес (smtp.yandex.ru), порт (587), логин и пароль." },
  { term: "API", icon: Code, description: "Application Programming Interface — программный интерфейс, через который части системы общаются между собой. Админка общается с сервером через API." },
  { term: "Webhook", icon: Link, description: "URL-адрес, на который сервер отправляет данные при событии (например, новая заявка). Используется для интеграции с n8n, Zapier, Bitrix24 и другими системами." },
  { term: "Bot Token", icon: Key, description: "Уникальный ключ доступа к боту в Telegram или MAX. Создаётся через @BotFather (Telegram) или @MasterBot (MAX). Выглядит как: 123456789:ABCdefGHIjklMNO." },
  { term: "Chat ID", icon: MessageCircle, description: "Числовой идентификатор пользователя или группы в Telegram/MAX. Нужен, чтобы бот знал, кому отправлять заявки. Узнать: @userinfobot → /start." },
  { term: "GA4", icon: Globe, description: "Google Analytics 4 — система аналитики от Google. Measurement ID (начинается с G-) вставляется в раздел «Аналитика» для отслеживания посещений сайта." },
  { term: "GTM", icon: Server, description: "Google Tag Manager — менеджер тегов. Container ID (начинается с GTM-) позволяет рекламщику добавлять любые скрипты через интерфейс GTM без доступа к коду сайта." },
  { term: "Метрика", icon: BarChart3, description: "Яндекс.Метрика — аналог Google Analytics от Яндекса. Counter ID — числовой идентификатор счётчика для отслеживания посетителей и конверсий." },
  { term: "VK Pixel", icon: Zap, description: "Пиксель ретаргетинга VK Ads. Позволяет показывать рекламу в ВКонтакте тем, кто уже посещал сайт. ID имеет вид VK-RTRG-XXXXXX-XXXXX." },
  { term: "SHA-256", icon: Shield, description: "Алгоритм хеширования. Пароль хранится не в открытом виде, а в виде хеша — необратимой строки символов. Даже при утечке данных пароль не будет скомпрометирован." },
  { term: ".env.local", icon: Key, description: "Файл с переменными окружения, в котором хранятся секретные данные: пароль админки, SMTP-ключи, токены. Этот файл не попадает в git и должен быть создан вручную на сервере." },
  { term: "JSON", icon: Code, description: "JavaScript Object Notation — формат хранения данных. Все настройки админки (контент, контакты, аналитика) сохраняются в JSON-файлах на сервере." },
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
      <div className="flex gap-1 mb-6 border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-1 w-fit">
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
                <div
                  className="w-8 h-8 flex items-center justify-center border border-white/10"
                  style={{ backgroundColor: section.color + "10", borderColor: section.color + "20" }}
                >
                  <section.icon className="w-4 h-4" style={{ color: section.color }} strokeWidth={1.5} />
                </div>
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
                      <span className="w-5 h-5 shrink-0 flex items-center justify-center text-[10px] font-bold border border-white/10 text-neutral-400 mt-0.5">
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
              <div className="w-8 h-8 flex items-center justify-center border border-white/10 bg-white/[0.03] shrink-0">
                <item.icon className="w-4 h-4 text-teal-400" strokeWidth={1.5} />
              </div>
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
