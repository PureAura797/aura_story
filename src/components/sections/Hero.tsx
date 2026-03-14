"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PhoneCall, ArrowRight } from "lucide-react";
import AvailabilityPulse from "@/components/ui/AvailabilityPulse";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useGSAP(() => {
    if (!containerRef.current) return;
    const contentElements = containerRef.current.querySelectorAll(".hero-reveal");
    
    gsap.set(contentElements, { y: 100, opacity: 0 });
    gsap.to(contentElements, {
      y: 0,
      opacity: 1,
      stagger: 0.15,
      duration: 1.5,
      ease: "power4.out",
      delay: 3.2,
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col justify-center items-start z-10 pointer-events-none">
      
      {/* USP headline */}
      <h1 className="hero-reveal text-[8vw] md:text-[7vw] leading-[0.9] font-bold tracking-tighter text-white z-20 mix-blend-difference relative">
        {t("hero.h1_1")}
        <br />
        {t("hero.h1_2")}
      </h1>
      
      {/* Service listing */}
      <p className="hero-reveal mt-8 text-[11px] md:text-xs tracking-[0.15em] text-neutral-400 uppercase font-medium mix-blend-difference">
        {t("hero.services")}
      </p>

      {/* Trust triggers */}
      <div className="hero-reveal mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[11px] tracking-[0.15em] text-neutral-600 uppercase font-medium mix-blend-difference">
        <span>{t("hero.trust1")}</span>
        <span>{t("hero.trust2")}</span>
        <span>{t("hero.trust3")}</span>
      </div>

      {/* Live availability pulse */}
      <div className="hero-reveal mt-6 pointer-events-auto">
        <AvailabilityPulse />
      </div>

      {/* CTA buttons — sharp brutalist style */}
      <div className="hero-reveal mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 pointer-events-auto">
        {/* Primary — white fill + shimmer + glow pulse */}
        <a
          href="tel:+74951203456"
          aria-label={t("hero.cta_emergency")}
          className="btn-primary btn-primary--hero w-full sm:w-auto"
        >
          <PhoneCall className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
          {t("hero.cta_emergency")}
        </a>
        {/* Ghost — sharp outline */}
        <button
          onClick={() => document.getElementById("process")?.scrollIntoView({ behavior: "smooth" })}
          aria-label={t("hero.cta_process")}
          className="btn-ghost group w-full sm:w-auto"
        >
          {t("hero.cta_process")}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
