import { ArrowDown, ArrowRight } from "lucide-react";

const phases = [
  {
    label: "01 / ACQUIRE",
    steps: ["Sources", "Discovery", "Content / transcripts", "Chunks"],
    detail: "Essays · interviews · talks",
  },
  {
    label: "02 / GROUND",
    steps: ["Observations", "Validation", "Evidence"],
    detail: "Support · contradiction · qualification",
  },
  {
    label: "03 / APPLY",
    steps: ["Claims", "Decision profile", "Pitch analysis"],
    detail: "Profile-specific preparation",
  },
];

export function RoomReadVisual() {
  return (
    <figure className="roomread-visual" aria-label="RoomRead research architecture">
      <figcaption className="roomread-caption mono">
        FROM SOURCE TO DECISION
      </figcaption>
      <ol className="roomread-pipeline" aria-label="Research pipeline">
        {phases.map((phase, index) => (
          <li className="roomread-phase" key={phase.label}>
            <div className="roomread-phase-label mono">
              <span>{phase.label}</span>
              <i className="roomread-signal ambient" aria-hidden="true" />
            </div>
            <ol className="roomread-steps">
              {phase.steps.map((step, stepIndex) => (
                <li key={step}>
                  {stepIndex > 0 && <ArrowRight size={14} aria-hidden="true" />}
                  <strong>{step}</strong>
                </li>
              ))}
            </ol>
            <p>{phase.detail}</p>
            {index < phases.length - 1 && (
              <ArrowDown className="roomread-connector" size={16} aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
      <p className="roomread-note">
        Provenance retained at every stage.<br />
        Insufficient evidence → explicit abstention.
      </p>
    </figure>
  );
}
