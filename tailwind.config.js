/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#10B981',
        'dark-bg': '#0A0A0A',
        'dark-card': '#18181B',
        'dark-section': '#111111',
        'dark-border': '#27272A',
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
        'inter': ['Inter', 'sans-serif'],
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
