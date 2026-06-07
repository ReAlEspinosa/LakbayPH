/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/data/**/*.json",
  ],
  theme: {
    extend: {
      colors: {
        ocean: '#0e6d8c',
        palm: '#2a7a3b',
        sand: '#e8b96a',
        sunset: '#d95f2b',
        coral: '#c94a6b',
        bg: '#f9f7f3',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      keyframes: {
        pulse_glow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(217,95,43,0.7)' },
          '50%': { boxShadow: '0 0 0 24px rgba(217,95,43,0)' },
        },
      },
      animation: {
        pulse_glow: 'pulse_glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
