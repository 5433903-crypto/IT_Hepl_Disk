/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        g0: '#0A0C0E',
        g1: '#101317',
        ink: '#EDE7DC',
        ink2: '#9EA5A8',
        muted: '#6C7378',
        amber: '#E8913C',
        teal: '#2E6B72',
        hair: 'rgba(237,231,220,0.13)',
        // legacy aliases kept for any remaining usage
        campus: {
          dark: '#0A0C0E',
          card: '#101317',
          cardLight: '#181D23',
          border: 'rgba(237,231,220,0.13)',
          borderLight: 'rgba(237,231,220,0.22)',
          accent: '#E8913C',
          accentHover: '#d47a28',
          amber: '#E8913C',
          rose: '#c0585f',
          emerald: '#2E6B72',
          purple: '#7a8c9e',
        }
      },
      fontFamily: {
        sans: ['Sora', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['Sora', 'monospace'],
      },
      letterSpacing: {
        label: '0.14em',
        wide: '0.12em',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
