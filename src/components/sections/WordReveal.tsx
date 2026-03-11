"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function WordReveal() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const revealWords = gsap.utils.toArray(".reveal-word") as HTMLElement[];
    
    if (revealWords.length > 0) {
      const wordTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "top -20%",
          scrub: 0.5,
        },
      });

      revealWords.forEach((word, i) => {
        wordTl.to(
          word,
          {
            opacity: 1,
            duration: 0.3,
            ease: "none",
            onComplete: () => word.classList.add("revealed"),
            onReverseComplete: () => word.classList.remove("revealed"),
          },
          i * 0.08
        );
      });
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="word-reveal-section" className="relative py-32 md:py-48 px-6 z-10">
      <div className="max-w-[900px] mx-auto">
        <p className="word-reveal-text text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-medium leading-[1.4] tracking-tight text-center">
          <span className="reveal-word">Когда</span>{" "}
          <span className="reveal-word">жизнь</span>{" "}
          <span className="reveal-word">ставит</span>{" "}
          <span className="reveal-word">перед</span>{" "}
          <span className="reveal-word">вами</span>{" "}
          <span className="reveal-word">испытание,</span>{" "}
          <span className="reveal-word">которое</span>{" "}
          <span className="reveal-word">невозможно</span>{" "}
          <span className="reveal-word">пережить</span>{" "}
          <span className="reveal-word">в</span>{" "}
          <span className="reveal-word">одиночку</span>{" "}
          <span className="reveal-word">—</span>{" "}
          <span className="reveal-word reveal-word--accent">мы</span>{" "}
          <span className="reveal-word reveal-word--accent">берём</span>{" "}
          <span className="reveal-word reveal-word--accent">на</span>{" "}
          <span className="reveal-word reveal-word--accent">себя</span>{" "}
          <span className="reveal-word reveal-word--accent">самое</span>{" "}
          <span className="reveal-word reveal-word--accent">тяжёлое.</span>{" "}
          <span className="reveal-word">Тихо.</span>{" "}
          <span className="reveal-word">Быстро.</span>{" "}
          <span className="reveal-word">Бережно.</span>
        </p>
      </div>
    </section>
  );
}
