"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Equipment() {
  const containerRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const { t } = useTranslation();

  const equipment = [
    { image: "/equipment/ozone.webp", color: "#5eead4" },
    { image: "/equipment/hydroxyl.webp", color: "#38bdf8" },
    { image: "/equipment/fogger.webp", color: "#d4a574" },
    { image: "/equipment/atp.webp", color: "#a78bfa" },
    { image: "/equipment/dehumidifier.webp", color: "#fb7185" },
    { image: "/equipment/ppe.webp", color: "#14b8a6" },
  ].map((item, i) => ({
    ...item,
    specs: t(`equipment.${i + 1}.specs`),
    name: t(`equipment.${i + 1}.name`),
    purpose: t(`equipment.${i + 1}.purpose`),
    tag: t(`equipment.${i + 1}.tag`),
    details: t(`equipment.${i + 1}.details`),
  }));

  const toggleExpand = (idx: number) => setExpanded((prev) => (prev === idx ? null : idx));

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray(".equip-card") as HTMLElement[];
    gsap.set(cards, { y: 40, opacity: 0, scale: 0.95 });
    ScrollTrigger.batch(cards, {
      start: "top 98%",
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.6, ease: "power3.out" }),
      once: true,
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full flex flex-col items-start z-10 relative">
      <div className="mb-4">
        <p className="text-[11px] tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--accent)" }}>{t("equipment.label")}</p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">{t("equipment.heading")}</h2>
      </div>
      <p className="text-sm text-[var(--text-secondary)] font-light mb-12 max-w-lg">{t("equipment.desc")}</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 w-full items-start">
        {equipment.map((item, idx) => (
          <div key={idx} className="equip-card card-lift group flex flex-col border border-[var(--border)] bg-[var(--glass-card)] backdrop-blur-sm overflow-hidden hover:border-[var(--border-strong)] transition-all duration-500">
            <div className="flex items-center justify-between px-3 py-2.5 md:px-4 md:py-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: `${item.color}20`, border: `1px solid ${item.color}30` }}>
                  <span className="text-[11px] font-bold" style={{ color: item.color }}>{String(idx + 1).padStart(2, "0")}</span>
                </div>
                <span className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider truncate">{item.tag}</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors shrink-0" strokeWidth={1.5} />
            </div>
            <div className="relative aspect-square bg-black/40 overflow-hidden">
              <Image src={item.image} alt={`${item.name} — ${item.purpose}`} fill className="object-contain p-4 md:p-6 transition-transform duration-700 ease-out group-hover:scale-110" sizes="(max-width: 768px) 50vw, 33vw" loading="lazy" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${item.color}08 0%, transparent 70%)` }} />
              <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm backdrop-blur-md" style={{ color: item.color, backgroundColor: `${item.color}12`, border: `1px solid ${item.color}20` }}>{item.specs}</span>
              </div>
            </div>
            <div className="px-3 pt-3 md:px-4 md:pt-3">
              <h3 className="text-xs md:text-sm font-bold text-[var(--text-primary)] tracking-tight mb-1 group-hover:text-[var(--accent)] transition-colors duration-300">{item.name}</h3>
              <p className="text-[11px] md:text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">{item.purpose}</p>
            </div>
            <div className="px-3 pb-3 md:px-4 md:pb-4 pt-2">
              <button onClick={() => toggleExpand(idx)} className="mag-btn w-full flex items-center justify-center gap-1.5 py-2 rounded-sm border border-[var(--border)] bg-[var(--glass-card)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-strong)] transition-all duration-300 cursor-pointer group/btn">
                <span className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider group-hover/btn:text-[var(--text-primary)] transition-colors">{expanded === idx ? t("equipment.less") : t("equipment.more")}</span>
                <ChevronDown className={`w-3 h-3 text-[var(--text-muted)] group-hover/btn:text-[var(--text-secondary)] transition-all duration-300 ${expanded === idx ? "rotate-180" : ""}`} strokeWidth={1.5} />
              </button>
              <AnimatePresence>
                {expanded === idx && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                    <div className="pt-3 border-t border-[var(--border)] mt-3">
                      <p className="text-[11px] md:text-xs text-[var(--text-secondary)] leading-relaxed">{item.details}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
