"use client";

import { useRef, useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { EmptyState, ErrorState, SkeletonFAQ } from "@/components/ui/DataStates";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  published: boolean;
  sort_order: number;
}

export default function FAQ() {
  const containerRef = useRef<HTMLElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { t } = useTranslation();
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchFaq = () => {
    setDataLoading(true);
    setError(false);
    fetch("/api/faq")
      .then((res) => res.json())
      .then((data) => setFaqItems(data))
      .catch(() => setError(true))
      .finally(() => setDataLoading(false));
  };

  useEffect(() => { fetchFaq(); }, []);

  useGSAP(() => {
    if (faqItems.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);
    const items = gsap.utils.toArray(".faq-card") as HTMLElement[];

    ScrollTrigger.batch(items, {
      start: "top 98%",
      onEnter: (batch) =>
        gsap.to(batch, { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: "power3.out" }),
      once: true,
    });
  }, { scope: containerRef, dependencies: [faqItems] });

  const toggleItem = (idx: number) => {
    const answerId = `faq-answer-${idx}`;
    const el = document.getElementById(answerId);
    if (!el) return;

    if (openIdx === idx) {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.4, ease: "power3.inOut", onComplete: () => setOpenIdx(null) });
    } else {
      if (openIdx !== null) {
        const prevEl = document.getElementById(`faq-answer-${openIdx}`);
        if (prevEl) gsap.to(prevEl, { height: 0, opacity: 0, duration: 0.3, ease: "power3.inOut" });
      }
      setOpenIdx(idx);
      gsap.set(el, { height: "auto", opacity: 1 });
      gsap.from(el, { height: 0, opacity: 0, duration: 0.5, ease: "power3.out" });
    }
  };

  return (
    <section ref={containerRef} className="w-full flex flex-col items-start z-10 relative">
      <div className="mb-4">
        <p className="text-xs tracking-[0.2em] text-neutral-500 uppercase font-medium mb-4">{t("faq.label")}</p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">{t("faq.heading")}</h2>
      </div>
      <p className="text-sm text-neutral-500 font-light mb-16 max-w-md">
        {t("faq.desc")}
      </p>

      {dataLoading ? (
        <SkeletonFAQ />
      ) : error ? (
        <ErrorState onRetry={fetchFaq} />
      ) : faqItems.length === 0 ? (
        <EmptyState title="Нет вопросов" />
      ) : (
      <div
        className="flex flex-col w-full max-w-3xl gap-3"
        role="region"
        aria-label={t("faq.heading")}
        onKeyDown={(e) => {
          const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('.faq-card > button');
          if (!buttons || buttons.length === 0) return;
          const idx = Array.from(buttons).indexOf(e.target as HTMLButtonElement);
          if (idx === -1) return;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            buttons[(idx + 1) % buttons.length]?.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            buttons[(idx - 1 + buttons.length) % buttons.length]?.focus();
          } else if (e.key === 'Home') {
            e.preventDefault();
            buttons[0]?.focus();
          } else if (e.key === 'End') {
            e.preventDefault();
            buttons[buttons.length - 1]?.focus();
          }
        }}
      >
        {faqItems.map((item, idx) => (
          <div
            key={item.id}
            className={`faq-card opacity-0 translate-y-10 border bg-white/[0.03] backdrop-blur-sm transition-all duration-500 ${
              openIdx === idx ? "border-[rgba(94,234,212,0.2)]" : "border-white/10 hover:border-white/20"
            }`}
          >
            <button
              onClick={() => toggleItem(idx)}
              className="w-full px-8 py-6 flex items-center justify-between text-left cursor-pointer group"
              aria-expanded={openIdx === idx}
              aria-controls={`faq-answer-${idx}`}
            >
              <h3 className="text-lg md:text-xl font-bold tracking-tight pr-8 transition-colors duration-300" style={openIdx === idx ? { color: "var(--accent)" } : {}}>
                {item.question}
              </h3>
              {openIdx === idx ? (
                <Minus className="w-5 h-5 shrink-0" strokeWidth={1.5} style={{ color: "var(--accent)" }} aria-hidden="true" />
              ) : (
                <Plus className="w-5 h-5 text-neutral-500 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>
            <div id={`faq-answer-${idx}`} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
              <p className="text-neutral-400 text-sm leading-relaxed px-8 pb-6 pr-16">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
      )}
    </section>
  );
}
