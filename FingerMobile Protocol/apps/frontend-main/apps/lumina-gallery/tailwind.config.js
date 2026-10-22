/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'sans-serif']
      },
      colors: {
        'neon-gold': '#FFD700',
        'neon-blue': '#00F0FF',
        'neon-purple': '#BC13FE',
        'dark-bg': '#050505'
      }
    }
  },
  plugins: []
};