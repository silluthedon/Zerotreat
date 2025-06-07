/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#f8f1e9',
          100: '#e8d9c5',
          500: '#8b5e3c',
          600: '#7a4f34',
        },
      },
    },
  },
  plugins: [],
};