"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: string;
  experience: string;
  objects: string;
  specialization: string;
  avatar: string;
  color: string;
  published: boolean;
  sort_order: number;
}

export default function Team() {
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch(() => setMembers([]));
  }, []);

  useGSAP(() => {
    if (members.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray(".team-card") as HTMLElement[];
    gsap.set(cards, { y: 30, opacity: 0 });
    ScrollTrigger.batch(cards, {
      start: "top 98%",
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power3.out" }),
      once: true,
    });
  }, { scope: containerRef, dependencies: [members] });

  return (
    <section ref={containerRef}>
      <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--accent)" }}>{t("team.label")}</p>
      <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">{t("team.heading")}</h2>
      <p className="text-neutral-500 text-sm font-light mt-4 mb-12 max-w-md">{t("team.desc")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div key={member.id} className="team-card border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 p-6 group">
            <div className="flex items-center gap-4 mb-5">
              <div className="relative w-12 h-12 rounded-full p-[2px] shrink-0">
                <div className="absolute inset-0 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}44)` }} />
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[var(--bg-deep)]">
                  {member.avatar ? (
                    <Image src={member.avatar} alt={member.name} width={48} height={48} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105" unoptimized />
                  ) : (
                    <div className="w-full h-full bg-white/[0.06] flex items-center justify-center text-neutral-600 text-xs font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate group-hover:text-[var(--accent)] transition-colors duration-300">{member.name}</h3>
                <p className="text-[11px] text-neutral-500 truncate">{member.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ backgroundColor: "var(--accent)" }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: "var(--accent)" }} />
              </span>
              <span className="text-[10px] text-neutral-400 tracking-wide">{member.status}</span>
            </div>
            <div className="w-full h-px bg-white/5 mb-5" />
            <div className="flex items-center gap-6 mb-4">
              <div>
                <p className="text-lg font-bold text-white tracking-tight">{member.experience}</p>
                <p className="text-[9px] text-neutral-600 uppercase tracking-wider">{t("team.exp")}</p>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div>
                <p className="text-lg font-bold text-white tracking-tight">{member.objects}</p>
                <p className="text-[9px] text-neutral-600 uppercase tracking-wider">{t("team.objects")}</p>
              </div>
            </div>
            <p className="text-[10px] text-neutral-500 tracking-wide">{member.specialization}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
