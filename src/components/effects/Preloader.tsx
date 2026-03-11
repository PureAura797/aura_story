"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !logoRef.current || !progressRef.current || !subtitleRef.current) return;

    document.body.style.overflow = "hidden";

    const letters = logoRef.current.querySelectorAll(".preloader-letter");

    // Initial states
    gsap.set(letters, { y: 80, opacity: 0, rotateX: 90 });
    gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(subtitleRef.current, { y: 20, opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        document.body.style.overflow = "";
        window.dispatchEvent(new Event("preloaderComplete"));
      },
    });

    // 1. Letters stagger in
    tl.to(letters, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.8,
      stagger: 0.06,
      ease: "power4.out",
    });

    // 2. Progress line fills
    tl.to(progressRef.current, {
      scaleX: 1,
      duration: 1.2,
      ease: "power2.inOut",
    }, "-=0.3");

    // 3. Subtitle fades in
    tl.to(subtitleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
    }, "-=0.5");

    // 4. Hold
    tl.to({}, { duration: 0.4 });

    // 5. Everything exits upward
    tl.to(containerRef.current, {
      y: "-100%",
      duration: 1,
      ease: "expo.inOut",
    });

  }, []);

  if (isComplete) return null;

  const logoText = "PUREAURA";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: "var(--bg-deep)" }}
    >
      {/* Subtle grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute left-1/4 top-0 w-px h-full bg-white" />
        <div className="absolute left-1/2 top-0 w-px h-full bg-white" />
        <div className="absolute left-3/4 top-0 w-px h-full bg-white" />
      </div>

      {/* Logo */}
      <div
        ref={logoRef}
        className="relative z-10 flex overflow-hidden"
        style={{ perspective: "600px" }}
      >
        {logoText.split("").map((char, i) => (
          <span
            key={i}
            className="preloader-letter inline-block text-5xl md:text-8xl font-bold uppercase tracking-tighter text-white"
            style={{ transformStyle: "preserve-3d" }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Progress line */}
      <div className="relative z-10 w-48 md:w-64 h-px mt-8 bg-white/10 overflow-hidden">
        <div
          ref={progressRef}
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, var(--accent), var(--accent-deep), #0d9488)",
            boxShadow: "0 0 12px rgba(94, 234, 212, 0.6)",
          }}
        />
      </div>

      {/* Subtitle */}
      <div
        ref={subtitleRef}
        className="relative z-10 text-xs md:text-sm tracking-[0.3em] uppercase text-neutral-500 mt-6 font-medium"
      >
        Профессиональная уборка
      </div>
    </div>
  );
}
