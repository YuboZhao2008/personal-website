"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import type { Project } from "@/data/profile";
import { projectEvidence } from "@/data/links";
import { ProjectVisual } from "./project-visual";

/** The scroll gallery is progressive enhancement over six readable project panels. */
export function RollingProjectGallery({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<((index: number) => void) | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 901px) and (min-height: 650px)");
    const panels = Array.from(root.querySelectorAll<HTMLElement>(".gallery-panel"));
    const track = root.querySelector<HTMLElement>(".gallery-track")!;
    const visibleObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { (entry.target as HTMLElement).dataset.visible = String(entry.isIntersecting); });
    }, { threshold: 0.05 });
    root.querySelectorAll<HTMLElement>(".gallery-panel, .gallery-record-study").forEach((element) => {
      element.dataset.visible = "false";
      visibleObserver.observe(element);
    });
    root.dataset.pageVisible = String(!document.hidden);
    const syncVisibility = () => { root.dataset.pageVisible = String(!document.hidden); };
    document.addEventListener("visibilitychange", syncVisibility);
    let hashFrame = 0;
    const initialHash = window.location.hash;
    const alignInitialSection = () => {
      if (!initialHash || window.location.hash !== initialHash) return;
      const id = initialHash.slice(1);
      if (projects.some((project) => `project-${project.id}` === id)) return;
      const section = document.getElementById(id);
      if (!section?.closest("main")) return;
      cancelAnimationFrame(hashFrame);
      hashFrame = requestAnimationFrame(() => {
        hashFrame = requestAnimationFrame(() => section.scrollIntoView({ block: "start", behavior: "instant" }));
      });
    };
    const revealHashRecord = () => {
      const id = window.location.hash.slice(1);
      if (!projects.some((project) => `project-${project.id}` === id)) return;
      const record = document.getElementById(id) as HTMLDetailsElement | null;
      if (!record) return;
      record.open = true;
      cancelAnimationFrame(hashFrame);
      hashFrame = requestAnimationFrame(() => record.scrollIntoView({ block: "start", behavior: "instant" }));
    };
    window.addEventListener("hashchange", revealHashRecord);
    revealHashRecord();
    let configuring = false;
    let modeFrame = 0;
    const updateActive = (next: number) => {
      if (configuring) return;
      if (activeRef.current !== next) {
        activeRef.current = next;
        setActive(next);
      }
    };

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        let context: ReturnType<typeof gsap.context> | undefined;
        const reset = () => {
          context?.revert();
          panels.forEach((panel) => {
            panel.removeAttribute("style");
            panel.removeAttribute("aria-hidden");
            panel.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => link.removeAttribute("tabindex"));
          });
        };
        let configured = false;
        const configure = () => {
          cancelAnimationFrame(modeFrame);
          const bounds = track.getBoundingClientRect();
          const preservePosition = configured && bounds.top < window.innerHeight * .75 && bounds.bottom > window.innerHeight * .25;
          let selected = activeRef.current;
          if (preservePosition && root.dataset.mode !== "desktop") {
            const selectedBounds = panels[selected].getBoundingClientRect();
            let nearest = Math.abs(selectedBounds.top + selectedBounds.height / 2 - window.innerHeight / 2);
            panels.forEach((panel, index) => {
              const rect = panel.getBoundingClientRect();
              const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
              if (distance < nearest - 1) { selected = index; nearest = distance; }
            });
          }
          configuring = true;
          reset();
          const finish = () => {
            ScrollTrigger.refresh();
            configuring = false;
            configured = true;
            if (preservePosition) {
              updateActive(selected);
              modeFrame = requestAnimationFrame(() => selectionRef.current?.(selected));
            }
          };
          const paused = document.documentElement.dataset.motion === "paused";
          const mode = reduced.matches || paused ? "static" : desktop.matches ? "desktop" : "mobile";
          root.dataset.mode = mode;
          selectionRef.current = (index) => {
            updateActive(index);
            panels[index]?.scrollIntoView({ behavior: "instant", block: "center" });
          };
          if (mode === "static") {
            finish();
            return;
          }
          context = gsap.context(() => {
            if (mode === "mobile") {
              panels.forEach((panel) => {
                gsap.fromTo(panel, { rotateX: 9, y: 32, z: -50 }, {
                  rotateX: -6, y: -18, z: 0,
                  ease: "none",
                  scrollTrigger: {
                    trigger: panel,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: .6,

                  },
                });
              });
              ScrollTrigger.create({
                trigger: track,
                start: "top bottom",
                end: "bottom top",
                onUpdate: () => {
                  let closest = 0;
                  let distance = Infinity;
                  panels.forEach((panel, index) => {
                    const bounds = panel.getBoundingClientRect();
                    const current = Math.abs(bounds.top + bounds.height / 2 - window.innerHeight / 2);
                    if (current < distance) { closest = index; distance = current; }
                  });
                  updateActive(closest);
                },
              });
              return;
            }
            const position = { value: 0 };
            const draw = () => {
              if (document.hidden) return;
              const next = Math.max(0, Math.min(projects.length - 1, Math.round(position.value)));
              updateActive(next);
              panels.forEach((panel, index) => {
                const delta = index - position.value;
                const angle = delta * 38;
                const radians = angle * Math.PI / 180;
                const y = Math.sin(radians) * 800;
                const z = (Math.cos(radians) - 1) * 800;
                const visible = Math.abs(delta) < 2.3;
                gsap.set(panel, {
                  y, z, rotateX: -angle,
                  opacity: 1,
                  visibility: visible ? "visible" : "hidden",
                  zIndex: 20 - Math.round(Math.abs(delta) * 4),
                });
                panel.style.setProperty("--gallery-dim", index === next ? "0" : String(Math.min(.65, Math.abs(delta) * .35)));
                panel.setAttribute("aria-hidden", String(index !== next));
                panel.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => { link.tabIndex = index === next ? 0 : -1; });
              });
              root.style.setProperty("--gallery-progress", String(position.value / (projects.length - 1)));
            };
            const animation = gsap.to(position, {
              value: projects.length - 1,
              ease: "none",
              onUpdate: draw,
              scrollTrigger: {
                trigger: track,
                start: "top top",
                end: "bottom bottom",
                scrub: .7,
                invalidateOnRefresh: true,
                onRefresh: draw,
              },
            });
            draw();
            selectionRef.current = (index) => {
              const trigger = animation.scrollTrigger;
              if (!trigger) return;
              const destination = trigger.start + (trigger.end - trigger.start) * index / (projects.length - 1);
              window.scrollTo({ top: destination, behavior: "instant" });
            };
          }, root);
          finish();
        };
        let recordFrame = 0;
        const refreshRecordLayout = (event: Event) => {
          if (!(event.target instanceof HTMLDetailsElement) || !event.target.matches(".gallery-record")) return;
          cancelAnimationFrame(recordFrame);
          recordFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
        };
        root.addEventListener("toggle", refreshRecordLayout, true);
        const observer = new MutationObserver(configure);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
        reduced.addEventListener("change", configure);
        desktop.addEventListener("change", configure);
        const visibleAgain = () => { if (!document.hidden) ScrollTrigger.refresh(); };
        document.addEventListener("visibilitychange", visibleAgain);
        configure();
        revealHashRecord();
        // The enhanced gallery changes document height. Realign the initial
        // section bookmark once, after layout/ScrollTrigger have settled.
        alignInitialSection();
        cleanup = () => {
          observer.disconnect();
          root.removeEventListener("toggle", refreshRecordLayout, true);
          cancelAnimationFrame(recordFrame);
          cancelAnimationFrame(modeFrame);
          reduced.removeEventListener("change", configure);
          desktop.removeEventListener("change", configure);
          document.removeEventListener("visibilitychange", visibleAgain);
          reset();
          selectionRef.current = null;
          root.dataset.mode = "static";
        };
      },
    );
    return () => {
      disposed = true;
      cleanup?.();
      visibleObserver.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
      window.removeEventListener("hashchange", revealHashRecord);
      cancelAnimationFrame(hashFrame);
    };
  }, [projects]);

  const openRecord = (projectId: string) => {
    const record = document.getElementById(`project-${projectId}`) as HTMLDetailsElement | null;
    if (record) record.open = true;
  };

  return (
    <div className="rolling-gallery" data-mode="static" ref={rootRef}>
      <div className="gallery-track">
        <div className="gallery-stage">
          <header className="gallery-heading">
            <p className="eyebrow">Selected projects</p>
            <h2>Ideas in<br /><span>motion.</span></h2>
            <a className="gallery-skip" href="#project-records">Browse every project <ArrowDown size={16} /></a>
          </header>
          <div className="gallery-orbit" aria-label="Selected project gallery">
            {projects.map((project, index) => (
              <article key={project.id} className={`gallery-panel gallery-panel-${project.visual}`} data-project={project.id} data-active={active === index}
                onPointerMove={(event) => {
                  if (event.pointerType !== "mouse" || document.documentElement.dataset.motion === "paused" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                  const bounds = event.currentTarget.getBoundingClientRect();
                  event.currentTarget.style.setProperty("--pointer-x", `${((event.clientX - bounds.left) / bounds.width - .5) * 12}px`);
                  event.currentTarget.style.setProperty("--pointer-y", `${((event.clientY - bounds.top) / bounds.height - .5) * 10}px`);
                }}
                onPointerLeave={(event) => {
                  event.currentTarget.style.setProperty("--pointer-x", "0px");
                  event.currentTarget.style.setProperty("--pointer-y", "0px");
                }}
              >
                <div className="gallery-panel-top"><span>{project.title}</span><span className="mono">0{index + 1} / 0{projects.length}</span></div>
                <div className="gallery-preview">
                  <div className="gallery-preview-float"><Image src={`/project-previews/${project.id}.webp`} alt={`${project.title}: illustrative technical architecture study`} width={1000} height={700} unoptimized loading="lazy" /></div>
                </div>
                <div className="gallery-panel-caption">
                  <div><h3>{project.title}</h3><p>{project.subtitle}</p></div>
                  <a href={`#project-${project.id}`} onClick={() => openRecord(project.id)} aria-label={`Explore ${project.title}`}><ArrowUpRight size={25} /></a>
                </div>
              </article>
            ))}
          </div>
          <div className="gallery-current" aria-live="polite" aria-atomic="true">
            <span className="gallery-current-category mono">{projects[active].category}</span>
            <h3>{projects[active].title}</h3>
            <p>{projects[active].description}</p>
            <a href={`#project-${projects[active].id}`} onClick={() => openRecord(projects[active].id)}>Explore the project <ArrowUpRight size={17} /></a>
          </div>
          <nav className="gallery-navigation" aria-label="Choose a project">
            <div className="gallery-selector-list">
              {projects.map((project, index) => (
                <button key={project.id} className="gallery-selector" aria-label={`Show project ${project.title}`} aria-pressed={active === index} onClick={() => selectionRef.current?.(index)}>
                  <span className="mono">0{index + 1}</span><span>{project.title}</span>
                </button>
              ))}
            </div>
            <div className="gallery-scroll-note"><span>Scroll to explore</span><ArrowDown size={15} /></div>
          </nav>
          <span className="gallery-progress" aria-hidden="true" />
        </div>
      </div>
      <div id="project-records" className="gallery-records section-shell">
        <div className="gallery-records-heading"><p className="eyebrow">Inside the work</p><p>Architecture, decisions, and the details.</p></div>
        {projects.map((project, index) => (
          <details key={project.id} id={`project-${project.id}`} className="gallery-record project-showcase">
            <summary><span className="mono">0{index + 1}</span><h3>{project.title}</h3><span className="gallery-record-label">Project details</span><Plus size={22} /></summary>
            <div className="gallery-record-content">
              <div className="gallery-record-copy">
                <p className="project-meta mono">{project.category}</p>
                <p className="project-subtitle">{project.subtitle}</p>
                <p className="project-description">{project.description}</p>
                <ul className="project-technologies">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
                {project.evaluation && <div className="project-evaluation"><strong>{project.evaluation.result}</strong><span>{project.evaluation.context}</span></div>}
                <div className="project-details"><h4>Engineering notes</h4><ul>{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></div>
                {projectEvidence(project).map((link) => <a key={link.label} className="project-link" href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} for ${project.title}`}>{link.label}<ArrowUpRight size={16} /></a>)}
              </div>
              <div className="gallery-record-study"><ProjectVisual variant={project.visual} /><p className="gallery-study-note">Illustrative technical study · explore the system</p></div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
