/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    'm-0',
    'overflow-hidden',
    'text-white',
    'text-center',
    'antialiased',
    'font-sans',
    // add more if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
