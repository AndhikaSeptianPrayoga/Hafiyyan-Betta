/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#4682B4',
          light: '#87CEEB',
          dark: '#2E5984',
          rgb: '70, 130, 180',
        },
        secondary: {
          main: '#E0ECEE',
          light: '#F5F9FC',
          dark: '#6C7A89',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
