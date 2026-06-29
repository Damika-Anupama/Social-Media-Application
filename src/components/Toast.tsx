'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Check, Info, Undo2, X } from 'lucide-react';
import clsx from 'clsx';

type ToastTone = 'success' | 'info';

type Toast = {
  id: number;
  message: string;
  tone: ToastTone;
  action?: { label: string; onClick: () => void };
};

type ToastOptions = {
  tone?: ToastTone;
  duration?: number;
  action?: { label: string; onClick: () => void };
};

type ToastContextValue = {
  toast: (message: string, options?: ToastOptions) => void;
};

const Ctx = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 3200;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, options?: ToastOptions) => {
      const id = nextId.current++;
      const tone = options?.tone ?? 'success';
      setToasts((current) => {
        // Cap the stack so a burst of actions can't bury the screen.
        const next = [...current, { id, message, tone, action: options?.action }];
        return next.slice(-3);
      });
      const duration = options?.duration ?? DEFAULT_DURATION;
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss],
  );

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </Ctx.Provider>
  );
}

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const Icon = toast.tone === 'success' ? Check : Info;
  const iconTone = toast.tone === 'success' ? 'text-accent-mint' : 'text-brand-300';

  return (
    <div className="motion-safe:animate-fade-up pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-line bg-bg-raised/95 px-4 py-3 text-sm text-ink shadow-2xl shadow-black/30 backdrop-blur">
      <span className={clsx('shrink-0', iconTone)}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1 truncate">{toast.message}</span>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action!.onClick();
            onDismiss();
          }}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line bg-bg-subtle px-2.5 py-1 text-xs font-semibold text-ink-muted transition-colors hover:text-ink"
        >
          <Undo2 className="h-3 w-3" />
          {toast.action.label}
        </button>
      )}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="btn-icon h-7 w-7 shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // No provider (e.g. isolated render) — degrade to a no-op rather than crash.
    return { toast: () => {} } as ToastContextValue;
  }
  return ctx;
}
