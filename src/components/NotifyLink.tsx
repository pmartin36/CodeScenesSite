"use client";

import { useNotify } from "./NotifyProvider";

export const NOTIFY_LABEL = "Get notified";

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
