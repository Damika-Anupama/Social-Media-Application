'use client';

import clsx from 'clsx';
import { useToast } from '@/components/Toast';

/**
 * A control that is deliberately not part of the demo — and says so.
 *
 * Twelve buttons in this app had no onClick whatsoever: voice calls, attaching
 * a file, changing your avatar. Clicking them did nothing at all, silently,
 * which reads as broken rather than as out of scope. A demo is allowed to have
 * edges; it is not allowed to pretend it does not.
 *
 * Disabling them was the other option, but a disabled button explains nothing
 * either — it just refuses. Saying "voice calls aren't part of this demo" costs
 * one toast and treats the person like an adult.
 */
export function DemoButton({
  notice,
  children,
  className,
  ...rest
}: {
  /** What this would do, phrased as the reason it does not. */
  notice: string;
  children: React.ReactNode;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>) {
  const { toast } = useToast();

  return (
    <button
      type="button"
      onClick={() => toast(notice, { tone: 'info' })}
      className={clsx(className)}
      {...rest}
    >
      {children}
    </button>
  );
}
