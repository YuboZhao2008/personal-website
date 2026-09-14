"use client";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
export function MotionControl() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return (
    <button
      className="motion-control mono"
      aria-label={
        reduced
          ? "Reduced motion enabled"
          : paused
            ? "Resume ambient motion"
            : "Pause ambient motion"
      }
      aria-pressed={paused || reduced}
      disabled={reduced}
      onClick={() => {
        document.documentElement.dataset.motion = paused ? "running" : "paused";
        setPaused(!paused);
      }}
    >
      {paused || reduced ? <Play size={12} /> : <Pause size={12} />}
      <span>
        {reduced ? "MOTION REDUCED" : paused ? "MOTION PAUSED" : "MOTION ON"}
      </span>
    </button>
  );
}
