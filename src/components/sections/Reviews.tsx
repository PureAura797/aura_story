"use client";

import { useRef } from "react";
import { Star } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import SectionCTA from "@/components/ui/SectionCTA";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Reviews() {
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  const reviews = [
    { nameKey: "reviews.1.name", dateKey: "reviews.1.date", serviceKey: "pricing.1.name", textKey: "reviews.1.text" },
    { nameKey: "reviews.2.name", dateKey: "reviews.2.date", serviceKey: "pricing.2.name", textKey: "reviews.2.text" },
    { nameKey: "reviews.3.name", dateKey: "reviews.3.date", serviceKey: "pricing.4.name", textKey: "reviews.3.text" },
    { nameKey: "reviews.4.name", dateKey: "reviews.4.date", serviceKey: "pricing.3.name", textKey: "reviews.4.text" },
    { nameKey: "reviews.5.name", dateKey: "reviews.5.date", serviceKey: "pricing.7.name", textKey: "reviews.5.text" },
    { nameKey: "reviews.6.name", dateKey: "reviews.6.date", serviceKey: "pricing.5.name", textKey: "reviews.6.text" },
    { nameKey: "reviews.7.name", dateKey: "reviews.7.date", serviceKey: "pricing.5.name", textKey: "reviews.7.text" },
  ];

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const items = gsap.utils.toArray(".review-card") as HTMLElement[];
    ScrollTrigger.batch(items, {
      start: "top 98%",
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power2.out" }),
      once: true,
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full flex flex-col items-start z-10 relative">
      <div className="mb-4">
        <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--accent)" }}>{t("reviews.label")}</p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">{t("reviews.heading")}</h2>
      </div>
      <p className="text-sm text-neutral-500 font-light mb-12 max-w-lg">{t("reviews.desc")}</p>

      <div className="review-card opacity-0 translate-y-10 flex flex-wrap gap-6 mb-8 w-full max-w-3xl">
        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 flex items-center gap-4">
          <span className="text-4xl md:text-5xl font-bold tracking-tighter">4.9</span>
          <div className="flex flex-col">
            <Star className="w-4 h-4 fill-current" strokeWidth={1.5} style={{ color: "var(--sand)" }} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mt-1">{t("reviews.platform_yandex")}</span>
          </div>
        </div>
        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 flex items-center gap-4">
          <span className="text-4xl md:text-5xl font-bold tracking-tighter">5.0</span>
          <div className="flex flex-col">
            <Star className="w-4 h-4 fill-current" strokeWidth={1.5} style={{ color: "var(--sand)" }} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mt-1">{t("reviews.platform_avito")}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full max-w-3xl gap-4">
        {reviews.map((review, idx) => (
          <div key={idx} className="review-card opacity-0 translate-y-10 border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 group hover:border-[var(--sand)]/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-white font-bold text-sm">{t(review.nameKey)}</span>
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: "var(--accent)" }}>{t(review.serviceKey)}</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-600">{t(review.dateKey)}</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">«{t(review.textKey)}»</p>
          </div>
        ))}
      </div>

      <SectionCTA variant="form" label={t("reviews.cta")} />
    </section>
  );
}
