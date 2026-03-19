"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import CostCalculator from "@/components/ui/CostCalculator";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface PricingItem {
  id: string;
  name: string;
  area: string;
  price: number;
  description: string;
  features: string;
  published: boolean;
  sort_order: number;
}

export default function Pricing() {
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const [plans, setPlans] = useState<PricingItem[]>([]);

  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => setPlans(data))
      .catch(() => setPlans([]));
  }, []);

  useGSAP(() => {
    if (plans.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);
    const items = gsap.utils.toArray(".pricing-card") as HTMLElement[];
    ScrollTrigger.batch(items, {
      start: "top 98%",
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, stagger: 0.04, duration: 0.4, ease: "power2.out" }),
      once: true,
    });
  }, { scope: containerRef, dependencies: [plans] });

  const formatPrice = (price: number) => {
    return price.toLocaleString("ru-RU") + " ₽";
  };

  return (
    <section ref={containerRef} className="w-full flex flex-col items-start z-10 relative">
      <div className="mb-4">
        <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--sand)" }}>{t("pricing.label")}</p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">{t("pricing.heading")}</h2>
      </div>
      <p className="text-sm text-neutral-500 font-light mb-12 max-w-md">{t("pricing.desc")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
        {plans.map((plan) => (
          <div key={plan.id} className="pricing-card opacity-0 translate-y-10 border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 group hover:border-[rgba(94,234,212,0.2)] transition-all duration-500 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-sm font-bold tracking-tight group-hover:text-[var(--accent)] transition-colors duration-500">{plan.name}</h3>
            </div>
            <span className="text-[11px] uppercase tracking-[0.15em] text-neutral-600 border border-white/10 px-3 py-1 w-fit mb-3">{plan.area}</span>
            <p className="text-neutral-500 text-xs leading-relaxed mb-4 flex-1">{plan.description}</p>
            <p className="text-[11px] uppercase tracking-[0.15em] font-medium mb-4" style={{ color: "var(--sand-dim)" }}>{plan.features}</p>
            <div className="mt-auto pt-3 border-t border-white/5">
              <span className="text-[11px] text-neutral-500 uppercase tracking-widest block mb-1">{t("pricing.from")}</span>
              <div className="text-2xl md:text-3xl font-bold tracking-tighter text-white">{formatPrice(plan.price)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-5xl mt-4"><CostCalculator /></div>

      <div className="pricing-card opacity-0 translate-y-10 mt-4 border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 w-full max-w-5xl">
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-medium justify-center">
          <span>{t("pricing.guarantee1")}</span>
          <span>{t("pricing.guarantee2")}</span>
          <span>{t("pricing.guarantee3")}</span>
          <span>{t("pricing.guarantee4")}</span>
        </div>
      </div>
    </section>
  );
}
