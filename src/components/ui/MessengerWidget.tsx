"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MessengerWidget() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Show after scrolling past hero
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const observer = new MutationObserver(() => {
      setModalOpen(document.body.hasAttribute("data-modal-open"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-modal-open"] });

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

  // Animate fab in/out
  useEffect(() => {
    if (!fabRef.current) return;
    const isShown = visible && !modalOpen;
    if (isShown) {
      gsap.fromTo(fabRef.current,
        { y: 20, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", delay: 0.3 }
      );
    } else {
      gsap.to(fabRef.current, { y: 10, opacity: 0, scale: 0.8, duration: 0.3 });
      setExpanded(false);
    }
  }, [visible, modalOpen]);

  // Animate panel
  useEffect(() => {
    if (!panelRef.current) return;
    if (expanded) {
      gsap.fromTo(panelRef.current,
        { y: 10, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" }
      );
    } else {
      gsap.to(panelRef.current, { y: 10, opacity: 0, scale: 0.95, duration: 0.2 });
    }
  }, [expanded]);

  const isShown = visible && !modalOpen;

  return (
    <>
      {/* Expanded panel */}
      <div
        ref={panelRef}
        className={`fixed bottom-20 left-6 z-50 ${expanded && isShown ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{ opacity: 0 }}
      >
        <div className="bg-[#111214] border border-white/10 backdrop-blur-xl p-5 w-[260px] sm:w-[280px] shadow-2xl">
          <p className="text-xs text-neutral-400 font-light mb-4 leading-relaxed">
            Напишите нам — ответим за 2 минуты. Конфиденциально.
          </p>
          <div className="flex flex-col gap-2.5">
            <a
              href="https://max.ru/pureaura"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в MAX"
              className="flex items-center gap-3 px-4 py-3 bg-[#0077FF]/10 border border-[#0077FF]/20 hover:bg-[#0077FF]/20 transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-full bg-[#0077FF] flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">MAX</p>
                <p className="text-[10px] text-neutral-500">Онлайн · ответ ~2 мин</p>
              </div>
            </a>
            <a
              href="https://t.me/pureaura"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в Telegram"
              className="flex items-center gap-3 px-4 py-3 bg-[#229ED9]/10 border border-[#229ED9]/20 hover:bg-[#229ED9]/20 transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-full bg-[#229ED9] flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-bold">T</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Telegram</p>
                <p className="text-[10px] text-neutral-500">Онлайн · ответ ~2 мин</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* FAB button — compact square, sharp corners */}
      <button
        ref={fabRef}
        onClick={() => setExpanded(!expanded)}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 sm:w-13 sm:h-13 border border-white/15 bg-white/[0.04] backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:bg-white/[0.08] hover:border-white/30 cursor-pointer group"
        style={{ opacity: 0, pointerEvents: isShown ? "auto" : "none" }}
        aria-label={expanded ? "Закрыть мессенджеры" : "Написать в мессенджер"}
      >
        {expanded ? (
          <X className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
        ) : (
          <MessageCircle className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" strokeWidth={1.5} />
        )}
      </button>
    </>
  );
}
