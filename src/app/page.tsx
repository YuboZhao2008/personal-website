import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import {
  About,
  Experience,
  Projects,
  Skills,
  Achievements,
  Exploring,
  Contact,
} from "@/components/content-sections";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Achievements />
        <Exploring />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
