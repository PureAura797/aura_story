"use client";

import { useRef, useState } from "react";
import { Phone, Send, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useContacts } from "@/lib/contacts-context";

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();
  const contacts = useContacts();

  const [formData, setFormData] = useState({ name: "", phone: "", message: "", website: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation helpers
  const isNameValid = formData.name.trim().length >= 2;
  const isPhoneComplete = formData.phone.replace(/\D/g, "").length === 11;
  const isFormValid = isNameValid && isPhoneComplete;

  const fieldBorder = (field: string, isValid: boolean) => {
    if (!touched[field]) return 'border-[var(--border-strong)]';
    return isValid ? 'border-teal-500/40' : 'border-red-500/50';
  };

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;
    const items = sectionRef.current.querySelectorAll(".contact-reveal");
    gsap.set(items, { y: 60, opacity: 0 });
    ScrollTrigger.batch(items, {
      start: "top 98%",
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: "power3.out" }),
      once: true,
    });
  }, { scope: sectionRef });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.startsWith("7") || val.startsWith("8")) val = val.substring(1);
    let formatted = "+7";
    if (val.length > 0) formatted += ` (${val.substring(0, 3)}`;
    if (val.length > 3) formatted += `) ${val.substring(3, 6)}`;
    if (val.length > 6) formatted += `-${val.substring(6, 8)}`;
    if (val.length > 8) formatted += `-${val.substring(8, 10)}`;
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.website) return;
    setLoading(true);
    try {
      await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_type: "contact_form",
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          source: window.location.href,
          submitted_at: new Date().toISOString(),
        }),
      });
      setSuccess(true);
      gsap.fromTo(".success-check", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)", delay: 0.1 });
    } catch {
      alert(t("contact.error"));
    } finally {
      setLoading(false);
    }
  };


  return (
    <section ref={sectionRef} className="w-full flex flex-col items-start z-10 relative">
      <div className="contact-reveal mb-4">
        <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--accent)" }}>{t("contact.label")}</p>
        <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter">{t("contact.heading_1")}<br />{t("contact.heading_2")}</h2>
      </div>
      <p className="contact-reveal text-sm text-[var(--text-secondary)] font-light mb-16 max-w-md">{t("contact.desc")}</p>

      <div className="flex flex-col md:flex-row w-full gap-4">
        <div className="contact-reveal flex-1 border border-[var(--border)] bg-[var(--glass-card)] backdrop-blur-sm p-8 md:p-10">
          <p className="text-[var(--text-secondary)] text-lg font-light leading-relaxed max-w-md mb-8">{t("contact.info")}</p>
          <div className="flex flex-col gap-6 mb-8">
            <a href={`tel:${contacts.phone}`} className="group flex items-center gap-4 text-[var(--text-primary)] hover:opacity-80 transition-opacity">
              <Phone className="w-4 h-4 text-[var(--text-secondary)] group-hover:opacity-80 transition-opacity" strokeWidth={1.5} />
              <span className="text-lg tracking-wide">{contacts.phoneDisplay}</span>
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">24/7</span>
            </a>
            <a href={`mailto:${contacts.email}`} className="group flex items-center gap-4 text-[var(--text-primary)] hover:opacity-80 transition-opacity">
              <Send className="w-4 h-4 text-[var(--text-secondary)] group-hover:opacity-80 transition-opacity" strokeWidth={1.5} />
              <span className="text-lg tracking-wide">{contacts.email}</span>
            </a>
          </div>
          <div className="flex gap-6">
            <a href={contacts.max} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm uppercase tracking-widest font-medium">
              MAX <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
            </a>
            <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm uppercase tracking-widest font-medium">
              Telegram <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="contact-reveal flex-1 border border-[var(--border)] bg-[var(--glass-card)] backdrop-blur-sm p-8 md:p-10">
          {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-name" className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-medium">{t("contact.name")}</label>
                <input id="contact-name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} onBlur={() => setTouched({ ...touched, name: true })} placeholder="Иван Петрович" required className={`w-full bg-transparent border-b ${fieldBorder('name', isNameValid)} py-4 outline-none focus:border-[rgba(94,234,212,0.5)] focus-visible:outline-none transition-colors text-[var(--text-primary)] placeholder-[var(--placeholder)] text-lg`} />
                {touched.name && !isNameValid && <p className="text-red-400 text-[11px]">Минимум 2 символа</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-phone" className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-medium">{t("contact.phone")}</label>
                <input id="contact-phone" type="tel" value={formData.phone} onChange={handlePhoneChange} onBlur={() => setTouched({ ...touched, phone: true })} placeholder="+7 (___) ___-__-__" required className={`w-full bg-transparent border-b ${fieldBorder('phone', isPhoneComplete)} py-4 outline-none focus:border-[rgba(94,234,212,0.5)] focus-visible:outline-none transition-colors text-[var(--text-primary)] placeholder-[var(--placeholder)] text-lg`} />
                {touched.phone && !isPhoneComplete && <p className="text-red-400 text-[11px]">Введите полный номер телефона</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-message" className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-medium">{t("contact.message")}</label>
                <textarea id="contact-message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={t("contact.message_placeholder")} rows={2} className="w-full bg-transparent border-b border-[var(--border-strong)] py-4 outline-none focus:border-[rgba(94,234,212,0.5)] focus-visible:outline-none transition-colors text-[var(--text-primary)] placeholder-[var(--placeholder)] resize-none text-lg"></textarea>
              </div>
              <input type="text" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="absolute -left-[9999px] opacity-0" tabIndex={-1} autoComplete="off" />
              <button type="submit" disabled={loading || !isFormValid} className="btn-primary w-full py-4 mt-4 disabled:opacity-80 disabled:cursor-not-allowed">
                {loading ? (
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                ) : (
                  <><Send className="w-4 h-4" strokeWidth={1.5} />{t("contact.submit")}</>
                )}
              </button>
              <p className="text-[11px] text-[var(--text-muted)] tracking-wide">{t("contact.consent")}</p>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="success-check text-6xl mb-6">✓</div>
              <h3 className="text-3xl font-bold uppercase tracking-tighter mb-4">{t("contact.success_heading")}</h3>
              <p className="text-[var(--text-secondary)] text-sm tracking-wide">{t("contact.success_desc")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
