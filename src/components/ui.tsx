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
        <span>{number} /</span> {eyebrow}
      </div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
