import { ArrowUpRight, Plus } from "lucide-react";
import type { Project } from "@/data/profile";
import { SkillBadge } from "./ui";

import { ProjectVisual } from "./project-visual";
export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  return (
    <article className={`project-card${featured ? " project-featured" : ""}`}>
      <ProjectVisual variant={project.visual} />
      <div className="project-body">
        <div className="project-meta">
          <span>{project.category}</span>
          <span>
            {featured ? "FEATURED / " : ""}
            {project.id}
          </span>
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
            <Plus size={15} aria-hidden="true" />
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
