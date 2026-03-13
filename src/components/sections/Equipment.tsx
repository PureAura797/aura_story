"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const equipment = [
  {
    name: "Генератор озона Dragon 20g",
    purpose: "Уничтожение органики и патогенов в воздухе. Мощность 20 г/ч.",
    image: "/equipment/ozone.png",
    specs: "20 г/ч",
    tag: "озонирование",
    color: "#5eead4",
    details:
      "Промышленный озонатор для обеззараживания воздуха и поверхностей. Генерирует 20 граммов озона в час — достаточно для обработки помещений до 100 м². Озон окисляет органические соединения, уничтожает бактерии, вирусы и споры плесени. Полный цикл обработки — 2 часа.",
  },
  {
    name: "Генератор гидроксила Biozone",
    purpose: "Расщепление сложных запахов на молекулярном уровне без химических остатков.",
    image: "/equipment/hydroxyl.png",
    specs: "PCO + UV-C",
    tag: "очистка воздуха",
    color: "#38bdf8",
    details:
      "Фотокаталитический очиститель воздуха на основе UV-C ламп и TiO₂ катализатора. Генерирует гидроксильные радикалы, которые разрушают молекулы запахов, летучие органические соединения и патогены. Безопасен для людей — можно работать в присутствии заказчика.",
  },
  {
    name: "STP-аппарат ULV Cold Fogger",
    purpose: "Нанесение биоцидных составов на все поверхности, включая труднодоступные зоны.",
    image: "/equipment/fogger.png",
    specs: "5L / 800W",
    tag: "распыление",
    color: "#d4a574",
    details:
      "Ультранизкообъёмный распылитель холодного тумана. Размер капель 5–50 мкм — проникает в щели, вентиляцию, за мебель. Бак 5 литров, мощность 800 Вт. Обрабатывает до 200 м² за один заход. Совместим со всеми биоцидными и дезинфицирующими растворами.",
  },
  {
    name: "АТФ-люминометр 3M Clean-Trace",
    purpose: "Объективный контроль чистоты поверхностей до и после обработки. Результат за 15 секунд.",
    image: "/equipment/atp.png",
    specs: "15 сек",
    tag: "диагностика",
    color: "#a78bfa",
    details:
      "Портативный прибор для экспресс-анализа чистоты поверхностей. Измеряет уровень АТФ (аденозинтрифосфата) — маркера биологического загрязнения. Результат в RLU за 15 секунд. Протокол до/после обработки — объективное доказательство качества для заказчика.",
  },
  {
    name: "Осушитель Trotec TTK",
    purpose: "Принудительная сушка помещений после мокрой обработки. Производительность до 70 л/сутки.",
    image: "/equipment/dehumidifier.png",
    specs: "70 л/сут",
    tag: "сушка",
    color: "#fb7185",
    details:
      "Промышленный конденсационный осушитель немецкого производства. Удаляет до 70 литров влаги в сутки. Применяется после мокрой дезинфекции, устранения последствий затоплений. Встроенный гигростат, автоматическое отключение, транспортировочные колёса.",
  },
  {
    name: "СИЗ и герметизация 3М",
    purpose: "Полная защита персонала и изоляция зоны заражения от остальных помещений.",
    image: "/equipment/ppe.png",
    specs: "класс 3",
    tag: "защита",
    color: "#14b8a6",
    details:
      "Полнолицевой респиратор 3М серии 6000 с комбинированными фильтрами ABEK2P3. Защитный комбинезон Tyvek категории III. Герметизация зон заражения полиэтиленом с проклейкой швов. Полная изоляция рабочей зоны от остального помещения.",
  },
];

export default function Equipment() {
  const containerRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpanded((prev) => (prev === idx ? null : idx));
  };

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray(".equip-card") as HTMLElement[];
    gsap.set(cards, { y: 40, opacity: 0, scale: 0.95 });

    ScrollTrigger.batch(cards, {
      start: "top 92%",
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
        }),
      once: true,
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full flex flex-col items-start z-10 relative">
      {/* Header */}
      <div className="mb-4">
        <p
          className="text-[10px] tracking-[0.2em] uppercase font-medium mb-4"
          style={{ color: "var(--accent)" }}
        >
          Арсенал
        </p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">
          Оборудование
        </h2>
      </div>
      <p className="text-sm text-neutral-500 font-light mb-12 max-w-lg">
        Промышленное оборудование, а не бытовая химия. Каждый прибор — профессиональный инструмент с сертификацией.
      </p>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 w-full items-start">
        {equipment.map((item, idx) => (
          <div
            key={idx}
            className="equip-card group flex flex-col border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden hover:border-white/10 transition-all duration-500"
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-3 py-2.5 md:px-4 md:py-3">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${item.color}20`, border: `1px solid ${item.color}30` }}
                >
                  <span
                    className="text-[8px] md:text-[9px] font-bold"
                    style={{ color: item.color }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[9px] md:text-[10px] text-neutral-500 uppercase tracking-wider truncate">
                  {item.tag}
                </span>
              </div>
              <MoreHorizontal
                className="w-4 h-4 text-neutral-700 group-hover:text-neutral-500 transition-colors shrink-0"
                strokeWidth={1.5}
              />
            </div>

            {/* Image area */}
            <div className="relative aspect-square bg-black/40 overflow-hidden">
              <Image
                src={item.image}
                alt={`${item.name} — ${item.purpose}`}
                fill
                className="object-contain p-4 md:p-6 transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Subtle radial glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${item.color}08 0%, transparent 70%)`,
                }}
              />
              {/* Spec badge */}
              <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3">
                <span
                  className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm backdrop-blur-md"
                  style={{
                    color: item.color,
                    backgroundColor: `${item.color}12`,
                    border: `1px solid ${item.color}20`,
                  }}
                >
                  {item.specs}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="px-3 pt-3 md:px-4 md:pt-3">
              <h3 className="text-xs md:text-sm font-bold text-white tracking-tight mb-1 group-hover:text-[var(--accent)] transition-colors duration-300">
                {item.name}
              </h3>
              <p className="text-[10px] md:text-[11px] text-neutral-500 leading-relaxed line-clamp-2">
                {item.purpose}
              </p>
            </div>

            {/* Expand/collapse details */}
            <div className="px-3 pb-3 md:px-4 md:pb-4 pt-2">
              <button
                onClick={() => toggleExpand(idx)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-sm border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 cursor-pointer group/btn"
              >
                <span className="text-[9px] md:text-[10px] text-neutral-500 uppercase tracking-wider group-hover/btn:text-neutral-300 transition-colors">
                  {expanded === idx ? "Свернуть" : "Подробнее"}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-neutral-600 group-hover/btn:text-neutral-400 transition-all duration-300 ${
                    expanded === idx ? "rotate-180" : ""
                  }`}
                  strokeWidth={1.5}
                />
              </button>

              <AnimatePresence>
                {expanded === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 border-t border-white/5 mt-3">
                      <p className="text-[10px] md:text-[11px] text-neutral-400 leading-relaxed">
                        {item.details}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
