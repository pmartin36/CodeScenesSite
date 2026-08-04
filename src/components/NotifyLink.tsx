"use client";

import { track, type CtaSource } from "@/lib/analytics";
import { useNotify } from "./NotifyProvider";

export const NOTIFY_LABEL = "Get notified";

// One wording for what subscribing gets you, shared by every surface that asks.
// Covers launch and after it, so it does not go stale the day the plugin ships.
export const NOTIFY_PROMISE =
  "One message when it ships, plus occasional updates after.";

export function NotifyLink({
  source,
  className = "link-quiet",
  onActivate,
}: {
  source: CtaSource;
  className?: string;
  onActivate?: () => void;
}) {
  const { open } = useNotify();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        track("cta_clicked", { cta: "notify", source });
        onActivate?.();
        open();
      }}
    >
      {NOTIFY_LABEL}
    </button>
  );
}
