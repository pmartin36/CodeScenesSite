"use client";

import { track, type CtaSource } from "@/lib/analytics";
import { useGetPlugin } from "./GetPluginProvider";

export function GetPluginButton({
  source,
  className = "btn btn-primary",
  onActivate,
}: {
  source: CtaSource;
  className?: string;
  onActivate?: () => void;
}) {
  const { open } = useGetPlugin();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        track("cta_clicked", { cta: "get_plugin", source });
        onActivate?.();
        open();
      }}
    >
      Get the plugin
    </button>
  );
}
