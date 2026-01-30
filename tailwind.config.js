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
    },
  },
  plugins: [],
}
