"use client";

import Link from "next/link";
import {
  FileText, Calculator, Star, ArrowRight, Image, Phone, Bell, BarChart3,
  HelpCircle, Briefcase, Users, CreditCard, MessageCircle, Award, Search, Settings
} from "lucide-react";

const cards = [
  {
    href: "/admin/content",
    icon: FileText,
    title: "Контент",
    desc: "Тексты, заголовки, описания — всё, что видят посетители.",
    count: "~370 полей",
    color: "#5eead4",
  },
  {
    href: "/admin/services",
    icon: Briefcase,
    title: "Услуги",
    desc: "Направления компании — добавление, удаление, редактирование.",
    count: "6 услуг",
    color: "#14b8a6",
  },
  {
    href: "/admin/team",
    icon: Users,
    title: "Команда",
    desc: "Сотрудники — фото, должности, статусы, специализация.",
    count: "6 сотрудников",
    color: "#60a5fa",
  },
  {
    href: "/admin/pricing",
    icon: CreditCard,
    title: "Тарифы",
    desc: "Прайс-лист — цены, площади, описания услуг.",
    count: "8 тарифов",
    color: "#d4a574",
  },
  {
    href: "/admin/calculator",
    icon: Calculator,
    title: "Калькулятор",
    desc: "Базовые цены, коэффициенты площади, доп. услуги.",
    count: "7 услуг",
    color: "#fbbf24",
  },
  {
    href: "/admin/reviews",
    icon: Star,
    title: "Отзывы",
    desc: "Добавление, редактирование и модерация отзывов.",
    count: "7 отзывов",
    color: "#a78bfa",
  },
  {
    href: "/admin/faq",
    icon: MessageCircle,
    title: "FAQ",
    desc: "Часто задаваемые вопросы — вопрос и ответ.",
    count: "14 вопросов",
    color: "#fb923c",
  },
  {
    href: "/admin/certificates",
    icon: Award,
    title: "Сертификаты",
    desc: "Лицензии и разрешительные документы компании.",
    count: "1 документ",
    color: "#34d399",
  },
  {
    href: "/admin/seo",
    icon: Search,
    title: "SEO",
    desc: "Title, description, OG-тег, фавикон для поисковиков.",
    count: "4 параметра",
    color: "#38bdf8",
  },
  {
    href: "/admin/media",
    icon: Image,
    title: "Медиа",
    desc: "Обложки сторис, видео, портфолио, оборудование.",
    count: "динамично",
    color: "#f472b6",
  },
  {
    href: "/admin/contacts",
    icon: Phone,
    title: "Контакты",
    desc: "Телефон, мессенджеры, email, webhook заявок.",
    count: "8 полей",
    color: "#c084fc",
  },
  {
    href: "/admin/notifications",
    icon: Bell,
    title: "Уведомления",
    desc: "Email, Telegram, MAX — каналы доставки заявок.",
    count: "4 канала",
    color: "#fb7185",
  },
  {
    href: "/admin/analytics",
    icon: BarChart3,
    title: "Аналитика",
    desc: "Метрика, GA4, GTM, VK Pixel, скрипты.",
    count: "4 счётчика",
    color: "#4ade80",
  },
  {
    href: "/admin/settings",
    icon: Settings,
    title: "Настройки",
    desc: "Безопасность, профиль, смена пароля.",
    count: "3 параметра",
    color: "#94a3b8",
  },
  {
    href: "/admin/help",
    icon: HelpCircle,
    title: "Справка",
    desc: "Инструкции, FAQ, словарь терминов.",
    count: "3 раздела",
    color: "#e879f9",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Управление сайтом</h1>
        <p className="text-sm text-neutral-500">Выберите раздел для редактирования</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 p-6 hover:border-white/15 hover:bg-white/[0.06] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-5">
              <card.icon className="w-8 h-8 opacity-60 group-hover:opacity-90 transition-opacity text-white" strokeWidth={1} />
              <ArrowRight
                className="w-4 h-4 text-neutral-700 group-hover:text-neutral-400 group-hover:translate-x-0.5 transition-all"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="text-sm font-bold mb-1 group-hover:text-white transition-colors">{card.title}</h2>
            <p className="text-[11px] text-neutral-500 leading-relaxed mb-3">{card.desc}</p>
            <span className="text-[9px] text-neutral-600 uppercase tracking-[0.15em] font-medium">{card.count}</span>
          </Link>
        ))}
      </div>

      {/* Info */}
      <div className="mt-8 border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-5">
        <p className="text-[11px] text-neutral-500 leading-relaxed">
          <span className="text-emerald-400 font-medium">Supabase подключён.</span>{" "}
          Данные сохраняются в PostgreSQL. Изменения синхронизируются между всеми устройствами.
        </p>
      </div>
    </div>
  );
}
