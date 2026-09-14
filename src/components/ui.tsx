import { BrainCircuit, Bot, Sigma } from "lucide-react";
import type { ReactNode } from "react";
import type { Achievement, Experience } from "@/data/profile";

export function Button({
  children,
  href,
  variant = "secondary",
  className = "",
}: {
  children: ReactNode;
  href?: string | null;
  variant?: "primary" | "secondary" | "text";
  className?: string;
}) {
  const classes = `button button-${variant} ${className}`;
  return href ? (
    <a
      href={href}
      className={classes}
      {...(href.startsWith("https://")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  ) : (
    <span
      role="link"
      aria-disabled="true"
      className={`${classes} is-disabled`}
      title="Link coming soon"
    >
      {children}
      <span className="sr-only"> — link coming soon</span>
    </span>
  );
}

export function SectionHeading({
  number,
  eyebrow,
  title,
  description,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <div className="eyebrow">
        <span>{number}</span>
        <span>{eyebrow}</span>
      </div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

export function SkillBadge({ children }: { children: ReactNode }) {
  return <span className="skill-badge">{children}</span>;
}

export function TimelineItem({
  title,
  organization,
  period,
  description,
  year,
  team,
  placement,
  category,
  featured,
}: Experience) {
  return (
    <article className={`timeline-item${featured ? " timeline-featured" : ""}`}>
      <span className="timeline-dot" />
      <div>
        <div className="experience-meta">
          <span>{category}</span>
          {(period || year) && <span>{period || year}</span>}
        </div>
        <h3>{title}</h3>
        {organization && <p className="organization">{organization}</p>}
        {team && <p className="experience-team">{team}</p>}
        {placement && <span className="result-pill">{placement}</span>}
        <p>{description}</p>
      </div>
    </article>
  );
}

export function AchievementCard({
  title,
  detail,
  year,
  result,
  kind,
  featured,
}: Achievement) {
  const Icon = { ai: BrainCircuit, robotics: Bot, mathematics: Sigma }[kind];
  return (
    <article
      className={`achievement-card${featured ? " achievement-featured" : ""}`}
    >
      <div className="achievement-meta">
        <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
        <span>{year ?? "AI OLYMPIAD"}</span>
      </div>
      <h3>{title}</h3>
      {result && <span className="achievement-result">{result}</span>}
      <p>{detail}</p>
    </article>
  );
}
