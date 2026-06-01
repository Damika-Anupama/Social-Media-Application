import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#07070b',
          subtle: '#0d0d14',
          raised: '#13131c',
          elevated: '#1a1a24',
        },
        ink: {
          DEFAULT: '#f5f5fa',
          muted: '#a7a7b8',
          dim: '#6e6e80',
        },
        line: '#22222e',
        brand: {
          50: '#f3f0ff',
          100: '#e6e0ff',
          200: '#c9bfff',
          300: '#a18cff',
          400: '#7c5cff',
          500: '#6435ff',
          600: '#5226e0',
          700: '#3f1bb0',
          800: '#2e1480',
          900: '#1d0c55',
        },
        accent: {
          coral: '#ff6b6b',
          mint: '#3ddbb3',
          sun: '#ffd166',
          sky: '#4cc9f0',
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
      },
      keyframes: {
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
