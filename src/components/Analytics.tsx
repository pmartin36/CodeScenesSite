"use client";

import { useEffect } from "react";
import {
  SECTION_IDS,
  currentSection,
  initAnalytics,
  isAnalyticsEnabled,
  scrollPct,
  track,
  type SectionId,
} from "@/lib/analytics";

export function Analytics() {
  useEffect(() => {
    initAnalytics();
    if (!isAnalyticsEnabled()) return;

    let maxScroll = scrollPct();
    const seen = new Set<SectionId>();
    const active = new Set<SectionId>();
    const enteredAt = new Map<SectionId, number>();
    const dwellMs = new Map<SectionId, number>();

    const stopDwell = (id: SectionId, now: number) => {
      const from = enteredAt.get(id);
      if (from === undefined) return;
      dwellMs.set(id, (dwellMs.get(id) ?? 0) + (now - from));
      enteredAt.delete(id);
    };

    const onScroll = () => {
      const pct = scrollPct();
      if (pct > maxScroll) maxScroll = pct;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // The middle band of the viewport is what counts as "being read". Using a
    // ratio instead would never fire for sections taller than the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now();
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          if (entry.isIntersecting) {
            active.add(id);
            if (!enteredAt.has(id)) enteredAt.set(id, now);
            if (!seen.has(id)) {
              seen.add(id);
              track("section_viewed", { section_id: id });
            }
          } else {
            active.delete(id);
            stopDwell(id, now);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    // Cumulative, and sent on every hide rather than once, so a visitor who tabs
    // away and comes back is not truncated at their first exit.
    const report = () => {
      const now = Date.now();
      for (const id of Array.from(enteredAt.keys())) stopDwell(id, now);

      const dwell: Record<string, number> = {};
      for (const [id, ms] of dwellMs) dwell[`dwell_${id}_s`] = Math.round(ms / 1000);

      track(
        "page_engagement",
        {
          max_scroll_pct: maxScroll,
          last_section: currentSection(),
          sections_viewed: seen.size,
          ...dwell,
        },
        { beacon: true },
      );
    };

    const onVisibility = () => {
      const now = Date.now();
      if (document.visibilityState === "hidden") {
        report();
      } else {
        for (const id of active) if (!enteredAt.has(id)) enteredAt.set(id, now);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    // Safari on iOS does not always fire visibilitychange on navigation away.
    window.addEventListener("pagehide", report);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", report);
      observer.disconnect();
    };
  }, []);

  return null;
}
