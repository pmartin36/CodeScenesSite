"use client";

import { useEffect, useState } from "react";

/** Right rail. Tracks which member heading is in view so the rail follows the reader. */
export function OnThisPage({ entries }: { entries: { id: string; label: string }[] }) {
  const [active, setActive] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    if (entries.length === 0) return;

    const targets = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Trip the moment a heading clears the fixed header, and keep the band short so
      // exactly one heading owns the rail at a time.
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 }
    );

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav className="docs-toc" aria-label="On this page">
      <p className="docs-nav-heading">On this page</p>
      <ul className="docs-nav-list">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              className="docs-toc-link"
              data-active={active === entry.id}
              href={`#${entry.id}`}
            >
              {entry.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
