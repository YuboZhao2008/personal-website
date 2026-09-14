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
export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Achievements />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
