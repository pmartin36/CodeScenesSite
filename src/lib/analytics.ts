import posthog from "posthog-js";
import { CHANNELS_COMING_SOON } from "./site";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

// Section ids in document order. Drives both the section observer and the
// `section` property stamped on every event.
export const SECTION_IDS = ["top", "how", "features", "compare", "help", "sources"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export type AnalyticsEvent =
  | "cta_clicked"
  | "plugin_modal_viewed"
  | "subscribe_modal_viewed"
  | "subscribe_typing_started"
  | "subscribe_submitted"
  | "subscribe_completed"
  | "subscribe_failed"
  | "install_url_copied"
  | "outbound_clicked"
  | "section_viewed"
  | "page_engagement"
  | "hero_video_started"
  | "hero_video_progressed"
  | "hero_video_unavailable";

// Where a CTA was rendered. Both CTAs appear in several places with identical
// labels, so without this every placement collapses into one bucket.
export type CtaSource =
  | "hero"
  | "header"
  | "mobile_menu"
  | "plugin_modal";

let ready = false;
let pageStart = 0;

export function isAnalyticsEnabled() {
  return ready;
}

export function initAnalytics() {
  if (ready || typeof window === "undefined" || !KEY) return;

  posthog.init(KEY, {
    api_host: HOST,
    // No cookie and no localStorage, so the site stays outside the ePrivacy
    // consent rule. Costs cross-session identity: a reload is a new person.
    persistence: "memory",
    person_profiles: "identified_only",
    disable_session_recording: true,
    capture_pageview: true,
    capture_pageleave: true,
  });

  pageStart = Date.now();
  ready = true;
}

function scrollPct() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100)));
}

function currentSection(): SectionId | undefined {
  const mid = window.innerHeight / 2;
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.top <= mid && r.bottom >= mid) return id;
  }
  return undefined;
}

function secondsOnPage() {
  return pageStart ? Math.round((Date.now() - pageStart) / 1000) : 0;
}

/**
 * Every event carries where the visitor was and what the site was selling at the
 * time. Stamped here rather than at each call site so a new caller cannot forget
 * it, and so pre-launch and post-launch data never merge silently.
 */
export function track(
  event: AnalyticsEvent,
  props: Record<string, unknown> = {},
  options?: { beacon?: boolean },
) {
  if (!ready) return;

  posthog.capture(
    event,
    {
      ...props,
      section: currentSection(),
      scroll_pct: scrollPct(),
      seconds_on_page: secondsOnPage(),
      channels_coming_soon: CHANNELS_COMING_SOON,
    },
    options?.beacon ? { transport: "sendBeacon" } : undefined,
  );
}

export { scrollPct, currentSection };
