"use client";

import { useEffect, useRef } from "react";

/** Scroll position drives the path and marker together, including reverse scrolling. */
export function JourneyLine() {
  const section = useRef<HTMLElement>(null);
  const path = useRef<SVGPathElement>(null);
  const dot = useRef<SVGGElement>(null);

  useEffect(() => {
    const element = section.current;
    const line = path.current;
    const marker = dot.current;
    if (!element || !line || !marker) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let generation = 0;
    let cleanup: (() => void) | undefined;
    const length = line.getTotalLength();
    const render = (progress: number) => {
      const p = Math.max(0, Math.min(1, progress));
      line.style.strokeDasharray = String(length);
      line.style.strokeDashoffset = String(length * (1 - p));
      const point = line.getPointAtLength(length * p);
      marker.setAttribute("transform", `translate(${point.x} ${point.y})`);
      element.dataset.journeyProgress = p.toFixed(4);
    };
    const configure = async () => {
      const current = ++generation;
      cleanup?.();
      cleanup = undefined;
      if (document.hidden) return;
      if (reduced.matches || document.documentElement.dataset.motion === "paused") {
        render(1);
        return;
      }
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (current !== generation) return;
      gsap.registerPlugin(ScrollTrigger);
      const trigger = ScrollTrigger.create({
        trigger: element,
        start: "top 85%",
        end: "bottom 35%",
        onUpdate: (self) => render(self.progress),
        onRefresh: (self) => render(self.progress),
      });
      render(trigger.progress);
      cleanup = () => trigger.kill();
    };
    const sync = () => { void configure(); };
    const mutation = new MutationObserver(sync);
    mutation.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    const intersection = new IntersectionObserver(([entry]) => { element.dataset.visible = String(entry.isIntersecting); });
    intersection.observe(element);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      generation++;
      cleanup?.();
      mutation.disconnect();
      intersection.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <section ref={section} className="journey-section section-shell" aria-labelledby="journey-heading" data-journey-progress="1">
      <div className="journey-heading">
        <p className="eyebrow">How the parts connect</p>
        <h2 id="journey-heading" data-kinetic-heading>From signal<br />to system.</h2>
      </div>
      <div className="journey-map">
        <svg viewBox="0 0 1000 260" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="journey-light" x1="0" x2="1000" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7195ff" /><stop offset=".52" stopColor="#9ef5e2" /><stop offset="1" stopColor="#b1c1ff" />
            </linearGradient>
          </defs>
          <path className="journey-guide" d="M24 180C165 180 158 56 314 64S487 227 655 186 790 44 976 62" />
          <path ref={path} className="journey-trace" d="M24 180C165 180 158 56 314 64S487 227 655 186 790 44 976 62" />
          <g ref={dot} className="journey-dot" transform="translate(976 62)">
            <circle className="journey-pulse ambient" r="17" /><circle r="5" fill="#e0fff7" />
          </g>
        </svg>
        <div className="journey-stations">
          <div><span>Perceive</span><p>Vision & signals</p></div>
          <div><span>Reason</span><p>Models & decisions</p></div>
          <div><span>Interact</span><p>Software & control</p></div>
        </div>
      </div>
    </section>
  );
}
