import { Inter, Bebas_Neue, Unbounded, Jost } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroller from "@/components/effects/SmoothScroller";
import CustomCursor from "@/components/effects/CustomCursor";
import Providers from "@/components/Providers";
import AnalyticsScripts from "@/components/AnalyticsScripts";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-body" });
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });
const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], variable: "--font-unbounded", weight: ["200","300","400","500","600","700"] });
const jost = Jost({ subsets: ["latin", "cyrillic"], variable: "--font-jost" });

export const viewport: Viewport = {
  themeColor: "#0b0c0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Уборка после смерти, пожара, канализации Москва — 24/7 круглосуточно",
  description: "Профессиональная уборка после смерти, пожара, прорыва канализации и накопительства в Москве и МО. Устранение запаха, копоти, сажи. Дезинфекция по СанПиН. Выезд 60 минут, лицензия СЭС, АТФ-протокол. Фиксированная цена, NDA, гарантия 30 дней.",

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: {
    canonical: "https://pureaura.ru/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "PureAura",
    title: "Уборка после смерти, пожара, канализации Москва — 24/7",
    description: "Профессиональная биологическая очистка и дезинфекция помещений. Уборка после смерти, пожара, канализации, устранение запахов, расхламление. Выезд за 60 минут, АТФ-протокол.",
    url: "https://pureaura.ru/",
    images: [
      {
        url: "https://pureaura.ru/og-image.png",
        width: 1200,
        height: 630,
        alt: "PureAura — Профессиональная дезинфекция и биологическая очистка помещений в Москве",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Уборка после смерти, пожара, канализации Москва 24/7",
    description: "Профессиональная биологическая очистка: уборка после смерти, пожара, канализации, накопительства. Выезд за 60 минут.",
    images: ["https://pureaura.ru/og-image.png"],
  },
  other: {
    "geo.region": "RU-MOW",
    "geo.placename": "Москва",
    "geo.position": "55.7558;37.6173",
    "ICBM": "55.7558, 37.6173",
  },
};

// ─── JSON-LD: LocalBusiness + Service ────────────────────────────
const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://pureaura.ru/#organization",
  "name": "PureAura",
  "alternateName": "ПьюрАура",
  "description": "Профессиональная биологическая очистка и дезинфекция помещений в Москве и Московской области. Уборка после смерти, пожара, прорыва канализации, накопительства. Устранение запахов, инфекционный контроль.",
  "url": "https://pureaura.ru",
  "telephone": "+7-495-120-34-56",
  "email": "help@auraremediation.com",
  "image": "https://pureaura.ru/og-image.png",
  "logo": "https://pureaura.ru/logo.svg",
  "priceRange": "от 3 000 ₽",
  "currenciesAccepted": "RUB",
  "paymentAccepted": "Наличные, Безналичный расчёт, Карта",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Москва",
    "addressRegion": "Московская область",
    "addressCountry": "RU",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 55.7558,
    "longitude": 37.6173,
  },
  "areaServed": [
    { "@type": "City", "name": "Москва" },
    { "@type": "State", "name": "Московская область" },
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59",
  },
  "hasCredential": {
    "@type": "GovernmentPermit",
    "name": "Лицензия на дезинфекцию, дезинсекцию и дератизацию",
    "identifier": "77.01.13.003.Л.000022.02.26",
    "validFrom": "2026-02-24",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "bestRating": "5",
    "ratingCount": "127",
    "reviewCount": "94",
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Услуги биологической очистки и дезинфекции",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Уборка после смерти",
          "description": "Полный демонтаж загрязнённых материалов, STP-обработка, озонация. Протокол АТФ-тестирования. Площадь до 120 кв.м.",
        },
        "priceCurrency": "RUB",
        "price": "15000",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": "15000",
          "priceCurrency": "RUB",
          "valueAddedTaxIncluded": true,
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Устранение запахов",
          "description": "Диагностика источника, механическая зачистка, обработка активным гидроксилом. Гарантия 30 дней.",
        },
        "priceCurrency": "RUB",
        "price": "10000",
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Расхламление / Уборка при накопительстве",
          "description": "Сортировка, вывоз до 200 м³, дезинсекция, дезинфекция. Поиск ценных вещей по согласованию.",
        },
        "priceCurrency": "RUB",
        "price": "25000",
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Инфекционный контроль",
          "description": "Протокол после затопления, канализационного прорыва, пожара. Стандарты СанПиН 3.3686-21.",
        },
        "priceCurrency": "RUB",
        "price": "12000",
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Дезинсекция",
          "description": "Уничтожение тараканов, клопов, блох. Барьерная обработка с гарантией.",
        },
        "priceCurrency": "RUB",
        "price": "5000",
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Озонация воздуха",
          "description": "Глубокое обеззараживание воздуха и поверхностей промышленным озонатором.",
        },
        "priceCurrency": "RUB",
        "price": "3000",
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Уборка после пожара",
          "description": "Удаление копоти, сажи, запаха гари. Демонтаж повреждённых покрытий, химическая нейтрализация.",
        },
        "priceCurrency": "RUB",
        "price": "20000",
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Уборка после прорыва канализации",
          "description": "Откачка, дезинфекция стен и полов, обработка антисептиком по СанПиН 3.3686-21. Промышленная сушка.",
        },
        "priceCurrency": "RUB",
        "price": "15000",
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Вывоз мусора",
          "description": "Крупногабаритный мусор, строительные отходы, старая мебель. Погрузка и утилизация.",
        },
        "priceCurrency": "RUB",
        "price": "8000",
      },
    ],
  },
};

// ─── JSON-LD: FAQPage ────────────────────────────────────────────
const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Сколько длится обработка помещения после смерти?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Зависит от площади и типа загрязнения. Очаговая обработка (до 5 кв.м) — 2–4 часа. Полный протокол (квартира) — 6–12 часов. Сложные случаи (накопительство, длительное разложение) — до 2 дней.",
      },
    },
    {
      "@type": "Question",
      "name": "Безопасно ли находиться в квартире после дезинфекции?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Да. После завершения протокола помещение проходит АТФ-тестирование. Объект не сдаётся до достижения безопасных показателей. Протокол чистоты предоставляется в письменном виде.",
      },
    },
    {
      "@type": "Question",
      "name": "Работаете ли вы с юридическими лицами?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Да. Управляющие компании, страховые компании, риелторские агентства — работаем по договору с полным комплектом актов и протоколов.",
      },
    },
    {
      "@type": "Question",
      "name": "Что делать с вещами умершего при уборке?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Сортируем вещи на безопасные и контаминированные. Безопасные передаём вам или по доверенности. Контаминированные утилизируем по классу «Б» с документальным оформлением.",
      },
    },
    {
      "@type": "Question",
      "name": "Выезжаете за МКАД для уборки и дезинфекции?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Да. Москва и Московская область. Выезд за МКАД — +500 ₽/км от МКАД.",
      },
    },
    {
      "@type": "Question",
      "name": "Нужно ли присутствовать при уборке после смерти?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Нет. Работаем по доверенности или с представителем (управляющая компания, риелтор, сосед). Фотоотчёт и протокол отправляем дистанционно.",
      },
    },
  ],
};

// ─── JSON-LD: WebSite (enables sitelinks search) ────────────────
const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "PureAura",
  "url": "https://pureaura.ru",
  "description": "Профессиональная уборка после смерти, дезинфекция и биологическая очистка помещений в Москве 24/7",
  "publisher": { "@id": "https://pureaura.ru/#organization" },
};

// ─── JSON-LD: BreadcrumbList ─────────────────────────────────────
const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Главная",
      "item": "https://pureaura.ru",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`dark ${inter.variable} ${bebasNeue.variable} ${unbounded.variable} ${jost.variable}`} style={{ backgroundColor: "#0b0c0f" }}>
      <head>
        {/* Prevent white flash — dark html bg before CSS loads; body stays transparent for -z-10 Canvas */}
        <style dangerouslySetInnerHTML={{ __html: `html{background:#0b0c0f!important}body{background:transparent!important}` }} />
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%230b0c0f'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%232dd4bf' stroke-width='2'/%3E%3Ccircle cx='50' cy='38' r='6' fill='%232dd4bf'/%3E%3Cpath d='M44 48 Q50 65 56 48' fill='none' stroke='%232dd4bf' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E"
          type="image/svg+xml"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
      </head>
      <body className="text-white selection:bg-[#5eead4]/30 selection:text-white overflow-x-hidden antialiased">
        <Providers>
          <SmoothScroller />
          <CustomCursor />
          {children}
        </Providers>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
