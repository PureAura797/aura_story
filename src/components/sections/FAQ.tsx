"use client";

import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

const faqItems = [
  {
    question: "Сколько длится обработка?",
    answer: "Зависит от площади и типа загрязнения. Очаговая обработка (до 5 кв.м) — 2–4 часа. Полный протокол (квартира) — 6–12 часов. Сложные случаи (накопительство, длительное разложение) — до 2 дней.",
  },
  {
    question: "Безопасно ли находиться в квартире после обработки?",
    answer: "Да. После завершения протокола помещение проходит АТФ-тестирование. Объект не сдаётся до достижения безопасных показателей. Протокол чистоты предоставляется в письменном виде.",
  },
  {
    question: "Работаете ли вы с юридическими лицами?",
    answer: "Да. Управляющие компании, страховые компании, риелторские агентства — работаем по договору с полным комплектом актов и протоколов.",
  },
  {
    question: "Что делать с вещами умершего?",
    answer: "Сортируем вещи на безопасные и контаминированные. Безопасные передаём вам или по доверенности. Контаминированные утилизируем по классу «Б» с документальным оформлением.",
  },
  {
    question: "Выезжаете за МКАД?",
    answer: "Да. Москва и Московская область. Выезд за МКАД — +500 ₽/км от МКАД.",
  },
  {
    question: "Нужно ли мне присутствовать?",
    answer: "Нет. Работаем по доверенности или с представителем (управляющая компания, риелтор, сосед). Фотоотчёт и протокол отправляем дистанционно.",
  },
];

export default function FAQ() {
  const containerRef = useRef<HTMLElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const items = gsap.utils.toArray(".faq-card") as HTMLElement[];

    ScrollTrigger.batch(items, {
      start: "top 85%",
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 1.2,
          ease: "power3.out",
        }),
      once: true,
    });
  }, { scope: containerRef });

  const toggleItem = (idx: number) => {
    const answerId = `faq-answer-${idx}`;
    const el = document.getElementById(answerId);
    if (!el) return;

    if (openIdx === idx) {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power3.inOut",
        onComplete: () => setOpenIdx(null),
      });
    } else {
      if (openIdx !== null) {
        const prevEl = document.getElementById(`faq-answer-${openIdx}`);
        if (prevEl) {
          gsap.to(prevEl, { height: 0, opacity: 0, duration: 0.3, ease: "power3.inOut" });
        }
      }
      setOpenIdx(idx);
      gsap.set(el, { height: "auto", opacity: 1 });
      gsap.from(el, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    }
  };

  return (
    <section ref={containerRef} className="w-full flex flex-col items-end z-10 relative">
      <div className="text-right mb-4">
        <p className="text-xs tracking-[0.2em] text-neutral-500 uppercase font-medium mb-4">Информация</p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Вопросы</h2>
      </div>
      <p className="text-sm text-neutral-500 font-light text-right mb-16 max-w-md">
        Ответы на вопросы, которые задают чаще всего.
      </p>

      <div className="flex flex-col w-full max-w-3xl gap-3">
        {faqItems.map((item, idx) => (
          <div
            key={idx}
            className={`faq-card opacity-0 translate-y-10 border bg-white/[0.03] backdrop-blur-sm transition-all duration-500 ${
              openIdx === idx ? "border-[rgba(94,234,212,0.2)]" : "border-white/10 hover:border-white/20"
            }`}
          >
            <button
              onClick={() => toggleItem(idx)}
              className="w-full px-8 py-6 flex items-center justify-between text-left cursor-pointer group"
              aria-expanded={openIdx === idx}
              aria-controls={`faq-answer-${idx}`}
            >
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight pr-8 transition-colors duration-300" style={openIdx === idx ? { color: "var(--accent)" } : {}}>
                {item.question}
              </h3>
              {openIdx === idx ? (
                <Minus className="w-5 h-5 shrink-0" strokeWidth={1.5} style={{ color: "var(--accent)" }} aria-hidden="true" />
              ) : (
                <Plus className="w-5 h-5 text-neutral-500 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>
            <div
              id={`faq-answer-${idx}`}
              className="overflow-hidden"
              style={{ height: 0, opacity: 0 }}
            >
              <p className="text-neutral-400 text-sm leading-relaxed px-8 pb-6 pr-16">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
