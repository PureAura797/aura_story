"use client";

import { useRef } from "react";
import { Star } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import SectionCTA from "@/components/ui/SectionCTA";

const reviews = [
  {
    name: "Андрей М.",
    date: "Февраль 2026",
    service: "Уборка после смерти",
    text: "Обратились после смерти отца. Квартира была в тяжёлом состоянии 3 недели. Бригада приехала через 40 минут, работали 10 часов. Получили протокол с АТФ-тестами. Запаха нет.",
  },
  {
    name: "Ольга К.",
    date: "Январь 2026",
    service: "Устранение запахов",
    text: "Купили квартиру, где предыдущий владелец скончался. Три клининга не помогли. PureAura нашли источник в стяжке, демонтировали, обработали. Гарантия 30 дней — запах не вернулся.",
  },
  {
    name: "УК «Домсервис»",
    date: "Декабрь 2025",
    service: "Инфекционный контроль",
    text: "Прорыв канализации на первом этаже. Затопило подвал и два помещения. Выполнили полный протокол за 12 часов. Акты для страховой предоставили в тот же день.",
  },
  {
    name: "Сергей В.",
    date: "Ноябрь 2025",
    service: "Расхламление",
    text: "Нужно было подготовить «бабушкину» квартиру к продаже. Объем мусора был колоссальный. Ребята за два дня вывезли всё, отчистили полы до бетона и устранили едкий запах. Очень профессионально.",
  },
  {
    name: "Марина Т.",
    date: "Сентябрь 2025",
    service: "Уборка после пожара",
    text: "Сгорела кухня. Вся квартира была в черной саже и копоти. Мастера демонтировали обожженные элементы и провели химическую отмывку со спецрастворами. Ни следа гари не осталось.",
  },
  {
    name: "ООО «Логистика Плюс»",
    date: "Август 2025",
    service: "Дезинфекция",
    text: "Заказывали санитарную обработку склада площадью 800 кв.м. Все сделано быстро, по нормам Роспотребнадзора, предоставили договор и акты выполненных работ. Будем сотрудничать на постоянной основе.",
  },
  {
    name: "Елена Д.",
    date: "Июнь 2025",
    service: "Дезинсекция",
    text: "Безуспешно боролись с клопами 3 месяца своими силами. Обратились в PureAura — приехали ночью (!), поставили барьер, все сделали конфиденциально. Спим спокойно уже полгода.",
  },
];

export default function Reviews() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const items = gsap.utils.toArray(".review-card") as HTMLElement[];

    ScrollTrigger.batch(items, {
      start: "top 90%",
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.4,
          ease: "power2.out",
        }),
      once: true,
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full flex flex-col items-start z-10 relative">
      <div className="mb-4">
        <p className="text-xs tracking-[0.2em] uppercase font-medium mb-4" style={{ color: "var(--accent)" }}>Репутация</p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Отзывы</h2>
      </div>
      <p className="text-sm text-neutral-500 font-light mb-12 max-w-lg">
        Проверенные отзывы на независимых площадках.
      </p>

      {/* Ratings */}
      <div className="review-card opacity-0 translate-y-10 flex flex-wrap gap-6 mb-8 w-full max-w-3xl">
        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 flex items-center gap-4">
          <span className="text-4xl md:text-5xl font-bold tracking-tighter">4.9</span>
          <div className="flex flex-col">
            <Star className="w-4 h-4 fill-current" strokeWidth={1.5} style={{ color: "var(--sand)" }} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mt-1">Яндекс</span>
          </div>
        </div>
        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 flex items-center gap-4">
          <span className="text-4xl md:text-5xl font-bold tracking-tighter">5.0</span>
          <div className="flex flex-col">
            <Star className="w-4 h-4 fill-current" strokeWidth={1.5} style={{ color: "var(--sand)" }} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mt-1">Авито</span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="flex flex-col w-full max-w-3xl gap-4">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="review-card opacity-0 translate-y-10 border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 group hover:border-[var(--sand)]/20 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-white font-bold text-sm">{review.name}</span>
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: "var(--accent)" }}>{review.service}</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-600">{review.date}</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              «{review.text}»
            </p>
          </div>
        ))}
      </div>

      <SectionCTA variant="form" label="Готовы довериться профессионалам? Оставьте заявку — ответим за 3 минуты." />
    </section>
  );
}
