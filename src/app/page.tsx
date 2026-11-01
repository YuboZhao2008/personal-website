import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import {
  About,
  Experience,
  Projects,
  Skills,
  Achievements,
  Contact,
} from "@/components/content-sections";
import { Footer } from "@/components/footer";
import { PortfolioMotion } from "@/components/portfolio-motion";
import { MotionControl } from "@/components/motion-control";
export default function Home() {
  return (
    <>
      <Navbar />
      <PortfolioMotion />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Projects />
        <About />
        <Experience />
        <Achievements />
        <Skills />
        <Contact />
      </main>
      <div className="section-shell motion-settings"><MotionControl /></div>
      <Footer />
    </>
  );
}
