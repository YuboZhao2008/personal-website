import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/profile";
import { SkillBadge } from "./ui";

function ProjectVisual({ variant }: { variant: Project["visual"] }) {
  return (
    <div className={`project-visual preview-${variant}`} aria-hidden="true">
      {variant === "intelligence" ? (
        <div className="neural-preview">
          {Array.from({ length: 5 }, (_, i) => (
            <div className="neural-layer" key={i}>
              {Array.from({ length: i === 0 || i === 4 ? 3 : 5 }, (_, j) => (
                <i key={j} />
              ))}
            </div>
          ))}
          <svg viewBox="0 0 300 160">
            <path d="M25 40 85 20 150 80 215 20 275 40 M25 80 85 140 150 40 215 100 275 80 M25 120 85 60 150 120 215 60 275 120 M25 40 85 100 150 80 215 140 275 80 M25 120 85 20 150 120 215 20 275 120" />
          </svg>
        </div>
      ) : variant === "gesture" ? (
        <div className="gesture-preview">
          <svg viewBox="0 0 300 160">
            <path
              className="tracking-frame"
              d="M80 40V20h25M195 20h25v20M220 125v20h-25M105 145H80v-20"
            />
            <path d="M144 139 117 104 98 90 86 69 M117 104 130 93 123 63 119 32 M130 93 150 87 150 53 150 20 M150 87 170 94 180 63 185 35 M170 94 184 109 203 87 213 66 M184 109 144 139 M130 93 144 139 M150 87 144 139 M170 94 144 139" />
            {[
              [144, 139],
              [117, 104],
              [98, 90],
              [86, 69],
              [130, 93],
              [123, 63],
              [119, 32],
              [150, 87],
              [150, 53],
              [150, 20],
              [170, 94],
              [180, 63],
              [185, 35],
              [184, 109],
              [203, 87],
              [213, 66],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="3" />
            ))}
          </svg>
        </div>
      ) : (
        <div className="simulation-preview">
          <svg viewBox="0 0 300 160">
            <ellipse cx="105" cy="82" rx="70" ry="50" />
            <ellipse cx="208" cy="82" rx="52" ry="62" />
            <path d="m55 107 27-29 31 13 40-30 47 21 35-35 M113 91l17 37 63-12 34 20" />
            {[
              [55, 107],
              [82, 78],
              [113, 91],
              [153, 61],
              [200, 82],
              [235, 47],
              [130, 128],
              [193, 116],
              [227, 136],
            ].map(([x, y], index) => (
              <circle
                key={`${x}-${y}`}
                cx={x}
                cy={y}
                r={index % 3 === 0 ? 5 : 3}
              />
            ))}
          </svg>
        </div>
      )}
      <span className="preview-caption">
        {variant === "intelligence"
          ? "AGENT SYSTEM / CONCEPT"
          : variant === "gesture"
            ? "HAND LANDMARKS / CONCEPT"
            : "AGENT WORLD / CONCEPT"}
      </span>
      <span className="preview-plus">+</span>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <ProjectVisual variant={project.visual} />
      <div className="project-body">
        <div className="project-meta">
          <span>{project.category}</span>
          <span>{project.id}</span>
        </div>
        <h3>
          {project.href ? (
            <a href={project.href} target="_blank" rel="noopener noreferrer">
              {project.title}
              <ArrowUpRight size={18} />
            </a>
          ) : (
            project.title
          )}
        </h3>
        <p>{project.description}</p>
        <div className="project-tags">
          {project.tags.map((tag) => (
            <SkillBadge key={tag}>{tag}</SkillBadge>
          ))}
        </div>
        <span className="content-status">{project.status}</span>
        {project.evaluation && (
          <div className="project-evaluation">
            <strong>{project.evaluation.result}</strong>
            <p>{project.evaluation.context}</p>
          </div>
        )}
        <details className="project-details">
          <summary>
            Engineering notes
            <span className="sr-only"> for {project.title}</span>
          </summary>
          <ul>
            {project.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <p className="technology-label">
            {project.id === "01"
              ? "Technologies explored"
              : "Technical toolkit"}
          </p>
          <p>{project.technologies.join(" · ")}</p>
        </details>
      </div>
    </article>
  );
}
