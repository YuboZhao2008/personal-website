import type { Project } from "./profile";

/** Only configured HTTPS destinations (or an explicitly allowed site asset). */
export function publicHref(
  value: string | null | undefined,
  allowLocal = false,
): string | null {
  if (!value || value !== value.trim() || /[\s\\]/.test(value)) return null;
  if (allowLocal && /^\/(?![\/])[^?#]+/.test(value)) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function projectEvidence(
  project: Pick<Project, "repositoryUrl" | "demoUrl" | "caseStudyUrl">,
) {
  return [
    { label: "Repository", href: publicHref(project.repositoryUrl) },
    { label: "Demo", href: publicHref(project.demoUrl) },
    { label: "Case study", href: publicHref(project.caseStudyUrl) },
  ].filter(
    (link): link is { label: string; href: string } => link.href !== null,
  );
}
