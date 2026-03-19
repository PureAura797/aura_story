"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Download } from "lucide-react";

interface CertificateItem {
  id: string;
  title: string;
  number: string;
  date: string;
  description: string;
  preview_url: string;
  download_url: string;
  published: boolean;
  sort_order: number;
}

export default function Certificate() {
  const containerRef = useRef<HTMLElement>(null);
  const [certs, setCerts] = useState<CertificateItem[]>([]);

  useEffect(() => {
    fetch("/api/certificates")
      .then((res) => res.json())
      .then((data) => setCerts(data))
      .catch(() => setCerts([]));
  }, []);

  useGSAP(() => {
    if (certs.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray(".cert-card") as HTMLElement[];

    ScrollTrigger.batch(cards, {
      start: "top 98%",
      onEnter: (batch) =>
        gsap.to(batch, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power3.out" }),
      once: true,
    });
  }, { scope: containerRef, dependencies: [certs] });

  if (certs.length === 0) return null;

  return (
    <section ref={containerRef} className="w-full flex flex-col items-end z-10 relative">
      <div className="text-right mb-4">
        <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--sand)" }}>
          Документы
        </p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">
          Лицензии
        </h2>
      </div>
      <p className="text-sm text-neutral-500 font-light text-right mb-12 max-w-md">
        Официальные разрешительные документы компании
      </p>

      <div className="flex flex-col gap-4 w-full max-w-4xl">
        {certs.map((cert) => (
          <div
            key={cert.id}
            className="cert-card opacity-0 translate-y-10 border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/10 transition-all duration-500 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-6 p-7">
              {/* Preview thumbnail */}
              {cert.preview_url && (
                <div className="shrink-0 w-full md:w-40 lg:w-48">
                  <div className="relative group overflow-hidden border border-white/[0.06]">
                    <img
                      src={cert.preview_url}
                      alt={cert.title}
                      className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="text-lg md:text-xl font-bold tracking-tighter mb-2">
                    {cert.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-neutral-600 border border-white/10 px-3 py-1">
                      № {cert.number}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.15em] text-neutral-600 border border-white/10 px-3 py-1">
                      от {cert.date}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                    {cert.description}
                  </p>
                </div>

                {/* Download button */}
                {cert.download_url && (
                  <a
                    href={cert.download_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-white/[0.06] border border-white/10 px-5 py-3 hover:bg-white/10 hover:border-white/20 transition-all duration-300 w-fit"
                  >
                    <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Скачать PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
