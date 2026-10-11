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
import { AmbientField } from "@/components/ambient-field";
import { JourneyLine } from "@/components/journey-line";
import { MotionControl } from "@/components/motion-control";
export default function Home() {
  return (
    <>
      <AmbientField />
      <Navbar />
      <PortfolioMotion />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <JourneyLine />
        <Projects />
        <Experience />
        <Achievements />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <div className="motion-dock"><MotionControl /></div>
    </>
  );
}
