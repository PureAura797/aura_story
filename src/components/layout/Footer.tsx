"use client";

import { Phone, ArrowUpRight } from "lucide-react";
import Logo from "@/components/ui/Logo";

/** Scroll to section by id — without polluting the URL hash */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function Footer() {
  return (
    <footer className="bg-black text-white relative z-[60] border-t border-white/10" role="contentinfo" aria-label="Подвал сайта PureAura">
      
      {/* Big brand statement */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 pt-24 pb-20">
        <Logo size="xl" ghost />
      </div>

      {/* Content grid */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-16 grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 border-t border-white/10 pt-12">
        
        {/* Col 1: About */}
        <div className="col-span-2 md:col-span-1">
          <p className="text-xs tracking-[0.2em] text-neutral-600 uppercase font-medium mb-6">О КОМПАНИИ</p>
          <p className="text-sm text-neutral-500 font-light leading-relaxed max-w-xs">
            Профессиональная уборка после смерти, дезинфекция и биологическая очистка помещений в Москве. Конфиденциально, круглосуточно.
          </p>
        </div>

        {/* Col 2: Services */}
        <nav aria-label="Навигация по услугам">
          <p className="text-xs tracking-[0.2em] text-neutral-600 uppercase font-medium mb-6">УСЛУГИ</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => scrollToSection("services")} className="text-sm text-neutral-500 hover:text-white transition-colors text-left cursor-pointer">Уборка после смерти и дезинфекция</button>
            <button onClick={() => scrollToSection("pricing")} className="text-sm text-neutral-500 hover:text-white transition-colors text-left cursor-pointer">Цены на уборку</button>
            <button onClick={() => scrollToSection("portfolio")} className="text-sm text-neutral-500 hover:text-white transition-colors text-left cursor-pointer">Кейсы до и после</button>
            <button onClick={() => scrollToSection("reviews")} className="text-sm text-neutral-500 hover:text-white transition-colors text-left cursor-pointer">Отзывы клиентов</button>
          </div>
        </nav>

        {/* Col 3: Company */}
        <nav aria-label="Навигация по компании">
          <p className="text-xs tracking-[0.2em] text-neutral-600 uppercase font-medium mb-6">КОМПАНИЯ</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => scrollToSection("process")} className="text-sm text-neutral-500 hover:text-white transition-colors text-left cursor-pointer">Протокол дезинфекции</button>
            <button onClick={() => scrollToSection("equipment")} className="text-sm text-neutral-500 hover:text-white transition-colors text-left cursor-pointer">Оборудование для обработки</button>
            <button onClick={() => scrollToSection("expertise")} className="text-sm text-neutral-500 hover:text-white transition-colors text-left cursor-pointer">Экспертиза</button>
            <button onClick={() => scrollToSection("faq")} className="text-sm text-neutral-500 hover:text-white transition-colors text-left cursor-pointer">Частые вопросы</button>
          </div>
        </nav>

        {/* Col 4: Contact */}
        <address className="not-italic">
          <p className="text-xs tracking-[0.2em] text-neutral-600 uppercase font-medium mb-6">ЭКСТРЕННАЯ ЛИНИЯ</p>
          <a
            href="tel:+74951203456"
            className="group flex items-center gap-2 text-white hover:opacity-80 transition-opacity mb-4"
            aria-label="Позвонить по телефону 8 495 120-34-56"
          >
            <Phone className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
            <span className="text-sm font-medium tracking-wide">8 (495) 120-34-56</span>
          </a>
          <p className="text-xs text-neutral-600 mb-6">Круглосуточно. 365 дней. Москва и МО.</p>

          <div className="flex gap-6">
            <a
              href="https://max.ru/pureaura"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в MAX"
              className="group text-xs text-neutral-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              MAX <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a
              href="https://t.me/pureaura"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в Telegram"
              className="group text-xs text-neutral-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              TG <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
        </address>
      </div>

      {/* Bottom bar */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-neutral-600 uppercase tracking-[0.15em]">
          © 2026 PureAura Remediation Inc.
        </p>
        <p className="text-[10px] text-neutral-700 uppercase tracking-[0.15em]">
          Москва и Московская область
        </p>
      </div>
    </footer>
  );
}
