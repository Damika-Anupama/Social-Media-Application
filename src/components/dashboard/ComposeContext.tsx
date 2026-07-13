'use client';

import { createContext, useCallback, useContext, useState } from 'react';

type ComposeContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
};

const Ctx = createContext<ComposeContextValue | null>(null);

export function ComposeProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // Escape-to-close and scroll lock belong to the dialog itself (useDialog, via
  // ComposeModal); opening with `n` belongs to the shortcuts layer. This context
  // only owns the open/closed bit.

  return (
    <Ctx.Provider value={{ open, setOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCompose() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      open: false,
      setOpen: () => {},
    } as ComposeContextValue;
  }
  return ctx;
}

export function useComposeOpener() {
  const { setOpen } = useCompose();
  return useCallback(() => setOpen(true), [setOpen]);
}
