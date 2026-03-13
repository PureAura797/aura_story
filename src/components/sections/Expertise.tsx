"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

const expertiseItems = [
  {
    title: "Скрытая угроза",
    description: "Видимая кровь — 10% проблемы. Биожидкости проникают в стяжку, под паркет, в микротрещины стен. Бытовая химия провоцирует размножение бактерий.",
  },
  {
    title: "Иллюзия чистоты",
    description: "«Сухой туман» маскирует запах ароматизатором. После выветривания — трупный яд возвращается. Мы разрушаем органику на молекулярном уровне.",
  },
  {
    title: "Вторичное заражение",
    description: "Неправильная сортировка распространяет трупных мух и кожеедов по вентиляции здания. Мы герметизируем зону до начала любых манипуляций.",
  },
  {
    title: "Закон и штрафы",
    description: "Выброс контаминированных предметов в ТБО — нарушение ст. 8.2 КоАП РФ. Утилизируем биоотходы класса «Б» и «В» с документальным оформлением.",
  },
];

export default function Expertise() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const items = gsap.utils.toArray(".expertise-item") as HTMLElement[];
    
    ScrollTrigger.batch(items, {
      start: "top 90%",
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.4,
          ease: "power2.out",
        }),
      once: true,
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full flex flex-col items-start z-10 relative">
      <div className="mb-4">
        <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--sand)" }}>Фатальная ошибка</p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Дилетанты = Угроза</h2>
      </div>
      <p className="text-sm text-neutral-500 font-light mb-12 max-w-md">
        Почему бытовая уборка после ЧП опасна для здоровья.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {expertiseItems.map((item, idx) => (
          <div 
            key={idx} 
            className="expertise-item opacity-0 translate-y-10 border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 group hover:border-[var(--sand)]/20 transition-all duration-500"
          >
            <h3 className="text-xl md:text-2xl font-bold tracking-tighter mb-4 transition-colors duration-500" style={{ color: "var(--sand-dim)" }}>
              {item.title}
            </h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Conclusion CTA — enhanced layout */}
      <div className="expertise-item opacity-0 translate-y-10 mt-8 border border-white/10 bg-white/[0.03] backdrop-blur-sm w-full max-w-3xl overflow-hidden">
        {/* Process chain — top bar */}
        <div className="flex flex-wrap gap-2 px-8 pt-8 pb-4">
          {["Герметизация", "Зачистка", "Дезинфекция", "АТФ-контроль", "Протокол"].map((step, i) => (
            <span key={i} className="flex items-center gap-2">
              <span
                className="px-3 py-1.5 text-[10px] tracking-[0.1em] font-medium border border-white/10 bg-white/[0.03]"
                style={{ color: i === 4 ? "var(--accent)" : "var(--sand-dim)" }}
              >
                {step}
              </span>
              {i < 4 && <span className="text-neutral-700 text-xs">→</span>}
            </span>
          ))}
        </div>
        
        {/* CTA area */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-8 pb-8 pt-4 border-t border-white/5">
          <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
            Каждый выезд — по единому протоколу. Никакой импровизации на объекте.
          </p>
          <a
            href="tel:+74951203456"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:brightness-110 hover:scale-[1.02] shrink-0"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg-deep)" }}
          >
            Бесплатная консультация
          </a>
        </div>
      </div>
    </section>
  );
}
