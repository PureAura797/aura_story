"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function TrustMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const badges = Array.from({ length: 10 }, (_, i) => t(`marquee.${i + 1}`));

  useGSAP(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const totalWidth = track.scrollWidth / 2; // half because we duplicate

    gsap.to(track, {
      x: -totalWidth,
      duration: 40,
      ease: "none",
      repeat: -1,
    });
  }, { scope: trackRef });

  // Duplicate badges for seamless loop
  const allBadges = [...badges, ...badges];

  return (
    <div className="w-full overflow-hidden border-y border-white/[0.06] bg-white/[0.01] backdrop-blur-sm py-4 sm:py-5 relative z-10">
      {/* Fade edges — class name for theme override */}
      <div className="marquee-fade-left absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#0b0c0f] to-transparent z-10 pointer-events-none" />
      <div className="marquee-fade-right absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#0b0c0f] to-transparent z-10 pointer-events-none" />

      <div ref={trackRef} className="flex items-center gap-6 sm:gap-10 whitespace-nowrap w-max">
        {allBadges.map((badge, i) => (
          <div key={i} className="flex items-center gap-6 sm:gap-10">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-500">
              {badge}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--accent)] opacity-40 shrink-0" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}
