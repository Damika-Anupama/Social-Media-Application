export type FieldError = string | null;

export const validateEmail = (value: string): FieldError => {
  const trimmed = value.trim();
  if (!trimmed) return 'Email is required.';
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
  return ok ? null : 'Enter a valid email address.';
};

export const validatePassword = (value: string): FieldError => {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (!/[a-z]/.test(value)) return 'Include at least one lowercase letter.';
  if (!/[A-Z]/.test(value)) return 'Include at least one uppercase letter.';
  if (!/\d/.test(value)) return 'Include at least one number.';
  return null;
};

export const validateName = (value: string): FieldError => {
  const trimmed = value.trim();
  if (!trimmed) return 'Full name is required.';
  if (trimmed.length < 2) return 'Name looks too short.';
  if (!/^[\p{L}\p{M}'’\-\s.]+$/u.test(trimmed)) return 'Use letters, spaces, hyphens or apostrophes only.';
  return null;
};

export const validateHandle = (value: string): FieldError => {
  const trimmed = value.trim().replace(/^@/, '');
  if (!trimmed) return 'Choose a username.';
  if (trimmed.length < 3) return 'At least 3 characters.';
  if (trimmed.length > 20) return 'At most 20 characters.';
  if (!/^[a-z0-9_]+$/i.test(trimmed)) return 'Letters, numbers and underscores only.';
  return null;
};

export const validateConfirm = (password: string, confirm: string): FieldError => {
  if (!confirm) return 'Please confirm your password.';
  if (password !== confirm) return "Passwords don't match.";
  return null;
};

export const passwordScore = (value: string): { score: 0 | 1 | 2 | 3 | 4; label: string } => {
  if (!value) return { score: 0, label: 'Empty' };
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  if (value.length >= 14) score = Math.min(4, score + 1);
  const label = ['Empty', 'Weak', 'Fair', 'Strong', 'Excellent'][score] || 'Empty';
  return { score: score as 0 | 1 | 2 | 3 | 4, label };
};
