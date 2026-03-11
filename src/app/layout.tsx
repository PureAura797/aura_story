import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroller from "@/components/effects/SmoothScroller";
import CustomCursor from "@/components/effects/CustomCursor";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#0b0c0f",
};

export const metadata: Metadata = {
  title: "PureAura | Профессиональная Дезинфекция и Биологическая Очистка в Москве 24/7",
  description: "PureAura — профессиональная биологическая очистка и дезинфекция помещений в Москве и МО. Уборка после смерти, устранение запахов, инфекционный контроль. Конфиденциально, 24/7, выезд за 60 минут.",
  keywords: "уборка после смерти москва, дезинфекция помещений, биологическая очистка, устранение запахов, уборка накопительства, экстренная уборка 24/7, дезинфекция после смерти",
  robots: "index, follow",
  alternates: {
    canonical: "https://pureaura.ru/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "PureAura",
    title: "PureAura — Профессиональная Биологическая Очистка 24/7",
    description: "Конфиденциальная дезинфекция и биологическая очистка помещений в Москве. Выезд за 60 минут, сертифицированные препараты, NDA.",
    url: "https://pureaura.ru/",
    images: [
      {
        url: "https://pureaura.ru/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PureAura",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PureAura — Профессиональная Биологическая Очистка 24/7",
    description: "Конфиденциальная дезинфекция и биологическая очистка помещений в Москве. Выезд за 60 минут.",
    images: ["https://pureaura.ru/og-image.jpg"],
  },
};

const jsonLdLocalBusiness = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://pureaura.ru/#organization",
      "name": "PureAura",
      "description": "Профессиональная биологическая очистка и дезинфекция помещений в Москве и Московской области",
      "url": "https://pureaura.ru",
      "telephone": "+7-495-120-34-56",
      "email": "help@auraremediation.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Москва",
        "addressCountry": "RU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 55.7558,
        "longitude": 37.6173
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    },
    {
      "@type": "Service",
      "serviceType": "Биологическая очистка / Дезинфекция",
      "provider": { "@id": "https://pureaura.ru/#organization" },
      "areaServed": {
        "@type": "State",
        "name": "Москва и Московская область"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Наши услуги",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Уборка после смерти",
              "description": "Специализированная уборка и дезинфекция помещений после смерти человека."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Устранение запахов",
              "description": "Удаление стойких биологических и химических запахов методом озонирования и сухим туманом."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Уборка при накопительстве",
              "description": "Помощь при синдроме Плюшкина: расчистка, сортировка и дезинфекция помещений."
            }
          }
        ]
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`dark ${inter.variable}`}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%230b0c0f'/><circle cx='50' cy='50' r='30' fill='none' stroke='%232dd4bf' stroke-width='2'/><circle cx='50' cy='38' r='6' fill='%232dd4bf'/><path d='M44 48 Q50 65 56 48' fill='none' stroke='%232dd4bf' stroke-width='2' stroke-linecap='round'/></svg>"
          type="image/svg+xml"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }}
        />
      </head>
      <body className="bg-[#0b0c0f] text-white selection:bg-[#5eead4]/30 selection:text-white overflow-x-hidden antialiased">
        <SmoothScroller />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
