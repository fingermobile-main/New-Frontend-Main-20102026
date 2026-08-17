/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // FingerMobile Brand Colors
        'fm-white': '#F8FFFD',        // Crystal White - Background
        'fm-orange': '#FD5900',       // Sweet Orange - Primary Action
        'fm-blue': '#0021F3',         // Secondary Action Blue
        'fm-orange-hover': '#E54E00', // Orange hover state
        'fm-blue-hover': '#001AC2',   // Blue hover state
        'fm-gray-50': '#F9FAFB',
        'fm-gray-100': '#F3F4F6',
        'fm-gray-200': '#E5E7EB',
        'fm-gray-300': '#D1D5DB',
        'fm-gray-400': '#9CA3AF',
        'fm-gray-500': '#6B7280',
        'fm-gray-600': '#4B5563',
        'fm-gray-700': '#374151',
        'fm-gray-800': '#1F2937',
        'fm-gray-900': '#111827',
        // Add semantic color aliases for shadcn/ui compatibility
        background: '#ffffff',
        foreground: '#111827'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'fm-card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'fm-elevated': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'fm-dropdown': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
      }
    }
  },
  plugins: []
}
