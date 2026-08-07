/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        michroma: ['Michroma', 'sans-serif'],
        chakra: ['Chakra Petch', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
