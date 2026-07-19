import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens are driven by CSS variables (see globals.css) so the
        // whole UI re-themes (dark/light) without touching component classes.
        // <alpha-value> keeps Tailwind opacity modifiers (e.g. bg-bg/80) working.
        bg: {
          DEFAULT: 'rgb(var(--bg) / <alpha-value>)',
          subtle: 'rgb(var(--bg-subtle) / <alpha-value>)',
          raised: 'rgb(var(--bg-raised) / <alpha-value>)',
          elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
          dim: 'rgb(var(--ink-dim) / <alpha-value>)',
        },
        line: 'rgb(var(--line) / <alpha-value>)',
        brand: {
          50: '#f3f0ff',
          100: '#e6e0ff',
          // 200/300 are only ever used as text or icon fill, so they flip with
          // the theme: a pale lilac that reads on near-black is invisible on
          // white. The rest of the ramp is fixed — those are surfaces.
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: '#7c5cff',
          500: '#6435ff',
          600: '#5226e0',
          700: '#3f1bb0',
          800: '#2e1480',
          900: '#1d0c55',
        },
        accent: {
          // The accents are backgrounds as well as text (the LIVE badge is
          // bg-accent-coral), so the hue stays fixed and the *foreground*
          // variant flips instead. Using accent-coral as text on white was the
          // bug; using it as a badge behind black text is fine.
          coral: '#ff6b6b',
          mint: '#3ddbb3',
          sun: '#ffd166',
          sky: '#4cc9f0',
          'coral-fg': 'rgb(var(--accent-coral-fg) / <alpha-value>)',
          'mint-fg': 'rgb(var(--accent-mint-fg) / <alpha-value>)',
          'sun-fg': 'rgb(var(--accent-sun-fg) / <alpha-value>)',
          'sky-fg': 'rgb(var(--accent-sky-fg) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Inter', 'sans-serif'],
        display: ['ui-sans-serif', 'system-ui', '-apple-system', 'Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        pop: 'pop 0.3s ease-out',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.35)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'gradient-aurora':
          'radial-gradient(at 20% 10%, rgba(124,92,255,0.25), transparent 50%), radial-gradient(at 80% 0%, rgba(61,219,179,0.18), transparent 45%), radial-gradient(at 70% 90%, rgba(255,107,107,0.16), transparent 55%)',
        'gradient-mesh':
          'conic-gradient(from 180deg at 50% 50%, #6435ff 0deg, #3ddbb3 120deg, #ff6b6b 240deg, #6435ff 360deg)',
      },
    },
  },
  plugins: [],
};

export default config;
