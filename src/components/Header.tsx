"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Origin story", href: "#origin" },
  { label: "Help", href: "#help" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="container">
        <div className="relative flex items-center justify-between" style={{ height: 64 }}>
          {/* left: nav (desktop) */}
          <nav className="hidden md:flex items-center gap-7" style={{ flex: 1 }}>
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          {/* center: wordmark */}
          <a
            href="#top"
            aria-label="CodeScenes home"
            className="md:absolute md:left-1/2 md:-translate-x-1/2"
          >
            <Logo />
          </a>

          {/* right: CTA (desktop) */}
          <div
            className="hidden md:flex items-center justify-end gap-3"
            style={{ flex: 1 }}
          >
            <button
              type="button"
              className="btn btn-primary btn-sm is-disabled"
              aria-disabled="true"
              title="Launching soon"
            >
              <span className="soon-dot" aria-hidden="true" />
              Get the plugin
            </button>
          </div>

          {/* mobile: hamburger */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center"
            style={{ width: 40, height: 40, color: "var(--text)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* mobile menu panel */}
      {open ? (
        <div
          className="md:hidden container"
          style={{
            background: "rgba(10,11,14,0.96)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border)",
            paddingBottom: 24,
          }}
        >
          <nav className="flex flex-col gap-1" style={{ paddingTop: 8 }}>
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="nav-link"
                style={{ padding: "12px 4px", fontSize: "1.05rem" }}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              className="btn btn-primary is-disabled"
              aria-disabled="true"
              style={{ marginTop: 12 }}
            >
              <span className="soon-dot" aria-hidden="true" />
              Get the plugin
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
