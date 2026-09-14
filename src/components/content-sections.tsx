import {
  ArrowUpRight,
  Code2,
  Cpu,
  GraduationCap,
  Terminal,
  PanelsTopLeft,
  Linkedin,
  Mail,
  Github,
} from "lucide-react";
import { profile } from "@/data/profile";
import { AnimatedSection } from "./animated-section";
import { AchievementCard, Button, SectionHeading, TimelineItem } from "./ui";
import { ProjectCard } from "./project-card";

export function About() {
  return (
    <section id="about" className="section-shell section-space about-section">
      <AnimatedSection>
        <SectionHeading
          number="01"
          eyebrow="ABOUT"
          title="Curiosity is the starting point."
        />
      </AnimatedSection>
      <AnimatedSection className="about-content">
        <p className="large-body">{profile.about}</p>
        <p>{profile.philosophy}</p>
        <div className="about-note">
          <GraduationCap size={20} />
          <span>
            {profile.university}
            <small>{profile.role}</small>
          </span>
          <span className="note-label">LEARNING BY BUILDING</span>
        </div>
      </AnimatedSection>
    </section>
  );
}

export function Experience() {
  return (
    <section
      id="experience"
      className="section-shell section-space split-section"
    >
      <AnimatedSection className="experience-heading">
        <SectionHeading
          number="02"
          eyebrow="THE JOURNEY"
          title="A foundation for what’s next."
          description="AI competition, quantitative experience, and robotics on the world stage."
        />
      </AnimatedSection>
      <div className="timeline">
        {profile.experiences.map((experience) => (
          <AnimatedSection key={experience.id} className="timeline-entry">
            <TimelineItem {...experience} />
          </AnimatedSection>
        ))}
        <AnimatedSection className="timeline-entry">
          <TimelineItem {...profile.education} />
        </AnimatedSection>
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projects" className="section-shell section-space">
      <AnimatedSection className="section-title-row">
        <SectionHeading
          number="03"
          eyebrow="PROJECTS & EXPERIMENTS"
          title="Ideas, made tangible."
          description="Personal agents, vision-based interfaces, and simulated worlds."
        />
        <span className="small-label">
          THE PROJECT NOTEBOOK <ArrowUpRight size={15} />
        </span>
      </AnimatedSection>
      <div className="projects-grid">
        {profile.projects.map((project, i) => (
          <AnimatedSection
            key={project.id}
            delay={i * 0.08}
            className={i === 0 ? "featured-project-slot" : ""}
          >
            <ProjectCard project={project} featured={i === 0} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

const skillIcons = {
  languages: Code2,
  ai: Cpu,
  tools: Terminal,
  web: PanelsTopLeft,
};
export function Skills() {
  return (
    <section id="skills" className="section-shell section-space">
      <AnimatedSection>
        <SectionHeading
          number="04"
          eyebrow="SKILLS & TECHNOLOGIES"
          title="A toolkit that keeps growing."
          description="Programming foundations, applied AI experiments, and the tools behind the work."
        />
      </AnimatedSection>
      <div className="skills-grid">
        {profile.skillGroups.map((group, index) => {
          const Icon = skillIcons[group.id];
          return (
            <AnimatedSection key={group.title} delay={index * 0.06}>
              <div className="skill-group">
                <div className="skill-heading">
                  <Icon size={21} strokeWidth={1.4} aria-hidden="true" />
                  <div>
                    <h3>{group.title}</h3>
                    <p className="skill-context">{group.context}</p>
                  </div>
                  <span className="skill-index">0{index + 1}</span>
                </div>
                <ul className="skill-list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </section>
  );
}

export function Achievements() {
  return (
    <section
      id="achievements"
      className="section-shell section-space achievements-section"
    >
      <AnimatedSection>
        <SectionHeading
          number="05"
          eyebrow="MILESTONES"
          title="Progress, earned."
        />
      </AnimatedSection>
      <div className="achievements-grid">
        {profile.achievements.map((achievement, index) => (
          <AnimatedSection key={achievement.id} delay={index * 0.06}>
            <AchievementCard {...achievement} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

export function Exploring() {
  return (
    <section id="exploring" className="section-shell section-space">
      <AnimatedSection className="section-title-row">
        <SectionHeading
          number="06"
          eyebrow="ON MY RADAR"
          title="Still asking. Still building."
        />
        <span className="live-label">
          <span className="status-dot" /> CURRENT EXPLORATIONS
        </span>
      </AnimatedSection>
      <div className="exploring-grid">
        {profile.exploring.map((item, i) => (
          <AnimatedSection key={item.title} delay={i * 0.06}>
            <article className="exploring-item">
              <div className="lab-meta">
                <span className="exploring-number">0{i + 1} /</span>
                <span className="lab-status">
                  <i aria-hidden="true" />
                  {item.status}
                </span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="section-shell contact-section">
      <AnimatedSection>
        <div className="eyebrow">
          <span>07</span> <span>START A CONVERSATION</span>
        </div>
        <h2>
          Good things start
          <br />
          with a <em>hello.</em>
          <ArrowUpRight aria-hidden="true" />
        </h2>
        <div className="contact-bottom">
          <p>
            Interesting problem? Ambitious idea?
            <br />
            I’d love to hear what you’re working on.
          </p>
          <div className="contact-links">
            <Button
              href={
                profile.socials.email ? `mailto:${profile.socials.email}` : null
              }
              variant="primary"
            >
              Say hello <Mail size={16} />
            </Button>
            <Button href={profile.socials.linkedin} variant="text">
              <Linkedin size={18} />
              <span className="sr-only">LinkedIn</span>
            </Button>
            <Button href={profile.socials.github} variant="text">
              <Github size={18} />
              <span className="sr-only">GitHub</span>
            </Button>
          </div>
        </div>
        {!profile.socials.email &&
          !profile.socials.linkedin &&
          !profile.socials.github && (
            <p className="contact-pending">
              Contact links are being set up. Check back soon.
            </p>
          )}
      </AnimatedSection>
    </section>
  );
}
