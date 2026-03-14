"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import SectionCTA from "@/components/ui/SectionCTA";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Services() {
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  const services = [
    { num: "01", title: t("services.1.title"), description: t("services.1.desc"), meta: t("services.1.meta") },
    { num: "02", title: t("services.2.title"), description: t("services.2.desc"), meta: t("services.2.meta") },
    { num: "03", title: t("services.3.title"), description: t("services.3.desc"), meta: t("services.3.meta") },
    { num: "04", title: t("services.4.title"), description: t("services.4.desc"), meta: t("services.4.meta") },
  ];

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray(".service-card") as HTMLElement[];
    
    gsap.set(cards, { y: 30, opacity: 0 });
    
    ScrollTrigger.batch(cards, {
      start: "top 98%",
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.4,
          ease: "power3.out",
        }),
      once: true,
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full z-10 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase font-medium mb-3" style={{ color: "var(--accent)" }}>{t("services.label")}</p>
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">{t("services.heading")}</h2>
        </div>
        <p className="text-sm text-neutral-500 font-light max-w-xs md:text-right">
          {t("services.desc")}
        </p>
      </div>

      {/* Stacked cards — clean vertical layout */}
      <div className="flex flex-col gap-3">
        {services.map((s, idx) => (
          <div
            key={idx}
            className="service-card group border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 overflow-hidden"
          >
            {/* Desktop: horizontal row */}
            <div className="hidden md:flex items-start gap-8 p-7">
              <span className="text-[10px] tracking-[0.2em] text-neutral-700 font-mono pt-2 shrink-0">
                {s.num}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold tracking-tighter group-hover:text-white transition-colors mb-2">
                  {s.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-neutral-600 shrink-0 pt-2 whitespace-nowrap">
                {s.meta}
              </span>
            </div>

            {/* Mobile: stacked */}
            <div className="md:hidden p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] tracking-[0.2em] text-neutral-700 font-mono">
                  {s.num}
                </span>
                <h3 className="text-lg font-bold tracking-tighter group-hover:text-white transition-colors">
                  {s.title}
                </h3>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed mb-3">
                {s.description}
              </p>
              <p className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: "var(--sand-dim)" }}>
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
