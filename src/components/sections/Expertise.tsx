"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { PhoneCall } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Expertise() {
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  const items = [
    { title: t("expertise.1.title"), description: t("expertise.1.desc") },
    { title: t("expertise.2.title"), description: t("expertise.2.desc") },
    { title: t("expertise.3.title"), description: t("expertise.3.desc") },
    { title: t("expertise.4.title"), description: t("expertise.4.desc") },
  ];

  const steps = t("expertise.steps").split(",");

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const els = gsap.utils.toArray(".expertise-item") as HTMLElement[];
    
    ScrollTrigger.batch(els, {
      start: "top 98%",
      onEnter: (batch) =>
        gsap.to(batch, { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power2.out" }),
      once: true,
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full flex flex-col items-start z-10 relative">
      <div className="mb-4">
        <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--sand)" }}>{t("expertise.label")}</p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">{t("expertise.heading")}</h2>
      </div>
      <p className="text-sm text-neutral-500 font-light mb-12 max-w-md">
        {t("expertise.desc")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {items.map((item, idx) => (
          <div key={idx} className="expertise-item opacity-0 translate-y-10 border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 group hover:border-[var(--sand)]/20 transition-all duration-500">
            <h3 className="text-xl md:text-2xl font-bold tracking-tighter mb-4 transition-colors duration-500" style={{ color: "var(--sand-dim)" }}>
              {item.title}
            </h3>
            <p className="text-neutral-500 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="expertise-item opacity-0 translate-y-10 mt-8 border border-white/10 bg-white/[0.03] backdrop-blur-sm w-full max-w-3xl overflow-hidden">
        <div className="flex flex-wrap gap-2 px-8 pt-8 pb-4">
          {steps.map((step, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="px-3 py-1.5 text-[10px] tracking-[0.1em] font-medium border border-white/10 bg-white/[0.03]"
                style={{ color: i === steps.length - 1 ? "var(--accent)" : "var(--sand-dim)" }}>
                {step}
              </span>
              {i < steps.length - 1 && <span className="text-neutral-700 text-xs">→</span>}
            </span>
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-8 pb-8 pt-4 border-t border-white/5">
          <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">{t("expertise.cta_text")}</p>
          <a href="tel:+74951203456" className="btn-primary shrink-0">
            <PhoneCall className="w-3.5 h-3.5" strokeWidth={1.5} />
            {t("expertise.cta_btn")}
          </a>
        </div>
      </div>
    </section>
  );
}
