"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { SubscribeModal } from "./SubscribeModal";

type NotifyContextValue = { open: () => void };

const NotifyContext = createContext<NotifyContextValue | null>(null);

export function useNotify() {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new Error("useNotify must be used inside <NotifyProvider>");
  return ctx;
}

export function NotifyProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Bumped on every open so the modal remounts with a clean form instead of
  // showing the previous attempt's success or error state.
  const [openCount, setOpenCount] = useState(0);

  const open = useCallback(() => {
    setOpenCount((n) => n + 1);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <NotifyContext.Provider value={value}>
      {children}
      <SubscribeModal key={openCount} isOpen={isOpen} onClose={close} />
    </NotifyContext.Provider>
  );
}
