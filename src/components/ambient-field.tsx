"use client";

import { useEffect, useRef, type CSSProperties } from "react";

// Deterministic positions keep the server and client render identical.
const particles = Array.from({ length: 24 }, (_, index) => ({
  x: ((index * 37 + 11) % 101),
  y: ((index * 23 + 7) % 97),
  duration: 15 + (index % 7) * 2,
  delay: -(index * 1.73),
  size: index % 5 === 0 ? 3 : 2,
}));

const palettes: Record<string, [string, string, string]> = {
  home: ["#416dff", "#2ccbb8", "#a9cfff"],
  about: ["#4876e8", "#7bbbc9", "#b1ccf5"],
  projects: ["#4c61fb", "#24baa9", "#8bb9ff"],
  experience: ["#315deb", "#26969d", "#99b8ec"],
  achievements: ["#6778ce", "#ac8769", "#b1c9f7"],
  skills: ["#3c67ed", "#29bdaa", "#a2bfff"],
  contact: ["#526cec", "#2fbfb7", "#d0b39b"],
};

/** Background light has its own motion plane, independent from every foreground animation. */
export function AmbientField() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const field = ref.current;
    if (!field) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let generation = 0;
    let dispose: (() => void) | undefined;

    async function configure() {
      const current = ++generation;
      dispose?.();
      dispose = undefined;
      const running = !reduced.matches && !document.hidden && document.documentElement.dataset.motion !== "paused";
      field!.dataset.running = String(running);
      if (!running) return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (current !== generation) return;
      gsap.registerPlugin(ScrollTrigger);
      let settle: ReturnType<typeof setTimeout> | undefined;
      let cancelPalette: (() => void) | undefined;
      const context = gsap.context(() => {
        const plane = field!.querySelector(".atmosphere-scroll-plane");
        const energy = field!.querySelector(".atmosphere-energy");
        gsap.to(plane, {
          y: -100,
          rotation: 7,
          ease: "none",
          scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1.8, invalidateOnRefresh: true },
        });
        const energize = gsap.quickTo(energy, "opacity", { duration: 0.8, ease: "power2.out" });
        ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            energize(Math.min(0.65, Math.abs(self.getVelocity()) / 6500));
            clearTimeout(settle);
            settle = setTimeout(() => energize(0), 160);
          },
        });
        const updatePalette = (id: string) => {
          const colors = palettes[id] || palettes.projects;
          cancelPalette?.();
          const tween = gsap.to(field, {
            "--atmosphere-primary": colors[0],
            "--atmosphere-secondary": colors[1],
            "--atmosphere-highlight": colors[2],
            duration: 1.6,
            overwrite: "auto",
            ease: "sine.inOut",
          });
          cancelPalette = () => { tween.kill(); };
          field!.dataset.section = id;
        };
        document.querySelectorAll<HTMLElement>("main > section[id]").forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 65%",
            end: "bottom 65%",
            onEnter: () => updatePalette(section.id),
            onEnterBack: () => updatePalette(section.id),
          });
        });
      }, field!);
      dispose = () => { clearTimeout(settle); cancelPalette?.(); context.revert(); };
    }
    const sync = () => {
      void configure().catch(() => {
        // CSS atmosphere remains functional if an optional choreography chunk cannot load.
      });
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      generation++;
      dispose?.();
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div ref={ref} className="ambient-field" data-running="false" aria-hidden="true">
      <div className="atmosphere-scroll-plane">
        <div className="atmosphere-ribbon atmosphere-ribbon-primary" />
        <div className="atmosphere-ribbon atmosphere-ribbon-secondary" />
        <div className="atmosphere-ribbon atmosphere-ribbon-ice" />
      </div>
      <div className="atmosphere-energy" />
      <div className="atmosphere-particles">
        {particles.map((particle, index) => (
          <i key={index} style={{
            "--particle-x": `${particle.x}%`,
            "--particle-y": `${particle.y}%`,
            "--particle-duration": `${particle.duration}s`,
            "--particle-delay": `${particle.delay}s`,
            "--particle-size": `${particle.size}px`,
          } as CSSProperties} />
        ))}
      </div>
      <svg className="atmosphere-grain" width="100%" height="100%">
        <filter id="atmosphere-grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#atmosphere-grain-filter)" opacity="0.3" />
      </svg>
    </div>
  );
}
