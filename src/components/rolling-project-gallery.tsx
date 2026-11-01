"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import type { Project } from "@/data/profile";
import { projectEvidence } from "@/data/links";
import { ProjectVisual } from "./project-visual";
import { ProjectArtwork } from "./project-artwork";

/** A directly controlled exhibition. Scrolling always belongs to the reader. */
export function RollingProjectGallery({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const project = projects[active];

  useEffect(() => {
    let frame = 0;
    const revealRecord = () => {
      const id = window.location.hash.slice(1);
      const index = projects.findIndex((item) => `project-${item.id}` === id);
      if (index < 0) return;
      const record = document.getElementById(id) as HTMLDetailsElement | null;
      if (!record) return;
      record.open = true;
      setActive(index);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => record.scrollIntoView({ block: "start", behavior: "instant" }));
    };
    revealRecord();
    window.addEventListener("hashchange", revealRecord);
    const visibility = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { (entry.target as HTMLElement).dataset.visible = String(entry.isIntersecting); });
    });
    root.current?.querySelectorAll(".gallery-record-study").forEach((element) => visibility.observe(element));
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", revealRecord);
      visibility.disconnect();
    };
  }, [projects]);

  const choose = (index: number) => {
    setActive((index + projects.length) % projects.length);
    if (matchMedia("(max-width: 740px)").matches) {
      document.getElementById("exhibition-panel")?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  };
  const openRecord = (id: string) => {
    const record = document.getElementById(`project-${id}`) as HTMLDetailsElement | null;
    if (record) record.open = true;
  };

  return (
    <div className="project-exhibition" ref={root}>
      <div className="section-shell exhibition-shell">
        <header className="exhibition-heading">
          <h2>Selected work</h2>
          <p>From a game engine to a vision model.<br />Six ways of connecting software to the world.</p>
        </header>
        <div className="exhibition-layout">
          <div className="exhibition-index">
            <div className="exhibition-selector-list" role="group" aria-label="Choose a project">
              {projects.map((item, index) => (
                <button key={item.id} className="exhibition-selector" aria-pressed={index === active}
                  aria-controls="exhibition-panel" onClick={() => choose(index)}>
                  <span className="project-position">{String(index + 1).padStart(2, "0")}</span>
                  <span>{item.title}</span><ArrowUpRight size={18} aria-hidden="true" />
                </button>
              ))}
            </div>
            <a className="exhibition-browse" href="#project-records">Read the engineering notes <ArrowDown size={16} aria-hidden="true" /></a>
          </div>
          <div className="exhibition-stage" id="exhibition-panel" role="region" aria-label="Selected project">
            <div className="exhibition-artwork" onPointerDown={(event) => {
              if (event.pointerType === "touch") pointerStart.current = { x: event.clientX, y: event.clientY };
            }} onPointerCancel={() => { pointerStart.current = null; }} onPointerUp={(event) => {
              const start = pointerStart.current;
              pointerStart.current = null;
              if (!start) return;
              const dx = event.clientX - start.x;
              const dy = event.clientY - start.y;
              if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) choose(active + (dx < 0 ? 1 : -1));
            }}>
              <figure className="exhibition-figure" key={project.id}>
                <ProjectArtwork variant={project.visual} />
              </figure>
              <div className="exhibition-art-caption"><span>Illustrative architecture study</span><span>{String(active + 1).padStart(2, "0")} / 06</span></div>
            </div>
            <div className="exhibition-copy">
              <div className="exhibition-project-heading"><h3>{project.title}</h3>
                <div className="exhibition-arrows"><button onClick={() => choose(active - 1)} aria-label="Previous project"><ArrowLeft size={20} /></button><button onClick={() => choose(active + 1)} aria-label="Next project"><ArrowRight size={20} /></button></div>
              </div>
              <p>{project.description}</p>
              <a href={`#project-${project.id}`} onClick={() => openRecord(project.id)}>Explore the project <ArrowUpRight size={18} aria-hidden="true" /></a>
            </div>
            <span className="sr-only" aria-live="polite" aria-atomic="true">Project {active + 1} of {projects.length}: {project.title}</span>
          </div>
        </div>
        <noscript><style>{`.exhibition-selector-list,.exhibition-arrows {display:none!important}`}</style><p>Open any project below to see its architecture, details and illustrative study.</p></noscript>
      </div>
      <div id="project-records" className="gallery-records section-shell">
        <div className="gallery-records-heading"><h3>Inside the work</h3><p>Architecture, decisions, and the details.</p></div>
        {projects.map((item, index) => (
          <details key={item.id} id={`project-${item.id}`} className="gallery-record project-showcase">
            <summary><span className="project-position">{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><span className="gallery-record-label">Project notes</span><Plus size={22} aria-hidden="true" /></summary>
            <div className="gallery-record-content">
              <div className="gallery-record-copy">
                <p className="project-subtitle">{item.subtitle}</p>
                <p className="project-description">{item.description}</p>
                <ul className="project-technologies">{item.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
                {item.evaluation && <div className="project-evaluation"><strong>{item.evaluation.result}</strong><span>{item.evaluation.context}</span></div>}
                <div className="project-details"><h4>Engineering notes</h4><ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></div>
                {projectEvidence(item).map((link) => <a key={link.label} className="project-link" href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} for ${item.title}`}>{link.label}<ArrowUpRight size={16} aria-hidden="true" /></a>)}
              </div>
              <div className="gallery-record-study"><ProjectVisual variant={item.visual} /><p className="gallery-study-note">Illustrative technical study. Explore the system.</p></div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
