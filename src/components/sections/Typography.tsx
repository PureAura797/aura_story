"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function TypographySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const divs = gsap.utils.toArray(".text-reveal-text > div") as HTMLElement[];
    const pReveal = document.querySelector(".text-reveal-p") as HTMLElement;

    gsap.set(divs, { y: 80, opacity: 0, scale: 0.9 });
    if (pReveal) gsap.set(pReveal, { y: 30, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        toggleActions: "play none none reverse",
      },
    });

    if (divs.length >= 2) {
      tl.to(divs[0], {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: "expo.out",
      })
        .to(
          divs[1],
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "expo.out",
          },
          "-=0.8"
        )
        .to(
          pReveal,
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.5"
        );
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="typography-section"
      className="section-card min-h-screen relative flex items-center justify-center bg-white text-[#0b0c0f] py-24 md:py-32 px-6 rounded-t-[40px] md:rounded-t-[60px] z-20 -mt-36 md:-mt-48"
    >
      <div className="max-w-[1200px] w-full flex flex-col items-center text-center">
        <h2 className="text-reveal-text text-[28px] sm:text-[42px] md:text-[60px] lg:text-[76px] font-bold leading-[1] tracking-tight text-center w-full">
          <div className="uppercase text-[#0b0c0f]">АБСОЛЮТНАЯ</div>
          <div className="uppercase text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 to-neutral-500 mt-2">
            КОНФИДЕНЦИАЛЬНОСТЬ.
          </div>
        </h2>
        <p className="mt-12 text-lg md:text-2xl font-medium text-neutral-600 max-w-2xl mx-auto text-reveal-p">
          Мы приезжаем на машинах без логотипов. Мы работаем тихо. Мы оберегаем вашу частную жизнь в самые трудные моменты.
        </p>
      </div>
    </section>
  );
}
