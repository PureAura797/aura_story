"use client";

import { Phone, ArrowUpRight } from "lucide-react";
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

export default function Footer() {
  const { t } = useTranslation();
  const contacts = useContacts();

  return (
    <footer className="bg-black text-white relative z-[60] border-t border-white/10" role="contentinfo" aria-label="Footer">
      
      {/* Big brand statement */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 pt-24 pb-20">
        <Logo size="xl" ghost />
      </div>

      {/* Content grid */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-16 grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 border-t border-white/10 pt-12">
        
        {/* Col 1: About */}
        <div className="col-span-2 md:col-span-1">
          <p className="text-xs tracking-[0.2em] text-neutral-600 uppercase font-medium mb-6">{t("footer.about_label")}</p>
          <p className="text-sm text-neutral-500 font-light leading-relaxed max-w-xs">
            {t("footer.about_text")}
          </p>
        </div>

        {/* Col 2: Services */}
        <nav aria-label="Services navigation">
          <p className="text-xs tracking-[0.2em] text-neutral-600 uppercase font-medium mb-6">{t("footer.services_label")}</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => scrollToSection("services")} className="text-sm text-neutral-500 hover:text-white hover:underline underline-offset-4 transition-colors text-left cursor-pointer">{t("footer.services.1")}</button>
            <button onClick={() => scrollToSection("pricing")} className="text-sm text-neutral-500 hover:text-white hover:underline underline-offset-4 transition-colors text-left cursor-pointer">{t("footer.services.2")}</button>
            <button onClick={() => scrollToSection("portfolio")} className="text-sm text-neutral-500 hover:text-white hover:underline underline-offset-4 transition-colors text-left cursor-pointer">{t("footer.services.3")}</button>
            <button onClick={() => scrollToSection("reviews")} className="text-sm text-neutral-500 hover:text-white hover:underline underline-offset-4 transition-colors text-left cursor-pointer">{t("footer.services.4")}</button>
          </div>
        </nav>

        {/* Col 3: Company */}
        <nav aria-label="Company navigation">
          <p className="text-xs tracking-[0.2em] text-neutral-600 uppercase font-medium mb-6">{t("footer.company_label")}</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => scrollToSection("process")} className="text-sm text-neutral-500 hover:text-white hover:underline underline-offset-4 transition-colors text-left cursor-pointer">{t("footer.company.1")}</button>
            <button onClick={() => scrollToSection("equipment")} className="text-sm text-neutral-500 hover:text-white hover:underline underline-offset-4 transition-colors text-left cursor-pointer">{t("footer.company.2")}</button>
            <button onClick={() => scrollToSection("expertise")} className="text-sm text-neutral-500 hover:text-white hover:underline underline-offset-4 transition-colors text-left cursor-pointer">{t("footer.company.3")}</button>
            <button onClick={() => scrollToSection("faq")} className="text-sm text-neutral-500 hover:text-white hover:underline underline-offset-4 transition-colors text-left cursor-pointer">{t("footer.company.4")}</button>
          </div>
        </nav>

        {/* Col 4: Contact */}
        <address className="not-italic">
          <p className="text-xs tracking-[0.2em] text-neutral-600 uppercase font-medium mb-6">{t("footer.contact_label")}</p>
          <a
            href={`tel:${contacts.phone}`}
            className="group flex items-center gap-2 text-white hover:opacity-80 transition-opacity mb-4"
            aria-label={`Call ${contacts.phoneDisplay}`}
          >
            <Phone className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
            <span className="text-sm font-medium tracking-wide">{contacts.phoneDisplay}</span>
          </a>
          <p className="text-xs text-neutral-600 mb-6">{t("footer.contact_schedule")}</p>

          <div className="flex gap-6">
            <a
              href={contacts.max}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message on MAX"
              className="group text-xs text-neutral-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              MAX <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a
              href={contacts.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message on Telegram"
              className="group text-xs text-neutral-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              TG <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
        </address>
      </div>

      {/* Bottom bar */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-neutral-600 uppercase tracking-[0.15em]">
          {t("footer.copyright")}
        </p>
        <p className="text-[11px] text-neutral-500 uppercase tracking-[0.15em]">
          {t("footer.location")}
        </p>
      </div>
    </footer>
  );
}
