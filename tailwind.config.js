/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Boost low-end grays so legacy code won't disappear on white
        gray: {
          300: '#94a3b8',
          400: '#64748b', // Shifted from faint slate to readable mid-tone
          500: '#475569', // Passes 4.5:1 WCAG AA on white
          600: '#334155', // Passes 7:1 WCAG AAA
          700: '#1e293b',
        },
        slate: {
          400: '#64748b',
          500: '#475569',
          600: '#334155',
        },
        zinc: {
          400: '#71717a',
          500: '#52525b',
          600: '#3f3f46',
        },
        'lush-primary': '#4F46E5', // Indigo color for primary actions
        'lush-secondary': '#EC4899', // Pink color for accents
        'lush-success': '#10B981', // Green for success states
        'lush-warning': '#F59E0B', // Amber for warnings
        'lush-error': '#EF4444', // Red for errors
        'lush-bg': '#F9FAFB', // Light gray background
        'lush-card': '#FFFFFF', // White cards
        'lush-text': '#1F2937', // Dark gray text
        'lush-border': '#E5E7EB', // Light gray borders
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}