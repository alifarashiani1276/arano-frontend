import useScrollFx from "../hooks/useScrollFx";
import Navbar from "../features/home/Navbar";
import Hero from "../features/home/Hero";
import Marquee from "../features/home/Marquee";
import Stats from "../features/home/Stats";
import Services from "../features/home/Services";
import Portfolio from "../features/home/Portfolio";
import About from "../features/home/About";
import Team from "../features/home/Team";
import Contact from "../features/home/Contact";
import Footer from "../features/home/Footer";

export default function Home() {
  useScrollFx();

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-primary-foreground"
      >
        پرش به محتوای اصلی
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <Marquee />
        <Stats />
        <Services />
        <Portfolio />
        <About />
        <Team />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
