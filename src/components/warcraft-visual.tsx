import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

const stages = [
  {
    id: "state",
    title: "Lua state",
    detail: "Instrumentation",
    Arrow: ArrowDown,
  },
  {
    id: "bridge",
    title: "IPC bridge",
    detail: "State serialization",
    Arrow: ArrowDown,
  },
  {
    id: "environment",
    title: "Python RL",
    detail: "Environment",
    Arrow: ArrowRight,
  },
  {
    id: "policy",
    title: "PPO policy",
    detail: "Training architecture",
    Arrow: ArrowUp,
  },
  {
    id: "queue",
    title: "Action queue",
    detail: "Sequential dispatch",
    Arrow: ArrowUp,
  },
  {
    id: "controller",
    title: "Lua controller",
    detail: "Unit commands",
    Arrow: ArrowUp,
  },
];

export function WarcraftVisual() {
  return (
    <figure
      className="warcraft-visual"
      aria-label="Warcraft III Reinforcement Learning Agent architecture"
    >
      <figcaption className="warcraft-caption mono">
        EXTERNAL CONTROL LOOP
      </figcaption>
      <ol
        className="warcraft-loop"
        aria-label="Observation to policy to action, returning to Warcraft III"
      >
        <li className="warcraft-game">
          <span className="mono">LIVE ENVIRONMENT</span>
          <strong>Warcraft III</strong>
          <span>Death Knight combat scenario</span>
          <ArrowDown className="warcraft-arrow" size={16} aria-hidden="true" />
        </li>
        {stages.map(({ id, title, detail, Arrow }) => (
          <li key={id} className={`warcraft-node warcraft-${id}`}>
            <strong>{title}</strong>
            <span>{detail}</span>
            <Arrow className="warcraft-arrow" size={16} aria-hidden="true" />
            {["state", "policy", "queue"].includes(id) && (
              <i className="warcraft-signal ambient" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
      <dl className="warcraft-interface">
        <div>
          <dt className="mono">OBSERVATIONS</dt>
          <dd>HP · position · distance · target · combat state</dd>
        </div>
        <div>
          <dt className="mono">ACTIONS</dt>
          <dd>Move · attack · target · stop · ability</dd>
        </div>
      </dl>
      <p className="warcraft-note">
        Training infrastructure built. Learned policies in development.
      </p>
    </figure>
  );
}
