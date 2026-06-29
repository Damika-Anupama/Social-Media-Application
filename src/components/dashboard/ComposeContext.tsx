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
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;
      if (e.key === 'Escape' && open) {
        setOpen(false);
      } else if (e.key === 'n' && !open && !isTyping && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

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
