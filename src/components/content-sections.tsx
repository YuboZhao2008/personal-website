import { ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";
import {
  profile,
  type Achievement,
  type Experience as ExperienceData,
} from "@/data/profile";
import { publicHref } from "@/data/links";
import { AnimatedSection } from "./animated-section";
import { SectionHeading } from "./ui";
import { ProjectShowcase } from "./project-card";

export function About() {
  return (
    <section id="about" className="section-shell section-space about-section">
      <AnimatedSection>
        <SectionHeading
          number="01"
          eyebrow="PROFILE"
          title="Between a model and the real world."
        />
        <div className="education-record">
          <span className="mono">UNIVERSITY OF WATERLOO</span>
          <strong>{profile.education.degree}</strong>
          <span>1A · Expected graduation {profile.education.graduation}</span>
        </div>
      </AnimatedSection>
      <AnimatedSection className="about-content">
        <p className="large-body">{profile.about}</p>
        <p>{profile.philosophy}</p>
        <a className="text-link" href="#experience">
          The experience behind the work <ArrowDownRight size={18} />
        </a>
      </AnimatedSection>
    </section>
  );
}

function ExperienceEntry({ experience }: { experience: ExperienceData }) {
  return (
    <article
      id={`experience-${experience.id}`}
      className={`experience-entry experience-${experience.id}`}
    >
      <div className="experience-year mono">
        <span>{experience.year ?? experience.period}</span>
        <span>{experience.category}</span>
      </div>
      <div className="experience-identity">
        {experience.id === "ioai" ? (
          <div className="experience-display">
            TEAM
            <br />
            <span>CANADA</span>
            <span className="ioai-code mono">IOAI / 2025</span>
          </div>
        ) : experience.result ? (
          <div className="experience-display ftc-result" aria-hidden="true">
            <span>{experience.result.value}</span>
            <span className="world-label">{experience.result.label}</span>
          </div>
        ) : (
          <div className="quant-mark" aria-hidden="true">
            <span>f(x)</span>
            <svg viewBox="0 0 300 65">
              <path d="M0 32H300" />
              <path
                className="quant-signal ambient"
                d="M0 32 20 38 35 21 48 45 62 39 75 16 90 43 108 22 123 39 138 17 150 34 164 51 177 25 190 41 208 20 224 48 240 16 257 39 275 23 300 32"
              />
            </svg>
            <span className="mono">MODEL / TEST / VALIDATE</span>
          </div>
        )}
        <h3>{experience.organization}</h3>
        <p className="experience-role">{experience.title}</p>
        {experience.location && (
          <p className="experience-location mono">
            {experience.period} · {experience.location}
          </p>
        )}
      </div>
      <div className="experience-copy">
        <p className="experience-statement">{experience.statement}</p>
        {experience.result && (
          <p className="experience-result-detail">{experience.result.detail}</p>
        )}
        <p>{experience.description}</p>
        <ul className="discipline-list">
          {experience.disciplines.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
export function Experience() {
  return (
    <section
      id="experience"
      className="section-shell section-space experience-section"
    >
      <AnimatedSection className="section-title-row">
        <SectionHeading
          number="02"
          eyebrow="EXPERIENCE"
          title="Tested beyond the classroom."
        />
        <p className="section-aside">
          Competitive AI. International robotics.
          <br />
          Research under real constraints.
        </p>
      </AnimatedSection>
      <div className="experience-list">
        {profile.experiences.map((experience) => (
          <AnimatedSection key={experience.id}>
            <ExperienceEntry experience={experience} />
          </AnimatedSection>
        ))}
      </div>
      <div className="experience-bridge mono">
        <span>COMPETE → EXPERIMENT → ENGINEER</span>
        <ArrowDownRight size={22} />
        <span>THE WORK CONTINUES IN SYSTEMS</span>
      </div>
    </section>
  );
}
export function Projects() {
  return (
    <section
      id="projects"
      className="section-shell section-space projects-section"
    >
      <AnimatedSection className="section-title-row">
        <SectionHeading
          number="03"
          eyebrow="SELECTED SYSTEMS"
          title="Intelligence, assembled."
          description="AI agents and learning systems, from perception and simulation to reinforcement learning and real-time control."
        />
        <span className="section-counter mono">
          01 — {String(profile.projects.length).padStart(2, "0")}
          <br />
          SELECTED WORK
        </span>
      </AnimatedSection>
      <div className="project-exhibits">
        {profile.projects.map((project, index) => (
          <AnimatedSection
            key={project.id}
            className={`exhibit-slot exhibit-${project.presentation}`}
          >
            <ProjectShowcase project={project} index={index} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
export function Achievements() {
  return (
    <section id="achievements" className="honours-section">
      <div className="section-shell">
        <AnimatedSection className="section-title-row">
          <SectionHeading
            number="04"
            eyebrow="HONOURS & COMPETITIONS"
            title="A record of the work."
          />
        </AnimatedSection>
        <div className="honours-grid">
          {profile.achievements.map((achievement: Achievement) => (
            <AnimatedSection key={achievement.id}>
              <article className={`honour honour-${achievement.id}`}>
                <div className="honour-label mono">
                  <span>{achievement.shortTitle}</span>
                  {achievement.year && <span>{achievement.year}</span>}
                </div>
                <strong className="honour-result">{achievement.result}</strong>
                <p>{achievement.detail}</p>
                <h3>{achievement.title}</h3>
                {(achievement.team ||
                  achievement.teamNumber ||
                  achievement.resultDetail ||
                  achievement.scope) && (
                  <p className="achievement-context">
                    {[
                      achievement.team,
                      achievement.teamNumber &&
                        `Team ${achievement.teamNumber}`,
                      achievement.resultDetail,
                      achievement.scope,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                {publicHref(achievement.verificationUrl) && (
                  <a
                    className="achievement-verification"
                    href={publicHref(achievement.verificationUrl)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Verify ${achievement.title}`}
                  >
                    Verify result <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Skills() {
  return (
    <section id="skills" className="section-shell section-space skills-section">
      <AnimatedSection>
        <SectionHeading
          number="05"
          eyebrow="TECHNICAL TOOLKIT"
          title="The parts behind the systems."
          description="Programming, machine learning, computer vision, and software integration across the work above."
        />
      </AnimatedSection>
      <div className="skill-rows">
        {profile.skillGroups.map((group, i) => (
          <AnimatedSection key={group.id}>
            <article className="skill-row">
              <div className="skill-heading">
                <span className="mono">0{i + 1}</span>
                <h3>{group.title}</h3>
                <p>{group.context}</p>
              </div>
              <div className="skill-content">
                <ul className="core-skills">
                  {group.core.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <details className="skill-details">
                  <summary>
                    More {group.title.toLowerCase()} skills{" "}
                    <Plus size={15} aria-hidden="true" />
                  </summary>
                  <ul>
                    {group.additional.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </details>
              </div>
            </article>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
export function Contact() {
  const links = [
    {
      label: "Résumé",
      value: "View Résumé",
      href: publicHref(profile.socials.resume, true),
    },
    {
      label: "Email",
      value: profile.socials.email,
      href: profile.socials.email ? `mailto:${profile.socials.email}` : null,
    },
    {
      label: "LinkedIn",
      value: "yubozhao-ai",
      href: publicHref(profile.socials.linkedin),
    },
    {
      label: "GitHub",
      value: "View repositories",
      href: publicHref(profile.socials.github),
    },
  ].filter((link) => link.href);
  const opportunity = [
    profile.opportunity.status,
    profile.opportunity.targetRoles.length
      ? `Focus: ${profile.opportunity.targetRoles.join(" · ")}`
      : null,
    profile.opportunity.availability
      ? `Availability: ${profile.opportunity.availability}`
      : null,
  ].filter(Boolean);
  return (
    <section id="contact" className="section-shell contact-section">
      <AnimatedSection>
        <div className="eyebrow">
          <span>06 /</span> BUILD / COLLABORATE / EXPERIMENT
        </div>
        <h2>
          Let’s build
          <br />
          what comes <span>next.</span>
        </h2>
        <div className="contact-bottom">
          <div className="contact-intro">
            <p>
              Have a difficult problem or an idea worth exploring?
              <br />
              I’d like to hear about it.
            </p>
            {opportunity.length > 0 && (
              <p className="opportunity-note">{opportunity.join(" — ")}</p>
            )}
          </div>
          <div className="contact-links">
            {links.map((link) => (
              <a
                key={link.label}
                className={
                  link.label === "Résumé" ? "contact-resume" : undefined
                }
                aria-label={link.label === "Résumé" ? "View Résumé" : undefined}
                href={link.href!}
                {...(link.label === "Résumé" ||
                link.href!.startsWith("https://")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <span className="mono">{link.label}</span>
                <span>{link.value}</span>
                <ArrowUpRight size={19} />
              </a>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
