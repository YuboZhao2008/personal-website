import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { publicHref } from "@/data/links";
import { ControlLoopStudy } from "./control-loop-study";

export function Hero() {
  const resume = publicHref(profile.socials.resume, true);
  return (
    <>
      <section id="home" className="hero section-shell">
        <div className="hero-main">
          <div className="hero-copy">
            <p className="hero-kicker">Software engineering, Waterloo</p>
            <h1>Yubo<br />Zhao</h1>
            <p className="hero-statement">{profile.introduction}</p>
            <div className="hero-actions">
              <a className="hero-work-link" href="#projects">Explore my work <ArrowDown size={19} aria-hidden="true" /></a>
              {resume && <a className="hero-resume-link" href={resume} target="_blank" rel="noopener noreferrer">Résumé <ArrowUpRight size={17} aria-hidden="true" /></a>}
            </div>
          </div>
          <div className="hero-art"><ControlLoopStudy /></div>
        </div>
        <div className="hero-bottom">
          <p>{profile.university}<span>{profile.role} / Class of {profile.education.graduation}</span></p>
          <a href="#about">A little about me <ArrowDown size={15} aria-hidden="true" /></a>
        </div>
      </section>
      <div className="credentials-band">
        <div className="hero-credentials section-shell">
          <a href="#experience-ioai"><span>Artificial intelligence</span><strong>Team Canada <ArrowUpRight size={18} aria-hidden="true" /></strong><span>IOAI 2025</span></a>
          <a href="#experience-ftc"><span>International robotics</span><strong>2nd globally <ArrowUpRight size={18} aria-hidden="true" /></strong><span>FTC World Championship 2024 — team result</span></a>
          <a href="#experience-quant-internship"><span>Applied research</span><strong>ML × Quant <ArrowUpRight size={18} aria-hidden="true" /></strong><span>Research internship / 2025</span></a>
        </div>
      </div>
    </>
  );
}
