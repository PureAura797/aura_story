"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

const LETTERS_TOP = ["P", "U", "R", "E"];
const LETTERS_BOT = ["A", "U", "R", "A", "."];

/* ─── Dust particle burst ─── */
function spawnDust(container: HTMLElement) {
  const count = 24;
  const rect = container.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    const size = gsap.utils.random(2, 5);
    const angle = (Math.PI * 2 * i) / count + gsap.utils.random(-0.3, 0.3);
    const dist = gsap.utils.random(40, 160);

    Object.assign(dot.style, {
      position: "absolute",
      left: `${centerX}px`,
      top: `${centerY}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: i % 3 === 0 ? "var(--accent)" : "rgba(255,255,255,0.5)",
      pointerEvents: "none",
      zIndex: "25",
      opacity: "0",
    });

    container.appendChild(dot);

    gsap.fromTo(
      dot,
      { x: 0, y: 0, opacity: 0, scale: 1 },
      {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0.8,
        scale: 0,
        duration: gsap.utils.random(0.5, 0.9),
        ease: "power3.out",
        delay: gsap.utils.random(0, 0.1),
        onStart: () => { dot.style.opacity = "0.8"; },
        onComplete: () => dot.remove(),
      }
    );
  }
}

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !counterRef.current || !lineRef.current) return;

    gsap.registerPlugin(CustomEase);
    CustomEase.create("cascadeLand", "M0,0 C0.15,0.6 0.2,0.85 0.35,0.92 0.5,0.99 0.7,1.02 0.85,1.01 0.92,1.005 1,1 1,1");

    document.body.style.overflow = "hidden";

    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
    const counter = { value: 0 };

    // Wide scatter — radius 500–900
    letters.forEach((letter) => {
      const angle = gsap.utils.random(0, Math.PI * 2);
      const radius = gsap.utils.random(500, 900);
      gsap.set(letter, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rotation: gsap.utils.random(-240, 240),
        scale: gsap.utils.random(0.15, 3.5),
        opacity: 0,
        filter: "blur(20px)",
      });
    });

    gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(counterRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        document.body.style.overflow = "";
        window.dispatchEvent(new Event("preloaderComplete"));
      },
    });

    // Phase 1: Letters appear scattered
    tl.to(letters, {
      opacity: 0.5,
      filter: "blur(10px)",
      stagger: { each: 0.02, from: "random" },
      duration: 0.15,
      ease: "power2.out",
    });

    // Counter appears
    tl.to(counterRef.current, { opacity: 1, duration: 0.15 }, 0.05);

    // Phase 2: CASCADE — fast duration
    tl.to(letters, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      stagger: { each: 0.06, from: "start" },
      duration: 0.9,
      ease: "cascadeLand",
      onComplete: () => {
        // Dust burst when all letters land
        if (logoWrapRef.current) spawnDust(logoWrapRef.current);
      },
    }, 0.2);

    // Progress line
    tl.to(lineRef.current, { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0.2);

    // Counter
    tl.to(
      counter,
      {
        value: 100,
        duration: 1.1,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current)
            counterRef.current.textContent = `${Math.round(counter.value)}`;
        },
      },
      0.2
    );

    // Phase 3: Breath pulse
    tl.to(letters, {
      scale: 1.04,
      duration: 0.15,
      ease: "sine.in",
      stagger: 0,
    }, "+=0.03");
    tl.to(letters, {
      scale: 1,
      duration: 0.25,
      ease: "sine.out",
    });

    // Phase 4: Hold
    tl.to({}, { duration: 0.2 });

    // Phase 5: Exit
    tl.to(
      [counterRef.current, lineRef.current],
      { opacity: 0, y: 10, duration: 0.15, ease: "power2.in" },
    );
    tl.to(containerRef.current, {
      y: "-100%",
      duration: 0.75,
      ease: "expo.inOut",
    }, "-=0.08");
  }, []);

  if (isComplete) return null;

  const setRef = (i: number) => (el: HTMLSpanElement | null) => {
    lettersRef.current[i] = el;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--bg-deep)" }}
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute left-1/4 top-0 w-px h-full bg-white" />
        <div className="absolute left-1/2 top-0 w-px h-full bg-white" />
        <div className="absolute left-3/4 top-0 w-px h-full bg-white" />
      </div>

      {/* Logo letters + dust container */}
      <div
        ref={logoWrapRef}
        className="relative z-20 font-bebas uppercase tracking-tight select-none text-5xl md:text-7xl leading-[0.85]"
      >
        {/* PURE */}
        <div className="flex justify-center">
          {LETTERS_TOP.map((char, i) => (
            <span
              key={`top-${i}`}
              ref={setRef(i)}
              className="inline-block text-white"
              style={{ willChange: "transform, opacity, filter" }}
            >
              {char}
            </span>
          ))}
        </div>
        {/* AURA. */}
        <div className="flex justify-center">
          {LETTERS_BOT.map((char, i) => (
            <span
              key={`bot-${i}`}
              ref={setRef(LETTERS_TOP.length + i)}
              className="inline-block"
              style={{
                color: char === "." ? "var(--accent)" : "white",
                willChange: "transform, opacity, filter",
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Progress line + counter */}
      <div className="absolute bottom-12 left-8 right-8 z-30 flex items-center gap-4">
        <div className="flex-1 h-px bg-white/10 relative">
          <div
            ref={lineRef}
            className="absolute inset-y-0 left-0 w-full bg-white/30"
          />
        </div>
        <span
          ref={counterRef}
          className="text-[11px] tracking-[0.15em] text-neutral-500 font-mono tabular-nums w-8 text-right"
        >
          0
        </span>
      </div>
    </div>
  );
}
