'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState, useId } from 'react';
import clsx from 'clsx';

type FieldProps = {
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (next: string) => void;
  onBlur?: () => void;
  error?: string | null;
  touched?: boolean;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
  prefix?: string;
};

export function Field({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  autoComplete,
  hint,
  prefix,
}: FieldProps) {
  const [show, setShow] = useState(false);
  const id = useId();
  const isPassword = type === 'password';
  const effectiveType = isPassword && show ? 'text' : type;
  const showError = touched && !!error;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
          {label}
        </label>
        {hint && !showError && <span className="text-xs text-ink-dim">{hint}</span>}
      </div>
      <div
        className={clsx(
          // Padding belongs on the input, not on this box: a tap on the box's
          // padding does nothing, so the real target was only 20px tall.
          'mt-2 flex items-center gap-2 rounded-xl border bg-bg-subtle px-4 transition-all',
          'focus-within:ring-2 focus-within:ring-brand-500/20',
          showError
            ? 'border-accent-coral/60 focus-within:border-accent-coral'
            : 'border-line focus-within:border-brand-400/50',
        )}
      >
        {prefix && <span className="text-sm text-ink-dim">{prefix}</span>}
        <input
          id={id}
          type={effectiveType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-transparent py-3 text-sm text-ink placeholder:text-ink-dim focus:outline-none"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="rounded-md p-1 text-ink-dim transition-colors hover:text-ink"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {showError && <p className="mt-2 text-xs text-accent-coral-fg">{error}</p>}
    </div>
  );
}
