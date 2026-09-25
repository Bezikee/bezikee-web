/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#10B981',
        'dark-bg': 'rgba(10, 10, 10, 0.85)',
        'dark-card': 'rgba(24, 24, 27, 0.9)',
        'dark-section': 'rgba(17, 17, 17, 0.85)',
        'dark-border': '#27272A',

        // Admin panel tokens. Defined as CSS variables in app/admin/admin.css and only set
        // under .admin-theme, so they mean nothing on the marketing pages. RGB channels rather
        // than hex, so opacity modifiers like bg-good/10 work.
        surface: 'rgb(var(--admin-surface) / <alpha-value>)',
        card: 'rgb(var(--admin-card) / <alpha-value>)',
        'card-muted': 'rgb(var(--admin-card-muted) / <alpha-value>)',
        line: 'rgb(var(--admin-border) / <alpha-value>)',
        'line-strong': 'rgb(var(--admin-border-strong) / <alpha-value>)',
        ink: 'rgb(var(--admin-text) / <alpha-value>)',
        'ink-secondary': 'rgb(var(--admin-text-secondary) / <alpha-value>)',
        'ink-muted': 'rgb(var(--admin-text-muted) / <alpha-value>)',
        accent: 'rgb(var(--admin-accent) / <alpha-value>)',
        'accent-hover': 'rgb(var(--admin-accent-hover) / <alpha-value>)',
        'accent-soft': 'rgb(var(--admin-accent-soft) / <alpha-value>)',
        'accent-ink': 'rgb(var(--admin-accent-ink) / <alpha-value>)',
        good: 'rgb(var(--admin-good) / <alpha-value>)',
        warning: 'rgb(var(--admin-warning) / <alpha-value>)',
        serious: 'rgb(var(--admin-serious) / <alpha-value>)',
        critical: 'rgb(var(--admin-critical) / <alpha-value>)',
        track: 'rgb(var(--admin-track) / <alpha-value>)',
        grid: 'rgb(var(--admin-grid) / <alpha-value>)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(16, 185, 129, 0.3)',
        'neon-md': '0 0 30px rgba(16, 185, 129, 0.4)',
        'neon-lg': '0 0 40px rgba(16, 185, 129, 0.5)',
        'neon-xl': '0 0 50px rgba(16, 185, 129, 0.6)',
        'neon-btn': '0 0 20px rgba(16, 185, 129, 0.6)',
        'neon-btn-hover': '0 0 35px rgba(16, 185, 129, 0.8)',
      },
      fontFamily: {
        'inter': ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'counter-spin': 'counter-spin 30s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'counter-spin': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)', opacity: '0.3' },
          '50%': { transform: 'translateY(-20px)', opacity: '0.8' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'glow': {
          from: { boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' },
          to: { boxShadow: '0 0 40px rgba(16, 185, 129, 0.8)' },
        },
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
}
