"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { GetPluginModal } from "./GetPluginModal";

type GetPluginContextValue = { open: () => void };

const GetPluginContext = createContext<GetPluginContextValue | null>(null);

export function useGetPlugin() {
  const ctx = useContext(GetPluginContext);
  if (!ctx) throw new Error("useGetPlugin must be used inside <GetPluginProvider>");
  return ctx;
}

export function GetPluginProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <GetPluginContext.Provider value={value}>
      {children}
      <GetPluginModal isOpen={isOpen} onClose={close} />
    </GetPluginContext.Provider>
  );
}
