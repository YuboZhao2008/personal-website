"use client";

import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/** A small physical response on the exhibit frame; diagrams keep their own animation state. */
export function ProjectSurface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const permitted = useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const lift = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 160, damping: 24, mass: 0.6 });
  const rotateY = useSpring(y, { stiffness: 160, damping: 24, mass: 0.6 });
  const translateY = useSpring(lift, {
    stiffness: 160,
    damping: 24,
    mass: 0.6,
  });

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      permitted.current =
        pointer.matches &&
        !reduced.matches &&
        !document.hidden &&
        document.documentElement.dataset.motion !== "paused";
      if (!permitted.current) {
        x.set(0);
        y.set(0);
        lift.set(0);
        rotateX.jump(0);
        rotateY.jump(0);
        translateY.jump(0);
      }
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    reduced.addEventListener("change", sync);
    pointer.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      pointer.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [x, y, lift, rotateX, rotateY, translateY]);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!permitted.current || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((0.5 - (event.clientY - bounds.top) / bounds.height) * 3);
    y.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 3);
    lift.set(-2);
  }
  function reset() {
    x.set(0);
    y.set(0);
    lift.set(0);
  }

  return (
    <motion.div
      className={className}
      onPointerMove={move}
      onPointerLeave={reset}
      onBlur={reset}
      style={{ rotateX, rotateY, y: translateY, transformPerspective: 1200 }}
    >
      {children}
    </motion.div>
  );
}
