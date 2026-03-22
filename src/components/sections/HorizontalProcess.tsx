"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function HorizontalProcess() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const horizontalSection = containerRef.current;
    if (!horizontalSection) return;

    // Parallax logic logic to float it up smoothly before pinning
    gsap.fromTo(
      horizontalSection,
      {
        y: 120,
        scale: 0.92,
        transformOrigin: "center bottom",
      },
      {
        y: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: horizontalSection,
          start: "top bottom",
          end: "top 70%",
          scrub: 0.8,
        },
      }
    );

    const horizontalContainer = document.querySelector(".horizontal-container") as HTMLElement;
    if (!horizontalContainer) return;

    function getScrollAmount() {
      let containerWidth = horizontalContainer.scrollWidth;
      return -(containerWidth - window.innerWidth);
    }

    const tween = gsap.to(horizontalContainer, {
      x: getScrollAmount,
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: horizontalSection,
      start: "top 80px",
      end: () => `+=${getScrollAmount() * -1}`,
      pin: true,
      animation: tween,
      scrub: 0.8,
      invalidateOnRefresh: true,
      onRefresh() {
        const spacer = horizontalSection.parentElement;
        if (spacer && spacer.classList.contains("pin-spacer")) {
          spacer.style.background = "#f0f2f5";
        }
      },
    });

    const panels = gsap.utils.toArray(".horizontal-panel") as HTMLElement[];
    panels.forEach((panel, i) => {
      gsap.from(panel, {
        scrollTrigger: {
          trigger: horizontalSection,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
        rotateZ: i % 2 === 0 ? 2 : -2,
        scale: 0.95,
        ease: "none",
      });
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="horizontal-scroll"
      className="section-card bg-[#f0f2f5] text-[#0b0c0f] relative pb-32 pt-24 md:pt-28 rounded-t-[40px] md:rounded-t-[60px] z-30 -mt-36 md:-mt-48"
    >
      <div className="pl-6 md:pl-32 pb-16">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight">Протокол дезактивации</h2>
      </div>
      <div className="horizontal-container flex gap-6 md:gap-8 pl-6 md:pl-32 pr-[10vw] md:pr-[50vw]">
        <div className="horizontal-panel min-w-[300px] md:min-w-[500px] h-[400px] md:h-[450px] bg-white border border-neutral-200 rounded-[32px] p-8 md:p-10 flex flex-col shadow-sm">
          <span className="font-mono text-sm tracking-widest mb-6 md:mb-8" style={{ color: "var(--accent-deep)" }}>ФАЗА 01</span>
          <h3 className="text-xl md:text-2xl font-medium mb-4">Оценка</h3>
          <p className="text-neutral-500 font-light text-[15px] md:text-base">
            Оперативный и незаметный осмотр пострадавшей зоны для установки границ контаминации и подбора химических реагентов.
          </p>
        </div>

        <div className="horizontal-panel min-w-[300px] md:min-w-[500px] h-[400px] md:h-[450px] bg-white border border-neutral-200 rounded-[32px] p-8 md:p-10 flex flex-col shadow-sm">
          <span className="font-mono text-sm tracking-widest mb-6 md:mb-8" style={{ color: "var(--accent-deep)" }}>ФАЗА 02</span>
          <h3 className="text-xl md:text-2xl font-medium mb-4">Изоляция</h3>
          <p className="text-neutral-500 font-light text-[15px] md:text-base">
            Герметизация помещения с использованием систем отрицательного давления для предотвращения миграции микрочастиц.
          </p>
        </div>

        <div className="horizontal-panel min-w-[300px] md:min-w-[500px] h-[400px] md:h-[450px] bg-white border border-neutral-200 rounded-[32px] p-8 md:p-10 flex flex-col shadow-sm">
          <span className="font-mono text-sm tracking-widest mb-6 md:mb-8" style={{ color: "var(--accent-deep)" }}>ФАЗА 03</span>
          <h3 className="text-xl md:text-2xl font-medium mb-4">Очистка</h3>
          <p className="text-neutral-500 font-light text-[15px] md:text-base">
            Удаление испорченных материалов, поэтапная химическая обработка и контроль чистоты для подтверждения стерильности.
          </p>
        </div>

        <div className="horizontal-panel min-w-[300px] md:min-w-[500px] h-[400px] md:h-[450px] bg-[#0b0c0f] text-white rounded-[32px] p-8 md:p-10 flex flex-col shadow-xl">
          <span className="font-mono text-sm tracking-widest mb-6 md:mb-8" style={{ color: "var(--accent)" }}>ГОТОВЫ 24/7</span>
          <h3 className="text-xl md:text-2xl font-medium mb-4">Мы здесь, чтобы помочь.</h3>
          <button className="w-full py-4 mt-auto bg-white hover:bg-neutral-200 text-black font-medium rounded-xl transition-colors">
            Вызвать службу
          </button>
        </div>
      </div>
    </section>
  );
}
