/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        display: ['"Syne"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        industrial: {
          950: '#070708',
          900: '#0c0d0e',
          850: '#121316',
          800: '#1b1d22',
          700: '#282b32',
          600: '#3c404b',
          500: '#585e6e',
          400: '#838b9e',
          300: '#b2b9c7',
          200: '#d7dbe3',
          100: '#f0f2f5',
        },
        kinetic: {
          cyan: '#00f0ff',
          lime: '#c8ff00',
          orange: '#ff5500',
          purple: '#8a2be2',
        },
      },
      letterSpacing: {
        tighter: '-0.05em',
        widest: '0.25em',
        ultra: '0.35em',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      animation: {
        'marquee-slow': 'marquee 25s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
}
