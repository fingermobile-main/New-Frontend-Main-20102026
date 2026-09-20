FingerMobile Forum Layout & Dimensions Specification
This document provides a visual and structural breakdown of the FingerMobile Forum layout, focusing on the headers, sidebars, and main content areas. You can use this diagram to understand the current dimensions and Tailwind CSS classes being applied, allowing you to easily adjust them as needed.

Structural Overview (3-Column Architecture)
ForumLayout.tsx (max-w-7xl, mx-auto)
ForumLeftSidebar.tsxw-64 (256px)Sticky left
Center Feed (ForumPage.tsx)flex-1 (Fluid width)Min Height: min-h-screen
ForumRightSidebar.tsxw-80 (320px)Sticky right
ForumHeader.tsx (Fixed Top)
Brand Logotext-2xl
Search Barw-96 (384px)
Profile/Iconsw-9, h-9 (36px)
Current Dimension Definitions (Tailwind Classes)
Here are the specific dimensions currently driving the FingerMobile iconic design. You can modify these directly in the respective .tsx components:

1. ForumHeader.tsx (Top Navigation)
Position: fixed top-0 left-0 right-0 (Stays anchored to the top)
Height: h-16 (64 pixels)
Z-Index: z-50 (Always on top of the feed and sidebars)
Padding: px-6 (24px horizontal padding)
Search Bar Width: w-96 (384 pixels)
2. ForumLayout.tsx (The Wrapper)
Container Max Width: max-w-7xl (1280 pixels max width centered on large screens)
Top Padding: pt-16 mt-4 (Leaves 64px space for the fixed header + 16px extra margin)
Structure: flex flex-col md:flex-row (Stacks on mobile, horizontal on desktop)
3. ForumLeftSidebar.tsx (Navigation Sidebar)
Width: w-64 (256 pixels)
Positioning: Sticky under the header (top-24)
4. ForumPage.tsx (Center Feed)
Width: flex-1 (Fluid width, takes up all remaining space between the sidebars)
Container Padding: p-4 (16 pixels internal padding)
Spacing Between Posts/Components: space-y-6 or space-y-8 (24px or 32px vertical gaps)
5. ForumRightSidebar.tsx (Trending & Communities)
Width: w-80 (320 pixels)
Visibility: hidden lg:block (Only visible on large screens)
Positioning: Sticky under the header (top-24)
How to Edit Dimensions
To edit these sizes, simply change the Tailwind utility classes in your components.

Common Size Conversions:

h-16 = 64px
h-20 = 80px
w-64 = 256px
w-72 = 288px
w-80 = 320px
max-w-7xl = 1280px
max-w-full = 100% width
If you want the layout to be wider (e.g., span the entire screen), you can change max-w-7xl in ForumLayout.tsx to max-w-full px-8. If you want a taller header, change h-16 to h-20 in ForumHeader.tsx and adjust the pt-16 in ForumLayout.tsx to pt-20 to compensate!