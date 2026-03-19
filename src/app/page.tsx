import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import StoriesSection from "@/components/sections/StoriesSection";
import Services from "@/components/sections/Services";
import Expertise from "@/components/sections/Expertise";
import Team from "@/components/sections/Team";
import Process from "@/components/sections/Process";
import Portfolio from "@/components/sections/Portfolio";
import Equipment from "@/components/sections/Equipment";
import Pricing from "@/components/sections/Pricing";
import Certificate from "@/components/sections/Certificate";
import Reviews from "@/components/sections/Reviews";
import FAQ from "@/components/sections/FAQ";
import ContactForm from "@/components/sections/ContactForm";
import Footer from "@/components/layout/Footer";
import Scene from "@/components/canvas/Scene";
import ScrollChoreography from "@/components/canvas/ScrollChoreography";
import Preloader from "@/components/effects/Preloader";
import ScrollProgress from "@/components/effects/ScrollProgress";
import EmergencyButton from "@/components/ui/EmergencyButton";
import TrustMarquee from "@/components/ui/TrustMarquee";
import MessengerWidget from "@/components/ui/MessengerWidget";
import LiveClock from "@/components/ui/LiveClock";
import ExitIntentPopup from "@/components/ui/ExitIntentPopup";

{/* 
  Spacing system:
  Mobile  (<640px):  px-5     = 20px
  Tablet  (640-1024): px-10   = 40px  
  Desktop (>1024):   px-[8vw] = ~115px @1440
*/}
const SP = "px-5 sm:px-10 lg:px-[8vw]";

export default function Home() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      {/* Swiss grid line */}
      <div className="fixed top-0 left-1/2 w-px h-screen bg-white/5 z-0 pointer-events-none transform -translate-x-1/2" aria-hidden="true" />
      
      <Scene />
      <ScrollChoreography />

      <Navbar />

      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--accent)] focus:text-[var(--bg-deep)] focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-bold"
      >
        Перейти к основному содержимому
      </a>

      <main id="main-content" className="relative w-full z-10 text-white font-sans overflow-x-hidden" role="main">
        {/* Sec 1: Hero — Уборка после смерти, дезинфекция помещений */}
        <section id="hero" aria-label="Главный экран — экстренная уборка после ЧП в Москве" className={`h-screen w-full flex flex-col justify-center ${SP}`}>
            <Hero />
        </section>

        {/* Trust badges marquee — social proof strip */}
        <TrustMarquee />

        {/* Stories — Примеры работ в формате видео */}
        <StoriesSection />

        {/* Sec 2: Services — Услуги дезинфекции и биологической очистки */}
        <section id="services" aria-label="Услуги профессиональной дезинфекции и биологической очистки" className={`section-grain min-h-screen w-full flex flex-col justify-center items-end text-right ${SP} py-24`}>
            <div className="max-w-3xl pointer-events-auto">
              <Services />
            </div>
        </section>

        {/* Sec 3: Expertise — Почему опасна непрофессиональная уборка */}
        <section id="expertise" aria-label="Почему опасна непрофессиональная уборка после смерти" className={`min-h-screen w-full flex flex-col justify-center items-start ${SP} py-24`}>
            <div className="max-w-3xl pointer-events-auto">
              <Expertise />
            </div>
        </section>

        {/* Sec 3.5: Team — Команда специалистов */}
        <section id="team" aria-label="Команда сертифицированных специалистов PureAura" className={`section-grain min-h-screen w-full flex flex-col justify-center items-end ${SP} py-24`}>
            <div className="w-full max-w-5xl pointer-events-auto">
              <Team />
            </div>
        </section>

        {/* Sec 4: Process — Протокол работы */}
        <section id="process" aria-label="Порядок работы — протокол профессиональной дезинфекции" className={`min-h-screen w-full flex flex-col justify-center items-start ${SP} py-24`}>
            <div className="w-full pointer-events-auto">
              <Process />
            </div>
        </section>

        {/* Sec 5: Portfolio — Кейсы до/после */}
        <section id="portfolio" aria-label="Портфолио — результаты уборки до и после обработки" className={`section-grain min-h-screen w-full flex flex-col justify-center items-end ${SP} py-24`}>
            <div className="w-full max-w-4xl pointer-events-auto">
              <Portfolio />
            </div>
        </section>

        {/* Sec 6: Equipment — Профессиональное оборудование для дезинфекции */}
        <section id="equipment" aria-label="Профессиональное оборудование для дезинфекции и озонирования" className={`min-h-screen w-full flex flex-col justify-center items-start ${SP} py-24`}>
            <div className="w-full max-w-4xl pointer-events-auto">
              <Equipment />
            </div>
        </section>

        {/* Sec 6.5: Certificate — Лицензии и сертификаты */}
        <section id="certificate" aria-label="Лицензии и сертификаты компании" className={`min-h-[60vh] w-full flex flex-col justify-center items-start ${SP} py-24`}>
            <div className="w-full max-w-4xl pointer-events-auto">
              <Certificate />
            </div>
        </section>

        {/* Sec 7: Pricing — Цены на уборку и дезинфекцию */}
        <section id="pricing" aria-label="Стоимость услуг — фиксированные цены на уборку и дезинфекцию" className={`section-grain min-h-screen w-full flex flex-col justify-center items-end ${SP} py-24`}>
            <div className="w-full max-w-4xl pointer-events-auto">
              <Pricing />
            </div>
        </section>

        {/* Sec 8: Reviews — Отзывы клиентов */}
        <section id="reviews" aria-label="Отзывы клиентов о профессиональной уборке и дезинфекции" className={`min-h-screen w-full flex flex-col justify-center items-start ${SP} py-24`}>
            <div className="w-full max-w-3xl pointer-events-auto">
              <Reviews />
            </div>
        </section>

        {/* Sec 9: FAQ — Частые вопросы */}
        <section id="faq" aria-label="Частые вопросы об уборке после смерти и дезинфекции" className={`section-grain min-h-screen w-full flex flex-col justify-center items-end ${SP} py-24`}>
            <div className="w-full max-w-3xl pointer-events-auto">
              <FAQ />
            </div>
        </section>

        {/* Sec 10: Contact — Заказать уборку */}
        <section id="contact" aria-label="Форма заявки — заказать профессиональную уборку и дезинфекцию" className={`min-h-screen w-full flex flex-col justify-center items-start ${SP} py-24`}>
            <div className="w-full max-w-2xl pointer-events-auto">
              <ContactForm />
            </div>
        </section>

        {/* End spacer */}
        <section className="h-[2vh] w-full" aria-hidden="true" />
      </main>

      <EmergencyButton />
      <LiveClock />
      <MessengerWidget />
      <ExitIntentPopup />
      <Footer />
    </>
  );
}
