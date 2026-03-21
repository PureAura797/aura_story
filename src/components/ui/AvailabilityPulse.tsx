"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function AvailabilityPulse() {
  const [minutes, setMinutes] = useState(40);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutes(Math.floor(Math.random() * 20) + 30);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <span className="relative flex h-2 w-2 shrink-0">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ backgroundColor: "var(--sand)" }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: "var(--sand)" }}
        />
      </span>

      <span className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium text-[var(--text-secondary)]">
        <span style={{ color: "var(--sand)" }}>{t("hero.pulse_available")}</span>
        <span className="hidden sm:inline"> · {t("hero.pulse_arrival").replace("{min}", String(minutes))}</span>
      </span>
    </div>
  );
}
