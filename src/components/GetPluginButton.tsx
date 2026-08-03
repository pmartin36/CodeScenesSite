"use client";

import { useGetPlugin } from "./GetPluginProvider";

export function GetPluginButton({
  className = "btn btn-primary",
  onActivate,
}: {
  className?: string;
  onActivate?: () => void;
}) {
  const { open } = useGetPlugin();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onActivate?.();
        open();
      }}
    >
      Get the plugin
    </button>
  );
}
