import { Phone, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white relative z-[60] border-t border-white/10">
      
      {/* Big brand statement */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 pt-24 pb-20">
        <p className="text-[10vw] md:text-[8vw] leading-[0.9] font-bold uppercase tracking-tighter text-white/[0.04]">
          PURE<br />AURA.
        </p>
      </div>

      {/* Content grid */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-16 grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 border-t border-white/10 pt-12">
        
        {/* Col 1: About */}
        <div className="col-span-2 md:col-span-1">
          <p className="text-xs tracking-[0.2em] text-neutral-600 uppercase font-medium mb-6">О КОМПАНИИ</p>
          <p className="text-sm text-neutral-500 font-light leading-relaxed max-w-xs">
            Узкоспециализированные услуги биологической очистки. Восстанавливаем среду, проявляя уважение.
          </p>
        </div>

        {/* Col 2: Services */}
        <div>
          <p className="text-xs tracking-[0.2em] text-neutral-600 uppercase font-medium mb-6">УСЛУГИ</p>
          <div className="flex flex-col gap-3">
            <a href="#services" className="text-sm text-neutral-500 hover:text-white transition-colors">Все услуги</a>
            <a href="#pricing" className="text-sm text-neutral-500 hover:text-white transition-colors">Тарифы</a>
            <a href="#portfolio" className="text-sm text-neutral-500 hover:text-white transition-colors">Кейсы</a>
            <a href="#reviews" className="text-sm text-neutral-500 hover:text-white transition-colors">Отзывы</a>
          </div>
        </div>

        {/* Col 3: Company */}
        <div>
          <p className="text-xs tracking-[0.2em] text-neutral-600 uppercase font-medium mb-6">КОМПАНИЯ</p>
          <div className="flex flex-col gap-3">
            <a href="#process" className="text-sm text-neutral-500 hover:text-white transition-colors">Процесс работы</a>
            <a href="#equipment" className="text-sm text-neutral-500 hover:text-white transition-colors">Оборудование</a>
            <a href="#expertise" className="text-sm text-neutral-500 hover:text-white transition-colors">Экспертиза</a>
            <a href="#faq" className="text-sm text-neutral-500 hover:text-white transition-colors">FAQ</a>
          </div>
        </div>

        {/* Col 4: Contact */}
        <div>
          <p className="text-xs tracking-[0.2em] text-neutral-600 uppercase font-medium mb-6">ЭКСТРЕННАЯ ЛИНИЯ</p>
          <a
            href="tel:+74951203456"
            className="group flex items-center gap-2 text-white hover:opacity-80 transition-opacity mb-4"
          >
            <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="text-sm font-medium tracking-wide">8 (495) 120-34-56</span>
          </a>
          <p className="text-xs text-neutral-600 mb-6">Круглосуточно. 365 дней.</p>

          <div className="flex gap-6">
            <a
              href="https://wa.me/74951203456"
              target="_blank"
              rel="noopener noreferrer"
              className="group text-xs text-neutral-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              WA <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
            </a>
            <a
              href="https://t.me/pureaura"
              target="_blank"
              rel="noopener noreferrer"
              className="group text-xs text-neutral-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              TG <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
            </a>
          </div>
        </div>
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
