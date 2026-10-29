/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', lg: '2rem' },
      screens: { '2xl': '1400px' }
    },
    extend: {
      colors: {
        /* surfaces — driven by CSS variables so light/dark swap automatically */
        ground: 'rgb(var(--k-ground) / <alpha-value>)',
        surface: 'rgb(var(--k-surface) / <alpha-value>)',
        sunken: 'rgb(var(--k-sunken) / <alpha-value>)',
        line: 'rgb(var(--k-line) / <alpha-value>)',
        'line-strong': 'rgb(var(--k-line-strong) / <alpha-value>)',

        /* foreground */
        fg: {
          DEFAULT: 'rgb(var(--k-fg) / <alpha-value>)',
          muted: 'rgb(var(--k-fg-muted) / <alpha-value>)',
          faint: 'rgb(var(--k-fg-faint) / <alpha-value>)',
        },

        /* brand — saffron on ink */
        brand: {
          DEFAULT: 'rgb(var(--k-brand) / <alpha-value>)',
          strong: 'rgb(var(--k-brand-strong) / <alpha-value>)',
          soft: 'rgb(var(--k-brand-soft) / <alpha-value>)',
          on: 'rgb(var(--k-on-brand) / <alpha-value>)',
        },

        /* fixed ink scale — same in both themes (header, footer, ink buttons) */
        ink: {
          DEFAULT: '#14182B',
          50: '#EEF0F6',
          100: '#D4D8E6',
          200: '#A6AEC8',
          300: '#7683A6',
          400: '#4E5C82',
          500: '#37436A',
          600: '#2A3149',
          700: '#1D2337',
          800: '#14182B',
          900: '#0B0E1A',
        },
        saffron: {
          50: '#FEF7EB',
          100: '#FCEBCE',
          200: '#F7D49B',
          300: '#F1BC69',
          400: '#E8A33D',
          500: '#D98A22',
          600: '#B76E19',
          700: '#8F5416',
          800: '#6A3E15',
          900: '#472B11',
        },

        /* semantic */
        positive: {
          DEFAULT: 'rgb(var(--k-positive) / <alpha-value>)',
          soft: 'rgb(var(--k-positive-soft) / <alpha-value>)',
        },
        critical: {
          DEFAULT: 'rgb(var(--k-critical) / <alpha-value>)',
          soft: 'rgb(var(--k-critical-soft) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '1.125rem',
        pill: '999px',
      },
      boxShadow: {
        card: '0 1px 2px rgb(var(--k-shadow) / 0.06), 0 8px 24px -12px rgb(var(--k-shadow) / 0.18)',
        lift: '0 2px 6px rgb(var(--k-shadow) / 0.08), 0 18px 40px -18px rgb(var(--k-shadow) / 0.35)',
        pop: '0 24px 60px -20px rgb(var(--k-shadow) / 0.45)',
        inset: 'inset 0 1px 0 rgb(255 255 255 / 0.06)',
      },
      backgroundImage: {
        'ink-grade': 'linear-gradient(135deg, #14182B 0%, #1D2337 55%, #2A3149 100%)',
        'saffron-grade': 'linear-gradient(120deg, #F1BC69 0%, #E8A33D 50%, #D98A22 100%)',
        'grain': "radial-gradient(circle at 1px 1px, rgb(var(--k-fg) / 0.14) 1px, transparent 0)",
      },
      keyframes: {
        'rise': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'sweep': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        rise: 'rise .35s ease-out both',
        sweep: 'sweep 1.6s linear infinite',
        'slide-in': 'slide-in .28s cubic-bezier(.22,1,.36,1) both',
      },
    },
  },
  plugins: [],
}
