'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthShell } from '@/components/AuthShell';
import { Field } from '@/components/Field';
import { validateEmail, validatePassword } from '@/lib/validation';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const formValid = !emailError && !passwordError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setFormError(null);

    if (!formValid) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    router.push('/dashboard');
  };

  return (
    <AuthShell
      title="Welcome back."
      subtitle="Sign in to pick up where you left off. Any valid email and a password that passes our checks will let you in — this is a frontend demo."
      footer={
        <>
          New here?{' '}
          <Link href="/register" className="font-semibold text-brand-300 hover:text-brand-200">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={emailError}
          touched={touched.email}
          placeholder="you@studio.com"
          autoComplete="email"
        />

        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={passwordError}
          touched={touched.password}
          placeholder="At least 8 characters, mix of cases and a number"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-xs">
          <label className="inline-flex cursor-pointer items-center gap-2 text-ink-muted">
            <input type="checkbox" defaultChecked className="h-3.5 w-3.5 rounded border-line bg-bg-subtle accent-brand-500" />
            Stay signed in on this device
          </label>
          <Link href="/login" className="text-ink-muted hover:text-ink">
            Forgot password?
          </Link>
        </div>

        {formError && (
          <div className="rounded-xl border border-accent-coral/40 bg-accent-coral/5 px-4 py-3 text-sm text-accent-coral">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full justify-center py-3 text-base"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing you in
            </>
          ) : (
            <>
              Continue to Pulse <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="relative flex items-center gap-3 py-1 text-xs text-ink-dim">
          <span className="h-px flex-1 bg-line" />
          or continue with
          <span className="h-px flex-1 bg-line" />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <OAuthButton label="Google" />
          <OAuthButton label="Apple" />
          <OAuthButton label="Passkey" />
        </div>
      </form>
    </AuthShell>
  );
}

function OAuthButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={(e) => e.preventDefault()}
      className="rounded-xl border border-line bg-bg-raised py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-brand-400/40 hover:text-ink"
    >
      {label}
    </button>
  );
}
