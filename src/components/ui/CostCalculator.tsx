"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PhoneCall, Zap, Clock, Calculator } from "lucide-react";
import gsap from "gsap";
import { useTranslation } from "@/lib/i18n/LanguageContext";

function formatPrice(n: number): string {
  return n.toLocaleString("ru-RU") + " ₽";
}

export default function CostCalculator() {
  const { t } = useTranslation();

  const services = [
    { id: "death", label: t("calc.service_death"), base: 15000 },
    { id: "smell", label: t("calc.service_smell"), base: 10000 },
    { id: "hoarding", label: t("calc.service_hoarding"), base: 25000 },
    { id: "fire", label: t("calc.service_fire"), base: 20000 },
  ];

  const extras = [
    { id: "ozone", label: t("calc.extra_ozone"), price: 3000 },
    { id: "pest", label: t("calc.extra_pest"), price: 5000 },
    { id: "trash", label: t("calc.extra_trash"), price: 8000 },
  ];

  const [serviceIdx, setServiceIdx] = useState(0);
  const [area, setArea] = useState(40);
  const [urgent, setUrgent] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [displayPrice, setDisplayPrice] = useState(0);
  const priceRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calcTotal = useCallback(() => {
    const base = services[serviceIdx].base;
    const areaMul = Math.max(1, 1 + (area - 30) * 0.015);
    const urgMul = urgent ? 1.5 : 1;
    let extrasSum = 0;
    selectedExtras.forEach((id) => {
      const e = extras.find((x) => x.id === id);
      if (e) extrasSum += e.price;
    });
    return Math.round((base * areaMul * urgMul + extrasSum) / 100) * 100;
  }, [serviceIdx, area, urgent, selectedExtras]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const target = calcTotal();
    const obj = { val: displayPrice };
    gsap.to(obj, { val: target, duration: 0.6, ease: "power2.out", onUpdate: () => setDisplayPrice(Math.round(obj.val)) });
  }, [calcTotal]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(containerRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: containerRef.current, start: "top 90%", once: true } });
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-5xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-4 h-4 text-white/40" strokeWidth={1.5} />
        <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400">{t("calc.heading")}</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        <div className="space-y-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 mb-3">{t("calc.service_type")}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {services.map((s, i) => (
                <button key={s.id} onClick={() => setServiceIdx(i)} className={`mag-btn px-4 py-3 text-xs font-medium uppercase tracking-wider border transition-all duration-300 cursor-pointer ${serviceIdx === i ? "border-white/30 bg-white/[0.08] text-white" : "border-white/10 bg-transparent text-neutral-500 hover:border-white/20 hover:text-neutral-300"}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-500">{t("calc.area")}</p>
              <span className="text-sm font-medium text-white tabular-nums">{area} {t("calc.area_unit")}</span>
            </div>
            <div className="relative">
              <input type="range" min={10} max={200} value={area} onChange={(e) => setArea(Number(e.target.value))} className="calc-slider w-full" />
              <div className="flex justify-between mt-2">
                {[10, 50, 100, 150, 200].map(v => <span key={v} className="text-[9px] text-neutral-600">{v}</span>)}
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 mb-3">{t("calc.urgency")}</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setUrgent(false)} className={`mag-btn px-4 py-3 text-xs font-medium uppercase tracking-wider border transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${!urgent ? "border-white/30 bg-white/[0.08] text-white" : "border-white/10 bg-transparent text-neutral-500 hover:border-white/20 hover:text-neutral-300"}`}>
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />{t("calc.standard")}
              </button>
              <button onClick={() => setUrgent(true)} className={`mag-btn px-4 py-3 text-xs font-medium uppercase tracking-wider border transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${urgent ? "border-white/30 bg-white/[0.08] text-white" : "border-white/10 bg-transparent text-neutral-500 hover:border-white/20 hover:text-neutral-300"}`}>
                <Zap className="w-3.5 h-3.5" strokeWidth={1.5} />{t("calc.urgent")}
                <span className="text-[8px] text-neutral-500">×1.5</span>
              </button>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 mb-3">{t("calc.extras")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {extras.map((e) => (
                <button key={e.id} onClick={() => toggleExtra(e.id)} className={`mag-btn px-4 py-3 text-xs border transition-all duration-300 cursor-pointer flex items-center justify-between ${selectedExtras.has(e.id) ? "border-white/30 bg-white/[0.08] text-white" : "border-white/10 bg-transparent text-neutral-500 hover:border-white/20 hover:text-neutral-300"}`}>
                  <span className="font-medium uppercase tracking-wider">{e.label}</span>
                  <span className="text-[10px] text-neutral-500">+{e.price.toLocaleString("ru-RU")} ₽</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between border border-white/10 bg-white/[0.02] p-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 mb-2">{t("calc.result")}</p>
            <div className="text-4xl md:text-5xl font-bold tracking-tighter text-white tabular-nums mb-4">
              <span ref={priceRef}>{formatPrice(displayPrice)}</span>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-[10px] text-neutral-500 uppercase tracking-wider">
                <span>{services[serviceIdx].label}</span>
                <span>{formatPrice(services[serviceIdx].base)}</span>
              </div>
              {area > 30 && (
                <div className="flex justify-between text-[10px] text-neutral-500 uppercase tracking-wider">
                  <span>{t("calc.area_label").replace("{area}", String(area))}</span>
                  <span>×{Math.max(1, 1 + (area - 30) * 0.015).toFixed(2)}</span>
                </div>
              )}
              {urgent && (
                <div className="flex justify-between text-[10px] text-neutral-500 uppercase tracking-wider">
                  <span>{t("calc.urgency_label")}</span>
                  <span>×1.50</span>
                </div>
              )}
              {[...selectedExtras].map((id) => {
                const e = extras.find((x) => x.id === id);
                return e ? (
                  <div key={id} className="flex justify-between text-[10px] text-neutral-500 uppercase tracking-wider">
                    <span>{e.label}</span>
                    <span>+{formatPrice(e.price)}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
          <a href="tel:+74951203456" className="btn-primary w-full flex items-center justify-center gap-2 text-center">
            <PhoneCall className="w-4 h-4" strokeWidth={1.5} />
            <span>{t("calc.cta")}</span>
          </a>
          <p className="text-[9px] text-neutral-600 text-center mt-3">{t("calc.note")}</p>
        </div>
      </div>
    </div>
  );
}
