"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

const pricingPlans = [
  {
    name: "Уборка после смерти",
    price: "15 000 ₽",
    area: "до 120 кв.м",
    description: "Полный демонтаж загрязнённых материалов, STP-обработка, озонация. Протокол АТФ-тестирования.",
    features: "Выезд 60 мин · Хим. дезинфекция · Озонация · Протокол",
  },
  {
    name: "Устранение запахов",
    price: "10 000 ₽",
    area: "до 200 кв.м",
    description: "Диагностика источника, механическая зачистка, обработка активным гидроксилом. Гарантия 30 дней.",
    features: "Поиск источника · Зачистка · Активный гидроксил",
  },
  {
    name: "Расхламление",
    price: "25 000 ₽",
    area: "без ограничений",
    description: "Сортировка, вывоз до 200 м³, дезинсекция, дезинфекция. Поиск ценных вещей и документов.",
    features: "Сортировка · Вывоз · Дезинсекция · Документы",
  },
  {
    name: "Инфекционный контроль",
    price: "12 000 ₽",
    area: "до 300 кв.м",
    description: "Протокол после затопления, канализационного прорыва, пожара. Стандарты СанПиН 3.3686-21.",
    features: "Герметизация · Обработка · АТФ-контроль · Акты",
  },
  {
    name: "Дезинсекция",
    price: "5 000 ₽",
    area: "до 100 кв.м",
    description: "Уничтожение тараканов, клопов, блох, кожеедов. Барьерная обработка с гарантией результата.",
    features: "Диагностика · Обработка · Барьер · Гарантия",
  },
  {
    name: "Озонация воздуха",
    price: "3 000 ₽",
    area: "до 150 кв.м",
    description: "Глубокое обеззараживание воздуха и поверхностей промышленным озонатором.",
    features: "Промышленный озонатор · Проветривание · Замер",
  },
  {
    name: "Уборка после пожара",
    price: "20 000 ₽",
    area: "до 200 кв.м",
    description: "Удаление копоти, сажи, запаха гари. Демонтаж повреждённых покрытий, химическая нейтрализация.",
    features: "Демонтаж · Хим. нейтрализация · Озонация",
  },
  {
    name: "Вывоз мусора",
    price: "8 000 ₽",
    area: "до 50 м³",
    description: "Крупногабаритный мусор, строительные отходы, старая мебель. Погрузка и утилизация.",
    features: "Погрузка · Транспортировка · Утилизация",
  },
];

export default function Pricing() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const items = gsap.utils.toArray(".pricing-card") as HTMLElement[];
    
    ScrollTrigger.batch(items, {
      start: "top 90%",
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          stagger: 0.04,
          duration: 0.4,
          ease: "power2.out",
        }),
      once: true,
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full flex flex-col items-end z-10 relative">
      <div className="text-right mb-4">
        <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--sand)" }}>Детализация цен</p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Сметы</h2>
      </div>
      <p className="text-sm text-neutral-500 font-light text-right mb-12 max-w-md">
        Фиксированная цена до начала работ. Без скрытых доплат.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
        {pricingPlans.map((plan, idx) => (
          <div
            key={idx}
            className="pricing-card opacity-0 translate-y-10 border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 group hover:border-[rgba(94,234,212,0.2)] transition-all duration-500 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-sm font-bold tracking-tight group-hover:text-[var(--accent)] transition-colors duration-500">
                {plan.name}
              </h3>
            </div>
            <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-600 border border-white/10 px-3 py-1 w-fit mb-3">
              {plan.area}
            </span>
            <p className="text-neutral-500 text-xs leading-relaxed mb-4 flex-1">
              {plan.description}
            </p>
            <p className="text-[9px] uppercase tracking-[0.15em] font-medium mb-4" style={{ color: "var(--sand-dim)" }}>
              {plan.features}
            </p>
            <div className="mt-auto pt-3 border-t border-white/5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-1">От</span>
              <div className="text-2xl md:text-3xl font-bold tracking-tighter text-white">
                {plan.price}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guarantee bar */}
      <div className="pricing-card opacity-0 translate-y-10 mt-4 border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 w-full max-w-5xl">
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-medium justify-center">
          <span>✓ Бесплатный выезд оценщика</span>
          <span>✓ Фиксированная цена</span>
          <span>✓ Гарантия 30 дней</span>
          <span>✓ Без скрытых доплат</span>
        </div>
      </div>
    </section>
  );
}
