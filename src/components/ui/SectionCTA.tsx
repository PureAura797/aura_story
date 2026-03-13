"use client";

import { PhoneCall } from "lucide-react";

interface SectionCTAProps {
  /** Variant: 'call' shows phone, 'form' scrolls to contact form */
  variant?: "call" | "form";
  /** Custom label text */
  label?: string;
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function SectionCTA({ variant = "call", label }: SectionCTAProps) {
  if (variant === "form") {
    return (
      <div className="w-full border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
        <p className="text-[11px] sm:text-xs text-neutral-500 font-light">
          {label || "Нужна профессиональная помощь? Оставьте заявку — перезвоним за 30 секунд."}
        </p>
        <button
          onClick={() => scrollToSection("contact")}
          className="shrink-0 px-5 sm:px-6 py-2.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:brightness-110 hover:scale-[1.02] cursor-pointer"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg-deep)" }}
        >
          Получить смету
        </button>
      </div>
    );
  }

  return (
    <div className="w-full border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
      <p className="text-[11px] sm:text-xs text-neutral-500 font-light">
        {label || "Нужна экстренная помощь? Звоните — бригада выедет в течение часа."}
      </p>
      <a
        href="tel:+74951203456"
        className="shrink-0 flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
        style={{ backgroundColor: "var(--accent)", color: "var(--bg-deep)" }}
        aria-label="Позвонить: 8 495 120-34-56"
      >
        <PhoneCall className="w-3 h-3" strokeWidth={2} aria-hidden="true" />
        8 (495) 120-34-56
      </a>
    </div>
  );
}
