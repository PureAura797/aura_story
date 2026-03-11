"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

const steps = [
  {
    num: "01",
    title: "Вызов",
    description: "Диспетчер уточняет адрес, тип ЧП, площадь. Бригада выезжает в течение 60 минут.",
  },
  {
    num: "02",
    title: "Диагностика",
    description: "Осмотр объекта, оценка степени загрязнения, составление сметы. Фиксированная цена до начала работ.",
  },
  {
    num: "03",
    title: "Обработка",
    description: "Герметизация зоны, демонтаж загрязнённых поверхностей, STP-дезинфекция, озонация, обработка гидроксилом.",
  },
  {
    num: "04",
    title: "Сдача",
    description: "АТФ-тестирование всех поверхностей. Протокол чистоты. Гарантия 30 дней.",
  },
];

export default function Process() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const items = gsap.utils.toArray(".process-step") as HTMLElement[];

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
    <section id="process" ref={containerRef} className="w-full flex flex-col items-start z-10 relative">
      <div className="mb-4">
        <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--accent)" }}>Протокол</p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Порядок Работы</h2>
      </div>
      <p className="text-sm text-neutral-500 font-light mb-16 max-w-lg">
        От звонка до сдачи объекта — прозрачный протокол на каждом этапе.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="process-step opacity-0 translate-y-10 border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 group hover:border-[rgba(94,234,212,0.2)] transition-all duration-500"
          >
            <span className="text-5xl md:text-6xl font-bold text-white/[0.06] tracking-tighter block mb-6">
              {step.num}
            </span>
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tighter mb-4 group-hover:text-[var(--accent)] transition-colors duration-500">
              {step.title}
            </h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
