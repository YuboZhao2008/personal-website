"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const SceneCanvas = dynamic(() => import("./hero-scene-canvas"), {
  ssr: false,
});

function StaticSculpture() {
  return (
    <svg
      className="hero-scene-fallback"
      viewBox="0 0 600 600"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sculpture-metal" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#c8e6f8" />
          <stop offset=".4" stopColor="#5977a2" />
          <stop offset=".65" stopColor="#142d54" />
          <stop offset="1" stopColor="#a6c6e1" />
        </linearGradient>
        <radialGradient id="sculpture-core">
          <stop stopColor="#adcffd" />
          <stop offset=".5" stopColor="#638cf2" />
          <stop offset="1" stopColor="#152d59" />
        </radialGradient>
      </defs>
      <g transform="translate(300 300) rotate(-24)" fill="none">
        <ellipse
          rx="198"
          ry="118"
          stroke="url(#sculpture-metal)"
          strokeWidth="10"
        />
        <ellipse
          rx="128"
          ry="202"
          stroke="url(#sculpture-metal)"
          strokeWidth="7"
          transform="rotate(40)"
        />
        <ellipse
          rx="171"
          ry="188"
          stroke="#7198cc"
          strokeWidth="2"
          transform="rotate(-35)"
        />
        <ellipse
          rx="237"
          ry="143"
          stroke="#46658c"
          strokeWidth="1"
          strokeDasharray="2 10"
        />
        <path
          d="M0-78 68-39 68 39 0 78-68 39-68-39Z"
          fill="url(#sculpture-core)"
          stroke="#c6e4ff"
        />
        <path
          d="M0-78V0L68 39M0 0-68 39M0 0 68-39M0 0-68-39M0 0V78"
          stroke="#badcff"
          opacity=".65"
        />
        <circle cx="182" cy="47" r="14" fill="#b9d9fa" />
        <circle cx="-122" cy="-124" r="9" fill="#729ffa" />
        <circle cx="-68" cy="177" r="7" fill="#c3e4fd" />
      </g>
    </svg>
  );
}

class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** The static sculpture is present in server HTML; WebGL is a deferred enhancement. */
export function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const fail = useCallback(() => {
    setReady(false);
    setFailed(true);
  }, []);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let loaded = false;
    let visited = false;
    const sync = () => {
      if (visible && !document.hidden && !media.matches && document.documentElement.dataset.motion !== "paused") visited = true;
      setEnabled(
        loaded &&
          visited &&
          !media.matches &&
          typeof WebGL2RenderingContext !== "undefined",
      );
      setRunning(
        visible &&
          !document.hidden &&
          !media.matches &&
          document.documentElement.dataset.motion !== "paused",
      );
    };
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { rootMargin: "80px" },
    );
    const mutation = new MutationObserver(sync);
    intersection.observe(element);
    mutation.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    media.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    const timeout = window.setTimeout(() => {
      loaded = true;
      sync();
    }, 450);
    return () => {
      clearTimeout(timeout);
      intersection.disconnect();
      mutation.disconnect();
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return (
    <div
      ref={ref}
      className="hero-scene"
      data-scene-ready={enabled && ready && !failed}
      data-scene-running={enabled && running && !failed}
      role="img"
      aria-label="An abstract orbital sculpture: interconnected systems around a luminous geometric core"
    >
      <StaticSculpture />
      {enabled && !failed && (
        <SceneBoundary onFailure={fail}>
          <SceneCanvas running={running} onReady={setReady} onFailure={fail} />
        </SceneBoundary>
      )}
    </div>
  );
}
