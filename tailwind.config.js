/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
    "./backend/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0f2b44',
        },
        primary: {
          DEFAULT: '#2376b8',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f2b44',
        },
        brand: {
          blue: {
            DEFAULT: '#2376b8',
            light: '#3b8ecf',
            dark: '#1b5d92',
            deep: '#0f2b44',
            surface: '#f0f6fb',
          },
          orange: {
            DEFAULT: '#f87b1f',
            light: '#fb994b',
            dark: '#d9620b',
            surface: '#fff7ed',
          },
          green: {
            DEFAULT: '#89b441',
            light: '#a1c95b',
            dark: '#6e9331',
            surface: '#f4f8ee',
          },
          navy: '#0f2b44',
          'navy-light': '#164366',
          'navy-dark': '#0a1d2e',
          gold: '#f87b1f',
          'gold-light': '#fb994b',
          'gold-dark': '#d9620b',
          bg: '#f8fafc',
          surface: '#FFFFFF',
          muted: '#64748B',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ["'IBM Plex Serif'", 'Georgia', 'serif'],
        serif: ["'IBM Plex Serif'", 'Georgia', 'serif'],
      },
      animation: {
        marquee: 'marquee var(--duration, 30s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--duration, 30s) linear infinite',
      },
      keyframes: {
        marquee: {
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          to: { transform: 'translateX(50%)' },
        },
      },
    },
  },
  plugins: [],
};
