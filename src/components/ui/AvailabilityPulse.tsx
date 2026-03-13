"use client";

import { useEffect, useState } from "react";

export default function AvailabilityPulse() {
  const [minutes, setMinutes] = useState(40);

  useEffect(() => {
    // Randomize slightly every 30s to feel alive
    const interval = setInterval(() => {
      setMinutes(Math.floor(Math.random() * 20) + 30); // 30–50 min
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      {/* Live pulse dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ backgroundColor: "#22c55e" }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: "#22c55e" }}
        />
      </span>

      <span className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium text-neutral-500">
        <span className="text-green-400">Бригада свободна</span>
        <span className="hidden sm:inline"> · Выезд ~{minutes} мин</span>
      </span>
    </div>
  );
}
