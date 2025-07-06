/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#f8f1e9',
          100: '#e8d9c5',
          500: '#8b5e3c',
          600: '#7a4f34',
        },
        dark: {
          background: '#1a1a1a',
          text: '#e0e0e0',
          accent: '#bb86fc',
        },
      },
    },
  },
  plugins: [],
};