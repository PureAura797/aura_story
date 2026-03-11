"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";

const services = [
  {
    title: "После Смерти",
    description: "Полный демонтаж загрязнённых материалов, STP-обработка, озонация. Объект сдаётся с протоколом АТФ-тестирования.",
    meta: "от 60 мин · до 120 кв.м · от 15 000 ₽",
    href: "/uslugi/uborka-posle-smerti",
  },
  {
    title: "Устранение Запахов",
    description: "Диагностика источника, механическая зачистка, обработка активным гидроксилом. Гарантия: запах вернётся — повторная обработка бесплатно.",
    meta: "от 40 мин · до 200 кв.м · от 10 000 ₽",
    href: "/uslugi/ustranenie-zapahov",
  },
  {
    title: "Накопительство",
    description: "Сортировка, вывоз до 200 м³, дезинсекция, дезинфекция. Поиск ценных вещей и документов по согласованию.",
    meta: "от 4 ч · без ограничений · от 25 000 ₽",
    href: "/uslugi/nakopitelstvo",
  },
  {
    title: "Инфекционный Контроль",
    description: "Протокол после затопления, канализационного прорыва, пожара. Обработка по стандартам СанПиН 3.3686-21.",
    meta: "от 60 мин · до 300 кв.м · от 12 000 ₽",
    href: "/uslugi/infekcionnyj-kontrol",
  },
];

export default function Services() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray(".service-card") as HTMLElement[];
    
    ScrollTrigger.batch(cards, {
      start: "top 85%",
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
        }),
      once: true,
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full flex flex-col items-end z-10 relative">
      <div className="text-right mb-4">
        <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--accent)" }}>Направления</p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Экспертиза</h2>
      </div>
      <p className="text-sm text-neutral-500 font-light text-right mb-12 max-w-md">
        Четыре направления. Одна цель — биологически безопасный объект.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {services.map((s, idx) => (
          <Link
            key={idx}
            href={s.href}
            className="service-card opacity-0 translate-y-10 border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 group hover:border-[var(--accent)]/20 transition-all duration-500"
          >
            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-4 group-hover:text-white transition-colors">
              {s.title}
            </h3>
            <p className="text-neutral-500 text-sm leading-relaxed mb-4">
              {s.description}
            </p>
            <p className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: "var(--sand-dim)" }}>
              {s.meta}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
