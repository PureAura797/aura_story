import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Expertise from "@/components/sections/Expertise";
import Process from "@/components/sections/Process";
import Portfolio from "@/components/sections/Portfolio";
import Equipment from "@/components/sections/Equipment";
import Pricing from "@/components/sections/Pricing";
import Reviews from "@/components/sections/Reviews";
import FAQ from "@/components/sections/FAQ";
import ContactForm from "@/components/sections/ContactForm";
import Footer from "@/components/layout/Footer";
import Scene from "@/components/canvas/Scene";
import ScrollChoreography from "@/components/canvas/ScrollChoreography";
import Preloader from "@/components/effects/Preloader";
import ScrollProgress from "@/components/effects/ScrollProgress";
import EmergencyButton from "@/components/ui/EmergencyButton";

export default function Home() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      {/* Swiss grid line */}
      <div className="fixed top-0 left-1/2 w-px h-screen bg-white/5 z-0 pointer-events-none transform -translate-x-1/2" />
      
      <Scene />
      <ScrollChoreography />

      <Navbar />

      <main className="relative w-full z-10 text-white font-sans overflow-x-hidden">
        {/* Sec 1: Hero */}
        <section id="hero" className="h-screen w-full flex flex-col justify-center px-[10vw]">
            <Hero />
        </section>

        {/* Sec 2: Services */}
        <section id="services" className="min-h-screen w-full flex flex-col justify-center items-end text-right px-[10vw] py-24">
            <div className="max-w-3xl pointer-events-auto">
              <Services />
            </div>
        </section>

        {/* Sec 3: Expertise */}
        <section id="expertise" className="min-h-screen w-full flex flex-col justify-center items-start px-[10vw] py-24">
            <div className="max-w-3xl pointer-events-auto">
              <Expertise />
            </div>
        </section>

        {/* Sec 4: Process */}
        <section id="process" className="min-h-screen w-full flex flex-col justify-center items-start px-[10vw] py-24">
            <div className="w-full pointer-events-auto">
              <Process />
            </div>
        </section>

        {/* Sec 5: Portfolio */}
        <section id="portfolio" className="min-h-screen w-full flex flex-col justify-center items-end px-[10vw] py-24">
            <div className="w-full max-w-4xl pointer-events-auto">
              <Portfolio />
            </div>
        </section>

        {/* Sec 6: Equipment */}
        <section id="equipment" className="min-h-screen w-full flex flex-col justify-center items-start px-[10vw] py-24">
            <div className="w-full max-w-4xl pointer-events-auto">
              <Equipment />
            </div>
        </section>

        {/* Sec 7: Pricing */}
        <section id="pricing" className="min-h-screen w-full flex flex-col justify-center items-end px-[10vw] py-24">
            <div className="max-w-4xl pointer-events-auto">
              <Pricing />
            </div>
        </section>

        {/* Sec 8: Reviews */}
        <section id="reviews" className="min-h-screen w-full flex flex-col justify-center items-start px-[10vw] py-24">
            <div className="w-full max-w-3xl pointer-events-auto">
              <Reviews />
            </div>
        </section>

        {/* Sec 9: FAQ */}
        <section id="faq" className="min-h-screen w-full flex flex-col justify-center items-end px-[10vw] py-24">
            <div className="w-full max-w-3xl pointer-events-auto">
              <FAQ />
            </div>
        </section>

        {/* Sec 10: Contact */}
        <section id="contact" className="min-h-screen w-full flex flex-col justify-center items-start px-[10vw] py-24">
            <div className="w-full max-w-2xl pointer-events-auto">
              <ContactForm />
            </div>
        </section>

        {/* Sec 11: Outro — spacing only */}
        <section className="h-[20vh] w-full" />
      </main>

      <EmergencyButton />
      <Footer />
    </>
  );
}
