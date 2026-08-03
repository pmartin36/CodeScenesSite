"use client";

import { useNotify } from "./NotifyProvider";

export const NOTIFY_LABEL = "Get notified";

// One wording for what subscribing gets you, shared by every surface that asks.
// Covers launch and after it, so it does not go stale the day the plugin ships.
export const NOTIFY_PROMISE =
  "One message when it ships, plus occasional updates after.";

export function NotifyLink({
  className = "link-quiet",
  onActivate,
}: {
  className?: string;
  onActivate?: () => void;
}) {
  const { open } = useNotify();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onActivate?.();
        open();
      }}
    >
      {NOTIFY_LABEL}
    </button>
  );
}
