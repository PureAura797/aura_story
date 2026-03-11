"use client";

import { useState } from "react";
import { Phone, Menu, X, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import CallbackModal from "@/components/ui/CallbackModal";

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
      gsap.fromTo(
        ".mobile-link",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.8, ease: "power4.out", delay: 0.1 }
      );
    } else {
      setMenuOpen(false);
      document.body.style.overflow = "";
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          
          {/* Logo — just text, no icon */}
          <a href="/" className="text-sm font-bold uppercase tracking-[0.25em] text-white">
            PureAura
          </a>

          {/* Center: Navigation links */}
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-medium text-neutral-500 uppercase tracking-[0.2em]">
            <a href="#services" className="hover:text-white transition-colors duration-300">Услуги</a>
            <a href="#expertise" className="hover:text-white transition-colors duration-300">Экспертиза</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-300">Тарифы</a>
            <a href="#contact" className="hover:text-white transition-colors duration-300">Контакт</a>
          </div>

          {/* Right: Phone + CTA */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="tel:+74951203456"
              className="text-[11px] font-medium text-neutral-500 uppercase tracking-[0.15em] hover:text-white transition-colors flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
              8 (495) 120-34-56
            </a>
            <button 
              onClick={() => setModalOpen(true)}
              className="px-6 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Обратный звонок
            </button>
          </div>

          {/* Mobile burger */}
          <button 
            onClick={toggleMenu} 
            className="lg:hidden text-white cursor-pointer p-1 -mr-1" 
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen overlay */}
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 transition-all duration-500 flex flex-col items-start justify-center px-10 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-6">
          <a href="#services" onClick={toggleMenu} className="text-4xl font-bold uppercase tracking-tighter text-white hover:opacity-80 transition-opacity mobile-link">Услуги</a>
          <a href="#expertise" onClick={toggleMenu} className="text-4xl font-bold uppercase tracking-tighter text-white hover:opacity-80 transition-opacity mobile-link">Экспертиза</a>
          <a href="#pricing" onClick={toggleMenu} className="text-4xl font-bold uppercase tracking-tighter text-white hover:opacity-80 transition-opacity mobile-link">Тарифы</a>
          <a href="#contact" onClick={toggleMenu} className="text-4xl font-bold uppercase tracking-tighter text-white hover:opacity-80 transition-opacity mobile-link">Контакт</a>
          
          <div className="w-16 h-[1px] bg-white/20 my-4 mobile-link"></div>
          
          <a href="tel:+74951203456" className="text-lg text-neutral-400 hover:text-white flex items-center gap-3 transition-colors mobile-link">
            <Phone className="w-4 h-4" strokeWidth={1.5} />
            8 (495) 120-34-56
          </a>
          
          <button 
            onClick={() => { toggleMenu(); setModalOpen(true); }}
            className="text-lg hover:text-white flex items-center gap-3 transition-colors mobile-link cursor-pointer text-left"
            style={{ color: "var(--accent)" }}
          >
            Обратный звонок
          </button>
          
          <div className="flex gap-8 mt-2 mobile-link">
            <a href="https://wa.me/74951203456" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
              WhatsApp <ArrowUpRight className="w-3 h-3" strokeWidth={1.5} />
            </a>
            <a href="https://t.me/pureaura" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
              Telegram <ArrowUpRight className="w-3 h-3" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {/* Callback modal */}
      <CallbackModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
