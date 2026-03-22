"use client";

import { useRef, useState, useEffect } from "react";
import { PhoneCall } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useContacts } from "@/lib/contacts-context";

export default function EmergencyButton() {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();
  const contacts = useContacts();

  // Watch for data-modal-open attribute changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setModalOpen(document.body.hasAttribute("data-modal-open"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-modal-open"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const heroEl = document.querySelector("section") || document.querySelector("[data-section='hero']");
    if (!heroEl) {
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

  const isShown = visible && !modalOpen;

  useEffect(() => {
    if (!btnRef.current) return;
    if (isShown) {
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
  }, [isShown]);

  return (
    <a
      ref={btnRef}
      href={`tel:${contacts.phoneMobile}`}
      className="emergency-btn fixed bottom-[68px] right-5 sm:right-10 lg:bottom-6 lg:right-[8vw] z-50 h-12 flex items-center gap-2.5 px-4 border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 group"
      style={{ opacity: 0, pointerEvents: isShown ? "auto" : "none" }}
      aria-label="Экстренный вызов"
    >
      {/* Pulsing dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/50"
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2 bg-white"
        />
      </span>

      <PhoneCall
        className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform duration-300"
        strokeWidth={1.5}
      />

      {/* Text — desktop only */}
      <span className="hidden md:inline text-[10px] font-medium uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">
        {t("emergency.label")}
      </span>
    </a>
  );
}
