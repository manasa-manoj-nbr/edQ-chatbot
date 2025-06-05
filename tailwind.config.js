/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      animation: {
        'bounce': 'bounce 3.4s infinite ease-in-out both',
      },
      colors: {
        // You can add custom colors here if needed
        'dark-bg': '#1a1a1a',
        'dark-card': '#2d2d2d',
      }
    },
  },
  plugins: [],
}