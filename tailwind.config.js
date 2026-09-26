/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./js/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#F9F8F6',
          100: '#F3F0EB',
          200: '#E6E1D6',
          300: '#D5CDBF',
          400: '#B8AB94',
          500: '#9E8E72',
          600: '#847459',
          700: '#6A5B44',
          800: '#524532',
          900: '#3D3223',
          DEFAULT: '#9E8E72',
        },
        slate: {
          850: '#14171C',
          950: '#0B0D10',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
