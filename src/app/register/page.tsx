'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthShell } from '@/components/AuthShell';
import { Field } from '@/components/Field';
import {
  passwordScore,
  validateConfirm,
  validateEmail,
  validateHandle,
  validateName,
  validatePassword,
} from '@/lib/validation';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const errors = {
    name: validateName(name),
    handle: validateHandle(handle),
    email: validateEmail(email),
    password: validatePassword(password),
    confirm: validateConfirm(password, confirm),
  };
  const formValid = Object.values(errors).every((e) => e === null) && agreed;
  const pwStrength = passwordScore(password);

  const touchAll = () =>
    setTouched({ name: true, handle: true, email: true, password: true, confirm: true, agreed: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchAll();
    setFormError(null);
    if (!formValid) {
      if (!agreed) setFormError('Please accept the terms to continue.');
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    router.push('/dashboard');
  };

  return (
    <AuthShell
      title="Make your handle yours."
      subtitle="Set up an account in under a minute. Your handle is permanent — pick one you'd be happy to see on the side of a notebook."
      footer={
        <>
          Already on Pulse?{' '}
          <Link href="/login" className="font-semibold text-brand-300 hover:text-brand-200">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Full name"
            value={name}
            onChange={setName}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            error={errors.name}
            touched={touched.name}
            placeholder="Damika Anupama"
            autoComplete="name"
          />
          <Field
            label="Username"
            value={handle}
            onChange={(v) => setHandle(v.replace(/[^a-z0-9_]/gi, '').toLowerCase())}
            onBlur={() => setTouched((t) => ({ ...t, handle: true }))}
            error={errors.handle}
            touched={touched.handle}
            placeholder="damika"
            prefix="@"
            hint="3–20 characters"
          />
        </div>

        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={errors.email}
          touched={touched.email}
          placeholder="you@studio.com"
          autoComplete="email"
        />

        <div>
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            error={errors.password}
            touched={touched.password}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          <PasswordMeter score={pwStrength.score} label={pwStrength.label} />
        </div>

        <Field
          label="Confirm password"
          type="password"
          value={confirm}
          onChange={setConfirm}
          onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
          error={errors.confirm}
          touched={touched.confirm}
          placeholder="Type it once more"
          autoComplete="new-password"
        />

        <label className="flex cursor-pointer items-start gap-3 text-xs text-ink-muted">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              setTouched((t) => ({ ...t, agreed: true }));
            }}
            className="mt-0.5 h-4 w-4 rounded border-line bg-bg-subtle accent-brand-500"
          />
          <span>
            I've read and agree to the{' '}
            <Link href="#" className="text-ink underline-offset-4 hover:underline">
              Community Charter
            </Link>{' '}
            and the{' '}
            <Link href="#" className="text-ink underline-offset-4 hover:underline">
              Privacy Notice
            </Link>
            . Pulse will never sell your data to advertisers.
          </span>
        </label>

        {formError && (
          <div className="rounded-xl border border-accent-coral/40 bg-accent-coral/5 px-4 py-3 text-sm text-accent-coral">
            {formError}
          </div>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3 text-base">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating your account
            </>
          ) : (
            <>
              Create my Pulse <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}

function PasswordMeter({ score, label }: { score: 0 | 1 | 2 | 3 | 4; label: string }) {
  const colors = ['bg-line', 'bg-accent-coral', 'bg-accent-sun', 'bg-accent-mint', 'bg-brand-400'];
  return (
    <div className="mt-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((bar) => (
          <span
            key={bar}
            className={clsx('h-1 flex-1 rounded-full transition-colors', bar <= score ? colors[score] : 'bg-line')}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-ink-dim">
        <span>Password strength</span>
        <span className="flex items-center gap-1 text-ink-muted">
          {score >= 3 && <Check className="h-3 w-3 text-accent-mint" />}
          {label}
        </span>
      </div>
    </div>
  );
}
