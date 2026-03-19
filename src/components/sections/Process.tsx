"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Process() {
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  const steps = [
    { num: "01", title: t("process.1.title"), description: t("process.1.desc") },
    { num: "02", title: t("process.2.title"), description: t("process.2.desc") },
    { num: "03", title: t("process.3.title"), description: t("process.3.desc") },
    { num: "04", title: t("process.4.title"), description: t("process.4.desc") },
  ];

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const items = gsap.utils.toArray(".process-step") as HTMLElement[];

    ScrollTrigger.batch(items, {
      start: "top 98%",
      onEnter: (batch) =>
        gsap.to(batch, { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power2.out" }),
      once: true,
    });
  }, { scope: containerRef });

  return (
    <section id="process" ref={containerRef} className="w-full flex flex-col items-start z-10 relative">
      <div className="mb-4">
        <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--accent)" }}>{t("process.label")}</p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">{t("process.heading")}</h2>
      </div>
      <p className="text-sm text-neutral-500 font-light mb-16 max-w-lg">
        {t("process.desc")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {steps.map((step, idx) => (
          <div key={idx} className="process-step card-lift accent-glow-hover opacity-0 translate-y-10 border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 group hover:border-[rgba(94,234,212,0.2)] transition-all duration-500">
            <span className="text-5xl md:text-6xl font-bold text-white/[0.06] tracking-tighter block mb-6">{step.num}</span>
            <h3 className="text-xl md:text-2xl font-bold tracking-tighter mb-4 group-hover:text-[var(--accent)] transition-colors duration-500">{step.title}</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
