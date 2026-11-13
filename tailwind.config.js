/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbf5',
          100: '#f7f1e5',
          200: '#eddcc5',
          300: '#e0c29f',
          400: '#d0a273',
          500: '#c5874f',
          600: '#b46f41',
          700: '#945437',
          800: '#794432',
          900: '#64392c',
          dark: '#1c1b18',
        },
        sand: {
          50: '#faf8f5',
          100: '#f5efe6',
          200: '#eae0cf',
          300: '#dac8ad',
          400: '#c6ad8a',
          500: '#b4946d',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
