/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agent-dark': '#1a1a2e',
        'agent-blue': '#0f3460',
        'agent-accent': '#e94560'
      }
    },
  },
  plugins: [],
}