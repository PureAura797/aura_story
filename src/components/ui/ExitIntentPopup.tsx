"use client";

import { useState, useEffect, useRef } from "react";
import { X, PhoneCall } from "lucide-react";
import gsap from "gsap";
import { useContacts } from "@/lib/contacts-context";

export default function ExitIntentPopup() {
  const [shown, setShown] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contacts = useContacts();

  useEffect(() => {
    // Only on desktop (mouse-based)
    if (typeof window === "undefined" || window.innerWidth < 1024) return;
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from the top (closing tab)
      if (e.clientY > 10) return;
      if (dismissed || shown) return;

      // Only show after user has scrolled a bit (engaged)
      if (window.scrollY < window.innerHeight * 0.5) return;

      setShown(true);
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [dismissed, shown]);

  // Animate in — Glass Float
  useEffect(() => {
    if (!shown || !overlayRef.current || !panelRef.current) return;

    // Overlay fade-in
    gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );

    // Panel — Glass Float entrance (3D depth)
    gsap.fromTo(panelRef.current,
      { y: 50, opacity: 0, scale: 0.92, rotateX: 3 },
      { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.6, ease: "back.out(1.4)", delay: 0.1 }
    );

    // Inner content elements — stagger cascade
    const children = panelRef.current.querySelectorAll(":scope > *");
    gsap.fromTo(children,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.06, delay: 0.25 }
    );
  }, [shown]);

  const handleDismiss = () => {
    if (!overlayRef.current || !panelRef.current) return;
    gsap.to(panelRef.current, { y: -20, opacity: 0, scale: 0.96, duration: 0.25, ease: "power3.in" });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      delay: 0.1,
      onComplete: () => {
        setShown(false);
        setDismissed(true);
      },
    });
  };

  if (!shown) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[80] flex items-center justify-center p-6"
      onClick={handleDismiss}
      style={{ opacity: 0, perspective: "800px" }}
    >
      {/* Backdrop — separate sibling, same as CallbackModal */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={panelRef}
        data-dark-ui
        className="relative border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 sm:p-10 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        style={{ opacity: 0 }}
      >
        {/* Close */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-neutral-600 hover:text-white transition-colors cursor-pointer"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* Content */}
        <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: "var(--accent)" }}>
          Подождите
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tighter mb-4">
          Нужна помощь
          <br />
          прямо сейчас?
        </h3>
        <p className="text-sm text-neutral-500 font-light leading-relaxed mb-8">
          Оставьте номер — мы перезвоним в течение 15 минут и бесплатно проконсультируем по вашей ситуации. Конфиденциально.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`tel:${contacts.phoneMobile}`}
            className="btn-primary flex-1 px-6 py-3.5"
            aria-label={`Позвонить ${contacts.phoneMobileDisplay}`}
          >
            <PhoneCall className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
            Позвонить сейчас
          </a>
          <button
            onClick={handleDismiss}
            className="btn-ghost flex-1 px-6 py-3.5"
          >
            Не сейчас
          </button>
        </div>
      </div>
    </div>
  );
}
