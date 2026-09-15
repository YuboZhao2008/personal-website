"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation, profile } from "@/data/profile";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const mobileDialog = useRef<HTMLDialogElement>(null);
  const desktopNav = useRef<HTMLElement>(null);
  const sentinel = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting),
    );
    if (sentinel.current) observer.observe(sentinel.current);
    const breakpoint = matchMedia("(min-width: 601px)");
    const closeOnResize = () => {
      const hadDialogFocus = mobileDialog.current?.contains(
        document.activeElement,
      );
      mobileDialog.current?.close();
      if (breakpoint.matches && hadDialogFocus)
        desktopNav.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    };
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
    [{ href: "#home" }, ...navigation].forEach(({ href }) => {
      const section = document.querySelector(href);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function openNavigation() {
    // Native modality makes the background inert and handles Escape and focus return.
    toggle.current?.focus({ preventScroll: true });
    mobileDialog.current?.showModal();
    mobileDialog.current?.querySelector<HTMLAnchorElement>("nav a")?.focus();
    setOpen(true);
  }

  function navigationLinks(mobile = false) {
    return navigation.map(({ label, href }) => (
      <a
        key={href}
        href={href}
        aria-current={active === href ? "location" : undefined}
        onClick={
          mobile
            ? () => {
                mobileDialog.current?.close();
                const section = document.querySelector<HTMLElement>(href);
                section?.setAttribute("tabindex", "-1");
                section?.focus({ preventScroll: true });
              }
            : undefined
        }
      >
        {label}
      </a>
    ));
  }
  return (
    <>
      <span ref={sentinel} className="nav-sentinel" aria-hidden="true" />
      <header
        className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " menu-open" : ""}`}
      >
        <div className="nav-shell">
          <a
            href="#home"
            className="wordmark"
            aria-label={`${profile.name}, home`}
          >
            {profile.initials}
            <span>.</span>
          </a>
          <nav
            ref={desktopNav}
            id="main-navigation"
            className="navigation desktop-navigation"
            aria-label="Main navigation"
          >
            {navigationLinks()}
          </nav>
          <a className="nav-contact" href="#contact">
            Get in touch <ArrowUpRight size={14} />
          </a>
          <button
            ref={toggle}
            className="menu-toggle"
            aria-label="Open navigation"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-haspopup="dialog"
            onClick={openNavigation}
          >
            <Menu />
          </button>
        </div>
      </header>
      <dialog
        ref={mobileDialog}
        id="mobile-navigation"
        className="mobile-navigation-dialog"
        aria-label="Mobile navigation"
        onClose={(event) => setOpen(event.currentTarget.open)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            event.currentTarget.close();
        }}
      >
        <div className="mobile-navigation-heading">
          <span className="mono">NAVIGATION</span>
          <button
            className="menu-toggle"
            aria-label="Close navigation"
            onClick={() => mobileDialog.current?.close()}
          >
            <X />
          </button>
        </div>
        <nav className="navigation" aria-label="Mobile navigation">
          {navigationLinks(true)}
        </nav>
      </dialog>
    </>
  );
}
