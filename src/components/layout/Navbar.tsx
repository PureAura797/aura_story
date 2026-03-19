"use client";

import { useState, useRef, useCallback } from "react";
import { Phone, Menu, X, ArrowUpRight, Globe } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import CallbackModal from "@/components/ui/CallbackModal";
import Logo from "@/components/ui/Logo";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useContacts } from "@/lib/contacts-context";

/** Scroll to section by id — without polluting the URL hash */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { t, locale, setLocale } = useTranslation();
  const contacts = useContacts();
  const isAnimating = useRef(false);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const nav = document.querySelector("nav");
    if (nav) {
      ScrollTrigger.create({
        start: 100,
        onUpdate: (self) => {
          // Keep navbar visible when burger menu is open
          if (document.body.hasAttribute("data-menu-open")) {
            gsap.to(nav, { y: 0, duration: 0.3, ease: "power3.inOut" });
            return;
          }
          // Hide navbar when a story modal is open
          if (document.body.hasAttribute("data-modal-open")) {
            gsap.to(nav, { y: -100, duration: 0.3, ease: "power3.inOut" });
            return;
          }
          if (self.direction === 1 && self.scroll() > 100) {
            gsap.to(nav, { y: -100, duration: 0.5, ease: "power3.inOut" });
          } else {
            gsap.to(nav, { y: 0, duration: 0.5, ease: "power3.inOut" });
          }
        },
      });
    }
  }, []);

  const openMenu = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setMenuOpen(true);
    document.body.style.overflow = "hidden";
    document.body.setAttribute("data-menu-open", "true");

    // Force navbar visible
    const nav = document.querySelector("nav");
    if (nav) gsap.to(nav, { y: 0, duration: 0.3, ease: "power3.inOut" });

    const overlay = overlayRef.current;
    if (!overlay) return;

    // Circle reveal from top-right (burger icon position)
    const tl = gsap.timeline({
      onComplete: () => { isAnimating.current = false; },
    });

    tl.set(overlay, {
      clipPath: "circle(0% at calc(100% - 32px) 28px)",
      visibility: "visible",
      opacity: 1,
    });

    tl.to(overlay, {
      clipPath: "circle(150% at calc(100% - 32px) 28px)",
      duration: 0.7,
      ease: "power3.inOut",
    });

    // Stagger links in
    tl.fromTo(
      ".mobile-link",
      { y: 50, opacity: 0, filter: "blur(8px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.06,
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.25"
    );

    // Divider line grows from left
    tl.fromTo(
      ".menu-divider",
      { scaleX: 0 },
      { scaleX: 1, duration: 0.4, ease: "power2.out" },
      "-=0.3"
    );
  }, []);

  const closeMenu = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        setMenuOpen(false);
        document.body.style.overflow = "";
        document.body.removeAttribute("data-menu-open");
        gsap.set(overlay, { visibility: "hidden" });
      },
    });

    // Fade links out fast
    tl.to(".mobile-link, .menu-divider", {
      opacity: 0,
      y: -20,
      duration: 0.2,
      ease: "power2.in",
      stagger: 0.02,
    });

    // Circle contract back
    tl.to(overlay, {
      clipPath: "circle(0% at calc(100% - 32px) 28px)",
      duration: 0.5,
      ease: "power3.inOut",
    }, "-=0.1");
  }, []);

  const toggleMenu = () => {
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  /** Close mobile menu + scroll to section */
  const handleMobileNav = (id: string) => {
    closeMenu();
    setTimeout(() => scrollToSection(id), 600);
  };

  return (
    <>
      <nav className={`fixed top-0 w-full border-b border-white/10 bg-black/60 backdrop-blur-sm ${menuOpen ? "z-[70]" : "z-50"}`} aria-label="Главная навигация">
        <div className="w-full px-5 sm:px-10 lg:px-[8vw] py-4 flex items-center justify-between">
          
          {/* Logo — just text, no icon */}
          <button onClick={() => scrollToSection("hero")} className="text-white cursor-pointer" aria-label="На главную">
            <Logo size="sm" />
          </button>

          {/* Center: Navigation links */}
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-medium text-neutral-500 uppercase tracking-[0.2em]">
            <button onClick={() => scrollToSection("services")} className="hover:text-white transition-colors duration-300 cursor-pointer">{t("nav.services")}</button>
            <button onClick={() => scrollToSection("expertise")} className="hover:text-white transition-colors duration-300 cursor-pointer">{t("nav.expertise")}</button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-white transition-colors duration-300 cursor-pointer">{t("nav.pricing")}</button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-white transition-colors duration-300 cursor-pointer">{t("nav.contact")}</button>
          </div>

          {/* Right: Phone + CTA — only visible when burger is hidden (lg+) */}
          <div className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => setLocale(locale === "ru" ? "en" : "ru")}
              className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 uppercase tracking-[0.15em] hover:text-white transition-colors cursor-pointer"
              aria-label="Switch language"
            >
              <Globe className="w-3.5 h-3.5" strokeWidth={1.5} />
              {t("lang.switch")}
            </button>
            <a
              href={`tel:${contacts.phone}`}
              className="text-[11px] font-medium text-neutral-500 uppercase tracking-[0.15em] hover:text-white transition-colors flex items-center gap-2"
              aria-label={`Позвонить ${contacts.phoneDisplay}`}
            >
              <Phone className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
              {contacts.phoneDisplay}
            </a>
            <button 
              onClick={() => setModalOpen(true)}
              className="btn-primary px-6 py-2.5"
            >
              {t("nav.callback")}
            </button>
          </div>

          <button 
            onClick={toggleMenu} 
            className="lg:hidden text-white cursor-pointer p-3 -mr-3 relative z-[70]" 
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Fullscreen overlay — clip-path animated */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[60] flex flex-col items-start justify-center px-10"
        style={{ visibility: "hidden", clipPath: "circle(0% at calc(100% - 32px) 28px)" }}
      >
        <div className="flex flex-col gap-6">
          <button onClick={() => handleMobileNav("services")} className="text-4xl font-bold uppercase tracking-tighter text-white hover:opacity-80 transition-opacity mobile-link text-left cursor-pointer">{t("nav.services")}</button>
          <button onClick={() => handleMobileNav("expertise")} className="text-4xl font-bold uppercase tracking-tighter text-white hover:opacity-80 transition-opacity mobile-link text-left cursor-pointer">{t("nav.expertise")}</button>
          <button onClick={() => handleMobileNav("pricing")} className="text-4xl font-bold uppercase tracking-tighter text-white hover:opacity-80 transition-opacity mobile-link text-left cursor-pointer">{t("nav.pricing")}</button>
          <button onClick={() => handleMobileNav("contact")} className="text-4xl font-bold uppercase tracking-tighter text-white hover:opacity-80 transition-opacity mobile-link text-left cursor-pointer">{t("nav.contact")}</button>
          
          <div className="w-16 h-[1px] bg-white/20 my-4 menu-divider origin-left"></div>
          
          <a href={`tel:${contacts.phone}`} className="text-lg text-neutral-400 hover:text-white flex items-center gap-3 transition-colors mobile-link" aria-label={`Позвонить ${contacts.phoneDisplay}`}>
            <Phone className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            {contacts.phoneDisplay}
          </a>
          
          <button
            onClick={() => setLocale(locale === "ru" ? "en" : "ru")}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mobile-link cursor-pointer"
          >
            <Globe className="w-4 h-4" strokeWidth={1.5} />
            {t("lang.switch")}
          </button>

          <button 
            onClick={() => { closeMenu(); setTimeout(() => setModalOpen(true), 600); }}
            className="btn-primary px-6 py-3 text-sm mt-2 mobile-link"
          >
            {t("nav.callback")}
          </button>
          
          <div className="flex gap-8 mt-2 mobile-link">
            <a href={contacts.max} target="_blank" rel="noopener noreferrer" aria-label="Написать в MAX" className="text-sm text-neutral-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
              MAX <ArrowUpRight className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram" className="text-sm text-neutral-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
              Telegram <ArrowUpRight className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* Callback modal */}
      <CallbackModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

