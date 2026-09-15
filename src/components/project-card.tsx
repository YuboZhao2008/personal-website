import { ArrowUpRight, Plus } from "lucide-react";
import type { Project } from "@/data/profile";
import { projectEvidence } from "@/data/links";
import { ProjectVisual } from "./project-visual";

export function ProjectShowcase({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article
      id={`project-${project.id}`}
      className={`project-showcase project-${project.presentation} project-${project.visual}`}
    >
      <div className="project-body">
        <div className="project-meta mono">
          <span>{project.category}</span>
          <span>0{index + 1} /</span>
        </div>
        <h3>{project.title}</h3>
        <p className="project-subtitle">{project.subtitle}</p>
        <p className="project-description">{project.description}</p>
        <ul className="project-technologies">
          {project.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        {project.evaluation && (
          <div className="project-evaluation">
            <strong>{project.evaluation.result}</strong>
            <span>{project.evaluation.context}</span>
          </div>
        )}
        <details className="project-details">
          <summary>
            Engineering notes
            <span className="sr-only"> for {project.title}</span>
            <Plus size={17} aria-hidden="true" />
          </summary>
          <ul>
            {project.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </details>
        {projectEvidence(project).map((link) => (
          <a
            key={link.label}
            className="project-link"
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.label} for ${project.title}`}
          >
            {link.label} <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        ))}
      </div>
      <ProjectVisual variant={project.visual} />
    </article>
  );
}
