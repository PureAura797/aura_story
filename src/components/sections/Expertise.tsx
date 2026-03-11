"use client";

import { useRef } from "react";
import { PhoneCall } from "lucide-react";
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
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tighter mb-4 transition-colors duration-500" style={{ color: "var(--sand-dim)" }}>
              {item.title}
            </h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Conclusion CTA */}
      <div className="expertise-item opacity-0 translate-y-10 mt-8 border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 w-full max-w-3xl">
        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
          Каждый выезд: герметизация → зачистка → дезинфекция → АТФ-контроль → протокол чистоты.
        </p>
        <a
          href="tel:+74951203456"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition-colors"
        >
          <PhoneCall className="w-4 h-4" strokeWidth={1.5} />
          Бесплатная консультация
        </a>
      </div>
    </section>
  );
}
