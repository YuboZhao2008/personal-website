import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  FileText,
  Github,
} from "lucide-react";
import { profile } from "@/data/profile";
import { AnimatedSection } from "./animated-section";
import { Button } from "./ui";
import { SystemVisual } from "./system-visual";

export function Hero() {
  return (
    <section id="home" className="hero section-shell">
      <div className="hero-main">
        <div className="hero-copy">
          <AnimatedSection>
            <div className="hero-kicker">
              <span className="status-dot" /> CURIOUS MIND. BUILDER AT HEART.
            </div>
            <h1>
              {profile.name}
              <span>
                {profile.headline.lead}
                <br />
                {profile.headline.continuation}{" "}
                <em>{profile.headline.accent}</em>
              </span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="hero-education">
              {profile.role} <span>@</span> {profile.university}
            </p>
            <p className="hero-description">{profile.introduction}</p>
            <div className="hero-actions">
              <Button href="#projects" variant="primary">
                View projects <ArrowUpRight size={17} />
              </Button>
              <Button href={profile.socials.resume}>
                <FileText size={15} /> View résumé
              </Button>
              <Button href={profile.socials.github} variant="text">
                <Github size={17} /> GitHub
              </Button>
            </div>
          </AnimatedSection>
        </div>
        <AnimatedSection className="hero-art" delay={0.2}>
          <SystemVisual />
        </AnimatedSection>
      </div>
      <div className="hero-bottom">
        <a href="#about">
          <span className="scroll-icon">
            <ArrowDown size={14} />
          </span>{" "}
          A little more about me
        </a>
        <span>
          SOFTWARE <i /> INTELLIGENCE <i /> REAL-WORLD IMPACT{" "}
          <ArrowDownRight size={17} />
        </span>
      </div>
    </section>
  );
}
