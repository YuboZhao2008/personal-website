import type { ReactNode } from "react";
export function Button({
  children,
  href,
  variant = "secondary",
  className = "",
  newTab = false,
}: {
  children: ReactNode;
  href?: string | null;
  variant?: "primary" | "secondary" | "text";
  className?: string;
  newTab?: boolean;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      className={`button button-${variant} ${className}`}
      {...(newTab || href.startsWith("https://")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  );
}
export function SectionHeading({
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
      {eyebrow === "SELECTED SYSTEMS" && (
        <p className="eyebrow">Selected projects</p>
      )}
      <h2 data-kinetic-heading>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
