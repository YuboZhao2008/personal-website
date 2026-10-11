"use client";

import { useEffect } from "react";

/** GSAP owns only explicit choreography hooks, leaving CSS and React interactions independent. */
export function PortfolioMotion() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = matchMedia("(pointer: fine)");
    let dispose: (() => void) | undefined;
    let generation = 0;
    let entrancePlayed = false;

    const configure = async () => {
      const current = ++generation;
      dispose?.();
      dispose = undefined;
      if (
        reduced.matches ||
        document.hidden ||
        document.documentElement.dataset.motion === "paused"
      )
        return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (current !== generation) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        if (!entrancePlayed) {
          gsap.from("[data-hero-reveal]", {
            y: 28,
            opacity: 0.3,
            duration: 1.15,
            stagger: 0.11,
            ease: "power3.out",
            clearProps: "transform,opacity",
          });
          entrancePlayed = true;
        }
        gsap.utils.toArray<HTMLElement>("[data-hero-drift]").forEach((element) => {
          const direction = element.dataset.heroDrift === "left" ? -1 : 1;
          gsap.to(element, {
            x: direction * (finePointer.matches ? 35 : 16),
            rotation: direction * 1.5,
            transformOrigin: "50% 50%",
            ease: "none",
            scrollTrigger: {
              trigger: element.closest("section") || element,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-kinetic-heading]").forEach((element) => {
          gsap.fromTo(element, {
            y: 30,
            rotateX: 12,
            transformPerspective: 1000,
            transformOrigin: "50% 100%",
            clipPath: "inset(0% 0% 24% 0%)",
          }, {
            y: 0,
            rotateX: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 96%",
              end: "top 62%",
              scrub: 0.5,
            },
          });
        });
        if (finePointer.matches) {
          gsap.utils
            .toArray<HTMLElement>("[data-parallax]")
            .forEach((element) => {
              const distance = Math.min(
                80,
                Math.max(0, Number(element.dataset.parallax || 0.1) * 400),
              );
              gsap.to(element, {
                y: distance,
                ease: "none",
                scrollTrigger: {
                  trigger: element.closest("section") || element,
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.7,
                },
              });
            });
        }
        gsap.utils
          .toArray<HTMLElement>("[data-scroll-line]")
          .forEach((element) => {
            gsap.from(element, {
              scaleX: 0,
              transformOrigin: "left center",
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top 92%",
                end: "top 55%",
                scrub: true,
              },
            });
          });
      });
      let destroySmooth: (() => void) | undefined;
      dispose = () => {
        destroySmooth?.();
        context.revert();
      };
      if (finePointer.matches) {
        const { default: Lenis } = await import("lenis");
        if (current !== generation) return;
        const lenis = new Lenis({
          duration: 1.05,
          smoothWheel: true,
          syncTouch: false,
          anchors: false,
        });
        const tick = (seconds: number) => lenis.raf(seconds * 1000);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        destroySmooth = () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
        };
      }
      ScrollTrigger.refresh();
    };
    const sync = () => {
      document.documentElement.dataset.pageHidden = String(document.hidden);
      void configure();
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    reduced.addEventListener("change", sync);
    finePointer.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      generation++;
      delete document.documentElement.dataset.pageHidden;
      dispose?.();
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      finePointer.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return null;
}
