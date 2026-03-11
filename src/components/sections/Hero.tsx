"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PhoneCall } from "lucide-react";

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
      <h1 className="hero-reveal text-[8vw] md:text-[7vw] leading-[0.9] font-bold uppercase tracking-tighter text-white z-20 mix-blend-difference relative">
        ПРОФЕССИОНАЛЬНАЯ
        <br />
        УБОРКА ПОСЛЕ ЧП<span style={{ color: "var(--accent)" }}>.</span>
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

      {/* CTA buttons */}
      <div className="hero-reveal mt-12 md:mt-16 flex flex-col sm:flex-row gap-4 pointer-events-auto">
        <a
          href="tel:+74951203456"
          className="group w-full sm:w-auto px-8 py-5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <PhoneCall className="w-4 h-4" strokeWidth={1.5} />
          Экстренная связь
        </a>
        <a
          href="#process"
          className="w-full sm:w-auto px-8 py-5 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors text-center"
        >
          Порядок работы
        </a>
      </div>
    </div>
  );
}
