"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

const equipment = [
  {
    name: "Генератор озона Dragon 20g",
    purpose: "Уничтожение органики и патогенов в воздухе. Мощность 20 г/ч.",
  },
  {
    name: "Генератор гидроксила Biozone",
    purpose: "Расщепление сложных запахов на молекулярном уровне без химических остатков.",
  },
  {
    name: "STP-аппарат системы распыления",
    purpose: "Нанесение биоцидных составов на все поверхности включая труднодоступные зоны.",
  },
  {
    name: "АТФ-люминометр 3M Clean-Trace",
    purpose: "Объективный контроль чистоты поверхностей до и после обработки. Результат за 15 секунд.",
  },
  {
    name: "Промышленные осушители Trotec",
    purpose: "Принудительная сушка помещений после мокрой обработки. Производительность до 70 л/сутки.",
  },
  {
    name: "СИЗ и герметизация 3М",
    purpose: "Полная защита персонала и изоляция зоны заражения от остальных помещений.",
  },
];

export default function Equipment() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const items = gsap.utils.toArray(".equipment-item") as HTMLElement[];

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
        <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--accent)" }}>Арсенал</p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Оборудование</h2>
      </div>
      <p className="text-sm text-neutral-500 font-light mb-16 max-w-lg">
        Промышленное оборудование, а не бытовая химия.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {equipment.map((item, idx) => (
          <div
            key={idx}
            className="equipment-item opacity-0 translate-y-10 border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 group hover:border-[rgba(94,234,212,0.2)] transition-all duration-500"
          >
            <div className="flex items-start gap-4">
              <span className="text-xs text-neutral-700 font-medium mt-1 shrink-0">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-tight mb-2 group-hover:text-[var(--accent)] transition-colors duration-500">
                  {item.name}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {item.purpose}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
