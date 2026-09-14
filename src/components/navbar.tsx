"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation, profile } from "@/data/profile";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const sentinel = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting),
    );
    if (sentinel.current) observer.observe(sentinel.current);
    const breakpoint = matchMedia("(min-width: 601px)");
    const closeOnResize = () => setOpen(false);
    breakpoint.addEventListener("change", closeOnResize);
    return () => {
      observer.disconnect();
      breakpoint.removeEventListener("change", closeOnResize);
    };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
    );
    navigation.forEach(({ href }) => {
      const section = document.querySelector(href);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <>
      <span ref={sentinel} className="nav-sentinel" aria-hidden="true" />
      <header
        className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " menu-open" : ""}`}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setOpen(false);
        }}
      >
        <div className="nav-shell">
          <a
            href="#home"
            className="wordmark"
            aria-label={`${profile.name}, home`}
            onClick={() => setOpen(false)}
          >
            {profile.initials}
            <span>.</span>
          </a>
          <nav
            id="main-navigation"
            className={open ? "navigation is-open" : "navigation"}
            aria-label="Main navigation"
          >
            {navigation.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                aria-current={active === href ? "location" : undefined}
                onClick={() => {
                  setOpen(false);
                  if (matchMedia("(max-width: 600px)").matches) {
                    const section = document.querySelector<HTMLElement>(href);
                    section?.setAttribute("tabindex", "-1");
                    section?.focus({ preventScroll: true });
                  }
                }}
              >
                {label}
              </a>
            ))}
          </nav>
          <a className="nav-contact" href="#contact">
            Let’s talk <ArrowUpRight size={14} />
          </a>
          <button
            ref={toggle}
            className="menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}
