"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const stages = [
  { title: "Observe", label: "Game → Python", text: "Lua instrumentation exposes combat state to an external Python agent." },
  { title: "Decide", label: "Python agent", text: "The agent receives health, position and target information through an observation interface." },
  { title: "Act", label: "Python → Game", text: "A command queue sends movement, attack and ability actions back into the game." },
];

/** A deliberately illustrative explanation of the real project, not simulated model output. */
export function ControlLoopStudy() {
  const [stage, setStage] = useState(0);
  return (
    <figure className="loop-study" data-stage={stage} aria-labelledby="loop-title">
      <div className="loop-study-heading"><span id="loop-title">An agent meets the world.</span><span className="loop-caption-label">Interaction study</span></div>
      <div className="loop-drawing" aria-hidden="true">
        <svg viewBox="0 0 600 420" fill="none">
          <path className="loop-axis" d="M300 25V383M55 248L545 248" />
          <g className="loop-board">
            <path className="loop-board-side" d="M62 235 298 369 538 231V244L298 383 62 248Z" />
            <path className="loop-board-face" d="M62 235 300 99 538 231 298 369Z" />
            <path className="loop-board-grid" d="m122 269 237-137m-177 171 237-138m-177 172 237-138M122 201l236 135M181 167l236 135M241 133l237 135" />
            <path className="loop-terrain" d="m153 219 47-27 47 27-47 27Zm174 35 47-27 47 27-47 27Z" />
            <g className="loop-unit"><path d="m258 240 25-14 25 14-25 14Z" /><path d="M258 240v-28l25-14 25 14v28l-25 14Z" /><path d="m258 212 25 14 25-14m-25 14v28" /></g>
            <g className="loop-target"><circle cx="390" cy="214" r="13" /><path d="M390 194v40m-20-20h40" /></g>
            <path className="loop-route" d="m283 241 46-27h61" />
          </g>
          <g className="loop-observation"><path d="M126 139 300 40l174 99-174 101Z" /><path d="m126 139 174 101 174-101" /><path d="M300 240v72" /></g>
          <path className="loop-wire" d="M300 40V23H525V140M62 235H28V92h98" />
          <circle className="loop-packet loop-packet-a" cx="300" cy="240" r="7" />
          <circle className="loop-packet loop-packet-b" cx="525" cy="90" r="7" />
          <path className="loop-callout" d="M423 320h94m-94 0-24-14M129 108H70" />
          <text x="438" y="343" className="loop-svg-label">Game state</text>
          <text x="48" y="91" className="loop-svg-label">Observation</text>
        </svg>
        <span className="loop-stage-tag">{stages[stage].label}</span>
      </div>
      <div className="loop-controls" role="group" aria-label="Explore the agent control loop">
        {stages.map(({ title }, index) => <button key={title} type="button" aria-pressed={stage === index} onClick={() => setStage(index)}><span>{index + 1}</span>{title}{index < 2 && <ArrowRight size={14} aria-hidden="true" />}</button>)}
      </div>
      <figcaption><p className="loop-explanation" aria-live="polite">{stages[stage].text}</p><a href="#project-warcraft-rl">From my Warcraft III RL environment <ArrowRight size={14} aria-hidden="true" /></a><span className="loop-illustration-note">Illustrative diagram, not live inference.</span></figcaption>
      <noscript><style>{`.loop-controls{display:none!important}`}</style></noscript>
    </figure>
  );
}
