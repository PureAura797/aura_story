"use client";

import { useRef, useState, useEffect } from "react";
import { PhoneCall } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function EmergencyButton() {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Show button when Hero section is fully scrolled past
    const heroEl = document.querySelector("section") || document.querySelector("[data-section='hero']");
    if (!heroEl) {
      // Fallback: show after scrolling 100vh
      const handleScroll = () => {
        setVisible(window.scrollY > window.innerHeight);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }

    ScrollTrigger.create({
      trigger: heroEl,
      start: "bottom top",
      onEnter: () => setVisible(true),
      onLeaveBack: () => setVisible(false),
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    if (!btnRef.current) return;
    if (visible) {
      gsap.fromTo(
        btnRef.current,
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }
      );
    } else {
      gsap.to(btnRef.current, {
        y: 10,
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [visible]);

  return (
    <>
    <a
      ref={btnRef}
      href="tel:+74951203456"
      className="emergency-btn fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 md:px-6 md:py-4 border border-white/10 bg-white/[0.06] backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.1] hover:border-[rgba(94,234,212,0.3)] group"
      style={{ opacity: 0, pointerEvents: visible ? "auto" : "none" }}
      aria-label="Экстренный вызов"
    >
      {/* Pulse ring */}
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ backgroundColor: "var(--accent)" }}
        />
        <span
          className="relative inline-flex rounded-full h-2.5 w-2.5"
          style={{ backgroundColor: "var(--accent)" }}
        />
      </span>

      <PhoneCall
        className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
        strokeWidth={1.5}
        style={{ color: "var(--accent)" }}
      />

      {/* Text hidden on mobile */}
      <span className="hidden md:inline text-xs font-bold uppercase tracking-widest text-white">
        Экстренный вызов
      </span>
    </a>
    
    {/* Mobile Sticky CTA */}
    <div 
      className="fixed bottom-0 left-0 right-0 z-[9990] md:hidden transition-all duration-300"
      style={{ 
        transform: visible ? "translateY(0)" : "translateY(100%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none"
      }}
    >
      <div className="px-4 pb-5 pt-3">
        <a
          href="tel:+74951203456"
          className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-white text-black font-bold uppercase tracking-widest text-xs active:scale-[0.97] transition-transform duration-150"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "var(--accent-deep)" }}></span>
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "var(--accent-deep)" }}></span>
          </span>
          Экстренная связь 24/7
        </a>
      </div>
    </div>
    </>
  );
}
