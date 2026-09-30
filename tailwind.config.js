/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class', // Enable dark mode using the 'class' strategy with options for system settings
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
        // HTML Template Compatibility
        'brand-blue': '#0021F3',
        'dark-card': '#1a202c',
        // STERCS Dynamic Theme Colors
        'stercs-primary': 'var(--stercs-primary, #3b82f6)',
        'stercs-secondary': 'var(--stercs-secondary, #10b981)',
        // Crystalline White theme colors
        'crystalline-white': 'hsl(240, 2%, 98%)', // Crystalline white background
        'crystalline-white-50': 'hsl(240, 2%, 99%)', // Lighter crystalline shade
        'crystalline-white-100': 'hsl(240, 2%, 97%)', // Slightly darker crystalline shade
        // Semantic color aliases for Shadcn/UI compatibility mapped to CSS variables
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'stercs': ['var(--stercs-font, Inter)', 'sans-serif'],
      },
      borderRadius: {
        'stercs': 'var(--stercs-radius, 0.5rem)',
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