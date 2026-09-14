"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { MotionControl } from "./motion-control";

const modes = [
  {
    label: "Agents",
    index: "01",
    title: "Many inputs. One system.",
    detail: "Voice, vision, memory, and local inference.",
    link: "#project-jarvis",
    project: "JARVIS",
    signal: "CONTEXT → RESPONSE",
  },
  {
    label: "Vision / ML",
    index: "02",
    title: "Learning to interpret.",
    detail: "Visual features, model evaluation, and interaction.",
    link: "#project-brain-tumor",
    project: "VISION EXPERIMENTS",
    signal: "IMAGE → REPRESENTATION",
  },
  {
    label: "Robotics",
    index: "03",
    title: "Intelligence in motion.",
    detail: "Sensors, autonomous control, and iteration.",
    link: "#experience-ftc",
    project: "FTC WORLD",
    signal: "PERCEPTION → CONTROL",
  },
  {
    label: "Worlds",
    index: "04",
    title: "What happens next?",
    detail: "World states, dynamics, and possible futures.",
    link: "#project-future-sim",
    project: "FUTURE-SIM",
    signal: "STATE → FUTURE",
  },
];
// Deterministic geometry: an abstract computational field, not measured data.
function fieldPoint(u: number, v: number) {
  const x = 285 + (u - v) * 12.5;
  const peak = Math.exp(-((u - 10) ** 2 + (v - 10) ** 2) / 48);
  const z = peak * 116 + Math.sin(u * 0.5 + v * 0.22) * 9;
  return [x, 140 + (u + v) * 5.5 - z];
}
const fieldLines = Array.from({ length: 42 }, (_, index) => {
  const n = index % 21;
  return Array.from({ length: 41 }, (_, step) => {
    const [x, y] = fieldPoint(
      index < 21 ? n : step / 2,
      index < 21 ? step / 2 : n,
    );
    return `${step === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
});
export function SystemVisual() {
  const [active, setActive] = useState(0);
  const mode = modes[active];
  return (
    <div className="system-visual" data-mode={active}>
      <div className="visual-topline mono">
        <span>
          <i className="status-dot" /> INTELLIGENT SYSTEMS
        </span>
        <span>FIELD / 00{active + 1}</span>
      </div>
      <div className="field-scene">
        <span className="field-axis mono">PERCEIVE / REASON / ACT</span>
        <svg
          className="field-svg"
          viewBox="0 0 570 420"
          role="img"
          aria-label="An abstract computational surface connecting perception, reasoning, and action"
        >
          <g className="field-reference">
            <path d="M35 285 285 145 535 285 285 425Z M35 255 285 115 535 255 M285 115V425" />
            <path d="M20 66V46h24 M526 46h24v20 M20 356v20h24 M526 376h24v-20" />
          </g>
          <g className="field-mesh">
            {fieldLines.map((d, i) => (
              <path
                key={i}
                d={d}
                className={i % 5 === active ? "field-highlight" : ""}
              />
            ))}
          </g>
          <g className="field-trace ambient">
            <path d={fieldLines[8 + active * 2]} />
            <path d={fieldLines[29 + active]} />
          </g>
          {[
            fieldPoint(4 + active * 3, 8),
            fieldPoint(10, 11 + active),
            fieldPoint(16, 14 - active),
          ].map(([x, y], i) => (
            <g
              key={i}
              className="field-marker"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <circle cx={x} cy={y} r="7" />
              <circle cx={x} cy={y} r="2" />
            </g>
          ))}
          <text x="33" y="407" className="field-coordinate">
            INPUT
          </text>
          <text x="495" y="407" className="field-coordinate">
            OUTPUT
          </text>
        </svg>
        <div className="field-caption mono">
          <span>EXPLORATION / {mode.index}</span>
          <span>{mode.signal}</span>
        </div>
      </div>
      <div
        className="system-selectors"
        role="group"
        aria-label="Explore engineering focus"
      >
        {modes.map((item, i) => (
          <button
            key={item.label}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            <span className="mono">0{i + 1}</span>
            {item.label}
          </button>
        ))}
      </div>
      <div className="system-readout" aria-live="polite">
        <div>
          <h2>{mode.title}</h2>
          <p>{mode.detail}</p>
        </div>
        <a href={mode.link} className="mono">
          {mode.project}
          <ArrowUpRight size={15} />
        </a>
      </div>
      <div className="system-footer mono">
        <span>EXPERIMENTS IN INTELLIGENCE</span>
        <MotionControl />
      </div>
    </div>
  );
}
