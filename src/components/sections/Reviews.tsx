"use client";

import { useRef, useState, useEffect } from "react";
import { Star } from "lucide-react";
import { EmptyState, ErrorState, SkeletonCards } from "@/components/ui/DataStates";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import SectionCTA from "@/components/ui/SectionCTA";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface Review {
  id: string;
  author: string;
  service: string;
  text: string;
  date_label: string;
  rating: number;
  published: boolean;
  sort_order: number;
}

export default function Reviews() {
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchReviews = () => {
    setDataLoading(true);
    setError(false);
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(() => setError(true))
      .finally(() => setDataLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  useGSAP(() => {
    if (reviews.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);
    const items = gsap.utils.toArray(".review-card, [data-animate]") as HTMLElement[];
    ScrollTrigger.batch(items, {
      start: "top 98%",
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power2.out" }),
      once: true,
    });
  }, { scope: containerRef, dependencies: [reviews] });

  return (
    <section ref={containerRef} className="w-full flex flex-col items-start z-10 relative">
      <div className="mb-4">
        <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--accent)" }}>{t("reviews.label")}</p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">{t("reviews.heading")}</h2>
      </div>
      <p className="text-sm text-[var(--text-secondary)] font-light mb-12 max-w-lg">{t("reviews.desc")}</p>

      <div className="opacity-0 translate-y-10 flex flex-wrap gap-6 mb-8 w-full max-w-3xl" data-animate="fade-up">
        <div className="border border-[var(--border)] bg-[var(--glass-card)] backdrop-blur-sm p-6 flex items-center gap-4">
          <span className="text-4xl md:text-5xl font-bold tracking-tighter">4.9</span>
          <div className="flex flex-col">
            <Star className="w-4 h-4 fill-current" strokeWidth={1.5} style={{ color: "var(--sand)" }} />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] font-medium mt-1">{t("reviews.platform_yandex")}</span>
          </div>
        </div>
        <div className="border border-[var(--border)] bg-[var(--glass-card)] backdrop-blur-sm p-6 flex items-center gap-4">
          <span className="text-4xl md:text-5xl font-bold tracking-tighter">5.0</span>
          <div className="flex flex-col">
            <Star className="w-4 h-4 fill-current" strokeWidth={1.5} style={{ color: "var(--sand)" }} />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] font-medium mt-1">{t("reviews.platform_avito")}</span>
          </div>
        </div>
      </div>

      {dataLoading ? (
        <SkeletonCards count={3} />
      ) : error ? (
        <ErrorState onRetry={fetchReviews} />
      ) : reviews.length === 0 ? (
        <EmptyState title="Нет отзывов" />
      ) : (
      <div className="flex flex-col w-full max-w-3xl gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="review-card card-lift accent-glow-hover opacity-0 translate-y-10 border border-[var(--border)] bg-[var(--glass-card)] backdrop-blur-sm p-8 group hover:border-[var(--sand)]/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-[var(--text-primary)] font-bold text-sm">{review.author}</span>
                <span className="text-[11px] uppercase tracking-[0.15em] font-medium" style={{ color: "var(--accent)" }}>{review.service}</span>
              </div>
              <span className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)]">{review.date_label}</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">«{review.text}»</p>
          </div>
        ))}
      </div>
      )}

      <SectionCTA variant="form" label={t("reviews.cta")} />
    </section>
  );
}
