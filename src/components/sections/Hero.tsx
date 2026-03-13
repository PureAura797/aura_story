"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PhoneCall, ArrowRight } from "lucide-react";
import AvailabilityPulse from "@/components/ui/AvailabilityPulse";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

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
        Профессиональная
        <br />
        уборка после ЧП
      </h1>
      
      {/* Service listing */}
      <p className="hero-reveal mt-8 text-[11px] md:text-xs tracking-[0.15em] text-neutral-400 uppercase font-medium mix-blend-difference">
        Уборка после смерти · Дезинфекция · Устранение запахов · Расхламление
      </p>

      {/* Trust triggers */}
      <div className="hero-reveal mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[11px] tracking-[0.15em] text-neutral-600 uppercase font-medium mix-blend-difference">
        <span>Выезд 60 мин</span>
        <span>Москва 24/7</span>
        <span>Лицензия СЭС</span>
      </div>

      {/* Live availability pulse */}
      <div className="hero-reveal mt-6 pointer-events-auto">
        <AvailabilityPulse />
      </div>

      {/* CTA buttons — unified pill style */}
      <div className="hero-reveal mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 pointer-events-auto">
        {/* Primary — teal fill */}
        <a
          href="tel:+74951203456"
          aria-label="Экстренная связь — позвонить по телефону 8 495 120-34-56"
          className="group w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.12em] flex items-center justify-center gap-2.5 transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg-deep)" }}
        >
          <PhoneCall className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
          Экстренная связь
        </a>
        {/* Secondary — ghost border */}
        <button
          onClick={() => document.getElementById("process")?.scrollIntoView({ behavior: "smooth" })}
          aria-label="Узнать порядок работы по дезинфекции помещений"
          className="group w-full sm:w-auto px-7 py-3.5 rounded-full border border-white/20 text-white text-xs font-semibold uppercase tracking-[0.12em] hover:border-white/40 hover:bg-white/[0.04] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          Порядок работы
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
