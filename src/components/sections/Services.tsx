"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import SectionCTA from "@/components/ui/SectionCTA";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  meta: string;
  published: boolean;
  sort_order: number;
}

export default function Services() {
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(() => {
        // Fallback
        setServices([
          { id: "1", title: "После Смерти", description: "Полный демонтаж загрязнённых материалов, STP-обработка, озонация.", meta: "от 60 мин · до 120 кв.м · от 15 000 ₽", published: true, sort_order: 0 },
          { id: "2", title: "После Пожара", description: "Удаление копоти, сажи, запаха гари. Демонтаж и химическая нейтрализация.", meta: "от 60 мин · до 200 кв.м · от 20 000 ₽", published: true, sort_order: 1 },
          { id: "3", title: "После Канализации", description: "Откачка, дезинфекция, обработка антисептиком по СанПиН.", meta: "от 60 мин · до 300 кв.м · от 15 000 ₽", published: true, sort_order: 2 },
          { id: "4", title: "Накопительство", description: "Сортировка, вывоз до 200 м³, дезинсекция, дезинфекция.", meta: "от 4 ч · без ограничений · от 25 000 ₽", published: true, sort_order: 3 },
        ]);
      });
  }, []);

  useGSAP(() => {
    if (services.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray(".service-card") as HTMLElement[];
    
    gsap.set(cards, { x: -30, opacity: 0 });
    
    ScrollTrigger.batch(cards, {
      start: "top 98%",
      onEnter: (batch) =>
        gsap.to(batch, {
          x: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: "power3.out",
        }),
      once: true,
    });
  }, { scope: containerRef, dependencies: [services] });

  return (
    <section ref={containerRef} className="w-full z-10 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase font-medium mb-3" style={{ color: "var(--accent)" }}>{t("services.label")}</p>
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">{t("services.heading")}</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] font-light max-w-xs md:text-right">
          {t("services.desc")}
        </p>
      </div>

      {/* Stacked cards — dynamic */}
      <div className="flex flex-col gap-3">
        {services.map((s, idx) => (
          <div
            key={s.id}
            className="service-card card-lift accent-glow-hover group border border-[var(--border)] bg-[var(--glass-card)] backdrop-blur-sm hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-strong)] transition-all duration-500 overflow-hidden"
          >
            {/* Desktop: horizontal row */}
            <div className="hidden md:flex items-start gap-8 p-7">
              <span className="text-[11px] tracking-[0.2em] text-[var(--text-secondary)] font-mono pt-2 shrink-0">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold tracking-tighter group-hover:text-[var(--text-primary)] transition-colors mb-2">
                  {s.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
              <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-[var(--text-muted)] shrink-0 pt-2 whitespace-nowrap">
                {s.meta}
              </span>
            </div>

            {/* Mobile: stacked */}
            <div className="md:hidden p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] tracking-[0.2em] text-[var(--text-secondary)] font-mono">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-bold tracking-tighter group-hover:text-[var(--text-primary)] transition-colors">
                  {s.title}
                </h3>
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-3">
                {s.description}
              </p>
              <p className="text-[11px] uppercase tracking-[0.15em] font-medium" style={{ color: "var(--sand-dim)" }}>
                {s.meta}
              </p>
            </div>
          </div>
        ))}
      </div>

      <SectionCTA variant="form" label={t("services.cta")} />
    </section>
  );
}
