"use client";

import { useRef, useEffect, useState } from "react";
import { X, Phone, Loader2, CheckCircle } from "lucide-react";
import gsap from "gsap";
import dynamic from "next/dynamic";

const PrivacyModal = dynamic(() => import("@/components/ui/PrivacyModal"), { ssr: false });

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallbackModal({ isOpen, onClose }: CallbackModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [agreed, setAgreed] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const isPhoneComplete = phone.replace(/\D/g, "").length === 11;
  const isNameValid = name.trim().length >= 2;
  const isFormValid = isNameValid && isPhoneComplete && agreed;

  const fieldBorder = (field: string, isValid: boolean) => {
    if (!touched[field]) return 'border-white/10';
    return isValid ? 'border-teal-500/40' : 'border-red-500/50';
  };

  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";

      // Overlay fade-in
      gsap.to(overlayRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.4, ease: "power2.out" });

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
    } else {
      document.body.style.overflow = "";

      // Panel — fast upward exit
      gsap.to(panelRef.current, { y: -20, opacity: 0, scale: 0.96, duration: 0.25, ease: "power3.in" });
      gsap.to(overlayRef.current, { opacity: 0, pointerEvents: "none", duration: 0.3, delay: 0.1 });

      // Reset state when closing
      setTimeout(() => {
        setSuccess(false);
        setName("");
        setPhone("");
        setTouched({});
        setAgreed(false);
      }, 400);
    }
  }, [isOpen]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.startsWith("7") || val.startsWith("8")) val = val.substring(1);
    let formatted = "+7";
    if (val.length > 0) formatted += ` (${val.substring(0, 3)}`;
    if (val.length > 3) formatted += `) ${val.substring(3, 6)}`;
    if (val.length > 6) formatted += `-${val.substring(6, 8)}`;
    if (val.length > 8) formatted += `-${val.substring(8, 10)}`;
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_type: "callback",
          name,
          phone,
          source: window.location.href,
          submitted_at: new Date().toISOString(),
        }),
      });
      setSuccess(true);
    } catch {
      alert("Ошибка отправки. Попробуйте позвонить нам.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center px-6"
      style={{ opacity: 0, pointerEvents: "none", perspective: "800px" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={panelRef}
        data-dark-ui
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

        {!success ? (
          <>
            {/* Header */}
            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-2">
              Обратный звонок
            </h3>
            <p className="text-sm text-neutral-500 font-light mb-8">
              Оставьте номер — перезвоним в течение 15 минут.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="cb-name" className="text-[11px] uppercase tracking-[0.2em] text-neutral-600 font-medium block mb-2">
                  Имя
                </label>
                <input
                  id="cb-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  placeholder="Как вас зовут"
                  className={`w-full bg-white/[0.04] border ${fieldBorder('name', isNameValid)} px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus-visible:outline-none transition-colors focus:border-[rgba(94,234,212,0.5)]`}
                />
                {touched.name && !isNameValid && <p className="text-red-400 text-[11px] mt-1">Минимум 2 символа</p>}
              </div>
              <div>
                <label htmlFor="cb-phone" className="text-[11px] uppercase tracking-[0.2em] text-neutral-600 font-medium block mb-2">
                  Телефон
                </label>
                <input
                  id="cb-phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={() => setTouched({ ...touched, phone: true })}
                  placeholder="+7 (___) ___-__-__"
                  required
                  className={`w-full bg-white/[0.04] border ${fieldBorder('phone', isPhoneComplete)} px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus-visible:outline-none transition-colors focus:border-[rgba(94,234,212,0.5)]`}
                />
                {touched.phone && !isPhoneComplete && <p className="text-red-400 text-[11px] mt-1">Введите полный номер</p>}
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="btn-primary w-full mt-2 px-8 py-4 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Phone className="w-4 h-4" strokeWidth={1.5} />
                    Перезвоните мне
                  </>
                )}
              </button>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 shrink-0 accent-teal-500 cursor-pointer"
                />
                <span className="text-[11px] text-neutral-500 leading-relaxed">
                  Я даю согласие на обработку{" "}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setPrivacyOpen(true); }}
                    className="text-teal-400/80 hover:text-teal-300 underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    персональных данных
                  </button>
                </span>
              </label>
              <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="w-12 h-12 text-teal-400 mb-4" strokeWidth={1.5} />
            <h3 className="text-2xl font-bold uppercase tracking-tighter mb-2">Заявка принята</h3>
            <p className="text-sm text-neutral-500 text-center">
              Мы перезвоним в течение 15 минут. Спасибо!
            </p>
            <button
              onClick={onClose}
              className="btn-primary mt-6 px-6 py-2.5"
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
