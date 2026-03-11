"use client";

import { useRef, useEffect } from "react";
import { X, Phone } from "lucide-react";
import gsap from "gsap";

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallbackModal({ isOpen, onClose }: CallbackModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(overlayRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.3, ease: "power2.out" });
      gsap.fromTo(panelRef.current, 
        { y: 40, opacity: 0, scale: 0.96 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power4.out", delay: 0.1 }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(panelRef.current, { y: 20, opacity: 0, scale: 0.97, duration: 0.3, ease: "power3.in" });
      gsap.to(overlayRef.current, { opacity: 0, pointerEvents: "none", duration: 0.3, delay: 0.1 });
    }
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center px-6"
      style={{ opacity: 0, pointerEvents: "none" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-md border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10"
      >
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-neutral-500 hover:text-white transition-colors cursor-pointer"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* Header */}
        <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-2">
          Обратный звонок
        </h3>
        <p className="text-sm text-neutral-500 font-light mb-8">
          Оставьте номер — перезвоним в течение 2 минут.
        </p>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
          className="flex flex-col gap-5"
        >
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-medium block mb-2">
              Имя
            </label>
            <input
              type="text"
              placeholder="Как вас зовут"
              className="w-full bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-[rgba(94,234,212,0.5)]"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-medium block mb-2">
              Телефон
            </label>
            <input
              type="tel"
              placeholder="+7 (___) ___-__-__"
              required
              className="w-full bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-[rgba(94,234,212,0.5)]"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3 cursor-pointer"
          >
            <Phone className="w-4 h-4" strokeWidth={1.5} />
            Перезвоните мне
          </button>

          <p className="text-[10px] text-neutral-600 text-center">
            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
          </p>
        </form>
      </div>
    </div>
  );
}
