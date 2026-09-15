import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { publicHref } from "@/data/links";
import { AnimatedSection } from "./animated-section";
import { Button } from "./ui";
import { SystemVisual } from "./system-visual";

export function Hero() {
  return (
    <section id="home" className="hero section-shell">
      <div className="hero-register mono">
        <span>YUBO ZHAO / PERSONAL PORTFOLIO</span>
        <span>
          <i className="status-dot" /> WATERLOO, ON
        </span>
      </div>
      <div className="hero-main">
        <div className="hero-copy">
          <AnimatedSection>
            <p className="hero-kicker mono">
              SOFTWARE ENGINEERING × INTELLIGENT SYSTEMS
            </p>
            <h1 aria-label={profile.name}>
              YUBO
              <span>
                ZHAO<span className="name-period">.</span>
              </span>
            </h1>
            <p className="hero-statement">{profile.introduction}</p>
            <p className="hero-education">
              {profile.university}
              <span>
                {profile.role} · Class of {profile.education.graduation}
              </span>
            </p>
            <div className="hero-actions">
              <Button href="#projects" variant="primary">
                Explore the systems <ArrowDown size={16} />
              </Button>
              <Button href={publicHref(profile.socials.resume, true)}>
                View Résumé <ArrowUpRight size={16} aria-hidden="true" />
              </Button>
              <Button href="#contact" variant="text">
                Get in touch <ArrowUpRight size={16} />
              </Button>
            </div>
          </AnimatedSection>
        </div>
        <AnimatedSection className="hero-art" delay={0.12}>
          <SystemVisual />
        </AnimatedSection>
      </div>
      <div className="hero-credentials">
        <a href="#experience">
          <span className="mono">01 / ARTIFICIAL INTELLIGENCE</span>
          <strong>
            Team Canada <ArrowUpRight size={18} />
          </strong>
          <span>IOAI 2025</span>
        </a>
        <a href="#experience-ftc">
          <span className="mono">02 / ROBOTICS</span>
          <strong>
            2nd globally <ArrowUpRight size={18} />
          </strong>
          <span>FTC World Championship 2024</span>
        </a>
        <a href="#experience-quant-internship">
          <span className="mono">03 / RESEARCH</span>
          <strong>
            ML × Quant <ArrowUpRight size={18} />
          </strong>
          <span>Research internship · 2025</span>
        </a>
      </div>
    </section>
  );
}
