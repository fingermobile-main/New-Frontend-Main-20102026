I HAVE THIS PROBLEM 

All over the platform you used gray as font style color and they are invisible on the white boxes or when used as descriptions etc.
we have some issues with the gray test modifying color codes 
or classes applied to text elements is important, as the core issue is a color contrast problem where gray text are illegible against a white backgrounds. 

The illegibility stems from two specific flaws in your current setup:

1.     text-muted-foreground and standard Tailwind shades are failing contrast: In your :root, --muted-foreground is set to 215.4 16.3% 46.9% (which renders around #64748b or #6b7280). On a white background (#ffffff), this barely clears large text and fails standard body text contrast standards. Furthermore, Tailwind classes like text-gray-300, text-gray-400, and text-slate-400 have contrast ratios as low as 1.5:1 to 2.5:1 on white.
2.     Fragile and conflicting CSS overrides: The massive list of .bg-white .text-gray-* and [class*="bg-white"] rules attempts to force everything to #1a1a2e or #0f172a using !important. These rules:
    ⚬         Only match when an ancestor explicitly has bg-white or bg-gray-50 written in its exact class list. They fail on native elements inheriting the card/body color, elements wrapped in React components without direct background classes, or elements using custom background utilities.
    ⚬         Flatten your entire visual hierarchy into jet-black text, removing all distinction between primary text and secondary/description text.

Here is the clean, robust solution.

Step 1: Fix Core Variables in globals.css

Update your HSL design tokens in :root so that muted text has at least a 5.5:1 to 7:1 contrast ratio against crystalline white (#fafafa / #ffffff), while remaining visibly distinct from headers and primary text:


@layer base {
  :root {
    /* Crystalline White Background */
    --background: 240 2% 98%;
    --foreground: 222.2 84% 4.9%;        /* #020617 - Deep readable black */
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 24 96% 53%;
    --primary-foreground: 0 0% 100%;
    --secondary: 227 100% 47%;
    --secondary-foreground: 0 0% 100%;

    /* FIXED: Adjusted muted-foreground from 46.9% lightness down to 32% */
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 25% 32%;    /* #3d4a5d (~7:1 contrast on white) */

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 24 96% 53%;
    --radius: 0.5rem;
  }
}


Step 2: Remap Washed-Out Tailwind Grays in tailwind.config.js

Instead of writing hundreds of brittle .bg-white .text-gray-* overrides, remap light gray text utilities at the Tailwind level so any low-contrast gray used for body/descriptions automatically renders dark enough on light backgrounds:


// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
        }
      }
    }
  }
}


Step 3: Replace the Global Override Block in CSS

Replace the massive chain of overrides (.bg-white .text-gray-300, [class*="bg-white"] ...) with this compact, targeted set of rules. This preserves visual hierarchy (secondary text looks secondary, but never invisible) without breaking dark mode:


@layer utilities {
  /* Enforce readable muted colors in light mode regardless of container nesting */
  html:not(.dark):not(.black-theme) {
    /* Baseline colors for faint utility classes on light backgrounds */
    .text-gray-400,
    .text-slate-400,
    .text-zinc-400,
    .text-neutral-400 {
      color: #4b5563 !important; /* Gray-600: 4.6:1 contrast ratio */
    }

    .text-gray-500,
    .text-slate-500,
    .text-zinc-500,
    .text-neutral-500 {
      color: #374151 !important; /* Gray-700: 6.8:1 contrast ratio */
    }

    /* Subtitles, labels, and small descriptions */
    .text-muted-foreground {
      color: hsl(var(--muted-foreground)) !important;
    }
  }

  /* Form controls */
  html:not(.dark):not(.black-theme) input,
  html:not(.dark):not(.black-theme) textarea,
  html:not(.dark):not(.black-theme) select {
    color: #111827;
  }

  html:not(.dark):not(.black-theme) input::placeholder,
  html:not(.dark):not(.black-theme) textarea::placeholder {
    color: #6b7280; /* Gray-500: readable placeholder */
  }
}


Contrast Reference Guide for Your Components

When writing markup or refactoring existing cards:

Role
Tailwind Class
Resulting Color
Contrast on #ffffff
WCAG Status
Primary Titles / Headings
text-foreground or text-gray-900
#0f172a
15.9:1
AAA (Pass)
Body Content
text-gray-800 or text-gray-700
#334155
8.8:1
AAA (Pass)
Descriptions / Captions
text-muted-foreground or text-gray-600
#475569
5.5:1
AA (Pass)
Placeholders / Inactive Icons
text-gray-400 (remapped)
#64748b
4.5:1
AA (Pass)
