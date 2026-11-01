"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Plus, X } from "lucide-react";
import { navigation, profile } from "@/data/profile";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const toggle = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`);
    }, { rootMargin: "-15% 0px -55% 0px" });
    [{ href: "#home" }, ...navigation].forEach(({ href }) => {
      const section = document.querySelector(href);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <div className="nav-shell">
          <a href="#home" className="identity-link" aria-label={`${profile.name}, home`}><span className="identity-mark" aria-hidden="true">yz</span><span>{profile.name}</span></a>
          <span className="nav-discipline">Software / AI / Robotics</span>
          <a className="nav-projects" href="#projects">Selected work <ArrowUpRight size={16} aria-hidden="true" /></a>
          <button ref={toggle} className="menu-toggle" aria-label="Open navigation" aria-expanded={open} aria-controls="mobile-navigation" aria-haspopup="dialog" onClick={() => {
            toggle.current?.focus({ preventScroll: true });
            dialog.current?.showModal();
            setOpen(true);
          }}>Index <Plus size={20} aria-hidden="true" /></button>
        </div>
        <noscript><style>{`.menu-toggle {display:none!important}.site-header{position:static!important}`}</style><nav className="no-script-navigation" aria-label="Main navigation">{navigation.map(({ label, href }) => <a key={href} href={href}>{label}</a>)}</nav></noscript>
      </header>
      <dialog ref={dialog} id="mobile-navigation" className="mobile-navigation-dialog" aria-label="Site index" onClose={() => setOpen(false)} onKeyDown={(event) => {
        // Keep Tab inside the index even when Chromium would otherwise move to browser chrome.
        if (event.key !== "Tab") return;
        const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]"));
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }} onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const box = event.currentTarget.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.current?.close();
      }}>
        <div className="mobile-navigation-heading"><span>Inside this portfolio</span><button className="menu-toggle" aria-label="Close navigation" onClick={() => dialog.current?.close()}><X size={22} /></button></div>
        <nav className="navigation" aria-label="Main navigation">
          {navigation.map(({ label, href }) => <a key={href} href={href} aria-current={active === href ? "location" : undefined} onClick={() => {
            dialog.current?.close();
            const section = document.querySelector<HTMLElement>(href);
            section?.setAttribute("tabindex", "-1");
            section?.focus({ preventScroll: true });
          }}>{label}<ArrowUpRight size={22} aria-hidden="true" /></a>)}
        </nav>
        <p className="index-note">{profile.university}<br />{profile.location}</p>
      </dialog>
    </>
  );
}
