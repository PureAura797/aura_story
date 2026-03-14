"use client";

import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LiveClock() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const clockRef = useRef<HTMLDivElement>(null);

  // Format time and date
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show after scrolling past hero
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const observer = new MutationObserver(() => {
      setModalOpen(document.body.hasAttribute("data-modal-open"));
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-modal-open"],
    });

    ScrollTrigger.create({
      start: () => window.innerHeight,
      onEnter: () => setVisible(true),
      onLeaveBack: () => setVisible(false),
    });

    return () => {
      observer.disconnect();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const isShown = visible && !modalOpen;

  // Animate in/out
  useEffect(() => {
    if (!clockRef.current) return;
    if (isShown) {
      gsap.fromTo(
        clockRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.15 }
      );
    } else {
      gsap.to(clockRef.current, {
        y: 10,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isShown]);

  return (
    <div
      ref={clockRef}
      className="fixed z-50 border-white/10 bg-white/[0.04] backdrop-blur-xl
        bottom-0 left-0 right-0 h-11 flex items-center justify-center gap-3 px-5 border-t border-x-0 border-b-0
        md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:right-auto md:h-12 md:border md:w-auto"
      style={{ opacity: 0, pointerEvents: isShown ? "auto" : "none" }}
      aria-label="Текущие дата и время"
    >
      {/* "СЕЙЧАС" label */}
      <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
        Сейчас
      </span>

      {/* Separator */}
      <span className="w-px h-4 bg-white/10" />

      {/* Clock icon */}
      <Clock className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />

      {/* Time */}
      <span className="text-[11px] font-medium tracking-[0.08em] text-white tabular-nums">
        {time}
      </span>

      {/* Separator */}
      <span className="w-px h-4 bg-white/10" />

      {/* Date */}
      <span className="text-[11px] font-light tracking-[0.08em] text-neutral-500 tabular-nums">
        {date}
      </span>
    </div>
  );
}
