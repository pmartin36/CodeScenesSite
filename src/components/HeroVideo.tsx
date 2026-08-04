"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

const MILESTONES = [25, 50, 75, 100] as const;

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Reduced motion hides the video by CSS and shows the poster instead, so
    // these visitors never see the demo at all. Worth counting rather than
    // silently reading as "did not watch".
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track("hero_video_unavailable", { reason: "reduced_motion" });
      return;
    }

    let started = false;
    let firstLoopDone = false;
    let lastTime = 0;
    const hit = new Set<number>();

    const onPlaying = () => {
      if (started) return;
      started = true;
      track("hero_video_started");
    };

    // The video autoplays on a loop, so raw milestones would refire forever and
    // play rate would always be 100%. Only the first pass says anything about
    // whether a visitor actually watched.
    const onTimeUpdate = () => {
      if (el.currentTime < lastTime) firstLoopDone = true;
      lastTime = el.currentTime;
      if (firstLoopDone || !el.duration || !isFinite(el.duration)) return;

      const pct = (el.currentTime / el.duration) * 100;
      for (const m of MILESTONES) {
        if (pct >= m && !hit.has(m)) {
          hit.add(m);
          track("hero_video_progressed", { percent: m });
        }
      }
    };

    el.addEventListener("playing", onPlaying);
    el.addEventListener("timeupdate", onTimeUpdate);

    // Autoplay is refused on some browsers and data-saver setups. If nothing has
    // played by now, the demo did not run for this visitor.
    const blockedCheck = window.setTimeout(() => {
      if (!started) track("hero_video_unavailable", { reason: "autoplay_blocked" });
    }, 4000);

    return () => {
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("timeupdate", onTimeUpdate);
      window.clearTimeout(blockedCheck);
    };
  }, []);

  return (
    <div className="video-frame video-frame--wide">
      <video
        ref={videoRef}
        className="video-frame__media video-frame__video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero-demo-poster.webp"
        aria-label="CodeScenes keeping a C# scene builder and the Unity Editor in two-way sync"
      >
        <source src="/hero-demo.mp4" type="video/mp4" />
      </video>
      <img
        className="video-frame__media video-frame__still"
        src="/hero-demo-poster.webp"
        alt="CodeScenes keeping a C# scene builder and the Unity Editor in two-way sync"
      />
    </div>
  );
}
