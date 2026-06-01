'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type ComposeContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
};

const Ctx = createContext<ComposeContextValue | null>(null);

export function ComposeProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>;
}

export function useCompose() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return { open: false, setOpen: () => {} } as ComposeContextValue;
  }
  return ctx;
}

export function useComposeOpener() {
  const { setOpen } = useCompose();
  return useCallback(() => setOpen(true), [setOpen]);
}
