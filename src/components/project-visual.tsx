"use client";
import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import type { Project } from "@/data/profile";
import { JarvisVisual } from "./jarvis-visual";

function MedicalVisual() {
  return (
    <div className="medical-visual">
      <div className="visual-topline mono">
        <span>VISION TRANSFORMER STUDY</span>
        <span>MR / 02</span>
      </div>
      <div className="medical-slice">
        <svg
          viewBox="0 0 440 310"
          role="img"
          aria-label="Abstract MRI-inspired contour study, with image patches representing transformer input"
        >
          <defs>
            <clipPath id="slice-clip">
              <ellipse cx="220" cy="150" rx="95" ry="120" />
            </clipPath>
          </defs>
          <g className="slice-guides">
            <path d="M50 150H390 M220 10V290 M108 25H90v20 M332 25h18v20 M90 255v20h18 M350 255v20h-18" />
            <ellipse cx="220" cy="150" rx="112" ry="133" />
          </g>
          <g className="slice-contours">
            {Array.from({ length: 14 }, (_, i) => (
              <path
                key={i}
                d={`M220 ${34 + i * 6} C${115 + i * 3} ${29 + i * 4}, ${91 + i * 6} ${224 - i * 5}, 220 ${271 - i * 6} C${349 - i * 6} ${224 - i * 5}, ${325 - i * 3} ${29 + i * 4}, 220 ${34 + i * 6}Z`}
              />
            ))}
            <path d="M220 48C188 90 251 106 216 145S247 219 220 258" />
          </g>
          <g className="slice-patches" clipPath="url(#slice-clip)">
            {Array.from({ length: 48 }, (_, i) => (
              <rect
                key={i}
                x={124 + (i % 6) * 32}
                y={24 + Math.floor(i / 6) * 32}
                width="28"
                height="28"
                className={i % 7 === 2 ? "patch-active ambient" : ""}
              />
            ))}
          </g>
          <path className="slice-scan ambient" d="M106 148H334" />
        </svg>
        <span className="slice-caption mono">
          ABSTRACT MRI / PATCH REPRESENTATION
        </span>
      </div>
      <div className="ml-pipeline">
        <div>
          <span className="mono">01 / PREPARE</span>
          <strong>Balance & augment</strong>
        </div>
        <ArrowRight size={14} />
        <div>
          <span className="mono">02 / TRAIN</span>
          <strong>MiniMaxViT</strong>
        </div>
        <ArrowRight size={14} />
        <div>
          <span className="mono">03 / EVALUATE</span>
          <strong>Beyond accuracy</strong>
        </div>
      </div>
      <div className="evaluation-lenses mono">
        <span>PRECISION</span>
        <span>RECALL</span>
        <span>F1</span>
        <span>CONFUSION MATRIX</span>
      </div>
    </div>
  );
}
const hand = [
  [123, 222],
  [97, 195],
  [77, 173],
  [61, 151],
  [48, 135],
  [103, 154],
  [98, 117],
  [95, 83],
  [93, 54],
  [128, 147],
  [128, 104],
  [128, 68],
  [128, 36],
  [152, 153],
  [158, 115],
  [163, 85],
  [168, 60],
  [174, 169],
  [188, 142],
  [198, 119],
  [207, 99],
];
const connections = [
  [0, 1, 2, 3, 4],
  [0, 5, 6, 7, 8],
  [5, 9, 10, 11, 12],
  [9, 13, 14, 15, 16],
  [13, 17, 18, 19, 20],
  [0, 17],
  [5, 9, 13, 17],
];
function GestureVisual() {
  const [gesture, setGesture] = useState(0);
  const states = ["Pointing", "Open hand", "Closed hand"];
  const points = hand.map(([x, y], i) => {
    if (gesture === 1 || i < 5 || (gesture === 0 && i <= 8)) return [x, y];
    return [x, y < 150 ? 156 + (i % 4) * 9 : y];
  });
  return (
    <div className="gesture-visual">
      <div className="visual-topline mono">
        <span>LANDMARK EXPLORER</span>
        <span>21 POINTS</span>
      </div>
      <div className="gesture-stage">
        <svg
          viewBox="0 0 440 265"
          role="img"
          aria-label={`Illustrative 21-point hand landmarks for a ${states[gesture].toLowerCase()} gesture`}
        >
          <path
            className="tracking-frame"
            d="M35 55V30h25 M210 30h25v25 M35 220v20h25 M210 240h25v-20"
          />
          <g className="hand-landmarks">
            {connections.map((line, i) => (
              <polyline
                key={i}
                points={line.map((n) => points[n].join(",")).join(" ")}
              />
            ))}
            {points.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i === 8 ? 4 : 2.7} />
            ))}
          </g>
          <path className="gesture-divider" d="M255 35V237" />
          <g className="drawing-output">
            <path
              className={
                gesture === 0 ? "drawing-trace ambient" : "drawing-trace"
              }
              d="M284 170C300 177 308 111 323 124S342 192 361 128 390 96 404 104"
              opacity={gesture === 2 ? 0.15 : 1}
            />
            <circle cx="404" cy="104" r="4" opacity={gesture === 0 ? 1 : 0} />
            <path d="M395 104h18 M404 95v18" opacity={gesture === 0 ? 1 : 0} />
          </g>
          <text className="gesture-svg-label" x="282" y="224">
            DRAWING PLANE
          </text>
        </svg>
        <span className="gesture-plane-label mono">Drawing plane</span>
        <span className="gesture-state mono" aria-live="polite">
          CLASS / {states[gesture].toUpperCase()}
        </span>
      </div>
      <div
        className="visual-controls"
        role="group"
        aria-label="Explore gesture landmarks"
      >
        {states.map((state, i) => (
          <button
            key={state}
            aria-pressed={gesture === i}
            onClick={() => setGesture(i)}
          >
            {state}
          </button>
        ))}
      </div>
      <p className="diagram-note mono">
        ILLUSTRATIVE TRACKING / SELECT A GESTURE
      </p>
    </div>
  );
}
function SimulationVisual() {
  const [step, setStep] = useState(0);
  return (
    <div className="simulation-visual">
      <div className="visual-topline mono">
        <span>WORLD-STATE EXPLORER</span>
        <span aria-live="polite">t = {step}</span>
      </div>
      <div className="world-stage">
        <div
          className="world-grid"
          role="img"
          aria-label={`Illustrative world-state grid at step ${step}`}
        >
          {Array.from({ length: 80 }, (_, i) => {
            const occupied = [
              (22 + step * 3) % 80,
              (45 + step * 2) % 80,
              (61 - step * 4 + 80) % 80,
              (17 + step * 7) % 80,
            ].includes(i);
            return (
              <span
                key={i}
                className={
                  occupied
                    ? "entity"
                    : (i * 13 + step * 3) % 19 === 0
                      ? "terrain"
                      : ""
                }
              >
                <i />
              </span>
            );
          })}
        </div>
        <div className="world-branches mono">
          <span>STATE t</span>
          <div>
            <span>t + 1</span>
            <span>t + 2</span>
            <span>t + n</span>
          </div>
        </div>
      </div>
      <div className="simulation-controls">
        <span className="mono">POSSIBLE FUTURES</span>
        <button onClick={() => setStep((step + 1) % 8)}>
          Step state <ArrowRight size={14} />
        </button>
        <button aria-label="Reset world state" onClick={() => setStep(0)}>
          <RotateCcw size={14} />
        </button>
      </div>
      <p className="diagram-note mono">ILLUSTRATIVE STATE TRANSITIONS</p>
    </div>
  );
}
export function ProjectVisual({ variant }: { variant: Project["visual"] }) {
  return (
    <div className={`project-visual preview-${variant}`}>
      {variant === "intelligence" ? (
        <JarvisVisual />
      ) : variant === "medical" ? (
        <MedicalVisual />
      ) : variant === "gesture" ? (
        <GestureVisual />
      ) : (
        <SimulationVisual />
      )}
    </div>
  );
}
