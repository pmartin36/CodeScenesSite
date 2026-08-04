"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

export type SidebarType = {
  id: string;
  displayName: string;
  members: { id: string; name: string }[];
};

/**
 * The reference nav. The whole surface is 13 types, so filtering runs client-side over the full
 * member list rather than through a search index: it matches members, not just pages, and answers
 * on the first keystroke.
 */
export function DocsSidebar({ types }: { types: SidebarType[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const needle = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!needle) return null;
    const rows: {
      typeId: string;
      typeName: string;
      memberId?: string;
      label: string;
    }[] = [];
    for (const type of types) {
      if (type.displayName.toLowerCase().includes(needle)) {
        rows.push({
          typeId: type.id,
          typeName: type.displayName,
          label: type.displayName,
        });
      }
      for (const member of type.members) {
        if (member.name.toLowerCase().includes(needle)) {
          rows.push({
            typeId: type.id,
            typeName: type.displayName,
            memberId: member.id,
            label: member.name,
          });
        }
      }
    }
    return rows.slice(0, 40);
  }, [needle, types]);

  return (
    <div className="docs-nav">
      {/* Below the sidebar breakpoint the nav would otherwise push the page's own content
          off the first screen, so it collapses behind this toggle. */}
      <button
        type="button"
        className="docs-nav-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>Reference</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d={open ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="docs-nav-panel" data-open={open}>
        <input
          type="search"
          className="docs-filter"
          placeholder="Filter types and members"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Filter the API reference"
        />

        {results ? (
          <ul className="docs-nav-list" style={{ marginTop: 16 }}>
            {results.length === 0 ? (
              <li className="docs-nav-empty">No match</li>
            ) : (
              results.map((row) => (
                <li key={`${row.typeId}-${row.memberId ?? ""}`}>
                  <a
                    className="docs-nav-link"
                    href={`/docs/api/${row.typeId}/${row.memberId ? `#${row.memberId}` : ""}`}
                  >
                    {row.label}
                    {row.memberId ? (
                      <span className="docs-nav-owner">{row.typeName}</span>
                    ) : null}
                  </a>
                </li>
              ))
            )}
          </ul>
        ) : (
          <nav>
            <p className="docs-nav-heading">Reference</p>
            <ul className="docs-nav-list">
              <li>
                <a
                  className="docs-nav-link"
                  data-active={pathname === "/docs" || pathname === "/docs/"}
                  href="/docs/"
                >
                  Overview
                </a>
              </li>
              <li>
                <a
                  className="docs-nav-link"
                  data-active={pathname?.startsWith("/docs/diagnostics")}
                  href="/docs/diagnostics/"
                >
                  Diagnostics
                </a>
              </li>
            </ul>

            <p className="docs-nav-heading">Types</p>
            <ul className="docs-nav-list">
              {types.map((type) => (
                <li key={type.id}>
                  <a
                    className="docs-nav-link"
                    data-active={pathname?.startsWith(`/docs/api/${type.id}/`)}
                    href={`/docs/api/${type.id}/`}
                  >
                    {type.displayName}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
