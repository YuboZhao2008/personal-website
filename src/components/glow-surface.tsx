"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** A single desktop-only light. Pointer events schedule work; there is no animation loop. */
export function GlowSurface({ children }: { children: ReactNode }) {
  const surface = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = surface.current;
    const lamp = light.current;
    if (!element || !lamp) return;
    const query = matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    let left = 0;
    let top = 0;
    const leave = () => {
      cancelAnimationFrame(frame);
      element.removeAttribute("data-lit");
    };
    const enter = () => {
      if (!query.matches) return;
      const rect = element.getBoundingClientRect();
      left = rect.left + window.scrollX;
      top = rect.top + window.scrollY;
    };
    const move = (event: PointerEvent) => {
      if (!query.matches || event.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        lamp.style.transform = `translate(${event.pageX - left - 130}px, ${event.pageY - top - 130}px)`;
        element.setAttribute("data-lit", "");
      });
    };
    element.addEventListener("pointerenter", enter);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    query.addEventListener("change", leave);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointerenter", enter);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      query.removeEventListener("change", leave);
    };
  }, []);
  return (
    <div className="glow-surface" ref={surface}>
      <span ref={light} className="pointer-light" aria-hidden="true" />
      {children}
    </div>
  );
}
