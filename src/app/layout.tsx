import { Inter, Bebas_Neue, Unbounded, Jost } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroller from "@/components/effects/SmoothScroller";
import CustomCursor from "@/components/effects/CustomCursor";
import Providers from "@/components/Providers";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import ServerAnalytics from "@/components/ServerAnalytics";
import VerificationMeta from "@/components/VerificationMeta";
import { getSeo } from "@/lib/data";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-body" });
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });
const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], variable: "--font-unbounded", weight: ["200","300","400","500","600","700"] });
const jost = Jost({ subsets: ["latin", "cyrillic"], variable: "--font-jost" });

// Site URL from env — change in Vercel dashboard when domain changes
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://аурачистоты.рф";

export const viewport: Viewport = {
  themeColor: "#0b0c0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Уборка после смерти, пожара, канализации Москва — 24/7 круглосуточно",
  description: "Профессиональная уборка после смерти, пожара, прорыва канализации и накопительства в Москве и МО. Устранение запаха, копоти, сажи. Дезинфекция по СанПиН. Выезд 60 минут, лицензия СЭС. Фиксированная цена, NDA, гарантия 30 дней.",

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "АураЧистоты",
    title: "Уборка после смерти, пожара, канализации Москва — 24/7",
    description: "Профессиональная биологическая очистка и дезинфекция помещений. Уборка после смерти, пожара, канализации, устранение запахов, расхламление. Выезд за 60 минут, протокол чистоты.",
    url: `${SITE_URL}/`,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "АураЧистоты — Профессиональная дезинфекция и биологическая очистка помещений в Москве",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Уборка после смерти, пожара, канализации Москва 24/7",
    description: "Профессиональная биологическая очистка: уборка после смерти, пожара, канализации, накопительства. Выезд за 60 минут.",
    images: [`${SITE_URL}/og-image.png`],
  },
  verification: {},
  // icons removed — managed dynamically via <link> in <head> from SEO settings
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
  "@id": `${SITE_URL}/#organization`,
  "name": "АураЧистоты",
  "alternateName": "Аура Чистоты",
  "description": "Профессиональная биологическая очистка и дезинфекция помещений в Москве и Московской области. Уборка после смерти, пожара, прорыва канализации, накопительства. Устранение запахов, инфекционный контроль.",
  "url": SITE_URL,
  "telephone": "+7-499-964-00-42",
  "email": "help@auraremediation.com",
  "image": `${SITE_URL}/og-image.png`,
  "logo": `${SITE_URL}/logo.svg`,
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
          "description": "Полный демонтаж загрязнённых материалов, STP-обработка, озонация. Протокол чистоты. Площадь до 120 кв.м.",
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
        "text": "Да. После завершения протокола помещение проходит контрольную проверку чистоты. Объект не сдаётся до достижения безопасных показателей. Протокол предоставляется в письменном виде.",
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
  "name": "АураЧистоты",
  "url": SITE_URL,
  "description": "Профессиональная уборка после смерти, дезинфекция и биологическая очистка помещений в Москве 24/7",
  "publisher": { "@id": `${SITE_URL}/#organization` },
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
      "item": SITE_URL,
    },
  ],
};

// ─── JSON-LD: Reviews (for rich snippets stars) ─────────────────
const jsonLdReviews = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#organization`,
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Анна М." },
      "datePublished": "2026-02-15",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "reviewBody": "Приехали через 40 минут после звонка. Работали аккуратно, тихо, без лишних вопросов. После обработки запах полностью исчез. Спасибо за деликатность.",
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Дмитрий К." },
      "datePublished": "2026-01-28",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "reviewBody": "Управляющая компания обратилась после прорыва канализации на первом этаже. АураЧистоты откачали, продезинфицировали и просушили за один день. Рекомендуем.",
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Елена С." },
      "datePublished": "2026-03-02",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "reviewBody": "Уборка после пожара в квартире. Полностью удалили копоть и запах гари. Предоставили протокол чистоты. Очень профессионально.",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seo = await getSeo();
  return (
    <html lang="ru" className={`${inter.variable} ${bebasNeue.variable} ${unbounded.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        <ServerAnalytics />
        {/* Prevent white flash — dark html bg before CSS loads; body stays transparent for -z-10 Canvas */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var isAdmin=location.pathname.indexOf('/admin')===0;if(isAdmin){document.documentElement.setAttribute('data-admin','true');document.documentElement.setAttribute('data-theme','dark');document.documentElement.style.background='#0b0c0f';return}var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');document.documentElement.style.background='#0b0c0f'}else{document.documentElement.setAttribute('data-theme','light');document.documentElement.style.background='#f7f7f8'}}catch(e){document.documentElement.setAttribute('data-theme','light');document.documentElement.style.background='#f7f7f8'}})()` }} />
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{console.log('%c ⚡ Crafted by @asphxdel ','background:#0d0e12;color:#5eead4;font-size:14px;font-weight:bold;padding:12px 20px;border:1px solid rgba(94,234,212,0.2);border-radius:0;font-family:system-ui,-apple-system,sans-serif;');console.log('%c Telegram → https://t.me/asphxdel','color:#666;font-size:11px;padding:4px 0;font-family:system-ui;');console.log('%c Built with Next.js · Three.js · GSAP · Supabase','color:#444;font-size:10px;padding:2px 0;font-family:system-ui;')}catch(e){}})()` }} />
        <style dangerouslySetInnerHTML={{ __html: `body{background:transparent!important}` }} />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href={seo.favicon || "/favicon.ico"} sizes="32x32" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdReviews) }}
        />
      </head>
      <body className="text-[var(--text-primary)] selection:bg-[var(--accent)]/30 selection:text-[var(--text-primary)] overflow-x-hidden antialiased">
        {/* P0: Skip to content for keyboard/screen-reader users (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:text-black focus:px-6 focus:py-3 focus:text-sm focus:font-bold focus:uppercase focus:tracking-wider"
        >
          Перейти к содержимому
        </a>
        <Providers>
          <SmoothScroller />
          <CustomCursor />
          {children}
        </Providers>
        <AnalyticsScripts />
        <VerificationMeta />
      </body>
    </html>
  );
}
