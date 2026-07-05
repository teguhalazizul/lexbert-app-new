/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        navy: {
          950: '#050d1f',
          900: '#0a1834',
          800: '#0f2648',
          700: '#17335e',
          600: '#1f3f70',
          500: '#2b5090',
        },
        gold: {
          300: '#ecdca0',
          400: '#d4b355',
          500: '#c9a227',
          600: '#a9841e',
        },
      },
    },
  },
  plugins: [],
}