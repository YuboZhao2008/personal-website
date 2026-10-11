import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { publicHref } from "@/data/links";
import { Button } from "./ui";
import { HeroScene } from "./hero-scene";

export function Hero() {
  return (
    <>
      <section id="home" className="hero section-shell">
        <div className="hero-main">
          <div className="hero-copy">
            <p className="hero-kicker" data-hero-reveal>
              Software engineering & intelligent systems
            </p>
            <h1 aria-label={profile.name}>
              <span className="hero-name-line" data-hero-drift="left">
                <span data-hero-reveal>Yubo</span>
              </span>
              <span className="hero-name-line" data-hero-drift="right">
                <span data-hero-reveal>
                  Zhao<span className="name-period">.</span>
                </span>
              </span>
            </h1>
            <p className="hero-statement" data-hero-reveal>
              {profile.introduction}
            </p>
            <div className="hero-actions" data-hero-reveal>
              <Button href="#projects" variant="primary">
                Explore the systems <ArrowDown size={17} aria-hidden="true" />
              </Button>
              <Button href={publicHref(profile.socials.resume, true)} newTab>
                View Résumé <ArrowUpRight size={17} aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div className="hero-art" data-parallax="0.1">
            <HeroScene />
          </div>
        </div>
        <div className="hero-bottom">
          <p>
            {profile.university}
            <span>
              {profile.role} · Class of {profile.education.graduation}
            </span>
          </p>
        </div>
      </section>
      <div className="credentials-band">
        <div className="hero-credentials section-shell">
          <a href="#experience-ioai">
            <span>Artificial intelligence</span>
            <strong>
              Team Canada <ArrowUpRight size={19} aria-hidden="true" />
            </strong>
            <span>IOAI 2025</span>
          </a>
          <a href="#experience-ftc">
            <span>International robotics</span>
            <strong>
              2nd globally <ArrowUpRight size={19} aria-hidden="true" />
            </strong>
            <span>FTC World Championship 2024 · team result</span>
          </a>
          <a href="#experience-quant-internship">
            <span>Applied research</span>
            <strong>
              ML × Quant <ArrowUpRight size={19} aria-hidden="true" />
            </strong>
            <span>Research internship · 2025</span>
          </a>
        </div>
      </div>
    </>
  );
}
