"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import SectionCTA from "@/components/ui/SectionCTA";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Portfolio() {
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  const projects = [
    { type: t("portfolio.1.type"), area: t("portfolio.1.area"), time: t("portfolio.1.time"), description: t("portfolio.1.desc"), beforeImg: "/images/portfolio/hoarder_before.png", afterImg: "/images/portfolio/hoarder_after.png" },
    { type: t("portfolio.2.type"), area: t("portfolio.2.area"), time: t("portfolio.2.time"), description: t("portfolio.2.desc"), beforeImg: "/images/portfolio/hoarder_before.png", afterImg: "/images/portfolio/hoarder_after.png" },
    { type: t("portfolio.3.type"), area: t("portfolio.3.area"), time: t("portfolio.3.time"), description: t("portfolio.3.desc"), beforeImg: "/images/portfolio/fire_before.png", afterImg: "/images/portfolio/fire_after.png" },
    { type: t("portfolio.4.type"), area: t("portfolio.4.area"), time: t("portfolio.4.time"), description: t("portfolio.4.desc"), beforeImg: "/images/portfolio/fire_before.png", afterImg: "/images/portfolio/fire_after.png" },
  ];

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray(".portfolio-card") as HTMLElement[];
    ScrollTrigger.batch(cards, {
      start: "top 98%",
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power2.out" }),
      once: true,
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full flex flex-col items-end z-10 relative">
      <div className="text-right mb-4">
        <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--accent)" }}>{t("portfolio.label")}</p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">{t("portfolio.heading_1")}<br />{t("portfolio.heading_2")}</h2>
      </div>
      <p className="text-sm text-neutral-500 font-light text-right mb-16 max-w-md">{t("portfolio.desc")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {projects.map((project, idx) => (
          <div key={idx} className="portfolio-card opacity-0 translate-y-10 relative overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 group hover:border-white/20 transition-all duration-500">
            <div className="flex gap-2 mb-6">
              <div className="flex-1 h-40 bg-white/[0.04] border border-white/5 relative overflow-hidden group/img">
                {project.beforeImg && <Image src={project.beforeImg} alt={`${project.type} - ${t("portfolio.before")}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover opacity-60 mix-blend-luminosity group-hover/img:opacity-100 group-hover/img:mix-blend-normal transition-all duration-700" />}
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[9px] uppercase tracking-widest text-neutral-300 z-10">{t("portfolio.before")}</span>
              </div>
              <div className="flex-1 h-40 bg-white/[0.04] border border-white/5 relative overflow-hidden group/img">
                {project.afterImg && <Image src={project.afterImg} alt={`${project.type} - ${t("portfolio.after")}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover opacity-60 mix-blend-luminosity group-hover/img:opacity-100 group-hover/img:mix-blend-normal transition-all duration-700" />}
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[9px] uppercase tracking-widest text-neutral-300 z-10">{t("portfolio.after")}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: "var(--accent)" }}>{project.type}</span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed mb-4">{project.description}</p>
            <div className="flex gap-4 text-[10px] uppercase tracking-[0.15em] text-neutral-600 font-medium">
              <span>{project.area}</span>
              <span>·</span>
              <span>{project.time}</span>
            </div>
          </div>
        ))}
      </div>

      <SectionCTA variant="call" label={t("portfolio.cta")} />
    </section>
  );
}
