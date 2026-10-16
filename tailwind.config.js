/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
    "./backend/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
};
