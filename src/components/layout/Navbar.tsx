"use client";

import { useState } from "react";
import { Phone, Menu, X, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import CallbackModal from "@/components/ui/CallbackModal";
import Logo from "@/components/ui/Logo";

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

  const toggleMenu = () => {
    if (!menuOpen) {
      setMenuOpen(true);
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-menu-open", "true");
      // Force navbar visible
      const nav = document.querySelector("nav");
      if (nav) gsap.to(nav, { y: 0, duration: 0.3, ease: "power3.inOut" });
      gsap.fromTo(
        ".mobile-link",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.8, ease: "power4.out", delay: 0.1 }
      );
    } else {
      setMenuOpen(false);
      document.body.style.overflow = "";
      document.body.removeAttribute("data-menu-open");
    }
  };

  /** Close mobile menu + scroll to section */
  const handleMobileNav = (id: string) => {
    toggleMenu();
    // Small delay so menu closes first, then scroll
    setTimeout(() => scrollToSection(id), 300);
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
            <button onClick={() => scrollToSection("services")} className="hover:text-white transition-colors duration-300 cursor-pointer">Услуги</button>
            <button onClick={() => scrollToSection("expertise")} className="hover:text-white transition-colors duration-300 cursor-pointer">Экспертиза</button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-white transition-colors duration-300 cursor-pointer">Тарифы</button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-white transition-colors duration-300 cursor-pointer">Контакт</button>
          </div>

          {/* Right: Phone + CTA — only visible when burger is hidden (lg+) */}
          <div className="hidden lg:flex items-center gap-8">
            <a
              href="tel:+74951203456"
              className="text-[11px] font-medium text-neutral-500 uppercase tracking-[0.15em] hover:text-white transition-colors flex items-center gap-2"
              aria-label="Позвонить 8 495 120-34-56"
            >
              <Phone className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
              8 (495) 120-34-56
            </a>
            <button 
              onClick={() => setModalOpen(true)}
              className="px-6 py-2.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:brightness-110 hover:scale-[1.02] cursor-pointer"
              style={{ backgroundColor: "var(--accent)", color: "var(--bg-deep)" }}
            >
              Обратный звонок
            </button>
          </div>

          {/* Mobile burger — z-[70] stays above overlay */}
          <button 
            onClick={toggleMenu} 
            className="lg:hidden text-white cursor-pointer p-1 -mr-1 relative z-[70]" 
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-[60] transition-all duration-500 flex flex-col items-start justify-center px-10 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-6">
          <button onClick={() => handleMobileNav("services")} className="text-4xl font-bold uppercase tracking-tighter text-white hover:opacity-80 transition-opacity mobile-link text-left cursor-pointer">Услуги</button>
          <button onClick={() => handleMobileNav("expertise")} className="text-4xl font-bold uppercase tracking-tighter text-white hover:opacity-80 transition-opacity mobile-link text-left cursor-pointer">Экспертиза</button>
          <button onClick={() => handleMobileNav("pricing")} className="text-4xl font-bold uppercase tracking-tighter text-white hover:opacity-80 transition-opacity mobile-link text-left cursor-pointer">Тарифы</button>
          <button onClick={() => handleMobileNav("contact")} className="text-4xl font-bold uppercase tracking-tighter text-white hover:opacity-80 transition-opacity mobile-link text-left cursor-pointer">Контакт</button>
          
          <div className="w-16 h-[1px] bg-white/20 my-4 mobile-link"></div>
          
          <a href="tel:+74951203456" className="text-lg text-neutral-400 hover:text-white flex items-center gap-3 transition-colors mobile-link" aria-label="Позвонить 8 495 120-34-56">
            <Phone className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            8 (495) 120-34-56
          </a>
          
          <button 
            onClick={() => { toggleMenu(); setModalOpen(true); }}
            className="px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:brightness-110 hover:scale-[1.02] cursor-pointer mt-2"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg-deep)" }}
          >
            Обратный звонок
          </button>
          
          <div className="flex gap-8 mt-2 mobile-link">
            <a href="https://wa.me/74951203456" target="_blank" rel="noopener noreferrer" aria-label="Написать в WhatsApp" className="text-sm text-neutral-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
              WhatsApp <ArrowUpRight className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a href="https://t.me/pureaura" target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram" className="text-sm text-neutral-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
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
