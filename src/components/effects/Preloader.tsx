"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Logo from "@/components/ui/Logo";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const waveTealRef = useRef<HTMLDivElement>(null);
  const waveSandRef = useRef<HTMLDivElement>(null);
  const waveBlackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (
      !containerRef.current ||
      !logoRef.current ||
      !waveTealRef.current ||
      !waveSandRef.current ||
      !waveBlackRef.current ||
      !counterRef.current
    )
      return;

    document.body.style.overflow = "hidden";

    // Initial states
    gsap.set(logoRef.current, { scale: 0.9, opacity: 0 });
    gsap.set([waveTealRef.current, waveSandRef.current, waveBlackRef.current], {
      scaleY: 0,
      transformOrigin: "bottom center",
    });
    gsap.set(counterRef.current, { opacity: 0 });

    const counter = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        document.body.style.overflow = "";
        window.dispatchEvent(new Event("preloaderComplete"));
      },
    });

    // 1. Logo fade in
    tl.to(logoRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
    });

    // Counter appears
    tl.to(
      counterRef.current,
      {
        opacity: 1,
        duration: 0.3,
      },
      "-=0.3"
    );

    // 2. Teal wave + counter 0→33%
    tl.to(
      waveTealRef.current,
      {
        scaleY: 1,
        duration: 0.3,
        ease: "power2.inOut",
      },
      "+=0.08"
    );
    tl.to(
      counter,
      {
        value: 33,
        duration: 0.3,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = `${Math.round(counter.value)}%`;
          }
        },
      },
      "<"
    );

    // 3. Sand wave + counter 34→66%  (pause so teal is visible)
    tl.to(
      waveSandRef.current,
      {
        scaleY: 1,
        duration: 0.3,
        ease: "power2.inOut",
      },
      "+=0.08"
    );
    tl.to(
      counter,
      {
        value: 66,
        duration: 0.3,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = `${Math.round(counter.value)}%`;
          }
        },
      },
      "<"
    );

    // 4. Black wave + counter 67→100% (pause so sand is visible)
    tl.to(
      waveBlackRef.current,
      {
        scaleY: 1,
        duration: 0.3,
        ease: "power2.inOut",
      },
      "+=0.08"
    );
    tl.to(
      counter,
      {
        value: 100,
        duration: 0.3,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = `${Math.round(counter.value)}%`;
          }
        },
      },
      "<"
    );

    // 5. Hold
    tl.to({}, { duration: 0.08 });

    // 6. Exit — everything flies up
    tl.to(containerRef.current, {
      y: "-100%",
      duration: 1,
      ease: "expo.inOut",
    });
  }, []);

  if (isComplete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-deep)" }}
    >
      {/* Subtle grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute left-1/4 top-0 w-px h-full bg-white" />
        <div className="absolute left-1/2 top-0 w-px h-full bg-white" />
        <div className="absolute left-3/4 top-0 w-px h-full bg-white" />
      </div>

      {/* Logo — mix-blend-difference for automatic color inversion */}
      <div
        ref={logoRef}
        className="relative z-20"
        style={{ mixBlendMode: "difference" }}
      >
        <Logo size="lg" className="text-white" />
      </div>

      {/* Color waves — stack bottom to top */}
      <div
        ref={waveTealRef}
        className="absolute inset-0 z-[1]"
        style={{ backgroundColor: "#5eead4" }}
      />
      <div
        ref={waveSandRef}
        className="absolute inset-0 z-[2]"
        style={{ backgroundColor: "#d4a574" }}
      />
      <div
        ref={waveBlackRef}
        className="absolute inset-0 z-[3]"
        style={{ backgroundColor: "var(--bg-deep)" }}
      />

      {/* Percentage counter — bottom right, monospace */}
      <span
        ref={counterRef}
        className="absolute bottom-8 right-8 z-30 text-xs tracking-[0.15em] text-neutral-500 font-mono"
        style={{ mixBlendMode: "difference" }}
      >
        0%
      </span>
    </div>
  );
}
